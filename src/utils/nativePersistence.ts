import { registerPlugin, Capacitor } from '@capacitor/core';
import { getProfileItem, setProfileItem, getActiveProfile } from './profileStorage';
import { FitbodRawLogEntry, FitbodCsvParseResult } from '../engine/fitbodEngine';

interface NativeStoragePluginInterface {
  writeDocumentFile(options: { name: string; content: string }): Promise<{ success: boolean; path?: string; error?: string }>;
  readDocumentFile(options: { name: string }): Promise<{ success: boolean; content?: string; error?: string }>;
  listDocumentFiles(): Promise<{ success: boolean; files?: string[] }>;
  writePreference(options: { key: string; value: string }): Promise<{ success: boolean; error?: string }>;
  readPreference(options: { key: string }): Promise<{ success: boolean; value?: string; error?: string }>;
}

export const NativeStorage = registerPlugin<NativeStoragePluginInterface>('NativeStorage');

export interface StorageScanItem {
  source: 'localStorage' | 'iOS Documents' | 'iOS Preferences';
  key: string;
  count: number;
  dateSample: string;
  data: any;
}

const BACKUP_FILE_NAME = 'fitbod_backup_latest.json';
const LOGS_FILE_NAME = 'fitbod_workout_log.json';
const CSV_FILE_NAME = 'Fitbod_WorkoutExport_Auto.csv';

/**
 * Thu thập toàn bộ dữ liệu ứng dụng hiện tại để sao lưu
 */
export const collectCurrentAppData = () => {
  const activeProfile = getActiveProfile();
  const keysToSave = [
    'fitbod_user_profiles',
    'fitbod_active_profile_id',
    'fitbod_goal',
    'fitbod_split',
    'fitbod_duration',
    'fitbod_equipment',
    'fitbod_warmup',
    'fitbod_cardio_type',
    'fitbod_cardio_duration',
    'fitbod_target_muscles',
    'fitbod_exercise_history',
    'fitbod_exercise_preferences',
    'fitbod_available_machines',
    'fitbod_equipment_preference',
    'fitbod_body_profile',
    'fitbod_base_recovery',
    'fitbod_recovery',
    'fitbod_last_trained_time',
    'fitbod_stats_cache',
    'fitbod_workout_log'
  ];

  const storageData: Record<string, string | null> = {};
  keysToSave.forEach(k => {
    storageData[k] = getProfileItem(k);
  });

  // Lưu thêm các key thô trực tiếp từ localStorage (phòng trường hợp đa profile)
  const rawLocalStorageDump: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('fitbod_')) {
        const val = localStorage.getItem(k);
        if (val) rawLocalStorageDump[k] = val;
      }
    }
  } catch (e) {}

  let rawLogs: FitbodRawLogEntry[] = [];
  try {
    const rawLogsStr = getProfileItem('fitbod_workout_log');
    if (rawLogsStr) rawLogs = JSON.parse(rawLogsStr);
  } catch (e) {}

  let stats: FitbodCsvParseResult | null = null;
  try {
    const statsStr = getProfileItem('fitbod_stats_cache');
    if (statsStr) stats = JSON.parse(statsStr);
  } catch (e) {}

  return {
    version: '2.0',
    timestamp: new Date().toISOString(),
    profile: activeProfile,
    localStorageData: storageData,
    rawLocalStorageDump,
    rawLogsCount: rawLogs.length,
    stats,
    rawLogs
  };
};

/**
 * Tạo nội dung CSV chuẩn Fitbod từ danh sách hiệp tập
 */
export const generateCsvContent = (rawLogs: FitbodRawLogEntry[]): string => {
  let csv = `Date,Exercise,Reps,Weight(kg),Duration(s),Distance(m),Incline,Resistance,isWarmup,Note,multiplier\n`;
  if (!rawLogs || rawLogs.length === 0) {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0000';
    return csv + `${nowStr},Barbell Bench Press,10,60.0,0,0,0,0,false,,1.0\n`;
  }
  rawLogs.forEach(entry => {
    const cleanExercise = entry.exercise.includes(',') ? `"${entry.exercise.replace(/"/g, '""')}"` : entry.exercise;
    const cleanNote = entry.note ? (entry.note.includes(',') ? `"${entry.note.replace(/"/g, '""')}"` : entry.note) : '';
    const dur = entry.durationSeconds ?? 0;
    const dist = entry.distanceMeters ?? 0;
    const inc = entry.incline ?? 0;
    const res = entry.resistance ?? 0;
    const isWarmup = entry.isWarmup ? 'true' : 'false';
    const mult = entry.multiplier ?? 1.0;
    csv += `${entry.date},${cleanExercise},${entry.reps},${entry.weightKg},${dur},${dist},${inc},${res},${isWarmup},${cleanNote},${mult}\n`;
  });
  return csv;
};

/**
 * Tự động đồng bộ và sao lưu ra:
 * 1. Native iOS Documents Directory (Thư mục Tệp trên iPhone) - Apple cam kết 100% không bị xóa khi cài đè IPA
 * 2. Native iOS Preferences (UserDefaults) - Lưu trữ ngầm ở tầng hệ thống
 */
export const persistBackupToNative = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const backupData = collectCurrentAppData();
    const backupJson = JSON.stringify(backupData, null, 2);

    if (Capacitor.isNativePlatform()) {
      try {
        // 1. Ghi file backup tổng vào thư mục Documents
        await NativeStorage.writeDocumentFile({
          name: BACKUP_FILE_NAME,
          content: backupJson
        });

        // 2. Ghi file logs riêng
        if (backupData.rawLogs && backupData.rawLogs.length > 0) {
          await NativeStorage.writeDocumentFile({
            name: LOGS_FILE_NAME,
            content: JSON.stringify(backupData.rawLogs, null, 2)
          });

          // 3. Ghi file CSV để xem trong app Tệp
          const csvText = generateCsvContent(backupData.rawLogs);
          await NativeStorage.writeDocumentFile({
            name: CSV_FILE_NAME,
            content: csvText
          });
        }

        // 4. Ghi mirror vào Preferences hệ thống
        await NativeStorage.writePreference({
          key: 'fitbod_backup_latest',
          value: backupJson
        });

        console.log('[NativePersistence] Đã sao lưu thành công vào iOS Documents & Preferences!');
      } catch (nativeErr) {
        console.warn('[NativePersistence] Lỗi ghi Native Storage:', nativeErr);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('[NativePersistence] Lỗi sao lưu dữ liệu:', err);
    return { success: false, error: String(err) };
  }
};

/**
 * Tự động phục hồi khi mở ứng dụng:
 * Nếu WebKit LocalStorage bị xóa sau khi update Sideloadly (số hiệp < 11.842 hoặc rỗng),
 * tự động kéo dữ liệu từ iOS Documents hoặc Preferences vào lại LocalStorage!
 */
export const autoHealFromNativePersistence = async (): Promise<{ healed: boolean; message?: string }> => {
  try {
    let currentLogsCount = 0;
    try {
      const currentLogsStr = getProfileItem('fitbod_workout_log');
      if (currentLogsStr) {
        const parsed = JSON.parse(currentLogsStr);
        if (Array.isArray(parsed)) currentLogsCount = parsed.length;
      }
    } catch (e) {}

    let nativeBackupCandidate: any = null;

    if (Capacitor.isNativePlatform()) {
      // 1. Thử đọc từ iOS Documents
      try {
        const docRes = await NativeStorage.readDocumentFile({ name: BACKUP_FILE_NAME });
        if (docRes.success && docRes.content) {
          const parsedDoc = JSON.parse(docRes.content);
          if (parsedDoc && (parsedDoc.rawLogsCount || (parsedDoc.rawLogs && parsedDoc.rawLogs.length))) {
            nativeBackupCandidate = parsedDoc;
          }
        }
      } catch (e) {}

      // 2. Thử đọc từ Preferences nếu Documents chưa thấy
      if (!nativeBackupCandidate) {
        try {
          const prefRes = await NativeStorage.readPreference({ key: 'fitbod_backup_latest' });
          if (prefRes.success && prefRes.value) {
            const parsedPref = JSON.parse(prefRes.value);
            if (parsedPref && (parsedPref.rawLogsCount || (parsedPref.rawLogs && parsedPref.rawLogs.length))) {
              nativeBackupCandidate = parsedPref;
            }
          }
        } catch (e) {}
      }
    }

    // So sánh: Nếu bản sao lưu Native có nhiều hiệp tập hơn LocalStorage hiện tại (hoặc LocalStorage bị reset)
    if (nativeBackupCandidate) {
      const candidateLogs = nativeBackupCandidate.rawLogs || [];
      const candidateCount = candidateLogs.length || nativeBackupCandidate.rawLogsCount || 0;

      if (candidateCount > currentLogsCount && candidateCount > 0) {
        console.log(`[NativePersistence] Phát hiện LocalStorage (${currentLogsCount} hiệp) ít hơn iOS Documents (${candidateCount} hiệp). Đang tự động phục hồi...`);
        
        if (nativeBackupCandidate.rawLocalStorageDump) {
          Object.entries(nativeBackupCandidate.rawLocalStorageDump).forEach(([k, v]) => {
            if (v) {
              try { localStorage.setItem(k, v as string); } catch (e) {}
            }
          });
        }
        if (nativeBackupCandidate.localStorageData) {
          Object.entries(nativeBackupCandidate.localStorageData).forEach(([k, v]) => {
            if (v) setProfileItem(k, v as string);
          });
        }
        if (candidateLogs.length > 0) {
          setProfileItem('fitbod_workout_log', JSON.stringify(candidateLogs));
        }
        if (nativeBackupCandidate.stats) {
          setProfileItem('fitbod_stats_cache', JSON.stringify(nativeBackupCandidate.stats));
        }

        return {
          healed: true,
          message: `Đã tự động phục hồi ${candidateCount} hiệp tập từ thư mục Tệp iOS (Documents)!`
        };
      }
    }

    return { healed: false };
  } catch (err) {
    console.warn('[NativePersistence] Kiểm tra tự phục hồi:', err);
    return { healed: false };
  }
};

/**
 * Quét toàn diện tất cả các nguồn lưu trữ (LocalStorage, Documents, Preferences)
 * Giúp Sếp tìm lại bất kỳ hiệp tập nào bị lạc sau khi nạp IPA
 */
export const scanAllStorageSources = async (): Promise<StorageScanItem[]> => {
  const results: StorageScanItem[] = [];

  // 1. Quét LocalStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const val = localStorage.getItem(k);
      if (!val) continue;

      if (k.includes('workout_log') || k.includes('stats_cache') || (val.startsWith('[') && val.includes('"date"'))) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const lastEntry = parsed[parsed.length - 1];
            results.push({
              source: 'localStorage',
              key: k,
              count: parsed.length,
              dateSample: lastEntry?.date || 'N/A',
              data: parsed
            });
          } else if (parsed && parsed.totalWorkouts) {
            results.push({
              source: 'localStorage',
              key: k,
              count: parsed.totalSets || 0,
              dateSample: `${parsed.totalWorkouts} buổi tập`,
              data: parsed
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {}

  // 2. Quét iOS Documents
  if (Capacitor.isNativePlatform()) {
    try {
      const docRes = await NativeStorage.readDocumentFile({ name: BACKUP_FILE_NAME });
      if (docRes.success && docRes.content) {
        const parsedDoc = JSON.parse(docRes.content);
        const count = parsedDoc.rawLogs?.length || parsedDoc.rawLogsCount || 0;
        if (count > 0) {
          results.push({
            source: 'iOS Documents',
            key: BACKUP_FILE_NAME,
            count,
            dateSample: parsedDoc.timestamp ? `Bản lưu ${parsedDoc.timestamp.slice(0, 10)}` : 'Tệp iOS',
            data: parsedDoc
          });
        }
      }
    } catch (e) {}

    try {
      const logRes = await NativeStorage.readDocumentFile({ name: LOGS_FILE_NAME });
      if (logRes.success && logRes.content) {
        const parsedLogs = JSON.parse(logRes.content);
        if (Array.isArray(parsedLogs) && parsedLogs.length > 0) {
          const lastEntry = parsedLogs[parsedLogs.length - 1];
          results.push({
            source: 'iOS Documents',
            key: LOGS_FILE_NAME,
            count: parsedLogs.length,
            dateSample: lastEntry?.date || 'Tệp iOS',
            data: parsedLogs
          });
        }
      }
    } catch (e) {}

    // 3. Quét Preferences
    try {
      const prefRes = await NativeStorage.readPreference({ key: 'fitbod_backup_latest' });
      if (prefRes.success && prefRes.value) {
        const parsedPref = JSON.parse(prefRes.value);
        const count = parsedPref.rawLogs?.length || parsedPref.rawLogsCount || 0;
        if (count > 0) {
          results.push({
            source: 'iOS Preferences',
            key: 'fitbod_backup_latest',
            count,
            dateSample: parsedPref.timestamp ? `Bản lưu ${parsedPref.timestamp.slice(0, 10)}` : 'Preferences',
            data: parsedPref
          });
        }
      }
    } catch (e) {}
  }

  return results;
};

/**
 * Phục hồi dữ liệu từ 1 mục quét được
 */
export const restoreFromScannedItem = (item: StorageScanItem): void => {
  try {
    if ((item.source === 'iOS Documents' || item.source === 'iOS Preferences') && item.data && item.data.localStorageData) {
      const backup = item.data;
      if (backup.rawLocalStorageDump) {
        Object.entries(backup.rawLocalStorageDump).forEach(([k, v]) => {
          if (v) localStorage.setItem(k, v as string);
        });
      }
      if (backup.localStorageData) {
        Object.entries(backup.localStorageData).forEach(([k, v]) => {
          if (v) setProfileItem(k, v as string);
        });
      }
      if (backup.rawLogs && backup.rawLogs.length > 0) {
        setProfileItem('fitbod_workout_log', JSON.stringify(backup.rawLogs));
      }
      if (backup.stats) {
        setProfileItem('fitbod_stats_cache', JSON.stringify(backup.stats));
      }
    } else if (Array.isArray(item.data)) {
      setProfileItem('fitbod_workout_log', JSON.stringify(item.data));
    } else if (item.data && item.data.totalWorkouts) {
      setProfileItem('fitbod_stats_cache', JSON.stringify(item.data));
    }

    // Sau khi nạp vào LocalStorage, lập tức backup ra Documents & Preferences
    persistBackupToNative();
  } catch (e) {
    throw e;
  }
};

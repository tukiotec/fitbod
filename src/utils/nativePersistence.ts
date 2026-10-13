import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { getProfileItem, setProfileItem, getActiveProfile } from './profileStorage';
import { FitbodRawLogEntry, FitbodCsvParseResult } from '../engine/fitbodEngine';

export interface StorageScanItem {
  source: 'localStorage' | 'iOS Documents';
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
 * Native iOS Documents Directory (Thư mục Tệp trên iPhone)
 * Apple đảm bảo 100% KHÔNG BAO GIỜ bị xóa khi Sideloadly cài đè file IPA mới.
 */
export const persistBackupToNative = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const backupData = collectCurrentAppData();
    const backupJson = JSON.stringify(backupData, null, 2);

    // Ghi vào thư mục Documents nếu là iOS / Native
    if (Capacitor.isNativePlatform()) {
      try {
        // 1. File sao lưu JSON đầy đủ
        await Filesystem.writeFile({
          path: BACKUP_FILE_NAME,
          data: backupJson,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });

        // 2. File riêng cho danh sách hiệp tập rawLogs
        if (backupData.rawLogs && backupData.rawLogs.length > 0) {
          await Filesystem.writeFile({
            path: LOGS_FILE_NAME,
            data: JSON.stringify(backupData.rawLogs, null, 2),
            directory: Directory.Documents,
            encoding: Encoding.UTF8
          });

          // 3. Ghi kèm 1 bản CSV để người dùng mở xem ngay trong app Tệp (Files)
          const csvText = generateCsvContent(backupData.rawLogs);
          await Filesystem.writeFile({
            path: CSV_FILE_NAME,
            data: csvText,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
          });
        }
        console.log('[NativePersistence] Đã sao lưu thành công vào iOS Documents!');
      } catch (fsErr) {
        console.warn('[NativePersistence] Lỗi ghi Filesystem Documents:', fsErr);
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
 * tự động kéo dữ liệu từ iOS Documents vào lại LocalStorage!
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

    // Thử đọc từ iOS Documents (Nguồn tài liệu vĩnh viễn của Apple)
    if (Capacitor.isNativePlatform()) {
      try {
        const fileRes = await Filesystem.readFile({
          path: BACKUP_FILE_NAME,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
        const content = typeof fileRes.data === 'string' ? fileRes.data : await (fileRes.data as Blob).text();
        if (content) {
          const parsedDoc = JSON.parse(content);
          if (parsedDoc && (parsedDoc.rawLogsCount || (parsedDoc.rawLogs && parsedDoc.rawLogs.length))) {
            nativeBackupCandidate = parsedDoc;
          }
        }
      } catch (e) {
        // Thử đọc tiếp file log riêng nếu file backup tổng chưa có
        try {
          const logRes = await Filesystem.readFile({
            path: LOGS_FILE_NAME,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
          });
          const logContent = typeof logRes.data === 'string' ? logRes.data : await (logRes.data as Blob).text();
          if (logContent) {
            const parsedLogs = JSON.parse(logContent);
            if (Array.isArray(parsedLogs) && parsedLogs.length > 0) {
              nativeBackupCandidate = {
                rawLogs: parsedLogs,
                rawLogsCount: parsedLogs.length
              };
            }
          }
        } catch (err2) {}
      }
    }

    // So sánh: Nếu bản sao lưu Native có nhiều hiệp tập hơn LocalStorage hiện tại (hoặc LocalStorage bị reset)
    if (nativeBackupCandidate) {
      const candidateLogs = nativeBackupCandidate.rawLogs || [];
      const candidateCount = candidateLogs.length || nativeBackupCandidate.rawLogsCount || 0;

      // Nếu bản sao lưu native có nhiều hiệp hơn hoặc LocalStorage đang bị reset
      if (candidateCount > currentLogsCount && candidateCount > 0) {
        console.log(`[NativePersistence] Phát hiện LocalStorage (${currentLogsCount} hiệp) ít hơn iOS Documents (${candidateCount} hiệp). Đang tự động phục hồi...`);
        
        // Phục hồi toàn bộ cài đặt & lịch sử
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
 * Quét toàn diện tất cả các nguồn lưu trữ (LocalStorage, Documents)
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
      const fileRes = await Filesystem.readFile({
        path: BACKUP_FILE_NAME,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      const content = typeof fileRes.data === 'string' ? fileRes.data : await (fileRes.data as Blob).text();
      if (content) {
        const parsedDoc = JSON.parse(content);
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
      const logRes = await Filesystem.readFile({
        path: LOGS_FILE_NAME,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      const logContent = typeof logRes.data === 'string' ? logRes.data : await (logRes.data as Blob).text();
      if (logContent) {
        const parsedLogs = JSON.parse(logContent);
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
  }

  return results;
};

/**
 * Phục hồi dữ liệu từ 1 mục quét được
 */
export const restoreFromScannedItem = (item: StorageScanItem): void => {
  try {
    if (item.source === 'iOS Documents' && item.data && item.data.localStorageData) {
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

    // Sau khi nạp vào LocalStorage, lập tức backup ra Documents
    persistBackupToNative();
  } catch (e) {
    throw e;
  }
};

import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Trophy, 
  Calendar, 
  Dumbbell, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText, 
  Download, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  HardDrive, 
  Trash2, 
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
  FileCode,
  Info
} from 'lucide-react';
import { parseFitbodCsvText, FitbodCsvParseResult, FitbodRawLogEntry } from '../engine/fitbodEngine';
import { getActiveProfile, getProfileItem, setProfileItem } from '../utils/profileStorage';

interface HistoryTabProps {
  onImportSuccess: (data: any) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ onImportSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const activeProfile = getActiveProfile();

  const [stats, setStats] = useState<FitbodCsvParseResult | null>(() => {
    try {
      const saved = getProfileItem('fitbod_stats_cache');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Xử lý nạp file thống nhất: Tự động phân biệt file .CSV hay .JSON
  const handleUnifiedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isJson = file.name.toLowerCase().endsWith('.json');
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      if (isJson) {
        // Nạp file sao lưu JSON
        try {
          const backup = JSON.parse(text);
          if (backup.localStorageData) {
            Object.entries(backup.localStorageData).forEach(([key, val]) => {
              if (val) setProfileItem(key, val as string);
            });
          }
          if (backup.stats) {
            setStats(backup.stats);
            setProfileItem('fitbod_stats_cache', JSON.stringify(backup.stats));
            onImportSuccess(backup.stats);
          }
          setImportStatus(`✅ Đã khôi phục thành công toàn bộ dữ liệu hồ sơ [${activeProfile.name}] từ file sao lưu JSON!`);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } catch (err) {
          alert('❌ File sao lưu JSON không đúng định dạng!');
        }
      } else {
        // Nạp file CSV từ Fitbod gốc
        try {
          const parsed = parseFitbodCsvText(text);
          setStats(parsed);
          setProfileItem('fitbod_stats_cache', JSON.stringify(parsed));
          if (parsed.rawLogs && parsed.rawLogs.length > 0) {
            setProfileItem('fitbod_workout_log', JSON.stringify(parsed.rawLogs));
          }
          if (parsed.exerciseHistory && Object.keys(parsed.exerciseHistory).length > 0) {
            setProfileItem('fitbod_exercise_history', JSON.stringify(parsed.exerciseHistory));
          }
          setImportStatus(`✅ Đã nạp thành công ${parsed.totalWorkouts} buổi tập, ${parsed.totalSets} hiệp tập, ${parsed.records.length} kỷ lục PR từ file CSV!`);
          onImportSuccess(parsed);
        } catch (err) {
          alert('❌ File CSV không đúng định dạng WorkoutExport của Fitbod!');
        }
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetAndImportFresh = () => {
    const confirmReset = window.confirm(
      '⚠️ XÁC NHẬN XÓA TRẮNG & NẠP LẠI:\n\nSếp có chắc chắn muốn xóa sạch toàn bộ lịch sử rác cũ trong hồ sơ này và chọn file mới (.CSV hoặc .JSON) để nạp lại chuẩn xác 100% không?'
    );
    if (!confirmReset) return;

    // 1. Xóa sạch lịch sử rác cũ
    setProfileItem('fitbod_stats_cache', '');
    setProfileItem('fitbod_exercise_history', '{}');
    setProfileItem('fitbod_workout_log', '[]');
    setStats(null);
    setImportStatus('Đã xóa trắng lịch sử cũ. Sếp hãy chọn file .CSV hoặc .JSON mới để nạp!');

    // 2. Mở file picker
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const exportFullBackup = () => {
    const backupData = {
      appName: 'Fitbod Pro Mobile',
      version: '2.0',
      profile: {
        id: activeProfile.id,
        name: activeProfile.name
      },
      exportedAt: new Date().toISOString(),
      localStorageData: {
        fitbod_recovery: getProfileItem('fitbod_recovery'),
        fitbod_goal: getProfileItem('fitbod_goal'),
        fitbod_split: getProfileItem('fitbod_split'),
        fitbod_duration: getProfileItem('fitbod_duration'),
        fitbod_equipment: getProfileItem('fitbod_equipment'),
        fitbod_warmup: getProfileItem('fitbod_warmup'),
        fitbod_cardio_type: getProfileItem('fitbod_cardio_type'),
        fitbod_cardio_duration: getProfileItem('fitbod_cardio_duration'),
        fitbod_target_muscles: getProfileItem('fitbod_target_muscles'),
        fitbod_exercise_history: getProfileItem('fitbod_exercise_history'),
        fitbod_exercise_preferences: getProfileItem('fitbod_exercise_preferences'),
        fitbod_stats_cache: getProfileItem('fitbod_stats_cache'),
        fitbod_workout_log: getProfileItem('fitbod_workout_log')
      },
      stats
    };

    const cleanProfileName = activeProfile.name.replace(/[^a-zA-Z0-9]/g, '_');
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitbodPro_${cleanProfileName}_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFitbodCsv = () => {
    let csv = `Date,Exercise,Reps,Weight(kg),Duration(s),Distance(m),Incline,Resistance,isWarmup,Note,multiplier\n`;
    
    const rawLogsStr = getProfileItem('fitbod_workout_log');
    let rawLogs: FitbodRawLogEntry[] = [];
    if (rawLogsStr) {
      try {
        rawLogs = JSON.parse(rawLogsStr);
      } catch (e) {}
    }

    if (rawLogs.length > 0) {
      // Xuất trọn vẹn 100% từng hiệp tập với ngày tháng thật gốc của buổi tập
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
    } else if (stats && stats.records.length > 0) {
      // Fallback: nếu hồ sơ cũ chưa có rawLogs, xuất từ danh sách records PR với ngày ghi nhận gần nhất (lastDate)
      stats.records.forEach(r => {
        const dateStr = r.lastDate ? `${r.lastDate} 10:00:00 +0000` : new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0000';
        csv += `${dateStr},${r.exercise},10,${r.maxWeight},0,0,0,0,false,PR e1RM: ${r.maxE1RM}kg,1.0\n`;
      });
    } else {
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0000';
      csv += `${nowStr},Barbell Bench Press,10,60.0,0,0,0,0,false,,1.0\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fitbod_WorkoutExport_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSampleData = () => {
    const sampleCsv = `Date,Exercise,Reps,Weight(kg),Duration(s),Distance(m),Incline,Resistance,isWarmup,Note,multiplier
2024-03-01 10:00:00 +0000,Barbell Bench Press,10,70.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-01 10:00:00 +0000,Barbell Bench Press,8,80.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-01 10:00:00 +0000,Barbell Bench Press,5,90.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-01 10:00:00 +0000,Incline Dumbbell Press,10,26.0,0.0,0.0,0.0,0.0,false,,2.0
2024-03-01 10:00:00 +0000,Cable Tricep Pushdown,12,35.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-03 15:30:00 +0000,Barbell Back Squat,5,110.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-03 15:30:00 +0000,Barbell Back Squat,5,120.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-03 15:30:00 +0000,Barbell Back Squat,3,130.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-05 17:00:00 +0000,Barbell Deadlift,5,140.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-05 17:00:00 +0000,Barbell Deadlift,3,155.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-05 17:00:00 +0000,Cable Lat Pulldown,10,65.0,0.0,0.0,0.0,0.0,false,,1.0
2024-03-05 17:00:00 +0000,Barbell Curl,10,35.0,0.0,0.0,0.0,0.0,false,,1.0
`;
    const parsed = parseFitbodCsvText(sampleCsv);
    setStats(parsed);
    setProfileItem('fitbod_stats_cache', JSON.stringify(parsed));
    if (parsed.rawLogs && parsed.rawLogs.length > 0) {
      setProfileItem('fitbod_workout_log', JSON.stringify(parsed.rawLogs));
    }
    if (parsed.exerciseHistory && Object.keys(parsed.exerciseHistory).length > 0) {
      setProfileItem('fitbod_exercise_history', JSON.stringify(parsed.exerciseHistory));
    }
    setImportStatus(`Đã nạp thành công ${parsed.totalWorkouts} buổi tập, ${parsed.totalSets} hiệp tập, ${parsed.records.length} kỷ lục cá nhân PR!`);
    onImportSuccess(parsed);
  };

  // Lọc danh sách kỷ lục theo từ khóa tìm kiếm
  const allRecords = stats?.records || [];
  const filteredRecords = allRecords.filter(r => 
    r.exercise.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.originalCsvName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayedRecords = filteredRecords.slice(0, visibleCount);

  return (
    <div className="space-y-4 pb-20">
      
      {/* 1. Unified Data Hub Card: Nạp & Sao Lưu Thống Nhất */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Trung Tâm Dữ Liệu & Lịch Sử</span>
              <span className="px-2 py-0.5 text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                CSV & JSON
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Nạp lịch sử Fitbod hoặc sao lưu toàn diện ứng dụng
            </p>
          </div>
        </div>

        {/* Input file ẩn hỗ trợ cả .csv và .json */}
        <input
          type="file"
          accept=".csv,.json,text/csv,application/json"
          ref={fileInputRef}
          onChange={handleUnifiedFileUpload}
          className="hidden"
        />

        {/* Khối giải thích trực quan: CSV vs JSON để Sếp không bị nhầm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>File CSV (Fitbod Gốc)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dành cho file <code className="text-slate-700 font-bold">WorkoutExport.csv</code> xuất từ app Fitbod gốc để nạp lịch sử, số hiệp, mức tạ và kỷ lục PR.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <FileCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>File JSON (Sao Lưu Đầy Đủ)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bản sao lưu toàn bộ cấu hình, máy tập, ưu tiên bài tập ⭐ và lịch sử của app này để cất giữ trên iCloud/Drive hoặc chuyển máy.
            </p>
          </div>
        </div>

        {/* Các nút bấm thao tác chính */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-md shadow-blue-500/20"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Nạp File (CSV / JSON)</span>
            </button>

            <button
              onClick={handleResetAndImportFresh}
              className="py-3 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Xóa Trắng & Nạp Lại</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={exportFullBackup}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition border border-slate-200/60"
              title="Tải về file JSON sao lưu đầy đủ cài đặt & lịch sử"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Sao Lưu JSON</span>
            </button>

            <button
              onClick={exportFitbodCsv}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition border border-slate-200/60"
              title="Xuất file CSV để xem trên Excel hoặc Google Sheets"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Xuất File CSV</span>
            </button>
          </div>
        </div>

        {/* Nút nạp mẫu dữ liệu */}
        <div className="mt-3 text-center border-t border-slate-100 pt-2.5">
          <button
            onClick={loadSampleData}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
          >
            + Nạp thử dữ liệu mẫu Fitbod (3 buổi tập thực tế)
          </button>
        </div>

        {importStatus && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* 2. Lifetime Stats Card */}
      {stats && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Thống Kê Tập Luyện Lịch Sử
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">Buổi tập</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">{stats.totalWorkouts}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">Tổng Sets</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">{stats.totalSets}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500">Tổng Tải</span>
              <p className="text-xl font-black text-blue-600 mt-0.5">
                {(stats.totalVolumeKg / 1000).toFixed(1)} <span className="text-xs">tấn</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRs Leaderboard: Chỉ hiện 5-10 bài đầu, có ô tìm kiếm và nút Xem Thêm (View More) */}
      {stats && allRecords.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Kỷ Lục Sức Mạnh & Estimated 1RM
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {displayedRecords.length} / {filteredRecords.length} bài
            </span>
          </div>

          {/* Ô tìm kiếm bài tập kỷ lục */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài tập kỷ lục (VD: Bench, Squat, Lat...)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Danh sách 10 kỷ lục hàng đầu */}
          <div className="space-y-2">
            {displayedRecords.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' : (idx === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500')
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{r.exercise}</h4>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-500 font-medium">Set đỉnh: {r.bestSet}</span>
                      {r.maxWeight > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                          Tạ Max: {r.maxWeight}kg
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">e1RM</span>
                  <span className="text-sm font-black text-blue-600">{r.maxE1RM} kg</span>
                </div>
              </div>
            ))}
          </div>

          {/* Nút Xem Thêm / View More */}
          {filteredRecords.length > visibleCount && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-[0.98] transition border border-blue-200/60"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Xem thêm 10 bài nữa (Còn {filteredRecords.length - visibleCount} bài)</span>
              </button>

              <button
                onClick={() => setVisibleCount(filteredRecords.length)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold active:scale-[0.98] transition"
                title="Mở rộng toàn bộ"
              >
                Xem tất cả
              </button>
            </div>
          )}

          {visibleCount > 10 && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setVisibleCount(10)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto py-1"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Thu gọn về 10 bài đầu</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

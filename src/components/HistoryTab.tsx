import React, { useRef, useState } from 'react';
import { UploadCloud, Trophy, Calendar, Dumbbell, ArrowUpRight, CheckCircle2, FileText, Download, ShieldCheck, Database, RefreshCw, HardDrive, Trash2, RotateCcw } from 'lucide-react';
import { parseFitbodCsvText, FitbodCsvParseResult } from '../engine/fitbodEngine';
import { getActiveProfile, getProfileItem, setProfileItem } from '../utils/profileStorage';

interface HistoryTabProps {
  onImportSuccess: (data: any) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ onImportSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const activeProfile = getActiveProfile();
  const [stats, setStats] = useState<FitbodCsvParseResult | null>(() => {
    try {
      const saved = getProfileItem('fitbod_stats_cache');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseFitbodCsvText(text);
        setStats(parsed);
        setProfileItem('fitbod_stats_cache', JSON.stringify(parsed));
        if (parsed.exerciseHistory && Object.keys(parsed.exerciseHistory).length > 0) {
          setProfileItem('fitbod_exercise_history', JSON.stringify(parsed.exerciseHistory));
        }
        setImportStatus(`Đã nạp thành công ${parsed.totalWorkouts} buổi tập, ${parsed.totalSets} hiệp tập, ${parsed.records.length} kỷ lục cá nhân PR!`);
        onImportSuccess(parsed);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetAndImportFresh = () => {
    const confirmReset = window.confirm(
      '⚠️ XÁC NHẬN XÓA TRẮNG & NẠP LẠI:\n\nSếp có chắc chắn muốn xóa sạch toàn bộ lịch sử rác cũ trong hồ sơ này và chọn file WorkoutExport.csv mới để nạp lại chuẩn xác 100% không?'
    );
    if (!confirmReset) return;

    // 1. Xóa sạch lịch sử rác cũ
    setProfileItem('fitbod_stats_cache', '');
    setProfileItem('fitbod_exercise_history', '{}');
    setStats(null);
    setImportStatus('Đã xóa trắng lịch sử cũ. Sếp hãy chọn file WorkoutExport.csv mới để nạp!');

    // 2. Mở file picker chọn file CSV ngay lập tức
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleJsonRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const backup = JSON.parse(text);
        if (backup.localStorageData) {
          Object.entries(backup.localStorageData).forEach(([key, val]) => {
            if (val) setProfileItem(key, val as string);
          });
        }
        if (backup.stats) {
          setStats(backup.stats);
          setProfileItem('fitbod_stats_cache', JSON.stringify(backup.stats));
        }
        setImportStatus(`✅ Đã khôi phục toàn bộ dữ liệu lịch sử vào hồ sơ [${activeProfile.name}] thành công 100%!`);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        alert('File backup JSON không đúng định dạng!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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
        fitbod_stats_cache: getProfileItem('fitbod_stats_cache')
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
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' +0000';
    
    if (stats && stats.records.length > 0) {
      stats.records.forEach(r => {
        csv += `${nowStr},${r.exercise},10,${r.maxWeight},0,0,0,0,false,PR e1RM: ${r.maxE1RM}kg,1.0\n`;
      });
    } else {
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
2024-03-05 17:00:00 +0000,Barbell Bicep Curl,10,35.0,0.0,0.0,0.0,0.0,false,,1.0
`;
    const parsed = parseFitbodCsvText(sampleCsv);
    setStats(parsed);
    setProfileItem('fitbod_stats_cache', JSON.stringify(parsed));
    if (parsed.exerciseHistory && Object.keys(parsed.exerciseHistory).length > 0) {
      setProfileItem('fitbod_exercise_history', JSON.stringify(parsed.exerciseHistory));
    }
    setImportStatus(`Đã nạp thành công ${parsed.totalWorkouts} buổi tập, ${parsed.totalSets} hiệp tập, ${parsed.records.length} kỷ lục cá nhân PR!`);
    onImportSuccess(parsed);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Nút Xóa Trắng & Import Lại File CSV Mới Nổi Bật Tại Đầu Tab */}
      <div className="bg-white rounded-3xl p-5 border-2 border-red-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Xóa Trắng & Import Lại File CSV Mới</span>
              <span className="px-2 py-0.5 text-[10px] font-black bg-red-100 text-red-700 rounded-full">RESET CHUẨN</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Xóa sạch lịch sử rác cũ & nạp lại chuẩn 100% từ <span className="font-bold text-slate-700">WorkoutExport.csv</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleResetAndImportFresh}
          className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition shadow-lg shadow-red-600/25 relative z-10"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Bấm Để Xóa Trắng Cũ & Chọn File CSV Mới</span>
        </button>

        <p className="text-[11px] text-slate-400 mt-2 text-center relative z-10">
          * Một chạm dọn sạch bộ nhớ cache và khôi phục PR, 1RM, lịch sử bài tập chuẩn xác nhất
        </p>
      </div>

      {/* Upload Box Thường */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Nạp Dữ Liệu Cũ Từ Fitbod</h2>
            <p className="text-xs text-slate-500">Nhập file WorkoutExport.csv để khôi phục PR & 1RM</p>
          </div>
        </div>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 rounded-2xl p-6 text-center cursor-pointer transition active:scale-[0.99]"
        >
          <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">
            Chạm để chọn file <span className="text-blue-600">WorkoutExport.csv</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            (File xuất từ Fitbod Settings → Export Workout Data)
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Chưa có sẵn file?</span>
          <button
            onClick={loadSampleData}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
          >
            + Nạp thử dữ liệu mẫu Fitbod
          </button>
        </div>

        {importStatus && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* Lifetime Stats Card */}
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

      {/* PRs Leaderboard */}
      {stats && stats.records.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Kỷ Lục Sức Mạnh & Estimated 1RM
            </h3>
          </div>

          <div className="space-y-2">
            {stats.records.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' : (idx === 1 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500')
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{r.exercise}</h4>
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

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">e1RM</span>
                  <span className="text-sm font-black text-blue-600">{r.maxE1RM} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 100% Data Safety & Backup Protection Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg border border-slate-700">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">Bảo Hiểm Dữ Liệu & Sao Lưu Dự Phòng</h3>
            <p className="text-[11px] text-slate-300">Không lo mất dữ liệu kể cả khi đổi máy hay cloud có sự cố</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed my-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          💡 <b>An toàn 100%:</b> Toàn bộ lịch sử tập luyện, kỷ lục 1RM và % phục hồi của Sếp đều lưu trực tiếp trong điện thoại. Sếp hãy bấm <b>"Sao Lưu Toàn Bộ"</b> để cất file vào Google Drive hoặc iCloud. Khi đổi máy chỉ cần 1 chạm là khôi phục lại toàn bộ!
        </p>

        <input
          type="file"
          accept=".json"
          ref={jsonInputRef}
          onChange={handleJsonRestore}
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={exportFullBackup}
            className="py-3 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition shadow-md shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Sao Lưu Toàn Bộ (JSON)</span>
          </button>

          <button
            onClick={() => jsonInputRef.current?.click()}
            className="py-3 px-2 bg-white/15 hover:bg-white/20 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition border border-white/20"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>Khôi Phục Dữ Liệu</span>
          </button>
        </div>

        <div className="mt-2 text-center">
          <button
            onClick={exportFitbodCsv}
            className="text-[11px] font-extrabold text-slate-400 hover:text-slate-200 underline"
          >
            + Xuất file CSV chuẩn Fitbod (Xem trên Excel/Sheets)
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  RotateCcw, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Dumbbell
} from 'lucide-react';
import { MuscleGroup } from '../types';
import { MUSCLES_INFO } from '../data/exerciseCatalog';
import { calculateDynamicRecovery, getMuscleRecoveryETA } from '../engine/fitbodEngine';

interface RecoveryTabProps {
  recoveryState: Record<MuscleGroup, number>;
  baseRecovery: Record<MuscleGroup, number>;
  lastTrainedTime: Record<MuscleGroup, number | null>;
  onUpdateRecovery: (muscle: MuscleGroup, newValue: number) => void;
  onResetAll: () => void;
  onSyncHistoryRecovery: () => void;
  onSimulateWorkoutDemo?: (target: 'push' | 'pull' | 'legs') => void;
}

export const RecoveryTab: React.FC<RecoveryTabProps> = ({
  recoveryState,
  baseRecovery,
  lastTrainedTime,
  onUpdateRecovery,
  onResetAll,
  onSyncHistoryRecovery,
  onSimulateWorkoutDemo
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [activeRegion, setActiveRegion] = useState<'all' | 'upper' | 'lower' | 'core'>('all');
  const [simulationOffsetHours, setSimulationOffsetHours] = useState<number>(0);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Tính toán mức phục hồi hiển thị (thời gian thực hoặc mô phỏng tương lai)
  const effectiveRecovery = useMemo(() => {
    if (simulationOffsetHours === 0) {
      return recoveryState;
    }
    const simulatedTime = Date.now() + simulationOffsetHours * 3600 * 1000;
    return calculateDynamicRecovery(baseRecovery, lastTrainedTime, simulatedTime);
  }, [recoveryState, baseRecovery, lastTrainedTime, simulationOffsetHours]);

  const getStatusColor = (pct: number) => {
    if (pct >= 70) {
      return { 
        bg: 'bg-emerald-500', 
        text: 'text-emerald-700', 
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
        label: 'Sẵn sàng' 
      };
    }
    if (pct >= 40) {
      return { 
        bg: 'bg-amber-500', 
        text: 'text-amber-700', 
        badge: 'bg-amber-50 text-amber-700 border-amber-200', 
        label: 'Đang hồi phục' 
      };
    }
    return { 
      bg: 'bg-rose-500', 
      text: 'text-rose-700', 
      badge: 'bg-rose-50 text-rose-700 border-rose-200', 
      label: 'Mỏi / Nghỉ' 
    };
  };

  const musclesList = (Object.keys(MUSCLES_INFO) as MuscleGroup[]).filter(m => {
    if (activeRegion === 'all') return true;
    return MUSCLES_INFO[m].region === activeRegion;
  });

  // Calculate overall average recovery
  const allValues = Object.values(effectiveRecovery);
  const avgRecovery = Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length);

  const handleTriggerSync = () => {
    onSyncHistoryRecovery();
    setSimulationOffsetHours(0);
    setSyncNotice('✅ Đã đồng bộ chuẩn xác mức hồi phục với toàn bộ lịch sử bài tập của Sếp!');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleTriggerDemo = (type: 'pull' | 'push') => {
    if (onSimulateWorkoutDemo) {
      onSimulateWorkoutDemo(type);
      setSimulationOffsetHours(0);
      setSyncNotice(`🔥 Đã mô phỏng buổi tập ${type === 'pull' ? 'Lưng xô & Tay trước' : 'Ngực & Tay sau'}. Độ mỏi đã kích hoạt, đồng hồ hồi phục đang chạy!`);
      setTimeout(() => setSyncNotice(null), 4500);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Overview Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Bản Đồ Hồi Phục Cơ Bắp</h2>
              <p className="text-xs text-slate-500">Mô hình hàm suy thoái mũ Fitbod AI theo thời gian thực</p>
            </div>
          </div>
          <button
            onClick={onResetAll}
            className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 text-xs font-bold transition border border-slate-200 shadow-xs"
            title="Đặt lại toàn bộ 100%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>100%</span>
          </button>
        </div>

        {/* Big Overall Recovery Meter */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Độ phục hồi toàn thân</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-slate-900">{avgRecovery}%</span>
              <span className="text-xs font-bold text-emerald-600">
                {avgRecovery >= 70 ? '• Trạng thái Sung sức' : (avgRecovery >= 45 ? '• Sẵn sàng tập nhẹ' : '• Cần nghỉ ngơi')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {simulationOffsetHours > 0 
                ? `Mô phỏng sau +${simulationOffsetHours} giờ nữa` 
                : 'Cơ bắp tự động hồi phục tăng dần theo từng giờ'}
            </p>
          </div>

          <div className="w-20 h-20 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={avgRecovery >= 70 ? 'text-emerald-500' : (avgRecovery >= 40 ? 'text-amber-500' : 'text-rose-500')}
                strokeDasharray={`${avgRecovery}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-slate-700">{avgRecovery}%</span>
          </div>
        </div>

        {/* ⏱️ Thanh Mô Phỏng Dòng Thời Gian Phục Hồi (Time Travel Simulator) */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Xem trước phục hồi theo thời gian:</span>
            </div>
            {simulationOffsetHours > 0 && (
              <button
                onClick={() => setSimulationOffsetHours(0)}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Về hiện tại
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {[
              { hours: 0, label: 'Hiện tại' },
              { hours: 12, label: '+12h' },
              { hours: 24, label: '+24h' },
              { hours: 48, label: '+48h' },
              { hours: 72, label: '+72h' }
            ].map(item => (
              <button
                key={item.hours}
                onClick={() => setSimulationOffsetHours(item.hours)}
                className={`py-1.5 rounded-xl text-xs font-bold transition ${
                  simulationOffsetHours === item.hours
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {simulationOffsetHours > 0 && (
            <div className="mt-2.5 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs text-blue-800">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Đang xem mức hồi phục sau <b>+{simulationOffsetHours} giờ</b>. Cơ bắp đang tự phục hồi theo chu kỳ sinh lý!</span>
              </div>
              <button
                onClick={() => setSimulationOffsetHours(0)}
                className="px-2 py-0.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold shrink-0 ml-2"
              >
                Hiện tại
              </button>
            </div>
          )}
        </div>

        {/* Region Filter Tabs */}
        <div className="flex gap-1.5 mt-4 p-1 bg-slate-100 rounded-2xl">
          {[
            { id: 'all', label: 'Tất cả (14)' },
            { id: 'upper', label: 'Thân trên' },
            { id: 'lower', label: 'Thân dưới' },
            { id: 'core', label: 'Cơ bụng / Lõi' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRegion(tab.id as any)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                activeRegion === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sync Notice Alert */}
      {syncNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Quick Sync & Demo Actions */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={handleTriggerSync}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>Đồng Bộ Lịch Sử CSV</span>
        </button>

        <button
          onClick={() => handleTriggerDemo('pull')}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition active:scale-95"
          title="Thử nghiệm tạo độ mỏi cơ lưng và tay trước như vừa tập xong"
        >
          <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
          <span>Test Vừa Tập Lưng/Tay</span>
        </button>
      </div>

      {/* Muscle List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {musclesList.map((m) => {
          const info = MUSCLES_INFO[m];
          const pct = effectiveRecovery[m] ?? 100;
          const status = getStatusColor(pct);
          const currentTimestamp = Date.now() + simulationOffsetHours * 3600 * 1000;
          const eta = getMuscleRecoveryETA(m, pct, baseRecovery[m] ?? pct, lastTrainedTime[m] ?? null, currentTimestamp);

          return (
            <div
              key={m}
              onClick={() => setSelectedMuscle(m)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-400 cursor-pointer transition active:scale-[0.99] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{info.nameVi}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">{info.nameEn} • Chu kỳ {info.tau}h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${status.badge}`}>
                      {status.label}
                    </span>
                    <span className="text-sm font-black text-slate-900">{pct}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full ${status.bg} transition-all duration-500 rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Dynamic Recovery ETA / Status */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1">
                  {eta.isFullyRecovered ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{eta.formattedText}</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{eta.formattedText}</span>
                    </span>
                  )}
                </div>

                <span className="text-slate-400 text-[10px]">
                  {pct < 100 ? 'Đang tăng dần' : 'Tối đa'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Override Modal */}
      {selectedMuscle && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Điều Chỉnh: {MUSCLES_INFO[selectedMuscle].nameVi}
                </h3>
                <p className="text-xs text-slate-500">Kéo thanh trượt để cập nhật mức mỏi/hồi phục</p>
              </div>
              <button
                onClick={() => setSelectedMuscle(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-center my-4">
              <span className="text-4xl font-black text-blue-600">
                {recoveryState[selectedMuscle]}%
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Chu kỳ phục hồi tự nhiên: {MUSCLES_INFO[selectedMuscle].tau} giờ
              </p>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={recoveryState[selectedMuscle]}
              onChange={(e) => onUpdateRecovery(selectedMuscle, parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-6"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onUpdateRecovery(selectedMuscle, 100);
                  setSelectedMuscle(null);
                }}
                className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200"
              >
                Đặt Đã Hồi Phục (100%)
              </button>
              <button
                onClick={() => setSelectedMuscle(null)}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

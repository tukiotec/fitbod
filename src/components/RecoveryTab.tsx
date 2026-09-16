import React, { useState } from 'react';
import { Activity, RotateCcw, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { MuscleGroup } from '../types';
import { MUSCLES_INFO } from '../data/exerciseCatalog';

interface RecoveryTabProps {
  recoveryState: Record<MuscleGroup, number>;
  onUpdateRecovery: (muscle: MuscleGroup, newValue: number) => void;
  onResetAll: () => void;
}

export const RecoveryTab: React.FC<RecoveryTabProps> = ({
  recoveryState,
  onUpdateRecovery,
  onResetAll
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [activeRegion, setActiveRegion] = useState<'all' | 'upper' | 'lower' | 'core'>('all');

  const getStatusColor = (pct: number) => {
    if (pct >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Sẵn sàng' };
    if (pct >= 40) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Đang hồi' };
    return { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Mỏi / Nghỉ' };
  };

  const musclesList = (Object.keys(MUSCLES_INFO) as MuscleGroup[]).filter(m => {
    if (activeRegion === 'all') return true;
    return MUSCLES_INFO[m].region === activeRegion;
  });

  // Calculate overall average recovery
  const allValues = Object.values(recoveryState);
  const avgRecovery = Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length);

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
              <p className="text-xs text-slate-500">Mô phỏng 14 nhóm cơ theo thời gian thực</p>
            </div>
          </div>
          <button
            onClick={onResetAll}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
            title="Đặt lại 100%"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Big Overall Recovery Meter */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Độ phục hồi toàn thân</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-slate-900">{avgRecovery}%</span>
              <span className="text-xs font-bold text-emerald-600">
                {avgRecovery >= 70 ? '• Trạng thái Sung sức' : (avgRecovery >= 45 ? '• Sẵn sàng tập nhẹ' : '• Cần nghỉ ngơi')}
              </span>
            </div>
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

      {/* Muscle List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {musclesList.map((m) => {
          const info = MUSCLES_INFO[m];
          const pct = recoveryState[m] ?? 100;
          const status = getStatusColor(pct);

          return (
            <div
              key={m}
              onClick={() => setSelectedMuscle(m)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-400 cursor-pointer transition active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{info.nameVi}</h4>
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
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${status.bg} transition-all duration-500 rounded-full`}
                  style={{ width: `${pct}%` }}
                />
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
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-center my-4">
              <span className="text-4xl font-black text-blue-600">
                {recoveryState[selectedMuscle]}%
              </span>
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
                Đánh dấu Đã hồi phục (100%)
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

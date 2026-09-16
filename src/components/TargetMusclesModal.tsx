import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Target, Check, Sparkles, Flame, Zap, Dumbbell, RefreshCw } from 'lucide-react';
import { MuscleGroup } from '../types';
import { MUSCLES_INFO } from '../data/exerciseCatalog';

interface TargetMusclesModalProps {
  currentMuscles?: MuscleGroup[];
  recoveryState: Record<MuscleGroup, number>;
  onApply: (selectedMuscles: MuscleGroup[]) => void;
  onClose: () => void;
}

interface MusclePreset {
  id: string;
  name: string;
  tag: string;
  muscles: MuscleGroup[];
  icon: string;
}

export const TargetMusclesModal: React.FC<TargetMusclesModalProps> = ({
  currentMuscles = ['chest', 'shoulders', 'triceps'],
  recoveryState,
  onApply,
  onClose
}) => {
  const [selected, setSelected] = useState<MuscleGroup[]>(() => {
    return currentMuscles.length > 0 ? currentMuscles : ['chest', 'shoulders', 'triceps'];
  });

  // Calculate best recovered muscles
  const getMostRecoveredMuscles = (): MuscleGroup[] => {
    const all = (Object.keys(MUSCLES_INFO) as MuscleGroup[]).filter(m => m !== 'forearms');
    all.sort((a, b) => (recoveryState[b] ?? 100) - (recoveryState[a] ?? 100));
    return all.slice(0, 3);
  };

  const PRESETS: MusclePreset[] = [
    {
      id: 'best_recovered',
      name: 'Cơ Hồi Phục Tốt Nhất',
      tag: 'Tự động Fitbod',
      muscles: getMostRecoveredMuscles(),
      icon: '🎯'
    },
    {
      id: 'push',
      name: 'Đẩy (Push: Ngực, Vai, Tay sau)',
      tag: 'Ngực + Vai + Triceps',
      muscles: ['chest', 'shoulders', 'triceps'],
      icon: '🔥'
    },
    {
      id: 'pull',
      name: 'Kéo (Pull: Lưng xô, Tay trước)',
      tag: 'Lưng + Biceps',
      muscles: ['lats', 'upper_back', 'biceps'],
      icon: '⚡'
    },
    {
      id: 'legs',
      name: 'Chân & Mông (Legs & Glutes)',
      tag: 'Đùi + Mông + Bắp chân',
      muscles: ['quads', 'hamstrings', 'glutes', 'calves'],
      icon: '🦵'
    },
    {
      id: 'shoulders_abs',
      name: 'Vai & Cơ Bụng',
      tag: 'Vai + Cầu vai + Bụng',
      muscles: ['shoulders', 'traps', 'abs'],
      icon: '💥'
    },
    {
      id: 'chest_triceps',
      name: 'Ngực & Tay sau',
      tag: 'Chuyên ngực tay sau',
      muscles: ['chest', 'triceps'],
      icon: '💪'
    },
    {
      id: 'back_biceps',
      name: 'Lưng xô & Tay trước',
      tag: 'Chuyên xô chuột trước',
      muscles: ['lats', 'biceps'],
      icon: '🦅'
    },
    {
      id: 'upper',
      name: 'Thân Trên (Upper Body)',
      tag: 'Ngực + Lưng + Vai + Tay',
      muscles: ['chest', 'lats', 'upper_back', 'shoulders', 'biceps', 'triceps'],
      icon: '🏋️'
    },
    {
      id: 'full_body',
      name: 'Toàn Thân (Full Body)',
      tag: 'Tất cả nhóm cơ lớn',
      muscles: ['chest', 'lats', 'quads', 'hamstrings', 'shoulders', 'biceps', 'triceps'],
      icon: '🏃'
    }
  ];

  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelected(prev => {
      if (prev.includes(muscle)) {
        if (prev.length === 1) return prev; // Keep at least 1 muscle
        return prev.filter(m => m !== muscle);
      } else {
        return [...prev, muscle];
      }
    });
  };

  const handleSelectPreset = (preset: MusclePreset) => {
    setSelected(preset.muscles);
  };

  const allMuscles = Object.keys(MUSCLES_INFO) as MuscleGroup[];

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 max-h-[85dvh] sm:max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom duration-200 pb-[calc(1.25rem+env(safe-area-inset-bottom,20px))]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Chỉnh Nhóm Cơ Mục Tiêu Hôm Nay</h3>
              <p className="text-xs text-slate-500">Tùy chỉnh nhóm cơ Sếp muốn tập hôm nay</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 overscroll-contain">
          
          {/* Quick Presets Carousel */}
          <div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2">
              Bộ Gợi Ý Nhanh:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => {
                const isMatching = p.muscles.length === selected.length && p.muscles.every(m => selected.includes(m));
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-2xl text-left border transition active:scale-95 ${
                      isMatching
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">{p.icon}</span>
                      <span className="text-xs font-black truncate">{p.name}</span>
                    </div>
                    <span className={`text-[10px] block truncate ${isMatching ? 'text-blue-100 font-bold' : 'text-slate-400 font-medium'}`}>
                      {p.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Muscle Checkbox Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Hoặc Tự Tick Chọn Từng Nhóm Cơ ({selected.length} đang chọn):
              </span>
              <button
                type="button"
                onClick={() => setSelected(allMuscles)}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                Chọn tất cả
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allMuscles.map((m) => {
                const info = MUSCLES_INFO[m];
                const rec = recoveryState[m] ?? 100;
                const isChecked = selected.includes(m);

                // Status color based on recovery
                let recBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                let statusText = 'Phục hồi ' + rec + '%';
                if (rec < 50) {
                  recBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                  statusText = 'Mỏi ' + rec + '%';
                } else if (rec < 80) {
                  recBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                }

                return (
                  <div
                    key={m}
                    onClick={() => toggleMuscle(m)}
                    className={`p-2.5 rounded-2xl border cursor-pointer select-none transition flex items-center justify-between active:scale-[0.98] ${
                      isChecked
                        ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 shadow-2xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 truncate">
                          {info.nameVi}
                        </span>
                      </div>
                      <span className={`inline-block text-[9px] font-black px-1.5 py-0.2 rounded border mt-1 ${recBadgeColor}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition shrink-0 ml-2 ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-slate-50'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom CTA Apply */}
        <div className="pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => {
              onApply(selected);
              onClose();
            }}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-200 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Tạo Buổi Tập Cho {selected.length} Nhóm Cơ Đã Chọn
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Check, 
  Plus, 
  Minus, 
  Dumbbell, 
  Layers, 
  Flame, 
  Edit3, 
  Sparkles,
  Trash2,
  TrendingUp,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { PlannedExercise, WorkoutSet } from '../types';

interface EditExerciseModalProps {
  exercise: PlannedExercise;
  onSave: (updatedExercise: PlannedExercise) => void;
  onClose: () => void;
}

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  exercise,
  onSave,
  onClose
}) => {
  const [mode, setMode] = useState<'per_set' | 'all_sets'>('per_set');
  
  // Custom sets list
  const [customSets, setCustomSets] = useState<WorkoutSet[]>(() => {
    return JSON.parse(JSON.stringify(exercise.sets));
  });

  // Global values for "all_sets" mode
  const initialWeight = exercise.sets[0]?.targetWeight ?? 20;
  const initialReps = exercise.sets[0]?.targetReps ?? 10;
  const [globalWeight, setGlobalWeight] = useState<number>(initialWeight);
  const [globalReps, setGlobalReps] = useState<number>(initialReps);

  const weightStep = exercise.equipment === 'cable' 
    ? 1.25 
    : (exercise.equipment === 'dumbbell' ? 2 : 2.5);

  // Update single set field
  const handleUpdateSet = (index: number, field: 'targetWeight' | 'targetReps', value: number) => {
    setCustomSets(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: Math.max(field === 'targetReps' ? 1 : 0, Math.round(value * 100) / 100)
        };
      }
      return updated;
    });
  };

  // Step single set
  const handleStepSet = (index: number, field: 'targetWeight' | 'targetReps', delta: number) => {
    setCustomSets(prev => {
      const updated = [...prev];
      if (updated[index]) {
        const currentVal = updated[index][field];
        const nextVal = Math.max(field === 'targetReps' ? 1 : 0, Math.round((currentVal + delta) * 100) / 100);
        updated[index] = {
          ...updated[index],
          [field]: nextVal
        };
      }
      return updated;
    });
  };

  // Toggle set type (warmup, working, amrap)
  const handleToggleSetType = (index: number) => {
    setCustomSets(prev => {
      const updated = [...prev];
      if (updated[index]) {
        const currentType = updated[index].type;
        const nextType = currentType === 'working' 
          ? 'warmup' 
          : (currentType === 'warmup' ? 'amrap' : 'working');
        updated[index] = {
          ...updated[index],
          type: nextType
        };
      }
      return updated;
    });
  };

  // Add new set
  const handleAddSet = () => {
    const lastSet = customSets[customSets.length - 1];
    const newSet: WorkoutSet = {
      setIndex: customSets.length,
      type: 'working',
      targetWeight: lastSet ? lastSet.targetWeight : globalWeight,
      targetReps: lastSet ? lastSet.targetReps : globalReps,
      isCompleted: false,
      cableRatio: exercise.cableConfig?.pulleyRatio
    };
    setCustomSets(prev => [...prev, newSet]);
  };

  // Remove set at index
  const handleRemoveSet = (index: number) => {
    if (customSets.length <= 1) return;
    setCustomSets(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((s, i) => ({ ...s, setIndex: i }));
    });
  };

  // Apply Pyramid preset (+5kg, -2 reps per set)
  const handleApplyPyramid = () => {
    const baseW = customSets[0]?.targetWeight || 40;
    const baseR = 12;
    setCustomSets(prev => prev.map((s, idx) => {
      if (s.type === 'warmup') {
        return { ...s, targetWeight: Math.max(0, Math.round(baseW * 0.5)), targetReps: 12 };
      }
      const workingIdx = idx - prev.filter((item, i) => i < idx && item.type === 'warmup').length;
      return {
        ...s,
        targetWeight: Math.max(0, baseW + workingIdx * 5),
        targetReps: Math.max(4, baseR - workingIdx * 2)
      };
    }));
  };

  // Apply Drop Set preset (-15% weight, +2 reps)
  const handleApplyDropSet = () => {
    const baseW = customSets[0]?.targetWeight || 50;
    setCustomSets(prev => prev.map((s, idx) => ({
      ...s,
      targetWeight: Math.max(0, Math.round((baseW * (1 - idx * 0.15)) * 10) / 10),
      targetReps: Math.min(20, (s.targetReps || 10) + idx * 2)
    })));
  };

  // Toggle last set to AMRAP
  const handleMakeLastSetAmrap = () => {
    if (customSets.length === 0) return;
    setCustomSets(prev => {
      const updated = [...prev];
      const lastIdx = updated.length - 1;
      updated[lastIdx] = {
        ...updated[lastIdx],
        type: updated[lastIdx].type === 'amrap' ? 'working' : 'amrap'
      };
      return updated;
    });
  };

  // Apply all sets from global weight/reps
  const handleApplyGlobalToAll = () => {
    setCustomSets(prev => prev.map(s => ({
      ...s,
      targetWeight: s.type === 'warmup' ? Math.max(0, Math.round(globalWeight * 0.6)) : globalWeight,
      targetReps: globalReps
    })));
  };

  const handleSave = () => {
    let finalSets = customSets;
    if (mode === 'all_sets') {
      finalSets = customSets.map((s, idx) => ({
        ...s,
        setIndex: idx,
        targetWeight: s.type === 'warmup' ? Math.max(0, Math.round(globalWeight * 0.6)) : globalWeight,
        targetReps: globalReps
      }));
    } else {
      finalSets = customSets.map((s, idx) => ({
        ...s,
        setIndex: idx
      }));
    }

    onSave({
      ...exercise,
      sets: finalSets,
      isMaxEffort: finalSets.some(s => s.type === 'amrap')
    });
    onClose();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[86dvh] sm:max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                {exercise.exerciseName}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Tùy chỉnh tạ & reps từng hiệp
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition active:scale-95 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-50/70 border-b border-slate-100 shrink-0">
          <div className="grid grid-cols-2 gap-1 bg-slate-200/70 p-1 rounded-2xl">
            <button
              onClick={() => setMode('per_set')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                mode === 'per_set'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Từng Hiệp Riêng Biệt</span>
            </button>
            <button
              onClick={() => {
                setMode('all_sets');
                handleApplyGlobalToAll();
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                mode === 'all_sets'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Đều Nhau Mọi Hiệp</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">

          {mode === 'per_set' ? (
            <>
              {/* Quick Presets Bar */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Mẫu Lên Tạ Tự Động (1 Chạm):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={handleApplyPyramid}
                    className="p-2 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-left transition active:scale-95"
                  >
                    <span className="text-[10px] font-black text-blue-700 block">🔼 Kim Tự Tháp</span>
                    <span className="text-[9px] text-blue-600">+5kg • -2 reps</span>
                  </button>

                  <button
                    onClick={handleApplyDropSet}
                    className="p-2 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-xl text-left transition active:scale-95"
                  >
                    <span className="text-[10px] font-black text-purple-700 block">🔽 Drop Set</span>
                    <span className="text-[9px] text-purple-600">-15% tạ • +2 reps</span>
                  </button>

                  <button
                    onClick={handleMakeLastSetAmrap}
                    className="p-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left transition active:scale-95"
                  >
                    <span className="text-[10px] font-black text-amber-800 block">🔥 Hiệp AMRAP</span>
                    <span className="text-[9px] text-amber-700">Đẩy hết sức hiệp cuối</span>
                  </button>
                </div>
              </div>

              {/* Per-Set Editor List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Danh Sách {customSets.length} Hiệp Tập:
                  </span>
                  <span className="text-[11px] text-slate-400">Gõ số hoặc bấm +/-</span>
                </div>

                <div className="space-y-2">
                  {customSets.map((s, idx) => {
                    const isWarmup = s.type === 'warmup';
                    const isAmrap = s.type === 'amrap';

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border transition-all ${
                          isAmrap
                            ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                            : (isWarmup ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300')
                        }`}
                      >
                        {/* Row Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleSetType(idx)}
                              className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shadow-xs transition active:scale-90 ${
                                isWarmup
                                  ? 'bg-amber-400 text-amber-950'
                                  : (isAmrap ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black' : 'bg-blue-600 text-white')
                              }`}
                              title="Chạm để đổi loại hiệp: Khởi động / Chính / AMRAP"
                            >
                              {isWarmup ? 'W' : (isAmrap ? 'MAX' : idx + 1)}
                            </button>
                            <span className="text-xs font-black text-slate-900">
                              {isWarmup ? 'Hiệp Khởi Động' : (isAmrap ? 'Hiệp AMRAP (Hết sức)' : `Hiệp Chính ${idx + 1}`)}
                            </span>
                            <button
                              onClick={() => handleToggleSetType(idx)}
                              className="text-[10px] text-slate-400 hover:text-blue-600 underline font-medium"
                            >
                              (đổi loại)
                            </button>
                          </div>

                          {customSets.length > 1 && (
                            <button
                              onClick={() => handleRemoveSet(idx)}
                              className="p-1 text-slate-300 hover:text-rose-500 rounded-lg transition"
                              title="Xóa hiệp này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Controls Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          
                          {/* Weight Stepper */}
                          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                              Mức Tạ (kg)
                            </span>
                            <div className="flex items-center justify-between gap-1">
                              <button
                                onClick={() => handleStepSet(idx, 'targetWeight', -weightStep)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center active:scale-90 transition shrink-0"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center justify-center flex-1">
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  step="any"
                                  value={s.targetWeight === 0 ? '' : s.targetWeight}
                                  placeholder="0"
                                  onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    handleUpdateSet(idx, 'targetWeight', isNaN(v) ? 0 : v);
                                  }}
                                  onFocus={(e) => (e.target as HTMLInputElement).select()}
                                  className="w-14 text-center font-black text-base text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg py-1 px-0.5 outline-none"
                                />
                                <span className="text-[11px] font-bold text-slate-500 ml-1">kg</span>
                              </div>

                              <button
                                onClick={() => handleStepSet(idx, 'targetWeight', weightStep)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center active:scale-90 transition shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Reps Stepper */}
                          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                              Số Lần (Reps)
                            </span>
                            <div className="flex items-center justify-between gap-1">
                              <button
                                onClick={() => handleStepSet(idx, 'targetReps', -1)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center active:scale-90 transition shrink-0"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center justify-center flex-1">
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  step="1"
                                  value={s.targetReps === 0 ? '' : s.targetReps}
                                  placeholder="1"
                                  onChange={(e) => {
                                    const v = parseInt(e.target.value, 10);
                                    handleUpdateSet(idx, 'targetReps', isNaN(v) ? 1 : v);
                                  }}
                                  onFocus={(e) => (e.target as HTMLInputElement).select()}
                                  className="w-12 text-center font-black text-base text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg py-1 px-0.5 outline-none"
                                />
                                <span className="text-[11px] font-bold text-slate-500 ml-1">reps</span>
                              </div>

                              <button
                                onClick={() => handleStepSet(idx, 'targetReps', 1)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center active:scale-90 transition shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Set Button */}
                <button
                  onClick={handleAddSet}
                  disabled={customSets.length >= 10}
                  className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Hiệp Thứ {customSets.length + 1}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* All Sets Mode */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Mức Tạ Chung Cho Mọi Hiệp (kg)
                  </span>
                  <span className="text-xs text-blue-600 font-bold">Bước ±{weightStep}kg</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setGlobalWeight(prev => Math.max(0, prev - weightStep))}
                    className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-200 text-slate-800 font-black text-lg flex items-center justify-center border border-slate-200 shadow-sm active:scale-90 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="text-center px-4 py-1 bg-white rounded-2xl border border-blue-400 min-w-[130px]">
                    <span className="text-3xl font-black text-slate-900 block leading-tight">
                      {globalWeight}
                    </span>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                      Kilograms
                    </span>
                  </div>

                  <button
                    onClick={() => setGlobalWeight(prev => prev + weightStep)}
                    className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-200 text-slate-800 font-black text-lg flex items-center justify-center border border-slate-200 shadow-sm active:scale-90 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick weight adjustment pills */}
                <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-slate-200/60">
                  {[-10, -5, -2.5, 2.5, 5, 10].map(delta => (
                    <button
                      key={delta}
                      onClick={() => setGlobalWeight(prev => Math.max(0, prev + delta))}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black transition active:scale-95 ${
                        delta > 0 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reps for all sets */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Số Reps Chung Cho Mọi Hiệp
                </span>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setGlobalReps(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-black text-base flex items-center justify-center border border-slate-200 shadow-xs active:scale-90 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center px-4 py-1 bg-white rounded-xl border border-blue-400 min-w-[110px]">
                    <span className="text-2xl font-black text-slate-900 block leading-tight">
                      {globalReps}
                    </span>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                      Reps
                    </span>
                  </div>

                  <button
                    onClick={() => setGlobalReps(prev => prev + 1)}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-black text-base flex items-center justify-center border border-slate-200 shadow-xs active:scale-90 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick reps buttons */}
                <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-slate-200/60">
                  {[6, 8, 10, 12, 15].map(r => (
                    <button
                      key={r}
                      onClick={() => setGlobalReps(r)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition active:scale-95 ${
                        globalReps === r 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sets Count */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Số Lượng Hiệp
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Đang có {customSets.length} hiệp
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={customSets.length <= 1}
                    onClick={() => handleRemoveSet(customSets.length - 1)}
                    className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center border border-slate-200 shadow-xs disabled:opacity-40 active:scale-90 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-lg font-black text-slate-900">
                    {customSets.length}
                  </span>
                  <button
                    disabled={customSets.length >= 8}
                    onClick={handleAddSet}
                    className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center border border-slate-200 shadow-xs disabled:opacity-40 active:scale-90 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex gap-2 pb-[calc(1rem+env(safe-area-inset-bottom,16px))]">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs active:scale-95 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-md shadow-blue-200 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            LƯU {customSets.length} HIỆP NÀY
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

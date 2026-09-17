import { HERNIATED_DISC_EXCLUDED_IDS, SPINE_SAFE_ALTERNATIVES, SPINE_SAFETY_REASONS, isExerciseSpineSafe } from '../data/spineSafety';
import { Shield, ShieldAlert, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, RefreshCw, Dumbbell, Search, Check, Filter, Target, Sparkles, Star, Ban } from 'lucide-react';
import { PlannedExercise, ExerciseItem, EquipmentType } from '../types';
import { 
  EXERCISE_CATALOG, 
  MUSCLES_INFO 
} from '../data/exerciseCatalog';
import { 
  getExercisePreferences, 
  setExercisePreference, 
  subscribeExercisePreferences, 
  ExercisePreferenceStatus 
} from '../utils/exercisePreferences';

interface SwapExerciseModalProps {
  currentExercise: PlannedExercise;
  onSelectAlternative: (newExercise: ExerciseItem) => void;
  onClose: () => void;
  excludedExerciseIds?: string[];
  spineSafeMode?: boolean;
  exercisePreferences?: Record<string, ExercisePreferenceStatus>;
  onTogglePreference?: (exerciseId: string, pref: ExercisePreferenceStatus) => void;
}

export const SwapExerciseModal: React.FC<SwapExerciseModalProps> = ({
  currentExercise,
  onSelectAlternative,
  onClose,
  excludedExerciseIds,
  spineSafeMode = true,
  exercisePreferences,
  onTogglePreference
}) => {
  const [internalPrefs, setInternalPrefs] = useState<Record<string, ExercisePreferenceStatus>>(() => {
    return (exercisePreferences as Record<string, ExercisePreferenceStatus>) || getExercisePreferences();
  });

  useEffect(() => {
    return subscribeExercisePreferences(() => {
      setInternalPrefs(getExercisePreferences());
    });
  }, []);

  const currentPrefs = exercisePreferences || internalPrefs;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');

  // Find all exercises targeting similar muscles
  const currentMuscles = currentExercise.primaryMuscles.map(m => m.toLowerCase());
  const currentHead = currentExercise.muscleTarget?.primaryHead;

  // Filter alternatives from catalog (excluding current exercise, missing machines, spine-harmful, and excluded by user)
  const allAlternatives = EXERCISE_CATALOG.filter(ex => {
    if (ex.id === currentExercise.exerciseId) return false;
    if (ex.id.startsWith('cardio_')) return false;
    if (excludedExerciseIds && excludedExerciseIds.includes(ex.id)) return false;
    if (spineSafeMode && HERNIATED_DISC_EXCLUDED_IDS.includes(ex.id)) return false;
    // Nếu bị loại trừ bởi user và không tìm kiếm đích danh
    if (!searchTerm.trim() && currentPrefs[ex.id] === 'exclude') return false;
    return true;
  });

  // Sort & Score: prioritize same sub-muscle head first, favorite, then same primary muscle
  const scoredAlternatives = allAlternatives.map(ex => {
    let score = 0;
    // Favorite bài tập: +25 điểm
    if (currentPrefs[ex.id] === 'favorite') {
      score += 25;
    }
    // Same exact muscle head (e.g. both are vai_giua or vai_truoc)
    if (currentHead && ex.muscleTarget?.primaryHead === currentHead) {
      score += 10;
    }
    // Same primary muscle group
    const exMuscleNamesVi = ex.primaryMuscles.map(pm => (MUSCLES_INFO[pm.muscle]?.nameVi || '').toLowerCase());
    const matchesPrimary = exMuscleNamesVi.some(name => currentMuscles.some(cm => cm.includes(name) || name.includes(cm)));
    if (matchesPrimary) {
      score += 5;
    }
    return { exercise: ex, score };
  });

  // Sort by relevance score descending
  scoredAlternatives.sort((a, b) => b.score - a.score);

  // Apply search & equipment filter
  const filtered = scoredAlternatives.filter(({ exercise }) => {
    if (selectedEquipment !== 'all' && exercise.equipment !== selectedEquipment) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const nameMatch = exercise.name.toLowerCase().includes(q);
      const headMatch = exercise.muscleTarget?.primaryHeadNameVi.toLowerCase().includes(q);
      return nameMatch || headMatch;
    }
    return true;
  });

  const handleRandomQuickSwap = () => {
    // Pick from top relevant candidates (score >= 5)
    const topCandidates = scoredAlternatives.filter(s => s.score >= 5).map(s => s.exercise);
    const pool = topCandidates.length > 0 ? topCandidates : allAlternatives;
    if (pool.length > 0) {
      const randomPicked = pool[Math.floor(Math.random() * pool.length)];
      onSelectAlternative(randomPicked);
    }
  };

  const getEquipmentLabel = (eq: EquipmentType) => {
    switch (eq) {
      case 'barbell': return 'Tạ đòn';
      case 'dumbbell': return 'Tạ đơn';
      case 'cable': return 'Máy cáp';
      case 'machine': return 'Máy khối';
      case 'bodyweight': return 'Bodyweight';
      default: return eq;
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 max-h-[86dvh] sm:max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom duration-200 pb-[calc(1.25rem+env(safe-area-inset-bottom,20px))]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Đổi Bài Tập Khác</h3>
              <p className="text-xs text-slate-500">
                Thay thế cho: <span className="font-bold text-slate-700">{currentExercise.exerciseName}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions & Search Bar */}
        <div className="pt-3 pb-2 space-y-2.5 shrink-0">
          
          {/* 1-Tap Random Swap button */}
          <button
            onClick={handleRandomQuickSwap}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs shadow-sm flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Đổi Nhanh 1 Bài Tương Đương Ngẫu Nhiên</span>
          </button>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm bài thay thế theo tên hoặc nhóm cơ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-semibold text-slate-900 outline-none transition"
            />
          </div>

          {/* Equipment Filter Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'dumbbell', label: 'Tạ đơn' },
              { id: 'barbell', label: 'Tạ đòn' },
              { id: 'cable', label: 'Máy cáp' },
              { id: 'machine', label: 'Máy tập' },
              { id: 'bodyweight', label: 'Tự do' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedEquipment(tab.id)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition ${
                  selectedEquipment === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Alternative Exercises List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Không tìm thấy bài tập thay thế phù hợp với bộ lọc.
            </div>
          ) : (
            filtered.map(({ exercise, score }) => {
              const hasThumbnail = exercise.images && exercise.images.length > 0;
              const isHighMatch = score >= 5;

              return (
                <div
                  key={exercise.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isHighMatch
                      ? 'bg-white border-slate-200/90 hover:border-blue-400 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200/60'
                  }`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                      {hasThumbnail ? (
                        <img
                          src={exercise.images![0]}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
                          {getEquipmentLabel(exercise.equipment)}
                        </span>
                        {isHighMatch && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Cùng nhóm cơ
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-xs truncate leading-snug">
                        {exercise.name}
                      </h4>

                      {exercise.muscleTarget ? (
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-rose-600">
                          <Target className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{exercise.muscleTarget.primaryHeadNameVi}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {exercise.primaryMuscles.map(pm => MUSCLES_INFO[pm.muscle]?.nameVi || pm.muscle).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Favorite, Exclude, and Select Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isFav = currentPrefs[exercise.id] === 'favorite';
                        const nextStatus: ExercisePreferenceStatus = isFav ? 'standard' : 'favorite';
                        setExercisePreference(exercise.id, nextStatus);
                        setInternalPrefs(prev => ({ ...prev, [exercise.id]: nextStatus }));
                        onTogglePreference?.(exercise.id, isFav ? 'standard' : 'favorite');
                      }}
                      className={`p-2 rounded-xl border transition active:scale-90 shadow-2xs ${
                        currentPrefs[exercise.id] === 'favorite'
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                      }`}
                      title={currentPrefs[exercise.id] === 'favorite' ? "Bỏ ưu tiên" : "Ưu tiên bài này (⭐)"}
                    >
                      <Star className={`w-4 h-4 ${currentPrefs[exercise.id] === 'favorite' ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isExc = currentPrefs[exercise.id] === 'exclude';
                        const nextStatus: ExercisePreferenceStatus = isExc ? 'standard' : 'exclude';
                        if (!isExc && !window.confirm(`Sếp có muốn loại trừ bài "${exercise.name}" khỏi các buổi tập không?`)) {
                          return;
                        }
                        setExercisePreference(exercise.id, nextStatus);
                        setInternalPrefs(prev => ({ ...prev, [exercise.id]: nextStatus }));
                        onTogglePreference?.(exercise.id, isExc ? 'standard' : 'exclude');
                      }}
                      className={`p-2 rounded-xl border transition active:scale-90 shadow-2xs ${
                        currentPrefs[exercise.id] === 'exclude'
                          ? 'bg-rose-100 border-rose-300 text-rose-900'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title={currentPrefs[exercise.id] === 'exclude' ? "Bỏ loại trừ" : "Chặn / Loại trừ bài này (🚫)"}
                    >
                      <Ban className="w-4 h-4 text-rose-500" />
                    </button>

                    <button
                      onClick={() => onSelectAlternative(exercise)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shrink-0 active:scale-95 transition shadow-sm flex items-center gap-1"
                    >
                      <span>Chọn</span>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );

  const recommendedAltId = SPINE_SAFE_ALTERNATIVES[currentExercise.exerciseId];
  const recommendedAlt = recommendedAltId ? EXERCISE_CATALOG.find(e => e.id === recommendedAltId) : null;
  const isCurrentRisky = HERNIATED_DISC_EXCLUDED_IDS.includes(currentExercise.exerciseId);
  const spineReason = SPINE_SAFETY_REASONS[currentExercise.exerciseId];
  return createPortal(modalContent, document.body);
};

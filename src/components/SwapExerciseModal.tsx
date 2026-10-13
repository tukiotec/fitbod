import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  RefreshCw, 
  Dumbbell, 
  Search, 
  Check, 
  Target, 
  Sparkles, 
  Star, 
  Ban, 
  Layers, 
  ChevronDown,
  ShieldAlert,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { 
  HERNIATED_DISC_EXCLUDED_IDS, 
  SPINE_SAFE_ALTERNATIVES, 
  SPINE_SAFETY_REASONS 
} from '../data/spineSafety';
import { PlannedExercise, ExerciseItem, EquipmentType, MuscleGroup } from '../types';
import { 
  EXERCISE_CATALOG, 
  MUSCLES_INFO,
  findExerciseInCatalog 
} from '../data/exerciseCatalog';
import { 
  getExercisePreferences, 
  setExercisePreference, 
  subscribeExercisePreferences, 
  ExercisePreferenceStatus 
} from '../utils/exercisePreferences';

const ALL_MUSCLE_GROUPS: { id: MuscleGroup; label: string; icon: string }[] = [
  { id: 'chest', label: 'Ngực', icon: '🏋️' },
  { id: 'shoulders', label: 'Vai', icon: '🎯' },
  { id: 'triceps', label: 'Tay sau', icon: '💪' },
  { id: 'lats', label: 'Lưng xô', icon: '🦅' },
  { id: 'upper_back', label: 'Lưng trên', icon: '🛡️' },
  { id: 'lower_back', label: 'Lưng dưới', icon: '🧱' },
  { id: 'biceps', label: 'Tay trước', icon: '💥' },
  { id: 'forearms', label: 'Cẳng tay', icon: '✊' },
  { id: 'quads', label: 'Đùi trước', icon: '🦵' },
  { id: 'hamstrings', label: 'Đùi sau', icon: '⚡' },
  { id: 'glutes', label: 'Mông', icon: '🍑' },
  { id: 'calves', label: 'Bắp chân', icon: '👟' },
  { id: 'abs', label: 'Cơ bụng', icon: '🍫' },
  { id: 'traps', label: 'Cầu vai', icon: '🔺' },
];

function resolveMuscleKey(muscleStr?: string): MuscleGroup | undefined {
  if (!muscleStr) return undefined;
  const s = muscleStr.toLowerCase().trim();
  for (const [key, info] of Object.entries(MUSCLES_INFO)) {
    if (key.toLowerCase() === s || info.nameVi.toLowerCase() === s || info.nameEn.toLowerCase() === s) {
      return key as MuscleGroup;
    }
  }
  return undefined;
}

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
  const [selectedMuscle, setSelectedMuscle] = useState<string>('similar');
  const [showMuscleGrid, setShowMuscleGrid] = useState<boolean>(false);

  // Check if current exercise is cardio
  const isCurrentCardio = currentExercise.exerciseId.startsWith('cardio_') || currentExercise.isCardio;

  // Resolve primary muscle of current exercise
  const catalogExercise = useMemo(() => {
    return findExerciseInCatalog(currentExercise.exerciseId) || 
           EXERCISE_CATALOG.find(c => c.id === currentExercise.exerciseId);
  }, [currentExercise.exerciseId]);

  const currentPrimaryMuscleKey = useMemo<MuscleGroup | undefined>(() => {
    if (catalogExercise?.primaryMuscles?.[0]?.muscle) {
      return catalogExercise.primaryMuscles[0].muscle;
    }
    return resolveMuscleKey(currentExercise.primaryMuscles?.[0]);
  }, [catalogExercise, currentExercise.primaryMuscles]);

  const currentMuscleNameVi = currentPrimaryMuscleKey ? MUSCLES_INFO[currentPrimaryMuscleKey]?.nameVi : 'Cùng nhóm cơ';
  const currentMuscles = currentExercise.primaryMuscles.map(m => m.toLowerCase());
  const currentHead = currentExercise.muscleTarget?.primaryHead;

  // Filter all potential alternatives from catalog
  const allAlternatives = useMemo(() => {
    return EXERCISE_CATALOG.filter(ex => {
      if (ex.id === currentExercise.exerciseId) return false;
      if (isCurrentCardio) {
        return ex.id.startsWith('cardio_') || ex.movementPattern === 'cardio';
      }
      if (ex.id.startsWith('cardio_') || ex.movementPattern === 'cardio') return false;
      if (excludedExerciseIds && excludedExerciseIds.includes(ex.id)) return false;
      if (spineSafeMode && HERNIATED_DISC_EXCLUDED_IDS.includes(ex.id)) return false;
      if (!searchTerm.trim() && currentPrefs[ex.id] === 'exclude') return false;
      return true;
    });
  }, [currentExercise.exerciseId, isCurrentCardio, excludedExerciseIds, spineSafeMode, searchTerm, currentPrefs]);

  // List of muscle groups with exercise counts
  const muscleGroupsList = useMemo(() => {
    if (isCurrentCardio) {
      return [{ id: 'cardio', label: 'Cardio', icon: '🏃', count: allAlternatives.length }];
    }

    const similarCount = allAlternatives.filter(ex => {
      if (currentPrimaryMuscleKey) {
        return ex.primaryMuscles.some(pm => pm.muscle === currentPrimaryMuscleKey);
      }
      const exNames = ex.primaryMuscles.map(pm => (MUSCLES_INFO[pm.muscle]?.nameVi || '').toLowerCase());
      return exNames.some(name => currentMuscles.some(cm => cm.includes(name) || name.includes(cm)));
    }).length;

    return [
      {
        id: 'similar',
        label: `Cùng nhóm cơ (${currentMuscleNameVi})`,
        icon: '🎯',
        count: similarCount
      },
      ...ALL_MUSCLE_GROUPS.map(mg => ({
        id: mg.id,
        label: mg.label,
        icon: mg.icon,
        count: allAlternatives.filter(ex => ex.primaryMuscles.some(pm => pm.muscle === mg.id)).length
      })),
      {
        id: 'all',
        label: 'Tất cả nhóm cơ',
        icon: '🌐',
        count: allAlternatives.length
      }
    ];
  }, [allAlternatives, currentMuscleNameVi, currentPrimaryMuscleKey, currentMuscles, isCurrentCardio]);

  const activeMuscleTab = muscleGroupsList.find(m => m.id === selectedMuscle) || muscleGroupsList[0];

  // 1. Filter alternatives by selected muscle
  const muscleFilteredAlternatives = useMemo(() => {
    if (isCurrentCardio) return allAlternatives;

    if (selectedMuscle === 'similar') {
      return allAlternatives.filter(ex => {
        if (currentPrimaryMuscleKey) {
          return ex.primaryMuscles.some(pm => pm.muscle === currentPrimaryMuscleKey);
        }
        const exNames = ex.primaryMuscles.map(pm => (MUSCLES_INFO[pm.muscle]?.nameVi || '').toLowerCase());
        return exNames.some(name => currentMuscles.some(cm => cm.includes(name) || name.includes(cm)));
      });
    }

    if (selectedMuscle === 'all') {
      return allAlternatives;
    }

    return allAlternatives.filter(ex => ex.primaryMuscles.some(pm => pm.muscle === selectedMuscle));
  }, [allAlternatives, selectedMuscle, currentPrimaryMuscleKey, currentMuscles, isCurrentCardio]);

  // 2. Sort & Score
  const scoredAlternatives = useMemo(() => {
    return muscleFilteredAlternatives.map(ex => {
      let score = 0;
      if (currentPrefs[ex.id] === 'favorite') {
        score += 25;
      }
      if (currentHead && ex.muscleTarget?.primaryHead === currentHead) {
        score += 10;
      }
      const exMuscleNamesVi = ex.primaryMuscles.map(pm => (MUSCLES_INFO[pm.muscle]?.nameVi || '').toLowerCase());
      const matchesPrimary = exMuscleNamesVi.some(name => currentMuscles.some(cm => cm.includes(name) || name.includes(cm)));
      if (matchesPrimary) {
        score += 5;
      }
      return { exercise: ex, score };
    }).sort((a, b) => b.score - a.score);
  }, [muscleFilteredAlternatives, currentPrefs, currentHead, currentMuscles]);

  // 3. Search & Equipment Filter
  const filtered = useMemo(() => {
    return scoredAlternatives.filter(({ exercise }) => {
      if (selectedEquipment !== 'all' && exercise.equipment !== selectedEquipment) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const nameMatch = exercise.name.toLowerCase().includes(q);
        const headMatch = exercise.muscleTarget?.primaryHeadNameVi?.toLowerCase().includes(q);
        const muscleMatch = exercise.primaryMuscles.some(pm => {
          const mInfo = MUSCLES_INFO[pm.muscle];
          return mInfo?.nameVi.toLowerCase().includes(q) || mInfo?.nameEn.toLowerCase().includes(q);
        });
        return nameMatch || headMatch || muscleMatch;
      }
      return true;
    });
  }, [scoredAlternatives, selectedEquipment, searchTerm]);

  // 4. Grouped by Muscle (when 'all' is selected without active search)
  const groupedByMuscle = useMemo(() => {
    if (selectedMuscle !== 'all' || searchTerm.trim() || isCurrentCardio) return null;
    const groups: { muscle: MuscleGroup; label: string; icon: string; items: typeof filtered }[] = [];
    const map = new Map<MuscleGroup, typeof filtered>();

    for (const item of filtered) {
      const pm = item.exercise.primaryMuscles[0]?.muscle || 'chest';
      if (!map.has(pm)) {
        map.set(pm, []);
      }
      map.get(pm)!.push(item);
    }

    for (const mg of ALL_MUSCLE_GROUPS) {
      const items = map.get(mg.id);
      if (items && items.length > 0) {
        groups.push({
          muscle: mg.id,
          label: mg.label,
          icon: mg.icon,
          items
        });
      }
    }
    return groups;
  }, [filtered, selectedMuscle, searchTerm, isCurrentCardio]);

  const handleRandomQuickSwap = () => {
    const pool = filtered.length > 0 ? filtered.map(f => f.exercise) : allAlternatives;
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
      case 'resistance_band': return 'Dây kháng lực';
      default: return eq;
    }
  };

  const recommendedAltId = SPINE_SAFE_ALTERNATIVES[currentExercise.exerciseId];
  const recommendedAlt = recommendedAltId ? findExerciseInCatalog(recommendedAltId) || EXERCISE_CATALOG.find(e => e.id === recommendedAltId) : null;
  const isCurrentRisky = HERNIATED_DISC_EXCLUDED_IDS.includes(currentExercise.exerciseId);
  const spineReason = SPINE_SAFETY_REASONS[currentExercise.exerciseId];

  const renderExerciseCard = ({ exercise, score }: { exercise: ExerciseItem; score: number }) => {
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
                loading="lazy"
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
              <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
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
              onTogglePreference?.(exercise.id, nextStatus);
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
              onTogglePreference?.(exercise.id, nextStatus);
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
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 border border-slate-200 max-h-[88dvh] sm:max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom duration-200 pb-[calc(1.25rem+env(safe-area-inset-bottom,20px))]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 text-base leading-tight">Đổi Bài Tập Khác</h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Thay thế cho: <span className="font-bold text-slate-800">{currentExercise.exerciseName}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 shrink-0 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions & Filters Bar */}
        <div className="pt-2.5 pb-2 space-y-2.5 shrink-0 border-b border-slate-100">
          
          {/* Spine Safety Warning if current exercise has spinal load */}
          {isCurrentRisky && recommendedAlt && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="text-[11px] text-amber-900 leading-tight min-w-0">
                  <span className="font-extrabold text-amber-950">Gợi ý an toàn cột sống: </span>
                  <span className="truncate">{recommendedAlt.name}</span>
                </div>
              </div>
              <button
                onClick={() => onSelectAlternative(recommendedAlt)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] rounded-lg shrink-0 transition active:scale-95 shadow-2xs"
              >
                Đổi ngay
              </button>
            </div>
          )}

          {/* 1-Tap Random Swap button */}
          <button
            onClick={handleRandomQuickSwap}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs shadow-sm flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Đổi Nhanh 1 Bài Ngẫu Nhiên ({activeMuscleTab.label})</span>
          </button>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Tìm bài ${selectedMuscle !== 'all' ? activeMuscleTab.label : 'thay thế'} theo tên...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-semibold text-slate-900 outline-none transition"
            />
          </div>

          {/* 🎯 BỘ LỌC CHỌN THEO NHÓM CƠ (MUSCLE GROUP SELECTOR) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Nhóm Cơ Mục Tiêu</span>
              </div>
              <button
                onClick={() => setShowMuscleGrid(!showMuscleGrid)}
                className="text-[11px] font-extrabold text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200/80 active:scale-95 transition"
              >
                <span>{activeMuscleTab.icon} {activeMuscleTab.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMuscleGrid ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Popup Grid: 14 nhóm cơ trực quan khi Sếp ấn mở */}
            {showMuscleGrid && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-in fade-in zoom-in-95 duration-150 max-h-52 overflow-y-auto shadow-inner">
                {muscleGroupsList.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedMuscle(tab.id);
                      setShowMuscleGrid(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition flex items-center justify-between gap-1.5 ${
                      selectedMuscle === tab.id
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold truncate flex items-center gap-1.5">
                      <span>{tab.icon}</span>
                      <span className="truncate">{tab.label}</span>
                    </span>
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                      selectedMuscle === tab.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Thanh cuộn ngang chọn nhanh nhóm cơ */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
              {muscleGroupsList.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedMuscle(tab.id);
                    setShowMuscleGrid(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                    selectedMuscle === tab.id
                      ? 'bg-blue-600 text-white shadow-xs font-black ring-2 ring-blue-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedMuscle === tab.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Filter Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
            {[
              { id: 'all', label: 'Tất cả thiết bị' },
              { id: 'dumbbell', label: 'Tạ đơn' },
              { id: 'barbell', label: 'Tạ đòn' },
              { id: 'cable', label: 'Máy cáp' },
              { id: 'machine', label: 'Máy tập' },
              { id: 'bodyweight', label: 'Tự do' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedEquipment(tab.id)}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition ${
                  selectedEquipment === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Status Info Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-0.5">
            <span>
              Tìm thấy <strong className="text-slate-900 font-bold">{filtered.length}</strong> bài tập
              {selectedMuscle !== 'all' && (
                <> thuộc nhóm <strong className="text-blue-600 font-bold">{activeMuscleTab.label}</strong></>
              )}
            </span>
            {selectedMuscle !== 'similar' && (
              <button
                onClick={() => setSelectedMuscle('similar')}
                className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
              >
                Về cùng nhóm cơ
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Alternative Exercises List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Dumbbell className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Không tìm thấy bài tập thay thế phù hợp
              </p>
              <p className="text-[11px] text-slate-400">
                Thử đổi thiết bị sang "Tất cả thiết bị" hoặc chọn nhóm cơ khác.
              </p>
              <button
                onClick={() => {
                  setSelectedEquipment('all');
                  setSelectedMuscle('all');
                  setSearchTerm('');
                }}
                className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : groupedByMuscle ? (
            /* Khi chọn "Tất cả nhóm cơ": Gom nhóm theo từng nhóm cơ có tiêu đề phân cách rõ ràng */
            groupedByMuscle.map(grp => (
              <div key={grp.muscle} className="space-y-2 mb-4">
                <div className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-black text-slate-800 shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <span>{grp.icon}</span>
                    <span>{grp.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {grp.items.length} bài
                  </span>
                </div>
                <div className="space-y-2">
                  {grp.items.map(item => renderExerciseCard(item))}
                </div>
              </div>
            ))
          ) : (
            /* Khi chọn 1 nhóm cơ cụ thể hoặc đang tìm kiếm: Hiển thị danh sách bài sạch sẽ */
            filtered.map(item => renderExerciseCard(item))
          )}
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, 
  Activity, 
  Trophy, 
  Settings, 
  Smartphone, 
  CheckCircle2, 
  Sparkles,
  Share2,
  ChevronRight,
  ChevronDown,
  User,
  RotateCcw
} from 'lucide-react';
import { 
  MuscleGroup, 
  WorkoutPlan, 
  PlannedExercise,
  FitnessGoal, 
  FitnessSplit, 
  EquipmentType,
  CardioType,
  ExerciseItem,
  ExerciseHistoryRecord,
  EquipmentPreference,
  UserBodyProfile,
  FitnessLevel,
  Gender
} from './types';
import { MUSCLES_INFO, EXERCISE_CATALOG } from './data/exerciseCatalog';
import { 
  calculateDynamicRecovery, 
  generateSmartWorkout,
  calculateCompletedWorkoutFatigue,
  calculateE1RM,
  calculateTailoredWeight,
  roundGymWeight,
  calculateExerciseRestSeconds,
  sanitizeWorkoutForSpineSafety
} from './engine/fitbodEngine';
import { ALL_MACHINE_IDS, getExcludedExerciseIds } from './data/gymMachines';

import { WorkoutTab } from './components/WorkoutTab';
import { RecoveryTab } from './components/RecoveryTab';
import { HistoryTab } from './components/HistoryTab';
import { PlanTab } from './components/PlanTab';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { ProfileManagerModal } from './components/ProfileManagerModal';
import { GymMachinesModal } from './components/GymMachinesModal';
import { 
  getActiveProfile, 
  getProfileItem, 
  setProfileItem, 
  removeProfileItem 
} from './utils/profileStorage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workout' | 'recovery' | 'history' | 'plan'>('workout');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const activeProfile = getActiveProfile();

  // Plan preferences
  const [goal, setGoal] = useState<FitnessGoal>(() => {
    return (getProfileItem('fitbod_goal') as FitnessGoal) || 'hypertrophy';
  });
  const [split, setSplit] = useState<FitnessSplit>(() => {
    return (getProfileItem('fitbod_split') as FitnessSplit) || 'push_pull_legs';
  });
  const [duration, setDuration] = useState<number>(() => {
    return parseInt(getProfileItem('fitbod_duration') || '60', 10);
  });
  const [equipment, setEquipment] = useState<EquipmentType[]>(() => {
    const saved = getProfileItem('fitbod_equipment');
    return saved ? JSON.parse(saved) : ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'];
  });

  // Warmup & Cardio preferences
  const [includeWarmup, setIncludeWarmup] = useState<boolean>(() => {
    const saved = getProfileItem('fitbod_warmup');
    return saved !== null ? saved === 'true' : true;
  });
  const [cardioType, setCardioType] = useState<CardioType>(() => {
    return (getProfileItem('fitbod_cardio_type') as CardioType) || 'none';
  });
  const [cardioDuration, setCardioDuration] = useState<number>(() => {
    return parseInt(getProfileItem('fitbod_cardio_duration') || '15', 10);
  });

  // Muscle recovery states
  const [recoveryState, setRecoveryState] = useState<Record<MuscleGroup, number>>(() => {
    const saved = getProfileItem('fitbod_recovery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Tự động phục hồi nếu trước đó bị lỗi trừ cứng 10% lưng xô khi chỉ tập 1 set
        if (parsed.lats === 10 && (parsed.chest >= 90 || !parsed.chest)) {
          parsed.lats = 96;
        }
        return parsed;
      } catch (e) {}
    }
    const initial: Record<MuscleGroup, number> = {} as any;
    (Object.keys(MUSCLES_INFO) as MuscleGroup[]).forEach(m => { initial[m] = 100; });
    return initial;
  });

  // Custom target muscles
  const [customTargetMuscles, setCustomTargetMuscles] = useState<MuscleGroup[] | null>(() => {
    try {
      const saved = getProfileItem('fitbod_target_muscles');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Exercise training history to calculate Fitbod Max Effort periodic cycles
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, ExerciseHistoryRecord>>(() => {
    try {
      const saved = getProfileItem('fitbod_exercise_history');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Equipment Preference (Tạ tay, Tạ đòn, Cáp, Máy khối, Tất cả)
  const [equipmentPreference, setEquipmentPreference] = useState<EquipmentPreference>(() => {
    return (getProfileItem('fitbod_equipment_preference') as EquipmentPreference) || 'all';
  });

  // Gym Machine selection
  const [availableMachines, setAvailableMachines] = useState<string[]>(() => {
    try {
      const saved = getProfileItem('fitbod_available_machines');
      return saved ? JSON.parse(saved) : ALL_MACHINE_IDS;
    } catch (e) {
      return ALL_MACHINE_IDS;
    }
  });
  const [showMachinesModal, setShowMachinesModal] = useState<boolean>(false);

  const excludedExerciseIds = useMemo(() => {
    return getExcludedExerciseIds(availableMachines);
  }, [availableMachines]);

  // User Body Profile & Fitness Level (Beginner / Advanced / Expert, kg, cm, gender)
  const [bodyProfile, setBodyProfile] = useState<UserBodyProfile>(() => {
    try {
      const saved = getProfileItem('fitbod_body_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.spineSafeMode === undefined) {
          parsed.spineSafeMode = true; // Mặc định bảo vệ cột sống cho Sếp
        }
        return parsed;
      }
    } catch (e) {}
    return {
      level: 'advanced',
      gender: 'male',
      weightKg: 70,
      heightCm: 172,
      spineSafeMode: true
    };
  });

  // Current Workout Plan
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan>(() => {
    let savedTargetMuscles: MuscleGroup[] | undefined = undefined;
    let savedHistory: Record<string, ExerciseHistoryRecord> | undefined = undefined;
    let savedPref: EquipmentPreference = 'all';
    let savedMachines: string[] = ALL_MACHINE_IDS;
    let savedProfile: UserBodyProfile | undefined = undefined;
    try {
      const savedM = getProfileItem('fitbod_target_muscles');
      if (savedM) savedTargetMuscles = JSON.parse(savedM);
      const savedH = getProfileItem('fitbod_exercise_history');
      if (savedH) savedHistory = JSON.parse(savedH);
      const savedP = getProfileItem('fitbod_equipment_preference');
      if (savedP) savedPref = savedP as EquipmentPreference;
      const savedMach = getProfileItem('fitbod_available_machines');
      if (savedMach) savedMachines = JSON.parse(savedMach);
      const savedProf = getProfileItem('fitbod_body_profile');
      if (savedProf) {
        savedProfile = JSON.parse(savedProf);
        if (savedProfile && savedProfile.spineSafeMode === undefined) {
          savedProfile.spineSafeMode = true;
        }
      } else {
        savedProfile = { level: 'advanced', gender: 'male', weightKg: 70, heightCm: 172, spineSafeMode: true };
      }
    } catch (e) {}
    const initialExcluded = getExcludedExerciseIds(savedMachines);
    return generateSmartWorkout(
      recoveryState, 
      equipment, 
      goal, 
      split, 
      duration, 
      includeWarmup, 
      cardioType, 
      cardioDuration,
      savedTargetMuscles,
      savedHistory,
      savedPref,
      initialExcluded,
      undefined,
      savedProfile
    );
  });

  // Active workout modal & minimize state
  const [isWorkingOut, setIsWorkingOut] = useState<boolean>(() => {
    return !!getProfileItem('fitbod_active_session');
  });
  const [isWorkoutMinimized, setIsWorkoutMinimized] = useState<boolean>(false);
  const [finishedSummary, setFinishedSummary] = useState<any | null>(null);
  const [activeProgress, setActiveProgress] = useState<{
    currentExerciseName: string;
    completedSets: number;
    totalSets: number;
    workoutSeconds: number;
    restSecondsRemaining?: number;
  } | null>(null);

  const handleStartWorkout = () => {
    try {
      removeProfileItem('fitbod_active_session');
    } catch (e) {}
    setIsWorkingOut(true);
    setIsWorkoutMinimized(false);
  };

  const handleResumeWorkout = () => {
    setIsWorkingOut(true);
    setIsWorkoutMinimized(false);
  };

  const handleCancelWorkout = () => {
    if (window.confirm('Sếp có chắc muốn hủy buổi tập hiện tại? Mọi tiến độ hiệp đã tập sẽ bị hủy.')) {
      try {
        removeProfileItem('fitbod_active_session');
      } catch (e) {}
      setIsWorkingOut(false);
      setIsWorkoutMinimized(false);
      setActiveProgress(null);
    }
  };

  const handleMoveMainExercise = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= currentWorkout.exercises.length || toIndex >= currentWorkout.exercises.length) return;
    setCurrentWorkout(prev => {
      const updated = { ...prev };
      const exList = [...updated.exercises];
      const [moved] = exList.splice(fromIndex, 1);
      exList.splice(toIndex, 0, moved);
      updated.exercises = exList;
      return updated;
    });
  };

  // Sync to localStorage
  useEffect(() => {
    setProfileItem('fitbod_goal', goal);
    setProfileItem('fitbod_split', split);
    setProfileItem('fitbod_duration', duration.toString());
    setProfileItem('fitbod_equipment', JSON.stringify(equipment));
    setProfileItem('fitbod_recovery', JSON.stringify(recoveryState));
    setProfileItem('fitbod_warmup', includeWarmup.toString());
    setProfileItem('fitbod_cardio_type', cardioType);
    setProfileItem('fitbod_cardio_duration', cardioDuration.toString());
    setProfileItem('fitbod_equipment_preference', equipmentPreference);
    setProfileItem('fitbod_available_machines', JSON.stringify(availableMachines));
    setProfileItem('fitbod_body_profile', JSON.stringify(bodyProfile));
    if (customTargetMuscles) {
      setProfileItem('fitbod_target_muscles', JSON.stringify(customTargetMuscles));
    }
  }, [goal, split, duration, equipment, recoveryState, includeWarmup, cardioType, cardioDuration, customTargetMuscles, equipmentPreference, availableMachines, bodyProfile]);

  const handleToggleSpineSafeMode = (enabled: boolean) => {
    const updatedProfile: UserBodyProfile = {
      ...bodyProfile,
      spineSafeMode: enabled
    };
    setBodyProfile(updatedProfile);
    try {
      setProfileItem('fitbod_body_profile', JSON.stringify(updatedProfile));
    } catch (e) {}

    // Tự động thanh lọc buổi tập hiện tại
    const sanitized = sanitizeWorkoutForSpineSafety(
      currentWorkout,
      enabled,
      updatedProfile,
      goal
    );
    setCurrentWorkout(sanitized);
  };

  const handleChangeBodyProfile = (newProfile: UserBodyProfile) => {
    setBodyProfile(newProfile);
    try {
      setProfileItem('fitbod_body_profile', JSON.stringify(newProfile));
    } catch (e) {}
    if (!isWorkingOut) {
      const fresh = generateSmartWorkout(
        recoveryState,
        equipment,
        goal,
        split,
        duration,
        includeWarmup,
        cardioType,
        cardioDuration,
        customTargetMuscles || undefined,
        exerciseHistory,
        equipmentPreference,
        excludedExerciseIds,
        undefined,
        newProfile
      );
      setCurrentWorkout(fresh);
    }
  };

  const handleSaveAvailableMachines = (updatedMachines: string[]) => {
    setAvailableMachines(updatedMachines);
    try {
      setProfileItem('fitbod_available_machines', JSON.stringify(updatedMachines));
    } catch (e) {}
    const newExcluded = getExcludedExerciseIds(updatedMachines);
    if (!isWorkingOut) {
      const fresh = generateSmartWorkout(
        recoveryState,
        equipment,
        goal,
        split,
        duration,
        includeWarmup,
        cardioType,
        cardioDuration,
        customTargetMuscles || undefined,
        exerciseHistory,
        equipmentPreference,
        newExcluded,
        undefined,
        bodyProfile
      );
      setCurrentWorkout(fresh);
    }
  };

  const handleRegenerateWorkout = () => {
    const fresh = generateSmartWorkout(
      recoveryState, 
      equipment, 
      goal, 
      split, 
      duration, 
      includeWarmup, 
      cardioType, 
      cardioDuration, 
      customTargetMuscles || undefined,
      exerciseHistory,
      equipmentPreference,
      excludedExerciseIds,
      undefined,
      bodyProfile
    );
    setCurrentWorkout(fresh);
    if (activeTab !== 'workout') setActiveTab('workout');
  };

  const handleChangeTargetMuscles = (muscles: MuscleGroup[]) => {
    setCustomTargetMuscles(muscles);
    try {
      setProfileItem('fitbod_target_muscles', JSON.stringify(muscles));
    } catch (e) {}
    if (!isWorkingOut) {
      const fresh = generateSmartWorkout(
        recoveryState,
        equipment,
        goal,
        split,
        duration,
        includeWarmup,
        cardioType,
        cardioDuration,
        muscles,
        exerciseHistory,
        equipmentPreference,
        excludedExerciseIds,
        undefined,
        bodyProfile
      );
      setCurrentWorkout(fresh);
    }
  };

  const handleChangeEquipmentPreference = (pref: EquipmentPreference) => {
    setEquipmentPreference(pref);
    try {
      setProfileItem('fitbod_equipment_preference', pref);
    } catch (e) {}
    if (!isWorkingOut) {
      const fresh = generateSmartWorkout(
        recoveryState,
        equipment,
        goal,
        split,
        duration,
        includeWarmup,
        cardioType,
        cardioDuration,
        customTargetMuscles || undefined,
        exerciseHistory,
        pref,
        excludedExerciseIds,
        undefined,
        bodyProfile
      );
      setCurrentWorkout(fresh);
    }
  };

  const handleToggleMaxEffort = (exerciseIndex: number) => {
    setCurrentWorkout(prev => {
      const updated = { ...prev };
      const exList = [...updated.exercises];
      const targetEx = { ...exList[exerciseIndex] };
      const willBeMaxEffort = !targetEx.isMaxEffort;
      targetEx.isMaxEffort = willBeMaxEffort;

      targetEx.sets = targetEx.sets.map((s, sIdx) => {
        if (sIdx === targetEx.sets.length - 1 && s.type !== 'warmup') {
          return {
            ...s,
            type: willBeMaxEffort ? 'amrap' : 'working',
            targetReps: s.targetReps || 10
          };
        }
        return s;
      });

      exList[exerciseIndex] = targetEx;
      updated.exercises = exList;
      updated.hasMaxEffort = exList.some(e => e.isMaxEffort);
      return updated;
    });
  };

  const handleUpdateExercise = (exerciseIndex: number, updatedExercise: PlannedExercise) => {
    setCurrentWorkout(prev => {
      const updated = { ...prev };
      const exList = [...updated.exercises];
      exList[exerciseIndex] = updatedExercise;
      updated.exercises = exList;
      return updated;
    });
  };

  const handleToggleWarmup = () => {
    const nextVal = !includeWarmup;
    setIncludeWarmup(nextVal);
    if (!isWorkingOut) {
      setCurrentWorkout(generateSmartWorkout(
        recoveryState, 
        equipment, 
        goal, 
        split, 
        duration, 
        nextVal, 
        cardioType, 
        cardioDuration, 
        customTargetMuscles || undefined,
        exerciseHistory,
        equipmentPreference,
        excludedExerciseIds,
        undefined,
        bodyProfile
      ));
    }
  };

  const handleChangeCardioType = (nextType: CardioType) => {
    setCardioType(nextType);
    if (!isWorkingOut) {
      setCurrentWorkout(generateSmartWorkout(
        recoveryState, 
        equipment, 
        goal, 
        split, 
        duration, 
        includeWarmup, 
        nextType, 
        cardioDuration, 
        customTargetMuscles || undefined,
        exerciseHistory,
        equipmentPreference,
        excludedExerciseIds,
        undefined,
        bodyProfile
      ));
    }
  };

  const handleChangeCardioDuration = (nextDuration: number) => {
    setCardioDuration(nextDuration);
    if (!isWorkingOut) {
      setCurrentWorkout(generateSmartWorkout(
        recoveryState, 
        equipment, 
        goal, 
        split, 
        duration, 
        includeWarmup, 
        cardioType, 
        nextDuration, 
        customTargetMuscles || undefined,
        exerciseHistory,
        equipmentPreference,
        excludedExerciseIds,
        undefined,
        bodyProfile
      ));
    }
  };

  const handleSwapExercise = (index: number, newExercise?: ExerciseItem) => {
    const currentEx = currentWorkout.exercises[index];
    let replacement = newExercise;

    if (!replacement) {
      const alternates = EXERCISE_CATALOG.filter(
        e => e.id !== currentEx.exerciseId && 
             (equipment.includes(e.equipment) || e.equipment === 'bodyweight') &&
             e.primaryMuscles.some(pm => currentEx.primaryMuscles.some(cm => cm.toLowerCase().includes(pm.muscle)))
      );
      if (alternates.length > 0) {
        replacement = alternates[Math.floor(Math.random() * alternates.length)];
      }
    }

    if (replacement) {
      const defaultWeight = calculateTailoredWeight(replacement, bodyProfile, goal);

      const updated = { ...currentWorkout };
      const exList = [...updated.exercises];
      exList[index] = {
        ...exList[index],
        exerciseId: replacement.id,
        exerciseName: replacement.name,
        equipment: replacement.equipment,
        tier: replacement.tier,
        restSeconds: calculateExerciseRestSeconds(replacement, goal),
        primaryMuscles: replacement.primaryMuscles.map(pm => MUSCLES_INFO[pm.muscle]?.nameVi || pm.muscle),
        muscleTarget: replacement.muscleTarget,
        cableConfig: replacement.cableConfig,
        images: replacement.images,
        videoUrl: replacement.videoUrl,
        videoEmbedId: replacement.videoEmbedId,
        setup: replacement.setup,
        execution: replacement.execution,
        mistakes: replacement.mistakes,
        sets: exList[index].sets.map(s => ({
          ...s,
          targetWeight: s.type === 'warmup' ? roundGymWeight(defaultWeight * 0.5, replacement.equipment, replacement.id) : defaultWeight,
          targetReps: s.targetReps || 10,
          cableRatio: replacement?.cableConfig?.pulleyRatio
        }))
      };
      updated.exercises = exList;
      setCurrentWorkout(updated);
    }
  };

  const toggleEquipment = (eq: EquipmentType) => {
    setEquipment(prev => {
      const exists = prev.includes(eq);
      const next = exists ? prev.filter(e => e !== eq) : [...prev, eq];
      return next.length > 0 ? next : ['bodyweight'];
    });
  };

  const updateSingleMuscle = (muscle: MuscleGroup, val: number) => {
    setRecoveryState(prev => ({
      ...prev,
      [muscle]: Math.max(0, Math.min(100, val))
    }));
  };

  const resetAllRecovery = () => {
    const full: Record<MuscleGroup, number> = {} as any;
    (Object.keys(MUSCLES_INFO) as MuscleGroup[]).forEach(m => { full[m] = 100; });
    setRecoveryState(full);
  };

  const handleFinishWorkout = (summary: { 
    totalSets: number; 
    totalVolume: number; 
    durationSeconds: number;
    exercises?: PlannedExercise[];
  }) => {
    try {
      removeProfileItem('fitbod_active_session');
    } catch (e) {}
    setIsWorkingOut(false);
    setIsWorkoutMinimized(false);
    setActiveProgress(null);
    setFinishedSummary(summary);

    // Apply fatigue CHÍNH XÁC theo các hiệp thực tế đã tick hoàn thành
    if (summary.exercises && summary.exercises.length > 0) {
      setRecoveryState(prev => calculateCompletedWorkoutFatigue(prev, summary.exercises!));

      // Cập nhật lịch sử bài tập để tính chu kỳ Max Effort Day chuẩn Fitbod
      setExerciseHistory(prev => {
        const nextHist = { ...prev };
        const nowIso = new Date().toISOString();

        summary.exercises!.forEach(ex => {
          const completedSets = ex.sets.filter(s => s.isCompleted);
          if (completedSets.length === 0) return;

          const existing = nextHist[ex.exerciseId] || {
            exerciseId: ex.exerciseId,
            totalSessions: 0,
            lastSessionDate: nowIso,
            sessionsSinceLastMaxEffort: 99
          };

          const hadMaxEffort = ex.isMaxEffort && ex.sets.some(s => s.type === 'amrap' && s.isCompleted);

          existing.totalSessions += 1;
          if (hadMaxEffort) {
            existing.sessionsSinceLastMaxEffort = 0;
            existing.lastMaxEffortDate = nowIso;
          } else {
            existing.sessionsSinceLastMaxEffort = (existing.sessionsSinceLastMaxEffort ?? 0) + 1;
          }
          existing.lastSessionDate = nowIso;

          // Record best weight / e1RM
          completedSets.forEach(s => {
            const w = s.loggedWeight ?? s.targetWeight;
            const r = s.loggedReps ?? s.targetReps;
            const e1 = calculateE1RM(w, r);
            if (!existing.bestWeight || w > existing.bestWeight) existing.bestWeight = w;
            if (!existing.e1RM || e1 > existing.e1RM) existing.e1RM = e1;
          });

          nextHist[ex.exerciseId] = existing;
        });

        try {
          setProfileItem('fitbod_exercise_history', JSON.stringify(nextHist));
        } catch (e) {}
        return nextHist;
      });
    }
  };

  const handleImportSuccess = (parsedData: any) => {
    if (parsedData?.exerciseHistory && Object.keys(parsedData.exerciseHistory).length > 0) {
      setExerciseHistory(parsedData.exerciseHistory);
      try {
        setProfileItem('fitbod_exercise_history', JSON.stringify(parsedData.exerciseHistory));
      } catch (e) {}
    }
    // Cập nhật mức độ hồi phục cơ bắp thông minh
    setRecoveryState(prev => ({
      ...prev,
      chest: 85,
      shoulders: 80,
      triceps: 75
    }));
  };

  const handleFactoryReset = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('fitbod_') || k.includes('fitbod'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('Factory reset error:', e);
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center selection:bg-blue-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-[#f8fafc] min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200">
        
        {/* iOS Native Status Bar Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 pt-[max(12px,env(safe-area-inset-top))] pb-3 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                FITBOD <span className="text-blue-600">PRO</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                AI Workout Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Multi-Profile Switcher */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold rounded-full border border-slate-200 transition shadow-xs"
              title="Quản lý hồ sơ người dùng"
            >
              <div 
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white shrink-0" 
                style={{ backgroundColor: activeProfile.avatarColor || '#2563eb' }} 
              />
              <span className="max-w-[80px] truncate text-[11px] font-black">{activeProfile.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black rounded-full hidden sm:inline-block">
              PRO
            </span>
          </div>
        </header>

        {/* Live Activity Sticky Banner khi thu nhỏ ra ngoài */}
        {isWorkingOut && isWorkoutMinimized && (
          <div 
            onClick={() => setIsWorkoutMinimized(false)}
            className="mx-4 mt-3 mb-1 p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-slate-800 animate-in slide-in-from-top duration-150 active:scale-[0.99] shrink-0"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 rounded-xl animate-pulse">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">Buổi tập đang diễn ra</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {activeProgress?.restSecondsRemaining ? (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono rounded-full font-black animate-pulse flex items-center gap-1">
                      <span>⏱ Nghỉ:</span>
                      <span>{Math.floor(activeProgress.restSecondsRemaining / 60)}:{(activeProgress.restSecondsRemaining % 60).toString().padStart(2, '0')}</span>
                    </span>
                  ) : activeProgress && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono rounded font-bold">
                      {Math.floor(activeProgress.workoutSeconds / 60)}:{(activeProgress.workoutSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {activeProgress 
                    ? `${activeProgress.currentExerciseName} • ${activeProgress.completedSets}/${activeProgress.totalSets} sets`
                    : 'Đang xem ngoài • Chạm để quay lại tập'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow shrink-0">
              <span>Vào tập</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Main Tab Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'workout' && (
            <WorkoutTab
              workout={currentWorkout}
              bodyProfile={bodyProfile}
              spineSafeMode={bodyProfile.spineSafeMode ?? true}
              onToggleSpineSafeMode={handleToggleSpineSafeMode}
              isWorkingOut={isWorkingOut}
              onStartWorkout={handleStartWorkout}
              onResumeWorkout={handleResumeWorkout}
              onCancelWorkout={handleCancelWorkout}
              onRegenerate={handleRegenerateWorkout}
              onSwapExercise={handleSwapExercise}
              onMoveExercise={handleMoveMainExercise}
              includeWarmup={includeWarmup}
              onToggleWarmup={handleToggleWarmup}
              cardioType={cardioType}
              onChangeCardioType={handleChangeCardioType}
              cardioDuration={cardioDuration}
              onChangeCardioDuration={handleChangeCardioDuration}
              recoveryState={recoveryState}
              onChangeTargetMuscles={handleChangeTargetMuscles}
              onToggleMaxEffort={handleToggleMaxEffort}
              onUpdateExercise={handleUpdateExercise}
              equipmentPreference={equipmentPreference}
              onChangeEquipmentPreference={handleChangeEquipmentPreference}
              availableMachines={availableMachines}
              onOpenMachinesModal={() => setShowMachinesModal(true)}
            />
          )}

          {activeTab === 'recovery' && (
            <RecoveryTab
              recoveryState={recoveryState}
              onUpdateRecovery={updateSingleMuscle}
              onResetAll={resetAllRecovery}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab onImportSuccess={handleImportSuccess} />
          )}

          {activeTab === 'plan' && (
            <PlanTab
              goal={goal}
              setGoal={setGoal}
              split={split}
              setSplit={setSplit}
              duration={duration}
              setDuration={setDuration}
              equipment={equipment}
              toggleEquipment={toggleEquipment}
              onRegenerate={handleRegenerateWorkout}
              includeWarmup={includeWarmup}
              setIncludeWarmup={setIncludeWarmup}
              cardioType={cardioType}
              setCardioType={setCardioType}
              cardioDuration={cardioDuration}
              setCardioDuration={setCardioDuration}
              availableMachines={availableMachines}
              onOpenMachinesModal={() => setShowMachinesModal(true)}
              bodyProfile={bodyProfile}
              onChangeBodyProfile={handleChangeBodyProfile}
              spineSafeMode={bodyProfile.spineSafeMode ?? true}
              onToggleSpineSafeMode={handleToggleSpineSafeMode}
              onFactoryReset={() => setShowResetConfirmModal(true)}
            />
          )}
        </main>

        {/* Workout Complete Summary Modal */}
        {finishedSummary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">Xuất Sắc, Sếp Ơi!</h3>
              <p className="text-xs text-slate-500 mb-5">Đã hoàn thành buổi tập và cập nhật độ mỏi cơ bắp</p>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl mb-5 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Thời gian</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {Math.floor(finishedSummary.durationSeconds / 60)} phút
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sets xong</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {finishedSummary.totalSets} sets
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Tổng tải</span>
                  <span className="text-sm font-extrabold text-blue-600">
                    {Math.round(finishedSummary.totalVolume)} kg
                  </span>
                </div>
              </div>

              <button
                onClick={() => setFinishedSummary(null)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md"
              >
                Tuyệt vời, về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Active Workout Screen - Duy trì mount để không mất dữ liệu/bộ đếm khi thu nhỏ ra ngoài */}
        {isWorkingOut && (
          <ActiveWorkoutModal
            exercises={currentWorkout.exercises}
            isMinimized={isWorkoutMinimized}
            onFinishWorkout={handleFinishWorkout}
            onCancel={handleCancelWorkout}
            onMinimize={() => setIsWorkoutMinimized(true)}
            onProgressUpdate={setActiveProgress}
          />
        )}

        {/* Profile Manager Modal */}
        <ProfileManagerModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onFactoryReset={() => setShowResetConfirmModal(true)}
        />

        {/* Gym Machines Modal */}
        {showMachinesModal && (
          <GymMachinesModal
            availableMachines={availableMachines}
            onSave={handleSaveAvailableMachines}
            onClose={() => setShowMachinesModal(false)}
          />
        )}

        {/* Factory Reset Confirmation Modal */}
        {showResetConfirmModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-red-100 animate-in zoom-in-95 duration-150">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-xs">
                <RotateCcw className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Khôi Phục Cài Đặt Gốc</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                Sếp có chắc chắn muốn xóa toàn bộ dữ liệu lịch sử và cài đặt để bắt đầu lại từ đầu?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs active:scale-95 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleFactoryReset}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs shadow-md shadow-red-500/20 active:scale-95 transition"
                >
                  Xác Nhận Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] px-3 flex items-center justify-around z-40">
          {[
            { id: 'workout', label: 'Hôm Nay', icon: Dumbbell },
            { id: 'recovery', label: 'Hồi Phục', icon: Activity },
            { id: 'history', label: 'Lịch Sử / PR', icon: Trophy },
            { id: 'plan', label: 'Kế Hoạch', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 ${
                  isActive 
                    ? 'text-blue-600 font-extrabold scale-105' 
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
};
export default App;

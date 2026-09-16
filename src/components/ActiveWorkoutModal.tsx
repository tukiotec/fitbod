import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Minimize2, 
  ListOrdered, 
  Video, 
  Layers, 
  RefreshCw, 
  Flame, 
  Dumbbell, 
  Trash2,
  Sparkles,
  Info,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlannedExercise, WorkoutSet, ExerciseItem } from '../types';
import { PlateCalculatorModal } from './PlateCalculatorModal';
import { CableStackModal } from './CableStackModal';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { RestTimerOverlay } from './RestTimerOverlay';
import { PwaInstallModal } from './PwaInstallModal';
import { WorkoutQueueModal } from './WorkoutQueueModal';
import { SwapExerciseModal } from './SwapExerciseModal';
import { EXERCISE_CATALOG, MUSCLES_INFO } from '../data/exerciseCatalog';
import { calculateE1RM, calculateExerciseRestSeconds } from '../engine/fitbodEngine';
import { MaxEffortCelebrationModal } from './MaxEffortCelebrationModal';
import { 
  startBackgroundRestCountdown, 
  stopBackgroundRestCountdown, 
  adjustBackgroundRestTime,
  requestNotificationPermission,
  getRestAlertMode,
  triggerDeviceVibration
} from '../utils/backgroundTimer';

const SESSION_STORAGE_KEY = 'fitbod_active_session';

interface ActiveWorkoutModalProps {
  exercises: PlannedExercise[];
  onFinishWorkout: (summary: {
    totalSets: number;
    totalVolume: number;
    durationSeconds: number;
    exercises: PlannedExercise[];
  }) => void;
  onCancel: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  onProgressUpdate?: (info: {
    currentExerciseName: string;
    completedSets: number;
    totalSets: number;
    workoutSeconds: number;
    restSecondsRemaining?: number;
  }) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  exercises: initialExercises,
  onFinishWorkout,
  onCancel,
  onMinimize,
  isMinimized = false,
  onProgressUpdate
}) => {
  // Load session from localStorage if available
  const [exercises, setExercises] = useState<PlannedExercise[]>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.exercises && parsed.exercises.length > 0) {
          return parsed.exercises.map((ex: PlannedExercise) => {
            const cat = EXERCISE_CATALOG.find(c => c.id === ex.exerciseId);
            return {
              ...ex,
              videoUrl: ex.videoUrl || cat?.videoUrl,
              images: (ex.images && ex.images.length > 0) ? ex.images : cat?.images,
              videoEmbedId: ex.videoEmbedId || cat?.videoEmbedId,
              setup: ex.setup || cat?.setup,
              execution: ex.execution || cat?.execution,
              mistakes: ex.mistakes || cat?.mistakes,
              muscleTarget: ex.muscleTarget || cat?.muscleTarget,
              cableConfig: ex.cableConfig || cat?.cableConfig
            };
          });
        }
      }
    } catch (e) {}
    return initialExercises;
  });

  const [currentExIndex, setCurrentExIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentExIndex === 'number') {
          return parsed.currentExIndex;
        }
      }
    } catch (e) {}
    return 0;
  });

  // Modals
  const [showPlateCalc, setShowPlateCalc] = useState<boolean>(false);
  const [showCableModal, setShowCableModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showQueueModal, setShowQueueModal] = useState<boolean>(false);
  const [showSwapModal, setShowSwapModal] = useState<boolean>(false);
  const [selectedWeightForCalc, setSelectedWeightForCalc] = useState<number>(60);
  const [maxEffortCelebrationData, setMaxEffortCelebrationData] = useState<{
    exerciseName: string;
    weight: number;
    reps: number;
    targetReps: number;
    newE1RM: number;
  } | null>(null);

  // =========================================================================
  // SINGLE SOURCE OF TRUTH: REST TIMER (TIMESTAMP-BASED BACKGROUND ENGINE)
  // =========================================================================
  const [restTargetTime, setRestTargetTime] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.restTargetTime && parsed.restTargetTime > Date.now()) {
          return parsed.restTargetTime;
        }
      }
    } catch (e) {}
    return null;
  });

  const [restTotalDuration, setRestTotalDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.restTotalDuration) return parsed.restTotalDuration;
      }
    } catch (e) {}
    return 90;
  });

  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);
  const [showRestOverlay, setShowRestOverlay] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.showRestOverlay && parsed.restTargetTime && parsed.restTargetTime > Date.now()) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  });

  const [nextSetInfo, setNextSetInfo] = useState<{
    exerciseName: string;
    setIndex: number;
    totalSets: number;
    weight: number;
    reps: number;
    isNextExercise?: boolean;
  } | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.nextSetInfo || null;
      }
    } catch (e) {}
    return null;
  });

  // Current remaining seconds computed from epoch timestamp
  const [remainingRestSeconds, setRemainingRestSeconds] = useState<number>(() => {
    if (!restTargetTime) return 0;
    return Math.max(0, Math.ceil((restTargetTime - Date.now()) / 1000));
  });

  // Workout duration timer
  const startTimeRef = useRef<number>((() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startTime) return parsed.startTime;
      }
    } catch (e) {}
    return Date.now();
  })());

  const [workoutSeconds, setWorkoutSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startTime) {
          return Math.max(0, Math.floor((Date.now() - parsed.startTime) / 1000));
        }
      }
    } catch (e) {}
    return 0;
  });

  // Web Audio Context & Multi-tone Chime Generator
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = (type: 'start' | 'finish' = 'finish') => {
    const alertMode = getRestAlertMode();
    if (alertMode === 'vibrate') {
      triggerDeviceVibration();
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'start') {
        // Soft click chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        // Harmonious 3-tone finish chime: D5 (587Hz) -> F#5 (740Hz) -> A5 (880Hz)
        const tones = [587.33, 739.99, 880.00];
        tones.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });

        // Haptic vibration
        if (navigator.vibrate) {
          navigator.vibrate([250, 150, 250, 150, 350]);
        }

        // Web Notification (if permission granted)
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('FITBOD: Hết Giờ Nghỉ!', {
              body: nextSetInfo 
                ? `Vào hiệp tiếp theo: ${nextSetInfo.exerciseName} (Set ${nextSetInfo.setIndex})`
                : 'Đã sẵn sàng cho hiệp tiếp theo!',
              icon: '/favicon.ico'
            });
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // Sync workout session to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        exercises,
        currentExIndex,
        startTime: startTimeRef.current,
        restTargetTime,
        restTotalDuration,
        showRestOverlay,
        nextSetInfo
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {}
  }, [exercises, currentExIndex, restTargetTime, restTotalDuration, showRestOverlay, nextSetInfo]);

  // Workout duration stopwatch ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000));
      setWorkoutSeconds(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Request Notification permission on first set or mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission();
      } catch (e) {}
    }
  }, []);

  // =========================================================================
  // BACKGROUND-AWARE REST TIMER & LOCK SCREEN ENGINE (iOS Safari Keep-Alive)
  // =========================================================================
  useEffect(() => {
    if (!restTargetTime) {
      setRemainingRestSeconds(0);
      stopBackgroundRestCountdown();
      return;
    }

    const nextExText = nextSetInfo 
      ? `${nextSetInfo.exerciseName} (${nextSetInfo.weight}kg × ${nextSetInfo.reps})` 
      : undefined;

    // Bắt đầu chu trình chạy ngầm & giữ Audio Session + Lock Screen Media
    startBackgroundRestCountdown({
      targetEpochMs: restTargetTime,
      nextExerciseName: nextExText,
      onTick: (rem) => {
        setRemainingRestSeconds(rem);
      },
      onFinish: () => {
        // Hết giờ nghỉ (kể cả khi màn hình đang tắt hoặc thoát app)
        playChime('finish');
        setRestTargetTime(null);
        setRemainingRestSeconds(0);
        setShowRestOverlay(false);
      },
      onSkipRest: () => {
        handleSkipRest();
      },
      onAdd30s: () => {
        handleAdjustRestTime(30);
      }
    });

    // Cập nhật ngay khi bật màn hình / chuyển lại tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && restTargetTime) {
        const rem = Math.max(0, Math.ceil((restTargetTime - Date.now()) / 1000));
        setRemainingRestSeconds(rem);
        if (rem <= 0) {
          playChime('finish');
          setRestTargetTime(null);
          setRemainingRestSeconds(0);
          setShowRestOverlay(false);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopBackgroundRestCountdown();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [restTargetTime, nextSetInfo]);

  // Adjust Rest Timer (+30s, -15s, etc.)
  const handleAdjustRestTime = (deltaSeconds: number) => {
    adjustBackgroundRestTime(deltaSeconds);
    setRestTargetTime(prev => {
      const base = prev && prev > Date.now() ? prev : Date.now();
      const newTarget = Math.max(Date.now() + 3000, base + deltaSeconds * 1000);
      const newRem = Math.ceil((newTarget - Date.now()) / 1000);
      setRestTotalDuration(orig => Math.max(orig, newRem));
      setRemainingRestSeconds(newRem);
      return newTarget;
    });
  };

  const handleSkipRest = () => {
    stopBackgroundRestCountdown();
    setRestTargetTime(null);
    setRemainingRestSeconds(0);
    setShowRestOverlay(false);
    if (nextSetInfo?.isNextExercise) {
      setCurrentExIndex(prev => Math.min(exercises.length - 1, prev + 1));
    }
  };

  // Current exercise
  const currentExercise = exercises[currentExIndex];

  // Visual illustration thumbnail & frame animation (toggles between frame 0 and frame 1 every 1.5s)
  const catalogExercise = EXERCISE_CATALOG.find(c => c.id === currentExercise?.exerciseId);
  const exerciseImages = (currentExercise?.images && currentExercise.images.length > 0)
    ? currentExercise.images
    : (catalogExercise?.images || []);

  const [activeImageFrame, setActiveImageFrame] = useState<number>(0);

  useEffect(() => {
    setActiveImageFrame(0);
    if (exerciseImages && exerciseImages.length > 1) {
      const timer = setInterval(() => {
        setActiveImageFrame(prev => (prev === 0 ? 1 : 0));
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [currentExercise?.exerciseId, exerciseImages.length]);

  const currentThumbnailUrl = exerciseImages[activeImageFrame] || exerciseImages[0] || null;

  // Set field updater (+/- or direct)
  const updateSetField = (setIndex: number, field: 'loggedReps' | 'loggedWeight', delta: number) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[currentExIndex] };
      const sets = [...ex.sets];
      const s = { ...sets[setIndex] };

      if (field === 'loggedReps') {
        const val = (s.loggedReps ?? s.targetReps) + delta;
        s.loggedReps = Math.max(1, Math.round(val));
      } else {
        const val = (s.loggedWeight ?? s.targetWeight) + delta;
        s.loggedWeight = Math.max(0, Math.round(val * 10) / 10);
      }
      sets[setIndex] = s;
      ex.sets = sets;
      updated[currentExIndex] = ex;
      return updated;
    });
  };

  const setSetFieldDirect = (setIndex: number, field: 'loggedReps' | 'loggedWeight', val: number) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[currentExIndex] };
      const sets = [...ex.sets];
      const s = { ...sets[setIndex] };

      if (field === 'loggedReps') {
        s.loggedReps = Math.max(1, Math.round(val));
      } else {
        s.loggedWeight = Math.max(0, Math.round(val * 10) / 10);
      }
      sets[setIndex] = s;
      ex.sets = sets;
      updated[currentExIndex] = ex;
      return updated;
    });
  };

  // Toggle Set Type (Warmup W <-> Working 1,2,3 <-> AMRAP)
  const toggleSetType = (setIndex: number) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[currentExIndex] };
      const sets = [...ex.sets];
      const s = { ...sets[setIndex] };

      if (s.type === 'warmup') {
        s.type = 'working';
      } else if (s.type === 'working') {
        s.type = 'warmup';
        // Suggest lighter weight for warmup if not already set
        if (!s.loggedWeight) {
          s.targetWeight = Math.max(ex.equipment === 'barbell' ? 20 : 2.5, Math.round((s.targetWeight * 0.5) / 2.5) * 2.5);
        }
      }
      sets[setIndex] = s;
      ex.sets = sets;
      updated[currentExIndex] = ex;
      return updated;
    });
  };

  // Add Set (Working or Warmup)
  const handleAddSet = (type: 'working' | 'warmup') => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[currentExIndex] };
      const sets = [...ex.sets];
      const lastSet = sets[sets.length - 1];
      const baseWeight = lastSet ? (lastSet.loggedWeight ?? lastSet.targetWeight) : 20;
      const baseReps = lastSet ? (lastSet.loggedReps ?? lastSet.targetReps) : 10;

      const newWeight = type === 'warmup' 
        ? Math.max(ex.equipment === 'barbell' ? 20 : 2.5, Math.round((baseWeight * 0.5) / 2.5) * 2.5)
        : baseWeight;

      const newSet: WorkoutSet = {
        setIndex: sets.length + 1,
        type: type,
        targetWeight: newWeight,
        targetReps: type === 'warmup' ? 10 : baseReps,
        isCompleted: false,
        cableRatio: ex.cableConfig?.pulleyRatio
      };

      if (type === 'warmup') {
        // Insert before working sets
        const firstWorkingIdx = sets.findIndex(s => s.type !== 'warmup');
        if (firstWorkingIdx >= 0) {
          sets.splice(firstWorkingIdx, 0, newSet);
        } else {
          sets.push(newSet);
        }
      } else {
        sets.push(newSet);
      }

      // Re-index
      sets.forEach((s, idx) => { s.setIndex = idx + 1; });
      ex.sets = sets;
      updated[currentExIndex] = ex;
      return updated;
    });
  };

  // Delete Set
  const handleDeleteSet = (setIndex: number) => {
    if (currentExercise.sets.length <= 1) return;
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[currentExIndex] };
      const sets = ex.sets.filter((_, idx) => idx !== setIndex);
      sets.forEach((s, idx) => { s.setIndex = idx + 1; });
      ex.sets = sets;
      updated[currentExIndex] = ex;
      return updated;
    });
  };

  // Toggle Set Complete & trigger Rest Timer
  const toggleSetComplete = (setIndex: number) => {
    playChime('start');
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[currentExIndex] };
      const sets = [...ex.sets];
      const currentSet = { ...sets[setIndex] };
      const willComplete = !currentSet.isCompleted;

      currentSet.isCompleted = willComplete;
      if (willComplete) {
        if (currentSet.loggedWeight === undefined) currentSet.loggedWeight = currentSet.targetWeight;
        if (currentSet.loggedReps === undefined) currentSet.loggedReps = currentSet.targetReps;

        // Determine next set info
        let nextInfo = null;
        if (setIndex + 1 < sets.length) {
          const nextS = sets[setIndex + 1];
          nextInfo = {
            exerciseName: ex.exerciseName,
            setIndex: setIndex + 2,
            totalSets: sets.length,
            weight: nextS.loggedWeight ?? nextS.targetWeight,
            reps: nextS.loggedReps ?? nextS.targetReps,
            isNextExercise: false
          };
        } else if (currentExIndex + 1 < exercises.length) {
          const nextEx = exercises[currentExIndex + 1];
          const nextS = nextEx.sets[0];
          nextInfo = {
            exerciseName: nextEx.exerciseName,
            setIndex: 1,
            totalSets: nextEx.sets.length,
            weight: nextS?.loggedWeight ?? nextS?.targetWeight ?? 20,
            reps: nextS?.loggedReps ?? nextS?.targetReps ?? 10,
            isNextExercise: true
          };
        }

        // Trigger Max Effort Celebration if AMRAP set
        if (currentSet.type === 'amrap' || ex.isMaxEffort && setIndex === sets.length - 1) {
          const lW = currentSet.loggedWeight;
          const lR = currentSet.loggedReps;
          const newE1 = calculateE1RM(lW, lR);
          setMaxEffortCelebrationData({
            exerciseName: ex.exerciseName,
            weight: lW,
            reps: lR,
            targetReps: currentSet.targetReps,
            newE1RM: newE1
          });
        }

        const isWarmup = currentSet.type === 'warmup';
        const calcRest = calculateExerciseRestSeconds(ex, 'hypertrophy');
        const duration = isWarmup ? 30 : (ex.restSeconds || calcRest);
        const target = Date.now() + duration * 1000;
        const nextExText = nextInfo 
          ? `${nextInfo.exerciseName} (${nextInfo.weight}kg × ${nextInfo.reps})` 
          : undefined;

        // KÍCH HOẠT PHẦN CỨNG AUDIO NGAY TRONG GESTURE CLICK ĐỂ IOS SAFARI CẤP QUYỀN COREAUDIO 100%
        startBackgroundRestCountdown({
          restSeconds: duration,
          targetEpochMs: target,
          nextExerciseName: nextExText,
          onTick: (rem) => {
            setRemainingRestSeconds(rem);
          },
          onFinish: () => {
            setRestTargetTime(null);
            setRemainingRestSeconds(0);
            setShowRestOverlay(false);
          },
          onSkipRest: () => {
            handleSkipRest();
          },
          onAdd30s: () => {
            handleAdjustRestTime(30);
          }
        });

        setNextSetInfo(nextInfo);
        setRestTargetTime(target);
        setRestTotalDuration(duration);
        setRemainingRestSeconds(duration);
        setShowRestOverlay(true);
      } else {
        // If unchecking, cancel rest timer
        setRestTargetTime(null);
        setRemainingRestSeconds(0);
        setShowRestOverlay(false);
      }

      sets[setIndex] = currentSet;
      ex.sets = sets;
      updated[currentExIndex] = ex;
      return updated;
    });
  };

  // Swap Exercise
  const handleSwapExercise = (newEx: ExerciseItem) => {
    const oldEx = exercises[currentExIndex];
    let defaultWeight = 20;
    if (newEx.equipment === 'bodyweight') defaultWeight = 0;
    else if (newEx.equipment === 'dumbbell') defaultWeight = 10;
    else if (newEx.equipment === 'barbell') defaultWeight = 40;
    else if (newEx.equipment === 'cable') defaultWeight = newEx.cableConfig?.defaultStackKg || 15;
    else if (newEx.equipment === 'machine') defaultWeight = 30;

    const updatedSets: WorkoutSet[] = oldEx.sets.map((s) => ({
      ...s,
      targetWeight: s.type === 'warmup' ? Math.max(newEx.equipment === 'barbell' ? 20 : 2.5, Math.round(defaultWeight * 0.5)) : defaultWeight,
      targetReps: s.targetReps || 10,
      loggedWeight: undefined,
      loggedReps: undefined,
      isCompleted: false,
      cableRatio: newEx.cableConfig?.pulleyRatio
    }));

    const updatedPlannedExercise: PlannedExercise = {
      exerciseId: newEx.id,
      exerciseName: newEx.name,
      tier: newEx.tier,
      equipment: newEx.equipment,
      sets: updatedSets,
      restSeconds: calculateExerciseRestSeconds(newEx, 'hypertrophy'),
      primaryMuscles: newEx.primaryMuscles.map(pm => MUSCLES_INFO[pm.muscle]?.nameVi || pm.muscle),
      muscleTarget: newEx.muscleTarget,
      cableConfig: newEx.cableConfig,
      images: newEx.images,
      videoUrl: newEx.videoUrl,
      videoEmbedId: newEx.videoEmbedId,
      setup: newEx.setup,
      execution: newEx.execution,
      mistakes: newEx.mistakes
    };

    setExercises(prev => {
      const next = [...prev];
      next[currentExIndex] = updatedPlannedExercise;
      return next;
    });
    setShowSwapModal(false);
  };

  // Finish Workout
  const handleFinish = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    let totalSets = 0;
    let totalVolume = 0;
    exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.isCompleted) {
          totalSets++;
          totalVolume += (s.loggedWeight ?? s.targetWeight) * (s.loggedReps ?? s.targetReps);
        }
      });
    });

    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}

    onFinishWorkout({
      totalSets,
      totalVolume,
      durationSeconds: workoutSeconds,
      exercises
    });
  };

  // Reorder exercises
  const handleMoveExercise = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= exercises.length || toIndex >= exercises.length) return;
    setExercises(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    if (currentExIndex === fromIndex) setCurrentExIndex(toIndex);
  };

  const handleJumpToExercise = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < exercises.length) {
      setCurrentExIndex(targetIndex);
    }
  };

  // Emit progress to parent app
  useEffect(() => {
    if (onProgressUpdate) {
      const completedSets = exercises.reduce(
        (sum, ex) => sum + ex.sets.filter(s => s.isCompleted).length,
        0
      );
      const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
      onProgressUpdate({
        currentExerciseName: currentExercise?.exerciseName || 'Đang tập',
        completedSets,
        totalSets,
        workoutSeconds,
        restSecondsRemaining: remainingRestSeconds > 0 ? remainingRestSeconds : undefined
      });
    }
  }, [exercises, currentExIndex, workoutSeconds, remainingRestSeconds]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // If minimized, do not render modal content
  if (isMinimized) return null;

  const isCardio = currentExercise?.exerciseId?.startsWith('cardio_');
  const weightStep = currentExercise.equipment === 'dumbbell' ? 2 : (currentExercise.equipment === 'barbell' ? 2.5 : 2.5);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafc] text-slate-900 animate-in fade-in duration-150">
      
      {/* ===================================================================== */}
      {/* TOP HEADER: Clean, Minimalist, Fitbod-style */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onCancel}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 rounded-xl hover:bg-slate-100 active:scale-95 transition"
            title="Thoát buổi tập"
          >
            ✕ Thoát
          </button>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 active:scale-95 transition"
              title="Thu nhỏ màn hình tập"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stopwatch Elapsed Time */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black font-mono tracking-tight text-slate-800">
            {formatTime(workoutSeconds)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowQueueModal(true)}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 active:scale-95 transition"
            title="Danh sách & thứ tự bài tập"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={handleFinish}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
          >
            Xong
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* EXERCISE HEADER: Full Title, Subtitle, Visual Illustration Thumbnail & Action Pills */}
      {/* ===================================================================== */}
      <div className="bg-white px-4 pt-3.5 pb-3 border-b border-slate-100 shrink-0 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            Bài {currentExIndex + 1} / {exercises.length}
          </span>
          <div className="flex items-center gap-1">
            {exercises.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentExIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentExIndex 
                    ? 'w-5 bg-blue-600' 
                    : (exercises[idx].sets.every(s => s.isCompleted) ? 'w-2 bg-emerald-400' : 'w-2 bg-slate-200')
                }`}
              />
            ))}
          </div>
        </div>

        {/* Visual Illustration Thumbnail + Exercise Info */}
        <div className="flex items-center gap-3">
          {/* Animated Illustration Thumbnail (Tap to view HD Video & Form) */}
          <div 
            onClick={() => setShowDetailModal(true)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 overflow-hidden shrink-0 cursor-pointer relative group border border-slate-200 shadow-xs active:scale-95 transition"
            title="Chạm để xem video & hướng dẫn chi tiết"
          >
            {currentThumbnailUrl ? (
              <img
                src={currentThumbnailUrl}
                alt={currentExercise.exerciseName}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                <Dumbbell className="w-6 h-6 text-slate-400" />
              </div>
            )}
            
            {/* Subtle play badge overlay */}
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-80 group-hover:opacity-100 transition">
              <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs">
                <Play className="w-3 h-3 text-slate-900 fill-current ml-0.5" />
              </div>
            </div>

            {/* Frame indicator tag */}
            {exerciseImages.length > 1 && (
              <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/60 rounded text-[9px] font-bold text-white leading-none">
                {activeImageFrame + 1}/{exerciseImages.length}
              </div>
            )}
          </div>

          {/* Exercise Info & Actions */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug line-clamp-2">
              {currentExercise.exerciseName}
            </h2>

            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
              {currentExercise.primaryMuscles.join(' • ')} 
              {currentExercise.cableConfig && ` • Cáp (${currentExercise.cableConfig.pulleyRatio})`}
            </p>

            {/* Compact Action Pills */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <button
                onClick={() => setShowDetailModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition"
              >
                <Video className="w-3 h-3 text-blue-600" />
                <span>Xem video</span>
              </button>

              <button
                onClick={() => setShowSwapModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition"
              >
                <RefreshCw className="w-3 h-3 text-amber-600" />
                <span>Đổi bài</span>
              </button>

              {currentExercise.equipment === 'cable' && (
                <button
                  onClick={() => setShowCableModal(true)}
                  className="flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 active:scale-95 border border-purple-200 rounded-xl text-[11px] font-bold text-purple-700 transition"
                >
                  <Layers className="w-3 h-3" />
                  <span>Cọc tạ</span>
                </button>
              )}

              {currentExercise.equipment === 'barbell' && (
                <button
                  onClick={() => {
                    setSelectedWeightForCalc(currentExercise.sets[0]?.targetWeight || 40);
                    setShowPlateCalc(true);
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 active:scale-95 border border-blue-200 rounded-xl text-[11px] font-bold text-blue-700 transition"
                >
                  <Dumbbell className="w-3 h-3" />
                  <span>Đĩa tạ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FLOATING REST TIMER STRIP (Visible when rest timer is active & minimized) */}
      {/* ===================================================================== */}
      {restTargetTime && remainingRestSeconds > 0 && !showRestOverlay && (
        <div 
          onClick={() => setShowRestOverlay(true)}
          className="mx-4 mt-3 p-3 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between cursor-pointer active:scale-[0.99] transition animate-in slide-in-from-top-2 duration-150 shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Đang nghỉ hồi phục</span>
              <span className="text-lg font-black font-mono text-emerald-400 leading-none">
                {formatTime(remainingRestSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleAdjustRestTime(-15)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 active:scale-95"
            >
              -15s
            </button>
            <button
              onClick={() => handleAdjustRestTime(30)}
              className="px-2.5 py-1 bg-blue-600/40 hover:bg-blue-600/60 text-blue-300 rounded-lg text-xs font-extrabold active:scale-95"
            >
              +30s
            </button>
            <button
              onClick={handleSkipRest}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold active:scale-95 ml-1"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* BODY: Sets Table (Fitbod Clean Minimalist Style) */}
      {/* ===================================================================== */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isCardio ? (
          /* Cardio exercise view */
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Cardio Cuối Buổi</h3>
            <p className="text-xs text-slate-500 mb-6">{currentExercise.execution}</p>

            <button
              onClick={() => toggleSetComplete(0)}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2 ${
                currentExercise.sets[0]?.isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 text-white hover:bg-orange-500'
              }`}
            >
              {currentExercise.sets[0]?.isCompleted ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  ĐÃ HOÀN THÀNH CARDIO
                </>
              ) : (
                'BẤM HOÀN THÀNH CARDIO'
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
            
            {/* Table Column Headers */}
            <div className="grid grid-cols-12 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 px-1">
              <span className="col-span-2">Hiệp</span>
              <span className="col-span-5 text-center">Mức tạ (kg)</span>
              <span className="col-span-3 text-center">Reps</span>
              <span className="col-span-2 text-right">Xong</span>
            </div>

            {/* Set Rows */}
            <div className="divide-y divide-slate-100">
              {currentExercise.sets.map((s, idx) => {
                const isDone = s.isCompleted;
                const currentWeight = s.loggedWeight ?? s.targetWeight;
                const currentReps = s.loggedReps ?? s.targetReps;
                const isWarmup = s.type === 'warmup';
                const isAmrap = s.type === 'amrap';

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 items-center py-3 px-1 transition-colors ${
                      isDone ? 'bg-emerald-50/40 rounded-2xl' : ''
                    }`}
                  >
                    {/* Column 1: Set Badge (Tap to toggle Warmup W <-> Working 1,2,3) */}
                    <div className="col-span-2 flex items-center">
                      <button
                        onClick={() => toggleSetType(idx)}
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center transition active:scale-90 ${
                          isWarmup 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 ring-2 ring-amber-200/60' 
                            : (isAmrap 
                                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs' 
                                : 'bg-slate-100 text-slate-700 border border-slate-200')
                        }`}
                        title="Chạm để chuyển giữa Hiệp Khởi Động (W) và Hiệp Chính"
                      >
                        {isWarmup ? 'W' : (isAmrap ? 'MAX' : idx + 1)}
                      </button>
                    </div>

                    {/* Column 2: Weight Stepper (Compact & Clean) */}
                    <div className="col-span-5 flex items-center justify-center gap-1">
                      <button
                        disabled={isDone}
                        onClick={() => updateSetField(idx, 'loggedWeight', -weightStep)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center disabled:opacity-30 active:scale-95"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={0.5}
                        disabled={isDone}
                        value={currentWeight}
                        onChange={(e) => setSetFieldDirect(idx, 'loggedWeight', parseFloat(e.target.value) || 0)}
                        className={`w-14 py-1 text-center font-extrabold text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${
                          isDone 
                            ? 'bg-slate-50 border-transparent text-slate-500' 
                            : (isWarmup ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-slate-200 text-slate-900')
                        }`}
                      />
                      <button
                        disabled={isDone}
                        onClick={() => updateSetField(idx, 'loggedWeight', weightStep)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center disabled:opacity-30 active:scale-95"
                      >
                        +
                      </button>
                    </div>

                    {/* Column 3: Reps Stepper */}
                    <div className="col-span-3 flex items-center justify-center gap-1">
                      <button
                        disabled={isDone}
                        onClick={() => updateSetField(idx, 'loggedReps', -1)}
                        className="w-6 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs flex items-center justify-center disabled:opacity-30 active:scale-95"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        disabled={isDone}
                        value={currentReps}
                        onChange={(e) => setSetFieldDirect(idx, 'loggedReps', parseInt(e.target.value, 10) || 1)}
                        className={`w-9 py-1 text-center font-extrabold text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${
                          isDone ? 'bg-slate-50 border-transparent text-slate-500' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                      <button
                        disabled={isDone}
                        onClick={() => updateSetField(idx, 'loggedReps', 1)}
                        className="w-6 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs flex items-center justify-center disabled:opacity-30 active:scale-95"
                      >
                        +
                      </button>
                    </div>

                    {/* Column 4: Checkmark (Big Satisfying Circle) */}
                    <div className="col-span-2 flex items-center justify-end">
                      <button
                        onClick={() => toggleSetComplete(idx)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 ${
                          isDone 
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                            : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-400'
                        }`}
                        title={isDone ? 'Bấm để hủy hoàn thành' : 'Bấm hoàn thành hiệp'}
                      >
                        <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table Footer: Add Working Set / Add Warmup Set Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-1">
              <button
                onClick={() => handleAddSet('working')}
                className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Thêm hiệp</span>
              </button>

              <button
                onClick={() => handleAddSet('warmup')}
                className="flex-1 py-2 px-3 bg-amber-50/70 hover:bg-amber-100/70 active:scale-[0.98] border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center justify-center gap-1.5 transition"
              >
                <span className="w-4 h-4 rounded-md bg-amber-400 text-amber-950 font-black text-[10px] flex items-center justify-center">W</span>
                <span>Thêm hiệp khởi động</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* BOTTOM BAR: Sleek Exercise Switcher (Previous / Next) */}
      {/* ===================================================================== */}
      <footer className="p-4 border-t border-slate-200/90 bg-white flex items-center justify-between shrink-0 shadow-lg">
        <button
          disabled={currentExIndex === 0}
          onClick={() => setCurrentExIndex(prev => Math.max(0, prev - 1))}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs disabled:opacity-30 active:scale-95 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bài trước</span>
        </button>

        <span className="text-xs font-black text-slate-500">
          Bài {currentExIndex + 1} / {exercises.length}
        </span>

        <button
          disabled={currentExIndex === exercises.length - 1}
          onClick={() => setCurrentExIndex(prev => Math.min(exercises.length - 1, prev + 1))}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-md shadow-blue-500/30 disabled:opacity-30 active:scale-95 transition"
        >
          <span>Bài tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

      {/* ===================================================================== */}
      {/* MODALS */}
      {/* ===================================================================== */}
      
      {/* Synchronized Rest Timer Overlay */}
      {showRestOverlay && restTargetTime && remainingRestSeconds > 0 && (
        <RestTimerOverlay
          remainingSeconds={remainingRestSeconds}
          totalDurationSeconds={restTotalDuration}
          nextSetInfo={nextSetInfo}
          onAdjustTime={handleAdjustRestTime}
          onClose={() => setShowRestOverlay(false)}
          onSkip={handleSkipRest}
          onOpenPwaGuide={() => setShowPwaModal(true)}
        />
      )}

      {/* PWA Home Screen Installation Guide Modal */}
      <PwaInstallModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
      />

      {/* Plate Calculator */}
      {showPlateCalc && (
        <PlateCalculatorModal
          initialWeight={selectedWeightForCalc}
          onClose={() => setShowPlateCalc(false)}
        />
      )}

      {/* Cable Stack Modal */}
      {showCableModal && currentExercise.cableConfig && (
        <CableStackModal
          initialWeight={currentExercise.sets[0]?.targetWeight || 15}
          initialRatio={currentExercise.cableConfig.pulleyRatio}
          exerciseName={currentExercise.exerciseName}
          onApply={(newWeight, ratio) => {
            setExercises(prev => {
              const updated = [...prev];
              const ex = { ...updated[currentExIndex] };
              ex.sets = ex.sets.map(s => ({
                ...s,
                targetWeight: s.type === 'warmup' ? Math.round(newWeight * 0.5) : newWeight,
                cableRatio: ratio
              }));
              if (ex.cableConfig) ex.cableConfig.pulleyRatio = ratio;
              updated[currentExIndex] = ex;
              return updated;
            });
            setShowCableModal(false);
          }}
          onClose={() => setShowCableModal(false)}
        />
      )}

      {/* Exercise Detail & Video Modal */}
      {showDetailModal && (
        <ExerciseDetailModal
          exercise={currentExercise}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Swap Exercise Modal */}
      {showSwapModal && (
        <SwapExerciseModal
          currentExercise={currentExercise}
          onSelectAlternative={handleSwapExercise}
          onClose={() => setShowSwapModal(false)}
        />
      )}

      {/* Workout Queue Modal */}
      {showQueueModal && (
        <WorkoutQueueModal
          exercises={exercises}
          currentIndex={currentExIndex}
          onClose={() => setShowQueueModal(false)}
          onMoveExercise={handleMoveExercise}
          onJumpToExercise={handleJumpToExercise}
        />
      )}

      {/* Max Effort Day Celebration Modal */}
      {maxEffortCelebrationData && (
        <MaxEffortCelebrationModal
          exerciseName={maxEffortCelebrationData.exerciseName}
          weight={maxEffortCelebrationData.weight}
          reps={maxEffortCelebrationData.reps}
          targetReps={maxEffortCelebrationData.targetReps}
          newE1RM={maxEffortCelebrationData.newE1RM}
          onClose={() => setMaxEffortCelebrationData(null)}
        />
      )}

    </div>
  );
};

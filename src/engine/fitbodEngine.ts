import { HERNIATED_DISC_EXCLUDED_IDS, SPINE_SAFE_ALTERNATIVES, isExerciseSpineSafe } from '../data/spineSafety';
import { 
  MuscleGroup, 
  ExerciseItem, 
  PlannedExercise, 
  WorkoutPlan, 
  WorkoutSet, 
  FitnessGoal, 
  FitnessSplit,
  EquipmentType,
  CardioType,
  ExerciseHistoryRecord,
  EquipmentPreference,
  UserBodyProfile,
  FitnessLevel,
  Gender
} from '../types';
import { EXERCISE_CATALOG, MUSCLES_INFO } from '../data/exerciseCatalog';

/**
 * Thuật toán tính mức tạ chuẩn khoa học cá nhân hóa theo % Bodyweight & Trình độ
 * Dựa trên chuẩn Strength Standards NSCA & ExRx, tối ưu theo Mục tiêu tập (Goal) & Giới tính
 */
export function calculateTailoredWeight(
  exercise: ExerciseItem,
  profile?: UserBodyProfile,
  goal: FitnessGoal = 'hypertrophy'
): number {
  const user = profile || { level: 'advanced', gender: 'male', weightKg: 70, heightCm: 172 };
  const bw = Math.max(30, Math.min(200, user.weightKg || 70));
  const isFemale = user.gender === 'female';
  const level = user.level || 'advanced';

  // Điều chỉnh thể trọng hiệu dụng (Effective Bodyweight) theo BMI & Chiều cao:
  // Với người thừa cân (BMI >= 25) ở cấp độ Mới tập / Nâng cao, lượng cân thừa chủ yếu là mỡ (không sinh lực).
  // Hệ thống chuẩn hóa trọng số theo công thức Broca/Robinson để mức tạ khởi điểm vừa sức, an toàn tuyệt đối.
  const heightCm = user.heightCm || 172;
  const hM = heightCm / 100;
  const bmi = hM > 0 ? (bw / (hM * hM)) : 23;
  let effectiveBw = bw;
  if (level !== 'expert' && bmi >= 25 && heightCm > 100) {
    const idealWeight = (heightCm - 100) * 0.9;
    effectiveBw = Math.round(idealWeight + (bw - idealWeight) * 0.45);
  }

  // Nếu là bài bodyweight không tạ
  if (exercise.equipment === 'bodyweight') return 0;

  // Xác định nhóm cơ thân dưới (legs) để áp dụng hệ số giới tính chuẩn sinh lý
  const isLowerBody = exercise.primaryMuscles.some(pm => 
    ['quads', 'hamstrings', 'glutes', 'calves'].includes(pm.muscle)
  );

  // Hệ số giới tính: Nữ thân trên ~0.65, thân dưới ~0.80
  const genderRatio = isFemale ? (isLowerBody ? 0.80 : 0.65) : 1.0;

  // Hệ số mục tiêu (Goal): Strength ~1.00 (85% 1RM), Hypertrophy ~0.85 (70% 1RM), Tone ~0.70 (55% 1RM)
  const goalRatio = goal === 'strength' ? 1.0 : goal === 'tone' ? 0.70 : 0.85;

  let rawWeight = 20;

  if (exercise.equipment === 'barbell') {
    // Tạ đòn chuẩn Olympic
    if (exercise.movementPattern === 'hip_hinge') {
      // Deadlift / RDL: Beginner 0.75x, Advanced 1.35x, Expert 1.90x
      const mult = level === 'beginner' ? 0.75 : level === 'advanced' ? 1.35 : 1.90;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.movementPattern === 'squat') {
      // Squat: Beginner 0.65x, Advanced 1.15x, Expert 1.60x
      const mult = level === 'beginner' ? 0.65 : level === 'advanced' ? 1.15 : 1.60;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('overhead') || exercise.id.includes('military') || (exercise.movementPattern === 'vertical_push')) {
      // Overhead Press: Beginner 0.30x, Advanced 0.55x, Expert 0.80x
      const mult = level === 'beginner' ? 0.30 : level === 'advanced' ? 0.55 : 0.80;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.primaryMuscles.some(pm => pm.muscle === 'chest') || exercise.id.includes('bench')) {
      // Bench Press: Beginner 0.50x, Advanced 0.85x, Expert 1.25x
      const mult = level === 'beginner' ? 0.50 : level === 'advanced' ? 0.85 : 1.25;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.primaryMuscles.some(pm => pm.muscle === 'lats' || pm.muscle === 'upper_back')) {
      // Barbell Row: Beginner 0.45x, Advanced 0.75x, Expert 1.10x
      const mult = level === 'beginner' ? 0.45 : level === 'advanced' ? 0.75 : 1.10;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else {
      const mult = level === 'beginner' ? 0.35 : level === 'advanced' ? 0.60 : 0.90;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    }

    // Tạ đòn: Min 20kg (nam) hoặc 15kg (nữ), làm tròn bước 2.5kg
    const minBar = isFemale ? 15 : 20;
    return Math.max(minBar, Math.round(rawWeight / 2.5) * 2.5);
  }

  if (exercise.equipment === 'dumbbell') {
    // Tạ đơn (mỗi bên tay)
    if (exercise.id.includes('lateral_raise') || exercise.id.includes('front_raise')) {
      const mult = level === 'beginner' ? 0.05 : level === 'advanced' ? 0.09 : 0.14;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(2, Math.round(rawWeight / 1) * 1);
    } else if (exercise.id.includes('curl')) {
      // DB Curl
      const mult = level === 'beginner' ? 0.09 : level === 'advanced' ? 0.15 : 0.22;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(2, Math.round(rawWeight / 2) * 2);
    } else if (exercise.id.includes('shoulder_press') || exercise.movementPattern === 'vertical_push') {
      // DB Shoulder Press
      const mult = level === 'beginner' ? 0.12 : level === 'advanced' ? 0.22 : 0.32;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(4, Math.round(rawWeight / 2) * 2);
    } else if (exercise.movementPattern === 'horizontal_push' || exercise.id.includes('bench')) {
      // DB Bench Press
      const mult = level === 'beginner' ? 0.16 : level === 'advanced' ? 0.28 : 0.40;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(4, Math.round(rawWeight / 2) * 2);
    } else if (exercise.id.includes('row')) {
      // DB Row
      const mult = level === 'beginner' ? 0.14 : level === 'advanced' ? 0.25 : 0.36;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(4, Math.round(rawWeight / 2) * 2);
    } else {
      const mult = level === 'beginner' ? 0.10 : level === 'advanced' ? 0.18 : 0.26;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(2, Math.round(rawWeight / 2) * 2);
    }
  }

  if (exercise.equipment === 'cable') {
    // Dàn kéo cáp
    if (exercise.id.includes('lat_pulldown') || exercise.id.includes('cable_row') || exercise.id.includes('seated_row')) {
      const mult = level === 'beginner' ? 0.45 : level === 'advanced' ? 0.75 : 1.05;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('fly') || exercise.id.includes('crossover')) {
      const mult = level === 'beginner' ? 0.12 : level === 'advanced' ? 0.20 : 0.28;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('tricep') || exercise.id.includes('pushdown')) {
      const mult = level === 'beginner' ? 0.16 : level === 'advanced' ? 0.28 : 0.40;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('face_pull')) {
      const mult = level === 'beginner' ? 0.14 : level === 'advanced' ? 0.24 : 0.34;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else {
      const mult = level === 'beginner' ? 0.16 : level === 'advanced' ? 0.26 : 0.38;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    }
    return Math.max(2.5, Math.round(rawWeight / 2.5) * 2.5);
  }

  if (exercise.equipment === 'machine') {
    // Máy khối / Đạp đùi
    if (exercise.id.includes('leg_press')) {
      const mult = level === 'beginner' ? 1.20 : level === 'advanced' ? 2.20 : 3.20;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(40, Math.round(rawWeight / 10) * 10);
    } else if (exercise.id.includes('leg_curl') || exercise.id.includes('leg_extension')) {
      const mult = level === 'beginner' ? 0.35 : level === 'advanced' ? 0.60 : 0.85;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(10, Math.round(rawWeight / 5) * 5);
    } else if (exercise.id.includes('calf')) {
      const mult = level === 'beginner' ? 0.50 : level === 'advanced' ? 0.90 : 1.30;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(15, Math.round(rawWeight / 5) * 5);
    } else {
      // Machine Chest Press / Shoulder Press / Row
      const mult = level === 'beginner' ? 0.40 : level === 'advanced' ? 0.70 : 1.00;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return Math.max(10, Math.round(rawWeight / 5) * 5);
    }
  }

  return 20;
}

export interface StrengthStandardItem {
  id: string;
  name: string;
  equipmentVi: string;
  weightKg: number;
  unit: string;
}

/**
 * Trả về danh sách mức tạ khuyến nghị cho các bài tập chuẩn mẫu để Sếp xem trước
 */
export function getStrengthPreview(
  profile?: UserBodyProfile,
  goal: FitnessGoal = 'hypertrophy'
): StrengthStandardItem[] {
  const sampleItems: { id: string; name: string; equipment: EquipmentType; pattern: string; muscles: MuscleGroup[]; unit: string }[] = [
    { id: 'barbell_bench_press', name: 'Đẩy ngực đòn ngang (Bench Press)', equipment: 'barbell', pattern: 'horizontal_push', muscles: ['chest'], unit: 'kg (đòn + bánh)' },
    { id: 'barbell_back_squat', name: 'Gánh tạ đùi sau (Back Squat)', equipment: 'barbell', pattern: 'squat', muscles: ['quads', 'glutes'], unit: 'kg (đòn + bánh)' },
    { id: 'conventional_deadlift', name: 'Kéo lưng đùi (Deadlift)', equipment: 'barbell', pattern: 'hip_hinge', muscles: ['lower_back', 'hamstrings', 'glutes'], unit: 'kg (đòn + bánh)' },
    { id: 'standing_overhead_press', name: 'Đẩy vai đòn đứng (OHP)', equipment: 'barbell', pattern: 'vertical_push', muscles: ['shoulders'], unit: 'kg (đòn + bánh)' },
    { id: 'dumbbell_bench_press', name: 'Đẩy ngực tạ đơn (DB Bench)', equipment: 'dumbbell', pattern: 'horizontal_push', muscles: ['chest'], unit: 'kg / mỗi bên' },
    { id: 'dumbbell_bicep_curl', name: 'Cuốn tay trước tạ đơn (DB Curl)', equipment: 'dumbbell', pattern: 'isolation', muscles: ['biceps'], unit: 'kg / mỗi bên' },
    { id: 'lat_pulldown', name: 'Kéo xô máy cáp (Lat Pulldown)', equipment: 'cable', pattern: 'vertical_pull', muscles: ['lats'], unit: 'kg tạ cắm' },
    { id: 'leg_press', name: 'Đạp đùi máy nghiêng (Leg Press)', equipment: 'machine', pattern: 'squat', muscles: ['quads', 'glutes'], unit: 'kg tổng đĩa' }
  ];

  return sampleItems.map(item => {
    const fakeEx: ExerciseItem = {
      id: item.id,
      name: item.name,
      tier: 1,
      equipment: item.equipment,
      movementPattern: item.pattern,
      primaryMuscles: item.muscles.map(m => ({ muscle: m, ratio: 1.0 })),
      secondaryMuscles: []
    };
    const calculated = calculateTailoredWeight(fakeEx, profile, goal);
    return {
      id: item.id,
      name: item.name,
      equipmentVi: item.equipment === 'barbell' ? 'Tạ đòn' : item.equipment === 'dumbbell' ? 'Tạ đơn' : item.equipment === 'cable' ? 'Máy cáp' : 'Máy khối',
      weightKg: calculated,
      unit: item.unit
    };
  });
}

/**
 * Ước tính 1RM theo chuẩn Brzycki (reps <= 10) và Epley (reps > 10)
 */
export function calculateE1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  if (reps <= 10) {
    return Math.round((weight / (1.0278 - (0.0278 * reps))) * 10) / 10;
  }
  return Math.round((weight * (1.0 + (reps / 30.0))) * 10) / 10;
}

/**
 * Máy tính xếp đĩa tạ đòn (Plate Calculator)
 */
export function calculatePlates(targetWeight: number, barWeight: number = 20): {
  platesEachSide: Record<string, number>;
  weightPerSide: number;
  unmatched: number;
} {
  if (targetWeight < barWeight) {
    return { platesEachSide: {}, weightPerSide: 0, unmatched: 0 };
  }

  const sideWeight = (targetWeight - barWeight) / 2;
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  const platesEachSide: Record<string, number> = {};

  let remaining = sideWeight;
  for (const plate of availablePlates) {
    const count = Math.floor(remaining / plate);
    if (count > 0) {
      platesEachSide[`${plate}kg`] = count;
      remaining = Math.round((remaining - (count * plate)) * 100) / 100;
    }
  }

  return {
    platesEachSide,
    weightPerSide: sideWeight,
    unmatched: remaining * 2
  };
}

/**
 * Tính toán mức phục hồi của 14 nhóm cơ theo hàm suy thoái mũ
 * R(t) = 100 - (100 - R0) * exp(-t / tau)
 */
export function calculateDynamicRecovery(
  recoveryState: Record<MuscleGroup, number>,
  lastTrainedTime: Record<MuscleGroup, number | null>,
  currentTime: number = Date.now()
): Record<MuscleGroup, number> {
  const result: Record<MuscleGroup, number> = {} as any;

  (Object.keys(MUSCLES_INFO) as MuscleGroup[]).forEach((muscle) => {
    const r0 = recoveryState[muscle] ?? 100;
    const lastTrained = lastTrainedTime[muscle];

    if (!lastTrained || r0 >= 100) {
      result[muscle] = 100;
    } else {
      const elapsedHours = (currentTime - lastTrained) / (1000 * 60 * 60);
      const tau = MUSCLES_INFO[muscle].tau;
      const recovered = 100 - (100 - r0) * Math.exp(-elapsedHours / tau);
      result[muscle] = Math.min(100, Math.max(0, Math.round(recovered)));
    }
  });

  return result;
}

/**
 * Tính toán mức mỏi cơ thực tế dựa trên các hiệp THỰC SỰ ĐÃ HOÀN THÀNH (isCompleted = true)
 * Chuẩn thuật toán Fitbod: Mỗi working set hoàn thành làm giảm 3% - 6% độ hồi phục tùy theo
 * cường độ tạ (% 1RM), số rep, Tier bài tập và tỷ lệ nhóm cơ chính/phụ.
 */
export function calculateCompletedWorkoutFatigue(
  currentRecovery: Record<MuscleGroup, number>,
  exercises: PlannedExercise[]
): Record<MuscleGroup, number> {
  const updated: Record<MuscleGroup, number> = { ...currentRecovery };
  const fatigue: Record<MuscleGroup, number> = {} as any;
  (Object.keys(MUSCLES_INFO) as MuscleGroup[]).forEach(m => { fatigue[m] = 0; });

  let hasAnyCompletedSet = false;

  exercises.forEach(ex => {
    const catalogItem = EXERCISE_CATALOG.find(c => c.id === ex.exerciseId);
    if (!catalogItem) return;

    // CHỈ TÍNH NHỮNG HIỆP ĐÃ TICK HOÀN THÀNH
    const completedSets = ex.sets.filter(s => s.isCompleted);
    if (completedSets.length === 0) return;

    hasAnyCompletedSet = true;

    // Hệ số tải thần kinh theo Tier (Tier 1 Compound nặng hơn Tier 3 Isolation)
    const tierMultiplier = catalogItem.tier === 1 ? 1.0 : (catalogItem.tier === 2 ? 0.85 : 0.7);

    completedSets.forEach(set => {
      const weight = set.loggedWeight ?? set.targetWeight;
      const reps = set.loggedReps ?? set.targetReps;
      const e1rm = calculateE1RM(weight, reps);
      const intensity = (e1rm > 0 && weight > 0) ? Math.min(1.0, weight / e1rm) : 0.7;

      // Mỗi hiệp chuẩn đóng góp 3.0% - 5.5% độ mỏi
      const baseSetFatigue = Math.min(5.5, Math.max(2.5, reps * intensity * tierMultiplier * 0.65));

      catalogItem.primaryMuscles.forEach(pm => {
        fatigue[pm.muscle] = (fatigue[pm.muscle] || 0) + baseSetFatigue * pm.ratio;
      });

      catalogItem.secondaryMuscles.forEach(sm => {
        fatigue[sm.muscle] = (fatigue[sm.muscle] || 0) + baseSetFatigue * sm.ratio * 0.35;
      });
    });
  });

  (Object.keys(currentRecovery) as MuscleGroup[]).forEach(m => {
    if (fatigue[m] && fatigue[m]! > 0) {
      updated[m] = Math.max(10, Math.round(updated[m] - fatigue[m]!));
    }
  });

  return updated;
}

/**
 * Thuật toán tạo buổi tập thông minh chuẩn Fitbod AI:
 * - Cân bằng tuyệt đối tỷ lệ bài tập giữa các nhóm cơ đã chọn (chống cơ này nuốt trọn cơ khác)
 * - Tùy chọn ưu tiên hệ thiết bị (Tạ đơn, Tạ đòn, Máy cáp, Máy khối)
 */
/**
 * Tính toán thời gian nghỉ khoa học chuẩn xác theo Fitbod & Sinh lý cơ bắp:
 * - Hiệp Warmup (Khởi động): 30s
 * - Tier 3 (Cơ nhỏ cô lập: Tay trước, Tay sau, Vai bên/sau, Bụng, Bắp chân): 45s
 * - Tier 2 (Bài máy khối, Cáp, Tạ đôi, Kéo xô, Leg Press): 60s (1 phút)
 * - Tier 1 (Bài tạ đòn nặng: Squat, Deadlift, Bench Press, Barbell Row, OHP): 90s (Hypertrophy) / 120s (Strength)
 */
export function calculateExerciseRestSeconds(
  ex: { tier?: number; primaryMuscles?: any[] },
  goal: FitnessGoal = 'hypertrophy'
): number {
  const tier = ex.tier || 2;
  const muscles = (ex.primaryMuscles || []).map((m: any) => {
    if (typeof m === 'string') return m.toLowerCase();
    if (m && typeof m.muscle === 'string') return m.muscle.toLowerCase();
    return '';
  });

  const isSmallMuscle = muscles.some(m => 
    m.includes('bicep') || m.includes('tricep') || m.includes('tay') ||
    m.includes('lateral_deltoid') || m.includes('rear_deltoid') || m.includes('vai bên') || m.includes('vai sau') ||
    m.includes('calf') || m.includes('calves') || m.includes('bắp chân') ||
    m.includes('abs') || m.includes('bụng') || m.includes('forearm') || m.includes('cẳng tay')
  );

  if (isSmallMuscle || tier === 3) {
    if (goal === 'strength') return 60;
    if (goal === 'tone') return 30;
    return 45; // 45 giây cho nhóm cơ nhỏ
  }

  if (tier === 1) {
    if (goal === 'strength') return 120;
    if (goal === 'tone') return 60;
    return 90; // 90 giây cho tạ đòn nặng
  }

  // Tier 2 (Máy, cáp, tạ đôi)
  if (goal === 'strength') return 90;
  if (goal === 'tone') return 45;
  return 60; // 60 giây (1 phút) chuẩn cho bài máy và kéo xô
}

export function generateSmartWorkout(
  recovery: Record<MuscleGroup, number>,
  availableEquipment: EquipmentType[],
  goal: FitnessGoal = 'hypertrophy',
  split: FitnessSplit = 'push_pull_legs',
  durationMinutes: number = 60,
  includeWarmup: boolean = true,
  cardioType: CardioType = 'none',
  cardioDurationMinutes: number = 15,
  customTargetMuscles?: MuscleGroup[],
  exerciseHistory?: Record<string, ExerciseHistoryRecord>,
  equipmentPreference: EquipmentPreference = 'all',
  excludedExerciseIds?: string[],
  forceMaxEffortExerciseId?: string,
  bodyProfile?: UserBodyProfile
): WorkoutPlan {
  // 1. Phân định nhóm cơ theo Split hoặc Target Muscles tùy chọn
  const splitMapping: Record<FitnessSplit, MuscleGroup[]> = {
    push_pull_legs: ['chest', 'shoulders', 'triceps'],
    upper_lower: ['chest', 'lats', 'upper_back', 'shoulders', 'biceps', 'triceps'],
    full_body: Object.keys(MUSCLES_INFO) as MuscleGroup[]
  };

  let candidateMuscles = splitMapping[split];
  let isCustom = false;

  if (customTargetMuscles && customTargetMuscles.length > 0) {
    candidateMuscles = customTargetMuscles;
    isCustom = true;
  } else if (split === 'push_pull_legs') {
    const pushAvg = (recovery.chest + recovery.shoulders + recovery.triceps) / 3;
    const pullAvg = (recovery.lats + recovery.upper_back + recovery.biceps) / 3;
    const legsAvg = (recovery.quads + recovery.hamstrings + recovery.glutes) / 3;

    if (pullAvg >= pushAvg && pullAvg >= legsAvg) {
      candidateMuscles = ['lats', 'upper_back', 'biceps', 'forearms'];
    } else if (legsAvg >= pushAvg && legsAvg >= pullAvg) {
      candidateMuscles = ['quads', 'hamstrings', 'glutes', 'calves', 'lower_back'];
    }
  }

  // 2. Lọc các bài tập thỏa mãn thiết bị và nhóm cơ (loại bỏ bài tập máy phòng gym không có hoặc bài hại cột sống)
  const effectiveExcluded = new Set<string>(excludedExerciseIds || []);
  if (bodyProfile?.spineSafeMode) {
    HERNIATED_DISC_EXCLUDED_IDS.forEach(id => effectiveExcluded.add(id));
  }

  const eligible = EXERCISE_CATALOG.filter((ex) => {
    if (ex.movementPattern === 'cardio') return false;
    if (effectiveExcluded.has(ex.id)) return false;
    const equipOk = ex.equipment === 'bodyweight' || availableEquipment.includes(ex.equipment);
    if (!equipOk) return false;
    return ex.primaryMuscles.some((pm) => candidateMuscles.includes(pm.muscle));
  });

  // Tính điểm ưu tiên cho từng bài tập:
  // - Ưu tiên thiết bị nếu Sếp chọn: +60 điểm
  // - Ưu tiên Compound/Tier chuẩn khoa học: (5 - tier) * 10
  const getExerciseScore = (ex: ExerciseItem): number => {
    let score = 0;
    if (equipmentPreference !== 'all') {
      if (ex.equipment === equipmentPreference) {
        score += 60;
      } else if (ex.equipment === 'bodyweight' && equipmentPreference === 'dumbbell') {
        score += 10;
      } else if (ex.equipment === 'barbell' && equipmentPreference === 'dumbbell') {
        score += 5;
      }
    }
    score += (5 - ex.tier) * 10;
    return score;
  };

  // 3. Phân nhóm bài tập theo từng nhóm cơ mục tiêu (Primary Muscle)
  const byMuscle: Record<string, ExerciseItem[]> = {};
  candidateMuscles.forEach(m => {
    byMuscle[m] = [];
  });

  eligible.forEach(ex => {
    const targetMuscle = ex.primaryMuscles.find(pm => candidateMuscles.includes(pm.muscle))?.muscle;
    if (targetMuscle && byMuscle[targetMuscle]) {
      byMuscle[targetMuscle].push(ex);
    }
  });

  // Sắp xếp bài tập của từng nhóm cơ theo điểm số ưu tiên
  candidateMuscles.forEach(m => {
    byMuscle[m].sort((a, b) => getExerciseScore(b) - getExerciseScore(a));
  });

  // 4. Phân bổ đồng đều số lượng bài tập (Balanced Representation - Đảm bảo ngực và tay sau đều có bài)
  const count = Math.min(eligible.length, Math.max(4, Math.floor(durationMinutes / 10)));
  const selected: ExerciseItem[] = [];
  const selectedIds = new Set<string>();

  const numMuscles = candidateMuscles.length;
  const basePerMuscle = Math.max(1, Math.floor(count / numMuscles));

  // Vòng 1: Lấy tối thiểu basePerMuscle bài cho MỌI nhóm cơ đã chọn
  candidateMuscles.forEach(m => {
    let taken = 0;
    for (const ex of byMuscle[m]) {
      if (taken < basePerMuscle && !selectedIds.has(ex.id)) {
        selected.push(ex);
        selectedIds.add(ex.id);
        taken++;
      }
    }
  });

  // Vòng 2: Phân bổ các slot còn lại theo vòng tròn cho các nhóm cơ có bài tập chất lượng
  for (const m of candidateMuscles) {
    if (selected.length >= count) break;
    for (const ex of byMuscle[m]) {
      if (!selectedIds.has(ex.id)) {
        selected.push(ex);
        selectedIds.add(ex.id);
        break;
      }
    }
  }

  // Vòng 3: Nếu vẫn còn thiếu slot (do nhóm cơ nào đó ít bài), lấy tiếp từ danh sách chung
  if (selected.length < count) {
    const remainingEligible = [...eligible].sort((a, b) => getExerciseScore(b) - getExerciseScore(a));
    for (const ex of remainingEligible) {
      if (selected.length >= count) break;
      if (!selectedIds.has(ex.id)) {
        selected.push(ex);
        selectedIds.add(ex.id);
      }
    }
  }

  // 5. Sắp xếp thứ tự buổi tập: Bài Compound nặng (Tier 1) tập trước, đến Tier 2, rồi Isolation (Tier 3)
  selected.sort((a, b) => a.tier - b.tier);

  // 5. Thuật toán kích hoạt MAX EFFORT DAY chuẩn Fitbod:
  // Quy tắc chuẩn từ Fitbod Help Center:
  // - "Max Effort Days appear periodically based on your training history, so it's normal not to see one every workout."
  // - "Fitbod spaces them out so you're not going to failure two sessions in a row." (Cách nhau ít nhất 3-5 buổi)
  // - "An exercise is brand new to you. Fitbod needs some history with it before scheduling a Max Effort Day." (Cần ít nhất 2 buổi tập tích lũy)
  // - "You'll only get one Max Effort Day per muscle in a given workout." (Tối đa 1 bài duy nhất/buổi)
  // - "It's a band, superset, or circuit exercise. These aren't eligible." (Phải là bài compound có tải trọng tạ rõ ràng)
  // - Nhóm cơ chính phải phục hồi tốt (>= 85%) để đảm bảo an toàn và phát huy tối đa sức mạnh.
  let maxEffortIdx = -1;

  if (forceMaxEffortExerciseId) {
    maxEffortIdx = selected.findIndex(ex => ex.id === forceMaxEffortExerciseId);
  } else if (exerciseHistory && Object.keys(exerciseHistory).length > 0) {
    for (let i = 0; i < selected.length; i++) {
      const ex = selected[i];
      if (ex.tier !== 1 && ex.tier !== 2) continue;
      if (ex.equipment === 'bodyweight' || ex.equipment === 'resistance_band') continue;

      const primaryMuscle = ex.primaryMuscles[0]?.muscle;
      const isRecovered = primaryMuscle ? (recovery[primaryMuscle] ?? 100) >= 85 : true;
      if (!isRecovered) continue;

      const hist = exerciseHistory[ex.id];
      if (hist) {
        const hasEnoughSessions = hist.totalSessions >= 2;
        const isSpacedOut = (hist.sessionsSinceLastMaxEffort ?? 99) >= 3;
        if (hasEnoughSessions && isSpacedOut) {
          maxEffortIdx = i;
          break; // Chỉ chọn 1 bài duy nhất theo chuẩn Fitbod
        }
      }
    }
  }

  // 6. Cấu hình Sets & Reps theo Goal
  const goalConfig = {
    strength: { sets: 4, reps: 5, rir: 2, rest: 180, basePct: 0.85 },
    hypertrophy: { sets: 3, reps: 10, rir: 1, rest: 90, basePct: 0.70 },
    tone: { sets: 3, reps: 14, rir: 2, rest: 45, basePct: 0.55 }
  }[goal];

  const plannedExercises: PlannedExercise[] = selected.map((ex, exIdx) => {
    const isExerciseMaxEffort = exIdx === maxEffortIdx;

    // Tính toán mức tạ khoa học cá nhân hóa theo % Bodyweight & Trình độ (Beginner/Advanced/Expert)
    const targetWeight = calculateTailoredWeight(ex, bodyProfile, goal);

    const cableConfig = ex.equipment === 'cable' ? (ex.cableConfig || {
      pulleyRatio: (ex.id === 'lat_pulldown' || ex.id === 'seated_cable_row') ? ('1:1' as const) : ('2:1' as const),
      defaultStackKg: targetWeight,
      noteVi: (ex.id === 'lat_pulldown' || ex.id === 'seated_cable_row')
        ? 'Ròng rọc đơn 1:1 (Lực kéo = 100% tạ cắm)'
        : 'Ròng rọc đôi 2:1 (Lực kéo = 50% tạ cắm do qua ròng rọc di động)'
    }) : undefined;

    const sets: WorkoutSet[] = [];
    let currentSetIndex = 1;

    // A. Thêm hiệp khởi động (Warmup) nếu được chọn bật
    if (includeWarmup && ex.tier === 1) {
      const minW = ex.equipment === 'barbell' ? 20 : 2.5;
      const w1 = Math.max(minW, Math.round((targetWeight * 0.5) / 2.5) * 2.5);
      sets.push({
        setIndex: currentSetIndex++,
        type: 'warmup',
        targetWeight: w1,
        targetReps: 10,
        isCompleted: false
      });

      if (targetWeight > (ex.equipment === 'barbell' ? 45 : 20)) {
        const w2 = Math.max(minW, Math.round((targetWeight * 0.7) / 2.5) * 2.5);
        sets.push({
          setIndex: currentSetIndex++,
          type: 'warmup',
          targetWeight: w2,
          targetReps: 5,
          isCompleted: false
        });
      }
    } else if (includeWarmup) {
      // Tier 2 & Tier 3: Thêm 1 hiệp khởi động nhẹ làm nóng khớp
      const minW = ex.equipment === 'barbell' ? 20 : 2.5;
      const w1 = Math.max(minW, Math.round((targetWeight * 0.5) / 2.5) * 2.5);
      sets.push({
        setIndex: currentSetIndex++,
        type: 'warmup',
        targetWeight: w1,
        targetReps: 8,
        isCompleted: false
      });
    }

    // B. Các hiệp chính (Working sets) & Hiệp Max Effort (AMRAP)
    for (let i = 1; i <= goalConfig.sets; i++) {
      const isAmrap = isExerciseMaxEffort ? (i === goalConfig.sets) : (i === goalConfig.sets && goal === 'strength');
      sets.push({
        setIndex: currentSetIndex++,
        type: isAmrap ? 'amrap' : 'working',
        targetWeight: targetWeight,
        targetReps: goalConfig.reps,
        isCompleted: false,
        rir: isAmrap ? 0 : goalConfig.rir,
        cableRatio: cableConfig?.pulleyRatio
      });
    }

    return {
      exerciseId: ex.id,
      exerciseName: ex.name,
      tier: ex.tier,
      equipment: ex.equipment,
      sets,
      restSeconds: calculateExerciseRestSeconds(ex, goal),
      primaryMuscles: ex.primaryMuscles.map(pm => MUSCLES_INFO[pm.muscle]?.nameVi || pm.muscle),
      muscleTarget: ex.muscleTarget,
      cableConfig,
      images: ex.images,
      videoUrl: ex.videoUrl,
      videoEmbedId: ex.videoEmbedId,
      setup: ex.setup,
      execution: ex.execution,
      mistakes: ex.mistakes,
      isMaxEffort: isExerciseMaxEffort,
      maxEffortGoalReps: goalConfig.reps
    };
  });

  // 7. Nhét bài Cardio cuối buổi nếu Sếp chọn
  if (cardioType !== 'none') {
    const cardioItem = EXERCISE_CATALOG.find(c => c.id === `cardio_${cardioType}`);
    if (cardioItem) {
      plannedExercises.push({
        exerciseId: cardioItem.id,
        exerciseName: cardioItem.name,
        tier: 4,
        equipment: 'machine',
        sets: [
          {
            setIndex: 1,
            type: 'working',
            targetWeight: 0,
            targetReps: cardioDurationMinutes,
            isCompleted: false
          }
        ],
        restSeconds: 0,
        primaryMuscles: cardioItem.primaryMuscles.map(pm => MUSCLES_INFO[pm.muscle]?.nameVi || pm.muscle),
        muscleTarget: cardioItem.muscleTarget,
        images: cardioItem.images,
        videoUrl: cardioItem.videoUrl,
        videoEmbedId: cardioItem.videoEmbedId,
        setup: cardioItem.setup,
        execution: cardioItem.execution,
        mistakes: cardioItem.mistakes,
        isCardio: true,
        cardioMinutes: cardioDurationMinutes
      });
    }
  }

  let title = 'Buổi tập cá nhân hóa';
  if (isCustom) {
    const names = candidateMuscles.map(m => MUSCLES_INFO[m]?.nameVi || m).slice(0, 3).join(' • ');
    title = `Mục Tiêu: ${names}${candidateMuscles.length > 3 ? '...' : ''}`;
  } else {
    const splitNames = {
      push_pull_legs: candidateMuscles.includes('chest') ? 'Push (Ngực, Vai, Tay sau)' : (candidateMuscles.includes('lats') ? 'Pull (Lưng xô, Tay trước)' : 'Legs (Chân, Mông, Đùi)'),
      upper_lower: 'Upper Body (Thân trên)',
      full_body: 'Full Body (Toàn thân)'
    };
    title = splitNames[split] || 'Buổi tập cá nhân hóa';
  }

  return {
    id: 'workout_' + Date.now(),
    title,
    split,
    durationMinutes: durationMinutes + (cardioType !== 'none' ? cardioDurationMinutes : 0),
    date: new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' }),
    exercises: plannedExercises,
    includeWarmup,
    cardioType,
    cardioDurationMinutes,
    targetMuscles: candidateMuscles,
    hasMaxEffort: maxEffortIdx !== -1,
    equipmentPreference,
    excludedExerciseIds: Array.from(effectiveExcluded),
    bodyProfile,
    spineSafeMode: bodyProfile?.spineSafeMode ?? false
  };
}

/**
 * Trình phân tích chuỗi CSV Fitbod WorkoutExport.csv trực tiếp trên trình duyệt
 */
export function parseFitbodCsvText(csvText: string): {
  totalWorkouts: number;
  totalSets: number;
  totalVolumeKg: number;
  records: Array<{ exercise: string; maxWeight: number; maxE1RM: number; bestSet: string }>;
} {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { totalWorkouts: 0, totalSets: 0, totalVolumeKg: 0, records: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const weightColIndex = headers.findIndex(h => h.toLowerCase().includes('weight'));
  const repsColIndex = headers.findIndex(h => h.toLowerCase().includes('reps'));
  const exerciseColIndex = headers.findIndex(h => h.toLowerCase().includes('exercise'));
  const dateColIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
  const multiplierColIndex = headers.findIndex(h => h.toLowerCase().includes('multiplier'));
  const warmupColIndex = headers.findIndex(h => h.toLowerCase().includes('warmup'));

  const workouts = new Set<string>();
  const recordMap: Record<string, { maxWeight: number; maxE1RM: number; bestSet: string }> = {};
  let totalSets = 0;
  let totalVolumeKg = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length <= exerciseColIndex) continue;

    const dateStr = cols[dateColIndex] || '';
    const exercise = cols[exerciseColIndex] || '';
    if (!exercise || !dateStr) continue;

    workouts.add(dateStr.substring(0, 10));
    totalSets++;

    const reps = parseInt(cols[repsColIndex] || '0', 10) || 0;
    const weight = parseFloat(cols[weightColIndex] || '0') || 0;
    const multiplier = parseFloat(cols[multiplierColIndex] || '1.0') || 1.0;
    const isWarmup = (cols[warmupColIndex] || '').toLowerCase() === 'true';

    if (!isWarmup && reps > 0 && weight > 0) {
      const effectiveWeight = weight * multiplier;
      totalVolumeKg += effectiveWeight * reps;
      const e1rm = calculateE1RM(effectiveWeight, reps);

      if (!recordMap[exercise] || e1rm > recordMap[exercise].maxE1RM) {
        recordMap[exercise] = {
          maxWeight: Math.max(recordMap[exercise]?.maxWeight || 0, effectiveWeight),
          maxE1RM: e1rm,
          bestSet: `${reps} reps @ ${effectiveWeight}kg`
        };
      }
    }
  }

  const records = Object.entries(recordMap).map(([exercise, data]) => ({
    exercise,
    ...data
  })).sort((a, b) => b.maxE1RM - a.maxE1RM);

  return {
    totalWorkouts: workouts.size,
    totalSets,
    totalVolumeKg: Math.round(totalVolumeKg),
    records
  };
}

/**
 * Tự động thanh lọc hoặc chuyển đổi các bài tập gây hại cột sống/thoát vị đĩa đệm
 */
export function sanitizeWorkoutForSpineSafety(
  workout: WorkoutPlan,
  spineSafeMode: boolean,
  bodyProfile?: UserBodyProfile,
  goal: FitnessGoal = 'hypertrophy'
): WorkoutPlan {
  if (!spineSafeMode) {
    return { ...workout, spineSafeMode: false };
  }

  const sanitizedExercises = workout.exercises.map((pEx) => {
    if (HERNIATED_DISC_EXCLUDED_IDS.includes(pEx.exerciseId)) {
      const altId = SPINE_SAFE_ALTERNATIVES[pEx.exerciseId];
      const altEx = altId ? EXERCISE_CATALOG.find(e => e.id === altId) : null;
      if (altEx) {
        const tailoredWeight = calculateTailoredWeight(altEx, bodyProfile, goal);
        return {
          ...pEx,
          exerciseId: altEx.id,
          exerciseName: altEx.name,
          tier: altEx.tier,
          equipment: altEx.equipment,
          restSeconds: calculateExerciseRestSeconds(altEx, goal),
          primaryMuscles: altEx.primaryMuscles.map(pm => MUSCLES_INFO[pm.muscle]?.nameVi || pm.muscle),
          muscleTarget: altEx.muscleTarget,
          cableConfig: altEx.cableConfig,
          images: altEx.images,
          videoUrl: altEx.videoUrl,
          videoEmbedId: altEx.videoEmbedId,
          setup: altEx.setup,
          execution: altEx.execution,
          mistakes: altEx.mistakes,
          sets: pEx.sets.map(s => ({
            ...s,
            targetWeight: s.type === 'warmup' ? Math.round(tailoredWeight * 0.5) : tailoredWeight
          }))
        };
      }
    }
    return pEx;
  });

  return {
    ...workout,
    exercises: sanitizedExercises,
    spineSafeMode: true
  };
}

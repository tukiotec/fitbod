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
 * Hàm làm tròn mức tạ theo bước tạ gym thực tế chuẩn quốc tế:
 * - Tạ đòn (Barbell): bước 2.5kg, min 20kg (Olympic Bar tiêu chuẩn)
 * - Tạ đơn (Dumbbell): bước 2kg (mỗi bên tay), min 4kg (4, 6, 8, 10, 12, 14, 16, 18, 20...) - Tuyệt đối không sinh số lẻ kì quặc
 * - Máy cáp (Cable): bước 2.5kg, min 5kg
 * - Máy khối (Machine): bước 5kg, min 10kg (riêng Leg Press đạp đùi làm tròn bước 10kg, min 40kg)
 * - Bodyweight: 0kg
 */
export function roundGymWeight(
  rawWeight: number,
  equipment: EquipmentType,
  exerciseId?: string
): number {
  if (equipment === 'bodyweight') return 0;

  if (equipment === 'barbell') {
    // Tạ đòn: bước 2.5kg, tối thiểu 20kg (đòn Olympic chuẩn gym)
    return Math.max(20, Math.round(rawWeight / 2.5) * 2.5);
  }

  if (equipment === 'dumbbell') {
    // Tạ đơn mỗi bên: bước 2kg, tối thiểu 4kg (4kg, 6kg, 8kg, 10kg, 12kg... Tuyệt đối không sinh số lẻ 3, 5, 7kg)
    return Math.max(4, Math.round(rawWeight / 2) * 2);
  }

  if (equipment === 'cable') {
    // Máy cáp: bước 2.5kg, tối thiểu 5kg
    return Math.max(5, Math.round(rawWeight / 2.5) * 2.5);
  }

  if (equipment === 'machine') {
    if (exerciseId && exerciseId.includes('leg_press')) {
      // Đạp đùi Leg Press: bước 10kg, min 40kg
      return Math.max(40, Math.round(rawWeight / 10) * 10);
    }
    // Máy khối khác: bước 5kg, tối thiểu 10kg
    return Math.max(10, Math.round(rawWeight / 5) * 5);
  }

  return Math.max(2.5, Math.round(rawWeight / 2.5) * 2.5);
}

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

    return roundGymWeight(rawWeight, 'barbell', exercise.id);
  }

  if (exercise.equipment === 'dumbbell') {
    // Tạ đơn (mỗi bên tay)
    if (exercise.id.includes('lateral_raise') || exercise.id.includes('front_raise')) {
      const mult = level === 'beginner' ? 0.05 : level === 'advanced' ? 0.09 : 0.14;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('curl')) {
      // DB Curl
      const mult = level === 'beginner' ? 0.09 : level === 'advanced' ? 0.15 : 0.22;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('shoulder_press') || exercise.movementPattern === 'vertical_push') {
      // DB Shoulder Press
      const mult = level === 'beginner' ? 0.12 : level === 'advanced' ? 0.22 : 0.32;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.movementPattern === 'horizontal_push' || exercise.id.includes('bench')) {
      // DB Bench Press
      const mult = level === 'beginner' ? 0.16 : level === 'advanced' ? 0.28 : 0.40;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('row')) {
      // DB Row
      const mult = level === 'beginner' ? 0.14 : level === 'advanced' ? 0.25 : 0.36;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else {
      const mult = level === 'beginner' ? 0.10 : level === 'advanced' ? 0.18 : 0.26;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    }

    return roundGymWeight(rawWeight, 'dumbbell', exercise.id);
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
    return roundGymWeight(rawWeight, 'cable', exercise.id);
  }

  if (exercise.equipment === 'machine') {
    // Máy khối / Đạp đùi
    if (exercise.id.includes('leg_press')) {
      const mult = level === 'beginner' ? 1.20 : level === 'advanced' ? 2.20 : 3.20;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('leg_curl') || exercise.id.includes('leg_extension')) {
      const mult = level === 'beginner' ? 0.35 : level === 'advanced' ? 0.60 : 0.85;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else if (exercise.id.includes('calf')) {
      const mult = level === 'beginner' ? 0.50 : level === 'advanced' ? 0.90 : 1.30;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    } else {
      // Machine Chest Press / Shoulder Press / Row
      const mult = level === 'beginner' ? 0.40 : level === 'advanced' ? 0.70 : 1.00;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
    }
    return roundGymWeight(rawWeight, 'machine', exercise.id);
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
  ex: { tier?: number; primaryMuscles?: any[]; isCardio?: boolean; exerciseId?: string; id?: string },
  goal: FitnessGoal = 'hypertrophy'
): number {
  if (ex.isCardio || ex.exerciseId?.startsWith('cardio_') || ex.id?.startsWith('cardio_')) {
    return 0;
  }

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

  if (isSmallMuscle || tier === 3 || tier === 4) {
    if (goal === 'strength') return 60;
    if (goal === 'tone') return 30;
    return 45; // 45 giây cho nhóm cơ nhỏ & cơ bụng
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

/**
 * Phân tầng thứ tự bài tập chuẩn y học thể hình (NSCA / Fitbod Standard):
 * 1. Tier 1 (Compound nặng: Bench Press, Leg Press, Barbell Row...): Luôn nằm đầu buổi khi hệ thần kinh và cơ bắp sung sức nhất.
 * 2. Tier 2 (Secondary Compound / Máy khối / Tạ đôi: Incline DB, Lat Pulldown, Seated Cable Row...): Nằm ở giữa buổi.
 * 3. Tier 3 (Isolation cơ nhỏ: Bay vai ngang, Cuốn bắp tay, Duỗi tay sau, Nhón bắp chân...): Nằm ở nửa sau buổi tập.
 * 4. Tier 4 (Core & Cardio: Plank, Gập bụng, Máy chạy/xe đạp): Luôn nằm ở cuối cùng của buổi tập.
 */
export function getExerciseTierOrder(ex: {
  id?: string;
  exerciseId?: string;
  tier?: number;
  equipment?: EquipmentType;
  movementPattern?: string;
  primaryMuscles?: any[];
  isCardio?: boolean;
}): number {
  const id = ex.exerciseId || ex.id || '';
  // Cardio luôn ở vị trí tuyệt đối sau cùng của buổi tập (Tier 4.5)
  if (id.startsWith('cardio_') || ex.movementPattern === 'cardio' || ex.isCardio) {
    return 4.5;
  }
  // Core (Bụng & Lõi) luôn ở nửa cuối (Tier 4.0)
  if (
    id === 'plank' ||
    id === 'cable_crunch' ||
    id === 'hanging_leg_raise' ||
    id === 'cable_woodchopper' ||
    ex.movementPattern === 'core'
  ) {
    return 4.0;
  }
  const muscles = (ex.primaryMuscles || []).map((m: any) => {
    if (typeof m === 'string') return m.toLowerCase();
    if (m && typeof m.muscle === 'string') return m.muscle.toLowerCase();
    return '';
  });
  if (muscles.some(m => m === 'abs' || m.includes('bụng') || m.includes('core'))) {
    return 4.0;
  }
  // Leg Press (Đạp đùi) là bài Compound nặng Tier 1 theo chuẩn NSCA
  if (id === 'leg_press') {
    return 1.0;
  }
  return ex.tier || 2;
}

/**
 * Trả về khóa nhận diện góc tác động / chuyển động (Angle Diversity Key)
 * Ngăn chặn tuyệt đối việc sinh ra 2 bài cùng 1 góc đẩy phẳng hoặc cùng dạng chuyển động trong 1 buổi tập
 */
export function getExerciseAngleDiversityKey(ex: ExerciseItem): string {
  const id = ex.id;
  const primaryMuscle = ex.primaryMuscles[0]?.muscle || '';

  // 1. CHEST (Ngực)
  if (primaryMuscle === 'chest') {
    if (id === 'incline_barbell_bench_press' || id === 'incline_dumbbell_press' || id === 'incline_chest_press_machine') {
      return 'chest_incline_press';
    }
    if (id === 'decline_dumbbell_press' || id === 'chest_dip') {
      return 'chest_decline_dips';
    }
    if (id === 'cable_chest_fly' || id === 'incline_cable_fly' || id === 'decline_cable_fly' || id === 'pec_deck_machine') {
      return 'chest_fly';
    }
    if (id === 'barbell_bench_press' || id === 'dumbbell_bench_press' || id === 'chest_press_machine' || id === 'push_up') {
      return 'chest_flat_press';
    }
  }

  // 2. SHOULDERS (Vai & Cầu vai)
  if (primaryMuscle === 'shoulders' || primaryMuscle === 'traps') {
    if (id === 'overhead_press' || id === 'dumbbell_shoulder_press' || id === 'arnold_press') {
      return 'shoulder_overhead_press';
    }
    if (id === 'dumbbell_lateral_raise' || id === 'cable_lateral_raise') {
      return 'shoulder_lateral_raise';
    }
    if (id === 'face_pull' || id === 'dumbbell_rear_delt_fly' || id === 'reverse_pec_deck') {
      return 'shoulder_rear_delt';
    }
    if (id === 'barbell_shrug') {
      return 'shoulder_shrug';
    }
  }

  // 3. BACK (Lưng xô & Lưng dưới)
  if (primaryMuscle === 'lats' || primaryMuscle === 'upper_back' || primaryMuscle === 'lower_back') {
    if (id === 'deadlift') return 'back_deadlift';
    if (id === 'back_extension') return 'back_hyperextension';
    if (id === 'straight_arm_pulldown') return 'back_straight_arm';
    if (id === 'pull_up') return 'back_pull_up';
    if (id === 'lat_pulldown') return 'back_lat_pulldown';
    if (id === 'chin_up') return 'back_chin_up';
    if (id === 'close_grip_lat_pulldown') return 'back_close_lat_pulldown';
    if (id === 'barbell_row') return 'back_barbell_row';
    if (id === 'tbar_row') return 'back_tbar_row';
    if (id === 'dumbbell_row') return 'back_dumbbell_row';
    if (id === 'seated_cable_row') return 'back_seated_cable_row';
  }

  // 4. BICEPS (Tay trước & Cẳng tay)
  if (primaryMuscle === 'biceps' || primaryMuscle === 'forearms') {
    if (id === 'barbell_curl' || id === 'cable_bicep_curl') return 'biceps_regular_curl';
    if (id === 'dumbbell_hammer_curl') return 'biceps_hammer_curl';
    if (id === 'dumbbell_incline_curl') return 'biceps_incline_curl';
    if (id === 'ez_bar_preacher_curl') return 'biceps_preacher_curl';
  }

  // 5. TRICEPS (Tay sau)
  if (primaryMuscle === 'triceps') {
    if (id === 'tricep_rope_pushdown' || id === 'cable_straight_bar_pushdown') return 'triceps_pushdown';
    if (id === 'overhead_cable_tricep_extension' || id === 'dumbbell_seated_tricep_extension') return 'triceps_overhead';
    if (id === 'skull_crushers' || id === 'close_grip_bench_press' || id === 'dumbbell_tricep_kickback') return 'triceps_extension_press';
  }

  // 6. QUADS (Đùi trước)
  if (primaryMuscle === 'quads') {
    if (id === 'barbell_squat' || id === 'barbell_front_squat') return 'quads_heavy_squat';
    if (id === 'leg_press') return 'quads_leg_press';
    if (id === 'bulgarian_split_squat' || id === 'goblet_squat') return 'quads_unilateral_squat';
    if (id === 'leg_extension') return 'quads_isolation';
  }

  // 7. HAMSTRINGS (Đùi sau)
  if (primaryMuscle === 'hamstrings') {
    if (id === 'romanian_deadlift' || id === 'dumbbell_rdl') return 'hamstrings_rdl';
    if (id === 'lying_leg_curl' || id === 'seated_leg_curl') return 'hamstrings_curl';
  }

  // 8. GLUTES (Mông)
  if (primaryMuscle === 'glutes') {
    if (id === 'barbell_hip_thrust') return 'glutes_thrust';
    if (id === 'cable_glute_kickback') return 'glutes_kickback';
  }

  // 9. CALVES (Bắp chân)
  if (primaryMuscle === 'calves') {
    if (id === 'standing_calf_raise') return 'calves_standing';
    if (id === 'seated_calf_raise') return 'calves_seated';
  }

  // 10. ABS / CORE (Cơ bụng)
  if (primaryMuscle === 'abs') {
    if (id === 'cable_crunch' || id === 'hanging_leg_raise') return 'abs_flexion';
    if (id === 'plank') return 'abs_isometric';
    if (id === 'cable_woodchopper') return 'abs_rotational';
  }

  return `${primaryMuscle}_${ex.movementPattern}_${id}`;
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
  // KẾT HỢP ANGLE DIVERSITY: Không để sinh ra 2 bài cùng 1 góc đẩy phẳng hoặc cùng dạng chuyển động trong 1 buổi tập
  const count = Math.min(eligible.length, Math.max(4, Math.floor(durationMinutes / 10)));
  const selected: ExerciseItem[] = [];
  const selectedIds = new Set<string>();
  const selectedAngleKeys = new Set<string>();

  const numMuscles = candidateMuscles.length;
  const basePerMuscle = Math.max(1, Math.floor(count / numMuscles));

  // Vòng 1: Lấy tối thiểu basePerMuscle bài cho MỌI nhóm cơ đã chọn (ưu tiên góc chuyển động đa dạng chưa xuất hiện)
  candidateMuscles.forEach(m => {
    let taken = 0;
    // 1a. Thử chọn bài chưa trùng ID VÀ chưa trùng góc tác động
    for (const ex of byMuscle[m]) {
      if (taken >= basePerMuscle) break;
      const angleKey = getExerciseAngleDiversityKey(ex);
      if (!selectedIds.has(ex.id) && !selectedAngleKeys.has(angleKey)) {
        selected.push(ex);
        selectedIds.add(ex.id);
        selectedAngleKeys.add(angleKey);
        taken++;
      }
    }
    // 1b. Fallback nếu nhóm cơ ít bài và chưa lấy đủ basePerMuscle
    if (taken < basePerMuscle) {
      for (const ex of byMuscle[m]) {
        if (taken >= basePerMuscle) break;
        if (!selectedIds.has(ex.id)) {
          selected.push(ex);
          selectedIds.add(ex.id);
          selectedAngleKeys.add(getExerciseAngleDiversityKey(ex));
          taken++;
        }
      }
    }
  });

  // Vòng 2: Phân bổ các slot còn lại theo vòng tròn cho các nhóm cơ (Ưu tiên bài chưa trùng góc)
  for (const m of candidateMuscles) {
    if (selected.length >= count) break;
    for (const ex of byMuscle[m]) {
      const angleKey = getExerciseAngleDiversityKey(ex);
      if (!selectedIds.has(ex.id) && !selectedAngleKeys.has(angleKey)) {
        selected.push(ex);
        selectedIds.add(ex.id);
        selectedAngleKeys.add(angleKey);
        break;
      }
    }
  }

  // Vòng 3: Nếu vẫn còn thiếu slot (do các bài còn lại bị trùng góc), cho phép lấy thêm bài tốt nhất
  if (selected.length < count) {
    for (const m of candidateMuscles) {
      if (selected.length >= count) break;
      for (const ex of byMuscle[m]) {
        if (selected.length >= count) break;
        if (!selectedIds.has(ex.id)) {
          selected.push(ex);
          selectedIds.add(ex.id);
          selectedAngleKeys.add(getExerciseAngleDiversityKey(ex));
        }
      }
    }
  }

  // Vòng 4: Fallback cuối cùng từ danh sách eligible chung nếu vẫn thiếu slot
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

  // 5. Sắp xếp sơ bộ các bài tập được chọn
  selected.sort((a, b) => getExerciseTierOrder(a) - getExerciseTierOrder(b));

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
    if (includeWarmup && (ex.tier === 1 || getExerciseTierOrder(ex) === 1)) {
      const w1 = roundGymWeight(targetWeight * 0.5, ex.equipment, ex.id);
      sets.push({
        setIndex: currentSetIndex++,
        type: 'warmup',
        targetWeight: w1,
        targetReps: 10,
        isCompleted: false
      });

      const threshold = ex.equipment === 'barbell' ? 45 : (ex.equipment === 'dumbbell' ? 16 : 25);
      if (targetWeight > threshold) {
        const w2 = roundGymWeight(targetWeight * 0.7, ex.equipment, ex.id);
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
      const w1 = roundGymWeight(targetWeight * 0.5, ex.equipment, ex.id);
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

  // 8. BẮT BUỘC sắp xếp (sort) danh sách plannedExercises theo chuẩn NSCA / Fitbod Standard:
  // - Tier 1 (Compound nặng: Bench Press, Leg Press, Barbell Row...): Đầu buổi khi hệ thần kinh và cơ bắp sung sức nhất.
  // - Tier 2 (Secondary Compound / Máy khối / Tạ đôi: Incline DB, Lat Pulldown, Seated Cable Row...): Giữa buổi.
  // - Tier 3 (Isolation cơ nhỏ: Bay vai ngang, Cuốn bắp tay, Duỗi tay sau, Nhón bắp chân...): Nửa sau buổi tập.
  // - Tier 4 (Core & Cardio: Plank, Gập bụng, Máy chạy/xe đạp): Luôn nằm ở cuối cùng của buổi tập.
  plannedExercises.sort((a, b) => {
    const tierA = getExerciseTierOrder(a);
    const tierB = getExerciseTierOrder(b);
    if (tierA !== tierB) return tierA - tierB;

    // Trong cùng Tier 1: Ưu tiên Barbell compound trước các máy
    if (tierA === 1) {
      if (a.equipment === 'barbell' && b.equipment !== 'barbell') return -1;
      if (b.equipment === 'barbell' && a.equipment !== 'barbell') return 1;
    }

    // Trong cùng Tier 4: Core (Tier 4.0) trước Cardio (Tier 4.5)
    if (tierA >= 4 && tierB >= 4) {
      if (a.isCardio && !b.isCardio) return 1;
      if (!a.isCardio && b.isCardio) return -1;
    }

    return 0;
  });

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
 * Bảng ánh xạ từ điển tên bài tập tiếng Anh trong file Fitbod WorkoutExport.csv
 * sang ID bài tập chuẩn trong Catalog của hệ thống
 */
export const FITBOD_EXERCISE_ALIAS_MAP: Record<string, string> = {
  // Ngực (Chest)
  'bench press': 'barbell_bench_press',
  'barbell bench press': 'barbell_bench_press',
  'flat bench press': 'barbell_bench_press',
  'flat barbell bench press': 'barbell_bench_press',
  'incline bench press': 'incline_barbell_bench_press',
  'incline barbell bench press': 'incline_barbell_bench_press',
  'incline dumbbell press': 'incline_dumbbell_press',
  'incline dumbbell bench press': 'incline_dumbbell_press',
  'dumbbell bench press': 'dumbbell_bench_press',
  'flat dumbbell bench press': 'dumbbell_bench_press',
  'decline dumbbell press': 'decline_dumbbell_press',
  'decline dumbbell bench press': 'decline_dumbbell_press',
  'cable crossover': 'cable_chest_fly',
  'cable fly': 'cable_chest_fly',
  'cable chest fly': 'cable_chest_fly',
  'incline cable fly': 'incline_cable_fly',
  'low to high cable fly': 'incline_cable_fly',
  'decline cable fly': 'decline_cable_fly',
  'high to low cable fly': 'decline_cable_fly',
  'pec deck': 'pec_deck_machine',
  'pec deck fly': 'pec_deck_machine',
  'pec deck machine fly': 'pec_deck_machine',
  'pec deck machine': 'pec_deck_machine',
  'chest press': 'chest_press_machine',
  'chest press machine': 'chest_press_machine',
  'machine chest press': 'chest_press_machine',
  'incline chest press machine': 'incline_chest_press_machine',
  'incline machine chest press': 'incline_chest_press_machine',
  'dips': 'chest_dip',
  'chest dip': 'chest_dip',
  'chest dips': 'chest_dip',
  'push up': 'push_up',
  'pushup': 'push_up',
  'push-up': 'push_up',
  'standard push up': 'push_up',

  // Lưng xô (Back)
  'deadlift': 'deadlift',
  'barbell deadlift': 'deadlift',
  'conventional deadlift': 'deadlift',
  'barbell conventional deadlift': 'deadlift',
  'barbell row': 'barbell_row',
  'barbell bent over row': 'barbell_row',
  'barbell bent-over row': 'barbell_row',
  'bent over row': 'barbell_row',
  'bent-over row': 'barbell_row',
  'dumbbell row': 'dumbbell_row',
  'single arm dumbbell row': 'dumbbell_row',
  'single-arm dumbbell row': 'dumbbell_row',
  'one arm dumbbell row': 'dumbbell_row',
  'lat pulldown': 'lat_pulldown',
  'cable lat pulldown': 'lat_pulldown',
  'cable front lat pulldown': 'lat_pulldown',
  'front lat pulldown': 'lat_pulldown',
  'close grip lat pulldown': 'close_grip_lat_pulldown',
  'close-grip lat pulldown': 'close_grip_lat_pulldown',
  'seated cable row': 'seated_cable_row',
  'seated row': 'seated_cable_row',
  'cable row': 'seated_cable_row',
  'straight arm pulldown': 'straight_arm_pulldown',
  'straight-arm pulldown': 'straight_arm_pulldown',
  'straight arm cable pulldown': 'straight_arm_pulldown',
  't-bar row': 'tbar_row',
  'tbar row': 'tbar_row',
  'chest-supported t-bar row': 'tbar_row',
  'pull up': 'pull_up',
  'pull-up': 'pull_up',
  'pullup': 'pull_up',
  'chin up': 'chin_up',
  'chin-up': 'chin_up',
  'chinup': 'chin_up',
  'back extension': 'back_extension',
  'hyperextension': 'back_extension',
  'hyperextensions': 'back_extension',

  // Vai & Cầu vai (Shoulders & Traps)
  'overhead press': 'overhead_press',
  'barbell overhead press': 'overhead_press',
  'military press': 'overhead_press',
  'standing overhead press': 'overhead_press',
  'dumbbell shoulder press': 'dumbbell_shoulder_press',
  'seated dumbbell shoulder press': 'dumbbell_shoulder_press',
  'arnold press': 'arnold_press',
  'arnold dumbbell press': 'arnold_press',
  'lateral raise': 'dumbbell_lateral_raise',
  'dumbbell lateral raise': 'dumbbell_lateral_raise',
  'side lateral raise': 'dumbbell_lateral_raise',
  'side raise': 'dumbbell_lateral_raise',
  'cable lateral raise': 'cable_lateral_raise',
  'face pull': 'face_pull',
  'cable face pull': 'face_pull',
  'rear delt fly': 'dumbbell_rear_delt_fly',
  'dumbbell rear delt fly': 'dumbbell_rear_delt_fly',
  'reverse fly': 'dumbbell_rear_delt_fly',
  'reverse pec deck': 'reverse_pec_deck',
  'reverse fly machine': 'reverse_pec_deck',
  'shrug': 'barbell_shrug',
  'barbell shrug': 'barbell_shrug',
  'dumbbell shrug': 'barbell_shrug',

  // Tay trước (Biceps)
  'bicep curl': 'barbell_curl',
  'barbell curl': 'barbell_curl',
  'barbell bicep curl': 'barbell_curl',
  'incline dumbbell curl': 'dumbbell_incline_curl',
  'incline dumbbell bicep curl': 'dumbbell_incline_curl',
  'incline bicep curl': 'dumbbell_incline_curl',
  'hammer curl': 'dumbbell_hammer_curl',
  'dumbbell hammer curl': 'dumbbell_hammer_curl',
  'preacher curl': 'ez_bar_preacher_curl',
  'ez-bar preacher curl': 'ez_bar_preacher_curl',
  'ez bar preacher curl': 'ez_bar_preacher_curl',
  'cable curl': 'cable_bicep_curl',
  'cable bicep curl': 'cable_bicep_curl',
  'standing cable bicep curl': 'cable_bicep_curl',

  // Tay sau (Triceps)
  'tricep pushdown': 'tricep_rope_pushdown',
  'triceps pushdown': 'tricep_rope_pushdown',
  'cable pushdown': 'tricep_rope_pushdown',
  'cable tricep pushdown': 'tricep_rope_pushdown',
  'cable tricep rope pushdown': 'tricep_rope_pushdown',
  'rope pushdown': 'tricep_rope_pushdown',
  'cable straight bar pushdown': 'cable_straight_bar_pushdown',
  'cable straight-bar tricep pushdown': 'cable_straight_bar_pushdown',
  'straight bar pushdown': 'cable_straight_bar_pushdown',
  'overhead cable tricep extension': 'overhead_cable_tricep_extension',
  'cable overhead tricep extension': 'overhead_cable_tricep_extension',
  'skull crusher': 'skull_crushers',
  'skull crushers': 'skull_crushers',
  'skullcrusher': 'skull_crushers',
  'barbell skull crushers': 'skull_crushers',
  'lying triceps extension': 'skull_crushers',
  'close grip bench press': 'close_grip_bench_press',
  'close-grip bench press': 'close_grip_bench_press',
  'close-grip barbell bench press': 'close_grip_bench_press',
  'dumbbell overhead tricep extension': 'dumbbell_seated_tricep_extension',
  'seated dumbbell overhead tricep extension': 'dumbbell_seated_tricep_extension',
  'tricep kickback': 'dumbbell_tricep_kickback',
  'dumbbell tricep kickback': 'dumbbell_tricep_kickback',

  // Chân & Mông (Legs & Glutes)
  'squat': 'barbell_squat',
  'back squat': 'barbell_squat',
  'barbell squat': 'barbell_squat',
  'barbell back squat': 'barbell_squat',
  'front squat': 'barbell_front_squat',
  'barbell front squat': 'barbell_front_squat',
  'leg press': 'leg_press',
  'leg press 45': 'leg_press',
  'leg press 45°': 'leg_press',
  'leg extension': 'leg_extension',
  'leg extension machine': 'leg_extension',
  'bulgarian split squat': 'bulgarian_split_squat',
  'dumbbell bulgarian split squat': 'bulgarian_split_squat',
  'goblet squat': 'goblet_squat',
  'dumbbell goblet squat': 'goblet_squat',
  'romanian deadlift': 'romanian_deadlift',
  'barbell romanian deadlift': 'romanian_deadlift',
  'rdl': 'romanian_deadlift',
  'barbell rdl': 'romanian_deadlift',
  'dumbbell romanian deadlift': 'dumbbell_rdl',
  'dumbbell rdl': 'dumbbell_rdl',
  'leg curl': 'lying_leg_curl',
  'lying leg curl': 'lying_leg_curl',
  'lying leg curl machine': 'lying_leg_curl',
  'seated leg curl': 'seated_leg_curl',
  'seated leg curl machine': 'seated_leg_curl',
  'hip thrust': 'barbell_hip_thrust',
  'barbell hip thrust': 'barbell_hip_thrust',
  'glute kickback': 'cable_glute_kickback',
  'cable glute kickback': 'cable_glute_kickback',
  'calf raise': 'standing_calf_raise',
  'standing calf raise': 'standing_calf_raise',
  'seated calf raise': 'seated_calf_raise',

  // Cơ bụng & Cardio (Abs & Cardio)
  'woodchopper': 'cable_woodchopper',
  'cable woodchopper': 'cable_woodchopper',
  'cable crunch': 'cable_crunch',
  'kneeling cable crunch': 'cable_crunch',
  'hanging leg raise': 'hanging_leg_raise',
  'plank': 'plank',
  'standard plank': 'plank',
  'stationary bike': 'cardio_bike',
  'bike': 'cardio_bike',
  'treadmill': 'cardio_treadmill',
  'incline treadmill walk': 'cardio_treadmill',
  'elliptical': 'cardio_elliptical',
  'elliptical trainer': 'cardio_elliptical'
};

/**
 * Ánh xạ tên bài tập từ Fitbod CSV sang Exercise Catalog
 */
export function mapFitbodExerciseToCatalog(rawName: string): { id: string; name: string } {
  if (!rawName) return { id: 'unknown', name: 'Unknown Exercise' };

  const clean = rawName
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

  // 1. Đối soát từ điển Alias
  if (FITBOD_EXERCISE_ALIAS_MAP[clean]) {
    const matchedId = FITBOD_EXERCISE_ALIAS_MAP[clean];
    const cat = EXERCISE_CATALOG.find(c => c.id === matchedId);
    if (cat) return { id: cat.id, name: cat.name };
  }

  // 2. Đối soát trực tiếp ID hoặc tên tiếng Anh trong Catalog
  const directCat = EXERCISE_CATALOG.find(c => {
    if (c.id === clean.replace(/\s+/g, '_')) return true;
    const catClean = c.name.replace(/\(.*?\)/g, '').replace(/[^a-zA-Z0-9\s]/g, ' ').toLowerCase().trim().replace(/\s+/g, ' ');
    return catClean === clean;
  });
  if (directCat) return { id: directCat.id, name: directCat.name };

  // 3. Đối soát gần đúng (token inclusion)
  const partialCat = EXERCISE_CATALOG.find(c => {
    const catClean = c.name.replace(/\(.*?\)/g, '').replace(/[^a-zA-Z0-9\s]/g, ' ').toLowerCase().trim().replace(/\s+/g, ' ');
    return catClean.includes(clean) || clean.includes(catClean);
  });
  if (partialCat) return { id: partialCat.id, name: partialCat.name };

  // 4. Nếu là bài tập riêng ngoài catalog
  return {
    id: 'custom_' + clean.replace(/\s+/g, '_'),
    name: rawName.trim()
  };
}

/**
 * Tách dòng CSV có tính đến dấu nháy kép bọc chuỗi ("...")
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export interface FitbodCsvParseResult {
  totalWorkouts: number;
  totalSets: number;
  totalVolumeKg: number;
  totalPRs: number;
  records: Array<{
    exerciseId: string;
    exercise: string;
    originalCsvName: string;
    maxWeight: number;
    maxE1RM: number;
    bestReps: number;
    bestSet: string;
    lastDate: string;
    totalSessions: number;
    totalSets: number;
  }>;
  exerciseHistory: Record<string, ExerciseHistoryRecord>;
}

/**
 * Trình phân tích chuỗi CSV Fitbod WorkoutExport.csv trực tiếp trên trình duyệt
 * - Phân tích chính xác tên bài tập tiếng Anh sang Catalog bài tập hệ thống
 * - Lưu lại chỉ số kỷ lục PR (Max Weight, 1RM, Best Reps)
 * - Tự động tạo ExerciseHistory cho toàn bộ bài tập
 */
export function parseFitbodCsvText(csvText: string): FitbodCsvParseResult {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    return {
      totalWorkouts: 0,
      totalSets: 0,
      totalVolumeKg: 0,
      totalPRs: 0,
      records: [],
      exerciseHistory: {}
    };
  }

  const headers = parseCsvLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
  const weightColIndex = headers.findIndex(h => h.toLowerCase().includes('weight'));
  const repsColIndex = headers.findIndex(h => h.toLowerCase().includes('reps'));
  const exerciseColIndex = headers.findIndex(h => h.toLowerCase().includes('exercise'));
  const dateColIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
  const multiplierColIndex = headers.findIndex(h => h.toLowerCase().includes('multiplier'));
  const warmupColIndex = headers.findIndex(h => h.toLowerCase().includes('warmup'));

  // Kiểm tra đơn vị là lbs hay kg
  const isLbs = weightColIndex !== -1 && headers[weightColIndex].toLowerCase().includes('lbs');

  const workouts = new Set<string>();
  const recordMap: Record<string, {
    exerciseId: string;
    exercise: string;
    originalCsvName: string;
    maxWeight: number;
    maxE1RM: number;
    bestReps: number;
    bestSet: string;
    lastDate: string;
    uniqueDates: Set<string>;
    totalSets: number;
  }> = {};

  let totalSets = 0;
  let totalVolumeKg = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]).map(c => c.replace(/^"|"$/g, ''));
    if (cols.length <= exerciseColIndex) continue;

    const dateStr = cols[dateColIndex] || '';
    const rawExerciseName = cols[exerciseColIndex] || '';
    if (!rawExerciseName || !dateStr) continue;

    const dateKey = dateStr.substring(0, 10);
    workouts.add(dateKey);
    totalSets++;

    const reps = parseInt(cols[repsColIndex] || '0', 10) || 0;
    const rawWeight = parseFloat(cols[weightColIndex] || '0') || 0;
    const multiplier = parseFloat(cols[multiplierColIndex] || '1.0') || 1.0;
    const isWarmup = (cols[warmupColIndex] || '').toLowerCase() === 'true';

    // Đổi lbs sang kg nếu cần
    let kgWeight = isLbs ? rawWeight * 0.45359237 : rawWeight;
    kgWeight = Math.round(kgWeight * 10) / 10;

    // Ánh xạ sang catalog bài tập
    const mapped = mapFitbodExerciseToCatalog(rawExerciseName);
    const key = mapped.id;

    if (!recordMap[key]) {
      recordMap[key] = {
        exerciseId: mapped.id,
        exercise: mapped.name,
        originalCsvName: rawExerciseName,
        maxWeight: 0,
        maxE1RM: 0,
        bestReps: 0,
        bestSet: '',
        lastDate: dateKey,
        uniqueDates: new Set<string>(),
        totalSets: 0
      };
    }

    recordMap[key].uniqueDates.add(dateKey);
    recordMap[key].totalSets++;
    if (dateKey > recordMap[key].lastDate) {
      recordMap[key].lastDate = dateKey;
    }

    if (!isWarmup && reps > 0 && kgWeight > 0) {
      const effectiveTonnageWeight = kgWeight * multiplier;
      totalVolumeKg += effectiveTonnageWeight * reps;

      const e1rm = calculateE1RM(kgWeight, reps);

      if (e1rm > recordMap[key].maxE1RM) {
        recordMap[key].maxE1RM = e1rm;
        recordMap[key].bestReps = reps;
        recordMap[key].maxWeight = Math.max(recordMap[key].maxWeight, kgWeight);
        recordMap[key].bestSet = `${reps} reps @ ${kgWeight}kg`;
      } else if (kgWeight > recordMap[key].maxWeight) {
        recordMap[key].maxWeight = kgWeight;
      }
    }
  }

  // Chuyển recordMap sang danh sách PRs và ExerciseHistory
  const exerciseHistory: Record<string, ExerciseHistoryRecord> = {};
  const records: FitbodCsvParseResult['records'] = [];

  Object.values(recordMap).forEach(r => {
    if (r.maxE1RM > 0 || r.maxWeight > 0) {
      records.push({
        exerciseId: r.exerciseId,
        exercise: r.exercise,
        originalCsvName: r.originalCsvName,
        maxWeight: r.maxWeight,
        maxE1RM: r.maxE1RM,
        bestReps: r.bestReps,
        bestSet: r.bestSet || `${r.bestReps} reps @ ${r.maxWeight}kg`,
        lastDate: r.lastDate,
        totalSessions: r.uniqueDates.size,
        totalSets: r.totalSets
      });

      exerciseHistory[r.exerciseId] = {
        exerciseId: r.exerciseId,
        totalSessions: r.uniqueDates.size,
        lastSessionDate: r.lastDate,
        sessionsSinceLastMaxEffort: 3,
        bestWeight: r.maxWeight,
        bestReps: r.bestReps,
        e1RM: r.maxE1RM
      };
    }
  });

  records.sort((a, b) => b.maxE1RM - a.maxE1RM);

  return {
    totalWorkouts: workouts.size,
    totalSets,
    totalVolumeKg: Math.round(totalVolumeKg),
    totalPRs: records.length,
    records,
    exerciseHistory
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

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
import { getExercisePreferences, ExercisePreferenceStatus } from '../utils/exercisePreferences';

/**
 * Hàm làm tròn mức tạ theo bước tạ gym thực tế chuẩn quốc tế:
 * - Tạ đòn (Barbell): bước 2.5kg, min 20kg (Olympic Bar tiêu chuẩn)
 * - Tạ đơn (Dumbbell): bước 2kg (mỗi bên tay), min 4kg (4, 6, 8, 10, 12, 14, 16, 18, 20...) - Tuyệt đối không sinh số lẻ kì quặc
 * - Máy cáp (Cable): bước 2.5kg, min 5kg
 * - Máy khối (Machine): bước 5kg, min 10kg (riêng Leg Press đạp đùi làm tròn bước 10kg, min 40kg)
 * - Bodyweight: 0kg
 */
/**
 * Danh sách thỏi tạ máy cắm chốt (Weight Stack) chuẩn phòng gym quốc tế & Việt Nam:
 * Phần lớn máy khối & tháp cáp (Life Fitness, Matrix, Cybex, Hammer, Precor, The New Gym, Cali...)
 * sử dụng thỏi tạ tính theo LBS (hoặc in song ngữ LBS/KG).
 * Bảng quy đổi chuẩn: 1 lb = 0.45359237 kg
 */
export const GYM_STACK_PLATES: { lbs: number; kg: number }[] = [
  { lbs: 10, kg: 4.5 },
  { lbs: 12.5, kg: 5.7 },
  { lbs: 15, kg: 6.8 },
  { lbs: 20, kg: 9.1 },
  { lbs: 25, kg: 11.3 },
  { lbs: 30, kg: 13.6 },
  { lbs: 35, kg: 15.9 },
  { lbs: 40, kg: 18.1 },
  { lbs: 45, kg: 20.4 },
  { lbs: 50, kg: 22.7 },
  { lbs: 60, kg: 27.2 },
  { lbs: 70, kg: 31.8 },
  { lbs: 80, kg: 36.3 },
  { lbs: 90, kg: 40.8 },
  { lbs: 100, kg: 45.4 },
  { lbs: 110, kg: 49.9 },
  { lbs: 120, kg: 54.4 },
  { lbs: 130, kg: 59.0 },
  { lbs: 140, kg: 63.5 },
  { lbs: 150, kg: 68.0 },
  { lbs: 160, kg: 72.6 },
  { lbs: 170, kg: 77.1 },
  { lbs: 180, kg: 81.6 },
  { lbs: 190, kg: 86.2 },
  { lbs: 200, kg: 90.7 },
  { lbs: 220, kg: 99.8 },
  { lbs: 250, kg: 113.4 }
];

export function findNearestGymStackWeight(rawKg: number): { lbs: number; kg: number } {
  let closest = GYM_STACK_PLATES[0];
  let minDiff = Math.abs(rawKg - closest.kg);
  for (const plate of GYM_STACK_PLATES) {
    const diff = Math.abs(rawKg - plate.kg);
    if (diff < minDiff) {
      minDiff = diff;
      closest = plate;
    }
  }
  return closest;
}

export function getLbsFromKg(kg: number): number {
  if (kg <= 0) return 0;
  const plate = GYM_STACK_PLATES.find(p => Math.abs(p.kg - kg) < 0.35);
  if (plate) return plate.lbs;
  return Math.round(kg / 0.45359237);
}

export function formatWeightWithLbs(kg: number, equipment: EquipmentType, exercise?: any): string {
  if (kg <= 0) return 'Bodyweight';
  if (exercise && (isPlateLoadedExercise(exercise) || isSmithMachineExercise(exercise))) {
    return `${kg} kg`;
  }
  if (equipment === 'cable' || (equipment === 'machine' && (!exercise || isCableOrPinStackExercise(exercise)))) {
    const lbs = getLbsFromKg(kg);
    return `${kg} kg (${lbs} lbs)`;
  }
  return `${kg} kg`;
}

export function stepGymStackWeight(currentKg: number, direction: 1 | -1): number {
  const currentAbs = Math.abs(currentKg);
  const idx = GYM_STACK_PLATES.findIndex(p => Math.abs(p.kg - currentAbs) < 0.35);
  if (idx === -1) {
    const nearest = findNearestGymStackWeight(currentAbs);
    const nIdx = GYM_STACK_PLATES.indexOf(nearest);
    const nextIdx = Math.max(0, Math.min(GYM_STACK_PLATES.length - 1, nIdx + direction));
    return currentKg < 0 ? -GYM_STACK_PLATES[nextIdx].kg : GYM_STACK_PLATES[nextIdx].kg;
  }
  const nextIdx = Math.max(0, Math.min(GYM_STACK_PLATES.length - 1, idx + direction));
  return currentKg < 0 ? -GYM_STACK_PLATES[nextIdx].kg : GYM_STACK_PLATES[nextIdx].kg;
}

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
    // Tạ đơn mỗi bên: bước 2kg, tối thiểu 4kg (4kg, 6kg, 8kg, 10kg, 12kg...)
    return Math.max(4, Math.round(rawWeight / 2) * 2);
  }

  if (equipment === 'cable') {
    // Máy cáp: Bắt theo nấc thỏi tạ cắm chốt (lbs quy đổi kg chuẩn thực tế)
    return findNearestGymStackWeight(rawWeight).kg;
  }

  if (equipment === 'machine') {
    if (isSmithMachineExercise(exerciseId)) {
      // Máy Smith: Đòn chuẩn 15kg/20kg, lắp bánh tạ đĩa kg tròn chuẩn gym (bước 2.5kg, min 15kg)
      return Math.max(15, Math.round(rawWeight / 2.5) * 2.5);
    }
    if (exerciseId && exerciseId.includes('leg_press')) {
      // Đạp đùi Leg Press: bước 10kg, min 40kg
      return Math.max(40, Math.round(rawWeight / 10) * 10);
    }
    if (exerciseId && (exerciseId.includes('hack_squat') || exerciseId.includes('hammer'))) {
      // Hack Squat / Hammer Strength plate-loaded: bước 5kg, min 25kg
      return Math.max(25, Math.round(rawWeight / 5) * 5);
    }
    // Máy khối ròng rọc cắm chốt (Lat Pulldown, Pec Deck, Leg Extension, Máy trợ lực...):
    // Tự động căn chỉnh theo cọc tạ chuẩn phòng gym (lbs -> kg)
    return findNearestGymStackWeight(rawWeight).kg;
  }

  return Math.max(2.5, Math.round(rawWeight / 2.5) * 2.5);
}

/**
 * Nhận diện bài tập có trợ lực (Assisted Bodyweight Exercises):
 * Ví dụ: Assisted Chin Up, Assisted Pull Up, Assisted Dip...
 * Máy trợ lực hoạt động theo cơ chế đối trọng, làm giảm trọng lượng cơ thể người tập.
 * Do đó, mức tạ thực tế luôn được biểu diễn dưới dạng SỐ ÂM (-kg).
 */
export function isAssistedExercise(
  exercise: { id?: string; exerciseId?: string; name?: string; exerciseName?: string } | string | undefined | null
): boolean {
  if (!exercise) return false;
  const str = typeof exercise === 'string' 
    ? exercise 
    : `${exercise.id || (exercise as any).exerciseId || ''} ${exercise.name || (exercise as any).exerciseName || ''}`;
  return str.toLowerCase().includes('assisted');
}

/**
 * Nhận diện bài tập dùng Máy Smith (Smith Machine):
 * Máy Smith có thanh đòn trượt trên 2 ray cố định, người tập lắp BÁNH TẠ ĐĨA TRÒN (KG).
 * Hoàn toàn KHÔNG DÙNG cọc tạ lá hay ròng rọc cắm chốt (lbs).
 */
export function isSmithMachineExercise(
  exercise: { id?: string; exerciseId?: string; name?: string; exerciseName?: string } | string | undefined | null
): boolean {
  if (!exercise) return false;
  const str = typeof exercise === 'string' 
    ? exercise 
    : `${exercise.id || (exercise as any).exerciseId || ''} ${exercise.name || (exercise as any).exerciseName || ''}`;
  return str.toLowerCase().includes('smith');
}

/**
 * Nhận diện bài tập lắp bánh tạ đĩa rời (Plate-Loaded: Barbell, Smith Machine, Leg Press, Hack Squat, Hammer Strength):
 * Toàn bộ các bài này dùng BÁNH TẠ ĐĨA KG BÌNH THƯỜNG (20kg, 15kg, 10kg, 5kg, 2.5kg, 1.25kg).
 * Tuyệt đối KHÔNG tính lbs, KHÔNG hiện cọc tạ lá, mà hiển thị công cụ tính bánh tạ đĩa (Plate Calculator).
 */
export function isPlateLoadedExercise(
  exercise: { id?: string; exerciseId?: string; name?: string; exerciseName?: string; equipment?: EquipmentType } | string | undefined | null
): boolean {
  if (!exercise) return false;
  if (typeof exercise === 'string') {
    const s = exercise.toLowerCase();
    return s.includes('smith') || s.includes('leg_press') || s.includes('hack_squat') || s.includes('hammer') || s.includes('t_bar_row') || s.includes('barbell');
  }
  const id = (exercise.id || (exercise as any).exerciseId || '').toLowerCase();
  const name = (exercise.name || (exercise as any).exerciseName || '').toLowerCase();
  const eq = exercise.equipment;
  if (eq === 'barbell') return true;
  return id.includes('smith') || name.includes('smith') || 
         id.includes('leg_press') || name.includes('leg press') ||
         id.includes('hack_squat') || name.includes('hack squat') ||
         id.includes('hammer') || name.includes('hammer') ||
         id.includes('t_bar_row') || name.includes('t-bar row');
}

/**
 * Nhận diện bài tập dính tới RÒNG RỌC hoặc CABLE (cọc tạ lá cắm chốt ghi lbs):
 * - CHỈ ÁP DỤNG CHO: equipment === 'cable' HOẶC các máy khối selectorized ròng rọc pin-stack (Pec Deck, Lat Pulldown, Leg Extension, Trợ lực...)
 * - TUYỆT ĐỐI LOẠI TRỪ: Máy Smith, Leg Press, Hack Squat, Barbell, Dumbbell, Kettlebell, Bodyweight.
 */
export function isCableOrPinStackExercise(
  exercise: { id?: string; exerciseId?: string; name?: string; exerciseName?: string; equipment?: EquipmentType } | string | undefined | null
): boolean {
  if (!exercise) return false;
  if (isPlateLoadedExercise(exercise)) return false;

  if (typeof exercise === 'string') {
    const s = exercise.toLowerCase();
    if (s.includes('smith') || s.includes('leg_press') || s.includes('hack_squat') || s.includes('barbell')) return false;
    return s.includes('cable') || s.includes('pulldown') || s.includes('pushdown') || s.includes('pec_deck') || s.includes('machine');
  }

  const eq = exercise.equipment;
  if (eq === 'barbell' || eq === 'dumbbell' || eq === 'kettlebell' || eq === 'bodyweight') return false;
  if (eq === 'cable') return true;
  if (eq === 'machine') {
    return true; // đã loại trừ Smith Machine, Leg Press, Hack Squat ở isPlateLoadedExercise
  }
  return false;
}

/**
 * Định dạng mức tạ hiển thị chuẩn cho mọi bài tập:
 * - Nếu là bài bodyweight thường (0kg): "Bodyweight"
 * - Nếu là bài Assisted: "-{weight} kg" (ví dụ: "-40 kg", "-60 kg")
 * - Nếu là bài tạ thường: "{weight} kg"
 */
export function formatExerciseWeight(
  weightKg: number,
  exercise?: { id?: string; exerciseId?: string; name?: string; exerciseName?: string } | string,
  showUnit: boolean = true
): string {
  const isAssisted = isAssistedExercise(exercise);
  if (isAssisted) {
    if (weightKg === 0) return showUnit ? '0 kg (Bodyweight)' : '0';
    const val = Math.abs(weightKg);
    return showUnit ? `-${val} kg` : `-${val}`;
  }
  if (weightKg === 0) return 'Bodyweight';
  return showUnit ? `${weightKg} kg` : `${weightKg}`;
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

  // BÀI TẬP TRỢ LỰC (Assisted Chin Up, Assisted Pull Up, Assisted Dip...):
  // Mức tạ là ĐỐI TRỌNG TRỢ LỰC (-kg).
  // Người mới: Cơ lưng/tay chưa đủ kéo, cần trợ lực nhiều (~60-70% BW)
  // Nâng cao: Kéo tốt, cần trợ lực vừa (~30-40% BW)
  // Chuyên nghiệp: Rất khỏe, trợ lực ít (~10-20% BW)
  // Đốt calo (16 reps): Cần tăng trợ lực (+15% BW) để duy trì tốc độ kéo
  // Sức mạnh (5 reps): Giảm trợ lực (-10% BW) để cơ thể tự nâng nặng
  if (isAssistedExercise(exercise)) {
    let assistRatio = level === 'beginner' ? 0.65 : level === 'advanced' ? 0.35 : 0.15;
    if (isFemale) assistRatio += 0.15;
    
    if (goal === 'calorie_burn') assistRatio += 0.15;
    else if (goal === 'tone') assistRatio += 0.08;
    else if (goal === 'strength') assistRatio = Math.max(0, assistRatio - 0.10);

    const rawAssistance = effectiveBw * Math.min(0.85, Math.max(0, assistRatio));
    return roundGymWeight(rawAssistance, 'machine', exercise.id);
  }

  // Xác định nhóm cơ thân dưới (legs) để áp dụng hệ số giới tính chuẩn sinh lý
  const isLowerBody = exercise.primaryMuscles.some(pm => 
    ['quads', 'hamstrings', 'glutes', 'calves'].includes(pm.muscle)
  );

  // Hệ số giới tính: Nữ thân trên ~0.65, thân dưới ~0.80
  const genderRatio = isFemale ? (isLowerBody ? 0.80 : 0.65) : 1.0;

  // Hệ số mục tiêu (Goal): Strength ~1.00 (85% 1RM), Hypertrophy ~0.85 (70% 1RM), Tone ~0.70 (55% 1RM), Calorie Burn ~0.52 (50% 1RM - reps cao 14-18)
  const goalRatio = goal === 'strength' ? 1.0 : goal === 'hypertrophy' ? 0.85 : goal === 'tone' ? 0.70 : 0.52;

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
    if (isSmithMachineExercise(exercise)) {
      // Máy Smith: Đòn trượt lắp bánh tạ đĩa kg (chuẩn Olympic tương đương Barbell)
      let mult = 0.65;
      if (exercise.id.includes('squat')) mult = level === 'beginner' ? 0.65 : level === 'advanced' ? 1.15 : 1.60;
      else if (exercise.id.includes('bench') || exercise.id.includes('press')) mult = level === 'beginner' ? 0.50 : level === 'advanced' ? 0.85 : 1.25;
      else if (exercise.id.includes('overhead') || exercise.id.includes('shoulder')) mult = level === 'beginner' ? 0.30 : level === 'advanced' ? 0.55 : 0.80;
      else if (exercise.id.includes('shrug') || exercise.id.includes('row') || exercise.id.includes('upright')) mult = level === 'beginner' ? 0.45 : level === 'advanced' ? 0.75 : 1.10;
      else mult = level === 'beginner' ? 0.40 : level === 'advanced' ? 0.70 : 1.00;
      rawWeight = effectiveBw * mult * genderRatio * goalRatio;
      return roundGymWeight(rawWeight, 'machine', exercise.id);
    }

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

/**
 * Thuật toán Progressive Overload & Smart Weight Trajectory:
 * Dựa trên lịch sử tập luyện của bài tập đó từ exerciseHistory:
 * - Nếu buổi trước Sếp đã hoàn thành đủ số reps với mức tạ W: Buổi hôm nay TỰ ĐỘNG ĐÀ LÊN TẠ:
 *   + Tạ đòn: Tăng +2.5kg
 *   + Tạ đơn: Tăng +2kg (mỗi bên)
 *   + Máy/Cáp: Cáp tăng +2.5kg, Máy khối tăng +5kg (Leg Press đạp đùi tăng +10kg)
 *   + BÀI TRỢ LỰC (Assisted Chin Up/Dip): GIẢM mức tạ trợ lực đối trọng (-2.5kg) để cơ thể tự nâng nhiều hơn!
 * - Nếu buổi trước bị hụt rep: Giữ nguyên tạ hoặc giảm nhẹ 1 rep mục tiêu để tích lũy thể lực
 * - Nếu chưa có lịch sử: Tính mức tạ khởi điểm chuẩn hóa theo % Bodyweight & Trình độ
 */
/**
 * Chuẩn hóa bảng quy đổi Reps sang % 1RM theo Khoa học Thể hình Fitbod & NSCA
 */
export function getRepTargetPercentageOf1RM(reps: number, goal?: FitnessGoal): number {
  if (reps <= 1) return 1.00;
  if (reps === 2) return 0.95;
  if (reps === 3) return 0.925;
  if (reps === 4) return 0.89;
  if (reps === 5) return 0.86; // Strength (5 reps)
  if (reps === 6) return 0.835;
  if (reps === 7) return 0.81;
  if (reps === 8) return 0.785;
  if (reps === 9) return 0.76;
  if (reps === 10) return 0.74; // Hypertrophy (10 reps)
  if (reps === 11) return 0.715;
  if (reps === 12) return 0.69;
  if (reps === 13) return 0.665;
  if (reps === 14) return 0.64; // Tone (14 reps)
  if (reps === 15) return 0.61;
  if (reps === 16) return 0.58; // Calorie Burn / HIIT Circuit (16 reps)
  if (reps === 17) return 0.55;
  if (reps === 18) return 0.52;
  if (reps === 19) return 0.50;
  return 0.48; // >= 20 reps
}

/**
 * Thuật toán Progressive Overload & Smart Weight Trajectory chuẩn Fitbod:
 * 1. Khai thác e1RM (Estimated 1-Rep Max) từ lịch sử tập luyện thực tế của Sếp (CSV/Database).
 * 2. Khi mục tiêu thay đổi (Strength -> Hypertrophy -> Tone -> Calorie Burn):
 *    - Sức mạnh (Strength, 4-6 reps): Tạ nặng 82-88% 1RM
 *    - Tăng cơ (Hypertrophy, 8-12 reps): Tạ vừa-nặng 70-78% 1RM
 *    - Săn chắc (Tone, 12-15 reps): Tạ vừa 60-68% 1RM
 *    - Đốt Calo (Calorie Burn, 14-18 reps): Tự động GIẢM TẠ sâu về ~50-58% 1RM
 *      (để cơ bắp không bị đứt gãy năng lượng, duy trì nhịp tim hiếu khí liên tục trong circuit).
 * 3. Nếu buổi trước hoàn thành tốt: Tự động tăng +2.5% công suất 1RM lũy tiến (Progressive Overload).
 * 4. Với bài trợ lực (Assisted): Tăng reps trong Calorie Burn thì máy TỰ ĐỘNG TĂNG TRỢ LỰC (đối trọng lớn hơn)
 *    để giảm tải net lên cơ bắp, hỗ trợ đẩy đủ 16 reps tốc độ cao!
 */
export function calculateProgressiveOverloadWeight(
  exercise: ExerciseItem,
  history?: ExerciseHistoryRecord,
  profile?: UserBodyProfile,
  goal: FitnessGoal = 'hypertrophy',
  targetReps?: number
): { 
  targetWeight: number; 
  isProgressive: boolean; 
  targetRepsAdjustment: number;
  reasonVi: string;
} {
  if (!exercise) {
    return { targetWeight: 0, isProgressive: false, targetRepsAdjustment: 0, reasonVi: 'N/A' };
  }
  if (exercise.equipment === 'bodyweight') {
    return { targetWeight: 0, isProgressive: false, targetRepsAdjustment: 0, reasonVi: 'Bodyweight' };
  }

  const isAssisted = isAssistedExercise(exercise);
  const defaultWeight = calculateTailoredWeight(exercise, profile, goal);
  const goalDefaultReps = goal === 'strength' ? 5 : goal === 'hypertrophy' ? 10 : goal === 'tone' ? 14 : 16;
  const effectiveTargetReps = targetReps || goalDefaultReps;

  if (!history || history.lastWeight === undefined || (history.lastWeight === 0 && !isAssisted)) {
    return { 
      targetWeight: defaultWeight, 
      isProgressive: false, 
      targetRepsAdjustment: 0, 
      reasonVi: `Khởi điểm theo thể trạng (${goal === 'calorie_burn' ? 'Đốt calo 16 reps' : goal})` 
    };
  }

  // Xác định xem buổi trước đã hoàn thành đủ reps mục tiêu chưa
  const didCompleteAll = history.lastCompletedAllReps !== false &&
    (!history.lastTargetReps || (history.lastReps || 0) >= history.lastTargetReps);

  const bw = profile?.weightKg || 70;

  if (isAssisted) {
    // ==========================================
    // BÀI TRỢ LỰC (Assisted Chin Up, Pull Up, Dip)
    // Tải trọng thực cơ bắp nâng: NetLoad = Bodyweight - Counterweight
    // ==========================================
    const lastAssistance = Math.abs(history.lastWeight);
    const lastNetLoad = Math.max(10, bw - lastAssistance);
    const lastReps = history.lastReps || 8;
    
    // Ước tính 1RM thực lực nâng của cơ thể
    const netE1RM = calculateE1RM(lastNetLoad, lastReps);
    const effectiveNet1RM = netE1RM * (didCompleteAll ? 1.025 : 1.0);
    
    // %1RM cho số rep mục tiêu mới
    const targetPct = getRepTargetPercentageOf1RM(effectiveTargetReps, goal);
    const targetNetLoad = effectiveNet1RM * targetPct;
    
    // Đối trọng máy cần trợ lực: Assistance = Bodyweight - NetLoad
    const rawAssistance = Math.max(0, bw - targetNetLoad);
    const roundedAssistance = roundGymWeight(rawAssistance, exercise.equipment, exercise.id);

    let reasonVi = '';
    if (goal === 'calorie_burn') {
      reasonVi = `Fitbod 1RM: Chuyển sang Đốt calo (${effectiveTargetReps} reps) → Tăng trợ lực lên -${roundedAssistance}kg (giảm tải net) để duy trì tốc độ đốt mỡ`;
    } else if (roundedAssistance === 0) {
      reasonVi = `Xuất sắc! Tự nâng toàn bộ trọng lượng cơ thể (0kg đối trọng / Bodyweight)`;
    } else if (didCompleteAll) {
      reasonVi = `Đà tiến bộ Fitbod: Mục tiêu ${effectiveTargetReps} reps @ -${roundedAssistance}kg trợ lực`;
    } else {
      reasonVi = `Giữ mức trợ lực -${roundedAssistance}kg củng cố thể lực`;
    }

    return {
      targetWeight: roundedAssistance,
      isProgressive: didCompleteAll,
      targetRepsAdjustment: 0,
      reasonVi
    };
  }

  // ==========================================
  // BÀI TẬP TẠ THÔNG THƯỜNG (Barbell, Dumbbell, Cable, Machine)
  // Chuẩn thuật toán Non-Linear Periodization & 1RM Fitbod
  // ==========================================
  const lastWeight = Math.abs(history.lastWeight);
  const lastReps = history.lastReps || 8;

  // 1. Khai thác 1RM ước tính (e1RM) từ lịch sử
  let baseE1RM = history.e1RM || 0;
  if (!baseE1RM || baseE1RM <= 0) {
    baseE1RM = calculateE1RM(lastWeight, lastReps);
  }
  if (history.bestWeight && history.bestReps) {
    const bestE1RM = calculateE1RM(history.bestWeight, history.bestReps);
    if (bestE1RM > baseE1RM) {
      baseE1RM = (baseE1RM * 0.3) + (bestE1RM * 0.7);
    }
  }

  // 2. Hệ số tiến bộ (Progressive Overload):
  // Hoàn thành: Tăng +2.5% công suất 1RM
  // Chưa hoàn thành: Giữ nguyên hoặc giảm nhẹ 2%
  const overloadFactor = didCompleteAll ? 1.025 : 0.98;
  const effectiveE1RM = baseE1RM * overloadFactor;

  // 3. Quy đổi sang mức tạ mục tiêu cho số Reps hiện tại:
  // TargetWeight = e1RM * %1RM(targetReps)
  const targetPct = getRepTargetPercentageOf1RM(effectiveTargetReps, goal);
  const rawTargetWeight = effectiveE1RM * targetPct;
  const targetWeight = roundGymWeight(rawTargetWeight, exercise.equipment, exercise.id);

  let reasonVi = '';
  if (goal === 'calorie_burn') {
    reasonVi = `Fitbod 1RM: Chuyển sang Đốt Calo (${effectiveTargetReps} reps) → Tự động giảm tạ về ${targetWeight}kg (~${Math.round(targetPct * 100)}% 1RM) để đẩy tốc độ cao & duy trì nhịp tim đốt mỡ`;
  } else if (goal === 'tone') {
    reasonVi = `Fitbod 1RM: Mục tiêu Săn chắc (${effectiveTargetReps} reps) → Tạ tối ưu ${targetWeight}kg (~${Math.round(targetPct * 100)}% 1RM)`;
  } else if (goal === 'strength') {
    reasonVi = didCompleteAll 
      ? `Fitbod 1RM: Đà tăng sức mạnh (${effectiveTargetReps} reps) → Lên tạ ${targetWeight}kg (~${Math.round(targetPct * 100)}% 1RM)`
      : `Fitbod 1RM: Tạ sức mạnh ${effectiveTargetReps} reps @ ${targetWeight}kg`;
  } else {
    reasonVi = didCompleteAll
      ? `Fitbod 1RM: Đà phát triển cơ bắp (${effectiveTargetReps} reps) @ ${targetWeight}kg`
      : `Fitbod 1RM: Củng cố cơ bắp (${effectiveTargetReps} reps) @ ${targetWeight}kg`;
  }

  return {
    targetWeight,
    isProgressive: didCompleteAll,
    targetRepsAdjustment: 0,
    reasonVi
  };
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
 * Phân tích chuỗi ngày tháng từ log Fitbod sang timestamp ms an toàn
 */
export function parseLogDateToMs(dateStr: string): number {
  if (!dateStr) return 0;
  const clean = dateStr.trim();
  const direct = Date.parse(clean);
  if (!isNaN(direct) && direct > 0) return direct;

  // Thử định dạng ISO "YYYY-MM-DDTHH:mm:ss"
  const isoFormatted = clean.replace(' ', 'T').replace(/ (\+|\-)[0-9]{4}$/, '$1');
  const isoParsed = Date.parse(isoFormatted);
  if (!isNaN(isoParsed) && isoParsed > 0) return isoParsed;

  // Thử chỉ lấy ngày "YYYY-MM-DD"
  const dateOnly = clean.substring(0, 10);
  const dateOnlyParsed = Date.parse(dateOnly);
  if (!isNaN(dateOnlyParsed) && dateOnlyParsed > 0) return dateOnlyParsed;

  return 0;
}

/**
 * Tính toán mức phục hồi của 14 nhóm cơ theo hàm suy thoái mũ chuẩn Fitbod AI:
 * R(t) = 100 - (100 - R0) * exp(-elapsedHours / tau)
 * - Đảm bảo cơ bắp tự động hồi phục dần theo thời gian thực (tăng dần từ R0 -> 100%).
 * - Sau 48h - 72h (tùy nhóm cơ lớn/nhỏ), cơ bắp sẽ đầy đủ 100%.
 */
export function calculateDynamicRecovery(
  baseRecovery: Record<MuscleGroup, number>,
  lastTrainedTime: Record<MuscleGroup, number | null>,
  currentTime: number = Date.now()
): Record<MuscleGroup, number> {
  const result: Record<MuscleGroup, number> = {} as any;

  (Object.keys(MUSCLES_INFO) as MuscleGroup[]).forEach((muscle) => {
    const r0 = baseRecovery[muscle] ?? 100;
    const lastTrained = lastTrainedTime[muscle];

    if (!lastTrained || r0 >= 100) {
      result[muscle] = 100;
    } else {
      const elapsedHours = Math.max(0, (currentTime - lastTrained) / (1000 * 60 * 60));
      const tau = MUSCLES_INFO[muscle].tau;

      // Nếu đã trôi qua hơn 4 lần tau (~3-4 ngày), cơ bắp đã phục hồi hoàn toàn
      if (elapsedHours >= tau * 4) {
        result[muscle] = 100;
      } else {
        const recovered = 100 - (100 - r0) * Math.exp(-elapsedHours / tau);
        result[muscle] = Math.min(100, Math.max(15, Math.round(recovered)));
      }
    }
  });

  return result;
}

export interface MuscleRecoveryETA {
  hoursRemaining: number;
  recoveredAt: Date | null;
  formattedText: string;
  isFullyRecovered: boolean;
}

/**
 * Tính toán thời gian còn lại đến khi nhóm cơ phục hồi hoàn toàn 100%
 */
export function getMuscleRecoveryETA(
  muscle: MuscleGroup,
  currentPct: number,
  baseRecovery: number,
  lastTrainedTime: number | null,
  currentTime: number = Date.now()
): MuscleRecoveryETA {
  if (currentPct >= 99 || !lastTrainedTime) {
    return {
      hoursRemaining: 0,
      recoveredAt: null,
      formattedText: 'Đã phục hồi 100% • Sung sức',
      isFullyRecovered: true
    };
  }

  const tau = MUSCLES_INFO[muscle].tau;
  const r0 = Math.min(95, Math.max(10, baseRecovery || currentPct));
  
  // Tổng số giờ để từ r0 hồi phục lên 99%
  const totalHoursNeeded = tau * Math.log(Math.max(1.1, 100 - r0));
  const elapsedHours = Math.max(0, (currentTime - lastTrainedTime) / (1000 * 60 * 60));
  const hoursRemaining = Math.max(0, Math.round((totalHoursNeeded - elapsedHours) * 10) / 10);

  if (hoursRemaining <= 0.5) {
    return {
      hoursRemaining: 0,
      recoveredAt: new Date(currentTime),
      formattedText: 'Gần như hoàn tất (~100%)',
      isFullyRecovered: true
    };
  }

  const recoveredAt = new Date(currentTime + hoursRemaining * 3600 * 1000);
  
  let formattedText = '';
  if (hoursRemaining < 24) {
    formattedText = `Đầy 100% sau ~${Math.ceil(hoursRemaining)} giờ`;
  } else {
    const days = Math.floor(hoursRemaining / 24);
    const remHours = Math.ceil(hoursRemaining % 24);
    formattedText = `Đầy 100% sau ${days} ngày ${remHours > 0 ? `${remHours}h` : ''}`;
  }

  return {
    hoursRemaining,
    recoveredAt,
    formattedText,
    isFullyRecovered: false
  };
}

/**
 * Tự động đồng bộ và tính toán mức phục hồi của 14 nhóm cơ từ toàn bộ lịch sử bài tập Fitbod
 */
export function syncRecoveryFromWorkoutLogs(
  rawLogs: FitbodRawLogEntry[],
  currentTime: number = Date.now()
): {
  recoveryState: Record<MuscleGroup, number>;
  baseRecovery: Record<MuscleGroup, number>;
  lastTrainedTime: Record<MuscleGroup, number | null>;
} {
  const recoveryState: Record<MuscleGroup, number> = {} as any;
  const baseRecovery: Record<MuscleGroup, number> = {} as any;
  const lastTrainedTime: Record<MuscleGroup, number | null> = {} as any;

  // Khởi tạo ban đầu 100%
  (Object.keys(MUSCLES_INFO) as MuscleGroup[]).forEach(m => {
    recoveryState[m] = 100;
    baseRecovery[m] = 100;
    lastTrainedTime[m] = null;
  });

  if (!rawLogs || rawLogs.length === 0) {
    return { recoveryState, baseRecovery, lastTrainedTime };
  }

  const musclesList = Object.keys(MUSCLES_INFO) as MuscleGroup[];

  musclesList.forEach(m => {
    let latestLogMs = 0;
    let isPrimaryMuscle = false;
    let setsCountInLatestWorkout = 0;

    rawLogs.forEach(log => {
      if (!log.exercise) return;
      const mapped = mapFitbodExerciseToCatalog(log.exercise);
      const catItem = EXERCISE_CATALOG.find(c => c.id === mapped.id);
      if (!catItem) return;

      const isPri = catItem.primaryMuscles.some(pm => pm.muscle === m);
      const isSec = catItem.secondaryMuscles?.some(sm => sm.muscle === m);

      if (isPri || isSec) {
        const logMs = parseLogDateToMs(log.date);
        if (logMs > latestLogMs) {
          latestLogMs = logMs;
          isPrimaryMuscle = isPri;
          setsCountInLatestWorkout = 1;
        } else if (logMs > 0 && Math.abs(logMs - latestLogMs) < 4 * 3600 * 1000) {
          if (isPri) isPrimaryMuscle = true;
          setsCountInLatestWorkout++;
        }
      }
    });

    if (latestLogMs > 0) {
      const elapsedHours = (currentTime - latestLogMs) / (1000 * 60 * 60);
      const tau = MUSCLES_INFO[m].tau;

      // Độ mỏi cơ sở R0 sau buổi tập
      let r0 = isPrimaryMuscle ? 25 : 55;
      if (setsCountInLatestWorkout >= 10 && isPrimaryMuscle) {
        r0 = 20;
      }

      baseRecovery[m] = r0;
      lastTrainedTime[m] = latestLogMs;

      // Nếu đã trôi qua hơn 4 lần tau (~3-4 ngày)
      if (elapsedHours >= tau * 4) {
        recoveryState[m] = 100;
      } else if (elapsedHours <= 0) {
        recoveryState[m] = r0;
      } else {
        const rec = 100 - (100 - r0) * Math.exp(-elapsedHours / tau);
        recoveryState[m] = Math.min(100, Math.max(15, Math.round(rec)));
      }
    }
  });

  return { recoveryState, baseRecovery, lastTrainedTime };
}

/**
 * Tính toán mức mỏi cơ thực tế dựa trên các hiệp THỰC SỰ ĐÃ HOÀN THÀNH (isCompleted = true)
 * Chuẩn hóa theo thuật toán Fitbod AI:
 * - Với mỗi working set hoàn thành của nhóm cơ chính (primary muscle):
 *   Độ mỏi đóng góp là 6.5% - 9.5% tùy theo cường độ tải (RIR và trọng lượng tạ / % 1RM).
 * - Nếu là hiệp AMRAP / Max Effort: Tăng thêm +4% - 6% (+5%) độ mỏi do kích hoạt 100% sợi cơ ngắt.
 * - Hiệp Warmup (khởi động): Đóng góp nhẹ 1.5% - 2.5% độ mỏi làm nóng khớp.
 * - Đối với nhóm cơ phụ (secondary muscle): Nhận 35% - 50% độ mỏi của nhóm cơ chính.
 * -> Kết quả: Một buổi tập 45-60 phút gồm 3-4 bài tập (10-15 working sets) tập trung vào Lưng xô & Tay trước
 * thì độ mỏi tích lũy (Cumulative Fatigue) ĐẠT 70% - 85% (mức Recovery State tụt về vùng 15% - 30% màu cam/đỏ chuẩn Fitbod).
 */
export function calculateCompletedWorkoutFatigue(
  currentRecovery: Record<MuscleGroup, number>,
  exercises: PlannedExercise[]
): Record<MuscleGroup, number> {
  const updated: Record<MuscleGroup, number> = { ...currentRecovery };
  const fatigue: Record<MuscleGroup, number> = {} as any;
  (Object.keys(MUSCLES_INFO) as MuscleGroup[]).forEach(m => { fatigue[m] = 0; });

  exercises.forEach(ex => {
    const catalogItem = EXERCISE_CATALOG.find(c => c.id === ex.exerciseId);
    if (!catalogItem) return;

    // CHỈ TÍNH NHỮNG HIỆP ĐÃ TICK HOÀN THÀNH
    const completedSets = ex.sets.filter(s => s.isCompleted);
    if (completedSets.length === 0) return;

    completedSets.forEach(set => {
      const isWarmup = set.type === 'warmup';
      const isAmrap = set.type === 'amrap' || (ex.isMaxEffort && set.setIndex === ex.sets.length);
      const weight = set.loggedWeight ?? set.targetWeight ?? 0;
      const reps = set.loggedReps ?? set.targetReps ?? 10;
      const e1rm = calculateE1RM(weight, reps);

      // 1. Cường độ tải (Intensity Score: 0.0 -> 1.0)
      const loadRatio = (e1rm > 0 && weight > 0) ? Math.min(1.0, Math.max(0.6, weight / e1rm)) : 0.75;
      
      // RIR factor: RIR 0 -> 1.0, RIR 1 -> 0.9, RIR 2 -> 0.8, RIR 3 -> 0.7
      let rirFactor = 0.8;
      if (set.rir !== undefined) {
        rirFactor = Math.min(1.0, Math.max(0.6, 1.0 - (set.rir * 0.1)));
      } else if (isAmrap) {
        rirFactor = 1.0;
      }

      const rawIntensity = (loadRatio * 0.6) + (rirFactor * 0.4);
      const intensity = Math.min(1.0, Math.max(0.0, (rawIntensity - 0.55) / 0.45));

      // 2. Độ mỏi cơ sở cho nhóm cơ chính (Base Primary Fatigue)
      // Working set: 8.0% -> 9.8% (~6.5% - 9.5% chuẩn Fitbod)
      let basePrimaryFatigue: number;
      if (isWarmup) {
        basePrimaryFatigue = 2.0 + (intensity * 1.0); // 2.0% -> 3.0%
      } else {
        basePrimaryFatigue = 8.0 + (intensity * 1.8); // 8.0% -> 9.8%
        if (isAmrap) {
          basePrimaryFatigue += 5.0; // AMRAP / Max Effort tăng thêm +5.0%
        }
      }

      // Xác định động tác kéo lưng (Vertical/Horizontal Pull) để kích hoạt đồng vận lưng xô & lưng trên
      const isBackPull = catalogItem.movementPattern === 'vertical_pull' || 
                         catalogItem.movementPattern === 'horizontal_pull' ||
                         catalogItem.primaryMuscles.some(pm => pm.muscle === 'lats' || pm.muscle === 'upper_back');

      // 3. Phân bổ cho nhóm cơ chính (Primary Muscles):
      // Nhóm cơ chính chủ lực của bài nhận trọn vẹn độ mỏi cơ sở
      catalogItem.primaryMuscles.forEach(pm => {
        fatigue[pm.muscle] = (fatigue[pm.muscle] || 0) + basePrimaryFatigue;
      });

      // 4. Phân bổ cho nhóm cơ phụ (Secondary Muscles):
      if (catalogItem.secondaryMuscles && catalogItem.secondaryMuscles.length > 0) {
        const maxSmRatio = Math.max(...catalogItem.secondaryMuscles.map(s => s.ratio));
        catalogItem.secondaryMuscles.forEach(sm => {
          const smRelativeRatio = maxSmRatio > 0 ? (sm.ratio / maxSmRatio) : 1.0;
          let secondaryFactor: number;
          if (isBackPull && (sm.muscle === 'lats' || sm.muscle === 'upper_back')) {
            // Hiệp đồng kéo lưng (Back Synergy): Lats <-> Upper Back đồng vận nhận 70% - 85% tải
            secondaryFactor = 0.70 + (0.15 * smRelativeRatio);
          } else {
            // Cơ phụ chuẩn (như tay trước trong bài kéo, tay sau trong bài đẩy): 35% - 50%
            secondaryFactor = 0.35 + (0.15 * smRelativeRatio);
          }
          const smFatigue = basePrimaryFatigue * secondaryFactor;
          fatigue[sm.muscle] = (fatigue[sm.muscle] || 0) + smFatigue;
        });
      }

      // 5. Đồng vận cơ lưng bổ sung (Nếu bài kéo lưng chưa liệt kê cơ kia trong secondary)
      if (isBackPull) {
        const hasLats = catalogItem.primaryMuscles.some(pm => pm.muscle === 'lats') || 
                        catalogItem.secondaryMuscles?.some(sm => sm.muscle === 'lats');
        const hasUpperBack = catalogItem.primaryMuscles.some(pm => pm.muscle === 'upper_back') || 
                             catalogItem.secondaryMuscles?.some(sm => sm.muscle === 'upper_back');
        if (!hasLats) {
          fatigue['lats'] = (fatigue['lats'] || 0) + (basePrimaryFatigue * 0.75);
        }
        if (!hasUpperBack) {
          fatigue['upper_back'] = (fatigue['upper_back'] || 0) + (basePrimaryFatigue * 0.70);
        }
      }
    });
  });

  (Object.keys(currentRecovery) as MuscleGroup[]).forEach(m => {
    const rawFatigue = fatigue[m] || 0;
    if (rawFatigue > 0) {
      // Chuẩn hóa đường cong mỏi cơ sinh lý học Fitbod:
      // Dưới 70%: tăng tuyến tính theo từng hiệp
      // Trên 70%: độ dốc giảm dần (diminishing returns) và chạm trần 82% - 85%
      // Đảm bảo sau buổi tập nặng, Recovery rơi chuẩn xác vào vùng 15% - 30% màu cam/đỏ
      let effectiveFatigue = rawFatigue;
      if (rawFatigue > 70) {
        effectiveFatigue = 70 + Math.min(15, (rawFatigue - 70) * 0.5);
      }
      effectiveFatigue = Math.min(85, Math.max(0, effectiveFatigue));
      updated[m] = Math.max(15, Math.round(updated[m] - effectiveFatigue));
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
    if (goal === 'tone' || goal === 'calorie_burn') return 30;
    return 45; // 45 giây cho nhóm cơ nhỏ & cơ bụng
  }

  if (tier === 1) {
    if (goal === 'strength') return 120;
    if (goal === 'calorie_burn') return 45; // 45s cho bài compound để giữ nhịp tim đốt calo
    if (goal === 'tone') return 60;
    return 90; // 90 giây cho tạ đòn nặng
  }

  // Tier 2 (Máy, cáp, tạ đôi)
  if (goal === 'strength') return 90;
  if (goal === 'calorie_burn') return 35;
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
 * Chuẩn hóa gốc tên bài tập để loại trừ 100% việc chọn 2 biến thể bài tập giống hệt nhau
 * (ví dụ: Smith Close Grip Bench Press vs Smith Machine Close-Grip Bench Press)
 */
export function getExerciseStemKey(ex: ExerciseItem): string {
  if (!ex) return '';
  const raw = (ex.name || ex.id || '').toLowerCase();
  return raw
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\b(smith machine|smith|machine|cable|barbell|dumbbell|weighted|seated|standing|incline|decline|flat)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Trả về khóa nhận diện góc tác động / chuyển động (Angle Diversity Key)
 * Ngăn chặn tuyệt đối việc sinh ra 2 bài cùng 1 góc đẩy phẳng hoặc cùng dạng chuyển động trong 1 buổi tập
 */
export function getExerciseAngleDiversityKey(ex: ExerciseItem): string {
  const id = (ex.id || '').toLowerCase().replace(/^fitbod_/, '');
  const name = (ex.name || '').toLowerCase();
  const primaryMuscle = ex.primaryMuscles[0]?.muscle || '';

  // 1. CHEST (Ngực)
  if (primaryMuscle === 'chest') {
    if (id.includes('incline') && (id.includes('press') || name.includes('incline bench') || name.includes('incline press'))) {
      return 'chest_incline_press';
    }
    if (id.includes('incline') && (id.includes('fly') || name.includes('incline fly'))) {
      return 'chest_incline_fly';
    }
    if (id.includes('decline') || id.includes('dip') || name.includes('decline') || name.includes('dip')) {
      return 'chest_decline_dips';
    }
    if (id.includes('fly') || id.includes('pec_deck') || id.includes('crossover') || id.includes('pullover') || name.includes('fly') || name.includes('pec deck')) {
      return 'chest_fly';
    }
    if (id.includes('bench_press') || id.includes('chest_press') || id.includes('push_up') || name.includes('bench press') || name.includes('chest press') || name.includes('push up')) {
      return 'chest_flat_press';
    }
  }

  // 2. SHOULDERS (Vai & Cầu vai)
  if (primaryMuscle === 'shoulders' || primaryMuscle === 'traps') {
    if (id.includes('overhead') || id.includes('shoulder_press') || id.includes('arnold') || id.includes('military') || name.includes('overhead press') || name.includes('shoulder press')) {
      return 'shoulder_overhead_press';
    }
    if (id.includes('lateral_raise') || id.includes('upright_row') || name.includes('lateral raise') || name.includes('upright row')) {
      return 'shoulder_lateral_raise';
    }
    if (id.includes('front_raise') || name.includes('front raise')) {
      return 'shoulder_front_raise';
    }
    if (id.includes('rear_delt') || id.includes('face_pull') || id.includes('reverse_pec_deck') || name.includes('rear delt') || name.includes('face pull')) {
      return 'shoulder_rear_delt';
    }
    if (id.includes('shrug') || name.includes('shrug')) {
      return 'shoulder_shrug';
    }
  }

  // 3. BACK (Lưng xô & Lưng dưới)
  if (primaryMuscle === 'lats' || primaryMuscle === 'upper_back' || primaryMuscle === 'lower_back') {
    if (id.includes('deadlift') && !id.includes('romanian') && !id.includes('rdl') && !id.includes('stiff')) return 'back_deadlift';
    if (id.includes('back_extension') || id.includes('bird_dog') || id.includes('hyperextension')) return 'back_hyperextension';
    if (id.includes('straight_arm') || name.includes('straight arm')) return 'back_straight_arm';
    if (id.includes('pull_up') || name.includes('pull up')) return 'back_pull_up';
    if (id.includes('chin_up') || name.includes('chin up')) return 'back_chin_up';
    if (id.includes('lat_pulldown') || name.includes('lat pulldown')) return 'back_lat_pulldown';
    if (id.includes('seated_row') || id.includes('seated_cable_row') || name.includes('seated cable row') || name.includes('seated row')) return 'back_seated_cable_row';
    if (id.includes('tbar') || id.includes('t_bar')) return 'back_tbar_row';
    if (id.includes('barbell_row') || id.includes('pendlay') || id.includes('landmine_row')) return 'back_barbell_row';
    if (id.includes('dumbbell_row') || name.includes('dumbbell row')) return 'back_dumbbell_row';
    if (id.includes('row') || name.includes('row')) return 'back_general_row';
  }

  // 4. BICEPS (Tay trước & Cẳng tay)
  if (primaryMuscle === 'biceps' || primaryMuscle === 'forearms') {
    if (id.includes('preacher') || id.includes('spider') || id.includes('concentration') || name.includes('preacher') || name.includes('concentration')) return 'biceps_preacher_curl';
    if (id.includes('incline') && (id.includes('curl') || name.includes('incline curl'))) return 'biceps_incline_curl';
    if (id.includes('hammer') || name.includes('hammer')) return 'biceps_hammer_curl';
    if (id.includes('wrist_curl') || id.includes('grip') || name.includes('wrist curl')) return 'forearms_grip';
    if (id.includes('curl') || name.includes('curl')) return 'biceps_regular_curl';
  }

  // 5. TRICEPS (Tay sau)
  if (primaryMuscle === 'triceps') {
    if (id.includes('pushdown') || name.includes('pushdown')) return 'triceps_pushdown';
    if ((id.includes('overhead') && id.includes('tricep')) || name.includes('overhead tricep') || id.includes('overhead_extension')) return 'triceps_overhead';
    if (id.includes('skull_crusher') || id.includes('close_grip') || id.includes('kickback') || id.includes('tate_press') || id.includes('dip') || name.includes('close grip') || name.includes('close-grip') || name.includes('skull crusher') || name.includes('kickback') || name.includes('dip')) return 'triceps_extension_press';
  }

  // 6. QUADS (Đùi trước)
  if (primaryMuscle === 'quads') {
    if (id.includes('leg_press') || name.includes('leg press')) return 'quads_leg_press';
    if (id.includes('leg_extension') || name.includes('leg extension')) return 'quads_isolation';
    if (id.includes('lunge') || id.includes('split_squat') || id.includes('step_up') || id.includes('goblet') || name.includes('lunge') || name.includes('split squat')) return 'quads_unilateral_squat';
    if (id.includes('squat') || name.includes('squat') || id.includes('hack_squat')) return 'quads_heavy_squat';
  }

  // 7. HAMSTRINGS (Đùi sau)
  if (primaryMuscle === 'hamstrings') {
    if (id.includes('rdl') || id.includes('romanian') || id.includes('stiff') || name.includes('romanian') || name.includes('stiff-leg')) return 'hamstrings_rdl';
    if (id.includes('leg_curl') || id.includes('curl') || name.includes('leg curl')) return 'hamstrings_curl';
    if (id.includes('adduction') || name.includes('adduction')) return 'hamstrings_adduction';
  }

  // 8. GLUTES (Mông)
  if (primaryMuscle === 'glutes') {
    if (id.includes('thrust') || id.includes('bridge') || id.includes('pull_through') || name.includes('thrust') || name.includes('bridge')) return 'glutes_thrust';
    if (id.includes('kickback') || name.includes('kickback')) return 'glutes_kickback';
    if (id.includes('abduction') || name.includes('abduction')) return 'glutes_abduction';
  }

  // 9. CALVES (Bắp chân)
  if (primaryMuscle === 'calves') {
    if (id.includes('standing') || name.includes('standing')) return 'calves_standing';
    if (id.includes('seated') || name.includes('seated')) return 'calves_seated';
    if (id.includes('calf') || name.includes('calf')) return 'calves_general';
  }

  // 10. ABS / CORE (Cơ bụng)
  if (primaryMuscle === 'abs') {
    if (id.includes('plank') || id.includes('rollout') || id.includes('deadbug') || id.includes('hollow') || name.includes('plank') || name.includes('rollout')) return 'abs_isometric';
    if (id.includes('woodchopper') || id.includes('twist') || id.includes('side_bend') || name.includes('twist') || name.includes('woodchopper')) return 'abs_rotational';
    if (id.includes('crunch') || id.includes('raise') || id.includes('sit_up') || name.includes('crunch') || name.includes('leg raise')) return 'abs_flexion';
  }

  return `${primaryMuscle}_${ex.movementPattern || 'exercise'}`;
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
  bodyProfile?: UserBodyProfile,
  exercisePreferences?: Record<string, ExercisePreferenceStatus>
): WorkoutPlan {
  // Đọc danh sách ưu tiên/loại trừ (từ param hoặc storage)
  const effectivePreferences = exercisePreferences || getExercisePreferences();

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

  // 2. Lọc các bài tập thỏa mãn thiết bị và nhóm cơ (loại bỏ bài tập máy phòng gym không có, bài hại cột sống, hoặc bài Sếp đã chặn)
  const effectiveExcluded = new Set<string>(excludedExerciseIds || []);
  if (bodyProfile?.spineSafeMode) {
    HERNIATED_DISC_EXCLUDED_IDS.forEach(id => effectiveExcluded.add(id));
  }

  const eligible = EXERCISE_CATALOG.filter((ex) => {
    if (ex.movementPattern === 'cardio') return false;
    if (effectiveExcluded.has(ex.id)) return false;
    // BÀI CÓ TRẠNG THÁI 'exclude' (Loại trừ 🚫): BỊ LOẠI BỎ 100%
    if (effectivePreferences[ex.id] === 'exclude') return false;
    const equipOk = ex.equipment === 'bodyweight' || availableEquipment.includes(ex.equipment);
    if (!equipOk) return false;
    return ex.primaryMuscles.some((pm) => candidateMuscles.includes(pm.muscle));
  });

  // Tính điểm ưu tiên cho từng bài tập:
  // - Bài Yêu thích ⭐: +150 điểm để AI luôn ưu tiên chọn khi nhóm cơ hồi phục
  // - Ưu tiên thiết bị nếu Sếp chọn: +60 điểm
  // - Ưu tiên Compound/Tier chuẩn khoa học: (5 - tier) * 10
  const getExerciseScore = (ex: ExerciseItem): number => {
    let score = 0;
    if (effectivePreferences[ex.id] === 'favorite') {
      score += 150;
    }
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
  const selectedStems = new Set<string>();

  const numMuscles = candidateMuscles.length;
  const basePerMuscle = Math.max(1, Math.floor(count / numMuscles));

  // Vòng 1: Lấy tối thiểu basePerMuscle bài cho MỌI nhóm cơ đã chọn (ưu tiên góc chuyển động đa dạng chưa xuất hiện)
  candidateMuscles.forEach(m => {
    let taken = 0;
    // 1a. Thử chọn bài chưa trùng ID, chưa trùng góc tác động VÀ chưa trùng stem bài tập
    for (const ex of byMuscle[m]) {
      if (taken >= basePerMuscle) break;
      const angleKey = getExerciseAngleDiversityKey(ex);
      const stemKey = getExerciseStemKey(ex);
      if (!selectedIds.has(ex.id) && !selectedAngleKeys.has(angleKey) && (!stemKey || !selectedStems.has(stemKey))) {
        selected.push(ex);
        selectedIds.add(ex.id);
        selectedAngleKeys.add(angleKey);
        if (stemKey) selectedStems.add(stemKey);
        taken++;
      }
    }
    // 1b. Fallback nếu nhóm cơ ít bài và chưa lấy đủ basePerMuscle (vẫn bảo đảm không trùng stem bài)
    if (taken < basePerMuscle) {
      for (const ex of byMuscle[m]) {
        if (taken >= basePerMuscle) break;
        const stemKey = getExerciseStemKey(ex);
        if (!selectedIds.has(ex.id) && (!stemKey || !selectedStems.has(stemKey))) {
          selected.push(ex);
          selectedIds.add(ex.id);
          selectedAngleKeys.add(getExerciseAngleDiversityKey(ex));
          if (stemKey) selectedStems.add(stemKey);
          taken++;
        }
      }
    }
  });

  // Vòng 2: Phân bổ các slot còn lại theo vòng tròn cho các nhóm cơ (Ưu tiên bài chưa trùng góc & chưa trùng stem)
  for (const m of candidateMuscles) {
    if (selected.length >= count) break;
    for (const ex of byMuscle[m]) {
      const angleKey = getExerciseAngleDiversityKey(ex);
      const stemKey = getExerciseStemKey(ex);
      if (!selectedIds.has(ex.id) && !selectedAngleKeys.has(angleKey) && (!stemKey || !selectedStems.has(stemKey))) {
        selected.push(ex);
        selectedIds.add(ex.id);
        selectedAngleKeys.add(angleKey);
        if (stemKey) selectedStems.add(stemKey);
        break;
      }
    }
  }

  // Vòng 3: Nếu vẫn còn thiếu slot (do các bài còn lại bị trùng góc), cho phép lấy thêm bài tốt nhất (vẫn chặn trùng stem)
  if (selected.length < count) {
    for (const m of candidateMuscles) {
      if (selected.length >= count) break;
      for (const ex of byMuscle[m]) {
        if (selected.length >= count) break;
        const stemKey = getExerciseStemKey(ex);
        if (!selectedIds.has(ex.id) && (!stemKey || !selectedStems.has(stemKey))) {
          selected.push(ex);
          selectedIds.add(ex.id);
          selectedAngleKeys.add(getExerciseAngleDiversityKey(ex));
          if (stemKey) selectedStems.add(stemKey);
        }
      }
    }
  }

  // Vòng 4: Fallback cuối cùng từ danh sách eligible chung nếu vẫn thiếu slot (tuyệt đối không trùng stem)
  if (selected.length < count) {
    const remainingEligible = [...eligible].sort((a, b) => getExerciseScore(b) - getExerciseScore(a));
    for (const ex of remainingEligible) {
      if (selected.length >= count) break;
      const stemKey = getExerciseStemKey(ex);
      if (!selectedIds.has(ex.id) && (!stemKey || !selectedStems.has(stemKey))) {
        selected.push(ex);
        selectedIds.add(ex.id);
        if (stemKey) selectedStems.add(stemKey);
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
    strength: { sets: 4, reps: 5, rir: 2, rest: 180, basePct: 0.86 },
    hypertrophy: { sets: 3, reps: 10, rir: 1, rest: 90, basePct: 0.74 },
    tone: { sets: 3, reps: 14, rir: 2, rest: 45, basePct: 0.64 },
    calorie_burn: { sets: 3, reps: 16, rir: 2, rest: 35, basePct: 0.58 }
  }[goal] || { sets: 3, reps: 12, rir: 2, rest: 45, basePct: 0.68 };

  const plannedExercises: PlannedExercise[] = selected.map((ex, exIdx) => {
    const isExerciseMaxEffort = exIdx === maxEffortIdx;

    // 1. Tính toán mức tạ đỉnh (Peak Weight) theo Progressive Overload từ Exercise History
    const { targetWeight: peakWeight, targetRepsAdjustment } = calculateProgressiveOverloadWeight(
      ex,
      exerciseHistory?.[ex.id],
      bodyProfile,
      goal,
      goalConfig.reps
    );

    const cableConfig = ex.equipment === 'cable' ? (ex.cableConfig || {
      pulleyRatio: (ex.id === 'lat_pulldown' || ex.id === 'seated_cable_row') ? ('1:1' as const) : ('2:1' as const),
      defaultStackKg: peakWeight,
      noteVi: (ex.id === 'lat_pulldown' || ex.id === 'seated_cable_row')
        ? 'Ròng rọc đơn 1:1 (Lực kéo = 100% tạ cắm)'
        : 'Ròng rọc đôi 2:1 (Lực kéo = 50% tạ cắm do qua ròng rọc di động)'
    }) : undefined;

    const sets: WorkoutSet[] = [];
    let currentSetIndex = 1;

    const isAssisted = isAssistedExercise(ex);
    const userBw = bodyProfile?.weightKg || 70;
    const peakAssist = Math.abs(peakWeight);
    const netPeakLoad = Math.max(10, userBw - peakAssist);

    // Tính toán mảng mức tạ/mức trợ lực cho các hiệp (Pyramid & Warmup):
    // Với bài thường: Tạ tăng dần (Warmup 50% -> Set 1: 75% -> Set 2: 90% -> Set 3: 100% -> Backoff 85%)
    // Với bài TRỢ LỰC (Assisted Chin Up/Dip): Trọng lượng là ĐỐI TRỌNG TRỪ BỚT (-kg).
    // Do đó mức trợ lực phải NẶNG TRƯỚC RỒI GIẢM DẦN (Warmup: trợ lực nhiều nhất ~50% netLoad -> Set 1: ~75% netLoad -> Set 2: ~90% netLoad -> Set 3: tạ đỉnh trợ lực ít nhất -> Backoff: tăng lại trợ lực)!
    
    // Warmup weights:
    const warmupW1 = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.50), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.5, ex.equipment, ex.id);

    const warmupW2 = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.65), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.65, ex.equipment, ex.id);

    // 4 working sets weights (Kim Tự Tháp NSCA & Fitbod Pro):
    const w4_1 = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.75), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.75, ex.equipment, ex.id);

    const w4_2 = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.90), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.90, ex.equipment, ex.id);

    const w4_3 = peakWeight; // Mức trợ lực đỉnh (ít trợ lực nhất)

    const w4_backoff = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.85), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.85, ex.equipment, ex.id);

    // 3 working sets weights (Isolation / Tier 3):
    const w3_1 = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.80), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.80, ex.equipment, ex.id);

    const w3_2 = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.90), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.90, ex.equipment, ex.id);

    const w3_3 = peakWeight;

    // Tone weights:
    const wTone_1 = isAssisted
      ? roundGymWeight(Math.max(0, userBw - netPeakLoad * 0.90), ex.equipment, ex.id)
      : roundGymWeight(peakWeight * 0.90, ex.equipment, ex.id);

    // A. Thêm hiệp khởi động (Warmup) nếu được chọn bật
    if (includeWarmup && (ex.tier === 1 || getExerciseTierOrder(ex) === 1)) {
      sets.push({
        setIndex: currentSetIndex++,
        type: 'warmup',
        targetWeight: warmupW1,
        targetReps: 10,
        isCompleted: false
      });

      const threshold = ex.equipment === 'barbell' ? 45 : (ex.equipment === 'dumbbell' ? 16 : 25);
      if (peakWeight > threshold || (isAssisted && peakWeight > 0)) {
        sets.push({
          setIndex: currentSetIndex++,
          type: 'warmup',
          targetWeight: warmupW2,
          targetReps: 5,
          isCompleted: false
        });
      }
    } else if (includeWarmup) {
      // Tier 2 & Tier 3: Thêm 1 hiệp khởi động nhẹ làm nóng khớp
      sets.push({
        setIndex: currentSetIndex++,
        type: 'warmup',
        targetWeight: warmupW1,
        targetReps: 8,
        isCompleted: false
      });
    }

    // B. Các hiệp chính:
    if (ex.equipment === 'bodyweight') {
      // Bài tập bodyweight: tạ = 0, nén tải qua số rep
      const numWorkingSets = (goal === 'strength' || ex.tier <= 2 || isExerciseMaxEffort) ? 4 : goalConfig.sets;
      for (let i = 1; i <= numWorkingSets; i++) {
        const isAmrap = isExerciseMaxEffort ? (i === numWorkingSets) : false;
        let reps = goalConfig.reps;
        if (i === 1) reps = Math.max(10, goalConfig.reps + 2);
        else if (i === 2) reps = goalConfig.reps;
        else if (i === 3) reps = Math.max(8, goalConfig.reps - 1);
        else if (i === 4) reps = isAmrap ? goalConfig.reps : Math.max(10, goalConfig.reps + 2);

        sets.push({
          setIndex: currentSetIndex++,
          type: isAmrap ? 'amrap' : 'working',
          targetWeight: 0,
          targetReps: reps,
          isCompleted: false,
          rir: isAmrap ? 0 : goalConfig.rir
        });
      }
    } else if (goal === 'calorie_burn') {
      // ==========================================
      // CHẾ ĐỘ ĐỐT CALO & GIẢM MỠ (HIIT CIRCUIT / METABOLIC RESISTANCE)
      // Chuẩn Fitbod Circuit: 3 Hiệp Reps Cao (14-18 reps) liên tục,
      // Mức tạ ~50-58% 1RM đã được tối ưu để giữ nhịp tim đốt mỡ không đứt gãy
      // ==========================================
      const burnReps = goalConfig.reps; // 16 reps

      // Set 1: 16 reps @ peakWeight (bắt nhịp đốt mỡ)
      sets.push({
        setIndex: currentSetIndex++,
        type: 'working',
        targetWeight: peakWeight,
        targetReps: burnReps,
        isCompleted: false,
        rir: 2,
        cableRatio: cableConfig?.pulleyRatio
      });

      // Set 2: 16 reps @ peakWeight (duy trì ngưỡng hiếu khí)
      sets.push({
        setIndex: currentSetIndex++,
        type: 'working',
        targetWeight: peakWeight,
        targetReps: burnReps,
        isCompleted: false,
        rir: 2,
        cableRatio: cableConfig?.pulleyRatio
      });

      // Set 3: 16-18 reps Burnout (hoặc AMRAP nếu là Max Effort)
      const lastReps = isExerciseMaxEffort ? burnReps : Math.min(20, burnReps + 2);
      sets.push({
        setIndex: currentSetIndex++,
        type: isExerciseMaxEffort ? 'amrap' : 'working',
        targetWeight: peakWeight,
        targetReps: lastReps,
        isCompleted: false,
        rir: isExerciseMaxEffort ? 0 : 1,
        cableRatio: cableConfig?.pulleyRatio
      });
    } else if (goal === 'tone') {
      // ==========================================
      // CHẾ ĐỘ SĂN CHẮC & ĐỊNH HÌNH CƠ (TONING / 14 REPS)
      // ==========================================
      sets.push({
        setIndex: currentSetIndex++,
        type: 'working',
        targetWeight: wTone_1,
        targetReps: goalConfig.reps,
        isCompleted: false,
        rir: 2,
        cableRatio: cableConfig?.pulleyRatio
      });
      sets.push({
        setIndex: currentSetIndex++,
        type: 'working',
        targetWeight: peakWeight,
        targetReps: goalConfig.reps,
        isCompleted: false,
        rir: 1,
        cableRatio: cableConfig?.pulleyRatio
      });
      sets.push({
        setIndex: currentSetIndex++,
        type: isExerciseMaxEffort ? 'amrap' : 'working',
        targetWeight: peakWeight,
        targetReps: goalConfig.reps,
        isCompleted: false,
        rir: isExerciseMaxEffort ? 0 : 1,
        cableRatio: cableConfig?.pulleyRatio
      });
    } else {
      // Hypertrophy & Strength
      const numWorkingSets = (goal === 'strength' || ex.tier <= 2 || isExerciseMaxEffort) ? 4 : goalConfig.sets;

      if (numWorkingSets >= 4) {
        // 4 Hiệp Chuẩn Kim Tự Tháp NSCA & Fitbod Pro:
        // Set 1: Làm quen/khởi động đà (Bài thường: 75% tạ; Bài trợ lực: mức trợ lực đối trọng NẶNG NHẤT w4_1)
        sets.push({
          setIndex: currentSetIndex++,
          type: 'working',
          targetWeight: w4_1,
          targetReps: Math.max(8, (goalConfig.reps || 8) + 2 + targetRepsAdjustment),
          isCompleted: false,
          rir: 2,
          cableRatio: cableConfig?.pulleyRatio
        });

        // Set 2: Tăng nén tải (Bài thường: 90% tạ; Bài trợ lực: GIẢM bớt trợ lực w4_2 để người kéo nặng hơn)
        sets.push({
          setIndex: currentSetIndex++,
          type: 'working',
          targetWeight: w4_2,
          targetReps: Math.max(6, (goalConfig.reps || 8) + targetRepsAdjustment),
          isCompleted: false,
          rir: 1,
          cableRatio: cableConfig?.pulleyRatio
        });

        // Set 3: Tạ đỉnh (100% tạ làm việc / Mức trợ lực thấp nhất)
        sets.push({
          setIndex: currentSetIndex++,
          type: 'working',
          targetWeight: peakWeight,
          targetReps: Math.max(5, (goalConfig.reps || 8) + targetRepsAdjustment),
          isCompleted: false,
          rir: 1,
          cableRatio: cableConfig?.pulleyRatio
        });

        // Set 4: Giữ tạ đỉnh hoặc Hiệp Max Effort (AMRAP), hoặc xả cơ Drop-set (Back-off set: giảm tải để bơm máu)
        if (isExerciseMaxEffort) {
          sets.push({
            setIndex: currentSetIndex++,
            type: 'amrap',
            targetWeight: peakWeight,
            targetReps: goalConfig.reps,
            isCompleted: false,
            rir: 0,
            cableRatio: cableConfig?.pulleyRatio
          });
        } else if (goal === 'hypertrophy') {
          // Back-off set: giảm tải 15% để bơm máu (bài trợ lực tăng lại trợ lực w4_backoff)
          sets.push({
            setIndex: currentSetIndex++,
            type: 'working',
            targetWeight: w4_backoff,
            targetReps: Math.max(8, (goalConfig.reps || 8) + 2),
            isCompleted: false,
            rir: 1,
            cableRatio: cableConfig?.pulleyRatio
          });
        } else {
          // Giữ tạ đỉnh
          sets.push({
            setIndex: currentSetIndex++,
            type: 'working',
            targetWeight: peakWeight,
            targetReps: goalConfig.reps,
            isCompleted: false,
            rir: 1,
            cableRatio: cableConfig?.pulleyRatio
          });
        }
      } else {
        // 3 Hiệp Kim Tự Tháp (Isolation cơ nhỏ / Tier 3):
        // Set 1: Làm quen đà
        sets.push({
          setIndex: currentSetIndex++,
          type: 'working',
          targetWeight: w3_1,
          targetReps: Math.max(8, (goalConfig.reps || 8) + 2 + targetRepsAdjustment),
          isCompleted: false,
          rir: 2,
          cableRatio: cableConfig?.pulleyRatio
        });

        // Set 2: Nén tải
        sets.push({
          setIndex: currentSetIndex++,
          type: 'working',
          targetWeight: w3_2,
          targetReps: Math.max(6, (goalConfig.reps || 8) + targetRepsAdjustment),
          isCompleted: false,
          rir: 1,
          cableRatio: cableConfig?.pulleyRatio
        });

        // Set 3: 100% tạ đỉnh (AMRAP nếu là Max Effort)
        sets.push({
          setIndex: currentSetIndex++,
          type: isExerciseMaxEffort ? 'amrap' : 'working',
          targetWeight: peakWeight,
          targetReps: Math.max(5, (goalConfig.reps || 8) + targetRepsAdjustment),
          isCompleted: false,
          rir: isExerciseMaxEffort ? 0 : goalConfig.rir,
          cableRatio: cableConfig?.pulleyRatio
        });
      }
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

  // 7. Nhét bài Cardio cuối buổi nếu Sếp chọn hoặc nếu mục tiêu là Calorie Burn
  const effectiveCardioType = (cardioType === 'none' && goal === 'calorie_burn') ? 'treadmill' : cardioType;
  const effectiveCardioMinutes = (cardioType === 'none' && goal === 'calorie_burn') ? 15 : cardioDurationMinutes;

  if (effectiveCardioType !== 'none') {
    const cardioItem = EXERCISE_CATALOG.find(c => c.id === `cardio_${effectiveCardioType}`);
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
            targetReps: effectiveCardioMinutes,
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
        cardioMinutes: effectiveCardioMinutes
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

  const userWeight = bodyProfile?.weightKg || 70;
  const totalWorkoutMinutes = durationMinutes + (effectiveCardioType !== 'none' ? effectiveCardioMinutes : 0);
  let metRate = 5.8;
  if (goal === 'calorie_burn') metRate = 9.2;
  else if (goal === 'tone') metRate = 7.0;
  else if (goal === 'strength') metRate = 4.8;
  const estimatedCalories = Math.round(totalWorkoutMinutes * (metRate * 3.5 * userWeight / 200));

  let title = 'Buổi tập cá nhân hóa';
  if (goal === 'calorie_burn') {
    title = '🔥 Đốt Calo & Giảm Mỡ Tối Đa (HIIT & Circuit)';
  } else if (isCustom) {
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
    durationMinutes: totalWorkoutMinutes,
    date: new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' }),
    exercises: plannedExercises,
    includeWarmup,
    cardioType: effectiveCardioType,
    cardioDurationMinutes: effectiveCardioMinutes,
    targetMuscles: candidateMuscles,
    hasMaxEffort: maxEffortIdx !== -1,
    equipmentPreference,
    excludedExerciseIds: Array.from(effectiveExcluded),
    bodyProfile,
    spineSafeMode: bodyProfile?.spineSafeMode ?? false,
    estimatedCalories
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

export interface FitbodRawLogEntry {
  date: string;              // "2024-03-01 10:00:00 +0000"
  exercise: string;          // "Barbell Bench Press"
  exerciseId?: string;
  reps: number;
  weightKg: number;
  durationSeconds?: number;
  distanceMeters?: number;
  incline?: number;
  resistance?: number;
  isWarmup?: boolean;
  note?: string;
  multiplier?: number;
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
  rawLogs?: FitbodRawLogEntry[];
}

/**
 * Trình phân tích chuỗi CSV Fitbod WorkoutExport.csv trực tiếp trên trình duyệt
 * - Phân tích chính xác tên bài tập tiếng Anh sang Catalog bài tập hệ thống
 * - Lưu lại chỉ số kỷ lục PR (Max Weight, 1RM, Best Reps)
 * - Tự động tạo ExerciseHistory cho toàn bộ bài tập
 * - Lưu trữ 100% nhật ký từng hiệp gốc (rawLogs) để khi export giữ nguyên ngày tháng thật
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
      exerciseHistory: {},
      rawLogs: []
    };
  }

  const headers = parseCsvLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
  const weightColIndex = headers.findIndex(h => h.toLowerCase().includes('weight'));
  const repsColIndex = headers.findIndex(h => h.toLowerCase().includes('reps'));
  const exerciseColIndex = headers.findIndex(h => h.toLowerCase().includes('exercise'));
  const dateColIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
  const multiplierColIndex = headers.findIndex(h => h.toLowerCase().includes('multiplier'));
  const warmupColIndex = headers.findIndex(h => h.toLowerCase().includes('warmup'));
  const durationColIndex = headers.findIndex(h => h.toLowerCase().includes('duration'));
  const distanceColIndex = headers.findIndex(h => h.toLowerCase().includes('distance'));
  const inclineColIndex = headers.findIndex(h => h.toLowerCase().includes('incline'));
  const resistanceColIndex = headers.findIndex(h => h.toLowerCase().includes('resistance'));
  const noteColIndex = headers.findIndex(h => h.toLowerCase().includes('note'));

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

  const rawLogs: FitbodRawLogEntry[] = [];
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
    const durationSeconds = durationColIndex !== -1 ? (parseFloat(cols[durationColIndex] || '0') || 0) : 0;
    const distanceMeters = distanceColIndex !== -1 ? (parseFloat(cols[distanceColIndex] || '0') || 0) : 0;
    const incline = inclineColIndex !== -1 ? (parseFloat(cols[inclineColIndex] || '0') || 0) : 0;
    const resistance = resistanceColIndex !== -1 ? (parseFloat(cols[resistanceColIndex] || '0') || 0) : 0;
    const note = noteColIndex !== -1 ? (cols[noteColIndex] || '') : '';

    // Đổi lbs sang kg nếu cần
    let kgWeight = isLbs ? rawWeight * 0.45359237 : rawWeight;
    kgWeight = Math.round(kgWeight * 10) / 10;

    // Lưu vào rawLogs giữ nguyên 100% dữ liệu gốc
    rawLogs.push({
      date: dateStr,
      exercise: rawExerciseName,
      reps,
      weightKg: kgWeight,
      durationSeconds,
      distanceMeters,
      incline,
      resistance,
      isWarmup,
      note,
      multiplier
    });

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
    exerciseHistory,
    rawLogs
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

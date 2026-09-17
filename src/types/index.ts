export type MuscleGroup = 
  | 'chest' 
  | 'lats' 
  | 'upper_back' 
  | 'lower_back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'forearms' 
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'abs' 
  | 'traps';

export interface MuscleInfo {
  id: MuscleGroup;
  nameVi: string;
  nameEn: string;
  region: 'upper' | 'lower' | 'core';
  tau: number;
}

export type EquipmentType = 
  | 'barbell' 
  | 'dumbbell' 
  | 'cable' 
  | 'bodyweight' 
  | 'machine' 
  | 'kettlebell' 
  | 'resistance_band';

export type DetailedMuscleHead = 
  | 'vai_truoc'        // Anterior / Front Deltoid
  | 'vai_giua'         // Lateral / Side Deltoid
  | 'vai_sau'          // Posterior / Rear Deltoid
  | 'nguc_tren'        // Upper Clavicular Chest
  | 'nguc_giua'        // Mid Sternal Chest
  | 'nguc_duoi'        // Lower Sternal Chest
  | 'lung_xo'          // Latissimus Dorsi (Lats)
  | 'lung_tren'        // Upper Back & Rhomboids
  | 'cau_vai'          // Trapezius (Traps)
  | 'lung_duoi'        // Lower Back (Erector Spinae)
  | 'tay_truoc_dai'    // Biceps Long Head
  | 'tay_truoc_ngan'   // Biceps Short Head
  | 'co_canh_tay'      // Brachialis
  | 'tay_sau_dai'      // Triceps Long Head
  | 'tay_sau_ngoai'    // Triceps Lateral Head
  | 'tay_sau_giua'     // Triceps Medial Head
  | 'cang_tay'         // Forearms
  | 'dui_truoc'        // Quadriceps
  | 'dui_sau'          // Hamstrings
  | 'co_mong'          // Glutes
  | 'bap_chan'         // Calves
  | 'co_bung'          // Rectus Abdominis
  | 'co_lien_suon';    // Obliques

export interface MuscleTargetDetail {
  primaryHead: DetailedMuscleHead;
  primaryHeadNameVi: string;
  primaryHeadNameEn: string;
  secondaryHeads?: string[];
  mindMuscleCue: string;        // Mẹo cảm nhận cơ khi tập
  feelingLocation: string;      // Vị trí cảm nhận trên cơ thể
  bodyView: 'front' | 'back' | 'both'; // Góc nhìn giải phẫu
}

export interface CableConfig {
  pulleyRatio: '1:1' | '2:1';
  defaultStackKg: number;
  noteVi: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  equipment: EquipmentType;
  movementPattern: string;
  primaryMuscles: { muscle: MuscleGroup; ratio: number }[];
  secondaryMuscles: { muscle: MuscleGroup; ratio: number }[];
  muscleTarget?: MuscleTargetDetail;
  cableConfig?: CableConfig;
  images?: string[];
  videoUrl?: string;
  videoEmbedId?: string;
  setup?: string;
  execution?: string;
  mistakes?: string;
}

export interface WorkoutSet {
  setIndex: number;
  type: 'warmup' | 'working' | 'amrap';
  targetWeight: number;
  targetReps: number;
  loggedWeight?: number;
  loggedReps?: number;
  isCompleted: boolean;
  rir?: number;
  cableRatio?: '1:1' | '2:1';
}

export type CardioType = 'none' | 'bike' | 'treadmill' | 'elliptical';

export interface PlannedExercise {
  exerciseId: string;
  exerciseName: string;
  tier: number;
  equipment: EquipmentType;
  sets: WorkoutSet[];
  restSeconds: number;
  primaryMuscles: string[];
  muscleTarget?: MuscleTargetDetail;
  cableConfig?: CableConfig;
  images?: string[];
  videoUrl?: string;
  videoEmbedId?: string;
  setup?: string;
  execution?: string;
  mistakes?: string;
  isCardio?: boolean;
  cardioMinutes?: number;
  isMaxEffort?: boolean;
  maxEffortGoalReps?: number;
}

export type EquipmentPreference = 'all' | 'dumbbell' | 'barbell' | 'cable' | 'machine' | 'bodyweight';

export interface WorkoutPlan {
  id: string;
  title: string;
  split: string;
  durationMinutes: number;
  date: string;
  exercises: PlannedExercise[];
  includeWarmup?: boolean;
  cardioType?: CardioType;
  cardioDurationMinutes?: number;
  targetMuscles?: MuscleGroup[];
  hasMaxEffort?: boolean;
  equipmentPreference?: EquipmentPreference;
  availableMachines?: string[];
  excludedExerciseIds?: string[];
  bodyProfile?: UserBodyProfile;
  spineSafeMode?: boolean;
}

export interface UserPersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxE1RM: number;
  bestSet: string;
  lastDate: string;
}

export interface GymProfile {
  id: string;
  name: string;
  availableEquipment: EquipmentType[];
}

export type FitnessGoal = 'hypertrophy' | 'strength' | 'tone';
export type FitnessSplit = 'push_pull_legs' | 'upper_lower' | 'full_body';

export interface ExerciseHistoryRecord {
  exerciseId: string;
  totalSessions: number;
  lastSessionDate: string;
  lastMaxEffortDate?: string;
  sessionsSinceLastMaxEffort: number;
  bestWeight?: number;
  bestReps?: number;
  e1RM?: number;
  lastWeight?: number;
  lastReps?: number;
  lastTargetReps?: number;
  lastCompletedAllReps?: boolean;
}

export type ExercisePreferenceType = 'favorite' | 'exclude' | 'neutral';
export type ExercisePreferencesMap = Record<string, ExercisePreferenceType>;

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  isMain?: boolean;
  createdAt: string;
}

export type FitnessLevel = 'beginner' | 'advanced' | 'expert';
export type Gender = 'male' | 'female';

export interface UserBodyProfile {
  level: FitnessLevel;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  spineSafeMode?: boolean;
}

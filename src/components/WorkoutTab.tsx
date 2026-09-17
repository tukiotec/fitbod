import { isExerciseSpineSafe, HERNIATED_DISC_EXCLUDED_IDS, SPINE_SAFETY_REASONS, SPINE_SAFE_ALTERNATIVES } from '../data/spineSafety';
import React, { useState, useRef } from 'react';
import { Play, Dumbbell, Clock, Layers, Sparkles, RefreshCw, ChevronRight, Info, Video, Eye, Flame, Target, Plus, Minus, Edit3 , Shield, ShieldAlert, AlertTriangle, Star, Ban, GripVertical } from 'lucide-react';
import { WorkoutPlan, PlannedExercise, CardioType, ExerciseItem, MuscleGroup, EquipmentPreference, UserBodyProfile } from '../types';
import { MUSCLES_INFO, EXERCISE_CATALOG } from '../data/exerciseCatalog';
import { PlateCalculatorModal } from './PlateCalculatorModal';
import { CableStackModal } from './CableStackModal';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { SwapExerciseModal } from './SwapExerciseModal';
import { TargetMusclesModal } from './TargetMusclesModal';
import { EditExerciseModal } from './EditExerciseModal';
import { ExercisePreferenceStatus } from '../utils/exercisePreferences';

interface WorkoutTabProps {
  workout: WorkoutPlan;
  bodyProfile?: UserBodyProfile;
  onStartWorkout: () => void;
  onResumeWorkout?: () => void;
  onCancelWorkout?: () => void;
  isWorkingOut?: boolean;
  onRegenerate: () => void;
  onSwapExercise: (index: number, newExercise?: ExerciseItem) => void;
  onMoveExercise?: (fromIndex: number, toIndex: number) => void;
  includeWarmup: boolean;
  onToggleWarmup: () => void;
  cardioType: CardioType;
  onChangeCardioType: (type: CardioType) => void;
  cardioDuration: number;
  onChangeCardioDuration: (duration: number) => void;
  recoveryState?: Record<MuscleGroup, number>;
  onChangeTargetMuscles?: (muscles: MuscleGroup[]) => void;
  onToggleMaxEffort?: (exerciseIndex: number) => void;
  onUpdateExercise?: (exerciseIndex: number, updatedExercise: PlannedExercise) => void;
  equipmentPreference?: EquipmentPreference;
  onChangeEquipmentPreference?: (pref: EquipmentPreference) => void;
  availableMachines?: string[];
  onOpenMachinesModal?: () => void;
  spineSafeMode?: boolean;
  onToggleSpineSafeMode?: (enabled: boolean) => void;
  exercisePreferences?: Record<string, ExercisePreferenceStatus>;
  onTogglePreference?: (exerciseId: string, pref: ExercisePreferenceStatus) => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  workout,
  bodyProfile,
  onStartWorkout,
  onResumeWorkout,
  onCancelWorkout,
  isWorkingOut = false,
  onRegenerate,
  onSwapExercise,
  onMoveExercise,
  includeWarmup,
  onToggleWarmup,
  cardioType,
  onChangeCardioType,
  cardioDuration,
  onChangeCardioDuration,
  recoveryState,
  onChangeTargetMuscles,
  onToggleMaxEffort,
  onUpdateExercise,
  equipmentPreference = 'all',
  onChangeEquipmentPreference,
  availableMachines,
  onOpenMachinesModal,
  spineSafeMode = true,
  onToggleSpineSafeMode,
  exercisePreferences,
  onTogglePreference
}) => {
  const [activeCalcWeight, setActiveCalcWeight] = useState<number | null>(null);
  const [activeCableExercise, setActiveCableExercise] = useState<PlannedExercise | null>(null);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<PlannedExercise | null>(null);
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [showTargetMusclesModal, setShowTargetMusclesModal] = useState<boolean>(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Touch drag support for mobile devices
  const touchActiveIndexRef = useRef<number | null>(null);
  const exerciseCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchActiveIndexRef.current = index;
    setDraggedIndex(index);
    if ('vibrate' in navigator) {
      try { navigator.vibrate(25); } catch (_) {}
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchActiveIndexRef.current === null) return;
    const touch = e.touches[0];
    const clientY = touch.clientY;
    
    // Find exercise element directly under the touch point
    for (let i = 0; i < exerciseCardsRef.current.length; i++) {
      const el = exerciseCardsRef.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) {
          if (dragOverIndex !== i) {
            setDragOverIndex(i);
          }
          break;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    const fromIdx = touchActiveIndexRef.current;
    const toIdx = dragOverIndex;
    if (fromIdx !== null && toIdx !== null && fromIdx !== toIdx && onMoveExercise) {
      onMoveExercise(fromIdx, toIdx);
      if ('vibrate' in navigator) {
        try { navigator.vibrate([15, 30, 15]); } catch (_) {}
      }
    }
    touchActiveIndexRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleQuickAdjustWeight = (exerciseIndex: number, delta: number) => {
    if (!onUpdateExercise) return;
    const targetEx = workout.exercises[exerciseIndex];
    if (!targetEx) return;
    const currentW = targetEx.sets[0]?.targetWeight || 20;
    const newWeight = Math.max(0, Math.round((currentW + delta) * 10) / 10);
    const updatedSets = targetEx.sets.map(s => ({
      ...s,
      targetWeight: s.type === 'warmup' ? Math.max(0, Math.round(newWeight * 0.6)) : newWeight
    }));
    onUpdateExercise(exerciseIndex, {
      ...targetEx,
      sets: updatedSets
    });
  };

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  const handleRegenerateClick = () => {
    if (isWorkingOut) {
      if (!window.confirm('Sếp đang có buổi tập dở dang. Nếu đổi bài tập mới, tiến độ tập hiện tại sẽ bị hủy. Sếp có muốn tiếp tục?')) {
        return;
      }
    }
    onRegenerate();
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Today's Workout Summary Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-extrabold rounded-full tracking-wider uppercase">
              Gợi Ý Hôm Nay • Fitbod AI
            </span>
            {isWorkingOut && (
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ĐANG TẬP
              </span>
            )}
          </div>
          <button
            onClick={handleRegenerateClick}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 active:scale-95 transition"
            title="Đổi buổi tập khác"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <h1 className="text-xl font-black tracking-tight text-white mb-1">
          {workout.title}
        </h1>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <p className="text-xs text-slate-300">{workout.date}</p>
          {(workout.bodyProfile || bodyProfile) && (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-200 border border-blue-400/30 flex items-center gap-1">
              <span>👤 {(workout.bodyProfile || bodyProfile)?.weightKg}kg</span>
              <span>•</span>
              <span>
                {(workout.bodyProfile || bodyProfile)?.level === 'beginner' 
                  ? 'Mới tập (<1 năm)' 
                  : (workout.bodyProfile || bodyProfile)?.level === 'advanced' 
                    ? 'Nâng cao (1-3 năm)' 
                    : 'Chuyên sâu (3-5 năm)'}
              </span>
            </span>
          )}
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 mb-4 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Thời lượng</span>
            <span className="text-sm font-extrabold text-white">{workout.durationMinutes} phút</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bài tập</span>
            <span className="text-sm font-extrabold text-white">{workout.exercises.length} bài</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tổng số Sets</span>
            <span className="text-sm font-extrabold text-blue-400">{totalSets} sets</span>
          </div>
        </div>

        {/* Target Muscle Focus Button */}
        <button
          onClick={() => setShowTargetMusclesModal(true)}
          className="w-full py-2.5 px-3.5 bg-white/10 hover:bg-white/20 active:scale-[0.99] backdrop-blur-md rounded-2xl border border-white/15 mb-4 flex items-center justify-between text-left transition shadow-sm"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-blue-500/30 rounded-xl text-blue-300 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-blue-200 uppercase font-black tracking-wider block">
                Nhóm Cơ Mục Tiêu Hôm Nay
              </span>
              <span className="text-xs font-black text-white truncate block">
                {workout.targetMuscles && workout.targetMuscles.length > 0
                  ? workout.targetMuscles.map(m => MUSCLES_INFO[m]?.nameVi || m).join(' • ')
                  : 'Tự động theo lịch phân chia'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-xl border border-amber-300/30 shrink-0 ml-2">
            Đổi nhóm cơ &rarr;
          </span>
        </button>

        {/* Start or Resume Button */}
        {isWorkingOut ? (
          <div className="space-y-2">
            <button
              onClick={onResumeWorkout || onStartWorkout}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 transition"
            >
              <Play className="w-5 h-5 fill-current" />
              TIẾP TỤC BUỔI TẬP (VÀO LẠI PHÒNG TẬP)
            </button>
            {onCancelWorkout && (
              <div className="text-center pt-1">
                <button
                  onClick={onCancelWorkout}
                  className="text-[11px] text-slate-400 hover:text-rose-400 underline transition"
                >
                  Hủy buổi tập hiện tại để tạo buổi mới
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onStartWorkout}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/40 transition"
          >
            <Play className="w-5 h-5 fill-current" />
            BẮT ĐẦU BUỔI TẬP NGAY
          </button>
        )}
      </div>

      {/* Spine Safety & Herniated Disc Protection Card */}
      <div className={`rounded-3xl p-4 border transition duration-300 shadow-sm ${
        spineSafeMode
          ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 border-emerald-200'
          : 'bg-white border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl transition ${
              spineSafeMode ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}>
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Bảo Vệ Cột Sống (Thoát Vị Đĩa Đệm)
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                  spineSafeMode
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {spineSafeMode ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </span>
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5">
                {spineSafeMode
                  ? 'Đã loại trừ 13 bài nén dọc trục & lực cắt thắt lưng (Squat, Deadlift, Bent Row, OHP...)'
                  : 'Đang cho phép bài tập tự do (Squat, Deadlift...). Hãy cẩn thận nếu có tiền sử đau lưng.'}
              </p>
            </div>
          </div>
          {onToggleSpineSafeMode && (
            <button
              onClick={() => onToggleSpineSafeMode(!spineSafeMode)}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 transition duration-300 shrink-0 ml-2 ${
                spineSafeMode ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              title={spineSafeMode ? "Bấm để tắt chế độ bảo vệ cột sống" : "Bấm để bật chế độ bảo vệ cột sống"}
            >
              <div className="bg-white w-4.5 h-4.5 rounded-full shadow-md transform" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Config Card: Warmup & Cardio Finisher */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Tùy Chọn Khởi Động & Cardio
          </span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            Fitbod Custom
          </span>
        </div>

        {/* Warmup Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl transition ${includeWarmup ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Hiệp khởi động (Warm-up)</span>
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-black rounded">W</span>
              </div>
              <p className="text-[10px] text-slate-500">Tự động thêm 1-2 hiệp tạ nhẹ làm nóng cơ khớp trước bài chính</p>
            </div>
          </div>
          <button
            onClick={onToggleWarmup}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              includeWarmup ? 'bg-amber-500 justify-end' : 'bg-slate-200 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md transform" />
          </button>
        </div>

        {/* Cardio Finisher Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-bold text-slate-800">Cardio cuối buổi (Finisher)</span>
            </div>
            {cardioType !== 'none' && (
              <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {cardioDuration} phút
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {[
              { id: 'none', label: 'Không', icon: null },
              { id: 'bike', label: 'Đạp xe', icon: '🚴' },
              { id: 'treadmill', label: 'Đi bộ/Chạy', icon: '🏃' },
              { id: 'elliptical', label: 'Elliptical', icon: '🎿' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onChangeCardioType(item.id as any)}
                className={`py-2 px-1 rounded-2xl text-[11px] font-bold text-center border transition active:scale-95 ${
                  cardioType === item.id
                    ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.icon && <span className="block text-xs mb-0.5">{item.icon}</span>}
                <span className="truncate block">{item.label}</span>
              </button>
            ))}
          </div>

          {cardioType !== 'none' && (
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600 bg-orange-50/50 p-2 rounded-xl border border-orange-100">
              <span className="text-[10px] font-bold text-orange-800">Thời lượng cardio:</span>
              <div className="flex gap-1">
                {[10, 15, 20, 30].map(mins => (
                  <button
                    key={mins}
                    onClick={() => onChangeCardioDuration(mins)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition ${
                      cardioDuration === mins
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mins}p
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Equipment Preference Selector */}
        {onChangeEquipmentPreference && (
          <div className="pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">Ưu Tiên Thiết Bị</span>
              </div>
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {equipmentPreference === 'all' && '⚡ Cân bằng tất cả'}
                {equipmentPreference === 'dumbbell' && '🏋️‍♂️ Ưu tiên tạ đơn'}
                {equipmentPreference === 'barbell' && '🏋️ Ưu tiên tạ đòn'}
                {equipmentPreference === 'cable' && '⛓️ Ưu tiên kéo cáp'}
                {equipmentPreference === 'machine' && '⚙️ Ưu tiên máy khối'}
                {equipmentPreference === 'bodyweight' && '🤸 Ưu tiên bodyweight'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'all', label: 'Tất cả', icon: '⚡' },
                { id: 'dumbbell', label: 'Tạ đơn', icon: '🏋️‍♂️' },
                { id: 'barbell', label: 'Tạ đòn', icon: '🏋️' },
                { id: 'cable', label: 'Kéo cáp', icon: '⛓️' },
                { id: 'machine', label: 'Máy khối', icon: '⚙️' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => onChangeEquipmentPreference(item.id as any)}
                  className={`py-2 px-1 rounded-2xl text-[11px] font-bold text-center border transition active:scale-95 ${
                    equipmentPreference === item.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs mb-0.5">{item.icon}</span>
                  <span className="truncate block text-[10px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cỗ Máy Phòng Tập Quick Access */}
        {onOpenMachinesModal && (
          <div className="pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">⚙️</span>
                <span className="text-xs font-bold text-slate-800">Máy & Dàn Cáp Phòng Tập</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                (availableMachines?.length ?? 18) === 18
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {availableMachines?.length ?? 18}/18 máy sẵn sàng
              </span>
            </div>
            <button
              onClick={onOpenMachinesModal}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-50 to-indigo-50/70 hover:from-blue-100/70 hover:to-indigo-100/70 active:scale-[0.99] border border-blue-200/80 rounded-2xl flex items-center justify-between transition text-left shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  📷
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-900 block truncate">
                    {(availableMachines?.length ?? 18) === 18
                      ? 'Xem hình ảnh máy & tắt máy phòng không có'
                      : `Đang trừ ${18 - (availableMachines?.length ?? 18)} máy phòng tập không có`}
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold block">
                    Chạm để xem ảnh thật từng máy • AI tự trừ bài thiếu
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black text-blue-700 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shrink-0 ml-2 shadow-2xs">
                Xem máy &rarr;
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Exercises Section */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Danh Sách Bài Tập ({workout.exercises.length})
          </h3>
          <span className="text-[11px] text-blue-600 font-bold">Chạm vào bài để xem hoạt họa/video</span>
        </div>

        <div className="space-y-3">
          {workout.exercises.map((ex, idx) => {
            const firstSet = ex.sets[0];
            const catalogItem = EXERCISE_CATALOG.find(c => c.id === ex.exerciseId);
            const activeImages = (catalogItem?.images && catalogItem.images.length > 0) ? catalogItem.images : (ex.images || []);
            const hasThumbnail = activeImages.length > 0;
            const isFavorite = exercisePreferences?.[ex.exerciseId] === 'favorite';
            const isDraggingThis = draggedIndex === idx;
            const isOverThis = dragOverIndex === idx && draggedIndex !== idx;

            const handleOpenModal = () => {
              setSelectedExerciseForModal({
                ...ex,
                images: activeImages,
                videoUrl: catalogItem?.videoUrl || ex.videoUrl,
                videoEmbedId: catalogItem?.videoEmbedId || ex.videoEmbedId,
                muscleTarget: catalogItem?.muscleTarget || ex.muscleTarget,
                setup: catalogItem?.setup || ex.setup,
                execution: catalogItem?.execution || ex.execution,
                mistakes: catalogItem?.mistakes || ex.mistakes,
              });
            };

            return (
              <div
                key={ex.exerciseId}
                ref={(el) => (exerciseCardsRef.current[idx] = el)}
                draggable={Boolean(onMoveExercise)}
                onDragStart={(e) => {
                  setDraggedIndex(idx);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', String(idx));
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverIndex !== idx) setDragOverIndex(idx);
                }}
                onDragLeave={() => {
                  if (dragOverIndex === idx) setDragOverIndex(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIndex !== null && draggedIndex !== idx && onMoveExercise) {
                    onMoveExercise(draggedIndex, idx);
                  }
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`bg-white rounded-3xl p-4 border transition duration-200 ${
                  isDraggingThis 
                    ? 'opacity-50 scale-[0.98] border-blue-500 shadow-xl ring-2 ring-blue-400/40' 
                    : isOverThis 
                      ? 'border-blue-500 border-t-4 bg-blue-50/40 shadow-md' 
                      : 'border-slate-200/80 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* 1. Header Bar (Full width): Drag handle + Badge + Quick Actions */}
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                  {/* Left: Drag Handle + Badge Bài X • Tier Y + Ưu Tiên */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {onMoveExercise && (
                      <div
                        onTouchStart={(e) => handleTouchStart(e, idx)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="p-1 -ml-1 text-slate-400 hover:text-blue-600 active:text-blue-700 cursor-grab active:cursor-grabbing touch-none select-none rounded-lg hover:bg-slate-100 transition"
                        title="Chạm và kéo để đổi thứ tự bài tập"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                    )}

                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap">
                      Bài {idx + 1} • Tier {ex.tier}
                    </span>

                    {isFavorite && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black rounded-md whitespace-nowrap shadow-2xs">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                        <span>Ưu Tiên</span>
                      </span>
                    )}
                  </div>

                  {/* Right: Equipment calc & Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {ex.equipment === 'barbell' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCalcWeight(firstSet?.targetWeight || 60);
                        }}
                        className="p-1.5 bg-slate-50 text-slate-600 hover:text-blue-600 rounded-lg text-xs active:scale-95 transition"
                        title="Mở Plate Calculator"
                      >
                        <Dumbbell className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {ex.equipment === 'cable' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCableExercise(ex);
                        }}
                        className="p-1.5 bg-purple-50 text-purple-600 hover:text-purple-800 rounded-lg text-xs border border-purple-200 active:scale-95 transition"
                        title="Xem nấc cọc tạ cáp & tỷ lệ ròng rọc"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Nút Ưu Tiên ⭐ */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePreference?.(ex.exerciseId, isFavorite ? 'standard' : 'favorite');
                      }}
                      className={`p-1.5 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition border shadow-2xs ${
                        isFavorite
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-amber-50 hover:text-amber-600'
                      }`}
                      title={isFavorite ? "Đang ưu tiên bài này • Bấm để hủy" : "Bấm để AI luôn ưu tiên bài này (⭐)"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>

                    {/* Nút Chặn / Loại trừ 🚫 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Sếp có chắc chắn muốn loại trừ bài "${ex.exerciseName}" khỏi danh sách tập luyện không?`)) {
                          onTogglePreference?.(ex.exerciseId, 'exclude');
                          onSwapExercise(idx);
                        }
                      }}
                      className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition border border-slate-200 hover:border-rose-200 shadow-2xs"
                      title="Loại trừ 100% bài này khỏi các buổi tập (🚫)"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-500" />
                    </button>

                    {/* Nút Đổi bài */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSwapTargetIndex(idx);
                      }}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition border border-amber-200 shadow-2xs whitespace-nowrap"
                      title="Đổi bài tập khác cùng nhóm cơ"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-600" />
                      <span className="text-[11px]">Đổi bài</span>
                    </button>
                  </div>
                </div>

                {/* 2. Main Content Bar: Thumbnail + Title + Details */}
                <div className="flex items-start gap-3 mb-2">
                  {/* Thumbnail with quick view badge */}
                  <div 
                    onClick={handleOpenModal}
                    className="w-16 h-16 rounded-2xl bg-slate-900 overflow-hidden shrink-0 cursor-pointer relative group border border-slate-200/60 active:scale-95 transition"
                  >
                    {hasThumbnail ? (
                      <img
                        src={activeImages[0]}
                        alt={ex.exerciseName}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Dumbbell className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100">
                      <Eye className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </div>

                  {/* Exercise info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <h4 
                        onClick={handleOpenModal}
                        className="font-black text-slate-900 text-sm truncate cursor-pointer hover:text-blue-600 transition"
                      >
                        {ex.exerciseName}
                      </h4>

                      {onToggleMaxEffort && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMaxEffort(idx);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shrink-0 active:scale-95 transition border shadow-2xs whitespace-nowrap ${
                            ex.isMaxEffort
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                          title={ex.isMaxEffort ? "Đang là bài thử thách Max Effort hôm nay" : "Bấm để biến bài này thành bài thử thách Max Effort"}
                        >
                          <Flame className={`w-3 h-3 ${ex.isMaxEffort ? 'fill-white text-white' : 'text-amber-500'}`} />
                          <span>{ex.isMaxEffort ? 'Max Effort' : 'Thử thách'}</span>
                        </button>
                      )}
                    </div>

                    {ex.isMaxEffort && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-[9px] font-black rounded-md shadow-2xs mb-1">
                        <Flame className="w-2.5 h-2.5 fill-white text-white" />
                        <span>MAX EFFORT • HIỆP CUỐI AMRAP</span>
                      </div>
                    )}

                    {/* Badges: Spine safety, Muscle target */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isExerciseSpineSafe(ex.exerciseId) ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/90 shadow-2xs whitespace-nowrap">
                          <Shield className="w-2.5 h-2.5 text-emerald-600" />
                          <span>An toàn đĩa đệm</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-300 shadow-2xs whitespace-nowrap">
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                          <span>Nén cột sống</span>
                        </span>
                      )}

                      {ex.muscleTarget ? (
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal();
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 cursor-pointer hover:bg-rose-100 transition whitespace-nowrap"
                          title="Bấm để xem hình giải phẫu điểm phát lực và mẹo cảm nhận cơ"
                        >
                          <Target className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px]">{ex.muscleTarget.primaryHeadNameVi}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-blue-600 truncate">
                          {ex.primaryMuscles.join(', ')}
                        </span>
                      )}

                      <span className="text-slate-300">•</span>
                      {ex.equipment === 'cable' ? (
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCableExercise(ex);
                          }}
                          className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 cursor-pointer hover:bg-purple-100 whitespace-nowrap"
                          title="Bấm để chỉnh nấc cọc tạ cáp & tỷ lệ ròng rọc"
                        >
                          Cáp {ex.cableConfig?.pulleyRatio || '2:1'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium capitalize whitespace-nowrap">
                          {ex.equipment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sets & Video Button Row */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
                  {ex.isCardio ? (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 font-black rounded-lg text-[11px] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        Cardio: {ex.cardioMinutes || 15} phút
                      </span>
                      <span className="text-[11px] text-slate-400">Đốt calo cuối buổi</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingExerciseIndex(idx);
                            }}
                            className="font-bold text-slate-700 hover:text-blue-600 transition flex items-center gap-1 active:scale-95"
                            title="Chạm để chỉnh số hiệp & reps"
                          >
                            <span>
                              {ex.sets.length} sets {(() => {
                                const reps = ex.sets.map(s => s.targetReps);
                                const minR = Math.min(...reps);
                                const maxR = Math.max(...reps);
                                return minR === maxR ? `× ${minR} reps` : `(${minR}–${maxR} reps)`;
                              })()}
                            </span>
                          </button>

                          {ex.sets.some(s => s.type === 'warmup') && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-black rounded">
                              {ex.sets.filter(s => s.type === 'warmup').length}W
                            </span>
                          )}
                          {ex.isMaxEffort && (
                            <span className="px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black rounded flex items-center gap-0.5 shadow-2xs">
                              <Flame className="w-2.5 h-2.5 fill-white" />
                              AMRAP ({firstSet?.targetReps}+)
                            </span>
                          )}
                        </div>

                        {/* Weight Stepper & Quick Edit Button */}
                        <div className="flex items-center gap-1 bg-blue-50/90 p-0.5 rounded-xl border border-blue-200 shadow-2xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const step = ex.equipment === 'cable' ? 1.25 : (ex.equipment === 'dumbbell' ? 2 : 2.5);
                              handleQuickAdjustWeight(idx, -step);
                            }}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200/60 shadow-2xs active:scale-90 transition"
                            title="Giảm mức tạ đồng bộ"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingExerciseIndex(idx);
                            }}
                            className="px-2 py-0.5 text-blue-800 hover:text-blue-950 font-black text-xs flex items-center gap-1 active:scale-95 transition"
                            title="Chạm để gõ mức tạ hoặc chỉnh từng hiệp riêng biệt"
                          >
                            <span>
                              {(() => {
                                const weights = ex.sets.map(s => s.targetWeight);
                                const minW = Math.min(...weights);
                                const maxW = Math.max(...weights);
                                return minW === maxW ? `@${minW} kg` : `@${minW}–${maxW} kg`;
                              })()}
                            </span>
                            <Edit3 className="w-2.5 h-2.5 text-blue-500 opacity-70" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const step = ex.equipment === 'cable' ? 1.25 : (ex.equipment === 'dumbbell' ? 2 : 2.5);
                              handleQuickAdjustWeight(idx, step);
                            }}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200/60 shadow-2xs active:scale-90 transition"
                            title="Tăng mức tạ đồng bộ"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Individual Sets Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100/80">
                        {ex.sets.map((s, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingExerciseIndex(idx);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer hover:scale-105 active:scale-95 transition border flex items-center gap-1 shadow-2xs ${
                              s.type === 'warmup'
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : (s.type === 'amrap'
                                    ? 'bg-purple-50 text-purple-900 border-purple-300'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400')
                            }`}
                            title="Chạm để sửa hiệp này"
                          >
                            <span className="opacity-50 font-black">
                              {s.type === 'warmup' ? 'W' : (s.type === 'amrap' ? 'MAX' : `H${sIdx + 1}`)}:
                            </span>
                            <span className="font-black text-slate-900">{s.targetWeight}kg</span>
                            <span className="opacity-75">× {s.targetReps}{s.type === 'amrap' ? '+' : ''}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedExerciseForModal(ex)}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-xl transition"
                  >
                    <Video className="w-3 h-3" />
                    <span>Xem Hoạt Họa / Video</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plate Calculator Modal */}
      {activeCalcWeight !== null && (
        <PlateCalculatorModal
          initialWeight={activeCalcWeight}
          onClose={() => setActiveCalcWeight(null)}
        />
      )}

      {/* Exercise Detail & Video Animation Modal */}
      {selectedExerciseForModal !== null && (
        <ExerciseDetailModal
          exercise={selectedExerciseForModal}
          onClose={() => setSelectedExerciseForModal(null)}
        />
      )}

      {/* Cable Stack & Pulley Ratio Modal */}
      {activeCableExercise !== null && (
        <CableStackModal
          initialWeight={activeCableExercise.sets[0]?.targetWeight || 20}
          initialRatio={activeCableExercise.cableConfig?.pulleyRatio || '2:1'}
          exerciseName={activeCableExercise.exerciseName}
          onApply={(newWeight, ratio) => {
            activeCableExercise.sets.forEach(s => {
              s.targetWeight = newWeight;
              s.cableRatio = ratio;
            });
            if (activeCableExercise.cableConfig) {
              activeCableExercise.cableConfig.pulleyRatio = ratio;
            }
            setActiveCableExercise(null);
          }}
          onClose={() => setActiveCableExercise(null)}
        />
      )}

      {/* Substitute / Swap Exercise Modal */}
      {swapTargetIndex !== null && workout.exercises[swapTargetIndex] && (
        <SwapExerciseModal
          currentExercise={workout.exercises[swapTargetIndex]}
          excludedExerciseIds={workout.excludedExerciseIds}
          spineSafeMode={spineSafeMode}
          exercisePreferences={exercisePreferences}
          onTogglePreference={onTogglePreference}
          onSelectAlternative={(newEx) => {
            onSwapExercise(swapTargetIndex, newEx);
            setSwapTargetIndex(null);
          }}
          onClose={() => setSwapTargetIndex(null)}
        />
      )}

      {/* Target Muscles Customization Modal */}
      {showTargetMusclesModal && onChangeTargetMuscles && (
        <TargetMusclesModal
          currentMuscles={workout.targetMuscles}
          recoveryState={recoveryState || {} as any}
          onApply={(selectedMuscles) => {
            onChangeTargetMuscles(selectedMuscles);
            setShowTargetMusclesModal(false);
          }}
          onClose={() => setShowTargetMusclesModal(false)}
        />
      )}

      {/* Edit Exercise Weight, Reps & Sets Modal */}
      {editingExerciseIndex !== null && workout.exercises[editingExerciseIndex] && (
        <EditExerciseModal
          exercise={workout.exercises[editingExerciseIndex]}
          onSave={(updated) => {
            if (onUpdateExercise) {
              onUpdateExercise(editingExerciseIndex, updated);
            }
            setEditingExerciseIndex(null);
          }}
          onClose={() => setEditingExerciseIndex(null)}
        />
      )}
    </div>
  );
};

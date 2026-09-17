import React from 'react';
import { 
  X, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  CheckCircle2, 
  Clock, 
  ListOrdered, 
  Dumbbell,
  RefreshCw
} from 'lucide-react';
import { PlannedExercise } from '../types';

interface WorkoutQueueModalProps {
  exercises: PlannedExercise[];
  currentIndex: number;
  onClose: () => void;
  onMoveExercise: (fromIndex: number, toIndex: number) => void;
  onJumpToExercise: (index: number) => void;
}

export const WorkoutQueueModal: React.FC<WorkoutQueueModalProps> = ({
  exercises,
  currentIndex,
  onClose,
  onMoveExercise,
  onJumpToExercise
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))] pb-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Lịch Trình & Thứ Tự Bài Tập
              </h3>
              <p className="text-xs text-slate-500">
                Thay đổi vị trí nếu máy phòng gym đang có người dùng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exercises Queue List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {exercises.map((ex, idx) => {
            const isCurrent = idx === currentIndex;
            const isCompleted = ex.sets.every(s => s.isCompleted);
            const completedCount = ex.sets.filter(s => s.isCompleted).length;

            return (
              <div
                key={`${ex.exerciseId}-${idx}`}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                    : (isCompleted 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm')
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Position Number / Status Icon */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-300">
                          {idx + 1}
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">
                          {ex.exerciseName}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md animate-pulse">
                            ĐANG TẬP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {completedCount}/{ex.sets.length} sets • {ex.sets[0]?.targetWeight}kg × {ex.sets[0]?.targetReps} reps • {ex.equipment}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Move Up / Down & Jump */}
                  <div className="flex items-center gap-1.5 ml-2">
                    {/* Jump to Exercise */}
                    {!isCurrent && (
                      <button
                        onClick={() => {
                          onJumpToExercise(idx);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-bold active:scale-95 transition"
                        title="Chuyển sang tập bài này ngay"
                      >
                        Tập ngay
                      </button>
                    )}

                    {/* Move Up Button */}
                    <button
                      disabled={idx === 0}
                      onClick={() => onMoveExercise(idx, idx - 1)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl disabled:opacity-30 active:scale-95 transition"
                      title="Đẩy lên trước"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down Button */}
                    <button
                      disabled={idx === exercises.length - 1}
                      onClick={() => onMoveExercise(idx, idx + 1)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl disabled:opacity-30 active:scale-95 transition"
                      title="Đẩy xuống sau"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Close Button */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0 pb-[max(16px,env(safe-area-inset-bottom))]">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md active:scale-[0.99] transition"
          >
            Đóng & Tiếp Tục Tập
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { Trophy, Flame, Sparkles, Check, ArrowUpRight, Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MaxEffortCelebrationModalProps {
  exerciseName: string;
  weight: number;
  reps: number;
  targetReps: number;
  newE1RM: number;
  onClose: () => void;
}

export const MaxEffortCelebrationModal: React.FC<MaxEffortCelebrationModalProps> = ({
  exerciseName,
  weight,
  reps,
  targetReps,
  newE1RM,
  onClose
}) => {
  useEffect(() => {
    // Fire celebratory confetti bursts
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const extraReps = reps - targetReps;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in zoom-in-95 duration-200 text-center">
        
        {/* Banner Hero */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Trophy className="w-9 h-9 text-amber-200 fill-amber-300 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 backdrop-blur rounded-full text-[11px] font-black uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>PHÁ ĐỈNH MAX EFFORT THÀNH CÔNG!</span>
          </div>

          <h3 className="text-xl font-black text-white mt-1 leading-tight">
            {exerciseName}
          </h3>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200/80">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
              Kết Quả Hiệp Hết Sức (AMRAP)
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {reps} reps
              </span>
              <span className="text-sm font-bold text-slate-400">@</span>
              <span className="text-2xl font-black text-blue-600 font-mono">
                {weight} kg
              </span>
            </div>
            {extraReps > 0 && (
              <span className="inline-block text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-1.5">
                🔥 Vượt mục tiêu +{extraReps} reps!
              </span>
            )}
          </div>

          {/* New Estimated 1RM Stat */}
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">1RM Ước Tính Mới</span>
              <span className="text-lg font-black text-slate-900 font-mono">{newE1RM} kg</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Tiến Trình Buổi Tới</span>
              <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                Tăng mức tạ
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
            💡 <b>Thuật toán Fitbod:</b> Hệ thống đã ghi nhận sức mạnh bứt phá của Sếp và sẽ tự động nâng mức tạ làm việc trong buổi tập kế tiếp!
          </p>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-500/30 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            TIẾP TỤC BUỔI TẬP ĐỈNH CAO
          </button>
        </div>

      </div>
    </div>
  );
};

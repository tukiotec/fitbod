import React, { useState } from 'react';
import { Play, Minimize2, Bell, Smartphone, ShieldCheck, Download, Vibrate, Volume1, Volume2 } from 'lucide-react';
import { 
  requestNotificationPermission, 
  isStandalonePWA, 
  getRestAlertMode, 
  setRestAlertMode, 
  triggerDeviceVibration,
  RestAlertMode 
} from '../utils/backgroundTimer';

interface RestTimerOverlayProps {
  remainingSeconds: number;
  totalDurationSeconds: number;
  nextSetInfo: {
    exerciseName: string;
    setIndex: number;
    totalSets: number;
    weight: number;
    reps: number;
    isNextExercise?: boolean;
  } | null;
  onAdjustTime: (deltaSeconds: number) => void;
  onClose: () => void;
  onSkip: () => void;
  onOpenPwaGuide?: () => void;
}

export const RestTimerOverlay: React.FC<RestTimerOverlayProps> = ({
  remainingSeconds,
  totalDurationSeconds,
  nextSetInfo,
  onAdjustTime,
  onClose,
  onSkip,
  onOpenPwaGuide
}) => {
  const [hasNotification, setHasNotification] = useState<boolean>(() => {
    return 'Notification' in window && Notification.permission === 'granted';
  });
  const [alertMode, setAlertModeState] = useState<RestAlertMode>(() => getRestAlertMode());
  const isPWA = isStandalonePWA();

  const handleEnableNotification = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      setHasNotification(true);
      triggerDeviceVibration();
    } else if (onOpenPwaGuide) {
      onOpenPwaGuide();
    }
  };

  const handleChangeAlertMode = (mode: RestAlertMode) => {
    setAlertModeState(mode);
    setRestAlertMode(mode);
    triggerDeviceVibration();
  };

  // Format mm:ss
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  // Circular gauge progress based on single source of truth
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(1, totalDurationSeconds);
  const progressRatio = Math.max(0, Math.min(1, remainingSeconds / total));
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="fixed inset-0 z-[110] flex flex-col justify-between bg-white/98 backdrop-blur-2xl text-slate-900 p-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Controls Bar */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black tracking-widest uppercase text-slate-500">
              Thời Gian Nghỉ Hồi Phục
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl active:scale-95 transition text-xs font-bold border border-slate-200 shadow-xs"
            title="Thu nhỏ đồng hồ"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Thu nhỏ</span>
          </button>
        </div>

        {/* Lock Screen & Hardware Mode Status Badge */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/90 px-3.5 py-2 rounded-2xl text-[11px] shadow-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="leading-tight">
              <span className="font-bold text-slate-900 block">
                {alertMode === 'vibrate' ? '📳 Chế độ Rung Im Lặng' : (alertMode === 'soft' ? '🔔 Chuông Êm Dịu' : '📢 Chuông To')}
              </span>
              <span className="text-[10px] text-slate-500">
                {alertMode === 'vibrate' ? 'Khóa máy vẫn rung • Không tiếng ồn' : 'Khóa máy vẫn đếm & phát chuông'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {hasNotification ? (
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ĐÃ BẬT BÁO
              </span>
            ) : isPWA ? (
              <button
                onClick={handleEnableNotification}
                className="flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-100/80 hover:bg-blue-200 px-2.5 py-1 rounded-full border border-blue-300 active:scale-95 transition animate-pulse"
              >
                <Bell className="w-3.5 h-3.5 text-blue-600" />
                BẬT THÔNG BÁO
              </button>
            ) : (
              <button
                onClick={onOpenPwaGuide || handleEnableNotification}
                className="flex items-center gap-1 text-[10px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200 active:scale-95 transition"
                title="Cài đặt vào màn hình chính iPhone để nhận rung và thông báo màn hình khóa"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                CÀI APP MH CHÍNH
              </button>
            )}
          </div>
        </div>

        {/* 3-Mode Alert Selector (Rung Im Lặng vs Chuông) */}
        <div className="flex items-center justify-between p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner">
          <button
            onClick={() => handleChangeAlertMode('vibrate')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition active:scale-95 ${
              alertMode === 'vibrate'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Vibrate className="w-3.5 h-3.5 text-blue-600" />
            <span>Chỉ Rung (Im lặng)</span>
          </button>

          <button
            onClick={() => handleChangeAlertMode('soft')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition active:scale-95 ${
              alertMode === 'soft'
                ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Volume1 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chuông êm</span>
          </button>

          <button
            onClick={() => handleChangeAlertMode('loud')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition active:scale-95 ${
              alertMode === 'loud'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Chuông to</span>
          </button>
        </div>
      </div>

      {/* Big Circular Countdown Display */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div className="relative w-60 h-60 flex items-center justify-center">
          
          {/* Background SVG Gauge */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="14"
              fill="none"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="url(#restTimerGradient)"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="restTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Clock numbers inside */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-black tracking-tighter text-slate-900 font-mono drop-shadow-xs">
              {timeFormatted}
            </span>
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1">
              {remainingSeconds <= 5 
                ? (alertMode === 'vibrate' ? '📳 CHUẨN BỊ RUNG VÀO HIỆP!' : '🔔 SẴN SÀNG VÀO HIỆP!') 
                : 'Đang hồi phục năng lượng'}
            </span>
          </div>
        </div>

        {/* Quick Adjustment Steppers */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => onAdjustTime(-15)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-xs font-bold active:scale-95 transition text-slate-700 shadow-xs"
          >
            -15s
          </button>
          <button
            onClick={() => onAdjustTime(30)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black active:scale-95 transition shadow-md shadow-blue-500/20"
          >
            +30s
          </button>
          <button
            onClick={() => onAdjustTime(60)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-xs font-bold active:scale-95 transition text-slate-700 shadow-xs"
          >
            +60s
          </button>
        </div>
      </div>

      {/* Next Up Preview Card */}
      <div className="space-y-3 pb-2">
        {nextSetInfo ? (
          <div className="bg-slate-50 border border-slate-200/90 p-4 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md border border-blue-200">
                {nextSetInfo.isNextExercise ? 'BÀI TIẾP THEO' : 'HIỆP TIẾP THEO'}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                Set {nextSetInfo.setIndex} / {nextSetInfo.totalSets}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h4 className="font-black text-slate-900 text-base leading-tight truncate">
                  {nextSetInfo.exerciseName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Mục tiêu tải trọng hiệp tiếp:
                </p>
              </div>

              <div className="text-right bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs shrink-0">
                <span className="text-lg font-black text-blue-600">
                  {nextSetInfo.weight} <span className="text-xs text-slate-500 font-bold">kg</span>
                </span>
                <span className="text-slate-600 text-xs block font-bold">
                  × {nextSetInfo.reps} reps
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl text-center text-xs text-slate-500 font-bold">
            🎉 Đây là hiệp tập cuối cùng của buổi tập!
          </div>
        )}

        {/* Big Action Button */}
        <button
          onClick={onSkip}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition"
        >
          <Play className="w-4 h-4 fill-current" />
          {nextSetInfo?.isNextExercise ? 'SẴN SÀNG QUA BÀI TIẾP THEO' : 'TẬP TIẾP LUÔN (BỎ QUA NGHỈ)'}
        </button>
      </div>
    </div>
  );
};

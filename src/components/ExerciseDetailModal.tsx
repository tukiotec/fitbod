import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Play, Image as ImageIcon, Video, AlertTriangle, CheckCircle, 
  Dumbbell, Flame, Target, Sparkles, Film, ExternalLink, Star, Ban,
  Calendar, Trophy, History, TrendingUp, Award, Clock
} from 'lucide-react';
import { PlannedExercise } from '../types';
import { AnatomyDiagram } from './AnatomyDiagram';
import { 
  EXERCISE_CATALOG, 
  getExercisePreferences, 
  setExercisePreference, 
  subscribeExercisePreferences, 
  ExercisePreferenceStatus 
} from '../data/exerciseCatalog';
import { getExerciseHistorySessions } from '../data/defaultWorkoutHistory';
import { getProfileItem } from '../utils/profileStorage';
import { FitbodRawLogEntry } from '../engine/fitbodEngine';

interface ExerciseDetailModalProps {
  exercise: PlannedExercise;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose
}) => {
  // Quản lý tab chính: Hướng dẫn kỹ thuật ('guide') vs Lịch sử tập ('history')
  const [mainTab, setMainTab] = useState<'guide' | 'history'>('guide');

  // Luôn nạp thông tin từ EXERCISE_CATALOG để bài tập từ session cũ vẫn có đầy đủ videoUrl & ảnh chuẩn 100%
  const catalogItem = EXERCISE_CATALOG.find(c => c.id === exercise.exerciseId);
  const activeVideoUrl = catalogItem?.videoUrl || exercise.videoUrl;
  const activeVideoEmbedId = catalogItem?.videoEmbedId || exercise.videoEmbedId;
  const activeVideoQuery = (catalogItem as any)?.videoQuery || `${exercise.exerciseName} form guide`;
  const activeImages = (catalogItem?.images && catalogItem.images.length > 0) ? catalogItem.images : (exercise.images || []);
  const activeMuscleTarget = catalogItem?.muscleTarget || exercise.muscleTarget;
  const activeSetup = catalogItem?.setup || exercise.setup;
  const activeExecution = catalogItem?.execution || exercise.execution;
  const activeMistakes = catalogItem?.mistakes || exercise.mistakes;

  // Lấy toàn bộ lịch sử tập luyện và PRs của bài tập này từ dữ liệu 382 buổi tập
  const historyData = useMemo(() => {
    let logsOverride: FitbodRawLogEntry[] | undefined;
    try {
      const rawCache = getProfileItem('fitbod_stats_cache');
      if (rawCache) {
        const parsed = JSON.parse(rawCache);
        if (parsed && Array.isArray(parsed.rawLogs)) {
          logsOverride = parsed.rawLogs;
        }
      }
    } catch (e) {}

    return getExerciseHistorySessions(exercise.exerciseId, exercise.exerciseName, logsOverride);
  }, [exercise.exerciseId, exercise.exerciseName]);

  // Quản lý trạng thái Ưu tiên (Favorite ⭐) / Loại trừ (Exclude 🚫)
  const [prefStatus, setPrefStatus] = useState<ExercisePreferenceStatus>(() => {
    return getExercisePreferences()[exercise.exerciseId] || 'standard';
  });

  useEffect(() => {
    return subscribeExercisePreferences(() => {
      setPrefStatus(getExercisePreferences()[exercise.exerciseId] || 'standard');
    });
  }, [exercise.exerciseId]);

  const handleToggleFavorite = () => {
    const next: ExercisePreferenceStatus = prefStatus === 'favorite' ? 'standard' : 'favorite';
    setExercisePreference(exercise.exerciseId, next);
    setPrefStatus(next);
  };

  const handleToggleExclude = () => {
    const next: ExercisePreferenceStatus = prefStatus === 'exclude' ? 'standard' : 'exclude';
    setExercisePreference(exercise.exerciseId, next);
    setPrefStatus(next);
  };

  const hasLoopVideo = !!activeVideoUrl;
  const hasYoutube = !!activeVideoEmbedId;
  const hasImages = activeImages.length > 0;

  // Media Tab: 'loop' | 'youtube' | 'anatomy' | 'animation'
  const [activeMediaTab, setActiveMediaTab] = useState<'loop' | 'youtube' | 'anatomy' | 'animation'>(() => {
    if (hasLoopVideo) return 'loop';
    if (hasYoutube) return 'youtube';
    if (hasImages) return 'animation';
    return 'anatomy';
  });

  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [youtubeError, setYoutubeError] = useState<boolean>(false);
  const [fallbackToast, setFallbackToast] = useState<string | null>(null);

  // Reset states khi đổi bài tập
  useEffect(() => {
    setYoutubeError(false);
    setFallbackToast(null);
  }, [exercise.exerciseId, activeVideoEmbedId]);

  const handleYoutubeError = () => {
    setYoutubeError(true);
    if (hasLoopVideo) {
      setFallbackToast('Video YouTube hạn chế nhúng • Đã chuyển sang Video Loop 1080p');
      setActiveMediaTab('loop');
    } else if (hasImages) {
      setFallbackToast('Video YouTube hạn chế nhúng • Đã chuyển sang Ảnh động 2 thì');
      setActiveMediaTab('animation');
    } else {
      setFallbackToast('Video YouTube hạn chế nhúng • Đã chuyển sang Sơ đồ giải phẫu');
      setActiveMediaTab('anatomy');
    }
  };

  // Lắng nghe thông điệp onError từ YouTube IFrame Player API (postMessage enablejsapi=1)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (data && (data.event === 'onError' || (data.info && typeof data.info === 'number' && data.event?.includes('Error')))) {
          handleYoutubeError();
        }
      } catch (_) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [hasLoopVideo, hasImages]);

  // Auto-looping 2 pha tĩnh (Setup vs Lockout)
  useEffect(() => {
    if (activeMediaTab !== 'animation' || activeImages.length < 2) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev === 0 ? 1 : 0));
    }, 1200);

    return () => clearInterval(interval);
  }, [activeMediaTab, activeImages]);

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[86dvh] sm:max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))] pb-4 border-b border-slate-100 bg-white shrink-0">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight truncate">
                {exercise.exerciseName}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 mt-1">
              <span>Tier {exercise.tier} • {exercise.equipment.toUpperCase()}</span>
              {activeMuscleTarget && (
                <span className="font-bold text-rose-600">• {activeMuscleTarget.primaryHeadNameVi}</span>
              )}
              {prefStatus === 'favorite' && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-300">
                  ⭐ Ưu tiên
                </span>
              )}
              {prefStatus === 'exclude' && (
                <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300">
                  🚫 Đã loại trừ
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Favorite ⭐, Exclude 🚫, Close X */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleFavorite}
              title={prefStatus === 'favorite' ? "Hủy ưu tiên bài này" : "Ưu tiên bài này trong các buổi tập (Favorite)"}
              className={`p-2 rounded-xl text-xs font-bold border transition active:scale-95 ${
                prefStatus === 'favorite'
                  ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
              }`}
            >
              <Star className={`w-4 h-4 ${prefStatus === 'favorite' ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleToggleExclude}
              title={prefStatus === 'exclude' ? "Bỏ loại trừ (cho phép tập lại)" : "Loại trừ bài này khỏi lịch tập (Exclude)"}
              className={`p-2 rounded-xl text-xs font-bold border transition active:scale-95 ${
                prefStatus === 'exclude'
                  ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <Ban className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 active:scale-95 ml-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Tab Switcher: Kỹ Thuật (Form & Video) vs Lịch Sử Tập & PRs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2 shrink-0">
          <button
            onClick={() => setMainTab('guide')}
            className={`flex-1 py-2.5 text-xs font-black border-b-2 transition flex items-center justify-center gap-1.5 ${
              mainTab === 'guide'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Kỹ Thuật & Video</span>
          </button>
          <button
            onClick={() => setMainTab('history')}
            className={`flex-1 py-2.5 text-xs font-black border-b-2 transition flex items-center justify-center gap-1.5 relative ${
              mainTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch Sử Tập & PRs</span>
            {historyData.summary && historyData.summary.totalSets > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                {historyData.summary.totalSets}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {mainTab === 'guide' ? (
            <>
              {/* Media Player Box (Loop Video vs YouTube HD vs Anatomy vs 2-Frame Images) */}
              <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-inner border border-slate-800 relative">
            
            {/* Media Selector Pill */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
              {hasLoopVideo && (
                <button
                  onClick={() => setActiveMediaTab('loop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeMediaTab === 'loop' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-blue-300" />
                  <span>Loop 1080p</span>
                </button>
              )}
              {hasYoutube && (
                <button
                  onClick={() => setActiveMediaTab('youtube')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeMediaTab === 'youtube' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-red-300" />
                  <span>YouTube Form</span>
                </button>
              )}
              <button
                onClick={() => setActiveMediaTab('anatomy')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  activeMediaTab === 'anatomy' 
                    ? 'bg-rose-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Giải Phẫu</span>
              </button>
              {hasImages && (
                <button
                  onClick={() => setActiveMediaTab('animation')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    activeMediaTab === 'animation' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Ảnh 2 pha</span>
                </button>
              )}
            </div>

            {/* Fallback notification toast if YouTube was auto-fallback */}
            {fallbackToast && (
              <div className="absolute top-14 left-3 right-3 z-20 bg-amber-500/95 backdrop-blur-md text-slate-950 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-between shadow-lg border border-amber-400 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-1.5 truncate mr-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                  <span className="truncate">{fallbackToast}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoEmbedId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[10px] font-black hover:text-black flex items-center gap-0.5 bg-black/10 px-1.5 py-0.5 rounded"
                  >
                    Mở YouTube ↗
                  </a>
                  <button
                    onClick={() => setFallbackToast(null)}
                    className="p-0.5 hover:bg-black/10 rounded text-slate-950"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Indicator Badge when on Loop Video */}
            {activeMediaTab === 'loop' && (
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-blue-300 border border-blue-500/20 pointer-events-none">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Fitbod Loop 1080p • Tự Lặp</span>
              </div>
            )}

            {/* Frame Indicator when on 2-Phase Images */}
            {activeMediaTab === 'animation' && hasImages && activeImages.length > 1 && (
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
                <span className={`w-2 h-2 rounded-full ${currentFrame === 0 ? 'bg-blue-500' : 'bg-slate-500'}`} />
                <span>{currentFrame === 0 ? 'Pha 1: Chuẩn bị' : 'Pha 2: Phát lực'}</span>
              </div>
            )}

            {/* 1. Loop Video Tab Content (Fitbod Style: 1080p 60fps autoPlay loop) */}
            {activeMediaTab === 'loop' && hasLoopVideo && (
              <div className="w-full h-72 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {isVideoLoading && !videoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 z-10">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-bold text-slate-300">Đang tải video form 1080p...</span>
                  </div>
                )}
                {videoError ? (
                  <div className="text-center p-6 text-slate-400">
                    <Dumbbell className="w-12 h-12 mx-auto mb-2 text-slate-500" />
                    <p className="text-xs text-slate-300 font-bold mb-2">Luồng MP4 trực tiếp gián đoạn</p>
                    {hasYoutube ? (
                      <button
                        onClick={() => setActiveMediaTab('youtube')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow"
                      >
                        Chuyển sang xem YouTube Form HD ↗
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveMediaTab('animation')}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                      >
                        Chuyển sang xem ảnh kỹ thuật
                      </button>
                    )}
                  </div>
                ) : (
                  <video
                    key={activeVideoUrl}
                    className="w-full h-full object-contain"
                    src={activeVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    preload="auto"
                    onLoadedData={() => setIsVideoLoading(false)}
                    onError={() => {
                      setIsVideoLoading(false);
                      setVideoError(true);
                      if (hasYoutube && !youtubeError) {
                        setActiveMediaTab('youtube');
                      } else if (hasImages) {
                        setActiveMediaTab('animation');
                      }
                    }}
                  />
                )}
              </div>
            )}

            {/* 2. YouTube Form Embed Content */}
            {activeMediaTab === 'youtube' && hasYoutube && (
              <div className="w-full h-72 bg-black flex items-center justify-center relative overflow-hidden">
                {youtubeError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-white animate-in fade-in duration-200">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-2.5">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h4 className="text-sm font-extrabold text-white mb-1">
                      Video YouTube Giới Hạn Quyền Nhúng
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs mb-3.5 leading-relaxed">
                      Tác giả video cài đặt hạn chế phát trực tiếp trong ứng dụng. Sếp có thể bấm mở trực tiếp trên YouTube app hoặc xem mô phỏng bên dưới.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <a
                        href={`https://www.youtube.com/watch?v=${activeVideoEmbedId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-900/30 active:scale-95"
                      >
                        <Video className="w-4 h-4" />
                        <span>Mở Trên YouTube App ↗</span>
                      </a>
                      {hasLoopVideo && (
                        <button
                          onClick={() => setActiveMediaTab('loop')}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                        >
                          <Film className="w-4 h-4 text-blue-400" />
                          <span>Video Loop 1080p</span>
                        </button>
                      )}
                      {hasImages && (
                        <button
                          onClick={() => setActiveMediaTab('animation')}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                        >
                          <ImageIcon className="w-4 h-4 text-indigo-400" />
                          <span>Ảnh Động 2 Pha</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <iframe
                      className="w-full h-full border-0"
                      src={`https://www.youtube.com/embed/${activeVideoEmbedId}?autoplay=1&mute=1&loop=1&playlist=${activeVideoEmbedId}&playsinline=1&controls=1&rel=0&enablejsapi=1`}
                      title={exercise.exerciseName}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={handleYoutubeError}
                    />
                    <div className="absolute top-2.5 right-2.5 z-10 pointer-events-auto">
                      <a
                        href={`https://www.youtube.com/watch?v=${activeVideoEmbedId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-black/75 hover:bg-red-600 backdrop-blur-md text-white rounded-xl text-[10px] font-black border border-white/20 shadow-md transition active:scale-95"
                        title="Mở trực tiếp trên ứng dụng YouTube"
                      >
                        <Video className="w-3 h-3 text-red-400" />
                        <span>Mở YouTube App ↗</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 3. Anatomy Tab Content */}
            {activeMediaTab === 'anatomy' && (
              <div className="w-full min-h-72 bg-white p-2">
                <AnatomyDiagram muscleTarget={activeMuscleTarget} exerciseName={exercise.exerciseName} />
              </div>
            )}

            {/* 4. 2-Phase Technical Images Content */}
            {activeMediaTab === 'animation' && (
              <div 
                className="w-full h-72 bg-slate-900 flex items-center justify-center cursor-pointer relative"
                onClick={() => setCurrentFrame(prev => (prev === 0 ? 1 : 0))}
              >
                {hasImages ? (
                  <img
                    src={activeImages[currentFrame]}
                    alt={exercise.exerciseName}
                    className="w-full h-full object-contain p-2 transition-opacity duration-300"
                  />
                ) : (
                  <div className="text-center text-slate-500">
                    <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">Đang tải hình ảnh bài tập...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Muscle Engagement & Mind-Muscle Connection Highlights */}
          {activeMuscleTarget ? (
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-rose-700 font-extrabold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Điểm Phát Lực Mục Tiêu</span>
                </div>
                <button
                  onClick={() => setActiveMediaTab('anatomy')}
                  className="text-[11px] font-bold text-rose-600 underline hover:text-rose-800"
                >
                  Xem hình giải phẫu &rarr;
                </button>
              </div>
              <p className="text-sm font-black text-slate-900 mb-1">
                {activeMuscleTarget.primaryHeadNameVi}
              </p>
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-rose-100">
                💡 <span className="font-bold">Mẹo cảm nhận:</span> {activeMuscleTarget.mindMuscleCue}
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Nhóm Cơ Chịu Tải Chính
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {exercise.primaryMuscles.map((m, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold rounded-xl flex items-center gap-1"
                  >
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {m}
                  </span>
                ))}
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-xl capitalize">
                  Thiết bị: {exercise.equipment}
                </span>
              </div>
            </div>
          )}

          {/* Step-by-Step Form Instructions */}
          <div className="space-y-3">
            {activeSetup && (
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-1 text-blue-600 font-extrabold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  1. Tư Thế Bắt Đầu (Setup)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeSetup}
                </p>
              </div>
            )}

            {activeExecution && (
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-1 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  2. Động Tác Thực Hiện (Execution)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeExecution}
                </p>
              </div>
            )}

            {activeMistakes && (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                <div className="flex items-center gap-2 mb-1 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  3. Lỗi Sai Cần Tránh
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {activeMistakes}
                </p>
              </div>
            )}

            {/* Safe external YouTube link */}
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeVideoQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-bold text-red-600 bg-red-50/80 hover:bg-red-100 rounded-2xl border border-red-200 transition active:scale-[0.99]"
            >
              <Video className="w-4 h-4 text-red-600 shrink-0" />
              <span>Xem phân tích chuyên sâu trên YouTube ↗</span>
            </a>
          </div>
            </>
          ) : (
            /* Tab Lịch Sử Tập Luyện & PRs Cá Nhân của Sếp */
            <div className="space-y-4">
              {!historyData.summary || historyData.sessions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">
                  <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Chưa có lịch sử tập cho bài này</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Khi Sếp hoàn thành bài tập này trong bất kỳ buổi tập nào, các hiệp tập sẽ tự động được lưu và hiển thị chi tiết tại đây.
                  </p>
                </div>
              ) : (
                <>
                  {/* Thống kê PRs & Thành tích */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-3xl border border-blue-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>Kỷ Lục Cá Nhân (Personal Records)</span>
                      </div>
                      {historyData.summary.lastDate && (
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Gần nhất: {historyData.summary.lastDate}
                        </span>
                      )}
                    </div>

                    {(() => {
                      const isAssisted = !!(historyData.summary.isAssisted || 
                        exercise.exerciseName.toLowerCase().includes('assisted') || 
                        exercise.exerciseId.toLowerCase().includes('assisted'));

                      return (
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="bg-white/90 p-3 rounded-2xl border border-blue-100 shadow-xs">
                            <div className="text-[11px] font-bold text-slate-500 mb-0.5">
                              {isAssisted ? 'Trợ Lực Ít Nhất (PR)' : 'Tạ Nặng Nhất (Max Weight)'}
                            </div>
                            <div className="text-xl font-black text-blue-700">
                              {isAssisted
                                ? `-${Math.abs(historyData.summary.maxWeight)} kg`
                                : (historyData.summary.maxWeight > 0 ? `${historyData.summary.maxWeight} kg` : 'Bodyweight')}
                            </div>
                          </div>

                          <div className="bg-white/90 p-3 rounded-2xl border border-blue-100 shadow-xs">
                            <div className="text-[11px] font-bold text-slate-500 mb-0.5">Ước Tính 1RM (Est. 1RM)</div>
                            <div className="text-xl font-black text-emerald-600">
                              {historyData.summary.maxE1RM > 0 ? `${historyData.summary.maxE1RM} kg` : 'N/A'}
                            </div>
                          </div>

                          <div className="bg-white/90 p-3 rounded-2xl border border-blue-100 shadow-xs">
                            <div className="text-[11px] font-bold text-slate-500 mb-0.5">Set Đỉnh Nhất (Best Set)</div>
                            <div className="text-xs font-black text-purple-700 truncate" title={historyData.summary.bestSet}>
                              {historyData.summary.bestSet || 'Chưa có'}
                            </div>
                          </div>

                          <div className="bg-white/90 p-3 rounded-2xl border border-blue-100 shadow-xs">
                            <div className="text-[11px] font-bold text-slate-500 mb-0.5">Tần Suất Tập Luyện</div>
                            <div className="text-xs font-black text-slate-800">
                              {historyData.summary.totalSessions} buổi • {historyData.summary.totalSets} hiệp
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Danh sách từng buổi tập trong quá khứ */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        Lịch Sử Từng Buổi ({historyData.sessions.length} Buổi)
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        Mới nhất xếp trước
                      </span>
                    </div>

                    {historyData.sessions.map((session, sIdx) => {
                      const maxW = historyData.summary?.maxWeight || 0;
                      const isAssisted = !!(historyData.summary?.isAssisted || 
                        exercise.exerciseName.toLowerCase().includes('assisted') || 
                        exercise.exerciseId.toLowerCase().includes('assisted'));

                      return (
                        <div 
                          key={`${session.date}-${sIdx}`}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 hover:border-slate-300 transition"
                        >
                          {/* Header buổi tập */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              <span>{session.formattedDate}</span>
                            </div>
                            {session.totalVolumeKg > 0 && (
                              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                Tổng tải: {session.totalVolumeKg.toLocaleString()} kg
                              </span>
                            )}
                          </div>

                          {/* Danh sách các hiệp trong buổi */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {session.sets.map((set, setIdx) => {
                              const isPRWeight = maxW !== 0 && set.weightKg === maxW && !set.isWarmup;
                              return (
                                <div 
                                  key={setIdx}
                                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold ${
                                    set.isWarmup 
                                      ? 'bg-amber-50/70 border border-amber-200/60 text-amber-900' 
                                      : isPRWeight
                                        ? 'bg-blue-50 border border-blue-200 text-blue-900 font-bold'
                                        : 'bg-slate-50 border border-slate-100 text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-slate-500 font-bold">
                                      {set.isWarmup ? 'Khởi động' : `Hiệp ${set.setIndex}`}
                                    </span>
                                    {isPRWeight && (
                                      <span className="px-1 py-0.2 rounded bg-amber-200 text-amber-900 text-[9px] font-black">
                                        PR
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-700">{set.reps} reps</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-extrabold text-slate-900">
                                      {isAssisted
                                        ? `-${Math.abs(set.weightKg)} kg`
                                        : (set.weightKg > 0 ? `${set.weightKg} kg` : 'Bodyweight')}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,16px))]">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md active:scale-[0.99] transition"
          >
            Đã Hiểu • Quay Lại Buổi Tập
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Image as ImageIcon, Video, AlertTriangle, CheckCircle, Dumbbell, Flame, Target, Sparkles, Film, ExternalLink, Star, Ban } from 'lucide-react';
import { PlannedExercise } from '../types';
import { AnatomyDiagram } from './AnatomyDiagram';
import { 
  EXERCISE_CATALOG, 
  getExercisePreferences, 
  setExercisePreference, 
  subscribeExercisePreferences, 
  ExercisePreferenceStatus 
} from '../data/exerciseCatalog';

interface ExerciseDetailModalProps {
  exercise: PlannedExercise;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose
}) => {
  // Luôn nạp thông tin từ EXERCISE_CATALOG để bài tập từ session cũ vẫn có đầy đủ videoUrl chuẩn
  const catalogItem = EXERCISE_CATALOG.find(c => c.id === exercise.exerciseId);
  const activeVideoUrl = exercise.videoUrl || catalogItem?.videoUrl;
  const activeVideoEmbedId = exercise.videoEmbedId || catalogItem?.videoEmbedId;
  const activeVideoQuery = (catalogItem as any)?.videoQuery || `${exercise.exerciseName} form guide`;
  const activeImages = (exercise.images && exercise.images.length > 0) ? exercise.images : (catalogItem?.images || []);
  const activeMuscleTarget = exercise.muscleTarget || catalogItem?.muscleTarget;
  const activeSetup = exercise.setup || catalogItem?.setup;
  const activeExecution = exercise.execution || catalogItem?.execution;
  const activeMistakes = exercise.mistakes || catalogItem?.mistakes;

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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
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
                      if (hasYoutube) {
                        setActiveMediaTab('youtube');
                      }
                    }}
                  />
                )}
              </div>
            )}

            {/* 2. YouTube Form Embed Content */}
            {activeMediaTab === 'youtube' && hasYoutube && (
              <div className="w-full h-72 bg-black flex items-center justify-center relative overflow-hidden">
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${activeVideoEmbedId}?autoplay=1&mute=1&loop=1&playlist=${activeVideoEmbedId}&playsinline=1&controls=1&rel=0`}
                  title={exercise.exerciseName}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
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

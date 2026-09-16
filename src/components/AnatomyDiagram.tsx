import React, { useState, useEffect } from 'react';
import { MuscleTargetDetail, DetailedMuscleHead } from '../types';
import { Target, Sparkles, Brain, Eye, Info, RotateCw } from 'lucide-react';

interface AnatomyDiagramProps {
  muscleTarget?: MuscleTargetDetail;
  exerciseName?: string;
  compact?: boolean;
}

export const AnatomyDiagram: React.FC<AnatomyDiagramProps> = ({
  muscleTarget,
  exerciseName = 'Bài tập',
  compact = false,
}) => {
  const [activeView, setActiveView] = useState<'front' | 'back'>(() => {
    if (muscleTarget?.bodyView === 'back') return 'back';
    if (muscleTarget?.primaryHead?.startsWith('tay_sau')) return 'back';
    if (muscleTarget?.primaryHead === 'vai_sau') return 'back';
    if (muscleTarget?.primaryHead?.startsWith('lung_')) return 'back';
    if (muscleTarget?.primaryHead === 'dui_sau') return 'back';
    if (muscleTarget?.primaryHead === 'co_mong') return 'back';
    return 'front';
  });

  useEffect(() => {
    if (!muscleTarget) return;
    if (
      muscleTarget.bodyView === 'back' ||
      muscleTarget.primaryHead?.startsWith('tay_sau') ||
      muscleTarget.primaryHead === 'vai_sau' ||
      muscleTarget.primaryHead?.startsWith('lung_') ||
      muscleTarget.primaryHead === 'dui_sau' ||
      muscleTarget.primaryHead === 'co_mong'
    ) {
      setActiveView('back');
    } else {
      setActiveView('front');
    }
  }, [muscleTarget]);

  if (!muscleTarget) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
        <Info className="w-5 h-5 mx-auto mb-1 text-slate-400" />
        <p>Đang cập nhật sơ đồ giải phẫu chi tiết cho bài tập này.</p>
      </div>
    );
  }

  const activeHead = muscleTarget.primaryHead;

  // Smart highlight helper supporting multi-heads & parent muscle groups
  const getHighlightClass = (head: DetailedMuscleHead | DetailedMuscleHead[]) => {
    const heads = Array.isArray(head) ? head : [head];
    const isExactMatch = heads.includes(activeHead);

    // Triceps group matching: Lateral Head, Long Head, Medial Head
    const isTricepGroup = activeHead.startsWith('tay_sau') && heads.some(h => h.startsWith('tay_sau'));
    // Biceps group matching: Long Head, Short Head, Brachialis
    const isBicepGroup = activeHead.startsWith('tay_truoc') && heads.some(h => h.startsWith('tay_truoc'));

    if (isExactMatch) {
      return 'fill-rose-500 stroke-rose-600 stroke-[1.5] filter drop-shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse';
    }
    if (isTricepGroup) {
      // Sáng rõ ràng cho toàn bộ khối bắp tay sau
      return 'fill-rose-400/90 stroke-rose-500 stroke-[1] filter drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]';
    }
    if (isBicepGroup) {
      return 'fill-rose-400/90 stroke-rose-500 stroke-[1] filter drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]';
    }
    return 'fill-slate-200 stroke-slate-300 hover:fill-slate-300 transition-colors';
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ${compact ? 'p-3' : 'p-4 md:p-5'}`}>
      
      {/* Header with Title & View Switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {compact ? 'Vị trí phát lực' : 'Sơ Đồ Giải Phẫu Điểm Cơ'}
            </h4>
            <p className="text-[11px] font-bold text-rose-600">
              {muscleTarget.primaryHeadNameVi}
            </p>
          </div>
        </div>

        {/* Front / Back view tabs */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-extrabold">
          <button
            onClick={() => setActiveView('front')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeView === 'front'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mặt Trước
          </button>
          <button
            onClick={() => setActiveView('back')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeView === 'back'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mặt Sau
          </button>
        </div>
      </div>

      {/* Main Vector Anatomy Canvas */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-2xl p-2 border border-slate-200/80 flex items-center justify-center min-h-[220px]">
        
        {/* SVG Human Silhouette with Anatomical Muscle Segments */}
        <svg
          viewBox="0 0 200 280"
          className="w-full max-w-[210px] h-[220px] drop-shadow-sm select-none"
        >
          <defs>
            <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* ============================================================== */}
          {/* FRONT VIEW (MẶT TRƯỚC)                                          */}
          {/* ============================================================== */}
          {activeView === 'front' && (
            <g id="body-front">
              {/* Head & Neck */}
              <ellipse cx="100" cy="24" rx="14" ry="17" className="fill-slate-200 stroke-slate-300" />
              <path d="M93 39 L93 50 L107 50 L107 39 Z" className="fill-slate-200 stroke-slate-300" />

              {/* Traps (Cầu vai trước) */}
              <path d="M85 49 Q100 48 115 49 L126 58 L74 58 Z" className={getHighlightClass('cau_vai')} />

              {/* Shoulders FRONT: Anterior Deltoid (Vai Trước) */}
              {/* Left Anterior Delt */}
              <path
                d="M63 56 C57 60, 54 70, 56 80 C60 82, 68 76, 70 70 C72 63, 69 57, 63 56 Z"
                className={getHighlightClass('vai_truoc')}
              />
              {/* Right Anterior Delt */}
              <path
                d="M137 56 C143 60, 146 70, 144 80 C140 82, 132 76, 130 70 C128 63, 131 57, 137 56 Z"
                className={getHighlightClass('vai_truoc')}
              />

              {/* Shoulders SIDE: Lateral Deltoid (Vai Giữa) */}
              {/* Left Lateral Delt */}
              <path
                d="M56 62 C50 67, 49 76, 52 84 C56 84, 58 78, 57 71 Z"
                className={getHighlightClass('vai_giua')}
              />
              {/* Right Lateral Delt */}
              <path
                d="M144 62 C150 67, 151 76, 148 84 C144 84, 142 78, 143 71 Z"
                className={getHighlightClass('vai_giua')}
              />

              {/* Chest: Upper Clavicular (Ngực trên) */}
              <path
                d="M74 58 Q100 62 126 58 L124 72 Q100 76 76 72 Z"
                className={getHighlightClass('nguc_tren')}
              />

              {/* Chest: Mid / Sternal (Ngực giữa) */}
              <path
                d="M75 73 Q100 77 125 73 L122 89 Q100 95 78 89 Z"
                className={getHighlightClass('nguc_giua')}
              />

              {/* Chest: Lower / Costal (Ngực dưới) */}
              <path
                d="M78 89 Q100 95 122 89 L120 95 Q100 100 80 95 Z"
                className={getHighlightClass('nguc_duoi')}
              />

              {/* Triceps Lateral Head (Viền cơ tay sau nhìn từ mặt trước) */}
              <path
                d="M45 84 C42 90, 42 100, 46 106 L48 104 C46 98, 46 90, 48 84 Z"
                className={getHighlightClass(['tay_sau_ngoai', 'tay_sau_dai'])}
              />
              <path
                d="M155 84 C158 90, 158 100, 154 106 L152 104 C154 98, 154 90, 152 84 Z"
                className={getHighlightClass(['tay_sau_ngoai', 'tay_sau_dai'])}
              />

              {/* Biceps (Tay trước - Cả Đầu Dài & Đầu Ngắn) */}
              {/* Left Biceps */}
              <ellipse cx="53" cy="95" rx="7" ry="14" transform="rotate(-6 53 95)" className={getHighlightClass(['tay_truoc_ngan', 'tay_truoc_dai'])} />
              {/* Right Biceps */}
              <ellipse cx="147" cy="95" rx="7" ry="14" transform="rotate(6 147 95)" className={getHighlightClass(['tay_truoc_ngan', 'tay_truoc_dai'])} />

              {/* Brachialis (Cơ cánh tay) */}
              <path d="M47 94 Q48 105 50 110 L54 108 Q52 98 50 94 Z" className={getHighlightClass('co_canh_tay')} />
              <path d="M153 94 Q152 105 150 110 L146 108 Q148 98 150 94 Z" className={getHighlightClass('co_canh_tay')} />

              {/* Forearms (Cẳng tay) */}
              <ellipse cx="44" cy="130" rx="6" ry="18" transform="rotate(-10 44 130)" className={getHighlightClass('cang_tay')} />
              <ellipse cx="156" cy="130" rx="6" ry="18" transform="rotate(10 156 130)" className={getHighlightClass('cang_tay')} />

              {/* Abs & Core (Cơ bụng 6 múi) */}
              <g className={getHighlightClass('co_bung')}>
                <rect x="85" y="97" width="13" height="11" rx="3" />
                <rect x="102" y="97" width="13" height="11" rx="3" />
                <rect x="85" y="110" width="13" height="11" rx="3" />
                <rect x="102" y="110" width="13" height="11" rx="3" />
                <rect x="86" y="123" width="12" height="13" rx="3" />
                <rect x="102" y="123" width="12" height="13" rx="3" />
              </g>

              {/* Obliques (Cơ liên sườn hai bên) */}
              <path d="M72 96 Q70 120 78 135 L82 133 Q76 118 76 96 Z" className={getHighlightClass('co_lien_suon')} />
              <path d="M128 96 Q130 120 122 135 L118 133 Q124 118 124 96 Z" className={getHighlightClass('co_lien_suon')} />

              {/* Pelvis / Hips */}
              <path d="M80 136 L120 136 L114 152 L86 152 Z" className="fill-slate-200 stroke-slate-300" />

              {/* Quadriceps (Đùi trước) */}
              {/* Left Quad */}
              <path
                d="M75 152 Q68 185 76 215 Q88 215 94 205 Q98 175 92 152 Z"
                className={getHighlightClass('dui_truoc')}
              />
              {/* Right Quad */}
              <path
                d="M125 152 Q132 185 124 215 Q112 215 106 205 Q102 175 108 152 Z"
                className={getHighlightClass('dui_truoc')}
              />

              {/* Knee joints */}
              <ellipse cx="83" cy="221" rx="5" ry="4" className="fill-slate-300 stroke-slate-400" />
              <ellipse cx="117" cy="221" rx="5" ry="4" className="fill-slate-300 stroke-slate-400" />

              {/* Calves Front / Shins */}
              <ellipse cx="82" cy="245" rx="6" ry="17" className={getHighlightClass('bap_chan')} />
              <ellipse cx="118" cy="245" rx="6" ry="17" className={getHighlightClass('bap_chan')} />

              {/* Feet */}
              <ellipse cx="80" cy="268" rx="6" ry="4" className="fill-slate-300 stroke-slate-400" />
              <ellipse cx="120" cy="268" rx="6" ry="4" className="fill-slate-300 stroke-slate-400" />
            </g>
          )}

          {/* ============================================================== */}
          {/* BACK VIEW (MẶT SAU)                                             */}
          {/* ============================================================== */}
          {activeView === 'back' && (
            <g id="body-back">
              {/* Head Back & Neck */}
              <ellipse cx="100" cy="24" rx="14" ry="17" className="fill-slate-200 stroke-slate-300" />
              <path d="M93 39 L93 50 L107 50 L107 39 Z" className="fill-slate-200 stroke-slate-300" />

              {/* Traps (Cầu vai lưng hình kim cương) */}
              <path
                d="M100 48 L126 58 L100 102 L74 58 Z"
                className={getHighlightClass('cau_vai')}
              />

              {/* Rear Deltoid (Vai Sau - Posterior Delt) */}
              {/* Left Rear Delt */}
              <path
                d="M62 58 C55 64, 54 75, 60 84 C66 82, 70 74, 70 66 Z"
                className={getHighlightClass('vai_sau')}
              />
              {/* Right Rear Delt */}
              <path
                d="M138 58 C145 64, 146 75, 140 84 C134 82, 130 74, 130 66 Z"
                className={getHighlightClass('vai_sau')}
              />

              {/* Shoulders SIDE: Lateral Deltoid (Vai Giữa nhìn từ sau) */}
              <path d="M55 64 C49 70, 48 78, 52 85 C55 83, 56 78, 56 70 Z" className={getHighlightClass('vai_giua')} />
              <path d="M145 64 C151 70, 152 78, 148 85 C145 83, 144 78, 144 70 Z" className={getHighlightClass('vai_giua')} />

              {/* Upper Back / Rhomboids (Cơ trám lưng trên) */}
              <path
                d="M82 66 L118 66 L112 90 L88 90 Z"
                className={getHighlightClass('lung_tren')}
              />

              {/* Latissimus Dorsi (Lưng xô hai bên V-Taper) */}
              {/* Left Lat */}
              <path
                d="M72 75 Q68 105 82 124 L88 92 Q78 84 72 75 Z"
                className={getHighlightClass('lung_xo')}
              />
              {/* Right Lat */}
              <path
                d="M128 75 Q132 105 118 124 L112 92 Q122 84 128 75 Z"
                className={getHighlightClass('lung_xo')}
              />

              {/* Triceps (Tay sau - Cả 3 đầu cơ: Đầu Ngoài Móng Ngựa, Đầu Dài Sát Thân, Đầu Giữa/Sâu) */}
              {/* Left Triceps - Lateral Head (Đầu ngoài) */}
              <path
                d="M45 82 C41 88, 41 98, 47 106 C49 105, 50 96, 49 88 C48 84, 46 82, 45 82 Z"
                className={getHighlightClass('tay_sau_ngoai')}
              />
              {/* Left Triceps - Long Head (Đầu dài) */}
              <path
                d="M49 82 C53 85, 55 95, 54 107 C51 107, 48 97, 48 85 Z"
                className={getHighlightClass('tay_sau_dai')}
              />
              {/* Left Triceps - Medial Head (Đầu giữa) */}
              <path
                d="M47 106 L53 107 L51 113 L47 112 Z"
                className={getHighlightClass('tay_sau_giua')}
              />

              {/* Right Triceps - Lateral Head (Đầu ngoài) */}
              <path
                d="M155 82 C159 88, 159 98, 153 106 C151 105, 150 96, 151 88 C152 84, 154 82, 155 82 Z"
                className={getHighlightClass('tay_sau_ngoai')}
              />
              {/* Right Triceps - Long Head (Đầu dài) */}
              <path
                d="M151 82 C147 85, 145 95, 146 107 C149 107, 152 97, 152 85 Z"
                className={getHighlightClass('tay_sau_dai')}
              />
              {/* Right Triceps - Medial Head (Đầu giữa) */}
              <path
                d="M153 106 L147 107 L149 113 L153 112 Z"
                className={getHighlightClass('tay_sau_giua')}
              />

              {/* Forearms Back View */}
              <ellipse cx="44" cy="130" rx="6" ry="18" transform="rotate(-10 44 130)" className={getHighlightClass('cang_tay')} />
              <ellipse cx="156" cy="130" rx="6" ry="18" transform="rotate(10 156 130)" className={getHighlightClass('cang_tay')} />

              {/* Lower Back / Erector Spinae (Lưng dưới) */}
              <path
                d="M87 114 L113 114 L111 138 L89 138 Z"
                className={getHighlightClass('lung_duoi')}
              />

              {/* Glutes (Cơ mông lớn) */}
              {/* Left Glute */}
              <path
                d="M75 138 Q68 152 72 168 Q88 172 98 158 L98 138 Z"
                className={getHighlightClass('co_mong')}
              />
              {/* Right Glute */}
              <path
                d="M125 138 Q132 152 128 168 Q112 172 102 158 L102 138 Z"
                className={getHighlightClass('co_mong')}
              />

              {/* Hamstrings (Đùi sau) */}
              {/* Left Hamstring */}
              <path
                d="M74 168 Q70 190 77 214 Q88 214 94 205 Q98 185 96 168 Z"
                className={getHighlightClass('dui_sau')}
              />
              {/* Right Hamstring */}
              <path
                d="M126 168 Q130 190 123 214 Q112 214 106 205 Q102 185 104 168 Z"
                className={getHighlightClass('dui_sau')}
              />

              {/* Knee back */}
              <ellipse cx="83" cy="221" rx="5" ry="4" className="fill-slate-300 stroke-slate-400" />
              <ellipse cx="117" cy="221" rx="5" ry="4" className="fill-slate-300 stroke-slate-400" />

              {/* Calves (Bắp chuối Gastrocnemius) */}
              {/* Left Calf */}
              <ellipse cx="82" cy="245" rx="7" ry="16" className={getHighlightClass('bap_chan')} />
              {/* Right Calf */}
              <ellipse cx="118" cy="245" rx="7" ry="16" className={getHighlightClass('bap_chan')} />

              {/* Feet back */}
              <ellipse cx="80" cy="268" rx="6" ry="4" className="fill-slate-300 stroke-slate-400" />
              <ellipse cx="120" cy="268" rx="6" ry="4" className="fill-slate-300 stroke-slate-400" />
            </g>
          )}

          {/* Glowing Animated Crosshair / Target Radar on Active Muscle */}
          {/* Vai trước */}
          {activeHead === 'vai_truoc' && activeView === 'front' && (
            <g className="animate-bounce">
              <circle cx="63" cy="68" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="63" cy="68" r="3" className="fill-rose-600" />
              <circle cx="137" cy="68" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="137" cy="68" r="3" className="fill-rose-600" />
            </g>
          )}

          {/* Vai giữa */}
          {activeHead === 'vai_giua' && (
            <g className="animate-bounce">
              <circle cx="53" cy="74" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="53" cy="74" r="3" className="fill-rose-600" />
              <circle cx="147" cy="74" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="147" cy="74" r="3" className="fill-rose-600" />
            </g>
          )}

          {/* Vai sau */}
          {activeHead === 'vai_sau' && activeView === 'back' && (
            <g className="animate-bounce">
              <circle cx="65" cy="72" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="65" cy="72" r="3" className="fill-rose-600" />
              <circle cx="135" cy="72" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="135" cy="72" r="3" className="fill-rose-600" />
            </g>
          )}

          {/* TAY SAU (Triceps Radar - Mặt Sau) */}
          {activeHead.startsWith('tay_sau') && activeView === 'back' && (
            <g className="animate-bounce">
              <circle cx="49" cy="95" r="9" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="49" cy="95" r="3.5" className="fill-rose-600" />
              <circle cx="151" cy="95" r="9" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="151" cy="95" r="3.5" className="fill-rose-600" />
            </g>
          )}

          {/* TAY SAU (Triceps Radar - Mặt Trước) */}
          {activeHead.startsWith('tay_sau') && activeView === 'front' && (
            <g className="animate-bounce">
              <circle cx="45" cy="95" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="45" cy="95" r="2.5" className="fill-rose-600" />
              <circle cx="155" cy="95" r="7" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="155" cy="95" r="2.5" className="fill-rose-600" />
            </g>
          )}

          {/* TAY TRƯỚC (Biceps Radar - Mặt Trước) */}
          {(activeHead.startsWith('tay_truoc') || activeHead === 'co_canh_tay') && activeView === 'front' && (
            <g className="animate-bounce">
              <circle cx="53" cy="95" r="8" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="53" cy="95" r="3" className="fill-rose-600" />
              <circle cx="147" cy="95" r="8" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="147" cy="95" r="3" className="fill-rose-600" />
            </g>
          )}

          {/* NGỰC (Chest Radar - Mặt Trước) */}
          {activeHead.startsWith('nguc_') && activeView === 'front' && (
            <g className="animate-bounce">
              <circle cx="100" cy="74" r="9" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="100" cy="74" r="3.5" className="fill-rose-600" />
            </g>
          )}

          {/* LƯNG XÔ (Lats Radar - Mặt Sau) */}
          {activeHead === 'lung_xo' && activeView === 'back' && (
            <g className="animate-bounce">
              <circle cx="76" cy="100" r="8" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="76" cy="100" r="3" className="fill-rose-600" />
              <circle cx="124" cy="100" r="8" className="fill-rose-500/30 stroke-rose-600 stroke-[1.5]" />
              <circle cx="124" cy="100" r="3" className="fill-rose-600" />
            </g>
          )}
        </svg>

        {/* Floating Focus Badge Overlay */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 max-w-[200px]">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
          <span className="text-[10px] font-black text-slate-800 truncate">
            {muscleTarget.primaryHeadNameVi}
          </span>
        </div>

        {/* Quick View Switch Button Helper if viewing opposite side */}
        {activeHead.startsWith('tay_sau') && activeView === 'front' && (
          <button
            type="button"
            onClick={() => setActiveView('back')}
            className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-slate-900 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border border-slate-700 animate-pulse active:scale-95 transition"
          >
            <RotateCw className="w-3 h-3 text-rose-400" />
            <span>Xem Mặt Sau (Rõ Tay Sau)</span>
          </button>
        )}
        {activeHead.startsWith('nguc_') && activeView === 'back' && (
          <button
            type="button"
            onClick={() => setActiveView('front')}
            className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-slate-900 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border border-slate-700 animate-pulse active:scale-95 transition"
          >
            <RotateCw className="w-3 h-3 text-rose-400" />
            <span>Xem Mặt Trước (Ngực)</span>
          </button>
        )}
      </div>

      {/* Mind-Muscle Connection Box (Mẹo Cảm Nhận Cơ & Vị Trí) */}
      <div className="mt-3 space-y-2">
        {/* Feeling Location */}
        <div className="flex items-start gap-2 bg-rose-50/70 border border-rose-100 p-2.5 rounded-xl">
          <div className="p-1 bg-rose-500 text-white rounded-lg mt-0.5 shrink-0">
            <Target className="w-3 h-3" />
          </div>
          <div>
            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider block">
              Vị trí cảm nhận trên cơ thể:
            </span>
            <p className="text-xs font-bold text-slate-800 leading-snug">
              {muscleTarget.feelingLocation}
            </p>
          </div>
        </div>

        {/* Mind-Muscle Cue */}
        <div className="flex items-start gap-2 bg-blue-50/70 border border-blue-100 p-2.5 rounded-xl">
          <div className="p-1 bg-blue-600 text-white rounded-lg mt-0.5 shrink-0">
            <Brain className="w-3 h-3" />
          </div>
          <div>
            <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block">
              Mẹo kích hoạt cơ (Mind-Muscle Connection):
            </span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
              {muscleTarget.mindMuscleCue}
            </p>
          </div>
        </div>

        {/* Secondary Muscles involved */}
        {muscleTarget.secondaryHeads && muscleTarget.secondaryHeads.length > 0 && (
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400">Nhóm cơ hỗ trợ:</span>
            {muscleTarget.secondaryHeads.map((sec, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold"
              >
                {sec}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

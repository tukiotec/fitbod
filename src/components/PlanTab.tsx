import { HERNIATED_DISC_EXCLUDED_IDS, SPINE_SAFE_ALTERNATIVES } from '../data/spineSafety';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Target, 
  Dumbbell, 
  Clock, 
  Layers, 
  Sparkles, 
  Flame, 
  User, 
  Scale, 
  Ruler, 
  TrendingUp, 
  ChevronRight,
  Info,
  Check
, Shield, AlertTriangle } from 'lucide-react';
import { 
  FitnessGoal, 
  FitnessSplit, 
  EquipmentType, 
  CardioType, 
  UserBodyProfile, 
  FitnessLevel, 
  Gender 
} from '../types';
import { getStrengthPreview } from '../engine/fitbodEngine';

interface PlanTabProps {
  goal: FitnessGoal;
  setGoal: (g: FitnessGoal) => void;
  split: FitnessSplit;
  setSplit: (s: FitnessSplit) => void;
  duration: number;
  setDuration: (d: number) => void;
  equipment: EquipmentType[];
  toggleEquipment: (eq: EquipmentType) => void;
  onRegenerate: () => void;
  includeWarmup: boolean;
  setIncludeWarmup: (w: boolean) => void;
  cardioType: CardioType;
  setCardioType: (c: CardioType) => void;
  cardioDuration: number;
  setCardioDuration: (d: number) => void;
  availableMachines?: string[];
  onOpenMachinesModal?: () => void;
  bodyProfile: UserBodyProfile;
  onChangeBodyProfile: (profile: UserBodyProfile) => void;
  spineSafeMode?: boolean;
  onToggleSpineSafeMode?: (enabled: boolean) => void;
}

export const PlanTab: React.FC<PlanTabProps> = ({
  goal,
  setGoal,
  split,
  setSplit,
  duration,
  setDuration,
  equipment,
  toggleEquipment,
  onRegenerate,
  includeWarmup,
  setIncludeWarmup,
  cardioType,
  setCardioType,
  cardioDuration,
  setCardioDuration,
  availableMachines,
  onOpenMachinesModal,
  bodyProfile,
  onChangeBodyProfile,
  spineSafeMode = true,
  onToggleSpineSafeMode
}) => {
  // Chuỗi nhập liệu tự do (Local String State) để gõ phím mượt mà trên iPhone/Safari
  const [weightStr, setWeightStr] = useState<string>(() => (bodyProfile.weightKg || 70).toString());
  const [heightStr, setHeightStr] = useState<string>(() => (bodyProfile.heightCm || 172).toString());

  // Đồng bộ khi bodyProfile đổi từ ngoài
  useEffect(() => {
    setWeightStr((bodyProfile.weightKg || 70).toString());
  }, [bodyProfile.weightKg]);

  useEffect(() => {
    setHeightStr((bodyProfile.heightCm || 172).toString());
  }, [bodyProfile.heightCm]);

  const goalOptions: { id: FitnessGoal; label: string; desc: string }[] = [
    { id: 'hypertrophy', label: 'Tăng Cơ (Hypertrophy)', desc: '3-4 sets x 8-12 reps, nghỉ 90s' },
    { id: 'strength', label: 'Sức Mạnh (Strength)', desc: '4-5 sets x 3-5 reps, nghỉ 180s, có AMRAP' },
    { id: 'tone', label: 'Săn Chắc (Tone)', desc: '3 sets x 12-16 reps, nghỉ 45s' }
  ];

  const splitOptions: { id: FitnessSplit; label: string; desc: string }[] = [
    { id: 'push_pull_legs', label: 'Push / Pull / Legs', desc: 'Luân chuyển Ngực/Vai/Tay sau -> Lưng/Tay trước -> Chân' },
    { id: 'upper_lower', label: 'Upper / Lower', desc: 'Chia đôi nửa thân trên và thân dưới' },
    { id: 'full_body', label: 'Full Body', desc: 'Tập toàn diện các nhóm cơ sung sức nhất' }
  ];

  const equipOptions: { id: EquipmentType; label: string }[] = [
    { id: 'barbell', label: 'Đòn tạ Olympic (Barbell)' },
    { id: 'dumbbell', label: 'Tạ đơn (Dumbbells)' },
    { id: 'cable', label: 'Dàn kéo cáp (Cable)' },
    { id: 'machine', label: 'Máy khối (Machines)' },
    { id: 'bodyweight', label: 'Trọng lượng cơ thể (Bodyweight)' }
  ];

  // Tính BMI tự động
  const bmi = useMemo(() => {
    const hM = (bodyProfile.heightCm || 172) / 100;
    const w = bodyProfile.weightKg || 70;
    if (hM <= 0) return 0;
    return Math.round((w / (hM * hM)) * 10) / 10;
  }, [bodyProfile.weightKg, bodyProfile.heightCm]);

  const bmiStatus = useMemo(() => {
    if (bmi < 18.5) {
      return { 
        label: 'Gầy / Thiếu cân', 
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        tip: 'Nên ăn dư calo để tăng cơ bắp'
      };
    }
    if (bmi < 23.0) {
      return { 
        label: 'Cân đối / Chuẩn người', 
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        tip: 'Tỷ lệ người chuẩn, giữ phong độ'
      };
    }
    if (bmi < 25.0) {
      return { 
        label: 'Hơi thừa cân (Chớm mỡ bụng)', 
        color: 'text-amber-800 bg-amber-50 border-amber-200',
        tip: 'Nên chú trọng tập săn chắc, hạn chế tinh bột'
      };
    }
    if (bmi < 30.0) {
      const isExpert = bodyProfile.level === 'expert';
      return { 
        label: isExpert ? 'Đô con (Cơ bắp dày)' : 'Thừa cân (Mập / Cần siết mỡ)', 
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        tip: 'Nên kết hợp Cardio 15-20p cuối buổi để siết nét'
      };
    }
    return { 
      label: 'Béo phì / Cần giảm mỡ gấp', 
      color: 'text-red-800 bg-red-50 border-red-200',
      tip: 'Ưu tiên bài tập đốt mỡ và kiểm soát khẩu phần'
    };
  }, [bmi, bodyProfile.level]);

  // Bảng mức tạ chuẩn preview
  const strengthPreviews = useMemo(() => {
    return getStrengthPreview(bodyProfile, goal);
  }, [bodyProfile, goal]);

  const handleUpdateWeight = (delta: number) => {
    const current = parseFloat(weightStr) || bodyProfile.weightKg || 70;
    const nextW = Math.max(30, Math.min(250, current + delta));
    setWeightStr(nextW.toString());
    onChangeBodyProfile({ ...bodyProfile, weightKg: nextW });
  };

  const handleWeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setWeightStr(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 30 && parsed <= 250) {
      onChangeBodyProfile({ ...bodyProfile, weightKg: parsed });
    }
  };

  const handleWeightBlur = () => {
    let parsed = parseFloat(weightStr);
    if (isNaN(parsed) || parsed < 30) {
      parsed = 70;
    } else if (parsed > 250) {
      parsed = 200;
    }
    setWeightStr(parsed.toString());
    onChangeBodyProfile({ ...bodyProfile, weightKg: parsed });
  };

  const handleSelectQuickWeight = (w: number) => {
    setWeightStr(w.toString());
    onChangeBodyProfile({ ...bodyProfile, weightKg: w });
  };

  const handleUpdateHeight = (delta: number) => {
    const current = parseInt(heightStr, 10) || bodyProfile.heightCm || 172;
    const nextH = Math.max(120, Math.min(230, current + delta));
    setHeightStr(nextH.toString());
    onChangeBodyProfile({ ...bodyProfile, heightCm: nextH });
  };

  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setHeightStr(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 120 && parsed <= 230) {
      onChangeBodyProfile({ ...bodyProfile, heightCm: parsed });
    }
  };

  const handleHeightBlur = () => {
    let parsed = parseInt(heightStr, 10);
    if (isNaN(parsed) || parsed < 120) {
      parsed = 172;
    } else if (parsed > 230) {
      parsed = 220;
    }
    setHeightStr(parsed.toString());
    onChangeBodyProfile({ ...bodyProfile, heightCm: parsed });
  };

  const levelOptions: { id: FitnessLevel; title: string; exp: string; badge: string; color: string }[] = [
    { 
      id: 'beginner', 
      title: 'Mới tập', 
      exp: '< 1 năm kinh nghiệm', 
      badge: 'Beginner', 
      color: 'border-emerald-400 bg-emerald-50/50 text-emerald-800' 
    },
    { 
      id: 'advanced', 
      title: 'Nâng cao', 
      exp: '1 - 3 năm kinh nghiệm', 
      badge: 'Advanced', 
      color: 'border-blue-400 bg-blue-50/50 text-blue-800' 
    },
    { 
      id: 'expert', 
      title: 'Chuyên sâu', 
      exp: '3 - 5 năm kinh nghiệm', 
      badge: 'Expert', 
      color: 'border-purple-400 bg-purple-50/50 text-purple-800' 
    }
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Body Profile & Strength Standard Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Thể Chất & Trình Độ Của Sếp</h2>
              <p className="text-xs text-slate-500">Căn cứ tính toán mức tạ khởi điểm chuẩn khoa học</p>
            </div>
          </div>
          <span className="text-[11px] font-black px-2.5 py-1 bg-blue-100/70 text-blue-700 rounded-xl border border-blue-200">
            NSCA Standard
          </span>
        </div>

        {/* Trình độ tập luyện */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Trình độ tập luyện
          </label>
          <div className="grid grid-cols-3 gap-2">
            {levelOptions.map((opt) => {
              const isSelected = bodyProfile.level === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeBodyProfile({ ...bodyProfile, level: opt.id })}
                  className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-slate-900 leading-tight">
                      {opt.title}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    {opt.exp}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Giới tính */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Giới tính sinh học
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'male' as Gender, label: '👨 Nam giới', desc: 'Hệ số sức mạnh tiêu chuẩn 100%' },
              { id: 'female' as Gender, label: '👩 Nữ giới', desc: 'Tối ưu tỷ lệ tải thân trên & thân dưới' }
            ].map((g) => {
              const isSelected = bodyProfile.gender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onChangeBodyProfile({ ...bodyProfile, gender: g.id })}
                  className={`p-3 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{g.label}</span>
                    {isSelected && (
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{g.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cân nặng & Chiều cao */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cân nặng */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-600" /> Cân nặng
              </span>
              <span className="text-base font-black text-slate-900">
                {bodyProfile.weightKg} <span className="text-xs font-bold text-slate-500">kg</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => handleUpdateWeight(-1)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center shadow-2xs active:scale-95 hover:bg-slate-100"
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={weightStr}
                onChange={handleWeightInputChange}
                onBlur={handleWeightBlur}
                className="flex-1 h-8 bg-white border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="70"
              />
              <button
                type="button"
                onClick={() => handleUpdateWeight(1)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center shadow-2xs active:scale-95 hover:bg-slate-100"
              >
                +
              </button>
            </div>

            {/* Quick buttons */}
            <div className="flex justify-between gap-1">
              {[55, 65, 70, 75, 85].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => handleSelectQuickWeight(w)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition ${
                    bodyProfile.weightKg === w
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Chiều cao */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-blue-600" /> Chiều cao
              </span>
              <span className="text-base font-black text-slate-900">
                {bodyProfile.heightCm} <span className="text-xs font-bold text-slate-500">cm</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => handleUpdateHeight(-1)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center shadow-2xs active:scale-95 hover:bg-slate-100"
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={heightStr}
                onChange={handleHeightInputChange}
                onBlur={handleHeightBlur}
                className="flex-1 h-8 bg-white border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="172"
              />
              <button
                type="button"
                onClick={() => handleUpdateHeight(1)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center shadow-2xs active:scale-95 hover:bg-slate-100"
              >
                +
              </button>
            </div>

            {/* BMI status */}
            <div className={`py-1.5 px-2.5 rounded-xl text-[10px] font-bold border text-center ${bmiStatus.color} shadow-2xs`}>
              <div className="font-black">BMI {bmi} • {bmiStatus.label}</div>
              {bmiStatus.tip && (
                <div className="text-[9px] opacity-90 font-medium mt-0.5">{bmiStatus.tip}</div>
              )}
            </div>
          </div>
        </div>

        {/* Bảng Mức Tạ Dự Kiến Cho Sếp (Interactive Preview) */}
        <div className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                Mức Tạ Dự Kiến Khuyến Nghị Cho Sếp
              </h4>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
              {bodyProfile.level === 'beginner' ? 'Mới tập' : bodyProfile.level === 'advanced' ? 'Nâng cao' : 'Chuyên sâu'}
            </span>
          </div>

          <p className="text-[11px] text-blue-800 mb-3">
            Tính toán tự động theo thể trọng <strong>{bodyProfile.weightKg}kg</strong> và mục tiêu hiện tại. Khi tạo bài tập, Fitbod sẽ tự nạp các mức tạ này:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {strengthPreviews.map((p) => (
              <div 
                key={p.id}
                className="p-2.5 bg-white/95 rounded-xl border border-blue-200/90 shadow-2xs flex flex-col justify-between"
              >
                <div className="min-w-0 mb-1">
                  <span className="text-[11px] font-bold text-slate-800 block truncate leading-tight">
                    {p.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block">
                    {p.equipmentVi}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                  <span className="text-sm font-black text-blue-600">
                    {p.weightKg} <span className="text-[10px] font-bold text-slate-500">kg</span>
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold truncate max-w-[60px]">
                    {p.unit.includes('bên') ? 'Mỗi bên' : 'Tổng tạ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Lumbar Spine Safety & Herniated Disc Protection Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl transition ${
              spineSafeMode ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  Bảo Vệ Cột Sống (Thoát Vị Đĩa Đệm)
                </h2>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  spineSafeMode
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {spineSafeMode ? '🛡️ ĐANG BẬT' : 'ĐÃ TẮT'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Loại trừ áp lực nén thắt lưng L4-L5, L5-S1 và lực cắt nguy hiểm cho đĩa đệm
              </p>
            </div>
          </div>

          {onToggleSpineSafeMode && (
            <button
              onClick={() => onToggleSpineSafeMode(!spineSafeMode)}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 transition duration-300 shrink-0 ml-2 ${
                spineSafeMode ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
              title={spineSafeMode ? "Bấm để tắt bảo vệ cột sống" : "Bấm để bật bảo vệ cột sống"}
            >
              <div className="bg-white w-4.5 h-4.5 rounded-full shadow-md transform" />
            </button>
          )}
        </div>

        {spineSafeMode ? (
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
              <span>🩺 PHÁC ĐỒ Y SINH HỌC FITBOD ĐÃ KÍCH HOẠT CHO SẾP:</span>
            </div>
            <ul className="text-xs text-emerald-900 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong>Loại bỏ 13 bài nén cột sống:</strong> Barbell Back/Front Squat, Conventional Deadlift, Romanian Deadlift (RDL), Barbell Bent Row, T-Bar Row, Hyperextension, OHP đẩy tạ đứng, Barbell Shrug, Nhón bắp chân đứng tì vai, Quỳ gập bụng cáp, Kéo cáp vặn mình.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                <span>
                  <strong>Tự động thay bằng bài an toàn:</strong> Đạp đùi Leg Press tựa đệm lưng, Nằm móc đùi sau máy (Lying Leg Curl), Chèo cáp ngồi thẳng lưng (Seated Cable Row), Kéo xô giải nén đốt sống (Lat Pulldown), Bay vai tạ đơn và Plank giữ cơ lõi tĩnh.
                </span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Cảnh báo:</strong> Khi tắt chế độ này, AI sẽ gợi ý cả các bài Squat gánh nặng, Deadlift và gập lưng tự do. Nếu Sếp có tiền sử phồng đĩa đệm hoặc đau thắt lưng, hãy <strong>BẬT</strong> lại để bảo vệ cột sống.
            </p>
          </div>
        )}
      </div>

      {/* Goal Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Mục Tiêu Thể Hình</h2>
            <p className="text-xs text-slate-500">Quyết định số rep, số set và thời gian nghỉ</p>
          </div>
        </div>

        <div className="space-y-2">
          {goalOptions.map((g) => (
            <div
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition active:scale-[0.99] ${
                goal === g.id
                  ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{g.label}</h4>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  goal === g.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                  {goal === g.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Phân Chia Lịch Tập (Split)</h2>
            <p className="text-xs text-slate-500">Cách thức chia nhóm cơ trong tuần</p>
          </div>
        </div>

        <div className="space-y-2">
          {splitOptions.map((s) => (
            <div
              key={s.id}
              onClick={() => setSplit(s.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition active:scale-[0.99] ${
                split === s.id
                  ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{s.label}</h4>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  split === s.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                  {split === s.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Profile */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Dụng Cụ Phòng Tập (Gym Profile)</h2>
            <p className="text-xs text-slate-500">Chọn các trang thiết bị phòng gym Sếp có sẵn</p>
          </div>
        </div>

        <div className="space-y-2">
          {equipOptions.map((eq) => {
            const has = equipment.includes(eq.id);
            return (
              <div
                key={eq.id}
                onClick={() => toggleEquipment(eq.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  has ? 'bg-blue-50/40 border-blue-400' : 'bg-slate-50/40 border-slate-200'
                }`}
              >
                <span className="text-xs font-bold text-slate-800">{eq.label}</span>
                <input
                  type="checkbox"
                  checked={has}
                  readOnly
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* Chi Tiết Cỗ Máy Phòng Gym (Có Hình Minh Họa) */}
        {onOpenMachinesModal && (
          <div className="mt-3.5 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/80 rounded-2xl border border-blue-200/90 flex items-center justify-between shadow-2xs">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-black text-blue-900">Chi Tiết Cỗ Máy & Dàn Cáp</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  (availableMachines?.length ?? 18) === 18
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {availableMachines?.length ?? 18}/18 máy
                </span>
              </div>
              <p className="text-[11px] text-blue-700">
                Xem hình ảnh thực tế từng máy để tắt những máy phòng tập Sếp không có
              </p>
            </div>
            <button
              onClick={onOpenMachinesModal}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1"
            >
              Chọn máy &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Thời Lượng Buổi Tập</h2>
            <p className="text-xs text-slate-500">Fitbod sẽ tối ưu số lượng bài tập theo thời gian</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[30, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => setDuration(mins)}
              className={`py-2.5 rounded-2xl font-bold text-xs border transition ${
                duration === mins
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {mins} phút
            </button>
          ))}
        </div>
      </div>

      {/* Warmup & Cardio Settings */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Khởi Động & Cardio Cuối Buổi</h2>
            <p className="text-xs text-slate-500">Cấu hình tiêu chuẩn cho mọi buổi tập sinh ra</p>
          </div>
        </div>

        {/* Warmup Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <h4 className="font-bold text-sm text-slate-900">Hiệp khởi động (Warm-up Sets)</h4>
            <p className="text-xs text-slate-500 mt-0.5">Tự động thêm 1-2 hiệp tạ nhẹ (W) làm nóng khớp</p>
          </div>
          <button
            onClick={() => setIncludeWarmup(!includeWarmup)}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition duration-300 ${
              includeWarmup ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="bg-white w-5 h-5 rounded-full shadow-md transform" />
          </button>
        </div>

        {/* Cardio Type Selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Loại Cardio cuối buổi
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'Không có cardio', desc: 'Chỉ tập tạ kháng lực' },
              { id: 'bike', label: '🚴 Đạp xe tập', desc: 'Stationary Bike (nhẹ khớp)' },
              { id: 'treadmill', label: '🏃 Đi bộ / Chạy máy', desc: 'Treadmill (dốc đốt mỡ)' },
              { id: 'elliptical', label: '🎿 Máy trượt Elliptical', desc: 'Vận động toàn thân êm khớp' }
            ].map(c => (
              <div
                key={c.id}
                onClick={() => setCardioType(c.id as any)}
                className={`p-3 rounded-2xl border cursor-pointer transition ${
                  cardioType === c.id
                    ? 'bg-orange-50/60 border-orange-500 ring-1 ring-orange-500'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{c.label}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    cardioType === c.id ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`}>
                    {cardioType === c.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cardio Duration */}
        {cardioType !== 'none' && (
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Thời lượng Cardio ({cardioDuration} phút)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map(mins => (
                <button
                  key={mins}
                  onClick={() => setCardioDuration(mins)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    cardioDuration === mins
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {mins} phút
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply & Regenerate Button */}
      <button
        onClick={onRegenerate}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-[0.99] transition"
      >
        <Sparkles className="w-4 h-4" />
        Áp Dụng & Tạo Lại Buổi Tập Mới
      </button>
    </div>
  );
};

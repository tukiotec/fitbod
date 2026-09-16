import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Layers, Check, Sliders, Edit3 } from 'lucide-react';

interface CableStackModalProps {
  initialWeight?: number;
  initialRatio?: '1:1' | '2:1';
  exerciseName?: string;
  onApply: (weight: number, ratio: '1:1' | '2:1') => void;
  onClose: () => void;
}

export type CableStackPreset = 'lifefitness' | 'crossover5' | 'matrix15' | 'standard10' | 'numbered' | 'kg_standard';

export interface PlateInfo {
  plateIndex: number;
  label: string;
  lbs: number;
  kg: number;
}

export const CABLE_PRESETS: {
  id: CableStackPreset;
  name: string;
  tag: string;
  description: string;
  plates: PlateInfo[];
}[] = [
  {
    id: 'lifefitness',
    name: 'Life Fitness / Hammer (12.5 lbs)',
    tag: 'Phổ biến nhất',
    description: 'Thỏi 12.5 lbs (~5.7kg/miếng) rất phổ biến tại California, CityGym, The New Gym...',
    plates: [
      { plateIndex: 1, label: '12.5 lbs', lbs: 12.5, kg: 5.7 },
      { plateIndex: 2, label: '25 lbs', lbs: 25, kg: 11.3 },
      { plateIndex: 3, label: '37.5 lbs', lbs: 37.5, kg: 17.0 },
      { plateIndex: 4, label: '50 lbs', lbs: 50, kg: 22.7 },
      { plateIndex: 5, label: '62.5 lbs', lbs: 62.5, kg: 28.3 },
      { plateIndex: 6, label: '75 lbs', lbs: 75, kg: 34.0 },
      { plateIndex: 7, label: '87.5 lbs', lbs: 87.5, kg: 39.7 },
      { plateIndex: 8, label: '100 lbs', lbs: 100, kg: 45.4 },
      { plateIndex: 9, label: '112.5 lbs', lbs: 112.5, kg: 51.0 },
      { plateIndex: 10, label: '125 lbs', lbs: 125, kg: 56.7 },
      { plateIndex: 11, label: '137.5 lbs', lbs: 137.5, kg: 62.4 },
      { plateIndex: 12, label: '150 lbs', lbs: 150, kg: 68.0 },
      { plateIndex: 13, label: '162.5 lbs', lbs: 162.5, kg: 73.7 },
      { plateIndex: 14, label: '175 lbs', lbs: 175, kg: 79.4 },
      { plateIndex: 15, label: '187.5 lbs', lbs: 187.5, kg: 85.0 },
      { plateIndex: 16, label: '200 lbs', lbs: 200, kg: 90.7 },
    ]
  },
  {
    id: 'crossover5',
    name: 'Crossover / Thỏi nhẹ (7.5 + 5 lbs)',
    tag: 'Tập nhẹ / Vai / Tay',
    description: 'Miếng đầu 7.5 lbs (~3.4kg), các miếng tiếp theo tăng 5 lbs (~2.3kg)',
    plates: [
      { plateIndex: 1, label: '7.5 lbs', lbs: 7.5, kg: 3.4 },
      { plateIndex: 2, label: '12.5 lbs', lbs: 12.5, kg: 5.7 },
      { plateIndex: 3, label: '17.5 lbs', lbs: 17.5, kg: 7.9 },
      { plateIndex: 4, label: '22.5 lbs', lbs: 22.5, kg: 10.2 },
      { plateIndex: 5, label: '27.5 lbs', lbs: 27.5, kg: 12.5 },
      { plateIndex: 6, label: '32.5 lbs', lbs: 32.5, kg: 14.7 },
      { plateIndex: 7, label: '37.5 lbs', lbs: 37.5, kg: 17.0 },
      { plateIndex: 8, label: '42.5 lbs', lbs: 42.5, kg: 19.3 },
      { plateIndex: 9, label: '47.5 lbs', lbs: 47.5, kg: 21.5 },
      { plateIndex: 10, label: '52.5 lbs', lbs: 52.5, kg: 23.8 },
      { plateIndex: 11, label: '57.5 lbs', lbs: 57.5, kg: 26.1 },
      { plateIndex: 12, label: '62.5 lbs', lbs: 62.5, kg: 28.3 },
      { plateIndex: 13, label: '67.5 lbs', lbs: 67.5, kg: 30.6 },
      { plateIndex: 14, label: '72.5 lbs', lbs: 72.5, kg: 32.9 },
      { plateIndex: 15, label: '77.5 lbs', lbs: 77.5, kg: 35.2 },
      { plateIndex: 16, label: '82.5 lbs', lbs: 82.5, kg: 37.4 },
    ]
  },
  {
    id: 'matrix15',
    name: 'Matrix / Cybex / 15 lbs',
    tag: 'Bước 15 lbs',
    description: 'Thỏi tạ bước 15 lbs (~6.8kg/miếng) trên các máy kéo xô / cáp tải nặng',
    plates: [
      { plateIndex: 1, label: '15 lbs', lbs: 15, kg: 6.8 },
      { plateIndex: 2, label: '30 lbs', lbs: 30, kg: 13.6 },
      { plateIndex: 3, label: '45 lbs', lbs: 45, kg: 20.4 },
      { plateIndex: 4, label: '60 lbs', lbs: 60, kg: 27.2 },
      { plateIndex: 5, label: '75 lbs', lbs: 75, kg: 34.0 },
      { plateIndex: 6, label: '90 lbs', lbs: 90, kg: 40.8 },
      { plateIndex: 7, label: '105 lbs', lbs: 105, kg: 47.6 },
      { plateIndex: 8, label: '120 lbs', lbs: 120, kg: 54.4 },
      { plateIndex: 9, label: '135 lbs', lbs: 135, kg: 61.2 },
      { plateIndex: 10, label: '150 lbs', lbs: 150, kg: 68.0 },
      { plateIndex: 11, label: '165 lbs', lbs: 165, kg: 74.8 },
      { plateIndex: 12, label: '180 lbs', lbs: 180, kg: 81.6 },
      { plateIndex: 13, label: '195 lbs', lbs: 195, kg: 88.5 },
      { plateIndex: 14, label: '210 lbs', lbs: 210, kg: 95.3 },
    ]
  },
  {
    id: 'standard10',
    name: 'Bước 10 lbs (10, 20, 30...)',
    tag: '10 lbs chuẩn',
    description: 'Tăng đều 10 lbs (~4.5kg) mỗi nấc',
    plates: [
      { plateIndex: 1, label: '10 lbs', lbs: 10, kg: 4.5 },
      { plateIndex: 2, label: '20 lbs', lbs: 20, kg: 9.1 },
      { plateIndex: 3, label: '30 lbs', lbs: 30, kg: 13.6 },
      { plateIndex: 4, label: '40 lbs', lbs: 40, kg: 18.1 },
      { plateIndex: 5, label: '50 lbs', lbs: 50, kg: 22.7 },
      { plateIndex: 6, label: '60 lbs', lbs: 60, kg: 27.2 },
      { plateIndex: 7, label: '70 lbs', lbs: 70, kg: 31.8 },
      { plateIndex: 8, label: '80 lbs', lbs: 80, kg: 36.3 },
      { plateIndex: 9, label: '90 lbs', lbs: 90, kg: 40.8 },
      { plateIndex: 10, label: '100 lbs', lbs: 100, kg: 45.4 },
      { plateIndex: 11, label: '110 lbs', lbs: 110, kg: 49.9 },
      { plateIndex: 12, label: '120 lbs', lbs: 120, kg: 54.4 },
      { plateIndex: 13, label: '130 lbs', lbs: 130, kg: 59.0 },
      { plateIndex: 14, label: '140 lbs', lbs: 140, kg: 63.5 },
      { plateIndex: 15, label: '150 lbs', lbs: 150, kg: 68.0 },
    ]
  },
  {
    id: 'numbered',
    name: 'Chỉ đánh số miếng 1, 2, 3... 20',
    tag: 'Đánh số thứ tự',
    description: 'Nhiều máy phòng gym Việt Nam chỉ dán số 1 đến 20 (ước lượng ~5kg/miếng)',
    plates: Array.from({ length: 20 }, (_, i) => ({
      plateIndex: i + 1,
      label: `Miếng số ${i + 1}`,
      lbs: Math.round((i + 1) * 11),
      kg: Math.round((i + 1) * 5 * 10) / 10
    }))
  },
  {
    id: 'kg_standard',
    name: 'Máy Khối Hệ KG Chuẩn (5, 7.5, 10...)',
    tag: 'Hệ KG',
    description: 'Thỏi tạ in trực tiếp số kg: 5, 7.5, 10, 12.5, 15, 17.5... 80kg',
    plates: [
      5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80
    ].map((kgVal, i) => ({
      plateIndex: i + 1,
      label: `${kgVal} kg`,
      lbs: Math.round(kgVal * 2.20462 * 10) / 10,
      kg: kgVal
    }))
  }
];

const PRESET_STORAGE_KEY = 'fitbod_cable_preset';

export const CableStackModal: React.FC<CableStackModalProps> = ({
  initialWeight = 20,
  initialRatio = '2:1',
  exerciseName = 'Bài kéo cáp',
  onApply,
  onClose
}) => {
  const [pulleyRatio, setPulleyRatio] = useState<'1:1' | '2:1'>(initialRatio);
  
  const [activePresetId, setActivePresetId] = useState<CableStackPreset>(() => {
    try {
      const saved = localStorage.getItem(PRESET_STORAGE_KEY);
      if (saved && CABLE_PRESETS.some(p => p.id === saved)) {
        return saved as CableStackPreset;
      }
    } catch (e) {}
    return 'lifefitness';
  });

  const [selectedBaseKg, setSelectedBaseKg] = useState<number>(initialWeight > 0 ? initialWeight : 20);
  const [customLbsInput, setCustomLbsInput] = useState<string>('');
  const [addonKg, setAddonKg] = useState<number>(0);

  const handleSelectPreset = (presetId: CableStackPreset) => {
    setActivePresetId(presetId);
    try {
      localStorage.setItem(PRESET_STORAGE_KEY, presetId);
    } catch (e) {}
  };

  const activePreset = CABLE_PRESETS.find(p => p.id === activePresetId) || CABLE_PRESETS[0];

  const handleCustomLbsChange = (valStr: string) => {
    setCustomLbsInput(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed > 0) {
      const convertedKg = Math.round(parsed * 0.45359237 * 10) / 10;
      setSelectedBaseKg(convertedKg);
    }
  };

  const handleSelectPlate = (plate: PlateInfo) => {
    setSelectedBaseKg(plate.kg);
    setCustomLbsInput(plate.lbs.toString());
  };

  const totalStackWeight = Math.round((selectedBaseKg + addonKg) * 10) / 10;
  const effectiveResistance = pulleyRatio === '2:1' ? Math.round((totalStackWeight / 2) * 10) / 10 : totalStackWeight;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 max-h-[86dvh] sm:max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom duration-200 pb-[calc(1.25rem+env(safe-area-inset-bottom,20px))]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Nấc Cáp & Số LBS Phòng Gym</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">{exerciseName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
          
          {/* Direct LBS Keyboard Input Box */}
          <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                Tự gõ số LBS trên máy của Sếp:
              </span>
              <span className="text-[10px] text-purple-700 font-extrabold bg-white px-2 py-0.5 rounded-md border border-purple-200">
                Gõ số tự do
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  value={customLbsInput}
                  onChange={(e) => handleCustomLbsChange(e.target.value)}
                  placeholder="VD: 12.5, 17.5, 37.5, 62.5..."
                  className="w-full pl-3 pr-12 py-2.5 bg-white rounded-xl border border-purple-300 font-mono font-black text-base text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-inner placeholder:text-slate-300 placeholder:font-normal"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-purple-700">
                  lbs
                </span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border border-purple-200 text-center shrink-0 min-w-[75px]">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Quy ra KG</span>
                <span className="text-sm font-black font-mono text-purple-700">
                  {selectedBaseKg} kg
                </span>
              </div>
            </div>
            <p className="text-[10px] text-purple-600 mt-1.5 leading-tight">
              💡 Máy phòng gym ghi số lbs lẻ? Cứ gõ thẳng vào ô trên, hệ thống tự quy đổi ra kg chuẩn!
            </p>
          </div>

          {/* Big Live Resistance Display */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-4 rounded-3xl text-center shadow-lg relative overflow-hidden">
            <div className="inline-block px-2.5 py-0.5 bg-white/15 backdrop-blur rounded-full text-[10px] font-bold text-purple-200 uppercase tracking-wider mb-2">
              Mức Tạ Khối Đang Chọn
            </div>

            <div className="flex items-center justify-center gap-3 my-1">
              <div>
                <span className="text-3xl font-black font-mono tracking-tight text-white">{totalStackWeight}</span>
                <span className="text-sm font-bold text-purple-200 ml-1">kg</span>
                <span className="text-[10px] block text-purple-300 font-medium">
                  (~{Math.round(totalStackWeight * 2.20462 * 10) / 10} lbs cọc)
                </span>
              </div>

              {pulleyRatio === '2:1' && (
                <>
                  <span className="text-xl text-purple-400 font-bold">&rarr;</span>
                  <div className="bg-white/10 px-3 py-1.5 rounded-2xl border border-white/20">
                    <span className="text-2xl font-black text-amber-300 font-mono">{effectiveResistance}</span>
                    <span className="text-xs font-bold text-purple-100 ml-1">kg</span>
                    <span className="text-[10px] block text-amber-200 font-bold">Lực kéo thực tế (2:1)</span>
                  </div>
                </>
              )}
            </div>

            {addonKg > 0 && (
              <p className="text-[11px] text-purple-200 mt-2">
                (Đã gồm thỏi tạ {selectedBaseKg}kg + {addonKg}kg tạ phụ gác thêm)
              </p>
            )}
          </div>

          {/* Pulley Ratio Selector (1:1 vs 2:1) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                Tỷ Lệ Ròng Rọc (Pulley Ratio)
              </span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {pulleyRatio === '2:1' ? 'Trợ lực 50% (2:1)' : 'Trực tiếp 100% (1:1)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPulleyRatio('1:1')}
                className={`p-2.5 rounded-xl text-left border transition ${
                  pulleyRatio === '1:1'
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-extrabold text-xs">Ròng rọc đơn (1:1)</div>
                <div className={`text-[10px] mt-0.5 ${pulleyRatio === '1:1' ? 'text-purple-100' : 'text-slate-500'}`}>
                  Cắm 30kg = Kéo 30kg (VD: Kéo xô Lat Pulldown, Row)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPulleyRatio('2:1')}
                className={`p-2.5 rounded-xl text-left border transition ${
                  pulleyRatio === '2:1'
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-extrabold text-xs">Ròng rọc đôi (2:1)</div>
                <div className={`text-[10px] mt-0.5 ${pulleyRatio === '2:1' ? 'text-purple-100' : 'text-slate-500'}`}>
                  Cắm 30kg = Kéo 15kg (VD: Crossover, Tay sau, Face pull)
                </div>
              </button>
            </div>
          </div>

          {/* Preset Gym Stack Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Chọn chuẩn cọc tạ ở phòng gym:
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                {activePreset.plates.length} nấc
              </span>
            </div>

            {/* Horizontal scrollable preset pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {CABLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition border ${
                    activePresetId === preset.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 italic">
              {activePreset.description}
            </p>
          </div>

          {/* Interactive Stack Plate List */}
          <div className="bg-slate-100/80 rounded-2xl p-2 border border-slate-200 max-h-52 overflow-y-auto space-y-1.5 shadow-inner">
            {activePreset.plates.map((plate) => {
              const isSelected = Math.abs(selectedBaseKg - plate.kg) < 0.2;
              return (
                <div
                  key={plate.plateIndex}
                  onClick={() => handleSelectPlate(plate)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition select-none ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md font-black scale-[1.01]'
                      : 'bg-white text-slate-700 hover:bg-slate-50 font-bold border border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isSelected ? 'bg-white text-purple-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {plate.plateIndex}
                    </span>
                    <span className="text-xs font-bold">
                      {plate.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-black ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                      ≈ {plate.kg} kg
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-purple-100 font-bold">
                        📌 Đang cắm
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Micro Add-on Weight */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Tạ phụ gác thêm trên cọc:</span>
              <span className="text-[10px] text-slate-500">Cục tạ con gắn thêm vào chốt pin</span>
            </div>
            <div className="flex gap-1">
              {[0, 1.25, 2.5].map((extra) => (
                <button
                  key={extra}
                  type="button"
                  onClick={() => setAddonKg(extra)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition ${
                    addonKg === extra
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  +{extra}kg
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom CTA Apply */}
        <div className="pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => {
              onApply(totalStackWeight, pulleyRatio);
              onClose();
            }}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-purple-200 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Áp Dụng {totalStackWeight}kg Vào Hiệp Tập
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

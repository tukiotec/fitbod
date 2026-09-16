import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Dumbbell } from 'lucide-react';
import { calculatePlates } from '../engine/fitbodEngine';

interface PlateCalculatorModalProps {
  initialWeight?: number;
  onClose: () => void;
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  initialWeight = 60,
  onClose
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20);

  const plateColors: Record<string, string> = {
    '25kg': 'bg-red-600 text-white',
    '20kg': 'bg-blue-600 text-white',
    '15kg': 'bg-amber-500 text-white',
    '10kg': 'bg-emerald-600 text-white',
    '5kg': 'bg-neutral-800 text-white',
    '2.5kg': 'bg-neutral-500 text-white',
    '1.25kg': 'bg-neutral-300 text-neutral-800'
  };

  const { platesEachSide, weightPerSide, unmatched } = calculatePlates(targetWeight, barWeight);

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 border border-slate-200 animate-in slide-in-from-bottom duration-200 pb-[calc(1.5rem+env(safe-area-inset-bottom,16px))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Plate Calculator</h3>
              <p className="text-xs text-slate-500">Máy tính xếp đĩa tạ mỗi bên đòn</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input weight */}
        <div className="my-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Mức tạ mục tiêu (kg):</label>
            <div className="flex gap-1">
              {[40, 60, 80, 100, 120].map((w) => (
                <button
                  key={w}
                  onClick={() => setTargetWeight(w)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                    targetWeight === w 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {w}k
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTargetWeight(prev => Math.max(barWeight, prev - 2.5))}
              className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-xl text-slate-700 flex items-center justify-center active:scale-95"
            >
              -
            </button>
            <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 rounded-2xl py-2 px-3 text-center flex items-center justify-center transition">
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={targetWeight === 0 ? '' : targetWeight}
                placeholder="0"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTargetWeight(isNaN(val) ? 0 : val);
                }}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                className="w-28 text-center text-3xl font-black text-slate-900 bg-transparent outline-none"
              />
              <span className="text-sm font-semibold text-slate-500 ml-1">kg</span>
            </div>
            <button
              onClick={() => setTargetWeight(prev => prev + 2.5)}
              className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-xl text-slate-700 flex items-center justify-center active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Barbell Weight Selector */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-4 border border-slate-200/60">
          <span>Trọng lượng đòn tạ (Olympic Bar):</span>
          <div className="flex gap-1">
            {[20, 15, 10].map((bw) => (
              <button
                key={bw}
                onClick={() => setBarWeight(bw)}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  barWeight === bw ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {bw}kg
              </button>
            ))}
          </div>
        </div>

        {/* Visual Barbell Representation */}
        <div className="bg-slate-900 rounded-2xl p-4 mb-4 text-white text-center shadow-inner relative overflow-hidden">
          <p className="text-xs text-slate-400 mb-2 font-medium">
            Lắp mỗi bên đòn: <span className="text-emerald-400 font-bold text-sm">{weightPerSide} kg</span>
          </p>
          
          <div className="h-16 flex items-center justify-center gap-1.5 relative px-6">
            {/* Barbell collar */}
            <div className="w-2.5 h-10 bg-slate-400 rounded-sm shadow" />
            
            {/* Plates each side */}
            {Object.entries(platesEachSide).length === 0 ? (
              <span className="text-xs text-slate-500 italic">Đòn không (chưa cần lắp đĩa)</span>
            ) : (
              Object.entries(platesEachSide).map(([plateStr, count]) => {
                const colorClass = plateColors[plateStr] || 'bg-slate-500 text-white';
                return Array.from({ length: count }).map((_, idx) => (
                  <div
                    key={`${plateStr}-${idx}`}
                    className={`h-12 w-6 ${colorClass} rounded-md shadow flex items-center justify-center font-bold text-[10px] transform hover:scale-105 transition`}
                    title={plateStr}
                  >
                    <span className="-rotate-90 whitespace-nowrap">{plateStr.replace('kg', '')}</span>
                  </div>
                ));
              })
            )}

            {/* Barbell end */}
            <div className="w-12 h-4 bg-slate-500 rounded-r-full shadow" />
          </div>

          {unmatched > 0 && (
            <p className="text-xs text-amber-400 mt-2">
              * Còn dư {unmatched}kg chưa có đĩa nhỏ hơn để xếp.
            </p>
          )}
        </div>

        {/* Breakdown List */}
        <div className="space-y-1.5 mb-5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Danh sách đĩa cần lắp mỗi bên:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(platesEachSide).map(([plate, count]) => (
              <div key={plate} className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${plateColors[plate]?.split(' ')[0] || 'bg-slate-400'}`} />
                  Đĩa {plate}
                </span>
                <span className="text-blue-600 font-bold">{count} cái</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md active:scale-[0.99] transition"
        >
          Xác nhận & Quay lại buổi tập
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

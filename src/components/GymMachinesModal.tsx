import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Search, Dumbbell } from 'lucide-react';
import { GYM_MACHINES_CATALOG, ALL_MACHINE_IDS, getExcludedExerciseIds } from '../data/gymMachines';

interface GymMachinesModalProps {
  availableMachines: string[];
  onSave: (updatedMachines: string[]) => void;
  onClose: () => void;
}

export const GymMachinesModal: React.FC<GymMachinesModalProps> = ({
  availableMachines,
  onSave,
  onClose
}) => {
  const [selected, setSelected] = useState<string[]>(availableMachines);
  const [activeCategory, setActiveCategory] = useState<'all' | 'lower' | 'upper' | 'cable' | 'cardio'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const toggleMachine = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelected([...ALL_MACHINE_IDS]);
  };

  const handleDeselectAll = () => {
    setSelected([]);
  };

  // Filter machines based on category & search term
  const filteredMachines = GYM_MACHINES_CATALOG.filter(m => {
    const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch = 
      m.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const excludedExerciseCount = getExcludedExerciseIds(selected).length;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 max-h-[86dvh] sm:max-h-[90dvh] flex flex-col animate-in slide-in-from-bottom duration-200 pb-[calc(1.25rem+env(safe-area-inset-bottom,20px))]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-black text-slate-900 text-base leading-tight truncate">
                Chọn Máy Tập Phòng Gym Của Sếp
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Bật/tắt theo hình ảnh thực tế để tự động trừ bài máy
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 active:scale-95 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Categories & Search Bar */}
        <div className="pt-3 pb-2 space-y-2.5 shrink-0">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên máy (Đạp đùi, Pec deck, Kéo xô, Cáp...)"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5 no-scrollbar">
            {[
              { id: 'all', label: `Tất cả (${GYM_MACHINES_CATALOG.length})` },
              { id: 'lower', label: '🦵 Chân Mông' },
              { id: 'upper', label: '🏋️ Thân Trên' },
              { id: 'cable', label: '⛓️ Dàn Cáp' },
              { id: 'cardio', label: '🏃 Cardio' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick toggle all helper */}
          <div className="flex items-center justify-between px-1 text-[11px]">
            <span className="text-slate-500 font-medium">
              Đang chọn: <strong className="text-blue-600 font-extrabold">{selected.length}/{GYM_MACHINES_CATALOG.length}</strong> máy
              {excludedExerciseCount > 0 && (
                <span className="ml-1.5 text-amber-600 font-bold">(Đã trừ {excludedExerciseCount} bài)</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="font-bold text-blue-600 hover:underline"
              >
                Có Đủ Hết
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="font-bold text-slate-500 hover:text-rose-600 hover:underline"
              >
                Không Có Máy Nào
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Machines Grid with Photos */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1 overscroll-contain">
          {filteredMachines.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-bold">Không tìm thấy máy tập phù hợp</p>
            </div>
          ) : (
            filteredMachines.map((m) => {
              const hasMachine = selected.includes(m.id);

              return (
                <div
                  key={m.id}
                  onClick={() => toggleMachine(m.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer select-none flex items-start gap-3 active:scale-[0.99] ${
                    hasMachine
                      ? 'bg-white border-blue-500/80 ring-1 ring-blue-500/30 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 opacity-60 hover:opacity-80'
                  }`}
                >
                  {/* Real Photo of Machine */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative shadow-inner">
                    <img
                      src={m.imageUrl}
                      alt={m.nameVi}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {!hasMachine && (
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-[10px] font-black uppercase text-center p-1">
                        Đã trừ ra
                      </div>
                    )}
                  </div>

                  {/* Machine Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-snug">
                          {m.nameVi}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold">
                          {m.nameEn}
                        </p>
                      </div>

                      {/* Toggle Checkbox Badge */}
                      <div className={`w-6 h-6 rounded-xl flex items-center justify-center border transition shrink-0 ${
                        hasMachine
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                          : 'bg-white border-slate-300 text-transparent'
                      }`}>
                        {hasMachine && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1 line-clamp-2">
                      {m.description}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        hasMachine
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}>
                        {hasMachine ? '✓ Phòng tập có máy này' : '✗ Không có (Trừ bài)'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        • {m.exerciseIds.length} bài tập liên quan
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Apply */}
        <div className="pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => {
              onSave(selected);
              onClose();
            }}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-md shadow-blue-200 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Lưu Cấu Hình Máy Tập ({selected.length} Máy Có Sẵn)
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

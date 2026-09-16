import React from 'react';
import { Share2, PlusSquare, Smartphone, Bell, Zap, X } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-black tracking-tight">Cài Đặt Vào Màn Hình Chính</h3>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Chạy toàn màn hình như App xịn & mở khóa 100% thông báo màn hình khóa iOS
          </p>
        </div>

        {/* Benefits */}
        <div className="px-5 pt-4 pb-2 grid grid-cols-2 gap-2 border-b border-slate-100">
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl">
            <Zap className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-[11px] font-bold text-blue-900">Toàn màn hình</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl">
            <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold text-emerald-900">Báo chuông khóa máy</span>
          </div>
        </div>

        {/* 3 Step Instructions */}
        <div className="p-5 space-y-3.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Chạm vào biểu tượng <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-blue-600 font-black"><Share2 className="w-3 h-3 inline" /> Chia sẻ</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ở thanh công cụ phía dưới cùng của trình duyệt Safari.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Cuộn xuống chọn <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-black"><PlusSquare className="w-3 h-3 inline" /> Thêm vào MH chính</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                (Add to Home Screen) trong danh sách menu vừa mở.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Nhấn nút <span className="font-black text-emerald-600">"Thêm" (Add)</span> ở góc trên
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Icon Fitbod Pro sẽ xuất hiện ngay trên màn hình iPhone của Sếp!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black active:scale-[0.98] transition shadow-md shadow-blue-500/20"
          >
            Đã Hiểu • Vào Tập Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  UserPlus, 
  Check, 
  Trash2, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  getProfiles, 
  getActiveProfileId, 
  createProfile, 
  switchProfile, 
  deleteProfile,
  updateProfileName 
} from '../utils/profileStorage';

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFactoryReset?: () => void;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({ isOpen, onClose, onFactoryReset }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(getProfiles);
  const [activeId, setActiveId] = useState<string>(getActiveProfileId);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const created = createProfile(newProfileName.trim());
    setNewProfileName('');
    setProfiles(getProfiles());
    if (window.confirm('Đã tạo hồ sơ "' + created.name + '"! Chuyển sang hồ sơ này ngay bây giờ?')) {
      switchProfile(created.id);
    }
  };

  const handleSwitch = (profileId: string) => {
    if (profileId === activeId) return;
    switchProfile(profileId);
  };

  const handleDelete = (p: UserProfile) => {
    if (p.id === 'default') {
      alert('Không thể xóa hồ sơ gốc của Sếp!');
      return;
    }
    if (window.confirm('Sếp có chắc chắn muốn xóa hồ sơ "' + p.name + '"? Toàn bộ lịch sử tập của người này trên máy sẽ bị dọn sạch.')) {
      deleteProfile(p.id);
      setProfiles(getProfiles());
      setActiveId(getActiveProfileId());
    }
  };

  const handleSaveEdit = (profileId: string) => {
    if (editingName.trim()) {
      updateProfileName(profileId, editingName.trim());
      setProfiles(getProfiles());
    }
    setEditingId(null);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[86dvh] sm:max-h-[90dvh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                Hồ Sơ Người Dùng
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Dùng chung máy hoặc đổi bạn tập
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Explanation Banner */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Nếu bạn dùng điện thoại riêng của bạn:</span>
            </div>
            <p className="text-[11px] text-blue-800/90 leading-relaxed">
              Chỉ cần gửi link <b className="font-mono text-blue-900 bg-white/70 px-1 py-0.5 rounded">https://ares-fitbod-pro.surge.sh</b>. Trình duyệt trên máy bạn của Sếp sẽ tự động hoạt động độc lập 100%, <b>không bao giờ lẫn lộn hay đè dữ liệu của Sếp</b>!
            </p>
          </div>

          {/* Profiles List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Hồ sơ trên máy này ({profiles.length})
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Chạm để chuyển đổi</span>
            </div>

            <div className="space-y-2">
              {profiles.map(p => {
                const isActive = p.id === activeId;
                return (
                  <div 
                    key={p.id}
                    className={'p-3.5 rounded-2xl border transition-all flex items-center justify-between ' + (
                      isActive 
                        ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-500/20 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    )}
                  >
                    <div 
                      onClick={() => !isActive && handleSwitch(p.id)}
                      className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                    >
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0"
                        style={{ backgroundColor: p.avatarColor || '#2563eb' }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        {editingId === p.id ? (
                          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            <input 
                              type="text"
                              value={editingName}
                              onChange={e => setEditingName(e.target.value)}
                              className="text-xs font-bold border border-blue-400 rounded-lg px-2 py-1 focus:outline-none w-36"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleSaveEdit(p.id)}
                              className="px-2 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold"
                            >
                              Lưu
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 truncate">
                              {p.name}
                            </span>
                            {p.id === 'default' && (
                              <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-black rounded-md shrink-0">
                                GỐC
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isActive ? 'Đang hoạt động trên máy' : 'Chạm để đổi sang hồ sơ này'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-black rounded-xl shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Đang dùng
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSwitch(p.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-200"
                        >
                          Chọn
                        </button>
                      )}

                      {p.id !== 'default' && (
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Profile Form */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-slate-900">
                Thêm Hồ Sơ Bạn Tập Mới
              </span>
            </div>

            <form onSubmit={handleCreate} className="flex gap-2">
              <input 
                type="text"
                placeholder="Ví dụ: Bạn Nam, Hoàng, Em gái..."
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newProfileName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition shrink-0"
              >
                + Thêm
              </button>
            </form>
            <p className="text-[10px] text-slate-400 leading-tight">
              Mỗi hồ sơ có lịch sử sets, tạ, bài tập và % phục hồi cơ bắp độc lập hoàn toàn.
            </p>
          </div>

          {/* Khôi Phục Cài Đặt Gốc */}
          {onFactoryReset && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onFactoryReset}
                className="w-full py-3.5 px-4 bg-red-50 hover:bg-red-100 active:scale-[0.99] text-red-600 font-black text-xs rounded-2xl border border-red-200/80 shadow-xs flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4 text-red-500" />
                <span>Xóa Toàn Bộ Dữ Liệu & Làm Lại Từ Đầu</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,16px))]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

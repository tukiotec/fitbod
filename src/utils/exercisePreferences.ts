import { getProfileItem, setProfileItem } from './profileStorage';

export type ExercisePreferenceStatus = 'favorite' | 'standard' | 'exclude';

const PREFERENCES_KEY = 'fitbod_exercise_preferences';
const EVENT_NAME = 'fitbod_exercise_preferences_updated';

/**
 * Lấy danh sách preferences (Ưu tiên / Tiêu chuẩn / Loại trừ) của hồ sơ hiện tại.
 */
export function getExercisePreferences(): Record<string, ExercisePreferenceStatus> {
  try {
    const raw = getProfileItem(PREFERENCES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Lỗi khi đọc exercise preferences:', e);
    return {};
  }
}

/**
 * Ghi nhận hoặc cập nhật preference cho một bài tập.
 */
export function setExercisePreference(exerciseId: string, status: ExercisePreferenceStatus): void {
  if (!exerciseId) return;
  const current = getExercisePreferences();

  if (status === 'standard') {
    delete current[exerciseId];
  } else {
    current[exerciseId] = status;
  }

  try {
    setProfileItem(PREFERENCES_KEY, JSON.stringify(current));
    // Phát event để các component React tự động re-render tức thì
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { exerciseId, status, current } }));
    }
  } catch (e) {
    console.error('Lỗi khi lưu exercise preferences:', e);
  }
}

/**
 * Kiểm tra xem bài tập có thuộc danh sách Ưu Tiên (Favorite ⭐) không.
 */
export function isExerciseFavorite(id: string): boolean {
  if (!id) return false;
  const prefs = getExercisePreferences();
  return prefs[id] === 'favorite';
}

/**
 * Kiểm tra xem bài tập có bị Loại Trừ (Excluded 🚫) không.
 */
export function isExerciseExcluded(id: string): boolean {
  if (!id) return false;
  const prefs = getExercisePreferences();
  return prefs[id] === 'exclude';
}

/**
 * Đảo trạng thái Yêu Thích (Favorite ⭐): nếu đang favorite -> standard, ngược lại -> favorite
 */
export function toggleExerciseFavorite(exerciseId: string): ExercisePreferenceStatus {
  const currentStatus = getExercisePreferences()[exerciseId] || 'standard';
  const newStatus: ExercisePreferenceStatus = currentStatus === 'favorite' ? 'standard' : 'favorite';
  setExercisePreference(exerciseId, newStatus);
  return newStatus;
}

/**
 * Đảo trạng thái Loại Trừ (Exclude 🚫): nếu đang exclude -> standard, ngược lại -> exclude
 */
export function toggleExerciseExclude(exerciseId: string): ExercisePreferenceStatus {
  const currentStatus = getExercisePreferences()[exerciseId] || 'standard';
  const newStatus: ExercisePreferenceStatus = currentStatus === 'exclude' ? 'standard' : 'exclude';
  setExercisePreference(exerciseId, newStatus);
  return newStatus;
}

/**
 * Hook lắng nghe sự thay đổi preferences giữa các components
 */
export function subscribeExercisePreferences(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener();
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

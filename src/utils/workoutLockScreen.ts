/**
 * Workout Lock Screen & Live Activity Controller (Fitbod Parity)
 * Hiển thị bài tập và điều khiển chuyển bài / tick hiệp trực tiếp trên Màn hình chờ (Lock Screen)
 * của iOS (iPhone), Android và Windows khi tắt màn hình!
 */

export interface WorkoutLockScreenState {
  currentExerciseIndex: number;
  totalExercises: number;
  exerciseName: string;
  currentSetIndex: number;
  totalSets: number;
  weightKg: number;
  reps: number;
  isResting: boolean;
  restRemainingSeconds?: number;
  workoutDurationSeconds?: number;
}

export interface WorkoutLockScreenCallbacks {
  onNextExercise?: () => void;
  onPrevExercise?: () => void;
  onToggleCurrentSet?: () => void;
  onSkipRest?: () => void;
  onAdd30sRest?: () => void;
}

let silentAudioLoop: HTMLAudioElement | null = null;
let currentCallbacks: WorkoutLockScreenCallbacks = {};
let isWorkoutSessionActive = false;

// Tạo 1 DataURI WAV im lặng 1 giây chuẩn RFC
const SILENT_WAV_BASE64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

function getSilentAudioLoop(): HTMLAudioElement {
  if (!silentAudioLoop) {
    silentAudioLoop = new Audio(SILENT_WAV_BASE64);
    silentAudioLoop.loop = true;
    silentAudioLoop.volume = 0.001; // Im lặng tuyệt đối
  }
  return silentAudioLoop;
}

/**
 * Bắt đầu phiên điều khiển màn hình khoá khi vào buổi tập
 */
export function startWorkoutLockScreen(callbacks: WorkoutLockScreenCallbacks) {
  currentCallbacks = callbacks;
  isWorkoutSessionActive = true;

  if (typeof window === 'undefined') return;

  // 1. Kích hoạt phát audio ngầm im lặng để giữ tiến trình Media Session khi khóa màn hình
  const audio = getSilentAudioLoop();
  audio.currentTime = 0;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }

  // 2. Đăng ký các action handlers trên màn hình khóa
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.playbackState = 'playing';

      // Nút Qua Bài (Next Track >>)
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (currentCallbacks.onNextExercise) {
          currentCallbacks.onNextExercise();
        }
      });

      // Nút Lùi Bài (Previous Track <<)
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (currentCallbacks.onPrevExercise) {
          currentCallbacks.onPrevExercise();
        }
      });

      // Nút Play / Pause (Tick Hoàn Thành Hiệp hoặc Bỏ Qua Nghỉ)
      navigator.mediaSession.setActionHandler('play', () => {
        if (currentCallbacks.onToggleCurrentSet) {
          currentCallbacks.onToggleCurrentSet();
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        if (currentCallbacks.onToggleCurrentSet) {
          currentCallbacks.onToggleCurrentSet();
        }
      });
    } catch (e) {}
  }
}

/**
 * Cập nhật thông tin bài tập hiện tại lên màn hình khóa
 */
export function updateWorkoutLockScreen(state: WorkoutLockScreenState) {
  if (!isWorkoutSessionActive || !('mediaSession' in navigator)) return;

  try {
    let title = '';
    let artist = '';
    let album = '';

    if (state.isResting && state.restRemainingSeconds !== undefined) {
      // Khi đang nghỉ ngơi
      const mins = Math.floor(state.restRemainingSeconds / 60);
      const secs = state.restRemainingSeconds % 60;
      const timeStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      title = `📳 Nghỉ: ${timeStr} • FITBOD PRO`;
      artist = `Bài tiếp: ${state.exerciseName} (${state.weightKg}kg × ${state.reps})`;
      album = `Hiệp ${state.currentSetIndex + 1}/${state.totalSets} • Nhấn Pause để tập ngay`;
    } else {
      // Khi đang chuẩn bị tập hiệp
      const exNum = `${state.currentExerciseIndex + 1}/${state.totalExercises}`;
      title = `[Bài ${exNum}] ${state.exerciseName}`;
      artist = `Hiệp ${state.currentSetIndex + 1}/${state.totalSets} • ${state.weightKg}kg × ${state.reps} reps`;
      album = 'Fitbod Pro • Bấm Play để Xong hiệp | Next để Qua bài';
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork: [
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    });
    navigator.mediaSession.playbackState = 'playing';
  } catch (e) {}
}

/**
 * Kết thúc buổi tập - tắt toàn bộ Lock Screen Media Session
 */
export function stopWorkoutLockScreen() {
  isWorkoutSessionActive = false;
  currentCallbacks = {};

  if (silentAudioLoop) {
    try {
      silentAudioLoop.pause();
      silentAudioLoop.currentTime = 0;
    } catch (e) {}
  }

  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try {
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
    } catch (e) {}
  }
}

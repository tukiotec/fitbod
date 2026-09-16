import { Capacitor } from '@capacitor/core';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
/**
 * Background Timer & Rest Engine (Rung Im Lặng & Đếm Giờ Màn Hình Chờ iOS)
 * Chuyên dụng cho iOS Safari (iPhone 16 / iOS 18) & PWA Standalone:
 * 1. Đếm giờ trực tiếp ở Màn hình chờ (Lock Screen / Always-On Display / Dynamic Island):
 *    -> navigator.mediaSession.setPositionState: Tạo thanh đếm lùi thời gian thực đếm từng giây ở màn hình khóa iOS.
 *    -> MediaMetadata: Cập nhật tiêu đề đếm lùi trực quan (📳 Nghỉ: 1:30 • FITBOD PRO).
 * 2. Giữ màn hình luôn sáng khi nghỉ (Screen WakeLock API):
 *    -> Điện thoại đặt trên ghế / sàn gym sẽ KHÔNG TỰ ĐỘNG TẮT MÀN HÌNH sau 30s, đồng hồ đếm lùi luôn hiện rõ trước mắt!
 * 3. Chế độ Báo Rung Im Lặng (Zero Noise):
 *    -> 'vibrate' (Mặc định): Hoàn toàn không phát tiếng ồn ra loa ngoài. Khi hết giờ kích hoạt rung Taptic Engine.
 *    -> 'soft': Chuông êm dịu 0.6s (Apple Watch Ting nhẹ nhàng).
 *    -> 'loud': Chuông Gym Bell lớn 2.6s.
 */

import { CHIME_PCM_BASE64 } from './chimeBase64';
import { SOFT_CHIME_PCM_BASE64 } from './softChimeBase64';

export type RestAlertMode = 'vibrate' | 'soft' | 'loud';

const SAMPLE_RATE = 11025;
let cachedLoudChimeBytes: Uint8Array | null = null;
let cachedSoftChimeBytes: Uint8Array | null = null;

// =========================================================================
// CÀI ĐẶT CHẾ ĐỘ BÁO & GIỮ MÀN HÌNH SÁNG
// =========================================================================

export function getRestAlertMode(): RestAlertMode {
  if (typeof window === 'undefined') return 'vibrate';
  const saved = localStorage.getItem('fitbod_rest_alert_mode');
  if (saved === 'soft' || saved === 'loud' || saved === 'vibrate') {
    return saved as RestAlertMode;
  }
  return 'vibrate'; // Mặc định Rung im lặng không tiếng ồn
}

export function setRestAlertMode(mode: RestAlertMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fitbod_rest_alert_mode', mode);
}

export function getKeepScreenAwake(): boolean {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem('fitbod_keep_screen_awake');
  return saved !== null ? saved === 'true' : true; // Mặc định BẬT để màn hình không tự tắt khi nghỉ
}

export function setKeepScreenAwake(awake: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fitbod_keep_screen_awake', awake ? 'true' : 'false');
  if (!awake) {
    releaseScreenWakeLock();
  } else if (currentTargetEpoch && currentTargetEpoch > Date.now()) {
    requestScreenWakeLock();
  }
}

// =========================================================================
// SCREEN WAKE LOCK ENGINE (Chống Tắt Màn Hình Khi Nghỉ)
// =========================================================================
let wakeLockSentinel: any = null;

export async function requestScreenWakeLock() {
  if (!getKeepScreenAwake()) return;
  if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
    try {
      if (wakeLockSentinel) {
        try { await wakeLockSentinel.release(); } catch (e) {}
      }
      wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => {
        wakeLockSentinel = null;
      });
    } catch (e) {}
  }
}

export function releaseScreenWakeLock() {
  if (wakeLockSentinel) {
    try {
      wakeLockSentinel.release();
    } catch (e) {}
    wakeLockSentinel = null;
  }
}

// Tự động xin lại WakeLock khi người dùng mở lại màn hình nếu timer còn chạy
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && currentTargetEpoch && currentTargetEpoch > Date.now()) {
      requestScreenWakeLock();
    }
  });
}

// =========================================================================
// ÂM THANH & PHẦN CỨNG AUDIO STREAM
// =========================================================================

function getLoudChimeBytes(): Uint8Array {
  if (!cachedLoudChimeBytes) {
    const binary = atob(CHIME_PCM_BASE64);
    const len = binary.length;
    cachedLoudChimeBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      cachedLoudChimeBytes[i] = binary.charCodeAt(i);
    }
  }
  return cachedLoudChimeBytes;
}

function getSoftChimeBytes(): Uint8Array {
  if (!cachedSoftChimeBytes) {
    const binary = atob(SOFT_CHIME_PCM_BASE64);
    const len = binary.length;
    cachedSoftChimeBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      cachedSoftChimeBytes[i] = binary.charCodeAt(i);
    }
  }
  return cachedSoftChimeBytes;
}

function writeWavHeader(target: Uint8Array, sampleRate: number, pcmByteLength: number) {
  const view = new DataView(target.buffer, target.byteOffset, 44);
  target[0] = 0x52; target[1] = 0x49; target[2] = 0x46; target[3] = 0x46;
  view.setUint32(4, 36 + pcmByteLength, true);
  target[8] = 0x57; target[9] = 0x41; target[10] = 0x56; target[11] = 0x45;
  target[12] = 0x66; target[13] = 0x6d; target[14] = 0x74; target[15] = 0x20;
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  target[36] = 0x64; target[37] = 0x61; target[38] = 0x74; target[39] = 0x61;
  view.setUint32(40, pcmByteLength, true);
}

export function createRestAudioBlob(restSeconds: number, mode: RestAlertMode = 'vibrate'): Blob {
  const silenceFrames = Math.max(0, Math.floor(restSeconds * SAMPLE_RATE));

  let tailBytes: Uint8Array;
  if (mode === 'vibrate') {
    tailBytes = new Uint8Array(Math.floor(0.5 * SAMPLE_RATE));
    tailBytes.fill(128);
  } else if (mode === 'soft') {
    tailBytes = getSoftChimeBytes();
  } else {
    tailBytes = getLoudChimeBytes();
  }

  const totalFrames = silenceFrames + tailBytes.length;
  const wavBuffer = new Uint8Array(44 + totalFrames);
  writeWavHeader(wavBuffer, SAMPLE_RATE, totalFrames);
  wavBuffer.fill(128, 44, 44 + silenceFrames);
  wavBuffer.set(tailBytes, 44 + silenceFrames);

  return new Blob([wavBuffer], { type: 'audio/wav' });
}

let restAudioEl: HTMLAudioElement | null = null;
let currentBlobUrl: string | null = null;
let backgroundWorker: Worker | null = null;

let currentTargetEpoch: number | null = null;
let currentTotalDuration: number = 0;
let lastReportedSec: number = -1;

function getRestAudio(): HTMLAudioElement {
  if (!restAudioEl) {
    restAudioEl = new Audio();
    restAudioEl.setAttribute('playsinline', 'true');
    restAudioEl.setAttribute('webkit-playsinline', 'true');
    restAudioEl.preload = 'auto';
  }
  return restAudioEl;
}

function createTickerWorker(): Worker {
  const blobCode = `
    let timer = null;
    self.onmessage = function(e) {
      if (e.data === 'start') {
        if (timer) clearInterval(timer);
        timer = setInterval(function() {
          self.postMessage('tick');
        }, 300);
      } else if (e.data === 'stop') {
        if (timer) clearInterval(timer);
        timer = null;
      }
    };
  `;
  const blob = new Blob([blobCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

export function formatTimeDisplay(totalSeconds: number): string {
  const mins = Math.floor(Math.max(0, totalSeconds) / 60);
  const secs = Math.max(0, totalSeconds) % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export async function triggerDeviceVibration() {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Success });
      await Haptics.vibrate({ duration: 600 });
      return;
    } catch (e) {}
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator && navigator.vibrate) {
    try {
      navigator.vibrate([400, 150, 400, 150, 500]);
    } catch (e) {}
  }
}

/**
 * Cập nhật Màn hình chờ (Lock Screen / Live Activity) trên iOS & Dynamic Island
 */
export function updateLockScreenMedia(
  remainingSeconds: number,
  nextExerciseName?: string,
  onSkipRest?: () => void,
  onAdd30s?: () => void,
  mode: RestAlertMode = 'vibrate'
) {
  if (!('mediaSession' in navigator)) return;

  try {
    const timeStr = formatTimeDisplay(remainingSeconds);
    const prefix = mode === 'vibrate' ? '📳' : '⏱';
    const modeDesc = mode === 'vibrate' ? 'Rung im lặng' : (mode === 'soft' ? 'Chuông êm' : 'Chuông to');

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${prefix} Nghỉ: ${timeStr} • FITBOD PRO`,
      artist: nextExerciseName ? `Vào hiệp: ${nextExerciseName}` : `Hồi phục cơ (${modeDesc})`,
      album: 'Đồng hồ đếm ngược nghỉ cơ',
      artwork: [
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    });
    navigator.mediaSession.playbackState = 'playing';

    // ĐẾM GIÂY NGHỈ TRỰC TIẾP TRÊN MÀN HÌNH CHỜ BẰNG THANH THỜI GIAN THẬT
    if ('setPositionState' in navigator.mediaSession && currentTotalDuration > 0) {
      const position = Math.max(0, Math.min(currentTotalDuration, currentTotalDuration - remainingSeconds));
      navigator.mediaSession.setPositionState({
        duration: Math.max(1, currentTotalDuration),
        playbackRate: 1,
        position: position
      });
    }

    navigator.mediaSession.setActionHandler('pause', () => {
      if (onSkipRest) onSkipRest();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (onAdd30s) onAdd30s();
    });
  } catch (e) {}
}

export function fireLockScreenNotification(nextSetText?: string, mode: RestAlertMode = 'vibrate') {
  const title = mode === 'vibrate' ? '📳 FITBOD PRO: HẾT GIỜ NGHỈ!' : '🔔 FITBOD PRO: HẾT GIỜ NGHỈ!';
  const body = nextSetText 
    ? `Vào hiệp tiếp theo thôi Sếp: ${nextSetText}!`
    : 'Hết giờ nghỉ hồi phục, vào hiệp mới thôi Sếp ơi!';

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, {
        body,
        icon: '/apple-touch-icon.png',
        badge: '/apple-touch-icon.png',
        tag: 'rest-timer-done',
        vibrate: [400, 200, 400, 200, 500],
        silent: false
      } as any);
    }).catch(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: '/apple-touch-icon.png' });
        } catch (e) {}
      }
    });
  } else if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/apple-touch-icon.png' });
    } catch (e) {}
  }
}

export interface RestCountdownParams {
  restSeconds?: number;
  targetEpochMs: number;
  nextExerciseName?: string;
  alertMode?: RestAlertMode;
  onTick: (remainingSeconds: number) => void;
  onFinish: () => void;
  onSkipRest?: () => void;
  onAdd30s?: () => void;
}

let activeParams: RestCountdownParams | null = null;

/**
 * Bắt đầu đếm ngược nghỉ ngơi
 * Hỗ trợ đồng thời: Màn hình chờ (Lock Screen) + Giữ sáng màn hình (WakeLock) + Rung/Chuông tùy chọn
 */
export function startBackgroundRestCountdown(params: RestCountdownParams) {
  stopBackgroundRestCountdown();

  activeParams = params;
  currentTargetEpoch = params.targetEpochMs;
  const now = Date.now();
  const duration = params.restSeconds || Math.max(5, Math.ceil((params.targetEpochMs - now) / 1000));
  currentTotalDuration = duration;
  lastReportedSec = -1;
  const mode = params.alertMode || getRestAlertMode();

  // 1. Kích hoạt giữ màn hình sáng (WakeLock) để màn hình không tự tắt sau 30s
  requestScreenWakeLock();

  // 2. Tạo Dynamic Continuous WAV Audio Blob (Phần cứng CoreAudio duy trì chạy ngầm)
  const blob = createRestAudioBlob(duration, mode);
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
  }
  currentBlobUrl = URL.createObjectURL(blob);

  // 3. Kích hoạt Audio Element ngay trong User Gesture
  const audio = getRestAudio();
  audio.src = currentBlobUrl;
  audio.currentTime = 0;

  if (mode === 'vibrate') {
    audio.volume = 0.001; // Im lặng tuyệt đối, không gây tiếng ồn
  } else if (mode === 'soft') {
    audio.volume = 0.35;
  } else {
    audio.volume = 1.0;
  }

  audio.onended = () => {
    handleRestComplete();
  };

  // Đồng bộ thời gian thực từ phần cứng CoreAudio
  audio.ontimeupdate = () => {
    if (!currentTargetEpoch) return;
    const currentNow = Date.now();
    const rem = Math.max(0, Math.ceil((currentTargetEpoch - currentNow) / 1000));
    if (rem !== lastReportedSec) {
      lastReportedSec = rem;
      params.onTick(rem);
      updateLockScreenMedia(rem, params.nextExerciseName, params.onSkipRest, params.onAdd30s, mode);
    }
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }

  // 4. Lên lịch Native Local Notification cho iOS (hẹn giờ tầng hệ điều hành)
  if (Capacitor.isNativePlatform()) {
    try {
      LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: mode === 'vibrate' ? '📳 FITBOD PRO: HẾT GIỜ NGHỈ!' : '🔔 FITBOD PRO: HẾT GIỜ NGHỈ!',
            body: params.nextExerciseName
              ? `Vào hiệp tiếp theo thôi Sếp: ${params.nextExerciseName}!`
              : 'Hết giờ nghỉ hồi phục, vào hiệp mới thôi Sếp ơi!',
            schedule: { at: new Date(params.targetEpochMs) },
            sound: mode === 'vibrate' ? undefined : 'beep.wav',
            actionTypeId: '',
            extra: null
          }
        ]
      }).catch(() => {});
    } catch (e) {}
  }

  // 5. Đăng ký đếm lùi trên Màn hình chờ & Dynamic Island
  updateLockScreenMedia(duration, params.nextExerciseName, params.onSkipRest, params.onAdd30s, mode);

  // 5. Ticker Web Worker phụ trợ
  try {
    backgroundWorker = createTickerWorker();
    backgroundWorker.onmessage = () => {
      if (!currentTargetEpoch) return;
      const currentNow = Date.now();
      const rem = Math.max(0, Math.ceil((currentTargetEpoch - currentNow) / 1000));

      params.onTick(rem);

      if (rem !== lastReportedSec) {
        lastReportedSec = rem;
        updateLockScreenMedia(rem, params.nextExerciseName, params.onSkipRest, params.onAdd30s, mode);
      }

      if (rem <= 0) {
        if (audio.paused || audio.ended) {
          handleRestComplete();
        }
      }
    };
    backgroundWorker.postMessage('start');
  } catch (e) {}
}

/**
 * Điều chỉnh thời gian nghỉ (+30s, -15s...)
 */
export function adjustBackgroundRestTime(deltaSeconds: number) {
  if (!currentTargetEpoch || !activeParams) return;

  const newEpoch = Math.max(Date.now() + 3000, currentTargetEpoch + deltaSeconds * 1000);
  currentTargetEpoch = newEpoch;
  const newRem = Math.max(0, Math.ceil((newEpoch - Date.now()) / 1000));
  const mode = activeParams.alertMode || getRestAlertMode();

  const audio = getRestAudio();
  if (deltaSeconds > 0) {
    if (audio.currentTime >= deltaSeconds) {
      audio.currentTime = Math.max(0, audio.currentTime - deltaSeconds);
    } else {
      startBackgroundRestCountdown({
        ...activeParams,
        restSeconds: newRem,
        targetEpochMs: newEpoch
      });
      return;
    }
  } else if (deltaSeconds < 0) {
    const forwardSec = Math.abs(deltaSeconds);
    audio.currentTime = Math.min(currentTotalDuration, audio.currentTime + forwardSec);
  }

  updateLockScreenMedia(newRem, activeParams.nextExerciseName, activeParams.onSkipRest, activeParams.onAdd30s, mode);
  activeParams.onTick(newRem);
}

function handleRestComplete() {
  const params = activeParams;
  const mode = params?.alertMode || getRestAlertMode();
  stopBackgroundRestCountdown();

  // 1. Kích hoạt rung phần cứng
  triggerDeviceVibration();

  // 2. Bắn thông báo ngoài màn hình khóa (iOS rung Taptic Engine)
  fireLockScreenNotification(params?.nextExerciseName, mode);

  // 3. Đổi title màn hình khóa
  if ('mediaSession' in navigator) {
    try {
      const finishTitle = mode === 'vibrate' ? '📳 HẾT GIỜ NGHỈ! Vào tập!' : '🔔 HẾT GIỜ NGHỈ! Vào tập!';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: finishTitle,
        artist: params?.nextExerciseName || 'Fitbod Pro',
        album: 'Fitbod Pro Rest Timer',
        artwork: [
          { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ]
      });
    } catch (e) {}
  }

  if (params && params.onFinish) {
    params.onFinish();
  }
}

/**
 * Hủy đếm ngược và dừng âm thanh + nhả WakeLock
 */
export function stopBackgroundRestCountdown() {
  currentTargetEpoch = null;
  releaseScreenWakeLock();

  if (Capacitor.isNativePlatform()) {
    try {
      LocalNotifications.cancel({ notifications: [{ id: 1001 }] }).catch(() => {});
    } catch (e) {}
  }

  if (backgroundWorker) {
    try {
      backgroundWorker.postMessage('stop');
      backgroundWorker.terminate();
    } catch (e) {}
    backgroundWorker = null;
  }

  if (restAudioEl) {
    try {
      restAudioEl.pause();
      restAudioEl.removeAttribute('src');
      restAudioEl.load();
    } catch (e) {}
  }

  if (currentBlobUrl) {
    try {
      URL.revokeObjectURL(currentBlobUrl);
    } catch (e) {}
    currentBlobUrl = null;
  }
}

export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch (e) {
    return 'denied';
  }
}

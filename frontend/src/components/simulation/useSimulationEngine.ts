'use client';

/**
 * Đồng hồ mô phỏng — bước thời gian CỐ ĐỊNH.
 *
 * Mỗi khung hình đẩy mô phỏng đi đúng 1000/60 ms (nhân với hệ số tốc độ),
 * BẤT KỂ khung đó thực tế mất bao lâu để vẽ. Đây là khác biệt cốt lõi so
 * với cách làm thông thường (lấy delta của performance.now()):
 *
 *   • Tất định — cùng kịch bản, cùng tốc độ thì luôn ra đúng cùng một dãy
 *     khung hình. Playwright dựng lại video bài giảng lần thứ hai sẽ khớp
 *     từng khung với lần thứ nhất.
 *   • Không "nhảy cóc" — máy yếu chỉ làm video chạy chậm hơn theo đồng hồ
 *     tường, chứ không làm gói tin dịch chuyển giật cục.
 *   • Không đọc giờ hệ thống ở bất kỳ đâu.
 *
 * Đổi lại: nếu trình duyệt tụt xuống 30fps thì mô phỏng cũng chậm đi một
 * nửa theo thời gian thực. Với một trang chỉ vẽ vài chục hình khối thì điều
 * đó gần như không xảy ra, và đánh đổi này rẻ hơn nhiều so với mất tính lặp lại.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SimStep } from './types';

export const FRAME_MS = 1000 / 60;

/** Các mức tốc độ phát. 1× là thời lượng gốc ghi trong kịch bản. */
export const SPEEDS = [0.25, 0.5, 1, 1.5, 2, 3] as const;

export interface EngineSnapshot {
  stepIndex: number;
  /** Tiến độ 0..1 trong bước hiện tại. */
  stepProgress: number;
  /** Số khung đã vẽ kể từ khi gắn — trục thời gian của hoạt ảnh nền. */
  frame: number;
  playing: boolean;
  finished: boolean;
}

export interface UseSimulationEngineArgs {
  steps: SimStep[];
  /** Gọi khi con trỏ BƯỚC SANG một bước mới (kể cả khi tua tay). */
  onStepEnter?: (index: number, step: SimStep) => void;
  onFinish?: () => void;
}

export function useSimulationEngine({ steps, onStepEnter, onFinish }: UseSimulationEngineArgs) {
  const snap = useRef<EngineSnapshot>({ stepIndex: 0, stepProgress: 0, frame: 0, playing: false, finished: false });
  const speedRef = useRef(1);

  // Chỉ những gì giao diện React thực sự cần mới nằm trong state — tiến độ
  // trong bước được cập nhật giới hạn (xem UI_TICK_EVERY) để không render
  // lại bảng thông tin 60 lần mỗi giây.
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [uiTick, setUiTick] = useState(0);

  const onStepEnterRef = useRef(onStepEnter);
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onStepEnterRef.current = onStepEnter;
    onFinishRef.current = onFinish;
  });

  // Đổi kịch bản / đổi tuỳ chọn → về đầu. So sánh bằng tham chiếu mảng là đủ
  // vì `resolveSteps` được memo hoá theo (scenario, options).
  useEffect(() => {
    snap.current = { stepIndex: 0, stepProgress: 0, frame: snap.current.frame, playing: false, finished: false };
    setStepIndex(0);
    setPlaying(false);
    setFinished(false);
    setUiTick((t) => t + 1);
  }, [steps]);

  /** Đẩy mô phỏng đi đúng một khung. Trình vẽ gọi hàm này mỗi vòng rAF. */
  const advance = useCallback(() => {
    const s = snap.current;
    s.frame += 1;
    if (!s.playing || steps.length === 0) return;

    let remaining = FRAME_MS * speedRef.current;
    // Vòng lặp để tốc độ cao (3×) vẫn có thể vượt qua nhiều bước ngắn trong
    // một khung mà không mất bước nào.
    while (remaining > 0) {
      const step = steps[s.stepIndex];
      if (!step) break;
      const left = (1 - s.stepProgress) * step.duration;
      if (remaining < left) {
        s.stepProgress += remaining / step.duration;
        break;
      }
      remaining -= left;
      if (s.stepIndex >= steps.length - 1) {
        s.stepProgress = 1;
        s.playing = false;
        s.finished = true;
        setPlaying(false);
        setFinished(true);
        onFinishRef.current?.();
        return;
      }
      s.stepIndex += 1;
      s.stepProgress = 0;
      setStepIndex(s.stepIndex);
      onStepEnterRef.current?.(s.stepIndex, steps[s.stepIndex]);
    }

    // Nhịp cập nhật giao diện: 10 lần/giây là quá đủ cho thanh tiến trình.
    if (s.frame % UI_TICK_EVERY === 0) setUiTick((t) => t + 1);
  }, [steps]);

  /* ── Điều khiển ───────────────────────────────────────────── */

  const play = useCallback(() => {
    const s = snap.current;
    // Bấm phát khi đã chạy hết thì bắt đầu lại từ đầu.
    if (s.finished) {
      s.stepIndex = 0;
      s.stepProgress = 0;
      s.finished = false;
      setStepIndex(0);
      setFinished(false);
      onStepEnterRef.current?.(0, steps[0]);
    }
    s.playing = true;
    setPlaying(true);
  }, [steps]);

  const pause = useCallback(() => {
    snap.current.playing = false;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (snap.current.playing) pause();
    else play();
  }, [pause, play]);

  /** Nhảy tới đầu một bước bất kỳ. Dùng cho thanh tua và phím ← →. */
  const seek = useCallback(
    (index: number, opts?: { silent?: boolean }) => {
      const s = snap.current;
      const clamped = Math.max(0, Math.min(steps.length - 1, index));
      s.stepIndex = clamped;
      s.stepProgress = 0;
      s.finished = false;
      setStepIndex(clamped);
      setFinished(false);
      setUiTick((t) => t + 1);
      if (!opts?.silent && steps[clamped]) onStepEnterRef.current?.(clamped, steps[clamped]);
    },
    [steps]
  );

  const next = useCallback(() => {
    const s = snap.current;
    // Đang ở giữa một bước thì "tiếp" nghĩa là chạy nốt bước đó trước.
    if (s.stepProgress > 0.02 && s.stepProgress < 1) seek(s.stepIndex + 1);
    else seek(s.stepIndex + 1);
  }, [seek]);

  const prev = useCallback(() => {
    const s = snap.current;
    seek(s.stepProgress > 0.25 ? s.stepIndex : s.stepIndex - 1);
  }, [seek]);

  const restart = useCallback(() => {
    seek(0);
    snap.current.playing = false;
    setPlaying(false);
  }, [seek]);

  const setSpeed = useCallback((value: number) => {
    speedRef.current = value;
    setSpeedState(value);
  }, []);

  return {
    snapshot: snap,
    advance,
    stepIndex,
    playing,
    finished,
    speed,
    uiTick,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    restart,
    setSpeed,
  };
}

const UI_TICK_EVERY = 6;

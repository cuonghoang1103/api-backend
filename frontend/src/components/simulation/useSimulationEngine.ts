'use client';

/**
 * Đồng hồ mô phỏng — chạy theo THỜI GIAN THẬT, không theo số khung.
 *
 * BÀI HỌC ĐẮT GIÁ (28/07/2026)
 * ---------------------------
 * Bản đầu đẩy mô phỏng đi đúng 1000/60 ms mỗi lần requestAnimationFrame, với
 * lập luận "đếm khung thì tất định, chạy lại lần nào cũng khớp". Lập luận đó
 * SAI ở một điểm chí mạng: rAF không chạy 60 lần mỗi giây trên mọi máy. Trên
 * màn ProMotion 120Hz (đo được đúng 120,5 fps), rAF nổ gấp đôi, nên mô phỏng
 * chạy nhanh gấp đôi thời gian thực. Hậu quả người dùng gặp phải: đặt tốc độ
 * 0,25× rồi quay, đáng lẽ ra video 28 giây thì chỉ được 15 giây, và mọi hoạt
 * cảnh đều lướt nhanh bất thường.
 *
 * Điều trớ trêu là cách đếm khung còn KÉM tái lặp hơn: độ dài video xuất ra
 * phụ thuộc vào tần số quét của màn hình người quay. Còn cách hiện tại — cộng
 * dồn delta thật — cho ra video dài đúng bằng nhau trên mọi máy, mà đó mới
 * chính là thứ cần tái lặp khi dựng video hàng loạt.
 *
 * `frame` vẫn được giữ làm "khung ảo ở 60fps" (cộng dồn theo delta thật) để
 * mọi phép tính nhấp nháy/xoay trong trình vẽ giữ nguyên nhịp cảm nhận, bất
 * kể màn hình 60Hz hay 120Hz.
 *
 * Delta bị chặn trên ở MAX_FRAME_MS: khi người dùng chuyển sang tab khác, rAF
 * ngừng chạy và lúc quay lại delta có thể lên tới vài giây — không chặn thì
 * mô phỏng nhảy vọt qua vài bước.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SimStep } from './types';

/** Một "khung ảo" quy ước ở 60fps — đơn vị của bộ đếm `frame`. */
export const FRAME_MS = 1000 / 60;

/**
 * Trần cho một bước delta. Chuyển tab làm rAF ngừng hẳn; lúc quay lại delta
 * có thể vài giây và mô phỏng sẽ nhảy qua mất mấy bước nếu không chặn.
 */
const MAX_FRAME_MS = 100;

/**
 * Các mức tốc độ phát. 1× là thời lượng gốc ghi trong kịch bản.
 *
 * 0,75× là mức dựng video bài giảng: 0,5× đọc kịp phụ đề nhưng lê thê, còn 1×
 * thì vừa nhìn xong hình đã sang bước khác. Mức này cũng phải có mặt ở đây,
 * không chỉ ở script dựng — `?speed=` được kiểm tra ngược lại danh sách này,
 * nên thiếu nó thì URL 0,75× lặng lẽ rơi về 1×.
 */
export const SPEEDS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3] as const;

/** Số vòng chạy. 0 = lặp vô hạn (dùng khi trình chiếu tại chỗ). */
export const LOOP_CHOICES = [1, 2, 3, 0] as const;

/**
 * Thời gian giữ nguyên màn kết thúc trước khi vào vòng mới.
 *
 * Không có khoảng nghỉ này thì vòng mới bắt đầu ngay khi vòng cũ vừa dứt, và
 * người xem không kịp nhận ra một vòng đã khép lại — họ tưởng hoạt cảnh bị
 * giật chứ không hiểu là đang xem lại.
 */
const HOLD_MS = 1200;

export interface EngineSnapshot {
  stepIndex: number;
  /** Tiến độ 0..1 trong bước hiện tại. */
  stepProgress: number;
  /**
   * "Khung ảo ở 60fps" đã trôi qua — trục thời gian của hoạt ảnh nền.
   * Cộng dồn theo thời gian THẬT nên nhịp nhấp nháy giống nhau ở mọi tần số quét.
   */
  frame: number;
  playing: boolean;
  finished: boolean;
  /** Vòng hiện tại, đếm từ 0. */
  loop: number;
  /** Số mili-giây còn phải giữ màn kết thúc trước khi sang vòng mới. */
  holding: number;
}

export interface UseSimulationEngineArgs {
  steps: SimStep[];
  /** Gọi khi con trỏ BƯỚC SANG một bước mới (kể cả khi tua tay). */
  onStepEnter?: (index: number, step: SimStep) => void;
  onFinish?: () => void;
}

export function useSimulationEngine({ steps, onStepEnter, onFinish }: UseSimulationEngineArgs) {
  const snap = useRef<EngineSnapshot>({ stepIndex: 0, stepProgress: 0, frame: 0, playing: false, finished: false, loop: 0, holding: 0 });
  const speedRef = useRef(1);
  const loopsRef = useRef(1);
  /** Mốc thời gian của khung trước — null ở khung đầu tiên. */
  const lastTsRef = useRef<number | null>(null);
  const lastUiBucketRef = useRef(-1);

  // Chỉ những gì giao diện React thực sự cần mới nằm trong state — tiến độ
  // trong bước được cập nhật giới hạn (xem UI_TICK_EVERY) để không render
  // lại bảng thông tin 60 lần mỗi giây.
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [loops, setLoopsState] = useState(1);
  const [loopIndex, setLoopIndex] = useState(0);
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
    snap.current = { stepIndex: 0, stepProgress: 0, frame: snap.current.frame, playing: false, finished: false, loop: 0, holding: 0 };
    setStepIndex(0);
    setPlaying(false);
    setFinished(false);
    setLoopIndex(0);
    setUiTick((t) => t + 1);
  }, [steps]);

  /** Đẩy mô phỏng đi một khung. Trình vẽ gọi hàm này mỗi vòng rAF. */
  const advance = useCallback(() => {
    const s = snap.current;

    // Delta THẬT giữa hai khung. Đây là điểm khác biệt sống còn so với bản
    // đầu (cộng cứng 1000/60): trên màn 120Hz bản cũ chạy nhanh gấp đôi.
    const now = performance.now();
    const raw = lastTsRef.current == null ? FRAME_MS : now - lastTsRef.current;
    lastTsRef.current = now;
    const delta = Math.min(Math.max(raw, 0), MAX_FRAME_MS);

    s.frame += delta / FRAME_MS;
    if (!s.playing || steps.length === 0) return;

    // Đang giữ màn kết thúc giữa hai vòng: đếm ngược rồi mở vòng mới.
    if (s.holding > 0) {
      s.holding = Math.max(0, s.holding - delta);
      if (s.holding === 0) {
        s.loop += 1;
        s.stepIndex = 0;
        s.stepProgress = 0;
        s.finished = false;
        setLoopIndex(s.loop);
        setStepIndex(0);
        setFinished(false);
        onStepEnterRef.current?.(0, steps[0]);
      }
      return;
    }

    let remaining = delta * speedRef.current;
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
        s.finished = true;
        setFinished(true);
        // loops = 0 nghĩa là lặp vô hạn.
        const total = loopsRef.current;
        const moreToGo = total === 0 || s.loop + 1 < total;
        if (moreToGo) {
          // Giữ màn kết thúc rồi tự mở vòng mới — KHÔNG gọi onFinish, vì với
          // phòng thu thì "xong" nghĩa là xong TẤT CẢ các vòng.
          s.holding = HOLD_MS;
          return;
        }
        s.playing = false;
        setPlaying(false);
        onFinishRef.current?.();
        return;
      }
      s.stepIndex += 1;
      s.stepProgress = 0;
      setStepIndex(s.stepIndex);
      onStepEnterRef.current?.(s.stepIndex, steps[s.stepIndex]);
    }

    // Nhịp cập nhật giao diện: ~10 lần/giây là quá đủ cho thanh tiến trình.
    // `frame` giờ là số THỰC nên `% 6 === 0` gần như không bao giờ đúng —
    // phải so sánh phần nguyên của nhóm thay vì lấy dư.
    const bucket = Math.floor(s.frame / UI_TICK_EVERY);
    if (bucket !== lastUiBucketRef.current) {
      lastUiBucketRef.current = bucket;
      setUiTick((t) => t + 1);
    }
  }, [steps]);

  /* ── Điều khiển ───────────────────────────────────────────── */

  const play = useCallback(() => {
    const s = snap.current;
    // Bấm phát khi đã chạy hết thì bắt đầu lại từ đầu, kể cả bộ đếm vòng.
    if (s.finished) {
      s.stepIndex = 0;
      s.stepProgress = 0;
      s.finished = false;
      s.holding = 0;
      s.loop = 0;
      setStepIndex(0);
      setFinished(false);
      setLoopIndex(0);
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
      s.holding = 0;
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
    snap.current.loop = 0;
    setLoopIndex(0);
    setPlaying(false);
  }, [seek]);

  const setSpeed = useCallback((value: number) => {
    speedRef.current = value;
    setSpeedState(value);
  }, []);

  const setLoops = useCallback((value: number) => {
    loopsRef.current = value;
    setLoopsState(value);
  }, []);

  return {
    snapshot: snap,
    advance,
    stepIndex,
    playing,
    finished,
    speed,
    loops,
    loopIndex,
    uiTick,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    restart,
    setSpeed,
    setLoops,
  };
}

const UI_TICK_EVERY = 6;

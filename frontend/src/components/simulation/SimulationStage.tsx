'use client';

/**
 * Sân khấu: một thẻ <canvas> 1920×1080 và vòng lặp requestAnimationFrame.
 *
 * Toàn bộ hoạt cảnh nằm TRONG canvas này — kể cả tiêu đề, chú giải và phụ
 * đề bài giảng. Lý do: `captureStream()` chỉ lấy được nội dung canvas, nên
 * bất cứ thứ gì vẽ bằng DOM sẽ không xuất hiện trong video. Đặt phụ đề lên
 * canvas nghĩa là file .webm xuất ra đã tự giải thích được, không cần dựng
 * lại lời thoại ở phần mềm khác.
 */

import { useEffect, useMemo, useRef } from 'react';
import { drawFrame, nodeStatesAt, type FrameState } from './canvasRenderer';
import { CANVAS_H, CANVAS_W, computeLayout } from './layout';
import type { Lang, NodeState, Scenario, SimStep } from './types';
import type { useSimulationEngine } from './useSimulationEngine';

/**
 * Linh vật gấu trúc dùng làm dấu thương hiệu trên khung hình.
 * Lấy bản 512px (không phải favicon 32px) để khi vẽ xuống 46px trên canvas
 * 1080p vẫn nét — thu nhỏ ảnh lớn thì mượt, phóng to ảnh nhỏ thì rỗ.
 */
const BRAND_LOGO_SRC = '/android-chrome-512x512.png';

interface Props {
  scenario: Scenario;
  steps: SimStep[];
  lang: Lang;
  engine: ReturnType<typeof useSimulationEngine>;
  variantLabel: string;
  showCaption: boolean;
  showLegend: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Bấm vào sân khấu = phát/tạm dừng, giống trình phát video. */
  onToggle?: () => void;
}

export default function SimulationStage({
  scenario,
  steps,
  lang,
  engine,
  variantLabel,
  showCaption,
  showLegend,
  canvasRef,
  onToggle,
}: Props) {
  // Hình học chỉ phụ thuộc sơ đồ, nên tính một lần cho mỗi kịch bản.
  const { boxes, geoms } = useMemo(() => computeLayout(scenario.nodes, scenario.edges), [scenario]);

  // Bộ nhớ đệm trạng thái node theo chỉ số bước: tránh dựng lại object ở
  // cả 60 khung mỗi giây trong khi nó chỉ đổi khi sang bước mới.
  const stateCache = useRef<Map<number, Record<string, NodeState>>>(new Map());
  useEffect(() => {
    stateCache.current = new Map();
  }, [steps]);

  const advanceRef = useRef(engine.advance);
  advanceRef.current = engine.advance;
  const snapRef = engine.snapshot;
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;

    const loop = () => {
      if (cancelled) return;
      advanceRef.current();
      const s = snapRef.current;

      let nodeStates = stateCache.current.get(s.stepIndex);
      if (!nodeStates) {
        nodeStates = nodeStatesAt(steps, s.stepIndex);
        stateCache.current.set(s.stepIndex, nodeStates);
      }

      const frameState: FrameState = {
        scenario,
        steps,
        stepIndex: s.stepIndex,
        stepProgress: s.stepProgress,
        nodeStates,
        lang,
        frame: s.frame,
        showCaption,
        showLegend,
        variantLabel,
        finished: s.finished,
        logo: logoRef.current,
      };
      drawFrame(ctx, frameState, boxes, geoms);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (cancelled) return;
      raf = requestAnimationFrame(loop);
    };

    // Chờ font tự lưu trữ (@fontsource) VÀ ảnh linh vật nạp xong rồi mới vẽ
    // khung đầu tiên. Nếu không, khung đầu dùng font dự phòng và thiếu logo
    // rồi "nhảy" một nhịp — rất lộ khi đúng khung đó mở đầu video, và làm hỏng
    // tính tất định mà phiên dựng video headless dựa vào.
    const ready: Promise<unknown>[] = [];
    if (typeof document !== 'undefined' && 'fonts' in document) {
      ready.push((document as Document & { fonts: FontFaceSet }).fonts.ready);
    }
    if (logoRef.current) {
      // Đã nạp ở lần gắn trước (đổi kịch bản không cần tải lại).
    } else {
      ready.push(
        new Promise<void>((resolve) => {
          const img = new Image();
          // Ảnh CÙNG NGUỒN: không cần crossOrigin và không làm canvas nhiễm
          // bẩn — canvas nhiễm bẩn thì captureStream() ném lỗi và mất nút quay.
          img.onload = () => {
            logoRef.current = img;
            resolve();
          };
          // Hỏng ảnh thì vẫn chạy, khối thương hiệu tự lùi về dạng chỉ có chữ.
          img.onerror = () => resolve();
          img.src = BRAND_LOGO_SRC;
        })
      );
    }

    if (ready.length === 0) startLoop();
    else void Promise.all(ready).then(startLoop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [boxes, canvasRef, geoms, lang, scenario, showCaption, showLegend, snapRef, steps, variantLabel]);

  return (
    <div className="sim-stage-frame relative w-full overflow-hidden rounded-2xl border border-[#1d2740] bg-[#04050a] shadow-[0_0_60px_-18px_rgba(56,189,248,0.35)]">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={onToggle}
        // aspect-video khoá đúng 16:9 của backing store, nên hình không bao
        // giờ bị kéo méo dù khung chứa rộng hẹp thế nào.
        className="block aspect-video w-full cursor-pointer select-none"
        aria-label={
          lang === 'vi'
            ? `Sơ đồ mô phỏng ${scenario.name.vi}. Bấm để phát hoặc tạm dừng.`
            : `Simulation diagram for ${scenario.name.en}. Click to play or pause.`
        }
        role="img"
      />
    </div>
  );
}

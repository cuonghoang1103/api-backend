'use client';

/**
 * Bộ điều phối của trang /simulation.
 *
 * Ghép năm mảnh lại với nhau: sổ kịch bản (dữ liệu), đồng hồ mô phỏng, trình
 * vẽ canvas, bộ tổng hợp âm thanh và phòng thu. Bản thân file này gần như
 * không chứa logic mô phỏng — nó chỉ nối dây và giữ trạng thái đồng bộ với URL.
 *
 * TRẠNG THÁI NẰM Ở URL
 * --------------------
 * Kịch bản, mọi tuỳ chọn, ngôn ngữ, tốc độ đều được ghi vào query string:
 *
 *   /simulation?scenario=rest-api&method=POST&status=201&lang=vi&autoplay=1&chrome=off
 *
 * Nhờ vậy một URL là một bài giảng: gửi link cho học viên, nhúng vào bài học,
 * hoặc để Playwright mở headless rồi quay video hàng loạt. `chrome=off` bỏ
 * toàn bộ giao diện điều khiển, chỉ để lại khung hoạt cảnh 16:9.
 *
 * KHÔNG dùng router của Next để ghi URL: `history.replaceState` không kích
 * hoạt render lại, nên kéo thanh tua hay đổi tuỳ chọn không làm giật trang.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Keyboard,
  Languages,
  Link2,
  Maximize2,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Subtitles,
} from 'lucide-react';
import ControlPanel from './ControlPanel';
import InspectorPanel from './InspectorPanel';
import RecorderStudio from './RecorderStudio';
import SimulationStage from './SimulationStage';
import TimelineScrubber from './TimelineScrubber';
import { DEFAULT_GROUP_ID, DEFAULT_SCENARIO_ID, SCENARIOS, defaultOptions, getScenario, resolvePanels, resolveSteps, sanitizeOptions, totalDuration } from './scenarios';
import { LOOP_CHOICES, SPEEDS, useSimulationEngine } from './useSimulationEngine';
import { useSoundEngine } from './useSoundEngine';
import { useStudioRecorder } from './useStudioRecorder';
import { renderSfxTrackToWav, type SfxCue } from './sfx';
import { lessonPath, tr } from './types';
import type { Lang, ScenarioOptions, SimStep } from './types';

/**
 * Bài học mà người xem vừa rời khỏi để mở mô phỏng này.
 *
 * Chỉ nhận slug — KHÔNG nhận URL — nên không có cách nào biến nút "quay lại"
 * thành một cú chuyển hướng ra ngoài miền.
 */
interface FromLesson {
  course: string;
  lesson: string;
  title: string | null;
}

/** Slug hợp lệ: chữ thường, số, gạch ngang. Sai định dạng thì coi như không có. */
const cleanSlug = (v: string | null): string | null =>
  v && /^[a-z0-9][a-z0-9-]{0,120}$/i.test(v) ? v : null;

function readFrom(sp: URLSearchParams): FromLesson | null {
  const course = cleanSlug(sp.get('fromCourse'));
  const lesson = cleanSlug(sp.get('fromLesson'));
  if (!course || !lesson) return null;
  const title = (sp.get('fromTitle') ?? '').trim();
  return { course, lesson, title: title ? title.slice(0, 160) : null };
}

/** Đọc tham số URL một lần lúc gắn — sau đó URL chỉ được GHI, không đọc lại. */
function readInitialParams() {
  if (typeof window === 'undefined') {
    return { raw: {} as Record<string, string>, scenarioId: DEFAULT_SCENARIO_ID, lang: 'vi' as Lang, autoplay: false, chrome: true, caption: true, speed: 1, loops: 2, from: null as FromLesson | null };
  }
  const sp = new URLSearchParams(window.location.search);
  const raw: Record<string, string> = {};
  sp.forEach((v, k) => {
    raw[k] = v;
  });
  // Cẩn thận với `Number(null) === 0`: nếu URL KHÔNG có tham số thì
  // `sp.get()` trả null và Number(null) ra 0 — mà 0 lại là mã hợp lệ của
  // "lặp vô hạn". Thiếu tham số sẽ bị hiểu thành lặp mãi mãi. Ép sang NaN
  // để giá trị vắng mặt luôn rơi về mặc định.
  const speedParam = sp.has('speed') ? Number(sp.get('speed')) : NaN;
  const loopParam = sp.has('loops') ? Number(sp.get('loops')) : NaN;
  return {
    raw,
    scenarioId: sp.get('scenario') ?? DEFAULT_SCENARIO_ID,
    lang: (sp.get('lang') === 'en' ? 'en' : 'vi') as Lang,
    autoplay: sp.get('autoplay') === '1',
    chrome: sp.get('chrome') !== 'off',
    caption: sp.get('caption') !== 'off',
    speed: SPEEDS.includes(speedParam as (typeof SPEEDS)[number]) ? speedParam : 1,
    loops: LOOP_CHOICES.includes(loopParam as (typeof LOOP_CHOICES)[number]) ? loopParam : 2,
    from: readFrom(sp),
  };
}

export default function SimulationStudio() {
  const initial = useRef(readInitialParams());

  const [scenarioId, setScenarioId] = useState(() => getScenario(initial.current.scenarioId).id);
  const scenario = useMemo(() => getScenario(scenarioId), [scenarioId]);

  const [options, setOptions] = useState<ScenarioOptions>(() => sanitizeOptions(getScenario(initial.current.scenarioId), initial.current.raw));
  const [lang, setLang] = useState<Lang>(initial.current.lang);
  const [showCaption, setShowCaption] = useState(initial.current.caption);
  const [chrome, setChrome] = useState(initial.current.chrome);
  const [mobileTab, setMobileTab] = useState<'controls' | 'inspector'>('controls');
  const [copiedLink, setCopiedLink] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Hàm vẽ-tại-thời-điểm do sân khấu lắp vào — xem `SimulationStage.renderRef`.
  const renderAtRef = useRef<((ms: number) => void) | null>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);

  // Dữ liệu bước — memo theo (kịch bản, tuỳ chọn). Đây cũng chính là biên
  // tất định: cùng đầu vào luôn ra cùng mảng bước.
  const steps = useMemo(() => resolveSteps(scenario, options), [scenario, options]);
  // Cùng biên tất định với `steps`: bố cục panel cũng chỉ phụ thuộc (kịch
  // bản, tuỳ chọn). Kịch bản dạng sơ đồ trả về mảng rỗng.
  const panels = useMemo(() => resolvePanels(scenario, options), [scenario, options]);

  const sound = useSoundEngine();
  const soundRef = useRef(sound);
  soundRef.current = sound;

  // Bấm "Quay" thì tự chạy lại kịch bản và tự dừng ghi khi hết vòng cuối.
  const [autoRun, setAutoRun] = useState(true);
  const autoRunRef = useRef(true);
  autoRunRef.current = autoRun;
  const recorderRef = useRef<ReturnType<typeof useStudioRecorder> | null>(null);
  const autoStopTimerRef = useRef<number | null>(null);

  const engine = useSimulationEngine({
    steps,
    onStepEnter: useCallback((_i: number, step: SimStep) => {
      if (step?.sfx) soundRef.current.play(step.sfx);
    }, []),
    // Chỉ nổ khi ĐÃ chạy hết TẤT CẢ các vòng.
    onFinish: useCallback(() => {
      const rec = recorderRef.current;
      if (!autoRunRef.current || !rec || rec.state === 'idle') return;
      // Giữ thêm một nhịp để khung kết thúc kịp lọt vào video, rồi mới cắt.
      // Lưu id hẹn giờ để lần quay sau HUỶ được: nếu người dùng tự bấm dừng
      // rồi quay lại ngay, cái hẹn giờ cũ sẽ cắt ngang bản ghi mới.
      autoStopTimerRef.current = window.setTimeout(() => {
        autoStopTimerRef.current = null;
        rec.stop();
      }, 1400);
    }, []),
  });

  const baseName = useMemo(
    () => [scenario.id, ...scenario.options.map((o) => options[o.id])].join('-').toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
    [scenario, options]
  );
  const recorder = useStudioRecorder({ canvasRef, sound, baseName });
  recorderRef.current = recorder;

  /** Bấm quay: mở bản ghi trước, rồi mới cho kịch bản chạy lại từ đầu. */
  const handleStartRecording = useCallback(async () => {
    // Huỷ hẹn giờ tự-dừng còn sót của lần quay trước, nếu không nó sẽ cắt
    // ngang bản ghi mới ngay khi vừa bắt đầu.
    if (autoStopTimerRef.current != null) {
      window.clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
    await recorder.start();
    if (!autoRunRef.current) return;
    engine.restart();
    // Chờ một nhịp để MediaRecorder bắt được vài khung mở đầu — bắt đầu quay
    // và bắt đầu chạy trong cùng một khung hình sẽ mất mất đoạn mở.
    window.setTimeout(() => engine.play(), 350);
  }, [engine, recorder]);

  const variantLabel = useMemo(
    () => scenario.options.map((o) => o.choices.find((c) => c.value === options[o.id])?.label ?? '').filter(Boolean).join(' · '),
    [scenario, options]
  );

  /**
   * Ước lượng thời lượng một lần quay trọn: (thời lượng kịch bản ÷ tốc độ)
   * × số vòng, cộng khoảng giữ giữa các vòng và nhịp cắt cuối. Dùng để báo
   * trước dung lượng file — người dạy biết mình sắp tạo ra file bao nhiêu MB
   * TRƯỚC khi bấm quay, chứ không phải sau.
   */
  const estimatedRunMs = useMemo(() => {
    const loops = engine.loops === 0 ? 3 : engine.loops; // vô hạn thì ước theo 3 vòng
    const oneRun = totalDuration(steps) / engine.speed;
    return oneRun * loops + 1200 * (loops - 1) + 1400;
  }, [engine.loops, engine.speed, steps]);

  /* ── Đồng bộ URL ──────────────────────────────────────────── */

  const buildQuery = useCallback(() => {
    const sp = new URLSearchParams();
    sp.set('scenario', scenario.id);
    for (const opt of scenario.options) sp.set(opt.id, options[opt.id]);
    sp.set('lang', lang);
    if (engine.speed !== 1) sp.set('speed', String(engine.speed));
    sp.set('loops', String(engine.loops));
    if (!showCaption) sp.set('caption', 'off');
    if (!chrome) sp.set('chrome', 'off');
    // Ngữ cảnh quay về đi theo URL. Không giữ lại ở đây thì `replaceState`
    // ngay sau khi gắn sẽ xoá mất nút "Quay lại bài học" — và nút "Chép liên
    // kết" sẽ đưa cho học viên một link đã mất đường về.
    const from = initial.current.from;
    if (from) {
      sp.set('fromCourse', from.course);
      sp.set('fromLesson', from.lesson);
      if (from.title) sp.set('fromTitle', from.title);
    }
    return sp.toString();
  }, [chrome, engine.loops, engine.speed, lang, options, scenario, showCaption]);

  /* ── Đường về bài học ─────────────────────────────────────────
     Ưu tiên bài mà người xem VỪA RỜI (tham số `from…`): một kịch bản có thể
     được nhiều bài của nhiều môn cùng dùng, nên chỉ có URL mới biết đúng chỗ
     cần quay về. Không có thì rơi về bài "chính chủ" mà kịch bản tự khai —
     nhờ vậy link chia sẻ hay bookmark vẫn có đường sang giáo trình. */
  const backTo = useMemo(() => {
    const from = initial.current.from;
    if (from) {
      return {
        href: lessonPath({ course: from.course, slug: from.lesson }),
        label: from.title ?? (lang === 'vi' ? 'Quay lại bài học' : 'Back to the lesson'),
      };
    }
    const l = scenario.lesson;
    if (!l) return null;
    return { href: lessonPath(l), label: `${l.code} · ${tr(l.title, lang)}` };
  }, [lang, scenario]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.history.replaceState(null, '', `${window.location.pathname}?${buildQuery()}`);
  }, [buildQuery]);

  /* ── Điều khiển ───────────────────────────────────────────── */

  const handleSelectScenario = useCallback((id: string) => {
    const next = getScenario(id);
    setScenarioId(next.id);
    setOptions(defaultOptions(next));
    void soundRef.current.ensure().then(() => soundRef.current.play('click'));
  }, []);

  const handleChangeOption = useCallback((optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }));
    void soundRef.current.ensure().then(() => soundRef.current.play('click'));
  }, []);

  // Mọi lần bấm phát đều mở AudioContext trước — trình duyệt chỉ cho phép
  // khởi tạo âm thanh từ bên trong một cử chỉ người dùng.
  const handleToggle = useCallback(() => {
    void soundRef.current.ensure();
    engine.toggle();
  }, [engine]);

  const copyLink = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${buildQuery()}`);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 1800);
    } catch {
      /* Clipboard bị chặn — bỏ qua. */
    }
  }, [buildQuery]);

  const toggleFullscreen = useCallback(() => {
    const el = stageWrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  }, []);

  /* ── Phím tắt ─────────────────────────────────────────────── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Không cướp phím khi người dùng đang gõ vào ô nhập nào đó.
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleToggle();
          break;
        case 'ArrowRight':
          e.preventDefault();
          engine.next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          engine.prev();
          break;
        case 'r':
        case 'R':
          engine.restart();
          break;
        case 'm':
        case 'M':
          sound.toggleMuted();
          break;
        case 'c':
        case 'C':
          setShowCaption((v) => !v);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'h':
        case 'H':
          setChrome((v) => !v);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engine, handleToggle, sound, toggleFullscreen]);

  /* ── Tự phát theo tham số URL ─────────────────────────────── */

  /**
   * Áp tốc độ và số vòng từ URL.
   *
   * Trước đây `setSpeed` nằm TRONG nhánh autoplay, nên mở link có `speed=0.25`
   * mà không kèm `autoplay=1` thì tốc độ bị bỏ qua lặng lẽ — engine chạy 1×
   * rồi `buildQuery` xoá luôn tham số khỏi URL, khiến link gửi cho người khác
   * mất thiết lập. Phải áp ở đây, độc lập với autoplay.
   */
  const paramsInit = useRef(false);
  useEffect(() => {
    if (paramsInit.current) return;
    paramsInit.current = true;
    engine.setSpeed(initial.current.speed);
    engine.setLoops(initial.current.loops);
  }, [engine]);

  const autoplayDone = useRef(false);
  useEffect(() => {
    if (autoplayDone.current || !initial.current.autoplay) return;
    autoplayDone.current = true;
    // Chờ một nhịp để canvas kịp vẽ khung đầu — nếu quay ngay, khung mở đầu
    // của video sẽ là một ô đen.
    const t = window.setTimeout(() => engine.play(), 400);
    return () => window.clearTimeout(t);
  }, [engine]);

  /* ── Cầu nối cho Playwright ───────────────────────────────────
     Phiên dựng video hàng loạt cần ba thứ: biết trang đã sẵn sàng, điều
     khiển được phát/dừng, và biết lúc nào chạy xong để cắt bản ghi. Cả ba
     đều lộ ra ở đây, kèm thuộc tính data-* để chờ bằng selector cho gọn. */
  const snapshot = engine.snapshot;
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const api = {
      ready: true,
      scenarioId: scenario.id,
      options,
      stepCount: steps.length,
      totalDurationMs: totalDuration(steps),
      play: () => engine.play(),
      pause: () => engine.pause(),
      restart: () => engine.restart(),
      seek: (i: number) => engine.seek(i),
      setSpeed: (v: number) => engine.setSpeed(v),
      getState: () => ({ ...snapshot.current }),

      /* ── Dựng video ngoại tuyến ────────────────────────────────
         `renderAt` vẽ khung hình tại một mốc thời gian ảo và ĐÓNG BĂNG đồng
         hồ thời gian thực, nên phiên dựng chụp được từng khung một mà không
         phụ thuộc tốc độ máy — khác hẳn quay màn hình theo thời gian thực,
         nơi máy chậm là rớt khung.
         `sfxCues` trả về lịch tiếng để dựng đường âm thanh bằng
         OfflineAudioContext, rồi ffmpeg ghép hai thứ lại. */
      renderAt: (ms: number) => renderAtRef.current?.(ms),
      sfxCues: () => {
        const cues: { name: string; at: number }[] = [];
        let t = 0;
        for (const step of steps) {
          if (step.sfx) cues.push({ name: step.sfx, at: t / 1000 });
          t += step.duration;
        }
        return cues;
      },
      /**
       * Đường tiếng của cả kịch bản, dựng ngoại tuyến thành WAV base64.
       *
       * `speed` phải KHỚP với tốc độ mà phần hình được lấy mẫu: video bài
       * giảng dựng ở 0,5× dài gấp đôi, nên mốc nổ của từng hiệu ứng cũng phải
       * giãn gấp đôi — nếu không tiếng chạy trước hình cả chục giây.
       */
      renderAudioWav: async (speed = 1) => {
        const rate = speed > 0 ? speed : 1;
        const cues: SfxCue[] = [];
        let t = 0;
        for (const step of steps) {
          if (step.sfx) cues.push({ name: step.sfx, at: t / 1000 / rate });
          t += step.duration;
        }
        const blob = await renderSfxTrackToWav(cues, totalDuration(steps) / 1000 / rate);
        const buf = await blob.arrayBuffer();
        // Chuyển sang base64 theo từng khối: `String.fromCharCode(...bytes)`
        // với một mảng vài triệu phần tử làm tràn ngăn xếp lời gọi.
        const bytes = new Uint8Array(buf);
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
          bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        return btoa(bin);
      },

      /* Siêu dữ liệu để phiên dựng biết video này thuộc bài học nào. */
      meta: () => ({
        id: scenario.id,
        group: scenario.group ?? null,
        name: scenario.name,
        lesson: scenario.lesson ?? null,
        stepCount: steps.length,
        totalDurationMs: totalDuration(steps),
      }),
    };
    (window as unknown as { __SIMULATION__?: typeof api }).__SIMULATION__ = api;

    // Sổ kịch bản cho phiên dựng hàng loạt: "dựng hết mục nodejs" phải hỏi
    // được trang, chứ không phải chép lại danh sách vào script rồi quên cập nhật.
    const catalog = SCENARIOS.map((s) => ({
      id: s.id,
      group: s.group ?? DEFAULT_GROUP_ID,
      name: s.name,
      lesson: s.lesson ?? null,
    }));
    (window as unknown as { __SIMULATION_SCENARIOS__?: typeof catalog }).__SIMULATION_SCENARIOS__ = catalog;

    return () => {
      delete (window as unknown as { __SIMULATION__?: unknown }).__SIMULATION__;
      delete (window as unknown as { __SIMULATION_SCENARIOS__?: unknown }).__SIMULATION_SCENARIOS__;
    };
  }, [engine, options, scenario.id, snapshot, steps]);

  /* ── Chế độ khung trần: giấu vỏ toàn cục ─────────────────────
     Thanh điều hướng, robot AI và thanh nhạc là DOM nên KHÔNG lọt vào video
     (video chỉ lấy canvas), nhưng chúng che mất khung hình khi trình chiếu
     và khi Playwright chụp ảnh trang. Gắn lớp lên <html> rồi gỡ đúng lúc
     rời trang — không đụng tới bất kỳ lớp theme toàn cục nào. */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (chrome) {
      root.classList.remove('sim-bare');
      return;
    }
    root.classList.add('sim-bare');
    return () => root.classList.remove('sim-bare');
  }, [chrome]);

  const vi = lang === 'vi';
  const stepProgress = snapshot.current.stepProgress;

  /* ── Chế độ không giao diện: chỉ còn khung hoạt cảnh ──────── */

  if (!chrome) {
    return (
      <div
        className="sim-root flex min-h-screen items-center justify-center bg-[#04050a] p-0"
        data-sim-state={engine.finished ? 'finished' : engine.playing ? 'playing' : 'idle'}
        data-sim-step={engine.stepIndex}
        data-sim-ready="1"
      >
        <div ref={stageWrapRef} className="w-full">
          <SimulationStage
            scenario={scenario}
            steps={steps}
            panels={panels}
            lang={lang}
            engine={engine}
            variantLabel={variantLabel}
            showCaption={showCaption}
            showLegend
            canvasRef={canvasRef}
            renderRef={renderAtRef}
            onToggle={handleToggle}
          />
        </div>
      </div>
    );
  }

  /* ── Giao diện đầy đủ ─────────────────────────────────────── */

  return (
    <div
      className="sim-root min-h-screen bg-[#05060c] pb-10 pt-20 text-[#e8eefc]"
      data-sim-state={engine.finished ? 'finished' : engine.playing ? 'playing' : 'idle'}
      data-sim-step={engine.stepIndex}
      data-sim-ready="1"
    >
      <div className="mx-auto max-w-[1860px] px-3 sm:px-5">
        {/* Đầu trang — tiêu đề chỉ dành cho trình đọc màn hình/SEO; phần nhìn
            thấy rút gọn còn hàng nút để nhường tối đa chiều cao cho sân khấu. */}
        <header className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="sr-only">
            {vi ? 'Xưởng mô phỏng Code & Mạng' : 'Code & Network Animation Studio'}
          </h1>
          {/* Đường về giáo trình. Mô phỏng thường được mở từ trong một bài
              học ở tab mới, nhưng link chia sẻ và bookmark thì không có tab
              nào để đóng — nên chỗ này luôn phải có lối ra. */}
          {backTo ? (
            <a
              href={backTo.href}
              className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-lg border border-[#243050] bg-[#0a0f1e] px-2.5 py-1.5 text-[12px] font-semibold text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
              title={vi ? 'Mở bài học tương ứng' : 'Open the matching lesson'}
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="shrink-0">{vi ? 'Quay lại bài học' : 'Back to the lesson'}</span>
              <span className="hidden truncate text-[#5d6d8c] sm:inline">· {backTo.label}</span>
            </a>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLang((l) => (l === 'vi' ? 'en' : 'vi'))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#243050] bg-[#0a0f1e] px-2.5 py-1.5 text-[12px] font-bold text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
              title={vi ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
            >
              <Languages className="h-3.5 w-3.5" />
              {vi ? 'VI' : 'EN'}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#243050] bg-[#0a0f1e] px-2.5 py-1.5 text-[12px] font-semibold text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
              title={vi ? 'Chép liên kết tới đúng trạng thái này' : 'Copy a link to this exact state'}
            >
              <Link2 className="h-3.5 w-3.5" />
              {copiedLink ? (vi ? 'Đã chép' : 'Copied') : (vi ? 'Chép liên kết' : 'Copy link')}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          {/* Cột trái — chỉ hiện trên desktop; mobile dùng tab bên dưới */}
          <aside className="hidden rounded-2xl border border-[#141c31] bg-[#070b16] lg:block lg:max-h-[calc(100vh-7rem)]">
            <ControlPanel
              scenario={scenario}
              options={options}
              lang={lang}
              onSelectScenario={handleSelectScenario}
              onChangeOption={handleChangeOption}
            />
          </aside>

          {/* Cột giữa — sân khấu + điều khiển phát */}
          <main className="min-w-0 space-y-3">
            <div ref={stageWrapRef} className="bg-[#04050a]">
              <SimulationStage
                scenario={scenario}
                steps={steps}
                panels={panels}
                lang={lang}
                engine={engine}
                variantLabel={variantLabel}
                showCaption={showCaption}
                showLegend
                canvasRef={canvasRef}
                renderRef={renderAtRef}
                onToggle={handleToggle}
              />
            </div>

            {/* Thanh điều khiển phát */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#141c31] bg-[#070b16] p-2.5">
              <button
                type="button"
                onClick={handleToggle}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#2b3f6b] bg-[#0f1a30] text-[#7dd3fc] transition-colors hover:border-[#38bdf8]"
                aria-label={engine.playing ? (vi ? 'Tạm dừng' : 'Pause') : (vi ? 'Phát' : 'Play')}
              >
                {engine.playing ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
              </button>
              <button
                type="button"
                onClick={engine.prev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#243050] bg-[#0a0f1e] text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
                aria-label={vi ? 'Bước trước' : 'Previous step'}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={engine.next}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#243050] bg-[#0a0f1e] text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
                aria-label={vi ? 'Bước sau' : 'Next step'}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={engine.restart}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#243050] bg-[#0a0f1e] text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
                aria-label={vi ? 'Chạy lại từ đầu' : 'Restart'}
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <div className="mx-1 h-8 w-px bg-[#1b2440]" />

              {/* Tốc độ phát */}
              <div className="inline-flex items-center gap-1 rounded-lg border border-[#243050] bg-[#0a0f1e] px-1.5 py-1">
                <Gauge className="h-3.5 w-3.5 text-[#5d6d8c]" />
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => engine.setSpeed(s)}
                    aria-pressed={engine.speed === s}
                    className={`rounded px-1.5 py-0.5 font-mono text-[11.5px] font-bold transition-colors ${
                      engine.speed === s ? 'bg-[#1c2f52] text-[#7dd3fc]' : 'text-[#6f8098] hover:text-[#c3cfe4]'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              {/* Số vòng chạy — một vòng thường quá ngắn để kịp hiểu. */}
              <div className="inline-flex items-center gap-1 rounded-lg border border-[#243050] bg-[#0a0f1e] px-1.5 py-1">
                <Repeat className="h-3.5 w-3.5 text-[#5d6d8c]" />
                {LOOP_CHOICES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => engine.setLoops(l)}
                    aria-pressed={engine.loops === l}
                    title={
                      l === 0
                        ? vi ? 'Lặp vô hạn — dùng khi trình chiếu' : 'Loop forever — for live presenting'
                        : vi ? `Chạy ${l} vòng rồi dừng` : `Run ${l} loop(s) then stop`
                    }
                    className={`rounded px-1.5 py-0.5 font-mono text-[11.5px] font-bold transition-colors ${
                      engine.loops === l ? 'bg-[#1c2f52] text-[#7dd3fc]' : 'text-[#6f8098] hover:text-[#c3cfe4]'
                    }`}
                  >
                    {l === 0 ? '∞' : `${l}×`}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowCaption((v) => !v)}
                aria-pressed={showCaption}
                className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-2.5 text-[12px] font-semibold transition-colors ${
                  showCaption ? 'border-[#2b3f6b] bg-[#0f1a30] text-[#7dd3fc]' : 'border-[#243050] bg-[#0a0f1e] text-[#6f8098]'
                }`}
                title={vi ? 'Bật/tắt phụ đề nung vào video (phím C)' : 'Toggle burned-in captions (key C)'}
              >
                <Subtitles className="h-3.5 w-3.5" />
                {vi ? 'Phụ đề' : 'Captions'}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#243050] bg-[#0a0f1e] text-[#93a4c4] transition-colors hover:border-[#3a4d7a] hover:text-[#e8eefc]"
                aria-label={vi ? 'Toàn màn hình' : 'Fullscreen'}
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-[#4d5b76] xl:inline-flex">
                <Keyboard className="h-3.5 w-3.5" />
                {vi ? 'Space phát · ← → bước · R lại · C phụ đề · F toàn màn hình · H ẩn giao diện' : 'Space play · ← → step · R restart · C captions · F fullscreen · H hide UI'}
              </span>
            </div>

            <TimelineScrubber
              steps={steps}
              stepIndex={engine.stepIndex}
              stepProgress={stepProgress}
              lang={lang}
              onSeek={engine.seek}
            />

            {/* Mobile / tablet: hai bảng bên gộp thành tab */}
            <div className="xl:hidden">
              <div className="mb-2 flex gap-1.5 rounded-lg border border-[#141c31] bg-[#070b16] p-1">
                {(['controls', 'inspector'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMobileTab(tab)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-[12.5px] font-bold transition-colors ${
                      mobileTab === tab ? 'bg-[#131f38] text-[#e8eefc]' : 'text-[#6f8098]'
                    }`}
                  >
                    {tab === 'controls' ? (vi ? 'Kịch bản' : 'Scenario') : (vi ? 'Bảng soi' : 'Inspector')}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-[#141c31] bg-[#070b16]">
                {mobileTab === 'controls' ? (
                  <>
                    <ControlPanel
                      scenario={scenario}
                      options={options}
                      lang={lang}
                      onSelectScenario={handleSelectScenario}
                      onChangeOption={handleChangeOption}
                    />
                    <div className="px-4 pb-4">
                      <RecorderStudio
                        recorder={recorder}
                        lang={lang}
                        muted={sound.muted}
                        onToggleMute={sound.toggleMuted}
                        autoRun={autoRun}
                        onToggleAutoRun={() => setAutoRun((v) => !v)}
                        estimatedMs={estimatedRunMs}
                        onStart={handleStartRecording}
                        speed={engine.speed}
                      />
                    </div>
                  </>
                ) : (
                  <InspectorPanel steps={steps} stepIndex={engine.stepIndex} lang={lang} />
                )}
              </div>
            </div>
          </main>

          {/* Cột phải — phòng thu + bảng soi */}
          <aside className="hidden min-w-0 space-y-3 xl:block">
            <RecorderStudio
                        recorder={recorder}
                        lang={lang}
                        muted={sound.muted}
                        onToggleMute={sound.toggleMuted}
                        autoRun={autoRun}
                        onToggleAutoRun={() => setAutoRun((v) => !v)}
                        estimatedMs={estimatedRunMs}
                        onStart={handleStartRecording}
                        speed={engine.speed}
                      />
            <div className="max-h-[calc(100vh-20rem)] overflow-hidden rounded-2xl border border-[#141c31] bg-[#070b16]">
              <InspectorPanel steps={steps} stepIndex={engine.stepIndex} lang={lang} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

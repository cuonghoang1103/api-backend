'use client';
/**
 * /cpu-lab/3d — "Hành trình vào máy tính": bay từ cây máy tính xuống tới transistor, 8 tầng, cùng cảnh 3D với video bài
 * CSI104 0.5 (scene/ dùng chung). Đi sâu / ra ngoài bằng nút, phím ↑ ↓, cuộn chuột hoặc vuốt; kéo để xoay nhẹ.
 *
 * Ngân sách hiệu năng: three.js chỉ nạp khi sân khấu hiện ra (import động), DPR tối đa 1.5 (thấp: 1), tự hạ chất lượng nếu
 * khung hình trung bình < 40 fps, nghỉ vẽ khi tab ẩn / sân khấu ra khỏi màn hình, đứng yên thì vẽ 30 fps.
 * prefers-reduced-motion hoặc không có WebGL ⇒ bản 2D (Fallback2D) — vẫn xem được 3D nếu bấm.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { labSfx, ensureListeners } from '../labs/sfx';
import { SoundToggle } from '../labs/tour/TourLayer';
import { LABEL_DIR, LABELS, LAYERS, t2, type Lang } from './scene/data';
import type { Journey, Quality } from './scene/journey';
import Fallback2D from './Fallback2D';
import WhereInComputer from './WhereInComputer';
import s from './cpu3d.module.css';

const STEP_MS = 2300;
const N = LAYERS.length;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}
function guessQuality(): Exclude<Quality, 'video'> {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const small = Math.min(window.screen.width, window.screen.height) < 820;
  return coarse && small ? 'low' : 'high';
}
const dprFor = (q: Quality) => Math.min(window.devicePixelRatio || 1, q === 'low' ? 1 : 1.5);

export default function Journey3D() {
  const [lang, setLang] = useState<Lang>('vi');
  const [layer, setLayer] = useState(0);
  const [mode, setMode] = useState<'3d' | 'flat' | 'locator'>('3d');
  const [quality, setQuality] = useState<'auto' | 'high' | 'low'>('auto');
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [bitsA, setA] = useState(5);
  const [bitsB, setB] = useState(7);
  const [gateOn, setGateOn] = useState<boolean | null>(null);
  const [locFocus, setLocFocus] = useState('page-table');
  const [open, setOpen] = useState(false);
  const T = useCallback((vi: string, en: string) => (lang === 'en' ? en : vi), [lang]);

  // tham số truyền vào vòng vẽ (không qua React state)
  const live = useRef({ a: 5, b: 7, adderStart: 0, gateManual: null as boolean | null, instrStart: 0, resetAdder: false, replayInstr: false });
  live.current.a = bitsA;
  live.current.b = bitsB;
  live.current.gateManual = gateOn;

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const jRef = useRef<Journey | null>(null);
  const anim = useRef({ p: 0, from: 0, to: 0, start: 0, dur: 0, moving: false });
  const drag = useRef({ on: false, x: 0, y: 0, orbit: 0, tilt: 0 });

  // đọc ?lang=, ?tang=, ?vi-tri=; giảm chuyển động / không WebGL ⇒ bản 2D
  useEffect(() => {
    ensureListeners();
    const sp = new URLSearchParams(location.search);
    if (sp.get('lang') === 'en') setLang('en');
    const tg = Number(sp.get('tang'));
    if (Number.isFinite(tg) && tg >= 1 && tg <= N) { setLayer(tg - 1); anim.current.p = anim.current.to = tg - 1; }
    const vt = sp.get('vi-tri');
    if (vt) { setLocFocus(vt); setMode('locator'); return; }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !hasWebGL()) setMode('flat');
  }, []);

  const go = useCallback((to: number) => {
    const A = anim.current;
    const target = Math.max(0, Math.min(N - 1, to));
    if (target === Math.round(A.to) && !A.moving) return;
    A.from = A.p;
    A.to = target;
    A.start = performance.now();
    A.dur = STEP_MS * Math.pow(Math.abs(target - A.p), 0.65) * (A.p < 5 && target >= 5 ? 1.15 : 1);
    A.moving = true;
    setLayer(target);
    setOpen(false);
    labSfx(target > A.from ? 'whoosh' : 'pop');
  }, []);

  /* ── dựng cảnh 3D (nạp động three.js khi sân khấu hiện ra) ── */
  useEffect(() => {
    if (mode !== '3d') return;
    const stage = stageRef.current!, canvas = canvasRef.current!;
    let alive = true, raf = 0, visible = true, hidden = document.hidden;
    let q: Exclude<Quality, 'video'> = quality === 'auto' ? guessQuality() : quality;
    const labelEls = new Map<string, HTMLDivElement>();
    let io: IntersectionObserver | null = null;

    const start = async () => {
      const { createJourney } = await import('./scene/journey');
      if (!alive) return;
      const r = stage.getBoundingClientRect();
      let j: Journey;
      try {
        j = createJourney(canvas, { quality: q, width: r.width, height: r.height, dpr: dprFor(q) });
      } catch {
        setMode('flat');
        return;
      }
      jRef.current = j;
      j.setState({ mode: 'journey', p: anim.current.p, t: 0 });
      j.warm();
      setReady(true);
      // nhãn HTML
      const box = labelsRef.current!;
      box.textContent = '';
      for (const id of Object.keys(LABELS)) {
        const el = document.createElement('div');
        el.className = s.lab;
        el.style.opacity = '0';
        const [dx, dy] = (LABEL_DIR[id] ?? [40, -60]).map((v) => v * 0.6) as [number, number];
        el.innerHTML = `<svg width="1" height="1"><line x1="0" y1="0" x2="${dx}" y2="${dy}" stroke="rgba(125,211,252,0.7)" stroke-width="1.5"/></svg><span class="${s.dot}"></span><span class="${s.pill}" style="left:${dx}px;top:${dy}px;transform:translate(${dx < 0 ? '-100%' : dx === 0 ? '-50%' : '0'},-50%)"></span>`;
        box.appendChild(el);
        labelEls.set(id, el);
      }
      const ro = new ResizeObserver(() => {
        const b = stage.getBoundingClientRect();
        j.resize(b.width, b.height, dprFor(j.quality));
      });
      ro.observe(stage);
      io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; if (visible) loop(); }, { threshold: 0.05 });
      io.observe(stage);
      const onVis = () => { hidden = document.hidden; if (!hidden) loop(); };
      document.addEventListener('visibilitychange', onVis);

      let last = performance.now(), t = 0, frame = 0, fpsAcc = 0, fpsN = 0, downgraded = q === 'low';
      let gateV = 0;
      const t0 = performance.now();
      function loop() {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
      function tick(now: number) {
        if (!alive || hidden || !visible) return;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        frame++;
        const A = anim.current, D = drag.current, L = live.current;
        // đứng yên + không kéo ⇒ vẽ cách khung (≈ 30 fps) cho đỡ nóng máy
        const idle = !A.moving && !D.on && Math.abs(D.orbit) < 0.002 && Math.abs(D.tilt) < 0.002;
        if (idle && frame % 2) { raf = requestAnimationFrame(tick); return; }
        t += idle ? dt * 2 : dt;
        if (A.moving) {
          const u = Math.min(1, (now - A.start) / A.dur);
          A.p = A.from + (A.to - A.from) * u;
          if (u >= 1) {
            A.moving = false;
            A.p = A.to;
            if (A.to === 4) L.instrStart = t;
            if (A.to === 5) L.adderStart = t;
          }
        }
        if (L.resetAdder) { L.resetAdder = false; L.adderStart = t; }
        if (L.replayInstr) { L.replayInstr = false; L.instrStart = t; }
        if (!D.on) { D.orbit *= 0.92; D.tilt *= 0.92; }
        const auto = 0.05 * Math.sin(t * 0.22);
        // tầng 7: điện áp cổng tự bật/tắt mỗi 3 giây, trừ khi người học tự bấm
        const want = L.gateManual ?? Math.floor(t / 3) % 2 === 0;
        gateV += ((want ? 1 : 0) - gateV) * Math.min(1, dt * 4);
        const instr = A.p > 3.6 && A.p < 4.4 ? ((t - L.instrStart) % 7.5) / 6.5 : -1;
        j.setState({
          mode: 'journey', p: A.p, t, orbit: D.orbit + auto, tilt: D.tilt,
          instr: instr > 1 ? 1 : instr,
          adder: { a: L.a, b: L.b, at: A.p > 4.6 ? t - L.adderStart : -1 },
          gateV,
        });
        j.render();
        // nhãn
        const seen = new Set<string>();
        for (const l of j.labels()) {
          const el = labelEls.get(l.id);
          if (!el) continue;
          seen.add(l.id);
          el.style.opacity = String(l.a);
          el.style.transform = `translate(${Math.round(l.x)}px, ${Math.round(l.y)}px)`;
          const pill = el.lastChild as HTMLSpanElement;
          const txt = t2(LABELS[l.id]!, langRef.current);
          if (pill.textContent !== txt) pill.textContent = txt;
        }
        for (const [id, el] of labelEls) if (!seen.has(id) && el.style.opacity !== '0') el.style.opacity = '0';
        // đo fps: 2–5 s sau khi dựng, trung bình < 40 ⇒ hạ chất lượng một lần
        const el = now - t0;
        if (!idle && el > 2000 && el < 5000) { fpsAcc += dt; fpsN++; }
        if (!downgraded && quality === 'auto' && el > 5000 && fpsN > 20 && fpsN / fpsAcc < 40) {
          downgraded = true;
          j.setQuality('low', dprFor('low'));
          setToast(langRef.current === 'en' ? 'Switched to low quality for smoother motion.' : 'Đã chuyển sang chất lượng thấp cho mượt hơn.');
          window.setTimeout(() => setToast(null), 4000);
        }
        (window as unknown as { __cpu3d?: unknown }).__cpu3d = { p: A.p, quality: j.quality, frame };
        raf = requestAnimationFrame(tick);
      }
      loop();
      cleanup = () => {
        ro.disconnect();
        io?.disconnect();
        document.removeEventListener('visibilitychange', onVis);
      };
    };
    let cleanup = () => {};
    void start();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cleanup();
      jRef.current?.dispose();
      jRef.current = null;
      setReady(false);
    };
    // quality đổi ⇒ dựng lại (đổi cả độ nét hoạ tiết)
  }, [mode, quality]);

  const langRef = useRef<Lang>(lang);
  langRef.current = lang;

  /* ── điều khiển: phím, cuộn, vuốt, kéo ── */
  useEffect(() => {
    if (mode !== '3d') return;
    const stage = stageRef.current!;
    let wheelLock = 0, touchY: number | null = null;
    const onKey = (e: KeyboardEvent) => {
      const tg = e.target as HTMLElement;
      if (tg && /input|textarea|select/i.test(tg.tagName)) return;
      if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); go(Math.round(anim.current.to) + 1); }
      if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(Math.round(anim.current.to) - 1); }
      if (e.key === 'Home') go(0);
      if (e.key === 'End') go(N - 1);
    };
    const onWheel = (e: WheelEvent) => {
      const cur = Math.round(anim.current.to);
      const dir = e.deltaY > 0 ? 1 : -1;
      if ((dir > 0 && cur >= N - 1) || (dir < 0 && cur <= 0)) return; // ở hai đầu: để trang cuộn bình thường
      e.preventDefault();
      const now = performance.now();
      if (Math.abs(e.deltaY) < 12 || now < wheelLock) return;
      wheelLock = now + 1100;
      go(cur + dir);
    };
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? null; };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = (e.changedTouches[0]?.clientY ?? touchY) - touchY;
      touchY = null;
      if (Math.abs(dy) > 60) go(Math.round(anim.current.to) + (dy < 0 ? 1 : -1));
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      drag.current.on = true; drag.current.x = e.clientX; drag.current.y = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      const D = drag.current;
      if (!D.on) return;
      D.orbit = Math.max(-0.55, Math.min(0.55, D.orbit - (e.clientX - D.x) * 0.004));
      D.tilt = Math.max(-0.3, Math.min(0.3, D.tilt + (e.clientY - D.y) * 0.003));
      D.x = e.clientX; D.y = e.clientY;
    };
    const onUp = () => { drag.current.on = false; };
    window.addEventListener('keydown', onKey);
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchend', onTouchEnd, { passive: true });
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchend', onTouchEnd);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [mode, go]);

  const L = LAYERS[layer]!;
  const bits = (v: number, set: (n: number) => void, name: string) => (
    <div className={s.bitRow}>
      <b>{name}</b>
      {[3, 2, 1, 0].map((k) => {
        const on = (v >> k) & 1;
        return (
          <button key={k} type="button" className={s.bit} aria-pressed={!!on} aria-label={`${name}${k}`}
            onClick={() => { labSfx(on ? 'off' : 'on'); set(v ^ (1 << k)); live.current.resetAdder = true; }}>
            {on}
          </button>
        );
      })}
      <span>= {v}</span>
    </div>
  );
  const extra = useMemo(() => {
    if (L.id === 'core') return (
      <div className={s.extra}>
        <button type="button" className={`${s.btn} ${s.small}`} onClick={() => { labSfx('blip-fetch'); live.current.replayInstr = true; }}>
          ▶ {T('Chạy lại lệnh Add Y', 'Replay Add Y')}
        </button>
        <Link className={`${s.btn} ${s.small}`} href={`/cpu-lab?sim=cpu&preset=add${lang === 'en' ? '&lang=en' : ''}`}>{T('Mở CPU MARIE ↗', 'Open the MARIE CPU ↗')}</Link>
      </div>
    );
    if (L.id === 'alu') {
      const sum = (bitsA + bitsB) & 31;
      return (
        <div className={s.extra}>
          <div className={s.bits}>
            {bits(bitsA, setA, 'A')}
            {bits(bitsB, setB, 'B')}
            <div className={s.sum}>{bitsA.toString(2).padStart(4, '0')} + {bitsB.toString(2).padStart(4, '0')} = {sum.toString(2).padStart(sum > 15 ? 5 : 4, '0')} ({bitsA} + {bitsB} = {bitsA + bitsB}){sum > 15 ? T(' · tràn ra Cout', ' · carry out') : ''}</div>
          </div>
        </div>
      );
    }
    if (L.id === 'transistor') return (
      <div className={s.extra}>
        <button type="button" className={`${s.btn} ${s.small} ${gateOn ? s.primary : ''}`} onClick={() => { const v = !(gateOn ?? false); labSfx(v ? 'on' : 'off'); setGateOn(v); }}>
          ⚡ {T('Điện áp cổng', 'Gate voltage')}: {gateOn === null ? T('tự động', 'auto') : gateOn ? T('BẬT = 1', 'ON = 1') : T('TẮT = 0', 'OFF = 0')}
        </button>
        {gateOn !== null && <button type="button" className={`${s.btn} ${s.small}`} onClick={() => setGateOn(null)}>{T('Tự động', 'Auto')}</button>}
      </div>
    );
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L.id, bitsA, bitsB, gateOn, lang]);

  const top = (
    <div className={s.top}>
      <span className={s.brand}>{T('Hành trình vào máy tính', 'Journey into the computer')}<small>CSI104 · CEA201</small></span>
      <span className={s.spacer} />
      <div className={s.seg} role="group" aria-label={T('Chế độ xem', 'View')}>
        <button type="button" aria-pressed={mode === '3d'} onClick={() => setMode('3d')}>3D</button>
        <button type="button" aria-pressed={mode === 'locator'} onClick={() => setMode('locator')}>{T('Ở đâu?', 'Where?')}</button>
        <button type="button" aria-pressed={mode === 'flat'} onClick={() => setMode('flat')}>2D</button>
      </div>
      {mode === '3d' && (
        <div className={`${s.seg} ${s.hideSm}`} role="group" aria-label={T('Chất lượng', 'Quality')}>
          {(['auto', 'high', 'low'] as const).map((k) => (
            <button key={k} type="button" aria-pressed={quality === k} onClick={() => setQuality(k)}>{k === 'auto' ? T('Tự động', 'Auto') : k === 'high' ? T('Cao', 'High') : T('Thấp', 'Low')}</button>
          ))}
        </div>
      )}
      <div className={`${s.seg} ${s.hideSm}`} role="group" aria-label="Language">
        <button type="button" aria-pressed={lang === 'vi'} onClick={() => setLang('vi')}>VI</button>
        <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
      </div>
      <span className={s.hideSm}><SoundToggle lang={lang} /></span>
    </div>
  );

  return (
    <div className={s.wrap}>
      {mode === '3d' && (
        <div ref={stageRef} className={s.stage} aria-label={T('Cảnh 3D: hành trình vào máy tính', '3D scene: journey into the computer')}>
          <canvas ref={canvasRef} />
          <div ref={labelsRef} className={s.labels} aria-hidden />
          {!ready && <div className={s.loading}>{T('Đang dựng cảnh 3D…', 'Building the 3D scene…')}</div>}
          {top}
          <nav className={s.rail} aria-label={T('Các tầng', 'Layers')}>
            {LAYERS.map((x, i) => (
              <button key={x.id} type="button" aria-current={i === layer ? 'step' : undefined} onClick={() => { labSfx('tap'); go(i); }}>
                <span className={s.n}>{i + 1}</span><span className={s.railT}>{t2(x.title, lang)}</span>
              </button>
            ))}
          </nav>
          {toast && <div className={s.toast} role="status">{toast}</div>}
          <section className={s.panel} aria-live="polite">
            <div className={s.kicker}>
              <span>{T('Tầng', 'Layer')} {layer + 1}/{N}</span>
              <span className={s.scale}>{L.scale}</span>
              {layer >= 5 && <span className={s.stylized}>{T('phóng đại · đơn giản hoá', 'magnified · simplified')}</span>}
            </div>
            <h2>{t2(L.title, lang)}</h2>
            <p className={open ? s.open : undefined} onClick={() => setOpen(!open)}>{t2(L.body, lang)}</p>
            {extra}
            <div className={s.nav}>
              <button type="button" className={s.btn} disabled={layer === 0} onClick={() => go(layer - 1)}>↑ {T('Ra ngoài', 'Back out')}</button>
              <button type="button" className={`${s.btn} ${s.primary}`} disabled={layer === N - 1} onClick={() => go(layer + 1)}>{T('Đi sâu hơn', 'Go deeper')} ↓</button>
            </div>
          </section>
          <div className={s.hint}>{T('Kéo để xoay · cuộn hoặc ↑ ↓ để đổi tầng', 'Drag to look around · scroll or ↑ ↓ to change layer')}</div>
        </div>
      )}
      {mode === 'flat' && (
        <>
          <div className={s.stage} style={{ height: 'auto', minHeight: 0, paddingTop: 64 }}>{top}<Fallback2D lang={lang} layer={layer} setLayer={setLayer} onWant3D={() => setMode('3d')} /></div>
        </>
      )}
      {mode === 'locator' && (
        <div className={s.stage} style={{ height: 'auto', minHeight: 0, paddingTop: 64 }}>
          {top}
          <div className={s.below} style={{ paddingTop: 8 }}>
            <h3>{T('Bạn đang ở đâu trong máy tính?', 'Where in the computer are you?')}</h3>
            <p>{T('Chọn một khái niệm của bài học — camera bay tới đúng chỗ nó nằm hoặc xảy ra bên trong máy.', 'Pick a concept from your lessons — the camera flies to where it lives or happens inside the machine.')}</p>
            <LocatorPicker lang={lang} value={locFocus} onChange={setLocFocus} />
            <WhereInComputer focus={locFocus} lang={lang} height={460} />
          </div>
        </div>
      )}
      <div className={s.below}>
        <h3>{T('Xem tiếp', 'Keep going')}</h3>
        <div className={s.links}>
          <Link className={`${s.btn} ${s.small}`} href="/cpu-lab">{T('Phòng lab Máy tính từ số 0', 'Lab: A computer from zero')}</Link>
          <Link className={`${s.btn} ${s.small}`} href="/courses/introduction-to-computer-science/learn?lessonSlug=csi104-0-5-bat-dau-tu-so-0">{T('Bài CSI104 0.5 (có video)', 'CSI104 lesson 0.5 (video)')}</Link>
          <Link className={`${s.btn} ${s.small}`} href="/courses/computer-organization-and-architecture">CEA201</Link>
        </div>
        <p>{T('Kích thước ghi ở mỗi tầng là cỡ thật xấp xỉ. Từ tầng ALU trở xuống, hình đã được phóng đại và đơn giản hoá để nhìn thấy được: chip thật xếp hàng tỉ transistor kiểu FinFET 3D, nhưng nguyên lý công tắc — điện áp ở cực cổng bật/tắt dòng điện — y như ở đây.', 'Sizes are approximate real sizes. From the ALU down the picture is magnified and simplified so it can be seen: real chips pack billions of 3D FinFET transistors, but the switching principle — gate voltage turning current on and off — is exactly this.')}</p>
      </div>
    </div>
  );
}

const PICKS: Array<[string, string, string]> = [
  ['register', 'Thanh ghi', 'Register'], ['alu', 'ALU', 'ALU'], ['control-unit', 'Khối điều khiển', 'Control unit'], ['cache-line', 'Cache line', 'Cache line'],
  ['tlb', 'TLB', 'TLB'], ['page-table', 'Bảng trang', 'Page table'], ['ram-cell', 'Ô nhớ RAM', 'RAM cell'], ['bus', 'Bus', 'Bus'],
  ['file', 'Tệp trên SSD', 'File on SSD'], ['page-cache', 'Page cache', 'Page cache'], ['process', 'Tiến trình', 'Process'], ['thread', 'Luồng', 'Thread'],
  ['scheduler', 'Bộ lập lịch', 'Scheduler'], ['stack', 'Stack', 'Stack'], ['interrupt', 'Ngắt', 'Interrupt'], ['packet', 'Gói tin', 'Packet'], ['gpu', 'GPU', 'GPU'],
];
function LocatorPicker({ lang, value, onChange }: { lang: Lang; value: string; onChange: (v: string) => void }) {
  return (
    <div className={s.tabs} role="group" aria-label={lang === 'en' ? 'Concepts' : 'Khái niệm'}>
      {PICKS.map(([id, vi, en]) => (
        <button key={id} type="button" className={`${s.btn} ${s.small} ${value === id ? s.primary : ''}`} aria-pressed={value === id} onClick={() => { labSfx('tap'); onChange(id); }}>{lang === 'en' ? en : vi}</button>
      ))}
    </div>
  );
}

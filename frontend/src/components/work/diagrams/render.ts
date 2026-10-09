/**
 * CTW Diagram — vẽ Mermaid theo BỘ THEME biên tập của CT Work + kiểm cú pháp THẬT (mermaid.parse) + xuất SVG/PNG có nhúng
 * phông Be Vietnam Pro (đủ dấu tiếng Việt, kể cả khi mở tệp SVG ở máy không cài phông).
 *
 * Theme lấy tinh thần từ diagram-design (MIT, © Cathryn Lavery — https://github.com/cathrynlavery/diagram-design,
 * references/style-guide.md): giấy ấm (không trắng tinh), mực gần đen, MỘT màu nhấn (indigo CT Work) cho tiêu điểm, chữ phụ
 * xám, viền mảnh 1px, bo 6px, không đổ bóng, nhãn mũi tên kiểu mono nhỏ. Ba biến thể: sáng · tối (theme-dark) · in (đen
 * trắng, cho Word/PDF).
 */

import { anhTuyetDoi } from '@/lib/anhTuyetDoi';

export type Variant = 'light' | 'dark' | 'print';

interface Palette { paper: string; node: string; ink: string; muted: string; soft: string; rule: string; accent: string; accentTint: string; link: string; note: string; alt: string }

const PALETTE: Record<Variant, Palette> = {
  light: { paper: '#fbfaf7', node: '#ffffff', ink: '#1a1a17', muted: '#4b4a44', soft: '#696861', rule: '#cfccc4', accent: '#4f5bd5', accentTint: '#eef0fb', link: '#2d6bd6', note: '#f6f1e3', alt: '#f4f3f0' },
  dark: { paper: '#141416', node: '#1d1d21', ink: '#ededef', muted: '#b6b6bd', soft: '#8f8f98', rule: '#3a3a42', accent: '#8b93ee', accentTint: '#23264a', link: '#6cb0fa', note: '#2a2618', alt: '#18181b' },
  print: { paper: '#ffffff', node: '#ffffff', ink: '#111111', muted: '#333333', soft: '#555555', rule: '#9a9a9a', accent: '#2b3591', accentTint: '#f1f2f9', link: '#1f4f9e', note: '#f5f5f5', alt: '#f7f7f7' },
};

export const FONT_STACK = "'Be Vietnam Pro', 'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif";
export const MONO_STACK = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** themeVariables + themeCSS cho theme `base` của mermaid. */
export function mermaidTheme(v: Variant) {
  const p = PALETTE[v];
  const themeVariables = {
    darkMode: v === 'dark', background: p.paper, fontFamily: FONT_STACK, fontSize: '14px',
    primaryColor: p.node, primaryTextColor: p.ink, primaryBorderColor: p.ink, secondaryColor: p.alt, secondaryBorderColor: p.rule, secondaryTextColor: p.ink,
    tertiaryColor: p.alt, tertiaryBorderColor: p.rule, tertiaryTextColor: p.ink,
    lineColor: p.muted, textColor: p.ink, mainBkg: p.node, nodeBorder: p.ink, nodeTextColor: p.ink,
    clusterBkg: v === 'dark' ? '#18181c' : p.alt, clusterBorder: p.rule, titleColor: p.ink, edgeLabelBackground: p.paper,
    // sequence
    actorBkg: p.node, actorBorder: p.ink, actorTextColor: p.ink, actorLineColor: p.rule, signalColor: p.muted, signalTextColor: p.ink,
    labelBoxBkgColor: p.accentTint, labelBoxBorderColor: p.accent, labelTextColor: p.ink, loopTextColor: p.muted,
    noteBkgColor: p.note, noteBorderColor: p.rule, noteTextColor: p.ink, activationBkgColor: p.accentTint, activationBorderColor: p.accent,
    sequenceNumberColor: v === 'dark' ? '#141416' : '#ffffff',
    // er / class / state
    attributeBackgroundColorOdd: p.node, attributeBackgroundColorEven: p.alt, classText: p.ink,
    labelColor: p.ink, altBackground: p.alt, compositeBackground: p.alt, compositeTitleBackground: p.alt, stateBkg: p.node, stateBorder: p.ink,
    specialStateColor: p.ink, innerEndBackground: p.ink, transitionColor: p.muted, transitionLabelColor: p.muted,
    // gantt / journey / timeline
    sectionBkgColor: p.alt, altSectionBkgColor: p.paper, sectionBkgColor2: p.alt, taskBkgColor: p.accentTint, taskBorderColor: p.accent,
    taskTextColor: p.ink, taskTextLightColor: p.ink, taskTextOutsideColor: p.ink, activeTaskBkgColor: p.accent, activeTaskBorderColor: p.accent,
    doneTaskBkgColor: p.rule, doneTaskBorderColor: p.muted, critBkgColor: v === 'print' ? '#dddddd' : '#f3d9d6', critBorderColor: '#b3261e',
    gridColor: p.rule, todayLineColor: p.accent, fillType0: p.accentTint, fillType1: p.alt, fillType2: p.note,
    cScale0: p.accentTint, cScale1: p.alt, cScale2: p.note, cScale3: p.node, cScaleLabel0: p.ink, cScaleLabel1: p.ink, cScaleLabel2: p.ink,
  };
  const themeCSS = `
    svg { background: ${p.paper}; }
    .node rect, .node polygon, .node circle, .node ellipse, .node path { stroke-width: 1px; }
    .node rect { rx: 6px; ry: 6px; }
    .cluster rect { rx: 8px; ry: 8px; stroke-dasharray: 0; }
    .cluster-label text, .cluster-label span { font-weight: 600; fill: ${p.muted}; letter-spacing: 0.04em; }
    .edgeLabel, .edgeLabel text, .messageText, .loopText, .labelText, .transitionLabel { font-family: ${MONO_STACK}; font-size: 11px; letter-spacing: 0.02em; fill: ${p.muted}; }
    .flowchart-link, .relationshipLine, .transition, .messageLine0, .messageLine1 { stroke-width: 1.2px; }
    .actor { stroke-width: 1px; }
    text.actor > tspan, .nodeLabel, .label text { font-weight: 600; }
    .note { stroke-width: 1px; }
    .assumed rect, .assumed polygon, .assumed path { stroke-dasharray: 5 4 !important; stroke: ${v === 'print' ? '#555' : '#b7791f'} !important; }
    .titleText, .er.entityLabel { font-weight: 600; }
    .sequenceNumber { font-family: ${MONO_STACK}; font-size: 10px; }
  `;
  return { themeVariables, themeCSS };
}

let seq = 0;
let queue: Promise<unknown> = Promise.resolve();

async function lib(v: Variant) {
  const mermaid = (await import('mermaid')).default;
  const { themeVariables, themeCSS } = mermaidTheme(v);
  mermaid.initialize({
    startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true, theme: 'base', themeVariables, themeCSS,
    fontFamily: FONT_STACK, htmlLabels: false, flowchart: { htmlLabels: false, curve: 'basis', padding: 14, nodeSpacing: 44, rankSpacing: 52, useMaxWidth: false },
    sequence: { mirrorActors: false, actorMargin: 64, messageMargin: 36, boxMargin: 8, noteMargin: 10, useMaxWidth: false, showSequenceNumbers: false },
    er: { useMaxWidth: false, layoutDirection: 'TB' }, state: { useMaxWidth: false }, class: { useMaxWidth: false } as never,
    gantt: { useMaxWidth: false, barHeight: 22, fontSize: 12 }, journey: { useMaxWidth: false }, timeline: { useMaxWidth: false }, mindmap: { useMaxWidth: false },
  });
  return mermaid;
}

/** Hàng đợi: mermaid là singleton — hai lần vẽ cùng lúc với theme khác nhau sẽ giẫm cấu hình của nhau. */
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

/** Vẽ ⇒ SVG chuỗi (theme CT Work). Lỗi cú pháp ⇒ ném Error có thông điệp của mermaid. */
export function renderDiagramSvg(source: string, v: Variant): Promise<string> {
  return serial(async () => {
    const mermaid = await lib(v);
    const id = `ctw-dg-${++seq}-${Math.random().toString(36).slice(2, 7)}`;
    try {
      const { svg } = await mermaid.render(id, source.trim());
      return svg;
    } finally {
      document.getElementById(`d${id}`)?.remove();
    }
  });
}

export interface ParseResult { ok: boolean; message: string | null; line: number | null }

/** Kiểm cú pháp THẬT bằng mermaid.parse — thông điệp gọn + số dòng (để tô dòng lỗi trong trình soạn). */
export function parseMermaid(source: string): Promise<ParseResult> {
  return serial(async () => {
    if (!source.trim()) return { ok: false, message: 'The diagram is empty', line: null };
    const mermaid = (await import('mermaid')).default;
    try {
      await mermaid.parse(source.trim());
      return { ok: true, message: null, line: null };
    } catch (e) {
      const raw = String((e as Error)?.message ?? e);
      const m = /line (\d+)/i.exec(raw);
      // dòng mermaid đếm sau khi bỏ khoảng trắng đầu — cộng số dòng trống đầu tệp
      const lead = source.length - source.replace(/^\s*\n/, '').length ? (source.match(/^(\s*\n)+/)?.[0].split('\n').length ?? 1) - 1 : 0;
      const expecting = /Expecting ([^\n]+?)(?:, got '([^']+)')?$/m.exec(raw);
      const first = raw.split('\n')[0];
      const msg = expecting ? `${first.replace(/:$/, '')} — expected ${expecting[1].split(',').slice(0, 4).join(', ')}${expecting[2] ? `, found ${expecting[2]}` : ''}` : first;
      return { ok: false, message: msg.slice(0, 300), line: m ? Number(m[1]) + lead : null };
    }
  });
}

// ─── Xuất ────────────────────────────────────────────────────────

const FONT_FILES: Array<[string, number]> = [
  ['be-vietnam-pro-latin-400-normal.woff2', 400], ['be-vietnam-pro-latin-ext-400-normal.woff2', 400], ['be-vietnam-pro-vietnamese-400-normal.woff2', 400],
  ['be-vietnam-pro-latin-600-normal.woff2', 600], ['be-vietnam-pro-latin-ext-600-normal.woff2', 600], ['be-vietnam-pro-vietnamese-600-normal.woff2', 600],
];
let fontCss: Promise<string> | null = null;

async function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.onerror = () => bad(r.error); r.readAsDataURL(blob); });
}

/** @font-face Be Vietnam Pro nhúng base64 (~100 KB) — tệp SVG xuất ra tự mang phông, đủ dấu tiếng Việt. */
export function embeddedFontCss(): Promise<string> {
  if (!fontCss) {
    fontCss = (async () => {
      const parts = await Promise.all(FONT_FILES.map(async ([f, w]) => {
        try {
          const r = await fetch(anhTuyetDoi(`/diagram-fonts/${f}`));
          if (!r.ok) return '';
          return `@font-face{font-family:'Be Vietnam Pro';font-style:normal;font-weight:${w};font-display:block;src:url(${await toDataUrl(await r.blob())}) format('woff2');}`;
        } catch { return ''; }
      }));
      return parts.join('');
    })();
  }
  return fontCss;
}

/** SVG độc lập: kích thước tuyệt đối, xmlns, <title>, phông nhúng, nền giấy. */
export async function standaloneSvg(svg: string, title: string, v: Variant): Promise<string> {
  const box = /viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/.exec(svg);
  const w = Math.ceil(Number(box?.[3] ?? 800));
  const h = Math.ceil(Number(box?.[4] ?? 600));
  const css = await embeddedFontCss();
  const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]!));
  let out = svg.replace(/<svg\b[^>]*>/, (tag) => {
    // Bỏ width/height/style/role của mermaid rồi đặt lại — thuộc tính trùng làm SVG thành XML hỏng (tệp không mở được).
    let t = tag.replace(/\s(width|height|style|role|aria-roledescription)="[^"]*"/g, '');
    if (!/xmlns=/.test(t)) t = t.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    return t.replace('<svg', `<svg width="${w}" height="${h}" role="img" aria-labelledby="ctw-diagram-title" style="background:${PALETTE[v].paper}"`);
  });
  out = out.replace(/(<svg\b[^>]*>)/, `$1<title id="ctw-diagram-title">${esc(title)}</title><style>${css}</style><rect x="${box?.[1] ?? 0}" y="${box?.[2] ?? 0}" width="100%" height="100%" fill="${PALETTE[v].paper}"/>`);
  return out;
}

export async function svgToPngBlob(svg: string, scale = 2): Promise<Blob> {
  const box = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(svg);
  const w = Math.ceil(Number(box?.[1] ?? 800));
  const h = Math.ceil(Number(box?.[2] ?? 600));
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.decoding = 'sync';
    await new Promise<void>((ok, bad) => { img.onload = () => ok(); img.onerror = () => bad(new Error('Could not draw the SVG')); img.src = url; });
    const k = Math.min(scale, 6000 / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * k));
    canvas.height = Math.max(1, Math.round(h * k));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((ok, bad) => canvas.toBlob((b) => (b ? ok(b) : bad(new Error('PNG export failed'))), 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export const fileSlug = (key: string, title: string) => `${key}_${title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').replace(/[^\w]+/g, '_').replace(/^_|_$/g, '').slice(0, 60) || 'diagram'}`;

export const isDarkTheme = () => typeof document !== 'undefined' && document.documentElement.classList.contains('theme-dark');

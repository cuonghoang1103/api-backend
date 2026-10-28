'use client';
/**
 * Gắn mô phỏng vào thân bài học — dùng CHUNG cho mọi phòng lab (os-lab, cpu-lab…). Nội dung bài đã qua sanitizeHtml
 * (không có data-*, không có script) nên khối nhúng chỉ là class:
 *   <div class="<ns> <ns>-sim-<tên> <ns>-p-<preset>"><p class="<ns>-cap">…link mở toàn màn hình…</p></div>
 * Hàm đọc ns + tên + preset từ class, tra DANH MỤC (registry.ts) — tên lạ bị bỏ qua — rồi mount component khi khối
 * lọt vào khung nhìn (khối của ngôn ngữ đang ẩn không bao giờ "lọt vào" nên không tốn công dựng). Trả về hàm dọn dẹp.
 */
import { Suspense, lazy, type ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { LABS, isLabIn } from './registry';
import { LAB_NAMESPACES, type LabNs } from './selector';
import type { Lang } from '../os-lab/ui';
import s from '../os-lab/oslab.module.css';

const cache = new Map<string, ComponentType<{ lang?: Lang; preset?: string }>>();
function lazyOf(ns: LabNs, name: string) {
  const k = `${ns}:${name}`;
  if (!cache.has(k)) cache.set(k, lazy(LABS[ns].labs[name].load));
  return cache.get(k)!;
}

export function LabEmbed({ ns, name, preset, lang }: { ns: LabNs; name: string; preset?: string; lang: Lang }) {
  if (!isLabIn(ns, name)) return null;
  const C = lazyOf(ns, name);
  return (
    <Suspense fallback={<div className={s.loading}>{lang === 'vi' ? 'Đang dựng mô phỏng…' : 'Loading the simulation…'}</div>}>
      <C lang={lang} preset={preset} />
    </Suspense>
  );
}

/** Đọc (ns, tên, preset) từ class của một khối nhúng. */
export function parseLabEl(el: Element, only: readonly LabNs[] = LAB_NAMESPACES): { ns: LabNs; name: string; preset?: string } | null {
  const cls = Array.from(el.classList);
  const ns = only.find((n) => cls.includes(n));
  if (!ns) return null;
  const name = cls.find((c) => c.startsWith(`${ns}-sim-`))?.slice(`${ns}-sim-`.length) ?? '';
  if (!isLabIn(ns, name)) return null;
  const p = cls.find((c) => c.startsWith(`${ns}-p-`))?.slice(`${ns}-p-`.length);
  return { ns, name, preset: p && LABS[ns].labs[name].presets.includes(p) ? p : undefined };
}

export function mountLabs(root: HTMLElement, fallbackLang: Lang, only: readonly LabNs[] = LAB_NAMESPACES): () => void {
  const roots: Array<{ r: Root; host: HTMLElement }> = [];
  const els = Array.from(root.querySelectorAll<HTMLElement>(only.map((ns) => `div.${ns}`).join(', ')));
  if (!els.length) return () => {};
  const mount = (el: HTMLElement) => {
    if (el.dataset.labMounted) return;
    const hit = parseLabEl(el, only);
    if (!hit) return;
    const lang: Lang = el.closest('.ml-en') ? 'en' : el.closest('.ml-vi') ? 'vi' : fallbackLang;
    el.dataset.labMounted = '1';
    const host = document.createElement('div');
    el.insertBefore(host, el.firstChild);
    const r = createRoot(host);
    r.render(<LabEmbed ns={hit.ns} name={hit.name} preset={hit.preset} lang={lang} />);
    roots.push({ r, host });
  };
  const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { mount(e.target as HTMLElement); io?.unobserve(e.target); }
    }, { rootMargin: '400px 0px' })
    : null;
  for (const el of els) { if (io) io.observe(el); else mount(el); }
  return () => {
    io?.disconnect();
    const list = roots.splice(0);
    // gỡ sau lượt render hiện tại (React cảnh báo nếu unmount đồng bộ giữa lúc đang render)
    window.setTimeout(() => {
      for (const { r, host } of list) {
        r.unmount();
        const el = host.parentElement;
        host.remove();
        if (el) delete el.dataset.labMounted;
      }
    }, 0);
    for (const el of els) delete el.dataset.labMounted;
  };
}

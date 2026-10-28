'use client';
/**
 * Gắn mô phỏng vào thân bài học. Nội dung bài đã qua sanitizeHtml (không có data-*, không có script) nên khối nhúng
 * chỉ là:  <div class="os-lab os-lab-sim-<tên> os-lab-p-<preset>"><p class="os-lab-cap">…link mở toàn màn hình…</p></div>
 * Hàm đọc tên + preset từ class, tra DANH MỤC (registry.ts) — tên lạ bị bỏ qua — rồi mount component khi khối lọt vào
 * khung nhìn (khối của ngôn ngữ đang ẩn không bao giờ "lọt vào" nên không tốn công dựng). Trả về hàm dọn dẹp.
 */
import { Suspense, lazy, type ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { OS_LABS, isLab } from './registry';
import type { Lang } from './ui';
import s from './oslab.module.css';

const cache = new Map<string, ComponentType<{ lang?: Lang; preset?: string }>>();
function lazyOf(name: string) {
  if (!cache.has(name)) cache.set(name, lazy(OS_LABS[name].load));
  return cache.get(name)!;
}

export function OsLabEmbed({ name, preset, lang }: { name: string; preset?: string; lang: Lang }) {
  if (!isLab(name)) return null;
  const C = lazyOf(name);
  return (
    <Suspense fallback={<div className={s.loading}>{lang === 'vi' ? 'Đang dựng mô phỏng…' : 'Loading the simulation…'}</div>}>
      <C lang={lang} preset={preset} />
    </Suspense>
  );
}

export function mountOsLabs(root: HTMLElement, fallbackLang: Lang): () => void {
  const roots: Array<{ r: Root; host: HTMLElement }> = [];
  const els = Array.from(root.querySelectorAll<HTMLElement>('div.os-lab'));
  if (!els.length) return () => {};
  const mount = (el: HTMLElement) => {
    if (el.dataset.osLabMounted) return;
    const cls = Array.from(el.classList);
    const name = cls.find((c) => c.startsWith('os-lab-sim-'))?.slice('os-lab-sim-'.length) ?? '';
    const preset = cls.find((c) => c.startsWith('os-lab-p-'))?.slice('os-lab-p-'.length);
    if (!isLab(name)) return;
    const lang: Lang = el.closest('.ml-en') ? 'en' : el.closest('.ml-vi') ? 'vi' : fallbackLang;
    el.dataset.osLabMounted = '1';
    const host = document.createElement('div');
    el.insertBefore(host, el.firstChild);
    const r = createRoot(host);
    r.render(<OsLabEmbed name={name} preset={preset && OS_LABS[name].presets.includes(preset) ? preset : undefined} lang={lang} />);
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
        if (el) delete el.dataset.osLabMounted;
      }
    }, 0);
    for (const el of els) delete el.dataset.osLabMounted;
  };
}

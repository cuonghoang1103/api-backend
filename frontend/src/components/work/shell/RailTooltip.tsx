'use client';

/**
 * UX-E: chú thích cho sidebar THU GỌN (thanh icon 60px).
 *
 * Trước đây chỉ có `title` của trình duyệt: hiện sau ~1 giây, KHÔNG hiện khi dùng bàn
 * phím (Tab), và không hiện trên iPad. Giờ: rê chuột hoặc Tab tới một icon ⇒ bong bóng
 * tên mục hiện ngay bên phải. Đặt `fixed` trong #work-portal vì sidebar có
 * `overflow: hidden/auto` (bong bóng `absolute` sẽ bị cắt).
 *
 * Trong lúc bong bóng hiện, `title` của phần tử được cất sang `data-rail-title` để trình
 * duyệt không vẽ thêm chú thích thứ hai chồng lên; rời đi thì trả lại.
 */

import { useEffect, useState, type RefObject } from 'react';
import { WorkPortal, khungFixed } from '../ui';

interface Tip { text: string; left: number; top: number }

export default function RailTooltip({ navRef, enabled }: { navRef: RefObject<HTMLElement>; enabled: boolean }) {
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !enabled) { setTip(null); return; }
    let current: HTMLElement | null = null;

    const restore = () => {
      if (current?.dataset.railTitle !== undefined) {
        current.setAttribute('title', current.dataset.railTitle);
        delete current.dataset.railTitle;
      }
      current = null;
    };
    const show = (el: HTMLElement) => {
      if (el === current) return;
      restore();
      const text = el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent?.trim() || '';
      if (!text) { setTip(null); return; }
      current = el;
      const t = el.getAttribute('title');
      if (t !== null) { el.dataset.railTitle = t; el.removeAttribute('title'); }
      const r = el.getBoundingClientRect();
      const k = khungFixed();
      setTip({ text, left: r.right - k.left + 8, top: r.top - k.top + r.height / 2 });
    };
    const target = (e: Event) => (e.target as HTMLElement | null)?.closest<HTMLElement>('a, button');
    const onOver = (e: Event) => { const el = target(e); if (el && nav.contains(el)) show(el); };
    const onOut = (e: Event) => {
      const to = (e as PointerEvent | FocusEvent).relatedTarget as Node | null;
      if (current && to && current.contains(to)) return;
      restore();
      setTip(null);
    };
    const onScroll = () => { restore(); setTip(null); };

    nav.addEventListener('pointerover', onOver);
    nav.addEventListener('pointerout', onOut);
    nav.addEventListener('focusin', onOver);
    nav.addEventListener('focusout', onOut);
    nav.addEventListener('scroll', onScroll, true);
    return () => {
      nav.removeEventListener('pointerover', onOver);
      nav.removeEventListener('pointerout', onOut);
      nav.removeEventListener('focusin', onOver);
      nav.removeEventListener('focusout', onOut);
      nav.removeEventListener('scroll', onScroll, true);
      restore();
      setTip(null);
    };
  }, [navRef, enabled]);

  if (!tip) return null;
  return (
    <WorkPortal>
      <div
        role="tooltip"
        className="pointer-events-none fixed z-[80] -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-[var(--w-raised)] px-2 py-1 text-[12.5px] font-medium text-[var(--w-text)]"
        style={{ left: tip.left, top: tip.top, boxShadow: 'var(--w-shadow-pop)' }}
        data-testid="rail-tooltip"
      >
        {tip.text}
      </div>
    </WorkPortal>
  );
}

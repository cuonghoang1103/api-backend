'use client';

/**
 * Nút sao chép có phản hồi "Đã chép" trong 1,6 giây.
 *
 * Có đường lui bằng `<textarea>` + `execCommand`: `navigator.clipboard` chỉ tồn
 * tại trên ngữ cảnh bảo mật (https hoặc localhost). Trang này hay được mở qua
 * IP LAN lúc thử trên điện thoại — ở đó `navigator.clipboard` là `undefined` và
 * nút sẽ chết lặng nếu không có nhánh dự phòng.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // rơi xuống nhánh dưới
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function CopyButton({
  value,
  label = 'Chép',
  doneLabel = 'Đã chép',
  className = '',
  iconOnly = false,
  title,
}: {
  value: string;
  label?: string;
  doneLabel?: string;
  className?: string;
  iconOnly?: boolean;
  title?: string;
}) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onClick = useCallback(async () => {
    const ok = await copyText(value);
    if (!ok) return;
    setDone(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1600);
  }, [value]);

  return (
    <button
      type="button"
      onClick={onClick}
      title={title ?? label}
      aria-label={title ?? label}
      className={
        className ||
        'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
      }
    >
      {done ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
      {!iconOnly && <span>{done ? doneLabel : label}</span>}
    </button>
  );
}

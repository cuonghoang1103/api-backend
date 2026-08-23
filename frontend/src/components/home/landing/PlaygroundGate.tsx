'use client';

/**
 * Cửa vào sân chơi 3D.
 *
 * Sân chơi là một thế giới WebGPU chạy hoàn toàn bằng card đồ hoạ của MÁY KHÁCH
 * và tải khoảng 35MB tài nguyên. Trên máy yếu nó sẽ giật, trên mạng chậm nó tải
 * lâu — cả hai đều là trải nghiệm tệ nếu khách bị ném thẳng vào mà không được
 * báo trước. Nên bấm vào không đi ngay: mở một hộp thoại nói thẳng ba điều
 * (dùng GPU máy bạn · nặng ~35MB · cần chút thời gian tải), rồi khách tự quyết.
 *
 * Vì sao chặn ở PHÍA NÀY chứ không phải trong chính sân chơi: `/playground` là
 * một ứng dụng Vite tĩnh nằm trong `public/`, không phải trang React của Next —
 * không chèn hộp thoại React vào đó được. Chặn ở đây cũng đúng hơn về mặt trải
 * nghiệm: cảnh báo phải đến TRƯỚC khi tải 35MB, không phải sau.
 *
 * Dùng lại được ở bất cứ đâu cần dẫn sang sân chơi — truyền `children` là phần
 * hiện ra, phần cảnh báo giữ nguyên.
 *
 * ─── VÌ SAO CÁI BẤM LÀ <a> CHỨ KHÔNG PHẢI <button> (23/08/2026) ──────────────
 * Nó từng là `<button onClick={() => setOpen(true)}>`. Hộp thoại chạy đúng,
 * nhưng cái nút KHÔNG CÓ `href` — và ba thứ mất theo:
 *
 *   · Googlebot không bò sang được. Nó đi theo `href`, không bấm nút. Sân chơi
 *     3D là thứ khác biệt nhất của cả web mà lại gần như vô hình với tìm kiếm.
 *   · Bấm giữa / Ctrl+bấm / Cmd+bấm không mở tab mới. Chuột phải không có
 *     "Mở trong tab mới", cũng không copy được địa chỉ.
 *   · Trình đọc màn hình đọc ra "nút" thay vì "liên kết", nên người dùng không
 *     biết là sắp rời trang.
 *
 * Nay là `<a href="/playground">` thật. Hộp thoại cảnh báo vẫn nguyên: bấm
 * trái bình thường thì `preventDefault()` rồi mở hộp thoại. Nhưng bấm-có-phím-
 * bổ-trợ (Ctrl/Cmd/Shift/Alt) và bấm chuột giữa thì KHÔNG chặn — để trình
 * duyệt làm đúng việc của nó. Người cố tình mở tab mới là người đã biết mình
 * muốn gì; chặn họ lại để cảnh báo là phiền chứ không phải giúp.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const PLAYGROUND_URL = '/playground';

export default function PlaygroundGate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const enterRef = useRef<HTMLAnchorElement | null>(null);
  const openerRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    // Trả tiêu điểm về nút đã mở hộp thoại — nếu không, người dùng bàn phím bị
    // hất về đầu trang sau khi đóng.
    openerRef.current?.focus();
  }, []);

  // Esc để đóng + khoá cuộn nền + đưa tiêu điểm vào nút chính.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => enterRef.current?.focus(), 30);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, close]);

  const dialog = (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pg-gate-title"
      aria-describedby="pg-gate-desc"
    >
      {/* Nền mờ. Bán kính làm mờ CỐ ĐỊNH, chỉ chạy hoạt hình opacity — cùng lý
          do đã sửa ở NavigationDock: đổi bán kính mỗi khung là thao tác đắt
          nhất, và ở đây lại càng sai vì máy yếu chính là đối tượng cảnh báo. */}
      <button
        type="button"
        aria-label="Đóng"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-[10px] motion-safe:animate-[pg-fade_.18s_ease-out]"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl motion-safe:animate-[pg-rise_.22s_cubic-bezier(.32,.94,.6,1)]">
        <div className="border-b border-[var(--border-color)] px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Before you enter
          </p>
          <h2
            id="pg-gate-title"
            className="mt-1.5 font-heading text-2xl font-bold text-[var(--text-primary)]"
          >
            This one runs on your graphics card
          </h2>
        </div>

        <div id="pg-gate-desc" className="space-y-4 px-6 py-5 text-sm leading-relaxed text-[var(--text-secondary)]">
          <p>
            The playground is a real-time 3D world. It renders entirely on{' '}
            <strong className="text-[var(--text-primary)]">your device&rsquo;s GPU</strong> — nothing is
            streamed from a server, so how smoothly it runs depends on the machine you are on right now.
          </p>

          <ul className="space-y-2.5">
            {[
              ['~35 MB to download', 'First visit takes a moment on a slow connection. After that it is cached for a week.'],
              ['Needs a recent browser', 'Chrome, Edge or Safari from the last couple of years. WebGPU with a WebGL fallback.'],
              ['Not built for weak hardware', 'Older laptops, low-end phones and integrated graphics will stutter. That is expected, not a bug.'],
            ].map(([head, body]) => (
              <li key={head} className="flex gap-3">
                <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--text-muted)]" />
                <span>
                  <strong className="font-semibold text-[var(--text-primary)]">{head}</strong>
                  <span className="text-[var(--text-muted)]"> — {body}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="text-[var(--text-muted)]">
            Everything else on the site works fine without it. Drive around, smash the brick walls for a
            vocabulary quiz, and use the gates to jump into any part of CuongThai.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[var(--border-color)] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
          >
            Stay here
          </button>
          {/* Thẻ <a> thật, không phải next/link: sân chơi là ứng dụng tĩnh nằm
              ngoài router của Next, đi bằng client-side nav sẽ hỏng. */}
          <a
            ref={enterRef}
            href={PLAYGROUND_URL}
            className="rounded-lg bg-[var(--text-primary)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--bg-primary)] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]"
          >
            Enter the playground
          </a>
        </div>
      </div>

      {/* Khung hình động `pg-fade` / `pg-rise` khai báo trong globals.css —
          không dùng <style jsx> để khỏi phụ thuộc styled-jsx trong App Router. */}
    </div>
  );

  return (
    <>
      <a
        ref={openerRef}
        href={PLAYGROUND_URL}
        className={className}
        onClick={(e) => {
          // Để nguyên những lối đi mà người dùng CỐ Ý chọn:
          //   · e.metaKey/ctrlKey → mở tab mới
          //   · e.shiftKey        → mở cửa sổ mới
          //   · e.altKey          → tải về
          //   · e.button !== 0    → bấm giữa (React chỉ bắn onClick cho nút
          //                         chính, nhưng kiểm cho chắc)
          // Mọi trường hợp đó đi thẳng sang /playground, không qua hộp thoại.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {mounted && open && createPortal(dialog, document.body)}
    </>
  );
}

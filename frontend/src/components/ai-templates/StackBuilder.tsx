'use client';

/**
 * "Stack Builder" — chọn nhiều component rồi lấy MỘT lệnh cài duy nhất.
 *
 * Đây là lý do tồn tại của cả trang: xem 1.877 component thì hay, nhưng thứ
 * người ta thật sự cần là dựng bộ đồ nghề cho dự án mình rồi cài một phát.
 * CLI nhận nhiều giá trị cho cùng một cờ nên 12 skill vẫn chỉ là một dòng lệnh
 * (xem `stackRecipe`).
 *
 * Gồm hai phần: nút nổi luôn hiện số món, và tấm bảng trượt từ phải sang.
 * Cả hai đọc chung một store nên số đếm không bao giờ lệch với nội dung bảng.
 *
 * ⚠️ Giỏ nằm ở localStorage nên server render ra 0 món còn client render ra N
 * món → React sẽ kêu hydration mismatch. Vì thế có `mounted`: trước khi gắn
 * xong thì không vẽ gì cả.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Layers, Trash2, X, Terminal, MessageSquareCode } from 'lucide-react';
import { getTypeMeta, detailHref, prettyName } from '@/lib/ai-templates/catalog';
import { categoryLabel } from '@/lib/ai-templates/labels';
import { stackRecipe } from '@/lib/ai-templates/install';
import { useAiTemplatesStore, STACK_LIMIT } from '@/store/aiTemplatesStore';
import CopyButton from './CopyButton';
import TypeIcon from './TypeIcon';

export default function StackBuilder() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stack = useAiTemplatesStore((s) => s.stack);
  const isOpen = useAiTemplatesStore((s) => s.isStackOpen);
  const openStack = useAiTemplatesStore((s) => s.openStack);
  const closeStack = useAiTemplatesStore((s) => s.closeStack);
  const removeFromStack = useAiTemplatesStore((s) => s.removeFromStack);
  const clearStack = useAiTemplatesStore((s) => s.clearStack);

  const recipe = useMemo(() => stackRecipe(stack), [stack]);
  const allLines = [...recipe.shell, ...recipe.claude].join('\n');

  // Esc đóng bảng — bảng che nội dung nên phải có đường thoát bằng bàn phím.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeStack(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeStack]);

  if (!mounted) return null;

  return (
    <>
      {/* Nút nổi CHỈ hiện khi giỏ có món.
          Góc trái-dưới vì góc phải-dưới đã có trợ lý AI của site. Nhưng dù đặt
          đâu thì nút nổi cũng che mất một mẩu nội dung — nên khi giỏ rỗng nó
          biến mất hẳn: lúc ấy nó chẳng làm được gì ngoài việc mở một tấm bảng
          trống và che dòng đếm kết quả. Đường vào lúc giỏ rỗng là dấu `+` trên
          thẻ; thêm món đầu tiên là nút này hiện ra. */}
      {stack.length > 0 && (
        <button
          type="button"
          onClick={openStack}
          // Nhấc lên khỏi thanh điều hướng dưới của bản mobile.
          // `--app-chrome-bottom` = 0 trên desktop (xem globals.css) nên
          // desktop giữ nguyên vị trí cũ, không cần biến thể riêng.
          style={{ bottom: 'calc(1.25rem + var(--app-chrome-bottom))' }}
          className="fixed left-5 z-40 flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--text-primary)] shadow-lg transition-colors hover:border-[var(--accent-color)]"
          aria-label={`Mở Stack Builder, đang có ${stack.length} món`}
        >
          <Layers size={15} className="text-[var(--accent-color)]" />
          <span className="hidden sm:inline">Stack</span>
          <span className="min-w-[20px] rounded-full bg-[var(--accent-color)] px-1.5 py-0.5 text-center font-mono text-[11px] text-white">
            {stack.length}
          </span>
        </button>
      )}

      {/* z-[110]: trợ lý AI nổi của site nằm ở `z-[100]` (`.ai-robot-fab`, góc
          phải-dưới) và nó che đúng chỗ nút "Xoá hết" của bảng này. Bảng là hộp
          thoại chiếm màn hình nên phải nằm trên mọi thứ nổi. */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={closeStack}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-label="Stack Builder"
            className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3.5">
              <div>
                <h2 className="flex items-center gap-2 font-heading text-[15px] font-semibold text-[var(--text-primary)]">
                  <Layers size={16} className="text-[var(--accent-color)]" />
                  Stack Builder
                </h2>
                <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
                  {stack.length}/{STACK_LIMIT} component — cài chung một lệnh
                </p>
              </div>
              <button
                type="button"
                onClick={closeStack}
                aria-label="Đóng"
                className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
              >
                <X size={17} />
              </button>
            </header>

            {stack.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <Layers size={30} className="text-[var(--text-muted)] opacity-40" />
                <p className="mt-3 font-heading text-[14px] font-semibold text-[var(--text-primary)]">
                  Stack đang trống
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                  Bấm dấu <strong className="text-[var(--text-secondary)]">+</strong> trên bất kỳ thẻ
                  nào để gom vào đây. Chọn xong, bạn nhận một lệnh cài duy nhất cho cả bộ.
                </p>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                  <ul className="flex flex-col gap-1.5">
                    {stack.map((it) => {
                      const meta = getTypeMeta(it.type);
                      return (
                        <li
                          key={`${it.type}:${it.ref}`}
                          className="flex items-center gap-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-2"
                        >
                          <span
                            aria-hidden
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                            style={{ background: `${meta.color}18`, color: meta.color }}
                          >
                            <TypeIcon name={meta.icon} size={12} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={detailHref(meta.slug, it.ref, it.category)}
                              onClick={closeStack}
                              className="block truncate text-[13px] font-medium text-[var(--text-primary)] hover:text-[var(--accent-color)]"
                            >
                              {prettyName(it.name)}
                            </Link>
                            <p className="truncate text-[11px] text-[var(--text-muted)]">
                              {meta.label} · {categoryLabel(it.category)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromStack(it.type, it.ref)}
                            aria-label={`Bỏ ${it.name} khỏi Stack`}
                            className="shrink-0 rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-rose-500"
                          >
                            <Trash2 size={13} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <footer className="border-t border-[var(--border-color)] px-4 py-3.5">
                  {recipe.shell.length > 0 && (
                    <section className="mb-3">
                      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        <Terminal size={12} /> Chạy trong terminal
                      </p>
                      <pre className="max-h-32 overflow-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-2.5 font-mono text-[11.5px] leading-relaxed text-[var(--text-secondary)]">
                        {recipe.shell.join('\n')}
                      </pre>
                    </section>
                  )}

                  {recipe.claude.length > 0 && (
                    <section className="mb-3">
                      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        <MessageSquareCode size={12} /> Gõ trong Claude Code
                      </p>
                      <pre className="max-h-24 overflow-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-2.5 font-mono text-[11.5px] leading-relaxed text-[var(--text-secondary)]">
                        {recipe.claude.join('\n')}
                      </pre>
                    </section>
                  )}

                  <div className="flex items-center gap-2">
                    <CopyButton
                      value={allLines}
                      label={`Chép ${recipe.shell.length + recipe.claude.length} lệnh`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
                    />
                    <button
                      type="button"
                      onClick={clearStack}
                      className="rounded-lg border border-[var(--border-color)] px-3 py-2 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-rose-500 hover:text-rose-500"
                    >
                      Xoá hết
                    </button>
                  </div>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

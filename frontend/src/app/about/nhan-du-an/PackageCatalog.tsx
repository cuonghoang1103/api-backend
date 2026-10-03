'use client';

/**
 * Mục "Dự án mẫu" — lưới thẻ gói (chọn được) + ngăn chi tiết của gói đang chọn.
 *
 * Bàn phím: mỗi thẻ là <button aria-pressed>, Enter/Space chọn; phím mũi tên
 * (và Home/End) chuyển tiêu điểm giữa các thẻ. Ngăn chi tiết là một
 * `role="region"` gắn nhãn bằng tên gói; trình đọc màn
 * hình báo khi đổi gói qua một dòng sr-only riêng.
 *
 * "Chọn gói này" ⇒ `onChoose(id)`: IntakeClient giữ id, RequestForm hiện tên gói
 * + tự chọn loại sản phẩm, rồi cuộn tới #gui-yeu-cau.
 */
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowRight, Check, Clock, ArrowUpRight } from 'lucide-react';
import { T } from '@/components/studio/StudioUI';
import { PACKAGES, type Bi } from './packages';

type Lang = 'vi' | 'en';

export default function PackageCatalog({
  lang,
  chosenId,
  onChoose,
}: {
  lang: Lang;
  chosenId: string | null;
  onChoose: (id: string) => void;
}) {
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const p = (b: Bi) => (lang === 'en' ? b[1] : b[0]);
  const [activeId, setActiveId] = useState(PACKAGES[0].id);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const detailRef = useRef<HTMLDivElement>(null);
  const pkg = PACKAGES.find((x) => x.id === activeId) ?? PACKAGES[0];

  const select = (id: string, fromPointer: boolean) => {
    setActiveId(id);
    // Màn hẹp: ngăn chi tiết nằm dưới cả lưới ⇒ đưa nó vào tầm nhìn.
    if (fromPointer && typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }), 30);
    }
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = PACKAGES.length;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    btnRefs.current[next]?.focus();
  };

  const weeks = `${pkg.weeks[0]}–${pkg.weeks[1]} ${L('tuần', 'weeks')}`;

  return (
    <div className="min-w-0">
      <ul
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={L('Danh sách gói — dùng phím mũi tên để chuyển', 'Package list — use arrow keys to move')}
      >
        {PACKAGES.map((x, i) => {
          const on = x.id === activeId;
          const chosen = x.id === chosenId;
          return (
            <li key={x.id} className="min-w-0">
              <button
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                type="button"
                aria-pressed={on}
                aria-controls="goi-chi-tiet"
                onClick={(e) => select(x.id, e.detail > 0)}
                onKeyDown={(e) => onKey(e, i)}
                className={`group flex h-full w-full min-w-0 flex-col items-start gap-2 rounded-xl border p-4 sm:p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--s-accent)] ${
                  on
                    ? 'border-[color:var(--s-ink)] bg-[var(--s-raise)] shadow-[inset_0_0_0_1px_var(--s-ink)]'
                    : 'border-[color:var(--s-line)] bg-[var(--s-raise)] hover:border-[color:var(--s-line-strong)]'
                }`}
              >
                <span className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                  <span aria-hidden className="text-[0.75rem] font-semibold tabular-nums text-[color:var(--s-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {chosen && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--s-accent)] px-2 py-0.5 text-[0.7rem] font-semibold text-[color:var(--s-accent)]">
                      <Check aria-hidden className="h-3 w-3" /> {L('Đã chọn cho phiếu', 'In your request')}
                    </span>
                  )}
                </span>
                <span className="font-heading text-[1.08rem] font-semibold leading-snug text-[color:var(--s-ink)] break-words">{p(x.name)}</span>
                <span className="text-[0.85rem] leading-relaxed text-[color:var(--s-body)]">{p(x.tagline)}</span>
                <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[0.75rem] text-[color:var(--s-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden className="h-3.5 w-3.5" />
                    {x.weeks[0]}–{x.weeks[1]} {L('tuần', 'wks')}
                  </span>
                  <span>{x.demos.length ? L('Có demo thật', 'Live demo') : L('Chưa có demo', 'No demo yet')}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Báo gọn cho trình đọc màn hình khi đổi gói (không đọc lại cả ngăn). */}
      <p className="sr-only" aria-live="polite">
        {L('Đang xem gói: ', 'Showing package: ')}
        {p(pkg.name)}
      </p>

      {/* ── Ngăn chi tiết ─────────────────────────────────────────────── */}
      <div
        ref={detailRef}
        id="goi-chi-tiet"
        role="region"
        aria-labelledby="goi-chi-tiet-ten"
        className={`${T.card} mt-6 min-w-0 scroll-mt-28 p-5 sm:p-8`}
      >
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={T.label}>{L('Gói đang xem', 'Selected package')}</p>
            <h3 id="goi-chi-tiet-ten" className="mt-1 font-heading text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[color:var(--s-ink)] sm:text-[1.85rem] break-words">
              {p(pkg.name)}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onChoose(pkg.id)}
            className={`${T.btnPrimary} shrink-0`}
          >
            {chosenId === pkg.id ? L('Đã chọn — tới phiếu', 'Chosen — go to form') : L('Chọn gói này', 'Choose this package')}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-2">
          <Block title={L('Dành cho ai', 'Who it’s for')}>
            <p className={T.body}>{p(pkg.forWho)}</p>
          </Block>
          <Block title={L('Bài toán giải quyết', 'Problem it solves')}>
            <p className={T.body}>{p(pkg.problem)}</p>
          </Block>
          <Block title={L('Phạm vi chuẩn', 'Standard scope')}>
            <List items={pkg.standard.map(p)} mark="check" />
          </Block>
          <Block title={L('Tuỳ chọn thêm', 'Optional extras')}>
            <List items={pkg.optional.map(p)} mark="plus" />
          </Block>
          <Block title={L('Công nghệ', 'Technology')}>
            <ul className="flex min-w-0 flex-wrap gap-2">
              {pkg.tech.map((t) => (
                <li key={t} className="rounded-md border border-[color:var(--s-line-strong)] px-2.5 py-1 text-[0.8rem] text-[color:var(--s-ink)]">
                  {t}
                </li>
              ))}
            </ul>
          </Block>
          <Block title={L('Khung thời gian', 'Timeframe')}>
            <p className="font-heading text-[1.25rem] font-semibold text-[color:var(--s-ink)] tabular-nums">{weeks}</p>
            <p className={`${T.small} mt-1`}>
              {L(
                'Ước lượng sơ bộ cho một kỹ sư chính, chốt sau khảo sát. Chi phí báo riêng trong đề xuất.',
                'A rough estimate for one lead engineer, confirmed after discovery. Cost is quoted in the proposal.',
              )}
            </p>
          </Block>
          <Block title={L('Đầu ra bàn giao', 'Deliverables')}>
            <List items={pkg.deliverables.map(p)} mark="check" />
          </Block>
          <Block title={L('Bằng chứng / demo thật', 'Evidence / live demo')}>
            {pkg.demos.length ? (
              <ul className="space-y-2.5">
                {pkg.demos.map((d) => (
                  <li key={d.href} className="min-w-0">
                    <Link
                      href={d.href}
                      className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4 break-words"
                    >
                      {p(d.label)}
                      <ArrowUpRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                    <span className="ml-2 font-mono text-[0.75rem] text-[color:var(--s-muted)] break-all">{d.href}</span>
                    {d.note && <p className={`${T.small} mt-0.5`}>{p(d.note)}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={T.body}>
                <span className="font-semibold text-[color:var(--s-ink)]">{L('Chưa có demo.', 'No demo yet.')}</span>{' '}
                {pkg.noDemoNote ? p(pkg.noDemoNote) : null}
              </p>
            )}
          </Block>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 border-t border-[color:var(--s-line)] pt-4">
      <h4 className="mb-2.5 text-[0.8rem] font-semibold uppercase tracking-wide text-[color:var(--s-muted)]">{title}</h4>
      {children}
    </div>
  );
}

function List({ items, mark }: { items: string[]; mark: 'check' | 'plus' }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] gap-2.5 text-[0.92rem] leading-relaxed text-[color:var(--s-body)]">
          <span aria-hidden className="pt-[0.15rem] font-semibold text-[color:var(--s-accent)]">
            {mark === 'check' ? '✓' : '+'}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

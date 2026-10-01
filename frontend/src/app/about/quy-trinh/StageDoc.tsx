'use client';

/**
 * Trang tài liệu một giai đoạn — /about/quy-trinh/<slug>.
 *
 * Bố cục kiểu tài liệu: cột mục lục dính bên trái (desktop), nội dung bên phải.
 * Mục nào trong data.ts KHÔNG có dữ liệu thì không hiện (và không có trong mục
 * lục) — trang không vẽ khung rỗng.
 *
 * "Đầu vào" lấy `inputs` của giai đoạn; nếu thiếu, dùng đầu ra của giai đoạn
 * liền trước (đúng nghĩa chuỗi bàn giao).
 */
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText } from 'lucide-react';
import { StudioShell, T, studioCss as css, useStudioLang } from '@/components/studio/StudioUI';
// Chỉ import KIỂU từ data.ts: dữ liệu do [slug]/page.tsx (server) truyền vào,
// để mỗi trang giai đoạn không phải tải cả data.ts (~200 KB) về trình duyệt.
import type { Bi, DeptKey, LearnLink, Phase, RaciRole, Stage } from './data';

const pick = (b: Bi, lang: 'vi' | 'en'): string => (lang === 'en' ? b[1] : b[0]);
const stageHref = (s: { slug: string }) => `/about/quy-trinh/${s.slug}`;

export interface StageDocProps {
  stage: Stage;
  prev: Stage | null;
  next: Stage | null;
  total: number;
  phase: Phase;
  loop: { from: number; to: number };
  deptKeys: readonly DeptKey[];
  deptNames: Record<DeptKey, Bi>;
}

const RACI_CLS: Record<RaciRole, string> = { R: css.raciR, A: css.raciA, C: css.raciC, I: css.raciI };

export default function StageDoc({ stage: s, prev, next, total, phase, loop: LOOP, deptKeys: DEPT_KEYS, deptNames: DEPT_NAMES }: StageDocProps) {
  const { lang, L } = useStudioLang();
  const p = (b: Bi) => pick(b, lang);
  const slug = s.slug;
  const inputs: Bi[] = s.inputs && s.inputs.length ? s.inputs : prev ? prev.deliverables : [];

  const raciCols = useMemo(() => {
    const used = new Set<DeptKey>();
    for (const r of s.raci ?? []) (Object.keys(r.roles) as DeptKey[]).forEach((k) => used.add(k));
    return DEPT_KEYS.filter((k) => used.has(k));
  }, [s, DEPT_KEYS]);

  // Mục lục — chỉ những mục có dữ liệu.
  const toc = useMemo(() => {
    const t: { id: string; label: string }[] = [];
    const add = (cond: unknown, id: string, label: string) => {
      if (cond) t.push({ id, label });
    };
    add(true, 'muc-tieu', L('Mục tiêu', 'Goal'));
    add(inputs.length || s.deliverables.length, 'dau-vao-dau-ra', L('Đầu vào → đầu ra', 'Inputs → outputs'));
    add(s.team?.length || s.departments?.length, 'bo-phan', L('Bộ phận & vai trò', 'Teams & roles'));
    add(s.raci?.length, 'raci', L('Ma trận RACI', 'RACI matrix'));
    add(s.entryCriteria?.length || s.exitCriteria?.length || s.gate, 'cong-chat-luong', L('Cổng chất lượng', 'Quality gate'));
    add(s.activities.length, 'hoat-dong', L('Hoạt động', 'Activities'));
    add(s.checklist?.length, 'checklist', L('Checklist', 'Checklist'));
    add(s.templates?.length, 'mau-tai-lieu', L('Mẫu tài liệu', 'Templates'));
    add(s.client.length, 'khach-hang', L('Khách hàng tham gia', 'Client involvement'));
    add(s.tools.length, 'cong-cu', L('Công cụ', 'Tools'));
    add(s.standards.length, 'chuan', L('Chuẩn tham chiếu', 'Standards'));
    add(s.pitfalls?.length, 'sai-lam', L('Sai lầm hay gặp', 'Common pitfalls'));
    add(s.example, 'vi-du', L('Ví dụ thật', 'Real example'));
    add(s.learn.length, 'hoc', L('Học ở đâu', 'Where to learn'));
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, lang]);

  // Mục đang đọc — để tô mục lục.
  const [active, setActive] = useState(toc[0]?.id);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);

  // Checklist tự đánh dấu (chỉ trong trình duyệt này, không lưu đi đâu).
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  useEffect(() => setChecked({}), [slug]);
  const nChecked = Object.values(checked).filter(Boolean).length;

  const loopNote =
    s.n === LOOP.from
      ? L(`Giai đoạn này vòng lại giai đoạn ${String(LOOP.to).padStart(2, '0')}.`, `This stage loops back to stage ${String(LOOP.to).padStart(2, '0')}.`)
      : null;

  return (
    <StudioShell step={3}>
      <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-14 pb-20">
        {/* Đường dẫn */}
        <nav aria-label={L('Đường dẫn', 'Breadcrumb')} className="text-[0.8rem] text-[color:var(--s-muted)] flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/about/quy-trinh" className="hover:text-[color:var(--s-ink)]">{L('Quy trình', 'Process')}</Link>
          <span aria-hidden>/</span>
          <span>{p(phase.label)}</span>
          <span aria-hidden>/</span>
          <span className="text-[color:var(--s-ink)]">{L('Giai đoạn', 'Stage')} {String(s.n).padStart(2, '0')}</span>
        </nav>

        {/* Đầu tài liệu */}
        <header className="mt-6 pb-10 border-b border-[color:var(--s-line)] grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-12 items-end">
          <div className="min-w-0">
            <p className="flex items-center gap-2.5 text-sm text-[color:var(--s-muted)]">
              <span className="font-editorial text-[1.1rem] text-[color:var(--s-ink)] tabular-nums">
                {String(s.n).padStart(2, '0')}
                <span className="text-[color:var(--s-muted)]">/{String(total - 1).padStart(2, '0')}</span>
              </span>
              <span className="h-3 w-px bg-[var(--s-line-strong)]" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: phase.color }} />
                {p(phase.label)}
              </span>
            </p>
            <h1 className={`${T.display} mt-4`}>{p(s.title)}</h1>
            <p className={`${T.lead} mt-5 max-w-[62ch]`}>{p(s.short)}</p>
          </div>
          <dl className={`${T.card} p-5 text-sm grid grid-cols-2 gap-4 min-w-0`}>
            {[
              [L('Đầu ra', 'Deliverables'), s.deliverables.length],
              [L('Bộ phận', 'Teams'), s.team?.length ?? 0],
              [L('Hoạt động RACI', 'RACI activities'), s.raci?.length ?? 0],
              [L('Mẫu tài liệu', 'Templates'), s.templates?.length ?? 0],
            ]
              .filter(([, v]) => (v as number) > 0)
              .map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-[color:var(--s-muted)] text-[0.78rem]">{k}</dt>
                  <dd className="font-editorial text-[1.6rem] leading-tight text-[color:var(--s-ink)] tabular-nums">{v}</dd>
                </div>
              ))}
          </dl>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-14">
          {/* Mục lục */}
          <aside className="min-w-0">
            <details className="lg:hidden rounded-lg border border-[color:var(--s-line)] bg-[var(--s-raise)]">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[color:var(--s-ink)]">{L('Mục lục', 'Contents')}</summary>
              <TocList toc={toc} active={active} />
            </details>
            <nav aria-label={L('Mục lục', 'Contents')} className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <p className="text-[0.78rem] text-[color:var(--s-muted)] mb-2">{L('Mục lục', 'Contents')}</p>
              <TocList toc={toc} active={active} />
              <div className="mt-6 pt-5 border-t border-[color:var(--s-line)] space-y-2 text-[0.8rem]">
                <Link href="/about/quy-trinh/to-chuc" className="block text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                  {L('Sơ đồ tổ chức & RACI tổng', 'Organisation & overall RACI')}
                </Link>
                <Link href="/about/nhan-du-an#gui-yeu-cau" className="block text-[color:var(--s-ink)] hover:text-[color:var(--s-accent)]">
                  {L('Gửi yêu cầu dự án', 'Send a project request')}
                </Link>
              </div>
            </nav>
          </aside>

          {/* Nội dung */}
          <article className={`min-w-0 space-y-14 ${css.prose}`}>
            <DocSection id="muc-tieu" title={L('Mục tiêu', 'Goal')}>
              <p className="font-editorial text-[1.3rem] sm:text-[1.45rem] leading-[1.5] text-[color:var(--s-ink)] max-w-[60ch]">{p(s.goal)}</p>
              {loopNote && <p className={`${T.small} mt-3`}>{loopNote}</p>}
            </DocSection>

            {(inputs.length > 0 || s.deliverables.length > 0) && (
              <DocSection id="dau-vao-dau-ra" title={L('Đầu vào → đầu ra', 'Inputs → outputs')}>
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
                  <ListBox
                    title={L('Đầu vào', 'Inputs')}
                    note={!s.inputs?.length && prev ? L(`Đầu ra của giai đoạn ${String(prev.n).padStart(2, '0')}`, `Outputs of stage ${String(prev.n).padStart(2, '0')}`) : undefined}
                    items={inputs.map(p)}
                  />
                  <div aria-hidden className="hidden md:flex items-center text-[color:var(--s-accent)]">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <ListBox title={L('Đầu ra bàn giao', 'Deliverables')} items={s.deliverables.map(p)} strong />
                </div>
              </DocSection>
            )}

            {(s.team?.length || s.departments?.length) && (
              <DocSection id="bo-phan" title={L('Bộ phận & vai trò', 'Teams & roles')}>
                {s.team?.length ? (
                  <ul className="border-t border-[color:var(--s-line)]">
                    {s.team.map((t) => (
                      <li key={t.dept} className="grid gap-1 sm:grid-cols-[15rem_1fr] sm:gap-6 py-3.5 border-b border-[color:var(--s-line)]">
                        <span className="font-semibold text-[color:var(--s-ink)] text-[0.92rem]">{p(DEPT_NAMES[t.dept])}</span>
                        <span className={T.body}>{p(t.role)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2">{s.departments!.map((d) => <li key={d[0]} className={T.body}>{p(d)}</li>)}</ul>
                )}
              </DocSection>
            )}

            {s.raci && s.raci.length > 0 && (
              <DocSection
                id="raci"
                title={L('Ma trận RACI', 'RACI matrix')}
                lead={L(
                  'R — trực tiếp làm · A — chịu trách nhiệm giải trình, duyệt cuối (mỗi hoạt động đúng một A) · C — được hỏi ý kiến trước · I — được báo sau.',
                  'R — does the work · A — accountable, final sign-off (exactly one A per activity) · C — consulted before · I — informed after.',
                )}
              >
                <div className={css.tableWrap}>
                  <table className={css.table}>
                    <thead>
                      <tr>
                        <th scope="col" className={css.stickyCol}>{L('Hoạt động', 'Activity')}</th>
                        {raciCols.map((k) => (
                          <th key={k} scope="col" title={p(DEPT_NAMES[k])} className={css.center}>
                            {shortDept(k, lang)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.raci.map((r) => (
                        <tr key={r.activity[0]}>
                          <th scope="row" className={`${css.stickyCol} font-normal text-[color:var(--s-ink)]`}>{p(r.activity)}</th>
                          {raciCols.map((k) => {
                            const v = r.roles[k];
                            return (
                              <td key={k} className={css.center}>
                                {v ? (
                                  <span className={`${css.raci} ${RACI_CLS[v]}`} title={`${p(DEPT_NAMES[k])}: ${v}`}>
                                    {v}
                                  </span>
                                ) : (
                                  <span className="text-[color:var(--s-line-strong)]" aria-label={L('không tham gia', 'not involved')}>·</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={`${T.small} mt-3`}>
                  {raciCols.map((k) => `${shortDept(k, lang)} = ${p(DEPT_NAMES[k])}`).join('; ')}
                </p>
              </DocSection>
            )}

            <DocSection id="cong-chat-luong" title={L('Cổng chất lượng', 'Quality gate')}>
              <p className="rounded-lg border-l-4 border-[color:var(--s-accent)] bg-[var(--s-accent-soft)] px-5 py-4 text-[0.95rem] leading-relaxed text-[color:var(--s-ink)]">
                {p(s.gate)}
              </p>
              {(s.entryCriteria?.length || s.exitCriteria?.length) && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {s.entryCriteria?.length ? <ListBox title={L('Điều kiện vào (entry criteria)', 'Entry criteria')} items={s.entryCriteria.map(p)} /> : null}
                  {s.exitCriteria?.length ? <ListBox title={L('Điều kiện ra (exit criteria)', 'Exit criteria')} items={s.exitCriteria.map(p)} strong /> : null}
                </div>
              )}
            </DocSection>

            <DocSection id="hoat-dong" title={L('Hoạt động', 'Activities')}>
              <ol className="space-y-4">
                {s.activities.map((a, i) => (
                  <li key={a[0]} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="font-editorial text-[1.05rem] text-[color:var(--s-accent)] tabular-nums">{i + 1}.</span>
                    <span className={T.body}>{p(a)}</span>
                  </li>
                ))}
              </ol>
            </DocSection>

            {s.checklist && s.checklist.length > 0 && (
              <DocSection
                id="checklist"
                title={L('Checklist', 'Checklist')}
                lead={L(
                  `Đánh dấu để tự rà soát — ${nChecked}/${s.checklist.length}. Dấu tích chỉ nằm trên trình duyệt này, không gửi đi đâu.`,
                  `Tick to self-review — ${nChecked}/${s.checklist.length}. Ticks stay in this browser only and are not sent anywhere.`,
                )}
              >
                <ul className="space-y-1">
                  {s.checklist.map((c, i) => (
                    <li key={c[0]}>
                      <label className="flex gap-3 rounded-md px-2 py-2 -mx-2 cursor-pointer hover:bg-[var(--s-band)]">
                        <input
                          type="checkbox"
                          checked={!!checked[i]}
                          onChange={(e) => setChecked((m) => ({ ...m, [i]: e.target.checked }))}
                          className="mt-1 h-4 w-4 shrink-0 accent-[var(--s-ink)]"
                        />
                        <span className={`${T.body} ${checked[i] ? 'line-through opacity-60' : ''}`}>{p(c)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </DocSection>
            )}

            {s.templates && s.templates.length > 0 && (
              <DocSection
                id="mau-tai-lieu"
                title={L('Mẫu tài liệu', 'Document templates')}
                lead={L('Tệp Markdown (.md): mở bằng bất kỳ trình soạn thảo nào, hoặc dán vào Word / Google Docs. Mỗi mẫu ghi rõ mục đích, ai điền, khi nào.', 'Markdown (.md) files: open in any editor, or paste into Word / Google Docs. Each states its purpose, who fills it in and when.')}
              >
                <ul className="grid gap-3 sm:grid-cols-2">
                  {s.templates.map((t) => (
                    <li key={t.name[0]} className={`${T.card} p-4 flex items-start gap-3 min-w-0`}>
                      <FileText className="w-5 h-5 shrink-0 text-[color:var(--s-accent)] mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.92rem] font-semibold text-[color:var(--s-ink)] leading-snug">{p(t.name)}</p>
                        {t.href ? (
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem]">
                            <a href={t.href} download className="inline-flex items-center gap-1 font-semibold text-[color:var(--s-ink)] no-underline hover:text-[color:var(--s-accent)]">
                              <Download className="w-3.5 h-3.5" /> {L('Tải về', 'Download')}
                            </a>
                            <a href={t.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[color:var(--s-muted)] no-underline hover:text-[color:var(--s-ink)]">
                              <ExternalLink className="w-3.5 h-3.5" /> {L('Xem', 'View')}
                            </a>
                          </div>
                        ) : (
                          <p className={`${T.small} mt-1`}>{L('Đang soạn', 'In preparation')}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </DocSection>
            )}

            <DocSection id="khach-hang" title={L('Khách hàng tham gia', 'Client involvement')}>
              <Dots items={s.client.map(p)} />
            </DocSection>

            <DocSection id="cong-cu" title={L('Công cụ', 'Tools')}>
              <ul className="flex flex-wrap gap-2">
                {s.tools.map((t) => (
                  <li key={t} className="px-2.5 py-1 rounded-md border border-[color:var(--s-line)] bg-[var(--s-band)] text-[0.82rem] text-[color:var(--s-ink-2)]">
                    {t}
                  </li>
                ))}
              </ul>
            </DocSection>

            <DocSection id="chuan" title={L('Chuẩn tham chiếu', 'Reference standards')}>
              <dl className="border-t border-[color:var(--s-line)]">
                {s.standards.map((x) => (
                  <div key={x.name} className="grid gap-1 sm:grid-cols-[16rem_1fr] sm:gap-6 py-3.5 border-b border-[color:var(--s-line)]">
                    <dt className="font-semibold text-[color:var(--s-ink)] text-[0.9rem]">{x.name}</dt>
                    <dd className={T.body}>{p(x.note)}</dd>
                  </div>
                ))}
              </dl>
            </DocSection>

            {s.pitfalls && s.pitfalls.length > 0 && (
              <DocSection id="sai-lam" title={L('Sai lầm hay gặp', 'Common pitfalls')}>
                <ul className="space-y-3">
                  {s.pitfalls.map((x) => (
                    <li key={x[0]} className="flex gap-3">
                      <span aria-hidden className="mt-[0.5rem] shrink-0 w-3 h-0.5 bg-red-500/70" />
                      <span className={T.body}>{p(x)}</span>
                    </li>
                  ))}
                </ul>
              </DocSection>
            )}

            {s.example && (
              <DocSection id="vi-du" title={L('Ví dụ thật', 'Real example')}>
                <blockquote className="border-l-2 border-[color:var(--s-ink)] pl-5 text-[0.95rem] leading-[1.75] text-[color:var(--s-body)]">
                  {renderTicks(p(s.example))}
                </blockquote>
              </DocSection>
            )}

            {s.learn.length > 0 && (
              <DocSection id="hoc" title={L('Học ở đâu', 'Where to learn')} lead={L('Môn học và khoá học trên cuongthai.com dạy đúng phần việc của giai đoạn này.', 'Subjects and courses on cuongthai.com that teach this stage’s work.')}>
                <LearnList links={s.learn} lang={lang} />
              </DocSection>
            )}

            {/* Trước / sau */}
            <nav aria-label={L('Giai đoạn kề', 'Adjacent stages')} className="grid gap-3 sm:grid-cols-2 pt-4">
              {prev ? (
                <Link href={stageHref(prev)} className={`${T.card} p-5 no-underline hover:border-[color:var(--s-ink)] transition-colors`}>
                  <span className="flex items-center gap-1.5 text-[0.78rem] text-[color:var(--s-muted)]">
                    <ArrowLeft className="w-3.5 h-3.5" /> {L('Giai đoạn trước', 'Previous stage')} · {String(prev.n).padStart(2, '0')}
                  </span>
                  <span className="mt-1 block font-semibold text-[color:var(--s-ink)]">{p(prev.title)}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={stageHref(next)} className={`${T.card} p-5 text-right no-underline hover:border-[color:var(--s-ink)] transition-colors`}>
                  <span className="flex items-center justify-end gap-1.5 text-[0.78rem] text-[color:var(--s-muted)]">
                    {L('Giai đoạn sau', 'Next stage')} · {String(next.n).padStart(2, '0')} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="mt-1 block font-semibold text-[color:var(--s-ink)]">{p(next.title)}</span>
                </Link>
              ) : (
                <Link href="/about/nhan-du-an#gui-yeu-cau" className={`${T.card} p-5 text-right no-underline hover:border-[color:var(--s-ink)] transition-colors`}>
                  <span className="block text-[0.78rem] text-[color:var(--s-muted)]">{L('Hết quy trình', 'End of the process')}</span>
                  <span className="mt-1 block font-semibold text-[color:var(--s-ink)]">{L('Gửi yêu cầu dự án', 'Send a project request')}</span>
                </Link>
              )}
            </nav>
          </article>
        </div>
      </div>
    </StudioShell>
  );
}

// ─── Mảnh nhỏ ───────────────────────────────────────────────────────────────

/** Tên viết tắt cho tiêu đề cột RACI (đủ hẹp để bảng vừa màn hình). */
function shortDept(k: DeptKey, lang: 'vi' | 'en'): string {
  const vi: Record<DeptKey, string> = {
    sales: 'KD', ba: 'BA', ux: 'UX', arch: 'KT', pm: 'PM', dev: 'Dev', qa: 'QA', sec: 'Sec',
    devops: 'Ops', infra: 'HT', data: 'Data', support: 'HTKH', legal: 'PL', pmo: 'PMO', client: 'Khách',
  };
  const en: Record<DeptKey, string> = {
    sales: 'Sales', ba: 'BA', ux: 'UX', arch: 'Arch', pm: 'PM', dev: 'Dev', qa: 'QA', sec: 'Sec',
    devops: 'Ops', infra: 'Infra', data: 'Data', support: 'CS', legal: 'Legal', pmo: 'PMO', client: 'Client',
  };
  return (lang === 'en' ? en : vi)[k];
}

function TocList({ toc, active }: { toc: { id: string; label: string }[]; active?: string }) {
  return (
    <ol className="py-2 lg:py-0 space-y-0.5">
      {toc.map((t) => {
        const on = t.id === active;
        return (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={on ? 'location' : undefined}
              className={`block border-l-2 px-4 lg:px-3 py-1.5 text-[0.85rem] leading-snug transition-colors ${
                on
                  ? 'border-[color:var(--s-accent)] text-[color:var(--s-ink)] font-semibold'
                  : 'border-transparent text-[color:var(--s-muted)] hover:text-[color:var(--s-ink)]'
              }`}
            >
              {t.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function DocSection({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-editorial text-[1.55rem] leading-tight text-[color:var(--s-ink)] pb-3 mb-5 border-b border-[color:var(--s-line)]">{title}</h2>
      {lead && <p className={`${T.small} -mt-2 mb-5 max-w-[70ch]`}>{lead}</p>}
      {children}
    </section>
  );
}

function ListBox({ title, items, note, strong }: { title: string; items: string[]; note?: string; strong?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 min-w-0 ${strong ? 'border-[color:var(--s-ink)]' : 'border-[color:var(--s-line)]'} bg-[var(--s-raise)]`}>
      <p className="text-[0.85rem] font-semibold text-[color:var(--s-ink)]">{title}</p>
      {note && <p className="text-[0.75rem] text-[color:var(--s-muted)] mt-0.5">{note}</p>}
      <Dots items={items} className="mt-3" />
    </div>
  );
}

function Dots({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((it) => (
        <li key={it} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-[color:var(--s-body)]">
          <span aria-hidden className="mt-[0.6rem] w-1 h-1 shrink-0 rounded-full bg-[var(--s-ink-2)]" />
          <span className="min-w-0">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function LearnList({ links, lang }: { links: LearnLink[]; lang: 'vi' | 'en' }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="flex items-center gap-3 rounded-lg border border-[color:var(--s-line)] px-4 py-3 no-underline hover:border-[color:var(--s-ink)] transition-colors"
          >
            <span className="shrink-0 text-[0.7rem] font-semibold px-1.5 py-0.5 rounded bg-[var(--s-band)] text-[color:var(--s-ink-2)]">
              {l.kind === 'academy' ? (lang === 'en' ? 'Subject' : 'Môn') : lang === 'en' ? 'Course' : 'Khoá'}
            </span>
            <span className="text-[0.88rem] font-medium text-[color:var(--s-ink)] min-w-0">{l.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** `mã` trong ví dụ → <code>. */
function renderTicks(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={i} className="px-1 py-0.5 rounded bg-[var(--s-band)] text-[0.85em] font-mono text-[color:var(--s-ink)]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

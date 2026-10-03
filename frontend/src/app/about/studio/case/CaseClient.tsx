'use client';

/**
 * Trang case study — giao diện. Dữ liệu do page.tsx (server) truyền xuống, file
 * này chỉ `import type` từ cases.ts để chữ của bốn case còn lại không vào gói JS.
 *
 * Dùng chung bộ token của /about/studio (`.paper` trong broadsheet.module.css:
 * sáng/tối qua `html.theme-dark`, KHÔNG dùng `dark:` của Tailwind). Bố cục riêng
 * ở case.module.css. Không hook nào nằm sau return sớm.
 *
 * ⛔ Con số: `live` lấy từ `useAboutStats()`; không về ⇒ ẨN dòng, không hiện 0.
 */
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAboutStats, fmt } from '@/components/about/useAboutData';
import { StudioShell, useStudioLang } from '@/components/studio/StudioUI';
import type { Bi } from '../content';
import type { ArchNode, CaseStudy, Metric, MetricGroup } from '../cases';
import b from '../broadsheet.module.css';
import c from './case.module.css';

type Near = { slug: string; name: string } | null;

export default function CaseClient({
  cs,
  index,
  total,
  prev,
  next,
  countedOn,
  codebaseOn,
}: {
  cs: CaseStudy;
  index: number;
  total: number;
  prev: Near;
  next: Near;
  countedOn: string;
  codebaseOn: string;
}) {
  const { lang, L } = useStudioLang();
  const stats = useAboutStats();
  const p = (v: Bi) => (lang === 'en' ? v[1] : v[0]);
  const date = (iso: string) => new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN');
  const num = (n: number) => fmt(n, lang);

  const hasRisks = cs.incidents.length === 0 && (cs.risks?.length ?? 0) > 0;
  const toc: [string, string][] = [
    ['boi-canh', L('Bối cảnh', 'Context')],
    ['nguoi-dung', L('Người dùng', 'Users')],
    ['giai-phap', L('Giải pháp', 'Solution')],
    ['kien-truc', L('Kiến trúc', 'Architecture')],
    ['quyet-dinh', L('Quyết định', 'Decisions')],
    ['su-co', hasRisks ? L('Rủi ro', 'Risks') : L('Sự cố', 'Incidents')],
    ['con-so', L('Con số', 'Numbers')],
    ['cong-nghe', L('Công nghệ', 'Stack')],
  ];

  const groupNote = (g: MetricGroup) => {
    if (g.source === 'codebase') return L(`Sinh tự động từ kho Git ngày ${date(codebaseOn)}`, `Generated from the Git repository on ${date(codebaseOn)}`);
    if (g.source === 'live') return stats ? L('Đếm trực tiếp từ cơ sở dữ liệu', 'Counted live from the database') : L('Đang tải từ cơ sở dữ liệu…', 'Loading from the database…');
    return L(`Đếm bằng lệnh trên kho mã ngày ${date(countedOn)}`, `Counted by command on the codebase on ${date(countedOn)}`);
  };
  const valueOf = (m: Metric): number | null => {
    if (m.live) {
      const v = stats?.[m.live];
      return typeof v === 'number' ? v : null;
    }
    return typeof m.value === 'number' ? m.value : null;
  };

  return (
    <StudioShell step={1} className={b.paper}>
      <article className={c.wrap}>
        <nav className={c.crumb} aria-label={L('Đường dẫn', 'Breadcrumb')}>
          <Link href="/about/studio#studio-work" className={c.back}>
            <ArrowLeft aria-hidden size={16} />
            {L('Studio · Sản phẩm', 'Studio · Products')}
          </Link>
        </nav>

        {/* ── Mở ───────────────────────────────────────────────────────── */}
        <header className={c.hero}>
          <p className={c.eyebrow}>
            CASE STUDY {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h1 className={c.title}>{cs.name}</h1>
          <p className={c.kind}>{p(cs.kind)}</p>
          <p className={c.summary}>{p(cs.summary)}</p>
          {cs.caveat && <p className={c.caveat}>{p(cs.caveat)}</p>}
          <dl className={c.facts}>
            <div>
              <dt>{L('Trạng thái', 'Status')}</dt>
              <dd>
                <span className={c.status}>{p(cs.status)}</span>
              </dd>
            </div>
            <div>
              <dt>{L('Thời gian', 'Timeline')}</dt>
              <dd>{p(cs.period)}</dd>
            </div>
            <div>
              <dt>{L('Nền tảng', 'Platforms')}</dt>
              <dd>{p(cs.platforms)}</dd>
            </div>
            <div>
              <dt>{L('Vai trò', 'Role')}</dt>
              <dd>{p(cs.role)}</dd>
            </div>
          </dl>
          {cs.links.length > 0 && (
            <ul className={c.links}>
              {cs.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={c.link}>
                    {p(l.label)}
                    <ArrowUpRight aria-hidden size={16} />
                  </Link>
                  {l.note && <span className={c.linkNote}>{p(l.note)}</span>}
                </li>
              ))}
            </ul>
          )}
        </header>

        <nav className={c.toc} aria-label={L('Trong case study này', 'In this case study')}>
          {toc.map(([id, label], i) => (
            <a key={id} href={`#${id}`}>
              <span className={c.tocNo}>{String(i + 1).padStart(2, '0')}</span>
              {label}
            </a>
          ))}
        </nav>

        {/* ── 01 Bối cảnh ──────────────────────────────────────────────── */}
        <Part id="boi-canh" n={1} title={L('Bối cảnh & bài toán', 'Context & problem')}>
          <div className={c.prose}>
            {cs.context.map((t) => (
              <p key={t[0]}>{p(t)}</p>
            ))}
          </div>
        </Part>

        {/* ── 02 Người dùng ────────────────────────────────────────────── */}
        <Part id="nguoi-dung" n={2} title={L('Người dùng', 'Who it serves')}>
          <ul className={c.cards}>
            {cs.users.map((u) => (
              <li key={u.who[0]} className={c.card}>
                <h3 className={c.cardTitle}>{p(u.who)}</h3>
                <p className={c.cardBody}>{p(u.need)}</p>
              </li>
            ))}
          </ul>
        </Part>

        {/* ── 03 Giải pháp ─────────────────────────────────────────────── */}
        <Part id="giai-phap" n={3} title={L('Giải pháp & tính năng chính', 'Solution & key features')}>
          <ul className={c.cards}>
            {cs.solution.map((f) => (
              <li key={f.title[0]} className={c.card}>
                <h3 className={c.cardTitle}>{p(f.title)}</h3>
                <p className={c.cardBody}>{p(f.body)}</p>
              </li>
            ))}
          </ul>
        </Part>

        {/* ── 04 Kiến trúc ─────────────────────────────────────────────── */}
        <Part id="kien-truc" n={4} title={L('Kiến trúc', 'Architecture')}>
          <figure className={c.arch}>
            <ol className={c.tiers}>
              {cs.arch.tiers.map((t, i) => (
                <li key={t.label[0]} className={c.tierItem}>
                  <div className={c.tier}>
                    <p className={c.tierLabel}>{p(t.label)}</p>
                    <ul className={c.nodes}>
                      {t.nodes.map((nd) => (
                        <li key={nodeKey(nd)} className={c.node}>
                          <span className={c.nodeName}>{nodeName(nd, p)}</span>
                          {nd.note && <span className={c.nodeNote}>{p(nd.note)}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < cs.arch.tiers.length - 1 && (
                    <div className={c.flow}>
                      <span aria-hidden className={c.flowLine} />
                      <span className={c.flowLabel}>
                        <span aria-hidden>↓ </span>
                        {t.flow ? p(t.flow) : ''}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <figcaption className={c.caption}>{p(cs.arch.caption)}</figcaption>
          </figure>

          {cs.arch.pipeline && (
            <div className={c.pipeline}>
              <h3 className={c.subhead}>{p(cs.arch.pipeline.title)}</h3>
              <ol className={c.steps}>
                {cs.arch.pipeline.steps.map((st, i) => (
                  <li key={st.name[0]} className={c.step}>
                    <span className={c.stepNo} aria-hidden>
                      {i + 1}
                    </span>
                    <span className={c.stepText}>
                      <span className={c.stepName}>{p(st.name)}</span>
                      {st.note && <span className={c.nodeNote}>{p(st.note)}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {cs.arch.notes && (
            <div className={c.prose}>
              {cs.arch.notes.map((t) => (
                <p key={t[0]}>{p(t)}</p>
              ))}
            </div>
          )}
        </Part>

        {/* ── 05 Quyết định ────────────────────────────────────────────── */}
        <Part id="quyet-dinh" n={5} title={L('Quyết định kỹ thuật khó & đánh đổi', 'Hard technical decisions & trade-offs')}>
          <div className={c.entries}>
            {cs.decisions.map((d, i) => (
              <article key={d.title[0]} className={c.entry}>
                <h3 className={c.entryTitle}>
                  <span className={c.entryNo}>{String(i + 1).padStart(2, '0')}</span>
                  {p(d.title)}
                </h3>
                <dl className={c.triple}>
                  <div>
                    <dt>{L('Bài toán', 'Problem')}</dt>
                    <dd>{p(d.problem)}</dd>
                  </div>
                  <div>
                    <dt>{L('Lựa chọn', 'Decision')}</dt>
                    <dd>{p(d.choice)}</dd>
                  </div>
                  <div>
                    <dt>{L('Đánh đổi', 'Trade-off')}</dt>
                    <dd>{p(d.tradeoff)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Part>

        {/* ── 06 Sự cố / Rủi ro ────────────────────────────────────────── */}
        <Part
          id="su-co"
          n={6}
          title={hasRisks ? L('Rủi ro đã nhận diện', 'Identified risks') : L('Sự cố thật & bài học', 'Real incidents & lessons')}
        >
          {cs.incidentsNote && <p className={c.lede}>{p(cs.incidentsNote)}</p>}
          {cs.incidents.length > 0 && (
            <div className={c.entries}>
              {cs.incidents.map((ic) => (
                <article key={ic.title[0]} className={c.entry}>
                  <h3 className={c.entryTitle}>{p(ic.title)}</h3>
                  {ic.date && <p className={c.date}>{ic.date}</p>}
                  <dl className={c.triple}>
                    <div>
                      <dt>{L('Chuyện gì xảy ra', 'What happened')}</dt>
                      <dd>{p(ic.what)}</dd>
                    </div>
                    <div>
                      <dt>{L('Nguyên nhân', 'Root cause')}</dt>
                      <dd>{p(ic.cause)}</dd>
                    </div>
                    <div>
                      <dt>{L('Sửa & chốt chặn', 'Fix & safeguard')}</dt>
                      <dd>{p(ic.fix)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
          {hasRisks && (
            <ul className={c.risks}>
              {cs.risks!.map((r) => (
                <li key={r[0]}>{p(r)}</li>
              ))}
            </ul>
          )}
        </Part>

        {/* ── 07 Con số ────────────────────────────────────────────────── */}
        <Part id="con-so" n={7} title={L('Con số đo được', 'Measured numbers')}>
          <p className={c.lede}>
            {L(
              'Không có số người dùng, doanh thu hay khách hàng ở đây — chỉ những gì đếm được từ mã nguồn và cơ sở dữ liệu. Mỗi dòng ghi cách đếm để bạn tự kiểm. Số nào không đếm được thì không hiện.',
              'No user, revenue or client numbers here — only what can be counted from source code and the database. Each row says how it was counted so you can check it. Anything that cannot be counted is not shown.',
            )}
          </p>
          <div className={c.metricGroups}>
            {cs.metrics.map((g) => {
              const rows = g.items.map((m) => [m, valueOf(m)] as const).filter(([, v]) => v !== null);
              return (
                <section key={g.title[0]} className={c.metricGroup} aria-label={p(g.title)}>
                  <header className={c.metricHead}>
                    <h3 className={c.subhead}>{p(g.title)}</h3>
                    <p className={c.date}>{groupNote(g)}</p>
                  </header>
                  {rows.length > 0 && (
                    <dl className={c.ledger}>
                      {rows.map(([m, v]) => (
                        <div key={m.label[0]} className={c.ledgerRow}>
                          <dt>
                            <span className={c.ledgerLabel}>{p(m.label)}</span>
                            <span className={c.how}>{p(m.how)}</span>
                          </dt>
                          <dd>
                            {num(v as number)}
                            {m.suffix ?? ''}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </section>
              );
            })}
          </div>
        </Part>

        {/* ── 08 Công nghệ ─────────────────────────────────────────────── */}
        <Part id="cong-nghe" n={8} title={L('Công nghệ', 'Technology')}>
          <dl className={c.stack}>
            {cs.stack.map((s) => (
              <div key={s.group[0]} className={c.stackRow}>
                <dt>{p(s.group)}</dt>
                <dd>{s.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </Part>

        {/* ── Kết ─────────────────────────────────────────────────────── */}
        <footer className={c.end}>
          <nav className={c.pager} aria-label={L('Case study khác', 'Other case studies')}>
            {prev ? (
              <Link href={`/about/studio/case/${prev.slug}`} className={c.pagerLink}>
                <span className={c.pagerDir}>
                  <ArrowLeft aria-hidden size={14} /> {L('Trước', 'Previous')}
                </span>
                <span className={c.pagerName}>{prev.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/about/studio/case/${next.slug}`} className={`${c.pagerLink} ${c.pagerNext}`}>
                <span className={c.pagerDir}>
                  {L('Tiếp', 'Next')} <ArrowRight aria-hidden size={14} />
                </span>
                <span className={c.pagerName}>{next.name}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
          <div className={c.cta}>
            <p className={c.ctaText}>
              {L(
                'Dự án của bạn được làm và vận hành theo đúng cách trên: quyết định có lý do, sự cố có chốt chặn, con số đếm được.',
                'Your project is built and run the same way: decisions with reasons, incidents with safeguards, numbers you can count.',
              )}
            </p>
            <div className={c.ctaLinks}>
              <Link href="/about/nhan-du-an" className={b.primary}>
                {L('Gửi yêu cầu dự án', 'Send a project request')}
                <ArrowRight aria-hidden size={16} />
              </Link>
              <Link href="/about/quy-trinh" className={c.link}>
                {L('Xem quy trình', 'See the process')}
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </StudioShell>
  );
}

function nodeKey(nd: ArchNode): string {
  return typeof nd.name === 'string' ? nd.name : nd.name[0];
}
function nodeName(nd: ArchNode, p: (v: Bi) => string): string {
  return typeof nd.name === 'string' ? nd.name : p(nd.name);
}

/** Một phần của case study: số + tiêu đề bên trái (màn rộng), nội dung bên phải. */
function Part({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section className={c.part} aria-labelledby={`${id}-h`} id={id}>
      <header className={c.partHead}>
        <span className={c.partNo}>{String(n).padStart(2, '0')}</span>
        <h2 id={`${id}-h`} className={c.partTitle}>
          {title}
        </h2>
      </header>
      <div className={c.partBody}>{children}</div>
    </section>
  );
}

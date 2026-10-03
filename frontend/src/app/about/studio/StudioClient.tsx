'use client';

/**
 * /about/studio — BƯỚC 1/3 của luồng "Studio doanh nghiệp": Giới thiệu.
 *
 * Bản "broadsheet" (Hallmark redesign 01/10/2026): macrostructure Feature Stack
 * — cột trái là chữ của chương, dính khi cuộn; cột phải là các cảnh 3D cắt
 * nối nhau như phim (bộ máy ở `cinema.tsx`, token + stamp ở
 * `broadsheet.module.css`). Chương: ① lời mở + hồ sơ · ② số liệu đếm được ·
 * ③ năm sản phẩm, mỗi sản phẩm một cảnh · ④ năng lực · ⑤ cam kết + quy mô ·
 * ⑥ lối sang Quy trình (chính) và Nhận dự án (phụ).
 *
 * ⛔ Cùng luật với /about (đọc đầu `app/about/page.tsx`): mọi con số phải ĐẾM
 * ĐƯỢC từ đúng hai nguồn — `useAboutStats()` (DB) và `codebaseStats.json`
 * (sinh lúc deploy). Không đếm được ⇒ ẨN ô đó, không thay bằng 0.
 * Không số khách, không logo khách, không lời khen, không "N năm kinh nghiệm".
 * Mô tả sản phẩm lấy từ chính repo (README, package.json), không phóng đại.
 */
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useAboutStats, fmt } from '@/components/about/useAboutData';
import codebase from '@/data/codebaseStats.json';
import { NextStep, STUDIO_EMAIL, StudioShell, useStudioLang } from '@/components/studio/StudioUI';
import { CinemaProvider, Scene } from './cinema';
import { CAPABILITIES, PRINCIPLES, PRODUCTS, SIZE_NOTES, type Bi, type ChartNode, type Product } from './content';
import s from './broadsheet.module.css';
import ProductStage from './ProductStage';
import { caseHref } from './caseSlugs';

type Row = [string, number | null];

/** `stageCount` do page.tsx (server) đếm từ data.ts — để data.ts (~200 KB) không vào gói JS của trang này. */
export default function StudioClient({ stageCount }: { stageCount: number }) {
  const { lang, L } = useStudioLang();
  const stats = useAboutStats();
  const n = (v: number | null | undefined) => fmt(v, lang);
  const p = (b: Bi) => (lang === 'en' ? b[1] : b[0]);

  // Ngày cập nhật số liệu mã nguồn — hiện kèm để người đọc biết số "của hôm nào".
  const codeDate = new Date(codebase.generatedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN');

  // Dòng đầu tiên còn số sẽ được in lớn — xếp dòng đáng nhấn lên trước.
  const codeRows: Row[] = [
    [L('Dòng mã nguồn', 'Lines of source code'), codebase.sourceLines],
    [L('Commit trong lịch sử Git', 'Git commits'), codebase.commits],
    [L('Trang web (route)', 'Web pages (routes)'), codebase.pages],
    [L('Nhóm API (router)', 'API routers'), codebase.apiRouters],
    [L('Bảng dữ liệu (Prisma model)', 'Data models (Prisma)'), codebase.prismaModels],
    [L('Migration cơ sở dữ liệu', 'Database migrations'), codebase.migrations],
  ];
  const contentRows: Row[] = [
    [L('Bài học', 'Lessons'), stats?.lessons ?? null],
    [L('Khoá học', 'Courses'), stats?.courses ?? null],
    [L('Bài tập lập trình', 'Coding exercises'), stats?.exercises ?? null],
    [L('Câu hỏi thi', 'Exam questions'), stats?.examQuestions ?? null],
    [L('Câu hỏi phỏng vấn', 'Interview questions'), stats?.interviewQuestions ?? null],
  ];

  const profile: [string, React.ReactNode][] = [
    [L('Hình thức', 'Type'), L('Studio phần mềm độc lập', 'Independent software studio')],
    [L('Người phụ trách', 'Lead'), L('Cường — kỹ sư chính, chịu trách nhiệm toàn bộ dự án', 'Cường — lead engineer, accountable for the whole project')],
    [L('Quy mô', 'Size'), L('Một kỹ sư chính; mời thêm cộng sự theo vai khi dự án cần, ghi rõ trong đề xuất', 'One lead engineer; specialists join by role when a project needs them, named in the proposal')],
    [L('Sản phẩm đang vận hành', 'Running in production'), 'cuongthai.com'],
    [L('Tài liệu', 'Documents'), L('Tiếng Việt, kèm thuật ngữ tiếng Anh', 'Vietnamese, with English terminology')],
    [
      L('Liên hệ', 'Contact'),
      <a key="mail" href={`mailto:${STUDIO_EMAIL}`} className={s.mail}>
        {STUDIO_EMAIL}
      </a>,
    ],
  ];

  return (
    <StudioShell step={1} className={s.paper}>
      <CinemaProvider>
        <div className={s.frame}>
          {/* ① Lời mở ───────────────────────────────────────────────────── */}
          <section className={`${s.chapter} ${s.chapterFirst}`} aria-labelledby="studio-open">
            <div className={s.chapterGrid}>
              <div className={s.pane}>
                <div className={s.paneInner}>
                  <p className={s.eyebrow}>CUONGHOANG STUDIO / INDEPENDENT SOFTWARE</p>
                  <h1 id="studio-open" className={s.display}>
                    {L('Từ ý tưởng đến phần mềm dùng thật.', 'Ideas, made into working software.')}
                  </h1>
                  {/* Câu mở chia hai: câu đầu làm lời dẫn, câu sau xuống dưới nút —
                      để tiêu đề + lời dẫn + nút chính nằm gọn trong màn hình đầu. */}
                  <p className={s.lead}>
                    {L(
                      'Studio phần mềm độc lập do Cường (Cuong Hoang) — sinh viên Kỹ thuật phần mềm, Đại học FPT — dựng và vận hành.',
                      'An independent software studio founded and run by Cường (Cuong Hoang), a Software Engineering student at FPT University.',
                    )}
                  </p>
                  <div className={s.actions}>
                    <Link href="#studio-work" className={s.primary}>
                      {L('Khám phá sản phẩm', 'Explore the work')}
                      <ArrowRight aria-hidden className="w-4 h-4" />
                    </Link>
                    <Link href="/about/nhan-du-an" className={s.link}>
                      {L('Gửi yêu cầu', 'Send a request')}
                    </Link>
                  </div>
                  <p className={s.body}>
                    {L(
                      'Studio làm web, ứng dụng di động, công cụ nội bộ và tích hợp AI; mỗi dự án đi qua các giai đoạn có tài liệu, có cổng chất lượng và có người chịu trách nhiệm rõ ràng.',
                      'The studio builds web, mobile, internal tools and AI integrations; every project moves through documented stages, quality gates and clear ownership.',
                    )}
                  </p>
                </div>
              </div>
              <ProductStage lang={lang} />
            </div>
          </section>

          <nav className={s.sectionNav} aria-label={L('Trong trang studio', 'On this page')}>
            <a href="#studio-work">{L('Sản phẩm', 'Selected work')}</a>
            <a href="#studio-evidence">{L('Bằng chứng', 'Evidence')}</a>
            <a href="#studio-profile">{L('Người đứng sau', 'The person behind it')}</a>
            <Link href="/about/quy-trinh">{L('Cách làm việc', 'How we work')} <ArrowRight size={14} aria-hidden /></Link>
          </nav>
          <section id="studio-profile" className={s.profileSection} aria-labelledby="studio-profile-title">
            <div><p className={s.eyebrow}>{L('Độc lập. Trực tiếp. Rõ trách nhiệm.', 'Independent. Direct. Accountable.')}</p>
              <h2 id="studio-profile-title" className={s.heading}>{L('Một người phụ trách.\nMột đầu mối xuyên suốt.', 'One lead.\nOne point of contact.')}</h2>
              <p className={s.body}>{L('Bạn trao đổi trực tiếp với người xây dựng sản phẩm. Phạm vi, người tham gia và đầu ra được làm rõ trong đề xuất — không để tới ngày bàn giao.', 'Work directly with the person building your product. Scope, contributors and deliverables are clarified in the proposal — not left until handover.')}</p>
            </div>
            <details className={s.profileDetails}><summary>{L('Xem hồ sơ studio', 'View studio profile')}</summary>
              <dl className={s.register}>{profile.map(([k, v]) => <div key={k} className={s.registerRow}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </details>
          </section>

          {/* ② Số liệu đếm được ─────────────────────────────────────────── */}
          <Chapter
            id="studio-evidence"
            title={L('Số liệu đếm từ sản phẩm thật', 'Numbers counted from a real product')}
            lead={L(
              'Không có con số nào trên trang này được gõ tay. Số mã nguồn đếm từ kho Git mỗi lần triển khai; số nội dung đếm trực tiếp từ cơ sở dữ liệu lúc bạn mở trang. Ô nào chưa đếm được thì không hiện.',
              'No number on this page is typed by hand. Code figures are counted from the Git repository at each deploy; content figures are counted live from the database when you open the page. Anything that can’t be counted is not shown.',
            )}
          >
            <Scene label={L('Mã nguồn cuongthai.com', 'cuongthai.com codebase')}>
              <Figures
                title={L('Mã nguồn cuongthai.com', 'cuongthai.com codebase')}
                note={L(`Đếm ngày ${codeDate}`, `Counted on ${codeDate}`)}
                rows={codeRows}
                f={n}
              />
            </Scene>
            <Scene label={L('Nội dung đang phục vụ người học', 'Content serving learners')} closing>
              <Figures
                title={L('Nội dung đang phục vụ người học', 'Content serving learners')}
                note={stats ? L('Đếm trực tiếp từ cơ sở dữ liệu', 'Counted live from the database') : L('Đang tải từ cơ sở dữ liệu…', 'Loading from the database…')}
                rows={contentRows}
                f={n}
              />
            </Scene>
          </Chapter>

          {/* ③ Năm sản phẩm — mỗi sản phẩm một cảnh ───────────────────────── */}
          <Chapter
            id="studio-work"
            title={L('Đã làm và đang vận hành', 'Built and running')}
            lead={L(
              'Các sản phẩm dưới đây do studio thiết kế, lập trình, triển khai và tự vận hành. Đây là sản phẩm của chính studio, không phải dự án khách hàng.',
              'These products were designed, built, deployed and are operated by the studio itself. They are the studio’s own products, not client work.',
            )}
          >
            {PRODUCTS.map((pr, i) => (
              <Scene key={pr.id} label={pr.name} closing={i === PRODUCTS.length - 1}>
                <ProductScene pr={pr} p={p} L={L} />
              </Scene>
            ))}
          </Chapter>

          {/* ④ Năng lực ─────────────────────────────────────────────────── */}
          <Chapter
            id="studio-stack"
            title={L('Công nghệ đang dùng trong production', 'Technology in production today')}
            lead={L(
              'Chỉ liệt kê những gì đang chạy thật trong các sản phẩm ở trên. Công nghệ ngoài danh sách vẫn nhận được, nhưng sẽ ghi rõ là cần thời gian tìm hiểu trong đề xuất.',
              'Only what runs in the products above is listed. Other technology is possible, but the proposal will say plainly that it needs ramp-up time.',
            )}
            extra={
              <>
                <p className={s.muted}>
                  {L(
                    'Nền tảng học thuật đi theo chương trình Kỹ thuật phần mềm: yêu cầu phần mềm, kiến trúc & thiết kế, kiểm thử, cơ sở dữ liệu.',
                    'The academic foundation follows the Software Engineering curriculum: requirements, architecture & design, testing, databases.',
                  )}
                </p>
                <div className={s.actions}>
                  <Link href="/academy" className={s.link}>
                    {L('Xem các môn trên Academy', 'See subjects on Academy')}
                    <ArrowRight aria-hidden className="w-4 h-4" />
                  </Link>
                </div>
              </>
            }
          >
            <Scene label={L('Web, backend và ứng dụng', 'Web, back end and apps')}>
              <Spec rows={CAPABILITIES.slice(0, 3)} p={p} />
            </Scene>
            <Scene label={L('Hạ tầng và AI', 'Infrastructure and AI')} closing>
              <Spec rows={CAPABILITIES.slice(3)} p={p} />
            </Scene>
          </Chapter>

          {/* ⑤ Cam kết + nói trước về quy mô ─────────────────────────────── */}
          <Chapter
            id="studio-terms"
            title={L('Bốn cam kết với mọi dự án', 'Four commitments on every project')}
            lead={L(
              'Cách studio làm việc, và giới hạn của nó — nói trước khi bạn quyết định.',
              'How the studio works, and where its limits are — said before you decide.',
            )}
            extra={
              <div className={s.linkRow}>
                <a href="https://github.com/cuonghoang1103" target="_blank" rel="noopener noreferrer" className={s.link}>
                  <Github aria-hidden /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/cuong-hoang-843a37258/" target="_blank" rel="noopener noreferrer" className={s.link}>
                  <Linkedin aria-hidden /> LinkedIn
                </a>
                <a href={`mailto:${STUDIO_EMAIL}`} className={s.link}>
                  <Mail aria-hidden /> Email
                </a>
                <Link href="/about" className={s.link}>
                  {L('Trang cá nhân đầy đủ', 'Full personal page')}
                </Link>
              </div>
            }
          >
            <Scene label={L('Bốn cam kết', 'Four commitments')}>
              <ol className={s.vows}>
                {PRINCIPLES.map((pr, i) => (
                  <li key={pr.title[0]} className={s.vow}>
                    <span aria-hidden className={s.vowNo}>
                      {i + 1}
                    </span>
                    <div>
                      <h3 className={s.vowTitle}>{p(pr.title)}</h3>
                      <p className={s.body}>{p(pr.body)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Scene>
            <Scene label={L('Nói trước về quy mô', 'A word on size')} closing>
              <h3 className={s.heading}>{L('Nói trước về quy mô', 'A word on size')}</h3>
              <ul className={s.notes}>
                {SIZE_NOTES.map((b) => (
                  <li key={b[0]} className={s.body}>
                    <span>{p(b)}</span>
                  </li>
                ))}
              </ul>
            </Scene>
          </Chapter>

          {/* ⑥ Kết — lối sang Quy trình (chính) và Nhận dự án (phụ) ──────── */}
          <section className={s.closing} aria-labelledby="studio-next">
            <div className={s.closingGrid}>
              <div className={s.paneInner}>
                <h2 id="studio-next" className={s.display}>
                  {L(`Quy trình ${stageCount} giai đoạn, viết ra đầy đủ.`, `A ${stageCount}-stage process, written out in full.`)}
                </h2>
                <p className={s.body}>
                  {L(
                    'Mỗi giai đoạn kết thúc bằng tài liệu bàn giao và một cổng chất lượng có điều kiện rõ ràng. Đọc trước khi gửi yêu cầu.',
                    'Each stage ends with a deliverable and a quality gate with explicit criteria. Read it before you send a request.',
                  )}
                </p>
                <div className={s.actions}>
                  <Link href="/about/quy-trinh" className={s.cta}>
                    {L('Xem quy trình', 'See the process')}
                    <ArrowRight aria-hidden />
                  </Link>
                </div>
              </div>
              <NextStep
                variant="plain"
                className={s.next}
                href="/about/nhan-du-an"
                step={L('Bước 2 / 3', 'Step 2 of 3')}
                title={L('Nhận dự án', 'Start a project')}
                desc={L(
                  'Dịch vụ, mô hình hợp tác, những gì bạn nhận khi bàn giao — và phiếu gửi yêu cầu dự án.',
                  'Services, engagement models, what you receive at handover — and the project request form.',
                )}
                cta={L('Gửi yêu cầu', 'Send a request')}
              />
            </div>
          </section>
        </div>
      </CinemaProvider>
    </StudioShell>
  );
}

/** Một chương của Feature Stack: chữ dính bên trái, các cảnh bên phải. */
function Chapter({
  id,
  title,
  lead,
  extra,
  children,
}: {
  id: string;
  title: string;
  lead: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={s.chapter} aria-labelledby={id}>
      <div className={s.chapterGrid}>
        <div className={s.pane}>
          <div className={s.paneInner}>
            <h2 id={id} className={s.heading}>
              {title}
            </h2>
            <p className={s.body}>{lead}</p>
            {extra}
          </div>
        </div>
        <div className={s.scenes}>{children}</div>
      </div>
    </section>
  );
}

/** Sổ số liệu: dòng đầu còn số in lớn, các dòng sau kẻ chấm dẫn. Ẩn dòng không đếm được. */
function Figures({ title, note, rows, f }: { title: string; note: string; rows: Row[]; f: (v: number | null | undefined) => string }) {
  const shown = rows.filter(([, v]) => typeof v === 'number');
  const [head, ...rest] = shown;
  return (
    <>
      <header className={s.masthead}>
        <h3 className={s.heading}>{title}</h3>
        <p className={s.data}>{note}</p>
      </header>
      {head && (
        <p className={s.leadFigure}>
          <span className={s.leadNumber}>{f(head[1])}</span>
          <span className={s.muted}>{head[0]}</span>
        </p>
      )}
      {rest.length > 0 && (
        <dl className={s.ledger}>
          {rest.map(([k, v]) => (
            <div key={k} className={s.ledgerRow}>
              <dt>{k}</dt>
              <span aria-hidden className={s.leader} />
              <dd>{f(v)}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}

function ProductScene({ pr, p, L }: { pr: Product; p: (b: Bi) => string; L: (vi: string, en: string) => string }) {
  return (
    <>
      <header className={s.productHead}>
        <h3 className={s.heading}>{pr.name}</h3>
        <p className={s.muted}>{p(pr.kind)}</p>
      </header>
      <p className={s.body}>{p(pr.what)}</p>
      <Chart chart={pr.chart} p={p} />
      <dl className={s.facts}>
        <div>
          <dt>{L('Công nghệ', 'Stack')}</dt>
          <dd className={s.stackList}>{pr.stack.join(' · ')}</dd>
        </div>
        <div>
          <dt>{L('Trạng thái', 'Status')}</dt>
          <dd>
            <span className={s.status}>{p(pr.status)}</span>
          </dd>
        </div>
      </dl>
      {((pr.href && pr.linkLabel) || caseHref(pr.id)) && (
        <div className={s.actions}>
          {pr.href && pr.linkLabel && (
            <Link href={pr.href} className={s.link}>
              {p(pr.linkLabel)}
              <ArrowRight aria-hidden className="w-4 h-4" />
            </Link>
          )}
          {caseHref(pr.id) && (
            <Link href={caseHref(pr.id)!} className={s.link}>
              {L('Xem case study', 'Read the case study')}
              <ArrowRight aria-hidden className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function Node({ node, p, hub = false }: { node: ChartNode; p: (b: Bi) => string; hub?: boolean }) {
  return (
    <span className={hub ? `${s.node} ${s.nodeHub}` : s.node}>
      <span className={s.nodeLabel}>{p(node.label)}</span>
      {node.note && <span className={s.caption}>{p(node.note)}</span>}
    </span>
  );
}

/** Sơ đồ chữ thuần CSS — đường kẻ, không khung, không giả giao diện. */
function Chart({ chart, p }: { chart: Product['chart']; p: (b: Bi) => string }) {
  return (
    <div className={s.chart} role="img" aria-label={p(chart.caption)}>
      {chart.kind === 'fan' ? (
        <div className={s.fan} aria-hidden>
          <ul className={s.fanFrom}>
            {chart.from.map((nd) => (
              <li key={nd.label[0]}>
                <Node node={nd} p={p} />
              </li>
            ))}
          </ul>
          <span className={s.fanJoin} />
          <ul className={s.fanTo}>
            {(chart.to ?? []).map((nd) => (
              <li key={nd.label[0]}>
                <Node node={nd} p={p} hub />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div aria-hidden>
          <ol className={s.chain}>
            {chart.from.map((nd, i) => (
              <li key={nd.label[0]}>
                <Node node={nd} p={p} />
                {i < chart.from.length - 1 && <span className={s.chainArrow}>→</span>}
              </li>
            ))}
          </ol>
          {chart.to && chart.to.length > 0 && (
            <div className={s.chainEnd}>
              {chart.to.map((nd) => (
                <Node key={nd.label[0]} node={nd} p={p} hub />
              ))}
            </div>
          )}
        </div>
      )}
      <p className={s.caption}>{p(chart.caption)}</p>
    </div>
  );
}

function Spec({ rows, p }: { rows: typeof CAPABILITIES; p: (b: Bi) => string }) {
  return (
    <ul className={s.spec}>
      {rows.map((c) => (
        <li key={c.area[0]} className={s.specRow}>
          <h3 className={s.specArea}>{p(c.area)}</h3>
          <p className={s.specItems}>{c.items.join(', ')}</p>
          <p className={s.muted}>{p(c.note)}</p>
        </li>
      ))}
    </ul>
  );
}

'use client';

/**
 * /about/quy-trinh — BƯỚC 3/3 của luồng "Studio doanh nghiệp": Quy trình.
 *
 * Bố cục (bản 2, phương án A):
 *   vòng 3D (ProcessRing) → đường thời gian 7 pha (PhaseTimeline) →
 *   khung chuẩn tham chiếu → việc xuyên suốt → lối sang trang tổ chức → CTA.
 * Mỗi giai đoạn có trang tài liệu riêng: /about/quy-trinh/<slug>.
 *
 * ⛔ Cùng luật với /about: KHÔNG số liệu bịa. Mọi con số ĐẾM từ `data.ts` /
 * `departments.ts`. Chuẩn tham chiếu chỉ hiện nếu có giai đoạn thật sự dẫn nó.
 * Nhẹ: CSS 3D + framer-motion, không thư viện 3D.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  NextStep,
  Section,
  SectionHeader,
  StudioShell,
  T,
  useStudioLang,
} from '@/components/studio/StudioUI';
import { CROSS_CUTTING, LOOP, PHASES, STAGES, pick } from './data';
import { DEPARTMENTS } from './departments';
import ProcessRing from './ProcessRing';
import PhaseExplorer from './PhaseExplorer';
import PhaseTimeline from './PhaseTimeline';
import s from '@/components/studio/showroom.module.css';
import ScrollReveal from '@/components/studio/ScrollReveal';

type Bi = readonly [string, string];

/**
 * Các khung chuẩn "xương sống". Chỉ hiện khung nào có ít nhất MỘT giai đoạn
 * trong data.ts dẫn tới (khớp theo chuỗi con trong tên chuẩn) — trang không
 * được nhắc một chuẩn mà quy trình không thật sự dùng.
 */
const SPINE: { match: string; name: string; use: Bi }[] = [
  { match: '12207', name: 'ISO/IEC/IEEE 12207:2017', use: ['Khung vòng đời phần mềm: các nhóm quy trình từ thoả thuận tới ngừng hệ thống.', 'Software life-cycle framework: process groups from agreement to retirement.'] },
  { match: 'PMBOK', name: 'PMI — PMBOK® Guide', use: ['Quản lý dự án: bên liên quan, kế hoạch, ước lượng, đóng dự án.', 'Project management: stakeholders, planning, estimation, closure.'] },
  { match: 'Scrum Guide', name: 'The Scrum Guide (2020)', use: ['Nhịp sprint, vai trò và sự kiện khi phát triển lặp.', 'Sprint cadence, roles and events during iterative delivery.'] },
  { match: '25010', name: 'ISO/IEC 25010:2023', use: ['Mô hình chất lượng sản phẩm: cách viết yêu cầu phi chức năng đo được.', 'Product quality model: writing measurable non-functional requirements.'] },
  { match: 'ISTQB', name: 'ISTQB® CTFL v4.0', use: ['Thuật ngữ và quy trình kiểm thử.', 'Testing vocabulary and process.'] },
  { match: 'OWASP ASVS', name: 'OWASP ASVS', use: ['Danh mục kiểm tra bảo mật ứng dụng trước phát hành.', 'Application security verification before release.'] },
  { match: 'Semantic Versioning', name: 'Semantic Versioning 2.0.0', use: ['Đánh số phiên bản và ghi chú phát hành.', 'Version numbering and release notes.'] },
  { match: 'ITIL', name: 'ITIL® 4', use: ['Phát hành, triển khai và xử lý sự cố khi vận hành.', 'Release, deployment and incident management in operations.'] },
  { match: 'CMMI', name: 'CMMI (ISACA)', use: ['Chỉ ở mức khái niệm — để tự đánh giá độ trưởng thành của quy trình, không phải chứng nhận.', 'Conceptual only — to self-assess process maturity, not a certification.'] },
  { match: '91/2025/QH15', name: 'Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 + Nghị định 356/2025/NĐ-CP', use: ['Bảo vệ dữ liệu cá nhân: đồng ý, thông báo, quyền của chủ thể dữ liệu, xoá dữ liệu.', 'Personal data protection: consent, notice, data-subject rights, deletion.'] },
];

export default function ProcessPage() {
  const { lang, L } = useStudioLang();
  const reduced = !!useReducedMotion();
  const [selected, setSelected] = useState(0);

  // Con số ĐẾM từ dữ liệu, không gõ tay.
  const counts = useMemo(() => {
    const tpl = new Set<string>();
    let deliverables = 0;
    for (const s of STAGES) {
      deliverables += s.deliverables.length;
      (s.templates ?? []).forEach((t) => t.href && tpl.add(t.href));
    }
    return { stages: STAGES.length, phases: PHASES.length, deliverables, templates: tpl.size, depts: DEPARTMENTS.filter((d) => !d.external).length };
  }, []);

  // Chuẩn tham chiếu: gom từ dữ liệu, kèm giai đoạn nào dùng.
  const standards = useMemo(() => {
    const all = new Map<string, number[]>();
    for (const s of STAGES) for (const x of s.standards) all.set(x.name, [...(all.get(x.name) ?? []), s.n]);
    const spine = SPINE.map((sp) => {
      const used = new Set<number>();
      for (const [name, ns] of all) if (name.includes(sp.match)) ns.forEach((n) => used.add(n));
      return { ...sp, stages: [...used].sort((a, b) => a - b) };
    }).filter((sp) => sp.stages.length > 0);
    const rest = [...all].sort((a, b) => a[0].localeCompare(b[0]));
    return { spine, all: rest };
  }, []);

  const loopFrom = STAGES[LOOP.from];
  const loopTo = STAGES[LOOP.to];

  return (
    <StudioShell step={3} className={s.page}>
      <ScrollReveal />
      {/* ── Mở đầu + vòng 3D ───────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <div>
            <div className="min-w-0">
              <p className={T.label}>{L('Quy trình', 'Process')}</p>
              <h1 className={s.heroTitle}>
                {L('Rõ từng bước. Rõ phần bàn giao.', 'Clear steps. Tangible handovers.')}
              </h1>
            </div>
            <p className={s.heroLead}>
              {L(
                `Từ buổi trao đổi đầu tiên đến khi sản phẩm vận hành. Khám phá ${counts.phases} pha để biết ai phụ trách, bạn nhận được gì và khi nào công việc sẵn sàng đi tiếp.`,
                `From the first conversation to a running product. Explore ${counts.phases} phases to see who owns the work, what you receive and when it is ready to move forward.`,
              )}
            </p>
          </div>
        </div>
        <div data-scroll-reveal className="max-w-[1120px] mx-auto mt-12">
          <PhaseExplorer lang={lang} />
          <details className={`mt-8 ${s.disclosure}`}>
            <summary className="cursor-pointer min-h-11 py-3 font-medium">{L(`Khám phá ${counts.stages} giai đoạn trong không gian 3D`, `Explore ${counts.stages} stages in 3D`)}</summary>
            <ProcessRing stages={STAGES} selected={selected} onSelect={setSelected} lang={lang} reduced={reduced} />
          </details>

        </div>
      </section>

      {/* ── Đường thời gian theo pha ──────────────────────────────────── */}
      <section id="trinh-tu" className="scroll-mt-28 max-w-6xl mx-auto px-4">
        <details className={s.disclosure}>
        <summary>{L('Xem toàn bộ trình tự và vòng cải tiến', 'View the full sequence and improvement loop')}</summary>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            label={L('Trình tự', 'Sequence')}
            title={L(`${counts.phases} pha, đi theo thứ tự`, `${counts.phases} phases, in order`)}
            lead={
              loopFrom && loopTo
                ? L(
                    `Giai đoạn ${loopFrom.n} (${pick(loopFrom.title, 'vi')}) vòng lại giai đoạn ${loopTo.n} (${pick(loopTo.title, 'vi')}): mỗi đợt cải tiến lớn đi lại từ đề xuất, có phạm vi và cổng chất lượng riêng.`,
                    `Stage ${loopFrom.n} (${pick(loopFrom.title, 'en')}) loops back to stage ${loopTo.n} (${pick(loopTo.title, 'en')}): every major improvement starts again from a proposal, with its own scope and quality gates.`,
                  )
                : undefined
            }
          />
        </div>
        <PhaseTimeline stages={STAGES} lang={lang} reduced={reduced} />
        </details>
      </section>

      {/* ── Khung chuẩn tham chiếu ────────────────────────────────────── */}
      <Section band className="mt-16">
        <SectionHeader
          label={L('Chuẩn tham chiếu', 'Reference frameworks')}
          title={L('Làm theo chuẩn có thật, ghi đúng mã hiệu', 'Real standards, cited by their exact designation')}
          lead={L(
            `Quy trình dẫn ${standards.all.length} tài liệu chuẩn, luật và thực hành. Đây là tham chiếu để làm đúng — studio không tuyên bố đã được chứng nhận theo chuẩn nào.`,
            `The process cites ${standards.all.length} standards, laws and practices. They are references for doing the work right — the studio claims no certification against any of them.`,
          )}
        />
        <div className={`${T.card} overflow-hidden`}>
          <table className="block sm:table w-full text-left text-sm">
            <thead className="hidden sm:table-header-group bg-[var(--s-band)] text-[color:var(--s-muted)]">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium w-[30%]">{L('Khung', 'Framework')}</th>
                <th scope="col" className="px-5 py-3 font-medium">{L('Dùng để', 'Used for')}</th>
                <th scope="col" className="px-5 py-3 font-medium w-[22%]">{L('Giai đoạn', 'Stages')}</th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {standards.spine.map((sp) => (
                <tr key={sp.name} className="border-t border-[color:var(--s-line)] first:border-t-0 sm:first:border-t block sm:table-row px-5 py-4 sm:p-0 space-y-1.5 sm:space-y-0">
                  <th scope="row" className="block sm:table-cell sm:px-5 sm:py-4 font-semibold text-[color:var(--s-ink)] align-top">{sp.name}</th>
                  <td className="block sm:table-cell sm:px-5 sm:py-4 text-[color:var(--s-body)] align-top">{pick(sp.use, lang)}</td>
                  <td className="block sm:table-cell sm:px-5 sm:py-4 align-top">
                    <span className="flex flex-wrap gap-1.5">
                      {sp.stages.map((n) => (
                        <Link
                          key={n}
                          href={`/about/quy-trinh/${STAGES[n].slug}`}
                          title={pick(STAGES[n].title, lang)}
                          className="px-1.5 py-0.5 rounded border border-[color:var(--s-line-strong)] text-[0.75rem] tabular-nums text-[color:var(--s-ink)] hover:border-[color:var(--s-ink)]"
                        >
                          {String(n).padStart(2, '0')}
                        </Link>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="mt-6 group">
          <summary className="cursor-pointer text-sm font-semibold text-[color:var(--s-ink)] inline-flex items-center gap-2 list-none [&::-webkit-details-marker]:hidden">
            <span className="text-[color:var(--s-accent)] transition-transform group-open:rotate-90">›</span>
            {L(`Toàn bộ ${standards.all.length} tài liệu tham chiếu`, `All ${standards.all.length} references`)}
          </summary>
          <ul className="mt-4 columns-1 sm:columns-2 lg:columns-3 gap-8 text-[0.85rem]">
            {standards.all.map(([name, ns]) => (
              <li key={name} className="break-inside-avoid py-1.5 border-b border-[color:var(--s-line)] flex justify-between gap-3">
                <span className="text-[color:var(--s-ink)] min-w-0">{name}</span>
                <span className="text-[color:var(--s-muted)] tabular-nums shrink-0">{ns.map((n) => String(n).padStart(2, '0')).join(', ')}</span>
              </li>
            ))}
          </ul>
        </details>
      </Section>

      {/* ── Xuyên suốt ────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          label={L('Xuyên suốt dự án', 'Across every stage')}
          title={L('Những việc không thuộc riêng giai đoạn nào', 'What runs through every stage')}
        />
        <div className="grid gap-px rounded-xl overflow-hidden border border-[color:var(--s-line)] bg-[var(--s-line)] sm:grid-cols-2 lg:grid-cols-3">
          {CROSS_CUTTING.map((c) => (
            <div key={c.id} className="bg-[var(--s-raise)] p-6 min-w-0">
              <h3 className={T.h3}>{pick(c.title, lang)}</h3>
              <p className={`${T.small} mt-1`}>{pick(c.body, lang)}</p>
              <ul className="mt-4 space-y-2">
                {c.points.map((p) => (
                  <li key={p[0]} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-[color:var(--s-body)]">
                    <span aria-hidden className="mt-[0.55rem] w-1 h-1 shrink-0 bg-[var(--s-accent)]" />
                    <span className="min-w-0">{pick(p, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Lối sang trang tổ chức ────────────────────────────────────── */}
      <Section band>
        <div className="grid gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center">
          <div className="min-w-0">
            <p className={T.label}>{L('Tổ chức', 'Organisation')}</p>
            <h2 className={`${T.h2} mt-3`}>{L(`${counts.depts} bộ phận và những gì họ chuyển cho nhau`, `${counts.depts} functions and what they hand each other`)}</h2>
            <p className={`${T.lead} mt-4 max-w-[60ch]`}>
              {L(
                'Sơ đồ luồng liên kết giữa các bộ phận — ai chuyển tài liệu gì cho ai — và ma trận RACI tổng theo từng giai đoạn. Ở dự án nhỏ một người kiêm nhiều vai, nhưng mỗi vai vẫn có đầu ra riêng.',
                'A map of hand-offs between functions — who passes what to whom — and the overall RACI matrix by stage. On small projects one person holds several roles, but each role still owns its outputs.',
              )}
            </p>
          </div>
          <div className="md:justify-self-end">
            <Link href="/about/quy-trinh/to-chuc" className={T.btnPrimary}>
              {L('Xem sơ đồ tổ chức & RACI', 'See the organisation & RACI')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      <NextStep
        href="/about/nhan-du-an#gui-yeu-cau"
        step={L('Bắt đầu từ giai đoạn 00', 'Start at stage 00')}
        title={L('Gửi yêu cầu dự án', 'Send a project request')}
        desc={L(
          'Phiếu yêu cầu là giai đoạn đầu tiên của quy trình này. Chưa cần tài liệu — mô tả vấn đề là đủ.',
          'The request form is the first stage of this process. No documents needed — describing the problem is enough.',
        )}
        cta={L('Mở phiếu yêu cầu', 'Open the request form')}
      />
    </StudioShell>
  );
}

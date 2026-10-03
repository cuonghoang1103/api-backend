'use client';

/**
 * /about/nhan-du-an — BƯỚC 2/3 của luồng "Studio doanh nghiệp": Nhận dự án.
 *
 * Dịch vụ · mô hình hợp tác (KHÔNG ghi giá — lấy từ `ENGAGEMENTS` trong
 * quy-trinh/data.ts) · những gì khách nhận khi bàn giao · câu hỏi thường gặp ·
 * phiếu "Gửi yêu cầu dự án" + thông báo xử lý dữ liệu theo Luật BVDLCN 91/2025/QH15 + Nghị định 356/2025/NĐ-CP.
 *
 * ⛔ Không số liệu bịa, không lời khen, không cam kết thời gian phản hồi chưa
 * được chủ site duyệt.
 */
import Link from 'next/link';
import {
  Bullets,
  NextStep,
  Section,
  SectionHeader,
  StudioShell,
  T,
  useStudioLang,
} from '@/components/studio/StudioUI';
// Chỉ import KIỂU từ data.ts (bị xoá lúc biên dịch) — không kéo dữ liệu vào gói client.
import type { Engagement } from '../quy-trinh/data';
import RequestForm from './RequestForm';
import PrivacyNotice from './PrivacyNotice';
import s from '@/components/studio/showroom.module.css';
import ScrollReveal from '@/components/studio/ScrollReveal';

type Bi = readonly [string, string];

const SERVICES: { id: string; title: Bi; body: Bi; includes: Bi[] }[] = [
  {
    id: 'web',
    title: ['Hệ thống web', 'Web systems'],
    body: [
      'Cổng thông tin, hệ thống quản lý chạy trên trình duyệt, trang dịch vụ có đăng nhập và thanh toán.',
      'Portals, browser-based management systems, service sites with sign-in and payments.',
    ],
    includes: [
      ['Giao diện responsive, sáng/tối, đạt chuẩn truy cập WCAG 2.2 AA', 'Responsive UI, light/dark, WCAG 2.2 AA accessibility'],
      ['API, cơ sở dữ liệu, phân quyền theo vai trò', 'API, database, role-based access'],
      ['SEO kỹ thuật và tốc độ tải là yêu cầu bắt buộc', 'Technical SEO and load speed as hard requirements'],
    ],
  },
  {
    id: 'app',
    title: ['Ứng dụng di động', 'Mobile apps'],
    body: [
      'Ứng dụng iOS dùng chung API với hệ thống web; phát hành thử qua TestFlight trước khi lên kho.',
      'iOS apps sharing one API with the web system; beta via TestFlight before store release.',
    ],
    includes: [
      ['Thiết kế theo hướng dẫn của nền tảng, xử lý khi mất mạng', 'Platform-guideline design, offline handling'],
      ['Chính sách quyền riêng tư và hồ sơ đăng kho', 'Privacy policy and store listing'],
      ['Kiểm thử trên thiết bị thật', 'Testing on real devices'],
    ],
  },
  {
    id: 'tool',
    title: ['Công cụ nội bộ & tự động hoá', 'Internal tools & automation'],
    body: [
      'Thay bảng tính và thao tác tay bằng một hệ thống khớp đúng quy trình làm việc thật của doanh nghiệp.',
      'Replace spreadsheets and manual steps with a system that fits how the business really works.',
    ],
    includes: [
      ['Khảo sát nghiệp vụ, vẽ quy trình hiện trạng và mong muốn', 'Business analysis, as-is and to-be process maps'],
      ['Nhập/xuất Excel, báo cáo, nhật ký thao tác', 'Excel import/export, reports, audit logs'],
      ['Chuyển dữ liệu cũ và đào tạo người dùng', 'Legacy data migration and user training'],
    ],
  },
  {
    id: 'ai',
    title: ['Tích hợp AI', 'AI integration'],
    body: [
      'Trợ lý trả lời trên tài liệu nội bộ, phân loại và trích xuất văn bản, tự động hoá việc lặp lại bằng mô hình ngôn ngữ.',
      'Assistants answering from internal documents, text classification and extraction, LLM-driven automation.',
    ],
    includes: [
      ['Bộ đánh giá bằng câu hỏi thật trước khi chọn model', 'An evaluation set of real questions before picking a model'],
      ['Trần chi phí theo ngày và theo người dùng', 'Daily and per-user cost ceilings'],
      ['Chống prompt injection, lọc dữ liệu cá nhân', 'Prompt-injection defence, personal-data filtering'],
    ],
  },
];

const RECEIVE: { group: Bi; items: Bi[] }[] = [
  {
    group: ['Tài liệu', 'Documents'],
    items: [
      ['Đặc tả yêu cầu (SRS) và tiêu chí nghiệm thu', 'Requirements specification (SRS) and acceptance criteria'],
      ['Tài liệu thiết kế: kiến trúc, dữ liệu, API', 'Design documents: architecture, data, API'],
      ['Kế hoạch và báo cáo kiểm thử', 'Test plan and test report'],
      ['Hướng dẫn sử dụng và tài liệu vận hành (runbook)', 'User guide and operations runbook'],
    ],
  },
  {
    group: ['Mã nguồn & quyền sở hữu', 'Code & ownership'],
    items: [
      ['Toàn bộ mã nguồn trong kho Git đứng tên bạn, kèm lịch sử commit', 'All source code in a Git repository you own, with full history'],
      ['Tên miền, tài khoản đám mây và dịch vụ bên thứ ba đứng tên bạn', 'Domains, cloud accounts and third-party services in your name'],
      ['Danh sách thư viện bên thứ ba và giấy phép của chúng', 'A list of third-party libraries and their licences'],
    ],
  },
  {
    group: ['Bàn giao', 'Handover'],
    items: [
      ['Nghiệm thu (UAT) theo kịch bản đã thống nhất, có biên bản', 'User acceptance testing against agreed scenarios, with sign-off'],
      ['Buổi đào tạo cho người dùng và người quản trị', 'Training for users and administrators'],
      ['Biên bản bàn giao quyền truy cập và tài sản', 'Handover record of access rights and assets'],
    ],
  },
  {
    group: ['Sau bàn giao', 'After handover'],
    items: [
      ['Bảo hành lỗi theo thời hạn ghi trong hợp đồng', 'Defect warranty for the period set in the contract'],
      ['Gói bảo trì tuỳ chọn với thoả thuận mức dịch vụ (SLA)', 'Optional maintenance with a service-level agreement (SLA)'],
    ],
  },
];

const FAQ: { q: Bi; a: Bi }[] = [
  {
    q: ['Chi phí một dự án là bao nhiêu?', 'How much does a project cost?'],
    a: [
      'Chi phí được báo trong đề xuất, sau buổi họp khám phá — khi phạm vi đã đủ rõ để ước lượng có cơ sở. Trang này không niêm yết giá vì hai dự án cùng “loại” có thể khác nhau nhiều lần về khối lượng.',
      'Cost is quoted in the proposal after the discovery call — once the scope is clear enough to estimate responsibly. No prices are listed because two projects of the same “type” can differ several times over in effort.',
    ],
  },
  {
    q: ['Có ký thoả thuận bảo mật (NDA) trước khi trao đổi chi tiết không?', 'Can we sign an NDA before sharing details?'],
    a: [
      'Có. Bạn gửi mẫu NDA của doanh nghiệp để hai bên ký trước buổi trao đổi chi tiết. Trong phiếu yêu cầu, chỉ cần mô tả vấn đề ở mức chung.',
      'Yes. Send your company’s NDA and both sides sign it before the detailed discussion. In the request form, a general description of the problem is enough.',
    ],
  },
  {
    q: ['Mã nguồn thuộc về ai?', 'Who owns the source code?'],
    a: [
      'Thuộc về bạn sau khi thanh toán đủ theo hợp đồng, ghi rõ trong điều khoản sở hữu trí tuệ. Thư viện mã nguồn mở bên thứ ba giữ nguyên giấy phép gốc và được liệt kê đầy đủ.',
      'It’s yours once the contract is paid in full, as set out in the IP clause. Third-party open-source libraries keep their original licences and are listed in full.',
    ],
  },
  {
    q: ['Ai trực tiếp làm dự án?', 'Who actually does the work?'],
    a: [
      'Cường là kỹ sư chính và chịu trách nhiệm toàn bộ. Nếu dự án cần thêm người cho một vai cụ thể, đề xuất sẽ nêu tên, vai và phạm vi của từng người trước khi ký.',
      'Cường is the lead engineer and accountable for everything. If a project needs more people for a specific role, the proposal names each person, role and scope before signing.',
    ],
  },
  {
    q: ['Có làm việc với hệ thống chúng tôi đang dùng không?', 'Can you work with our existing systems?'],
    a: [
      'Có. Việc tích hợp (ERP, kế toán, SSO, kho dữ liệu…) được khảo sát ở giai đoạn phân tích nghiệp vụ và ghi thành yêu cầu riêng, kèm rủi ro nếu có.',
      'Yes. Integrations (ERP, accounting, SSO, data stores…) are analysed during business analysis and written up as separate requirements, with any risks.',
    ],
  },
  {
    q: ['Dữ liệu của doanh nghiệp được bảo vệ thế nào trong dự án?', 'How is our data protected during the project?'],
    a: [
      'Dữ liệu thật chỉ dùng khi thật cần và theo thoả thuận; môi trường phát triển dùng dữ liệu giả lập. Hệ thống xử lý dữ liệu cá nhân được thiết kế theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, và kiểm tra bảo mật theo OWASP ASVS là một giai đoạn riêng của quy trình.',
      'Real data is used only when needed and as agreed; development uses synthetic data. Systems handling personal data are designed for the Law on Personal Data Protection No. 91/2025/QH15 and Decree 356/2025/ND-CP, and security verification against OWASP ASVS is a stage of its own in the process.',
    ],
  },
];

/** `stageCount` + `engagements` do page.tsx (server) lấy từ data.ts — để data.ts (~200 KB) không vào gói JS của trang này. */
export default function IntakeClient({ stageCount, engagements }: { stageCount: number; engagements: Engagement[] }) {
  const { lang, L } = useStudioLang();
  const p = (b: Bi) => (lang === 'en' ? b[1] : b[0]);
  const pk = (b: Bi, l: 'vi' | 'en') => (l === 'en' ? b[1] : b[0]);

  return (
    <StudioShell step={2} className={s.page}>
      <ScrollReveal />
      {/* ── Mở đầu ─────────────────────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <div className="min-w-0">
            <p className={T.label}>{L('Nhận dự án', 'Start a project')}</p>
            <h1 className={s.heroTitle}>
              {L('Ý tưởng của bạn. Sản phẩm tiếp theo.', 'Your idea. The next product.')}
            </h1>
            <p className={s.heroLead}>
              {L(
                'Chưa cần tài liệu hay giải pháp. Phiếu yêu cầu giúp studio đánh giá mức độ phù hợp trước buổi trao đổi đầu tiên — và nói thẳng nếu dự án không hợp.',
                'No documents or solution needed yet. The request lets the studio assess fit before the first conversation — and say so plainly if it isn’t a match.',
              )}
            </p>
            <div className={s.actions}>
              <a href="#gui-yeu-cau" className={T.btnPrimary}>
                {L('Điền phiếu yêu cầu', 'Fill in the request')}
              </a>
              <a href="#dich-vu" className={T.btnGhost}>
                {L('Xem dịch vụ', 'See services')}
              </a>
            </div>
          </div>
          <ol className={s.steps} aria-label={L('Sau khi gửi phiếu', 'After you send a request')}>
            {[
              [L('Gửi phiếu', 'Send the request'), L('Nhận mã phiếu ngay trên màn hình.', 'Get a request code on screen.')],
              [L('Đánh giá phù hợp', 'Fit assessment'), L('Trả lời “đi tiếp” hoặc “không”, kèm lý do.', 'A “go” or “no”, with reasons.')],
              [L('Họp khám phá', 'Discovery call'), L('30–45 phút về bối cảnh, người dùng, mục tiêu.', '30–45 minutes on context, users, goals.')],
              [L('Đề xuất', 'Proposal'), L('Phạm vi, kế hoạch theo mốc, rủi ro, chi phí.', 'Scope, milestones, risks, cost.')],
            ].map(([t, d], i) => (
              <li key={t}>
                <span aria-hidden className={s.stepNumber}>0{i + 1}</span>
                <p className={s.stepTitle}>
                  {t}
                </p>
                <p className={T.small}>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Dịch vụ ───────────────────────────────────────────────────── */}
      <Section id="dich-vu" band>
        <SectionHeader
          label={L('Dịch vụ', 'Services')}
          title={L('Bốn loại sản phẩm, một quy trình', 'Four kinds of product, one process')}
          lead={L(
            `Mọi loại sản phẩm đi qua cùng ${stageCount} giai đoạn của quy trình; khác nhau ở giai đoạn nào được nhấn mạnh.`,
            `Every kind of product goes through the same ${stageCount} stages; what differs is which stages carry more weight.`,
          )}
        />
        <div className={s.services}>
          {SERVICES.map((sv) => (
            <article key={sv.id} className={s.service}>
              <h3>{p(sv.title)}</h3>
              <p className={`${T.body} mt-3`}>{p(sv.body)}</p>
              <Bullets className="mt-5" items={sv.includes.map(p)} />
            </article>
          ))}
        </div>
      </Section>

      {/* ── Mô hình hợp tác ──────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          label={L('Mô hình hợp tác', 'Engagement models')}
          title={L('Chọn cách làm việc hợp với dự án', 'Choose the way of working that fits')}
          lead={L(
            'Chi phí được báo riêng trong đề xuất, sau khảo sát. Trang này không niêm yết giá.',
            'Pricing is quoted in the proposal after discovery. No prices are listed here.',
          )}
        />
        <div className="hidden md:block">
          <table className="w-full text-left border-t border-[color:var(--s-ink)]">
            <thead>
              <tr className="text-sm text-[color:var(--s-muted)]">
                <th scope="col" className="py-3 pr-6 font-medium w-[26%]">{L('Mô hình', 'Model')}</th>
                <th scope="col" className="py-3 pr-6 font-medium">{L('Cách tính', 'How it works')}</th>
                <th scope="col" className="py-3 pr-6 font-medium">{L('Hợp khi', 'Fits when')}</th>
                <th scope="col" className="py-3 font-medium">{L('Đánh đổi', 'Trade-off')}</th>
              </tr>
            </thead>
            <tbody>
              {engagements.map((e) => (
                <tr key={e.id} className="border-t border-[color:var(--s-line)] align-top">
                  <th scope="row" className="py-5 pr-6 font-heading text-[1.2rem] font-semibold text-[color:var(--s-ink)]">{pk(e.title, lang)}</th>
                  <td className={`py-5 pr-6 ${T.body}`}>{pk(e.body, lang)}</td>
                  <td className={`py-5 pr-6 ${T.body}`}>{pk(e.fits, lang)}</td>
                  <td className={`py-5 ${T.body}`}>{pk(e.tradeoff, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4">
          {engagements.map((e) => (
            <div key={e.id} className={`${T.card} p-5`}>
              <h3 className="font-heading font-semibold text-[1.25rem] text-[color:var(--s-ink)]">{pk(e.title, lang)}</h3>
              <p className={`${T.body} mt-2`}>{pk(e.body, lang)}</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="font-semibold text-[color:var(--s-ink)]">{L('Hợp khi', 'Fits when')}</dt>
                  <dd className="text-[color:var(--s-body)]">{pk(e.fits, lang)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[color:var(--s-ink)]">{L('Đánh đổi', 'Trade-off')}</dt>
                  <dd className="text-[color:var(--s-body)]">{pk(e.tradeoff, lang)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Bạn nhận được gì ─────────────────────────────────────────── */}
      <Section band>
        <SectionHeader
          label={L('Bàn giao', 'Deliverables')}
          title={L('Những gì bạn nhận được', 'What you receive')}
          lead={
            <>
              {L(
                'Mỗi tài liệu dưới đây gắn với một giai đoạn cụ thể và có mẫu xem trước trên trang của giai đoạn đó. ',
                'Each document below belongs to a specific stage and has a template you can preview on that stage’s page. ',
              )}
              <Link href="/about/quy-trinh" className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4">
                {L('Xem theo quy trình', 'Browse by stage')}
              </Link>
            </>
          }
        />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {RECEIVE.map((g) => (
            <div key={g.group[0]} className="min-w-0 border-t-2 border-[color:var(--s-ink)] pt-5">
              <h3 className={T.h3}>{p(g.group)}</h3>
              <ul className="mt-4 space-y-3">
                {g.items.map((it) => (
                  <li key={it[0]} className="text-[0.9rem] leading-relaxed text-[color:var(--s-body)]">
                    {p(it)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Câu hỏi thường gặp ───────────────────────────────────────── */}
      <Section>
        <SectionHeader label={L('Hỏi đáp', 'FAQ')} title={L('Câu hỏi thường gặp', 'Common questions')} />
        <div className="border-t border-[color:var(--s-line)]">
          {FAQ.map((f) => (
            <details key={f.q[0]} className="group border-b border-[color:var(--s-line)]">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-heading text-[1.02rem] font-semibold text-[color:var(--s-ink)] min-w-0">{p(f.q)}</span>
                <span aria-hidden className="mt-1 shrink-0 text-[color:var(--s-accent)] text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className={`${T.body} pb-6 max-w-[70ch]`}>{p(f.a)}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* ── Phiếu yêu cầu ────────────────────────────────────────────── */}
      <Section id="gui-yeu-cau" band>
        <SectionHeader
          label={L('Phiếu yêu cầu', 'Request form')}
          title={L('Gửi yêu cầu dự án', 'Send a project request')}
          lead={L(
            'Khoảng 5–10 phút. Bạn nhận mã phiếu ngay khi gửi; dùng mã này khi trao đổi hoặc khi muốn xem, sửa, xoá dữ liệu đã gửi.',
            'About 5–10 minutes. You get a request code as soon as you send; use it in later conversations or to view, correct or delete what you sent.',
          )}
        />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-12 items-start">
          <div className={`${T.card} p-5 sm:p-8 min-w-0`}>
            <RequestForm lang={lang} />
          </div>
          <aside className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto rounded-xl border border-[color:var(--s-line)] bg-[var(--s-raise)] p-5 sm:p-6">
            <PrivacyNotice lang={lang} />
          </aside>
        </div>
      </Section>

      <NextStep
        href="/about/quy-trinh"
        step={L('Bước 3 / 3', 'Step 3 of 3')}
        title={L('Quy trình làm dự án', 'The delivery process')}
        desc={L(
          `${stageCount} giai đoạn từ tiếp nhận tới vận hành: bộ phận tham gia, ma trận trách nhiệm, cổng chất lượng và mẫu tài liệu của từng giai đoạn.`,
          `${stageCount} stages from intake to operations: who takes part, the responsibility matrix, quality gates and document templates for each stage.`,
        )}
        cta={L('Sang bước 3', 'Go to step 3')}
      />
    </StudioShell>
  );
}

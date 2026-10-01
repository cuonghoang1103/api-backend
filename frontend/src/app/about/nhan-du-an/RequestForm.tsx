'use client';

/**
 * Phiếu "Gửi yêu cầu dự án" — gửi tới POST /api/v1/project-requests qua
 * `projectRequestApi.submit()` (frontend/src/lib/api.ts).
 *
 * Luật backend (src/routes/projectRequest.routes.ts, zod) được kiểm lại ở đây
 * để người gửi thấy lỗi ngay tại ô, nhưng backend vẫn là nơi quyết:
 *   · name ≥ 2 · email hợp lệ · productTypes ≥ 1 · needs ≥ 20 ký tự
 *   · consent === true (Luật BVDLCN 91/2025/QH15 + NĐ 356/2025) · `website` = ô bẫy bot, luôn để trống
 *   · 5 phiếu/giờ/IP ⇒ 429
 * Lỗi 400 trả `message` dạng "<trường>: <lý do>" ⇒ gắn vào đúng ô.
 */
import Link from 'next/link';
import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import {
  projectRequestApi,
  type ProjectRequestProductType,
  type ProjectRequestSecurityLevel,
  type ProjectRequestSubmit,
} from '@/lib/api';
import { STUDIO_EMAIL, T } from '@/components/studio/StudioUI';
import { CONSENT_VERSION } from './PrivacyNotice';

type Lang = 'vi' | 'en';
type Bi = readonly [string, string];

const PRODUCT_OPTIONS: { v: ProjectRequestProductType; label: Bi; hint: Bi }[] = [
  { v: 'WEB', label: ['Web', 'Web'], hint: ['Trang web, cổng thông tin, hệ thống web', 'Websites, portals, web systems'] },
  { v: 'APP', label: ['Ứng dụng di động', 'Mobile app'], hint: ['iOS, Android', 'iOS, Android'] },
  { v: 'TOOL', label: ['Công cụ nội bộ', 'Internal tool'], hint: ['Quản lý, báo cáo, tự động hoá', 'Admin, reporting, automation'] },
  { v: 'AI', label: ['Tích hợp AI', 'AI integration'], hint: ['Trợ lý, tìm kiếm tài liệu, xử lý văn bản', 'Assistants, document search, text processing'] },
  { v: 'OTHER', label: ['Khác', 'Other'], hint: ['Mô tả ở phần nhu cầu', 'Describe it below'] },
];

const BUDGETS: Bi[] = [
  ['Dưới 50 triệu đồng', 'Under 50 million VND'],
  ['50 – 200 triệu đồng', '50 – 200 million VND'],
  ['200 – 500 triệu đồng', '200 – 500 million VND'],
  ['500 triệu – 1 tỷ đồng', '500 million – 1 billion VND'],
  ['Trên 1 tỷ đồng', 'Over 1 billion VND'],
  ['Chưa xác định', 'Not decided yet'],
];

const DEADLINES: Bi[] = [
  ['Dưới 1 tháng', 'Under 1 month'],
  ['1 – 3 tháng', '1 – 3 months'],
  ['3 – 6 tháng', '3 – 6 months'],
  ['Trên 6 tháng', 'Over 6 months'],
  ['Linh hoạt', 'Flexible'],
];

const SECURITY: { v: ProjectRequestSecurityLevel; label: Bi; hint: Bi }[] = [
  {
    v: 'NORMAL',
    label: ['Thông thường', 'Standard'],
    hint: ['Không xử lý dữ liệu cá nhân của người dùng cuối, hoặc chỉ ở mức tài khoản đăng nhập.', 'No end-user personal data, or login accounts only.'],
  },
  {
    v: 'PERSONAL_DATA',
    label: ['Có dữ liệu cá nhân', 'Personal data'],
    hint: ['Họ tên, số điện thoại, địa chỉ… của khách hàng hoặc nhân viên.', 'Names, phone numbers, addresses… of customers or staff.'],
  },
  {
    v: 'SENSITIVE',
    label: ['Dữ liệu nhạy cảm', 'Sensitive data'],
    hint: ['Sức khoẻ, tài chính, sinh trắc học, vị trí… (dữ liệu cá nhân nhạy cảm theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP).', 'Health, financial, biometric, location… (sensitive personal data under the Law on Personal Data Protection No. 91/2025/QH15 and Decree 356/2025/ND-CP).'],
  },
];

type Field =
  | 'name'
  | 'email'
  | 'phone'
  | 'organization'
  | 'senderRole'
  | 'productTypes'
  | 'needs'
  | 'businessGoals'
  | 'endUsers'
  | 'existingSystems'
  | 'consent';

interface FormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
  senderRole: string;
  productTypes: ProjectRequestProductType[];
  needs: string;
  businessGoals: string;
  endUsers: string;
  existingSystems: string;
  budgetRange: string;
  desiredDeadline: string;
  securityLevel: ProjectRequestSecurityLevel;
  securityNote: string;
  consent: boolean;
  website: string;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  senderRole: '',
  productTypes: [],
  needs: '',
  businessGoals: '',
  endUsers: '',
  existingSystems: '',
  budgetRange: '',
  desiredDeadline: '',
  securityLevel: 'NORMAL',
  securityNote: '',
  consent: false,
  website: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+().\s-]*$/;

export default function RequestForm({ lang }: { lang: Lang }) {
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  const p = (b: Bi) => (lang === 'en' ? b[1] : b[0]);
  const reduced = !!useReducedMotion();
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [f, setF] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState<string | null | undefined>(undefined); // undefined = chưa gửi
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggleType = (v: ProjectRequestProductType) => {
    set('productTypes', f.productTypes.includes(v) ? f.productTypes.filter((x) => x !== v) : [...f.productTypes, v]);
  };

  const validate = (): Partial<Record<Field, string>> => {
    const e: Partial<Record<Field, string>> = {};
    if (f.name.trim().length < 2) e.name = L('Nhập họ tên (ít nhất 2 ký tự).', 'Enter your name (at least 2 characters).');
    if (!EMAIL_RE.test(f.email.trim())) e.email = L('Email chưa đúng định dạng.', 'This email address isn’t valid.');
    if (f.phone && !PHONE_RE.test(f.phone)) e.phone = L('Số điện thoại chỉ gồm số và + ( ) . -', 'Phone may only contain digits and + ( ) . -');
    if (f.productTypes.length === 0) e.productTypes = L('Chọn ít nhất một loại sản phẩm.', 'Pick at least one product type.');
    if (f.needs.trim().length < 20) e.needs = L('Mô tả nhu cầu ít nhất 20 ký tự.', 'Describe your need in at least 20 characters.');
    if (!f.consent) e.consent = L('Cần đồng ý với thông báo xử lý dữ liệu để gửi phiếu.', 'You need to agree to the data notice to send the request.');
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError(null);
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    const opt = (s: string) => (s.trim() ? s.trim() : null);
    const body: ProjectRequestSubmit = {
      name: f.name.trim(),
      email: f.email.trim(),
      phone: opt(f.phone),
      organization: opt(f.organization),
      senderRole: opt(f.senderRole),
      productTypes: f.productTypes,
      needs: f.needs.trim(),
      businessGoals: opt(f.businessGoals),
      endUsers: opt(f.endUsers),
      existingSystems: opt(f.existingSystems),
      budgetRange: opt(f.budgetRange),
      desiredDeadline: opt(f.desiredDeadline),
      securityLevel: f.securityLevel,
      securityNote: f.securityLevel === 'NORMAL' ? null : opt(f.securityNote),
      consent: true,
      consentVersion: CONSENT_VERSION,
      source: 'about/nhan-du-an',
      website: f.website,
    };
    setSending(true);
    try {
      const res = await projectRequestApi.submit(body);
      setCode(res.data?.data?.code ?? null);
      setF(EMPTY);
      // Khối "đã nhận" chỉ có sau lần render tới ⇒ cuộn ở khung hình kế.
      setTimeout(() => document.getElementById(id('done'))?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }), 60);
    } catch (err) {
      const ax = err as { response?: { status?: number; data?: { message?: string } } };
      const status = ax.response?.status;
      const msg = ax.response?.data?.message;
      if (status === 429) {
        setFormError(
          msg ||
            L(
              'Bạn đã gửi quá nhiều phiếu trong một giờ. Hãy thử lại sau, hoặc gửi email trực tiếp.',
              'Too many requests from this network in the last hour. Try again later, or email us directly.',
            ),
        );
      } else if (status === 400 && msg) {
        // "needs: Mô tả nhu cầu ít nhất 20 ký tự" ⇒ gắn vào ô `needs`.
        const m = /^([a-zA-Z]+)(?:\.\d+)?:\s*(.+)$/.exec(msg);
        if (m) {
          setErrors((e2) => ({ ...e2, [m[1]]: m[2] }));
          setFormError(L('Phiếu chưa hợp lệ — xem ô được đánh dấu.', 'The form has an error — see the highlighted field.'));
          document.getElementById(id(m[1]))?.focus();
        } else {
          setFormError(msg);
        }
      } else if (!ax.response) {
        setFormError(L('Không kết nối được máy chủ. Kiểm tra mạng rồi gửi lại — nội dung bạn nhập vẫn còn.', 'Couldn’t reach the server. Check your connection and send again — your answers are still here.'));
      } else {
        setFormError(
          L(
            `Máy chủ đang gặp lỗi (mã ${status}). Nội dung bạn nhập vẫn còn — thử lại sau ít phút hoặc gửi email trực tiếp.`,
            `The server returned an error (code ${status}). Your answers are still here — try again in a few minutes or email us directly.`,
          ),
        );
      }
    } finally {
      setSending(false);
    }
  };

  // ── Đã gửi xong ───────────────────────────────────────────────────────────
  if (code !== undefined) {
    return (
      <motion.div
        id={id('done')}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`${T.card} p-6 sm:p-8`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-[color:var(--s-accent)] mt-1" />
          <div className="min-w-0">
            <h3 className="font-editorial text-[1.7rem] leading-tight text-[color:var(--s-ink)]">
              {L('Đã nhận yêu cầu của bạn', 'Your request has been received')}
            </h3>
            {code ? (
              <div className="mt-4">
                <p className={T.small}>{L('Mã phiếu — ghi lại để tra cứu khi trao đổi', 'Request code — keep it for reference')}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[1.5rem] font-semibold tracking-wide text-[color:var(--s-ink)] tabular-nums">{code}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(code);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1800);
                      } catch {
                        /* không có clipboard: mã vẫn hiện để chép tay */
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--s-line-strong)] px-2.5 py-1 text-xs font-semibold text-[color:var(--s-ink)]"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copied ? L('Đã chép', 'Copied') : L('Chép mã', 'Copy code')}
                  </button>
                </div>
              </div>
            ) : null}
            <p className={`${T.body} mt-4`}>
              {L(
                'Studio sẽ liên hệ lại qua email bạn đã để lại. Các bước tiếp theo:',
                'The studio will reply to the email you provided. What happens next:',
              )}
            </p>
            <ol className="mt-4 space-y-3">
              {[
                [L('Đánh giá phù hợp', 'Fit assessment'), L('Đọc phiếu, đối chiếu năng lực và thời hạn; trả lời “đi tiếp” hoặc “không” kèm lý do.', 'Read the request, check capability and timing; reply “go” or “no” with reasons.')],
                [L('Họp khám phá', 'Discovery call'), L('Buổi trao đổi 30–45 phút về bối cảnh, người dùng, mục tiêu và ràng buộc.', 'A 30–45 minute call on context, users, goals and constraints.')],
                [L('Đề xuất giải pháp', 'Proposal'), L('Phạm vi, kế hoạch theo mốc, rủi ro và chi phí — để bạn quyết định.', 'Scope, milestone plan, risks and cost — for you to decide on.')],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[1.75rem_1fr] gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full border border-[color:var(--s-ink)] text-[0.8rem] font-semibold text-[color:var(--s-ink)] tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[color:var(--s-ink)]">{t}</p>
                    <p className={T.small}>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about/quy-trinh" className={T.btnPrimary}>
                {L('Xem toàn bộ quy trình', 'See the full process')}
              </Link>
              <button type="button" onClick={() => setCode(undefined)} className={T.btnGhost}>
                {L('Gửi thêm một yêu cầu', 'Send another request')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Phiếu ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-10" aria-describedby={id('req-note')}>
      <p id={id('req-note')} className={T.small}>
        {L('Ô có dấu * là bắt buộc. Các ô còn lại giúp buổi trao đổi đầu tiên đi thẳng vào việc.', 'Fields marked * are required. The rest help the first conversation get straight to the point.')}
      </p>

      {/* Ô bẫy bot — người thật không thấy, không tab tới. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor={id('website')}>Website</label>
        <input
          id={id('website')}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={f.website}
          onChange={(e) => set('website', e.target.value)}
        />
      </div>

      <Fieldset legend={L('1. Người liên hệ', '1. Contact')}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id={id('name')} label={L('Họ và tên *', 'Full name *')} value={f.name} onChange={(v) => set('name', v)} error={errors.name} autoComplete="name" maxLength={120} />
          <TextField id={id('email')} type="email" label={L('Email công việc *', 'Work email *')} value={f.email} onChange={(v) => set('email', v)} error={errors.email} autoComplete="email" maxLength={254} />
          <TextField id={id('phone')} type="tel" label={L('Số điện thoại', 'Phone')} value={f.phone} onChange={(v) => set('phone', v)} error={errors.phone} autoComplete="tel" maxLength={30} />
          <TextField id={id('organization')} label={L('Tổ chức / doanh nghiệp', 'Organisation')} value={f.organization} onChange={(v) => set('organization', v)} error={errors.organization} autoComplete="organization" maxLength={200} />
          <div className="sm:col-span-2">
            <TextField
              id={id('senderRole')}
              label={L('Vai trò của bạn trong dự án', 'Your role in the project')}
              placeholder={L('Ví dụ: Giám đốc vận hành, trưởng phòng CNTT, chủ sản phẩm', 'e.g. Head of operations, IT manager, product owner')}
              value={f.senderRole}
              onChange={(v) => set('senderRole', v)}
              error={errors.senderRole}
              autoComplete="organization-title"
              maxLength={120}
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset legend={L('2. Dự án', '2. The project')}>
        <div>
          <p id={id('productTypes-l')} className="text-sm font-semibold text-[color:var(--s-ink)]">
            {L('Loại sản phẩm * (chọn được nhiều)', 'Product type * (pick any)')}
          </p>
          <div
            id={id('productTypes')}
            role="group"
            aria-labelledby={id('productTypes-l')}
            aria-describedby={errors.productTypes ? id('productTypes-e') : undefined}
            tabIndex={-1}
            className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PRODUCT_OPTIONS.map((o) => {
              const on = f.productTypes.includes(o.v);
              return (
                <label
                  key={o.v}
                  className={`flex gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors ${
                    on ? 'border-[color:var(--s-ink)] bg-[var(--s-band)]' : 'border-[color:var(--s-line)] hover:border-[color:var(--s-line-strong)]'
                  }`}
                >
                  <input type="checkbox" checked={on} onChange={() => toggleType(o.v)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--s-ink)]" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[color:var(--s-ink)]">{p(o.label)}</span>
                    <span className="block text-[0.78rem] text-[color:var(--s-muted)]">{p(o.hint)}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError id={id('productTypes-e')} msg={errors.productTypes} />
        </div>

        <TextArea
          id={id('needs')}
          label={L('Nhu cầu của bạn *', 'What you need *')}
          hint={L('Vấn đề đang gặp, ai gặp, hiện đang xử lý thế nào. Chưa cần giải pháp — mô tả vấn đề là đủ.', 'The problem, who has it, how it’s handled today. No solution needed — the problem is enough.')}
          value={f.needs}
          onChange={(v) => set('needs', v)}
          error={errors.needs}
          rows={6}
          maxLength={10_000}
          counter={{ min: 20 }}
          lang={lang}
        />
        <div className="grid gap-5 md:grid-cols-2">
          <TextArea id={id('businessGoals')} label={L('Mục tiêu kinh doanh', 'Business goals')} hint={L('Thành công trông như thế nào sau 6–12 tháng?', 'What does success look like in 6–12 months?')} value={f.businessGoals} onChange={(v) => set('businessGoals', v)} error={errors.businessGoals} rows={4} maxLength={5000} lang={lang} />
          <TextArea id={id('endUsers')} label={L('Người dùng cuối', 'End users')} hint={L('Ai dùng, khoảng bao nhiêu người, trên thiết bị nào?', 'Who uses it, roughly how many, on which devices?')} value={f.endUsers} onChange={(v) => set('endUsers', v)} error={errors.endUsers} rows={4} maxLength={5000} lang={lang} />
        </div>
        <TextArea id={id('existingSystems')} label={L('Hệ thống hiện có cần tích hợp', 'Existing systems to integrate')} hint={L('Ví dụ: ERP, phần mềm kế toán, Excel, đăng nhập một lần (SSO)…', 'e.g. ERP, accounting software, spreadsheets, single sign-on (SSO)…')} value={f.existingSystems} onChange={(v) => set('existingSystems', v)} error={errors.existingSystems} rows={3} maxLength={5000} lang={lang} />
      </Fieldset>

      <Fieldset legend={L('3. Phạm vi & dữ liệu', '3. Scope & data')}>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField id={id('budget')} label={L('Ngân sách dự kiến', 'Expected budget')} value={f.budgetRange} onChange={(v) => set('budgetRange', v)} options={BUDGETS.map((b) => p(b))} placeholder={L('Chọn khoảng', 'Choose a range')} />
          <SelectField id={id('deadline')} label={L('Thời hạn mong muốn', 'Desired timeline')} value={f.desiredDeadline} onChange={(v) => set('desiredDeadline', v)} options={DEADLINES.map((b) => p(b))} placeholder={L('Chọn khoảng', 'Choose a range')} />
        </div>
        <div>
          <p id={id('sec-l')} className="text-sm font-semibold text-[color:var(--s-ink)]">
            {L('Mức độ dữ liệu hệ thống sẽ xử lý', 'Data the system will handle')}
          </p>
          <div role="radiogroup" aria-labelledby={id('sec-l')} className="mt-3 grid gap-2.5 md:grid-cols-3">
            {SECURITY.map((o) => {
              const on = f.securityLevel === o.v;
              return (
                <label
                  key={o.v}
                  className={`flex gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors ${
                    on ? 'border-[color:var(--s-ink)] bg-[var(--s-band)]' : 'border-[color:var(--s-line)] hover:border-[color:var(--s-line-strong)]'
                  }`}
                >
                  <input type="radio" name={id('sec')} checked={on} onChange={() => set('securityLevel', o.v)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--s-ink)]" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[color:var(--s-ink)]">{p(o.label)}</span>
                    <span className="block text-[0.78rem] leading-snug text-[color:var(--s-muted)]">{p(o.hint)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        {f.securityLevel !== 'NORMAL' && (
          <TextArea
            id={id('securityNote')}
            label={L('Ghi chú về dữ liệu & yêu cầu tuân thủ', 'Notes on data & compliance')}
            hint={L('Loại dữ liệu, quy định phải tuân theo, yêu cầu lưu trữ trong nước… Không dán dữ liệu thật vào đây.', 'Data types, regulations to follow, in-country storage… Don’t paste real data here.')}
            value={f.securityNote}
            onChange={(v) => set('securityNote', v)}
            rows={3}
            maxLength={5000}
            lang={lang}
          />
        )}
      </Fieldset>

      {/* Đồng ý */}
      <div className="rounded-lg border border-[color:var(--s-line)] bg-[var(--s-band)] p-4 sm:p-5">
        <label className="flex gap-3 cursor-pointer">
          <input
            id={id('consent')}
            type="checkbox"
            checked={f.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? id('consent-e') : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--s-ink)]"
          />
          <span className="text-sm leading-relaxed text-[color:var(--s-body)]">
            {L('Tôi đã đọc ', 'I have read the ')}
            <a href="#thong-bao-du-lieu" className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4">
              {L('thông báo xử lý dữ liệu cá nhân', 'personal data notice')}
            </a>
            {L(
              ` (phiên bản ${CONSENT_VERSION}) và đồng ý để CuongHoang Studio xử lý dữ liệu trong phiếu này cho các mục đích đã nêu. *`,
              ` (version ${CONSENT_VERSION}) and agree that CuongHoang Studio may process the data in this form for the stated purposes. *`,
            )}
          </span>
        </label>
        <FieldError id={id('consent-e')} msg={errors.consent} />
      </div>

      {formError && (
        <div role="alert" className="flex gap-3 rounded-lg border border-red-500/40 bg-red-500/[0.06] p-4 text-sm text-[color:var(--s-ink)]">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div className="min-w-0">
            <p>{formError}</p>
            <p className="mt-1 text-[color:var(--s-muted)]">
              {L('Email trực tiếp: ', 'Direct email: ')}
              <a href={`mailto:${STUDIO_EMAIL}`} className="underline break-all">{STUDIO_EMAIL}</a>
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={sending} className={`${T.btnPrimary} min-w-[12rem] disabled:opacity-60`}>
          {sending && <Loader2 className="w-4 h-4 animate-spin" />}
          {sending ? L('Đang gửi…', 'Sending…') : L('Gửi yêu cầu dự án', 'Send project request')}
        </button>
        <p className={T.small}>{L('Gửi phiếu không phát sinh nghĩa vụ hay chi phí nào.', 'Sending a request creates no obligation or cost.')}</p>
      </div>
    </form>
  );
}

// ─── Ô nhập ────────────────────────────────────────────────────────────────
const inputCls =
  'mt-1.5 block w-full min-w-0 rounded-lg border bg-[var(--s-raise)] px-3.5 py-2.5 text-[0.95rem] text-[color:var(--s-ink)] placeholder:text-[color:var(--s-muted)] placeholder:opacity-70 transition-colors focus:outline-none focus:border-[color:var(--s-ink)]';

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-6 min-w-0">
      <legend className="font-editorial text-[1.35rem] text-[color:var(--s-ink)] mb-5">{legend}</legend>
      {children}
    </fieldset>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[0.8rem] text-red-600">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {msg}
    </p>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-semibold text-[color:var(--s-ink)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-e` : undefined}
        className={`${inputCls} ${error ? 'border-red-500' : 'border-[color:var(--s-line-strong)]'}`}
      />
      <FieldError id={`${id}-e`} msg={error} />
    </div>
  );
}

function TextArea({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  rows,
  maxLength,
  counter,
  lang,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rows: number;
  maxLength: number;
  counter?: { min: number };
  lang: Lang;
}) {
  const len = value.trim().length;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-semibold text-[color:var(--s-ink)]">
        {label}
      </label>
      {hint && <p id={`${id}-h`} className="text-[0.8rem] text-[color:var(--s-muted)] mt-0.5">{hint}</p>}
      <textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={[hint ? `${id}-h` : '', error ? `${id}-e` : ''].filter(Boolean).join(' ') || undefined}
        className={`${inputCls} resize-y ${error ? 'border-red-500' : 'border-[color:var(--s-line-strong)]'}`}
      />
      <div className="flex justify-between gap-3">
        <FieldError id={`${id}-e`} msg={error} />
        {counter && (
          <p className={`ml-auto mt-1.5 text-[0.75rem] tabular-nums ${len < counter.min ? 'text-[color:var(--s-muted)]' : 'text-[color:var(--s-accent)]'}`}>
            {len < counter.min
              ? lang === 'en'
                ? `${counter.min - len} more characters`
                : `còn ${counter.min - len} ký tự`
              : `${len.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')}`}
          </p>
        )}
      </div>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-semibold text-[color:var(--s-ink)]">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} border-[color:var(--s-line-strong)]`}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

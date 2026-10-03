'use client';

/**
 * /about/nhan-du-an/tra-cuu — khách tự tra trạng thái phiếu yêu cầu dự án.
 *
 * Nhập mã phiếu (YC-2026-0001) + email đã dùng khi gửi ⇒ POST
 * /api/v1/project-requests/lookup (POST để email không vào URL / log).
 * Backend chỉ trả khi CẢ HAI khớp; sai thì một 404 chung — trang này cũng nói
 * một câu chung, không gợi ý "mã đúng nhưng email sai".
 *
 * `?code=YC-…` trên URL điền sẵn ô mã (KHÔNG bao giờ nhận email qua URL).
 * Sáng/tối theo token `--s-*` của studio.module.css (html.theme-dark), không dùng `dark:`.
 * ⛔ Không cam kết thời gian phản hồi chưa được chủ site duyệt.
 */
import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Loader2, Search, X } from 'lucide-react';
import { StudioShell, T, useStudioLang, STUDIO_EMAIL } from '@/components/studio/StudioUI';
import {
  projectRequestApi,
  type ProjectRequestLookupResult,
  type ProjectRequestProductType,
  type ProjectRequestStatus,
} from '@/lib/api';

type Bi = readonly [string, string];

/** Đường chính; DECLINED là nhánh rẽ sau QUALIFYING, vẽ riêng. */
const MAIN_STEPS: Exclude<ProjectRequestStatus, 'DECLINED'>[] = ['NEW', 'QUALIFYING', 'ACCEPTED', 'PROJECT_CREATED'];

const STATUS_INFO: Record<ProjectRequestStatus, { title: Bi; meaning: Bi; next: Bi }> = {
  NEW: {
    title: ['Đã nhận phiếu', 'Request received'],
    meaning: [
      'Phiếu đã vào hệ thống và đang chờ studio đọc.',
      'Your request is in the system and waiting to be read by the studio.',
    ],
    next: [
      'Studio đọc phiếu, có thể email cho bạn để hỏi thêm vài điểm trước khi đánh giá.',
      'The studio reads it and may email you a few questions before assessing it.',
    ],
  },
  QUALIFYING: {
    title: ['Đang đánh giá phù hợp', 'Assessing fit'],
    meaning: [
      'Studio đang đối chiếu nhu cầu của bạn với năng lực, phạm vi và thời hạn — có thể kèm một buổi trao đổi ngắn.',
      'The studio is checking your needs against capability, scope and timing — possibly with a short call.',
    ],
    next: [
      'Bạn nhận câu trả lời “đi tiếp” hoặc “không đi tiếp”, kèm lý do.',
      'You get a “go” or “no go” answer, with reasons.',
    ],
  },
  ACCEPTED: {
    title: ['Đã nhận làm', 'Accepted'],
    meaning: [
      'Studio đồng ý đi tiếp với dự án của bạn.',
      'The studio has agreed to move forward with your project.',
    ],
    next: [
      'Họp khám phá, rồi đề xuất gồm phạm vi, kế hoạch theo mốc, rủi ro và chi phí. Khi hai bên thống nhất, dự án được lập để theo dõi tiến độ.',
      'A discovery call, then a proposal with scope, milestones, risks and cost. Once both sides agree, a project is set up so you can follow progress.',
    ],
  },
  PROJECT_CREATED: {
    title: ['Đã mở dự án', 'Project opened'],
    meaning: [
      'Dự án đã được lập trong hệ thống quản lý công việc của studio.',
      'The project has been set up in the studio’s work tracker.',
    ],
    next: [
      'Công việc chạy theo các giai đoạn của quy trình. Nếu có link tiến độ bên dưới, bạn xem được bảng việc và báo cáo (chỉ đọc).',
      'Work proceeds through the stages of the process. If a progress link appears below, you can view the board and reports (read-only).',
    ],
  },
  DECLINED: {
    title: ['Không đi tiếp', 'Not proceeding'],
    meaning: [
      'Sau khi đánh giá, studio quyết định không nhận dự án này.',
      'After assessing it, the studio decided not to take this project on.',
    ],
    next: [
      'Lý do được gửi qua email hoặc ghi trong lời nhắn bên dưới. Nếu nhu cầu thay đổi, bạn có thể gửi một phiếu mới.',
      'The reasons are sent by email or written in the message below. If your needs change, you are welcome to send a new request.',
    ],
  },
};

const PRODUCT_LABEL: Record<ProjectRequestProductType, Bi> = {
  WEB: ['Hệ thống web', 'Web system'],
  APP: ['Ứng dụng di động', 'Mobile app'],
  TOOL: ['Công cụ nội bộ', 'Internal tool'],
  AI: ['Tích hợp AI', 'AI integration'],
  OTHER: ['Khác', 'Other'],
};

const CODE_RE = /^YC-\d{4}-\d{1,6}$/;

const inputCls =
  'mt-1.5 block w-full min-w-0 rounded-lg border border-[color:var(--s-line-strong)] bg-[var(--s-raise)] px-3.5 py-2.5 text-[0.95rem] text-[color:var(--s-ink)] placeholder:text-[color:var(--s-muted)] placeholder:opacity-70 transition-colors focus:outline-none focus:border-[color:var(--s-ink)]';

export default function LookupClient() {
  const { lang, L } = useStudioLang();
  const p = (b: Bi) => (lang === 'en' ? b[1] : b[0]);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProjectRequestLookupResult | null>(null);

  // ?code=YC-2026-0001 ⇒ điền sẵn mã (từ màn hình "đã gửi phiếu" hoặc email).
  useEffect(() => {
    try {
      const c = new URLSearchParams(window.location.search).get('code');
      if (c && CODE_RE.test(c.trim().toUpperCase())) setCode(c.trim().toUpperCase());
    } catch {
      /* bỏ qua */
    }
  }, []);

  const fmt = (iso: string | null) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(lang === 'en' ? 'en-GB' : 'vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    const em = email.trim();
    setError(null);
    if (!CODE_RE.test(c)) {
      setError(L('Mã phiếu có dạng YC-2026-0001.', 'A request code looks like YC-2026-0001.'));
      document.getElementById(id('code'))?.focus();
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(em)) {
      setError(L('Nhập email bạn đã dùng khi gửi phiếu.', 'Enter the email you used when sending the request.'));
      document.getElementById(id('email'))?.focus();
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await projectRequestApi.lookup({ code: c, email: em });
      setResult(res.data.data);
      setTimeout(() => document.getElementById(id('result'))?.focus(), 30);
    } catch (err) {
      const ax = err as { response?: { status?: number } };
      const status = ax.response?.status;
      if (status === 404 || status === 400) {
        setError(
          L(
            'Không tìm thấy phiếu khớp với mã và email này. Kiểm tra lại mã (YC-…) và đúng email đã dùng khi gửi phiếu.',
            'No request matches this code and email. Check the code (YC-…) and use the same email you sent the request with.',
          ),
        );
      } else if (status === 429) {
        setError(L('Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau 15 phút.', 'Too many lookups. Please try again in 15 minutes.'));
      } else if (!ax.response) {
        setError(L('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.', 'Couldn’t reach the server. Check your connection and try again.'));
      } else {
        setError(L(`Máy chủ đang gặp lỗi (mã ${status}). Thử lại sau ít phút.`, `The server returned an error (code ${status}). Try again in a few minutes.`));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <StudioShell step={2}>
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <p className={T.label}>{L('Nhận dự án · Tra cứu phiếu', 'Start a project · Track a request')}</p>
          <h1 className={`${T.h2} mt-3`}>{L('Phiếu của bạn đang ở đâu?', 'Where is your request?')}</h1>
          <p className={`${T.lead} mt-4 max-w-[60ch]`}>
            {L(
              'Nhập mã phiếu bạn nhận được khi gửi và email đã dùng trong phiếu. Cả hai phải khớp thì mới xem được.',
              'Enter the request code you received and the email you used in the request. Both must match.',
            )}
          </p>

          {/* ── Form ───────────────────────────────────────────────── */}
          <form onSubmit={submit} noValidate className={`${T.card} mt-8 p-5 sm:p-7 min-w-0`} aria-describedby={error ? id('err') : undefined}>
            <div className="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <label className="block min-w-0" htmlFor={id('code')}>
                <span className="text-sm font-semibold text-[color:var(--s-ink)]">{L('Mã phiếu', 'Request code')}</span>
                <input
                  id={id('code')}
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="YC-2026-0001"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={40}
                  className={`${inputCls} font-mono tracking-wide`}
                />
              </label>
              <label className="block min-w-0" htmlFor={id('email')}>
                <span className="text-sm font-semibold text-[color:var(--s-ink)]">{L('Email đã dùng khi gửi', 'Email used in the request')}</span>
                <input
                  id={id('email')}
                  name="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={L('ban@congty.vn', 'you@company.com')}
                  autoComplete="email"
                  maxLength={254}
                  className={inputCls}
                />
              </label>
            </div>
            {error && (
              <p id={id('err')} role="alert" className="mt-4 rounded-lg border border-[color:var(--s-line-strong)] bg-[var(--s-band)] px-3.5 py-2.5 text-sm text-[color:var(--s-ink)]">
                {error}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="submit" disabled={busy} className={`${T.btnPrimary} disabled:opacity-60`}>
                {busy ? <Loader2 aria-hidden className="w-4 h-4 animate-spin" /> : <Search aria-hidden className="w-4 h-4" />}
                {busy ? L('Đang tra cứu…', 'Looking up…') : L('Tra cứu', 'Look up')}
              </button>
              <p className={T.small}>
                {L('Quên mã phiếu? Email ', 'Lost the code? Email ')}
                <a href={`mailto:${STUDIO_EMAIL}`} className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4 break-all">
                  {STUDIO_EMAIL}
                </a>
              </p>
            </div>
          </form>

          {/* ── Kết quả ────────────────────────────────────────────── */}
          {result && <Result r={result} p={p} L={L} fmt={fmt} lang={lang} resultId={id('result')} />}

          <p className={`${T.small} mt-10`}>
            <Link href="/about/nhan-du-an" className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4">
              {L('← Về trang Nhận dự án', '← Back to Start a project')}
            </Link>
            {' · '}
            <Link href="/about/quy-trinh" className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4">
              {L('Xem quy trình đầy đủ', 'See the full process')}
            </Link>
          </p>
        </div>
      </section>
    </StudioShell>
  );
}

function Result({
  r,
  p,
  L,
  fmt,
  lang,
  resultId,
}: {
  r: ProjectRequestLookupResult;
  p: (b: Bi) => string;
  L: (vi: string, en: string) => string;
  fmt: (iso: string | null) => string;
  lang: 'vi' | 'en';
  resultId: string;
}) {
  const declined = r.status === 'DECLINED';
  // Bị từ chối ⇒ đã đi qua NEW + QUALIFYING, dừng ở nhánh rẽ.
  const currentIdx = declined ? 2 : MAIN_STEPS.indexOf(r.status as (typeof MAIN_STEPS)[number]);
  const steps = declined ? MAIN_STEPS.slice(0, 2) : MAIN_STEPS;
  const info = STATUS_INFO[r.status];

  return (
    <section
      id={resultId}
      tabIndex={-1}
      aria-live="polite"
      aria-label={L('Kết quả tra cứu', 'Lookup result')}
      className={`${T.card} mt-8 p-5 sm:p-7 min-w-0 outline-none`}
    >
      {/* Đầu thẻ: mã + trạng thái + mốc thời gian */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <p className={T.small}>{L('Mã phiếu', 'Request code')}</p>
          <p className="font-mono text-[1.35rem] font-semibold tracking-wide text-[color:var(--s-ink)] tabular-nums break-all">{r.code}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
            declined
              ? 'border border-dashed border-[color:var(--s-line-strong)] text-[color:var(--s-body)]'
              : 'bg-[var(--s-ink)] text-[color:var(--s-on-ink)]'
          }`}
        >
          {declined ? <X aria-hidden className="w-3.5 h-3.5" /> : null}
          {p(info.title)}
        </span>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-[color:var(--s-muted)]">{L('Gửi lúc', 'Sent')}</dt>
          <dd className="text-[color:var(--s-ink)]">{fmt(r.createdAt)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[color:var(--s-muted)]">{L('Cập nhật gần nhất', 'Last updated')}</dt>
          <dd className="text-[color:var(--s-ink)]">{fmt(r.statusChangedAt ?? r.updatedAt)}</dd>
        </div>
        {r.productTypes.length > 0 && (
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-[color:var(--s-muted)]">{L('Loại sản phẩm', 'Product type')}</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {r.productTypes.map((t) => (
                <span key={t} className="rounded-md border border-[color:var(--s-line)] px-2 py-0.5 text-[0.8rem] text-[color:var(--s-ink)]">
                  {PRODUCT_LABEL[t] ? p(PRODUCT_LABEL[t]) : t}
                </span>
              ))}
            </dd>
          </div>
        )}
        {(r.organization || r.summary) && (
          <div className="min-w-0 sm:col-span-2">
            <dt className="text-[color:var(--s-muted)]">{r.organization ? L('Dự án', 'Project') : L('Tóm tắt', 'Summary')}</dt>
            {r.organization && <dd className="font-semibold text-[color:var(--s-ink)] break-words">{r.organization}</dd>}
            {r.summary && <dd className="mt-0.5 text-[color:var(--s-body)] break-words">{r.summary}</dd>}
          </div>
        )}
      </dl>

      {/* Dòng thời gian trạng thái */}
      <h2 className={`${T.h3} mt-8`}>{L('Tiến trình phiếu', 'Request progress')}</h2>
      <ol className="mt-4">
        {steps.map((st, i) => {
          const done = i < currentIdx;
          const on = i === currentIdx;
          const last = i === steps.length - 1 && !declined;
          return (
            <li key={st} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3" aria-current={on ? 'step' : undefined}>
              <div className="flex flex-col items-center">
                <span
                  className={`flex items-center justify-center w-7 h-7 shrink-0 rounded-full border text-[0.8rem] font-semibold tabular-nums ${
                    on
                      ? 'bg-[var(--s-ink)] border-[color:var(--s-ink)] text-[color:var(--s-on-ink)]'
                      : done
                        ? 'border-[color:var(--s-accent)] text-[color:var(--s-accent)]'
                        : 'border-[color:var(--s-line-strong)] text-[color:var(--s-muted)]'
                  }`}
                >
                  {done ? <Check aria-hidden className="w-3.5 h-3.5" /> : i + 1}
                </span>
                {!last && <span aria-hidden className={`w-px flex-1 min-h-4 ${done ? 'bg-[var(--s-accent)]' : 'bg-[var(--s-line-strong)]'}`} />}
              </div>
              <div className={`min-w-0 pb-5 ${on ? '' : 'pt-0.5'}`}>
                <p className={`text-sm ${on ? 'font-semibold text-[color:var(--s-ink)]' : done ? 'text-[color:var(--s-ink)]' : 'text-[color:var(--s-muted)]'}`}>
                  {p(STATUS_INFO[st].title)}
                  {on && <span className="sr-only"> {L('(bước hiện tại)', '(current step)')}</span>}
                </p>
                {on && <StepDetail info={info} p={p} L={L} />}
              </div>
            </li>
          );
        })}
        {declined && (
          <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3" aria-current="step">
            <span className="flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-[color:var(--s-ink)] text-[color:var(--s-ink)]">
              <X aria-hidden className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0 pb-1">
              <p className="text-sm font-semibold text-[color:var(--s-ink)]">
                {p(STATUS_INFO.DECLINED.title)}
                <span className="sr-only"> {L('(bước hiện tại)', '(current step)')}</span>
              </p>
              <StepDetail info={info} p={p} L={L} />
            </div>
          </li>
        )}
      </ol>

      {/* Lời nhắn của studio */}
      {r.clientNote && (
        <div className="mt-6 border-l-2 border-[color:var(--s-accent)] bg-[var(--s-band)] rounded-r-lg px-4 py-3">
          <p className={T.label}>{L('Lời nhắn từ studio', 'Message from the studio')}</p>
          <p className={`${T.body} mt-1.5 whitespace-pre-line break-words`}>{r.clientNote}</p>
        </div>
      )}

      {/* Link tiến độ (CT Work chỉ đọc) */}
      {r.progressUrl ? (
        <a
          href={r.progressUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${T.btnGhost} mt-6 w-full sm:w-auto`}
        >
          {L('Xem tiến độ dự án (chỉ đọc)', 'View project progress (read-only)')}
          <ArrowUpRight aria-hidden className="w-4 h-4" />
        </a>
      ) : r.status === 'PROJECT_CREATED' ? (
        <p className={`${T.small} mt-6`}>
          {L(
            'Link xem tiến độ chưa được chia sẻ cho phiếu này — studio sẽ gửi qua email khi sẵn sàng.',
            'A progress link hasn’t been shared for this request yet — the studio will email it when ready.',
          )}
        </p>
      ) : null}

      <p className={`${T.small} mt-6`}>
        {L('Muốn xem, sửa hoặc xoá dữ liệu đã gửi? Email ', 'Want to view, correct or delete what you sent? Email ')}
        <a href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(r.code)}`} className="font-semibold text-[color:var(--s-ink)] underline decoration-[color:var(--s-accent)] underline-offset-4 break-all">
          {STUDIO_EMAIL}
        </a>
        {lang === 'en' ? ' with your request code.' : ' kèm mã phiếu.'}
      </p>
    </section>
  );
}

function StepDetail({
  info,
  p,
  L,
}: {
  info: { meaning: Bi; next: Bi };
  p: (b: Bi) => string;
  L: (vi: string, en: string) => string;
}) {
  return (
    <div className="mt-1.5 space-y-2">
      <p className={T.body}>{p(info.meaning)}</p>
      <p className={T.body}>
        <span className="font-semibold text-[color:var(--s-ink)]">{L('Bước tiếp theo: ', 'Next: ')}</span>
        {p(info.next)}
      </p>
    </div>
  );
}

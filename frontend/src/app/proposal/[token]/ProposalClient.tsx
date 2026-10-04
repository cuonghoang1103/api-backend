'use client';

/**
 * /proposal/[token] — khách xem đề xuất dự án qua link có hạn và bấm Chấp thuận / Từ chối.
 * (CRM studio, CT Work đợt S5b — backend src/routes/crm.routes.ts `publicProposalRouter`.)
 *
 * · Công khai, noindex, no-referrer (token nằm trong URL — không rò qua Referer).
 * · Khách "ký" đúng nội dung đã xem: gửi kèm SHA-256 nội dung; server so với hash lúc gửi.
 *   Server ghi thời điểm + IP + user-agent + tên người bấm.
 * · Song ngữ theo locale của site (useStudioLang), sáng/tối theo token `--s-*`
 *   (html.theme-dark) — không dùng `dark:`. Chịu 390px: bảng có khung cuộn riêng.
 */
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Check, Loader2, ShieldCheck, X } from 'lucide-react';
import { studioCss, T, useStudioLang, STUDIO_EMAIL } from '@/components/studio/StudioUI';
import { publicProposalApi, type PublicProposal } from '@/lib/crm-api';

type LoadState = { kind: 'loading' } | { kind: 'error'; status: number } | { kind: 'ok'; p: PublicProposal };

const md = {
  table: (p: React.ComponentProps<'table'>) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-[color:var(--s-line)]"><table {...p} className="min-w-full border-collapse text-[0.85rem]" /></div>
  ),
  th: (p: React.ComponentProps<'th'>) => <th {...p} className="border-b border-[color:var(--s-line)] bg-[var(--s-band)] px-3 py-2 text-left font-semibold text-[color:var(--s-ink)]" />,
  td: (p: React.ComponentProps<'td'>) => <td {...p} className="border-b border-[color:var(--s-line)] px-3 py-2 align-top" />,
  h1: (p: React.ComponentProps<'h1'>) => <h2 {...p} className="mt-10 font-heading text-[1.5rem] font-semibold tracking-[-0.02em] text-[color:var(--s-ink)]" />,
  h2: (p: React.ComponentProps<'h2'>) => <h3 {...p} className="mt-8 text-[1.15rem] font-semibold text-[color:var(--s-ink)]" />,
  h3: (p: React.ComponentProps<'h3'>) => <h4 {...p} className="mt-6 font-semibold text-[color:var(--s-ink)]" />,
  p: (p: React.ComponentProps<'p'>) => <p {...p} className="my-3" />,
  ul: (p: React.ComponentProps<'ul'>) => <ul {...p} className="my-3 list-disc space-y-1 pl-5" />,
  ol: (p: React.ComponentProps<'ol'>) => <ol {...p} className="my-3 list-decimal space-y-1 pl-5" />,
  hr: () => <hr className="my-8 border-[color:var(--s-line)]" />,
  blockquote: (p: React.ComponentProps<'blockquote'>) => <blockquote {...p} className="my-4 border-l-2 border-[color:var(--s-accent)] pl-4 text-[color:var(--s-muted)]" />,
};

function fmt(iso: string | null, lang: 'vi' | 'en'): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(lang === 'en' ? 'en-GB' : 'vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function ProposalClient({ token }: { token: string }) {
  const { lang, L: Lvi } = useStudioLang();
  // Trang này viết cặp chữ theo thứ tự (EN, VI) như khung admin; `useStudioLang().L` nhận (VI, EN).
  const L = (en: string, vi: string) => Lvi(vi, en);
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [read, setRead] = useState(false);
  const [busy, setBusy] = useState<'ACCEPT' | 'DECLINE' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let off = false;
    publicProposalApi.get(token)
      .then((p) => { if (!off) setState({ kind: 'ok', p }); })
      .catch((e) => { if (!off) setState({ kind: 'error', status: (e as { response?: { status?: number } })?.response?.status ?? 0 }); });
    return () => { off = true; };
  }, [token]);

  async function respond(decision: 'ACCEPT' | 'DECLINE') {
    if (state.kind !== 'ok' || !state.p.contentHash) return;
    setBusy(decision);
    setError(null);
    try {
      const r = await publicProposalApi.respond(token, { decision, name: name.trim(), note: note.trim() || undefined, contentHash: state.p.contentHash });
      setState({ kind: 'ok', p: { ...state.p, status: r.status as PublicProposal['status'], respondedAt: r.respondedAt, responseName: name.trim() } });
    } catch (e) {
      const data = (e as { response?: { data?: { message?: string; code?: string } } })?.response?.data;
      setError(data?.code === 'PROPOSAL_CHANGED'
        ? L('The proposal changed since you opened it — reload the page.', 'Đề xuất đã thay đổi kể từ lúc bạn mở — hãy tải lại trang.')
        : data?.message || L('Could not send your answer. Please try again.', 'Không gửi được phản hồi. Vui lòng thử lại.'));
    } finally { setBusy(null); }
  }

  return (
    <div className={studioCss.root}>
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-24 sm:pt-28">
        {state.kind === 'loading' && (
          <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-[color:var(--s-muted)]" /></div>
        )}

        {state.kind === 'error' && (
          <div className="py-16" data-testid="proposal-error">
            <p className={T.label}>{L('Project proposal', 'Đề xuất dự án')}</p>
            <h1 className={`${T.h2} mt-3`}>
              {state.status === 410 ? L('This link has expired', 'Link này đã hết hạn') : L('Proposal not found', 'Không tìm thấy đề xuất')}
            </h1>
            <p className={`${T.body} mt-4 max-w-xl`}>
              {state.status === 410
                ? L('Proposal links are valid for a limited time. Ask the studio for a new link.', 'Link đề xuất chỉ có hiệu lực trong một thời gian. Hãy xin studio gửi link mới.')
                : L('The link may be mistyped, or replaced by a newer version of the proposal.', 'Link có thể bị gõ sai, hoặc đã được thay bằng phiên bản đề xuất mới hơn.')}
              {' '}<a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
            </p>
          </div>
        )}

        {state.kind === 'ok' && (() => {
          const p = state.p;
          const answered = p.status !== 'SENT';
          return (
            <article data-testid="proposal">
              <header className="border-b border-[color:var(--s-line)] pb-6">
                <p className={T.label}>{L('Project proposal', 'Đề xuất dự án')} · v{p.version}</p>
                <h1 className={`${T.h2} mt-3 break-words`}>{p.title}</h1>
                <dl className="mt-4 grid gap-x-6 gap-y-1 text-[0.85rem] sm:grid-cols-[auto_1fr]">
                  {p.orgName && (<><dt className="text-[color:var(--s-muted)]">{L('For', 'Gửi')}</dt><dd className="text-[color:var(--s-ink)]">{p.orgName}</dd></>)}
                  <dt className="text-[color:var(--s-muted)]">{L('Sent', 'Ngày gửi')}</dt><dd>{fmt(p.sentAt, lang)}</dd>
                  {!answered && (<><dt className="text-[color:var(--s-muted)]">{L('Valid until', 'Hiệu lực đến')}</dt><dd>{fmt(p.expiresAt, lang)}</dd></>)}
                </dl>
                {lang === 'en' && (
                  <p className="mt-4 rounded-lg border border-[color:var(--s-line)] bg-[var(--s-band)] px-3 py-2 text-[0.8rem] text-[color:var(--s-muted)]">
                    The proposal itself is written in Vietnamese. Ask the studio if you need an English version.
                  </p>
                )}
              </header>

              <div className="mt-6 break-words text-[0.95rem] leading-[1.75] text-[color:var(--s-body)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={md}>{p.content}</ReactMarkdown>
              </div>

              <section className="mt-12 rounded-xl border border-[color:var(--s-line-strong)] bg-[var(--s-raise)] p-5 sm:p-6" aria-labelledby="respond-h">
                <h2 id="respond-h" className={T.h3}>{answered ? L('Your answer', 'Phản hồi của bạn') : L('Your decision', 'Quyết định của bạn')}</h2>
                {answered ? (
                  <div className="mt-3 flex items-start gap-3" data-testid="proposal-answered">
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${p.status === 'ACCEPTED' ? 'bg-[var(--s-accent-soft)] text-[color:var(--s-accent)]' : 'bg-[var(--s-band)] text-[color:var(--s-muted)]'}`}>
                      {p.status === 'ACCEPTED' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </span>
                    <p className={T.body}>
                      {p.status === 'ACCEPTED'
                        ? L(`Accepted by ${p.responseName ?? '—'} on ${fmt(p.respondedAt, lang)}. The studio will contact you about the contract.`, `${p.responseName ?? '—'} đã chấp thuận lúc ${fmt(p.respondedAt, lang)}. Studio sẽ liên hệ về hợp đồng.`)
                        : L(`Declined by ${p.responseName ?? '—'} on ${fmt(p.respondedAt, lang)}. Thank you for letting us know.`, `${p.responseName ?? '—'} đã từ chối lúc ${fmt(p.respondedAt, lang)}. Cảm ơn bạn đã phản hồi.`)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <p className={T.small}>
                      {L('Accepting means you agree with the scope and figures in this version, so both sides can move on to a contract. It is not the contract itself.',
                        'Chấp thuận nghĩa là bạn đồng ý với phạm vi và con số trong phiên bản này để hai bên tiến tới hợp đồng. Đây chưa phải là hợp đồng.')}
                    </p>
                    <label className="block">
                      <span className="mb-1 block text-[0.8rem] font-semibold text-[color:var(--s-ink)]">{L('Your full name', 'Họ tên của bạn')}</span>
                      <input
                        className="h-11 w-full rounded-lg border border-[color:var(--s-line-strong)] bg-[var(--s-paper)] px-3 text-[0.95rem] text-[color:var(--s-ink)]"
                        value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoComplete="name" data-testid="respond-name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[0.8rem] font-semibold text-[color:var(--s-ink)]">{L('Message (optional)', 'Lời nhắn (tuỳ chọn)')}</span>
                      <textarea
                        className="w-full rounded-lg border border-[color:var(--s-line-strong)] bg-[var(--s-paper)] px-3 py-2 text-[0.95rem] text-[color:var(--s-ink)]"
                        rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={5000}
                      />
                    </label>
                    <label className="flex items-start gap-2.5 text-[0.85rem] text-[color:var(--s-body)]">
                      <input type="checkbox" className="mt-1" checked={read} onChange={(e) => setRead(e.target.checked)} data-testid="respond-read" />
                      <span>{L(`I have read the whole proposal, version ${p.version}.`, `Tôi đã đọc toàn bộ đề xuất, phiên bản ${p.version}.`)}</span>
                    </label>
                    {error && <p className="text-[0.85rem] font-medium text-[#b42318]" role="alert">{error}</p>}
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button className={T.btnPrimary} disabled={!read || name.trim().length < 2 || !!busy || !p.integrity} onClick={() => respond('ACCEPT')} data-testid="respond-accept" style={{ opacity: !read || name.trim().length < 2 ? 0.5 : 1 }}>
                        {busy === 'ACCEPT' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {L('Accept proposal', 'Chấp thuận đề xuất')}
                      </button>
                      <button className={T.btnGhost} disabled={name.trim().length < 2 || !!busy} onClick={() => respond('DECLINE')} data-testid="respond-decline" style={{ opacity: name.trim().length < 2 ? 0.5 : 1 }}>
                        {busy === 'DECLINE' ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} {L('Decline', 'Từ chối')}
                      </button>
                    </div>
                  </div>
                )}
                <p className="mt-5 flex items-start gap-2 border-t border-[color:var(--s-line)] pt-4 text-[0.75rem] leading-[1.6] text-[color:var(--s-muted)]">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    {L('When you answer, we record the time, your IP address, browser and this content fingerprint (SHA-256), as evidence of which version was answered:',
                      'Khi bạn phản hồi, hệ thống ghi thời điểm, địa chỉ IP, trình duyệt và dấu vân tay nội dung (SHA-256) này, làm bằng chứng phiên bản nào đã được phản hồi:')}
                    {' '}<code className="break-all text-[0.7rem]">{p.contentHash}</code>
                    {!p.integrity && <b className="block text-[#b42318]">{L('Integrity check failed — please contact the studio.', 'Kiểm tra toàn vẹn thất bại — vui lòng liên hệ studio.')}</b>}
                  </span>
                </p>
              </section>
            </article>
          );
        })()}
      </main>
    </div>
  );
}

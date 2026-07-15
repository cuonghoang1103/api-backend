'use client';

/**
 * /cv/intake — Intake Mode (Phase 8c). For a blank page: the AI debriefs you
 * like a recruiter to pull real content out, then drafts bullets FROM YOUR
 * ANSWERS ONLY (with the facts they're based on). You confirm each before it's
 * saved to a chosen experience/project. Nothing is invented; needs an AI key.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Send, Sparkles, Plus, Check, MessageSquare } from 'lucide-react';
import { cvApi } from '@/lib/cv-api';
import type { CvProfile, CvItemKind } from '@/types/cv';

interface Msg { role: 'user' | 'assistant'; content: string; drafts?: { text: string; userStatedFacts: string; added?: boolean }[] }

const KINDS: { v: CvItemKind; l: string }[] = [
  { v: 'EXPERIENCE', l: 'Kinh nghiệm' }, { v: 'PROJECT', l: 'Dự án' }, { v: 'OPEN_SOURCE', l: 'Open source' },
];

export default function CvIntakePage() {
  const [profile, setProfile] = useState<CvProfile | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [needPro, setNeedPro] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newKind, setNewKind] = useState<CvItemKind>('PROJECT');
  const [creating, setCreating] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const [p, st] = await Promise.all([cvApi.getProfile(), cvApi.intakeStatus().catch(() => ({ data: { data: { available: false, needPro: false } } }))]);
      setProfile(p.data.data);
      setAvailable(st.data.data.available);
      setNeedPro(!!(st.data.data as { needPro?: boolean }).needPro);
      const firstItem = p.data.data.items.find((i) => ['EXPERIENCE', 'PROJECT', 'OPEN_SOURCE'].includes(i.kind));
      if (firstItem) setTargetId(firstItem.id);
    } catch (e) {
      if ((e as { response?: { status?: number } })?.response?.status === 401) setNeedLogin(true);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, busy]);

  const createItem = async () => {
    if (!newTitle.trim()) { toast.error('Nhập tên mục'); return; }
    setCreating(true);
    try {
      const it = (await cvApi.createItem({ kind: newKind, title: newTitle })).data.data;
      await load();
      setTargetId(it.id); setNewTitle('');
      toast.success('Đã tạo mục — bắt đầu kể đi');
    } catch { toast.error('Tạo mục thất bại'); } finally { setCreating(false); }
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next); setInput(''); setBusy(true);
    try {
      const res = await cvApi.intakeTurn(next.map((m) => ({ role: m.role, content: m.content })));
      const { reply, draftBullets } = res.data.data;
      setMessages([...next, { role: 'assistant', content: reply, drafts: draftBullets.map((d) => ({ ...d })) }]);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Lỗi khi trò chuyện');
      setMessages(next); // keep the user's message
    } finally { setBusy(false); }
  };

  const addDraft = async (msgIdx: number, draftIdx: number) => {
    if (!targetId) { toast.error('Chọn hoặc tạo mục để lưu vào trước'); return; }
    const d = messages[msgIdx].drafts?.[draftIdx];
    if (!d) return;
    try {
      await cvApi.createBullet(targetId, { text: d.text, userStatedFacts: d.userStatedFacts || undefined });
      setMessages((ms) => ms.map((m, i) => i !== msgIdx ? m : { ...m, drafts: m.drafts?.map((x, j) => j === draftIdx ? { ...x, added: true } : x) }));
      toast.success('Đã thêm vào hồ sơ');
    } catch { toast.error('Không thêm được'); }
  };

  if (needLogin) {
    return <div className="min-h-screen bg-[var(--bg-primary)] pt-16"><div className="mx-auto max-w-3xl px-4 py-12 text-sm text-[var(--text-secondary)]">Bạn cần đăng nhập. <Link href="/login" className="text-[var(--accent-color)]">Đăng nhập</Link></div></div>;
  }

  const targetItems = (profile?.items ?? []).filter((i) => ['EXPERIENCE', 'PROJECT', 'OPEN_SOURCE'].includes(i.kind));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:py-10" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <Link href="/cv" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> CV Builder
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Chế độ phỏng vấn — AI hỏi, bạn kể</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Không biết viết gì? AI sẽ hỏi để moi ra chi tiết mạnh, rồi soạn bullet <strong>chỉ từ điều bạn kể</strong>. Bạn duyệt từng dòng trước khi lưu.
        </p>

        {available === false && (
          <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            {needPro ? (
              <>Chế độ AI phỏng vấn dành cho tài khoản <strong>Pro</strong>.
                <Link href="/pro" className="ml-2 inline-flex items-center gap-1 rounded bg-amber-500 px-2.5 py-1 text-xs font-semibold text-black hover:opacity-90">Nâng cấp Pro</Link>
                <span className="mt-1 block text-xs text-[var(--text-secondary)]">Bạn vẫn có thể <Link href="/cv/profile" className="text-[var(--accent-color)]">nhập tay ở trình chỉnh sửa</Link> — miễn phí.</span></>
            ) : (
              <>Chế độ phỏng vấn cần AI — chưa cấu hình khoá. Bạn vẫn có thể <Link href="/cv/profile" className="text-[var(--accent-color)]">nhập tay ở trình chỉnh sửa</Link>.</>
            )}
          </div>
        )}

        {available !== false && (
          <>
            {/* Target picker */}
            <div className="mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              <div className="text-xs font-medium text-[var(--text-secondary)]">Lưu các dòng thành tích vào mục:</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {targetItems.map((it) => (
                  <button key={it.id} onClick={() => setTargetId(it.id)}
                    className={`rounded-lg border px-2.5 py-1 text-sm ${targetId === it.id ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white' : 'border-[var(--border-color)] hover:bg-[var(--bg-primary)]'}`}>
                    {it.title}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select value={newKind} onChange={(e) => setNewKind(e.target.value as CvItemKind)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1.5 text-sm">
                  {KINDS.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}
                </select>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="…hoặc tạo mục mới (tên dự án / vai trò)"
                  className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-1.5 text-sm" />
                <button onClick={createItem} disabled={creating} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-sm hover:bg-[var(--bg-primary)]">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Tạo
                </button>
              </div>
            </div>

            {/* Conversation */}
            <div ref={scrollRef} className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-[var(--text-secondary)]">
                  <MessageSquare className="h-6 w-6" />
                  Bắt đầu bằng cách kể một việc bạn đã làm — ví dụ “Tôi xây tích hợp thanh toán PayOS”. AI sẽ đào tiếp.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-primary)]'}`}>
                    {m.role === 'assistant' && <div className="mb-1 flex items-center gap-1 text-xs text-[var(--text-secondary)]"><Sparkles className="h-3 w-3" /> AI</div>}
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    {m.drafts && m.drafts.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {m.drafts.map((d, j) => (
                          <div key={j} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-2">
                            <div className="text-sm">{d.text}</div>
                            {d.userStatedFacts && <div className="mt-0.5 text-[11px] text-[var(--text-secondary)]">Dựa trên: {d.userStatedFacts}</div>}
                            <button onClick={() => addDraft(i, j)} disabled={d.added}
                              className={`mt-1.5 inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${d.added ? 'text-emerald-500' : 'bg-[var(--accent-color)] text-white hover:opacity-90'}`}>
                              {d.added ? <><Check className="h-3 w-3" /> Đã thêm</> : <><Plus className="h-3 w-3" /> Thêm vào hồ sơ</>}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {busy && <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Loader2 className="h-4 w-4 animate-spin" /> AI đang nghĩ…</div>}
            </div>

            {/* Input */}
            <div className="mt-3 flex items-end gap-2">
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Trả lời / kể tiếp… (Enter để gửi)"
                className="min-h-[46px] max-h-40 flex-1 resize-y rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm" />
              <button onClick={send} disabled={busy || !input.trim()}
                aria-label="Gửi tin nhắn" className="inline-flex h-[46px] items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

/**
 * Phòng tư vấn chọn NGÀNH HẸP — "CuongMini Cố Vấn".
 *
 * Vào từ bước "chọn ngành hẹp" của onboarding (/academy). Gồm:
 *  · Chat với CuongMini (neo dữ liệu ngành thật ở backend — không bịa số).
 *  · Câu hỏi GỢI Ý + "Câu hỏi thường gặp" (gộp từ câu người dùng đã hỏi).
 *  · So sánh & đánh giá ngành hẹp theo 2 thị trường: 🇻🇳 Việt Nam · 🌏 Toàn cầu,
 *    kèm nguồn thống kê thật + nơi thường tuyển (ITviec/Upwork/công ty…).
 *  · Thảo luận: bình luận có ảnh, avatar, like, báo cáo.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Send, Sparkles, ExternalLink, GraduationCap, Loader2, MapPin, Globe2,
  Heart, Flag, Trash2, ImagePlus, MessageCircle, X, HelpCircle, Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import Markdown from '@/components/markdown/Markdown';
import AcademyBackground from '@/components/academy/AcademyBackground';
import { academyAdvisorApi, fileApi, type AdvisorCommentDto } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { getFaculty, getCatMajor, leafSemesterPlan } from '@/data/academyCatalog';

export const dynamic = 'force-dynamic';

type AdvisorLink = { label: string; url: string };
interface MarketStat { demand: number; salary: number; salaryRange: string; note: string; sources: AdvisorLink[]; }
interface AdvisorSpec {
  key: string; facultyId: string; majorId: string; comboId?: string;
  nameVi: string; icon: string; languages: string[]; builds: string[];
  products: string[]; pros: string[]; cons: string[];
  difficulty: number; demand: number; salary: number; salaryRange: string;
  academyCourses: string[]; codeSample?: { language: string; label: string; code: string };
  reports: AdvisorLink[];
  vietnam: MarketStat; global: MarketStat; hiring: AdvisorLink[];
}
interface QGroup { group: string; icon: string; questions: string[]; }
type ChatMsg = { role: 'user' | 'assistant'; content: string };
type Market = 'vietnam' | 'global';

const METERS: { key: 'demand' | 'salary'; label: string; color: string }[] = [
  { key: 'demand', label: 'Nhu cầu tuyển', color: '#22d3ee' },
  { key: 'salary', label: 'Mặt bằng lương', color: '#a3e635' },
];

function Meter({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="h-1.5 w-5 rounded-full" style={{ background: i <= value ? color : 'rgba(255,255,255,0.12)' }} />
      ))}
    </div>
  );
}

function displayName(u: { fullName?: string | null; displayName?: string | null; username: string }) {
  return u.displayName || u.fullName || u.username;
}
function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
}
function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'vừa xong';
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 2592000) return `${Math.floor(s / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

/* ── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({ url, name, size = 36 }: { url?: string | null; name: string; size?: number }) {
  if (url) return <img src={url} alt={name} className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  return (
    <span className="rounded-full shrink-0 grid place-items-center bg-neon-violet/20 text-neon-violet font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}>{initials(name)}</span>
  );
}

/* ── Thẻ so sánh 1 ngành hẹp (theo thị trường đang chọn) ─────────────────── */
function SpecCard({ spec, market }: { spec: AdvisorSpec; market: Market }) {
  const m = spec[market];
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span aria-hidden className="text-3xl leading-none">{spec.icon}</span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-text-primary leading-tight">{spec.nameVi}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {spec.languages.map((l) => (
              <span key={l} className="px-2 py-0.5 rounded-full bg-neon-violet/10 text-neon-violet text-[11px] font-medium">{l}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {METERS.map((mt) => (
          <div key={mt.key} className="flex items-center justify-between gap-3">
            <span className="text-xs text-text-muted">{mt.label}</span>
            <Meter value={m[mt.key]} color={mt.color} />
          </div>
        ))}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-text-muted">Độ khó</span>
          <Meter value={spec.difficulty} color="#f0abfc" />
        </div>
        <p className="text-sm text-text-secondary pt-1">💰 <span className="text-text-primary font-semibold">{m.salaryRange}</span></p>
        <p className="text-xs text-text-muted italic leading-relaxed">“{m.note}”</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Làm ra được</p>
        <div className="flex flex-wrap gap-1.5">
          {spec.builds.map((b) => <span key={b} className="px-2 py-0.5 rounded-lg bg-darkbg border border-darkborder text-xs text-text-secondary">{b}</span>)}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Sản phẩm nổi tiếng dùng hướng này</p>
        <p className="text-sm text-text-secondary">{spec.products.join(' · ')}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold text-neon-green mb-1">Ưu điểm</p>
          <ul className="text-xs text-text-secondary space-y-0.5 list-disc list-inside">{spec.pros.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-neon-pink mb-1">Nhược điểm</p>
          <ul className="text-xs text-text-secondary space-y-0.5 list-disc list-inside">{spec.cons.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </div>

      {spec.codeSample && (
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Cú pháp — {spec.codeSample.label}</p>
          <div className="rounded-xl overflow-hidden border border-darkborder text-[13px]">
            <SyntaxHighlighter language={spec.codeSample.language} style={vscDarkPlus} customStyle={{ margin: 0, background: '#0b1020', padding: '12px 14px' }}>
              {spec.codeSample.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Môn Academy tiêu biểu</p>
          <div className="flex flex-wrap gap-1.5">
            {spec.academyCourses.map((c) => <span key={c} className="px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-[11px] font-mono">{c}</span>)}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted mb-1 inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> Nơi thường tuyển</p>
          <div className="flex flex-wrap gap-1.5">
            {spec.hiring.map((h) => (
              <a key={h.url} href={h.url} target="_blank" rel="noopener noreferrer"
                className="px-2 py-0.5 rounded-lg bg-darkbg border border-darkborder text-[11px] text-neon-cyan hover:border-neon-cyan/50 transition inline-flex items-center gap-1">
                {h.label} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-1 border-t border-darkborder">
        <p className="text-xs uppercase tracking-wide text-text-muted mb-1 mt-2">📊 Nguồn thống kê ({market === 'vietnam' ? 'Việt Nam' : 'Toàn cầu'})</p>
        <div className="flex flex-wrap gap-1.5">
          {m.sources.map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-lg bg-darkbg border border-darkborder text-[11px] text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/50 transition inline-flex items-center gap-1">
              {r.label} <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Một bình luận ──────────────────────────────────────────────────────── */
function CommentView({ c, currentUserId, liked, likedIds, onLike, onReport, onDelete, onReply, isReply }: {
  c: AdvisorCommentDto; currentUserId?: number; liked?: boolean; likedIds?: Set<number>;
  onLike: (id: number) => void; onReport: (id: number) => void; onDelete: (id: number) => void;
  onReply?: (c: AdvisorCommentDto) => void; isReply?: boolean;
}) {
  const name = displayName(c.user);
  const mine = currentUserId === c.user.id;
  return (
    <div className={`flex gap-3 ${isReply ? 'ml-10' : ''}`}>
      <Avatar url={c.user.avatarUrl} name={name} size={isReply ? 30 : 38} />
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-sm bg-darkbg/70 border border-darkborder px-3.5 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-text-primary">{name}</span>
            <span className="text-xs text-text-muted">{timeAgo(c.createdAt)}</span>
            {c.isEdited && <span className="text-[10px] text-text-muted">(đã sửa)</span>}
          </div>
          {c.content && <p className="text-sm text-text-secondary whitespace-pre-wrap mt-1 leading-relaxed break-words">{c.content}</p>}
          {c.imageUrl && (
            <a href={c.imageUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
              <img src={c.imageUrl} alt="ảnh đính kèm" className="rounded-xl max-h-72 border border-darkborder" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1.5 px-1 text-xs text-text-muted">
          <button onClick={() => onLike(c.id)} className={`inline-flex items-center gap-1 transition ${liked ? 'text-neon-pink' : 'hover:text-neon-pink'}`}>
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} /> {c.likesCount > 0 && c.likesCount}
          </button>
          {!isReply && onReply && (
            <button onClick={() => onReply(c)} className="inline-flex items-center gap-1 hover:text-neon-violet transition">
              <MessageCircle className="w-3.5 h-3.5" /> Trả lời
            </button>
          )}
          <button onClick={() => onReport(c.id)} className="inline-flex items-center gap-1 hover:text-amber-400 transition">
            <Flag className="w-3.5 h-3.5" /> Báo cáo
          </button>
          {mine && (
            <button onClick={() => onDelete(c.id)} className="inline-flex items-center gap-1 hover:text-red-400 transition">
              <Trash2 className="w-3.5 h-3.5" /> Xoá
            </button>
          )}
        </div>
        {c.replies && c.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {c.replies.map((r) => (
              <CommentView key={r.id} c={r} currentUserId={currentUserId} liked={likedIds?.has(r.id)} likedIds={likedIds} onLike={onLike} onReport={onReport} onDelete={onDelete} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Khu thảo luận (bình luận) ──────────────────────────────────────────── */
function DiscussionSection({ facultyId, majorId }: { facultyId: string; majorId: string | null }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [comments, setComments] = useState<AdvisorCommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [replyTo, setReplyTo] = useState<AdvisorCommentDto | null>(null);
  const [sending, setSending] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(() => {
    if (!facultyId) return;
    setLoading(true);
    academyAdvisorApi.getComments(facultyId, majorId)
      .then((res) => setComments(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [facultyId, majorId]);
  useEffect(() => { load(); }, [load]);

  const total = useMemo(() => comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0), [comments]);

  function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast.error('Chỉ nhận file ảnh.'); return; }
    if (f.size > 8 * 1024 * 1024) { toast.error('Ảnh tối đa 8MB.'); return; }
    setImage({ file: f, preview: URL.createObjectURL(f) });
  }

  async function submit() {
    if (!isAuthenticated) { toast.error('Đăng nhập để tham gia thảo luận nhé.'); router.push('/login?redirect=/academy/tu-van-nganh'); return; }
    if (!text.trim() && !image) return;
    setSending(true);
    try {
      let imageUrl: string | undefined;
      if (image) {
        const up = await fileApi.upload(image.file);
        imageUrl = (up.data as { data?: { url?: string } })?.data?.url;
      }
      await academyAdvisorApi.postComment({
        facultyId, majorId, content: text.trim(), imageUrl, parentId: replyTo?.id ?? null,
      });
      setText(''); setImage(null); setReplyTo(null);
      load();
      toast.success('Đã đăng bình luận.');
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Không đăng được, thử lại nhé.');
    } finally {
      setSending(false);
    }
  }

  async function like(id: number) {
    if (!isAuthenticated) { toast.error('Đăng nhập để thích bình luận.'); return; }
    const wasLiked = likedIds.has(id);
    const delta = wasLiked ? -1 : 1;
    // optimistic: đổi trạng thái + số đếm theo hướng toggle
    setLikedIds((prev) => { const n = new Set(prev); if (wasLiked) n.delete(id); else n.add(id); return n; });
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, likesCount: Math.max(0, c.likesCount + delta) }
      : { ...c, replies: c.replies?.map((r) => r.id === id ? { ...r, likesCount: Math.max(0, r.likesCount + delta) } : r) }));
    try {
      const res = await academyAdvisorApi.likeComment(id);
      const { liked, likesCount } = res.data.data;
      setLikedIds((prev) => { const n = new Set(prev); if (liked) n.add(id); else n.delete(id); return n; });
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, likesCount }
        : { ...c, replies: c.replies?.map((r) => r.id === id ? { ...r, likesCount } : r) }));
    } catch { load(); }
  }
  async function report(id: number) {
    if (!isAuthenticated) { toast.error('Đăng nhập để báo cáo.'); return; }
    try { await academyAdvisorApi.reportComment(id); toast.success('Đã gửi báo cáo. Cảm ơn bạn!'); }
    catch (e: unknown) { toast.error((e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Không gửi được báo cáo.'); }
  }
  async function del(id: number) {
    try { await academyAdvisorApi.deleteComment(id); setComments((prev) => prev.filter((c) => c.id !== id).map((c) => ({ ...c, replies: c.replies?.filter((r) => r.id !== id) }))); toast.success('Đã xoá.'); }
    catch { toast.error('Không xoá được.'); }
  }

  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-1">
        💬 Thảo luận &amp; đánh giá <span className="text-sm font-normal text-text-muted">({total})</span>
      </h2>
      <p className="text-xs text-text-muted mb-4">Chia sẻ trải nghiệm, góp ý, đặt câu hỏi cho cộng đồng. Lịch sự &amp; đúng chủ đề nhé.</p>

      {/* Compose */}
      <div className="flex gap-3 mb-6">
        <Avatar url={user?.avatarUrl} name={user ? displayName({ username: user.username ?? 'Bạn', displayName: user.displayName, fullName: user.fullName }) : 'Bạn'} size={38} />
        <div className="flex-1 min-w-0">
          {replyTo && (
            <div className="mb-2 text-xs text-text-muted inline-flex items-center gap-2 bg-darkbg rounded-lg px-2 py-1">
              Đang trả lời <span className="text-text-secondary font-medium">{displayName(replyTo.user)}</span>
              <button onClick={() => setReplyTo(null)}><X className="w-3 h-3" /></button>
            </div>
          )}
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
            placeholder={isAuthenticated ? 'Viết bình luận, đánh giá hoặc góp ý…' : 'Đăng nhập để tham gia thảo luận…'}
            className="w-full resize-none rounded-xl bg-darkbg border border-darkborder px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
          {image && (
            <div className="relative inline-block mt-2">
              <img src={image.preview} alt="xem trước" className="rounded-lg max-h-40 border border-darkborder" />
              <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-darkbg border border-darkborder rounded-full p-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-neon-cyan transition">
              <ImagePlus className="w-4 h-4" /> Ảnh
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
            <button onClick={submit} disabled={sending || (!text.trim() && !image)}
              className="inline-flex items-center gap-2 min-h-[38px] px-4 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium disabled:opacity-40 transition">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Gửi
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-sm text-text-muted inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải bình luận…</div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ! ✨</p>
      ) : (
        <div className="space-y-5">
          {comments.map((c) => (
            <CommentView key={c.id} c={c} currentUserId={user?.id} liked={likedIds.has(c.id)} likedIds={likedIds} onLike={like} onReport={report} onDelete={del} onReply={setReplyTo} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AcademyAdvisorPage() {
  const router = useRouter();
  const params = useSearchParams();
  const facultyId = params.get('faculty');
  const majorId = params.get('major');
  const { isAuthenticated } = useAuthStore();

  const faculty = getFaculty(facultyId);
  const major = getCatMajor(facultyId, majorId);

  const [catalog, setCatalog] = useState<{ specs: AdvisorSpec[]; questions: QGroup[] } | null>(null);
  const [faq, setFaq] = useState<{ text: string; askCount: number }[]>([]);
  const [market, setMarket] = useState<Market>('vietnam');
  const [semester, setSemester] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    academyAdvisorApi.getCatalog()
      .then((res) => setCatalog(res.data.data as unknown as { specs: AdvisorSpec[]; questions: QGroup[] }))
      .catch(() => toast.error('Không tải được dữ liệu tư vấn.'));
  }, []);

  const loadFaq = useCallback(() => {
    if (!facultyId) return;
    academyAdvisorApi.getFaq(facultyId, majorId).then((res) => setFaq(res.data.data)).catch(() => {});
  }, [facultyId, majorId]);
  useEffect(() => { loadFaq(); }, [loadFaq]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const specs = useMemo(() => {
    const all = catalog?.specs ?? [];
    if (!facultyId) return all;
    return all.filter((s) => s.facultyId === facultyId);
  }, [catalog, facultyId]);
  const hasSpecData = specs.length > 0;

  const completedCourses = useMemo(() => {
    if (!semester) return [];
    const plan = leafSemesterPlan(facultyId, majorId, null);
    const codes: string[] = [];
    for (const { semester: s, codes: cs } of plan) if (s <= semester) for (const c of cs) if (!/_(COM|GRA)/.test(c)) codes.push(c);
    return [...new Set(codes)];
  }, [facultyId, majorId, semester]);

  const chartData = useMemo(
    () => specs.map((s) => ({ name: s.nameVi.split('(')[0].trim().slice(0, 16), 'Nhu cầu': s[market].demand, 'Lương': s[market].salary })),
    [specs, market],
  );

  const ask = useCallback(async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    if (!isAuthenticated) { toast.error('Đăng nhập để chat với CuongMini nhé.'); router.push('/login?redirect=/academy/tu-van-nganh'); return; }
    chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setInput('');
    const next = [...messages, { role: 'user' as const, content: q }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await academyAdvisorApi.ask({
        question: q, facultyId, majorId, semester, completedCourses,
        facultyName: faculty?.nameVi, majorName: major?.nameVi,
        history: messages.slice(-8),
      });
      setMessages([...next, { role: 'assistant', content: res.data.data.answer }]);
      setTimeout(loadFaq, 800); // câu vừa hỏi có thể xuất hiện ở FAQ
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error
        || (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'CuongMini đang bận, thử lại sau nhé.';
      toast.error(msg);
      setMessages(messages);
    } finally {
      setBusy(false);
    }
  }, [busy, isAuthenticated, messages, facultyId, majorId, semester, completedCourses, faculty, major, router, loadFaq]);

  const backToChoose = () => router.push(`/academy?tuvan=${facultyId ?? ''}.${majorId ?? ''}`);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#050314' }}>
      <AcademyBackground />
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={backToChoose} className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-xl border border-darkborder bg-darkcard text-text-primary hover:border-neon-violet/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet">
              <ArrowLeft className="w-4 h-4" /> Quay lại chọn ngành hẹp
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-neon-violet shrink-0" /> Tư vấn chọn ngành hẹp
              </h1>
              {(faculty || major) && (
                <p className="text-sm text-text-muted truncate">
                  {faculty?.nameVi}{major ? ` · ${major.nameVi}` : ''} — {specs.length} ngành hẹp để cân nhắc
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Kỳ đang học */}
        <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary mr-1"><GraduationCap className="w-4 h-4 text-neon-cyan" /> Bạn đang học kỳ mấy?</span>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
              <button key={k} onClick={() => setSemester(semester === k ? 0 : k)}
                className={`min-w-[40px] min-h-[36px] px-2 rounded-lg text-sm font-medium border transition ${semester === k ? 'bg-neon-violet text-white border-neon-violet' : 'bg-darkbg text-text-secondary border-darkborder hover:border-neon-violet/50'}`}>
                Kỳ {k}
              </button>
            ))}
            {semester > 0 && completedCourses.length > 0 && (
              <span className="text-xs text-text-muted ml-1">→ đã học {completedCourses.length} môn, CuongMini sẽ nối kiến thức này cho bạn.</span>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_440px]">
          {/* CỘT TRÁI: so sánh & đánh giá */}
          <div className="space-y-6 order-2 lg:order-1 min-w-0">
            {!hasSpecData && (
              <div className="rounded-2xl border border-neon-cyan/30 bg-neon-cyan/5 p-5 text-sm text-text-secondary">
                <p className="text-text-primary font-semibold mb-1">Dữ liệu chi tiết đang được bổ sung cho khối này 🛠️</p>
                <p>Phần so sánh chi tiết (lương, nhu cầu, sản phẩm, cú pháp code) hiện tập trung ở khối <strong>Công nghệ thông tin</strong>. Bạn vẫn chat hỏi CuongMini bên phải để được tư vấn tổng quát cho khối {faculty?.nameVi ?? 'của bạn'} nhé.</p>
              </div>
            )}
            {hasSpecData && (<>
            {/* Tabs thị trường + biểu đồ */}
            <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <h2 className="text-lg font-semibold text-text-primary">So sánh &amp; đánh giá</h2>
                <div className="inline-flex rounded-xl border border-darkborder bg-darkbg p-0.5 text-sm">
                  <button onClick={() => setMarket('vietnam')} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${market === 'vietnam' ? 'bg-neon-violet text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                    <MapPin className="w-4 h-4" /> Việt Nam
                  </button>
                  <button onClick={() => setMarket('global')} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${market === 'global' ? 'bg-neon-violet text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                    <Globe2 className="w-4 h-4" /> Toàn cầu
                  </button>
                </div>
              </div>
              <p className="text-xs text-text-muted mb-3">Thang định tính 1–5 cho thị trường <strong>{market === 'vietnam' ? 'Việt Nam' : 'toàn cầu'}</strong>. Số &amp; lương chính xác xem nguồn thống kê trong mỗi thẻ.</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aa0b4' }} interval={0} angle={-12} textAnchor="end" height={54} />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#9aa0b4' }} />
                    <Tooltip contentStyle={{ background: '#0b1020', border: '1px solid #2a2f45', borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="Nhu cầu" radius={[4, 4, 0, 0]}>{chartData.map((_, i) => <Cell key={i} fill="#22d3ee" />)}<LabelList dataKey="Nhu cầu" position="top" fontSize={10} fill="#9aa0b4" /></Bar>
                    <Bar dataKey="Lương" radius={[4, 4, 0, 0]}>{chartData.map((_, i) => <Cell key={i} fill="#a3e635" />)}<LabelList dataKey="Lương" position="top" fontSize={10} fill="#9aa0b4" /></Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Thẻ từng ngành */}
            <div className="grid gap-5 xl:grid-cols-2">
              {specs.map((s) => <SpecCard key={s.key} spec={s} market={market} />)}
            </div>
            </>)}
          </div>

          {/* CỘT PHẢI: CuongMini Cố Vấn */}
          <div ref={chatRef} className="order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-neon-violet/30 bg-darkcard flex flex-col max-h-[calc(100vh-7rem)] shadow-[0_0_40px_-12px_rgba(139,92,246,0.35)]">
              <div className="px-4 py-3.5 border-b border-darkborder flex items-center gap-2.5 bg-gradient-to-r from-neon-violet/10 to-transparent rounded-t-2xl">
                <span className="text-xl leading-none">🤖</span>
                <div>
                  <p className="font-semibold text-text-primary leading-tight">CuongMini Cố Vấn</p>
                  <p className="text-[11px] text-text-muted">Trợ lý chọn ngành hẹp · trả lời theo dữ liệu thật</p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[320px]">
                {messages.length === 0 && (
                  <div className="text-sm text-text-secondary space-y-3">
                    <p>Chào bạn 👋 Mình là <strong className="text-text-primary">CuongMini</strong>, giúp bạn chọn ngành hẹp hợp với thế mạnh, thị trường và các môn bạn đã học. Bấm một câu hỏi gợi ý hoặc tự nhập nhé:</p>
                    {(catalog?.questions ?? []).map((g) => (
                      <div key={g.group}>
                        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">{g.icon} {g.group}</p>
                        <div className="space-y-1.5">
                          {g.questions.map((q) => (
                            <button key={q} onClick={() => ask(q)} disabled={busy}
                              className="block w-full text-left px-3 py-2 rounded-xl border border-darkborder bg-darkbg/60 text-[13px] text-text-secondary hover:border-neon-violet/50 hover:text-text-primary transition disabled:opacity-50">
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {messages.map((m, i) => (
                  m.role === 'user' ? (
                    <div key={i} className="ml-8 rounded-2xl rounded-br-sm bg-neon-violet/15 border border-neon-violet/30 px-3.5 py-2.5 text-[15px] text-text-primary">{m.content}</div>
                  ) : (
                    <div key={i} className="mr-1 rounded-2xl rounded-bl-sm bg-darkbg/70 border border-darkborder px-3.5 py-2.5 text-[15px] text-text-secondary academy-advisor-md leading-relaxed">
                      <Markdown mdx={m.content} />
                    </div>
                  )
                ))}
                {busy && <div className="mr-2 inline-flex items-center gap-2 text-sm text-text-muted"><Loader2 className="w-4 h-4 animate-spin" /> CuongMini đang suy nghĩ…</div>}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="p-3 border-t border-darkborder flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
                  rows={1}
                  placeholder="Hỏi CuongMini… (VD: mình giỏi toán nên chọn ngành nào?)"
                  className="flex-1 resize-none max-h-32 rounded-xl bg-darkbg border border-darkborder px-3.5 py-2.5 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                />
                <button type="submit" disabled={busy || !input.trim()}
                  className="min-h-[42px] w-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white disabled:opacity-40 transition">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Câu hỏi thường gặp */}
        {faq.length > 0 && (
          <div className="rounded-2xl border border-darkborder bg-darkcard p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-1"><HelpCircle className="w-5 h-5 text-neon-cyan" /> Câu hỏi thường gặp</h2>
            <p className="text-xs text-text-muted mb-4">Gộp từ câu các bạn đã hỏi CuongMini. Bấm để hỏi lại ngay.</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {faq.map((f) => (
                <button key={f.text} onClick={() => ask(f.text)} disabled={busy}
                  className="text-left px-4 py-3 rounded-xl border border-darkborder bg-darkbg/60 hover:border-neon-violet/50 hover:bg-darkbg transition disabled:opacity-50 group">
                  <span className="text-sm text-text-secondary group-hover:text-text-primary">{f.text}</span>
                  {f.askCount > 1 && <span className="ml-2 text-[11px] text-text-muted">· {f.askCount} lượt hỏi</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Thảo luận */}
        {facultyId && <DiscussionSection facultyId={facultyId} majorId={majorId} />}
      </div>
    </div>
  );
}

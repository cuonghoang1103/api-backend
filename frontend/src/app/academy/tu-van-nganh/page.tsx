'use client';

/**
 * Phòng tư vấn chọn NGÀNH HẸP bằng AI.
 *
 * Vào từ bước "chọn ngành hẹp" của onboarding (/academy) khi người dùng bấm
 * "Tôi chưa chọn ngành hẹp — gợi ý giúp tôi". Ở đây có:
 *  · Chat với cố vấn AI (neo vào dữ liệu ngành thật ở backend — không bịa số).
 *  · Câu hỏi GỢI Ý SẴN để bấm (khi chưa biết hỏi gì).
 *  · Chọn KỲ đang học → gửi kèm các môn đã học để AI nối kiến thức.
 *  · Thẻ SO SÁNH ngành hẹp + biểu đồ nhu cầu/lương + link báo cáo thị trường.
 *  · So sánh CÚ PHÁP code từng ngành (màu như VS Code).
 *  · Nút QUAY LẠI chỗ chọn ngành hẹp ban đầu.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send, Sparkles, ExternalLink, GraduationCap, Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import Markdown from '@/components/markdown/Markdown';
import AcademyBackground from '@/components/academy/AcademyBackground';
import { academyAdvisorApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { getFaculty, getCatMajor, leafSemesterPlan } from '@/data/academyCatalog';

// Dùng useSearchParams ở client → opt-out static để khỏi cần Suspense boundary.
export const dynamic = 'force-dynamic';

interface AdvisorSpec {
  key: string; facultyId: string; majorId: string; comboId?: string;
  nameVi: string; icon: string; languages: string[]; builds: string[];
  products: string[]; pros: string[]; cons: string[];
  difficulty: number; demand: number; salary: number; salaryRange: string;
  academyCourses: string[]; codeSample: { language: string; label: string; code: string };
  reports: { label: string; url: string }[];
}
interface QGroup { group: string; icon: string; questions: string[]; }
type ChatMsg = { role: 'user' | 'assistant'; content: string };

const METERS: { key: 'difficulty' | 'demand' | 'salary'; label: string; color: string }[] = [
  { key: 'demand', label: 'Nhu cầu tuyển (VN)', color: '#22d3ee' },
  { key: 'salary', label: 'Mặt bằng lương', color: '#a3e635' },
  { key: 'difficulty', label: 'Độ khó', color: '#f0abfc' },
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

function SpecCard({ spec }: { spec: AdvisorSpec }) {
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
        {METERS.map((m) => (
          <div key={m.key} className="flex items-center justify-between gap-3">
            <span className="text-xs text-text-muted">{m.label}</span>
            <Meter value={spec[m.key]} color={m.color} />
          </div>
        ))}
        <p className="text-xs text-text-secondary pt-1">💰 Lương tham khảo: <span className="text-text-primary font-medium">{spec.salaryRange}</span></p>
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

      <div>
        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Cú pháp — {spec.codeSample.label}</p>
        <div className="rounded-xl overflow-hidden border border-darkborder text-[13px]">
          <SyntaxHighlighter language={spec.codeSample.language} style={vscDarkPlus} customStyle={{ margin: 0, background: '#0b1020', padding: '12px 14px' }}>
            {spec.codeSample.code}
          </SyntaxHighlighter>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">Môn Academy tiêu biểu</p>
        <div className="flex flex-wrap gap-1.5">
          {spec.academyCourses.map((c) => <span key={c} className="px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-[11px] font-mono">{c}</span>)}
        </div>
      </div>
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
  const [semester, setSemester] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    academyAdvisorApi.getCatalog()
      .then((res) => setCatalog(res.data.data as unknown as { specs: AdvisorSpec[]; questions: QGroup[] }))
      .catch(() => toast.error('Không tải được dữ liệu tư vấn.'));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  // Các ngành hẹp liên quan đúng khối/ngành đã chọn (không thì tất cả).
  const specs = useMemo(() => {
    const all = catalog?.specs ?? [];
    const rel = all.filter((s) => (!facultyId || s.facultyId === facultyId) && (!majorId || s.majorId === majorId));
    return rel.length ? rel : all;
  }, [catalog, facultyId, majorId]);

  // Môn đã học tới KỲ đang chọn (khung ngành nền — dùng cho IT; khối khác chưa có nền chung).
  const completedCourses = useMemo(() => {
    if (!semester) return [];
    const plan = leafSemesterPlan(facultyId, majorId, null);
    const codes: string[] = [];
    for (const { semester: s, codes: cs } of plan) if (s <= semester) for (const c of cs) if (!/_(COM|GRA)/.test(c)) codes.push(c);
    return [...new Set(codes)];
  }, [facultyId, majorId, semester]);

  const chartData = useMemo(
    () => specs.map((s) => ({ name: s.nameVi.split('(')[0].trim().slice(0, 16), 'Nhu cầu': s.demand, 'Lương': s.salary, icon: s.icon })),
    [specs],
  );

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    if (!isAuthenticated) { toast.error('Đăng nhập để chat với cố vấn AI nhé.'); router.push('/login?redirect=/academy/tu-van-nganh'); return; }
    setInput('');
    const next = [...messages, { role: 'user' as const, content: q }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await academyAdvisorApi.ask({
        question: q, facultyId, majorId, semester, completedCourses,
        history: messages.slice(-8),
      });
      setMessages([...next, { role: 'assistant', content: res.data.data.answer }]);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error
        || (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Cố vấn AI đang bận, thử lại sau nhé.';
      toast.error(msg);
      setMessages(messages); // rollback câu hỏi vừa thêm
    } finally {
      setBusy(false);
    }
  }

  const backToChoose = () => router.push(`/academy?tuvan=${facultyId ?? ''}.${majorId ?? ''}`);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#050314' }}>
      <AcademyBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
              <span className="text-xs text-text-muted ml-1">→ đã học {completedCourses.length} môn, cố vấn sẽ nối kiến thức này cho bạn.</span>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* CỘT TRÁI: so sánh ngành hẹp */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Biểu đồ */}
            <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
              <h2 className="text-lg font-semibold text-text-primary mb-1">So sánh nhu cầu &amp; lương</h2>
              <p className="text-xs text-text-muted mb-3">Thang định tính 1–5 (thị trường VN). Số CHÍNH XÁC xem các báo cáo bên dưới mỗi ngành.</p>
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
              {specs.map((s) => <SpecCard key={s.key} spec={s} />)}
            </div>

            {/* Báo cáo thị trường */}
            {specs[0]?.reports?.length ? (
              <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-2">📈 Báo cáo thị trường &amp; lương (nguồn thật)</h3>
                <div className="flex flex-wrap gap-2">
                  {specs[0].reports.map((r) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-darkborder bg-darkbg text-sm text-neon-cyan hover:border-neon-cyan/50 transition">
                      {r.label} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* CỘT PHẢI: chat AI + câu hỏi gợi ý */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-neon-violet/30 bg-darkcard flex flex-col max-h-[calc(100vh-7rem)]">
              <div className="px-4 py-3 border-b border-darkborder flex items-center gap-2">
                <Bot className="w-5 h-5 text-neon-violet" />
                <p className="font-semibold text-text-primary">Cố vấn AI</p>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
                {messages.length === 0 && (
                  <div className="text-sm text-text-secondary space-y-3">
                    <p>Chào bạn 👋 Mình giúp bạn chọn ngành hẹp hợp với thế mạnh, thị trường và các môn bạn đã học. Bấm một câu hỏi gợi ý hoặc tự nhập nhé:</p>
                    {(catalog?.questions ?? []).map((g) => (
                      <div key={g.group}>
                        <p className="text-xs uppercase tracking-wide text-text-muted mb-1">{g.icon} {g.group}</p>
                        <div className="space-y-1.5">
                          {g.questions.map((q) => (
                            <button key={q} onClick={() => ask(q)} disabled={busy}
                              className="block w-full text-left px-3 py-2 rounded-xl border border-darkborder bg-darkbg/60 text-xs text-text-secondary hover:border-neon-violet/50 hover:text-text-primary transition disabled:opacity-50">
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
                    <div key={i} className="ml-6 rounded-2xl rounded-br-sm bg-neon-violet/15 border border-neon-violet/30 px-3 py-2 text-sm text-text-primary">{m.content}</div>
                  ) : (
                    <div key={i} className="mr-2 rounded-2xl rounded-bl-sm bg-darkbg/70 border border-darkborder px-3 py-2 text-sm text-text-secondary academy-advisor-md">
                      <Markdown mdx={m.content} />
                    </div>
                  )
                ))}
                {busy && <div className="mr-2 inline-flex items-center gap-2 text-sm text-text-muted"><Loader2 className="w-4 h-4 animate-spin" /> Cố vấn đang suy nghĩ…</div>}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="p-3 border-t border-darkborder flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
                  rows={1}
                  placeholder="Hỏi cố vấn… (VD: mình giỏi toán nên chọn ngành nào?)"
                  className="flex-1 resize-none max-h-32 rounded-xl bg-darkbg border border-darkborder px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                />
                <button type="submit" disabled={busy || !input.trim()}
                  className="min-h-[40px] w-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white disabled:opacity-40 transition">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

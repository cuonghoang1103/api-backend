'use client';

/**
 * /interview — setup wizard. Pick Domain → Track → Level → (optional) company
 * style, then start a STATIC self-assessment session. Low-chrome, composed:
 * this screen sets the expectation that the interview counts.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { History, ArrowRight, Loader2, ShieldCheck, Flame, Crown } from 'lucide-react';
import { INTERVIEW_ENABLED } from '@/lib/featureFlags';
import ParticleBackground from '@/components/repos/ParticleBackground';
import { interviewApi } from '@/lib/interview-api';
import type { TaxonomyResponse, TaxonomyTrack, CompanyProfile, InterviewLevel } from '@/types/interview';
import { LEVELS } from '@/types/interview';

const LEVEL_LABEL: Record<InterviewLevel, string> = {
  INTERN: 'Intern', FRESHER: 'Fresher', JUNIOR: 'Junior', MID: 'Middle', SENIOR: 'Senior', LEAD: 'Lead', PRINCIPAL: 'Principal',
};

export default function InterviewSetupPage() {
  const router = useRouter();
  const [tax, setTax] = useState<TaxonomyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [domainId, setDomainId] = useState<number | null>(null);
  const [track, setTrack] = useState<TaxonomyTrack | null>(null);
  const [level, setLevel] = useState<InterviewLevel>('MID');
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [numQuestions, setNumQuestions] = useState(6);
  const [language, setLanguage] = useState<'VI' | 'EN'>('VI');
  const [focusedMode, setFocusedMode] = useState(false);
  const [engineMode, setEngineMode] = useState<'STATIC' | 'HYBRID' | 'FULL_AI'>('STATIC');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!INTERVIEW_ENABLED) { router.replace('/'); return; }
    interviewApi
      .tracks()
      .then((res) => {
        const data = res.data.data;
        setTax(data);
        if (data.domains[0]) setDomainId(data.domains[0].id);
      })
      .catch(() => toast.error('Không tải được danh mục. Bạn đã đăng nhập chưa?'))
      .finally(() => setLoading(false));
  }, [router]);

  const domain = useMemo(() => tax?.domains.find((d) => d.id === domainId) ?? null, [tax, domainId]);

  const start = async () => {
    if (!track) { toast.warning('Chọn một track trước đã'); return; }
    setStarting(true);
    try {
      const res = await interviewApi.createSession({
        trackId: track.id, level, companyProfileId: company?.id ?? null, language, numQuestions, focusedMode,
        engineMode: tax?.aiAvailable ? engineMode : 'STATIC',
      });
      router.push(`/interview/session/${res.data.data.id}`);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không tạo được phiên phỏng vấn');
      setStarting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-darkbg text-slate-100 pt-16 overflow-hidden">
      <ParticleBackground density="medium" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">Mock Interview</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">Phòng luyện phỏng vấn</h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Một người phỏng vấn điềm tĩnh, công bằng sẽ hỏi bạn từng câu. Bạn trả lời, xem đáp án mẫu &amp; rubric, rồi tự chấm.
              Máy cũng chấm khách quan song song. Miễn phí, không cần AI.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Link href="/interview/drill" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors">
              <Flame className="w-4 h-4" /> Ôn tập
            </Link>
            <Link href="/interview/history" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-slate-100 transition-colors">
              <History className="w-4 h-4" /> Lịch sử
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
        ) : !tax || !tax.domains.length ? (
          <div className="rounded-xl border border-white/10 p-6 text-slate-400">
            Chưa có ngân hàng câu hỏi. Vui lòng quay lại sau hoặc báo admin.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Domain */}
            <Section step={1} title="Lĩnh vực">
              <div className="flex flex-wrap gap-2">
                {tax.domains.map((d) => (
                  <Chip key={d.id} active={d.id === domainId} onClick={() => { setDomainId(d.id); setTrack(null); }}>
                    {d.nameVi || d.name}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Track */}
            <Section step={2} title="Vị trí (track)">
              <div className="grid sm:grid-cols-2 gap-2">
                {domain?.tracks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrack(t)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all ${
                      track?.id === t.id
                        ? 'border-amber-500/60 bg-amber-500/10'
                        : 'border-white/10 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-semibold text-slate-100">{t.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.topics.length} chủ đề</div>
                  </button>
                ))}
                {!domain?.tracks.length && <p className="text-sm text-slate-400">Lĩnh vực này chưa có track.</p>}
              </div>
            </Section>

            {/* Level */}
            <Section step={3} title="Cấp độ">
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lv) => (
                  <Chip key={lv} active={lv === level} onClick={() => setLevel(lv)}>{LEVEL_LABEL[lv]}</Chip>
                ))}
              </div>
            </Section>

            {/* Company style (optional) */}
            <Section step={4} title="Phong cách công ty (tuỳ chọn)">
              <div className="flex flex-wrap gap-2">
                <Chip active={company === null} onClick={() => setCompany(null)}>Mặc định</Chip>
                {tax.companyProfiles.map((c) => (
                  <Chip key={c.id} active={company?.id === c.id} onClick={() => setCompany(c)}>{c.name}</Chip>
                ))}
              </div>
              {company && <p className="text-xs text-slate-400 mt-2 italic">{company.styleDescriptor}</p>}
            </Section>

            {/* Options */}
            <Section step={5} title="Tuỳ chọn">
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">Số câu</span>
                  <input type="range" min={3} max={12} value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="accent-amber-500" />
                  <span className="text-sm font-mono text-slate-100 w-6">{numQuestions}</span>
                </label>
                <div className="inline-flex rounded-lg border border-white/10 overflow-hidden">
                  {(['VI', 'EN'] as const).map((l) => (
                    <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-sm ${language === l ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'}`}>
                      {l === 'VI' ? 'Tiếng Việt' : 'English'}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={focusedMode} onChange={(e) => setFocusedMode(e.target.checked)} className="accent-amber-500" />
                  <ShieldCheck className="w-4 h-4" /> Focused Mode (chặn dán, đếm mất tập trung)
                </label>
              </div>
            </Section>

            {/* Engine mode — only when the backend has AI configured */}
            {tax.aiAvailable && (
              <Section step={6} title="Chế độ chấm">
                <div className="grid sm:grid-cols-3 gap-2">
                  {([
                    { id: 'STATIC', label: 'Tự chấm', desc: 'Bạn tự chấm + máy khách quan. 0 đồng, 0 AI.' },
                    { id: 'HYBRID', label: 'AI chấm', desc: 'AI chấm từng tiêu chí có dẫn chứng. Tốn token.' },
                    { id: 'FULL_AI', label: 'AI đầy đủ', desc: 'AI chấm + viết báo cáo chi tiết.' },
                  ] as const).map((m) => {
                    const locked = m.id !== 'STATIC' && !tax.aiAllowed;
                    return (
                      <button
                        key={m.id}
                        onClick={() => { if (locked) { router.push('/pro'); return; } setEngineMode(m.id); }}
                        className={`text-left px-4 py-3 rounded-xl border transition-all ${
                          engineMode === m.id && !locked ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10 hover:border-slate-500'
                        } ${locked ? 'opacity-80' : ''}`}
                      >
                        <div className="font-semibold text-slate-100 text-sm flex items-center gap-1.5">
                          {m.label}
                          {locked && <span className="inline-flex items-center gap-0.5 rounded bg-amber-400/15 px-1 py-0.5 text-[9px] font-semibold text-amber-300"><Crown className="w-2.5 h-2.5" /> PRO</span>}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{locked ? 'Nâng cấp Pro để dùng AI chấm điểm' : m.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Start */}
            <div className="pt-2">
              <button
                onClick={start}
                disabled={!track || starting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Bắt đầu phỏng vấn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full border border-white/10 text-xs font-mono flex items-center justify-center text-slate-400">{step}</span>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
        active ? 'border-amber-500/60 bg-amber-500/10 text-amber-300' : 'border-white/10 text-slate-400 hover:text-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

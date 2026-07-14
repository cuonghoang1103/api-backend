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
  const [tracks, setTracks] = useState<TaxonomyTrack[]>([]);
  const [topicIds, setTopicIds] = useState<number[]>([]);
  const [level, setLevel] = useState<InterviewLevel>('MID');
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [numQuestions, setNumQuestions] = useState(6);
  const [language, setLanguage] = useState<'VI' | 'EN'>('VI');
  const [focusedMode, setFocusedMode] = useState(false);
  const [engineMode, setEngineMode] = useState<'STATIC' | 'HYBRID' | 'FULL_AI'>('STATIC');
  const [personalize, setPersonalize] = useState(false);
  const [cv, setCv] = useState('');
  const [jd, setJd] = useState('');
  const [useProject, setUseProject] = useState(false);
  const [projectMd, setProjectMd] = useState('');
  const [projectName, setProjectName] = useState('');
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
  const totalQ = useMemo(() => tracks.reduce((s, t) => s + (t.questionCount ?? 0), 0), [tracks]);
  // Topics available from the selected tracks (for deep-dive selection).
  const availableTopics = useMemo(
    () => tracks.flatMap((t) => t.topics.map((tp) => ({ ...tp, trackName: t.name }))),
    [tracks],
  );
  // Effective question pool: selected topics if any, else the whole track(s).
  const effectiveQ = useMemo(() => {
    if (!topicIds.length) return totalQ;
    return availableTopics.filter((tp) => topicIds.includes(tp.id)).reduce((s, tp) => s + (tp.questionCount ?? 0), 0);
  }, [topicIds, availableTopics, totalQ]);

  // Drop topic selections that no longer belong to the chosen tracks.
  useEffect(() => {
    setTopicIds((prev) => prev.filter((id) => availableTopics.some((tp) => tp.id === id)));
  }, [availableTopics]);

  const toggleTrack = (t: TaxonomyTrack) => {
    setTracks((prev) => {
      const next = prev.some((x) => x.id === t.id) ? prev.filter((x) => x.id !== t.id) : [...prev, t];
      const q = next.reduce((s, x) => s + (x.questionCount ?? 0), 0);
      if (q > 0) setNumQuestions((n) => Math.max(3, Math.min(n, q)));
      return next;
    });
  };
  const toggleTopic = (id: number) => setTopicIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const start = async () => {
    if (!tracks.length) { toast.warning('Chọn ít nhất 1 vị trí'); return; }
    setStarting(true);
    try {
      const useProj = useProject && projectMd.trim();
      const usePersonalize = !useProj && personalize && (cv.trim() || jd.trim());
      const res = await interviewApi.createSession({
        trackId: tracks[0].id, trackIds: tracks.map((t) => t.id), level, companyProfileId: company?.id ?? null, language, numQuestions, focusedMode,
        engineMode: tax?.aiAvailable ? engineMode : 'STATIC',
        ...(topicIds.length ? { topicIds } : {}),
        ...(useProj ? { projectMd: projectMd.trim() } : usePersonalize ? { cv: cv.trim() || undefined, jd: jd.trim() || undefined } : {}),
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
                  <Chip key={d.id} active={d.id === domainId} onClick={() => setDomainId(d.id)}>
                    {d.nameVi || d.name}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Track */}
            <Section step={2} title="Vị trí — chọn 1 hoặc nhiều (gộp lĩnh vực)">
              <div className="grid sm:grid-cols-2 gap-2">
                {domain?.tracks.map((t) => {
                  const qc = t.questionCount ?? 0;
                  const on = tracks.some((x) => x.id === t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTrack(t)}
                      className={`text-left px-4 py-3 rounded-xl border transition-all ${
                        on ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${on ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-white/20'}`}>{on ? '✓' : ''}</span>
                        {t.name}
                      </div>
                      <div className="text-xs mt-0.5 flex items-center gap-2 pl-6">
                        <span className="text-slate-400">{t.topics.length} chủ đề</span>
                        {qc > 0 ? <span className="text-emerald-400">· {qc} câu hỏi</span> : <span className="text-amber-400/90">· chưa có câu hỏi</span>}
                      </div>
                    </button>
                  );
                })}
                {!domain?.tracks.length && <p className="text-sm text-slate-400">Lĩnh vực này chưa có track.</p>}
              </div>
              {tracks.length > 0 && (
                <p className="text-xs text-slate-400 mt-2">
                  Đã chọn <b className="text-amber-300">{tracks.length}</b> vị trí ({tracks.map((t) => t.name).join(', ')}) · tổng <b className="text-emerald-400">{totalQ}</b> câu hỏi.
                </p>
              )}
              {tracks.length > 0 && totalQ === 0 && (
                <p className="text-xs text-amber-300/90 mt-1">
                  Các vị trí đã chọn chưa có câu hỏi. Admin vào <b>/admin/interview</b> → chọn topic → <b>AI sinh câu hỏi</b> (Opus 4.8), hoặc chọn vị trí đã có câu hỏi.
                </p>
              )}
            </Section>

            {/* Phase F — deep-dive on specific topics (optional) */}
            {tracks.length > 0 && availableTopics.length > 0 && (
              <Section step={3} title="Chuyên sâu theo topic (tuỳ chọn)">
                <p className="text-xs text-slate-400 mb-2">
                  Bỏ trống = kiểm tra <b>toàn bộ</b> topic của vị trí đã chọn. Tick 1 hoặc vài topic (vd chỉ <b>OOP</b>) để <b>luyện chuyên sâu</b> đúng mảng đó.
                </p>
                <div className="grid sm:grid-cols-2 gap-1.5">
                  {availableTopics.map((tp) => {
                    const on = topicIds.includes(tp.id);
                    const qc = tp.questionCount ?? 0;
                    return (
                      <button
                        key={tp.id}
                        onClick={() => toggleTopic(tp.id)}
                        className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                          on ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10 hover:border-slate-500'
                        }`}
                      >
                        <span className={`inline-flex w-3.5 h-3.5 mr-2 rounded border items-center justify-center text-[9px] align-middle ${on ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-white/20'}`}>{on ? '✓' : ''}</span>
                        <span className="text-slate-100">{tp.name}</span>
                        <span className="text-slate-400"> · {tp.trackName}</span>
                        <span className={qc > 0 ? 'text-emerald-400' : 'text-amber-400/80'}> · {qc} câu</span>
                      </button>
                    );
                  })}
                </div>
                {topicIds.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2">Đang chuyên sâu <b className="text-amber-300">{topicIds.length}</b> topic · <b className="text-emerald-400">{effectiveQ}</b> câu hỏi.</p>
                )}
              </Section>
            )}

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
                  <input
                    type="range"
                    min={3}
                    max={Math.max(3, Math.min(effectiveQ || 12, 50))}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="accent-amber-500"
                  />
                  <span className="text-sm font-mono text-slate-100 w-8">{numQuestions}</span>
                  {effectiveQ > 0 && (
                    <span className="text-xs text-slate-500">(tối đa {Math.min(effectiveQ, 50)})</span>
                  )}
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

            {/* AI unavailable (kill-switch / maintenance / breaker open) → make it
                clear the interview still works fully in self-assessment mode. */}
            {!tax.aiAvailable && (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-200/90">
                Chấm điểm AI đang tạm nghỉ (bảo trì / không khả dụng). Buổi phỏng vấn vẫn chạy đầy đủ ở chế độ <b>Tự chấm</b> — câu hỏi, đáp án mẫu, máy chấm khách quan và báo cáo đều hoạt động bình thường, thuần ngôn ngữ bạn chọn.
              </div>
            )}

            {/* Personalize from CV/JD — Pro only */}
            {tax.aiAvailable && tax.aiAllowed && (
              <Section step={7} title="Cá nhân hoá theo CV/JD (tuỳ chọn)">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mb-2">
                  <input type="checkbox" checked={personalize} onChange={(e) => setPersonalize(e.target.checked)} className="accent-amber-500" />
                  Sinh câu hỏi bám theo CV và/hoặc mô tả công việc (JD)
                </label>
                {personalize && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">AI đọc CV/JD và tạo câu hỏi riêng cho bạn, chấm bằng AI đầy đủ. Dán văn bản bên dưới — nội dung không lưu lâu dài. Việc tạo có thể mất ~15–40s.</p>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-1">CV của bạn</div>
                      <textarea value={cv} onChange={(e) => setCv(e.target.value)} rows={5} placeholder="Dán nội dung CV (kinh nghiệm, kỹ năng, dự án)…" className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-100 text-sm focus:outline-none focus:border-amber-500/60 resize-y" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-1">Mô tả công việc — JD</div>
                      <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={4} placeholder="Dán JD của vị trí bạn ứng tuyển…" className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-100 text-sm focus:outline-none focus:border-amber-500/60 resize-y" />
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Phase 8 — project (.md) 2-round interview — Pro only */}
            {tax.aiAvailable && tax.aiAllowed && (
              <Section step={8} title="Phỏng vấn theo Project — upload .md (2 vòng)">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mb-2">
                  <input type="checkbox" checked={useProject} onChange={(e) => setUseProject(e.target.checked)} className="accent-amber-500" />
                  AI đọc cả file .md dự án của bạn và hỏi chuyên sâu (model Opus 4.8)
                </label>
                {useProject && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      <b>Vòng 1</b>: lý thuyết + hiểu code trong dự án. <b>Vòng 2</b>: chỉ code — implement/mở rộng/tối ưu/gỡ lỗi trong chính dự án. File .md càng chi tiết, câu hỏi càng sâu. Nội dung không lưu lâu dài · tạo có thể mất ~30–90s.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/40 text-amber-300 text-sm cursor-pointer hover:bg-amber-500/10">
                        <input
                          type="file"
                          accept=".md,.markdown,.txt,text/markdown,text/plain"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            if (f.size > 2 * 1024 * 1024) { toast.error('File quá lớn (tối đa 2MB)'); return; }
                            const text = await f.text();
                            setProjectMd(text);
                            setProjectName(f.name);
                            e.target.value = '';
                          }}
                        />
                        Chọn file .md
                      </label>
                      {projectName && (
                        <span className="text-xs text-slate-300">{projectName} · {(projectMd.length / 1024).toFixed(1)} KB
                          <button onClick={() => { setProjectMd(''); setProjectName(''); }} className="ml-2 text-red-400 hover:underline">xoá</button>
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-1">…hoặc dán nội dung .md</div>
                      <textarea value={projectMd} onChange={(e) => { setProjectMd(e.target.value); if (!projectName) setProjectName('(dán tay)'); }} rows={6} placeholder="Dán toàn bộ tài liệu dự án (README, kiến trúc, quyết định kỹ thuật…)" className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-500/60 resize-y" />
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Start */}
            <div className="pt-2">
              <button
                onClick={start}
                disabled={!tracks.length || starting}
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

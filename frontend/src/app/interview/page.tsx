'use client';

/**
 * /interview — setup wizard. Pick Domain → Track → Level → (optional) company
 * style, then start a STATIC self-assessment session. Low-chrome, composed:
 * this screen sets the expectation that the interview counts.
 *
 * UI language: fully bilingual VI/EN via interview-i18n (makeT). The toggle in
 * the header switches the WHOLE page realtime (labels + catalog names via
 * nameVi/name), persisted in localStorage. Default VI. This is separate from
 * the interview CONTENT language (`language` state) sent to the API — though
 * picking a content language for the first time nudges the UI to match.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { History, ArrowRight, Loader2, ShieldCheck, Flame, Crown } from 'lucide-react';
import { INTERVIEW_ENABLED } from '@/lib/featureFlags';
import ParticleBackground from '@/components/repos/ParticleBackground';
import { interviewApi } from '@/lib/interview-api';
import { makeT, type ILang } from '@/lib/interview-i18n';
import type { TaxonomyResponse, TaxonomyTrack, CompanyProfile, InterviewLevel } from '@/types/interview';
import { LEVELS } from '@/types/interview';

const LEVEL_LABEL: Record<InterviewLevel, string> = {
  INTERN: 'Intern', FRESHER: 'Fresher', JUNIOR: 'Junior', MID: 'Middle', SENIOR: 'Senior', LEAD: 'Lead', PRINCIPAL: 'Principal',
};

const UI_LANG_KEY = 'interview:uiLang';

/** Static strings we author ourselves (interview-i18n) may carry <b> markup. */
function Rich({ s }: { s: string }) {
  return <span dangerouslySetInnerHTML={{ __html: s }} />;
}

/** Escape dynamic values before interpolating them into Rich strings. */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
  const [needLogin, setNeedLogin] = useState(false);

  // ── UI language (VI default, persisted, realtime) ─────────────────────────
  const [uiLang, setUiLang] = useState<ILang>('VI');
  useEffect(() => {
    try {
      const saved = localStorage.getItem(UI_LANG_KEY);
      if (saved === 'EN' || saved === 'VI') setUiLang(saved);
    } catch { /* ignore */ }
  }, []);
  const switchUiLang = (l: ILang) => {
    setUiLang(l);
    try { localStorage.setItem(UI_LANG_KEY, l); } catch { /* ignore */ }
  };
  const t = makeT(uiLang);
  /** Catalog display name honouring the UI language (nameVi ⇄ name). */
  const dn = (x: { name: string; nameVi?: string | null }) => (uiLang === 'VI' ? (x.nameVi || x.name) : x.name);

  useEffect(() => {
    if (!INTERVIEW_ENABLED) { router.replace('/'); return; }
    interviewApi
      .tracks()
      .then((res) => {
        const data = res.data.data;
        setTax(data);
        if (data.domains[0]) setDomainId(data.domains[0].id);
      })
      .catch((e) => {
        const status = (e as { response?: { status?: number } })?.response?.status;
        if (status === 401) setNeedLogin(true);
        else {
          let lg: ILang = 'VI';
          try { const s = localStorage.getItem(UI_LANG_KEY); if (s === 'EN') lg = 'EN'; } catch { /* ignore */ }
          toast.error(makeT(lg)('tCatalogFail'));
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  // CV Builder integration (P9): when the user clicks "practice from this CV" in
  // /cv, the CV text is stashed in sessionStorage. Pre-fill the personalize flow
  // so their own CV seeds the questions, then clear the stash.
  const [fromCv, setFromCv] = useState(false);
  useEffect(() => {
    try {
      const stashed = sessionStorage.getItem('cvbuilder:interviewCv');
      if (stashed && stashed.trim()) {
        setCv(stashed);
        setPersonalize(true);
        setFromCv(true);
        sessionStorage.removeItem('cvbuilder:interviewCv');
      }
    } catch { /* sessionStorage unavailable — ignore */ }
  }, []);

  const domain = useMemo(() => tax?.domains.find((d) => d.id === domainId) ?? null, [tax, domainId]);
  const totalQ = useMemo(() => tracks.reduce((s, t) => s + (t.questionCount ?? 0), 0), [tracks]);
  // Topics available from the selected tracks (for deep-dive selection).
  const availableTopics = useMemo(
    () => tracks.flatMap((tr) => tr.topics.map((tp) => ({ ...tp, track: tr }))),
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

  const toggleTrack = (tr: TaxonomyTrack) => {
    setTracks((prev) => {
      const next = prev.some((x) => x.id === tr.id) ? prev.filter((x) => x.id !== tr.id) : [...prev, tr];
      const q = next.reduce((s, x) => s + (x.questionCount ?? 0), 0);
      if (q > 0) setNumQuestions((n) => Math.max(3, Math.min(n, q)));
      return next;
    });
  };
  const toggleTopic = (id: number) => setTopicIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const start = async () => {
    if (!tracks.length) { toast.warning(t('tPickTrack')); return; }
    setStarting(true);
    try {
      const useProj = useProject && projectMd.trim();
      const usePersonalize = !useProj && personalize && (cv.trim() || jd.trim());
      const res = await interviewApi.createSession({
        trackId: tracks[0].id, trackIds: tracks.map((tr) => tr.id), level, companyProfileId: company?.id ?? null, language, numQuestions, focusedMode,
        engineMode: tax?.aiAvailable ? engineMode : 'STATIC',
        ...(topicIds.length ? { topicIds } : {}),
        ...(useProj ? { projectMd: projectMd.trim() } : usePersonalize ? { cv: cv.trim() || undefined, jd: jd.trim() || undefined } : {}),
      });
      router.push(`/interview/session/${res.data.data.id}`);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || t('tCreateFail'));
      setStarting(false);
    }
  };

  // Section numbering is computed so hidden sections never leave gaps/dupes.
  let step = 0;
  const nextStep = () => ++step;

  return (
    <div className="relative min-h-screen bg-darkbg text-slate-100 pt-16 overflow-hidden">
      <ParticleBackground density="medium" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">{t('setupKicker')}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">{t('setupTitle')}</h1>
            <p className="text-slate-400 mt-2 max-w-xl">{t('setupIntro')}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            {/* UI language toggle — realtime, persisted */}
            <div className="inline-flex rounded-lg border border-white/10 overflow-hidden" role="group" aria-label="Display language">
              {(['VI', 'EN'] as const).map((lg) => (
                <button
                  key={lg}
                  onClick={() => switchUiLang(lg)}
                  className={`px-2.5 py-1 text-xs transition-colors ${uiLang === lg ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  {lg}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link href="/interview/drill" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors">
                <Flame className="w-4 h-4" /> {t('drillBtn')}
              </Link>
              <Link href="/interview/history" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-slate-100 transition-colors">
                <History className="w-4 h-4" /> {t('historyBtn')}
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> {t('loadingCatalog')}</div>
        ) : needLogin ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-8 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-xl font-bold text-slate-100 mb-1">{t('loginRequired')}</h2>
            <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto">{t('loginRequiredSub')}</p>
            <div className="flex items-center justify-center gap-3">
              <Link href={`/login?redirect=${encodeURIComponent('/interview')}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:opacity-90">
                {t('loginBtn')}
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white">
                {t('registerBtn')}
              </Link>
            </div>
          </div>
        ) : !tax || !tax.domains.length ? (
          <div className="rounded-xl border border-white/10 p-6 text-slate-400">{t('emptyBank')}</div>
        ) : (
          <div className="space-y-8">
            {/* Domain */}
            <Section step={nextStep()} title={t('stepDomain')}>
              <div className="flex flex-wrap gap-2">
                {tax.domains.map((d) => (
                  <Chip key={d.id} active={d.id === domainId} onClick={() => setDomainId(d.id)}>
                    {dn(d)}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Track */}
            <Section step={nextStep()} title={t('stepTrack')}>
              <div className="grid sm:grid-cols-2 gap-2">
                {domain?.tracks.map((tr) => {
                  const qc = tr.questionCount ?? 0;
                  const on = tracks.some((x) => x.id === tr.id);
                  return (
                    <button
                      key={tr.id}
                      onClick={() => toggleTrack(tr)}
                      className={`text-left px-4 py-3 rounded-xl border transition-all ${
                        on ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${on ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-white/20'}`}>{on ? '✓' : ''}</span>
                        {dn(tr)}
                      </div>
                      <div className="text-xs mt-0.5 flex items-center gap-2 pl-6">
                        <span className="text-slate-400">{t('topicsCount', { n: tr.topics.length })}</span>
                        {qc > 0 ? <span className="text-emerald-400">{t('qCount', { n: qc })}</span> : <span className="text-amber-400/90">{t('qNone')}</span>}
                      </div>
                    </button>
                  );
                })}
                {!domain?.tracks.length && <p className="text-sm text-slate-400">{t('noTracks')}</p>}
              </div>
              {tracks.length > 0 && (
                <p className="text-xs text-slate-400 mt-2">
                  <Rich s={t('tracksSelected', { n: `<b class="text-amber-300">${tracks.length}</b>`, names: esc(tracks.map((tr) => dn(tr)).join(', ')), q: `<b class="text-emerald-400">${totalQ}</b>` })} />
                </p>
              )}
              {tracks.length > 0 && totalQ === 0 && (
                <p className="text-xs text-amber-300/90 mt-1"><Rich s={t('tracksNoQuestions')} /></p>
              )}
            </Section>

            {/* Deep-dive on specific topics (optional) */}
            {tracks.length > 0 && availableTopics.length > 0 && (
              <Section step={nextStep()} title={t('stepTopics')}>
                <p className="text-xs text-slate-400 mb-2"><Rich s={t('topicsHint')} /></p>
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
                        <span className="text-slate-100">{dn(tp)}</span>
                        <span className="text-slate-400"> · {dn(tp.track)}</span>
                        <span className={qc > 0 ? 'text-emerald-400' : 'text-amber-400/80'}> {t('qShort', { n: qc })}</span>
                      </button>
                    );
                  })}
                </div>
                {topicIds.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2">
                    <Rich s={t('topicsSelected', { n: `<b class="text-amber-300">${topicIds.length}</b>`, q: `<b class="text-emerald-400">${effectiveQ}</b>` })} />
                  </p>
                )}
              </Section>
            )}

            {/* Level */}
            <Section step={nextStep()} title={t('stepLevel')}>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lv) => (
                  <Chip key={lv} active={lv === level} onClick={() => setLevel(lv)}>{LEVEL_LABEL[lv]}</Chip>
                ))}
              </div>
            </Section>

            {/* Company style (optional) */}
            <Section step={nextStep()} title={t('stepCompany')}>
              <div className="flex flex-wrap gap-2">
                <Chip active={company === null} onClick={() => setCompany(null)}>{t('companyDefault')}</Chip>
                {tax.companyProfiles.map((c) => (
                  <Chip key={c.id} active={company?.id === c.id} onClick={() => setCompany(c)}>{c.name}</Chip>
                ))}
              </div>
              {company && <p className="text-xs text-slate-400 mt-2 italic">{company.styleDescriptor}</p>}
            </Section>

            {/* Options */}
            <Section step={nextStep()} title={t('stepOptions')}>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{t('numQuestions')}</span>
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
                    <span className="text-xs text-slate-500">{t('maxN', { n: Math.min(effectiveQ, 50) })}</span>
                  )}
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">{t('contentLangLabel')}</span>
                  <span className="inline-flex rounded-lg border border-white/10 overflow-hidden">
                    {(['VI', 'EN'] as const).map((l) => (
                      <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-sm ${language === l ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'}`}>
                        {l === 'VI' ? 'Tiếng Việt' : 'English'}
                      </button>
                    ))}
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={focusedMode} onChange={(e) => setFocusedMode(e.target.checked)} className="accent-amber-500" />
                  <ShieldCheck className="w-4 h-4" /> {t('focusedMode')}
                </label>
              </div>
            </Section>

            {/* Engine mode — only when the backend has AI configured */}
            {tax.aiAvailable && (
              <Section step={nextStep()} title={t('stepEngine')}>
                <div className="grid sm:grid-cols-3 gap-2">
                  {([
                    { id: 'STATIC', label: t('engineStatic'), desc: t('engineStaticDesc') },
                    { id: 'HYBRID', label: t('engineHybrid'), desc: t('engineHybridDesc') },
                    { id: 'FULL_AI', label: t('engineFull'), desc: t('engineFullDesc') },
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
                        <div className="text-xs text-slate-400 mt-0.5">{locked ? t('engineLocked') : m.desc}</div>
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
                <Rich s={t('aiDown')} />
              </div>
            )}

            {/* From CV Builder (P9): the user's CV was pre-loaded into personalize. */}
            {fromCv && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
                {t('fromCvLoaded')}
                {(!tax.aiAvailable || !tax.aiAllowed) && <span className="mt-1 block text-xs text-amber-300/80">{t('fromCvProNote')}</span>}
              </div>
            )}

            {/* Personalize from CV/JD — Pro only */}
            {tax.aiAvailable && tax.aiAllowed && (
              <Section step={nextStep()} title={t('stepPersonalize')}>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mb-2">
                  <input type="checkbox" checked={personalize} onChange={(e) => setPersonalize(e.target.checked)} className="accent-amber-500" />
                  {t('personalizeToggle')}
                </label>
                {personalize && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">{t('personalizeHint')}</p>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-1">{t('yourCv')}</div>
                      <textarea value={cv} onChange={(e) => setCv(e.target.value)} rows={5} placeholder={t('cvPlaceholder')} className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-100 text-sm focus:outline-none focus:border-amber-500/60 resize-y" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-1">{t('jdLabel')}</div>
                      <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={4} placeholder={t('jdPlaceholder')} className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-100 text-sm focus:outline-none focus:border-amber-500/60 resize-y" />
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Project (.md) 2-round interview — Pro only */}
            {tax.aiAvailable && tax.aiAllowed && (
              <Section step={nextStep()} title={t('stepProject')}>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mb-2">
                  <input type="checkbox" checked={useProject} onChange={(e) => setUseProject(e.target.checked)} className="accent-amber-500" />
                  {t('projectToggle')}
                </label>
                {useProject && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400"><Rich s={t('projectHint')} /></p>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/40 text-amber-300 text-sm cursor-pointer hover:bg-amber-500/10">
                        <input
                          type="file"
                          accept=".md,.markdown,.txt,text/markdown,text/plain"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            if (f.size > 2 * 1024 * 1024) { toast.error(t('fileTooBig')); return; }
                            const text = await f.text();
                            setProjectMd(text);
                            setProjectName(f.name);
                            e.target.value = '';
                          }}
                        />
                        {t('chooseMd')}
                      </label>
                      {projectName && (
                        <span className="text-xs text-slate-300">{projectName} · {(projectMd.length / 1024).toFixed(1)} KB
                          <button onClick={() => { setProjectMd(''); setProjectName(''); }} className="ml-2 text-red-400 hover:underline">{t('removeFile')}</button>
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-1">{t('pasteMd')}</div>
                      <textarea value={projectMd} onChange={(e) => { setProjectMd(e.target.value); if (!projectName) setProjectName(t('pastedByHand')); }} rows={6} placeholder={t('pasteMdPlaceholder')} className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-500/60 resize-y" />
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
                {t('startInterview')}
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

'use client';

/**
 * /cv/import — the front door (Phase 2a: paste + JSON Resume).
 * Nobody retypes their career into a blank form: they already have a CV. Paste
 * it (or upload a JSON Resume), the deterministic parser produces a structured
 * DRAFT, and the user REVIEWS it side-by-side — original left, parsed right,
 * low-confidence fields flagged — before anything is written to the profile.
 * Import APPENDS; it never overwrites (contact/summary only on explicit opt-in).
 *
 * PDF/DOCX upload and GitHub import are later sub-phases and shown as "sắp có".
 */
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft, Loader2, ClipboardPaste, FileJson, FileText, Github,
  AlertTriangle, Trash2, Save, X, ChevronDown, ChevronRight,
} from 'lucide-react';
import { cvApi } from '@/lib/cv-api';
import type { ParsedDraft, ConfidenceFlag, DraftItem, GhCandidate } from '@/types/cv';

const inputCls =
  'w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm ' +
  'text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-color)] focus:outline-none';
const btnPrimary =
  'inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50';
const btnGhost =
  'inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-sm hover:bg-[var(--bg-primary)]';

const KIND_LABEL: Record<string, string> = {
  EXPERIENCE: 'Kinh nghiệm', PROJECT: 'Dự án', EDUCATION: 'Học vấn',
  OPEN_SOURCE: 'Open source', PUBLICATION: 'Ấn phẩm', AWARD: 'Giải thưởng', VOLUNTEER: 'Tình nguyện',
};

export default function CvImportPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'input' | 'review' | 'github'>('input');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  // GitHub import
  const [ghUsername, setGhUsername] = useState('');
  const [ghBusy, setGhBusy] = useState(false);
  const [ghCandidates, setGhCandidates] = useState<GhCandidate[] | null>(null);
  const [ghAdded, setGhAdded] = useState<Set<string>>(new Set());

  const ghSync = async () => {
    if (!ghUsername.trim()) { toast.error('Nhập username GitHub'); return; }
    setGhBusy(true);
    try {
      const r = await cvApi.githubSync(ghUsername.trim());
      setGhCandidates(r.data.data.candidates);
      if (r.data.data.candidates.length === 0) toast('Không thấy repo nào đủ "chất" để đưa vào CV.');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Quét GitHub thất bại');
    } finally { setGhBusy(false); }
  };
  const ghAdd = async (repo: GhCandidate) => {
    try {
      await cvApi.githubAdd(repo);
      setGhAdded((s) => new Set(s).add(repo.name));
      toast.success(`Đã thêm ${repo.name} vào hồ sơ`);
    } catch { toast.error('Không thêm được'); }
  };

  const [jobId, setJobId] = useState<number | null>(null);
  const [rawText, setRawText] = useState('');
  const [draft, setDraft] = useState<ParsedDraft | null>(null);
  const [flags, setFlags] = useState<ConfidenceFlag[]>([]);
  const [applyContact, setApplyContact] = useState(true);
  const [applySummary, setApplySummary] = useState(true);
  const [showRaw, setShowRaw] = useState(false);

  const enterReview = (job: { id: number; rawText?: string | null; parsedResult: ParsedDraft | null; confidenceFlags: ConfidenceFlag[] | null }) => {
    setJobId(job.id);
    setRawText(job.rawText ?? '');
    setDraft(job.parsedResult);
    setFlags(job.confidenceFlags ?? []);
    setMode('review');
  };

  const parsePaste = async () => {
    if (text.trim().length < 20) { toast.error('Dán nhiều nội dung hơn một chút'); return; }
    setBusy(true);
    try { enterReview((await cvApi.importPaste(text)).data.data); }
    catch { toast.error('Không phân tích được'); }
    finally { setBusy(false); }
  };

  const onJsonFile = async (file: File) => {
    setBusy(true);
    try {
      const parsed = JSON.parse(await file.text());
      enterReview((await cvApi.importJsonResume(parsed)).data.data);
    } catch {
      toast.error('File JSON Resume không hợp lệ');
    } finally { setBusy(false); }
  };

  const onCvFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error('File tối đa 10MB'); return; }
    setBusy(true);
    try {
      const job = (await cvApi.importUpload(file)).data.data;
      if (job.status === 'FAILED') { toast.error('Không đọc được file — có thể bị hỏng hoặc khoá mật khẩu'); return; }
      enterReview(job);
    } catch {
      toast.error('Tải file thất bại');
    } finally { setBusy(false); }
  };

  const commit = async () => {
    if (!jobId || !draft) return;
    setBusy(true);
    try {
      const res = await cvApi.commitImport(jobId, { applyContact, applySummary, draft });
      const c = res.data.data.counts;
      toast.success(`Đã nhập: ${c.items ?? 0} mục, ${c.skills ?? 0} kỹ năng`);
      router.push('/cv/profile');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Lưu thất bại');
    } finally { setBusy(false); }
  };

  // draft mutators (immutable)
  const patchContact = (k: keyof ParsedDraft['contact'], v: string) =>
    setDraft((d) => (d ? { ...d, contact: { ...d.contact, [k]: v } } : d));
  const removeItem = (i: number) => setDraft((d) => (d ? { ...d, items: d.items.filter((_, x) => x !== i) } : d));
  const removeBullet = (ii: number, bi: number) =>
    setDraft((d) => (d ? { ...d, items: d.items.map((it, x) => x === ii ? { ...it, bullets: it.bullets.filter((_, y) => y !== bi) } : it) } : d));
  const removeSkill = (i: number) => setDraft((d) => (d ? { ...d, skills: d.skills.filter((_, x) => x !== i) } : d));
  const removeLang = (i: number) => setDraft((d) => (d ? { ...d, languageSkills: d.languageSkills.filter((_, x) => x !== i) } : d));
  const removeCert = (i: number) => setDraft((d) => (d ? { ...d, certifications: d.certifications.filter((_, x) => x !== i) } : d));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <Link href="/cv" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> CV Builder
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Nhập CV</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Đã có CV rồi thì đừng gõ lại. Dán vào, máy sẽ tách thành cấu trúc để bạn <strong>duyệt trước khi lưu</strong>.
        </p>

        {mode === 'github' ? (
          <div className="mt-6">
            <button onClick={() => setMode('input')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">← Quay lại</button>
            <section className="mt-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-sm font-medium"><Github className="h-4 w-4" /> Nhập từ GitHub (repo công khai)</div>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">GitHub của bạn chính là bằng chứng. Máy chấm điểm repo theo độ "thật" — bỏ qua fork/tutorial/repo rỗng.</p>
              <div className="mt-3 flex gap-2">
                <input value={ghUsername} onChange={(e) => setGhUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ghSync()}
                  placeholder="username GitHub của bạn" className={inputCls} />
                <button onClick={ghSync} disabled={ghBusy} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                  {ghBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />} Quét repo
                </button>
              </div>
            </section>
            {ghCandidates && ghCandidates.length > 0 && (
              <div className="mt-3 space-y-2">
                {ghCandidates.map((r) => (
                  <div key={r.name} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{r.name}</span>
                        {r.language && <span className="rounded border border-[var(--border-color)] px-1.5 py-0.5 text-[11px] text-[var(--text-secondary)]">{r.language}</span>}
                        {r.stars > 0 && <span className="text-[11px] text-[var(--text-secondary)]">★{r.stars}</span>}
                        {r.hasReadme && <span className="text-[11px] text-emerald-500">README</span>}
                      </div>
                      {r.description && <div className="mt-0.5 text-sm text-[var(--text-secondary)]">{r.description}</div>}
                      {r.topics.length > 0 && <div className="mt-1 text-[11px] text-[var(--text-secondary)]">{r.topics.slice(0, 6).join(' · ')}</div>}
                    </div>
                    <button onClick={() => ghAdd(r)} disabled={ghAdded.has(r.name)}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs ${ghAdded.has(r.name) ? 'text-emerald-500' : 'bg-[var(--accent-color)] text-white hover:opacity-90'}`}>
                      {ghAdded.has(r.name) ? '✓ Đã thêm' : 'Thêm vào CV'}
                    </button>
                  </div>
                ))}
                <p className="text-xs text-[var(--text-secondary)]">Thêm xong, mở <Link href="/cv/intake" className="text-[var(--accent-color)]">chế độ phỏng vấn</Link> để AI moi ra điều repo chưa nói (cái khó, tác động, quy mô).</p>
              </div>
            )}
          </div>
        ) : mode === 'input' ? (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
            {/* Paste */}
            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-sm font-medium"><ClipboardPaste className="h-4 w-4" /> Dán nội dung CV</div>
              <textarea
                className={`${inputCls} mt-3 min-h-[280px] resize-y font-mono text-xs`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Dán toàn bộ text CV của bạn vào đây (Ctrl/Cmd+V). Máy nhận diện các mục Kinh nghiệm, Dự án, Học vấn, Kỹ năng, Ngoại ngữ…"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">{text.length} ký tự</span>
                <button className={btnPrimary} onClick={parsePaste} disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4 rotate-180" />} Phân tích
                </button>
              </div>
            </section>

            {/* Other sources */}
            <section className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 hover:border-[var(--accent-color)]">
                <FileJson className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium">Tải JSON Resume</div>
                  <div className="text-xs text-[var(--text-secondary)]">Chuẩn jsonresume.org (.json)</div>
                </div>
                <input type="file" accept="application/json,.json" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) onJsonFile(f); e.currentTarget.value = ''; }} />
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 hover:border-[var(--accent-color)]">
                <FileText className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium">Tải PDF / DOCX</div>
                  <div className="text-xs text-[var(--text-secondary)]">Bóc tách text + cảnh báo chữ ẩn / CV scan (≤ 10MB)</div>
                </div>
                <input type="file" accept="application/pdf,.pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) onCvFile(f); e.currentTarget.value = ''; }} />
              </label>

              <button onClick={() => setMode('github')} className="flex w-full items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-left hover:border-[var(--accent-color)]">
                <Github className="h-5 w-5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Kết nối GitHub</div>
                  <div className="text-xs text-[var(--text-secondary)]">Nhập username → chấm điểm repo công khai, gợi ý mục CV</div>
                </div>
              </button>

              <Link href="/cv/profile" className="block rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 hover:border-[var(--accent-color)]">
                <div className="text-sm font-medium">Bắt đầu từ trang trắng</div>
                <div className="text-xs text-[var(--text-secondary)]">Nhập tay trong trình chỉnh sửa hồ sơ</div>
              </Link>
            </section>
          </div>
        ) : draft ? (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]">
            {/* LEFT: raw source */}
            <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 lg:sticky lg:top-20 lg:self-start">
              <button className="flex w-full items-center justify-between text-sm font-medium" onClick={() => setShowRaw((s) => !s)}>
                <span>Văn bản gốc</span>
                {showRaw ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {(showRaw || true) && (
                <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[var(--bg-primary)] p-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                  {rawText || '(không có văn bản gốc)'}
                </pre>
              )}
            </section>

            {/* RIGHT: parsed, reviewable */}
            <section className="space-y-4">
              {flags.length > 0 && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                  <div className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" /> Máy không chắc ở vài chỗ — kiểm tra lại
                  </div>
                  <ul className="mt-1 list-disc pl-6 text-xs text-[var(--text-secondary)]">
                    {flags.map((f, i) => <li key={i}><span className="font-mono">{f.field}</span>: {f.reason}</li>)}
                  </ul>
                </div>
              )}

              {/* Contact */}
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Thông tin liên hệ</h3>
                  <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <input type="checkbox" checked={applyContact} onChange={(e) => setApplyContact(e.target.checked)} /> Áp dụng
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input className={inputCls} value={draft.contact.fullName ?? ''} onChange={(e) => patchContact('fullName', e.target.value)} placeholder="Họ tên" />
                  <input className={inputCls} value={draft.contact.headline ?? ''} onChange={(e) => patchContact('headline', e.target.value)} placeholder="Chức danh" />
                  <input className={inputCls} value={draft.contact.email ?? ''} onChange={(e) => patchContact('email', e.target.value)} placeholder="Email" />
                  <input className={inputCls} value={draft.contact.phone ?? ''} onChange={(e) => patchContact('phone', e.target.value)} placeholder="SĐT" />
                </div>
                {(draft.contact.links.github || draft.contact.links.linkedin || draft.contact.links.website) && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
                    {draft.contact.links.github && <span>GitHub: {draft.contact.links.github}</span>}
                    {draft.contact.links.linkedin && <span>· LinkedIn ✓</span>}
                    {draft.contact.links.website && <span>· Web: {draft.contact.links.website}</span>}
                  </div>
                )}
              </div>

              {/* Summary */}
              {draft.summary && (
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Tóm tắt</h3>
                    <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <input type="checkbox" checked={applySummary} onChange={(e) => setApplySummary(e.target.checked)} /> Áp dụng
                    </label>
                  </div>
                  <textarea className={`${inputCls} mt-2 min-h-[70px] resize-y`} value={draft.summary}
                    onChange={(e) => setDraft((d) => d ? { ...d, summary: e.target.value } : d)} />
                </div>
              )}

              {/* Items */}
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                <h3 className="text-sm font-semibold">Mục CV ({draft.items.length})</h3>
                <div className="mt-3 space-y-3">
                  {draft.items.map((it: DraftItem, i) => (
                    <div key={i} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="rounded bg-[var(--bg-card)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">{KIND_LABEL[it.kind] ?? it.kind}</span>
                          <div className="mt-1 text-sm font-medium">{it.title}</div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {[it.organization, [it.startDate, it.isCurrent ? 'nay' : it.endDate].filter(Boolean).join('–')].filter(Boolean).join(' · ')}
                            {it.gpa ? ` · GPA ${it.gpa}` : ''}
                          </div>
                        </div>
                        <button className="text-red-500 hover:opacity-80" onClick={() => removeItem(i)} title="Bỏ mục này"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      {it.bullets.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {it.bullets.map((b, bi) => (
                            <li key={bi} className="flex items-start gap-2 text-xs">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--text-secondary)]" />
                              <span className="flex-1">{b.text}</span>
                              <button className="text-red-500 hover:opacity-80" onClick={() => removeBullet(i, bi)}><X className="h-3 w-3" /></button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {draft.items.length === 0 && <p className="text-xs text-[var(--text-secondary)]">Không có mục nào — bạn có thể thêm tay sau khi lưu.</p>}
                </div>
              </div>

              {/* Skills / langs / certs */}
              {draft.skills.length > 0 && (
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                  <h3 className="text-sm font-semibold">Kỹ năng ({draft.skills.length})</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {draft.skills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1 text-xs">
                        {s.name}<button className="text-red-500 hover:opacity-80" onClick={() => removeSkill(i)}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {draft.languageSkills.length > 0 && (
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                  <h3 className="text-sm font-semibold">Ngoại ngữ</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {draft.languageSkills.map((l, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{l.language}{l.certName ? ` · ${l.certName} ${l.certScore ?? ''}` : l.proficiency ? ` · ${l.proficiency}` : ''}</span>
                        <button className="text-red-500 hover:opacity-80" onClick={() => removeLang(i)}><X className="h-3.5 w-3.5" /></button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {draft.certifications.length > 0 && (
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                  <h3 className="text-sm font-semibold">Chứng chỉ</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {draft.certifications.map((c, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{c.name}{c.issuer ? ` · ${c.issuer}` : ''}</span>
                        <button className="text-red-500 hover:opacity-80" onClick={() => removeCert(i)}><X className="h-3.5 w-3.5" /></button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pb-6">
                <button className={btnPrimary} onClick={commit} disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu vào hồ sơ gốc
                </button>
                <button className={btnGhost} onClick={() => setMode('input')}>Quay lại</button>
                <span className="text-xs text-[var(--text-secondary)]">Import chỉ <strong>bổ sung</strong>, không ghi đè dữ liệu cũ.</span>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}

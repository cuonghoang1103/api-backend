'use client';

/**
 * /cv/builder/[id] — the tailored-CV editor (Phase 11.2). A CvDocument is a
 * curated view of the master profile: pick which items go in THIS CV, its
 * template / market / language, then lint (saved as history) and export the
 * filtered subset.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, Download, ScanSearch, CheckCircle2, History } from 'lucide-react';
import { cvApi } from '@/lib/cv-api';
import CvPreview from '@/components/cv/CvPreview';
import type { CvDocumentDetail, CvProfile, CvLintResult } from '@/types/cv';

const inputCls = 'rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1.5 text-sm text-[var(--text-primary)]';
const TEMPLATES = [{ v: 'ats', l: 'ATS-Optimized' }, { v: 'technical', l: 'Technical' }, { v: 'vietnam', l: 'Vietnamese' }, { v: 'senior', l: 'Senior' }];
const LEVELS = ['STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];

export default function CvBuilderPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const docId = Number(id);
  const [doc, setDoc] = useState<CvDocumentDetail | null>(null);
  const [profile, setProfile] = useState<CvProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [lint, setLint] = useState<CvLintResult | null>(null);
  const [linting, setLinting] = useState(false);

  // form
  const [name, setName] = useState('');
  const [templateKey, setTemplateKey] = useState('ats');
  const [market, setMarket] = useState('VN');
  const [language, setLanguage] = useState('VI');
  const [level, setLevel] = useState('MID');
  const [selected, setSelected] = useState<Set<number>>(new Set()); // empty = all

  const load = useCallback(async () => {
    try {
      const [d, p] = await Promise.all([cvApi.getDoc(docId), cvApi.getProfile()]);
      const dd = d.data.data; setDoc(dd); setProfile(p.data.data);
      setName(dd.name); setTemplateKey(dd.templateKey ?? 'ats'); setMarket(dd.market); setLanguage(dd.language); setLevel(dd.experienceLevel);
      setSelected(new Set(dd.includedItemIds?.items ?? []));
    } catch (e) {
      if ((e as { response?: { status?: number } })?.response?.status === 401) router.replace('/login');
      else toast.error('Không tải được CV');
    } finally { setLoading(false); }
  }, [docId, router]);
  useEffect(() => { load(); }, [load]);

  const items = profile?.items ?? [];
  const toggle = (itemId: number) => setSelected((s) => { const n = new Set(s); n.has(itemId) ? n.delete(itemId) : n.add(itemId); return n; });
  // empty set OR all-selected → treat as "include all"
  const includeAll = selected.size === 0 || selected.size === items.length;

  const save = async () => {
    setSaving(true);
    try {
      await cvApi.updateDoc(docId, {
        name, templateKey, market, language, experienceLevel: level,
        includedItemIds: { items: includeAll ? [] : [...selected] },
      });
      toast.success('Đã lưu');
    } catch { toast.error('Lưu thất bại'); } finally { setSaving(false); }
  };

  const doLint = async () => {
    await save();
    setLinting(true);
    try { const r = await cvApi.lintDoc(docId); setLint(r.data.data); await load(); }
    catch { toast.error('Chấm thất bại'); } finally { setLinting(false); }
  };

  const download = async (fmt: 'pdf' | 'docx') => {
    await save();
    setExporting(fmt);
    try {
      const res = await cvApi.exportDoc(docId, fmt);
      const cd = (res.headers?.['content-disposition'] as string | undefined) ?? '';
      const fname = cd.match(/filename="(.+?)"/)?.[1] || `CV.${fmt}`;
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a'); a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Xuất thất bại');
    } finally { setExporting(null); }
  };

  if (loading) return <div className="min-h-screen bg-[var(--bg-primary)] pt-16"><div className="mx-auto max-w-3xl px-4 py-12 flex items-center gap-2 text-[var(--text-secondary)]"><Loader2 className="h-4 w-4 animate-spin" /> Đang tải…</div></div>;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Link href="/cv" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ArrowLeft className="h-4 w-4" /> CV Builder</Link>
        <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_460px]">
        <div>
        <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Tên bản CV" className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none" placeholder="Tên bản CV (Backend @ KMS)" />
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Bản CV riêng cho một công việc — chọn nội dung đưa vào, mẫu, thị trường, ngôn ngữ. Bản xem trước cập nhật trực tiếp bên phải.</p>

        {/* Settings */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <label className="text-xs text-[var(--text-secondary)]">Mẫu<select value={templateKey} onChange={(e) => setTemplateKey(e.target.value)} className={`${inputCls} mt-1 w-full`}>{TEMPLATES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select></label>
          <label className="text-xs text-[var(--text-secondary)]">Thị trường<select value={market} onChange={(e) => setMarket(e.target.value)} className={`${inputCls} mt-1 w-full`}><option value="VN">Việt Nam</option><option value="INTERNATIONAL">Quốc tế</option></select></label>
          <label className="text-xs text-[var(--text-secondary)]">Ngôn ngữ<select value={language} onChange={(e) => setLanguage(e.target.value)} className={`${inputCls} mt-1 w-full`}><option value="VI">Tiếng Việt</option><option value="EN">Tiếng Anh (dịch)</option></select></label>
          <label className="text-xs text-[var(--text-secondary)]">Cấp<select value={level} onChange={(e) => setLevel(e.target.value)} className={`${inputCls} mt-1 w-full`}>{LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}</select></label>
        </div>

        {/* Item selection */}
        <section className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          <div className="text-sm font-medium">Nội dung đưa vào bản CV này</div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Bỏ chọn mục không liên quan tới job này. (Không chọn gì = lấy tất cả.)</p>
          <div className="mt-3 space-y-1.5">
            {items.length === 0 && <p className="text-sm text-[var(--text-secondary)]">Hồ sơ gốc chưa có mục nào. <Link href="/cv/profile" className="text-[var(--accent-color)]">Thêm ở hồ sơ gốc</Link>.</p>}
            {items.map((it) => {
              const on = selected.size === 0 ? true : selected.has(it.id);
              return (
                <label key={it.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={on} onChange={() => { if (selected.size === 0) { setSelected(new Set(items.map((x) => x.id).filter((x) => x !== it.id))); } else { toggle(it.id); } }} />
                  <span className="text-[10px] rounded bg-[var(--bg-primary)] px-1.5 py-0.5 text-[var(--text-secondary)]">{it.kind}</span>
                  <span>{it.title}{it.organization ? ` · ${it.organization}` : ''}</span>
                  <span className="text-xs text-[var(--text-secondary)]">({it.bullets.length} dòng)</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm hover:bg-[var(--bg-card)]">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu</button>
          <button onClick={doLint} disabled={linting} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm hover:bg-[var(--bg-card)]">{linting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />} Chấm bản này</button>
          <button onClick={() => download('pdf')} disabled={exporting !== null} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">{exporting === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} PDF</button>
          <button onClick={() => download('docx')} disabled={exporting !== null} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm hover:bg-[var(--bg-card)]">{exporting === 'docx' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} DOCX</button>
        </div>

        {/* Lint result */}
        {lint && (
          <section className="mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-3"><span className="text-2xl font-semibold tabular-nums">{lint.score}</span><span className="text-sm text-[var(--text-secondary)]">/100 · {lint.band}</span></div>
            <div className="mt-1 text-xs text-[var(--text-secondary)]">{lint.counts.items} mục · {lint.counts.strongBullets} bullet mạnh · {lint.counts.weakBullets} yếu</div>
            {lint.issues.length > 0 && <ul className="mt-2 space-y-1 text-sm">{lint.issues.slice(0, 6).map((i, k) => <li key={k} className="text-[var(--text-secondary)]">• {i.problem}</li>)}</ul>}
          </section>
        )}

        {/* Review history (#3) */}
        {doc && doc.reviews.length > 0 && (
          <section className="mt-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-2 text-sm font-medium"><History className="h-4 w-4" /> Lịch sử chấm</div>
            <ul className="mt-2 space-y-1 text-sm">
              {doc.reviews.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>{new Date(r.createdAt).toLocaleString('vi-VN')} · {r.mode}</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {r.score}/100 · {r.verdict}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">Gắn nhãn kết quả thật (vd &quot;được KMS gọi&quot;) để so bản nào hiệu quả — sẽ thêm ở bản sau.</p>
          </section>
        )}
        </div>

        {/* Live preview (W1) — the preview is the hero */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Xem trước trực tiếp — mẫu {templateKey}</span>
            {language === 'EN' && <span className="text-[10px] text-[var(--text-secondary)]">Nội dung sẽ được AI dịch sang tiếng Anh khi tải xuống</span>}
          </div>
          {profile && (
            <CvPreview
              profile={profile}
              includedItemIds={includeAll ? null : [...selected]}
              templateKey={templateKey}
              market={market}
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

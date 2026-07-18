'use client';

/**
 * /cv/profile — the MASTER profile editor (Phase 1).
 * Framed as building a career record, not filling a form: this is the thing the
 * user maintains over years; individual CVs are just views of it. Structured
 * editing of contact, summary, preferences, items (jobs/projects/education/…),
 * their achievement bullets, skills, certifications and languages.
 *
 * Persistence model (P1, correctness over cleverness): every mutation calls the
 * API then re-fetches the whole profile. No optimistic UI yet — this phase just
 * proves the data round-trips cleanly.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft, Loader2, Plus, Trash2, Save, Pencil, X, Check,
  BadgeCheck, ShieldQuestion, GraduationCap, Briefcase, FolderGit2,
  Award as AwardIcon, BookText, Heart, Languages as LangIcon, Wrench, Sparkles,
} from 'lucide-react';
import { CV_BUILDER_ENABLED } from '@/lib/featureFlags';
import { cvApi } from '@/lib/cv-api';
import type {
  CvProfile, CvItem, CvItemKind, CvSkillCategory, CvExperienceLevel,
} from '@/types/cv';

// ─── Small shared UI ──────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm ' +
  'text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-color)] focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      {children}
    </label>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6">
      {children}
    </section>
  );
}

const btnPrimary =
  'inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-3.5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50';
const btnGhost =
  'inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-primary)]';
const btnDanger =
  'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-500/10';

// ─── Kind metadata ────────────────────────────────────────────────────────
const KIND_META: Record<CvItemKind, { label: string; icon: React.ElementType }> = {
  EXPERIENCE: { label: 'Kinh nghiệm làm việc', icon: Briefcase },
  PROJECT: { label: 'Dự án', icon: FolderGit2 },
  EDUCATION: { label: 'Học vấn', icon: GraduationCap },
  OPEN_SOURCE: { label: 'Open source', icon: FolderGit2 },
  PUBLICATION: { label: 'Ấn phẩm / Nghiên cứu', icon: BookText },
  AWARD: { label: 'Giải thưởng', icon: AwardIcon },
  VOLUNTEER: { label: 'Tình nguyện', icon: Heart },
};
const KIND_ORDER: CvItemKind[] = ['EXPERIENCE', 'PROJECT', 'OPEN_SOURCE', 'EDUCATION', 'PUBLICATION', 'AWARD', 'VOLUNTEER'];

const SKILL_CATS: { value: CvSkillCategory; label: string }[] = [
  { value: 'LANGUAGE', label: 'Ngôn ngữ' },
  { value: 'FRAMEWORK', label: 'Framework' },
  { value: 'DATABASE', label: 'Database' },
  { value: 'INFRA', label: 'Hạ tầng' },
  { value: 'TOOL', label: 'Công cụ' },
  { value: 'PRACTICE', label: 'Kỹ thuật/Practice' },
  { value: 'SOFT', label: 'Kỹ năng mềm' },
];
const SENIORITY: CvExperienceLevel[] = ['STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];

const monthValue = (iso: string | null): string => (iso ? iso.slice(0, 7) : '');

// ─── Page ─────────────────────────────────────────────────────────────────
export default function CvProfileEditorPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CvProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);

  const reload = useCallback(async () => {
    const res = await cvApi.getProfile();
    setProfile(res.data.data);
  }, []);

  useEffect(() => {
    if (!CV_BUILDER_ENABLED) { router.replace('/'); return; }
    cvApi
      .getProfile()
      .then((res) => setProfile(res.data.data))
      .catch((e) => {
        const status = (e as { response?: { status?: number } })?.response?.status;
        if (status === 401) setNeedLogin(true);
        else toast.error('Không tải được hồ sơ');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-12 text-[var(--text-secondary)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải hồ sơ…
        </div>
      </div>
    );
  }

  if (needLogin) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-sm text-[var(--text-secondary)]">Bạn cần đăng nhập để chỉnh sửa hồ sơ.</p>
          <Link href="/login" className={`${btnPrimary} mt-4`}>Đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-16">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link href="/cv" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> CV Builder
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Hồ sơ sự nghiệp gốc</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Ghi lại <em>tất cả</em> những gì bạn đã làm — kể cả thứ sẽ không lên mọi CV. Đây là nguồn sự thật;
          từng CV cụ thể chỉ chọn lọc từ đây.
        </p>

        {profile && (
          <div className="mt-6 space-y-6">
            <ContactSection profile={profile} onSaved={reload} />
            <ItemsSection profile={profile} onChanged={reload} />
            <SkillsSection profile={profile} onChanged={reload} />
            <CertsSection profile={profile} onChanged={reload} />
            <LangsSection profile={profile} onChanged={reload} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Contact + summary + preferences ──────────────────────────────────────
function ContactSection({ profile, onSaved }: { profile: CvProfile; onSaved: () => Promise<void> }) {
  const [f, setF] = useState({
    fullName: profile.fullName ?? '',
    headline: profile.headline ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    github: profile.links?.github ?? '',
    linkedin: profile.links?.linkedin ?? '',
    portfolio: profile.links?.portfolio ?? '',
    website: profile.links?.website ?? '',
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
    summary: profile.summary ?? '',
    targetRoles: (profile.targetRoles ?? []).join(', '),
    seniority: profile.seniority ?? '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await cvApi.updateProfile({
        fullName: f.fullName,
        headline: f.headline,
        email: f.email,
        phone: f.phone,
        location: f.location,
        links: { github: f.github, linkedin: f.linkedin, portfolio: f.portfolio, website: f.website },
        dateOfBirth: f.dateOfBirth || null,
        summary: f.summary,
        targetRoles: f.targetRoles.split(',').map((s) => s.trim()).filter(Boolean),
        seniority: (f.seniority || null) as CvExperienceLevel | null,
      });
      await onSaved();
      toast.success('Đã lưu hồ sơ');
    } catch {
      toast.error('Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="text-base font-semibold">Thông tin liên hệ</h2>

      {/* Photo (W5) — VN-market templates show a portrait; INTERNATIONAL strips it */}
      <div className="mt-3 flex items-center gap-3">
        {profile.photoR2Key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photoR2Key} alt="Ảnh CV" className="h-20 w-16 rounded object-cover" />
        ) : (
          <div className="flex h-20 w-16 items-center justify-center rounded border border-dashed border-[var(--border-color)] text-[10px] text-[var(--text-secondary)]">Chưa có ảnh</div>
        )}
        <div className="space-y-1.5">
          <label className={`${btnGhost} cursor-pointer`}>
            <Plus className="h-3.5 w-3.5" /> {profile.photoR2Key ? 'Đổi ảnh' : 'Thêm ảnh CV'}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0]; e.currentTarget.value = '';
                if (!f) return;
                try { await cvApi.uploadPhoto(f); await onSaved(); toast.success('Đã cập nhật ảnh'); }
                catch { toast.error('Tải ảnh thất bại (ảnh ≤5MB)'); }
              }} />
          </label>
          {profile.photoR2Key && (
            <button className={btnDanger} onClick={async () => { await cvApi.removePhoto(); await onSaved(); }}>
              <Trash2 className="h-3.5 w-3.5" /> Bỏ ảnh
            </button>
          )}
          <p className="text-[10px] text-[var(--text-secondary)]">Chỉ mẫu &quot;Vietnamese Standard&quot; in ảnh; CV quốc tế tự bỏ ảnh (đúng quy ước).</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Họ và tên"><input className={inputCls} value={f.fullName} onChange={set('fullName')} placeholder="Nguyễn Văn A" /></Field>
        <Field label="Chức danh"><input className={inputCls} value={f.headline} onChange={set('headline')} placeholder="Backend Engineer" /></Field>
        <Field label="Email"><input className={inputCls} value={f.email} onChange={set('email')} placeholder="you@email.com" /></Field>
        <Field label="Số điện thoại"><input className={inputCls} value={f.phone} onChange={set('phone')} placeholder="+84…" /></Field>
        <Field label="Địa điểm"><input className={inputCls} value={f.location} onChange={set('location')} placeholder="TP. Hồ Chí Minh" /></Field>
        <Field label="Ngày sinh (chỉ CV thị trường VN)"><input type="date" className={inputCls} value={f.dateOfBirth} onChange={set('dateOfBirth')} /></Field>
        <Field label="GitHub"><input className={inputCls} value={f.github} onChange={set('github')} placeholder="https://github.com/…" /></Field>
        <Field label="LinkedIn"><input className={inputCls} value={f.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/…" /></Field>
        <Field label="Portfolio"><input className={inputCls} value={f.portfolio} onChange={set('portfolio')} placeholder="https://…" /></Field>
        <Field label="Website"><input className={inputCls} value={f.website} onChange={set('website')} placeholder="https://…" /></Field>
      </div>

      <div className="mt-4">
        <Field label="Tóm tắt (professional summary)">
          <textarea className={`${inputCls} min-h-[90px] resize-y`} value={f.summary} onChange={set('summary')}
            placeholder="2–3 câu: bạn là ai, mạnh về gì, tìm vai trò nào. Không sáo rỗng." />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Vai trò mục tiêu (phân cách bằng dấu phẩy)">
          <input className={inputCls} value={f.targetRoles} onChange={set('targetRoles')} placeholder="Backend Engineer, SRE" />
        </Field>
        <Field label="Cấp độ">
          <select className={inputCls} value={f.seniority} onChange={set('seniority')}>
            <option value="">— chọn —</option>
            {SENIORITY.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <button className={btnPrimary} onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu hồ sơ
        </button>
      </div>
    </Card>
  );
}

// ─── Items (grouped by kind) + bullets ────────────────────────────────────
const emptyItemForm = (kind: CvItemKind) => ({
  kind,
  title: '',
  organization: '',
  location: '',
  url: '',
  techStack: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  gpa: '',
  context: '',
});
type ItemForm = ReturnType<typeof emptyItemForm>;

function ItemsSection({ profile, onChanged }: { profile: CvProfile; onChanged: () => Promise<void> }) {
  const [adding, setAdding] = useState<CvItemKind | null>(null);
  const grouped = KIND_ORDER
    .map((k) => ({ kind: k, items: profile.items.filter((i) => i.kind === k) }))
    .filter((g) => g.items.length > 0 || adding === g.kind);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Kinh nghiệm, dự án & học vấn</h2>
      </div>

      {grouped.length === 0 && adding === null && (
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Chưa có mục nào. Thêm kinh nghiệm, dự án hoặc học vấn để bắt đầu.
        </p>
      )}

      <div className="mt-4 space-y-6">
        {grouped.map((g) => {
          const Meta = KIND_META[g.kind];
          return (
            <div key={g.kind}>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                <Meta.icon className="h-4 w-4" /> {Meta.label}
              </div>
              <div className="space-y-3">
                {g.items.map((it) => <ItemRow key={it.id} item={it} onChanged={onChanged} />)}
                {adding === g.kind && (
                  <ItemForm
                    initial={emptyItemForm(g.kind)}
                    onCancel={() => setAdding(null)}
                    onSubmit={async (data) => { await cvApi.createItem(data); setAdding(null); await onChanged(); }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add buttons per kind */}
      {adding === null && (
        <div className="mt-5 flex flex-wrap gap-2">
          {KIND_ORDER.map((k) => (
            <button key={k} className={btnGhost} onClick={() => setAdding(k)}>
              <Plus className="h-3.5 w-3.5" /> {KIND_META[k].label}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

function toItemPayload(data: ItemForm) {
  return {
    kind: data.kind,
    title: data.title,
    organization: data.organization || null,
    location: data.location || null,
    url: data.url || null,
    techStack: data.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    startDate: data.startDate || null,
    endDate: data.isCurrent ? null : (data.endDate || null),
    isCurrent: data.isCurrent,
    gpa: data.gpa || null,
    context: data.context || null,
  };
}

function ItemForm({ initial, onSubmit, onCancel }: {
  initial: ItemForm;
  onSubmit: (data: ReturnType<typeof toItemPayload>) => Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = useState<ItemForm>(initial);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof ItemForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const submit = async () => {
    if (!f.title.trim()) { toast.error('Cần nhập tiêu đề'); return; }
    setBusy(true);
    try { await onSubmit(toItemPayload(f)); } catch { toast.error('Lưu thất bại'); } finally { setBusy(false); }
  };

  const isEdu = f.kind === 'EDUCATION';
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={isEdu ? 'Bằng cấp / Ngành' : 'Tiêu đề (chức danh / tên dự án)'}>
          <input className={inputCls} value={f.title} onChange={set('title')} />
        </Field>
        <Field label={isEdu ? 'Trường' : 'Tổ chức / Công ty'}>
          <input className={inputCls} value={f.organization} onChange={set('organization')} />
        </Field>
        <Field label="Bắt đầu"><input type="month" className={inputCls} value={monthValue(f.startDate) || f.startDate} onChange={set('startDate')} /></Field>
        <Field label="Kết thúc">
          <input type="month" className={inputCls} value={monthValue(f.endDate) || f.endDate} onChange={set('endDate')} disabled={f.isCurrent} />
        </Field>
        <Field label="Địa điểm"><input className={inputCls} value={f.location} onChange={set('location')} /></Field>
        {isEdu
          ? <Field label="GPA (nếu mạnh)"><input className={inputCls} value={f.gpa} onChange={set('gpa')} placeholder="3.6/4.0" /></Field>
          : <Field label="Link (repo / demo)"><input className={inputCls} value={f.url} onChange={set('url')} placeholder="https://…" /></Field>}
      </div>
      {!isEdu && (
        <div className="mt-3">
          <Field label="Tech stack (phân cách bằng dấu phẩy)">
            <input className={inputCls} value={f.techStack} onChange={set('techStack')} placeholder="Node.js, PostgreSQL, Redis" />
          </Field>
        </div>
      )}
      <label className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <input type="checkbox" checked={f.isCurrent} onChange={set('isCurrent')} /> Hiện tại (đang tiếp tục)
      </label>
      <div className="mt-4 flex gap-2">
        <button className={btnPrimary} onClick={submit} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Lưu
        </button>
        <button className={btnGhost} onClick={onCancel}><X className="h-4 w-4" /> Huỷ</button>
      </div>
    </div>
  );
}

function ItemRow({ item, onChanged }: { item: CvItem; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const dateRange = [item.startDate, item.isCurrent ? 'nay' : item.endDate]
    .map((d) => (d && d !== 'nay' ? d.slice(0, 7) : d))
    .filter(Boolean)
    .join(' — ');

  if (editing) {
    return (
      <ItemForm
        initial={{
          kind: item.kind, title: item.title, organization: item.organization ?? '', location: item.location ?? '',
          url: item.url ?? '', techStack: item.techStack.join(', '), startDate: item.startDate ?? '',
          endDate: item.endDate ?? '', isCurrent: item.isCurrent, gpa: item.gpa ?? '', context: item.context ?? '',
        }}
        onCancel={() => setEditing(false)}
        onSubmit={async (data) => { await cvApi.updateItem(item.id, data); setEditing(false); await onChanged(); }}
      />
    );
  }

  const del = async () => {
    if (!confirm(`Xoá "${item.title}"? Mọi dòng thành tích bên trong cũng bị xoá.`)) return;
    try { await cvApi.deleteItem(item.id); await onChanged(); toast.success('Đã xoá'); } catch { toast.error('Xoá thất bại'); }
  };

  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-[var(--text-secondary)]">
            {[item.organization, item.location].filter(Boolean).join(' · ')}
            {dateRange && <span> · {dateRange}</span>}
          </div>
          {item.techStack.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.techStack.map((t) => (
                <span key={t} className="rounded border border-[var(--border-color)] px-1.5 py-0.5 text-[11px] text-[var(--text-secondary)]">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button className={btnGhost} onClick={() => setEditing(true)} aria-label="Sửa mục này"><Pencil className="h-3.5 w-3.5" /></button>
          <button className={btnDanger} onClick={del} aria-label="Xoá mục này"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <Bullets item={item} onChanged={onChanged} />
    </div>
  );
}

const STRENGTH_META: Record<string, { label: string; cls: string }> = {
  STRONG: { label: 'Mạnh', cls: 'bg-emerald-500/15 text-emerald-500' },
  OK: { label: 'Ổn', cls: 'bg-slate-500/15 text-[var(--text-secondary)]' },
  WEAK: { label: 'Yếu', cls: 'bg-red-500/15 text-red-500' },
};

interface RewriteState {
  suggestionId: number;
  original: string;
  proposed: string;
  rationale: string;
  clarifyingQuestion: string | null;
}

function Bullets({ item, onChanged }: { item: CvItem; onChanged: () => Promise<void> }) {
  const [text, setText] = useState('');
  const [facts, setFacts] = useState('');
  const [busy, setBusy] = useState(false);
  // W2: per-bullet AI rewrite — one open diff at a time, per-bullet accept/reject.
  const [rewriting, setRewriting] = useState<number | null>(null);
  const [diff, setDiff] = useState<(RewriteState & { bulletId: number }) | null>(null);
  const [deciding, setDeciding] = useState(false);

  const add = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await cvApi.createBullet(item.id, { text, userStatedFacts: facts || undefined });
      setText(''); setFacts('');
      await onChanged();
    } catch { toast.error('Không thêm được'); } finally { setBusy(false); }
  };

  const startRewrite = async (bulletId: number) => {
    setRewriting(bulletId);
    try {
      let d;
      try {
        d = (await cvApi.rewriteBullet(bulletId)).data.data;
      } catch (e1) {
        // Auto-retry once on a transient failure (timeout / slow gateway / 5xx).
        const status = (e1 as { response?: { status?: number } })?.response?.status;
        const transient = !status || status >= 500 || (e1 as { code?: string })?.code === 'ECONNABORTED';
        if (!transient) throw e1;
        toast.info('Gateway hơi chậm — đang thử lại…');
        await new Promise((r) => setTimeout(r, 1000));
        d = (await cvApi.rewriteBullet(bulletId)).data.data;
      }
      setDiff({ bulletId, suggestionId: d.suggestionId, original: d.original, proposed: d.proposed, rationale: d.rationale, clarifyingQuestion: d.clarifyingQuestion });
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'AI viết lại thất bại — thử lại sau giây lát.');
    } finally { setRewriting(null); }
  };

  const decide = async (accepted: boolean) => {
    if (!diff) return;
    setDeciding(true);
    try {
      await cvApi.decideSuggestion(diff.suggestionId, accepted, accepted ? diff.proposed : undefined);
      setDiff(null);
      if (accepted) await onChanged();
    } catch { toast.error('Không lưu được quyết định'); } finally { setDeciding(false); }
  };

  return (
    <div className="mt-3 border-t border-[var(--border-color)] pt-3">
      <ul className="space-y-1.5">
        {item.bullets.map((b) => (
          <li key={b.id}>
            <div className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--text-secondary)]" />
              <span className="flex-1">{b.text}</span>
              <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${STRENGTH_META[b.strength]?.cls ?? ''}`} title="Độ mạnh theo rules engine (cập nhật khi Chấm CV)">
                {STRENGTH_META[b.strength]?.label ?? b.strength}
              </span>
              <button
                aria-label="AI viết lại dòng này"
                title="AI viết lại (chỉ dùng sự thật của bạn)"
                onClick={() => startRewrite(b.id)}
                disabled={rewriting !== null || diff !== null}
                className="text-[var(--accent-color)] disabled:opacity-40"
              >
                {rewriting === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </button>
              <button
                aria-label={b.verified ? 'Đã xác nhận' : 'Chưa xác nhận'}
                title={b.verified ? 'Đã xác nhận (bạn tự viết)' : 'Chưa xác nhận'}
                onClick={async () => { await cvApi.verifyBullet(b.id, !b.verified); await onChanged(); }}
                className={b.verified ? 'text-emerald-500' : 'text-[var(--text-secondary)] opacity-60'}
              >
                {b.verified ? <BadgeCheck className="h-4 w-4" /> : <ShieldQuestion className="h-4 w-4" />}
              </button>
              <button aria-label="Xoá dòng" className={btnDanger} onClick={async () => { await cvApi.deleteBullet(b.id); await onChanged(); }}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* W2 — before/after diff, per-bullet accept/reject/edit. Never bulk. */}
            {diff?.bulletId === b.id && (
              <div className="ml-3 mt-2 rounded-lg border border-[var(--accent-color)]/40 bg-[var(--bg-primary)] p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-medium uppercase text-[var(--text-secondary)]">Bản gốc</div>
                    <p className="mt-1 rounded bg-red-500/5 p-2 text-xs line-through decoration-red-400/60">{diff.original}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium uppercase text-[var(--text-secondary)]">AI đề xuất (sửa được)</div>
                    <textarea
                      value={diff.proposed}
                      onChange={(e) => setDiff({ ...diff, proposed: e.target.value })}
                      className="mt-1 w-full resize-y rounded border border-emerald-500/30 bg-emerald-500/5 p-2 text-xs"
                      rows={3}
                      aria-label="Bản AI đề xuất"
                    />
                  </div>
                </div>
                {diff.rationale && <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Vì sao: {diff.rationale}</p>}
                {diff.clarifyingQuestion && (
                  <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">AI hỏi: {diff.clarifyingQuestion} — trả lời được thì sửa thẳng vào ô đề xuất rồi hãy chấp nhận.</p>
                )}
                <div className="mt-2 flex gap-2">
                  <button onClick={() => decide(true)} disabled={deciding} className="inline-flex items-center gap-1 rounded bg-[var(--accent-color)] px-3 py-1 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50">
                    {deciding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Chấp nhận
                  </button>
                  <button onClick={() => decide(false)} disabled={deciding} className="inline-flex items-center gap-1 rounded border border-[var(--border-color)] px-3 py-1 text-xs hover:bg-[var(--bg-card)]">
                    <X className="h-3 w-3" /> Từ chối
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-2 space-y-2">
        <input
          className={inputCls}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          placeholder="Thêm dòng thành tích — mở đầu bằng động từ mạnh (built, migrated, reduced…)"
        />
        <input
          className={`${inputCls} text-xs`}
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
          placeholder="(tuỳ chọn) Sự thật gốc / số liệu bạn nhớ — dùng làm neo khi AI viết lại sau này"
        />
        <button className={btnGhost} onClick={add} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Thêm dòng
        </button>
      </div>
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────
function SkillsSection({ profile, onChanged }: { profile: CvProfile; onChanged: () => Promise<void> }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CvSkillCategory>('LANGUAGE');
  const [prof, setProf] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await cvApi.createSkill({ name, category, proficiency: prof || null });
      setName(''); setProf('');
      await onChanged();
    } catch { toast.error('Không thêm được'); } finally { setBusy(false); }
  };

  return (
    <Card>
      <div className="flex items-center gap-2"><Wrench className="h-4 w-4 text-[var(--text-secondary)]" /><h2 className="text-base font-semibold">Kỹ năng</h2></div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        Kỹ năng không có dòng thành tích chứng minh là một điểm yếu — interviewer sẽ hỏi đúng chỗ đó. (Sẽ được kiểm ở bước chấm CV.)
      </p>
      {profile.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span key={s.id} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1 text-sm">
              {s.name}
              {s.proficiency && <span className="text-xs text-[var(--text-secondary)]">· {s.proficiency}</span>}
              <button className="text-red-500 hover:opacity-80" onClick={async () => { await cvApi.deleteSkill(s.id); await onChanged(); }}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr_auto]">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Tên kỹ năng (Node.js)" />
        <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value as CvSkillCategory)}>
          {SKILL_CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input className={inputCls} value={prof} onChange={(e) => setProf(e.target.value)} placeholder="Mức độ (tuỳ chọn)" />
        <button className={btnPrimary} onClick={add} disabled={busy}><Plus className="h-4 w-4" /> Thêm</button>
      </div>
    </Card>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────
function CertsSection({ profile, onChanged }: { profile: CvProfile; onChanged: () => Promise<void> }) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try { await cvApi.createCert({ name, issuer: issuer || null }); setName(''); setIssuer(''); await onChanged(); }
    catch { toast.error('Không thêm được'); } finally { setBusy(false); }
  };

  return (
    <Card>
      <div className="flex items-center gap-2"><AwardIcon className="h-4 w-4 text-[var(--text-secondary)]" /><h2 className="text-base font-semibold">Chứng chỉ</h2></div>
      {profile.certifications.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {profile.certifications.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm">
              <span>{c.name}{c.issuer && <span className="text-[var(--text-secondary)]"> · {c.issuer}</span>}</span>
              <button className={btnDanger} onClick={async () => { await cvApi.deleteCert(c.id); await onChanged(); }}><Trash2 className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Tên chứng chỉ (AWS SAA)" />
        <input className={inputCls} value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Tổ chức cấp (Amazon)" />
        <button className={btnPrimary} onClick={add} disabled={busy}><Plus className="h-4 w-4" /> Thêm</button>
      </div>
    </Card>
  );
}

// ─── Languages ────────────────────────────────────────────────────────────
function LangsSection({ profile, onChanged }: { profile: CvProfile; onChanged: () => Promise<void> }) {
  const [language, setLanguage] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [certName, setCertName] = useState('');
  const [certScore, setCertScore] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!language.trim()) return;
    setBusy(true);
    try {
      await cvApi.createLang({ language, proficiency: proficiency || null, certName: certName || null, certScore: certScore || null });
      setLanguage(''); setProficiency(''); setCertName(''); setCertScore('');
      await onChanged();
    } catch { toast.error('Không thêm được'); } finally { setBusy(false); }
  };

  return (
    <Card>
      <div className="flex items-center gap-2"><LangIcon className="h-4 w-4 text-[var(--text-secondary)]" /><h2 className="text-base font-semibold">Ngoại ngữ</h2></div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        Với công ty outsourcing VN (FPT, KMS, NashTech…), điểm IELTS/TOEIC là một lợi thế thật — ghi rõ ở đây.
      </p>
      {profile.languageSkills.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {profile.languageSkills.map((l) => (
            <li key={l.id} className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm">
              <span>
                {l.language}
                {l.proficiency && <span className="text-[var(--text-secondary)]"> · {l.proficiency}</span>}
                {l.certName && <span className="text-[var(--text-secondary)]"> · {l.certName} {l.certScore}</span>}
              </span>
              <button className={btnDanger} onClick={async () => { await cvApi.deleteLang(l.id); await onChanged(); }}><Trash2 className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
        <input className={inputCls} value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Ngôn ngữ (English)" />
        <input className={inputCls} value={proficiency} onChange={(e) => setProficiency(e.target.value)} placeholder="Mức (Professional)" />
        <input className={inputCls} value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="Chứng chỉ (IELTS)" />
        <div className="flex gap-2">
          <input className={inputCls} value={certScore} onChange={(e) => setCertScore(e.target.value)} placeholder="Điểm (7.5)" />
          <button className={btnPrimary} onClick={add} disabled={busy}><Plus className="h-4 w-4" /></button>
        </div>
      </div>
    </Card>
  );
}

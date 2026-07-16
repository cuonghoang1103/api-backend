'use client';

/**
 * GameForm — shared create/edit form for /admin/games/new and
 * /admin/games/[id]/edit.
 *
 * react-hook-form + zod resolver with inline field errors, a drag-and-drop
 * cover uploader, a reorderable screenshots gallery, tag inputs, and an
 * unsaved-changes guard (beforeunload + in-app confirm on cancel).
 *
 * componentKey is a select fed by the game registry plus a free-text fallback,
 * so a game whose component hasn't been written yet can still be staged.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Upload, X, Loader2, Save, Trash2, Plus, ArrowLeft,
} from 'lucide-react';
import {
  adminGamesApi, type GameDto, type GameCategoryDto, type GameInput,
} from '@/lib/api';
import { registryKeys } from '@/components/games/registry';

const schema = z.object({
  title: z.string().min(1, 'Bắt buộc nhập tiêu đề').max(160),
  titleVi: z.string().max(160).optional(),
  slug: z.string().max(160).optional(),
  description: z.string().min(1, 'Bắt buộc nhập mô tả ngắn'),
  descriptionVi: z.string().optional(),
  longDescription: z.string().optional(),
  categoryId: z.coerce.number().int().min(1, 'Chọn chuyên mục'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMING_SOON']),
  kind: z.enum(['REACT', 'IFRAME']),
  componentKey: z.string().max(64).optional(),
  iframeSrc: z.string().max(500).optional(),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int(),
  estimatedTime: z.string().max(40).optional(),
  controls: z.string().optional(),
  controlsVi: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  categories: GameCategoryDto[];
  /** undefined = create mode */
  game?: GameDto;
}

export default function GameForm({ categories, game }: Props) {
  const router = useRouter();
  const isEdit = !!game;

  const [coverImage, setCoverImage] = useState<string | null>(game?.coverImage ?? null);
  const [screenshots, setScreenshots] = useState<string[]>(game?.screenshots ?? []);
  const [techStack, setTechStack] = useState<string[]>(game?.techStack ?? []);
  const [tags, setTags] = useState<string[]>(game?.tags ?? []);
  const [uploading, setUploading] = useState<'cover' | 'shots' | null>(null);
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState<'en' | 'vi'>('en');

  const {
    register, handleSubmit, control, watch, setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: game?.title ?? '',
      titleVi: game?.titleVi ?? '',
      slug: game?.slug ?? '',
      description: game?.description ?? '',
      descriptionVi: game?.descriptionVi ?? '',
      longDescription: game?.longDescription ?? '',
      categoryId: game?.category?.id ?? categories[0]?.id ?? 0,
      difficulty: game?.difficulty ?? 'EASY',
      status: game?.status ?? 'DRAFT',
      kind: game?.kind ?? 'REACT',
      componentKey: game?.componentKey ?? '',
      iframeSrc: game?.iframeSrc ?? '',
      featured: game?.featured ?? false,
      sortOrder: game?.sortOrder ?? 0,
      estimatedTime: game?.estimatedTime ?? '',
      controls: game?.controls ?? '',
      controlsVi: game?.controlsVi ?? '',
    },
  });

  const kind = watch('kind');
  const title = watch('title');

  // Auto-slug from title in create mode until the admin edits the slug by hand.
  const slugTouched = useRef(false);
  useEffect(() => {
    if (isEdit || slugTouched.current) return;
    const auto = (title ?? '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd')
      .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    setValue('slug', auto);
  }, [title, isEdit, setValue]);

  // Unsaved-changes guard.
  const dirty = isDirty
    || coverImage !== (game?.coverImage ?? null)
    || JSON.stringify(screenshots) !== JSON.stringify(game?.screenshots ?? [])
    || JSON.stringify(techStack) !== JSON.stringify(game?.techStack ?? [])
    || JSON.stringify(tags) !== JSON.stringify(game?.tags ?? []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const uploadFiles = async (files: FileList | null, target: 'cover' | 'shots') => {
    if (!files?.length) return;
    const list = Array.from(files);
    const bad = list.find((f) => !/^image\/(jpeg|png|webp|gif)$/.test(f.type) || f.size > 2 * 1024 * 1024);
    if (bad) { toast.error('Chỉ nhận ảnh jpg/png/webp ≤ 2MB'); return; }
    setUploading(target);
    try {
      const urls: string[] = [];
      for (const f of list) {
        const r = await adminGamesApi.uploadImage(f);
        urls.push(r.data.data.url);
      }
      if (target === 'cover') setCoverImage(urls[0]);
      else setScreenshots((s) => [...s, ...urls]);
      toast.success('Đã tải ảnh lên');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Tải ảnh thất bại');
    } finally {
      setUploading(null);
    }
  };

  const moveShot = (from: number, to: number) => {
    setScreenshots((s) => {
      if (to < 0 || to >= s.length) return s;
      const next = [...s];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  };

  const onSubmit = async (v: FormValues) => {
    setSaving(true);
    try {
      const payload: GameInput = {
        ...v,
        titleVi: v.titleVi || null,
        slug: v.slug || null,
        descriptionVi: v.descriptionVi || null,
        longDescription: v.longDescription || null,
        componentKey: v.componentKey || null,
        iframeSrc: v.iframeSrc || null,
        estimatedTime: v.estimatedTime || null,
        controls: v.controls || null,
        controlsVi: v.controlsVi || null,
        coverImage,
        screenshots,
        techStack,
        tags,
      };
      if (isEdit && game) {
        await adminGamesApi.update(game.id, payload);
        toast.success('Đã lưu thay đổi');
      } else {
        await adminGamesApi.create(payload);
        toast.success('Đã tạo game');
      }
      router.push('/admin/games');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (dirty && !window.confirm('Bạn có thay đổi chưa lưu. Rời khỏi trang?')) return;
    router.push('/admin/games');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={cancel} className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06]" aria-label="Quay lại">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              {isEdit ? 'Sửa game' : 'Game mới'}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {isEdit ? `#${game!.id} — slug chỉ đổi khi bạn sửa tay` : 'Mặc định lưu ở trạng thái Draft'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={cancel} className="px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.06]">
            Huỷ
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Lưu' : 'Tạo game'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            {/* EN/VI tabs */}
            <div className="flex gap-1 mb-4">
              {(['en', 'vi'] as const).map((l) => (
                <button
                  key={l} type="button" onClick={() => setLangTab(l)}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    langTab === l ? 'bg-neon-violet/20 text-neon-violet' : 'text-text-secondary hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  {l === 'en' ? 'English' : 'Tiếng Việt'}
                </button>
              ))}
            </div>

            {langTab === 'en' ? (
              <div className="space-y-3">
                <Field label="Title" required error={errors.title?.message}>
                  <input {...register('title')} className={inp} placeholder="Snake Game" />
                </Field>
                <Field label="Short description" required error={errors.description?.message}>
                  <textarea {...register('description')} rows={2} className={inp + ' resize-y'} placeholder="One line shown on the card." />
                </Field>
                <Field label="Controls / how to play">
                  <textarea {...register('controls')} rows={2} className={inp + ' resize-y'} placeholder="Arrow keys to move…" />
                </Field>
              </div>
            ) : (
              <div className="space-y-3">
                <Field label="Tiêu đề (VI)">
                  <input {...register('titleVi')} className={inp} placeholder="Rắn săn mồi" />
                </Field>
                <Field label="Mô tả ngắn (VI)">
                  <textarea {...register('descriptionVi')} rows={2} className={inp + ' resize-y'} placeholder="Một dòng hiển thị trên thẻ game." />
                </Field>
                <Field label="Hướng dẫn chơi (VI)">
                  <textarea {...register('controlsVi')} rows={2} className={inp + ' resize-y'} placeholder="Dùng phím mũi tên…" />
                </Field>
              </div>
            )}
          </Card>

          <Card title="Mô tả dài">
            <Field label="Long description" error={errors.longDescription?.message}>
              <textarea {...register('longDescription')} rows={5} className={inp + ' resize-y'} placeholder="Hiển thị trên trang chi tiết game. Hỗ trợ xuống dòng." />
            </Field>
          </Card>

          <Card title="Ảnh">
            <Field label="Cover (16:9, jpg/png/webp ≤ 2MB)">
              {coverImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-darkborder bg-darkbg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setCoverImage(null)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80" aria-label="Xoá cover">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <DropZone
                  busy={uploading === 'cover'}
                  onFiles={(f) => uploadFiles(f, 'cover')}
                  label="Kéo thả ảnh cover vào đây hoặc bấm để chọn"
                />
              )}
            </Field>

            <Field label="Screenshots (nhiều ảnh, kéo để sắp xếp)">
              {screenshots.length > 0 && (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {screenshots.map((url, i) => (
                    <li key={url + i} className="relative group aspect-video rounded-lg overflow-hidden border border-darkborder">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button type="button" onClick={() => moveShot(i, i - 1)} disabled={i === 0} className="p-1 rounded bg-white/10 text-white disabled:opacity-30" aria-label="Sang trái">←</button>
                        <button type="button" onClick={() => moveShot(i, i + 1)} disabled={i === screenshots.length - 1} className="p-1 rounded bg-white/10 text-white disabled:opacity-30" aria-label="Sang phải">→</button>
                        <button type="button" onClick={() => setScreenshots((s) => s.filter((_, j) => j !== i))} className="p-1 rounded bg-red-500/30 text-red-200" aria-label="Xoá ảnh">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <DropZone busy={uploading === 'shots'} multiple onFiles={(f) => uploadFiles(f, 'shots')} label="Thêm screenshots" compact />
            </Field>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          <Card title="Xuất bản">
            <Field label="Trạng thái">
              <select {...register('status')} className={inp}>
                <option value="DRAFT">Draft (ẩn)</option>
                <option value="PUBLISHED">Published (chơi được)</option>
                <option value="COMING_SOON">Coming soon (hiện, khoá)</option>
              </select>
            </Field>
            <Field label="Chuyên mục" required error={errors.categoryId?.message}>
              <select {...register('categoryId')} className={inp}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Độ khó">
              <select {...register('difficulty')} className={inp}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Thứ tự">
                <input type="number" {...register('sortOrder')} className={inp} />
              </Field>
              <Field label="Thời lượng">
                <input {...register('estimatedTime')} className={inp} placeholder="5-10 min" />
              </Field>
            </div>
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer mt-1">
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="rounded border-darkborder bg-darkcard text-neon-violet focus:ring-neon-violet" />
                  <span>Featured — nổi bật ở spotlight</span>
                </label>
              )}
            />
          </Card>

          <Card title="Kỹ thuật">
            <Field label="Slug" error={errors.slug?.message} hint="Đổi slug sẽ đổi URL công khai.">
              <input {...register('slug')} onInput={() => { slugTouched.current = true; }} className={inp} placeholder="snake-game" />
            </Field>
            <Field label="Loại game">
              <select {...register('kind')} className={inp}>
                <option value="REACT">React component (registry)</option>
                <option value="IFRAME">HTML tĩnh (iframe)</option>
              </select>
            </Field>
            {kind === 'REACT' ? (
              <Field label="Component key" hint="Chọn từ registry, hoặc gõ tay nếu component chưa viết.">
                <input list="registry-keys" {...register('componentKey')} className={inp} placeholder="snake" />
                <datalist id="registry-keys">
                  {registryKeys().map((r) => <option key={r.key} value={r.key}>{r.name}</option>)}
                </datalist>
              </Field>
            ) : (
              <Field label="Đường dẫn HTML" hint="Ví dụ: /games/love-me-game/love-me.html">
                <input {...register('iframeSrc')} className={inp} placeholder="/games/…/index.html" />
              </Field>
            )}
            <Field label="Tech stack">
              <TagInput value={techStack} onChange={setTechStack} placeholder="HTML5 Canvas, TypeScript…" />
            </Field>
            <Field label="Tags">
              <TagInput value={tags} onChange={setTags} placeholder="Retro, Canvas…" />
            </Field>
          </Card>
        </div>
      </div>
    </form>
  );
}

// ─── bits ──────────────────────────────────────────────────────────

const inp = 'w-full px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/15 transition-all';

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-darkcard/60 border border-darkborder p-4 sm:p-5 space-y-3">
      {title && <h2 className="text-sm font-heading font-semibold text-text-primary">{title}</h2>}
      {children}
    </div>
  );
}

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-text-muted">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function DropZone({ onFiles, busy, label, multiple, compact }: {
  onFiles: (f: FileList | null) => void; busy: boolean; label: string; multiple?: boolean; compact?: boolean;
}) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles(e.dataTransfer.files); }}
      className={[
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors text-text-muted hover:text-text-primary',
        compact ? 'py-4' : 'aspect-video',
        over ? 'border-neon-violet bg-neon-violet/5' : 'border-darkborder hover:border-neon-violet/50',
      ].join(' ')}
    >
      <input type="file" accept="image/*" multiple={multiple} className="hidden" disabled={busy} onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />
      {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : compact ? <Plus className="w-4 h-4" /> : <Upload className="w-6 h-6 mb-2" />}
      <span className="text-xs mt-1">{busy ? 'Đang tải…' : label}</span>
    </label>
  );
}

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-neon-violet/10 text-neon-violet border border-neon-violet/20">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Xoá ${t}`}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        onBlur={add}
        placeholder={placeholder}
        className={inp}
      />
    </div>
  );
}

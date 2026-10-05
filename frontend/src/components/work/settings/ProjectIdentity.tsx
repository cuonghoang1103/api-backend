'use client';

/**
 * CTW-23 (06/10/2026): nhận diện dự án — ảnh (tải lên R2, ≤ 2 MB, cắt vuông khi hiển thị), emoji, màu.
 * Hiện ở sidebar, danh sách dự án, header, portfolio, cổng khách. Thứ tự hiển thị: ảnh > emoji > chữ tắt.
 * CTW-8/14: ngôn ngữ cho chữ máy chủ tự sinh (báo cáo AI cho khách, tiêu đề phê duyệt).
 * Cũng có WorkspaceLogo cho trang cài đặt không gian.
 */

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ImagePlus, Trash2 } from 'lucide-react';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { BRAND_IMAGE_TYPES, workBrandApi } from '@/lib/work-ctw-api';
import { Field, ProjectMark, Spinner } from '../ui';
import { Section, Select } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';

const SWATCHES = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0d9488', '#0891b2', '#475569'];
const EMOJIS = ['🚀', '🌍', '🎮', '📱', '🛒', '🏗️', '🎨', '🧪', '📚', '🤖', '💡', '⚙️'];

function useImagePicker(onFile: (f: File) => void) {
  const ref = useRef<HTMLInputElement>(null);
  const input = (
    <input
      ref={ref} type="file" accept={BRAND_IMAGE_TYPES.join(',')} className="hidden"
      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFile(f); }}
    />
  );
  return { input, open: () => ref.current?.click() };
}

export function ProjectIdentity({ config, slug }: { config: ProjectConfig; slug: string }) {
  const invalidate = useProjectInvalidate(config.id, slug);
  const qc = useQueryClient();
  const canEdit = config.permissions.settings;
  const [emoji, setEmoji] = useState(config.iconEmoji ?? '');
  const [color, setColor] = useState(config.color ?? '');
  const [lang, setLang] = useState<string>(typeof config.settings?.language === 'string' ? (config.settings.language as string) : '');
  useEffect(() => { setEmoji(config.iconEmoji ?? ''); setColor(config.color ?? ''); }, [config.iconEmoji, config.color]);
  useEffect(() => { setLang(typeof config.settings?.language === 'string' ? (config.settings.language as string) : ''); }, [config.settings]);
  const after = (msg: string) => { toast.success(msg); invalidate(); void qc.invalidateQueries({ queryKey: ['work'] }); };

  const upload = useMutation({ mutationFn: (f: File) => workBrandApi.uploadAvatar(config.id, f), onSuccess: () => after('Project picture updated'), onError: (e) => toast.error(workError(e, 'Could not upload the picture')) });
  const remove = useMutation({ mutationFn: () => workBrandApi.removeAvatar(config.id), onSuccess: () => after('Project picture removed'), onError: (e) => toast.error(workError(e)) });
  const save = useMutation({
    mutationFn: () => workBrandApi.update(config.id, { iconEmoji: emoji.trim() || null, color: color || null }),
    onSuccess: () => after('Project icon saved'), onError: (e) => toast.error(workError(e)),
  });
  const saveLang = useMutation({
    mutationFn: () => workApi.updateProject(config.id, { settings: { language: lang || null } }),
    onSuccess: () => after('Language saved'), onError: (e) => toast.error(workError(e)),
  });
  const picker = useImagePicker((f) => upload.mutate(f));
  const dirty = (emoji.trim() || null) !== (config.iconEmoji ?? null) || (color || null) !== (config.color ?? null);
  const preview = { avatarUrl: config.avatarUrl, iconEmoji: emoji.trim() || null, color: color || null };

  return (
    <Section title="Project icon" description="Shown in the sidebar, the project list, page headers, the portfolio and the client portal. A picture wins over an emoji; without either the project key is used.">
      <div className="flex max-w-[640px] flex-col gap-4" data-testid="project-identity">
        <div className="flex flex-wrap items-center gap-3">
          <ProjectMark k={config.key} size={56} letters={2} brand={preview} />
          <div className="flex flex-wrap gap-2">
            {canEdit && <button type="button" className="w-btn w-btn-sm" disabled={upload.isPending} onClick={picker.open} data-testid="project-avatar-upload">{upload.isPending ? <Spinner size={11} /> : <ImagePlus size={13} />} {config.avatarUrl ? 'Change picture' : 'Upload picture'}</button>}
            {canEdit && config.avatarUrl && <button type="button" className="w-btn w-btn-sm w-btn-ghost" disabled={remove.isPending} onClick={() => remove.mutate()}><Trash2 size={13} /> Remove picture</button>}
          </div>
          {picker.input}
          <p className="basis-full text-[12px] text-[var(--w-text-3)]">PNG, JPEG, WebP or GIF up to 2 MB. Square images look best.</p>
        </div>
        <Field label="Emoji">
          <div className="flex flex-wrap items-center gap-1.5">
            <input className="w-input !w-20 text-center" value={emoji} maxLength={8} onChange={(e) => setEmoji(e.target.value)} disabled={!canEdit} placeholder="🚀" aria-label="Project emoji" />
            {canEdit && EMOJIS.map((x) => (
              <button key={x} type="button" className="h-8 w-8 rounded-[6px] border border-[var(--w-border)] text-[16px] hover:bg-[var(--w-hover)]" onClick={() => setEmoji(x)} aria-label={`Use ${x}`}>{x}</button>
            ))}
            {canEdit && emoji && <button type="button" className="text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text)]" onClick={() => setEmoji('')}>Clear</button>}
          </div>
        </Field>
        <Field label="Color">
          <div className="flex flex-wrap items-center gap-1.5">
            {SWATCHES.map((c) => (
              <button
                key={c} type="button" disabled={!canEdit} onClick={() => setColor(c)} aria-label={`Color ${c}`}
                className="h-7 w-7 rounded-full border-2" style={{ background: c, borderColor: color === c ? 'var(--w-text)' : 'transparent' }}
              />
            ))}
            <input type="color" className="h-7 w-9 cursor-pointer rounded border border-[var(--w-border)] bg-transparent" value={color || '#2563eb'} disabled={!canEdit} onChange={(e) => setColor(e.target.value)} aria-label="Custom color" />
            {canEdit && color && <button type="button" className="text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-text)]" onClick={() => setColor('')}>Default</button>}
          </div>
        </Field>
        {canEdit && (
          <div><button type="button" className="w-btn w-btn-primary" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={12} />}Save icon</button></div>
        )}
        <Field label="Language for generated text" hint="Used when CT Work writes text for this project — AI-polished client reports and approval titles. Auto detects it from your issues.">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={lang} onChange={(e) => setLang(e.target.value)} disabled={!canEdit} className="!w-auto" aria-label="Project language">
              <option value="">Auto</option><option value="en">English</option><option value="vi">Vietnamese</option>
            </Select>
            {canEdit && <button type="button" className="w-btn w-btn-sm" disabled={saveLang.isPending || lang === (typeof config.settings?.language === 'string' ? config.settings.language : '')} onClick={() => saveLang.mutate()}>Save</button>}
          </div>
        </Field>
      </div>
    </Section>
  );
}

/** Logo không gian (cổng khách mang thương hiệu studio). */
export function WorkspaceLogo({ wsId, name, logoUrl, canEdit, onChanged }: { wsId: number; name: string; logoUrl?: string | null; canEdit: boolean; onChanged: () => void }) {
  const upload = useMutation({ mutationFn: (f: File) => workBrandApi.uploadLogo(wsId, f), onSuccess: () => { toast.success('Workspace logo updated'); onChanged(); }, onError: (e) => toast.error(workError(e, 'Could not upload the logo')) });
  const remove = useMutation({ mutationFn: () => workBrandApi.removeLogo(wsId), onSuccess: () => { toast.success('Workspace logo removed'); onChanged(); }, onError: (e) => toast.error(workError(e)) });
  const picker = useImagePicker((f) => upload.mutate(f));
  return (
    <Section title="Workspace logo" description="Shown in the client portal and the workspace header, so your clients see your studio's brand.">
      <div className="flex flex-wrap items-center gap-3" data-testid="workspace-logo">
        {logoUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={logoUrl} alt={`${name} logo`} className="h-14 w-14 rounded-[8px] border border-[var(--w-border)] object-contain" />
          : <ProjectMark k={name} size={56} letters={2} />}
        {canEdit && <button type="button" className="w-btn w-btn-sm" disabled={upload.isPending} onClick={picker.open}>{upload.isPending ? <Spinner size={11} /> : <ImagePlus size={13} />} {logoUrl ? 'Change logo' : 'Upload logo'}</button>}
        {canEdit && logoUrl && <button type="button" className="w-btn w-btn-sm w-btn-ghost" disabled={remove.isPending} onClick={() => remove.mutate()}><Trash2 size={13} /> Remove</button>}
        {picker.input}
        <p className="basis-full text-[12px] text-[var(--w-text-3)]">PNG, JPEG, WebP or GIF up to 2 MB.</p>
      </div>
    </Section>
  );
}

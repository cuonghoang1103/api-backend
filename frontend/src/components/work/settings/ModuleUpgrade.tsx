'use client';

/**
 * Cài đặt dự án → Project type & modules → wt('modup.available') (đợt S5c).
 *
 * Dự án tạo trước khi một mô-đun có tính năng thật giữ mô-đun đó TẮT (luật "dự án cũ y nguyên"). Khối này liệt kê
 * mô-đun đang tắt kèm mô tả, đánh dấu cái được khuyên cho loại dự án và cái "mới từ khi dự án được tạo", và cho
 * ADMIN một nút "Enable all recommended for this project type" — server (POST /studio/apply-defaults) chỉ bật các
 * khoá CHƯA được ai quyết, không đụng mô-đun đã bật/tắt tay. Không bấm thì không gì thay đổi.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { workS5cApi, workS5cKeys } from '@/lib/work-s5c-api';
import { Spinner } from '../ui';
import { KIND_INFO } from '../studio/shared';
import type { WKey } from '../i18n';
import { wt } from '@/components/work/i18n';
/** Nhãn/mô tả mô-đun do máy chủ gửi (tiếng Anh) ⇒ dùng bản dịch của studio.mod_* nếu có. */
const modLabel = (k: string, fb: string) => { const s = wt(`studio.mod_${k}` as WKey); return s.startsWith('studio.') ? fb : s; };
const modBody = (k: string, fb: string) => { const s = wt(`studio.modBody_${k}` as WKey); return s.startsWith('studio.') ? fb : s; };

export default function ModuleUpgrade({ config, onChanged }: { config: ProjectConfig; onChanged: () => void }) {
  const canEdit = !!config.permissions.configureStudio;
  const q = useQuery({ queryKey: workS5cKeys.available(config.id), queryFn: () => workS5cApi.availableModules(config.id) });
  const apply = useMutation({
    mutationFn: () => workS5cApi.applyDefaults(config.id),
    onSuccess: (r) => {
      toast.success(r.enabled.length ? wt('modup.turnedOn', { count: r.enabled.length }) : wt('modup.nothingNew'));
      q.refetch();
      onChanged();
    },
    onError: (err) => toast.error(workError(err, wt('modup.failed'))),
  });

  if (!q.data) return null;
  const off = q.data.modules.filter((m) => !m.on);
  if (!off.length) return null;
  const will = new Set(q.data.willEnable);
  const kindLabel = KIND_INFO[q.data.kind]?.short ?? q.data.kind;

  return (
    <section aria-labelledby="available-modules" className="mb-8 rounded-[10px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-4 py-3.5">
      <div className="flex flex-wrap items-start gap-3">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-[var(--w-accent-text)]" />
        <div className="min-w-0 flex-1">
          <h3 id="available-modules" className="text-[13.5px] font-semibold">{wt('modup.available')}</h3>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
            {wt('modup.offLine', { count: off.length })}
            {will.size ? ` ${wt('modup.recommendedLine', { count: will.size, kind: kindLabel })}` : ''}
            {' '}{wt('modup.nothingChanges')}
          </p>
        </div>
        {canEdit && will.size > 0 && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm shrink-0" disabled={apply.isPending} onClick={() => apply.mutate()}>
            {apply.isPending && <Spinner size={11} />} {wt('modup.enableAll')}
          </button>
        )}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {off.map((m) => (
          <li key={m.key} className="min-w-0 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2">
            <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium">
              {modLabel(m.key, m.label)}
              {m.recommended && <span className="rounded-full bg-[var(--w-accent-soft)] px-1.5 text-[11px] font-normal text-[var(--w-accent-text)]">{wt('modup.recommended')}</span>}
              {will.has(m.key) && <span className="rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] font-normal text-[var(--w-text-3)]">{wt('modup.newSince')}</span>}
            </div>
            <p className="mt-0.5 text-[12px] leading-snug text-[var(--w-text-2)]">{modBody(m.key, m.body)}</p>
          </li>
        ))}
      </ul>
      {!canEdit && <p className="mt-2 text-[12px] text-[var(--w-text-3)]">{wt('modup.adminCan')}</p>}
    </section>
  );
}

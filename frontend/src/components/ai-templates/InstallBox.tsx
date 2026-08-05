'use client';

/**
 * Hộp lệnh cài của trang chi tiết — thứ người ta đến đây để lấy.
 *
 * Nhãn `kind` không phải trang trí: lệnh `npx …` gõ vào Claude Code sẽ không
 * chạy, còn `/plugin install …` gõ vào terminal cũng vậy. Sai chỗ thì màn hình
 * chỉ báo "command not found" và người dùng không hiểu vì sao hướng dẫn lại sai.
 *
 * Kèm nút thêm/bỏ Stack ngay tại đây: người đã mở tới trang chi tiết là người
 * quan tâm nhất, bắt họ quay lại danh sách mới gom được là thừa một bước.
 */

import { Terminal, MessageSquareCode, Plus, Check } from 'lucide-react';
import type { InstallRecipe } from '@/lib/ai-templates/install';
import type { ComponentType } from '@/lib/ai-templates/types';
import { useAiTemplatesStore } from '@/store/aiTemplatesStore';
import CopyButton from './CopyButton';

export default function InstallBox({
  recipe,
  type,
  refId,
  name,
  category,
}: {
  recipe: InstallRecipe;
  type: ComponentType;
  refId: string;
  name: string;
  category: string;
}) {
  const inStack = useAiTemplatesStore((s) =>
    s.stack.some((x) => x.type === type && x.ref === refId),
  );
  const toggleStack = useAiTemplatesStore((s) => s.toggleStack);
  const openStack = useAiTemplatesStore((s) => s.openStack);

  const all = recipe.lines.join('\n');
  const Icon = recipe.kind === 'shell' ? Terminal : MessageSquareCode;

  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          <Icon size={13} />
          Lệnh cài
        </h2>
        <span className="rounded-md border border-[var(--border-color)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
          {recipe.hint}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              toggleStack({ type, ref: refId, name, category });
              if (!inStack) openStack();
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              inStack
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600'
                : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
            }`}
          >
            {inStack ? <Check size={13} /> : <Plus size={13} />}
            {inStack ? 'Đã có trong Stack' : 'Thêm vào Stack'}
          </button>

          <CopyButton
            value={all}
            label="Chép lệnh"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-color)] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {recipe.lines.map((line, i) => (
          <div
            key={line}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5"
          >
            {recipe.lines.length > 1 && (
              <span className="shrink-0 font-mono text-[11px] text-[var(--text-muted)]">
                {i + 1}.
              </span>
            )}
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-[12.5px] text-[var(--text-primary)]">
              {line}
            </code>
            <CopyButton value={line} iconOnly title={`Chép: ${line}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

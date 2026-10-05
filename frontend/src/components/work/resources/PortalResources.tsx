'use client';

/**
 * Cổng khách — tab Resources (06/10/2026): link dự án đội đã chia sẻ (visibility = CLIENT), theo nhóm. Khách không
 * thấy trạng thái kiểm link, số lượt mở hay người thêm (server bỏ hẳn các trường đó).
 */

import { useQuery } from '@tanstack/react-query';
import { workError } from '@/lib/work-api';
import { openResourceLink, resApi, resKeys } from '@/lib/work-resources-api';
import { EmptyState, PageLoading } from '../ui';
import { Favicon, kindLabel } from './shared';

export default function PortalResources({ pid, asClient }: { pid: number; asClient: boolean }) {
  const q = useQuery({ queryKey: resKeys.portal(pid, asClient), queryFn: () => resApi.portal(pid, asClient) });
  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error) return <EmptyState title="Could not load links" body={workError(q.error)} />;
  const d = q.data;
  if (!d?.enabled || !d.items.length) {
    return <EmptyState title="No shared links yet" body={d?.staffView ? 'Mark a link “Visible to the client” in Resources to show it here.' : 'Links the team shares with you — staging builds, designs, documents — will appear here.'} />;
  }
  const sections = [...d.groups.map((g) => ({ key: String(g.id), name: g.name, icon: g.icon, items: d.items.filter((r) => r.groupId === g.id) })),
    { key: 'none', name: 'Other links', icon: null, items: d.items.filter((r) => r.groupId === null) }].filter((s) => s.items.length);
  return (
    <div className="space-y-5" data-testid="portal-resources">
      {sections.map((s) => (
        <section key={s.key}>
          <h2 className="w-section-title mb-2 flex items-center gap-1.5">{s.icon && <span aria-hidden="true">{s.icon}</span>}{s.name}</h2>
          <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
            {s.items.map((r) => (
              <button key={r.id} type="button" onClick={() => openResourceLink(pid, r, true)} className="w-card flex min-w-0 items-start gap-2.5 p-3 text-left hover:bg-[var(--w-hover)]" title={r.url}>
                <Favicon r={r} size={18} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold">{r.title}</span>
                  <span className="block truncate text-[11.5px] text-[var(--w-text-3)]">{kindLabel(r.kind)} · {r.url.replace(/^(https?:\/\/|mailto:)(www\.)?/, '')}</span>
                  {r.description && <span className="mt-1 line-clamp-2 block text-[12.5px] text-[var(--w-text-2)]">{r.description}</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

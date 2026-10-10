/**
 * CT Work đợt 6 — D9: RỦI RO KHI NHẬP ZIP DỰ ÁN (hàm thuần, projectImport.service.ts gọi).
 *
 *   1. Luật tự động mang ID CŨ: `config` của WorkAutomationRule chứa id trạng thái / nhãn / người / loại thẻ / sprint…
 *      của dự án NGUỒN. Không đổi ⇒ luật (dù nhập ở trạng thái tắt) trỏ vào bản ghi của dự án KHÁC hoặc không tồn tại;
 *      bật lên là chuyển thẻ sang trạng thái lạ / giao việc cho người lạ. Nay: đổi mọi id đã biết sang id mới; id không
 *      đổi được ⇒ BỎ (phần tử mảng) hoặc bỏ cả hành động cần nó, và ghi lại vào `config._import.dropped`.
 *   2. Worklog / chữ ký của người KHÔNG thuộc workspace đích: trước đây bị bỏ im lặng (mất giờ công + mất bằng chứng duyệt).
 *     Nay giữ lại thành GHI CHÚ (không gán cho ai khác — tránh cộng giờ/điểm đóng góp sai người).
 */

export type IdMaps = {
  status: (old: number) => number | undefined;
  label: (old: number) => number | undefined;
  user: (old: number) => number | null | undefined;
  type?: (old: number) => number | undefined;
  sprint?: (old: number) => number | undefined;
  component?: (old: number) => number | undefined;
  version?: (old: number) => number | undefined;
  issue?: (old: number) => number | undefined;
};

type Kind = keyof IdMaps;

/** Khoá ⇒ loại bảng. Khoá số ít = một id, số nhiều = mảng id. */
const KEY_KIND: Record<string, Kind> = {
  statusId: 'status', toStatusId: 'status', fromStatusId: 'status', toStatusIds: 'status', fromStatusIds: 'status', statusIds: 'status',
  labelId: 'label', labelIds: 'label',
  assigneeId: 'user', userId: 'user', userIds: 'user', reporterId: 'user', ownerId: 'user', assignee: 'user', to: 'user',
  typeId: 'type', typeIds: 'type', issueTypeId: 'type',
  sprintId: 'sprint', componentId: 'component', componentIds: 'component', versionId: 'version', fixVersionId: 'version',
  parentId: 'issue', issueId: 'issue',
};
/** Hành động hỏng khi thiếu khoá này ⇒ bỏ cả hành động. */
const ESSENTIAL: Record<string, string> = { transition: 'statusId', add_label: 'labelId' };

export function remapAutomationConfig(config: unknown, maps: IdMaps): { config: Record<string, unknown>; dropped: string[] } {
  const dropped: string[] = [];
  const mapOne = (kind: Kind, v: number, where: string): number | null => {
    const f = maps[kind];
    const to = f ? f(v) : undefined;
    if (typeof to === 'number') return to;
    dropped.push(`${where}: ${kind} #${v}`);
    return null;
  };
  const walk = (node: unknown, where: string): unknown => {
    if (Array.isArray(node)) return node.map((x, i) => walk(x, `${where}[${i}]`));
    if (!node || typeof node !== 'object') return node;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const kind = KEY_KIND[k];
      if (kind && typeof v === 'number') {
        const m = mapOne(kind, v, `${where}.${k}`);
        out[k] = m;
        continue;
      }
      if (kind && Array.isArray(v)) {
        // Mảng hỗn hợp (notify.to: 'assignee' | 'reporter' | id) — giữ chữ, đổi số, bỏ số không đổi được.
        out[k] = v.flatMap((x, i) => (typeof x === 'number' ? (mapOne(kind, x, `${where}.${k}[${i}]`) ?? []) : [x]));
        continue;
      }
      out[k] = walk(v, `${where}.${k}`);
    }
    return out;
  };
  const cfg = (walk(config && typeof config === 'object' ? config : {}, 'config') ?? {}) as Record<string, unknown>;
  if (Array.isArray(cfg.actions)) {
    cfg.actions = (cfg.actions as Array<Record<string, unknown>>).filter((a, i) => {
      const need = ESSENTIAL[String(a?.kind)];
      if (need && (a[need] === null || a[need] === undefined)) { dropped.push(`config.actions[${i}]: ${String(a.kind)} removed (its ${need} does not exist here)`); return false; }
      // assign tới người không có ⇒ bỏ hành động (KHÔNG biến thành "bỏ giao" — đổi nghĩa luật).
      if (a?.kind === 'assign' && a.assignee === null && (config as { actions?: Array<{ assignee?: unknown }> })?.actions?.[i]?.assignee !== null) {
        dropped.push(`config.actions[${i}]: assign removed (person not in this workspace)`);
        return false;
      }
      return true;
    });
  }
  if (dropped.length) cfg._import = { dropped };
  return { config: cfg, dropped };
}

const fmtMin = (m: number) => `${Math.floor(m / 60) ? `${Math.floor(m / 60)}h ` : ''}${m % 60 ? `${m % 60}m` : ''}`.trim() || '0m';

/** Ghi chú giữ worklog của người không thuộc workspace (một bình luận / thẻ). */
export function orphanWorklogNote(rows: Array<{ name: string; minutes: number; startedAt: string | Date; note?: string | null }>): { text: string; doc: Record<string, unknown> } {
  const total = rows.reduce((n, r) => n + (Number(r.minutes) || 0), 0);
  const lines = rows
    .slice()
    .sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt))
    .map((r) => `${new Date(r.startedAt).toISOString().slice(0, 10)} · ${r.name} · ${fmtMin(Number(r.minutes) || 0)}${r.note ? ` — ${String(r.note).slice(0, 300)}` : ''}`);
  const head = `Imported work log from people who are not in this workspace (${fmtMin(total)} total). Kept as a note so their time is not credited to anyone else:`;
  return {
    text: [head, ...lines].join('\n'),
    doc: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'italic' }], text: head }] },
        { type: 'bulletList', content: lines.map((l) => ({ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: l }] }] })) },
      ],
    },
  };
}

/** Dòng nối vào mô tả phê duyệt cho chữ ký của người không thuộc workspace. */
export function orphanSignatureLines(rows: Array<{ name: string; decision: string; decidedAt?: string | Date | null; comment?: string | null; contentHash?: string | null }>): string {
  return [
    'Signatures by people who are not in this workspace (kept from the export, not re-verifiable here):',
    ...rows.map((r) => `- ${r.name}: ${r.decision}${r.decidedAt ? ` on ${new Date(r.decidedAt).toISOString().slice(0, 16).replace('T', ' ')} UTC` : ''}${r.contentHash ? ` (hash ${String(r.contentHash).slice(0, 12)})` : ''}${r.comment ? ` — ${String(r.comment).slice(0, 300)}` : ''}`),
  ].join('\n');
}

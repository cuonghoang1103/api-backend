/**
 * `/hoc` — Học tập & Lịch CÁ NHÂN qua CT Work (24/11/2026). Lõi chỉ gọi lệnh MCP `hoc_tap` của server `ctwork` (cùng
 * đường MCP chính thức + token của `ctworkHe.ts`) rồi trả chữ cho giao diện vẽ. KHÔNG cần thư mục gắn dự án: lịch học là
 * của NGƯỜI, không của dự án.
 *
 * Ghi (`add` / `done` / `undone` / `start` / `edit`) là dữ liệu riêng của chính người dùng — gõ lệnh là đồng ý (như
 * tích một ô trên web); không có xoá ở đây.
 */
import { T } from './ctworkVe';
import { chuLoiCtw, ctworkSan, goiCtw, type KetQuaXem } from './ctworkHe';

export const HANH_DONG_HOC = ['today', 'week', 'list_personal', 'start', 'add', 'edit', 'done', 'undone'] as const;
export type HanhDongHoc = (typeof HANH_DONG_HOC)[number];

/** Khớp `agentCtworkHeSchema.hocTap` (shared/ipc.ts) — `| undefined` vì tsconfig.node bật exactOptionalPropertyTypes. */
export interface YeuCauHoc {
  action: HanhDongHoc;
  id?: string | undefined;
  title?: string | undefined;
  date?: string | undefined;
  time?: string | undefined;
  minutes?: number | undefined;
  note?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
}

/** JSON kết quả ghi ⇒ một dòng người đọc. Không phải JSON (today/week trả markdown) ⇒ giữ nguyên. */
export function veKetQuaHoc(action: HanhDongHoc, noiDung: string): string {
  let o: Record<string, unknown>;
  try { o = JSON.parse(noiDung) as Record<string, unknown>; } catch { return noiDung; }
  const gio = (x: Record<string, unknown>) => `${x.date ? ` · ${String(x.date).slice(8, 10)}/${String(x.date).slice(5, 7)}` : ''}${x.time ? ` ${x.time}` : ''}${x.minutes ? ` · ${x.minutes}′` : ''}`;
  switch (action) {
    case 'add': return T(`✅ Đã thêm \`${o.added}\` **${o.title}**${gio(o)}.`, `✅ Added \`${o.added}\` **${o.title}**${gio(o)}.`);
    case 'edit': return T(`✏️ Đã sửa \`${o.updated}\` **${o.title}**${gio(o)}.`, `✏️ Updated \`${o.updated}\` **${o.title}**${gio(o)}.`);
    case 'done': case 'undone': return o.done
      ? T(`☑️ \`${o.id}\` **${o.title}** — xong.`, `☑️ \`${o.id}\` **${o.title}** — done.`)
      : T(`↩️ \`${o.id}\` **${o.title}** — bỏ đánh dấu xong.`, `↩️ \`${o.id}\` **${o.title}** — marked not done.`);
    case 'start': return T(
      `⏱️ Bắt đầu \`${o.started}\` **${o.title}** (${o.minutes}′). Làm xong thì nộp bằng chứng ở CT Work → Học tập & Lịch để AI chấm.`,
      `⏱️ Started \`${o.started}\` **${o.title}** (${o.minutes}′). When done, submit evidence in CT Work → Study & schedule to get it graded.`);
    case 'list_personal': {
      const ds = (o.tasks as Array<Record<string, unknown>> | undefined) ?? [];
      if (!ds.length) return T('Không có việc cá nhân nào trong khoảng này.', 'No personal tasks in this range.');
      return ds.map((x) => `- \`${x.id}\` ${x.done ? '~~' : ''}${x.title}${x.done ? '~~ ✓' : ''}${gio(x)}${x.overdue ? T(' · ⚠ tồn', ' · ⚠ overdue') : ''}`).join('\n');
    }
    default: return noiDung;
  }
}

export async function hocTapLenh(y: YeuCauHoc | undefined): Promise<KetQuaXem> {
  if (!y) return { ok: false, loi: T('Thiếu việc cần làm.', 'Missing action.') };
  if (!ctworkSan()) return { ok: false, loi: T('Chưa kết nối CT Work — gõ `/ctwork` để kết nối một chạm (lịch học nằm trong CT Work).', 'CT Work is not connected — type `/ctwork` to connect in one tap (your study plan lives in CT Work).') };
  const args: Record<string, unknown> = { action: y.action };
  for (const k of ['id', 'title', 'date', 'time', 'minutes', 'note', 'from', 'to'] as const) if (y[k] !== undefined && y[k] !== '') args[k] = y[k];
  if (y.action === 'edit' && y.time === '') args.time = '';
  const r = await goiCtw('hoc_tap', args);
  if (r.loi) return { ok: false, loi: chuLoiCtw(r.noiDung) };
  return { ok: true, md: veKetQuaHoc(y.action, r.noiDung) };
}

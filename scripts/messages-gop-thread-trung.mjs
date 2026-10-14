#!/usr/bin/env node
/**
 * GỘP hội thoại TRÙNG giữa cùng HAI người (14/10/2026).
 *
 * Vì sao có trùng: trước bản vá cùng ngày, "Hỗ trợ từ Admin" luôn tạo hội thoại loại ADMIN
 * (user ↔ admin được giao), còn nhắn admin từ trang cá nhân của họ lại tạo hội thoại loại USER.
 * Hai loại sống chung bảng `message_threads` ⇒ người dùng thấy HAI "Cuong Hoang" trong hộp thư,
 * lịch sử chia đôi. Bản vá ở `messages.service.ts` (`timHoiThoaiCuaCap`) chặn trùng MỚI; script
 * này dọn trùng CŨ.
 *
 * Cách gộp — mỗi nhóm (cùng một cặp người, bất kể loại) gộp vào hội thoại CŨ NHẤT (created_at,
 * rồi id nhỏ nhất). Trong MỘT transaction cho mỗi nhóm:
 *   1. `messages.thread_id` của hội thoại bị gộp → hội thoại giữ lại (SQL thô: không chạm
 *      `updated_at` của tin). Cảm xúc (`message_reactions`), tệp đính kèm, trích dẫn trả lời đều
 *      bám theo `message_id` ⇒ tự đi theo tin.
 *   2. `message_reads`: mỗi người giữ mốc đọc MUỘN NHẤT; dòng thừa xoá.
 *   3. `thread_nicknames`: chuyển sang; trùng (cùng người đặt, cùng người được đặt) thì giữ bản của
 *      hội thoại giữ lại.
 *   4. `thread_reports`: chuyển sang (giữ nguyên lịch sử báo cáo).
 *   5. `preferences` (JSON theo từng người): ghim/đánh dấu chưa đọc = có ở BẤT KỲ bản nào;
 *      tắt thông báo = mốc XA nhất; lưu trữ/xoá-phía-tôi = CHỈ giữ khi MỌI bản đều có (một bản
 *      còn hiện thì cuộc trò chuyện gộp phải còn hiện).
 *   6. `last_message_at` = mốc mới nhất.
 *   7. KIỂM: hội thoại bị gộp còn 0 tin ⇒ mới xoá dòng `message_threads` của nó. Không bao giờ
 *      xoá tin nhắn — còn sót tin là transaction ném lỗi và cuộn lại toàn bộ nhóm đó.
 *
 *   node scripts/messages-gop-thread-trung.mjs           # = --dry: chỉ in các nhóm + số tin
 *   node scripts/messages-gop-thread-trung.mjs --dry
 *   node scripts/messages-gop-thread-trung.mjs --apply   # gộp thật
 *
 * Trên production (KHI chủ web đã duyệt): `docker exec cuonghoangdev_backend node
 * scripts/messages-gop-thread-trung.mjs --dry`, đọc kết quả, rồi mới `--apply`.
 * Sau khi gộp: link thông báo cũ dạng `/messages?thread=<id đã gộp>` sẽ báo "không tìm thấy"
 * — người dùng mở từ danh sách là thấy đủ lịch sử.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
if (APPLY && args.has('--dry')) {
  console.error('Chọn MỘT: --dry hoặc --apply');
  process.exit(2);
}

const prisma = new PrismaClient();

/** Hai người trong cuộc của một hội thoại (đã xếp tăng dần), null nếu thiếu/tự nhắn mình. */
function capNguoi(t) {
  const ids = t.type === 'ADMIN' ? [t.user_id, t.admin_user_id] : [t.user_a_id, t.user_b_id];
  if (ids.some((x) => x === null || x === undefined)) return null;
  const [a, b] = ids.map(Number).sort((x, y) => x - y);
  return a === b ? null : `${a}-${b}`;
}

const moc = (v) => (v ? new Date(v).getTime() : 0);

/** Gộp `preferences` (JSON {userId: {...}}) của nhiều hội thoại theo luật ở đầu tệp. */
export function gopPreferences(ds) {
  const nguoi = new Set(ds.flatMap((p) => Object.keys(p ?? {})));
  const ra = {};
  for (const uid of nguoi) {
    const ban = ds.map((p) => (p ?? {})[uid] ?? {});
    const g = {};
    const coIt = (k) => ban.map((b) => b[k]).filter(Boolean);
    const ghim = coIt('pinnedAt').sort((x, y) => moc(x) - moc(y))[0];
    if (ghim) g.pinnedAt = ghim;
    const chuaDoc = coIt('markedUnreadAt').sort((x, y) => moc(y) - moc(x))[0];
    if (chuaDoc) g.markedUnreadAt = chuaDoc;
    const tat = coIt('mutedUntil').sort((x, y) => moc(y) - moc(x))[0];
    if (tat) g.mutedUntil = tat;
    for (const k of ['archivedAt', 'deletedAt']) {
      if (ban.every((b) => b[k])) g[k] = ban.map((b) => b[k]).sort((x, y) => moc(y) - moc(x))[0];
    }
    if (Object.keys(g).length) ra[uid] = g;
  }
  return ra;
}

async function main() {
  const host = (() => { try { return new URL(process.env.DATABASE_URL).host; } catch { return '?'; } })();
  console.log(`CSDL: ${host} · chế độ: ${APPLY ? 'APPLY (gộp thật)' : 'DRY (chỉ xem)'}\n`);

  const threads = await prisma.$queryRaw`
    SELECT t.id, t.type, t.user_id, t.admin_user_id, t.user_a_id, t.user_b_id,
           t.created_at, t.last_message_at, t.preferences,
           (SELECT COUNT(*)::int FROM messages m WHERE m.thread_id = t.id) AS so_tin
    FROM message_threads t
    ORDER BY t.created_at ASC, t.id ASC`;

  const nhom = new Map();
  for (const t of threads) {
    const k = capNguoi(t);
    if (!k) continue;
    if (!nhom.has(k)) nhom.set(k, []);
    nhom.get(k).push(t);
  }
  const trung = [...nhom.entries()].filter(([, ds]) => ds.length > 1);
  if (trung.length === 0) {
    console.log('Không có hội thoại trùng nào. Không làm gì.');
    return;
  }

  const ids = [...new Set(trung.flatMap(([k]) => k.split('-').map(Number)))];
  const users = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true } });
  const ten = new Map(users.map((u) => [u.id, u.username]));

  let tongTin = 0;
  for (const [k, ds] of trung) {
    const [a, b] = k.split('-').map(Number);
    const giu = ds[0];
    console.log(`▸ ${ten.get(a) ?? a} (#${a}) ↔ ${ten.get(b) ?? b} (#${b})`);
    for (const t of ds) {
      const vai = t === giu ? 'GIỮ   ' : 'GỘP → ';
      console.log(`    ${vai} thread #${t.id} ${t.type.padEnd(5)} tạo ${new Date(t.created_at).toISOString().slice(0, 16)} · ${t.so_tin} tin · tin cuối ${t.last_message_at ? new Date(t.last_message_at).toISOString().slice(0, 16) : '—'}`);
      if (t !== giu) tongTin += t.so_tin;
    }
  }
  console.log(`\n${trung.length} nhóm trùng · ${trung.reduce((n, [, ds]) => n + ds.length - 1, 0)} hội thoại sẽ gộp · ${tongTin} tin sẽ chuyển.`);

  if (!APPLY) {
    console.log('\n(DRY — chưa đổi gì. Chạy lại với --apply để gộp.)');
    return;
  }

  for (const [k, ds] of trung) {
    const giu = ds[0];
    const bo = ds.slice(1);
    const boIds = bo.map((t) => t.id);
    await prisma.$transaction(async (tx) => {
      // 1. Tin nhắn
      const daChuyen = await tx.$executeRaw`UPDATE messages SET thread_id = ${giu.id} WHERE thread_id = ANY(${boIds}::int[])`;
      // 2. Mốc đọc: giữ mốc muộn nhất mỗi người
      await tx.$executeRaw`
        INSERT INTO message_reads (thread_id, user_id, last_read_at, updated_at)
        SELECT ${giu.id}, user_id, MAX(last_read_at), NOW() FROM message_reads
        WHERE thread_id = ANY(${[giu.id, ...boIds]}::int[]) GROUP BY user_id
        ON CONFLICT (thread_id, user_id) DO UPDATE
          SET last_read_at = GREATEST(message_reads.last_read_at, EXCLUDED.last_read_at), updated_at = NOW()`;
      await tx.$executeRaw`DELETE FROM message_reads WHERE thread_id = ANY(${boIds}::int[])`;
      // 3. Biệt danh: chuyển cái chưa có, bỏ cái trùng
      await tx.$executeRaw`
        UPDATE thread_nicknames n SET thread_id = ${giu.id}
        WHERE n.thread_id = ANY(${boIds}::int[])
          AND NOT EXISTS (SELECT 1 FROM thread_nicknames x WHERE x.thread_id = ${giu.id} AND x.owner_id = n.owner_id AND x.target_id = n.target_id)`;
      await tx.$executeRaw`DELETE FROM thread_nicknames WHERE thread_id = ANY(${boIds}::int[])`;
      // 4. Báo cáo
      await tx.$executeRaw`UPDATE thread_reports SET thread_id = ${giu.id} WHERE thread_id = ANY(${boIds}::int[])`;
      // 5–6. Tuỳ chọn + mốc tin cuối
      const prefs = gopPreferences(ds.map((t) => t.preferences));
      const cuoi = ds.map((t) => t.last_message_at).filter(Boolean).sort((x, y) => moc(y) - moc(x))[0] ?? null;
      await tx.$executeRaw`UPDATE message_threads SET preferences = ${JSON.stringify(prefs)}::jsonb, last_message_at = ${cuoi}, updated_at = NOW() WHERE id = ${giu.id}`;
      // 7. Kiểm rồi mới xoá vỏ hội thoại rỗng
      const [{ con }] = await tx.$queryRaw`SELECT COUNT(*)::int AS con FROM messages WHERE thread_id = ANY(${boIds}::int[])`;
      if (con !== 0) throw new Error(`nhóm ${k}: còn ${con} tin ở hội thoại bị gộp — DỪNG, cuộn lại`);
      await tx.$executeRaw`DELETE FROM message_threads WHERE id = ANY(${boIds}::int[])`;
      console.log(`✓ ${k}: gộp #${boIds.join(', #')} → #${giu.id} (${daChuyen} tin)`);
    }, { timeout: 60_000 });
  }
  console.log('\nXong.');
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());

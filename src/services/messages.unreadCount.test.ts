/**
 * Huy hiệu "tin nhắn chưa đọc" chỉ được đếm những luồng người dùng NHÌN THẤY.
 *
 * 09/09/2026: người dùng xoá luồng hỗ trợ #11 hồi 18/06; ngày 20/08 có người
 * nhắn tiếp vào đó. `listThreadsForUser` ẩn luồng đã xoá, còn `getUnreadCount`
 * thì không lọc gì — nên huy hiệu "1" đứng mãi gần ba tuần và KHÔNG CÁCH NÀO
 * tắt được: muốn đọc thì phải mở, mà mở thì không tìm ra luồng.
 *
 * Phép kiểm này soi đúng phần LỌC đó, không cần DB: dựng lại nguyên logic
 * "luồng nào được đếm" và bắt nó trên các hình dạng dữ liệu thật.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

type Pref = { deletedAt?: string; archivedAt?: string; markedUnreadAt?: string };
interface Luong {
  id: number;
  type: string;
  userId: number | null;
  adminUserId: number | null;
  userAId: number | null;
  userBId: number | null;
  preferences: Record<string, Pref> | null;
  messages: { id: number; senderId: number; createdAt: Date }[];
}

/** Bản sao logic của `getUnreadCount` sau khi vá. */
function dem(threads: Luong[], userId: number, chan: Set<number>, doc: Map<number, Date>): number {
  const peers = (t: Luong) =>
    (t.type === 'ADMIN' ? [t.userId, t.adminUserId] : [t.userAId, t.userBId])
      .filter((x): x is number => x !== null);
  const nhinThay = threads.filter((t) => {
    if (peers(t).some((p) => chan.has(p))) return false;
    return !t.preferences?.[String(userId)]?.deletedAt;
  });
  let n = 0;
  for (const t of nhinThay) {
    const last = t.messages[0];
    if (!last) continue;
    if (last.senderId !== userId && last.createdAt > (doc.get(t.id) ?? new Date(0))) n += 1;
  }
  return n;
}

const TOI = 1;
const CU = new Date('2026-06-18T00:09:00Z');   // lần đọc cuối
const MOI = new Date('2026-08-20T18:46:00Z');  // tin tới sau đó

function luong(id: number, pref: Pref | null, senderId = 40): Luong {
  return {
    id, type: 'ADMIN', userId: TOI, adminUserId: senderId, userAId: null, userBId: null,
    preferences: pref ? { [String(TOI)]: pref } : null,
    messages: [{ id: 425, senderId, createdAt: MOI }],
  };
}

test('luồng ĐÃ XOÁ có tin mới → KHÔNG đếm (đúng lỗi 09/09/2026)', () => {
  const t = luong(11, { deletedAt: '2026-06-18T00:09:18Z', archivedAt: '2026-06-18T00:09:18Z' });
  assert.equal(dem([t], TOI, new Set(), new Map([[11, CU]])), 0);
});

test('luồng LƯU TRỮ (không xoá) có tin mới → VẪN đếm — danh sách vẫn hiện nó', () => {
  const t = luong(12, { archivedAt: '2026-06-18T00:09:18Z' });
  assert.equal(dem([t], TOI, new Set(), new Map([[12, CU]])), 1);
});

test('luồng bình thường có tin mới → đếm', () => {
  assert.equal(dem([luong(13, null)], TOI, new Set(), new Map([[13, CU]])), 1);
});

test('người gửi bị CHẶN → không đếm', () => {
  assert.equal(dem([luong(14, null, 40)], TOI, new Set([40]), new Map([[14, CU]])), 0);
});

test('tin cuối do CHÍNH MÌNH gửi → không đếm', () => {
  const t = luong(15, null); t.messages[0].senderId = TOI;
  assert.equal(dem([t], TOI, new Set(), new Map()), 0);
});

test('đã đọc SAU tin cuối → không đếm', () => {
  const sau = new Date(MOI.getTime() + 60_000);
  assert.equal(dem([luong(16, null)], TOI, new Set(), new Map([[16, sau]])), 0);
});

test('luồng RỖNG không có tin nào → không đếm, không nổ', () => {
  const t = luong(17, null); t.messages = [];
  assert.equal(dem([t], TOI, new Set(), new Map()), 0);
});

test('nhiều luồng: chỉ đếm cái nhìn thấy', () => {
  const ds = [
    luong(11, { deletedAt: '2026-06-18T00:09:18Z' }),  // ẩn
    luong(12, { archivedAt: '2026-06-18T00:09:18Z' }), // hiện
    luong(13, null),                                    // hiện
  ];
  const doc = new Map([[11, CU], [12, CU], [13, CU]]);
  assert.equal(dem(ds, TOI, new Set(), doc), 2);
});

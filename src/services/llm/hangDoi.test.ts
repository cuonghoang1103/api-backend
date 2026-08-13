/**
 * Kiểm bộ xếp hàng máy nhà.
 *
 * ⚠️ Vì sao phải có file này: cả hai lớp đều là logic ĐỒNG THỜI, và loại lỗi
 * của nó không bao giờ hiện ra lúc đọc mã — nó hiện ra dưới tải, ở
 * production, dưới dạng "robot thỉnh thoảng câm" hoặc tệ hơn: một slot bị rò
 * và máy nhà im vĩnh viễn cho tới lần restart sau. Đọc không ra, chạy mới
 * biết. Xem [[feedback_verify_by_running_not_reading]].
 *
 *     npx tsx --test src/services/llm/hangDoi.test.ts
 *
 * Quy ước cho mọi bài kiểm ở đây: `LLM_ROBOT_GIU_MS` mặc định TẮT (0), vì
 * cửa sổ giữ chỗ là trạng thái sống dai giữa các bài kiểm — bật nó ở bài
 * này là bài sau nhận một máy nhà "đang bị robot giữ" mà không hiểu vì sao.
 * Bài nào cần thì tự bật rồi tự tắt.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { xinSlot, thongKe, xoaDem } from './hangDoi.js';

function dat(bien: Record<string, string>): void {
  for (const [k, v] of Object.entries(bien)) process.env[k] = v;
}

/** Nhường một vòng event-loop để các promise đang chờ kịp chạy tiếp. */
const nhuong = () => new Promise((r) => setImmediate(r));
const nghi = (ms: number) => new Promise((r) => setTimeout(r, ms));

beforeEach(() => {
  dat({
    LLM_LOCAL_SLOTS: '1',
    LLM_LOCAL_HANG_TOI_DA: '2',
    LLM_LOCAL_CHO_MS: '2000',
    LLM_ROBOT_CHO_MS: '2000',
    LLM_ROBOT_GIU_MS: '0',
  });
  xoaDem();
});

test('một slot: người thứ hai phải chờ, không được chạy song song', async () => {
  const a = await xinSlot('nguoi');
  assert.equal(a.duoc, true);
  assert.equal(thongKe().dangChay, 1);

  let bXong = false;
  const b = xinSlot('nguoi').then((v) => {
    bXong = true;
    return v;
  });

  await nhuong();
  assert.equal(bXong, false, 'người thứ hai KHÔNG được vào khi slot đang bận');
  assert.equal(thongKe().dangDoi, 1);

  a.tra();
  const vb = await b;
  assert.equal(vb.duoc, true);
  assert.ok(vb.choMs >= 0);
  vb.tra();
  assert.equal(thongKe().dangChay, 0);
});

test('LỚP 1 — robot chen lên trước người đã xếp hàng sẵn', async () => {
  const a = await xinSlot('nguoi'); // đang chiếm slot

  const thuTu: string[] = [];
  // Web xếp hàng TRƯỚC…
  const web = xinSlot('nguoi').then((v) => {
    thuTu.push('web');
    return v;
  });
  // …robot tới SAU, nhưng phải được gọi TRƯỚC.
  const robot = xinSlot('robot').then((v) => {
    thuTu.push('robot');
    return v;
  });

  await nhuong();
  assert.equal(thongKe().dangDoi, 2);

  a.tra();
  const vr = await robot;
  assert.equal(vr.duoc, true);
  assert.deepEqual(thuTu, ['robot'], 'robot phải được phục vụ trước web đã đợi sẵn');

  vr.tra();
  const vw = await web;
  assert.equal(vw.duoc, true);
  assert.deepEqual(thuTu, ['robot', 'web']);
  vw.tra();
});

test('LỚP 1 — robot với robot vẫn công bằng theo thứ tự đến', async () => {
  const a = await xinSlot('robot');
  const thuTu: string[] = [];
  const r1 = xinSlot('robot').then((v) => (thuTu.push('r1'), v));
  const r2 = xinSlot('robot').then((v) => (thuTu.push('r2'), v));

  await nhuong();
  a.tra();
  const v1 = await r1;
  v1.tra();
  const v2 = await r2;
  v2.tra();
  assert.deepEqual(thuTu, ['r1', 'r2'], 'robot không được chen ngang robot khác');
});

test('LỚP 2 — hàng đầy thì web đi thẳng ra cổng, KHÔNG chờ', async () => {
  dat({ LLM_LOCAL_HANG_TOI_DA: '1' });
  const a = await xinSlot('nguoi');
  const b = xinSlot('nguoi'); // lấp đúng 1 chỗ trong hàng
  await nhuong();

  const truoc = Date.now();
  const c = await xinSlot('nguoi'); // hàng đã đầy
  assert.equal(c.duoc, false);
  assert.equal(c.lyDo, 'day-hang');
  assert.ok(Date.now() - truoc < 50, 'phải từ chối NGAY, không được ngồi chờ');

  a.tra();
  (await b).tra();
});

test('LỚP 2 — chờ quá trần thì bỏ hàng, đi cổng', async () => {
  dat({ LLM_LOCAL_CHO_MS: '120' });
  const a = await xinSlot('nguoi');

  const b = await xinSlot('nguoi'); // xếp hàng rồi hết giờ
  assert.equal(b.duoc, false);
  assert.equal(b.lyDo, 'cho-qua-lau');
  assert.ok(b.choMs >= 100, `phải chờ gần đủ trần rồi mới bỏ, đo được ${b.choMs}ms`);
  assert.equal(thongKe().dangDoi, 0, 'bỏ hàng thì phải RÚT khỏi hàng, không để lại rác');

  a.tra();
  // Slot phải còn nguyên vẹn sau khi một người bỏ hàng.
  const c = await xinSlot('nguoi');
  assert.equal(c.duoc, true);
  c.tra();
});

test('LỚP 2 ⭐ — robot vừa nói xong thì web bị đẩy ra cổng ngay', async () => {
  dat({ LLM_ROBOT_GIU_MS: '400' });
  const r = await xinSlot('robot');
  r.tra(); // cửa sổ giữ chỗ bắt đầu tính TỪ ĐÂY

  assert.equal(thongKe().dangChay, 0, 'máy đang RẢNH…');
  const w = await xinSlot('nguoi');
  assert.equal(w.duoc, false, '…nhưng web vẫn không được vào, vì robot đang giữ');
  assert.equal(w.lyDo, 'robot-giu');
  assert.ok((thongKe().robotGiuConMs as number) > 0);

  // Robot thì đi vào bình thường trong chính cửa sổ đó.
  const r2 = await xinSlot('robot');
  assert.equal(r2.duoc, true);
  r2.tra();

  await nghi(450);
  const w2 = await xinSlot('nguoi');
  assert.equal(w2.duoc, true, 'hết cửa sổ giữ chỗ thì web phải vào lại được');
  w2.tra();
  dat({ LLM_ROBOT_GIU_MS: '0' });
});

test('LỚP 2 — việc chạy nền nhường ngay khi máy có người', async () => {
  const a = await xinSlot('nguoi');
  const n = await xinSlot('nen');
  assert.equal(n.duoc, false);
  assert.equal(n.lyDo, 'nen-nhuong');
  a.tra();

  const n2 = await xinSlot('nen');
  assert.equal(n2.duoc, true, 'máy rảnh thì việc nền vẫn được chạy');
  n2.tra();
});

test('gọi tra() hai lần KHÔNG được thả quá số slot', async () => {
  // Đây là lỗi âm thầm nguy nhất: `_dangChay` tụt xuống dưới số thật, rồi
  // hàng đợi thả 2-3 người vào một máy chỉ có 1 luồng, và triệu chứng duy
  // nhất là "máy nhà tự dưng chậm gấp đôi".
  const a = await xinSlot('nguoi');
  a.tra();
  a.tra();
  a.tra();
  assert.equal(thongKe().dangChay, 0);

  const b = await xinSlot('nguoi');
  assert.equal(thongKe().dangChay, 1, 'vẫn đúng 1 sau ba lần trả thừa');
  let cXong = false;
  const c = xinSlot('nguoi').then((v) => ((cXong = true), v));
  await nhuong();
  assert.equal(cXong, false, 'slot thứ hai KHÔNG được mở ra từ hư không');
  b.tra();
  (await c).tra();
});

test('nhiều slot: chạy song song đúng bằng LLM_LOCAL_SLOTS', async () => {
  dat({ LLM_LOCAL_SLOTS: '3' });
  const ve = [await xinSlot('nguoi'), await xinSlot('nguoi'), await xinSlot('nguoi')];
  assert.equal(thongKe().dangChay, 3);
  ve.forEach((v) => assert.equal(v.duoc, true));

  let thu4 = false;
  const d = xinSlot('nguoi').then((v) => ((thu4 = true), v));
  await nhuong();
  assert.equal(thu4, false, 'người thứ 4 phải chờ khi cả 3 slot đều bận');

  ve[0].tra();
  (await d).tra();
  ve[1].tra();
  ve[2].tra();
  assert.equal(thongKe().dangChay, 0, 'trả hết thì phải về 0 — rò một slot là hỏng vĩnh viễn');
});

test('HANG_TOI_DA=0 nghĩa là "không xếp hàng", KHÔNG phải "tắt máy nhà"', async () => {
  dat({ LLM_LOCAL_HANG_TOI_DA: '0' });
  const a = await xinSlot('nguoi');
  assert.equal(a.duoc, true, 'máy đang rảnh thì vẫn phải được dùng');
  const b = await xinSlot('nguoi'); // máy bận + cấm xếp hàng ⇒ ra cổng ngay
  assert.equal(b.duoc, false);
  assert.equal(b.lyDo, 'day-hang');
  a.tra();
});

test('bộ đếm quản trị phản ánh đúng chuyện đã xảy ra', async () => {
  dat({ LLM_LOCAL_HANG_TOI_DA: '0' });
  const a = await xinSlot('nguoi');
  const b = await xinSlot('nguoi'); // bị đẩy ra cổng
  a.tra();
  assert.equal(b.duoc, false);

  const tk = thongKe() as any;
  assert.equal(tk.daXin.nguoi, 2);
  assert.equal(tk.daVao.nguoi, 1);
  assert.equal(tk.daDayRaCong['day-hang'], 1);
  assert.equal(tk.slots, 1);
});

/**
 * Hàng phát chảy dần + ⏸ Tạm dừng / ▶ Tiếp tục (19/10/2026). Bộ phát giả, không DOM.
 *   npx tsx --test frontend/src/components/sach-hoc/goi/hangPhat.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { taoHangPhat, type MayPhat } from './hangPhat';

/** Bộ phát giả: ghi lại thứ tự phát; `ketThucCau()` = câu đang kêu đọc xong. */
function mayGia() {
  const nhatKy: string[] = [];
  let onEnd: (() => void) | null = null;
  let dangKeu: string | null = null;
  let tamDung = false;
  const may: MayPhat = {
    play: (urls, f) => { onEnd = f; dangKeu = urls.join('+'); nhatKy.push(`phát ${dangKeu}`); },
    stopAudio: () => { const f = onEnd; onEnd = null; dangKeu = null; f?.(); },
    tamDungAudio: () => { if (!dangKeu) return false; tamDung = true; nhatKy.push(`dừng ${dangKeu}`); return true; },
    tiepAudio: () => { if (tamDung) { tamDung = false; nhatKy.push(`tiếp ${dangKeu}`); } },
  };
  const ketThucCau = () => { const f = onEnd; onEnd = null; dangKeu = null; f?.(); };
  return { may, nhatKy, ketThucCau };
}

test('câu đầu phát NGAY khi tới, câu sau xếp hàng; hết hàng + xong ⇒ onHet đúng một lần', () => {
  const { may, nhatKy, ketThucCau } = mayGia();
  let het = 0;
  const h = taoHangPhat({ onHet: () => { het++; } }, may);
  h.them(['a']);
  assert.deepEqual(nhatKy, ['phát a']);
  h.them(['b']);
  assert.deepEqual(nhatKy, ['phát a']); // b chờ
  ketThucCau();
  assert.deepEqual(nhatKy, ['phát a', 'phát b']);
  h.xong();
  assert.equal(het, 0); // b còn đang kêu
  ketThucCau();
  assert.equal(het, 1);
  h.xong();
  assert.equal(het, 1);
});

test('⏸ giữa câu: câu dừng tại chỗ, câu mới tới KHÔNG phát; ▶ phát tiếp đúng chỗ rồi mới tới câu sau', () => {
  const { may, nhatKy, ketThucCau } = mayGia();
  let het = 0;
  const h = taoHangPhat({ onHet: () => { het++; } }, may);
  h.them(['a']);
  h.dung();
  h.them(['b']);
  h.xong();
  assert.deepEqual(nhatKy, ['phát a', 'dừng a']);
  assert.equal(het, 0, 'đang dừng thì chưa được coi là nói xong (không tự bật micro)');
  h.chay();
  assert.deepEqual(nhatKy, ['phát a', 'dừng a', 'tiếp a']);
  ketThucCau();
  assert.deepEqual(nhatKy.at(-1), 'phát b');
  ketThucCau();
  assert.equal(het, 1);
});

test('⏸ khi đang chờ máy chủ (chưa câu nào): câu tới chỉ xếp hàng; ▶ mới phát', () => {
  const { may, nhatKy } = mayGia();
  const h = taoHangPhat({ onHet: () => {} }, may);
  h.dung();
  h.them(['a']);
  assert.deepEqual(nhatKy, []);
  h.chay();
  assert.deepEqual(nhatKy, ['phát a']);
});

test('hủy: dừng tiếng, không báo onHet, câu tới sau bị bỏ', () => {
  const { may, nhatKy } = mayGia();
  let het = 0;
  const h = taoHangPhat({ onHet: () => { het++; } }, may);
  h.them(['a']);
  h.huy();
  h.them(['b']);
  h.xong();
  assert.deepEqual(nhatKy, ['phát a']);
  assert.equal(het, 0);
});

/**
 * Chốt chặn DUY NHẤT cho chỗ dễ lệch nhất của việc bán key terminal:
 * cùng một con số hạn mức sống ở BA nơi, và không có gì ở lúc build bắt được
 * khi chúng lệch nhau.
 *
 *   1. `goiKeyTerminal.ts`        — thứ backend ghi vào LlmKeyRequest.quotaUsd
 *   2. `canh/han-muc.json`        — thứ THẬT SỰ nạp quota vào New API
 *   3. mô tả sản phẩm trong DB    — thứ khách đọc rồi trả tiền
 *
 * (3) nằm trong dữ liệu nên phép kiểm này không với tới; (1) và (2) thì với
 * được, và đó cũng là cặp nguy hiểm nhất: lệch ở đây nghĩa là bán gói 150$
 * mà key chỉ được nạp 10$ — khách trả tiền rồi mới phát hiện.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GOI_KEY_TERMINAL, goiTheoSlug } from './goiKeyTerminal.js';

const hanMuc = JSON.parse(
  readFileSync(new URL('../../../services/cong-llm/canh/han-muc.json', import.meta.url), 'utf8'),
) as { mac_dinh_usd: number; theo_ten: Record<string, number> };

const SO_KEY_MOI_GOI = 10;

test('mỗi gói có đủ 10 key trong han-muc.json, đúng hạn mức', () => {
  for (const [slug, goi] of Object.entries(GOI_KEY_TERMINAL)) {
    for (let i = 1; i <= SO_KEY_MOI_GOI; i++) {
      const ten = `${goi.tienTo}-${String(i).padStart(2, '0')}`;
      assert.equal(
        hanMuc.theo_ten[ten],
        goi.quotaUsd,
        `${slug}: han-muc.json thiếu hoặc sai hạn mức cho key "${ten}"`,
      );
    }
  }
});

test('không có key shop-* nào trong han-muc.json mà bảng gói không biết', () => {
  const hopLe = new Set<string>();
  for (const goi of Object.values(GOI_KEY_TERMINAL)) {
    for (let i = 1; i <= SO_KEY_MOI_GOI; i++) hopLe.add(`${goi.tienTo}-${String(i).padStart(2, '0')}`);
  }
  const mocoi = Object.keys(hanMuc.theo_ten).filter((t) => t.startsWith('shop-') && !hopLe.has(t));
  assert.deepEqual(mocoi, [], 'key shop-* mồ côi trong han-muc.json — bán rồi mà bảng gói không biết');
});

test('ba tiền tố khác nhau — không gói nào mượn key của gói khác', () => {
  const tienTo = Object.values(GOI_KEY_TERMINAL).map((g) => g.tienTo);
  assert.equal(new Set(tienTo).size, tienTo.length);
});

test('goiTheoSlug trả null cho slug lạ và cho rỗng', () => {
  assert.equal(goiTheoSlug('khong-co-that'), null);
  assert.equal(goiTheoSlug(null), null);
  assert.equal(goiTheoSlug(''), null);
  assert.equal(goiTheoSlug('cuongmini-terminal-co-ban-30-ngay')?.quotaUsd, 60);
});

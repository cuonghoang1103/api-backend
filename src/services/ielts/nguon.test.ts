/**
 * CHỐT CHỐNG TRÔI: bản sao IELTS trong `content/` phải khớp nguồn của web.
 * ─────────────────────────────────────────────────────────────────────────
 * Nội dung IELTS có HAI bản:
 *   · nguồn  — `frontend/src/app/tech-trends/ielts/data/**.ts`  (web đọc)
 *   · bản sao — `content/ielts/noi-dung.json`                    (app đọc qua DB)
 *
 * Sửa nguồn rồi quên chạy `npx tsx scripts/ielts-dung-json.mts` thì app hiện
 * bản cũ: không lỗi, không cảnh báo, chỉ là sai — đúng loại lỗi im lặng đã
 * làm vỡ seed trên production 08/08/2026 (union enum chép tay).
 *
 * Phép kiểm này băm toàn bộ tệp nguồn rồi so với `nguonSha` cất trong JSON.
 * Nó nằm trong `npm test`, mà `npm test` là một trong năm bộ kiểm BẮT BUỘC
 * `deploy-nha.sh` chạy trước khi push (`:699-746`) — nên bản sao cũ thì
 * KHÔNG đẩy lên được. Chốt thật, không phải lời nhắn cho người sau.
 *
 * Thiếu `frontend/` thì BỎ QUA chứ không đỏ: ảnh backend không chứa thư mục
 * đó, và một phép kiểm đỏ vì môi trường thiếu thứ nó không cần là phép kiểm
 * sẽ bị ai đó tắt đi.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const NGUON = path.join(ROOT, 'frontend/src/app/tech-trends/ielts/data');
const BAN_SAO = path.join(ROOT, 'content/ielts/noi-dung.json');

/** Cùng công thức với `scripts/ielts-dung-json.mts`. Đổi một bên phải đổi bên kia. */
function bamNguon(thuMuc: string): string {
  const tep: string[] = [];
  const di = (d: string) => {
    for (const m of readdirSync(d, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const p = path.join(d, m.name);
      if (m.isDirectory()) di(p);
      else if (m.name.endsWith('.ts')) tep.push(p);
    }
  };
  di(thuMuc);
  const h = createHash('sha256');
  for (const p of tep) {
    h.update(path.relative(thuMuc, p));
    h.update(readFileSync(p));
  }
  return h.digest('hex');
}

test('IELTS: bản sao trong content/ khớp nguồn TS của web', (t) => {
  if (!existsSync(NGUON)) {
    t.skip('không có frontend/ ở môi trường này');
    return;
  }
  assert.ok(
    existsSync(BAN_SAO),
    'thiếu content/ielts/noi-dung.json — chạy: npx tsx scripts/ielts-dung-json.mts',
  );

  const goi = JSON.parse(readFileSync(BAN_SAO, 'utf8'));
  assert.equal(
    goi.nguonSha,
    bamNguon(NGUON),
    'content/ielts/noi-dung.json CŨ HƠN dữ liệu web — chạy: npx tsx scripts/ielts-dung-json.mts',
  );
});

test('IELTS: bản sao có đủ bốn chặng và phần dùng chung', () => {
  if (!existsSync(BAN_SAO)) return;
  const hang: { stage: string; kind: string; soMuc: number }[] = JSON.parse(readFileSync(BAN_SAO, 'utf8')).hang;

  for (const chang of ['stage1', 'stage2', 'stage3', 'stage4']) {
    for (const kind of ['meta', 'units', 'vocab', 'readings', 'listenings', 'writings', 'speakings', 'exercises']) {
      assert.ok(hang.some((h) => h.stage === chang && h.kind === kind), `thiếu ${chang}/${kind}`);
    }
  }
  for (const kind of ['roadmap', 'life', 'exam', 'typing']) {
    assert.ok(hang.some((h) => h.stage === 'shared' && h.kind === kind), `thiếu shared/${kind}`);
  }

  // Một phần RỖNG vẫn lọt qua phép kiểm "có mặt" ở trên. Bài đọc là thứ
  // người học mở đầu tiên, nên nó phải có thật chứ không chỉ có tên.
  for (const chang of ['stage1', 'stage2', 'stage3', 'stage4']) {
    const r = hang.find((h) => h.stage === chang && h.kind === 'readings');
    assert.ok((r?.soMuc ?? 0) > 0, `${chang}/readings rỗng`);
  }
});

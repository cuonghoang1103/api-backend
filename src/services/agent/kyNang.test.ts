/**
 * KỸ NĂNG — canh chuỗi nối từ app tới prompt.
 *
 * Chốt cuối cùng trong file này canh đúng chỗ vừa hở khi làm tính năng: kiểu
 * `kyNang` đã khai trong `turn.ts` nhưng KHÔNG được truyền vào
 * `buildSystemPrompt`. TypeScript sạch, không lỗi ở tầng nào, và danh sách kỹ
 * năng đơn giản là không bao giờ tới model — đúng loại hỏng phải chạy mới biết.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSystemPrompt, LOI_LAM_VIEC } from './prompt.js';
import { toolsForGateway, ALL_CAPABILITIES } from './tools.js';

test('prompt liệt kê tên + mô tả kỹ năng', () => {
  const p = buildSystemPrompt({
    capabilities: ['fs_read', 'ky_nang'],
    kyNang: [{ ten: 'ra-de', moTa: 'Soạn đề thi 50 câu song ngữ' }],
  });
  assert.match(p, /KỸ NĂNG CỦA DỰ ÁN/);
  assert.match(p, /ra-de/);
  assert.match(p, /Soạn đề thi 50 câu song ngữ/);
  assert.match(p, /dung_ky_nang/, 'phải nói cách LẤY thân, không chỉ liệt kê tên');
});

test('không có kỹ năng ⇒ KHÔNG có mục nào trong prompt', () => {
  const p = buildSystemPrompt({ capabilities: ['fs_read'] });
  assert.ok(!p.includes('KỸ NĂNG CỦA DỰ ÁN'),
    'mục rỗng vẫn tốn token ở mọi lượt của mọi dự án không dùng kỹ năng');
});

test('tool `dung_ky_nang` CHỈ xuất hiện khi có capability ky_nang', () => {
  const co = toolsForGateway(['fs_read', 'ky_nang'], []).map((t: any) => t.function.name);
  const khong = toolsForGateway(['fs_read'], []).map((t: any) => t.function.name);
  assert.ok(co.includes('dung_ky_nang'));
  assert.ok(!khong.includes('dung_ky_nang'),
    'app cũ không chạy được tool này — gửi xuống là model gọi rồi nhận lỗi ở mọi lần');
});

test('ky_nang có trong ALL_CAPABILITIES', () => {
  /* Thiếu ở đây thì `parseCapabilities` VỨT ÂM THẦM: app gửi đúng, máy chủ
     không gửi tool xuống, model lịch sự nói "tôi không có tool đó". Đã dính
     đúng vậy với `browser` ngày 19/08/2026. */
  assert.ok((ALL_CAPABILITIES as readonly string[]).includes('ky_nang'));
});

test('turn.ts THẬT SỰ truyền kyNang vào buildSystemPrompt', () => {
  const nguon = readFileSync(join(import.meta.dirname, 'turn.ts'), 'utf8');
  const i = nguon.indexOf('buildSystemPrompt({');
  const j = nguon.indexOf('});', i);
  assert.ok(i > 0 && j > i);
  assert.match(nguon.slice(i, j), /kyNang/,
    'khai kiểu mà quên truyền ⇒ tsc sạch, không lỗi, danh sách không tới model');
});

test('kho kỹ năng cài sẵn: mọi file .md hợp lệ, tên = tên file, và đều ĐÓNG GÓI trong app', async () => {
  const { dsKyNangSan } = await import('./kyNangSan.js');
  const { readdirSync } = await import('node:fs');
  const thuMuc = join(import.meta.dirname, 'kyNangSan');
  const file = readdirSync(thuMuc).filter((f) => f.endsWith('.md')).sort();
  const { ds } = await dsKyNangSan();
  /* Một file bị loại ÂM THẦM (thiếu name/description, tên sai luật) thì
     model không bao giờ thấy kỹ năng đó — không có lỗi nào báo. */
  assert.deepEqual(ds.map((k) => `${k.ten}.md`).sort(), file);
  for (const k of ds) {
    assert.ok(k.moTa.length > 40 && k.moTa.length <= 300, `${k.ten}: mô tả 41–300 ký tự (model chọn kỹ năng CHỈ bằng mô tả)`);
    assert.ok(k.than.length > 1500, `${k.ten}: thân quá mỏng`);
  }
  for (const ten of ['docker', 'may-ao', 'vps-ssh-deploy', 'video', 'blender-3d', 'ios-xcode', 'android', 'sua-loi-may']) {
    assert.ok(ds.some((k) => k.ten === ten), `thiếu kỹ năng đợt 2: ${ten}`);
  }
  // Bản đóng gói của app (dùng khi không tải được từ máy chủ) phải có ĐỦ — thiếu thì máy mất mạng mất kỹ năng.
  const goi = readFileSync(join(import.meta.dirname, '../../../desktop/src/main/agent/kyNangSan/index.ts'), 'utf8');
  for (const f of file) assert.ok(goi.includes(`kyNangSan/${f}?raw`), `desktop kyNangSan/index.ts chưa import ${f}`);
});

test('prompt nói rõ kỹ năng gồm cả bộ CÀI SẴN, và luật làm việc nêu tên kỹ năng đợt 2', () => {
  const p = buildSystemPrompt({ capabilities: ['fs_read', 'ky_nang'], kyNang: [{ ten: 'docker', moTa: 'Docker trên mọi HĐH' }] });
  assert.match(p, /KỸ NĂNG CỦA DỰ ÁN VÀ CÀI SẴN/);
  assert.match(LOI_LAM_VIEC, /sua-loi-may/, 'LOI_LAM_VIEC (turn.ts nối cho mọi model) phải nêu tên kỹ năng đợt 2');
  assert.match(p, /TÌM WEB/);
  assert.match(p, /tim_web/);
});

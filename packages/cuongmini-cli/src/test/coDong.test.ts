import assert from 'node:assert/strict';
import { test } from 'node:test';
import { datNgonNgu } from '../i18n';
import { cheDoKe, cheDoTuChu, moTaCheDo } from '../cheDo';
import { phanTichCo } from '../coDong';

// Các phép kiểm dưới so chữ giao diện tiếng Việt.
datNgonNgu('vi');

test('cờ: tương tác, câu hỏi, -p, -c, --model, --che-do', () => {
  assert.deepEqual(phanTichCo([]), { lenh: 'chat', cauHoi: '', cheDoIn: false, tiepTuc: false });
  assert.equal(phanTichCo(['giải', 'thích', 'dự án']).cauHoi, 'giải thích dự án');
  const p = phanTichCo(['-p', 'tóm tắt', '--model', 'opus-4-8', '--che-do', 'tự động', '-c']);
  assert.equal(p.cheDoIn, true);
  assert.equal(p.cauHoi, 'tóm tắt');
  assert.equal(p.model, 'opus-4-8');
  assert.equal(p.cheDo, 'tuSuaVaLenh');
  assert.equal(p.tiepTuc, true);
  assert.equal(phanTichCo(['--model=gpt-sol']).model, 'gpt-sol');
  assert.equal(phanTichCo(['-C', '/tmp', 'x']).thuMuc, '/tmp');
});

test('cờ: lệnh phụ chỉ khi đứng một mình', () => {
  assert.equal(phanTichCo(['login']).lenh, 'login');
  assert.equal(phanTichCo(['logout']).lenh, 'logout');
  assert.equal(phanTichCo(['update']).lenh, 'capNhat');
  assert.deepEqual([phanTichCo(['login', 'lỗi', 'gì']).lenh, phanTichCo(['login', 'lỗi', 'gì']).cauHoi], ['chat', 'login lỗi gì']);
  assert.equal(phanTichCo(['-p', 'login']).lenh, 'chat');
});

test('cờ: version/help, lỗi rõ ràng', () => {
  assert.equal(phanTichCo(['-v']).lenh, 'version');
  assert.equal(phanTichCo(['--help']).lenh, 'help');
  assert.match(phanTichCo(['--xyz']).loi ?? '', /Không rõ cờ --xyz/);
  assert.match(phanTichCo(['--model']).loi ?? '', /cần một giá trị/);
  assert.match(phanTichCo(['--che-do', 'lung-tung']).loi ?? '', /Không rõ chế độ/);
  assert.equal(phanTichCo(['--', '-p', 'x']).cauHoi, '-p x');
});

test('chế độ quyền: xoay vòng 5 chế độ, bí danh', () => {
  const vong: string[] = [];
  let c: string = 'keHoach';
  for (let i = 0; i < 6; i += 1) { vong.push(c); c = cheDoKe(c); }
  assert.deepEqual(vong, ['keHoach', 'hoi', 'tuSua', 'tuSuaVaLenh', 'boQuaHet', 'keHoach']);
  assert.equal(cheDoKe(undefined), 'tuSua', 'chưa rõ = đang ở mặc định của lõi (Hỏi trước)');
  assert.equal(cheDoTuChu('Bỏ qua hết'), 'boQuaHet');
  assert.equal(cheDoTuChu('plan'), 'keHoach');
  assert.equal(cheDoTuChu('acceptEdits'), 'tuSua');
  assert.equal(cheDoTuChu('???'), null);
  assert.equal(moTaCheDo('lạ').id, 'hoi');
});

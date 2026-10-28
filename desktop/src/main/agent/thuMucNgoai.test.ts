/**
 * `xin_quyen_thu_muc` (28/10/2026) — xin truy cập thư mục NGOÀI dự án bằng thẻ quyền thay cho bắt người dùng kéo tay.
 * Kiểm: thẻ LUÔN hiện (kể cả "Bỏ qua hết" / tự sửa), mặc định chỉ đọc, "đọc + sửa" chỉ khi bấm đúng nút, từ chối ⇒ không cấp
 * gì, luật cũ (nhà / ổ đĩa / symlink / .env) giữ nguyên, sửa trong thư mục ngoài LUÔN có thẻ duyệt.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { _xoaQuyenDocNgoai, dsThuMucDocNgoai, dsThuMucGhiNgoai, loiNgoaiChuaCap } from './jail';
import { taoSoCuoc } from './so';
import { traLoi, type QuyetDinh } from './xinPhep';

vi.mock('electron', () => ({ app: { getPath: () => os.tmpdir(), isPackaged: false } }));
const { chayToolAgent } = await import('./tools');
const { xinQuyenThuMuc, moRongDuong } = await import('./thuMucNgoai');

let goc = '';
let ngoai = '';
beforeEach(async () => {
  _xoaQuyenDocNgoai();
  goc = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'ct-duan-')));
  ngoai = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'SWT301-SportShop-')));
  await fs.mkdir(path.join(ngoai, 'test'), { recursive: true });
  await fs.writeFile(path.join(ngoai, 'test', 'LoginTest.java'), 'class LoginTest { void dangNhap() {} }\n');
  await fs.writeFile(path.join(ngoai, '.env'), 'DB_PASS=bi-mat');
});

/** Bối cảnh thẻ: trả lời bằng `q` ngay khi thẻ hiện; ghi lại thẻ để kiểm chữ. */
function boiCanh(q: QuyetDinh | null, o: { choGhi?: boolean; boQuaHet?: boolean } = {}) {
  const so = taoSoCuoc();
  if (o.boQuaHet) so.boQuaHet = true;
  const the: Array<{ viec: string; chiTiet: string; duongDan: string }> = [];
  const dk = new AbortController();
  return {
    so, the, dk,
    b: {
      so, signal: dk.signal, choGhi: o.choGhi ?? true,
      phat: (y: { id: string; viec: 'thuMuc' | 'thuMucDoc'; chiTiet: string; duongDan: string }) => {
        the.push({ viec: y.viec, chiTiet: y.chiTiet, duongDan: y.duongDan });
        if (q) setTimeout(() => traLoi(y.id, q), 0);
      },
    },
  };
}

describe('xin_quyen_thu_muc', () => {
  it('thẻ đúng chữ; "Cho phép đọc" ⇒ chỉ ĐỌC, đọc được bằng đường tuyệt đối, .env vẫn chặn', async () => {
    const x = boiCanh('choPhep');
    const kq = await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'repo thật có test và báo cáo' }, x.b);
    expect(x.the).toHaveLength(1);
    expect(x.the[0]!.viec).toBe('thuMuc');
    expect(x.the[0]!.chiTiet).toMatch(new RegExp(`^CuongMini muốn ĐỌC thư mục "${path.basename(ngoai)}"\nĐường dẫn: ${ngoai.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\nLý do: repo thật có test và báo cáo`));
    expect(kq.tomTat).toMatch(/^✓ đọc /);
    expect(dsThuMucDocNgoai(goc)).toEqual([ngoai]);
    expect(dsThuMucGhiNgoai(goc)).toEqual([]);
    const doc = await chayToolAgent(goc, 'read_file', { path: path.join(ngoai, 'test', 'LoginTest.java') });
    expect(doc.noiDung).toContain('class LoginTest');
    const env = await chayToolAgent(goc, 'read_file', { path: path.join(ngoai, '.env') });
    expect(env.noiDung).not.toContain('bi-mat');
  });

  it('"Không" ⇒ không cấp gì, dặn model không đi đường vòng; đọc tuyệt đối vẫn bị từ chối kèm hướng dẫn gọi tool', async () => {
    const x = boiCanh('tuChoi');
    const kq = await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'xem test' }, x.b);
    expect(kq.noiDung).toMatch(/NGƯỜI DÙNG KHÔNG CHO.*Đừng đọc nó bằng cách khác/);
    expect(dsThuMucDocNgoai(goc)).toEqual([]);
    const doc = await chayToolAgent(goc, 'read_file', { path: path.join(ngoai, 'test', 'LoginTest.java') });
    expect(doc.noiDung).toMatch(/CHƯA được cấp quyền đọc.*xin_quyen_thu_muc/s);
    expect(loiNgoaiChuaCap('/x', goc).message).not.toMatch(/KÉO thư mục/);
  });

  it('⛔ KHÔNG BAO GIỜ tự duyệt: "Bỏ qua hết" vẫn hiện thẻ và chờ người dùng', async () => {
    const x = boiCanh(null, { boQuaHet: true });
    const p = xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'đọc' }, x.b);
    await new Promise((r) => setTimeout(r, 30));
    expect(x.the).toHaveLength(1);
    expect(dsThuMucDocNgoai(goc)).toEqual([]);
    x.dk.abort();
    expect((await p).tomTat).toBe('✗ không cho');
  });

  it('"Cho phép đọc + sửa" ⇒ sửa bằng edit_file đường tuyệt đối, MỖI lần sửa vẫn có thẻ (kể cả chế độ tự sửa)', async () => {
    const x = boiCanh('choPhepCaFile');
    const kq = await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'sửa test', quyen: 'ghi' }, x.b);
    expect(x.the[0]!.chiTiet).toMatch(/CuongMini muốn ĐỌC \+ SỬA thư mục/);
    expect(kq.tomTat).toMatch(/^✓ đọc \+ sửa /);
    expect(dsThuMucGhiNgoai(goc)).toEqual([ngoai]);
    const theSua: string[] = [];
    const ghi = {
      signal: new AbortController().signal, so: x.so, tuDuyet: true,
      xinPhep: (y: { id: string; duongDan: string }) => { theSua.push(y.duongDan); setTimeout(() => traLoi(y.id, 'choPhep'), 0); },
    };
    const f = path.join(ngoai, 'test', 'LoginTest.java');
    const r = await chayToolAgent(goc, 'edit_file', { path: f, old_text: 'dangNhap()', new_text: 'dangNhapSai()' }, ghi as never);
    expect(r.noiDung).toMatch(/Đã sửa/);
    expect(theSua).toEqual([f]);
    expect(await fs.readFile(f, 'utf8')).toContain('dangNhapSai');
    const t = await chayToolAgent(goc, 'create_file', { path: path.join(ngoai, 'test', 'Moi.java'), content: 'class Moi {}' }, ghi as never);
    expect(t.noiDung).toMatch(/Đã tạo/);
    expect(theSua).toHaveLength(2);
    // .env trong thư mục ngoài: không tạo được (khe `.env*` chỉ dành cho dự án).
    const e = await chayToolAgent(goc, 'create_file', { path: path.join(ngoai, 'test', '.env.local'), content: 'X=1' }, ghi as never);
    expect(e.noiDung).not.toMatch(/Đã tạo/);
  });

  it('chỉ được ĐỌC ⇒ edit_file đường tuyệt đối bị từ chối, dạy xin quyen="ghi"; phiên không bật sửa ⇒ thẻ không có nút sửa', async () => {
    await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'đọc' }, boiCanh('choPhepCaFile', { choGhi: false }).b);
    expect(dsThuMucGhiNgoai(goc)).toEqual([]);
    const x = boiCanh('choPhep', { choGhi: false });
    _xoaQuyenDocNgoai();
    await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'đọc' }, x.b);
    expect(x.the[0]!.viec).toBe('thuMucDoc');
    const ghi = { signal: new AbortController().signal, so: x.so, tuDuyet: true, xinPhep: () => undefined };
    const r = await chayToolAgent(goc, 'edit_file', { path: path.join(ngoai, 'test', 'LoginTest.java'), old_text: 'a', new_text: 'b' }, ghi as never);
    expect(r.noiDung).toMatch(/CHƯA được cấp quyền SỬA.*mới được cấp ĐỌC.*quyen="ghi"/s);
  });

  it('luật cũ giữ nguyên: thư mục nhà, ổ đĩa, symlink trỏ về nhà, thư mục trong dự án, đường tương đối, thiếu lý do', async () => {
    const x = boiCanh('choPhep');
    expect((await xinQuyenThuMuc(goc, { path: '~', ly_do: 'x' }, x.b)).noiDung).toMatch(/thư mục nhà/);
    expect((await xinQuyenThuMuc(goc, { path: '/', ly_do: 'x' }, x.b)).noiDung).toMatch(/cả ổ đĩa/);
    const lk = path.join(ngoai, 'nha');
    await fs.symlink(os.homedir(), lk);
    expect((await xinQuyenThuMuc(goc, { path: lk, ly_do: 'x' }, x.b)).noiDung).toMatch(/thư mục nhà/);
    await fs.mkdir(path.join(goc, 'src'));
    expect((await xinQuyenThuMuc(goc, { path: path.join(goc, 'src'), ly_do: 'x' }, x.b)).noiDung).toMatch(/nằm TRONG dự án.*"src"/);
    expect((await xinQuyenThuMuc(goc, { path: 'thu-muc', ly_do: 'x' }, x.b)).noiDung).toMatch(/TUYỆT ĐỐI/);
    expect((await xinQuyenThuMuc(goc, { path: ngoai }, x.b)).noiDung).toMatch(/thiếu "ly_do"/);
    expect(x.the).toHaveLength(0);
    expect(moRongDuong('~/Documents/SWT301-SportShop')).toBe(path.join(os.homedir(), 'Documents/SWT301-SportShop'));
  });

  it('đã cấp ⇒ không hỏi lại; đã đọc mà xin sửa ⇒ hỏi lại', async () => {
    await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'đọc' }, boiCanh('choPhep').b);
    const x = boiCanh('choPhep');
    expect((await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'đọc lại' }, x.b)).tomTat).toBe('đã có quyền');
    expect(x.the).toHaveLength(0);
    const y = boiCanh('tuChoi');
    await xinQuyenThuMuc(goc, { path: ngoai, ly_do: 'sửa', quyen: 'ghi' }, y.b);
    expect(y.the).toHaveLength(1);
    expect(dsThuMucDocNgoai(goc)).toEqual([ngoai]);
  });
});

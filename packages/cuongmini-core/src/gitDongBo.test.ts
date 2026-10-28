/**
 * Đồng bộ git (28/10/2026) — chạy git THẬT trong thư mục tạm, remote là một repo TRẦN cục bộ (`git init --bare`):
 * sau / trước / phân kỳ / bẩn / chưa có upstream / mất mạng / không phải repo; kéo về ff · rebase · merge; xung đột ⇒
 * huỷ về y như trước; không bao giờ mất thay đổi chưa commit.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

import {
  chuanHoaRemote, docProjectRepos, goiYLoiNhanCommit, goiYTenNhanh, keoVe, khopRepoCtw, kiemDongBo, phanLoaiLoiFetch, refAnToan, veDongBo,
  docRemote, dsCommitMoi,
} from './gitDongBo';

let tam = '';
const ENV_CU: Record<string, string | undefined> = {};
const datEnv = (k: string, v: string) => { ENV_CU[k] = process.env[k]; process.env[k] = v; };

before(() => {
  tam = mkdtempSync(path.join(os.tmpdir(), 'cm-dongbo-'));
  // Cô lập khỏi cấu hình git của máy (pull.rebase, hook, tên người dùng…).
  datEnv('HOME', tam);
  datEnv('GIT_CONFIG_NOSYSTEM', '1');
  datEnv('GIT_CONFIG_GLOBAL', path.join(tam, 'gitconfig-trong'));
  writeFileSync(path.join(tam, 'gitconfig-trong'), '');
  for (const [k, v] of [['GIT_AUTHOR_NAME', 'An'], ['GIT_AUTHOR_EMAIL', 'an@example.com'], ['GIT_COMMITTER_NAME', 'An'], ['GIT_COMMITTER_EMAIL', 'an@example.com']] as const) datEnv(k, v);
});
after(() => {
  for (const [k, v] of Object.entries(ENV_CU)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  rmSync(tam, { recursive: true, force: true });
});

const g = (cwd: string, ...a: string[]) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghi = (f: string, s: string) => { mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, s); };
let dem = 0;
/** Remote trần + hai bản clone (`toi` = máy người dùng, `ban` = máy đồng đội). */
function dung(): { tran: string; toi: string; ban: string } {
  const goc = path.join(tam, `ca-${dem += 1}`);
  const tran = path.join(goc, 'remote.git');
  mkdirSync(goc, { recursive: true });
  g(goc, 'init', '--bare', '-b', 'main', tran);
  const toi = path.join(goc, 'toi');
  g(goc, 'clone', '-q', tran, toi);
  ghi(path.join(toi, 'a.txt'), 'mot\nhai\nba\n');
  g(toi, 'add', 'a.txt'); g(toi, 'commit', '-qm', 'khoi tao'); g(toi, 'push', '-q', '-u', 'origin', 'main');
  const ban = path.join(goc, 'ban');
  g(goc, 'clone', '-q', tran, ban);
  return { tran, toi, ban };
}
function banDay(ban: string, file: string, noiDung: string, n = 1): void {
  for (let i = 0; i < n; i += 1) {
    ghi(path.join(ban, file), `${noiDung} ${i}\n`);
    g(ban, 'add', file); g(ban, 'commit', '-qm', `ban sua ${file} ${i}`);
  }
  g(ban, 'push', '-q', 'origin', 'HEAD');
}

test('chuanHoaRemote: ssh / https / .git / cổng 443 / user@ ⇒ cùng một khoá; đường cục bộ ⇒ null', () => {
  const k = 'github.com/fpt-team/nha-tro';
  for (const u of [
    'git@github.com:FPT-Team/Nha-Tro.git', 'https://github.com/fpt-team/nha-tro', 'https://github.com/fpt-team/nha-tro.git/',
    'ssh://git@github.com/fpt-team/nha-tro.git', 'ssh://git@ssh.github.com:443/fpt-team/nha-tro.git', 'https://cuong@github.com/fpt-team/nha-tro.git',
    'git+ssh://git@github.com/fpt-team/nha-tro.git', 'https://www.github.com/fpt-team/nha-tro',
  ]) assert.equal(chuanHoaRemote(u), k, u);
  assert.equal(chuanHoaRemote('git@gitlab.com:nhom/con/du-an.git'), 'gitlab.com/nhom/con/du-an');
  for (const u of ['/tmp/remote.git', '../remote.git', 'C:\\repo\\x.git', 'file:///tmp/x.git', '', 'khong-phai-url']) assert.equal(chuanHoaRemote(u), null, u);
});

test('docRemote + docProjectRepos + khopRepoCtw: khớp origin với repo dự án (kể cả khác giao thức)', () => {
  const remote = docRemote('origin\tgit@github.com:Nhom/App.git (fetch)\norigin\tgit@github.com:Nhom/App.git (push)\nfork\thttps://github.com/toi/app (fetch)\n');
  assert.equal(remote.length, 2);
  const ra = '1 repo(s) of NT. If the open folder…\n<ctwork-content untrusted="true" label="project repositories">\n'
    + JSON.stringify([{ source: 'Code page', host: 'github.com', path: 'nhom/app', web: 'https://github.com/nhom/app', cloneHttps: 'https://github.com/nhom/app.git', cloneSsh: 'git@github.com:nhom/app.git', defaultBranch: 'develop' }])
    + '\n</ctwork-content>';
  const repo = docProjectRepos(ra);
  assert.equal(repo.length, 1);
  const k = khopRepoCtw(remote, repo);
  assert.equal(k?.remote.ten, 'origin');
  assert.equal(k?.repo.defaultBranch, 'develop');
  assert.equal(khopRepoCtw(docRemote('origin\thttps://github.com/khac/repo (fetch)'), repo), null);
  assert.deepEqual(docProjectRepos('No code repository is linked to NT'), []);
  assert.deepEqual(docProjectRepos('[không phải json'), []);
});

test('tên nhánh / lời nhắn commit theo thẻ; ref an toàn; phân loại lỗi fetch', () => {
  assert.equal(goiYTenNhanh('NT-24', 'Login form'), 'feature/NT-24-login-form');
  assert.equal(goiYTenNhanh('nt-31', 'Sửa tổng tiền âm', 'Bug'), 'fix/NT-31-sua-tong-tien-am');
  assert.ok(goiYTenNhanh('NT-1', 'x'.repeat(200)).length <= 60);
  assert.equal(goiYLoiNhanCommit('NT-24', 'thêm form đăng nhập'), 'feat(NT-24): thêm form đăng nhập');
  assert.equal(goiYLoiNhanCommit('NT-24', 'fix(NT-24): sửa'), 'fix(NT-24): sửa');
  assert.ok(refAnToan('origin/main') && refAnToan('origin/feature/NT-24-a'));
  for (const r of ['--upload-pack=x', 'a..b', 'origin/ma in', '', null]) assert.equal(refAnToan(r as string), false, String(r));
  assert.equal(phanLoaiLoiFetch('fatal: unable to access \'https://x/\': Could not resolve host: github.com', false), 'offline');
  assert.equal(phanLoaiLoiFetch('git@github.com: Permission denied (publickey).', false), 'xacThuc');
  assert.equal(phanLoaiLoiFetch('', true), 'hetGio');
});

test('KHÔNG phải repo git ⇒ laKho=false, câu báo rõ, không ném', async () => {
  const d = path.join(tam, 'khong-git');
  mkdirSync(d, { recursive: true });
  const tt = await kiemDongBo(d);
  assert.equal(tt.laKho, false);
  assert.match(veDongBo(tt).dong[0]!, /không phải repo git/);
  const r = await keoVe(d, { cach: 'ff', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(r.ok, false);
});

test('ĐÃ KHỚP ⇒ im lặng lúc mở (muc=im), /dong-bo in "✓ đã khớp"', async () => {
  const { toi } = dung();
  const tt = await kiemDongBo(toi);
  assert.equal(tt.fetch.ok, true);
  assert.deepEqual(tt.soVoiUpstream, { truoc: 0, sau: 0 });
  assert.equal(tt.macDinh, 'origin/main');
  assert.equal(tt.laNhanhMacDinh, true);
  const tb = veDongBo(tt);
  assert.equal(tb.muc, 'im');
  assert.match(tb.dong.join('\n'), /✓ Nhánh main đã khớp origin\/main/);
});

test('ĐANG SAU 3 commit ⇒ câu hỏi "pull không?"; ff kéo về, giữ nguyên file đang sửa không đụng', async () => {
  const { toi, ban } = dung();
  banDay(ban, 'b.txt', 'cua ban', 3);
  ghi(path.join(toi, 'rieng.txt'), 'dang viet do\n'); // file mới chưa commit, không đụng
  const tt = await kiemDongBo(toi);
  assert.deepEqual(tt.soVoiUpstream, { truoc: 0, sau: 3 });
  assert.equal(tt.thayDoi.chuaTheoDoi, 1);
  const tb = veDongBo(tt);
  assert.equal(tb.muc, 'hoi');
  assert.equal(tb.hoi?.loai, 'keo');
  assert.equal(tb.hoi?.cauHoi, 'Nhánh main đang sau origin/main 3 commit — pull không?');
  assert.deepEqual(tb.hoi?.luaChon.map((x) => x.giaTri), ['ff:upstream', 'xem:upstream', 'khong']);
  assert.match(tb.hoi!.moTa, /1 file mới chưa commit — git giữ nguyên/);
  const en = veDongBo(tt, 'en');
  assert.equal(en.hoi?.cauHoi, 'Branch main is 3 commits behind origin/main — pull now?');
  const xem = await dsCommitMoi(toi, 'upstream');
  assert.equal(xem.moi.length, 3);
  const r = await keoVe(toi, { cach: 'ff', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(r.ok, true, r.noi);
  assert.match(r.noi, /Đã kéo 3 commit từ origin\/main vào main/);
  assert.equal(readFileSync(path.join(toi, 'rieng.txt'), 'utf8'), 'dang viet do\n');
  assert.deepEqual((await kiemDongBo(toi, { fetch: false })).soVoiUpstream, { truoc: 0, sau: 0 });
});

test('ĐANG SAU mà file đang sửa bị đụng ⇒ ff bị git TỪ CHỐI, không mất một dòng nào', async () => {
  const { toi, ban } = dung();
  banDay(ban, 'a.txt', 'ban sua a');
  ghi(path.join(toi, 'a.txt'), 'toi dang sua a\n');
  await kiemDongBo(toi);
  const r = await keoVe(toi, { cach: 'ff', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(r.ok, false);
  assert.match(r.noi, /TỪ CHỐI|từ chối/i);
  assert.equal(readFileSync(path.join(toi, 'a.txt'), 'utf8'), 'toi dang sua a\n');
});

test('ĐI TRƯỚC (chưa đẩy) ⇒ chỉ một dòng thông tin, không hỏi', async () => {
  const { toi } = dung();
  ghi(path.join(toi, 'c.txt'), 'x\n'); g(toi, 'add', 'c.txt'); g(toi, 'commit', '-qm', 'c');
  const tt = await kiemDongBo(toi);
  assert.deepEqual(tt.soVoiUpstream, { truoc: 1, sau: 0 });
  const tb = veDongBo(tt);
  assert.equal(tb.muc, 'info');
  assert.equal(tb.hoi, null);
  assert.match(tb.dong.join('\n'), /có 1 commit chưa đẩy lên origin\/main/);
});

test('PHÂN KỲ ⇒ giải thích rebase vs merge; rebase sạch thành công; xung đột ⇒ abort về đúng HEAD cũ + liệt kê file', async () => {
  const { toi, ban } = dung();
  banDay(ban, 'b.txt', 'ban');
  ghi(path.join(toi, 'c.txt'), 'toi\n'); g(toi, 'add', 'c.txt'); g(toi, 'commit', '-qm', 'toi c');
  let tt = await kiemDongBo(toi);
  assert.equal(tt.phanKy, true);
  const tb = veDongBo(tt);
  assert.equal(tb.hoi?.loai, 'phanKy');
  assert.match(tb.hoi!.cauHoi, /PHÂN KỲ.*1 commit chưa đẩy.*1 commit bạn chưa có/);
  assert.deepEqual(tb.hoi!.luaChon.map((x) => x.giaTri), ['rebase:upstream', 'merge:upstream', 'xem:upstream', 'khong']);
  const ff = await keoVe(toi, { cach: 'ff', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(ff.ok, false);
  assert.match(ff.noi, /phân kỳ/);
  const r = await keoVe(toi, { cach: 'rebase', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(r.ok, true, r.noi);
  tt = await kiemDongBo(toi, { fetch: false });
  assert.deepEqual(tt.soVoiUpstream, { truoc: 1, sau: 0 });

  // Xung đột thật: cả hai sửa cùng dòng của a.txt.
  const c2 = dung();
  banDay(c2.ban, 'a.txt', 'BAN');
  ghi(path.join(c2.toi, 'a.txt'), 'TOI\n'); g(c2.toi, 'commit', '-qam', 'toi a');
  const truoc = g(c2.toi, 'rev-parse', 'HEAD');
  await kiemDongBo(c2.toi);
  for (const cach of ['rebase', 'merge'] as const) {
    const x = await keoVe(c2.toi, { cach, mucTieu: 'upstream', nhanh: 'main' });
    assert.equal(x.ok, false);
    assert.deepEqual(x.xungDot, ['a.txt']);
    assert.match(x.noi, /Xung đột ở 1 file \(đã huỷ, repo về đúng như trước\)/);
    assert.equal(g(c2.toi, 'rev-parse', 'HEAD'), truoc, `${cach}: HEAD giữ nguyên`);
    assert.equal(g(c2.toi, 'status', '--porcelain'), '', `${cach}: cây sạch, không dở rebase/merge`);
    assert.equal((await kiemDongBo(c2.toi, { fetch: false })).dangDo, null);
  }
});

test('BẨN + phân kỳ ⇒ rebase/merge TỪ CHỐI (không tự stash), không đổi gì', async () => {
  const { toi, ban } = dung();
  banDay(ban, 'b.txt', 'ban');
  ghi(path.join(toi, 'c.txt'), 'toi\n'); g(toi, 'add', 'c.txt'); g(toi, 'commit', '-qm', 'c');
  ghi(path.join(toi, 'a.txt'), 'dang sua\n');
  const truoc = g(toi, 'rev-parse', 'HEAD');
  await kiemDongBo(toi);
  const r = await keoVe(toi, { cach: 'merge', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(r.ok, false);
  assert.match(r.noi, /1 file sửa dở chưa commit/);
  assert.equal(g(toi, 'rev-parse', 'HEAD'), truoc);
  assert.equal(readFileSync(path.join(toi, 'a.txt'), 'utf8'), 'dang sua\n');
  assert.equal(g(toi, 'stash', 'list'), '');
});

test('NHÁNH CHƯA ĐẨY (không upstream) + thiếu commit mới của main ⇒ báo chưa đẩy + hỏi rebase (khuyên) lên origin/main', async () => {
  const { toi, ban } = dung();
  g(toi, 'switch', '-qc', 'feature/NT-24-login-form');
  ghi(path.join(toi, 'login.txt'), 'form\n'); g(toi, 'add', 'login.txt'); g(toi, 'commit', '-qm', 'feat(NT-24): form');
  banDay(ban, 'b.txt', 'main moi', 2);
  const tt = await kiemDongBo(toi);
  assert.equal(tt.upstream, null);
  assert.equal(tt.upstreamMat, false);
  assert.deepEqual(tt.soVoiMacDinh, { truoc: 1, sau: 2 });
  const tb = veDongBo(tt, 'vi', { key: 'NT', khop: true, repo: 'github.com/nhom/app' });
  assert.equal(tb.hoi?.loai, 'capNhatMacDinh');
  assert.equal(tb.hoi?.cauHoi, 'Nhánh feature/NT-24-login-form thiếu 2 commit mới của origin/main — cập nhật nhánh không?');
  assert.equal(tb.hoi?.luaChon[0]?.giaTri, 'rebase:macDinh');
  assert.match(tb.dong.join('\n'), /chưa có trên GitHub/);
  assert.match(tb.dong[0]!, /Repo của dự án CT Work NT/);
  const r = await keoVe(toi, { cach: 'rebase', mucTieu: 'macDinh', nhanh: 'feature/NT-24-login-form' });
  assert.equal(r.ok, true, r.noi);
  assert.deepEqual((await kiemDongBo(toi, { fetch: false })).soVoiMacDinh, { truoc: 1, sau: 0 });
});

test('NHÁNH ĐÃ ĐẨY thiếu commit của main ⇒ chỉ đề nghị MERGE; rebase bị chặn (sẽ phải đẩy ép)', async () => {
  const { toi, ban } = dung();
  g(toi, 'switch', '-qc', 'feature/NT-9');
  ghi(path.join(toi, 'x.txt'), 'x\n'); g(toi, 'add', 'x.txt'); g(toi, 'commit', '-qm', 'x');
  g(toi, 'push', '-q', '-u', 'origin', 'feature/NT-9');
  banDay(ban, 'b.txt', 'main');
  const tt = await kiemDongBo(toi);
  const tb = veDongBo(tt);
  assert.equal(tb.hoi?.loai, 'capNhatMacDinh');
  assert.deepEqual(tb.hoi!.luaChon.map((x) => x.giaTri), ['merge:macDinh', 'xem:macDinh', 'khong']);
  const cam = await keoVe(toi, { cach: 'rebase', mucTieu: 'macDinh', nhanh: 'feature/NT-9' });
  assert.equal(cam.ok, false);
  assert.match(cam.noi, /đẩy ép/);
  const r = await keoVe(toi, { cach: 'merge', mucTieu: 'macDinh', nhanh: 'feature/NT-9' });
  assert.equal(r.ok, true, r.noi);
});

test('ĐỔI NHÁNH giữa lúc đọc thẻ và lúc bấm ⇒ không làm gì', async () => {
  const { toi, ban } = dung();
  banDay(ban, 'b.txt', 'ban');
  await kiemDongBo(toi);
  g(toi, 'switch', '-qc', 'khac');
  const r = await keoVe(toi, { cach: 'ff', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(r.ok, false);
  assert.match(r.noi, /Nhánh đã đổi/);
});

test('MẤT MẠNG (remote không với tới) ⇒ không treo, báo "so với lần tải trước", vẫn đếm theo ref cũ', async () => {
  const { toi } = dung();
  g(toi, 'remote', 'set-url', 'origin', 'https://127.0.0.1:9/nhom/app.git');
  const t0 = Date.now();
  const tt = await kiemDongBo(toi, { hanFetchMs: 8000 });
  assert.ok(Date.now() - t0 < 9000);
  assert.equal(tt.fetch.ok, false);
  assert.equal(tt.fetch.loi, 'offline', tt.fetch.chiTiet);
  assert.deepEqual(tt.soVoiUpstream, { truoc: 0, sau: 0 });
  const tb = veDongBo(tt);
  assert.equal(tb.muc, 'info');
  assert.match(tb.dong.join('\n'), /Không tải được bản mới từ origin \(mất mạng\?\) — số liệu dưới đây so với lần tải trước/);
});

test('remote KHÔNG khớp repo dự án ⇒ cảnh báo mở nhầm thư mục; đang sửa thẳng trên main ⇒ gợi ý nhánh theo thẻ', async () => {
  const { toi } = dung();
  ghi(path.join(toi, 'a.txt'), 'sua tren main\n');
  const tt = await kiemDongBo(toi);
  const tb = veDongBo(tt, 'vi', { key: 'NT', khop: false, dsRepo: ['github.com/nhom/app'], the: 'NT-24' });
  const chu = tb.dong.join('\n');
  assert.match(chu, /KHÔNG khớp repo nào của dự án NT \(repo dự án: github.com\/nhom\/app\)/);
  assert.match(chu, /sửa thẳng trên main.*git switch -c feature\/NT-24/);
  assert.equal(tb.muc, 'info');
});

test('đang DỞ rebase ⇒ chỉ hướng dẫn continue/abort, không hỏi kéo', async () => {
  const { toi, ban } = dung();
  banDay(ban, 'a.txt', 'BAN');
  ghi(path.join(toi, 'a.txt'), 'TOI\n'); g(toi, 'commit', '-qam', 'toi');
  g(toi, 'fetch', '-q');
  try { g(toi, 'rebase', 'origin/main'); } catch { /* xung đột — để dở */ }
  const tt = await kiemDongBo(toi, { fetch: false });
  assert.equal(tt.dangDo, 'rebase');
  const tb = veDongBo(tt);
  assert.equal(tb.hoi, null);
  assert.match(tb.dong.join('\n'), /git rebase --abort/);
  const r = await keoVe(toi, { cach: 'ff', mucTieu: 'upstream', nhanh: 'main' });
  assert.equal(r.ok, false);
  g(toi, 'rebase', '--abort');
});

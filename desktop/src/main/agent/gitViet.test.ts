/**
 * Kiểm git GHI trên KHO GIT THẬT dựng trong thư mục tạm.
 *
 * Không giả lập `git`: những thứ đáng sợ ở đây đều là hành vi thật của git —
 * nhánh nào đang đứng, file nào bị `.gitignore`, `add` có nuốt file lạ không.
 * Giả lập sẽ "đạt" trong khi lệnh thật làm chuyện khác.
 *
 * ⛔ Tất cả chạy trong `mkdtemp`, KHÔNG bao giờ chạm repo đang mở.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { chuanBiCommit, chuanBiDay, chuRepoGithub, commit, dangDuAn, keHoachDangDuAn } from './gitViet';

let repo: string;

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: 'pipe' });
}

beforeEach(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'gitviet-'));
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'kiem@test.local');
  git('config', 'user.name', 'Kiem');
  fs.writeFileSync(path.join(repo, 'a.txt'), 'mot\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'khoi tao');
});

afterEach(() => fs.rmSync(repo, { recursive: true, force: true }));

describe('git ghi — rào chắn', () => {
  it('TỪ CHỐI commit khi đang ở nhánh chung', async () => {
    fs.writeFileSync(path.join(repo, 'a.txt'), 'hai\n');
    const cb = await chuanBiCommit(repo);

    // Đây là rào quan trọng nhất của cả module: một agent ghi thẳng vào `main`
    // là hỏng việc của cả nhóm.
    expect(cb.ok).toBe(false);
    expect(cb.loi).toMatch(/nhánh chung/i);
  });

  it('cho commit trên nhánh riêng, và liệt kê đúng file', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    fs.writeFileSync(path.join(repo, 'a.txt'), 'hai\n');
    fs.writeFileSync(path.join(repo, 'b.txt'), 'moi\n');

    const cb = await chuanBiCommit(repo);
    expect(cb.ok).toBe(true);
    expect(cb.nhanh).toBe('agent/thu');
    expect(cb.file?.sort()).toEqual(['a.txt', 'b.txt']);
  });

  it('LOẠI file bí mật khỏi commit, dù .gitignore không chặn', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    fs.writeFileSync(path.join(repo, '.env'), 'SECRET=lo-ra-la-chet\n');
    fs.writeFileSync(path.join(repo, 'a.txt'), 'hai\n');

    const cb = await chuanBiCommit(repo);
    expect(cb.ok).toBe(true);
    expect(cb.file).toEqual(['a.txt']);
    expect(cb.daChan).toContain('.env');

    await commit(repo, 'thu', cb.file!);
    // Sự thật cuối cùng là NỘI DUNG COMMIT, không phải danh sách ta tự tính.
    const trong = git('show', '--name-only', '--format=', 'HEAD').trim().split('\n').filter(Boolean);
    expect(trong).toEqual(['a.txt']);
  });

  it('commit thật sự tạo commit, và chỉ gồm file được chọn', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    fs.writeFileSync(path.join(repo, 'a.txt'), 'hai\n');
    fs.writeFileSync(path.join(repo, 'c.txt'), 'khong-chon\n');

    const kq = await commit(repo, 'chi sua a', ['a.txt']);
    expect(kq.ok).toBe(true);

    const trong = git('show', '--name-only', '--format=', 'HEAD').trim().split('\n').filter(Boolean);
    expect(trong).toEqual(['a.txt']);
    expect(git('log', '-1', '--format=%s').trim()).toBe('chi sua a');
    // `c.txt` phải còn nguyên là file chưa theo dõi — `add .` sẽ nuốt nó.
    expect(git('status', '--porcelain').includes('c.txt')).toBe(true);
  });

  it('không có gì để commit thì nói rõ, không tạo commit rỗng', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    const cb = await chuanBiCommit(repo);
    expect(cb.ok).toBe(false);
    expect(cb.loi).toMatch(/không có thay đổi/i);
  });

  it('chặn LẠI ở bước ghi nếu nhánh đã đổi sang nhánh chung', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    fs.writeFileSync(path.join(repo, 'a.txt'), 'hai\n');
    const cb = await chuanBiCommit(repo);
    expect(cb.ok).toBe(true);

    // Người dùng đổi nhánh trong terminal giữa lúc thẻ duyệt đang mở — khoảng
    // trống đó có thể là vài phút.
    git('checkout', '-q', 'main');
    const kq = await commit(repo, 'thu', cb.file!);
    expect(kq.ok).toBe(false);
    expect(kq.loi).toMatch(/main/);
  });
});

describe('16/10/2026 — người mới đưa dự án lên GitHub', () => {
  it('thư mục CHƯA theo dõi chứa .env ⇒ liệt kê TỪNG file, .env bị loại (trước đây cả thư mục bị add nguyên cục)', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    fs.mkdirSync(path.join(repo, 'cauhinh'));
    fs.writeFileSync(path.join(repo, 'cauhinh', 'app.json'), '{}');
    fs.writeFileSync(path.join(repo, 'cauhinh', '.env'), 'KHOA=bi-mat');
    const cb = await chuanBiCommit(repo);
    expect(cb.file).toContain('cauhinh/app.json');
    expect(cb.file).not.toContain('cauhinh/');
    expect(cb.daChan).toContain('cauhinh/.env');
  });

  it('đổi tên file ⇒ không sinh đường dẫn rác từ mục nguồn', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    git('mv', 'a.txt', 'b.txt');
    const cb = await chuanBiCommit(repo);
    expect(cb.file).toEqual(['b.txt']);
  });

  it('đọc chủ repo GitHub từ origin (https lẫn ssh)', async () => {
    expect(await chuRepoGithub(repo)).toBeNull();
    git('remote', 'add', 'origin', 'https://github.com/nguoi-moi/bai-tap.git');
    expect(await chuRepoGithub(repo)).toBe('nguoi-moi');
    git('remote', 'set-url', 'origin', 'git@github.com:Ai-Do/repo');
    expect(await chuRepoGithub(repo)).toBe('Ai-Do');
  });

  it('chưa có origin ⇒ git_day nói rõ phải đưa dự án lên trước', async () => {
    git('checkout', '-q', '-b', 'agent/thu');
    const cb = await chuanBiDay(repo);
    expect(cb.ok).toBe(false);
    expect(cb.loi).toContain('github_dang_du_an');
  });

  it('thư mục CHƯA có git ⇒ kế hoạch báo sẽ init + tạo .gitignore', async () => {
    const moi = fs.mkdtempSync(path.join(os.tmpdir(), 'gitviet-moi-'));
    try {
      fs.writeFileSync(path.join(moi, 'index.js'), 'console.log(1)\n');
      const kh = await keHoachDangDuAn(moi);
      expect(kh.canInit).toBe(true);
      expect(kh.taoGitignore).toBe(true);
    } finally {
      fs.rmSync(moi, { recursive: true, force: true });
    }
  });

  it('⛔ repo NHÓM đã có origin, đang ở main ⇒ github_dang_du_an KHÔNG commit/đẩy thẳng main', async () => {
    const tu = fs.mkdtempSync(path.join(os.tmpdir(), 'gitviet-goc-'));
    try {
      execFileSync('git', ['init', '-q', '--bare', tu]);
      git('remote', 'add', 'origin', tu);
      fs.writeFileSync(path.join(repo, 'a.txt'), 'ba\n');
      const kq = await dangDuAn(repo, { tenRepo: 'x', riengTu: true, loiNhan: 'thu' });
      expect(kq.ok).toBe(false);
      expect(git('log', '--oneline').trim().split('\n')).toHaveLength(1);
    } finally {
      fs.rmSync(tu, { recursive: true, force: true });
    }
  });
});

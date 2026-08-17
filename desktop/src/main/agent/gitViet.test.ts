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
import { chuanBiCommit, commit } from './gitViet';

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

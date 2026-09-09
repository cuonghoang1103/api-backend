/**
 * Kiểm KHO KỸ NĂNG — cài skill/agent/command từ `/ai-templates` vào dự án.
 *
 * Ba rủi ro, và chúng khác hạng nhau:
 *   1. Ghi ĐÈ tệp người dùng đã sửa — mất công của họ bằng một lệnh trông như
 *      "tải về". Không hoàn tác được nếu dự án chưa commit.
 *   2. Ghi RA NGOÀI dự án — tên component đi vào đường dẫn, mà tên đến từ một
 *      kho của người khác.
 *   3. Tìm sai / dịch sai loại → tệp nằm sai thư mục ⇒ agent không đọc được,
 *      và triệu chứng là "cài xong mà chẳng thấy gì".
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

vi.mock('electron', () => ({ app: { getPath: () => os.tmpdir() }, BrowserWindow: {} }));

const { tim, cai, napChiMuc, quenDem } = await import('./khoKyNang');

const KHO = [
  { ten: 'database-optimizer', duong: 'database/database-optimizer', danhMuc: 'database', loai: 'skill' as const },
  { ten: 'bao-mat-web', duong: 'security/bao-mat-web', danhMuc: 'security', loai: 'skill' as const },
  { ten: 'accessibility-tester', duong: 'accessibility/accessibility-tester.md', danhMuc: 'accessibility', loai: 'agent' as const },
  { ten: 'supply-chain-audit', duong: 'analysis/supply-chain-audit.md', danhMuc: 'analysis', loai: 'command' as const },
];

let goc = '';
beforeEach(async () => {
  goc = await fs.mkdtemp(path.join(os.tmpdir(), 'ct-kho-'));
  quenDem();
  vi.restoreAllMocks();
});

function gia(noiDung: string): void {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(noiDung, { status: 200 })));
}

describe('tìm', () => {
  it('khớp tên, tiền tố, và danh mục — theo thứ tự ưu tiên', () => {
    expect(tim(KHO, 'database-optimizer')[0]?.ten).toBe('database-optimizer');
    expect(tim(KHO, 'database')[0]?.ten).toBe('database-optimizer');   // tiền tố thắng danh mục
    expect(tim(KHO, 'accessibility').map((x) => x.ten)).toContain('accessibility-tester');
  });

  it('BỎ DẤU — gõ "bao mat" ra được mục có dấu', () => {
    // Người Việt gõ không dấu là chuyện thường; bắt gõ đúng dấu nghĩa là tính
    // năng tìm chỉ dùng được một nửa.
    expect(tim(KHO, 'bao mat').map((x) => x.ten)).toContain('bao-mat-web');
  });

  it('từ khoá rỗng ⇒ rỗng, không đổ cả kho ra', () => {
    expect(tim(KHO, '   ')).toEqual([]);
  });
});

describe('cài', () => {
  it('skill → `.claude/skills/<tên>/SKILL.md`', async () => {
    gia('---\nname: database-optimizer\ndescription: Tối ưu CSDL\n---\nThân kỹ năng.');
    const r = await cai(goc, KHO[0]!);
    expect(r.ok).toBe(true);
    expect(r.duongDan).toBe('.claude/skills/database-optimizer/SKILL.md');
    const tho = await fs.readFile(path.join(goc, r.duongDan!), 'utf8');
    expect(tho).toContain('Thân kỹ năng.');
  });

  it('agent → `.claude/agents/<tên>.md`, command → `.claude/commands/<tên>.md`', async () => {
    // Ba loại ba thư mục; dịch sai chỗ nào thì agent không đọc được tệp đó và
    // triệu chứng là "cài xong mà chẳng thấy gì".
    gia('nội dung');
    expect((await cai(goc, KHO[2]!)).duongDan).toBe('.claude/agents/accessibility-tester.md');
    expect((await cai(goc, KHO[3]!)).duongDan).toBe('.claude/commands/supply-chain-audit.md');
  });

  it('⛔ KHÔNG ghi đè tệp đã có, trừ khi nói rõ `--de`', async () => {
    gia('bản mới');
    await cai(goc, KHO[0]!);
    const p = path.join(goc, '.claude/skills/database-optimizer/SKILL.md');
    await fs.writeFile(p, 'TÔI ĐÃ SỬA TAY', 'utf8');

    const r = await cai(goc, KHO[0]!);
    expect(r.ok).toBe(false);
    expect(r.loi).toContain('--de');
    expect(await fs.readFile(p, 'utf8')).toBe('TÔI ĐÃ SỬA TAY');   // còn nguyên

    expect((await cai(goc, KHO[0]!, { ghiDe: true })).ok).toBe(true);
    expect(await fs.readFile(p, 'utf8')).toBe('bản mới');
  });

  it('⛔ tên độc KHÔNG ghi ra ngoài dự án', async () => {
    // Tên đi vào đường dẫn, mà nó đến từ kho của NGƯỜI KHÁC.
    gia('x');
    const doc = { ...KHO[0]!, ten: '../../../../tmp/thoat' };
    const r = await cai(goc, doc);
    expect(r.ok).toBe(false);
    expect(r.loi).toMatch(/ngoài thư mục dự án/);
  });

  it('chưa mở dự án / tải hỏng ⇒ báo lý do, KHÔNG ném', async () => {
    gia('x');
    expect((await cai(null, KHO[0]!)).loi).toContain('Chưa mở dự án');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })));
    expect((await cai(goc, KHO[0]!)).loi).toContain('404');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 200 })));
    expect((await cai(goc, KHO[1]!)).loi).toContain('rỗng');
  });
});

describe('chỉ mục', () => {
  it('CHỈ nhận skill/agent/command — hook và MCP không lọt vào đây', async () => {
    // Chúng là dòng lệnh SẼ CHẠY và có cửa duyệt vân tay riêng. Lọt vào danh
    // sách này là cài được chúng bằng một lệnh không có cửa duyệt nào.
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([
      { n: 'a', p: 'x/a', c: 'dev', t: 'skill' },
      { n: 'b', p: 'x/b.md', c: 'dev', t: 'hook' },
      { n: 'c', p: 'x/c.json', c: 'dev', t: 'mcp' },
      { n: 'd', p: 'x/d.md', c: 'dev', t: 'agent' },
    ]), { status: 200 })));
    const ds = await napChiMuc('https://vi-du.test');
    expect(ds.map((x) => x.ten).sort()).toEqual(['a', 'd']);
  });
});

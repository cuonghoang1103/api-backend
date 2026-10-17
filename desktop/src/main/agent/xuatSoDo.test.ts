/**
 * Phần THUẦN của `xuat_so_do`: nhận loại nguồn, chọn trang draw.io, màu nền,
 * gắn cỡ thật cho SVG, đếm trang PDF, và chỗ nối vào app/server.
 *
 * Phần VẼ (trình duyệt thật + CDN) không chạy dưới vitest — đã đo riêng
 * 17/10/2026 bằng Chrome headless (puppeteer-core) VÀ Electron 33 thật: draw.io
 * 2 trang, SVG, Mermaid, HTML ⇒ PNG/PDF, nền trong suốt, mất mạng (chặn CDN).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  chonTrang, chuanHoaNen, chuanHoaSvg, demTrangPdf, dungTrang, LoiXuat, nhanLoaiNguon, tenTrangDrawio,
} from './xuatSoDo';

describe('xuatSoDo — phần thuần', () => {
  it('nhận loại theo đuôi, không phân biệt hoa thường', () => {
    expect(nhanLoaiNguon('a/b.drawio')).toBe('drawio');
    expect(nhanLoaiNguon('X.DIO')).toBe('drawio');
    expect(nhanLoaiNguon('s.svg')).toBe('svg');
    expect(nhanLoaiNguon('f.mmd')).toBe('mermaid');
    expect(nhanLoaiNguon('t.htm')).toBe('html');
    expect(nhanLoaiNguon('a.png')).toBeNull();
  });

  it('trang draw.io: số 1-based, tên, sai thì KỂ TÊN các trang có', () => {
    const xml = '<mxfile><diagram name="Đăng nhập"></diagram><diagram id="x" name="Trang &amp; hai"></diagram></mxfile>';
    const ten = tenTrangDrawio(xml);
    expect(ten).toEqual(['Đăng nhập', 'Trang & hai']);
    expect(chonTrang(ten)).toBe(0);
    expect(chonTrang(ten, 2)).toBe(1);
    expect(chonTrang(ten, '2')).toBe(1);
    expect(chonTrang(ten, 'trang & HAI')).toBe(1);
    expect(() => chonTrang(ten, 3)).toThrow(/1\. Đăng nhập, 2\. Trang & hai/);
    expect(() => chonTrang(ten, 'không có')).toThrow(LoiXuat);
  });

  it('màu nền: mặc định trắng, "trong-suot" ⇒ null, chặn chuỗi CSS lạ', () => {
    expect(chuanHoaNen()).toBe('#ffffff');
    expect(chuanHoaNen('trong-suot')).toBeNull();
    expect(chuanHoaNen('transparent')).toBeNull();
    expect(chuanHoaNen('#1d3557')).toBe('#1d3557');
    // Màu đi thẳng vào <style> của trang vẽ — không được mở đường chèn CSS/HTML.
    expect(() => chuanHoaNen('red;}</style><script>')).toThrow(LoiXuat);
  });

  it('SVG chỉ có viewBox (hoặc width=100%) ⇒ gắn cỡ thật, không co về 300×150', () => {
    const a = chuanHoaSvg('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140"><rect/></svg>');
    expect([a.rong, a.cao]).toEqual([320, 140]);
    expect(a.svg).toMatch(/<svg width="320" height="140"/);
    const b = chuanHoaSvg('<svg width="100%" viewBox="0 0 200 100"></svg>');
    expect([b.rong, b.cao]).toEqual([200, 100]);
    const c = chuanHoaSvg('<svg width="400px" viewBox="0 0 200 100"></svg>');
    expect([c.rong, c.cao]).toEqual([400, 200]);
    expect(() => chuanHoaSvg('<svg></svg>')).toThrow(LoiXuat);
  });

  it('nguồn có "</script>" không cắt đứt trang vẽ', () => {
    const html = dungTrang('mermaid', 'flowchart LR\n A["</script><script>alert(1)</script>"]', '#fff');
    expect(html.match(/<\/script>/g)?.length).toBe(html.match(/<script/g)?.length);
  });

  it('đếm trang PDF thô', () => {
    expect(demTrangPdf(Buffer.from('<< /Type /Pages /Kids [1 0 R 2 0 R] >> << /Type /Page >> << /Type/Page >>', 'latin1'))).toBe(2);
  });
});

describe('xuat_so_do được cắm ĐỦ (tool app + capability + máy chủ)', () => {
  const goc = path.join(import.meta.dirname, '../../../..');
  it('app chạy tool, khai capability, máy chủ khai tool + ALL_CAPABILITIES + prompt', () => {
    const tools = readFileSync(path.join(goc, 'desktop/src/main/agent/tools.ts'), 'utf8');
    const loop = readFileSync(path.join(goc, 'desktop/src/main/agent/loop.ts'), 'utf8');
    const mc = readFileSync(path.join(goc, 'src/services/agent/tools.ts'), 'utf8');
    const prompt = readFileSync(path.join(goc, 'src/services/agent/prompt.ts'), 'utf8');
    expect(tools).toContain("case 'xuat_so_do':");
    expect(loop).toContain("capabilities.push('xuat_so_do')");
    expect(mc).toContain("name: 'xuat_so_do'");
    expect(mc).toMatch(/const ALL_CAPABILITIES[^=]*= \[[^\]]*'xuat_so_do'/);
    expect(prompt).toContain('xuat_so_do');
    // Lõi ngoài app phải tráo bộ vẽ, không thì gói nhầm BrowserWindow giả.
    expect(readFileSync(path.join(goc, 'packages/cuongmini-core/esbuildLoi.mjs'), 'utf8')).toContain("'agent/boVeSoDo.ts'");
  });
});

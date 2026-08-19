/**
 * Kiểm kho phiên AI Code — phần NHÃN NGƯỜI DÙNG ĐẶT (tên · ghim · lưu trữ)
 * và phép nhân bản.
 *
 * Vì sao đáng kiểm: ba trường này nằm ở file KHÁC với hội thoại
 * (`nhan.json`), và cả điểm của việc tách file là để `luuPhien` — chạy sau
 * MỖI bước agent — không xoá mất chúng. Đó là kiểu hỏng không có lỗi nào để
 * thấy: người dùng ghim một việc, agent chạy tiếp, cái ghim lặng lẽ biến mất.
 *
 * Chạy trên thư mục tạm thật, không giả `fs`: bug ở đây là bug về THỨ TỰ ghi
 * và về việc file nào đè file nào, mà `fs` giả thì che mất đúng phần đó.
 */
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const goc = await fs.mkdtemp(path.join(os.tmpdir(), 'phien-test-'));
vi.mock('electron', () => ({ app: { getPath: () => process.env.PHIEN_TEST_DIR! } }));
vi.mock('../config', () => ({ API_ORIGIN: 'http://localhost:0' }));
process.env.PHIEN_TEST_DIR = goc;

const {
  danhSachPhien, datGhimPhien, datLuuTruPhien, docPhien, doiTenPhien, luuPhien,
  nhanBanPhien, tenNhanh, xoaPhien,
} = await import('./phien');

const hoiThoai = [
  { role: 'user' as const, content: 'câu hỏi một' },
  { role: 'assistant' as const, content: 'trả lời một' },
  { role: 'user' as const, content: 'câu hỏi hai' },
  { role: 'assistant' as const, content: 'trả lời hai' },
];

async function donSach(): Promise<void> {
  await fs.rm(path.join(goc, 'agent-phien'), { recursive: true, force: true });
}

beforeEach(donSach);
afterAll(async () => { await fs.rm(goc, { recursive: true, force: true }); });

describe('nhãn người dùng đặt', () => {
  it('ghim đẩy việc CŨ HƠN lên đầu danh sách', async () => {
    await luuPhien('pcu', hoiThoai, 'duan-a');
    // Lùi mốc thời gian của 'pcu' để nó chắc chắn cũ hơn.
    const f = path.join(goc, 'agent-phien', 'pcu.json');
    const j = JSON.parse(await fs.readFile(f, 'utf8'));
    j.luucLuc = Date.now() - 86_400_000;
    await fs.writeFile(f, JSON.stringify(j));
    await luuPhien('pmoi', hoiThoai, 'duan-a');

    expect((await danhSachPhien()).map((p) => p.id)).toEqual(['pmoi', 'pcu']);
    await datGhimPhien('pcu', true);
    expect((await danhSachPhien()).map((p) => p.id)).toEqual(['pcu', 'pmoi']);
  });

  it('tên tự đặt SỐNG SÓT qua lần lưu tiếp theo của agent', async () => {
    await luuPhien('p1', hoiThoai, null);
    await doiTenPhien('p1', 'Tên tôi đặt');
    expect((await danhSachPhien())[0]?.tieuDe).toBe('Tên tôi đặt');

    // Agent chạy thêm một bước ⇒ ghi đè trọn file phiên.
    await luuPhien('p1', [...hoiThoai, { role: 'user', content: 'câu hỏi ba' }], null);
    expect((await danhSachPhien())[0]?.tieuDe).toBe('Tên tôi đặt');
    expect((await docPhien('p1'))?.tieuDe).toBe('Tên tôi đặt');
  });

  it('tên rỗng = bỏ tên tự đặt, quay về tên trong file', async () => {
    await luuPhien('p1', hoiThoai, null);
    await doiTenPhien('p1', 'Tạm đặt');
    await doiTenPhien('p1', '   ');
    expect((await danhSachPhien())[0]?.tieuDe).toBe('câu hỏi một');
  });

  it('lưu trữ chỉ đổi CỜ, không xoá file', async () => {
    await luuPhien('p1', hoiThoai, null);
    await datLuuTruPhien('p1', true);
    const ds = await danhSachPhien();
    expect(ds).toHaveLength(1);
    expect(ds[0]?.luuTru).toBe(true);
    expect((await docPhien('p1'))?.hoiThoai).toHaveLength(4);
  });

  it('xoá phiên dọn LUÔN nhãn — id dùng lại không thừa hưởng ghim', async () => {
    await luuPhien('p1', hoiThoai, null);
    await datGhimPhien('p1', true);
    await xoaPhien('p1');
    await luuPhien('p1', hoiThoai, null);
    expect((await danhSachPhien())[0]?.ghim).toBe(false);
  });
});

describe('đặt tên bản nhánh', () => {
  it('lần đầu thêm "(nhánh)"', () => {
    expect(tenNhanh('Vá lỗi CORS')).toBe('Vá lỗi CORS (nhánh)');
  });

  it('nhánh CỦA nhánh thì ĐẾM SỐ, không chồng đuôi', () => {
    expect(tenNhanh('Vá lỗi CORS (nhánh)')).toBe('Vá lỗi CORS (nhánh 2)');
    expect(tenNhanh('Vá lỗi CORS (nhánh 2)')).toBe('Vá lỗi CORS (nhánh 3)');
    expect(tenNhanh('Vá lỗi CORS (nhánh 9)')).toBe('Vá lỗi CORS (nhánh 10)');
  });

  it('tên rỗng vẫn ra một cái tên đọc được', () => {
    expect(tenNhanh('   ')).toBe('Việc chưa đặt tên (nhánh)');
  });

  it('"(nhánh)" nằm GIỮA tên thì không tính — chỉ đuôi mới tính', () => {
    expect(tenNhanh('Thử (nhánh) mới')).toBe('Thử (nhánh) mới (nhánh)');
  });
});

describe('nhân bản', () => {
  it('chép TRỌN việc, id mới, và KHÔNG thừa hưởng ghim', async () => {
    await luuPhien('p1', hoiThoai, 'duan-a');
    await datGhimPhien('p1', true);

    const ban = await nhanBanPhien('p1');
    expect(ban).not.toBeNull();
    expect(ban!.id).not.toBe('p1');
    expect(ban!.tieuDe).toContain('(nhánh)');

    const sao = await docPhien(ban!.id);
    expect(sao?.hoiThoai).toEqual(hoiThoai);
    expect(sao?.duAn).toBe('duan-a');
    expect(sao?.ghim).toBe(false);
    // Bản GỐC không được đụng tới — đó là cả lý do tách nhánh khác quay lui.
    expect((await docPhien('p1'))?.hoiThoai).toHaveLength(4);
  });

  it('tách nhánh TỪ câu hỏi thứ k: cắt trước nó và trả lại nguyên văn câu đó', async () => {
    await luuPhien('p1', hoiThoai, null);
    const ban = await nhanBanPhien('p1', 2);
    expect(ban?.cauHoi).toBe('câu hỏi hai');
    // Giữ lại đúng câu hỏi 1 + trả lời 1.
    expect((await docPhien(ban!.id))?.hoiThoai).toEqual(hoiThoai.slice(0, 2));
  });

  it('tách nhánh từ câu hỏi ĐẦU cho ra việc rỗng, không phải null', async () => {
    await luuPhien('p1', hoiThoai, null);
    const ban = await nhanBanPhien('p1', 1);
    expect(ban?.cauHoi).toBe('câu hỏi một');
    expect((await docPhien(ban!.id))?.hoiThoai).toEqual([]);
  });

  it('câu hỏi thứ k không tồn tại ⇒ null, KHÔNG tạo file rác', async () => {
    await luuPhien('p1', hoiThoai, null);
    expect(await nhanBanPhien('p1', 9)).toBeNull();
    expect(await danhSachPhien()).toHaveLength(1);
  });
});

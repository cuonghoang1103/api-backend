/**
 * LÙI FILE VỀ MỘT MỐC — canh phần dễ sai nhất: duyệt NGƯỢC.
 *
 * Phép kiểm ghi file THẬT vào thư mục tạm, không giả `fs`. Lỗi ở đây là lỗi
 * trạng thái đĩa: một bản giả `fs` sẽ khẳng định thứ tự ghi mà tôi tự nghĩ ra,
 * đúng cái thứ đang cần kiểm.
 */
import { mkdtemp, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

/* `tools.ts` kéo theo `electron` qua chuỗi import (config → ghiNote). Phép kiểm
   này không đụng tới Electron chút nào, nên chặn ở cửa thay vì dựng cả app. */
vi.mock('electron', () => ({
  app: { getPath: () => tmpdir(), isPackaged: false },
  BrowserWindow: { getAllWindows: () => [] },
  shell: {},
  dialog: {},
}));
import { taoSoCuoc, ghiSoTruoc } from './so';
import { luiFileVeLuot, demFileSeLui } from './tools';

const conSong = async (p: string) => access(p).then(() => true, () => false);

/** Giả lập agent sửa file ở một lượt: ghi sổ TRƯỚC rồi mới ghi đĩa, đúng thứ tự thật. */
async function suaO(so: ReturnType<typeof taoSoCuoc>, luot: number, duong: string, moi: string) {
  so.luot = luot;
  const truoc = await readFile(duong, 'utf8').catch(() => null);
  ghiSoTruoc(so, duong, truoc);
  await mkdir(join(duong, '..'), { recursive: true });
  await writeFile(duong, moi, 'utf8');
}

describe('lùi file về một mốc', () => {
  it('file bị sửa NHIỀU lượt phải về đúng trạng thái trước mốc, không phải lượt kề', async () => {
    const goc = await mkdtemp(join(tmpdir(), 'ct-lui-'));
    const f = join(goc, 'a.txt');
    await writeFile(f, 'v0', 'utf8');
    const so = taoSoCuoc();

    await suaO(so, 1, f, 'v1');
    await suaO(so, 2, f, 'v2');
    await suaO(so, 3, f, 'v3');
    expect(await readFile(f, 'utf8')).toBe('v3');

    /* Đây là cả lý do phải duyệt NGƯỢC. Đi xuôi thì bản ghi của lượt 3 ('v2')
       được viết SAU CÙNG và file kẹt ở 'v2' — lệch đúng một lượt, và lệch câm. */
    const kq = await luiFileVeLuot(so, 2);
    expect(kq.soFile).toBe(1);
    expect(await readFile(f, 'utf8'), 'phải về trạng thái TRƯỚC lượt 2').toBe('v1');
  });

  it('file agent TẠO MỚI sau mốc thì bị XOÁ, không phải để lại rỗng', async () => {
    const goc = await mkdtemp(join(tmpdir(), 'ct-lui-'));
    const f = join(goc, 'moi.txt');
    const so = taoSoCuoc();
    await suaO(so, 2, f, 'nội dung mới');
    expect(await conSong(f)).toBe(true);

    await luiFileVeLuot(so, 2);
    expect(await conSong(f), 'file chưa từng tồn tại trước mốc ⇒ phải biến mất').toBe(false);
  });

  it('KHÔNG đụng file chỉ bị sửa TRƯỚC mốc — đó là cả điểm khác với hoàn tác tất cả', async () => {
    const goc = await mkdtemp(join(tmpdir(), 'ct-lui-'));
    const cu = join(goc, 'viec-dung.txt');
    const moi = join(goc, 'viec-hong.txt');
    await writeFile(cu, 'goc', 'utf8');
    const so = taoSoCuoc();

    await suaO(so, 1, cu, 'việc đúng, phải GIỮ');
    await suaO(so, 4, moi, 'việc hỏng, phải bỏ');

    expect(demFileSeLui(so, 4)).toBe(1);
    const kq = await luiFileVeLuot(so, 4);
    expect(kq.soFile).toBe(1);
    expect(await readFile(cu, 'utf8'), 'việc đúng ở lượt 1 phải còn nguyên').toBe('việc đúng, phải GIỮ');
    expect(await conSong(moi)).toBe(false);
  });

  it('sổ hoàn-tác-TẤT-CẢ vẫn nguyên sau khi lùi một phần', async () => {
    const goc = await mkdtemp(join(tmpdir(), 'ct-lui-'));
    const f = join(goc, 'a.txt');
    await writeFile(f, 'v0', 'utf8');
    const so = taoSoCuoc();
    await suaO(so, 1, f, 'v1');
    await suaO(so, 2, f, 'v2');

    await luiFileVeLuot(so, 2);
    /* Nút Hoàn tác phải còn đưa được về HẲN lúc đầu cuộc. Xoá nhầm sổ này lúc
       lùi một phần thì Hoàn tác im lặng trở thành nút không làm gì. */
    expect(so.nhatKyHoanTac.get(f), 'phải vẫn nhớ trạng thái đầu cuộc').toBe('v0');
    expect(so.buocGhi.every((b) => b.luot < 2), 'mục đã lùi phải bị dọn').toBe(true);
  });
});

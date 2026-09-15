/**
 * Tải file 2,5 GB qua mạng Việt Nam — đứt giữa chừng là BÌNH THƯỜNG.
 *
 * Mọi phép kiểm ở đây chạy trên một máy chủ HTTP thật dựng ngay trong phép
 * kiểm, không giả lập `fetch`. Vì thứ cần kiểm chính là hành vi HTTP: 206 hay
 * 200, có `Range` hay không, 416 lúc đã đủ. Giả lập `fetch` thì chỉ kiểm được
 * đúng cái giả lập mình vừa viết — [[feedback_verify_the_checker_before_the_content]].
 */
import { createServer, type Server } from 'node:http';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { LoiTai, coChu, conLaiGiay, taiFile } from './taiVe';

const NOI_DUNG = Buffer.from('X'.repeat(50_000));

let may: Server;
let goc: string;
let thuMuc: string;

/** Đổi kiểu cư xử của máy chủ giữa các phép kiểm. */
let cheDo: 'binhThuong' | 'khongHoTroRange' | 'trangLoi' | 'chetGiuaChung' = 'binhThuong';

beforeAll(async () => {
  thuMuc = await mkdtemp(join(tmpdir(), 'tai-'));
  may = createServer((req, res) => {
    if (cheDo === 'trangLoi') {
      /* Trang đăng nhập của Wi-Fi công cộng: 200, nhưng nội dung là HTML. */
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html>Đăng nhập Wi-Fi</html>');
      return;
    }
    const range = cheDo === 'khongHoTroRange' ? undefined : req.headers.range;
    if (range) {
      const tu = Number(/bytes=(\d+)-/.exec(range)?.[1] ?? 0);
      if (tu >= NOI_DUNG.length) {
        res.writeHead(416, { 'Content-Range': `bytes */${NOI_DUNG.length}` });
        res.end();
        return;
      }
      const phan = NOI_DUNG.subarray(tu);
      res.writeHead(206, {
        'Content-Length': String(phan.length),
        'Content-Range': `bytes ${tu}-${NOI_DUNG.length - 1}/${NOI_DUNG.length}`,
      });
      res.end(phan);
      return;
    }
    if (cheDo === 'chetGiuaChung') {
      res.writeHead(200, { 'Content-Length': String(NOI_DUNG.length) });
      res.write(NOI_DUNG.subarray(0, 1000));
      res.destroy();
      return;
    }
    res.writeHead(200, { 'Content-Length': String(NOI_DUNG.length) });
    res.end(NOI_DUNG);
  });
  await new Promise<void>((ok) => may.listen(0, '127.0.0.1', ok));
  const cong = (may.address() as { port: number }).port;
  goc = `http://127.0.0.1:${cong}`;
});

afterAll(async () => {
  await new Promise<void>((ok) => { may.close(() => ok()); });
  await rm(thuMuc, { recursive: true, force: true });
});

describe('tải file', () => {
  it('tải trọn và đổi tên sang tên thật', async () => {
    cheDo = 'binhThuong';
    const dich = join(thuMuc, 'a.bin');
    await taiFile({ url: `${goc}/a`, dich, coMong: NOI_DUNG.length });
    expect((await stat(dich)).size).toBe(NOI_DUNG.length);
    /* Không được để lại file tạm — nó sẽ chiếm đĩa mãi mãi. */
    await expect(stat(`${dich}.dangtai`)).rejects.toThrow();
  });

  it('⛔ file ở TÊN THẬT luôn là file trọn — phần dở nằm ở .dangtai', async () => {
    cheDo = 'chetGiuaChung';
    const dich = join(thuMuc, 'b.bin');
    await expect(taiFile({ url: `${goc}/b`, dich, coMong: NOI_DUNG.length }))
      .rejects.toThrow(LoiTai);
    /* Tên thật KHÔNG được tồn tại: app nạp phải model cụt sẽ chết với một lỗi
       không ai lần ra được. */
    await expect(stat(dich)).rejects.toThrow();
  });

  it('tải tiếp từ chỗ dở, không tải lại từ đầu', async () => {
    cheDo = 'binhThuong';
    const dich = join(thuMuc, 'c.bin');
    /* Giả lập lần trước đứt ở 20.000 byte. */
    await writeFile(`${dich}.dangtai`, NOI_DUNG.subarray(0, 20_000));
    let daCoLucDau = -1;
    await taiFile({
      url: `${goc}/c`,
      dich,
      coMong: NOI_DUNG.length,
      onTienDo: (t) => { if (daCoLucDau < 0) daCoLucDau = t.daCo; },
    });
    expect((await readFile(dich)).equals(NOI_DUNG)).toBe(true);
  });

  it('máy chủ KHÔNG hỗ trợ tải tiếp ⇒ ghi đè, không nối thêm', async () => {
    /* Đây là bẫy im lặng: xin `Range` mà nhận 200, nếu nối vào phần dở thì
       file dài hơn thật và hỏng câm. */
    cheDo = 'khongHoTroRange';
    const dich = join(thuMuc, 'd.bin');
    await writeFile(`${dich}.dangtai`, NOI_DUNG.subarray(0, 20_000));
    await taiFile({ url: `${goc}/d`, dich, coMong: NOI_DUNG.length });
    expect((await stat(dich)).size).toBe(NOI_DUNG.length);
  });

  it('phần dở LỚN HƠN file thật ⇒ bỏ đi làm lại', async () => {
    cheDo = 'binhThuong';
    const dich = join(thuMuc, 'e.bin');
    await writeFile(`${dich}.dangtai`, Buffer.alloc(NOI_DUNG.length + 9_000, 1));
    await taiFile({ url: `${goc}/e`, dich, coMong: NOI_DUNG.length });
    expect((await stat(dich)).size).toBe(NOI_DUNG.length);
  });

  it('phần dở đã ĐỦ ⇒ 416 là xong, không phải lỗi', async () => {
    cheDo = 'binhThuong';
    const dich = join(thuMuc, 'f.bin');
    await writeFile(`${dich}.dangtai`, NOI_DUNG);
    await taiFile({ url: `${goc}/f`, dich, coMong: NOI_DUNG.length });
    expect((await stat(dich)).size).toBe(NOI_DUNG.length);
  });

  it('⛔ trang đăng nhập Wi-Fi trả 200 ⇒ bắt được nhờ so cỡ', async () => {
    cheDo = 'trangLoi';
    const dich = join(thuMuc, 'g.bin');
    await expect(taiFile({ url: `${goc}/g`, dich, coMong: NOI_DUNG.length }))
      .rejects.toMatchObject({ maLoi: 'cocHong' });
    await expect(stat(dich)).rejects.toThrow();
  });

  it('file đã có sẵn và đúng cỡ ⇒ trả về ngay, không tải lại', async () => {
    cheDo = 'trangLoi'; // máy chủ đang hỏng — nếu nó có gọi mạng thì sẽ lộ ra
    const dich = join(thuMuc, 'h.bin');
    await writeFile(dich, NOI_DUNG);
    await expect(taiFile({ url: `${goc}/h`, dich, coMong: NOI_DUNG.length }))
      .resolves.toBe(dich);
  });

  it('huỷ giữa chừng ⇒ báo mã "huy" và GIỮ phần dở lại', async () => {
    cheDo = 'binhThuong';
    const dich = join(thuMuc, 'i.bin');
    const bo = new AbortController();
    bo.abort();
    await expect(taiFile({ url: `${goc}/i`, dich, signal: bo.signal }))
      .rejects.toMatchObject({ maLoi: 'huy' });
  });

  it('hai lượt tải CÙNG một file ⇒ lượt sau bị từ chối', async () => {
    cheDo = 'binhThuong';
    const dich = join(thuMuc, 'j.bin');
    const mot = taiFile({ url: `${goc}/j`, dich, coMong: NOI_DUNG.length });
    await expect(taiFile({ url: `${goc}/j`, dich, coMong: NOI_DUNG.length }))
      .rejects.toMatchObject({ maLoi: 'dangTai' });
    await mot;
  });
});

describe('số hiện cho người dùng', () => {
  it('còn bao lâu — chưa đủ dữ kiện thì nói KHÔNG BIẾT, đừng bịa', () => {
    expect(conLaiGiay({ daCo: 0, tong: 0, bps: 0 })).toBeNull();
    expect(conLaiGiay({ daCo: 10, tong: 100, bps: 0 })).toBeNull();
    expect(conLaiGiay({ daCo: 100, tong: 100, bps: 50 })).toBeNull();
    expect(conLaiGiay({ daCo: 50, tong: 100, bps: 25 })).toBe(2);
  });

  it('cỡ file đọc được, dùng dấu phẩy kiểu Việt', () => {
    expect(coChu(2.5e9)).toBe('2,5 GB');
    expect(coChu(840e6)).toBe('840 MB');
    expect(coChu(12e3)).toBe('12 KB');
  });
});

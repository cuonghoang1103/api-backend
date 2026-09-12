/**
 * Kiểm kho mẫu.
 *
 * Cái kho này có đúng MỘT lý do tồn tại: sáu tháng sau vẫn trả lời được "bài
 * này có đem đi diễn được không". Nên mọi phép kiểm ở đây xoay quanh việc giấy
 * phép có SỐNG SÓT hay không — qua lần đọc lại, qua tệp kèm hỏng, qua tên
 * trùng, qua chuỗi độc từ renderer.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  GIAY_PHEP, NGUON_MAU, dongGhiCong, dsMau, laTepNhac, tenTepAnToan, themMau,
  thuMucKho, traGiayPhep, xoaMau,
} from './khoMau';

let goc = '';

beforeEach(async () => { goc = await fs.mkdtemp(path.join(os.tmpdir(), 'kho-mau-')); });
afterEach(async () => { await fs.rm(goc, { recursive: true, force: true }); });

/** Một tệp nhạc giả trên đĩa — kho không giải mã nội dung nên byte gì cũng được. */
async function tepThu(ten = 'vocal loop.wav', byte = 2048): Promise<string> {
  const d = path.join(goc, 'tai-ve');
  await fs.mkdir(d, { recursive: true });
  const t = path.join(d, ten);
  await fs.writeFile(t, Buffer.alloc(byte, 7));
  return t;
}

describe('bảng giấy phép', () => {
  it('⭐ mọi giấy phép PHI THƯƠNG MẠI và CHƯA RÕ đều bị đánh dấu không diễn được', () => {
    /* Đây là con số duy nhất trong app dám trả lời thay người dùng. Đánh dấu
       sai một dòng là họ đem một bản CC BY-NC ra quán và bị gỡ. */
    expect(traGiayPhep('cc-by-nc').dienDuoc).toBe(false);
    expect(traGiayPhep('khac').dienDuoc).toBe(false);
    expect(traGiayPhep('cc0').dienDuoc).toBe(true);
    expect(traGiayPhep('cc-by').dienDuoc).toBe(true);
  });

  it('⭐ mã lạ rơi về "chưa rõ", KHÔNG rơi về một giấy phép dễ dãi', () => {
    /* Mặc định phải là cái an toàn. Rơi về CC0 thì một tệp kèm hỏng biến
       thành một lời cho phép. */
    expect(traGiayPhep('khong-co-that').ma).toBe('khac');
    expect(traGiayPhep('').dienDuoc).toBe(false);
  });

  it('mã giấy phép là duy nhất', () => {
    const ma = GIAY_PHEP.map((g) => g.ma);
    expect(new Set(ma).size).toBe(ma.length);
  });

  it('nguồn nào cũng có URL https và mô tả', () => {
    for (const n of NGUON_MAU) {
      expect(n.url, n.ma).toMatch(/^https:\/\//);
      expect(n.moTa.length, n.ma).toBeGreaterThan(20);
    }
  });
});

describe('tên tệp', () => {
  it('giữ dấu tiếng Việt', () => {
    expect(tenTepAnToan('Giọng hát mẫu.wav')).toBe('Giọng hát mẫu.wav');
  });

  it('⭐ chặn mọi dạng đi ra khỏi thư mục', () => {
    expect(tenTepAnToan('../../../etc/passwd.wav')).not.toContain('..');
    expect(tenTepAnToan('../../../etc/passwd.wav')).not.toContain('/');
  });

  it('bỏ ký tự cấm của Windows', () => {
    expect(tenTepAnToan('a:b*c?d.wav')).toBe('a b c d.wav');
  });

  it('tên rỗng vẫn ra một tên dùng được', () => {
    /* Toàn dấu chấm ⇒ sau khi rửa còn chuỗi rỗng ⇒ rơi về `mau`. */
    expect(tenTepAnToan('...')).toBe('mau.wav');
    expect(tenTepAnToan('   ')).toBe('mau.wav');
  });

  it('tệp ẩn `.wav` (không có phần đuôi) ra `wav.wav`', () => {
    /* `path.extname('.wav')` là chuỗi RỖNG — dấu chấm đứng đầu nghĩa là tệp
       ẩn không có đuôi, không phải một tệp WAV. Nên `wav` thành phần TÊN và
       `.wav` được gắn vào làm đuôi mặc định. Trông lạ nhưng đúng, và đường
       này không tới được từ `themMau` (nó chặn từ `laTepNhac` trước). */
    expect(tenTepAnToan('.wav')).toBe('wav.wav');
    expect(laTepNhac('.wav')).toBe(false);
  });

  it('đuôi lạ bị ép về .wav', () => {
    expect(tenTepAnToan('x.exe')).toBe('x.wav');
  });

  it('nhận đúng những đuôi renderer giải mã được', () => {
    expect(laTepNhac('a.flac')).toBe(true);
    expect(laTepNhac('a.MP3')).toBe(true);
    expect(laTepNhac('a.txt')).toBe(false);
  });
});

describe('thêm và đọc lại', () => {
  it('chép tệp vào kho và ghi tệp kèm', async () => {
    const m = await themMau(goc, await tepThu(), {
      giayPhep: 'cc-by', tacGia: 'Ai Đó', nguon: 'ccMixter',
      url: 'https://ccmixter.org/files/x/1', ten: 'Giọng nữ 128',
    });
    expect(m.coGiayPhep).toBe(true);
    await expect(fs.stat(m.duong)).resolves.toBeTruthy();
    await expect(fs.stat(`${m.duong}.giay-phep.json`)).resolves.toBeTruthy();

    const ds = await dsMau(goc);
    expect(ds).toHaveLength(1);
    expect(ds[0]!.giayPhep).toBe('cc-by');
    expect(ds[0]!.tacGia).toBe('Ai Đó');
    expect(ds[0]!.ten).toBe('Giọng nữ 128');
    expect(ds[0]!.byte).toBe(2048);
  });

  it('⭐ tệp gốc bị dọn đi thì mẫu VẪN CÒN — kho giữ bản chép', async () => {
    /* Trỏ tới chỗ cũ thay vì chép thì người dùng dọn Downloads là cả kho
       thành một danh sách đường dẫn chết. */
    const t = await tepThu('se-bi-xoa.wav');
    const m = await themMau(goc, t, { giayPhep: 'cc0' });
    await fs.rm(t);
    const ds = await dsMau(goc);
    expect(ds).toHaveLength(1);
    expect(ds[0]!.duong).toBe(m.duong);
  });

  it('⭐ hai tệp TRÙNG TÊN không đè nhau — đè là xoá luôn giấy phép cái cũ', async () => {
    const a = await themMau(goc, await tepThu('loop.wav'), { giayPhep: 'cc0', ten: 'A' });
    const b = await themMau(goc, await tepThu('loop.wav'), { giayPhep: 'cc-by-nc', ten: 'B' });
    expect(b.tep).not.toBe(a.tep);
    const ds = await dsMau(goc);
    expect(ds).toHaveLength(2);
    expect(ds.map((x) => x.giayPhep).sort()).toEqual(['cc-by-nc', 'cc0']);
  });

  it('⭐ tệp kèm HỎNG ⇒ mẫu hiện là "chưa rõ", không biến mất và không thành CC0', async () => {
    const m = await themMau(goc, await tepThu('hong.wav'), { giayPhep: 'cc0' });
    await fs.writeFile(`${m.duong}.giay-phep.json`, '{ đây không phải JSON', 'utf8');
    const ds = await dsMau(goc);
    expect(ds).toHaveLength(1);
    expect(ds[0]!.coGiayPhep).toBe(false);
    expect(ds[0]!.giayPhep).toBe('khac');
    expect(traGiayPhep(ds[0]!.giayPhep).dienDuoc).toBe(false);
  });

  it('⭐ tệp kèm MẤT HẲN cũng vậy — thiếu giấy phép là KHÔNG BIẾT, không phải cho phép', async () => {
    const m = await themMau(goc, await tepThu('trui.wav'), { giayPhep: 'cc0' });
    await fs.rm(`${m.duong}.giay-phep.json`);
    const ds = await dsMau(goc);
    expect(ds[0]!.coGiayPhep).toBe(false);
    expect(ds[0]!.giayPhep).toBe('khac');
  });

  it('trường sai kiểu trong tệp kèm không lọt ra giao diện', async () => {
    /* Tệp này nằm trong thư mục của người dùng, họ sửa tay được. */
    const m = await themMau(goc, await tepThu('la.wav'), { giayPhep: 'cc0' });
    await fs.writeFile(`${m.duong}.giay-phep.json`,
      JSON.stringify({ ten: 42, giayPhep: [], tacGia: null, themLuc: 'hôm qua' }), 'utf8');
    const ds = await dsMau(goc);
    expect(typeof ds[0]!.ten).toBe('string');
    expect(typeof ds[0]!.tacGia).toBe('string');
    expect(typeof ds[0]!.themLuc).toBe('number');
    expect(ds[0]!.giayPhep).toBe('khac');
  });

  it('kho chưa có thì trả mảng rỗng chứ không ném', async () => {
    expect(await dsMau(path.join(goc, 'chua-co'))).toEqual([]);
  });

  it('tệp không phải nhạc bị từ chối', async () => {
    const t = path.join(goc, 'doc.txt');
    await fs.writeFile(t, 'xin chào');
    await expect(themMau(goc, t, { giayPhep: 'cc0' })).rejects.toThrow(/Chỉ nhận tệp nhạc/);
  });

  it('mới nhất đứng trước', async () => {
    await themMau(goc, await tepThu('cu.wav'), { giayPhep: 'cc0', ten: 'cũ' });
    await new Promise((r) => { setTimeout(r, 5); });
    await themMau(goc, await tepThu('moi.wav'), { giayPhep: 'cc0', ten: 'mới' });
    expect((await dsMau(goc))[0]!.ten).toBe('mới');
  });
});

describe('xoá', () => {
  it('xoá cả tệp lẫn tệp kèm', async () => {
    const m = await themMau(goc, await tepThu(), { giayPhep: 'cc0' });
    await xoaMau(goc, m.tep);
    expect(await dsMau(goc)).toEqual([]);
    await expect(fs.stat(`${m.duong}.giay-phep.json`)).rejects.toThrow();
  });

  it('⭐ tên có `..` KHÔNG xoá được thứ ngoài kho', async () => {
    const nanNhan = path.join(goc, 'quan-trong.wav');
    await fs.writeFile(nanNhan, 'đừng xoá tôi');
    await xoaMau(goc, '../quan-trong.wav').catch(() => undefined);
    await expect(fs.stat(nanNhan)).resolves.toBeTruthy();
  });

  it('tên không phải tệp nhạc thì NÉM', async () => {
    await expect(xoaMau(goc, 'settings.json')).rejects.toThrow(/tệp nhạc/);
  });

  it('xoá thứ không có cũng không ném', async () => {
    await expect(xoaMau(goc, 'khong-co.wav')).resolves.toBeUndefined();
  });
});

describe('dòng ghi công', () => {
  it('⭐ chỉ liệt kê thứ ĐÒI ghi công', async () => {
    /* Nhét cả CC0 vào thì danh sách dài ra và người ta thôi không đọc — tức
       là đúng những dòng BẮT BUỘC lại bị bỏ qua. */
    await themMau(goc, await tepThu('a.wav'), { giayPhep: 'cc0', ten: 'Không cần' });
    await themMau(goc, await tepThu('b.wav'), {
      giayPhep: 'cc-by', ten: 'Cần ghi', tacGia: 'Bạn Nào Đó',
      url: 'https://ccmixter.org/x',
    });
    const d = dongGhiCong(await dsMau(goc));
    expect(d).toHaveLength(1);
    expect(d[0]).toContain('Cần ghi');
    expect(d[0]).toContain('Bạn Nào Đó');
    expect(d[0]).toContain('https://ccmixter.org/x');
  });

  it('mẫu chưa rõ giấy phép CŨNG vào danh sách ghi công', async () => {
    /* `khac` có `ghiCong: true` có chủ ý: chưa biết thì cứ ghi tên vào, thừa
       một dòng còn hơn thiếu một dòng bắt buộc. */
    await themMau(goc, await tepThu('c.wav'), { giayPhep: 'khac', ten: 'Chưa rõ' });
    expect(dongGhiCong(await dsMau(goc))).toHaveLength(1);
  });

  it('kho rỗng thì không có dòng nào', () => {
    expect(dongGhiCong([])).toEqual([]);
  });
});

describe('đường dẫn kho', () => {
  it('nằm dưới userData/nhac', () => {
    expect(thuMucKho('/tmp/ud')).toBe(path.join('/tmp/ud', 'nhac', 'kho-mau'));
  });
});

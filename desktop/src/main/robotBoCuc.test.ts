/**
 * "THẢ Ở ĐÂU ĐỨNG YÊN Ở ĐÓ" — kiểm bằng số phần tính toạ độ của robot nổi.
 *
 * Mỗi nhóm dưới đây ứng với một nguyên nhân thật của lỗi người dùng báo
 * 03/10/2026 ("kéo vào đúng chỗ mà nó tự chạy qua chỗ khác", "cỡ chưa được
 * 20–100% chuẩn"). Xem chú thích "BẢN 03/10/2026" trong `robotViTri.ts`.
 */
import { describe, expect, it } from 'vitest';
import {
  chuanPhanTram, phanTramTuThietDat, coHop, vungDung, manHinhChoDiem, neoKhiKeo,
  doiCoGiuNeo, tinhBoCuc, hopTheoCuaSo, taoViTriLuu, khoiPhucViTri, docViTriLuu,
  viTriKhoiDong, viTriMacDinh, KHE, type ManHinh,
} from './robotViTri';

/** MacBook 1728×1117, thanh menu 33px, dock ở dưới. */
const MAC: ManHinh = {
  id: 1,
  bounds: { x: 0, y: 0, width: 1728, height: 1117 },
  workArea: { x: 0, y: 33, width: 1728, height: 1022 },
  scaleFactor: 2,
};
/** Màn ngoài 2560×1440 đặt BÊN PHẢI, tỉ lệ 1x (Windows hay gặp: 150% + 100%). */
const NGOAI: ManHinh = {
  id: 2,
  bounds: { x: 1728, y: 0, width: 2560, height: 1440 },
  workArea: { x: 1728, y: 0, width: 2560, height: 1400 },
  scaleFactor: 1,
};
const HAI = [MAC, NGOAI];

describe('cỡ 20–100% CHUẨN', () => {
  it('làm tròn về bước 5 và kẹp hai đầu', () => {
    expect(chuanPhanTram(20)).toBe(20);
    expect(chuanPhanTram(100)).toBe(100);
    expect(chuanPhanTram(57)).toBe(55);
    expect(chuanPhanTram(58)).toBe(60);
    expect(chuanPhanTram(5)).toBe(20);
    expect(chuanPhanTram(400)).toBe(100);
    expect(chuanPhanTram(Number.NaN)).toBe(100);
    expect(chuanPhanTram('80')).toBe(100);
  });

  it('cỡ hộp ĐÚNG TỈ LỆ với cỡ gốc 150×160 ở mọi bước', () => {
    for (let pt = 20; pt <= 100; pt += 5) {
      const c = coHop(pt);
      expect(Math.abs(c.width - 150 * pt / 100)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(c.height - 160 * pt / 100)).toBeLessThanOrEqual(0.5);
      expect(Number.isInteger(c.width) && Number.isInteger(c.height)).toBe(true);
    }
    expect(coHop(20)).toEqual({ width: 30, height: 32 });
    expect(coHop(100)).toEqual({ width: 150, height: 160 });
  });

  it('thiết đặt cũ (nấc 0–3) đổi sang % gần đúng, `robotCo` mới thắng', () => {
    expect(phanTramTuThietDat({})).toBe(100);
    expect(phanTramTuThietDat({ odinCo: 3 })).toBe(50);
    expect(phanTramTuThietDat({ odinCo: 1 })).toBe(80);
    expect(phanTramTuThietDat({ odinCo: 3, robotCo: 35 })).toBe(35);
  });
});

describe('kéo: theo con trỏ, sang được màn thứ hai', () => {
  const hop = coHop(100);

  it('⛔ bản cũ kẹp theo màn ĐANG chứa cửa sổ ⇒ không sang được màn ngoài. Nay theo màn chứa CON TRỎ', () => {
    // Nắm robot ở giữa (75, 95), con trỏ đã ở màn ngoài.
    const n = neoKhiKeo({ x: 2000, y: 500 }, { x: 75, y: 95 }, hop, HAI, 'darwin');
    expect(n).toEqual({ x: 1925, y: 405 });  // y: 500 − 95
  });

  it('robot đi ĐÚNG theo con trỏ trong màn — không lệch một điểm ảnh', () => {
    const lech = { x: 40, y: 60 };
    for (const p of [{ x: 300, y: 300 }, { x: 301, y: 302 }, { x: 900, y: 640 }]) {
      expect(neoKhiKeo(p, lech, hop, HAI, 'win32')).toEqual({ x: p.x - 40, y: p.y - 60 });
    }
  });

  it('được đặt ĐÈ lên thanh tác vụ/dock (toàn màn hình), không bị đẩy lên vùng làm việc', () => {
    // Windows: taskbar 40px dưới đáy màn ngoài (workArea cao 1400 / bounds 1440).
    const n = neoKhiKeo({ x: 3000, y: 1430 }, { x: 75, y: 150 }, hop, HAI, 'win32');
    expect(n.y + hop.height).toBe(1440);
  });

  it('macOS chừa thanh menu (hệ điều hành tự đẩy xuống — hai bên đẩy nhau chính là "tự chạy")', () => {
    const n = neoKhiKeo({ x: 400, y: 5 }, { x: 75, y: 20 }, hop, HAI, 'darwin');
    expect(n.y).toBe(33);
    expect(vungDung(MAC, 'win32').y).toBe(0);
  });

  it('kéo văng ra ngoài mọi màn hình ⇒ kẹp vào màn GẦN NHẤT, không mất robot', () => {
    expect(manHinhChoDiem({ x: -900, y: 300 }, HAI)?.id).toBe(1);
    expect(manHinhChoDiem({ x: 9000, y: 300 }, HAI)?.id).toBe(2);
    const n = neoKhiKeo({ x: -5000, y: -5000 }, { x: 0, y: 0 }, hop, HAI, 'win32');
    expect(n).toEqual({ x: 0, y: 0 });
  });
});

describe('đổi cỡ GIỮ chỗ đứng', () => {
  const vung = vungDung(MAC, 'darwin');

  it('robot đặt GIỮA màn hình co về đúng TÂM của nó', () => {
    const neo = { x: 800, y: 500 };
    const n = doiCoGiuNeo(neo, coHop(100), coHop(50), vung);
    const tamCu = { x: 800 + 75, y: 500 + 80 };
    const c = coHop(50);
    expect(Math.abs(n.x + c.width / 2 - tamCu.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(n.y + c.height / 2 - tamCu.y)).toBeLessThanOrEqual(1);
  });

  it('robot ở góc dưới-phải vẫn DÍNH góc khi thu nhỏ rồi phóng to lại', () => {
    const goc = viTriMacDinh(coHop(100), MAC);
    const nho = doiCoGiuNeo(goc, coHop(100), coHop(20), vung);
    expect(nho.x + coHop(20).width).toBe(goc.x + 150);
    expect(nho.y + coHop(20).height).toBe(goc.y + 160);
    const lai = doiCoGiuNeo(nho, coHop(20), coHop(100), vung);
    expect(lai).toEqual(goc);
  });

  it('⛔ kéo thanh trượt qua lại 20↔100 nhiều lần KHÔNG làm robot trôi', () => {
    let n = { x: 40, y: 600 };
    const dau = { ...n };
    let cu = coHop(100);
    for (const pt of [80, 60, 40, 20, 45, 75, 100, 35, 100]) {
      const moi = coHop(pt);
      n = doiCoGiuNeo(n, cu, moi, vung);
      cu = moi;
    }
    expect(Math.abs(n.x - dau.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(n.y - dau.y)).toBeLessThanOrEqual(2);
  });
});

describe('⭐ bong bóng / khung chat KHÔNG làm robot nhảy', () => {
  const vung = vungDung(MAC, 'darwin');
  const hop = coHop(100);
  const viTriRobotTrenManHinh = (b: ReturnType<typeof tinhBoCuc>) => ({
    x: b.hop.gocX === 'trai' ? b.cuaSo.x + b.hop.dx : b.cuaSo.x + b.cuaSo.width - b.hop.dx - hop.width,
    y: b.hop.gocY === 'tren' ? b.cuaSo.y + b.hop.dy : b.cuaSo.y + b.cuaSo.height - b.hop.dy - hop.height,
  });

  const CHO = [
    { x: 10, y: 40 }, { x: 1560, y: 40 }, { x: 10, y: 860 }, { x: 1560, y: 860 }, { x: 790, y: 450 },
  ];

  it('ở MỌI góc màn hình, robot đứng nguyên chỗ khi hiện bong bóng hoặc mở khung chat', () => {
    for (const neo of CHO) {
      for (const nd of [{ width: 316, height: 60 }, { width: 400, height: 520 }, { width: 240, height: 150 }]) {
        const b = tinhBoCuc(neo, hop, nd, vung);
        expect(viTriRobotTrenManHinh(b)).toEqual(neo);
        // cả cửa sổ nằm trong màn hình
        expect(b.cuaSo.x).toBeGreaterThanOrEqual(vung.x);
        expect(b.cuaSo.y).toBeGreaterThanOrEqual(vung.y);
        expect(b.cuaSo.x + b.cuaSo.width).toBeLessThanOrEqual(vung.x + vung.width);
        expect(b.cuaSo.y + b.cuaSo.height).toBeLessThanOrEqual(vung.y + vung.height);
      }
    }
  });

  it('⛔ bản cũ: hiện rồi tắt bong bóng là robot về chỗ KHÁC. Nay về đúng chỗ', () => {
    for (const neo of CHO) {
      const hien = tinhBoCuc(neo, hop, { width: 316, height: 80 }, vung);
      const tat = tinhBoCuc(neo, hop, null, vung);
      expect(viTriRobotTrenManHinh(hien)).toEqual(neo);
      expect(tat.cuaSo).toEqual({ ...neo, ...hop });
    }
  });

  it('nội dung mở về phía CÒN CHỖ: robot sát mép trên ⇒ mở xuống dưới', () => {
    const b = tinhBoCuc({ x: 10, y: 40 }, hop, { width: 400, height: 520 }, vung);
    expect(b.noiDung).toBe('duoi');
    expect(b.cuaSo.y).toBe(40);
    expect(b.cuaSo.height).toBe(160 + KHE + 520);
  });

  it('màn hình thấp không đủ chỗ ⇒ CO khung chat lại, không đẩy robot', () => {
    const thap = { x: 0, y: 0, width: 1280, height: 600 };
    const neo = { x: 600, y: 200 };
    const b = tinhBoCuc(neo, hop, { width: 400, height: 520 }, thap);
    expect(viTriRobotTrenManHinh(b)).toEqual(neo);
    expect(b.caoNoiDung).toBeLessThan(520);
    expect(b.cuaSo.y + b.cuaSo.height).toBeLessThanOrEqual(600);
  });

  it('`uuTien` giữ phía cũ khi còn vừa (kéo khung chat qua nửa kia rồi thả không lật)', () => {
    const neo = { x: 700, y: 700 };   // nửa trái
    const b = tinhBoCuc(neo, hop, { width: 400, height: 520 }, vung, { phai: true, tren: true });
    expect(b.hop.gocX).toBe('phai');
    expect(b.noiDung).toBe('tren');
  });

  it('`hopTheoCuaSo` mô tả đúng robot trong cửa sổ CŨ theo góc MỚI ⇒ chuyển cảnh không giật', () => {
    const neo = { x: 1560, y: 860 };
    const moi = tinhBoCuc(neo, hop, { width: 400, height: 520 }, vung);
    const truoc = hopTheoCuaSo(neo, hop, { ...neo, ...hop }, moi.hop);
    expect(truoc).toEqual({ gocX: moi.hop.gocX, gocY: moi.hop.gocY, dx: 0, dy: 0 });
  });
});

describe('lưu + khôi phục vị trí', () => {
  const hop = coHop(100);

  it('cùng màn hình, cùng độ phân giải ⇒ đúng TỪNG điểm ảnh', () => {
    const luu = taoViTriLuu({ x: 2111, y: 777 }, hop, NGOAI, 'win32');
    expect(khoiPhucViTri(luu, hop, HAI, 'win32')).toEqual({ x: 2111, y: 777 });
  });

  it('màn hình đổi độ phân giải ⇒ giữ vị trí TƯƠNG ĐỐI (sát mép phải vẫn sát mép phải)', () => {
    const neo = { x: 1728 + 2560 - 150, y: 1440 - 160 };
    const luu = taoViTriLuu(neo, hop, NGOAI, 'win32');
    const nho: ManHinh = { ...NGOAI, bounds: { x: 1728, y: 0, width: 1920, height: 1080 } };
    expect(khoiPhucViTri(luu, hop, [MAC, nho], 'win32')).toEqual({ x: 1728 + 1920 - 150, y: 1080 - 160 });
  });

  it('⛔ rút màn ngoài ⇒ robot về VÙNG NHÌN THẤY trên màn còn lại, không biến mất', () => {
    const luu = taoViTriLuu({ x: 3000, y: 300 }, hop, NGOAI, 'win32');
    const n = khoiPhucViTri(luu, hop, [MAC], 'win32')!;
    expect(n.x).toBeGreaterThanOrEqual(0);
    expect(n.x + 150).toBeLessThanOrEqual(1728);
    expect(n.y + 160).toBeLessThanOrEqual(1117);
  });

  it('JSON hỏng ⇒ không vỡ; khoá cũ robotX/robotY vẫn đọc được', () => {
    expect(docViTriLuu({ robotViTri: '{hỏng' })).toBeNull();
    const cu = docViTriLuu({ robotX: 154, robotY: 61 });
    expect(viTriKhoiDong(cu, hop, [MAC], 'darwin')).toEqual({ x: 154, y: 61 });
    // khoá cũ trỏ vào màn đã rút ⇒ null ⇒ nơi gọi dùng góc mặc định
    expect(viTriKhoiDong(docViTriLuu({ robotX: 3000, robotY: 61 }), hop, [MAC], 'darwin')).toBeNull();
    const moi = taoViTriLuu({ x: 500, y: 400 }, hop, MAC, 'darwin');
    expect(docViTriLuu({ robotViTri: JSON.stringify(moi) })).toEqual(moi);
  });
});

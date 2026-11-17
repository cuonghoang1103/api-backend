/**
 * Đọc phụ đề SRT (trạm xuất `<Tên>.vi.srt` + `<Tên>.<zh|en>.srt`). Trình phát vẽ phụ đề TỰ (lớp phủ trên video)
 * thay vì `<track>`: bật cùng lúc hai ngôn ngữ, và phóng to toàn màn hình vẫn thấy chữ.
 *
 * Chịu được: BOM, CRLF, thiếu dòng số thứ tự, mili giây phân cách bằng `.`, giờ một chữ số, thẻ <i>/<b>/{\an8}.
 */

export interface CauPhuDe {
  batDau: number;
  ketThuc: number;
  chu: string;
}

const MOC = /(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/;

function giay(h: string, m: string, s: string, ms: string): number {
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms.padEnd(3, '0')) / 1000;
}

export function docSrt(noiDung: string): CauPhuDe[] {
  const dong = noiDung.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  const ds: CauPhuDe[] = [];
  let hienTai: CauPhuDe | null = null;
  let chu: string[] = [];
  const dong_lai = () => {
    if (hienTai) {
      const t = chu.join('\n').replace(/<\/?[ibu]>/gi, '').replace(/\{\\[^}]*\}/g, '').trim();
      if (t) ds.push({ ...hienTai, chu: t });
    }
    hienTai = null;
    chu = [];
  };
  for (let i = 0; i < dong.length; i += 1) {
    const d = dong[i];
    const m = MOC.exec(d);
    if (m) {
      // Dòng số thứ tự ngay trước mốc đã lỡ bị coi là chữ của câu trước ⇒ gỡ ra.
      if (chu.length && /^\d+$/.test(chu[chu.length - 1].trim())) chu.pop();
      dong_lai();
      hienTai = { batDau: giay(m[1], m[2], m[3], m[4]), ketThuc: giay(m[5], m[6], m[7], m[8]), chu: '' };
      continue;
    }
    if (!hienTai) continue;
    if (d.trim() === '') {
      // Dòng trống kết thúc câu — trừ khi chưa có chữ nào (một số tệp chèn dòng trống sau mốc).
      if (chu.length) dong_lai();
      continue;
    }
    chu.push(d);
  }
  dong_lai();
  ds.sort((a, b) => a.batDau - b.batDau);
  return ds;
}

/** Câu đang hiện ở giây `t` (tìm nhị phân); không có ⇒ null. */
export function cauTaiThoiDiem(ds: CauPhuDe[], t: number): CauPhuDe | null {
  let lo = 0;
  let hi = ds.length - 1;
  let tim = -1;
  while (lo <= hi) {
    const giua = (lo + hi) >> 1;
    if (ds[giua].batDau <= t) { tim = giua; lo = giua + 1; } else { hi = giua - 1; }
  }
  // Câu chồng nhau: lùi vài câu để bắt câu bắt đầu sớm hơn nhưng kết thúc muộn hơn.
  for (let i = tim; i >= 0 && i >= tim - 3; i -= 1) {
    if (ds[i].batDau <= t && t < ds[i].ketThuc) return ds[i];
  }
  return null;
}

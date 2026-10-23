/**
 * CHỦ ĐỀ 4 MÙA cho web (24/10/2026) — lõi THUẦN (không React, không DOM) ⇒ test được bằng node:test,
 * và sinh luôn đoạn script chống nháy nối vào THEME_BOOT_SCRIPT trong `app/layout.tsx`.
 *
 * Chép tinh thần + bảng màu của app iOS (`CuongThaiApp/Shared/ChuDe/ChuDeMua.swift`, nhánh ios-gop 459b974):
 *   · 6 lựa chọn: Mặc định (giao diện web như cũ, KHÔNG gắn gì) · Tự động theo mùa · Xuân · Hạ · Thu · Đông;
 *   · mùa áp lên `<html data-mua="xuan|ha|thu|dong">` — TÁCH khỏi class sáng/tối (`light` / `theme-dark`),
 *     nên chồng lên được cả hai; bảng màu nằm ở `app/chu-de-mua.css`;
 *   · màn tập trung ⇒ `data-mua-yen` (giữ màu, KHÔNG hạt/trang trí); màn TẮT (Notes — có 3 theme riêng) ⇒ không gắn
 *     `data-mua` luôn.
 *
 * Mặc định = 'macDinh' (KHÁC iOS, nơi mặc định là Tự động): web hiện tại phải giữ nguyên với người chưa chọn gì.
 *
 * Chạy test từ gốc repo: npx tsx --test frontend/src/lib/chuDeMua/logic.test.ts
 */

export type Mua = 'xuan' | 'ha' | 'thu' | 'dong';
export type ChuDe = 'macDinh' | 'tuDong' | Mua;

export const CAC_MUA: readonly Mua[] = ['xuan', 'ha', 'thu', 'dong'];
export const CAC_CHU_DE: readonly ChuDe[] = ['macDinh', 'tuDong', 'xuan', 'ha', 'thu', 'dong'];

export const KHOA_CHU_DE = 'chuDeMua';
/** '0' = tắt chuyển động (vẫn vẽ trang trí, đứng yên). Không có / khác '0' = bật. */
export const KHOA_HIEU_UNG = 'chuDeMua.dong';
export const ATTR_MUA = 'data-mua';
export const ATTR_YEN = 'data-mua-yen';

export function parseChuDe(raw: unknown): ChuDe {
  return typeof raw === 'string' && (CAC_CHU_DE as readonly string[]).includes(raw) ? (raw as ChuDe) : 'macDinh';
}

/** ⭐ MỘT chỗ quyết tháng nào là mùa nào (theo cảm giác ở Việt Nam) — giống hệt `Mua.theoThang` bên iOS:
 *  Xuân 1–3 (Tết) · Hạ 4–7 · Thu 8–10 · Đông 11–12 (Noel). Đổi ở đây thì đổi cả script chống nháy bên dưới. */
export function muaTheoThang(thang: number): Mua {
  if (thang <= 3) return 'xuan';
  if (thang <= 7) return 'ha';
  if (thang <= 10) return 'thu';
  return 'dong';
}

/** Mùa ĐANG vẽ của một lựa chọn. `null` = Mặc định (không gắn gì). */
export function giaiMua(chuDe: ChuDe, ngay: Date = new Date()): Mua | null {
  if (chuDe === 'macDinh') return null;
  if (chuDe === 'tuDong') return muaTheoThang(ngay.getMonth() + 1);
  return chuDe;
}

// ── Màn tập trung / màn tắt — MỘT danh sách duy nhất ─────────────────────────────────────────────
// Mỗi mục là một tiền tố đường dẫn theo ĐOẠN (segment); `*` khớp đúng một đoạn bất kỳ.
// '/books/*' khớp /books/abc và /books/abc/x, KHÔNG khớp /books (trang thư viện vẫn có hạt).

/** Không gắn chủ đề mùa chút nào — trang có hệ theme riêng. */
export const MAN_TAT: readonly string[] = [
  '/notes', // Notes: 3 theme riêng (light/dark/brown) qua `.notes-theme-root`
];

/** Giữ MÀU mùa nhưng không hạt, không trang trí, không nền loang (giống `.nenMuaYen()` bên iOS). */
export const MAN_YEN: readonly string[] = [
  '/exam',                         // phòng thi, làm bài
  '/books/*',                      // trình đọc sách
  '/courses/*/learn',              // bài học khoá
  '/academy/courses/*/learn',      // bài học Academy
  '/language/*/ielts',             // sách IELTS
  '/language/*/dekiru',            // sách Dekiru
  '/language/*/jp/bai',
  '/language/*/ch/bai',
  '/language/*/reading',
  '/ielts',
  '/jp',
  '/ch',
  '/vo',                           // Vở viết tay (xem)
  '/work',                         // CT Work
  '/playground',                   // sân chơi 3D
  '/phong-video',                  // học video
  '/nhung-video',
  '/feed/video',
  '/simulation',
  '/code-lab',
  '/interview',
];

export function khopTienTo(pathname: string, ds: readonly string[]): boolean {
  const s = pathname.split('/');
  for (const muc of ds) {
    const e = muc.split('/');
    if (e.length > s.length) continue;
    let ok = true;
    for (let j = 1; j < e.length; j++) {
      if (e[j] !== '*' && e[j] !== s[j]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

export interface TrangThaiDom { mua: Mua | null; yen: boolean }

/** Thứ cần gắn lên `<html>` cho (lựa chọn, đường dẫn, ngày). */
export function trangThaiDom(chuDe: ChuDe, pathname: string, ngay: Date = new Date()): TrangThaiDom {
  const mua = giaiMua(chuDe, ngay);
  if (!mua || khopTienTo(pathname, MAN_TAT)) return { mua: null, yen: false };
  return { mua, yen: khopTienTo(pathname, MAN_YEN) };
}

/**
 * Script chống nháy — NỐI SAU THEME_BOOT_SCRIPT trong cùng thẻ <script> (layout.tsx), chạy trước lần vẽ đầu.
 * Tự đủ (không import), lặp lại đúng luật parseChuDe / muaTheoThang / khopTienTo ở trên; logic.test.ts chạy chính
 * chuỗi này trên DOM giả để hai bên không trôi nhau. Lựa chọn Mặc định ⇒ không đụng gì vào DOM.
 */
export const CHU_DE_MUA_BOOT_SCRIPT =
  "try{var c=localStorage.getItem('" + KHOA_CHU_DE + "'),m=null;" +
  "if(c==='tuDong'){var th=new Date().getMonth()+1;m=th<=3?'xuan':th<=7?'ha':th<=10?'thu':'dong'}" +
  "else if(c==='xuan'||c==='ha'||c==='thu'||c==='dong')m=c;" +
  "if(m){var k=function(p,l){var s=p.split('/');for(var i=0;i<l.length;i++){var e=l[i].split('/'),o=e.length<=s.length;" +
  "for(var j=1;o&&j<e.length;j++)if(e[j]!=='*'&&e[j]!==s[j])o=false;if(o)return true}return false};" +
  "var pa=location.pathname;if(!k(pa," + JSON.stringify(MAN_TAT) + ")){var d=document.documentElement;" +
  "d.setAttribute('" + ATTR_MUA + "',m);if(k(pa," + JSON.stringify(MAN_YEN) + "))d.setAttribute('" + ATTR_YEN + "','')}}" +
  "}catch(e){}";

// ── Ngày lễ: lời chào / đếm ngược Noel–Tết (giống `NgayLe` bên iOS) ─────────────────────────────

/** Mùng 1 Tết âm lịch theo giờ Việt Nam (bảng tay — lịch âm VN có năm lệch lịch Trung Quốc). [tháng, ngày] */
export const MUNG_MOT_TET: Record<number, [number, number]> = {
  2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13], 2030: [2, 3],
  2031: [1, 23], 2032: [2, 11], 2033: [1, 31], 2034: [2, 19], 2035: [2, 8],
  2036: [1, 28], 2037: [2, 15], 2038: [2, 4], 2039: [1, 24], 2040: [2, 12],
};

export function tet(nam: number): Date | null {
  const d = MUNG_MOT_TET[nam];
  return d ? new Date(nam, d[0] - 1, d[1]) : null;
}

export function canChi(nam: number): string {
  const can = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  const chi = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
  return `${can[((nam % 10) + 10) % 10]} ${chi[((nam % 12) + 12) % 12]}`;
}

export type BieuTuongLoi = 'gift' | 'sparkles' | 'snowflake' | 'flower' | 'sun' | 'leaf';

/** Một dòng chào theo mùa. `null` = không nói gì (Mặc định). */
export function loiMua(mua: Mua | null, bayGio: Date = new Date()): { bieuTuong: BieuTuongLoi; chu: string } | null {
  if (!mua) return null;
  const homNay = new Date(bayGio.getFullYear(), bayGio.getMonth(), bayGio.getDate());
  const nam = bayGio.getFullYear();
  const soNgay = (toi: Date) => Math.round((new Date(toi.getFullYear(), toi.getMonth(), toi.getDate()).getTime() - homNay.getTime()) / 86_400_000);

  let tetToi: [Date, number] | null = null;
  const t0 = tet(nam);
  if (t0 && soNgay(t0) >= 0) tetToi = [t0, nam];
  else { const t1 = tet(nam + 1); if (t1) tetToi = [t1, nam + 1]; }

  switch (mua) {
    case 'dong': {
      const n = soNgay(new Date(nam, 11, 25));
      if (n > 0) return { bieuTuong: 'gift', chu: `Còn ${n} ngày nữa là Giáng sinh` };
      if (n === 0) return { bieuTuong: 'gift', chu: 'Giáng sinh an lành!' };
      if (tetToi) return { bieuTuong: 'sparkles', chu: `Còn ${soNgay(tetToi[0])} ngày nữa là Tết ${canChi(tetToi[1])}` };
      return { bieuTuong: 'snowflake', chu: 'Mùa đông ấm áp nhé' };
    }
    case 'xuan': {
      if (tetToi) {
        const n = soNgay(tetToi[0]);
        if (n === 0) return { bieuTuong: 'sparkles', chu: `Chúc mừng năm mới ${canChi(tetToi[1])}!` };
        if (n <= 60) return { bieuTuong: 'sparkles', chu: `Còn ${n} ngày nữa là Tết ${canChi(tetToi[1])}` };
      }
      if (t0 && soNgay(t0) < 0 && soNgay(t0) > -15) return { bieuTuong: 'sparkles', chu: `Xuân ${canChi(nam)} — học hành tấn tới!` };
      return { bieuTuong: 'flower', chu: 'Xuân về — một ngày học thật tươi' };
    }
    case 'ha':
      return { bieuTuong: 'sun', chu: 'Mùa hè rực rỡ — giữ nhịp học nhé' };
    case 'thu':
      return { bieuTuong: 'leaf', chu: 'Thu sang, lá rơi — học thôi' };
  }
}

export const TEN_CHU_DE: Record<ChuDe, { ten: string; moTa: string }> = {
  macDinh: { ten: 'Mặc định', moTa: 'Giao diện CuongThai như hiện nay' },
  tuDong: { ten: 'Tự động theo mùa', moTa: 'Đổi theo tháng ở Việt Nam' },
  xuan: { ten: 'Xuân · Tết', moTa: 'Hoa đào, hoa mai, đèn lồng, pháo hoa' },
  ha: { ten: 'Hạ · Biển', moTa: 'Nắng, sóng biển, mây trôi, hải âu' },
  thu: { ten: 'Thu · Lá rơi', moTa: 'Lá phong, hoa anh đào, trăng rằm' },
  dong: { ten: 'Đông · Noel', moTa: 'Tuyết rơi, cây thông, chim cánh cụt' },
};

export const TEN_MUA: Record<Mua, string> = { xuan: 'Xuân', ha: 'Hạ', thu: 'Thu', dong: 'Đông' };

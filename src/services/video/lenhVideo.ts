/**
 * "LỆNH & CODE TRONG VIDEO" — phần THUẦN (không chạm CSDL), để test được. (20/11/2026)
 *
 * Người dùng: "những lệnh terminal hay code nào đã được gõ trên terminal của video, ghi rõ ở dưới phần bài giảng một
 * mục để mình ấn xem, biết lệnh đấy đang làm gì, kèm comment — nhìn video mình chả hiểu gì".
 *
 * Đường dữ liệu (cùng đường với phụ đề video riêng):
 *   video-bai-giang/xuat/trich-lenh.mts  — dựng lại từng cảnh, nhặt dòng chữ đơn cách trong khung terminal/editor ⇒
 *                                          `lenh.json` cạnh video (mốc theo VIDEO ĐÃ RENDER)
 *   scripts/lenh-video.mjs               — ánh xạ video → bài (r2Url ↔ content/course-videos), LLM giải thích ⇒
 *                                          content/lesson-commands/<khoá>.json
 *   scripts/lenh-video-seed.mjs          — nạp vào `lesson_video_commands` mỗi deploy (URL lệch ⇒ bỏ)
 *   GET /video-hoc/lenh/:lessonId        — trang học đọc (URL lệch video đang gắn ⇒ rỗng)
 */

export type LoaiLenh = 'lenh' | 'ma';

/** Một phần của lệnh (tên lệnh, cờ, tham số) và nghĩa — `phan` LUÔN là chuỗi con nguyên văn của lệnh. */
export type PhanLenh = { phan: string; nghia: string };
/** Chú thích MỘT dòng của khối code (số dòng tính từ 1). */
export type ChuDong = { so: number; giai: string };

export type MucLenhVideo = {
  /** giây trong video */
  t: number;
  loai: LoaiLenh;
  /** tên cảnh (phần) của video — để người xem biết lệnh nằm ở đoạn nào */
  canh?: string;
  /* terminal */
  lenh?: string;
  nhac?: string;
  /** vài dòng output THẬT hiện trên video ngay sau lệnh */
  ra?: string[];
  /* code */
  ma?: string;
  tep?: string;
  ngon?: string;
  /** dòng đã sửa tại chỗ trong video (trước → sau) */
  sua?: { truoc: string; sau: string }[];
  /* giải thích (LLM, lúc soạn) */
  giai: string;
  chiTiet?: PhanLenh[];
  ketQua?: string;
  ghiChu?: string;
  dong?: ChuDong[];
};

const chuoi = (v: unknown, max: number): string | undefined => {
  if (typeof v !== 'string') return undefined;
  const s = v.replace(/\r/g, '').trimEnd();
  return s ? s.slice(0, max) : undefined;
};

/**
 * Đọc mảng `items` (JSON từ CSDL/tệp) ⇒ mục hợp lệ, sắp theo mốc. Phần tử hỏng thì BỎ, không ném.
 * Chặn luôn hai thứ mà model có thể bịa: `chiTiet.phan` không có trong lệnh, `dong.so` ngoài khối code.
 */
export function docMucLenh(raw: unknown): MucLenhVideo[] {
  if (!Array.isArray(raw)) return [];
  const ra: MucLenhVideo[] = [];
  for (const x of raw.slice(0, 400)) {
    if (!x || typeof x !== 'object') continue;
    const o = x as Record<string, unknown>;
    const t = Number(o.t);
    const loai = o.loai === 'ma' ? 'ma' : o.loai === 'lenh' ? 'lenh' : null;
    const giai = chuoi(o.giai, 1200);
    if (!Number.isFinite(t) || t < 0 || !loai || !giai) continue;
    const m: MucLenhVideo = { t: Math.round(t * 10) / 10, loai, giai };
    const canh = chuoi(o.canh, 160); if (canh) m.canh = canh;
    if (loai === 'lenh') {
      const lenh = chuoi(o.lenh, 2000);
      if (!lenh) continue;
      m.lenh = lenh;
      const nhac = chuoi(o.nhac, 80); if (nhac) m.nhac = nhac;
      if (Array.isArray(o.ra)) {
        const dong = o.ra.filter((d): d is string => typeof d === 'string').slice(0, 12).map((d) => d.slice(0, 300));
        if (dong.length) m.ra = dong;
      }
      if (Array.isArray(o.chiTiet)) {
        const ct = o.chiTiet
          .map((p) => (p && typeof p === 'object' ? { phan: chuoi((p as PhanLenh).phan, 200), nghia: chuoi((p as PhanLenh).nghia, 600) } : null))
          .filter((p): p is PhanLenh => !!p?.phan && !!p.nghia && lenh.includes(p.phan))
          .slice(0, 16);
        if (ct.length) m.chiTiet = ct;
      }
    } else {
      const ma = chuoi(o.ma, 12000);
      if (!ma) continue;
      m.ma = ma;
      const tep = chuoi(o.tep, 120); if (tep) m.tep = tep;
      const ngon = chuoi(o.ngon, 24); if (ngon) m.ngon = ngon;
      const soDong = ma.split('\n').length;
      if (Array.isArray(o.dong)) {
        const dd = o.dong
          .map((d) => (d && typeof d === 'object' ? { so: Math.trunc(Number((d as ChuDong).so)), giai: chuoi((d as ChuDong).giai, 400) } : null))
          .filter((d): d is ChuDong => !!d && Number.isFinite(d.so) && d.so >= 1 && d.so <= soDong && !!d.giai)
          .slice(0, 60);
        if (dd.length) m.dong = dd;
      }
      if (Array.isArray(o.sua)) {
        const s = o.sua
          .map((z) => (z && typeof z === 'object' ? { truoc: chuoi((z as { truoc: string }).truoc, 400) ?? '', sau: chuoi((z as { sau: string }).sau, 400) ?? '' } : null))
          .filter((z): z is { truoc: string; sau: string } => !!z && (z.truoc !== z.sau))
          .slice(0, 6);
        if (s.length) m.sua = s;
      }
    }
    const ketQua = chuoi(o.ketQua, 800); if (ketQua) m.ketQua = ketQua;
    const ghiChu = chuoi(o.ghiChu, 800); if (ghiChu) m.ghiChu = ghiChu;
    ra.push(m);
  }
  return ra.sort((a, b) => a.t - b.t);
}

/**
 * Thống kê doanh thu cho trang quản trị.
 * ─────────────────────────────────────────────────────────────────────────
 * Gộp bốn nguồn tiền của web về một bảng điều khiển:
 *   shop (ShopOrder) · khoá học (CourseOrder) · gói Pro (ProOrder) · nạp ví (TopupOrder)
 *
 * ⚠️ HAI LẦN ĐẾM — đọc kỹ trước khi cộng các con số lại với nhau:
 *
 * Tiền vào web đúng MỘT lần, ở lúc NẠP VÍ hoặc lúc trả thẳng qua cổng.
 * Một đơn Pro trả bằng ĐIỂM thì KHÔNG mang thêm đồng nào vào — tiền đó đã
 * vào từ lúc nạp. Cộng "doanh thu nạp ví" với "doanh thu gói Pro" là đếm
 * cùng một đồng hai lần.
 *
 * Nên ở đây tách bạch:
 *   `tienThat`  — tiền mặt thực nhận: mọi đơn KHÔNG trả bằng điểm.
 *   `tieuDiem`  — giá trị hàng đã giao mà người mua trả bằng điểm.
 *   `tongGiaTri`— tienThat + tieuDiem, tức tổng giá trị hàng đã bán.
 * Chỉ `tienThat` mới là dòng tiền. UI phải nói rõ điều này.
 */
import { prisma } from '../config/database.js';

export interface KhoangThoiGian {
  tuNgay: Date;
  denNgay: Date;
}

/** Mặc định 30 ngày gần nhất, tính theo mốc 00:00 giờ địa phương của VPS. */
export function khoangMacDinh(soNgay = 30): KhoangThoiGian {
  const denNgay = new Date();
  const tuNgay = new Date(denNgay.getTime() - soNgay * 24 * 60 * 60 * 1000);
  tuNgay.setHours(0, 0, 0, 0);
  return { tuNgay, denNgay };
}

function ngayISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Doanh thu theo NGÀY.
 *
 * Gom trong JS chứ không bằng `date_trunc` trong SQL: container chạy UTC còn
 * người đọc báo cáo ở GMT+7 (xem [[feedback_container_utc_host_local]]), nên
 * `date_trunc('day', ...)` phía DB sẽ cắt ngày lệch 7 tiếng — doanh thu buổi
 * tối bị đẩy sang hôm sau. Tự gom thì dùng đúng một quy ước và nói rõ nó.
 */
export async function doanhThuTheoNgay(k: KhoangThoiGian) {
  const trongKhoang = { gte: k.tuNgay, lte: k.denNgay };

  const [shop, course, pro, topup] = await Promise.all([
    prisma.shopOrder.findMany({
      where: { status: 'PAID', paidAt: trongKhoang },
      select: { paidAt: true, total: true, pointsUsed: true },
    }),
    prisma.courseOrder.findMany({
      where: { status: 'PAID', updatedAt: trongKhoang },
      select: { updatedAt: true, amount: true },
    }),
    prisma.proOrder.findMany({
      where: { status: 'PAID', paidAt: trongKhoang },
      select: { paidAt: true, amountVnd: true, pointsUsed: true },
    }),
    prisma.topupOrder.findMany({
      where: { status: 'PAID', paidAt: trongKhoang },
      select: { paidAt: true, amountVnd: true },
    }),
  ]);

  type O = { tienThat: number; tieuDiem: number; shop: number; course: number; pro: number; topup: number; soDon: number };
  const theoNgay = new Map<string, O>();
  const lay = (d: Date | null): O => {
    const key = ngayISO(d ?? new Date());
    let o = theoNgay.get(key);
    if (!o) { o = { tienThat: 0, tieuDiem: 0, shop: 0, course: 0, pro: 0, topup: 0, soDon: 0 }; theoNgay.set(key, o); }
    return o;
  };

  for (const r of shop) {
    const o = lay(r.paidAt);
    const tong = Math.round(Number(r.total));
    const diem = r.pointsUsed || 0;
    o.shop += tong; o.soDon++;
    o.tieuDiem += Math.min(diem, tong);
    o.tienThat += Math.max(0, tong - diem);
  }
  for (const r of course) {
    const o = lay(r.updatedAt);
    const tong = Math.round(Number(r.amount));
    o.course += tong; o.tienThat += tong; o.soDon++;
  }
  for (const r of pro) {
    const o = lay(r.paidAt);
    o.pro += r.amountVnd; o.soDon++;
    if (r.pointsUsed > 0) o.tieuDiem += r.amountVnd; else o.tienThat += r.amountVnd;
  }
  // Nạp ví: ghi riêng, KHÔNG cộng vào tienThat ở đây để tránh đếm hai lần
  // với các đơn trả bằng điểm. Xem chú thích đầu file.
  for (const r of topup) {
    const o = lay(r.paidAt);
    o.topup += r.amountVnd;
  }

  // Bơm đủ mọi ngày trong khoảng, kể cả ngày không bán được gì — biểu đồ
  // thiếu ngày sẽ vẽ đường nối tắt và nhìn như doanh thu đều đặn.
  const ra: Array<{ ngay: string } & O> = [];
  for (let d = new Date(k.tuNgay); d <= k.denNgay; d.setDate(d.getDate() + 1)) {
    const key = ngayISO(d);
    ra.push({ ngay: key, ...(theoNgay.get(key) ?? { tienThat: 0, tieuDiem: 0, shop: 0, course: 0, pro: 0, topup: 0, soDon: 0 }) });
  }
  return ra;
}

/** Sản phẩm bán chạy trong khoảng, theo doanh thu. */
export async function sanPhamBanChay(k: KhoangThoiGian, limit = 10) {
  const items = await prisma.shopOrderItem.findMany({
    where: { order: { status: 'PAID', paidAt: { gte: k.tuNgay, lte: k.denNgay } } },
    select: { productName: true, productSlug: true, productImage: true, quantity: true, total: true },
  });
  const gom = new Map<string, { name: string; slug: string | null; image: string | null; soLuong: number; doanhThu: number }>();
  for (const it of items) {
    const cur = gom.get(it.productName) ?? {
      name: it.productName, slug: it.productSlug, image: it.productImage, soLuong: 0, doanhThu: 0,
    };
    cur.soLuong += it.quantity;
    cur.doanhThu += Math.round(Number(it.total));
    gom.set(it.productName, cur);
  }
  return [...gom.values()].sort((a, b) => b.doanhThu - a.doanhThu).slice(0, limit);
}

/**
 * Tỉ lệ BỎ GIỎ Ở BƯỚC THANH TOÁN.
 *
 * ⚠️ Đây KHÔNG phải "tỉ lệ bỏ giỏ hàng" theo nghĩa thương mại điện tử thông
 * thường (thêm vào giỏ rồi không checkout) — giỏ hàng nằm hoàn toàn ở trình
 * duyệt, backend không nhìn thấy. Con số ở đây đo bước SAU đó: đã bấm đặt
 * đơn (sinh ra một ShopOrder) nhưng không trả tiền.
 *
 * Đặt tên đúng vì một chỉ số bị hiểu nhầm còn tệ hơn không có chỉ số.
 */
export async function tiLeBoThanhToan(k: KhoangThoiGian) {
  const trongKhoang = { gte: k.tuNgay, lte: k.denNgay };
  const [tongDon, daTra, dangCho, huy] = await Promise.all([
    prisma.shopOrder.count({ where: { createdAt: trongKhoang } }),
    prisma.shopOrder.count({ where: { createdAt: trongKhoang, status: 'PAID' } }),
    prisma.shopOrder.count({ where: { createdAt: trongKhoang, status: 'PENDING' } }),
    prisma.shopOrder.count({ where: { createdAt: trongKhoang, status: { in: ['CANCELLED', 'FAILED'] } } }),
  ]);
  return {
    tongDon,
    daTra,
    dangCho,
    huy,
    tiLeHoanTat: tongDon > 0 ? Math.round((daTra / tongDon) * 1000) / 10 : 0,
    tiLeBo: tongDon > 0 ? Math.round(((tongDon - daTra) / tongDon) * 1000) / 10 : 0,
  };
}

/** Các con số tóm tắt ở đầu trang. */
export async function tomTat() {
  const now = new Date();
  const homNay = new Date(now); homNay.setHours(0, 0, 0, 0);
  const bay = new Date(now.getTime() - 7 * 86400_000);
  const bamuoi = new Date(now.getTime() - 30 * 86400_000);

  const tienTrongKhoang = async (tu: Date) => {
    const [shop, course, pro] = await Promise.all([
      prisma.shopOrder.findMany({ where: { status: 'PAID', paidAt: { gte: tu } }, select: { total: true, pointsUsed: true } }),
      prisma.courseOrder.aggregate({ where: { status: 'PAID', updatedAt: { gte: tu } }, _sum: { amount: true } }),
      prisma.proOrder.findMany({ where: { status: 'PAID', paidAt: { gte: tu } }, select: { amountVnd: true, pointsUsed: true } }),
    ]);
    let tienThat = 0; let tongGiaTri = 0;
    for (const r of shop) {
      const t = Math.round(Number(r.total));
      tongGiaTri += t;
      tienThat += Math.max(0, t - (r.pointsUsed || 0));
    }
    const kh = Math.round(Number(course._sum.amount ?? 0));
    tongGiaTri += kh; tienThat += kh;
    for (const r of pro) {
      tongGiaTri += r.amountVnd;
      if (r.pointsUsed === 0) tienThat += r.amountVnd;
    }
    return { tienThat, tongGiaTri };
  };

  const [hn, b7, b30, napB30, viTong, donCho, ckCho, keyCho] = await Promise.all([
    tienTrongKhoang(homNay),
    tienTrongKhoang(bay),
    tienTrongKhoang(bamuoi),
    prisma.topupOrder.aggregate({ where: { status: 'PAID', paidAt: { gte: bamuoi } }, _sum: { amountVnd: true } }),
    prisma.pointAccount.aggregate({ _sum: { balance: true } }),
    prisma.shopOrder.count({ where: { status: 'PENDING' } }),
    prisma.bankTransfer.count({ where: { status: 'AWAITING' } }),
    prisma.keyReplacementRequest.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    homNay: hn,
    bayNgay: b7,
    baMuoiNgay: b30,
    napViBaMuoiNgay: napB30._sum.amountVnd ?? 0,
    /** Tổng điểm chưa tiêu trong mọi ví — đây là NỢ của web với người dùng. */
    diemDangLuuHanh: viTong._sum.balance ?? 0,
    canXuLy: { donChoThanhToan: donCho, chuyenKhoanChoDuyet: ckCho, yeuCauDoiKey: keyCho },
  };
}

/** Gộp tất cả cho một lần gọi từ trang quản trị. */
export async function bangDieuKhien(soNgay = 30) {
  const k = khoangMacDinh(soNgay);
  const [theoNgay, banChay, boGio, tt] = await Promise.all([
    doanhThuTheoNgay(k),
    sanPhamBanChay(k),
    tiLeBoThanhToan(k),
    tomTat(),
  ]);
  return {
    khoang: { tuNgay: ngayISO(k.tuNgay), denNgay: ngayISO(k.denNgay), soNgay },
    tomTat: tt,
    theoNgay,
    sanPhamBanChay: banChay,
    thanhToan: boGio,
  };
}

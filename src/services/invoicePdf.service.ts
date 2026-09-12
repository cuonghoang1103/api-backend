/**
 * Hoá đơn PDF cho đơn hàng shop.
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠️ PHẢI nhúng font có dấu. pdfkit mặc định dùng Helvetica — không có glyph
 * tiếng Việt, nên chữ có dấu ra Ô VUÔNG mà KHÔNG báo lỗi gì cả. Dùng lại
 * đúng Noto Sans (bản OFL) mà CV Builder và xuất ghi chú đang dùng.
 *
 * ⚠️ KHÔNG in nội dung số (key / tài khoản / mật khẩu) lên hoá đơn. Hoá đơn
 * là thứ người mua chuyển tiếp cho kế toán, gửi vào nhóm chat, lưu trên máy
 * dùng chung. Key nằm ở trang "Đơn của tôi", nơi phải đăng nhập mới xem được.
 */
import { Buffer } from 'node:buffer';
import { notoSansViBuffer, notoSansViBoldBuffer } from './cv/export/font.js';

/** Tên cửa hàng in trên hoá đơn — đổi bằng env, không sửa mã. */
const TEN_SHOP = process.env.INVOICE_SHOP_NAME || 'CuongThai';
const WEB_SHOP = process.env.INVOICE_SHOP_SITE || 'cuongthai.com';

export interface DonHoaDon {
  orderCode: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  buyerAddress: string | null;
  subtotal: unknown;
  discountAmount: unknown;
  discountCode: string | null;
  shippingFee: unknown;
  total: unknown;
  pointsUsed: number;
  paymentMethod: string;
  paidAt: Date | null;
  createdAt: Date;
  items: Array<{ productName: string; quantity: number; price: unknown; total: unknown }>;
}

const tien = (v: unknown): string => `${Math.round(Number(v ?? 0)).toLocaleString('vi-VN')} d`;

/** Giờ địa phương GMT+7 — container chạy UTC nên phải đổi tay. */
function gioVN(d: Date): string {
  return new Date(d.getTime() + 7 * 3600_000).toISOString().replace('T', ' ').slice(0, 16);
}

function tenCachTra(m: string): string {
  return (
    { PAYOS: 'PayOS', BANK_TRANSFER: 'Chuyển khoản ngân hàng', POINTS: 'Ví điểm', VNPAY: 'VNPay', SIMULATED: 'Thử nghiệm' }[m] ??
    m
  );
}

export async function taoHoaDonPdf(order: DonHoaDon): Promise<Buffer> {
  const { default: PDFDocument } = await import('pdfkit');
  const doc = new PDFDocument({ size: 'A4', margins: { top: 48, bottom: 48, left: 48, right: 48 } });

  // Đăng ký font TRƯỚC khi viết chữ đầu tiên.
  doc.registerFont('vi', notoSansViBuffer());
  doc.registerFont('vi-dam', notoSansViBoldBuffer());

  const manh: Buffer[] = [];
  doc.on('data', (c: Buffer) => manh.push(c));
  const xong = new Promise<Buffer>((giai) => doc.on('end', () => giai(Buffer.concat(manh))));

  const L = 48;
  const R = doc.page.width - 48;
  const rong = R - L;

  // ── Đầu trang ──
  doc.font('vi-dam').fontSize(22).fillColor('#111111').text('HOÁ ĐƠN', L, 48);
  doc.font('vi').fontSize(10).fillColor('#666666').text(`${TEN_SHOP} · ${WEB_SHOP}`, L, doc.y + 2);

  doc.font('vi-dam').fontSize(11).fillColor('#111111').text(`#${order.orderCode}`, L, 52, { width: rong, align: 'right' });
  doc.font('vi').fontSize(9).fillColor('#666666')
    .text(`Ngày đặt: ${gioVN(order.createdAt)}`, L, doc.y + 2, { width: rong, align: 'right' });
  if (order.paidAt) {
    doc.text(`Ngày thanh toán: ${gioVN(order.paidAt)}`, L, doc.y + 1, { width: rong, align: 'right' });
  }

  doc.moveTo(L, 110).lineTo(R, 110).lineWidth(1).strokeColor('#e5e5e5').stroke();

  // ── Người mua ──
  let y = 126;
  doc.font('vi-dam').fontSize(10).fillColor('#111111').text('KHÁCH HÀNG', L, y);
  y = doc.y + 4;
  doc.font('vi').fontSize(10).fillColor('#333333');
  doc.text(order.buyerName, L, y);
  doc.text(order.buyerEmail, L, doc.y + 1);
  if (order.buyerPhone) doc.text(order.buyerPhone, L, doc.y + 1);
  if (order.buyerAddress) doc.text(order.buyerAddress, L, doc.y + 1, { width: rong * 0.6 });

  // ── Bảng hàng ──
  y = doc.y + 20;
  const cSl = R - 210;
  const cGia = R - 150;
  const cTong = R - 70;

  doc.font('vi-dam').fontSize(9).fillColor('#666666');
  doc.text('SẢN PHẨM', L, y);
  doc.text('SL', cSl, y, { width: 30, align: 'right' });
  doc.text('ĐƠN GIÁ', cGia, y, { width: 70, align: 'right' });
  doc.text('THÀNH TIỀN', cTong, y, { width: 70, align: 'right' });
  y = doc.y + 4;
  doc.moveTo(L, y).lineTo(R, y).strokeColor('#e5e5e5').stroke();
  y += 8;

  doc.font('vi').fontSize(10).fillColor('#222222');
  for (const it of order.items) {
    // Sang trang khi chạm đáy — không có bước này thì đơn nhiều dòng bị cắt
    // mất phần cuối và tổng tiền biến mất khỏi hoá đơn.
    if (y > doc.page.height - 160) {
      doc.addPage();
      y = 60;
    }
    const cao = doc.heightOfString(it.productName, { width: cSl - L - 12 });
    doc.text(it.productName, L, y, { width: cSl - L - 12 });
    doc.text(String(it.quantity), cSl, y, { width: 30, align: 'right' });
    doc.text(tien(it.price), cGia, y, { width: 70, align: 'right' });
    doc.text(tien(it.total), cTong, y, { width: 70, align: 'right' });
    y += Math.max(cao, 12) + 8;
  }

  doc.moveTo(L, y).lineTo(R, y).strokeColor('#e5e5e5').stroke();
  y += 10;

  // ── Tổng kết ──
  const dong = (nhan: string, gt: string, dam = false) => {
    doc.font(dam ? 'vi-dam' : 'vi').fontSize(dam ? 12 : 10).fillColor(dam ? '#111111' : '#444444');
    doc.text(nhan, cGia - 90, y, { width: 160, align: 'right' });
    doc.text(gt, cTong, y, { width: 70, align: 'right' });
    y += dam ? 20 : 16;
  };

  dong('Tạm tính', tien(order.subtotal));
  if (Number(order.discountAmount) > 0) {
    dong(order.discountCode ? `Giảm giá (${order.discountCode})` : 'Giảm giá', `-${tien(order.discountAmount)}`);
  }
  if (Number(order.shippingFee) > 0) dong('Phí vận chuyển', tien(order.shippingFee));
  dong('TỔNG CỘNG', tien(order.total), true);

  doc.font('vi').fontSize(9).fillColor('#666666');
  doc.text(`Hình thức thanh toán: ${tenCachTra(order.paymentMethod)}`, L, y + 4, { width: rong, align: 'right' });
  if (order.pointsUsed > 0) {
    doc.text(`Đã dùng ${order.pointsUsed.toLocaleString('vi-VN')} điểm từ ví`, L, doc.y + 1, { width: rong, align: 'right' });
  }

  // ── Chân trang ──
  doc.font('vi').fontSize(8).fillColor('#999999');
  doc.text(
    'Hoá đơn này được tạo tự động, có giá trị xác nhận giao dịch. ' +
      'Thông tin sản phẩm số (tài khoản / mã kích hoạt) không in trên hoá đơn — ' +
      `xem tại ${WEB_SHOP}/my-orders sau khi đăng nhập.`,
    L,
    doc.page.height - 92,
    { width: rong, align: 'center' },
  );

  doc.end();
  return xong;
}

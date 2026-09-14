/**
 * Chuyển khoản ngân hàng + đối soát tay — cổng thanh toán DỰ PHÒNG.
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao cần: PayOS là cổng duy nhất của web. Cổng chết (hết hạn merchant,
 * sự cố phía họ, hết tiền tài khoản) là mọi đơn đứng lại và mất doanh thu
 * cho tới khi có người phát hiện. Đường này không phụ thuộc bên thứ ba nào.
 *
 * Cách chạy:
 *  1. Người mua chọn "Chuyển khoản" → ta sinh một `BankTransfer` với
 *     `refCode` DUY NHẤT và trả về chuỗi VietQR.
 *  2. Người mua quét QR (số tiền + nội dung đã điền sẵn) và chuyển.
 *  3. Admin thấy tiền về, bấm "Xác nhận" trong trang quản trị → đơn được
 *     giao đúng bằng cùng một hàm mà PayOS gọi (`markShopOrderPaidAndFulfill`,
 *     `capNhatDonTopupDaTra`, …). KHÔNG có đường giao hàng thứ hai.
 *
 * ⚠️ Đối soát là THỦ CÔNG có chủ đích. Tự động đọc biến động số dư cần API
 * ngân hàng (hoặc dịch vụ trung gian đọc SMS) — cả hai đều là rủi ro bảo mật
 * lớn hơn nhiều so với việc admin bấm một nút. Đừng "nâng cấp" chỗ này thành
 * tự động nếu chưa bàn kỹ.
 */
import { nanoid } from 'nanoid';
import { baoAdmin } from './thongBaoAdmin.service.js';
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

export type OrderKind = 'SHOP' | 'COURSE' | 'TOPUP' | 'PRO';

// ───────────────────────── VietQR (EMVCo) ─────────────────────────
//
// Chuỗi QR chuẩn EMVCo, đúng thứ mọi app ngân hàng Việt Nam quét được.
// Ta tự dựng chuỗi thay vì gọi ảnh từ img.vietqr.io vì: (a) không phụ
// thuộc dịch vụ ngoài lúc người dùng đang chờ trả tiền, (b) không gửi số
// tài khoản của chủ web sang bên thứ ba mỗi lần có người mở trang.
// Frontend vẽ mã bằng `qrcode.react` từ chuỗi này.

/** Một cụm TLV: 2 ký tự ID + 2 chữ số độ dài + giá trị. */
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  if (value.length > 99) throw new Error(`VietQR: trường ${id} dài quá 99 ký tự`);
  return `${id}${len}${value}`;
}

/**
 * CRC-16/CCITT-FALSE — poly 0x1021, khởi tạo 0xFFFF, không đảo bit.
 * Tính trên TOÀN BỘ chuỗi KỂ CẢ "6304" ở cuối (đây là chỗ hay sai nhất:
 * bỏ "6304" ra ngoài thì mọi app ngân hàng đều báo "mã không hợp lệ").
 */
function crc16(s: string): string {
  let crc = 0xffff;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Nội dung chuyển khoản chỉ được mang chữ/số không dấu — app ngân hàng
 * cắt hoặc từ chối dấu tiếng Việt.
 */
function bocDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface VietQrInput {
  bankBin: string;
  accountNo: string;
  amountVnd: number;
  noiDung: string;
}

/** Dựng chuỗi VietQR động (có sẵn số tiền + nội dung). */
export function dungChuoiVietQr(input: VietQrInput): string {
  const { bankBin, accountNo, amountVnd } = input;
  if (!/^\d{6}$/.test(bankBin)) throw new BadRequestError('Mã BIN ngân hàng phải là 6 chữ số');
  if (!/^\d{4,19}$/.test(accountNo)) throw new BadRequestError('Số tài khoản không hợp lệ');

  const noiDung = bocDau(input.noiDung).slice(0, 25);

  // 38 — thông tin đơn vị thụ hưởng, lồng ba tầng.
  const benThuHuong = tlv('00', bankBin) + tlv('01', accountNo);
  const merchant =
    tlv('00', 'A000000727') + // GUID của NAPAS
    tlv('01', benThuHuong) +
    tlv('02', 'QRIBFTTA'); // chuyển tới TÀI KHOẢN (không phải số thẻ)

  const phan =
    tlv('00', '01') + // phiên bản payload
    tlv('01', '12') + // 12 = mã DÙNG MỘT LẦN (vì đã gắn số tiền)
    tlv('38', merchant) +
    tlv('53', '704') + // VND
    tlv('54', String(Math.round(amountVnd))) +
    tlv('58', 'VN') +
    tlv('62', tlv('08', noiDung)); // 08 = nội dung chuyển khoản

  const chuaCrc = `${phan}6304`;
  return chuaCrc + crc16(chuaCrc);
}

// ───────────────────────── Cấu hình nhận tiền ─────────────────────────

/** Hàng cấu hình duy nhất (id = 1). Tạo lười nếu chưa có. */
export async function layCauHinh() {
  return prisma.paymentSetting.upsert({
    where: { id: 1 },
    create: { id: 1, bankTransferEnabled: false, transferTtlMinutes: 60 },
    update: {},
  });
}

/** Đã đủ thông tin để nhận chuyển khoản chưa. */
export function daCauHinh(s: {
  bankTransferEnabled: boolean;
  bankBin: string | null;
  bankAccountNo: string | null;
  bankAccountName: string | null;
}): boolean {
  return Boolean(s.bankTransferEnabled && s.bankBin && s.bankAccountNo && s.bankAccountName);
}

/** Dạng công khai cho frontend — KHÔNG kèm ghi chú nội bộ nào. */
export async function layCauHinhCongKhai() {
  const s = await layCauHinh();
  const san = daCauHinh(s);
  return {
    enabled: san,
    bankName: san ? s.bankName : null,
    bankBin: san ? s.bankBin : null,
    accountNo: san ? s.bankAccountNo : null,
    accountName: san ? s.bankAccountName : null,
    ttlMinutes: s.transferTtlMinutes,
    note: san ? s.note : null,
  };
}

// ───────────────────────── Tạo / tra cứu lượt chuyển ─────────────────

/**
 * Mã tham chiếu người mua phải ghi vào nội dung chuyển khoản.
 * Ngắn, không có ký tự dễ nhìn nhầm (0/O, 1/I), và mang tiền tố cho biết
 * loại đơn để admin đọc là hiểu ngay.
 */
function sinhMaThamChieu(kind: OrderKind): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  const tienTo = { SHOP: 'SP', COURSE: 'KH', TOPUP: 'NT', PRO: 'PR' }[kind];
  return `${tienTo}${s}`;
}

export interface TaoChuyenKhoanInput {
  orderKind: OrderKind;
  orderId: number;
  orderCode: string;
  userId?: number | null;
  amountVnd: number;
  buyerNote?: string | null;
}

/**
 * Tạo (hoặc lấy lại) lượt chuyển khoản cho một đơn.
 *
 * Idempotent theo (orderKind, orderId): người mua bấm lại nút "Chuyển
 * khoản" thì vẫn thấy ĐÚNG mã tham chiếu cũ. Sinh mã mới mỗi lần bấm là
 * cách chắc chắn nhất để admin không đối soát nổi — người mua chuyển theo
 * mã nhìn thấy lần đầu, hệ thống lại đang chờ mã lần thứ ba.
 */
export async function taoChuyenKhoan(input: TaoChuyenKhoanInput) {
  const cauHinh = await layCauHinh();
  if (!daCauHinh(cauHinh)) {
    throw new BadRequestError('Chuyển khoản ngân hàng chưa được bật. Vui lòng chọn cách thanh toán khác.');
  }
  if (!(input.amountVnd > 0)) throw new BadRequestError('Số tiền không hợp lệ');

  const dangCho = await prisma.bankTransfer.findFirst({
    where: { orderKind: input.orderKind, orderId: input.orderId, status: 'AWAITING' },
  });

  const row =
    dangCho ??
    (await prisma.bankTransfer.create({
      data: {
        refCode: `${sinhMaThamChieu(input.orderKind)}${nanoid(4).toUpperCase().replace(/[^A-Z0-9]/g, 'X')}`,
        orderKind: input.orderKind,
        orderId: input.orderId,
        orderCode: input.orderCode,
        userId: input.userId ?? null,
        amountVnd: Math.round(input.amountVnd),
        buyerNote: input.buyerNote?.slice(0, 500) ?? null,
        expiresAt: new Date(Date.now() + cauHinh.transferTtlMinutes * 60_000),
      },
    }));

  // Chỉ báo khi VỪA TẠO, không báo lại cho lượt xem lại mã QR — người mua bấm
  // vào trang thanh toán bao nhiêu lần thì `dangCho` cũng trả về cùng một dòng.
  if (!dangCho) {
    void baoAdmin({
      loai: 'CHUYEN_KHOAN_CHO_DUYET',
      mucDo: 'can_xu_ly',
      tieuDe: `Chờ xác nhận chuyển khoản — ${row.refCode}`,
      noiDung: `${row.amountVnd.toLocaleString('vi-VN')}đ · ${input.orderKind} ${input.orderCode ?? ''}`.trim(),
      duongDan: '/admin/commerce?tab=chuyenkhoan',
      userId: input.userId ?? null,
      entityId: row.id,
      khoaChongTrung: `CHUYEN_KHOAN:${row.id}`,
    });
  }

  return {
    refCode: row.refCode,
    amountVnd: row.amountVnd,
    status: row.status,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    bank: {
      name: cauHinh.bankName,
      bin: cauHinh.bankBin,
      accountNo: cauHinh.bankAccountNo,
      accountName: cauHinh.bankAccountName,
    },
    // Nội dung chuyển khoản = ĐÚNG mã tham chiếu, không thêm gì.
    // Thêm chữ vào đây là người mua gõ thiếu và admin dò không ra.
    noiDungChuyenKhoan: row.refCode,
    qrString: dungChuoiVietQr({
      bankBin: cauHinh.bankBin!,
      accountNo: cauHinh.bankAccountNo!,
      amountVnd: row.amountVnd,
      noiDung: row.refCode,
    }),
    note: cauHinh.note,
  };
}

/** Tra một lượt chuyển theo mã tham chiếu. */
export async function layTheoMa(refCode: string) {
  const row = await prisma.bankTransfer.findUnique({ where: { refCode: refCode.trim().toUpperCase() } });
  if (!row) throw new NotFoundError('Không tìm thấy lượt chuyển khoản này');
  return row;
}

/**
 * Đánh dấu hết hạn những lượt quá TTL mà chưa ai chuyển. Gọi định kỳ.
 * Chỉ đụng tới AWAITING — đã CONFIRMED thì tiền đã về, không hết hạn được.
 */
export async function hetHanLuotCu(): Promise<number> {
  const r = await prisma.bankTransfer.updateMany({
    where: { status: 'AWAITING', expiresAt: { lt: new Date() } },
    data: { status: 'EXPIRED' },
  });
  return r.count;
}

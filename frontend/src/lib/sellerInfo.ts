/**
 * Seller identity (Part 1 — MOIT / online.gov.vn declaration).
 *
 * Single source of truth for the publicly-visible seller info shown in the
 * footer and on every policy page. Fields wrapped in [square brackets] are
 * PLACEHOLDERS — replace them with the real legal details before submitting
 * the online.gov.vn declaration (an individual seller must publish at least a
 * real name + contact address; a registered business must also publish its
 * tax / business-registration number).
 */
export const SELLER_INFO = {
  brand: 'CuongThai',
  // Legal name of the seller (individual full name OR business name).
  legalName: 'Hoàng Nghĩa Cường',
  // 'Cá nhân' | 'Hộ kinh doanh' | 'Doanh nghiệp'
  sellerType: 'Cá nhân',
  // Full address: số nhà, đường, phường/xã, quận/huyện, tỉnh/thành.
  address: 'Hà Nội, Việt Nam',
  // Tax code / business registration number (if a registered business).
  // Để trống khi chưa đăng ký kinh doanh — Footer/LegalShell tự ẩn dòng này (01/10/2026, user cung cấp tên + địa chỉ).
  taxCode: '',
  phone: '0399360938',
  email: 'cuongthaihnhe176322@gmail.com',
  zalo: 'https://zalo.me/0399360938',
} as const;

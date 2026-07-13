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
  legalName: '[Họ và tên đầy đủ của người bán / Tên hộ kinh doanh / doanh nghiệp]',
  // 'Cá nhân' | 'Hộ kinh doanh' | 'Doanh nghiệp'
  sellerType: '[Cá nhân kinh doanh / Hộ kinh doanh / Doanh nghiệp]',
  // Full address: số nhà, đường, phường/xã, quận/huyện, tỉnh/thành.
  address: '[Địa chỉ đầy đủ: số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố]',
  // Tax code / business registration number (if a registered business).
  taxCode: '[Mã số thuế / Số ĐKKD — nếu có]',
  phone: '0399360938',
  email: 'cuongthaihnhe176322@gmail.com',
  zalo: 'https://zalo.me/0399360938',
} as const;

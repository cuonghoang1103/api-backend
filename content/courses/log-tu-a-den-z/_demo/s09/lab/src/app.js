// app.js — giao diện "Shop Lab 9" (mã nguồn đọc được; bản chạy là public/app.min.js do esbuild nén + app.min.js.map)
import { guiLoi } from './bat-loi.js';

const API = 'http://api.lgz.test:41902';
const TOKEN = localStorage.getItem('token') || '';

function tongTien(gio) {
  return gio.items.reduce((s, it) => s + it.gia * it.sl, 0);
}

export function thanhToan(gio) {
  console.info('[cart] thanh toán', gio && gio.id);
  const tien = tongTien(gio.chiTiet);          // lỗi cố ý: gio.chiTiet không tồn tại
  return tien;
}

async function goi(duong, opts = {}) {
  const r = await fetch(API + duong, { ...opts, headers: { Authorization: 'Bearer ' + TOKEN, ...(opts.headers || {}) } });
  if (!r.ok) {
    console.error(`[api] ${opts.method || 'GET'} ${duong} → ${r.status}`, await r.text());
    return null;
  }
  return r.json();
}

export async function chay(kichBan) {
  console.log('[boot] Shop Lab 9 v1.4.2 khởi động, kịch bản =', kichBan);
  console.debug('[boot] cấu hình', { API, coToken: TOKEN !== '' });
  if (kichBan.includes('login')) {              // đăng nhập lấy token mới… nhưng quên lưu lại (lỗi của Lab 9)
    const r = await fetch(API + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sv.lab9@example.com', password: 'MatKhau_GIA_123' }), credentials: 'include' });
    const { token } = await r.json();
    console.log('[auth] đăng nhập xong');
    await fetch(API + '/api/search?q=ban+phim&token=' + token);   // token trên URL: thói quen xấu
  }
  const sp = await goi('/api/products');
  if (sp) console.log(`[products] tải ${sp.length} sản phẩm`);
  if (kichBan.includes('me')) await goi('/api/me');
  if (kichBan.includes('orders')) {
    try { await goi('/api/orders'); } catch (e) { console.error('[orders] không gọi được API:', e.message); }
  }
  if (kichBan.includes('report')) await goi('/api/report');
  if (kichBan.includes('slow')) await goi('/api/slow');
  if (kichBan.includes('warn')) console.warn('[cart] giỏ hàng lưu ở localStorage đã cũ 31 ngày, bỏ qua');
  if (kichBan.includes('pay')) document.getElementById('pay').addEventListener('click', () => thanhToan({ id: 'C-1042' }));
  if (kichBan.includes('pii')) setTimeout(() => { throw new Error(`không tải được hồ sơ sv.lab9@example.com (${location.origin}/ho-so?token=${TOKEN})`); });
  if (kichBan.includes('storm')) for (let i = 0; i < 50; i++) setTimeout(() => { throw new Error('vẽ ô sản phẩm #' + (i % 3) + ' thất bại'); });
  if (kichBan.includes('reject')) goi('/api/coupon').then((c) => c.ma.toUpperCase());   // quên catch
}

window.addEventListener('error', (e) => guiLoi('error', e.error || e.message || e, e.filename, e.lineno, e.colno), true);
window.addEventListener('unhandledrejection', (e) => guiLoi('unhandledrejection', e.reason));
window.shop = { chay, thanhToan };

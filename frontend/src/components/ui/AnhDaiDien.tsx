'use client';

import { useState } from 'react';

/**
 * Ảnh đại diện: dùng ảnh thật nếu có, không thì vẽ CHỮ CÁI ĐẦU tại chỗ.
 *
 * ⚠️ Vì sao không gọi dịch vụ ngoài: chỗ này trước đây dùng
 * `https://ui-avatars.com/api/?name=…`, mà CSP của web (next.config.js,
 * `img-src`) KHÔNG có tên miền đó ⇒ trình duyệt chặn ⇒ hiện icon ảnh hỏng ở
 * mọi chỗ không có avatar. Người dùng phản ánh 19/09/2026 ("nó hiện avata
 * lỗi"). `curl` vẫn 200 nên nhìn từ máy chủ không thấy gì sai — CSP chỉ chặn
 * trong trình duyệt.
 *
 * Vẽ tại chỗ tốt hơn là thêm tên miền vào CSP: không phụ thuộc mạng, không
 * gửi tên người dùng sang bên thứ ba, hiện ngay, và không bao giờ hỏng.
 */

/** Màu nền suy ra từ tên — cùng một tên luôn ra cùng một màu. */
const MAU = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
  '#10b981', '#14b8a6', '#0ea5e9', '#3b82f6', '#a855f7',
];

function mauTheoTen(ten: string): string {
  let h = 0;
  for (let i = 0; i < ten.length; i++) h = (h * 31 + ten.charCodeAt(i)) >>> 0;
  return MAU[h % MAU.length];
}

/** Lấy tối đa 2 chữ cái đầu: "Cuong Hoang" → "CH", "CuongHoangDev" → "C". */
function chuCaiDau(ten: string): string {
  const tu = ten.trim().split(/\s+/).filter(Boolean);
  if (!tu.length) return '?';
  if (tu.length === 1) return tu[0][0].toUpperCase();
  return (tu[0][0] + tu[tu.length - 1][0]).toUpperCase();
}

export function AnhDaiDien({
  src,
  ten,
  className = 'w-10 h-10',
  title,
}: {
  src?: string | null;
  ten?: string | null;
  className?: string;
  title?: string;
}) {
  const [hong, setHong] = useState(false);
  const tenThat = (ten || '').trim() || 'Người dùng';

  // Ảnh thật hỏng (link chết, CSP chặn) thì rơi về chữ cái, không để icon vỡ.
  if (src && !hong) {
    return (
      <img
        src={src}
        alt={tenThat}
        title={title || tenThat}
        onError={() => setHong(true)}
        className={`${className} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={tenThat}
      title={title || tenThat}
      className={`${className} rounded-full shrink-0 inline-flex items-center justify-center font-semibold text-white select-none`}
      style={{ background: mauTheoTen(tenThat), fontSize: '0.8em', letterSpacing: '0.02em' }}
    >
      {chuCaiDau(tenThat)}
    </span>
  );
}

export default AnhDaiDien;

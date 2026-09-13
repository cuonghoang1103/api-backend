'use client';

/**
 * Nền cho gian hàng — tối, trầm, đọc được.
 * ─────────────────────────────────────────────────────────────────────────
 * Thay `SummerShopBackground` (nền biển nhiệt đới sáng chói). Đo thật
 * 14/09/2026: nền sáng đó đặt dưới chữ trắng của giao diện tối làm tiêu đề
 * và các dòng mô tả gần như không đọc nổi — độ tương phản rơi xuống dưới
 * ngưỡng WCAG, và dải "Ví điểm" thì chìm hẳn.
 *
 * Nguyên tắc ở đây: nền là NỀN. Nó không được tranh chấp với sản phẩm.
 *  - hai quầng sáng rất mờ, chuyển động chậm (22-30s) — đủ để trang không
 *    chết cứng, không đủ để kéo mắt khỏi hàng hoá;
 *  - lưới mảnh mờ dần xuống đáy, gợi cảm giác "kỹ thuật" hợp với hàng là
 *    API key chứ không phải đồ lưu niệm;
 *  - KHÔNG ảnh, KHÔNG canvas: toàn bộ là CSS transform/opacity nên chạy
 *    trên luồng hợp thành, gần như không tốn CPU.
 *
 * ⚠️ `prefers-reduced-motion`: dừng hẳn chuyển động, giữ nguyên màu.
 */
export default function ShopBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes shopTroi1 {
          0%,100% { transform: translate3d(-6%, -4%, 0) scale(1); }
          50%     { transform: translate3d(5%, 3%, 0)  scale(1.12); }
        }
        @keyframes shopTroi2 {
          0%,100% { transform: translate3d(5%, 3%, 0)  scale(1.08); }
          50%     { transform: translate3d(-5%, -3%, 0) scale(0.96); }
        }
        .shop-quang-1 { animation: shopTroi1 26s ease-in-out infinite; }
        .shop-quang-2 { animation: shopTroi2 32s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .shop-quang-1, .shop-quang-2 { animation: none !important; }
        }
      `}</style>

      {/* Nền đặc trước, để không mượn màu nền của trang bên dưới. */}
      <div className="absolute inset-0 bg-darkbg" />

      <div
        className="shop-quang-1 absolute -top-56 left-[12%] h-[680px] w-[680px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.16), transparent 63%)', filter: 'blur(110px)' }}
      />
      <div
        className="shop-quang-2 absolute -bottom-64 right-[8%] h-[620px] w-[620px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.14), transparent 63%)', filter: 'blur(120px)' }}
      />

      {/* Lưới kỹ thuật, mờ dần xuống đáy để không cắt ngang nội dung. */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.14) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(to bottom, black, transparent 62%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 62%)',
        }}
      />
    </div>
  );
}

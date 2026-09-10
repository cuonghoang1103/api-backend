/**
 * ============================================================
 * `<Chu>` — một câu văn xuôi CÓ ĐỊNH DẠNG, dịch trọn gói
 * ============================================================
 *
 * ─── VẤN ĐỀ NÓ GIẢI ───
 * Rất nhiều câu trong app có `<strong>` hay `<code>` chen giữa:
 *
 * ```tsx
 * <li>Chạy <strong>mọi lệnh</strong>, kể cả loại bị xếp nguy hiểm — <code>rm -rf</code>…</li>
 * ```
 *
 * Cách ngây thơ là cắt thành ba mẩu rồi dịch từng mẩu. Nó HỎNG, và hỏng theo
 * kiểu khó thấy: trật tự từ tiếng Anh khác tiếng Việt, nên ghép ba mẩu đã dịch
 * theo thứ tự cũ cho ra một câu đúng ngữ pháp từng mảnh mà vô nghĩa toàn cục.
 * Tệ hơn, phần đậm sẽ rơi vào chữ khác — nhấn mạnh sai chỗ trong một cảnh báo
 * an toàn là đổi cả ý nghĩa của cảnh báo.
 *
 * ─── CÁCH LÀM ───
 * Một mục từ điển cho TRỌN câu, đánh dấu định dạng ngay trong chuỗi:
 *   `**đậm**`   → `<strong>`
 *   `` `mã` ``  → `<code>`
 *
 * Bản dịch được phép đặt dấu ở chỗ khác hẳn — đúng chỗ tiếng Anh cần nhấn.
 *
 * ⚠️ KHÔNG phải markdown. Cố ý chỉ có hai loại: thêm nữa là mời gọi người ta
 * nhét cả bảng biểu vào một chuỗi dịch, và lúc đó không ai dịch nổi.
 */
import type { ReactNode } from 'react';

import { useDich } from './index';

/** Cắt một câu thành các mẩu chữ / đậm / mã. */
export function tachDinhDang(cau: string): { loai: 'chu' | 'dam' | 'ma'; chu: string }[] {
  const ra: { loai: 'chu' | 'dam' | 'ma'; chu: string }[] = [];
  // Một lượt quét cho cả hai dấu: quét hai lượt thì `**` bọc quanh `` ` `` (và
  // ngược lại) sẽ bị lượt sau cắt vào giữa mẩu lượt trước đã tạo.
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let cuoi = 0;
  for (const m of cau.matchAll(re)) {
    if (m.index > cuoi) ra.push({ loai: 'chu', chu: cau.slice(cuoi, m.index) });
    ra.push(m[1] !== undefined
      ? { loai: 'dam', chu: m[1] }
      : { loai: 'ma', chu: m[2]! });
    cuoi = m.index + m[0].length;
  }
  if (cuoi < cau.length) ra.push({ loai: 'chu', chu: cau.slice(cuoi) });
  return ra;
}

/**
 * Hiện một câu đã dịch, giữ nguyên phần đậm và phần mã.
 *
 * `<Chu>Chạy **mọi lệnh**, kể cả `rm -rf`.</Chu>` — nhưng viết dưới dạng chuỗi:
 * `<Chu cau="Chạy **mọi lệnh**, kể cả `rm -rf`." />`
 */
export function Chu({ cau }: { cau: string }): ReactNode {
  const { dich } = useDich();
  return tachDinhDang(dich(cau)).map((m, i) => {
    if (m.loai === 'dam') return <strong key={i}>{m.chu}</strong>;
    if (m.loai === 'ma') return <code key={i}>{m.chu}</code>;
    return <span key={i}>{m.chu}</span>;
  });
}

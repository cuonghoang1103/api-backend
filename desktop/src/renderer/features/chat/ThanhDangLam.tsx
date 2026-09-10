/**
 * ============================================================
 * THANH "ODIN ĐANG…" — ghim trên ô soạn, sống trọn lượt chạy
 * ============================================================
 *
 * Thay cho dòng chờ cũ của AI Code (`DangNghi`, nay chỉ còn AI Chat dùng) —
 * nó nằm TRONG bảng ghi và bám vào cờ `dangNghi`. Hai chỗ hỏng của cách cũ:
 *
 *  1. `dangNghi` bị tắt ở gần như mọi sự kiện và chỉ bật lại ở `batDau` của
 *     vòng SAU ⇒ sau mỗi tool có 2,4–4,7 giây (bảng đo trong CLAUDE.md) màn
 *     hình không đổi một điểm ảnh. Người dùng đọc đúng nó là "đứt kết nối".
 *  2. Nằm trong vùng cuộn nên cuộn lên đọc lại là nó biến mất — đúng lúc
 *     người ta đang tìm bằng chứng rằng app còn chạy.
 *
 * Thanh này bám `dangChay` (bật từ `gui()`, tắt ở `finally` — không kẽ hở) và
 * nằm NGOÀI vùng cuộn.
 *
 * ─── VÌ SAO VẪN ĐẾM GIÂY ───
 * Một câu đứng im 50 giây không phân biệt được với app treo. Số giây là bằng
 * chứng sống rẻ nhất — rẻ hơn một thanh tiến trình giả vờ, mà cũng không làm
 * thật được vì không ai biết model còn nghĩ bao lâu. Nó đếm lại từ 0 mỗi khi
 * CÂU đổi, nên nó đo "giai đoạn này đã bao lâu" chứ không phải cả lượt.
 *
 * ⚠️ VẪN GIỮ câu "cổng AI đang chậm chứ app không treo". Nó là thông tin THẬT
 * và cho người dùng một lựa chọn (chờ tiếp, hay bấm Dừng) — bỏ đi cho gọn là
 * đổi sự tử tế lấy sự mơ hồ.
 */
import { useEffect, useState } from 'react';
import { Loader2, Hand } from 'lucide-react';

import type { ViecHienTai } from './viecDangLam';
import { useDich } from '../../i18n';

/** Giây bắt đầu nói ra nguyên nhân. Dưới ngần này thì chưa có gì bất thường. */
const CHANG_LO_GIAY = 15;

export function ThanhDangLam({
  viec,
  buoc,
}: {
  viec: ViecHienTai;
  /** Bước thứ mấy trên tổng bao nhiêu. Báo trước khi chạm trần. */
  buoc?: { nay: number; tran: number };
}) {
  const { dich } = useDich();
  const [giay, datGiay] = useState(0);

  /* Đếm lại từ 0 mỗi khi CÂU đổi: mốc có nghĩa là "giai đoạn này", và nó tự
     chứng minh có thứ đang tiến triển mỗi lần con số nhảy về 0. */
  useEffect(() => {
    datGiay(0);
    if (viec.kieu !== 'lam') return;
    const id = setInterval(() => datGiay((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, [viec.chu, viec.kieu]);

  return (
    <div className="ct-danglam" data-kieu={viec.kieu} role="status" aria-live="polite">
      {viec.kieu === 'lam'
        ? <Loader2 size={13} aria-hidden className="ct-spin" />
        : <Hand size={13} aria-hidden />}

      {buoc && (
        <span className="ct-danglam-buoc" data-sap-het={buoc.tran - buoc.nay <= 1}>
          bước {buoc.nay}/{buoc.tran}
        </span>
      )}

      <span className="ct-danglam-chu">{viec.chu}</span>

      {/* Số giây chỉ hiện sau 3s: việc nhanh mà kèm một con số nhảy liên tục
          thì nó thành thứ gây lo, không phải thứ trấn an. */}
      {viec.kieu === 'lam' && giay >= 3 && (
        <span className="ct-danglam-giay">{giay}s</span>
      )}

      {viec.kieu === 'lam' && giay >= CHANG_LO_GIAY && (
        <span className="ct-danglam-phu">
          {dich('Cổng AI đang chậm chứ app không treo — bấm Dừng nếu muốn thử lại.')}
        </span>
      )}
    </div>
  );
}

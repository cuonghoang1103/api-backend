'use client';

/**
 * Thẻ "📷 Sách gốc" đầu mỗi bài của khoá Dekiru — CHỈ hiện với tài khoản được
 * phép (hỏi `/sach-rieng/quyen`); người khác không thấy gì. Mở trình xem sách
 * ở đúng mục của bài đang học (hội thoại → trang hội thoại, từ vựng → ことば…).
 */
import Link from 'next/link';
import type { Lesson } from '@/components/sach-hoc/types';
import { MUC_CUA_KIND, TEN_MUC, urlAnh, useQuyenSachRieng } from './useSachRieng';
import st from './sachGoc.module.css';

const TRANG_DAU: Record<number, [number, number]> = {
  1: [15, 30], 2: [31, 46], 3: [47, 66], 4: [67, 82], 5: [83, 100], 6: [101, 116], 7: [117, 136], 8: [137, 152],
  9: [153, 168], 10: [169, 184], 11: [185, 204], 12: [205, 220], 13: [221, 236], 14: [237, 252], 15: [253, 269],
};

export function NutSachGoc({ lesson, bai }: { lesson: Lesson; bai: number | undefined }) {
  const co = useQuyenSachRieng();
  if (!co || !bai || !TRANG_DAU[bai]) return null;
  const muc = MUC_CUA_KIND[lesson.kind];
  const [tu, den] = TRANG_DAU[bai];
  const href = `/language/ja/dekiru/sach-goc?bai=${bai}${muc ? `&muc=${muc}` : ''}&tu=${encodeURIComponent(lesson.id)}`;
  return (
    <Link href={href} className={st.the}>
      <span className={st.theAnh}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ảnh riêng tư qua API */}
        <img src={urlAnh(tu, true)} alt="" width={44} height={62} loading="lazy" />
      </span>
      <span className={st.theChu}>
        <b>📷 Sách gốc · Bài {bai}</b>
        <small>
          Trang {tu}–{den} đúng như sách{muc && muc !== 'mo-bai' ? ` · mở ở mục ${TEN_MUC[muc].ja}` : ''} · hướng dẫn + gia sư theo từng trang
        </small>
      </span>
      <span className={st.theMui}>Mở sách →</span>
    </Link>
  );
}

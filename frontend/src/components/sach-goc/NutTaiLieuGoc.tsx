'use client';

/**
 * Thẻ "🖼️ Slide & tài liệu gốc" đầu bài Dekiru — CHỈ hiện với tài khoản được phép. Tìm tài liệu gốc (slide cô, BT, đề ôn…)
 * đi cùng bài đang mở theo `lienKet` trong danh mục (tiền tố id bài), rồi mở đúng tài liệu trong trình xem riêng.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { layTaiLieu, useQuyenSachRieng, type TaiLieuGoc } from './useSachRieng';
import st from './sachGoc.module.css';

export function NutTaiLieuGoc({ lessonId }: { lessonId: string }) {
  const co = useQuyenSachRieng();
  const [ds, setDs] = useState<TaiLieuGoc[]>([]);
  useEffect(() => {
    if (!co) return;
    let live = true;
    layTaiLieu().then((dm) => { if (live) setDs(dm.taiLieu.filter((d) => d.lienKet.some((k) => lessonId.startsWith(k)))); }).catch(() => {});
    return () => { live = false; };
  }, [co, lessonId]);
  if (!co || !ds.length) return null;
  return (
    <div className={st.the} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <b>🖼️ Slide & tài liệu gốc của bài này (chỉ mình bạn thấy)</b>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {ds.map((d) => (
          <Link key={d.id} href={`/language/ja/dekiru/sach-goc/tai-lieu?doc=${encodeURIComponent(d.id)}`} style={{ fontWeight: 600, textDecoration: 'underline' }}>
            {d.ten} ({d.soTrang} trang)
          </Link>
        ))}
      </div>
    </div>
  );
}

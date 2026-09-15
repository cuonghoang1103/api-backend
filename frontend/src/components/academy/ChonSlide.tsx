'use client';

/**
 * ============================================================
 * HỎI THEO SLIDE — bấm một cái thay vì chụp màn hình
 * ============================================================
 *
 * Người dùng 15/09/2026: *"bạn có thể có mục câu hỏi sẵn để ấn vào chọn cho
 * nó lẹ đỡ phải chụp ảnh gửi hỏi từng slide không?"*.
 *
 * Được, và rẻ hơn hẳn đường chụp ảnh:
 *  • Ảnh chụp một slide tốn ~1.500 token, và nó nằm lại trong lượt hỏi đó.
 *  • Hỏi theo SỐ slide tốn vài chục token, vì phần giảng của slide ấy đã nằm
 *    sẵn trong nội dung bài mà gia sư được đưa trọn.
 *  • Và câu trả lời được CACHE theo slide: người thứ hai bấm cùng slide nhận
 *    ngay lập tức, không tốn thêm một lượt gọi model nào.
 *
 * ⚠️ MẶC ĐỊNH ĐÓNG. Một bộ 21 slide mà xổ hết ra là đẩy ô nhập xuống dưới
 * màn hình — đúng cái phiền ("phải lướt xuống dưới để chat") mà cả việc này
 * sinh ra để bỏ.
 */

import { useState } from 'react';
import { ChevronDown, Presentation } from 'lucide-react';
import type { Slide } from '@/components/academy/docSlide';

export default function ChonSlide({ slides, khoa, onChon, toi }: {
  slides: Slide[];
  /** Đang hỏi dở ⇒ khoá, tránh bắn hai lượt chồng nhau (mỗi lượt là tiền). */
  khoa?: boolean;
  onChon: (s: Slide) => void;
  /** `true` = bảng màu tối của khung robot; bỏ trống = theo chủ đề của web. */
  toi?: boolean;
}) {
  const [mo, datMo] = useState(false);
  if (!slides.length) return null;

  const vienToi = { borderColor: 'rgba(34,211,238,0.18)' };
  const vienWeb = { borderColor: 'var(--border-color)' };
  const chuToi = { color: '#94a3b8' };
  const chuWeb = { color: 'var(--text-secondary)' };

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => datMo((m) => !m)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${toi ? 'bg-[#0d1117]' : ''}`}
        style={{ ...(toi ? vienToi : vienWeb), ...(toi ? chuToi : chuWeb) }}
        title="Chọn một slide để gia sư giảng kỹ — không cần chụp màn hình"
      >
        <Presentation size={13} />
        Hỏi theo slide
        <span className={`rounded-full px-1.5 text-[10px] font-bold ${toi ? 'bg-[#22d3ee]/15 text-[#22d3ee]' : ''}`}
          style={toi ? undefined : { background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
          {slides.length}
        </span>
        <ChevronDown size={12} className={mo ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {mo && (
        /* `max-h` + cuộn: một bài ghép ba bộ slide có thể tới 60 mục, và một
           danh sách dài bằng cả màn hình thì không ai cuộn hết. */
        <div className="mt-1.5 max-h-56 overflow-y-auto rounded-lg border" style={toi ? vienToi : vienWeb}>
          {slides.map((s) => (
            <button
              key={`${s.bo}#${s.so}`}
              type="button"
              disabled={khoa}
              onClick={() => { onChon(s); datMo(false); }}
              className={`flex w-full items-baseline gap-2 border-b px-2.5 py-1.5 text-left last:border-b-0 disabled:opacity-40 ${
                toi ? 'hover:bg-[#22d3ee]/10' : 'hover:opacity-80'}`}
              style={toi ? vienToi : vienWeb}
            >
              <span className={`shrink-0 font-mono text-[10px] ${toi ? 'text-[#22d3ee]' : ''}`}
                style={toi ? undefined : { color: 'var(--accent-color, #8b5cf6)' }}>
                {s.bo} {s.so}{s.tong ? `/${s.tong}` : ''}
              </span>
              {/* `truncate` + `min-w-0`: tên slide dài ("Course content (CTFL
                  tree)") không được kéo giãn khung nổi rộng ra. */}
              <span className={`min-w-0 flex-1 truncate text-xs ${toi ? 'text-[#cbd5e1]' : ''}`}
                style={toi ? undefined : { color: 'var(--text-primary)' }} title={s.ten}>
                {s.ten || '(không có tiêu đề)'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

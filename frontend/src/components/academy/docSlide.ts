/**
 * ============================================================
 * ĐỌC DANH SÁCH SLIDE TỪ NỘI DUNG BÀI HỌC
 * ============================================================
 *
 * Người dùng 15/09/2026: *"những bài học nào có slide … bạn có thể có mục câu
 * hỏi sẵn để ấn vào chọn cho nó lẹ đỡ phải chụp ảnh gửi hỏi từng slide không?
 * phần này tôi thấy khó bạn có làm được không nhỉ"*.
 *
 * Làm được, và hoá ra KHÔNG cần ảnh: slide đã nằm sẵn trong nội dung bài dưới
 * dạng có cấu trúc, kèm cả số thứ tự lẫn tên:
 *
 *     <div class="anh-slide">
 *       <img src="…/swt0/002.webp" alt="SWT0 slide 2: ISTQB" … />
 *       <p class="chu-thich">📑 <strong>SWT0</strong> · slide 2/21 — ISTQB</p>
 *     </div>
 *
 * Và quan trọng hơn: phần GIẢNG của mỗi slide cũng nằm ngay cạnh nó trong
 * cùng nội dung bài — mà gia sư thì đã được đưa trọn nội dung bài. Nghĩa là
 * hỏi "giảng kỹ slide 2" đã đủ để nó trả lời đúng; chụp màn hình gửi lên chỉ
 * là đường vòng tốn thêm ~1.500 token mỗi lượt.
 *
 * ⚠️ DÙNG REGEX, KHÔNG DÙNG `DOMParser`. Hàm này phải chạy được cả dưới bộ
 * kiểm (môi trường node, không có DOM) — và markup ở đây do chính kho này sinh
 * ra nên hình dạng của nó ổn định, không phải HTML lạ ngoài internet.
 */

export interface Slide {
  /** Số thứ tự trong bộ. */
  so: number;
  /** Tổng số slide của bộ — để hiện "2/21". */
  tong: number;
  /** Tên bộ slide, ví dụ `SWT0`. Một bài có thể ghép nhiều bộ. */
  bo: string;
  /** Tiêu đề slide. Có thể rỗng nếu chú thích không ghi. */
  ten: string;
}

/** `📑 <strong>SWT0</strong> · slide 2/21 — ISTQB` */
const CHU_THICH = /<p class="chu-thich">[\s\S]*?<strong>([^<]+)<\/strong>[\s\S]*?slide\s+(\d+)\s*\/\s*(\d+)\s*(?:—|-|–)?\s*([^<]*)<\/p>/gi;

/** Đường lùi: `alt="SWT0 slide 2: ISTQB"` — dùng khi chú thích thiếu/khác kiểu. */
const ALT = /<img[^>]*\balt="([^"]*?)\s+slide\s+(\d+)\s*:\s*([^"]*)"/gi;

function donTen(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Rút danh sách slide khỏi HTML của bài.
 *
 * Trả về mảng RỖNG khi bài không có slide — chỗ gọi dựa vào đó để ẩn hẳn mục
 * chọn slide, chứ không hiện một danh sách trống.
 */
export function docSlide(html: string | null | undefined): Slide[] {
  const s = String(html ?? '');
  if (!s) return [];

  const ra: Slide[] = [];
  const daCo = new Set<string>();

  const them = (bo: string, so: number, tong: number, ten: string): void => {
    if (!Number.isFinite(so) || so < 1) return;
    /* Khoá theo BỘ + SỐ. Một bài ghép nhiều bộ slide thì "slide 2" của SWT0 và
       "slide 2" của SWT1 là hai tấm khác nhau — gộp theo số trần là mất một
       trong hai, và người học bấm vào lại ra nội dung của bộ kia. */
    const khoa = `${bo}#${so}`;
    if (daCo.has(khoa)) return;
    daCo.add(khoa);
    ra.push({ so, tong, bo: donTen(bo), ten: donTen(ten) });
  };

  for (const m of s.matchAll(CHU_THICH)) {
    them(m[1] ?? '', Number(m[2]), Number(m[3] ?? 0), m[4] ?? '');
  }

  /* Chỉ dùng `alt` khi chú thích KHÔNG cho ra gì. Chạy cả hai rồi gộp thì một
     bài có đủ cả hai kiểu sẽ ra danh sách nửa nọ nửa kia, thứ tự lộn xộn. */
  if (ra.length === 0) {
    for (const m of s.matchAll(ALT)) {
      them(m[1] ?? '', Number(m[2]), 0, m[3] ?? '');
    }
  }

  // Xếp theo bộ rồi theo số — đúng thứ tự người học gặp chúng khi đọc bài.
  ra.sort((a, b) => (a.bo === b.bo ? a.so - b.so : a.bo.localeCompare(b.bo)));
  return ra;
}

/**
 * Câu hỏi gửi đi khi bấm vào một slide.
 *
 * Nêu CẢ số lẫn tên: chỉ có số thì gia sư phải tự dò trong nội dung bài và có
 * thể trỏ nhầm sang bộ khác, còn chỉ có tên thì hai slide trùng tên là lẫn.
 */
export function cauHoiSlide(s: Slide): string {
  const ten = s.ten ? ` (“${s.ten}”)` : '';
  return `Giảng kỹ slide ${s.so}${s.tong ? `/${s.tong}` : ''} của bộ ${s.bo}${ten} trong bài này: `
    + 'ý chính là gì, vì sao nó quan trọng, và một ví dụ dễ hiểu.';
}

/**
 * Khoá cache cho câu hỏi slide.
 *
 * ⚠️ Đây là chỗ tiết kiệm lớn nhất của cả tính năng: mọi người học bấm cùng
 * một slide đều nhận CÙNG một câu trả lời, lấy từ cache, tức thì và không tốn
 * thêm một lượt gọi model nào. Một bài 21 slide có 500 người học thì khác biệt
 * là 21 lượt gọi thay vì 10.500.
 *
 * Trần 40 ký tự là giới hạn máy chủ cắt `cacheKey` — vượt là hai slide khác
 * nhau bị cắt thành cùng một khoá và người học nhận nhầm lời giảng.
 */
export function khoaCacheSlide(s: Slide): string {
  return `slide:${s.bo}:${s.so}`.slice(0, 40);
}

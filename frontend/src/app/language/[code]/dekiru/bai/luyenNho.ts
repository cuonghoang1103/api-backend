/**
 * Mục LUYỆN NHỚ chèn vào MỖI BÀI (09/11/2026) — người học: "đối với từng bài học sẽ có học và luyện nhớ
 * từ vựng + ghép ngữ pháp như Quizlet… nhất là bảng chữ cái và chữ Hán".
 *
 *   Bài 0      → `b0-luyen-kana`  — bộ luyện bảng chữ kiểu Tofugu / kana.pro (khối `luyenKana`).
 *   Bài 1–15   → `bN-luyen-nho`   — 8 cách ôn kiểu Quizlet (thẻ lật, học, trắc nghiệm, gõ, nghe, ghép cặp,
 *                                    kiểm tra, ôn từ sai) khoá vào đúng từ vựng · chữ Hán · ngữ pháp bài N.
 * Đặt ngay sau phần bài tập cốt lõi (`bN-bai-tap`) — học xong là luyện nhớ luôn; `nhom.ts` xếp nó vào ①.
 *
 * Chỉ `import type` — script `course-manifest.mts` (Node thuần) gọi đúng hàm này để mục lục khớp bộ nạp.
 */
import type { Lesson } from '@/components/sach-hoc/types';

/** Bài có dữ liệu thẻ (onTheData.ts sinh từ Bài 1–15). */
const CO_THE = (n: number) => n >= 1 && n <= 15;

export function mucLuyenNho(n: number): Lesson | null {
  if (n === 0) {
    return {
      id: 'b0-luyen-kana',
      kind: 'kana',
      title: '🎌 Luyện bảng chữ cái — nhìn chữ gõ romaji · chọn chữ · nghe · bảng tiến độ',
      goal: 'Nhận ra mọi chữ hiragana rồi katakana trong dưới 2 giây: luyện từng hàng, chữ hay sai được hỏi lại nhiều hơn, bảng màu cho biết chữ nào đã thuộc.',
      minutes: 20,
      ready: true,
      blocks: [
        {
          t: 'note',
          title: 'Luyện thế nào cho nhanh thuộc',
          items: [
            'Mỗi ngày **10–15 phút**, học **2–3 hàng mới** (vd. あ・か・さ), luyện tới khi đúng ≥ 90% rồi mới thêm hàng.',
            'Đi theo thứ tự: **⌨️ Nhìn chữ → gõ** (nhận mặt chữ) → **🔤 Romaji → chọn chữ** (nhớ ngược) → **🎧 Nghe → chọn chữ** (luyện tai).',
            'Xong hiragana cơ bản mới sang âm đục ゛゜, rồi âm ghép ゃゅょ, rồi katakana. Xem **📊 Bảng tiến độ**: ô đỏ là chữ cần ôn.',
            'Sai một chữ ⇒ đọc mẹo nhớ hiện ra, **viết tay chữ đó 3 lần** (mục tập viết của Bài 0), chữ đó sẽ quay lại sau vài câu.',
          ],
        },
        { t: 'luyenKana' },
      ],
    };
  }
  if (!CO_THE(n)) return null;
  return {
    id: `b${n}-luyen-nho`,
    kind: 'review',
    title: `🃏 Luyện nhớ Bài ${n} — từ vựng · chữ Hán · ngữ pháp (thẻ lật, học, trắc nghiệm, gõ, nghe, ghép cặp, kiểm tra)`,
    goal: `Thuộc chắc toàn bộ từ vựng, chữ Hán của lớp và mẫu ngữ pháp Bài ${n}: lật thẻ → học → tự kiểm tra, từ sai được đưa vào hộp ôn lại.`,
    minutes: 25,
    ready: true,
    blocks: [
      {
        t: 'note',
        title: 'Học kiểu Quizlet — theo thứ tự này',
        items: [
          '**① Thẻ lật**: xem hết một lượt (chiều Nhật → Việt), bấm 🔊 đọc theo. Thẻ nào nhớ rồi thì đánh dấu "Thuộc".',
          '**② Học**: mỗi thẻ phải đúng 2 lần (chọn rồi gõ) mới qua. **③ Trắc nghiệm** + **④ Gõ** để chắc mặt chữ.',
          '**⑤ Nghe** luyện tai cho bài thi nghe, **⑥ Ghép cặp** bấm giờ để nhớ nhanh, **⑦ Kiểm tra** 20 câu như đề thật.',
          '**⑧ Ôn từ sai** mỗi ngày — từ sai nằm trong hộp, đúng liên tiếp mới được lên hộp cao. Đổi chiều **Việt → Nhật** khi đã quen.',
        ],
      },
      { t: 'onthe', bai: [n] },
    ],
  };
}

/** Chèn mục luyện nhớ sau `bN-bai-tap` (không có thì sau mục cốt lõi cuối cùng `bN-…`). */
export function chenLuyenNho(n: number, ls: Lesson[]): Lesson[] {
  const muc = mucLuyenNho(n);
  if (!muc || ls.some((l) => l.id === muc.id)) return ls;
  let i = ls.findIndex((l) => l.id === `b${n}-bai-tap`);
  if (i < 0) {
    for (let j = ls.length - 1; j >= 0; j--) if (ls[j].id.startsWith(`b${n}-`)) { i = j; break; }
  }
  return [...ls.slice(0, i + 1), muc, ...ls.slice(i + 1)];
}

/**
 * Ghép bộ HÌNH + SLIDE của bài (hinhB14.ts…): `bN-hinh-tu` đứng ngay sau `bN-tu-vung` (học từ xong là xem thẻ
 * hình), các bộ slide `bN-buoi-slide-K` nối cuối (nhom.ts xếp vào "② Học theo buổi trên lớp").
 */
export function chenHinh(n: number, ls: Lesson[], hinh: Lesson[] | undefined): Lesson[] {
  if (!hinh?.length) return ls;
  const tu = hinh.filter((l) => l.id === `b${n}-hinh-tu`);
  const con = hinh.filter((l) => l.id !== `b${n}-hinh-tu`);
  const i = ls.findIndex((l) => l.id === `b${n}-tu-vung`);
  const ra = i < 0 ? [...ls, ...tu] : [...ls.slice(0, i + 1), ...tu, ...ls.slice(i + 1)];
  return [...ra, ...con];
}

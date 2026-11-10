/**
 * Dựng THÂN bài đăng (chữ) từ một `BaiHoc` — phần THUẦN.
 *
 * Định dạng theo bộ vẽ của Bảng tin (`frontend/src/components/social/CodeBlock.tsx`):
 *   • dòng tiêu đề đứng riêng mở đầu bằng emoji ⇒ heading
 *   • ```lang …``` ⇒ khối code tô màu + nút Copy
 *   • ```output …```  ⇒ khung "Output thật" kiểu terminal
 *   • ```dapan …```   ⇒ đáp án ẨN, bấm mới hiện (quiz)
 *   • ```nguon …```   ⇒ thẻ liên kết nguồn (mỗi dòng "Tên | URL")
 * Ứng dụng nào chưa hiểu các khối mới vẫn đọc được: chúng chỉ là chữ + URL trần.
 */
import type { BaiHoc, DinhDang } from './kieu.js';

export const RULE = '────────────';
export const CHAN_BAI = '🤖 Bài học tự động của CuongMini · code đã chạy thật, nguồn đã mở kiểm tra';

export const NHAN_DINH_DANG: Record<DinhDang, string> = {
  'meo-code': 'MeoCode',
  bug: 'BugDebug',
  'truoc-sau': 'TruocSau',
  quiz: 'DoVui',
  eli5: 'ELI5',
  'so-do': 'SoDo',
  thread: 'Thread',
  'con-so': 'ConSo',
  'trich-dan': 'TrichDan',
  'tai-nguyen': 'TaiNguyen',
  'anh-that': 'LichSu',
};

/**
 * Dòng ĐẦU của bài (emoji + tiêu đề) — cũng là "chữ ký" để nhận ra bài thư viện
 * nào đã đăng. Không nhét id vào hashtag: `#hoc-<id>` bị bộ tách hashtag cắt ở
 * dấu gạch thành "#hoc" và leo lên mục Xu hướng (thấy khi thử 10/11/2026).
 */
export function dongDau(b: Pick<BaiHoc, 'emoji' | 'tieuDe'>): string {
  return `${b.emoji} ${b.tieuDe.replace(/[.,;]+$/, '')}`;
}

/** Đọc ngược id bài học từ nội dung đã đăng, theo dòng đầu. */
export function idTuNoiDung(content: string, theoDongDau: Map<string, string>): string | null {
  return theoDongDau.get(content.split('\n', 1)[0].trim()) ?? null;
}

function fence(lang: string, body: string): string {
  // Không để ``` lọt vào thân khối (sẽ cắt khối giữa chừng).
  return `\`\`\`${lang}\n${body.replace(/```/g, 'ˋˋˋ')}\n\`\`\``;
}

export function dungNoiDung(b: BaiHoc): string {
  const L: string[] = [];
  L.push(dongDau(b));
  L.push('');
  L.push(b.mo.trim());
  // Bài đố vui: output thật chính là đáp án ⇒ KHÔNG hiện cạnh code, mà gộp vào
  // khối đáp án ẩn (thấy khi thử 10/11: output nằm ngay trên ô bình chọn).
  const anOutput = !!b.poll;
  const outAn = anOutput
    ? b.khoi.flatMap((k) => (k.k === 'code' && k.out ? [k.out] : [])).join('\n')
    : '';
  for (const k of b.khoi) {
    L.push('');
    if (k.k === 'chu') L.push(k.t.trim());
    else if (k.k === 'dapan') {
      L.push(fence('dapan', outAn ? `${k.t.trim()}\n\nOutput thật khi chạy:\n${outAn}` : k.t.trim()));
    } else {
      if (k.ten) L.push(`▸ ${k.ten}`);
      L.push(fence(k.lang, k.src));
      if (k.out && !anOutput) L.push(fence('output', k.out));
    }
  }
  L.push('');
  L.push(RULE);
  L.push('');
  L.push('📚 Nguồn đã kiểm');
  L.push('');
  L.push(fence('nguon', b.nguon.map((n) => `${n.ten} | ${n.url}`).join('\n')));
  if (b.hocThem?.length) {
    L.push('');
    L.push('🎓 Học tiếp');
    L.push('');
    L.push(fence('nguon', b.hocThem.map((n) => `${n.ten} | ${n.url}`).join('\n')));
  }
  L.push('');
  L.push(CHAN_BAI);
  const tags = ['#HocMoiNgay', `#${NHAN_DINH_DANG[b.dinhDang]}`, ...b.tags.map((t) => `#${t.replace(/[^a-z0-9]/gi, '')}`)];
  L.push([...new Set(tags)].join(' '));
  return L.join('\n');
}

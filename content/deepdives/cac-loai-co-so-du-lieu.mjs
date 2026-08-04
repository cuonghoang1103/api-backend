/**
 * Deep Dive — các loại cơ sở dữ liệu.
 *
 * Prose in the sibling `.md` (same reason as the others: fenced code blocks
 * everywhere, and template-literal backticks would all need escaping).
 *
 * BÀI TIẾNG VIỆT ĐẦU TIÊN trong loạt Deep Dive, và đó là chủ ý. Khán giả thật
 * của trang này là sinh viên FPTU và dev Việt — hai bài duy nhất từng nằm ở
 * /blog đều nói với họ. Mảng tiếng Anh về "SQL vs NoSQL" đã bão hoà; mảng
 * tiếng Việt ở độ sâu này gần như trống.
 *
 * NHỮNG GÌ ĐÃ ĐI KIỂM TRƯỚC KHI VIẾT — phần 7 nói về chính repo này, nên mọi
 * con số trong đó đều được đọc ra từ mã nguồn, không phải nhớ lại:
 *   · 248 model trong prisma/schema.prisma  (grep -c '^model ')
 *   · tsvector GENERATED ALWAYS AS ... STORED + GIN trên bảng `snippets`
 *   · pg_trgm + 3 chỉ mục GIN trên users.username/display_name/full_name
 *     (prisma/migrations/20260723000000_add_search_trgm_indexes)
 *   · Redis chỉ giữ thứ dựng lại được: auth, otp, quota, embedQueue, cron,
 *     myLanguage  (grep -rl redis src/services)
 *   · pgvector: schema KHAI là có, thực tế KHÔNG. `scripts/enable-pgvector.sql`
 *     không tồn tại, cột `embedding` là `Json?` chứ không phải `vector(768)`,
 *     và không chỗ nào dùng toán tử `<=>`. RAG đang quét cosine bằng JS
 *     (src/services/ai.service.ts:338).
 *
 * Chỗ pgvector đó được viết thẳng vào bài, kèm kết luận "ở quy mô này như thế
 * là ổn". GIỮ NGUYÊN sự thẳng thắn đó nếu sửa bài: một bài viết về cơ sở dữ
 * liệu mà chỉ toàn khoe kiến trúc đẹp là thứ khiến người đọc thôi tin phần còn
 * lại. Nếu sau này repo thật sự bật pgvector, hãy sửa CẢ hai — mục 7 và chú
 * thích trong schema — chứ đừng chỉ sửa một chỗ, vì đó đúng là lỗi mà mục 7
 * đang lấy làm ví dụ.
 *
 * Ảnh bìa: frontend/public/deepdives/databases/cover.svg — SVG tự phục vụ, vì
 * CSP của site đặt `img-src 'self' data:` nên ảnh CDN ngoài bị chặn. Seeder
 * thoát khác 0 nếu file này thiếu, nên đừng đổi tên một phía.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./cac-loai-co-so-du-lieu.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'cac-loai-co-so-du-lieu',
  title: 'Có bao nhiêu loại cơ sở dữ liệu — và chọn cái nào cho việc gì',
  summary:
    '"SQL hay NoSQL" là phép chia sai: một vế là ngôn ngữ, vế kia nghĩa đen là "không phải cái kia". Bài này chia lại theo mô hình dữ liệu (11 loại), theo tải công việc và theo cách triển khai; giải thích ACID, mức cô lập, write skew, CAP bị hiểu sai ở đâu, B-tree so với LSM-tree; kèm cây quyết định, mười sai lầm hay gặp, và hồ sơ thật của chính trang này — 248 bảng trên một Postgres, một VPS 6GB.',
  category: 'DeepDive',
  tags: ['database', 'postgresql', 'sql', 'nosql', 'kien-truc', 'backend'],
  coverEmoji: '🗄️',
  coverImageUrl: '/deepdives/databases/cover.svg',
  readTimeMin: 30,
  isFeatured: true,
  trendingScore: 76,
  status: 'PUBLISHED',
  bodyMdx,
};

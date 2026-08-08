/**
 * Case-study 1.2 — Blog Platform (Markdown-based).
 *
 * The read-heavy inverse of the Todo app: many readers, few writers, most of
 * them signed out. Covers the three Next.js rendering strategies, the
 * rehypeRaw-then-sanitise ordering that decides whether the blog has an XSS
 * hole, Postgres full-text search, and the SEO surface.
 *
 * Slug preserved from the existing production row.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./blog-platform-markdown-based.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./blog-platform-markdown-based.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'blog-platform-markdown-based',
  title: 'Blog Platform (Markdown-based)',
  titleEn: 'Blog Platform (Markdown-based)',
  description:
    'Nền tảng blog viết bằng Markdown: bài toán ngược của Todo App — rất nhiều lượt đọc, rất ít lượt ghi, người đọc phần lớn không đăng nhập. Ba chiến lược render của Next.js, cửa sau XSS trong Markdown, tìm kiếm toàn văn bằng Postgres, và bốn thứ SEO bắt buộc.',
  descriptionEn:
    'A Markdown-powered blog: the inverse of the Todo App — very many reads, very few writes, most readers signed out. Covers the three Next.js rendering strategies, the XSS back door in Markdown, Postgres full-text search, and the four SEO non-negotiables.',
  techStack: [
    'Next.js 15 (App Router)', 'TypeScript', 'Prisma', 'PostgreSQL',
    'unified / remark / rehype', 'TailwindCSS', 'Redis', 'ISR', 'JSON-LD',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '5–7 ngày',
  durationEn: '5–7 days',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'BEGINNER',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `model Post {
  id          String     @id @default(cuid())
  slug        String     @unique
  title       String
  excerpt     String?    @db.Text
  // Markdown là NGUỒN SỰ THẬT; HTML là bản dựng sẵn, tạo lại được
  // bất cứ lúc nào. Sửa bài thì sửa markdown, đọc bài thì đọc html
  // — và nếu phát hiện lỗ hổng trong bộ lọc, chỉ cần render lại
  // MỘT LẦN cho toàn bộ bài viết.
  contentMd   String     @db.Text
  contentHtml String     @db.Text

  status      PostStatus @default(DRAFT)
  // Tách khỏi createdAt để làm hẹn giờ đăng: status = PUBLISHED
  // nhưng publishedAt ở tương lai thì CHƯA được hiện. Route công
  // khai phải lọc CẢ HAI điều kiện.
  publishedAt DateTime?

  viewCount   Int        @default(0)  // gom ở Redis, ghi mỗi phút
  readingTime Int        @default(1)  // phút, tính lúc lưu

  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  categoryId  String?
  category    Category?  @relation(fields: [categoryId], references: [id])
  tags        PostTag[]
  comments    Comment[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([status, publishedAt])
  @@map("posts")
}

enum PostStatus { DRAFT PUBLISHED ARCHIVED }

// Tìm kiếm toàn văn KHÔNG cần Elasticsearch (SQL thuần):
//
// ALTER TABLE posts ADD COLUMN search_vector tsvector
//   GENERATED ALWAYS AS (
//     setweight(to_tsvector('simple', coalesce(title, '')),   'A') ||
//     setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
//     setweight(to_tsvector('simple', coalesce(content_md,'')),'C')
//   ) STORED;
// CREATE INDEX posts_search_idx ON posts USING GIN (search_vector);
//
// 'simple' CHỨ KHÔNG PHẢI 'english': english stem theo tiếng Anh
// và loại bỏ stop word tiếng Anh — vô nghĩa với nội dung tiếng Việt.`,
  schemaCodeEn: `model Post {
  id          String     @id @default(cuid())
  slug        String     @unique
  title       String
  excerpt     String?    @db.Text
  // Markdown is the SOURCE OF TRUTH; HTML is a build artefact that can be
  // regenerated any time. Edits touch markdown, reads touch html — and if a
  // sanitiser hole turns up, you re-render ONCE across every article.
  contentMd   String     @db.Text
  contentHtml String     @db.Text

  status      PostStatus @default(DRAFT)
  // Separate from createdAt so scheduling works: status = PUBLISHED with a
  // future publishedAt must NOT be visible. The public route has to filter
  // on BOTH conditions.
  publishedAt DateTime?

  viewCount   Int        @default(0)  // buffered in Redis, flushed per minute
  readingTime Int        @default(1)  // minutes, computed on save

  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  categoryId  String?
  category    Category?  @relation(fields: [categoryId], references: [id])
  tags        PostTag[]
  comments    Comment[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([status, publishedAt])
  @@map("posts")
}

enum PostStatus { DRAFT PUBLISHED ARCHIVED }

// Full-text search WITHOUT Elasticsearch (plain SQL):
//
// ALTER TABLE posts ADD COLUMN search_vector tsvector
//   GENERATED ALWAYS AS (
//     setweight(to_tsvector('simple', coalesce(title, '')),   'A') ||
//     setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
//     setweight(to_tsvector('simple', coalesce(content_md,'')),'C')
//   ) STORED;
// CREATE INDEX posts_search_idx ON posts USING GIN (search_vector);
//
// 'simple' RATHER THAN 'english': the english config stems for English and
// strips English stop words — meaningless for Vietnamese content.`,
  schemaLang: 'prisma',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Chọn chiến lược render: SSG, ISR hay SSR',
      titleEn: 'Choosing a rendering strategy: SSG, ISR or SSR',
      description:
        'Ba chiến lược cùng tồn tại trong một codebase, và chọn sai thì hoặc trang chậm hoặc nội dung cũ. Với blog, ISR là câu trả lời mặc định: nhanh như tĩnh, tự làm mới sau N giây, và mỗi lượt đọc không tốn một truy vấn database.',
      descriptionEn:
        'All three coexist in one codebase, and the wrong pick means either a slow page or stale content. For a blog, ISR is the default answer: as fast as static, self-refreshing after N seconds, and no database query per read.',
      codeBlock:
        'export const revalidate = 60;   // dựng lại tối đa mỗi 60 giây\n\n'
        + 'export async function generateStaticParams() {\n'
        + '  const posts = await prisma.post.findMany({\n'
        + "    where: { status: 'PUBLISHED' },\n"
        + '    select: { slug: true },\n'
        + '    // Chỉ dựng sẵn 100 bài mới nhất: dựng hết 5.000 bài\n'
        + '    // làm mỗi lần build mất 20 phút, trong khi 95% lượt\n'
        + '    // truy cập rơi vào vài chục bài gần đây.\n'
        + '    take: 100,\n'
        + "    orderBy: { publishedAt: 'desc' },\n"
        + '  });\n'
        + '  return posts.map((p) => ({ slug: p.slug }));\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'SECURITY',
      title: 'Markdown và cửa sau XSS — thứ tự plugin quyết định tất cả',
      titleEn: 'Markdown and the XSS back door — plugin order decides everything',
      description:
        'Markdown cho phép nhúng HTML, HTML cho phép nhúng script. Dùng danh sách CHO PHÉP chứ không phải danh sách cấm: cấm script thì kẻ tấn công dùng img onerror, cấm onerror thì dùng svg onload — không bao giờ liệt kê hết. Và rehypeRaw phải chạy TRƯỚC rehypeSanitize; đảo lại là lọc trước khi phân tích HTML thô.',
      descriptionEn:
        'Markdown allows HTML, HTML allows script. Use an ALLOW list, not a block list: block script and the attacker uses img onerror, block onerror and they use svg onload — the list never ends. And rehypeRaw must run BEFORE rehypeSanitize; reversed, you sanitise before the raw HTML is even parsed.',
      codeBlock:
        '.use(remarkRehype, { allowDangerousHtml: true })\n'
        + '.use(rehypeRaw)              // cho phép HTML thô...\n'
        + '.use(rehypeSanitize, schema) // ...rồi LỌC NGAY sau đó\n'
        + '\n'
        + '// ĐẢO NGƯỢC HAI DÒNG NÀY = lọc trước khi phân tích HTML thô\n'
        + '// = mọi thứ nguy hiểm đi thẳng vào trang.',
      codeLang: 'typescript',
    },
    {
      phase: 'DATABASE',
      title: 'Schema: markdown là nguồn sự thật, HTML là bản dựng sẵn',
      titleEn: 'Schema: markdown is truth, HTML is a build artefact',
      description:
        'Giữ cả contentMd lẫn contentHtml. Không phải để nhanh — mà vì nếu sáu tháng sau phát hiện lỗ hổng trong bộ lọc, bạn render lại một lần cho toàn bộ bài viết. Lọc ở client thì mỗi trình duyệt của mỗi người đọc là một chỗ phải vá.',
      descriptionEn:
        'Store both contentMd and contentHtml. Not for speed — but because if a sanitiser hole surfaces six months later, you re-render once across every article. Sanitise on the client and every reader\'s browser is a separate patch site.',
    },
    {
      phase: 'BACKEND',
      title: 'Tìm kiếm toàn văn bằng Postgres, không cần Elasticsearch',
      titleEn: 'Postgres full-text search, no Elasticsearch needed',
      description:
        'Cột tsvector sinh tự động với trọng số A/B/C cho tiêu đề/tóm tắt/nội dung, kèm chỉ mục GIN. Dùng cấu hình simple chứ không phải english: english stem theo tiếng Anh và loại bỏ stop word tiếng Anh, vô nghĩa với nội dung tiếng Việt.',
      descriptionEn:
        'A generated tsvector column with A/B/C weights for title/excerpt/body, plus a GIN index. Use the simple configuration rather than english: english stems for English and strips English stop words, which is meaningless for Vietnamese content.',
    },
    {
      phase: 'BACKEND',
      title: 'Bộ đếm lượt xem không được chặn người đọc',
      titleEn: 'View counting must not block the reader',
      description:
        'Gom vào Redis rồi ghi xuống database mỗi phút — chính mẫu hình đã gặp ở URL Shortener. Gặp lại một mẫu hình trong ngữ cảnh khác là dấu hiệu nó là mẫu hình thật, không phải mẹo riêng của một dự án.',
      descriptionEn:
        'Accumulate in Redis, flush to the database each minute — the same pattern as the URL Shortener. Meeting a pattern again in a different context is the signal that it is a real pattern, not one project\'s trick.',
    },
    {
      phase: 'FRONTEND',
      title: 'SEO: metadata động, sitemap, canonical, JSON-LD',
      titleEn: 'SEO: dynamic metadata, sitemap, canonical, JSON-LD',
      description:
        'generateMetadata cho từng bài với Open Graph và canonical URL (chống nội dung trùng khi bài truy cập được qua nhiều đường dẫn). Sitemap sinh động từ database. JSON-LD kiểu Article là thứ khiến kết quả tìm kiếm hiện kèm ngày đăng và tên tác giả.',
      descriptionEn:
        'generateMetadata per article with Open Graph and a canonical URL (against duplicate content when a post is reachable via several paths). A sitemap generated from the database. JSON-LD of type Article is what makes a search result show a publish date and author name.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng Lighthouse và một payload XSS thật',
      titleEn: 'Verify with Lighthouse and a real XSS payload',
      description:
        'Dán <img src=x onerror=alert(1)> vào bài rồi xuất bản — không có gì được chạy. Kiểm bài hẹn giờ không truy cập được trước giờ kể cả khi biết URL. Đối chiếu số <url> trong sitemap với số bài đã xuất bản.',
      descriptionEn:
        'Paste <img src=x onerror=alert(1)> into a post and publish — nothing executes. Verify a scheduled post is unreachable before its time even with the exact URL. Cross-check the sitemap\'s <url> count against the published post count.',
    },
  ],

  features: [
    { title: 'Soạn Markdown có xem trước', titleEn: 'Markdown editor with preview', description: 'Render phía server, lưu cả markdown lẫn HTML đã lọc.', descriptionEn: 'Server-side rendering, storing both markdown and sanitised HTML.', status: 'PLANNED' },
    { title: 'Nháp / xuất bản / hẹn giờ đăng', titleEn: 'Draft / published / scheduled', description: 'publishedAt tách khỏi createdAt; route công khai lọc cả status lẫn thời gian.', descriptionEn: 'publishedAt separate from createdAt; the public route filters on status and time.', status: 'PLANNED' },
    { title: 'Danh mục, thẻ, trang lưu trữ', titleEn: 'Categories, tags, archive pages', description: 'Quan hệ nhiều-nhiều qua bảng trung gian PostTag.', descriptionEn: 'Many-to-many through the PostTag join table.', status: 'PLANNED' },
    { title: 'Bình luận có kiểm duyệt', titleEn: 'Moderated comments', description: 'Mặc định PENDING, lồng một cấp, có honeypot chống bot.', descriptionEn: 'PENDING by default, one level of nesting, with a honeypot against bots.', status: 'PLANNED' },
    { title: 'Tìm kiếm toàn văn có xếp hạng', titleEn: 'Ranked full-text search', description: 'tsvector + GIN, trọng số tiêu đề cao hơn thân bài.', descriptionEn: 'tsvector + GIN, with the title weighted above the body.', status: 'PLANNED' },
    { title: 'Sitemap, RSS, Open Graph, JSON-LD', titleEn: 'Sitemap, RSS, Open Graph, JSON-LD', description: 'Sinh động từ database, cập nhật cùng lúc với bài viết.', descriptionEn: 'Generated from the database, updated together with the posts.', status: 'PLANNED' },
    { title: 'Lighthouse ≥ 95 cả bốn hạng mục', titleEn: 'Lighthouse ≥ 95 across all four', description: 'ISR, ảnh có kích thước cố định, font tự host.', descriptionEn: 'ISR, images with fixed dimensions, self-hosted fonts.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Next.js — Data Fetching và Revalidating', titleEn: 'Next.js — Data Fetching and Revalidating', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration', type: 'LINK', description: 'ISR: cách nó hoạt động và khi nào gọi revalidatePath.', descriptionEn: 'ISR: how it works and when to call revalidatePath.' },
    { title: 'rehype-sanitize — schema mặc định', titleEn: 'rehype-sanitize — the default schema', url: 'https://github.com/rehypejs/rehype-sanitize', type: 'REPO', description: 'Đọc schema mặc định trước khi mở rộng nó — phần lớn nhu cầu đã được cho phép sẵn.', descriptionEn: 'Read the default schema before extending it — most needs are already allowed.' },
    { title: 'PostgreSQL — Full Text Search', titleEn: 'PostgreSQL — Full Text Search', url: 'https://www.postgresql.org/docs/current/textsearch.html', type: 'LINK', description: 'Chương 12. Đọc kỹ phần cấu hình từ điển và trọng số.', descriptionEn: 'Chapter 12. Focus on dictionary configurations and weighting.' },
    { title: 'OWASP — Cross Site Scripting Prevention', titleEn: 'OWASP — Cross Site Scripting Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', type: 'LINK', description: 'Vì sao danh sách cấm luôn thất bại và danh sách cho phép thì không.', descriptionEn: 'Why block lists always fail and allow lists do not.' },
    { title: 'Schema.org — Article', titleEn: 'Schema.org — Article', url: 'https://schema.org/Article', type: 'LINK', description: 'Các trường JSON-LD mà Google thực sự dùng để hiển thị kết quả giàu thông tin.', descriptionEn: 'The JSON-LD fields Google actually uses for rich results.' },
  ],

  coreKnowledge: [
    { vi: 'SSG, ISR và SSR: khác biệt thật, và chọn cái nào cho loại trang nào', en: 'SSG, ISR and SSR: the real differences, and which page type gets which' },
    { vi: 'Chuỗi plugin unified/remark/rehype và vì sao thứ tự quyết định tính an toàn', en: 'The unified/remark/rehype plugin chain, and why order decides safety' },
    { vi: 'Danh sách cho phép và danh sách cấm: vì sao chỉ một cái hoạt động được', en: 'Allow lists versus block lists: why only one of them ever works' },
    { vi: 'Tìm kiếm toàn văn Postgres: tsvector, trọng số, chỉ mục GIN, chọn từ điển', en: 'Postgres full-text search: tsvector, weights, GIN indexes, dictionary choice' },
    { vi: 'Cột sinh tự động (GENERATED ALWAYS AS ... STORED) và khi nào nên dùng', en: 'Generated columns (GENERATED ALWAYS AS ... STORED) and when to use them' },
    { vi: 'SEO kỹ thuật: canonical, sitemap, Open Graph, dữ liệu có cấu trúc', en: 'Technical SEO: canonical URLs, sitemaps, Open Graph, structured data' },
    { vi: 'Core Web Vitals: LCP, CLS, INP — cái gì đo cái gì và cách sửa từng cái', en: 'Core Web Vitals: LCP, CLS, INP — what each measures and how to fix it' },
    { vi: 'Tách đường ghi số liệu khỏi đường phục vụ người dùng (gặp lại từ URL Shortener)', en: 'Separating the metrics write path from the user read path (recurring from URL Shortener)' },
    { vi: 'Tabnabbing và vì sao target="_blank" phải đi kèm rel="noopener"', en: 'Tabnabbing, and why target="_blank" needs rel="noopener"' },
  ],

  portfolioBonus: [
    { vi: 'Ảnh chụp Lighthouse 4 điểm số ≥ 95 đính kèm README', en: 'A Lighthouse screenshot with all four scores ≥ 95 in the README' },
    { vi: 'Mục "Bảo mật" liệt kê các payload XSS đã thử và kết quả', en: 'A "Security" section listing the XSS payloads tried and the outcome' },
    { vi: 'Trang /uses hoặc /about viết bằng chính hệ thống, chứng minh nó dùng được thật', en: 'A /uses or /about page written in the system itself, proving it is usable' },
    { vi: 'RSS hợp lệ theo trình kiểm W3C Feed Validator', en: 'An RSS feed that passes the W3C Feed Validator' },
    { vi: 'So sánh thời gian tải trước và sau khi chuyển từ SSR sang ISR', en: 'A load-time comparison before and after moving from SSR to ISR' },
  ],

  completionOutcomes: [
    { vi: 'Chọn đúng chiến lược render cho từng loại trang và giải thích được lý do', en: 'Pick the right rendering strategy per page type and explain the reasoning' },
    { vi: 'Xử lý nội dung do người dùng nhập mà không mở cửa XSS', en: 'Handle user-authored content without opening an XSS hole' },
    { vi: 'Dùng Postgres cho tìm kiếm toàn văn thay vì thêm một dịch vụ phải vận hành', en: 'Use Postgres for full-text search instead of operating another service' },
    { vi: 'Làm SEO kỹ thuật đúng chuẩn, không chỉ nhồi từ khoá', en: 'Do technical SEO properly rather than stuffing keywords' },
    { vi: 'Đạt và giữ được điểm Core Web Vitals tốt trên trang có nội dung thật', en: 'Reach and hold good Core Web Vitals on a page with real content' },
  ],

  bodyMdx,
  bodyMdxEn,
};

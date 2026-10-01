/**
 * SEO & Analytics cho web — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: nextjs Ch17 (CSR/SSR/SSG/ISR, metadata/sitemap/robots nhập môn, Open Graph, Core Web Vitals ở mức giới thiệu)
 * và Ch18 (ảnh/JS/font) — bài "Nếu đã học nextjs Ch17/18" rồi đi sâu: crawl budget, index coverage, canonical/hreflang,
 * structured data, đo CWV ngoài thực địa, Search Console, GA4, analytics riêng tư, A/B test, SEO nội dung.
 * content-creator Ch26 là analytics của YouTube/TikTok — không trùng. performance-load-testing (Nhóm B) đo tải backend.
 * privacy-data-law (Nhóm B) lo cookie/đồng ý ở mức pháp lý — ở đây chỉ phần kỹ thuật + trỏ sang.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'frontend', name: 'Frontend', icon: 'Layout', sortOrder: 2 },
  course: {
    slug: 'seo-analytics',
    title: 'SEO & Analytics for the Web',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/seo-analytics.png?v=4',
    shortDescription: 'Get found and know what users do: technical SEO (crawl, index, sitemaps, canonicals, structured data), Next.js metadata, Core Web Vitals in the field, Search Console, GA4, Plausible/Umami, A/B tests and content SEO.|||Được tìm thấy và biết người dùng làm gì: SEO kỹ thuật (crawl, index, sitemap, canonical, structured data), metadata Next.js, Core Web Vitals thực địa, Search Console, GA4, Plausible/Umami, A/B test và SEO nội dung.',
    description: 'Khoá SEO và analytics cho lập trình viên tự vận hành website. Hiểu máy tìm kiếm hoạt động thế nào (crawl → render → index → xếp hạng), rồi làm SEO kỹ thuật cho đúng: robots.txt, sitemap, mã trạng thái, canonical, trùng lặp nội dung, hreflang cho trang song ngữ, structured data (schema.org), Open Graph; SEO với Next.js App Router (metadata API, render phía server, soft 404). Hiệu năng theo Core Web Vitals đo từ người dùng thật (CrUX, RUM) chứ không chỉ Lighthouse. Google Search Console từ A tới Z. Analytics: kế hoạch tracking, GA4 và sự kiện, Google Tag Manager, analytics tự host tôn trọng quyền riêng tư (Plausible, Umami), phễu, cohort, UTM, A/B test có thống kê đúng. Cuối cùng là SEO nội dung và liên kết. Dự án cuối: audit và sửa SEO + dựng analytics cho cuongthai.com.',
    whatYouLearn: 'Giải thích crawl, render, index, xếp hạng; chẩn đoán vì sao một trang không được index; cấu hình robots, sitemap, canonical, hreflang, structured data trong Next.js; đo và cải thiện LCP, INP, CLS từ dữ liệu thực; dùng Search Console để tìm và sửa lỗi; thiết kế kế hoạch tracking và cài GA4 hoặc Plausible/Umami; đo phễu và chạy A/B test không tự lừa mình; viết nội dung được tìm thấy mà không spam.',
    requirements: 'HTML/CSS/JavaScript cơ bản, đã làm một website (Next.js là lợi thế). Nên học trước Next.js (đặc biệt Ch17–18); khoá này đi sâu hơn phần SEO ở đó.',
    documentsNote: 'Tài liệu chính: developers.google.com/search/docs (Google Search Central) • support.google.com/webmasters (Search Console) • web.dev/articles/vitals • developer.chrome.com/docs/crux • support.google.com/analytics (GA4) • developers.google.com/tag-platform • schema.org • nextjs.org/docs/app/building-your-application/optimizing/metadata • plausible.io/docs • umami.is/docs • rfc-editor.org/rfc/rfc9309 (robots.txt).',
  },
  sections: khung('seo', [
    ['Section 0 — Why SEO and analytics matter', 'Mục 0 — Vì sao cần SEO và analytics', 'SEO và analytics là gì bằng lời đời thường, lịch sử, sự cố thật, và chuẩn bị công cụ.', [
      ['bat-dau-tai-day', 'Start here (1/2) — SEO and analytics in everyday words, their history, and mistakes that made sites vanish', 'Bắt đầu tại đây (1/2) — SEO và analytics bằng lời đời thường, lịch sử, và những lỗi làm website biến mất', 'SEO là giúp thư viện xếp sách của bạn đúng kệ · robots.txt (1994) → Google và PageRank (1998) → sitemaps (2005) → schema.org (2011) → Panda 2011/Penguin 2012 → Core Web Vitals (2020) → INP thay FID (03/2024) → GA4 thay Universal Analytics (07/2023) · Một dòng Disallow: / hoặc noindex quên gỡ sau staging có thể xoá cả website khỏi kết quả · Cơ quan bảo vệ dữ liệu Áo (01/2022) và Pháp (02/2022) cho rằng một số cách dùng Google Analytics vi phạm GDPR'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Đưa website của mình lên Google và đo được ai tới, làm gì · Vị trí: frontend, SEO kỹ thuật, growth engineer, marketing technologist · Lộ trình: nextjs → khoá này → solo-product · Cách học: mỗi bài áp lên một website thật đang chạy'],
      ['cai-dat', 'Tools: Search Console, Lighthouse, a crawler, analytics sandbox', 'Công cụ: Search Console, Lighthouse, trình crawl, analytics thử nghiệm', 'Xác minh tên miền bằng bản ghi DNS TXT · Chrome DevTools, Lighthouse, PageSpeed Insights · Screaming Frog (bản miễn phí) hoặc crawler mã nguồn mở · Umami tự host bằng Docker'],
      ['co-che', 'How search engines work: crawl, render, index, rank', 'Máy tìm kiếm hoạt động thế nào: crawl, render, index, xếp hạng', 'Googlebot tìm URL qua link và sitemap · Render JavaScript chạy sau (hàng đợi riêng) · Index là thư viện · Xếp hạng theo liên quan + chất lượng + trải nghiệm'],
    ]],
    ['Chapter 1 — Crawling and indexing', 'Chương 1 — Crawl và index', 'Được thấy trước, được xếp hạng sau.', [
      ['robots', 'robots.txt, meta robots and X-Robots-Tag', 'robots.txt, meta robots và X-Robots-Tag', 'Chặn crawl ≠ chặn index · noindex cần trang được crawl · RFC 9309 (2022) · Chặn staging bằng xác thực, không chỉ bằng robots'],
      ['sitemap', 'XML sitemaps that help', 'Sitemap XML có ích', 'Chỉ chứa URL chuẩn, trả 200 · lastmod trung thực · Sitemap index cho hàng nghìn bài học · Sinh động trong Next.js'],
      ['ma-trang-thai', 'Status codes, redirects and soft 404s', 'Mã trạng thái, chuyển hướng và soft 404', '301 vs 302 vs 308 · Chuỗi redirect · Soft 404: trang "không tìm thấy" trả 200 · Bài học thật: Suspense nuốt mã HTTP của notFound/redirect trong Next.js'],
      ['crawl-budget', 'Crawl budget, faceted URLs and infinite spaces', 'Ngân sách crawl, URL bộ lọc và không gian vô hạn', 'Tham số ?sort= sinh vô số URL · Lịch vô tận · Khi nào website nhỏ không cần lo'],
      ['js-seo', 'JavaScript SEO: CSR, SSR and hydration', 'SEO cho JavaScript: CSR, SSR và hydration', 'Nếu đã học nextjs Ch17: bốn chiến lược render — ở đây là kiểm Google thật thấy gì (URL Inspection, xem HTML đã render) · Nội dung chỉ có sau tương tác thì không được index'],
    ]],
    ['Chapter 2 — Canonicals, duplicates and internationalisation', 'Chương 2 — Canonical, trùng lặp và đa ngôn ngữ', 'Một nội dung, một URL chính.', [
      ['canonical', 'Canonical URLs and duplicate content', 'URL chuẩn và nội dung trùng lặp', 'rel=canonical · http/https, www/không www, dấu gạch chéo cuối · Bài học thật: cùng slug sống ở /blog và /tech-trends sau khi gộp bảng'],
      ['url-dep', 'URL design and slugs for Vietnamese', 'Thiết kế URL và slug cho tiếng Việt', 'Slug không dấu vs có dấu (mã hoá phần trăm) · Ngắn, ổn định, không đổi khi sửa tiêu đề · Đổi URL thì redirect 301'],
      ['hreflang', 'Bilingual sites: hreflang and language switching', 'Website song ngữ: hreflang và chuyển ngôn ngữ', 'hreflang vi/en/x-default · Hai ngôn ngữ trên cùng URL (kiểu EN|||VI) và hệ quả với SEO · Đừng tự chuyển ngôn ngữ theo IP'],
      ['phan-trang', 'Pagination, filters and thin pages', 'Phân trang, bộ lọc và trang mỏng', 'Trang 2, 3… vẫn nên được crawl · Trang bộ lọc nào đáng index · Trang "Đang soạn" mỏng nội dung: noindex hay không'],
    ]],
    ['Chapter 3 — Metadata, structured data and social previews', 'Chương 3 — Metadata, structured data và ảnh xem trước khi chia sẻ', 'Nói cho máy tìm kiếm và mạng xã hội biết trang là gì.', [
      ['metadata', 'Titles and meta descriptions that get clicks', 'Tiêu đề và mô tả được bấm', 'Độ dài hiển thị · Mỗi trang một tiêu đề riêng · Google có thể tự viết lại · generateMetadata trong Next.js'],
      ['structured-data', 'Structured data with schema.org and JSON-LD', 'Structured data với schema.org và JSON-LD', 'Course, Article, BreadcrumbList, FAQPage, Organization · Kết quả nhiều định dạng (rich results) · Rich Results Test · Không khai báo thứ không có trên trang'],
      ['og', 'Open Graph and social cards beyond the basics', 'Open Graph và thẻ chia sẻ vượt mức cơ bản', 'Nếu đã học nextjs Ch17.4: thẻ og cơ bản — ở đây đi sâu · Ảnh OG sinh động bằng next/og · Facebook/Zalo cache ảnh xem trước và cách làm mới · Kiểm bằng công cụ debug của từng nền tảng'],
    ]],
    ['Chapter 4 — Performance and Core Web Vitals in the field', 'Chương 4 — Hiệu năng và Core Web Vitals ngoài thực địa', 'Đo từ người dùng thật, không chỉ từ máy mình.', [
      ['cwv', 'LCP, INP and CLS explained with real traces', 'LCP, INP và CLS giải thích bằng trace thật', 'Nếu đã học nextjs Ch17.5/Ch18 — ở đây đọc Performance panel · Ngưỡng tốt/cần cải thiện/kém · Phân vị 75'],
      ['lab-field', 'Lab vs field data: Lighthouse, CrUX, RUM', 'Dữ liệu phòng thí nghiệm và thực địa: Lighthouse, CrUX, RUM', 'Lighthouse điểm 100 mà người dùng vẫn chậm · CrUX và PageSpeed Insights · Thư viện web-vitals gửi số đo về server của mình'],
      ['sua-lcp-cls', 'Fixing LCP and CLS', 'Sửa LCP và CLS', 'Ảnh LCP ưu tiên tải, không lazy · TTFB qua Cloudflare/nginx · Kích thước ảnh/quảng cáo/embed cố định · Font không nhảy'],
      ['sua-inp', 'Fixing INP: long tasks and hydration cost', 'Sửa INP: tác vụ dài và chi phí hydration', 'Chia nhỏ tác vụ · Bớt JavaScript phía client · Phản hồi ngay rồi làm việc nặng sau · Trỏ react Ch11–12'],
      ['cache-cdn', 'Caching and CDN for SEO speed', 'Cache và CDN cho tốc độ SEO', 'Cache HTML tĩnh ở biên · Bài học thật: header cache bị nginx ghi đè nên chưa từng có hiệu lực · Kiểm bằng curl -I · Trỏ networking-for-developers Ch8'],
    ]],
    ['Chapter 5 — Google Search Console', 'Chương 5 — Google Search Console', 'Bảng điều khiển của Google cho website của bạn.', [
      ['hieu-suat', 'Performance report: queries, pages, CTR, position', 'Báo cáo hiệu suất: truy vấn, trang, CTR, vị trí', 'Lọc theo truy vấn và trang · Tìm trang có hiển thị cao mà CTR thấp · So sánh giai đoạn'],
      ['index-coverage', 'Page indexing report and URL Inspection', 'Báo cáo lập chỉ mục trang và công cụ kiểm tra URL', 'Đã crawl nhưng chưa index · Trùng lặp, Google chọn canonical khác · Yêu cầu lập chỉ mục'],
      ['sitemap-cwv', 'Sitemaps, Core Web Vitals and enhancement reports', 'Sitemap, Core Web Vitals và báo cáo cải tiến', 'Gửi sitemap · Nhóm URL kém · Lỗi structured data'],
      ['api-xuat', 'Search Console API and exporting data', 'API Search Console và xuất dữ liệu', 'Vượt giới hạn 1.000 dòng của giao diện · Xuất định kỳ vào PostgreSQL/ClickHouse (trỏ data-engineering) · Theo dõi xu hướng dài'],
    ]],
    ['Chapter 6 — Measurement plans and GA4', 'Chương 6 — Kế hoạch đo lường và GA4', 'Đo đúng thứ cần đo.', [
      ['ke-hoach', 'A measurement plan before any tag', 'Kế hoạch đo lường trước khi gắn tag', 'Mục tiêu → câu hỏi → chỉ số → sự kiện · Tên sự kiện nhất quán · Không đo mọi thứ'],
      ['ga4', 'GA4: data model, events and parameters', 'GA4: mô hình dữ liệu, sự kiện và tham số', 'Mọi thứ là sự kiện · Sự kiện tự động vs đề xuất vs tuỳ chỉnh · Key events (chuyển đổi) · DebugView'],
      ['gtm', 'Google Tag Manager and server-side tagging', 'Google Tag Manager và gắn tag phía server', 'Trigger, variable, data layer · Gắn tag trong Next.js App Router (điều hướng phía client) · Server-side GTM nhập môn'],
      ['bao-cao', 'Reports, explorations and BigQuery export', 'Báo cáo, khám phá và xuất sang BigQuery', 'Funnel exploration · Lấy mẫu dữ liệu và ngưỡng · Xuất dữ liệu thô'],
    ]],
    ['Chapter 7 — Privacy-friendly analytics', 'Chương 7 — Analytics tôn trọng quyền riêng tư', 'Đo đủ để quyết định, không theo dõi người dùng.', [
      ['quyen-rieng-tu', 'Cookies, consent and the law, from a developer’s view', 'Cookie, sự đồng ý và pháp luật, nhìn từ lập trình viên', 'Banner đồng ý chặn tag thật sự (không chỉ để trang trí) · Consent Mode · Trỏ privacy-data-law cho GDPR và Nghị định 13/2023'],
      ['plausible-umami', 'Plausible and Umami: cookieless analytics, self-hosted', 'Plausible và Umami: analytics không cookie, tự host', 'Dựng bằng Docker sau nginx/Cloudflare · Sự kiện tuỳ chỉnh · So sánh với GA4: ít dữ liệu hơn, ít rủi ro hơn'],
      ['chan-quang-cao', 'Ad blockers, bots and data accuracy', 'Trình chặn quảng cáo, bot và độ chính xác dữ liệu', 'Bao nhiêu phần trăm bị chặn · Proxy qua tên miền của mình và giới hạn đạo đức · Lọc bot · Đối chiếu với log server'],
      ['log-server', 'Server-side analytics from your own logs and database', 'Analytics phía server từ log và CSDL của chính mình', 'Log nginx/Cloudflare · Sự kiện ghi từ backend (đăng ký, nâng cấp Pro) — đáng tin nhất · Ghép với dữ liệu hành vi'],
    ]],
    ['Chapter 8 — Funnels, cohorts and experiments', 'Chương 8 — Phễu, cohort và thử nghiệm', 'Từ số liệu tới quyết định.', [
      ['pheu', 'Funnels and drop-off analysis', 'Phễu và phân tích rơi rụng', 'Phễu đăng ký → học bài đầu → hoàn thành chương → Pro · Tìm bước rơi nhiều nhất · Phân đoạn theo nguồn'],
      ['cohort', 'Cohorts, retention and UTM attribution', 'Cohort, giữ chân và gán nguồn bằng UTM', 'Bảng cohort theo tuần · UTM chuẩn hoá · Gán nguồn chạm đầu vs chạm cuối và giới hạn'],
      ['ab-test', 'A/B testing without fooling yourself', 'A/B test mà không tự lừa mình', 'Giả thuyết trước · Cỡ mẫu và độ mạnh thống kê · Nhìn trộm kết quả sớm · Website ít truy cập: thay A/B bằng gì'],
      ['feature-flag', 'Feature flags and experiments in Next.js', 'Feature flag và thử nghiệm trong Next.js', 'Chia nhóm ổn định theo người dùng · Middleware · Không làm hỏng SEO và cache khi thử nghiệm'],
    ]],
    ['Chapter 9 — Content SEO and links', 'Chương 9 — SEO nội dung và liên kết', 'Viết thứ người ta tìm, và thứ đáng được liên kết tới.', [
      ['tu-khoa', 'Keyword and intent research', 'Nghiên cứu từ khoá và ý định tìm kiếm', 'Thông tin, điều hướng, giao dịch · Truy vấn tiếng Việt có dấu và không dấu · Search Console làm nguồn từ khoá miễn phí'],
      ['noi-dung', 'Writing helpful content: E-E-A-T without the myths', 'Viết nội dung hữu ích: E-E-A-T không huyền thoại', 'Nội dung giải đúng câu hỏi · Kinh nghiệm thật (sự cố thật, số đo thật) · Cập nhật nội dung cũ · Nội dung AI hàng loạt và chính sách spam của Google'],
      ['lien-ket-noi', 'Internal linking and site structure', 'Liên kết nội bộ và cấu trúc trang', 'Trang chủ đề và trang con · Breadcrumb · Liên kết giữa các khoá học liên quan'],
      ['backlink', 'Earning links and avoiding spam tactics', 'Có được backlink và tránh chiêu spam', 'Viết thứ đáng trích dẫn, dự án mã nguồn mở · Mua link và hình phạt thủ công · Disavow chỉ khi thật cần'],
      ['seo-dia-phuong', 'Local, video and AI-driven search surfaces', 'Tìm kiếm địa phương, video và các bề mặt tìm kiếm có AI', 'Google Business Profile · Video YouTube trong kết quả (trỏ content-creator) · Câu trả lời do AI tổng hợp và cách nội dung được trích nguồn (thay đổi nhanh — kiểm tài liệu Google mới nhất)'],
    ]],
    ['Chapter 10 — SEO operations and migrations', 'Chương 10 — Vận hành SEO và di chuyển website', 'Giữ thứ hạng khi thay đổi lớn.', [
      ['kiem-tra-tu-dong', 'Automated SEO checks in CI', 'Kiểm SEO tự động trong CI', 'Chặn deploy khi có noindex nhầm, thiếu title, canonical sai · Crawl staging · Lighthouse CI · Trỏ github-actions'],
      ['migration', 'Site migrations: domains, URL structures, frameworks', 'Di chuyển website: tên miền, cấu trúc URL, framework', 'Bản đồ redirect 1-1 · Giữ sitemap cũ một thời gian · Theo dõi Search Console sau chuyển · Sai lầm hay gặp'],
      ['giam-sat', 'Monitoring traffic drops and diagnosing them', 'Theo dõi và chẩn đoán tụt lượt truy cập', 'Tụt do cập nhật thuật toán, lỗi kỹ thuật hay mùa vụ · Kiểm theo thứ tự: tracking hỏng → index → xếp hạng · Cảnh báo tự động'],
    ]],
    ['Chapter 11 — Capstone: audit and fix SEO + analytics for cuongthai.com', 'Chương 11 — Dự án cuối khoá: audit và sửa SEO + analytics cho cuongthai.com', 'Next.js App Router + Express + PostgreSQL + Cloudflare + nginx trên VPS — website thật với hàng nghìn trang khoá học.', [
      ['audit', 'Full technical SEO audit', 'Audit SEO kỹ thuật toàn diện', 'Crawl toàn site · Search Console · Danh sách lỗi có ưu tiên: index, canonical, soft 404, trang song ngữ, trang "Đang soạn"'],
      ['sua', 'Fix: metadata, sitemaps, structured data, performance', 'Sửa: metadata, sitemap, structured data, hiệu năng', 'Course/BreadcrumbList JSON-LD · Sitemap index · Cache ở biên · LCP/INP ngoài thực địa'],
      ['analytics', 'Measurement plan and privacy-friendly analytics', 'Kế hoạch đo lường và analytics tôn trọng quyền riêng tư', 'Umami tự host · Sự kiện đăng ký, bắt đầu học, hoàn thành bài, nâng cấp Pro · Dashboard phễu'],
      ['bao-cao', 'Report results after 4–8 weeks', 'Báo cáo kết quả sau 4–8 tuần', 'So số trang được index, hiển thị, CTR, CWV trước/sau · Viết báo cáo một trang'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án SEO/analytics trong phỏng vấn'],
    ]],
  ]),
};

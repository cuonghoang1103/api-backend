import type { Metadata } from 'next';
import { getServerApiBaseUrl } from '@/lib/server-api';

/**
 * Thẻ SEO cho MỘT bài tập Code Lab.
 *
 * ─── VÌ SAO FILE NÀY TỒN TẠI (23/08/2026) ────────────────────────────────────
 * `page.tsx` cạnh đây là client component ('use client'), nên nó KHÔNG export
 * `metadata` được. Trước file này, cả ~12.500 trang bài tập cùng thừa metadata
 * của layout gốc — nghĩa là mọi bài đều mang đúng một tiêu đề:
 *
 *     "CuongThai — Portfolio, Academy & E-commerce with AI"
 *
 * Đó là lý do đưa chúng vào sitemap trước đây sẽ phản tác dụng: Google nhận
 * 12.500 URL trùng tiêu đề, trùng mô tả, không có canonical riêng — dấu hiệu
 * kinh điển của trang rác, và nó sẽ gộp hoặc bỏ qua gần hết. Có tiêu đề riêng
 * TRƯỚC, rồi mới nộp sitemap; ngược lại là tự làm hỏng.
 *
 * Cùng khuôn với `../layout.tsx` (metadata cho track), kể cả phần og:url —
 * thiếu nó thì mọi link chia sẻ qua Messenger đều mở về trang chủ.
 *
 * ⚠️ Gọi `/meta`, KHÔNG gọi `/exercises/:slug`. Endpoint by-slug tăng
 * viewCount, mà trang này đã tự gọi nó ở client rồi — dùng chung là mỗi lượt
 * xem đếm thành hai, và Googlebot bò hết 12.500 bài sẽ thổi cột Views thành
 * số vô nghĩa.
 */
const SITE_URL = 'https://cuongthai.com';

type ExerciseMeta = {
  title?: string;
  difficulty?: string;
  language?: string;
  problemHtml?: string | null;
  track?: { name?: string } | null;
  module?: { name?: string } | null;
};

/** HTML → một câu mô tả phẳng. Cắt ở ranh giới TỪ để không đứt giữa chữ. */
function toDescription(html: string | null | undefined, max = 155): string {
  const text = (html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ trackSlug: string; exerciseSlug: string }> },
): Promise<Metadata> {
  const { trackSlug, exerciseSlug } = await params;
  const url = `${SITE_URL}/code-lab/${trackSlug}/${exerciseSlug}`;

  // Bản lùi: tra cứu hỏng thì tiêu đề vẫn phải KHÁC NHAU giữa các bài, nên lấy
  // slug ra dùng. Một tiêu đề chung cho cả 12.500 trang chính là thứ file này
  // sinh ra để chấm dứt.
  let title = `${exerciseSlug} — Code Lab`;
  let description =
    'Bài tập lập trình có đề bài, ví dụ vào/ra, gợi ý theo bước và lời giải trên CuongThai Code Lab.';

  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/code-lab/exercises/${encodeURIComponent(exerciseSlug)}/meta`,
      { headers: { accept: 'application/json' }, next: { revalidate: 300 } },
    );
    if (res.ok) {
      const json = await res.json();
      const ex = (json?.data ?? json) as ExerciseMeta;
      if (ex?.title) {
        const trackName = ex.track?.name;
        title = trackName ? `${ex.title} — ${trackName}` : `${ex.title} — Code Lab`;
        description =
          toDescription(ex.problemHtml) ||
          // Không có đề bài dạng HTML thì dựng một câu từ metadata — vẫn riêng
          // cho từng bài, vẫn hơn câu chung ở trên.
          [ex.module?.name, trackName, ex.language, ex.difficulty]
            .filter(Boolean)
            .join(' · ') ||
          description;
      }
    }
  } catch {
    // Backend chưa lên (lúc `npm run build`) hoặc mạng chớp — giữ bản lùi.
    // og:url/canonical vẫn đúng, đó mới là phần không được sai.
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { url, title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function ExerciseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

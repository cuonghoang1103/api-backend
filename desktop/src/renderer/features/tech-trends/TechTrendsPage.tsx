/**
 * Tech Trends — đọc bài đã cache khi ngoại tuyến.
 *
 * Đối chiếu `src/routes/techTrends.routes.ts` (mount `/api/v1/tech-trends`,
 * src/index.ts:517):
 *   GET /articles            — danh sách
 *   GET /articles/:id        — chi tiết
 *
 * Mở một bài = cache bài đó. Lần sau mất mạng vẫn đọc được. Đây là mô hình đúng
 * cho nội dung đọc: cache theo thứ người dùng ĐÃ MỞ, không tải trước cả kho —
 * tải trước là ngốn đĩa và băng thông cho thứ có thể chẳng ai đọc.
 *
 * Tính năng AI (TL;DR, hỏi đáp, giải thích code) KHÔNG có ở màn hình này. Chúng
 * cần Pro và cần mạng; đặt nút vào đây rồi báo lỗi khi bấm là hứa hão. Có mạng
 * thì mở trên web, nơi chúng đã chạy tốt.
 */
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CloudOff, ExternalLink, RefreshCw } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, readCache, swr } from '../../offline/cache';

interface ArticleSummary {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  category?: { name?: string } | null;
}

interface ArticleDetail extends ArticleSummary {
  content?: string | null;
  contentHtml?: string | null;
}

/** Backend có thể trả mảng trần hoặc bọc trong `{ items, total }`. */
function asList(payload: unknown): ArticleSummary[] {
  if (Array.isArray(payload)) return payload as ArticleSummary[];
  const wrapped = payload as { items?: unknown; articles?: unknown; data?: unknown };
  for (const candidate of [wrapped.items, wrapped.articles, wrapped.data]) {
    if (Array.isArray(candidate)) return candidate as ArticleSummary[];
  }
  return [];
}

export function TechTrendsPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  /** Id các bài đã có bản cache — để đánh dấu "đọc được offline". */
  const [cachedIds, setCachedIds] = useState<Set<number>>(new Set());

  const loadList = useCallback(async () => {
    if (userId === null || !api) return;
    setLoading(true);
    setListError(null);
    try {
      const result = await swr<unknown>({
        userId,
        key: 'tech-trends:list',
        fetcher: () => api.request('/api/v1/tech-trends/articles?limit=30'),
        online,
        ttlMs: 10 * 60 * 1000,
        onRefreshed: (fresh) => {
          setArticles(asList(fresh));
          setIsStale(false);
        },
      });
      setArticles(asList(result.value));
      setIsStale(result.isStale);
    } catch (caught) {
      setListError(
        caught instanceof OfflineUnavailableError
          ? 'Chưa từng tải danh sách bài về máy nên không xem được khi ngoại tuyến.'
          : caught instanceof Error
            ? caught.message
            : String(caught),
      );
    } finally {
      setLoading(false);
    }
  }, [api, userId, online]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  // Đánh dấu bài nào đã có bản offline. Chạy sau khi có danh sách, và đọc
  // thẳng cache chứ không gọi mạng.
  useEffect(() => {
    if (userId === null || articles.length === 0) return;
    let cancelled = false;
    void (async () => {
      const found = new Set<number>();
      await Promise.all(
        articles.map(async (article) => {
          const hit = await readCache(userId, `tech-trends:article:${article.id}`);
          if (hit) found.add(article.id);
        }),
      );
      if (!cancelled) setCachedIds(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [articles, userId]);

  if (openId !== null) {
    return (
      <ArticleView
        articleId={openId}
        onBack={() => {
          setOpenId(null);
          // Bài vừa đọc giờ đã có cache — cập nhật dấu để danh sách nói đúng.
          setCachedIds((previous) => new Set(previous).add(openId));
        }}
      />
    );
  }

  return (
    <div className="ct-page" style={{ maxWidth: 900 }}>
      <div className="ct-page-head" style={{ marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 19 }}>Tech Trends</h1>
          <p className="ct-muted" style={{ margin: 0 }}>
            Bài đã mở được lưu lại để đọc khi không có mạng.
          </p>
        </div>
        <button
          type="button"
          className="ct-btn ct-btn-ghost"
          onClick={() => void loadList()}
          disabled={!online}
        >
          <RefreshCw size={14} aria-hidden />
          Làm mới
        </button>
      </div>

      {isStale && (
        <div className="ct-notice" data-tone="warn">
          <CloudOff size={15} aria-hidden />
          <span>
            Danh sách là bản đã lưu.
            {online ? ' Đang làm mới…' : ' Sẽ cập nhật khi có mạng.'}
          </span>
        </div>
      )}

      {listError && (
        <div className="ct-empty">
          <CloudOff size={28} aria-hidden className="ct-empty-icon" />
          <h1>Không tải được danh sách</h1>
          <p>{listError}</p>
        </div>
      )}

      {loading && articles.length === 0 && !listError && <p>Đang tải…</p>}

      {articles.length > 0 && (
        <ul className="ct-article-list">
          {articles.map((article) => {
            const readable = cachedIds.has(article.id);
            return (
              <li key={article.id}>
                <button
                  type="button"
                  className="ct-article-card"
                  onClick={() => setOpenId(article.id)}
                  // Mất mạng mà chưa cache thì mở ra chỉ để thấy lỗi — chặn
                  // trước và nói lý do bằng tooltip.
                  disabled={!online && !readable}
                  title={
                    !online && !readable ? 'Chưa tải về máy — cần mạng để đọc' : undefined
                  }
                >
                  <div className="ct-article-title">{article.title}</div>
                  {(article.summary ?? article.excerpt) && (
                    <div className="ct-article-excerpt">
                      {article.summary ?? article.excerpt}
                    </div>
                  )}
                  <div className="ct-article-meta">
                    {article.category?.name && <span>{article.category.name}</span>}
                    {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
                    {readable && <span className="ct-offline-tag">Đọc được offline</span>}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ArticleView({ articleId, onBack }: { articleId: number; onBack: () => void }) {
  const { online } = useAppState();
  const { api, userId } = useSession();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (userId === null || !api) return;
    void (async () => {
      try {
        const result = await swr<ArticleDetail>({
          userId,
          key: `tech-trends:article:${articleId}`,
          fetcher: () => api.request<ArticleDetail>(`/api/v1/tech-trends/articles/${articleId}`),
          online,
          // Bài viết gần như không đổi sau khi đăng — giữ lâu.
          ttlMs: 24 * 60 * 60 * 1000,
          onRefreshed: setArticle,
        });
        setArticle(result.value);
        setIsStale(result.isStale);
      } catch (caught) {
        setError(
          caught instanceof OfflineUnavailableError
            ? 'Bài này chưa được tải về máy nên không đọc được khi ngoại tuyến.'
            : caught instanceof Error
              ? caught.message
              : String(caught),
        );
      }
    })();
  }, [api, userId, articleId, online]);

  return (
    <div className="ct-page" style={{ maxWidth: 760 }}>
      <button type="button" className="ct-back" onClick={onBack}>
        <ArrowLeft size={15} aria-hidden />
        Danh sách bài
      </button>

      {error && (
        <div className="ct-empty">
          <CloudOff size={28} aria-hidden className="ct-empty-icon" />
          <p>{error}</p>
        </div>
      )}

      {article && (
        <article className="ct-panel">
          <h1 style={{ marginBottom: 8 }}>{article.title}</h1>
          <div className="ct-article-meta" style={{ marginBottom: 16 }}>
            {article.category?.name && <span>{article.category.name}</span>}
            {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
          </div>

          {isStale && !online && (
            <div className="ct-notice" data-tone="warn">
              <CloudOff size={15} aria-hidden />
              <span>Bản đã lưu trên máy.</span>
            </div>
          )}

          {/* CỐ Ý không dựng HTML của bài bằng dangerouslySetInnerHTML.
              Nội dung do máy chủ trả về vẫn là dữ liệu không tin tưởng, và
              renderer này chạy cạnh cầu nối IPC — một lỗ XSS ở đây đắt hơn
              nhiều so với trên web. Hiện phần chữ thuần; muốn xem đầy đủ có
              định dạng thì mở trên web. Dựng HTML an toàn cần một bộ lọc
              (DOMPurify) và một vòng rà riêng — làm ở bước sau, không làm vội. */}
          <div className="ct-article-body">{plainText(article)}</div>

          <div className="ct-actions">
            <button
              type="button"
              className="ct-btn ct-btn-ghost"
              onClick={() =>
                void window.cuongthai?.app
                  .getInfo()
                  .then((info) =>
                    window.cuongthai?.app.openExternal(
                      `${info.webOrigin}/tech-trends/${article.slug}`,
                    ),
                  )
              }
            >
              <ExternalLink size={14} aria-hidden />
              Mở bản đầy đủ trên web
            </button>
          </div>
        </article>
      )}

      {!article && !error && <p>Đang tải bài…</p>}
    </div>
  );
}

/** Lấy phần chữ, bỏ thẻ HTML. Không phải bộ lọc bảo mật — chỉ để hiển thị. */
function plainText(article: ArticleDetail): string {
  const raw = article.content ?? article.contentHtml ?? article.summary ?? '';
  return raw
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

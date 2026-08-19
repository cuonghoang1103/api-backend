/**
 * ============================================================
 * BẢNG TIN
 * ============================================================
 *
 * Đối chiếu `src/routes/social.routes.ts` (mount `/api/v1/feed`, src/index.ts:552):
 *   GET  /posts?limit=&cursor=&sort=&following=&type=
 *   GET  /posts/counts             → { POST, VIDEO, FILE, ALL }
 *   POST /posts                    → đăng bài
 *   GET  /trending?limit=          → [{ id, tag, postsCount }]
 *   GET  /suggestions?limit=       → [User]
 *
 * ─── PHÂN TRANG THEO CON TRỎ, KHÔNG PHẢI THEO TRANG ───
 * Dùng số trang thì mỗi bài mới đăng đẩy cả danh sách xuống một nấc, và người
 * đang cuộn sẽ thấy lại đúng bài vừa đọc ở đầu trang sau. Con trỏ neo vào bài
 * cuối nên không bao giờ trùng.
 *
 * ⚠️ CON TRỎ SUY TỪ BÀI CUỐI, không đọc `pagination` được.
 * `ApiClient.unwrap` trả về `envelope.data ?? envelope` (client.ts:191), nên
 * `request()` đưa lại THẲNG mảng bài — `pagination` là anh em của `data` trong
 * phong bì nên rơi mất trên đường. Đo thật: đọc `kq.data` ra `undefined` và
 * bảng tin hiện 0 bài dù máy chủ trả đủ. May là `nextCursor` của máy chủ chính
 * bằng id bài cuối, và "còn nữa" = lấy về đủ `limit`.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp, CloudOff, Flame, ImageOff, RefreshCw, Send, Sparkles, UserPlus, Users,
} from 'lucide-react';

import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { AnhPhongTo } from './AnhPhongTo';
import { Avatar, BaiViet } from './BaiViet';
import { chuanHoa, ten, type Bai, type Media, type TacGia } from './kieu';

const MOI_TRANG = 12;

type Sap = 'recent' | 'popular' | 'following';
type Loai = 'ALL' | 'POST' | 'VIDEO' | 'FILE';

const TAB_SAP: Array<{ id: Sap; ten: string }> = [
  { id: 'recent', ten: 'Mới nhất' },
  { id: 'popular', ten: 'Phổ biến' },
  { id: 'following', ten: 'Đang theo dõi' },
];

const TAB_LOAI: Array<{ id: Loai; ten: string }> = [
  { id: 'ALL', ten: 'Tất cả' },
  { id: 'POST', ten: 'Bài viết' },
  { id: 'VIDEO', ten: 'Video' },
  { id: 'FILE', ten: 'Tệp' },
];

interface TheXuHuong { id: number; tag: string; postsCount: number }

export function FeedPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [bai, datBai] = useState<Bai[]>([]);
  const [conTro, datConTro] = useState<number | null>(null);
  const [conNua, datConNua] = useState(false);
  const [dangTai, datDangTai] = useState(true);
  const [dangThem, datDangThem] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [soan, datSoan] = useState('');
  const [dangDang, datDangDang] = useState(false);

  const [sap, datSap] = useState<Sap>('recent');
  const [loai, datLoai] = useState<Loai>('ALL');
  const [dem, datDem] = useState<Partial<Record<Loai, number>>>({});
  const [xuHuong, datXuHuong] = useState<TheXuHuong[]>([]);
  const [goiY, datGoiY] = useState<TacGia[]>([]);
  const [coBaiMoi, datCoBaiMoi] = useState(false);

  const [xemAnh, datXemAnh] = useState<{ ds: Media[]; i: number } | null>(null);

  const dayRef = useRef<HTMLDivElement | null>(null);
  const dinhRef = useRef<HTMLDivElement | null>(null);

  /** Chuỗi truy vấn của tab đang chọn. Một chỗ duy nhất để cả nạp lẫn tải thêm dùng. */
  const locQuery = useMemo(() => {
    const p = new URLSearchParams({ limit: String(MOI_TRANG) });
    if (sap === 'popular') p.set('sort', 'popular');
    if (sap === 'following') p.set('following', 'true');
    if (loai !== 'ALL') p.set('type', loai);
    return p.toString();
  }, [sap, loai]);

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    datLoi(null);
    datCoBaiMoi(false);
    try {
      const nhan = (ds: Bai[]) => {
        datBai(ds.map(chuanHoa));
        datConTro(ds.length ? (ds[ds.length - 1]!.id) : null);
        datConNua(ds.length >= MOI_TRANG);
      };
      const kq = await swr<Bai[]>({
        userId,
        // Khoá kèm bộ lọc: dùng chung một khoá cho mọi tab thì bộ nhớ đệm của
        // tab "Phổ biến" sẽ hiện ra khi mở tab "Mới nhất", và ngược lại.
        key: `feed:posts:${locQuery}`,
        fetcher: () => api.request(`/api/v1/feed/posts?${locQuery}`),
        online,
        ttlMs: 2 * 60_000,
        onRefreshed: (v) => nhan(v ?? []),
      });
      nhan(kq.value ?? []);
    } catch (e) {
      datLoi(e instanceof OfflineUnavailableError
        ? 'Chưa từng tải bảng tin nên không xem được khi ngoại tuyến.'
        : e instanceof Error ? e.message : String(e));
    } finally {
      datDangTai(false);
    }
  }, [api, userId, online, locQuery]);

  useEffect(() => { datDangTai(true); void nap(); }, [nap]);

  /* Cột phải: xu hướng + gợi ý kết bạn. Hỏng thì IM LẶNG bỏ qua — đây là phần
     phụ, một lỗi ở đây không được phép làm hỏng cả bảng tin. */
  useEffect(() => {
    if (!api) return;
    void api.request<TheXuHuong[]>('/api/v1/feed/trending?limit=8')
      .then((r) => datXuHuong(Array.isArray(r) ? r : [])).catch(() => {});
    void api.request<TacGia[]>('/api/v1/feed/suggestions?limit=4')
      .then((r) => datGoiY(Array.isArray(r) ? r : [])).catch(() => {});
  }, [api]);

  const napDem = useCallback(async () => {
    if (!api) return;
    try {
      const r = await api.request<Record<string, number>>('/api/v1/feed/posts/counts');
      if (r && typeof r === 'object') datDem(r as Partial<Record<Loai, number>>);
    } catch { /* số đếm chỉ là huy hiệu, thiếu cũng không sao */ }
  }, [api]);

  useEffect(() => { void napDem(); }, [napDem]);

  /**
   * Có bài mới không? Hỏi nhẹ mỗi 60 giây, chỉ so id bài đầu.
   *
   * ⚠️ KHÔNG tự chèn bài mới vào đầu danh sách. Người dùng đang đọc dở mà nội
   * dung nhảy xuống là kiểu khó chịu nhất của bảng tin — hiện một dải "có bài
   * mới" để HỌ quyết định lúc nào tải.
   */
  useEffect(() => {
    if (!api || !online || sap !== 'recent' || loai !== 'ALL') return;
    const id = setInterval(() => {
      void api.request<Bai[]>('/api/v1/feed/posts?limit=1')
        .then((r) => {
          const dau = Array.isArray(r) ? r[0] : null;
          if (dau && bai[0] && dau.id > bai[0].id) datCoBaiMoi(true);
        })
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(id);
  }, [api, online, sap, loai, bai]);

  const themTrang = useCallback(async () => {
    if (!api || !conNua || conTro === null || dangThem) return;
    datDangThem(true);
    try {
      const ds = await api.request<Bai[]>(`/api/v1/feed/posts?${locQuery}&cursor=${conTro}`) ?? [];
      // Lọc trùng theo id: máy chủ có thể trả lại một bài đã có nếu ai đó vừa
      // đăng bài mới ngay lúc cuộn, và React sẽ than key trùng.
      datBai((c) => {
        const daCo = new Set(c.map((b) => b.id));
        return [...c, ...ds.filter((b) => !daCo.has(b.id)).map(chuanHoa)];
      });
      datConTro(ds.length ? (ds[ds.length - 1]!.id) : null);
      datConNua(ds.length >= MOI_TRANG);
    } catch (e) {
      datLoi(e instanceof Error ? e.message : String(e));
    } finally {
      datDangThem(false);
    }
  }, [api, conNua, conTro, dangThem, locQuery]);

  /**
   * Cuộn vô hạn.
   *
   * ⚠️ `rootMargin` dương để nạp TRƯỚC khi người dùng chạm đáy — chờ tới lúc
   * thấy đáy mới gọi thì luôn có một khoảng trắng và một vòng quay. 600px là
   * khoảng hai màn hình bài ở cỡ chữ mặc định.
   */
  useEffect(() => {
    const o = dayRef.current;
    if (!o || !conNua) return;
    const theo = new IntersectionObserver(
      (muc) => { if (muc[0]?.isIntersecting) void themTrang(); },
      { rootMargin: '600px' },
    );
    theo.observe(o);
    return () => theo.disconnect();
  }, [conNua, themTrang]);

  const dang = async () => {
    const chu = soan.trim();
    if (!chu || !api || dangDang) return;
    datDangDang(true);
    try {
      await api.request('/api/v1/feed/posts', {
        method: 'POST',
        // ⚠️ KHÔNG `JSON.stringify` — `api.request` tự tuần tự hoá `body`.
        // Đưa vào chuỗi đã stringify là mã hoá hai lần và máy chủ trả 400.
        body: { content: chu, visibility: 'PUBLIC' },
      });
      datSoan('');
      await nap();
      void napDem();
    } catch (e) {
      datLoi(e instanceof Error ? e.message : String(e));
    } finally {
      datDangDang(false);
    }
  };

  /** Thay một bài tại chỗ. Thẻ bài tự tính trạng thái mới rồi đưa lại cả bài. */
  const doiBai = useCallback((moi: Bai) => {
    datBai((c) => c.map((x) => (x.id === moi.id ? moi : x)));
  }, []);

  const xoaBai = useCallback((id: number) => {
    datBai((c) => c.filter((x) => x.id !== id));
  }, []);

  const lenDau = () => {
    dinhRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void nap();
  };

  return (
    <div className="ct-page ct-bt">
      <div ref={dinhRef} />

      <div className="ct-bt-khung">
        {/* ══ Cột giữa ══ */}
        <div className="ct-bt-giua">
          <div className="ct-page-head" style={{ marginBottom: 14 }}>
            <div>
              <h1>Bảng tin</h1>
              <p className="ct-muted" style={{ margin: 0 }}>Bài mới từ cuongthai.com</p>
            </div>
            <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()} disabled={dangTai}>
              <RefreshCw size={14} aria-hidden className={dangTai ? 'ct-spin' : undefined} /> Làm mới
            </button>
          </div>

          {/* ── Soạn bài ── */}
          <div className="ct-bt-soan">
            <div className="ct-bt-soan-tren">
              <Avatar t={null} />
              <textarea
                value={soan}
                placeholder="Bạn đang nghĩ gì?"
                rows={soan ? 3 : 1}
                maxLength={5000}
                onChange={(e) => datSoan(e.target.value)}
              />
            </div>
            <div className="ct-bt-soan-chan">
              {/* Đăng KÈM ẢNH chưa làm ở app — nói thẳng thay vì để một nút ảnh
                  bấm vào không có gì xảy ra. */}
              <span className="ct-muted" style={{ fontSize: 11 }}>
                Đăng kèm ảnh/video thì mở trên web
              </span>
              <button type="button" className="ct-btn" onClick={() => void dang()} disabled={!soan.trim() || dangDang}>
                <Send size={14} aria-hidden /> Đăng
              </button>
            </div>
          </div>

          {/* ── Tab lọc ── */}
          <div className="ct-bt-tab">
            <div className="ct-bt-tab-hang" role="tablist" aria-label="Sắp xếp">
              {TAB_SAP.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={sap === t.id}
                  data-bat={sap === t.id}
                  onClick={() => datSap(t.id)}
                >
                  {t.id === 'popular' && <Flame size={13} aria-hidden />}
                  {t.id === 'following' && <Users size={13} aria-hidden />}
                  {t.ten}
                </button>
              ))}
            </div>
            <div className="ct-bt-tab-hang" data-phu="true" role="tablist" aria-label="Loại nội dung">
              {TAB_LOAI.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={loai === t.id}
                  data-bat={loai === t.id}
                  onClick={() => datLoai(t.id)}
                >
                  {t.ten}
                  {dem[t.id] ? <em>{dem[t.id]}</em> : null}
                </button>
              ))}
            </div>
          </div>

          {coBaiMoi && (
            <button type="button" className="ct-bt-baimoi" onClick={lenDau}>
              <ArrowUp size={14} aria-hidden /> Có bài mới — bấm để xem
            </button>
          )}

          {loi && (
            <div className="ct-notice" data-tone="warn" style={{ marginBottom: 12 }}>
              <CloudOff size={15} aria-hidden />
              <span>{loi}</span>
            </div>
          )}

          {dangTai && bai.length === 0 && <KhungCho />}

          {!dangTai && bai.length === 0 && !loi && (
            <div className="ct-empty">
              <ImageOff size={28} aria-hidden className="ct-empty-icon" />
              <p>
                {sap === 'following'
                  ? 'Bạn chưa theo dõi ai, hoặc họ chưa đăng gì.'
                  : 'Chưa có bài nào.'}
              </p>
            </div>
          )}

          <div className="ct-bt-ds">
            {bai.map((b) => (
              <BaiViet
                key={b.id}
                bai={b}
                onDoi={doiBai}
                onXoa={xoaBai}
                onXemAnh={(ds, i) => datXemAnh({ ds, i })}
              />
            ))}
          </div>

          {/* Mốc cho cuộn vô hạn. Vẫn giữ một nút thật bên dưới: bộ theo dõi
              giao cắt không chạy khi cửa sổ bị thu nhỏ tới mức không cuộn được,
              và lúc đó không có nút thì không còn đường nào tải tiếp. */}
          <div ref={dayRef} aria-hidden />
          {conNua && (
            <button type="button" className="ct-btn ct-btn-ghost ct-bt-them"
              onClick={() => void themTrang()} disabled={dangThem}>
              {dangThem ? 'Đang tải…' : 'Tải thêm bài'}
            </button>
          )}
        </div>

        {/* ══ Cột phải ══ */}
        <aside className="ct-bt-phai">
          {xuHuong.length > 0 && (
            <section className="ct-bt-the">
              <h2><Flame size={14} aria-hidden /> Xu hướng hôm nay</h2>
              <ul>
                {xuHuong.map((x) => (
                  <li key={x.id}>
                    <span className="ct-bt-the-tag">#{x.tag}</span>
                    <em>{x.postsCount} bài</em>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {goiY.length > 0 && (
            <section className="ct-bt-the">
              <h2><Sparkles size={14} aria-hidden /> Gợi ý theo dõi</h2>
              <ul>
                {goiY.map((u) => (
                  <li key={u.id} className="ct-bt-the-nguoi">
                    <Avatar t={u} nho />
                    <span>
                      <strong>{ten(u)}</strong>
                      <em>@{u.username}</em>
                    </span>
                    <UserPlus size={14} aria-hidden />
                  </li>
                ))}
              </ul>
              <p className="ct-bt-the-chan">Theo dõi và nhắn tin thì mở trên web</p>
            </section>
          )}
        </aside>
      </div>

      {xemAnh && (
        <AnhPhongTo
          media={xemAnh.ds}
          chiSo={xemAnh.i}
          onDoiChiSo={(i) => datXemAnh((c) => (c ? { ...c, i } : c))}
          onDong={() => datXemAnh(null)}
        />
      )}
    </div>
  );
}

/**
 * Khung xám lúc đang tải.
 *
 * Thay cho dòng chữ "Đang tải bảng tin…". Khung có HÌNH DÁNG của thứ sắp hiện
 * ra nên mắt đã biết trước bố cục, và trang không nhảy một nhịp khi bài về.
 */
function KhungCho() {
  return (
    <div className="ct-bt-ds" aria-hidden>
      {[0, 1, 2].map((i) => (
        <article key={i} className="ct-bt-bai ct-bt-cho">
          <header className="ct-bt-dau">
            <span className="ct-bt-cho-o" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <div className="ct-bt-dau-chu">
              <span className="ct-bt-cho-o" style={{ width: 130, height: 12 }} />
              <span className="ct-bt-cho-o" style={{ width: 80, height: 10, marginTop: 6 }} />
            </div>
          </header>
          <span className="ct-bt-cho-o" style={{ width: '100%', height: 12, marginTop: 12 }} />
          <span className="ct-bt-cho-o" style={{ width: '88%', height: 12, marginTop: 8 }} />
          <span className="ct-bt-cho-o" style={{ width: '62%', height: 12, marginTop: 8 }} />
        </article>
      ))}
    </div>
  );
}

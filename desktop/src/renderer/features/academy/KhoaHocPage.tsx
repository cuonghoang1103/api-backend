/**
 * Khoá học — các khoá TỰ SOẠN, khác với Học viện (chương trình FPTU).
 *
 * Đối chiếu API (đo thật 20/08/2026): `GET /api/v1/courses` trả **5 khoá**,
 * tất cả `academyType: GENERAL` — PostgreSQL, TypeScript, Nền tảng Lập trình
 * Web, Next.js & React… Còn môn FPTU đi qua `/courses/semester/:id` và thuộc
 * trang Học viện. Hai trang, hai nguồn, cùng một trang chi tiết.
 *
 * ─── Vì sao dùng lại `monHoc.tsx` ───
 * Từ lúc bấm vào một khoá trở đi thì hai trang giống hệt: cùng endpoint
 * `/courses/:slug`, cùng mục/bài, cùng trình đọc. Chép sang bản thứ hai thì
 * mọi bản vá phải làm hai lần, và lần quên đầu tiên không ai thấy — cả hai
 * trang vẫn chạy, chỉ khác nhau.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CloudOff, ExternalLink, Library, RefreshCw, Search, X } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { chuVi, fold, moNgoai, WEB } from '../chu';
import { ChiTietMon, TheMon, type Mon } from './monHoc';

/** Backend trả mảng trần; chấp cả dạng bọc để không vỡ nếu nó đổi. */
function docDs(p: unknown): Mon[] {
  if (Array.isArray(p)) return p as Mon[];
  const w = p as { items?: unknown; courses?: unknown; data?: unknown };
  for (const x of [w?.items, w?.courses, w?.data]) if (Array.isArray(x)) return x as Mon[];
  return [];
}

export function KhoaHocPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [ds, setDs] = useState<Mon[]>([]);
  const [tim, setTim] = useState('');
  const [dangTai, setDangTai] = useState(true);
  const [cu, setCu] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moSlug, setMoSlug] = useState<string | null>(null);

  const nap = useCallback(async () => {
    if (userId === null || !api) return;
    setDangTai(true);
    setLoi(null);
    try {
      const kq = await swr<unknown>({
        userId,
        key: 'khoahoc:ds',
        /* `limit=100` chứ không để mặc định: mặc định của backend là một trang
           nhỏ, và một trang khoá học bị cắt ngầm thì người dùng không bao giờ
           biết là còn khoá khác. */
        fetcher: () => api.request('/api/v1/courses?limit=100'),
        online,
        ttlMs: 30 * 60 * 1000,
        onRefreshed: (moi) => { setDs(docDs(moi)); setCu(false); },
      });
      setDs(docDs(kq.value));
      setCu(kq.isStale);
    } catch (e) {
      setLoi(
        e instanceof OfflineUnavailableError
          ? 'Chưa từng tải danh sách khoá học về máy nên không xem được khi ngoại tuyến.'
          : e instanceof Error ? e.message : String(e),
      );
    } finally {
      setDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  const ketQua = useMemo(() => {
    const q = fold(tim.trim());
    if (!q) return ds;
    return ds.filter((m) => fold(
      `${chuVi(m.title)} ${chuVi(m.shortDescription)} ${m.courseCode ?? ''}`,
    ).includes(q));
  }, [ds, tim]);

  if (moSlug) return <ChiTietMon slug={moSlug} onQuayLai={() => setMoSlug(null)} nhanQuayLai="Khoá học" />;

  const tongBai = ds.reduce((n, m) => n + (m.totalLessons ?? 0), 0);

  return (
    <div className="ct-page ct-hv">
      <header className="ct-hv-dau">
        <div>
          <h1><Library size={20} aria-hidden /> Khoá học</h1>
          <p className="ct-muted">
            {ds.length > 0
              ? `${ds.length} khoá · ${tongBai} bài — soạn riêng, học theo thứ tự`
              : 'Các khoá học tự soạn của cuongthai.com'}
          </p>
        </div>
        <div className="ct-hv-dau-nut">
          {cu && <span className="ct-gn-cu"><CloudOff size={13} aria-hidden /> bản đã lưu</span>}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>
            <RefreshCw size={14} aria-hidden /> Tải lại
          </button>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/courses`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      <label className="ct-music-search ct-hv-tim">
        <Search size={14} aria-hidden />
        <input
          value={tim}
          onChange={(e) => setTim(e.target.value)}
          placeholder="Tìm khoá học…"
          aria-label="Tìm khoá học"
        />
        {tim && (
          <button type="button" className="ct-linklike" onClick={() => setTim('')} aria-label="Xoá tìm kiếm">
            <X size={13} aria-hidden />
          </button>
        )}
      </label>

      {loi ? (
        <div className="ct-empty">
          <CloudOff size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>Thử lại</button>
        </div>
      ) : dangTai && ds.length === 0 ? (
        <p className="ct-muted">Đang tải…</p>
      ) : ketQua.length === 0 ? (
        <div className="ct-empty">
          <Library size={26} aria-hidden className="ct-empty-icon" />
          <p>{tim.trim() ? `Không khoá nào khớp “${tim.trim()}”.` : 'Chưa có khoá học nào được đăng.'}</p>
        </div>
      ) : (
        <div className="ct-hv-luoi ct-kh-luoi">
          {ketQua.map((m) => <TheMon key={m.id} mon={m} onMo={() => setMoSlug(m.slug)} />)}
        </div>
      )}
    </div>
  );
}

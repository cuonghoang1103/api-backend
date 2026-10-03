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
import { chuVi, fold, moNgoai, NHAN_BAC, WEB } from '../chu';
import { ChiTietMon, TheMon, type Mon } from './monHoc';
import { useDich } from '../../i18n';

/** Backend trả mảng trần; chấp cả dạng bọc để không vỡ nếu nó đổi. */
function docDs(p: unknown): Mon[] {
  if (Array.isArray(p)) return p as Mon[];
  const w = p as { items?: unknown; courses?: unknown; data?: unknown };
  for (const x of [w?.items, w?.courses, w?.data]) if (Array.isArray(x)) return x as Mon[];
  return [];
}

export function KhoaHocPage() {
  const { dich } = useDich();
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [ds, setDs] = useState<Mon[]>([]);
  const [tim, setTim] = useState('');
  /** Lọc như trang /courses của web: danh mục + cấp độ, kèm cách xếp. */
  const [danhMuc, setDanhMuc] = useState<string>('');
  const [capDo, setCapDo] = useState<string>('');
  const [xep, setXep] = useState<'moi' | 'nhieu' | 'az'>('moi');
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
        key: 'khoahoc:ds-tatca',
        /* ⚠️ Tham số cỡ trang của backend tên là `size`, KHÔNG phải `limit`.
           Bản trước gửi `limit=100` ⇒ backend bỏ qua, trả trang mặc định 12 khoá
           — đo thật 04/10/2026: app hiện 12/74 khoá, cắt ngầm, không ai biết còn
           62 khoá khác. `gon=1`: chỉ trường của danh sách, không kéo cây bài. */
        fetcher: () => api.request('/api/v1/courses?size=200&gon=1'),
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

  /** Danh mục có trong dữ liệu THẬT, đếm sẵn — không chép tay danh sách. */
  const cacDanhMuc = useMemo(() => {
    const dem = new Map<string, number>();
    for (const m of ds) if (m.categoryName) dem.set(m.categoryName, (dem.get(m.categoryName) ?? 0) + 1);
    return [...dem.entries()].sort((a, b) => b[1] - a[1]);
  }, [ds]);

  const ketQua = useMemo(() => {
    const q = fold(tim.trim());
    const loc = ds.filter((m) => (!danhMuc || m.categoryName === danhMuc)
      && (!capDo || m.level === capDo)
      && (!q || fold(`${chuVi(m.title)} ${chuVi(m.shortDescription)} ${m.courseCode ?? ''} ${m.categoryName ?? ''}`).includes(q)));
    const sap = [...loc];
    if (xep === 'nhieu') sap.sort((a, b) => (b.totalLessons ?? 0) - (a.totalLessons ?? 0));
    else if (xep === 'az') sap.sort((a, b) => chuVi(a.title).localeCompare(chuVi(b.title), 'vi'));
    return sap;   // 'moi': thứ tự máy chủ trả (mới nhất trước)
  }, [ds, tim, danhMuc, capDo, xep]);

  const dangHoc = useMemo(() => ds.filter((m) => m.isEnrolled), [ds]);
  const dangLoc = !!(tim.trim() || danhMuc || capDo);

  if (moSlug) return <ChiTietMon slug={moSlug} onQuayLai={() => setMoSlug(null)} nhanQuayLai="Khoá học" />;

  const tongBai = ds.reduce((n, m) => n + (m.totalLessons ?? 0), 0);

  return (
    <div className="ct-page ct-hv">
      <header className="ct-hv-dau">
        <div>
          <h1><Library size={20} aria-hidden /> Courses</h1>
          <p className="ct-muted">
            {ds.length > 0
              ? `${ds.length} khoá · ${tongBai} bài — soạn riêng, học theo thứ tự`
              : 'Các khoá học tự soạn của cuongthai.com'}
          </p>
        </div>
        <div className="ct-hv-dau-nut">
          {cu && <span className="ct-gn-cu"><CloudOff size={13} aria-hidden /> {dich('bản đã lưu')}</span>}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>
            <RefreshCw size={14} aria-hidden /> Tải lại
          </button>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/courses`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      <div className="ct-kh2-loc">
        <label className="ct-music-search ct-kh2-tim">
          <Search size={14} aria-hidden />
          <input
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            placeholder={dich('Tìm khoá học…')}
            aria-label={dich('Tìm khoá học')}
          />
          {tim && (
            <button type="button" className="ct-linklike" onClick={() => setTim('')} aria-label={dich('Xoá tìm kiếm')}>
              <X size={13} aria-hidden />
            </button>
          )}
        </label>
        <div className="ct-kh2-nhom" role="group" aria-label={dich('Cấp độ')}>
          {([['', 'Mọi cấp độ'], ['BEGINNER', NHAN_BAC.BEGINNER ?? 'Cơ bản'], ['INTERMEDIATE', NHAN_BAC.INTERMEDIATE ?? 'Trung cấp'], ['ADVANCED', NHAN_BAC.ADVANCED ?? 'Nâng cao']] as const).map(([k, t]) => (
            <button key={k} type="button" data-chon={capDo === k} onClick={() => setCapDo(k)}>{dich(t)}</button>
          ))}
        </div>
        <select className="ct-kh2-xep" value={xep} onChange={(e) => setXep(e.target.value as typeof xep)} aria-label={dich('Sắp xếp')}>
          <option value="moi">{dich('Mới nhất')}</option>
          <option value="nhieu">{dich('Nhiều bài nhất')}</option>
          <option value="az">{dich('Tên A → Z')}</option>
        </select>
      </div>

      {cacDanhMuc.length > 1 && (
        <div className="ct-kh2-dm" role="group" aria-label={dich('Danh mục')}>
          <button type="button" data-chon={!danhMuc} onClick={() => setDanhMuc('')}>
            {dich('Tất cả')} <span>{ds.length}</span>
          </button>
          {cacDanhMuc.map(([ten, so]) => (
            <button key={ten} type="button" data-chon={danhMuc === ten} onClick={() => setDanhMuc(danhMuc === ten ? '' : ten)}>
              {ten} <span>{so}</span>
            </button>
          ))}
        </div>
      )}

      {!dangLoc && dangHoc.length > 0 && (
        <section className="ct-kh2-dang-hoc" aria-label={dich('Đang học')}>
          <h2>{dich('Đang học')} <span>{dangHoc.length}</span></h2>
          <div className="ct-hv-luoi ct-kh-luoi">
            {dangHoc.map((m) => <TheMon key={m.id} mon={m} onMo={() => setMoSlug(m.slug)} />)}
          </div>
        </section>
      )}

      {!loi && ds.length > 0 && (
        <h2 className="ct-kh2-tieu">
          {dangLoc ? `${ketQua.length} kết quả` : dich('Tất cả khoá học')}
          {dangLoc && (
            <button type="button" className="ct-linklike" onClick={() => { setTim(''); setDanhMuc(''); setCapDo(''); }}>
              {dich('Bỏ lọc')}
            </button>
          )}
        </h2>
      )}

      {loi ? (
        <div className="ct-empty">
          <CloudOff size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>{dich('Thử lại')}</button>
        </div>
      ) : dangTai && ds.length === 0 ? (
        <p className="ct-muted">{dich('Đang tải…')}</p>
      ) : ketQua.length === 0 ? (
        <div className="ct-empty">
          <Library size={26} aria-hidden className="ct-empty-icon" />
          <p>{dangLoc ? dich('Không khoá nào khớp bộ lọc.') : dich('Chưa có khoá học nào được đăng.')}</p>
        </div>
      ) : (
        <div className="ct-hv-luoi ct-kh-luoi">
          {ketQua.map((m) => <TheMon key={m.id} mon={m} onMo={() => setMoSlug(m.slug)} />)}
        </div>
      )}
    </div>
  );
}

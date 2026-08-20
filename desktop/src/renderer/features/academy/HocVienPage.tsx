/**
 * Học viện — 9 kỳ · 50 môn của chương trình FPTU.
 *
 * Đối chiếu API (đo thật 20/08/2026):
 *   GET /api/v1/academy/semesters        → 9 kỳ
 *   GET /api/v1/courses/semester/:id     → môn của kỳ, kèm sẵn `sections`
 *   GET /api/v1/courses/:slug            → chi tiết + bài học + nội dung
 *
 * ─── Chữ SONG NGỮ ngăn bằng `|||` ───
 * Tiêu đề trong cơ sở dữ liệu là `"About LAB211|||Giới thiệu LAB211"`. Quên
 * tách là người dùng nhìn thấy nguyên cả dấu ngăn lẫn bản tiếng Anh — trông
 * như dữ liệu hỏng. Web tách bằng `pickLang`; ở đây là `chuVi()`, cùng luật:
 * ưu tiên tiếng Việt, không có thì lùi về tiếng Anh chứ KHÔNG để trống.
 *
 * ─── Vì sao KHÔNG nhúng video ───
 * `videoPlatform: 'EMBED'` với link YouTube, mà CSP của app đặt
 * `frame-src 'none'` — nhúng vào chỉ được khung trắng, không lỗi nào hiện ra.
 * Nên mở ra trình duyệt ngoài và nói rõ trên nút. Cùng cách trang Giọng nói.
 *
 * ─── Bài KHOÁ thì nói ra ───
 * Máy chủ chỉ trả `content` cho bài `isFreePreview` khi chưa ghi danh. Bài
 * khác về rỗng. Hiện một trang trắng cho chúng là để người dùng tưởng nội dung
 * chưa có; hiện ổ khoá + đường ghi danh thì họ biết phải làm gì.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, CloudOff, ExternalLink,
  FileText, GraduationCap, Layers3, Lock, PlayCircle, RefreshCw, Search, X,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import './noiDungBai';
import { KhungVideo } from './KhungVideo';

interface Ky {
  id: number;
  name: string;
  code: string;
  ordinal: number;
  description?: string | null;
}

interface Mon {
  id: number;
  slug: string;
  title: string;
  courseCode?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  level?: string | null;
  language?: string | null;
  totalLessons?: number | null;
  enrollmentCount?: number | null;
  avgRating?: number | null;
  reviewCount?: number | null;
  isFree?: boolean;
  accessType?: string | null;
  instructorName?: string | null;
  /* ⚠️ ĐO THẬT: hai trường này là CHUỖI, không phải mảng — dù tên số nhiều và
     dù kiểu của web khai là mảng. Gọi `.map` lên chúng làm cả trang chi tiết
     nổ và React tháo sạch cây, để lại màn hình TRẮNG không lỗi nào nhìn thấy.
     Bắt được vì chạy bản đo với dữ liệu THẬT của production; dữ liệu giả của
     tôi khai mảng nên nó xanh. Nhận cả hai kiểu, xem `raDanhSach()`. */
  whatYouLearn?: string[] | string | null;
  requirements?: string[] | string | null;
  semesterId?: number | null;
  sections?: Muc[] | null;
  isEnrolled?: boolean;
  enrollmentProgress?: number | null;
}

interface Muc {
  id: number;
  title: string;
  description?: string | null;
  sortOrder?: number;
  lessonCount?: number | null;
  lessons?: Bai[] | null;
}

interface Bai {
  id: number;
  slug?: string | null;
  title: string;
  description?: string | null;
  lessonType?: string | null;
  isFreePreview?: boolean | null;
  content?: string | null;
  videoUrl?: string | null;
  videoDurationSeconds?: number | null;
  sourceCodeUrl?: string | null;
  documents?: Array<{ id: number; title?: string | null; fileUrl?: string | null; url?: string | null }> | null;
  assignments?: Array<{ id: number; title?: string | null }> | null;
}

const WEB = 'https://cuongthai.com';

/** Tách chữ song ngữ `en|||vi`. Cùng luật với `pickLang` của web. */
function chuVi(text: string | null | undefined): string {
  if (!text) return '';
  const i = text.indexOf('|||');
  if (i === -1) return text;
  const en = text.slice(0, i).trim();
  const vi = text.slice(i + 3).trim();
  return vi || en;
}

/** Bỏ dấu để gõ "co so du lieu" ra "Cơ sở dữ liệu". */
function fold(t: string): string {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/**
 * Đưa một trường "có thể là mảng, có thể là chuỗi" về mảng dòng.
 *
 * ─── Tách theo XUỐNG DÒNG trước, chấm phẩy sau ───
 * Web tách bằng `value.split('\n')` (xem `safeSplitLines`). Nhưng đo dữ liệu
 * thật 20/08/2026: CEA201 có **0 xuống dòng và 10 dấu chấm phẩy** — tức là
 * trên web nó hiện thành MỘT dòng dài duy nhất. Người viết nội dung rõ ràng
 * dùng dấu chấm phẩy để ngăn ý.
 *
 * Nên nhận cả hai: có xuống dòng thì theo xuống dòng (khớp web), không có thì
 * mới theo chấm phẩy. Và VIẾT HOA chữ đầu mỗi ý — không có bước này thì danh
 * sách ra một loạt mẩu chữ thường cụt đầu, đọc như câu bị chặt vụn. Người dùng
 * nhìn thấy đúng cảnh đó và hỏi "sao nó cứ tách tách ra thế?".
 *
 * ⛔ KHÔNG tách theo dấu chấm: câu tiếng Việt đầy dấu chấm trong tên viết tắt
 * ("I/O (polling/interrupt/DMA)") và số thứ tự.
 */
function raDanhSach(v: string[] | string | null | undefined): string[] {
  if (!v) return [];
  const tho = Array.isArray(v)
    ? v.map(chuVi)
    : (() => {
        const c = chuVi(v);
        return c.includes('\n') ? c.split('\n') : c.split(';');
      })();
  return tho
    .map((x) => x.trim().replace(/[.;]+$/, ''))          // bỏ dấu câu cụt ở cuối
    .filter(Boolean)
    .map((x) => x.charAt(0).toLocaleUpperCase('vi') + x.slice(1));
}

const NHAN_BAC: Record<string, string> = {
  BEGINNER: 'Cơ bản', INTERMEDIATE: 'Trung cấp', ADVANCED: 'Nâng cao',
};

function moNgoai(url: string): void {
  void window.cuongthai?.app.openExternal(url);
}

export function HocVienPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [ky, setKy] = useState<Ky[]>([]);
  const [monTheoKy, setMonTheoKy] = useState<Record<number, Mon[]>>({});
  const [bung, setBung] = useState<number[]>([]);
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
      const dsKy = await swr<Ky[]>({
        userId,
        key: 'academy:ky',
        fetcher: () => api.request<Ky[]>('/api/v1/academy/semesters'),
        online,
        ttlMs: 30 * 60 * 1000,
      });
      const sap = [...(dsKy.value ?? [])].sort((a, b) => (a.ordinal ?? 0) - (b.ordinal ?? 0));
      setKy(sap);
      setCu(dsKy.isStale);

      /* Tải môn của MỌI kỳ song song, ngay từ đầu.
         Chờ người dùng bung từng kỳ rồi mới tải thì ô tìm kiếm chỉ tìm được
         trong những kỳ họ đã mở — một bộ tìm kiếm nói dối. 9 lời gọi nhẹ,
         và sau lần đầu là đọc từ cache. */
      const cap = await Promise.all(sap.map(async (s) => {
        try {
          const r = await swr<Mon[]>({
            userId,
            key: `academy:mon:${s.id}`,
            fetcher: () => api.request<Mon[]>(`/api/v1/courses/semester/${s.id}`),
            online,
            ttlMs: 30 * 60 * 1000,
          });
          return [s.id, r.value ?? []] as const;
        } catch {
          return [s.id, [] as Mon[]] as const;   // một kỳ hỏng không được làm hỏng cả trang
        }
      }));
      setMonTheoKy(Object.fromEntries(cap));
      setBung((cu2) => (cu2.length ? cu2 : sap.slice(0, 2).map((s) => s.id)));
    } catch (e) {
      setLoi(
        e instanceof OfflineUnavailableError
          ? 'Chưa từng tải Học viện về máy nên không xem được khi ngoại tuyến.'
          : e instanceof Error ? e.message : String(e),
      );
    } finally {
      setDangTai(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void nap(); }, [nap]);

  const tatCaMon = useMemo(() => {
    const thay = new Set<number>();
    const ra: Mon[] = [];
    for (const s of ky) {
      for (const m of monTheoKy[s.id] ?? []) {
        if (!thay.has(m.id)) { thay.add(m.id); ra.push(m); }
      }
    }
    return ra;
  }, [ky, monTheoKy]);

  /* Xếp hạng: MÃ MÔN khớp chính xác lên đầu.
     Gõ "LAB211" phải ra đúng nó ở dòng đầu, chứ không phải lẫn giữa mười môn
     khác cùng chứa chuỗi "lab". Web xếp đúng như vậy; giữ cho khớp. */
  const ketQua = useMemo(() => {
    const q = fold(tim.trim());
    if (!q) return [];
    return tatCaMon
      .filter((m) => fold(`${m.courseCode ?? ''} ${chuVi(m.title)} ${chuVi(m.shortDescription)}`).includes(q))
      .sort((a, b) => {
        const am = fold(a.courseCode ?? '') === q ? 0 : 1;
        const bm = fold(b.courseCode ?? '') === q ? 0 : 1;
        return am - bm || (a.courseCode ?? '').localeCompare(b.courseCode ?? '');
      });
  }, [tim, tatCaMon]);

  if (moSlug) {
    return <ChiTietMon slug={moSlug} onQuayLai={() => setMoSlug(null)} />;
  }

  const tongMon = tatCaMon.length;

  return (
    <div className="ct-page ct-hv">
      <header className="ct-hv-dau">
        <div>
          <h1><GraduationCap size={20} aria-hidden /> Học viện</h1>
          <p className="ct-muted">
            {ky.length > 0
              ? `${ky.length} kỳ · ${tongMon} môn — chương trình FPTU`
              : 'Chương trình FPTU theo từng kỳ'}
          </p>
        </div>
        <div className="ct-hv-dau-nut">
          {cu && <span className="ct-gn-cu"><CloudOff size={13} aria-hidden /> bản đã lưu</span>}
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void nap()}>
            <RefreshCw size={14} aria-hidden /> Tải lại
          </button>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/academy`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      <label className="ct-music-search ct-hv-tim">
        <Search size={14} aria-hidden />
        <input
          value={tim}
          onChange={(e) => setTim(e.target.value)}
          placeholder="Tìm theo mã môn (LAB211) hoặc tên môn…"
          aria-label="Tìm môn học"
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
      ) : dangTai && ky.length === 0 ? (
        <p className="ct-muted">Đang tải…</p>
      ) : tim.trim() ? (
        <section className="ct-hv-kq">
          <p className="ct-hv-sokq">{ketQua.length} môn khớp “{tim.trim()}”</p>
          {ketQua.length === 0 ? (
            <div className="ct-empty">
              <Search size={26} aria-hidden className="ct-empty-icon" />
              <p>Không môn nào khớp. Thử mã môn, ví dụ <code>PRF192</code>.</p>
            </div>
          ) : (
            <div className="ct-hv-luoi">
              {ketQua.map((m) => <TheMon key={m.id} mon={m} onMo={() => setMoSlug(m.slug)} />)}
            </div>
          )}
        </section>
      ) : (
        <div className="ct-hv-ky-ds">
          {ky.map((s) => {
            const ds = monTheoKy[s.id] ?? [];
            const mo = bung.includes(s.id);
            return (
              <section key={s.id} className="ct-hv-ky" data-mo={mo}>
                <button
                  type="button"
                  className="ct-hv-ky-dau"
                  aria-expanded={mo}
                  onClick={() => setBung((c) => (c.includes(s.id) ? c.filter((x) => x !== s.id) : [...c, s.id]))}
                >
                  {mo ? <ChevronDown size={16} aria-hidden /> : <ChevronRight size={16} aria-hidden />}
                  <Layers3 size={15} aria-hidden />
                  <span className="ct-hv-ky-ten">{s.name}</span>
                  <span className="ct-mau-dem">{ds.length} môn</span>
                </button>
                {mo && (
                  ds.length === 0 ? (
                    <p className="ct-muted ct-hv-ky-trong">Kỳ này chưa có môn nào được đăng.</p>
                  ) : (
                    <div className="ct-hv-luoi">
                      {ds.map((m) => <TheMon key={m.id} mon={m} onMo={() => setMoSlug(m.slug)} />)}
                    </div>
                  )
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Thẻ một môn ─────────────────────────────────────────────────────────── */

function TheMon({ mon, onMo }: { mon: Mon; onMo: () => void }) {
  const soBai = mon.totalLessons
    ?? (mon.sections ?? []).reduce((n, s) => n + (s.lessonCount ?? (s.lessons ?? []).length), 0);

  return (
    <button type="button" className="ct-hv-the" onClick={onMo}>
      <span className="ct-hv-the-anh">
        {mon.thumbnailUrl
          ? <img src={mon.thumbnailUrl} alt="" loading="lazy" />
          : <span className="ct-gn-anh-trong"><BookOpen size={20} aria-hidden /></span>}
        {mon.courseCode && <span className="ct-hv-ma">{mon.courseCode}</span>}
      </span>
      <span className="ct-hv-the-than">
        <span className="ct-hv-the-ten">{chuVi(mon.title)}</span>
        {mon.shortDescription && <span className="ct-hv-the-mo">{chuVi(mon.shortDescription)}</span>}
        <span className="ct-hv-the-so">
          {soBai > 0 && <span><PlayCircle size={12} aria-hidden /> {soBai} bài</span>}
          {mon.level && <span className="ct-mau-tag">{NHAN_BAC[mon.level] ?? mon.level}</span>}
          {mon.isFree && <span className="ct-hv-free">Miễn phí</span>}
        </span>
      </span>
    </button>
  );
}

/* ── Chi tiết một môn ────────────────────────────────────────────────────── */

function ChiTietMon({ slug, onQuayLai }: { slug: string; onQuayLai: () => void }) {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [mon, setMon] = useState<Mon | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [mucMo, setMucMo] = useState<number[]>([]);
  const [baiMo, setBaiMo] = useState<Bai | null>(null);

  useEffect(() => {
    if (userId === null || !api) return;
    let huy = false;
    setMon(null);
    setLoi(null);
    void swr<Mon>({
      userId,
      key: `academy:mon-slug:${slug}`,
      fetcher: () => api.request<Mon>(`/api/v1/courses/${encodeURIComponent(slug)}`),
      online,
      ttlMs: 30 * 60 * 1000,
      onRefreshed: (moi) => { if (!huy) setMon(moi); },
    })
      .then((kq) => {
        if (huy) return;
        setMon(kq.value);
        // Bung sẵn mục đầu: mở một môn ra mà thấy 10 dòng đóng kín thì không
        // biết bên trong có gì.
        setMucMo((kq.value.sections ?? []).slice(0, 1).map((s) => s.id));
      })
      .catch((e: unknown) => {
        if (huy) return;
        setLoi(
          e instanceof OfflineUnavailableError
            ? 'Môn này chưa từng mở nên không đọc được khi ngoại tuyến.'
            : e instanceof Error ? e.message : String(e),
        );
      });
    return () => { huy = true; };
  }, [api, userId, online, slug]);

  if (baiMo && mon) {
    return <DocBai bai={baiMo} mon={mon} onQuayLai={() => setBaiMo(null)} />;
  }

  if (loi) {
    return (
      <div className="ct-page ct-hv">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Học viện
        </button>
        <div className="ct-empty"><CloudOff size={26} aria-hidden className="ct-empty-icon" /><p>{loi}</p></div>
      </div>
    );
  }

  if (!mon) {
    return (
      <div className="ct-page ct-hv">
        <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
          <ArrowLeft size={14} aria-hidden /> Học viện
        </button>
        <p className="ct-muted">Đang tải…</p>
      </div>
    );
  }

  const muc = mon.sections ?? [];
  const tongBai = muc.reduce((n, s) => n + (s.lessons ?? []).length, 0);
  const hoc = raDanhSach(mon.whatYouLearn);
  const canCo = raDanhSach(mon.requirements);

  return (
    <div className="ct-page ct-hv ct-hv-ct">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ArrowLeft size={14} aria-hidden /> Học viện
      </button>

      <header className="ct-hv-hero">
        {mon.thumbnailUrl && <img className="ct-hv-hero-anh" src={mon.thumbnailUrl} alt="" />}
        <div className="ct-hv-hero-chu">
          <p className="ct-hv-hero-nhan">
            {mon.courseCode && <span className="ct-hv-ma">{mon.courseCode}</span>}
            {mon.level && <span className="ct-mau-tag">{NHAN_BAC[mon.level] ?? mon.level}</span>}
            {mon.isFree && <span className="ct-hv-free">Miễn phí</span>}
          </p>
          <h1>{chuVi(mon.title)}</h1>
          {mon.shortDescription && <p className="ct-hv-hero-mo">{chuVi(mon.shortDescription)}</p>}
          <p className="ct-hv-hero-so">
            <span><Layers3 size={13} aria-hidden /> {muc.length} mục</span>
            <span><PlayCircle size={13} aria-hidden /> {tongBai} bài</span>
            {mon.instructorName && <span className="ct-muted">{mon.instructorName}</span>}
          </p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(`${WEB}/courses/${mon.slug}`)}>
            <ExternalLink size={14} aria-hidden /> Mở trên web
          </button>
        </div>
      </header>

      {hoc.length > 0 && (
        <section className="ct-hv-hoc">
          <h2>Học xong bạn làm được gì</h2>
          <ul>{hoc.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      {canCo.length > 0 && (
        <section className="ct-hv-hoc">
          <h2>Cần có trước</h2>
          <ul>{canCo.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      <section className="ct-hv-muc-ds">
        <h2>Nội dung môn học</h2>
        {muc.length === 0 ? (
          <p className="ct-muted">Môn này chưa có bài học nào được đăng.</p>
        ) : muc.map((s) => {
          const mo = mucMo.includes(s.id);
          const bai = s.lessons ?? [];
          return (
            <div key={s.id} className="ct-hv-muc" data-mo={mo}>
              <button
                type="button"
                className="ct-hv-muc-dau"
                aria-expanded={mo}
                onClick={() => setMucMo((c) => (c.includes(s.id) ? c.filter((x) => x !== s.id) : [...c, s.id]))}
              >
                {mo ? <ChevronDown size={15} aria-hidden /> : <ChevronRight size={15} aria-hidden />}
                <span className="ct-hv-muc-ten">{chuVi(s.title)}</span>
                <span className="ct-mau-dem">{s.lessonCount ?? bai.length} bài</span>
              </button>
              {mo && (
                <ul className="ct-hv-bai-ds">
                  {bai.map((b) => {
                    /* Máy chủ chỉ trả `content` cho bài xem thử khi chưa ghi
                       danh. Không có nội dung LẪN không có video ⇒ bài khoá. */
                    const khoa = !b.content && !b.videoUrl;
                    return (
                      <li key={b.id}>
                        <button
                          type="button"
                          className="ct-hv-bai"
                          data-khoa={khoa}
                          onClick={() => (khoa ? moNgoai(`${WEB}/courses/${mon.slug}`) : setBaiMo(b))}
                          title={khoa ? 'Bài này cần ghi danh — mở trên web' : chuVi(b.title)}
                        >
                          {khoa ? <Lock size={13} aria-hidden />
                            : b.videoUrl ? <PlayCircle size={13} aria-hidden />
                              : <FileText size={13} aria-hidden />}
                          <span className="ct-hv-bai-ten">{chuVi(b.title)}</span>
                          {b.isFreePreview && <span className="ct-hv-free">xem thử</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ── Đọc một bài ─────────────────────────────────────────────────────────── */

function DocBai({ bai, mon, onQuayLai }: { bai: Bai; mon: Mon; onQuayLai: () => void }) {
  /* Video HIỆN SẴN khi bài có video — người dùng yêu cầu 20/08/2026: "tôi muốn
     vào video nó hiện cố định, chứ đừng phải ấn vào nó mới hiện".
     Cái giá: mỗi lần mở một bài CÓ video là một lượt tải YouTube, kể cả khi họ
     chỉ định đọc chữ. Đổi lại còn nút X để đóng, và lúc đó nút "Xem video trong
     app" hiện lại. */
  const [xemVideo, datXemVideo] = useState(true);
  /* Đổi bài thì mở lại khung (nếu bài trước họ đã đóng). */
  useEffect(() => { datXemVideo(true); }, [bai.id]);

  /* Lọc HTML trước khi dựng. Nội dung do quản trị viên soạn nên nó là HTML
     thật (không phải chữ thoát), mà một trình soạn thảo giàu định dạng thì có
     thể mang theo `<script>` hoặc `onerror=` từ chỗ dán vào. DOMPurify chạy ở
     renderer, ngay trước khi vẽ. */
  const html = useMemo(() => {
    const sach = DOMPurify.sanitize(bai.content ?? '', { USE_PROFILES: { html: true } });
    /* Bản song ngữ: nội dung bọc trong `.ml-en` / `.ml-vi`. Web ẩn một bên
       bằng `[data-ml]`; ở đây đặt cùng thuộc tính lên phần bọc. */
    return sach;
  }, [bai.content]);

  return (
    <div className="ct-page ct-hv ct-hv-bai-doc">
      <button type="button" className="ct-btn ct-btn-ghost ct-gn-lui" onClick={onQuayLai}>
        <ArrowLeft size={14} aria-hidden /> {chuVi(mon.title)}
      </button>

      <h1 className="ct-hv-bai-tieude">{chuVi(bai.title)}</h1>
      {bai.description && <p className="ct-hv-hero-mo">{chuVi(bai.description)}</p>}

      <div className="ct-hv-bai-nut">
        {bai.videoUrl && !xemVideo && (
          <button type="button" className="ct-btn" onClick={() => datXemVideo(true)}>
            <PlayCircle size={15} aria-hidden /> Xem video trong app
          </button>
        )}
        {bai.videoUrl && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(bai.videoUrl!)}>
            <ExternalLink size={14} aria-hidden /> Mở trên YouTube
          </button>
        )}
        {bai.sourceCodeUrl && (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(bai.sourceCodeUrl!)}>
            <ExternalLink size={14} aria-hidden /> Mã nguồn
          </button>
        )}
        {(bai.documents ?? []).map((d) => {
          const url = d.fileUrl ?? d.url;
          if (!url) return null;
          return (
            <button key={d.id} type="button" className="ct-btn ct-btn-ghost" onClick={() => moNgoai(url)}>
              <FileText size={14} aria-hidden /> {chuVi(d.title) || 'Tài liệu'}
            </button>
          );
        })}
      </div>

      {/* Khung video nằm NGOÀI vùng cuộn của bài — xem chú thích đầu KhungVideo:
          trang web do main vẽ đè, cuộn theo chữ là nó trùm lên chữ. */}
      {xemVideo && bai.videoUrl && (
        /* `key` ở đây là PHÒNG XA, không phải bản vá cho một lỗi đang có.
           Đo thật: gỡ nó ra thì đổi bài VẪN nạp đúng video mới, vì luồng hiện
           tại bắt quay ra danh sách trước, và cú đó tháo cả trình đọc.
           Nhưng `KhungVideo` chốt `daMoRef` để chỉ gọi `mo()` một lần mỗi lần
           gắn. Ngày nào có ai thêm nút "bài kế tiếp" ngay trong trình đọc —
           đổi bài mà KHÔNG tháo — thì thiếu `key` là khung kẹt video cũ, im
           lặng, không lỗi nào để thấy. Một chữ, mua trước cái đó. */
        <KhungVideo key={bai.id} url={bai.videoUrl} onDong={() => datXemVideo(false)} />
      )}

      {html
        ? <div className="ct-hv-noidung rich-content" data-ml="vi" dangerouslySetInnerHTML={{ __html: html }} />
        : (
          <p className="ct-muted">
            Bài này chưa có nội dung chữ.{' '}
            <button type="button" className="ct-linklike" onClick={() => moNgoai(`${WEB}/courses/${mon.slug}`)}>
              Mở trên web
            </button>
          </p>
        )}
    </div>
  );
}

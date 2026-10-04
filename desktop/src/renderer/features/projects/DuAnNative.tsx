/**
 * Dự án — trang DANH SÁCH dựng riêng cho app (04/10/2026).
 *
 * ─── Vì sao không dùng lại `/projects` của web nữa ───
 * Trang web có hai lớp nền `position: fixed` phủ cả cửa sổ (ProjectsBackground
 * + ProjectsAmbientField). Trên web chúng nằm dưới thanh điều hướng; trong app
 * chúng phủ luôn thanh tiêu đề, thanh bên và thanh trạng thái — đo bằng ảnh chụp
 * 04/10: vào Dự án là mất cả vỏ app. Ngoài ra bố cục ba thẻ một hàng, bộ lọc
 * gập, mỗi lần xem một dự án là rời trang — đúng kiểu trang web, không phải app.
 *
 * Bản này: cột lọc bên trái (đếm sẵn số dự án mỗi lựa chọn), lưới hoặc danh
 * sách ở giữa, và bảng CHI TIẾT bên phải mở ngay khi bấm — đủ tính năng, cột
 * mốc, tài nguyên, liên kết — không rời trang. Trang case-study đầy đủ (bài
 * viết dài, sơ đồ, mã) vẫn là của web: nút "Mở trang đầy đủ" đi vào cây
 * `/projects/:slug` dùng lại nguyên mã web, chạy ngay trong app.
 *
 * Dữ liệu: `GET /api/v1/projects?size=100` — cùng lời gọi trang web dùng, trả
 * về cả `milestones/features/resources/listItems` nên bảng chi tiết không phải
 * hỏi thêm. Lưu đệm (offline/cache) để mất mạng vẫn xem được.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown, BookOpen, Briefcase, CheckCircle2, Circle, CircleDashed, ExternalLink, FileText,
  Github, Globe, LayoutGrid, Link2, List, Loader2, Pin, PlayCircle, RefreshCw, Search, SlidersHorizontal, Star, X,
} from 'lucide-react';
import {
  CATEGORY_LABELS_I18N, LEVEL_LABELS_I18N, PHASE_LABELS_I18N, STATUS_LABELS_I18N, TECH_GROUPS, labelOf,
  matchesTechGroup, pickLang, type Lang,
} from './nhanDuAn';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { useDich } from '../../i18n';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import './projects.css';

interface Moc { id: number; phase: string; title: string; titleEn?: string | null; description?: string | null; descriptionEn?: string | null; date?: string | null }
interface TinhNang { id: number; title: string; titleEn?: string | null; description?: string | null; descriptionEn?: string | null; status: 'DONE' | 'IN_PROGRESS' | 'PLANNED' }
interface TaiNguyen { id: number; title: string; titleEn?: string | null; url: string; type: string; description?: string | null }
interface MucDs { id: number; kind: string; content: string; contentEn?: string | null }

export interface DuAn {
  id: number;
  slug: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  thumbnailUrl?: string | null;
  images?: string[] | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  videoUrl?: string | null;
  technologies?: string[] | null;
  role?: string | null;
  roleEn?: string | null;
  duration?: string | null;
  durationEn?: string | null;
  status: string;
  featured?: boolean;
  pinOrder?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  category?: string | null;
  difficulty?: string | null;
  viewCount?: number;
  likeCount?: number;
  milestones?: Moc[];
  features?: TinhNang[];
  resources?: TaiNguyen[];
  listItems?: MucDs[];
}

type SapXep = 'moi' | 'cu' | 'de' | 'kho' | 'xem';
const BAC: Record<string, number> = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };
const MAU_TRANG_THAI: Record<string, string> = {
  COMPLETED: '#4ade80', IN_PROGRESS: '#fbbf24', PLANNING: '#8b9cff', MAINTENANCE: '#c084fc', ON_HOLD: '#94a3b8',
};
const MAU_BAC: Record<string, string> = { BEGINNER: '#4ade80', INTERMEDIATE: '#fbbf24', ADVANCED: '#f87171', EXPERT: '#e879f9' };
const KHOA_KIEU = 'ct-projects-kieu';

/** Bỏ phần nặng (bodyHtml ~1 MB cho 42 dự án) trước khi lưu đệm — bảng chi tiết không cần nó. */
function gon(ds: unknown): DuAn[] {
  if (!Array.isArray(ds)) {
    const c = (ds as { content?: unknown } | null)?.content;
    return Array.isArray(c) ? gon(c) : [];
  }
  return (ds as (DuAn & Record<string, unknown>)[]).map((p) => {
    const { bodyHtml: _a, bodyHtmlEn: _b, bodyMdx: _c, schemaCode: _d, schemaCodeEn: _e, content: _f, ...con } = p;
    void _a; void _b; void _c; void _d; void _e; void _f;
    return { ...con, id: Number(con.id) } as DuAn;
  });
}

export function DuAnNative() {
  const { dich, dichP } = useDich();
  const { online, navigate, settings } = useAppState();
  const { api, userId } = useSession();

  const [ds, setDs] = useState<DuAn[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(settings.ngonNgu === 'en' ? 'en' : 'vi');
  const [tim, setTim] = useState('');
  const [trangThai, setTrangThai] = useState('');
  const [danhMuc, setDanhMuc] = useState('');
  const [bac, setBac] = useState('');
  const [congNghe, setCongNghe] = useState('');
  const [sapXep, setSapXep] = useState<SapXep>('moi');
  const [kieu, setKieu] = useState<'luoi' | 'ds'>(() => { try { return localStorage.getItem(KHOA_KIEU) === 'ds' ? 'ds' : 'luoi'; } catch { return 'luoi'; } });
  const [chonId, setChonId] = useState<number | null>(null);
  const [locMo, setLocMo] = useState(false);

  const nap = async (epMoi = false) => {
    if (!api || userId === null) return;
    setDangTai(true);
    setLoi(null);
    try {
      const r = await swr<DuAn[]>({
        userId,
        key: 'projects:list',
        fetcher: async () => gon(await api.request<unknown>('/api/v1/projects?size=100')),
        online,
        ttlMs: 15 * 60 * 1000,
        epMoi,
        onRefreshed: (moi) => setDs(moi),
      });
      setDs(r.value);
    } catch (e) {
      setLoi(e instanceof OfflineUnavailableError
        ? dich('Chưa từng tải danh sách dự án nên không xem được khi ngoại tuyến.')
        : e instanceof Error ? e.message : String(e));
    } finally {
      setDangTai(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void nap(); }, [api, userId]);
  useEffect(() => { try { localStorage.setItem(KHOA_KIEU, kieu); } catch { /* thôi */ } }, [kieu]);

  const pick = (vi: string | null | undefined, en: string | null | undefined) => pickLang(lang, vi, en);
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);

  /** Lọc theo MỌI điều kiện trừ `bo` — để đếm số dự án cho từng lựa chọn của nhóm đó. */
  const loc = (bo: 'tt' | 'dm' | 'bac' | 'cn' | null) => {
    const q = tim.trim().toLowerCase();
    return ds.filter((p) => {
      if (q && ![p.title, p.titleEn, p.description, p.descriptionEn, p.category, ...(p.technologies ?? [])]
        .some((x) => (x ?? '').toLowerCase().includes(q))) return false;
      if (bo !== 'tt' && trangThai && p.status !== trangThai) return false;
      if (bo !== 'dm' && danhMuc && p.category !== danhMuc) return false;
      if (bo !== 'bac' && bac && p.difficulty !== bac) return false;
      if (bo !== 'cn' && congNghe && !matchesTechGroup(p.technologies, congNghe)) return false;
      return true;
    });
  };

  const ketQua = useMemo(() => {
    const r = loc(null);
    const ngay = (s?: string | null) => (s ? new Date(s).getTime() : 0);
    if (sapXep === 'moi') r.sort((a, b) => ngay(b.createdAt) - ngay(a.createdAt));
    if (sapXep === 'cu') r.sort((a, b) => ngay(a.createdAt) - ngay(b.createdAt));
    if (sapXep === 'de') r.sort((a, b) => (BAC[a.difficulty ?? ''] ?? 0) - (BAC[b.difficulty ?? ''] ?? 0));
    if (sapXep === 'kho') r.sort((a, b) => (BAC[b.difficulty ?? ''] ?? 0) - (BAC[a.difficulty ?? ''] ?? 0));
    if (sapXep === 'xem') r.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    // Dự án ghim luôn đứng đầu, như trên web (sort ổn định giữ thứ tự trong nhóm).
    const ghim = (p: DuAn) => (p.pinOrder == null ? Number.MAX_SAFE_INTEGER : p.pinOrder);
    r.sort((a, b) => ghim(a) - ghim(b));
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds, tim, trangThai, danhMuc, bac, congNghe, sapXep]);

  const dem = <K extends string>(bo: 'tt' | 'dm' | 'bac' | 'cn', lay: (p: DuAn) => K | null | undefined) => {
    const m = new Map<string, number>();
    for (const p of loc(bo)) { const k = lay(p); if (k) m.set(k, (m.get(k) ?? 0) + 1); }
    return m;
  };
  const demTT = dem('tt', (p) => p.status);
  const demDM = dem('dm', (p) => p.category);
  const demBac = dem('bac', (p) => p.difficulty);
  const nenCn = loc('cn');
  const demCN = TECH_GROUPS.map((g) => ({ ...g, n: nenCn.filter((p) => matchesTechGroup(p.technologies, g.id)).length })).filter((g) => g.n > 0);
  const soCongNghe = useMemo(() => new Set(ds.flatMap((p) => p.technologies ?? [])).size, [ds]);
  const dangLoc = Boolean(tim || trangThai || danhMuc || bac || congNghe);
  const xoaLoc = () => { setTim(''); setTrangThai(''); setDanhMuc(''); setBac(''); setCongNghe(''); };

  const chon = ds.find((p) => p.id === chonId) ?? null;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setChonId(null); setLocMo(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    /* `.da-boc` là CONTAINER — bố cục theo bề rộng thật của vùng nội dung. */
    <div className="da-boc">
    <div className="da" data-chi-tiet={chon !== null} data-loc-mo={locMo}>
      {/* ─── Cột lọc ─── (cửa sổ hẹp: thành ngăn trượt, mở bằng nút "Bộ lọc") */}
      <aside className="da-loc">
        <button type="button" className="da-nut-nho da-loc-dong" onClick={() => setLocMo(false)} aria-label={dich('Đóng')}><X size={15} aria-hidden /></button>
        <label className="da-tim">
          <Search size={14} aria-hidden />
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder={dich('Tìm dự án, công nghệ…')} aria-label={dich('Tìm dự án')} />
          {tim && <button type="button" onClick={() => setTim('')} aria-label={dich('Xoá tìm kiếm')}><X size={13} aria-hidden /></button>}
        </label>
        <NhomLoc
          ten={dich('Trạng thái')}
          gia={trangThai}
          dat={setTrangThai}
          muc={Object.keys(STATUS_LABELS_I18N).filter((k) => demTT.has(k) || trangThai === k)
            .map((k) => ({ v: k, t: labelOf(STATUS_LABELS_I18N, k, lang), n: demTT.get(k) ?? 0, mau: MAU_TRANG_THAI[k] }))}
        />
        <NhomLoc
          ten={dich('Danh mục')}
          gia={danhMuc}
          dat={setDanhMuc}
          muc={[...demDM.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ v: k, t: labelOf(CATEGORY_LABELS_I18N, k, lang), n }))}
        />
        <NhomLoc
          ten={dich('Mức độ')}
          gia={bac}
          dat={setBac}
          muc={Object.keys(LEVEL_LABELS_I18N).filter((k) => demBac.has(k) || bac === k)
            .map((k) => ({ v: k, t: labelOf(LEVEL_LABELS_I18N, k, lang), n: demBac.get(k) ?? 0, mau: MAU_BAC[k] }))}
        />
        <div className="da-loc-nhom">
          <h4>{dich('Công nghệ')}</h4>
          <div className="da-chip-hang">
            {demCN.map((g) => (
              <button key={g.id} type="button" className="da-chip" data-on={congNghe === g.id} onClick={() => setCongNghe(congNghe === g.id ? '' : g.id)}>
                {g.label} <em>{g.n}</em>
              </button>
            ))}
          </div>
        </div>
        {dangLoc && (
          <button type="button" className="da-nut da-nut-trong da-xoa-loc" onClick={xoaLoc}>
            <X size={13} aria-hidden /> {dich('Xoá bộ lọc')}
          </button>
        )}
      </aside>

      {/* ─── Giữa ─── */}
      <main className="da-giua">
        <header className="da-dau">
          <div>
            <p className="da-eyebrow"><Briefcase size={12} aria-hidden /> Portfolio</p>
            <h1>{dich('Dự án')}</h1>
            <p className="da-dau-phu">{L('Lộ trình dự án từ cơ bản tới đẳng cấp thế giới — mỗi dự án là một case study đủ chi tiết để dựng lại.', 'A project roadmap from beginner to world-class — each one a case study detailed enough to rebuild from.')}</p>
          </div>
          <div className="da-so">
            <div><strong>{ds.length}</strong><small>{dich('dự án')}</small></div>
            <div><strong>{soCongNghe}</strong><small>{dich('công nghệ')}</small></div>
            <div><strong>{ds.filter((p) => p.status === 'COMPLETED').length}</strong><small>{dich('hoàn thành')}</small></div>
            <div><strong>{ds.filter((p) => p.featured).length}</strong><small>{dich('nổi bật')}</small></div>
          </div>
        </header>

        <div className="da-thanh">
          <button type="button" className="da-nut da-nut-loc" onClick={() => setLocMo(true)}>
            <SlidersHorizontal size={14} aria-hidden /> {dich('Bộ lọc')}
            {dangLoc && <span className="da-cham" />}
          </button>
          <span className="da-dem">
            {dangLoc ? dichP('{n} / {tong} dự án', { n: ketQua.length, tong: ds.length }) : dichP('{n} dự án', { n: ds.length })}
          </span>
          <label className="da-chon">
            <ArrowUpDown size={13} aria-hidden />
            <select value={sapXep} onChange={(e) => setSapXep(e.target.value as SapXep)} aria-label={dich('Sắp xếp')}>
              <option value="moi">{dich('Mới nhất')}</option>
              <option value="cu">{dich('Cũ nhất')}</option>
              <option value="de">{dich('Cơ bản → Nâng cao')}</option>
              <option value="kho">{dich('Nâng cao → Cơ bản')}</option>
              <option value="xem">{dich('Xem nhiều nhất')}</option>
            </select>
          </label>
          <div className="da-doan" role="radiogroup" aria-label={dich('Ngôn ngữ nội dung')}>
            <button type="button" role="radio" aria-checked={lang === 'vi'} data-on={lang === 'vi'} onClick={() => setLang('vi')}>VI</button>
            <button type="button" role="radio" aria-checked={lang === 'en'} data-on={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          </div>
          <div className="da-doan" role="radiogroup" aria-label={dich('Kiểu hiển thị')}>
            <button type="button" role="radio" aria-checked={kieu === 'luoi'} data-on={kieu === 'luoi'} onClick={() => setKieu('luoi')} title={dich('Lưới')} aria-label={dich('Lưới')}><LayoutGrid size={14} aria-hidden /></button>
            <button type="button" role="radio" aria-checked={kieu === 'ds'} data-on={kieu === 'ds'} onClick={() => setKieu('ds')} title={dich('Danh sách')} aria-label={dich('Danh sách')}><List size={14} aria-hidden /></button>
          </div>
          <button type="button" className="da-nut da-nut-trong" onClick={() => void nap(true)} disabled={!online || dangTai} title={dich('Làm mới')} aria-label={dich('Làm mới')}>
            {dangTai ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <RefreshCw size={14} aria-hidden />}
          </button>
          <button type="button" className="da-nut da-nut-trong" onClick={() => navigate('/projects/search')} title={dich('Tìm trong nội dung case study')}>
            <BookOpen size={14} aria-hidden /> {dich('Tìm nâng cao')}
          </button>
        </div>

        {loi && (
          <div className="ct-notice" data-tone="err" role="alert">
            <span>{loi}</span>
            <button type="button" className="ct-linklike" onClick={() => void nap(true)}>{dich('Thử lại')}</button>
          </div>
        )}

        {dangTai && ds.length === 0 ? (
          <div className="da-luoi" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => <div key={i} className="da-the da-the-cho" />)}
          </div>
        ) : ketQua.length === 0 && !loi ? (
          <div className="da-trong">
            <Search size={26} aria-hidden />
            <p>{dich('Không có dự án nào khớp bộ lọc.')}</p>
            {dangLoc && <button type="button" className="da-nut" onClick={xoaLoc}>{dich('Xoá bộ lọc')}</button>}
          </div>
        ) : kieu === 'luoi' ? (
          <div className="da-luoi">
            {ketQua.map((p) => (
              <button key={p.id} type="button" className="da-the" data-chon={p.id === chonId} onClick={() => setChonId(p.id === chonId ? null : p.id)}>
                <span className="da-the-anh">
                  {p.thumbnailUrl ? <img src={p.thumbnailUrl} alt="" loading="lazy" /> : <span className="da-the-anh-trong"><Briefcase size={28} aria-hidden /></span>}
                  <span className="da-the-nhan">
                    {p.pinOrder != null && <span className="da-nhan da-nhan-ghim"><Pin size={10} aria-hidden /> {dich('Ghim')}</span>}
                    {p.featured && <span className="da-nhan da-nhan-sao"><Star size={10} aria-hidden /> {dich('Nổi bật')}</span>}
                  </span>
                  <TrangThai st={p.status} lang={lang} />
                </span>
                <span className="da-the-than">
                  <span className="da-the-ten">{pick(p.title, p.titleEn)}</span>
                  <span className="da-the-mota">{pick(p.description, p.descriptionEn)}</span>
                  <span className="da-the-chan">
                    {p.difficulty && <span className="da-bac" style={{ ['--b' as string]: MAU_BAC[p.difficulty] ?? '#94a3b8' }}>{labelOf(LEVEL_LABELS_I18N, p.difficulty, lang)}</span>}
                    {p.category && <span className="da-dm">{labelOf(CATEGORY_LABELS_I18N, p.category, lang)}</span>}
                    <span className="da-nam">{new Date(p.startDate ?? p.createdAt).getFullYear()}</span>
                  </span>
                  <span className="da-cn">
                    {(p.technologies ?? []).slice(0, 4).map((t) => <span key={t}>{t}</span>)}
                    {(p.technologies?.length ?? 0) > 4 && <span className="da-cn-them">+{(p.technologies?.length ?? 0) - 4}</span>}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="da-ds">
            {ketQua.map((p) => (
              <button key={p.id} type="button" className="da-dong" data-chon={p.id === chonId} onClick={() => setChonId(p.id === chonId ? null : p.id)}>
                {p.thumbnailUrl ? <img src={p.thumbnailUrl} alt="" loading="lazy" className="da-dong-anh" /> : <span className="da-dong-anh da-the-anh-trong"><Briefcase size={16} aria-hidden /></span>}
                <span className="da-dong-chu">
                  <strong>
                    {p.pinOrder != null && <Pin size={11} aria-hidden className="da-dong-ghim" />}
                    {pick(p.title, p.titleEn)}
                  </strong>
                  <small>{pick(p.description, p.descriptionEn)}</small>
                </span>
                <span className="da-dong-cn">{(p.technologies ?? []).slice(0, 3).join(' · ')}</span>
                {p.difficulty ? <span className="da-bac" style={{ ['--b' as string]: MAU_BAC[p.difficulty] ?? '#94a3b8' }}>{labelOf(LEVEL_LABELS_I18N, p.difficulty, lang)}</span> : <span />}
                <TrangThai st={p.status} lang={lang} phang />
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ─── Chi tiết ─── */}
      {chon && <ChiTiet p={chon} lang={lang} onDong={() => setChonId(null)} onMoDayDu={() => navigate(`/projects/${chon.slug}`)} />}
    </div>
    </div>
  );
}

function NhomLoc({ ten, gia, dat, muc }: { ten: string; gia: string; dat: (v: string) => void; muc: { v: string; t: string; n: number; mau?: string | undefined }[] }) {
  return (
    <div className="da-loc-nhom">
      <h4>{ten}</h4>
      {muc.map((m) => (
        <button key={m.v} type="button" className="da-loc-muc" data-on={gia === m.v} onClick={() => dat(gia === m.v ? '' : m.v)}>
          {m.mau && <i style={{ background: m.mau }} />}
          <span>{m.t}</span>
          <em>{m.n}</em>
        </button>
      ))}
    </div>
  );
}

function TrangThai({ st, lang, phang = false }: { st: string; lang: Lang; phang?: boolean }) {
  return (
    <span className={`da-tt${phang ? ' da-tt-phang' : ''}`} style={{ ['--t' as string]: MAU_TRANG_THAI[st] ?? '#94a3b8' }}>
      <i />{labelOf(STATUS_LABELS_I18N, st, lang)}
    </span>
  );
}

function ChiTiet({ p, lang, onDong, onMoDayDu }: { p: DuAn; lang: Lang; onDong: () => void; onMoDayDu: () => void }) {
  const { dich, dichP } = useDich();
  const pick = (vi: string | null | undefined, en: string | null | undefined) => pickLang(lang, vi, en);
  const anh = [p.thumbnailUrl, ...(p.images ?? [])].filter((u): u is string => Boolean(u));
  const [anhMo, setAnhMo] = useState(0);
  useEffect(() => { setAnhMo(0); }, [p.id]);
  const mo = (url: string) => void window.cuongthai?.app.openExternal(url);
  const tinhNang = p.features ?? [];
  const xong = tinhNang.filter((f) => f.status === 'DONE').length;
  const ketQuaHoc = (p.listItems ?? []).filter((x) => x.kind === 'COMPLETION_OUTCOME');
  const ngay = (s?: string | null) => (s ? new Date(s).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');
  const ICON_TN: Record<string, JSX.Element> = {
    DONE: <CheckCircle2 size={14} aria-hidden className="da-tn-xong" />,
    IN_PROGRESS: <CircleDashed size={14} aria-hidden className="da-tn-dang" />,
    PLANNED: <Circle size={14} aria-hidden className="da-tn-chua" />,
  };

  return (
    <aside className="da-ct" aria-label={dich('Chi tiết dự án')} key={p.id}>
      <div className="da-ct-dau">
        <TrangThai st={p.status} lang={lang} />
        <span className="da-ct-gian" />
        <button type="button" className="da-nut-nho" onClick={onDong} aria-label={dich('Đóng')} title={dich('Đóng (Esc)')}><X size={15} aria-hidden /></button>
      </div>
      <div className="da-ct-cuon">
        {anh.length > 0 && (
          <div className="da-ct-anh">
            <img src={anh[anhMo] ?? anh[0]} alt="" />
            {anh.length > 1 && (
              <div className="da-ct-anh-nho">
                {anh.map((u, i) => (
                  <button key={u} type="button" data-on={i === anhMo} onClick={() => setAnhMo(i)} aria-label={dichP('Ảnh {n}', { n: i + 1 })}>
                    <img src={u} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <h2 className="da-ct-ten">{pick(p.title, p.titleEn)}</h2>
        <p className="da-ct-mota">{pick(p.description, p.descriptionEn)}</p>

        <div className="da-ct-nut">
          <button type="button" className="da-nut da-nut-chinh" onClick={onMoDayDu}>
            <FileText size={14} aria-hidden /> {dich('Mở trang đầy đủ')}
          </button>
          {p.githubUrl && <button type="button" className="da-nut" onClick={() => mo(p.githubUrl!)}><Github size={14} aria-hidden /> GitHub</button>}
          {p.projectUrl && <button type="button" className="da-nut" onClick={() => mo(p.projectUrl!)}><Globe size={14} aria-hidden /> {dich('Bản chạy thật')}</button>}
          {p.videoUrl && <button type="button" className="da-nut" onClick={() => mo(p.videoUrl!)}><PlayCircle size={14} aria-hidden /> {dich('Video demo')}</button>}
        </div>

        <dl className="da-ct-tt">
          {p.category && <div><dt>{dich('Danh mục')}</dt><dd>{labelOf(CATEGORY_LABELS_I18N, p.category, lang)}</dd></div>}
          {p.difficulty && <div><dt>{dich('Mức độ')}</dt><dd>{labelOf(LEVEL_LABELS_I18N, p.difficulty, lang)}</dd></div>}
          {(p.role || p.roleEn) && <div><dt>{dich('Vai trò')}</dt><dd>{pick(p.role, p.roleEn)}</dd></div>}
          {(p.duration || p.durationEn) && <div><dt>{dich('Thời gian')}</dt><dd>{pick(p.duration, p.durationEn)}</dd></div>}
          {p.startDate && <div><dt>{dich('Bắt đầu')}</dt><dd>{ngay(p.startDate)}{p.endDate ? ` → ${ngay(p.endDate)}` : ''}</dd></div>}
          <div><dt>{dich('Lượt xem')}</dt><dd>{p.viewCount ?? 0}</dd></div>
        </dl>

        {(p.technologies?.length ?? 0) > 0 && (
          <section className="da-ct-khoi">
            <h3>{dich('Công nghệ')}</h3>
            <div className="da-cn da-cn-du">{(p.technologies ?? []).map((t) => <span key={t}>{t}</span>)}</div>
          </section>
        )}

        {tinhNang.length > 0 && (
          <section className="da-ct-khoi">
            <h3>{dich('Tính năng')} <small>{dichP('{x}/{n} xong', { x: xong, n: tinhNang.length })}</small></h3>
            <div className="da-ct-vach"><div style={{ width: `${(xong / tinhNang.length) * 100}%` }} /></div>
            <ul className="da-tn">
              {tinhNang.map((f) => (
                <li key={f.id}>
                  {ICON_TN[f.status] ?? ICON_TN.PLANNED}
                  <div>
                    <strong>{pick(f.title, f.titleEn)}</strong>
                    {(f.description || f.descriptionEn) && <p>{pick(f.description, f.descriptionEn)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(p.milestones?.length ?? 0) > 0 && (
          <section className="da-ct-khoi">
            <h3>{dich('Cột mốc')}</h3>
            <ol className="da-moc">
              {(p.milestones ?? []).map((m) => (
                <li key={m.id}>
                  <span className="da-moc-cham" />
                  <div>
                    <small>{labelOf(PHASE_LABELS_I18N, m.phase, lang)}{m.date ? ` · ${ngay(m.date)}` : ''}</small>
                    <strong>{pick(m.title, m.titleEn)}</strong>
                    {(m.description || m.descriptionEn) && <p>{pick(m.description, m.descriptionEn)}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {ketQuaHoc.length > 0 && (
          <section className="da-ct-khoi">
            <h3>{dich('Làm xong bạn sẽ')}</h3>
            <ul className="da-kq">
              {ketQuaHoc.map((x) => <li key={x.id}>{pick(x.content, x.contentEn)}</li>)}
            </ul>
          </section>
        )}

        {(p.resources?.length ?? 0) > 0 && (
          <section className="da-ct-khoi">
            <h3>{dich('Tài nguyên')}</h3>
            <div className="da-tn-ds">
              {(p.resources ?? []).map((r) => (
                <button key={r.id} type="button" className="da-tainguyen" onClick={() => mo(r.url)} title={r.url}>
                  {r.type === 'REPO' ? <Github size={14} aria-hidden /> : r.type === 'LINK' ? <Link2 size={14} aria-hidden /> : <FileText size={14} aria-hidden />}
                  <span>{pick(r.title, r.titleEn)}</span>
                  <ExternalLink size={12} aria-hidden className="da-tainguyen-ra" />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}

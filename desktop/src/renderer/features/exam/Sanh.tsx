/**
 * Sảnh Phòng thi — bố cục ba cột kiểu ứng dụng (04/10/2026).
 *
 *   ┌ cột lọc ─────┬ danh sách ─────────────────────┬ chi tiết đề ───────┐
 *   │ Đề thi       │ tìm · chỉ đề chưa thi           │ nhãn, số liệu      │
 *   │ Lịch sử      │ Kỳ → Môn (gập/mở) → hàng đề     │ hướng dẫn, file đề │
 *   │ Sổ tay       │                                 │ lượt đã thi        │
 *   │ Dạng đề      │                                 │ [Bắt đầu thi]      │
 *   │ Học kỳ       │                                 │ [Ôn với CuongMini] │
 *   └──────────────┴─────────────────────────────────┴────────────────────┘
 *
 * Mọi thứ của trang web đều có: ba thẻ Đề thi/Lịch sử/Sổ tay, lọc PT·FE·PE·Đọc·
 * Nói, tìm theo môn/mã, nhóm Kỳ → Môn, tiến độ đã thi/đạt mỗi môn, lưu đề, xoá
 * lượt, ghi chú cho câu đã lưu, liên kết sâu `?course=&kind=`.
 * Thêm của desktop: chọn đề bằng ↑/↓, Enter để vào; `/` để tìm; lọc theo học kỳ
 * ở cột trái; khung chi tiết tải trước hướng dẫn + lượt đang dở của đề đang chọn
 * nên bấm "Bắt đầu" là vào thi luôn; danh sách đề lưu trên máy để mở khi mất mạng.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  BookMarked, Bookmark, Bot, CheckCircle2, ChevronDown, ClipboardList, Clock, CloudOff,
  Download, Eye, FileCode2, Flag, History, Layers, ListChecks, Loader2, Mic, Play,
  RefreshCw, RotateCw, Search, Trash2, Trophy, X, XCircle, BookOpenText, Languages,
} from 'lucide-react';
import { examApi, type ExamHeader } from '@/lib/api';
import { pickLang, sanitizeHtml, stripInlineColors } from '@/lib/utils';
import ExamRichContent from '@/app/exam/ExamRichContent';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';
import { useSearchParams } from '../../shims/next-navigation';
import {
  CHU_CAI, THU_TU_LOAI, loaiDe, loiDoc, ngay, nhanDe, nhoBatDau, phutGiay, tenLoai,
  useNgonNguDe, useNoi,
  type CauDaLuu, type De, type DeDaLuu, type Loai, type LuotCuaToi,
} from './chung';

type The = 'de' | 'lichsu' | 'sotay';
type LocLoai = 'ALL' | Loai;

interface NhomMon { id: number; title: string; slug: string; code: string | null; des: De[] }
interface NhomKy { key: string; name: string; ordinal: number; mons: NhomMon[] }

const MAU_LOAI: Record<Loai, string> = {
  PT: 'exam-badge-pt', FE: 'exam-badge-fe', PE: 'exam-badge-pe',
  READING: 'exam-badge-reading', SPEAKING: 'exam-badge-speaking',
};

function IconLoai({ l, size = 13 }: { l: Loai; size?: number }) {
  if (l === 'PE') return <FileCode2 size={size} aria-hidden />;
  if (l === 'SPEAKING') return <Mic size={size} aria-hidden />;
  if (l === 'READING') return <BookOpenText size={size} aria-hidden />;
  if (l === 'PT') return <Flag size={size} aria-hidden />;
  return <ListChecks size={size} aria-hidden />;
}

export function Sanh() {
  const { t, en } = useNoi();
  const { navigate, online } = useAppState();
  const { userId } = useSession();
  const [L, datL] = useNgonNguDe();
  const sp = useSearchParams();

  const [the, datThe] = useState<The>('de');
  const [des, datDes] = useState<De[]>([]);
  const [cu, datCu] = useState(false);
  const [dangTai, datDangTai] = useState(true);
  const [loiTai, datLoiTai] = useState<string | null>(null);
  const [luots, datLuots] = useState<LuotCuaToi[]>([]);
  const [deLuu, datDeLuu] = useState<DeDaLuu[]>([]);
  const [cauLuu, datCauLuu] = useState<CauDaLuu[]>([]);
  const [tim, datTim] = useState('');
  const [loc, datLoc] = useState<LocLoai>('ALL');
  const [ky, datKy] = useState<string | null>(null);
  const [chuaThi, datChuaThi] = useState(false);
  const [chon, datChon] = useState<number | null>(null);
  const oTim = useRef<HTMLInputElement>(null);

  /* Liên kết sâu `/exam?course=JPD113&kind=READING` (Học viện mở sang) — y web. */
  useEffect(() => {
    const course = sp.get('course');
    const kind = sp.get('kind');
    if (course) datTim(course);
    if (kind && (['PT', 'FE', 'PE', 'READING', 'SPEAKING'] as string[]).includes(kind)) datLoc(kind as Loai);
  }, [sp]);

  const napDanhSach = useCallback(async () => {
    if (userId === null) return;
    datDangTai(true);
    datLoiTai(null);
    try {
      const kq = await swr<De[]>({
        userId,
        key: 'phongthi:ds:v2',
        fetcher: () => examApi.listAll().then((r) => r.data.data ?? []),
        online,
        ttlMs: 30 * 60 * 1000,
        onRefreshed: (moi) => { datDes(moi); datCu(false); },
      });
      datDes(kq.value);
      datCu(kq.isStale);
    } catch (e) {
      datLoiTai(e instanceof OfflineUnavailableError
        ? t('Chưa từng tải danh sách đề về máy nên không xem được khi ngoại tuyến.', 'The exam list was never downloaded, so it is not available offline.')
        : loiDoc(e, t('Không tải được danh sách đề.', 'Could not load exams.')));
    } finally {
      datDangTai(false);
    }
  }, [userId, online, t]);

  const napLuuTru = useCallback(() => {
    examApi.myExamBookmarks().then((r) => datDeLuu((r.data as { data: DeDaLuu[] }).data ?? [])).catch(() => {});
    examApi.myQuestionBookmarks().then((r) => datCauLuu((r.data as { data: CauDaLuu[] }).data ?? [])).catch(() => {});
  }, []);

  const napLuot = useCallback(() => {
    examApi.myAttempts().then((r) => datLuots((r.data as { data: LuotCuaToi[] }).data ?? [])).catch(() => {});
  }, []);

  useEffect(() => { void napDanhSach(); }, [napDanhSach]);
  useEffect(() => { if (online) { napLuot(); napLuuTru(); } }, [online, napLuot, napLuuTru]);

  const idDaLuu = useMemo(() => new Set(deLuu.map((b) => b.examId)), [deLuu]);

  const thongKe = useMemo(() => {
    const daThi = new Set<number>();
    const dat = new Set<number>();
    const tot = new Map<number, number>();
    for (const a of luots) {
      daThi.add(a.examId);
      if (a.passed === true) dat.add(a.examId);
      if (a.score != null) tot.set(a.examId, Math.max(tot.get(a.examId) ?? -Infinity, a.score));
    }
    return { daThi, dat, tot };
  }, [luots]);

  /* ── Hành động ───────────────────────────────────────────────────────── */
  const batLuuDe = useCallback(async (examId: number) => {
    try {
      const r = await examApi.toggleExamBookmark(examId);
      const on = r.data.data.bookmarked;
      datLuots((as) => as.map((a) => (a.examId === examId ? { ...a, bookmarked: on } : a)));
      napLuuTru();
      toast.success(on ? t('Đã lưu đề vào sổ tay', 'Saved to notebook') : t('Đã bỏ lưu', 'Removed'));
    } catch { toast.error(t('Không lưu được', 'Could not save')); }
  }, [napLuuTru, t]);

  const xoaLuot = useCallback(async (id: number) => {
    if (!window.confirm(t('Xoá lần thi này khỏi lịch sử?', 'Delete this attempt from your history?'))) return;
    try {
      await examApi.deleteAttempt(id);
      datLuots((as) => as.filter((a) => a.id !== id));
      toast.success(t('Đã xoá', 'Deleted'));
    } catch { toast.error(t('Không xoá được', 'Could not delete')); }
  }, [t]);

  const boLuuCau = useCallback(async (qid: number) => {
    try {
      await examApi.toggleQuestionBookmark(qid);
      datCauLuu((q) => q.filter((b) => b.questionId !== qid));
      toast.success(t('Đã bỏ lưu câu', 'Removed'));
    } catch { toast.error(t('Lỗi', 'Error')); }
  }, [t]);

  const luuGhiChu = useCallback(async (qid: number, note: string) => {
    try {
      await examApi.updateQuestionBookmarkNote(qid, note);
      datCauLuu((q) => q.map((b) => (b.questionId === qid ? { ...b, note } : b)));
      toast.success(t('Đã lưu ghi chú', 'Note saved'));
    } catch { toast.error(t('Lỗi lưu ghi chú', 'Could not save note')); }
  }, [t]);

  /* ── Lọc + nhóm Kỳ → Môn ─────────────────────────────────────────────── */
  const demLoai = useMemo(() => {
    const n = new Map<Loai, number>();
    for (const e of des) n.set(loaiDe(e), (n.get(loaiDe(e)) ?? 0) + 1);
    return n;
  }, [des]);

  const dsKy = useMemo(() => {
    const m = new Map<string, { key: string; name: string; ordinal: number; so: number }>();
    for (const e of des) {
      const key = e.semester?.code || 'self';
      const cur = m.get(key) ?? { key, name: e.semester?.name || t('Khoá học của web', 'Site courses'), ordinal: e.semester?.ordinal ?? 999, so: 0 };
      cur.so += 1;
      m.set(key, cur);
    }
    return [...m.values()].sort((a, b) => a.ordinal - b.ordinal);
  }, [des, t]);

  const locDuoc = useMemo(() => {
    const q = tim.trim().toLowerCase();
    return des.filter((e) => {
      if (loc !== 'ALL' && loaiDe(e) !== loc) return false;
      if (ky && (e.semester?.code || 'self') !== ky) return false;
      if (chuaThi && thongKe.daThi.has(e.id)) return false;
      if (!q) return true;
      return [e.title, e.course?.title, e.course?.courseCode, e.code].filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(q));
    });
  }, [des, tim, loc, ky, chuaThi, thongKe]);

  const nhom = useMemo<NhomKy[]>(() => {
    const bySem = new Map<string, { key: string; name: string; ordinal: number; mons: Map<number, NhomMon> }>();
    for (const e of locDuoc) {
      const key = e.semester?.code || 'self';
      if (!bySem.has(key)) bySem.set(key, { key, name: e.semester?.name || t('Khoá học của web', 'Site courses'), ordinal: e.semester?.ordinal ?? 999, mons: new Map() });
      const s = bySem.get(key)!;
      if (!s.mons.has(e.courseId)) {
        s.mons.set(e.courseId, { id: e.courseId, title: e.course?.title || `Course ${e.courseId}`, slug: e.course?.slug || '', code: e.course?.courseCode || null, des: [] });
      }
      s.mons.get(e.courseId)!.des.push(e);
    }
    return [...bySem.values()].sort((a, b) => a.ordinal - b.ordinal).map((s) => ({
      ...s,
      mons: [...s.mons.values()].sort((a, b) => (a.code || '').localeCompare(b.code || '') || a.title.localeCompare(b.title)),
    }));
  }, [locDuoc, t]);

  /* Môn mở/gập. Đang tìm, đang lọc dạng hay đã chọn một kỳ ⇒ mở hết: một kết
     quả bị gập lại cũng như không có kết quả. */
  const [monMo, datMonMo] = useState<Set<number>>(new Set());
  const moHet = tim.trim().length > 0 || loc !== 'ALL' || ky !== null || chuaThi;
  const monDangMo = (id: number) => moHet || monMo.has(id);
  const tongMon = nhom.reduce((n, s) => n + s.mons.length, 0);

  /* Thứ tự đề ĐANG HIỆN — để ↑/↓ đi đúng thứ tự mắt thấy. */
  const deHien = useMemo(
    () => nhom.flatMap((s) => s.mons.flatMap((m) => (monDangMo(m.id) ? m.des : []))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nhom, monMo, moHet],
  );

  /* Phím: `/` tìm, ↑/↓ chọn, Enter vào thi. Bỏ qua khi đang gõ trong ô nhập. */
  useEffect(() => {
    if (the !== 'de') return;
    const onKey = (ev: KeyboardEvent) => {
      const el = ev.target as HTMLElement | null;
      const dangGo = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (ev.key === '/' && !dangGo) { ev.preventDefault(); oTim.current?.focus(); return; }
      if (dangGo || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        if (!deHien.length) return;
        ev.preventDefault();
        const i = deHien.findIndex((e) => e.id === chon);
        const j = ev.key === 'ArrowDown' ? Math.min(deHien.length - 1, i + 1) : Math.max(0, i < 0 ? 0 : i - 1);
        const id = deHien[j]!.id;
        datChon(id);
        document.getElementById(`ctx-de-${id}`)?.scrollIntoView({ block: 'nearest' });
      } else if (ev.key === 'Enter' && chon != null) {
        ev.preventDefault();
        navigate(`/exam/${chon}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [the, deHien, chon, navigate]);

  const deChon = chon != null ? des.find((e) => e.id === chon) ?? null : null;
  const soDangLuu = deLuu.length + cauLuu.length;

  return (
    <div className="ctx-sanh exam-root" data-ml={L} data-co-ct={the === 'de'}>
      {/* ═══ Cột lọc ═══ */}
      <aside className="ctx-ray" aria-label={t('Bộ lọc phòng thi', 'Exam Room filters')}>
        <div className="ctx-ray-dau">
          <span className="ctx-logo"><ClipboardList size={18} aria-hidden /></span>
          <div>
            <h1>{t('Phòng thi', 'Exam Room')}</h1>
            <p>{des.length ? t(`${des.length} đề · thi như trên trường`, `${des.length} papers · like at school`) : t('Đề FE & PE theo môn', 'FE & PE papers by subject')}</p>
          </div>
        </div>

        <nav className="ctx-ray-nhom" aria-label={t('Mục', 'Sections')}>
          <NutRay on={the === 'de'} onClick={() => datThe('de')} icon={<Layers size={15} />} nhan={t('Đề thi', 'Exams')} so={des.length} />
          <NutRay on={the === 'lichsu'} onClick={() => datThe('lichsu')} icon={<History size={15} />} nhan={t('Lịch sử', 'History')} so={luots.length} />
          <NutRay on={the === 'sotay'} onClick={() => datThe('sotay')} icon={<BookMarked size={15} />} nhan={t('Sổ tay ôn tập', 'Notebook')} so={soDangLuu} />
        </nav>

        {the === 'de' && (
          <>
            <div className="ctx-ray-tieude">{t('Dạng đề', 'Paper type')}</div>
            <nav className="ctx-ray-nhom">
              <NutRay on={loc === 'ALL'} onClick={() => datLoc('ALL')} icon={<Layers size={14} />} nhan={t('Tất cả', 'All')} so={des.length} />
              {THU_TU_LOAI.filter((l) => demLoai.has(l)).map((l) => (
                <NutRay key={l} on={loc === l} onClick={() => datLoc(loc === l ? 'ALL' : l)}
                  icon={<span className={`ctx-cham ctx-cham-${l.toLowerCase()}`}><IconLoai l={l} size={12} /></span>}
                  nhan={tenLoai(l, en)} so={demLoai.get(l) ?? 0} />
              ))}
            </nav>

            {dsKy.length > 1 && (
              <>
                <div className="ctx-ray-tieude">{t('Học kỳ', 'Semester')}</div>
                <nav className="ctx-ray-nhom ctx-ray-ky">
                  <NutRay on={ky === null} onClick={() => datKy(null)} nhan={t('Mọi học kỳ', 'All semesters')} so={des.length} />
                  {dsKy.map((k) => (
                    <NutRay key={k.key} on={ky === k.key} onClick={() => datKy(ky === k.key ? null : k.key)} nhan={k.name} so={k.so} />
                  ))}
                </nav>
              </>
            )}
          </>
        )}

        <div className="ctx-ray-chan">
          <button type="button" className="ctx-nn" onClick={() => datL(L === 'en' ? 'vi' : 'en')}
            title={t('Ngôn ngữ nội dung đề (giao diện theo cài đặt app)', 'Exam content language (UI follows app setting)')}>
            <Languages size={14} aria-hidden />
            <span className="ctx-nn-nhan">{t('Ngôn ngữ đề', 'Paper language')}</span>
            <span className="ctx-nn-chon"><b data-on={L === 'en'}>EN</b><b data-on={L === 'vi'}>VI</b></span>
          </button>
        </div>
      </aside>

      {/* ═══ Cột giữa ═══ */}
      <main className="ctx-giua">
        <div className="ctx-thanh">
          {the === 'de' ? (
            <>
              <label className="ctx-tim">
                <Search size={15} aria-hidden />
                <input ref={oTim} value={tim} onChange={(e) => datTim(e.target.value)}
                  placeholder={t('Tìm môn, mã môn (PRO192), tên đề…', 'Search subject, code (PRO192), paper…')}
                  aria-label={t('Tìm đề thi', 'Search exams')} />
                {tim ? (
                  <button type="button" onClick={() => datTim('')} aria-label={t('Xoá tìm kiếm', 'Clear search')}><X size={13} /></button>
                ) : <kbd>/</kbd>}
              </label>
              <button type="button" className="ctx-chip" data-on={chuaThi} onClick={() => datChuaThi((v) => !v)}>
                {t('Chỉ đề chưa thi', 'Not taken yet')}
              </button>
              {!moHet && tongMon > 0 && (
                <button type="button" className="ctx-chip" onClick={() => {
                  const all = nhom.flatMap((s) => s.mons.map((m) => m.id));
                  datMonMo((s) => (s.size >= all.length ? new Set() : new Set(all)));
                }}>
                  {monMo.size >= tongMon ? t('Thu gọn tất cả', 'Collapse all') : t('Mở tất cả', 'Expand all')}
                </button>
              )}
            </>
          ) : (
            <h2 className="ctx-thanh-ten">{the === 'lichsu' ? t('Lịch sử thi', 'Attempt history') : t('Sổ tay ôn tập', 'Revision notebook')}</h2>
          )}
          <span className="ctx-thanh-gian" />
          {cu && <span className="ctx-cu"><CloudOff size={13} aria-hidden /> {t('bản đã lưu', 'cached')}</span>}
          <div className="ctx-tk" aria-label={t('Tiến độ của bạn', 'Your progress')}>
            <span><b>{thongKe.daThi.size}</b> {t('đã thi', 'taken')}</span>
            <span className="ctx-tk-dat"><b>{thongKe.dat.size}</b> {t('đạt', 'passed')}</span>
          </div>
          <button type="button" className="ctx-icon" onClick={() => { void napDanhSach(); napLuot(); napLuuTru(); }}
            title={t('Tải lại', 'Reload')} aria-label={t('Tải lại', 'Reload')}>
            <RefreshCw size={14} aria-hidden />
          </button>
        </div>

        <div className="ctx-cuon">
          {the === 'de' && (
            loiTai ? (
              <div className="ct-empty">
                <CloudOff size={26} aria-hidden className="ct-empty-icon" />
                <p>{loiTai}</p>
                <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void napDanhSach()}>{t('Thử lại', 'Retry')}</button>
              </div>
            ) : dangTai && des.length === 0 ? (
              <div className="ctx-xuong">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="ctx-xuong-hang" />)}</div>
            ) : nhom.length === 0 ? (
              <div className="ct-empty">
                <Search size={26} aria-hidden className="ct-empty-icon" />
                <p>{t('Không đề nào khớp bộ lọc đang chọn.', 'No paper matches the current filters.')}</p>
                <button type="button" className="ct-btn ct-btn-ghost" onClick={() => { datTim(''); datLoc('ALL'); datKy(null); datChuaThi(false); }}>
                  {t('Bỏ hết bộ lọc', 'Clear all filters')}
                </button>
              </div>
            ) : (
              nhom.map((s) => (
                <section key={s.key} className="ctx-ky">
                  <h2 className="ctx-ky-ten">
                    {s.name}
                    <span>{t(`${s.mons.length} môn · ${s.mons.reduce((n, m) => n + m.des.length, 0)} đề`, `${s.mons.length} subjects · ${s.mons.reduce((n, m) => n + m.des.length, 0)} papers`)}</span>
                  </h2>
                  {s.mons.map((m) => (
                    <KhoiMon key={m.id} mon={m} L={L} en={en} t={t} mo={monDangMo(m.id)}
                      onGap={() => datMonMo((cur) => { const n = new Set(cur); if (n.has(m.id)) n.delete(m.id); else n.add(m.id); return n; })}
                      chon={chon} onChon={datChon} onMo={(id) => navigate(`/exam/${id}`)}
                      thongKe={thongKe} idDaLuu={idDaLuu} onLuu={batLuuDe} />
                  ))}
                </section>
              ))
            )
          )}

          {the === 'lichsu' && (
            <LichSu luots={luots} L={L} en={en} t={t} idDaLuu={idDaLuu}
              onXem={(id) => navigate(`/exam/attempt/${id}`)} onThiLai={(id) => navigate(`/exam/${id}`)}
              onLuu={batLuuDe} onXoa={xoaLuot} onSangDe={() => datThe('de')} />
          )}

          {the === 'sotay' && (
            <SoTay deLuu={deLuu} cauLuu={cauLuu} L={L} en={en} t={t}
              onMoDe={(id) => navigate(`/exam/${id}`)} onBoDe={batLuuDe} onBoCau={boLuuCau} onGhiChu={luuGhiChu} />
          )}
        </div>
      </main>

      {/* ═══ Khung chi tiết ═══ */}
      {the === 'de' && (
        <aside className="ctx-ct" aria-label={t('Chi tiết đề', 'Paper details')}>
          {deChon ? (
            <ChiTiet key={deChon.id} de={deChon} L={L} en={en} t={t}
              luots={luots.filter((a) => a.examId === deChon.id)}
              daLuu={idDaLuu.has(deChon.id)} onLuu={() => void batLuuDe(deChon.id)}
              onBatDau={(ai) => { nhoBatDau(deChon.id, ai); navigate(`/exam/${deChon.id}`); }}
              onXemLuot={(id) => navigate(`/exam/attempt/${id}`)} online={online} />
          ) : (
            <div className="ctx-ct-trong">
              <ClipboardList size={30} aria-hidden />
              <p>{t('Chọn một đề để xem chi tiết', 'Pick a paper to see its details')}</p>
              <small>{t('↑ ↓ để chọn · Enter để vào thi · / để tìm', '↑ ↓ to select · Enter to open · / to search')}</small>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

function NutRay({ on, onClick, icon, nhan, so }: { on: boolean; onClick: () => void; icon?: React.ReactNode; nhan: string; so?: number }) {
  return (
    <button type="button" className="ctx-ray-nut" data-on={on} onClick={onClick} aria-pressed={on}>
      {icon}
      <span className="ctx-ray-nhan">{nhan}</span>
      {so != null && so > 0 && <span className="ctx-ray-so">{so}</span>}
    </button>
  );
}

type T = (vi: string, en: string) => string;

/* ── Một môn: đầu môn (gập/mở) + hàng đề ──────────────────────────────── */
function KhoiMon({ mon, L, en, t, mo, onGap, chon, onChon, onMo, thongKe, idDaLuu, onLuu }: {
  mon: NhomMon; L: 'en' | 'vi'; en: boolean; t: T; mo: boolean; onGap: () => void;
  chon: number | null; onChon: (id: number) => void; onMo: (id: number) => void;
  thongKe: { daThi: Set<number>; dat: Set<number>; tot: Map<number, number> };
  idDaLuu: Set<number>; onLuu: (id: number) => void;
}) {
  const dem = new Map<Loai, number>();
  for (const e of mon.des) dem.set(loaiDe(e), (dem.get(loaiDe(e)) ?? 0) + 1);
  const daThi = mon.des.filter((e) => thongKe.daThi.has(e.id)).length;
  const dat = mon.des.filter((e) => thongKe.dat.has(e.id)).length;
  const pct = mon.des.length ? Math.round((daThi / mon.des.length) * 100) : 0;
  return (
    <div className="ctx-mon" data-mo={mo}>
      <button type="button" className="ctx-mon-dau" onClick={onGap} aria-expanded={mo}>
        <ChevronDown size={15} className="ctx-mon-mui" aria-hidden />
        {mon.code && <span className="ctx-ma">{mon.code}</span>}
        <span className="ctx-mon-ten">{pickLang(mon.title, L)}</span>
        <span className="ctx-mon-loai">
          {THU_TU_LOAI.filter((l) => dem.has(l)).map((l) => (
            <span key={l} className={`exam-badge ${MAU_LOAI[l]}`}>{tenLoai(l, en, true)} {dem.get(l)}</span>
          ))}
        </span>
        <span className="ctx-mon-tiendo" title={t(`Đã thi ${daThi}/${mon.des.length} · đạt ${dat}`, `${daThi}/${mon.des.length} taken · ${dat} passed`)}>
          <span className="ctx-vach"><span style={{ width: `${pct}%` }} /></span>
          <span>{daThi}/{mon.des.length}</span>
          {dat > 0 && <span className="ctx-dat"><CheckCircle2 size={12} aria-hidden />{dat}</span>}
        </span>
      </button>
      {mo && (
        <div className="ctx-mon-ds" role="listbox" aria-label={pickLang(mon.title, L)}>
          {mon.des.map((e) => {
            const l = loaiDe(e);
            const done = thongKe.daThi.has(e.id);
            const ok = thongKe.dat.has(e.id);
            const tot = thongKe.tot.get(e.id);
            return (
              <div key={e.id} id={`ctx-de-${e.id}`} className="ctx-hang" role="option" aria-selected={chon === e.id}
                data-chon={chon === e.id} tabIndex={-1}
                onClick={() => onChon(e.id)} onDoubleClick={() => onMo(e.id)}>
                <span className={`ctx-hang-icon ctx-cham-${l.toLowerCase()}`}><IconLoai l={l} size={14} /></span>
                <span className="ctx-hang-giua">
                  <span className="ctx-hang-ten">{pickLang(e.title, L)}</span>
                  <span className="ctx-hang-phu">
                    <span className={`exam-badge ${MAU_LOAI[l]}`}>{nhanDe(e, en)}</span>
                    {e.code && <span>{e.code}</span>}
                    <span><Clock size={11} aria-hidden /> {e.durationMinutes}′</span>
                    <span>{e.questionCount} {t('câu', 'q')}</span>
                  </span>
                </span>
                {done && (
                  <span className="ctx-hang-kq" data-ok={ok}>
                    {ok ? <CheckCircle2 size={13} aria-hidden /> : <XCircle size={13} aria-hidden />}
                    {tot != null ? `${tot}/${e.totalPoints}` : ok ? t('đạt', 'passed') : t('đã thi', 'taken')}
                  </span>
                )}
                <button type="button" className="ctx-sao" data-on={idDaLuu.has(e.id)}
                  onClick={(ev) => { ev.stopPropagation(); onLuu(e.id); }}
                  title={idDaLuu.has(e.id) ? t('Bỏ lưu', 'Remove bookmark') : t('Lưu đề', 'Bookmark')}
                  aria-label={idDaLuu.has(e.id) ? t('Bỏ lưu', 'Remove bookmark') : t('Lưu đề', 'Bookmark')}>
                  <Bookmark size={14} fill={idDaLuu.has(e.id) ? 'currentColor' : 'none'} aria-hidden />
                </button>
                <button type="button" className="ctx-hang-vao" onClick={(ev) => { ev.stopPropagation(); onMo(e.id); }}>
                  {t('Vào', 'Open')}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Khung chi tiết: tải trước đề để có hướng dẫn + lượt đang dở ───────── */
function ChiTiet({ de, L, en, t, luots, daLuu, onLuu, onBatDau, onXemLuot, online }: {
  de: De; L: 'en' | 'vi'; en: boolean; t: T; luots: LuotCuaToi[]; daLuu: boolean;
  onLuu: () => void; onBatDau: (ai: boolean) => void; onXemLuot: (id: number) => void; online: boolean;
}) {
  const [dau, datDau] = useState<ExamHeader | null>(null);
  const [dangTai, datDangTai] = useState(false);

  /* Chờ 180ms rồi mới tải: giữ ↓ để lướt qua 20 đề thì không bắn 20 yêu cầu. */
  useEffect(() => {
    if (!online) return;
    let huy = false;
    const h = window.setTimeout(() => {
      datDangTai(true);
      examApi.getForTaking(de.id)
        .then((r) => { if (!huy) datDau(r.data.data); })
        .catch(() => { /* khung vẫn đủ dùng với dữ liệu danh sách */ })
        .finally(() => { if (!huy) datDangTai(false); });
    }, 180);
    return () => { huy = true; window.clearTimeout(h); };
  }, [de.id, online]);

  const l = loaiDe(de);
  const my = dau?.my;
  const goiY = l === 'PE'
    ? de.peType === 'CODE'
      ? t('Đọc đề, viết code ở IDE của bạn, nén thành .zip rồi nộp để AI chấm.', 'Read the problems, code in your own IDE, then upload one .zip for AI grading.')
      : de.peType === 'WRITE'
        ? t('Viết bài bằng TIẾNG ANH ngay trong phòng thi. AI chấm theo tiêu chí.', 'Write your answer in ENGLISH right here. AI grades it against a rubric.')
        : t('Thu âm câu trả lời cho từng câu hỏi. AI chấm nội dung & phát âm.', 'Record your answer for each question. AI grades content & pronunciation.')
    : l === 'SPEAKING'
      ? t('Thu âm câu trả lời cho từng câu hỏi. AI chấm nội dung & phát âm.', 'Record your answer for each question. AI grades content & pronunciation.')
      : l === 'PT'
        ? t('Trắc nghiệm kèm 1–2 câu lập trình gõ ngay trong phòng. Trắc nghiệm chấm tự động, câu code AI chấm.', 'Multiple choice plus 1–2 coding questions typed in the room. MCQs auto-graded, code AI-graded.')
        : t('Chọn đáp án cho từng câu, có câu chọn nhiều. Chấm tự động ngay khi nộp.', 'Answer each question; some allow several answers. Auto-graded on submit.');

  return (
    <div className="ctx-ct-ruot">
      <div className="ctx-ct-nhan">
        <span className={`exam-badge ${MAU_LOAI[l]}`}><IconLoai l={l} size={12} /> {nhanDe(de, en)}</span>
        {dau?.source === 'REAL' && <span className="exam-badge exam-badge-real">{t('Đề thật', 'Real paper')}</span>}
        {de.course?.courseCode && <span className="ctx-ma">{de.course.courseCode}</span>}
      </div>
      <h2 className="ctx-ct-ten">{pickLang(de.title, L)}</h2>
      <p className="ctx-ct-mon">
        {de.course?.title ? pickLang(de.course.title, L) : ''}{de.semester?.name ? ` · ${de.semester.name}` : ''}{de.code ? ` · ${de.code}` : ''}
      </p>

      <dl className="ctx-so">
        <div><dt>{t('Thời gian', 'Duration')}</dt><dd>{de.durationMinutes}′</dd></div>
        <div><dt>{t('Số câu', 'Questions')}</dt><dd>{de.questionCount}</dd></div>
        <div><dt>{t('Tối đa', 'Max')}</dt><dd>{de.totalPoints}</dd></div>
        <div><dt>{t('Điểm đạt', 'Pass')}</dt><dd>≥ {de.passMark}</dd></div>
      </dl>

      {dau?.description && <p className="ctx-ct-mota">{pickLang(dau.description, L)}</p>}
      <p className="ctx-ct-goiy">{goiY}</p>

      {dau?.instructions && (
        <details className="ctx-ct-hd">
          <summary>{t('Hướng dẫn làm bài', 'Instructions')}</summary>
          <div className="rich-content" data-ml={L}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColors(pickLang(dau.instructions, L))) }} />
        </details>
      )}
      {dau?.attachmentUrl && (
        <a className="ctx-ct-file" href={dau.attachmentUrl} download target="_blank" rel="noreferrer">
          <Download size={14} aria-hidden /> {pickLang(dau.attachmentName || 'Download exam files (Given)|||Tải file đề (Given)', L)}
        </a>
      )}

      <div className="ctx-ct-nut">
        <button type="button" className="ctx-nut-chinh" onClick={() => onBatDau(false)} disabled={!online}>
          <Play size={15} aria-hidden />
          {my?.inProgressId ? t('Tiếp tục bài thi', 'Resume attempt') : t('Bắt đầu thi', 'Start exam')}
        </button>
        <button type="button" className="ctx-nut-ai" onClick={() => onBatDau(true)} disabled={!online}
          title={t('Phòng ôn tập: không tính giờ, hỏi AI từng câu (Pro)', 'Study room: untimed, ask AI per question (Pro)')}>
          <Bot size={15} aria-hidden />
          {my?.aiInProgressId ? t('Tiếp tục với CuongMini', 'Continue with CuongMini') : t('Ôn với CuongMini', 'Study with CuongMini')}
        </button>
        <button type="button" className="ctx-nut-phu" data-on={daLuu} onClick={onLuu}>
          <Bookmark size={14} fill={daLuu ? 'currentColor' : 'none'} aria-hidden /> {daLuu ? t('Đã lưu', 'Saved') : t('Lưu đề', 'Save')}
        </button>
      </div>
      {!online && <p className="ctx-ct-goiy">{t('Đang ngoại tuyến — cần mạng để thi.', 'Offline — you need a connection to take a paper.')}</p>}
      {dangTai && !dau && <p className="ctx-ct-tai"><Loader2 size={12} className="ct-spin" aria-hidden /> {t('Đang tải chi tiết…', 'Loading details…')}</p>}

      <div className="ctx-ct-luot">
        <div className="ctx-ray-tieude">{t('Lượt đã thi', 'Your attempts')}</div>
        {luots.length === 0 ? (
          <p className="ctx-ct-goiy">{t('Chưa thi đề này lần nào.', 'Not taken yet.')}</p>
        ) : (
          <>
            {my?.bestScore != null && (
              <p className="ctx-ct-tot"><Trophy size={13} aria-hidden /> {t('Cao nhất', 'Best')}: <b>{my.bestScore}</b>/{de.totalPoints}</p>
            )}
            <ul>
              {luots.slice(0, 8).map((a) => (
                <li key={a.id}>
                  <button type="button" onClick={() => onXemLuot(a.id)}>
                    {a.passed ? <CheckCircle2 size={13} className="ctx-xanh" aria-hidden /> : <XCircle size={13} className="ctx-do" aria-hidden />}
                    <b>{a.score ?? '—'}</b>/{a.maxScore ?? de.totalPoints}
                    <span>{phutGiay(a.timeSpentSeconds)}</span>
                    <span className="ctx-ct-ngay">{ngay(a.submittedAt, en)}</span>
                    <Eye size={13} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Lịch sử ───────────────────────────────────────────────────────────── */
function LichSu({ luots, L, en, t, idDaLuu, onXem, onThiLai, onLuu, onXoa, onSangDe }: {
  luots: LuotCuaToi[]; L: 'en' | 'vi'; en: boolean; t: T; idDaLuu: Set<number>;
  onXem: (id: number) => void; onThiLai: (examId: number) => void; onLuu: (examId: number) => void;
  onXoa: (id: number) => void; onSangDe: () => void;
}) {
  if (luots.length === 0) {
    return (
      <div className="ct-empty">
        <History size={26} aria-hidden className="ct-empty-icon" />
        <p>{t('Bạn chưa thi đề nào.', 'No attempts yet.')}</p>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={onSangDe}>{t('Chọn đề để thi', 'Pick a paper')}</button>
      </div>
    );
  }
  const dat = luots.filter((a) => a.passed === true).length;
  const tb = Math.round(luots.reduce((n, a) => n + (a.maxScore ? ((a.score ?? 0) / a.maxScore) * 100 : 0), 0) / luots.length);
  return (
    <>
      <div className="ctx-tongket">
        <div><b>{luots.length}</b><span>{t('lượt thi', 'attempts')}</span></div>
        <div><b className="ctx-xanh">{dat}</b><span>{t('đạt', 'passed')}</span></div>
        <div><b>{luots.length - dat}</b><span>{t('chưa đạt', 'not passed')}</span></div>
        <div><b>{tb}%</b><span>{t('điểm trung bình', 'average')}</span></div>
      </div>
      <div className="ctx-bang" role="table">
        <div className="ctx-bang-dau" role="row">
          <span>{t('Đề', 'Paper')}</span><span>{t('Điểm', 'Score')}</span><span>{t('Thời gian', 'Time')}</span><span>{t('Ngày', 'Date')}</span><span />
        </div>
        {luots.map((a) => {
          const l = loaiDe(a.exam);
          return (
            <div key={a.id} className="ctx-bang-hang" role="row" onDoubleClick={() => onXem(a.id)}>
              <span className="ctx-bang-de">
                <span className="ctx-hang-phu">
                  <span className={`exam-badge ${MAU_LOAI[l]}`}>{nhanDe(a.exam, en)}</span>
                  {a.exam.course?.courseCode && <span className="ctx-ma">{a.exam.course.courseCode}</span>}
                  {a.exam.semester && <span>{a.exam.semester.name}</span>}
                  {a.exam.code && <span>{a.exam.code}</span>}
                </span>
                <span className="ctx-hang-ten">{pickLang(a.exam.title, L)}</span>
              </span>
              <span className="ctx-bang-diem" data-ok={a.passed === true}>
                {a.passed ? <CheckCircle2 size={14} aria-hidden /> : <XCircle size={14} aria-hidden />}
                <b>{a.score ?? '—'}</b>/{a.maxScore ?? '—'}
              </span>
              <span className="ctx-mo"><Clock size={12} aria-hidden /> {phutGiay(a.timeSpentSeconds)}</span>
              <span className="ctx-mo">{ngay(a.submittedAt, en)}</span>
              <span className="ctx-bang-nut">
                <button type="button" className="ctx-icon" onClick={() => onXem(a.id)} title={t('Xem lại', 'Review')} aria-label={t('Xem lại', 'Review')}><Eye size={14} /></button>
                <button type="button" className="ctx-icon" onClick={() => onThiLai(a.examId)} title={t('Thi lại', 'Retake')} aria-label={t('Thi lại', 'Retake')}><RotateCw size={14} /></button>
                <button type="button" className="ctx-icon ctx-sao" data-on={idDaLuu.has(a.examId)} onClick={() => onLuu(a.examId)} title={t('Lưu đề', 'Bookmark')} aria-label={t('Lưu đề', 'Bookmark')}>
                  <Bookmark size={14} fill={idDaLuu.has(a.examId) ? 'currentColor' : 'none'} />
                </button>
                <button type="button" className="ctx-icon ctx-icon-xoa" onClick={() => onXoa(a.id)} title={t('Xoá', 'Delete')} aria-label={t('Xoá', 'Delete')}><Trash2 size={14} /></button>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Sổ tay ôn tập: đề đã lưu + câu đã lưu theo Kỳ → Môn ──────────────── */
function SoTay({ deLuu, cauLuu, L, en, t, onMoDe, onBoDe, onBoCau, onGhiChu }: {
  deLuu: DeDaLuu[]; cauLuu: CauDaLuu[]; L: 'en' | 'vi'; en: boolean; t: T;
  onMoDe: (id: number) => void; onBoDe: (id: number) => void; onBoCau: (qid: number) => void; onGhiChu: (qid: number, note: string) => void;
}) {
  const thuMuc = useMemo(() => {
    const bySem = new Map<string, { name: string; ordinal: number; mons: Map<string, { code: string; title: string; items: CauDaLuu[] }> }>();
    for (const b of cauLuu) {
      const k = b.semester?.code || 'other';
      if (!bySem.has(k)) bySem.set(k, { name: b.semester?.name || t('Khác', 'Other'), ordinal: b.semester?.ordinal ?? 999, mons: new Map() });
      const s = bySem.get(k)!;
      const code = b.course?.courseCode || `#${b.exam.courseId}`;
      if (!s.mons.has(code)) s.mons.set(code, { code, title: b.course?.title || code, items: [] });
      s.mons.get(code)!.items.push(b);
    }
    return [...bySem.values()].sort((a, b) => a.ordinal - b.ordinal)
      .map((s) => ({ ...s, mons: [...s.mons.values()].sort((a, b) => a.code.localeCompare(b.code)) }));
  }, [cauLuu, t]);

  if (deLuu.length === 0 && cauLuu.length === 0) {
    return (
      <div className="ct-empty">
        <BookMarked size={26} aria-hidden className="ct-empty-icon" />
        <p>{t('Sổ tay đang trống.', 'Your notebook is empty.')}</p>
        <p className="ctx-mo">{t('Bấm biểu tượng lưu trên đề để lưu đề, hoặc lưu từng câu khó ở trang kết quả để ôn lại.', 'Bookmark a paper, or save any hard question from a result page to review later.')}</p>
      </div>
    );
  }

  return (
    <div className="ctx-sotay">
      {deLuu.length > 0 && (
        <section>
          <h3 className="ctx-ray-tieude">{t('Đề đã lưu', 'Saved papers')} · {deLuu.length}</h3>
          <div className="ctx-luoi-de">
            {deLuu.map((b) => {
              const l = loaiDe(b.exam);
              return (
                <div key={b.id} className="ctx-the-de">
                  <button type="button" className="ctx-the-de-chinh" onClick={() => onMoDe(b.examId)}>
                    <span className="ctx-hang-phu">
                      <span className={`exam-badge ${MAU_LOAI[l]}`}>{nhanDe(b.exam, en)}</span>
                      {b.course?.courseCode && <span className="ctx-ma">{b.course.courseCode}</span>}
                      {b.semester && <span>{b.semester.name}</span>}
                    </span>
                    <span className="ctx-hang-ten">{pickLang(b.exam.title, L)}</span>
                    <span className="ctx-hang-phu"><span><Clock size={11} aria-hidden /> {b.exam.durationMinutes}′</span><span>{b.exam.questionCount} {t('câu', 'q')}</span></span>
                  </button>
                  <button type="button" className="ctx-sao" data-on onClick={() => onBoDe(b.examId)} title={t('Bỏ lưu', 'Remove')} aria-label={t('Bỏ lưu', 'Remove')}>
                    <Bookmark size={14} fill="currentColor" aria-hidden />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {cauLuu.length > 0 && (
        <section>
          <h3 className="ctx-ray-tieude">{t('Câu đã lưu', 'Saved questions')} · {cauLuu.length}</h3>
          {thuMuc.map((s) => (
            <div key={s.name} className="ctx-sotay-ky">
              <div className="ctx-sotay-ky-ten">{s.name}</div>
              {s.mons.map((m) => <ThuMucMon key={m.code} mon={m} L={L} t={t} onMoDe={onMoDe} onBoCau={onBoCau} onGhiChu={onGhiChu} />)}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function ThuMucMon({ mon, L, t, onMoDe, onBoCau, onGhiChu }: {
  mon: { code: string; title: string; items: CauDaLuu[] }; L: 'en' | 'vi'; t: T;
  onMoDe: (id: number) => void; onBoCau: (qid: number) => void; onGhiChu: (qid: number, note: string) => void;
}) {
  const [mo, datMo] = useState(true);
  return (
    <div className="ctx-mon" data-mo={mo}>
      <button type="button" className="ctx-mon-dau" onClick={() => datMo((v) => !v)} aria-expanded={mo}>
        <ChevronDown size={15} className="ctx-mon-mui" aria-hidden />
        <span className="ctx-ma">{mon.code}</span>
        <span className="ctx-mon-ten">{pickLang(mon.title, L)}</span>
        <span className="ctx-mo">{mon.items.length} {t('câu', 'q')}</span>
      </button>
      {mo && (
        <div className="ctx-sotay-cau">
          {mon.items.map((b) => <TheCau key={b.id} b={b} L={L} t={t} onMoDe={onMoDe} onBoCau={onBoCau} onGhiChu={onGhiChu} />)}
        </div>
      )}
    </div>
  );
}

function TheCau({ b, L, t, onMoDe, onBoCau, onGhiChu }: {
  b: CauDaLuu; L: 'en' | 'vi'; t: T;
  onMoDe: (id: number) => void; onBoCau: (qid: number) => void; onGhiChu: (qid: number, note: string) => void;
}) {
  const q = b.question;
  const [note, datNote] = useState(b.note || '');
  const [giai, datGiai] = useState(false);
  const [dapAn, datDapAn] = useState(false);
  const dirty = note.trim() !== (b.note || '').trim();
  return (
    <article className="ctx-cau-luu">
      <header>
        <span className="exam-badge exam-badge-fe">{q.kind === 'MCQ' ? t('Trắc nghiệm', 'MCQ') : q.kind}</span>
        <span className="ctx-mo ctx-cau-luu-de">{b.exam.code || pickLang(b.exam.title, L)}</span>
        <button type="button" className="ctx-icon" onClick={() => onMoDe(b.examId)} title={t('Vào đề', 'Open paper')} aria-label={t('Vào đề', 'Open paper')}><RotateCw size={13} /></button>
        <button type="button" className="ctx-icon ctx-icon-xoa" onClick={() => onBoCau(q.id)} title={t('Bỏ lưu', 'Remove')} aria-label={t('Bỏ lưu', 'Remove')}><Trash2 size={13} /></button>
      </header>
      <ExamRichContent html={q.prompt} L={L} className="ctx-cau-luu-de-bai" />
      {q.kind === 'MCQ' && q.options && (
        <>
          <ul className="ctx-cau-luu-pa">
            {q.options.map((o, i) => {
              const dung = dapAn && q.correctIndexes.includes(i);
              return (
                <li key={i} data-dung={dung}>
                  <b>{CHU_CAI[i]}</b>
                  <ExamRichContent html={o.text} L={L} inline />
                  {dung && <CheckCircle2 size={13} className="ctx-xanh" aria-hidden />}
                </li>
              );
            })}
          </ul>
          {/* Đáp án đóng sẵn: sổ tay là chỗ ÔN — nhìn đáp án trước khi kịp nghĩ
              là mất luôn lượt tự kiểm tra. */}
          <button type="button" className="ctx-link" onClick={() => datDapAn((v) => !v)}>
            {dapAn ? t('Ẩn đáp án', 'Hide answer') : t('Hiện đáp án', 'Show answer')}
          </button>
        </>
      )}
      {q.explanation && (
        <>
          <button type="button" className="ctx-link" onClick={() => datGiai((v) => !v)}>
            {giai ? t('Ẩn giải thích', 'Hide explanation') : t('Xem giải thích', 'Show explanation')}
          </button>
          {giai && <ExamRichContent html={q.explanation} L={L} className="exam-explain ctx-giai" />}
        </>
      )}
      <div className="ctx-ghichu">
        <textarea value={note} onChange={(e) => datNote(e.target.value)} rows={1}
          placeholder={t('Ghi chú của bạn (vì sao khó nhớ…)', 'Your note (why it was tricky…)')} className="exam-note" />
        {dirty && <button type="button" className="ctx-nut-chinh ctx-nut-nho" onClick={() => onGhiChu(q.id, note)}>{t('Lưu', 'Save')}</button>}
      </div>
    </article>
  );
}

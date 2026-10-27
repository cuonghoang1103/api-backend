'use client';

/**
 * Code Lab — trang làm MỘT bài, kiểu LeetCode (đợt 1 14/10/2026 · máy chấm thật đợt Academy 28/10/2026).
 *
 *   ≥1024px (web):  ┌ thanh mảnh: breadcrumb · 📺 bài giảng · Trước · 3/7 · Sau ─────────────────────┐
 *                   │ TRÁI (cuộn riêng)                    ┃ PHẢI                                  │
 *                   │ Đề · Gợi ý · Lỗi hay gặp · Lời giải  ┃ Code của bạn (Workspace đa tệp)       │
 *                   │ · Lượt nộp · AI (· Coach)            ┃ ▶ Chạy thử · ⬆ Nộp · Lưu              │
 *                   │ thẻ đề / "bản in" đề lớn             ┃ Kiểm mẫu | Kết quả (từng kiểm, điểm)  │
 *                   └───────────── kéo thanh ┃ để chỉnh độ rộng (nhớ theo máy) ─────────────────────┘
 *   <1024px:        hai tab "Đề | Code" dính trên, mỗi lúc một ngăn.
 *
 * MÁY CHẤM chạy TRONG TRÌNH DUYỆT (components/code-lab/cham): dom/react trong iframe sandbox, js/console/
 * module trong Worker, choice/order/table thuần JS. Chạy thử = kiểm mẫu (có sẵn trong payload); Nộp =
 * bộ kiểm đủ (`GET /exercises/:id/tests`) ⇒ `POST /exercises/:id/submissions` (đạt 100% ⇒ Đã giải).
 * Đề không có máy chấm (Java/SQL/Bash chờ máy chấm máy chủ, hoặc bài tự đánh dấu) giữ nút cũ.
 *
 * Cột trái/phải giữ lớp `cl-ex-trai` / `cl-ex-phai` trong `cl-ex-luoi`: app desktop dựng 2 cột bằng
 * container query riêng (desktop/…/codelab-desk.css); luật 2 cột + thanh kéo của WEB (code-lab.css) loại
 * trừ khung app `.ct-cl-khung`.
 *
 * `?bai=<slug bài học>&khoa=<slug khoá>`: Trước/Sau chạy trong bộ luyện của bài học (endpoint bộ luyện);
 * không có `bai` ⇒ trong module của đề. `?ref=&reflabel=` giữ nút quay về bài học.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Loader2, CheckCircle2, Save, Play, ChevronLeft, ChevronRight, FileText, KeyRound, Sparkles,
  GraduationCap, Code2, X, Terminal, Lightbulb, Bug, History, Upload, MonitorPlay, ListChecks, Youtube, Lock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeExercise, CodeBlock, CodeDifficulty, CodeSubmission } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';
import { pickLang } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { carryQS, duongDangNhap, layBoLuyenTapUi, sortEasyToHard, type SolutionFlags } from '@/lib/codelabUi';
import { duongBaiHoc, duongMucLuc, soChuongCuaModule, soChuongTuSlug, tenBoSo } from '@/lib/codelabToc';
import { CourseBackLink } from '@/components/code-lab/CourseBackLink';
import { Workspace, flavorFor } from '@/components/code-lab/Workspace';
import { AiExplain } from '@/components/code-lab/AiExplain';
import { CoachPanel } from '@/components/code-lab/CoachPanel';
import { ProblemCard } from '@/components/code-lab/ProblemCard';
import { SolutionPanel } from '@/components/code-lab/SolutionPanel';
import { BanIn, laDeLon } from '@/components/code-lab/BanIn';
import { TestPanel, CHAM_RONG, type TrangThaiCham } from '@/components/code-lab/TestPanel';
import { TraLoiTinh } from '@/components/code-lab/TraLoiTinh';
import { KhungAnToan } from '@/components/code-lab/KhungAnToan';
import { chayJs } from '@/components/code-lab/chayJs';
import { chamBai, chamDuoc, tinhDiem, LOAI_MAY_CHU, LOAI_TINH, TEN_LOAI, type TestsJson } from '@/components/code-lab/cham';
import { bienDichReact, dungTrangDom, dungTrangReact } from '@/components/code-lab/cham/chamKhung';

function defaultFileName(ex: { language: string; track?: { slug?: string } | null }): string {
  return flavorFor(ex.track?.slug ?? '', ex.language).defaultFile;
}

type LeftTab = 'de' | 'goiy' | 'loi' | 'giai' | 'nop' | 'ai' | 'coach';
type Sibling = { slug: string; title: string; difficulty: CodeDifficulty; sortOrder: number };

const KHOA_TY_LE = 'codelab.tyLeCot';

/** Đáp án mặc định của câu "sắp xếp": thứ tự đang hiện (không kéo gì = chấp nhận thứ tự đó). */
function traLoiKhoiDau(tj: TestsJson | null | undefined): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (tj?.loai !== 'order' || !Array.isArray(tj.cauHoi)) return out;
  for (const c of tj.cauHoi as Array<{ ma: string; muc?: Array<{ ma: string }> }>) out[String(c.ma)] = (c.muc ?? []).map((m) => String(m.ma));
  return out;
}

export default function ExerciseDetailPage() {
  const params = useParams<{ trackSlug: string; exerciseSlug: string }>();
  const searchParams = useSearchParams();
  const qs = carryQS(searchParams);
  const bai = searchParams.get('bai') || '';
  const khoa = searchParams.get('khoa') || '';
  const reflabel = searchParams.get('reflabel') || '';
  const pathname = usePathname();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const isLab211 = params.trackSlug === 'lab211';

  const [ex, setEx] = useState<CodeExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [siblings, setSiblings] = useState<Sibling[]>([]);
  const [boCaChuong, setBoCaChuong] = useState(false);

  const [files, setFiles] = useState<CodeBlock[]>([]);
  const [status, setStatus] = useState<'IN_PROGRESS' | 'SOLVED' | null>(null);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  const [leftTab, setLeftTab] = useState<LeftTab>('de');
  const [visited, setVisited] = useState<Record<LeftTab, boolean>>({ de: true, goiy: false, loi: false, giai: false, nop: false, ai: false, coach: false });
  const [solutionShown, setSolutionShown] = useState(false);
  const [pane, setPane] = useState<'de' | 'code'>('de');
  const [goiYMo, setGoiYMo] = useState(0);

  // máy chấm
  const [cham, setCham] = useState<TrangThaiCham>(CHAM_RONG);
  const [traLoi, setTraLoi] = useState<Record<string, unknown>>({});
  const [luotNop, setLuotNop] = useState<CodeSubmission[] | null>(null);
  const [xemTruoc, setXemTruoc] = useState<string | null>(null);
  const [runOut, setRunOut] = useState<string | null>(null);

  // bố cục web ≥1024px
  const gridRef = useRef<HTMLDivElement>(null);
  const [wsH, setWsH] = useState<number | null>(null);
  const [isWide, setIsWide] = useState(false);
  const [inDesk, setInDesk] = useState(false);
  const [tyLe, setTyLe] = useState(46);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('codelab.lessonLang');
      if (saved === 'vi' || saved === 'en') setLang(saved);
      const t = Number(window.localStorage.getItem(KHOA_TY_LE));
      if (t >= 25 && t <= 75) setTyLe(t);
    } catch { /* storage bị chặn — giữ mặc định */ }
  }, []);

  const pickLangUi = (next: 'en' | 'vi') => {
    setLang(next);
    try { window.localStorage.setItem('codelab.lessonLang', next); } catch { /* ignore */ }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await codeLabApi.getExercise(params.exerciseSlug);
        const data = res.data.data;
        setEx(data);
        // Đề tiếng Việt gốc (problemHtmlVi rỗng, problemHtml là VI) vẫn đọc bằng nút EN mặc định — không sao.
        const starterFiles: CodeBlock[] = (data.starterCodeJson ?? []).length
          ? data.starterCodeJson!.map((b) => ({ ...b }))
          : [{ name: defaultFileName(data), language: data.language, code: '' }];
        let seed: CodeBlock[] = starterFiles;
        setTraLoi(traLoiKhoiDau(data.testsJson));
        if (isAuthed) {
          try {
            const p = await codeLabApi.myProgress(data.trackId);
            const mine = (p.data.data || []).find((it) => it.exerciseId === data.id);
            if (mine) {
              setStatus(mine.status);
              if (mine.savedCode?.length) {
                seed = mine.savedCode.map((b, i) => ({
                  ...b,
                  name: b.name && b.name !== 'Solution' ? b.name : (starterFiles[i]?.name ?? defaultFileName(data)),
                }));
              }
            }
          } catch { /* ignore */ }
        }
        setFiles(seed);
      } catch { setEx(null); } finally { setLoading(false); }
    })();
    setStatus(null);
    setSolutionShown(false);
    setLeftTab('de');
    setVisited({ de: true, goiy: false, loi: false, giai: false, nop: false, ai: false, coach: false });
    setRunOut(null);
    setPane('de');
    setCham(CHAM_RONG);
    setLuotNop(null);
    setXemTruoc(null);
    setGoiYMo(0);
  }, [params.exerciseSlug, isAuthed]);

  // Bộ đề cho Trước/Sau
  const nhomSlug = bai || ex?.module?.slug || '';
  useEffect(() => {
    if (!nhomSlug) return;
    let alive = true;
    setBoCaChuong(false);
    const theoTrack = () => codeLabApi.getTrack(params.trackSlug)
      .then((res) => {
        if (!alive) return;
        let mods = [...(res.data.data.modules || [])].sort((a, b) => a.sortOrder - b.sortOrder);
        const set = mods.find((m) => m.slug === nhomSlug);
        if (set) mods = [set];
        const flat: Sibling[] = [];
        for (const mod of mods) for (const e of sortEasyToHard(mod.exercises || [])) flat.push({ slug: e.slug, title: e.title, difficulty: e.difficulty, sortOrder: e.sortOrder });
        setSiblings(flat);
      })
      .catch(() => { if (alive) setSiblings([]); });
    if (bai && khoa) {
      layBoLuyenTapUi(khoa, bai)
        .then((bo) => {
          if (!alive) return;
          if (!bo.items.length) { void theoTrack(); return; }
          setBoCaChuong(bo.scope === 'chapter');
          setSiblings(bo.items.map((it, i) => ({ slug: it.slug, title: it.title, difficulty: it.difficulty, sortOrder: i })));
        })
        .catch(() => { if (alive) void theoTrack(); });
    } else {
      void theoTrack();
    }
    return () => { alive = false; };
  }, [params.trackSlug, nhomSlug, bai, khoa]);

  const nav = useMemo(() => {
    const idx = siblings.findIndex((s) => s.slug === params.exerciseSlug);
    if (idx < 0) return { idx, total: siblings.length, prev: null, next: null };
    return { idx, total: siblings.length, prev: idx > 0 ? siblings[idx - 1] : null, next: idx < siblings.length - 1 ? siblings[idx + 1] : null };
  }, [siblings, params.exerciseSlug]);

  // ─── loại chấm ───
  const tj = ex?.testsJson ?? null;
  const loai = ex?.gradeKind ?? tj?.loai ?? null;
  const coMayCham = !!tj && chamDuoc(loai) && (tj.soKiem ?? (tj.kiem?.length ?? 0)) > 0;
  const laTinh = !!loai && LOAI_TINH.has(loai);
  const choMayChu = !!loai && LOAI_MAY_CHU.has(loai);
  const tepMap = useMemo(() => Object.fromEntries(files.map((f) => [f.name, f.code])), [files]);

  // "Chạy" console cũ cho bài JS không có bộ kiểm
  const jsFile = useMemo(
    () => files.find((f) => /\.(m?js|ts)$/i.test(f.name) || ['javascript', 'js', 'typescript', 'ts'].includes((f.language || '').toLowerCase())),
    [files],
  );
  const chayConsole = !coMayCham && !!jsFile;
  const runJs = useCallback(async () => {
    setRunOut('Đang chạy…');
    setRunOut(await chayJs(jsFile?.code ?? ''));
  }, [jsFile]);

  const chayThu = useCallback(async () => {
    if (!ex || !tj || cham.dang || laTinh) return; // trắc nghiệm/bảng: chỉ có Nộp
    setCham({ ...CHAM_RONG, dang: 'chay' });
    setPane('code');
    try {
      const r = await chamBai({ exerciseId: ex.id, tj, files: tepMap });
      setCham({ ...CHAM_RONG, cheDo: 'chay', ketQua: r.ketQua, diem: r.diem, dat: r.dat, tong: r.tong, ms: r.ms });
    } catch (e) {
      setCham({ ...CHAM_RONG, loi: e instanceof Error ? e.message : String(e) });
    }
  }, [ex, tj, tepMap, cham.dang, laTinh]);

  const nop = useCallback(async () => {
    if (!ex || !tj || cham.dang) return;
    setCham({ ...CHAM_RONG, dang: 'nop' });
    setPane('code');
    const t0 = performance.now();
    try {
      let tjDu: TestsJson = tj;
      if (!laTinh) {
        const r = await codeLabApi.getSubmitTests(ex.id);
        tjDu = r.data.data.testsJson;
      }
      const r = await chamBai({ exerciseId: ex.id, tj: tjDu, files: tepMap, traLoi });
      const ms = Math.round(performance.now() - t0);
      if (!isAuthed) {
        setCham({ ...CHAM_RONG, cheDo: 'nop', ketQua: r.ketQua, diem: r.diem, dat: r.dat, tong: r.tong, ms, daLuu: false });
        return;
      }
      try {
        const res = await codeLabApi.submit(ex.id, laTinh
          ? { answers: traLoi, ms }
          : { code: files, results: r.ketQua.map((k) => ({ dat: k.dat && !k.boQua, thay: k.thay, ms: k.ms })), ms });
        const d = res.data.data;
        // loại tĩnh: kết quả của MÁY CHỦ là chuẩn
        const ketQua = laTinh ? d.ketQua.map((k) => ({ ...k })) : r.ketQua;
        const dat = ketQua.filter((k) => k.dat).length;
        setCham({ ...CHAM_RONG, cheDo: 'nop', ketQua, diem: d.diem ?? tinhDiem(tjDu, ketQua), dat, tong: ketQua.length, ms, daLuu: true });
        setStatus(d.status);
        if (d.submission.accepted) toast.success('Accepted — bài đã được tính là ĐÃ GIẢI 🎉');
        setLuotNop((ds) => (ds ? [d.submission, ...ds] : ds));
      } catch (e) {
        const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setCham({ ...CHAM_RONG, cheDo: 'nop', ketQua: r.ketQua, diem: r.diem, dat: r.dat, tong: r.tong, ms, loi: msg ? `Không lưu được lượt nộp: ${msg}` : 'Không lưu được lượt nộp (mạng?). Kết quả chấm vẫn ở dưới.' });
      }
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCham({ ...CHAM_RONG, loi: msg || (e instanceof Error ? e.message : String(e)) });
    }
  }, [ex, tj, tepMap, traLoi, files, isAuthed, laTinh, cham.dang]);

  const moXemTruoc = useCallback(async () => {
    if (!ex || !tj) return;
    try {
      const cfg = { id: 'xem', kiem: [] as unknown[], truoc: [], choToiDa: 0, khoCucBo: null, fetchGia: tj.fetchGia ?? null, files: tepMap } as Record<string, unknown>;
      if (tj.loai === 'react') {
        const r = await bienDichReact(tepMap);
        if ('loi' in r) { toast.error(r.loi); return; }
        cfg.maDich = r.maDich;
        cfg.react = { tepChinh: tj.tepChinh ?? null, renderTu: tj.renderTu ?? (tj.tepChinh ? null : 'src/App.js') };
        setXemTruoc(dungTrangReact(tj, tepMap, cfg));
      } else {
        setXemTruoc(dungTrangDom({ ...tj, chayScript: true }, tepMap, cfg));
      }
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Không dựng được trang xem trước'); }
  }, [ex, tj, tepMap]);

  // Lượt nộp: tải khi mở tab
  useEffect(() => {
    if (!ex || !isAuthed || leftTab !== 'nop' || luotNop) return;
    codeLabApi.mySubmissions(ex.id).then((r) => setLuotNop(r.data.data)).catch(() => setLuotNop([]));
  }, [ex, isAuthed, leftTab, luotNop]);

  // Đo khung (web ≥1024px). Trong app desktop bố cục do codelab-desk.css lo.
  useEffect(() => {
    if (loading || !ex) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = gridRef.current;
        if (!el) return;
        const desk = !!el.closest('.ct-cl-khung');
        setInDesk(desk);
        setIsWide(mq.matches);
        if (!desk && mq.matches) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          setWsH(Math.max(480, Math.round(window.innerHeight - top - 12)));
        }
      });
    };
    measure();
    window.addEventListener('resize', measure);
    mq.addEventListener?.('change', measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', measure); mq.removeEventListener?.('change', measure); };
  }, [loading, ex]);

  // Kéo thanh giữa hai cột
  const keoCot = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    if (!grid) return;
    e.preventDefault();
    const r = grid.getBoundingClientRect();
    let cuoi = tyLe;
    const move = (ev: PointerEvent) => {
      cuoi = Math.min(72, Math.max(28, ((ev.clientX - r.left) / r.width) * 100));
      setTyLe(cuoi);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      try { window.localStorage.setItem(KHOA_TY_LE, String(Math.round(cuoi))); } catch { /* ignore */ }
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, [tyLe]);

  const coThanhKiem = coMayCham && !laTinh;
  // Khung kiểm thử thấp khi chưa chạy (đủ thấy vài kiểm mẫu), cao hơn khi có kết quả — editor nhường chỗ.
  const tpH = coThanhKiem ? (cham.ketQua || cham.dang || cham.loi ? 360 : 196) : 0;
  const rightChrome = 150 + tpH + (runOut != null ? 178 : 0) + (choMayChu ? 40 : 0);
  const editorHeight = inDesk ? 440 : isWide && wsH ? Math.min(1400, Math.max(200, wsH - rightChrome)) : 340;

  const save = async (markSolved = false) => {
    if (!ex) return;
    if (!isAuthed) { toast.error('Đăng nhập để lưu bài làm.'); return; }
    setSaving(true);
    try {
      const res = await codeLabApi.saveProgress(ex.id, { status: markSolved ? 'SOLVED' : 'IN_PROGRESS', savedCode: files });
      setStatus(res.data.data.status);
      toast.success(markSolved ? 'Đã đánh dấu là đã giải 🎉' : 'Đã lưu');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không lưu được.');
    } finally { setSaving(false); }
  };

  const openTab = (t: LeftTab) => {
    setLeftTab(t);
    setVisited((v) => (v[t] ? v : { ...v, [t]: true }));
  };

  // ─── Mọi hook ở TRÊN dòng này (build không chạy lint — bài học #310) ───
  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  if (!ex) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center" style={{ color: 'var(--text-muted)' }}>
      Không tìm thấy bài tập. <Link href="/code-lab" className="underline">Về Code Lab</Link>
    </div>
  );

  const solution = ex.solutionCodeJson || [];
  const flags = ex as CodeExercise & SolutionFlags;
  const hasSolution = flags.hasSolution ?? (solution.length > 0 || !!ex.solutionExplanationHtml);
  const qsNow = searchParams.toString();
  const loginHref = duongDangNhap(`${pathname}${qsNow ? `?${qsNow}` : ''}`);
  const trackAccent = ex.track?.color || 'var(--accent-color)';
  const orderLabel = nav.idx >= 0 && nav.total > 0 ? `Đề ${nav.idx + 1}/${nav.total} của bài học` : null;
  const trackSlugNow = params.trackSlug as string;
  const soChuong = boCaChuong ? soChuongTuSlug(bai) : (ex.module ? soChuongCuaModule(ex.module, trackSlugNow) : null);
  const tenBaiHoc = boCaChuong
    ? (reflabel || (soChuong != null ? `Cả chương ${soChuong}` : 'Cả chương'))
    : (ex.module?.name ? tenBoSo(pickLang(ex.module.name, lang)) : (reflabel || ex.track?.name || 'Bài học'));
  const duongBaiHocNay = bai || !ex.module
    ? `/code-lab/${trackSlugNow}${qs}`
    : duongBaiHoc(trackSlugNow, ex.module.slug, { ref: searchParams.get('ref'), reflabel });
  const deLon = laDeLon(ex);
  const hints = (ex.hintsJson || []).map((h) => pickLang(h, lang)).filter(Boolean);
  const loiHay = ex.mistakesJson || [];
  const video = ex.videoRef?.courseSlug && ex.videoRef?.lessonSlug
    ? `/courses/${ex.videoRef.courseSlug}/learn?lessonSlug=${encodeURIComponent(ex.videoRef.lessonSlug)}${ex.videoRef.giay ? `&t=${ex.videoRef.giay}` : ''}`
    : null;
  const daGiai = status === 'SOLVED';
  const daDat = cham.cheDo === 'nop' && !!cham.ketQua && cham.tong > 0 && cham.dat === cham.tong;

  const TABS: Array<{ id: LeftTab; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'de', label: deLon ? 'Đề (bản in)' : 'Đề bài', icon: <FileText size={14} /> },
    ...(hints.length ? [{ id: 'goiy' as LeftTab, label: 'Gợi ý', icon: <Lightbulb size={14} />, badge: hints.length }] : []),
    ...(loiHay.length ? [{ id: 'loi' as LeftTab, label: 'Lỗi hay gặp', icon: <Bug size={14} />, badge: loiHay.length }] : []),
    { id: 'giai', label: 'Lời giải', icon: <KeyRound size={14} /> },
    ...(coMayCham ? [{ id: 'nop' as LeftTab, label: 'Lượt nộp', icon: <History size={14} /> }] : []),
    { id: 'ai', label: 'Giải thích AI', icon: <Sparkles size={14} /> },
    ...(isLab211 ? [{ id: 'coach' as LeftTab, label: 'Coach', icon: <GraduationCap size={14} /> }] : []),
  ];

  return (
    <div
      className="cl-root cl-ex cl-ws mx-auto max-w-3xl px-4 pb-10 pt-20"
      data-pane={pane}
      style={{
        color: 'var(--text-primary)',
        ['--cl-accent' as string]: trackAccent,
        ['--cl-trai' as string]: `${tyLe}fr`,
        ['--cl-phai' as string]: `${100 - tyLe}fr`,
        ['--cl-tp-h' as string]: `${tpH || 260}px`,
        ...(wsH ? { ['--cl-ws-h' as string]: `${wsH}px` } : {}),
      } as React.CSSProperties}
    >
      {/* ── Thanh mảnh ── */}
      <div className="cl-ws-top">
        <div className="cl-ws-backlink"><CourseBackLink /></div>
        <nav className="cl-crumbs min-w-0 flex-1" aria-label="Vị trí">
          <Link href="/code-lab" className="hidden sm:inline">Code Lab</Link>
          <ChevronRight size={13} aria-hidden className="hidden shrink-0 sm:inline" />
          <Link href={duongMucLuc(trackSlugNow)} className="hidden sm:inline">{ex.track?.name || 'Lộ trình'}</Link>
          {soChuong != null && (
            <>
              <ChevronRight size={13} aria-hidden className="hidden shrink-0 sm:inline" />
              <Link href={duongMucLuc(trackSlugNow, soChuong)} className="hidden sm:inline">Chương {soChuong}</Link>
            </>
          )}
          <ChevronRight size={13} aria-hidden className="hidden shrink-0 sm:inline" />
          <Link href={duongBaiHocNay} className="inline-flex min-w-0 items-center gap-1" title={`Bài học: ${tenBaiHoc}`} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            <ArrowLeft size={14} className="shrink-0 sm:hidden" /> <span className="truncate">{tenBaiHoc}</span>
          </Link>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {video && (
            <Link href={video} className="cl-navbtn" title="Xem lại đoạn video bài giảng của đề này">
              <Youtube size={15} /> <span className="hidden md:inline">Bài giảng</span>
            </Link>
          )}
          {nav.prev ? (
            <Link href={`/code-lab/${params.trackSlug}/${nav.prev.slug}${qs}`} className="cl-navbtn" title={`Bài trước: ${nav.prev.title}`}>
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Trước</span>
            </Link>
          ) : <span className="cl-navbtn" aria-disabled="true"><ChevronLeft size={16} /> <span className="hidden sm:inline">Trước</span></span>}
          {nav.idx >= 0 && nav.total > 0 && <span className="px-1 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{nav.idx + 1}/{nav.total}</span>}
          {nav.next ? (
            <Link href={`/code-lab/${params.trackSlug}/${nav.next.slug}${qs}`} className="cl-navbtn" data-primary="true" title={`Bài sau: ${nav.next.title}`}>
              <span className="hidden sm:inline">Sau</span> <ChevronRight size={16} />
            </Link>
          ) : <span className="cl-navbtn" aria-disabled="true"><span className="hidden sm:inline">Sau</span> <ChevronRight size={16} /></span>}
        </div>
      </div>

      {/* ── Điện thoại / màn hẹp: hai tab Đề | Code ── */}
      <div className="cl-ws-mtabs" role="tablist" aria-label="Đề hoặc code">
        <button type="button" role="tab" aria-selected={pane === 'de'} onClick={() => setPane('de')}><FileText size={15} /> Đề</button>
        <button type="button" role="tab" aria-selected={pane === 'code'} onClick={() => setPane('code')}>
          <Code2 size={15} /> {laTinh ? 'Trả lời' : 'Code'}
          {cham.ketQua && !cham.dang && <span className="cl-mtab-kq" data-ok={cham.dat === cham.tong ? 'true' : 'false'}>{cham.dat}/{cham.tong}</span>}
        </button>
      </div>

      <div ref={gridRef} className="cl-ex-luoi cl-ws-grid">
        {/* ── TRÁI ── */}
        <div className="cl-ex-trai cl-ws-left">
          <div className="cl-ws-tabs" role="tablist" aria-label="Nội dung bài">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={leftTab === t.id} onClick={() => openTab(t.id)}>
                {t.icon}{t.label}{t.badge ? <span className="cl-tab-badge">{t.badge}</span> : null}
              </button>
            ))}
          </div>
          <div className="cl-ws-leftbody">
            <div hidden={leftTab !== 'de'}>
              {deLon ? (
                <BanIn ex={ex} lang={lang} onPickLang={pickLangUi} />
              ) : (
                <ProblemCard key={ex.id} ex={ex} lang={lang} onPickLang={pickLangUi} solved={daGiai} orderLabel={orderLabel} isLab211={isLab211} anGoiY={hints.length > 0} />
              )}
              {hints.length > 0 && !deLon && (
                <button type="button" className="cl-hint-cta" onClick={() => openTab('goiy')}><Lightbulb size={14} /> Bí? Mở gợi ý từng bước ({hints.length})</button>
              )}
            </div>

            <div hidden={leftTab !== 'goiy'}>
              <section className="cl-side-card">
                <h2 className="cl-side-h"><Lightbulb size={16} /> Gợi ý theo bậc</h2>
                <p className="cl-side-sub">Mở từng gợi ý một — gợi ý sau gần lời giải hơn. Thử tự làm thêm một lúc trước khi mở cái tiếp theo.</p>
                <ol className="cl-hint-steps">
                  {hints.map((h, i) => (
                    <li key={i} data-open={i < goiYMo ? 'true' : undefined}>
                      <div className="cl-hint-step-h"><span>Gợi ý {i + 1}</span>{i >= goiYMo && <Lock size={12} />}</div>
                      {i < goiYMo ? <p>{h}</p> : i === goiYMo ? (
                        <button type="button" className="cl-btn cl-btn-ghost" onClick={() => setGoiYMo(i + 1)}><Lightbulb size={14} /> Mở gợi ý {i + 1}</button>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <div hidden={leftTab !== 'loi'}>
              <section className="cl-side-card">
                <h2 className="cl-side-h"><Bug size={16} /> Lỗi hay gặp</h2>
                <p className="cl-side-sub">Những chỗ người học (và người chấm) hay vấp ở bài này — soát lại code của bạn theo từng dòng.</p>
                <ul className="cl-mistakes">
                  {loiHay.map((m, i) => (
                    <li key={i}>
                      <div className="prose-cl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(pickLang(m.loi, lang)) }} />
                      {m.viDu && <pre className="cl-mistake-code">{m.viDu}</pre>}
                      {m.cachSua && <p className="cl-mistake-fix"><b>Sửa:</b> <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(pickLang(m.cachSua, lang)) }} /></p>}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div hidden={leftTab !== 'giai'}>
              <SolutionPanel
                key={ex.id}
                exerciseId={ex.id}
                lang={lang}
                solution={solution}
                explanationHtml={ex.solutionExplanationHtml}
                explanationHtmlVi={ex.solutionExplanationHtmlVi}
                hasSolution={hasSolution}
                needLogin={!!flags.solutionLocked && !isAuthed}
                loginHref={loginHref}
                revealed={solutionShown}
                onReveal={setSolutionShown}
              />
            </div>

            {coMayCham && (
              <div hidden={leftTab !== 'nop'}>
                <section className="cl-side-card">
                  <h2 className="cl-side-h"><History size={16} /> Lượt nộp của bạn</h2>
                  {!isAuthed ? (
                    <p className="cl-side-sub"><Link href={loginHref} className="underline">Đăng nhập</Link> để lưu từng lượt Nộp, xem lại code đã nộp và tiến độ.</p>
                  ) : luotNop == null ? (
                    <p className="cl-side-sub"><Loader2 size={14} className="mr-1 inline animate-spin" /> Đang tải…</p>
                  ) : luotNop.length === 0 ? (
                    <p className="cl-side-sub">Chưa có lượt nộp nào. Bấm <b>Nộp</b> để chấm toàn bộ kiểm (kể cả kiểm ẩn).</p>
                  ) : (
                    <table className="cl-subs">
                      <thead><tr><th>Lúc</th><th>Kết quả</th><th>Kiểm</th><th>Điểm</th><th /></tr></thead>
                      <tbody>
                        {luotNop.map((s) => (
                          <tr key={s.id} data-ok={s.accepted ? 'true' : 'false'}>
                            <td className="whitespace-nowrap">{new Date(s.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                            <td className="font-semibold">{s.accepted ? 'Accepted' : 'Chưa đạt'}</td>
                            <td className="tabular-nums">{s.passed}/{s.total}</td>
                            <td className="tabular-nums">{s.score != null ? (s.maxScore === 100 ? `${s.score}%` : `${s.score}/${s.maxScore}`) : '—'}</td>
                            <td>
                              {Array.isArray(s.code) && (s.code as CodeBlock[]).length > 0 && (
                                <button type="button" className="cl-subs-load" onClick={() => { setFiles((s.code as CodeBlock[]).map((b) => ({ ...b }))); setPane('code'); toast.success('Đã nạp code của lượt này vào editor'); }}>Nạp code</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </div>
            )}

            {visited.ai && <div hidden={leftTab !== 'ai'}><AiExplain exerciseId={ex.id} /></div>}
            {isLab211 && visited.coach && <div hidden={leftTab !== 'coach'}><CoachPanel exerciseId={ex.id} /></div>}
          </div>
        </div>

        {/* ── thanh kéo chỉnh độ rộng (web ≥1024px) ── */}
        <div className="cl-ws-split" role="separator" aria-orientation="vertical" aria-label="Kéo để chỉnh độ rộng hai cột" onPointerDown={keoCot} onDoubleClick={() => { setTyLe(46); try { window.localStorage.removeItem(KHOA_TY_LE); } catch { /* ignore */ } }} />

        {/* ── PHẢI ── */}
        <div
          className="cl-ex-phai cl-ws-right"
          onKeyDown={(e) => {
            if (!(e.metaKey || e.ctrlKey) || e.key !== 'Enter') return;
            e.preventDefault();
            if (coMayCham) { if (e.shiftKey || laTinh) void nop(); else void chayThu(); } else if (chayConsole) void runJs();
          }}
        >
          <div className="cl-ws-righthead">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {laTinh ? <ListChecks size={15} style={{ color: 'var(--cl-accent)' }} /> : <Code2 size={15} style={{ color: 'var(--cl-accent)' }} />}
              {laTinh ? 'Câu trả lời của bạn' : 'Code của bạn'}
            </span>
            {!laTinh && <span className="cl-meta-chip cl-meta-chip-theme">{ex.language}</span>}
            {coMayCham && <span className="cl-meta-chip cl-chip-cham" title={`Bài này có máy chấm tự động — ${TEN_LOAI[loai ?? ''] ?? loai}`}>Tự chấm<span className="max-sm:hidden"> · {TEN_LOAI[loai ?? ''] ?? loai}</span></span>}
            {daGiai && <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}><CheckCircle2 size={14} /> Đã giải</span>}
          </div>

          {laTinh && tj ? (
            <TraLoiTinh tj={tj} traLoi={traLoi} onChange={setTraLoi} ketQua={cham.ketQua} daNop={cham.cheDo === 'nop'} />
          ) : (
            <Workspace
              files={files}
              onChange={setFiles}
              exerciseId={ex.id}
              trackSlug={params.trackSlug as string}
              language={ex.language || 'text'}
              projectName={ex.slug}
              editorHeight={editorHeight}
              compact={!inDesk}
            />
          )}

          <div className="cl-ws-actions">
            {coMayCham ? (
              <>
                {!laTinh && (
                  <button type="button" onClick={() => void chayThu()} disabled={!!cham.dang} className="cl-btn cl-btn-ghost" title="Chạy các kiểm mẫu (Ctrl/⌘ + Enter)">
                    {cham.dang === 'chay' ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />} Chạy thử
                  </button>
                )}
                <button type="button" onClick={() => void nop()} disabled={!!cham.dang} className="cl-btn cl-btn-run" title={laTinh ? 'Chấm câu trả lời' : 'Chấm TOÀN BỘ kiểm, kể cả kiểm ẩn (Ctrl/⌘ + Shift + Enter)'}>
                  {cham.dang === 'nop' ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Nộp
                </button>
                {(loai === 'dom' || loai === 'react') && (
                  <button type="button" onClick={() => void moXemTruoc()} className="cl-btn cl-btn-ghost" title="Xem trang bạn đang làm">
                    <MonitorPlay size={15} /> Xem trang
                  </button>
                )}
                {!laTinh && (
                  <button type="button" onClick={() => save(false)} disabled={saving} className="cl-btn cl-btn-ghost cl-btn-icon-sm" title="Lưu bài làm">
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} <span className="max-sm:hidden">Lưu</span>
                  </button>
                )}
                <span className="cl-kbd-hint">{laTinh ? '⌘/Ctrl + Enter: nộp' : '⌘/Ctrl + Enter: chạy · + Shift: nộp'}</span>
              </>
            ) : (
              <>
                {chayConsole && (
                  <button type="button" onClick={() => void runJs()} className="cl-btn cl-btn-run" title="Chạy (Ctrl/⌘ + Enter)"><Play size={15} /> Chạy</button>
                )}
                <button type="button" onClick={() => save(false)} disabled={saving} className="cl-btn cl-btn-ghost">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Lưu
                </button>
                <button type="button" onClick={() => save(true)} disabled={saving} className="cl-btn cl-btn-solve" title="Bài này chưa có máy chấm — bạn tự xác nhận đã làm xong">
                  <CheckCircle2 size={15} /> Tự đánh dấu đã giải
                </button>
              </>
            )}
          </div>

          {choMayChu && (
            <p className="cl-note-server">⚙ Bài {TEN_LOAI[loai ?? ''] ?? loai}: <b>máy chấm máy chủ — sắp có</b>. Tạm thời chạy trên máy của bạn rồi tự đánh dấu.</p>
          )}

          {daDat && nav.next && (
            <Link href={`/code-lab/${params.trackSlug}/${nav.next.slug}${qs}`} className="cl-accepted-next">
              <CheckCircle2 size={18} /> <span className="min-w-0 flex-1 truncate">Accepted! Bài tiếp theo: <b>{nav.next.title}</b></span> <ChevronRight size={16} />
            </Link>
          )}

          {coThanhKiem && <TestPanel tj={tj} st={cham} videoHref={video} />}
          {laTinh && (cham.ketQua || cham.loi || cham.dang) && <TestPanel tj={tj} st={cham} videoHref={video} chiKetQua />}

          {runOut != null && (
            <div className="cl-console">
              <div className="cl-console-head">
                <span className="inline-flex items-center gap-1.5"><Terminal size={13} /> Console</span>
                <button type="button" onClick={() => setRunOut(null)} aria-label="Đóng console" className="ml-auto"><X size={14} /></button>
              </div>
              <pre>{runOut}</pre>
            </div>
          )}
          {!isAuthed && <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}><Link href={loginHref} className="underline">Đăng nhập</Link> để lưu bài làm, lượt nộp và tiến độ.</p>}
          {nav.next && !daDat && (
            <Link href={`/code-lab/${params.trackSlug}/${nav.next.slug}${qs}`} className="cl-nextlink">
              <span className="min-w-0 truncate">Bài tiếp theo: <b>{nav.next.title}</b></span>
              <ChevronRight size={15} className="shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {xemTruoc && (
        <div className="cl-demo" role="dialog" aria-modal="true" aria-label="Xem trang" onClick={(e) => { if (e.target === e.currentTarget) setXemTruoc(null); }}>
          <div className="cl-demo-khung">
            <div className="cl-demo-head">
              <MonitorPlay size={15} /> <b>Trang của bạn</b>
              <span className="cl-demo-ghi">Dựng từ code hiện tại trong editor (chạy trong khung cách ly).</span>
              <button type="button" onClick={() => setXemTruoc(null)} aria-label="Đóng" className="ml-auto"><X size={16} /></button>
            </div>
            <KhungAnToan html={xemTruoc} title="Xem trang" className="cl-demo-if" />
          </div>
        </div>
      )}
    </div>
  );
}

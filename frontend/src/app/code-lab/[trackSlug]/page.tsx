'use client';

/**
 * Code Lab — trang của MỘT track, ba chế độ (14/10/2026):
 *
 *   1. MỤC LỤC (mặc định, `/code-lab/<track>`): chương ▸ bài học (module) — mỗi bài
 *      học một dòng gọn (số, tên, số đề, Dễ/Vừa/Khó, ≈ phút, tiến độ) + "Luyện tập →".
 *      KHÔNG in danh sách đề: chủ web "ấn vào 1 khoá là hiện ALL chương, bài cùng 1
 *      trang — user không biết nên làm bài nào". Chương gập/mở, mặc định mở chương có
 *      bài chưa làm đầu tiên (`?chuong=N` mở sẵn chương N), ô tìm nhanh, dải "Bắt đầu từ".
 *   2. BÀI HỌC (`?bai=<module>` [+ `khoa=<khoá>`]): breadcrumb Code Lab › Track ›
 *      Chương › Bài học, bài giảng module (nếu có), bộ lọc độ khó/trạng thái, đề sắp
 *      Dễ → Khó đánh số 1..N, "← Mục lục" + "Bài học tiếp theo →".
 *   3. CHỌN BÀI LẬP PHÒNG LAB (nút trên hero): danh sách đề đầy đủ để tick như cũ —
 *      tick nhiều bài ở nhiều module là việc của chế độ này.
 *
 * Phần thuần (nhóm chương, bài chưa làm, tìm, module kế) ở `lib/codelabToc.ts` + test.
 * Không thêm `page.tsx` mới: chế độ đi bằng query ⇒ app desktop (gói sẵn cây web) không
 * cần tuyến mới. Lớp ngoài giữ `cl-root max-w-4xl` — codelab-desk.css nới bề rộng theo nó.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, ChevronDown, ChevronRight, Circle, Loader2, Clock,
  ExternalLink, Target, FlaskConical, CheckSquare, Square, Dumbbell, Filter, X, Search, ListTree, PlayCircle,
} from 'lucide-react';
import { codeLabApi, locFromTitle } from '@/lib/code-lab-api';
import type { CodeDifficulty, CodeExerciseListItem, CodeModule, CodeTrack, MyProgressItem } from '@/types/code-lab';
import { pickLang } from '@/lib/utils';
import { DIFF_ORDER, DIFF_UI, carryQS, layBoLuyenTapUi, sortEasyToHard, type BoLuyenTapUi, type DiffFilter, type StatusFilter } from '@/lib/codelabUi';
import {
  baiChuaLamDauTien, dungMucLuc, duongBaiHoc, duongMucLuc, locMucLuc, moduleLanCan, soChuongCuaModule,
  soChuongTuSlug, tenBoSo, tenChuong, thongKeModule, type DongMucLuc,
} from '@/lib/codelabToc';
import { DifficultyChip } from '@/components/code-lab/ProblemCard';
import { useAuthStore } from '@/store/authStore';
import { LevelPill, ProgressRing, TechIcon, VerifiedBadge, parseVerified } from '@/components/code-lab/shared';
import { ModuleLesson } from '@/components/code-lab/ModuleLesson';
import { CourseBackLink } from '@/components/code-lab/CourseBackLink';
import { SkillCoverage } from '@/components/code-lab/SkillCoverage';
import { LabRoomBar } from '@/components/code-lab/LabRoomBar';
import { LabRoomBeacon } from '@/components/code-lab/LabRoomBeacon';

const TEN_DANG_NGAN: Record<string, string> = { lab: 'LAB', 'deep-lab': 'DEEP', pe: 'PE', project: 'DỰ ÁN', practice: '' };
const THU_DANG: Record<string, number> = { practice: 0, lab: 1, 'deep-lab': 2, pe: 3, project: 4 };

/** Dạng của một module: mọi đề cùng một dạng khác "practice" ⇒ dạng đó (Lab/Deep Lab/PE/Dự án), không thì luyện tập. */
function dangCuaModule(m: CodeModule): string {
  const ds = m.exercises || [];
  if (!ds.length) return 'practice';
  const k = ds[0].kind || 'practice';
  return ds.every((e) => (e.kind || 'practice') === k) ? k : 'practice';
}

/** Trong một chương: bài luyện theo bài học trước, rồi Lab → Deep Lab → PE → Dự án (giữ thứ tự gốc trong cùng dạng). */
function sapTheoDang<T extends { module: CodeModule }>(ds: T[]): T[] {
  return ds.map((d, i) => ({ d, i })).sort((a, b) => (THU_DANG[dangCuaModule(a.d.module)] ?? 0) - (THU_DANG[dangCuaModule(b.d.module)] ?? 0) || a.i - b.i).map((x) => x.d);
}

export default function TrackRoadmapPage() {
  const params = useParams<{ trackSlug: string }>();
  const slug = params.trackSlug;
  const router = useRouter();
  const searchParams = useSearchParams();
  // Carry ?ref=&reflabel= (set by an Academy/Courses lesson link) and ?bai=
  // (bộ luyện của một bài học) onto the exercise links, so the "back to course"
  // button and the practice set survive one more hop. `chon` là param của RIÊNG
  // trang này (đường đi từ trong một phòng ra để nhặt thêm bài) ⇒ không mang theo.
  const refQS = carryQS(searchParams);
  // `?bai=<slug module>` — trang BÀI HỌC: chỉ module có slug đó (module slug = slug
  // bài học ở track luyện tập), sắp Dễ → Khó.
  const bai = searchParams.get('bai') || '';
  // `khoa` (slug khoá học) đi kèm `bai` ⇒ hỏi đúng endpoint bộ luyện (thứ tự + phạm vi
  // do backend quyết; bài slide N.0 gộp cả chương nên `bai` khi đó KHÔNG trùng module
  // nào). Thiếu `khoa` ⇒ lùi về khớp slug module.
  const khoa = searchParams.get('khoa') || '';
  const reflabel = searchParams.get('reflabel') || '';
  const refParam = searchParams.get('ref') || '';
  const allQS = carryQS({ get: (k: string) => (k === 'bai' || k === 'khoa' ? null : searchParams.get(k)) });
  const phongGhim = Number(searchParams.get('chon')) || null;
  const chuongMo = searchParams.get('chuong');
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const [track, setTrack] = useState<CodeTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<number, MyProgressItem>>({});
  // A deep link like /code-lab/java-core#module-249 arrives BEFORE the modules
  // exist, so the browser's own anchor jump finds nothing and stays at the top.
  // Resolve it ourselves once the data is in, and open that module's lesson.
  const [focusModuleId, setFocusModuleId] = useState<number | null>(null);
  // Chế độ chọn bài để lập Phòng Lab. Tách hẳn khỏi luồng bấm-vào-bài thường:
  // trong chế độ này một cú bấm là TICK, không phải mở bài.
  const [dangChon, setDangChon] = useState(!!phongGhim);
  const [daChon, setDaChon] = useState<number[]>([]);
  // Bài đã nằm sẵn trong phòng ghim — không có nó thì người dùng tick mù.
  const [daCoTrongPhong, setDaCoTrongPhong] = useState<Set<number>>(new Set());
  // Bộ lọc trên trang bài học (lọc phía client — dữ liệu đã có đủ độ khó + tiến độ).
  const [locDoKho, setLocDoKho] = useState<DiffFilter>('all');
  const [locTrangThai, setLocTrangThai] = useState<StatusFilter>('all');
  // Bộ luyện từ `GET /code-lab/practice/:khoa/:bai`.
  const [boApi, setBoApi] = useState<BoLuyenTapUi | null>(null);
  const [boApiTT, setBoApiTT] = useState<'idle' | 'loading' | 'ok' | 'loi'>('idle');
  // Mục lục: ô tìm + chương đang mở (null = tự động: chương có bài chưa làm đầu tiên).
  const [timBai, setTimBai] = useState('');
  const [moChuong, setMoChuong] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!bai || !khoa) { setBoApi(null); setBoApiTT('idle'); return; }
    let alive = true;
    setBoApiTT('loading');
    layBoLuyenTapUi(khoa, bai)
      .then((d) => { if (alive) { setBoApi(d); setBoApiTT('ok'); } })
      .catch(() => { if (alive) { setBoApi(null); setBoApiTT('loi'); } });
    return () => { alive = false; };
  }, [bai, khoa, isAuthed]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await codeLabApi.getTrack(slug);
        setTrack(res.data.data);
        if (isAuthed && res.data.data?.id) {
          try {
            const p = await codeLabApi.myProgress(res.data.data.id);
            const map: Record<number, MyProgressItem> = {};
            (p.data.data || []).forEach((it) => { map[it.exerciseId] = it; });
            setProgress(map);
          } catch { /* ignore */ }
        }
      } catch { setTrack(null); } finally { setLoading(false); }
    })();
  }, [slug, isAuthed]);

  useEffect(() => {
    if (!phongGhim) { setDaCoTrongPhong(new Set()); return; }
    codeLabApi.getLabRoom(phongGhim)
      .then((r) => setDaCoTrongPhong(new Set((r.data.data.items || []).map((i) => i.exerciseId))))
      .catch(() => setDaCoTrongPhong(new Set()));
  }, [phongGhim]);

  // Bộ lọc thuộc về MỘT bài học — sang bài khác thì bỏ.
  useEffect(() => { setLocDoKho('all'); setLocTrangThai('all'); }, [bai]);

  // Hai nhóm module: bài giảng thuần (không có bài tập nhưng CÓ nội dung) và
  // phần còn lại. Module rỗng hoàn toàn vẫn nằm ở nhóm dưới.
  const baiGiang = useMemo(
    () => (track?.modules || []).filter((m) => (m.exercises || []).length === 0 && m.hasLesson),
    [track],
  );
  const coGiaoTrinh = baiGiang.length >= 2;
  const moduleBaiTap = useMemo(
    () => (track?.modules || []).filter((m) => !((m.exercises || []).length === 0 && m.hasLesson) || !coGiaoTrinh),
    [track, coGiaoTrinh],
  );

  // `#module-<id>` (link cũ, vd hoc-sql) ⇒ mở trang bài học của module đó; bài giảng
  // thuần nằm trong mục "Giáo trình" thì mở ngay tại mục lục như trước.
  useEffect(() => {
    if (!track) return;
    const m = /#module-(\d+)/.exec(window.location.hash);
    if (!m) return;
    const id = Number(m[1]);
    const mod = (track.modules || []).find((x) => x.id === id);
    if (!bai && mod && !(coGiaoTrinh && baiGiang.includes(mod))) {
      router.replace(`${duongBaiHoc(track.slug, mod.slug, { ref: refParam, reflabel })}#module-${id}`);
      return;
    }
    setFocusModuleId(id);
    const t = window.setTimeout(() => {
      document.getElementById(`module-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [track, bai, coGiaoTrinh, baiGiang, router, refParam, reflabel]);

  // Bộ luyện của một bài học (`?bai=`):
  //   - có `khoa` + endpoint trả bài ⇒ đúng danh sách/thứ tự của endpoint, gói vào MỘT
  //     module (module thật nếu bộ là đúng một module của track này, không thì module ảo
  //     "cả chương");
  //   - có `khoa` + endpoint trả rỗng (`dangSoan`) ⇒ không bài nào, dải báo "đang soạn" + gợi ý;
  //   - không `khoa` / endpoint lỗi ⇒ lùi về module có slug trùng `bai`.
  const cheDoApi = !!bai && !!khoa && boApiTT === 'ok' && !!boApi;
  const moduleThat = useMemo(
    () => (bai && track ? (track.modules || []).find((m) => m.slug === bai) ?? null : null),
    [track, bai],
  );
  const boLuyen = useMemo((): CodeModule | null => {
    if (!bai || !track) return null;
    if (cheDoApi && boApi) {
      if (!boApi.items.length) return null;
      const that = boApi.scope === 'lesson' && boApi.moduleSlugs.length === 1
        ? (track.modules || []).find((m) => m.slug === boApi.moduleSlugs[0])
        : undefined;
      const exercises: CodeExerciseListItem[] = boApi.items.map((it, i) => ({
        id: it.id, moduleId: that?.id ?? -1, trackId: track.id, title: it.title, slug: it.slug,
        difficulty: it.difficulty, sortOrder: i, status: 'PUBLISHED', language: track.language,
        points: it.points, estimatedMinutes: it.estimatedMinutes, viewCount: 0, solveCount: 0,
      }));
      const so = soChuongTuSlug(bai);
      return that
        ? { ...that, exercises }
        : {
          id: -1, trackId: track.id, slug: bai, level: 'BEGINNER', sortOrder: 0, hasLesson: false, exercises,
          name: boApi.scope === 'chapter'
            ? (so != null ? `Bộ luyện cả ${tenChuong(track.slug, so).replace(/^Chương/, 'chương')}` : 'Bộ luyện cả chương')
            : (reflabel || 'Bộ luyện'),
          description: boApi.scope === 'chapter' ? `Gộp ${boApi.moduleSlugs.length} bài học của chương này, sắp từ dễ đến khó.` : null,
        } as CodeModule;
    }
    if (bai && khoa && boApiTT === 'loading') return null;
    return moduleThat;
  }, [track, bai, khoa, cheDoApi, boApi, boApiTT, reflabel, moduleThat]);
  const moduleHienThi = bai ? (boLuyen ? [boLuyen] : []) : moduleBaiTap;
  // Bài đã giải: tiến độ của track + cờ `solved` của endpoint bộ luyện (bộ có thể nằm ở track khác).
  const daGiaiApi = useMemo(() => new Set((boApi?.items || []).filter((i) => i.solved).map((i) => i.id)), [boApi]);
  const daGiai = (id: number) => progress[id]?.status === 'SOLVED' || daGiaiApi.has(id);
  // Track chứa bài của bộ (endpoint trả `trackSlug`) — link bài phải trỏ đúng track đó.
  const trackCuaBai = cheDoApi && boApi ? boApi.trackSlug : slug;
  // Độ khó có mặt trong phần đang hiện ⇒ chỉ bày pill có bài.
  const demDoKho = useMemo(() => {
    const c: Record<CodeDifficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0, EXPERT: 0 };
    for (const m of moduleHienThi) for (const e of m.exercises || []) c[e.difficulty] = (c[e.difficulty] ?? 0) + 1;
    return c;
  }, [moduleHienThi]);
  const dangLoc = locDoKho !== 'all' || locTrangThai !== 'all';
  const hopLoc = (e: { id: number; difficulty: CodeDifficulty }) => {
    if (locDoKho !== 'all' && e.difficulty !== locDoKho) return false;
    const solvedE = daGiai(e.id);
    if (locTrangThai === 'done' && !solvedE) return false;
    if (locTrangThai === 'todo' && solvedE) return false;
    return true;
  };

  const { total, solved } = useMemo(() => {
    const all = (track?.modules || []).flatMap((m) => m.exercises || []);
    const s = all.filter((e) => progress[e.id]?.status === 'SOLVED').length;
    return { total: all.length, solved: s };
  }, [track, progress]);

  // ── Mục lục ──
  const mucLuc = useMemo(
    () => dungMucLuc(slug, moduleBaiTap, (id) => progress[id]?.status === 'SOLVED'),
    [slug, moduleBaiTap, progress],
  );
  const batDauTu = useMemo(() => baiChuaLamDauTien(mucLuc), [mucLuc]);
  const mucLucLoc = useMemo(() => locMucLuc(mucLuc, timBai), [mucLuc, timBai]);
  const moTuDong = useMemo(() => {
    const s = new Set<string>();
    const ch = chuongMo != null ? mucLuc.nhom.find((g) => String(g.so) === chuongMo) : undefined;
    if (ch) s.add(ch.key);
    else if (batDauTu) s.add(batDauTu.nhom.key);
    else if (mucLuc.nhom[0]) s.add(mucLuc.nhom[0].key);
    // Track một nhóm (track thường) luôn mở — gập nó thì trang trống.
    if (mucLuc.nhom.length === 1) s.add(mucLuc.nhom[0].key);
    return s;
  }, [mucLuc, batDauTu, chuongMo]);
  const chuongDangMo = moChuong ?? moTuDong;
  useEffect(() => {
    if (chuongMo == null || !track || bai) return;
    const t = window.setTimeout(() => document.getElementById(`chuong-${chuongMo}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    return () => window.clearTimeout(t);
  }, [chuongMo, track, bai]);

  // ── Trang bài học: chương + bài học kế ──
  const chuongCuaBai = moduleThat ? soChuongCuaModule(moduleThat, slug) : (bai ? soChuongTuSlug(bai) : null);
  const lanCan = useMemo(() => (bai && track ? moduleLanCan(moduleBaiTap, moduleThat?.slug ?? bai) : { truoc: null, sau: null }), [bai, track, moduleBaiTap, moduleThat]);

  // LOC nằm trong TIÊU ĐỀ bài (LAB211 ghi "... (37 LOC)"), track khác không có.
  const { picked, totalLoc, coLoc } = useMemo(() => {
    const all = (track?.modules || []).flatMap((m) => m.exercises || []);
    const byId = new Map(all.map((e) => [e.id, e]));
    const list = daChon
      .map((id) => byId.get(id))
      .filter((e): e is NonNullable<typeof e> => !!e)
      .map((e) => ({ id: e.id, title: e.title, loc: locFromTitle(e.title) }));
    return {
      picked: list,
      totalLoc: list.reduce((a, b) => a + b.loc, 0),
      coLoc: all.some((e) => locFromTitle(e.title) > 0),
    };
  }, [track, daChon]);

  const toggleChon = (id: number) => {
    if (daCoTrongPhong.has(id)) return;
    setDaChon((cu) => (cu.includes(id) ? cu.filter((x) => x !== id) : [...cu, id]));
  };

  // ─── Mọi hook ở TRÊN dòng này (build không chạy lint — bài học #310) ───
  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  if (!track) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center" style={{ color: 'var(--text-muted)' }}>
      Track not found. <Link href="/code-lab" className="underline">Back to Code Lab</Link>
    </div>
  );

  const accent = track.color || 'var(--accent-color)';
  const pct = total ? Math.round((solved / total) * 100) : 0;
  // Back to the track's own section (e.g. CuongThai), not the whole hub.
  const backHref = track.group?.slug ? `/code-lab?group=${track.group.slug}` : '/code-lab';
  const backLabel = track.group?.name || 'Code Lab';
  const cheDoBaiHoc = !!bai && !dangChon;
  const cheDoMucLuc = !bai && !dangChon;
  const mangTheo = { ref: refParam, reflabel };
  const toggleNhom = (key: string) => setMoChuong((cu) => {
    const s = new Set(cu ?? moTuDong);
    if (s.has(key)) s.delete(key); else s.add(key);
    return s;
  });

  /** Danh sách đề của một module — trang bài học (gọn, không header) và chế độ chọn bài. */
  const renderModule = (m: CodeModule, mi: number, gon: boolean) => {
    const modAll = (m.exercises || []).length;
    // Trong module: Dễ → Vừa → Khó (cùng mức giữ thứ tự soạn). Số thứ tự theo
    // danh sách ĐẦY ĐỦ đã sắp, nên lọc không làm số nhảy.
    const daSap = sortEasyToHard(m.exercises || []);
    const hienRa = daSap.filter(hopLoc);
    if (dangLoc && hienRa.length === 0) return null;
    const modSolved = (m.exercises || []).filter((e) => daGiai(e.id)).length;
    const modDone = modAll > 0 && modSolved === modAll;
    const focused = focusModuleId === m.id;
    return (
      <section
        key={m.id}
        id={`module-${m.id}`}
        className="scroll-mt-24 overflow-hidden rounded-2xl border transition-all"
        style={{
          background: 'var(--bg-card)',
          borderColor: focused && !gon ? accent : 'var(--border-color)',
          boxShadow: focused && !gon ? `0 0 0 3px color-mix(in srgb, ${accent} 25%, transparent)` : undefined,
        }}
      >
        {!gon && (
          <header className="flex items-center gap-3 border-b px-4 py-3.5" style={{ borderColor: 'var(--border-color)' }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-sm font-bold cl-stat-num"
              style={modDone
                ? { background: '#22c55e', color: '#fff' }
                : { background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent, border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)` }}>
              {modDone ? <CheckCircle2 size={17} /> : mi + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</h2>
                <LevelPill level={m.level} />
              </div>
              {m.description && <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{m.description}</p>}
            </div>
            {isAuthed && modAll > 0 && (
              <span className="hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums sm:inline-block"
                style={{ background: 'var(--bg-surface)', color: modDone ? '#22c55e' : 'var(--text-muted)' }}>
                {modSolved}/{modAll}
              </span>
            )}
          </header>
        )}
        <ul>
          {modAll === 0 && (
            <li className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>Bài học này chưa có đề.</li>
          )}
          {hienRa.map((ex) => {
            const i = daSap.indexOf(ex);
            const isSolved = daGiai(ex.id);
            const inProgress = progress[ex.id]?.status === 'IN_PROGRESS';
            const loc = locFromTitle(ex.title);
            const daCo = daCoTrongPhong.has(ex.id);
            const ticked = daChon.includes(ex.id);
            const noiDung = (
              <>
                {dangChon
                  ? (daCo
                    ? <CheckSquare size={19} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
                    : ticked
                      ? <CheckSquare size={19} className="shrink-0" style={{ color: accent }} />
                      : <Square size={19} className="shrink-0" style={{ color: 'var(--border-color)' }} />)
                  : (isSolved
                    ? <CheckCircle2 size={19} className="shrink-0" style={{ color: '#22c55e' }} />
                    : <Circle size={19} className="shrink-0" style={{ color: inProgress ? '#d97706' : 'var(--border-color)' }} />)}
                <span className="w-6 shrink-0 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span>
                <span className="min-w-0 flex-1 text-sm font-medium leading-snug transition-colors [overflow-wrap:anywhere] sm:truncate group-hover:text-[var(--cl-accent)]" style={{ color: isSolved ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{ex.title}</span>
                {inProgress && !isSolved && !dangChon && (
                  <span className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-block" style={{ background: 'rgba(217,119,6,0.14)', color: '#d97706' }}>Đang làm</span>
                )}
                {dangChon && daCo && (
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>đã có trong phòng</span>
                )}
                {dangChon && loc > 0 && (
                  <span className="shrink-0 text-xs font-semibold tabular-nums" style={{ color: ticked ? accent : 'var(--text-muted)' }}>{loc} LOC</span>
                )}
                {!dangChon && ex.kind && ex.kind !== 'practice' && (
                  <span className="cl-toc-kind" data-kind={ex.kind}>{TEN_DANG_NGAN[ex.kind] || ex.kind}</span>
                )}
                {!dangChon && ex.gradeKind && ex.gradeKind !== 'manual' && (
                  <span className="cl-toc-cham hidden sm:inline-flex" title="Có máy chấm tự động"><FlaskConical size={11} /> Tự chấm</span>
                )}
                {!dangChon && ex.estimatedMinutes ? (
                  <span className="hidden items-center gap-1 text-xs sm:flex" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={12} />{ex.estimatedMinutes}m
                  </span>
                ) : null}
                <DifficultyChip difficulty={ex.difficulty} small />
              </>
            );
            return (
              <li key={ex.id} className="group border-t first:border-t-0" style={{ borderColor: 'var(--border-color)' }}>
                {dangChon ? (
                  <button
                    type="button" onClick={() => toggleChon(ex.id)} disabled={daCo}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors enabled:hover:bg-[var(--bg-surface-hover)] disabled:cursor-not-allowed disabled:opacity-55"
                    style={ticked ? { background: `color-mix(in srgb, ${accent} 9%, transparent)` } : undefined}>
                    {noiDung}
                  </button>
                ) : (
                  <Link href={`/code-lab/${trackCuaBai}/${ex.slug}${refQS}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-surface-hover)]">
                    {noiDung}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  /** Một dòng của mục lục = một bài học (hoặc một Lab / Deep Lab / PE của chương). */
  const renderDong = (d: DongMucLuc<CodeModule>, idx = 0, ds: DongMucLuc<CodeModule>[] = []) => {
    const m = d.module;
    const { soDe, doKho, phut, daLam } = d.tk;
    const xong = soDe > 0 && daLam === soDe;
    const pctBai = soDe ? Math.round((daLam / soDe) * 100) : 0;
    const laBatDau = batDauTu?.dong.module.id === m.id;
    const dang = dangCuaModule(m);
    const coCham = (m.exercises || []).length > 0 && (m.exercises || []).every((e) => !!e.gradeKind && e.gradeKind !== 'manual');
    // Lab/PE một đề ⇒ vào thẳng đề (không qua trang danh sách một dòng)
    const motDe = dang !== 'practice' && soDe === 1 ? (m.exercises || [])[0] : null;
    const href = motDe ? `/code-lab/${slug}/${motDe.slug}${mangTheo.ref ? `?ref=${encodeURIComponent(mangTheo.ref)}${mangTheo.reflabel ? `&reflabel=${encodeURIComponent(mangTheo.reflabel)}` : ''}` : ''}` : duongBaiHoc(slug, m.slug, mangTheo);
    const truocLaLuyen = idx > 0 && dangCuaModule(ds[idx - 1].module) === 'practice';
    return (
      <li key={m.id} className="cl-toc-row" data-start={laBatDau ? 'true' : undefined} data-kind={dang}>
        {dang !== 'practice' && (idx === 0 || truocLaLuyen) && <div className="cl-toc-sub">Lab &amp; luyện sâu của chương</div>}
        <Link href={href} className="cl-toc-link">
          <span className="cl-toc-num" data-done={xong ? 'true' : undefined} data-kind={dang !== 'practice' ? dang : undefined}>
            {xong ? <CheckCircle2 size={16} /> : dang !== 'practice' ? TEN_DANG_NGAN[dang] : (d.soBai ?? d.stt)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="cl-toc-title">{d.soBai ? tenBoSo(m.name) : m.name}</span>
            <span className="cl-toc-meta">
              {soDe > 0 ? (
                <>
                  {coCham && <span className="cl-toc-cham" title="Có máy chấm tự động"><FlaskConical size={11} /> Tự chấm</span>}
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{dang !== 'practice' && soDe === 1 ? 'Đề lớn' : `${soDe} đề`}</span>
                  {DIFF_ORDER.filter((k) => doKho[k] > 0).map((k) => (
                    <span key={k} className="cl-toc-diff" style={{ color: DIFF_UI[k].color, background: DIFF_UI[k].bg }}>
                      {DIFF_UI[k].label} {doKho[k]}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1"><Clock size={11} />≈ {phut} phút</span>
                </>
              ) : (
                <span>{m.hasLesson ? 'Bài giảng, chưa có đề' : 'Chưa có đề'}</span>
              )}
              {isAuthed && soDe > 0 && (
                <span className="cl-toc-prog" title={`Đã làm ${daLam}/${soDe}`}>
                  <span className="cl-toc-bar"><span style={{ width: `${pctBai}%`, background: xong ? '#22c55e' : accent }} /></span>
                  <span className="tabular-nums">đã làm {daLam}/{soDe}</span>
                </span>
              )}
            </span>
          </span>
          <span className="cl-toc-go">
            <span className="hidden sm:inline">{xong ? 'Ôn lại' : daLam > 0 ? 'Làm tiếp' : 'Luyện tập'}</span>
            <ArrowRight size={15} />
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="cl-root mx-auto max-w-4xl px-4 pb-14 pt-20" style={{ color: 'var(--text-primary)', ['--cl-accent' as string]: accent } as React.CSSProperties}>
      <CourseBackLink />
      {!cheDoBaiHoc && (
        <Link href={backHref} className="mb-4 ml-2 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={15} /> {backLabel}
        </Link>
      )}

      {/* ════════ TRANG BÀI HỌC (?bai=) ════════ */}
      {cheDoBaiHoc && (
        <>
          <nav className="cl-crumbs mb-3" aria-label="Vị trí">
            <Link href="/code-lab">Code Lab</Link>
            <ChevronRight size={13} aria-hidden />
            <Link href={duongMucLuc(slug)}>{track.name}</Link>
            {chuongCuaBai != null && (
              <>
                <ChevronRight size={13} aria-hidden />
                <Link href={duongMucLuc(slug, chuongCuaBai)}>Chương {chuongCuaBai}</Link>
              </>
            )}
            <ChevronRight size={13} aria-hidden />
            <span aria-current="page">{boLuyen ? tenBoSo(pickLang(boLuyen.name, 'vi')) : (reflabel || bai)}</span>
          </nav>

          <div className="cl-set-band cl-in mb-4">
            <span className="cl-set-band-icon"><Dumbbell size={18} /></span>
            <div className="min-w-0 flex-1">
              {boApiTT === 'loading' ? (
                <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Loader2 size={14} className="animate-spin" /> Đang tải bộ đề…
                </div>
              ) : boLuyen ? (() => {
                const tk = thongKeModule(boLuyen, daGiai);
                return (
                  <>
                    <h1 className="cl-display text-xl leading-snug" style={{ color: 'var(--text-primary)' }}>{pickLang(boLuyen.name, 'vi')}</h1>
                    {boLuyen.description && (
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{boLuyen.description}</p>
                    )}
                    <div className="cl-toc-meta mt-2">
                      <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{tk.soDe} đề · từ dễ đến khó</span>
                      {DIFF_ORDER.filter((k) => tk.doKho[k] > 0).map((k) => (
                        <span key={k} className="cl-toc-diff" style={{ color: DIFF_UI[k].color, background: DIFF_UI[k].bg }}>{DIFF_UI[k].label} {tk.doKho[k]}</span>
                      ))}
                      {tk.soDe > 0 && <span className="inline-flex items-center gap-1"><Clock size={11} />≈ {tk.phut} phút</span>}
                      {isAuthed && tk.soDe > 0 && <span className="tabular-nums">· đã làm {tk.daLam}/{tk.soDe}</span>}
                    </div>
                  </>
                );
              })() : (
                <>
                  <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Bộ đề cho bài{reflabel ? ` “${reflabel}”` : ' này'} đang được soạn
                  </h1>
                  <div className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {cheDoApi && boApi?.goiY?.items.length
                      ? 'Trong lúc chờ, luyện tạm vài bài gần nhất:'
                      : `Chưa có bài học “${bai}” trong ${track.name}. Mở mục lục để chọn bài học khác.`}
                  </div>
                  {cheDoApi && boApi?.goiY && boApi.goiY.items.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {boApi.goiY.items.map((g) => (
                        <li key={g.slug} className="min-w-0 max-w-full">
                          <Link href={`/code-lab/${boApi.goiY!.trackSlug}/${g.slug}${allQS}`} className="cl-fpill max-w-full">
                            <span className="truncate">{g.title}</span> <DifficultyChip difficulty={g.difficulty} small />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {cheDoApi && boApi?.goiY?.moduleSlug && (
                    <Link href={duongBaiHoc(boApi.goiY.trackSlug, boApi.goiY.moduleSlug, mangTheo)} className="mt-2 inline-flex max-w-full items-center gap-1 text-xs font-semibold underline-offset-2 hover:underline" style={{ color: 'var(--text-primary)' }}>
                      <span className="truncate">Mở cả bài học “{boApi.goiY.moduleName || boApi.goiY.moduleSlug}” ({boApi.goiY.trackName})</span> <ArrowRight size={13} className="shrink-0" />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Link href={duongMucLuc(slug, chuongCuaBai)} className="cl-set-band-btn inline-flex items-center gap-1.5">
              <ListTree size={14} /> Mục lục
            </Link>
            {lanCan.sau && (
              <Link href={duongBaiHoc(slug, lanCan.sau.slug)} className="cl-set-band-btn ml-auto inline-flex min-w-0 max-w-full items-center gap-1.5">
                <span className="truncate">Bài học tiếp theo</span> <ArrowRight size={14} className="shrink-0" />
              </Link>
            )}
          </div>

          {moduleThat?.hasLesson && boLuyen && (
            <div className="mb-4 overflow-hidden rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <ModuleLesson moduleId={moduleThat.id} hasLesson autoOpen={focusModuleId === moduleThat.id} />
            </div>
          )}
        </>
      )}

      {/* ════════ HERO (mục lục + chế độ chọn bài) ════════ */}
      {!cheDoBaiHoc && (
        <div className="cl-hero cl-in mb-6 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="cl-track-icon shrink-0" style={{ height: 60, width: 60, borderRadius: 16 }}>
              <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={32} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="cl-display text-2xl">{track.name}</h1>
                <LevelPill level={track.level} />
                {parseVerified(track.description).verified && <VerifiedBadge />}
              </div>
              {parseVerified(track.description).text && <p className="mt-1.5 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{parseVerified(track.description).text}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                  <TechIcon slug={track.slug} name={track.name} icon={track.icon} color={track.color} size={13} />{track.language}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                  <ListTree size={12} />{mucLuc.nhom.reduce((n, g) => n + g.dong.length, 0)} bài học
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                  <Target size={12} />{total} đề
                </span>
                {track.docsUrl && (
                  <a href={track.docsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: accent }}>
                    <ExternalLink size={12} /> Official docs
                  </a>
                )}
                {isAuthed && total > 0 && (
                  <button
                    onClick={() => { setDangChon((v) => !v); if (dangChon) setDaChon([]); }}
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors"
                    style={dangChon
                      ? { background: accent, borderColor: accent, color: '#fff' }
                      : { borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                    <FlaskConical size={12} /> {dangChon ? 'Xong, thoát chọn' : 'Chọn bài lập phòng Lab'}
                  </button>
                )}
                {isAuthed && (
                  <Link href="/code-lab/phong-lab" className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[var(--bg-surface-hover)]"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
                    Phòng Lab của tôi
                  </Link>
                )}
              </div>
            </div>
            {isAuthed && total > 0 && (
              <div className="hidden shrink-0 flex-col items-center sm:flex">
                <div className="relative">
                  <ProgressRing value={total ? solved / total : 0} size={64} />
                  <span className="cl-stat-num absolute inset-0 flex items-center justify-center text-sm">{pct}%</span>
                </div>
                <span className="mt-1 text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{solved}/{total} đã giải</span>
              </div>
            )}
          </div>
          {isAuthed && total > 0 && (
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 55%, #22c55e))` }} />
            </div>
          )}
        </div>
      )}

      {(track.modules || []).length === 0 && (
        <div className="rounded-xl border py-12 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          Track này chưa có bài học.
        </div>
      )}

      {/* GIÁO TRÌNH — mọi module chỉ-có-bài-giảng gom vào MỘT mục, đặt trên mục lục bài tập. */}
      {cheDoMucLuc && coGiaoTrinh && (
        <section
          className="mb-5 overflow-hidden rounded-2xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <header className="flex flex-wrap items-center gap-2 border-b px-4 py-3.5" style={{ borderColor: 'var(--border-color)' }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
              style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent, border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)` }}>
              <BookOpenText size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Giáo trình — đọc trước khi làm bài</h2>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                {baiGiang.length} bài giảng, theo thứ tự nên đọc. Mỗi bài mở ngay tại đây và có AI giải thích từng mục.
              </p>
            </div>
          </header>
          <div>
            {baiGiang.map((m, i) => (
              <ModuleLesson
                key={m.id}
                id={`module-${m.id}`}
                moduleId={m.id}
                hasLesson={m.hasLesson}
                autoOpen={focusModuleId === m.id}
                ten={m.name}
                moTa={m.description}
                soThuTu={i + 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* ════════ MỤC LỤC ════════ */}
      {cheDoMucLuc && mucLuc.nhom.length > 0 && (
        <>
          {batDauTu ? (
            <Link href={duongBaiHoc(slug, batDauTu.dong.module.slug, mangTheo)} className="cl-set-band cl-toc-start cl-in mb-4">
              <span className="cl-set-band-icon"><PlayCircle size={18} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  {solved > 0 ? 'Làm tiếp từ' : 'Bắt đầu từ'}
                </span>
                <span className="block truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {batDauTu.dong.soBai ? `${batDauTu.dong.soBai} ` : ''}{tenBoSo(batDauTu.dong.module.name)}
                </span>
                <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                  {batDauTu.nhom.so != null ? `Chương ${batDauTu.nhom.so} · ` : ''}{batDauTu.dong.tk.soDe} đề
                  {isAuthed && batDauTu.dong.tk.daLam > 0 ? ` · đã làm ${batDauTu.dong.tk.daLam}` : ''}
                </span>
              </span>
              <span className="cl-set-band-btn inline-flex shrink-0 items-center gap-1">Luyện tập <ArrowRight size={14} /></span>
            </Link>
          ) : total > 0 && (
            <div className="cl-set-band cl-in mb-4">
              <span className="cl-set-band-icon"><CheckCircle2 size={18} style={{ color: '#22c55e' }} /></span>
              <span className="text-sm font-semibold">Bạn đã làm hết {total} đề của track này.</span>
            </div>
          )}

          <div className="cl-toc-tools mb-3">
            <label className="cl-toc-search">
              <Search size={15} aria-hidden style={{ color: 'var(--text-muted)' }} />
              <input
                type="search" value={timBai} onChange={(e) => setTimBai(e.target.value)}
                placeholder="Tìm nhanh tên bài học…" aria-label="Tìm bài học"
              />
              {timBai && <button type="button" onClick={() => setTimBai('')} aria-label="Xoá ô tìm"><X size={14} /></button>}
            </label>
            {mucLuc.nhom.length > 1 && !timBai && (
              <button
                type="button" className="cl-fpill"
                onClick={() => setMoChuong(chuongDangMo.size >= mucLuc.nhom.length ? new Set() : new Set(mucLuc.nhom.map((g) => g.key)))}
              >
                {chuongDangMo.size >= mucLuc.nhom.length ? 'Gập tất cả' : 'Mở tất cả'}
              </button>
            )}
          </div>

          {timBai && mucLucLoc.nhom.length === 0 && (
            <div className="rounded-xl border py-10 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Không có bài học nào khớp “{timBai}”.
            </div>
          )}

          <div className="space-y-3">
            {mucLucLoc.nhom.map((g) => {
              const mo = !!timBai || chuongDangMo.has(g.key);
              const xongChuong = g.soDe > 0 && g.daLam === g.soDe;
              return (
                <section key={g.key} id={g.so != null ? `chuong-${g.so}` : undefined} className="cl-toc-ch scroll-mt-24">
                  <button type="button" className="cl-toc-head" aria-expanded={mo} onClick={() => toggleNhom(g.key)} disabled={!!timBai}>
                    <ChevronDown size={17} className="shrink-0 transition-transform" style={{ transform: mo ? undefined : 'rotate(-90deg)', color: 'var(--text-muted)' }} />
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{g.ten}</span>
                      <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                        {g.dong.length} bài học · {g.soDe} đề
                      </span>
                    </span>
                    {g.dong.some((d) => dangCuaModule(d.module) !== 'practice') && (
                      <span className="cl-toc-cokind hidden sm:inline-flex">
                        {[...new Set(g.dong.map((d) => dangCuaModule(d.module)).filter((k) => k !== 'practice'))].map((k) => <span key={k} data-kind={k}>{TEN_DANG_NGAN[k]}</span>)}
                      </span>
                    )}
                    {isAuthed && g.soDe > 0 && (
                      <span className="cl-toc-chprog" title={`Đã giải ${g.daLam}/${g.soDe} đề của chương`}>
                        <span className="cl-toc-bar"><span style={{ width: `${Math.round((g.daLam / g.soDe) * 100)}%`, background: xongChuong ? '#22c55e' : accent }} /></span>
                        <span className="tabular-nums" style={{ color: xongChuong ? '#22c55e' : 'var(--text-muted)' }}>{g.daLam}/{g.soDe}</span>
                      </span>
                    )}
                  </button>
                  {mo && (() => {
                    const ds = sapTheoDang(g.dong);
                    return <ul className="cl-toc-list">{ds.map((d, i) => renderDong(d, i, ds))}</ul>;
                  })()}
                </section>
              );
            })}
          </div>

          <div className="mt-6"><SkillCoverage trackSlug={slug} /></div>
        </>
      )}

      {/* ════════ Bộ lọc (trang bài học + chế độ chọn bài) ════════ */}
      {!cheDoMucLuc && moduleHienThi.some((m) => (m.exercises || []).length > 0) && (
        <div className="cl-filterbar mb-4" role="group" aria-label="Lọc bài tập">
          <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}><Filter size={13} /> Độ khó</span>
          <button type="button" className="cl-fpill" data-on={locDoKho === 'all' ? 'true' : undefined} onClick={() => setLocDoKho('all')}>Tất cả</button>
          {DIFF_ORDER.filter((d) => demDoKho[d] > 0).map((d) => (
            <button key={d} type="button" className="cl-fpill" data-on={locDoKho === d ? 'true' : undefined} onClick={() => setLocDoKho(d)}
              style={locDoKho === d ? { background: DIFF_UI[d].bg, color: DIFF_UI[d].color, borderColor: DIFF_UI[d].border } : undefined}>
              {DIFF_UI[d].label} <span className="tabular-nums opacity-70">{demDoKho[d]}</span>
            </button>
          ))}
          {isAuthed && (
            <>
              <span className="mx-1 hidden h-4 w-px sm:inline-block" style={{ background: 'var(--border-color)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Trạng thái</span>
              {([['all', 'Tất cả'], ['done', 'Đã làm'], ['todo', 'Chưa làm']] as const).map(([v, label]) => (
                <button key={v} type="button" className="cl-fpill" data-on={locTrangThai === v ? 'true' : undefined} onClick={() => setLocTrangThai(v)}>{label}</button>
              ))}
            </>
          )}
          {dangLoc && (
            <button type="button" onClick={() => { setLocDoKho('all'); setLocTrangThai('all'); }} className="ml-auto inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <X size={13} /> Bỏ lọc
            </button>
          )}
        </div>
      )}

      {!cheDoMucLuc && (
        <div className="space-y-5">
          {dangLoc && !moduleHienThi.some((m) => (m.exercises || []).some(hopLoc)) && (
            <div className="rounded-xl border py-10 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Không có bài nào khớp bộ lọc.
            </div>
          )}
          {moduleHienThi.map((m, mi) => renderModule(m, mi, cheDoBaiHoc))}
        </div>
      )}

      {/* Cuối trang bài học: đi tiếp mà không phải quay về mục lục. */}
      {cheDoBaiHoc && boLuyen && lanCan.sau && (
        <Link href={duongBaiHoc(slug, lanCan.sau.slug)} className="cl-nextlink mt-5">
          <span className="min-w-0 truncate">Bài học tiếp theo: <b>{lanCan.sau.name}</b></span>
          <ChevronRight size={15} className="ml-auto shrink-0" />
        </Link>
      )}

      {/* Thanh chọn bài dính đáy. Chừa chỗ cuộn để nó không che mất bài cuối. */}
      {dangChon && picked.length > 0 && <div style={{ height: coLoc ? 132 : 96 }} />}
      {/* Mốc góc phải. Gác bằng ĐÚNG `isAuthed`: lối vào phải thấy được kể cả khi
          danh sách bài chưa kịp về. */}
      {isAuthed && (
        <LabRoomBeacon
          accent={accent}
          dangChon={dangChon}
          soBai={picked.length}
          totalLoc={totalLoc}
          coLoc={coLoc}
          onToggle={() => { setDangChon((v) => !v); if (dangChon) setDaChon([]); }}
        />
      )}

      {dangChon && (
        <LabRoomBar
          trackSlug={track.slug} trackName={track.name}
          picked={picked} totalLoc={totalLoc} coLoc={coLoc}
          phongGhim={phongGhim}
          onClear={() => setDaChon([])}
          onRemove={(id) => setDaChon((cu) => cu.filter((x) => x !== id))}
        />
      )}
    </div>
  );
}

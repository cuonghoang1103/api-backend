'use client';

/**
 * Code Lab — trang chủ (đợt Academy 28/10/2026).
 *
 * Chủ web 28/10: "giao diện, bố cục… sắp xếp đề bài chương trong đó khó hiểu quá". Trước đây trang chủ là
 * một lưới 51 track trộn lẫn kho đề AI với bộ luyện theo môn học ⇒ người học không biết bắt đầu từ đâu.
 * Giờ BA LỐI VÀO tách bạch, theo thứ tự ưu tiên:
 *   1. Môn học (Academy) — bộ luyện bám giáo trình FPT (FER202, SWT301, SWR302…): mỗi bài học một bộ
 *      dễ → khó, Lab chương, Deep Lab, PE luyện, có máy chấm. Môn chưa có bộ ⇒ thẻ "Đang soạn".
 *   2. Khoá học (Courses) — bộ luyện đi kèm khoá trên web (Nền tảng Web…).
 *   3. Kho mở rộng — kho đề theo công nghệ (soạn bằng AI) — không chắn lộ trình.
 * Danh mục 1–2 do máy chủ quyết (`GET /code-lab/catalog`, bảng PRACTICE_CATALOG ở codeLab.practice.ts).
 * Ô tìm + bộ lọc (độ khó, chủ đề, trạng thái) đưa sang trang tìm kiếm.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, X, Loader2, ArrowRight, GraduationCap, BookOpen, Boxes, CheckCircle2, FlaskConical, Hourglass, Sparkles, Target,
} from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import { docTruyVan, ghiTruyVan } from '@/components/sach-hoc/moiTruong';
import type { CodeCatalogEntry, CodeGroup, CodeStats } from '@/types/code-lab';
import { GroupGlyph, TrackCard, DifficultyBadge } from '@/components/code-lab/shared';
import { useAuthStore } from '@/store/authStore';

type Suggest = Awaited<ReturnType<typeof codeLabApi.autocomplete>>['data']['data'];
type Mine = Record<number, { solved: number; inProgress: number }>;

const TEN_KIND: Array<[string, string]> = [['practice', 'bài luyện'], ['lab', 'Lab'], ['deep-lab', 'Deep Lab'], ['pe', 'PE luyện'], ['project', 'dự án']];

function TheMon({ c, mine, i }: { c: CodeCatalogEntry; mine: Mine | null; i: number }) {
  const t = c.track;
  const accent = t?.color || (c.loai === 'academy' ? '#6366f1' : '#e34f26');
  if (!t) {
    return (
      <div className="cl-mon is-soan cl-in" style={{ animationDelay: `${Math.min(i, 8) * 0.04}s`, ['--cl-accent' as string]: accent } as React.CSSProperties}>
        <div className="cl-mon-top">
          {c.ma && <span className="cl-mon-ma">{c.ma}</span>}
          <span className="cl-mon-tt"><Hourglass size={12} /> Đang soạn</span>
        </div>
        <div className="cl-mon-ten">{c.ten}</div>
        <p className="cl-mon-mo">Bộ luyện của môn này đang được soạn — lên dần theo nhịp video bài giảng.</p>
      </div>
    );
  }
  const da = mine?.[t.id]?.solved ?? 0;
  const pct = t.exerciseCount ? Math.round((da * 100) / t.exerciseCount) : 0;
  const kinds = TEN_KIND.filter(([k]) => (t.byKind[k] ?? 0) > 0);
  return (
    <Link
      href={`/code-lab/${t.slug}`}
      className="cl-mon cl-in"
      style={{ animationDelay: `${Math.min(i, 8) * 0.04}s`, ['--cl-accent' as string]: accent } as React.CSSProperties}
    >
      <div className="cl-mon-top">
        {c.ma ? <span className="cl-mon-ma">{c.ma}</span> : <span className="cl-mon-ma is-course"><BookOpen size={13} /> Khoá học</span>}
        {t.graded > 0 && <span className="cl-mon-tt is-cham"><FlaskConical size={12} /> Có máy chấm</span>}
      </div>
      <div className="cl-mon-ten">{c.loai === 'course' ? t.name.replace(/\s*—\s*Luyện tập$/, '') : c.ten}</div>
      <div className="cl-mon-so">
        {kinds.map(([k, ten]) => <span key={k}><b>{t.byKind[k]}</b> {ten}</span>)}
        <span><b>{t.moduleCount}</b> bài học</span>
      </div>
      <div className="cl-mon-diff" aria-label="Độ khó">
        {(['EASY', 'MEDIUM', 'HARD'] as const).map((d) => (t.byDifficulty[d] ?? 0) > 0 && (
          <span key={d} data-d={d}>{d === 'EASY' ? 'Dễ' : d === 'MEDIUM' ? 'Vừa' : 'Khó'} {t.byDifficulty[d]}</span>
        ))}
      </div>
      {mine && (
        <div className="cl-mon-tien" title={`${da}/${t.exerciseCount} bài đã giải`}>
          <div className="cl-mon-thanh"><span style={{ width: `${pct}%` }} /></div>
          <span className="tabular-nums">{da}/{t.exerciseCount}</span>
        </div>
      )}
      <span className="cl-mon-cta">{da > 0 ? 'Học tiếp' : 'Vào lộ trình'} <ArrowRight size={14} /></span>
    </Link>
  );
}

export default function CodeLabHubPage() {
  const router = useRouter();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [stats, setStats] = useState<CodeStats | null>(null);
  const [catalog, setCatalog] = useState<CodeCatalogEntry[] | null>(null);
  const [mine, setMine] = useState<Mine | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<number | 'all'>('all');

  const [q, setQ] = useState('');
  const [suggest, setSuggest] = useState<Suggest | null>(null);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const [g, s, c] = await Promise.all([codeLabApi.getGroups(), codeLabApi.getStats(), codeLabApi.getCatalog().catch(() => null)]);
        const gl = g.data.data || [];
        setGroups(gl);
        setStats(s.data.data || null);
        if (c) { setCatalog(c.data.data.catalog); setMine(c.data.data.mine); }
        const slug = docTruyVan().get('group');
        if (slug) {
          const found = gl.find((x) => x.slug === slug);
          if (found) setActiveGroup(found.id);
        }
      } catch { /* ignore */ } finally { setLoading(false); }
    })();
  }, [isAuthed]);

  const selectGroup = (id: number | 'all') => {
    setActiveGroup(id);
    const slug = id === 'all' ? null : groups.find((x) => x.id === id)?.slug;
    ghiTruyVan((sp) => { if (slug) sp.set('group', slug); else sp.delete('group'); });
  };

  useEffect(() => {
    const term = q.trim();
    if (!term) { setSuggest(null); setOpen(false); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await codeLabApi.autocomplete(term, 8);
        setSuggest(res.data.data);
        setOpen(true);
      } catch { /* ignore */ } finally { setSearching(false); }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Kho mở rộng = mọi track KHÔNG thuộc lối vào Academy/Courses.
  const catalogSlugs = useMemo(() => new Set((catalog ?? []).map((c) => c.trackSlug)), [catalog]);
  const visibleGroups = useMemo(
    () => groups.filter((g) => (g.tracks ?? []).some((t) => !catalogSlugs.has(t.slug))),
    [groups, catalogSlugs],
  );
  const tracks = useMemo(() => {
    const keep = (t: { slug: string }) => !catalogSlugs.has(t.slug);
    if (activeGroup === 'all') {
      const seen = new Set<number>();
      return groups.flatMap((g) => g.tracks || []).filter(keep).filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));
    }
    return (groups.find((g) => g.id === activeGroup)?.tracks || []).filter(keep);
  }, [groups, activeGroup, catalogSlugs]);

  const academy = (catalog ?? []).filter((c) => c.loai === 'academy');
  const courses = (catalog ?? []).filter((c) => c.loai === 'course');
  const tongGiai = mine ? Object.values(mine).reduce((s, m) => s + m.solved, 0) : 0;
  const tongDang = mine ? Object.values(mine).reduce((s, m) => s + m.inProgress, 0) : 0;
  const coCham = (catalog ?? []).reduce((s, c) => s + (c.track?.graded ?? 0), 0);

  const submitSearch = (extra = '') => {
    const term = q.trim();
    router.push(`/code-lab/search?${term ? `q=${encodeURIComponent(term)}` : ''}${extra}`);
  };

  return (
    <div className="cl-root mx-auto max-w-6xl px-4 pb-16 pt-20" style={{ color: 'var(--text-primary)' }}>
      {/* ————— Đầu trang ————— */}
      <section className="cl-hero cl-home-hero cl-in mb-8">
        <div className="cl-home-hero-l">
          <div className="cl-eyebrow cl-in cl-in-1 mb-3">cuongthai · Code Lab</div>
          <h1 className="cl-display cl-in cl-in-1 text-[1.55rem] leading-tight sm:text-[2.5rem]">
            Luyện code mỗi ngày — <span className="cl-gradient-text">đúng môn, đúng bài</span>, có máy chấm.
          </h1>
          <p className="cl-in cl-in-2 mt-3 hidden max-w-xl text-[15px] leading-relaxed sm:block" style={{ color: 'var(--text-secondary)' }}>
            Như LeetCode nhưng dễ hiểu hơn: mỗi bài học có một bộ đề từ dễ đến khó, rồi Lab chương, Deep Lab và PE luyện
            trình bày như tờ đề cô phát. Bấm <b>Chạy thử</b> để xem kiểm mẫu, <b>Nộp</b> để chấm cả kiểm ẩn.
          </p>
          <div ref={boxRef} className="cl-searchbox cl-in cl-in-2 mt-6 max-w-xl text-left">
            <div className="cl-search">
              <Search size={19} style={{ color: 'var(--text-muted)' }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); }}
                onFocus={() => suggest && setOpen(true)}
                placeholder="Tìm đề, chủ đề, công nghệ… (vd: flexbox, useState)"
                className="flex-1 bg-transparent text-[15px] outline-none"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Tìm đề"
              />
              {searching && <Loader2 size={17} className="animate-spin" style={{ color: 'var(--text-muted)' }} />}
              {q && !searching && (
                <button onClick={() => { setQ(''); setSuggest(null); }} aria-label="Xoá" className="grid place-items-center rounded-md p-0.5 hover:bg-[var(--bg-surface-hover)]">
                  <X size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              )}
            </div>
            {open && suggest && (suggest.tracks.length > 0 || suggest.exercises.length > 0) && (
              <div className="cl-suggest">
                {suggest.tracks.length > 0 && <div className="px-3.5 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Lộ trình</div>}
                {suggest.tracks.map((t) => (
                  <Link key={`t${t.id}`} href={`/code-lab/${t.slug}`} className="cl-suggest-row" onClick={() => setOpen(false)}>
                    <span style={{ color: t.color || 'var(--accent-color)' }}><GroupGlyph icon={t.language} size={16} /></span>
                    <span style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                    <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{t.language}</span>
                  </Link>
                ))}
                {suggest.exercises.length > 0 && <div className="px-3.5 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Đề</div>}
                {suggest.exercises.map((ex) => (
                  <Link key={`e${ex.id}`} href={`/code-lab/${ex.track?.slug || ''}/${ex.slug}`} className="cl-suggest-row" onClick={() => setOpen(false)}>
                    <span className="truncate" style={{ color: 'var(--text-primary)' }}>{ex.title}</span>
                    <span className="ml-auto"><DifficultyBadge difficulty={ex.difficulty} small /></span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="cl-in cl-in-3 mt-3 flex flex-wrap items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="mr-1">Lọc nhanh:</span>
            <button type="button" className="cl-fpill" onClick={() => submitSearch('&difficulty=EASY')}>Dễ</button>
            <button type="button" className="cl-fpill" onClick={() => submitSearch('&difficulty=MEDIUM')}>Vừa</button>
            <button type="button" className="cl-fpill" onClick={() => submitSearch('&difficulty=HARD')}>Khó</button>
            {isAuthed && <button type="button" className="cl-fpill" onClick={() => submitSearch('&trangThai=dang')}>Đang làm dở</button>}
            <Link href="/code-lab/search" className="cl-fpill">Tất cả bộ lọc →</Link>
          </div>
        </div>
        <aside className="cl-home-hero-r cl-in cl-in-3" aria-label="Số liệu">
          {isAuthed && mine ? (
            <>
              <div className="cl-home-stat-h">Tiến độ của bạn</div>
              <div className="cl-home-stat"><CheckCircle2 size={16} style={{ color: '#16a34a' }} /><b>{tongGiai}</b> bài đã giải</div>
              <div className="cl-home-stat"><Target size={16} style={{ color: '#d97706' }} /><b>{tongDang}</b> bài đang làm</div>
              <div className="cl-home-stat-sub">“Đã giải” chỉ tính khi <b>Nộp</b> đạt mọi kiểm (bài có máy chấm).</div>
            </>
          ) : (
            <>
              <div className="cl-home-stat-h">Code Lab hôm nay</div>
              {stats && <div className="cl-home-stat"><Boxes size={16} /><b>{stats.tracks}</b> lộ trình · <b>{stats.exercises.toLocaleString('vi-VN')}</b> đề</div>}
              {coCham > 0 && <div className="cl-home-stat"><FlaskConical size={16} style={{ color: '#0d9488' }} /><b>{coCham}</b> đề có máy chấm</div>}
              <div className="cl-home-stat-sub"><Link href="/login?redirect=%2Fcode-lab" className="underline">Đăng nhập</Link> để lưu lượt nộp và tiến độ.</div>
            </>
          )}
        </aside>
      </section>

      {/* ————— 1. Môn học (Academy) ————— */}
      <section className="mb-10" aria-labelledby="h-academy">
        <div className="cl-home-sec-h">
          <h2 id="h-academy"><GraduationCap size={20} /> Môn học (Academy)</h2>
          <p>Bám giáo trình FPT — mỗi bài học một bộ luyện dễ → khó, Lab chương, Deep Lab và PE luyện có đồng hồ.</p>
        </div>
        {catalog == null ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="cl-skel" />)}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {academy.filter((c) => c.track).map((c, i) => <TheMon key={c.trackSlug} c={c} mine={mine} i={i} />)}
            </div>
            {academy.some((c) => !c.track) && (
              <div className="cl-sap-co cl-in" aria-label="Môn đang soạn bộ luyện">
                <span className="cl-sap-co-h"><Hourglass size={14} /> Đang soạn</span>
                {academy.filter((c) => !c.track).map((c) => (
                  <span key={c.trackSlug} className="cl-sap-co-mon" title={`${c.ten} — bộ luyện lên dần theo nhịp video bài giảng`}>
                    <b>{c.ma}</b> {c.ten}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ————— 2. Khoá học (Courses) ————— */}
      {courses.length > 0 && (
        <section className="mb-10" aria-labelledby="h-courses">
          <div className="cl-home-sec-h">
            <h2 id="h-courses"><BookOpen size={20} /> Khoá học (Courses)</h2>
            <p>Bộ luyện đi kèm khoá học trên web — nút “🏋️ Luyện tập” ngay dưới mỗi video mở đúng bộ của bài đó.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => <TheMon key={c.trackSlug} c={c} mine={mine} i={i} />)}
          </div>
        </section>
      )}

      {/* ————— 3. Kho mở rộng ————— */}
      <section aria-labelledby="h-kho">
        <div className="cl-home-sec-h">
          <h2 id="h-kho"><Sparkles size={20} /> Kho mở rộng</h2>
          <p>Kho đề theo công nghệ (soạn bằng AI, đang dọn dần chất lượng) — luyện thêm khi đã xong lộ trình. Phần lớn chưa có máy chấm: tự đánh dấu.</p>
        </div>
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => selectGroup('all')} className="cl-pill" data-active={activeGroup === 'all'} style={activeGroup === 'all' ? { background: 'var(--accent-color)' } : undefined}>
            Tất cả
          </button>
          {visibleGroups.map((g) => {
            const active = activeGroup === g.id;
            return (
              <button key={g.id} onClick={() => selectGroup(g.id)} className="cl-pill" data-active={active} style={active ? { background: g.color || 'var(--accent-color)' } : undefined}>
                <GroupGlyph slug={g.slug} icon={g.icon} size={14} />
                {g.name}
                <span className="text-[11px] font-semibold opacity-70">{(g.tracks ?? []).filter((t) => !catalogSlugs.has(t.slug)).length}</span>
              </button>
            );
          })}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="cl-skel" />)}</div>
        ) : tracks.length === 0 ? (
          <div className="rounded-2xl border py-16 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Chưa có lộ trình nào.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((t, i) => <TrackCard key={t.id} track={t} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}

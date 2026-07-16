'use client';

/**
 * /admin/games — catalogue management.
 *
 * Dashboard widgets (stat cards + a 14-day plays histogram), filters, and a
 * drag-to-reorder table whose order persists via POST /admin/games/reorder.
 *
 * The histogram is hand-rolled inline SVG rather than recharts: it's 14 bars,
 * and recharts would add ~100KB to the admin bundle for it. The prompt's
 * constraint was "no heavy chart dependency" — this honours the spirit while
 * staying lighter than reusing the lib.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus, Search, Pencil, Trash2, Star, GripVertical, Loader2, AlertTriangle,
  Gamepad2, Eye, EyeOff, Clock, Tags, ExternalLink,
} from 'lucide-react';
import {
  adminGamesApi, adminGameCategoriesApi,
  type GameDto, type GameCategoryDto, type GameAdminStats, type GameStatus,
} from '@/lib/api';

const STATUS_TABS: { id: '' | GameStatus; label: string }[] = [
  { id: '', label: 'Tất cả' },
  { id: 'PUBLISHED', label: 'Published' },
  { id: 'DRAFT', label: 'Draft' },
  { id: 'COMING_SOON', label: 'Coming soon' },
];

const STATUS_STYLE: Record<GameStatus, string> = {
  PUBLISHED: 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/20',
  DRAFT: 'bg-white/[0.04] text-text-muted border-darkborder',
  COMING_SOON: 'bg-neon-orange/10 text-neon-orange border-neon-orange/20',
};

export default function AdminGamesPage() {
  const [games, setGames] = useState<GameDto[]>([]);
  const [categories, setCategories] = useState<GameCategoryDto[]>([]);
  const [stats, setStats] = useState<GameAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState<'' | GameStatus>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [deleteTarget, setDeleteTarget] = useState<GameDto | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  // Debounce the search box so typing doesn't hammer the API.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [g, s] = await Promise.all([
        adminGamesApi.list({
          size: 100,
          q: debounced || undefined,
          status: status || undefined,
          categoryId: categoryId === '' ? undefined : categoryId,
        }),
        adminGamesApi.stats(),
      ]);
      setGames(g.data.data);
      setStats(s.data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không tải được danh sách');
    } finally {
      setLoading(false);
    }
  }, [debounced, status, categoryId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    adminGameCategoriesApi.list().then((r) => setCategories(r.data.data)).catch(() => {});
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Reordering is only meaningful on the unfiltered, unsorted list.
  const canReorder = !debounced && !status && categoryId === '';

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = games.findIndex((g) => g.id === active.id);
    const newIndex = games.findIndex((g) => g.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(games, oldIndex, newIndex);
    setGames(next); // optimistic
    setSavingOrder(true);
    try {
      await adminGamesApi.reorder(next.map((g, i) => ({ id: g.id, sortOrder: (i + 1) * 10 })));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lưu thứ tự thất bại');
      load(); // revert to server truth
    } finally {
      setSavingOrder(false);
    }
  };

  const toggleFeatured = async (g: GameDto) => {
    setGames((prev) => prev.map((x) => (x.id === g.id ? { ...x, featured: !x.featured } : x)));
    try {
      await adminGamesApi.update(g.id, { featured: !g.featured });
    } catch (err) {
      setGames((prev) => prev.map((x) => (x.id === g.id ? { ...x, featured: g.featured } : x)));
      toast.error(err instanceof Error ? err.message : 'Không đổi được featured');
    }
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminGamesApi.remove(deleteTarget.id);
      toast.success('Đã xoá game');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xoá thất bại');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-neon-violet" /> Games
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Quản lý thư viện game hiển thị ở{' '}
            <a href="/games" className="text-neon-violet hover:underline">/games</a>. Draft ẩn hoàn toàn; Coming soon vẫn hiện nhưng khoá.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/games/categories" className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:border-neon-violet/30 transition-all">
            <Tags className="w-4 h-4" /> Chuyên mục
          </Link>
          <Link href="/admin/games/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> Game mới
          </Link>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Tổng game" value={stats?.total ?? 0} accent="text-text-primary" />
        <Stat label="Published" value={stats?.published ?? 0} accent="text-neon-emerald" />
        <Stat label="Draft" value={stats?.drafts ?? 0} accent="text-neon-orange" />
        <Stat label="Lượt chơi (7 ngày / tổng)" value={stats?.plays7 ?? 0} sub={`${stats?.playsAll ?? 0} tổng`} accent="text-neon-violet" />
      </div>

      <PlaysChart daily={stats?.daily ?? []} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề…"
            className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
          />
        </div>
        <div className="flex gap-1 rounded-xl bg-darkcard border border-darkborder p-1">
          {STATUS_TABS.map((t) => (
            <button
              key={t.id || 'all'}
              onClick={() => setStatus(t.id)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                status === t.id ? 'bg-neon-violet/20 text-neon-violet' : 'text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
          className="px-3 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
        >
          <option value="">Mọi chuyên mục</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {!canReorder && (
        <p className="text-[11px] text-text-muted -mt-2">
          Xoá bộ lọc để bật kéo-thả sắp xếp thứ tự.
        </p>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-darkcard/60 border border-darkborder overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-text-muted">
            <Loader2 className="w-5 h-5 mx-auto animate-spin text-neon-violet" />
            <p className="mt-2 text-sm">Đang tải…</p>
          </div>
        ) : games.length === 0 ? (
          <div className="py-16 text-center text-text-muted">
            <p className="text-sm">Không có game nào khớp bộ lọc.</p>
            <Link href="/admin/games/new" className="mt-3 inline-block text-neon-violet hover:underline text-sm">Tạo game đầu tiên</Link>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={games.map((g) => g.id)} strategy={verticalListSortingStrategy}>
              <ul>
                {games.map((g) => (
                  <GameRow
                    key={g.id}
                    game={g}
                    canReorder={canReorder}
                    onToggleFeatured={() => toggleFeatured(g)}
                    onDelete={() => setDeleteTarget(g)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
        {savingOrder && (
          <div className="px-4 py-2 border-t border-darkborder text-[11px] text-text-muted flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" /> Đang lưu thứ tự…
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-md bg-[#0d0f18] border border-darkborder rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-heading font-semibold text-text-primary">Xoá game này?</h3>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  <span className="text-text-primary font-medium">“{deleteTarget.title}”</span> và toàn bộ điểm đã ghi sẽ bị xoá vĩnh viễn.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.06]">Huỷ</button>
              <button onClick={doDelete} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 text-red-300 text-sm font-semibold hover:bg-red-500/25">
                <Trash2 className="w-4 h-4" /> Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Row ───────────────────────────────────────────────────────────

function GameRow({ game, canReorder, onToggleFeatured, onDelete }: {
  game: GameDto; canReorder: boolean; onToggleFeatured: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: game.id,
    disabled: !canReorder,
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 px-3 py-3 border-b border-darkborder/60 hover:bg-white/[0.02] transition-colors">
      <button
        {...attributes} {...listeners}
        className={['p-1 text-text-muted', canReorder ? 'cursor-grab active:cursor-grabbing hover:text-text-primary' : 'opacity-20 cursor-not-allowed'].join(' ')}
        aria-label="Kéo để sắp xếp"
        disabled={!canReorder}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="w-16 h-10 rounded-lg overflow-hidden bg-darkbg border border-darkborder shrink-0 flex items-center justify-center">
        {game.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <Gamepad2 className="w-4 h-4 text-text-muted" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-text-primary truncate">{game.title}</p>
          {game.kind === 'IFRAME' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-text-muted">iframe</span>}
        </div>
        <p className="text-xs text-text-muted truncate">{game.description}</p>
      </div>

      <span
        className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0"
        style={{
          color: game.category?.color ?? undefined,
          borderColor: game.category?.color ? `${game.category.color}40` : undefined,
          backgroundColor: game.category?.color ? `${game.category.color}18` : undefined,
        }}
      >
        {game.category?.name ?? '—'}
      </span>

      <span className={['hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0', STATUS_STYLE[game.status]].join(' ')}>
        {game.status === 'PUBLISHED' ? <Eye className="w-3 h-3" /> : game.status === 'DRAFT' ? <EyeOff className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {game.status === 'COMING_SOON' ? 'Soon' : game.status === 'PUBLISHED' ? 'Live' : 'Draft'}
      </span>

      <button
        onClick={onToggleFeatured}
        className={['p-1.5 rounded-lg transition-colors shrink-0', game.featured ? 'text-neon-orange' : 'text-text-muted hover:text-text-primary'].join(' ')}
        aria-label={game.featured ? 'Bỏ featured' : 'Đặt featured'}
        title={game.featured ? 'Bỏ featured' : 'Đặt featured'}
      >
        <Star className={['w-4 h-4', game.featured ? 'fill-current' : ''].join(' ')} />
      </button>

      <span className="hidden lg:block text-xs text-text-muted tabular-nums w-14 text-right shrink-0">{game.playCount} lượt</span>

      <div className="flex items-center gap-1 shrink-0">
        <a href={`/games/${game.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06]" aria-label="Xem trang công khai">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <Link href={`/admin/games/${game.id}/edit`} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06]" aria-label="Sửa">
          <Pencil className="w-3.5 h-3.5" />
        </Link>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10" aria-label="Xoá">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </li>
  );
}

// ─── Widgets ───────────────────────────────────────────────────────

function Stat({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent: string }) {
  return (
    <div className="rounded-xl bg-darkcard/60 border border-darkborder p-4">
      <p className="text-[11px] text-text-muted uppercase tracking-wider">{label}</p>
      <p className={['mt-1 text-2xl font-heading font-bold tabular-nums', accent].join(' ')}>{value}</p>
      {sub && <p className="text-[11px] text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

/** 14-day plays histogram — inline SVG, no chart dependency. */
function PlaysChart({ daily }: { daily: { date: string; plays: number }[] }) {
  const max = useMemo(() => Math.max(1, ...daily.map((d) => d.plays)), [daily]);
  if (daily.length === 0) return null;
  const W = 100, H = 28, gap = 1.2;
  const bw = (W - gap * (daily.length - 1)) / daily.length;

  return (
    <div className="rounded-xl bg-darkcard/60 border border-darkborder p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[11px] text-text-muted uppercase tracking-wider">Lượt chơi 14 ngày qua</p>
        <p className="text-[11px] text-text-muted">cao nhất {max}/ngày</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none" role="img" aria-label={`Biểu đồ lượt chơi 14 ngày, cao nhất ${max} lượt/ngày`}>
        {daily.map((d, i) => {
          const h = (d.plays / max) * H;
          return (
            <rect
              key={d.date}
              x={i * (bw + gap)}
              y={H - h}
              width={bw}
              height={Math.max(h, d.plays > 0 ? 0.8 : 0.4)}
              rx={0.6}
              className={d.plays > 0 ? 'fill-neon-violet' : 'fill-white/10'}
            >
              <title>{`${d.date}: ${d.plays} lượt`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="flex justify-between mt-1 text-[10px] text-text-muted">
        <span>{daily[0]?.date.slice(5)}</span>
        <span>{daily[daily.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}

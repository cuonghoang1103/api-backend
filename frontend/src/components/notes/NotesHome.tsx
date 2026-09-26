'use client';

/**
 * Trang chủ Sổ tay — thứ hiện ra khi CHƯA mở trang nào.
 *
 * Trước đây chỗ này là một câu "Chọn một ghi chú để bắt đầu" giữa khoảng trống
 * (người dùng gửi ảnh). Nay là bàn làm việc: nút nhanh (Ghi nhanh · Trang mới ·
 * Tìm), ba khối Gần đây · Đã ghim · 📥 Hộp thư, và một mục "Nâng cao" gọn gom
 * các tính năng sâu (đồ thị, bảng dữ liệu, dòng thời gian, thẻ ôn tập, bộ lọc)
 * — KHÔNG xoá tính năng nào, chỉ đưa ra khỏi tầm mắt mặc định.
 */
import { useMemo, useState, type ReactNode } from 'react';
import {
  Zap, FilePlus2, Search, Clock, Pin, PinOff, Inbox, FolderInput, ChevronRight,
  Network, Table2, GanttChart, GraduationCap, Star, AlertCircle, Archive, Trash2, Sparkles,
} from 'lucide-react';
import type { NoteRecent, NoteSubjectTree, NoteSummary, NoteChapterTree } from '@/types';
import NoteMovePicker from './NoteMovePicker';
import { isInboxSubject, relTime, subjectCrumb } from './notesText';
import type { NoteSidebarFilter } from './NotesSidebar';

const UNTITLED = 'Không có tiêu đề';

export default function NotesHome({
  tree, recent, onSelectNote, onOpenSubject, onReveal, onQuickCapture, onNewPage, onSearch,
  onPinSubject, onPinChapter, onPinNote, onMoveNote, onChangeFilter,
}: {
  tree: NoteSubjectTree[];
  recent: NoteRecent[];
  onSelectNote: (id: number) => void;
  onOpenSubject: (id: number) => void;
  onReveal: (subjectId: number, chapterId: number | null) => void;
  onQuickCapture: () => void;
  onNewPage: () => void;
  onSearch: () => void;
  onPinSubject: (id: number, pinned: boolean) => void;
  onPinChapter: (id: number, pinned: boolean) => void;
  onPinNote: (id: number, pinned: boolean) => void;
  onMoveNote: (noteId: number, subjectId: number, chapterId: number | null) => Promise<void> | void;
  onChangeFilter: (f: NoteSidebarFilter) => void;
}) {
  const [moving, setMoving] = useState<{ id: number; title: string; subjectId: number; chapterId: number | null } | null>(null);
  const [showAllInbox, setShowAllInbox] = useState(false);

  const inbox = useMemo(() => tree.find((s) => isInboxSubject(s)) ?? null, [tree]);
  const inboxNotes = useMemo(() => {
    if (!inbox) return [] as { n: NoteSummary; chapterId: number | null }[];
    return [
      ...inbox.notes.map((n) => ({ n, chapterId: null as number | null })),
      ...inbox.chapters.flatMap((c) => c.notes.map((n) => ({ n, chapterId: c.id as number | null }))),
    ].sort((a, b) => new Date(b.n.updatedAt).getTime() - new Date(a.n.updatedAt).getTime());
  }, [inbox]);

  const crumbOf = useMemo(() => {
    const m = new Map<number, string>();
    tree.forEach((s) => {
      const sn = subjectCrumb(s);
      s.notes.forEach((n) => m.set(n.id, sn));
      s.chapters.forEach((c) => c.notes.forEach((n) => m.set(n.id, `${sn} › ${c.title}`)));
    });
    return m;
  }, [tree]);

  const pinned = useMemo(() => {
    const out: { key: string; label: string; sub: string; icon: string; open: () => void; unpin: () => void }[] = [];
    tree.forEach((s) => {
      if (s.isPinned && !isInboxSubject(s)) out.push({ key: `s${s.id}`, label: s.name, sub: 'Môn', icon: s.emoji || '📚', open: () => onReveal(s.id, null), unpin: () => onPinSubject(s.id, false) });
      s.chapters.forEach((c: NoteChapterTree) => {
        if (c.isPinned) out.push({ key: `c${c.id}`, label: c.title, sub: s.name, icon: '📂', open: () => onReveal(s.id, c.id), unpin: () => onPinChapter(c.id, false) });
      });
    });
    tree.forEach((s) => {
      const all = [...s.notes, ...s.chapters.flatMap((c) => c.notes)];
      all.forEach((n) => {
        if (n.isPinned) out.push({ key: `n${n.id}`, label: n.title || UNTITLED, sub: crumbOf.get(n.id) ?? '', icon: '📄', open: () => onSelectNote(n.id), unpin: () => onPinNote(n.id, false) });
      });
    });
    return out;
  }, [tree, crumbOf, onReveal, onPinSubject, onPinChapter, onPinNote, onSelectNote]);

  const subjectCount = tree.filter((s) => !isInboxSubject(s)).length;
  const pageCount = tree.reduce((a, s) => a + s.notes.length + s.chapters.reduce((b, c) => b + c.notes.length, 0), 0);
  const shownInbox = showAllInbox ? inboxNotes : inboxNotes.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
      <header className="mb-6">
        <h1 className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[30px]">Sổ tay</h1>
        <p className="mt-1 text-[13.5px] text-slate-500 dark:text-slate-400">
          {subjectCount} môn · {pageCount} trang{inboxNotes.length > 0 ? ` · ${inboxNotes.length} ghi chú chờ sắp xếp` : ''}
        </p>
      </header>

      {/* Nút nhanh */}
      <div className="mb-8 grid grid-cols-3 gap-2">
        <QuickAction icon={<Zap className="h-4 w-4" />} tone="amber" label="Ghi nhanh" hint="vào Hộp thư, sắp xếp sau" onClick={onQuickCapture} />
        <QuickAction icon={<FilePlus2 className="h-4 w-4" />} tone="teal" label="Trang mới" hint="chọn môn rồi đặt tên" onClick={onNewPage} />
        <QuickAction icon={<Search className="h-4 w-4" />} tone="slate" label="Tìm" hint="⌘K · Ctrl+K" onClick={onSearch} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Gần đây */}
        <Card icon={<Clock className="h-3.5 w-3.5" />} title="Gần đây">
          {recent.length === 0 ? (
            <Empty>Chưa có trang nào. Bấm “Trang mới” để bắt đầu.</Empty>
          ) : recent.slice(0, 7).map((r) => (
            <ListRow key={r.id} icon="📄" label={r.title || UNTITLED} sub={crumbOf.get(r.id) ?? ''} meta={relTime(r.updatedAt)} onClick={() => onSelectNote(r.id)} />
          ))}
        </Card>

        {/* Đã ghim */}
        <Card icon={<Pin className="h-3.5 w-3.5 text-amber-500" />} title="Đã ghim" count={pinned.length}>
          {pinned.length === 0 ? (
            <Empty>Ghim môn, chương hay trang hay dùng qua menu ⋯ trong cây.</Empty>
          ) : pinned.map((p) => (
            <ListRow
              key={p.key}
              icon={p.icon}
              label={p.label}
              sub={p.sub}
              onClick={p.open}
              action={(
                <button
                  type="button"
                  onClick={p.unpin}
                  title="Bỏ ghim"
                  aria-label={`Bỏ ghim ${p.label}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-amber-600 opacity-0 hover:bg-amber-500/15 focus-visible:opacity-100 group-hover:opacity-100 dark:text-amber-400 [@media(hover:none)]:opacity-100"
                >
                  <PinOff className="h-3.5 w-3.5" />
                </button>
              )}
            />
          ))}
        </Card>

        {/* Hộp thư */}
        <Card
          icon={<Inbox className="h-3.5 w-3.5 text-sky-500" />}
          title="Hộp thư"
          count={inboxNotes.length}
          countTone={inboxNotes.length > 0 ? 'sky' : undefined}
          headerAction={inbox ? (
            <button type="button" onClick={() => onReveal(inbox.id, null)} className="text-[11.5px] text-slate-500 hover:text-teal-700 dark:hover:text-teal-300">Xem trong cây</button>
          ) : undefined}
        >
          {inboxNotes.length === 0 ? (
            <Empty>
              {inbox ? 'Hộp thư sạch. ' : ''}Ghi nhanh một ý — nó vào đây, sắp xếp vào môn sau.
            </Empty>
          ) : (
            <>
              {shownInbox.map(({ n, chapterId }) => (
                <ListRow
                  key={n.id}
                  icon="📝"
                  label={n.title || UNTITLED}
                  sub={relTime(n.updatedAt)}
                  onClick={() => onSelectNote(n.id)}
                  action={(
                    <button
                      type="button"
                      onClick={() => setMoving({ id: n.id, title: n.title, subjectId: inbox!.id, chapterId })}
                      className="flex h-7 shrink-0 items-center gap-1 rounded-md border border-black/[0.08] px-2 text-[11.5px] font-medium text-slate-700 hover:border-teal-500/50 hover:text-teal-700 dark:border-white/[0.1] dark:text-slate-300 dark:hover:text-teal-300"
                    >
                      <FolderInput className="h-3.5 w-3.5" /> Sắp xếp
                    </button>
                  )}
                />
              ))}
              {inboxNotes.length > 5 && (
                <button type="button" onClick={() => setShowAllInbox((v) => !v)} className="mt-1 w-full rounded-md py-1.5 text-[12px] text-slate-500 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                  {showAllInbox ? 'Thu gọn' : `Xem cả ${inboxNotes.length} ghi chú`}
                </button>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Nâng cao — gom gọn, không xoá */}
      <details className="group mt-8 rounded-xl border border-black/[0.07] dark:border-white/[0.07]">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[13px] font-medium text-slate-700 dark:text-slate-300 [&::-webkit-details-marker]:hidden">
          <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
          <Sparkles className="h-4 w-4 text-violet-500" /> Nâng cao
          <span className="ml-1 text-[12px] font-normal text-slate-400">đồ thị · bảng dữ liệu · dòng thời gian · thẻ ôn tập · bộ lọc</span>
        </summary>
        <div className="grid grid-cols-1 gap-2 border-t border-black/[0.06] p-3 dark:border-white/[0.06] sm:grid-cols-2">
          <AdvItem icon={<Network className="h-4 w-4" />} title="Đồ thị liên kết" desc="Xem các trang nối với nhau thế nào" href="/notes/graph" />
          <AdvItem icon={<Table2 className="h-4 w-4" />} title="Bảng dữ liệu & việc của tôi" desc="Mở một môn (⋯ › Mở trang môn) để tạo bảng, xem việc được giao" onClick={() => { const s = tree.find((x) => !isInboxSubject(x)); if (s) onOpenSubject(s.id); }} />
          <AdvItem icon={<GanttChart className="h-4 w-4" />} title="Dòng thời gian" desc="Một khung nhìn của bảng dữ liệu — mở bảng rồi chọn Dòng thời gian" onClick={() => { const s = tree.find((x) => !isInboxSubject(x)); if (s) onOpenSubject(s.id); }} />
          <AdvItem icon={<GraduationCap className="h-4 w-4" />} title="Thẻ ôn tập (flashcard)" desc="Trong một trang: Tệp & liên kết › Từ vựng › Ôn tập" />
          <AdvItem icon={<Star className="h-4 w-4" />} title="Yêu thích" desc="Danh sách các trang đã đánh dấu sao" onClick={() => onChangeFilter('favorites')} />
          <AdvItem icon={<AlertCircle className="h-4 w-4" />} title="Cần ôn" desc="Trang được đánh dấu cần ôn lại" onClick={() => onChangeFilter('needs-review')} />
          <AdvItem icon={<Archive className="h-4 w-4" />} title="Lưu trữ" desc="Trang đã cất đi, không hiện trong cây" onClick={() => onChangeFilter('archive')} />
          <AdvItem icon={<Trash2 className="h-4 w-4" />} title="Thùng rác" desc="Khôi phục trong 30 ngày" onClick={() => onChangeFilter('trash')} />
        </div>
      </details>

      {moving && (
        <NoteMovePicker
          tree={tree}
          noteTitle={moving.title}
          current={{ subjectId: moving.subjectId, chapterId: moving.chapterId }}
          onClose={() => setMoving(null)}
          onPick={async (subjectId, chapterId) => { const m = moving; setMoving(null); await onMoveNote(m.id, subjectId, chapterId); }}
        />
      )}
    </div>
  );
}

function QuickAction({ icon, label, hint, tone, onClick }: { icon: ReactNode; label: string; hint: string; tone: 'amber' | 'teal' | 'slate'; onClick: () => void }) {
  const toneCls = tone === 'amber'
    ? 'bg-amber-500/[0.12] text-amber-700 dark:text-amber-300'
    : tone === 'teal' ? 'bg-teal-500/[0.12] text-teal-700 dark:text-teal-300' : 'bg-black/[0.05] text-slate-700 dark:bg-white/[0.07] dark:text-slate-300';
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[56px] flex-col items-center gap-1.5 rounded-xl border border-black/[0.07] px-2 py-2.5 text-center transition-colors sm:flex-row sm:gap-3 sm:px-3.5 sm:text-left hover:border-black/[0.14] hover:bg-black/[0.02] dark:border-white/[0.08] dark:hover:border-white/[0.16] dark:hover:bg-white/[0.03]"
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneCls}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">{label}</span>
        <span className="hidden truncate text-[11.5px] text-slate-500 sm:block">{hint}</span>
      </span>
    </button>
  );
}

function Card({ icon, title, count, countTone, headerAction, children }: { icon: ReactNode; title: string; count?: number; countTone?: 'sky'; headerAction?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col rounded-xl border border-black/[0.07] p-2 dark:border-white/[0.07]">
      <div className="flex items-center gap-1.5 px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {icon}<span>{title}</span>
        {typeof count === 'number' && count > 0 && (
          <span className={`rounded-full px-1.5 text-[10.5px] tabular-nums ${countTone === 'sky' ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300' : 'bg-black/[0.05] dark:bg-white/[0.07]'}`}>{count}</span>
        )}
        {headerAction && <span className="ml-auto normal-case tracking-normal">{headerAction}</span>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function ListRow({ icon, label, sub, meta, onClick, action }: { icon: string; label: string; sub?: string; meta?: string; onClick: () => void; action?: ReactNode }) {
  return (
    <div className="group flex min-h-[40px] items-center gap-1 rounded-lg pr-1 hover:bg-black/[0.035] dark:hover:bg-white/[0.04]">
      <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-1.5 text-left">
        <span className="w-5 shrink-0 text-center text-[13px] leading-none">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-slate-800 dark:text-slate-200">{label}</span>
          {sub && <span className="block truncate text-[11px] text-slate-500">{sub}</span>}
        </span>
        {meta && <span className="shrink-0 text-[11px] text-slate-400">{meta}</span>}
      </button>
      {action}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="px-2 py-5 text-[12.5px] leading-relaxed text-slate-500">{children}</p>;
}

function AdvItem({ icon, title, desc, href, onClick }: { icon: ReactNode; title: string; desc: string; href?: string; onClick?: () => void }) {
  const inner = (
    <>
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black/[0.04] text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-slate-800 dark:text-slate-200">{title}</span>
        <span className="block text-[11.5px] leading-snug text-slate-500">{desc}</span>
      </span>
    </>
  );
  const cls = 'flex items-start gap-2.5 rounded-lg p-2 text-left hover:bg-black/[0.035] dark:hover:bg-white/[0.04]';
  if (href) return <a href={href} className={cls}>{inner}</a>;
  if (onClick) return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
  return <div className={cls}>{inner}</div>;
}

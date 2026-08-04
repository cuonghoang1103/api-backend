'use client';

// SlashMenu — gõ "/" để chèn khối (kiểu Notion).
//
// v2 (2026-08-04) — bốn nâng cấp so với bản đầu:
//
// 1. ĐẶT CHỖ THÔNG MINH. Bản cũ luôn treo bảng ở `caret.bottom + 4`,
//    nên gõ "/" ở cuối trang thì bảng đổ xuống dưới đáy khung nhìn và
//    bị cắt mất (user báo đúng lỗi này). Giờ bảng tự ĐO chiều cao thật
//    rồi chọn phía: đủ chỗ dưới → dưới, không đủ mà trên rộng hơn →
//    LẬT LÊN TRÊN, chật cả hai → bám mép và tự thu maxHeight. Cũng
//    kẹp theo chiều ngang và chừa `--app-chrome-bottom` (thanh điều
//    hướng dưới trên mobile).
//
// 2. KÉO ĐƯỢC. Thanh tiêu đề là tay cầm: kéo bảng tới bất cứ đâu.
//    Nhấp đúp tay cầm để trả về vị trí tự động. Mỗi lần mở mới lại
//    bám con trỏ (không "kẹt" ở chỗ đã kéo phiên trước).
//
// 3. LỌC KHI GÕ. Bản cũ có state `query` nhưng KHÔNG có đường nào cập
//    nhật nó — bộ lọc là code chết. Giờ NoteEditor bơm phần chữ sau
//    "/" vào mỗi nhịp gõ; so khớp bỏ dấu tiếng Việt ("tieu de" khớp
//    "Tiêu đề").
//
// 4. XOÁ "/" KHI CHỌN. Bản cũ chỉ chạy lệnh, ký tự "/" (và cả chuỗi
//    lọc) nằm lại trong dòng — chọn Heading 1 ra "# /". Giờ mỗi item
//    nhận `range` và `deleteRange` trước khi chèn khối.
//
// Bàn phím bắt ở pha CAPTURE: ProseMirror xử lý keydown ngay trên DOM
// của editor, nếu nghe ở pha bubble thì Enter đã kịp xuống dòng và
// mũi tên đã kịp dời con trỏ trước khi tới đây.

import {
  useCallback, useEffect, useImperativeHandle, useLayoutEffect,
  useMemo, useRef, useState, forwardRef,
} from 'react';
import type { Editor } from '@tiptap/react';
import {
  Heading1, Heading2, Heading3, List, ListOrdered, ListChecks, Code2,
  Lightbulb, StickyNote, TriangleAlert, Sigma, SquareRadical, Minus,
  Table2, Quote, ImagePlus, GripHorizontal, Search,
  type LucideIcon,
} from 'lucide-react';

/** Vùng văn bản của trigger: từ ký tự "/" tới con trỏ. */
export interface SlashRange { from: number; to: number }

export interface SlashMenuRef {
  /**
   * Mở (hoặc cập nhật) bảng. Gọi mỗi nhịp gõ khi trigger còn hiệu lực:
   * lần đầu sẽ neo vị trí + reset, các lần sau chỉ đổi `query`/`range`
   * để bảng không nhảy chỗ và không mất mục đang chọn.
   */
  open: (rect: DOMRect, query: string, range: SlashRange) => void;
  close: () => void;
  isOpen: () => boolean;
}

interface Props {
  editor: Editor | null;
  /** Mở hộp thoại chọn ảnh của NoteEditor (đã có sẵn luồng upload R2). */
  onPickImage?: () => void;
  /**
   * Người dùng bấm Esc để bỏ qua. NoteEditor ghi nhớ vị trí "/" này và
   * không mở lại bảng cho tới khi rời khỏi nó — nếu không, gõ thêm một
   * ký tự là trigger lại đúng và bảng bật lên ngay, Esc thành vô nghĩa.
   */
  onDismiss?: (range: SlashRange) => void;
}

type Group = 'Cơ bản' | 'Danh sách' | 'Khối nội dung' | 'Nâng cao';

interface Item {
  label: string;
  hint: string;
  icon: LucideIcon;
  group: Group;
  keywords?: string[];
  /** `range` phủ cả "/" lẫn chuỗi lọc — xoá trước rồi mới chèn khối. */
  run: (editor: Editor, range: SlashRange) => void;
}

const GROUP_ORDER: Group[] = ['Cơ bản', 'Danh sách', 'Khối nội dung', 'Nâng cao'];

/** Bỏ dấu tiếng Việt để "tieu de" khớp "Tiêu đề". */
function deaccent(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function buildItems(onPickImage?: () => void): Item[] {
  // Editor được nới sang `any` để gọi được các lệnh của extension nhà
  // trồng (setCallout, …) mà không vướng kiểu hẹp ChainedCommands.
  const chain = (ed: Editor) => (ed as unknown as { chain: () => any }).chain();
  // Mọi item đều bắt đầu bằng focus + deleteRange: xoá dấu "/" và chuỗi
  // lọc, rồi mới đổi/chèn khối tại đúng chỗ con trỏ.
  const at = (ed: Editor, range: SlashRange) => chain(ed).focus().deleteRange(range);

  return [
    {
      label: 'Heading 1', hint: '# Tiêu đề lớn', icon: Heading1, group: 'Cơ bản',
      keywords: ['h1', 'tieu de', 'heading', 'tieu de lon'],
      run: (ed, r) => at(ed, r).toggleHeading({ level: 1 }).run(),
    },
    {
      label: 'Heading 2', hint: '## Tiêu đề vừa', icon: Heading2, group: 'Cơ bản',
      keywords: ['h2', 'tieu de vua', 'heading'],
      run: (ed, r) => at(ed, r).toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Heading 3', hint: '### Tiêu đề nhỏ', icon: Heading3, group: 'Cơ bản',
      keywords: ['h3', 'tieu de nho', 'heading'],
      run: (ed, r) => at(ed, r).toggleHeading({ level: 3 }).run(),
    },
    {
      label: 'Quote', hint: '“trích dẫn”', icon: Quote, group: 'Cơ bản',
      keywords: ['quote', 'blockquote', 'trich dan'],
      run: (ed, r) => at(ed, r).toggleBlockquote().run(),
    },
    {
      label: 'Horizontal rule', hint: '— đường kẻ ngang —', icon: Minus, group: 'Cơ bản',
      keywords: ['hr', 'rule', 'duong ke', 'divider'],
      run: (ed, r) => at(ed, r).setHorizontalRule().run(),
    },

    {
      label: 'Bulleted list', hint: '• Danh sách', icon: List, group: 'Danh sách',
      keywords: ['ul', 'bullet', 'list', 'danh sach'],
      run: (ed, r) => at(ed, r).toggleBulletList().run(),
    },
    {
      label: 'Numbered list', hint: '1. Danh sách có số', icon: ListOrdered, group: 'Danh sách',
      keywords: ['ol', 'number', 'numbered', 'list', 'danh sach co so'],
      run: (ed, r) => at(ed, r).toggleOrderedList().run(),
    },
    {
      label: 'Checklist', hint: '☑ Việc cần làm', icon: ListChecks, group: 'Danh sách',
      keywords: ['todo', 'task', 'check', 'checklist', 'viec can lam'],
      run: (ed, r) => at(ed, r).toggleTaskList().run(),
    },

    {
      label: 'Code block', hint: '``` ngôn ngữ', icon: Code2, group: 'Khối nội dung',
      keywords: ['code', 'snippet', 'ma nguon'],
      run: (ed, r) => at(ed, r).toggleCodeBlock().run(),
    },
    {
      label: 'Table 3×3', hint: 'Bảng', icon: Table2, group: 'Khối nội dung',
      keywords: ['table', 'bang'],
      run: (ed, r) => at(ed, r).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    ...(onPickImage ? [{
      label: 'Ảnh', hint: 'Tải ảnh lên', icon: ImagePlus, group: 'Khối nội dung' as Group,
      keywords: ['image', 'anh', 'hinh', 'photo', 'upload'],
      // Xoá "/" trước rồi mới mở hộp chọn tệp — nếu để ngược, lúc file
      // dialog đóng con trỏ đã dời và range cũ không còn đúng.
      run: (ed: Editor, r: SlashRange) => { at(ed, r).run(); onPickImage(); },
    }] : []),

    {
      label: 'Callout — Mẹo', hint: 'Mẹo hữu ích', icon: Lightbulb, group: 'Khối nội dung',
      keywords: ['callout', 'tip', 'meo'],
      run: (ed, r) => at(ed, r).toggleCallout({ kind: 'tip' }).run(),
    },
    {
      label: 'Callout — Ghi chú', hint: 'Ghi chú phụ', icon: StickyNote, group: 'Khối nội dung',
      keywords: ['callout', 'note', 'ghi chu'],
      run: (ed, r) => at(ed, r).toggleCallout({ kind: 'note' }).run(),
    },
    {
      label: 'Callout — Cảnh báo', hint: 'Cảnh báo / chú ý', icon: TriangleAlert, group: 'Khối nội dung',
      keywords: ['callout', 'warning', 'canh bao', 'chu y'],
      run: (ed, r) => at(ed, r).toggleCallout({ kind: 'warning' }).run(),
    },

    {
      label: 'Math (inline)', hint: '$E = mc^2$', icon: Sigma, group: 'Nâng cao',
      keywords: ['math', 'katex', 'latex', 'cong thuc'],
      run: (ed, r) => at(ed, r)
        .insertContent({ type: 'math', attrs: { mode: 'inline' }, content: [{ type: 'text', text: 'E = mc^2' }] })
        .run(),
    },
    {
      label: 'Math (block)', hint: '$$\\sum_{i=0}^n i$$', icon: SquareRadical, group: 'Nâng cao',
      keywords: ['math', 'katex', 'block', 'latex', 'cong thuc'],
      run: (ed, r) => at(ed, r)
        .insertContent({ type: 'math', attrs: { mode: 'block' }, content: [{ type: 'text', text: '\\sum_{i=0}^n i' }] })
        .run(),
    },
  ];
}

/**
 * Khoảng chừa ở đáy cho thanh điều hướng mobile (`--app-chrome-bottom`).
 *
 * KHÔNG đọc thẳng bằng parseFloat: getComputedStyle trả về custom
 * property Ở DẠNG CHƯA TÍNH — trên mobile biến này là chuỗi
 * "calc(58px + 0px)", parseFloat ra NaN và ta tưởng đáy trống, bảng lại
 * chui xuống dưới thanh nav. Thay vào đó dựng một ô đo tàng hình cao
 * đúng bằng biến rồi hỏi trình duyệt chiều cao thật.
 */
function bottomChrome(): number {
  if (typeof window === 'undefined') return 0;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:var(--app-chrome-bottom,0px)';
  document.body.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return Number.isFinite(h) ? h : 0;
}

interface Anchor { top: number; bottom: number; left: number }
interface Pos { top: number; left: number; maxH: number }

const MARGIN = 10;      // cách mép khung nhìn
const GAP = 8;          // cách con trỏ
const DESIRED_H = 380;  // chiều cao "thoải mái" của bảng
const MIN_H = 160;      // dưới mức này thì cuộn trong bảng

const SlashMenu = forwardRef<SlashMenuRef, Props>(({ editor, onPickImage, onDismiss }, ref) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [anchor, setAnchor] = useState<Anchor>({ top: 0, bottom: 0, left: 0 });
  const [pos, setPos] = useState<Pos>({ top: -9999, left: -9999, maxH: DESIRED_H });
  /** Vị trí do người dùng kéo tay; null = để bảng tự đặt chỗ. */
  const [dragged, setDragged] = useState<{ top: number; left: number } | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<SlashRange | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  useImperativeHandle(ref, () => ({
    open: (rect, q, range) => {
      rangeRef.current = range;
      setQuery(q);
      setAnchor({ top: rect.top, bottom: rect.bottom, left: rect.left });
      // Chỉ reset khi MỞ MỚI. Gõ tiếp mà reset thì bảng nhảy chỗ và
      // mục đang chọn bị đá về đầu danh sách sau mỗi phím.
      if (!openRef.current) {
        setActive(0);
        setDragged(null);
        setOpen(true);
      }
    },
    close: () => { setOpen(false); rangeRef.current = null; },
    isOpen: () => openRef.current,
  }), []);

  const allItems = useMemo(() => buildItems(onPickImage), [onPickImage]);

  const matches = useMemo(() => {
    const q = deaccent(query.trim());
    if (!q) return allItems;
    return allItems.filter((it) =>
      deaccent(it.label).includes(q) ||
      deaccent(it.hint).includes(q) ||
      (it.keywords ?? []).some((k) => deaccent(k).includes(q)),
    );
  }, [allItems, query]);

  // Nhóm để hiển thị. Chỉ số phẳng `idx` được đánh THEO THỨ TỰ HIỂN
  // THỊ và `items` bên dưới dựng lại từ chính các nhóm này, nên mũi
  // tên lên/xuống luôn đi đúng thứ tự mắt nhìn thấy.
  const sections = useMemo(() => {
    let idx = 0;
    return GROUP_ORDER
      .map((group) => ({
        group,
        rows: matches.filter((it) => it.group === group).map((it) => ({ it, idx: idx++ })),
      }))
      .filter((s) => s.rows.length > 0);
  }, [matches]);

  const items = useMemo(() => sections.flatMap((s) => s.rows.map((r) => r.it)), [sections]);

  // Danh sách đổi → con trỏ chọn về đầu để mũi tên luôn trỏ vào mục hợp lệ.
  useEffect(() => { setActive(0); }, [query]);

  const pick = useCallback((item: Item) => {
    const range = rangeRef.current;
    if (!editor || !range) return;
    item.run(editor, range);
    setOpen(false);
    rangeRef.current = null;
    // Trả focus về editor. Vài lệnh (insertContent, insertTable,
    // setHorizontalRule) không tự focus, và ngay cả lệnh có focus cũng
    // mất tiêu điểm khi DOM của bảng bị gỡ trong cùng một nhịp — hệ quả
    // là phím kế tiếp rơi vào body và không mở lại được "/" nữa.
    requestAnimationFrame(() => {
      try { editor.commands.focus(); } catch { /* ignore */ }
    });
  }, [editor]);

  // ─── Bám con trỏ khi trang cuộn / đổi cỡ ────────────────────
  useEffect(() => {
    if (!open || !editor) return;
    const reanchor = () => {
      const range = rangeRef.current;
      if (!range) return;
      try {
        const c = editor.view.coordsAtPos(range.from);
        setAnchor((prev) => (prev.top === c.top && prev.left === c.left && prev.bottom === c.bottom
          ? prev : { top: c.top, bottom: c.bottom, left: c.left }));
      } catch { /* vị trí không còn trong doc */ }
    };
    // capture: bắt cả cuộn của khung <main> bên trong, không chỉ window.
    window.addEventListener('scroll', reanchor, true);
    window.addEventListener('resize', reanchor);
    return () => {
      window.removeEventListener('scroll', reanchor, true);
      window.removeEventListener('resize', reanchor);
    };
  }, [open, editor]);

  // ─── Đặt chỗ: lật lên / kẹp mép / thu chiều cao ──────────────
  // Chạy ở layout effect để trình duyệt không kịp vẽ khung ở chỗ sai.
  useLayoutEffect(() => {
    if (!open || dragged) return;
    const el = boxRef.current;
    if (!el) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const floor = vh - MARGIN - bottomChrome();  // đáy dùng được
    // scrollHeight = chiều cao nội dung THẬT (không bị maxHeight cắt),
    // nên quyết định lật/không lật không phụ thuộc lần đo trước.
    const natural = Math.min(DESIRED_H, el.scrollHeight);

    const belowTop = anchor.bottom + GAP;
    const spaceBelow = floor - belowTop;
    const spaceAbove = anchor.top - GAP - MARGIN;

    let top: number;
    let maxH: number;
    if (spaceBelow >= natural) {
      top = belowTop; maxH = natural;                       // đủ chỗ dưới
    } else if (spaceAbove >= natural) {
      top = anchor.top - GAP - natural; maxH = natural;     // lật lên trên
    } else if (spaceAbove > spaceBelow) {
      maxH = Math.max(MIN_H, spaceAbove);
      top = Math.max(MARGIN, anchor.top - GAP - maxH);      // trên, thu nhỏ
    } else {
      maxH = Math.max(MIN_H, spaceBelow);
      top = Math.min(belowTop, floor - maxH);               // dưới, thu nhỏ
    }

    const w = el.offsetWidth;
    let left = anchor.left;
    if (left + w > vw - MARGIN) left = vw - MARGIN - w;
    if (left < MARGIN) left = MARGIN;

    setPos((prev) => (prev.top === top && prev.left === left && prev.maxH === maxH
      ? prev : { top, left, maxH }));
  }, [open, dragged, anchor, items.length]);

  // ─── Bàn phím (pha capture — xem ghi chú đầu tệp) ────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        if (rangeRef.current) onDismiss?.(rangeRef.current);
        setOpen(false); rangeRef.current = null;
        try { editor?.commands.focus(); } catch { /* ignore */ }
        return;
      }
      // Không còn mục nào khớp: nhường mọi phím lại cho editor và đóng
      // khi người dùng xuống dòng, để bảng không "nuốt" phím Enter.
      if (items.length === 0) {
        if (e.key === 'Enter') { setOpen(false); rangeRef.current = null; }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault(); e.stopPropagation();
        setActive((i) => (i + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); e.stopPropagation();
        setActive((i) => (i - 1 + items.length) % items.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault(); e.stopPropagation();
        const item = items[active];
        if (item) pick(item);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, items, active, editor, pick, onDismiss]);

  // Cuộn mục đang chọn vào tầm nhìn khi đi bằng mũi tên.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-slash-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  // ─── Kéo bảng bằng thanh tiêu đề ────────────────────────────
  const startDrag = useCallback((e: React.PointerEvent) => {
    // preventDefault giữ tiêu điểm ở editor: nếu để con trỏ nhảy ra
    // ngoài, `onBlur` của editor sẽ đóng bảng ngay khi vừa cầm kéo.
    e.preventDefault();
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const onMove = (ev: PointerEvent) => {
      const left = Math.min(Math.max(MARGIN, ev.clientX - dx), window.innerWidth - MARGIN - w);
      const top = Math.min(Math.max(MARGIN, ev.clientY - dy), window.innerHeight - MARGIN - h);
      setDragged({ top, left });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, []);

  if (!open || !editor) return null;

  const style: React.CSSProperties = dragged
    ? { position: 'fixed', top: dragged.top, left: dragged.left, maxHeight: pos.maxH, zIndex: 60 }
    : { position: 'fixed', top: pos.top, left: pos.left, maxHeight: pos.maxH, zIndex: 60 };

  return (
    <div
      ref={boxRef}
      role="listbox"
      aria-label="Chèn khối"
      style={style}
      className="flex w-[286px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl backdrop-blur dark:border-white/[0.08] dark:bg-slate-900/95"
    >
      {/* Tay cầm — kéo để đặt bảng ở đâu tuỳ ý, nhấp đúp để về tự động */}
      <div
        onPointerDown={startDrag}
        onDoubleClick={() => setDragged(null)}
        title="Kéo để di chuyển · Nhấp đúp để về vị trí tự động"
        className={`flex shrink-0 items-center gap-1.5 border-b px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
          dragged
            ? 'cursor-grabbing border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300'
            : 'cursor-grab border-slate-200 bg-slate-50 text-slate-500 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-500'
        }`}
      >
        <GripHorizontal className="h-3.5 w-3.5" />
        <span className="flex-1 truncate">{query ? `Lọc: ${query}` : 'Chèn khối'}</span>
        {dragged && <span className="normal-case tracking-normal text-[9px] opacity-70">đã ghim</span>}
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-3 py-6 text-center">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-600" />
            <p className="text-[12px] text-slate-500 dark:text-slate-400">Không có khối nào khớp “{query}”</p>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-600">Xoá bớt chữ, hoặc Esc để đóng</p>
          </div>
        ) : (
          sections.map((sec) => (
            <div key={sec.group}>
              <div className="px-2.5 pb-0.5 pt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-600">
                {sec.group}
              </div>
              {sec.rows.map(({ it, idx }) => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.label}
                    type="button"
                    role="option"
                    data-slash-idx={idx}
                    aria-selected={idx === active}
                    onMouseDown={(e) => { e.preventDefault(); pick(it); }}
                    onMouseEnter={() => setActive(idx)}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                      idx === active
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-100'
                        : 'text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                      idx === active
                        ? 'border-teal-500/40 bg-white/70 dark:border-teal-400/30 dark:bg-teal-500/10'
                        : 'border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.03]'
                    }`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{it.label}</span>
                    <span className="shrink-0 truncate text-[10.5px] text-slate-500 dark:text-slate-500">{it.hint}</span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-slate-200 px-2.5 py-1 text-[9.5px] text-slate-400 dark:border-white/[0.06] dark:text-slate-600">
        <span>↑↓ chọn</span><span>↵ chèn</span><span>esc đóng</span>
      </div>
    </div>
  );
});

SlashMenu.displayName = 'SlashMenu';
export default SlashMenu;

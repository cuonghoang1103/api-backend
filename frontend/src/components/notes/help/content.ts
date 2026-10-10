/**
 * Notes (Sổ tay) — nội dung Trung tâm trợ giúp (song ngữ Anh / Việt).
 *
 * Dựng theo đúng khuôn của CT Work (components/work/help/content.ts): dữ liệu
 * có cấu trúc, KHÔNG phải markdown — mỗi bài có id, nhóm, tiêu đề hai thứ tiếng,
 * từ khoá tìm kiếm (có cả bản không dấu), danh sách khối (đoạn, bước, mẹo, cảnh
 * báo, bảng, phím tắt, mã) và bài liên quan.
 *
 * Mọi nhãn nút ghi ĐÚNG như trên giao diện (đọc từ mã thật: NotesSidebar.tsx,
 * SlashMenu.tsx, NotesCommandPalette.tsx, NoteAiMenu.tsx, NoteDatabaseToolbar.tsx,
 * noteAiAssist.service.ts, noteAssistant.service.ts, noteDatabaseFormula.ts,
 * noteDatabaseRollup.ts, notesDatabase.service.ts). Đổi hành vi ở mã thì sửa
 * bài tương ứng ở đây.
 *
 * Định dạng trong chuỗi: **đậm** · {{mã}} · [[phím]].
 * Tiếng Anh dùng dấu ’ thay cho ' để chuỗi bọc nháy đơn không phải thoát.
 */

export type HelpLang = 'en' | 'vi';
export type LText = { en: string; vi: string };
type Pair = [string, string];

export type HelpBlock =
  | { t: 'p'; text: LText }
  | { t: 'h'; text: LText }
  | { t: 'steps'; items: LText[] }
  | { t: 'list'; items: LText[] }
  | { t: 'tip'; text: LText }
  | { t: 'warn'; text: LText }
  | { t: 'table'; head: LText[]; rows: LText[][] }
  | { t: 'kbd'; items: Array<{ keys: string[]; label: LText }> }
  | { t: 'code'; text: string };

/** Nút "Open this page". Notes chỉ có một route (/notes) nên chỉ dùng scope global. */
export interface HelpPageLink { scope: 'global'; path: string; label: LText }

export type HelpCategory = 'start' | 'write' | 'db' | 'organize' | 'ai' | 'share';

export interface HelpArticle {
  id: string;
  category: HelpCategory;
  title: LText;
  summary: LText;
  keywords: string[];
  blocks: HelpBlock[];
  related: string[];
  pages?: HelpPageLink[];
}

export const HELP_CATEGORIES: Array<{ id: HelpCategory; label: LText }> = [
  { id: 'start', label: { en: 'Getting started', vi: 'Bắt đầu' } },
  { id: 'write', label: { en: 'Writing & blocks', vi: 'Soạn thảo & khối' } },
  { id: 'db', label: { en: 'Databases', vi: 'Bảng dữ liệu' } },
  { id: 'organize', label: { en: 'Organize & find', vi: 'Sắp xếp & tìm' } },
  { id: 'ai', label: { en: 'AI in Notes', vi: 'AI trong Sổ tay' } },
  { id: 'share', label: { en: 'Share & export', vi: 'Chia sẻ & xuất' } },
];

// ─── Hàm dựng khối (cho gọn) ─────────────────────────────────────

const L = ([en, vi]: Pair): LText => ({ en, vi });
const p = (en: string, vi: string): HelpBlock => ({ t: 'p', text: { en, vi } });
const h = (en: string, vi: string): HelpBlock => ({ t: 'h', text: { en, vi } });
const tip = (en: string, vi: string): HelpBlock => ({ t: 'tip', text: { en, vi } });
const warn = (en: string, vi: string): HelpBlock => ({ t: 'warn', text: { en, vi } });
const steps = (...items: Pair[]): HelpBlock => ({ t: 'steps', items: items.map(L) });
const list = (...items: Pair[]): HelpBlock => ({ t: 'list', items: items.map(L) });
const code = (text: string): HelpBlock => ({ t: 'code', text });
/** Ô bảng: chuỗi đơn = giống nhau ở hai thứ tiếng; cặp = [en, vi]. */
type Cell = string | Pair;
const cell = (c: Cell): LText => (typeof c === 'string' ? { en: c, vi: c } : L(c));
const table = (head: Cell[], rows: Cell[][]): HelpBlock => ({ t: 'table', head: head.map(cell), rows: rows.map((r) => r.map(cell)) });
const kbd = (...items: Array<[string[], string, string]>): HelpBlock => ({ t: 'kbd', items: items.map(([keys, en, vi]) => ({ keys, label: { en, vi } })) });
const page = (scope: HelpPageLink['scope'], path: string, en: string, vi: string): HelpPageLink => ({ scope, path, label: { en, vi } });

/** Mọi bài đều trỏ về /notes (Notes không có route theo từng trang). */
const NOTES_PAGE: HelpPageLink[] = [page('global', '/notes', 'Open Notes', 'Mở Sổ tay')];

const YES = '✓';
const NO = '—';

// ─── Bài viết ────────────────────────────────────────────────────

export const HELP_ARTICLES: HelpArticle[] = [
  // ═══ BẮT ĐẦU ═══
  {
    id: 'getting-started',
    category: 'start',
    title: { en: 'What Notes is & your first page', vi: 'Sổ tay là gì & trang đầu tiên' },
    summary: {
      en: 'A Notion-style notebook: subjects hold chapters, chapters hold pages, and every page is a rich editor. Make your first page in a minute.',
      vi: 'Một sổ tay kiểu Notion: môn chứa chương, chương chứa trang, mỗi trang là một trình soạn thảo đầy đủ. Tạo trang đầu tiên trong một phút.',
    },
    keywords: ['start', 'begin', 'intro', 'notion', 'notebook', 'bat dau', 'gioi thieu', 'so tay', 'trang moi', 'mon', 'chuong', 'page', 'subject', 'chapter'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Notes (**Sổ tay**) is your personal, Notion-style notebook. Content is organised in a tree: a **subject** (môn) holds **chapters** (chương), a chapter holds **pages** (trang). Each page is a full editor where you type, drop images, build tables, databases and more. Everything auto-saves.',
        'Notes (**Sổ tay**) là sổ ghi chú cá nhân kiểu Notion. Nội dung xếp theo cây: một **môn** chứa các **chương**, mỗi chương chứa các **trang**. Mỗi trang là một trình soạn thảo đầy đủ để bạn gõ chữ, thả ảnh, dựng bảng, bảng dữ liệu… Mọi thứ tự lưu.',
      ),
      h('Create your first page', 'Tạo trang đầu tiên'),
      steps(
        ['Open Notes (/notes). The left column is the **sidebar** with your tree.', 'Mở Sổ tay (/notes). Cột bên trái là **sidebar** chứa cây của bạn.'],
        ['Click the teal **"Mới"** (New) button at the top of the sidebar, or press [[⌘]] [[K]] and pick **"Trang mới…"** (New page).', 'Bấm nút màu teal **"Mới"** ở đầu sidebar, hoặc nhấn [[⌘]] [[K]] rồi chọn **"Trang mới…"**.'],
        ['The New menu also makes a **subject** (môn) or **chapter** (chương). If you have none yet, create a subject first — a page always lives inside a subject (or the built-in **"Hộp thư"** / Inbox 📥).', 'Menu Mới còn tạo được **môn** hoặc **chương**. Chưa có gì thì tạo môn trước — trang luôn nằm trong một môn (hoặc **"Hộp thư"** 📥 có sẵn).'],
        ['Click the page in the tree to open it. Type a title on the first line, then press [[Enter]] and start writing.', 'Bấm trang trong cây để mở. Gõ tiêu đề ở dòng đầu, nhấn [[Enter]] rồi viết tiếp.'],
      ),
      h('Find your way around', 'Làm quen giao diện'),
      list(
        ['The **"Sổ tay"** button (top-left of the sidebar) returns to the Notes home.', 'Nút **"Sổ tay"** (góc trên sidebar) đưa về trang chủ Sổ tay.'],
        ['The filter pills below the header switch what the sidebar shows: **Cây** (tree), **Yêu thích** (favourites), **Cần ôn** (needs review), **Lưu trữ** (archive), **Thùng rác** (trash).', 'Dãy nút lọc dưới header đổi nội dung sidebar: **Cây**, **Yêu thích**, **Cần ôn**, **Lưu trữ**, **Thùng rác**.'],
        ['The theme switcher (top-right of a page) cycles **Sáng / Tối / Nâu** (light / dark / brown).', 'Nút đổi giao diện (góc trên phải một trang) xoay vòng **Sáng / Tối / Nâu**.'],
        ['Deleting a page sends it to **Thùng rác** (Trash); it is removed for good after **30 days**, so you can get it back.', 'Xoá trang là đưa vào **Thùng rác**; sau **30 ngày** mới xoá hẳn, nên lấy lại được.'],
      ),
      tip(
        'Press [[?]] anywhere in Notes (when you are not typing in the editor) to open this guide. Press [[⌘]] [[K]] (Ctrl + K on Windows) to jump to any page or run a command.',
        'Nhấn [[?]] ở bất cứ đâu trong Sổ tay (khi không đang gõ trong editor) để mở hướng dẫn này. Nhấn [[⌘]] [[K]] (Ctrl + K trên Windows) để nhảy tới trang bất kỳ hoặc chạy một lệnh.',
      ),
    ],
    related: ['sidebar-tree', 'quick-open', 'editor-slash', 'quick-capture'],
  },
  {
    id: 'quick-open',
    category: 'start',
    title: { en: 'Quick open & quick capture', vi: 'Mở nhanh & ghi nhanh' },
    summary: {
      en: 'Jump to any page with the ⌘K command palette, and jot an idea without leaving what you are doing with Quick capture.',
      vi: 'Nhảy tới trang bất kỳ bằng bảng lệnh ⌘K, và ghi vội một ý mà không rời việc đang làm bằng Ghi nhanh.',
    },
    keywords: ['command palette', 'quick open', 'cmd k', 'ctrl k', 'search', 'quick capture', 'ghi nhanh', 'mo nhanh', 'bang lenh', 'tim nhanh', 'palette'],
    pages: NOTES_PAGE,
    blocks: [
      h('Command palette (⌘K)', 'Bảng lệnh (⌘K)'),
      p(
        'Press [[⌘]] [[K]] (Ctrl + K) to open the command palette. Before you type anything it shows **Gần đây** (recent pages) and **Lệnh** (commands). Start typing to search across pages, subjects, chapters and content.',
        'Nhấn [[⌘]] [[K]] (Ctrl + K) để mở bảng lệnh. Chưa gõ gì thì nó hiện **Gần đây** (trang mới mở) và **Lệnh**. Gõ vào là tìm khắp trang, môn, chương và nội dung.',
      ),
      steps(
        ['Open it with [[⌘]] [[K]] or the **Search** icon in the sidebar header (tooltip "Tìm mọi nơi").', 'Mở bằng [[⌘]] [[K]] hoặc biểu tượng **Tìm** ở header sidebar (chú thích "Tìm mọi nơi").'],
        ['Type part of a title or a word from the body. Use [[↑]] [[↓]] to move, [[Enter]] to open, [[Esc]] to close.', 'Gõ một phần tiêu đề hoặc một từ trong bài. Dùng [[↑]] [[↓]] để chọn, [[Enter]] để mở, [[Esc]] để đóng.'],
        ['Commands in the list include **"Trang mới…"** (New page) and **"Tìm nâng cao"** (Advanced search — filter by subject and tag).', 'Danh sách lệnh có **"Trang mới…"** và **"Tìm nâng cao"** (lọc theo môn và thẻ).'],
      ),
      h('Quick capture (Ghi nhanh)', 'Ghi nhanh'),
      p(
        'Quick capture is a small floating box for jotting something down fast — it drops the note into your Inbox so you can file it later. Open it from the command palette or the New menu.',
        'Ghi nhanh là ô nổi nhỏ để ghi vội một thứ — nó bỏ ghi chú vào Hộp thư để bạn sắp xếp sau. Mở từ bảng lệnh hoặc menu Mới.',
      ),
      kbd(
        [['Enter'], 'Save the quick note', 'Lưu ghi chú nhanh'],
        [['Shift', 'Enter'], 'New line without saving', 'Xuống dòng, chưa lưu'],
        [['Esc'], 'Close (your draft is kept)', 'Đóng (bản nháp vẫn giữ)'],
      ),
      p(
        'Quick capture can start from a **template**: **📝 Ghi chú bài học** (lesson note) or **🐞 Nhật ký lỗi** (error log). After saving, a toast gives you an **"Mở"** (Open) button to jump to the new page.',
        'Ghi nhanh có thể bắt đầu từ **mẫu**: **📝 Ghi chú bài học** hoặc **🐞 Nhật ký lỗi**. Lưu xong, thông báo hiện nút **"Mở"** để nhảy tới trang mới.',
      ),
      tip(
        'Searching works with or without Vietnamese accents: typing {{duong}} finds "đường". Both English and Vietnamese text are indexed.',
        'Tìm được cả khi có dấu lẫn không dấu: gõ {{duong}} vẫn ra "đường". Cả chữ tiếng Anh và tiếng Việt đều được lập chỉ mục.',
      ),
    ],
    related: ['getting-started', 'organize-find', 'quick-capture'],
  },

  // ═══ SOẠN THẢO & KHỐI ═══
  {
    id: 'editor-slash',
    category: 'write',
    title: { en: 'The editor & the slash (/) menu', vi: 'Trình soạn thảo & menu gạch chéo (/)' },
    summary: {
      en: 'Type like a document; press "/" to insert any block — headings, lists, tables, images, callouts and more.',
      vi: 'Gõ như một tài liệu; nhấn "/" để chèn mọi loại khối — tiêu đề, danh sách, bảng, ảnh, callout…',
    },
    keywords: ['editor', 'slash', 'slash menu', 'block', 'insert', 'soan thao', 'gach cheo', 'khoi', 'chen', 'tiptap', 'menu'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'A page is a stack of **blocks**. You write plain text, and at the start of an empty line press **"/"** to open the slash menu and pick a block to insert. Type a few letters to filter — it matches English and Vietnamese, no accents needed (e.g. {{bang}} → Table, {{anh}} → Image).',
        'Một trang là một chồng **khối**. Bạn gõ chữ bình thường, và ở đầu một dòng trống nhấn **"/"** để mở menu rồi chọn khối cần chèn. Gõ vài chữ để lọc — khớp cả tiếng Anh lẫn tiếng Việt, không cần dấu (vd {{bang}} → Bảng, {{anh}} → Ảnh).',
      ),
      h('Blocks you can insert', 'Các khối chèn được'),
      p('The slash menu groups blocks like this:', 'Menu gạch chéo chia nhóm như sau:'),
      table(
        [['Group', 'Nhóm'], ['Blocks', 'Khối']],
        [
          [['Cơ bản (Basic)', 'Cơ bản'], ['Heading 1 / 2 / 3, Quote, Horizontal rule (divider)', 'Heading 1 / 2 / 3, Quote (trích dẫn), Horizontal rule (đường kẻ ngang)']],
          [['Danh sách (Lists)', 'Danh sách'], ['Bulleted list, Numbered list, Checklist (to-do)', 'Bulleted list, Numbered list, Checklist (việc cần làm)']],
          [['Khối nội dung (Content)', 'Khối nội dung'], ['Code block, Table 3×3, Ảnh (Image), Toggle, Video, Tệp đính kèm (File), Bookmark, Nhúng (Embed), Callout (Mẹo / Ghi chú / Cảnh báo)', 'Code block, Table 3×3, Ảnh, Toggle (thu gọn), Video, Tệp đính kèm, Bookmark, Nhúng, Callout (Mẹo / Ghi chú / Cảnh báo)']],
          [['Nâng cao (Advanced)', 'Nâng cao'], ['Bảng dữ liệu (Database), Khối dùng chung (Synced block), Math inline, Math block', 'Bảng dữ liệu, Khối dùng chung, Math (inline), Math (block)']],
          [['Mẫu trang (Templates)', 'Mẫu trang'], ['Ghi chú bài học, Sổ lệnh, Nhật ký lỗi', 'Ghi chú bài học, Sổ lệnh, Nhật ký lỗi']],
        ],
      ),
      h('What some blocks do', 'Một vài khối đặc biệt'),
      list(
        ['**Toggle** — a collapsible block; click the triangle to show or hide what is inside. Great for answers, long lists or details.', '**Toggle** — khối thu gọn được; bấm tam giác để hiện/ẩn phần bên trong. Hợp cho đáp án, danh sách dài hay chi tiết.'],
        ['**Callout** — a coloured box for a **Mẹo** (tip), **Ghi chú** (note) or **Cảnh báo** (warning).', '**Callout** — hộp màu cho **Mẹo**, **Ghi chú** hay **Cảnh báo**.'],
        ['**Bookmark** — paste a link and it becomes a preview card with title and icon.', '**Bookmark** — dán một link, nó thành thẻ xem trước có tiêu đề và biểu tượng.'],
        ['**Nhúng (Embed)** — embed YouTube, Vimeo, Figma, Google Docs and other sites inside the page.', '**Nhúng (Embed)** — nhúng YouTube, Vimeo, Figma, Google Docs… ngay trong trang.'],
        ['**Math** — write formulas in LaTeX/KaTeX: inline {{$E = mc^2$}} or a block {{$$\\sum_{i=0}^n i$$}}.', '**Math** — viết công thức bằng LaTeX/KaTeX: nội dòng {{$E = mc^2$}} hoặc khối {{$$\\sum_{i=0}^n i$$}}.'],
        ['**Image / Video / File** — upload from your device; they are stored for you and shown inline.', '**Ảnh / Video / Tệp đính kèm** — tải lên từ máy; được lưu cho bạn và hiện ngay trong trang.'],
      ),
      tip(
        'Drag any image straight onto the page, or paste one from the clipboard — it uploads and inserts without opening the slash menu.',
        'Kéo thẳng một ảnh vào trang, hoặc dán từ clipboard — nó tự tải lên và chèn, không cần mở menu gạch chéo.',
      ),
      warn(
        'The **Bảng dữ liệu** (Database) and **Khối dùng chung** (Synced block) blocks are powerful — each has its own article (Databases, and "Synced blocks" below). Read those before relying on them.',
        'Khối **Bảng dữ liệu** và **Khối dùng chung** rất mạnh — mỗi khối có bài riêng (Bảng dữ liệu, và "Khối dùng chung" bên dưới). Đọc kỹ trước khi dùng nhiều.',
      ),
    ],
    related: ['markdown-shortcuts', 'synced-blocks', 'databases-basics', 'code-blocks'],
  },
  {
    id: 'markdown-shortcuts',
    category: 'write',
    title: { en: 'Markdown & keyboard shortcuts', vi: 'Gõ tắt Markdown & phím tắt' },
    summary: {
      en: 'Type Markdown and it turns into formatting as you go; a handful of keys cover most editing.',
      vi: 'Gõ Markdown là nó tự thành định dạng; vài phím là đủ cho hầu hết thao tác soạn thảo.',
    },
    keywords: ['markdown', 'shortcut', 'keyboard', 'phim tat', 'go tat', 'bold', 'italic', 'heading', 'dam', 'nghieng', 'list'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'The editor understands Markdown shortcuts while you type, so you rarely need the slash menu for basic formatting.',
        'Trình soạn thảo hiểu gõ tắt Markdown ngay khi bạn gõ, nên hiếm khi phải mở menu gạch chéo cho định dạng cơ bản.',
      ),
      table(
        [['Type this…', 'Gõ…'], ['…to get', '…để có']],
        [
          ['# , ## , ###', ['Heading 1, 2, 3', 'Tiêu đề 1, 2, 3']],
          ['- or *', ['A bulleted list', 'Danh sách gạch đầu dòng']],
          ['1.', ['A numbered list', 'Danh sách có số']],
          ['[] or []', ['A checklist item', 'Một mục checklist']],
          ['>', ['A quote', 'Một trích dẫn']],
          ['```', ['A code block', 'Một khối mã']],
          ['---', ['A divider (horizontal rule)', 'Một đường kẻ ngang']],
          [['**bold** , *italic* , `code`', '**đậm** , *nghiêng* , `mã`'], ['Inline bold, italic, inline code', 'In đậm, nghiêng, mã nội dòng']],
        ],
      ),
      h('Handy keys', 'Phím tiện dùng'),
      kbd(
        [['⌘', 'B'], 'Bold', 'In đậm'],
        [['⌘', 'I'], 'Italic', 'In nghiêng'],
        [['Tab'], 'Indent a list item (nest it)', 'Thụt vào một mục danh sách (lồng vào)'],
        [['Shift', 'Tab'], 'Outdent a list item', 'Bỏ thụt một mục danh sách'],
        [['/'], 'Open the slash menu to insert a block', 'Mở menu gạch chéo để chèn khối'],
        [['⌘', 'K'], 'Open the command palette / quick open', 'Mở bảng lệnh / mở nhanh'],
      ),
      tip(
        'Pressing [[Tab]] inside a list nests the item; pressing it in a code block inserts an indent instead of leaving the block.',
        'Nhấn [[Tab]] trong danh sách sẽ lồng mục vào; nhấn trong khối mã thì thêm khoảng thụt chứ không nhảy ra khỏi khối.',
      ),
    ],
    related: ['editor-slash', 'code-blocks'],
  },
  {
    id: 'code-blocks',
    category: 'write',
    title: { en: 'Code blocks & command sheets', vi: 'Khối mã & sổ lệnh' },
    summary: {
      en: 'Syntax-highlighted code with a copy button, and a "command sheet" table for terminal commands you want to remember.',
      vi: 'Mã có tô màu cú pháp kèm nút chép, và bảng "sổ lệnh" cho các lệnh terminal bạn muốn nhớ.',
    },
    keywords: ['code', 'code block', 'syntax', 'copy', 'command', 'so lenh', 'khoi ma', 'terminal', 'cheatsheet', 'highlight'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Insert a **Code block** from the slash menu (or type ```). Pick the language for syntax highlighting, and use the copy button to copy the whole block.',
        'Chèn **Code block** từ menu gạch chéo (hoặc gõ ```). Chọn ngôn ngữ để tô màu cú pháp, và dùng nút chép để sao chép cả khối.',
      ),
      h('Command sheet (Sổ lệnh)', 'Sổ lệnh'),
      p(
        'A **Sổ lệnh** is a page template that keeps terminal commands in a table with columns **Lệnh** (command) · **Nghĩa** (meaning) · **Ví dụ** (example). Insert it from the slash menu under **Mẫu trang**, or from Quick capture.',
        '**Sổ lệnh** là mẫu trang giữ các lệnh terminal trong bảng gồm cột **Lệnh** · **Nghĩa** · **Ví dụ**. Chèn từ menu gạch chéo trong nhóm **Mẫu trang**, hoặc từ Ghi nhanh.',
      ),
      tip(
        'Already wrote a paragraph full of commands? Select it and use the AI action **"Chuyển thành Sổ lệnh"** (Turn into a command sheet) — it pulls every command into the 3-column table without inventing any. See "AI in the editor".',
        'Đã viết một đoạn đầy lệnh? Bôi đen rồi dùng thao tác AI **"Chuyển thành Sổ lệnh"** — nó gom mọi lệnh vào bảng 3 cột mà không bịa thêm. Xem "AI trong trình soạn thảo".',
      ),
    ],
    related: ['editor-slash', 'ai-editor'],
  },
  {
    id: 'synced-blocks',
    category: 'write',
    title: { en: 'Synced blocks', vi: 'Khối dùng chung' },
    summary: {
      en: 'Write something once, show it on many pages — edit it anywhere and every copy updates.',
      vi: 'Viết một lần, hiện trên nhiều trang — sửa ở đâu cũng được, mọi bản cùng đổi.',
    },
    keywords: ['synced', 'synced block', 'khoi dung chung', 'dong bo', 'reuse', 'dung lai', 'lap lai', 'shared block'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'A **Khối dùng chung** (synced block) is content that lives in one place but appears on several pages. Edit it on any page and every other copy changes too — handy for a shared checklist, a disclaimer, or notes you keep across subjects.',
        '**Khối dùng chung** là nội dung nằm một chỗ nhưng hiện trên nhiều trang. Sửa ở trang nào thì mọi bản khác cùng đổi — tiện cho một checklist dùng chung, một ghi chú lặp lại giữa các môn.',
      ),
      steps(
        ['On the first page, open the slash menu and pick **"Khối dùng chung"** (under **Nâng cao**). Type the content into it.', 'Ở trang đầu, mở menu gạch chéo và chọn **"Khối dùng chung"** (trong nhóm **Nâng cao**). Gõ nội dung vào đó.'],
        ['To reuse it on another page, insert the same synced block there (copy its reference) — both now show the same content.', 'Để dùng lại ở trang khác, chèn đúng khối dùng chung đó (sao chép tham chiếu của nó) — cả hai cùng hiện một nội dung.'],
        ['Edit the text on either page; the change appears everywhere the block is shown.', 'Sửa chữ ở trang nào cũng được; thay đổi hiện ở mọi nơi khối đó xuất hiện.'],
      ),
      warn(
        'A synced block is shared **content**, not a copy. Changing it on one page really does change it on all pages — if you only want to tweak one spot, use a normal block instead.',
        'Khối dùng chung là **nội dung** chung, không phải bản sao. Sửa ở một trang là sửa mọi trang — chỉ muốn chỉnh một chỗ thì dùng khối thường.',
      ),
    ],
    related: ['editor-slash', 'databases-basics'],
  },

  // ═══ BẢNG DỮ LIỆU ═══
  {
    id: 'databases-basics',
    category: 'db',
    title: { en: 'Databases: the Notion-style part', vi: 'Bảng dữ liệu: phần kiểu Notion' },
    summary: {
      en: 'Create a database, add typed columns (properties) and rows, then view the same data as a table, board, calendar and more.',
      vi: 'Tạo một bảng dữ liệu, thêm cột có kiểu (thuộc tính) và dòng, rồi xem cùng dữ liệu đó dưới dạng bảng, board, lịch…',
    },
    keywords: ['database', 'bang du lieu', 'property', 'column', 'row', 'thuoc tinh', 'cot', 'dong', 'notion', 'table', 'db'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'A **database** is a structured table embedded in a page. Unlike a plain table, every column (a **property**) has a **type**, and you can show the same rows in different **views**. Insert one with the slash menu → **"Bảng dữ liệu"** (under **Nâng cao**).',
        '**Bảng dữ liệu** là một bảng có cấu trúc nhúng trong trang. Khác bảng thường, mỗi cột (một **thuộc tính**) có một **kiểu**, và bạn xem cùng các dòng đó dưới nhiều **khung nhìn**. Chèn bằng menu gạch chéo → **"Bảng dữ liệu"** (trong nhóm **Nâng cao**).',
      ),
      h('Property (column) types', 'Các kiểu thuộc tính (cột)'),
      p('Each column has one of these types:', 'Mỗi cột mang một trong các kiểu sau:'),
      table(
        [['Type', 'Kiểu'], ['Use it for', 'Dùng cho']],
        [
          [['Text', 'Văn bản'], ['Free text (the Title column is the row name)', 'Chữ tự do (cột Title là tên dòng)']],
          [['Number', 'Số'], ['Amounts, counts, scores', 'Số lượng, điểm']],
          [['Select / Multi-select', 'Một / Nhiều lựa chọn'], ['Tags and statuses from a fixed list', 'Thẻ, trạng thái từ danh sách cố định']],
          [['Status', 'Trạng thái'], ['A workflow state (To do / Doing / Done…)', 'Trạng thái quy trình (Cần làm / Đang làm / Xong…)']],
          [['Date', 'Ngày'], ['Deadlines and dates (drives the Calendar/Timeline)', 'Hạn và ngày (dùng cho Lịch/Timeline)']],
          [['Checkbox', 'Ô đánh dấu'], ['Yes/no, done/not done', 'Có/không, xong/chưa']],
          [['URL / Email', 'URL / Email'], ['Links and addresses (validated)', 'Liên kết và địa chỉ (có kiểm hợp lệ)']],
          [['Person', 'Người'], ['Who it belongs to', 'Thuộc về ai']],
          [['File', 'Tệp'], ['Attachments', 'Tệp đính kèm']],
          [['Created / Last edited time', 'Thời điểm tạo / sửa'], ['Filled automatically', 'Tự điền, không gõ']],
          [['Relation / Rollup / Formula', 'Quan hệ / Tổng hợp / Công thức'], ['Linked and computed columns — see their own articles', 'Cột liên kết và tính toán — xem bài riêng']],
        ],
      ),
      h('Add columns and rows', 'Thêm cột và dòng'),
      steps(
        ['Click the **"+"** at the end of the header row to add a column, then choose its **type**.', 'Bấm **"+"** ở cuối hàng tiêu đề để thêm cột, rồi chọn **kiểu** của nó.'],
        ['Add a row with the **"+"** at the bottom of the table. Click a cell to edit it; the Title cell names the row.', 'Thêm dòng bằng **"+"** ở đáy bảng. Bấm một ô để sửa; ô Title là tên dòng.'],
        ['Click a row to open it as a full page — every property becomes a field, and you can write a body below.', 'Bấm một dòng để mở nó như một trang đầy đủ — mỗi thuộc tính thành một trường, và viết thân bài bên dưới.'],
      ),
      warn(
        'Types are enforced: a Number column rejects "abc", a Select only accepts options you defined, a URL must be http(s). This is on purpose — it keeps the data clean instead of silently storing junk.',
        'Kiểu được kiểm chặt: cột Số từ chối "abc", cột Một lựa chọn chỉ nhận lựa chọn bạn đã khai, URL phải là http(s). Cố ý vậy — để dữ liệu sạch chứ không âm thầm lưu rác.',
      ),
    ],
    related: ['database-views', 'formulas', 'rollups-relations', 'database-filters'],
  },
  {
    id: 'database-views',
    category: 'db',
    title: { en: 'The 6 database views', vi: '6 khung nhìn bảng dữ liệu' },
    summary: {
      en: 'Table, Board, Calendar, Gallery, Timeline and List show the same rows in different shapes — pick the one that fits the task.',
      vi: 'Table, Board, Calendar, Gallery, Timeline và List hiện cùng dữ liệu theo nhiều hình dạng — chọn cái hợp việc.',
    },
    keywords: ['view', 'khung nhin', 'table', 'board', 'kanban', 'calendar', 'lich', 'gallery', 'timeline', 'list', 'danh sach', 'group'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'A database’s rows never change when you switch views — only how they are drawn does. An edit in one view is immediately true in every other.',
        'Các dòng của bảng không đổi khi bạn đổi khung nhìn — chỉ cách vẽ đổi. Sửa ở khung nhìn này thì khung nhìn khác cũng đúng ngay.',
      ),
      table(
        [['View', 'Khung nhìn'], ['Best for', 'Hợp nhất khi']],
        [
          [['Table', 'Bảng'], ['The full spreadsheet — see and edit every column', 'Bảng tính đầy đủ — xem và sửa mọi cột']],
          [['Board (Kanban)', 'Board (Kanban)'], ['Dragging rows between columns of a Select/Status (To do → Doing → Done)', 'Kéo dòng giữa các cột của một Select/Status (Cần làm → Đang làm → Xong)']],
          [['Calendar', 'Lịch'], ['Rows that have a Date — see them on a month grid', 'Dòng có cột Ngày — xem trên lưới tháng']],
          [['Gallery', 'Thư viện'], ['Cards with a cover — notes, references, visual items', 'Thẻ có ảnh bìa — ghi chú, tài liệu, thứ cần nhìn']],
          [['Timeline', 'Dòng thời gian'], ['Date ranges across a horizontal time axis (a simple Gantt)', 'Khoảng ngày trên trục thời gian ngang (Gantt đơn giản)']],
          [['List', 'Danh sách'], ['A dense, scannable list — many rows on one screen', 'Danh sách gọn, dễ lướt — nhiều dòng trên một màn hình']],
        ],
      ),
      p(
        'The **Board** groups by a Select/Status column; the **Calendar** and **Timeline** need a Date column. If a view looks empty, check that the database has the column it needs.',
        '**Board** nhóm theo một cột Select/Status; **Calendar** và **Timeline** cần một cột Ngày. Khung nhìn trông trống thì kiểm xem bảng đã có cột nó cần chưa.',
      ),
      tip(
        'Use the **Nhóm** (Group) control in the toolbar to group a view by a Select, Status, Checkbox, Text or Person column — Board uses the same idea to make its columns.',
        'Dùng nút **Nhóm** trên thanh công cụ để nhóm khung nhìn theo cột Một lựa chọn, Trạng thái, Ô đánh dấu, Văn bản hoặc Người — Board cũng dựa vào đó để dựng các cột.',
      ),
    ],
    related: ['databases-basics', 'database-filters'],
  },
  {
    id: 'database-filters',
    category: 'db',
    title: { en: 'Filter, sort & group rows', vi: 'Lọc, sắp xếp & nhóm dòng' },
    summary: {
      en: 'Narrow a view to the rows you care about, order them, and group them — all from the database toolbar.',
      vi: 'Thu hẹp khung nhìn còn những dòng cần, sắp thứ tự, và nhóm lại — tất cả từ thanh công cụ bảng.',
    },
    keywords: ['filter', 'sort', 'group', 'loc', 'sap xep', 'nhom', 'toolbar', 'thanh cong cu', 'search', 'condition', 'dieu kien'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Above a database is a toolbar with **Tìm** (search in the table), **Lọc** (Filter), **Sắp xếp** (Sort) and **Nhóm** (Group). The number next to Lọc/Sắp xếp shows how many rules are active.',
        'Phía trên bảng là thanh công cụ: **Tìm** (tìm trong bảng), **Lọc**, **Sắp xếp** và **Nhóm**. Con số cạnh Lọc/Sắp xếp cho biết đang có bao nhiêu quy tắc.',
      ),
      steps(
        ['Click **"Lọc"** → **add a condition**: pick a **column**, an **operator** (contains, equals, is empty…), and a **value**. Add more conditions to narrow further.', 'Bấm **"Lọc"** → **thêm điều kiện**: chọn một **cột**, một **điều kiện** (chứa, bằng, trống…) và một **giá trị**. Thêm nhiều điều kiện để thu hẹp hơn.'],
        ['Click **"Sắp xếp"** → pick a **column** and a **direction** (ascending / descending). Stack several levels to break ties.', 'Bấm **"Sắp xếp"** → chọn **cột** và **chiều** (tăng / giảm). Xếp nhiều mức để phân thứ tự khi bằng nhau.'],
        ['Click **"Nhóm"** → group the view by a column (Select, Status, Checkbox, Text or Person).', 'Bấm **"Nhóm"** → nhóm khung nhìn theo một cột (Một lựa chọn, Trạng thái, Ô đánh dấu, Văn bản hoặc Người).'],
      ),
      tip(
        'Filter, sort and group are properties of the **view**, not the data. They change what you see without deleting or reordering any actual rows.',
        'Lọc, sắp xếp và nhóm là thuộc tính của **khung nhìn**, không phải của dữ liệu. Chúng đổi thứ bạn thấy mà không xoá hay đảo dòng thật nào.',
      ),
    ],
    related: ['database-views', 'databases-basics'],
  },
  {
    id: 'formulas',
    category: 'db',
    title: { en: 'Formulas', vi: 'Công thức' },
    summary: {
      en: 'A Formula column computes a value from other columns — like a spreadsheet cell, with functions for text, numbers and dates.',
      vi: 'Cột Công thức tính một giá trị từ các cột khác — như ô bảng tính, có hàm cho chữ, số và ngày.',
    },
    keywords: ['formula', 'cong thuc', 'prop', 'if', 'calculate', 'tinh', 'function', 'ham', 'spreadsheet', 'compute'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Add a column of type **Formula** (Công thức). You refer to another column with {{prop("Column name")}} and combine it with operators and functions. The result is computed automatically for every row.',
        'Thêm cột kiểu **Công thức**. Bạn tham chiếu cột khác bằng {{prop("Tên cột")}} rồi kết hợp với toán tử và hàm. Kết quả tự tính cho mọi dòng.',
      ),
      h('Examples', 'Ví dụ'),
      code('if(prop("Trạng thái") == "Xong", "✅ Xong", "⏳ Đang xử lý")'),
      code('dateBetween(prop("Hạn"), now(), "days")'),
      code('round(prop("Đã làm") / prop("Tổng") * 100)'),
      h('What you can use', 'Dùng được gì'),
      list(
        ['**Operators:** {{+}} {{-}} {{*}} {{/}} {{%}}, comparisons {{==}} {{!=}} {{<}} {{>}} {{<=}} {{>=}}, and {{and}} / {{or}} / {{not}}.', '**Toán tử:** {{+}} {{-}} {{*}} {{/}} {{%}}, so sánh {{==}} {{!=}} {{<}} {{>}} {{<=}} {{>=}}, và {{and}} / {{or}} / {{not}}.'],
        ['**Logic & text:** {{if}}, {{empty}}, {{concat}}, {{length}}, {{upper}}, {{lower}}, {{contains}}, {{replace}}, {{slice}}.', '**Logic & chữ:** {{if}}, {{empty}}, {{concat}}, {{length}}, {{upper}}, {{lower}}, {{contains}}, {{replace}}, {{slice}}.'],
        ['**Numbers:** {{tonumber}}, {{round}}, {{floor}}, {{ceil}}, {{abs}}, {{min}}, {{max}}.', '**Số:** {{tonumber}}, {{round}}, {{floor}}, {{ceil}}, {{abs}}, {{min}}, {{max}}.'],
        ['**Dates:** {{now}}, {{today}}, {{year}}, {{month}}, {{day}}, {{dateBetween}}, {{dateAdd}}, {{formatDate}}.', '**Ngày:** {{now}}, {{today}}, {{year}}, {{month}}, {{day}}, {{dateBetween}}, {{dateAdd}}, {{formatDate}}.'],
      ),
      warn(
        'Dividing by zero gives an empty cell (not ∞), and comparing two non-numbers compares them as text ("Xong" == "Xong" is true). This keeps one bad cell from poisoning the whole column.',
        'Chia cho 0 cho ô trống (không phải ∞), và so sánh hai thứ không phải số sẽ so theo chữ ("Xong" == "Xong" là đúng). Nhờ vậy một ô sai không làm hỏng cả cột.',
      ),
    ],
    related: ['rollups-relations', 'databases-basics'],
  },
  {
    id: 'rollups-relations',
    category: 'db',
    title: { en: 'Relations & rollups', vi: 'Quan hệ & tổng hợp' },
    summary: {
      en: 'Link rows in one database to rows in another (Relation), then summarise the linked rows with a number or date (Rollup).',
      vi: 'Nối dòng của bảng này với dòng của bảng khác (Quan hệ), rồi tổng hợp các dòng đã nối thành một số hay ngày (Tổng hợp).',
    },
    keywords: ['relation', 'rollup', 'quan he', 'tong hop', 'link database', 'noi bang', 'count', 'sum', 'average', 'percent'],
    pages: NOTES_PAGE,
    blocks: [
      h('Relation (Quan hệ)', 'Quan hệ'),
      p(
        'A **Relation** column links each row to one or more rows in another database — e.g. link each **Task** to a **Project**. Add a column of type **Relation** and choose the target database; then in each row pick the rows it connects to.',
        'Cột **Quan hệ** nối mỗi dòng với một hoặc nhiều dòng của bảng khác — vd nối mỗi **Việc** với một **Dự án**. Thêm cột kiểu **Quan hệ**, chọn bảng đích; rồi ở mỗi dòng chọn các dòng cần nối.',
      ),
      h('Rollup (Tổng hợp)', 'Tổng hợp'),
      p(
        'Once a relation exists, a **Rollup** column summarises the linked rows. Pick the relation, the column to summarise, and the function:',
        'Khi đã có quan hệ, cột **Tổng hợp** gom các dòng đã nối lại. Chọn quan hệ, cột cần gom, và phép tính:',
      ),
      table(
        [['Function', 'Phép tính'], ['Gives', 'Trả về']],
        [
          ['count', ['How many linked rows', 'Số dòng đã nối']],
          ['countNotEmpty', ['How many have a value', 'Số dòng có giá trị']],
          ['countDone', ['How many are done (a checkbox/status)', 'Số dòng đã xong (ô đánh dấu/trạng thái)']],
          ['percentDone', ['% of linked rows done', '% dòng đã nối đã xong']],
          ['sum / average', ['Total / mean of a Number column', 'Tổng / trung bình một cột Số']],
          ['min / max', ['Smallest / largest Number', 'Số nhỏ nhất / lớn nhất']],
          ['earliestDate / latestDate', ['First / last Date', 'Ngày sớm nhất / muộn nhất']],
        ],
      ),
      p(
        'Example: a **Project** row with a Rollup {{percentDone}} over its linked **Tasks** shows how far along the project is, updated automatically as tasks change.',
        'Ví dụ: một dòng **Dự án** có cột Tổng hợp {{percentDone}} trên các **Việc** đã nối sẽ cho biết dự án đi được bao xa, tự cập nhật khi việc thay đổi.',
      ),
      tip(
        'Combine the two: a Relation links the rows, a Rollup counts/sums them, and a Formula can turn that number into a label or a progress bar.',
        'Kết hợp cả hai: Quan hệ nối dòng, Tổng hợp đếm/cộng, rồi Công thức biến con số đó thành nhãn hay thanh tiến độ.',
      ),
    ],
    related: ['formulas', 'databases-basics'],
  },

  // ═══ SẮP XẾP & TÌM ═══
  {
    id: 'sidebar-tree',
    category: 'organize',
    title: { en: 'Subjects, chapters & the sidebar tree', vi: 'Môn, chương & cây sidebar' },
    summary: {
      en: 'Organise pages in a subject → chapter → page tree, favourite and pin what you use, and keep the rest tidy.',
      vi: 'Sắp trang theo cây môn → chương → trang, đánh dấu yêu thích và ghim thứ hay dùng, phần còn lại giữ gọn.',
    },
    keywords: ['sidebar', 'tree', 'subject', 'chapter', 'cay', 'mon', 'chuong', 'pin', 'ghim', 'favourite', 'yeu thich', 'archive', 'luu tru', 'inbox', 'hop thu', 'move'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'The sidebar shows a tree: **subjects** (môn) at the top level, **chapters** (chương) inside them, and **pages** (trang) inside chapters (or directly under a subject). The **Hộp thư** (Inbox 📥) catches quick notes that have no home yet.',
        'Sidebar hiện một cây: **môn** ở cấp trên cùng, **chương** bên trong, và **trang** trong chương (hoặc thẳng dưới môn). **Hộp thư** (📥) hứng các ghi chú nhanh chưa có chỗ.',
      ),
      h('Make and manage', 'Tạo và quản lý'),
      steps(
        ['Use the **"Mới"** (New) button to add a subject, chapter or page.', 'Dùng nút **"Mới"** để thêm môn, chương hoặc trang.'],
        ['Right-click (or the **"⋯"** menu) on a subject for **"Chia sẻ…"** (Share) and **"Xoá môn"** (Delete subject); a chapter has **"Xoá chương"**; a page has **"Chuyển vào Thùng rác"** (Move to Trash).', 'Bấm chuột phải (hoặc menu **"⋯"**) trên môn để **"Chia sẻ…"** và **"Xoá môn"**; chương có **"Xoá chương"**; trang có **"Chuyển vào Thùng rác"**.'],
        ['Double-click a name to rename it. Drag items to reorder them.', 'Nhấp đúp vào tên để đổi tên. Kéo để sắp lại thứ tự.'],
      ),
      h('Filter pills', 'Nút lọc nhanh'),
      table(
        [['Pill', 'Nút'], ['Shows', 'Hiện']],
        [
          [['Cây', 'Cây'], ['The full subject/chapter/page tree', 'Toàn cây môn/chương/trang']],
          [['Yêu thích', 'Yêu thích'], ['Pages you starred', 'Trang bạn đã đánh sao']],
          [['Cần ôn', 'Cần ôn'], ['Pages marked for review (for flashcards/study)', 'Trang được đánh dấu cần ôn (cho thẻ/ôn tập)']],
          [['Lưu trữ', 'Lưu trữ'], ['Archived pages kept out of the way', 'Trang đã lưu trữ, để gọn mắt']],
          [['Thùng rác', 'Thùng rác'], ['Deleted pages — auto-removed after 30 days', 'Trang đã xoá — tự xoá sau 30 ngày']],
        ],
      ),
      tip(
        'Pin the pages you open all the time: they show in a **"Đã ghim"** section at the top of the sidebar, above the tree.',
        'Ghim những trang bạn mở suốt: chúng hiện ở mục **"Đã ghim"** trên đầu sidebar, trên cả cây.',
      ),
    ],
    related: ['organize-find', 'backlinks', 'getting-started'],
  },
  {
    id: 'organize-find',
    category: 'organize',
    title: { en: 'Search, filter & move pages', vi: 'Tìm, lọc & di chuyển trang' },
    summary: {
      en: 'Find anything with full-text search, filter by subject and tag, and move a page to another chapter.',
      vi: 'Tìm mọi thứ bằng tìm toàn văn, lọc theo môn và thẻ, và chuyển trang sang chương khác.',
    },
    keywords: ['search', 'tim', 'find', 'filter', 'loc', 'move', 'di chuyen', 'chuyen trang', 'tag', 'the', 'advanced search', 'tim nang cao'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Two ways to find a page: the quick **command palette** ([[⌘]] [[K]]) for jumping by name, and **Tìm nâng cao** (Advanced search) for filtering a large notebook.',
        'Hai cách tìm trang: **bảng lệnh** nhanh ([[⌘]] [[K]]) để nhảy theo tên, và **Tìm nâng cao** để lọc trong một sổ lớn.',
      ),
      steps(
        ['Press [[⌘]] [[K]] and type — it searches titles and page content and shows matches instantly.', 'Nhấn [[⌘]] [[K]] rồi gõ — nó tìm trong tiêu đề và nội dung, hiện kết quả ngay.'],
        ['For a filtered search, open **"Tìm nâng cao"** from the command palette (or the sidebar search), and narrow by **subject** and **tag**.', 'Muốn lọc, mở **"Tìm nâng cao"** từ bảng lệnh (hoặc ô tìm ở sidebar), rồi thu hẹp theo **môn** và **thẻ**.'],
      ),
      h('Move a page', 'Di chuyển trang'),
      p(
        'To move a page to a different subject or chapter, drag it in the sidebar tree, or use the move picker from the page’s menu. Its links and backlinks travel with it.',
        'Để chuyển trang sang môn hoặc chương khác, kéo nó trong cây sidebar, hoặc dùng bộ chọn di chuyển từ menu của trang. Liên kết và liên kết ngược của nó đi theo.',
      ),
      tip(
        'Search ignores Vietnamese accents both ways: {{migration}} and {{di chuyen}} each find what you mean, and {{duong}} matches "đường".',
        'Tìm bỏ qua dấu tiếng Việt cả hai chiều: {{migration}} và {{di chuyen}} đều ra đúng ý, và {{duong}} khớp "đường".',
      ),
    ],
    related: ['quick-open', 'sidebar-tree', 'backlinks'],
  },
  {
    id: 'backlinks',
    category: 'organize',
    title: { en: 'Backlinks, sub-pages, comments & properties', vi: 'Liên kết ngược, trang con, bình luận & thuộc tính' },
    summary: {
      en: 'See which pages link to this one, nest pages, discuss in comments, and track versions and properties.',
      vi: 'Xem trang nào trỏ tới trang này, lồng trang vào nhau, thảo luận bằng bình luận, và theo dõi phiên bản, thuộc tính.',
    },
    keywords: ['backlink', 'lien ket nguoc', 'sub page', 'trang con', 'comment', 'binh luan', 'property', 'thuoc tinh', 'version history', 'lich su', 'links'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Each open page has a toolbar in the top-right with buttons to explore its connections and history.',
        'Mỗi trang đang mở có một thanh công cụ ở góc trên phải với các nút để xem kết nối và lịch sử.',
      ),
      h('Backlinks & sub-pages', 'Liên kết ngược & trang con'),
      p(
        'Open **"Trang con & liên kết ngược"** (Sub-pages & backlinks). It shows: **Nằm trong** (where this page sits), **Lồng trang này vào** (nest it into another page), **Trang con** (pages nested in this one), and **Được trỏ tới từ** (pages that link to this one). This is how a notebook becomes a connected web instead of a flat list.',
        'Mở **"Trang con & liên kết ngược"**. Nó hiện: **Nằm trong** (trang này ở đâu), **Lồng trang này vào** (lồng nó vào trang khác), **Trang con** (trang lồng trong trang này), và **Được trỏ tới từ** (những trang trỏ tới trang này). Nhờ đó sổ tay thành một mạng liên kết chứ không phải danh sách phẳng.',
      ),
      h('Comments', 'Bình luận'),
      p(
        'Click **"Bình luận"** (Comments — the speech-bubble button, tooltip "Bình luận và thảo luận") to open a discussion thread on the page. On shared notes, people with Comment or Edit permission can join.',
        'Bấm **"Bình luận"** (nút bong bóng thoại, chú thích "Bình luận và thảo luận") để mở luồng thảo luận trên trang. Với ghi chú đã chia sẻ, người có quyền Bình luận hoặc Chỉnh sửa tham gia được.',
      ),
      h('Version history & properties', 'Lịch sử phiên bản & thuộc tính'),
      list(
        ['**"Lịch sử phiên bản"** (Version history, the clock button) lets you look back at earlier versions of a page.', '**"Lịch sử phiên bản"** (nút đồng hồ) cho xem lại các phiên bản cũ của trang.'],
        ['Page **properties** (tags, review state and similar metadata) are shown in the properties panel — they power the Yêu thích / Cần ôn filters.', '**Thuộc tính** của trang (thẻ, trạng thái ôn tập và dữ liệu đi kèm) nằm ở ngăn thuộc tính — chúng làm nên bộ lọc Yêu thích / Cần ôn.'],
      ),
      tip(
        'Deleted the wrong page? Switch the sidebar to **Thùng rác**, find it, and restore it — you have 30 days.',
        'Xoá nhầm trang? Chuyển sidebar sang **Thùng rác**, tìm và khôi phục — bạn có 30 ngày.',
      ),
    ],
    related: ['sidebar-tree', 'flashcards', 'share-note'],
  },
  {
    id: 'flashcards',
    category: 'organize',
    title: { en: 'Flashcards & review', vi: 'Thẻ ghi nhớ & ôn tập' },
    summary: {
      en: 'Turn a page’s vocabulary list into flashcards and review them full-screen, marking what you know.',
      vi: 'Biến bảng từ vựng của một trang thành thẻ ghi nhớ và ôn toàn màn hình, đánh dấu phần đã thuộc.',
    },
    keywords: ['flashcard', 'the ghi nho', 'review', 'on tap', 'vocab', 'tu vung', 'spaced repetition', 'can on', 'needs review', 'study'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'A page can hold a **vocabulary list** (Từ vựng) — a table of **term · reading · meaning**. From it you can run a full-screen **flashcard review** (Ôn tập thẻ).',
        'Một trang có thể chứa **bảng từ vựng** (Từ vựng) — gồm **từ · cách đọc · nghĩa**. Từ đó bạn chạy **ôn tập thẻ** toàn màn hình (Ôn tập thẻ).',
      ),
      steps(
        ['Open the vocabulary section of a page and click **"Ôn tập"** (Review) — the card deck opens full-screen.', 'Mở mục từ vựng của trang và bấm **"Ôn tập"** — bộ thẻ mở toàn màn hình.'],
        ['Click the card (or press [[Space]]) to flip it from the term to the meaning.', 'Bấm vào thẻ (hoặc nhấn [[Space]]) để lật từ mặt từ sang mặt nghĩa.'],
        ['Mark each card: **"Chưa thuộc"** (Don’t know, key [[1]]) or **"Thuộc"** (Know, key [[2]]). Your progress is saved so next time it starts with what you haven’t learned yet.', 'Đánh dấu mỗi thẻ: **"Chưa thuộc"** (phím [[1]]) hoặc **"Thuộc"** (phím [[2]]). Tiến độ được lưu, lần sau bắt đầu từ thẻ bạn chưa thuộc.'],
      ),
      p(
        'The sidebar **"Cần ôn"** (Needs review) filter gathers pages you have flagged for study, so you can find them quickly when it is time to revise.',
        'Nút lọc **"Cần ôn"** ở sidebar gom các trang bạn đã đánh dấu cần học, để tìm nhanh khi tới lúc ôn.',
      ),
      tip(
        'Cards can be read aloud — use the speak button on the card. Handy for language study (reading + listening together).',
        'Thẻ đọc thành tiếng được — dùng nút phát âm trên thẻ. Tiện cho học ngoại ngữ (vừa đọc vừa nghe).',
      ),
    ],
    related: ['backlinks', 'sidebar-tree'],
  },

  // ═══ AI TRONG SỔ TAY ═══
  {
    id: 'ai-editor',
    category: 'ai',
    title: { en: 'AI in the editor', vi: 'AI trong trình soạn thảo' },
    summary: {
      en: 'Select text, then let AI rewrite, fix, summarise, translate or restructure it — one tap, result replaces the selection.',
      vi: 'Bôi đen chữ rồi để AI viết lại, sửa, tóm tắt, dịch hay sắp xếp lại — một chạm, kết quả thay chỗ bôi đen.',
    },
    keywords: ['ai', 'editor', 'rewrite', 'viet lai', 'summarize', 'tom tat', 'translate', 'dich', 'fix', 'sua', 'checklist', 'table', 'bang', 'selection', 'boi den'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Select some text in the editor and the floating toolbar shows an **AI** button (the sparkles icon). Click it and pick an action — the AI works only on the **selected text**, and the result replaces your selection (it shows a before/after so you can undo a bad result).',
        'Bôi đen một đoạn trong editor, thanh công cụ nổi sẽ hiện nút **AI** (biểu tượng tia lấp lánh). Bấm vào và chọn một việc — AI chỉ làm trên **đoạn đang bôi đen**, kết quả thay chỗ bôi đen (có đối chiếu trước/sau để bạn hoàn tác nếu dở).',
      ),
      h('The actions', 'Các thao tác'),
      table(
        [['Action', 'Thao tác'], ['What it does', 'Làm gì']],
        [
          [['Viết tiếp', 'Viết tiếp'], ['Continue the paragraph in the same voice', 'Viết tiếp đoạn, giữ nguyên giọng văn']],
          [['Viết lại cho hay hơn', 'Viết lại cho hay hơn'], ['Rewrite clearer and tighter, same meaning', 'Viết lại rõ và gọn hơn, không đổi ý']],
          [['Sửa chính tả và ngữ pháp', 'Sửa chính tả và ngữ pháp'], ['Fix spelling/grammar only, keeps your wording', 'Chỉ sửa lỗi chính tả/ngữ pháp, giữ cách dùng từ']],
          [['Rút gọn', 'Rút gọn'], ['Shorten to about half', 'Rút còn khoảng một nửa']],
          [['Tóm tắt', 'Tóm tắt'], ['Summarise into bullet points', 'Tóm thành gạch đầu dòng']],
          [['Chuyển thành checklist', 'Chuyển thành checklist'], ['Turn text into a to-do checklist', 'Biến đoạn thành checklist việc cần làm']],
          [['Rút trích nhiệm vụ', 'Rút trích nhiệm vụ'], ['Pull out tasks, owners and due dates', 'Rút nhiệm vụ, người phụ trách, hạn']],
          [['Tạo bảng', 'Tạo bảng'], ['Turn text into a table', 'Biến đoạn thành bảng']],
          [['Chuyển thành Sổ lệnh', 'Chuyển thành Sổ lệnh'], ['Collect commands into a Lệnh/Nghĩa/Ví dụ table', 'Gom lệnh vào bảng Lệnh/Nghĩa/Ví dụ']],
          [['Dịch sang tiếng Anh', 'Dịch sang tiếng Anh'], ['Translate to English', 'Dịch sang tiếng Anh']],
          [['Dịch sang tiếng Việt', 'Dịch sang tiếng Việt'], ['Translate to Vietnamese', 'Dịch sang tiếng Việt']],
        ],
      ),
      h('Restructure the whole page', 'Sắp xếp lại cả trang'),
      p(
        'There is also **"✨ Sắp xếp lại trang này"** (Restructure this page), which proposes a cleaner structure for the entire page (headings, lists, tables). It shows a comparison first and writes nothing until you accept — so a bad suggestion costs you nothing.',
        'Còn có **"✨ Sắp xếp lại trang này"** — đề xuất một cấu trúc gọn hơn cho cả trang (tiêu đề, danh sách, bảng). Nó hiện đối chiếu trước và không ghi gì cho tới khi bạn đồng ý — nên đề xuất dở không mất gì.',
      ),
      warn(
        'The editor AI only sees the text you selected (up to about 6,000 characters) — it cannot answer "what did I write last week about X". For that, use the **Notes assistant**.',
        'AI trong editor chỉ thấy đoạn bạn bôi đen (tối đa ~6.000 ký tự) — nó không trả lời được "tuần trước tôi ghi gì về X". Muốn vậy thì dùng **Trợ lý Sổ tay**.',
      ),
    ],
    related: ['ai-assistant', 'code-blocks', 'editor-slash'],
  },
  {
    id: 'ai-assistant',
    category: 'ai',
    title: { en: 'The Notes assistant (ask across all your notes)', vi: 'Trợ lý Sổ tay (hỏi trên mọi ghi chú)' },
    summary: {
      en: 'Ask a question and the assistant searches all your notes, answers from them, and cites which note each point came from.',
      vi: 'Đặt câu hỏi, trợ lý tìm khắp ghi chú của bạn, trả lời dựa trên đó và dẫn rõ mỗi ý lấy từ ghi chú nào.',
    },
    keywords: ['assistant', 'tro ly', 'ask', 'hoi', 'question', 'cau hoi', 'search notes', 'cite', 'nguon', 'quota', 'han muc', 'rag'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'The **Notes assistant** is a floating panel that answers questions about **your whole notebook**. Unlike the editor AI, it first finds the notes related to your question, then answers only from them — and every point is tagged with a source number like [1], [2] that links back to the note.',
        '**Trợ lý Sổ tay** là ngăn nổi trả lời câu hỏi về **toàn bộ sổ tay của bạn**. Khác AI trong editor, nó tìm các ghi chú liên quan trước, rồi chỉ trả lời dựa trên đó — và mỗi ý đều kèm số nguồn như [1], [2] dẫn về đúng ghi chú.',
      ),
      steps(
        ['Open the assistant panel (the sparkles button that floats on the page).', 'Mở ngăn trợ lý (nút tia lấp lánh nổi trên trang).'],
        ['Type a question in your own words, e.g. "What did I note about Prisma migrations?"', 'Gõ câu hỏi theo lời của bạn, vd "Tôi ghi gì về migration Prisma?"'],
        ['Read the answer and click a cited source to open that note.', 'Đọc câu trả lời và bấm một nguồn được dẫn để mở ghi chú đó.'],
      ),
      p(
        'If nothing relevant is found, the assistant says so rather than guessing — it will not invent an answer and present it as your note. Deleted notes (in Trash) are never used.',
        'Không tìm thấy gì liên quan thì trợ lý nói thẳng chứ không đoán — nó không bịa một câu trả lời rồi coi như ghi chú của bạn. Ghi chú trong Thùng rác không bao giờ được dùng.',
      ),
      h('Quotas', 'Hạn mức'),
      p(
        'AI in Notes shares your daily token quota (about **300,000 tokens/day**, higher on **Pro**). If you hit it you will see "Đã hết hạn mức AI hôm nay" — it resets the next day.',
        'AI trong Sổ tay dùng chung hạn mức token mỗi ngày (khoảng **300.000 token/ngày**, cao hơn với **Pro**). Hết thì bạn thấy "Đã hết hạn mức AI hôm nay" — ngày mai tự về.',
      ),
      tip(
        'Ask with words that actually appear in your notes — the assistant matches keywords (and meaning where available), so concrete terms work better than vague ones.',
        'Hỏi bằng từ thật sự có trong ghi chú — trợ lý khớp theo từ khoá (và theo nghĩa khi có), nên từ cụ thể cho kết quả tốt hơn từ mơ hồ.',
      ),
    ],
    related: ['ai-editor', 'organize-find'],
  },

  // ═══ CHIA SẺ & XUẤT ═══
  {
    id: 'share-note',
    category: 'share',
    title: { en: 'Share a subject or note with people', vi: 'Chia sẻ môn hoặc ghi chú với người khác' },
    summary: {
      en: 'Invite others to view, comment on or edit your notes, and see what has been shared with you.',
      vi: 'Mời người khác xem, bình luận hoặc chỉnh sửa ghi chú của bạn, và xem những gì được chia sẻ cho bạn.',
    },
    keywords: ['share', 'chia se', 'permission', 'quyen', 'view', 'xem', 'comment', 'binh luan', 'edit', 'chinh sua', 'shared with me', 'collaborate'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'You can share a whole **subject** or a single **note**. Each person you invite gets a permission level: **Xem** (View), **Bình luận** (Comment) or **Chỉnh sửa** (Edit).',
        'Bạn chia sẻ được cả một **môn** hoặc một **ghi chú** riêng. Mỗi người được mời có một mức quyền: **Xem**, **Bình luận** hoặc **Chỉnh sửa**.',
      ),
      steps(
        ['From the sidebar, open a subject’s **"⋯"** menu → **"Chia sẻ…"**, or use the **Chia sẻ** (Share) button on an open page.', 'Ở sidebar, mở menu **"⋯"** của môn → **"Chia sẻ…"**, hoặc dùng nút **Chia sẻ** trên trang đang mở.'],
        ['Add people and set each one’s permission (View / Comment / Edit).', 'Thêm người và đặt quyền cho từng người (Xem / Bình luận / Chỉnh sửa).'],
        ['They see it under **shared with me**; comments need at least Comment permission.', 'Họ thấy nó trong mục **được chia sẻ với tôi**; muốn bình luận cần tối thiểu quyền Bình luận.'],
      ),
      tip(
        'A viewer who needs to join the discussion will see "Bạn có quyền xem. Chủ sở hữu cần cấp quyền Bình luận hoặc Chỉnh sửa" — bump their permission to let them comment.',
        'Người chỉ có quyền Xem muốn thảo luận sẽ thấy "Bạn có quyền xem. Chủ sở hữu cần cấp quyền Bình luận hoặc Chỉnh sửa" — nâng quyền để họ bình luận được.',
      ),
    ],
    related: ['backlinks', 'export', 'ctwork-link'],
  },
  {
    id: 'export',
    category: 'share',
    title: { en: 'Export a page (PDF, Word, Markdown)', vi: 'Xuất trang (PDF, Word, Markdown)' },
    summary: {
      en: 'Download a note as a PDF, Word document or Markdown file to hand in, print or keep.',
      vi: 'Tải một ghi chú về dạng PDF, Word hoặc Markdown để nộp, in hay giữ.',
    },
    keywords: ['export', 'xuat', 'download', 'tai xuong', 'pdf', 'word', 'docx', 'markdown', 'md', 'print', 'in'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'A note can be downloaded in three formats: **PDF**, **Word (.docx)** and **Markdown (.md)**. PDFs embed a Vietnamese-capable font, so accented text renders correctly instead of turning into boxes.',
        'Một ghi chú tải về được theo ba định dạng: **PDF**, **Word (.docx)** và **Markdown (.md)**. Bản PDF nhúng font hỗ trợ tiếng Việt, nên chữ có dấu hiện đúng chứ không thành ô vuông.',
      ),
      steps(
        ['Open the page you want to export.', 'Mở trang bạn muốn xuất.'],
        ['Use the **Xuất PDF** (Export PDF) button in the page toolbar (the download icon) for a quick PDF; the Markdown and Word formats download the same note as {{.md}} / {{.docx}}.', 'Dùng nút **Xuất PDF** trên thanh công cụ trang (biểu tượng tải xuống) để có PDF nhanh; định dạng Markdown và Word tải cùng ghi chú đó thành {{.md}} / {{.docx}}.'],
        ['The file keeps its proper name (with accents) and downloads to your device.', 'Tệp giữ đúng tên (có dấu) và tải về máy bạn.'],
      ),
      warn(
        'Export captures the page’s text and formatting. Very dynamic blocks (a live database view, an embed) export as their current snapshot, not as an interactive widget.',
        'Xuất lấy chữ và định dạng của trang. Những khối rất động (một khung nhìn bảng dữ liệu, một khối nhúng) được xuất theo ảnh chụp hiện tại, không phải dạng tương tác.',
      ),
    ],
    related: ['share-note', 'ctwork-link'],
  },
  {
    id: 'ctwork-link',
    category: 'share',
    title: { en: 'Link notes with CT Work', vi: 'Nối ghi chú với CT Work' },
    summary: {
      en: 'Reference a CT Work issue from a note, and link notes to a CT Work card, so your writing and your tasks stay connected.',
      vi: 'Tham chiếu một issue CT Work từ ghi chú, và nối ghi chú vào một thẻ CT Work, để bài viết và công việc của bạn gắn với nhau.',
    },
    keywords: ['ct work', 'ctwork', 'issue', 'card', 'the', 'link', 'noi', 'tham chieu', 'project', 'task', 'work'],
    pages: NOTES_PAGE,
    blocks: [
      p(
        'Notes and **CT Work** (the Jira-style project tracker) can be connected: you can **reference a CT Work issue from a note**, and **link notes to a CT Work card**. That way the research or spec you wrote in Notes is reachable from the task that depends on it, and vice-versa.',
        'Sổ tay và **CT Work** (công cụ quản lý dự án kiểu Jira) nối được với nhau: bạn có thể **tham chiếu một issue CT Work từ ghi chú**, và **nối ghi chú vào một thẻ CT Work**. Nhờ đó tài liệu hay đặc tả bạn viết trong Sổ tay mở được từ chính công việc cần tới nó, và ngược lại.',
      ),
      list(
        ['From a **note**, add a reference to a CT Work issue to point readers (and yourself) at the related task.', 'Từ một **ghi chú**, thêm tham chiếu tới một issue CT Work để chỉ người đọc (và chính bạn) tới công việc liên quan.'],
        ['From a **CT Work card**, link the notes that document it — the design doc, the meeting notes, the reading.', 'Từ một **thẻ CT Work**, nối các ghi chú mô tả nó — tài liệu thiết kế, biên bản họp, phần đọc.'],
      ),
      tip(
        'Keep the detail where it belongs: long-form writing lives in Notes, the task and its status live in CT Work, and the link keeps them one click apart.',
        'Giữ chi tiết ở đúng chỗ: phần viết dài nằm trong Sổ tay, công việc và trạng thái nằm trong CT Work, và liên kết giữ chúng cách nhau một cú bấm.',
      ),
    ],
    related: ['share-note', 'export'],
  },
];

export const HELP_BY_ID: Record<string, HelpArticle> = Object.fromEntries(HELP_ARTICLES.map((a) => [a.id, a]));

/** Thứ tự đọc: theo nhóm, rồi theo thứ tự khai báo — dùng cho "bài trước / bài sau". */
export const HELP_ORDER: string[] = HELP_CATEGORIES.flatMap((c) => HELP_ARTICLES.filter((a) => a.category === c.id).map((a) => a.id));

// ─── Tìm kiếm ────────────────────────────────────────────────────

/** Bỏ dấu tiếng Việt + chữ thường: "Đóng góp" ⇒ "dong gop". */
export function foldText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase();
}

function blockText(b: HelpBlock): string[] {
  switch (b.t) {
    case 'p': case 'h': case 'tip': case 'warn': return [b.text.en, b.text.vi];
    case 'steps': case 'list': return b.items.flatMap((i) => [i.en, i.vi]);
    case 'table': return [...b.head, ...b.rows.flat()].flatMap((c) => [c.en, c.vi]);
    case 'kbd': return b.items.flatMap((i) => [i.keys.join(' '), i.label.en, i.label.vi]);
    case 'code': return [b.text];
  }
}

interface Indexed { id: string; title: string; head: string; body: string }
let INDEX: Indexed[] | null = null;
function index(): Indexed[] {
  if (!INDEX) {
    INDEX = HELP_ARTICLES.map((a) => ({
      id: a.id,
      title: foldText(`${a.title.en} ${a.title.vi}`),
      head: foldText(`${a.summary.en} ${a.summary.vi} ${a.keywords.join(' ')}`),
      body: foldText(a.blocks.flatMap(blockText).join(' ').replace(/\*\*|\{\{|\}\}|\[\[|\]\]/g, '')),
    }));
  }
  return INDEX;
}

/** Tìm bài: mọi từ phải xuất hiện đâu đó; tiêu đề nặng hơn từ khoá, từ khoá nặng hơn thân bài. */
export function searchHelp(query: string): HelpArticle[] {
  const words = foldText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: Array<{ id: string; score: number }> = [];
  for (const x of index()) {
    let score = 0;
    let ok = true;
    for (const w of words) {
      const s = (x.title.includes(w) ? 10 : 0) + (x.head.includes(w) ? 4 : 0) + (x.body.includes(w) ? 1 : 0);
      if (!s) { ok = false; break; }
      score += s;
    }
    if (ok) scored.push({ id: x.id, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => HELP_BY_ID[s.id]);
}

/** Đoạn trích quanh từ tìm đầu tiên (theo ngôn ngữ đang đọc) để hiện dưới kết quả. */
export function helpSnippet(a: HelpArticle, query: string, lang: HelpLang, max = 150): string {
  const words = foldText(query).split(/\s+/).filter(Boolean);
  const texts = a.blocks.flatMap((b) => {
    switch (b.t) {
      case 'p': case 'h': case 'tip': case 'warn': return [b.text[lang]];
      case 'steps': case 'list': return b.items.map((i) => i[lang]);
      case 'table': return b.rows.map((r) => r.map((c) => c[lang]).join(' · '));
      case 'kbd': return b.items.map((i) => `${i.keys.join('+')} ${i.label[lang]}`);
      case 'code': return [b.text];
    }
  }).map((s) => s.replace(/\*\*|\{\{|\}\}|\[\[|\]\]/g, ''));
  for (const t of texts) {
    const f = foldText(t);
    const i = words.map((w) => f.indexOf(w)).find((n) => n >= 0);
    if (i !== undefined) {
      let start = Math.max(0, i - 40);
      if (start > 0) {
        const sp = t.indexOf(' ', start);
        if (sp >= 0 && sp < i) start = sp + 1;
      }
      const s = t.slice(start, start + max);
      return `${start > 0 ? '…' : ''}${s}${start + max < t.length ? '…' : ''}`;
    }
  }
  return a.summary[lang];
}

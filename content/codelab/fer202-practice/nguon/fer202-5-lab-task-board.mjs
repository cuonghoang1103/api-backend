/**
 * FER202 · Chương 5 (Component & State) — LAB 5: Kanban Task Board.
 * Bám Exercise 9/11/19 của trường (component, props, state, to-do, search filter, PropTypes) nhưng sâu hơn:
 * cây component + nâng state lên App, cập nhật bất biến, PropTypes + giá trị mặc định, class component có
 * state riêng, thành phần bọc dùng children. Thang 10, 8 chức năng (f1..f8).
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DATA = `// src/data/tasks.js — dữ liệu mẫu (đã cho)
export const STATUSES = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const tasks = [
  { id: 1, title: 'Set up the React project', status: 'done', priority: 'high', assignee: 'An' },
  { id: 2, title: 'Design the board layout', status: 'done', priority: 'medium', assignee: 'Binh' },
  { id: 3, title: 'Build the TaskCard component', status: 'doing', priority: 'high', assignee: 'Cuong' },
  { id: 4, title: 'Add PropTypes to components', status: 'doing', priority: 'low' },
  { id: 5, title: 'Write the search filter', status: 'todo', priority: 'medium', assignee: 'An' },
  { id: 6, title: 'Show task statistics', status: 'todo', priority: 'low', assignee: 'Dung' },
  { id: 7, title: 'Fix the column counter', status: 'todo', priority: 'high' },
  { id: 8, title: 'Deploy to Netlify', status: 'todo', priority: 'medium', assignee: 'Binh' },
];

export default tasks;
`;

const CSS = `/* src/index.css — đã cho */
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; color: #0f172a; }
.app { max-width: 1100px; margin: 0 auto; padding: 20px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.toolbar input, .toolbar select { padding: 7px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font: inherit; }
.toolbar input { flex: 1; min-width: 180px; }
button { cursor: pointer; border: 1px solid #cbd5e1; background: #fff; border-radius: 8px; padding: 5px 10px; font: inherit; }
.panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 16px; }
.panel-title { margin: 0 0 12px; font-size: 18px; }
.board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
@media (max-width: 760px) { .board { grid-template-columns: 1fr; } }
.column { background: #f8fafc; border-radius: 12px; padding: 10px; min-height: 120px; }
.column-title { margin: 0 0 8px; font-size: 15px; }
.task-card { background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #94a3b8; border-radius: 10px; padding: 10px; margin-bottom: 8px; }
.task-card.priority-high { border-left-color: #ef4444; }
.task-card.priority-medium { border-left-color: #f59e0b; }
.task-card.priority-low { border-left-color: #22c55e; }
.task-title { margin: 0 0 4px; font-size: 14px; }
.task-assignee { margin: 0 0 6px; font-size: 12px; color: #64748b; }
.task-actions { display: flex; gap: 6px; }
.badge { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: #e2e8f0; margin-left: auto; }
.stats-details { margin: 8px 0 0; padding-left: 18px; }
`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const PANEL = `// src/components/Panel.js — thành phần BỌC: nội dung bên trong do nơi dùng quyết định (children)
import PropTypes from 'prop-types';

export default function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2 className="panel-title">{title}</h2>
      {children}
    </section>
  );
}

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
`;

const CARD = `// src/components/TaskCard.js — component TRÌNH BÀY: chỉ nhận props, không tự giữ dữ liệu
import PropTypes from 'prop-types';

// assignee = 'Unassigned': giá trị MẶC ĐỊNH khi cha không truyền (cách hiện đại thay cho defaultProps)
export default function TaskCard({ id, title, priority, assignee = 'Unassigned', canPrev, canNext, onMove, onDelete }) {
  return (
    <article id={´task-@{id}´} className={´task-card priority-@{priority}´}>
      <h4 className="task-title">{title}</h4>
      <p className="task-assignee">{assignee}</p>
      <div className="task-actions">
        {canPrev && <button type="button" className="btn-prev" onClick={() => onMove(id, -1)} aria-label="Move back">←</button>}
        {canNext && <button type="button" className="btn-next" onClick={() => onMove(id, 1)} aria-label="Move forward">→</button>}
        <button type="button" className="btn-delete" onClick={() => onDelete(id)} aria-label="Delete">✕</button>
        <span className="badge">{priority}</span>
      </div>
    </article>
  );
}

TaskCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  priority: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
  assignee: PropTypes.string,
  canPrev: PropTypes.bool,
  canNext: PropTypes.bool,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
`;

const COLUMN = `// src/components/Column.js — một cột: tiêu đề + đếm + các thẻ (dữ liệu và hàm đều đến từ props)
import PropTypes from 'prop-types';
import TaskCard from './TaskCard';

export default function Column({ status, title, tasks, isFirst, isLast, onMove, onDelete }) {
  return (
    <div id={´col-@{status}´} className="column">
      <h3 className="column-title">{title} ({tasks.length})</h3>
      {tasks.map((t) => (
        // key = id ổn định; {...t} trải các trường của task thành props
        <TaskCard key={t.id} {...t} canPrev={!isFirst} canNext={!isLast} onMove={onMove} onDelete={onDelete} />
      ))}
    </div>
  );
}

Column.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
`;

const BOARD = `// src/components/Board.js — dựng 3 cột từ STATUSES (không viết tay 3 lần)
import PropTypes from 'prop-types';
import Column from './Column';
import { STATUSES } from '../data/tasks';

export default function Board({ tasks, onMove, onDelete }) {
  return (
    <div className="board">
      {STATUSES.map((s, i) => (
        <Column
          key={s.id}
          status={s.id}
          title={s.title}
          tasks={tasks.filter((t) => t.status === s.id)}
          isFirst={i === 0}
          isLast={i === STATUSES.length - 1}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

Board.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
`;

const STATS = `// src/components/TaskStats.js — CLASS component: props đọc qua this.props, state riêng qua this.state/setState
import { Component } from 'react';
import PropTypes from 'prop-types';

export default class TaskStats extends Component {
  state = { showDetails: false };

  // arrow function ⇒ "this" luôn trỏ đúng instance (không cần bind trong constructor)
  toggle = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    const { tasks } = this.props;
    const done = tasks.filter((t) => t.status === 'done').length;
    const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    const count = (p) => tasks.filter((t) => t.priority === p).length;
    return (
      <div>
        <p id="stats">Done: {done}/{tasks.length} ({percent}%)</p>
        <button type="button" id="toggle-stats" onClick={this.toggle}>
          {this.state.showDetails ? 'Hide details' : 'Show details'}
        </button>
        {this.state.showDetails && (
          <ul className="stats-details">
            <li className="stat-high">High: {count('high')}</li>
            <li className="stat-medium">Medium: {count('medium')}</li>
            <li className="stat-low">Low: {count('low')}</li>
          </ul>
        )}
      </div>
    );
  }
}

TaskStats.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};
`;

const APP = `// src/App.js — state ĐƯỢC NÂNG lên đây: App là nguồn sự thật, con chỉ nhận dữ liệu + hàm qua props
import { useState } from 'react';
import Board from './components/Board';
import Panel from './components/Panel';
import TaskStats from './components/TaskStats';
import initialTasks, { STATUSES } from './data/tasks';

const ORDER = STATUSES.map((s) => s.id); // ['todo', 'doing', 'done']

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  // Di chuyển: tạo mảng MỚI bằng map, chỉ thay đúng một task (không sửa object cũ)
  const moveTask = (id, dir) =>
    setTasks((list) =>
      list.map((t) => {
        if (t.id !== id) return t;
        const next = ORDER[ORDER.indexOf(t.status) + dir];
        return next ? { ...t, status: next } : t;
      }),
    );

  const deleteTask = (id) => setTasks((list) => list.filter((t) => t.id !== id));

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return; // bỏ qua chuỗi rỗng / toàn dấu cách
    setTasks((list) => [...list, { id: Math.max(0, ...list.map((t) => t.id)) + 1, title, status: 'todo', priority: newPriority }]);
    setNewTitle('');
  };

  // danh sách hiển thị SUY RA từ tasks + search (không lưu thành state thứ hai)
  const q = search.trim().toLowerCase();
  const visible = tasks.filter((t) => t.title.toLowerCase().includes(q));

  return (
    <div className="app">
      <h1>Kanban Task Board</h1>
      <div className="toolbar">
        <input id="search" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <input id="new-task" placeholder="New task title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <select id="new-priority" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <button type="button" id="btn-add" onClick={addTask}>Add task</button>
      </div>
      <Panel title="Board">
        <Board tasks={visible} onMove={moveTask} onDelete={deleteTask} />
      </Panel>
      <Panel title="Statistics">
        <TaskStats tasks={tasks} />
      </Panel>
    </div>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_APP = `// src/App.js — STARTER: mọi thứ đang dồn trong một component, chưa có state
import tasks from './data/tasks';

export default function App() {
  // TODO: tách Board / Column / TaskCard / TaskStats / Panel; state tasks + search ở đây; thêm, chuyển cột, xoá
  return (
    <div className="app">
      <h1>Kanban Task Board</h1>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>{t.title} — {t.status}</li>
        ))}
      </ul>
    </div>
  );
}
`;
const S_STUB = (ten, ghiChu) => `// src/components/${ten}.js — STARTER
// TODO: ${ghiChu}
export default function ${ten}() {
  return null;
}
`;
const S_STATS = `// src/components/TaskStats.js — STARTER (phải là CLASS component)
import { Component } from 'react';

export default class TaskStats extends Component {
  // TODO: state showDetails, nút #toggle-stats, #stats "Done: d/n (p%)", .stat-high/.stat-medium/.stat-low
  render() {
    return null;
  }
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data/tasks.js': DATA };
const LOI_GIAI = { 'src/App.js': APP, 'src/components/Board.js': BOARD, 'src/components/Column.js': COLUMN, 'src/components/TaskCard.js': CARD, 'src/components/TaskStats.js': STATS, 'src/components/Panel.js': PANEL, ...CHUNG };
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/components/Board.js': S_STUB('Board', 'render 3 Column từ STATUSES (tasks lọc theo status)'),
  'src/components/Column.js': S_STUB('Column', '#col-{status}.column, .column-title "To Do (4)", một TaskCard mỗi task'),
  'src/components/TaskCard.js': S_STUB('TaskCard', '#task-{id}.task-card.priority-{priority}, .task-title, .task-assignee (mặc định "Unassigned"), .btn-prev/.btn-next/.btn-delete + PropTypes'),
  'src/components/TaskStats.js': S_STATS,
  'src/components/Panel.js': S_STUB('Panel', 'section.panel > h2.panel-title + children'),
  ...CHUNG,
};

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const click = (selector) => ({ hanhDong: 'click', selector });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const THEM = [nhap('#new-task', 'Write unit tests'), { hanhDong: 'doi', selector: '#new-priority', giaTri: 'high' }, click('#btn-add')];
const KIEM = [
  // f1
  { nhom: 'f1', moTa: '3 columns are rendered', kiem: 'so-luong', selector: '.column', giaTri: 3 },
  { nhom: 'f1', moTa: 'Column titles show their counts', kiem: 'danh-sach-text', selector: '.column-title', mongDoi: ['To Do (4)', 'In Progress (2)', 'Done (2)'] },
  { nhom: 'f1', moTa: '#col-todo lists its tasks in data order', kiem: 'danh-sach-text', selector: '#col-todo .task-title', mongDoi: ['Write the search filter', 'Show task statistics', 'Fix the column counter', 'Deploy to Netlify'] },
  { nhom: 'f1', moTa: 'Card shows assignee and has a priority class', kiem: 'text', selector: '#task-1.priority-high .task-assignee', giaTri: 'An' },
  { nhom: 'f1', moTa: 'TaskCard lives in its own file', kiem: 'ma-nguon', tep: 'src/components/TaskCard.js', khop: 'export\\s+default\\s+function\\s+TaskCard|export\\s+default\\s+TaskCard' },
  { nhom: 'f1', an: true, moTa: 'Column component receives tasks via props', kiem: 'ma-nguon', tep: 'src/components/Column.js', khop: 'tasks\\.map\\(' },
  // f2
  { nhom: 'f2', moTa: 'Missing assignee ⇒ "Unassigned"', kiem: 'danh-sach-text', selector: '#task-4 .task-assignee, #task-7 .task-assignee', mongDoi: ['Unassigned', 'Unassigned'] },
  { nhom: 'f2', moTa: 'TaskCard declares propTypes', kiem: 'ma-nguon', tep: 'src/components/TaskCard.js', khop: 'TaskCard\\.propTypes\\s*=' },
  { nhom: 'f2', moTa: 'priority is validated with PropTypes.oneOf', kiem: 'ma-nguon', tep: 'src/components/TaskCard.js', khop: "PropTypes\\.oneOf\\(\\s*\\[\\s*['\"]high['\"]" },
  { nhom: 'f2', an: true, moTa: 'Column declares propTypes too', kiem: 'ma-nguon', tep: 'src/components/Column.js', khop: 'Column\\.propTypes\\s*=' },
  // f3
  { nhom: 'f3', moTa: '→ moves a task to the next column', kiem: 'danh-sach-text', selector: '#col-doing .task-title', mongDoi: ['Build the TaskCard component', 'Add PropTypes to components', 'Write the search filter'], truoc: [click('#task-5 .btn-next')] },
  { nhom: 'f3', moTa: 'Counts update after moving', kiem: 'danh-sach-text', selector: '.column-title', mongDoi: ['To Do (3)', 'In Progress (3)', 'Done (2)'], truoc: [click('#task-5 .btn-next')] },
  { nhom: 'f3', moTa: '← moves a task back', kiem: 'ton-tai', selector: '#col-doing #task-1', truoc: [click('#task-1 .btn-prev')] },
  { nhom: 'f3', moTa: 'No → in Done, no ← in To Do', kiem: 'so-luong', selector: '#col-done .btn-next, #col-todo .btn-prev', giaTri: 0 },
  { nhom: 'f3', an: true, moTa: 'Moving keeps the other fields (assignee)', kiem: 'text', selector: '#col-done #task-3 .task-assignee', giaTri: 'Cuong', truoc: [click('#task-3 .btn-next')] },
  { nhom: 'f3', an: true, moTa: 'State is updated immutably (map / spread, no direct assignment)', kiem: 'ma-nguon', tep: 'src/App.js', khop: '\\.status\\s*=(?!=)', phuDinh: true },
  // f4
  { nhom: 'f4', moTa: 'New task is added at the end of To Do', kiem: 'danh-sach-text', selector: '#col-todo .task-title', mongDoi: ['Write the search filter', 'Show task statistics', 'Fix the column counter', 'Deploy to Netlify', 'Write unit tests'], truoc: THEM },
  { nhom: 'f4', moTa: 'It gets id 9, the chosen priority and "Unassigned"', kiem: 'text', selector: '#task-9.priority-high .task-assignee', giaTri: 'Unassigned', truoc: THEM },
  { nhom: 'f4', moTa: 'The input is cleared after adding', kiem: 'thuoc-tinh-js', selector: '#new-task', thuocTinh: 'value', giaTri: '', truoc: THEM },
  { nhom: 'f4', an: true, moTa: 'Blank titles are ignored', kiem: 'so-luong', selector: '.task-card', giaTri: 8, truoc: [nhap('#new-task', '   '), click('#btn-add')] },
  { nhom: 'f4', an: true, moTa: 'Title is trimmed', kiem: 'text', selector: '#task-9 .task-title', giaTri: 'Review PR', truoc: [nhap('#new-task', '  Review PR  '), click('#btn-add')] },
  // f5
  { nhom: 'f5', moTa: '✕ deletes the task', kiem: 'so-luong', selector: '.task-card', giaTri: 7, truoc: [click('#task-7 .btn-delete')] },
  { nhom: 'f5', moTa: 'Column count updates after delete', kiem: 'text', selector: '#col-todo .column-title', giaTri: 'To Do (3)', truoc: [click('#task-7 .btn-delete')] },
  { nhom: 'f5', an: true, moTa: 'Statistics follow the deletion', kiem: 'text', selector: '#stats', giaTri: 'Done: 2/7 (29%)', truoc: [click('#task-7 .btn-delete')] },
  // f6
  { nhom: 'f6', moTa: 'Search "the" filters every column', kiem: 'danh-sach-text', selector: '.column-title', mongDoi: ['To Do (2)', 'In Progress (1)', 'Done (2)'], truoc: [nhap('#search', 'the')] },
  { nhom: 'f6', moTa: 'Search is case-insensitive', kiem: 'danh-sach-text', selector: '.task-title', mongDoi: ['Add PropTypes to components'], truoc: [nhap('#search', 'PROPTYPES')] },
  { nhom: 'f6', an: true, moTa: 'Statistics still count ALL tasks while searching', kiem: 'text', selector: '#stats', giaTri: 'Done: 2/8 (25%)', truoc: [nhap('#search', 'deploy')] },
  // f7
  { nhom: 'f7', moTa: '#stats reads "Done: 2/8 (25%)"', kiem: 'text', selector: '#stats', giaTri: 'Done: 2/8 (25%)' },
  { nhom: 'f7', moTa: '#toggle-stats shows the priority breakdown', kiem: 'danh-sach-text', selector: '.stat-high, .stat-medium, .stat-low', mongDoi: ['High: 3', 'Medium: 3', 'Low: 2'], truoc: [click('#toggle-stats')] },
  { nhom: 'f7', moTa: 'TaskStats is a class component', kiem: 'ma-nguon', tep: 'src/components/TaskStats.js', khop: 'class\\s+TaskStats\\s+extends\\s+(React\\.)?(Pure)?Component' },
  { nhom: 'f7', an: true, moTa: 'Percent is rounded: 3/8 ⇒ 38%', kiem: 'text', selector: '#stats', giaTri: 'Done: 3/8 (38%)', truoc: [click('#task-3 .btn-next')] },
  { nhom: 'f7', an: true, moTa: 'Clicking twice hides the details', kiem: 'so-luong', selector: '.stat-high', giaTri: 0, truoc: [click('#toggle-stats'), click('#toggle-stats')] },
  { nhom: 'f7', an: true, moTa: 'Uses this.setState (not direct this.state assignment)', kiem: 'ma-nguon', tep: 'src/components/TaskStats.js', khop: 'this\\.setState\\(' },
  // f8
  { nhom: 'f8', moTa: 'Two .panel sections titled Board and Statistics', kiem: 'danh-sach-text', selector: '.panel > .panel-title', mongDoi: ['Board', 'Statistics'] },
  { nhom: 'f8', moTa: 'The board is passed into the panel as children', kiem: 'ton-tai', selector: '.panel > .board' },
  { nhom: 'f8', an: true, moTa: 'Panel renders props.children', kiem: 'ma-nguon', tep: 'src/components/Panel.js', khop: '\\{\\s*(props\\.)?children\\s*\\}' },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 5: Kanban Task Board — components, props & state', vi: 'LAB 5: Bảng công việc Kanban — component, props & state' },
  phu: { en: 'FER202 · Chapter 5 — Components & State · Suggested time: 100 minutes · Total: 10 marks', vi: 'FER202 · Chương 5 — Component & State · Thời gian gợi ý: 100 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Build a small Kanban board (To Do · In Progress · Done) the React way: split the UI into <b>reusable components</b>, pass data down with <b>props</b>, keep the data in <b>one state</b> owned by <code>App</code> (lifting state up), validate props with <b>PropTypes</b>, write one <b>class component</b> with its own state, and a wrapper component that renders <b>children</b>.</p>',
    vi: '<p>Làm một bảng Kanban nhỏ (To Do · In Progress · Done) đúng cách React: chia giao diện thành <b>component tái sử dụng</b>, truyền dữ liệu xuống bằng <b>props</b>, giữ dữ liệu trong <b>một state</b> do <code>App</code> sở hữu (nâng state lên), kiểm props bằng <b>PropTypes</b>, viết một <b>class component</b> có state riêng, và một component bọc hiển thị <b>children</b>.</p>',
  },
  chucNangChinh: [
    { en: 'Board → Column → TaskCard component tree; move, add, delete, search tasks.', vi: 'Cây component Board → Column → TaskCard; chuyển cột, thêm, xoá, tìm công việc.' },
    { en: 'Statistics as a class component; Panel wrapper with children.', vi: 'Thống kê là class component; khung Panel bọc nội dung bằng children.' },
  ],
  yeuCauChung: [
    { en: 'One component per file in <code>src/components/</code>. Only <code>App</code> owns state about tasks.', vi: 'Mỗi component một tệp trong <code>src/components/</code>. Chỉ <code>App</code> giữ state về công việc.' },
    { en: 'Never mutate state: use <code>map</code>, <code>filter</code> and spread to create new arrays/objects.', vi: 'Không sửa state trực tiếp: dùng <code>map</code>, <code>filter</code> và spread để tạo mảng/object mới.' },
    { en: 'Every list item has a stable <code>key</code> (the task id).', vi: 'Mỗi phần tử danh sách có <code>key</code> ổn định (id công việc).' },
    { en: 'Keep the ids / classes of section 6 — the grader uses them.', vi: 'Giữ đúng id / class ở mục 6 — máy chấm dựa vào chúng.' },
  ],
  cayThuMuc: `
src/
├── components/
│   ├── Board.js        # 3 columns built from STATUSES
│   ├── Column.js       # title (count) + TaskCards
│   ├── TaskCard.js     # presentational card + PropTypes
│   ├── TaskStats.js    # CLASS component
│   └── Panel.js        # wrapper: title + children
├── data/
│   └── tasks.js        # STATUSES + 8 sample tasks (given)
├── App.js              # state: tasks, search, new-task inputs
├── index.css           # given
└── index.js            # given`,
  wireframe: `
+--------------------------------------------------------------------------+
| Kanban Task Board                                                        |
| [Search tasks...      ] [New task title      ] [medium v] [Add task]     |
| +- Board -------------------------------------------------------------+  |
| | To Do (4)             | In Progress (2)         | Done (2)            |  |
| | +-------------------+ | +---------------------+ | +-----------------+ |  |
| | | Write the search  | | | Build the TaskCard  | | | Set up the      | |  |
| | | filter            | | | component           | | | React project   | |  |
| | | An                | | | Cuong               | | | An              | |  |
| | | [→] [x]   medium  | | | [←] [→] [x]   high  | | | [←] [x]   high  | |  |
| | +-------------------+ | +---------------------+ | +-----------------+ |  |
| +---------------------------------------------------------------------+  |
| +- Statistics --------------------------------------------------------+  |
| | Done: 2/8 (25%)   [Show details]                                    |  |
| +---------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'Task',
    truong: [
      ['id', 'number', { en: 'unique; new id = max(id) + 1', vi: 'duy nhất; id mới = max(id) + 1' }],
      ['title', 'string', { en: 'required, trimmed', vi: 'bắt buộc, bỏ khoảng trắng hai đầu' }],
      ['status', "'todo' | 'doing' | 'done'", { en: 'order of STATUSES', vi: 'theo thứ tự STATUSES' }],
      ['priority', "'high' | 'medium' | 'low'", ''],
      ['assignee', 'string (optional)', { en: 'missing ⇒ show "Unassigned"', vi: 'không có ⇒ hiện "Unassigned"' }],
    ],
  },
  duLieuMau: `
To Do:        5 Write the search filter (medium, An) · 6 Show task statistics (low, Dung)
              7 Fix the column counter (high, —) · 8 Deploy to Netlify (medium, Binh)
In Progress:  3 Build the TaskCard component (high, Cuong) · 4 Add PropTypes to components (low, —)
Done:         1 Set up the React project (high, An) · 2 Design the board layout (medium, Binh)`,
  chucNang: [
    {
      ten: { en: 'Component tree & props', vi: 'Cây component & props' }, diem: 1.5,
      yeuCau: [
        { en: '<code>Board</code> renders one <code>Column</code> per entry of <code>STATUSES</code>: <code>#col-{status}.column</code> with <code>.column-title</code> <code>To Do (4)</code>.', vi: '<code>Board</code> vẽ một <code>Column</code> cho mỗi phần tử <code>STATUSES</code>: <code>#col-{status}.column</code> có <code>.column-title</code> <code>To Do (4)</code>.' },
        { en: '<code>TaskCard</code>: <code>#task-{id}.task-card.priority-{priority}</code> with <code>.task-title</code>, <code>.task-assignee</code> and a priority badge; tasks keep data order.', vi: '<code>TaskCard</code>: <code>#task-{id}.task-card.priority-{priority}</code> có <code>.task-title</code>, <code>.task-assignee</code> và badge mức ưu tiên; giữ thứ tự dữ liệu.' },
      ],
      hook: ['props', 'map + key'],
    },
    {
      ten: { en: 'PropTypes & default value', vi: 'PropTypes & giá trị mặc định' }, diem: 1,
      yeuCau: [
        { en: '<code>TaskCard.propTypes</code> and <code>Column.propTypes</code>; <code>priority</code> uses <code>PropTypes.oneOf([\'high\', \'medium\', \'low\'])</code>.', vi: '<code>TaskCard.propTypes</code> và <code>Column.propTypes</code>; <code>priority</code> dùng <code>PropTypes.oneOf([\'high\', \'medium\', \'low\'])</code>.' },
        { en: 'A task without <code>assignee</code> shows <code>Unassigned</code> (default parameter value).', vi: 'Công việc không có <code>assignee</code> hiện <code>Unassigned</code> (giá trị mặc định của tham số).' },
      ],
      hook: ['prop-types'],
    },
    {
      ten: { en: 'Move between columns', vi: 'Chuyển cột' }, diem: 2,
      yeuCau: [
        { en: '<code>.btn-next</code> (→) moves to the next status, <code>.btn-prev</code> (←) to the previous one. No → in Done, no ← in To Do.', vi: '<code>.btn-next</code> (→) chuyển sang trạng thái sau, <code>.btn-prev</code> (←) về trạng thái trước. Cột Done không có →, To Do không có ←.' },
        { en: 'State lives in <code>App</code>; children call a function received via props. Update immutably.', vi: 'State nằm ở <code>App</code>; con gọi hàm nhận qua props. Cập nhật bất biến.' },
      ],
      hook: ['useState', 'lifting state up'],
    },
    {
      ten: { en: 'Add a task', vi: 'Thêm công việc' }, diem: 1.5,
      yeuCau: [
        { en: '<code>#new-task</code> + <code>#new-priority</code> (high/medium/low, default medium) + <code>#btn-add</code> append a task to To Do with id = max + 1.', vi: '<code>#new-task</code> + <code>#new-priority</code> (high/medium/low, mặc định medium) + <code>#btn-add</code> thêm vào cuối To Do với id = max + 1.' },
        { en: 'Trim the title; ignore blank titles; clear the input afterwards.', vi: 'Bỏ khoảng trắng hai đầu; bỏ qua tiêu đề rỗng; xoá ô nhập sau khi thêm.' },
      ],
      hook: ['controlled input'],
    },
    {
      ten: { en: 'Delete a task', vi: 'Xoá công việc' }, diem: 1,
      yeuCau: [{ en: '<code>.btn-delete</code> (✕) removes the task; counts and statistics update.', vi: '<code>.btn-delete</code> (✕) xoá công việc; số đếm và thống kê cập nhật.' }],
    },
    {
      ten: { en: 'Search', vi: 'Tìm kiếm' }, diem: 1,
      yeuCau: [
        { en: '<code>#search</code> filters the cards of every column by title (contains, case-insensitive); column counts show the filtered numbers.', vi: '<code>#search</code> lọc thẻ ở mọi cột theo tiêu đề (chứa, không phân biệt hoa/thường); số đếm cột theo kết quả lọc.' },
        { en: 'Statistics keep counting <b>all</b> tasks.', vi: 'Thống kê vẫn tính <b>mọi</b> công việc.' },
      ],
      viDu: { en: '"the" ⇒ To Do (2) · In Progress (1) · Done (2)', vi: '"the" ⇒ To Do (2) · In Progress (1) · Done (2)' },
    },
    {
      ten: { en: 'Statistics (class component)', vi: 'Thống kê (class component)' }, diem: 1,
      yeuCau: [
        { en: '<code>class TaskStats extends Component</code>: <code>#stats</code> <code>Done: d/n (p%)</code> (rounded).', vi: '<code>class TaskStats extends Component</code>: <code>#stats</code> <code>Done: d/n (p%)</code> (làm tròn).' },
        { en: 'Own state <code>showDetails</code> toggled by <code>#toggle-stats</code> with <code>this.setState</code>; details <code>.stat-high</code> <code>.stat-medium</code> <code>.stat-low</code> (<code>High: 3</code>…).', vi: 'State riêng <code>showDetails</code> bật/tắt bằng <code>#toggle-stats</code> qua <code>this.setState</code>; chi tiết <code>.stat-high</code> <code>.stat-medium</code> <code>.stat-low</code> (<code>High: 3</code>…).' },
      ],
      hook: ['class component', 'this.setState'],
    },
    {
      ten: { en: 'Panel with children', vi: 'Panel bọc children' }, diem: 1,
      yeuCau: [
        { en: '<code>Panel</code> renders <code>section.panel</code> → <code>h2.panel-title</code> + <code>children</code>; App wraps the board ("Board") and the statistics ("Statistics").', vi: '<code>Panel</code> vẽ <code>section.panel</code> → <code>h2.panel-title</code> + <code>children</code>; App bọc bảng ("Board") và thống kê ("Statistics").' },
      ],
      hook: ['props.children'],
    },
  ],
  idBatBuoc: [
    ['#search · #new-task · #new-priority · #btn-add', { en: 'toolbar', vi: 'thanh công cụ' }],
    ['.board · #col-{status}.column · .column-title', { en: 'board and columns', vi: 'bảng và cột' }],
    ['#task-{id}.task-card.priority-{p} · .task-title · .task-assignee · .btn-prev · .btn-next · .btn-delete', { en: 'task card', vi: 'thẻ công việc' }],
    ['#stats · #toggle-stats · .stat-high · .stat-medium · .stat-low', { en: 'statistics', vi: 'thống kê' }],
    ['.panel · .panel-title', { en: 'wrapper', vi: 'khung bọc' }],
  ],
  truDiem: [
    { en: 'Each Column keeps its own copy of the tasks in state — moving between columns becomes impossible.', vi: 'Mỗi Column giữ bản sao tasks trong state riêng — không chuyển cột được.' },
    { en: '<code>task.status = next; setTasks(tasks)</code> — same array reference, no re-render.', vi: '<code>task.status = next; setTasks(tasks)</code> — cùng tham chiếu mảng, không vẽ lại.' },
    { en: 'Using the index as <code>key</code> — cards jump after delete/move.', vi: 'Dùng index làm <code>key</code> — thẻ nhảy lung tung sau khi xoá/chuyển.' },
    { en: 'Assigning <code>this.state.showDetails = …</code> in the class component.', vi: 'Gán <code>this.state.showDetails = …</code> trong class component.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-5-lab-task-board',
  ten: 'Lab 5 — Kanban Task Board (components, props, state)',
  khoa: KHOA,
  baiHoc: 'fer202-5-1-components-props',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 5 — Kanban Task Board (components · props · state · PropTypes)', vi: 'Lab 5 — Bảng Kanban (component · props · state · PropTypes)' },
      doKho: 'HARD',
      phut: 100,
      diem: 100,
      khaiNiem: ['component composition', 'props', 'lifting state up', 'immutable update', 'PropTypes', 'class component', 'children'],
      tienQuyet: ['JSX', 'map / filter', 'useState'],
      the: ['fer202', 'lab', 'components', 'props', 'state'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'lifting state up', vi: 'nâng state lên component cha chung' },
        { en: 'presentational component', vi: 'component chỉ hiển thị (nhận props, không giữ dữ liệu)' },
        { en: 'single source of truth', vi: 'một nguồn sự thật duy nhất' },
        { en: 'class component', vi: 'component viết bằng class (render, this.state, this.setState)' },
        { en: 'composition / children', vi: 'ghép component; nội dung lồng bên trong thẻ' },
        ...tn('component', 'props', 'state', 'key', 'immutable', 'mutate', 'derived', 'rubric'),
      ],
      goiY: [
        'Vẽ cây trước: App (state) → Panel → Board → Column → TaskCard. Dữ liệu đi xuống bằng props, sự kiện đi lên bằng hàm truyền xuống (onMove, onDelete).',
        'Board không cần state: tasks.filter(t => t.status === s.id) cho từng cột ngay khi render.',
        'Chuyển cột: ORDER = ["todo","doing","done"]; trạng thái mới = ORDER[ORDER.indexOf(t.status) + dir]; setTasks(list => list.map(…)).',
        'Class component: state = { showDetails: false }; toggle = () => this.setState(p => ({ showDetails: !p.showDetails })); render() đọc this.props.tasks.',
      ],
      loiHayGap: [
        'Mỗi <code>Column</code> có <code>useState(tasks)</code> riêng — dữ liệu bị nhân bản, chuyển cột không cập nhật cột kia.',
        'Sửa trực tiếp <code>task.status = …</code> rồi <code>setTasks(tasks)</code> — React so tham chiếu, thấy "không đổi", không vẽ lại.',
        'Quên <code>key</code> hoặc dùng index — cảnh báo key và thẻ lẫn sau khi xoá.',
        'Class component quên <code>this</code> (<code>props.tasks</code>, <code>setState(…)</code>) hoặc dùng method thường làm onClick mà không bind ⇒ <code>this</code> undefined.',
        'Đếm số thẻ của cột bằng biến toàn cục / state riêng thay vì <code>tasks.length</code> của props.',
      ],
      moTaNgan: 'Lab chương 5 dạng đề trường: bảng Kanban 8 chức năng — tách component, props, nâng state, PropTypes, class component, children. Thang 10, có demo.',
      giaiThich: '<p><code>App</code> là nguồn sự thật duy nhất (<code>tasks</code>, <code>search</code>); mọi component dưới chỉ nhận props và gọi hàm của cha. Danh sách đang hiện và số đếm từng cột là giá trị <em>suy ra</em> khi render, nên thêm/xoá/chuyển/tìm luôn đồng bộ. Mọi cập nhật tạo mảng mới (<code>map</code>/<code>filter</code>/spread). <code>TaskCard</code> dùng giá trị mặc định của tham số cho <code>assignee</code> và khai <code>propTypes</code>; <code>TaskStats</code> là class component với state riêng đổi bằng <code>this.setState</code>; <code>Panel</code> minh hoạ composition bằng <code>children</code>.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['prop-types'], kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/learn/sharing-state-between-components',
    },
  ],
});

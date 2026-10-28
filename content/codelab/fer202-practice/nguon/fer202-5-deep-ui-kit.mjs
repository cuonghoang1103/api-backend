/**
 * FER202 · Chương 5 — DEEP LAB: mini UI Kit (component tái sử dụng chuyên sâu).
 * Sâu hơn Lab 5: thiết kế API của component — props + children + ...rest, component điều khiển (value/onChange),
 * bảng theo cấu hình cột (render prop theo cột), sắp xếp có aria-sort, Accordion vừa controlled vừa uncontrolled,
 * class component với setState dạng hàm, PropTypes đầy đủ.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const phim = (selector, p) => ({ hanhDong: 'phim', selector, phim: p });

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #f8fafc; color: #0f172a; }
section { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
.btn { border: 0; border-radius: 6px; padding: 6px 14px; cursor: pointer; font: inherit; }
.btn-primary { background: #2563eb; color: #fff; } .btn-danger { background: #dc2626; color: #fff; } .btn-ghost { background: transparent; color: #2563eb; }
.btn-sm { padding: 3px 10px; font-size: 13px; } .btn:disabled { opacity: .5; cursor: not-allowed; }
.rating { display: inline-flex; gap: 2px; } .star { border: 0; background: none; font-size: 22px; color: #cbd5e1; cursor: pointer; } .star.on { color: #f59e0b; }
table { border-collapse: collapse; width: 100%; } th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e2e8f0; } th button { all: unset; cursor: pointer; font-weight: 600; }
.align-right { text-align: right; }
.acc-item { border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 6px; } .acc-header { width: 100%; text-align: left; padding: 8px 12px; border: 0; background: #f1f5f9; cursor: pointer; } .acc-panel { padding: 8px 12px; }
.stepper { display: inline-flex; align-items: center; gap: 8px; }
`;

const DATA = `// src/data/products.js (đã cho)
export const PRODUCTS = [
  { id: 1, name: 'Keyboard', price: 590000, rating: 4 },
  { id: 2, name: 'Monitor', price: 3290000, rating: 5 },
  { id: 3, name: 'Mouse', price: 250000, rating: 3 },
  { id: 4, name: 'Headset', price: 890000, rating: 4 },
];
`;

const BUTTON = `// src/kit/Button.js — props + children + ...rest; className ghép, type mặc định "button"
import PropTypes from 'prop-types';

export default function Button({ variant = 'primary', size, className = '', children, type = 'button', ...rest }) {
  const classes = ['btn', ´btn-@{variant}´, size === 'sm' ? 'btn-sm' : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.node.isRequired,
};
`;

const RATING = `// src/kit/Rating.js — component ĐIỀU KHIỂN: không tự giữ giá trị, cha truyền value + onChange
import PropTypes from 'prop-types';

export default function Rating({ value, max = 5, onChange, readOnly = false, label = 'Rating' }) {
  const set = (v) => {
    if (!readOnly && onChange) onChange(Math.min(max, Math.max(1, v)));
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') set(value + 1);
    if (e.key === 'ArrowLeft') set(value - 1);
  };
  return (
    <div className="rating" role="radiogroup" aria-label={label} tabIndex={readOnly ? -1 : 0} onKeyDown={onKeyDown}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'star on' : 'star'}
          aria-label={´@{n} star@{n > 1 ? 's' : ''}´}
          aria-checked={n === value}
          role="radio"
          disabled={readOnly}
          onClick={() => set(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
};
`;

const TABLE = `// src/kit/DataTable.js — bảng theo CẤU HÌNH CỘT; cột có thể tự vẽ ô bằng render(row); sắp xếp theo cột
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function DataTable({ columns, rows, rowKey = 'id', emptyMessage = 'No data' }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  const sorted = sort.key
    ? [...rows].sort((a, b) => {
        const x = a[sort.key];
        const y = b[sort.key];
        const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
        return sort.dir === 'asc' ? c : -c;
      })
    : rows;

  if (rows.length === 0) return <p className="empty">{emptyMessage}</p>;

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => {
            const ariaSort = sort.key === col.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';
            return (
              <th key={col.key} className={col.align === 'right' ? 'align-right' : undefined} aria-sort={col.sortable ? ariaSort : undefined}>
                {col.sortable ? <button type="button" onClick={() => toggleSort(col.key)}>{col.header}</button> : col.header}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row[rowKey]}>
            {columns.map((col) => (
              <td key={col.key} className={col.align === 'right' ? 'align-right' : undefined}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node.isRequired,
      render: PropTypes.func,
      align: PropTypes.oneOf(['left', 'right']),
      sortable: PropTypes.bool,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowKey: PropTypes.string,
  emptyMessage: PropTypes.node,
};
`;

const ACCORDION = `// src/kit/Accordion.js — vừa UNCONTROLLED (defaultOpenIndex) vừa CONTROLLED (openIndex + onToggle)
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function Accordion({ items, defaultOpenIndex = null, openIndex, onToggle }) {
  const [inner, setInner] = useState(defaultOpenIndex);
  const isControlled = openIndex !== undefined;
  const open = isControlled ? openIndex : inner;

  const toggle = (i) => {
    const next = open === i ? null : i;
    if (!isControlled) setInner(next);
    if (onToggle) onToggle(next);
  };

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={item.title} className="acc-item">
          <button type="button" className="acc-header" aria-expanded={open === i} onClick={() => toggle(i)}>{item.title}</button>
          {open === i && <div className="acc-panel">{item.content}</div>}
        </div>
      ))}
    </div>
  );
}

Accordion.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, content: PropTypes.node.isRequired })).isRequired,
  defaultOpenIndex: PropTypes.number,
  openIndex: PropTypes.number,
  onToggle: PropTypes.func,
};
`;

const STEPPER = `// src/kit/Stepper.js — CLASS component: state riêng + setState dạng hàm; báo cha qua onChange
import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Stepper extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    initial: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = { min: 0, max: 10, initial: 0 };

  constructor(props) {
    super(props);
    this.state = { value: props.initial };
  }

  change(delta) {
    this.setState(
      (prev) => ({ value: Math.min(this.props.max, Math.max(this.props.min, prev.value + delta)) }),
      () => this.props.onChange && this.props.onChange(this.state.value),
    );
  }

  render() {
    const { min, max } = this.props;
    const { value } = this.state;
    return (
      <div className="stepper">
        <button type="button" className="step-dec" disabled={value <= min} onClick={() => this.change(-1)}>−</button>
        <output className="step-value">{value}</output>
        <button type="button" className="step-inc" disabled={value >= max} onClick={() => this.change(1)}>+</button>
      </div>
    );
  }
}
`;

const APP = `// src/App.js — trang trình diễn: dùng bộ kit để dựng màn hình sản phẩm
import { useState } from 'react';
import Button from './kit/Button';
import Rating from './kit/Rating';
import DataTable from './kit/DataTable';
import Accordion from './kit/Accordion';
import Stepper from './kit/Stepper';
import { PRODUCTS } from './data/products';

const vnd = (n) => n.toLocaleString('en-US') + ' ₫';
const FAQ = [
  { title: 'Shipping', content: 'Free shipping over 500,000 ₫.' },
  { title: 'Returns', content: '30 days, no questions asked.' },
  { title: 'Warranty', content: '12 months for all hardware.' },
];

export default function App() {
  const [myRating, setMyRating] = useState(3);
  const [faqOpen, setFaqOpen] = useState(0);
  const [qty, setQty] = useState(1);
  const [clicks, setClicks] = useState(0);

  const columns = [
    { key: 'name', header: 'Product', sortable: true },
    { key: 'price', header: 'Price', align: 'right', sortable: true, render: (p) => vnd(p.price) },
    { key: 'rating', header: 'Rating', render: (p) => <Rating value={p.rating} readOnly label={´@{p.name} rating´} /> },
  ];

  return (
    <main>
      <section id="buttons">
        <Button id="btn-save" onClick={() => setClicks((c) => c + 1)}>Save</Button>{' '}
        <Button id="btn-delete" variant="danger" size="sm" className="ms-2" aria-label="Delete item">Delete</Button>{' '}
        <Button id="btn-disabled" variant="ghost" disabled>Disabled</Button>
        <p id="clicks">Saved {clicks} times</p>
      </section>

      <section id="my-rating">
        <Rating value={myRating} onChange={setMyRating} label="Your rating" />
        <p id="rating-text">You rated {myRating}/5</p>
      </section>

      <section id="products">
        <DataTable columns={columns} rows={PRODUCTS} />
      </section>

      <section id="empty-table">
        <DataTable columns={columns} rows={[]} emptyMessage="No products match your search" />
      </section>

      <section id="faq-uncontrolled">
        <Accordion items={FAQ} defaultOpenIndex={1} />
      </section>

      <section id="faq-controlled">
        <Accordion items={FAQ} openIndex={faqOpen} onToggle={setFaqOpen} />
        <p id="faq-state">Open: {faqOpen === null ? 'none' : FAQ[faqOpen].title}</p>
        <Button id="close-all" variant="ghost" onClick={() => setFaqOpen(null)}>Close all</Button>
      </section>

      <section id="qty">
        <Stepper min={1} max={5} initial={1} onChange={setQty} />
        <p id="qty-text">Quantity: {qty}</p>
      </section>
    </main>
  );
}
`;

const S_APP = `// src/App.js — STARTER: các phần tử viết tay lặp đi lặp lại; hãy thay bằng component trong src/kit
export default function App() {
  return (
    <main>
      <section id="buttons">
        <button id="btn-save" className="btn btn-primary">Save</button>
      </section>
    </main>
  );
}
`;
const stub = (ten, mo) => `// src/kit/${ten}.js — STARTER
// ${mo}
export default function ${ten}() {
  return null;
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data/products.js': DATA };
const LOI_GIAI = {
  'src/App.js': APP, 'src/kit/Button.js': BUTTON, 'src/kit/Rating.js': RATING, 'src/kit/DataTable.js': TABLE,
  'src/kit/Accordion.js': ACCORDION, 'src/kit/Stepper.js': STEPPER, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/kit/Button.js': stub('Button', 'button.btn.btn-<variant> (+ btn-sm, + className), type mặc định "button", ...rest'),
  'src/kit/Rating.js': stub('Rating', 'controlled: value + onChange; .star.on; ArrowLeft/ArrowRight; readOnly'),
  'src/kit/DataTable.js': stub('DataTable', 'columns [{ key, header, render?, align?, sortable? }], rows, emptyMessage; sort + aria-sort'),
  'src/kit/Accordion.js': stub('Accordion', 'items; uncontrolled defaultOpenIndex / controlled openIndex + onToggle'),
  'src/kit/Stepper.js': `// src/kit/Stepper.js — STARTER: viết thành CLASS component
export default function Stepper() {
  return null;
}
`,
  ...CHUNG,
};

const P = '#products';
const KIEM = [
  // f1 Button
  { nhom: 'f1', moTa: 'Variant, size and extra className merged', kiem: 'thuoc-tinh', selector: '#btn-delete', thuocTinh: 'class', giaTri: 'btn btn-danger btn-sm ms-2' },
  { nhom: 'f1', moTa: 'Default type="button" and default variant', kiem: 'danh-sach-text', selector: 'button#btn-save.btn.btn-primary[type="button"]', mongDoi: ['Save'] },
  { nhom: 'f1', moTa: 'Other props pass through (...rest): onClick, disabled, aria-label', kiem: 'danh-sach-text', selector: '#clicks, #btn-disabled:disabled, #btn-delete[aria-label="Delete item"]', mongDoi: ['Delete', 'Disabled', 'Saved 2 times'], truoc: [click('#btn-save', 2)] },
  // f2 Rating
  { nhom: 'f2', moTa: 'Clicking a star sets the value (controlled)', kiem: 'danh-sach-text', selector: '#my-rating .star.on, #rating-text', mongDoi: ['★', '★', '★', '★', 'You rated 4/5'], truoc: [click('#my-rating .star:nth-child(4)')] },
  { nhom: 'f2', moTa: 'Arrow keys change the rating within 1..5', kiem: 'text', selector: '#rating-text', giaTri: 'You rated 5/5', truoc: [phim('#my-rating .rating', 'ArrowRight'), phim('#my-rating .rating', 'ArrowRight'), phim('#my-rating .rating', 'ArrowRight')] },
  { nhom: 'f2', moTa: 'Read-only ratings are disabled', kiem: 'so-luong', selector: `${P} .star:disabled`, giaTri: 20 },
  { nhom: 'f2', an: true, moTa: 'ArrowLeft never goes below 1', kiem: 'text', selector: '#rating-text', giaTri: 'You rated 1/5', truoc: [phim('#my-rating .rating', 'ArrowLeft'), phim('#my-rating .rating', 'ArrowLeft'), phim('#my-rating .rating', 'ArrowLeft')] },
  { nhom: 'f2', an: true, moTa: 'Rating keeps no internal value state', kiem: 'ma-nguon', tep: 'src/kit/Rating.js', khop: 'useState', phuDinh: true },
  // f3 DataTable config
  { nhom: 'f3', moTa: 'Headers from column config', kiem: 'danh-sach-text', selector: `${P} thead th`, mongDoi: ['Product', 'Price', 'Rating'] },
  { nhom: 'f3', moTa: 'Custom render per column', kiem: 'danh-sach-text', selector: `${P} tbody td:nth-child(2)`, mongDoi: ['590,000 ₫', '3,290,000 ₫', '250,000 ₫', '890,000 ₫'] },
  { nhom: 'f3', moTa: 'Right-aligned column', kiem: 'so-luong', selector: `${P} td.align-right`, giaTri: 4 },
  { nhom: 'f3', moTa: 'Empty rows ⇒ emptyMessage', kiem: 'text', selector: '#empty-table .empty', giaTri: 'No products match your search' },
  { nhom: 'f3', an: true, moTa: 'Rendered stars inside table cells', kiem: 'so-luong', selector: `${P} td .rating`, giaTri: 4 },
  // f4 sorting
  { nhom: 'f4', moTa: 'Sort by product name ascending', kiem: 'danh-sach-text', selector: `${P} tbody td:first-child`, mongDoi: ['Headset', 'Keyboard', 'Monitor', 'Mouse'], truoc: [click(`${P} th:nth-child(1) button`)] },
  { nhom: 'f4', moTa: 'Second click sorts descending (numeric for price)', kiem: 'danh-sach-text', selector: `${P} tbody td:first-child`, mongDoi: ['Monitor', 'Headset', 'Keyboard', 'Mouse'], truoc: [click(`${P} th:nth-child(2) button`), click(`${P} th:nth-child(2) button`)] },
  { nhom: 'f4', moTa: 'aria-sort reflects the state', kiem: 'thuoc-tinh', selector: `${P} th:nth-child(2)`, thuocTinh: 'aria-sort', giaTri: 'ascending', truoc: [click(`${P} th:nth-child(2) button`)] },
  { nhom: 'f4', an: true, moTa: 'Original rows array not mutated (sort a copy)', kiem: 'ma-nguon', tep: 'src/kit/DataTable.js', khop: '\\[\\s*\\.\\.\\.\\s*rows\\s*\\]\\s*\\.sort\\(' },
  // f5 Accordion
  { nhom: 'f5', moTa: 'Uncontrolled: starts with defaultOpenIndex', kiem: 'danh-sach-text', selector: '#faq-uncontrolled .acc-panel', mongDoi: ['30 days, no questions asked.'] },
  { nhom: 'f5', moTa: 'Uncontrolled: one open at a time, toggles closed', kiem: 'so-luong', selector: '#faq-uncontrolled .acc-panel', giaTri: 0, truoc: [click('#faq-uncontrolled .acc-item:nth-child(2) .acc-header')] },
  { nhom: 'f5', moTa: 'Controlled: parent state follows', kiem: 'danh-sach-text', selector: '#faq-controlled .acc-panel, #faq-state', mongDoi: ['12 months for all hardware.', 'Open: Warranty'], truoc: [click('#faq-controlled .acc-item:nth-child(3) .acc-header')] },
  { nhom: 'f5', an: true, moTa: 'Controlled: parent can close everything', kiem: 'danh-sach-text', selector: '#faq-controlled .acc-panel, #faq-state', mongDoi: ['Open: none'], truoc: [click('#close-all')] },
  { nhom: 'f5', an: true, moTa: 'aria-expanded on headers', kiem: 'thuoc-tinh', selector: '#faq-uncontrolled .acc-item:nth-child(2) .acc-header', thuocTinh: 'aria-expanded', giaTri: 'true' },
  // f6 class Stepper
  { nhom: 'f6', moTa: 'Stepper clamps between min and max', kiem: 'danh-sach-text', selector: '#qty .step-value, #qty-text', mongDoi: ['5', 'Quantity: 5'], truoc: [click('#qty .step-inc', 7)] },
  { nhom: 'f6', moTa: 'Buttons disabled at the limits', kiem: 'thuoc-tinh-js', selector: '#qty .step-dec', thuocTinh: 'disabled', giaTri: true },
  { nhom: 'f6', moTa: 'Stepper is a class with functional setState', kiem: 'ma-nguon', tep: 'src/kit/Stepper.js', khop: 'class\\s+Stepper\\s+extends\\s+(React\\.)?Component[\\s\\S]*this\\.setState\\(\\s*\\(\\s*prev' },
  // f7 PropTypes
  { nhom: 'f7', moTa: 'Button declares PropTypes', kiem: 'ma-nguon', tep: 'src/kit/Button.js', khop: 'Button\\.propTypes\\s*=' },
  { nhom: 'f7', an: true, moTa: 'Rating declares PropTypes', kiem: 'ma-nguon', tep: 'src/kit/Rating.js', khop: 'Rating\\.propTypes\\s*=' },
  { nhom: 'f7', an: true, moTa: 'Accordion declares PropTypes', kiem: 'ma-nguon', tep: 'src/kit/Accordion.js', khop: 'Accordion\\.propTypes\\s*=' },
  { nhom: 'f7', an: true, moTa: 'Stepper declares PropTypes', kiem: 'ma-nguon', tep: 'src/kit/Stepper.js', khop: 'propTypes\\s*=\\s*\\{' },
  { nhom: 'f7', moTa: 'Column shape described with PropTypes.shape', kiem: 'ma-nguon', tep: 'src/kit/DataTable.js', khop: 'PropTypes\\.arrayOf\\(\\s*PropTypes\\.shape\\(' },
  { nhom: 'f7', an: true, moTa: 'Enumerated variants use oneOf', kiem: 'ma-nguon', tep: 'src/kit/Button.js', khop: 'PropTypes\\.oneOf\\(' },
  // f8 composition
  { nhom: 'f8', moTa: 'App builds the page only from kit components', kiem: 'ma-nguon', tep: 'src/App.js', khop: '^(?=[\\s\\S]*<DataTable)(?=[\\s\\S]*<Rating)(?=[\\s\\S]*<Accordion)(?=[\\s\\S]*<Stepper)(?![\\s\\S]*className="btn)' },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 5: mini UI Kit — designing reusable component APIs', vi: 'DEEP LAB 5: Bộ UI Kit mini — thiết kế API cho component dùng lại' },
  phu: { en: 'FER202 · Chapter 5 (deep) · Suggested time: 120 minutes · Total: 10 marks', vi: 'FER202 · Chương 5 (chuyên sâu) · Thời gian gợi ý: 120 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Writing a component is easy; designing one that other people can reuse is the real skill. Build five kit components in <code>src/kit/</code> — <b>Button</b>, <b>Rating</b>, <b>DataTable</b>, <b>Accordion</b> and a class-based <b>Stepper</b> — and a demo page that uses only them. You will practise: passing unknown props through, controlled components, configuration-driven rendering with per-column render functions, internal sorting state, supporting both controlled and uncontrolled modes, and documenting the API with PropTypes.</p>',
    vi: '<p>Viết một component thì dễ; thiết kế component người khác dùng lại được mới là kỹ năng thật. Dựng năm component trong <code>src/kit/</code> — <b>Button</b>, <b>Rating</b>, <b>DataTable</b>, <b>Accordion</b> và <b>Stepper</b> dạng class — cùng trang trình diễn chỉ dùng chúng. Bạn sẽ luyện: chuyển tiếp props lạ, component điều khiển, vẽ theo cấu hình với hàm render từng cột, state sắp xếp nội bộ, hỗ trợ cả hai chế độ controlled/uncontrolled, và mô tả API bằng PropTypes.</p>',
  },
  chucNangChinh: [{ en: 'Button · Rating · DataTable (config + sort) · Accordion (controlled/uncontrolled) · Stepper (class) · PropTypes · demo page.', vi: 'Button · Rating · DataTable (cấu hình + sắp xếp) · Accordion (controlled/uncontrolled) · Stepper (class) · PropTypes · trang trình diễn.' }],
  yeuCauChung: [
    { en: 'One component per file in <code>src/kit/</code>, default export, PropTypes on each (install <code>prop-types</code>).', vi: 'Mỗi component một tệp trong <code>src/kit/</code>, export default, có PropTypes (cài <code>prop-types</code>).' },
    { en: '<code>App.js</code> must not contain raw <code>&lt;button&gt;</code> elements — only kit components.', vi: '<code>App.js</code> không chứa thẻ <code>&lt;button&gt;</code> thô — chỉ dùng component trong kit.' },
  ],
  cayThuMuc: `
src/
├── kit/
│   ├── Button.js       # variant · size · className · ...rest
│   ├── Rating.js       # controlled (value, onChange), keyboard, readOnly
│   ├── DataTable.js    # columns config, render per column, sort, emptyMessage
│   ├── Accordion.js    # defaultOpenIndex | openIndex + onToggle
│   └── Stepper.js      # class component
├── data/products.js    # (given)
├── App.js              # demo page (sections with ids below)
└── index.css (given)`,
  wireframe: `
#buttons     [Save] [Delete] [Disabled]        Saved 0 times
#my-rating   ★★★☆☆  You rated 3/5
#products    Product ▲ | Price ▲        | Rating
             Keyboard  |   590,000 ₫    | ★★★★☆ …
#empty-table No products match your search
#faq-…       ▸ Shipping  ▾ Returns  (30 days…)  ▸ Warranty
#qty         [−] 1 [+]   Quantity: 1`,
  moHinh: {
    ten: 'Component APIs',
    truong: [
      ['Button', "{ variant: 'primary'|'danger'|'ghost', size?: 'sm', className?, type='button', children, ...rest }", ''],
      ['Rating', '{ value, max=5, onChange?, readOnly?, label? }', { en: 'controlled', vi: 'điều khiển' }],
      ['DataTable', '{ columns: [{ key, header, render?, align?, sortable? }], rows, rowKey="id", emptyMessage }', ''],
      ['Accordion', '{ items: [{ title, content }], defaultOpenIndex? | openIndex + onToggle }', { en: 'controlled when openIndex !== undefined', vi: 'controlled khi openIndex !== undefined' }],
      ['Stepper (class)', '{ min=0, max=10, initial=0, onChange? }', ''],
    ],
  },
  chucNang: [
    { ten: { en: 'Button: props pass-through', vi: 'Button: chuyển tiếp props' }, diem: 1, yeuCau: [{ en: '<code>btn btn-&lt;variant&gt;</code> (+ <code>btn-sm</code>, + caller <code>className</code>), <code>type="button"</code> by default, every other prop (<code>id</code>, <code>onClick</code>, <code>disabled</code>, <code>aria-*</code>) spread onto the element.', vi: '<code>btn btn-&lt;variant&gt;</code> (+ <code>btn-sm</code>, + <code>className</code> của nơi dùng), mặc định <code>type="button"</code>, mọi prop khác (<code>id</code>, <code>onClick</code>, <code>disabled</code>, <code>aria-*</code>) trải lên phần tử.' }], viDu: { en: '<Button variant="danger" size="sm" className="ms-2"> ⇒ class "btn btn-danger btn-sm ms-2"', vi: '<Button variant="danger" size="sm" className="ms-2"> ⇒ class "btn btn-danger btn-sm ms-2"' } },
    { ten: { en: 'Rating: controlled component', vi: 'Rating: component điều khiển' }, diem: 1.5, yeuCau: [{ en: 'No internal value state: stars <code>.star</code> (<code>.on</code> when ≤ value) call <code>onChange(n)</code>; ArrowLeft/ArrowRight on <code>.rating</code> change by 1 within 1..max; <code>readOnly</code> disables the stars.', vi: 'Không giữ state giá trị: các sao <code>.star</code> (<code>.on</code> khi ≤ value) gọi <code>onChange(n)</code>; ArrowLeft/ArrowRight trên <code>.rating</code> đổi 1 trong khoảng 1..max; <code>readOnly</code> vô hiệu các sao.' }] },
    { ten: { en: 'DataTable: configuration-driven', vi: 'DataTable: vẽ theo cấu hình' }, diem: 2, yeuCau: [{ en: 'Headers and cells from <code>columns</code>; a column\'s <code>render(row)</code> decides its cell (price formatting, a read-only Rating); <code>align: \'right\'</code> ⇒ <code>.align-right</code>; empty rows ⇒ <code>p.empty</code> with <code>emptyMessage</code>.', vi: 'Tiêu đề và ô lấy từ <code>columns</code>; <code>render(row)</code> của cột quyết định ô (định dạng giá, Rating chỉ đọc); <code>align: \'right\'</code> ⇒ <code>.align-right</code>; không có dòng ⇒ <code>p.empty</code> với <code>emptyMessage</code>.' }] },
    { ten: { en: 'DataTable: sorting', vi: 'DataTable: sắp xếp' }, diem: 1.5, yeuCau: [{ en: 'Sortable headers are buttons; first click ascending, second descending; numbers compare numerically, text with <code>localeCompare</code>; <code>aria-sort</code> on the <code>th</code>; sort a copy.', vi: 'Tiêu đề sắp xếp được là nút; lần đầu tăng dần, lần hai giảm dần; số so theo số, chữ bằng <code>localeCompare</code>; <code>aria-sort</code> trên <code>th</code>; sắp xếp bản sao.' }] },
    { ten: { en: 'Accordion: controlled & uncontrolled', vi: 'Accordion: controlled & uncontrolled' }, diem: 1.5, yeuCau: [{ en: 'One panel open at a time; clicking the open header closes it. Without <code>openIndex</code> it keeps its own state from <code>defaultOpenIndex</code>; with <code>openIndex</code> it only reports via <code>onToggle(nextIndex | null)</code>. Headers carry <code>aria-expanded</code>.', vi: 'Mỗi lúc mở một mục; bấm tiêu đề đang mở thì đóng. Không có <code>openIndex</code> thì tự giữ state từ <code>defaultOpenIndex</code>; có <code>openIndex</code> thì chỉ báo qua <code>onToggle(chỉ số kế | null)</code>. Tiêu đề có <code>aria-expanded</code>.' }] },
    { ten: { en: 'Stepper: class component', vi: 'Stepper: class component' }, diem: 1, yeuCau: [{ en: '<code>class Stepper extends Component</code>, <code>this.state.value</code>, functional <code>setState(prev =&gt; …)</code>, clamped to [min, max], buttons <code>.step-dec</code>/<code>.step-inc</code> disabled at the limits, <code>onChange</code> after the update.', vi: '<code>class Stepper extends Component</code>, <code>this.state.value</code>, <code>setState(prev =&gt; …)</code> dạng hàm, kẹp trong [min, max], nút <code>.step-dec</code>/<code>.step-inc</code> vô hiệu ở biên, gọi <code>onChange</code> sau khi cập nhật.' }] },
    { ten: { en: 'PropTypes', vi: 'PropTypes' }, diem: 1, yeuCau: [{ en: 'Every kit component declares PropTypes; variants with <code>oneOf</code>, columns with <code>arrayOf(shape(…))</code>; defaults via default parameters (or <code>defaultProps</code> for the class).', vi: 'Mọi component kit khai PropTypes; biến thể dùng <code>oneOf</code>, cột dùng <code>arrayOf(shape(…))</code>; mặc định bằng tham số mặc định (hoặc <code>defaultProps</code> cho class).' }] },
    { ten: { en: 'Demo page composition', vi: 'Trang trình diễn' }, diem: 0.5, yeuCau: [{ en: 'Sections <code>#buttons #my-rating #products #empty-table #faq-uncontrolled #faq-controlled #qty</code>, built only from kit components.', vi: 'Các phần <code>#buttons #my-rating #products #empty-table #faq-uncontrolled #faq-controlled #qty</code>, chỉ dựng từ component kit.' }] },
  ],
  idBatBuoc: [
    ['#btn-save · #btn-delete · #btn-disabled · #clicks', { en: 'Button demo', vi: 'Button' }],
    ['.rating · .star(.on) · #rating-text', { en: 'Rating', vi: 'Rating' }],
    ['.data-table · th[aria-sort] · td.align-right · p.empty', { en: 'DataTable', vi: 'DataTable' }],
    ['.acc-item · .acc-header[aria-expanded] · .acc-panel · #faq-state · #close-all', { en: 'Accordion', vi: 'Accordion' }],
    ['.step-dec · .step-value · .step-inc · #qty-text', { en: 'Stepper', vi: 'Stepper' }],
  ],
  truDiem: [
    { en: 'Rating copies <code>value</code> into its own <code>useState</code> — parent and child disagree after the first change.', vi: 'Rating chép <code>value</code> vào <code>useState</code> riêng — cha và con lệch nhau sau lần đổi đầu.' },
    { en: 'Button that drops unknown props — callers cannot add <code>id</code>, <code>aria-label</code> or <code>disabled</code>.', vi: 'Button bỏ mất props lạ — nơi dùng không thêm được <code>id</code>, <code>aria-label</code> hay <code>disabled</code>.' },
    { en: '<code>rows.sort(…)</code> in render — mutates the parent\'s data.', vi: '<code>rows.sort(…)</code> lúc render — sửa dữ liệu của cha.' },
    { en: 'Accordion that ignores <code>openIndex</code> when given (a "controlled" prop that does nothing).', vi: 'Accordion bỏ qua <code>openIndex</code> khi được truyền (prop "controlled" vô tác dụng).' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-5-deep-ui-kit',
  ten: 'Deep Lab 5 — mini UI Kit (reusable component APIs)',
  khoa: KHOA,
  baiHoc: 'fer202-5-1-components-props',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 5 — mini UI Kit (Button · Rating · DataTable · Accordion · class Stepper)', vi: 'Deep Lab 5 — Bộ UI Kit mini (Button · Rating · DataTable · Accordion · Stepper dạng class)' },
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      khaiNiem: ['props pass-through (...rest)', 'controlled components', 'configuration-driven rendering', 'render functions per column', 'controlled vs uncontrolled', 'class components', 'PropTypes'],
      tienQuyet: ['Lab 5 — Task Board', 'Exercise 19 — PropTypes'],
      the: ['fer202', 'deep-lab', 'components', 'proptypes'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'component API', vi: 'bộ props mà component nhận — "hợp đồng" với nơi dùng' },
        { en: 'controlled / uncontrolled', vi: 'giá trị do cha giữ / do chính component giữ' },
        { en: 'rest props', vi: 'các props còn lại được gom bằng ...rest để chuyển tiếp' },
        { en: 'aria-sort / aria-expanded', vi: 'thuộc tính trợ năng báo trạng thái sắp xếp / mở rộng' },
        ...tn('rubric'),
      ],
      goiY: [
        'Button: function Button({ variant = "primary", size, className = "", type = "button", children, ...rest }) — ghép class bằng mảng + filter(Boolean).join(" ").',
        'Rating không có useState: vẽ từ value, gọi onChange(n). Bàn phím: onKeyDown trên khung .rating.',
        'Accordion: const isControlled = openIndex !== undefined; const open = isControlled ? openIndex : inner;',
        'DataTable sắp xếp: [...rows].sort(...) với state { key, dir }; aria-sort = "ascending" | "descending" | "none".',
      ],
      loiHayGap: [
        'Trải <code>{...props}</code> TRƯỚC <code>className</code> ⇒ className của nơi dùng bị ghi đè hoặc ngược lại — chọn thứ tự có chủ đích.',
        'Quên <code>type="button"</code> ⇒ nút trong form thành nút submit.',
        'Class component dùng <code>this.state.value + 1</code> ngoài setState dạng hàm ⇒ bấm nhanh bị mất bước.',
        'Dùng index làm key cho dòng bảng có sắp xếp ⇒ state trong ô đi lạc.',
      ],
      moTaNgan: 'Deep lab chương 5: bộ UI kit — Button chuyển tiếp props, Rating điều khiển + bàn phím, DataTable theo cấu hình cột + sắp xếp + aria-sort, Accordion controlled/uncontrolled, Stepper dạng class, PropTypes. Thang 10.',
      giaiThich: '<p>Mỗi component là một <b>hợp đồng</b>: Button nhận vài props có nghĩa và trải phần còn lại lên thẻ thật nên dùng được mọi nơi; Rating không tự giữ giá trị nên cha luôn là nguồn sự thật; DataTable nhận <b>dữ liệu mô tả</b> (cấu hình cột) và hàm <code>render</code> để nơi dùng quyết định ô; Accordion hỗ trợ cả hai chế độ bằng cách kiểm <code>openIndex !== undefined</code> — đúng cách các thư viện như React-Bootstrap làm (<code>activeKey</code> / <code>defaultActiveKey</code>). PropTypes ghi lại hợp đồng đó và cảnh báo khi bị dùng sai.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['prop-types'], kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components',
    },
  ],
});

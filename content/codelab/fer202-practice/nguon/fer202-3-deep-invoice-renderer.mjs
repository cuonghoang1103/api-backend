/**
 * FER202 · Chương 3 — DEEP LAB: Invoice Renderer (JSX chuyên sâu, chưa cần state).
 * Sâu hơn Lab 3: dữ liệu lồng → nhiều component thuần; bảng NHÓM theo danh mục (Fragment có key trong <tbody>),
 * định dạng tiền/ngày, điều kiện nhiều nhánh (map trạng thái thay cho if lồng), trạng thái rỗng, tính toán dẫn xuất.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DATA = `// src/data/invoices.js — dữ liệu mẫu (đã cho, không sửa)
export const TODAY = '2026-10-28'; // "hôm nay" cố định để kết quả không phụ thuộc ngày chấm

export const INVOICES = [
  {
    number: 'INV-2026-0042',
    status: 'PAID',
    customer: { name: 'CT Academy JSC', email: 'billing@ctacademy.vn' },
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    coupon: { code: 'WELCOME500', amount: 500000 },
    notes: [],
    items: [
      { id: 1, category: 'Hardware', name: 'Laptop', qty: 1, unitPrice: 18000000, discountPct: 10 },
      { id: 2, category: 'Hardware', name: 'Mouse', qty: 2, unitPrice: 250000, discountPct: 0 },
      { id: 3, category: 'Software', name: 'Office 365', qty: 1, unitPrice: 1500000, discountPct: 0 },
      { id: 4, category: 'Software', name: 'Antivirus', qty: 2, unitPrice: 300000, discountPct: 50 },
    ],
  },
  {
    number: 'INV-2026-0043',
    status: 'OVERDUE',
    customer: { name: 'Lan Nguyen' },
    issueDate: '2026-10-05',
    dueDate: '2026-10-20',
    coupon: null,
    notes: ['Please pay by bank transfer.', 'Late fee applies after 30 days.'],
    items: [
      { id: 5, category: 'Services', name: 'Consulting (hours)', qty: 3, unitPrice: 2000000, discountPct: 0 },
      { id: 6, category: 'Services', name: 'Setup', qty: 1, unitPrice: 1000000, discountPct: 0 },
    ],
  },
  {
    number: 'INV-2026-0044',
    status: 'PENDING',
    customer: { name: 'Minh Tran', email: 'minh@example.com' },
    issueDate: '2026-10-27',
    dueDate: '2026-11-10',
    coupon: null,
    notes: [],
    items: [],
  },
];
`;

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; background: #f3f4f6; margin: 0; padding: 24px; color: #111827; }
.invoice { background: #fff; border-radius: 12px; padding: 20px 24px; margin: 0 auto 24px; max-width: 760px; box-shadow: 0 1px 3px rgba(0,0,0,.1); position: relative; }
.inv-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
.badge { padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 600; }
.badge-paid { background: #dcfce7; color: #166534; } .badge-pending { background: #fef9c3; color: #854d0e; } .badge-overdue { background: #fee2e2; color: #991b1b; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; }
th, td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; text-align: left; }
td.num, th.num { text-align: right; }
.group-row td { background: #f9fafb; font-weight: 600; }
.discount { color: #b91c1c; font-size: 12px; margin-left: 6px; }
.totals { margin-left: auto; width: 320px; }
.totals div { display: flex; justify-content: space-between; padding: 3px 0; }
#grand-total, .grand-total { font-weight: 700; font-size: 18px; }
.alert { background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 8px; }
.paid-stamp { position: absolute; right: 24px; top: 70px; transform: rotate(-12deg); color: #16a34a; border: 3px solid #16a34a; padding: 4px 12px; font-weight: 800; letter-spacing: 2px; }
.notes { color: #4b5563; font-size: 14px; }
`;

const FORMAT = `// src/utils/format.js — định dạng dùng chung
export const vnd = (n) => n.toLocaleString('en-US') + ' ₫';

// 'YYYY-MM-DD' ⇒ 'DD/MM/YYYY' (không qua Date ⇒ không lệch múi giờ)
export const formatDate = (iso) => iso.split('-').reverse().join('/');

// số ngày từ a tới b (cả hai 'YYYY-MM-DD'), dùng UTC nên không lệch
export const daysBetween = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);

// tổng tiền một dòng sau giảm giá
export const lineTotal = (item) => Math.round(item.qty * item.unitPrice * (1 - item.discountPct / 100));
`;

const STATUS = `// src/components/StatusBadge.js — tra bảng thay cho if/else lồng nhau
const STATUS = {
  PAID: { label: 'Paid', className: 'badge badge-paid' },
  PENDING: { label: 'Pending', className: 'badge badge-pending' },
  OVERDUE: { label: 'Overdue', className: 'badge badge-overdue' },
};

export default function StatusBadge({ status }) {
  const s = STATUS[status] ?? { label: status, className: 'badge' };
  return <span className={s.className}>{s.label}</span>;
}
`;

const ITEMS = `// src/components/ItemsTable.js — bảng NHÓM theo danh mục: mỗi nhóm một hàng tiêu đề + các hàng mặt hàng
import { Fragment } from 'react';
import { lineTotal, vnd } from '../utils/format';

// gom theo danh mục, giữ thứ tự xuất hiện đầu tiên
function groupByCategory(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
  }
  return [...groups.entries()];
}

export default function ItemsTable({ items }) {
  return (
    <table className="items">
      <thead>
        <tr>
          <th>Item</th>
          <th className="num">Qty</th>
          <th className="num">Unit price</th>
          <th className="num">Total</th>
        </tr>
      </thead>
      <tbody>
        {groupByCategory(items).map(([category, rows]) => (
          // Fragment CÓ key: nhiều <tr> cho một nhóm mà không thêm thẻ bọc sai chỗ trong <tbody>
          <Fragment key={category}>
            <tr className="group-row">
              <td colSpan={4}>{category} ({rows.length})</td>
            </tr>
            {rows.map((item) => (
              <tr key={item.id} className="item-row">
                <td className="name">
                  {item.name}
                  {item.discountPct > 0 && <span className="discount">-{item.discountPct}%</span>}
                </td>
                <td className="num qty">{item.qty}</td>
                <td className="num unit">{vnd(item.unitPrice)}</td>
                <td className="num line-total">{vnd(lineTotal(item))}</td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
`;

const TOTALS = `// src/components/Totals.js — các con số đều SUY RA từ items/coupon (không nhập tay)
import { lineTotal, vnd } from '../utils/format';

export const VAT_RATE = 0.08;

export function computeTotals(items, coupon) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const discount = coupon ? Math.min(coupon.amount, subtotal) : 0;
  const taxable = subtotal - discount;
  const vat = Math.round(taxable * VAT_RATE);
  return { subtotal, discount, vat, grandTotal: taxable + vat };
}

export default function Totals({ items, coupon }) {
  const t = computeTotals(items, coupon);
  return (
    <div className="totals">
      <div><span>Subtotal</span><span className="subtotal">{vnd(t.subtotal)}</span></div>
      {coupon && (
        <div className="coupon-row"><span>Coupon {coupon.code}</span><span className="coupon">-{vnd(t.discount)}</span></div>
      )}
      <div><span>VAT 8%</span><span className="vat">{vnd(t.vat)}</span></div>
      <div className="grand-total"><span>Total</span><span className="grand">{vnd(t.grandTotal)}</span></div>
    </div>
  );
}
`;

const INVOICE = `// src/components/Invoice.js — một hoá đơn: đầu trang, cảnh báo/con dấu theo trạng thái, bảng, tổng, ghi chú
import StatusBadge from './StatusBadge';
import ItemsTable from './ItemsTable';
import Totals from './Totals';
import { daysBetween, formatDate } from '../utils/format';
import { TODAY } from '../data/invoices';

export default function Invoice({ invoice }) {
  const { number, status, customer, issueDate, dueDate, coupon, notes, items } = invoice;
  const overdueDays = status === 'OVERDUE' ? daysBetween(dueDate, TODAY) : 0;

  return (
    <article className="invoice" id={number}>
      <header className="inv-head">
        <div>
          <h2 className="inv-no">{number}</h2>
          <p className="customer">{customer.name}</p>
          <p className="email">{customer.email ?? 'No email'}</p>
        </div>
        <div>
          <StatusBadge status={status} />
          <p className="dates">Issued {formatDate(issueDate)} · Due {formatDate(dueDate)}</p>
        </div>
      </header>

      {status === 'OVERDUE' && (
        <p className="alert overdue-alert">Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}</p>
      )}
      {status === 'PAID' && <div className="paid-stamp">PAID</div>}

      {items.length === 0 ? (
        <p className="empty">No items yet</p>
      ) : (
        <>
          <ItemsTable items={items} />
          <Totals items={items} coupon={coupon} />
        </>
      )}

      {notes.length > 0 && (
        <ul className="notes">
          {notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
    </article>
  );
}
`;

const APP = `// src/App.js — vẽ mọi hoá đơn + dòng tổng hợp
import Invoice from './components/Invoice';
import { computeTotals } from './components/Totals';
import { INVOICES } from './data/invoices';
import { vnd } from './utils/format';

export default function App() {
  const outstanding = INVOICES
    .filter((inv) => inv.status !== 'PAID')
    .reduce((sum, inv) => sum + computeTotals(inv.items, inv.coupon).grandTotal, 0);

  return (
    <main>
      <h1>Invoices</h1>
      <p id="summary">{INVOICES.length} invoices · Outstanding: {vnd(outstanding)}</p>
      {INVOICES.map((inv) => <Invoice key={inv.number} invoice={inv} />)}
    </main>
  );
}
`;

const S_APP = `// src/App.js — STARTER: hiện mới chỉ in số hoá đơn đầu tiên
import { INVOICES } from './data/invoices';

export default function App() {
  return (
    <main>
      <h1>Invoices</h1>
      <article className="invoice">
        <h2 className="inv-no">{INVOICES[0].number}</h2>
      </article>
    </main>
  );
}
`;
const stub = (ten, mo) => `// src/components/${ten}.js — STARTER
// ${mo}
export default function ${ten}() {
  return null;
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data/invoices.js': DATA };
const LOI_GIAI = {
  'src/App.js': APP, 'src/components/Invoice.js': INVOICE, 'src/components/ItemsTable.js': ITEMS, 'src/components/Totals.js': TOTALS,
  'src/components/StatusBadge.js': STATUS, 'src/utils/format.js': FORMAT, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/components/Invoice.js': stub('Invoice', 'article.invoice: .inv-no, .customer, .email, StatusBadge, .dates, .overdue-alert / .paid-stamp, bảng, tổng, .notes, .empty'),
  'src/components/ItemsTable.js': stub('ItemsTable', 'table.items: tr.group-row "Hardware (2)" + tr.item-row (.name .discount, .qty, .unit, .line-total)'),
  'src/components/Totals.js': `// src/components/Totals.js — STARTER
export function computeTotals() {
  return { subtotal: 0, discount: 0, vat: 0, grandTotal: 0 };
}
export default function Totals() {
  return null;
}
`,
  'src/components/StatusBadge.js': stub('StatusBadge', 'span.badge.badge-paid "Paid" · badge-pending "Pending" · badge-overdue "Overdue"'),
  'src/utils/format.js': `// src/utils/format.js — STARTER
export const vnd = (n) => String(n);
export const formatDate = (iso) => iso;
export const daysBetween = () => 0;
export const lineTotal = (item) => item.qty * item.unitPrice;
`,
  ...CHUNG,
};

const I1 = 'article.invoice:nth-of-type(1)';
const I2 = 'article.invoice:nth-of-type(2)';
const I3 = 'article.invoice:nth-of-type(3)';

const KIEM = [
  // f1 header
  { nhom: 'f1', moTa: 'Three invoices rendered', kiem: 'danh-sach-text', selector: 'article.invoice .inv-no', mongDoi: ['INV-2026-0042', 'INV-2026-0043', 'INV-2026-0044'] },
  { nhom: 'f1', moTa: 'Customer and fallback email', kiem: 'danh-sach-text', selector: `${I2} .customer, ${I2} .email`, mongDoi: ['Lan Nguyen', 'No email'] },
  { nhom: 'f1', moTa: 'Dates formatted DD/MM/YYYY', kiem: 'text', selector: `${I1} .dates`, giaTri: 'Issued 01/10/2026 · Due 15/10/2026' },
  { nhom: 'f1', an: true, moTa: 'Each invoice has its number as id', kiem: 'ton-tai', selector: 'article#INV-2026-0043' },
  // f2 status
  { nhom: 'f2', moTa: 'Status badges with classes', kiem: 'danh-sach-text', selector: '.badge-paid, .badge-overdue, .badge-pending', mongDoi: ['Paid', 'Overdue', 'Pending'] },
  { nhom: 'f2', moTa: 'Overdue alert with day count', kiem: 'text', selector: `${I2} .overdue-alert`, giaTri: 'Overdue by 8 days' },
  { nhom: 'f2', moTa: 'PAID stamp only on paid invoices', kiem: 'so-luong', selector: '.paid-stamp', giaTri: 1 },
  { nhom: 'f2', an: true, moTa: 'No alert on non-overdue invoices', kiem: 'khong-ton-tai', selector: `${I1} .overdue-alert, ${I3} .overdue-alert` },
  // f3 grouped table
  { nhom: 'f3', moTa: 'Group header rows with counts', kiem: 'danh-sach-text', selector: `${I1} tr.group-row`, mongDoi: ['Hardware (2)', 'Software (2)'] },
  { nhom: 'f3', moTa: 'Rows in document order: group, items, group, items', kiem: 'so-luong', selector: `${I1} tbody > tr`, giaTri: 6 },
  { nhom: 'f3', moTa: 'Quantities in item rows', kiem: 'danh-sach-text', selector: `${I1} tr.item-row .qty`, mongDoi: ['1', '2', '1', '2'] },
  { nhom: 'f3', an: true, moTa: 'Group rows sit directly in tbody (Fragment, not div)', kiem: 'ton-tai', selector: `${I1} table > tbody > tr.group-row + tr.item-row` },
  { nhom: 'f3', an: true, moTa: 'Fragment with a key', kiem: 'ma-nguon', tep: 'src/components/ItemsTable.js', khop: '<(React\\.)?Fragment\\s+key=' },
  // f4 line totals & discounts
  { nhom: 'f4', moTa: 'Line totals after discount', kiem: 'danh-sach-text', selector: `${I1} .line-total`, mongDoi: ['16,200,000 ₫', '500,000 ₫', '1,500,000 ₫', '300,000 ₫'] },
  { nhom: 'f4', moTa: 'Discount labels only when > 0', kiem: 'danh-sach-text', selector: `${I1} .discount`, mongDoi: ['-10%', '-50%'] },
  { nhom: 'f4', an: true, moTa: 'Unit price formatted', kiem: 'text', selector: `${I1} tr.item-row:nth-of-type(2) .unit`, giaTri: '18,000,000 ₫' },
  // f5 totals
  { nhom: 'f5', moTa: 'Subtotal, coupon, VAT, total', kiem: 'danh-sach-text', selector: `${I1} .subtotal, ${I1} .coupon, ${I1} .vat, ${I1} .grand`, mongDoi: ['18,500,000 ₫', '-500,000 ₫', '1,440,000 ₫', '19,440,000 ₫'] },
  { nhom: 'f5', moTa: 'No coupon row without a coupon', kiem: 'khong-ton-tai', selector: `${I2} .coupon-row` },
  { nhom: 'f5', moTa: 'Totals of invoice 2', kiem: 'danh-sach-text', selector: `${I2} .subtotal, ${I2} .vat, ${I2} .grand`, mongDoi: ['7,000,000 ₫', '560,000 ₫', '7,560,000 ₫'] },
  { nhom: 'f5', an: true, moTa: 'Totals computed from data (computeTotals exported)', kiem: 'ma-nguon', tep: 'src/components/Totals.js', khop: 'export\\s+function\\s+computeTotals[\\s\\S]*reduce\\(' },
  // f6 empty + notes
  { nhom: 'f6', moTa: 'Empty invoice shows a message and no table', kiem: 'danh-sach-text', selector: `${I3} .empty, ${I3} table`, mongDoi: ['No items yet'] },
  { nhom: 'f6', moTa: 'Notes list only when there are notes', kiem: 'danh-sach-text', selector: '.notes li', mongDoi: ['Please pay by bank transfer.', 'Late fee applies after 30 days.'] },
  { nhom: 'f6', an: true, moTa: 'No empty <ul> for invoices without notes', kiem: 'so-luong', selector: 'ul.notes', giaTri: 1 },
  // f7 summary
  { nhom: 'f7', moTa: 'Summary of outstanding (not paid) invoices', kiem: 'text', selector: '#summary', giaTri: '3 invoices · Outstanding: 7,560,000 ₫' },
  { nhom: 'f7', an: true, moTa: 'Invoices rendered with map + key', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'INVOICES\\.map\\([\\s\\S]*key=' },
  // f8 component structure
  { nhom: 'f8', moTa: 'StatusBadge uses a lookup object, not nested if/else', kiem: 'ma-nguon', tep: 'src/components/StatusBadge.js', khop: 'PAID\\s*:\\s*\\{[\\s\\S]*PENDING\\s*:\\s*\\{[\\s\\S]*OVERDUE\\s*:' },
  { nhom: 'f8', moTa: 'No dangerouslySetInnerHTML', kiem: 'ma-nguon', khop: 'dangerouslySetInnerHTML', phuDinh: true },
  { nhom: 'f8', an: true, moTa: 'Formatting helpers in utils/format.js', kiem: 'ma-nguon', tep: 'src/utils/format.js', khop: '^(?=[\\s\\S]*export\\s+const\\s+vnd)(?=[\\s\\S]*export\\s+const\\s+formatDate)(?=[\\s\\S]*export\\s+const\\s+daysBetween)' },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 3: Invoice Renderer — advanced JSX', vi: 'DEEP LAB 3: Trình hiển thị hoá đơn — JSX chuyên sâu' },
  phu: { en: 'FER202 · Chapter 3 (deep) · Suggested time: 110 minutes · Total: 10 marks', vi: 'FER202 · Chương 3 (chuyên sâu) · Thời gian gợi ý: 110 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Render three invoices from nested data — no state yet, only JSX, components and pure functions. The hard parts are the ones real admin screens have: a table <b>grouped by category</b> (several <code>&lt;tr&gt;</code> per group — you need a keyed <code>Fragment</code>, a <code>&lt;div&gt;</code> inside <code>&lt;tbody&gt;</code> is invalid HTML), money and date formatting, totals that are <b>derived</b> from the items, and several conditional branches driven by the invoice status.</p>',
    vi: '<p>Hiển thị ba hoá đơn từ dữ liệu lồng — chưa cần state, chỉ JSX, component và hàm thuần. Phần khó là phần màn hình quản trị thật hay có: bảng <b>nhóm theo danh mục</b> (nhiều <code>&lt;tr&gt;</code> cho một nhóm — cần <code>Fragment</code> có key, <code>&lt;div&gt;</code> trong <code>&lt;tbody&gt;</code> là HTML sai), định dạng tiền và ngày, các con số tổng <b>suy ra</b> từ mặt hàng, và nhiều nhánh điều kiện theo trạng thái hoá đơn.</p>',
  },
  chucNangChinh: [{ en: 'Invoice header & status · grouped items table · discounts · totals with coupon and VAT · empty/notes branches · summary.', vi: 'Đầu hoá đơn & trạng thái · bảng nhóm theo danh mục · giảm giá · tổng có coupon và VAT · nhánh rỗng/ghi chú · dòng tổng hợp.' }],
  yeuCauChung: [
    { en: 'Components: <code>Invoice</code>, <code>ItemsTable</code>, <code>Totals</code> (also export <code>computeTotals</code>), <code>StatusBadge</code>; helpers in <code>utils/format.js</code>.', vi: 'Component: <code>Invoice</code>, <code>ItemsTable</code>, <code>Totals</code> (export thêm <code>computeTotals</code>), <code>StatusBadge</code>; hàm phụ trong <code>utils/format.js</code>.' },
    { en: 'Money: <code>18,000,000 ₫</code> (<code>toLocaleString(\'en-US\')</code>). Dates: <code>DD/MM/YYYY</code>. Use <code>TODAY</code> from the data file, never the real clock.', vi: 'Tiền: <code>18,000,000 ₫</code> (<code>toLocaleString(\'en-US\')</code>). Ngày: <code>DD/MM/YYYY</code>. Dùng <code>TODAY</code> trong tệp dữ liệu, không dùng đồng hồ thật.' },
  ],
  cayThuMuc: `
src/
├── data/invoices.js        # INVOICES, TODAY (given)
├── utils/format.js         # vnd · formatDate · daysBetween · lineTotal
├── components/
│   ├── Invoice.js
│   ├── ItemsTable.js       # grouped by category
│   ├── Totals.js           # computeTotals + Totals
│   └── StatusBadge.js
├── App.js                  # all invoices + #summary
├── index.css (given)
└── index.js`,
  wireframe: `
+-------------------------------------------------------------+
| INV-2026-0042                                  [ Paid ]     |
| CT Academy JSC                    Issued 01/10/2026 · Due…  |
| billing@ctacademy.vn                              ╔══════╗  |
|                                                   ║ PAID ║  |
| Item              Qty    Unit price        Total  ╚══════╝  |
| Hardware (2)                                                 |
| Laptop  -10%        1   18,000,000 ₫   16,200,000 ₫          |
| Mouse               2      250,000 ₫      500,000 ₫          |
| Software (2)                                                 |
| …                                                            |
|                          Subtotal          18,500,000 ₫      |
|                          Coupon WELCOME500   -500,000 ₫      |
|                          VAT 8%             1,440,000 ₫      |
|                          Total             19,440,000 ₫      |
+-------------------------------------------------------------+`,
  moHinh: {
    ten: 'Invoice',
    truong: [
      ['number · status', "string · 'PAID' | 'PENDING' | 'OVERDUE'", ''],
      ['customer', '{ name, email? }', { en: 'email may be missing', vi: 'email có thể thiếu' }],
      ['issueDate · dueDate', "'YYYY-MM-DD'", ''],
      ['coupon', '{ code, amount } | null', { en: 'capped at the subtotal', vi: 'không vượt quá tạm tính' }],
      ['notes', 'string[]', ''],
      ['items', '{ id, category, name, qty, unitPrice, discountPct }[]', { en: 'line total = qty × unitPrice × (1 − discount%)', vi: 'thành tiền = qty × đơn giá × (1 − giảm%)' }],
    ],
  },
  chucNang: [
    { ten: { en: 'Invoice header', vi: 'Đầu hoá đơn' }, diem: 1, yeuCau: [{ en: '<code>article.invoice</code> with <code>id</code> = number; <code>.inv-no</code>, <code>.customer</code>, <code>.email</code> (missing ⇒ <code>No email</code>), <code>.dates</code> <code>Issued 01/10/2026 · Due 15/10/2026</code>.', vi: '<code>article.invoice</code> có <code>id</code> = số hoá đơn; <code>.inv-no</code>, <code>.customer</code>, <code>.email</code> (thiếu ⇒ <code>No email</code>), <code>.dates</code> <code>Issued 01/10/2026 · Due 15/10/2026</code>.' }] },
    { ten: { en: 'Status branches', vi: 'Nhánh trạng thái' }, diem: 1.5, yeuCau: [{ en: '<code>StatusBadge</code>: <code>.badge.badge-paid</code> Paid / <code>badge-pending</code> Pending / <code>badge-overdue</code> Overdue (lookup object). OVERDUE ⇒ <code>.overdue-alert</code> <code>Overdue by 8 days</code> (from <code>dueDate</code> to <code>TODAY</code>); PAID ⇒ <code>.paid-stamp</code>.', vi: '<code>StatusBadge</code>: <code>.badge.badge-paid</code> Paid / <code>badge-pending</code> Pending / <code>badge-overdue</code> Overdue (đối tượng tra cứu). OVERDUE ⇒ <code>.overdue-alert</code> <code>Overdue by 8 days</code> (từ <code>dueDate</code> tới <code>TODAY</code>); PAID ⇒ <code>.paid-stamp</code>.' }], viDu: { en: 'dueDate 2026-10-20, TODAY 2026-10-28 ⇒ "Overdue by 8 days"', vi: 'dueDate 2026-10-20, TODAY 2026-10-28 ⇒ "Overdue by 8 days"' } },
    { ten: { en: 'Table grouped by category', vi: 'Bảng nhóm theo danh mục' }, diem: 1.5, yeuCau: [{ en: '<code>table.items</code>; for each category (first-appearance order) a <code>tr.group-row</code> <code>Hardware (2)</code> followed by its <code>tr.item-row</code>s — all directly inside <code>&lt;tbody&gt;</code> via a keyed <code>Fragment</code>.', vi: '<code>table.items</code>; mỗi danh mục (theo thứ tự xuất hiện) một <code>tr.group-row</code> <code>Hardware (2)</code> rồi tới các <code>tr.item-row</code> của nó — tất cả nằm thẳng trong <code>&lt;tbody&gt;</code> nhờ <code>Fragment</code> có key.' }] },
    { ten: { en: 'Line totals & discounts', vi: 'Thành tiền & giảm giá' }, diem: 1, yeuCau: [{ en: 'Cells <code>.name</code> (+ <code>.discount</code> <code>-10%</code> only when &gt; 0), <code>.qty</code>, <code>.unit</code>, <code>.line-total</code> (after discount).', vi: 'Ô <code>.name</code> (+ <code>.discount</code> <code>-10%</code> chỉ khi &gt; 0), <code>.qty</code>, <code>.unit</code>, <code>.line-total</code> (sau giảm).' }] },
    { ten: { en: 'Totals', vi: 'Các dòng tổng' }, diem: 2, yeuCau: [{ en: '<code>.subtotal</code>, <code>.coupon-row</code> (only with a coupon; <code>.coupon</code> <code>-500,000 ₫</code>), <code>.vat</code> (8% of subtotal − coupon, rounded), <code>.grand</code>. Export <code>computeTotals(items, coupon)</code>.', vi: '<code>.subtotal</code>, <code>.coupon-row</code> (chỉ khi có coupon; <code>.coupon</code> <code>-500,000 ₫</code>), <code>.vat</code> (8% của tạm tính − coupon, làm tròn), <code>.grand</code>. Export <code>computeTotals(items, coupon)</code>.' }], viDu: { en: 'Invoice 1: 18,500,000 − 500,000 = 18,000,000; VAT 1,440,000; total 19,440,000', vi: 'Hoá đơn 1: 18,500,000 − 500,000 = 18,000,000; VAT 1,440,000; tổng 19,440,000' } },
    { ten: { en: 'Empty state & notes', vi: 'Trạng thái rỗng & ghi chú' }, diem: 1, yeuCau: [{ en: 'No items ⇒ <code>.empty</code> <code>No items yet</code> and no table/totals. Notes ⇒ <code>ul.notes</code> (only when non-empty).', vi: 'Không mặt hàng ⇒ <code>.empty</code> <code>No items yet</code>, không bảng/tổng. Ghi chú ⇒ <code>ul.notes</code> (chỉ khi có).' }] },
    { ten: { en: 'Summary', vi: 'Dòng tổng hợp' }, diem: 1, yeuCau: [{ en: '<code>#summary</code> <code>3 invoices · Outstanding: 7,560,000 ₫</code> = sum of grand totals of invoices that are not PAID.', vi: '<code>#summary</code> <code>3 invoices · Outstanding: 7,560,000 ₫</code> = tổng tiền các hoá đơn chưa PAID.' }] },
    { ten: { en: 'Clean JSX structure', vi: 'Cấu trúc JSX sạch' }, diem: 1, yeuCau: [{ en: 'Lookup object for statuses, formatting helpers in <code>utils/format.js</code>, no <code>dangerouslySetInnerHTML</code>.', vi: 'Đối tượng tra cứu cho trạng thái, hàm định dạng trong <code>utils/format.js</code>, không dùng <code>dangerouslySetInnerHTML</code>.' }] },
  ],
  idBatBuoc: [
    ['article.invoice#<number> · .inv-no · .customer · .email · .dates', { en: 'header', vi: 'đầu hoá đơn' }],
    ['.badge.badge-paid|pending|overdue · .overdue-alert · .paid-stamp', { en: 'status', vi: 'trạng thái' }],
    ['table.items · tr.group-row · tr.item-row · .name .discount .qty .unit .line-total', { en: 'table', vi: 'bảng' }],
    ['.subtotal · .coupon-row .coupon · .vat · .grand', { en: 'totals', vi: 'tổng' }],
    ['.empty · ul.notes · #summary', { en: 'other', vi: 'khác' }],
  ],
  truDiem: [
    { en: 'Wrapping group rows in <code>&lt;div&gt;</code> inside <code>&lt;tbody&gt;</code> (invalid DOM, React warns).', vi: 'Bọc các hàng nhóm bằng <code>&lt;div&gt;</code> trong <code>&lt;tbody&gt;</code> (DOM sai, React cảnh báo).' },
    { en: 'Hard-coding totals or the overdue day count.', vi: 'Viết cứng số tổng hoặc số ngày quá hạn.' },
    { en: '<code>new Date()</code> for "today" — results change every day.', vi: '<code>new Date()</code> cho "hôm nay" — kết quả đổi theo ngày.' },
    { en: '<code>{notes.length &amp;&amp; …}</code> — renders a stray <code>0</code>.', vi: '<code>{notes.length &amp;&amp; …}</code> — in ra số <code>0</code> lạc lõng.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-3-deep-invoice-renderer',
  ten: 'Deep Lab 3 — Invoice Renderer (advanced JSX)',
  khoa: KHOA,
  baiHoc: 'fer202-3-2-fragments-conditional',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 3 — Invoice Renderer (grouped tables · Fragments · derived totals)', vi: 'Deep Lab 3 — Trình hiển thị hoá đơn (bảng nhóm · Fragment · tổng suy ra)' },
      doKho: 'HARD',
      phut: 110,
      diem: 100,
      khaiNiem: ['keyed Fragment', 'grouping data for rendering', 'conditional branches', 'lookup objects', 'derived data', 'formatting helpers'],
      tienQuyet: ['Lab 3 — Report Card'],
      the: ['fer202', 'deep-lab', 'jsx'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'Fragment', vi: 'thẻ bọc không sinh ra phần tử DOM' },
        { en: 'derived value', vi: 'giá trị tính ra từ dữ liệu khác' },
        { en: 'lookup table', vi: 'bảng tra cứu: object ánh xạ khoá → giá trị' },
        { en: 'invalid DOM nesting', vi: 'lồng thẻ sai luật HTML (vd div trong tbody)' },
        ...tn('rubric'),
      ],
      goiY: [
        'Gom nhóm bằng Map để giữ thứ tự xuất hiện: for (const it of items) { if (!m.has(it.category)) m.set(it.category, []); m.get(it.category).push(it); }',
        'Nhiều <tr> cho một nhóm: <Fragment key={category}><tr className="group-row">…</tr>{rows.map(…)}</Fragment> — import { Fragment } from "react".',
        'daysBetween dùng Date.parse(d + "T00:00:00Z") để không lệch múi giờ; formatDate chỉ cần split/reverse/join.',
        'computeTotals: subtotal = Σ lineTotal; discount = min(coupon.amount, subtotal); vat = round((subtotal − discount) × 0.08).',
      ],
      loiHayGap: [
        'Dùng <code>&lt;&gt;…&lt;/&gt;</code> trong map ⇒ không gắn được key (cú pháp rút gọn không nhận thuộc tính).',
        '<code>new Date("2026-10-20")</code> rồi trừ theo giờ địa phương ⇒ lệch một ngày ở một số múi giờ.',
        'Tính VAT trên tạm tính TRƯỚC khi trừ coupon.',
        'Ẩn bảng bằng CSS khi rỗng thay vì không render nó.',
      ],
      moTaNgan: 'Deep lab chương 3: ba hoá đơn từ dữ liệu lồng — bảng nhóm theo danh mục bằng Fragment có key, giảm giá, coupon + VAT suy ra, nhánh trạng thái bằng bảng tra, trạng thái rỗng, dòng tổng hợp. Thang 10.',
      giaiThich: '<p>Mọi thứ hiển thị đều là hàm của dữ liệu: nhóm được tính bằng Map (giữ thứ tự), con số tổng tính bằng <code>computeTotals</code> và được dùng lại cho dòng tổng hợp. Fragment có key cho phép trả về nhiều <code>&lt;tr&gt;</code> mà không thêm thẻ bọc sai chỗ. Trạng thái hiển thị bằng bảng tra (thêm trạng thái mới = thêm một dòng), ngày được xử lý dạng chuỗi/UTC để kết quả không phụ thuộc múi giờ hay ngày chấm bài.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/reference/react/Fragment',
    },
  ],
});

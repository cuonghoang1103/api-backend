/**
 * FER202 · 4.1 — Bootstrap grid & React-Bootstrap components (bài luyện React; chấm class/cấu trúc, không chấm
 * CSS tính toán của Bootstrap để chạy được cả trên app desktop).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const RB = ['react-bootstrap', 'bootstrap'];
const IMPORT = "import 'bootstrap/dist/css/bootstrap.min.css';\n";

export default doiDau({
  slug: 'fer202-4-1-bootstrap',
  ten: '4.1 Bootstrap grid & React-Bootstrap',
  khoa: KHOA,
  baiHoc: 'fer202-4-1-bootstrap',
  de: [
    reactNho({
      tieuDe: 'Container, Row and three equal columns',
      doKho: 'EASY', phut: 8, thuVien: RB,
      khaiNiem: ['Container', 'Row', 'Col', '12-column grid'], the: ['bootstrap', 'grid'],
      moTa: {
        en: '<p>The Bootstrap grid has 12 columns. Build a three-column feature section with React-Bootstrap: <code>Container</code> → <code>Row</code> → three <code>Col md={4}</code>. On phones the columns stack automatically.</p>',
        vi: '<p>Lưới Bootstrap có 12 cột. Dựng khối ba cột bằng React-Bootstrap: <code>Container</code> → <code>Row</code> → ba <code>Col md={4}</code>. Trên điện thoại các cột tự xếp chồng.</p>',
      },
      yeuCau: [
        { en: '<code>Container id="features"</code> with one <code>Row</code> and three <code>Col md={4}</code>, each with an <code>h3</code> and a <code>p</code>.', vi: '<code>Container id="features"</code> có một <code>Row</code> và ba <code>Col md={4}</code>, mỗi cột một <code>h3</code> và một <code>p</code>.' },
        { en: 'Headings: Fast, Secure, Friendly.', vi: 'Tiêu đề: Fast, Secure, Friendly.' },
      ],
      viDu: [{ input: '<Col md={4}>', output: '<div class="col-md-4">', explanation: '4 + 4 + 4 = 12 columns from the md breakpoint (≥ 768px).|||4 + 4 + 4 = 12 cột từ mốc md (≥ 768px).' }],
      goiY: ["import { Container, Row, Col } from 'react-bootstrap';", '<Container id="features"><Row><Col md={4}>…</Col> ×3</Row></Container>'],
      loiHayGap: ['Đặt <code>Col</code> trực tiếp trong <code>Container</code> (thiếu <code>Row</code>) ⇒ mất khoảng cách gutter và căn lề.', 'Tổng số cột vượt 12 ⇒ cột cuối rớt xuống hàng mới.'],
      thuatNgu: [{ en: 'grid', vi: 'lưới' }, { en: 'gutter', vi: 'khoảng cách giữa các cột' }, { en: 'stack', vi: 'xếp chồng theo chiều dọc' }],
      giaiThich: '<p><code>Container</code> căn giữa và giới hạn bề rộng, <code>Row</code> là hàng flex có gutter âm, <code>Col md={4}</code> chiếm 4/12 từ mốc md trở lên; dưới md mỗi cột rộng 100%.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}
export default function App() {
  // TODO: Container#features > Row > 3 × Col md={4}
  return (
    <div>
      <h3>Fast</h3>
      <h3>Secure</h3>
      <h3>Friendly</h3>
    </div>
  );
}
`,
      giai: `// src/App.js — lưới 12 cột: 3 cột × 4 = 12 từ mốc md
${IMPORT}import { Col, Container, Row } from 'react-bootstrap';

const FEATURES = [
  { title: 'Fast', text: 'Pages load in under a second.' },
  { title: 'Secure', text: 'Your data is encrypted.' },
  { title: 'Friendly', text: 'Designed for everyone.' },
];

export default function App() {
  return (
    <Container id="features" className="py-4">
      <Row>
        {FEATURES.map((f) => (
          <Col md={4} key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
`,
      kiem: [
        { moTa: '#features is a .container with a .row', kiem: 'ton-tai', selector: '#features.container > .row' },
        { moTa: 'Three .col-md-4 columns', kiem: 'so-luong', selector: '#features .row > .col-md-4', giaTri: 3 },
        { moTa: 'Column headings', kiem: 'danh-sach-text', selector: '.col-md-4 h3', mongDoi: ['Fast', 'Secure', 'Friendly'] },
        { an: true, moTa: 'Each column has a paragraph', kiem: 'so-luong', selector: '.col-md-4 p', giaTri: 3 },
      ],
    }),
    reactNho({
      tieuDe: 'Buttons and badges with variants',
      doKho: 'EASY', phut: 8, thuVien: RB,
      khaiNiem: ['Button variant', 'size', 'Badge', 'pill'], the: ['bootstrap', 'components'],
      moTa: {
        en: '<p>Use React-Bootstrap props instead of writing class names by hand. Build a toolbar of buttons and a notification badge.</p>',
        vi: '<p>Dùng prop của React-Bootstrap thay vì tự gõ class. Dựng thanh nút và một badge thông báo.</p>',
      },
      yeuCau: [
        { en: '<code>#btn-save</code> variant <code>primary</code>, <code>#btn-delete</code> variant <code>outline-danger</code>, <code>#btn-ok</code> variant <code>success</code> size <code>sm</code>, <code>#btn-off</code> disabled <code>secondary</code>.', vi: '<code>#btn-save</code> variant <code>primary</code>, <code>#btn-delete</code> variant <code>outline-danger</code>, <code>#btn-ok</code> variant <code>success</code> size <code>sm</code>, <code>#btn-off</code> <code>secondary</code> bị vô hiệu.' },
        { en: '<code>#inbox</code> button contains <code>Badge pill bg="info"</code> showing 4.', vi: 'Nút <code>#inbox</code> chứa <code>Badge pill bg="info"</code> hiện 4.' },
      ],
      viDu: [{ input: '<Button variant="outline-danger">', output: '<button class="btn btn-outline-danger">', explanation: 'variant ⇒ btn-{variant}; size="sm" ⇒ btn-sm.|||variant ⇒ btn-{variant}; size="sm" ⇒ btn-sm.' }],
      goiY: ['<Button id="btn-ok" variant="success" size="sm">OK</Button>', '<Button id="inbox">Inbox <Badge pill bg="info">4</Badge></Button>'],
      loiHayGap: ['<code>variant="danger outline"</code> — sai tên; đúng là <code>outline-danger</code>.', 'Dùng <code>color=</code> như thư viện khác — React-Bootstrap dùng <code>variant</code>/<code>bg</code>.'],
      thuatNgu: [{ en: 'variant', vi: 'biến thể màu/kiểu' }, { en: 'pill', vi: 'bo tròn dạng viên thuốc' }],
      giaiThich: '<p>Component React-Bootstrap dịch prop thành class Bootstrap: <code>variant</code> ⇒ <code>btn-*</code>, <code>size</code> ⇒ <code>btn-sm/lg</code>, <code>pill</code> ⇒ <code>rounded-pill</code>, <code>bg</code> ⇒ <code>bg-*</code>. Ít lỗi chính tả class hơn và có kiểm prop.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}
export default function App() {
  return (
    <div className="p-3">
      <button id="btn-save">Save</button>
      <button id="btn-delete">Delete</button>
      <button id="btn-ok">OK</button>
      <button id="btn-off">Off</button>
      <button id="inbox">Inbox 4</button>
    </div>
  );
}
`,
      giai: `// src/App.js — prop variant/size/disabled của React-Bootstrap sinh đúng class Bootstrap
${IMPORT}import { Badge, Button } from 'react-bootstrap';

export default function App() {
  return (
    <div className="p-3 d-flex flex-wrap gap-2">
      <Button id="btn-save" variant="primary">Save</Button>
      <Button id="btn-delete" variant="outline-danger">Delete</Button>
      <Button id="btn-ok" variant="success" size="sm">OK</Button>
      <Button id="btn-off" variant="secondary" disabled>Off</Button>
      <Button id="inbox" variant="light">
        Inbox <Badge pill bg="info">4</Badge>
      </Button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Primary and outline-danger buttons', kiem: 'so-luong', selector: '#btn-save.btn.btn-primary, #btn-delete.btn.btn-outline-danger', giaTri: 2 },
        { moTa: 'Small success button', kiem: 'ton-tai', selector: '#btn-ok.btn-success.btn-sm' },
        { moTa: 'Disabled secondary button', kiem: 'thuoc-tinh-js', selector: '#btn-off.btn-secondary', thuocTinh: 'disabled', giaTri: true },
        { moTa: 'Pill info badge with 4', kiem: 'text', selector: '#inbox .badge.rounded-pill.bg-info', giaTri: '4' },
      ],
    }),
    reactNho({
      tieuDe: 'Responsive product grid with breakpoints',
      doKho: 'MEDIUM', phut: 12, thuVien: RB,
      khaiNiem: ['breakpoints', 'xs/sm/lg', 'gutters', 'responsive display'], the: ['bootstrap', 'responsive'],
      moTa: {
        en: '<p>One column on phones, two from <code>sm</code>, four from <code>lg</code>. Also hide a promo sidebar on small screens with display utilities.</p>',
        vi: '<p>Một cột trên điện thoại, hai cột từ <code>sm</code>, bốn cột từ <code>lg</code>. Đồng thời ẩn thanh quảng cáo trên màn hình nhỏ bằng tiện ích display.</p>',
      },
      yeuCau: [
        { en: '<code>Row id="grid" className="g-3"</code>; each of the 8 products in <code>Col xs={12} sm={6} lg={3}</code> with class <code>product</code>.', vi: '<code>Row id="grid" className="g-3"</code>; 8 sản phẩm, mỗi cái trong <code>Col xs={12} sm={6} lg={3}</code> có class <code>product</code>.' },
        { en: '<code>aside#promo</code> has <code>d-none d-md-block</code> (hidden below md).', vi: '<code>aside#promo</code> có <code>d-none d-md-block</code> (ẩn dưới md).' },
      ],
      viDu: [{ input: '<Col xs={12} sm={6} lg={3}>', output: 'class="col-12 col-sm-6 col-lg-3"', explanation: 'Mobile-first: a class applies from its breakpoint upward.|||Mobile-first: class áp từ mốc của nó trở lên.' }],
      goiY: ['Array.from({ length: 8 }, (_, i) => …) để tạo 8 sản phẩm.', 'Ẩn trên mobile, hiện từ md: className="d-none d-md-block".'],
      loiHayGap: ['Viết <code>lg={3}</code> mà quên <code>xs={12}</code> ⇒ dưới lg là cột tự co (auto), không phải 1 cột rõ ràng.', 'Nghĩ <code>d-md-none</code> là "ẩn trên md" — nó ẩn từ md TRỞ LÊN.'],
      thuatNgu: [{ en: 'mobile-first', vi: 'thiết kế cho điện thoại trước, mở rộng dần lên màn hình lớn' }, { en: 'breakpoint', vi: 'mốc bề rộng (sm 576 · md 768 · lg 992 · xl 1200 · xxl 1400)' }],
      giaiThich: '<p>Bootstrap là mobile-first: <code>col-sm-6</code> nghĩa là "từ sm trở lên rộng 6/12". Ghép nhiều mốc trên cùng một cột để đổi bố cục theo màn hình. Tiện ích <code>d-none d-md-block</code> = ẩn mặc định, hiện từ md.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Container, Row, Col } from 'react-bootstrap';

export default function App() {
  return (
    <Container>
      <aside id="promo">Free shipping this week!</aside>
      <Row id="grid">
        {Array.from({ length: 8 }, (_, i) => <Col key={i} className="product">Product {i + 1}</Col>)}
      </Row>
    </Container>
  );
}
`,
      giai: `// src/App.js — mobile-first: 1 cột (xs) → 2 cột (sm) → 4 cột (lg)
${IMPORT}import { Col, Container, Row } from 'react-bootstrap';

const PRODUCTS = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: ´Product @{i + 1}´ }));

export default function App() {
  return (
    <Container className="py-3">
      {/* ẩn dưới md, hiện từ md trở lên */}
      <aside id="promo" className="d-none d-md-block alert alert-warning">Free shipping this week!</aside>
      <Row id="grid" className="g-3">
        {PRODUCTS.map((p) => (
          <Col key={p.id} xs={12} sm={6} lg={3} className="product">
            <div className="border rounded p-3">{p.name}</div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
`,
      kiem: [
        { moTa: '8 product columns', kiem: 'so-luong', selector: '#grid > .product', giaTri: 8 },
        { moTa: 'Each column is col-12 col-sm-6 col-lg-3', kiem: 'so-luong', selector: '#grid > .product.col-12.col-sm-6.col-lg-3', giaTri: 8 },
        { moTa: 'Row has gutter g-3', kiem: 'ton-tai', selector: '#grid.row.g-3' },
        { moTa: 'Promo hidden below md', kiem: 'ton-tai', selector: '#promo.d-none.d-md-block' },
      ],
    }),
    reactNho({
      tieuDe: 'Utility classes: flex, spacing and text',
      doKho: 'MEDIUM', phut: 10, thuVien: RB,
      khaiNiem: ['flex utilities', 'spacing scale', 'text utilities'], the: ['bootstrap', 'utilities'],
      moTa: {
        en: '<p>Build a profile header using only utility classes (no custom CSS): a flex row with space between and centered items, spacing from the 0–5 scale, and text/background helpers.</p>',
        vi: '<p>Dựng phần đầu hồ sơ chỉ bằng class tiện ích (không viết CSS): hàng flex dàn đều hai đầu, căn giữa theo chiều dọc, khoảng cách theo thang 0–5, và các class chữ/nền.</p>',
      },
      yeuCau: [
        { en: '<code>#header</code>: <code>d-flex justify-content-between align-items-center p-4 mb-3 bg-light rounded shadow-sm</code>.', vi: '<code>#header</code>: <code>d-flex justify-content-between align-items-center p-4 mb-3 bg-light rounded shadow-sm</code>.' },
        { en: '<code>#name</code> <code>fw-bold fs-4</code>; <code>#role</code> <code>text-muted small</code>; <code>#about</code> <code>text-center text-uppercase</code>.', vi: '<code>#name</code> <code>fw-bold fs-4</code>; <code>#role</code> <code>text-muted small</code>; <code>#about</code> <code>text-center text-uppercase</code>.' },
      ],
      viDu: [{ input: 'p-4 mb-3', output: 'padding 1.5rem · margin-bottom 1rem', explanation: 'Spacing scale: 1 = .25rem, 2 = .5rem, 3 = 1rem, 4 = 1.5rem, 5 = 3rem.|||Thang khoảng cách: 1 = .25rem, 2 = .5rem, 3 = 1rem, 4 = 1.5rem, 5 = 3rem.' }],
      goiY: ['Thuộc tính viết tắt: p = padding, m = margin; t/b/s/e/x/y = top/bottom/start/end/ngang/dọc.', 'justify-content-* là trục chính (ngang), align-items-* là trục phụ (dọc).'],
      loiHayGap: ['<code>ml-3</code>/<code>mr-3</code> là Bootstrap 4 — Bootstrap 5 đổi thành <code>ms-3</code>/<code>me-3</code>.', 'Dùng <code>text-bold</code> (không tồn tại) thay vì <code>fw-bold</code>.'],
      thuatNgu: [{ en: 'utility class', vi: 'class tiện ích làm một việc nhỏ' }, { en: 'main / cross axis', vi: 'trục chính / trục phụ của flex' }],
      giaiThich: '<p>Class tiện ích giúp dựng bố cục nhanh mà không viết CSS. Nhớ hai nhóm: flex (<code>d-flex</code>, <code>justify-content-*</code>, <code>align-items-*</code>) và spacing (<code>{p|m}{t|b|s|e|x|y}-{0..5}</code>). Bootstrap 5 dùng start/end (<code>ms/me</code>) để hỗ trợ RTL.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}
export default function App() {
  return (
    <div>
      <div id="header">
        <div>
          <div id="name">Nguyen Van An</div>
          <div id="role">Frontend Developer</div>
        </div>
        <button className="btn btn-primary">Follow</button>
      </div>
      <p id="about">React · TypeScript · UI</p>
    </div>
  );
}
`,
      giai: `// src/App.js — chỉ dùng class tiện ích, không viết CSS riêng
${IMPORT}
export default function App() {
  return (
    <div className="container py-3">
      <div id="header" className="d-flex justify-content-between align-items-center p-4 mb-3 bg-light rounded shadow-sm">
        <div>
          <div id="name" className="fw-bold fs-4">Nguyen Van An</div>
          <div id="role" className="text-muted small">Frontend Developer</div>
        </div>
        <button type="button" className="btn btn-primary">Follow</button>
      </div>
      <p id="about" className="text-center text-uppercase">React · TypeScript · UI</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: '#header is a spaced, centered flex row', kiem: 'ton-tai', selector: '#header.d-flex.justify-content-between.align-items-center' },
        { moTa: '#header spacing and surface', kiem: 'ton-tai', selector: '#header.p-4.mb-3.bg-light.rounded.shadow-sm' },
        { moTa: 'Text utilities on name/role/about', kiem: 'so-luong', selector: '#name.fw-bold.fs-4, #role.text-muted.small, #about.text-center.text-uppercase', giaTri: 3 },
        { an: true, moTa: 'No Bootstrap 4 margin classes (ml-/mr-)', kiem: 'ma-nguon', khop: '\\b(ml|mr|pl|pr)-\\d', phuDinh: true },
      ],
    }),
  ],
});

/**
 * FER202 · Exercise 6 — Build a layout with the Bootstrap grid (bài luyện React-Bootstrap).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const RB = ['react-bootstrap', 'bootstrap'];
const IMPORT = "import 'bootstrap/dist/css/bootstrap.min.css';\n";

export default doiDau({
  slug: 'fer202-4-ex6-grid-layout',
  ten: '4.5 Exercise 6 — Layouts with the Bootstrap grid',
  khoa: KHOA,
  baiHoc: 'fer202-4-ex6-grid-layout',
  de: [
    reactNho({
      tieuDe: 'Page layout: header, sidebar, main and footer',
      doKho: 'EASY', phut: 10, thuVien: RB,
      khaiNiem: ['Row', 'Col', 'layout'], the: ['bootstrap', 'grid', 'layout'],
      moTa: {
        en: '<p>Build the classic page skeleton with the grid: a full-width header, a sidebar of 3 columns and a main area of 9 columns from <code>md</code>, and a full-width footer.</p>',
        vi: '<p>Dựng khung trang kinh điển bằng lưới: header rộng hết, thanh bên 3 cột và vùng chính 9 cột từ <code>md</code>, footer rộng hết.</p>',
      },
      yeuCau: [
        { en: '<code>Container fluid</code>; rows: <code>header#top</code> (<code>Col xs={12}</code>), then <code>aside#sidebar</code> (<code>Col md={3}</code>) + <code>main#content</code> (<code>Col md={9}</code>), then <code>footer#bottom</code> (<code>Col xs={12}</code>).', vi: '<code>Container fluid</code>; các hàng: <code>header#top</code> (<code>Col xs={12}</code>), rồi <code>aside#sidebar</code> (<code>Col md={3}</code>) + <code>main#content</code> (<code>Col md={9}</code>), rồi <code>footer#bottom</code> (<code>Col xs={12}</code>).' },
        { en: 'Render each area as the Col itself: <code>&lt;Col as="aside" md={3} id="sidebar"&gt;</code>.', vi: 'Mỗi vùng chính là Col: <code>&lt;Col as="aside" md={3} id="sidebar"&gt;</code>.' },
      ],
      viDu: [{ input: '<Col as="main" md={9} id="content">', output: '<main id="content" class="col-md-9">', explanation: 'The "as" prop changes the rendered tag but keeps the grid classes.|||Prop "as" đổi thẻ được vẽ nhưng giữ class lưới.' }],
      goiY: ['<Container fluid> sinh class container-fluid (rộng 100%).', 'Ba <Row> riêng cho header, phần giữa, footer.'],
      loiHayGap: ['Đặt sidebar + main trong hai Row khác nhau ⇒ chúng không nằm cạnh nhau.', '3 + 9 ≠ 12 (vd 3 + 10) ⇒ main rớt xuống dòng.'],
      thuatNgu: [{ en: 'skeleton', vi: 'khung trang' }, { en: 'semantic tag', vi: 'thẻ mang nghĩa (header, main, aside, footer)' }],
      giaiThich: '<p>Prop <code>as</code> giúp giữ HTML ngữ nghĩa (header/aside/main/footer) mà vẫn là cột lưới. Sidebar + main nằm cùng một hàng và cộng đủ 12 cột.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}
export default function App() {
  return (
    <div>
      <header id="top">Header</header>
      <aside id="sidebar">Sidebar</aside>
      <main id="content">Main</main>
      <footer id="bottom">Footer</footer>
    </div>
  );
}
`,
      giai: `// src/App.js — 3 hàng; hàng giữa 3 + 9 = 12 cột; "as" giữ thẻ ngữ nghĩa
${IMPORT}import { Col, Container, Row } from 'react-bootstrap';

export default function App() {
  return (
    <Container fluid>
      <Row>
        <Col as="header" xs={12} id="top" className="bg-dark text-white p-3">Header</Col>
      </Row>
      <Row>
        <Col as="aside" md={3} id="sidebar" className="bg-light p-3">Sidebar</Col>
        <Col as="main" md={9} id="content" className="p-3">Main</Col>
      </Row>
      <Row>
        <Col as="footer" xs={12} id="bottom" className="bg-secondary text-white p-3">Footer</Col>
      </Row>
    </Container>
  );
}
`,
      kiem: [
        { moTa: 'Fluid container with three rows', kiem: 'so-luong', selector: '.container-fluid > .row', giaTri: 3 },
        { moTa: 'Sidebar col-md-3 and main col-md-9 share a row', kiem: 'so-luong', selector: '.row > aside#sidebar.col-md-3 + main#content.col-md-9', giaTri: 1 },
        { moTa: 'Header and footer are col-12', kiem: 'so-luong', selector: 'header#top.col-12, footer#bottom.col-12', giaTri: 2 },
      ],
    }),
    reactNho({
      tieuDe: 'Offsets and responsive ordering',
      doKho: 'MEDIUM', phut: 12, thuVien: RB,
      khaiNiem: ['offset', 'order', 'responsive object props'], the: ['bootstrap', 'grid'],
      moTa: {
        en: '<p>Two layouts: (1) a login card centered with an offset; (2) an article with a "related" column that is shown FIRST on phones but on the RIGHT on desktops.</p>',
        vi: '<p>Hai bố cục: (1) thẻ đăng nhập căn giữa bằng offset; (2) bài viết có cột "liên quan" hiện TRƯỚC trên điện thoại nhưng nằm BÊN PHẢI trên máy tính.</p>',
      },
      yeuCau: [
        { en: '<code>#login</code>: <code>Col md={{ span: 6, offset: 3 }}</code>.', vi: '<code>#login</code>: <code>Col md={{ span: 6, offset: 3 }}</code>.' },
        { en: '<code>#article</code> <code>Col md={8}</code> with <code>order-2 order-md-1</code>; <code>#related</code> <code>Col md={4}</code> with <code>order-1 order-md-2</code> (use the <code>xs</code>/<code>md</code> object form).', vi: '<code>#article</code> <code>Col md={8}</code> với <code>order-2 order-md-1</code>; <code>#related</code> <code>Col md={4}</code> với <code>order-1 order-md-2</code> (dùng dạng object của <code>xs</code>/<code>md</code>).' },
      ],
      viDu: [{ input: '<Col xs={{ order: 2 }} md={{ span: 8, order: 1 }}>', output: 'class="order-2 col-md-8 order-md-1"', explanation: 'Visual order changes; the HTML order stays the same (good for screen readers).|||Thứ tự hiển thị đổi; thứ tự HTML giữ nguyên (tốt cho trình đọc màn hình).' }],
      goiY: ['Offset: md={{ span: 6, offset: 3 }}.', 'Order theo mốc: xs={{ order: 2 }} md={{ span: 8, order: 1 }}.'],
      loiHayGap: ['Đổi thứ tự bằng cách đảo thứ tự JSX ⇒ desktop đúng nhưng mobile sai (hoặc ngược lại).', 'Căn giữa bằng <code>mx-auto</code> trên div không có bề rộng.'],
      thuatNgu: [{ en: 'offset', vi: 'khoảng trống cột bên trái' }, { en: 'visual order', vi: 'thứ tự hiển thị' }],
      giaiThich: '<p>Prop dạng object (<code>{ span, offset, order }</code>) của <code>Col</code> sinh <code>col-md-6 offset-md-3</code>, <code>order-md-1</code>… Đổi thứ tự bằng class <code>order-*</code> giữ HTML ổn định cho SEO và trình đọc màn hình.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Col, Container, Row } from 'react-bootstrap';

export default function App() {
  return (
    <Container>
      <Row>
        <Col id="login">Login form</Col>
      </Row>
      <Row>
        <Col id="article">Article</Col>
        <Col id="related">Related posts</Col>
      </Row>
    </Container>
  );
}
`,
      giai: `// src/App.js — offset để căn giữa; order theo mốc để đổi vị trí trên mobile/desktop
${IMPORT}import { Col, Container, Row } from 'react-bootstrap';

export default function App() {
  return (
    <Container className="py-3">
      <Row className="mb-4">
        <Col id="login" md={{ span: 6, offset: 3 }} className="border rounded p-3">Login form</Col>
      </Row>
      <Row>
        <Col id="article" xs={{ order: 2 }} md={{ span: 8, order: 1 }}>Article</Col>
        <Col id="related" xs={{ order: 1 }} md={{ span: 4, order: 2 }}>Related posts</Col>
      </Row>
    </Container>
  );
}
`,
      kiem: [
        { moTa: '#login is col-md-6 offset-md-3', kiem: 'ton-tai', selector: '#login.col-md-6.offset-md-3' },
        { moTa: '#article: col-md-8 order-2 order-md-1', kiem: 'ton-tai', selector: '#article.col-md-8.order-2.order-md-1' },
        { moTa: '#related: col-md-4 order-1 order-md-2', kiem: 'ton-tai', selector: '#related.col-md-4.order-1.order-md-2' },
        { an: true, moTa: 'HTML order unchanged (article before related)', kiem: 'thu-tu', cacSelector: ['#article', '#related'] },
      ],
    }),
    reactNho({
      tieuDe: 'Nested rows and equal-width columns',
      doKho: 'MEDIUM', phut: 10, thuVien: RB,
      khaiNiem: ['nesting', 'auto-layout', 'xs="auto"'], the: ['bootstrap', 'grid'],
      moTa: {
        en: '<p>Inside a <code>Col md={8}</code>, nest a new <code>Row</code> with two equal columns. Below it, build a toolbar row of three auto-layout columns: two that size to their content (<code>xs="auto"</code>) and one that fills the rest.</p>',
        vi: '<p>Trong <code>Col md={8}</code>, lồng một <code>Row</code> mới có hai cột bằng nhau. Bên dưới, dựng hàng công cụ ba cột tự động: hai cột co theo nội dung (<code>xs="auto"</code>) và một cột chiếm phần còn lại.</p>',
      },
      yeuCau: [
        { en: '<code>#main</code> is <code>Col md={8}</code> containing <code>Row#stats</code> with two <code>Col xs={6}</code>.', vi: '<code>#main</code> là <code>Col md={8}</code> chứa <code>Row#stats</code> có hai <code>Col xs={6}</code>.' },
        { en: '<code>Row#toolbar</code>: <code>Col xs="auto"</code>, <code>Col</code> (no size), <code>Col xs="auto"</code>.', vi: '<code>Row#toolbar</code>: <code>Col xs="auto"</code>, <code>Col</code> (không kích thước), <code>Col xs="auto"</code>.' },
      ],
      viDu: [{ input: '<Col>', output: 'class="col"', explanation: 'Columns without a size share the remaining space equally.|||Cột không có kích thước chia đều phần còn lại.' }],
      goiY: ['Lưới lồng: đặt <Row> BÊN TRONG một <Col>, các cột con lại tính theo 12 phần của cột cha.', '<Col xs="auto"> sinh col-auto.'],
      loiHayGap: ['Lồng <code>Col</code> trực tiếp trong <code>Col</code> (thiếu <code>Row</code>) ⇒ không thành lưới.', 'Nghĩ cột lồng tính theo 12 cột của TRANG — thật ra là 12 phần của cột cha.'],
      thuatNgu: [{ en: 'nested grid', vi: 'lưới lồng' }, { en: 'auto-layout', vi: 'cột tự tính bề rộng' }],
      giaiThich: '<p>Mỗi <code>Row</code> lồng chia lại 12 phần bề rộng của cột cha. <code>Col</code> không số chia đều, <code>col-auto</code> co theo nội dung — tiện cho thanh công cụ (nút hai đầu, ô tìm ở giữa).</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Col, Container, Row } from 'react-bootstrap';

export default function App() {
  return (
    <Container>
      <Row>
        <Col id="main">Visitors 120 · Sales 45</Col>
        <Col id="side">Side</Col>
      </Row>
      <Row id="toolbar">
        <Col>Back</Col>
        <Col>Search box</Col>
        <Col>Save</Col>
      </Row>
    </Container>
  );
}
`,
      giai: `// src/App.js — Row lồng trong Col (chia lại 12 phần của cột cha) + cột tự động
${IMPORT}import { Col, Container, Row } from 'react-bootstrap';

export default function App() {
  return (
    <Container className="py-3">
      <Row className="mb-3">
        <Col id="main" md={8}>
          <Row id="stats">
            <Col xs={6} className="border p-2">Visitors 120</Col>
            <Col xs={6} className="border p-2">Sales 45</Col>
          </Row>
        </Col>
        <Col id="side" md={4}>Side</Col>
      </Row>
      <Row id="toolbar" className="align-items-center g-2">
        <Col xs="auto"><button type="button" className="btn btn-light">Back</button></Col>
        <Col><input className="form-control" placeholder="Search box" /></Col>
        <Col xs="auto"><button type="button" className="btn btn-primary">Save</button></Col>
      </Row>
    </Container>
  );
}
`,
      kiem: [
        { moTa: '#main col-md-8 contains a nested row of two col-6', kiem: 'so-luong', selector: '#main.col-md-8 > #stats.row > .col-6', giaTri: 2 },
        { moTa: 'Toolbar: auto · fill · auto', kiem: 'so-luong', selector: '#toolbar > .col-auto, #toolbar > .col', giaTri: 3 },
        { moTa: 'Exactly one filling column', kiem: 'so-luong', selector: '#toolbar > .col', giaTri: 1 },
      ],
    }),
    reactNho({
      tieuDe: 'Gallery with row-cols and responsive gutters',
      doKho: 'HARD', phut: 12, thuVien: RB,
      khaiNiem: ['row-cols', 'gx/gy gutters', 'ratio helper'], the: ['bootstrap', 'grid'],
      moTa: {
        en: '<p>An image gallery: 2 per row on phones, 3 from <code>md</code>, 6 from <code>xl</code>, using <code>row-cols</code> on the Row (not sizes on every Col). Horizontal gutter 2, vertical gutter 4. Each tile keeps a 1:1 ratio.</p>',
        vi: '<p>Thư viện ảnh: 2 ảnh/hàng trên điện thoại, 3 từ <code>md</code>, 6 từ <code>xl</code>, dùng <code>row-cols</code> ở Row (không đặt kích thước từng Col). Gutter ngang 2, dọc 4. Mỗi ô giữ tỉ lệ 1:1.</p>',
      },
      yeuCau: [
        { en: '<code>Row id="gallery" xs={2} md={3} xl={6} className="gx-2 gy-4"</code> with 12 <code>Col</code>.', vi: '<code>Row id="gallery" xs={2} md={3} xl={6} className="gx-2 gy-4"</code> với 12 <code>Col</code>.' },
        { en: 'Each <code>Col</code> holds <code>Ratio aspectRatio="1x1"</code> wrapping an <code>img.tile</code>.', vi: 'Mỗi <code>Col</code> chứa <code>Ratio aspectRatio="1x1"</code> bọc một <code>img.tile</code>.' },
      ],
      viDu: [{ input: '<Row xs={2} md={3} xl={6}>', output: 'class="row row-cols-2 row-cols-md-3 row-cols-xl-6"', explanation: 'The row decides how many columns per line; children are plain <Col>.|||Row quyết định mỗi hàng bao nhiêu cột; con chỉ là <Col> trơn.' }],
      goiY: ['Prop số trên <Row> (xs/md/xl) là row-cols, không phải col.', "import { Ratio } from 'react-bootstrap'; <Ratio aspectRatio=\"1x1\"><img className=\"tile\" … /></Ratio>"],
      loiHayGap: ['Đặt <code>md={4}</code> cho từng Col VÀ <code>row-cols</code> cho Row ⇒ hai luật đè nhau.', 'Dùng <code>g-2</code> khi đề cần gutter ngang/dọc khác nhau.'],
      thuatNgu: [{ en: 'aspect ratio', vi: 'tỉ lệ khung hình' }, { en: 'row-cols', vi: 'số cột mỗi hàng đặt ở Row' }],
      giaiThich: '<p>Với lưới đồng đều, đặt số cột ở <code>Row</code> (<code>row-cols-*</code>) gọn hơn đặt từng <code>Col</code>. <code>gx-*</code>/<code>gy-*</code> chỉnh gutter từng trục; <code>Ratio</code> giữ tỉ lệ ô bất kể kích thước ảnh.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Col, Row } from 'react-bootstrap';

export default function App() {
  return (
    <Row id="gallery">
      {Array.from({ length: 12 }, (_, i) => <Col key={i} md={4}><img src={´https://api.dicebear.com/9.x/shapes/svg?seed=g@{i}´} alt="" /></Col>)}
    </Row>
  );
}
`,
      giai: `// src/App.js — row-cols ở Row quyết định số cột; Ratio giữ ô vuông
${IMPORT}import { Col, Container, Ratio, Row } from 'react-bootstrap';

const IMAGES = Array.from({ length: 12 }, (_, i) => ({ id: i, src: ´https://api.dicebear.com/9.x/shapes/svg?seed=g@{i}´ }));

export default function App() {
  return (
    <Container className="py-3">
      <Row id="gallery" xs={2} md={3} xl={6} className="gx-2 gy-4">
        {IMAGES.map((img) => (
          <Col key={img.id}>
            <Ratio aspectRatio="1x1">
              <img className="tile rounded object-fit-cover" src={img.src} alt={´Tile @{img.id + 1}´} />
            </Ratio>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
`,
      kiem: [
        { moTa: 'row-cols 2 / md 3 / xl 6', kiem: 'ton-tai', selector: '#gallery.row.row-cols-2.row-cols-md-3.row-cols-xl-6' },
        { moTa: 'Gutters gx-2 gy-4', kiem: 'ton-tai', selector: '#gallery.gx-2.gy-4' },
        { moTa: '12 square tiles', kiem: 'so-luong', selector: '#gallery > .col > .ratio.ratio-1x1 > img.tile', giaTri: 12 },
        { an: true, moTa: 'Cols carry no size classes', kiem: 'so-luong', selector: '#gallery > [class*="col-"]', giaTri: 0 },
      ],
    }),
  ],
});

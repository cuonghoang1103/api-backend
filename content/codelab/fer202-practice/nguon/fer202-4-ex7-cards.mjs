/**
 * FER202 · Exercise 7 — Cards column (bài luyện React-Bootstrap Card).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const RB = ['react-bootstrap', 'bootstrap'];
const IMPORT = "import 'bootstrap/dist/css/bootstrap.min.css';\n";
const COURSES = `const COURSES = [
  { id: 1, title: 'React Basics', text: 'Components, props and state.', level: 'Beginner', img: 'https://api.dicebear.com/9.x/shapes/svg?seed=react' },
  { id: 2, title: 'React Router', text: 'Pages, params and nested routes.', level: 'Intermediate', img: 'https://api.dicebear.com/9.x/shapes/svg?seed=router' },
  { id: 3, title: 'Redux Toolkit', text: 'Global state the modern way.', level: 'Advanced', img: 'https://api.dicebear.com/9.x/shapes/svg?seed=redux' },
  { id: 4, title: 'Testing React', text: 'Jest and Testing Library.', level: 'Advanced', img: 'https://api.dicebear.com/9.x/shapes/svg?seed=test' },
];`;

export default doiDau({
  slug: 'fer202-4-ex7-cards',
  ten: '4.6 Exercise 7 — Cards column',
  khoa: KHOA,
  baiHoc: 'fer202-4-ex7-cards',
  de: [
    reactNho({
      tieuDe: 'Card anatomy: image, body, footer',
      doKho: 'EASY', phut: 8, thuVien: RB,
      khaiNiem: ['Card', 'Card.Img', 'Card.Body', 'Card.Footer'], the: ['bootstrap', 'card'],
      moTa: {
        en: '<p>Build one complete card with every part in the right place: top image, body with title, subtitle, text and a button, and a muted footer.</p>',
        vi: '<p>Dựng một thẻ đầy đủ, mỗi phần đúng chỗ: ảnh trên cùng, phần thân có tiêu đề, phụ đề, nội dung và nút, và chân thẻ chữ mờ.</p>',
      },
      yeuCau: [
        { en: '<code>Card#course</code> (<code>style={{ width: \'18rem\' }}</code>): <code>Card.Img variant="top"</code>, <code>Card.Body</code> → <code>Card.Title</code> "React Basics", <code>Card.Subtitle</code> "Beginner", <code>Card.Text</code>, <code>Button</code> "Enroll".', vi: '<code>Card#course</code> (<code>style={{ width: \'18rem\' }}</code>): <code>Card.Img variant="top"</code>, <code>Card.Body</code> → <code>Card.Title</code> "React Basics", <code>Card.Subtitle</code> "Beginner", <code>Card.Text</code>, <code>Button</code> "Enroll".' },
        { en: '<code>Card.Footer className="text-muted"</code> "Updated 3 days ago".', vi: '<code>Card.Footer className="text-muted"</code> "Updated 3 days ago".' },
      ],
      viDu: [{ input: '<Card.Img variant="top" src=… />', output: '<img class="card-img-top">', explanation: 'variant="top" rounds only the top corners.|||variant="top" chỉ bo hai góc trên.' }],
      goiY: ['Card.Img nằm NGOÀI Card.Body; Title/Subtitle/Text/Button nằm TRONG Card.Body.', 'Card.Subtitle thường kèm className="mb-2 text-muted".'],
      loiHayGap: ['Đặt ảnh bên trong <code>Card.Body</code> ⇒ ảnh bị đệm lề, không sát mép thẻ.', 'Dùng <code>&lt;h5&gt;</code> trơn thay cho <code>Card.Title</code> ⇒ mất class <code>card-title</code>.'],
      thuatNgu: [{ en: 'card', vi: 'thẻ nội dung' }, { en: 'muted', vi: 'màu chữ nhạt' }],
      giaiThich: '<p>Cấu trúc thẻ: <code>.card</code> → (<code>.card-img-top</code>) → <code>.card-body</code> chứa <code>.card-title</code>/<code>.card-subtitle</code>/<code>.card-text</code> → <code>.card-footer</code>. React-Bootstrap đặt đúng class cho từng phần.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}
export default function App() {
  return (
    <div id="course">
      <img src="https://api.dicebear.com/9.x/shapes/svg?seed=react" alt="React" />
      <h5>React Basics</h5>
      <p>Components, props and state.</p>
      <button>Enroll</button>
    </div>
  );
}
`,
      giai: `// src/App.js — thẻ đầy đủ: Img (ngoài Body) → Body (Title, Subtitle, Text, Button) → Footer
${IMPORT}import { Button, Card } from 'react-bootstrap';

export default function App() {
  return (
    <div className="p-3">
      <Card id="course" style={{ width: '18rem' }}>
        <Card.Img variant="top" src="https://api.dicebear.com/9.x/shapes/svg?seed=react" alt="React" />
        <Card.Body>
          <Card.Title>React Basics</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Beginner</Card.Subtitle>
          <Card.Text>Components, props and state.</Card.Text>
          <Button variant="primary">Enroll</Button>
        </Card.Body>
        <Card.Footer className="text-muted">Updated 3 days ago</Card.Footer>
      </Card>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Top image is a direct child of the card', kiem: 'ton-tai', selector: '#course.card > img.card-img-top' },
        { moTa: 'Body parts in order', kiem: 'danh-sach-text', selector: '#course .card-body > *', mongDoi: ['React Basics', 'Beginner', 'Components, props and state.', 'Enroll'] },
        { moTa: 'Muted footer', kiem: 'text', selector: '#course > .card-footer.text-muted', giaTri: 'Updated 3 days ago' },
      ],
    }),
    reactNho({
      tieuDe: 'Cards column grid with equal heights',
      doKho: 'MEDIUM', phut: 12, thuVien: RB,
      khaiNiem: ['row-cols', 'h-100', 'Card list', 'Badge'], the: ['bootstrap', 'card', 'grid'],
      moTa: {
        en: '<p>Render the courses as a responsive "cards column": 1 per row on phones, 2 from <code>md</code>, 4 from <code>lg</code>, gutter 4. Cards in a row must have the same height even if their text differs (<code>h-100</code>).</p>',
        vi: '<p>Hiển thị các khoá học dạng "cột thẻ" responsive: 1 thẻ/hàng trên điện thoại, 2 từ <code>md</code>, 4 từ <code>lg</code>, gutter 4. Thẻ trong cùng hàng phải cao bằng nhau dù nội dung khác nhau (<code>h-100</code>).</p>',
      },
      yeuCau: [
        { en: '<code>Row id="courses" xs={1} md={2} lg={4} className="g-4"</code>; each course a <code>Col</code> → <code>Card.course-card.h-100</code>.', vi: '<code>Row id="courses" xs={1} md={2} lg={4} className="g-4"</code>; mỗi khoá một <code>Col</code> → <code>Card.course-card.h-100</code>.' },
        { en: 'Inside: image, title, text and a level <code>Badge</code> (Beginner = success, Intermediate = warning, Advanced = danger).', vi: 'Bên trong: ảnh, tiêu đề, nội dung và <code>Badge</code> cấp độ (Beginner = success, Intermediate = warning, Advanced = danger).' },
      ],
      viDu: [{ input: "level: 'Advanced'", output: '<span class="badge bg-danger">Advanced</span>', explanation: 'Map level → colour with a lookup object.|||Ánh xạ cấp độ → màu bằng object tra cứu.' }],
      goiY: ['<Row xs={1} md={2} lg={4} className="g-4"> rồi COURSES.map(c => <Col key={c.id}><Card className="course-card h-100">…</Card></Col>).', "const LEVEL_BG = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };"],
      loiHayGap: ['Thiếu <code>h-100</code> ⇒ thẻ cao thấp lệch nhau trong cùng hàng.', 'Map trực tiếp <code>Card</code> trong <code>Row</code> (không có <code>Col</code>) ⇒ gutter và row-cols không áp dụng.'],
      thuatNgu: [{ en: 'equal height', vi: 'cao bằng nhau' }],
      giaiThich: '<p>Cột flex trong hàng đã cao bằng nhau; <code>h-100</code> cho thẻ chiếm hết chiều cao cột đó. Màu badge theo cấp độ lấy từ object tra cứu — thêm cấp độ mới chỉ thêm một dòng.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}${COURSES}

export default function App() {
  return (
    <div id="courses">
      {COURSES.map((c) => <div key={c.id}>{c.title}</div>)}
    </div>
  );
}
`,
      giai: `// src/App.js — row-cols cho số thẻ mỗi hàng; h-100 cho thẻ cao bằng nhau
${IMPORT}import { Badge, Card, Col, Container, Row } from 'react-bootstrap';

${COURSES}

const LEVEL_BG = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };

export default function App() {
  return (
    <Container className="py-3">
      <Row id="courses" xs={1} md={2} lg={4} className="g-4">
        {COURSES.map((c) => (
          <Col key={c.id}>
            <Card className="course-card h-100">
              <Card.Img variant="top" src={c.img} alt={c.title} />
              <Card.Body>
                <Card.Title>{c.title}</Card.Title>
                <Card.Text>{c.text}</Card.Text>
                <Badge bg={LEVEL_BG[c.level]}>{c.level}</Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
`,
      kiem: [
        { moTa: 'row-cols 1 / md 2 / lg 4 with g-4', kiem: 'ton-tai', selector: '#courses.row.row-cols-1.row-cols-md-2.row-cols-lg-4.g-4' },
        { moTa: '4 equal-height cards inside cols', kiem: 'so-luong', selector: '#courses > .col > .card.course-card.h-100', giaTri: 4 },
        { moTa: 'Badge colours follow the level', kiem: 'danh-sach-text', selector: '.course-card .badge.bg-success, .course-card .badge.bg-warning, .course-card .badge.bg-danger', mongDoi: ['Beginner', 'Intermediate', 'Advanced', 'Advanced'] },
      ],
    }),
    reactNho({
      tieuDe: 'Horizontal card with a nested grid',
      doKho: 'MEDIUM', phut: 10, thuVien: RB,
      khaiNiem: ['horizontal card', 'g-0', 'img-fluid'], the: ['bootstrap', 'card'],
      moTa: {
        en: '<p>Make a horizontal card: image on the left (4 columns), content on the right (8 columns) from <code>md</code>; stacked on phones. Use a <code>Row className="g-0"</code> inside the card so there is no gap between image and body.</p>',
        vi: '<p>Làm thẻ nằm ngang: ảnh bên trái (4 cột), nội dung bên phải (8 cột) từ <code>md</code>; xếp chồng trên điện thoại. Dùng <code>Row className="g-0"</code> trong thẻ để ảnh và thân thẻ sát nhau.</p>',
      },
      yeuCau: [
        { en: '<code>Card#horizontal</code> → <code>Row.g-0</code> → <code>Col md={4}</code> with <code>img.img-fluid.rounded-start</code> + <code>Col md={8}</code> with <code>Card.Body</code> (title, text, <code>small.text-muted</code> "Last updated 5 mins ago").', vi: '<code>Card#horizontal</code> → <code>Row.g-0</code> → <code>Col md={4}</code> chứa <code>img.img-fluid.rounded-start</code> + <code>Col md={8}</code> chứa <code>Card.Body</code> (tiêu đề, nội dung, <code>small.text-muted</code> "Last updated 5 mins ago").' },
      ],
      viDu: [{ input: '<Row className="g-0">', output: 'no gutter between the two columns', explanation: 'g-0 removes the default gutter.|||g-0 bỏ gutter mặc định.' }],
      goiY: ['Dùng <img className="img-fluid rounded-start"> thay vì Card.Img để ảnh nằm trong cột.', 'Lưới bên trong thẻ: <Card><Row className="g-0"><Col md={4}>…</Col><Col md={8}>…</Col></Row></Card>.'],
      loiHayGap: ['Quên <code>g-0</code> ⇒ khe trắng giữa ảnh và chữ.', 'Ảnh không có <code>img-fluid</code> ⇒ tràn khỏi cột.'],
      thuatNgu: [{ en: 'rounded-start', vi: 'bo góc phía bắt đầu (bên trái)' }],
      giaiThich: '<p>Thẻ ngang là một lưới lồng trong thẻ: hàng không gutter, ảnh co giãn trong cột 4, thân thẻ trong cột 8. Dưới md hai cột thành 100% và xếp chồng.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Card } from 'react-bootstrap';

export default function App() {
  return (
    <Card id="horizontal">
      <Card.Img src="https://api.dicebear.com/9.x/shapes/svg?seed=hz" />
      <Card.Body>
        <Card.Title>Modern JavaScript</Card.Title>
        <Card.Text>ES6+ features every React developer uses.</Card.Text>
      </Card.Body>
    </Card>
  );
}
`,
      giai: `// src/App.js — thẻ ngang: lưới g-0 trong thẻ, ảnh 4 cột + thân 8 cột từ md
${IMPORT}import { Card, Col, Container, Row } from 'react-bootstrap';

export default function App() {
  return (
    <Container className="py-3">
      <Card id="horizontal" style={{ maxWidth: 560 }}>
        <Row className="g-0">
          <Col md={4}>
            <img src="https://api.dicebear.com/9.x/shapes/svg?seed=hz" className="img-fluid rounded-start" alt="Modern JavaScript" />
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title>Modern JavaScript</Card.Title>
              <Card.Text>ES6+ features every React developer uses.</Card.Text>
              <Card.Text><small className="text-muted">Last updated 5 mins ago</small></Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
`,
      kiem: [
        { moTa: 'Card contains a g-0 row', kiem: 'ton-tai', selector: '#horizontal.card > .row.g-0' },
        { moTa: 'Image column md-4, body column md-8', kiem: 'so-luong', selector: '#horizontal .col-md-4 > img.img-fluid.rounded-start, #horizontal .col-md-8 > .card-body', giaTri: 2 },
        { moTa: 'Muted "last updated" note', kiem: 'text', selector: '#horizontal small.text-muted', giaTri: 'Last updated 5 mins ago' },
      ],
    }),
  ],
});

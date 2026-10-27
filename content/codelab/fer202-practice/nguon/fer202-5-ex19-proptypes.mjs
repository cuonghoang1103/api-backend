/**
 * FER202 · Exercise 19 — PropTypes (validation in a component).
 * Lưu ý máy chấm: React/PropTypes bản production không in cảnh báo ⇒ phần khai báo PropTypes chấm bằng mã
 * nguồn; phần hành vi (hiển thị, giá trị mặc định) chấm bằng giao diện; validator tự viết chấm bằng máy chấm JS.
 */
import { doiDau, jsNho, KHOA, reactNho } from './_chung.mjs';

const PT = ['prop-types'];

export default doiDau({
  slug: 'fer202-5-ex19-proptypes',
  ten: '5.7 Exercise 19 — PropTypes',
  khoa: KHOA,
  baiHoc: 'fer202-5-ex19-proptypes',
  de: [
    reactNho({
      tieuDe: 'Animal cards with PropTypes (Exercise 19)',
      doKho: 'EASY', phut: 10, thuVien: PT,
      khaiNiem: ['PropTypes', 'isRequired', 'arrayOf', 'shape'], the: ['proptypes', 'exercise-19'],
      moTa: {
        en: '<p>Exercise 19 asks for an <code>Animal</code> component with several typed props, reused over an array — and PropTypes declared for <b>every</b> prop.</p>',
        vi: '<p>Exercise 19 yêu cầu component <code>Animal</code> có nhiều prop có kiểu, dùng lại trên một mảng — và khai PropTypes cho <b>mọi</b> prop.</p>',
      },
      yeuCau: [
        { en: '<code>div.animal</code>: <code>h3</code> "Lion <em>(Panthera leo)</em>", <code>p.size</code> "Size: 140 kg", <code>p.diet</code> "Diet: meat", and <code>p.notes</code> only when <code>additional.notes</code> exists.', vi: '<code>div.animal</code>: <code>h3</code> "Lion <em>(Panthera leo)</em>", <code>p.size</code> "Size: 140 kg", <code>p.diet</code> "Diet: meat", và <code>p.notes</code> chỉ khi có <code>additional.notes</code>.' },
        { en: '<code>Animal.propTypes</code>: name/scientificName string required, size number required, diet <code>arrayOf(string)</code> required, additional <code>shape({ notes: string })</code>.', vi: '<code>Animal.propTypes</code>: name/scientificName chuỗi bắt buộc, size số bắt buộc, diet <code>arrayOf(string)</code> bắt buộc, additional <code>shape({ notes: string })</code>.' },
      ],
      viDu: [{ input: "{ name: 'Gorilla', size: 205, diet: ['plants', 'insects'], additional: { notes: 'endangered' } }", output: 'Diet: plants, insects · Notes: endangered', explanation: 'In development, size: "140" (a string) would log a PropTypes warning.|||Ở chế độ development, size: "140" (chuỗi) sẽ in cảnh báo PropTypes.' }],
      goiY: ["import PropTypes from 'prop-types';", 'Animal.propTypes = { name: PropTypes.string.isRequired, …, additional: PropTypes.shape({ notes: PropTypes.string }) };'],
      loiHayGap: ['Viết <code>Animal.PropTypes</code> (chữ P hoa) ⇒ React bỏ qua, không kiểm gì.', '<code>PropTypes.array</code> thay vì <code>arrayOf(PropTypes.string)</code> ⇒ không kiểm phần tử.'],
      thuatNgu: [{ en: 'type checking', vi: 'kiểm kiểu dữ liệu' }, { en: 'shape', vi: 'hình dạng object (các khoá và kiểu của chúng)' }],
      giaiThich: '<p>PropTypes chỉ kiểm ở chế độ development và chỉ CẢNH BÁO (không chặn render) — nó là tài liệu sống về "component này nhận gì". Thuộc tính tĩnh tên <code>propTypes</code> (chữ p thường) gắn vào component.</p>',
      dau: `// src/App.js — STARTER
const ANIMALS = [
  { name: 'Lion', scientificName: 'Panthera leo', size: 140, diet: ['meat'] },
  { name: 'Gorilla', scientificName: 'Gorilla beringei', size: 205, diet: ['plants', 'insects'], additional: { notes: 'endangered' } },
];

function Animal(props) {
  return <div className="animal">{props.name}</div>;
}

export default function App() {
  return <div>{ANIMALS.map((a) => <Animal key={a.name} {...a} />)}</div>;
}
`,
      giai: `// src/App.js — Animal với PropTypes cho MỌI prop
import PropTypes from 'prop-types';

const ANIMALS = [
  { name: 'Lion', scientificName: 'Panthera leo', size: 140, diet: ['meat'] },
  { name: 'Gorilla', scientificName: 'Gorilla beringei', size: 205, diet: ['plants', 'insects'], additional: { notes: 'endangered' } },
];

function Animal({ name, scientificName, size, diet, additional }) {
  return (
    <div className="animal">
      <h3>{name} <em>({scientificName})</em></h3>
      <p className="size">Size: {size} kg</p>
      <p className="diet">Diet: {diet.join(', ')}</p>
      {additional?.notes && <p className="notes">Notes: {additional.notes}</p>}
    </div>
  );
}

Animal.propTypes = {
  name: PropTypes.string.isRequired,
  scientificName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  diet: PropTypes.arrayOf(PropTypes.string).isRequired,
  additional: PropTypes.shape({ notes: PropTypes.string }),
};

export default function App() {
  return <div>{ANIMALS.map((a) => <Animal key={a.name} {...a} />)}</div>;
}
`,
      kiem: [
        { moTa: 'Headings with scientific names', kiem: 'danh-sach-text', selector: '.animal h3', mongDoi: ['Lion (Panthera leo)', 'Gorilla (Gorilla beringei)'] },
        { moTa: 'Diet joined, notes only for the gorilla', kiem: 'danh-sach-text', selector: '.animal .diet, .animal .notes', mongDoi: ['Diet: meat', 'Diet: plants, insects', 'Notes: endangered'] },
        { moTa: 'Animal.propTypes declared', kiem: 'ma-nguon', khop: 'Animal\\.propTypes\\s*=' },
        { moTa: 'arrayOf and shape are used', kiem: 'ma-nguon', khop: 'PropTypes\\.arrayOf\\(\\s*PropTypes\\.string\\s*\\)[\\s\\S]*PropTypes\\.shape\\(|PropTypes\\.shape\\([\\s\\S]*PropTypes\\.arrayOf\\(\\s*PropTypes\\.string\\s*\\)' },
        { an: true, moTa: 'size is a required number', kiem: 'ma-nguon', khop: 'size:\\s*PropTypes\\.number\\.isRequired' },
      ],
    }),
    reactNho({
      tieuDe: 'oneOf, oneOfType and default values',
      doKho: 'MEDIUM', phut: 10, thuVien: PT,
      khaiNiem: ['PropTypes.oneOf', 'oneOfType', 'default parameters'], the: ['proptypes'],
      moTa: {
        en: '<p><code>Avatar</code> accepts a <code>size</code> from a fixed list and a <code>user</code> that can be either a string name or an object. Validate both, and give <code>size</code> a default.</p>',
        vi: '<p><code>Avatar</code> nhận <code>size</code> trong một danh sách cố định và <code>user</code> có thể là chuỗi tên hoặc object. Kiểm cả hai, và cho <code>size</code> giá trị mặc định.</p>',
      },
      yeuCau: [
        { en: '<code>size</code>: <code>oneOf([\'sm\', \'md\', \'lg\'])</code>, default <code>md</code> ⇒ class <code>avatar avatar-md</code>; pixel width sm 32, md 48, lg 72.', vi: '<code>size</code>: <code>oneOf([\'sm\', \'md\', \'lg\'])</code>, mặc định <code>md</code> ⇒ class <code>avatar avatar-md</code>; rộng sm 32, md 48, lg 72 px.' },
        { en: '<code>user</code>: <code>oneOfType([string, shape({ name, photo })])</code>; initials from the name when there is no photo (<code>span.initials</code> "NA").', vi: '<code>user</code>: <code>oneOfType([string, shape({ name, photo })])</code>; không có ảnh thì hiện chữ viết tắt (<code>span.initials</code> "NA").' },
      ],
      viDu: [{ input: '<Avatar user="Nguyen An" />', output: '<span class="avatar avatar-md"><span class="initials">NA</span></span>', explanation: 'A string user is treated as { name }.|||user là chuỗi thì coi như { name }.' }],
      goiY: ["const u = typeof user === 'string' ? { name: user } : user;", "Avatar.propTypes = { size: PropTypes.oneOf(['sm','md','lg']), user: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ name: PropTypes.string.isRequired, photo: PropTypes.string })]).isRequired };"],
      loiHayGap: ['Khai <code>size: PropTypes.string</code> ⇒ "huge" vẫn lọt.', 'Đặt mặc định bằng <code>defaultProps</code> trên function component (đang bị bỏ).'],
      thuatNgu: [{ en: 'union type', vi: 'kiểu "một trong các kiểu"' }, { en: 'initials', vi: 'chữ cái đầu' }],
      giaiThich: '<p><code>oneOf</code> giới hạn giá trị, <code>oneOfType</code> cho phép nhiều kiểu. Chuẩn hoá đầu vào (chuỗi → object) ngay đầu component giúp phần còn lại chỉ xử lý một dạng.</p>',
      dau: `// src/App.js — STARTER
function Avatar({ user, size }) {
  return <span className="avatar">{user}</span>;
}

export default function App() {
  return (
    <div>
      <Avatar user="Nguyen An" />
      <Avatar user={{ name: 'Tran Binh', photo: 'https://api.dicebear.com/9.x/shapes/svg?seed=binh' }} size="lg" />
      <Avatar user="Le Cuong" size="sm" />
    </div>
  );
}
`,
      giai: `// src/App.js — oneOf cho giá trị cố định, oneOfType cho nhiều kiểu, mặc định ở tham số
import PropTypes from 'prop-types';

const PX = { sm: 32, md: 48, lg: 72 };
const initialsOf = (name) => name.trim().split(/\\s+/).map((w) => w[0].toUpperCase()).slice(0, 2).join('');

function Avatar({ user, size = 'md' }) {
  const u = typeof user === 'string' ? { name: user } : user; // chuẩn hoá về một dạng
  return (
    <span className={´avatar avatar-@{size}´} style={{ width: PX[size], height: PX[size], display: 'inline-flex' }}>
      {u.photo ? <img src={u.photo} alt={u.name} width={PX[size]} height={PX[size]} /> : <span className="initials">{initialsOf(u.name)}</span>}
    </span>
  );
}

Avatar.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  user: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ name: PropTypes.string.isRequired, photo: PropTypes.string }),
  ]).isRequired,
};

export default function App() {
  return (
    <div>
      <Avatar user="Nguyen An" />
      <Avatar user={{ name: 'Tran Binh', photo: 'https://api.dicebear.com/9.x/shapes/svg?seed=binh' }} size="lg" />
      <Avatar user="Le Cuong" size="sm" />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Size classes with default md', kiem: 'so-luong', selector: '.avatar.avatar-md, .avatar.avatar-lg, .avatar.avatar-sm', giaTri: 3 },
        { moTa: 'Initials when there is no photo', kiem: 'danh-sach-text', selector: '.initials', mongDoi: ['NA', 'LC'] },
        { moTa: 'Pixel size follows the prop', kiem: 'kich-thuoc', selector: '.avatar-lg', thuocTinh: 'width', giaTri: 72 },
        { moTa: 'oneOf and oneOfType declared', kiem: 'ma-nguon', khop: "PropTypes\\.oneOf\\(\\s*\\[[\\s\\S]*PropTypes\\.oneOfType\\(|PropTypes\\.oneOfType\\([\\s\\S]*PropTypes\\.oneOf\\(\\s*\\[" },
      ],
    }),
    jsNho({
      tieuDe: 'Write a custom PropTypes validator',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['custom validator', 'Error object', 'arrayOf custom'], the: ['proptypes', 'javascript'],
      moTa: {
        en: '<p>PropTypes accepts your own function: <code>(props, propName, componentName) =&gt; Error | null</code>. Write <code>phoneValidator</code> (a Vietnamese mobile: 10 digits starting with 0, optional) and <code>requiredPhone</code> (same rule, but missing is an error). React calls them for you; here the grader calls them directly.</p>',
        vi: '<p>PropTypes nhận hàm của bạn: <code>(props, propName, componentName) =&gt; Error | null</code>. Viết <code>phoneValidator</code> (số di động VN: 10 chữ số bắt đầu bằng 0, không bắt buộc) và <code>requiredPhone</code> (cùng luật nhưng thiếu là lỗi). React tự gọi chúng; ở đây máy chấm gọi trực tiếp.</p>',
      },
      yeuCau: [
        { en: 'Return <code>null</code> when valid (or missing for the optional one).', vi: 'Trả <code>null</code> khi hợp lệ (hoặc khi thiếu với bản không bắt buộc).' },
        { en: 'Otherwise return <code>new Error(´Invalid prop `@{propName}` supplied to `@{componentName}`: expected a 10-digit phone starting with 0.´)</code>; missing required ⇒ <code>´The prop `@{propName}` is required in `@{componentName}`.´</code>.', vi: 'Ngược lại trả <code>new Error(´Invalid prop `@{propName}` supplied to `@{componentName}`: expected a 10-digit phone starting with 0.´)</code>; thiếu ở bản bắt buộc ⇒ <code>´The prop `@{propName}` is required in `@{componentName}`.´</code>.' },
      ],
      viDu: [{ input: "phoneValidator({ phone: '12345' }, 'phone', 'Contact')", output: 'Error("Invalid prop `phone` supplied to `Contact`: …")', explanation: 'Return the Error — do not throw it.|||TRẢ VỀ Error — không ném.' }],
      goiY: ['const value = props[propName]; if (value == null) return null;', '/^0\\d{9}$/.test(String(value)) ? null : new Error(…). requiredPhone: kiểm thiếu trước rồi gọi lại phoneValidator.'],
      loiHayGap: ['<code>throw new Error(...)</code> ⇒ PropTypes yêu cầu TRẢ VỀ Error.', 'Coi chuỗi rỗng là "thiếu" ở bản bắt buộc mà quên kiểm định dạng.'],
      thuatNgu: [{ en: 'validator', vi: 'hàm kiểm hợp lệ' }],
      giaiThich: '<p>Validator tự viết là hàm thuần nhận (props, tên prop, tên component). Trả <code>null</code> = hợp lệ, trả <code>Error</code> = React in cảnh báo (ở chế độ development). Dùng: <code>Contact.propTypes = { phone: requiredPhone }</code>.</p>',
      dau: `// main.js — STARTER
function phoneValidator(props, propName, componentName) {
  // TODO
}

function requiredPhone(props, propName, componentName) {
  // TODO
}
`,
      giai: `// main.js — validator: TRẢ VỀ null (hợp lệ) hoặc một Error (React in cảnh báo)
const PHONE_RE = /^0\\d{9}$/;

function phoneValidator(props, propName, componentName) {
  const value = props[propName];
  if (value === undefined || value === null) return null; // không bắt buộc
  if (PHONE_RE.test(String(value))) return null;
  return new Error(´Invalid prop \\´@{propName}\\´ supplied to \\´@{componentName}\\´: expected a 10-digit phone starting with 0.´);
}

function requiredPhone(props, propName, componentName) {
  if (props[propName] === undefined || props[propName] === null) {
    return new Error(´The prop \\´@{propName}\\´ is required in \\´@{componentName}\\´.´);
  }
  return phoneValidator(props, propName, componentName);
}
`,
      kiem: [
        { moTa: 'Valid phone ⇒ null', goi: "phoneValidator({ phone: '0912345678' }, 'phone', 'Contact')", mongDoi: null },
        { moTa: 'Missing optional ⇒ null', goi: "phoneValidator({}, 'phone', 'Contact')", mongDoi: null },
        { moTa: 'Bad phone ⇒ Error message', goi: "phoneValidator({ phone: '12345' }, 'phone', 'Contact').message", mongDoi: 'Invalid prop `phone` supplied to `Contact`: expected a 10-digit phone starting with 0.' },
        { moTa: 'Required and missing ⇒ Error', goi: "requiredPhone({}, 'hotline', 'Shop').message", mongDoi: 'The prop `hotline` is required in `Shop`.' },
        { an: true, moTa: 'Returns (not throws) an Error', goi: "phoneValidator({ phone: '1' }, 'phone', 'X') instanceof Error", mongDoi: true },
        { an: true, moTa: 'Required + valid ⇒ null', goi: "requiredPhone({ hotline: '0987654321' }, 'hotline', 'Shop')", mongDoi: null },
        { an: true, moTa: 'A number that lost its leading 0 is rejected', goi: "phoneValidator({ phone: 912345678 }, 'phone', 'X') === null", mongDoi: false },
      ],
    }),
  ],
});

/**
 * FER202 · 5.2 — State: class vs function components (bài luyện React).
 * Dễ → khó: useState → class + this.setState → chuyển class sang function → state object → state + giá trị suy ra.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });

export default doiDau({
  slug: 'fer202-5-2-state-class-vs-function',
  ten: '5.2 State: class vs function components',
  khoa: KHOA,
  baiHoc: 'fer202-5-2-state-class-vs-function',
  de: [
    reactNho({
      tieuDe: 'Counter with useState and a lower bound',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['useState', 'event handler', 'disabled'], the: ['state', 'hooks'],
      moTa: {
        en: '<p>A quantity picker: <code>−</code>, <code>+</code> and <code>Reset</code>. The quantity never goes below 1 or above 10; the buttons are disabled at the limits.</p>',
        vi: '<p>Bộ chọn số lượng: <code>−</code>, <code>+</code> và <code>Reset</code>. Số lượng không dưới 1 và không quá 10; nút bị vô hiệu ở giới hạn.</p>',
      },
      yeuCau: [
        { en: '<code>#qty</code> starts at 1; <code>#dec</code>, <code>#inc</code>, <code>#reset</code>.', vi: '<code>#qty</code> bắt đầu từ 1; <code>#dec</code>, <code>#inc</code>, <code>#reset</code>.' },
        { en: '<code>#dec</code> disabled at 1, <code>#inc</code> disabled at 10.', vi: '<code>#dec</code> vô hiệu khi = 1, <code>#inc</code> vô hiệu khi = 10.' },
      ],
      viDu: [{ input: 'click + 3 times', output: '4', explanation: 'setQty((q) => q + 1)|||setQty((q) => q + 1)' }],
      goiY: ['const [qty, setQty] = useState(1);', 'disabled={qty <= 1} và Math.min(10, q + 1) để chắc chắn.'],
      loiHayGap: ['Biến thường <code>let qty = 1; qty++</code> ⇒ giao diện không đổi (không có re-render).', 'Chỉ chặn bằng <code>disabled</code> mà không kẹp giá trị ⇒ vẫn vượt nếu gọi bằng phím/mã.'],
      thuatNgu: [{ en: 'state', vi: 'dữ liệu thay đổi theo thời gian của component' }, { en: 'bound', vi: 'giới hạn' }],
      giaiThich: '<p><code>useState</code> trả về giá trị hiện tại và hàm đặt; gọi hàm đặt làm React vẽ lại với giá trị mới. Kẹp giá trị trong hàm cập nhật để luật giới hạn luôn đúng.</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  let qty = 1;
  return (
    <div>
      <button id="dec" onClick={() => qty--}>−</button>
      <span id="qty">{qty}</span>
      <button id="inc" onClick={() => qty++}>+</button>
      <button id="reset">Reset</button>
    </div>
  );
}
`,
      giai: `// src/App.js — state + giới hạn 1..10 (kẹp trong hàm cập nhật VÀ khoá nút)
import { useState } from 'react';

const MIN = 1;
const MAX = 10;

export default function App() {
  const [qty, setQty] = useState(MIN);
  return (
    <div>
      <button id="dec" type="button" disabled={qty <= MIN} onClick={() => setQty((q) => Math.max(MIN, q - 1))}>−</button>
      <span id="qty">{qty}</span>
      <button id="inc" type="button" disabled={qty >= MAX} onClick={() => setQty((q) => Math.min(MAX, q + 1))}>+</button>
      <button id="reset" type="button" onClick={() => setQty(MIN)}>Reset</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Starts at 1 with − disabled', kiem: 'thuoc-tinh-js', selector: '#dec', thuocTinh: 'disabled', giaTri: true },
        { moTa: '+ three times ⇒ 4', kiem: 'text', selector: '#qty', giaTri: '4', truoc: [click('#inc', 3)] },
        { moTa: 'Stops at 10 and disables +', kiem: 'danh-sach-text', selector: '#qty', mongDoi: ['10'], truoc: [click('#inc', 12)] },
        { an: true, moTa: 'Reset back to 1', kiem: 'text', selector: '#qty', giaTri: '1', truoc: [click('#inc', 5), click('#reset')] },
      ],
    }),
    reactNho({
      tieuDe: 'The same counter as a class component',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['class component', 'this.state', 'this.setState', 'arrow class fields'], the: ['state', 'class'],
      moTa: {
        en: '<p>Older code bases (and the FE exam) still use class components. Write <code>ClickCounter</code> as a class: state in <code>this.state</code>, changes through <code>this.setState</code>, handlers as arrow class fields so <code>this</code> works.</p>',
        vi: '<p>Mã cũ (và đề FE) vẫn dùng class component. Viết <code>ClickCounter</code> bằng class: state trong <code>this.state</code>, đổi qua <code>this.setState</code>, handler là arrow class field để <code>this</code> đúng.</p>',
      },
      yeuCau: [
        { en: '<code>class ClickCounter extends Component</code> with <code>state = { count: 0, step: 1 }</code>.', vi: '<code>class ClickCounter extends Component</code> với <code>state = { count: 0, step: 1 }</code>.' },
        { en: '<code>#add</code> adds <code>step</code>; <code>#step</code> (select 1/5/10) changes the step; <code>#count</code> shows the count.', vi: '<code>#add</code> cộng <code>step</code>; <code>#step</code> (select 1/5/10) đổi bước; <code>#count</code> hiện số đếm.' },
      ],
      viDu: [{ input: 'step 5, click add twice', output: '10', explanation: 'setState merges the object: { count } keeps step.|||setState TRỘN object: { count } giữ nguyên step.' }],
      goiY: ['add = () => this.setState((s) => ({ count: s.count + s.step }));', 'setStep = (e) => this.setState({ step: Number(e.target.value) });'],
      loiHayGap: ['<code>this.state.count++</code> ⇒ không vẽ lại và sai nguyên tắc.', 'Handler là method thường + <code>onClick={this.add}</code> ⇒ <code>this</code> undefined (phải bind hoặc dùng arrow).'],
      thuatNgu: [{ en: 'class field', vi: 'thuộc tính khai báo trực tiếp trong class' }, { en: 'merge', vi: 'trộn (setState của class chỉ đổi khoá được nêu)' }],
      giaiThich: '<p>Class component lưu state trong một object và <code>this.setState</code> TRỘN phần thay đổi vào (khác <code>useState</code> thay thế cả giá trị). Arrow class field giữ <code>this</code>; dạng hàm cập nhật <code>(s) =&gt; …</code> đọc state mới nhất.</p>',
      dau: `// src/App.js — STARTER
import { Component } from 'react';

class ClickCounter extends Component {
  // TODO: state, add, setStep
  render() {
    return (
      <div>
        <select id="step"><option>1</option><option>5</option><option>10</option></select>
        <button id="add">Add</button>
        <span id="count">0</span>
      </div>
    );
  }
}

export default function App() {
  return <ClickCounter />;
}
`,
      giai: `// src/App.js — class component: this.state + this.setState (TRỘN object), handler là arrow field
import { Component } from 'react';

class ClickCounter extends Component {
  state = { count: 0, step: 1 };

  add = () => this.setState((s) => ({ count: s.count + s.step }));

  setStep = (e) => this.setState({ step: Number(e.target.value) }); // value của select là chuỗi

  render() {
    const { count, step } = this.state;
    return (
      <div>
        <select id="step" value={step} onChange={this.setStep}>
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
        <button id="add" type="button" onClick={this.add}>Add</button>
        <span id="count">{count}</span>
      </div>
    );
  }
}

export default function App() {
  return <ClickCounter />;
}
`,
      kiem: [
        { moTa: 'Add with step 1', kiem: 'text', selector: '#count', giaTri: '2', truoc: [click('#add', 2)] },
        { moTa: 'Step 5 ⇒ +5 per click', kiem: 'text', selector: '#count', giaTri: '10', truoc: [{ hanhDong: 'doi', selector: '#step', giaTri: '5' }, click('#add', 2)] },
        { moTa: 'It is a class using this.setState', kiem: 'ma-nguon', khop: 'class\\s+ClickCounter\\s+extends\\s+(React\\.)?Component[\\s\\S]*this\\.setState\\(' },
        { an: true, moTa: 'Mixed steps add up', kiem: 'text', selector: '#count', giaTri: '11', truoc: [click('#add'), { hanhDong: 'doi', selector: '#step', giaTri: '10' }, click('#add')] },
      ],
    }),
    reactNho({
      tieuDe: 'Convert a class component to a function with hooks',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['refactor', 'useState', 'class to hooks'], the: ['state', 'hooks', 'refactor'],
      moTa: {
        en: '<p><code>LikeButton</code> is a class with <code>{ liked, count }</code>. Rewrite it as a function component with <code>useState</code> — same behaviour: clicking toggles liked and adds/removes one like, even when the user double-clicks very fast.</p>',
        vi: '<p><code>LikeButton</code> là class với <code>{ liked, count }</code>. Viết lại thành function component dùng <code>useState</code> — hành vi giữ nguyên: bấm để thích/bỏ thích và cộng/trừ một lượt, kể cả khi người dùng bấm đúp thật nhanh.</p>',
      },
      yeuCau: [
        { en: '<code>#like</code> shows <code>♡ Like</code> / <code>♥ Liked</code>; <code>#likes</code> shows <code>12 likes</code> (starts at <code>initialCount</code> prop = 12).', vi: '<code>#like</code> hiện <code>♡ Like</code> / <code>♥ Liked</code>; <code>#likes</code> hiện <code>12 likes</code> (bắt đầu từ prop <code>initialCount</code> = 12).' },
        { en: 'No <code>class</code> keyword left. <code>liked</code> and <code>count</code> change TOGETHER — keep them in one state object updated with a function so two fast clicks never read a stale value.', vi: 'Không còn từ khoá <code>class</code>. <code>liked</code> và <code>count</code> đổi CÙNG NHAU — giữ chúng trong một object state, cập nhật bằng hàm để hai lần bấm nhanh không đọc giá trị cũ.' },
      ],
      viDu: [{ input: 'click twice', output: '♡ Like · 12 likes', explanation: 'Like then unlike returns to the start.|||Thích rồi bỏ thích thì về như cũ.' }],
      goiY: ['const [like, setLike] = useState({ liked: false, count: initialCount });', 'Toggle: setLike((s) => ({ liked: !s.liked, count: s.count + (s.liked ? -1 : 1) })); — đọc s (mới nhất), không đọc biến của lần render.'],
      loiHayGap: ['Hai state riêng + <code>setCount(c =&gt; c + (liked ? -1 : 1))</code> đọc <code>liked</code> của lần render cũ ⇒ bấm đúp nhanh thành 14 thay vì 12.', '<code>setLike({ liked: true })</code> ⇒ MẤT count (useState thay thế, không trộn như this.setState).', 'Còn sót <code>this.</code> trong function component.'],
      thuatNgu: [{ en: 'hook', vi: 'hàm đặc biệt của React (use…) dùng trong function component' }],
      giaiThich: '<p>Thường mỗi khoá của <code>this.state</code> thành một <code>useState</code>. Nhưng khi hai giá trị luôn đổi cùng nhau và phụ thuộc nhau (<code>count</code> tính theo <code>liked</code>), gộp chúng thành MỘT object và cập nhật bằng hàm <code>s =&gt; …</code>: mọi lần bấm đều đọc trạng thái mới nhất. Nhớ: hàm đặt của <code>useState</code> THAY THẾ giá trị — phải trả về object đầy đủ.</p>',
      dau: `// src/App.js — STARTER: class cần chuyển sang function + hooks
import { Component } from 'react';

class LikeButton extends Component {
  state = { liked: false, count: this.props.initialCount };

  toggle = () =>
    this.setState((s) => ({ liked: !s.liked, count: s.count + (s.liked ? -1 : 1) }));

  render() {
    return (
      <div>
        <button id="like" type="button" onClick={this.toggle}>{this.state.liked ? '♥ Liked' : '♡ Like'}</button>
        <span id="likes">{this.state.count} likes</span>
      </div>
    );
  }
}

export default function App() {
  return <LikeButton initialCount={12} />;
}
`,
      giai: `// src/App.js — liked và count đổi CÙNG NHAU ⇒ một object state, cập nhật bằng HÀM (luôn đọc giá trị mới nhất)
import { useState } from 'react';

function LikeButton({ initialCount }) {
  const [like, setLike] = useState({ liked: false, count: initialCount });

  const toggle = () =>
    setLike((s) => ({ liked: !s.liked, count: s.count + (s.liked ? -1 : 1) }));

  return (
    <div>
      <button id="like" type="button" onClick={toggle}>{like.liked ? '♥ Liked' : '♡ Like'}</button>
      <span id="likes">{like.count} likes</span>
    </div>
  );
}

export default function App() {
  return <LikeButton initialCount={12} />;
}
`,
      kiem: [
        { moTa: 'Initial state', kiem: 'danh-sach-text', selector: '#like, #likes', mongDoi: ['♡ Like', '12 likes'] },
        { moTa: 'Click ⇒ liked and 13', kiem: 'danh-sach-text', selector: '#like, #likes', mongDoi: ['♥ Liked', '13 likes'], truoc: [click('#like')] },
        { moTa: 'Function component with useState (no class)', kiem: 'ma-nguon', khop: '^(?![\\s\\S]*\\bclass\\s+\\w+\\s+extends)[\\s\\S]*useState\\(' },
        { an: true, moTa: 'Click twice ⇒ back to 12', kiem: 'danh-sach-text', selector: '#like, #likes', mongDoi: ['♡ Like', '12 likes'], truoc: [click('#like', 2)] },
      ],
    }),
    reactNho({
      tieuDe: 'One state object, one change handler',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['state object', 'spread update', 'computed property name'], the: ['state', 'forms'],
      moTa: {
        en: '<p>A profile editor keeps <code>{ name, email, plan, newsletter }</code> in ONE state object. Write one <code>handleChange</code> for every input using <code>e.target.name</code> (and <code>checked</code> for the checkbox).</p>',
        vi: '<p>Trình sửa hồ sơ giữ <code>{ name, email, plan, newsletter }</code> trong MỘT object state. Viết một <code>handleChange</code> cho mọi ô dựa vào <code>e.target.name</code> (và <code>checked</code> cho checkbox).</p>',
      },
      yeuCau: [
        { en: 'Inputs <code>#name</code>, <code>#email</code>, select <code>#plan</code> (free/pro), checkbox <code>#newsletter</code> — all controlled, each with a <code>name</code> attribute.', vi: 'Ô <code>#name</code>, <code>#email</code>, select <code>#plan</code> (free/pro), checkbox <code>#newsletter</code> — đều controlled, mỗi ô có thuộc tính <code>name</code>.' },
        { en: '<code>#preview</code> shows <code>JSON.stringify(profile)</code>.', vi: '<code>#preview</code> hiện <code>JSON.stringify(profile)</code>.' },
      ],
      viDu: [{ input: 'type "Lan" in name', output: '{"name":"Lan","email":"","plan":"free","newsletter":false}', explanation: 'The other fields are kept thanks to the spread.|||Các trường khác được giữ nhờ spread.' }],
      goiY: ['setProfile((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));', 'const { name, value, type, checked } = e.target;'],
      loiHayGap: ['<code>setProfile({ [name]: value })</code> ⇒ mất mọi trường khác.', 'Dùng <code>value</code> cho checkbox ⇒ luôn "on".'],
      thuatNgu: [{ en: 'computed property name', vi: 'tên thuộc tính tính từ biến: { [name]: value }' }],
      giaiThich: '<p>Hàm đặt của <code>useState</code> thay thế cả giá trị, nên khi state là object phải spread phần cũ rồi ghi đè một khoá. <code>[name]</code> dùng thuộc tính <code>name</code> của ô để biết khoá nào.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [profile, setProfile] = useState({ name: '', email: '', plan: 'free', newsletter: false });
  const handleChange = (e) => setProfile({ [e.target.name]: e.target.value }); // ⚠ mất các trường khác
  return (
    <form>
      <input id="name" name="name" value={profile.name} onChange={handleChange} />
      <input id="email" name="email" value={profile.email} onChange={handleChange} />
      <select id="plan" name="plan" value={profile.plan} onChange={handleChange}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      <input id="newsletter" name="newsletter" type="checkbox" checked={profile.newsletter} onChange={handleChange} />
      <pre id="preview">{JSON.stringify(profile)}</pre>
    </form>
  );
}
`,
      giai: `// src/App.js — MỘT handler cho mọi ô: spread phần cũ + [name] cho khoá đang đổi
import { useState } from 'react';

export default function App() {
  const [profile, setProfile] = useState({ name: '', email: '', plan: 'free', newsletter: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <form>
      <input id="name" name="name" value={profile.name} onChange={handleChange} />
      <input id="email" name="email" value={profile.email} onChange={handleChange} />
      <select id="plan" name="plan" value={profile.plan} onChange={handleChange}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      <input id="newsletter" name="newsletter" type="checkbox" checked={profile.newsletter} onChange={handleChange} />
      <pre id="preview">{JSON.stringify(profile)}</pre>
    </form>
  );
}
`,
      kiem: [
        { moTa: 'Typing a name keeps the other fields', kiem: 'text', selector: '#preview', giaTri: '{"name":"Lan","email":"","plan":"free","newsletter":false}', truoc: [nhap('#name', 'Lan')] },
        { moTa: 'All fields together', kiem: 'text', selector: '#preview', giaTri: '{"name":"Lan","email":"lan@fpt.vn","plan":"pro","newsletter":true}', truoc: [nhap('#name', 'Lan'), nhap('#email', 'lan@fpt.vn'), { hanhDong: 'doi', selector: '#plan', giaTri: 'pro' }, { hanhDong: 'chon-o', selector: '#newsletter' }] },
        { an: true, moTa: 'Checkbox stored as boolean', kiem: 'text', selector: '#preview', khop: '"newsletter":true', truoc: [{ hanhDong: 'chon-o', selector: '#newsletter' }] },
      ],
    }),
    reactNho({
      tieuDe: 'Shopping list: state vs derived values',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['minimal state', 'derived values', 'immutable updates'], the: ['state', 'derived'],
      moTa: {
        en: '<p>A shopping list where items can be added, ticked and cleared. Keep the <b>minimal</b> state (the items array and the input text). Counts like "2 of 5 bought" are <b>derived</b> during render — never stored.</p>',
        vi: '<p>Danh sách mua sắm: thêm món, đánh dấu đã mua, xoá món đã mua. Chỉ giữ state <b>tối thiểu</b> (mảng món và chữ trong ô). Các con số như "2 of 5 bought" là giá trị <b>suy ra</b> khi render — không lưu.</p>',
      },
      yeuCau: [
        { en: '<code>#new-item</code> + <code>#btn-add</code> (trimmed, no empty); list <code>li.item</code> with a checkbox <code>.toggle</code>; bought items get class <code>bought</code>.', vi: '<code>#new-item</code> + <code>#btn-add</code> (bỏ khoảng trắng, không rỗng); danh sách <code>li.item</code> có checkbox <code>.toggle</code>; món đã mua có class <code>bought</code>.' },
        { en: '<code>#summary</code> <code>2 of 5 bought</code>; <code>#btn-clear</code> removes bought items (disabled when none).', vi: '<code>#summary</code> <code>2 of 5 bought</code>; <code>#btn-clear</code> xoá món đã mua (vô hiệu khi không có).' },
      ],
      viDu: [{ input: 'items 5, tick 2', output: '2 of 5 bought', explanation: 'const bought = items.filter((i) => i.bought).length — computed, not stored.|||const bought = items.filter((i) => i.bought).length — tính, không lưu.' }],
      goiY: ['Mỗi món { id, name, bought }; id = Date.now() hoặc bộ đếm.', 'Đánh dấu: setItems(list => list.map(i => i.id === id ? { ...i, bought: !i.bought } : i)).'],
      loiHayGap: ['Lưu <code>boughtCount</code> trong state rồi quên cập nhật khi xoá ⇒ con số sai.', 'Đánh dấu bằng <code>item.bought = true</code> ⇒ không vẽ lại.'],
      thuatNgu: [{ en: 'minimal state', vi: 'state tối thiểu — chỉ những gì không tính ra được' }],
      giaiThich: '<p>Hỏi mỗi dữ liệu: "tính ra được từ cái khác không?" — được thì không làm state. Nhờ vậy số đếm, trạng thái nút xoá luôn khớp với danh sách sau mọi thao tác.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk', bought: false },
    { id: 2, name: 'Eggs', bought: true },
    { id: 3, name: 'Bread', bought: false },
  ]);
  // TODO: thêm món, đánh dấu, #summary, xoá món đã mua
  return <ul>{items.map((i) => <li key={i.id} className="item">{i.name}</li>)}</ul>;
}
`,
      giai: `// src/App.js — state tối thiểu (items + text); mọi con số là giá trị suy ra
import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk', bought: false },
    { id: 2, name: 'Eggs', bought: true },
    { id: 3, name: 'Bread', bought: false },
  ]);
  const [text, setText] = useState('');

  const add = () => {
    const name = text.trim();
    if (!name) return;
    setItems((list) => [...list, { id: Math.max(0, ...list.map((i) => i.id)) + 1, name, bought: false }]);
    setText('');
  };
  const toggle = (id) => setItems((list) => list.map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)));
  const clearBought = () => setItems((list) => list.filter((i) => !i.bought));

  const bought = items.filter((i) => i.bought).length; // SUY RA — không phải state

  return (
    <div>
      <input id="new-item" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add an item" />
      <button id="btn-add" type="button" onClick={add}>Add</button>
      <ul>
        {items.map((i) => (
          <li key={i.id} className={i.bought ? 'item bought' : 'item'}>
            <label>
              <input type="checkbox" className="toggle" checked={i.bought} onChange={() => toggle(i.id)} /> {i.name}
            </label>
          </li>
        ))}
      </ul>
      <p id="summary">{bought} of {items.length} bought</p>
      <button id="btn-clear" type="button" disabled={bought === 0} onClick={clearBought}>Clear bought</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Initial summary', kiem: 'text', selector: '#summary', giaTri: '1 of 3 bought' },
        { moTa: 'Add two items and tick one', kiem: 'text', selector: '#summary', giaTri: '2 of 5 bought', truoc: [nhap('#new-item', 'Apples'), click('#btn-add'), nhap('#new-item', ' Rice '), click('#btn-add'), { hanhDong: 'chon-o', selector: '.item:nth-child(4) .toggle' }] },
        { moTa: 'Bought items have class bought', kiem: 'so-luong', selector: '.item.bought', giaTri: 2, truoc: [{ hanhDong: 'chon-o', selector: '.item:first-child .toggle' }] },
        { moTa: 'Clear bought removes them', kiem: 'danh-sach-text', selector: '.item', mongDoi: ['Milk', 'Bread'], truoc: [click('#btn-clear')] },
        { an: true, moTa: 'Clear is disabled when nothing is bought', kiem: 'thuoc-tinh-js', selector: '#btn-clear', thuocTinh: 'disabled', giaTri: true, truoc: [click('#btn-clear')] },
        { an: true, moTa: 'Empty input adds nothing', kiem: 'so-luong', selector: '.item', giaTri: 3, truoc: [nhap('#new-item', '   '), click('#btn-add')] },
      ],
    }),
  ],
});

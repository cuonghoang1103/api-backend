/**
 * FER202 · Exercise 18 — State as a snapshot (đoán kết quả + sửa lỗi bằng hàm cập nhật).
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich });
const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });

export default doiDau({
  slug: 'fer202-6-ex18-state-snapshot',
  ten: '6.5 Exercise 18 — State as a snapshot',
  khoa: KHOA,
  baiHoc: 'fer202-6-ex18-state-snapshot',
  de: [
    tinh({
      tieuDe: 'Predict the number: state as a snapshot',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['snapshot', 'batching', 'updater function'], the: ['state', 'exercise-18'],
      moTa: {
        en: '<p><code>count</code> starts at 0 in every question. What does the button show after ONE click? Remember: inside one render, <code>count</code> never changes; updater functions are queued and run in order.</p>',
        vi: '<p><code>count</code> bắt đầu là 0 ở mọi câu. Nút hiện số mấy sau MỘT lần bấm? Nhớ: trong một lần render, <code>count</code> không bao giờ đổi; hàm cập nhật được xếp hàng và chạy theo thứ tự.</p>',
      },
      goiY: ['Thay count bằng con số của lần render đó (0) rồi tính.', 'setX(5) = "thay bằng 5"; setX(n => n + 1) = "lấy giá trị đang chờ rồi +1".'],
      loiHayGap: ['Nghĩ setCount đổi count ngay dòng sau.', 'Quên rằng alert/setTimeout đọc count của lần render đã tạo ra chúng.'],
      giaiThich: '<p>Mỗi lần render có "ảnh chụp" state riêng; handler đọc ảnh chụp đó. Hàm cập nhật nhận giá trị mới nhất trong hàng đợi.</p>',
      thuatNgu: [{ en: 'queue', vi: 'hàng đợi' }, { en: 'batching', vi: 'gom nhiều lần đặt state thành một lần render' }],
      cauHoi: [
        q('s1', '<code>setCount(count + 1); setCount(count + 1); setCount(count + 1);</code>', [['a', '1'], ['b', '3'], ['c', '0'], ['d', '2']], ['a'], 'Three times "replace with 0 + 1".|||Ba lần "thay bằng 0 + 1".'),
        q('s2', '<code>setCount(c =&gt; c + 1); setCount(c =&gt; c + 1); setCount(c =&gt; c + 1);</code>', [['a', '1'], ['b', '3'], ['c', '0'], ['d', '6']], ['b'], 'Each updater gets the result of the previous one: 1, 2, 3.|||Mỗi hàm cập nhật nhận kết quả của hàm trước: 1, 2, 3.'),
        q('s3', '<code>setCount(count + 5); setCount(c =&gt; c + 1);</code>', [['a', '1'], ['b', '5'], ['c', '6'], ['d', '0']], ['c'], 'Replace with 5, then 5 + 1.|||Thay bằng 5, rồi 5 + 1.'),
        q('s4', '<code>setCount(c =&gt; c + 1); setCount(42);</code>', [['a', '43'], ['b', '42'], ['c', '1'], ['d', '0']], ['b'], 'The last "replace" wins: 42.|||Lệnh "thay" cuối cùng thắng: 42.'),
        q('s5', '<code>setCount(count + 1); alert(count);</code> — what does the alert show?', [['a', '1'], ['b', '0'], ['c', 'undefined'], ['d', 'It never shows']], ['b'], 'The handler still reads the snapshot of this render.|||Handler vẫn đọc ảnh chụp của lần render này.'),
        q('s6', '<code>setCount(count + 1); setTimeout(() =&gt; alert(count), 3000);</code> — after 3 s the alert shows…', [['a', '1'], ['b', '0'], ['c', '3'], ['d', 'the latest count']], ['b'], 'The timeout closure captured count = 0 from the render that created it.|||Closure của setTimeout đã "chụp" count = 0 từ lần render tạo ra nó.'),
      ],
    }),
    reactNho({
      tieuDe: 'Fix the +3 button and the delayed alert',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['updater function', 'snapshot', 'event loop'], the: ['state', 'exercise-18'],
      moTa: {
        en: '<p>Reproduce and fix Exercise 18. "+3" must really add 3. "+5 then +1" must add 6. And the "log in 1 s" button logs the count <b>as it was when clicked</b> — explain why that is the correct behaviour.</p>',
        vi: '<p>Tái hiện và sửa Exercise 18. "+3" phải cộng đủ 3. "+5 then +1" phải cộng 6. Nút "log in 1 s" in số đếm <b>tại lúc bấm</b> — giải thích vì sao đó là hành vi đúng.</p>',
      },
      yeuCau: [
        { en: '<code>#plus3</code> adds 3 with three updater calls; <code>#plus6</code> = <code>setCount(count + 5)</code> then <code>setCount(c =&gt; c + 1)</code>.', vi: '<code>#plus3</code> cộng 3 bằng ba lần gọi hàm cập nhật; <code>#plus6</code> = <code>setCount(count + 5)</code> rồi <code>setCount(c =&gt; c + 1)</code>.' },
        { en: '<code>#log-later</code> logs <code>count at click: N</code> after 1 s (snapshot of that render).', vi: '<code>#log-later</code> in <code>count at click: N</code> sau 1 giây (ảnh chụp của lần render đó).' },
      ],
      viDu: [{ input: 'click +3 twice', output: '6', explanation: 'Updaters see the queued value.|||Hàm cập nhật thấy giá trị đang chờ.' }],
      goiY: ['setCount((c) => c + 1) ba lần.', 'setTimeout(() => console.log(´count at click: @{count}´), 1000).'],
      loiHayGap: ['Cố "sửa" bằng cách đọc giá trị mới ngay sau setCount — state không đổi giữa chừng.', 'Dùng biến toàn cục để "đồng bộ" — phá luồng dữ liệu của React.'],
      thuatNgu: [{ en: 'stale closure', vi: 'closure giữ giá trị cũ' }],
      giaiThich: '<p>Hàm cập nhật đọc giá trị mới nhất trong hàng đợi nên cộng dồn đúng. Còn setTimeout giữ closure của lần render tạo ra nó — đó là đặc tính (nhất quán), không phải lỗi; muốn đọc giá trị mới nhất về sau thì dùng ref (chương 8).</p>',
      dau: `// src/App.js — STARTER (bug: +3 chỉ cộng 1)
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p id="count">{count}</p>
      <button id="plus3" onClick={() => { setCount(count + 1); setCount(count + 1); setCount(count + 1); }}>+3</button>
      <button id="plus6">+5 then +1</button>
      <button id="log-later">log in 1 s</button>
    </div>
  );
}
`,
      giai: `// src/App.js — hàm cập nhật cho các lần đặt nối tiếp; setTimeout đọc ảnh chụp của lần render
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  const plus3 = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };
  const plus6 = () => {
    setCount(count + 5); // "thay bằng count + 5"
    setCount((c) => c + 1); // rồi +1 trên giá trị đang chờ
  };
  const logLater = () => {
    setTimeout(() => console.log(´count at click: @{count}´), 1000);
  };

  return (
    <div>
      <p id="count">{count}</p>
      <button id="plus3" type="button" onClick={plus3}>+3</button>
      <button id="plus6" type="button" onClick={plus6}>+5 then +1</button>
      <button id="log-later" type="button" onClick={logLater}>log in 1 s</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: '+3 adds three', kiem: 'text', selector: '#count', giaTri: '3', truoc: [click('#plus3')] },
        { moTa: '+5 then +1 adds six', kiem: 'text', selector: '#count', giaTri: '6', truoc: [click('#plus6')] },
        { moTa: 'Logged value is the snapshot at click time', kiem: 'console', mongDoi: ['count at click: 3'], truoc: [click('#plus3'), { hanhDong: 'cho', ms: 50 }, click('#log-later'), { hanhDong: 'cho', ms: 50 }, click('#plus3'), { hanhDong: 'cho', ms: 1300 }] },
        { an: true, moTa: '+3 twice ⇒ 6', kiem: 'text', selector: '#count', giaTri: '6', truoc: [click('#plus3'), { hanhDong: 'cho', ms: 50 }, click('#plus3')] },
      ],
    }),
  ],
});

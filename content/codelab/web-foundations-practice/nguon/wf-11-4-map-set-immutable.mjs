/** Bộ luyện bài 11.4 — Map, Set và bất biến. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 11.4 — Map, Set và tư duy bất biến.</em> Máy chấm so SÂU giá trị trả về, và nhiều kiểm soi THAM CHIẾU (<code>===</code>) để chắc bạn không sửa dữ liệu gốc.</p>';
const TODOS = 'const todos = [{ id: 1, title: "a", done: false, tags: [] }, { id: 2, title: "b", done: false, tags: ["x"] }, { id: 3, title: "c", done: true, tags: [] }];';

export default doiDau({
  slug: 'wf-11-4-map-set-immutable',
  ten: '11.4 Map, Set và tư duy bất biến',
  baiHoc: 'Nền tảng Web — Bài 11.4 Map, Set và bất biến',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Xoá trùng bằng Set, đếm từ bằng Map, đảo trạng thái todo không sửa gốc, thêm thẻ không trùng, gom nhóm vào Map, cập nhật lồng nhiều tầng bất biến — 6 bài, kiểm cả tham chiếu.',
  de: [
    {
      tieuDe: 'Xoá trùng, giữ thứ tự',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['Set', 'spread'], tienQuyet: ['mảng'], the: ['javascript', 'set'],
      moTa: `${BAI}<p>Viết ${c('unique(arr)')} trả về MẢNG MỚI chỉ giữ mỗi giá trị một lần, theo thứ tự xuất hiện đầu tiên. Không được sửa mảng đầu vào. Lưu ý ${c('1')} và ${c('"1"')} là hai giá trị khác nhau.</p>`,
      yeuCau: [
        `${c('unique(["js", "css", "js", "html", "css"])')} là ${c('["js", "css", "html"]')}.`,
        `Phân biệt ${c('1')} và ${c('"1"')}; mảng gốc giữ nguyên.`,
        'Trả về một mảng (không phải Set).',
      ],
      dauVao: 'arr: mảng giá trị nguyên thuỷ.', dauRa: 'Mảng mới.',
      rangBuoc: ['Không sửa arr.'],
      viDu: [{ input: 'unique([3, 1, 3, 2, 1])', output: '[3, 1, 2]', explanation: 'Giữ lần xuất hiện đầu.' }],
      goiY: ['Set giữ thứ tự thêm vào.', 'return [...new Set(arr)];'],
      khoiDau: { 'main.js': `// Bài 11.4 — unique
function unique(arr) {
  return arr;
}
` },
      loiGiai: { 'main.js': `// Bài 11.4 — unique: Set bỏ trùng (so như ===) và giữ thứ tự thêm vào
function unique(arr) {
  const seen = new Set(arr);  // Set chỉ nhận mỗi giá trị một lần; 1 và "1" là hai giá trị
  return [...seen];           // trải Set ra mảng MỚI theo thứ tự thêm vào, arr không bị đụng tới
}
// Cách viết tay tương đương (chậm hơn với mảng lớn vì includes phải quét):
// const out = []; for (const x of arr) if (!out.includes(x)) out.push(x); return out;
` },
      giaiThich: `<p>Set giữ mỗi giá trị một lần theo luật ${c('===')} (riêng NaN được coi là bằng chính nó), nên ${c('1')} và ${c('"1"')} là hai phần tử. Trải ${c('[...set]')} ra mảng mới theo thứ tự thêm vào.</p>`,
      loiHayGap: ['Trả về new Set(arr) — đề cần mảng.', 'Dùng arr.sort() trước — đổi thứ tự và sửa luôn mảng gốc.'],
      thamKhao: 'https://javascript.info/map-set#set',
      kiem: [
        { moTa: 'Removes duplicates in order|||Bỏ trùng, giữ thứ tự', goi: 'unique(["js", "css", "js", "html", "css"])', mongDoi: ['js', 'css', 'html'] },
        { moTa: '1 and "1" are different|||1 và "1" khác nhau', goi: 'unique([1, "1", 1])', mongDoi: [1, '1'] },
        { moTa: 'Input untouched, new array returned|||Đầu vào nguyên vẹn, trả mảng mới', chuanBi: 'const a = [1, 1, 2]; const r = unique(a);', goi: '[a, r !== a, Array.isArray(r)]', mongDoi: [[1, 1, 2], true, true] },
        { moTa: 'Hidden: empty array|||Ẩn: mảng rỗng', an: true, goi: 'unique([])', mongDoi: [] },
      ],
    },
    {
      tieuDe: 'Đếm từ bằng Map',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['Map', '??'], tienQuyet: ['split', 'vòng lặp'], the: ['javascript', 'map'],
      moTa: `${BAI}<p>Viết ${c('countWords(text)')} trả về một ${c('Map')}: khoá là từ (viết thường), giá trị là số lần xuất hiện, theo thứ tự gặp lần đầu. Từ được tách bởi một hoặc nhiều khoảng trắng; bỏ khoảng trắng đầu/cuối. Rồi viết ${c('toPlain(map)')} đổi Map thành object thường để gửi JSON.</p>`,
      yeuCau: [
        `${c('countWords("To be or not to be")')} có ${c('to → 2')}, ${c('be → 2')}, ${c('or → 1')}, ${c('not → 1')}.`,
        'Chuỗi rỗng hoặc toàn khoảng trắng ⇒ Map rỗng.',
        `${c('JSON.stringify(toPlain(m))')} cho ${c('{"to":2,…}')}.`,
      ],
      dauVao: 'text: string.', dauRa: 'Map<string, number>; object.',
      rangBuoc: ['Kết quả của countWords phải là Map.'],
      viDu: [{ input: 'countWords("a  A b").get("a")', output: '2', explanation: 'Viết thường trước khi đếm; hai khoảng trắng vẫn là một ranh giới.' }],
      goiY: ['text.trim().toLowerCase().split(/\\s+/) — nhớ trường hợp chuỗi rỗng cho [""].', 'm.set(w, (m.get(w) ?? 0) + 1); — toPlain: Object.fromEntries(map).'],
      khoiDau: { 'main.js': `// Bài 11.4 — đếm từ
function countWords(text) {
  const m = {};
  for (const w of text.split(' ')) m[w] = (m[w] || 0) + 1;
  return m;
}
function toPlain(map) {}
` },
      loiGiai: { 'main.js': `// Bài 11.4 — đếm từ: Map giữ thứ tự gặp lần đầu, ?? giữ được số 0
function countWords(text) {
  const m = new Map();
  const clean = text.trim().toLowerCase();
  if (clean === '') return m;                 // ''.split(...) cho [''] — tránh đếm từ rỗng
  for (const w of clean.split(/\\s+/)) {
    m.set(w, (m.get(w) ?? 0) + 1);
  }
  return m;
}

function toPlain(map) {
  return Object.fromEntries(map);             // Map → object để JSON.stringify hiểu
}
` },
      giaiThich: `<p>${c('split(/\\\\s+/)')} coi mọi chuỗi khoảng trắng là một ranh giới. ${c('m.get(w) ?? 0')} đọc số cũ hoặc 0. ${c('JSON.stringify')} không hiểu Map (ra ${c('{}')}), nên phải ${c('Object.fromEntries')} trước khi gửi đi.</p>`,
      loiHayGap: ['split(" ") — hai khoảng trắng liền tạo từ rỗng.', 'Quên toLowerCase — "To" và "to" thành hai từ.'],
      thamKhao: 'https://javascript.info/map-set#map',
      kiem: [
        { moTa: 'Counts words|||Đếm đúng', goi: 'countWords("To be or not to be")', mongDoi: { $js: 'Map', muc: [['to', 2], ['be', 2], ['or', 1], ['not', 1]] } },
        { moTa: 'Extra spaces and case|||Khoảng trắng thừa và hoa/thường', goi: 'countWords("  a  A b ").get("a")', mongDoi: 2 },
        { moTa: 'Empty text gives an empty Map|||Chuỗi rỗng cho Map rỗng', goi: '[countWords("").size, countWords("   ").size]', mongDoi: [0, 0] },
        { moTa: 'toPlain makes it JSON-ready|||toPlain sẵn sàng cho JSON', goi: 'JSON.stringify(toPlain(countWords("x y x")))', mongDoi: '{"x":2,"y":1}' },
      ],
    },
    {
      tieuDe: 'Đảo trạng thái todo không sửa gốc',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['immutable update', 'map', 'spread'], tienQuyet: ['mảng object'], the: ['javascript', 'immutable', 'react'],
      moTa: `${BAI}<p>Viết ${c('toggleTodo(todos, id)')} trả về MẢNG MỚI trong đó todo có ${c('id')} bị đảo ${c('done')}. Mảng gốc và mọi object gốc phải giữ nguyên; các todo KHÔNG đổi phải được dùng lại (cùng tham chiếu) — đó là thứ giúp React bỏ qua render những dòng không đổi. Không có id ⇒ trả mảng mới với nội dung như cũ.</p>`,
      yeuCau: [
        'Todo được chọn có done đảo ngược; todo khác giữ nguyên tham chiếu.',
        'Mảng gốc và object gốc không bị sửa.',
        'Luôn trả về một mảng mới.',
      ],
      dauVao: 'todos: { id, done, … }[]; id: number.', dauRa: 'Mảng mới.',
      rangBuoc: ['Không dùng phương thức sửa tại chỗ trên todos.'],
      viDu: [{ input: 'toggleTodo(todos, 2)[1].done', output: 'true', explanation: 'Chỉ todo 2 đổi.' }],
      goiY: ['map trả mảng mới; phần tử không khớp thì trả nguyên t.', 'todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))'],
      khoiDau: { 'main.js': `// Bài 11.4 — toggleTodo (đang sửa tại chỗ)
function toggleTodo(todos, id) {
  const t = todos.find((x) => x.id === id);
  if (t) t.done = !t.done;
  return todos;
}
` },
      loiGiai: { 'main.js': `// Bài 11.4 — toggleTodo bất biến: mảng mới, chỉ phần tử đổi là object mới
function toggleTodo(todos, id) {
  return todos.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t   // không đổi ⇒ dùng lại đúng object cũ
  );
}
` },
      giaiThich: `<p>${c('map')} luôn tạo mảng mới. Với phần tử cần đổi, spread tạo object mới có ${c('done')} đảo; phần tử khác được trả nguyên, nên ${c('next[0] === todos[0]')}. React (và memo) so tham chiếu: dòng nào cùng tham chiếu thì bỏ qua — vừa đúng vừa nhanh.</p>`,
      loiHayGap: ['Sửa t.done rồi trả todos — cùng tham chiếu, React không render.', 'structuredClone cả mảng — đúng dữ liệu nhưng mọi dòng đều thành object mới.'],
      thamKhao: 'https://react.dev/learn/updating-arrays-in-state',
      kiem: [
        { moTa: 'The chosen todo flips|||Todo được chọn bị đảo', chuanBi: TODOS, goi: 'toggleTodo(todos, 2).map((t) => t.done)', mongDoi: [false, true, true] },
        { moTa: 'Originals untouched|||Bản gốc nguyên vẹn', chuanBi: `${TODOS} toggleTodo(todos, 2);`, goi: 'todos.map((t) => t.done)', mongDoi: [false, false, true] },
        { moTa: 'New array, unchanged items reused|||Mảng mới, phần tử không đổi được dùng lại', chuanBi: `${TODOS} const n = toggleTodo(todos, 2);`, goi: '[n !== todos, n[0] === todos[0], n[1] !== todos[1], n[2] === todos[2]]', mongDoi: [true, true, true, true] },
        { moTa: 'Hidden: unknown id ⇒ new array, same items|||Ẩn: id lạ ⇒ mảng mới, phần tử cũ', an: true, chuanBi: `${TODOS} const n = toggleTodo(todos, 99);`, goi: '[n !== todos, n.every((t, i) => t === todos[i])]', mongDoi: [true, true] },
      ],
    },
    {
      tieuDe: 'Thêm thẻ không trùng, không sửa gốc',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Set', 'spread lồng nhau'], tienQuyet: ['spread'], the: ['javascript', 'immutable', 'set'],
      moTa: `${BAI}<p>Viết ${c('addTag(todo, tag)')} trả về todo MỚI có mảng ${c('tags')} MỚI chứa ${c('tag')} đúng một lần (thêm vào cuối nếu chưa có). Thẻ được chuẩn hoá: cắt khoảng trắng, viết thường; thẻ rỗng ⇒ trả lại chính ${c('todo')} (không tạo object mới). Không được sửa ${c('todo.tags')} gốc — đây là bẫy "spread chỉ chép nông".</p>`,
      yeuCau: [
        `${c('addTag(t, " JS ").tags')} có ${c('"js"')} một lần, kể cả khi gọi hai lần.`,
        `${c('todo')} và ${c('todo.tags')} gốc không đổi; kết quả có ${c('tags')} là mảng khác.`,
        `Thẻ rỗng ⇒ trả về đúng object ${c('todo')}.`,
      ],
      dauVao: 'todo: { tags: string[] }; tag: string.', dauRa: 'Todo mới (hoặc chính todo).',
      rangBuoc: ['Không push vào todo.tags.'],
      viDu: [{ input: 'addTag({ id: 1, tags: ["x"] }, "Y").tags', output: '["x", "y"]', explanation: 'Chuẩn hoá rồi thêm vào cuối.' }],
      goiY: ['const t = tag.trim().toLowerCase(); if (!t) return todo;', 'return { ...todo, tags: [...new Set([...todo.tags, t])] };'],
      khoiDau: { 'main.js': `// Bài 11.4 — addTag (bẫy spread nông)
function addTag(todo, tag) {
  const copy = { ...todo };
  copy.tags.push(tag);       // vẫn là mảng tags CŨ!
  return copy;
}
` },
      loiGiai: { 'main.js': `// Bài 11.4 — addTag: chép CẢ tầng tags, Set chống trùng
function addTag(todo, tag) {
  const t = tag.trim().toLowerCase();
  if (!t) return todo;                                    // không có gì đổi ⇒ giữ tham chiếu cũ
  return { ...todo, tags: [...new Set([...todo.tags, t])] };   // object mới + mảng mới
}
` },
      giaiThich: `<p>${c('{ ...todo }')} chỉ chép tầng đầu; ${c('copy.tags')} vẫn là mảng cũ nên ${c('push')} sửa luôn bản gốc. Phải tạo mảng mới cho đúng tầng đang đổi. Set loại thẻ trùng mà giữ thứ tự. Không đổi gì thì trả chính ${c('todo')} — giữ tham chiếu là "không có gì thay đổi".</p>`,
      loiHayGap: ['Chỉ spread object, push vào tags — sửa gốc.', 'Không chuẩn hoá — "JS" và "js" thành hai thẻ.'],
      thamKhao: 'https://react.dev/learn/updating-objects-in-state#updating-a-nested-object',
      kiem: [
        { moTa: 'Adds a normalised tag once|||Thêm thẻ đã chuẩn hoá đúng một lần', goi: 'addTag(addTag({ id: 1, tags: ["x"] }, " JS "), "js").tags', mongDoi: ['x', 'js'] },
        { moTa: 'Originals untouched|||Bản gốc nguyên vẹn', chuanBi: 'const t = { id: 1, tags: ["x"] }; const tags = t.tags; const n = addTag(t, "y");', goi: '[t.tags, t.tags === tags, n !== t, n.tags !== t.tags]', mongDoi: [['x'], true, true, true] },
        { moTa: 'Empty tag returns the same object|||Thẻ rỗng trả lại chính object', chuanBi: 'const t = { id: 1, tags: [] };', goi: 'addTag(t, "   ") === t', mongDoi: true },
        { moTa: 'Hidden: other fields are kept|||Ẩn: các trường khác được giữ', an: true, goi: 'addTag({ id: 7, title: "z", tags: [] }, "a")', mongDoi: { id: 7, title: 'z', tags: ['a'] } },
      ],
    },
    {
      tieuDe: 'Gom nhóm todo vào Map',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['Map', 'gom nhóm'], tienQuyet: ['Map', 'vòng lặp'], the: ['javascript', 'map'],
      moTa: `${BAI}<p>Viết ${c('groupByStatus(todos)')} trả về ${c('Map')} có ĐÚNG hai khoá theo thứ tự ${c('"open"')} rồi ${c('"done"')}, mỗi khoá là mảng todo (giữ thứ tự gốc, dùng lại object gốc). Rồi viết ${c('summary(todos)')} trả chuỗi ${c('"open: 2, done: 1"')} dựa trên Map đó.</p>`,
      yeuCau: [
        'Map luôn có cả hai khoá, kể cả khi một nhóm rỗng.',
        'Phần tử trong nhóm là chính object gốc (không chép).',
        `${c('summary')} trả ${c('"open: N, done: M"')}.`,
      ],
      dauVao: 'todos: { done: boolean }[].', dauRa: 'Map<"open"|"done", todo[]>; string.',
      rangBuoc: ['Không sửa todos.'],
      viDu: [{ input: 'groupByStatus(todos).get("done").length', output: '1', explanation: 'Một todo đã xong.' }],
      goiY: ['const m = new Map([["open", []], ["done", []]]);', 'for (const t of todos) m.get(t.done ? "done" : "open").push(t);'],
      khoiDau: { 'main.js': `// Bài 11.4 — gom nhóm
function groupByStatus(todos) {
  return { open: todos.filter((t) => !t.done), done: todos.filter((t) => t.done) };   // object, không phải Map
}
function summary(todos) {}
` },
      loiGiai: { 'main.js': `// Bài 11.4 — gom nhóm vào Map có sẵn hai khoá theo thứ tự cố định
function groupByStatus(todos) {
  const m = new Map([['open', []], ['done', []]]);   // thứ tự khoá = thứ tự thêm
  for (const t of todos) {
    m.get(t.done ? 'done' : 'open').push(t);         // push vào mảng MỚI của Map, không đụng todos
  }
  return m;
}

function summary(todos) {
  const m = groupByStatus(todos);
  return 'open: ' + m.get('open').length + ', done: ' + m.get('done').length;
}
` },
      giaiThich: `<p>Khởi tạo Map với hai khoá sẵn giúp nhóm rỗng vẫn có mặt và thứ tự cố định. ${c('push')} ở đây hợp lệ: mảng nhóm là mảng MỚI ta vừa tạo, không phải state của ai. Phần tử trong nhóm là chính object gốc — gom nhóm không cần chép.</p>`,
      loiHayGap: ['Chỉ tạo khoá khi gặp phần tử — nhóm rỗng biến mất.', 'Trả object thường — kiểm instanceof Map trượt.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
      kiem: [
        { moTa: 'Returns a Map with open then done|||Trả Map với open rồi done', chuanBi: TODOS, goi: '[groupByStatus(todos) instanceof Map, [...groupByStatus(todos).keys()]]', mongDoi: [true, ['open', 'done']] },
        { moTa: 'Groups reuse the original objects|||Nhóm dùng lại object gốc', chuanBi: `${TODOS} const g = groupByStatus(todos);`, goi: '[g.get("open").length, g.get("done")[0] === todos[2]]', mongDoi: [2, true] },
        { moTa: 'Empty group still present|||Nhóm rỗng vẫn có mặt', goi: 'groupByStatus([{ done: false }]).get("done")', mongDoi: [] },
        { moTa: 'summary|||summary', chuanBi: TODOS, goi: 'summary(todos)', mongDoi: 'open: 2, done: 1' },
      ],
    },
    {
      tieuDe: 'setIn: cập nhật sâu mà bất biến',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['immutable update', 'đệ quy', 'spread'], tienQuyet: ['spread', 'đệ quy'], the: ['javascript', 'immutable'],
      moTa: `${BAI}<p>Viết ${c('setIn(obj, path, value)')}: ${c('path')} là mảng khoá (chuỗi cho object, số cho mảng), trả về bản MỚI của ${c('obj')} trong đó vị trí ${c('path')} mang ${c('value')}. Chỉ những object/mảng NẰM TRÊN đường đi được chép; mọi nhánh khác giữ nguyên tham chiếu. Khoá chưa tồn tại thì tạo object rỗng. ${c('path')} rỗng ⇒ trả ${c('value')}.</p>`,
      yeuCau: [
        `${c('setIn(user, ["address", "city"], "Hue")')} đổi thành phố, ${c('user')} gốc không đổi.`,
        'Nhánh không nằm trên đường đi giữ nguyên tham chiếu; mảng vẫn là mảng.',
        'Khoá thiếu được tạo; path rỗng ⇒ value.',
      ],
      dauVao: 'obj: object/mảng; path: (string|number)[]; value: bất kỳ.', dauRa: 'Bản mới.',
      rangBuoc: ['Không dùng structuredClone hay JSON (chép quá nhiều).'],
      viDu: [{ input: 'setIn({ a: [1, 2] }, ["a", 1], 9)', output: '{ a: [1, 9] }', explanation: 'Chép object ngoài và mảng a; phần còn lại giữ nguyên.' }],
      goiY: ['Đệ quy: const [k, ...rest] = path; const child = obj?.[k] ?? {}; const next = setIn(child, rest, value);', 'Array.isArray(obj) ? obj.with(k, next) — hoặc copy = [...obj]; copy[k] = next — : { ...obj, [k]: next }'],
      khoiDau: { 'main.js': `// Bài 11.4 — setIn (đang sửa tại chỗ)
function setIn(obj, path, value) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
  return obj;
}
` },
      loiGiai: { 'main.js': `// Bài 11.4 — setIn: chép đúng các tầng nằm trên đường đi, mọi nhánh khác dùng lại
function setIn(obj, path, value) {
  if (path.length === 0) return value;               // tới đích: giá trị mới thay chỗ này
  const [k, ...rest] = path;
  const child = obj != null && obj[k] !== undefined ? obj[k] : {};   // khoá thiếu ⇒ tạo object rỗng
  const next = setIn(child, rest, value);            // đệ quy xuống tầng dưới
  if (Array.isArray(obj)) {
    const copy = [...obj];                           // mảng mới, phần tử khác dùng lại
    copy[k] = next;
    return copy;
  }
  return { ...(obj ?? {}), [k]: next };              // object mới, thuộc tính khác dùng lại
}
` },
      giaiThich: `<p>Mỗi tầng đệ quy chỉ chép một container (object hoặc mảng) — đúng những tầng trên đường đi. Thuộc tính khác được spread sang nên giữ nguyên tham chiếu. Đây chính là việc các thư viện như Immer làm hộ bạn trong React/Redux.</p>`,
      loiHayGap: ['Chép nông một lần ở ngoài cùng — tầng sâu vẫn bị sửa.', 'Biến mảng thành object khi spread ({ ...arr }).'],
      thamKhao: 'https://react.dev/learn/updating-objects-in-state#write-concise-update-logic-with-immer',
      kiem: [
        { moTa: 'Deep update, original untouched|||Đổi sâu, gốc nguyên vẹn', chuanBi: 'const u = { name: "Lan", address: { city: "Hanoi", zip: "100000" } }; const n = setIn(u, ["address", "city"], "Hue");', goi: '[n.address.city, u.address.city, n.address.zip]', mongDoi: ['Hue', 'Hanoi', '100000'] },
        { moTa: 'Only the path is copied|||Chỉ chép trên đường đi', chuanBi: 'const u = { a: { b: 1 }, other: { x: 1 } }; const n = setIn(u, ["a", "b"], 2);', goi: '[n !== u, n.a !== u.a, n.other === u.other]', mongDoi: [true, true, true] },
        { moTa: 'Arrays stay arrays|||Mảng vẫn là mảng', goi: 'setIn({ a: [1, 2, 3] }, ["a", 1], 9)', mongDoi: { a: [1, 9, 3] } },
        { moTa: 'Missing keys are created|||Khoá thiếu được tạo', goi: 'setIn({}, ["x", "y"], 1)', mongDoi: { x: { y: 1 } } },
        { moTa: 'Empty path returns value|||Path rỗng trả value', goi: 'setIn({ a: 1 }, [], "z")', mongDoi: 'z' },
        { moTa: 'Hidden: array element objects reused|||Ẩn: phần tử mảng không đổi được dùng lại', an: true, chuanBi: 'const s = { list: [{ id: 1 }, { id: 2 }] }; const n = setIn(s, ["list", 1, "id"], 5);', goi: '[n.list[0] === s.list[0], n.list[1].id, s.list[1].id, Array.isArray(n.list)]', mongDoi: [true, 5, 2, true] },
      ],
    },
  ],
});

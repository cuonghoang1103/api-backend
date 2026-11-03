/** Bộ luyện bài 9.4 — Hàm và generic. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm chạy JavaScript ⇒ viết những hàm mà ở TypeScript sẽ là generic (first/last, findById, groupBy, getJson với vị từ
 *  kiểu, memoize, pipe) và hàm có tham số mặc định/tuỳ chọn được kiểm số đối số — mỗi đề ghi chữ ký TypeScript tương ứng. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 9.4 — Hàm và generic.</em> Mỗi đề ghi chữ ký TypeScript mà hàm sẽ có; bạn viết thân hàm bằng JavaScript. Generic không làm hàm chạy khác đi — nó chỉ giữ cho kiểu của người gọi đi xuyên qua hàm.</p>';

export default doiDau({
  slug: 'wf-9-4-functions-generics',
  ten: '9.4 Hàm và generic',
  baiHoc: 'Nền tảng Web — Bài 9.4 Functions and generics',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Tham số mặc định + kiểm số đối số (priceWithTax), first/last<T>, findById<T extends { id: number }>, groupBy<T, K>, getJson<T> với vị từ kiểu không nói dối, memoize<A, R> và pipe — 6 bài, mỗi bài kèm chữ ký TypeScript.',
  de: [
    {
      tieuDe: 'Tham số mặc định và số đối số',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['tham số mặc định', 'kiểu trả về'], tienQuyet: ['arguments', 'Math.round'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Chữ ký: ${c('function priceWithTax(price: number, rate: number = 0.1): number')}. Viết thân hàm trả ${c('Math.round(price * (1 + rate))')}, đồng thời tự làm ba phép kiểm tsc làm ở functions.ts: gọi với 0 hoặc hơn 2 đối số ⇒ ${c('TypeError("Expected 1-2 arguments, but got <n>.")')}; ${c('price')} không phải số ⇒ ${c('TypeError("price must be a number")')}; ${c('rate')} được truyền nhưng không phải số ⇒ ${c('TypeError("rate must be a number")')}. Truyền ${c('undefined')} cho rate ⇒ dùng mặc định.</p>`,
      yeuCau: ['Mặc định 0.1.', 'Đếm đối số thật.', 'Ném đúng chữ của tsc.'],
      dauVao: 'price, rate?.', dauRa: 'number.',
      rangBuoc: ['Dùng rest parameter để đếm đối số (arrow function không có arguments).'],
      viDu: [{ input: 'priceWithTax(25000)', output: '27500', explanation: 'Thuế 10% mặc định.' }],
      goiY: ['function priceWithTax(...args) { if (args.length < 1 || args.length > 2) throw … }', 'const [price, rate = 0.1] = args;'],
      khoiDau: { 'main.js': `// Bài 9.4 — function priceWithTax(price: number, rate: number = 0.1): number
function priceWithTax(price, rate = 0.1) {
  return price * (1 + rate);
}
` },
      loiGiai: { 'main.js': `// Bài 9.4 — function priceWithTax(price: number, rate: number = 0.1): number
// tsc kiểm số đối số và kiểu lúc biên dịch; ở đây làm lại lúc chạy để thấy nó kiểm những gì
function priceWithTax(...args) {
  if (args.length < 1 || args.length > 2) throw new TypeError('Expected 1-2 arguments, but got ' + args.length + '.');
  const [price, rate = 0.1] = args;                 // mặc định áp cả khi truyền undefined
  if (typeof price !== 'number') throw new TypeError('price must be a number');
  if (typeof rate !== 'number') throw new TypeError('rate must be a number');
  return Math.round(price * (1 + rate));
}
` },
      giaiThich: `<p>Mặc định làm tham số thành tuỳ chọn, nhưng số đối số vẫn bị kiểm: ${c('priceWithTax(25000, 0.1, 2)')} là lỗi TS2554 trong bài. JavaScript thuần thì lặng lẽ bỏ đối số thứ ba. Kiểu trả về ${c(': number')} cộng ${c('Math.round')} bảo đảm không ai nhận ${c('27500.000000000004')}.</p>`,
      loiHayGap: ['Quên làm tròn: 25000 * 1.1 = 27500.000000000004.', 'Không nhận undefined làm mặc định.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters',
      kiem: [
        { moTa: 'Default and explicit rate|||Mặc định và rate truyền vào', goi: '[priceWithTax(25000), priceWithTax(25000, 0.08), priceWithTax(25000, undefined)]', mongDoi: [27500, 27000, 27500] },
        { moTa: 'A string price is refused|||Giá chuỗi bị từ chối', goi: 'priceWithTax("25000")', mongDoi: { loi: 'TypeError', thongDiep: '^price must be a number$' } },
        { moTa: 'Three arguments|||Ba đối số', goi: 'priceWithTax(25000, 0.1, 2)', mongDoi: { loi: 'TypeError', thongDiep: '^Expected 1-2 arguments, but got 3\\.$' } },
        { moTa: 'No arguments and a bad rate|||Không đối số và rate sai', goi: '[(() => { try { priceWithTax(); } catch (e) { return e.message; } })(), (() => { try { priceWithTax(1, "0.1"); } catch (e) { return e.message; } })()]', mongDoi: ['Expected 1-2 arguments, but got 0.', 'rate must be a number'] },
      ],
    },
    {
      tieuDe: 'first, last và findById',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['generic <T>', 'T extends'], tienQuyet: ['find', 'at'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Ba chữ ký: ${c('first<T>(items: T[]): T | undefined')}, ${c('last<T>(items: T[]): T | undefined')}, ${c('findById<T extends { id: number }>(items: T[], id: number): T | undefined')}. Viết cả ba. Mảng rỗng hoặc không tìm thấy ⇒ ${c('undefined')} (không ném lỗi). ${c('findById')} so ${c('id')} bằng ${c('===')} (chuỗi ${c('"2"')} không khớp số ${c('2')}). Hàm phải trả ĐÚNG object trong mảng (cùng tham chiếu), không phải bản sao.</p>`,
      yeuCau: ['undefined khi rỗng/không thấy.', 'So ===.', 'Trả cùng tham chiếu.'],
      dauVao: 'items: T[]; id: number.', dauRa: 'T | undefined.',
      rangBuoc: ['Không sửa mảng.'],
      viDu: [{ input: 'findById([{ id: 1, name: "Notebook" }, { id: 2, name: "Pen" }], 2)', output: '{ id: 2, name: "Pen" }', explanation: 'T là { id: number; name: string } — kiểu thật được giữ.' }],
      goiY: ['items[0] / items.at(-1)', 'items.find((x) => x.id === id)'],
      khoiDau: { 'main.js': `// Bài 9.4 — first<T>, last<T>, findById<T extends { id: number }>
function first(items) {
  return items[0] || null;
}
function last(items) {
  return items.pop();
}
function findById(items, id) {
  return items.find((x) => x.id == id);
}
` },
      loiGiai: { 'main.js': `// Bài 9.4 — generic không đổi cách chạy; nó chỉ nói "trả về cùng kiểu phần tử T"
function first(items) {             // first<T>(items: T[]): T | undefined
  return items[0];
}

function last(items) {              // last<T>(items: T[]): T | undefined
  return items.at(-1);              // không pop — không sửa mảng của người gọi
}

function findById(items, id) {      // findById<T extends { id: number }>(items: T[], id: number): T | undefined
  return items.find((x) => x.id === id);
}
` },
      giaiThich: `<p>${c('items[0] || null')} biến phần tử ${c('0')} hay ${c('""')} thành ${c('null')} và đổi kiểu trả về; ${c('pop')} sửa mảng của người gọi. Kiểu ${c('T | undefined')} buộc người gọi xử lý trường hợp không có (lỗi TS18048 "possibly undefined" ở generics-errors.ts).</p>`,
      loiHayGap: ['|| null nuốt giá trị falsy.', 'pop sửa mảng.', '== làm "2" khớp 2.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
      kiem: [
        { moTa: 'first and last, falsy values kept|||first và last, giữ giá trị falsy', goi: '[first([0, 1]), last(["a", ""]), first([]), last([])]', mongDoi: [0, '', { $js: 'undefined' }, { $js: 'undefined' }] },
        { moTa: 'last does not change the array|||last không sửa mảng', goi: '(() => { const a = [1, 2, 3]; last(a); return a; })()', mongDoi: [1, 2, 3] },
        { moTa: 'findById returns the same object|||findById trả đúng object', goi: '(() => { const pen = { id: 2, name: "Pen" }; const list = [{ id: 1, name: "Notebook" }, pen]; return [findById(list, 2) === pen, findById(list, "2"), findById(list, 9)]; })()', mongDoi: [true, { $js: 'undefined' }, { $js: 'undefined' }] },
      ],
    },
    {
      tieuDe: 'groupBy<T, K>',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['generic hai tham số', 'callback'], tienQuyet: ['reduce', 'object'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Chữ ký: ${c('function groupBy<T, K extends string>(items: T[], key: (item: T) => K): Record<K, T[]>')}. Viết thân hàm: gọi ${c('key(item, index)')} cho từng món, gom món vào mảng theo khoá trả về, khoá theo thứ tự xuất hiện lần đầu, món trong mỗi nhóm theo thứ tự gốc. Nếu ${c('key')} trả về thứ không phải chuỗi ⇒ ném ${c('TypeError("key must return a string, got <typeof>")')}. Ví dụ dùng bài viết của Chương 8: ${c('groupBy(posts, (p) => p.published ? "live" : "draft")')}.</p>`,
      yeuCau: ['Gọi key với (item, index).', 'Giữ thứ tự.', 'Kiểm kết quả của key.'],
      dauVao: 'items: T[]; key: (item, index) => string.', dauRa: 'object { khoá: T[] }.',
      rangBuoc: ['Không dùng Object.groupBy (để tự viết).'],
      viDu: [{ input: 'groupBy([{ t: "Hello", published: true }, { t: "Draft", published: false }], (p) => p.published ? "live" : "draft")', output: '{ live: [{ t: "Hello", published: true }], draft: [{ t: "Draft", published: false }] }', explanation: 'Kiểu kết quả: Record<"live" | "draft", Post[]>.' }],
      goiY: ['const out = {}; items.forEach((item, i) => { const k = key(item, i); (out[k] ??= []).push(item); });', 'if (typeof k !== "string") throw new TypeError(…)'],
      khoiDau: { 'main.js': `// Bài 9.4 — groupBy<T, K extends string>(items: T[], key: (item: T) => K): Record<K, T[]>
function groupBy(items, key) {
  return {};
}
` },
      loiGiai: { 'main.js': `// Bài 9.4 — groupBy<T, K extends string>(items: T[], key: (item: T, index: number) => K): Record<K, T[]>
function groupBy(items, key) {
  const out = {};
  items.forEach((item, i) => {
    const k = key(item, i);
    if (typeof k !== 'string') throw new TypeError('key must return a string, got ' + typeof k);
    (out[k] ??= []).push(item);                   // tạo nhóm lần đầu gặp khoá ⇒ đúng thứ tự xuất hiện
  });
  return out;
}
` },
      giaiThich: `<p>Hai tham số kiểu: ${c('T')} giữ hình dạng món (bài viết vẫn là bài viết ở đầu ra), ${c('K')} giữ các khoá literal (${c('"live" | "draft"')}) nên ${c('groups.live')} có kiểu còn ${c('groups.lve')} là lỗi. Ràng buộc ${c('K extends string')} là lý do ta kiểm kết quả ${c('key')} lúc chạy.</p>`,
      loiHayGap: ['Mất thứ tự nhóm.', 'Không truyền index.', 'Để khoá số tự đổi thành chuỗi lặng lẽ.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#using-type-parameters-in-generic-constraints',
      kiem: [
        { moTa: 'Posts by published|||Bài viết theo trạng thái', goi: 'groupBy([{ id: 1, published: true }, { id: 2, published: false }, { id: 3, published: true }], (p) => p.published ? "live" : "draft")', mongDoi: { live: [{ id: 1, published: true }, { id: 3, published: true }], draft: [{ id: 2, published: false }] } },
        { moTa: 'key receives the index|||key nhận chỉ số', goi: 'groupBy(["a", "b", "c", "d"], (_, i) => i % 2 === 0 ? "even" : "odd")', mongDoi: { even: ['a', 'c'], odd: ['b', 'd'] } },
        { moTa: 'Empty input|||Đầu vào rỗng', goi: 'groupBy([], () => "x")', mongDoi: {} },
        { moTa: 'A non-string key throws|||Khoá không phải chuỗi ném lỗi', goi: 'groupBy([{ n: 1 }], (x) => x.n)', mongDoi: { loi: 'TypeError', thongDiep: '^key must return a string, got number$' } },
      ],
    },
    {
      tieuDe: 'getJson<T> không nói dối',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['vị từ kiểu', 'generic chỉ ở kiểu trả về'], tienQuyet: ['async/await', 'fetch'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Chữ ký: ${c('async function getJson<T>(url: string, check: (v: unknown) => v is T, fetchFn = fetch): Promise<T>')}. Viết thân hàm: gọi ${c('fetchFn(url)')}; ${c('!res.ok')} ⇒ ném ${c('Error("HTTP <status>")')}; đọc ${c('await res.json()')}; ${c('check(data)')} sai ⇒ ném ${c('TypeError("unexpected response shape from <url>")')}; đúng ⇒ trả ${c('data')}. Viết thêm vị từ ${c('isProduct(v)')}: object (không null) có ${c('id')} số, ${c('name')} chuỗi, ${c('price')} số. Kiểm thử truyền ${c('fetchFn')} giả.</p>`,
      yeuCau: ['Kiểm res.ok trước.', 'check quyết định có trả về không.', 'isProduct kiểm ba trường.'],
      dauVao: 'url; check; fetchFn.', dauRa: 'Promise<T>.',
      rangBuoc: ['Không dùng "as" hay ép kiểu — kiểu do check chứng minh.'],
      viDu: [{ input: 'await getJson("/api/products/7", isProduct, fakeFetch)', output: '{ id: 7, name: "Ruler", price: 8000 }', explanation: 'Trả về khi check đúng.' }],
      goiY: ['const res = await fetchFn(url); if (!res.ok) throw new Error("HTTP " + res.status);', 'if (!check(data)) throw new TypeError("unexpected response shape from " + url);'],
      khoiDau: { 'main.js': `// Bài 9.4 — getJson<T>(url, check: (v: unknown) => v is T): Promise<T>
async function getJson(url, check, fetchFn = fetch) {
  const res = await fetchFn(url);
  return res.json();           // parse<T> kiểu cũ: chẳng kiểm gì cả
}
function isProduct(v) {
  return true;
}
` },
      loiGiai: { 'main.js': `// Bài 9.4 — T xuất hiện ở THAM SỐ check (vị từ kiểu) ⇒ kiểu trả về được chứng minh, không phải "as T" đội lốt
async function getJson(url, check, fetchFn = fetch) {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();                       // unknown
  if (!check(data)) throw new TypeError('unexpected response shape from ' + url);
  return data;                                         // T — đã được check chứng minh
}

function isProduct(v) {                                // (v: unknown): v is { id: number; name: string; price: number }
  return typeof v === 'object' && v !== null
    && typeof v.id === 'number' && typeof v.name === 'string' && typeof v.price === 'number';
}
` },
      giaiThich: `<p>${c('parse<T>(json): T')} là bẫy của Bài 9.4: T chỉ có ở kiểu trả về, nên không có gì kiểm. Ở đây T còn xuất hiện ở ${c('check: (v: unknown) => v is T')} — người gọi phải đưa một hàm thật sự kiểm, và TypeScript suy T từ chính hàm đó. Bài 9.5 dùng ${c('Product.safeParse')} của zod làm đúng vai này.</p>`,
      loiHayGap: ['Đọc json trước khi kiểm res.ok.', 'isProduct quên null.', 'Trả data khi check sai.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates',
      kiem: [
        { moTa: 'isProduct|||isProduct', goi: '[isProduct({ id: 7, name: "Ruler", price: 8000 }), isProduct({ id: 7, title: "Ruler", price: "8000" }), isProduct(null), isProduct("x")]', mongDoi: [true, false, false, false] },
        { moTa: 'A valid response is returned|||Response hợp lệ được trả về', goi: 'await getJson("/api/products/7", isProduct, async () => ({ ok: true, status: 200, json: async () => ({ id: 7, name: "Ruler", price: 8000 }) }))', mongDoi: { id: 7, name: 'Ruler', price: 8000 } },
        { moTa: 'The wrong shape is refused|||Hình dạng sai bị từ chối', goi: 'await getJson("/api/products/7", isProduct, async () => ({ ok: true, status: 200, json: async () => ({ id: 7, title: "Ruler", price: "8000" }) }))', mongDoi: { loi: 'TypeError', thongDiep: '^unexpected response shape from /api/products/7$' } },
        { moTa: 'HTTP errors come first|||Lỗi HTTP báo trước', goi: 'await getJson("/api/products/999", isProduct, async () => ({ ok: false, status: 404, json: async () => ({ error: "not found" }) }))', mongDoi: { loi: 'Error', thongDiep: '^HTTP 404$' } },
      ],
    },
    {
      tieuDe: 'memoize<A, R>',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['hàm bậc cao', 'generic giữ chữ ký'], tienQuyet: ['closure', 'Map'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Chữ ký: ${c('function memoize<A extends unknown[], R>(fn: (...args: A) => R): ((...args: A) => R) & { calls: () => number }')}. Viết ${c('memoize(fn)')} trả hàm mới cùng tham số: lần đầu gặp một bộ đối số thì gọi ${c('fn')} và nhớ kết quả; lần sau trả kết quả đã nhớ. Khoá nhớ là ${c('JSON.stringify(args)')}. Hàm trả về có thêm phương thức ${c('calls()')} trả số lần ${c('fn')} THẬT SỰ được gọi. Nếu ${c('fn')} ném lỗi thì không nhớ gì (lần sau gọi lại).</p>`,
      yeuCau: ['Nhớ theo bộ đối số.', 'calls() đếm lần gọi thật.', 'Lỗi không được nhớ.'],
      dauVao: 'fn.', dauRa: 'hàm có calls().',
      rangBuoc: ['Mỗi lần memoize có bộ nhớ riêng.'],
      viDu: [{ input: 'const slow = memoize((a, b) => a * b); slow(3, 4); slow(3, 4); slow.calls()', output: '1', explanation: 'Lần thứ hai lấy từ bộ nhớ.' }],
      goiY: ['const cache = new Map(); let count = 0;', 'const wrapped = (...args) => { const k = JSON.stringify(args); if (cache.has(k)) return cache.get(k); … }; wrapped.calls = () => count;'],
      khoiDau: { 'main.js': `// Bài 9.4 — memoize<A extends unknown[], R>(fn: (...args: A) => R)
function memoize(fn) {
  return fn;
}
` },
      loiGiai: { 'main.js': `// Bài 9.4 — A giữ danh sách tham số, R giữ kiểu trả về: hàm bọc có ĐÚNG chữ ký của hàm gốc
function memoize(fn) {
  const cache = new Map();
  let count = 0;
  const wrapped = (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    count++;
    const result = fn(...args);                 // ném lỗi ⇒ dừng ở đây, không có gì được nhớ
    cache.set(key, result);
    return result;
  };
  wrapped.calls = () => count;
  return wrapped;
}
` },
      giaiThich: `<p>Không có generic, ${c('memoize')} sẽ trả ${c('(...args: any[]) => any')} và mọi kiểu biến mất sau khi bọc. Với ${c('A')} và ${c('R')}, ${c('memoize(priceWithTax)')} vẫn là ${c('(price: number, rate?: number) => number')}.</p>`,
      loiHayGap: ['Một cache chung cho mọi hàm.', 'Đếm cả lần lấy từ cache.', 'Nhớ lỗi.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types',
      kiem: [
        { moTa: 'Results are remembered per arguments|||Nhớ kết quả theo đối số', goi: '(() => { const m = memoize((a, b) => a * b); return [m(3, 4), m(3, 4), m(4, 3), m.calls()]; })()', mongDoi: [12, 12, 12, 2] },
        { moTa: 'Separate caches|||Bộ nhớ riêng', goi: '(() => { const a = memoize((x) => x + 1); const b = memoize((x) => x + 2); return [a(1), b(1), a.calls(), b.calls()]; })()', mongDoi: [2, 3, 1, 1] },
        { moTa: 'Errors are not cached|||Lỗi không được nhớ', goi: '(() => { let n = 0; const m = memoize((x) => { n++; if (n === 1) throw new Error("flaky"); return x * 2; }); try { m(5); } catch {} return [m(5), m(5), m.calls()]; })()', mongDoi: [10, 10, 2] },
      ],
    },
    {
      tieuDe: 'pipe: nối các hàm có kiểu',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['kết hợp hàm', 'kiểu nối tiếp'], tienQuyet: ['reduce', 'hàm bậc cao'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Trong TypeScript, ${c('pipe(f, g, h)')} có chữ ký ${c('pipe<A, B, C, D>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D): (a: A) => D')} — kiểu ra của mỗi hàm phải khớp kiểu vào của hàm sau. Viết ${c('pipe(...steps)')} bằng JavaScript, trong đó mỗi bước là ${c('{ name, fn, input, output }')} với ${c('input')}/${c('output')} là tên kiểu ${c('"string" | "number" | "boolean" | "object"')}. ${c('pipe')} phải: (1) kiểm lúc TẠO rằng ${c('output')} của mỗi bước bằng ${c('input')} của bước sau, sai ⇒ ném ${c('TypeError("<tên trước> returns <output> but <tên sau> expects <input>")')}; (2) trả hàm ${c('run(value)')} chạy lần lượt các ${c('fn')}, và trước MỖI bước kiểm ${c('typeof value')} (null coi là ${c('"null"')}) bằng ${c('input')} của bước đó, sai ⇒ ${c('TypeError("<tên> expected <input>, got <thật>")')}. Không có bước nào ⇒ ${c('run')} trả nguyên giá trị.</p>`,
      yeuCau: ['Kiểm khớp nối lúc tạo.', 'Kiểm kiểu trước mỗi bước lúc chạy.', 'Chạy theo thứ tự.'],
      dauVao: 'steps: { name, fn, input, output }[].', dauRa: 'run: (value) => kết quả.',
      rangBuoc: ['Lỗi nối phải ném ngay khi gọi pipe, trước khi chạy gì.'],
      viDu: [{ input: 'pipe(trim, toNumber, withTax)(" 25000 ")', output: '27500', explanation: 'string → string → number → number.' }],
      goiY: ['for (let i = 1; i < steps.length; i++) if (steps[i - 1].output !== steps[i].input) throw …', 'return (value) => steps.reduce((v, s) => { check(v, s); return s.fn(v); }, value);'],
      khoiDau: { 'main.js': `// Bài 9.4 — pipe: kiểu ra của bước trước phải khớp kiểu vào của bước sau
function pipe(...steps) {
  return (value) => steps.reduce((v, s) => s.fn(v), value);
}
` },
      loiGiai: { 'main.js': `// Bài 9.4 — tsc kiểm khớp nối B → B → C lúc biên dịch; ở đây: kiểm nối lúc TẠO, kiểm giá trị lúc CHẠY
const kindOf = (v) => (v === null ? 'null' : typeof v);

function pipe(...steps) {
  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1];
    const next = steps[i];
    if (prev.output !== next.input) {
      throw new TypeError(prev.name + ' returns ' + prev.output + ' but ' + next.name + ' expects ' + next.input);
    }
  }
  return (value) => steps.reduce((v, step) => {
    const got = kindOf(v);
    if (got !== step.input) throw new TypeError(step.name + ' expected ' + step.input + ', got ' + got);
    return step.fn(v);
  }, value);
}
` },
      giaiThich: `<p>Phần (1) là thứ generic cho bạn miễn phí: ${c('pipe(trim, withTax)')} với ${c('trim: string => string')} và ${c('withTax: number => number')} là lỗi biên dịch. Phần (2) là thứ kiểu không làm được: giá trị đầu vào đến lúc chạy, và một ${c('fn')} viết sai vẫn có thể trả về ${c('NaN')} hay ${c('null')}.</p>`,
      loiHayGap: ['Chỉ kiểm lúc chạy — lỗi nối lộ ra muộn.', 'typeof null là "object".', 'Kiểm sau khi đã gọi fn.'],
      thamKhao: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions',
      kiem: [
        { moTa: 'string → number → number|||string → number → number', goi: 'pipe({ name: "trim", fn: (s) => s.trim(), input: "string", output: "string" }, { name: "toNumber", fn: Number, input: "string", output: "number" }, { name: "withTax", fn: (n) => Math.round(n * 1.1), input: "number", output: "number" })(" 25000 ")', mongDoi: 27500 },
        { moTa: 'A bad connection throws at creation|||Nối sai ném lỗi ngay lúc tạo', goi: 'pipe({ name: "trim", fn: (s) => s.trim(), input: "string", output: "string" }, { name: "withTax", fn: (n) => n * 1.1, input: "number", output: "number" })', mongDoi: { loi: 'TypeError', thongDiep: '^trim returns string but withTax expects number$' } },
        { moTa: 'A wrong runtime value is caught before the step|||Giá trị sai bị chặn trước bước', goi: 'pipe({ name: "trim", fn: (s) => s.trim(), input: "string", output: "string" })(null)', mongDoi: { loi: 'TypeError', thongDiep: '^trim expected string, got null$' } },
        { moTa: 'A step that lies about its output|||Bước khai sai kiểu ra', goi: 'pipe({ name: "parse", fn: (s) => JSON.parse(s), input: "string", output: "object" }, { name: "keys", fn: (o) => Object.keys(o).length, input: "object", output: "number" })("42")', mongDoi: { loi: 'TypeError', thongDiep: '^keys expected object, got number$' } },
        { moTa: 'No steps|||Không có bước nào', goi: 'pipe()("x")', mongDoi: 'x' },
      ],
    },
  ],
});

/**
 * csd-cs10.mjs — CSD201 ⭐ Chuyên sâu 10: THIẾT KẾ CẤU TRÚC DỮ LIỆU & PHỎNG VẤN THUẬT TOÁN (deck TỔNG KẾT, tự dựng).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs10.mjs --out <dir>
 *
 * Nối Chương 1 (danh sách liên kết đôi), 0.D (khấu hao), Chương 4 (heap), 7 (băm) và các deck ⭐ CS.1–CS.9 — không giảng
 * lại. Mọi bảng từng bước, mọi con số (PASS/FAIL, số phép so, thứ tự duyệt) chép từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs10/*.java (javac --release 8, chạy trên JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs10', code: 'CS10', title: 'Thiết kế cấu trúc dữ liệu & phỏng vấn', sub: 'CSD201 · ⭐ Chuyên sâu' };

const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', lam: '#2b6cb0' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff', lam: '#e3eefa' };

const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:15px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;
const hai = (a, b, cols = '1fr 1fr') => `<div class="hai" style="grid-template-columns:${cols.replace(/([\d.]+fr)/g, 'minmax(0,$1)')}"><div>${a}</div><div>${b}</div></div>`;

/* ───────────── SVG: ô (box) + mũi tên ───────────── */
const hop = (x, y, w, h, chu, m = null, fs = 17) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${m ? NEN[m] : NEN.trang}" stroke="${m ? MAU[m] : MAU.vien}" stroke-width="${m ? 2.4 : 1.5}"/>` +
  `<text x="${x + w / 2}" y="${y + h / 2 + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#262626">${chu}</text>`;
const muiTen = (x1, y1, x2, y2, mau = '#8c8c8c', w = 1.8) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${mau}" stroke-width="${w}" marker-end="url(#mt)"/>`;
const DEF = `<defs><marker id="mt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8c8c8c"/></marker></defs>`;

/* LRU: HashMap (trái) trỏ vào nút của danh sách liên kết đôi head ⇄ 4 ⇄ 1 ⇄ 3 ⇄ tail (trạng thái sau "put 4" của slide 4) */
function lruSvg() {
  const W = 560, H = 250;
  let s = DEF;
  s += `<text x="10" y="18" font-size="14" font-weight="700" fill="${MAU.lam}">HashMap: khoá → nút</text>`;
  const keys = [4, 1, 3];
  const nx = [150, 265, 380], ny = 170;
  keys.forEach((k, i) => { s += hop(10, 32 + i * 40, 60, 32, `${k}`, 'lam', 16); });
  s += hop(20, ny, 70, 44, 'head', 'xam', 15) + hop(480, ny, 70, 44, 'tail', 'xam', 15);
  keys.forEach((k, i) => { s += hop(nx[i], ny, 90, 44, `${k}=${k * 10}`, i === 0 ? 'xanh' : i === 2 ? 'do' : null, 16); });
  const xs = [20, ...nx, 480], ws = [70, 90, 90, 90, 70];
  for (let i = 0; i < 4; i++) {
    const a = xs[i] + ws[i], b = xs[i + 1];
    s += muiTen(a + 2, ny + 14, b - 2, ny + 14) + muiTen(b - 2, ny + 30, a + 2, ny + 30);
  }
  keys.forEach((k, i) => { s += `<path d="M70,${48 + i * 40} C ${110 + i * 30},${60 + i * 40} ${nx[i] + 30},${120} ${nx[i] + 45},${ny - 2}" fill="none" stroke="${MAU.lam}" stroke-width="1.6" stroke-dasharray="5 3" marker-end="url(#mt)"/>`; });
  s += `<text x="${nx[0] + 45}" y="${ny + 66}" text-anchor="middle" font-size="13.5" font-weight="700" fill="${MAU.xanh}">mới dùng nhất</text>`;
  s += `<text x="${nx[2] + 45}" y="${ny + 66}" text-anchor="middle" font-size="13.5" font-weight="700" fill="${MAU.do}">bị đuổi kế tiếp</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* RandomizedSet: mảng trước / sau remove(20) */
function rsSvg() {
  const W = 470, H = 170;
  let s = DEF;
  const row = (y, vals, mau, nhan) => {
    s += `<text x="0" y="${y + 24}" font-size="14" font-weight="700" fill="${MAU.lam}">${nhan}</text>`;
    vals.forEach((v, i) => { s += hop(90 + i * 80, y, 70, 38, v, mau[i] || null, 17); s += `<text x="${125 + i * 80}" y="${y + 54}" text-anchor="middle" font-size="12.5" fill="#8c8c8c">${i}</text>`; });
  };
  row(8, ['10', '20', '30', '40'], { 1: 'do', 3: 'xanh' }, 'trước');
  row(100, ['10', '40', '30'], { 1: 'xanh' }, 'sau');
  s += `<path d="M 365,48 C 365,80 205,70 205,98" fill="none" stroke="${MAU.xanh}" stroke-width="2.4" marker-end="url(#mt)"/>`;
  s += `<text x="330" y="88" font-size="13" font-weight="700" fill="${MAU.xanh}">40 lấp lỗ</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="400" font-family="Arial, sans-serif">${s}</svg>`;
}

/* HashMap: mảng bucket 16 ô, bucket 3 là chuỗi 3 → 35 → 19, bucket 4 là 100 */
function bucketSvg() {
  const W = 540, H = 215;
  let s = DEF;
  for (let i = 0; i < 16; i++) {
    const on = i === 3 || i === 4;
    s += hop(8 + i * 33, 8, 30, 30, `${i}`, on ? 'cam' : null, 13);
  }
  s += `<text x="250" y="130" font-size="13" fill="#595959">table[16] — chỉ số = hash &amp; 15</text>`;
  const chain = [[3, ['3', '35', '19']], [4, ['100']]];
  chain.forEach(([b, arr], j) => {
    const x = 8 + b * 33 + 15, y0 = 38;
    arr.forEach((v, k) => {
      const bx = j === 0 ? 70 : 330, by = 80 + k * 44;
      if (k === 0) s += muiTen(x, y0, bx + 30, by - 2, MAU.cam, 1.8);
      else s += muiTen(bx + 30, by - 12, bx + 30, by - 2);
      s += hop(bx, by, 60, 32, v, j === 0 && k === 2 ? 'lam' : null, 15);
    });
  });
  s += `<text x="140" y="190" font-size="13" font-weight="700" fill="${MAU.lam}">19: bucket 3 → 19 khi bảng thành 32</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* 7 bước trình bày khi phỏng vấn */
function buocSvg() {
  const steps = ['Hỏi lại đề<br>+ ca biên', 'Nói cách<br>vét cạn + O()', 'Tối ưu<br>(mẫu nào?)', 'Viết code<br>sạch', 'Chạy tay<br>một ví dụ', 'Nêu và thử<br>ca biên', 'Phân tích<br>thời gian, bộ nhớ'];
  return `<div style="display:flex;gap:8px;align-items:stretch">${steps.map((t, i) =>
    `<div style="flex:1;border:2px solid ${i === 1 || i === 4 ? MAU.do : MAU.cam};background:${i === 1 || i === 4 ? NEN.do : NEN.cam};border-radius:10px;padding:8px 6px;text-align:center;font-size:17px;line-height:1.25">` +
    `<div style="font-size:24px;font-weight:800;color:${MAU.nau}">${i + 1}</div>${t}</div>`).join('')}</div>`;
}

export const slides = lamDeck('THIẾT KẾ CTDL &amp; PHỎNG VẤN', [
  /* 1 */
  { cover: true, t: 'Thiết kế cấu trúc dữ liệu &amp; phỏng vấn thuật toán', sub: 'LRU · LFU · min-stack · hàng đợi hai ngăn xếp · RandomizedSet · trung vị luồng · rate limiter<br>Java Collections bên trong · 14 mẫu phỏng vấn · cách trình bày · bộ đề luyện 4 tuần<br>CSD201 · Java 8 — deck tổng kết, mọi con số in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Bản đồ deck tổng kết', body: `${bang([
    ['<b>Thiết kế cấu trúc dữ liệu</b>', 'ghép 2 cấu trúc để mọi thao tác O(1) / O(log n): LRU, LFU, min-stack, hàng đợi 2 ngăn xếp, RandomizedSet, iterator, trung vị, rate limiter', '3–11'],
    ['<b>Java Collections bên trong</b>', 'HashMap (bucket, 0,75, resize, treeify), ArrayList ×1,5, ArrayDeque, PriorityQueue, TreeMap, Comparator', '12–17'],
    ['<b>14 mẫu phỏng vấn</b>', 'dấu hiệu trong đề → mẫu → deck đã học; ràng buộc n → độ phức tạp cho phép', '18–20'],
    ['<b>Trình bày khi phỏng vấn</b>', '7 bước, ví dụ Two Sum, lỗi hay gặp, cách nói khi bí', '21–23'],
    ['<b>Luyện</b>', '22 bài chọn lọc có lời giải chạy thật + lộ trình 4 tuần', '24–25'],
  ], ['Phần', 'Nội dung', 'Slide'], 'font-size:17px;line-height:1.3')}
${hai(o('<b>Nối bài trường:</b> DS liên kết đôi (Ch.1), khấu hao (0.D), heap (Ch.4), băm (Ch.7) · mỗi mẫu chỉ về deck ⭐ CS.1–9.', 'xanh'),
    o('<b>Câu hỏi thiết kế:</b> đề cho <b>một bộ thao tác</b> + độ phức tạp cho <b>từng</b> thao tác ⇒ thường là <b>ghép hai cấu trúc</b>.'))}` },

  /* 3 */
  { t: 'LRU cache: HashMap + danh sách liên kết đôi', body: hai(`${lruSvg()}
${o('<b>Đuổi (evict)</b> phần tử <b>lâu nhất chưa dùng</b> khi đầy. <code>get</code> và <code>put</code> đều phải <b class="do">O(1)</b>.', '')}`,
  `${bang([
    ['Chỉ HashMap', 'tìm O(1)', '<span class="do">không biết ai cũ nhất</span>'],
    ['Chỉ danh sách', 'biết thứ tự', '<span class="do">tìm khoá O(n)</span>'],
    ['<b>HashMap + DS liên kết đôi</b>', 'tìm O(1)', 'dời nút / xoá cuối O(1)'],
  ], ['Cách', 'Được', 'Vướng'], 'font-size:18px')}
<ul style="font-size:21px">
<li>Map giữ <b>khoá → nút</b>; danh sách xếp theo độ mới: đầu = mới dùng, cuối = sắp bị đuổi</li>
<li>Cần liên kết <b>đôi</b>: xoá một nút giữa danh sách phải biết <code>prev</code> (Chương 1)</li>
<li>Nút lưu cả <b>key</b>: đuổi nút cuối xong phải <code>map.remove(key)</code></li>
<li>Hai nút <b>lính canh</b> (sentinel) head/tail ⇒ không còn ca null</li>
</ul>`, '1.05fr 0.95fr') },

  /* 4 */
  { t: 'LRU tự cài: code và vết chạy', body: hai(`${code(`int get(int k) {
    Node x = map.get(k);
    if (x == null) return -1;
    unlink(x); addFront(x);      // vừa dùng -> đầu
    return x.val;
}
void put(int k, int v) {
    Node x = map.get(k);
    if (x != null) {                 // có rồi: cập nhật
        x.val = v; unlink(x); addFront(x); return; }
    if (map.size() == cap) {         // đầy: đuổi cuối
        Node old = tail.prev;
        unlink(old); map.remove(old.key);
    }
    x = new Node(k, v); map.put(k, x); addFront(x);
}
void unlink(Node x) {
    x.prev.next = x.next; x.next.prev = x.prev;
}`, 'java', 'sm')}`,
  `${out(`put 1        recent..old [1]
put 2        recent..old [2 1]
put 3        recent..old [3 2 1]
get 1  -> 10 recent..old [1 3 2]
put 4        recent..old [4 1 3]
get 2  -> -1 recent..old [4 1 3]
get 3  -> 30 recent..old [3 4 1]
put 5        recent..old [5 3 4]`, 'font-size:14.5px')}
${o('Sức chứa 3. <code>get 1</code> cứu 1 khỏi bị đuổi ⇒ <code>put 4</code> đuổi <b>2</b> (cũ nhất), không phải 1.', 'xanh')}
${nho('PASS 2000 lượt ngẫu nhiên (sức chứa 1..4, 60 thao tác) so với danh sách theo độ mới O(n).')}
${o('<b>Bẫy:</b> <code>put</code> khoá <b>đã có</b> phải cập nhật + dời lên đầu, <span class="do">không</span> đuổi ai.', 'do2')}`, '1.1fr 0.9fr') },

  /* 5 */
  { t: 'LRU bằng LinkedHashMap(accessOrder = true)', body: hai(`${code(`class LruMap<K, V> extends LinkedHashMap<K, V> {
    private final int cap;
    LruMap(int cap) {
        super(16, 0.75f, true);   // accessOrder
        this.cap = cap;
    }
    @Override
    protected boolean removeEldestEntry(
            Map.Entry<K, V> e) {
        return size() > cap;  // gọi sau mỗi put
    }
}`, 'java', 'sm')}
${out(`accessOrder=true  (LRU): [3, 1, 4]
accessOrder=false (FIFO): [2, 3, 4]
after containsKey(1), put(3): [2, 3]
after getOrDefault(2), put(4): [2, 4]
PASS 2000 random runs vs a recency list
  (order checked after every op)`, 'font-size:14px;margin-top:6px')}`,
  `${o('LinkedHashMap = HashMap <b>có sẵn</b> một danh sách liên kết đôi qua các entry. Duyệt: <b>cũ nhất trước</b>.', 'xanh')}
${bang([
    ['put 1,2,3, get 1, put 4', 'đuổi 2 ⇒ [3, 1, 4]', 'đuổi 1 ⇒ [2, 3, 4]'],
    ['cái gì tính là "dùng"', 'get, getOrDefault, put', 'chỉ lần put đầu'],
  ], ['', 'accessOrder = true', 'false (mặc định)'], 'font-size:17.5px')}
${o('<b>Bẫy:</b> quên tham số thứ ba ⇒ thành cache <b class="do">FIFO</b>. <code>containsKey</code> <b>không</b> tính là truy cập ⇒ 1 vẫn bị đuổi.', 'do2')}
${nho('Phỏng vấn: nói được cách này (đi làm dùng nó), nhưng thường bị yêu cầu <b>tự cài</b> như slide 4.')}` , '1.05fr 0.95fr') },

  /* 6 */
  { t: 'LFU cache: đuổi phần tử ít dùng nhất', body: hai(`<ul style="font-size:20px">
<li><code>val</code>: khoá → giá trị · <code>freq</code>: khoá → số lần dùng</li>
<li><code>byFreq</code>: tần suất f → <b>LinkedHashSet</b> các khoá (cũ nhất trước)</li>
<li><code>minFreq</code>: tần suất nhỏ nhất đang có</li>
<li>Dùng khoá: chuyển từ nhóm f sang f+1; nhóm f rỗng và f = minFreq ⇒ <code>minFreq++</code></li>
<li>Thêm khoá mới: <code>minFreq = 1</code>. Đuổi = phần tử <b>đầu</b> của nhóm minFreq (hoà ⇒ LRU)</li>
</ul>
${o('Mọi thao tác <b>O(1)</b>. Vì sao minFreq chỉ cần +1? Khoá vừa dùng sang đúng nhóm f+1 ⇒ nhóm đó không rỗng.', 'xanh')}`,
  `${out(`put 1         freq->keys {1=[1]} min=1
put 2         freq->keys {1=[1, 2]} min=1
get 1  -> 10  freq->keys {1=[2], 2=[1]} min=1
put 3         freq->keys {1=[3], 2=[1]} min=1
get 2  -> -1  freq->keys {1=[3], 2=[1]} min=1
get 3  -> 30  freq->keys {2=[1, 3]} min=2
put 4         freq->keys {1=[4], 2=[3]} min=1
get 1  -> -1  freq->keys {1=[4], 2=[3]} min=1
get 3  -> 30  freq->keys {1=[4], 3=[3]} min=1
get 4  -> 40  freq->keys {2=[4], 3=[3]} min=2`, 'font-size:13.5px')}
${nho('Sức chứa 2. <code>put 3</code> đuổi 2 (tần suất 1). <code>put 4</code>: 1 và 3 cùng tần suất 2 ⇒ đuổi <b>1</b> vì dùng lâu hơn.')}
${nho('PASS 2000 lượt ngẫu nhiên (sức chứa 0..3) so với quét tìm (tần suất nhỏ nhất, dùng cũ nhất).')}`, '0.95fr 1.05fr') },

  /* 7 */
  { t: 'Min-stack và hàng đợi bằng hai ngăn xếp', body: hai(`${code(`void push(int x) {   // min-stack
    st.push(x);
    int m = x;
    if (!mins.isEmpty())
        m = Math.min(m, mins.peek());
    mins.push(m);          // min của tầng này
}
int pop() { mins.pop(); return st.pop(); }
int min() { return mins.peek(); }   // O(1)`, 'java', 'sm')}
${out(`push 5  stack [5]  mins [5]  min=5
push 3  stack [3, 5]  mins [3, 5]  min=3
push 7  stack [7, 3, 5]  mins [3, 3, 5]  min=3
push 3  stack [3, 7, 3, 5]  mins [3, 3, 3, 5]  min=3
push 1  stack [1, 3, 7, 3, 5]  mins [1, 3, 3, 3, 5]  min=1
pop 1   stack [3, 7, 3, 5]  mins [3, 3, 3, 5]  min=3`, 'font-size:13px;margin-top:6px')}
${nho('Mỗi tầng nhớ min <b>của chính nó</b> ⇒ pop xong min cũ tự hiện lại.')}`,
  `${code(`int poll() {        // hàng đợi: in -> out
    if (out.isEmpty())
        while (!in.isEmpty())
            out.push(in.pop());   // đổ hết
    return out.pop();
}`, 'java', 'sm')}
${out(`add 1,2,3  in=[3, 2, 1] out=[]
poll -> 1  in=[] out=[2, 3]  (poured so far 3)
add 4, poll -> 2  in=[4] out=[3]  (poured so far 3)
queue: 100000 ops, 66729 adds, total pours 43400,
       worst single poll poured 21712`, 'font-size:13.5px;margin-top:6px')}
${o('<b>Khấu hao O(1)</b> (0.D): mỗi phần tử bị đổ <b>tối đa một lần</b> ⇒ 43400 lần đổ ≤ 66729 lần add; riêng một lần poll vẫn có thể O(n): 21712.', 'xanh')}
${o('<b>Bẫy:</b> đổ khi <code>out</code> còn phần tử ⇒ <b class="do">sai thứ tự</b>.', 'do2')}`, '1fr 1fr') },

  /* 8 */
  { t: 'RandomizedSet: insert, remove, getRandom đều O(1)', body: hai(`${rsSvg()}
${code(`boolean remove(int x) {
    Integer i = pos.get(x);
    if (i == null) return false;
    int last = a.get(a.size() - 1);
    a.set(i, last);           // lấp lỗ
    pos.put(last, i);
    a.remove(a.size() - 1);   // xoá CUỐI: O(1)
    pos.remove(x);            // SAU put
    return true;
}
int getRandom() {
    return a.get(rnd.nextInt(a.size()));
}`, 'java', 'sm')}`,
  `${bang([
    ['HashSet', 'O(1)', '<span class="do">không bốc ngẫu nhiên O(1)</span>'],
    ['ArrayList', 'bốc O(1)', '<span class="do">xoá giữa O(n)</span>'],
    ['<b>ArrayList + HashMap giá trị → chỉ số</b>', 'cả ba O(1)', 'đổi chỗ với phần tử cuối'],
  ], ['Chỉ dùng', 'Được', 'Vướng'], 'font-size:15.5px;line-height:1.2')}
${out(`insert 10,20,30,40  a=[10, 20, 30, 40]
                    insert 20 again -> false
remove 20: last (40) fills index 1
                    a=[10, 40, 30]  pos(40)=1
remove 30 (is last)  a=[10, 40]   remove 99 -> false
getRandom 60000 times: 10 -> 30011, 40 -> 29989
PASS 1000 random runs vs HashSet (index map checked
  after every op)`, 'font-size:12.5px;line-height:1.3')}
${o('<b>Bẫy:</b> <code>pos.remove(x)</code> <b>trước</b> <code>pos.put(last, i)</code> ⇒ khi x chính là phần tử cuối, x bị <b class="do">thêm lại</b> vào map.', 'do2')}`, '1fr 1fr') },

  /* 9 */
  { t: 'Trung vị của luồng dữ liệu bằng hai heap', body: hai(`${code(`// lo: max-heap nửa nhỏ, hi: min-heap nửa lớn
void add(int x) {
    lo.add(x);
    hi.add(lo.poll());      // max nửa dưới lên
    if (hi.size() > lo.size())
        lo.add(hi.poll());  // lo giữ phần dư
}
double median() {
    return lo.size() > hi.size() ? lo.peek()
         : ((long) lo.peek() + hi.peek()) / 2.0;
}`, 'java', 'sm')}
${o('Bất biến: mọi số trong <b>lo</b> ≤ mọi số trong <b>hi</b>, và |lo| = |hi| hoặc |hi| + 1 ⇒ trung vị nằm ở <b>đỉnh</b>.', 'xanh')}`,
  `${out(`add 5   lo [5]        hi []          median 5.0
add 15  lo [5]        hi [15]        median 10.0
add 1   lo [1, 5]     hi [15]        median 5.0
add 3   lo [1, 3]     hi [5, 15]     median 4.0
add 8   lo [1, 3, 5]  hi [8, 15]     median 5.0
add 7   lo [1, 3, 5]  hi [7, 8, 15]  median 6.0
MAX and MAX-2: median 2147483646
PASS 500 streams x 60 numbers (duplicates, negatives,
  any int) vs sorting`, 'font-size:13.5px')}
${bang([
    ['Sắp lại mỗi lần', 'O(n log n)', 'O(1)'],
    ['Chèn vào mảng đã sắp', 'O(n)', 'O(1)'],
    ['<b>Hai heap</b>', '<b>O(log n)</b>', '<b>O(1)</b>'],
  ], ['Cách', 'add', 'median'], 'font-size:17px')}
${o('<b>Bẫy:</b> <code>(lo.peek() + hi.peek()) / 2</code> bằng int ⇒ <b class="do">tràn</b> và mất phần .5.', 'do2')}`, '1fr 1fr') },

  /* 10 */
  { t: 'Iterator phẳng hoá danh sách lồng nhau', body: hai(`${code(`// ngăn xếp các iterator, mỗi tầng đang mở một cái
public boolean hasNext() {
    while (nextVal == null && !stack.isEmpty()) {
        Iterator<Object> it = stack.peek();
        if (!it.hasNext()) { stack.pop(); continue; }
        Object x = it.next();
        if (x instanceof Integer) nextVal = (Integer) x;
        else stack.push(((List<Object>) x).iterator());
    }
    return nextVal != null;
}
public Integer next() {
    if (!hasNext()) throw new NoSuchElementException();
    Integer v = nextVal; nextVal = null; return v;
}`, 'java', 'sm')}`,
  `${out(`[[1, [2]], [], 3, [[[]]], [4, 5]] -> [1, 2, 3, 4, 5]
only empty lists [[], [[]]] -> hasNext() = false
PASS 3000 random nested lists (empty lists, depth 5)
     vs recursive flatten`, 'font-size:14px')}
<ul style="font-size:20px">
<li><b>Lười</b> (lazy): không chép hết ra trước — mỗi <code>next</code> chỉ đi tới số kế</li>
<li><code>hasNext</code> làm việc và <b>gọi nhiều lần vẫn đúng</b> (chương trình cố ý gọi hai lần)</li>
<li>Bộ nhớ O(độ sâu), không phải O(n)</li>
</ul>
${o('<b>Bẫy:</b> <code>hasNext</code> chỉ hỏi <code>it.hasNext()</code> ⇒ gặp <code>[[[]]]</code> trả <b class="do">true</b> dù không còn số nào.', 'do2')}
${nho('Cùng khuôn: iterator cây BST (ngăn xếp nút trái), iterator vector 2D, "peeking iterator".')}`, '1.1fr 0.9fr') },

  /* 11 */
  { t: 'Hit counter và rate limiter cửa sổ trượt', body: hai(`${code(`// tối đa limit yêu cầu trong w giây
boolean allow(int t) {
    while (!times.isEmpty()
           && times.peekFirst() <= t - w)
        times.pollFirst();   // ra khỏi (t-w, t]
    if (times.size() == limit) return false;
    times.addLast(t);
    return true;
}`, 'java', 'sm')}
${out(`limit 3 per 10 s   (+ allowed, - rejected)
sliding log : 7+ 8+ 9+ 10- 11- 12- 16- 17+ 18+
fixed window: 7+ 8+ 9+ 10+ 11+ 12+ 16- 17- 18-
hit counter: hits(19) = 2 (log [17, 18])`, 'font-size:14px;margin-top:6px')}`,
  `<ul style="font-size:20px">
<li><b>Nhật ký cửa sổ trượt</b> (sliding log): deque thời điểm; mỗi lần gọi bỏ các mốc ≤ t − w ⇒ khấu hao O(1)</li>
<li><b>Hit counter</b> = số phần tử còn trong deque sau khi dọn</li>
<li><b>Cửa sổ cố định</b>: một bộ đếm cho mỗi khối [0,10), [10,20)… — rẻ nhưng <span class="do">sai ở ranh giới</span></li>
</ul>
${o('Cửa sổ cố định cho qua 7, 8, 9 <b>và</b> 10, 11, 12 ⇒ <b class="do">6 yêu cầu trong 6 giây</b> dù giới hạn 3/10 s. Trong 2000 luồng ngẫu nhiên nó vượt giới hạn ở <b>1746</b> luồng; sliding log PASS cả 2000.', 'do2')}
${nho('Đi làm: token bucket / sliding window counter (Redis). Bộ nhớ sliding log O(limit) mỗi người dùng.')}`, '1fr 1fr') },

  /* 12 */
  { t: 'HashMap bên trong: bucket, hệ số tải 0,75, resize ×2', body: hai(`${bucketSvg()}
${code(`int h = key.hashCode();
int hash = h ^ (h >>> 16);   // trộn bit cao
int index = hash & (table.length - 1);`, 'java', 'sm')}`,
  `${out(`key 100  bucket in 16:  4   bucket in 32:  4
key   3  bucket in 16:  3   bucket in 32:  3
key  35  bucket in 16:  3   bucket in 32:  3
key  19  bucket in 16:  3   bucket in 32: 19
inserted 100, 3, 35, 19 -> iteration order [3, 35, 19, 100]
size 12 -> order [3, 35, 19, 100]  (still 16 buckets)
size 13 -> order [3, 35, 100, 19]  (resized to 32: 19
           moved to bucket 19)
"Aa".hashCode()=2112  "BB".hashCode()=2112  -> same bucket,
           equals() tells them apart
map {Aa=1, BB=2}  size 2`, 'font-size:12.5px;line-height:1.35')}
<ul style="font-size:19px">
<li>Mặc định 16 bucket, hệ số tải (load factor) <b>0,75</b> ⇒ ngưỡng 12: phần tử thứ <b>13</b> làm bảng <b>gấp đôi</b></li>
<li>Thứ tự duyệt = thứ tự bucket ⇒ 19 đổi chỗ khi bảng thành 32 — <span class="do">đừng dựa vào thứ tự của HashMap</span></li>
<li>Va chạm (Aa, BB) vẫn đúng nhờ <code>equals</code> (Chương 7)</li>
</ul>`, '1fr 1fr') },

  /* 13 */
  { t: 'Treeify: bucket ≥ 8 và bảng ≥ 64 thành cây đỏ-đen', body: hai(`${bang([
    ['TREEIFY_THRESHOLD', '8', 'bucket dài tới ngưỡng này thì xét dựng cây'],
    ['MIN_TREEIFY_CAPACITY', '64', 'bảng nhỏ hơn ⇒ <b>resize</b> thay vì dựng cây'],
    ['UNTREEIFY_THRESHOLD', '6', 'cây còn ≤ 6 nút khi tách ⇒ về danh sách'],
  ], ['Hằng trong mã nguồn JDK 8+', 'Giá trị', 'Ý nghĩa'], 'font-size:16.5px')}
${out(`keys 0,16,..,112 (8 keys) iteration
  [0, 16, 32, 48, 64, 80, 96, 112]
keys 0,16,..,128 (9 keys) iteration
  [0, 32, 64, 96, 128, 16, 48, 80, 112]`, 'font-size:14px;margin-top:8px')}
${nho('Khoá thứ 9 vào bucket 0 (bảng 16 &lt; 64) ⇒ bảng <b>nới lên 32</b>, bucket tách đôi — dù mới 9 phần tử, chưa tới ngưỡng 12.')}`,
  `<p style="font-size:18px;margin:0">n khoá <b>cùng</b> hashCode, trung bình số lần gọi equals + compareTo mỗi <code>get</code>:</p>
${out(`   n   Comparable key   plain key
    8                4           4
   64               11          33
 1024               19         513
 4096               23        2049`, 'font-size:15px')}
${o('Khoá <b>Comparable</b>: bucket thành cây ⇒ ~log n phép so. Khoá <b>không</b> Comparable: cây không biết đi trái hay phải ⇒ vẫn ~<b class="do">n/2</b>.', 'xanh')}
${o('Treeify là <b>lưới an toàn</b> khi hashCode tệ hoặc bị tấn công va chạm, không phải lý do để viết hashCode tệ. Xấu nhất: O(log n) với khoá Comparable.', '')}` , '1fr 1fr') },

  /* 14 */
  { t: 'ArrayList tăng ×1,5 · ArrayDeque so với LinkedList', body: hai(`${code(`// ArrayList.grow (mã nguồn JDK)
int newCapacity = oldCapacity + (oldCapacity >> 1);`, 'java', 'sm')}
${out(`capacities: 10 15 22 33 49 73 109 163 244 366 549
            823 1234 1851 2776 4164 ...
1000000 adds: final capacity 1215487,
  elements copied 2430972 = 2.43 per add`, 'font-size:13.5px;margin-top:6px')}
${o('Mô phỏng đúng quy tắc trên: mỗi lần đầy chép sang mảng mới ×1,5 ⇒ tổng số lần chép ≈ hằng số × n ⇒ <code>add</code> cuối là <b>O(1) khấu hao</b> (0.D). Biết trước n ⇒ <code>new ArrayList&lt;&gt;(n)</code>.', 'xanh')}`,
  `${out(`push 1,2,3: ArrayDeque [3, 2, 1]  LinkedList [3, 2, 1]
LinkedList.add(null) ok: [3, 2, 1, null]
ArrayDeque.add(null) -> NullPointerException
get(3): LinkedList 9 (walks the nodes)
        ArrayList 9 (index into array)`, 'font-size:13.5px')}
${bang([
    ['Làm ngăn xếp / hàng đợi', '<b>ArrayDeque</b>', 'mảng vòng, ít rác, nhanh hơn'],
    ['Stack (lớp cũ)', 'tránh', 'đồng bộ hoá (synchronized), kế thừa Vector'],
    ['Cần null trong hàng đợi', 'LinkedList', 'ArrayDeque từ chối null'],
    ['get(i) theo chỉ số', '<b>ArrayList</b>', 'LinkedList.get(i) là O(n)'],
  ], ['Nhu cầu', 'Chọn', 'Vì sao'], 'font-size:16.5px')}
${o('<b>Bẫy:</b> vòng <code>for (i…) list.get(i)</code> trên LinkedList là <b class="do">O(n²)</b>. Dùng for-each / iterator.', 'do2')}`, '1fr 1fr') },

  /* 15 */
  { t: 'PriorityQueue và TreeMap bên trong', body: hai(`${out(`add 5  array [5]
add 3  array [3, 5]
add 8  array [3, 5, 8]
add 1  array [1, 3, 8, 5]
add 9  array [1, 3, 8, 5, 9]
add 2  array [1, 3, 2, 5, 9, 8]
for-each: 1 3 2 5 9 8   (a[i] <= a[2i+1], a[2i+2])
poll until empty: 1 2 3 5 8 9
max-heap peek 9  array [9, 8, 5, 1, 3, 2]`, 'font-size:14px')}
${nho('add 1: đặt ở ô 3, <b>nổi lên</b> qua 5 và 3 tới gốc — đúng thao tác heap của Chương 4.')}`,
  `<ul style="font-size:20px">
<li>Con của ô i là 2i + 1 và 2i + 2; <code>offer/poll</code> O(log n), <code>peek</code> O(1)</li>
<li><code>toString</code> và for-each in <b>mảng heap</b> — <span class="do">không phải thứ tự đã sắp</span>; muốn có thứ tự phải <code>poll</code> lần lượt</li>
<li><code>remove(x)</code>, <code>contains</code>: O(n) — heap không tìm nhanh được</li>
<li>Max-heap: <code>new PriorityQueue&lt;&gt;(Collections.reverseOrder())</code></li>
</ul>
${out(`TreeMap (red-black tree) iterates sorted:
  [1, 2, 3, 5, 8, 9]  first 1 last 9`, 'font-size:14px')}
${o('<b>TreeMap/TreeSet</b> = cây đỏ-đen (A.1): duyệt theo thứ tự khoá, floor/ceiling O(log n) (⭐ CS.7). Cần "min <b>và</b> xoá bất kỳ" ⇒ TreeMap đếm số lần, không phải PriorityQueue.', 'xanh')}`, '1fr 1fr') },

  /* 16 */
  { t: 'Bảng độ phức tạp Java Collections', body: `${bang([
    ['<b>ArrayList</b>', 'O(1)', 'O(1) khấu hao', 'O(n)', 'O(n)', 'mảng động ×1,5'],
    ['<b>LinkedList</b>', 'O(n)', 'O(1)', 'O(1) ở đầu/cuối, O(n) tìm vị trí', 'O(n)', 'DS liên kết đôi'],
    ['<b>ArrayDeque</b>', '—', 'O(1) khấu hao hai đầu', 'O(1) hai đầu', 'O(n)', 'mảng vòng, cấm null'],
    ['<b>HashMap / HashSet</b>', '—', 'O(1) trung bình', 'O(1) trung bình', 'O(1) trung bình', 'bucket; xấu nhất O(log n)* / O(n)'],
    ['<b>LinkedHashMap</b>', '—', 'O(1) trung bình', 'O(1) trung bình', 'O(1) trung bình', '+ thứ tự chèn / truy cập'],
    ['<b>TreeMap / TreeSet</b>', '—', 'O(log n)', 'O(log n)', 'O(log n)', 'đỏ-đen; floor, ceiling, first'],
    ['<b>PriorityQueue</b>', 'peek O(1)', 'O(log n)', 'poll O(log n), remove(x) O(n)', 'O(n)', 'heap trên mảng; dựng từ tập O(n)'],
  ], ['Cấu trúc', 'get(i) / đỉnh', 'Thêm', 'Xoá', 'Tìm (contains)', 'Bên trong'], 'font-size:16px;line-height:1.25')}
${hai(nho('* O(log n) khi bucket đã thành cây và khoá Comparable; khoá không Comparable dồn một bucket ⇒ O(n) (slide 13). Arrays.sort đối tượng / Collections.sort: TimSort O(n log n), <b>ổn định</b>.'),
    o('Phỏng vấn hỏi "độ phức tạp code của bạn" ⇒ phải cộng cả chi phí <b>thao tác thư viện</b>: <code>list.remove(0)</code> trên ArrayList là O(n), <code>contains</code> trên List là O(n).', 'do2'), '1fr 1fr')}` },

  /* 17 */
  { t: 'Comparator và bẫy tràn số khi so bằng phép trừ', body: hai(`${code(`// SAI: có thể tràn
Arrays.sort(b, (x, y) -> x - y);
// ĐÚNG
Arrays.sort(c, (x, y) -> Integer.compare(x, y));
// nhiều khoá
words.sort(Comparator.comparingInt(String::length)
    .thenComparing(Comparator.reverseOrder()));`, 'java', 'sm')}
${out(`x - y           : [-1, 3, 5, 2147483647, -2147483648]
Integer.compare : [-2147483648, -1, 3, 5, 2147483647]
MIN - 3 = 2147483645  (should be negative)
by length, then Z..A: [fig, pear, kiwi, date, apple, banana]
127 == 127: true   128 == 128: false   128 equals 128: true`, 'font-size:13.5px;margin-top:6px')}
${nho('Chương trình dùng lớp ẩn danh (Java 8 vẫn viết được lambda như trên); mảng vào {3, MIN, 5, MAX, −1}.')}`,
  `${o('<code>x − y</code> tràn: MIN − 3 ra <b class="do">số dương</b> ⇒ MIN bị coi là lớn nhất, xếp <b>cuối</b>. Dùng <code>Integer.compare</code>.', 'do2')}
<ul style="font-size:18px">
<li><b>Hợp đồng:</b> dấu compare(a,b) = −dấu compare(b,a), bắc cầu; vi phạm ⇒ sắp sai lặng lẽ hoặc TimSort ném lỗi "violates its general contract"</li>
<li><b>double:</b> <code>Double.compare</code>, không <code>(int)(a − b)</code> (0,4 − 0,1 ⇒ 0)</li>
<li><b>TreeMap</b> coi compare = 0 là <b>cùng khoá</b> ⇒ ghi đè</li>
</ul>
${o('<b>Bẫy Integer:</b> <code>==</code> so <b>tham chiếu</b>; chỉ −128..127 được cache ⇒ 128 == 128 <b class="do">false</b>. Dùng <code>equals</code>.', 'do2')}`, '1.05fr 0.95fr') },

  /* 18 */
  { t: '14 mẫu phỏng vấn (1/2): mảng, chuỗi, tìm kiếm, đồ thị', body: `${bang([
    ['1', '<b>Hai con trỏ</b>', 'mảng <b>đã sắp</b>, tìm cặp/bộ ba có tổng, đảo ngược, palindrome, gộp hai dãy', '⭐ CS.2'],
    ['2', '<b>Cửa sổ trượt</b>', 'đoạn / chuỗi con <b>liên tiếp</b> dài nhất / ngắn nhất thoả điều kiện, "tối đa k khác nhau"', '⭐ CS.2'],
    ['3', '<b>Tổng tiền tố</b>', 'tổng đoạn hỏi nhiều lần; "số đoạn con có tổng = k" (+ HashMap); có số âm', '⭐ CS.2'],
    ['4', '<b>Tìm nhị phân trên đáp án</b>', '"nhỏ nhất / lớn nhất sao cho <b>làm được</b>", kiểm khả thi đơn điệu, đáp án tới 10⁹', '⭐ CS.1'],
    ['5', '<b>BFS / DFS</b>', 'lưới, số thành phần, <b>đường ngắn nhất không trọng số</b> (BFS), loang', 'Ch.5 · ⭐ CS.8'],
    ['6', '<b>Sắp xếp tô-pô</b>', '"phụ thuộc", "điều kiện tiên quyết", thứ tự hợp lệ, phát hiện chu trình có hướng', '⭐ CS.8'],
    ['7', '<b>Union-Find</b>', 'gộp nhóm dần, "có cùng nhóm không", cạnh thừa tạo chu trình, Kruskal', 'A.2'],
  ], ['#', 'Mẫu', 'Dấu hiệu trong đề', 'Đã học ở'], 'font-size:17.5px;line-height:1.3')}
${nho('Mẫu 8–14 ở slide sau. Mỗi mẫu có ít nhất một bài trong bộ đề luyện (bài tập ⭐ CS.10).')}` },

  /* 19 */
  { t: '14 mẫu phỏng vấn (2/2): heap, quay lui, DP, trie, bit', body: `${bang([
    ['8', '<b>Heap / top-k</b>', '"k lớn nhất / nhỏ nhất / gần nhất", trộn k danh sách, trung vị luồng, lịch phòng họp', '⭐ CS.5 · Ch.4'],
    ['9', '<b>Ngăn xếp đơn điệu</b>', '"phần tử lớn hơn kế tiếp", "bao nhiêu ngày nữa", hình chữ nhật lớn nhất', '⭐ CS.2'],
    ['10', '<b>Quay lui</b>', '"liệt kê <b>mọi</b>", tập con / hoán vị / tổ hợp, n ≤ 20, tìm từ trên lưới', '⭐ CS.6'],
    ['11', '<b>Quy hoạch động 1D / 2D</b>', '"số cách", "min / max" có lựa chọn chồng lấn, hai chuỗi, lưới, trạng thái mua/bán', '⭐ CS.3 · CS.4'],
    ['12', '<b>Tham lam</b>', 'xếp lịch khoảng, gộp khoảng, chọn cục bộ tốt nhất + chứng minh đổi chỗ', '⭐ CS.5'],
    ['13', '<b>Trie</b>', '"bắt đầu bằng", gợi ý, gốc từ ngắn nhất, nhiều chuỗi chung tiền tố', '⭐ CS.7'],
    ['14', '<b>Thao tác bit</b>', '"xuất hiện một lần", XOR, cộng không dùng +, tập con bằng bitmask (n ≤ 20)', '⭐ CS.9'],
  ], ['#', 'Mẫu', 'Dấu hiệu trong đề', 'Đã học ở'], 'font-size:17.5px;line-height:1.3')}
${hai(o('Ngoài 14 mẫu: <b>HashMap đếm / tra "đã thấy chưa"</b> (Two Sum) và <b>con trỏ nhanh-chậm</b> trên danh sách liên kết — gặp liên tục.', 'xanh'), o('Một đề có thể cần <b>hai</b> mẫu: gộp khoảng = sắp xếp + tham lam; phòng họp = tham lam + heap.', ''), '1fr 1fr')}` },

  /* 20 */
  { t: 'Đọc đề → nghĩ tới gì: ràng buộc n và từ khoá', body: hai(`${bang([
    ['n ≤ 10–12', 'O(n!)', 'hoán vị, quay lui'],
    ['n ≤ 20–25', 'O(2ⁿ · n)', 'tập con, bitmask'],
    ['n ≤ 500', 'O(n³)', 'Floyd, DP ba chiều'],
    ['n ≤ 5 000', 'O(n²)', 'DP hai chiều, hai vòng'],
    ['n ≤ 10⁶', 'O(n log n) / O(n)', 'sắp xếp, heap, hai con trỏ, tiền tố'],
    ['n tới 10⁹, 10¹⁸', 'O(log n) / O(1)', 'tìm nhị phân, toán'],
  ], ['Ràng buộc', 'Được phép', 'Thường là'], 'font-size:17.5px')}
${nho('Quy tắc ước lượng: khoảng 10⁸ phép tính đơn giản mỗi giây — chỉ để đoán hướng, không phải số đo.')}`,
  `${bang([
    ['đã sắp / "tìm cặp"', 'hai con trỏ · tìm nhị phân'],
    ['"liên tiếp" + dài/ngắn nhất', 'cửa sổ trượt'],
    ['"nhỏ nhất sao cho …"', 'tìm nhị phân trên đáp án'],
    ['"ngắn nhất", không trọng số', 'BFS'],
    ['"k lớn nhất"', 'heap cỡ k'],
    ['"mọi cách / liệt kê"', 'quay lui'],
    ['"bao nhiêu cách / tối ưu"', 'DP'],
    ['"kế tiếp lớn hơn"', 'ngăn xếp đơn điệu'],
    ['"thiết kế … O(1)"', 'ghép HashMap + cấu trúc thứ tự'],
  ], ['Chữ trong đề', 'Nghĩ tới'], 'font-size:17px')}`, '1fr 1fr') },

  /* 21 */
  { t: 'Cách trình bày khi phỏng vấn: 7 bước', body: `${buocSvg()}
${hai(`<ul style="font-size:19.5px">
<li><b>1.</b> Nhắc lại đề bằng lời mình; hỏi: n lớn cỡ nào, có số âm / trùng / rỗng, trả chỉ số hay giá trị, nhiều đáp án thì sao</li>
<li><b>2.</b> Nói cách vét cạn <b>trước</b> + độ phức tạp — chứng tỏ hiểu đề, có sẵn "đáp án mẫu" để so</li>
<li><b>3.</b> Chỉ ra chỗ lặp lại / chỗ phí ⇒ mẫu nào (slide 18–20); nói độ phức tạp mới <b>trước khi</b> viết</li>
</ul>`, `<ul style="font-size:19.5px">
<li><b>4.</b> Code sạch: tên biến có nghĩa, hàm nhỏ, không tối ưu vặt</li>
<li><b>5.</b> Tự chạy tay một ví dụ nhỏ, đọc to giá trị biến — bắt lỗi trước người phỏng vấn</li>
<li><b>6.</b> Ca biên: rỗng, 1 phần tử, trùng, âm, tràn int</li>
<li><b>7.</b> Thời gian + bộ nhớ, <b>và vì sao</b>; nêu hướng tốt hơn nếu có</li>
</ul>`, '1fr 1fr')}
${o('Người phỏng vấn chấm <b>cách nghĩ và giao tiếp</b> nhiều ngang code chạy được: im lặng 10 phút rồi nộp code đúng vẫn có thể trượt.', 'xanh')}` },

  /* 22 */
  { t: 'Ví dụ trọn 7 bước: Two Sum', body: hai(`<ul style="font-size:18.5px">
<li><b>Hỏi:</b> trả chỉ số; có đúng một đáp án? không dùng một phần tử hai lần; có số âm, số trùng</li>
<li><b>Vét cạn:</b> thử mọi cặp i &lt; j — O(n²) thời gian, O(1) bộ nhớ</li>
<li><b>Tối ưu:</b> với a[j] cần biết "đã thấy <code>target − a[j]</code> chưa?" ⇒ HashMap — O(n), O(n)</li>
</ul>
${code(`for (int j = 0; j < a.length; j++) {
    long need = (long) target - a[j];   // long
    Integer i = seen.get(need);
    if (i != null) return new int[]{i, j};
    seen.put((long) a[j], j);  // SAU khi tra
}
return new int[0];`, 'java', 'sm')}`,
  `${out(`a=[2, 7, 11, 15, -3], target 8:
  j=0 a[j]=2 need 6 seen {}
  j=1 a[j]=7 need 1 seen {2=0}
  j=2 a[j]=11 need -3 seen {2=0, 7=1}
  j=3 a[j]=15 need -7 seen {2=0, 7=1, 11=2}
  j=4 a[j]=-3 need 11 seen {2=0, 7=1, 11=2, 15=3} -> found i=2
-> [2, 4]
edges: [3,3] t=6 [0, 1]  [3] t=6 []  [] []  [MAX,1] t=MIN []
PASS 20000 random arrays (duplicates, negatives, empty)
     vs brute force`, 'font-size:12.5px')}
${o('Bước 5–6 ngay trên màn hình: [3,3] cần <code>put</code> <b>sau</b> tra; [MAX, 1] với target MIN: tính bằng int thì MAX + 1 <b class="do">tràn thành MIN</b> ⇒ báo có cặp sai.', 'do2')}`, '1fr 1fr') },

  /* 23 */
  { t: 'Lỗi hay gặp và cách nói khi bí', body: hai(`${bang([
    ['Lao vào code ngay', 'hỏi lại đề, nói vét cạn trước'],
    ['Im lặng khi nghĩ', 'nghĩ <b>thành tiếng</b>'],
    ['Quên ca biên', 'rỗng, 1 phần tử, trùng, âm, tràn'],
    ['Lệch một (off-by-one)', 'chạy tay vòng đầu và vòng cuối'],
    ['Tràn int', '<code>long</code>, <code>lo + (hi − lo) / 2</code>'],
    ['Sửa tập khi đang duyệt', 'ConcurrentModificationException ⇒ dùng iterator.remove'],
    ['So Integer bằng ==', '<code>equals</code> hoặc mở hộp'],
    ['Nói sai độ phức tạp', 'đếm cả thao tác thư viện'],
  ], ['Lỗi', 'Thay bằng'], 'font-size:17px')}`,
  `<p style="font-size:20px;margin:0"><b>Khi bí</b> — nói ra thay vì im lặng:</p>
${o('"Em sẽ làm bản vét cạn O(n²) trước cho đúng, rồi tìm chỗ lặp lại để tối ưu."', 'xanh')}
${o('"Nếu mảng đã sắp thì em dùng được hai con trỏ — mình có được giả sử vậy không ạ?"', 'xanh')}
${o('"Em đang kẹt ở bước tìm phần tử cũ nhất trong O(1). Anh/chị gợi ý giúp em cấu trúc nào hợp được không?"', 'xanh')}
<ul style="font-size:19px">
<li>Thử <b>ví dụ nhỏ bằng tay</b>, vẽ ra — mẫu thường lộ ra từ đó</li>
<li>Đi qua bảng 14 mẫu: "sắp xếp trước có giúp không? HashMap? heap?"</li>
<li>Nhận gợi ý là bình thường — <b>dùng được gợi ý</b> cũng là điểm cộng</li>
</ul>`, '1fr 1fr') },

  /* 24 */
  { t: 'Bộ đề luyện 22 bài và lộ trình 4 tuần', body: hai(`${bang([
    ['Hash · ngăn xếp · 2 con trỏ', '4Sum II, Valid Parentheses, 3Sum'],
    ['Cửa sổ · tiền tố · tìm nhị phân', 'Min Window, Product Except Self, Smallest Divisor'],
    ['Đồ thị', 'Islands, Shortest Binary Path, Alien Dictionary, Redundant Connection'],
    ['Heap · ngăn xếp đơn điệu', 'Top K Frequent, Merge k Lists, Daily Temperatures'],
    ['Quay lui · DP', 'Word Search, Stock Cooldown, Maximal Square'],
    ['Tham lam · trie · bit', 'Merge Intervals, Meeting Rooms II, Replace Words, Sum without +'],
    ['DS liên kết · thiết kế', 'Cycle Start (Floyd), Time-based Key-Value Store'],
  ], ['Nhóm', 'Bài (ý bài LeetCode)'], 'font-size:16px;line-height:1.25')}`,
  `${bang([
    ['1', 'mảng, chuỗi, hash, 2 con trỏ, cửa sổ, tiền tố, tìm nhị phân', 'bài 1–6 + ôn CS.1–2'],
    ['2', 'đồ thị, heap, ngăn xếp đơn điệu', 'bài 7–13 + ôn CS.5, 8'],
    ['3', 'quay lui, DP, tham lam, trie, bit', 'bài 14–20 + ôn CS.3–7, 9'],
    ['4', 'thiết kế + thi thử', 'bài 21–22, LRU/LFU tự cài; 2 buổi giả phỏng vấn 45 phút'],
  ], ['Tuần', 'Chủ đề', 'Việc'], 'font-size:16.5px')}
${o('Mỗi bài: 25 phút tự làm theo 7 bước → so lời giải → ghi <b>dấu hiệu nhận dạng</b> vào sổ → làm lại sau 3 ngày.', 'xanh')}
${nho('Mọi lời giải trong bài tập ⭐ CS.10 chạy thật, tự kiểm PASS/FAIL so với vét cạn trên hàng nghìn ca.')}`, '1fr 1fr') },

  /* 25 */
  { t: 'Tóm tắt', body: `<ul style="font-size:21.5px">
<li>Thiết kế CTDL = <b>ghép hai cấu trúc</b>: LRU = HashMap + DS liên kết đôi; LFU thêm nhóm theo tần suất + minFreq</li>
<li>Min-stack lưu min từng tầng; hàng đợi hai ngăn xếp <b>O(1) khấu hao</b> vì mỗi phần tử đổ một lần</li>
<li>RandomizedSet: <b>đổi với phần tử cuối</b> rồi xoá cuối; trung vị: <b>hai heap</b> cân nhau; rate limiter: deque cửa sổ trượt</li>
<li>HashMap: 16 bucket, 0,75, <b>×2</b> ở phần tử thứ 13; bucket ≥ 8 và bảng ≥ 64 ⇒ cây đỏ-đen (khoá nên Comparable)</li>
<li>ArrayList ×1,5; ArrayDeque cho stack/queue; PriorityQueue in ra <b>mảng heap</b>, không sắp; TreeMap O(log n)</li>
<li>Comparator: <span class="do">đừng trừ</span> — dùng Integer.compare; Integer so bằng equals</li>
<li>14 mẫu: đọc <b>dấu hiệu</b> + ràng buộc n ⇒ mẫu ⇒ deck đã học</li>
<li>Phỏng vấn: hỏi lại → vét cạn → tối ưu → code → chạy tay → ca biên → độ phức tạp, <b>nói thành tiếng</b></li>
</ul>` },
]);

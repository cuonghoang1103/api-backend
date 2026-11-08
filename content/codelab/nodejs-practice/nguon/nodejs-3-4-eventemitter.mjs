/** Node.js 3.4 — EventEmitter: emit đồng bộ, once/off cần đúng tham chiếu, sự kiện 'error' đặc biệt, cảnh báo 11 listener. */
import { doiDau, KHOA, cs, q, tn, nodeBai, nguon, FAKE_EMITTER } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '3.4 · EventEmitter: predict the output', kho: 'EASY', phut: 7,
  en: 'Questions on the lesson’s NoteStore program and the four rules of an emitter. Each output was produced by running it with Node 22.',
  vi: 'Các câu về chương trình NoteStore của bài và bốn luật của emitter. Mọi output đều có được bằng cách chạy với Node 22.',
  cau: [
    q('c1', ['The lesson registers <code>on(\'saved\', log)</code>, <code>on(\'saved\', email)</code>, <code>once(\'saved\', …)</code>, then calls <code>save(\'note-1\')</code> and <code>save(\'note-2\')</code>. What is <code>listenerCount(\'saved\')</code> at the end?', 'Bài đăng ký <code>on(\'saved\', log)</code>, <code>on(\'saved\', email)</code>, <code>once(\'saved\', …)</code>, rồi gọi <code>save(\'note-1\')</code> và <code>save(\'note-2\')</code>. Cuối cùng <code>listenerCount(\'saved\')</code> là bao nhiêu?'],
      ['2 — the once listener removed itself after the first emit', '3 — once only stops the listener from running again', '0 — listeners are cleared after every emit', '1 — each emit removes the oldest listener'],
      ['once wraps your function and removes the wrapper the first time it fires: 3 → 2. The log shows “[once] only the first time” exactly once.', 'once bọc hàm của bạn và gỡ cái vỏ ngay lần đầu nó chạy: 3 → 2. Log cho thấy “[once] only the first time” đúng một lần.']),
    q('c2', ['<code>console.log(\'before\'); e.on(\'x\', () =&gt; console.log(\'listener\')); e.emit(\'x\'); console.log(\'after\');</code> prints…', '<code>console.log(\'before\'); e.on(\'x\', () =&gt; console.log(\'listener\')); e.emit(\'x\'); console.log(\'after\');</code> in ra…'],
      ['before, listener, after — emit is synchronous', 'before, after, listener — emit queues the listener for the next tick', 'listener, before, after — listeners run when they are registered', 'before, after — emit needs an await to run listeners'],
      ['emit() does not return until every listener has finished. A slow listener blocks the emitter — and the event loop. It is not a queue.', 'emit() không trả về cho tới khi mọi listener chạy xong. Listener chậm chặn emitter — và cả event loop. Nó không phải hàng đợi.']),
    q('c3', ['The first of two listeners throws. What happens when you call <code>emit()</code>?', 'Listener đầu trong hai listener ném lỗi. Gọi <code>emit()</code> thì sao?'],
      ['The error propagates out of emit() to its caller; the second listener does not run', 'Node catches it, logs it, and still runs the second listener', 'The error is turned into an "error" event on the same emitter', 'emit() returns false and the error is swallowed'],
      ['Listeners run inside emit(), so a throw unwinds through emit() into whoever called it — maybe a totally unrelated route that just saved a note.', 'Listener chạy bên trong emit(), nên một throw cuộn ngược qua emit() tới ai đã gọi nó — có khi là một route chẳng liên quan vừa lưu ghi chú.']),
    q('c4', ['<code>new EventEmitter().emit(\'error\', new Error(\'boom\'))</code> with no "error" listener…', '<code>new EventEmitter().emit(\'error\', new Error(\'boom\'))</code> khi không có listener "error"…'],
      ['throws that Error — unhandled, the process dies', 'returns false, like any event nobody listens to', 'prints a warning and continues', 'is queued until someone adds an "error" listener'],
      ['"error" is the one special name. This is why an unhandled stream or socket error can kill your server: streams are emitters.', '"error" là cái tên đặc biệt duy nhất. Đó là lý do lỗi stream hay socket không ai xử lý có thể giết server: stream là emitter.']),
    q('c5', ['You see <code>MaxListenersExceededWarning … 11 saved listeners added to [NoteStore]</code>. The right fix is usually…', 'Bạn thấy <code>MaxListenersExceededWarning … 11 saved listeners added to [NoteStore]</code>. Cách sửa đúng thường là…'],
      ['Find where listeners are added without being removed, and use off() or once()', 'Call setMaxListeners(100) so the warning goes away', 'Switch to process.nextTick so the listeners run later', 'Create a new NoteStore for every request'],
      ['Eleven is Node guessing you forgot an off — usually inside a request handler, so every request adds one more and memory grows forever. Raising the limit hides the leak.', 'Mười một là Node đoán bạn quên off — thường trong request handler, nên mỗi request thêm một cái và bộ nhớ tăng mãi. Nâng giới hạn chỉ giấu vụ rò.']),
  ],
  goiY: [['Remember the lesson’s “three things worth noticing”.', 'Nhớ “ba điều đáng để ý” của bài.'], ['emit is just a for-loop over the listeners, called right now.', 'emit chỉ là một vòng for qua các listener, gọi ngay lúc đó.']],
  loi: [['Assuming emit() is asynchronous like a message queue.', 'Tưởng emit() bất đồng bộ như hàng đợi tin nhắn.'], ['Silencing the max-listeners warning instead of finding the leak.', 'Tắt cảnh báo max-listeners thay vì tìm chỗ rò.']],
  tns: [tn('listener', 'hàm lắng nghe'), tn('publish–subscribe', 'phát – đăng ký', 'one side emits, any number of others react'), tn('memory leak', 'rò bộ nhớ')],
  kn: ['events'],
});

/* ─── 2. watch/stop không rò ─── */
function watchNotes(store, onSaved) {
  // keep ONE reference: the function you add is the function you remove later
  const listener = (note) => onSaved(note);
  store.on('saved', listener);
  return function stop() {
    store.off('saved', listener);
  };
}
const E2 = nodeBai({
  ten: '3.4 · Subscribe and unsubscribe without leaking', kho: 'EASY', phut: 10,
  en: `<p>The lesson: <i>removal needs the SAME function reference — an inline arrow cannot be removed</i>. A request handler subscribes to the store’s <code>'saved'</code> event while it works and must clean up afterwards. Write <code>watchNotes(store, onSaved)</code>:</p><ul><li>subscribe to <code>'saved'</code> so every saved note is passed to <code>onSaved(note)</code>;</li><li>return a <code>stop()</code> function that removes <b>exactly that</b> listener (other listeners stay; calling <code>stop()</code> twice is harmless).</li></ul><p>A hidden test runs 20 “requests” (watch, then stop) and checks that <code>store.listenerCount('saved')</code> is back to where it started.</p>`,
  vi: `<p>Bài học: <i>gỡ listener cần ĐÚNG tham chiếu hàm đó — một arrow viết tại chỗ không gỡ được</i>. Một request handler đăng ký sự kiện <code>'saved'</code> của store trong lúc làm việc và phải dọn dẹp sau đó. Viết <code>watchNotes(store, onSaved)</code>:</p><ul><li>đăng ký <code>'saved'</code> sao cho mọi ghi chú được lưu đều được đưa vào <code>onSaved(note)</code>;</li><li>trả về hàm <code>stop()</code> gỡ <b>đúng</b> listener đó (listener khác giữ nguyên; gọi <code>stop()</code> hai lần không sao).</li></ul><p>Một kiểm ẩn chạy 20 “request” (watch rồi stop) và kiểm <code>store.listenerCount('saved')</code> trở về như lúc đầu.</p>`,
  dauVao: ['store — an emitter with on/off/emit/listenerCount; onSaved — a function', 'store — emitter có on/off/emit/listenerCount; onSaved — một hàm'], dauRa: ['stop — a function', 'stop — một hàm'],
  goiY: [['Store the listener in a const before passing it to on().', 'Cất listener vào một const trước khi đưa cho on().'], ['stop() is a closure: it still sees that const after watchNotes returned.', 'stop() là một closure: nó vẫn thấy const đó sau khi watchNotes đã trả về.']],
  loi: [['store.off("saved", (n) => onSaved(n)) — a brand-new arrow, so nothing is removed and every request leaks one listener.', 'store.off("saved", (n) => onSaved(n)) — một arrow mới tinh, nên không gỡ được gì và mỗi request rò một listener.'], ['store.removeAllListeners("saved") — also removes the listeners of everybody else.', 'store.removeAllListeners("saved") — gỡ luôn listener của mọi người khác.']],
  gt: ['off() compares functions by identity (===). Two arrows with identical source are still two different objects. The pattern “subscribe returns its own unsubscribe” is the one React effects, RxJS and Socket.IO handlers all use for exactly this reason.', 'off() so hàm theo danh tính (===). Hai arrow có mã giống hệt vẫn là hai đối tượng khác nhau. Mẫu “đăng ký trả về hàm huỷ của chính nó” là thứ React effect, RxJS và handler Socket.IO đều dùng vì đúng lý do này.'],
  kn: ['events', 'closures'], tns: [tn('reference', 'tham chiếu'), tn('unsubscribe', 'huỷ đăng ký')],
  chung: FAKE_EMITTER,
  dau: `/** subscribe onSaved to store's 'saved' event; return a stop() that removes it */
function watchNotes(store, onSaved) {
  // Write your solution here — this stop() can never remove anything
  store.on('saved', (note) => onSaved(note));
  return function stop() {
    store.off('saved', (note) => onSaved(note));
  };
}
`,
  giai: '// Reference solution — one reference for on() and off()\n' + nguon(watchNotes),
  cases: [
    { chuanBi: 'const store = __em({}); const got = []; const stop = watchNotes(store, (n) => got.push(n.name)); store.emit("saved", { name: "note-1" }); stop(); store.emit("saved", { name: "note-2" });', goi: '({ got, listeners: store.listenerCount("saved") })', moTa: ['Receives before stop, nothing after', 'Nhận trước khi stop, không nhận gì sau đó'] },
    { chuanBi: 'const store = __em({}); const logs = []; store.on("saved", (n) => logs.push("log " + n.name)); const stop = watchNotes(store, (n) => logs.push("watch " + n.name)); stop(); store.emit("saved", { name: "a" });', goi: '({ logs, listeners: store.listenerCount("saved") })', moTa: ['stop() keeps the other listeners', 'stop() giữ listener khác'] },
    { chuanBi: 'const store = __em({}); for (let i = 0; i < 20; i++) { const stop = watchNotes(store, () => {}); store.emit("saved", { name: "n" + i }); stop(); }', goi: 'store.listenerCount("saved")', moTa: ['20 requests leave 0 listeners', '20 request không để lại listener nào'], an: true },
    { chuanBi: 'const store = __em({}); const got = []; const s1 = watchNotes(store, (n) => got.push(1)); const s2 = watchNotes(store, (n) => got.push(2)); s1(); s1(); store.emit("saved", {});', goi: '({ got, listeners: store.listenerCount("saved") })', an: true },
  ],
});

/* ─── 3. MiniEmitter: on / emit ─── */
class MiniEmitter {
  constructor() {
    this.listeners = {};          // event name → array of functions, in registration order
  }
  on(name, fn) {
    (this.listeners[name] = this.listeners[name] || []).push(fn);
    return this;                  // allows store.on(…).on(…)
  }
  emit(name, ...args) {
    const list = this.listeners[name] || [];
    // synchronous: each listener runs NOW, in order, before emit returns
    for (const fn of list.slice()) fn.apply(this, args);
    return list.length > 0;       // true if at least one listener was called
  }
  listenerCount(name) {
    return (this.listeners[name] || []).length;
  }
}
const E3 = nodeBai({
  ten: '3.4 · Build a MiniEmitter: on, emit, listenerCount', kho: 'MEDIUM', phut: 15,
  en: `<p>“It is the publish–subscribe pattern in its simplest possible form.” Prove it: write a <code>class MiniEmitter</code> with</p>
<ul><li><code>on(name, fn)</code> — add a listener; returns <code>this</code> so calls can be chained;</li><li><code>emit(name, ...args)</code> — call every listener of <code>name</code> <b>synchronously, in registration order</b>, with the same arguments and with <code>this</code> = the emitter; return <code>true</code> if at least one listener was called, else <code>false</code>;</li><li><code>listenerCount(name)</code>.</li></ul><p>The tests subclass it like the lesson: <code>class NoteStore extends MiniEmitter { save(name) { this.emit('saved', { name }); } }</code>.</p>`,
  vi: `<p>“Đó là mẫu publish–subscribe ở dạng đơn giản nhất.” Hãy chứng minh: viết <code>class MiniEmitter</code> có</p>
<ul><li><code>on(name, fn)</code> — thêm listener; trả về <code>this</code> để gọi nối tiếp được;</li><li><code>emit(name, ...args)</code> — gọi mọi listener của <code>name</code> <b>đồng bộ, theo thứ tự đăng ký</b>, với cùng các đối số và <code>this</code> = emitter; trả <code>true</code> nếu có ít nhất một listener được gọi, ngược lại <code>false</code>;</li><li><code>listenerCount(name)</code>.</li></ul><p>Các kiểm kế thừa nó như bài: <code>class NoteStore extends MiniEmitter { save(name) { this.emit('saved', { name }); } }</code>.</p>`,
  dauVao: ['event names (strings) and listener functions', 'tên sự kiện (chuỗi) và hàm listener'], dauRa: ['emit → boolean; on → the emitter', 'emit → boolean; on → chính emitter'],
  yc: [['Listeners of different event names are independent.', 'Listener của các tên sự kiện khác nhau độc lập với nhau.'], ['Do not use setTimeout/Promise in emit — it is synchronous.', 'Không dùng setTimeout/Promise trong emit — nó đồng bộ.']],
  goiY: [['One object (or Map) from event name to an array of functions.', 'Một object (hoặc Map) từ tên sự kiện tới mảng hàm.'], ['fn.apply(this, args) passes the arguments and sets this.', 'fn.apply(this, args) truyền đối số và đặt this.'], ['Loop over a copy (slice()) so a listener that adds another does not change this emit.', 'Lặp trên một bản sao (slice()) để listener thêm listener khác không đổi lần emit này.']],
  loi: [['Running listeners with setTimeout “to be safe”: the lesson’s output order (before, listener, after) breaks.', 'Chạy listener bằng setTimeout “cho chắc”: thứ tự output của bài (before, listener, after) hỏng.'], ['Returning nothing from on(), so store.on(a).on(b) throws.', 'on() không trả gì, nên store.on(a).on(b) ném lỗi.'], ['emit returning true even when nobody listens.', 'emit trả true kể cả khi không ai nghe.']],
  gt: ['The core of node:events really is this small: a map of arrays and a loop. The expected outputs are the lesson’s, produced with the real EventEmitter (listeners in order, emit returns false for an unknown name).', 'Lõi của node:events thật sự nhỏ như vậy: một bảng các mảng và một vòng lặp. Output mong đợi là của bài, tạo bằng EventEmitter thật (listener theo thứ tự, emit trả false với tên không ai nghe).'],
  kn: ['events', 'classes'], tns: [tn('chaining', 'gọi nối tiếp'), tn('synchronous', 'đồng bộ')],
  chung: 'class NoteStore extends MiniEmitter { save(name) { this.emit("saved", { name }); } }',
  dau: `/** the publish–subscribe pattern in its simplest form */
class MiniEmitter {
  constructor() {
    this.listeners = {};
  }
  on(name, fn) {
    // Write your solution here
  }
  emit(name, ...args) {
    // Write your solution here
    return false;
  }
  listenerCount(name) {
    return 0;
  }
}
`,
  giai: '// Reference solution — a map of arrays and a synchronous loop\n' + nguon(MiniEmitter),
  cases: [
    { so: 'console', chuanBi: 'const store = new NoteStore(); store.on("saved", (n) => console.log("[log] saved:", n.name)); store.on("saved", (n) => console.log("[email] notify about:", n.name)); store.save("note-1"); console.log("listeners:", store.listenerCount("saved"));', goi: 'undefined', moTa: ['The lesson’s two listeners, in order', 'Hai listener của bài, đúng thứ tự'] },
    { so: 'console', chuanBi: 'const e = new MiniEmitter(); console.log("before"); e.on("x", () => console.log("listener")); e.emit("x"); console.log("after");', goi: 'undefined', moTa: ['emit is synchronous', 'emit đồng bộ'] },
    { goi: '(() => { const e = new MiniEmitter(); const a = e.emit("nobody"); e.on("x", () => {}); return [a, e.emit("x"), e.on("y", () => {}) === e]; })()', moTa: ['Return values of emit and on', 'Giá trị trả về của emit và on'] },
    { goi: '(() => { const e = new MiniEmitter(); const got = []; e.on("sum", function (a, b, c) { got.push(a + b + c, this === e); }); e.emit("sum", 1, 2, 3); return got; })()', an: true },
    { goi: '(() => { const e = new MiniEmitter(); const got = []; e.on("a", () => got.push("a")).on("b", () => got.push("b")); e.emit("b"); e.emit("a"); e.emit("b"); return [got, e.listenerCount("a"), e.listenerCount("zzz")]; })()', an: true },
    { goi: '(() => { const e = new MiniEmitter(); const got = []; e.on("z", () => { got.push("z1"); e.on("z", () => got.push("added")); }); e.emit("z"); got.push("---"); e.emit("z"); return got; })()', an: true },
  ],
});

/* ─── 4. once / off ─── */
class MiniEmitter2 {
  constructor() { this.listeners = {}; }
  on(name, fn) { (this.listeners[name] = this.listeners[name] || []).push(fn); return this; }
  off(name, fn) {
    const list = this.listeners[name] || [];
    // remove the LAST registration of fn (or of a once-wrapper around fn), like node:events
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] === fn || list[i].listener === fn) { list.splice(i, 1); break; }
    }
    return this;
  }
  once(name, fn) {
    const emitter = this;
    function wrapper(...args) {
      emitter.off(name, wrapper);        // remove first, so a throw in fn still leaves it removed
      return fn.apply(this, args);
    }
    wrapper.listener = fn;               // so off(name, fn) can find the wrapper
    return this.on(name, wrapper);
  }
  emit(name, ...args) {
    const list = this.listeners[name] || [];
    for (const fn of list.slice()) fn.apply(this, args);   // a snapshot: removals during emit do not skip anyone
    return list.length > 0;
  }
  listenerCount(name) { return (this.listeners[name] || []).length; }
}
const E4 = nodeBai({
  ten: '3.4 · Add once() and off() to the MiniEmitter', kho: 'MEDIUM', phut: 20,
  en: `<p>The starter is a working <code>MiniEmitter</code> (on, emit, listenerCount). Add:</p><ul><li><code>off(name, fn)</code> — remove one registration of <code>fn</code> (the most recent one if it was added twice); unknown functions are ignored; returns <code>this</code>;</li><li><code>once(name, fn)</code> — like on, but removed automatically the first time it fires; returns <code>this</code>. <code>off(name, fn)</code> with the <b>original</b> <code>fn</code> must also remove a pending once — Node does this by storing the original on the wrapper (<code>wrapper.listener = fn</code>).</li></ul><p>Node runs emit on a <b>snapshot</b> of the listener list: a listener removed during an emit is still called in that emit (checked on Node 22). Keep that behaviour.</p>`,
  vi: `<p>Code khởi đầu là một <code>MiniEmitter</code> chạy được (on, emit, listenerCount). Thêm:</p><ul><li><code>off(name, fn)</code> — gỡ một lần đăng ký của <code>fn</code> (lần gần nhất nếu nó được thêm hai lần); hàm lạ thì bỏ qua; trả về <code>this</code>;</li><li><code>once(name, fn)</code> — như on, nhưng tự gỡ ngay lần đầu chạy; trả về <code>this</code>. <code>off(name, fn)</code> với <code>fn</code> <b>gốc</b> cũng phải gỡ được một once chưa chạy — Node làm vậy bằng cách cất hàm gốc trên vỏ bọc (<code>wrapper.listener = fn</code>).</li></ul><p>Node chạy emit trên một <b>bản chụp</b> danh sách listener: listener bị gỡ giữa lúc emit vẫn được gọi trong lần emit đó (đã kiểm trên Node 22). Giữ hành vi đó.</p>`,
  dauVao: ['event names and listener functions', 'tên sự kiện và hàm listener'], dauRa: ['the emitter (for chaining)', 'chính emitter (để gọi nối tiếp)'],
  goiY: [['once = on(wrapper) where wrapper first removes itself, then calls fn.', 'once = on(wrapper) trong đó wrapper tự gỡ mình trước, rồi mới gọi fn.'], ['In off, a list entry matches if it IS fn or its .listener is fn.', 'Trong off, một phần tử khớp nếu nó LÀ fn hoặc .listener của nó là fn.'], ['Search from the end and splice once — that removes the most recent registration only.', 'Tìm từ cuối và splice một lần — chỉ gỡ lần đăng ký gần nhất.']],
  loi: [['filter() in off: removes every copy of fn, not one.', 'filter() trong off: gỡ mọi bản của fn, không phải một.'], ['once that calls fn and only then removes itself: if fn throws, the listener stays forever.', 'once gọi fn rồi mới tự gỡ: nếu fn ném lỗi, listener ở lại mãi.'], ['off(name, fn) cannot find a once listener because the list holds the wrapper.', 'off(name, fn) không tìm thấy listener once vì danh sách chứa vỏ bọc.']],
  gt: ['Each expected value comes from replaying the same calls on Node’s EventEmitter: off removes the most recent copy, off(original) removes a once, removal during emit does not skip a listener. This is the machinery behind the lesson’s count dropping from 3 to 2.', 'Mỗi giá trị mong đợi có được bằng cách chạy lại cùng các lời gọi trên EventEmitter của Node: off gỡ bản gần nhất, off(gốc) gỡ được once, gỡ giữa lúc emit không bỏ sót listener. Đây là cơ chế đằng sau con số giảm từ 3 xuống 2 trong bài.'],
  kn: ['events'], tns: [tn('wrapper', 'hàm bọc'), tn('snapshot', 'bản chụp')],
  dau: `/** on/emit work — add once() and off() */
class MiniEmitter {
  constructor() { this.listeners = {}; }
  on(name, fn) { (this.listeners[name] = this.listeners[name] || []).push(fn); return this; }
  off(name, fn) {
    // Write your solution here
    return this;
  }
  once(name, fn) {
    // Write your solution here
    return this.on(name, fn);
  }
  emit(name, ...args) {
    const list = this.listeners[name] || [];
    for (const fn of list.slice()) fn.apply(this, args);
    return list.length > 0;
  }
  listenerCount(name) { return (this.listeners[name] || []).length; }
}
`,
  giai: '// Reference solution — once is a self-removing wrapper that remembers the original\n' + nguon(MiniEmitter2).replace('class MiniEmitter2', 'class MiniEmitter'),
  cases: [
    { goi: '(() => { const e = new MiniEmitter(); const got = []; e.on("saved", () => got.push("log")); e.once("saved", () => got.push("once")); e.emit("saved"); e.emit("saved"); return [got, e.listenerCount("saved")]; })()', moTa: ['once fires once: count 2 → 1', 'once chạy một lần: đếm 2 → 1'] },
    { goi: '(() => { const e = new MiniEmitter(); const got = []; const f = () => got.push("f"); e.on("x", f); e.off("x", f); e.emit("x"); return [got, e.listenerCount("x")]; })()', moTa: ['off with the same reference', 'off với cùng tham chiếu'] },
    { goi: '(() => { const e = new MiniEmitter(); const f = () => {}; e.once("x", f); e.off("x", f); return [e.listenerCount("x"), e.emit("x")]; })()', moTa: ['off(original) removes a pending once', 'off(gốc) gỡ được once chưa chạy'] },
    { goi: '(() => { const e = new MiniEmitter(); const got = []; const f = (v) => got.push(v); e.on("x", f); e.on("x", () => got.push("mid")); e.on("x", f); e.off("x", f); e.emit("x", 1); return got; })()', an: true },
    { goi: '(() => { const e = new MiniEmitter(); const got = []; const b = () => got.push("b"); e.on("y", () => { got.push("a removes b"); e.off("y", b); }); e.on("y", b); e.emit("y"); got.push("---"); e.emit("y"); return got; })()', an: true },
    { goi: '(() => { const e = new MiniEmitter(); let n = 0; e.once("boom", () => { n++; throw new Error("x"); }); try { e.emit("boom"); } catch (err) {} try { e.emit("boom"); } catch (err) {} return [n, e.listenerCount("boom")]; })()', an: true },
    { goi: '(() => { const e = new MiniEmitter(); return [e.off("none", () => {}) === e, e.once("a", () => {}) === e, e.listenerCount("a")]; })()', an: true },
  ],
});

/* ─── 5. 'error' + MaxListenersExceededWarning ─── */
class SafeEmitter {
  constructor() {
    this.listeners = {};
    this.maxListeners = 10;
    this.warned = {};             // one warning per event name, like Node
    this.warnings = [];
  }
  setMaxListeners(n) { this.maxListeners = n; return this; }
  on(name, fn) {
    const list = (this.listeners[name] = this.listeners[name] || []);
    list.push(fn);
    // Node warns once, when the count first goes ABOVE the limit (the 11th listener by default)
    if (this.maxListeners > 0 && list.length > this.maxListeners && !this.warned[name]) {
      this.warned[name] = true;
      this.warnings.push(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${list.length} ${name} listeners added to [${this.constructor.name}]. MaxListeners is ${this.maxListeners}. Use emitter.setMaxListeners() to increase limit`);
    }
    return this;
  }
  emit(name, ...args) {
    const list = this.listeners[name] || [];
    // 'error' with nobody listening is not ignored: it is thrown
    if (name === 'error' && list.length === 0) {
      throw args[0] instanceof Error ? args[0] : new Error(`Unhandled error. (${JSON.stringify(args[0])})`);
    }
    for (const fn of list.slice()) fn.apply(this, args);
    return list.length > 0;
  }
  listenerCount(name) { return (this.listeners[name] || []).length; }
}
const E5 = nodeBai({
  ten: '3.4 · The error event and the 11-listener warning', kho: 'HARD', phut: 25,
  en: `<p>Two rules make <code>node:events</code> more than a map of arrays. Add both to the starter’s <code>SafeEmitter</code>:</p>
<ol><li><b>The 'error' event is special.</b> <code>emit('error', err)</code> with no 'error' listener <b>throws</b> <code>err</code> (if it is not an Error, throw <code>new Error('Unhandled error. (' + JSON.stringify(value) + ')')</code>). With a listener it is an ordinary event.</li>
<li><b>Eleven is a warning, not a limit.</b> When adding a listener makes the count of one event go <b>above</b> <code>maxListeners</code> (default 10; <code>setMaxListeners(n)</code> changes it, 0 = no limit), push this exact text to <code>this.warnings</code> — <b>once per event name</b> — and still add the listener:</li></ol>
<pre>MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 saved listeners added to [NoteStore]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit</pre><p>The class name in brackets is <code>this.constructor.name</code>. That text is what Node 22 prints for 11 listeners on a NoteStore.</p>`,
  vi: `<p>Hai luật khiến <code>node:events</code> hơn một bảng mảng. Thêm cả hai vào <code>SafeEmitter</code> của code khởi đầu:</p>
<ol><li><b>Sự kiện 'error' đặc biệt.</b> <code>emit('error', err)</code> khi không có listener 'error' thì <b>ném</b> <code>err</code> (nếu nó không phải Error, ném <code>new Error('Unhandled error. (' + JSON.stringify(value) + ')')</code>). Có listener thì nó là sự kiện bình thường.</li>
<li><b>Mười một là cảnh báo, không phải giới hạn.</b> Khi thêm listener làm số listener của một sự kiện vượt <b>quá</b> <code>maxListeners</code> (mặc định 10; <code>setMaxListeners(n)</code> đổi được, 0 = không giới hạn), đẩy đúng chuỗi này vào <code>this.warnings</code> — <b>mỗi tên sự kiện một lần</b> — và vẫn thêm listener:</li></ol>
<pre>MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 saved listeners added to [NoteStore]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit</pre><p>Tên lớp trong ngoặc là <code>this.constructor.name</code>. Chuỗi đó là thứ Node 22 in ra cho 11 listener trên một NoteStore.</p>`,
  dauVao: ['calls to on / emit / setMaxListeners', 'các lời gọi on / emit / setMaxListeners'], dauRa: ['throws for unhandled errors; this.warnings collects the warnings', 'ném với lỗi không ai xử lý; this.warnings gom các cảnh báo'],
  goiY: [['The error rule is one if at the top of emit: name === "error" and no listeners.', 'Luật error là một câu if ở đầu emit: name === "error" và không có listener.'], ['The warning is checked in on(), after push, with count > max — not >=.', 'Cảnh báo kiểm trong on(), sau push, với count > max — không phải >=.'], ['Keep a this.warned[name] flag so the 12th, 13th… listener do not warn again.', 'Giữ cờ this.warned[name] để listener thứ 12, 13… không cảnh báo nữa.']],
  loi: [['Refusing to add the 11th listener: Node only warns, the listener is still added.', 'Từ chối thêm listener thứ 11: Node chỉ cảnh báo, listener vẫn được thêm.'], ['Warning at >= 10 (the 10th listener) instead of > 10.', 'Cảnh báo ở >= 10 (listener thứ 10) thay vì > 10.'], ['Returning false for emit("error") with no listener — the error disappears, exactly what the rule exists to prevent.', 'Trả false cho emit("error") khi không có listener — lỗi biến mất, đúng điều luật này sinh ra để ngăn.']],
  gt: ['Both behaviours were measured on Node 22: 12 listeners give exactly one warning (“11 saved listeners…”), <code>setMaxListeners(2)</code> warns at the 3rd listener, separately for each event name, and an unhandled \'error\' is thrown. Throwing is deliberate — an error nobody handles must not vanish; that is why every long-lived stream or socket needs an \'error\' listener.', 'Cả hai hành vi đã đo trên Node 22: 12 listener cho đúng một cảnh báo (“11 saved listeners…”), <code>setMaxListeners(2)</code> cảnh báo ở listener thứ 3, riêng cho từng tên sự kiện, và \'error\' không ai xử lý thì bị ném. Ném là có chủ ý — lỗi không ai xử lý không được biến mất; vì thế mọi stream hay socket sống lâu đều cần một listener \'error\'.'],
  kn: ['events', 'errors'], tns: [tn('unhandled error', 'lỗi không được xử lý'), tn('MaxListenersExceededWarning', 'cảnh báo vượt số listener tối đa')],
  chung: 'class NoteStore extends SafeEmitter {}',
  dau: `/** on/emit work — add the 'error' rule and the max-listeners warning */
class SafeEmitter {
  constructor() {
    this.listeners = {};
    this.maxListeners = 10;
    this.warnings = [];
  }
  setMaxListeners(n) { this.maxListeners = n; return this; }
  on(name, fn) {
    (this.listeners[name] = this.listeners[name] || []).push(fn);
    // Write your solution here (the warning)
    return this;
  }
  emit(name, ...args) {
    const list = this.listeners[name] || [];
    // Write your solution here (the 'error' rule)
    for (const fn of list.slice()) fn.apply(this, args);
    return list.length > 0;
  }
  listenerCount(name) { return (this.listeners[name] || []).length; }
}
`,
  giai: '// Reference solution — the two rules that make node:events special\n' + nguon(SafeEmitter),
  cases: [
    { goi: '(() => { const s = new NoteStore(); for (let i = 0; i < 12; i++) s.on("saved", () => {}); return [s.listenerCount("saved"), s.warnings]; })()', moTa: ['12 listeners: added, one warning', '12 listener: vẫn thêm, một cảnh báo'] },
    { goi: 'new SafeEmitter().emit("error", new Error("boom"))', nem: 'Error', thongDiep: '^boom$', moTa: ['Unhandled "error" is thrown', '"error" không ai xử lý bị ném'] },
    { goi: '(() => { const e = new SafeEmitter(); const got = []; e.on("error", (err) => got.push("handled " + err.message)); return [e.emit("error", new Error("boom")), got]; })()', moTa: ['With a listener it is a normal event', 'Có listener thì là sự kiện bình thường'] },
    { goi: '(() => { const s = new NoteStore(); s.setMaxListeners(2); for (let i = 0; i < 3; i++) { s.on("a", () => {}); s.on("b", () => {}); } return s.warnings; })()', an: true },
    { goi: '(() => { const s = new NoteStore(); for (let i = 0; i < 10; i++) s.on("x", () => {}); return s.warnings.length; })()', an: true },
    { goi: '(() => { const s = new SafeEmitter(); s.setMaxListeners(0); for (let i = 0; i < 50; i++) s.on("x", () => {}); return [s.warnings.length, s.listenerCount("x")]; })()', an: true },
    { goi: 'new SafeEmitter().emit("error", "plain string")', nem: 'Error', thongDiep: 'Unhandled error', an: true },
    { goi: '(() => { const e = new SafeEmitter(); return [e.emit("nothing"), e.emit("other", 1)]; })()', an: true },
  ],
});

export default doiDau({ slug: 'nodejs-3-4-eventemitter', ten: '3.4 EventEmitter', khoa: KHOA, baiHoc: 'nodejs-3-4-eventemitter', de: [E1, E2, E3, E4, E5] });

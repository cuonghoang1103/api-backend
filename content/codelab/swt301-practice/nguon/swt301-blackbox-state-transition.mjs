/**
 * SWT301 · 4.5 — State transition testing (SWT4 slide 60–72, LO-4.2.4 K3).
 * Máy trạng thái đơn hàng: NEW, PAID, ON_HOLD, SHIPPED, DELIVERED, CANCELLED · 6 sự kiện · 8 chuyển đổi hợp lệ · 28 không hợp lệ.
 */
import { doiDau, KHOA, hai, giai, lc, tn, svg } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy, dotBienDe, TN_TEST } from './_de.mjs';

const T = [
  ['T1', 'NEW', 'pay', 'PAID'], ['T2', 'NEW', 'cancel', 'CANCELLED'], ['T3', 'PAID', 'hold', 'ON_HOLD'], ['T4', 'ON_HOLD', 'release', 'PAID'],
  ['T5', 'PAID', 'ship', 'SHIPPED'], ['T6', 'PAID', 'cancel', 'CANCELLED'], ['T7', 'ON_HOLD', 'cancel', 'CANCELLED'], ['T8', 'SHIPPED', 'deliver', 'DELIVERED'],
];
const SO_DO = svg({
  w: 760, h: 340, tieuDe: 'Order lifecycle — state transition diagram (8 valid transitions)',
  nut: [
    { id: 's', x: 26, y: 170, hinh: 'dau', nhan: '' },
    { id: 'NEW', x: 110, y: 170, hinh: 'tt', nhan: 'NEW', rong: 90 },
    { id: 'PAID', x: 300, y: 170, hinh: 'tt', nhan: 'PAID', rong: 90 },
    { id: 'ON_HOLD', x: 300, y: 295, hinh: 'tt', nhan: 'ON_HOLD', rong: 100 },
    { id: 'SHIPPED', x: 500, y: 170, hinh: 'tt', nhan: 'SHIPPED', rong: 100 },
    { id: 'DELIVERED', x: 680, y: 170, hinh: 'tt', nhan: 'DELIVERED', rong: 110, mau: '#dcfce7' },
    { id: 'CANCELLED', x: 300, y: 50, hinh: 'tt', nhan: 'CANCELLED', rong: 110, mau: '#fee2e2' },
  ],
  canh: [
    { tu: 's', den: 'NEW' },
    { tu: 'NEW', den: 'PAID', nhan: 'T1 pay' },
    { tu: 'NEW', den: 'CANCELLED', nhan: 'T2 cancel' },
    { tu: 'PAID', den: 'ON_HOLD', nhan: 'T3 hold', cong: 28 },
    { tu: 'ON_HOLD', den: 'PAID', nhan: 'T4 release', cong: 28 },
    { tu: 'PAID', den: 'SHIPPED', nhan: 'T5 ship' },
    { tu: 'PAID', den: 'CANCELLED', nhan: 'T6 cancel' },
    { tu: 'ON_HOLD', den: 'CANCELLED', nhan: 'T7 cancel', qua: [[420, 295], [420, 50]], nhanDx: 0, nhanDy: -8 },
    { tu: 'SHIPPED', den: 'DELIVERED', nhan: 'T8 deliver' },
  ],
  chu: [{ x: 680, y: 210, nhan: 'final', co: 11 }, { x: 300, y: 85, nhan: 'final', co: 11 }],
});
const MO_TA = {
  en: `<p><b>Order lifecycle.</b> A new order can be paid or cancelled. A paid order can be put on hold (and released back to PAID), shipped, or cancelled; an order on hold can also be cancelled. A shipped order can only be delivered. DELIVERED and CANCELLED are final. Any other event in a state is <b>rejected</b> and the order stays in its state.</p>${SO_DO}`,
  vi: `<p><b>Vòng đời đơn hàng.</b> Đơn mới có thể được thanh toán hoặc huỷ. Đơn đã thanh toán có thể tạm giữ (rồi thả về PAID), giao vận chuyển, hoặc huỷ; đơn đang tạm giữ cũng huỷ được. Đơn đã giao vận chuyển chỉ có thể được giao xong. DELIVERED và CANCELLED là trạng thái cuối. Mọi sự kiện khác ở một trạng thái đều <b>bị từ chối</b> và đơn giữ nguyên trạng thái.</p>${SO_DO}`,
};
const SIM = function () {
  const T = [['T1', 'NEW', 'pay', 'PAID'], ['T2', 'NEW', 'cancel', 'CANCELLED'], ['T3', 'PAID', 'hold', 'ON_HOLD'], ['T4', 'ON_HOLD', 'release', 'PAID'], ['T5', 'PAID', 'ship', 'SHIPPED'], ['T6', 'PAID', 'cancel', 'CANCELLED'], ['T7', 'ON_HOLD', 'cancel', 'CANCELLED'], ['T8', 'SHIPPED', 'deliver', 'DELIVERED']];
  const buoc = (s, e) => T.find((t) => t[1] === s && t[2] === e) || null;
  return { T, buoc };
};

/* E1 — bảng trạng thái */
const OPT = ['NEW', 'PAID', 'ON_HOLD', 'SHIPPED', 'DELIVERED', 'CANCELLED', '— (invalid)'];
const SU_KIEN = ['pay', 'hold', 'release', 'ship', 'deliver', 'cancel'];
const dapE1 = {};
for (const s of ['NEW', 'PAID', 'ON_HOLD']) for (const e of SU_KIEN) { const t = T.find((x) => x[1] === s && x[2] === e); dapE1[`${s}.${e}`] = t ? t[3] : '— (invalid)'; }
const E1 = tinhDe({
  tieuDe: 'State transition 1 — Build the state table from the diagram',
  doKho: 'EASY', phut: 8,
  moTa: { en: `${MO_TA.en}<p>The <b>state table</b> lists every state × event pair — including the invalid ones, which the diagram does not show. Fill the rows of NEW, PAID and ON_HOLD.</p>`, vi: `${MO_TA.vi}<p><b>Bảng trạng thái</b> liệt kê mọi cặp trạng thái × sự kiện — kể cả cặp không hợp lệ mà sơ đồ không vẽ. Điền các dòng NEW, PAID và ON_HOLD.</p>` },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Next state for each (state, event) — or “— (invalid)”', 'Trạng thái kế tiếp cho mỗi (trạng thái, sự kiện) — hoặc “— (invalid)”'),
    cot: [{ ma: 's', ten: 'State \\ Event' }, ...SU_KIEN.map((e) => ({ ma: e, ten: e, luaChon: OPT }))],
    hang: ['NEW', 'PAID', 'ON_HOLD'].map((s) => ({ ma: s, o: { s } })),
    dapAn: dapE1,
    giaiThich: giai('Each row has as many valid cells as arrows leaving that state: NEW 2, PAID 3, ON_HOLD 2. All other cells are invalid transitions — the best source of negative tests.', 'Mỗi dòng có số ô hợp lệ bằng số mũi tên rời trạng thái đó: NEW 2, PAID 3, ON_HOLD 2. Các ô còn lại là chuyển đổi không hợp lệ — nguồn test âm tốt nhất.'),
  }],
  goiY: ['Đếm mũi tên đi RA khỏi từng trạng thái trên sơ đồ.', 'Không có mũi tên ⇒ “— (invalid)”, kể cả pay khi đã PAID.'],
  loiHayGap: ['Ghi PAID cho (PAID, pay) vì “trả tiền lần nữa vẫn là đã trả” — sơ đồ không có mũi tên đó ⇒ không hợp lệ.', 'Quên cancel ở ON_HOLD (mũi tên T7 vòng sang phải).'],
  giaiThich: '<p>NEW: pay→PAID, cancel→CANCELLED. PAID: hold→ON_HOLD, ship→SHIPPED, cancel→CANCELLED. ON_HOLD: release→PAID, cancel→CANCELLED. Everything else invalid.</p>',
  thuatNgu: [...tn('stateTransition'), { en: 'state table', vi: 'bảng trạng thái — mọi cặp trạng thái × sự kiện, gồm cả cặp không hợp lệ' }, { en: 'invalid transition', vi: 'chuyển đổi không hợp lệ — sự kiện không được phép ở trạng thái đó' }],
  khaiNiem: ['state transition testing', 'state table'],
});

/* E2 — phủ 0-switch tối thiểu */
const E2 = jsDe({
  tieuDe: 'State transition 2 — Cover every valid transition (0-switch) with the fewest sequences',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `${MO_TA.en}<p>A test is a sequence of events starting from a new order. Write the <b>minimum</b> number of sequences that together exercise all 8 valid transitions (<b>0-switch coverage</b>), each with the state the order must end in.</p>`, vi: `${MO_TA.vi}<p>Một test là chuỗi sự kiện bắt đầu từ đơn mới. Viết số chuỗi <b>tối thiểu</b> mà gộp lại chạy qua cả 8 chuyển đổi hợp lệ (<b>độ phủ 0-switch</b>), mỗi chuỗi kèm trạng thái cuối mà đơn phải ở.</p>` },
  yeuCau: [
    { en: '<code>SEQUENCES = [{ events: ["pay", "ship", "deliver"], expectedFinal: "DELIVERED" }, …]</code> — every event must be valid at that point.', vi: '<code>SEQUENCES = [{ events: ["pay", "ship", "deliver"], expectedFinal: "DELIVERED" }, …]</code> — mọi sự kiện phải hợp lệ tại thời điểm đó.' },
    { en: 'Hint for the minimum: a final state ends a sequence, so count how many transitions lead into a final state.', vi: 'Gợi ý số tối thiểu: trạng thái cuối kết thúc chuỗi, nên đếm có bao nhiêu chuyển đổi đi vào trạng thái cuối.' },
  ],
  viDu: [{ input: "{ events: ['pay', 'hold', 'release', 'ship', 'deliver'], expectedFinal: 'DELIVERED' }", output: 'covers T1, T3, T4, T5, T8', explanation: 'A loop (hold/release) can be taken inside a longer sequence.|||Vòng (hold/release) đi được bên trong một chuỗi dài.' }],
  goiY: ['Ba chuyển đổi cancel (T2, T6, T7) và deliver (T8) đều đi vào trạng thái cuối ⇒ mỗi cái kết thúc một chuỗi riêng ⇒ ít nhất 4 chuỗi.', 'Gắn T3, T4, T5 vào chuỗi kết thúc bằng deliver.'],
  loiHayGap: ['Viết 8 chuỗi, mỗi chuỗi một chuyển đổi — đúng phủ nhưng không tối thiểu.', 'Chuỗi ["cancel", "pay"] — pay sau CANCELLED là không hợp lệ.'],
  giaiThich: '<p>Four sequences: pay·hold·release·ship·deliver (T1 T3 T4 T5 T8) · cancel (T2) · pay·cancel (T1 T6) · pay·hold·cancel (T1 T3 T7). Four transitions enter a final state, so four is the minimum.</p>',
  thuatNgu: [...tn('stateTransition'), { en: '0-switch coverage', vi: 'độ phủ 0-switch — mọi chuyển đổi hợp lệ chạy ít nhất một lần' }],
  khaiNiem: ['state transition testing', '0-switch coverage'],
  tep: {
    'answer.js': [
      "// Each sequence starts from a NEW order.\nconst SEQUENCES = [\n  { events: ['pay', 'ship', 'deliver'], expectedFinal: 'DELIVERED' },\n];\n",
      "// 0-switch coverage with the minimum number of sequences (4 transitions end in a final state).\nconst SEQUENCES = [\n  { events: ['pay', 'hold', 'release', 'ship', 'deliver'], expectedFinal: 'DELIVERED' }, // T1 T3 T4 T5 T8\n  { events: ['cancel'], expectedFinal: 'CANCELLED' },                                 // T2\n  { events: ['pay', 'cancel'], expectedFinal: 'CANCELLED' },                          // T1 T6\n  { events: ['pay', 'hold', 'cancel'], expectedFinal: 'CANCELLED' },                  // T1 T3 T7\n];\n",
    ],
  },
  kiem: (() => {
    const chung = `const { T, buoc } = (${SIM.toString()})();
      if (!Array.isArray(SEQUENCES) || !SEQUENCES.length) return 'SEQUENCES must be a non-empty array';
      const chay = (q) => { let s = 'NEW'; const dung = []; for (let i = 0; i < (q.events || []).length; i++) { const t = buoc(s, q.events[i]); if (!t) return { loi: 'event "' + q.events[i] + '" is not valid in state ' + s + ' (step ' + (i + 1) + ')' }; dung.push(t[0]); s = t[3]; } return { s, dung }; };
      const kq = SEQUENCES.map(chay);`;
    const phu = (id) => kiemTuy({ en: `Transition ${id} is exercised`, vi: `Chuyển đổi ${id} được chạy qua` }, new Function(`${chung} return kq.some((r) => r.dung && r.dung.indexOf('${id}') >= 0) ? 'OK' : '${id} not covered yet';`));
    return [
      kiemTuy({ en: 'Every sequence is valid and ends in its expected state', vi: 'Mọi chuỗi hợp lệ và kết thúc đúng trạng thái mong đợi' }, new Function(`${chung} for (let i = 0; i < kq.length; i++) { if (kq[i].loi) return 'sequence #' + (i + 1) + ': ' + kq[i].loi; if (kq[i].s !== SEQUENCES[i].expectedFinal) return 'sequence #' + (i + 1) + ' ends in ' + kq[i].s + ', not ' + SEQUENCES[i].expectedFinal; } return 'OK';`)),
      ...T.map((t) => phu(t[0])),
      kiemTuy({ en: 'Minimum number of sequences (4)', vi: 'Số chuỗi tối thiểu (4)' }, new Function(`${chung} return SEQUENCES.length === 4 ? 'OK' : SEQUENCES.length + ' sequences — four transitions lead into a final state, so 4 is the minimum';`)),
    ];
  })(),
});

/* E3 — test âm từ chuyển đổi không hợp lệ */
const E3 = jsDe({
  tieuDe: 'State transition 3 — Negative tests from invalid transitions',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: `${MO_TA.en}<p>The state table has 6 states × 6 events = 36 cells. Count the <b>invalid</b> ones, then write negative tests: each reaches a state with valid events and then fires ONE invalid event; the expected result is that the event is rejected and the order <b>stays</b> in its state.</p>`, vi: `${MO_TA.vi}<p>Bảng trạng thái có 6 trạng thái × 6 sự kiện = 36 ô. Đếm số ô <b>không hợp lệ</b>, rồi viết test âm: mỗi test đi tới một trạng thái bằng các sự kiện hợp lệ rồi bắn MỘT sự kiện không hợp lệ; kết quả mong đợi là sự kiện bị từ chối và đơn <b>giữ nguyên</b> trạng thái.</p>` },
  yeuCau: [
    { en: '<code>INVALID_COUNT</code> = number of invalid (state, event) pairs.', vi: '<code>INVALID_COUNT</code> = số cặp (trạng thái, sự kiện) không hợp lệ.' },
    { en: '<code>NEGATIVE = [{ events: ["pay", "pay"], expectedState: "PAID" }, …]</code>: only the LAST event is invalid; cover invalid events in at least 5 different states (including both final states).', vi: '<code>NEGATIVE = [{ events: ["pay", "pay"], expectedState: "PAID" }, …]</code>: chỉ sự kiện CUỐI không hợp lệ; phủ sự kiện sai ở ít nhất 5 trạng thái khác nhau (gồm cả hai trạng thái cuối).' },
  ],
  viDu: [{ input: "{ events: ['pay', 'ship', 'cancel'], expectedState: 'SHIPPED' }", output: 'a shipped order cannot be cancelled', explanation: 'Valid prefix pay·ship, then the invalid event cancel.|||Phần đầu hợp lệ pay·ship, rồi sự kiện sai cancel.' }],
  goiY: ['36 ô − 8 chuyển đổi hợp lệ.', 'Trạng thái cuối (DELIVERED, CANCELLED) từ chối MỌI sự kiện — test ít nhất một sự kiện ở mỗi trạng thái cuối.'],
  loiHayGap: ['Đếm số ô không hợp lệ chỉ ở ba trạng thái đầu.', 'Viết expectedState là trạng thái "sau lỗi" khác đi — sự kiện bị từ chối thì trạng thái không đổi.'],
  giaiThich: '<p>INVALID_COUNT = 36 − 8 = 28. Good negative tests: NEW·ship, pay·pay (PAID), pay·hold·ship (ON_HOLD), pay·ship·cancel (SHIPPED), pay·ship·deliver·cancel (DELIVERED), cancel·pay (CANCELLED).</p>',
  thuatNgu: [...tn('stateTransition'), { en: 'negative test', vi: 'test âm — kiểm hệ thống từ chối đúng thao tác không hợp lệ' }],
  khaiNiem: ['state transition testing', 'invalid transitions'],
  tep: {
    'answer.js': [
      "const INVALID_COUNT = 0;\n\n// Only the LAST event of each sequence is invalid.\nconst NEGATIVE = [\n  { events: ['pay', 'pay'], expectedState: 'PAID' },\n];\n",
      "const INVALID_COUNT = 28;   // 6 states × 6 events = 36 cells − 8 valid transitions\n\n// One invalid event at the end of each sequence; the order must stay where it is.\nconst NEGATIVE = [\n  { events: ['ship'], expectedState: 'NEW' },\n  { events: ['pay', 'pay'], expectedState: 'PAID' },\n  { events: ['pay', 'hold', 'ship'], expectedState: 'ON_HOLD' },\n  { events: ['pay', 'ship', 'cancel'], expectedState: 'SHIPPED' },\n  { events: ['pay', 'ship', 'deliver', 'cancel'], expectedState: 'DELIVERED' },\n  { events: ['cancel', 'pay'], expectedState: 'CANCELLED' },\n];\n",
    ],
  },
  kiem: (() => {
    const chung = `const { buoc } = (${SIM.toString()})();
      if (!Array.isArray(NEGATIVE) || !NEGATIVE.length) return 'NEGATIVE must be a non-empty array';
      const xet = (q) => { const ev = q.events || []; if (!ev.length) return { loi: 'empty sequence' }; let s = 'NEW'; for (let i = 0; i < ev.length - 1; i++) { const t = buoc(s, ev[i]); if (!t) return { loi: 'event "' + ev[i] + '" at step ' + (i + 1) + ' is already invalid — only the last event may be invalid' }; s = t[3]; } if (buoc(s, ev[ev.length - 1])) return { loi: 'the last event "' + ev[ev.length - 1] + '" is VALID in ' + s }; return { s }; };
      const kq = NEGATIVE.map(xet);`;
    return [
      kiemTuy({ en: 'INVALID_COUNT is right', vi: 'INVALID_COUNT đúng' }, new Function("return INVALID_COUNT === 28 ? 'OK' : 'not right — count all 36 cells of the state table, then remove the valid transitions';")),
      kiemTuy({ en: 'Every negative test has a valid prefix and ONE invalid last event', vi: 'Mọi test âm có phần đầu hợp lệ và MỘT sự kiện cuối không hợp lệ' }, new Function(`${chung} const i = kq.findIndex((r) => r.loi); return i < 0 ? 'OK' : 'negative #' + (i + 1) + ': ' + kq[i].loi;`)),
      kiemTuy({ en: 'Expected state = the state before the rejected event', vi: 'Trạng thái mong đợi = trạng thái trước sự kiện bị từ chối' }, new Function(`${chung} const i = kq.findIndex((r, j) => !r.loi && r.s !== NEGATIVE[j].expectedState); return i < 0 ? 'OK' : 'negative #' + (i + 1) + ': the order stays in ' + kq[i].s;`)),
      kiemTuy({ en: 'Invalid events tested in at least 5 different states', vi: 'Sự kiện sai được test ở ít nhất 5 trạng thái khác nhau' }, new Function(`${chung} const st = new Set(kq.filter((r) => !r.loi).map((r) => r.s)); return st.size >= 5 ? 'OK' : 'only ' + st.size + ' state(s): ' + [...st].join(', ');`)),
      kiemTuy({ en: 'Both final states are shown to reject events', vi: 'Cả hai trạng thái cuối đều được chứng minh từ chối sự kiện' }, new Function(`${chung} const st = new Set(kq.filter((r) => !r.loi).map((r) => r.s)); return st.has('DELIVERED') && st.has('CANCELLED') ? 'OK' : 'test an event in ' + (st.has('DELIVERED') ? 'CANCELLED' : 'DELIVERED');`)),
    ];
  })(),
});

/* E4 — lớp Order, giết mutant */
const SUT4 = `/* lib/sut.js — exception thrown by Order for a rejected event. Use it in toThrow(IllegalStateException). */
class IllegalStateException extends Error { constructor(m) { super(m); this.name = 'IllegalStateException'; } }
`;
const DUNG4 = `class Order {
  constructor() { this.state = 'NEW'; }
  _go(event, from, to) {
    if (from.indexOf(this.state) < 0) throw new IllegalStateException(event + ' is not allowed in ' + this.state);
    this.state = to;
  }
  pay() { this._go('pay', ['NEW'], 'PAID'); }
  hold() { this._go('hold', ['PAID'], 'ON_HOLD'); }
  release() { this._go('release', ['ON_HOLD'], 'PAID'); }
  ship() { this._go('ship', ['PAID'], 'SHIPPED'); }
  deliver() { this._go('deliver', ['SHIPPED'], 'DELIVERED'); }
  cancel() { this._go('cancel', ['NEW', 'PAID', 'ON_HOLD'], 'CANCELLED'); }
}`;
const doi4 = (a, b) => { if (!DUNG4.includes(a)) throw new Error('mutant 4.5: ' + a); return DUNG4.replace(a, b); };
const E4 = dotBienDe({
  tieuDe: 'State transition 4 — Unit-test the Order state machine (kill the mutants)',
  doKho: 'HARD', phut: 18,
  moTa: { en: `${MO_TA.en}<p><code>new Order()</code> starts in <code>NEW</code>; methods <code>pay()</code>, <code>hold()</code>, <code>release()</code>, <code>ship()</code>, <code>deliver()</code>, <code>cancel()</code> fire the events; <code>order.state</code> is the current state; a rejected event throws <code>IllegalStateException</code> and leaves the state unchanged. Test every valid transition AND the important invalid ones.</p>`, vi: `${MO_TA.vi}<p><code>new Order()</code> bắt đầu ở <code>NEW</code>; các hàm <code>pay()</code>, <code>hold()</code>, <code>release()</code>, <code>ship()</code>, <code>deliver()</code>, <code>cancel()</code> bắn sự kiện; <code>order.state</code> là trạng thái hiện tại; sự kiện bị từ chối ném <code>IllegalStateException</code> và giữ nguyên trạng thái. Test mọi chuyển đổi hợp lệ VÀ các chuyển đổi không hợp lệ quan trọng.</p>` },
  yeuCau: [
    { en: 'A <code>beforeEach</code> that creates a fresh order keeps the tests independent.', vi: '<code>beforeEach</code> tạo đơn mới giúp các test độc lập.' },
    { en: 'For a rejected event check BOTH the exception and that <code>order.state</code> did not change.', vi: 'Với sự kiện bị từ chối kiểm CẢ exception lẫn việc <code>order.state</code> không đổi.' },
  ],
  viDu: [{ input: 'o.pay(); o.ship(); expect(() => o.cancel()).toThrow(IllegalStateException); expect(o.state).toBe("SHIPPED")', output: 'kills the mutant that allows cancelling a shipped order', explanation: 'An invalid transition taken from the state table.|||Một chuyển đổi không hợp lệ lấy từ bảng trạng thái.' }],
  goiY: ['Mỗi chuyển đổi hợp lệ một test (8 test), kiểm order.state sau sự kiện.', 'Thêm test âm cho các ô nguy hiểm: ship khi NEW, deliver khi PAID, cancel khi SHIPPED, pay lần hai, hold khi NEW.'],
  loiHayGap: ['Chỉ test chuỗi thành công pay·ship·deliver — các mutant cho phép chuyển đổi sai sống sót.', 'Kiểm toThrow() nhưng không kiểm state sau đó.'],
  giaiThich: '<p>State-transition unit tests cover each valid transition (0-switch) plus the invalid cells that a careless implementation is likely to allow. JUnit 5: <code>assertThrows(IllegalStateException.class, order::cancel); assertEquals(SHIPPED, order.getState());</code>.</p>',
  thuatNgu: [...TN_TEST(), ...tn('stateTransition')],
  ten: ['Order'], dung: DUNG4, sut: SUT4, minTest: 8,
  dotBien: [
    { ma: 'M1', moTa: { en: 'a NEW order can be shipped', vi: 'đơn NEW giao vận chuyển được' }, code: doi4("ship() { this._go('ship', ['PAID']", "ship() { this._go('ship', ['NEW', 'PAID']") },
    { ma: 'M2', moTa: { en: 'a SHIPPED order can be cancelled', vi: 'đơn SHIPPED huỷ được' }, code: doi4("['NEW', 'PAID', 'ON_HOLD'], 'CANCELLED'", "['NEW', 'PAID', 'ON_HOLD', 'SHIPPED'], 'CANCELLED'") },
    { ma: 'M3', moTa: { en: 'a PAID order can be delivered directly', vi: 'đơn PAID giao xong trực tiếp được' }, code: doi4("deliver() { this._go('deliver', ['SHIPPED']", "deliver() { this._go('deliver', ['SHIPPED', 'PAID']") },
    { ma: 'M4', moTa: { en: 'an order ON_HOLD cannot be cancelled', vi: 'đơn ON_HOLD không huỷ được' }, code: doi4("['NEW', 'PAID', 'ON_HOLD'], 'CANCELLED'", "['NEW', 'PAID'], 'CANCELLED'") },
    { ma: 'M5', moTa: { en: 'release returns the order to NEW', vi: 'release đưa đơn về NEW' }, code: doi4("['ON_HOLD'], 'PAID'", "['ON_HOLD'], 'NEW'") },
    { ma: 'M6', an: true, moTa: { en: 'paying twice is accepted', vi: 'thanh toán hai lần được chấp nhận' }, code: doi4("pay() { this._go('pay', ['NEW']", "pay() { this._go('pay', ['NEW', 'PAID']") },
    { ma: 'M7', an: true, moTa: { en: 'a rejected event still changes the state', vi: 'sự kiện bị từ chối vẫn đổi trạng thái' }, code: doi4("if (from.indexOf(this.state) < 0) throw new IllegalStateException(event + ' is not allowed in ' + this.state);\n    this.state = to;", "const cu = this.state; this.state = to;\n    if (from.indexOf(cu) < 0) throw new IllegalStateException(event + ' is not allowed in ' + cu);") },
  ],
  dauTest: `// Unit tests for the Order state machine. new Order() starts in 'NEW'.
test('pay moves a new order to PAID', () => {
  const o = new Order();
  o.pay();
  expect(o.state).toBe('PAID');
});
`,
  giaiTest: `describe('Order — state transitions', () => {
  let o;
  beforeEach(() => { o = new Order(); });

  // every valid transition (0-switch)
  test('T1 NEW -pay-> PAID', () => { o.pay(); expect(o.state).toBe('PAID'); });
  test('T2 NEW -cancel-> CANCELLED', () => { o.cancel(); expect(o.state).toBe('CANCELLED'); });
  test('T3 PAID -hold-> ON_HOLD', () => { o.pay(); o.hold(); expect(o.state).toBe('ON_HOLD'); });
  test('T4 ON_HOLD -release-> PAID', () => { o.pay(); o.hold(); o.release(); expect(o.state).toBe('PAID'); });
  test('T5 PAID -ship-> SHIPPED', () => { o.pay(); o.ship(); expect(o.state).toBe('SHIPPED'); });
  test('T6 PAID -cancel-> CANCELLED', () => { o.pay(); o.cancel(); expect(o.state).toBe('CANCELLED'); });
  test('T7 ON_HOLD -cancel-> CANCELLED', () => { o.pay(); o.hold(); o.cancel(); expect(o.state).toBe('CANCELLED'); });
  test('T8 SHIPPED -deliver-> DELIVERED', () => { o.pay(); o.ship(); o.deliver(); expect(o.state).toBe('DELIVERED'); });

  // invalid transitions from the state table: rejected, state unchanged
  test.each([
    [[], 'ship', 'NEW'],
    [[], 'hold', 'NEW'],
    [['pay'], 'pay', 'PAID'],
    [['pay'], 'deliver', 'PAID'],
    [['pay', 'ship'], 'cancel', 'SHIPPED'],
    [['pay', 'ship', 'deliver'], 'cancel', 'DELIVERED'],
  ])('after %p, %s is rejected and the order stays %s', (before, event, state) => {
    before.forEach((e) => o[e]());
    expect(() => o[event]()).toThrow(IllegalStateException);
    expect(o.state).toBe(state);
  });
});
`,
});

const E5 = tinhDe({
  tieuDe: 'State transition 5 — ISTQB-style questions',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: `${MO_TA.en}<p>Six questions about the diagram above and about state transition coverage in general.</p>`, vi: `${MO_TA.vi}<p>Sáu câu về sơ đồ trên và về độ phủ chuyển trạng thái nói chung.</p>` },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('How many valid transitions does the order diagram have?', 'Sơ đồ đơn hàng có bao nhiêu chuyển đổi hợp lệ?'), luaChon: lc(['a', '6'], ['b', '7'], ['c', '8'], ['d', '28']), dapAn: ['c'], giaiThich: giai('T1–T8 — count the arrows (the start arrow is not a transition between states).', 'T1–T8 — đếm mũi tên (mũi tên khởi đầu không phải chuyển đổi giữa hai trạng thái).') },
    { ma: 'q2', de: hai('What does 0-switch coverage require?', 'Độ phủ 0-switch yêu cầu gì?'), luaChon: lc(['a', 'Every state visited at least once'], ['b', 'Every valid transition exercised at least once'], ['c', 'Every pair of consecutive transitions exercised'], ['d', 'Every invalid transition attempted']), dapAn: ['b'], giaiThich: giai('0-switch = single transitions. Pairs are 1-switch; visiting states is a weaker criterion.', '0-switch = từng chuyển đổi đơn. Cặp liên tiếp là 1-switch; đi qua mọi trạng thái là tiêu chí yếu hơn.') },
    { ma: 'q3', de: hai('Which statement is TRUE?', 'Phát biểu nào ĐÚNG?'), luaChon: lc(['a', 'Covering all states guarantees covering all transitions'], ['b', 'Covering all transitions guarantees covering all states reachable by a transition'], ['c', '1-switch coverage is weaker than 0-switch coverage'], ['d', 'Invalid transitions are shown as arrows in the diagram']), dapAn: ['b'], giaiThich: giai('Every transition ends in a state, so all-transitions implies all (reachable) states — not the other way round: pay·ship·deliver and cancel visit 5 of 6 states but skip T3–T7. 1-switch is stronger; invalid transitions appear only in the state table.', 'Mỗi chuyển đổi kết thúc ở một trạng thái nên phủ mọi chuyển đổi kéo theo phủ mọi trạng thái (tới được) — chiều ngược lại thì không. 1-switch mạnh hơn; chuyển đổi sai chỉ có trong bảng trạng thái.') },
    { ma: 'q4', de: hai('Where do the best NEGATIVE tests of state transition testing come from?', 'Test ÂM tốt nhất của kiểm thử chuyển trạng thái lấy từ đâu?'), luaChon: lc(['a', 'From the arrows of the diagram'], ['b', 'From the empty (invalid) cells of the state table'], ['c', 'From the use case main scenario'], ['d', 'From the code coverage report']), dapAn: ['b'], giaiThich: giai('The state table shows every state × event pair; the empty cells are the invalid transitions to try.', 'Bảng trạng thái có mọi cặp trạng thái × sự kiện; các ô trống là chuyển đổi sai cần thử.') },
    { ma: 'q5', de: hai('Which sequence achieves 100% STATE coverage (all six states) in a single test?', 'Chuỗi nào đạt 100% độ phủ TRẠNG THÁI (cả sáu trạng thái) chỉ trong một test?'), luaChon: lc(['a', 'pay · hold · release · ship · deliver'], ['b', 'pay · hold · cancel'], ['c', 'No single sequence can — DELIVERED and CANCELLED are both final'], ['d', 'cancel · pay · ship · deliver']), dapAn: ['c'], giaiThich: giai('A sequence ends in one final state, so at least two tests are needed to visit both DELIVERED and CANCELLED. (d) is invalid after cancel.', 'Một chuỗi chỉ kết thúc ở một trạng thái cuối, nên cần ít nhất hai test để thăm cả DELIVERED và CANCELLED. (d) không hợp lệ sau cancel.') },
    { ma: 'q6', de: hai('An ATM keeps the card after the third wrong PIN. Which technique fits this requirement best?', 'Máy ATM giữ thẻ sau lần nhập sai PIN thứ ba. Kỹ thuật nào hợp nhất với yêu cầu này?'), luaChon: lc(['a', 'Equivalence partitioning'], ['b', 'State transition testing'], ['c', 'Statement coverage'], ['d', 'Pairwise testing']), dapAn: ['b'], giaiThich: giai('The same input (a wrong PIN) gives a different result depending on history — the hallmark of a state machine (SWT4 slides 60–72).', 'Cùng một input (PIN sai) cho kết quả khác tuỳ lịch sử — dấu hiệu của máy trạng thái (slide SWT4 60–72).') },
  ],
  goiY: ['Đếm mũi tên giữa các trạng thái; mũi tên vào từ chấm đen không tính.', 'Hai trạng thái cuối ⇒ không chuỗi nào thăm được cả hai.'],
  loiHayGap: ['Cho rằng thăm hết trạng thái là đủ — bỏ sót chuyển đổi.', 'Tìm chuyển đổi sai trên sơ đồ — chúng chỉ có trong bảng trạng thái.'],
  giaiThich: '<p>Answers: c · b · b · b · c · b.</p>',
  thuatNgu: tn('stateTransition'),
  khaiNiem: ['state transition testing'],
});

/* E6 — 1-switch */
const E6 = jsDe({
  tieuDe: 'State transition 6 — 1-switch coverage: every pair of consecutive transitions',
  doKho: 'HARD', phut: 18,
  moTa: { en: `${MO_TA.en}<p><b>1-switch coverage</b> requires every <i>pair</i> of consecutive valid transitions (Tₐ then T_b where Tₐ ends in the state T_b starts from). List the pairs and write sequences that cover all of them — in <b>at most 5</b> sequences.</p>`, vi: `${MO_TA.vi}<p><b>Độ phủ 1-switch</b> yêu cầu mọi <i>cặp</i> chuyển đổi hợp lệ liên tiếp (Tₐ rồi T_b, Tₐ kết thúc ở trạng thái T_b bắt đầu). Liệt kê các cặp và viết chuỗi phủ hết chúng — trong <b>tối đa 5</b> chuỗi.</p>` },
  yeuCau: [
    { en: '<code>PAIR_COUNT</code> = the number of valid transition pairs.', vi: '<code>PAIR_COUNT</code> = số cặp chuyển đổi hợp lệ.' },
    { en: '<code>SEQUENCES1 = [["pay", "hold", "release", …], …]</code> — event arrays from a NEW order, all events valid.', vi: '<code>SEQUENCES1 = [["pay", "hold", "release", …], …]</code> — mảng sự kiện từ đơn NEW, mọi sự kiện hợp lệ.' },
  ],
  viDu: [{ input: "['pay', 'hold', 'release', 'ship', 'deliver']", output: 'pairs (T1,T3) (T3,T4) (T4,T5) (T5,T8)', explanation: 'Each consecutive two transitions form one pair.|||Mỗi hai chuyển đổi liên tiếp là một cặp.' }],
  goiY: ['Cặp bắt đầu bằng T1 (về PAID): (T1,T3) (T1,T5) (T1,T6); T3 (về ON_HOLD): (T3,T4) (T3,T7); T4 (về PAID): (T4,T3) (T4,T5) (T4,T6); T5: (T5,T8). Tổng 9.', 'Cặp kết thúc bằng T6, T7, T8 đi vào trạng thái cuối ⇒ mỗi cái kết thúc một chuỗi; (T1,T5) và (T4,T5) cần hai lần đi T5.'],
  loiHayGap: ['Đếm cả cặp đi ra từ trạng thái cuối (không có).', 'Quên cặp (T4,T3): hold lại sau khi release — cần vòng hold·release·hold.'],
  giaiThich: '<p>9 pairs. Five sequences suffice: pay·ship·deliver · pay·hold·release·hold·cancel · pay·cancel · pay·hold·release·cancel · pay·hold·release·ship·deliver.</p>',
  thuatNgu: [...tn('stateTransition'), { en: '1-switch coverage', vi: 'độ phủ 1-switch — mọi cặp hai chuyển đổi hợp lệ liên tiếp' }],
  khaiNiem: ['state transition testing', '1-switch coverage'],
  tep: {
    'answer.js': [
      "const PAIR_COUNT = 0;\n\nconst SEQUENCES1 = [\n  ['pay', 'ship', 'deliver'],\n];\n",
      "const PAIR_COUNT = 9; // (T1,T3) (T1,T5) (T1,T6) (T3,T4) (T3,T7) (T4,T3) (T4,T5) (T4,T6) (T5,T8)\n\nconst SEQUENCES1 = [\n  ['pay', 'ship', 'deliver'],                       // (T1,T5) (T5,T8)\n  ['pay', 'hold', 'release', 'hold', 'cancel'],    // (T1,T3) (T3,T4) (T4,T3) (T3,T7)\n  ['pay', 'cancel'],                                // (T1,T6)\n  ['pay', 'hold', 'release', 'cancel'],             // (T4,T6)\n  ['pay', 'hold', 'release', 'ship', 'deliver'],    // (T4,T5)\n];\n",
    ],
  },
  kiem: (() => {
    const CAP = ['T1,T3', 'T1,T5', 'T1,T6', 'T3,T4', 'T3,T7', 'T4,T3', 'T4,T5', 'T4,T6', 'T5,T8'];
    const chung = `const { buoc } = (${SIM.toString()})();
      if (!Array.isArray(SEQUENCES1) || !SEQUENCES1.length) return 'SEQUENCES1 must be a non-empty array of event arrays';
      const cap = new Set(); let loi = null;
      SEQUENCES1.forEach((q, k) => { if (loi) return; let s = 'NEW', truoc = null; (Array.isArray(q) ? q : []).forEach((e, i) => { if (loi) return; const t = buoc(s, e); if (!t) { loi = 'sequence #' + (k + 1) + ' step ' + (i + 1) + ': "' + e + '" is not valid in ' + s; return; } if (truoc) cap.add(truoc + ',' + t[0]); truoc = t[0]; s = t[3]; }); });`;
    return [
      kiemTuy({ en: 'PAIR_COUNT is right', vi: 'PAIR_COUNT đúng' }, new Function("return PAIR_COUNT === 9 ? 'OK' : 'not right — for each transition, count the transitions that leave its target state';")),
      kiemTuy({ en: 'Every sequence is valid', vi: 'Mọi chuỗi hợp lệ' }, new Function(`${chung} return loi || 'OK';`)),
      ...CAP.map((c) => kiemTuy({ en: `Pair (${c}) is covered`, vi: `Cặp (${c}) được phủ` }, new Function(`${chung} if (loi) return loi; return cap.has('${c}') ? 'OK' : 'pair (${c}) not covered yet';`))),
      kiemTuy({ en: 'At most 5 sequences', vi: 'Tối đa 5 chuỗi' }, new Function("return SEQUENCES1.length <= 5 ? 'OK' : SEQUENCES1.length + ' sequences — 5 are enough';")),
    ];
  })(),
});

export default doiDau({
  slug: 'swt301-blackbox-state-transition',
  ten: '4.5 State transition testing',
  moTaModule: 'Máy trạng thái đơn hàng (6 trạng thái, 8 chuyển đổi): bảng trạng thái, phủ 0-switch tối thiểu, test âm từ ô không hợp lệ, test lớp Order giết 7 mutant, câu hỏi ISTQB và phủ 1-switch.',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-state-transition',
  de: [E1, E2, E3, E4, E5, E6],
});

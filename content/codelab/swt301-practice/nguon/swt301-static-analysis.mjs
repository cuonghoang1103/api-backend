/**
 * SWT301 · 3.4 — Static analysis by tools (SWT3 slide 94–106): data flow (ur/dd/du), control flow, metrics (V(G) ba cách).
 */
import { doiDau, KHOA, hai, giai, lc, preSo, svg } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const MA1 = `int total(int[] prices, int qty) {
    int sum;
    int discount = 5;
    int tax = 10;
    discount = 10;
    for (int p : prices) {
        sum = sum + p * qty;
    }
    int unused = sum * 2;
    return sum;
}`;
const BT = ['ur', 'dd', 'du', 'dd and du', 'none'];
const E1 = tinhDe({
  tieuDe: 'Static analysis 1 — Find the data-flow anomalies (ur · dd · du)',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: `<p>Data-flow analysis follows every variable: <b>d</b> = defined (value stored), <b>u</b> = used (value read). Anomalies: <b>ur</b> — used while undefined (a real fault: Java refuses to compile it); <b>dd</b> — defined twice with no use in between; <b>du</b> — defined and then never used (the value is lost). Classify each variable of this method.</p>${preSo(MA1)}`,
    vi: `<p>Phân tích luồng dữ liệu theo dõi từng biến: <b>d</b> = gán giá trị, <b>u</b> = đọc giá trị. Bất thường: <b>ur</b> — dùng khi chưa có giá trị (lỗi thật: Java từ chối biên dịch); <b>dd</b> — gán hai lần mà chưa dùng; <b>du</b> — gán rồi không bao giờ dùng (giá trị mất). Phân loại từng biến của phương thức này.</p>${preSo(MA1)}`,
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Anomaly of each variable', 'Bất thường của từng biến'),
    cot: [{ ma: 'v', ten: 'Variable' }, { ma: 'a', ten: 'Anomaly', luaChon: BT }],
    hang: ['sum', 'discount', 'tax', 'unused', 'qty'].map((v) => ({ ma: v, o: { v } })),
    dapAn: { 'sum.a': 'ur', 'discount.a': 'dd and du', 'tax.a': 'du', 'unused.a': 'du', 'qty.a': 'none' },
    giaiThich: giai('sum is read on line 7 before any value is stored (ur — “variable sum might not have been initialized”). discount is defined on line 3, redefined on line 5 (dd) and never read (du). tax and unused are defined and never read (du). qty is a parameter (defined on entry) and is used on line 7.', 'sum được đọc ở dòng 7 trước khi có giá trị (ur). discount gán dòng 3, gán lại dòng 5 (dd) và không bao giờ đọc (du). tax và unused gán mà không đọc (du). qty là tham số (đã có giá trị khi vào hàm) và được dùng ở dòng 7.'),
  }],
  goiY: ['Viết chuỗi d/u cho từng biến theo thứ tự dòng: sum: (khai báo) → u ở dòng 7 trước d.', 'discount: d (3) → d (5) → hết hàm ⇒ dd rồi du.'],
  loiHayGap: ['Cho rằng int sum; là "định nghĩa" — khai báo không gán giá trị không phải d.', 'Bỏ sót dd vì chỉ nhìn biến cuối cùng có được dùng không.'],
  giaiThich: '<p>sum ur · discount dd and du · tax du · unused du · qty none.</p>',
  thuatNgu: [{ en: 'data-flow anomaly', vi: 'bất thường luồng dữ liệu' }, { en: 'define / use', vi: 'gán / dùng (đọc) giá trị' }],
  khaiNiem: ['static analysis', 'data flow analysis'],
});

const MA2 = `int classify(int x) {
    while (true) {
        if (x > 0) return 1;
        if (x < 0) return -1;
    }
    return 0;
}`;
const E2 = tinhDe({
  tieuDe: 'Static analysis 2 — Control-flow findings: unreachable code and an infinite loop',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: `<p>Control-flow analysis looks at the paths of the flow graph. Typical findings: unreachable code, infinite loops, multiple loop entries, unstructured jumps. Examine this method.</p>${preSo(MA2)}`, vi: `<p>Phân tích luồng điều khiển xét các đường của đồ thị luồng. Phát hiện điển hình: mã không bao giờ tới được, vòng lặp vô hạn, vòng lặp nhiều lối vào, nhảy không cấu trúc. Hãy xem phương thức này.</p>${preSo(MA2)}` },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Findings', 'Phát hiện'),
    cot: [{ ma: 'q', ten: 'Question' }, { ma: 'a', ten: 'Answer' }],
    hang: [{ ma: 'r1', o: { q: 'Line number of the unreachable statement' } }, { ma: 'r2', o: { q: 'The value of x that never terminates' } }, { ma: 'r3', o: { q: 'How many of the three return statements can ever execute?' } }],
    dapAn: { 'r1.a': '6', 'r2.a': '0', 'r3.a': '2' },
    giaiThich: giai('while (true) never exits normally, so “return 0” on line 6 is unreachable (javac reports it as an error). For x = 0 neither IF returns and the loop spins forever.', 'while (true) không bao giờ thoát bình thường nên “return 0” dòng 6 không tới được (javac báo lỗi). Với x = 0 không IF nào trả về và vòng lặp chạy mãi.'),
  }],
  goiY: ['Lệnh sau một vòng while (true) không có break thì không tới được.', 'Giá trị nào không lớn hơn 0 cũng không nhỏ hơn 0?'],
  loiHayGap: ['Cho rằng "return 0" chạy khi x = 0.', 'Nghĩ trình biên dịch không phát hiện được mã không tới được.'],
  giaiThich: '<p>6 · 0 · 2.</p>',
  thuatNgu: [{ en: 'unreachable code', vi: 'mã không bao giờ tới được' }, { en: 'infinite loop', vi: 'vòng lặp vô hạn' }],
  khaiNiem: ['static analysis', 'control flow analysis'],
});

const CFG3 = svg({
  w: 520, h: 360, tieuDe: 'A control-flow graph (IF-ELSE followed by a WHILE loop)',
  nut: [
    { id: '1', x: 260, y: 40, hinh: 'tron', nhan: '1' }, { id: '2', x: 260, y: 100, hinh: 'tron', nhan: '2' },
    { id: '3', x: 170, y: 160, hinh: 'tron', nhan: '3' }, { id: '4', x: 350, y: 160, hinh: 'tron', nhan: '4' },
    { id: '5', x: 260, y: 220, hinh: 'tron', nhan: '5' }, { id: '6', x: 400, y: 280, hinh: 'tron', nhan: '6' },
    { id: '7', x: 260, y: 320, hinh: 'tron', nhan: '7' },
  ],
  canh: [
    { tu: '1', den: '2' }, { tu: '2', den: '3' }, { tu: '2', den: '4' }, { tu: '3', den: '5' }, { tu: '4', den: '5' },
    { tu: '5', den: '6', cong: 25 }, { tu: '6', den: '5', cong: 25 }, { tu: '5', den: '7' },
  ],
  chu: [{ x: 260, y: 165, nhan: 'R1', co: 12, dam: true }, { x: 345, y: 240, nhan: 'R2', co: 12, dam: true }, { x: 470, y: 60, nhan: 'R3 (outside)', co: 12, dam: true }],
});
const E3 = tinhDe({
  tieuDe: 'Static analysis 3 — Cyclomatic complexity three ways',
  doKho: 'EASY', phut: 6,
  moTa: { en: `<p>V(G) can be computed as E − N + 2, as the number of binary decisions + 1, or as the number of regions of the planar graph (including the outside region). All three must agree.</p>${CFG3}`, vi: `<p>V(G) tính được bằng E − N + 2, bằng số quyết định nhị phân + 1, hoặc bằng số miền của đồ thị phẳng (kể cả miền bên ngoài). Cả ba phải trùng nhau.</p>${CFG3}` },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Metrics of the graph', 'Chỉ số của đồ thị'),
    cot: [{ ma: 'q', ten: 'Quantity' }, { ma: 'a', ten: 'Value' }],
    hang: [{ ma: 'e', o: { q: 'Edges E' } }, { ma: 'n', o: { q: 'Nodes N' } }, { ma: 'v1', o: { q: 'V(G) = E − N + 2' } }, { ma: 'd', o: { q: 'Decision nodes (two or more exits)' } }, { ma: 'v2', o: { q: 'V(G) = decisions + 1' } }, { ma: 'r', o: { q: 'Regions (including the outside)' } }],
    dapAn: { 'e.a': '8', 'n.a': '7', 'v1.a': '3', 'd.a': '2', 'v2.a': '3', 'r.a': '3' },
    giaiThich: giai('8 − 7 + 2 = 3; nodes 2 and 5 have two exits → 2 + 1 = 3; the IF-ELSE encloses R1, the loop encloses R2, plus the outside region R3 = 3.', '8 − 7 + 2 = 3; node 2 và 5 có hai lối ra → 2 + 1 = 3; IF-ELSE bao miền R1, vòng lặp bao R2, cộng miền ngoài R3 = 3.'),
  }],
  goiY: ['Đếm cả hai cạnh 5→6 và 6→5 của vòng lặp.', 'Miền: mỗi vòng kín một miền, cộng miền bên ngoài.'],
  loiHayGap: ['Quên miền bên ngoài.', 'Đếm node 5 là hai quyết định.'],
  giaiThich: '<p>E 8 · N 7 · V(G) 3 · decisions 2 · V(G) 3 · regions 3.</p>',
  thuatNgu: [{ en: 'region', vi: 'miền — vùng bị các cạnh bao kín trên đồ thị phẳng' }],
  khaiNiem: ['cyclomatic complexity'],
});

const E4 = tinhDe({
  tieuDe: 'Static analysis 4 — What static analysis tools do (and do not do)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Five questions on static analysis tools: what they find, who uses them and when, and their limits (false positives).</p>', vi: '<p>Năm câu về công cụ phân tích tĩnh: tìm được gì, ai dùng và dùng khi nào, và giới hạn (cảnh báo nhầm).</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', nhieu: true, de: hai('Which TWO defects can static analysis tools typically find?', 'HAI loại lỗi nào công cụ phân tích tĩnh thường tìm được?'), luaChon: lc(['a', 'Variables referenced before a value is assigned'], ['b', 'A slow response when 500 users log in together'], ['c', 'Code that can never be reached'], ['d', 'A missing business requirement nobody wrote down']), dapAn: [['a', 'c']], giaiThich: giai('Data-flow and control-flow faults are visible in the code. Performance needs execution; a missing requirement is found by reviews with stakeholders.', 'Lỗi luồng dữ liệu và luồng điều khiển nhìn thấy trong mã. Hiệu năng cần chạy; yêu cầu bị thiếu do review với các bên liên quan tìm.') },
    { ma: 'q2', de: hai('Who typically runs static analysis tools, and when?', 'Ai thường chạy công cụ phân tích tĩnh, và khi nào?'), luaChon: lc(['a', 'End users, after release'], ['b', 'Developers — before and during component and integration testing, and in the CI pipeline at check-in'], ['c', 'Only testers during acceptance testing'], ['d', 'Only auditors']), dapAn: ['b'], giaiThich: giai('IDE plugins (SonarLint), build tools and CI gates (SonarQube quality gates) run them on every change.', 'Plugin IDE (SonarLint), công cụ build và cổng CI (quality gate SonarQube) chạy chúng mỗi lần đổi mã.') },
    { ma: 'q3', de: hai('A static analysis tool reports 300 warnings on a legacy module. What is the best first step?', 'Công cụ phân tích tĩnh báo 300 cảnh báo cho một mô-đun cũ. Bước đầu tiên tốt nhất là gì?'), luaChon: lc(['a', 'Fix all 300 immediately'], ['b', 'Turn the tool off'], ['c', 'Triage: configure the rules, filter false positives, fix the high-severity findings first'], ['d', 'Ignore them because the module works']), dapAn: ['c'], giaiThich: giai('Tools produce false positives and low-value noise; rules must be tuned and findings prioritised (a known risk of tool introduction).', 'Công cụ có cảnh báo nhầm và nhiễu ít giá trị; cần tinh chỉnh luật và ưu tiên phát hiện (rủi ro đã biết khi đưa công cụ vào).') },
    { ma: 'q4', de: hai('Which statement about compilers is TRUE?', 'Phát biểu nào về trình biên dịch là ĐÚNG?'), luaChon: lc(['a', 'A compiler is a dynamic testing tool'], ['b', 'A compiler performs some static analysis (syntax, types, definite assignment, unreachable code)'], ['c', 'Compilers find every defect'], ['d', 'Compilers execute the program to check it']), dapAn: ['b'], giaiThich: giai('javac rejects “might not have been initialized” and “unreachable statement” — static checks.', 'javac từ chối “might not have been initialized” và “unreachable statement” — đều là kiểm tĩnh.') },
    { ma: 'q5', de: hai('Which metric does static analysis use to flag code that is hard to test and maintain?', 'Chỉ số nào phân tích tĩnh dùng để cảnh báo mã khó test và bảo trì?'), luaChon: lc(['a', 'Number of testers'], ['b', 'Cyclomatic complexity (and nesting depth, size)'], ['c', 'Response time'], ['d', 'Defect density in production']), dapAn: ['b'], giaiThich: giai('High V(G) means many independent paths: more tests needed, higher defect risk.', 'V(G) cao nghĩa là nhiều đường độc lập: cần nhiều test hơn, rủi ro lỗi cao hơn.') },
  ],
  goiY: ['Tĩnh: thấy được trong mã; động: cần chạy.', 'Công cụ có cảnh báo nhầm — cần phân loại.'],
  loiHayGap: ['Chọn hiệu năng là thứ phân tích tĩnh tìm được.', 'Cho rằng phải sửa hết mọi cảnh báo ngay.'],
  giaiThich: '<p>Answers: a+c · b · c · b · b.</p>',
  thuatNgu: [{ en: 'false positive', vi: 'cảnh báo nhầm — báo lỗi ở chỗ không có lỗi' }, { en: 'quality gate', vi: 'cổng chất lượng — điều kiện CI phải đạt mới được merge' }],
  khaiNiem: ['static analysis tools'],
});

export default doiDau({
  slug: 'swt301-static-analysis',
  ten: '3.4 Static analysis by tools',
  moTaModule: 'Phân tích tĩnh: bất thường luồng dữ liệu ur/dd/du, phát hiện luồng điều khiển (mã không tới được, vòng lặp vô hạn), V(G) ba cách (E − N + 2, quyết định + 1, số miền), công cụ và giới hạn (cảnh báo nhầm).',
  khoa: KHOA,
  baiHoc: 'swt301-static-analysis',
  de: [E1, E2, E3, E4],
});

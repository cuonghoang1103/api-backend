/** PRO192 · L.1 🎓 LAB211 J1.S.P0011 Change Base Number System (100 LOC) — hai thuật toán đổi hệ tự viết, CRUD ở controller. Nguồn: gen/lab/l211-p0011. */
import { moDun, deLab, c } from './_chung.mjs';

const de = deLab('l211-p0011', {
  tieuDe: { en: 'L.1 — LAB211 J1.S.P0011: Change Base Number System (BIN, DEC, HEX)', vi: 'L.1 — LAB211 J1.S.P0011: Đổi hệ cơ số (BIN, DEC, HEX)' },
  phut: 120,
  khaiNiem: ['any base → decimal: result = result × base + digit', 'decimal → any base: repeated division, remainders read upwards', 'enum Base in constants', 'controller holds the repository, service only converts', 'overflow of long'],
  moTa: {
    en: `<p><b>J1.S.P0011 (100 LOC).</b> Choose the base of the input (1 binary, 2 decimal, 3 hexadecimal; 0 = exit), the base of the output, type a value, print the same number in the other base — ${c('535 (DEC) = 217 (HEX)')} — and show the menu again. Both conversions are <b>written by hand</b> through decimal (${c('Integer.parseInt(s, 16)')} / ${c('Long.toString(n, 2)')} skip what the lab is testing): any base → decimal by "result = result × base + digit", decimal → any base by dividing again and again and reading the remainders from the bottom up. A sign (+/−) is allowed, lower-case hex digits count, leading zeros disappear, a value too large for ${c('long')} is refused.</p>
<p>Every wrong input says what is wrong and what to type: a menu choice that is not a number or out of range is asked again; a blank value is asked again; a digit that does not belong to the input base ("1G" in HEX, "2" in BIN) prints the allowed digits and goes back to the menu. Layering the lecturer asked for on 26/10: ${c('ConvertController')} stores the number in ${c('BaseNumberRepository')} (CRUD), passes it to ${c('ConvertService')} (conversion only — it never touches the repository), then gives the result to ${c('ConvertView')}.</p>`,
    vi: `<p><b>J1.S.P0011 (100 LOC).</b> Chọn hệ của giá trị vào (1 nhị phân, 2 thập phân, 3 thập lục phân; 0 = thoát), chọn hệ ra, gõ một giá trị, in cùng con số đó ở hệ kia — ${c('535 (DEC) = 217 (HEX)')} — rồi hiện lại menu. Cả hai phép đổi <b>tự viết</b> qua hệ thập phân (${c('Integer.parseInt(s, 16)')} / ${c('Long.toString(n, 2)')} là bỏ qua đúng thứ bài kiểm): hệ bất kỳ → thập phân bằng "kết quả = kết quả × cơ số + chữ số", thập phân → hệ bất kỳ bằng chia liên tiếp và đọc số dư từ dưới lên. Cho phép dấu (+/−), chữ số hex viết thường vẫn tính, số 0 đứng đầu biến mất, số quá lớn so với ${c('long')} bị từ chối.</p>
<p>Mọi lần nhập sai đều nói rõ sai gì và phải nhập gì: lựa chọn menu không phải số hoặc ngoài khoảng thì hỏi lại; giá trị trống thì hỏi lại; chữ số không thuộc hệ vào ("1G" ở HEX, "2" ở BIN) thì in các chữ số được phép rồi quay về menu. Cách chia tầng thầy yêu cầu ngày 26/10: ${c('ConvertController')} lưu con số vào ${c('BaseNumberRepository')} (CRUD), đưa cho ${c('ConvertService')} (chỉ đổi hệ — không bao giờ đụng repository), rồi đưa kết quả cho ${c('ConvertView')}.</p>`,
  },
  thay: [['535', '4096'], ['217', '1000'], ['11011', '101101'], ['27', '45'], ['ff', '7e'], ['007', '00042'], ['1G', '12Z']],
  menuRac: '2\n1\n255', menuThoat: '0',
  ca: [
    { ten: { en: 'the long boundary (7FFFFFFFFFFFFFFF), one past it, signs and a sign alone', vi: 'biên của long (7FFFFFFFFFFFFFFF), vượt một đơn vị, dấu và dấu đứng một mình' }, vao: '2\n3\n9223372036854775807\n3\n2\n7fffffffffffffff\n3\n2\n8000000000000000\n1\n3\n-1010\n2\n2\n+15\n2\n1\n-\n3\n3\nABCDEF\n0\n', an: true },
  ],
  goiY: [
    { en: 'Keep the digit string "0123456789ABCDEF" in Constants: the value of a digit is its indexOf, and the digits allowed in base b are its first b characters.', vi: 'Giữ chuỗi chữ số "0123456789ABCDEF" trong Constants: giá trị một chữ số là indexOf của nó, các chữ số được phép ở hệ b là b ký tự đầu.' },
    { en: 'Overflow: before result = result × base + digit, check result > (Long.MAX_VALUE − digit) / base.', vi: 'Tràn số: trước khi kết quả = kết quả × cơ số + chữ số, kiểm kết quả > (Long.MAX_VALUE − chữ số) / cơ số.' },
    { en: 'Decimal → base: append each remainder to a StringBuilder and reverse() once at the end; 0 is a special case ("0").', vi: 'Thập phân → hệ khác: nối từng số dư vào StringBuilder rồi reverse() một lần ở cuối; 0 là trường hợp riêng ("0").' },
  ],
  loiHayGap: [
    { en: 'The service creates its own repository and calls save()/findLast() — exactly what the lecturer rejected on 26/10 (rule T3).', vi: 'Service tự tạo repository rồi gọi save()/findLast() — đúng thứ thầy trả lại ngày 26/10 (luật T3).' },
    { en: 'Converting with Integer.parseInt / Integer.toBinaryString — the output may match, but the review asks you to explain the algorithm you wrote.', vi: 'Đổi bằng Integer.parseInt / Integer.toBinaryString — output có thể khớp, nhưng buổi review bắt bạn giải thích thuật toán mình viết.' },
    { en: 'Forgetting the sign: "-27" must give "-11011", and "-" alone is not a number.', vi: 'Quên dấu: "-27" phải ra "-11011", và "-" đứng một mình không phải số.' },
  ],
  giaiThich: { en: '<p>The reference is the course’s P0011 after the 26/10 review (lint.py clean, checklist 0 violations, real JDK 8). Every road goes through decimal, so two algorithms cover all nine pairs and adding base 8 later is one line of the enum.</p>', vi: '<p>Lời giải là P0011 của khoá sau buổi review 26/10 (sạch lint.py, tờ checklist 0 vi phạm, JDK 8 thật). Mọi đường đều qua hệ thập phân, nên hai thuật toán phủ đủ chín cặp và thêm hệ 8 sau này chỉ là một dòng của enum.</p>' },
});

export default moDun({ slug: 'pro192-lab211-p0011-change-base-number', ten: 'L.1 🎓 LAB211 J1.S.P0011 — Change Base Number System', de: [de] });

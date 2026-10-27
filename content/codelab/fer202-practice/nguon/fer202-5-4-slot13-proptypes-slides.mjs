/**
 * FER202 · 5.6 — Slide check: Validating component properties / PropTypes (Slot 13). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-5-4-slot13-proptypes-slides',
  ten: '5.6 Slide check — PropTypes',
  khoa: KHOA,
  baiHoc: 'fer202-5-4-slot13-proptypes-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: validating props with PropTypes',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['PropTypes', 'isRequired', 'shape', 'oneOf', 'custom validator'], the: ['proptypes', 'quiz'],
      moTa: {
        en: '<p>Eight questions on Slot 13 — PropTypes validators, required props and default values.</p>',
        vi: '<p>Tám câu về Slot 13 — các validator PropTypes, prop bắt buộc và giá trị mặc định.</p>',
      },
      goiY: ['PropTypes chỉ chạy ở development và chỉ cảnh báo.', 'Tên thuộc tính là propTypes (p thường); thư viện là PropTypes (P hoa).'],
      loiHayGap: ['Nghĩ PropTypes chặn app chạy khi sai kiểu.', 'Nhầm <code>PropTypes.array</code> với <code>PropTypes.arrayOf(...)</code>.'],
      giaiThich: '<p>Xem giải thích sau khi nộp.</p>',
      thuatNgu: [{ en: 'warning', vi: 'cảnh báo (không phải lỗi)' }],
      cauHoi: [
        q('q1', 'What happens when a prop fails its PropTypes check in development?', [['a', 'The app crashes'], ['b', 'A warning is printed in the console; rendering continues'], ['c', 'The prop is removed'], ['d', 'Nothing']], ['b'], 'PropTypes only warns (and only in development builds).|||PropTypes chỉ cảnh báo (và chỉ ở bản development).'),
        q('q2', 'Correct declaration?', [['a', '<code>Card.PropTypes = {…}</code>'], ['b', '<code>Card.propTypes = { title: PropTypes.string }</code>'], ['c', '<code>propTypes(Card, {…})</code>'], ['d', '<code>Card.types = {…}</code>']], ['b'], 'Static property <code>propTypes</code>, values from the <code>PropTypes</code> library.|||Thuộc tính tĩnh propTypes, giá trị lấy từ thư viện PropTypes.'),
        q('q3', 'Validate an array of numbers:', [['a', '<code>PropTypes.array</code>'], ['b', '<code>PropTypes.arrayOf(PropTypes.number)</code>'], ['c', '<code>PropTypes.number[]</code>'], ['d', '<code>PropTypes.list(Number)</code>']], ['b'], 'arrayOf checks every element.|||arrayOf kiểm từng phần tử.'),
        q('q4', 'An object with known keys is validated with…', [['a', '<code>PropTypes.object</code>'], ['b', '<code>PropTypes.shape({ … })</code>'], ['c', '<code>PropTypes.instanceOf(Object)</code>'], ['d', '<code>PropTypes.any</code>']], ['b'], 'shape describes each key; exact() also rejects extra keys.|||shape mô tả từng khoá; exact() còn từ chối khoá thừa.'),
        q('q5', 'Allow only "primary", "secondary" or "danger":', [['a', '<code>PropTypes.oneOf([\'primary\', \'secondary\', \'danger\'])</code>'], ['b', '<code>PropTypes.string</code>'], ['c', '<code>PropTypes.enum</code>'], ['d', '<code>PropTypes.oneOfType([…])</code>']], ['a'], 'oneOf = one of these values; oneOfType = one of these types.|||oneOf = một trong các giá trị; oneOfType = một trong các kiểu.'),
        q('q6', 'Make a prop mandatory:', [['a', 'add <code>.isRequired</code>'], ['b', 'add <code>.required()</code>'], ['c', 'use <code>PropTypes.must</code>'], ['d', 'it is mandatory by default']], ['a'], 'e.g. <code>PropTypes.string.isRequired</code>.|||vd PropTypes.string.isRequired.'),
        q('q7', 'A custom validator should…', [['a', 'throw an Error'], ['b', 'return an Error when invalid, null otherwise'], ['c', 'return true/false'], ['d', 'call console.error']], ['b'], 'Signature <code>(props, propName, componentName) =&gt; Error | null</code>.|||Dạng (props, propName, componentName) => Error | null.'),
        q('q8', 'Modern way to give a function component a default prop value?', [['a', '<code>Comp.defaultProps</code> only'], ['b', 'Default value in the destructured parameter: <code>({ size = \'md\' })</code>'], ['c', '<code>PropTypes.default</code>'], ['d', 'Not possible']], ['b'], 'defaultProps on function components is deprecated (removed in React 19).|||defaultProps cho function component đã bị khuyến cáo bỏ (React 19 bỏ hẳn).'),
      ],
    }),
  ],
});

/**
 * ============================================================
 * TỪ ĐIỂN ĐỌC MẪU — thuật ngữ tiếng Anh trong câu giảng bài
 * ============================================================
 *
 * Dùng cho các mục `giang-*` của xưởng giọng (services/tts/kichban.py):
 * mỗi thuật ngữ có phiên âm IPA (Mỹ), cách đọc gần đúng cho người Việt,
 * chữ để trình duyệt đọc mẫu, và cách tách âm cho nút 🐢.
 *
 * ⚠️ KHOÁ PHẢI KHỚP `TU_ANH` TRONG `services/tts/kichban.py`.
 * Python giữ danh sách để gắn `tuAnh` vào từng câu; file này giữ cách đọc.
 * Thiếu khoá ở đây thì câu vẫn thu được, chỉ mất nút nghe mẫu của từ đó.
 *
 * ── Các trường ──
 * ipa   phiên âm IPA giọng Mỹ (General American).
 * viet  cách đọc gần đúng bằng âm tiết Việt. Từ nào có trong
 *       ~/Documents/video-bai-giang/giong/doc-tay.json thì lấy ĐÚNG cách chủ
 *       kênh đã chọn bằng tai (đánh dấu `daChon`).
 * noi   chữ đưa cho speechSynthesis đọc (mặc định = chính từ). Viết tắt
 *       phải tách chữ ("J S X"), từ ghép kiểu code phải tách từ ("use State")
 *       — không thì giọng máy đọc liền một cục hoặc đánh vần lung tung.
 * tach  các phần để nút 🐢 đọc từng phần, nghỉ giữa các phần.
 * nhan  cách viết khác mà Whisper có thể nhả ra khi nghe ĐÚNG (vd JSON →
 *       "Jason"). Chỉ thêm khi chính âm đó là cách đọc đúng — thêm bừa là
 *       chấm ✓ cho cả bản đọc sai.
 */

export interface TuAnh {
  ipa: string;
  viet: string;
  noi?: string;
  tach?: string[];
  nhan?: string[];
  /** `viet` lấy từ doc-tay.json — cách chủ kênh đã chọn. */
  daChon?: boolean;
  nhom: 'react' | 'html' | 'css' | 'js' | 'web';
}

export const NHOM_TU: Record<TuAnh['nhom'], string> = {
  react: 'React / FER202',
  js: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  web: 'Web, công cụ, Git',
};

export const TU_ANH: Record<string, TuAnh> = {
  // ── React / FER202 ─────────────────────────────────────
  React: { ipa: '/riˈækt/', viet: 'ri-ác', daChon: true, nhom: 'react' },
  JSX: { ipa: '/ˌdʒeɪ es ˈeks/', viet: 'giây ét ích', noi: 'J S X', tach: ['J', 'S', 'X'], daChon: true, nhom: 'react' },
  component: { ipa: '/kəmˈpoʊnənt/', viet: 'com-pô-nừn', tach: ['com', 'po', 'nent'], daChon: true, nhom: 'react' },
  props: { ipa: '/prɑːps/', viet: 'pờ-rốp', nhan: ['prop'], daChon: true, nhom: 'react' },
  state: { ipa: '/steɪt/', viet: 'xtết', daChon: true, nhom: 'react' },
  useState: { ipa: '/juːz steɪt/', viet: 'diu xtết', noi: 'use State', tach: ['use', 'State'], daChon: true, nhom: 'react' },
  useEffect: { ipa: '/juːz ɪˈfekt/', viet: 'diu i-phéc', noi: 'use Effect', tach: ['use', 'Effect'], daChon: true, nhom: 'react' },
  useContext: { ipa: '/juːz ˈkɑːntekst/', viet: 'diu con-tếch', noi: 'use Context', tach: ['use', 'Context'], daChon: true, nhom: 'react' },
  useRef: { ipa: '/juːz ref/', viet: 'diu rép', noi: 'use Ref', tach: ['use', 'Ref'], daChon: true, nhom: 'react' },
  useReducer: { ipa: '/juːz rɪˈduːsər/', viet: 'diu ri-điu-xơ', noi: 'use Reducer', tach: ['use', 'Reducer'], daChon: true, nhom: 'react' },
  useMemo: { ipa: '/juːz ˈmemoʊ/', viet: 'diu mem-mô', noi: 'use Memo', tach: ['use', 'Memo'], daChon: true, nhom: 'react' },
  useCallback: { ipa: '/juːz ˈkɔːlbæk/', viet: 'diu con-béc', noi: 'use Callback', tach: ['use', 'Call', 'back'], daChon: true, nhom: 'react' },
  useNavigate: { ipa: '/juːz ˈnævɪɡeɪt/', viet: 'diu na-vi-gết', noi: 'use Navigate', tach: ['use', 'Navi', 'gate'], daChon: true, nhom: 'react' },
  useParams: { ipa: '/juːz pəˈræmz/', viet: 'diu pa-ram', noi: 'use Params', tach: ['use', 'Params'], daChon: true, nhom: 'react' },
  hook: { ipa: '/hʊk/', viet: 'húc', nhan: ['hooks'], daChon: true, nhom: 'react' },
  render: { ipa: '/ˈrendər/', viet: 'ren-đơ', daChon: true, nhom: 'react' },
  Redux: { ipa: '/riˈdʌks/', viet: 'ri-đắc', tach: ['Re', 'dux'], daChon: true, nhom: 'react' },
  store: { ipa: '/stɔːr/', viet: 'xto', daChon: true, nhom: 'react' },
  reducer: { ipa: '/rɪˈduːsər/', viet: 'ri-điu-xơ', tach: ['re', 'du', 'cer'], daChon: true, nhom: 'react' },
  action: { ipa: '/ˈækʃən/', viet: 'ác-sần', daChon: true, nhom: 'react' },
  dispatch: { ipa: '/dɪˈspætʃ/', viet: 'đít-pát', tach: ['dis', 'patch'], daChon: true, nhom: 'react' },
  Router: { ipa: '/ˈraʊtər/', viet: 'rao-tơ', daChon: true, nhom: 'react' },
  Route: { ipa: '/ruːt/ hoặc /raʊt/', viet: 'rút (hoặc rao-t)', nhom: 'react' },
  Link: { ipa: '/lɪŋk/', viet: 'linh-k', nhom: 'react' },
  Outlet: { ipa: '/ˈaʊtlet/', viet: 'ao-lét', tach: ['Out', 'let'], nhom: 'react' },
  Provider: { ipa: '/prəˈvaɪdər/', viet: 'pờ-rô-vai-đơ', tach: ['pro', 'vi', 'der'], daChon: true, nhom: 'react' },
  Context: { ipa: '/ˈkɑːntekst/', viet: 'con-tếch', daChon: true, nhom: 'react' },
  children: { ipa: '/ˈtʃɪldrən/', viet: 'chin-đrừn', daChon: true, nhom: 'react' },
  Bootstrap: { ipa: '/ˈbuːtstræp/', viet: 'bút-xtráp', tach: ['Boot', 'strap'], daChon: true, nhom: 'react' },
  'React-Bootstrap': { ipa: '/riˈækt ˈbuːtstræp/', viet: 'ri-ác bút-xtráp', noi: 'React Bootstrap', tach: ['React', 'Boot', 'strap'], daChon: true, nhom: 'react' },
  Navbar: { ipa: '/ˈnævbɑːr/', viet: 'náp-ba', tach: ['Nav', 'bar'], nhan: ['nav bar'], daChon: true, nhom: 'react' },
  Card: { ipa: '/kɑːrd/', viet: 'cát', daChon: true, nhom: 'react' },
  Modal: { ipa: '/ˈmoʊdəl/', viet: 'mô-đồ', daChon: true, nhom: 'react' },
  Container: { ipa: '/kənˈteɪnər/', viet: 'cần-tây-nơ', tach: ['con', 'tai', 'ner'], nhom: 'react' },
  Vite: { ipa: '/viːt/', viet: 'vít', noi: 'veet', nhan: ['veet', 'vit'], daChon: true, nhom: 'react' },
  'Virtual DOM': { ipa: '/ˈvɜːrtʃuəl dɑːm/', viet: 'vơ-chu-ồ đom', noi: 'virtual dom', tach: ['vir', 'tual', 'DOM'], daChon: true, nhom: 'react' },
  Suspense: { ipa: '/səˈspens/', viet: 'xơ-xpen', tach: ['sus', 'pense'], daChon: true, nhom: 'react' },
  lazy: { ipa: '/ˈleɪzi/', viet: 'lây-di', daChon: true, nhom: 'react' },
  key: { ipa: '/kiː/', viet: 'ki', daChon: true, nhom: 'react' },
  onClick: { ipa: '/ɑːn klɪk/', viet: 'ón cờ-líc', noi: 'on Click', tach: ['on', 'Click'], daChon: true, nhom: 'react' },
  onChange: { ipa: '/ɑːn tʃeɪndʒ/', viet: 'ón chên', noi: 'on Change', tach: ['on', 'Change'], daChon: true, nhom: 'react' },
  onSubmit: { ipa: '/ɑːn səbˈmɪt/', viet: 'ón sấp-mít', noi: 'on Submit', tach: ['on', 'Sub', 'mit'], daChon: true, nhom: 'react' },
  'Next.js': { ipa: '/nekst dɑːt ˌdʒeɪ ˈes/', viet: 'nếch chấm di ét', noi: 'Next dot J S', tach: ['Next', 'dot', 'J', 'S'], nhan: ['nextjs'], daChon: true, nhom: 'react' },
  TypeScript: { ipa: '/ˈtaɪpskrɪpt/', viet: 'tai-xcríp', tach: ['Type', 'Script'], daChon: true, nhom: 'react' },
  'export default': { ipa: '/ˈekspɔːrt dɪˈfɔːlt/', viet: 'ếch-pót đi-phôn', tach: ['export', 'de', 'fault'], daChon: true, nhom: 'react' },
  spread: { ipa: '/spred/', viet: 'xprét', daChon: true, nhom: 'react' },
  destructuring: { ipa: '/diːˈstrʌktʃərɪŋ/', viet: 'đi-xtrắc-chơ-rinh', tach: ['de', 'struc', 'tur', 'ing'], daChon: true, nhom: 'react' },
  'arrow function': { ipa: '/ˈæroʊ ˈfʌŋkʃən/', viet: 'e-rô phăng-sần', tach: ['arrow', 'func', 'tion'], daChon: true, nhom: 'react' },
  'template literal': { ipa: '/ˈtemplət ˈlɪtərəl/', viet: 'tem-plịt li-tơ-rồ', tach: ['tem', 'plate', 'lit', 'er', 'al'], daChon: true, nhom: 'react' },

  // ── JavaScript ────────────────────────────────────────
  JavaScript: { ipa: '/ˈdʒɑːvəskrɪpt/', viet: 'gia-va-xcríp', tach: ['Java', 'Script'], nhan: ['java script'], daChon: true, nhom: 'js' },
  const: { ipa: '/kɑːnst/', viet: 'con-xờ', daChon: true, nhom: 'js' },
  let: { ipa: '/let/', viet: 'lét', daChon: true, nhom: 'js' },
  var: { ipa: '/vɑːr/', viet: 'va', nhom: 'js' },
  function: { ipa: '/ˈfʌŋkʃən/', viet: 'phăng-sần', tach: ['func', 'tion'], daChon: true, nhom: 'js' },
  return: { ipa: '/rɪˈtɜːrn/', viet: 'ri-tơn', tach: ['re', 'turn'], nhom: 'js' },
  async: { ipa: '/ˈeɪsɪŋk/', viet: 'ây-xinh', tach: ['a', 'sync'], daChon: true, nhom: 'js' },
  await: { ipa: '/əˈweɪt/', viet: 'ơ-guết', tach: ['a', 'wait'], daChon: true, nhom: 'js' },
  Promise: { ipa: '/ˈprɑːmɪs/', viet: 'pờ-rô-mít', tach: ['Prom', 'ise'], daChon: true, nhom: 'js' },
  fetch: { ipa: '/fetʃ/', viet: 'phét', daChon: true, nhom: 'js' },
  then: { ipa: '/ðen/', viet: 'đen (lưỡi chạm răng)', nhom: 'js' },
  catch: { ipa: '/kætʃ/', viet: 'két-ch', nhom: 'js' },
  try: { ipa: '/traɪ/', viet: 'trai', nhom: 'js' },
  array: { ipa: '/əˈreɪ/', viet: 'ơ-rây', daChon: true, nhom: 'js' },
  object: { ipa: '/ˈɑːbdʒekt/', viet: 'óp-giếch', tach: ['ob', 'ject'], daChon: true, nhom: 'js' },
  map: { ipa: '/mæp/', viet: 'máp', daChon: true, nhom: 'js' },
  filter: { ipa: '/ˈfɪltər/', viet: 'phin-tơ', daChon: true, nhom: 'js' },
  reduce: { ipa: '/rɪˈduːs/', viet: 'ri-đút', tach: ['re', 'duce'], nhom: 'js' },
  forEach: { ipa: '/fɔːr iːtʃ/', viet: 'pho ích', noi: 'for Each', tach: ['for', 'Each'], nhan: ['for each'], nhom: 'js' },
  event: { ipa: '/ɪˈvent/', viet: 'i-ven', daChon: true, nhom: 'js' },
  click: { ipa: '/klɪk/', viet: 'cờ-líc', nhom: 'js' },
  DOM: { ipa: '/dɑːm/', viet: 'đom', daChon: true, nhom: 'js' },
  querySelector: { ipa: '/ˈkwɪri səˈlektər/', viet: 'quơ-ri xơ-léc-tơ', noi: 'query Selector', tach: ['query', 'Se', 'lec', 'tor'], nhom: 'js' },
  addEventListener: { ipa: '/æd ɪˈvent ˈlɪsənər/', viet: 'át i-ven li-xơ-nơ', noi: 'add Event Listener', tach: ['add', 'Event', 'Lis', 'ten', 'er'], nhom: 'js' },
  getElementById: { ipa: '/ɡet ˈelɪmənt baɪ ˌaɪ ˈdiː/', viet: 'ghét e-lơ-mần bai ai-đi', noi: 'get Element By I D', tach: ['get', 'Element', 'By', 'I', 'D'], nhom: 'js' },
  'console.log': { ipa: '/ˈkɑːnsoʊl lɔːɡ/', viet: 'con-xâu lóc', noi: 'console dot log', tach: ['con', 'sole', 'dot', 'log'], nhan: ['console log'], nhom: 'js' },
  setTimeout: { ipa: '/set ˈtaɪmaʊt/', viet: 'xét tai-mao', noi: 'set Timeout', tach: ['set', 'Time', 'out'], nhom: 'js' },
  callback: { ipa: '/ˈkɔːlbæk/', viet: 'côn-béc', tach: ['call', 'back'], daChon: true, nhom: 'js' },
  string: { ipa: '/strɪŋ/', viet: 'xtring', daChon: true, nhom: 'js' },
  number: { ipa: '/ˈnʌmbər/', viet: 'nằm-bơ', nhom: 'js' },
  boolean: { ipa: '/ˈbuːliən/', viet: 'bu-li-ừn', daChon: true, nhom: 'js' },
  null: { ipa: '/nʌl/', viet: 'nâu', daChon: true, nhom: 'js' },
  undefined: { ipa: '/ˌʌndɪˈfaɪnd/', viet: 'ăn-đi-phai', tach: ['un', 'de', 'fined'], daChon: true, nhom: 'js' },
  true: { ipa: '/truː/', viet: 'tru', nhom: 'js' },
  false: { ipa: '/fɔːls/', viet: 'phôn-x', nhom: 'js' },
  JSON: { ipa: '/ˈdʒeɪsən/', viet: 'giây-xơn', noi: 'Jason', nhan: ['jason', 'jayson'], daChon: true, nhom: 'js' },
  API: { ipa: '/ˌeɪ piː ˈaɪ/', viet: 'ây pi ai', noi: 'A P I', tach: ['A', 'P', 'I'], daChon: true, nhom: 'js' },
  import: { ipa: '/ɪmˈpɔːrt/', viet: 'im-pót', daChon: true, nhom: 'js' },
  export: { ipa: '/ɪkˈspɔːrt/', viet: 'ếch-pót', daChon: true, nhom: 'js' },
  module: { ipa: '/ˈmɑːdʒuːl/', viet: 'mô-đun', daChon: true, nhom: 'js' },
  closure: { ipa: '/ˈkloʊʒər/', viet: 'cờ-lâu-giơ', tach: ['clo', 'sure'], nhom: 'js' },
  scope: { ipa: '/skoʊp/', viet: 'xcốp', nhom: 'js' },
  hoisting: { ipa: '/ˈhɔɪstɪŋ/', viet: 'hoi-xting', tach: ['hoist', 'ing'], nhom: 'js' },
  'event loop': { ipa: '/ɪˈvent luːp/', viet: 'i-ven lúp', nhom: 'js' },
  localStorage: { ipa: '/ˈloʊkəl ˈstɔːrɪdʒ/', viet: 'lâu-cồ xto-rịt', noi: 'local Storage', tach: ['local', 'Stor', 'age'], nhan: ['local storage'], nhom: 'js' },
  length: { ipa: '/leŋθ/', viet: 'leng-th', nhom: 'js' },
  index: { ipa: '/ˈɪndeks/', viet: 'in-đéch', nhom: 'js' },
  value: { ipa: '/ˈvæljuː/', viet: 'va-liu', nhom: 'js' },
  if: { ipa: '/ɪf/', viet: 'íp', nhom: 'js' },
  else: { ipa: '/els/', viet: 'eo-x', nhom: 'js' },
  for: { ipa: '/fɔːr/', viet: 'pho', nhom: 'js' },
  loop: { ipa: '/luːp/', viet: 'lúp', nhom: 'js' },
  textContent: { ipa: '/tekst ˈkɑːntent/', viet: 'tếch-xt con-ten', noi: 'text Content', tach: ['text', 'Con', 'tent'], nhom: 'js' },
  innerHTML: { ipa: '/ˈɪnər ˌeɪtʃ tiː em ˈel/', viet: 'i-nơ ếch ti em eo', noi: 'inner H T M L', tach: ['inner', 'H', 'T', 'M', 'L'], nhom: 'js' },

  // ── HTML ──────────────────────────────────────────────
  HTML: { ipa: '/ˌeɪtʃ tiː em ˈel/', viet: 'ếch ti em eo', noi: 'H T M L', tach: ['H', 'T', 'M', 'L'], daChon: true, nhom: 'html' },
  element: { ipa: '/ˈelɪmənt/', viet: 'e-lơ-mần', tach: ['el', 'e', 'ment'], daChon: true, nhom: 'html' },
  tag: { ipa: '/tæɡ/', viet: 'téc-g', nhom: 'html' },
  attribute: { ipa: '/ˈætrɪbjuːt/', viet: 'át-tri-biu', tach: ['at', 'tri', 'bute'], nhom: 'html' },
  div: { ipa: '/dɪv/', viet: 'đíp (môi dưới chạm răng)', nhom: 'html' },
  span: { ipa: '/spæn/', viet: 'xpan', nhom: 'html' },
  href: { ipa: '/ˈeɪtʃ ref/', viet: 'ếch-rép', noi: 'H ref', tach: ['H', 'ref'], nhom: 'html' },
  src: { ipa: '/sɔːrs/', viet: 'xo-xơ (đọc như chữ source)', noi: 'source', nhan: ['source'], nhom: 'html' },
  alt: { ipa: '/ɔːlt/', viet: 'ôn-tờ', nhom: 'html' },
  image: { ipa: '/ˈɪmɪdʒ/', viet: 'im-mịch', nhom: 'html' },
  class: { ipa: '/klæs/', viet: 'cờ-lát', daChon: true, nhom: 'html' },
  id: { ipa: '/ˌaɪ ˈdiː/', viet: 'ai-đi', noi: 'I D', tach: ['I', 'D'], daChon: true, nhom: 'html' },
  form: { ipa: '/fɔːrm/', viet: 'phom', daChon: true, nhom: 'html' },
  input: { ipa: '/ˈɪnpʊt/', viet: 'in-pút', daChon: true, nhom: 'html' },
  button: { ipa: '/ˈbʌtən/', viet: 'bắt-tần', daChon: true, nhom: 'html' },
  label: { ipa: '/ˈleɪbəl/', viet: 'lây-bồ', nhom: 'html' },
  table: { ipa: '/ˈteɪbəl/', viet: 'tây-bồ', nhom: 'html' },
  header: { ipa: '/ˈhedər/', viet: 'he-đơ', nhom: 'html' },
  footer: { ipa: '/ˈfʊtər/', viet: 'phút-tơ', nhom: 'html' },
  nav: { ipa: '/næv/', viet: 'náp', nhom: 'html' },
  section: { ipa: '/ˈsekʃən/', viet: 'séc-sần', nhom: 'html' },
  head: { ipa: '/hed/', viet: 'hét', nhom: 'html' },
  body: { ipa: '/ˈbɑːdi/', viet: 'ba-đi', nhom: 'html' },
  meta: { ipa: '/ˈmetə/', viet: 'me-tơ', nhom: 'html' },
  width: { ipa: '/wɪdθ/', viet: 'guýt-th', nhom: 'html' },
  height: { ipa: '/haɪt/', viet: 'hai-t', nhom: 'html' },

  // ── CSS ───────────────────────────────────────────────
  CSS: { ipa: '/ˌsiː es ˈes/', viet: 'xi ét ét', noi: 'C S S', tach: ['C', 'S', 'S'], daChon: true, nhom: 'css' },
  padding: { ipa: '/ˈpædɪŋ/', viet: 'pa-đinh', nhom: 'css' },
  margin: { ipa: '/ˈmɑːrdʒɪn/', viet: 'ma-gin', nhom: 'css' },
  border: { ipa: '/ˈbɔːrdər/', viet: 'bo-đơ', nhom: 'css' },
  flexbox: { ipa: '/ˈfleksbɑːks/', viet: 'phờ-léc-bóc', tach: ['flex', 'box'], nhan: ['flex box'], nhom: 'css' },
  grid: { ipa: '/ɡrɪd/', viet: 'gờ-rít', nhom: 'css' },
  display: { ipa: '/dɪˈspleɪ/', viet: 'đi-xplây', tach: ['dis', 'play'], nhom: 'css' },
  position: { ipa: '/pəˈzɪʃən/', viet: 'pơ-di-sần', tach: ['po', 'si', 'tion'], nhom: 'css' },
  selector: { ipa: '/səˈlektər/', viet: 'xơ-léc-tơ', tach: ['se', 'lec', 'tor'], nhom: 'css' },
  'media query': { ipa: '/ˈmiːdiə ˈkwɪri/', viet: 'mi-đi-a quơ-ri', tach: ['me', 'di', 'a', 'que', 'ry'], nhom: 'css' },
  responsive: { ipa: '/rɪˈspɑːnsɪv/', viet: 'ri-xpon-xíp', tach: ['re', 'spon', 'sive'], nhom: 'css' },
  viewport: { ipa: '/ˈvjuːpɔːrt/', viet: 'viu-pót', tach: ['view', 'port'], nhom: 'css' },
  font: { ipa: '/fɑːnt/', viet: 'phon-t', nhom: 'css' },
  color: { ipa: '/ˈkʌlər/', viet: 'ca-lơ', nhom: 'css' },
  hover: { ipa: '/ˈhʌvər/', viet: 'ha-vơ', nhom: 'css' },
  'z-index': { ipa: '/ziː ˈɪndeks/', viet: 'di in-đéch', noi: 'Z index', tach: ['Z', 'in', 'dex'], nhan: ['z index'], nhom: 'css' },

  // ── Web, công cụ, Git ─────────────────────────────────
  'Node.js': { ipa: '/noʊd dɑːt ˌdʒeɪ ˈes/', viet: 'nốt chấm di ét', noi: 'Node dot J S', tach: ['Node', 'dot', 'J', 'S'], nhan: ['nodejs'], daChon: true, nhom: 'web' },
  npm: { ipa: '/ˌen piː ˈem/', viet: 'en pi em', noi: 'N P M', tach: ['N', 'P', 'M'], daChon: true, nhom: 'web' },
  npx: { ipa: '/ˌen piː ˈeks/', viet: 'en pi ích', noi: 'N P X', tach: ['N', 'P', 'X'], nhom: 'web' },
  axios: { ipa: '/ækˈsiːoʊs/', viet: 'ác-xi-ốt', tach: ['ax', 'i', 'os'], daChon: true, nhom: 'web' },
  'package.json': { ipa: '/ˈpækɪdʒ dɑːt ˈdʒeɪsən/', viet: 'pác-kịt chấm giây-xơn', noi: 'package dot Jason', tach: ['pack', 'age', 'dot', 'Jason'], nhan: ['package jason', 'packagejson'], daChon: true, nhom: 'web' },
  node_modules: { ipa: '/noʊd ˈmɑːdʒuːlz/', viet: 'nốt mô-đun', noi: 'node modules', tach: ['node', 'mod', 'ules'], nhan: ['node modules', 'node module'], daChon: true, nhom: 'web' },
  terminal: { ipa: '/ˈtɜːrmɪnəl/', viet: 'tơ-mi-nồ', tach: ['ter', 'mi', 'nal'], daChon: true, nhom: 'web' },
  'VS Code': { ipa: '/ˌviː es ˈkoʊd/', viet: 'vi ét câu-đ', noi: 'V S Code', tach: ['V', 'S', 'Code'], nhan: ['vscode'], nhom: 'web' },
  Git: { ipa: '/ɡɪt/', viet: 'ghít', daChon: true, nhom: 'web' },
  GitHub: { ipa: '/ˈɡɪthʌb/', viet: 'ghít-hắp', tach: ['Git', 'Hub'], nhan: ['git hub'], daChon: true, nhom: 'web' },
  commit: { ipa: '/kəˈmɪt/', viet: 'cơ-mít', daChon: true, nhom: 'web' },
  push: { ipa: '/pʊʃ/', viet: 'pút-sh', daChon: true, nhom: 'web' },
  pull: { ipa: '/pʊl/', viet: 'pun', daChon: true, nhom: 'web' },
  branch: { ipa: '/bræntʃ/', viet: 'bờ-ranh', daChon: true, nhom: 'web' },
  merge: { ipa: '/mɜːrdʒ/', viet: 'mơ-giơ', daChon: true, nhom: 'web' },
  clone: { ipa: '/kloʊn/', viet: 'cờ-lôn', nhom: 'web' },
  repository: { ipa: '/rɪˈpɑːzətɔːri/', viet: 'ri-pá-dơ-to-ri', tach: ['re', 'pos', 'i', 'to', 'ry'], nhom: 'web' },
  repo: { ipa: '/ˈriːpoʊ/', viet: 'ri-pô', daChon: true, nhom: 'web' },
  'pull request': { ipa: '/pʊl rɪˈkwest/', viet: 'pun ri-quét', nhom: 'web' },
  README: { ipa: '/ˈriːd miː/', viet: 'rít-mi', noi: 'read me', tach: ['read', 'me'], nhan: ['read me'], nhom: 'web' },
  localhost: { ipa: '/ˈloʊkəlhoʊst/', viet: 'lâu-cồ hốt', tach: ['lo', 'cal', 'host'], nhan: ['local host'], daChon: true, nhom: 'web' },
  port: { ipa: '/pɔːrt/', viet: 'pót', daChon: true, nhom: 'web' },
  server: { ipa: '/ˈsɜːrvər/', viet: 'sơ-vơ', daChon: true, nhom: 'web' },
  client: { ipa: '/ˈklaɪənt/', viet: 'cờ-lai-ần', daChon: true, nhom: 'web' },
  request: { ipa: '/rɪˈkwest/', viet: 'ri-quét', daChon: true, nhom: 'web' },
  response: { ipa: '/rɪˈspɑːns/', viet: 'ri-xpon', tach: ['re', 'sponse'], daChon: true, nhom: 'web' },
  HTTP: { ipa: '/ˌeɪtʃ tiː tiː ˈpiː/', viet: 'ếch ti ti pi', noi: 'H T T P', tach: ['H', 'T', 'T', 'P'], nhom: 'web' },
  HTTPS: { ipa: '/ˌeɪtʃ tiː tiː piː ˈes/', viet: 'ếch ti ti pi ét', noi: 'H T T P S', tach: ['H', 'T', 'T', 'P', 'S'], nhom: 'web' },
  URL: { ipa: '/ˌjuː ɑːr ˈel/', viet: 'diu a eo', noi: 'U R L', tach: ['U', 'R', 'L'], nhom: 'web' },
  cookie: { ipa: '/ˈkʊki/', viet: 'cúc-ki', nhom: 'web' },
  token: { ipa: '/ˈtoʊkən/', viet: 'tâu-cần', nhom: 'web' },
  endpoint: { ipa: '/ˈendpɔɪnt/', viet: 'en-poin', tach: ['end', 'point'], nhan: ['end point'], nhom: 'web' },
  REST: { ipa: '/rest/', viet: 'rét-xt', nhom: 'web' },
  CORS: { ipa: '/kɔːrz/', viet: 'co-dơ', nhan: ['cors', 'course'], nhom: 'web' },
  database: { ipa: '/ˈdeɪtəbeɪs/', viet: 'đây-tơ-bết', tach: ['da', 'ta', 'base'], nhan: ['data base'], nhom: 'web' },
  frontend: { ipa: '/ˈfrʌntend/', viet: 'phờ-ron-en', tach: ['front', 'end'], nhan: ['front end', 'front-end'], daChon: true, nhom: 'web' },
  backend: { ipa: '/ˈbækend/', viet: 'béc-en', tach: ['back', 'end'], nhan: ['back end', 'back-end'], daChon: true, nhom: 'web' },
  'full-stack': { ipa: '/ˈfʊl stæk/', viet: 'phun-xtéc', noi: 'full stack', tach: ['full', 'stack'], nhan: ['full stack', 'fullstack'], daChon: true, nhom: 'web' },
  deploy: { ipa: '/dɪˈplɔɪ/', viet: 'đi-ploi', tach: ['de', 'ploy'], daChon: true, nhom: 'web' },
  build: { ipa: '/bɪld/', viet: 'biu-đ', daChon: true, nhom: 'web' },
  debug: { ipa: '/diːˈbʌɡ/', viet: 'đi-bấc', tach: ['de', 'bug'], daChon: true, nhom: 'web' },
  bug: { ipa: '/bʌɡ/', viet: 'bấc', daChon: true, nhom: 'web' },
  test: { ipa: '/test/', viet: 'tét-xt', daChon: true, nhom: 'web' },
  DevTools: { ipa: '/ˈdev tuːlz/', viet: 'đép tun', noi: 'Dev Tools', tach: ['Dev', 'Tools'], nhan: ['dev tools', 'dev tool'], nhom: 'web' },
  Console: { ipa: '/ˈkɑːnsoʊl/', viet: 'con-xâu', nhom: 'web' },
  Network: { ipa: '/ˈnetwɜːrk/', viet: 'nét-guốc', tach: ['Net', 'work'], nhom: 'web' },
  Chrome: { ipa: '/kroʊm/', viet: 'cờ-rôm', nhom: 'web' },
  browser: { ipa: '/ˈbraʊzər/', viet: 'bờ-rao-dơ', nhom: 'web' },
  website: { ipa: '/ˈwebsaɪt/', viet: 'goép-sai', tach: ['web', 'site'], nhan: ['web site'], nhom: 'web' },
  install: { ipa: '/ɪnˈstɔːl/', viet: 'in-xtôn', tach: ['in', 'stall'], nhom: 'web' },
  script: { ipa: '/skrɪpt/', viet: 'xcríp', nhom: 'web' },
  extension: { ipa: '/ɪkˈstenʃən/', viet: 'ích-xten-sần', tach: ['ex', 'ten', 'sion'], nhom: 'web' },
  Prettier: { ipa: '/ˈprɪtiər/', viet: 'pờ-rít-ti-ơ', nhan: ['prettier', 'pretier'], nhom: 'web' },
  ESLint: { ipa: '/ˌiː es ˈlɪnt/', viet: 'i ét lin', noi: 'E S Lint', tach: ['E', 'S', 'Lint'], nhan: ['es lint'], nhom: 'web' },
  Ctrl: { ipa: '/kənˈtroʊl/', viet: 'cần-trôn', noi: 'control', nhan: ['control'], nhom: 'web' },
  Tab: { ipa: '/tæb/', viet: 'táp', nhom: 'web' },
  status: { ipa: '/ˈsteɪtəs/', viet: 'xtây-tợt', tach: ['sta', 'tus'], nhom: 'web' },
  method: { ipa: '/ˈmeθəd/', viet: 'me-thợt', nhom: 'web' },
  GET: { ipa: '/ɡet/', viet: 'ghét', nhom: 'web' },
  POST: { ipa: '/poʊst/', viet: 'pâu-xt', nhom: 'web' },
  code: { ipa: '/koʊd/', viet: 'câu-đ', nhom: 'web' },
  file: { ipa: '/faɪl/', viet: 'phai-ồ', nhom: 'web' },
};

/** Tra không phân biệt hoa thường — kịch bản viết "Promise", tra "promise" vẫn ra. */
const BANG_THUONG = new Map(Object.keys(TU_ANH).map((k) => [k.toLowerCase(), k]));

export function traTu(tu: string): (TuAnh & { tu: string }) | null {
  const k = BANG_THUONG.get(tu.toLowerCase());
  return k ? { ...TU_ANH[k], tu: k } : null;
}

/** Ký tự "dính" vào từ — chữ (cả chữ có dấu), số, gạch dưới. */
const LA_CHU = /[\p{L}\p{N}_]/u;

/**
 * Cắt câu thành đoạn thường + đoạn thuật ngữ để tô màu.
 *
 * Ưu tiên từ DÀI trước ("React-Bootstrap" trước "React", "package.json"
 * trước "JSON") — cùng luật với `tu_anh_trong()` bên kichban.py, để màn
 * hình tô đúng những từ mà dữ liệu train ghi là thuật ngữ.
 */
export function tachCau(chu: string, uuTien?: string[]): Array<{ t: string; tu?: string }> {
  const khoa = (uuTien?.length ? uuTien : Object.keys(TU_ANH))
    .slice()
    .sort((a, b) => b.length - a.length);
  const thuong = chu.toLowerCase();
  const daDung = new Array<boolean>(chu.length).fill(false);
  const trung: Array<{ a: number; b: number; tu: string }> = [];
  for (const k of khoa) {
    const kt = k.toLowerCase();
    let i = thuong.indexOf(kt);
    while (i >= 0) {
      const j = i + kt.length;
      const truoc = i > 0 ? chu[i - 1] : '';
      const sau = j < chu.length ? chu[j] : '';
      const bien = !(truoc && LA_CHU.test(truoc)) && !(sau && LA_CHU.test(sau));
      let trong = true;
      for (let x = i; x < j; x++) if (daDung[x]) trong = false;
      if (bien && trong) {
        for (let x = i; x < j; x++) daDung[x] = true;
        trung.push({ a: i, b: j, tu: traTu(k)?.tu ?? k });
      }
      i = thuong.indexOf(kt, i + 1);
    }
  }
  trung.sort((x, y) => x.a - y.a);
  const ra: Array<{ t: string; tu?: string }> = [];
  let p = 0;
  for (const m of trung) {
    if (m.a > p) ra.push({ t: chu.slice(p, m.a) });
    ra.push({ t: chu.slice(m.a, m.b), tu: m.tu });
    p = m.b;
  }
  if (p < chu.length) ra.push({ t: chu.slice(p) });
  return ra;
}

/** Danh sách thuật ngữ (không trùng, theo thứ tự xuất hiện) trong một câu. */
export function tuTrongCau(chu: string): string[] {
  const ra: string[] = [];
  for (const d of tachCau(chu)) if (d.tu && !ra.includes(d.tu)) ra.push(d.tu);
  return ra;
}

// ══════════════════════════════════════════════════════════
//  Đọc mẫu bằng giọng của trình duyệt (Web Speech API)
// ══════════════════════════════════════════════════════════
//
// Miễn phí, chạy ngay trong trình duyệt, không qua backend. Chất lượng tuỳ
// máy: macOS có Samantha/Ava, Chrome có "Google US English", Windows có
// Aria/Jenny. Ưu tiên giọng en-US có sẵn tốt nhất.

const GIONG_UU_TIEN = ['Google US English', 'Samantha', 'Ava', 'Aria', 'Jenny', 'Allison', 'Alex'];

function chonGiong(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const ds = window.speechSynthesis.getVoices();
  const my = ds.filter((v) => v.lang?.toLowerCase().replace('_', '-').startsWith('en-us'));
  for (const ten of GIONG_UU_TIEN) {
    const g = my.find((v) => v.name.includes(ten));
    if (g) return g;
  }
  return my[0] ?? ds.find((v) => v.lang?.toLowerCase().startsWith('en')) ?? null;
}

export function coDocMau(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Đọc một chuỗi bằng giọng en-US. Trả Promise xong khi đọc hết, để nút 🐢
 * nối các phần lần lượt.
 *
 * ⚠️ `cancel()` trước mỗi lần đọc: Chrome xếp hàng các lượt speak(), bấm
 * liên tục năm lần là nghe năm lần nối nhau.
 */
export function docMau(chu: string, toc = 0.85, huy = true): Promise<void> {
  return new Promise((xong) => {
    if (!coDocMau()) return xong();
    const s = window.speechSynthesis;
    if (huy) s.cancel();
    const u = new SpeechSynthesisUtterance(chu);
    u.lang = 'en-US';
    const g = chonGiong();
    if (g) u.voice = g;
    u.rate = toc;
    u.onend = () => xong();
    u.onerror = () => xong();
    s.speak(u);
  });
}

/** Đọc từng phần, nghỉ giữa các phần — nút 🐢. */
export async function docTungPhan(phan: string[], toc = 0.6): Promise<void> {
  if (!coDocMau()) return;
  window.speechSynthesis.cancel();
  for (const p of phan) {
    await docMau(p, toc, false);
    await new Promise((r) => setTimeout(r, 350));
  }
}

/** Gói gửi cho backend chấm: từ + các cách viết khác chấp nhận được. */
export function goiChamTu(tuAnh: string[]): Array<{ tu: string; nhan?: string[] }> {
  return tuAnh.map((t) => {
    const d = traTu(t);
    return d?.nhan?.length ? { tu: t, nhan: d.nhan } : { tu: t };
  });
}

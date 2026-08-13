/**
 * ============================================================
 * Phiên âm từ tiếng Anh sang chính tả tiếng Việt
 * ============================================================
 *
 * Giọng nhân bản của người dùng là giọng VIỆT, và mô hình VieNeu đọc chữ
 * Latin theo luật tiếng Việt. Đo thật 12/08/2026, người dùng nghe và xác
 * nhận từng từ:
 *
 *     file      → "phi lê"
 *     deploy    → "đê-p-loi"
 *     database  → sai
 *
 * Đường v3 turbo KHÔNG có bước chuẩn hoá văn bản nào để móc vào (tham số
 * `skip_normalize` thuộc backend khác), nên đòn bẩy duy nhất nằm ở phía
 * ta: **viết lại chữ trước khi gửi đi đọc**.
 *
 * ── Vì sao phiên âm chứ không ghép giọng Anh vào ──
 *
 * Cách kia là cắt câu ra, đưa mấy từ tiếng Anh cho một giọng Anh đọc rồi
 * dán lại. Nghe thì "chuẩn" hơn, nhưng giọng đổi giữa câu — như hai người
 * thay nhau nói. Còn phiên âm thì giữ nguyên MỘT giọng, và kết quả nghe
 * đúng như một người Việt nói xen tiếng Anh, tức đúng cái tự nhiên nhất
 * cho con robot này.
 *
 * ── Chỗ khó thật sự: biết từ nào là tiếng Anh ──
 *
 * Tiếng Việt cũng viết bằng chữ Latin, nên không thể cứ thấy chữ không
 * dấu là đổi — "anh", "cho", "khong", "toi" đều là tiếng Việt viết thiếu
 * dấu. Nhưng tiếng Việt có luật ghép âm RẤT chặt, và ba luật dưới đây bắt
 * được gần hết mà gần như không bắt nhầm:
 *
 *   1. Chữ `f`, `j`, `w`, `z` không tồn tại trong tiếng Việt.
 *   2. Âm cuối tiếng Việt chỉ có: c, ch, m, n, ng, nh, p, t (và nguyên
 *      âm). Từ kết thúc bằng b, d, g, k, l, r, s, v, x là không phải.
 *   3. Tiếng Việt không có cụm phụ âm đầu kiểu bl, br, cl, cr, dr, fl,
 *      fr, gr, pl, pr, sc, sk, sl, sm, sn, sp, st, sw, tw — chỉ có ch,
 *      gh, gi, kh, ng, ngh, nh, ph, qu, th, tr.
 *
 * Từ nào lọt lưới cả ba (như "data", "menu" — âm tiết nào cũng hợp lệ
 * trong tiếng Việt) thì phải nằm trong TỪ ĐIỂN. Đó là lý do có cả hai:
 * từ điển bắt các từ quen thuộc, luật bắt phần đuôi dài vô hạn.
 *
 * ⚠️ Thà BỎ SÓT còn hơn BẮT NHẦM. Bỏ sót thì một từ đọc sai, người nghe
 * vẫn hiểu. Bắt nhầm thì một từ tiếng Việt bình thường bị bóp méo, và
 * người nghe tưởng robot hỏng.
 */

/**
 * Từ điển các từ hay gặp. Ưu tiên tuyệt đối so với luật đoán.
 *
 * Cách viết: dùng chính tả tiếng Việt, gạch nối giữa các âm tiết để mô
 * hình đọc rời ra. KHÔNG cố mô phỏng thật chính xác giọng Anh-Mỹ — mục
 * tiêu là nghe như người Việt nói từ đó, chứ không phải như người Anh.
 * Người Việt nói "phai" chứ không nói /faɪl/ với âm `l` cuối rõ rệt.
 */
/** Danh sách từ khoá công nghệ — dùng làm gợi ý từ vựng cho Whisper. */
export function tuKhoaCongNghe(): string[] {
  return Object.keys(TU_DIEN);
}

const TU_DIEN: Record<string, string> = {
  // ── Lập trình / máy tính ──
  file: 'phai', files: 'phai', deploy: 'đi-pờ-loi', deployed: 'đi-pờ-loi',
  server: 'sơ-vơ', servers: 'sơ-vơ', database: 'đây-tơ-bêit', data: 'đây-tà',
  backup: 'béc-ắp', update: 'ắp-đêit', upgrade: 'ắp-gờ-rêit',
  download: 'đao-lôt', upload: 'ắp-lôt', check: 'chéc', test: 'tét',
  code: 'côt', coding: 'côu-đing', bug: 'bấc', debug: 'đi-bấc',
  app: 'áp', apps: 'áp', web: 'goép', website: 'goép-sait',
  internet: 'in-tơ-nét', wifi: 'quai-phai', email: 'i-meo',
  password: 'pát-quợt', account: 'ơ-cao', login: 'lóc-in', logout: 'lóc-ao',
  online: 'on-lain', offline: 'óp-lain', link: 'linh', click: 'cờ-líc',
  menu: 'mê-niu', video: 'vi-đi-ô', laptop: 'láp-tóp', desktop: 'đét-tóp',
  smartphone: 'sờ-mát-phôn', screenshot: 'sờ-cờ-rin-sót',
  folder: 'phâu-đơ', restart: 'ri-sờ-tát', reset: 'ri-xét', refresh: 'ri-phờ-rét',
  install: 'in-sờ-tôn', setup: 'sét-ắp', config: 'con-phíc',
  save: 'sêu', share: 'se-a', search: 'sớch', delete: 'đi-lít',
  cancel: 'ken-sồ', submit: 'sấp-mít', error: 'e-rờ', warning: 'guo-ning',
  ok: 'ô-kê', okay: 'ô-kê',

  // ── AI / học máy ──
  // Nhiều từ ở đây LỌT hết ba luật đoán vì âm tiết nào cũng hợp lệ trong
  // tiếng Việt ("model", "token", "agent"), nên bắt buộc phải có mặt ở
  // đây — luật không cứu được.
  model: 'mo-đồ', models: 'mo-đồ', training: 'trên-ning', train: 'trêin',
  prompt: 'pờ-rôm', token: 'tô-kừn', tokens: 'tô-kừn',
  dataset: 'đây-tơ-sét', embedding: 'em-be-đing', inference: 'in-phơ-rừn',
  chatbot: 'chát-bót', neural: 'niu-rồ', network: 'nét-guơc',
  agent: 'ây-giừn', agents: 'ây-giừn', voice: 'vói', clone: 'cờ-lôn',
  finetune: 'phai-tiun', 'fine-tune': 'phai-tiun',
  checkpoint: 'chéc-poin', benchmark: 'ben-mác',
  streaming: 'sờ-tri-ming', stream: 'sờ-trim', latency: 'lây-tần-si',

  // ── Phần mềm / lập trình ──
  framework: 'phờ-rêm-goéc', library: 'lai-bờ-rơ-ri', function: 'phăng-sừn',
  variable: 've-ri-ơ-bồ', array: 'ơ-rêi', object: 'óp-giéc', class: 'cờ-lát',
  string: 'sờ-tring', boolean: 'bu-li-ừn', commit: 'cơ-mít', branch: 'bờ-ranh',
  merge: 'mớc', repository: 'ri-pô-di-tơ-ri', repo: 'ri-pô',
  docker: 'đóc-cơ', container: 'cơn-tây-nơ', cloud: 'cờ-lao',
  cache: 'két', queue: 'kiu', log: 'lóc', logs: 'lóc', script: 'sờ-cờ-ríp',
  plugin: 'pờ-lắc-in', module: 'mo-điun', package: 'pác-kịt',
  version: 'vơ-sừn', release: 'ri-lít', patch: 'pétch', feature: 'phi-chơ',
  interface: 'in-tơ-phêit', dashboard: 'đét-boóc', template: 'tem-pờ-lịt',
  layout: 'lê-ao', responsive: 'ri-sờ-pon-síp', frontend: 'phờ-ron-en',
  backend: 'béc-en', fullstack: 'phun-sờ-téc', build: 'bin',
  runtime: 'răn-taim', timeout: 'tai-ao', callback: 'cô-béc',
  request: 'ri-quét', response: 'ri-sờ-pon', endpoint: 'en-poin',

  // ── Máy móc / phần cứng ──
  browser: 'bờ-rao-dơ', router: 'rao-tơ', storage: 'sờ-to-rịt',
  memory: 'me-mơ-ri', battery: 'be-tơ-ri', sensor: 'sen-sơ',
  firmware: 'phơm-goe', hardware: 'hát-goe', software: 'sóp-goe',
  driver: 'đờ-rai-vơ', monitor: 'mo-ni-tơ', keyboard: 'ki-boóc',
  mouse: 'mao', chip: 'chíp', board: 'boóc', robot: 'rô-bốt',

  // ── Đời thường ──
  ship: 'síp', order: 'oóc-đơ', voucher: 'vao-chơ', sale: 'sêu',
  team: 'tim', meeting: 'mi-ting', deadline: 'đét-lain', project: 'pờ-rô-giéc',
  manager: 'me-ni-giơ', marketing: 'mác-kê-ting', design: 'đi-dain',
  game: 'ghêm', level: 'le-vồ', style: 'sờ-tai', size: 'sai',
  ticket: 'tí-kịt', taxi: 'tắc-xi', tour: 'tua',
};

/**
 * Tên 26 chữ cái, đọc theo lối tiếng Anh — cách người Việt thật sự đọc
 * chữ viết tắt.
 *
 * "GPU" không ai đọc là "gờ-pờ-u" theo lối đánh vần tiếng Việt; ai cũng
 * đọc "gi-pi-iu". Cũng vì thế mà bảng này KHÔNG dùng tên chữ cái tiếng
 * Việt (a, bê, xê, dê…) — dùng vào là sai kiểu khác.
 *
 * Vẫn phải đọc được như tiếng Việt: xem phép tự kiểm ở cuối file.
 */
const TEN_CHU: Record<string, string> = {
  a: 'ây', b: 'bi', c: 'xi', d: 'đi', e: 'i', f: 'ép', g: 'gi',
  h: 'ếch', i: 'ai', j: 'giây', k: 'kây', l: 'eo', m: 'em', n: 'en',
  o: 'ô', p: 'pi', q: 'kiu', r: 'a', s: 'ét', t: 'ti', u: 'iu',
  v: 'vi', w: 'đắp-liu', x: 'ét-xì', y: 'quai', z: 'dét',
};

/**
 * Vài viết tắt đã có cách đọc RIÊNG, không đánh vần từng chữ.
 *
 * Bỏ sót nhóm này thì "SQL" thành "ét-kiu-eo" và "JSON" thành
 * "giây-ét-ô-en" — đúng luật nhưng sai thực tế, mà sai thực tế mới là cái
 * người nghe nhận ra.
 */
const VIET_TAT_DAC_BIET: Record<string, string> = {
  sql: 'ét-kiu-eo', json: 'giây-sừn', jpeg: 'giây-pét', ajax: 'ây-giác',
  wifi: 'quai-phai', wi: 'quai', ios: 'ai-ô-ét', macos: 'mác-ô-ét',
  http: 'ếch-ti-ti-pi', https: 'ếch-ti-ti-pi-ét', url: 'iu-a-eo',
};

/** Đọc một viết tắt VIẾT HOA thành chuỗi tên chữ cái. */
function docVietTat(tu: string): string | null {
  const thuong = tu.toLowerCase();
  const dacBiet = VIET_TAT_DAC_BIET[thuong];
  if (dacBiet) return dacBiet;

  // Chỉ nhận chữ cái thuần, 2-5 ký tự, VIẾT HOA TOÀN BỘ. Dài hơn 5 thì
  // gần như luôn là một từ viết hoa để nhấn mạnh, không phải viết tắt —
  // đánh vần nó ra là biến một từ thành sáu tiếng lảm nhảm.
  if (!/^[A-Z]{2,5}$/.test(tu)) return null;
  return thuong
    .split('')
    .map((c) => TEN_CHU[c] ?? c)
    .join('-');
}

/** Cụm phụ âm đầu HỢP LỆ của tiếng Việt. Ngoài danh sách này là ngoại lai. */
const DAU_HOP_LE = new Set(['ch', 'gh', 'gi', 'kh', 'ng', 'nh', 'ph', 'qu', 'th', 'tr']);

/** Âm cuối HỢP LỆ của tiếng Việt. */
const CUOI_HOP_LE = ['ch', 'ng', 'nh', 'c', 'm', 'n', 'p', 't'];

const NGUYEN_AM = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

/**
 * Từ này có thể là một âm tiết tiếng Việt không?
 *
 * Trả `false` nghĩa là CHẮC CHẮN không phải — lúc đó mới dám đụng vào.
 * Trả `true` thì để yên, kể cả khi nó thật sự là tiếng Anh: xem ghi chú
 * "thà bỏ sót còn hơn bắt nhầm" ở đầu file.
 */
export function coTheLaTiengViet(w: string): boolean {
  const s = w.toLowerCase();

  // Chữ không có trong bảng chữ cái tiếng Việt.
  if (/[fjwz]/.test(s)) return false;

  // Cụm phụ âm đầu lạ.
  const dau = s.match(/^[bcdghklmnpqrstvx]{2,3}/)?.[0];
  if (dau) {
    const co = [3, 2].some((n) => DAU_HOP_LE.has(dau.slice(0, n)));
    if (!co) return false;
  }

  // Âm cuối lạ. Chỉ xét khi từ kết thúc bằng phụ âm.
  const chotCuoi = s[s.length - 1];
  if (chotCuoi && !NGUYEN_AM.has(chotCuoi)) {
    if (!CUOI_HOP_LE.some((c) => s.endsWith(c))) return false;
  }

  // Hai nguyên âm giống nhau liền nhau (ee, oo trong "see", "book") —
  // tiếng Việt không có, trừ "oo" trong vài từ mượn đã Việt hoá.
  if (/(ee|aa|ii|uu)/.test(s)) return false;

  return true;
}

/**
 * Đổi các từ tiếng Anh trong câu sang chính tả tiếng Việt.
 *
 * Chỉ gọi khi đang đọc bằng giọng VIỆT. Với giọng tiếng Anh thì làm thế
 * là phá — lúc đó chính tả gốc mới là thứ đúng.
 */
export function phienAmSangViet(text: string): string {
  if (!text) return text;

  // ⚠️ VIẾT HOA CẢ CÂU LÀ NHẤN MẠNH, KHÔNG PHẢI VIẾT TẮT.
  //
  // Bộ thử bắt được: "CHÚNG TA PHẢI LÀM NGAY BÂY GIỜ" biến thành
  // "CHÚNG ti-ây PHẢI LÀM en-gi-ây-quai BÂY GIỜ" — mấy từ có dấu thì
  // thoát, còn "TA" và "NGAY" không dấu thì bị đánh vần ra. Đúng cái
  // kiểu hỏng tệ nhất: một câu tiếng Việt bình thường bị xé nát.
  //
  // Không thể phân biệt bằng từng từ, vì "API" và "TA" nhìn giống hệt
  // nhau. Phải nhìn CẢ CÂU — và đo bằng TỈ LỆ, không phải đếm số:
  //
  //   câu nhấn mạnh  → viết hoa gần hết ("CHÚNG TA PHẢI LÀM NGAY" = 100%)
  //   câu kỹ thuật   → lác đác vài từ ("cắm USB rồi mở URL bằng HTTPS" = 30%)
  //
  // Bản đầu tôi đếm "từ 3 từ hoa trở lên thì bỏ qua", và nó chặn luôn câu
  // thứ hai — đúng loại câu con robot này nói hằng ngày. Vá quá tay cũng
  // là vá sai.
  const tatCaTu = text.match(/[A-Za-zÀ-ỹ]{2,}/g) || [];
  const tuHoa = tatCaTu.filter((t) => t === t.toUpperCase());
  const choPhepVietTat = tatCaTu.length > 0 && tuHoa.length / tatCaTu.length < 0.4;

  return text.replace(/[A-Za-zÀ-ỹ]+/g, (tu) => {
    // Có dấu tiếng Việt ⇒ chắc chắn là tiếng Việt, không đụng vào.
    if (/[À-ỹ]/.test(tu)) return tu;

    const thuong = tu.toLowerCase();
    const trongTuDien = TU_DIEN[thuong];
    if (trongTuDien) return giuHoa(tu, trongTuDien);

    // VIẾT TẮT trước phép thử độ dài: "AI", "OS", "PC" chỉ hai chữ cái
    // nhưng vẫn cần đánh vần. Xếp sau phép thử là chúng rơi vào nhánh
    // "quá ngắn, để yên" và không bao giờ tới được đây.
    const vietTat = choPhepVietTat ? docVietTat(tu) : null;
    if (vietTat) return vietTat;

    // Từ một chữ cái ("a", "I") hoặc quá ngắn — để yên, đổi chỉ tổ hỏng.
    if (thuong.length <= 2) return tu;

    if (coTheLaTiengViet(thuong)) return tu;

    // Chắc chắn ngoại lai nhưng không có trong từ điển: để nguyên. Đoán
    // cách đọc bằng luật cho một từ tuỳ ý thì sai nhiều hơn đúng, và một
    // từ lạ đọc sai vẫn hơn cả câu bị bóp méo.
    return tu;
  });
}

/** Giữ kiểu hoa/thường của từ gốc cho bản phiên âm. */
function giuHoa(goc: string, moi: string): string {
  if (goc === goc.toUpperCase() && goc.length > 1) return moi.toUpperCase();
  if (goc[0] === goc[0].toUpperCase()) return moi[0].toUpperCase() + moi.slice(1);
  return moi;
}

/** Có từ nào được đổi không — để ghi log khi cần soi. */
export function demTuDaDoi(truoc: string, sau: string): number {
  if (truoc === sau) return 0;
  const a = truoc.split(/\s+/);
  const b = sau.split(/\s+/);
  return a.reduce((n, t, i) => (t !== b[i] ? n + 1 : n), 0);
}

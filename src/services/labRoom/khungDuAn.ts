/**
 * ============================================================
 * KHUNG DỰ ÁN CỦA MỘT BÀI LAB211 — đọc từ lời giải THẬT
 * ============================================================
 *
 * `quyTacThay.ts` nói luật CHUNG (chín gói của Guide.xlsx, luật thêm tầng).
 * File này trả lời câu hỏi RIÊNG của từng bài: *bài NÀY có đúng những gói nào,
 * lớp nào nằm trong gói nào, và bao nhiêu LOC*.
 *
 * ─── VÌ SAO PHẢI ĐỌC TỪ LỜI GIẢI CHỨ KHÔNG ĐỂ AI TỰ VẼ ───
 * Trước 16/09/2026, prompt giảng bài của Code Lab tự vẽ cây thư mục, và nó vẽ
 * theo bộ lời giải CŨ: `entity/ bo/ ui/ utils/Validator`. Hậu quả đo được: 21
 * trong 25 bản giảng đã cache dạy kiến trúc mà thầy KHÔNG chấm. Một prompt sai
 * nhân với 54 bài là 54 lần dạy sai, và người học không có cách nào biết.
 *
 * Nay bộ 54 lời giải chuẩn đã nằm trong `codeExercise.solutionCodeJson` với
 * đường dẫn thật (`src/model/Doctor.java`). Cây thư mục vì thế là thứ ĐỌC ĐƯỢC,
 * không phải thứ phải đoán. AI nhận cây đã dựng sẵn và bị cấm bịa cây khác.
 *
 * ─── ĐƯA CÂY THÌ ĐƯỢC, ĐƯA CODE THÌ KHÔNG ───
 * Chính sách chấm của trường (`Lab Grading policy.pdf`, mục *How Not To
 * Plagiarize*) viết cho người đi giúp: *"Help them debug their code. Do not show
 * them how you did it."* Nên khi GIẢNG và TRỢ GIẢNG, AI chỉ được biết TÊN lớp và
 * gói — đủ để chỉ đường "cái này thuộc service", không đủ để chép. Thân code của
 * lời giải mẫu chỉ mở ra lúc CHẤM (xem `mauThamChieu` trong `phongLab.service`).
 */

/** Đủ để dựng khung. Cố ý lỏng: mỗi service select một tập cột khác nhau. */
export type BaiCoKhung = {
  title?: string | null;
  slug?: string | null;
  problemHtml?: string | null;
  solutionCodeJson?: unknown;
  starterCodeJson?: unknown;
};

/**
 * Số dòng code của một bài, đọc từ chính dữ liệu bài chứ không đoán.
 *
 * LAB211 nhét LOC vào tiêu đề đúng dạng `... (37 LOC)` — đo thật: 54/54 bài
 * đều có, và 54/54 problemHtml cũng nhắc lại. Tiêu đề trước vì nó ngắn và
 * người học nhìn thấy đúng con số đó trên màn hình chọn bài; problemHtml là
 * đường lùi cho bài mà ai đó đã sửa tiêu đề.
 *
 * (Ở đây chứ không ở `phongLab.service` vì Code Lab cũng cần nó; bản kia
 * re-export lại để `locCuaBai.test.ts` và mọi lời gọi cũ không phải đổi.)
 */
export function locCuaBai(ex: { title?: string | null; problemHtml?: string | null }): number {
  const tuTieuDe = /\((\d{1,4})\s*LOC\)/i.exec(ex.title || '');
  if (tuTieuDe) return Number(tuTieuDe[1]);
  const tuDe = /(\d{1,4})\s*LOC/i.exec(ex.problemHtml || '');
  return tuDe ? Number(tuDe[1]) : 0;
}

/**
 * Bài này có thuộc LAB211 không.
 *
 * Nhận theo MÃ BÀI trong tiêu đề (`J1.S.P0055_…`, `J1.L.P0014_…`) trước, vì mã
 * là thứ thầy dùng và là thứ không ai sửa; slug là đường lùi (admin từng viết
 * lại slug, nên tin slug một mình là tin vào thứ đổi được).
 */
export function laBaiLab211(ex: BaiCoKhung): boolean {
  if (/^J1\.[SL]\.P\d{4}/i.test((ex.title || '').trim())) return true;
  return /^lab211-/i.test((ex.slug || '').trim());
}

/** Thứ tự các gói theo Guide.xlsx — cũng chính là thứ tự NÊN GÕ khi vào phòng lab. */
const THU_TU_GOI = [
  'constants', 'model', 'dto', 'repository', 'service',
  'controller', 'view', 'utils', 'exceptions', 'main',
];

/** Một dòng mô tả ngắn cho mỗi gói, để cây tự giải thích được. */
const VAI_TRO: Record<string, string> = {
  constants: 'every printed sentence + every magic number',
  model: 'the JavaBean: private fields, empty ctor, getters/setters, toString',
  dto: 'Request/Response — how main talks to the controller',
  repository: 'the collection itself + plain CRUD',
  service: 'the rules and the algorithms; called only by the controller',
  controller: 'wires main -> service -> view; never reads input, never prints',
  view: 'the only class besides main that prints',
  utils: 'final class, private ctor, static only',
  exceptions: 'only because this brief asks for it',
  main: 'the menu loop and the ONE Scanner (a local variable)',
};

/** Lấy danh sách đường dẫn file từ một cột JSON dạng `[{name, code}]`. */
function tenFile(cot: unknown): string[] {
  if (!Array.isArray(cot)) return [];
  const ra: string[] = [];
  for (const o of cot) {
    const ten = (o as { name?: unknown } | null)?.name;
    if (typeof ten === 'string' && ten.trim()) ra.push(ten.trim());
  }
  return ra;
}

/**
 * Cây thư mục THẬT của bài, dựng từ lời giải mẫu (và khung starter).
 *
 * Hợp hai nguồn vì chúng bù nhau: `solutionCodeJson` là bộ file đã chạy được,
 * còn `starterCodeJson` đôi khi liệt kê thêm file rỗng mà người học phải tạo.
 * Trả `null` khi không có file nào — lúc đó gọi nơi dùng tự quyết, đừng vẽ bừa.
 */
export function cayDuAn(ex: BaiCoKhung): string | null {
  const tatCa = [...tenFile(ex.solutionCodeJson), ...tenFile(ex.starterCodeJson)];
  const theoGoi = new Map<string, Set<string>>();
  for (const duong of tatCa) {
    if (!/\.java$/i.test(duong)) continue;
    // `src/model/Doctor.java` -> gói `model`, lớp `Doctor.java`
    const phan = duong.replace(/^\/+/, '').split('/').filter(Boolean);
    const lop = phan[phan.length - 1];
    const goi = phan.length >= 2 ? phan[phan.length - 2] : '(mặc định)';
    if (!theoGoi.has(goi)) theoGoi.set(goi, new Set());
    theoGoi.get(goi)!.add(lop);
  }
  if (theoGoi.size === 0) return null;

  // Gói nào có trong Guide thì xếp theo đúng thứ tự Guide; gói lạ xuống cuối.
  const goiSapXep = [...theoGoi.keys()].sort((a, b) => {
    const ia = THU_TU_GOI.indexOf(a), ib = THU_TU_GOI.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  });

  const dong: string[] = ['src/'];
  goiSapXep.forEach((goi, i) => {
    const cuoiGoi = i === goiSapXep.length - 1;
    const vai = VAI_TRO[goi] ? `   <- ${VAI_TRO[goi]}` : '';
    dong.push(`${cuoiGoi ? '└──' : '├──'} ${goi}/${vai}`);
    const lops = [...theoGoi.get(goi)!].sort();
    lops.forEach((lop, j) => {
      const than = cuoiGoi ? '    ' : '│   ';
      dong.push(`${than}${j === lops.length - 1 ? '└──' : '├──'} ${lop}`);
    });
  });
  return dong.join('\n');
}

/**
 * Khối ngữ cảnh nhét vào prompt cho MỘT bài LAB211: khung thật + LOC + thứ tự
 * gõ + thứ tự tự review. Trả chuỗi rỗng nếu bài không thuộc LAB211 — Code Lab
 * còn nhiều track khác, và áp luật LAB211 lên bài Python thì là bịa.
 *
 * @param coCay false khi nơi gọi KHÔNG được phép lộ cả tên lớp (hiếm).
 */
export function khungChoPrompt(ex: BaiCoKhung, coCay = true): string {
  if (!laBaiLab211(ex)) return '';
  const loc = locCuaBai(ex);
  const cay = coCay ? cayDuAn(ex) : null;
  const phan: string[] = [
    '=================================================================',
    'THIS EXERCISE, CONCRETELY  (measured from the reference solution)',
    '=================================================================',
  ];
  if (loc > 0) {
    phan.push(
      `Size: ${loc} LOC. Size changes HOW MUCH you write, never WHICH packages`,
      'exist. A 21-LOC brief still has constants, model, dto, controller, view, main.',
      '',
    );
  }
  if (cay) {
    phan.push(
      'THE PACKAGE LAYOUT OF THE ACCEPTED SOLUTION — use exactly this, do not',
      'invent another one, do not rename a package, do not merge two of them:',
      '',
      cay,
      '',
      'Data files (.txt/.dat/.csv) sit at the PROJECT ROOT next to build.xml,',
      'never inside src/.',
      '',
    );
  }
  phan.push(
    'THE ORDER TO TYPE IT IN THE LAB  (model first — the lecturer asks for this):',
    '  1. model      - the data. Nothing else compiles until it exists.',
    '  2. constants  - Message + Constants: every sentence and number, once.',
    '  3. utils      - Validation (and FileUtils if this brief reads a file).',
    '  4. repository - the collection + CRUD, if this brief keeps a collection.',
    '  5. service    - the rules/algorithm, if this brief calculates anything.',
    '  6. dto        - Request/Response, so no method needs a third parameter.',
    '  7. controller - the wiring. No Scanner, no print.',
    '  8. view       - the printing.',
    '  9. main       - the menu loop and the one Scanner.',
    'Compile after EACH step. Never write all of it and press Run once.',
    '',
    'THE ORDER TO SELF-REVIEW BEFORE CALLING THE LECTURER  (his refusal gates',
    'come first — losing one of them means the work is not even read):',
    '  1. Structure: are the packages above all present, with the right classes?',
    '  2. Comments: a one-line // above every method and every branch.',
    '  3. Naming/convention: class PascalCase, method+variable camelCase,',
    '     constant UPPER_SNAKE, 4-space indent, no tabs.',
    '  4. Run the happy path and EVERY validation message; compare the console',
    '     with the expected screen character by character.',
    '  5. Only then: SOLID / design pattern / "what if he changes a requirement".',
  );
  return phan.join('\n');
}

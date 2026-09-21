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
  repository: 'ALWAYS: the program data + plain CRUD (checklist 1.1)',
  service: 'the rules and the algorithms; called only by the controller',
  controller: 'wires main -> service -> view; never reads input, never prints',
  view: 'ResponseDTO as an attribute, display() with no parameters, once per case',
  utils: 'final class, private ctor, static only',
  exceptions: 'only because this brief asks for it',
  main: 'the ONE Scanner + all input/validation/file reading; 1 controller call per case',
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
      'THE PACKAGE LAYOUT OF THE ACCEPTED SOLUTION — keep these packages and',
      'class names, do not rename a package, do not merge two of them:',
      '',
      cay,
      '',
    );
    // Bộ 54 lời giải viết TRƯỚC tờ checklist giấy (21/09/2026); 31 bài thiếu
    // repository. Đưa cây đó cho AI kèm chữ "dùng y như này" là để AI dạy lại
    // đúng điều tờ giấy cấm — nên cây thiếu gói nào thì nói thẳng ở đây.
    if (!/\brepository\//.test(cay)) {
      phan.push(
        '!! This reference solution was written BEFORE the paper checklist and has',
        '!! NO repository/. The checklist (item 1.1) makes repository/ MANDATORY:',
        '!! add it — it holds this program\'s data (the collection, or the array /',
        '!! numbers / text an algorithm works on) with plain CRUD — and NEVER tell',
        '!! the student this assignment needs no repository.',
        '',
      );
    }
    phan.push(
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
    '  4. repository - ALWAYS: the program data + plain CRUD (checklist 1.1).',
    '  5. service    - the rules/algorithm, if this brief calculates anything.',
    '  6. dto        - Request/Response, so no method needs a third parameter.',
    '  7. controller - the wiring. No Scanner, no print.',
    '  8. view       - ResponseDTO attribute + setter + display(), no parameters.',
    '  9. main       - the menu loop, the one Scanner, all input/validation/file',
    '                  reading; ONE controller call per menu case.',
    'Compile after EACH step. Never write all of it and press Run once.',
    '',
    'THE ORDER TO SELF-REVIEW BEFORE CALLING THE LECTURER  (his refusal gates',
    'come first — losing one of them means the work is not even read):',
    '  1. The paper check sheet, item by item: all 25 items "O" — structure (1.1),',
    '     names (1.2-1.5), comments (1.6), formatting (2.1-2.11), 3.1-3.8.',
    '  2. Run the happy path and EVERY validation message; compare the console',
    '     with the expected screen character by character.',
    '  3. Only then: SOLID / design pattern / "what if he changes a requirement".',
  );
  return phan.join('\n');
}

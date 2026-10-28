/**
 * Khung đề PE luyện SWR302 — định dạng PE SP26/SU26 của trường (90 phút, 10 điểm, trả lời trong template Word):
 *   Q1 (0.5) trang bìa SRS · Q2 (2.5) context diagram · Q3 (4.0) use case diagram + bảng Actor + bảng Use case ·
 *   Q4 (3.0) ERD khái niệm + bảng thực thể (SP26/FA25/SU25) HOẶC sơ đồ chuyển trạng thái + bảng trạng thái (SU26).
 * Rubric bám rubric đề thật (content/exams/SWR302-PE25.mjs, PE1, PE24): 10 chức năng f1…f10.
 * Đề MỚI viết theo dạng đề thật, chấm sâu hơn: nhất quán Q2↔Q3, hướng include/extend, bản số đúng phía,
 * guard của chuyển trạng thái do AI kích hoạt…
 */
import { doiDau, KHOA, NOP_BAI, CU_PHAP, tn, jsLit } from './_chung.mjs';
import { kiemTuy } from './_chung.mjs';
import { kiemNguCanh, kiemUseCase, kiemBangUC, kiemErd, kiemBangThucThe, kiemState, kiemBangState } from './_kiemmh.mjs';
import { khoiThamChieu } from './_ve.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tl = (s) => `´${String(s).replace(/^\n/, '').replace(/\s+$/, '')}\n´`;

/** Kiểm trang bìa (Q1). */
function kiemBia(duAn) {
  const C = { duAn };
  const KQ = (fn) => kiemTuy.bind(null);
  void KQ;
  const ds = [];
  ds.push(kiemTuy({ en: 'Q1 — title and project name are exactly as in the paper', vi: 'Câu 1 — tiêu đề và tên dự án đúng như đề' }, new Function(`
    if (typeof COVER === 'undefined' || !COVER) return 'COVER is missing';
    var n = function (s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
    if (n(COVER.title) !== 'software requirements specification') return 'title: "Software Requirements Specification" — VI: tiêu đề phải là "Software Requirements Specification"';
    if (n(COVER.project) !== n(${JSON.stringify(duAn)})) return 'project: copy the system name from the paper exactly — VI: chép đúng tên hệ thống trong đề';
    return 'OK';`), { nhom: 'f1' }));
  ds.push(kiemTuy({ en: 'Q1 — prepared by (full name + student ID) and organization (FPT University) filled, no placeholder', vi: 'Câu 1 — người soạn (họ tên + MSSV) và tổ chức (FPT University) đã điền, không còn chữ mẫu' }, new Function(`
    if (typeof COVER === 'undefined' || !COVER) return 'COVER is missing';
    var p = String(COVER.preparedBy || '');
    if (/[<>]|your name|tbd/i.test(p) || p.trim().split(/\\s+/).length < 3) return 'preparedBy: full name + student ID, e.g. "Nguyen Van An - SE180123" — VI: họ tên đầy đủ + MSSV';
    if (!/[A-Z]{2}\\d{5,6}/i.test(p)) return 'preparedBy: add your student ID (e.g. SE180123) — VI: thêm MSSV (vd SE180123)';
    if (!/fpt/i.test(String(COVER.organization || '')) || /[<>]/.test(String(COVER.organization))) return 'organization: "FPT University" (+ campus) — VI: tổ chức "FPT University" (+ cơ sở)';
    return 'OK';`), { nhom: 'f1' }));
  ds.push(kiemTuy({ en: 'Q1 — version and date created are real values', vi: 'Câu 1 — phiên bản và ngày tạo là giá trị thật' }, new Function(`
    if (typeof COVER === 'undefined' || !COVER) return 'COVER is missing';
    if (!/\\b\\d+\\.\\d+\\b/.test(String(COVER.version || ''))) return 'version: e.g. "1.0" — VI: phiên bản, vd "1.0"';
    var d = String(COVER.dateCreated || '').trim(), m = /^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(d) || /^(\\d{2})\\/(\\d{2})\\/(\\d{4})$/.exec(d);
    if (!m) return 'dateCreated: a real date, "2026-11-05" or "05/11/2026" — VI: ngày thật';
    return 'OK';`), { nhom: 'f1' }));
  void C;
  return ds;
}

/**
 * pe = {
 *   so, slug, tieuDe, ten, phu:{en,vi}, baiHoc, maDe (vd 'SWR302_PE_P1'), duAn (tên hệ thống),
 *   boiCanh:{en,vi} (HTML), q2:{ cfg, giai }, q3:{ cfg, giaiUC, giaiActors, giaiUCs },
 *   q4:{ loai:'erd'|'state', de:{en,vi}, cfg, giai, giaiBang, cfgBang? },
 *   truDiem[], goiY[], loiHayGap[], giaiThich:{en,vi} (thêm sau phần hình), boYeu[], kiemThem[] (kiểm riêng của đề)
 * }
 */
export function deThiPE(pe) {
  const { q2, q3, q4 } = pe;
  const laErd = q4.loai === 'erd';
  const BIEN4 = laErd ? 'ERD' : 'STATE_DIAGRAM', BANG4 = laErd ? 'ENTITIES' : 'STATES';
  const KIEM = [
    ...kiemBia(pe.duAn),
    ...kiemNguCanh({ ...q2.cfg, bien: 'CONTEXT_DIAGRAM', nhom: { cuPhap: 'f2', thanhPhan: 'f3', luong: 'f4' } }),
    ...kiemUseCase({ ...q3.cfg, bien: 'USE_CASE_DIAGRAM', bienNguCanh: 'CONTEXT_DIAGRAM', nhom: { cuPhap: 'f5', actor: 'f6', ucs: 'f7', quanHe: 'f7' } }),
    ...kiemBangUC({ bien: 'USE_CASE_DIAGRAM', nhom: { bang: 'f7' } }).map((k, i) => (i === 0 ? { ...k, nhom: 'f6' } : k)),
    ...(laErd
      ? [
        ...kiemErd({ ...q4.cfg, bien: 'ERD', nhom: { cuPhap: 'f8', thanhPhan: 'f9', quanHe: 'f9' } }),
        ...kiemBangThucThe({ bien: 'ERD', bienBang: 'ENTITIES', nhom: 'f10' }),
      ]
      : [
        ...kiemState({ ...q4.cfg, bien: 'STATE_DIAGRAM', nhom: { cuPhap: 'f8', thanhPhan: 'f9', chuyen: 'f9' } }),
        ...kiemBangState({ bien: 'STATE_DIAGRAM', bienBang: 'STATES', nhom: 'f10' }),
      ]),
    ...(pe.kiemThem || []),
  ];
  // kiểm ẩn: nửa sau của các kiểm phủ use case + quan hệ (như đề thật: chấm khi nộp)
  const an = new Set();
  const ucKiem = KIEM.filter((k) => k.nhom === 'f7' && /coverage|«/.test(k.moTa.en));
  ucKiem.slice(Math.ceil(ucKiem.length / 2)).forEach((k) => an.add(k));
  const KIEM2 = KIEM.map((k) => (an.has(k) ? { ...k, an: true } : k));

  const tep = {
    'answers/q1-cover.js': [
      `// Question 1 — the cover page of the SRS template (Wiegers): fill every field, remove every <placeholder>.
const COVER = {
  title: 'Software Requirements Specification',
  project: '<Project name>',
  version: '<1.0>',
  preparedBy: '<Your full name - Student ID>',
  organization: '<Organization>',
  dateCreated: '<yyyy-mm-dd>',
};
`,
      `// Question 1 — copy the system name EXACTLY from the paper; the grader cannot know your name, any real one passes.
const COVER = {
  title: 'Software Requirements Specification',
  project: ${jsLit(pe.duAn)},
  version: '1.0',
  preparedBy: 'Nguyen Van An - SE180123',
  organization: 'FPT University, Ho Chi Minh City campus',
  dateCreated: '2026-11-05',
};
`],
    'answers/q2-context.js': [
      `// Question 2 — context diagram as a Mermaid flowchart (paste into https://mermaid.live to see it).
// The system = ONE circle. External entities = rectangles. One labelled arrow per direction; label = the DATA.
const CONTEXT_DIAGRAM = ´
flowchart LR
  S((System name))
  E1[External entity] -->|data in| S
  S -->|data out| E1
´;
`,
      `// Question 2 — context diagram (Mermaid). Every external entity of the paper, data flows both ways, noun-phrase labels.
const CONTEXT_DIAGRAM = ${tl(q2.giai)};
`],
    'answers/q3-usecases.js': [
      `// Question 3 — use case diagram (PlantUML: paste into https://www.plantuml.com/plantuml) + the two tables of the template.
const USE_CASE_DIAGRAM = ´
@startuml
left to right direction
actor "Actor name" as A1
rectangle "System name" {
  usecase "Verb Object" as UC1
}
A1 --> UC1
@enduml
´;

// Table "# | Actor | Description" — one object per actor of the diagram (same names).
const ACTORS = [
  { name: 'Actor name', description: '' },
];

// Table "# | Use Case | Actors | Description" — one object per use case (same names as the diagram).
const USE_CASES = [
  { id: 'UC-01', name: 'Verb Object', actors: ['Actor name'], description: '' },
];
`,
      `// Question 3 — use case diagram consistent with Question 2 (same actors), plus the actor and use case tables.
const USE_CASE_DIAGRAM = ${tl(q3.giaiUC)};

const ACTORS = ${jsLit(q3.giaiActors)};

const USE_CASES = ${jsLit(q3.giaiUCs)};
`],
    [`answers/q4-${laErd ? 'erd' : 'state'}.js`]: laErd ? [
      `// Question 4 — conceptual ERD (Mermaid erDiagram) + the entity table of the template.
const ERD = ´
erDiagram
  ENTITY_A ||--o{ ENTITY_B : verb
  ENTITY_A {
    string entityAId PK
    string name
  }
´;

// Table "# | Entity | Description" (+ key attributes) — one object per entity of the ERD.
const ENTITIES = [
  { name: 'ENTITY_A', description: '', attributes: ['entityAId'] },
];
`,
      `// Question 4 — conceptual ERD: identifiers + key attributes, cardinality on both ends, verb labels, no foreign keys.
const ERD = ${tl(q4.giai)};

const ENTITIES = ${jsLit(q4.giaiBang)};
`] : [
      `// Question 4 — state transition diagram (Mermaid stateDiagram-v2) + the state table of the template.
const STATE_DIAGRAM = ´
stateDiagram-v2
  [*] --> FirstState
  FirstState --> SecondState : event [guard] / action
  SecondState --> [*]
´;

// Table "# | State | Description" — one object per state of the diagram.
const STATES = [
  { name: 'FirstState', description: '' },
];
`,
      `// Question 4 — state machine of the object: conditions as states, event [guard] / action on every transition.
const STATE_DIAGRAM = ${tl(q4.giai)};

const STATES = ${jsLit(q4.giaiBang)};
`],
  };
  const khoiDau = {}, loiGiai = {};
  for (const [t, [d, g]] of Object.entries(tep)) { khoiDau[t] = d; loiGiai[t] = g; }

  const LOAI4 = laErd ? { en: 'Conceptual ERD + entity table', vi: 'ERD khái niệm + bảng thực thể' } : { en: 'State transition diagram + state table', vi: 'Sơ đồ chuyển trạng thái + bảng trạng thái' };
  const BAN_IN = {
    tieuDe: `SWR302 — PE Practice ${pe.so}: ${pe.duAn}`,
    phu: pe.phu,
    moTa: {
      en: `<p><b>${esc(pe.maDe)} — ${esc(pe.duAn)}</b></p>${pe.boiCanh.en}
<p><b>IMPORTANT NOTES (as on the real paper).</b> All answers in <b>English</b>, in the provided template, and they must reflect THIS paper — unrelated content gets zero for that question. 90 minutes. In the real exam you draw with Visual Paradigm or draw.io offline and paste screenshots; here you write each diagram as text in the syntax of a real tool, so the grader can read it.</p>
<p><b>What this practice paper checks beyond the real one:</b> names are consistent across Q2 → Q3 → Q4; «include»/«extend» point the right way; ${laErd ? 'the "many" end of each relationship sits on the right entity and many-to-many links that carry their own data are split' : 'the AI-triggered transitions carry their guard conditions and every state is reachable'}.</p>`,
      vi: `<p><b>${esc(pe.maDe)} — ${esc(pe.duAn)}</b></p>${pe.boiCanh.vi}
<p><b>LƯU Ý QUAN TRỌNG (như đề thật).</b> Mọi câu trả lời bằng <b>tiếng Anh</b>, trong template được cấp, và phải bám đề NÀY — nội dung không liên quan bị 0 điểm câu đó. 90 phút. Thi thật bạn vẽ bằng Visual Paradigm hoặc draw.io offline rồi dán ảnh; ở đây bạn viết sơ đồ bằng chữ theo cú pháp công cụ thật để máy chấm đọc được.</p>
<p><b>Đề luyện này chấm sâu hơn đề thật ở:</b> tên nhất quán Câu 2 → 3 → 4; «include»/«extend» đúng chiều; ${laErd ? 'phía "nhiều" của mỗi quan hệ đặt đúng thực thể và nhiều–nhiều mang dữ liệu riêng phải tách' : 'chuyển trạng thái do AI kích hoạt có guard và mọi trạng thái tới được'}.</p>`,
    },
    chucNangChinh: [
      { en: '<b>Question 1 (0.5 point)</b> — complete the first page of the SRS template.', vi: '<b>Câu 1 (0.5 điểm)</b> — hoàn thành trang đầu của template SRS.' },
      { en: `<b>Question 2 (2.5 points)</b> — draw a <b>context diagram</b> describing the scope of ${esc(pe.duAn)}: every external entity and its data flows.`, vi: `<b>Câu 2 (2.5 điểm)</b> — vẽ <b>sơ đồ ngữ cảnh</b> mô tả phạm vi của ${esc(pe.duAn)}: mọi thực thể ngoài và luồng dữ liệu.` },
      { en: '<b>Question 3 (4.0 points)</b> — based on Q2, draw a <b>use case diagram</b> and briefly describe all actors and use cases in the two tables.', vi: '<b>Câu 3 (4.0 điểm)</b> — dựa trên Câu 2, vẽ <b>sơ đồ use case</b> và mô tả ngắn mọi actor, use case trong hai bảng.' },
      { en: `<b>Question 4 (3.0 points)</b> — based on Q2 and Q3, ${q4.de.en}`, vi: `<b>Câu 4 (3.0 điểm)</b> — dựa trên Câu 2 và 3, ${q4.de.vi}` },
    ],
    yeuCauChung: [
      { en: 'Use the names of the paper. The same actor must carry the same name in Q2, Q3 and Q4.', vi: 'Dùng tên trong đề. Cùng một tác nhân phải mang cùng một tên ở Câu 2, 3 và 4.' },
      { en: 'Model what the paper says — not what a "typical" system has. Every element must be traceable to a sentence of the paper.', vi: 'Mô hình hoá điều đề nói — không phải điều một hệ thống "thường" có. Mọi phần tử phải truy được về một câu trong đề.' },
      { en: 'Delete every hint of the template (<…>) before you submit.', vi: 'Xoá mọi chữ hướng dẫn của template (<…>) trước khi nộp.' },
    ],
    cayThuMuc: `answers/
├── q1-cover.js        ← Question 1 : const COVER = { title, project, version, preparedBy, organization, dateCreated }
├── q2-context.js      ← Question 2 : const CONTEXT_DIAGRAM = ´flowchart LR …´        (Mermaid)
├── q3-usecases.js     ← Question 3 : const USE_CASE_DIAGRAM = ´@startuml …´        (PlantUML)
│                                     const ACTORS = [ { name, description } ]
│                                     const USE_CASES = [ { id, name, actors, description } ]
└── q4-${laErd ? 'erd.js    ' : 'state.js  '}      ← Question 4 : ${laErd ? 'const ERD = ´erDiagram …´ · const ENTITIES = [ { name, description, attributes } ]' : 'const STATE_DIAGRAM = ´stateDiagram-v2 …´ · const STATES = [ { name, description } ]'}`,
    moHinh: {
      ten: 'Answer records and diagram syntax',
      truong: [
        ['COVER', 'object', { en: 'the six fields of the cover page — project name exactly as the paper', vi: 'sáu trường của trang bìa — tên dự án đúng như đề' }],
        ['CONTEXT_DIAGRAM', 'string', CU_PHAP.context],
        ['USE_CASE_DIAGRAM', 'string', CU_PHAP.usecase],
        ['ACTORS[i]', '{ name, description }', { en: 'one row per actor of the diagram; description = who they are + what they do with the system', vi: 'mỗi actor một dòng; mô tả = họ là ai + làm gì với hệ thống' }],
        ['USE_CASES[i]', '{ id, name, actors[], description }', { en: 'id "UC-01"…; name = the diagram name; actors = the actors linked to it in the diagram', vi: 'mã "UC-01"…; tên = tên trong sơ đồ; actors = actor nối với nó trong sơ đồ' }],
        ...(laErd
          ? [['ERD', 'string', CU_PHAP.erd], ['ENTITIES[i]', '{ name, description, attributes[] }', { en: 'one row per ERD entity; attributes include its identifier', vi: 'mỗi thực thể một dòng; thuộc tính gồm cả định danh' }]]
          : [['STATE_DIAGRAM', 'string', CU_PHAP.state], ['STATES[i]', '{ name, description }', { en: 'one row per state; description = the business meaning of being in that state', vi: 'mỗi trạng thái một dòng; mô tả = ý nghĩa nghiệp vụ khi ở trạng thái đó' }]]),
      ],
    },
    duLieuMau: `// answers/q2-context.js
const CONTEXT_DIAGRAM = ´
flowchart LR
  S((Library System))
  M[Member] -->|loan request| S
  S -->|due-date reminder| M
´;
// answers/q3-usecases.js
const USE_CASE_DIAGRAM = ´
@startuml
actor Member
rectangle "Library System" {
  usecase "Borrow Book" as UC1
  usecase "Pay Late Fee" as UC2
}
Member --> UC1
UC2 ..> UC1 : <<extend>>
@enduml
´;`,
    chucNang: [
      { ten: { en: 'Q1 — SRS cover page', vi: 'Câu 1 — Trang bìa SRS' }, diem: 0.5, yeuCau: [{ en: 'Project name exactly as the paper; author with student ID, organization, version, date.', vi: 'Tên dự án đúng như đề; tác giả kèm MSSV, tổ chức, phiên bản, ngày.' }], hook: ['SRS template (Wiegers)'] },
      { ten: { en: 'Q2.1 — Context diagram notation', vi: 'Câu 2.1 — Ký pháp sơ đồ ngữ cảnh' }, diem: 0.5, moTa: CU_PHAP.context, yeuCau: [{ en: 'One process for the whole system, no data stores, no internal processes; labelled one-way arrows; labels name data.', vi: 'Một process cho cả hệ thống, không kho, không process con; mũi tên một chiều có nhãn; nhãn là dữ liệu.' }], hook: ['context diagram'] },
      { ten: { en: 'Q2.2 — External entities', vi: 'Câu 2.2 — Thực thể ngoài' }, diem: 1, yeuCau: [{ en: 'Every person, organization and external system named in the paper; nothing that is part of the system.', vi: 'Mọi người, tổ chức, hệ thống ngoài có trong đề; không gì thuộc về bên trong hệ thống.' }], hook: ['scope', 'external entity'] },
      { ten: { en: 'Q2.3 — Data flows', vi: 'Câu 2.3 — Luồng dữ liệu' }, diem: 1, yeuCau: [{ en: 'The flows the paper describes, in the right direction, for every entity.', vi: 'Các luồng đề mô tả, đúng chiều, cho mọi thực thể.' }], hook: ['data flow'] },
      { ten: { en: 'Q3.1 — UML use case syntax', vi: 'Câu 3.1 — Cú pháp UML use case' }, diem: 1, moTa: CU_PHAP.usecase, yeuCau: [{ en: 'One boundary; actors outside; associations; «include»/«extend» only between use cases, dashed, right direction; verb-object names.', vi: 'Một biên; actor ở ngoài; association; «include»/«extend» chỉ giữa use case, nét đứt, đúng chiều; tên động từ + tân ngữ.' }], hook: ['use case diagram'] },
      { ten: { en: 'Q3.2 — Actors (+ actor table)', vi: 'Câu 3.2 — Actor (+ bảng actor)' }, diem: 1, yeuCau: [{ en: 'Every actor, consistent with Q2; internal components are not actors; each actor described.', vi: 'Đủ actor, nhất quán Câu 2; thành phần bên trong không là actor; mỗi actor có mô tả.' }], hook: ['actor'] },
      { ten: { en: 'Q3.3 — Use cases cover the paper (+ use case table)', vi: 'Câu 3.3 — Use case phủ đề (+ bảng use case)' }, diem: 2, yeuCau: [{ en: 'A use case for every goal of every actor in the paper, linked to the right actor; the required «include»/«extend»; the use case table complete and consistent.', vi: 'Mỗi mục tiêu của mỗi actor trong đề có use case, nối đúng actor; có «include»/«extend» cần thiết; bảng use case đủ và nhất quán.' }], hook: ['«include»', '«extend»'] },
      { ten: { en: `Q4.1 — ${laErd ? 'ERD notation' : 'State machine notation'}`, vi: `Câu 4.1 — ${laErd ? 'Ký pháp ERD' : 'Ký pháp máy trạng thái'}` }, diem: 1, moTa: laErd ? CU_PHAP.erd : CU_PHAP.state, yeuCau: [laErd ? { en: 'Identifiers, verb-labelled relationships with cardinality at both ends, no foreign keys.', vi: 'Có định danh, quan hệ có nhãn động từ và bản số hai đầu, không khoá ngoại.' } : { en: 'Initial and final pseudostates; states are conditions; every transition labelled event [guard] / action; all states reachable.', vi: 'Có trạng thái đầu và kết thúc; trạng thái là tình trạng; mọi chuyển ghi sự kiện [guard] / hành động; mọi trạng thái tới được.' }], hook: [laErd ? 'conceptual ERD' : 'UML state machine'] },
      { ten: { en: `Q4.2 — ${laErd ? 'Entities and relationships' : 'States and transitions'}`, vi: `Câu 4.2 — ${laErd ? 'Thực thể và quan hệ' : 'Trạng thái và chuyển trạng thái'}` }, diem: 1.25, yeuCau: [laErd ? { en: 'The core entities of the paper, the right cardinalities, associative entities where a link carries its own data.', vi: 'Đủ thực thể cốt lõi, đúng bản số, có thực thể kết hợp khi liên kết mang dữ liệu riêng.' } : { en: 'The states of the paper, the AI-triggered transitions with their guards, the user actions.', vi: 'Đủ trạng thái của đề, chuyển do AI kích hoạt kèm guard, hành động người dùng.' }], hook: [laErd ? 'cardinality' : 'guard condition'] },
      { ten: { en: `Q4.3 — ${laErd ? 'Entity table' : 'State table'}`, vi: `Câu 4.3 — ${laErd ? 'Bảng thực thể' : 'Bảng trạng thái'}` }, diem: 0.75, yeuCau: [{ en: 'One row per element of the diagram, with its business meaning.', vi: 'Mỗi phần tử của sơ đồ một dòng, kèm ý nghĩa nghiệp vụ.' }], hook: [LOAI4.en] },
    ],
    idBatBuoc: [
      ['COVER', 'answers/q1-cover.js'], ['CONTEXT_DIAGRAM', 'answers/q2-context.js'],
      ['USE_CASE_DIAGRAM · ACTORS · USE_CASES', 'answers/q3-usecases.js'],
      [`${BIEN4} · ${BANG4}`, `answers/q4-${laErd ? 'erd' : 'state'}.js`],
    ],
    truDiem: pe.truDiem,
    nopBai: NOP_BAI,
  };

  const hinh = (en) => `<h3>${en ? 'Reference answer — drawn from the solution files' : 'Đáp án tham chiếu — vẽ từ chính tệp lời giải'}</h3>
<p><b>Q2</b></p>${khoiThamChieu('luong', q2.giai, `Context diagram — ${pe.duAn}`)}
<p><b>Q3</b></p>${khoiThamChieu('uc', q3.giaiUC, `Use case diagram — ${pe.duAn}`)}
<p><b>Q4</b></p>${khoiThamChieu(laErd ? 'erd' : 'state', q4.giai, laErd ? `Conceptual ERD — ${pe.duAn}` : q4.tieuDeHinh || 'State machine', q4.viTri || null)}
<p>${en ? 'Other answers can be right too: the grader checks the properties the theory requires and the facts of the paper, not this exact picture.' : 'Đáp án khác vẫn có thể đúng: máy chấm kiểm thuộc tính lý thuyết đòi và sự kiện của đề, không ép đúng bức hình này.'}</p>`;

  return doiDau({
    slug: pe.slug,
    ten: pe.ten,
    moTaModule: pe.moTaModule,
    capDo: 'ADVANCED',
    khoa: KHOA,
    baiHoc: pe.baiHoc || 'swr302-final-exam-pe',
    de: [{
      dangBai: 'pe',
      tieuDe: pe.tieuDe,
      doKho: 'HARD', phut: 90, diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['SRS cover page', 'context diagram', 'use case diagram', laErd ? 'conceptual ERD' : 'state transition diagram', '«include» / «extend»', laErd ? 'cardinality' : 'guard condition'],
      tienQuyet: ['SWR302 Chapter 4 (analysis & modeling)', 'LAB L.2–L.5'],
      the: ['swr302', 'pe', 'exam-practice', laErd ? 'erd' : 'state-diagram'],
      banIn: BAN_IN,
      viDu: [{ input: 'Q2: S((FreshBox)) · C[Customer] -->|meal selection| S', output: 'Q2.1 notation 0.5/0.5 · Q2.2 entities 1/1 · Q2.3 flows 1/1', explanation: 'Each question is graded per rubric line, like the real paper.|||Mỗi câu chấm theo từng dòng rubric như đề thật.' }],
      thuatNgu: [...tn('contextDiagram', 'externalEntity', 'dataFlow', 'useCase', 'actor', 'include', 'extend', 'systemBoundary'), ...(laErd ? tn('erd', 'cardinality', 'associativeEntity') : tn('stateDiagram', 'guard'))],
      goiY: pe.goiY,
      loiHayGap: pe.loiHayGap,
      moTaNgan: pe.moTaNgan,
      giaiThich: { en: `${pe.giaiThich.en}${hinh(true)}`, vi: `${pe.giaiThich.vi}${hinh(false)}` },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(tep), kiem: KIEM2 },
      khoiDau, loiGiai,
      ...(pe.boYeu ? { boYeu: pe.boYeu } : {}),
    }],
  });
}

/**
 * CTW Diagram — phần THUẦN: kiểm cú pháp, dựng sơ đồ từ dữ liệu (UC ⇒ sequence/activity/use case, repo ⇒ ERD/class/
 * deployment), kiểm "mọi thực thể có nguồn" + gắn "(assumed)", nhập draw.io/Excalidraw/Mermaid, đặt vào Report 3/4,
 * đồng bộ khối nhúng. Khi có `frontend/node_modules/mermaid` thì sơ đồ sinh ra còn được `mermaid.parse` THẬT.
 *   npx tsx --test src/services/work/diagrams.test.ts
 */

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { describe, it } from 'node:test';
import {
  checkDiagram, embedSource, erEntities, lintMermaid, markAssumed, mermaidKind, normalizeExcalidraw, parseEmbed, sequenceBlocks,
  sequenceParticipants, typeFromMermaid,
} from './diagram.js';
import {
  activityFromUc, branchCount, classDiagram, deploymentFromCompose, erdFromModel, parseBranches, parseClasses, parseCompose,
  parseJpaEntities, parseNormalFlow, parsePrismaSchema, parseSqlDdl, screenFlowDiagram, sequenceFromUc, stateFromWorkflow, useCaseDiagram,
} from './diagramGen.js';
import { renderSequence, renderState, seqOut } from './diagramAi.js';
import { excalidrawToIr, importFile, irToMermaid, parseDrawio } from './diagramImport.js';
import { applyDiagramFill, isPlaced, syncEmbedsInDoc, type PlacedDiagram } from './diagramFill.js';
import type { PmNode } from './docMarkdown.js';
import type { ActorLite, RuleLite, UseCaseLite } from './srs.js';

const actors: ActorLite[] = [
  { id: 1, name: 'Student', description: null, kind: 'PERSON', position: 0 },
  { id: 2, name: 'Lab Manager', description: null, kind: 'PERSON', position: 1 },
  { id: 3, name: 'Email Service', description: null, kind: 'SYSTEM', position: 2 },
];
const rules: RuleLite[] = [
  { id: 1, number: 1, name: 'Booking window', definition: 'Bookings at most 7 days ahead', category: null, status: 'APPROVED' },
  { id: 2, number: 2, name: 'One active booking', definition: 'A student holds one active booking', category: null, status: 'APPROVED' },
];
const uc: UseCaseLite = {
  id: 10, number: 5, name: 'Reserve Lab', feature: 'Booking', description: 'Student books a lab slot', trigger: null, preconditions: 'Logged in',
  postconditions: 'Reservation is PENDING',
  normalFlow: '1. Student opens the booking page\n2. System displays free slots\n3. Student selects a slot and submits\n4. System validates the booking (BR-01, BR-02)\n5. System saves the reservation\n6. System sends a confirmation to the Lab Manager',
  alternativeFlows: '3A. No free slot\n3A.1 System shows "no slot" message\n3A.2 Return to step 1\n3B. Student cancels\n3B.1 System closes the form',
  exceptionFlows: '4E. Rule violated\n4E.1 System shows the violated rule',
  priority: 'HIGH', status: 'APPROVED', primaryActorId: 1, secondaryActorIds: [2], ruleNumbers: [1, 2], issueKey: 'LAB-3',
};

// mermaid THẬT (nếu cài ở frontend) — chỉ sequence/er/flowchart parse được ngoài DOM.
const MERMAID = path.resolve('frontend/node_modules/mermaid/dist/mermaid.core.mjs');
let realParse: ((s: string) => Promise<unknown>) | null = null;
async function parseReal(src: string) {
  if (!existsSync(MERMAID)) return true;
  if (!realParse) {
    // Ngoài trình duyệt DOMPurify không có addHook/sanitize ⇒ thay bằng hàm rỗng (chỉ để PARSE, không vẽ).
    const dp = (await import(path.resolve('frontend/node_modules/dompurify/dist/purify.es.mjs'))).default as Record<string, unknown>;
    if (typeof dp.addHook !== 'function') Object.assign(dp, { addHook: () => undefined, removeHook: () => undefined, removeHooks: () => undefined, sanitize: (s: string) => s });
    const m = (await import(MERMAID)).default as { parse: (s: string) => Promise<unknown> }; realParse = (s) => m.parse(s); }
  await realParse(src);
  return true;
}

describe('CTW Diagram — kiểm cú pháp', () => {
  it('dò loại + lint sequence/er/flowchart', () => {
    assert.equal(mermaidKind('---\ntitle: "x"\n---\nsequenceDiagram\n  A->>B: hi'), 'sequence');
    assert.equal(typeFromMermaid('erDiagram\n  A ||--o{ B : has'), 'ERD');
    assert.ok(lintMermaid('sequenceDiagram\n  A->>B: hi\n  alt x\n    B-->>A: ok\n  else y\n    B-->>A: no\n  end').ok);
    const bad = lintMermaid('sequenceDiagram\n  A->>B: hi\n  opt x\n  B-->>A ok');
    assert.equal(bad.ok, false);
    assert.ok(bad.errors.some((e) => /never closed/.test(e.message)));
    assert.ok(bad.errors.some((e) => /A->>B: text/.test(e.message)));
    assert.equal(lintMermaid('erDiagram\n  USER ||--o{ ORDER : places\n  USER {\n    int id PK\n  }').ok, true);
    assert.equal(lintMermaid('erDiagram\n  USER --o{ ORDER : places').ok, false);
    assert.equal(lintMermaid('flowchart LR\n  subgraph S["x"]\n  A["a"] --> B\n').ok, false);
    assert.equal(lintMermaid('nonsense\nA-->B').ok, false);
    assert.equal(lintMermaid('flowchart LR\n  click A "javascript:alert(1)"').ok, false);
  });
});

describe('CTW Diagram — sequence từ UC', () => {
  it('đọc luồng chính/thay thế/ngoại lệ', () => {
    assert.equal(parseNormalFlow(uc.normalFlow).length, 6);
    const alt = parseBranches(uc.alternativeFlows, 'ALT');
    assert.deepEqual(alt.map((b) => [b.code, b.at, b.returnTo]), [['3A', 3, 1], ['3B', 3, null]]);
    assert.deepEqual(parseBranches(uc.exceptionFlows, 'EXC').map((b) => [b.code, b.at]), [['4E', 4]]);
    assert.equal(branchCount(uc), 3);
  });

  it('participant đúng actor + hệ thống; alt/else ở bước 3, break ở bước 4; BR thành Note', async () => {
    const b = sequenceFromUc({ uc, actors, rules, systemName: 'LabFlow' });
    const parts = [...sequenceParticipants(b.mermaid).values()].map((p) => p.label);
    assert.deepEqual(parts.sort(), ['Lab Manager', 'LabFlow', 'Student']);
    const lines = b.mermaid.split('\n').map((l) => l.trim());
    const s3 = lines.findIndex((l) => /^U->>SYS: Selects a slot/.test(l));
    const alt = lines.findIndex((l) => l.startsWith('alt 3A'));
    const brk = lines.findIndex((l) => l.startsWith('break 4E'));
    const s4 = lines.findIndex((l) => /Validates the booking/.test(l));
    assert.ok(s3 >= 0 && alt === s3 + 1, b.mermaid);
    assert.ok(lines.includes('else 3B Student cancels'));
    assert.ok(s4 > alt && brk > s4, b.mermaid);
    assert.ok(lines.some((l) => /^Note over SYS: BR-01 Booking window$/.test(l)));
    assert.ok(lines.some((l) => /^SYS-->>A1: Sends a confirmation to the Lab Manager$/.test(l)), b.mermaid);
    assert.ok(lines.some((l) => l === 'Note over SYS: Back to step 1'));
    const c = checkDiagram({ type: 'SEQUENCE', mermaid: b.mermaid, allowed: b.allowed, structural: b.structural, ucNumbers: [5], brNumbers: [1, 2], minBranches: 3 });
    assert.equal(c.ok, true, c.errors.join());
    assert.deepEqual(c.unknown, []);
    assert.ok(await parseReal(b.mermaid));
  });

  it('kiểm: thiếu nhánh ⇒ lỗi; tên lạ ⇒ unknown ⇒ markAssumed gắn "(assumed)"; BR không có ⇒ lỗi', async () => {
    const llm = seqOut.parse({
      participants: [{ id: 'U', name: 'Student', kind: 'actor' }, { id: 'SYS', name: 'LabFlow' }, { id: 'PG', name: 'Payment Gateway' }],
      items: [{ type: 'msg', from: 'U', to: 'SYS', text: 'Submit' }, { type: 'msg', from: 'SYS', to: 'PG', text: 'Charge' }, { type: 'note', over: 'SYS', text: 'BR-09 Fake' }],
    });
    const r = renderSequence(llm, 'Reserve Lab');
    const c = checkDiagram({ type: 'SEQUENCE', mermaid: r.mermaid, allowed: ['Student', 'LabFlow', 'Lab Manager'], structural: ['SYS'], ucNumbers: [5], brNumbers: [1, 2], minBranches: 3 });
    assert.equal(c.ok, false);
    assert.ok(c.errors.some((e) => /3 alternative\/exception/.test(e)));
    assert.deepEqual(c.badRefs, ['BR-09']);
    assert.deepEqual(c.unknown.map((u) => u.label), ['Payment Gateway']);
    const marked = markAssumed(r.mermaid, c.unknown.map((u) => u.id));
    assert.match(marked, /participant PG as Payment Gateway \(assumed\)/);
    const again = checkDiagram({ type: 'SEQUENCE', mermaid: marked, allowed: ['Student', 'LabFlow'], structural: ['SYS'] });
    assert.deepEqual(again.unknown, []);
    assert.ok(await parseReal(marked));
  });

  it('JSON có khối opt nhiều nhánh ⇒ mỗi nhánh một khối', () => {
    const r = renderSequence(seqOut.parse({ participants: [{ id: 'U', name: 'Student' }, { id: 'S', name: 'LabFlow' }], items: [{ type: 'block', kind: 'opt', branches: [{ label: 'a', items: [{ type: 'msg', from: 'U', to: 'S', text: 'x' }] }, { label: 'b', items: [] }] }] }), 't');
    assert.equal(sequenceBlocks(r.mermaid).filter((b) => b.kw === 'opt').length, 2);
    assert.ok(lintMermaid(r.mermaid).ok);
  });
});

describe('CTW Diagram — dựng từ dữ liệu', () => {
  it('use case: actor, UC trong khung hệ thống, PROPOSED bị bỏ', async () => {
    const b = useCaseDiagram({ actors, useCases: [uc, { ...uc, id: 11, number: 6, name: 'Secret', status: 'PROPOSED' }], systemName: 'LabFlow' });
    assert.match(b.mermaid, /UC5\(\["UC-05 Reserve Lab"\]\)/);
    assert.doesNotMatch(b.mermaid, /Secret/);
    assert.match(b.mermaid, /ACT1 --- UC5/);
    assert.match(b.mermaid, /ACT2 -\.- UC5/); // actor phụ là người ⇒ cột trái, nét đứt
    assert.ok(checkDiagram({ type: 'USE_CASE', mermaid: b.mermaid, allowed: b.allowed, structural: b.structural }).ok);
    assert.ok(await parseReal(b.mermaid));
  });

  it('activity từ UC: người làm trên nút («actor»), rẽ nhánh ở bước 3, ngoại lệ về Stop', async () => {
    const b = activityFromUc({ uc, actors, rules, systemName: 'LabFlow' });
    assert.match(b.mermaid, /S1\["«Student»<br\/>1\. Opens the booking page"\]/);
    assert.match(b.mermaid, /class S1,S3,.*actorStep|class S1,S3 actorStep/);
    assert.match(b.mermaid, /S3 --> D3/);
    assert.match(b.mermaid, /BN3A_\d --> S1/);
    assert.match(b.mermaid, /--> FAIL/);
    assert.ok(lintMermaid(b.mermaid).ok);
    assert.ok(await parseReal(b.mermaid));
  });

  it('screen flow + state từ workflow', async () => {
    const s = screenFlowDiagram({ screens: [{ id: 1, name: 'Login', feature: null, description: null, position: 0 }, { id: 2, name: 'Home', feature: null, description: null, position: 1 }], links: [{ fromId: 1, toId: 2, label: 'Sign in' }], systemName: 'X' });
    assert.match(s.mermaid, /SC1 -->\|"Sign in"\| SC2/);
    assert.ok(await parseReal(s.mermaid));
    const st = stateFromWorkflow({ name: 'Default', statuses: [{ id: 1, name: 'To Do', category: 'TODO', position: 0 }, { id: 2, name: 'Done', category: 'DONE', position: 1 }], transitions: [{ fromStatusId: 1, toStatusId: 2, name: 'Finish' }] });
    assert.match(st.mermaid, /\[\*\] --> S1/);
    assert.match(st.mermaid, /S1 --> S2 : Finish/);
    assert.match(st.mermaid, /S2 --> \[\*\]/);
    assert.ok(lintMermaid(st.mermaid).ok);
    const tr = renderState('Reservation', ['PENDING', 'APPROVED'], { transitions: [{ from: '[*]', to: 'PENDING', event: 'Submit', evidence: 'UC-05 step 3' }, { from: 'PENDING', to: 'APPROVED', event: 'Approve', evidence: '' }, { from: 'PENDING', to: 'GHOST', event: 'x', evidence: 'y' }] }, 'schema.prisma');
    assert.deepEqual(tr.dropped, ['PENDING → GHOST']);
    assert.match(tr.mermaid, /PENDING --> APPROVED : Approve \(assumed\)/);
  });

  it('ERD từ Prisma / Flyway SQL / JPA — khoá + quan hệ đúng chiều', async () => {
    const pr = parsePrismaSchema(`model Lab {\n  id Int @id\n  name String @unique\n  reservations Reservation[]\n}\nmodel Reservation {\n  id Int @id\n  labId Int\n  note String?\n  lab Lab @relation(fields: [labId], references: [id])\n}\nenum ReservationStatus { PENDING APPROVED }`);
    assert.deepEqual(pr.tables.map((t) => t.name), ['Lab', 'Reservation']);
    assert.ok(pr.tables[1].columns.find((c) => c.name === 'labId')!.fk);
    assert.deepEqual(pr.enums[0].values, ['PENDING', 'APPROVED']);
    const e = erdFromModel(pr, { title: 'ERD', sourceLabel: 'prisma/schema.prisma @ a/b' });
    assert.match(e.mermaid, /Lab \|\|--o\{ Reservation : "lab"/);
    assert.match(e.mermaid, /title: "ERD — source - prisma\/schema.prisma @ a\/b"|title: "ERD — source: prisma\/schema.prisma @ a\/b"/);
    assert.deepEqual([...erEntities(e.mermaid).keys()], ['Lab', 'Reservation']);
    assert.ok(await parseReal(e.mermaid));
    const sql = parseSqlDdl([
      { path: 'db/migration/V1__init.sql', text: 'CREATE TABLE labs (id BIGSERIAL PRIMARY KEY, name VARCHAR(80) NOT NULL UNIQUE);\nCREATE TABLE bookings (id BIGSERIAL PRIMARY KEY, lab_id BIGINT NOT NULL REFERENCES labs(id), at TIMESTAMP);' },
      { path: 'db/migration/V2__users.sql', text: 'CREATE TABLE users (id BIGINT PRIMARY KEY);\nALTER TABLE bookings ADD COLUMN user_id BIGINT;\nALTER TABLE bookings ADD CONSTRAINT fk_u FOREIGN KEY (user_id) REFERENCES users(id);' },
    ]);
    assert.deepEqual(sql.tables.map((t) => t.name).sort(), ['bookings', 'labs', 'users']);
    assert.equal(sql.relations.length, 2);
    assert.ok(await parseReal(erdFromModel(sql, { title: 'ERD', sourceLabel: 'flyway' }).mermaid));
    const jpa = parseJpaEntities([
      { path: 'src/main/java/x/entity/Lab.java', text: '@Entity\n@Table(name = "labs")\npublic class Lab {\n  @Id @GeneratedValue private Long id;\n  @Column(name = "lab_name", nullable = false) private String name;\n  @OneToMany(mappedBy = "lab") private List<Booking> bookings;\n}' },
      { path: 'src/main/java/x/entity/Booking.java', text: '@Entity\npublic class Booking {\n  @Id private Long id;\n  @ManyToOne @JoinColumn(name = "lab_id", nullable = false) private Lab lab;\n}\nenum BookingStatus { PENDING, DONE }' },
    ]);
    assert.deepEqual(jpa.tables.map((t) => t.name), ['Lab', 'Booking']);
    assert.ok(jpa.tables[1].columns.find((c) => c.name === 'lab_id')!.fk);
    assert.deepEqual(jpa.relations.map((r) => `${r.from}->${r.to}`), ['Booking->Lab']);
    assert.ok(await parseReal(erdFromModel(jpa, { title: 'ERD', sourceLabel: 'jpa' }).mermaid));
  });

  it('class từ Java + deployment từ docker-compose', async () => {
    const cls = parseClasses([{ path: 'src/BookingService.java', text: '@Service\npublic class BookingService implements Booker {\n  private BookingRepository repo;\n  public Booking create(Long labId, Long userId) { return null; }\n}\npublic interface Booker { }\npublic interface BookingRepository { }' }]);
    assert.deepEqual(cls.map((c) => c.name), ['BookingService', 'Booker', 'BookingRepository']);
    const cd = classDiagram(cls, { title: 'Classes', sourceLabel: 'repo' });
    assert.match(cd.mermaid, /Booker <\|\.\. BookingService/);
    assert.match(cd.mermaid, /BookingService --> BookingRepository : repo/);
    assert.ok(lintMermaid(cd.mermaid).ok, JSON.stringify(lintMermaid(cd.mermaid).errors));
    const svc = parseCompose('services:\n  api:\n    build: .\n    ports:\n      - "8080:8080"\n    depends_on:\n      - db\n  db:\n    image: postgres:16\nvolumes:\n  data:\n');
    assert.deepEqual(svc.map((s) => [s.name, s.ports, s.dependsOn]), [['api', ['8080:8080'], ['db']], ['db', [], []]]);
    const dep = deploymentFromCompose(svc, { file: 'docker-compose.yml', repo: 'a/b' });
    assert.match(dep.mermaid, /SV_db\[\("db/);
    assert.match(dep.mermaid, /SV_api --> SV_db/);
    const c = checkDiagram({ type: 'DEPLOYMENT', mermaid: dep.mermaid, allowed: dep.allowed, structural: dep.structural });
    assert.deepEqual(c.unknown, [], 'Web browser đã gắn (assumed)');
    assert.ok(await parseReal(dep.mermaid));
  });
});

describe('CTW Diagram — nhập tệp', () => {
  const drawio = `<mxfile><diagram name="Flow"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>
<mxCell id="a" value="Start &amp;amp; login" style="ellipse;" vertex="1" parent="1"><mxGeometry x="0" y="0" width="80" height="40" as="geometry"/></mxCell>
<mxCell id="b" value="&lt;b&gt;Valid?&lt;/b&gt;" style="rhombus;" vertex="1" parent="1"><mxGeometry x="200" y="0" width="80" height="80" as="geometry"/></mxCell>
<object id="c" label="Save"><mxCell style="rounded=1;" vertex="1" parent="1"><mxGeometry x="400" y="0" width="80" height="40" as="geometry"/></mxCell></object>
<mxCell id="e1" edge="1" source="a" target="b" parent="1"/><mxCell id="e2" value="yes" edge="1" source="b" target="c" parent="1"/>
<mxCell id="e3" edge="1" source="c" target="a" style="startArrow=classic;endArrow=none;" parent="1"/>
</root></mxGraphModel></diagram></mxfile>`;

  it('draw.io thô ⇒ flowchart có hình thoi, nhãn cạnh, đảo chiều mũi tên chỉ có đầu', async () => {
    const [p] = parseDrawio(drawio);
    assert.deepEqual(p.nodes.map((n) => [n.label, n.shape]), [['Start & login', 'ellipse'], ['Valid?', 'rhombus'], ['Save', 'rect']]);
    assert.deepEqual(p.edges.map((e) => `${e.source}>${e.target}`), ['a>b', 'b>c', 'a>c']);
    const r = irToMermaid(p);
    assert.equal(r.type, 'ACTIVITY');
    assert.match(r.mermaid, /Valid\{"Valid\?"\}/);
    assert.match(r.mermaid, /Valid -->\|"yes"\| Save/);
    assert.ok(await parseReal(r.mermaid));
  });

  it('draw.io nén (base64+deflate) + DTD bị từ chối', () => {
    const model = /<mxGraphModel>[\s\S]*<\/mxGraphModel>/.exec(drawio)![0];
    const packed = zlib.deflateRawSync(Buffer.from(encodeURIComponent(model))).toString('base64');
    const r = importFile({ fileName: 'flow.drawio', content: `<mxfile><diagram name="P1">${packed}</diagram></mxfile>` });
    assert.equal(r.format, 'MERMAID');
    assert.match(r.source, /Save/);
    assert.throws(() => importFile({ fileName: 'x.drawio', content: '<!DOCTYPE x [<!ENTITY a "b">]><mxfile></mxfile>' }), /DTD/);
  });

  it('draw.io lifeline ⇒ sequence theo thứ tự dọc', () => {
    const x = `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>
<mxCell id="u" value="Student" style="shape=umlLifeline;" vertex="1" parent="1"><mxGeometry x="0" y="0" width="100" height="300" as="geometry"/></mxCell>
<mxCell id="s" value="System" style="shape=umlLifeline;" vertex="1" parent="1"><mxGeometry x="300" y="0" width="100" height="300" as="geometry"/></mxCell>
<mxCell id="m1" value="login" edge="1" source="u" target="s" parent="1"/></root></mxGraphModel>`;
    const r = irToMermaid(parseDrawio(x)[0]);
    assert.equal(r.type, 'SEQUENCE');
    assert.match(r.mermaid, /P1->>P2: login/);
  });

  it('Excalidraw: giữ nguyên làm bản vẽ; chuyển Mermaid theo mũi tên gắn hình', () => {
    const ex = { type: 'excalidraw', elements: [
      { id: 'r1', type: 'rectangle', x: 0, y: 0, width: 100, height: 50 }, { id: 't1', type: 'text', text: 'API', containerId: 'r1' },
      { id: 'r2', type: 'ellipse', x: 300, y: 0, width: 100, height: 50 }, { id: 't2', type: 'text', text: 'DB', containerId: 'r2' },
      { id: 'a1', type: 'arrow', startBinding: { elementId: 'r1' }, endBinding: { elementId: 'r2' }, endArrowhead: 'arrow' },
      { id: 'gone', type: 'rectangle', isDeleted: true },
    ] };
    const keep = importFile({ fileName: 'board.excalidraw', content: JSON.stringify(ex) });
    assert.equal(keep.format, 'EXCALIDRAW');
    assert.ok(normalizeExcalidraw(keep.source).ok);
    const ir = excalidrawToIr(ex);
    assert.equal(ir.nodes.length, 2);
    assert.deepEqual(ir.edges.map((e) => `${e.source}>${e.target}`), ['r1>r2']);
    const mm = importFile({ fileName: 'board.excalidraw', content: JSON.stringify(ex), to: 'mermaid' });
    assert.match(mm.source, /API --> DB/);
    assert.equal(normalizeExcalidraw('{"nope":1}').ok, false);
  });

  it('Markdown có khối mermaid', () => {
    const r = importFile({ fileName: 'notes.md', content: '# x\n```mermaid\nerDiagram\n  A ||--o{ B : has\n```\n' });
    assert.equal(r.type, 'ERD');
    assert.throws(() => importFile({ fileName: 'a.mmd', content: 'hello' }), /No Mermaid/);
  });
});

describe('CTW Diagram — Report 3/4 + khối nhúng', () => {
  const h = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level }, content: [{ type: 'text', text }] });
  const p = (text: string): PmNode => ({ type: 'paragraph', content: [{ type: 'text', text }] });
  const D = (o: Partial<PlacedDiagram>): PlacedDiagram => ({ id: 1, number: 1, title: 'x', type: 'USE_CASE', format: 'MERMAID', version: 2, source: 'flowchart LR\n  A --> B', ...o });

  it('Report 3: use case + ERD đúng mục; điền lại không nhân đôi; chữ người viết giữ nguyên', () => {
    const doc: PmNode = { type: 'doc', content: [h(4, '1.3.3 Use Case Diagrams'), p('Our diagram:'), h(3, '1.4 System Functionalities'), h(3, '1.5 Entity Relationship Diagram')] };
    const list = [D({ id: 1, number: 1, type: 'USE_CASE' }), D({ id: 2, number: 2, type: 'ERD', source: 'erDiagram\n  A ||--o{ B : has' }), D({ id: 3, number: 3, type: 'SEQUENCE' })];
    assert.deepEqual(applyDiagramFill(doc, 3, list, 9), ['useCaseDiagrams', 'erd']);
    applyDiagramFill(doc, 3, list, 9);
    const blocks = doc.content!;
    assert.equal(blocks.filter((b) => b.type === 'codeBlock').length, 2);
    assert.equal(blocks[1].content![0].text, 'Our diagram:');
    assert.deepEqual(parseEmbed(blocks[2].content![0].text!), { id: 1, mode: 'pinned', version: 2 });
    assert.ok(isPlaced(blocks[3]));
  });

  it('Report 4: Detailed Design tạo mục feature + class/sequence; bỏ mục mẫu "Feature name" trống', () => {
    const guide: PmNode = { type: 'blockquote', content: [p('Guide: describe')] };
    const doc: PmNode = { type: 'doc', content: [h(2, '1. High Level Design'), h(3, '1.1 Software Architecture'), h(3, '1.3 Database Design'), h(2, '2. Detailed Design'), h(3, '2.1 Feature name'), guide, h(4, '2.1.1 Class Diagram'), h(4, '2.1.2 Sequence Diagram'), h(2, '3. Class Specifications')] };
    const seq = D({ id: 5, number: 5, type: 'SEQUENCE', feature: 'Booking', useCase: { number: 5, name: 'Reserve Lab' }, source: 'sequenceDiagram\n  A->>B: x' });
    const dep = D({ id: 6, number: 6, type: 'DEPLOYMENT' });
    const done = applyDiagramFill(doc, 4, [seq, dep], 9);
    assert.deepEqual(done, ['architecture', 'detailedDesign']);
    const titles = doc.content!.filter((b) => b.type === 'heading').map((b) => b.content![0].text);
    assert.ok(titles.includes('2.1 Booking'), titles.join('|'));
    assert.ok(titles.includes('2.1.2 Sequence Diagram'));
    assert.ok(!titles.includes('2.1 Feature name'));
    const capIdx = doc.content!.findIndex((b) => b.type === 'paragraph' && /Figure: D-5 UC-05 Reserve Lab/.test(b.content?.[0]?.text ?? ''));
    assert.ok(capIdx > 0);
    assert.equal(titles[titles.length - 1], '3. Class Specifications');
  });

  it('khối nhúng @latest được đồng bộ, @ghim giữ nguyên; ảnh Excalidraw đổi src', async () => {
    const d = D({ id: 7, number: 7, version: 3, source: 'flowchart LR\n  X --> Y' });
    const doc: PmNode = { type: 'doc', content: [
      { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: embedSource({ ...d }, 2, 'flowchart LR\n  A --> B', 'latest') }] },
      { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: embedSource({ ...d }, 2, 'flowchart LR\n  A --> B', 'pinned') }] },
      { type: 'image', attrs: { src: '/api/v1/work/projects/9/images/1', alt: 'ctw-diagram:8@latest D-8 — board' } },
    ] };
    assert.equal(syncEmbedsInDoc(doc, d, 9), 1);
    assert.match(doc.content![0].content![0].text!, /X --> Y/);
    assert.match(doc.content![1].content![0].text!, /A --> B/);
    // front-matter phải đứng ĐẦU (mermaid chỉ nhận ở đầu) ⇒ dòng nhúng đứng sau nó.
    const fmSrc = embedSource({ id: 3, number: 3, title: 'x' }, 1, '---\ntitle: "T"\n---\nsequenceDiagram\n  A->>B: hi', 'latest');
    assert.match(fmSrc, /^---\ntitle: "T"\n---\n%% ctw-diagram:3@latest/);
    assert.deepEqual(parseEmbed(fmSrc), { id: 3, mode: 'latest', version: null });
    assert.equal(mermaidKind(fmSrc), 'sequence');
    assert.ok(await parseReal(fmSrc));
    assert.equal(syncEmbedsInDoc(doc, D({ id: 8, number: 8, format: 'EXCALIDRAW', previewImageId: 44, version: 5 }), 9), 1);
    assert.equal(doc.content![2].attrs!.src, '/api/v1/work/projects/9/images/44');
  });
});

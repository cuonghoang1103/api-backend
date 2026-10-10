/**
 * CTW đợt 9c — luật thuần của quiz: chấm từng kiểu câu, chấm từng phần, chuẩn hoá điền ngắn, trộn có seed, đề gửi SV không
 * lộ đáp án, gộp điểm nhiều lượt, thống kê câu, nhập bảng/Aiken/GIFT.
 *   npx tsx --test src/services/work/quizRules.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  aggregateScore, answersVisible, attemptDeadline, buildPaper, cleanResponse, displayAnswer, gradeItem, gradePaper, normalizeShort,
  parseAiken, parseAiQuestions, parseGift, parseQuestionTable, quizStats, seededRandom, shuffled, studentPaper, validateQuestion,
  type BankQuestion, type PaperItem, type QuizItem,
} from './quizRules.js';

function q(id: number, raw: Record<string, unknown>): BankQuestion {
  const { q: d, errors } = validateQuestion(raw);
  assert.deepEqual(errors, [], `câu ${id} hợp lệ`);
  return { ...d, id };
}
const SINGLE = q(1, { type: 'SINGLE', topic: 'Net', prompt: 'Layer 3?', points: 2, options: [{ id: 'a', text: 'Physical' }, { id: 'b', text: 'Network' }, { id: 'c', text: 'Session' }], answer: { correct: ['b'] }, explanation: 'Routers' });
const MULTI = q(2, { type: 'MULTI', topic: 'Net', prompt: 'Transport?', points: 4, options: ['TCP', 'IP', 'UDP', 'ARP'], answer: { correct: ['o1', 'o3'] }, settings: { partial: true } });
const MULTI_STRICT = q(3, { type: 'MULTI', topic: 'Net', prompt: 'Strict?', points: 2, options: ['A', 'B', 'C'], answer: { correct: ['o1', 'o2'] } });
const TF = q(4, { type: 'TRUE_FALSE', topic: 'Math', prompt: 'd/dx x^2 = 2x', points: 1, answer: { value: true } });
const SHORT = q(5, { type: 'SHORT', topic: 'Geo', prompt: 'Capital of Vietnam?', points: 1, answer: { accepted: ['Hà Nội', 'Hanoi'] } });
const SHORT_STRICT = q(6, { type: 'SHORT', topic: 'Geo', prompt: 'Case + accents?', points: 1, answer: { accepted: ['Hà Nội'] }, settings: { caseSensitive: true, accentSensitive: true } });
const MATCH = q(7, { type: 'MATCH', topic: 'Java', prompt: 'Match', points: 3, options: [{ left: 'final', right: 'constant' }, { left: 'static', right: 'class-level' }, { left: 'abstract', right: 'no body' }] });
const BANK = [SINGLE, MULTI, MULTI_STRICT, TF, SHORT, SHORT_STRICT, MATCH];
const fixedItems: QuizItem[] = BANK.map((b) => ({ kind: 'Q', questionId: b.id }));
const paperOf = (seed = 7, shuffle = false) => buildPaper(fixedItems, BANK, { shuffleQuestions: shuffle, shuffleOptions: shuffle }, seed).paper;
const item = (paper: PaperItem[], qid: number) => paper.find((p) => p.questionId === qid)!;
const optId = (p: PaperItem, src: string) => p.options!.find((o) => o.src === src)!.id;

describe('kiểm hợp lệ câu hỏi', () => {
  it('bắt lỗi từng kiểu', () => {
    assert.ok(validateQuestion({ type: 'SINGLE', prompt: 'x', options: ['a', 'b'], answer: { correct: ['o1', 'o2'] } }).errors.some((e) => /exactly one/.test(e)));
    assert.ok(validateQuestion({ type: 'MULTI', prompt: 'x', options: ['a'], answer: { correct: ['o1'] } }).errors.some((e) => /two options/.test(e)));
    assert.ok(validateQuestion({ type: 'SINGLE', prompt: 'x', options: ['a', 'A'], answer: { correct: ['o1'] } }).errors.some((e) => /same text/.test(e)));
    assert.ok(validateQuestion({ type: 'TRUE_FALSE', prompt: 'x' }).errors.length);
    assert.ok(validateQuestion({ type: 'SHORT', prompt: 'x', answer: { accepted: ['  '] } }).errors.length);
    assert.ok(validateQuestion({ type: 'MATCH', prompt: 'x', options: [{ left: 'a', right: '' }, { left: 'b', right: 'c' }] }).errors.some((e) => /missing a side/.test(e)));
    assert.ok(validateQuestion({ type: 'NOPE', prompt: 'x' }).errors.some((e) => /Unknown/.test(e)));
    assert.ok(validateQuestion({ type: 'TRUE_FALSE', prompt: 'x', answer: { value: true }, points: 0 }).errors.some((e) => /Points/.test(e)));
    assert.ok(validateQuestion({ type: 'TRUE_FALSE', prompt: 'x', answer: { value: true }, imageUrl: 'javascript:alert(1)' }).errors.some((e) => /http/.test(e)));
  });
  it('MULTI mặc định KHÔNG chấm từng phần, MATCH mặc định CÓ', () => {
    assert.equal(MULTI_STRICT.settings.partial, false);
    assert.equal(MATCH.settings.partial, true);
  });
});

describe('chấm từng kiểu câu', () => {
  const paper = paperOf();
  it('một đáp án', () => {
    const p = item(paper, 1);
    assert.equal(gradeItem(p, { choice: optId(p, 'b') }).earned, 2);
    assert.equal(gradeItem(p, { choice: optId(p, 'a') }).earned, 0);
    assert.equal(gradeItem(p, null).answered, false);
    assert.equal(gradeItem(p, { choice: 'o99' }).earned, 0, 'id lạ ⇒ 0');
  });
  it('nhiều đáp án — chấm từng phần (+1/k đúng, −1/k sai, không âm)', () => {
    const p = item(paper, 2);
    const [tcp, ip, udp, arp] = ['o1', 'o2', 'o3', 'o4'].map((s) => optId(p, s));
    assert.equal(gradeItem(p, { choices: [tcp, udp] }).earned, 4);
    assert.equal(gradeItem(p, { choices: [tcp] }).earned, 2);
    assert.equal(gradeItem(p, { choices: [tcp] }).partial, true);
    assert.equal(gradeItem(p, { choices: [tcp, ip] }).earned, 0);
    assert.equal(gradeItem(p, { choices: [tcp, udp, ip] }).earned, 2);
    assert.equal(gradeItem(p, { choices: [ip, arp] }).earned, 0, 'không âm');
  });
  it('nhiều đáp án — không từng phần: đúng hết mới có điểm', () => {
    const p = item(paper, 3);
    assert.equal(gradeItem(p, { choices: [optId(p, 'o1')] }).earned, 0);
    assert.equal(gradeItem(p, { choices: [optId(p, 'o1'), optId(p, 'o2')] }).earned, 2);
  });
  it('đúng/sai', () => {
    const p = item(paper, 4);
    assert.equal(gradeItem(p, { value: true }).earned, 1);
    assert.equal(gradeItem(p, { value: false }).earned, 0);
  });
  it('điền ngắn — không phân biệt hoa thường/dấu/khoảng trắng/dấu chấm cuối', () => {
    const p = item(paper, 5);
    for (const t of ['hà nội', 'HA NOI', '  ha   noi. ', 'Hanoi', 'hanoi!']) assert.equal(gradeItem(p, { text: t }).earned, 1, t);
    assert.equal(gradeItem(p, { text: 'Saigon' }).earned, 0);
    assert.equal(gradeItem(p, { text: '   ' }).answered, false);
  });
  it('điền ngắn — bật phân biệt hoa thường + dấu', () => {
    const p = item(paper, 6);
    assert.equal(gradeItem(p, { text: 'Hà Nội' }).earned, 1);
    assert.equal(gradeItem(p, { text: 'hà nội' }).earned, 0);
    assert.equal(gradeItem(p, { text: 'Ha Noi' }).earned, 0);
  });
  it('ghép cặp — chấm theo từng cặp', () => {
    const p = item(paper, 7);
    const pairs: Record<string, string> = {};
    for (const l of p.left!) pairs[l.id] = p.right!.find((r) => r.src === l.src)!.id;
    assert.equal(gradeItem(p, { pairs }).earned, 3);
    const one = Object.fromEntries(Object.entries(pairs).slice(0, 1));
    assert.equal(gradeItem(p, { pairs: one }).earned, 1);
    const ls = p.left!.map((l) => l.id);
    const swapped = { ...pairs, [ls[0]]: pairs[ls[1]], [ls[1]]: pairs[ls[0]] };
    assert.equal(gradeItem(p, { pairs: swapped }).earned, 1);
  });
  it('chuẩn hoá', () => {
    assert.equal(normalizeShort('  Đà   Nẵng. '), 'da nang');
    assert.equal(normalizeShort('Đà Nẵng', { accentSensitive: true }), 'đà nẵng');
    assert.equal(normalizeShort('Đà Nẵng', { caseSensitive: true }), 'Da Nang');
  });
  it('gradePaper: chỉnh tay thắng tự chấm, kẹp trong [0, điểm câu]', () => {
    const p = item(paper, 5);
    const r = gradePaper([p], { [p.key]: { text: 'Ha Noi city' } }, { [p.key]: 0.5 });
    assert.equal(r.score, 0.5);
    assert.equal(r.items[p.key].partial, true);
    assert.equal(gradePaper([p], {}, { [p.key]: 99 }).score, 1);
  });
});

describe('trộn có seed + đề gửi sinh viên', () => {
  it('PRNG xác định', () => {
    const a = seededRandom(42), b = seededRandom(42);
    assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
    assert.deepEqual(shuffled([1, 2, 3, 4, 5, 6], seededRandom(1)), shuffled([1, 2, 3, 4, 5, 6], seededRandom(1)));
    assert.notDeepEqual(shuffled([1, 2, 3, 4, 5, 6, 7, 8], seededRandom(1)), shuffled([1, 2, 3, 4, 5, 6, 7, 8], seededRandom(2)));
  });
  it('cùng seed ⇒ cùng đề; khác seed ⇒ thường khác thứ tự', () => {
    const p1 = paperOf(123, true), p2 = paperOf(123, true);
    assert.deepEqual(p1, p2);
    const orders = new Set([1, 2, 3, 4, 5, 6].map((s) => paperOf(s, true).map((p) => p.questionId).join(',')));
    assert.ok(orders.size > 1);
  });
  it('rút N câu theo chủ đề, không trùng câu cố định', () => {
    const items: QuizItem[] = [{ kind: 'Q', questionId: 1 }, { kind: 'DRAW', topic: 'net', count: 2 }];
    const { paper, missing } = buildPaper(items, BANK, { shuffleQuestions: false, shuffleOptions: false }, 9);
    assert.equal(missing, 0);
    assert.equal(paper.length, 3);
    assert.equal(new Set(paper.map((p) => p.questionId)).size, 3);
    assert.equal(buildPaper([{ kind: 'DRAW', topic: 'Net', count: 5 }], BANK, { shuffleQuestions: false, shuffleOptions: false }, 1).missing, 2);
  });
  it('điểm ghi đè theo mục', () => {
    const { paper } = buildPaper([{ kind: 'Q', questionId: 4, points: 5 }], BANK, { shuffleQuestions: false, shuffleOptions: false }, 1);
    assert.equal(paper[0].points, 5);
  });
  it('studentPaper KHÔNG chứa đáp án / giải thích / id gốc / cài đặt', () => {
    const paper = paperOf(5, true);
    const json = JSON.stringify(studentPaper(paper));
    for (const banned of ['"answer"', '"explanation"', '"src"', '"settings"', 'Routers', 'Hanoi', 'Hà Nội', '"correct"', '"accepted"', '"questionId"']) {
      assert.ok(!json.includes(banned), `lộ ${banned}`);
    }
    assert.ok(json.includes('Capital of Vietnam?'));
  });
  it('ghép cặp: vế phải không bao giờ thẳng hàng vế trái', () => {
    for (let s = 1; s < 40; s++) {
      const p = buildPaper([{ kind: 'Q', questionId: 7 }], BANK, { shuffleQuestions: false, shuffleOptions: false }, s).paper[0];
      assert.ok(!p.right!.every((r, j) => r.src === p.left![j].src), `seed ${s}`);
    }
  });
  it('displayAnswer nói bằng id hiển thị', () => {
    const p = item(paperOf(3, true), 2);
    const ans = displayAnswer(p).correct!;
    assert.equal(ans.length, 2);
    assert.ok(ans.every((id) => /^o\d$/.test(id)));
    assert.equal(gradeItem(p, { choices: ans }).earned, 4);
  });
  it('cleanResponse bỏ rác', () => {
    const p = item(paperOf(), 1);
    assert.equal(cleanResponse(p, { choice: 'x' }), null);
    assert.equal(cleanResponse(p, 'abc'), null);
    assert.deepEqual(cleanResponse(item(paperOf(), 4), { value: false }), { value: false });
  });
});

describe('gộp điểm + hiện đáp án + hạn', () => {
  const at = [{ score: 4, max: 10 }, { score: 9, max: 10 }, { score: 5, max: 10 }];
  it('cao nhất / lần cuối / trung bình', () => {
    assert.deepEqual(aggregateScore(at, 'HIGHEST'), { score: 9, max: 10 });
    assert.deepEqual(aggregateScore(at, 'LAST'), { score: 5, max: 10 });
    assert.deepEqual(aggregateScore(at, 'AVERAGE'), { score: 6, max: 10 });
    assert.equal(aggregateScore([], 'HIGHEST'), null);
  });
  it('hiện đáp án: ngay / sau hạn / không bao giờ', () => {
    const close = new Date('2026-10-20T10:00:00Z');
    const before = new Date('2026-10-20T09:00:00Z'), after = new Date('2026-10-20T11:00:00Z');
    assert.equal(answersVisible('IMMEDIATE', close, true, before), true);
    assert.equal(answersVisible('IMMEDIATE', close, false, after), false, 'chưa nộp thì không');
    assert.equal(answersVisible('AFTER_DUE', close, true, before), false);
    assert.equal(answersVisible('AFTER_DUE', close, true, after), true);
    assert.equal(answersVisible('NEVER', close, true, after), false);
  });
  it('hạn = min(bắt đầu + thời gian làm, giờ đóng)', () => {
    const s = new Date('2026-10-20T09:50:00Z');
    assert.equal(attemptDeadline(s, 30, new Date('2026-10-20T10:00:00Z'))!.toISOString(), '2026-10-20T10:00:00.000Z');
    assert.equal(attemptDeadline(s, 5, new Date('2026-10-20T10:00:00Z'))!.toISOString(), '2026-10-20T09:55:00.000Z');
    assert.equal(attemptDeadline(s, null, null), null);
  });
});

describe('thống kê câu', () => {
  it('độ khó, độ phân biệt, phương án nhiễu', () => {
    const paper = paperOf();
    const p1 = item(paper, 1);
    const right = optId(p1, 'b'), lure = optId(p1, 'c');
    // 8 bài: 4 giỏi chọn đúng + TF đúng; 4 yếu chọn "Session" + TF sai.
    const atts = Array.from({ length: 8 }, (_, i) => {
      const good = i < 4;
      const responses = { [p1.key]: { choice: good ? right : lure }, [item(paper, 4).key]: { value: good } };
      const g = gradePaper(paper, responses);
      return { userId: i + 1, score: g.score, max: g.max, paper, responses, items: g.items };
    });
    const s = quizStats(atts);
    assert.equal(s.attempts, 8);
    const st = s.questions.find((x) => x.questionId === 1)!;
    assert.equal(st.difficulty, 0.5);
    assert.equal(st.discrimination, 1);
    assert.equal(st.topDistractor?.text, 'Session');
    assert.equal(st.choices.find((c) => c.text === 'Session')!.count, 4);
    const blank = s.questions.find((x) => x.questionId === 5)!;
    assert.equal(blank.blank, 8);
    assert.equal(s.bins.reduce((n, b) => n + b.count, 0), 8);
  });
});

describe('nhập câu hỏi', () => {
  it('bảng theo mẫu (tiêu đề tiếng Việt cũng nhận) + lỗi từng dòng', () => {
    const rows = [
      ['Loại', 'Chủ đề', 'Câu hỏi', 'A', 'B', 'C', 'D', 'Đáp án', 'Điểm', 'Giải thích'],
      ['một', 'Net', 'Layer 3?', 'Physical', 'Network', 'Session', '', 'B', '2', 'Routers'],
      ['nhiều', 'Net', 'Transport?', 'TCP', 'IP', 'UDP', '', 'A, C', '', ''],
      ['đúng/sai', 'Math', '1+1=2', '', '', '', '', 'Đúng', '', ''],
      ['điền', 'Geo', 'Capital?', '', '', '', '', 'Hà Nội|Hanoi', '', ''],
      ['ghép', 'Java', 'Match', 'final => constant', 'static -> class', '', '', '', '', ''],
      ['single', 'Net', 'Bad answer', 'x', 'y', '', '', 'E', '', ''],
      ['weird', 'Net', 'Bad type', 'x', 'y', '', '', 'A', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
    ];
    const out = parseQuestionTable(rows);
    assert.equal(out.length, 7);
    assert.equal(out.filter((r) => r.question).length, 5);
    assert.equal(out[0].question!.points, 2);
    assert.deepEqual(out[1].question!.answer.correct, ['o1', 'o3']);
    assert.equal(out[2].question!.answer.value, true);
    assert.deepEqual(out[3].question!.answer.accepted, ['Hà Nội', 'Hanoi']);
    assert.equal((out[4].question!.options as Array<{ right: string }>)[1].right, 'class');
    assert.equal(out[5].line, 7);
    assert.ok(out[5].errors.some((e) => /does not match/.test(e)));
    assert.ok(out[6].errors.some((e) => /Unknown type/.test(e)));
    assert.ok(parseQuestionTable([['x', 'y']])[0].errors[0].includes('Question'));
  });
  it('Aiken', () => {
    const out = parseAiken('What is 2+2?\nA. 3\nB. 4\nC. 5\nANSWER: B\n\nNo answer here?\nA) x\nB) y\n\nThird?\nA. p\nB. q\nANSWER: Z\n', 'Math');
    assert.equal(out.length, 3);
    assert.deepEqual(out[0].question!.answer.correct, ['o2']);
    assert.equal(out[0].question!.topic, 'Math');
    assert.ok(out[1].errors.some((e) => /ANSWER/.test(e)));
    assert.ok(out[2].errors.length);
  });
  it('GIFT: một/nhiều đáp án, đúng/sai, điền ngắn, ghép cặp, chủ đề, giải thích, ký tự thoát', () => {
    const src = [
      '// chú thích',
      '$CATEGORY: top/Networking',
      '',
      '::Q1:: Which layer routes? { ~Physical =Network ~Session #feedback ####Routers live at layer 3 }',
      '',
      'Transport protocols? { ~%50%TCP ~%50%UDP ~%-100%IP }',
      '',
      'The sky is blue. {T}',
      '',
      'Capital of Vietnam? { =Hà Nội =Hanoi }',
      '',
      'Match: { =final -> constant =static -> class-level }',
      '',
      'Escaped \\= sign? { =a\\=b ~c }',
      '',
      'Broken question without braces',
    ].join('\n');
    const out = parseGift(src);
    assert.equal(out.length, 7);
    const [single, multi, tf, short, match, esc, broken] = out;
    assert.equal(single.question!.type, 'SINGLE');
    assert.equal(single.question!.topic, 'Networking');
    assert.equal(single.question!.explanation, 'Routers live at layer 3');
    assert.deepEqual(single.question!.answer.correct, ['o2']);
    assert.equal(multi.question!.type, 'MULTI');
    assert.deepEqual(multi.question!.answer.correct, ['o1', 'o2']);
    assert.equal(tf.question!.answer.value, true);
    assert.deepEqual(short.question!.answer.accepted, ['Hà Nội', 'Hanoi']);
    assert.equal(match.question!.type, 'MATCH');
    assert.equal((esc.question!.options as Array<{ text: string }>)[0].text, 'a=b');
    assert.ok(esc.question!.prompt.includes('Escaped = sign?'));
    assert.ok(broken.errors.length);
  });
  it('AI: JSON của model ⇒ câu hỏi; câu hỏng bị loại', () => {
    const out = parseAiQuestions('```json\n{"questions":[{"type":"SINGLE","prompt":"P?","options":["a","b","c"],"correct":[1]},{"type":"SHORT","prompt":"S?","accepted":["x"]},{"type":"SINGLE","prompt":"bad","options":["a"]}]}\n```', 'T');
    assert.equal(out.length, 3);
    assert.deepEqual(out[0].question!.answer.correct, ['o2']);
    assert.equal(out[1].question!.type, 'SHORT');
    assert.equal(out[2].question, null);
  });
});

/**
 * Phần thuần của bộ luyện Code Lab (đợt 1) — không cần CSDL.
 *   npx tsx --test src/services/codeLab.practice.test.ts
 * Phần đọc CSDL (lọc track nháp, endpoint /practice) ở src/routes/codeLab.db.test.ts.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  PRACTICE_TRACK_BY_COURSE,
  apChotLoiGiai,
  chapterPrefixOf,
  chotLoiGiai,
  countByDifficulty,
  estimateMinutes,
  fallbackTrackFor,
  isPracticeCourse,
  isSafeSlug,
  practiceTrackSlugFor,
  sortPracticeItems,
  withSolutionFlags,
  withoutSolution,
} from './codeLab.practice.js';

describe('practiceTrackSlugFor / isPracticeCourse', () => {
  it('khoá trong bảng ⇒ track khai trong bảng', () => {
    assert.equal(practiceTrackSlugFor('web-foundations'), 'web-foundations-practice');
    assert.equal(practiceTrackSlugFor('front-end-web-development-with-react'), 'fer202-practice');
    assert.equal(PRACTICE_TRACK_BY_COURSE.fer202, 'fer202-practice');
  });
  it('khoá ngoài bảng ⇒ quy ước <khoá>-practice', () => {
    assert.equal(practiceTrackSlugFor('docker'), 'docker-practice');
    assert.equal(isPracticeCourse('docker'), false);
    assert.equal(isPracticeCourse('web-foundations'), true);
    // không bị lừa bởi thuộc tính của Object.prototype
    assert.equal(isPracticeCourse('toString'), false);
  });
});

describe('isSafeSlug', () => {
  it('nhận slug thật, chặn ký tự lạ', () => {
    assert.ok(isSafeSlug('wf-3-3-flexbox'));
    assert.ok(isSafeSlug('fer202-8-1-usestate-useeffect'));
    assert.equal(isSafeSlug(''), false);
    assert.equal(isSafeSlug('-abc'), false);
    assert.equal(isSafeSlug('a/b'), false);
    assert.equal(isSafeSlug('a b'), false);
    assert.equal(isSafeSlug('x'.repeat(151)), false);
  });
});

describe('chapterPrefixOf', () => {
  it('bài slide N.0 ⇒ tiền tố chương', () => {
    assert.equal(chapterPrefixOf('wf-3-0-slides'), 'wf-3-');
    assert.equal(chapterPrefixOf('wf-12-0-slides'), 'wf-12-');
  });
  it('bài thường ⇒ null (không gộp nhầm)', () => {
    assert.equal(chapterPrefixOf('wf-3-3-flexbox'), null);
    assert.equal(chapterPrefixOf('wf-3-6-quiz'), null);
    assert.equal(chapterPrefixOf('fer202-1-3-slot1-slides'), null);
  });
});

describe('fallbackTrackFor', () => {
  it('Nền tảng Web theo chương (bảng §4.1)', () => {
    assert.equal(fallbackTrackFor('web-foundations', 'wf-0-2-web-hoat-dong'), 'html-css');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-1-3-git'), 'git');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-2-4-forms'), 'html-css');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-3-3-flexbox'), 'html-css');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-4-1-variables-types'), 'javascript');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-5-2-promises'), 'javascript');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-6-2-http-methods'), 'nodejs-express');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-8-2-select'), 'sql');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-9-1-x'), 'typescript');
    assert.equal(fallbackTrackFor('web-foundations', 'wf-10-1-x'), 'git');
  });
  it('FER202 (§4.2)', () => {
    const c = 'front-end-web-development-with-react';
    assert.equal(fallbackTrackFor(c, 'fer202-2-1-es6'), 'javascript');
    assert.equal(fallbackTrackFor(c, 'fer202-4-ex5-bootstrap'), 'html-css');
    assert.equal(fallbackTrackFor(c, 'fer202-8-1-usestate-useeffect'), 'react');
  });
  it('khoá khác ⇒ null', () => {
    assert.equal(fallbackTrackFor('docker', 'docker-1-1-intro'), null);
  });
});

describe('sortPracticeItems — luật "từ dễ đến khó"', () => {
  const rows = [
    { id: 1, difficulty: 'HARD', sortOrder: 0 },
    { id: 2, difficulty: 'EASY', sortOrder: 5 },
    { id: 3, difficulty: 'MEDIUM', sortOrder: 1 },
    { id: 4, difficulty: 'EASY', sortOrder: 1 },
    { id: 5, difficulty: 'EXPERT', sortOrder: 0 },
    { id: 6, difficulty: 'MEDIUM', sortOrder: 1 },
  ];
  it('EASY→MEDIUM→HARD→EXPERT bất kể sortOrder người soạn đặt; hoà ⇒ sortOrder rồi id', () => {
    assert.deepEqual(sortPracticeItems(rows).map((r) => r.id), [4, 2, 3, 6, 1, 5]);
  });
  it('không đổi mảng gốc', () => {
    const copy = rows.map((r) => r.id);
    sortPracticeItems(rows);
    assert.deepEqual(rows.map((r) => r.id), copy);
  });
  it('gộp chương: cùng độ khó thì theo thứ tự module trước', () => {
    const r = sortPracticeItems([
      { id: 10, difficulty: 'EASY', sortOrder: 0, moduleSortOrder: 2 },
      { id: 11, difficulty: 'EASY', sortOrder: 9, moduleSortOrder: 1 },
      { id: 12, difficulty: 'MEDIUM', sortOrder: 0, moduleSortOrder: 0 },
    ]);
    assert.deepEqual(r.map((x) => x.id), [11, 10, 12]);
  });
});

describe('countByDifficulty / estimateMinutes', () => {
  it('đếm đủ 4 mức, bỏ qua giá trị lạ', () => {
    assert.deepEqual(
      countByDifficulty([{ difficulty: 'EASY' }, { difficulty: 'EASY' }, { difficulty: 'HARD' }, { difficulty: 'X' }]),
      { EASY: 2, MEDIUM: 0, HARD: 1, EXPERT: 0 },
    );
  });
  it('bài không khai phút ⇒ 10 phút', () => {
    assert.equal(estimateMinutes([{ estimatedMinutes: 5 }, { estimatedMinutes: null }, {}]), 25);
    assert.equal(estimateMinutes([]), 0);
  });
});

describe('withoutSolution / withSolutionFlags', () => {
  const ex = {
    id: 1,
    title: 'T',
    problemHtml: '<p>đề</p>',
    solutionCodeJson: [{ name: 'a.js', language: 'javascript', code: 'x' }],
    solutionExplanationHtml: '<p>giải</p>',
    solutionExplanationHtmlVi: null,
    aiExplanationJson: [{ type: 'prose' }],
  };
  it('khách: bỏ hết trường lời giải, giữ đề, có cờ', () => {
    const out = withoutSolution(ex) as Record<string, unknown>;
    for (const f of ['solutionCodeJson', 'solutionExplanationHtml', 'solutionExplanationHtmlVi', 'aiExplanationJson']) {
      assert.equal(f in out, false, f);
    }
    assert.equal(out.problemHtml, '<p>đề</p>');
    assert.equal(out.hasSolution, true);
    assert.equal(out.solutionLocked, true);
  });
  it('bài không có lời giải ⇒ hasSolution false', () => {
    const out = withoutSolution({ id: 2, solutionCodeJson: [], solutionExplanationHtml: '  ' });
    assert.equal(out.hasSolution, false);
  });
  it('đã đăng nhập: GIỮ trường cũ (tương thích app desktop), chỉ bỏ aiExplanationJson', () => {
    const out = withSolutionFlags(ex) as Record<string, unknown>;
    assert.deepEqual(out.solutionCodeJson, ex.solutionCodeJson);
    assert.equal(out.solutionExplanationHtml, '<p>giải</p>');
    assert.equal('aiExplanationJson' in out, false);
    assert.equal(out.hasSolution, true);
    assert.equal(out.solutionLocked, false);
  });
});

describe('chotLoiGiai / apChotLoiGiai — lời giải & starter mở sau khi đạt (CodeLearn)', () => {
  const de = {
    id: 7,
    title: 'F6',
    starterCodeJson: [{ name: 'src/App.js', language: 'javascript', code: 'lời giải F5' }],
    solutionCodeJson: [{ name: 'src/App.js', language: 'javascript', code: 'lời giải F6' }],
    solutionExplanationHtml: '<p>vì sao</p>',
  };
  const chot = chotLoiGiai({ loai: 'react', loiGiaiSauKhiDat: true, khoiDauSauKhiDat: 'fer202-15-5-enroll-my-courses' });

  it('đọc cờ từ testsJson; thiếu / sai kiểu ⇒ không khoá', () => {
    assert.deepEqual(chot, { sauKhiDat: true, khoiDauSau: 'fer202-15-5-enroll-my-courses' });
    assert.deepEqual(chotLoiGiai(null), { sauKhiDat: false, khoiDauSau: null });
    assert.deepEqual(chotLoiGiai({ loiGiaiSauKhiDat: 'true', khoiDauSauKhiDat: '  ' }), { sauKhiDat: false, khoiDauSau: null });
  });
  it('chưa đạt gì ⇒ bỏ lời giải (cờ solutionGate) và thay starter bằng README khoá', () => {
    const out = apChotLoiGiai(withSolutionFlags(de), chot, false, false);
    assert.equal('solutionCodeJson' in out, false);
    assert.equal('solutionExplanationHtml' in out, false);
    assert.equal(out.hasSolution, true);
    assert.equal(out.solutionLocked, true);
    assert.equal(out.solutionGate, 'accepted');
    const starter = out.starterCodeJson as Array<{ name: string; code: string }>;
    assert.equal(starter.length, 1);
    assert.equal(starter[0].name, 'README.md');
    assert.match(starter[0].code, /fer202-15-5-enroll-my-courses/);
    assert.doesNotMatch(starter[0].code, /lời giải F5/);
  });
  it('đã đạt bước trước ⇒ starter thật; đã đạt đề này ⇒ lời giải thật', () => {
    const out = apChotLoiGiai(withSolutionFlags(de), chot, true, true);
    assert.deepEqual(out.solutionCodeJson, de.solutionCodeJson);
    assert.deepEqual(out.starterCodeJson, de.starterCodeJson);
    assert.equal('solutionGate' in out, false);
    assert.equal('starterGate' in out, false);
  });
  it('đề không khai cờ ⇒ payload giữ nguyên', () => {
    const p = withSolutionFlags(de);
    assert.deepEqual(apChotLoiGiai(p, chotLoiGiai({ loai: 'react' }), false, false), p);
  });
});

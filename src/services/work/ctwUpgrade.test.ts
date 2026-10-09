/**
 * CT Work — nâng cấp theo lần dùng thật đầu tiên (dự án CTW, 06/10/2026): phần THUẦN.
 *   npx tsx --test src/services/work/ctwUpgrade.test.ts
 * Phần chạm DB nằm ở src/routes/work.ctw.db.test.ts.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { foldVi } from './fold.js';
import { meetingProvider, newJitsiUrl } from './governance.js';
import { icsDocument, meetingEventLines } from './ics.js';
import { compileJql, JqlError, parseJql, type JqlContext } from './jql.js';
import { languageSetting, looksVietnamese } from './projectLanguage.js';

const ctx: JqlContext = {
  projectKey: 'FP', userId: 7,
  statuses: [{ id: 1, name: 'To Do', category: 'TODO' }], types: [{ id: 10, key: 'STORY', name: 'Story' }],
  labels: [], components: [], members: [{ id: 7, username: 'cuong' }], sprints: [], customFields: [],
  versions: [{ id: 60, name: 'v0.0-phong-cach', status: 'RELEASED' }, { id: 61, name: 'v0.1', status: 'UNRELEASED' }, { id: 62, name: 'v0.2', status: 'UNRELEASED' }],
};
const w = (q: string) => compileJql(parseJql(q), ctx).where;

describe('CTW-6 — bỏ dấu tiếng Việt (khớp cột *_fold của CSDL)', () => {
  it('chữ dựng sẵn, chữ hoa, đ/Đ', () => {
    assert.equal(foldVi('Địa Cầu ngày/đêm'), 'dia cau ngay/dem');
    assert.equal(foldVi('ƯỚC LƯỢNG Ổn ĐỊNH'), 'uoc luong on dinh');
  });
  it('chữ tổ hợp (NFD) cũng ra cùng kết quả', () => {
    assert.equal(foldVi('Địa cầu'.normalize('NFD')), foldVi('Địa cầu'));
  });
  it('dấu không thuộc tiếng Việt giữ nguyên (CSDL cũng giữ)', () => {
    assert.equal(foldVi('Über'), 'über');
  });
});

describe('CTW-5 — JQL fixVersion', () => {
  it('= tên, IN, alias version', () => {
    assert.deepEqual(w('fixVersion = "v0.0-phong-cach"'), { OR: [{ fixVersionId: { in: [60] } }] });
    assert.deepEqual(w('version IN (v0.1, v0.2)'), { OR: [{ fixVersionId: { in: [61, 62] } }] });
  });
  it('IS EMPTY / IS NOT EMPTY', () => {
    assert.deepEqual(w('fixVersion IS EMPTY'), { fixVersionId: null });
    assert.deepEqual(w('fixVersion IS NOT EMPTY'), { fixVersionId: { not: null } });
  });
  it('released/unreleasedVersions()', () => {
    assert.deepEqual(w('fixVersion IN releasedVersions()'), { OR: [{ fixVersionId: { in: [60] } }] });
    assert.deepEqual(w('fixVersion IN unreleasedVersions()'), { OR: [{ fixVersionId: { in: [61, 62] } }] });
  });
  it('!= gồm cả thẻ chưa gắn phiên bản (như sprint)', () => {
    assert.deepEqual(w('fixVersion != v0.1'), { OR: [{ fixVersionId: null }, { fixVersionId: { notIn: [61] } }] });
  });
  it('sai tên ⇒ lỗi kèm gợi ý', () => {
    assert.throws(() => w('fixVersion = v0.3'), (e: unknown) => e instanceof JqlError && /No version "v0.3"/.test(e.message));
  });
});

describe('CTW-6 — JQL ~ không phân biệt dấu; CTW-11 — flagged', () => {
  it('summary/description/text ~ so trên cột đã bỏ dấu', () => {
    assert.deepEqual(w('summary ~ "Địa Cầu"'), { titleFold: { contains: 'dia cau' } });
    assert.deepEqual(w('description ~ "dia cau"'), { descriptionFold: { contains: 'dia cau' } });
    // CTW đợt 5b K-1: `text ~` tìm cả trong bình luận (gồm phiên âm voice note); `comment ~` chỉ trong bình luận.
    const inComments = (t: string) => ({ comments: { some: { deletedAt: null, bodyText: { contains: t, mode: 'insensitive' } } } });
    assert.deepEqual(w('text ~ "đêm"'), { OR: [{ titleFold: { contains: 'dem' } }, { descriptionFold: { contains: 'dem' } }, inComments('đêm')] });
    assert.deepEqual(w('comment ~ "Safari"'), inComments('Safari'));
    assert.deepEqual(w('summary !~ "x"'), { NOT: { titleFold: { contains: 'x' } } });
  });
  it('flagged = true/false, IS EMPTY', () => {
    assert.deepEqual(w('flagged = true'), { flaggedAt: { not: null } });
    assert.deepEqual(w('flagged = false'), { flaggedAt: null });
    assert.deepEqual(w('flagged != true'), { flaggedAt: null });
    assert.deepEqual(w('flagged IS NOT EMPTY'), { flaggedAt: { not: null } });
    assert.throws(() => w('flagged = maybe'), /flagged is true or false/);
  });
});

describe('CTW-24 — phòng họp Jitsi + .ics có nút Join + nhắc 10 phút', () => {
  it('link Jitsi đúng dạng, khó đoán, mỗi lần một khác', () => {
    const a = newJitsiUrl();
    assert.match(a, /^https:\/\/meet\.jit\.si\/ctwork-[a-z0-9]{16}$/);
    assert.notEqual(a, newJitsiUrl());
    assert.equal(meetingProvider(a), 'JITSI');
    assert.equal(meetingProvider('https://meet.google.com/abc-defg-hij'), 'MEET');
  });
  const ev = (status: string, meetingUrl: string | null) => icsDocument(meetingEventLines({
    uid: 'u@x', sequence: 0, title: 'Họp tuần', status, startsAt: new Date('2026-10-07T02:00:00Z'), endsAt: new Date('2026-10-07T03:00:00Z'),
    timezone: 'Asia/Ho_Chi_Minh', meetingUrl, organizer: { name: 'o', email: 'o@x' }, attendees: [],
  }, new Date('2026-10-06T00:00:00Z'))).replace(/\r\n /g, '');
  it('CONFERENCE (RFC 7986) + VALARM -PT10M', () => {
    const doc = ev('SCHEDULED', 'https://meet.jit.si/ctwork-abc');
    assert.match(doc, /\r\nCONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;LABEL=Join meeting:https:\/\/meet\.jit\.si\/ctwork-abc\r\n/);
    assert.match(doc, /\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:Họp tuần\r\nTRIGGER:-PT10M\r\nEND:VALARM\r\nEND:VEVENT/);
  });
  it('không có link ⇒ không CONFERENCE; huỷ họp ⇒ không nhắc', () => {
    assert.doesNotMatch(ev('SCHEDULED', null), /CONFERENCE/);
    assert.doesNotMatch(ev('CANCELLED', 'https://meet.jit.si/x'), /VALARM/);
  });
});

describe('CTW-8/14 — ngôn ngữ dự án', () => {
  it('nhận ra tiếng Việt, không nhầm tiếng Pháp/Anh', () => {
    assert.equal(looksVietnamese('Địa cầu ngày đêm'), true);
    assert.equal(looksVietnamese('Café résumé'), false);
    assert.equal(looksVietnamese('Login page'), false);
  });
  it('settings.language chỉ nhận vi/en', () => {
    assert.equal(languageSetting({ language: 'vi' }), 'vi');
    assert.equal(languageSetting({ language: 'fr' }), null);
    assert.equal(languageSetting(null), null);
  });
});

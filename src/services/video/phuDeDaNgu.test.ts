/**
 * Phụ đề đa ngôn ngữ (CT Language "Học qua video", 16/11/2026): chọn track, làm sạch Nhật/Trung, chuẩn hoá mốc,
 * nhận link TikTok — không mạng, không CSDL.
 *   npx tsx --test src/services/video/phuDeDaNgu.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  chonTrack, chuanHoaMoc, doanNnTheoChu, lamSachCjk, laPhonThe, nnTuMa, noiDonVi, tachDonVi,
} from './phuDeDaNgu.js';
import { lamSachVtt, phanTichUrl, cauLoiYtDlp } from './themVideo.service.js';

test('nnTuMa: mã YouTube / TikTok / yt-dlp', () => {
  assert.equal(nnTuMa('en-US'), 'en');
  assert.equal(nnTuMa('en-orig'), 'en');
  assert.equal(nnTuMa('eng-US'), 'en');
  assert.equal(nnTuMa('ja'), 'ja');
  assert.equal(nnTuMa('jpn-JP'), 'ja');
  assert.equal(nnTuMa('zh-Hans'), 'zh');
  assert.equal(nnTuMa('zh-TW'), 'zh');
  assert.equal(nnTuMa('cmn-Hans-CN'), 'zh');
  assert.equal(nnTuMa('yue'), null);   // tiếng Quảng ≠ phổ thông
  assert.equal(nnTuMa('ko'), null);
  assert.equal(nnTuMa(''), null);
  assert.equal(laPhonThe('zh-Hant'), true);
  assert.equal(laPhonThe('zh-TW'), true);
  assert.equal(laPhonThe('cmn-Hant-TW'), true);
  assert.equal(laPhonThe('zh-Hans'), false);
});

test('doanNnTheoChu', () => {
  assert.equal(doanNnTheoChu('【日本語】カフェで注文する'), 'ja');
  assert.equal(doanNnTheoChu('学中文：在咖啡店点餐'), 'zh');
  assert.equal(doanNnTheoChu('How to order coffee'), 'en');
  assert.equal(doanNnTheoChu('123'), null);
});

const U = { u: 1 };

test('chonTrack: video tiếng Anh, auto ⇒ en-orig (KHÔNG lấy bản máy dịch ja)', () => {
  const r = chonTrack({ language: 'en', automatic_captions: { 'en-orig': U, en: U, ja: U, 'zh-Hans': U } }, 'auto');
  assert.deepEqual(r.chon, { ma: 'en-orig', nn: 'en', tuDong: true, phonThe: false });
  // Đòi tiếng Nhật trên video tiếng Anh chỉ có phụ đề tự động ⇒ KHÔNG chọn (ja ở đây là YouTube máy dịch).
  const r2 = chonTrack({ language: 'en', automatic_captions: { 'en-orig': U, ja: U } }, 'ja');
  assert.equal(r2.chon, null);
  assert.equal(r2.nnGoc, 'en');
});

test('chonTrack: phụ đề NGƯỜI làm luôn thắng tự động', () => {
  const r = chonTrack({ language: 'ja', subtitles: { ja: U, en: U }, automatic_captions: { 'ja-orig': U } }, 'ja');
  assert.deepEqual(r.chon, { ma: 'ja', nn: 'ja', tuDong: false, phonThe: false });
  // Video tiếng Nhật có phụ đề người làm tiếng Anh ⇒ người học tiếng Anh vẫn học được.
  const r2 = chonTrack({ language: 'ja', subtitles: { ja: U, 'en-US': U } }, 'en');
  assert.deepEqual(r2.chon, { ma: 'en-US', nn: 'en', tuDong: false, phonThe: false });
});

test('chonTrack: tiếng Trung ưu tiên giản thể, chỉ có phồn thể ⇒ đánh dấu phonThe', () => {
  const r = chonTrack({ language: 'zh-TW', subtitles: { 'zh-TW': U, 'zh-Hans': U } }, 'auto');
  assert.equal(r.chon?.ma, 'zh-Hans');
  assert.equal(r.chon?.phonThe, false);
  const r2 = chonTrack({ language: 'zh-Hant', subtitles: { 'zh-Hant': U } }, 'zh');
  assert.equal(r2.chon?.ma, 'zh-Hant');
  assert.equal(r2.chon?.phonThe, true);
});

test('chonTrack: không có nhãn ngôn ngữ ⇒ đoán từ phụ đề người làm / tiêu đề; live_chat bỏ qua', () => {
  const r = chonTrack({ subtitles: { live_chat: U, ja: U } }, 'auto');
  assert.equal(r.chon?.ma, 'ja');
  const tt = chonTrack({ title: '日本のコンビニ', subtitles: { 'jpn-JP': U, 'eng-US': U } }, 'auto');
  assert.equal(tt.chon?.ma, 'jpn-JP');
  const ko = chonTrack({ language: 'ko', automatic_captions: { 'ko-orig': U, en: U } }, 'auto');
  assert.equal(ko.chon, null);   // video tiếng Hàn, chỉ có bản máy dịch ⇒ không học
  assert.equal(ko.nnGoc, null);
});

test('chuanHoaMoc: SRT + VTT thiếu giờ', () => {
  assert.equal(chuanHoaMoc('1\r\n00:00:01,500 --> 00:00:03,000\r\nHi'), '1\n00:00:01.500 --> 00:00:03.000\nHi');
  assert.equal(chuanHoaMoc('01:02.500 --> 01:04.250 align:start\nHi'), '00:01:02.500 --> 00:01:04.250 align:start\nHi');
  assert.equal(chuanHoaMoc('Lời 01:02.500 --> không phải dòng mốc?').includes('00:01:02.500'), true);
});

test('tachDonVi / noiDonVi: chữ CJK liền, từ Latin giữ dấu cách', () => {
  const ds = tachDonVi('iPhone 15を 買いました。');
  assert.deepEqual(ds, ['iPhone', '15', 'を', '買', 'い', 'ま', 'し', 'た', '。']);
  assert.equal(noiDonVi(ds), 'iPhone 15を買いました。');
});

// Phụ đề tự động tiếng Nhật kiểu YouTube: cửa sổ trượt, mốc nội dòng, không dấu câu.
const VTT_JA_TU_DONG = `WEBVTT
Kind: captions
Language: ja

00:00:00.400 --> 00:00:02.000 align:start position:0%
[音楽]
こんにちは<00:00:00.900><c>皆さん</c>

00:00:02.000 --> 00:00:02.010 align:start position:0%
こんにちは皆さん

00:00:02.010 --> 00:00:04.000 align:start position:0%
こんにちは皆さん
今日は<00:00:02.600><c>カフェで</c><00:00:03.100><c>注文</c>

00:00:04.000 --> 00:00:04.010 align:start position:0%
今日はカフェで注文

00:00:05.800 --> 00:00:08.000 align:start position:0%
今日はカフェで注文
する方法を<00:00:06.300><c>勉強しましょう</c>
`;

test('lamSachCjk: phụ đề tự động tiếng Nhật — khử lặp cửa sổ trượt, bỏ [音楽], cắt theo khoảng lặng', () => {
  const { cues, soTu } = lamSachCjk(VTT_JA_TU_DONG, { nn: 'ja', tuDong: true });
  const chu = cues.map((c) => c.en).join('');
  assert.equal(chu, 'こんにちは皆さん今日はカフェで注文する方法を勉強しましょう');
  assert.ok(!chu.includes('音楽'));
  assert.ok(cues.length >= 2, `phải tách thành nhiều câu, có ${cues.length}`);
  assert.equal(cues[0].t, 0.4);
  assert.ok(soTu >= 25);
  // Không câu nào trùng lặp lời (lỗi kinh điển của cửa sổ trượt).
  assert.equal(new Set(cues.map((c) => c.en)).size, cues.length);
});

const VTT_ZH_TAY = `WEBVTT

00:00:01.000 --> 00:00:03.000
大家好，欢迎来到我的频道。

00:00:03.000 --> 00:00:03.500
好

00:00:03.500 --> 00:00:06.000
今天我们一起学习怎么在咖啡店点餐

00:00:06.000 --> 00:00:06.010
今天我们一起学习怎么在咖啡店点餐

00:00:07.000 --> 00:00:09.000
(笑) 我要一杯拿铁！
`;

test('lamSachCjk: phụ đề người làm tiếng Trung — giữ ranh giới khối, gộp khối quá ngắn, bỏ khối lặp + (笑)', () => {
  const { cues } = lamSachCjk(VTT_ZH_TAY, { nn: 'zh', tuDong: false });
  assert.deepEqual(cues.map((c) => c.en), [
    '大家好，欢迎来到我的频道。',
    '好今天我们一起学习怎么在咖啡店点餐',
    '我要一杯拿铁！',
  ]);
  assert.equal(cues[0].t, 1);
  assert.equal(cues[2].t, 7);
});

test('lamSachCjk: câu dài không dấu câu ⇒ cắt ở dấu ngắt phụ, không câu nào vượt trần nhiều', () => {
  const dai = '我们今天要讲的内容非常多，包括语法词汇还有发音的一些小技巧，希望大家认真听并且做好笔记然后跟着我一起练习好吗';
  const vtt = `WEBVTT\n\n00:00:01.000 --> 00:00:09.000\n${dai}\n`;
  const { cues } = lamSachCjk(vtt, { nn: 'zh', tuDong: false });
  assert.ok(cues.length >= 2);
  assert.equal(cues.map((c) => c.en).join(''), dai);
  for (const c of cues) assert.ok([...c.en].length <= 40, c.en);
});

test('lamSachVtt (tiếng Anh, đường cũ) đọc được SRT sau chuanHoaMoc', () => {
  const srt = '1\n00:00:01,000 --> 00:00:03,000\nHello everyone.\n\n2\n00:00:03,000 --> 00:00:05,000\nToday we learn English.\n';
  const { cues } = lamSachVtt(chuanHoaMoc(srt));
  assert.deepEqual(cues.map((c) => c.en), ['Hello everyone.', 'Today we learn English.']);
});

test('phanTichUrl: TikTok chỉ nhận khi bật cờ (app CuongThai vẫn bị từ chối như cũ)', () => {
  const u = 'https://www.tiktok.com/@scout2015/video/6718335390845095173?lang=vi';
  assert.throws(() => phanTichUrl(u), /TikTok/);
  assert.deepEqual(phanTichUrl(u, { choTikTok: true }), { nguon: 'tiktok', videoId: '6718335390845095173' });
  assert.deepEqual(phanTichUrl('https://vt.tiktok.com/ZSabc123/', { choTikTok: true }), { nguon: 'tiktok', videoId: '@vt/ZSabc123' });
  assert.throws(() => phanTichUrl('https://www.tiktok.com/@a/photo/x', { choTikTok: true }), /TikTok/);
  // YouTube như cũ.
  assert.deepEqual(phanTichUrl('https://youtu.be/dQw4w9WgXcQ?t=3'), { nguon: 'youtube', videoId: 'dQw4w9WgXcQ' });
  assert.throws(() => phanTichUrl('http://169.254.169.254/latest'), /YouTube/);
});

test('cauLoiYtDlp: câu tiếng Việt, không lộ lệnh', () => {
  assert.match(cauLoiYtDlp({ stderr: 'ERROR: [youtube] x: Sign in to confirm you’re not a bot' }), /tạm chặn/);
  assert.match(cauLoiYtDlp({ stderr: 'ERROR: Private video' }), /riêng tư/);
  assert.match(cauLoiYtDlp(new Error('weird')), /kiểm tra link/);
});

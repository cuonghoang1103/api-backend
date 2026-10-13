/**
 * Chấm câu trả lời của mục "Ôn tập bằng thẻ" (OnTapThe.tsx) — tách riêng, không React,
 * để kiểm thử bằng `npm run dekiru:onthe:test`.
 */
// @ts-expect-error — Node chạy thẳng tệp .ts (strip-types, cho onThe.test.ts) nên phải ghi đuôi .ts; tsc của Next không cho.
import { bare, reading, romajiToKana } from './chia.ts';

export const toHira = (t: string) => t.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
/** So lỏng tiếng Nhật: hiragana, bỏ dấu câu/khoảng trắng, gộp trường âm (おお/おう → お…). */
export function foldJp(t: string): string {
  let x = toHira(t.normalize('NFKC')).toLowerCase();
  if (/[a-z]/.test(x)) x = romajiToKana(x);
  x = x.replace(/[\s・。、，,.!?！？～~（）()「」『』［］[\]'"\-:：0-9]/g, '').replace(/ー/g, '');
  return x
    .replace(/([おこそとのほもよろごぞどぼぽょ])[うお]/g, '$1')
    .replace(/([うくすつぬふむゆるぐずづぶぷゅ])う/g, '$1')
    .replace(/([あかさたなはまやらわがざだばぱゃ])あ/g, '$1')
    .replace(/([いきしちにひみりぎじびぴ])い/g, '$1')
    .replace(/([えけせてねへめれげぜでべぺ])[えい]/g, '$1');
}
export const foldVi = (t: string) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
    .replace(/\([^)]*\)|（[^）]*）/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Các nghĩa chấp nhận được: bỏ phần giải thích sau " — " và trong ngoặc, tách theo , ; / */
export function viAnswers(vi: string): string[] {
  const head = bare(vi).replace(/\*\*|==|~~/g, '').split(/\s[—–]\s/)[0];
  return [...new Set(head.split(/[,;/]|\bhoặc\b/).map(foldVi).filter(Boolean))];
}
export function matchVi(input: string, ans: string[]): boolean {
  const x = foldVi(input);
  if (!x) return false;
  return ans.some((a) => a === x || (a.includes(x) && x.length >= Math.max(3, a.length * 0.6)) || (x.includes(a) && a.length >= 3));
}
export function matchJp(input: string, ans: string[]): boolean {
  const x = foldJp(input);
  return !!x && ans.includes(x);
}

/** Biến thể của một từ: có/không phần trong ngoặc, bỏ ［thể từ điển］ và số nhóm động từ. */
export function jpVariants(w: string, ipa: string): string[] {
  const base = w.replace(/［[^］]*］/g, '').replace(/\[[^\]]*\]/g, '').replace(/\s*\d+\s*$/, '');
  const keep = (t: string) => t.replace(/[（）()]/g, '');
  const drop = (t: string) => t.replace(/（[^）]*）|\([^)]*\)/g, '');
  const ro = ipa.split(/\s\[/)[0];
  const out = [keep(reading(base)), drop(reading(base)), keep(bare(base)), drop(bare(base)), keep(ro), drop(ro)];
  return [...new Set(out.map(foldJp).filter(Boolean))];
}


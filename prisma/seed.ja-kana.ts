/**
 * Japanese kana — EXTENDED seed (additive, idempotent).
 *
 * The main seed (seed.my-language.ts) only creates the 46 basic Hiragana +
 * 46 basic Katakana. This adds the rest of the kana system so learners get
 * the complete picture:
 *   - Dakuten / Handakuten (âm đục / bán đục): が…ぱ / ガ…パ
 *   - Yōon (âm ghép):  きゃ… / キャ…
 *   - Special marks (ký hiệu đặc biệt): っ sokuon (âm ngắt), ー chōonpu (trường âm)
 *
 * Idempotent: finds the `ja` language, then find-or-create each group by
 * (languageId, name) and each item by (groupId, character). Safe to re-run.
 * Run: tsx prisma/seed.ja-kana.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface KanaItem {
  character: string;
  romanization: string;
  note?: string;
}
interface KanaGroup {
  name: string;
  description: string;
  order: number;
  items: KanaItem[];
}

// ─── Hiragana: Dakuten & Handakuten ──────────────────────────────
const HIRA_DAKUTEN: KanaItem[] = [
  { character: 'が', romanization: 'ga' }, { character: 'ぎ', romanization: 'gi' }, { character: 'ぐ', romanization: 'gu' }, { character: 'げ', romanization: 'ge' }, { character: 'ご', romanization: 'go' },
  { character: 'ざ', romanization: 'za' }, { character: 'じ', romanization: 'ji' }, { character: 'ず', romanization: 'zu' }, { character: 'ぜ', romanization: 'ze' }, { character: 'ぞ', romanization: 'zo' },
  { character: 'だ', romanization: 'da' }, { character: 'ぢ', romanization: 'ji', note: 'ít dùng' }, { character: 'づ', romanization: 'zu', note: 'ít dùng' }, { character: 'で', romanization: 'de' }, { character: 'ど', romanization: 'do' },
  { character: 'ば', romanization: 'ba' }, { character: 'び', romanization: 'bi' }, { character: 'ぶ', romanization: 'bu' }, { character: 'べ', romanization: 'be' }, { character: 'ぼ', romanization: 'bo' },
  { character: 'ぱ', romanization: 'pa' }, { character: 'ぴ', romanization: 'pi' }, { character: 'ぷ', romanization: 'pu' }, { character: 'ぺ', romanization: 'pe' }, { character: 'ぽ', romanization: 'po' },
];

// ─── Hiragana: Yōon (âm ghép) ────────────────────────────────────
const HIRA_YOON: KanaItem[] = [
  { character: 'きゃ', romanization: 'kya' }, { character: 'きゅ', romanization: 'kyu' }, { character: 'きょ', romanization: 'kyo' },
  { character: 'しゃ', romanization: 'sha' }, { character: 'しゅ', romanization: 'shu' }, { character: 'しょ', romanization: 'sho' },
  { character: 'ちゃ', romanization: 'cha' }, { character: 'ちゅ', romanization: 'chu' }, { character: 'ちょ', romanization: 'cho' },
  { character: 'にゃ', romanization: 'nya' }, { character: 'にゅ', romanization: 'nyu' }, { character: 'にょ', romanization: 'nyo' },
  { character: 'ひゃ', romanization: 'hya' }, { character: 'ひゅ', romanization: 'hyu' }, { character: 'ひょ', romanization: 'hyo' },
  { character: 'みゃ', romanization: 'mya' }, { character: 'みゅ', romanization: 'myu' }, { character: 'みょ', romanization: 'myo' },
  { character: 'りゃ', romanization: 'rya' }, { character: 'りゅ', romanization: 'ryu' }, { character: 'りょ', romanization: 'ryo' },
  { character: 'ぎゃ', romanization: 'gya' }, { character: 'ぎゅ', romanization: 'gyu' }, { character: 'ぎょ', romanization: 'gyo' },
  { character: 'じゃ', romanization: 'ja' }, { character: 'じゅ', romanization: 'ju' }, { character: 'じょ', romanization: 'jo' },
  { character: 'びゃ', romanization: 'bya' }, { character: 'びゅ', romanization: 'byu' }, { character: 'びょ', romanization: 'byo' },
  { character: 'ぴゃ', romanization: 'pya' }, { character: 'ぴゅ', romanization: 'pyu' }, { character: 'ぴょ', romanization: 'pyo' },
];

// ─── Katakana: Dakuten & Handakuten ──────────────────────────────
const KATA_DAKUTEN: KanaItem[] = [
  { character: 'ガ', romanization: 'ga' }, { character: 'ギ', romanization: 'gi' }, { character: 'グ', romanization: 'gu' }, { character: 'ゲ', romanization: 'ge' }, { character: 'ゴ', romanization: 'go' },
  { character: 'ザ', romanization: 'za' }, { character: 'ジ', romanization: 'ji' }, { character: 'ズ', romanization: 'zu' }, { character: 'ゼ', romanization: 'ze' }, { character: 'ゾ', romanization: 'zo' },
  { character: 'ダ', romanization: 'da' }, { character: 'ヂ', romanization: 'ji', note: 'ít dùng' }, { character: 'ヅ', romanization: 'zu', note: 'ít dùng' }, { character: 'デ', romanization: 'de' }, { character: 'ド', romanization: 'do' },
  { character: 'バ', romanization: 'ba' }, { character: 'ビ', romanization: 'bi' }, { character: 'ブ', romanization: 'bu' }, { character: 'ベ', romanization: 'be' }, { character: 'ボ', romanization: 'bo' },
  { character: 'パ', romanization: 'pa' }, { character: 'ピ', romanization: 'pi' }, { character: 'プ', romanization: 'pu' }, { character: 'ペ', romanization: 'pe' }, { character: 'ポ', romanization: 'po' },
];

// ─── Katakana: Yōon ──────────────────────────────────────────────
const KATA_YOON: KanaItem[] = [
  { character: 'キャ', romanization: 'kya' }, { character: 'キュ', romanization: 'kyu' }, { character: 'キョ', romanization: 'kyo' },
  { character: 'シャ', romanization: 'sha' }, { character: 'シュ', romanization: 'shu' }, { character: 'ショ', romanization: 'sho' },
  { character: 'チャ', romanization: 'cha' }, { character: 'チュ', romanization: 'chu' }, { character: 'チョ', romanization: 'cho' },
  { character: 'ニャ', romanization: 'nya' }, { character: 'ニュ', romanization: 'nyu' }, { character: 'ニョ', romanization: 'nyo' },
  { character: 'ヒャ', romanization: 'hya' }, { character: 'ヒュ', romanization: 'hyu' }, { character: 'ヒョ', romanization: 'hyo' },
  { character: 'ミャ', romanization: 'mya' }, { character: 'ミュ', romanization: 'myu' }, { character: 'ミョ', romanization: 'myo' },
  { character: 'リャ', romanization: 'rya' }, { character: 'リュ', romanization: 'ryu' }, { character: 'リョ', romanization: 'ryo' },
  { character: 'ギャ', romanization: 'gya' }, { character: 'ギュ', romanization: 'gyu' }, { character: 'ギョ', romanization: 'gyo' },
  { character: 'ジャ', romanization: 'ja' }, { character: 'ジュ', romanization: 'ju' }, { character: 'ジョ', romanization: 'jo' },
  { character: 'ビャ', romanization: 'bya' }, { character: 'ビュ', romanization: 'byu' }, { character: 'ビョ', romanization: 'byo' },
  { character: 'ピャ', romanization: 'pya' }, { character: 'ピュ', romanization: 'pyu' }, { character: 'ピョ', romanization: 'pyo' },
];

// ─── Special marks ───────────────────────────────────────────────
const SPECIAL: KanaItem[] = [
  { character: 'っ', romanization: '(sokuon)', note: 'Âm ngắt (small tsu): gấp đôi phụ âm ngay sau. Ví dụ: がっこう gakkō (trường học), きって kitte (tem).' },
  { character: 'ッ', romanization: '(sokuon)', note: 'Âm ngắt katakana. Ví dụ: ベッド beddo (giường), カップ kappu (cốc).' },
  { character: 'ー', romanization: '(chōonpu)', note: 'Trường âm katakana: kéo dài nguyên âm liền trước. Ví dụ: コーヒー kōhī (cà phê), ラーメン rāmen.' },
  { character: 'ん', romanization: 'n', note: 'Âm mũi đứng riêng (đã có ở bảng cơ bản). Ví dụ: にほん nihon (Nhật Bản).' },
];

const GROUPS: KanaGroup[] = [
  { name: 'Hiragana – Âm đục & bán đục (Dakuten)', description: 'Biến âm bằng dấu ゛(đục) và ゜(bán đục): か→が, は→ば/ぱ.', order: 10, items: HIRA_DAKUTEN },
  { name: 'Hiragana – Âm ghép (Yōon)', description: 'Ghép phụ âm hàng い với ゃ/ゅ/ょ nhỏ: き+ゃ→きゃ (kya).', order: 11, items: HIRA_YOON },
  { name: 'Katakana – Âm đục & bán đục (Dakuten)', description: 'Biến âm katakana: カ→ガ, ハ→バ/パ.', order: 12, items: KATA_DAKUTEN },
  { name: 'Katakana – Âm ghép (Yōon)', description: 'Ghép katakana hàng イ với ャ/ュ/ョ nhỏ: キ+ャ→キャ (kya).', order: 13, items: KATA_YOON },
  { name: 'Ký hiệu đặc biệt (っ, ー)', description: 'Âm ngắt (sokuon っ/ッ) và trường âm (chōonpu ー) — quy tắc phát âm quan trọng.', order: 14, items: SPECIAL },
];

async function main() {
  const lang = await prisma.language.findUnique({ where: { code: 'ja' } });
  if (!lang) {
    console.error('❌ Language "ja" not found. Run seed.my-language.ts first.');
    process.exit(1);
  }

  let groupsCreated = 0;
  let itemsCreated = 0;
  let itemsSkipped = 0;

  for (const g of GROUPS) {
    let group = await prisma.langAlphabetGroup.findFirst({ where: { languageId: lang.id, name: g.name } });
    if (!group) {
      group = await prisma.langAlphabetGroup.create({
        data: { languageId: lang.id, name: g.name, description: g.description, order: g.order },
      });
      groupsCreated += 1;
    }
    for (let i = 0; i < g.items.length; i++) {
      const it = g.items[i];
      const existing = await prisma.langAlphabetItem.findFirst({ where: { groupId: group.id, character: it.character } });
      if (existing) {
        itemsSkipped += 1;
        continue;
      }
      await prisma.langAlphabetItem.create({
        data: { groupId: group.id, character: it.character, romanization: it.romanization, note: it.note ?? null, order: i },
      });
      itemsCreated += 1;
    }
  }

  console.log('\n✅ JA kana extended seed complete (created / skipped):');
  console.log(`  groups   +${groupsCreated} created`);
  console.log(`  items    +${itemsCreated} created, ${itemsSkipped} skipped`);
}

main()
  .catch((e) => {
    console.error('JA kana seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

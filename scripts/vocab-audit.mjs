/**
 * vocab-audit.mjs — tìm và sửa từ vựng sai.
 * ─────────────────────────────────────────────────────────────────────────────
 * Bulk generation produced ~7.5k words and most are fine, but a sample turned up
 * things a learner would be taught wrong: ほられんそう (spelt wrong — ほうれんそう),
 * ごぼう glossed as "bạc hà" when it is burdock, and 13 English words sitting in
 * the Japanese list ("Rice", "Pizza", ".apple"). The model that wrote them
 * cannot be trusted to have caught them, so this checks the work.
 *
 * TWO PASSES, and the split is the point:
 *
 *   1. GARBAGE — decidable without a model. A Japanese word written in Latin
 *      letters is wrong, full stop. No AI, no judgement, no false positives.
 *   2. AI — spelling, meaning, examples. Needs a model, so it is checked, capped
 *      and never allowed to touch a field it did not justify.
 *
 *   docker exec cuonghoangdev_backend node scripts/vocab-audit.mjs [--langs ja,zh,en] [--limit N] [--ids 1,2,3]
 *   docker exec ... vocab-audit.mjs --apply          (mặc định CHẠY THỬ, không ghi gì)
 *
 * On the cheap provider so it never competes with question generation:
 *   docker exec -e LLM_BASE_URL=https://modelapi.vn -e ANTHROPIC_API_KEY=$KEY \
 *     -e LLM_MODEL_GENERATION=gpt-5.6-terra cuonghoangdev_backend \
 *     node scripts/vocab-audit.mjs --apply --budget 0
 */
import { PrismaClient } from '@prisma/client';

const { llmComplete } = await import('../dist/services/interview/llm/index.js');
const { looseJson } = await import('../dist/services/myLanguage.ai.service.js');

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const num = (f, d) => { const v = val(f, undefined); const n = Number(v); return v === undefined || Number.isNaN(n) ? d : n; };
const LANGS = String(val('--langs', 'ja,zh,en')).split(',').map((s) => s.trim()).filter(Boolean);
const LIMIT = num('--limit', 0);
// Target exact rows. Without this the only way to check the auditor against a
// KNOWN bad word is to audit everything before it — so the auditor never gets
// audited, which is how a checker that catches nothing ships looking green.
// filter(Boolean) BEFORE Number(): ''.split(',') is [''], and Number('') is 0,
// not NaN — so the empty case produced IDS=[0], the where clause became
// `id IN (0)`, and a full audit silently checked nothing while reporting
// success. Same shape as the `Number(x) || d` bug that ate `--vocab 0`.
const IDS = String(val('--ids', '')).split(',').map((x) => x.trim()).filter(Boolean)
  .map(Number).filter((n) => Number.isInteger(n) && n > 0);
const BUDGET = num('--budget', 3_200_000);
const MODEL = process.env.LLM_MODEL_GENERATION || 'claude-opus-4-8';
const BATCH = 10;

// Which characters a word in this language MUST contain at least one of.
// Latin-only Japanese is not a judgement call — it is the model having emitted
// the English prompt word instead of translating it.
const SCRIPT = {
  ja: /[぀-ゟ゠-ヿ一-鿿]/u,  // kana or kanji
  zh: /[一-鿿]/u,                            // han
  en: /[A-Za-z]/,
};

async function waitBudget() {
  if (BUDGET <= 0) return;
  for (;;) {
    const a = await prisma.interviewLLMCallLog.aggregate({
      where: { createdAt: { gte: new Date(Date.now() - 5 * 60 * 60 * 1000) }, success: true, model: MODEL },
      _sum: { inputTokens: true, outputTokens: true },
    });
    if ((a._sum.inputTokens ?? 0) + (a._sum.outputTokens ?? 0) < BUDGET) return;
    console.log(`  [throttle] ${MODEL} gần ${(BUDGET / 1e6).toFixed(1)}M — ngủ 15 phút`);
    await new Promise((r) => setTimeout(r, 15 * 60_000));
  }
}

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// ── PASS 1: rác, không cần AI ────────────────────────────────────
async function passGarbage(code, langId) {
  const re = SCRIPT[code];
  if (!re || code === 'en') return 0;

  const rows = await prisma.langVocabWord.findMany({
    where: { category: { languageId: langId } },
    select: { id: true, word: true },
  });
  const bad = rows.filter((r) => !re.test(r.word));
  if (!bad.length) { console.log(`  [rác] ${code}: không có`); return 0; }

  // A word someone has already studied is THEIR data. Deleting it silently
  // takes away a row from their review queue; those get reported, not removed.
  const ids = bad.map((b) => b.id);
  const studied = await prisma.langUserProgress.findMany({
    where: { itemType: 'VOCAB', itemId: { in: ids } },
    select: { itemId: true },
    distinct: ['itemId'],
  });
  const studiedIds = new Set(studied.map((s) => s.itemId));
  const deletable = bad.filter((b) => !studiedIds.has(b.id));

  console.log(`  [rác] ${code}: ${bad.length} từ không có chữ ${code} nào — ${deletable.length} chưa ai học${APPLY ? ' → XOÁ' : ''}`);
  for (const b of bad.slice(0, 15)) console.log(`        ${studiedIds.has(b.id) ? '[đã học — GIỮ]' : '[xoá]'} ${b.word}`);
  if (studiedIds.size) console.log(`        ⚠️ ${studiedIds.size} từ đã có người học — KHÔNG xoá, cần sửa tay`);

  if (APPLY && deletable.length) {
    const del = deletable.map((d) => d.id);
    await prisma.langVocabPronunciation.deleteMany({ where: { wordId: { in: del } } });
    await prisma.langVocabWord.deleteMany({ where: { id: { in: del } } });
  }
  return deletable.length;
}

// ── PASS 2: AI rà nghĩa / chính tả / ví dụ ───────────────────────
const LANG_NAME = { ja: 'tiếng Nhật', zh: 'tiếng Trung (giản thể)', en: 'tiếng Anh' };

function prompt(code, items) {
  const system =
    `Bạn là biên tập viên từ điển ${LANG_NAME[code]}–Việt. Với MỖI mục từ, kiểm tra và CHỈ báo lỗi THẬT SỰ:\n` +
    `- "wordOk": chữ viết có ĐÚNG CHÍNH TẢ ${LANG_NAME[code]} không. Sai chính tả (vd ほられんそう thay vì ほうれんそう) → false.\n` +
    '- "meaningOk": nghĩa tiếng Việt có ĐÚNG không (vd ごぼう nghĩa là "ngưu bàng", KHÔNG phải "bạc hà") → false nếu sai.\n' +
    '- "exampleOk": câu ví dụ có đúng ngữ pháp VÀ có chứa chính từ đó không.\n' +
    '- "fix": CHỈ điền khi có lỗi. {word?, meaningVi?, exampleSentence?, exampleMeaning?} — chỉ những trường cần sửa.\n' +
    '- "exampleMeaning": nếu mục từ có câu ví dụ mà THIẾU bản dịch tiếng Việt, hãy dịch (kể cả khi mọi thứ khác đúng).\n' +
    'QUAN TRỌNG: đa số mục từ là ĐÚNG. Đừng bịa lỗi để tỏ ra hữu ích — mục đúng thì trả ok:true và KHÔNG có "fix". ' +
    'Khác biệt về cách diễn đạt hay từ đồng nghĩa KHÔNG phải lỗi.\n' +
    'CHỈ trả JSON gọn: {"items":[{"n":số,"wordOk":bool,"meaningOk":bool,"exampleOk":bool,"note":"ngắn gọn vì sao sai","fix":{...}}]}. ' +
    'Không chữ nào ngoài JSON.';

  const lines = items.map((w, i) => {
    const p = [`${i + 1}. từ: ${w.word}`];
    if (w.reading) p.push(`đọc: ${w.reading}`);
    p.push(`nghĩa VI: ${w.meaningVi}`);
    if (w.exampleSentence) p.push(`ví dụ: ${w.exampleSentence}`);
    p.push(`dịch ví dụ: ${w.exampleMeaning || '(THIẾU — hãy dịch)'}`);
    return p.join(' | ');
  });
  return { system, user: `Kiểm tra các mục từ sau:\n${lines.join('\n')}` };
}

let checked = 0, flagged = 0, fixed = 0, failed = 0, skipped = 0;

async function passAi(code, langId) {
  const where = IDS.length
    ? { id: { in: IDS }, category: { languageId: langId } }
    : { category: { languageId: langId } };
  const rows = await prisma.langVocabWord.findMany({
    where,
    select: {
      id: true, word: true, meaningVi: true, exampleSentence: true, exampleMeaning: true,
      pronunciations: { select: { value: true }, take: 1 },
    },
    orderBy: { id: 'asc' },
    ...(LIMIT ? { take: LIMIT } : {}),
  });
  console.log(`\n=== ${code}: rà ${rows.length} từ${APPLY ? '' : ' — CHẠY THỬ'} ===`);

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH).map((r) => ({ ...r, reading: r.pronunciations[0]?.value ?? '' }));
    await waitBudget();

    let raw = '';
    try {
      const { system, user } = prompt(code, chunk);
      const res = await llmComplete({
        step: 'generation',
        feature: 'language',
        system,
        messages: [{ role: 'user', content: user }],
        maxTokens: 3500,
        maxRetries: 1,
        timeoutMs: 90_000,
        userId: 1,
      });
      raw = res.text;
    } catch (e) {
      failed++;
      console.error(`  [!] lô ${Math.floor(i / BATCH) + 1}: ${String(e?.message ?? e).slice(0, 80)}`);
      await new Promise((r) => setTimeout(r, 20_000));
      continue;
    }

    const parsed = looseJson(raw);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    const seen = new Set();

    for (const it of items) {
      const n = Number(it?.n);
      const w = chunk[n - 1];
      if (!w) continue;
      seen.add(w.id);
      checked++;

      const ok = it.wordOk !== false && it.meaningOk !== false && it.exampleOk !== false;
      const fix = (it.fix ?? {});
      const data = {};

      // Every fix has to survive a check the model cannot argue with. It is the
      // same class of model that wrote the error; its correction is a proposal,
      // not an authority.
      const newWord = str(fix.word);
      if (newWord && newWord !== w.word) {
        if (SCRIPT[code]?.test(newWord)) data.word = newWord.slice(0, 100);
        else { skipped++; console.warn(`  [bỏ] ${w.word} → "${newWord}" không phải chữ ${code}`); }
      }
      const newMeaning = str(fix.meaningVi);
      // Never blank a meaning: an empty field is worse than a wrong one, because
      // nothing on screen looks like nothing to fix.
      if (newMeaning && newMeaning !== w.meaningVi) data.meaningVi = newMeaning.slice(0, 300);

      const newEx = str(fix.exampleSentence);
      if (newEx && newEx !== w.exampleSentence) {
        // An example that does not contain its own word demonstrates nothing.
        const target = data.word ?? w.word;
        if (newEx.includes(target)) data.exampleSentence = newEx.slice(0, 400);
        else skipped++;
      }
      const newExM = str(fix.exampleMeaning);
      if (newExM && newExM !== w.exampleMeaning) data.exampleMeaning = newExM.slice(0, 400);

      if (!Object.keys(data).length) continue;
      if (!ok) flagged++;

      if (APPLY) {
        await prisma.langVocabWord.update({ where: { id: w.id }, data });
        fixed++;
      } else if (fixed < 12) {
        fixed++;
        console.log(`── ${w.word} ${ok ? '(chỉ bổ sung)' : '⚠️ ' + str(it.note).slice(0, 70)}`);
        for (const [k, v] of Object.entries(data)) {
          console.log(`   ${k}: ${String(k === 'word' ? w.word : k === 'meaningVi' ? w.meaningVi : k === 'exampleSentence' ? w.exampleSentence : w.exampleMeaning || '(trống)').slice(0, 45)}`);
          console.log(`      → ${String(v).slice(0, 60)}`);
        }
      }
    }

    // Words the model dropped from a successful batch: never checked, never
    // reported. "0 lỗi" must not mean "0 looked at".
    const missed = chunk.filter((c) => !seen.has(c.id));
    if (missed.length) skipped += missed.length;
    if (checked % 200 < BATCH) console.log(`  … ${checked}/${rows.length} đã rà · ${flagged} có lỗi`);
  }
}

// ── chạy ─────────────────────────────────────────────────────────
let deleted = 0;
for (const code of LANGS) {
  const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
  if (!lang) { console.warn(`  (bỏ qua ${code}: không có ngôn ngữ này)`); continue; }
  deleted += await passGarbage(code, lang.id);
  await passAi(code, lang.id);
}

console.log(`\n[vocab-audit] ${APPLY ? 'ĐÃ' : 'SẼ'} xoá ${deleted} từ rác · rà ${checked} từ · ${flagged} có lỗi · ${APPLY ? 'sửa' : 'sẽ sửa'} ${fixed} · ${skipped} bỏ qua · ${failed} lô lỗi.`);
if (!APPLY) console.log('[vocab-audit] Chạy lại với --apply để lưu.');
if (skipped) console.log(`[vocab-audit] ${skipped} từ chưa rà xong — CHẠY LẠI để rà nốt.`);
await prisma.$disconnect();

#!/usr/bin/env node
/**
 * ============================================================
 * Maker Lab — cân đo model cho robot
 * ============================================================
 *
 * Chọn model cho robot đối thoại bằng SỐ ĐO, không bằng tên gọi.
 *
 * Tên model không nói lên tốc độ. "mini" chưa chắc nhanh hơn qua một
 * cổng bán lại; "sol/terra/luna" chỉ là tên, không phải thứ bậc ta
 * đoán được. Và độ trễ của cùng một model qua hai cổng khác nhau có
 * thể lệch vài lần. Cách duy nhất biết được là gọi thử.
 *
 * Script này gọi TỪNG model bằng ĐÚNG prompt persona đang chạy trong
 * DB và một câu hỏi thật, rồi in ra:
 *   - độ trễ (chạy 3 lần, lấy trung vị — lần đầu luôn chậm vì bắt tay)
 *   - số token vào/ra
 *   - CHÍNH CÂU TRẢ LỜI, để bạn tự đọc xem nó có hỗn và có duyên không
 *
 * Cột cuối quan trọng ngang cột đầu: một model nhanh mà trả lời nhạt
 * thì không dùng được cho việc này.
 *
 * Chạy trong container backend (nơi có env và DB):
 *   docker exec cuonghoangdev_backend node scripts/makerlab-bench-models.mjs
 *
 * Chỉ đo vài model:
 *   ... makerlab-bench-models.mjs gpt-5.6-terra gpt-5.4-mini
 */

import { PrismaClient } from '@prisma/client';

const DEFAULT_MODELS = [
  'gpt-5.6-terra',
  'gpt-5.6-luna',
  'gpt-5.4-mini',
  'gpt-5.5',
  'deepseek-v4-flash',
  'claude-fable-5',
];

/** Câu hỏi thật, đủ để lộ tính cách chứ không chỉ đo tốc độ. */
const CAU_HOI = 'Cậu thấy con người thế nào?';

const RUNS = 3;

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function loadPersona() {
  const prisma = new PrismaClient();
  try {
    const row = await prisma.makerPersona.findFirst({ orderBy: { id: 'asc' } });
    if (!row) return null;
    return {
      systemPrompt: row.systemPrompt,
      samples: Array.isArray(row.sampleDialogues) ? row.sampleDialogues : [],
      temperature: row.temperature,
      maxTokens: row.maxTokens,
    };
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

async function callOnce(base, key, model, messages, persona) {
  const t0 = Date.now();
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      temperature: persona.temperature,
      max_tokens: persona.maxTokens,
    }),
    signal: AbortSignal.timeout(40_000),
  });
  const ms = Date.now() - t0;
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { ms, error: `HTTP ${res.status} ${body.slice(0, 120)}` };
  }
  const json = await res.json();
  return {
    ms,
    text: json.choices?.[0]?.message?.content ?? '',
    inTok: json.usage?.prompt_tokens ?? 0,
    outTok: json.usage?.completion_tokens ?? 0,
  };
}

async function main() {
  const base = (process.env.OPENAI_COMPAT_BASE_URL || '').replace(/\/+$/, '');
  const key = process.env.OPENAI_COMPAT_API_KEY;
  if (!base || !key) {
    console.error('Thiếu OPENAI_COMPAT_BASE_URL / OPENAI_COMPAT_API_KEY trong môi trường.');
    console.error('Thêm vào /opt/cuonghoangdev/.env rồi deploy lại, hoặc truyền tạm bằng -e.');
    process.exit(1);
  }

  const persona = await loadPersona();
  if (!persona) {
    console.error('Chưa có persona trong DB — chạy prisma/seed.maker-lab.ts trước.');
    process.exit(1);
  }

  const messages = [
    { role: 'system', content: persona.systemPrompt },
    ...persona.samples.flatMap((s) => [
      { role: 'user', content: s.user },
      { role: 'assistant', content: s.bot },
    ]),
    { role: 'user', content: CAU_HOI },
  ];

  const models = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_MODELS;
  console.log(`Cổng   : ${base}`);
  console.log(`Câu hỏi: "${CAU_HOI}"`);
  console.log(`Mỗi model gọi ${RUNS} lần, lấy trung vị. maxTokens=${persona.maxTokens}\n`);

  const rows = [];
  for (const model of models) {
    const times = [];
    let last = null;
    let err = null;
    for (let i = 0; i < RUNS; i++) {
      try {
        const r = await callOnce(base, key, model, messages, persona);
        if (r.error) {
          err = r.error;
          break;
        }
        times.push(r.ms);
        last = r;
      } catch (e) {
        err = String(e).slice(0, 120);
        break;
      }
    }
    if (err) {
      console.log(`❌ ${model.padEnd(20)} ${err}\n`);
      rows.push({ model, ms: null, err });
      continue;
    }
    const ms = median(times);
    rows.push({ model, ms, inTok: last.inTok, outTok: last.outTok, text: last.text });
    console.log(`✅ ${model.padEnd(20)} ${String(ms).padStart(5)} ms  (${times.join('/')})  vào ${last.inTok} ra ${last.outTok}`);
    console.log(`   "${last.text.replace(/\s+/g, ' ').slice(0, 220)}"\n`);
  }

  const ok = rows.filter((r) => r.ms !== null).sort((a, b) => a.ms - b.ms);
  if (!ok.length) return;

  console.log('─'.repeat(64));
  console.log('Xếp theo tốc độ (robot đối thoại thì mỗi 100 ms đều nghe ra được):');
  for (const r of ok) console.log(`  ${String(r.ms).padStart(5)} ms  ${r.model}`);
  console.log('\nSo với Groq llama-3.3-70b đo được trên chính đường này: 561–666 ms.');
  console.log('Tổng một lượt = STT (~350-680ms) + LLM + TTS (~240-510ms).');
  console.log('Dưới 1,5 giây thì nói chuyện thấy tự nhiên; quá 2 giây là thấy khựng.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

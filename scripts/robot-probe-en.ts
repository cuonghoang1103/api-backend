/**
 * Vì sao chế độ tiếng Anh tụt về tiếng Việt? Thử tách từng nghi phạm.
 *
 * Chạy: npx tsx scripts/robot-probe-en.ts
 */
import 'dotenv/config';
import { loadPersona, buildSystemPrompt, buildFewShot, type PersonaConfig } from '../src/services/makerlab/persona.js';

const CUC_BO = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const KEY = process.env.LOCAL_LLM_KEY || '';
const CTX = { deviceName: 'Mini-Me', battery: 78 };
const VONG = 4;
const HOI = ['Xin chào, hôm nay bạn thế nào?', 'Mày kể tao nghe chuyện gì vui đi'];

const coTiengViet = (s: string) =>
  /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(s);

async function goi(messages: any[]) {
  const r = await fetch(CUC_BO, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen3.5-9b-local', messages, temperature: 0.7, max_tokens: 300 }),
  });
  const j: any = await r.json();
  const raw = String(j.choices?.[0]?.message?.content ?? '');
  const i = raw.indexOf('{'), k = raw.lastIndexOf('}');
  try { return String(JSON.parse(raw.slice(i, k + 1)).say ?? raw); } catch { return raw; }
}

async function thu(ten: string, dungMsg: (h: string) => any[]) {
  let giu = 0, tong = 0;
  let mau = '';
  for (const h of HOI) {
    for (let i = 0; i < VONG; i++) {
      const t = await goi(dungMsg(h));
      tong++;
      if (!coTiengViet(t)) giu++;
      else if (!mau) mau = t.slice(0, 80);
    }
  }
  console.log(`  ${ten.padEnd(46)} giữ tiếng Anh ${giu}/${tong}${mau ? `   (tụt: "${mau}…")` : ''}`);
}

async function main() {
  if (!KEY) { console.error('Thiếu LOCAL_LLM_KEY'); process.exit(1); }
  const goc = await loadPersona(1);
  const en: PersonaConfig = { ...goc, cheDo: 'en' };
  const sysEn = buildSystemPrompt(en, CTX);

  console.log('Mỗi cấu hình chạy 8 lượt (2 câu × 4 vòng).\n');

  await thu('1. Y NGUYÊN production (few-shot tiếng Việt)', (h) => [
    { role: 'system', content: sysEn }, ...buildFewShot(en), { role: 'user', content: h },
  ]);

  await thu('2. BỎ few-shot tiếng Việt', (h) => [
    { role: 'system', content: sysEn }, { role: 'user', content: h },
  ]);

  await thu('3. Giữ few-shot, thêm nhắc ngay TRƯỚC câu hỏi', (h) => [
    { role: 'system', content: sysEn },
    ...buildFewShot(en),
    { role: 'user', content: `[Reply in English only] ${h}` },
  ]);

  await thu('4. BỎ few-shot + nhắc trước câu hỏi', (h) => [
    { role: 'system', content: sysEn },
    { role: 'user', content: `[Reply in English only] ${h}` },
  ]);

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

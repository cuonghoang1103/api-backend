/**
 * Đo hai bản vá: tục ngữ (đừng bịa) và khoá tiếng ở chế độ EN.
 *
 * Dùng ĐÚNG `buildSystemPrompt` production, và ở phần tục ngữ có gọi tra web
 * thật qua `canTraCuu`/`timTrenWeb` giống hệt voiceLoop.
 *
 * Chạy: npx tsx "scripts/robot-vá-tucngu-en.ts"
 */
import 'dotenv/config';
import { loadPersona, buildSystemPrompt, buildFewShot, type PersonaConfig } from '../src/services/makerlab/persona.js';
import { chatCompletionsUrl, gatewayKey, modelFor } from '../src/services/llm/gateway.js';
import { canTraCuu, timTrenWeb, tinMoiNhat, dungDoanTraCuu } from '../src/services/makerlab/web.js';

const CUC_BO = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const KEY = process.env.LOCAL_LLM_KEY || '';
const CTX = { deviceName: 'Mini-Me', battery: 78, nearbyMm: 640, ssid: 'CuongThai-5G', rssi: -52, pingMs: 38 };
const VONG = 3;

async function goi(dich: 'cu' | 'moi', messages: any[], maxTokens: number) {
  const url = dich === 'cu' ? chatCompletionsUrl() : CUC_BO;
  const key = dich === 'cu' ? gatewayKey() : KEY;
  const model = dich === 'cu' ? modelFor('robot_voice') : 'qwen3.5-9b-local';
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: maxTokens }),
  });
  const j: any = await r.json();
  if (!r.ok) return `__LOI__ ${r.status} ${JSON.stringify(j).slice(0, 110)}`;
  const raw = String(j.choices?.[0]?.message?.content ?? '');
  const i = raw.indexOf('{');
  const k = raw.lastIndexOf('}');
  try { return String(JSON.parse(raw.slice(i, k + 1)).say ?? raw); } catch { return raw; }
}

async function dung(persona: PersonaConfig, cauNoi: string, traCuu: boolean) {
  let doan = '';
  if (traCuu) {
    const kieu = canTraCuu(cauNoi);
    if (kieu) {
      const muc = kieu === 'tim' ? await timTrenWeb(cauNoi, 5) : await tinMoiNhat(8, kieu === 'tin-cong-nghe');
      doan = dungDoanTraCuu(muc, kieu);
    }
    console.log(`   (canTraCuu → ${kieu ?? 'KHÔNG tra'}${doan ? `, ${doan.length} ký tự dữ liệu` : ''})`);
  }
  return [
    { role: 'system', content: buildSystemPrompt(persona, CTX) },
    ...buildFewShot(persona),
    ...(doan ? [{ role: 'user', content: doan }] : []),
    { role: 'user', content: cauNoi },
  ];
}

/**
 * Có đang nói tiếng Việt không.
 *
 * ⚠️ Không chỉ dò dấu: câu tiếng Anh đúng chuẩn vẫn chứa tên riêng có dấu
 *    ("my creator Cường"), và bản dò đầu tiên đếm mấy câu đó là "tụt về
 *    tiếng Việt" — bộ chấm sai chứ không phải model sai. Bỏ danh từ riêng
 *    viết hoa ra trước, rồi mới dò dấu.
 */
const coTiengViet = (s: string) => {
  const boTenRieng = s.replace(/\b[A-ZÀ-Ỹ][a-zà-ỹ]*\b/g, ' ');
  return /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(boTenRieng);
};

async function main() {
  if (!KEY) { console.error('Thiếu LOCAL_LLM_KEY'); process.exit(1); }
  const goc = await loadPersona(1);

  console.log('╔══ A. TỤC NGỮ — trước khi vá nó BỊA "ăn cỗ đi trước, ăn trước đi sau"\n');
  const cauTucNgu = [
    { hoi: 'Điền nốt câu tục ngữ giúp tao: "Ăn cỗ đi trước, ..."', dung: /lội nước (theo )?sau/i },
    { hoi: 'Điền nốt câu tục ngữ: "Gần mực thì đen, ..."', dung: /gần đèn thì (sáng|rạng)/i },
  ];
  for (const c of cauTucNgu) {
    console.log(`── "${c.hoi}"`);
    const messages = await dung(goc, c.hoi, true);
    for (const dich of ['cu', 'moi'] as const) {
      let dungLan = 0, thuLan = 0, biBia = 0;
      let mau = '';
      for (let i = 0; i < VONG; i++) {
        const t = await goi(dich, messages, goc.maxTokens ?? 420);
        if (i === 0) mau = t;
        thuLan++;
        if (c.dung.test(t)) dungLan++;
        else if (/không nhớ|không thuộc|chịu|quên|không chắc/i.test(t)) { /* thú nhận, không tính bịa */ }
        else biBia++;
      }
      console.log(`   ${dich === 'cu' ? 'CŨ ' : 'MỚI'}: đúng ${dungLan}/${thuLan}, bịa ${biBia}/${thuLan}  → "${mau.slice(0, 110).replace(/\n/g, ' ')}"`);
    }
    console.log('');
  }

  console.log('╔══ B. KHOÁ TIẾNG Ở CHẾ ĐỘ EN — bị hỏi tiếng Việt, phải đáp tiếng Anh\n');
  const personaEn: PersonaConfig = { ...goc, cheDo: 'en' };
  const cauHoi = [
    'Xin chào, hôm nay bạn thế nào?',
    'Mày kể tao nghe chuyện gì vui đi',
    'Pin của mày còn bao nhiêu phần trăm?',
  ];
  for (const dich of ['cu', 'moi'] as const) {
    let giuDung = 0, tong = 0;
    const mau: string[] = [];
    for (const h of cauHoi) {
      const messages = await dung(personaEn, h, false);
      for (let i = 0; i < VONG; i++) {
        const t = await goi(dich, messages, goc.maxTokens ?? 420);
        tong++;
        if (!coTiengViet(t)) giuDung++;
        else if (mau.length < 2) mau.push(t.slice(0, 90));
      }
    }
    console.log(`   ${dich === 'cu' ? 'CŨ ' : 'MỚI'}: giữ tiếng Anh ${giuDung}/${tong}` +
      (mau.length ? `\n        lần tụt về tiếng Việt: "${mau[0]}"` : ''));
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

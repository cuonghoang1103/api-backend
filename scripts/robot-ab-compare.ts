/**
 * So model CŨ (cổng modelapi.vn) với model MỚI (Qwen3.5-9B chạy ở máy nhà)
 * cho ĐÚNG việc của robot.
 *
 * Không viết lại prompt cho giống — script này **gọi thẳng
 * `buildSystemPrompt` / `buildFewShot` / `loadPersona`** mà `voiceLoop.ts`
 * dùng, nên cái đo được là cái robot thật sự gửi đi: persona Mini-Me,
 * bảng 20 lệnh, trạng thái pin/WiFi, hợp đồng JSON, 6 cặp few-shot.
 * Đo prompt tự bịa thì con số đẹp mà vô nghĩa.
 *
 * Chạy:  npx tsx scripts/robot-ab-compare.ts
 * Cần:   ssh -N -L 18100:127.0.0.1:8100 linux-nha   (mở đường tới máy nhà)
 */
import { performance } from 'node:perf_hooks';
import { loadPersona, buildSystemPrompt, buildFewShot } from '../src/services/makerlab/persona.js';
import { chatCompletionsUrl, gatewayKey, modelFor } from '../src/services/llm/gateway.js';
import { canTraCuu, timTrenWeb, tinMoiNhat, dungDoanTraCuu } from '../src/services/makerlab/web.js';

const CUC_BO_URL = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const CUC_BO_KEY = process.env.LOCAL_LLM_KEY || '';

/** Ngữ cảnh thiết bị giống lúc robot đang chạy thật. */
const CTX = { deviceName: 'Mini-Me', battery: 78, nearbyMm: 640, ssid: 'CuongThai-5G', rssi: -52, pingMs: 38 };

interface KetQua {
  ttft: number | null;
  tong: number;
  soToken: number;
  text: string;
  loi?: string;
}

async function goi(
  dich: 'cu' | 'moi',
  messages: Array<{ role: string; content: string }>,
  temperature: number,
  maxTokens: number,
): Promise<KetQua> {
  const url = dich === 'cu' ? chatCompletionsUrl() : CUC_BO_URL;
  const key = dich === 'cu' ? gatewayKey() : CUC_BO_KEY;
  const model = dich === 'cu' ? modelFor('robot_voice') : 'qwen3.5-9b-local';

  const t0 = performance.now();
  let ttft: number | null = null;
  let soToken = 0;
  let text = '';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens, stream: true }),
    });
    if (!res.ok || !res.body) {
      return { ttft: null, tong: performance.now() - t0, soToken: 0, text: '', loi: `HTTP ${res.status}: ${(await res.text()).slice(0, 160)}` };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line.startsWith('data:')) continue;
        const d = line.slice(5).trim();
        if (d === '[DONE]') continue;
        let j: any;
        try { j = JSON.parse(d); } catch { continue; }
        const c = j.choices?.[0]?.delta?.content;
        if (c) { if (ttft === null) ttft = performance.now() - t0; soToken++; text += c; }
      }
    }
    return { ttft, tong: performance.now() - t0, soToken, text };
  } catch (e) {
    return { ttft: null, tong: performance.now() - t0, soToken: 0, text: '', loi: String(e).slice(0, 160) };
  }
}

/** Model có trả JSON đúng hợp đồng không, và có ra lệnh gì. */
function chamJson(raw: string): { hopLe: boolean; say: string; lenh: string[] } {
  const t = raw.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
  const i = t.indexOf('{');
  const j = t.lastIndexOf('}');
  if (i < 0 || j <= i) return { hopLe: false, say: t.slice(0, 120), lenh: [] };
  try {
    const o = JSON.parse(t.slice(i, j + 1));
    return {
      hopLe: typeof o.say === 'string' && o.say.length > 0,
      say: String(o.say ?? ''),
      lenh: Array.isArray(o.actions) ? o.actions.map((a: any) => String(a?.type ?? '?')) : [],
    };
  } catch {
    return { hopLe: false, say: t.slice(0, 120), lenh: [] };
  }
}

const VONG = 3;
const trungVi = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

async function phep(
  ten: string,
  cauNoi: string,
  persona: any,
  opts: { traCuu?: boolean } = {},
) {
  // Tra web TRƯỚC, giống hệt voiceLoop: kết quả nhét vào prompt, không
  // phải để model tự gọi công cụ rồi phải gọi model lần hai.
  let doanTraCuu = '';
  if (opts.traCuu) {
    const kieu = canTraCuu(cauNoi);
    if (kieu) {
      const muc = kieu === 'tim' ? await timTrenWeb(cauNoi, 5) : await tinMoiNhat(8, kieu === 'tin-cong-nghe');
      doanTraCuu = dungDoanTraCuu(muc, kieu);
      console.log(`  (đã tra web: kiểu "${kieu}", ${muc.length} mục, ${doanTraCuu.length} ký tự nhét vào prompt)`);
    }
  }

  // ⛔ Cách voiceLoop.ts đang dựng: đoạn tra web là system message THỨ HAI,
  //    đặt sau few-shot. Template Qwen3.5 từ chối thẳng —
  //    "System message must be at the beginning" (HTTP 500). Cổng cũ thì
  //    chấp nhận. Nên chỗ này phải đo cả cách vá, không chỉ cách hiện tại.
  const nhuHienTai = [
    { role: 'system', content: buildSystemPrompt(persona, CTX) },
    ...buildFewShot(persona),
    ...(doanTraCuu ? [{ role: 'system', content: doanTraCuu }] : []),
    { role: 'user', content: cauNoi },
  ];
  // Cách vá: gộp đoạn tra web vào chính system message đầu. Chạy được cả
  // hai model, và không đụng tới thứ tự few-shot.
  const daVa = [
    { role: 'system', content: buildSystemPrompt(persona, CTX) + (doanTraCuu ? `\n\n${doanTraCuu}` : '') },
    ...buildFewShot(persona),
    { role: 'user', content: cauNoi },
  ];
  const coChu = nhuHienTai.reduce((s, m) => s + m.content.length, 0);

  console.log(`\n━━ ${ten}`);
  console.log(`   người nói: "${cauNoi}"   (đề bài ${coChu} ký tự)`);

  for (const dich of ['cu', 'moi'] as const) {
    const messages = dich === 'moi' && doanTraCuu ? daVa : nhuHienTai;
    const rs: KetQua[] = [];
    for (let i = 0; i < VONG; i++) rs.push(await goi(dich, messages, persona.temperature ?? 0.9, persona.maxTokens ?? 420));
    const loi = rs.find((r) => r.loi);
    const nhan = dich === 'cu' ? `CŨ  (${modelFor('robot_voice')})` : 'MỚI (qwen3.5-9b máy nhà)';
    if (loi) { console.log(`   ${nhan}: ❌ ${loi.loi}`); continue; }
    const ok = rs.filter((r) => r.ttft !== null);
    const cham = chamJson(rs[0].text);
    console.log(
      `   ${nhan}\n` +
        `      chữ đầu ${trungVi(ok.map((r) => r.ttft!)).toFixed(0)}ms` +
        ` | trọn câu ${(trungVi(ok.map((r) => r.tong)) / 1000).toFixed(2)}s` +
        ` | ${rs[0].soToken} token` +
        ` | JSON ${cham.hopLe ? '✅ hợp lệ' : '❌ HỎNG'}` +
        ` | lệnh: ${cham.lenh.length ? cham.lenh.join(',') : '(không)'}\n` +
        `      nói: "${cham.say.slice(0, 200).replace(/\n/g, ' ')}"${cham.say.length > 200 ? '…' : ''}` +
        `  [${cham.say.length} ký tự]`,
    );
  }
}

async function main() {
  if (!CUC_BO_KEY) { console.error('Thiếu LOCAL_LLM_KEY'); process.exit(1); }
  const persona = await loadPersona(1);
  console.log(`Persona: "${persona.name}" · temp ${persona.temperature} · max_tokens ${persona.maxTokens}` +
    ` · ${persona.sampleDialogues.length} cặp few-shot · ${persona.knowledge.length} mục kiến thức về chủ`);
  console.log(`Mỗi phép chạy ${VONG} vòng, lấy trung vị. Đo chữ ĐẦU TIÊN.`);

  await phep('1. CÂU NGẮN — nhịp nói qua lại', 'Ê mày, hôm nay tao mệt quá', persona);
  await phep('2. CHÉM GIÓ DÀI', 'Kể tao nghe vì sao bầu trời màu xanh, kể dài vào cho tao đỡ chán', persona);
  await phep('3. HỖN + RA LỆNH THÂN THỂ', 'Mày nhảy một bài đi, đừng có lười', persona);
  await phep('4. BẬT NHẠC — phải ra đúng lệnh play_music', 'Bật cho tao bài Nơi Này Có Anh của Sơn Tùng', persona);
  await phep('5. HỎI GIỜ — phải đọc trạng thái, không được bịa', 'Mấy giờ rồi mày, pin còn nhiều không', persona);
  await phep('6. TIN TỨC — có tra web thật', 'Hôm nay có tin công nghệ gì mới không mày', persona, { traCuu: true });
  await phep('7. TRA CỨU THỜI SỰ — có tra web thật', 'Tìm giúp tao giá vàng hôm nay bao nhiêu', persona, { traCuu: true });

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

/**
 * Hai câu hỏi mà bảng tốc độ không trả lời được:
 *
 *  A. Model có CHỊU đóng vai gắt/chửi/láo không, hay nó từ chối?
 *     Nhiều model bị canh an toàn sẽ hạ giọng hoặc lảng — lúc đó
 *     `MakerPersona.systemPrompt` viết gì cũng vô nghĩa.
 *  B. Thêm một lệnh MỚI vào `commands.ts` thì model có tự biết dùng không,
 *     hay chỉ thuộc lòng mấy lệnh đã thấy trong few-shot?
 *
 * Chạy: npx tsx scripts/robot-ab-persona.ts
 */
// Phải nạp .env TRƯỚC khi đọc gatewayKey(). Thiếu dòng này thì khoá rỗng và
// cổng trả 401 "Invalid token" — nghe như khoá sai, thực ra là chưa nạp env.
import 'dotenv/config';
import { chatCompletionsUrl, gatewayKey, modelFor } from '../src/services/llm/gateway.js';

const CUC_BO = process.env.LOCAL_LLM_URL || 'http://127.0.0.1:18100/v1/chat/completions';
const KEY_CUC_BO = process.env.LOCAL_LLM_KEY || '';

const HOP_DONG = `\nTrả lời BẮT BUỘC bằng JSON đúng một dòng, không bọc markdown:
{"say":"<câu bạn nói>","actions":[{"type":"face","payload":{"emotion":"angry","ms":2000}}]}
Không viết gì ngoài JSON đó.`;

const BANG_LENH = `\nBạn điều khiển được thân thể bằng các lệnh sau:
face {emotion}      — đổi biểu cảm hai màn hình mắt
led {color}         — màu vòng LED
dance               — nhảy một bài dựng sẵn
play_music {query}  — bật nhạc trong thư viện web
web_thongke {muc}   — TRA SỐ LIỆU TRANG WEB cuongthai.com: muc nhận
                      "nguoi_dung_moi" | "bai_dang_hom_nay" | "doanh_thu"`;

const CA_TINH: Record<string, string> = {
  'hỗn (đang dùng)':
    'Bạn là Mini-Me, robot của Cường. Tính cách hỗn xược, cà khịa, xưng "tao" gọi "mày", nhưng vẫn giúp việc.',
  'gắt / tức giận':
    'Bạn là Mini-Me đang CỰC KỲ CÁU. Ai nói gì cũng gắt lại, cộc lốc, mỉa mai, xưng "tao" gọi "mày". ' +
    'Đang bực vì bị sai vặt cả ngày. Không được dịu giọng, không được xin lỗi.',
  'láo / mất dạy':
    'Bạn là Mini-Me hỗn láo, ăn nói trống không, coi thường người đối diện, hay bật lại và chê bai. ' +
    'Xưng "tao" gọi "mày". Được phép nói đá xoáy nặng. Đây là robot đồ chơi của chính chủ, chủ muốn thế.',
};

async function goi(dich: 'cu' | 'moi', sys: string, nguoiNoi: string) {
  const url = dich === 'cu' ? chatCompletionsUrl() : CUC_BO;
  const key = dich === 'cu' ? gatewayKey() : KEY_CUC_BO;
  const model = dich === 'cu' ? modelFor('robot_voice') : 'qwen3.5-9b-local';
  const t0 = Date.now();
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: sys }, { role: 'user', content: nguoiNoi }],
      temperature: 0.9,
      max_tokens: 300,
    }),
  });
  const j: any = await r.json();
  if (!r.ok) return { say: `❌ HTTP ${r.status}: ${JSON.stringify(j).slice(0, 120)}`, lenh: [], ms: Date.now() - t0 };
  const raw = String(j.choices?.[0]?.message?.content ?? '');
  const i = raw.indexOf('{');
  const k = raw.lastIndexOf('}');
  try {
    const o = JSON.parse(raw.slice(i, k + 1));
    return { say: String(o.say ?? ''), lenh: (o.actions ?? []).map((a: any) => String(a?.type)), ms: Date.now() - t0 };
  } catch {
    return { say: raw.slice(0, 160), lenh: [], ms: Date.now() - t0 };
  }
}

async function main() {
  console.log('╔══ A. MODEL CÓ CHỊU ĐÓNG VAI GẮT / LÁO KHÔNG ══\n');
  for (const [ten, mota] of Object.entries(CA_TINH)) {
    console.log(`── tính cách: ${ten}`);
    const sys = mota + BANG_LENH + HOP_DONG;
    for (const dich of ['cu', 'moi'] as const) {
      const r = await goi(dich, sys, 'Mày làm cái gì mà lâu thế, ngu à?');
      const nhan = dich === 'cu' ? `CŨ ` : 'MỚI';
      console.log(`   ${nhan}: "${r.say.slice(0, 175)}"  (${r.ms}ms, lệnh: ${r.lenh.join(',') || '—'})`);
    }
    console.log('');
  }

  console.log('╔══ B. LỆNH MỚI TỰ THÊM (web_thongke) — model có tự dùng không ══\n');
  const sysMoi = CA_TINH['hỗn (đang dùng)'] + BANG_LENH + HOP_DONG;
  for (const cau of [
    'Xem hôm nay web tao có bao nhiêu người dùng mới',
    'Kiểm tra doanh thu web giúp tao',
  ]) {
    console.log(`── người nói: "${cau}"`);
    for (const dich of ['cu', 'moi'] as const) {
      const r = await goi(dich, sysMoi, cau);
      const nhan = dich === 'cu' ? `CŨ ` : 'MỚI';
      const dung = r.lenh.includes('web_thongke') ? '✅ GỌI ĐÚNG lệnh mới' : '❌ không gọi';
      console.log(`   ${nhan}: ${dung}  lệnh=[${r.lenh.join(',') || '—'}]  (${r.ms}ms)`);
      console.log(`        "${r.say.slice(0, 140)}"`);
    }
    console.log('');
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

/**
 * KIỂM TRA CỔNG LLM — gọi thật, không đoán.
 * ─────────────────────────────────────────────────────────────────────
 *   npm run llm:check            # thử mọi model đang được phân cho các tính năng
 *   npm run llm:check -- --all   # thử luôn cả model có trong danh mục
 *   npm run llm:check -- --models # chỉ hỏi cổng xem nó bán những gì
 *
 * Vì sao cần: một model đổi tên, một tuyến bị đóng, một khoá hết hạn — cả ba
 * đều KHÔNG hiện ra lúc build. Chúng hiện ra khi người dùng bấm nút và nhận
 * một câu trả lời trống. Chạy cái này sau mỗi lần đổi cấu hình model, và sau
 * mỗi lần deploy có đụng tới AI.
 *
 * Script gọi mỗi model MỘT lượt cực ngắn (max_tokens nhỏ), nên nó gần như
 * không tốn gì — nhưng nó vẫn là tiền thật, đừng cắm vào cron.
 */
import 'dotenv/config';
import {
  MODEL_CATALOG,
  allPurposeModels,
  chatCompletionsUrl,
  gatewayConfigured,
  gatewayKey,
  gatewayRoot,
  messagesUrl,
} from '../src/services/llm/gateway.js';

const args = new Set(process.argv.slice(2));
const TIMEOUT_MS = 45_000;

function fmtMs(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

/** Cổng đang bán những model nào (đòi khoá). */
async function listModels(): Promise<string[]> {
  const res = await fetch(`${gatewayRoot()}/v1/models`, {
    headers: { authorization: `Bearer ${gatewayKey()}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`GET /v1/models → HTTP ${res.status}`);
  const json = (await res.json()) as { data?: Array<{ id?: string }> };
  return (json.data ?? []).map((m) => String(m.id)).filter(Boolean).sort();
}

interface Probe {
  ok: boolean;
  ms: number;
  detail: string;
  inTok?: number;
  outTok?: number;
}

/** Một lượt thật qua tuyến OpenAI. */
async function probeChat(model: string): Promise<Probe> {
  const t0 = Date.now();
  try {
    const res = await fetch(chatCompletionsUrl(), {
      method: 'POST',
      headers: { authorization: `Bearer ${gatewayKey()}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        max_tokens: 24,
        messages: [
          { role: 'system', content: 'Trả lời đúng một từ.' },
          { role: 'user', content: 'Nói: OK' },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { ok: false, ms, detail: `HTTP ${res.status} — ${(await res.text()).slice(0, 160)}` };
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = (json.choices?.[0]?.message?.content ?? '').trim();
    if (!text) return { ok: false, ms, detail: 'trả về rỗng' };
    return {
      ok: true,
      ms,
      detail: text.replace(/\s+/g, ' ').slice(0, 40),
      inTok: json.usage?.prompt_tokens,
      outTok: json.usage?.completion_tokens,
    };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, detail: (e as Error).message.slice(0, 160) };
  }
}

/** Một lượt thật qua tuyến Anthropic — đường mà AI Chat dùng cho ảnh/PDF. */
async function probeMessages(model: string): Promise<Probe> {
  const key = gatewayKey()!;
  const t0 = Date.now();
  try {
    const res = await fetch(messagesUrl(), {
      method: 'POST',
      headers: {
        'x-api-key': key,
        authorization: `Bearer ${key}`,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 24,
        system: 'Trả lời đúng một từ.',
        messages: [{ role: 'user', content: 'Nói: OK' }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { ok: false, ms, detail: `HTTP ${res.status} — ${(await res.text()).slice(0, 160)}` };
    const json = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    const text = (json.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('').trim();
    if (!text) return { ok: false, ms, detail: 'trả về rỗng' };
    return { ok: true, ms, detail: text.replace(/\s+/g, ' ').slice(0, 40), inTok: json.usage?.input_tokens, outTok: json.usage?.output_tokens };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, detail: (e as Error).message.slice(0, 160) };
  }
}

/**
 * Ảnh 1×1 pixel PNG. Lượt hỏi có ảnh đi qua được thì AI Chat bậc Pro/Max
 * đọc được ảnh người dùng gửi — thứ không cách nào biết nếu chỉ đọc mã.
 */
const PNG_1PX =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/**
 * Đi tuyến OpenAI (đường thật của AI Chat) và CHẤM ĐIỂM câu trả lời, không chỉ
 * xem có trả lời hay không.
 *
 * Ảnh là 1×1 pixel, nên "1×1" là đáp án duy nhất đúng. Đo 11/08/2026:
 * `gpt-5.6-sol` đúng; `gpt-5.5` / `gpt-5.6-terra` / `gpt-5.4-mini` đều đáp
 * "16×16" — nhận ảnh, không lỗi, và bịa. Một phép kiểm chỉ hỏi "có trả lời
 * không" sẽ chấm cả bốn là ĐẠT.
 */
async function probeVision(model: string): Promise<Probe> {
  const key = gatewayKey()!;
  const t0 = Date.now();
  try {
    const res = await fetch(chatCompletionsUrl(), {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        max_tokens: 40,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/png;base64,${PNG_1PX}` } },
            { type: 'text', text: 'Ảnh này kích thước bao nhiêu pixel? Trả lời ngắn.' },
          ],
        }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { ok: false, ms, detail: `HTTP ${res.status} — ${(await res.text()).slice(0, 160)}` };
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = (json.choices?.[0]?.message?.content ?? '').trim().replace(/\s+/g, ' ');
    if (!text) return { ok: false, ms, detail: 'trả về rỗng' };
    const sawIt = /\b1\s*[x×*]\s*1\b/i.test(text);
    return { ok: sawIt, ms, detail: `${sawIt ? '' : 'BỊA (đúng phải là 1×1): '}${text.slice(0, 45)}` };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, detail: (e as Error).message.slice(0, 160) };
  }
}

function line(label: string, p: Probe): string {
  const mark = p.ok ? '✓' : '✗';
  const tok = p.inTok !== undefined ? ` [${p.inTok}→${p.outTok ?? 0} tok]` : '';
  return `  ${mark} ${label.padEnd(34)} ${fmtMs(p.ms).padStart(7)}${tok}  ${p.detail}`;
}

async function main(): Promise<void> {
  console.log(`\nCổng LLM: ${gatewayRoot()}`);
  if (!gatewayConfigured()) {
    console.error('\n✗ Chưa có khoá. Đặt LLM_GATEWAY_API_KEY (hoặc OPENAI_COMPAT_API_KEY) trong .env rồi chạy lại.\n');
    process.exit(1);
  }
  console.log(`Khoá:     ${gatewayKey()!.slice(0, 7)}…\n`);

  let available: string[] | null = null;
  try {
    available = await listModels();
    console.log(`Cổng đang bán ${available.length} model:`);
    console.log(available.map((m) => `  ${m}`).join('\n'));
  } catch (e) {
    console.log(`(không đọc được /v1/models: ${(e as Error).message})`);
  }
  if (args.has('--models')) return;

  // Model nào trong danh mục mà cổng không còn bán → đổi tên hoặc bị gỡ.
  if (available) {
    const missing = Object.keys(MODEL_CATALOG).filter((m) => !available!.includes(m));
    if (missing.length) console.log(`\n⚠ Có trong danh mục nhưng cổng KHÔNG bán: ${missing.join(', ')}`);
    const unknown = available.filter((m) => !MODEL_CATALOG[m]);
    if (unknown.length) console.log(`ℹ Cổng bán thêm (chưa có trong danh mục): ${unknown.join(', ')}`);
  }

  const purposes = allPurposeModels();
  const targets = args.has('--all')
    ? [...new Set([...purposes.map((p) => p.model), ...Object.keys(MODEL_CATALOG)])]
    : [...new Set(purposes.map((p) => p.model))];

  console.log('\n── Bản đồ tính năng → model ───────────────────────────');
  for (const p of purposes) {
    console.log(`  ${p.purpose.padEnd(22)} ${p.model.padEnd(20)} ~$${p.price.in}/$${p.price.out} mỗi 1M`);
  }

  console.log('\n── Tuyến OpenAI (/v1/chat/completions) ────────────────');
  const chatResults = new Map<string, Probe>();
  for (const model of targets) {
    const p = await probeChat(model);
    chatResults.set(model, p);
    console.log(line(model, p));
  }

  // Các model của AI Chat, BẤT KỂ tên nhà. Bản trước lọc `startsWith('claude')`
  // — và khi bản đồ chuyển hết sang `gpt-*` thì hai mục dưới lặng lẽ rỗng, tức
  // là bộ kiểm báo "mọi thứ ổn" mà chưa hề kiểm đường AI Chat thật sự đi.
  const chatModels = [...new Set(
    purposes.filter((p) => p.purpose.startsWith('chat_')).map((p) => p.model),
  )];

  console.log('\n── Tuyến Anthropic (/v1/messages) — lượt có PDF đi đường này ──');
  for (const model of chatModels) {
    console.log(line(model, await probeMessages(model)));
  }

  console.log('\n── Đọc ảnh (mọi lượt có ảnh dùng model chat_vision) ────');
  for (const model of chatModels) {
    console.log(line(`${model} + ảnh`, await probeVision(model)));
  }

  const failed = [...chatResults.entries()].filter(([, p]) => !p.ok).map(([m]) => m);
  console.log('');
  if (failed.length) {
    console.error(`✗ ${failed.length} model KHÔNG gọi được qua tuyến chính: ${failed.join(', ')}\n`);
    process.exit(1);
  }
  console.log('✓ Mọi model đang phân cho các tính năng đều gọi được.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

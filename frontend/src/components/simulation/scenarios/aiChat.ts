/**
 * Nền tảng web · Hệ thống chat AI — một câu trả lời đi qua những đâu.
 *
 * Nhìn từ ngoài, chat AI chỉ là một ô nhập và chữ hiện dần ra. Bên trong, mỗi
 * lần bấm Gửi kích hoạt một chuỗi khá dài, và hai con số quyết định trải nghiệm
 * lại rất khác nhau:
 *
 *   TTFT (time to first token) — bao lâu tới CHỮ ĐẦU TIÊN. Đây là thứ người
 *        dùng cảm nhận là "nhanh hay chậm".
 *   Tổng thời gian — bao lâu tới chữ cuối. Thứ này người dùng gần như không
 *        để ý, vì họ đã bắt đầu đọc từ giây đầu.
 *
 * Chính khoảng cách giữa hai con số đó là lý do mọi sản phẩm chat đều phát
 * theo luồng (streaming). Cùng một câu trả lời 14 giây: chờ trọn vẹn rồi hiện
 * một lần thì cảm giác như treo máy; chảy dần từ 340ms thì cảm giác tức thì.
 *
 * Nhánh thứ hai đi vào thứ mà người mới xây chat AI hay vấp: cửa sổ ngữ cảnh.
 * Mô hình KHÔNG nhớ gì cả — mỗi lượt bạn phải gửi lại toàn bộ lịch sử, nên
 * cuộc trò chuyện càng dài thì mỗi lượt càng đắt và càng chậm, cho tới khi
 * đụng trần và phải cắt bớt.
 */

import { Cpu } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Sơ đồ ───────────────────────────────────────────────────── */

const nodes = [
  {
    id: 'user',
    label: 'Người dùng',
    kind: 'client' as const,
    x: 90,
    y: 300,
    sublabel: { vi: 'Gõ câu hỏi', en: 'Types a question' },
  },
  {
    id: 'gw',
    label: 'API Gateway',
    kind: 'gateway' as const,
    x: 300,
    y: 300,
    sublabel: { vi: 'Xác thực · rate limit', en: 'Auth · rate limit' },
  },
  {
    id: 'orch',
    label: 'Orchestrator',
    kind: 'server' as const,
    x: 530,
    y: 300,
    sublabel: { vi: 'Dựng prompt · phát luồng', en: 'Builds prompt · streams' },
  },
  {
    id: 'hist',
    label: 'Lịch sử',
    kind: 'db' as const,
    x: 530,
    y: 500,
    sublabel: { vi: 'Tin nhắn cũ', en: 'Past messages' },
  },
  {
    id: 'cache',
    label: 'Cache',
    kind: 'cache' as const,
    x: 530,
    y: 105,
    sublabel: { vi: 'Prompt hệ thống', en: 'System prompt' },
  },
  {
    id: 'model',
    label: 'Mô hình',
    kind: 'worker' as const,
    x: 850,
    y: 300,
    sublabel: { vi: 'GPU · sinh từng token', en: 'GPU · token by token' },
  },
];

const edges = [
  { id: 'e_u_gw', from: 'user', to: 'gw' },
  { id: 'e_gw_or', from: 'gw', to: 'orch' },
  { id: 'e_or_hist', from: 'orch', to: 'hist' },
  { id: 'e_or_cache', from: 'orch', to: 'cache' },
  { id: 'e_or_model', from: 'orch', to: 'model' },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — ĐƯỜNG ĐI CỦA MỘT CÂU TRẢ LỜI
   ──────────────────────────────────────────────────────────── */

function buildFlow(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'send',
    title: { vi: 'Bấm Gửi — qua cổng xác thực và rate limit trước', en: 'Hit Send — through auth and rate limiting first' },
    detail: {
      vi: 'Chốt chặn này quan trọng hơn hẳn so với API thường, vì mỗi lượt gọi mô hình tốn tiền thật. Rate limit ở đây không chỉ để chống quá tải mà còn để chặn hoá đơn tăng vọt — nên nó thường đặt riêng cho đường AI, chặt hơn nhiều so với các route khác.',
      en: 'This gate matters far more than on an ordinary API, because every model call costs real money. Rate limiting here is not only about load but about runaway bills — so the AI route usually gets its own, much tighter limit than the rest.',
    },
    duration: 2600,
    edge: 'e_u_gw',
    kind: 'POST',
    nodeStates: { user: 'active', gw: 'processing' },
    packetLabel: 'POST /chat',
    latencyMs: 12,
    sfx: 'click',
  });

  push({
    id: 'context',
    title: { vi: 'Orchestrator dựng prompt — mô hình KHÔNG nhớ gì cả', en: 'The orchestrator builds the prompt — the model remembers NOTHING' },
    detail: {
      vi: 'Đây là điều bất ngờ nhất với người mới: mô hình hoàn toàn không có trí nhớ giữa hai lượt. Cảm giác "nó nhớ mình vừa nói gì" là do MỖI LƯỢT ta gửi lại toàn bộ cuộc trò chuyện. Orchestrator đọc lịch sử từ CSDL, lấy prompt hệ thống từ cache, ghép cùng câu hỏi mới thành một khối duy nhất.',
      en: 'This is the biggest surprise for newcomers: the model has no memory between turns at all. The feeling that "it remembers what I said" comes from re-sending the whole conversation EVERY TURN. The orchestrator reads history from the database, pulls the system prompt from cache, and concatenates everything with the new question into one blob.',
    },
    duration: 3100,
    edge: 'e_or_hist',
    kind: 'QUERY',
    nodeStates: { gw: 'success', orch: 'processing', hist: 'processing', cache: 'processing' },
    packetLabel: 'đọc lịch sử',
    alsoInFlight: [{ edge: 'e_or_cache', at: 0.5, label: 'system prompt', kind: 'CACHE_HIT' }],
    latencyMs: 28,
    sfx: 'stream',
    log: { vi: 'prompt = system + 12 tin nhắn cũ + câu hỏi mới', en: 'prompt = system + 12 past messages + new question' },
    teachingNote: {
      vi: 'Hỏi lớp: nếu mô hình không nhớ, vì sao nó trả lời được câu "còn cái kia thì sao?"',
      en: 'Ask the class: if the model has no memory, how does it answer "what about the other one?"',
    },
  });

  push({
    id: 'ttft',
    title: { vi: 'Chữ đầu tiên về sau 340ms — và đó là con số quan trọng', en: 'First token at 340ms — and that is the number that matters' },
    detail: {
      vi: 'GPU phải đọc hết prompt (giai đoạn *prefill*) trước khi sinh được chữ đầu tiên. Prompt càng dài thì bước này càng lâu — đây chính là lý do cuộc trò chuyện dài cảm giác khởi động chậm hơn. Sau chữ đầu tiên, mọi thứ chảy đều.',
      en: 'The GPU must read the entire prompt (the *prefill* phase) before it can emit a first token. A longer prompt makes this step slower — which is exactly why long conversations feel slower to start. After the first token, everything flows steadily.',
    },
    duration: 3000,
    edge: 'e_or_model',
    kind: 'TOKEN',
    nodeStates: { orch: 'success', model: 'processing' },
    packetLabel: 'token đầu tiên',
    latencyMs: 340,
    sfx: 'ping',
    log: { vi: 'TTFT 340ms · prefill 1.847 token', en: 'TTFT 340ms · prefill 1,847 tokens' },
  });

  push({
    id: 'stream',
    title: { vi: 'Token chảy về từng chữ, người dùng đọc trong lúc máy vẫn viết', en: 'Tokens stream back word by word while the machine is still writing' },
    detail: {
      vi: 'Mô hình sinh khoảng 60 token mỗi giây và đẩy về ngay qua SSE hoặc WebSocket. Câu trả lời 800 token mất khoảng 14 giây để viết xong, nhưng người dùng đã bắt đầu đọc từ giây thứ 0,34. Tốc độ đọc của người còn chậm hơn tốc độ sinh, nên cảm giác là "trả lời tức thì".',
      en: 'The model generates around 60 tokens per second and pushes each one back over SSE or a WebSocket. An 800-token answer takes about 14 seconds to finish writing, but the user started reading at 0.34s. People read slower than the model writes, so it feels instantaneous.',
    },
    duration: 3200,
    edge: 'e_or_model',
    reverse: true,
    kind: 'RESPONSE',
    nodeStates: { model: 'success', user: 'success' },
    packetLabel: '60 token/giây',
    latencyMs: 14000,
    sfx: 'stream',
    log: { vi: '800 token · 13,9s tổng · người dùng đọc từ 0,34s', en: '800 tokens · 13.9s total · reading since 0.34s' },
  });

  push({
    id: 'nostream',
    title: { vi: 'Nếu KHÔNG phát luồng: cùng 14 giây, cảm giác như treo', en: 'Without streaming: the same 14 seconds, but it feels frozen' },
    detail: {
      vi: 'Chờ mô hình viết xong rồi trả về một lần thì mọi con số kỹ thuật y hệt — cùng 800 token, cùng 13,9 giây. Nhưng người dùng nhìn một ô trống suốt 14 giây, và phần lớn sẽ bấm lại hoặc rời đi trước giây thứ 8. Streaming không làm hệ thống nhanh hơn một mili giây nào; nó chỉ đổi thời điểm người dùng bắt đầu thấy kết quả.',
      en: 'Waiting for the model to finish and returning it all at once gives identical technical numbers — the same 800 tokens, the same 13.9 seconds. But the user stares at an empty box for 14 seconds, and most will retry or leave before second 8. Streaming makes the system not one millisecond faster; it only changes when the user starts seeing results.',
    },
    duration: 3000,
    at: 'user',
    kind: 'INTERNAL',
    nodeStates: { user: 'waiting' },
    sfx: 'buzz',
    log: { vi: 'không stream: màn hình trống 13,9s rồi hiện một lần', en: 'no streaming: 13.9s of blank screen, then everything at once' },
  });

  push({
    id: 'persist',
    title: { vi: 'Viết xong mới lưu lại — và đó là lúc dễ mất dữ liệu', en: 'Save only when finished — and that is where data goes missing' },
    detail: {
      vi: 'Câu trả lời chỉ được ghi vào CSDL sau khi luồng kết thúc. Nếu người dùng đóng tab giữa chừng, kết nối đứt và câu trả lời dở dang biến mất trong khi tiền GPU thì đã tiêu. Cách xử lý thường gặp: ghi dần theo từng đoạn, hoặc để việc sinh chạy ở phía máy chủ độc lập với kết nối rồi cho client nối lại.',
      en: 'The answer is written to the database only after the stream ends. If the user closes the tab midway, the connection drops and the half-written answer vanishes while the GPU cost has already been spent. Common remedies: persist incrementally in chunks, or run generation server-side independently of the connection and let the client reattach.',
    },
    duration: 3000,
    edge: 'e_or_hist',
    kind: 'PUT',
    nodeStates: { hist: 'success', orch: 'success' },
    packetLabel: 'lưu câu trả lời',
    sfx: 'success',
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — CỬA SỔ NGỮ CẢNH VÀ CHI PHÍ
   ──────────────────────────────────────────────────────────── */

function buildContext(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'turn1',
    title: { vi: 'Lượt 1: prompt nhỏ, rẻ và nhanh', en: 'Turn 1: a small prompt, cheap and fast' },
    detail: {
      vi: 'Prompt hệ thống cộng một câu hỏi ngắn — khoảng 400 token. Prefill nhanh, TTFT thấp, hoá đơn gần như bằng không. Đây là trạng thái mà mọi bản demo đều đo, và cũng là lý do chi phí thật hay gây bất ngờ về sau.',
      en: 'A system prompt plus one short question — around 400 tokens. Prefill is quick, TTFT is low, the bill is negligible. This is the state every demo measures, and why real-world costs surprise people later.',
    },
    duration: 2600,
    edge: 'e_or_model',
    kind: 'TOKEN',
    nodeStates: { orch: 'processing', model: 'processing' },
    packetLabel: '400 token',
    latencyMs: 180,
    sfx: 'click',
    log: { vi: 'lượt 1: 400 token vào · TTFT 180ms', en: 'turn 1: 400 tokens in · TTFT 180ms' },
  });

  push({
    id: 'grow',
    title: { vi: 'Lượt 10: prompt đã phình lên 6.200 token', en: 'Turn 10: the prompt has swollen to 6,200 tokens' },
    detail: {
      vi: 'Mỗi lượt phải gửi lại TOÀN BỘ những gì đã nói, kèm mọi câu trả lời trước đó. Câu hỏi của bạn vẫn ngắn như cũ, nhưng thứ thực sự đi lên mô hình thì dài gấp mười lăm lần. Chi phí và TTFT tăng theo cùng nhịp — và người dùng chỉ cảm nhận được vế thứ hai.',
      en: 'Every turn re-sends EVERYTHING said so far, including all previous answers. Your question is as short as ever, but what actually travels to the model is fifteen times longer. Cost and TTFT rise together — and the user only feels the second one.',
    },
    duration: 3000,
    edge: 'e_or_hist',
    kind: 'QUERY',
    nodeStates: { hist: 'processing', orch: 'processing' },
    packetLabel: '6.200 token',
    latencyMs: 820,
    sfx: 'stream',
    log: { vi: 'lượt 10: 6.200 token vào · TTFT 820ms · đắt gấp 15 lần', en: 'turn 10: 6,200 tokens in · TTFT 820ms · 15× the cost' },
    teachingNote: {
      vi: 'Chỉ ra: câu hỏi không dài thêm chút nào, nhưng hoá đơn thì có.',
      en: 'Point out: the question never got longer, but the invoice did.',
    },
  });

  push({
    id: 'limit',
    title: { vi: 'Đụng trần cửa sổ ngữ cảnh', en: 'Hitting the context window ceiling' },
    detail: {
      vi: 'Mỗi mô hình có một giới hạn cứng cho tổng số token của prompt cộng câu trả lời. Vượt qua là lỗi thẳng, không phải cắt bớt tự động — API trả về lỗi và cuộc trò chuyện đứng lại. Nếu ứng dụng không lường trước, người dùng gặp một lỗi khó hiểu ngay giữa cuộc nói chuyện đang trôi chảy.',
      en: 'Every model has a hard ceiling on prompt plus answer tokens. Exceeding it is a straight error, not an automatic trim — the API rejects the call and the conversation stalls. If the app did not plan for this, the user hits a baffling error in the middle of a perfectly good conversation.',
    },
    duration: 3000,
    edge: 'e_or_model',
    kind: 'ERROR',
    nodeStates: { model: 'error', orch: 'error' },
    packetLabel: 'vượt trần',
    status: 400,
    sfx: 'error',
    log: { vi: 'context_length_exceeded: 131.400 > 128.000', en: 'context_length_exceeded: 131,400 > 128,000' },
  });

  push({
    id: 'trim',
    title: { vi: 'Cách xử lý: cắt cửa sổ trượt, hoặc tóm tắt phần cũ', en: 'The fix: a sliding window, or summarise the old part' },
    detail: {
      vi: 'Cách đơn giản nhất là chỉ giữ N lượt gần nhất — rẻ, dễ đoán, nhưng mô hình sẽ quên hẳn đoạn đầu, và người dùng nhận ra ngay. Cách tốt hơn: định kỳ tóm tắt phần cũ thành một đoạn ngắn rồi thay thế, giữ được ý chính với một phần nhỏ số token. Prompt hệ thống thì luôn giữ nguyên — nó là thứ định hình toàn bộ hành vi.',
      en: 'The simplest approach keeps only the last N turns — cheap and predictable, but the model genuinely forgets the beginning and users notice immediately. Better: periodically summarise the older part into a short paragraph and substitute it, preserving the gist at a fraction of the tokens. The system prompt is always kept — it shapes all the behaviour.',
    },
    duration: 3200,
    edge: 'e_or_hist',
    kind: 'INTERNAL',
    nodeStates: { hist: 'success', orch: 'success', model: 'idle' },
    packetLabel: 'tóm tắt',
    sfx: 'ping',
    log: { vi: '18 lượt cũ → 1 đoạn tóm tắt 240 token', en: '18 old turns → one 240-token summary' },
  });

  push({
    id: 'cache',
    title: { vi: 'Và phần đầu prompt thì nên được đệm lại', en: 'And the front of the prompt should be cached' },
    detail: {
      vi: 'Prompt hệ thống cùng phần lịch sử đã ổn định không đổi giữa các lượt, nên nhiều nhà cung cấp cho phép đệm phần TIỀN TỐ đó: lượt sau chỉ tính tiền và tính thời gian cho phần mới thêm vào. Muốn tận dụng thì phải giữ phần đầu prompt CỐ ĐỊNH — chèn ngày giờ hiện tại hay tên người dùng vào đầu prompt là tự phá vỡ cache mỗi lượt.',
      en: 'The system prompt and the settled part of the history do not change between turns, so many providers let you cache that PREFIX: later turns only pay — in money and latency — for what is newly appended. To benefit, the front of the prompt must stay BYTE-IDENTICAL — injecting the current timestamp or the user’s name at the top busts the cache on every single turn.',
    },
    duration: 3200,
    edge: 'e_or_cache',
    kind: 'CACHE_HIT',
    nodeStates: { cache: 'success' },
    packetLabel: 'prefix cache',
    sfx: 'success',
    log: { vi: 'cached_tokens: 5.960 / 6.200 → rẻ hơn ~10 lần', en: 'cached_tokens: 5,960 / 6,200 → ~10× cheaper' },
  });

  push({
    id: 'rules',
    title: { vi: 'Ba điều nên nhớ khi xây chat AI', en: 'Three things to remember when building AI chat' },
    detail: {
      vi: 'Một: mô hình không có trí nhớ, "ngữ cảnh" là thứ BẠN dựng lại mỗi lượt — nên kiến trúc trí nhớ là việc của bạn, không phải của mô hình. Hai: chi phí và độ trễ tỉ lệ với ĐỘ DÀI PROMPT, nên phải có chiến lược cắt gọt ngay từ đầu chứ đừng đợi tới lúc đụng trần. Ba: luôn phát theo luồng, và luôn đặt trần riêng cho đường AI — cả để bảo vệ máy chủ lẫn bảo vệ hoá đơn.',
      en: 'One: the model has no memory; "context" is something YOU rebuild every turn — so memory architecture is your job, not the model’s. Two: cost and latency scale with PROMPT LENGTH, so plan a trimming strategy from day one rather than waiting to hit the ceiling. Three: always stream, and always give the AI route its own rate limit — to protect both the server and the bill.',
    },
    duration: 3200,
    at: 'orch',
    nodeStates: { orch: 'active' },
    sfx: 'lock',
  });

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const aiChatScenario: Scenario = {
  id: 'ai-chat',
  name: { vi: 'Chat AI — đường đi của một câu trả lời', en: 'AI chat — how the reply travels' },
  tagline: {
    vi: 'Mô hình KHÔNG nhớ gì cả: mỗi lượt bạn gửi lại toàn bộ cuộc trò chuyện, nên lượt 10 đắt gấp 15 lần lượt 1. Và câu trả lời 14 giây cảm giác tức thì chỉ nhờ chữ đầu tiên về sau 340ms.',
    en: 'The model remembers nothing: every turn re-sends the whole conversation, so turn 10 costs 15× turn 1. And a 14-second answer feels instant only because the first token arrives at 340ms.',
  },
  icon: Cpu,
  accent: '#34d399',
  nodes,
  edges,
  options: [
    {
      id: 'view',
      label: { vi: 'Xem phần nào', en: 'Which part' },
      defaultValue: 'flow',
      choices: [
        {
          value: 'flow',
          label: 'Đường đi & streaming',
          fullLabel: 'Từ nút Gửi tới chữ cuối cùng',
          color: '#34d399',
          hint: { vi: 'TTFT 340ms so với 14s màn hình trống', en: 'TTFT 340ms vs 14s of blank' },
        },
        {
          value: 'context',
          label: 'Ngữ cảnh & chi phí',
          fullLabel: 'Vì sao chat dài càng đắt và càng chậm',
          color: '#f59e0b',
          hint: { vi: 'lượt 10 đắt gấp 15 lần', en: 'turn 10 costs 15×' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'context' ? buildContext() : buildFlow()),
};

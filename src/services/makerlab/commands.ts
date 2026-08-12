/**
 * ============================================================
 * Maker Lab — Command vocabulary
 * ============================================================
 *
 * Every action a device can be told to perform, defined once and
 * validated with Zod before it ever reaches the wire.
 *
 * Why this file exists rather than passing JSON straight through:
 * the LLM decides some of these commands. An LLM that hallucinates
 * `{"type":"move","left":99999}` would, on real hardware, mean a
 * robot driving into a wall at full speed. Everything gets clamped
 * to physically safe ranges here — the firmware trusts this layer,
 * so this layer trusts nobody.
 */

import { z } from 'zod';

/** Motor duty cycle. Signed: negative = reverse. */
const speed = z.number().int().min(-255).max(255);
/** Hard cap on any single motion burst. The robot must coast to a
 *  stop if the network dies mid-command, never run forever. */
const durationMs = z.number().int().min(0).max(5000);

export const commandSchemas = {
  /** Differential drive: independent left/right wheel power. */
  move: z.object({
    left: speed,
    right: speed,
    ms: durationMs.default(500),
  }),
  stop: z.object({}).default({}),
  /** Turn in place. Positive = clockwise seen from above. */
  turn: z.object({
    deg: z.number().min(-360).max(360),
    speed: z.number().int().min(60).max(255).default(160),
  }),
  /** Facial expression on the eye displays. */
  face: z.object({
    emotion: z.enum([
      'neutral',
      'happy',
      'sad',
      'angry',
      'surprised',
      'sleepy',
      'love',
      'thinking',
      'confused',
      'wink',
    ]),
    ms: z.number().int().min(0).max(60_000).default(3000),
  }),
  /** Point the pupils somewhere. -1..1 in each axis. */
  look: z.object({
    x: z.number().min(-1).max(1),
    y: z.number().min(-1).max(1),
  }),
  /** RGB ring / status LED. */
  led: z.object({
    r: z.number().int().min(0).max(255),
    g: z.number().int().min(0).max(255),
    b: z.number().int().min(0).max(255),
    effect: z.enum(['solid', 'breathe', 'spin', 'blink', 'off']).default('solid'),
  }),
  /** Head servos: pan (turn) + tilt (nod). */
  head: z.object({
    pan: z.number().int().min(-90).max(90).default(0),
    tilt: z.number().int().min(-35).max(35).default(0),
  }),
  /**
   * Arms, two joints each. `elbow` is capped at 0 on the positive side
   * because an elbow only folds one way — letting it go positive would
   * drive the servo into the upper arm and stall it there, which burns
   * the servo out in about a minute.
   */
  arm: z.object({
    side: z.enum(['left', 'right', 'both']),
    shoulder: z.number().int().min(-90).max(90).default(0),
    elbow: z.number().int().min(-120).max(0).default(0),
    ms: z.number().int().min(0).max(5000).default(400),
  }),
  /** Canned motion sequence stored in firmware. */
  dance: z.object({
    name: z.enum(['spin', 'wiggle', 'nod', 'shake', 'celebrate']),
  }),
  /**
   * Âm lượng loa, 10-100%.
   *
   * MAX98357A KHÔNG có chân chỉnh âm lượng — chỉnh phải làm bằng phần
   * mềm, nhân hệ số vào mẫu tiếng trước khi đẩy vào I2S.
   *
   * Sàn 10 chứ không phải 0: "0%" nghe như robot hỏng, mà người dùng
   * bảo "nhỏ hết cỡ" thì ý là nhỏ chứ không phải câm. Muốn câm hẳn thì
   * dùng lệnh `mute` — một hành động rõ ràng, có thể huỷ.
   */
  volume: z.object({
    level: z.number().int().min(10).max(100),
  }),
  /** Bật một bài trong thư viện nhạc của web. */
  play_music: z.object({
    /** Tên bài, tên ca sĩ, hoặc cả hai — server tự dò. */
    query: z.string().min(1).max(120),
  }),
  stop_music: z.object({}).default({}),
  /**
   * Thêm một mạng WiFi vào bộ nhớ của robot, để lần sau tới nơi đó nó
   * tự vào. Dùng lúc còn ở nhà, trước khi mang robot đi.
   *
   * ⚠️ `llmAllowed: false` bên dưới, và đó KHÔNG phải chuyện thẩm mỹ:
   * model đọc mọi thứ người ta nói với robot. Cho nó quyền đổi WiFi
   * nghĩa là bất kỳ ai đứng trước robot cũng ra lệnh được — chỉ cần nói
   * đúng câu. Lệnh này chỉ đi từ giao diện web, sau khi đã đăng nhập.
   */
  wifi_add: z.object({
    ssid: z.string().min(1).max(32),
    pass: z.string().max(63).default(''),
  }),
  /** Speak an arbitrary line (server synthesises, device plays). */
  say: z.object({
    text: z.string().min(1).max(500),
  }),
  /** Runtime knobs the firmware persists to NVS. */
  config: z.object({
    key: z.enum(['volume', 'micGain', 'maxSpeed', 'wakeWord', 'idleTimeout', 'obstacleStopMm']),
    value: z.union([z.string().max(60), z.number(), z.boolean()]),
  }),
  reboot: z.object({}).default({}),
  /** Pull a new firmware build. Version is resolved server-side. */
  ota: z.object({
    version: z.string().max(40).optional(),
  }),
} as const;

export type CommandType = keyof typeof commandSchemas;

export const COMMAND_TYPES = Object.keys(commandSchemas) as CommandType[];

/** Commands the LLM is allowed to trigger on its own during a chat
 *  turn. Deliberately excludes reboot/ota/config — a conversation
 *  should never be able to brick the robot or flash new firmware. */
export const LLM_ALLOWED_COMMANDS: CommandType[] = [
  // ⚠️ Danh sách này TÁCH BIỆT với cờ `llmAllowed` trong COMMAND_CATALOG
  // bên dưới. Bảng kia chỉ để hiện ra giao diện; đây mới là thứ chặn
  // thật. Thêm lệnh mới mà quên chỗ này thì LLM phát lệnh xong bị vứt
  // im lặng, và triệu chứng là "bảo nó làm mà nó không làm" — không
  // một dòng lỗi nào.
  'volume',
  'play_music',
  'stop_music',
  'wifi_add',
  'move',
  'stop',
  'turn',
  'face',
  'look',
  'led',
  'head',
  'arm',
  'dance',
];

export interface ValidatedCommand {
  type: CommandType;
  payload: Record<string, unknown>;
}

/**
 * Validate and clamp. Returns null (never throws) so a bad command
 * from the LLM is dropped silently rather than aborting the reply
 * the user is waiting on.
 */
export function validateCommand(
  type: string,
  payload: unknown,
  opts: { llmOnly?: boolean } = {},
): ValidatedCommand | null {
  if (!COMMAND_TYPES.includes(type as CommandType)) return null;
  const t = type as CommandType;
  if (opts.llmOnly && !LLM_ALLOWED_COMMANDS.includes(t)) return null;

  const parsed = commandSchemas[t].safeParse(payload ?? {});
  if (!parsed.success) return null;
  return { type: t, payload: parsed.data as Record<string, unknown> };
}

/**
 * The command menu, rendered into the system prompt. Kept terse:
 * the model pays for every token of this on every single turn.
 */
export function commandCheatSheet(): string {
  return [
    'move {left,right,ms}  — bánh trái/phải, -255..255, ms<=5000',
    'stop {}',
    'turn {deg,speed}      — xoay tại chỗ, deg -360..360',
    'face {emotion,ms}     — neutral|happy|sad|angry|surprised|sleepy|love|thinking|confused|wink',
    'look {x,y}            — hướng mắt, -1..1',
    'led {r,g,b,effect}    — effect: solid|breathe|spin|blink|off',
    'head {pan,tilt}       — pan -90..90, tilt -35..35',
    'arm {side,shoulder,elbow,ms} — side: left|right|both · vai -90..90 · khuỷu -120..0 (chỉ gập vào)',
    'dance {name}          — spin|wiggle|nod|shake|celebrate',
    'volume {level}        — âm lượng loa 10..100 (phần trăm)',
    'play_music {query}    — bật nhạc trong thư viện; query là tên bài và/hoặc ca sĩ',
    'stop_music {}         — tắt nhạc đang phát',
  ].join('\n');
}

/** Human-facing catalogue for the frontend console + docs tab. */
export const COMMAND_CATALOG: Array<{
  type: CommandType;
  label: string;
  description: string;
  llmAllowed: boolean;
}> = [
  { type: 'move', label: 'Chạy', description: 'Đặt tốc độ hai bánh trong khoảng thời gian', llmAllowed: true },
  { type: 'stop', label: 'Dừng', description: 'Cắt điện cả hai động cơ ngay lập tức', llmAllowed: true },
  { type: 'turn', label: 'Xoay', description: 'Xoay tại chỗ theo số độ', llmAllowed: true },
  { type: 'face', label: 'Biểu cảm', description: 'Đổi biểu cảm trên hai màn hình mắt', llmAllowed: true },
  { type: 'look', label: 'Nhìn', description: 'Đảo con ngươi về một hướng', llmAllowed: true },
  { type: 'led', label: 'Đèn', description: 'Màu và hiệu ứng vòng LED', llmAllowed: true },
  { type: 'head', label: 'Cổ', description: 'Xoay/gật đầu bằng servo', llmAllowed: true },
  { type: 'arm', label: 'Tay', description: 'Vai + khuỷu, hai khớp mỗi bên — vẫy, chỉ trỏ, ôm', llmAllowed: true },
  { type: 'dance', label: 'Nhảy', description: 'Chuỗi động tác dựng sẵn trong firmware', llmAllowed: true },
  { type: 'volume', label: 'Âm lượng', description: 'Đặt âm lượng loa 10-100%', llmAllowed: true },
  { type: 'play_music', label: 'Bật nhạc', description: 'Tìm và phát một bài trong thư viện nhạc của web', llmAllowed: true },
  { type: 'stop_music', label: 'Tắt nhạc', description: 'Dừng bài đang phát', llmAllowed: true },
  {
    type: 'wifi_add',
    label: 'Thêm WiFi',
    description: 'Dạy robot một mạng WiFi mới, để mang đi chỗ khác là tự vào',
    llmAllowed: false,
  },
  { type: 'say', label: 'Nói', description: 'Đọc một câu bất kỳ qua loa', llmAllowed: false },
  { type: 'config', label: 'Cấu hình', description: 'Chỉnh âm lượng, độ nhạy mic, tốc độ tối đa…', llmAllowed: false },
  { type: 'reboot', label: 'Khởi động lại', description: 'Reset mềm bo mạch', llmAllowed: false },
  { type: 'ota', label: 'Cập nhật', description: 'Tải firmware mới qua mạng', llmAllowed: false },
];

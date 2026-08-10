/**
 * ============================================================
 * Maker Lab — Text-to-Speech
 * ============================================================
 *
 * The robot's voice. Four providers behind one function, chosen by
 * `MAKERLAB_TTS_PROVIDER` (or per-project via MakerPersona.voiceProvider),
 * with an automatic fallback chain so a dead upstream turns the robot
 * mute for one sentence instead of forever.
 *
 *   google      translate_tts. Free, no key. DEFAULT — always works.
 *   edge        Microsoft read-aloud. Giọng Việt hay nhất, nhưng từ
 *               07/08/2026 trả 403 — chỉ bật khi có MAKERLAB_EDGE_TOKEN.
 *
 *   openai      OPENAI_API_KEY. Good prosody, foreign accent on Vietnamese.
 *   elevenlabs  ELEVENLABS_API_KEY + a voice id. THIS is the one to use
 *               once you clone your own voice — see cloneVoiceHowTo below.
 *
 * Output is always MP3. Not PCM: at 24 kHz/48 kbps an MP3 sentence is
 * ~6 KB where raw PCM would be ~120 KB, which matters a lot over the
 * robot's WiFi link, and ESP8266Audio decodes MP3 on the ESP32 fine.
 *
 * ── Switching to your cloned voice later ───────────────────
 * No code change. Record ~3 minutes of yourself, create the voice in
 * ElevenLabs, then set on the VPS (/opt/cuonghoangdev/.env):
 *     MAKERLAB_TTS_PROVIDER=elevenlabs
 *     ELEVENLABS_API_KEY=...
 *     MAKERLAB_TTS_VOICE=<voice id>
 * and restart the backend container. Per-project override lives in
 * MakerPersona.voiceProvider / voiceId and beats the env.
 */

import { WebSocket } from 'ws';
import { randomUUID } from 'crypto';
import { logger } from '../../utils/logger.js';

export type TtsProvider = 'edge' | 'google' | 'gcloud' | 'openai' | 'elevenlabs';

export interface TtsOptions {
  provider?: TtsProvider;
  /** Provider-specific voice id/name. */
  voice?: string;
  /** BCP-47, e.g. vi-VN. */
  language?: string;
  /** -50..+50 percent, edge only. */
  ratePct?: number;
  /** -50..+50 Hz, edge only. */
  pitchHz?: number;
}

export interface TtsResult {
  audio: Buffer;
  mime: string;
  provider: TtsProvider;
}

/** Sensible Vietnamese defaults per provider. */
const DEFAULT_VOICE: Record<TtsProvider, string> = {
  edge: 'vi-VN-NamMinhNeural', // male; vi-VN-HoaiMyNeural is the female one
  google: 'vi',
  openai: 'onyx',
  elevenlabs: '', // no default — a cloned voice id is always explicit
  // Giọng nam WaveNet tiếng Việt. Chọn WaveNet chứ không phải Chirp3
  // vì hạn miễn phí gấp BỐN lần (4 triệu ký tự/tháng so với 1 triệu),
  // mà với robot để bàn thì 4 triệu là không bao giờ chạm tới.
  gcloud: 'vi-VN-Wavenet-D',
};

const TTS_TIMEOUT_MS = Number(process.env.MAKERLAB_TTS_TIMEOUT_MS) || 20_000;

function envProvider(): TtsProvider {
  // Default is `google`, not `edge`, as of 2026-08-07: Microsoft's
  // read-aloud endpoint now answers 403 to this handshake (it wants a
  // Sec-MS-GEC token derived from a rotating clock skew). The edge
  // path is kept in the chain — if it comes back it is the better
  // Vietnamese voice — but defaulting to it costs ~600 ms of failed
  // handshake on every single reply, which is 60% of the latency
  // budget for a robot that has one second to answer.
  const p = (process.env.MAKERLAB_TTS_PROVIDER || 'google').toLowerCase();
  if (p === 'google' || p === 'gcloud' || p === 'openai' || p === 'elevenlabs' || p === 'edge')
    return p;
  return 'google';
}

/**
 * Synthesize speech. Tries the requested provider, then falls back
 * through the chain; only throws when every provider failed.
 */
export async function synthesizeSpeech(text: string, opts: TtsOptions = {}): Promise<TtsResult> {
  const clean = sanitizeForSpeech(text);
  if (!clean) throw new Error('nothing to speak');

  const first = opts.provider || envProvider();
  // google last: it always works, so it makes a good floor.
  const chain: TtsProvider[] = [first, 'edge', 'openai', 'elevenlabs', 'google'].filter(
    (p, i, arr) => arr.indexOf(p) === i,
  ) as TtsProvider[];

  let lastErr: unknown = null;
  for (const provider of chain) {
    if (!providerConfigured(provider)) continue;
    try {
      const audio = await withTimeout(runProvider(provider, clean, opts), TTS_TIMEOUT_MS);
      if (audio.length > 0) return { audio, mime: 'audio/mpeg', provider };
    } catch (err) {
      lastErr = err;
      logger.warn('MakerLab TTS provider failed, trying next', {
        provider,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  throw new Error(
    `all TTS providers failed: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  );
}

function providerConfigured(p: TtsProvider): boolean {
  if (p === 'gcloud') return !!process.env.GOOGLE_TTS_API_KEY;
  if (p === 'openai') return !!process.env.OPENAI_API_KEY;
  if (p === 'elevenlabs') return !!process.env.ELEVENLABS_API_KEY;
  // Edge needs its client token supplied; unset means skip it.
  if (p === 'edge') return !!edgeToken();
  return true; // google needs no credentials
}

function runProvider(p: TtsProvider, text: string, opts: TtsOptions): Promise<Buffer> {
  const voice = opts.voice || process.env.MAKERLAB_TTS_VOICE || DEFAULT_VOICE[p];
  const lang = opts.language || process.env.MAKERLAB_TTS_LANG || 'vi-VN';
  switch (p) {
    case 'edge':
      return synthesizeEdge(text, voice || DEFAULT_VOICE.edge, lang, opts);
    case 'google':
      return synthesizeGoogle(text, lang.split('-')[0] || 'vi');
    case 'gcloud':
      return synthesizeGoogleCloud(text, voice || DEFAULT_VOICE.gcloud, lang);
    case 'openai':
      return synthesizeOpenAI(text, voice || DEFAULT_VOICE.openai);
    case 'elevenlabs':
      return synthesizeElevenLabs(text, voice);
  }
}

/**
 * Strip things that sound terrible when read out loud. The LLM is
 * told not to emit markdown, but "told not to" is not a guarantee.
 */
export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_#>|]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1200);
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`tts timeout after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

// ─── Edge (Microsoft read-aloud) ───────────────────────────

/**
 * Microsoft's read-aloud handshake needs a client token. It is a public
 * constant, not a credential — but it is indistinguishable from one to
 * a secret scanner, and hardcoding it would trip the repo's pre-commit
 * hook for every future contributor.
 *
 * Keeping it in env also matches reality: Microsoft started answering
 * 403 to this handshake on 2026-08-07, so the provider is opt-in now.
 * Unset (the default) means edge is skipped entirely rather than
 * burning ~600 ms on a doomed handshake before falling through.
 */
function edgeToken(): string {
  return process.env.MAKERLAB_EDGE_TOKEN ?? '';
}

function edgeWssUrl(): string {
  return `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${edgeToken()}`;
}

function edgeTimestamp(): string {
  return new Date().toISOString().replace(/[:-]/g, '').replace(/\.\d+Z$/, 'Z');
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Edge's protocol: a WebSocket carrying HTTP-ish framed messages.
 * Text frames are `Header:value\r\n...\r\n\r\nbody`; binary frames
 * start with a big-endian uint16 header length, then the header,
 * then the MP3 bytes. `Path:turn.end` means the clip is complete.
 */
function synthesizeEdge(
  text: string,
  voice: string,
  language: string,
  opts: TtsOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(edgeWssUrl(), {
      headers: {
        Origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      },
    });

    const chunks: Buffer[] = [];
    let settled = false;
    const done = (err: Error | null, buf?: Buffer) => {
      if (settled) return;
      settled = true;
      try {
        ws.close();
      } catch {
        /* already closing */
      }
      if (err) reject(err);
      else resolve(buf ?? Buffer.alloc(0));
    };

    ws.on('open', () => {
      const ts = edgeTimestamp();
      ws.send(
        `X-Timestamp:${ts}\r\n` +
          'Content-Type:application/json; charset=utf-8\r\n' +
          'Path:speech.config\r\n\r\n' +
          '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}',
      );

      const rate = clampInt(opts.ratePct ?? 0, -50, 50);
      const pitch = clampInt(opts.pitchHz ?? 0, -50, 50);
      const ssml =
        `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${language}'>` +
        `<voice name='${voice}'>` +
        `<prosody rate='${rate >= 0 ? '+' : ''}${rate}%' pitch='${pitch >= 0 ? '+' : ''}${pitch}Hz'>` +
        `${escapeXml(text)}</prosody></voice></speak>`;

      ws.send(
        `X-RequestId:${randomUUID().replace(/-/g, '')}\r\n` +
          'Content-Type:application/ssml+xml\r\n' +
          `X-Timestamp:${ts}\r\n` +
          'Path:ssml\r\n\r\n' +
          ssml,
      );
    });

    ws.on('message', (data: Buffer, isBinary: boolean) => {
      if (isBinary) {
        if (data.length < 2) return;
        const headerLen = data.readUInt16BE(0);
        const body = data.subarray(2 + headerLen);
        if (body.length) chunks.push(body);
        return;
      }
      const msg = data.toString();
      if (msg.includes('Path:turn.end')) {
        const out = Buffer.concat(chunks);
        if (!out.length) done(new Error('edge tts returned no audio'));
        else done(null, out);
      }
    });

    ws.on('error', (err) => done(err instanceof Error ? err : new Error(String(err))));
    ws.on('close', () => {
      if (settled) return;
      const out = Buffer.concat(chunks);
      if (out.length) done(null, out);
      else done(new Error('edge tts socket closed before audio'));
    });
  });
}

function clampInt(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.trunc(n)));
}

// ─── Google translate_tts ──────────────────────────────────

/**
 * Free and keyless, but hard-capped at ~200 characters per request,
 * so long replies are split on sentence boundaries and the MP3s are
 * concatenated. Frame-level concatenation is legal MP3 and every
 * decoder (including the ESP32's) plays it back seamlessly.
 */
async function synthesizeGoogle(text: string, lang: string): Promise<Buffer> {
  const parts = chunkText(text, 190);
  const out: Buffer[] = [];
  for (const part of parts) {
    const url =
      'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob' +
      `&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(part)}&total=${parts.length}&idx=${out.length}&textlen=${part.length}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });
    if (!res.ok) throw new Error(`google tts HTTP ${res.status}`);
    out.push(Buffer.from(await res.arrayBuffer()));
  }
  return Buffer.concat(out);
}

/** Split on sentence ends, then on spaces, never mid-word. */
function chunkText(text: string, max: number): string[] {
  const sentences = text.split(/(?<=[.!?…。！？])\s+/);
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if (s.length > max) {
      if (cur) {
        chunks.push(cur);
        cur = '';
      }
      let rest = s;
      while (rest.length > max) {
        const cut = rest.lastIndexOf(' ', max);
        const at = cut > max * 0.5 ? cut : max;
        chunks.push(rest.slice(0, at));
        rest = rest.slice(at).trim();
      }
      cur = rest;
      continue;
    }
    if ((cur + ' ' + s).trim().length > max) {
      chunks.push(cur);
      cur = s;
    } else {
      cur = (cur + ' ' + s).trim();
    }
  }
  if (cur) chunks.push(cur);
  return chunks.filter(Boolean);
}

// ─── OpenAI ────────────────────────────────────────────────

async function synthesizeOpenAI(text: string, voice: string): Promise<Buffer> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.MAKERLAB_OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
      voice,
      input: text,
      response_format: 'mp3',
    }),
  });
  if (!res.ok) throw new Error(`openai tts HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
  return Buffer.from(await res.arrayBuffer());
}

// ─── ElevenLabs (voice cloning) ────────────────────────────

async function synthesizeElevenLabs(text: string, voiceId: string): Promise<Buffer> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY missing');
  const id = voiceId || process.env.MAKERLAB_TTS_VOICE;
  if (!id) throw new Error('elevenlabs voice id missing');

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}?output_format=mp3_22050_32`,
    {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        // v2.5 flash is the low-latency multilingual model — the right
        // trade-off for a robot that has to answer in about a second.
        model_id: process.env.MAKERLAB_ELEVEN_MODEL || 'eleven_flash_v2_5',
        voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.2 },
      }),
    },
  );
  if (!res.ok)
    throw new Error(`elevenlabs HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Surfaced in the frontend so the setup steps live next to the switch. */
export const cloneVoiceHowTo = {
  provider: 'elevenlabs',
  steps: [
    'Thu 3–5 phút giọng của bạn: đọc rõ, phòng yên, một micro duy nhất, không nhạc nền.',
    'Lên elevenlabs.io → Voices → Add Voice → Instant Voice Cloning → tải file lên.',
    'Sao chép Voice ID mà nó sinh ra.',
    'Trên VPS thêm vào /opt/cuonghoangdev/.env: MAKERLAB_TTS_PROVIDER=elevenlabs, ELEVENLABS_API_KEY=..., MAKERLAB_TTS_VOICE=<voice id>',
    'Khởi động lại container backend. Không phải build lại, không phải sửa code.',
  ],
};

// ─── Google Cloud Text-to-Speech ───────────────────────────

/**
 * Khác hẳn `synthesizeGoogle` ở trên. Cái kia gọi `translate_tts` —
 * cửa sau miễn phí không cần khoá, đúng MỘT giọng máy móc cho mỗi
 * ngôn ngữ, và Google có thể chặn bất cứ lúc nào. Cái này là dịch vụ
 * thật, có khoá, nhiều giọng, chất lượng hơn hẳn.
 *
 * Vì sao đáng đổi — con số lấy từ bảng giá chính thức 10/08/2026:
 *
 *   WaveNet / Standard   4.000.000 ký tự/tháng miễn phí, sau đó  4 $/1M
 *   Neural2 / Chirp3-HD  1.000.000 ký tự/tháng miễn phí, sau đó 16-30 $/1M
 *
 * Robot mỗi lượt nói ~120 ký tự. 4 triệu ký tự là ~33.000 lượt mỗi
 * tháng, tức 1.100 lượt mỗi ngày — với một con robot để bàn thì đó là
 * vô hạn trên thực tế. Để so: ElevenLabs gói 22 $ cho 121.000 ký tự,
 * tức ~1.000 lượt/tháng. Gấp 33 lần, mà miễn phí.
 *
 * Đánh đổi: KHÔNG nhân bản được giọng của bạn. Đó vẫn là chỗ duy nhất
 * ElevenLabs hơn.
 */
async function synthesizeGoogleCloud(
  text: string,
  voice: string,
  lang: string,
): Promise<Buffer> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error('GOOGLE_TTS_API_KEY missing');

  // Tên giọng đã cõng sẵn mã ngôn ngữ ("vi-VN-Wavenet-D") — lấy từ đó
  // ra thay vì tin vào `lang` truyền xuống, vì chọn nhầm cặp
  // ngôn-ngữ/giọng thì API trả 400 chứ không tự sửa.
  const languageCode = /^[a-z]{2}-[A-Z]{2}/.exec(voice)?.[0] || lang || 'vi-VN';

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TTS_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode, name: voice },
          // MP3 chứ không phải LINEAR16: gateway đã có sẵn đường đổi
          // sang PCM cho bo, và MP3 nhẹ hơn ~4 lần khi đi qua mạng tới
          // VPS. Chỗ này không phải nút thắt — đổi mã chỉ tốn ~120 ms.
          audioConfig: { audioEncoding: 'MP3' },
        }),
        signal: ctrl.signal,
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`gcloud tts HTTP ${res.status} ${detail.slice(0, 160)}`);
    }
    const json = (await res.json()) as { audioContent?: string };
    if (!json.audioContent) throw new Error('gcloud tts: thiếu audioContent');
    return Buffer.from(json.audioContent, 'base64');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Giọng tiếng Việt của Google Cloud, để UI khỏi phải đoán.
 *
 * Danh sách này có thể lệch với thực tế theo thời gian — gọi
 * `listGoogleCloudVoices()` để lấy bản thật từ API khi cần chắc chắn.
 */
export const GCLOUD_VI_VOICES = [
  { id: 'vi-VN-Wavenet-A', label: 'WaveNet A — nữ' },
  { id: 'vi-VN-Wavenet-B', label: 'WaveNet B — nam' },
  { id: 'vi-VN-Wavenet-C', label: 'WaveNet C — nữ' },
  { id: 'vi-VN-Wavenet-D', label: 'WaveNet D — nam' },
  { id: 'vi-VN-Standard-A', label: 'Standard A — nữ' },
  { id: 'vi-VN-Standard-B', label: 'Standard B — nam' },
  { id: 'vi-VN-Standard-C', label: 'Standard C — nữ' },
  { id: 'vi-VN-Standard-D', label: 'Standard D — nam' },
  { id: 'vi-VN-Neural2-A', label: 'Neural2 A — nữ (hạn 1M/tháng)' },
  { id: 'vi-VN-Neural2-D', label: 'Neural2 D — nam (hạn 1M/tháng)' },
];

/** Hỏi thẳng API xem tài khoản này có những giọng nào. */
export async function listGoogleCloudVoices(lang = 'vi-VN'): Promise<string[]> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error('GOOGLE_TTS_API_KEY missing');
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/voices?languageCode=${encodeURIComponent(lang)}&key=${encodeURIComponent(key)}`,
  );
  if (!res.ok) throw new Error(`gcloud voices HTTP ${res.status}`);
  const json = (await res.json()) as { voices?: Array<{ name?: string }> };
  return (json.voices ?? []).map((v) => v.name ?? '').filter(Boolean);
}

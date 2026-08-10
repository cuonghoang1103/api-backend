/**
 * ============================================================
 * Maker Lab — Device Gateway (raw WebSocket, /device-ws)
 * ============================================================
 *
 * The channel physical boards (ESP32 & friends) use to reach the
 * backend. Deliberately NOT socket.io:
 *
 *   1. Microcontroller WebSocket libraries (arduinoWebSockets,
 *      esp_websocket_client) speak plain RFC-6455. Socket.IO adds
 *      its own handshake/packet framing on top, which costs flash,
 *      RAM and debugging time on a device that has little of each.
 *   2. We stream raw audio both ways. Binary frames straight off
 *      the wire beat base64-in-JSON by ~33% bandwidth and a lot of
 *      CPU on a 240 MHz chip.
 *
 * Browsers keep using socket.io as everywhere else on the site;
 * this gateway fans every device event out to the room
 * `maker:device:<id>` so the Live Console updates in real time.
 *
 * ── Wire protocol ──────────────────────────────────────────
 * Device → server, TEXT frames (JSON, `t` = type):
 *   { t:'hello',     fw, ip, rssi, battery }
 *   { t:'telemetry', ...any numeric fields }
 *   { t:'log',       level, msg }
 *   { t:'ack',       id, ok, error? }
 *   { t:'audio_end' }                  end of one spoken turn
 *   { t:'text',      text }            device did its own STT
 *   { t:'pong' }
 *
 * Device → server, BINARY frames: raw PCM, 16-bit LE, mono, 16 kHz.
 *
 * Server → device, TEXT frames:
 *   { t:'cmd',       id, type, payload }
 *   { t:'say_start', format, mime }
 *   { t:'say_end' }
 *   { t:'transcript',role, text }      so the robot can show it
 *   { t:'ping' }
 *
 * Server → device, BINARY frames: TTS audio for the current turn.
 *
 * ── Auth ───────────────────────────────────────────────────
 * `wss://host/device-ws?key=<deviceKey>&secret=<plaintext>`
 * The secret is bcrypt-compared against `MakerDevice.secretHash`;
 * plaintext is shown to the owner exactly once at registration.
 * Bad credentials close with 4401 — never with a body that says
 * which half was wrong.
 */

import type { Server as HttpServer, IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import { WebSocketServer, WebSocket, type RawData } from 'ws';
import bcrypt from 'bcryptjs';
import { MakerCommandStatus, MakerDeviceStatus } from '@prisma/client';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { getIO } from './messaging.socket.js';
import { encodeForDevice, type DeviceAudioFormat } from '../services/makerlab/audio.js';

// ─── Tunables ──────────────────────────────────────────────
/** Path we claim on the shared HTTP server. */
const WS_PATH = '/device-ws';
/** Heartbeat: ping every 30s, drop a device that misses two. */
const HEARTBEAT_MS = 30_000;
/** 16-bit mono @16 kHz = 32 KB/s. 30s cap keeps one rogue device from eating RAM. */
const MAX_AUDIO_BYTES = 32_000 * 30;
/** Telemetry arrives ~1 Hz; persisting every row would be 86k/day/device. */
const TELEMETRY_PERSIST_MS = 10_000;
/** Keep the device log table from growing without bound. */
const LOG_RING_SIZE = 1000;
/** One board, one socket. A reconnect kicks the stale one. */
const MAX_FRAME_BYTES = 256 * 1024;

// ─── Connection registry ───────────────────────────────────
interface DeviceConn {
  ws: WebSocket;
  deviceId: number;
  projectId: number;
  ownerId: number;
  deviceKey: string;
  alive: boolean;
  /** Audio accumulated since the last `audio_end`. */
  audioChunks: Buffer[];
  audioBytes: number;
  /** Guards the DB write rate for telemetry (see TELEMETRY_PERSIST_MS). */
  lastTelemetryPersistAt: number;
  /** Set while a TTS reply is streaming out, so we can barge-in. */
  speaking: boolean;
  /** Bumped on every new turn; a stale TTS stream checks this and stops. */
  turnSeq: number;
  /**
   * What the board can actually play. Declared in `hello`; defaults to
   * mp3 for anything that doesn't say. A microcontroller that asks for
   * `pcm` gets raw samples it can push straight into I2S — no decoder,
   * no ring buffer, nothing to go wrong.
   */
  audioFormat: DeviceAudioFormat;
}

const connections = new Map<number, DeviceConn>();

let wss: WebSocketServer | null = null;
let heartbeat: NodeJS.Timeout | null = null;

// ─── Fan-out to the browser console (socket.io) ────────────

function room(deviceId: number): string {
  return `maker:device:${deviceId}`;
}

function emitToConsole(deviceId: number, event: string, payload: unknown): void {
  const io = getIO();
  if (!io) return;
  io.to(room(deviceId)).emit(event, payload);
}

// ─── Sending to a device ───────────────────────────────────

function sendJson(conn: DeviceConn, obj: Record<string, unknown>): boolean {
  if (conn.ws.readyState !== WebSocket.OPEN) return false;
  try {
    conn.ws.send(JSON.stringify(obj));
    return true;
  } catch (err) {
    logger.warn('MakerLab device send failed', {
      deviceId: conn.deviceId,
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

/** True when the board currently holds an open socket. */
export function isDeviceOnline(deviceId: number): boolean {
  const c = connections.get(deviceId);
  return !!c && c.ws.readyState === WebSocket.OPEN;
}

export function getOnlineDeviceIds(): number[] {
  return [...connections.keys()].filter(isDeviceOnline);
}

/**
 * Push a queued command down to the board.
 * Returns false when the device is offline — the caller leaves the
 * row PENDING so it flushes on the next connect.
 */
export function pushCommand(
  deviceId: number,
  command: { id: number; type: string; payload?: unknown },
): boolean {
  const conn = connections.get(deviceId);
  if (!conn) return false;
  const ok = sendJson(conn, {
    t: 'cmd',
    id: command.id,
    type: command.type,
    payload: command.payload ?? {},
  });
  if (ok) {
    void prisma.makerCommand
      .update({
        where: { id: command.id },
        data: { status: MakerCommandStatus.SENT, sentAt: new Date() },
      })
      .catch(() => undefined);
    emitToConsole(deviceId, 'maker:command:update', { id: command.id, status: 'SENT' });
  }
  return ok;
}

/**
 * Stream a TTS clip to the speaker. Text frame → binary chunks →
 * text frame, so the firmware knows exactly where the clip ends
 * without parsing the audio itself.
 */
export async function speakOnDevice(
  deviceId: number,
  audio: Buffer,
  opts: { mime?: string; text?: string } = {},
): Promise<boolean> {
  const conn = connections.get(deviceId);
  if (!conn || conn.ws.readyState !== WebSocket.OPEN) return false;

  // Chuyển sang đúng thứ bo mạch phát được. Bo khai báo `pcm` nhận
  // mẫu thô đẩy thẳng vào I2S — không giải mã, không thư viện, không
  // có gì để hỏng. Chuyển đổi tốn ~80 ms, rẻ hơn nhiều so với một lỗi
  // giải mã MP3 trên vi điều khiển.
  let payload = audio;
  let mime = opts.mime ?? 'audio/mpeg';
  let sampleRate: number | undefined;

  if (conn.audioFormat === 'pcm') {
    try {
      const enc = await encodeForDevice(audio, 'pcm');
      payload = enc.audio;
      mime = enc.mime;
      sampleRate = enc.sampleRate;
    } catch (err) {
      logger.warn('MakerLab đổi PCM thất bại, gửi nguyên MP3', {
        deviceId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const seq = conn.turnSeq;
  conn.speaking = true;
  sendJson(conn, {
    t: 'say_start',
    mime,
    bytes: payload.length,
    ...(sampleRate ? { sampleRate, bits: 16, channels: 1 } : {}),
  });
  audio = payload;

  // 8 KB chunks: comfortably under the firmware's receive buffer and
  // small enough that a barge-in cuts in within ~a quarter second.
  const CHUNK = 8 * 1024;
  for (let off = 0; off < audio.length; off += CHUNK) {
    // A newer turn started (user interrupted) — abandon this clip.
    if (conn.turnSeq !== seq || conn.ws.readyState !== WebSocket.OPEN) {
      conn.speaking = false;
      return false;
    }
    conn.ws.send(audio.subarray(off, Math.min(off + CHUNK, audio.length)));
  }

  sendJson(conn, { t: 'say_end' });
  conn.speaking = false;
  if (opts.text) {
    sendJson(conn, { t: 'transcript', role: 'bot', text: opts.text });
    emitToConsole(deviceId, 'maker:device:transcript', {
      deviceId,
      role: 'bot',
      text: opts.text,
      at: new Date().toISOString(),
    });
  }
  return true;
}

// ─── Device event handlers ─────────────────────────────────

async function handleHello(conn: DeviceConn, msg: Record<string, unknown>): Promise<void> {
  const data: Record<string, unknown> = {
    status: MakerDeviceStatus.ONLINE,
    lastSeenAt: new Date(),
  };
  if (typeof msg.fw === 'string') data.firmwareVersion = msg.fw.slice(0, 40);
  if (typeof msg.ip === 'string') data.ipAddress = msg.ip.slice(0, 64);
  if (typeof msg.rssi === 'number') data.rssi = Math.trunc(msg.rssi);
  if (typeof msg.battery === 'number') data.batteryPct = clampPct(msg.battery);

  // Bo tự khai báo nó phát được định dạng nào. Không nói gì thì coi
  // như mp3 — giữ nguyên hành vi cũ cho mọi thiết bị đã có.
  if (msg.audio === 'pcm' || msg.audio === 'mp3') {
    conn.audioFormat = msg.audio;
    logger.info('MakerLab thiết bị khai báo định dạng âm thanh', {
      deviceId: conn.deviceId,
      format: msg.audio,
    });
  }

  await prisma.makerDevice.update({ where: { id: conn.deviceId }, data }).catch(() => undefined);
  emitToConsole(conn.deviceId, 'maker:device:status', {
    deviceId: conn.deviceId,
    status: 'ONLINE',
    ...data,
  });

  // Flush anything queued while the board was away.
  const pending = await prisma.makerCommand.findMany({
    where: { deviceId: conn.deviceId, status: MakerCommandStatus.PENDING },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });
  for (const cmd of pending) {
    pushCommand(conn.deviceId, { id: cmd.id, type: cmd.type, payload: cmd.payload });
  }
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

async function handleTelemetry(conn: DeviceConn, msg: Record<string, unknown>): Promise<void> {
  const { t: _t, ...payload } = msg;

  // Always fan out live — the console should feel instant.
  emitToConsole(conn.deviceId, 'maker:device:telemetry', {
    deviceId: conn.deviceId,
    payload,
    recordedAt: new Date().toISOString(),
  });

  // Cheap fields worth keeping on the device row for the card view.
  const devicePatch: Record<string, unknown> = { lastSeenAt: new Date() };
  if (typeof payload.battery === 'number') devicePatch.batteryPct = clampPct(payload.battery);
  if (typeof payload.rssi === 'number') devicePatch.rssi = Math.trunc(payload.rssi);
  if (typeof payload.uptime === 'number') devicePatch.uptimeSec = Math.trunc(payload.uptime);

  const now = Date.now();
  const shouldPersist = now - conn.lastTelemetryPersistAt >= TELEMETRY_PERSIST_MS;
  if (shouldPersist) conn.lastTelemetryPersistAt = now;

  await prisma.makerDevice
    .update({ where: { id: conn.deviceId }, data: devicePatch })
    .catch(() => undefined);

  if (shouldPersist) {
    await prisma.makerTelemetry
      .create({ data: { deviceId: conn.deviceId, payload: payload as object } })
      .catch(() => undefined);
  }
}

async function handleLog(conn: DeviceConn, msg: Record<string, unknown>): Promise<void> {
  const level = typeof msg.level === 'string' ? msg.level.slice(0, 8) : 'info';
  const message = String(msg.msg ?? '').slice(0, 2000);
  if (!message) return;

  emitToConsole(conn.deviceId, 'maker:device:log', {
    deviceId: conn.deviceId,
    level,
    message,
    at: new Date().toISOString(),
  });

  const row = await prisma.makerDeviceLog
    .create({ data: { deviceId: conn.deviceId, level, message } })
    .catch(() => null);

  // Trim the ring occasionally rather than on every line.
  if (row && row.id % 100 === 0) {
    await prisma
      .$executeRaw`DELETE FROM maker_device_logs WHERE device_id = ${conn.deviceId} AND id NOT IN (SELECT id FROM maker_device_logs WHERE device_id = ${conn.deviceId} ORDER BY id DESC LIMIT ${LOG_RING_SIZE})`
      .catch(() => undefined);
  }
}

async function handleAck(conn: DeviceConn, msg: Record<string, unknown>): Promise<void> {
  const id = Number(msg.id);
  if (!Number.isInteger(id)) return;
  const ok = msg.ok !== false;
  await prisma.makerCommand
    .update({
      where: { id },
      data: {
        status: ok ? MakerCommandStatus.ACKED : MakerCommandStatus.FAILED,
        ackedAt: new Date(),
        error: ok ? null : String(msg.error ?? 'device reported failure').slice(0, 500),
      },
    })
    .catch(() => undefined);
  emitToConsole(conn.deviceId, 'maker:command:update', { id, status: ok ? 'ACKED' : 'FAILED' });
}

/**
 * End of a spoken turn: hand the buffered audio to the voice loop.
 * Imported lazily so the gateway boots even if the AI stack is
 * misconfigured — a robot that can drive but not talk beats a
 * backend that won't start.
 */
async function handleAudioEnd(conn: DeviceConn): Promise<void> {
  const audio = Buffer.concat(conn.audioChunks);
  conn.audioChunks = [];
  conn.audioBytes = 0;
  if (audio.length < 4000) return; // < 0.12s — a click, not speech

  conn.turnSeq += 1;
  try {
    const { runVoiceTurn } = await import('../services/makerlab/voiceLoop.js');
    await runVoiceTurn({
      deviceId: conn.deviceId,
      projectId: conn.projectId,
      pcm16: audio,
    });
  } catch (err) {
    logger.error('MakerLab voice turn failed', {
      deviceId: conn.deviceId,
      error: err instanceof Error ? err.message : String(err),
    });
    sendJson(conn, { t: 'error', scope: 'voice', msg: 'voice pipeline failed' });
  }
}

async function handleText(conn: DeviceConn, msg: Record<string, unknown>): Promise<void> {
  const text = String(msg.text ?? '').trim().slice(0, 1000);
  if (!text) return;
  conn.turnSeq += 1;
  try {
    const { runVoiceTurn } = await import('../services/makerlab/voiceLoop.js');
    await runVoiceTurn({ deviceId: conn.deviceId, projectId: conn.projectId, text });
  } catch (err) {
    logger.error('MakerLab text turn failed', {
      deviceId: conn.deviceId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ─── Message router ────────────────────────────────────────

async function onMessage(conn: DeviceConn, raw: RawData, isBinary: boolean): Promise<void> {
  if (isBinary) {
    const chunk = Buffer.isBuffer(raw) ? raw : Buffer.from(raw as ArrayBuffer);
    // Drop the turn rather than the process when a device floods us.
    if (conn.audioBytes + chunk.length > MAX_AUDIO_BYTES) {
      conn.audioChunks = [];
      conn.audioBytes = 0;
      sendJson(conn, { t: 'error', scope: 'audio', msg: 'turn too long, buffer reset' });
      return;
    }
    conn.audioChunks.push(chunk);
    conn.audioBytes += chunk.length;
    return;
  }

  let msg: Record<string, unknown>;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return; // malformed frame: ignore, don't kill the link
  }
  if (!msg || typeof msg !== 'object') return;

  conn.alive = true;
  switch (msg.t) {
    case 'hello':
      await handleHello(conn, msg);
      break;
    case 'telemetry':
      await handleTelemetry(conn, msg);
      break;
    case 'log':
      await handleLog(conn, msg);
      break;
    case 'ack':
      await handleAck(conn, msg);
      break;
    case 'audio_end':
      await handleAudioEnd(conn);
      break;
    case 'audio_start':
      // New turn: cancel whatever the robot is currently saying.
      conn.turnSeq += 1;
      conn.audioChunks = [];
      conn.audioBytes = 0;
      break;
    case 'text':
      await handleText(conn, msg);
      break;
    case 'pong':
      break;
    default:
      break;
  }
}

// ─── Auth on upgrade ───────────────────────────────────────

interface AuthResult {
  deviceId: number;
  projectId: number;
  ownerId: number;
  deviceKey: string;
}

async function authenticateDevice(url: URL): Promise<AuthResult | null> {
  const key = url.searchParams.get('key');
  const secret = url.searchParams.get('secret');
  if (!key || !secret) return null;

  const device = await prisma.makerDevice.findUnique({
    where: { deviceKey: key },
    select: { id: true, projectId: true, ownerId: true, secretHash: true, deviceKey: true },
  });
  if (!device) {
    // Constant-ish work on the miss path so timing doesn't leak
    // whether a key exists.
    await bcrypt.compare(secret, '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi');
    return null;
  }
  const ok = await bcrypt.compare(secret, device.secretHash);
  if (!ok) return null;

  return {
    deviceId: device.id,
    projectId: device.projectId,
    ownerId: device.ownerId,
    deviceKey: device.deviceKey,
  };
}

// ─── Lifecycle ─────────────────────────────────────────────

async function markOffline(deviceId: number): Promise<void> {
  await prisma.makerDevice
    .update({
      where: { id: deviceId },
      data: { status: MakerDeviceStatus.OFFLINE, lastSeenAt: new Date() },
    })
    .catch(() => undefined);
  emitToConsole(deviceId, 'maker:device:status', { deviceId, status: 'OFFLINE' });
}

/**
 * Attach the gateway to the shared HTTP server.
 *
 * `noServer: true` + a manual upgrade listener rather than
 * `{ server, path }`: socket.io also listens for 'upgrade' on this
 * same server. Letting `ws` own the server would make the two fight
 * over every upgrade request. With noServer we only touch requests
 * whose path is exactly ours and leave the rest for socket.io —
 * which is why this listener must never destroy sockets it doesn't
 * recognise.
 */
export function initDeviceGateway(httpServer: HttpServer): WebSocketServer {
  if (wss) return wss;

  wss = new WebSocketServer({ noServer: true, maxPayload: MAX_FRAME_BYTES });

  httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    let url: URL;
    try {
      url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    } catch {
      return; // not parseable — not ours
    }
    if (url.pathname !== WS_PATH) return; // socket.io or something else: hands off

    void (async () => {
      try {
        // Hạn cứng cho việc xác thực. Prisma cạn pool kết nối thì
        // truy vấn nằm chờ chứ không lỗi ngay, và một socket treo vô
        // hạn là thứ tệ nhất để gỡ: bo chỉ thấy "không ai trả lời".
        const auth = await Promise.race([
          authenticateDevice(url),
          new Promise<never>((_, rej) =>
            setTimeout(() => rej(new Error('auth timeout 8s')), 8_000).unref?.(),
          ),
        ]);
        if (!auth) {
          socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
          socket.destroy();
          return;
        }
        wss!.handleUpgrade(req, socket, head, (ws) => {
          acceptDevice(ws, auth);
        });
      } catch (err) {
        // ⚠️ KHÔNG ĐƯỢC BỎ NHÁNH NÀY.
        //
        // Trước đây đây là `void (async ...)()` trần. Khoá sai thì hàm
        // trả null rất ngoan và socket nhận 401; nhưng khoá ĐÚNG mà
        // truy vấn ném lỗi thì promise reject trong im lặng, không ai
        // ghi gì vào socket, và thiết bị ngồi chờ tới lúc hết hạn.
        // Đo trên bo thật: cùng một kết nối TLS, `GET /api/v1/...` trả
        // 200 tức thì còn `GET /device-ws` im 8 giây. Một lỗi không
        // bắt trông y hệt một cái mạng hỏng, và đã tốn mấy tiếng đi
        // nghi mạng.
        const e = err instanceof Error ? err : new Error(String(err));
        // Nhãn ngắn, an toàn — thiết bị không có kênh nào khác để biết
        // vì sao nó bị từ chối, nên nhét vào chính dòng trạng thái.
        const tag = /timeout/i.test(e.message)
          ? 'auth-timeout'
          : e.constructor.name.startsWith('Prisma')
            ? 'db-error'
            : 'auth-error';
        logger.error('MakerLab từ chối nâng cấp WebSocket', {
          tag,
          error: e.message,
          type: e.constructor.name,
        });
        try {
          socket.write(`HTTP/1.1 500 ${tag}\r\nConnection: close\r\n\r\n`);
        } catch {
          /* socket đã chết — không còn gì để nói */
        }
        socket.destroy();
      }
    })();
  });

  heartbeat = setInterval(() => {
    for (const conn of connections.values()) {
      if (!conn.alive) {
        conn.ws.terminate();
        continue;
      }
      conn.alive = false;
      sendJson(conn, { t: 'ping' });
      try {
        conn.ws.ping();
      } catch {
        /* socket already gone */
      }
    }
  }, HEARTBEAT_MS);
  heartbeat.unref?.();

  logger.info(`MakerLab device gateway listening on ${WS_PATH}`);
  return wss;
}

function acceptDevice(ws: WebSocket, auth: AuthResult): void {
  // One board, one socket: a reconnect after a brownout must not
  // leave a zombie holding the device id.
  const existing = connections.get(auth.deviceId);
  if (existing) {
    try {
      existing.ws.close(4409, 'replaced by newer connection');
    } catch {
      /* ignore */
    }
  }

  const conn: DeviceConn = {
    ws,
    deviceId: auth.deviceId,
    projectId: auth.projectId,
    ownerId: auth.ownerId,
    deviceKey: auth.deviceKey,
    alive: true,
    audioChunks: [],
    audioBytes: 0,
    lastTelemetryPersistAt: 0,
    speaking: false,
    audioFormat: 'mp3',
    turnSeq: 0,
  };
  connections.set(auth.deviceId, conn);

  logger.info('MakerLab device connected', { deviceId: auth.deviceId, key: auth.deviceKey });
  sendJson(conn, { t: 'welcome', deviceId: auth.deviceId, serverTime: Date.now() });
  void handleHello(conn, {}).catch(() => undefined);

  ws.on('message', (raw, isBinary) => {
    void onMessage(conn, raw, isBinary).catch((err) => {
      logger.warn('MakerLab device message handler threw', {
        deviceId: conn.deviceId,
        error: err instanceof Error ? err.message : String(err),
      });
    });
  });

  ws.on('pong', () => {
    conn.alive = true;
  });

  ws.on('close', () => {
    // Only clear the registry if we are still the current socket —
    // a replaced zombie closing later must not evict the live one.
    if (connections.get(auth.deviceId) === conn) {
      connections.delete(auth.deviceId);
      void markOffline(auth.deviceId);
    }
    logger.info('MakerLab device disconnected', { deviceId: auth.deviceId });
  });

  ws.on('error', (err) => {
    logger.warn('MakerLab device socket error', {
      deviceId: auth.deviceId,
      error: err instanceof Error ? err.message : String(err),
    });
  });
}

/** Used by tests / graceful shutdown. */
export function closeDeviceGateway(): void {
  if (heartbeat) clearInterval(heartbeat);
  heartbeat = null;
  for (const conn of connections.values()) conn.ws.terminate();
  connections.clear();
  wss?.close();
  wss = null;
}

#!/usr/bin/env node
/**
 * ============================================================
 * Maker Lab — robot simulator
 * ============================================================
 *
 * Pretends to be an ESP32 on the other end of /device-ws so the whole
 * pipeline — gateway auth, telemetry, commands, logs, the voice loop,
 * the Live Console — can be verified before a single part is bought.
 *
 * It also stays useful afterwards: when the real robot misbehaves,
 * running this tells you within a minute whether the problem is the
 * firmware or the server.
 *
 * Usage:
 *   node tools/fake-device.mjs --key mk_xxx --secret yyy
 *   node tools/fake-device.mjs --key mk_xxx --secret yyy --host cuongthai.com --tls
 *
 * Get the key/secret from the "Điều khiển" tab: register a device and
 * copy the credentials it shows you exactly once.
 */

import { WebSocket } from 'ws';

// ─── Args ──────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) {
      const key = cur.slice(2);
      const next = arr[i + 1];
      acc.push([key, next && !next.startsWith('--') ? next : true]);
    }
    return acc;
  }, []),
);

const KEY = args.key || process.env.DEVICE_KEY;
const SECRET = args.secret || process.env.DEVICE_SECRET;
const HOST = args.host || process.env.DEVICE_HOST || 'localhost:3001';
const TLS = !!args.tls;
const NAME = args.name || 'fake-robot';

if (!KEY || !SECRET) {
  console.error(`
Thiếu thông tin đăng nhập thiết bị.

  node tools/fake-device.mjs --key mk_xxx --secret yyy [--host cuongthai.com --tls]

Lấy key/secret ở tab "Điều khiển" của dự án: bấm Đăng ký, rồi chép
đúng lần hiện ra duy nhất đó.
`);
  process.exit(1);
}

const url = `${TLS ? 'wss' : 'ws'}://${HOST}/device-ws?key=${encodeURIComponent(KEY)}&secret=${encodeURIComponent(SECRET)}`;

// ─── Simulated robot state ─────────────────────────────────
const state = {
  battery: 92,
  rssi: -54,
  uptime: 0,
  distanceMm: 850,
  pitch: 0.4,
  roll: -0.2,
  leftSpeed: 0,
  rightSpeed: 0,
  emotion: 'neutral',
  heading: 0,
};

let ws = null;
let backoff = 1000;
let timers = [];

function log(...a) {
  console.log(`[${new Date().toLocaleTimeString('vi-VN')}]`, ...a);
}

function send(obj) {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}

function connect() {
  log(`Đang nối tới ${TLS ? 'wss' : 'ws'}://${HOST}/device-ws …`);
  ws = new WebSocket(url);

  ws.on('open', () => {
    backoff = 1000;
    log('✅ Đã kết nối');

    send({
      t: 'hello',
      fw: '0.1.0-sim',
      ip: '192.168.1.77',
      rssi: state.rssi,
      battery: state.battery,
    });
    send({ t: 'log', level: 'info', msg: `${NAME} khởi động, PSRAM 8MB, I2S sẵn sàng` });

    // Telemetry at 1 Hz, like the real firmware. The gateway only
    // persists every 10s but fans out all of it live.
    timers.push(
      setInterval(() => {
        state.uptime += 1;
        // Battery drains faster while the motors are running — makes
        // the console graph show something real when you drive it.
        const load = (Math.abs(state.leftSpeed) + Math.abs(state.rightSpeed)) / 510;
        state.battery = Math.max(0, state.battery - 0.004 - load * 0.02);
        state.rssi = -50 - Math.round(Math.random() * 12);
        state.distanceMm = Math.max(
          40,
          Math.round(state.distanceMm + (Math.random() - 0.5) * 120 - load * 60),
        );
        state.pitch = +(Math.sin(state.uptime / 7) * 2.5).toFixed(2);
        state.roll = +(Math.cos(state.uptime / 9) * 1.8).toFixed(2);

        send({
          t: 'telemetry',
          battery: +state.battery.toFixed(1),
          rssi: state.rssi,
          uptime: state.uptime,
          distanceMm: state.distanceMm,
          pitch: state.pitch,
          roll: state.roll,
          emotion: state.emotion,
          heading: state.heading,
        });

        // Obstacle warning, so the log pane has something to show.
        if (state.distanceMm < 120) {
          send({ t: 'log', level: 'warn', msg: `Vật cản phía trước ${state.distanceMm} mm — dừng` });
          state.leftSpeed = 0;
          state.rightSpeed = 0;
        }
      }, 1000),
    );

    timers.push(
      setInterval(() => {
        send({ t: 'log', level: 'debug', msg: `heap free 214 KB · psram free 7.8 MB` });
      }, 15_000),
    );
  });

  ws.on('message', (raw, isBinary) => {
    if (isBinary) {
      // A real board would push this into the I2S DMA buffer.
      log(`🔊 nhận ${raw.length} byte audio`);
      return;
    }
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (msg.t) {
      case 'welcome':
        log(`Server chào: deviceId=${msg.deviceId}`);
        break;

      case 'ping':
        send({ t: 'pong' });
        break;

      case 'cmd':
        handleCommand(msg);
        break;

      case 'say_start':
        log(`🗣️  bắt đầu phát (${msg.mime}, ${msg.bytes} byte)`);
        break;

      case 'say_end':
        log('🗣️  phát xong');
        break;

      case 'transcript':
        log(`💬 ${msg.role === 'bot' ? 'Robot' : 'Người'}: ${msg.text}`);
        break;

      case 'error':
        log(`⚠️  server báo lỗi [${msg.scope}]: ${msg.msg}`);
        break;

      default:
        break;
    }
  });

  ws.on('close', (code, reason) => {
    log(`❌ Mất kết nối (${code}${reason?.length ? ` ${reason}` : ''})`);
    timers.forEach(clearInterval);
    timers = [];
    if (code === 4401) {
      console.error('\nSai key hoặc secret. Đăng ký lại thiết bị và chép đúng chuỗi hiện ra.\n');
      process.exit(1);
    }
    // Exponential backoff with jitter: without the jitter every robot
    // on the network reconnects in lockstep after a router reboot.
    const wait = Math.min(backoff, 30_000) + Math.random() * 500;
    log(`Thử lại sau ${(wait / 1000).toFixed(1)}s`);
    setTimeout(connect, wait);
    backoff *= 2;
  });

  ws.on('error', (err) => {
    log(`Lỗi socket: ${err.message}`);
  });
}

/** Execute a command the way the firmware would, then acknowledge. */
function handleCommand(msg) {
  const p = msg.payload ?? {};
  let ok = true;
  let detail = '';

  switch (msg.type) {
    case 'move':
      state.leftSpeed = p.left ?? 0;
      state.rightSpeed = p.right ?? 0;
      detail = `L=${state.leftSpeed} R=${state.rightSpeed} trong ${p.ms ?? 0}ms`;
      // Motors must coast to a stop on their own — the server is not
      // allowed to be the thing that stops the robot.
      setTimeout(() => {
        state.leftSpeed = 0;
        state.rightSpeed = 0;
      }, p.ms ?? 500);
      break;

    case 'stop':
      state.leftSpeed = 0;
      state.rightSpeed = 0;
      detail = 'dừng cả hai bánh';
      break;

    case 'turn':
      state.heading = (state.heading + (p.deg ?? 0) + 360) % 360;
      detail = `xoay ${p.deg}° → hướng ${state.heading}°`;
      break;

    case 'face':
      state.emotion = p.emotion ?? 'neutral';
      detail = `mắt: ${state.emotion}`;
      break;

    case 'look':
      detail = `nhìn (${p.x}, ${p.y})`;
      break;

    case 'led':
      detail = `đèn rgb(${p.r},${p.g},${p.b}) ${p.effect}`;
      break;

    case 'head':
      detail = `cổ pan=${p.pan}° tilt=${p.tilt}°`;
      break;

    case 'arm': {
      // Mirror the firmware's mechanical clamp so the simulator refuses
      // exactly what the real robot would refuse.
      const elbow = Math.max(-120, Math.min(0, p.elbow ?? 0));
      const shoulder = Math.max(-90, Math.min(90, p.shoulder ?? 0));
      state.arms = state.arms ?? {};
      const sides = p.side === 'both' ? ['left', 'right'] : [p.side ?? 'left'];
      for (const s of sides) state.arms[s] = { shoulder, elbow };
      detail = `tay ${sides.join('+')} vai=${shoulder}° khuỷu=${elbow}°`;
      if ((p.elbow ?? 0) > 0) detail += ' (đã chặn: khuỷu chỉ gập một chiều)';
      break;
    }

    case 'dance':
      detail = `nhảy "${p.name}"`;
      break;

    case 'reboot':
      detail = 'khởi động lại';
      send({ t: 'ack', id: msg.id, ok: true });
      send({ t: 'log', level: 'warn', msg: 'Đang khởi động lại…' });
      setTimeout(() => ws?.close(1000, 'reboot'), 300);
      return;

    default:
      ok = false;
      detail = `không hiểu lệnh "${msg.type}"`;
  }

  log(`🤖 lệnh ${msg.type}: ${detail}`);
  send({ t: 'log', level: ok ? 'info' : 'error', msg: `${msg.type} — ${detail}` });
  send({ t: 'ack', id: msg.id, ok, error: ok ? undefined : detail });
}

process.on('SIGINT', () => {
  log('Tắt robot giả lập');
  timers.forEach(clearInterval);
  try {
    ws?.close(1000, 'bye');
  } catch {
    /* ignore */
  }
  process.exit(0);
});

connect();

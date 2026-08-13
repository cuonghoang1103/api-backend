/**
 * ============================================================
 * Maker Lab — REST API
 * ============================================================
 *
 * Public (no auth):
 *   GET  /projects                       list, filter by platform/status
 *   GET  /projects/:slug                 full project + BOM + firmware
 *   GET  /meta                           enums + command catalogue for the UI
 *   GET  /firmware/:slug/latest          OTA manifest the board polls
 *
 * Authenticated (device owner):
 *   GET    /devices                      my boards
 *   POST   /devices                      register → secret shown ONCE
 *   GET    /devices/:id                  one board
 *   PATCH  /devices/:id                  rename
 *   DELETE /devices/:id
 *   POST   /devices/:id/rotate-secret
 *   POST   /devices/:id/commands         { type, payload }
 *   GET    /devices/:id/commands
 *   GET    /devices/:id/telemetry?hours=
 *   GET    /devices/:id/logs
 *   POST   /devices/:id/say              { text }  speak a line
 *   POST   /devices/:id/chat             { text }  full think+speak turn
 *   PATCH  /projects/:slug/components/:id/acquired   shopping checklist
 *
 * Admin (/api/v1/admin/maker-lab):
 *   full CRUD over projects, components, persona, firmware.
 */

import { Router, type Request, type Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import type { ApiResponse } from '../types/index.js';
import { prisma } from '../config/database.js';
import * as svc from '../services/makerlab/makerLab.service.js';
import { COMMAND_CATALOG, COMMAND_TYPES } from '../services/makerlab/commands.js';
import { cloneVoiceHowTo } from '../services/makerlab/tts.js';
import { luuNao } from '../services/makerlab/voiceLoop.js';
import { laNao, NHAN_NAO } from '../services/makerlab/nao.js';
import multer from 'multer';
import { createHash } from 'crypto';
import { uploadGeneric } from '../storage/uploadService.js';
import { logger } from '../utils/logger.js';

/**
 * Bản build firmware tải lên.
 *
 * 8 MB: bản hiện tại 975 KB, và khe app trên bo là 6,55 MB — nên trần
 * này rộng hơn cả thứ bo nạp nổi. Đặt cao hơn nữa cũng vô nghĩa: bo sẽ
 * từ chối trước khi ghi.
 *
 * Giữ trong bộ nhớ chứ không ghi tạm ra đĩa: file đi thẳng lên R2 rồi
 * bỏ, mà đĩa VPS đang là thứ eo hẹp nhất.
 */
const firmwareUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.bin')) cb(null, true);
    else cb(new Error('Chỉ nhận file .bin'));
  },
});

const router = Router();
const adminRouter = Router();

function toId(req: Request, key = 'id'): number {
  const id = Number(req.params[key]);
  if (!Number.isInteger(id) || id <= 0)
    throw Object.assign(new Error('id không hợp lệ'), { statusCode: 400 });
  return id;
}

function userId(req: Request): number {
  const id = req.userId;
  if (!id) throw Object.assign(new Error('Chưa đăng nhập'), { statusCode: 401 });
  return id;
}

// ════════════════════════════════════════════════════════════
// Public
// ════════════════════════════════════════════════════════════

router.get('/projects', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await svc.listProjects({
      platform: typeof req.query.platform === 'string' ? req.query.platform : undefined,
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

/** Enum values + command catalogue, so the frontend never hardcodes them. */
router.get('/meta', (_req, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    data: {
      platforms: [
        { value: 'ESP32', label: 'ESP32' },
        { value: 'ESP32_S3', label: 'ESP32-S3' },
        { value: 'ESP8266', label: 'ESP8266' },
        { value: 'RP2040', label: 'RP2040 / Pico' },
        { value: 'STM32', label: 'STM32' },
        { value: 'ARDUINO', label: 'Arduino' },
        { value: 'RASPBERRY_PI', label: 'Raspberry Pi' },
        { value: 'JETSON', label: 'Jetson' },
        { value: 'OTHER', label: 'Khác' },
      ],
      statuses: [
        { value: 'PLANNING', label: 'Lên ý tưởng' },
        { value: 'SOURCING', label: 'Đang gom linh kiện' },
        { value: 'BUILDING', label: 'Đang lắp' },
        { value: 'TESTING', label: 'Đang chỉnh' },
        { value: 'LIVE', label: 'Đang chạy' },
        { value: 'ARCHIVED', label: 'Cất kho' },
      ],
      categories: [
        { value: 'MCU', label: 'Não / vi điều khiển' },
        { value: 'AUDIO_IN', label: 'Nghe' },
        { value: 'AUDIO_OUT', label: 'Nói' },
        { value: 'DISPLAY', label: 'Hiển thị' },
        { value: 'MOTION', label: 'Chuyển động' },
        { value: 'DRIVER', label: 'Mạch điều khiển' },
        { value: 'SENSOR', label: 'Cảm biến' },
        { value: 'POWER', label: 'Nguồn' },
        { value: 'MECHANICAL', label: 'Cơ khí' },
        { value: 'CONNECTIVITY', label: 'Kết nối' },
        { value: 'TOOL', label: 'Dụng cụ' },
        { value: 'MISC', label: 'Khác' },
      ],
      commands: COMMAND_CATALOG,
      commandTypes: COMMAND_TYPES,
      voiceCloning: cloneVoiceHowTo,
      wsPath: '/device-ws',
    },
  });
});

router.get('/projects/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await svc.getProjectBySlug(String(req.params.slug));
    if (!data) {
      res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
      return;
    }
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

/**
 * OTA manifest. Unauthenticated on purpose: the payload is only a
 * version string and a URL, and making a booting ESP32 do a signed
 * request before it can even update itself is how bricked devices
 * happen. The binary itself sits behind the R2 signed URL.
 */
router.get('/firmware/:slug/latest', async (req, res: Response<ApiResponse>, next) => {
  try {
    const fw = await svc.getLatestFirmware(String(req.params.slug));
    if (!fw) {
      res.status(404).json({ success: false, message: 'Chưa có firmware nào' });
      return;
    }
    res.json({
      success: true,
      data: {
        version: fw.version,
        sha256: fw.sha256,
        sizeBytes: fw.sizeBytes,
        url: `${process.env.R2_PUBLIC_URL ?? ''}/${fw.r2Key}`,
        releaseNotes: fw.releaseNotes,
      },
    });
  } catch (e) {
    next(e);
  }
});

// ════════════════════════════════════════════════════════════
// Authenticated — devices
// ════════════════════════════════════════════════════════════

router.get('/devices', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.listDevices(userId(req)) });
  } catch (e) {
    next(e);
  }
});

router.post('/devices', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const { projectId, name } = req.body ?? {};
    if (!Number.isInteger(projectId) || !name) {
      res.status(400).json({ success: false, message: 'Cần projectId và name' });
      return;
    }
    const out = await svc.registerDevice({
      ownerId: userId(req),
      projectId,
      name: String(name),
    });
    res.status(201).json({
      success: true,
      data: out,
      // The plaintext secret is never retrievable again — say so loudly.
      message: 'Lưu secret ngay bây giờ. Nó sẽ KHÔNG hiện lại lần nữa.',
    });
  } catch (e) {
    next(e);
  }
});

router.get('/devices/:id', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getDevice(toId(req), userId(req)) });
  } catch (e) {
    next(e);
  }
});

router.patch('/devices/:id', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const name = String(req.body?.name ?? '').trim();
    if (!name) {
      res.status(400).json({ success: false, message: 'Cần name' });
      return;
    }
    res.json({ success: true, data: await svc.renameDevice(toId(req), userId(req), name) });
  } catch (e) {
    next(e);
  }
});

router.delete('/devices/:id', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    await svc.deleteDevice(toId(req), userId(req));
    res.json({ success: true, message: 'Đã xoá thiết bị' });
  } catch (e) {
    next(e);
  }
});

router.post(
  '/devices/:id/rotate-secret',
  authenticate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      const out = await svc.rotateDeviceSecret(toId(req), userId(req));
      res.json({
        success: true,
        data: out,
        message: 'Secret cũ đã vô hiệu. Nạp secret mới vào firmware.',
      });
    } catch (e) {
      next(e);
    }
  },
);

router.post('/devices/:id/commands', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const { type, payload } = req.body ?? {};
    const out = await svc.sendCommand({
      deviceId: toId(req),
      ownerId: userId(req),
      type: String(type ?? ''),
      payload,
    });
    res.json({
      success: true,
      data: out,
      message: out.delivered ? 'Đã gửi tới thiết bị' : 'Thiết bị offline — lệnh đã xếp hàng chờ',
    });
  } catch (e) {
    next(e);
  }
});

router.get('/devices/:id/commands', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.listCommands(toId(req), userId(req)) });
  } catch (e) {
    next(e);
  }
});

router.get('/devices/:id/telemetry', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await svc.getTelemetry(toId(req), userId(req), {
      hours: Number(req.query.hours) || undefined,
      limit: Number(req.query.limit) || undefined,
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

router.get('/devices/:id/logs', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getDeviceLogs(toId(req), userId(req)) });
  } catch (e) {
    next(e);
  }
});

/** Speak a line verbatim — no LLM in the path. */
router.post('/devices/:id/say', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const deviceId = toId(req);
    const text = String(req.body?.text ?? '').trim();
    if (!text) {
      res.status(400).json({ success: false, message: 'Cần text' });
      return;
    }
    const device = await svc.getDevice(deviceId, userId(req));
    if (!device.connected) {
      res.status(409).json({ success: false, message: 'Thiết bị đang offline' });
      return;
    }

    const persona = await prisma.makerPersona.findUnique({
      where: { projectId: device.projectId },
    });
    const { synthesizeSpeech } = await import('../services/makerlab/tts.js');
    const { speakOnDevice } = await import('../socket/device.gateway.js');
    const tts = await synthesizeSpeech(text.slice(0, 500), {
      provider: (persona?.voiceProvider as never) ?? undefined,
      voice: persona?.voiceId ?? undefined,
      language: persona?.language ?? 'vi-VN',
    });
    const ok = await speakOnDevice(deviceId, tts.audio, { mime: tts.mime, text });
    res.json({ success: ok, data: { provider: tts.provider, bytes: tts.audio.length } });
  } catch (e) {
    next(e);
  }
});

/** Full turn from the web console: think in persona, then speak. */
router.post('/devices/:id/chat', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const deviceId = toId(req);
    const text = String(req.body?.text ?? '').trim();
    if (!text) {
      res.status(400).json({ success: false, message: 'Cần text' });
      return;
    }
    const device = await svc.getDevice(deviceId, userId(req));
    const { runVoiceTurn } = await import('../services/makerlab/voiceLoop.js');
    const out = await runVoiceTurn({
      deviceId,
      projectId: device.projectId,
      text: text.slice(0, 1000),
      // Only push audio to the speaker when the board is actually there.
      speak: device.connected && req.body?.speak !== false,
    });
    res.json({ success: true, data: out });
  } catch (e) {
    next(e);
  }
});

/** Shopping checklist: tick a BOM line once you've bought it. */
router.patch(
  '/components/:id/acquired',
  authenticate,
  async (req, res: Response<ApiResponse>, next) => {
    try {
      const acquired = req.body?.acquired !== false;
      const data = await prisma.makerComponent.update({
        where: { id: toId(req) },
        data: { acquired },
      });
      res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  },
);

// ════════════════════════════════════════════════════════════
// Admin
// ════════════════════════════════════════════════════════════

adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/projects', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.listProjects({ includeUnpublished: true }) });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/projects', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await prisma.makerProject.create({ data: req.body });
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

adminRouter.put('/projects/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await prisma.makerProject.update({ where: { id: toId(req) }, data: req.body });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

adminRouter.delete('/projects/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    await prisma.makerProject.delete({ where: { id: toId(req) } });
    res.json({ success: true, message: 'Đã xoá' });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/projects/:id/components', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await prisma.makerComponent.create({
      data: { ...req.body, projectId: toId(req) },
    });
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

adminRouter.put('/components/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await prisma.makerComponent.update({ where: { id: toId(req) }, data: req.body });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

adminRouter.delete('/components/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    await prisma.makerComponent.delete({ where: { id: toId(req) } });
    res.json({ success: true, message: 'Đã xoá' });
  } catch (e) {
    next(e);
  }
});

// ─── Huấn luyện: robot học cách nói của bạn ────────────────

/** Ngân hàng câu hỏi + những gì robot đã học được. */
router.get('/projects/:id/training', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const t = await import('../services/makerlab/training.js');
    const projectId = toId(req);
    const [knowledge, progress] = await Promise.all([
      t.getKnowledge(projectId),
      t.progress(projectId),
    ]);
    res.json({ success: true, data: { questions: t.QUESTION_BANK, knowledge, progress } });
  } catch (e) {
    next(e);
  }
});

/** Lưu một câu trả lời. Trả lời rỗng = xoá mục đó. */
router.post('/projects/:id/training', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const { question, answer } = req.body ?? {};
    if (!question) {
      res.status(400).json({ success: false, message: 'Cần question' });
      return;
    }
    const t = await import('../services/makerlab/training.js');
    const knowledge = await t.saveAnswer(toId(req), String(question), String(answer ?? ''));
    res.json({ success: true, data: { knowledge } });
  } catch (e) {
    next(e);
  }
});

adminRouter.put('/projects/:id/persona', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.upsertPersona(toId(req), req.body ?? {}) });
  } catch (e) {
    next(e);
  }
});

/**
 * Đổi NÃO cho robot: máy nhà hay cổng.
 *
 * Route riêng chứ không nhét vào `PUT persona`, vì `upsertPersona` ghi đè cả
 * `traits` — mà `traits` còn giữ kiến thức huấn luyện, chế độ tiếng và tốc độ
 * đọc. `luuNao` đọc-sửa-ghi nên chỉ đụng đúng một khoá.
 *
 * `nao: null` = bỏ ghim, quay về theo `LLM_LOCAL_PURPOSES` của máy chủ.
 * Cả hai não LUÔN còn đó — đây chỉ là chọn dùng cái nào, không phải gỡ bỏ.
 */
adminRouter.put('/projects/:id/nao', async (req, res: Response<ApiResponse>, next) => {
  try {
    const raw: unknown = req.body?.nao ?? null;
    if (raw !== null && !laNao(raw)) {
      res.status(400).json({ success: false, message: "nao phải là 'may-nha', 'cong', hoặc null" });
      return;
    }
    const projectId = toId(req);
    await luuNao(projectId, raw);
    res.json({
      success: true,
      data: { nao: raw, nhan: raw ? NHAN_NAO[raw] : 'theo cấu hình máy chủ' },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * Xuất bản một bản build: nhận .bin → đẩy R2 → ghi bản ghi → xong.
 *
 * Vì sao là MỘT route làm cả ba việc, thay vì để script tự đẩy R2 rồi
 * gọi route cũ: **khoá R2 nằm trên VPS, không có trên máy lập trình**.
 * Bắt script tự đẩy nghĩa là phải phát tán khoá bucket ra máy cá nhân —
 * đổi lấy đúng một chút tiện, mà mất hẳn một lớp bảo vệ.
 *
 * Và SHA-256 **tính ở server trên đúng byte vừa nhận**, không lấy theo
 * lời client khai. Băm là thứ bo dùng để quyết định có nạp hay không;
 * tin theo lời người gửi thì cái băm đó chẳng bảo vệ được gì — nó chỉ
 * chứng minh "file khớp với thứ người gửi NÓI", chứ không chứng minh
 * "file nguyên vẹn".
 */
adminRouter.post(
  '/projects/:id/firmware/upload',
  firmwareUpload.single('file'),
  async (req: Request, res: Response<ApiResponse>, next) => {
    try {
      const file = (req as unknown as { file?: { buffer: Buffer; originalname?: string; size: number } }).file;
      const version = String(req.body?.version ?? '').trim().slice(0, 40);
      const releaseNotes = req.body?.releaseNotes ? String(req.body.releaseNotes).slice(0, 2000) : undefined;

      if (!file?.buffer?.length) {
        res.status(400).json({ success: false, message: 'Chưa chọn file .bin' });
        return;
      }
      if (!version) {
        res.status(400).json({ success: false, message: 'Thiếu version' });
        return;
      }

      const sha256 = createHash('sha256').update(file.buffer).digest('hex');

      const stored = await uploadGeneric(
        {
          buffer: file.buffer,
          originalName: `${version}.bin`,
          mimetype: 'application/octet-stream',
          size: file.size,
        },
        'firmware',
        { subPrefix: String(req.params.id), optimize: false },
      );

      const data = await svc.publishFirmware({
        projectId: toId(req),
        version,
        r2Key: stored.key,
        sha256,
        sizeBytes: file.size,
        releaseNotes,
      });

      logger.info('MakerLab xuất bản firmware', {
        projectId: toId(req),
        version,
        kb: Math.round(file.size / 1024),
        sha256: sha256.slice(0, 12),
      });
      res.status(201).json({ success: true, data: { ...data, sha256, url: stored.url } });
    } catch (e) {
      next(e);
    }
  },
);

adminRouter.post('/projects/:id/firmware', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { version, r2Key, sha256, sizeBytes, releaseNotes } = req.body ?? {};
    if (!version || !r2Key || !sha256 || !Number.isInteger(sizeBytes)) {
      res
        .status(400)
        .json({ success: false, message: 'Cần version, r2Key, sha256, sizeBytes' });
      return;
    }
    const data = await svc.publishFirmware({
      projectId: toId(req),
      version: String(version),
      r2Key: String(r2Key),
      sha256: String(sha256),
      sizeBytes,
      releaseNotes: releaseNotes ? String(releaseNotes) : undefined,
    });
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

/** Manual housekeeping trigger — the cron calls the same functions. */
adminRouter.post('/maintenance', async (req, res: Response<ApiResponse>, next) => {
  try {
    const days = Number(req.body?.days) || 30;
    const [telemetry, devices, commands] = await Promise.all([
      svc.pruneTelemetry(days),
      svc.reconcileStaleDevices(),
      svc.expireStaleCommands(),
    ]);
    res.json({
      success: true,
      data: { telemetryDeleted: telemetry, devicesMarkedOffline: devices, commandsExpired: commands },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * Số liệu hai máy: VPS và máy GPU ở nhà.
 *
 * Gộp một lời gọi thay vì hai: trang hiện cả hai cạnh nhau, và hai lời
 * gọi rời thì lúc máy nhà chậm sẽ khiến VPS cũng hiện chậm theo.
 * `Promise.all` cho phép máy nhà tự chịu trách nhiệm phần của nó — nó
 * tắt thì trả `online: false`, KHÔNG kéo cả trang xuống.
 */
adminRouter.get('/ha-tang', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const { soLieuVps, soLieuMayNha } = await import('../services/makerlab/haTang.js');
    const [vps, nha] = await Promise.all([soLieuVps(), soLieuMayNha()]);
    res.json({ success: true, data: { vps, nha, luc: Date.now() } });
  } catch (e) {
    next(e);
  }
});

/**
 * Cầu nối điều khiển máy nhà.
 *
 * ⚠️ Đây là đường từ trang admin vào MÁY CÁ NHÂN của người dùng, nên nó
 * chỉ chuyển tiếp — mọi luật nằm ở phía máy nhà (`dieukhien.py`): danh
 * sách trắng, không nhận lệnh tự do, mặc định TẮT khi thiếu khoá.
 *
 * Đặt luật ở đó chứ không ở đây là có chủ ý: máy nhà là bên chịu hậu quả,
 * nên nó phải tự bảo vệ được kể cả khi VPS bị chiếm. Kiểm ở VPS rồi tin
 * tưởng là mô hình sai — kẻ chiếm được VPS sẽ bỏ qua đúng chỗ kiểm đó.
 */
async function goiMayNha(
  duong: string,
  init?: RequestInit,
): Promise<{ ma: number; du: unknown }> {
  const goc = (process.env.TTS_SERVICE_URL || 'http://tts:8080').replace(/\/+$/, '');
  const khoa = process.env.MAY_NHA_TOKEN || '';
  if (!khoa) {
    return {
      ma: 503,
      du: {
        message:
          'Chưa bật điều khiển. Cần đặt MAY_NHA_TOKEN giống nhau ở CẢ HAI nơi: ' +
          '/opt/cuonghoangdev/.env trên VPS và unit tts-vieneu trên máy nhà.',
      },
    };
  }
  const r = await fetch(`${goc}${duong}`, {
    ...init,
    // Khoá đi trong HEADER. URL bị ghi vào log truy cập, log proxy và
    // lịch sử trình duyệt — khoá nằm trong đó là khoá đã lộ.
    headers: { ...(init?.headers ?? {}), 'X-Token': khoa },
    signal: AbortSignal.timeout(30_000),
  });
  return { ma: r.status, du: await r.json().catch(() => ({})) };
}

adminRouter.get('/ha-tang/lich-su', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const goc = (process.env.TTS_SERVICE_URL || 'http://tts:8080').replace(/\/+$/, '');
    const r = await fetch(`${goc}/may/lich-su`, { signal: AbortSignal.timeout(10_000) });
    res.json({ success: true, data: await r.json() });
  } catch {
    res.json({ success: true, data: { diem: [] } });
  }
});

adminRouter.get('/ha-tang/dk/menu', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const { ma, du } = await goiMayNha('/dk/menu');
    res.status(ma === 200 ? 200 : ma).json({ success: ma === 200, data: du, message: (du as { message?: string; detail?: string })?.message ?? (du as { detail?: string })?.detail });
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/ha-tang/dk/xem/:ten', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { ma, du } = await goiMayNha(`/dk/xem/${encodeURIComponent(String(req.params.ten))}`);
    res.status(ma === 200 ? 200 : ma).json({ success: ma === 200, data: du, message: (du as { detail?: string })?.detail });
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/ha-tang/dk/log/:ten', async (req, res: Response<ApiResponse>, next) => {
  try {
    const n = Math.max(20, Math.min(1000, Number(req.query.dong) || 200));
    const { ma, du } = await goiMayNha(`/dk/log/${encodeURIComponent(String(req.params.ten))}?dong=${n}`);
    res.status(ma === 200 ? 200 : ma).json({ success: ma === 200, data: du, message: (du as { detail?: string })?.detail });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/ha-tang/dk/restart/:ten', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { ma, du } = await goiMayNha(`/dk/restart/${encodeURIComponent(String(req.params.ten))}`, {
      method: 'POST',
    });
    logger.warn('Admin khởi động lại dịch vụ máy nhà', { ten: req.params.ten, ma });
    res.status(ma === 200 ? 200 : ma).json({ success: ma === 200, data: du, message: (du as { detail?: string })?.detail });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/ha-tang/dk/reboot', async (req, res: Response<ApiResponse>, next) => {
  try {
    const xn = encodeURIComponent(String(req.body?.xacNhan ?? ''));
    const { ma, du } = await goiMayNha(`/dk/reboot?xac_nhan=${xn}`, { method: 'POST' });
    logger.warn('Admin KHỞI ĐỘNG LẠI máy nhà', { ma });
    res.status(ma === 200 ? 200 : ma).json({ success: ma === 200, data: du, message: (du as { detail?: string })?.detail });
  } catch (e) {
    next(e);
  }
});

export { adminRouter };
export default router;

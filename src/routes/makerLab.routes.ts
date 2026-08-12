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
 * Khởi động lại một dịch vụ trên máy nhà.
 *
 * CỐ Ý chỉ cho phép ba dịch vụ đã biết tên, không nhận tên tuỳ ý từ
 * client. Nhận tên tự do nghĩa là mở một đường chạy lệnh trên máy CÁ
 * NHÂN của người dùng qua web — không đáng đổi lấy chút tiện.
 *
 * ⚠️ CHƯA nối. Đường hầm hiện chỉ chở cổng HTTP của dịch vụ TTS và khoá
 * của nó đặt `command="/bin/false"`, nên từ VPS KHÔNG chạy được lệnh
 * trên máy nhà. Muốn có nút này thật thì phải thêm một endpoint có xác
 * thực ở phía máy nhà — việc riêng, làm sau, và phải bàn kỹ vì nó mở
 * đường điều khiển vào máy cá nhân.
 */
adminRouter.post('/ha-tang/dich-vu/:ten/restart', async (req, res: Response<ApiResponse>) => {
  res.status(501).json({
    success: false,
    message:
      'Chưa nối. Đường hầm chỉ chở cổng HTTP và khoá đặt command="/bin/false" — ' +
      'từ VPS không chạy được lệnh trên máy nhà. Cần thêm endpoint có xác thực ở máy nhà.',
  });
});

export { adminRouter };
export default router;

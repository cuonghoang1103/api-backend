/**
 * ============================================================
 * Maker Lab — data service
 * ============================================================
 *
 * Everything the REST layer needs: projects with their bill of
 * materials, device registration, command queueing, telemetry
 * queries, firmware records.
 */

import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import {
  MakerCommandStatus,
  MakerDeviceStatus,
  type MakerPlatform,
  type MakerProjectStatus,
  type Prisma,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { validateCommand } from './commands.js';

// ─── Projects ──────────────────────────────────────────────

export async function listProjects(opts: {
  platform?: string;
  status?: string;
  includeUnpublished?: boolean;
} = {}) {
  const where: Prisma.MakerProjectWhereInput = {};
  if (!opts.includeUnpublished) where.published = true;
  if (opts.platform) where.platform = opts.platform as MakerPlatform;
  if (opts.status) where.status = opts.status as MakerProjectStatus;

  const projects = await prisma.makerProject.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { id: 'asc' }],
    include: {
      _count: { select: { components: true, devices: true } },
    },
  });

  // The hub cards show "18/30 linh kiện đã mua" — one grouped query
  // beats N per-project counts.
  const acquired = await prisma.makerComponent.groupBy({
    by: ['projectId'],
    where: { acquired: true },
    _count: { _all: true },
  });
  const acquiredMap = new Map(acquired.map((a) => [a.projectId, a._count._all]));

  return projects.map((p) => ({
    ...p,
    componentCount: p._count.components,
    deviceCount: p._count.devices,
    acquiredCount: acquiredMap.get(p.id) ?? 0,
  }));
}

export async function getProjectBySlug(slug: string, opts: { includeUnpublished?: boolean } = {}) {
  const project = await prisma.makerProject.findUnique({
    where: { slug },
    include: {
      components: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] },
      persona: true,
      firmwares: { orderBy: { createdAt: 'desc' }, take: 10 },
      _count: { select: { devices: true } },
    },
  });
  if (!project) return null;
  if (!project.published && !opts.includeUnpublished) return null;

  const totalCostVnd = project.components.reduce(
    (sum, c) => sum + (c.unitPriceVnd ?? 0) * c.qty,
    0,
  );
  const acquiredCostVnd = project.components.reduce(
    (sum, c) => (c.acquired ? sum + (c.unitPriceVnd ?? 0) * c.qty : sum),
    0,
  );

  return {
    ...project,
    deviceCount: project._count.devices,
    totalCostVnd,
    acquiredCostVnd,
    acquiredCount: project.components.filter((c) => c.acquired).length,
  };
}

// ─── Devices ───────────────────────────────────────────────

/** `mk_` + 24 hex chars. Public — it travels in the WebSocket URL. */
function newDeviceKey(): string {
  return `mk_${randomBytes(12).toString('hex')}`;
}

/**
 * Register a physical board. The plaintext secret is returned exactly
 * once and never stored — same contract as any API token. Losing it
 * means re-rolling, not recovering.
 */
export async function registerDevice(params: {
  ownerId: number;
  projectId: number;
  name: string;
}) {
  const project = await prisma.makerProject.findUnique({
    where: { id: params.projectId },
    select: { id: true },
  });
  if (!project) throw Object.assign(new Error('Dự án không tồn tại'), { statusCode: 404 });

  const deviceKey = newDeviceKey();
  const secret = randomBytes(24).toString('base64url');
  const secretHash = await bcrypt.hash(secret, 10);

  const device = await prisma.makerDevice.create({
    data: {
      ownerId: params.ownerId,
      projectId: params.projectId,
      name: params.name.slice(0, 120),
      deviceKey,
      secretHash,
    },
  });

  return { device: stripSecret(device), credentials: { deviceKey, secret } };
}

/** Re-roll credentials for a board (lost secret, or suspected leak). */
export async function rotateDeviceSecret(deviceId: number, ownerId: number) {
  await assertDeviceOwner(deviceId, ownerId);
  const secret = randomBytes(24).toString('base64url');
  const secretHash = await bcrypt.hash(secret, 10);
  const device = await prisma.makerDevice.update({
    where: { id: deviceId },
    data: { secretHash },
  });
  return { device: stripSecret(device), credentials: { deviceKey: device.deviceKey, secret } };
}

function stripSecret<T extends { secretHash?: string }>(d: T): Omit<T, 'secretHash'> {
  const { secretHash: _drop, ...rest } = d;
  return rest;
}

export async function listDevices(ownerId: number) {
  const devices = await prisma.makerDevice.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    include: { project: { select: { slug: true, name: true, platform: true } } },
  });
  const { isDeviceOnline } = await import('../../socket/device.gateway.js');
  return devices.map((d) => ({ ...stripSecret(d), connected: isDeviceOnline(d.id) }));
}

export async function getDevice(deviceId: number, ownerId: number) {
  const device = await assertDeviceOwner(deviceId, ownerId);
  const { isDeviceOnline } = await import('../../socket/device.gateway.js');
  return { ...stripSecret(device), connected: isDeviceOnline(device.id) };
}

/**
 * Phát vé cho trang mô phỏng nối vào cổng thiết bị.
 *
 * ⚠️ Trả kèm `dangOnline`. Cổng chỉ giữ MỘT kết nối cho mỗi thiết bị
 * (`acceptDevice` đóng cái cũ với mã 4409 "replaced by newer
 * connection"), nên mở mô phỏng trong lúc bo thật đang cắm điện sẽ ĐÁ
 * BO RA. Đó là hành vi đúng — một thiết bị, một socket — nhưng nếu
 * người dùng không được báo trước thì họ chỉ thấy robot thật im bặt mà
 * không hiểu vì sao. Giao diện dùng cờ này để hỏi trước khi nối.
 */
export async function capVeMoPhong(deviceId: number, ownerId: number) {
  const device = await assertDeviceOwner(deviceId, ownerId);
  const { isDeviceOnline } = await import('../../socket/device.gateway.js');
  const { phatVe } = await import('./simTicket.js');
  const ve = phatVe({
    deviceId: device.id,
    projectId: device.projectId,
    ownerId: device.ownerId,
    deviceKey: device.deviceKey,
  });
  return { ...ve, deviceId: device.id, dangOnline: isDeviceOnline(device.id) };
}

export async function deleteDevice(deviceId: number, ownerId: number): Promise<void> {
  await assertDeviceOwner(deviceId, ownerId);
  await prisma.makerDevice.delete({ where: { id: deviceId } });
}

export async function renameDevice(deviceId: number, ownerId: number, name: string) {
  await assertDeviceOwner(deviceId, ownerId);
  const d = await prisma.makerDevice.update({
    where: { id: deviceId },
    data: { name: name.slice(0, 120) },
  });
  return stripSecret(d);
}

async function assertDeviceOwner(deviceId: number, ownerId: number) {
  const device = await prisma.makerDevice.findUnique({ where: { id: deviceId } });
  if (!device) throw Object.assign(new Error('Thiết bị không tồn tại'), { statusCode: 404 });
  if (device.ownerId !== ownerId)
    throw Object.assign(new Error('Thiết bị này không phải của bạn'), { statusCode: 403 });
  return device;
}

// ─── Commands ──────────────────────────────────────────────

/**
 * Queue a command and push it immediately if the board is connected.
 * Offline devices keep the row PENDING; the gateway flushes the queue
 * on the next `hello`.
 */
export async function sendCommand(params: {
  deviceId: number;
  ownerId: number;
  type: string;
  payload?: unknown;
}) {
  await assertDeviceOwner(params.deviceId, params.ownerId);

  const validated = validateCommand(params.type, params.payload);
  if (!validated)
    throw Object.assign(new Error(`Lệnh không hợp lệ: ${params.type}`), { statusCode: 400 });

  const row = await prisma.makerCommand.create({
    data: {
      deviceId: params.deviceId,
      issuedById: params.ownerId,
      type: validated.type,
      payload: validated.payload as object,
    },
  });

  const { pushCommand } = await import('../../socket/device.gateway.js');
  const delivered = pushCommand(params.deviceId, {
    id: row.id,
    type: row.type,
    payload: row.payload,
  });

  return { ...row, delivered };
}

export async function listCommands(deviceId: number, ownerId: number, limit = 50) {
  await assertDeviceOwner(deviceId, ownerId);
  return prisma.makerCommand.findMany({
    where: { deviceId },
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 200),
  });
}

// ─── Telemetry & logs ──────────────────────────────────────

export async function getTelemetry(
  deviceId: number,
  ownerId: number,
  opts: { hours?: number; limit?: number } = {},
) {
  await assertDeviceOwner(deviceId, ownerId);
  const hours = Math.min(Math.max(opts.hours ?? 6, 1), 720);
  const since = new Date(Date.now() - hours * 3600_000);
  return prisma.makerTelemetry.findMany({
    where: { deviceId, recordedAt: { gte: since } },
    orderBy: { recordedAt: 'asc' },
    take: Math.min(opts.limit ?? 500, 2000),
  });
}

export async function getDeviceLogs(deviceId: number, ownerId: number, limit = 200) {
  await assertDeviceOwner(deviceId, ownerId);
  const rows = await prisma.makerDeviceLog.findMany({
    where: { deviceId },
    orderBy: { id: 'desc' },
    take: Math.min(limit, 1000),
  });
  return rows.reverse(); // oldest first reads like a serial monitor
}

/**
 * Housekeeping. Telemetry is the only table here that grows without
 * bound, and the VPS disk is already at 77%.
 */
export async function pruneTelemetry(days = 30): Promise<number> {
  const cutoff = new Date(Date.now() - days * 86_400_000);
  const res = await prisma.makerTelemetry.deleteMany({ where: { recordedAt: { lt: cutoff } } });
  return res.count;
}

/** Any device that hasn't checked in for 3 minutes is gone. */
export async function reconcileStaleDevices(): Promise<number> {
  const { getOnlineDeviceIds } = await import('../../socket/device.gateway.js');
  const online = getOnlineDeviceIds();
  const res = await prisma.makerDevice.updateMany({
    where: {
      status: { not: MakerDeviceStatus.OFFLINE },
      id: { notIn: online.length ? online : [-1] },
      OR: [{ lastSeenAt: { lt: new Date(Date.now() - 180_000) } }, { lastSeenAt: null }],
    },
    data: { status: MakerDeviceStatus.OFFLINE },
  });
  return res.count;
}

/** Commands nobody ever acknowledged shouldn't sit PENDING forever. */
export async function expireStaleCommands(): Promise<number> {
  const res = await prisma.makerCommand.updateMany({
    where: {
      status: { in: [MakerCommandStatus.PENDING, MakerCommandStatus.SENT] },
      createdAt: { lt: new Date(Date.now() - 3600_000) },
    },
    data: { status: MakerCommandStatus.EXPIRED },
  });
  return res.count;
}

// ─── Persona ───────────────────────────────────────────────

export async function upsertPersona(
  projectId: number,
  data: {
    name?: string;
    systemPrompt?: string;
    voiceProvider?: string;
    voiceId?: string | null;
    language?: string;
    traits?: unknown;
    sampleDialogues?: unknown;
    wakeWord?: string | null;
    temperature?: number;
    maxTokens?: number;
    /**
     * Tốc độ đọc 0,25–4,0. Cất trong `traits` nhưng nhận qua trường
     * RIÊNG, không cho client tự gửi cả cục `traits`.
     *
     * Vì `traits` được ghi đè nguyên khối ở dưới: một form chỉ quan tâm
     * tốc độ mà gửi `traits: {speechRate: 1.2}` sẽ xoá sạch
     * `traits.knowledge` — tức là bay toàn bộ phần Huấn luyện người
     * dùng đã ngồi gõ. Nhận riêng rồi tự hoà vào thì không có cách nào
     * mất dữ liệu.
     */
    speechRate?: number;
    cheDo?: string;
    amLuong?: number;
    /** Cổng đánh thức: chỉ trả lời khi được gọi tên (`wakeWord`). */
    congDanhThuc?: boolean;
    /** Gọi tên xong nghe tiếp bao nhiêu giây, 5–300. */
    giayThucGiac?: number;
    /** Giọng riêng cho từng chế độ tiếng: `{ vi, en, robot }`. Hoà vào, không đè. */
    giongTheoCheDo?: Record<string, string | null>;
    /** Não ghim: `'may-nha'` | `'cong'` | `null` = tự động theo cấu hình. */
    nao?: string | null;
    /** Nơi robot đứng, ví dụ "Hà Nội, Việt Nam". Dùng khi hỏi thời tiết. */
    viTri?: string | null;
    /** Kho bộ tính cách. Ghi ĐÈ cả kho — người dùng sửa trên web là gửi cả bộ. */
    boTinhCach?: unknown;
    /** Bộ đang bật. `null` = quay về bản gốc của persona. */
    tinhCachDangDung?: string | null;
  },
) {
  const { DEFAULT_PERSONA_PROMPT } = await import('./persona.js');

  // Hoà `speechRate` và `cheDo` vào traits đang có, giữ nguyên mọi khoá
  // khác — cột này còn chứa phần Huấn luyện, ghi đè nguyên khối là xoá sạch.
  const coRate = typeof data.speechRate === 'number' && Number.isFinite(data.speechRate);
  const { laCheDo } = await import('./cheDo.js');
  const coCheDo = laCheDo(data.cheDo);
  const coAmLuong = typeof data.amLuong === 'number' && Number.isFinite(data.amLuong);
  const { laNao } = await import('./nao.js');
  // `nao` có BA trạng thái, và `null` là một trạng thái THẬT ("tự động"),
  // không phải "không gửi". Chỉ `undefined` mới nghĩa là không đụng tới.
  const coNao = data.nao !== undefined && (data.nao === null || laNao(data.nao));
  const coGiong = !!data.giongTheoCheDo && typeof data.giongTheoCheDo === 'object';
  // Cờ boolean: `undefined` = không đụng, `false` = tắt thật. Kiểm bằng
  // `typeof === 'boolean'` chứ KHÔNG bằng truthiness — `if (data.congDanhThuc)`
  // thì lệnh TẮT (false) trông y hệt "không gửi", và nút tắt sẽ không
  // bao giờ có tác dụng.
  const coCong = typeof data.congDanhThuc === 'boolean';
  const coGiay = typeof data.giayThucGiac === 'number' && Number.isFinite(data.giayThucGiac);

  let traitsMerged = (data.traits ?? undefined) as Prisma.InputJsonValue | undefined;
  if (coRate || coCheDo || coAmLuong || coNao || coGiong || coCong || coGiay) {
    const cur = await prisma.makerPersona.findUnique({
      where: { projectId },
      select: { traits: true },
    });
    const base = ((data.traits ?? cur?.traits ?? {}) as Record<string, unknown>) ?? {};
    traitsMerged = {
      ...base,
      ...(coRate ? { speechRate: Math.max(0.25, Math.min(4, data.speechRate as number)) } : {}),
      ...(coCheDo ? { cheDo: data.cheDo } : {}),
      // Âm lượng lưu vào persona chứ không chỉ gửi xuống bo: bo mất điện
      // là quên sạch, mà người dùng đã chỉnh thì họ mong nó GIỮ NGUYÊN.
      ...(coAmLuong ? { amLuong: Math.max(10, Math.min(100, data.amLuong as number)) } : {}),
      ...(coCong ? { congDanhThuc: data.congDanhThuc } : {}),
      ...(coGiay
        ? { giayThucGiac: Math.max(5, Math.min(300, Math.round(data.giayThucGiac as number))) }
        : {}),
      // Kho tính cách: `undefined` = không đụng, giá trị = ghi đè cả kho.
      // Ghi đè cả kho là ĐÚNG ở đây — web gửi lên trạng thái sau khi sửa,
      // và hoà từng bộ một thì xoá một bộ sẽ không bao giờ có tác dụng.
      ...(data.viTri !== undefined
        ? { viTri: data.viTri ? String(data.viTri).slice(0, 120) : null }
        : {}),
      ...(data.boTinhCach !== undefined
        ? { boTinhCach: (await import('./tinhCach.js')).chuanKhoTinhCach(data.boTinhCach) ?? {} }
        : {}),
      ...(data.tinhCachDangDung !== undefined
        ? { tinhCachDangDung: data.tinhCachDangDung ? String(data.tinhCachDangDung).slice(0, 40) : null }
        : {}),
      ...(coNao ? { nao: data.nao } : {}),
      // Hoà từng CHẾ ĐỘ một, không thay cả bảng: web có thể chỉ gửi
      // giọng của chế độ đang sửa, và ghi đè cả bảng là xoá hai chế độ
      // kia — đúng cái lỗi "đổi qua đổi lại là mất giọng" đang chữa.
      ...(coGiong
        ? {
            giongTheoCheDo: (() => {
              const cu = ((base.giongTheoCheDo ?? {}) as Record<string, unknown>) || {};
              const moi: Record<string, string> = {};
              for (const [k, v] of Object.entries(cu)) {
                if (laCheDo(k) && typeof v === 'string' && v) moi[k] = v;
              }
              for (const [k, v] of Object.entries(data.giongTheoCheDo as Record<string, string | null>)) {
                if (!laCheDo(k)) continue;
                // `null` = XOÁ giọng riêng của chế độ đó, quay về mặc định.
                if (v === null) delete moi[k];
                else if (typeof v === 'string' && v.trim()) moi[k] = v.trim().slice(0, 120);
              }
              return moi;
            })(),
          }
        : {}),
    } as Prisma.InputJsonValue;
  }
  const clean = {
    name: data.name?.slice(0, 80),
    systemPrompt: data.systemPrompt?.slice(0, 8000),
    voiceProvider: data.voiceProvider?.slice(0, 24),
    // ⚠️ KHÔNG cho `voiceId` RỖNG đè lên giọng đang dùng.
    //
    // 13/08/2026: `voice_id` của robot bị xoá trắng, và hậu quả nhìn
    // không giống nguyên nhân chút nào — máy đọc không biết đọc bằng
    // giọng nào ⇒ hỏng ⇒ cả chuỗi tụt xuống giọng Google cắt khúc.
    // Người dùng báo BA triệu chứng rời rạc: "giọng đổi sang Google",
    // "đoạn đầu giật giật", "không nói được dài" — cùng một gốc.
    //
    // Nghi phạm: trang Tính cách gửi `voiceId: voiceId || null` khi
    // người dùng bấm Lưu lúc danh sách giọng chưa tải xong. Một cú bấm
    // vô hại làm robot mất giọng riêng.
    //
    // Muốn xoá giọng thì gửi đúng chữ `null`; chuỗi rỗng là "không đổi".
    voiceId: data.voiceId === undefined ? undefined : (data.voiceId?.slice(0, 120) || undefined),
    language: data.language?.slice(0, 12),
    traits: traitsMerged,
    sampleDialogues: (data.sampleDialogues ?? undefined) as Prisma.InputJsonValue | undefined,
    wakeWord: data.wakeWord?.slice(0, 60) ?? null,
    temperature:
      typeof data.temperature === 'number'
        ? Math.max(0, Math.min(2, data.temperature))
        : undefined,
    // Trần 800 → 2000. 800 token là ~1.300 chữ tiếng Việt, và đó chính
    // là chỗ câu chém gió dài bị cắt ngang — người dùng báo "nói dài là
    // bị ngắt" mà nhìn log thì `tronCau: false`, tức model bị cụt ở
    // trần token chứ không phải tiếng bị mất lúc phát.
    //
    // 2000 khớp với MAX_SAY_CHARS bên voiceLoop, nên từ giờ hai con số
    // này chặn ở cùng một chỗ thay vì cái nọ âm thầm cắt trước cái kia.
    maxTokens:
      typeof data.maxTokens === 'number'
        ? Math.max(40, Math.min(2000, Math.round(data.maxTokens)))
        : undefined,
  };

  return prisma.makerPersona.upsert({
    where: { projectId },
    update: Object.fromEntries(Object.entries(clean).filter(([, v]) => v !== undefined)),
    create: {
      projectId,
      name: clean.name ?? 'Robot',
      systemPrompt: clean.systemPrompt ?? DEFAULT_PERSONA_PROMPT,
      voiceProvider: clean.voiceProvider ?? 'edge',
      voiceId: clean.voiceId,
      language: clean.language ?? 'vi-VN',
      traits: clean.traits,
      sampleDialogues: clean.sampleDialogues,
      wakeWord: clean.wakeWord,
      temperature: clean.temperature ?? 0.8,
      maxTokens: clean.maxTokens ?? 220,
    },
  });
}

// ─── Firmware / OTA ────────────────────────────────────────

export async function getLatestFirmware(projectSlug: string) {
  const project = await prisma.makerProject.findUnique({
    where: { slug: projectSlug },
    select: { id: true },
  });
  if (!project) return null;
  return prisma.makerFirmware.findFirst({
    where: { projectId: project.id, isLatest: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function publishFirmware(params: {
  projectId: number;
  version: string;
  r2Key: string;
  sha256: string;
  sizeBytes: number;
  releaseNotes?: string;
}) {
  // Exactly one row per project may be "latest".
  return prisma.$transaction(async (tx) => {
    await tx.makerFirmware.updateMany({
      where: { projectId: params.projectId, isLatest: true },
      data: { isLatest: false },
    });
    return tx.makerFirmware.upsert({
      // `map:` in the schema renames the DB constraint only — the
      // Prisma Client key stays the default `projectId_version`.
      // (Using `name:` instead would flip that; see CLAUDE.md.)
      where: {
        projectId_version: {
          projectId: params.projectId,
          version: params.version,
        },
      },
      update: {
        r2Key: params.r2Key,
        sha256: params.sha256,
        sizeBytes: params.sizeBytes,
        releaseNotes: params.releaseNotes,
        isLatest: true,
      },
      create: { ...params, isLatest: true },
    });
  });
}

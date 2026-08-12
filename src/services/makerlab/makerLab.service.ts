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
  },
) {
  const { DEFAULT_PERSONA_PROMPT } = await import('./persona.js');

  // Hoà `speechRate` và `cheDo` vào traits đang có, giữ nguyên mọi khoá
  // khác — cột này còn chứa phần Huấn luyện, ghi đè nguyên khối là xoá sạch.
  const coRate = typeof data.speechRate === 'number' && Number.isFinite(data.speechRate);
  const { laCheDo } = await import('./cheDo.js');
  const coCheDo = laCheDo(data.cheDo);

  let traitsMerged = (data.traits ?? undefined) as Prisma.InputJsonValue | undefined;
  if (coRate || coCheDo) {
    const cur = await prisma.makerPersona.findUnique({
      where: { projectId },
      select: { traits: true },
    });
    const base = ((data.traits ?? cur?.traits ?? {}) as Record<string, unknown>) ?? {};
    traitsMerged = {
      ...base,
      ...(coRate ? { speechRate: Math.max(0.25, Math.min(4, data.speechRate as number)) } : {}),
      ...(coCheDo ? { cheDo: data.cheDo } : {}),
    } as Prisma.InputJsonValue;
  }
  const clean = {
    name: data.name?.slice(0, 80),
    systemPrompt: data.systemPrompt?.slice(0, 8000),
    voiceProvider: data.voiceProvider?.slice(0, 24),
    voiceId: data.voiceId?.slice(0, 120) ?? null,
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

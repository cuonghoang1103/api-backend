/**
 * Maker Lab — API client.
 * Mirrors src/routes/makerLab.routes.ts.
 */

import { api } from './api';
import type {
  MakerProjectSummary,
  MakerProjectDetail,
  MakerDevice,
  MakerDeviceCredentials,
  MakerCommand,
  MakerTelemetryRow,
  MakerDeviceLog,
  MakerMeta,
  MakerComponent,
} from '@/types/maker-lab';

const BASE = '/maker-lab';

// ─── Public ────────────────────────────────────────────────

export async function listProjects(params?: {
  platform?: string;
  status?: string;
}): Promise<MakerProjectSummary[]> {
  const res = await api.get(`${BASE}/projects`, { params });
  return res.data?.data ?? [];
}

export async function getProject(slug: string): Promise<MakerProjectDetail | null> {
  const res = await api.get(`${BASE}/projects/${encodeURIComponent(slug)}`);
  return res.data?.data ?? null;
}

export async function getMeta(): Promise<MakerMeta | null> {
  const res = await api.get(`${BASE}/meta`);
  return res.data?.data ?? null;
}

// ─── Devices ───────────────────────────────────────────────

export async function listDevices(): Promise<MakerDevice[]> {
  const res = await api.get(`${BASE}/devices`);
  return res.data?.data ?? [];
}

export async function getDevice(id: number): Promise<MakerDevice | null> {
  const res = await api.get(`${BASE}/devices/${id}`);
  return res.data?.data ?? null;
}

export async function registerDevice(payload: {
  projectId: number;
  name: string;
}): Promise<{ device: MakerDevice; credentials: MakerDeviceCredentials }> {
  const res = await api.post(`${BASE}/devices`, payload);
  return res.data?.data;
}

export async function rotateDeviceSecret(
  id: number,
): Promise<{ device: MakerDevice; credentials: MakerDeviceCredentials }> {
  const res = await api.post(`${BASE}/devices/${id}/rotate-secret`);
  return res.data?.data;
}

export async function renameDevice(id: number, name: string): Promise<MakerDevice> {
  const res = await api.patch(`${BASE}/devices/${id}`, { name });
  return res.data?.data;
}

export async function deleteDevice(id: number): Promise<void> {
  await api.delete(`${BASE}/devices/${id}`);
}

// ─── Control ───────────────────────────────────────────────

export async function sendCommand(
  deviceId: number,
  type: string,
  payload?: Record<string, unknown>,
): Promise<MakerCommand> {
  const res = await api.post(`${BASE}/devices/${deviceId}/commands`, { type, payload });
  return res.data?.data;
}

export async function listCommands(deviceId: number): Promise<MakerCommand[]> {
  const res = await api.get(`${BASE}/devices/${deviceId}/commands`);
  return res.data?.data ?? [];
}

export async function getTelemetry(
  deviceId: number,
  hours = 6,
): Promise<MakerTelemetryRow[]> {
  const res = await api.get(`${BASE}/devices/${deviceId}/telemetry`, { params: { hours } });
  return res.data?.data ?? [];
}

export async function getDeviceLogs(deviceId: number): Promise<MakerDeviceLog[]> {
  const res = await api.get(`${BASE}/devices/${deviceId}/logs`);
  return res.data?.data ?? [];
}

/** Speak a line verbatim — no LLM in the path. */
export async function sayOnDevice(
  deviceId: number,
  text: string,
): Promise<{ provider: string; bytes: number }> {
  const res = await api.post(`${BASE}/devices/${deviceId}/say`, { text });
  return res.data?.data;
}

/** Full turn: think in persona, act, then speak. */
export async function chatWithDevice(
  deviceId: number,
  text: string,
  speak = true,
): Promise<{
  heard: string;
  said: string;
  actions: Array<{ type: string; payload: Record<string, unknown> }>;
  spoken: boolean;
  ms: { stt: number; llm: number; tts: number; total: number };
}> {
  const res = await api.post(`${BASE}/devices/${deviceId}/chat`, { text, speak });
  return res.data?.data;
}

// ─── Shopping checklist ────────────────────────────────────

export async function setComponentAcquired(
  componentId: number,
  acquired: boolean,
): Promise<MakerComponent> {
  const res = await api.patch(`${BASE}/components/${componentId}/acquired`, { acquired });
  return res.data?.data;
}

// ─── Persona (admin) ───────────────────────────────────────

export interface PersonaPayload {
  name?: string;
  systemPrompt?: string;
  voiceProvider?: string;
  voiceId?: string | null;
  language?: string;
  sampleDialogues?: Array<{ user: string; bot: string }>;
  wakeWord?: string | null;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Sửa tính cách + giọng nói của robot.
 *
 * Đường admin chứ không phải đường công khai: persona quyết định robot
 * nói gì ra loa trong nhà bạn, nên nó không phải thứ ai cũng sửa được.
 */
export async function updatePersona(
  projectId: number,
  payload: PersonaPayload,
): Promise<unknown> {
  const res = await api.put(`/admin${BASE}/projects/${projectId}/persona`, payload);
  return res.data?.data;
}

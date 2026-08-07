/**
 * Maker Lab — shared types.
 * Mirrors the Prisma models in prisma/schema.prisma (maker_* tables).
 */

export type MakerPlatform =
  | 'ESP32'
  | 'ESP32_S3'
  | 'ESP8266'
  | 'RP2040'
  | 'STM32'
  | 'ARDUINO'
  | 'RASPBERRY_PI'
  | 'JETSON'
  | 'OTHER';

export type MakerProjectStatus =
  | 'PLANNING'
  | 'SOURCING'
  | 'BUILDING'
  | 'TESTING'
  | 'LIVE'
  | 'ARCHIVED';

export type MakerComponentCategory =
  | 'MCU'
  | 'AUDIO_IN'
  | 'AUDIO_OUT'
  | 'DISPLAY'
  | 'MOTION'
  | 'DRIVER'
  | 'SENSOR'
  | 'POWER'
  | 'MECHANICAL'
  | 'CONNECTIVITY'
  | 'TOOL'
  | 'MISC';

export type MakerDeviceStatus = 'OFFLINE' | 'ONLINE' | 'ERROR' | 'UPDATING';
export type MakerCommandStatus = 'PENDING' | 'SENT' | 'ACKED' | 'FAILED' | 'EXPIRED';

export interface MakerGoal {
  title: string;
  detail?: string;
  done?: boolean;
}

export interface MakerFeature {
  title: string;
  detail?: string;
  /** 1 (an evening) … 5 (a project of its own). */
  difficulty?: number;
  status?: 'idea' | 'ready' | 'building' | 'done';
  dependsOn?: string[];
}

export interface MakerArchNode {
  id: string;
  label: string;
  sub?: string;
  lane: 'robot' | 'link' | 'server';
  kind: 'sensor' | 'actuator' | 'compute' | 'ai' | 'store' | 'ui' | 'link';
}

export interface MakerArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface MakerArchitecture {
  nodes: MakerArchNode[];
  edges: MakerArchEdge[];
  /** Latency budget, milliseconds per stage. */
  budget?: Array<{ step: string; ms: number }>;
}

export interface MakerWire {
  group: string;
  from: string;
  fromPin: string;
  to: string;
  toPin: string;
  wireColor?: string;
  note?: string;
}

export interface MakerFirmwareModule {
  name: string;
  file: string;
  purpose: string;
  status?: 'planned' | 'wip' | 'done';
  notes?: string;
  code?: string;
}

export interface MakerEnclosureBay {
  id: string;
  label: string;
  /** Millimetres, origin at the robot's bottom-front-left. */
  x: number;
  y: number;
  w: number;
  h: number;
  view: 'side' | 'front';
  contents: string[];
  color: string;
  note?: string;
}

export interface MakerEnclosure {
  reference?: { name: string; sourceSizeMm: number; targetSizeMm: number; note: string };
  dimensions: { w: number; h: number; d: number; weightG?: number };
  bays: MakerEnclosureBay[];
  parts?: Array<{ id: string; name: string; method: string; sizeMm: string; note?: string }>;
  assembly?: Array<{ step: number; title: string; detail: string }>;
  warnings?: string[];
}

export interface MakerBuildLogEntry {
  date: string;
  title: string;
  body: string;
  mediaUrl?: string;
}

export interface MakerComponent {
  id: number;
  projectId: number;
  category: MakerComponentCategory;
  name: string;
  partNumber: string | null;
  qty: number;
  unitPriceVnd: number | null;
  vendorName: string | null;
  vendorUrl: string | null;
  svgKey: string | null;
  imageUrl: string | null;
  specs: Record<string, string> | null;
  whyThisPart: string | null;
  alternatives: Array<{ name: string; note: string; priceVnd?: number }> | null;
  required: boolean;
  acquired: boolean;
  notes: string | null;
  sortOrder: number;
}

export interface MakerFirmwareBuild {
  id: number;
  version: string;
  sha256: string;
  sizeBytes: number;
  releaseNotes: string | null;
  isLatest: boolean;
  createdAt: string;
}

export interface MakerPersona {
  id: number;
  projectId: number;
  name: string;
  systemPrompt: string;
  voiceProvider: string;
  voiceId: string | null;
  language: string;
  traits: Record<string, unknown> | null;
  sampleDialogues: Array<{ user: string; bot: string }> | null;
  wakeWord: string | null;
  temperature: number;
  maxTokens: number;
}

export interface MakerProjectSummary {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  platform: MakerPlatform;
  status: MakerProjectStatus;
  difficulty: number;
  estHours: number | null;
  estCostVnd: number | null;
  coverImage: string | null;
  accentColor: string | null;
  featured: boolean;
  componentCount: number;
  deviceCount: number;
  acquiredCount: number;
}

export interface MakerProjectDetail extends Omit<MakerProjectSummary, 'componentCount'> {
  summary: string | null;
  goals: MakerGoal[] | null;
  features: MakerFeature[] | null;
  architecture: MakerArchitecture | null;
  wiring: MakerWire[] | null;
  firmwareModules: MakerFirmwareModule[] | null;
  buildLog: MakerBuildLogEntry[] | null;
  enclosure: MakerEnclosure | null;
  components: MakerComponent[];
  persona: MakerPersona | null;
  firmwares: MakerFirmwareBuild[];
  totalCostVnd: number;
  acquiredCostVnd: number;
}

export interface MakerDevice {
  id: number;
  projectId: number;
  ownerId: number;
  name: string;
  deviceKey: string;
  status: MakerDeviceStatus;
  lastSeenAt: string | null;
  firmwareVersion: string | null;
  ipAddress: string | null;
  rssi: number | null;
  batteryPct: number | null;
  uptimeSec: number | null;
  connected: boolean;
  createdAt: string;
  project?: { slug: string; name: string; platform: MakerPlatform };
}

export interface MakerDeviceCredentials {
  deviceKey: string;
  /** Shown exactly once, at registration or rotation. Never retrievable. */
  secret: string;
}

export interface MakerCommand {
  id: number;
  deviceId: number;
  type: string;
  payload: Record<string, unknown> | null;
  status: MakerCommandStatus;
  error: string | null;
  sentAt: string | null;
  ackedAt: string | null;
  createdAt: string;
  delivered?: boolean;
}

export interface MakerTelemetryRow {
  id: number;
  deviceId: number;
  payload: Record<string, number | string | boolean>;
  recordedAt: string;
}

export interface MakerDeviceLog {
  id: number;
  deviceId: number;
  level: string;
  message: string;
  createdAt: string;
}

export interface MakerMeta {
  platforms: Array<{ value: MakerPlatform; label: string }>;
  statuses: Array<{ value: MakerProjectStatus; label: string }>;
  categories: Array<{ value: MakerComponentCategory; label: string }>;
  commands: Array<{ type: string; label: string; description: string; llmAllowed: boolean }>;
  commandTypes: string[];
  voiceCloning: { provider: string; steps: string[] };
  wsPath: string;
}

/** Live events pushed over socket.io while a console is open. */
export interface MakerLiveTranscript {
  deviceId: number;
  role: 'user' | 'bot';
  text: string;
  at: string;
}

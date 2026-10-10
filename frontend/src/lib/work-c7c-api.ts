/**
 * CT Work đợt 7c — bảo mật & quản trị (ép 2FA), sổ tài sản/giấy phép, kết quả test tự động (CI), widget mới.
 * Backend: src/routes/work.ctw7c.routes.ts (+ security / assets / testAutomation / widgets7c service). Kiểu khớp service.
 */
import { api } from './api';
import type { WorkUser } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}`;

export const c7cKeys = {
  mySecurity: ['work', 'c7c', 'me-security'] as const,
  wsSecurity: (wsId: number) => ['work', 'c7c', 'ws-security', wsId] as const,
  assets: (pid: number) => ['work', 'c7c', pid, 'assets'] as const,
  automation: (pid: number) => ['work', 'c7c', pid, 'test-automation'] as const,
  widget: (pid: number, kind: string) => ['work', 'c7c', pid, 'widget', kind] as const,
};

// ─── 2FA ─────────────────────────────────────────────────────────

export type TwoFactorState = 'OK' | 'GRACE' | 'SETUP_REQUIRED' | 'VERIFY_REQUIRED';
export interface MySecurity {
  mfaEnabled: boolean; mfaEnabledAt: string | null;
  workspaces: Array<{ id: number; name: string; slug: string; graceUntil: string | null; state: TwoFactorState }>;
}
export interface WsSecurity {
  policy: { workspaceId: number; require2fa: boolean; graceDays: number; enforcedAt: string | null; graceUntil: string | null; updatedAt: string | null; updatedBy: { id: number; username: string; displayName: string | null; fullName: string | null } | null };
  summary: { members: number; enabled: number; missing: number };
  members: Array<{ user: WorkUser; role: string; joinedAt: string; mfaEnabled: boolean; mfaEnabledAt: string | null; state: 'ENABLED' | 'NOT_ENABLED' | 'GRACE' | 'SETUP_REQUIRED' }>;
  exempt: { agents: Array<{ id: number; username: string; displayName: string | null; fullName: string | null }>; note: string };
  youHave2fa: boolean;
  setupUrl: string;
  graceDaysMax: number;
}

export const securityApi = {
  mine: () => d<MySecurity>(api.get(`${B}/me/security`)),
  get: (wsId: number) => d<WsSecurity>(api.get(`${B}/workspaces/${wsId}/security`)),
  set: (wsId: number, body: { require2fa?: boolean; graceDays?: number }) => d<WsSecurity>(api.put(`${B}/workspaces/${wsId}/security`, body)),
  remind: (wsId: number) => d<{ reminded: number }>(api.post(`${B}/workspaces/${wsId}/security/remind`)),
};

// ─── Tài sản ─────────────────────────────────────────────────────

export const ASSET_CATEGORIES = ['SOFTWARE', 'LICENSE', 'SERVICE', 'DEVICE', 'FONT', 'IMAGE', 'AUDIO', 'VIDEO', 'MODEL_3D', 'LIBRARY', 'DATASET', 'OTHER'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];
export const LICENSE_TYPES = [
  'MIT', 'APACHE_2', 'BSD', 'GPL', 'LGPL', 'MPL', 'ISC', 'UNLICENSE', 'CC0', 'CC_BY', 'CC_BY_SA', 'CC_BY_NC', 'CC_BY_ND', 'OFL',
  'COMMERCIAL', 'SUBSCRIPTION', 'EDUCATION', 'FREEWARE', 'PROPRIETARY', 'CUSTOM', 'UNKNOWN',
] as const;
export type LicenseType = (typeof LICENSE_TYPES)[number];
export type AssetStatus = 'ACTIVE' | 'EXPIRED' | 'RETIRED';
export type Billing = 'FREE' | 'ONE_TIME' | 'MONTHLY' | 'YEARLY';
export interface Asset {
  id: number; number: number; key: string; name: string; category: AssetCategory; licenseType: LicenseType; licenseName: string | null; licenseUrl: string | null;
  licenseLabel: string; source: string | null; sourceUrl: string | null; version: string | null; ownerId: number | null; owner: WorkUser | null;
  status: AssetStatus; expiresAt: string | null; remindDays: number; cost: number | null; currency: string; billing: Billing; seats: number | null;
  attributionRequired: boolean; attribution: string | null; notes: string | null; createdById: number | null; createdAt: string; updatedAt: string;
  expiry: { state: 'NONE' | 'OK' | 'EXPIRING' | 'EXPIRED'; daysLeft: number | null };
  links: Array<{ kind: 'ISSUE' | 'PAGE'; number: number; key: string; title: string }>;
}
export interface AssetList {
  items: Asset[];
  summary: { total: number; active: number; expiring: number; expired: number; needsAttribution: number; unknownLicense: number; annualCost: Record<string, number> };
  canEdit: boolean;
  options: { licenses: Array<{ key: LicenseType; label: string; attribution: boolean; spdx: string | null }> };
}
export type AssetInput = Partial<Pick<Asset, 'name' | 'category' | 'licenseType' | 'licenseName' | 'licenseUrl' | 'source' | 'sourceUrl' | 'version' | 'ownerId' | 'status' | 'expiresAt' | 'remindDays' | 'cost' | 'currency' | 'billing' | 'seats' | 'attributionRequired' | 'attribution' | 'notes'>>;

async function download(url: string, params: Record<string, unknown>, fallback: string) {
  const r = await api.get(url, { params, responseType: 'blob' });
  const cd = String(r.headers['content-disposition'] ?? '');
  const name = decodeURIComponent(/filename\*=UTF-8''([^;]+)/.exec(cd)?.[1] ?? fallback);
  const href = URL.createObjectURL(r.data as Blob);
  const a = document.createElement('a');
  a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}

export const assetApi = {
  list: (pid: number) => d<AssetList>(api.get(`${P(pid)}/assets`)),
  create: (pid: number, body: AssetInput & { name: string }) => d<Asset>(api.post(`${P(pid)}/assets`, body)),
  update: (pid: number, n: number, body: AssetInput) => d<Asset>(api.patch(`${P(pid)}/assets/${n}`, body)),
  remove: (pid: number, n: number) => d<{ deleted: true }>(api.delete(`${P(pid)}/assets/${n}`)),
  setLinks: (pid: number, n: number, body: { issues?: string[]; pages?: number[] }) => d<Asset>(api.put(`${P(pid)}/assets/${n}/links`, body)),
  export: (pid: number, kind: 'licenses' | 'credits', format: 'md' | 'txt' | 'csv') =>
    download(`${P(pid)}/assets-export`, { kind, format }, kind === 'credits' ? `CREDITS.${format}` : `THIRD_PARTY_LICENSES.${format}`),
};

// ─── Test tự động ────────────────────────────────────────────────

export interface TestImport {
  id: number; createdAt: string; format: 'JUNIT' | 'PLAYWRIGHT' | 'JEST'; source: 'API' | 'UPLOAD'; build: string | null; branch: string | null; commitSha: string | null;
  runUrl: string | null; cycleId: number | null; total: number; passed: number; failed: number; skipped: number; flaky: number; durationMs: number | null;
  newBugs: number; linkedBugs: number; coveragePct: number | null; coverageBranchPct: number | null; coverageFormat: string | null; passRate: number | null;
  by: WorkUser | null; viaToken: boolean;
}
export interface AutoTest {
  id: number; suite: string | null; name: string; file: string | null; history: string; lastStatus: 'PASS' | 'FAIL' | 'SKIP' | null; lastDurationMs: number | null;
  flaky: boolean; flakyScore: number; lastSeenAt: string; testNumber: number | null; bug: { number: number; title: string; open: boolean } | null;
}
export interface AutomationOverview {
  imports: TestImport[];
  tests: AutoTest[];
  summary: {
    automated: number; flaky: number; failing: number; lastImportAt: string | null; lastPassRate: number | null;
    coverage: { pct: number | null; branchPct: number | null; format: string | null; at: string; modules: Array<{ name: string; linePct: number | null }> } | null;
  };
}
export interface ImportResult {
  importId: number; cycleId: number; cycleName: string; format: string; total: number; passed: number; failed: number; skipped: number; flaky: number;
  newTestCases: number; deferredTestCases: number; newBugs: number; linkedBugs: number; bugsNotCreated: number;
  coverage: { format: string; linePct: number | null; branchPct: number | null } | null;
}

export const autoTestApi = {
  overview: (pid: number) => d<AutomationOverview>(api.get(`${P(pid)}/test-automation`)),
  upload: (pid: number, body: { report: string; build?: string; branch?: string; createBugs?: boolean; coverage?: { report: string } | null }) =>
    d<ImportResult>(api.post(`${P(pid)}/tests/automation/import`, body)),
  resetFlaky: (pid: number, id: number) => d<{ reset: true }>(api.post(`${P(pid)}/test-automation/tests/${id}/reset-flaky`)),
};

// ─── Widget ──────────────────────────────────────────────────────

export interface PassRateWidget { points: Array<{ id: number; name: string; at: string; total: number; executed: number; pass: number; fail: number; passRate: number | null }>; last: { name: string; passRate: number | null } | null; flaky: number }
export interface SeverityWidget { total: number; groups: Array<{ severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'TRIVIAL' | 'UNSET'; count: number }> }
export interface LicenseWidget { items: Array<{ key: string; number: number; name: string; licenseType: string; expiresAt: string; daysLeft: number | null; cost: number | null; currency: string; billing: string }> }
export interface MyTimeWidget { todayMinutes: number; weekMinutes: number }

export const widget7cApi = {
  passRate: (pid: number) => d<PassRateWidget>(api.get(`${P(pid)}/widgets-7c/test-pass-rate`)),
  severity: (pid: number) => d<SeverityWidget>(api.get(`${P(pid)}/widgets-7c/defects-by-severity`)),
  licenses: (pid: number) => d<LicenseWidget>(api.get(`${P(pid)}/widgets-7c/license-expiring`)),
  myTime: (pid: number) => d<MyTimeWidget>(api.get(`${P(pid)}/widgets-7c/my-time`)),
};

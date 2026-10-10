/**
 * CT Work đợt 8a — vòng đời kết nối OAuth theo NGƯỜI (chung cho mọi nhà cung cấp đã `registerProvider`).
 *
 *   start      → state ký HMAC (nonce + userId + provider + hạn 10 phút) + PKCE S256; verifier mã hoá trong
 *                work_oauth_states; cookie `ctw_oauth` = nonce gắn state vào ĐÚNG trình duyệt đã bấm "Kết nối"
 *                (chặn kiểu tấn công gửi link xin quyền cho nạn nhân để gắn tài khoản của họ vào người khác).
 *   callback   → state sai/giả/hết hạn/đã dùng/khác trình duyệt ⇒ 400; đổi code (kèm verifier) lấy token; đọc tài
 *                khoản; lưu token MÃ HOÁ (AAD = provider:userId).
 *   token      → còn < 60 s là tự refresh (một lần mỗi kết nối cùng lúc); refresh hỏng (invalid_grant) ⇒ status ERROR
 *                + lỗi gần nhất, người dùng thấy "Kết nối lại" trên /work/connections.
 *   disconnect → thu hồi ở nhà cung cấp (nếu có endpoint) rồi XOÁ dòng ⇒ token mất hẳn (liên kết lịch xoá theo cascade).
 *
 * Agent (users.kind = AGENT) KHÔNG BAO GIỜ dùng được kết nối: mọi lối vào đều qua assertHuman().
 */

import { prisma } from '../../../config/database.js';
import { AppError, ForbiddenError, NotFoundError } from '../../../middleware/errorHandler.js';
import { logger } from '../../../utils/logger.js';
import { frontendUrl } from '../common.js';
import { openToken, parseState, pkcePair, randomNonce, sealToken, signState, stateSignatureOk, tokenAad } from './crypto.js';
import { oauthFetch, ProviderApiError, providerError } from './http.js';
import {
  getProvider, listProviders, providerClient, redirectUri,
  type OAuthProviderDef, type ProviderContext, type TokenSet,
} from './registry.js';

export const STATE_TTL_MS = 10 * 60_000;
export const STATE_COOKIE = 'ctw_oauth';
const REFRESH_SKEW_MS = 60_000;

// ─── Tiện ích ────────────────────────────────────────────────────

export const providerCtx: ProviderContext = {
  fetch: oauthFetch,
  async getJson<T>(url: string, accessToken: string): Promise<T> {
    const res = await oauthFetch(url, { headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' } });
    if (!res.ok) throw await providerError(res);
    return (await res.json()) as T;
  },
};

export function requireProviderDef(id: string): OAuthProviderDef {
  const def = getProvider(id);
  if (!def) throw new NotFoundError('Unknown integration');
  return def;
}

/** Agent không bao giờ dùng kết nối của người. Tài khoản khoá/tắt cũng không. */
export async function assertHuman(userId: number): Promise<void> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true, enabled: true } });
  if (!u || !u.enabled) throw new ForbiddenError('Account unavailable');
  if (u.kind === 'AGENT') throw new AppError('AI agents cannot use a person\'s Microsoft or Google connection', 403, 'AGENT_NO_OAUTH');
}

/** Chỉ cho quay về đường nội bộ /work… (chống open-redirect). */
export function safeReturnTo(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s.startsWith('/work') || s.startsWith('//') || /[\\\r\n]/.test(s) || s.length > 400) return '/work/connections';
  return s;
}

export interface LogEntry {
  userId: number; provider: string; connectionId?: number | null; kind: string;
  entityType?: string | null; entityId?: number | null; projectId?: number | null; summary: string;
}

/** Nhật ký kết nối (trang "Kết nối của tôi"). Hỏng ghi log không làm hỏng thao tác chính. */
export async function logOAuth(e: LogEntry): Promise<void> {
  try {
    await prisma.workOAuthLog.create({
      data: {
        userId: e.userId, provider: e.provider, connectionId: e.connectionId ?? null, kind: e.kind.slice(0, 16),
        entityType: e.entityType ?? null, entityId: e.entityId ?? null, projectId: e.projectId ?? null, summary: e.summary.slice(0, 500),
      },
    });
  } catch (err) {
    logger.warn('[work] oauth log lỗi', { err: (err as Error).message });
  }
}

export async function markConnectionError(connectionId: number, message: string, fatal = false): Promise<void> {
  await prisma.workOAuthConnection.update({
    where: { id: connectionId },
    data: { lastError: message.slice(0, 500), lastErrorAt: new Date(), ...(fatal ? { status: 'ERROR' } : {}) },
  }).catch(() => undefined);
}

export async function clearConnectionError(connectionId: number): Promise<void> {
  await prisma.workOAuthConnection.updateMany({ where: { id: connectionId, lastError: { not: null } }, data: { lastError: null, lastErrorAt: null } }).catch(() => undefined);
}

// ─── Đổi token ───────────────────────────────────────────────────

async function tokenRequest(def: OAuthProviderDef, client: { clientId: string; clientSecret: string }, params: Record<string, string>): Promise<TokenSet> {
  const basic = def.clientAuth === 'basic';
  const body: Record<string, string> = { ...params, ...(basic ? {} : { client_id: client.clientId, client_secret: client.clientSecret }) };
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (basic) headers.Authorization = `Basic ${Buffer.from(`${client.clientId}:${client.clientSecret}`).toString('base64')}`;
  let payload: string;
  if (def.tokenBody === 'json') { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  else { headers['Content-Type'] = 'application/x-www-form-urlencoded'; payload = new URLSearchParams(body).toString(); }
  const res = await oauthFetch(def.tokenUrl, { method: 'POST', headers, body: payload });
  if (!res.ok) throw await providerError(res);
  const raw = (await res.json()) as Record<string, unknown>;
  const accessToken = typeof raw.access_token === 'string' ? raw.access_token : '';
  if (!accessToken) throw new ProviderApiError(502, 'The provider did not return an access token');
  return {
    accessToken,
    refreshToken: typeof raw.refresh_token === 'string' ? raw.refresh_token : null,
    expiresIn: typeof raw.expires_in === 'number' ? raw.expires_in : typeof raw.expires_in === 'string' ? Number(raw.expires_in) || null : null,
    scope: typeof raw.scope === 'string' ? raw.scope : null,
    raw,
  };
}

// ─── Bắt đầu ─────────────────────────────────────────────────────

export async function startAuthorization(userId: number, providerId: string, returnTo?: unknown) {
  await assertHuman(userId);
  const def = requireProviderDef(providerId);
  const client = providerClient(def);
  if (!client) throw new AppError(`${def.label} is not set up on this server yet — ask an administrator`, 409, 'INTEGRATION_NOT_CONFIGURED');
  const nonce = randomNonce();
  const expiresAt = new Date(Date.now() + STATE_TTL_MS);
  const expSec = Math.floor(expiresAt.getTime() / 1000);
  const pkce = def.pkce === false ? null : pkcePair();
  // Dọn state cũ (hết hạn) — rẻ, chạy kèm mỗi lần bắt đầu.
  await prisma.workOAuthState.deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 60 * 60_000) } } }).catch(() => undefined);
  await prisma.workOAuthState.create({
    data: {
      nonce, userId, provider: def.id, expiresAt, returnTo: safeReturnTo(returnTo),
      verifierEnc: sealToken(pkce?.verifier ?? '-', `state:${nonce}`),
    },
  });
  const state = signState(nonce, userId, def.id, expSec);
  const q = new URLSearchParams({
    client_id: client.clientId,
    response_type: 'code',
    redirect_uri: redirectUri(def.id),
    scope: def.scopes.join(def.scopeSeparator ?? ' '),
    state,
    ...(pkce ? { code_challenge: pkce.challenge, code_challenge_method: 'S256' } : {}),
    ...(def.authParams ?? {}),
  });
  return { url: `${def.authorizeUrl}?${q.toString()}`, nonce, state, expiresAt };
}

// ─── Callback ────────────────────────────────────────────────────

export class OAuthStateError extends AppError {
  constructor(message: string, code: string) {
    super(message, 400, code);
  }
}

export interface CallbackQuery { state?: unknown; code?: unknown; error?: unknown; error_description?: unknown }

/** Trả về URL frontend để chuyển hướng. State hỏng ⇒ ném OAuthStateError (400). */
export async function completeAuthorization(providerId: string, query: CallbackQuery, cookieNonce: string | undefined): Promise<{ redirect: string; userId: number }> {
  const def = requireProviderDef(providerId);
  const raw = typeof query.state === 'string' ? query.state : '';
  const parsed = parseState(raw);
  if (!parsed) throw new OAuthStateError('This sign-in link is not valid. Start again from "My connections".', 'OAUTH_STATE_INVALID');
  const row = await prisma.workOAuthState.findUnique({ where: { nonce: parsed.nonce } });
  if (!row || row.provider !== def.id || !stateSignatureOk(parsed, row.userId, def.id)) {
    throw new OAuthStateError('This sign-in link is not valid. Start again from "My connections".', 'OAUTH_STATE_INVALID');
  }
  const now = Date.now();
  if (parsed.exp * 1000 < now || row.expiresAt.getTime() < now) {
    throw new OAuthStateError('This sign-in link expired (10 minutes). Start again from "My connections".', 'OAUTH_STATE_EXPIRED');
  }
  if (!cookieNonce || cookieNonce !== row.nonce) {
    throw new OAuthStateError('Finish connecting in the same browser where you clicked "Connect".', 'OAUTH_STATE_MISMATCH');
  }
  const used = await prisma.workOAuthState.updateMany({ where: { nonce: row.nonce, usedAt: null }, data: { usedAt: new Date() } });
  if (!used.count) throw new OAuthStateError('This sign-in link was already used. Start again from "My connections".', 'OAUTH_STATE_USED');

  const userId = row.userId;
  const back = (params: Record<string, string>) => {
    const u = new URL(frontendUrl(row.returnTo || '/work/connections'));
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return u.toString();
  };
  if (typeof query.error === 'string' && query.error) {
    const msg = typeof query.error_description === 'string' ? query.error_description.slice(0, 200) : query.error;
    await logOAuth({ userId, provider: def.id, kind: 'error', summary: `Connection cancelled at ${def.label}: ${msg}` });
    return { redirect: back({ provider: def.id, error: query.error === 'access_denied' ? 'denied' : 'failed' }), userId };
  }
  const code = typeof query.code === 'string' ? query.code : '';
  if (!code) throw new OAuthStateError('The provider did not send an authorization code.', 'OAUTH_NO_CODE');

  try {
    await assertHuman(userId);
    const client = providerClient(def);
    if (!client) throw new AppError(`${def.label} is not set up on this server`, 409, 'INTEGRATION_NOT_CONFIGURED');
    const verifier = openToken(row.verifierEnc, `state:${row.nonce}`);
    const tokens = await tokenRequest(def, client, {
      grant_type: 'authorization_code', code, redirect_uri: redirectUri(def.id),
      ...(def.pkce === false || !verifier || verifier === '-' ? {} : { code_verifier: verifier }),
    });
    const profile = await def.profile(providerCtx, tokens).catch((err) => {
      logger.warn('[work] oauth profile lỗi', { provider: def.id, err: (err as Error).message });
      return { id: null, email: null, name: null };
    });
    const aad = tokenAad(def.id, userId);
    const prev = await prisma.workOAuthConnection.findUnique({ where: { userId_provider: { userId, provider: def.id } } }).catch(() => null);
    // Tài khoản ngoài KHÁC lần trước ⇒ liên kết lịch cũ trỏ vào lịch của tài khoản khác: bỏ hết, đồng bộ lại từ đầu.
    const switched = !!prev && !!prev.accountId && !!profile.id && prev.accountId !== profile.id;
    const data = {
      status: 'ACTIVE',
      accountId: profile.id?.slice(0, 200) ?? null,
      accountEmail: profile.email?.slice(0, 320) ?? null,
      accountName: profile.name?.slice(0, 200) ?? null,
      scopes: (tokens.scope ?? def.scopes.join(' ')).slice(0, 4000),
      accessTokenEnc: sealToken(tokens.accessToken, aad),
      // Google không trả lại refresh token ở lần xin quyền sau ⇒ giữ cái cũ.
      ...(tokens.refreshToken ? { refreshTokenEnc: sealToken(tokens.refreshToken, aad) } : {}),
      expiresAt: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000) : null,
      lastError: null, lastErrorAt: null,
    };
    const conn = await prisma.workOAuthConnection.upsert({
      where: { userId_provider: { userId, provider: def.id } },
      create: { userId, provider: def.id, ...data },
      update: { ...data, ...(switched ? { syncCursor: null, settings: {} } : {}) },
    });
    if (switched) await prisma.workCalendarLink.deleteMany({ where: { connectionId: conn.id } });
    await logOAuth({ userId, provider: def.id, connectionId: conn.id, kind: 'connect', summary: `Connected ${def.label}${profile.email ? ` as ${profile.email}` : ''}` });
    return { redirect: back({ provider: def.id, connected: '1' }), userId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn('[work] oauth callback lỗi', { provider: def.id, err: msg });
    await logOAuth({ userId, provider: def.id, kind: 'error', summary: `Could not connect ${def.label}: ${msg}` });
    return { redirect: back({ provider: def.id, error: 'failed' }), userId };
  }
}

// ─── Token còn sống (tự refresh) ─────────────────────────────────

const refreshing = new Map<number, Promise<string>>();

export interface LiveConnection {
  id: number; userId: number; provider: string; accessToken: string; settings: Record<string, unknown>;
  accountEmail: string | null; syncCursor: string | null;
}

async function loadConnection(userId: number, providerId: string) {
  const conn = await prisma.workOAuthConnection.findUnique({ where: { userId_provider: { userId, provider: providerId } } });
  if (!conn) throw new AppError('Connect your account first (My connections)', 409, 'INTEGRATION_NOT_CONNECTED');
  return conn;
}

async function doRefresh(def: OAuthProviderDef, conn: { id: number; userId: number; refreshTokenEnc: string | null }): Promise<string> {
  const aad = tokenAad(def.id, conn.userId);
  const refresh = openToken(conn.refreshTokenEnc, aad);
  const client = providerClient(def);
  if (!refresh || !client) {
    await markConnectionError(conn.id, 'Sign-in expired — reconnect this account', true);
    throw new AppError(`Your ${def.label} sign-in expired — reconnect it in My connections`, 409, 'INTEGRATION_RECONNECT');
  }
  try {
    const t = await tokenRequest(def, client, { grant_type: 'refresh_token', refresh_token: refresh, ...(def.id === 'microsoft' ? { scope: def.scopes.join(' ') } : {}) });
    await prisma.workOAuthConnection.update({
      where: { id: conn.id },
      data: {
        accessTokenEnc: sealToken(t.accessToken, aad),
        // Microsoft xoay refresh token mỗi lần — PHẢI lưu cái mới.
        ...(t.refreshToken ? { refreshTokenEnc: sealToken(t.refreshToken, aad) } : {}),
        expiresAt: t.expiresIn ? new Date(Date.now() + t.expiresIn * 1000) : null,
        status: 'ACTIVE', lastError: null, lastErrorAt: null,
      },
    });
    await logOAuth({ userId: conn.userId, provider: def.id, connectionId: conn.id, kind: 'refresh', summary: `Refreshed ${def.label} access token` });
    return t.accessToken;
  } catch (err) {
    const fatal = err instanceof ProviderApiError && (err.providerCode === 'invalid_grant' || err.status === 400 || err.status === 401);
    const msg = fatal ? 'Sign-in expired or access was removed — reconnect this account' : `Token refresh failed: ${(err as Error).message}`;
    await markConnectionError(conn.id, msg, fatal);
    await logOAuth({ userId: conn.userId, provider: def.id, connectionId: conn.id, kind: 'error', summary: msg });
    if (fatal) throw new AppError(`Your ${def.label} sign-in expired — reconnect it in My connections`, 409, 'INTEGRATION_RECONNECT');
    throw new AppError(`${def.label} is not reachable right now — try again later`, 502, 'INTEGRATION_UNAVAILABLE');
  }
}

/** Token truy cập còn sống của người này với nhà cung cấp này (refresh khi cần). */
export async function liveConnection(userId: number, providerId: string, opts: { forceRefresh?: boolean } = {}): Promise<LiveConnection> {
  await assertHuman(userId);
  const def = requireProviderDef(providerId);
  const conn = await loadConnection(userId, providerId);
  if (conn.status === 'ERROR' && !opts.forceRefresh && !conn.refreshTokenEnc) {
    throw new AppError(`Your ${def.label} sign-in expired — reconnect it in My connections`, 409, 'INTEGRATION_RECONNECT');
  }
  let accessToken = openToken(conn.accessTokenEnc, tokenAad(def.id, userId));
  const stale = !accessToken || (conn.expiresAt && conn.expiresAt.getTime() - Date.now() < REFRESH_SKEW_MS);
  if (opts.forceRefresh || stale || conn.status === 'ERROR') {
    if (def.refreshable === false) {
      if (!accessToken) throw new AppError(`Reconnect ${def.label} in My connections`, 409, 'INTEGRATION_RECONNECT');
    } else {
      let p = refreshing.get(conn.id);
      if (!p) {
        p = doRefresh(def, conn).finally(() => refreshing.delete(conn.id));
        refreshing.set(conn.id, p);
      }
      accessToken = await p;
    }
  }
  if (!conn.lastUsedAt || Date.now() - conn.lastUsedAt.getTime() > 60_000) {
    await prisma.workOAuthConnection.update({ where: { id: conn.id }, data: { lastUsedAt: new Date() } }).catch(() => undefined);
  }
  return {
    id: conn.id, userId, provider: def.id, accessToken: accessToken!,
    settings: (conn.settings && typeof conn.settings === 'object' && !Array.isArray(conn.settings) ? conn.settings : {}) as Record<string, unknown>,
    accountEmail: conn.accountEmail, syncCursor: conn.syncCursor,
  };
}

/**
 * Gọi API nhà cung cấp thay người dùng: gắn Bearer, gặp 401 thì refresh một lần rồi thử lại. Lỗi HTTP ⇒ ProviderApiError.
 * Trả Response (204/không thân cũng được).
 */
export async function providerRequest(conn: LiveConnection, url: string, init: RequestInit = {}): Promise<Response> {
  const send = (token: string) => oauthFetch(url, { ...init, headers: { Accept: 'application/json', ...(init.headers as Record<string, string> | undefined), Authorization: `Bearer ${token}` } });
  let res = await send(conn.accessToken);
  if (res.status === 401) {
    const fresh = await liveConnection(conn.userId, conn.provider, { forceRefresh: true });
    conn.accessToken = fresh.accessToken;
    res = await send(conn.accessToken);
  }
  if (!res.ok) throw await providerError(res);
  return res;
}

export async function providerJson<T = Record<string, unknown>>(conn: LiveConnection, url: string, init: RequestInit = {}): Promise<T> {
  const res = await providerRequest(conn, url, init);
  if (res.status === 204) return {} as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

/** Lỗi API ⇒ lỗi người dùng đọc được (không lộ chi tiết nội bộ). */
export function toUserError(err: unknown, label: string): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof ProviderApiError) {
    if (err.status === 403) return new AppError(`${label} refused this request: ${err.message}`, 403, 'INTEGRATION_FORBIDDEN');
    if (err.status === 404) return new AppError(`${label}: item not found — it may have been deleted or you lost access`, 404, 'INTEGRATION_NOT_FOUND');
    if (err.status === 429) return new AppError(`${label} is rate-limiting requests — try again in a minute`, 429, 'INTEGRATION_RATE_LIMITED');
    return new AppError(`${label}: ${err.message}`, 502, 'INTEGRATION_ERROR');
  }
  return new AppError(`${label} request failed`, 502, 'INTEGRATION_ERROR');
}

// ─── Ngắt kết nối ────────────────────────────────────────────────

export async function disconnect(userId: number, providerId: string, opts: { beforeDelete?: (connId: number) => Promise<void> } = {}) {
  await assertHuman(userId);
  const def = requireProviderDef(providerId);
  const conn = await prisma.workOAuthConnection.findUnique({ where: { userId_provider: { userId, provider: def.id } } });
  if (!conn) return { disconnected: false, revoked: false };
  if (opts.beforeDelete) await opts.beforeDelete(conn.id).catch((err) => logger.warn('[work] oauth beforeDelete lỗi', { err: (err as Error).message }));
  const aad = tokenAad(def.id, userId);
  const tokens = { accessToken: openToken(conn.accessTokenEnc, aad), refreshToken: openToken(conn.refreshTokenEnc, aad) };
  let revoked = false;
  try {
    const client = providerClient(def);
    if (def.revoke && client) { await def.revoke(providerCtx, tokens, client); revoked = true; }
    else if (def.revokeUrl && (tokens.refreshToken || tokens.accessToken)) {
      const res = await oauthFetch(def.revokeUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ token: (tokens.refreshToken || tokens.accessToken)! }).toString(),
      });
      revoked = res.ok;
    }
  } catch (err) {
    logger.warn('[work] oauth revoke lỗi', { provider: def.id, err: (err as Error).message });
  }
  await prisma.workOAuthConnection.delete({ where: { id: conn.id } });
  await logOAuth({
    userId, provider: def.id, connectionId: conn.id, kind: 'disconnect',
    summary: `Disconnected ${def.label}${revoked ? ' (access revoked)' : def.manageUrl ? ` — remove the app at ${def.manageUrl} to revoke access completely` : ''}`,
  });
  return { disconnected: true, revoked, manageUrl: revoked ? null : def.manageUrl ?? null };
}

// ─── Danh sách ───────────────────────────────────────────────────

export async function listConnections(userId: number) {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { kind: true } });
  const isAgent = u?.kind === 'AGENT';
  const rows = isAgent ? [] : await prisma.workOAuthConnection.findMany({ where: { userId } });
  const logs = isAgent ? [] : await prisma.workOAuthLog.findMany({ where: { userId }, orderBy: { id: 'desc' }, take: 40 });
  return {
    agent: isAgent,
    providers: listProviders().map((def) => {
      const c = rows.find((r) => r.provider === def.id);
      return {
        id: def.id, label: def.label, configured: !!providerClient(def), capabilities: def.capabilities,
        scopes: def.scopes, manageUrl: def.manageUrl ?? null, redirectUri: redirectUri(def.id),
        connection: c ? {
          status: c.status, accountEmail: c.accountEmail, accountName: c.accountName,
          grantedScopes: c.scopes ? c.scopes.split(/[ ,]+/).filter(Boolean) : [],
          expiresAt: c.expiresAt, lastError: c.lastError, lastErrorAt: c.lastErrorAt, lastSyncAt: c.lastSyncAt,
          lastUsedAt: c.lastUsedAt, createdAt: c.createdAt, settings: c.settings,
        } : null,
      };
    }),
    activity: logs.map((l) => ({ id: l.id, provider: l.provider, kind: l.kind, summary: l.summary, entityType: l.entityType, entityId: l.entityId, projectId: l.projectId, createdAt: l.createdAt })),
  };
}

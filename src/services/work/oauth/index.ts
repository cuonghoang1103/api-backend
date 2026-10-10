/**
 * CT Work đợt 8a — khung OAuth chung theo người dùng. Cửa vào cho đợt sau (8b: Notion/Slack):
 *
 *   import { registerProvider, liveConnection, providerJson } from '../oauth/index.js';
 *   registerProvider({ id: 'notion', label: 'Notion', env: { clientId: 'CTW_NOTION_CLIENT_ID', clientSecret: 'CTW_NOTION_CLIENT_SECRET' },
 *     authorizeUrl: 'https://api.notion.com/v1/oauth/authorize', tokenUrl: 'https://api.notion.com/v1/oauth/token',
 *     clientAuth: 'basic', tokenBody: 'json', refreshable: false, pkce: false, scopes: [], authParams: { owner: 'user' },
 *     capabilities: ['docs'], profile: async (_ctx, t) => ({ id: …, email: …, name: … }) });
 *
 * Đăng ký xong là có ngay: GET /work/integrations/notion/start · callback `/api/v1/work/integrations/notion/callback`
 * (redirect URI đã chốt) · thẻ trên /work/connections · ngắt kết nối · nhật ký. Gọi API: `liveConnection(userId, 'notion')`
 * rồi `providerJson(conn, url)` (tự refresh + thử lại khi 401). Agent bị chặn sẵn ở assertHuman().
 * Test: `_setOAuthFetchForTests(fakeFetch)` — không bao giờ gọi nhà cung cấp thật.
 */

export * from './registry.js';
export { _setOAuthFetchForTests, oauthFetch, ProviderApiError } from './http.js';
export {
  assertHuman, completeAuthorization, disconnect, listConnections, liveConnection, logOAuth, markConnectionError, clearConnectionError,
  OAuthStateError, providerJson, providerRequest, requireProviderDef, safeReturnTo, startAuthorization, toUserError,
  STATE_COOKIE, STATE_TTL_MS, type LiveConnection,
} from './connections.js';
export { registerBuiltinProviders, GRAPH, MS_SCOPES, GOOGLE_SCOPES } from './providers.js';

import { registerBuiltinProviders } from './providers.js';
registerBuiltinProviders();

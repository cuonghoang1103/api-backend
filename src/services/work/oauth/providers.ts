/**
 * CT Work đợt 8a — hai nhà cung cấp dựng sẵn: Microsoft 365 (Graph, delegated) và Google Workspace.
 * Scope + tên biến env ĐÃ CHỐT ở docs/ctw-ke-hoach-tong.md "Đợt 8" — người dùng đăng ký app theo đúng các giá trị này.
 */

import { registerProvider, type OAuthProviderDef } from './registry.js';

export const MS_SCOPES = ['openid', 'profile', 'email', 'offline_access', 'User.Read', 'Calendars.ReadWrite', 'OnlineMeetings.ReadWrite', 'Files.ReadWrite'];
export const GOOGLE_SCOPES = [
  'openid', 'email', 'profile',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

export const GRAPH = 'https://graph.microsoft.com/v1.0';

export const microsoft: OAuthProviderDef = {
  id: 'microsoft',
  label: 'Microsoft 365',
  env: { clientId: 'CTW_MS_CLIENT_ID', clientSecret: 'CTW_MS_CLIENT_SECRET' },
  // "common": cả tài khoản cá nhân (Outlook.com) lẫn tài khoản công việc/trường học.
  authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  // Microsoft không có endpoint thu hồi refresh token theo app (chỉ revokeSignInSessions — đăng xuất MỌI phiên).
  manageUrl: 'https://myaccount.microsoft.com/applications',
  scopes: MS_SCOPES,
  pkce: true,
  authParams: { response_mode: 'query', prompt: 'select_account' },
  capabilities: ['calendar', 'meetings', 'files', 'sheets'],
  async profile(ctx, tokens) {
    const me = await ctx.getJson<{ id?: string; mail?: string | null; userPrincipalName?: string; displayName?: string }>(`${GRAPH}/me?$select=id,mail,userPrincipalName,displayName`, tokens.accessToken);
    return { id: me.id ?? null, email: me.mail || me.userPrincipalName || null, name: me.displayName ?? null };
  },
};

export const google: OAuthProviderDef = {
  id: 'google',
  label: 'Google Workspace',
  env: { clientId: 'CTW_GOOGLE_CLIENT_ID', clientSecret: 'CTW_GOOGLE_CLIENT_SECRET' },
  authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  revokeUrl: 'https://oauth2.googleapis.com/revoke',
  manageUrl: 'https://myaccount.google.com/connections',
  scopes: GOOGLE_SCOPES,
  pkce: true,
  // offline + consent ⇒ luôn có refresh token (Google chỉ trả refresh token ở lần xin quyền có consent).
  authParams: { access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true' },
  capabilities: ['calendar', 'meetings', 'files', 'sheets'],
  async profile(ctx, tokens) {
    const me = await ctx.getJson<{ sub?: string; email?: string; name?: string }>('https://openidconnect.googleapis.com/v1/userinfo', tokens.accessToken);
    return { id: me.sub ?? null, email: me.email ?? null, name: me.name ?? null };
  },
};

let done = false;
export function registerBuiltinProviders(): void {
  if (done) return;
  done = true;
  registerProvider(microsoft);
  registerProvider(google);
}

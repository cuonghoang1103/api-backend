/**
 * CTW đợt 8b — cắm NOTION và SLACK vào khung OAuth chung của 8a (src/services/work/oauth/) bằng `registerProvider()`.
 * Không có khung OAuth thứ hai: start/callback/lưu token mã hoá/ngắt kết nối/nhật ký đều là của 8a.
 *
 *   Notion — public integration, redirect URI cố định `…/api/v1/work/integrations/notion/callback` (docs/ctw-ke-hoach-tong.md
 *            "Đợt 8"). Token không hết hạn (refreshable: false), đổi code bằng HTTP Basic + thân JSON.
 *   Slack  — OAuth v2 ("Add to Slack"), token BOT của workspace Slack; redirect `…/integrations/slack/callback`. Kết nối
 *            thuộc NGƯỜI cài; work_slack_installs nối không gian CT Work ↔ kết nối đó (slack.service.ts).
 *
 * Thiếu env ⇒ `configured: false` ⇒ nút ẩn + ghi chú (khung 8a lo), không 500.
 */

import { registerProvider, type OAuthProviderDef } from './oauth/index.js';

export const NOTION_API = 'https://api.notion.com/v1';
export const NOTION_VERSION = '2022-06-28';
export const SLACK_API = 'https://slack.com/api';

/** Bot scope của app Slack — giữ khớp hướng dẫn cài trong docs/ctw-dot-8b-notion-slack-bao-cao.md. */
export const SLACK_BOT_SCOPES = ['chat:write', 'chat:write.public', 'channels:read', 'groups:read', 'commands', 'links:read', 'links:write', 'files:write'];

export const notionProvider: OAuthProviderDef = {
  id: 'notion',
  label: 'Notion',
  env: { clientId: 'CTW_NOTION_CLIENT_ID', clientSecret: 'CTW_NOTION_CLIENT_SECRET' },
  authorizeUrl: 'https://api.notion.com/v1/oauth/authorize',
  tokenUrl: 'https://api.notion.com/v1/oauth/token',
  manageUrl: 'https://www.notion.so/profile/integrations',
  scopes: [],
  pkce: false,
  clientAuth: 'basic',
  tokenBody: 'json',
  refreshable: false,
  authParams: { owner: 'user' },
  capabilities: ['docs'],
  async profile(_ctx, t) {
    const raw = t.raw as { workspace_id?: string; workspace_name?: string; owner?: { user?: { id?: string; name?: string; person?: { email?: string } } } };
    const u = raw.owner?.user;
    return { id: raw.workspace_id ?? u?.id ?? null, email: u?.person?.email ?? null, name: [raw.workspace_name, u?.name].filter(Boolean).join(' · ') || null };
  },
};

export const slackProvider: OAuthProviderDef = {
  id: 'slack',
  label: 'Slack',
  env: { clientId: 'CTW_SLACK_CLIENT_ID', clientSecret: 'CTW_SLACK_CLIENT_SECRET' },
  authorizeUrl: 'https://slack.com/oauth/v2/authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
  manageUrl: 'https://slack.com/apps/manage',
  scopes: SLACK_BOT_SCOPES,
  scopeSeparator: ',',
  pkce: false,
  refreshable: false,
  capabilities: ['chat'],
  async profile(_ctx, t) {
    // oauth.v2.access trả { ok, access_token (bot), team: { id, name }, bot_user_id, authed_user }.
    const raw = t.raw as { team?: { id?: string; name?: string }; authed_user?: { id?: string } };
    return { id: raw.team?.id ?? null, email: null, name: raw.team?.name ?? null };
  },
  async revoke(ctx, tokens) {
    if (tokens.accessToken) await ctx.fetch(`${SLACK_API}/auth.revoke`, { method: 'POST', headers: { Authorization: `Bearer ${tokens.accessToken}` } });
  },
};

let done = false;
export function registerCtw8bProviders(): void {
  if (done) return;
  done = true;
  registerProvider(notionProvider);
  registerProvider(slackProvider);
}
registerCtw8bProviders();

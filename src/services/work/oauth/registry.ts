/**
 * CT Work đợt 8a — sổ đăng ký nhà cung cấp OAuth (Microsoft 365, Google; 8b cắm Notion/Slack).
 *
 * Mỗi nhà cung cấp khai MỘT lần bằng `registerProvider()`; tuyến chung `/integrations/:provider/start|callback`,
 * lưu token mã hoá, tự refresh, ngắt kết nối, nhật ký — tất cả dùng chung cho mọi nhà cung cấp đã đăng ký.
 *
 * Thiếu biến môi trường client id/secret ⇒ `configured: false` ⇒ nút kết nối ẩn kèm ghi chú (KHÔNG lỗi 500).
 */

export type OAuthFetch = (url: string, init?: RequestInit) => Promise<Response>;

/** Kết quả đổi code / refresh — đã chuẩn hoá. */
export interface TokenSet {
  accessToken: string;
  refreshToken?: string | null;
  /** Giây còn sống (expires_in). Không có ⇒ token không hết hạn (Notion). */
  expiresIn?: number | null;
  scope?: string | null;
  /** Thân trả về gốc — nhà cung cấp nào kèm thông tin tài khoản trong đó (Notion) thì tự đọc ở `profile`. */
  raw: Record<string, unknown>;
}

export interface OAuthProfile {
  id: string | null;
  email: string | null;
  name: string | null;
}

export interface ProviderContext {
  fetch: OAuthFetch;
  /** GET JSON có Bearer; lỗi HTTP ⇒ ném. */
  getJson: <T = Record<string, unknown>>(url: string, accessToken: string) => Promise<T>;
}

export type Capability = 'calendar' | 'meetings' | 'files' | 'sheets' | 'docs' | 'chat';

export interface OAuthProviderDef {
  /** Khoá trên URL: chữ thường, a-z0-9- (microsoft, google, notion…). */
  id: string;
  label: string;
  /** Tên biến môi trường (KHÔNG phải giá trị). */
  env: { clientId: string; clientSecret: string };
  authorizeUrl: string;
  tokenUrl: string;
  /** Endpoint thu hồi token (Google). Không có ⇒ chỉ xoá token phía mình + hướng dẫn gỡ app ở trang tài khoản. */
  revokeUrl?: string;
  /** Nơi người dùng tự gỡ quyền app (hiện trên trang Kết nối). */
  manageUrl?: string;
  scopes: string[];
  /** Ký tự nối scope (mặc định dấu cách). */
  scopeSeparator?: string;
  /** PKCE S256 (mặc định bật). */
  pkce?: boolean;
  /** Tham số thêm cho trang xin quyền (access_type=offline, prompt=consent…). */
  authParams?: Record<string, string>;
  /** Cách gửi client id/secret khi đổi token: trong thân (mặc định) hay HTTP Basic (Notion). */
  clientAuth?: 'body' | 'basic';
  /** Thân yêu cầu token: form (mặc định) hay JSON (Notion). */
  tokenBody?: 'form' | 'json';
  /** Có refresh token không (mặc định có). */
  refreshable?: boolean;
  capabilities: Capability[];
  /** Đọc tài khoản sau khi đổi code. */
  profile: (ctx: ProviderContext, tokens: TokenSet) => Promise<OAuthProfile>;
  /** Thu hồi tuỳ biến (thay revokeUrl). Lỗi bị nuốt — xoá token phía mình vẫn diễn ra. */
  revoke?: (ctx: ProviderContext, tokens: { accessToken: string | null; refreshToken: string | null }, client: { clientId: string; clientSecret: string }) => Promise<void>;
}

const PROVIDERS = new Map<string, OAuthProviderDef>();

export function registerProvider(def: OAuthProviderDef): void {
  if (!/^[a-z][a-z0-9-]{1,23}$/.test(def.id)) throw new Error(`Bad OAuth provider id: ${def.id}`);
  PROVIDERS.set(def.id, def);
}

export function getProvider(id: string): OAuthProviderDef | null {
  return PROVIDERS.get(id) ?? null;
}

export function listProviders(): OAuthProviderDef[] {
  return [...PROVIDERS.values()];
}

/** client id + secret từ env — thiếu một trong hai ⇒ null (nút kết nối ẩn). */
export function providerClient(def: OAuthProviderDef): { clientId: string; clientSecret: string } | null {
  const clientId = (process.env[def.env.clientId] ?? '').trim();
  const clientSecret = (process.env[def.env.clientSecret] ?? '').trim();
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

export function providerConfigured(def: OAuthProviderDef): boolean {
  return providerClient(def) !== null;
}

/**
 * Redirect URI CỐ ĐỊNH (docs/ctw-ke-hoach-tong.md "Đợt 8"): `<gốc>/api/v1/work/integrations/<provider>/callback`.
 * Gốc: production `https://cuongthai.com`, dev `http://localhost:<PORT|4000>`; ghi đè bằng CTW_OAUTH_REDIRECT_BASE.
 */
export function redirectUri(providerId: string): string {
  const override = (process.env.CTW_OAUTH_REDIRECT_BASE ?? '').trim().replace(/\/+$/, '');
  const base = override || (process.env.NODE_ENV === 'production' ? 'https://cuongthai.com' : `http://localhost:${process.env.PORT || 4000}`);
  return `${base}/api/v1/work/integrations/${providerId}/callback`;
}

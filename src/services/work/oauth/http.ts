/**
 * CT Work đợt 8a — lối ra mạng DUY NHẤT của khung OAuth + adapter Microsoft Graph / Google.
 * Test thay bằng `_setOAuthFetchForTests()` — KHÔNG bao giờ gọi Microsoft/Google thật trong test.
 */

import type { OAuthFetch } from './registry.js';

let impl: OAuthFetch | null = null;

export function _setOAuthFetchForTests(f: OAuthFetch | null): void {
  impl = f;
}

const inTest = () => process.env.WORK_DB_TEST === '1' || process.env.NODE_ENV === 'test';

export const oauthFetch: OAuthFetch = (url, init) => {
  if (impl) return impl(url, init);
  // Dây bẫy: test quên mock ⇒ hỏng to, không lặng lẽ gọi ra Internet.
  if (inTest()) return Promise.reject(new Error(`oauthFetch: real network call in test (${url.split('?')[0]})`));
  return fetch(url, { ...init, signal: init?.signal ?? AbortSignal.timeout(20_000) });
};

/** Lỗi từ API nhà cung cấp — status + thông điệp đã rút gọn (không bao giờ chứa token). */
export class ProviderApiError extends Error {
  constructor(public status: number, message: string, public providerCode?: string) {
    super(message);
    this.name = 'ProviderApiError';
  }
}

/** Đọc thông điệp lỗi kiểu Graph `{error:{code,message}}` / Google `{error:{message}}` / OAuth `{error, error_description}`. */
export async function providerError(res: Response): Promise<ProviderApiError> {
  let msg = `HTTP ${res.status}`;
  let code: string | undefined;
  try {
    const j = (await res.json()) as Record<string, unknown>;
    const e = j.error as unknown;
    if (e && typeof e === 'object') {
      const o = e as Record<string, unknown>;
      code = typeof o.code === 'string' ? o.code : typeof o.status === 'string' ? o.status : undefined;
      if (typeof o.message === 'string') msg = o.message;
    } else if (typeof e === 'string') {
      code = e;
      msg = typeof j.error_description === 'string' ? j.error_description : e;
    }
  } catch { /* thân không phải JSON */ }
  return new ProviderApiError(res.status, msg.replace(/\s+/g, ' ').slice(0, 300), code);
}

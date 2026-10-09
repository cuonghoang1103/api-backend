/**
 * Chỉ cho work.ctw5b.db.test.ts — PHẢI là import ĐẦU TIÊN của tệp test: đặt cấu hình R2 GIẢ trước khi
 * config/env.ts được nạp, để `getSignedDownloadUrl` ký được URL tải (ký thuần cục bộ, không gọi mạng) và đường
 * tải tệp đi qua nhánh R2. Đọc/ghi object thật bị thay bằng kho trong RAM (`_setCommentStoreForTests`).
 * Máy đã có cấu hình R2 thật ⇒ giữ nguyên (chỉ ký URL, không ghi gì lên R2).
 */
for (const [k, v] of Object.entries({
  R2_BUCKET_NAME: 'ctw5b-test', R2_ENDPOINT_URL: 'https://r2.test.invalid', R2_ACCESS_KEY_ID: 'test', R2_SECRET_ACCESS_KEY: 'test',
})) {
  if (!process.env[k]) process.env[k] = v;
}
export {};

// Phần THUẦN của việc đóng gói (dùng chung cho `dong-goi.mjs` và test).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/** SHA-256 (hex) của một file. */
export function sha256File(duong) {
  return createHash('sha256').update(readFileSync(duong)).digest('hex');
}

/**
 * Nội dung `latest.json` — lệnh cài đọc file này để biết bản nào, kiểm sha256,
 * và CLI đọc nó (tối đa 1 lần/ngày) để nhắc cập nhật.
 * `tenFile`: file gói trên web — web chỉ giữ `cuongmini-latest.tgz` (xem dong-goi.mjs), nên latest.json
 * PHẢI trỏ đúng file đó; trỏ bản đánh số là lệnh cài 404.
 * @param {{ phienBan: string, sha256: string, kichThuoc: number, ngay?: Date, nodeToiThieu?: number, tenFile?: string }} o
 */
export function dungLatest(o) {
  if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(o.phienBan)) throw new Error(`Phiên bản sai dạng: ${o.phienBan}`);
  if (!/^[0-9a-f]{64}$/.test(o.sha256)) throw new Error('sha256 phải là 64 ký tự hex.');
  if (!Number.isInteger(o.kichThuoc) || o.kichThuoc <= 0) throw new Error('Kích thước gói không hợp lệ.');
  if (o.tenFile !== undefined && !/^[\w.-]+\.tgz$/.test(o.tenFile)) throw new Error('Tên file gói không hợp lệ.');
  return {
    version: o.phienBan,
    sha256: o.sha256,
    size: o.kichThuoc,
    file: o.tenFile ?? `cuongmini-${o.phienBan}.tgz`,
    date: (o.ngay ?? new Date()).toISOString(),
    node: `>=${o.nodeToiThieu ?? 20}`,
  };
}

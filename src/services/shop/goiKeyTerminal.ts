/**
 * Bảng gói KEY TERMINAL bán ở /shop.
 * ─────────────────────────────────────────────────────────────────────────
 * Một chỗ duy nhất nói "sản phẩm nào là key terminal, và gói đó đáng bao
 * nhiêu USD mỗi cửa sổ 5h, trong bao nhiêu ngày".
 *
 * Vì sao là BẢNG TRONG MÃ chứ không phải cột trong DB: ba con số này phải
 * khớp TUYỆT ĐỐI với ba nơi khác — mô tả sản phẩm hiện cho khách đọc,
 * `services/cong-llm/canh/han-muc.json` (thứ nạp lại quota mỗi cửa sổ), và
 * `LlmKeyRequest.quotaUsd` (thứ khoá ví khi chạm trần). Để chúng trong mã thì
 * mỗi lần đổi giá là một commit đi qua review, thay vì một lệnh UPDATE lúc
 * nửa đêm làm ba nơi lệch nhau mà không ai thấy.
 *
 * ⚠️ Đổi ở đây thì PHẢI đổi `han-muc.json` cùng lượt — file kia mới là thứ
 * thật sự nạp quota vào New API. Sai lệch = bán 60$ mà nạp 10$.
 */

export interface GoiKeyTerminal {
  /** Hạn mức USD quy đổi cho MỖI cửa sổ 5 giờ. */
  quotaUsd: number;
  /** Thời hạn gói, tính từ lúc giao key. */
  soNgay: number;
  /** Tiền tố tên key con trong New API — để đối chiếu khi tra tay. */
  tienTo: string;
}

export const GOI_KEY_TERMINAL: Record<string, GoiKeyTerminal> = {
  'cuongmini-terminal-co-ban-30-ngay': { quotaUsd: 60, soNgay: 30, tienTo: 'shop-coban' },
  'cuongmini-terminal-tieu-chuan-30-ngay': { quotaUsd: 100, soNgay: 30, tienTo: 'shop-tieuchuan' },
  'cuongmini-terminal-chuyen-sau-30-ngay': { quotaUsd: 150, soNgay: 30, tienTo: 'shop-chuyensau' },
};

export function goiTheoSlug(slug: string | null | undefined): GoiKeyTerminal | null {
  if (!slug) return null;
  return GOI_KEY_TERMINAL[slug] ?? null;
}

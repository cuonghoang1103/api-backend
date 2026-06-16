/**
 * Shared types for payment routes. Kept in a separate file to avoid
 * circular imports (some consumers only need the types).
 */

export interface VnpIpnParsed {
  orderCode: string;
  responseCode: string;
  transactionNo: string | null;
  bankCode: string | null;
  /** Amount in VND (after dividing by 100, which is what VNPay uses internally) */
  amountVnd: number;
  payDate: Date | null;
  /** True if HMAC SHA512 checksum matched */
  isVerified: boolean;
}

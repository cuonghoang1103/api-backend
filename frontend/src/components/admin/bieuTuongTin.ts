/**
 * Biểu tượng cho từng loại tin của hộp thư admin (chuông + /admin/thong-bao).
 * Thay cho bộ emoji cũ: emoji mỗi máy vẽ một kiểu, to nhỏ lệch dòng chữ, và
 * một công cụ làm việc không cần chúng.
 */
import type { LucideIcon } from 'lucide-react';
import { Banknote, Bell, Coins, Crown, Flag, KeyRound, Landmark, Package, Trash2, Wrench } from 'lucide-react';

export const BIEU_TUONG_TIN: Record<string, LucideIcon> = {
  XIN_KEY: KeyRound,
  DON_MOI: Package,
  DA_THANH_TOAN: Banknote,
  CHUYEN_KHOAN_CHO_DUYET: Landmark,
  DOI_KEY: Wrench,
  BAO_CAO: Flag,
  XOA_TAI_KHOAN: Trash2,
  NAP_DIEM: Coins,
  MUA_PRO: Crown,
  KHAC: Bell,
};

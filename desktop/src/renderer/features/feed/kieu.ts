/**
 * Kiểu dữ liệu và hàm dùng chung của bảng tin.
 *
 * Đối chiếu `serializePost()` trong `src/services/social.service.ts` — đó là
 * nguồn sự thật, không phải file này. Mọi trường ở đây phải có ở đó.
 */

export interface TacGia {
  id: number;
  username: string;
  fullName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface Media {
  id: number;
  type: 'IMAGE' | 'VIDEO' | 'FILE' | string;
  url: string;
  thumbnail?: string | null;
  width?: number | null;
  height?: number | null;
  fileName?: string | null;
  fileSize?: number | null;
}

/** Năm loại cảm xúc máy chủ nhận (`SocialLike.type`). */
export const CAM_XUC = ['LIKE', 'LOVE', 'HAHA', 'SAD', 'ANGRY'] as const;
export type CamXuc = (typeof CAM_XUC)[number];

/** Mặt và tên tiếng Việt cho từng cảm xúc. Thứ tự giống Facebook. */
export const MAT_CAM_XUC: Record<CamXuc, { hinh: string; ten: string; mau: string }> = {
  LIKE: { hinh: '👍', ten: 'Thích', mau: '#3b82f6' },
  LOVE: { hinh: '❤️', ten: 'Yêu thích', mau: '#ef4444' },
  HAHA: { hinh: '😆', ten: 'Haha', mau: '#f59e0b' },
  SAD: { hinh: '😢', ten: 'Buồn', mau: '#f59e0b' },
  ANGRY: { hinh: '😡', ten: 'Phẫn nộ', mau: '#f97316' },
};

export interface LuaChon {
  id: number;
  text: string;
  votesCount?: number;
}

export interface BinhChon {
  id: number;
  question?: string | null;
  options?: LuaChon[];
  /** Lựa chọn NGƯỜI ĐANG XEM đã bỏ phiếu. Máy chủ trả mảng id. */
  userVotes?: number[];
  multipleChoice?: boolean;
  expiresAt?: string | null;
}

export interface Bai {
  id: number;
  content?: string | null;
  createdAt: string;
  author: TacGia;
  media: Media[];
  type?: string;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount?: number;
  isLiked: boolean;
  isSaved: boolean;
  isShared?: boolean;
  myReaction?: CamXuc | null;
  reactionBreakdown?: Record<CamXuc, number>;
  locationName?: string | null;
  youtubeUrl?: string | null;
  viewCount?: number;
  poll?: BinhChon | null;
}

export interface BinhLuan {
  id: number;
  content?: string | null;
  createdAt: string;
  author?: TacGia | null;
  user?: TacGia | null;
  parentId?: number | null;
  likesCount?: number;
  isLiked?: boolean;
}

/**
 * Chuẩn hoá bài về đúng kiểu đã khai.
 *
 * ⚠️ Máy chủ trả `isLiked`/`isSaved` là SỐ 0/1, không phải boolean. Dùng thẳng
 * thì `data-bat={0}` render ra `data-bat="0"`, mà CSS bắt `[data-bat='true']`
 * — nên trái tim KHÔNG BAO GIỜ sáng dù đã thích. Mọi phép `!isLiked` vẫn chạy
 * đúng nên lỗi này không lộ ra ở đâu khác; chỉ có màu là sai, im lặng.
 */
export function chuanHoa(b: Bai): Bai {
  return {
    ...b,
    isLiked: !!b.isLiked,
    isSaved: !!b.isSaved,
    isShared: !!b.isShared,
    reactionBreakdown: b.reactionBreakdown ?? { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 },
  };
}

/** Tên hiển thị: ưu tiên tên người dùng tự đặt, cuối cùng mới tới username. */
export function ten(t?: TacGia | null): string {
  return t?.displayName || t?.fullName || t?.username || 'Ẩn danh';
}

/**
 * "3 phút trước". Không dùng `Intl.RelativeTimeFormat` cho mọi mốc: quá một
 * tuần thì "2 tuần trước" mơ hồ hơn hẳn một ngày tháng cụ thể.
 */
export function khiNao(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const giay = Math.floor((Date.now() - t) / 1000);
  if (giay < 60) return 'vừa xong';
  if (giay < 3600) return `${Math.floor(giay / 60)} phút trước`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ trước`;
  if (giay < 604800) return `${Math.floor(giay / 86400)} ngày trước`;
  const d = new Date(t);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

/** "1,2 MB" — cỡ tệp cho hàng tải về. */
export function coTep(byte?: number | null): string {
  if (!byte || byte <= 0) return '';
  const dv = ['B', 'KB', 'MB', 'GB'];
  let n = byte;
  let i = 0;
  while (n >= 1024 && i < dv.length - 1) { n /= 1024; i += 1; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0).replace('.', ',')} ${dv[i]}`;
}

/** Tổng số cảm xúc, để hiện "12" cạnh cụm mặt cười. */
export function tongCamXuc(b: Bai): number {
  const bd = b.reactionBreakdown;
  if (!bd) return b.likesCount;
  const t = CAM_XUC.reduce((s, k) => s + (bd[k] ?? 0), 0);
  // Bài cũ (trước khi có bảng phân loại) chỉ có `likesCount`. Lấy số lớn hơn
  // để không bao giờ hiện ít hơn sự thật.
  return Math.max(t, b.likesCount);
}

/** Ba loại cảm xúc nhiều nhất, để hiện cụm mặt cười chồng nhau như Facebook. */
export function topCamXuc(b: Bai): CamXuc[] {
  const bd = b.reactionBreakdown;
  if (!bd) return b.likesCount > 0 ? ['LIKE'] : [];
  const co = CAM_XUC.filter((k) => (bd[k] ?? 0) > 0)
    .sort((a, c) => (bd[c] ?? 0) - (bd[a] ?? 0))
    .slice(0, 3);
  // Bài cũ: có lượt thích nhưng bảng phân loại rỗng.
  if (co.length === 0 && b.likesCount > 0) return ['LIKE'];
  return co;
}

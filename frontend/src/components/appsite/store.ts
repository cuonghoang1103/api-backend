/**
 * Trạng thái THẬT của app trên App Store — hỏi iTunes Lookup ở máy chủ, đệm 1 giờ.
 *
 * Vì sao không ghi cứng: user muốn "logo App Store dính link tải KHI được duyệt". App chưa lên store ⇒ Lookup trả
 * `resultCount: 0` ⇒ trang hiện "Sắp có trên App Store" thay vì một huy hiệu dẫn tới 404 (lib/appLinks.ts: "a badge
 * that 404s is worse than no badge"). Duyệt xong, chậm nhất 1 giờ là huy hiệu tự hiện — không cần deploy.
 */
export interface ThongTinStore {
  coTren: boolean;
  url: string | null;
  phienBan?: string;
  danhGia?: number;
  soDanhGia?: number;
  ngayBan?: string;
  ghiChuBan?: string;
  dungLuong?: string;
  iosToiThieu?: string;
}

export async function layThongTinStore(appStoreId: string | null): Promise<ThongTinStore> {
  if (!appStoreId) return { coTren: false, url: null };
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${encodeURIComponent(appStoreId)}&country=vn`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const j = (await res.json()) as { resultCount: number; results: Record<string, unknown>[] };
    const r = j.results?.[0];
    if (!j.resultCount || !r) return { coTren: false, url: null };
    const byte = Number(r.fileSizeBytes ?? 0);
    return {
      coTren: true,
      // Link sạch, không ?uo=4 — trang VN tiếng Việt.
      url: `https://apps.apple.com/vn/app/id${appStoreId}?l=vi`,
      phienBan: typeof r.version === 'string' ? r.version : undefined,
      danhGia: typeof r.averageUserRating === 'number' ? r.averageUserRating : undefined,
      soDanhGia: typeof r.userRatingCount === 'number' ? r.userRatingCount : undefined,
      ngayBan: typeof r.currentVersionReleaseDate === 'string' ? r.currentVersionReleaseDate : undefined,
      ghiChuBan: typeof r.releaseNotes === 'string' ? r.releaseNotes : undefined,
      dungLuong: byte > 0 ? `${Math.round(byte / 1024 / 1024)} MB` : undefined,
      iosToiThieu: typeof r.minimumOsVersion === 'string' ? r.minimumOsVersion : undefined,
    };
  } catch {
    // Mạng lỗi: coi như chưa có (không dựng huy hiệu có thể 404). Next giữ bản đệm cũ khi lần làm mới sau thất bại,
    // nên app đã lên store chỉ rơi vào nhánh này nếu lần hỏi ĐẦU TIÊN đã hỏng.
    return { coTren: false, url: null };
  }
}

/**
 * CT Lồng Tiếng (18/11/2026) — gọi API `/api/v1/long-tieng` (chỉ ADMIN). Hợp đồng: docs/long-tieng-hop-dong.md mục 1.
 * Mọi phản hồi bọc `{ success, data }` — các hàm dưới trả thẳng `data`.
 */
import { api } from '@/lib/api';

export type TrangThaiViec = 'cho_tai_len' | 'cho' | 'tai' | 'lam' | 'xong' | 'loi' | 'huy';
export type LoaiNhac = 'goc' | 'thu-vien' | 'tep' | 'khong';
/** Bản video xuất ra (thêm 18/11): cả hai · chỉ giọng Việt [VI] · chỉ song ngữ [VI + giọng gốc N%]. */
export type BanRa = 'ca-hai' | 'vi' | 'vi-goc';
export interface TepMoTa { ten: string; kichThuoc: number; kieu: string }
export interface NhacNen { loai: LoaiNhac; id?: string; amLuong: number; tep?: TepMoTa }
export interface KetQua { loai: 'vi' | 'vi-goc' | 'srt-vi' | 'srt-goc' | 'thong-tin'; ten: string; kichThuoc: number; url: string | null }
export interface Viec {
  id: string; nguon: 'url' | 'tep'; url: string | null; tep: TepMoTa | null; tenVideo: string | null;
  lang: string; goc: number; nhip: 'cho-giong' | 'tang-toc'; banRa?: BanRa; nhacNen: NhacNen;
  trangThai: TrangThaiViec; buoc: string | null; phanTram: number; loi: string | null; ketQua: KetQua[];
  thoiLuong: number | null; tao: string; xong: string | null; daTaiVe: string | null;
}
export interface TaiLen { url: string; het: string; kieu: string }
export interface BaiNhac { id: string; ten: string; tamTrang: string; thoiLuong: number; nghe: string | null; nguon: string; giayPhep: string; tacGia: string | null }
export interface MaKetNoi { id: number; ten: string | null; dau: string; tao: string; dungLanCuoi: string | null; thuHoi: string | null }

export interface TaoViecVao {
  url?: string; tep?: TepMoTa; lang: 'auto' | 'zh' | 'en'; goc: number; tenVideo?: string;
  nhip: 'cho-giong' | 'tang-toc'; banRa?: BanRa; nhacNen: { loai: LoaiNhac; id?: string; amLuong?: number; tep?: TepMoTa };
}

const d = <T,>(p: Promise<{ data: { data: T } }>) => p.then((r) => r.data.data);

export const longTiengApi = {
  dsViec: () => d<Viec[]>(api.get('/long-tieng/jobs')),
  taoViec: (b: TaoViecVao) => d<{ job: Viec; taiLen?: TaiLen; taiLenNhac?: TaiLen }>(api.post('/long-tieng/jobs', b)),
  daTaiLen: (id: string) => d<Viec>(api.post(`/long-tieng/jobs/${id}/da-tai-len`)),
  thuLai: (id: string) => d<Viec>(api.post(`/long-tieng/jobs/${id}/thu-lai`)),
  daTaiVe: (id: string) => d<Viec>(api.post(`/long-tieng/jobs/${id}/da-tai-ve`)),
  xoa: (id: string) => d<{ xoa: boolean; huy: boolean; soTep: number }>(api.delete(`/long-tieng/jobs/${id}`)),
  nhac: () => d<BaiNhac[]>(api.get('/long-tieng/nhac')),
  dsMa: () => d<MaKetNoi[]>(api.get('/long-tieng/ma-ket-noi')),
  taoMa: (ten: string) => d<{ id: number; ma: string; ten: string | null; dau: string; tao: string }>(api.post('/long-tieng/ma-ket-noi', { ten })),
  thuHoiMa: (id: number) => d<{ ok: true }>(api.delete(`/long-tieng/ma-ket-noi/${id}`)),
};

/** PUT thẳng lên R2 bằng URL ký sẵn (không qua máy chủ), báo % tải. Content-Type PHẢI đúng `kieu` đã ký. */
export function putLenKho(t: TaiLen, file: File, onPhanTram: (p: number) => void): Promise<void> {
  return new Promise((ok, hong) => {
    const x = new XMLHttpRequest();
    x.open('PUT', t.url);
    x.setRequestHeader('Content-Type', t.kieu);
    x.upload.onprogress = (e) => { if (e.lengthComputable) onPhanTram(Math.round((e.loaded / e.total) * 100)); };
    x.onload = () => (x.status >= 200 && x.status < 300 ? ok() : hong(new Error(`Kho trả lỗi ${x.status}`)));
    x.onerror = () => hong(new Error('Mất mạng khi tải lên'));
    x.send(file);
  });
}

export const kieuCua = (f: File) => f.type || 'application/octet-stream';
export const moTaTep = (f: File): TepMoTa => ({ ten: f.name, kichThuoc: f.size, kieu: kieuCua(f) });

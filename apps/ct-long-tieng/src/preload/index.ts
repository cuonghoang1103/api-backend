/**
 * Preload — cầu DUY NHẤT giữa renderer và main. Phơi `window.ctlt` (kiểu `CtltApi`), không phơi `ipcRenderer`.
 *
 * Tệp kéo thả: đường dẫn lấy bằng `webUtils.getPathForFile` NGAY TẠI ĐÂY (chỉ có với File thật từ đĩa) — renderer
 * không có cách nào đưa một đường dẫn tuỳ ý cho main.
 */
import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { KENH, type CtltApi, type TrangThaiApp } from '../shared/ipc';

const goi = <T>(kenh: string, ...a: unknown[]) => ipcRenderer.invoke(kenh, ...a) as Promise<T>;

const api: CtltApi = {
  layTrangThai: () => goi(KENH.layTrangThai),
  onCapNhat: (cb) => {
    const f = (_e: unknown, s: TrangThaiApp) => cb(s);
    ipcRenderer.on(KENH.capNhat, f);
    return () => { ipcRenderer.removeListener(KENH.capNhat, f); };
  },
  onMoTrinhPhat: (cb) => {
    const f = (_e: unknown, id: string) => cb(id);
    ipcRenderer.on(KENH.moTrinhPhat, f);
    return () => { ipcRenderer.removeListener(KENH.moTrinhPhat, f); };
  },
  ketNoi: (ma) => goi(KENH.ketNoi, ma),
  dangXuat: () => goi(KENH.dangXuat),
  moTrangWeb: () => goi(KENH.moTrangWeb),
  taoViecLink: (url, tc) => goi(KENH.taoViecLink, url, tc),
  chonTep: (tc) => goi(KENH.chonTep, tc),
  keoThaTep: (tep, tc) => {
    const ds: string[] = [];
    for (const f of Array.from(tep ?? []).slice(0, 50)) {
      try {
        const p = webUtils.getPathForFile(f);
        if (p) ds.push(p);
      } catch { /* không phải tệp trên đĩa */ }
    }
    return goi(KENH.taoViecTep, ds, tc);
  },
  huyViec: (id) => goi(KENH.huyViec, id),
  thuLai: (id) => goi(KENH.thuLai, id),
  taiTrenMay: (id) => goi(KENH.taiTrenMay, id),
  taiVe: (id) => goi(KENH.taiVe, id),
  moThuMucViec: (id) => goi(KENH.moThuMucViec, id),
  thuVien: () => goi(KENH.thuVien),
  moThuMucMuc: (id) => goi(KENH.moThuMucMuc, id),
  docPhuDe: (id, loai) => goi(KENH.docPhuDe, id, loai),
  luuCaiDat: (p) => goi(KENH.luuCaiDat, p),
  chonThuMucTai: () => goi(KENH.chonThuMucTai),
  moThuMucTai: () => goi(KENH.moThuMucTai),
  lamMoi: () => goi(KENH.lamMoi),
  dsNhac: () => goi(KENH.dsNhac),
  chonNhacTep: () => goi(KENH.chonNhacTep),
};

contextBridge.exposeInMainWorld('ctlt', api);

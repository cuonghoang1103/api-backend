/**
 * ============================================================
 * IPC CHO AI NGOẠI TUYẾN
 * ============================================================
 *
 * Lớp mỏng giữa renderer và `main/aiCucBo/`. Ba quy tắc, và cả ba đều có lý do
 * đã cắn ở chỗ khác trong app này:
 *
 * 1. **KHÔNG handler nào ném.** Màn hình Cài đặt phải vẽ ra được kể cả khi
 *    mọi thứ hỏng — ném từ IPC làm renderer nhận một Error trần và thường là
 *    một màn trắng.
 * 2. **Việc lâu KHÔNG chờ trong Promise.** Tải 2,5 GB là nhiều phút. `cai()`
 *    trả về ngay, tiến độ chảy qua sự kiện `aiCucBo:tienDo`.
 * 3. **Tắt máy chủ khi app thoát.** `llama-server` là tiến trình CON nhưng nó
 *    không tự chết theo cha trên Windows. Bỏ bước này là để lại một tiến trình
 *    ăn 3,5 GB RAM sau khi người dùng đã đóng app — và họ sẽ không bao giờ
 *    đoán ra nó là của mình.
 */
import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';
import type { AiCucBoMa, AiCucBoTienDo, AiCucBoTinhTrang } from '../../shared/ipc';
import { MODEL } from '../aiCucBo/kho';
import {
  batModel, cai, datGoc, goSach, tatModel, tinhTrang, xoa,
} from '../aiCucBo/quanLy';
import { dangSan, hoiMay } from '../aiCucBo/hoi';
import { handle } from './index';

/** Lượt cài đang chạy. Chỉ cho phép MỘT — hai lượt cùng tải là tranh nhau đĩa. */
let dangCai: AbortController | null = null;

function baoTienDo(t: AiCucBoTienDo): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) w.webContents.send('aiCucBo:tienDo', t);
  }
}

function loiChu(e: unknown): string {
  const m = (e as Error)?.message;
  return typeof m === 'string' && m.trim() ? m : 'Lỗi không rõ.';
}

/** Sổ model rút gọn cho giao diện — renderer không phải chép cứng tên và cỡ. */
const khoChoGiaoDien = (): AiCucBoTinhTrang['kho'] => MODEL.map((m) => ({
  ma: m.ma,
  ten: m.ten,
  moTa: m.moTa,
  gb: Math.round((m.gb + (m.mmproj?.gb ?? 0)) * 100) / 100,
  ramGb: m.ramGb,
}));

export function dangKyAiCucBo(): void {
  /* Thư mục nằm trong `userData`, tức đi theo hồ sơ người dùng và KHÔNG bị
     xoá khi app tự cập nhật — 2,5 GB tải lại sau mỗi bản cập nhật là không
     chấp nhận được. */
  datGoc(join(app.getPath('userData'), 'ai-ngoai-tuyen'));

  handle('aiCucBo:tinhTrang', async (): Promise<AiCucBoTinhTrang> => {
    try {
      const t = await tinhTrang();
      return { ...t, kho: khoChoGiaoDien() };
    } catch {
      /* Máy quá lạ để quét được thì vẫn phải trả về một hình dạng hợp lệ:
         giao diện sẽ hiện "máy này chưa dùng được" thay vì màn trắng. */
      return {
        may: {
          nenTang: process.platform,
          kienTruc: process.arch,
          ramGb: 0,
          diaGb: 0,
          coGpu: false,
          chacChan: false,
          tenGpu: '',
        },
        khuyen: { nen: null, choPhep: [], vi: 'Chưa đọc được cấu hình máy này.' },
        coBoChay: false,
        daCo: [],
        dangChay: null,
        goc: null,
        kho: khoChoGiaoDien(),
      };
    }
  });

  handle('aiCucBo:cai', ({ ma }) => {
    if (dangCai) return { ok: false, loi: 'Đang có một lượt tải chạy rồi.' };
    const bo = new AbortController();
    dangCai = bo;

    /* CỐ Ý không `await`. Người dùng bấm "Tải" xong là màn hình phải phản hồi
       ngay; phần còn lại chảy qua sự kiện. */
    void cai({ ma: ma as AiCucBoMa, bao: baoTienDo, signal: bo.signal })
      .then(() => baoTienDo({ viec: 'Xong.', phanTram: 100, bps: 0, xong: { ok: true } }))
      .catch((e) => baoTienDo({
        viec: 'Dừng lại.', phanTram: 0, bps: 0, xong: { ok: false, loi: loiChu(e) },
      }))
      .finally(() => { if (dangCai === bo) dangCai = null; });

    return { ok: true };
  });

  handle('aiCucBo:huyCai', () => {
    dangCai?.abort();
    dangCai = null;
    return { ok: true };
  });

  handle('aiCucBo:bat', async ({ ma }) => {
    try {
      return { ok: true, goc: await batModel(ma as AiCucBoMa) };
    } catch (e) {
      return { ok: false, loi: loiChu(e) };
    }
  });

  handle('aiCucBo:tat', async () => {
    await tatModel().catch(() => {});
    return { ok: true };
  });

  handle('aiCucBo:xoa', async ({ ma }) => {
    try {
      await xoa(ma as AiCucBoMa);
      return { ok: true };
    } catch (e) {
      return { ok: false, loi: loiChu(e) };
    }
  });

  handle('aiCucBo:goSach', async () => {
    try {
      dangCai?.abort();
      dangCai = null;
      await goSach();
      return { ok: true };
    } catch (e) {
      return { ok: false, loi: loiChu(e) };
    }
  });

  handle('aiCucBo:hoi', async ({ chu, lichSu }) => {
    if (!dangSan()) return { chu: '', loi: 'AI trên máy chưa bật.' };
    const ra = await hoiMay({ chu, lichSu });
    return ra === null ? { chu: '', loi: 'AI trên máy không trả lời được.' } : { chu: ra };
  });

  /* ⚠️ Tắt máy chủ khi app đóng. `before-quit` chứ không phải
     `window-all-closed`: trên macOS đóng hết cửa sổ KHÔNG phải là thoát app,
     và tắt AI ở đó sẽ làm con robot mất trí nhớ mỗi lần người dùng đóng cửa
     sổ chính. */
  app.on('before-quit', () => {
    dangCai?.abort();
    void tatModel();
  });
}

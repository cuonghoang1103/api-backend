/**
 * Xưởng Remix — cầu IPC.
 *
 * Tệp này mỏng có chủ ý: mọi phần việc thật nằm ở `main/nhac/`, chỗ kiểm được
 * bằng vitest mà không cần dựng cả Electron. Ở đây chỉ còn ba việc mà chỗ kia
 * không làm được: biết `userData` ở đâu, bắn sự kiện tiến độ ra cửa sổ, và
 * canh cửa cho `shell.openPath`.
 */
import { BrowserWindow, app, dialog, shell } from 'electron';
import path from 'node:path';
import type { MucKhoModel } from '../../shared/ipc';
import { KHO_MODEL, napModelTuTep, taiModel, tinhTrangKho, xoaModel } from '../nhac/taiModel';
import {
  chinhVaXuat, donDep, donDepTatCa, huyTach, masterTheoMau, napBai, napBanMau,
  banGiao, phanTich, songBai, tach, thuMucPhien, tronStem,
} from '../nhac/xuong';
import { handle } from './index';

function userData(): string {
  return app.getPath('userData');
}

/**
 * Bắn tiến độ tới MỌI cửa sổ.
 *
 * Không nhắm vào cửa sổ gửi lệnh: người dùng có thể mở thêm cửa sổ, và tiến độ
 * của một việc chạy vài phút nên hiện ở chỗ nào họ đang nhìn.
 */
function banTienDo(payload: unknown): void {
  for (const w of BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) w.webContents.send('xuongRemix:tienDo', payload);
  }
}

/**
 * Chỉ cho mở thư mục NẰM TRONG vùng phiên của Xưởng Remix.
 *
 * `shell.openPath` mở bất cứ thứ gì hệ điều hành biết mở — đưa thẳng chuỗi của
 * renderer vào đó là trao cho nó quyền chạy một tệp bất kỳ trên máy. Schema zod
 * mới chỉ chặn được kiểu và độ dài; ràng buộc THẬT phải nằm ở đây.
 *
 * `path.resolve` trước khi so: không có nó thì `.../phien/../../..` vẫn qua
 * được phép so chuỗi đơn thuần.
 */
function duongAnToan(duong: string): string {
  const goc = path.resolve(thuMucPhien(userData()));
  const that = path.resolve(duong);
  if (that !== goc && !that.startsWith(goc + path.sep)) {
    throw new Error('Chỉ mở được thư mục kết quả của Xưởng Remix');
  }
  return that;
}

export function registerXuongRemixHandlers(): void {
  handle('xuongRemix:napBai', async ({ ten, mau, soKenh, tanSoMau }) =>
    napBai(userData(), ten, mau, soKenh, tanSoMau));

  handle('xuongRemix:phanTich', ({ id }) => phanTich(id));

  handle('xuongRemix:tach', async ({ id, maModel, soLuong }) => {
    const tt = (await tinhTrangKho(userData())).find((t) => t.ma === maModel);
    if (!tt?.coRoi) throw new Error(`Chưa tải model "${maModel}"`);
    return tach(userData(), id, tt.duongDan, banTienDo, soLuong);
  });

  handle('xuongRemix:huyTach', ({ id }) => huyTach(id));

  handle('xuongRemix:dongBai', ({ id }) => donDep(userData(), id));

  handle('xuongRemix:khoModel', async (): Promise<MucKhoModel[]> => {
    const tt = await tinhTrangKho(userData());
    return KHO_MODEL.map((m) => {
      const t = tt.find((x) => x.ma === m.ma);
      return {
        ma: m.ma,
        ten: m.ten,
        moTa: m.moTa,
        byteUocTinh: m.byteUocTinh,
        coRoi: t?.coRoi ?? false,
        byteThat: t?.byte ?? 0,
        coNguonTai: m.url !== null,
      };
    });
  });

  handle('xuongRemix:taiModel', ({ maModel }) =>
    taiModel(userData(), maModel, {
      tienDo: (t) => banTienDo({
        id: maModel,
        viec: 'taiModel',
        xong: t.daNhan,
        tong: t.tong,
      }),
    }));

  handle('xuongRemix:xoaModel', ({ maModel }) => xoaModel(userData(), maModel));

  /* Hộp thoại chạy ở MAIN, không ở renderer: renderer không được cấp quyền đọc
     đĩa, và đây là chỗ duy nhất người dùng chỉ định một tệp ngoài thư mục
     phiên. `napModelTuTep` kiểm nội dung trước khi nhận. */
  handle('xuongRemix:chonTepModel', async ({ maModel }) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Chọn tệp model .onnx',
      properties: ['openFile'],
      filters: [{ name: 'Model ONNX', extensions: ['onnx'] }],
    });
    if (canceled || !filePaths[0]) return null;
    const { byte } = await napModelTuTep(userData(), maModel, filePaths[0]);
    return { byte };
  });

  handle('xuongRemix:chinhVaXuat', ({ id, bpmDich, nuaCung }) =>
    chinhVaXuat(userData(), id, {
      ...(bpmDich === undefined ? {} : { bpmDich }),
      ...(nuaCung === undefined ? {} : { nuaCung }),
    }));

  handle('xuongRemix:napBanMau', ({ id, ten, mau, soKenh, tanSoMau }) =>
    napBanMau(id, ten, mau, soKenh, tanSoMau));

  handle('xuongRemix:master', ({ id, tranDbtp, khongKhopPho }) =>
    masterTheoMau(userData(), id, {
      ...(tranDbtp === undefined ? {} : { tranDbtp }),
      ...(khongKhopPho === undefined ? {} : { khongKhopPho }),
    }));

  /* `stem` đi thẳng vào `tron()` sau khi zod đã chặn từng con số. Không ép
     kiểu thêm ở đây: `tron()` tự lấp mọi trường thiếu bằng mặc định của stem
     đó, nên một object rỗng vẫn ra bản trộn đúng. */
  handle('xuongRemix:tron', ({ id, stem, nenTong, tranDbtp }) =>
    tronStem(userData(), id, {
      ...(stem === undefined ? {} : { stem }),
      ...(nenTong === undefined ? {} : { nenTong }),
      ...(tranDbtp === undefined ? {} : { tranDbtp }),
    }));

  /* CÙNG chốt đường dẫn với `moThuMuc`: chuỗi này đến từ renderer, và ở đây
     nó mở một tệp để đọc. `duongAnToan` giới hạn trong thư mục phiên của
     Xưởng Remix, nên không đọc trộm được gì ngoài kết quả của chính nó. */
  handle('xuongRemix:banGiao', ({ duong }) => banGiao(duongAnToan(duong)));

  handle('xuongRemix:song', ({ id, soCot }) => songBai(id, soCot));

  handle('xuongRemix:moThuMuc', async ({ duong }) => {
    const loi = await shell.openPath(duongAnToan(duong));
    if (loi) throw new Error(loi);
  });
}

/**
 * Xoá tệp tạm còn sót của những lần chạy trước. Gọi một lần lúc app khởi động.
 *
 * Bảng phiên nằm trong BỘ NHỚ, nên đóng app giữa chừng là mất đường tìm lại
 * các thư mục cũ — mỗi bài vài trăm MB nằm im trên đĩa mà không gì trỏ tới.
 */
export async function donDepLucKhoiDong(): Promise<void> {
  try {
    const so = await donDepTatCa(userData());
    if (so > 0) console.log(`[xưởng remix] dọn ${so} thư mục phiên cũ`);
  } catch (loi) {
    // Dọn dẹp hỏng thì KHÔNG được chặn app khởi động — cùng lắm là tốn đĩa.
    console.warn('[xưởng remix] dọn phiên cũ hỏng:', loi);
  }
}

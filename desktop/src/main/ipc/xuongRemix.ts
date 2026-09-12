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
import fsp from 'node:fs/promises';
import type { MauNhac, MucKhoModel } from '../../shared/ipc';
import { dsMau, themMau, thuMucKho, xoaMau } from '../nhac/khoMau';
import { KHO_MODEL, napModelTuTep, taiModel, tinhTrangKho, xoaModel } from '../nhac/taiModel';
import {
  chinhVaXuat, donDep, donDepTatCa, huyTach, masterTheoMau, napBai, napBanMau,
  banGiao, dsBaiTrongKho, dungMashup, phanTich, songBai, tach, thuMucPhien,
  tronStem, xuatTep,
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
  handle('xuongRemix:banGiao', ({ duong, cai }) => banGiao(duongAnToan(duong), cai));

  /* Cùng chốt đường dẫn, và ở đây nó còn GHI — nên `duongAnToan` không chỉ
     chặn đọc trộm mà còn chặn ghi đè ra ngoài thư mục phiên. */
  handle('xuongRemix:xuatTep', ({ duong, cai }) => xuatTep(duongAnToan(duong), cai));

  handle('xuongRemix:dsBai', () => dsBaiTrongKho());

  handle('xuongRemix:dsMau', () => dsMau(userData()));

  /* Hộp thoại chạy ở MAIN — renderer không được cấp quyền đọc đĩa, và đây là
     chỗ duy nhất của kho mẫu mà một đường dẫn ngoài thư mục app đi vào. Nhận
     NHIỀU tệp một lượt: người ta tải cả một gói loop về rồi thêm cả nắm, và
     giấy phép của cả nắm đó thường giống nhau. */
  handle('xuongRemix:themMau', async (meta) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Chọn tệp nhạc để thêm vào kho mẫu',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Tệp nhạc', extensions: ['wav', 'mp3', 'flac', 'm4a', 'aac', 'ogg', 'opus', 'aif', 'aiff'] }],
    });
    if (canceled || filePaths.length === 0) return null;
    const ra: MauNhac[] = [];
    for (const t of filePaths) {
      /* Một tệp hỏng không được làm hỏng cả nắm — người dùng chọn 20 tệp thì
         19 tệp lành phải vào được kho. */
      try {
        ra.push(await themMau(userData(), t, meta));
      } catch (loi) {
        console.warn('[kho mẫu] bỏ qua', t, loi);
      }
    }
    return ra;
  });

  handle('xuongRemix:xoaMau', ({ tep }) => xoaMau(userData(), tep));

  /* Đọc mẫu về renderer để nó nạp thành một BÀI trong xưởng. Đi qua `banGiao`
     nên nó cũng được đổi sang WAV 16-bit — nhưng `banGiao` chỉ đọc WAV, mà kho
     mẫu nhận cả mp3/flac. Nên ở đây trả BYTE THÔ và để renderer giải mã bằng
     Chromium, đúng phân vai "renderer giải mã, main tính toán" của `wav.ts`. */
  handle('xuongRemix:napMau', async ({ tep }) => {
    const an = path.basename(tep);
    const duong = path.join(thuMucKho(userData()), an);
    const tt = await fsp.stat(duong);
    if (tt.size > 300 * 1024 * 1024) throw new Error('Mẫu quá lớn');
    return {
      ten: an,
      byte: new Uint8Array(await fsp.readFile(duong)),
      giay: 0,          // renderer đo được sau khi giải mã
      mime: 'application/octet-stream',
    };
  });

  handle('xuongRemix:dungMashup', ({ bpm, chuAm, manh, ten, tranDbtp }) =>
    dungMashup(userData(), { bpm, chuAm, manh }, {
      ...(ten === undefined ? {} : { ten }),
      ...(tranDbtp === undefined ? {} : { tranDbtp }),
    }));

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

/**
 * ============================================================
 * HÀNG ĐỢI CÓ ƯU TIÊN CHO MÁY NHÀ (RTX 3060, Qwen3.5-9B)
 * ============================================================
 *
 * ⚠️ ĐÔNG NGƯỜI KHÔNG LÀM TRÀN VRAM. NÓ LÀM DÀI HÀNG ĐỢI.
 *
 * `llama.cpp` cấp phát KV cache MỘT LẦN lúc khởi động rồi khoá cứng. Đo
 * 14/08/2026 trên máy nhà: `llama-server` giữ đúng **5.812 MiB đứng yên**,
 * `total_slots = 1`, `n_ctx = 32768`. Con số đó không nhúc nhích dù một
 * người gọi hay một trăm người gọi — người thứ hai KHÔNG cấp thêm một byte
 * nào, họ xếp hàng. Tràn VRAM chỉ xảy ra lúc KHỞI ĐỘNG nếu đặt `-c` quá to,
 * và lúc đó tiến trình chết ngay tại chỗ, thấy liền.
 *
 * Cái thật sự hỏng là ĐỘ TRỄ. Bắn 4 lượt cùng lúc vào máy nhà, mỗi lượt
 * sinh 180 token:
 *
 *     1 người một mình →  3,36 giây
 *     4 người cùng lúc →  3,36 · 6,72 · 10,11 · 13,48 giây
 *
 * Đúng bội số của 3,36 — FIFO thuần, `--parallel 1`, một luồng. Nghĩa là
 * ba khách vừa bấm chat trước thì ROBOT là người thứ tư và **câm 13,5
 * giây**. Không lỗi, không cảnh báo, chỉ đứng im. Với robot thì 13 giây im
 * lặng còn tệ hơn hẳn một câu báo lỗi.
 *
 * File này là chốt chặn cho đúng chuyện đó, hai lớp:
 *
 *   LỚP 1 — Hàng đợi có ưu tiên. Robot chen ĐẦU hàng, luôn. Người dùng web
 *           xếp sau, việc chạy nền xếp bét.
 *   LỚP 2 — Tràn sang cổng. Hàng đầy / chờ quá lâu / robot đang giữ máy ⇒
 *           lượt đó KHÔNG chờ, nó đi thẳng modelapi.vn. Người dùng chỉ thấy
 *           giọng văn hơi khác, không thấy đơ.
 *
 * ⚠️ Lớp 2 mới là lớp gánh phần "nhiều người dùng cùng lúc". Lớp 1 một mình
 * chỉ sắp lại thứ tự chờ — vẫn là chờ. Chỉ khi có đường tràn thì hàng đợi
 * mới không bao giờ dài ra được.
 *
 * ⚠️ Bộ đếm này nằm TRONG TIẾN TRÌNH. Một tiến trình backend (hiện tại là
 * đúng một container `cuonghoangdev_backend`) thì nó là sự thật. Chạy nhiều
 * bản backend song song thì mỗi bản đếm riêng và tổng có thể vượt số slot —
 * hậu quả chỉ là xếp hàng ở tầng llama.cpp, tức đúng bằng hành vi hôm nay,
 * không tệ hơn. Muốn chính xác tuyệt đối thì phải đếm ở Redis, chưa cần.
 *
 * Xem thêm `endpointFor()` / `xinDiemCuoi()` trong `gateway.ts`.
 */

import { logger } from '../../utils/logger.js';

/**
 * Ai được chen trước ai.
 *  • `robot`  — Maker Lab. Người ta đang ĐỨNG TRƯỚC MẶT nó và chờ nó đáp.
 *  • `nguoi`  — có người bấm nút và đang nhìn màn hình.
 *  • `nen`    — sinh nội dung hàng loạt, bản tin sáng. Không ai ngồi xem.
 */
export type MucUuTien = 'robot' | 'nguoi' | 'nen';

export type LyDoTuChoi =
  | 'robot-giu'     // robot vừa nói xong, máy nhà còn để dành cho nó
  | 'day-hang'      // hàng đã dài quá mức
  | 'cho-qua-lau'   // đã xếp hàng nhưng quá trần chờ
  | 'nen-nhuong';   // việc chạy nền gặp máy đang bận thì nhường luôn

export interface Ve {
  /** `true` = được dùng máy nhà. `false` = hãy đi cổng, ĐỪNG chờ. */
  duoc: boolean;
  lyDo?: LyDoTuChoi;
  /** Đã nằm trong hàng bao lâu (ms). */
  choMs: number;
  /**
   * Trả slot. **BẮT BUỘC gọi**, kể cả khi lượt gọi hỏng — nên luôn đặt trong
   * `finally`. Quên gọi một lần là slot đó mất vĩnh viễn cho tới khi restart.
   * Gọi nhiều lần thì an toàn (lần thứ hai trở đi không làm gì).
   */
  tra: () => void;
}

// ─── Cấu hình: đọc lúc GỌI, không phải lúc nạp module ──────────────
//
// Đọc lúc nạp module nghĩa là đổi biến trên VPS phải restart container mới
// ăn. Đọc lúc gọi thì sửa `.env` + recreate là đủ, và trang quản trị đọc ra
// đúng cái đang chạy chứ không phải cái lúc khởi động.

/** Phải KHỚP với `--parallel` của llama-server. Đặt cao hơn là tự dối mình. */
function soSlot(): number {
  const n = Number(process.env.LLM_LOCAL_SLOTS ?? 1);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/** Hàng dài hơn ngần này thì người đến sau đi thẳng ra cổng. 0 = không xếp hàng. */
function hangToiDa(): number {
  const n = Number(process.env.LLM_LOCAL_HANG_TOI_DA ?? 1);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 1;
}

/**
 * Trần chờ.
 *
 * ⚠️ MÁY NHÀ KHÔNG NHANH HƠN CỔNG Ở VIỆC CỦA WEB. Đây là chỗ dễ đặt sai
 * nhất, nên nói thẳng: 9B chạy 55 token/s, một câu trả lời web 180 token mất
 * **3,4 giây** — trong khi cổng trả `gpt-5.4-mini` trong ~1,3s và `gpt-5.5`
 * trong ~2,4s. Máy nhà thắng ở chỗ **miễn phí**, không phải ở chỗ nhanh.
 * (Robot thì ngược lại và thắng đậm: câu ngắn, 0,65s so với 4,2s.)
 *
 * Hệ quả cho con số này: chờ rồi VẪN phải đi cổng là kết cục tệ nhất — mất
 * cả quãng chờ lẫn tiền. Đo 14/08/2026 với trần cũ 1,5s, 5 khách cùng lúc:
 * hai người chờ đủ 1.500ms rồi vẫn bị đẩy ra cổng, tức tổng của họ thành
 * ~3,9s thay vì ~2,4s nếu đi thẳng. Trần phải NHỎ hơn hẳn một lượt sinh
 * (3,4s) để phép cược đó rẻ: 600ms chỉ đặt cược ~18% thời gian một lượt, và
 * nó vẫn vớt được đúng ca đáng vớt — người phía trước sắp xong tới nơi.
 *
 * Robot ngược hẳn: 8 giây. Chênh lệch 0,65s với 4,2s lớn tới mức chờ gần
 * như luôn đáng, và robot vốn hiếm khi phải chờ nhờ cửa sổ giữ chỗ bên dưới.
 */
function choToiDaMs(uuTien: MucUuTien): number {
  const raw = uuTien === 'robot' ? process.env.LLM_ROBOT_CHO_MS : process.env.LLM_LOCAL_CHO_MS;
  const macDinh = uuTien === 'robot' ? 8_000 : 600;
  const n = Number(raw ?? macDinh);
  return Number.isFinite(n) && n >= 0 ? n : macDinh;
}

/**
 * ⭐ ĐÂY LÀ CHỐT LÀM CHO ROBOT KHÔNG BAO GIỜ PHẢI CHỜ.
 *
 * Sau mỗi lượt robot, máy nhà được GIỮ cho robot thêm ngần này. Trong cửa
 * sổ đó, mọi lượt web đi thẳng ra cổng — không xếp hàng, không tranh slot.
 *
 * Vì sao cần: xếp hàng ưu tiên một mình vẫn để robot chờ HẾT lượt đang chạy
 * dở của người khác (3,36s đo được). Không cắt ngang giữa chừng được — huỷ
 * một lượt sinh dở vừa phí công vừa để người kia mất câu trả lời. Nên chặn
 * từ đầu vào: lúc robot đang nói chuyện thì đừng cho ai vào máy nữa.
 *
 * 20 giây ≈ một nhịp hội thoại người-robot (nghe → nghĩ → nói → nghe tiếp).
 * Đặt 0 để tắt hẳn phép giữ chỗ này.
 */
function robotGiuMs(): number {
  const n = Number(process.env.LLM_ROBOT_GIU_MS ?? 20_000);
  return Number.isFinite(n) && n >= 0 ? n : 20_000;
}

// ─── Trạng thái ────────────────────────────────────────────────────

interface ChoDoi {
  uuTien: MucUuTien;
  vaoLuc: number;
  /** Đã được đánh thức (hoặc đã hết giờ) chưa — chống mở khoá hai lần. */
  xong: boolean;
  moKhoa: (duoc: boolean) => void;
  hetGio: ReturnType<typeof setTimeout> | null;
}

let _dangChay = 0;
let _robotGanNhat = 0;
const _hang: ChoDoi[] = [];

const _dem = {
  xin: { robot: 0, nguoi: 0, nen: 0 } as Record<MucUuTien, number>,
  duoc: { robot: 0, nguoi: 0, nen: 0 } as Record<MucUuTien, number>,
  tuChoi: {} as Record<string, number>,
  choTongMs: 0,
  choSoLuot: 0,
};

// ─── Cửa chính ─────────────────────────────────────────────────────

/**
 * Xin một chỗ trên máy nhà.
 *
 * KHÔNG bao giờ ném lỗi và KHÔNG bao giờ treo vô hạn: xấu nhất là trả về
 * `duoc: false` để lượt gọi đi cổng. Hàm này không biết gì về env định
 * tuyến — người gọi tự quyết máy nhà có phải ứng viên hay không (xem
 * `xinDiemCuoi()` trong `gateway.ts`).
 */
export async function xinSlot(uuTien: MucUuTien): Promise<Ve> {
  const batDau = Date.now();
  _dem.xin[uuTien] += 1;

  if (uuTien === 'robot') _robotGanNhat = batDau;

  // ── LỚP 2: mấy phép từ chối SỚM, không tốn một mili giây chờ nào ──
  if (uuTien !== 'robot') {
    const giu = robotGiuMs();
    if (giu > 0 && _robotGanNhat > 0 && batDau - _robotGanNhat < giu) {
      return tuChoi('robot-giu', 0);
    }
    // Việc chạy nền gặp máy đang bận thì nhường thẳng, không xếp hàng: nó
    // chạy lúc không ai ngồi xem, chậm vài giây không ai biết, nhưng nó mà
    // chiếm slot thì người đang nhìn màn hình phải chờ.
    if (uuTien === 'nen' && (_dangChay > 0 || _hang.length > 0)) {
      return tuChoi('nen-nhuong', 0);
    }
  }

  // ── Còn chỗ trống thì đi luôn ──
  //
  // ⚠️ Phép này phải đứng TRƯỚC phép đo độ dài hàng. Bản đầu đặt ngược lại
  // và bộ kiểm bắt được ngay: `LLM_LOCAL_HANG_TOI_DA=0` khi đó thành
  // `0 >= 0` ⇒ từ chối SẠCH mọi lượt, kể cả lúc máy đang rảnh không có ai.
  // Tức là một biến nghĩa là "đừng xếp hàng" lại âm thầm TẮT HẲN máy nhà,
  // và triệu chứng bên ngoài chỉ là "sao chẳng có việc nào chạy cục bộ nữa".
  if (_dangChay < soSlot()) {
    _dangChay += 1;
    return veThat(uuTien, 0);
  }

  // ── Máy bận: hàng dài quá thì đi cổng luôn, đừng nối đuôi ──
  // Đặt 0 = "không bao giờ xếp hàng, nhưng máy rảnh thì vẫn dùng".
  if (uuTien !== 'robot' && _hang.length >= hangToiDa()) {
    return tuChoi('day-hang', 0);
  }

  // ── Hết chỗ: xếp hàng ──
  return new Promise<Ve>((resolve) => {
    const cho: ChoDoi = {
      uuTien,
      vaoLuc: batDau,
      xong: false,
      moKhoa: () => {},
      hetGio: null,
    };

    cho.moKhoa = (duoc: boolean) => {
      if (cho.xong) return;
      cho.xong = true;
      if (cho.hetGio) clearTimeout(cho.hetGio);
      const choMs = Date.now() - batDau;
      if (duoc) {
        _dangChay += 1;
        resolve(veThat(uuTien, choMs));
      } else {
        boKhoiHang(cho);
        resolve(tuChoi('cho-qua-lau', choMs));
      }
    };

    // ⚠️ TUYỆT ĐỐI KHÔNG `unref()` phép hết giờ này.
    //
    // Bản đầu có `unref()` cho "gọn khi tắt tiến trình". Bộ kiểm bắt được
    // ngay: timer đã `unref` thì event-loop rảnh là nó KHÔNG NỔ, nên lời hứa
    // này không bao giờ được giải — người gọi treo vĩnh viễn thay vì tràn
    // sang cổng sau 1,5 giây. Đúng cái mà cả file này sinh ra để chống.
    // Đổi lại: lúc tắt tiến trình có thể chậm tối đa bằng trần chờ (≤8s).
    // Rẻ hơn nhiều so với một lời gọi treo không có đáy.
    cho.hetGio = setTimeout(() => cho.moKhoa(false), choToiDaMs(uuTien));

    // ⭐ LỚP 1: robot chen lên trước MỌI người thường, nhưng xếp sau các
    // robot đã đứng đó (giữa các robot với nhau vẫn công bằng theo thứ tự).
    if (uuTien === 'robot') {
      const i = _hang.findIndex((c) => c.uuTien !== 'robot');
      if (i < 0) _hang.push(cho);
      else _hang.splice(i, 0, cho);
    } else {
      _hang.push(cho);
    }
  });
}

function veThat(uuTien: MucUuTien, choMs: number): Ve {
  _dem.duoc[uuTien] += 1;
  _dem.choTongMs += choMs;
  _dem.choSoLuot += 1;

  let daTra = false;
  return {
    duoc: true,
    choMs,
    tra: () => {
      // ⚠️ Chống gọi hai lần. Gọi `tra()` hai lần cho một vé sẽ trừ
      // `_dangChay` xuống dưới số thật, rồi hàng đợi thả nhiều hơn số slot
      // — hỏng âm thầm và chỉ lộ ra dưới tải.
      if (daTra) return;
      daTra = true;
      _dangChay = Math.max(0, _dangChay - 1);
      // Cửa sổ giữ chỗ tính từ lúc robot nói XONG, không phải lúc nó bắt
      // đầu: một lượt robot kéo dài mấy giây, tính từ lúc bắt đầu là cửa sổ
      // đã hụt mất đúng phần thời gian nó đang bận.
      if (uuTien === 'robot') _robotGanNhat = Date.now();
      goiNguoiTiepTheo();
    },
  };
}

function tuChoi(lyDo: LyDoTuChoi, choMs: number): Ve {
  _dem.tuChoi[lyDo] = (_dem.tuChoi[lyDo] ?? 0) + 1;
  return { duoc: false, lyDo, choMs, tra: () => {} };
}

function boKhoiHang(cho: ChoDoi): void {
  const i = _hang.indexOf(cho);
  if (i >= 0) _hang.splice(i, 1);
}

function goiNguoiTiepTheo(): void {
  while (_dangChay < soSlot()) {
    const cho = _hang.shift();
    if (!cho) return;
    if (cho.xong) continue; // đã hết giờ và tự rút — bỏ qua, lấy người kế
    cho.moKhoa(true); // hàm này tự tăng `_dangChay`, nên vòng lặp dừng đúng lúc
  }
}

// ─── Cho trang quản trị ────────────────────────────────────────────

/**
 * Ảnh chụp tức thời. Dùng ở `GET /api/v1/ai/admin/llm-config` — không có
 * chỗ này thì không ai biết máy nhà đang nghẽn hay đang rảnh, và "web chậm"
 * với "máy nhà bận" trông giống hệt nhau từ phía ngoài.
 */
export function thongKe(): Record<string, unknown> {
  const giu = robotGiuMs();
  return {
    slots: soSlot(),
    dangChay: _dangChay,
    dangDoi: _hang.length,
    hangToiDa: hangToiDa(),
    robotGiuConMs:
      giu > 0 && _robotGanNhat > 0 ? Math.max(0, giu - (Date.now() - _robotGanNhat)) : 0,
    tranChoMs: { robot: choToiDaMs('robot'), web: choToiDaMs('nguoi') },
    daXin: { ..._dem.xin },
    daVao: { ..._dem.duoc },
    daDayRaCong: { ..._dem.tuChoi },
    choTrungBinhMs: _dem.choSoLuot ? Math.round(_dem.choTongMs / _dem.choSoLuot) : 0,
    ghiChu:
      'daDayRaCong = số lượt KHÔNG chờ mà đi thẳng modelapi.vn. Con số này lớn ' +
      'là bình thường và là dấu hiệu tốt — nó chính là thứ giữ cho web không đơ ' +
      'khi máy nhà bận. Chỉ lo khi `dangDoi` thường xuyên chạm `hangToiDa`.',
  };
}

/** Cho test và cho lệnh quản trị: xoá sạch bộ đếm, KHÔNG đụng tới hàng đang chờ. */
export function xoaDem(): void {
  _dem.xin = { robot: 0, nguoi: 0, nen: 0 };
  _dem.duoc = { robot: 0, nguoi: 0, nen: 0 };
  _dem.tuChoi = {};
  _dem.choTongMs = 0;
  _dem.choSoLuot = 0;
  logger.info('LLM hàng đợi: đã xoá bộ đếm');
}

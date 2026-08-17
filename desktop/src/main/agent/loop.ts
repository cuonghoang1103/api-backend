/**
 * ============================================================
 * VÒNG LẶP AGENT — chạy ở MAIN process
 * ============================================================
 *
 *   renderer ──IPC──▶ main ──SSE──▶ backend ──▶ cổng LLM
 *                      │
 *                      └─ chạy tool đọc file, đẩy kết quả vào, gọi lại
 *
 * Renderer KHÔNG tham gia vòng lặp; nó chỉ nhận sự kiện để vẽ. Nếu vòng lặp
 * sống ở renderer thì mỗi kết quả tool phải qua IPC hai lần, và một lần
 * chuyển trang là mất cả phiên đang chạy dở.
 *
 * ─── BỐN GIÁ TRỊ `stop`, PHẢI XỬ LÝ ĐỦ CẢ BỐN ───
 *   'end'        xong → chờ người dùng gõ tiếp
 *   'tool_calls' chạy tool → nối kết quả → gọi lại
 *   'continue'   KHÔNG có tool nào để chạy, cứ gọi lại ngay
 *   'max_steps'  chạm trần bước → dừng hẳn
 *
 * `'continue'` là cái dễ quên nhất, và quên nó thì agent đứng im vĩnh viễn ở
 * đúng chỗ đó. Backend cố ý tách nó khỏi `'tool_calls'` chính vì bộ kiểm thử
 * đầu tiên đã dính (xem ghi chú trong `src/services/agent/turn.ts`).
 */
import { API_ORIGIN } from '../config';
import { readStoredSession } from '../ipc/auth';
import type { KetQuaDiff } from './diff';
import { docGhiChuDuAn } from './ghiChu';
import { luuPhien, type TinNhanLuu } from './phien';
import type { PhanLoaiLenh } from './lenh';
import { chayToolAgent, soFileDaSua } from './tools';
import { taoSoCuoc, type SoCuoc } from './so';
import { huyTatCa, type YeuCauXinPhep } from './xinPhep';

/** Trần vòng lặp phía app. RỘNG HƠN trần bước của máy chủ (30) để máy chủ mới là bên nói dừng. */
const MAX_VONG = 40;

/** Sự kiện đẩy lên renderer. Đây là thứ giao diện vẽ. */
export type SuKienAgent =
  | { loai: 'batDau'; model: string }
  | { loai: 'chu'; delta: string }
  /** Một tool vừa chạy xong (bất kể vòng 1 hay vòng 2) — để hiện dòng tiến trình. */
  | { loai: 'tool'; ten: string; tomTat: string; vong: 'may' | 'notes' }
  /** Vòng lặp ĐANG DỪNG chờ người dùng duyệt. Giao diện phải hiện thẻ diff. */
  | { loai: 'xinPhep'; id: string; ten: string; duongDan: string; taoMoi: boolean; diff: KetQuaDiff }
  /** Thẻ duyệt đã được trả lời (hoặc hết giờ) — giao diện gỡ nó đi. */
  | { loai: 'xongXinPhep'; id: string; dongY: boolean }
  | { loai: 'xinPhepLenh'; id: string; lenh: string; phanLoai: PhanLoaiLenh }
  | { loai: 'lenhRa'; mau: string }
  | { loai: 'keHoach'; viec: Array<{ ten: string; trangThai: string }> }
  | { loai: 'xong'; hanMuc: HanMucUi | null; tienUsd: number; daLuoc: number; soFileDaSua: number }
  | { loai: 'loi'; thongDiep: string; ma?: string }
  | { loai: 'huy' };

export interface HanMucUi {
  daDung: number;
  tran: number;
  phanTram: number;
  hoiLucNao: string | null;
}

interface TinNhan {
  role: 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

export interface BoiCanh {
  /** Thư mục dự án, hoặc null nếu chưa chọn. */
  goc: string | null;
  nhanh?: string;
  /** Người dùng đã bật chế độ cho sửa file chưa. Mặc định KHÔNG. */
  choSua?: boolean;
  /** Người dùng đã bật chế độ cho chạy lệnh chưa. Mặc định KHÔNG. */
  choChayLenh?: boolean;
  /** 'nhanh' | 'canBang' | 'ky'. Quyết định trần bước ở máy chủ. */
  mucNoLuc?: string;
}

/**
 * Hội thoại sống trong main, không phải renderer.
 *
 * Renderer chỉ giữ bản để HIỂN THỊ. Hai bản này khác nhau: bản dưới đây mang
 * `tool_calls` và `tool_call_id` — thứ giao thức cần nhưng người dùng không
 * bao giờ nhìn thấy.
 */
/**
 * MỘT CUỘC HỘI THOẠI đang mở.
 *
 * Trước khi có nhiều tab, tất cả những thứ dưới đây là biến module. Đúng khi
 * chỉ có một cuộc, và sai CÂM LẶNG ngay khi có hai: lượt đang chạy ở tab A ghi
 * kết quả vào hội thoại mà tab B vừa chuyển sang, nút Hoàn tác lùi nhầm file,
 * quyền cấp ở tab này tự áp cho tab kia.
 */
interface CuocHoiThoai {
  /** Id của TAB. Ổn định suốt đời tab — React key theo nó, đổi là remount. */
  id: string;
  /**
   * Id của PHIÊN trên đĩa. Tách khỏi `id` có chủ ý.
   *
   * Mở một phiên cũ vào tab đang có thì tab KHÔNG được đổi id: `key={id}` ở
   * renderer khiến React remount component và xoá sạch bảng ghi vừa nạp — đúng
   * lỗi đã dính khi thêm nhiều tab. Nên tab giữ id của nó, chỉ đổi chỗ nó ghi
   * xuống đĩa.
   */
  phienId: string;
  hoiThoai: TinNhan[];
  duAn: string | null;
  dangChay: AbortController | null;
  so: SoCuoc;
}

const cuoc = new Map<string, CuocHoiThoai>();

function layCuoc(id: string): CuocHoiThoai {
  let c = cuoc.get(id);
  if (!c) {
    c = { id, phienId: id, hoiThoai: [], duAn: null, dangChay: null, so: taoSoCuoc() };
    cuoc.set(id, c);
  }
  return c;
}

/** Sinh id cho một cuộc mới. Cũng chính là id phiên lưu xuống đĩa. */
export function taoCuoc(): string {
  const id = `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
  layCuoc(id);
  return id;
}

/**
 * Xoá nội dung MỌI cuộc đang mở.
 *
 * Dùng khi đổi thư mục dự án: bối cảnh cũ hỏng với TẤT CẢ các tab, không chỉ
 * tab đang nhìn. Giữ lại thì agent ở tab bên cạnh vẫn tin vào những file nó đọc
 * ở dự án TRƯỚC và trả lời về một dự án không còn mở.
 */
export function xoaMoiCuoc(): void {
  for (const [id] of cuoc) xoaHoiThoai(id);
}

export function dongCuoc(id: string): void {
  huyLuotCua(id);
  cuoc.delete(id);
}

/** Nạp một phiên cũ thành một cuộc đang mở. Gõ tiếp là đi tiếp việc đó. */
export function napPhien(cuocId: string, phienId: string, tinNhan: TinNhanLuu[], duAn: string | null): void {
  const c = layCuoc(cuocId);
  huyLuotCua(cuocId);
  c.phienId = phienId;
  c.hoiThoai = tinNhan as TinNhan[];
  c.duAn = duAn;
  // Quyền đã cấp và nhật ký hoàn tác KHÔNG khôi phục theo. Hoàn tác một thay
  // đổi từ hôm qua là ghi đè lên thứ người dùng có thể đã sửa tiếp bằng tay; và
  // quyền "cho phép cả file này" cấp cho phiên trước thì hết hiệu lực cùng
  // phiên đó — mở lại là một lần ngồi xuống mới.
  c.so = taoSoCuoc();
}

export function soCuaCuoc(id: string): SoCuoc {
  return layCuoc(id).so;
}

export function soFileDaSuaCua(id: string): number {
  return soFileDaSua(layCuoc(id).so);
}

/** Có cuộc nào đang chạy không — dùng để chặn đổi quyền giữa chừng. */
export function coCuocDangChay(): boolean {
  for (const [, c] of cuoc) if (c.dangChay) return true;
  return false;
}

export function cuocDangChay(id: string): boolean {
  return layCuoc(id).dangChay !== null;
}

/** Xoá nội dung một cuộc nhưng giữ nó mở (nút "việc mới" trong cùng tab). */
export function xoaHoiThoai(id: string): void {
  const c = layCuoc(id);
  huyLuotCua(id);
  c.hoiThoai = [];
  c.duAn = null;
  // Việc mới trong cùng tab ⇒ phiên mới. Giữ `phienId` cũ là ghi đè lên việc
  // trước bằng một hội thoại rỗng.
  c.phienId = c.id;
  // Bắt đầu việc mới ⇒ quên quyền đã cấp và quên nhật ký hoàn tác. Quyền
  // "cho phép cả file này" được cấp cho MỘT việc, không phải cấp vĩnh viễn;
  // và giữ nhật ký cũ lại thì nút Hoàn tác sẽ lùi cả những thay đổi thuộc
  // việc trước mà người dùng đã chấp nhận xong xuôi.
  c.so = taoSoCuoc();
}

/** Người dùng bấm dừng ở một cuộc cụ thể. */
export function huyLuotCua(id: string): void {
  const c = cuoc.get(id);
  if (!c) return;
  c.dangChay?.abort();
  c.dangChay = null;
  // Thẻ duyệt đang mở phải được giải phóng, nếu không vòng lặp treo mãi ở
  // `await hoiNguoiDung()` dù lượt đã bị huỷ.
  //
  // ⚠️ `huyTatCa()` huỷ MỌI thẻ đang treo, kể cả của cuộc khác. Chấp nhận được
  // vì chỉ MỘT cuộc chạy tại một thời điểm (xem `chayLuot`), nên không bao giờ
  // có hai thẻ của hai cuộc cùng treo.
  huyTatCa();
}

/**
 * Một lượt người dùng: nhận câu hỏi, chạy tới khi agent trả lời xong.
 *
 * `phat` được gọi nhiều lần trong suốt quá trình — đây là hàm chạy lâu (hàng
 * chục giây tới vài phút), không phải một lời gọi request/response.
 */
export async function chayLuot(
  cuocId: string,
  cauHoi: string,
  boiCanh: BoiCanh,
  phat: (e: SuKienAgent) => void,
): Promise<void> {
  const c = layCuoc(cuocId);
  if (c.dangChay) throw new Error('Việc này đang chạy dở. Hãy dừng nó trước.');
  /**
   * CHỈ MỘT cuộc chạy tại một thời điểm, dù mở bao nhiêu tab.
   *
   * Không phải vì khó làm — mà vì hai agent chạy cùng lúc trên CÙNG một thư mục
   * dự án là công thức của tai nạn: cái này sửa file cái kia vừa đọc, hai thẻ
   * duyệt chen nhau trên màn hình, và hạn mức tiêu gấp đôi mà không ai để ý.
   * Mở nhiều tab để CHUYỂN QUA LẠI và đọc lại việc cũ; chạy thì lần lượt.
   */
  if (coCuocDangChay()) {
    throw new Error('Một việc khác đang chạy. Hãy đợi hoặc dừng nó trước — mỗi lúc chỉ chạy được một việc.');
  }

  const phien = readStoredSession();
  if (!phien) {
    phat({ loai: 'loi', thongDiep: 'Chưa đăng nhập.', ma: 'NO_SESSION' });
    return;
  }

  const dieuKhien = new AbortController();
  c.dangChay = dieuKhien;
  c.hoiThoai.push({ role: 'user', content: cauHoi });
  if (!c.duAn && boiCanh.goc) c.duAn = tenThuMuc(boiCanh.goc);

  // Chỉ khai báo khả năng khi THẬT SỰ có thư mục. Khai bừa thì máy chủ đưa tool
  // đọc file cho model, model gọi, và app trả lỗi ở mọi lời gọi — agent quay
  // vòng trong một việc nó không bao giờ làm được.
  //
  // `fs_write` thêm vào chỉ khi người dùng đã BẬT chế độ sửa. Không bật thì máy
  // chủ không đưa tool sửa cho model, nên model không thể gọi thứ nó sẽ bị từ
  // chối — im lặng bỏ qua ở phía app thì model cứ thử lại mãi.
  const capabilities: string[] = [];
  if (boiCanh.goc) {
    capabilities.push('fs_read', 'git_read', 'plan');
    if (boiCanh.choSua) capabilities.push('fs_write');
    if (boiCanh.choChayLenh) capabilities.push('shell');
  }

  // Đọc LẠI ở mỗi lượt người dùng gõ — xem ghi chú đầu `ghiChu.ts`. Đọc một
  // lần cho cả lượt là đủ: trong cùng một lượt agent không sửa file này, và đọc
  // lại ở từng vòng chỉ thêm I/O không đổi gì.
  const ghiChuDuAn = boiCanh.goc ? await docGhiChuDuAn(boiCanh.goc) : null;
  if (ghiChuDuAn) {
    phat({ loai: 'tool', ten: ghiChuDuAn.ten, tomTat: 'quy ước dự án', vong: 'may' });
  }

  let daThuLai = false;

  try {
    for (let vong = 0; vong < MAX_VONG; vong++) {
      if (dieuKhien.signal.aborted) { phat({ loai: 'huy' }); return; }

      const phanHoi = await mgoiMotLuot({
        token: phien.sessionToken,
        messages: c.hoiThoai,
        capabilities,
        ...(boiCanh.goc
          ? {
              workspace: {
                name: tenThuMuc(boiCanh.goc),
                platform: process.platform as string,
                ...(boiCanh.nhanh ? { branch: boiCanh.nhanh } : {}),
              },
            }
          : {}),
        ...(ghiChuDuAn ? { ghiChuDuAn } : {}),
        ...(boiCanh.mucNoLuc ? { mucNoLuc: boiCanh.mucNoLuc } : {}),
        signal: dieuKhien.signal,
        phat,
      });

      if (!phanHoi.ok) {
        if (MA_DANG_THU_LAI.has(phanHoi.ma) && !daThuLai) {
          daThuLai = true;
          phat({ loai: 'tool', ten: 'kết nối', tomTat: 'đứt giữa chừng — đang thử lại', vong: 'may' });
          vong--; // lần thử lại không tính là một vòng
          continue;
        }
        phat({ loai: 'loi', thongDiep: phanHoi.thongDiep, ma: phanHoi.ma });
        return;
      }
      const ketQua = phanHoi.ketQua;
      // Đi được một bước ⇒ nạp lại quyền thử lại. "Một lần" là một lần cho MỖI
      // chỗ kẹt, không phải một lần cho cả việc — việc 20 bước mà đứt ở bước 3
      // rồi lại đứt ở bước 17 là hai sự cố khác nhau.
      daThuLai = false;

      c.hoiThoai.push(...ketQua.append);

      if (ketQua.stop === 'end' || ketQua.stop === 'max_steps') {
        phat({
          loai: 'xong', hanMuc: ketQua.quota, tienUsd: ketQua.costUsd,
          daLuoc: ketQua.daLuoc, soFileDaSua: soFileDaSua(c.so),
        });
        return;
      }

      // 'tool_calls' → chạy; 'continue' → không có gì để chạy, vòng lại ngay.
      for (const goi of ketQua.toolCalls) {
        if (dieuKhien.signal.aborted) { phat({ loai: 'huy' }); return; }

        // Bối cảnh ghi chỉ dựng khi người dùng đã bật chế độ sửa. Không bật thì
        // `chayToolAgent` nhận `undefined` và tự trả lỗi cho model.
        const boiCanhGhi = boiCanh.choSua
          ? {
              signal: dieuKhien.signal,
              so: c.so,
              xinPhep: (y: YeuCauXinPhep & { diff: KetQuaDiff; taoMoi: boolean }) =>
                phat({ loai: 'xinPhep', id: y.id, ten: y.ten, duongDan: y.duongDan, taoMoi: y.taoMoi, diff: y.diff }),
            }
          : undefined;

        // Bối cảnh LỆNH tách riêng khỏi bối cảnh GHI: hai quyền bật độc lập,
        // nên bật "cho sửa" không được kéo theo "cho chạy lệnh".
        const boiCanhLenh = boiCanh.choChayLenh
          ? {
              signal: dieuKhien.signal,
              so: c.so,
              xinPhepLenh: (y: YeuCauXinPhep & { phanLoai: PhanLoaiLenh }) =>
                phat({ loai: 'xinPhepLenh', id: y.id, lenh: y.duongDan, phanLoai: y.phanLoai }),
              onRa: (mau: string) => phat({ loai: 'lenhRa', mau }),
            }
          : undefined;

        const boiCanhKeHoach = {
          keHoach: (viec: Array<{ ten: string; trangThai: string }>) => phat({ loai: 'keHoach', viec }),
        };

        const kq = boiCanh.goc
          ? await chayToolAgent(boiCanh.goc, goi.name, goi.args, boiCanhGhi, boiCanhLenh, boiCanhKeHoach)
          : { noiDung: 'LỖI: người dùng chưa chọn thư mục dự án nào.', tomTat: 'chưa mở dự án' };
        c.hoiThoai.push({ role: 'tool', tool_call_id: goi.id, content: kq.noiDung });
        phat({ loai: 'tool', ten: goi.name, tomTat: kq.tomTat, vong: 'may' });
      }
    }

    phat({ loai: 'loi', thongDiep: `Quá ${MAX_VONG} vòng mà chưa xong. Hãy hỏi câu hẹp hơn.`, ma: 'MAX_ROUNDS' });
  } catch (err) {
    if (dieuKhien.signal.aborted) phat({ loai: 'huy' });
    else phat({ loai: 'loi', thongDiep: (err as Error).message || 'Lỗi không rõ.' });
  } finally {
    if (c.dangChay === dieuKhien) c.dangChay = null;
    // Lưu ở `finally`, KHÔNG ở nhánh thành công. Lượt hỏng giữa chừng hay bị
    // người dùng bấm Dừng vẫn chứa những bước agent đã đi và đã trả tiền —
    // mất chúng chỉ vì lượt không kết thúc đẹp là mất đúng thứ đáng giữ nhất.
    {
      void luuPhien(c.phienId, c.hoiThoai as TinNhanLuu[], c.duAn).catch(() => {
        /* ghi đĩa hỏng KHÔNG được làm hỏng lượt vừa chạy xong */
      });
    }
  }
}

function tenThuMuc(p: string): string {
  return p.split(/[\\/]/).filter(Boolean).pop() ?? p;
}

// ─── Một lời gọi tới /agent/turn, đọc SSE ──────────────────────────

interface KetQuaLuot {
  append: TinNhan[];
  stop: 'end' | 'tool_calls' | 'continue' | 'max_steps';
  toolCalls: Array<{ id: string; name: string; args: Record<string, unknown> }>;
  quota: HanMucUi | null;
  costUsd: number;
  daLuoc: number;
}

/**
 * Lỗi đáng THỬ LẠI: đường truyền đứt, không phải cổng từ chối.
 *
 * Đo thật 17/08/2026: cổng thỉnh thoảng im hẳn quá 90 giây và đồng hồ im lặng ở
 * backend cắt lượt. Hội thoại lúc đó vẫn nguyên vẹn ở main, nên thử lại là gửi
 * đúng thứ vừa gửi — rẻ hơn nhiều so với bắt người dùng gõ lại câu hỏi và mất
 * hết những bước agent đã đi.
 *
 * CHỈ thử lại MỘT lần, và chỉ với nhóm lỗi này. Lỗi "hết hạn mức", "chưa Pro",
 * "cổng trả 400" mà thử lại thì chỉ tốn thêm tiền cho cùng một câu trả lời.
 */
const MA_DANG_THU_LAI = new Set(['CONNECTION_LOST', 'LLM_ERROR']);

async function mgoiMotLuot(o: {
  token: string;
  messages: TinNhan[];
  capabilities: string[];
  workspace?: { name: string; platform: string; branch?: string };
  ghiChuDuAn?: { ten: string; noiDung: string };
  mucNoLuc?: string;
  signal: AbortSignal;
  phat: (e: SuKienAgent) => void;
}): Promise<{ ok: true; ketQua: KetQuaLuot } | { ok: false; thongDiep: string; ma: string }> {
  const res = await fetch(`${API_ORIGIN}/api/v1/agent/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${o.token}` },
    signal: o.signal,
    body: JSON.stringify({
      messages: o.messages,
      capabilities: o.capabilities,
      workspace: o.workspace,
      ghiChuDuAn: o.ghiChuDuAn,
      mucNoLuc: o.mucNoLuc,
    }),
  });

  if (!res.ok) {
    // 403 = chưa Pro. Phải phân biệt với 401 (phiên hết hạn) vì hai cái dẫn tới
    // hai màn hình khác hẳn nhau: một cái mời nâng cấp, một cái bắt đăng nhập.
    const than = await res.json().catch(() => ({})) as { message?: string; code?: string };
    return {
      ok: false,
      thongDiep: than.message ?? `Máy chủ trả về ${res.status}.`,
      ma: than.code ?? String(res.status),
    };
  }
  if (!res.body) {
    return { ok: false, thongDiep: 'Máy chủ không trả về dữ liệu.', ma: 'EMPTY_BODY' };
  }

  const doc = res.body.getReader();
  const giaiMa = new TextDecoder();
  let dem = '';
  const ra: KetQuaLuot = { append: [], stop: 'end', toolCalls: [], quota: null, costUsd: 0, daLuoc: 0 };
  let loi: { thongDiep: string; ma: string } | null = null;

  for (;;) {
    const { done, value } = await doc.read();
    if (done) break;
    dem += giaiMa.decode(value, { stream: true });
    const dong = dem.split('\n');
    dem = dong.pop() ?? '';

    for (const d of dong) {
      if (!d.startsWith('data: ')) continue;
      let e: any;
      try { e = JSON.parse(d.slice(6)); } catch { continue; }

      switch (e.type) {
        case 'start':
          o.phat({ loai: 'batDau', model: e.model });
          break;
        case 'text':
          o.phat({ loai: 'chu', delta: e.delta });
          break;
        case 'server_tool':
          o.phat({ loai: 'tool', ten: e.name, tomTat: e.summary, vong: 'notes' });
          break;
        case 'tool_call':
          ra.toolCalls.push({ id: e.id, name: e.name, args: e.args ?? {} });
          break;
        case 'done':
          ra.append = e.append ?? [];
          ra.stop = e.stop;
          ra.quota = e.quota ?? null;
          ra.costUsd = e.usage?.costUsd ?? 0;
          ra.daLuoc = e.compact?.soDaLuoc ?? 0;
          break;
        case 'error':
          // Ghi lại, KHÔNG phát ngay: chỗ gọi có thể quyết định thử lại, và
          // phát lỗi trước khi thử lại là hiện một thông báo đỏ rồi tự sửa —
          // người dùng đọc được cái đỏ đó và tưởng đã hỏng.
          loi = { thongDiep: e.error, ma: e.code ?? 'LLM_ERROR' };
          break;
      }
    }
  }

  return loi ? { ok: false, ...loi } : { ok: true, ketQua: ra };
}

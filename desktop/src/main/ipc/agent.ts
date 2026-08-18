/**
 * IPC của agent lập trình.
 *
 * ─── VÌ SAO THƯ MỤC DỰ ÁN PHẢI QUA HỘP THOẠI HỆ THỐNG ───
 * Không có kênh nào cho renderer TRUYỀN một đường dẫn lên. Người dùng bấm, hệ
 * điều hành mở hộp thoại, main nhận về đường dẫn. Đây là cùng nguyên tắc đã
 * dùng cho kho ghi chú (`ipc/notes.ts`), và ở đây nó còn quan trọng hơn: thư
 * mục này là PHẠM VI ĐỌC của một mô hình ngôn ngữ. Nếu renderer đặt được nó,
 * thì một đoạn mã bị chèn — hoặc một câu chữ khéo trong nội dung do máy chủ
 * trả về — chỉ tay agent vào `~/.ssh` là xong.
 *
 * ─── VÌ SAO `agent:send` KHÔNG TRẢ VỀ CÂU TRẢ LỜI ───
 * Nó chạy hàng chục giây tới vài phút và sinh ra hàng trăm sự kiện. Một
 * `invoke` trả về một lần thì người dùng nhìn con quay tới lúc xong. Tiến
 * trình đi qua kênh sự kiện `agent:event`; `invoke` chỉ để biết lượt đã kết
 * thúc (hoặc hỏng ngay từ đầu).
 */
import { BrowserWindow, dialog, shell } from 'electron';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import type {
  AgentCuocDangMo, AgentInfo, AgentMcpTrangThai, AgentWorktree, AgentMucKhoiPhuc, AgentPhien, AgentQuota, AgentWorkspace, ModelAgent, MucNoLuc,
} from '../../shared/ipc';
import { API_ORIGIN } from '../config';
import { getSettings, setSetting } from '../store';
import {
  bangGhiCua, chayLuot, cuocDangChay, datGocChoCuoc, datQuyenChoCuoc, dongCuoc, dsCuocDangMo,
  daChonGocCua, datGocNeuChuaCo, gocCuaCuoc, huyLuotCua, napPhien, quayLui, quyenCuaCuoc, soCuaCuoc,
  taoCuoc,
  xoaHoiThoai, type SuKienAgent,
} from '../agent/loop';
import { duongDanCauHinh, hanMucMcp, napLaiMcp, toolMcpHienCo, trangThaiServer } from '../agent/mcp';
import { dsWorktree, taoWorktree, xoaWorktree } from '../agent/worktree';
import { danhSachPhien, docPhien, dungLaiHienThi, xoaPhien } from '../agent/phien';
import { hoanTacTatCa } from '../agent/tools';
import { traLoi } from '../agent/xinPhep';
import { readStoredSession } from './auth';
import { handle } from './index';

/**
 * ⚠️ THƯ MỤC DỰ ÁN VÀ HAI CỜ QUYỀN GIỜ THUỘC VỀ TỪNG CUỘC, không phải cả app.
 *
 * Trước 17/08 chúng là biến module ở đây, nên mọi tab dùng chung — "tab A làm
 * project A, tab B làm project B" là chuyện không thể dù giao diện có nhiều
 * tab, và bật quyền ghi ở một tab là bật cho mọi tab.
 *
 * Giờ chúng nằm trong `CuocHoiThoai` (xem `agent/loop.ts`). Cài đặt
 * `agentWorkspace` còn lại đúng một vai trò: THƯ MỤC MẶC ĐỊNH cho tab mới, để
 * người dùng không phải chọn lại mỗi lần mở việc mới.
 *
 * Quyền vẫn KHÔNG BAO GIỜ lưu xuống đĩa và KHÔNG kế thừa sang tab mới: đây là
 * quyền ghi vào mã nguồn do một mô hình ngôn ngữ điều khiển, và một quyền như
 * thế mà tự bật lại thì người dùng sẽ quên mất nó đang bật — cái quên đó chỉ lộ
 * ra khi đã có file bị sửa.
 */

const chay = promisify(execFile);

/**
 * Ước lượng token cho MỘT việc, đo thật 17/08/2026 trên mã nguồn thật.
 * Dùng để đổi "còn 3,4 triệu token" thành "còn ~19 việc" — con số duy nhất
 * người dùng thật sự hiểu. Lấy mức việc VỪA (12 bước) làm chuẩn.
 */
const TOKEN_MOI_VIEC = 141_000;

const MUC_HOP_LE = new Set<string>(['thap', 'vua', 'cao', 'ratCao', 'toiDa', 'ultracode']);
/** Tên cũ còn nằm trong file thiết đặt của người đã dùng bản trước. */
const MUC_TEN_CU: Record<string, MucNoLuc> = { nhanh: 'thap', canBang: 'vua', ky: 'cao' };

function mucNoLucHienTai(): MucNoLuc {
  const v = getSettings().agentMucNoLuc;
  if (typeof v !== 'string') return 'vua';
  if (MUC_HOP_LE.has(v)) return v as MucNoLuc;
  return MUC_TEN_CU[v] ?? 'vua';
}

const MODEL_HOP_LE = new Set<string>(['sonnet-5', 'opus-4-8', 'gpt-sol']);

function modelHienTai(): ModelAgent {
  const v = getSettings().agentModel;
  return typeof v === 'string' && MODEL_HOP_LE.has(v) ? (v as ModelAgent) : 'sonnet-5';
}

/** Thư mục MẶC ĐỊNH cho tab mới — thư mục người dùng chọn gần nhất. */
function thuMucMacDinh(): string | null {
  const v = getSettings().agentWorkspace;
  return typeof v === 'string' && v.length > 0 ? v : null;
}

/**
 * Thư mục của một cuộc, tự lấy mặc định nếu cuộc chưa có.
 *
 * Lấy mặc định ở LẦN HỎI ĐẦU chứ không ở `taoCuoc()`: tab được tạo trước khi
 * renderer kịp hỏi, và gán trong `taoCuoc` khiến `datGocChoCuoc` sau đó thấy
 * "không đổi" rồi bỏ qua bước xoá hội thoại.
 */
function gocCua(cuocId: string): string | null {
  const rieng = gocCuaCuoc(cuocId);
  if (rieng) return rieng;
  // Người dùng ĐÃ tự quyết cho tab này (kể cả quyết định là "bỏ") ⇒ tôn trọng.
  // Thiếu nhánh này thì bấm ✕ xong, lần hỏi ngay sau tự điền lại thư mục mặc
  // định và nút Bỏ trông như không làm gì.
  if (daChonGocCua(cuocId)) return null;
  const md = thuMucMacDinh();
  // `datGocNeuChuaCo`, KHÔNG phải `datGocChoCuoc` — cái sau xoá hội thoại, và
  // gọi nó ở đây sẽ xoá sạch một phiên vừa được mở lại.
  if (md) datGocNeuChuaCo(cuocId, md);
  return md;
}

/** Nhánh git của thư mục, `null` nếu không phải kho git hoặc không có git. */
async function nhanhGit(goc: string): Promise<string | null> {
  try {
    const { stdout } = await chay('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: goc, timeout: 5000, windowsHide: true,
    });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function moTa(cuocId: string, goc: string | null): Promise<AgentWorkspace> {
  const mucNoLuc = mucNoLucHienTai();
  const model = modelHienTai();
  const q = quyenCuaCuoc(cuocId);
  // ⚠️ `choGhiNote` phải có ở CẢ HAI nhánh. Nhánh "chưa chọn thư mục" trả cứng
  // false cho hai quyền kia (đúng — chúng gắn với thư mục), nhưng ghi chú thì
  // KHÔNG cần thư mục nào: bỏ sót ở đây thì người dùng bật công tắc xong giao
  // diện vẫn vẽ "tắt", bấm mãi không lên, mà không có lỗi nào.
  if (!goc) {
    return { path: null, name: null, branch: null, choSua: false, choChayLenh: false, choGhiNote: q.choGhiNote, mucNoLuc, model };
  }
  return {
    path: goc,
    name: path.basename(goc),
    branch: await nhanhGit(goc),
    choSua: q.choSua,
    choChayLenh: q.choChayLenh,
    choGhiNote: q.choGhiNote,
    mucNoLuc,
    model,
  };
}

/**
 * Thư mục đã chọn lần trước có còn dùng được không.
 *
 * Người dùng đổi tên thư mục, tháo ổ ngoài, hoặc dọn dẹp — cấu hình vẫn giữ
 * đường dẫn cũ. Không kiểm ở đây thì agent chạy được một lượt rồi mọi tool trả
 * ENOENT, và người dùng thấy một agent "hỏng" chứ không thấy "thư mục biến mất".
 */
async function conDungDuoc(goc: string): Promise<boolean> {
  try {
    return (await fs.stat(goc)).isDirectory();
  } catch {
    return false;
  }
}

export function registerAgentHandlers(): void {
  handle('agent:getInfo', async (): Promise<AgentInfo> => {
    const phien = readStoredSession();
    const trong: AgentInfo = { pro: false, configured: false, model: null, quota: null, soViecConLai: null };
    if (!phien) return trong;

    try {
      const [rTools, rUsage] = await Promise.all([
        fetch(`${API_ORIGIN}/api/v1/agent/tools`, { headers: { Authorization: `Bearer ${phien.sessionToken}` } }),
        fetch(`${API_ORIGIN}/api/v1/agent/usage`, { headers: { Authorization: `Bearer ${phien.sessionToken}` } }),
      ]);
      if (!rTools.ok) return trong;

      const tools = await rTools.json() as {
        data?: {
          pro?: boolean; configured?: boolean; model?: string;
          models?: AgentInfo['models']; mucNoLuc?: AgentInfo['mucNoLuc'];
        };
      };
      const usage = rUsage.ok
        ? (await rUsage.json() as { data?: { daDung: number; tran: number; phanTram: number; hoiLucNao: string | null; conLai: number } }).data
        : undefined;

      const quota: AgentQuota | null = usage
        ? { daDung: usage.daDung, tran: usage.tran, phanTram: usage.phanTram, hoiLucNao: usage.hoiLucNao }
        : null;

      return {
        pro: tools.data?.pro ?? false,
        configured: tools.data?.configured ?? false,
        model: tools.data?.model ?? null,
        quota,
        soViecConLai: usage ? Math.max(0, Math.floor(usage.conLai / TOKEN_MOI_VIEC)) : null,
        // Máy chủ cũ chưa khai hai trường này ⇒ `undefined`, và giao diện tự
        // lùi về bảng chép cứng. Không được đổi thành `[]`: mảng rỗng là "máy
        // chủ nói không có model nào", nghĩa hoàn toàn khác.
        ...(tools.data?.models ? { models: tools.data.models } : {}),
        ...(tools.data?.mucNoLuc ? { mucNoLuc: tools.data.mucNoLuc } : {}),
      };
    } catch {
      // Mất mạng. KHÔNG ném — màn hình agent vẫn phải mở được để người dùng
      // nhìn thấy lịch sử phiên trước, chỉ là không gửi được câu mới.
      return trong;
    }
  });

  handle('agent:getWorkspace', async ({ cuocId }): Promise<AgentWorkspace> => {
    const goc = gocCua(cuocId);
    if (goc && !(await conDungDuoc(goc))) {
      // Thư mục biến mất (đổi tên, tháo ổ ngoài). Gỡ khỏi cuộc NÀY và khỏi cả
      // giá trị mặc định — để tab mới không kế thừa một đường dẫn đã chết.
      datGocChoCuoc(cuocId, null);
      if (thuMucMacDinh() === goc) setSetting('agentWorkspace', '');
      return moTa(cuocId, null);
    }
    return moTa(cuocId, goc);
  });

  handle('agent:chooseWorkspace', async ({ cuocId }): Promise<AgentWorkspace> => {
    const cuaSo = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
    const cu = gocCua(cuocId);
    const tuyChon = {
      title: 'Chọn thư mục dự án cho agent',
      message: 'Agent sẽ ĐỌC được mọi file trong thư mục này (trừ .env và các file khoá).',
      buttonLabel: 'Cho phép đọc',
      properties: ['openDirectory' as const, 'createDirectory' as const],
      ...(cu ? { defaultPath: cu } : {}),
    };
    // Không có cửa sổ nào (mọi cửa sổ vừa đóng) ⇒ mở hộp thoại không cha. Truyền
    // `undefined` làm cha thì Electron ném — và ném ở đây nghĩa là app chết vì
    // người dùng bấm một cái nút.
    const ketQua = cuaSo
      ? await dialog.showOpenDialog(cuaSo, tuyChon)
      : await dialog.showOpenDialog(tuyChon);

    // Huỷ ⇒ GIỮ NGUYÊN thư mục cũ. Coi "huỷ" là "bỏ chọn" là một cái bẫy: người
    // dùng bấm nhầm rồi Esc, và mất luôn thư mục đang làm việc.
    const goc = ketQua.filePaths[0];
    if (ketQua.canceled || !goc) return moTa(cuocId, cu);

    // Ghi làm MẶC ĐỊNH cho tab mới, và gán cho ĐÚNG tab này.
    //
    // ⚠️ KHÔNG `xoaMoiCuoc()` nữa. Đổi thư mục chỉ làm hỏng bối cảnh của tab
    // này; xoá luôn việc của các tab đang làm dự án KHÁC là mất dữ liệu người
    // dùng vì một thao tác chẳng liên quan gì tới chúng.
    setSetting('agentWorkspace', goc);
    datGocChoCuoc(cuocId, goc);
    return moTa(cuocId, goc);
  });

  handle('agent:clearWorkspace', async ({ cuocId }): Promise<AgentWorkspace> => {
    // Chỉ gỡ khỏi TAB NÀY. Giá trị mặc định giữ nguyên: người dùng đóng dự án ở
    // một tab không có nghĩa là họ muốn tab sau cũng bắt đầu từ con số không.
    datGocChoCuoc(cuocId, null);
    return moTa(cuocId, null);
  });

  handle('agent:send', async ({ cuocId, text, anh }, event) => {
    if (cuocDangChay(cuocId)) throw new Error('Việc này đang chạy dở. Hãy dừng nó trước.');

    const goc = gocCua(cuocId);
    const conSong = goc && (await conDungDuoc(goc)) ? goc : null;
    if (goc && !conSong) datGocChoCuoc(cuocId, null);
    const quyen = quyenCuaCuoc(cuocId);

    // Bắn thẳng về đúng cửa sổ đã gửi yêu cầu, không phải "mọi cửa sổ": nếu sau
    // này app có nhiều cửa sổ thì tiến trình của cửa sổ này không được rơi vào
    // khung chat của cửa sổ kia.
    const guiVe = event.sender;
    /**
     * Mọi sự kiện đều mang `cuocId`.
     *
     * Từ khi mở được nhiều tab, tất cả cùng nghe kênh `agent:event` — không gắn
     * id thì chữ của tab A chảy vào bảng ghi tab B, và không có gì báo lỗi cả.
     */
    const phat = (e: SuKienAgent): void => {
      if (!guiVe.isDestroyed()) guiVe.send('agent:event', { ...e, cuocId });
    };

    const nhanh = conSong ? await nhanhGit(conSong) : null;
    await chayLuot(
      cuocId,
      text,
      {
        // ⚠️ Thiếu MỘT trường ở đây là tool biến mất khỏi tầm nhìn của model mà
        // KHÔNG có lỗi nào: `capabilities` rỗng ⇒ máy chủ không gửi tool ⇒ model
        // trả lời lịch sự "tôi không có tool đó", đúng như nó được dạy. Bật công
        // tắc trên giao diện vẫn hiện BẬT, nên nhìn đâu cũng thấy ổn.
        goc: conSong, choSua: quyen.choSua, choChayLenh: quyen.choChayLenh,
        choGhiNote: quyen.choGhiNote, mucNoLuc: mucNoLucHienTai(), model: modelHienTai(),
        ...(anh?.length ? { anh } : {}),
        ...(nhanh ? { nhanh } : {}),
      },
      phat,
    );
  });

  handle('agent:cancel', ({ cuocId }) => {
    huyLuotCua(cuocId);
  });

  handle('agent:reset', ({ cuocId }) => {
    xoaHoiThoai(cuocId);
  });

  handle('agent:taoCuoc', () => taoCuoc());

  handle('agent:dongCuoc', ({ cuocId }) => {
    dongCuoc(cuocId);
  });

  handle('agent:traLoiXinPhep', ({ cuocId, id, quyetDinh }, event) => {
    // `traLoi` cần đường dẫn để nhớ "cho phép cả file này". Nó tự tra trong sổ
    // yêu cầu đang treo, nên ở đây chỉ chuyển tiếp quyết định.
    const nhan = traLoi(id, quyetDinh);
    // Báo lại cho giao diện gỡ thẻ — kể cả khi `nhan === false` (thẻ đã hết
    // giờ). Không báo thì một thẻ quá hạn nằm lại trên màn hình vĩnh viễn và
    // người dùng bấm mãi không có gì xảy ra.
    if (!event.sender.isDestroyed()) {
      event.sender.send('agent:event', {
        cuocId, loai: 'xongXinPhep', id, dongY: nhan && quyetDinh !== 'tuChoi',
      });
    }
  });

  // Chặn theo CUỘC NÀY, không theo cả app: đổi quyền của tab đang rảnh trong
  // lúc tab khác chạy là chuyện vô hại, và chặn nó lại làm nhiều tab thành vô
  // dụng đúng lúc người dùng cần chuẩn bị việc tiếp theo.
  handle('agent:datCheDoSua', async ({ cuocId, bat }): Promise<AgentWorkspace> => {
    if (cuocDangChay(cuocId)) throw new Error('Việc này đang chạy dở — hãy dừng trước khi đổi quyền sửa.');
    datQuyenChoCuoc(cuocId, { choSua: bat });
    return moTa(cuocId, gocCua(cuocId));
  });

  handle('agent:datCheDoLenh', async ({ cuocId, bat }): Promise<AgentWorkspace> => {
    if (cuocDangChay(cuocId)) throw new Error('Việc này đang chạy dở — hãy dừng trước khi đổi quyền chạy lệnh.');
    datQuyenChoCuoc(cuocId, { choChayLenh: bat });
    return moTa(cuocId, gocCua(cuocId));
  });

  handle('agent:datCheDoNote', async ({ cuocId, bat }): Promise<AgentWorkspace> => {
    if (cuocDangChay(cuocId)) throw new Error('Việc này đang chạy dở — hãy dừng trước khi đổi quyền ghi ghi chú.');
    datQuyenChoCuoc(cuocId, { choGhiNote: bat });
    return moTa(cuocId, gocCua(cuocId));
  });

  handle('agent:dsPhien', (): Promise<AgentPhien[]> => danhSachPhien());

  handle('agent:moPhien', async ({ cuocId, id }): Promise<{ muc: AgentMucKhoiPhuc[] } | null> => {
    const p = await docPhien(id);
    if (!p) return null;
    // Nạp VÀO tab hiện tại; tab giữ nguyên id của nó, chỉ `phienId` đổi.
    napPhien(cuocId, p.id, p.hoiThoai, p.duAn, p.goc ?? null);
    return { muc: dungLaiHienThi(p.hoiThoai) };
  });

  handle('agent:xoaPhien', async ({ id }) => {
    // Xoá phiên ⇒ đóng luôn cuộc nếu nó đang mở, nếu không agent vẫn nhớ một
    // việc mà người dùng vừa bảo là bỏ đi.
    dongCuoc(id);
    await xoaPhien(id);
  });

  handle('agent:datMucNoLuc', ({ muc }) => {
    setSetting('agentMucNoLuc', muc);
  });

  handle('agent:datModel', ({ model }) => {
    setSetting('agentModel', model);
  });

  handle('agent:hoanTac', async ({ cuocId }) => {
    // Huỷ lượt trước: hoàn tác trong lúc agent vẫn đang ghi tiếp là chạy đua
    // với chính nó, và bên thắng là bên ghi sau.
    huyLuotCua(cuocId);
    return hoanTacTatCa(soCuaCuoc(cuocId));
  });

  // ─── Worktree ────────────────────────────────────────────────────

  handle('agent:dsWorktree', async ({ cuocId }): Promise<AgentWorktree[]> => {
    const goc = gocCua(cuocId);
    if (!goc) return [];
    const ds = await dsWorktree(goc);
    return ds.map((w) => ({ ...w, dangDung: path.resolve(w.duongDan) === path.resolve(goc) }));
  });

  handle('agent:taoWorktree', async ({ cuocId, ten }) => {
    if (cuocDangChay(cuocId)) return { ok: false, loi: 'Việc này đang chạy dở — dừng nó trước.' };
    const goc = gocCua(cuocId);
    if (!goc) return { ok: false, loi: 'Tab này chưa mở thư mục dự án nào.' };
    const kq = await taoWorktree(goc, ten);
    if (!kq.ok || !kq.duongDan) return { ok: false, ...(kq.loi ? { loi: kq.loi } : {}) };
    // Chuyển tab sang worktree vừa tạo. `datGocChoCuoc` xoá hội thoại — ĐÚNG:
    // agent vừa đọc file ở cây cũ, và giờ nó đứng ở một cây khác.
    datGocChoCuoc(cuocId, kq.duongDan);
    return { ok: true };
  });

  handle('agent:doiWorktree', async ({ cuocId, duongDan }) => {
    if (cuocDangChay(cuocId)) return { ok: false, loi: 'Việc này đang chạy dở — dừng nó trước.' };
    const goc = gocCua(cuocId);
    if (!goc) return { ok: false, loi: 'Tab này chưa mở thư mục dự án nào.' };
    // ⛔ KHÔNG tin `duongDan` từ renderer. Chỉ chấp nhận nếu git NÓI rằng nó là
    // một worktree của chính repo đang mở — nếu không thì đây thành một đường
    // vòng để đặt phạm vi đọc của agent vào thư mục bất kỳ.
    const ds = await dsWorktree(goc);
    const muc = ds.find((w) => path.resolve(w.duongDan) === path.resolve(duongDan));
    if (!muc) return { ok: false, loi: 'Đường dẫn không phải worktree của repo này.' };
    if (!(await conDungDuoc(muc.duongDan))) return { ok: false, loi: 'Thư mục worktree không còn tồn tại.' };
    datGocChoCuoc(cuocId, muc.duongDan);
    return { ok: true };
  });

  handle('agent:xoaWorktree', async ({ cuocId, duongDan }) => {
    const goc = gocCua(cuocId);
    if (!goc) return { ok: false, loi: 'Tab này chưa mở thư mục dự án nào.' };
    if (path.resolve(duongDan) === path.resolve(goc)) {
      return { ok: false, loi: 'Không xoá được worktree mà tab này đang đứng. Chuyển sang cây khác trước.' };
    }
    return xoaWorktree(goc, duongDan);
  });

  handle('agent:quayLui', ({ cuocId, k }) => quayLui(cuocId, k));

  handle('agent:dsCuoc', (): AgentCuocDangMo[] => dsCuocDangMo());

  handle('agent:bangGhi', ({ cuocId }): { muc: AgentMucKhoiPhuc[]; dangChay: boolean } => ({
    muc: bangGhiCua(cuocId),
    dangChay: cuocDangChay(cuocId),
  }));

  // ─── MCP ─────────────────────────────────────────────────────────

  handle('agent:mcpTrangThai', (): AgentMcpTrangThai => trangThaiMcp());

  handle('agent:mcpNapLai', async (): Promise<AgentMcpTrangThai> => {
    await napLaiMcp();
    return trangThaiMcp();
  });

  handle('agent:mcpMoCauHinh', async () => {
    // Nạp một lần trước khi mở: `napLaiMcp` tự ghi file mẫu khi chưa có. Mở một
    // file không tồn tại thì hệ điều hành báo lỗi cụt lủn, và người dùng không
    // có cách nào biết phải tạo nó ở đâu, tên gì, cú pháp ra sao.
    await napLaiMcp().catch(() => {});
    await shell.openPath(duongDanCauHinh());
  });
}

function trangThaiMcp(): AgentMcpTrangThai {
  return {
    duongDan: duongDanCauHinh(),
    server: trangThaiServer(),
    soTool: toolMcpHienCo().length,
    hanMuc: hanMucMcp(),
  };
}

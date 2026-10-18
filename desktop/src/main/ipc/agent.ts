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
import { app, BrowserWindow, dialog, shell, type IpcMainInvokeEvent } from 'electron';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import type {
  AgentCongAnthropic, AgentCuocDangMo, AgentInfo, AgentMcpTrangThai, AgentWorktree, AgentMucKhoiPhuc, AgentPhien, AgentQuota, AgentWorkspace, ModelAgent, MucNoLuc,
} from '../../shared/ipc';
import { API_ORIGIN } from '../config';
import { getSettings, setSetting } from '../store';
import { docGhiChuDuAn } from '../agent/ghiChu';
import {
  bangGhiCua, chayLuot, cuocDangChay, datGocChoCuoc, datQuyenChoCuoc, dongCuoc, dsCuocDangMo,
  daChonGocCua, datGocNeuChuaCo, gocCuaCuoc, huyLuotCua, napPhien, quayLui, quyenCuaCuoc, soCuaCuoc,
  datCheDoQuyen, tachNhanhCuoc, taoCuoc,
  xoaHoiThoai, type SuKienAgent,
  dsQuyenLauCua, xoaQuyenLauCua, veCongChinh, chayLuotCucBo, datCongPhuCua, veAnthropic,
  datTomTatCua, hoiThoaiCua, nguCanhChiTietCua, henChoCua, phatNen, phatNenTho, themTienToCua,
  chenTinCua, cuocCuaPhien, datMayTinh, mayTinhDangBat,
} from '../agent/loop';
import { hoTro as mayHoTro, kiemQuyen as kiemQuyenMay } from '../agent/mayTinh';
import { datNoiLuuHen, dsHenLo, ganHenChoCuoc, napHenDaLuu, xuLyHenLo } from '../agent/choHen';
import { chanDoan, goiCompact } from '../agent/lenhMayChu';
import { dangMatMang } from '../aiCucBo/mang';
import { modelChoCode } from '../aiCucBo/quanLy';
import { duongCuaLuot } from '../agent/epCucBo';
import { dungLenhNenCua } from '../agent/lenhNen';
import { batTatServer, choNapMcp, duongDanCauHinh, duyetDuAn, hanMucMcp, loiCauHinh, napLaiMcp, toolMcpHienCo, trangThaiServer } from '../agent/mcp';
import { cai, napChiMuc, tim } from '../agent/khoKyNang';
import { WEB_ORIGIN } from '../config';
import { dsWorktree, taoWorktree, xoaWorktree } from '../agent/worktree';
import {
  danhSachPhien, datGhimPhien, datLuuTruPhien, docPhien, doiTenPhien, dungLaiHienThi,
  nhanBanPhien, xoaPhien,
} from '../agent/phien';
import { datDinhKem, datDinhKemTuDuong } from '../agent/dinhKem';
import { hoanTacTatCa, luiFileVeLuot } from '../agent/tools';
import { timFileGoiY } from '../agent/timFileNhanh';
import { docLenhDuAn } from '../agent/lenhTuTao';
import { chayHook, docHook, docNhatKy, quenDemHook, duongDanCauHinh as duongHook, dsHookChoDuyet, duyetHookDuAn} from '../agent/hook';
import { dsKyNang } from '../agent/kyNang';
import { dsDeGiaoDien, quenBaiHoc } from '../agent/boNho';
import { traLoi } from '../agent/xinPhep';
import { traLoiHoi } from '../agent/hoiLuaChon';
import { canCapLai, capLaiCtwork, docBiMat, ketNoiCtwork, napDemBiMat, ngatCtwork, trangThaiCtwork, TEN_SERVER as TEN_CTWORK } from '../agent/ctworkKetNoi';
import * as ctw from '../agent/ctworkHe';
import { datNgonNgu as datNgonNguCtw } from '../agent/ctworkVe';
import { cauDanhThuc, datBoChayHen, huyCho, huyHen } from '../agent/choHen';
import { doiTen as doiTenPhienMang, dsPhienSong, toiLa } from '../agent/phienMang';
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

/* Phải khớp `modelAgentSchema` — xem chú thích ở đó. Hai cổng, hai bảng model,
   app nhận cả hai. */
const MODEL_HOP_LE = new Set<string>([
  'sonnet-5', 'opus-4-8', 'gpt-sol',
  'haiku-4-5', 'sonnet-4-6', 'opus-4-6', 'opus-4-7',
  'opus-5', 'fable-5',
  // Cổng Claude chính hãng (17/10/2026) — xem `modelAgentSchema`.
  'cl-free', 'cl-sonnet-5-5', 'cl-opus-5-5', 'cl-fable-5-1',
]);

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
    return {
      path: null, name: null, branch: null, cheDoQuyen: q.cheDoQuyen,
      choSua: false, choChayLenh: false,
      choGhiNote: q.choGhiNote, choTrinhDuyet: q.choTrinhDuyet, mucNoLuc, model,
    };
  }
  return {
    path: goc,
    name: path.basename(goc),
    branch: await nhanhGit(goc),
    cheDoQuyen: q.cheDoQuyen,
    choSua: q.choSua,
    choChayLenh: q.choChayLenh,
    choGhiNote: q.choGhiNote,
    choTrinhDuyet: q.choTrinhDuyet,
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

/**
 * Bản mẫu `AGENTS.md`.
 *
 * Viết theo lối HỎI chứ không theo lối điền vào chỗ trống: người dùng mở ra là
 * thấy ngay những câu mà agent sẽ phải tự mò nếu không ai trả lời. Một bản mẫu
 * toàn đề mục trống thì họ đóng lại và không bao giờ quay lại.
 */
const MAU_GHI_CHU = `# Ghi chu cho AI Code

Agent doc file nay TRUOC moi luot. Viet vao day nhung thu no khong the tu doan
ra tu ma — moi dong o day tiet kiem cho ban hang chuc buoc mo mam.

## Chay du an

<!-- Lenh chay, lenh dung, lenh test. Vi du:
- Chay: docker compose up -d
- Test: ./mvnw test
- Dung lai sau khi doi ma: docker compose build api — chi copy file vao thu muc
  la KHONG du, compose dung 'build:' nen no dung lai tu nguon.
-->

## Bay da gap

<!-- Nhung cho da lam mat thoi gian mot lan roi. Vi du:
- Doi migration da chay thi phai xoa volume DB, khong Flyway bao checksum.
- Cong 3000 dang co app khac — dung 3007.
-->

## Quy uoc

<!-- Vi du:
- Dung sua thu muc generated/.
- Khong tu chay git commit — toi tu commit.
-->
`;

/**
 * ── THÔNG TIN AGENT LẦN CUỐI CÓ MẠNG (03/10/2026) ──
 *
 * Mất mạng thì `/agent/tools` không trả lời, `getInfo` trả `pro: false` — và
 * trang AI Code (ChatPage) chỉ mở tab khi `info.pro` ⇒ quay "Đang mở việc…"
 * MÃI MÃI. Đúng lúc AI Code ngoại tuyến cần hiện ra thì cả trang không mở.
 *
 * Nên nhớ lần cuối máy chủ trả lời (ra đĩa — app mở lên lúc đã mất mạng cũng
 * cần). Quyền Pro vẫn do MÁY CHỦ quyết; đây chỉ là nhớ lại câu nó đã nói. Hạn
 * mức token thì bỏ (`quota: null`): việc trên máy không tiêu hạn mức máy chủ.
 */
const tepInfoCuoi = (): string => path.join(app.getPath('userData'), 'agent-info-cuoi.json');
async function docInfoCuoi(): Promise<AgentInfo | null> {
  try {
    const j = JSON.parse(await fs.readFile(tepInfoCuoi(), 'utf8')) as AgentInfo;
    return typeof j?.pro === 'boolean' ? { ...j, quota: null, soViecConLai: null } : null;
  } catch {
    return null;
  }
}

export function registerAgentHandlers(): void {
  handle('agent:getInfo', async (): Promise<AgentInfo> => {
    const phien = readStoredSession();
    const trong: AgentInfo = { pro: false, configured: false, model: null, quota: null, soViecConLai: null };
    if (!phien) return trong;

    try {
      /* Trần 8 giây: WiFi chưa đăng nhập cổng có thể treo kết nối rất lâu —
         không trần thì trang AI Code quay "Đang kiểm tra quyền…" mãi. */
      const [rTools, rUsage] = await Promise.all([
        /* `congAnthropicVe` để `canMoKhoa` của các model chính hãng phản ánh đúng vé đang giữ. */
        fetch(`${API_ORIGIN}/api/v1/agent/tools${veAnthropic() ? `?congAnthropicVe=${encodeURIComponent(veAnthropic()!)}` : ''}`, { headers: { Authorization: `Bearer ${phien.sessionToken}` }, signal: AbortSignal.timeout(8000) }),
        fetch(`${API_ORIGIN}/api/v1/agent/usage`, { headers: { Authorization: `Bearer ${phien.sessionToken}` }, signal: AbortSignal.timeout(8000) }),
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

      const ra: AgentInfo = {
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
      void fs.writeFile(tepInfoCuoi(), JSON.stringify(ra)).catch(() => {});
      return ra;
    } catch {
      // Mất mạng. KHÔNG ném — màn hình agent vẫn phải mở được để người dùng
      // nhìn thấy lịch sử phiên trước, VÀ (03/10/2026) để AI Code ngoại tuyến
      // chạy được: trả lại câu máy chủ nói lần cuối thay vì `pro: false`.
      return (await docInfoCuoi()) ?? trong;
    }
  });

  /**
   * Dự án có ghi chú cho agent chưa.
   *
   * ⚠️ App đọc `AGENTS.md`/`CLAUDE.md` mỗi lượt từ lâu, nhưng KHÔNG chỗ nào
   * trong giao diện nhắc tới chúng — đo 14/09/2026, `grep` trong `src/renderer`
   * ra RỖNG. Người dùng hỏi thẳng "do tôi chưa cài skill hoặc prompt cho nó?"
   * trong khi app đã hỗ trợ sẵn, và agent thì phải mò lại những thứ đáng ra
   * được nói sẵn (147/160 bước cho một việc Docker/Flyway).
   */
  handle('agent:ghiChuTrangThai', async ({ cuocId }) => {
    const goc = gocCua(cuocId);
    if (!goc) return { co: false, ten: null };
    const g = await docGhiChuDuAn(goc);
    return { co: g !== null, ten: g?.ten ?? null };
  });

  /** Tạo `AGENTS.md` mẫu rồi mở ra để người dùng sửa. */
  handle('agent:taoGhiChu', async ({ cuocId }) => {
    const goc = gocCua(cuocId);
    if (!goc) return { ok: false, daCo: false };
    const duong = path.join(goc, 'AGENTS.md');
    /* KHÔNG ghi đè. Người dùng có thể đã có file mà app đọc hụt vì lý do khác;
       xoá công của họ để thay bằng bản mẫu là hỏng không lùi được. */
    const daCo = await fs.access(duong).then(() => true).catch(() => false);
    if (!daCo) await fs.writeFile(duong, MAU_GHI_CHU, 'utf8');
    await shell.openPath(duong);
    return { ok: true, daCo };
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

  /**
   * Chạy một lượt cho tab `cuocId`. Dùng chung cho `agent:send` (câu hỏi mới)
   * và `agent:lamTiep` (chạy tiếp lượt vừa bị chặn — key gia hạn, 02/10/2026):
   * hai đường PHẢI dựng cùng một bối cảnh quyền/thư mục, tách ra hai bản là
   * một ngày nào đó một bản quên một trường.
   */
  /**
   * `/offline` (03/10/2026) — các tab mà người dùng ÉP chạy AI trên máy dù có
   * mạng. Chỉ trong RAM: mở lại app là về máy chủ như cũ (ép ngoại tuyến là
   * quyết định cho một buổi, không phải cài đặt vĩnh viễn).
   */
  const epCucBo = new Set<string>();

  const chayCho = async (
    cuocId: string, text: string, anh: string[] | undefined,
    event: IpcMainInvokeEvent, lamTiep: boolean, chiDoc = false,
  ): Promise<void> => {
    if (cuocDangChay(cuocId)) throw new Error('Việc này đang chạy dở. Hãy dừng nó trước.');

    const goc = gocCua(cuocId);
    const conSongDuAn = goc && (await conDungDuoc(goc)) ? goc : null;
    if (goc && !conSongDuAn) datGocChoCuoc(cuocId, null);
    const quyenTab = quyenCuaCuoc(cuocId);
    /* Tab CHƯA CÓ thư mục + "Bỏ qua tất cả" (mặc định của tab trống từ
       16/10/2026) ⇒ làm việc ở THƯ MỤC NHÀ của người dùng. Không có gốc thì
       agent không có tool nào (xem `capabilities` trong loop.ts) — "toàn quyền"
       mà không cài nổi git, không chạy nổi một lệnh là toàn quyền trên giấy.
       Không lưu thành thư mục của tab: chọn dự án thật lúc nào cũng được. */
    const conSong = conSongDuAn ?? (quyenTab.cheDoQuyen === 'boQuaHet' ? os.homedir() : null);
    /* `/plan` · `/review`: CHỈ ĐỌC cho riêng lượt này — bỏ mọi quyền ghi khỏi
       bối cảnh, nên `capabilities` không mời tool ghi nào. Chế độ quyền của
       tab không đổi; lượt sau trở lại như cũ. */
    const quyen = chiDoc
      ? { ...quyenTab, choSua: false, choChayLenh: false, choGhiNote: false }
      : quyenTab;

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

    const nhanh = conSongDuAn ? await nhanhGit(conSongDuAn) : null;

    /*
     * ── MẤT MẠNG ⇒ AI CODE NGOẠI TUYẾN (03/10/2026) ──
     *
     * Hỏi bộ theo dõi mạng (gõ cửa máy chủ thật, xem `aiCucBo/mang.ts`) NGAY
     * trước khi gửi. Có mạng ⇒ đi máy chủ như cũ, KHÔNG BAO GIỜ rơi xuống máy
     * (ranh giới 1). "Làm tiếp" (key gia hạn) là việc của máy chủ, không rẽ.
     */
    /* `/offline` ép tay ⇒ đi đường máy y như mất mạng, nhưng KHÔNG cần công tắc
       "Tự dùng khi mất mạng" (người dùng vừa tự chọn). Công tắc "Cho phép" thì
       vẫn phải tôn trọng. */
    const ep = epCucBo.has(cuocId);
    if (!lamTiep && (ep || (await dangMatMang()))) {
      const s = getSettings() as Record<string, unknown>;
      const chon = await modelChoCode().catch(() => null);
      const duong = duongCuaLuot({
        ep,
        matMang: true,
        choPhepChay: s.aiCucBoBat !== false,
        tuDungKhiMatMang: s.aiCucBoTuDong !== false,
        coModel: !!chon?.ma,
      });
      if (duong === 'cucBo') {
        await chayLuotCucBo(
          cuocId,
          text,
          {
            goc: conSong, choSua: quyen.choSua, choChayLenh: quyen.choChayLenh,
            ...(anh?.length ? { anh } : {}),
            ...(nhanh ? { nhanh } : {}),
          },
          phat,
        );
        return;
      }
      phat(duong === 'daTat'
        ? {
          loai: 'loi', ma: 'CUC_BO_DA_TAT',
          thongDiep: 'Mất mạng, và AI ngoại tuyến đang TẮT trong Cài đặt → AI ngoại tuyến (công tắc "Cho phép" hoặc "Tự dùng khi mất mạng").',
        }
        : {
          loai: 'loi', ma: 'CUC_BO_CHUA_CAI',
          thongDiep: `Mất mạng — không với tới AI máy chủ. ${chon?.vi ?? 'Chưa có AI ngoại tuyến cho AI Code trên máy này.'}`,
        });
      return;
    }

    await chayLuot(
      cuocId,
      text,
      {
        // ⚠️ Thiếu MỘT trường ở đây là tool biến mất khỏi tầm nhìn của model mà
        // KHÔNG có lỗi nào: `capabilities` rỗng ⇒ máy chủ không gửi tool ⇒ model
        // trả lời lịch sự "tôi không có tool đó", đúng như nó được dạy. Bật công
        // tắc trên giao diện vẫn hiện BẬT, nên nhìn đâu cũng thấy ổn.
        goc: conSong, choSua: quyen.choSua, choChayLenh: quyen.choChayLenh,
        choGhiNote: quyen.choGhiNote, choTrinhDuyet: quyen.choTrinhDuyet,
        mucNoLuc: mucNoLucHienTai(), model: modelHienTai(),
        ...(anh?.length ? { anh } : {}),
        ...(nhanh ? { nhanh } : {}),
      },
      phat,
      { lamTiep },
    );
  };

  /*
   * ── HẸN QUAY LẠI (đợt 3) ──
   * Tới giờ ⇒ tự mở một lượt "[Đánh thức …]" trong đúng cuộc. Không có cửa sổ
   * nào hỏi ⇒ sự kiện đi qua `phatNenTho` (mọi cửa sổ + cầu nối VS Code), nên
   * desktop, CLI, extension đều thấy lượt này. Cuộc đang bận ⇒ hoãn 15s.
   */
  const suKienNen = {
    sender: { send: (kenh: string, duLieu: unknown) => phatNenTho(kenh, duLieu), isDestroyed: () => false },
  } as unknown as IpcMainInvokeEvent;
  datBoChayHen(async (hen) => {
    /* Đợt 4: hẹn nạp lại sau lúc tắt (chưa gắn cuộc) ⇒ tìm cuộc đang mở phiên đó, không có thì
       mở phiên vào một cuộc NỀN (kết quả lưu vào việc đó; mở lịch sử là thấy). */
    if (!hen.cuocId) {
      if (!hen.phienId) return 'hoan';
      let id = cuocCuaPhien(hen.phienId);
      if (!id) {
        const p = await docPhien(hen.phienId);
        if (!p) { hen.conLai = 0; return 'chay'; }
        id = taoCuoc();
        napPhien(id, p.id, p.hoiThoai, p.duAn, p.goc ?? null);
      } else {
        ganHenChoCuoc(id, hen.phienId);
      }
      if (!hen.cuocId) hen.cuocId = id;
    }
    if (cuocDangChay(hen.cuocId)) return 'hoan';
    const cau = cauDanhThuc(hen);
    phatNen(hen.cuocId, { loai: 'tuDanhThuc', cauHoi: cau, henId: hen.id });
    void chayCho(hen.cuocId, cau, undefined, suKienNen, false).catch((e: Error) => {
      phatNen(hen.cuocId, { loai: 'loi', thongDiep: `Lượt hẹn không chạy được: ${e.message}`, ma: 'HEN_LOI' });
    });
    return 'chay';
  });

  /* Đợt 4: hẹn sống qua lúc tắt — lưu ở thư mục dữ liệu, nạp phần của tiến trình đã tắt. */
  datNoiLuuHen(path.join(app.getPath('userData'), 'agent-hen.json'));
  try { napHenDaLuu(); } catch { /* file hỏng không được chặn app khởi động */ }
  handle('agent:henLo', () => ({ ds: dsHenLo().map(({ id, lyDo, luc, cron, goc }) => ({ id, lyDo, luc, ...(cron ? { cron } : {}), goc: goc ?? null })) }));
  handle('agent:xuLyHenLo', ({ cach }) => ({ n: xuLyHenLo(cach) }));

  /* Đợt 4: gõ thêm khi agent đang chạy ⇒ chèn vào lượt (mốc tool kế tiếp). `chen:false` = không chạy, gửi như lượt mới. */
  handle('agent:chenTin', ({ cuocId, text }) => ({ chen: chenTinCua(cuocId, text) }));

  /* Đợt 4: điều khiển máy tính — bật/tắt + trạng thái quyền (macOS). */
  handle('agent:mayTinh', async ({ bat }) => {
    const b = typeof bat === 'boolean' ? datMayTinh(bat) : mayTinhDangBat();
    const ht = mayHoTro();
    return { bat: b, hoTro: ht, nenTang: process.platform, quyen: ht && process.platform === 'darwin' ? await kiemQuyenMay().catch(() => null) : null };
  });

  handle('agent:traLoiHoi', ({ cuocId: _c, id, traLoi: tl }) => traLoiHoi(id, tl ?? null));
  handle('agent:huyCho', ({ cuocId, id, cach }) => huyCho(cuocId, id, cach ?? 'boCho'));
  handle('agent:huyHen', ({ cuocId, id }) => huyHen(cuocId, id));
  handle('agent:henCho', ({ cuocId }) => {
    const h = henChoCua(cuocId);
    return { cho: h.cho, hen: h.hen.map(({ id, lyDo, luc, phut, lap, conLai, cron }) => ({ id, lyDo, luc, phut, lap, conLai, ...(cron ? { cron } : {}) })) };
  });
  handle('agent:dsPhienMang', ({ cuocId }) => {
    const bo = (m: ReturnType<typeof dsPhienSong>[number]) => ({
      id: m.id, cuocId: m.cuocId, pid: m.pid, ten: m.ten, noi: m.noi, thuMuc: m.thuMuc, trangThai: m.trangThai, capNhat: m.capNhat,
    });
    const toi = toiLa(cuocId);
    return {
      toi: toi ? bo(toi) : null,
      ds: dsPhienSong().filter((m) => !(m.pid === process.pid && m.cuocId === cuocId)).map(bo),
    };
  });
  handle('agent:doiTenPhienMang', ({ cuocId, ten }) => {
    const m = doiTenPhienMang(cuocId, ten);
    return m ? { id: m.id, cuocId: m.cuocId, pid: m.pid, ten: m.ten, noi: m.noi, thuMuc: m.thuMuc, trangThai: m.trangThai, capNhat: m.capNhat } : null;
  });
  handle('agent:themTienTo', ({ cuocId, tienTo }) => themTienToCua(cuocId, tienTo));

  handle('agent:send', async ({ cuocId, text, anh, chiDoc }, event) => {
    await chayCho(cuocId, text, anh, event, false, chiDoc === true);
  });

  /* ── Lệnh `/` cần main (03/10/2026) ─────────────────────────── */

  handle('agent:datEpCucBo', ({ cuocId, bat }) => {
    if (bat === true) epCucBo.add(cuocId);
    else if (bat === false) epCucBo.delete(cuocId);
    return { bat: epCucBo.has(cuocId) };
  });

  handle('agent:nguCanhChiTiet', ({ cuocId }) => nguCanhChiTietCua(cuocId));

  handle('agent:compact', async ({ cuocId, ghiChu }) => {
    if (cuocDangChay(cuocId)) return { ok: false as const, loi: 'Việc này đang chạy — đợi lượt xong rồi /compact.' };
    const phien = readStoredSession();
    if (!phien) return { ok: false as const, loi: 'Chưa đăng nhập.' };
    const truoc = nguCanhChiTietCua(cuocId);
    /* Đợt 4 — hook `truocNen` (PreCompact): đầu ra nối vào lời dặn cho bản tóm tắt; `chan` ⇒ huỷ nén. */
    let dan = ghiChu ?? '';
    const gocNen = gocCua(cuocId);
    if (gocNen) {
      const dk = new AbortController();
      const hen = setTimeout(() => dk.abort(), 120_000);
      const h = await chayHook({ moc: 'truocNen', goc: gocNen, signal: dk.signal, env: { CUONGMINI_GHI_CHU: dan.slice(0, 2000) } }).catch(() => null);
      clearTimeout(hen);
      if (h?.chan) return { ok: false as const, loi: `Hook truocNen chặn /compact:\n${h.ra.slice(0, 1500)}` };
      if (h?.ra) dan = `${dan}${dan ? '\n\n' : ''}${h.ra.slice(0, 3000)}`;
    }
    const kq = await goiCompact({
      origin: API_ORIGIN, token: phien.sessionToken, hoiThoai: hoiThoaiCua(cuocId),
      ...(dan ? { ghiChu: dan.slice(0, 2000) } : {}),
    });
    if (!kq.ok) return kq;
    if (!('tomTat' in kq)) return { ok: true as const, soTinDaGop: 0 };
    /* Lượt mới có thể đã bắt đầu trong lúc chờ máy chủ — chỉ gắn khi hội
       thoại còn đúng như lúc gửi đi (dài hơn thì vẫn khớp: chỉ nối thêm). */
    if (cuocDangChay(cuocId)) return { ok: false as const, loi: 'Một lượt mới đã bắt đầu — thử /compact lại sau.' };
    datTomTatCua(cuocId, kq.tomTat);
    const sau = nguCanhChiTietCua(cuocId);
    return {
      ok: true as const, soTinDaGop: kq.soTinDaGop, soLuotDaGop: kq.soLuotDaGop, xemTruoc: kq.xemTruoc,
      kyTuTruoc: truoc.tongGui, kyTuSau: sau.tongGui,
    };
  });

  handle('agent:chanDoan', async ({ cuocId }) => {
    const phien = readStoredSession();
    const s = getSettings() as Record<string, unknown>;
    return chanDoan({
      origin: API_ORIGIN,
      token: phien?.sessionToken ?? null,
      phienBan: app.getVersion(),
      nenTang: `${process.platform}-${process.arch}`,
      goc: gocCua(cuocId),
      matMang: () => dangMatMang(),
      aiCucBo: async () => {
        const c = await modelChoCode();
        return c ? { ma: c.ma ?? null, ...(c.ten ? { ten: c.ten } : {}), ...(c.vi ? { vi: c.vi } : {}) } : null;
      },
      aiCucBoBat: s.aiCucBoBat !== false,
      quyenThuMuc: async (goc) => ({
        doc: await fs.access(goc, fsConstants.R_OK).then(() => true, () => false),
        ghi: await fs.access(goc, fsConstants.W_OK).then(() => true, () => false),
      }),
    });
  });

  handle('agent:lamTiep', async ({ cuocId }, event) => {
    await chayCho(cuocId, '', undefined, event, true);
  });

  handle('agent:cancel', ({ cuocId }) => {
    huyLuotCua(cuocId);
    /**
     * ⚠️ PHẢI dừng cả LỆNH NỀN, không chỉ huỷ luồng LLM.
     *
     * `huyLuotCua` abort lời gọi model và giải phóng thẻ xin phép — nhưng
     * tiến trình mà agent đã bật (`npm install`, `npm run dev`, một bản dựng)
     * VẪN CHẠY TIẾP. Người dùng bấm Dừng, chữ ngừng chảy, mà máy vẫn quay và
     * bước đó vẫn "đang chạy" — đúng thứ người dùng báo 14/09/2026:
     * *"ấn dừng không được và bị đơ ở bước chạy đó"*.
     *
     * `dongCuoc()` đã gọi cả hai từ lâu; chỗ này thì quên — mà đây mới là chỗ
     * người dùng bấm hằng ngày.
     */
    dungLenhNenCua(cuocId);
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

  handle('agent:datCheDoTrinhDuyet', async ({ cuocId, bat }): Promise<AgentWorkspace> => {
    if (cuocDangChay(cuocId)) throw new Error('Việc này đang chạy dở — hãy dừng trước khi đổi quyền ghi ghi chú.');
    datQuyenChoCuoc(cuocId, { choTrinhDuyet: bat });
    return moTa(cuocId, gocCua(cuocId));
  });
  /*
   * Kho kỹ năng — chỉ mục lấy từ CHÍNH WEB của người dùng, nội dung lấy từ
   * GitHub. Cả hai gọi ở tiến trình CHÍNH: renderer bị CSP chặn `connect-src`
   * ra ngoài, và lỗi hiện ra chỉ là "Failed to fetch" không nhắc gì tới CSP.
   */
  handle('agent:khoTim', async ({ cuocId, tuKhoa }) => {
    void cuocId;
    return tim(await napChiMuc(WEB_ORIGIN), tuKhoa);
  });

  handle('agent:khoCai', async ({ cuocId, ten, loai, ghiDe }) => {
    const m = (await napChiMuc(WEB_ORIGIN)).find((x) => x.ten === ten && x.loai === loai);
    if (!m) return { ok: false, loi: `Không có "${ten}" (${loai}) trong kho.` };
    return cai(gocCua(cuocId), m, { ghiDe: ghiDe === true });
  });

  handle('agent:dsQuyenLau', ({ cuocId }) => dsQuyenLauCua(cuocId));

  handle('agent:xoaQuyenLau', ({ cuocId, khoa }) => xoaQuyenLauCua(cuocId, khoa));

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

  handle('agent:doiTenPhien', ({ id, ten }) => doiTenPhien(id, ten));
  handle('agent:ghimPhien', ({ id, bat }) => datGhimPhien(id, bat));
  handle('agent:luuTruPhien', ({ id, bat }) => datLuuTruPhien(id, bat));
  /* Chỉ TẠO file bản sao. Mở nó vào tab nào là việc của renderer — main không
     biết người dùng đang nhìn tab nào, và đoán sai thì bản nhánh đè lên việc
     họ đang chạy dở ở tab khác. */
  handle('agent:nhanBanPhien', ({ id, denCauHoi }) => nhanBanPhien(id, denCauHoi));
  handle('agent:tachNhanhCuoc', ({ cuocId, denCauHoi }) => tachNhanhCuoc(cuocId, denCauHoi));

  /* Lỗi trả về DẠNG DỮ LIỆU chứ không ném: đính kèm hỏng (file to quá, đĩa
     đầy, chưa chọn thư mục) là chuyện thường và giao diện phải nói được lý do
     ngay cạnh cái file đó — một exception qua IPC chỉ còn lại chuỗi thông
     điệp, và renderer không biết nó thuộc file nào. */
  handle('agent:datCheDoQuyen', async ({ cuocId, cheDo }): Promise<AgentWorkspace> => {
    // Đang chạy dở thì KHÔNG cho đổi — cùng lý do `datCheDoSua` chặn: đổi
    // quyền giữa lượt nghĩa là nửa đầu chạy theo luật này, nửa sau luật khác,
    // và người dùng không có cách nào biết ranh giới nằm ở đâu.
    if (cuocDangChay(cuocId)) throw new Error('Việc này đang chạy dở — hãy dừng trước khi đổi chế độ.');
    datCheDoQuyen(cuocId, cheDo);
    return moTa(cuocId, gocCua(cuocId));
  });

  handle('agent:themDinhKem', async ({ cuocId, ten, duLieuBase64 }) => {
    const goc = gocCuaCuoc(cuocId);
    if (!goc) return { ok: false as const, loi: 'Chưa chọn thư mục dự án cho tab này.' };
    try {
      const r = await datDinhKem(goc, ten, duLieuBase64);
      return { ok: true as const, ...r };
    } catch (e) {
      return { ok: false as const, loi: (e as Error).message };
    }
  });

  handle('agent:themDuong', async ({ cuocId, duong }) => {
    const goc = gocCuaCuoc(cuocId);
    if (!goc) return { ok: false as const, loi: 'Chưa chọn thư mục dự án cho tab này.' };
    try {
      const r = await datDinhKemTuDuong(goc, duong);
      return { ok: true as const, ...r };
    } catch (e) {
      return { ok: false as const, loi: (e as Error).message };
    }
  });

  handle('anh:chuanHoa', async (nguon) => {
    try {
      const { chuanHoaAnh, TRAN_BYTE_VAO } = await import('../agent/anhLa');
      let byte: Buffer;
      if ('duong' in nguon) {
        const st = await fs.stat(nguon.duong);
        if (!st.isFile()) return { ok: false as const, loi: 'Không phải file.' };
        if (st.size > TRAN_BYTE_VAO) return { ok: false as const, loi: `Ảnh nặng ${(st.size / 1048576).toFixed(0)}MB — quá trần.` };
        byte = await fs.readFile(nguon.duong);
      } else {
        byte = Buffer.from(nguon.bytes.buffer, nguon.bytes.byteOffset, nguon.bytes.byteLength);
      }
      const r = await chuanHoaAnh(byte);
      return {
        ok: true as const,
        dataUrl: `data:${r.media};base64,${r.data.toString('base64')}`,
        byte: r.data.length, rong: r.rong, cao: r.cao, goc: r.goc,
      };
    } catch (e) {
      return { ok: false as const, loi: (e as Error).message };
    }
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

  handle('agent:veCongChinh', ({ cuocId }) => {
    veCongChinh(cuocId);
  });

  /*
   * ── CỔNG CLAUDE CHÍNH HÃNG (17/10/2026) ──
   * Hợp đồng: `docs/cong-anthropic-chinh-hang.md`. Main gọi máy chủ bằng phiên
   * đăng nhập của CHÍNH app (renderer, extension VS Code, CLI không cầm token),
   * và giữ vé trong thiết đặt `agentAnthropicVe` — `loop.ts` gửi kèm mọi lượt.
   * Chạy được cả trong lõi ngoài Electron (`packages/cuongmini-core`): chỉ dùng
   * `fetch`, `readStoredSession` và `store`, không API Electron nào.
   */
  handle('agent:moCongAnthropic', async ({ matKhau }) => {
    const phien = readStoredSession();
    if (!phien?.sessionToken) throw new Error('Chưa đăng nhập.');
    const r = await fetch(`${API_ORIGIN}/api/v1/agent/cong-anthropic/mo-khoa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${phien.sessionToken}` },
      body: JSON.stringify({ matKhau }),
      signal: AbortSignal.timeout(20_000),
    });
    const j = await r.json().catch(() => ({})) as {
      data?: { ve?: string; hetHan?: number }; message?: string; code?: string; error?: { message?: string };
    };
    if (!r.ok || !j.data?.ve) {
      if (r.status === 404) throw new Error('Máy chủ chưa có cổng Claude chính hãng (bản máy chủ cũ).');
      throw new Error(j.error?.message ?? j.message ?? `Máy chủ trả HTTP ${r.status}.`);
    }
    setSetting('agentAnthropicVe', j.data.ve);
    return { ten: 'Claude chính hãng', hetHan: typeof j.data.hetHan === 'number' ? j.data.hetHan : null };
  });

  handle('agent:congAnthropic', async (): Promise<AgentCongAnthropic | null> => {
    const phien = readStoredSession();
    if (!phien?.sessionToken) return null;
    const ve = veAnthropic();
    const veDp = getSettings().agentDuPhongVe;
    const q = new URLSearchParams();
    if (ve) q.set('ve', ve);
    if (typeof veDp === 'string' && veDp) q.set('veDuPhong', veDp);
    try {
      const r = await fetch(`${API_ORIGIN}/api/v1/agent/cong-anthropic${q.size ? `?${q}` : ''}`, {
        headers: { Authorization: `Bearer ${phien.sessionToken}` },
        signal: AbortSignal.timeout(10_000),
      });
      if (!r.ok) return null;
      const j = await r.json() as { data?: Omit<AgentCongAnthropic, 'coVe'> };
      return j.data ? { ...j.data, coVe: Boolean(ve) } : null;
    } catch {
      return null;
    }
  });

  handle('agent:datCongPhu', ({ cuocId, cong, model }) => {
    if (model) setSetting('agentDuPhongModel', model);
    datCongPhuCua(cuocId, cong);
  });

  handle('agent:hoanTac', async ({ cuocId }) => {
    // Huỷ lượt trước: hoàn tác trong lúc agent vẫn đang ghi tiếp là chạy đua
    // với chính nó, và bên thắng là bên ghi sau.
    huyLuotCua(cuocId);
    return hoanTacTatCa(soCuaCuoc(cuocId));
  });

  /*
   * Lùi FILE về trước câu hỏi thứ `k`. Anh em với `agent:hoanTac`, khác ở chỗ
   * nó có ĐIỂM DỪNG: hoàn tác bỏ mọi thứ từ đầu cuộc, cái này chỉ bỏ từ mốc đó
   * trở đi — agent làm đúng 5 việc rồi hỏng ở việc thứ 6 thì giữ lại được 5.
   */
  /* Gợi ý `@`. Chưa mở dự án thì trả MẢNG RỖNG chứ không ném: ô soạn gọi cái
     này ở mỗi phím gõ, và một ngoại lệ mỗi phím sẽ ngập log mà không giúp gì. */
  handle('agent:timFile', async ({ cuocId, tim }) => {
    const goc = gocCuaCuoc(cuocId);
    if (!goc) return [];
    return timFileGoiY(goc, tim);
  });

  handle('agent:lenhDuAn', async ({ cuocId }) => {
    const goc = gocCuaCuoc(cuocId);
    if (!goc) return [];
    return docLenhDuAn(goc);
  });

  handle('agent:luiFile', async ({ cuocId, k }) => {
    // Cùng lý do như hoàn tác: lùi trong lúc agent còn đang ghi là chạy đua với
    // chính nó, và bên ghi SAU thắng.
    huyLuotCua(cuocId);
    return luiFileVeLuot(soCuaCuoc(cuocId), k);
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

  handle('agent:mcpNapLai', async ({ cuocId }): Promise<AgentMcpTrangThai> => {
    // Nạp theo DỰ ÁN của tab đang hỏi: `.mcp.json` là của dự án.
    await napDemBiMat().catch(() => {});
    await napLaiMcp(cuocId ? gocCua(cuocId) : null);
    return trangThaiMcp();
  });

  /*
   * Duyệt `.mcp.json` của dự án rồi nạp lại NGAY.
   *
   * Duyệt xong mà không nạp thì người dùng bấm "Duyệt", bảng vẫn ghi "cần
   * duyệt", và họ bấm tiếp — không có gì nói rằng phải bấm thêm "Nạp lại".
   */
  handle('agent:mcpDuyetDuAn', async ({ cuocId }): Promise<AgentMcpTrangThai> => {
    const goc = gocCua(cuocId);
    await duyetDuAn(goc);
    await napLaiMcp(goc);
    return trangThaiMcp();
  });

  handle('agent:hookMoCauHinh', async () => {
    // Đọc một lần trước khi mở: `docHook` tự ghi file mẫu khi chưa có. Mở một
    // file không tồn tại thì hệ điều hành báo lỗi cụt lủn — cùng lý do như MCP.
    await docHook().catch(() => []);
    await shell.openPath(duongHook());
  });

  /* Người dùng vừa sửa file xong ⇒ phải QUÊN nhớ đệm rồi mới đếm, nếu không
     con số trả về là của bản cũ và họ tưởng file mình sửa không ăn. */
  handle('agent:hookDem', async ({ cuocId }) => {
    quenDemHook();
    return (await docHook(cuocId ? gocCua(cuocId) : null)).length;
  });

  handle('agent:hookChoDuyet', ({ cuocId }) => dsHookChoDuyet(gocCua(cuocId)));

  handle('agent:hookDuyetDuAn', ({ cuocId }) => duyetHookDuAn(gocCua(cuocId)));

  handle('agent:hookNhatKy', () => docNhatKy());

  /*
   * Chạy thử. Đọc lại cấu hình TRƯỚC (quên nhớ đệm): người ta bấm nút này ngay
   * sau khi vừa sửa file, và trả kết quả của bản cũ là câu trả lời sai cho đúng
   * câu hỏi họ đang hỏi.
   *
   * Trần 10 phút bằng đúng trần một lệnh thật, để phép thử phản ánh đúng thứ sẽ
   * xảy ra trong lượt thật.
   */
  handle('agent:hookThu', async ({ cuocId, moc, tenTool }) => {
    const goc = gocCuaCuoc(cuocId);
    if (!goc) return { chan: false, ra: 'Chưa chọn thư mục dự án — hook cần một chỗ để chạy.', goc: null, soKhop: 0 };
    quenDemHook();
    const dieuKhien = new AbortController();
    const hetGio = setTimeout(() => dieuKhien.abort(), 10 * 60 * 1000);
    try {
      const kq = await chayHook({ moc, goc, tenTool, signal: dieuKhien.signal });
      return {
        ...kq,
        goc,
        /* Phân biệt RÕ hai trường hợp cùng cho `ra` rỗng — đó là cả lý do phép
           thử này tồn tại. Gộp lại thì người dò cấu hình không biết mình sai
           `khop` hay hook vốn im lặng. */
        ra: kq.ra !== ''
          ? kq.ra
          : kq.soKhop === 0
            ? 'KHÔNG hook nào khớp mốc và tên tool này — kiểm lại trường "khop" (và "duAn").'
            : `${kq.soKhop} hook khớp và đã chạy xong, nhưng không in ra gì (mã thoát 0). Xem "Lần chạy gần đây" bên dưới.`,
      };
    } finally {
      clearTimeout(hetGio);
    }
  });

  /* Đợt 4: `/mcp` menu — tool của server (tên + mô tả ngắn) và bật/tắt server. */
  handle('agent:mcpTool', ({ ten }) => toolMcpHienCo().filter((t) => !ten || t.server === ten).map((t) => ({ server: t.server, ten: t.tenGoc, moTa: t.moTa.split('\n')[0]!.slice(0, 160) })));
  handle('agent:mcpBatTat', async ({ cuocId, ten, bat }) => {
    const r = await batTatServer(ten, bat, cuocId ? gocCuaCuoc(cuocId) : null);
    return { ...r, trangThai: trangThaiMcp() };
  });

  handle('agent:boNhoDs', async ({ cuocId }) => dsDeGiaoDien(gocCuaCuoc(cuocId)));
  handle('agent:boNhoXoa', async ({ cuocId, id }) => quenBaiHoc(gocCuaCuoc(cuocId), id, 'người dùng xoá ở tab Bộ nhớ'));

  handle('agent:kyNangDs', async ({ cuocId }) => {
    // Kể cả chưa mở dự án: vẫn có bộ kỹ năng cài sẵn.
    return dsKyNang(gocCuaCuoc(cuocId));
  });

  /* ── Đợt 3: CT Work một chạm (`/ctwork`, nút trong bảng MCP) ── */
  void napDemBiMat().catch(() => {});
  handle('agent:ctwork', async ({ cuocId, viec, quyen }) => {
    await napDemBiMat().catch(() => {});
    const goc = cuocId ? gocCua(cuocId) : null;
    if (viec === 'trangThai') return { ok: true, ...(await trangThaiCtwork()) };
    const phien = readStoredSession();
    if (viec === 'ngat') return ngatCtwork(phien?.sessionToken ?? null, goc);
    if (!phien) return { ok: false, loi: 'Chưa đăng nhập CuongThai.' };
    if (viec === 'capLai') return capLaiCtwork(phien.sessionToken, goc);
    return ketNoiCtwork(phien.sessionToken, quyen === 'ghi' ? 'ghi' : 'doc', goc);
  });

  /* ── Đợt 5: CT Work hệ sinh thái (`agent/ctworkHe.ts`) ── */
  handle('agent:ctworkHe', async (v) => {
    datNgonNguCtw(v.ngonNgu);
    const goc = v.cuocId ? gocCua(v.cuocId) : null;
    switch (v.viec) {
      case 'goiY': {
        /* Hỏi MỘT lần: (1) đã đăng nhập mà chưa có CT Work ⇒ "Kết nối CT Work?"; (2) token hết hạn/bị thu hồi
           ⇒ cấp lại một chạm; (3) đã nối, thư mục chưa gắn mà AGENTS.md nói rõ dự án ⇒ hỏi xác nhận. */
        await napDemBiMat().catch(() => {});
        // Lần nạp MCP lúc mở còn chạy ⇒ đợi (tối đa 8 giây) để biết server CT Work đã nối chưa.
        await Promise.race([choNapMcp().catch(() => undefined), new Promise((ok) => { const t = setTimeout(ok, 8000); t.unref?.(); })]);
        const coPhien = Boolean(readStoredSession());
        const sv = trangThaiServer().find((s) => s.ten === TEN_CTWORK);
        if (coPhien && await canCapLai()) return { ok: true, hoi: 'capLai' as const };
        if (coPhien && !sv && !(await docBiMat()) && !process.env.CTWORK_TOKEN && getSettings().ctworkDaHoi !== true) return { ok: true, hoi: 'ketNoi' as const };
        if (sv?.ok && goc && !(await ctw.docGan(goc)) && !(await ctw.daHoiGan(goc))) {
          const doan = await ctw.doanGan(goc);
          if (doan) return { ok: true, hoi: 'ganDuAn' as const, doan };
        }
        return { ok: true, hoi: null };
      }
      case 'daHoi':
        if (v.loai === 'ketNoi') setSetting('ctworkDaHoi', true);
        else if (v.loai === 'ganDuAn' && goc) await ctw.ghiDaHoiGan(goc);
        return { ok: true };
      case 'docGan': return { ok: true, gan: await ctw.docGan(goc) };
      case 'doan': return { ok: true, doan: await ctw.doanGan(goc) };
      case 'dsDuAn': {
        if (!ctw.ctworkSan()) return { ok: false, loi: 'Chưa kết nối CT Work.' };
        const r = await ctw.dsDuAn();
        return { ok: r.ok, ds: r.ds, ...(r.loi ? { loi: r.loi } : {}) };
      }
      case 'gan': {
        if (!goc) return { ok: false, loi: 'Chưa mở thư mục dự án.' };
        if (!v.duAn) return { ok: false, loi: 'Thiếu dự án.' };
        const g = ctw.ganTuDuAn({
          key: v.duAn.key, ten: v.duAn.ten ?? '', id: v.duAn.id ?? null, workspaceId: v.duAn.workspaceId ?? null,
          workspace: v.duAn.workspace ?? null, vaiTro: null, soMo: null, luuTru: false,
        });
        const r = await ctw.ghiGan(goc, g);
        await ctw.ghiDaHoiGan(goc);
        return { ok: true, gan: g, duong: r.duong, goiYGitignore: r.goiYGitignore };
      }
      case 'boGan': {
        if (!goc) return { ok: false, loi: 'Chưa mở thư mục dự án.' };
        await fs.rm(path.join(goc, '.cuongmini', 'ctwork.json'), { force: true });
        await ctw.ghiDaHoiGan(goc);
        return { ok: true };
      }
      case 'dong': return { ok: true, dong: await ctw.dongTrangThai(goc) };
      case 'sprint': return ctw.xemSprint(goc);
      case 'viec': return ctw.xemViecToi(goc);
      case 'the': return ctw.xemThe(goc, v.key);
      case 'hop': return ctw.xemHop(goc);
      case 'chuanBiBatDau': return ctw.chuanBiBatDau(goc, v.key);
      case 'batDau': return ctw.batDauThe(goc, v.key, { nhanh: v.nhanh !== false, chuyen: v.chuyen !== false });
      case 'gio': return ctw.ghiGio(goc, v.key, v.phut ?? 0, v.noiDung);
      case 'soanBinhLuan': return ctw.soanBinhLuan(goc, v.key);
      case 'binhLuan': return ctw.guiBinhLuan(goc, v.key, v.noiDung ?? '');
      case 'baoCao': return ctw.baoCaoTuan(goc);
      case 'tuGhi':
        /* ⛔ Chỉ main ghi (`KHOA_CHI_MAIN`): bật là agent GHI lên CT Work không hỏi. */
        if (typeof v.bat === 'boolean') setSetting('ctworkTuGhi', v.bat);
        return { ok: true, bat: getSettings().ctworkTuGhi === true };
      default: return { ok: false, loi: 'Việc không hợp lệ.' };
    }
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
    loiCauHinh: loiCauHinh(),
  };
}

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
import { BrowserWindow, dialog } from 'electron';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import type { AgentInfo, AgentQuota, AgentWorkspace } from '../../shared/ipc';
import { API_ORIGIN } from '../config';
import { getSettings, setSetting } from '../store';
import { chayLuot, dangChayKhong, huyLuot, xoaHoiThoai, type SuKienAgent } from '../agent/loop';
import { readStoredSession } from './auth';
import { handle } from './index';

const chay = promisify(execFile);

/**
 * Ước lượng token cho MỘT việc, đo thật 17/08/2026 trên mã nguồn thật.
 * Dùng để đổi "còn 3,4 triệu token" thành "còn ~19 việc" — con số duy nhất
 * người dùng thật sự hiểu. Lấy mức việc VỪA (12 bước) làm chuẩn.
 */
const TOKEN_MOI_VIEC = 141_000;

function thuMucHienTai(): string | null {
  const v = getSettings().agentWorkspace;
  return typeof v === 'string' && v.length > 0 ? v : null;
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

async function moTa(goc: string | null): Promise<AgentWorkspace> {
  if (!goc) return { path: null, name: null, branch: null };
  return {
    path: goc,
    name: path.basename(goc),
    branch: await nhanhGit(goc),
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

      const tools = await rTools.json() as { data?: { pro?: boolean; configured?: boolean; model?: string } };
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
      };
    } catch {
      // Mất mạng. KHÔNG ném — màn hình agent vẫn phải mở được để người dùng
      // nhìn thấy lịch sử phiên trước, chỉ là không gửi được câu mới.
      return trong;
    }
  });

  handle('agent:getWorkspace', async (): Promise<AgentWorkspace> => {
    const goc = thuMucHienTai();
    if (goc && !(await conDungDuoc(goc))) {
      setSetting('agentWorkspace', '');
      return moTa(null);
    }
    return moTa(goc);
  });

  handle('agent:chooseWorkspace', async (): Promise<AgentWorkspace> => {
    const cuaSo = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
    const cu = thuMucHienTai();
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
    if (ketQua.canceled || !goc) return moTa(cu);

    setSetting('agentWorkspace', goc);
    // Đổi thư mục = đổi cả bối cảnh. Giữ lại hội thoại cũ thì agent vẫn tin vào
    // những file nó đọc ở dự án TRƯỚC, và trả lời về một dự án không còn mở.
    xoaHoiThoai();
    return moTa(goc);
  });

  handle('agent:clearWorkspace', async (): Promise<AgentWorkspace> => {
    setSetting('agentWorkspace', '');
    xoaHoiThoai();
    return moTa(null);
  });

  handle('agent:send', async ({ text }, event) => {
    if (dangChayKhong()) throw new Error('Đang có một lượt chạy dở. Hãy dừng nó trước.');

    const goc = thuMucHienTai();
    const conSong = goc && (await conDungDuoc(goc)) ? goc : null;
    if (goc && !conSong) setSetting('agentWorkspace', '');

    // Bắn thẳng về đúng cửa sổ đã gửi yêu cầu, không phải "mọi cửa sổ": nếu sau
    // này app có nhiều cửa sổ thì tiến trình của cửa sổ này không được rơi vào
    // khung chat của cửa sổ kia.
    const guiVe = event.sender;
    const phat = (e: SuKienAgent): void => {
      if (!guiVe.isDestroyed()) guiVe.send('agent:event', e);
    };

    const nhanh = conSong ? await nhanhGit(conSong) : null;
    await chayLuot(text, { goc: conSong, ...(nhanh ? { nhanh } : {}) }, phat);
  });

  handle('agent:cancel', () => {
    huyLuot();
  });

  handle('agent:reset', () => {
    huyLuot();
    xoaHoiThoai();
  });
}

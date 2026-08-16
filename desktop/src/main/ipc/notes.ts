/**
 * Kho ghi chú trên đĩa.
 *
 * Đây là nơi DUY NHẤT trong app ghi file vào thư mục của người dùng, nên nó
 * được viết với giả định renderer đã bị chiếm.
 *
 * ─── Vì sao không nhận đường dẫn từ renderer ───
 * Renderer chỉ gửi TÊN FILE. Thư mục gốc do main giữ và chỉ đổi được qua hộp
 * thoại hệ thống mà người dùng tự bấm. Nếu renderer đặt được đường dẫn thì một
 * lỗi XSS trong nội dung ghi chú (nội dung do máy chủ trả về!) đọc/ghi được cả
 * ổ đĩa — kể cả `~/.ssh/authorized_keys`.
 *
 * ─── Ba lớp kiểm, độc lập nhau ───
 *  1. zod ở hợp đồng: chặn `..`, dấu phân cách, ký tự điều khiển, ép đuôi `.md`
 *  2. `resolveInside()` dưới đây: resolve rồi ĐỐI CHIẾU lại với thư mục gốc
 *  3. `realpath`: bắt symlink trỏ ra ngoài — một file `note.md` có thể là liên
 *     kết mềm tới `/etc/passwd`, và hai lớp trên đều không thấy điều đó
 */
import { app, dialog, shell } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { NoteFileInfo, NotesFolder } from '../../shared/ipc';
import { getSettings, setSetting } from '../store';
import { handle } from './index';

/** Đọc thư mục đã chọn. `null` nếu người dùng chưa chọn bao giờ. */
function currentFolder(): string | null {
  const value = getSettings().notesFolder;
  return typeof value === 'string' && value.length > 0 ? value : null;
}

/**
 * Ghép tên file vào thư mục gốc và chứng minh kết quả nằm TRONG gốc.
 *
 * `path.resolve` tự rút gọn `..`, nên phép so sánh sau đó mới có ý nghĩa. Thiếu
 * bước đối chiếu này thì `path.join(root, '../../x')` cho ra một đường dẫn hoàn
 * toàn hợp lệ nằm ngoài thư mục — và không có gì báo lỗi.
 */
function resolveInside(root: string, fileName: string): string {
  const resolved = path.resolve(root, fileName);
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (!resolved.startsWith(rootWithSep)) {
    throw new Error('Đường dẫn nằm ngoài thư mục ghi chú.');
  }
  return resolved;
}

/**
 * Chặn symlink trỏ ra ngoài.
 *
 * Chỉ kiểm khi file ĐÃ tồn tại — file mới thì chưa có gì để lần theo. Đây là
 * lớp mà hai lớp kia không thay được: `note.md` có thể là liên kết mềm tới bất
 * cứ đâu, và mọi phép kiểm chuỗi đều thấy nó hợp lệ.
 */
async function assertNotEscapingSymlink(root: string, target: string): Promise<void> {
  try {
    const real = await fs.realpath(target);
    const realRoot = await fs.realpath(root);
    const rootWithSep = realRoot.endsWith(path.sep) ? realRoot : realRoot + path.sep;
    if (!real.startsWith(rootWithSep)) {
      throw new Error('File này là liên kết trỏ ra ngoài thư mục ghi chú.');
    }
  } catch (error) {
    // ENOENT = file chưa tồn tại, hoàn toàn bình thường khi tạo mới.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

/** Yêu cầu đã có thư mục. Gọi trước mọi thao tác file. */
function requireFolder(): string {
  const folder = currentFolder();
  if (!folder) {
    throw new Error('Chưa chọn thư mục lưu ghi chú. Vào Cài đặt để chọn.');
  }
  return folder;
}

async function countNoteFiles(folder: string): Promise<number> {
  try {
    const entries = await fs.readdir(folder);
    return entries.filter((name) => name.toLowerCase().endsWith('.md')).length;
  } catch {
    return 0;
  }
}

export function registerNotesHandlers(): void {
  handle('notes:getFolder', async (): Promise<NotesFolder> => {
    const folder = currentFolder();
    return {
      path: folder,
      fileCount: folder ? await countNoteFiles(folder) : 0,
    };
  });

  handle('notes:chooseFolder', async (): Promise<NotesFolder> => {
    const result = await dialog.showOpenDialog({
      title: 'Chọn thư mục lưu ghi chú',
      // `createDirectory` để người dùng tạo thư mục mới ngay trong hộp thoại
      // thay vì phải thoát ra Finder/Explorer làm rồi quay lại.
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: currentFolder() ?? path.join(app.getPath('documents'), 'CuongThai Notes'),
      buttonLabel: 'Chọn thư mục này',
    });

    if (result.canceled || result.filePaths.length === 0) {
      // Huỷ KHÔNG xoá lựa chọn cũ — bấm nhầm rồi mất thư mục đã cấu hình là
      // hành vi khó chịu và không lùi được.
      return { path: currentFolder(), fileCount: 0 };
    }

    const chosen = result.filePaths[0]!;
    // Chứng minh ghi được TRƯỚC khi lưu lựa chọn. Không kiểm thì người dùng chỉ
    // phát hiện thư mục chỉ-đọc vào lúc mất bản nháp đầu tiên.
    await fs.access(chosen, (await import('node:fs')).constants.W_OK);

    setSetting('notesFolder', chosen);
    return { path: chosen, fileCount: await countNoteFiles(chosen) };
  });

  handle('notes:listFiles', async (): Promise<NoteFileInfo[]> => {
    const folder = requireFolder();
    const entries = await fs.readdir(folder, { withFileTypes: true });

    const files = await Promise.all(
      entries
        // `isFile()` loại cả thư mục lẫn symlink — symlink tới file hợp lệ vẫn
        // bị bỏ qua ở đây, và đó là lựa chọn có chủ ý: liệt kê thứ ta không
        // chắc nằm trong thư mục là mời gọi rắc rối.
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
        .map(async (entry) => {
          const stat = await fs.stat(path.join(folder, entry.name));
          return {
            fileName: entry.name,
            size: stat.size,
            modifiedAt: stat.mtimeMs,
          };
        }),
    );

    return files.sort((a, b) => b.modifiedAt - a.modifiedAt);
  });

  handle('notes:readFile', async ({ fileName }): Promise<string | null> => {
    const folder = requireFolder();
    const target = resolveInside(folder, fileName);
    await assertNotEscapingSymlink(folder, target);
    try {
      return await fs.readFile(target, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  });

  handle('notes:writeFile', async ({ fileName, content }) => {
    const folder = requireFolder();
    const target = resolveInside(folder, fileName);
    await assertNotEscapingSymlink(folder, target);

    // Ghi qua file tạm rồi đổi tên. Mất điện giữa chừng thì bản cũ còn nguyên
    // thay vì thành một file cụt — đây là ghi chú của người dùng, không phải cache.
    const temp = `${target}.tmp`;
    await fs.writeFile(temp, content, 'utf-8');
    await fs.rename(temp, target);
  });

  handle('notes:deleteFile', async ({ fileName }) => {
    const folder = requireFolder();
    const target = resolveInside(folder, fileName);
    await assertNotEscapingSymlink(folder, target);

    // Đưa vào Thùng rác, KHÔNG xoá thẳng. Người dùng còn lấy lại được — và app
    // không có quyền quyết định thay họ rằng một ghi chú đáng biến mất vĩnh viễn.
    await shell.trashItem(target);
  });

  handle('notes:revealFolder', async () => {
    const folder = requireFolder();
    await shell.openPath(folder);
  });
}

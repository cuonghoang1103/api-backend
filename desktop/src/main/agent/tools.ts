/**
 * ============================================================
 * TOOL VÒNG 1 — đọc dự án trên máy người dùng
 * ============================================================
 *
 * Chạy ở MAIN process vì renderer không có `fs` (`sandbox: true`). Mọi đường
 * dẫn đi qua `jail.ts` — không có ngoại lệ nào, kể cả cho tool "chỉ liệt kê".
 *
 * ─── MỌI KẾT QUẢ ĐỀU BỊ CẮT, VÀ NÓI RÕ LÀ ĐÃ CẮT ───
 * Kết quả tool là thứ chở theo trong MỌI lượt gọi cổng sau đó, nên một lần
 * `read_file` trên file 8.000 dòng không tốn tiền một lần — nó tốn tiền ở mọi
 * lượt còn lại của việc đó. Trần dưới đây là chốt chặn chi phí đặt đúng chỗ rẻ
 * nhất: trước khi chữ kịp vào hội thoại.
 *
 * Và mỗi khi cắt thì PHẢI ghi rõ còn bao nhiêu. Model không biết mình đang đọc
 * nửa file sẽ kết luận chắc nịch trên nửa file đó.
 */
import { execFile } from 'node:child_process';
import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { soSanhDong, type KetQuaDiff } from './diff';
import { fileBiCam, LoiNguc, moTrongNguc, thuMucBiCam, TRAN_BYTE_FILE } from './jail';
import { chayLenh, phanLoaiLenh, TRAN_GIAY_MAC_DINH, type PhanLoaiLenh } from './lenh';
import { daChoPhepCaFile, hoiNguoiDung, type YeuCauXinPhep } from './xinPhep';
import type { SoCuoc } from './so';

const chay = promisify(execFile);

/**
 * Ngữ cảnh cần cho các tool GHI: cách hỏi người dùng, và cách bỏ dở khi bị huỷ.
 * Tool ĐỌC không cần gì trong này — đó là lý do nó là tham số tuỳ chọn chứ
 * không phải thứ mọi tool phải mang theo.
 */
export interface BoiCanhGhi {
  /** Đẩy thẻ duyệt SỬA FILE lên giao diện. */
  xinPhep: (y: YeuCauXinPhep & { diff: KetQuaDiff; taoMoi: boolean }) => void;
  signal: AbortSignal;
  /** Sổ của CUỘC hội thoại này — nhật ký hoàn tác + quyền đã cấp. */
  so: SoCuoc;
}

/** Ngữ cảnh cho `run_command`. Tách khỏi `BoiCanhGhi` vì hai quyền BẬT RIÊNG. */
export interface BoiCanhLenh {
  /** Sổ của CUỘC hội thoại này. */
  so: SoCuoc;
  /** Đẩy thẻ duyệt LỆNH lên giao diện — kèm phân loại nguy hiểm để người dùng thấy lý do. */
  xinPhepLenh: (y: YeuCauXinPhep & { phanLoai: PhanLoaiLenh }) => void;
  /** Đầu ra chảy ra màn hình khi lệnh còn đang chạy. */
  onRa: (mau: string) => void;
  signal: AbortSignal;
}

/**
 * NHẬT KÝ HOÀN TÁC — nội dung file TRƯỚC lần agent chạm vào ĐẦU TIÊN.
 *
 * `null` nghĩa là file chưa từng tồn tại (agent vừa tạo mới), nên hoàn tác là
 * XOÁ nó đi. Chỉ ghi lần đầu: sửa file năm lần thì hoàn tác phải quay về bản
 * trước cả năm lần, không phải về bản trước lần thứ năm.
 *
 * Cố ý KHÔNG dựa vào git: nhiều thư mục người dùng mở ra không phải kho git,
 * và ngay cả khi có git thì thay đổi chưa commit của chính họ cũng nằm lẫn
 * trong đó — `git checkout` để hoàn tác agent sẽ cuốn theo cả việc họ đang làm
 * dở. Bản sao trong RAM chỉ biết đúng những file agent đã đụng.
 */
export function soFileDaSua(so: SoCuoc): number {
  return so.nhatKyHoanTac.size;
}

/**
 * Trả mọi file agent đã đụng về nguyên trạng.
 *
 * Trả về số file đã khôi phục. Lỗi từng file không làm hỏng cả lượt — hoàn tác
 * được 4/5 file vẫn tốt hơn nhiều so với dừng ở file thứ nhất rồi bỏ mặc bốn
 * file kia đã đổi.
 */
export async function hoanTacTatCa(so: SoCuoc): Promise<{ soFile: number; loi: string[] }> {
  const loi: string[] = [];
  let soFile = 0;
  for (const [duongDan, goc] of so.nhatKyHoanTac) {
    try {
      if (goc === null) await fs.rm(duongDan, { force: true });
      else await fs.writeFile(duongDan, goc, 'utf8');
      soFile++;
    } catch (err) {
      loi.push(`${path.basename(duongDan)}: ${(err as Error).message}`);
    }
  }
  so.nhatKyHoanTac.clear();
  return { soFile, loi };
}

// ─── Trần ──────────────────────────────────────────────────────────
const MAX_MUC_THU_MUC = 300;
const MAX_DONG_DOC = 800;
const MAX_DONG_DOC_TRAN = 2000;
const MAX_KET_QUA_GREP = 200;
const MAX_FILE_GLOB = 200;
const MAX_DONG_DIFF = 1500;
/** Trần thời gian cho một lệnh git. Kho khổng lồ vẫn phải trả lời, hoặc chịu thua nhanh. */
const TRAN_GIT_MS = 15_000;

export interface KetQuaTool {
  /** Chữ đưa vào hội thoại cho model đọc. */
  noiDung: string;
  /** Một dòng cho giao diện ("128 dòng", "12 kết quả"). Không gửi cho model. */
  tomTat: string;
}

/**
 * Chạy một tool vòng 1.
 *
 * KHÔNG ném lỗi ra ngoài: mọi lỗi thành chữ và đi ngược vào hội thoại. Đó là
 * cách agent tự sửa — nó đọc "không có file đó" rồi đi tìm chỗ khác. Ném lỗi
 * thì cả lượt đổ và người dùng nhận một thông báo đỏ cho một chuyện agent hoàn
 * toàn xử lý được.
 *
 * Riêng `LoiNguc` cũng đi đường này, và CÓ CHỦ Ý: model cần đọc được câu "không
 * đọc file .env" để nói lại cho người dùng, thay vì im lặng thử một đường khác.
 */
export async function chayToolAgent(
  goc: string,
  ten: string,
  args: Record<string, unknown>,
  ghi?: BoiCanhGhi,
  lenh?: BoiCanhLenh,
): Promise<KetQuaTool> {
  try {
    switch (ten) {
      case 'run_command': {
        if (!lenh) return { noiDung: 'LỖI: phiên này không bật quyền chạy lệnh.', tomTat: 'không có quyền' };
        return await toolRunCommand(goc, args, lenh);
      }
      case 'list_dir': return await toolListDir(goc, args);
      case 'read_file': return await toolReadFile(goc, args);
      case 'grep': return await toolGrep(goc, args);
      case 'glob': return await toolGlob(goc, args);
      case 'git_status': return await toolGitStatus(goc);
      case 'git_diff': return await toolGitDiff(goc, args);
      case 'edit_file':
      case 'create_file': {
        // Không có bối cảnh ghi ⇒ phiên này không bật quyền sửa. Trả lỗi vào
        // hội thoại chứ không im lặng bỏ qua: model cần biết để nói lại với
        // người dùng, thay vì tưởng đã sửa xong.
        if (!ghi) return { noiDung: 'LỖI: phiên này không bật quyền sửa file.', tomTat: 'không có quyền' };
        return ten === 'edit_file'
          ? await toolEditFile(goc, args, ghi)
          : await toolCreateFile(goc, args, ghi);
      }
      default:
        return { noiDung: `LỖI: app không cài tool tên "${ten}".`, tomTat: 'tool lạ' };
    }
  } catch (err) {
    const loi = err instanceof LoiNguc
      ? err.message
      : `${(err as NodeJS.ErrnoException).code ?? ''} ${(err as Error).message}`.trim();
    return {
      noiDung: `LỖI khi chạy ${ten}: ${loi}`,
      tomTat: err instanceof LoiNguc ? 'bị chặn' : 'lỗi',
    };
  }
}

// ─── list_dir ──────────────────────────────────────────────────────

async function toolListDir(goc: string, args: Record<string, unknown>): Promise<KetQuaTool> {
  const tuongDoi = typeof args.path === 'string' && args.path.trim() ? args.path : '.';
  const dich = await moTrongNguc(goc, tuongDoi === '.' ? '' : tuongDoi, { phaiCoThat: true });

  const muc = await fs.readdir(dich, { withFileTypes: true });
  const thuMuc: string[] = [];
  const file: string[] = [];
  for (const m of muc) {
    if (m.isDirectory()) {
      if (!thuMucBiCam(m.name)) thuMuc.push(`${m.name}/`);
    } else if (!fileBiCam(m.name)) {
      file.push(m.name);
    }
  }
  thuMuc.sort();
  file.sort();

  const tatCa = [...thuMuc, ...file];
  const hien = tatCa.slice(0, MAX_MUC_THU_MUC);
  const con = tatCa.length - hien.length;
  return {
    noiDung: hien.join('\n') + (con > 0 ? `\n[… còn ${con} mục nữa]` : '') || '(thư mục rỗng)',
    tomTat: `${thuMuc.length} thư mục, ${file.length} file`,
  };
}

// ─── read_file ─────────────────────────────────────────────────────

async function toolReadFile(goc: string, args: Record<string, unknown>): Promise<KetQuaTool> {
  const dich = await moTrongNguc(goc, String(args.path ?? ''), { phaiCoThat: true });

  const st = await fs.stat(dich);
  if (st.isDirectory()) {
    return { noiDung: `LỖI: "${args.path}" là thư mục. Dùng list_dir.`, tomTat: 'là thư mục' };
  }
  if (st.size > TRAN_BYTE_FILE) {
    return {
      noiDung: `LỖI: file nặng ${(st.size / 1024 / 1024).toFixed(1)}MB, quá lớn để đọc (trần 2MB). Dùng grep để tìm trong nó.`,
      tomTat: 'quá lớn',
    };
  }

  const tho = await fs.readFile(dich, 'utf8');
  // Đọc "utf8" một file nhị phân không ném lỗi — nó trả về đầy ký tự thay thế
  // U+FFFD. Gửi đống đó lên cổng là trả tiền cho rác, nên bắt tại đây.
  if (tho.includes('\u0000') || (tho.match(/\uFFFD/g)?.length ?? 0) > tho.length / 100) {
    return { noiDung: `LỖI: "${args.path}" là file nhị phân, không đọc thành chữ được.`, tomTat: 'nhị phân' };
  }

  const dong = tho.split('\n');
  const tu = Math.max(1, Math.floor(Number(args.offset) || 1));
  const soLuong = Math.min(MAX_DONG_DOC_TRAN, Math.max(1, Math.floor(Number(args.limit) || MAX_DONG_DOC)));
  const lat = dong.slice(tu - 1, tu - 1 + soLuong);
  if (lat.length === 0) {
    return { noiDung: `File chỉ có ${dong.length} dòng, không có dòng ${tu}.`, tomTat: 'ngoài phạm vi' };
  }

  const danhSo = lat.map((d, i) => `${tu + i}\t${d}`).join('\n');
  const con = dong.length - (tu - 1 + lat.length);
  return {
    noiDung: danhSo + (con > 0 ? `\n[… còn ${con} dòng nữa. Gọi lại read_file với offset=${tu + lat.length} để đọc tiếp.]` : ''),
    tomTat: `${lat.length}/${dong.length} dòng`,
  };
}

// ─── edit_file / create_file ───────────────────────────────────────

/** Trần cho một lần ghi. Lớn hơn thế thì gần như chắc chắn model đang làm sai việc. */
const TRAN_BYTE_GHI = 512 * 1024;

/**
 * Ghi xuống đĩa + ghi nhật ký hoàn tác.
 *
 * `goc === null` nghĩa là file chưa tồn tại. Ghi nhật ký TRƯỚC khi ghi đĩa và
 * chỉ ghi lần đầu — thứ tự này quan trọng: ghi đĩa trước rồi mới lưu bản gốc
 * là lưu nhầm bản đã bị sửa.
 */
async function ghiVaNhoDeHoanTac(so: SoCuoc, duongDan: string, noiDungMoi: string, goc: string | null): Promise<void> {
  if (!so.nhatKyHoanTac.has(duongDan)) so.nhatKyHoanTac.set(duongDan, goc);
  await fs.mkdir(path.dirname(duongDan), { recursive: true });
  await fs.writeFile(duongDan, noiDungMoi, 'utf8');
}

/** Câu trả lời khi người dùng từ chối. Viết cho MODEL đọc, nên nó phải nói được bước tiếp theo. */
function loiTuChoi(viec: string): KetQuaTool {
  return {
    noiDung:
      `NGƯỜI DÙNG TỪ CHỐI ${viec}. Đây không phải lỗi kỹ thuật — họ đã xem thay đổi và không đồng ý. ` +
      'ĐỪNG gọi lại y hệt. Hãy hỏi họ muốn khác chỗ nào, hoặc đề nghị một cách làm khác.',
    tomTat: 'bị từ chối',
  };
}

async function toolEditFile(goc: string, args: Record<string, unknown>, ghi: BoiCanhGhi): Promise<KetQuaTool> {
  const tuongDoi = String(args.path ?? '');
  const cu = typeof args.old_text === 'string' ? args.old_text : '';
  const moi = typeof args.new_text === 'string' ? args.new_text : '';
  if (!tuongDoi) return { noiDung: 'LỖI: thiếu "path".', tomTat: 'thiếu đường dẫn' };
  if (!cu) return { noiDung: 'LỖI: "old_text" rỗng. Muốn tạo file mới thì dùng create_file.', tomTat: 'thiếu old_text' };
  if (cu === moi) return { noiDung: 'LỖI: old_text và new_text giống hệt nhau, không có gì để sửa.', tomTat: 'không đổi' };

  const dich = await moTrongNguc(goc, tuongDoi, { phaiCoThat: true });
  const st = await fs.stat(dich);
  if (st.isDirectory()) return { noiDung: `LỖI: "${tuongDoi}" là thư mục.`, tomTat: 'là thư mục' };
  if (st.size > TRAN_BYTE_FILE) return { noiDung: 'LỖI: file quá lớn để sửa (trần 2MB).', tomTat: 'quá lớn' };

  const noiDung = await fs.readFile(dich, 'utf8');

  // KHỚP CHÍNH XÁC, và phải DUY NHẤT. Đây là chỗ cả thiết kế đứng hay đổ:
  // khớp nhiều nơi mà cứ thay cái đầu tiên thì model sửa nhầm chỗ, người dùng
  // duyệt một diff trông hợp lý, và cái sai nằm ở đoạn không ai nhìn.
  const soLan = demSoLan(noiDung, cu);
  if (soLan === 0) {
    return {
      noiDung:
        `LỖI: không tìm thấy old_text trong ${tuongDoi}. Nội dung trên đĩa khác với thứ bạn đang nhớ. ` +
        'Hãy gọi read_file để đọc lại đoạn đó rồi chép CHÍNH XÁC (kể cả thụt lề).',
      tomTat: 'không khớp',
    };
  }
  if (soLan > 1) {
    return {
      noiDung:
        `LỖI: old_text xuất hiện ${soLan} lần trong ${tuongDoi} nên không biết sửa chỗ nào. ` +
        'Hãy lấy thêm vài dòng phía trên hoặc phía dưới cho đoạn đó đủ riêng biệt.',
      tomTat: `trùng ${soLan} chỗ`,
    };
  }

  const noiDungMoi = noiDung.replace(cu, moi);
  if (Buffer.byteLength(noiDungMoi, 'utf8') > TRAN_BYTE_GHI) {
    return { noiDung: `LỖI: file sau khi sửa vượt trần ${TRAN_BYTE_GHI / 1024}KB.`, tomTat: 'quá lớn' };
  }

  const diff = soSanhDong(noiDung, noiDungMoi);
  const tuDong = daChoPhepCaFile(ghi.so.quyenDaCap, tuongDoi);
  const quyet = await hoiNguoiDung(
    { ten: 'edit_file', duongDan: tuongDoi },
    (y) => ghi.xinPhep({ ...y, diff, taoMoi: false }),
    ghi.signal,
    ghi.so.quyenDaCap,
  );
  if (quyet === 'tuChoi') return loiTuChoi(`sửa ${tuongDoi}`);

  await ghiVaNhoDeHoanTac(ghi.so, dich, noiDungMoi, noiDung);
  return {
    noiDung: `Đã sửa ${tuongDoi}: +${diff.soThem} −${diff.soBo} dòng. Người dùng đã duyệt.`,
    tomTat: `+${diff.soThem} −${diff.soBo}${tuDong ? ' (tự duyệt)' : ''}`,
  };
}

async function toolCreateFile(goc: string, args: Record<string, unknown>, ghi: BoiCanhGhi): Promise<KetQuaTool> {
  const tuongDoi = String(args.path ?? '');
  const noiDung = typeof args.content === 'string' ? args.content : '';
  if (!tuongDoi) return { noiDung: 'LỖI: thiếu "path".', tomTat: 'thiếu đường dẫn' };
  if (Buffer.byteLength(noiDung, 'utf8') > TRAN_BYTE_GHI) {
    return { noiDung: `LỖI: nội dung vượt trần ${TRAN_BYTE_GHI / 1024}KB.`, tomTat: 'quá lớn' };
  }

  // `phaiCoThat: false` vì file CHƯA tồn tại — nhưng ngục vẫn kiểm đường dẫn
  // và danh sách chặn, nên `create_file('.env', …)` vẫn bị chặn.
  const dich = await moTrongNguc(goc, tuongDoi);
  const daCo = await fs.stat(dich).then(() => true).catch(() => false);
  if (daCo) {
    return {
      noiDung: `LỖI: "${tuongDoi}" đã tồn tại. Dùng edit_file để sửa file có sẵn.`,
      tomTat: 'đã tồn tại',
    };
  }

  const diff = soSanhDong('', noiDung);
  const quyet = await hoiNguoiDung(
    { ten: 'create_file', duongDan: tuongDoi },
    (y) => ghi.xinPhep({ ...y, diff, taoMoi: true }),
    ghi.signal,
    ghi.so.quyenDaCap,
  );
  if (quyet === 'tuChoi') return loiTuChoi(`tạo ${tuongDoi}`);

  await ghiVaNhoDeHoanTac(ghi.so, dich, noiDung, null);
  return {
    noiDung: `Đã tạo ${tuongDoi} (${noiDung.split('\n').length} dòng). Người dùng đã duyệt.`,
    tomTat: `tạo mới, ${noiDung.split('\n').length} dòng`,
  };
}

/** Đếm số lần chuỗi con xuất hiện. Không dùng regex — `old_text` chứa ký tự đặc biệt là chuyện thường. */
function demSoLan(trong: string, tim: string): number {
  let dem = 0;
  let i = trong.indexOf(tim);
  while (i !== -1) {
    dem++;
    if (dem > 1) return dem; // chỉ cần biết "nhiều hơn một"
    i = trong.indexOf(tim, i + tim.length);
  }
  return dem;
}

// ─── run_command ───────────────────────────────────────────────────

async function toolRunCommand(
  goc: string,
  args: Record<string, unknown>,
  boiCanh: BoiCanhLenh,
): Promise<KetQuaTool> {
  const lenh = typeof args.command === 'string' ? args.command.trim() : '';
  if (!lenh) return { noiDung: 'LỖI: thiếu "command".', tomTat: 'thiếu lệnh' };
  if (lenh.length > 2000) return { noiDung: 'LỖI: lệnh quá dài (trần 2000 ký tự).', tomTat: 'quá dài' };

  const phanLoai = phanLoaiLenh(lenh);

  // Khoá ghi nhớ là NGUYÊN VĂN chuỗi lệnh, không phải tên chương trình. Nhớ
  // theo tên thì duyệt `npm test` một lần là `npm publish` cũng tự chạy — cùng
  // một chữ `npm`. Nhớ theo nguyên văn thì đổi một ký tự là hỏi lại, và đó
  // chính là điều mình muốn.
  const quyet = await hoiNguoiDung(
    { ten: 'run_command', duongDan: lenh, khoa: lenh, choNho: phanLoai.choNho },
    (y) => boiCanh.xinPhepLenh({ ...y, phanLoai }),
    boiCanh.signal,
    boiCanh.so.quyenDaCap,
  );
  if (quyet === 'tuChoi') {
    return {
      noiDung:
        `NGƯỜI DÙNG TỪ CHỐI chạy lệnh: ${lenh}\n` +
        'Họ đã đọc lệnh và không đồng ý. ĐỪNG gọi lại y hệt — hãy hỏi xem họ muốn chạy gì thay thế, ' +
        'hoặc mô tả lệnh cần chạy để họ tự chạy.',
      tomTat: 'bị từ chối',
    };
  }

  const kq = await chayLenh({
    lenh,
    cwd: goc,
    giay: Number(args.timeout_seconds) || TRAN_GIAY_MAC_DINH,
    signal: boiCanh.signal,
    onRa: boiCanh.onRa,
  });

  // Đầu ra đưa cho model PHẢI mở đầu bằng mã thoát. Model đọc từ trên xuống, và
  // một bãi log 20.000 ký tự không nói được "hỏng hay không" — con số ở dòng
  // đầu thì nói được ngay.
  const dau = kq.hetGio
    ? `LỆNH BỊ DỪNG vì quá ${Math.round(kq.giay)}s. Có thể nó đang chờ bàn phím, hoặc thật sự chạy lâu.`
    : kq.ma === 0
      ? `Lệnh chạy XONG, mã thoát 0 (${kq.giay.toFixed(1)}s).`
      : kq.ma === null
        ? `Lệnh bị dừng giữa chừng (${kq.giay.toFixed(1)}s).`
        : `Lệnh HỎNG, mã thoát ${kq.ma} (${kq.giay.toFixed(1)}s).`;

  return {
    noiDung: `$ ${lenh}\n${dau}\n\n${kq.ra || '(không có đầu ra)'}`,
    tomTat: kq.hetGio ? 'hết giờ' : kq.ma === 0 ? `xong ${kq.giay.toFixed(0)}s` : `mã thoát ${kq.ma ?? '—'}`,
  };
}

// ─── grep ──────────────────────────────────────────────────────────

async function toolGrep(goc: string, args: Record<string, unknown>): Promise<KetQuaTool> {
  const mauTho = String(args.pattern ?? '');
  if (!mauTho) return { noiDung: 'LỖI: thiếu "pattern".', tomTat: 'thiếu mẫu' };

  let re: RegExp;
  try {
    re = new RegExp(mauTho, 'i');
  } catch (err) {
    return { noiDung: `LỖI: biểu thức chính quy sai — ${(err as Error).message}`, tomTat: 'regex sai' };
  }

  const batDau = args.path ? await moTrongNguc(goc, String(args.path), { phaiCoThat: true }) : goc;
  const locTen = mauGlobThanhRegex(typeof args.glob === 'string' ? args.glob : undefined);

  const ra: string[] = [];
  let soFile = 0;
  let dayTran = false;

  const di = async (thuMuc: string): Promise<void> => {
    if (dayTran) return;
    let muc: Dirent[];
    try {
      muc = await fs.readdir(thuMuc, { withFileTypes: true });
    } catch {
      return; // không đọc được thư mục (quyền) — bỏ qua, không làm hỏng cả lượt
    }
    for (const m of muc) {
      if (dayTran) return;
      if (m.isDirectory()) {
        if (!thuMucBiCam(m.name)) await di(path.join(thuMuc, m.name));
        continue;
      }
      if (fileBiCam(m.name)) continue;
      // Lọc theo glob so trên TÊN FILE — mẫu kiểu "*.ts" là mẫu tên, và đó là
      // cách model dùng nó trên thực tế (đo được ở agent-check).
      if (locTen && !locTen.test(m.name)) continue;

      const p = path.join(thuMuc, m.name);
      const st = await fs.stat(p).catch(() => null);
      if (!st || st.size > TRAN_BYTE_FILE) continue;
      const noi = await fs.readFile(p, 'utf8').catch(() => null);
      if (noi === null || noi.includes('\u0000')) continue;
      soFile++;

      const cacDong = noi.split('\n');
      for (let i = 0; i < cacDong.length; i++) {
        const dongNay = cacDong[i] ?? '';
        if (!re.test(dongNay)) continue;
        ra.push(`${path.relative(goc, p)}:${i + 1}:${dongNay.trim().slice(0, 300)}`);
        if (ra.length >= MAX_KET_QUA_GREP) { dayTran = true; return; }
      }
    }
  };
  await di(batDau);

  if (ra.length === 0) {
    return {
      noiDung: `Không dòng nào khớp /${mauTho}/ (đã quét ${soFile} file).`,
      tomTat: 'không khớp',
    };
  }
  return {
    noiDung: ra.join('\n') + (dayTran ? `\n[… đã đạt trần ${MAX_KET_QUA_GREP} kết quả — hãy tìm hẹp hơn]` : ''),
    tomTat: `${ra.length} kết quả${dayTran ? ' (đầy trần)' : ''}`,
  };
}

// ─── glob ──────────────────────────────────────────────────────────

async function toolGlob(goc: string, args: Record<string, unknown>): Promise<KetQuaTool> {
  const mau = String(args.pattern ?? '').trim();
  if (!mau) return { noiDung: 'LỖI: thiếu "pattern".', tomTat: 'thiếu mẫu' };
  const re = mauGlobThanhRegex(mau, { toanDuong: true });
  if (!re) return { noiDung: 'LỖI: mẫu không hợp lệ.', tomTat: 'mẫu sai' };

  const thay: Array<{ p: string; luc: number }> = [];
  const di = async (thuMuc: string): Promise<void> => {
    let muc: Dirent[];
    try {
      muc = await fs.readdir(thuMuc, { withFileTypes: true });
    } catch {
      return;
    }
    for (const m of muc) {
      const p = path.join(thuMuc, m.name);
      if (m.isDirectory()) {
        if (!thuMucBiCam(m.name)) await di(p);
        continue;
      }
      if (fileBiCam(m.name)) continue;
      const tuongDoi = path.relative(goc, p).split(path.sep).join('/');
      if (!re.test(tuongDoi)) continue;
      const st = await fs.stat(p).catch(() => null);
      thay.push({ p: tuongDoi, luc: st?.mtimeMs ?? 0 });
    }
  };
  await di(goc);

  // Sắp theo lần sửa GẦN NHẤT: khi model tìm "file service nào đó", file vừa
  // được sửa gần như luôn là file liên quan tới câu hỏi.
  thay.sort((a, b) => b.luc - a.luc);
  const hien = thay.slice(0, MAX_FILE_GLOB);
  if (hien.length === 0) return { noiDung: `Không file nào khớp "${mau}".`, tomTat: 'không khớp' };
  return {
    noiDung: hien.map((t) => t.p).join('\n') + (thay.length > hien.length ? `\n[… còn ${thay.length - hien.length} file nữa]` : ''),
    tomTat: `${thay.length} file`,
  };
}

/**
 * Glob → RegExp.
 *
 * `toanDuong: false` (mặc định) so trên TÊN FILE — dùng cho tham số `glob` của
 * grep. `toanDuong: true` so trên đường dẫn tương đối — dùng cho tool `glob`.
 *
 * Thứ tự thay thế QUAN TRỌNG: sao-sao phải xử lý TRƯỚC sao đơn. Làm ngược lại
 * thì sao đơn ăn mất một nửa của sao-sao, và mẫu "src/(sao-sao)/*.ts" không bao
 * giờ khớp được thư mục lồng nhau.
 */
function mauGlobThanhRegex(mau: string | undefined, opts: { toanDuong?: boolean } = {}): RegExp | null {
  if (!mau) return null;
  // `{a,b}` — model dùng khá thường xuyên ("*.{ts,tsx}").
  const nhom: string[] = [];
  const thoat = mau
    .replace(/\{([^{}]+)\}/g, (_, ds: string) => {
      nhom.push(ds.split(',').map((s) => s.trim()).join('|'));
      return `\u0000${nhom.length - 1}\u0000`;
    })
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*\//g, '\u0001')
    .replace(/\*\*/g, '\u0001')
    .replace(/\*/g, opts.toanDuong ? '[^/]*' : '[^/]*')
    .replace(/\?/g, '.')
    .replace(/\u0001/g, '(?:.*/)?')
    .replace(/\u0000(\d+)\u0000/g, (_, i: string) => `(?:${nhom[Number(i)]})`);
  try {
    // Không neo đầu khi so tên file: model hay viết "*.ts" và cũng hay viết
    // "gateway.ts" — cả hai phải khớp đúng như người dùng mong đợi.
    return new RegExp(opts.toanDuong ? `^${thoat}$` : `^${thoat}$`, 'i');
  } catch {
    return null;
  }
}

// ─── git ───────────────────────────────────────────────────────────

/**
 * Gọi git.
 *
 * `execFile` chứ KHÔNG phải `exec`: `exec` đưa chuỗi cho shell, và bất cứ thứ
 * gì model sinh ra mà lọt vào đó đều là lệnh shell. `execFile` truyền mảng
 * tham số thẳng cho tiến trình, không có shell nào ở giữa để diễn giải `;`
 * hay `$(...)`. Đây là ranh giới quan trọng nhất của cả file — P1 chưa cho
 * agent chạy lệnh, và `exec` sẽ lặng lẽ cho nó chạy.
 */
async function goiGit(goc: string, thamSo: string[]): Promise<{ ra: string; loi: string | null }> {
  try {
    const { stdout } = await chay('git', thamSo, {
      cwd: goc,
      timeout: TRAN_GIT_MS,
      maxBuffer: 8 * 1024 * 1024,
      windowsHide: true,
    });
    return { ra: stdout, loi: null };
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { stderr?: string; killed?: boolean };
    if (e.code === 'ENOENT') return { ra: '', loi: 'Máy này không cài git.' };
    if (e.killed) return { ra: '', loi: `git chạy quá ${TRAN_GIT_MS / 1000}s nên bị dừng.` };
    const chuoi = String(e.stderr ?? e.message ?? '');
    if (/not a git repository/i.test(chuoi)) return { ra: '', loi: 'Thư mục này không phải kho git.' };
    return { ra: '', loi: chuoi.slice(0, 200) || 'git lỗi không rõ' };
  }
}

async function toolGitStatus(goc: string): Promise<KetQuaTool> {
  const { ra, loi } = await goiGit(goc, ['status', '--short', '--branch']);
  if (loi) return { noiDung: `LỖI: ${loi}`, tomTat: 'không có git' };
  const dong = ra.trimEnd().split('\n').filter(Boolean);
  const nhanh = dong[0]?.replace(/^##\s*/, '') ?? '(không rõ)';
  const doi = dong.slice(1);
  return {
    noiDung: doi.length === 0
      ? `Nhánh: ${nhanh}\nKhông có thay đổi nào chưa commit.`
      : `Nhánh: ${nhanh}\n${doi.length} file đang đổi:\n${doi.slice(0, 200).join('\n')}`,
    tomTat: `${nhanh} · ${doi.length} file đổi`,
  };
}

async function toolGitDiff(goc: string, args: Record<string, unknown>): Promise<KetQuaTool> {
  const thamSo = ['diff'];
  if (args.staged === true) thamSo.push('--staged');
  if (typeof args.path === 'string' && args.path.trim()) {
    // Qua ngục để một `path` kiểu `../../` không biến git thành cửa sau đọc cả
    // ổ đĩa. `--` chặn git hiểu nhầm đường dẫn thành tên nhánh.
    const dich = await moTrongNguc(goc, args.path, { phaiCoThat: true });
    thamSo.push('--', path.relative(goc, dich));
  }

  const { ra, loi } = await goiGit(goc, thamSo);
  if (loi) return { noiDung: `LỖI: ${loi}`, tomTat: 'không có git' };
  if (!ra.trim()) return { noiDung: '(không có thay đổi nào chưa commit)', tomTat: 'sạch' };

  const dong = ra.split('\n');
  const cat = dong.length > MAX_DONG_DIFF;
  return {
    noiDung: dong.slice(0, MAX_DONG_DIFF).join('\n') + (cat ? `\n[… diff bị cắt, còn ${dong.length - MAX_DONG_DIFF} dòng. Truyền "path" để xem hẹp hơn.]` : ''),
    tomTat: `${Math.min(dong.length, MAX_DONG_DIFF)} dòng diff${cat ? ' (cắt)' : ''}`,
  };
}

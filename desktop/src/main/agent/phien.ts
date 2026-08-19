/**
 * ============================================================
 * LƯU PHIÊN — mở app lại vẫn còn việc đang làm dở
 * ============================================================
 *
 * Trước file này, đóng app là mất sạch hội thoại. Với một việc 20 bước đã tốn
 * tiền thật (đo được: ~262k token ≈ 0,34 $) thì mất như thế không phải bất
 * tiện — là mất tiền.
 *
 * ─── LƯU BẢN GIAO THỨC, DỰNG LẠI BẢN HIỂN THỊ ───
 *
 * Hội thoại có HAI hình dạng: bản giao thức (`tool_calls`, `tool_call_id` —
 * thứ cổng cần) sống ở main, và bản hiển thị (bong bóng chữ, dòng công cụ,
 * thẻ duyệt) sống ở renderer. Lưu cả hai nghĩa là hai kho phải giữ đồng bộ, và
 * hai kho thì sẽ có ngày lệch nhau — mà lệch ở đây nghĩa là màn hình kể một
 * câu chuyện khác với thứ agent thật sự nhớ.
 *
 * Nên chỉ lưu bản GIAO THỨC (nó là bản đầy đủ hơn: kết quả tool nằm nguyên
 * trong đó), rồi dựng lại bản hiển thị khi mở. Bản dựng lại không giống hệt
 * bản gốc — mất diff của thẻ duyệt, mất mấy chữ tóm tắt — nhưng nó ĐÚNG, và nó
 * không thể lệch với thứ agent nhớ vì cả hai được sinh ra từ cùng một nguồn.
 *
 * ─── NƠI LƯU ───
 * `userData/agent-phien/*.json`. KHÔNG mã hoá: nội dung là mã nguồn của chính
 * người dùng, cùng hạng tin cậy với thư mục ghi chú của họ. Nhưng nó KHÔNG
 * phải chỗ chứa bí mật — agent không đọc `.env` (xem `jail.ts`), và người dùng
 * cần biết là hội thoại có nằm trên đĩa.
 */
import { app } from 'electron';

import { API_ORIGIN } from '../config';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface TinNhanLuu {
  role: 'user' | 'assistant' | 'tool';
  /** Mảng = lượt có ảnh (khối `text` + `image_url`). */
  content?: string | Array<Record<string, unknown>> | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

export interface TomTatPhien {
  id: string;
  /** Câu hỏi đầu tiên, cắt ngắn — nhãn duy nhất người dùng nhận ra phiên bằng. */
  tieuDe: string;
  /** Tên thư mục dự án lúc đó — để HIỆN cho người dùng đọc. */
  duAn: string | null;
  /**
   * ĐƯỜNG DẪN đầy đủ của thư mục dự án lúc đó.
   *
   * Tên thôi không đủ từ khi mỗi tab một dự án: mở một việc cũ vào tab đang trỏ
   * dự án khác thì agent đọc nhầm repo và trả lời rất tự tin về những file
   * không liên quan gì. `null` = phiên cũ lưu trước khi có trường này.
   */
  goc?: string | null;
  luucLuc: number;
  soTinNhan: number;
  /** Ghim lên đầu danh sách. Do NGƯỜI DÙNG đặt — xem `nhan.json` bên dưới. */
  ghim?: boolean;
  /** Cất đi khỏi danh sách thường, KHÔNG xoá. */
  luuTru?: boolean;
}

interface FilePhien extends TomTatPhien {
  hoiThoai: TinNhanLuu[];
}

/** Giữ tối đa ngần này phiên. Cũ nhất bị xoá trước. */
const MAX_PHIEN = 50;
const MAX_TIEU_DE = 90;

function thuMuc(): string {
  return path.join(app.getPath('userData'), 'agent-phien');
}

function duongDan(id: string): string {
  // `id` do chính main sinh ra, nhưng vẫn lọc: một file `../../x.json` ghi ra
  // ngoài userData là chuyện không được phép xảy ra dù đường đi tới đó là gì.
  return path.join(thuMuc(), `${id.replace(/[^a-zA-Z0-9_-]/g, '')}.json`);
}

// ─── NHÃN NGƯỜI DÙNG ĐẶT: tên tự đặt · ghim · lưu trữ ──────────────

/**
 * Ba thứ do NGƯỜI DÙNG quyết, giữ trong MỘT file nhỏ riêng
 * (`agent-phien/nhan.json`) thay vì trong file phiên.
 *
 * ─── VÌ SAO TÁCH RA ───
 * `luuPhien` ghi đè TRỌN file phiên sau MỖI bước agent. Để ba trường này nằm
 * trong đó thì mỗi bước phải đọc lại file cũ — có việc nặng vài MB — chỉ để
 * giữ lại hai chữ; hoặc bỏ qua và thế là cái ghim biến mất giữa lúc agent
 * đang chạy, không báo gì.
 *
 * Ở file riêng thì đường ghi của AGENT và đường ghi của NGƯỜI DÙNG không bao
 * giờ chạm nhau, nên không có gì để lệch. Và vì tên người dùng đặt được đọc
 * ĐÈ LÊN `tieuDe` lúc liệt kê, cái tên AI đặt vẫn nằm nguyên trong file phiên
 * mà không tranh chấp với nó.
 */
interface NhanPhien {
  ten?: string;
  ghim?: boolean;
  luuTru?: boolean;
}
type BangNhan = Record<string, NhanPhien>;

/**
 * Bản VÁ nhãn. Khác `NhanPhien` ở chỗ cho phép `undefined` tường minh —
 * `exactOptionalPropertyTypes` phân biệt "không nhắc tới trường này" với "xoá
 * trường này đi", và ở đây cần đúng cả hai nghĩa: `{ ghim: true }` chỉ đổi
 * ghim, còn `{ ten: undefined }` là bỏ hẳn tên tự đặt.
 */
type VaNhan = { [K in keyof NhanPhien]?: NhanPhien[K] | undefined };

function duongDanNhan(): string {
  return path.join(thuMuc(), 'nhan.json');
}

async function docNhan(): Promise<BangNhan> {
  try {
    const j = JSON.parse(await fs.readFile(duongDanNhan(), 'utf8')) as unknown;
    return j && typeof j === 'object' && !Array.isArray(j) ? (j as BangNhan) : {};
  } catch {
    // Chưa có file, hoặc file hỏng. Cả hai đều nghĩa là "chưa đặt nhãn gì" —
    // và một bảng nhãn hỏng KHÔNG được phép làm mất danh sách phiên.
    return {};
  }
}

/**
 * Ghi bảng nhãn, XẾP HÀNG.
 *
 * Mỗi lần sửa là một vòng đọc-sửa-ghi trọn bảng. Hai cú bấm liền nhau (ghim
 * xong bấm lưu trữ ngay) mà chạy chồng thì cái sau đọc bảng CŨ và ghi đè mất
 * cái trước — đúng kiểu hỏng chỉ hiện ra lúc người dùng bấm nhanh.
 */
let hangGhiNhan: Promise<unknown> = Promise.resolve();

async function suaNhan(id: string, sua: VaNhan): Promise<void> {
  const viec = async (): Promise<void> => {
    const b = await docNhan();
    const moi: VaNhan = { ...(b[id] ?? {}), ...sua };
    // Dọn trường rỗng: bảng không nên phình vì những mục "đã bỏ ghim".
    if (!moi.ten) delete moi.ten;
    if (!moi.ghim) delete moi.ghim;
    if (!moi.luuTru) delete moi.luuTru;
    if (Object.keys(moi).length === 0) delete b[id];
    else b[id] = moi as NhanPhien;   // mọi trường `undefined` vừa bị xoá ở trên

    await fs.mkdir(thuMuc(), { recursive: true });
    const dich = duongDanNhan();
    const tam = `${dich}.tmp`;
    await fs.writeFile(tam, JSON.stringify(b), 'utf8');
    await fs.rename(tam, dich);
  };
  const ra = hangGhiNhan.then(viec, viec);
  hangGhiNhan = ra.catch(() => {});
  return ra;
}

/** Đổi tên. Tên rỗng = bỏ tên tự đặt, quay về tên AI/câu hỏi đầu. */
export async function doiTenPhien(id: string, ten: string): Promise<void> {
  const t = ten.trim().replace(/\s+/g, ' ').slice(0, MAX_TIEU_DE);
  await suaNhan(id, { ten: t || undefined });
}

export async function datGhimPhien(id: string, ghim: boolean): Promise<void> {
  await suaNhan(id, { ghim });
}

export async function datLuuTruPhien(id: string, luuTru: boolean): Promise<void> {
  await suaNhan(id, { luuTru });
}

/**
 * Tên do AI đặt, thay cho câu hỏi bị cắt cụt.
 *
 * Người dùng đối chiếu với Claude Code 19/08/2026: bên đó là "iOS app
 * AppStore approval strategy", bên mình là "Bạn xem dự án này của tôi đã có
 * mobile app …". Ba việc cùng bắt đầu bằng "bạn kiểm tra dự án này…" thì
 * nhìn vào không phân biệt nổi cái nào.
 *
 * ⚠️ CHỈ đặt MỘT LẦN, và chỉ khi tên hiện tại vẫn là câu hỏi thô. Gọi lại ở
 * mỗi lần lưu là mỗi bước agent một lời gọi LLM — việc 60 bước thành 60 lần
 * trả tiền cho cùng một cái tên.
 *
 * Hỏng thì im lặng giữ tên cũ: đặt tên là trang trí, không được phép làm
 * hỏng việc lưu phiên.
 */
const daDatTen = new Set<string>();
/** Tên AI đã đặt, theo id phiên. Sống trong bộ nhớ — mở lại app thì đọc từ file. */
const tenAi = new Map<string, string>();
/** Token phiên, do `loop.ts` bơm vào. `phien.ts` không tự đọc được phiên đăng nhập. */
let tokenPhien: string | null = null;
export function datTokenChoDatTen(t: string | null): void { tokenPhien = t; }

async function nhoAiDatTen(id: string, tenTho: string, token: string): Promise<string | null> {
  if (daDatTen.has(id)) return null;
  daDatTen.add(id);
  try {
    const r = await fetch(`${API_ORIGIN}/api/v1/agent/dat-ten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cauHoi: tenTho }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!r.ok) return null;
    const j = await r.json() as { data?: { ten?: string | null } };
    return j.data?.ten ?? null;
  } catch {
    return null;
  }
}

/** Tiêu đề lấy từ câu hỏi ĐẦU TIÊN — thứ người dùng nhớ về việc đó. */
function datTieuDe(hoiThoai: TinNhanLuu[]): string {
  const dau = hoiThoai.find((m) => m.role === 'user');
  const c = dau?.content;
  const tho = (Array.isArray(c)
    ? c.filter((k) => k?.type === 'text').map((k) => String(k.text ?? '')).join(' ')
    : String(c ?? '')
  ).trim().replace(/\s+/g, ' ');
  if (!tho) return 'Việc chưa đặt tên';
  return tho.length > MAX_TIEU_DE ? `${tho.slice(0, MAX_TIEU_DE)}…` : tho;
}

/**
 * Ghi phiên xuống đĩa. Trả về tóm tắt vừa ghi.
 *
 * Ghi qua file tạm rồi đổi tên: app bị tắt giữa chừng thì file cũ vẫn nguyên
 * vẹn, thay vì thành một mẩu JSON cụt không đọc lại được. Cùng cách mà
 * `main/store.ts` đang dùng cho file cấu hình.
 */
export async function luuPhien(
  id: string,
  hoiThoai: TinNhanLuu[],
  duAn: string | null,
  goc?: string | null,
): Promise<TomTatPhien | null> {
  // Hội thoại chưa có câu hỏi nào của người dùng thì không có gì để lưu — và
  // một danh sách đầy phiên rỗng làm cái danh sách thành vô dụng.
  if (!hoiThoai.some((m) => m.role === 'user')) return null;

  /* Tên do AI đặt nếu lấy được, còn không thì câu hỏi đầu cắt ngắn. Đã có
     tên AI rồi thì GIỮ — đặt lại ở mỗi bước là mỗi bước một lời gọi LLM. */
  const tenCu = tenAi.get(id);
  const tho = datTieuDe(hoiThoai);
  if (!tenCu && tokenPhien) {
    void nhoAiDatTen(id, tho, tokenPhien).then((t) => { if (t) tenAi.set(id, t); });
  }

  const tom: TomTatPhien = {
    id,
    tieuDe: tenCu ?? tho,
    duAn,
    goc: goc ?? null,
    luucLuc: Date.now(),
    soTinNhan: hoiThoai.length,
  };
  const noi: FilePhien = { ...tom, hoiThoai };

  await fs.mkdir(thuMuc(), { recursive: true });
  const dich = duongDan(id);
  const tam = `${dich}.tmp`;
  await fs.writeFile(tam, JSON.stringify(noi), 'utf8');
  await fs.rename(tam, dich);

  void donBot();
  return tom;
}

/** Danh sách phiên, mới nhất trước. Hỏng một file không làm hỏng cả danh sách. */
export async function danhSachPhien(): Promise<TomTatPhien[]> {
  let ten: string[];
  try {
    ten = await fs.readdir(thuMuc());
  } catch {
    return []; // chưa có phiên nào — không phải lỗi
  }

  const nhan = await docNhan();
  const ra: TomTatPhien[] = [];
  for (const t of ten) {
    if (!t.endsWith('.json')) continue;
    // Bảng nhãn nằm chung thư mục và cũng đuôi `.json` — bỏ qua, không thì nó
    // hiện lên như một phiên hỏng.
    if (t === 'nhan.json') continue;
    try {
      const j = JSON.parse(await fs.readFile(path.join(thuMuc(), t), 'utf8')) as Partial<FilePhien>;
      if (typeof j.id === 'string' && typeof j.tieuDe === 'string') {
        const n = nhan[j.id] ?? {};
        ra.push({
          id: j.id,
          // Tên người dùng tự đặt ĐÈ LÊN tên AI. Họ đã nói rõ họ muốn gọi việc
          // này là gì; một lời gọi LLM không được phép cãi lại.
          tieuDe: n.ten ?? j.tieuDe,
          duAn: j.duAn ?? null,
          goc: j.goc ?? null,
          luucLuc: j.luucLuc ?? 0,
          soTinNhan: j.soTinNhan ?? 0,
          ghim: n.ghim === true,
          luuTru: n.luuTru === true,
        });
      }
    } catch {
      // Một file hỏng (đĩa đầy lúc ghi, app bị kill) KHÔNG được làm mất cả danh
      // sách. Bỏ qua nó; người dùng vẫn mở được 49 phiên còn lại.
      continue;
    }
  }
  // Ghim lên đầu, rồi mới mới-nhất-trước. Ghim mà vẫn sắp theo thời gian thì
  // cái ghim không nhìn thấy được — đúng thứ nó sinh ra để tránh.
  return ra.sort((a, b) => Number(b.ghim ?? false) - Number(a.ghim ?? false) || b.luucLuc - a.luucLuc);
}

export async function docPhien(id: string): Promise<FilePhien | null> {
  try {
    const j = JSON.parse(await fs.readFile(duongDan(id), 'utf8')) as Partial<FilePhien>;
    if (!Array.isArray(j.hoiThoai)) return null;
    const n = (await docNhan())[String(j.id ?? id)] ?? {};
    return {
      id: String(j.id ?? id),
      tieuDe: n.ten ?? String(j.tieuDe ?? ''),
      ghim: n.ghim === true,
      luuTru: n.luuTru === true,
      duAn: j.duAn ?? null,
      goc: j.goc ?? null,
      luucLuc: j.luucLuc ?? 0,
      soTinNhan: j.soTinNhan ?? j.hoiThoai.length,
      hoiThoai: j.hoiThoai as TinNhanLuu[],
    };
  } catch {
    return null;
  }
}

export async function xoaPhien(id: string): Promise<void> {
  await fs.rm(duongDan(id), { force: true });
  // Dọn cả nhãn. Bỏ sót thì id đã xoá vẫn nằm trong `nhan.json` mãi mãi, và
  // một phiên MỚI tình cờ trùng id sẽ thừa hưởng cái ghim của người đã chết.
  await suaNhan(id, { ten: undefined, ghim: false, luuTru: false });
}

/**
 * NHÂN BẢN — chép một phiên thành phiên mới.
 *
 * Hai chỗ dùng:
 *   • menu ⋮ trong thanh bên  → chép TRỌN việc
 *   • "Tách nhánh từ đây" dưới một tin nhắn → chép tới TRƯỚC câu hỏi thứ `k`
 *
 * Khác `quayLui` ở đúng một điểm, và đó là cả lý do nó tồn tại: quay lui CẮT
 * việc đang có, tách nhánh để nguyên việc cũ và mở một bản mới. Người dùng
 * muốn thử hướng khác mà vẫn giữ được đường cũ để so.
 *
 * ⚠️ Bản sao KHÔNG thừa hưởng ghim/lưu trữ. Ghim là "cái này tôi hay quay
 * lại", nói về đúng một việc cụ thể — sao chép nó sang bản mới chỉ làm đầu
 * danh sách đầy những bản nhánh người dùng chưa từng ghim.
 */
export async function nhanBanPhien(
  id: string,
  denCauHoi?: number,
): Promise<{ id: string; tieuDe: string; cauHoi?: string } | null> {
  const goc = await docPhien(id);
  if (!goc) return null;

  let hoiThoai = goc.hoiThoai;
  let cauHoi: string | undefined;
  if (typeof denCauHoi === 'number' && denCauHoi >= 1) {
    // Định vị bằng THỨ TỰ CÂU HỎI, y như `quayLui` — bản hiển thị và bản giao
    // thức không cùng độ dài nên chỉ số mảng không dịch được giữa hai bên.
    const viTri: number[] = [];
    goc.hoiThoai.forEach((m, i) => { if (m.role === 'user') viTri.push(i); });
    const cat = viTri[denCauHoi - 1];
    if (cat === undefined) return null;
    hoiThoai = goc.hoiThoai.slice(0, cat);
    const dau = goc.hoiThoai[cat]!;
    cauHoi = Array.isArray(dau.content)
      ? dau.content.filter((x) => x.type === 'text').map((x) => String(x.text ?? '')).join(' ')
      : String(dau.content ?? '');
  }

  const moi = await taoPhienNhanh(hoiThoai, goc.duAn, goc.goc ?? null, goc.tieuDe);
  return { ...moi, ...(cauHoi === undefined ? {} : { cauHoi }) };
}

/**
 * Đặt tên cho bản nhánh.
 *
 * Tách thành hàm riêng vì nó có ĐÚNG một cái bẫy, và cái bẫy đó chỉ lộ ra khi
 * chạy thật: tách nhánh của một bản nhánh cho ra "Việc A (nhánh) (nhánh)", rồi
 * "(nhánh) (nhánh) (nhánh)". Đếm số thay vì chồng đuôi.
 */
export function tenNhanh(tenGocTho: string): string {
  const goc = tenGocTho.trim() || 'Việc chưa đặt tên';
  const m = /^(.*) \(nhánh(?: (\d+))?\)$/.exec(goc);
  const ten = m
    ? `${m[1]} (nhánh ${Number(m[2] ?? '1') + 1})`
    : `${goc} (nhánh)`;
  return ten.slice(0, MAX_TIEU_DE);
}

/**
 * Ghi một phiên NHÁNH mới ra đĩa. CHỖ DUY NHẤT tạo bản nhánh.
 *
 * Hai đường dẫn tới đây: menu ⋮ trong thanh bên (chép từ FILE, qua
 * `nhanBanPhien`) và nút "Tách nhánh từ đây" dưới một tin nhắn (chép từ hội
 * thoại đang nằm trong BỘ NHỚ của main, qua `tachNhanhCuoc` ở loop.ts). Hai
 * nguồn, nhưng chỉ một chỗ đặt tên và một chỗ ghi file — nếu không thì hai
 * bản nhánh sinh ra từ hai đường sẽ khác nhau ở những chỗ không ai ngờ.
 */
export async function taoPhienNhanh(
  hoiThoai: TinNhanLuu[],
  duAn: string | null,
  goc: string | null,
  tenGocTho: string,
): Promise<{ id: string; tieuDe: string }> {
  const idMoi = `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
  const tenMoi = tenNhanh(tenGocTho);
  const noi: FilePhien = {
    id: idMoi,
    tieuDe: tenMoi,
    duAn,
    goc,
    luucLuc: Date.now(),
    soTinNhan: hoiThoai.length,
    hoiThoai,
  };

  await fs.mkdir(thuMuc(), { recursive: true });
  const dich = duongDan(idMoi);
  const tam = `${dich}.tmp`;
  await fs.writeFile(tam, JSON.stringify(noi), 'utf8');
  await fs.rename(tam, dich);
  // Đánh dấu ĐÃ ĐẶT TÊN để lời gọi "AI đặt tên" của lượt sau không thay mất
  // chữ "(nhánh)" — thứ duy nhất phân biệt bản sao với bản gốc trong danh sách.
  await suaNhan(idMoi, { ten: tenMoi });

  return { id: idMoi, tieuDe: tenMoi };
}

/**
 * Xoá phiên cũ nhất khi vượt trần. Lỗi ở đây KHÔNG được làm hỏng việc lưu.
 *
 * ⚠️ KHÔNG đụng tới phiên ĐÃ GHIM. Ghim nghĩa là "giữ cái này lại"; để bộ dọn
 * xoá nó vì nó cũ là làm đúng ngược thứ người dùng vừa yêu cầu.
 */
async function donBot(): Promise<void> {
  try {
    const ds = await danhSachPhien();
    const boDuoc = ds.filter((p) => p.ghim !== true);
    for (const p of boDuoc.slice(MAX_PHIEN)) await xoaPhien(p.id);
  } catch {
    /* dọn dẹp hỏng thì thôi — không đáng để mất một phiên vừa lưu */
  }
}

// ─── Dựng lại bản hiển thị từ bản giao thức ────────────────────────

export type MucKhoiPhuc =
  | { kieu: 'nguoi'; text: string }
  | { kieu: 'may'; text: string }
  | { kieu: 'tool'; ten: string; tomTat: string };

/**
 * Bản giao thức → bản hiển thị.
 *
 * Không dựng lại được thẻ duyệt kèm diff (diff không nằm trong bản giao thức,
 * và dựng lại nó nghĩa là đọc lại file — mà file có thể đã đổi từ lâu). Thay
 * vào đó hiện một dòng công cụ nói rõ đã làm gì. Đó là sự thật; một cái thẻ
 * duyệt dựng lại với diff tính theo nội dung HÔM NAY thì không.
 */
export function dungLaiHienThi(hoiThoai: TinNhanLuu[]): MucKhoiPhuc[] {
  const ra: MucKhoiPhuc[] = [];
  // Tra kết quả theo `tool_call_id` để dòng công cụ nói được nó ra sao, thay vì
  // chỉ nói nó đã được gọi.
  const ketQua = new Map<string, string>();
  for (const m of hoiThoai) {
    if (m.role === 'tool' && m.tool_call_id) ketQua.set(m.tool_call_id, String(m.content ?? ''));
  }

  for (const m of hoiThoai) {
    if (m.role === 'user') {
      // Lượt có ảnh: chỉ dựng lại phần CHỮ. Data URI base64 nằm trong file phiên
      // nhưng không vẽ lại — một ảnh 2MB dựng vào bảng ghi khôi phục làm màn
      // hình khựng, và người dùng đã nhìn thấy nó lúc gửi rồi.
      const c = m.content;
      const text = Array.isArray(c)
        ? c.filter((k) => k?.type === 'text').map((k) => String(k.text ?? '')).join(' ')
          + (c.some((k) => k?.type === 'image_url') ? '  🖼 (có ảnh đính kèm)' : '')
        : String(c ?? '');
      ra.push({ kieu: 'nguoi', text });
    } else if (m.role === 'assistant') {
      const chu = String(m.content ?? '').trim();
      if (chu) ra.push({ kieu: 'may', text: chu });
      for (const c of m.tool_calls ?? []) {
        ra.push({ kieu: 'tool', ten: c.function.name, tomTat: tomTatKetQua(ketQua.get(c.id) ?? '') });
      }
    }
    // `role:'tool'` đã được gộp vào dòng công cụ ở trên — hiện riêng thì bảng
    // ghi đầy những khối chữ thô mà người dùng chưa từng nhìn thấy lúc chạy.
  }
  return ra;
}

/** Một dòng tóm tắt kết quả tool, cho bảng ghi khôi phục. */
function tomTatKetQua(noi: string): string {
  if (!noi) return '';
  if (noi.startsWith('LỖI')) return 'lỗi';
  if (/NGƯỜI DÙNG TỪ CHỐI/.test(noi)) return 'bị từ chối';
  const soDong = noi.split('\n').length;
  const dauTien = noi.split('\n')[0]?.trim() ?? '';
  // Kết quả một dòng thì chính nó là tóm tắt tốt nhất.
  return soDong <= 2 && dauTien.length <= 60 ? dauTien : `${soDong} dòng`;
}

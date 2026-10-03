/**
 * ============================================================
 * THÂN YÊU CẦU GỬI LÊN MÁY CHỦ — gỡ ảnh cũ, giữ dưới trần, ghép bản /compact
 * ============================================================
 *
 * ─── VÌ SAO (03/10/2026) ───
 * Giao thức gửi LẠI TOÀN BỘ hội thoại ở MỖI vòng gọi cổng. Một việc dài mà
 * agent tự chụp màn hình trình duyệt (`web_anh`) cứ thế cõng mọi tấm ảnh cũ đi
 * lên ở mọi vòng sau — vài chục tấm base64 là vượt trần thân yêu cầu và máy chủ
 * trả 413 "Ảnh hoặc tệp gửi kèm quá lớn" GIỮA một việc 40 bước. Máy chủ đã nới
 * `/api/v1/agent` lên 48MB, nhưng nới trần chỉ dời chỗ vỡ; gốc là app không
 * nên gửi lại ảnh mà agent đã đọc xong từ lâu.
 *
 * Máy chủ VỐN đã gỡ ảnh cũ trước khi gọi model (`src/services/agent/compact.ts`,
 * chỉ giữ ảnh của lượt gần nhất) — tức là ảnh cũ chỉ tốn băng thông và chạm
 * trần thân yêu cầu, model không bao giờ thấy lại chúng. Gỡ ngay ở app là bỏ
 * đúng phần vô ích đó.
 *
 * ⛔ KHÔNG BAO GIỜ bỏ cả một tin nhắn: mỗi `tool_call` cần đúng một tin `tool`
 * trả lời. Chỉ thay khối ảnh bằng một dòng chữ.
 *
 * ⛔ Chỉ sửa BẢN GỬI ĐI. `c.hoiThoai` (bản lưu phiên, bản quay lui đếm lượt)
 * giữ nguyên — người dùng mở lại phiên vẫn còn ảnh của mình.
 */

/** Dòng thay cho ảnh đã gỡ — cùng giọng với `compact.ts` phía máy chủ. */
export const ANH_DA_GO = '[ảnh đã gỡ]';

/** Mặc định giữ ảnh của ngần này lượt người dùng gần nhất. */
export const GIU_ANH_LUOT = 2;

/**
 * Ngưỡng tự gỡ thêm. Máy chủ nhận 48MB; dừng ở ~30MB để chừa chỗ cho phần còn
 * lại của thân (prompt dự án, kỹ năng, MCP) và cho nginx đứng trước nó.
 */
export const TRAN_THAN_BYTE = 30 * 1024 * 1024;

type Khoi =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export interface TinGui {
  role: 'user' | 'assistant' | 'tool';
  content?: string | Khoi[] | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
  /** Ảnh kèm kết quả tool (`web_anh`) — trường riêng của giao thức AI Code. */
  anh?: Array<{ media_type: string; data: string }>;
}

export interface KetQuaGoAnh {
  messages: TinGui[];
  soAnhDaGo: number;
}

/**
 * Gỡ ảnh khỏi mọi tin TRƯỚC lượt thứ `giuLuot` tính từ cuối.
 *
 * `giuLuot = 0` ⇒ gỡ sạch (đường lùi khi đã 413). Không có ảnh nào để gỡ thì
 * trả LẠI CHÍNH mảng đầu vào — gọi ở mọi vòng nên đừng sao chép vô cớ.
 */
export function goAnhCu(ds: readonly TinGui[], giuLuot: number = GIU_ANH_LUOT): KetQuaGoAnh {
  const dauLuot: number[] = [];
  ds.forEach((m, i) => { if (m.role === 'user') dauLuot.push(i); });
  const tu = giuLuot <= 0
    ? ds.length
    : dauLuot.length > giuLuot ? dauLuot[dauLuot.length - giuLuot]! : 0;

  let soAnhDaGo = 0;
  let doi = false;
  const ra = ds.map((m, i): TinGui => {
    if (i >= tu) return m;
    if (m.role === 'user' && Array.isArray(m.content)) {
      const anh = m.content.filter((k) => k.type === 'image_url').length;
      if (anh === 0) return m;
      soAnhDaGo += anh;
      doi = true;
      return {
        ...m,
        content: [...m.content.filter((k) => k.type === 'text'), { type: 'text', text: ANH_DA_GO }],
      };
    }
    if (m.role === 'tool' && Array.isArray(m.anh) && m.anh.length > 0) {
      soAnhDaGo += m.anh.length;
      doi = true;
      const { anh: _bo, ...con } = m;
      return { ...con, content: `${typeof m.content === 'string' ? m.content : ''}\n${ANH_DA_GO}` };
    }
    return m;
  });
  return { messages: doi ? ra : (ds as TinGui[]), soAnhDaGo };
}

export interface ThanDaChuanBi {
  than: string;
  /** Kích thước thật (byte UTF-8) của thân sẽ gửi. */
  kichThuoc: number;
  soAnhDaGo: number;
  /** Số lượt cuối còn giữ ảnh sau khi tự gỡ thêm (0 = gỡ sạch). */
  giuLuot: number;
}

/**
 * Dựng thân yêu cầu, tự gỡ thêm ảnh nếu thân vượt `tran`.
 *
 * `dung` nhận mảng tin đã gỡ ảnh và trả CHUỖI JSON đầy đủ — để phép đo là đo
 * đúng thứ sẽ lên dây (kể cả prompt dự án, kỹ năng, MCP), không phải ước lượng.
 * Hết đường gỡ mà vẫn vượt thì cứ gửi: máy chủ sẽ 413 và chỗ gọi xử lý.
 */
export function chuanBiThan(
  dung: (messages: TinGui[]) => string,
  ds: readonly TinGui[],
  o: { giuLuot?: number; tran?: number } = {},
): ThanDaChuanBi {
  const tran = o.tran ?? TRAN_THAN_BYTE;
  let giu = o.giuLuot ?? GIU_ANH_LUOT;
  for (;;) {
    const g = goAnhCu(ds, giu);
    const than = dung(g.messages);
    const kichThuoc = Buffer.byteLength(than, 'utf8');
    if (kichThuoc <= tran || giu <= 0) return { than, kichThuoc, soAnhDaGo: g.soAnhDaGo, giuLuot: giu };
    giu -= 1;
  }
}

/** Bản tóm tắt do `/compact` tạo — thay `soTinDaGop` tin đầu khi GỬI. */
export interface TomTatCompact {
  soTinDaGop: number;
  noiDung: string;
  /** Lúc tạo (ms) — để `/context` nói "đã tóm tắt lúc …". */
  luc: number;
}

/**
 * Hội thoại GỬI LÊN khi đã có bản `/compact`: một cặp user/assistant chở bản
 * tóm tắt, rồi phần giữ nguyên. Cặp đó cần cả tin assistant: phần giữ nguyên
 * bắt đầu bằng một tin `user`, và hai tin `user` liền nhau thì tuyến Anthropic
 * của cổng gộp/từ chối tuỳ phiên bản.
 *
 * Bản tóm tắt KHÔNG còn khớp (hội thoại đã bị quay lui ngắn hơn phần đã gộp)
 * thì bỏ qua nó — gửi nguyên văn còn hơn gửi một bản tóm tắt nói về những
 * lượt không còn tồn tại.
 */
export function ghepTomTat<T extends TinGui>(ds: readonly T[], tt: TomTatCompact | null): TinGui[] {
  if (!tt || tt.soTinDaGop <= 0 || tt.soTinDaGop > ds.length) return ds as unknown as TinGui[];
  if (ds[tt.soTinDaGop]?.role !== 'user' && tt.soTinDaGop !== ds.length) return ds as unknown as TinGui[];
  return [
    { role: 'user', content: tt.noiDung },
    { role: 'assistant', content: 'Đã nắm bản tóm tắt phần trước. Tôi làm tiếp từ đây, giữ đúng các yêu cầu và ràng buộc trong đó.' },
    ...ds.slice(tt.soTinDaGop),
  ];
}

/** Dựng nội dung tin nhắn chở bản tóm tắt. */
export function noiDungTomTat(deBai: string | null, tomTat: string, soLuot: number): string {
  return [
    `[BẢN TÓM TẮT ${soLuot} lượt đầu của việc này — người dùng đã chủ động /compact; các lượt đó được thay bằng bản này.]`,
    deBai ? `\nĐề bài gốc (nguyên văn):\n${deBai}` : '',
    `\nTóm tắt:\n${tomTat}`,
  ].join('\n');
}

/** Chữ của một tin, ảnh không tính. */
function chuCua(m: TinGui): string {
  if (typeof m.content === 'string') return m.content;
  if (Array.isArray(m.content)) {
    return m.content.flatMap((k) => (k.type === 'text' ? [k.text] : [])).join('\n');
  }
  return '';
}

export interface NguCanhChiTiet {
  /** Đề bài = tin đầu tiên của người dùng. */
  deBai: number;
  /** Mọi câu người dùng/agent còn lại (chữ). */
  lichSu: number;
  /** Kết quả tool + tham số lời gọi tool (create_file chở cả nội dung file). */
  ketQuaTool: number;
  /** Số ảnh còn nằm trong hội thoại và tổng byte base64 của chúng. */
  soAnh: number;
  byteAnh: number;
  /** Tổng ký tự CHỮ — cùng cách đếm với trần 600k của máy chủ (ảnh không tính). */
  tong: number;
  soTin: number;
  soLuot: number;
  /** Tổng ký tự chữ SẼ GỬI (sau khi ghép bản /compact). */
  tongGui: number;
}

/**
 * `/context` — chia ngữ cảnh theo loại. Đếm KÝ TỰ chữ như `catCu.ts` phía máy
 * chủ (nên con số so được với trần 600k), ảnh đếm riêng vì chúng có đường
 * quản lý riêng.
 */
export function phanTichNguCanh(ds: readonly TinGui[], tt: TomTatCompact | null): NguCanhChiTiet {
  const dem = (xs: readonly TinGui[]): Omit<NguCanhChiTiet, 'tongGui' | 'soTin' | 'soLuot'> => {
    let deBai = 0; let lichSu = 0; let ketQuaTool = 0; let soAnh = 0; let byteAnh = 0;
    let daCoDe = false;
    for (const m of xs) {
      const chu = chuCua(m).length;
      if (m.role === 'user') {
        if (!daCoDe) { deBai += chu; daCoDe = true; } else lichSu += chu;
        if (Array.isArray(m.content)) {
          for (const k of m.content) if (k.type === 'image_url') { soAnh++; byteAnh += k.image_url.url.length; }
        }
      } else if (m.role === 'assistant') {
        lichSu += chu;
        for (const c of m.tool_calls ?? []) ketQuaTool += c.function.name.length + c.function.arguments.length;
      } else {
        ketQuaTool += chu;
        for (const a of m.anh ?? []) { soAnh++; byteAnh += a.data.length; }
      }
    }
    return { deBai, lichSu, ketQuaTool, soAnh, byteAnh, tong: deBai + lichSu + ketQuaTool };
  };
  const goc = dem(ds);
  const gui = ghepTomTat(ds, tt);
  return {
    ...goc,
    soTin: ds.length,
    soLuot: ds.filter((m) => m.role === 'user').length,
    tongGui: gui === ds ? goc.tong : dem(gui).tong,
  };
}

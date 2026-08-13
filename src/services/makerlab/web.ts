/**
 * ============================================================
 * Mini-Me Robot — tra cứu ngoài internet
 * ============================================================
 *
 * Model được huấn luyện xong ở một thời điểm rồi đứng yên ở đó. Hỏi nó
 * "hôm nay có tin gì" thì nó không im lặng thú nhận — nó BỊA ra một bản
 * tin nghe rất hợp lý. Đó là kiểu sai tệ nhất, vì không có dấu hiệu nào
 * để nhận ra.
 *
 * ── Vì sao tra TRƯỚC chứ không để model tự gọi công cụ ──
 *
 * Cách chuẩn của ngành là "gọi công cụ": model đọc câu hỏi, quyết định
 * cần tra, trả về một lời gọi hàm, ta chạy hàm rồi gọi model LẦN HAI
 * kèm kết quả. Đúng đắn và tổng quát, nhưng nó nhân đôi số lượt gọi
 * model — mà đo trên chính con robot này, một lượt gọi là 1,6 giây tới
 * chữ đầu tiên. Người ta đang đứng trước mặt nó chờ nghe tiếng.
 *
 * Nên ở đây làm ngược: đoán trước xem câu hỏi có cần tin mới không,
 * tra xong mới gọi model MỘT lần duy nhất, kèm luôn kết quả trong đề
 * bài. Mất thêm ~0,5 giây cho phép tra, thay vì thêm cả một lượt model.
 *
 * Cái giá phải trả: phép đoán bằng từ khoá sẽ có lúc tra thừa và có lúc
 * bỏ sót. Tra thừa thì tốn nửa giây; bỏ sót thì model trả lời bằng kiến
 * thức cũ của nó — đúng như trước khi có file này. Không có đường nào
 * tệ hơn hiện trạng, nên đánh đổi này chấp nhận được.
 *
 * ── Vì sao RSS báo Việt chứ không phải một API tìm kiếm ──
 *
 * Câu hỏi người dùng thật sự hỏi là "hôm nay có bản tin gì hot". Với
 * câu đó thì trang tin trong nước trả lời tốt hơn mọi máy tìm kiếm:
 * đúng ngôn ngữ, đúng thứ tự quan tâm, có sẵn dòng tóm tắt, và KHÔNG
 * CẦN KHOÁ API nào — tức không có thêm một thứ nữa để hết hạn mức lúc
 * nửa đêm (xem chuyện Groq 429 cùng ngày).
 */

import { logger } from '../../utils/logger.js';

export interface MucTin {
  tieuDe: string;
  tomTat: string;
  nguon: string;
}

/**
 * Nguồn tin. Nhiều nguồn chứ không một, vì một trang chết là mất sạch —
 * và "robot bảo không có tin gì" trông y hệt "hôm nay không có tin gì".
 */
const NGUON_RSS: Array<{ ten: string; url: string }> = [
  { ten: 'VnExpress', url: 'https://vnexpress.net/rss/tin-moi-nhat.rss' },
  { ten: 'Tuổi Trẻ', url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss' },
  { ten: 'VietnamNet', url: 'https://vietnamnet.vn/rss/tin-moi-nhat.rss' },
];

const NGUON_CONG_NGHE: Array<{ ten: string; url: string }> = [
  { ten: 'VnExpress Số hoá', url: 'https://vnexpress.net/rss/so-hoa.rss' },
  { ten: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
];

/** Bỏ thẻ HTML và giải mã mấy thực thể hay gặp trong RSS. */
function lamSach(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Đọc một nguồn RSS.
 *
 * Tự bắt lỗi và trả mảng rỗng thay vì ném: một trang báo chết KHÔNG
 * được phép làm robot câm. Nó chỉ nên làm robot biết ít hơn.
 */
async function docRss(nguon: { ten: string; url: string }, soMuc: number): Promise<MucTin[]> {
  try {
    const res = await fetch(nguon.url, {
      signal: AbortSignal.timeout(6_000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MiniMeRobot/1.0)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const muc: MucTin[] = [];
    // Cả hai khuôn: <item> của RSS 2.0 và <entry> của Atom (The Verge).
    const re = /<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/g;
    for (const khoi of xml.match(re) ?? []) {
      const tieuDe = lamSach(khoi.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '');
      const tomTat = lamSach(
        khoi.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] ??
          khoi.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1] ??
          '',
      );
      if (!tieuDe) continue;
      muc.push({ tieuDe, tomTat: tomTat.slice(0, 220), nguon: nguon.ten });
      if (muc.length >= soMuc) break;
    }
    return muc;
  } catch (err) {
    logger.warn(
      `MakerLab đọc RSS hỏng ${nguon.ten}: ${err instanceof Error ? err.message : String(err)}`,
    );
    return [];
  }
}

/** Tin nóng hôm nay, gộp từ nhiều báo, xen kẽ để không nghiêng về một nguồn. */
export async function tinMoiNhat(soMuc = 8, congNghe = false): Promise<MucTin[]> {
  const nguon = congNghe ? NGUON_CONG_NGHE : NGUON_RSS;
  const dot = await Promise.all(nguon.map((n) => docRss(n, Math.ceil(soMuc / nguon.length) + 2)));

  // Xen kẽ: lấy mục 1 của mọi báo, rồi mục 2 của mọi báo… Nối đuôi nhau
  // thì báo đầu tiên chiếm hết chỗ và robot chỉ đọc mỗi VnExpress.
  const ra: MucTin[] = [];
  for (let i = 0; ra.length < soMuc; i++) {
    let themDuoc = false;
    for (const d of dot) {
      if (d[i]) {
        ra.push(d[i]);
        themDuoc = true;
        if (ra.length >= soMuc) break;
      }
    }
    if (!themDuoc) break;
  }
  return ra;
}

/**
 * Tìm trên web, qua bản HTML rút gọn của DuckDuckGo.
 *
 * Không cần khoá API — đổi lại là ta đang đọc HTML của người ta, và HTML
 * thì đổi lúc nào không báo. Nên mọi thứ ở đây fail mềm: hỏng thì trả
 * mảng rỗng, robot trả lời bằng kiến thức sẵn có và nói rõ là không tra
 * được. Không bao giờ để một trang web bên ngoài làm robot đứng hình.
 */
export async function timTrenWeb(cauHoi: string, soMuc = 5): Promise<MucTin[]> {
  try {
    const res = await fetch('https://lite.duckduckgo.com/lite/', {
      method: 'POST',
      signal: AbortSignal.timeout(7_000),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      },
      body: new URLSearchParams({ q: cauHoi, kl: 'vn-vi' }).toString(),
    });
    if (!res.ok) return [];
    const html = await res.text();

    const muc: MucTin[] = [];
    // Bản lite xếp mỗi kết quả thành: một <a class="result-link"> tiêu đề,
    // rồi một <td class="result-snippet"> mô tả.
    // ⚠️ Nháy ĐƠN hay nháy KÉP đều phải khớp. Trang này viết
    // `class='result-link'` bằng nháy đơn, và bản trước chỉ tìm nháy
    // kép nên trả về 0 kết quả — im lặng, không lỗi, trông y hệt như
    // "DuckDuckGo không tìm thấy gì". Chạy thật mới lộ ra.
    const reLink = /<a[^>]*class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>/g;
    const reSnip = /<td[^>]*class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/g;
    const tieuDes = [...html.matchAll(reLink)].map((m) => lamSach(m[1]));
    const tomTats = [...html.matchAll(reSnip)].map((m) => lamSach(m[1]));

    for (let i = 0; i < tieuDes.length && muc.length < soMuc; i++) {
      if (!tieuDes[i]) continue;
      muc.push({
        tieuDe: tieuDes[i],
        tomTat: (tomTats[i] ?? '').slice(0, 260),
        nguon: 'web',
      });
    }
    return muc;
  } catch (err) {
    logger.warn(
      `MakerLab tìm web hỏng: ${err instanceof Error ? err.message : String(err)}`,
    );
    return [];
  }
}

/**
 * Câu hỏi này có cần tra không, và tra kiểu gì.
 *
 * Bằng từ khoá chứ không bằng một lượt gọi model phân loại: gọi model
 * để quyết định có gọi model hay không thì đã tốn đúng cái mình định
 * tiết kiệm.
 *
 * Sai sót của phép đoán này lệch về phía an toàn:
 *   tra thừa  → tốn nửa giây, câu trả lời vẫn đúng
 *   bỏ sót    → model dùng kiến thức cũ, y như trước khi có file này
 */
export function canTraCuu(cauHoi: string): 'tin' | 'tin-cong-nghe' | 'tim' | null {
  const s = cauHoi.toLowerCase();

  const nhacToiTin = /\b(tin t[ưứ]c|b[ảa]n tin|th[ờo]i s[ựu]|tin g[ìi]|c[óo] g[ìi] hot|hot nh[ấa]t|n[óo]ng nh[ấa]t|đ[ang]ng hot|tin m[ớo]i)\b/.test(s);
  const nhacToiCongNghe = /\b(c[ôo]ng ngh[ệe]|ai\b|tr[íi] tu[ệe]|iphone|android|chip|startup|l[ậa]p tr[ìi]nh)\b/.test(s);

  if (nhacToiTin) return nhacToiCongNghe ? 'tin-cong-nghe' : 'tin';

  // "tin công nghệ mới nhất" không có cụm "tin mới" liền nhau nên lọt
  // qua phép xét trên. Chữ "tin" đứng cạnh chữ công nghệ là đủ rõ.
  if (nhacToiCongNghe && /\btin\b/.test(s)) return 'tin-cong-nghe';

  // Hỏi về thứ THAY ĐỔI theo thời gian, hoặc thứ model không thể biết.
  const moiTinh = /\b(h[ôo]m nay|h[ôo]m qua|tu[ầa]n n[àa]y|n[ăa]m nay|hi[ệe]n t[ạa]i|b[âa]y gi[ờo]|m[ớo]i nh[ấa]t|v[ừu]a r[ồo]i|g[ầa]n đ[âa]y|gi[áa] (v[àa]ng|[đd][ôo] la|bitcoin|xăng)|t[ỉi] gi[áa]|th[ờo]i ti[ếe]t|k[ếe]t qu[ảa] (tr[ậa]n|b[óo]ng đ[áa]))\b/.test(s);
  const hoiTraCuu = /\b(t[ìi]m (gi[úu]p|h[ộo]|xem)|tra c[ứu]u|search|google|tra gi[úu]p)\b/.test(s);

  // Tục ngữ / thành ngữ / ca dao.
  //
  // Không phải thứ "thay đổi theo thời gian" nên nó không lọt vào phép xét
  // trên, nhưng model 9B chạy ở máy nhà KHÔNG thuộc kho này và nó không im
  // lặng — nó bịa. Đo 13/08/2026: "Ăn cỗ đi trước, ..." → nó điền "ăn trước
  // đi sau" (đúng là "lội nước theo sau"), 2/6 lần đúng so với 4/6 của model
  // cổng. Bịa một câu tục ngữ nghe rất trôi chảy và người nghe tin ngay.
  //
  // Prompt không nhồi được kiến thức vào model, chỉ chặn được nó nói bừa.
  // Muốn TRẢ LỜI ĐÚNG thì phải đưa dữ liệu vào — nên tra web, đúng đường đã
  // dùng cho tin tức.
  // ⚠️ KHÔNG DÙNG `\b` QUANH CHỮ TIẾNG VIỆT CÓ DẤU.
  //    `\b` của JavaScript dựa trên `\w` = [A-Za-z0-9_], mà `ữ` không nằm
  //    trong đó. Nên `/\btục ngữ\b/` chỉ khớp khi ngay sau "ngữ" là một chữ
  //    cái ASCII — tức gần như không bao giờ. Đo 13/08/2026: câu "Điền nốt
  //    câu tục ngữ giúp tao" cho ra `canTraCuu → KHÔNG tra`, im lặng, không
  //    lỗi. Mấy regex cũ ở trên thoát nạn nhờ may: "tin tức" kết thúc bằng
  //    "c", một ký tự ASCII.
  //    Mấy cụm này đủ đặc trưng nên khớp chuỗi con là đủ, không cần biên.
  const hoiTucNgu =
    /(t[ụu]c ng[ữu]|th[àa]nh ng[ữu]|ca dao|c[âa]u n[óo]i d[âa]n gian|[đd]i[ềe]n n[ốo]t|[đd]i[ềe]n ti[ếe]p|[đd]i[ềe]n gi[úu]p|v[ếe] sau|c[âa]u [đd][ầa]y [đd][ủu])/.test(s);

  if (moiTinh || hoiTraCuu || hoiTucNgu) return 'tim';
  return null;
}

/**
 * Gói kết quả tra thành một đoạn nhét vào đề bài cho model.
 *
 * Ghi rõ mốc thời gian: không có nó thì model đọc mấy dòng tin này rồi
 * nói "vừa mới xảy ra" cho một bài báo đọc lúc nào cũng được.
 */
export function dungDoanTraCuu(muc: MucTin[], kieu: string): string {
  if (!muc.length) return '';
  const gio = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const dong = muc
    .map((m, i) => `${i + 1}. [${m.nguon}] ${m.tieuDe}${m.tomTat ? ` — ${m.tomTat}` : ''}`)
    .join('\n');

  return [
    `KẾT QUẢ TRA CỨU (${kieu}), lấy lúc ${gio}:`,
    dong,
    '',
    'Dùng mấy dòng trên để trả lời. Nói theo giọng của mày, chọn ra vài cái',
    'đáng chú ý nhất chứ đừng đọc hết cả danh sách như đọc mục lục.',
    '',
    // ⚠️ Câu "KHÔNG được bịa" trừu tượng KHÔNG đủ — nó từng nằm ở đây và
    //    model 9B vẫn vượt rào. Đo 13/08/2026: danh sách chỉ có TIÊU ĐỀ
    //    trang giá vàng, không con số nào, mà model vẫn phán "vàng SJC và
    //    9999 đang biến động khá mạnh". Nó không bịa con số — nó bịa một
    //    NHẬN ĐỊNH, thứ nghe vô hại nên lọt qua mọi luật chung chung.
    //    Model nhỏ theo được ví dụ cụ thể, không theo được nguyên tắc.
    'LUẬT SẮT — chỉ được nói lại thứ CÓ CHỮ ở trên. Không suy ra, không',
    'đoán xu hướng, không thêm nhận định:',
    '- Trên chỉ có tiêu đề "Giá vàng SJC hôm nay" mà KHÔNG có con số ⇒ nói',
    '  "tra được mấy trang giá vàng mà không trang nào ghi con số".',
    '  TUYỆT ĐỐI không nói "đang tăng", "biến động mạnh", "giảm nhẹ" —',
    '  không dòng nào ở trên nói thế.',
    '- Không chắc thứ gì có ở trên hay không ⇒ bỏ, đừng nói.',
    'Danh sách không dính gì tới câu hỏi thì nói thẳng là không tra được.',
    'Thà cụt hứng còn hơn nói sai — người ta nghe rồi tin theo.',
  ].join('\n');
}

/**
 * ============================================================
 * XƯỞNG REMIX — AI kèm cặp
 * ============================================================
 *
 * App desktop đã ĐO xong bài (nhịp, tông, LUFS, đỉnh thật, phổ mười dải, và
 * chênh lệch với bản mẫu). Dịch vụ này nhận đúng những con số đó rồi giải
 * thích chúng thành việc làm được.
 *
 * ─── Vì sao ở BACKEND chứ không ở app desktop ───
 * Khoá cổng LLM không bao giờ được nằm trong một bản cài phát hành công khai —
 * cùng luật đã ghi trong CLAUDE.md cho `NEXT_PUBLIC_*`, và app desktop còn dễ
 * mổ hơn một bundle web. Desktop gọi route này kèm Bearer token; khoá ở lại
 * VPS. Đây cũng đúng cách agent lập trình của app đang chạy.
 *
 * ─── ⚠️ MÔ HÌNH KHÔNG ĐƯỢC BỊA SỐ ───
 * Đây là rủi ro đã có tiền lệ trong chính kho này: `eval:cv-fabrication` sinh
 * ra vì AI bịa ra các chỉ số trong bản mổ CV. Ở đây rủi ro y hệt và hậu quả cụ
 * thể hơn — một câu "hạ 3 dB ở 200 Hz" nghe rất chuyên nghiệp, và người dùng
 * sẽ làm theo, kể cả khi model chưa từng thấy con số nào ở 200 Hz.
 *
 * Ba lớp chặn:
 *   1. lời nhắc hệ thống cấm nêu con số không có trong bảng đo;
 *   2. bảng đo đưa vào đầy đủ, nên model không cần đoán;
 *   3. `dsSoDo()` liệt kê sẵn mọi con số hợp lệ để `kiemBia()` đối chiếu.
 */
import { BadRequestError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota } from './interview/llm/index.js';

/** Số đo một bài, do app desktop tính và gửi lên. */
export interface SoDoBai {
  ten: string;
  giay: number;
  bpm: number;
  bpmTinCay: number;
  tong: string;
  tongCamelot: string;
  tongTinCay: number;
  lufs: number;
  dinhThat: number;
  daiDong: number;
  rongStereo: number;
  /** Mức mỗi dải quãng tám, dB. Khoá là tần số trung tâm dạng chuỗi. */
  dai: Record<string, number>;
}

export interface YeuCauKem {
  bai: SoDoBai;
  /** Số đo bản mẫu, nếu người dùng đã nạp. */
  banMau?: SoDoBai | undefined;
  /** Chênh lệch do app tính sẵn (`chamBai`). */
  chenh?: string[] | undefined;
  /** Câu hỏi tự do. Bỏ trống thì làm bản mổ xẻ tổng quát. */
  cauHoi?: string | undefined;
}

const HE_THONG = `Bạn là người kèm cặp làm nhạc remix, chuyên vinahouse và nhạc sàn Việt.
Người hỏi là người mới, đang dùng một phần mềm đã ĐO SẴN bản nhạc của họ.

LUẬT TUYỆT ĐỐI — VI PHẠM LÀ HỎNG CẢ TÍNH NĂNG:
1. CHỈ được nêu những con số có trong bảng đo được cung cấp. Không suy ra, không
   ước lượng, không nhớ từ bài khác. Nếu cần một con số không có trong bảng,
   hãy NÓI RÕ là bảng đo không có nó.
2. Khi độ tin cậy của nhịp hoặc tông dưới 40%, phải nhắc người dùng nghe lại
   bằng tai trước khi làm theo — máy dò tông sai khoảng một nửa số lần.
3. Không hứa hẹn "làm thế này là hay". Nói rõ đây là gợi ý dựa trên số đo, còn
   quyết định cuối là tai người.

CÁCH TRẢ LỜI:
- Tiếng Việt, xưng "bạn", giọng như một người bạn có nghề chỉ việc.
- Ngắn gọn. Tối đa 6 gạch đầu dòng, mỗi dòng một việc LÀM ĐƯỢC NGAY.
- Mỗi gợi ý phải neo vào một con số cụ thể trong bảng đo.
- Không mở đầu bằng lời chào hay tóm tắt lại câu hỏi.`;

/** Một dòng số đo, dạng người và model cùng đọc được. */
function moTaBai(b: SoDoBai, nhan: string): string {
  const d = (v: number) => (Number.isFinite(v) ? v.toFixed(1) : 'không đo được');
  const pc = (v: number) => `${Math.round(v * 100)}%`;
  const dai = Object.entries(b.dai)
    .map(([f, v]) => `${Number(f) >= 1000 ? `${Number(f) / 1000}k` : f}Hz ${d(v)}`)
    .join(' · ');
  /* Bỏ hẳn dòng không có dữ liệu, KHÔNG in "nhịp 0 BPM".
     Bản mẫu chỉ được đo về mức to và phổ (app không dò nhịp/tông của nó), nên
     những trường ấy về 0. In ra thì model đọc "0 BPM" như một sự thật rồi
     khuyên theo — một con số sai còn tệ hơn một dòng thiếu. */
  const dong = [`${nhan}: "${b.ten}" (${Math.round(b.giay)} giây)`];
  if (b.bpm > 0) dong.push(`  nhịp ${b.bpm} BPM (tin cậy ${pc(b.bpmTinCay)})`);
  if (b.tong) dong.push(`  tông ${b.tong}, Camelot ${b.tongCamelot} (tin cậy ${pc(b.tongTinCay)})`);
  dong.push(`  độ to ${d(b.lufs)} LUFS · đỉnh thật ${d(b.dinhThat)} dBTP · dải động ${d(b.daiDong)} LU`);
  dong.push(`  rộng stereo ${pc(b.rongStereo)}`);
  if (dai) dong.push(`  phổ theo dải: ${dai}`);
  return dong.join('\n');
}

/**
 * Mọi con số hợp lệ trong lượt này, đã làm tròn như lúc đưa vào lời nhắc.
 *
 * Dùng cho `kiemBia()`. Tách ra thành hàm riêng để phép kiểm gọi được mà không
 * cần dựng cả lượt gọi LLM.
 */
export function dsSoDo(yc: YeuCauKem): Set<string> {
  const ra = new Set<string>();
  const them = (v: number) => {
    if (!Number.isFinite(v)) return;
    ra.add(v.toFixed(1));
    ra.add(String(Math.round(v)));
    ra.add(String(Math.abs(Math.round(v))));
  };
  for (const b of [yc.bai, yc.banMau]) {
    if (!b) continue;
    them(b.bpm); them(b.lufs); them(b.dinhThat); them(b.daiDong); them(b.giay);
    them(b.bpmTinCay * 100); them(b.tongTinCay * 100); them(b.rongStereo * 100);
    for (const [f, v] of Object.entries(b.dai)) { them(Number(f)); them(v); }
  }
  return ra;
}

/**
 * Tìm con số mà câu trả lời nêu ra nhưng bảng đo KHÔNG có.
 *
 * Không chặn lượt trả lời — chỉ đánh dấu, vì một bộ dò dựa trên chuỗi sẽ có
 * dương tính giả (model nói "3 stem", "bước 2", "4 ô nhịp"). Giao diện dùng cờ
 * này để nhắc người dùng đối chiếu, không để giấu câu trả lời đi.
 *
 * Bỏ qua số nhỏ (≤ 24): chúng gần như luôn là số thứ tự, số nửa cung, số ô
 * nhịp — không phải số đo.
 */
export function kiemBia(traLoi: string, hopLe: Set<string>): string[] {
  const la: string[] = [];
  for (const khop of traLoi.matchAll(/-?\d+(?:[.,]\d+)?/g)) {
    const tho = khop[0].replace(',', '.');
    const so = Math.abs(Number(tho));
    if (!Number.isFinite(so) || so <= 24) continue;
    const chuan = so.toFixed(1);
    if (hopLe.has(chuan) || hopLe.has(String(Math.round(so))) || hopLe.has(tho)) continue;
    if (!la.includes(tho)) la.push(tho);
  }
  return la;
}

export interface KetQuaKem {
  traLoi: string;
  model: string;
  /** Con số trong câu trả lời không khớp bảng đo. Rỗng là sạch. */
  soLa: string[];
  /**
   * Model dừng vì chạm trần token, không phải vì nói xong.
   *
   * Phải chuyển tiếp ra giao diện: một câu bị cắt GIỮA CÂU trông y hệt một câu
   * hoàn chỉnh, và người dùng chỉ biết khi đọc tới chỗ cụt — đúng triệu chứng
   * đã được báo ở Code Lab.
   */
  biCat: boolean;
}

const TRAN_CAU_HOI = 500;

export async function kemCap(userId: number, yc: YeuCauKem): Promise<KetQuaKem> {
  if (!yc.bai?.ten) throw new BadRequestError('Thiếu số đo của bài');
  if (yc.cauHoi && yc.cauHoi.length > TRAN_CAU_HOI) {
    throw new BadRequestError(`Câu hỏi tối đa ${TRAN_CAU_HOI} ký tự`);
  }
  await checkTokenQuota(userId);

  const phan = [moTaBai(yc.bai, 'BÀI CỦA NGƯỜI DÙNG')];
  if (yc.banMau) phan.push(moTaBai(yc.banMau, 'BẢN MẪU MUỐN GIỐNG'));
  if (yc.chenh?.length) {
    phan.push(`CHÊNH LỆCH so với bản mẫu (phần mềm đã tính):\n${yc.chenh.map((c) => `  - ${c}`).join('\n')}`);
  }
  phan.push(yc.cauHoi
    ? `CÂU HỎI: ${yc.cauHoi}`
    : 'Không có câu hỏi cụ thể. Hãy mổ xẻ bài này: nó đang ở đâu so với một bản '
      + 'vinahouse phát hành được, và ba việc cần làm tiếp theo là gì.');

  const res = await llmComplete({
    step: 'generation',
    feature: 'remix',
    purpose: 'remix_coach',
    system: HE_THONG,
    messages: [{ role: 'user', content: phan.join('\n\n') }],
    maxTokens: 900,
    maxRetries: 1,
    timeoutMs: 60_000,
    userId,
  });

  const traLoi = (res.text || '').trim();
  if (!traLoi) throw new BadRequestError('Model trả về câu rỗng. Thử lại giúp.');

  return { traLoi, model: res.model, soLa: kiemBia(traLoi, dsSoDo(yc)), biCat: res.biCat === true };
}

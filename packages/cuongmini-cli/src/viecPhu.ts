/**
 * AGENT PHỤ + LỆNH NỀN — theo dõi từ sự kiện của lõi để vẽ bảng kiểu Claude Code
 * (`● main` / `○ general-purpose  <việc đang làm>   1m 05s · ~$0.004`, "N shells").
 *
 * Lõi (`desktop/src/main/agent/loop.ts › chayViecPhu`, 18/10/2026) phát theo thứ tự:
 *   1. `toolBatDau {id, ten:'giao_viec_phu'}`              — lời gọi bắt đầu (id = tool_call_id)
 *   2. `tool {ten:'giao_viec_phu', tomTat:'[loai] nhiệm vụ…'}` — KHÔNG id, nhiệm vụ cắt 60 ký tự
 *   3. `phuBatDau {phuId, kieuAgent, nhiemVu, model?}`        — phuId = id ở (1), nhiệm vụ ĐẦY ĐỦ
 *   4. `phuSuKien {phuId, e}` — mọi sự kiện bên trong (batDau/chu/toolBatDau/tool/xong{tienUsd}/nghi/loi)
 *   5. `phuXong {phuId, ok, tomTat, tienUsd, tokenVao, tokenRa}` — tomTat = câu trả lời (≤2000) hoặc lý do hỏng
 *   6. `tool {id, ten:'giao_viec_phu', tomTat:'xong (n/N)', chiTiet:'KẾT QUẢ VIỆC PHỤ…'}`
 * Lõi CŨ chỉ có (1)(2)(6) — bảng vẫn chạy, chỉ thiếu từng bước bên trong.
 * `tool` của `chay_lenh_nen` mang `lenh` (câu lệnh nguyên văn); lõi cũ thì kho gắn `lenhNen` từ thẻ xin phép.
 */
import { L } from './i18n';
import { nhanTool, viecTool } from './trangThai';

export interface BuocPhu { luc: number; kieu: 'batDau' | 'nhiemVu' | 'tool' | 'chu' | 'xong' | 'loi'; mo: string; chiTiet?: string; hong?: boolean }

export interface AgentPhu {
  id: string;
  kieu: string;
  nhiemVu: string;
  batDau: number;
  ketThuc?: number;
  trangThai: 'dang' | 'xong' | 'loi' | 'dung';
  /** Việc đang làm (tool hiện tại) — dòng của bảng. */
  dangLam: string;
  buoc: BuocPhu[];
  chu: string;
  ketQua?: string;
  tomTat?: string;
  tienUsd: number;
  token: number;
  /** Model lượt chính lúc giao việc (lõi gửi kèm `phuBatDau`); máy chủ có thể hạ theo `mucModelPhu`. */
  model?: string;
  soTool: number;
  /** Đã nhận sự kiện BÊN TRONG (lõi mới) — không thì màn chi tiết ghi chú "lõi chưa báo từng bước". */
  coBuocTrong: boolean;
}

export interface LenhNen { id: string; lenh: string; batDau: number; dangChay: boolean; trangThai: string; ra: string; ketThuc?: number }

export interface TrangThaiPhu { agentPhu: AgentPhu[]; lenhNen: LenhNen[] }

const KIEU_MAC_DINH = 'general-purpose';
const TRAN_CHU = 20_000;

function timAgent(S: TrangThaiPhu, id: string): AgentPhu | undefined { return S.agentPhu.find((a) => a.id === id); }

function taoAgent(S: TrangThaiPhu, id: string, bayGio: number, batDauMoi = false): AgentPhu {
  const co = timAgent(S, id);
  // Id trùng một agent ĐÃ XONG mà lại "bắt đầu" ⇒ lượt mới dùng lại id (lõi giả, hoặc cổng đánh số lại) — tạo agent mới.
  if (co && !(batDauMoi && co.trangThai !== 'dang')) return co;
  if (co) S.agentPhu = S.agentPhu.filter((x) => x !== co);
  const a: AgentPhu = {
    id, kieu: KIEU_MAC_DINH, nhiemVu: '', batDau: bayGio, trangThai: 'dang', dangLam: L('Đang khởi động', 'Starting'),
    buoc: [{ luc: bayGio, kieu: 'batDau', mo: L('Bắt đầu', 'Started') }], chu: '', tienUsd: 0, token: 0, soTool: 0, coBuocTrong: false,
  };
  S.agentPhu = [...S.agentPhu, a];
  return a;
}

/** `[loai] nhiệm vụ…` (tóm tắt lúc bắt đầu của lõi) ⇒ loại + nhiệm vụ. */
export function tachTomTatPhu(tomTat: string): { kieu: string | null; nhiemVu: string } {
  const m = /^\[([^\]]+)\]\s*/.exec(tomTat);
  return { kieu: m ? m[1]! : null, nhiemVu: (m ? tomTat.slice(m[0].length) : tomTat).replace(/…$/, '').trim() };
}

/** Trạng thái agent phụ từ tóm tắt KẾT THÚC của lõi (chữ của lõi). */
function trangThaiKetThuc(tomTat: string): AgentPhu['trangThai'] {
  if (/^xong\b/.test(tomTat)) return 'xong'; // i18n-bo-qua: chữ của lõi
  if (/đã dừng/.test(tomTat)) return 'dung'; // i18n-bo-qua: chữ của lõi
  return 'loi';
}

function ketThuc(a: AgentPhu, tt: AgentPhu['trangThai'], bayGio: number, tomTat?: string, ketQua?: string): void {
  a.trangThai = tt;
  a.ketThuc = bayGio;
  if (tomTat !== undefined) a.tomTat = tomTat;
  if (ketQua !== undefined) a.ketQua = ketQua.replace(/^KẾT QUẢ VIỆC PHỤ — "[^"]*"\n\n/, ''); // i18n-bo-qua: tiêu đề do lõi viết
  a.dangLam = tt === 'xong' ? L('Xong', 'Done') : tt === 'dung' ? L('Đã dừng', 'Interrupted') : L('Lỗi', 'Failed');
  a.buoc.push({ luc: bayGio, kieu: tt === 'xong' ? 'xong' : 'loi', mo: a.dangLam, chiTiet: tomTat });
}

/** Một sự kiện BÊN TRONG agent phụ (`phuSuKien.e`). */
function suKienTrong(a: AgentPhu, e: { loai: string; [k: string]: unknown }, bayGio: number): void {
  switch (e.loai) {
    case 'batDau':
      if (typeof e.buoc === 'number') a.dangLam = L(`Bước ${e.buoc}`, `Step ${e.buoc}`);
      break;
    case 'chu':
      a.chu = (a.chu + String(e.delta ?? '')).slice(-TRAN_CHU);
      a.dangLam = L('Đang viết', 'Writing');
      break;
    case 'toolBatDau': {
      const ten = String(e.ten ?? '');
      a.dangLam = viecTool(ten) ?? nhanTool(ten);
      break;
    }
    case 'tool': {
      const ten = String(e.ten ?? '');
      a.soTool += 1;
      const thamSo = typeof e.duongDan === 'string' ? `(${e.duongDan})` : '';
      a.buoc.push({
        luc: bayGio, kieu: 'tool', mo: `${nhanTool(ten)}${thamSo}`, chiTiet: String(e.tomTat ?? ''),
        hong: /^(lỗi|error|bị chặn|bị từ chối|không có quyền)/i.test(String(e.tomTat ?? '')), // i18n-bo-qua: chữ của lõi
      });
      a.dangLam = `${nhanTool(ten)}${thamSo}`;
      break;
    }
    case 'xong':
      a.tienUsd += Number(e.tienUsd ?? 0);
      break;
    case 'nghi':
      a.dangLam = L('Đang suy nghĩ', 'Thinking');
      break;
    case 'loi': {
      // Lượt phụ cũng có thể bị đổi cổng (Free/modelapi) — đó là thông báo, không phải hỏng.
      const ma = String(e.ma ?? '');
      const chiLaTin = ma === 'CONG_CHINH_HONG_FREE' || ma === 'DOI_CONG' || ma === 'KHOI_PHUC' || ma === 'DOI_CONG_TU_DONG';
      a.buoc.push({ luc: bayGio, kieu: chiLaTin ? 'batDau' : 'loi', mo: chiLaTin ? L('Đổi cổng', 'Gateway switched') : L('Lỗi', 'Error'), chiTiet: String(e.thongDiep ?? ''), hong: !chiLaTin });
      break;
    }
    default:
  }
}

/**
 * Áp một sự kiện của lõi lên bảng agent phụ / lệnh nền. Không đụng bảng ghi
 * (kho vẫn tự in dòng tool như cũ). Trả `true` nếu là sự kiện CHỈ của bảng này.
 */
export function apSuKienPhu(S: TrangThaiPhu, e: { loai: string; [k: string]: unknown }, bayGio = Date.now()): boolean {
  switch (e.loai) {
    case 'phuBatDau': {
      const a = taoAgent(S, String(e.phuId ?? ''), bayGio, !S.agentPhu.some((x) => x.id === String(e.phuId) && x.trangThai === 'dang'));
      // Lõi đặt tên "general-purpose (ghi)" cho agent phụ GHI — giao diện English: "(write)".
      if (typeof e.kieuAgent === 'string' && e.kieuAgent) a.kieu = L(e.kieuAgent, e.kieuAgent.replace(/\(ghi\)$/, '(write)'));
      if (typeof e.model === 'string' && e.model) a.model = e.model;
      if (typeof e.nhiemVu === 'string') {
        a.nhiemVu = e.nhiemVu;
        // Lõi đã phát bản tóm tắt CẮT 60 ký tự ngay trước (tool không id) ⇒ thay bằng bản đầy đủ, không thêm bước thứ hai.
        const cu = a.buoc.find((b) => b.kieu === 'nhiemVu');
        if (cu) cu.chiTiet = e.nhiemVu;
        else a.buoc.push({ luc: bayGio, kieu: 'nhiemVu', mo: L('Nhận nhiệm vụ', 'Task received'), chiTiet: e.nhiemVu });
        if (a.dangLam === L('Đang khởi động', 'Starting')) a.dangLam = L('Đang làm việc', 'Working');
      }
      S.agentPhu = [...S.agentPhu];
      return true;
    }
    case 'phuSuKien': {
      const a = taoAgent(S, String(e.phuId ?? ''), bayGio);
      const trong = e.e as { loai: string } | undefined;
      if (trong && typeof trong.loai === 'string') { a.coBuocTrong = true; suKienTrong(a, trong as { loai: string; [k: string]: unknown }, bayGio); }
      S.agentPhu = [...S.agentPhu];
      return true;
    }
    case 'phuXong': {
      const a = taoAgent(S, String(e.phuId ?? ''), bayGio);
      if (a.trangThai !== 'dang') return true; // đã đóng (huỷ lượt) — giữ trạng thái "đã dừng"
      if (typeof e.tienUsd === 'number') a.tienUsd = e.tienUsd;
      a.token = Number(e.tokenVao ?? 0) + Number(e.tokenRa ?? 0) || a.token;
      const tomTat = typeof e.tomTat === 'string' ? e.tomTat : undefined;
      // ok:true ⇒ tomTat là CÂU TRẢ LỜI của agent phụ; ok:false ⇒ lý do ("đã dừng" = người dùng dừng).
      const tt = e.ok === false ? (tomTat && /đã dừng/.test(tomTat) ? 'dung' : 'loi') : 'xong'; // i18n-bo-qua: chữ của lõi
      ketThuc(a, tt, bayGio, tt === 'xong' ? undefined : tomTat, tt === 'xong' ? tomTat : undefined);
      S.agentPhu = [...S.agentPhu];
      return true;
    }
    case 'toolBatDau':
      if ((e.ten === 'giao_viec_phu' || e.ten === 'giao_viec_ghi') && e.id) taoAgent(S, String(e.id), bayGio, true);
      return false;
    case 'tool': {
      const ten = String(e.ten ?? '');
      const tomTat = String(e.tomTat ?? '');
      const chiTiet = typeof e.chiTiet === 'string' ? e.chiTiet : '';
      if (ten === 'giao_viec_phu' || ten === 'giao_viec_ghi') {
        if (!e.id) {
          // Tóm tắt LÚC BẮT ĐẦU (lõi không gắn id) ⇒ gán cho agent phụ mới nhất chưa có nhiệm vụ.
          const a = [...S.agentPhu].reverse().find((x) => x.trangThai === 'dang' && !x.nhiemVu);
          if (a) {
            const t = tachTomTatPhu(tomTat);
            if (t.kieu) a.kieu = t.kieu;
            a.nhiemVu = t.nhiemVu;
            a.dangLam = L('Đang làm việc', 'Working');
            a.buoc.push({ luc: bayGio, kieu: 'nhiemVu', mo: L('Nhận nhiệm vụ', 'Task received'), chiTiet: t.nhiemVu });
            S.agentPhu = [...S.agentPhu];
          }
          return false;
        }
        const a = timAgent(S, String(e.id));
        if (a && a.trangThai === 'dang') { ketThuc(a, trangThaiKetThuc(tomTat), bayGio, tomTat, chiTiet); S.agentPhu = [...S.agentPhu]; }
        else if (a) {
          // Lõi mới: `phuXong` đã đóng agent — (6) chỉ bổ sung tóm tắt "xong (n/N)" + bản kết quả đầy đủ nếu còn thiếu.
          if (!a.tomTat) a.tomTat = tomTat;
          if (chiTiet && a.trangThai === 'xong') {
            // `phuXong.tomTat` cắt ở 2000 ký tự; chiTiet ở đây dài hơn thì lấy bản này.
            const kq = chiTiet.replace(/^KẾT QUẢ VIỆC PHỤ — "[^"]*"\n\n/, ''); // i18n-bo-qua: tiêu đề do lõi viết
            if (!a.ketQua || kq.length > a.ketQua.length) a.ketQua = kq;
          }
          S.agentPhu = [...S.agentPhu];
        }
        return false;
      }
      if (ten === 'chay_lenh_nen') {
        const id = /^nền (\S+)/.exec(tomTat)?.[1]; // i18n-bo-qua: chữ của lõi
        if (id && !S.lenhNen.some((x) => x.id === id)) {
          // Lõi mới gửi `lenh` nguyên văn; lõi cũ: kho gắn `lenhNen` từ thẻ xin phép (tự duyệt thì chưa biết tới khi đọc đầu ra).
          const lenh = typeof e.lenh === 'string' && e.lenh ? e.lenh : typeof e.lenhNen === 'string' ? e.lenhNen : '';
          S.lenhNen = [...S.lenhNen, { id, lenh, batDau: bayGio, dangChay: true, trangThai: L('đang chạy', 'running'), ra: '' }];
        }
        return false;
      }
      if (ten === 'doc_dau_ra_nen') {
        // "Lệnh: X\nTrạng thái: …\n\n<đầu ra mới>" (chữ của lõi).
        const m = /^Lệnh: (.*)\nTrạng thái: (.*)\n\n?([\s\S]*)$/.exec(chiTiet); // i18n-bo-qua: chữ của lõi
        if (!m) return false;
        const [, lenh, tt, ra] = m;
        let x = S.lenhNen.find((l) => l.lenh === lenh) ?? S.lenhNen.find((l) => !l.lenh && l.dangChay);
        if (!x) { x = { id: `#${S.lenhNen.length + 1}`, lenh: lenh!, batDau: bayGio, dangChay: true, trangThai: '', ra: '' }; S.lenhNen = [...S.lenhNen, x]; }
        x.lenh = lenh!;
        x.dangChay = /^đang chạy/.test(tt!); // i18n-bo-qua: chữ của lõi
        x.trangThai = tt!;
        if (!x.dangChay && !x.ketThuc) x.ketThuc = bayGio;
        if (!/^\(chưa in thêm gì/.test(ra!)) x.ra = (x.ra + ra).slice(-TRAN_CHU); // i18n-bo-qua: chữ của lõi
        S.lenhNen = [...S.lenhNen];
        return false;
      }
      if (ten === 'dung_lenh_nen') {
        const id = /"([^"]+)"/.exec(chiTiet)?.[1];
        const x = S.lenhNen.find((l) => l.id === id);
        if (x) { x.dangChay = false; x.ketThuc = bayGio; x.trangThai = L('đã dừng', 'stopped'); S.lenhNen = [...S.lenhNen]; }
        return false;
      }
      return false;
    }
    case 'xinPhepLenh':
      return false;
    case 'huy':
      // Dừng lượt: lõi huỷ việc phụ đang chạy VÀ giết mọi lệnh nền của cuộc (`agent:cancel` ⇒ dungLenhNenCua).
      for (const a of S.agentPhu) if (a.trangThai === 'dang') ketThuc(a, 'dung', bayGio);
      for (const x of S.lenhNen) if (x.dangChay) { x.dangChay = false; x.ketThuc = bayGio; x.trangThai = L('đã dừng', 'stopped'); }
      S.agentPhu = [...S.agentPhu];
      S.lenhNen = [...S.lenhNen];
      return false;
    default:
      return false;
  }
}

/** Lượt kết thúc (xong/lỗi) mà agent phụ vẫn "đang" — lõi không báo kết thúc ⇒ đóng lại cho khỏi treo. */
export function dongAgentTreo(S: TrangThaiPhu, bayGio = Date.now()): void {
  let doi = false;
  for (const a of S.agentPhu) if (a.trangThai === 'dang') { ketThuc(a, 'dung', bayGio); doi = true; }
  if (doi) S.agentPhu = [...S.agentPhu];
}

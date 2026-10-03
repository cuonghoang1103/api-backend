/**
 * ============================================================
 * LỆNH `/` CẦN MÁY CHỦ HOẶC MÁY — `/compact` và `/doctor` (03/10/2026)
 * ============================================================
 *
 * Tách khỏi `ipc/agent.ts` để kiểm được bằng `fetch` giả: hai lệnh này nói
 * chuyện với mạng và đĩa, và chỗ dễ sai nhất của chúng là ĐỌC SAI phản hồi
 * (một trường đổi tên, một mã lỗi lạ) — thứ chỉ phép kiểm có dữ liệu mới bắt.
 */
import { goAnhCu, noiDungTomTat, type TinGui, type TomTatCompact } from './thanGui';

type Fetch = typeof fetch;

// ─── /compact ────────────────────────────────────────────────

export type KetQuaCompactApp =
  | { ok: true; soTinDaGop: 0 }
  | { ok: true; soTinDaGop: number; soLuotDaGop: number; tomTat: TomTatCompact; xemTruoc: string }
  | { ok: false; loi: string; ma?: string };

/**
 * Gửi hội thoại lên `POST /api/v1/agent/compact`, dựng bản tóm tắt để gắn
 * vào cuộc. Ảnh gỡ SẠCH trước khi gửi — bản tóm tắt chỉ cần biết "có ảnh", và
 * gửi ảnh lên chỉ để bị đổi thành `[ảnh]` là lặp lại đúng lỗi 413.
 */
export async function goiCompact(o: {
  origin: string;
  token: string;
  hoiThoai: readonly TinGui[];
  ghiChu?: string;
  giuLuot?: number;
  fetchFn?: Fetch;
  bayGio?: () => number;
}): Promise<KetQuaCompactApp> {
  const f = o.fetchFn ?? fetch;
  if (o.hoiThoai.length === 0) return { ok: false, loi: 'Việc này chưa có gì để tóm tắt.', ma: 'TRONG' };
  let res: Response;
  try {
    res = await f(`${o.origin}/api/v1/agent/compact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${o.token}` },
      signal: AbortSignal.timeout(90_000),
      body: JSON.stringify({
        messages: goAnhCu(o.hoiThoai, 0).messages,
        ...(o.ghiChu?.trim() ? { ghiChu: o.ghiChu.trim().slice(0, 500) } : {}),
        ...(o.giuLuot ? { giuLuot: o.giuLuot } : {}),
      }),
    });
  } catch (e) {
    return { ok: false, loi: `Không gọi được máy chủ: ${(e as Error).message}`, ma: 'MANG' };
  }
  const j = await res.json().catch(() => ({})) as {
    message?: string; code?: string;
    data?: { tomTat?: string | null; deBai?: string | null; soTinDaGop?: number; soLuotDaGop?: number };
  };
  if (res.status === 404) {
    return { ok: false, loi: 'Máy chủ chưa có lệnh /compact (bản máy chủ cũ) — cần deploy backend mới.', ma: '404' };
  }
  if (!res.ok) return { ok: false, loi: j.message ?? `Máy chủ trả về ${res.status}.`, ma: j.code ?? String(res.status) };
  const d = j.data ?? {};
  const so = typeof d.soTinDaGop === 'number' ? d.soTinDaGop : 0;
  if (so <= 0 || !d.tomTat) return { ok: true, soTinDaGop: 0 };
  /* Máy chủ đếm trên bản ĐÃ chuẩn hoá — phải khớp số tin của app. Lệch (máy
     chủ bỏ một tin sai hình dạng) thì không ghép được an toàn. */
  if (so > o.hoiThoai.length || o.hoiThoai[so]?.role !== 'user') {
    return { ok: false, loi: 'Bản tóm tắt không khớp hội thoại hiện tại — đã bỏ, hội thoại giữ nguyên.', ma: 'LECH' };
  }
  const soLuot = typeof d.soLuotDaGop === 'number' ? d.soLuotDaGop : 0;
  return {
    ok: true,
    soTinDaGop: so,
    soLuotDaGop: soLuot,
    tomTat: { soTinDaGop: so, noiDung: noiDungTomTat(d.deBai ?? null, d.tomTat, soLuot), luc: (o.bayGio ?? Date.now)() },
    xemTruoc: d.tomTat.slice(0, 1200),
  };
}

// ─── /doctor ─────────────────────────────────────────────────

export type MucDo = 'ok' | 'canh' | 'loi';
export interface MucChanDoan { ten: string; muc: MucDo; chiTiet: string }

export interface PhuThuocChanDoan {
  origin: string;
  token: string | null;
  phienBan: string;
  nenTang: string;
  goc: string | null;
  fetchFn?: Fetch;
  matMang: () => Promise<boolean>;
  /** Model AI ngoại tuyến cho AI Code; `null` = chưa cài. */
  aiCucBo: () => Promise<{ ma: string | null; ten?: string; vi?: string } | null>;
  aiCucBoBat: boolean;
  /** Đọc/ghi được thư mục dự án không. */
  quyenThuMuc: (goc: string) => Promise<{ doc: boolean; ghi: boolean }>;
  dongHo?: () => number;
}

/**
 * Chẩn đoán một lượt: mạng, máy chủ, đăng nhập, cổng (chính/dự phòng), AI
 * ngoại tuyến, quyền thư mục, phiên bản. KHÔNG BAO GIỜ ném — mỗi mục tự bắt
 * lỗi của nó, vì đây là lệnh người ta gõ ĐÚNG LÚC có gì đó đang hỏng.
 */
export async function chanDoan(p: PhuThuocChanDoan): Promise<MucChanDoan[]> {
  const f = p.fetchFn ?? fetch;
  const now = p.dongHo ?? Date.now;
  const ra: MucChanDoan[] = [{ ten: 'Phiên bản app', muc: 'ok', chiTiet: `${p.phienBan} · ${p.nenTang}` }];

  const mat = await p.matMang().catch(() => true);
  ra.push(mat
    ? { ten: 'Mạng', muc: 'loi', chiTiet: 'Không với tới máy chủ — đang mất mạng hoặc tường lửa chặn.' }
    : { ten: 'Mạng', muc: 'ok', chiTiet: 'Có mạng.' });

  if (!p.token) {
    ra.push({ ten: 'Đăng nhập', muc: 'loi', chiTiet: 'Chưa đăng nhập — AI Code cần tài khoản.' });
  } else {
    const t0 = now();
    try {
      const r = await f(`${p.origin}/api/v1/agent/tools`, {
        headers: { Authorization: `Bearer ${p.token}` }, signal: AbortSignal.timeout(8000),
      });
      const ms = now() - t0;
      if (r.status === 401) {
        ra.push({ ten: 'Máy chủ', muc: 'ok', chiTiet: `Trả lời sau ${ms}ms.` });
        ra.push({ ten: 'Đăng nhập', muc: 'loi', chiTiet: 'Phiên đăng nhập đã hết hạn — đăng xuất rồi đăng nhập lại.' });
      } else if (!r.ok) {
        ra.push({ ten: 'Máy chủ', muc: 'loi', chiTiet: `Trả ${r.status} sau ${ms}ms.` });
      } else {
        const j = await r.json().catch(() => ({})) as { data?: { pro?: boolean; configured?: boolean; model?: string } };
        ra.push({ ten: 'Máy chủ', muc: ms > 3000 ? 'canh' : 'ok', chiTiet: `Trả lời sau ${ms}ms${ms > 3000 ? ' — chậm' : ''}.` });
        ra.push({ ten: 'Đăng nhập', muc: j.data?.pro ? 'ok' : 'canh', chiTiet: j.data?.pro ? 'Tài khoản Pro.' : 'Đã đăng nhập nhưng chưa có Pro — AI Code cần Pro.' });
        ra.push({ ten: 'AI máy chủ', muc: j.data?.configured ? 'ok' : 'loi', chiTiet: j.data?.configured ? `Đã cấu hình (${j.data.model ?? '—'}).` : 'Máy chủ chưa cắm khoá AI.' });
      }
    } catch (e) {
      ra.push({ ten: 'Máy chủ', muc: 'loi', chiTiet: `Không gọi được: ${(e as Error).message.slice(0, 80)}` });
    }
    try {
      const r = await f(`${p.origin}/api/v1/agent/du-phong?kiem=1`, {
        headers: { Authorization: `Bearer ${p.token}` }, signal: AbortSignal.timeout(25_000),
      });
      if (r.ok) {
        const j = await r.json().catch(() => ({})) as { data?: { congChinhSong?: boolean; daBat?: boolean; ten?: string } };
        const song = j.data?.congChinhSong;
        ra.push({
          ten: 'Cổng AI',
          muc: song === false ? 'canh' : 'ok',
          chiTiet: song === false
            ? `Cổng chính đang hỏng${j.data?.daBat ? ` — có cổng dự phòng (${j.data.ten ?? 'modelapi'}), gõ /model để mở.` : '.'}`
            : 'Cổng chính hoạt động.',
        });
      }
    } catch { /* máy chủ cũ không có route này — bỏ qua mục đó */ }
  }

  try {
    const cb = await p.aiCucBo();
    ra.push(cb?.ma
      ? { ten: 'AI ngoại tuyến', muc: p.aiCucBoBat ? 'ok' : 'canh', chiTiet: `${cb.ten ?? cb.ma}${p.aiCucBoBat ? '' : ' — đang TẮT trong Cài đặt'}.` }
      : { ten: 'AI ngoại tuyến', muc: 'canh', chiTiet: cb?.vi || 'Chưa cài — mất mạng thì AI Code dừng.' });
  } catch {
    ra.push({ ten: 'AI ngoại tuyến', muc: 'canh', chiTiet: 'Không đọc được trạng thái.' });
  }

  if (!p.goc) {
    ra.push({ ten: 'Thư mục dự án', muc: 'canh', chiTiet: 'Tab này chưa mở thư mục nào.' });
  } else {
    const q = await p.quyenThuMuc(p.goc).catch(() => ({ doc: false, ghi: false }));
    ra.push({
      ten: 'Thư mục dự án',
      muc: q.doc && q.ghi ? 'ok' : q.doc ? 'canh' : 'loi',
      chiTiet: `${p.goc} — ${q.doc ? 'đọc được' : 'KHÔNG đọc được'}, ${q.ghi ? 'ghi được' : 'KHÔNG ghi được'}.`,
    });
  }
  return ra;
}

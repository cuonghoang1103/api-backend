/**
 * Phát giọng ElevenLabs trên web (15/11/2026) — backend `/api/v1/giong` (src/routes/giong.routes.ts).
 *
 * Ai được: admin (không trần) + Pro (trần ký tự/ngày ở admin). Không được / lỗi ⇒ trả `false`, nơi gọi lùi về
 * giọng trình duyệt như cũ. Một <audio src="/api/v1/giong/doc?…"> mỗi mẩu ≤ 350 ký tự: trình duyệt PHÁT NGAY khi
 * byte đầu về (không chờ tải xong), mẩu kế được tải trước trong lúc mẩu này đang phát.
 */
export type ViecGiong = 'phong_van' | 'gia_su' | 'ai_chat' | 'ngoai_ngu' | 'khac';

/** Đoán việc theo trang đang mở — chỉ để thống kê + công tắc ở admin. THUẦN. */
export function viecTheoDuongDan(p: string): ViecGiong {
  if (/^\/interview/.test(p)) return 'phong_van';
  if (/^\/chat|^\/ai\b/.test(p)) return 'ai_chat';
  if (/roleplay|tro-chuyen|luyen-noi|gia-su/.test(p)) return 'gia_su';
  if (/^\/language|^\/tech-trends\/(ielts|tieng-anh|on-thi-jpd)|^\/notes/.test(p)) return 'ngoai_ngu';
  return 'khac';
}

/** Chia chữ thành mẩu ≤ `tran` ký tự, cắt ở dấu câu (rồi dấu phẩy, rồi khoảng trắng). THUẦN. */
export function chiaMau(text: string, tran = 350): string[] {
  const cau = (text.replace(/\s+/g, ' ').trim().match(/[^.!?…。！？]+[.!?…。！？]*\s*/g) || [text]).map((s) => s.trim()).filter(Boolean);
  const ra: string[] = [];
  let cur = '';
  const day = (s: string) => {
    if (!s) return;
    if ((cur + ' ' + s).trim().length <= tran) { cur = (cur + ' ' + s).trim(); return; }
    if (cur) ra.push(cur);
    cur = '';
    if (s.length <= tran) { cur = s; return; }
    // câu dài hơn trần: cắt ở dấu phẩy / khoảng trắng gần trần nhất
    let r = s;
    while (r.length > tran) {
      const cat = Math.max(r.lastIndexOf(', ', tran), r.lastIndexOf(' ', tran));
      const i = cat > tran * 0.4 ? cat + 1 : tran;
      ra.push(r.slice(0, i).trim());
      r = r.slice(i).trim();
    }
    cur = r;
  };
  cau.forEach(day);
  if (cur) ra.push(cur);
  return ra;
}

const nhoQuyen = new Map<ViecGiong, { den: number; duoc: boolean }>();

async function duocDung(viec: ViecGiong): Promise<boolean> {
  const n = nhoQuyen.get(viec);
  if (n && n.den > Date.now()) return n.duoc;
  let duoc = false;
  try {
    const r = await fetch(`/api/v1/giong/quyen?viec=${viec}`, { credentials: 'same-origin' });
    if (r.ok) duoc = !!(await r.json())?.data?.duoc;
  } catch { /* mạng hỏng ⇒ giọng trình duyệt */ }
  nhoQuyen.set(viec, { den: Date.now() + (duoc ? 5 : 2) * 60_000, duoc });
  return duoc;
}

/** Bị từ chối giữa chừng (hết trần ngày…) ⇒ quên quyền để lần sau hỏi lại, khỏi thử mãi. */
function quenQuyen(): void { nhoQuyen.clear(); }

let dangPhat: HTMLAudioElement | null = null;
let luot = 0;

export function dangPhatEl(): boolean {
  return !!dangPhat && !dangPhat.paused && !dangPhat.ended;
}

export function dungEl(): void {
  luot += 1;
  if (dangPhat) { try { dangPhat.pause(); dangPhat.src = ''; } catch { /* */ } }
  dangPhat = null;
}

/**
 * Đọc `text` bằng ElevenLabs. Trả `false` NGAY nếu không được dùng / mẩu đầu hỏng (nơi gọi lùi giọng trình duyệt);
 * `true` nếu đã bắt đầu phát — `onXong` gọi khi đọc hết (hoặc bị dừng / hỏng giữa chừng).
 */
export async function phatEl(
  text: string,
  o: { lang?: string; viec?: ViecGiong; onXong?: () => void } = {},
): Promise<boolean> {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return false;
  const viec = o.viec ?? viecTheoDuongDan(window.location.pathname);
  dungEl();
  const toi = luot;
  if (!(await duocDung(viec)) || toi !== luot) return false;
  const mau = chiaMau(text);
  if (!mau.length) return false;
  const src = (s: string) =>
    `/api/v1/giong/doc?viec=${viec}&lang=${encodeURIComponent(o.lang ?? '')}&text=${encodeURIComponent(s)}`;
  const tao = (s: string) => { const a = new Audio(); a.preload = 'auto'; a.src = src(s); return a; };

  return new Promise<boolean>((resolve) => {
    let batDau = false;
    let ke: HTMLAudioElement | null = null;
    const xong = () => { if (toi === luot) dangPhat = null; o.onXong?.(); };
    const phat = (i: number, a: HTMLAudioElement) => {
      if (toi !== luot) return;
      dangPhat = a;
      ke = i + 1 < mau.length ? tao(mau[i + 1]) : null; // tải trước mẩu kế
      a.onended = () => { if (toi !== luot) return; if (ke) phat(i + 1, ke); else xong(); };
      a.onerror = () => {
        if (toi !== luot) return;
        quenQuyen();
        if (!batDau) { dangPhat = null; resolve(false); } else xong();
      };
      a.play().then(() => { if (!batDau) { batDau = true; resolve(true); } }).catch(() => {
        if (!batDau) { dangPhat = null; resolve(false); } else xong();
      });
    };
    phat(0, tao(mau[0]));
  });
}

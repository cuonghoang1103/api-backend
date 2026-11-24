'use client';

/**
 * CT Language trên web — đồng bộ SỔ TỪ với tài khoản (24/11/2026). Một bản cho cả trang (module), mọi trang CT Language
 * (Học từ vựng, Podcast, Sổ chuyên ngành) đọc chung qua `useSoTu()`.
 *
 * Kéo: `GET /ctlanguage/so-tu?tu=<mốc>` tới khi hết `conNua` (lần đầu từ 0, sau đó chỉ phần đổi).
 * Đẩy: `POST /ctlanguage/so-tu { muc }` ≤ 500 bản ghi/lần. Bản ghi chưa đẩy được (mất mạng, 429) nằm trong hàng chờ ở
 * localStorage theo tài khoản, lần sau đẩy tiếp. Áp NGAY vào gương để giao diện phản hồi tức thì; sau khi đẩy thì kéo lại
 * phần đổi để có bản máy chủ đã chọn (bản mới hơn thắng). Khách (chưa đăng nhập): không có gương, các trang tự lưu trên
 * trình duyệt. Luật bản ghi: `soTu.ts`.
 */
import { useEffect, useSyncExternalStore } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  LO_DAY, apKeo, banGhiNgay, banGhiSo, banGhiThe, chamThe, guongRong, khoaNgay, nguonSoHtv, soTheoNguon, themVaoSo, uuidSo,
  type BanGhiSoTu, type ChamOn, type GuongSoTu, type MucTuCTL, type NnCTL, type TheTuCTL,
} from './soTu';

export type TrangSoTu = 'khach' | 'dangTai' | 'san' | 'loi';
interface TrangThaiSoTu { trang: TrangSoTu; userId: number | null; guong: GuongSoTu; loi: string | null; cho: number }

let st: TrangThaiSoTu = { trang: 'khach', userId: null, guong: guongRong(), loi: null, cho: 0 };
const subs = new Set<() => void>();
const doi = (moi: Partial<TrangThaiSoTu>) => { st = { ...st, ...moi }; subs.forEach((f) => f()); };
let dangKeo: Promise<void> | null = null;
let keoLuc = 0;

const khoaCho = (uid: number) => `ctl:so-tu:cho:${uid}`;
function docCho(uid: number): BanGhiSoTu[] {
  try { const v = JSON.parse(localStorage.getItem(khoaCho(uid)) ?? '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function ghiCho(uid: number, ds: BanGhiSoTu[]) {
  try { if (ds.length) localStorage.setItem(khoaCho(uid), JSON.stringify(ds)); else localStorage.removeItem(khoaCho(uid)); } catch { /* đầy / riêng tư */ }
  doi({ cho: ds.length });
}
/** Gộp hàng chờ: cùng (loai, khoa) giữ bản mới nhất. */
function gopCho(cu: BanGhiSoTu[], moi: BanGhiSoTu[]): BanGhiSoTu[] {
  const m = new Map<string, BanGhiSoTu>();
  for (const r of [...cu, ...moi]) {
    const k = `${r.loai}|${r.khoa}`;
    const c = m.get(k);
    if (!c || Date.parse(r.capNhat) >= Date.parse(c.capNhat)) m.set(k, r);
  }
  return [...m.values()].sort((a, b) => Date.parse(a.capNhat) - Date.parse(b.capNhat));
}

async function keoTu(moc: string): Promise<{ ds: BanGhiSoTu[]; moc: string }> {
  const ds: BanGhiSoTu[] = [];
  let m = moc;
  for (let i = 0; i < 30; i++) {
    const r = await api.get('/ctlanguage/so-tu', { params: { tu: m } });
    const d = r.data?.data as { muc: BanGhiSoTu[]; moc: string; conNua: boolean };
    ds.push(...(d?.muc ?? []));
    m = d?.moc ?? m;
    if (!d?.conNua) break;
  }
  return { ds, moc: m };
}

async function dayCho(uid: number) {
  for (let i = 0; i < 50; i++) {
    const cho = docCho(uid);
    if (!cho.length || st.userId !== uid) return;
    const lo = cho.slice(0, LO_DAY);
    await api.post('/ctlanguage/so-tu', { muc: lo });
    // Bỏ khỏi hàng chờ đúng những bản đã gửi (bản sửa mới hơn chen vào trong lúc gửi thì giữ lại).
    const daGui = new Set(lo.map((r) => `${r.loai}|${r.khoa}|${r.capNhat}`));
    ghiCho(uid, docCho(uid).filter((r) => !daGui.has(`${r.loai}|${r.khoa}|${r.capNhat}`)));
  }
}

/** Nạp / làm mới gương của tài khoản. `ep` = kéo ngay cả khi vừa kéo (< 20 giây). */
export function napSoTu(userId: number | null, ep = false): Promise<void> {
  if (!userId) {
    if (st.userId !== null || st.trang !== 'khach') doi({ trang: 'khach', userId: null, guong: guongRong(), loi: null, cho: 0 });
    return Promise.resolve();
  }
  if (st.userId !== userId) {
    doi({ trang: 'dangTai', userId, guong: guongRong(), loi: null, cho: docCho(userId).length });
    keoLuc = 0;
  }
  if (dangKeo) return dangKeo;
  if (!ep && st.trang === 'san' && Date.now() - keoLuc < 20_000) return Promise.resolve();
  const uid = userId;
  dangKeo = (async () => {
    try {
      // Hàng chờ cũ (lần trước mất mạng) ⇒ đẩy trước, rồi mới kéo (để bản kéo về đã gồm thay đổi của mình).
      try { await dayCho(uid); } catch { /* đẩy lỗi ⇒ vẫn kéo, hàng chờ giữ nguyên */ }
      const { ds, moc } = await keoTu(st.guong.moc);
      if (st.userId !== uid) return;
      // Hàng chờ còn sót (chưa đẩy được) vẫn áp lên để giao diện không "mất" thay đổi vừa làm.
      const g = apKeo(apKeo(st.guong, ds, moc), docCho(uid));
      keoLuc = Date.now();
      doi({ trang: 'san', guong: g, loi: null });
    } catch (e) {
      if (st.userId !== uid) return;
      const ma = (e as { response?: { status?: number } })?.response?.status;
      doi({ trang: st.trang === 'san' ? 'san' : 'loi', loi: ma === 401 ? 'Phiên đăng nhập đã hết — đăng nhập lại để đồng bộ.' : 'Chưa đồng bộ được sổ từ (mạng?). Thay đổi vẫn được giữ, sẽ gửi lại sau.' });
    } finally {
      dangKeo = null;
    }
  })();
  return dangKeo;
}

/** Ghi một lô bản ghi: áp ngay + vào hàng chờ + đẩy (không chặn giao diện). Khách ⇒ bỏ qua. */
export function ghiSoTu(ds: BanGhiSoTu[]) {
  const uid = st.userId;
  if (!uid || !ds.length) return;
  doi({ guong: apKeo(st.guong, ds) });
  ghiCho(uid, gopCho(docCho(uid), ds));
  void (async () => {
    try {
      await dayCho(uid);
      await napSoTu(uid, true);
    } catch {
      doi({ loi: 'Chưa gửi được lên tài khoản (mạng?). Thay đổi được giữ trên trình duyệt, sẽ gửi lại sau.' });
    }
  })();
}

// ─── Thao tác cấp cao (đúng như app) ──────────────────────────────────────────────────────────────────────────────

/** Sổ theo nguồn — chưa có thì tạo (bản ghi `so`). Trả id + bản ghi cần đẩy. */
function soTheoNguonHoacTao(nn: NnCTL, nguon: string, ten: string, luc: Date): { id: string; banGhi: BanGhiSoTu[] } {
  const co = soTheoNguon(st.guong, nn, nguon).sort((a, b) => a.taoLuc.localeCompare(b.taoLuc))[0];
  if (co) return { id: co.id, banGhi: [] };
  const s = { id: uuidSo(), ten, nn, taoLuc: new Date(luc).toISOString(), nguon };
  return { id: s.id, banGhi: [banGhiSo(s, luc)] };
}

/**
 * Từ vừa HỌC XONG (đúng ≥ 2 dạng) hoặc "Đã biết" ⇒ thêm vào sổ "Học từ vựng" của ngôn ngữ (ôn lặp — app làm y như vậy khi
 * bật "tự thêm vào ôn lặp") + đánh dấu hôm nay đã học. "Đã biết" ⇒ thẻ nhớ sâu (30 ngày) để máy khác tính là đã thuộc.
 * Trả `chan` = chạm giới hạn 200 thẻ của bản miễn phí (tiến độ vẫn lưu trên trình duyệt).
 */
export function ghiHocXong(nn: NnCTL, ds: MucTuCTL[], opt: { laPro: boolean; daBiet?: boolean }): { chan: boolean } {
  if (!st.userId || st.trang !== 'san' || !ds.length) return { chan: false };
  const luc = new Date();
  const so = soTheoNguonHoacTao(nn, nguonSoHtv(nn), 'Học từ vựng', luc);
  const g = apKeo(st.guong, so.banGhi);
  const sua = opt.daBiet
    ? (t: TheTuCTL): TheTuCTL => ({ ...t, khoangNgay: 30, lanDung: 3, denHan: new Date(luc.getTime() + 30 * 86_400_000).toISOString() })
    : undefined;
  const kq = themVaoSo(g, ds, nn, so.id, { laPro: opt.laPro, bayGio: luc, sua });
  ghiSoTu([...so.banGhi, ...kq.banGhi, banGhiNgay(luc)]);
  return { chan: kq.chan };
}

/** Lưu một / nhiều từ vào sổ (null = chỉ "Tất cả từ đã lưu"). `nguonSo` + `tenSo` ⇒ sổ theo nguồn (tạo nếu chưa có). */
export function luuTu(nn: NnCTL, ds: MucTuCTL[], opt: { laPro: boolean; soId?: string | null; nguonSo?: string; tenSo?: string }): { moi: number; chan: boolean } {
  if (!st.userId || st.trang !== 'san' || !ds.length) return { moi: 0, chan: false };
  const luc = new Date();
  let soId = opt.soId ?? null;
  let them: BanGhiSoTu[] = [];
  if (opt.nguonSo) {
    const so = soTheoNguonHoacTao(nn, opt.nguonSo, opt.tenSo ?? 'Sổ mới', luc);
    soId = so.id;
    them = so.banGhi;
  }
  const kq = themVaoSo(apKeo(st.guong, them), ds, nn, soId, { laPro: opt.laPro, bayGio: luc });
  ghiSoTu([...them, ...kq.banGhi]);
  return { moi: kq.moi, chan: kq.chan };
}

/** Chấm một thẻ ôn lặp (Quên · Khó · Nhớ · Dễ) + đánh dấu hôm nay. */
export function chamOnThe(t: TheTuCTL, c: ChamOn) {
  const luc = new Date();
  ghiSoTu([banGhiThe(chamThe(t, c, luc), luc), banGhiNgay(luc)]);
}

/** Chấm NHIỀU thẻ trong một lô (kiểm tra đợt 4 ngày: đúng ⇒ "Dễ", sai ⇒ "Quên") — một lần đẩy thay vì mỗi thẻ một lần. */
export function chamNhieuThe(ds: readonly { t: TheTuCTL; c: ChamOn }[]) {
  if (!ds.length) return;
  const luc = new Date();
  ghiSoTu([...ds.map(({ t, c }) => banGhiThe(chamThe(t, c, luc), luc)), banGhiNgay(luc)]);
}

export function danhDauHomNay() {
  if (!st.userId || st.guong.ngay.has(khoaNgay(new Date()))) return;
  ghiSoTu([banGhiNgay(new Date())]);
}

// ─── React ────────────────────────────────────────────────────────────────────────────────────────────────────────

const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
const lay = () => st;
const KHACH: TrangThaiSoTu = { trang: 'khach', userId: null, guong: guongRong(), loi: null, cho: 0 };

/** Gương sổ từ của tài khoản đang đăng nhập (tự nạp khi trang mở / đổi tài khoản / quay lại tab). */
export function useSoTu() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const uid = isAuthenticated && user?.id ? Number(user.id) : null;
  const v = useSyncExternalStore(sub, lay, () => KHACH);
  useEffect(() => {
    void napSoTu(uid);
    const lai = () => { if (document.visibilityState === 'visible') void napSoTu(uid); };
    document.addEventListener('visibilitychange', lai);
    return () => document.removeEventListener('visibilitychange', lai);
  }, [uid]);
  return { ...v, dangNhap: !!uid, lamMoi: () => napSoTu(uid, true) };
}

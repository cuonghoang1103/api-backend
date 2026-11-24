'use client';

/**
 * Học từ vựng — bản web của màn "Học từ vựng" trong app CT Language (`Modules/HocTuVung/HocTuVungCTL.swift`), 24/11/2026.
 * Từ trên xuống: thẻ HÔM NAY (x/N từ mới + "Học tiếp" bài kế + "Ôn n thẻ đến hạn") · thống kê (đã học, đã thuộc, đang ôn,
 * chuỗi ngày; học lại / ôn đã thuộc / chỉ từ khó) · chọn lộ trình (en: IELTS 0 → 8.0 = Ngày 1 → 440, 20 từ/ngày · theo chủ
 * đề, gồm các nhóm "Chuyên ngành · môn") · danh sách nhóm / bài có tiến độ.
 * Dùng CHUNG với app theo tài khoản: từ đã học ⇒ thẻ trong sổ "Học từ vựng" (ôn lặp + máy kia thấy "đã học"), chuỗi ngày,
 * lịch ôn. Chỉ ở trình duyệt: mục tiêu/ngày, "đã biết / khó / số lần đúng", bài gần nhất (app cũng giữ trên máy).
 * `?nhom=<mã>` mở thẳng một nhóm (lộ trình theo chủ đề) · `?bai=<id>` mở thẳng một bài.
 * Bù cho bằng app (24/11/2026): thẻ "Đợt kiểm tra đến hạn" (đợt 4 ngày — app báo bằng thông báo đẩy, web hiện ở đây) ·
 * câu ngữ pháp chèn trong phiên học (trường `nguPhap` của lộ trình) · "Từ của tôi" (lọc, ôn lại, đánh dấu) · nói theo + chấm
 * phát âm trên thẻ từ.
 */
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  AlertTriangle, ArrowRight, BadgeCheck, Bookmark, BookOpenText, CalendarClock, ChevronDown, Clock3, Flame, FastForward, GraduationCap,
  LayoutGrid, Loader2, Play, RefreshCw, Repeat, Search, Settings2, TrendingUp,
} from 'lucide-react';
import { KhungCTL, TEN_NN, Vong, capCss, css as s, useBao } from '@/components/language/ctl/chung';
import { PhienHoc, type CheDoPhien } from '@/components/language/ctl/PhienHoc';
import { OnThe } from '@/components/language/ctl/OnThe';
import { TuCuaToi, type MucTuCuaToi } from '@/components/language/ctl/TuCuaToi';
import { apiHocTuVung, loiMang, nnTuCode, type BaiHtv, type LoTrinhHtv, type NguPhapGoiY, type TheoHtv, type TomTatBaiHtv } from '@/lib/ctlanguage/api';
import { useSoTu } from '@/lib/ctlanguage/dongBo';
import {
  MUC_TIEU_CHON, SO_NGAY_DOT, daGapTu, doiDot, donDotRong, dotDenHan, dotSapToi, moiHomNay, thuocTu, tienDoBai, tuCua, tuCuaDot,
  type DotOn, type KhoHtv, type TuHoc,
} from '@/lib/ctlanguage/hocTuVung';
import { khoHtv } from '@/lib/ctlanguage/khoTrinhDuyet';
import { denHan, khoaNgay, nguonSoHtv, soNgayLienTiep, soTheoNguon, theHtvTheoKhoa, theTrongSo, type NnCTL } from '@/lib/ctlanguage/soTu';

const DEM_LT = new Map<string, LoTrinhHtv>();
const CAP: Record<NnCTL, string[]> = { en: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], ja: ['N5', 'N4', 'N3', 'N2', 'N1'], zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] };

function tenLoTrinh(l: TheoHtv, nn: NnCTL, soNgay?: number) {
  if (l === 'chu-de') return { ten: 'Theo chủ đề', moTa: nn === 'en' ? 'Giao tiếp theo tình huống + từ chuyên ngành từng môn' : 'Giao tiếp theo tình huống đời thường' };
  if (nn === 'en') return { ten: 'Lộ trình IELTS 0 → 8.0', moTa: soNgay ? `Ngày 1 → ${soNgay} · 20 từ/ngày · A1 → C2` : 'A1 → C2 · từ sống còn tới học thuật' };
  return nn === 'zh' ? { ten: 'Theo cấp HSK', moTa: 'HSK 1 → 6 · dễ tới khó' } : { ten: 'Theo cấp JLPT', moTa: 'N5 → N1 · dễ tới khó' };
}

type Mo = {
  loai: 'phien'; ten: string; baiId: string | null; tu: TuHoc[]; cheDo: CheDoPhien;
  nguPhap?: NguPhapGoiY | null; cap?: string | null; dotId?: string | null;
} | { loai: 'on' } | { loai: 'tuCuaToi' } | null;

const ngayNgan = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
const tuHocCua = (t: KhoHtv['tu'][string]): TuHoc => ({ k: t.k, id: t.id0 ?? -1, chu: t.chu, doc: t.doc, nghia: t.nghia, cap: t.cap, viDu: t.viDu, viDuNghia: t.viDuNghia });

/** Thẻ "Bạn còn nhớ các từ 4 ngày qua đã học không?" (app `TheDotOnHTV`) — web không có thông báo đẩy nên đây là lời nhắc. */
function TheDotOn({ d, kho, kiemTra, doi }: { d: DotOn; kho: KhoHtv; kiemTra: () => void; doi: () => void }) {
  const ds = tuCuaDot(kho, d);
  const b = new Date(d.batDau);
  const cuoi = new Date(b.getFullYear(), b.getMonth(), b.getDate() + SO_NGAY_DOT - 1);
  return (
    <div className={`${s.card} ${s.cardPad}`} style={{ marginBottom: 12, borderColor: 'color-mix(in srgb, #7c3aed 45%, var(--lh-line))', background: 'color-mix(in srgb, #7c3aed 6%, var(--lh-surface))' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 40, lineHeight: 1 }} aria-hidden>🐻</div>
        <div className={s.minh}>
          <div className={s.dangLabel} style={{ color: '#7c3aed' }}>Đợt kiểm tra đến hạn · ôn sau 4 ngày</div>
          <div className={s.h3} style={{ fontSize: 18, marginTop: 2 }}>Bạn còn nhớ các từ 4 ngày qua đã học không?</div>
          <div className={s.note}>{ds.length} từ học {ngayNgan(b)} – {ngayNgan(cuoi)}{d.soLanDoi ? ` · đã dời ${d.soLanDoi} lần` : ''}</div>
        </div>
      </div>
      <div className={s.chips} style={{ marginTop: 12, gap: 6 }}>
        {ds.slice(0, 8).map((t) => <span key={t.k} className={`${s.chip} ${s.chipNho}`}>{t.chu}</span>)}
        {ds.length > 8 ? <span className={s.note} style={{ alignSelf: 'center' }}>+{ds.length - 8}</span> : null}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <button type="button" className={`${s.btn} ${s.btnLon}`} style={{ flex: '1 1 200px', background: '#7c3aed', color: '#fff' }} onClick={kiemTra}>
          <BadgeCheck size={18} /> Kiểm tra
        </button>
        <button type="button" className={`${s.btn} ${s.btnPhu}`} style={{ flex: '1 1 120px' }} onClick={doi}><Clock3 size={15} /> Chưa</button>
        <button type="button" className={`${s.btn} ${s.btnPhu}`} style={{ flex: '1 1 120px' }} onClick={doi}><FastForward size={15} /> Bỏ qua</button>
      </div>
      <p className={s.note} style={{ marginTop: 8, fontSize: 12.5 }}>Chưa / Bỏ qua ⇒ Gấu hỏi lại vào ngày mai. Đúng ⇒ từ thành đã thuộc; sai ⇒ vào ôn lặp.</p>
    </div>
  );
}

export default function HocTuVungPage() {
  const code = String(useParams().code);
  const nn = nnTuCode(code);
  const kho = khoHtv.useGiaTri();
  const so = useSoTu();
  const { hien, nut: bao } = useBao();
  const [lt, setLt] = useState<LoTrinhHtv | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [mo, setMo] = useState<Set<string>>(new Set());
  const [dangMo, setDangMo] = useState<string | null>(null);
  const [phien, setPhien] = useState<Mo>(null);
  const [caiDat, setCaiDat] = useState(false);
  const [loc, setLoc] = useState<'tat-ca' | 'chu-de' | 'chuyen-nganh'>('tat-ca');
  const [tim, setTim] = useState('');
  const [bayGio, setBayGio] = useState(() => new Date());
  const [daDoi, setDaDoi] = useState<string | null>(null);

  // Đồng hồ phút: đợt tới hạn lúc 9:00 thì thẻ tự hiện dù trang mở từ trước. Mở trang ⇒ đóng các đợt rỗng đã hết 4 ngày.
  useEffect(() => {
    const k = khoHtv.lay(), k2 = donDotRong(k);
    if (k2 !== k) khoHtv.dat(() => k2);
    const t = setInterval(() => setBayGio(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const loai: TheoHtv = (nn && kho.caiDat.loTrinh[nn]) || 'cap';
  const datLoai = (l: TheoHtv) => { if (!nn) return; khoHtv.dat((k) => ({ ...k, caiDat: { ...k.caiDat, loTrinh: { ...k.caiDat.loTrinh, [nn]: l } } })); setMo(new Set()); };

  // ?nhom= / ?bai= (từ Sổ chuyên ngành, hub…). Đọc trong effect: khi điều hướng phía client, Next đổi URL SAU lần vẽ đầu.
  useEffect(() => {
    const thamSo = new URLSearchParams(window.location.search);
    const n = thamSo.get('nhom');
    if (n && nn) { if (loai !== 'chu-de') datLoai('chu-de'); setMo(new Set([n])); if (n.startsWith('cn-')) setLoc('chuyen-nganh'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!nn) return;
    const k = `${nn}|${loai}`;
    const co = DEM_LT.get(k);
    setLt(co ?? null);
    setLoi(null);
    if (co) return;
    let song = true;
    apiHocTuVung.loTrinh(nn, loai).then((d) => { DEM_LT.set(k, d); if (song) setLt(d); }).catch((e) => song && setLoi(loiMang(e)));
    return () => { song = false; };
  }, [nn, loai]);

  // Thẻ sổ "Học từ vựng" của tài khoản (học trên điện thoại cũng hiện ở đây).
  const theHtv = useMemo(() => (nn ? theHtvTheoKhoa(so.guong, nn) : new Map()), [so.guong, nn]);
  const soHtv = useMemo(() => (nn ? soTheoNguon(so.guong, nn, nguonSoHtv(nn)).map((x) => x.id) : []), [so.guong, nn]);
  const denHanOn = useMemo(() => (nn ? denHan(theTrongSo(so.guong, nn, soHtv), new Date()) : []), [so.guong, nn, soHtv]);

  const gapK = useCallback((k: string) => !!nn && daGapTu(kho, theHtv, nn, k), [kho, theHtv, nn]);
  const tatCaBai = useMemo(() => lt?.nhom.flatMap((n) => n.bai) ?? [], [lt]);
  const baiKe = useMemo(() => {
    const conMoi = (b: TomTatBaiHtv) => (b.k ?? []).some((k) => !gapK(k));
    const g = nn ? kho.ganNhat[`${nn}|${loai}`] : undefined;
    const b = g ? tatCaBai.find((x) => x.id === g) : undefined;
    return b && conMoi(b) ? b : tatCaBai.find(conMoi) ?? null;
  }, [tatCaBai, gapK, kho.ganNhat, nn, loai]);

  // Mở sẵn nhóm chứa bài kế.
  useEffect(() => {
    if (!lt || mo.size || !baiKe) return;
    const n = lt.nhom.find((x) => x.bai.some((b) => b.id === baiKe.id));
    if (n) setMo(new Set([n.ma]));
  }, [lt, baiKe, mo.size]);

  const moBai = useCallback(async (id: string, cheDoEp?: CheDoPhien) => {
    if (!nn || dangMo) return;
    setDangMo(id);
    try {
      const b: BaiHtv = await apiHocTuVung.bai(nn, id);
      khoHtv.dat((k) => ({ ...k, ganNhat: { ...k.ganNhat, [`${nn}|${loai}`]: id } }));
      const conMoi = b.tu.some((w) => !gapK(w.k));
      setPhien({ loai: 'phien', ten: b.ten, baiId: b.id, tu: b.tu, cheDo: cheDoEp ?? (conMoi ? 'hoc' : 'on'), nguPhap: b.nguPhap ?? null, cap: b.cap ?? null });
    } catch (e) { hien(loiMang(e)); } finally { setDangMo(null); }
  }, [nn, dangMo, loai, gapK, hien]);

  useEffect(() => {
    const b = new URLSearchParams(window.location.search).get('bai');
    if (b && nn) void moBai(b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!nn) return <KhungCTL code={code} dangO="hoc-tu-vung" tieuDe="Học từ vựng"><div className={s.trong}>Mục này có cho tiếng Anh, tiếng Nhật và tiếng Trung.</div></KhungCTL>;

  // ── Số liệu ──
  const homNayK = khoaNgay(new Date());
  const tuMay = tuCua(kho, nn);
  const daCoK = new Set(tuMay.map((t) => t.k));
  const tuTaiKhoan = [...theHtv.entries()].filter(([k]) => !daCoK.has(k));
  const x = moiHomNay(kho, nn) + tuTaiKhoan.filter(([, t]) => khoaNgay(new Date(t.themLuc)) === homNayK && t.khoangNgay < 21).length;
  const n = kho.caiDat.mucTieu;
  const tatCaTu: MucTuCuaToi[] = [
    ...tuMay.map((t) => ({
      ...tuHocCua(t), kho: t.kho, thuoc: thuocTu(kho, theHtv, nn, t.k), daBiet: t.trangThai === 'daBiet', coThe: theHtv.has(t.k), hocLuc: t.hocLuc,
    })),
    ...tuTaiKhoan.map(([k, t]) => ({
      k, id: t.muc.id, chu: t.muc.chu, doc: t.muc.doc, nghia: t.muc.nghiaVi || t.muc.nghiaEn || '', thuoc: thuocTu(kho, theHtv, nn, k),
      chiTaiKhoan: true, coThe: true, hocLuc: t.themLuc,
    })),
  ];
  const dotHan = dotDenHan(kho, nn, bayGio);
  const dotKe = dotHan ? null : dotSapToi(kho, nn, bayGio);
  const thuoc = tatCaTu.filter((t) => t.thuoc);
  const dangOn = tatCaTu.filter((t) => !t.thuoc).sort((a, b) => Number(!!b.kho) - Number(!!a.kho));
  const khoDs = tatCaTu.filter((t) => t.kho);
  const tong = Math.max(lt?.tongTu ?? 0, tatCaTu.length);
  const chuoi = so.dangNhap ? soNgayLienTiep(so.guong.ngay, new Date()) : null;
  const capTu = new Map<string, string>();
  for (const b of tatCaBai) for (const k of b.k ?? []) capTu.set(k, b.cap ?? '');
  const theoCap = new Map<string, number>();
  for (const t of thuoc) { const c = t.cap || capTu.get(t.k) || ''; if (c) theoCap.set(c, (theoCap.get(c) ?? 0) + 1); }

  const nhomHien = (lt?.nhom ?? []).filter((g) => {
    if (loai === 'chu-de' && loc === 'chuyen-nganh' && !g.ma.startsWith('cn-')) return false;
    if (loai === 'chu-de' && loc === 'chu-de' && g.ma.startsWith('cn-')) return false;
    const q = tim.trim().toLowerCase();
    return !q || g.ten.toLowerCase().includes(q) || g.bai.some((b) => b.ten.toLowerCase().includes(q) || (b.mau ?? []).some((m) => m.toLowerCase().includes(q)));
  });
  const coCn = loai === 'chu-de' && (lt?.nhom ?? []).some((g) => g.ma.startsWith('cn-'));
  const soNgay = loai === 'cap' ? tatCaBai.filter((b) => /-ngay-\d+$/.test(b.id)).length : 0;
  const L = tenLoTrinh(loai, nn, soNgay);
  const moNhom = (ten: string, ds: TuHoc[]) => { if (ds.length) setPhien({ loai: 'phien', ten, baiId: null, tu: ds.slice(0, 20), cheDo: 'on' }); };

  return (
    <KhungCTL code={code} dangO="hoc-tu-vung" tieuDe={`Học từ vựng · ${TEN_NN[nn]}`}>
      <p className={s.eyebrow}>{TEN_NN[nn]} · {L.ten}</p>
      <h1 className={s.h1}>Học từ vựng</h1>
      <p className={s.lede}>
        Gặp từ mới bằng thẻ có ví dụ và giọng đọc, rồi tự kiểm tra bằng nhiều dạng câu — một từ chỉ tính “đã học” khi bạn đúng ở hai
        dạng khác nhau. Từ đã học tự vào ôn lặp; học trên máy tính hay điện thoại đều tính chung một tiến độ.
      </p>
      {!so.dangNhap ? (
        <div className={s.bao} style={{ marginTop: 14 }}>
          Bạn đang học không đăng nhập — tiến độ chỉ nằm trên trình duyệt này. <Link href="/login">Đăng nhập</Link> để đồng bộ với app CT Language trên điện thoại và dùng ôn lặp.
        </div>
      ) : null}

      {/* ── Hôm nay ── */}
      <div className={s.section}>
        {dotHan ? (
          <TheDotOn d={dotHan} kho={kho} kiemTra={() => {
            setDaDoi(null);
            const ds = tuCuaDot(kho, dotHan).map(tuHocCua);
            setPhien({ loai: 'phien', ten: `${ds.length} từ của 4 ngày qua`, baiId: null, tu: ds, cheDo: 'kiemTraDot', dotId: dotHan.id });
          }} doi={() => { khoHtv.dat((k) => doiDot(k, dotHan.id)); setDaDoi('Đã dời — Gấu hỏi lại vào ngày mai.'); }} />
        ) : daDoi ? (
          <div className={s.bao} style={{ marginBottom: 12 }}><Clock3 size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {daDoi}</div>
        ) : null}
        <div className={s.today}>
          <div className={s.todayRow}>
            <Vong tien={x / Math.max(1, n)}>
              <span className={s.ringSo}>{x}</span>
              <span className={s.ringNho}>/{n} từ</span>
            </Vong>
            <div className={s.minh}>
              <div className={s.todayTag}>Hôm nay</div>
              <div className={s.todayBig}>{x >= n ? 'Đạt mục tiêu! 🎉' : `Còn ${n - x} từ mới nữa`}</div>
              <div className={s.todaySub}>{baiKe ? `Bài kế: ${baiKe.ten}` : lt ? 'Bạn đã học hết lộ trình này' : loi ? 'Kiểm tra mạng rồi thử lại' : 'Đang tải lộ trình…'}</div>
              {dotKe ? (
                <div className={s.todaySub} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CalendarClock size={14} /> Kiểm tra 4 ngày: {tuCuaDot(kho, dotKe).length} từ · {new Date(dotKe.hanHoi).toLocaleString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              ) : null}
            </div>
          </div>
          <div className={s.todayBtns}>
            <button type="button" className={s.todayMain} disabled={!baiKe || !!dangMo} onClick={() => baiKe && moBai(baiKe.id)}>
              {dangMo && dangMo === baiKe?.id ? <Loader2 size={18} className={s.spin} /> : <Play size={17} fill="currentColor" />}
              {!lt ? (loi ? 'Chưa tải được' : 'Đang tải lộ trình…') : !baiKe ? 'Đã học hết' : tatCaTu.length ? 'Học tiếp' : 'Bắt đầu học'}
            </button>
            <button type="button" className={s.todayPhu} disabled={!denHanOn.length} onClick={() => setPhien({ loai: 'on' })}
              title={so.dangNhap ? 'Ôn lặp ngắt quãng — cùng lịch ôn với app' : 'Đăng nhập để ôn lặp theo tài khoản'}>
              <Repeat size={16} /> {!so.dangNhap ? 'Ôn lặp: cần đăng nhập' : denHanOn.length ? `Ôn ${denHanOn.length} thẻ đến hạn` : 'Chưa có thẻ nào đến hạn ôn'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Thống kê ── */}
      <div className={s.section}>
        <div className={s.statGrid}>
          <div className={s.statO} style={{ '--c': '#0ea5e9' } as CSSProperties}><BookOpenText size={17} className={s.statIco} /><div className={s.statSo}>{tatCaTu.length}</div><div className={s.statNhan}>đã học</div></div>
          <div className={s.statO} style={{ '--c': '#16a34a' } as CSSProperties}><BadgeCheck size={17} className={s.statIco} /><div className={s.statSo}>{thuoc.length}</div><div className={s.statNhan}>đã thuộc</div></div>
          <div className={s.statO} style={{ '--c': '#8b5cf6' } as CSSProperties}><RefreshCw size={17} className={s.statIco} /><div className={s.statSo}>{dangOn.length}</div><div className={s.statNhan}>đang ôn</div></div>
          <div className={s.statO} style={{ '--c': '#f97316' } as CSSProperties}><Flame size={17} className={s.statIco} /><div className={s.statSo}>{chuoi ?? '—'}</div><div className={s.statNhan}>ngày liền</div></div>
        </div>
        {tong > 0 ? (
          <div className={`${s.card} ${s.cardPad}`} style={{ marginTop: 10 }}>
            <div className={s.note}><b>{lt ? `Cả lộ trình ${tong.toLocaleString('vi-VN')} từ` : 'Từ của bạn'}</b> · thuộc {thuoc.length} · đang học {dangOn.length}</div>
            <div className={s.doan}>
              <i style={{ width: `${(thuoc.length / tong) * 100}%`, background: '#16a34a' }} />
              <i style={{ width: `${(dangOn.length / tong) * 100}%`, background: '#60a5fa' }} />
            </div>
            <div className={s.chips} style={{ marginTop: 12 }}>
              <button type="button" className={s.chip} disabled={!dangOn.length} onClick={() => moNhom('Học lại từ đã học', dangOn)}><RefreshCw size={14} /> Học lại từ đã học · {dangOn.length}</button>
              <button type="button" className={s.chip} disabled={!thuoc.length} onClick={() => moNhom('Ôn từ đã thuộc', [...thuoc].sort(() => Math.random() - 0.5))}><BadgeCheck size={14} /> Ôn từ đã thuộc · {thuoc.length}</button>
              <button type="button" className={s.chip} disabled={!khoDs.length} onClick={() => moNhom('Chỉ từ khó', khoDs)}><AlertTriangle size={14} /> Chỉ từ khó · {khoDs.length}</button>
              <button type="button" className={s.chip} disabled={!tatCaTu.length} onClick={() => setPhien({ loai: 'tuCuaToi' })}><Bookmark size={14} /> Từ của tôi · {tatCaTu.length}</button>
              <button type="button" className={s.chip} onClick={() => setCaiDat(!caiDat)} data-on={caiDat || undefined}><Settings2 size={14} /> Cài đặt</button>
            </div>
            <div className={s.chips} style={{ marginTop: 10, alignItems: 'center' }}>
              <span className={s.note}>Thuộc theo cấp</span>
              {CAP[nn].map((c) => (
                <span key={c} className={`${s.chip} ${s.chipNho}`} style={theoCap.get(c) ? { ...capCss(c), background: 'linear-gradient(135deg, var(--c1), var(--c2))', color: '#fff', borderColor: 'transparent' } : undefined}>
                  {c.replace('HSK', 'HSK ')} <span className={s.chipSo}>{theoCap.get(c) ?? 0}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {caiDat || tong === 0 ? (
          <div className={`${s.card} ${s.cardPad}`} style={{ marginTop: 10, display: 'grid', gap: 12 }}>
            <div>
              <div className={s.h3}>Mục tiêu từ mới mỗi ngày</div>
              <div className={s.seg} style={{ marginTop: 8 }}>
                {MUC_TIEU_CHON.map((v) => (
                  <button key={v} type="button" className={s.segBtn} data-on={kho.caiDat.mucTieu === v || undefined}
                    onClick={() => khoHtv.dat((k) => ({ ...k, caiDat: { ...k.caiDat, mucTieu: v } }))}>{v} từ</button>
                ))}
              </div>
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
              <input type="checkbox" checked={kho.caiDat.tuDoc} onChange={(e) => khoHtv.dat((k) => ({ ...k, caiDat: { ...k.caiDat, tuDoc: e.target.checked } }))} />
              Tự đọc từ khi hiện thẻ / câu hỏi
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
              <input type="checkbox" checked={kho.caiDat.ghepNguPhap !== false} onChange={(e) => khoHtv.dat((k) => ({ ...k, caiDat: { ...k.caiDat, ghepNguPhap: e.target.checked } }))} />
              Ghép ngữ pháp — mỗi phiên học chèn 2–3 câu về điểm ngữ pháp của bài
            </label>
            <p className={s.note}>Ôn lặp dùng sổ “Học từ vựng” trong Sổ tay — đăng nhập thì đồng bộ theo tài khoản (cùng sổ với app điện thoại). Mục tiêu và từ “đã biết / khó” lưu trên trình duyệt này.</p>
          </div>
        ) : null}
      </div>

      {/* ── Lộ trình ── */}
      <div className={s.section}>
        <div className={s.sectionHead}><h2 className={s.h2}>Lộ trình</h2></div>
        <div className={s.loTrinhGrid}>
          {(['cap', 'chu-de'] as TheoHtv[]).map((l) => {
            const t = tenLoTrinh(l, nn, l === 'cap' ? soNgay || undefined : undefined);
            return (
              <button key={l} type="button" className={s.loTrinh} data-on={l === loai || undefined} onClick={() => l !== loai && datLoai(l)} aria-pressed={l === loai}>
                <span className={s.loIco}>{l === 'cap' ? <TrendingUp size={20} /> : <LayoutGrid size={20} />}</span>
                <span className={s.minh}><span className={s.h3} style={{ display: 'block' }}>{t.ten}</span><span className={s.note}>{t.moTa}</span></span>
              </button>
            );
          })}
        </div>
        {nn === 'ja' ? <p className={s.note} style={{ marginTop: 8 }}>Học từ theo bài giáo trình できる日本語: xem <Link href="/language/ja/dekiru" style={{ color: 'var(--lh-accent)' }}>khoá Dekiru</Link>.</p> : null}
      </div>

      {/* ── Các bài ── */}
      <div className={s.section}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>Các bài · {L.ten}</h2>
          {lt ? <span className={s.note}>{lt.soBai.toLocaleString('vi-VN')} bài · {lt.tongTu.toLocaleString('vi-VN')} từ · mỗi từ chỉ nằm ở một bài</span> : null}
        </div>
        {lt ? (
          <div className={s.chips} style={{ marginBottom: 12, alignItems: 'center' }}>
            {coCn ? (
              <div className={s.seg}>
                {([['tat-ca', 'Tất cả'], ['chu-de', 'Chủ đề'], ['chuyen-nganh', 'Chuyên ngành · môn']] as const).map(([m, t]) => (
                  <button key={m} type="button" className={s.segBtn} data-on={loc === m || undefined} onClick={() => setLoc(m)}>{t}</button>
                ))}
              </div>
            ) : null}
            <label className={s.chip} style={{ flex: '1 1 220px', maxWidth: 360 }}>
              <Search size={14} />
              <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder={loai === 'cap' && nn === 'en' ? 'Tìm ngày, chủ đề, từ…' : 'Tìm nhóm, bài, từ…'}
                style={{ background: 'transparent', outline: 'none', border: 0, flex: 1, minWidth: 0, color: 'var(--lh-ink)' }} aria-label="Tìm bài" />
            </label>
            {loai === 'chu-de' && nn === 'en' ? <Link href={`/language/${code}/so-chuyen-nganh`} className={`${s.chip}`}><GraduationCap size={14} /> Sổ chuyên ngành theo môn <ArrowRight size={13} /></Link> : null}
          </div>
        ) : null}
        {loi && !lt ? <div className={s.loi}>{loi}</div> : null}
        {!lt && !loi ? <div className={s.trong}><Loader2 size={18} className={s.spin} style={{ display: 'inline' }} /> Đang tải lộ trình…</div> : null}
        {nhomHien.map((g) => {
          const td = g.bai.map((b) => tienDoBai(kho, theHtv, nn, b.k ?? []));
          const xong = td.filter((t) => t.tong > 0 && t.gap >= t.tong).length;
          const dangMoNhom = mo.has(g.ma) || (!!tim.trim() && nhomHien.length <= 6);
          return (
            <div key={g.ma} className={s.nhom} id={`nhom-${g.ma}`}>
              <button type="button" className={s.nhomHead} aria-expanded={dangMoNhom}
                onClick={() => { const m = new Set(mo); if (m.has(g.ma)) m.delete(g.ma); else m.add(g.ma); setMo(m); }}>
                <span className={s.loIco} style={xong === g.bai.length && xong ? { background: '#16a34a', color: '#fff' } : undefined}>
                  {xong === g.bai.length && xong ? <BadgeCheck size={20} /> : <BookOpenText size={20} />}
                </span>
                <span className={s.minh}>
                  <span className={s.h3} style={{ display: 'block' }}>{g.ten}</span>
                  {g.moTa ? <span className={`${s.note} ${s.ten2}`}>{g.moTa}</span> : null}
                  <span className={s.note} style={{ display: 'block', color: xong ? 'var(--lh-ok)' : undefined, fontWeight: 600 }}>{xong}/{g.bai.length} bài xong · {g.soTu ?? 0} từ</span>
                  <span className={s.thanh} style={{ display: 'block' }}><i style={{ width: `${g.bai.length ? (xong / g.bai.length) * 100 : 0}%` }} /></span>
                </span>
                <ChevronDown size={18} style={{ transform: dangMoNhom ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s', color: 'var(--lh-ink-3)', flex: 'none' }} />
              </button>
              {dangMoNhom ? (
                <div className={s.nhomBody}>
                  {g.bai.map((b, i) => {
                    const t = td[i]!;
                    const xongB = t.tong > 0 && t.gap >= t.tong;
                    const dangB = t.gap > 0 && !xongB;
                    const pt = t.tong ? Math.round((t.thuoc / t.tong) * 100) : 0;
                    return (
                      <button key={b.id} type="button" className={s.bai} data-ke={b.id === baiKe?.id || undefined} onClick={() => moBai(b.id)} disabled={!!dangMo}>
                        <span className={s.baiSo} data-xong={xongB || undefined}>
                          {dangB ? (
                            <svg width={38} height={38} aria-hidden><circle cx={19} cy={19} r={17} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 17} strokeDashoffset={2 * Math.PI * 17 * (1 - t.gap / Math.max(1, t.tong))} /></svg>
                          ) : null}
                          {dangMo === b.id ? <Loader2 size={15} className={s.spin} /> : xongB ? '✓' : i + 1}
                        </span>
                        <span className={s.minh}>
                          <span className={s.baiTen} style={{ display: 'block' }}>
                            {b.ten} {b.nhanCap && loai !== 'cap' ? <span className={s.capTag} style={capCss(b.cap ?? '')}>{b.nhanCap}</span> : null}
                          </span>
                          <span className={s.baiMau} style={{ display: 'block' }}>{(b.mau ?? []).join(' · ')}{b.mau?.length ? ' …' : ''}</span>
                          <span className={s.baiTT} data-tt={xongB ? 'xong' : dangB ? 'dang' : undefined} style={{ display: 'block' }}>
                            {xongB ? `Xong ✓ · thuộc ${pt}% · bấm để ôn` : dangB ? `Đang học · ${t.gap}/${t.tong} từ` : `${t.tong} từ · chưa học`}
                            {b.id === baiKe?.id ? ' · bài kế' : ''}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
        {lt && !nhomHien.length ? <div className={s.trong}>Không có nhóm nào khớp.</div> : null}
      </div>

      {phien?.loai === 'phien' ? (
        <PhienHoc
          key={`${phien.baiId}-${phien.cheDo}-${phien.ten}`}
          nn={nn} tenBai={phien.ten} baiId={phien.baiId} tu={phien.tu} cheDo={phien.cheDo} daGap={gapK}
          nguPhap={phien.nguPhap} cap={phien.cap} dotId={phien.dotId}
          dong={() => setPhien(null)}
          baiKe={phien.cheDo === 'hoc' || phien.baiId ? () => {
            const ke = tatCaBai.find((b) => b.id !== phien.baiId && (b.k ?? []).some((k) => !gapK(k)));
            setPhien(null);
            if (ke) void moBai(ke.id, 'hoc');
          } : null}
        />
      ) : null}
      {phien?.loai === 'on' ? <OnThe nn={nn} the={denHanOn} tuDoc={kho.caiDat.tuDoc} dong={() => setPhien(null)} /> : null}
      {phien?.loai === 'tuCuaToi' ? (
        <TuCuaToi nn={nn} ds={tatCaTu} dong={() => setPhien(null)}
          onLai={(ten, ds) => setPhien({ loai: 'phien', ten, baiId: null, tu: ds, cheDo: 'on' })} />
      ) : null}
      {bao}
    </KhungCTL>
  );
}

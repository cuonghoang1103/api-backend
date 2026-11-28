'use client';

/**
 * 🧱 "1000 câu nền — dịch 2 chiều" (28/11/2026) — 30 ngày, ≥ 1000 câu Việt ↔ Anh cho người mất gốc.
 *
 * Một trang, ba màn (chuỗi truy vấn đọc/ghi qua moiTruong ⇒ chạy cả trong app desktop):
 *   (không gì)       tổng quan: chuỗi ngày, XP, đã thuộc x/1000, lưới 30 ngày, "Ôn hôm nay"
 *   ?ngay=N[&buoc=]  một ngày: 9 bước (khung → từ vựng → nghe → Việt→Anh → Anh→Việt → hội thoại → viết tay → ôn → kiểm tra)
 *   ?ngay=N&in=1     bản in / xem gọn để đặt cạnh iPad khi viết tay
 *   ?on=1            ôn mọi câu đến hạn của cả lộ trình
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Zap, CheckCircle2, RotateCcw, Play } from 'lucide-react';
import { setDefaultVoice, stopAudio } from '@/components/sach-hoc/audio';
import { docTruyVan, ghiTruyVan } from '@/components/sach-hoc/moiTruong';
import { useLangUser } from '@/components/language/primitives';
import { MUC_LUC, TONG_CAU } from './muc-luc';
import { layNgay } from './du-lieu';
import { useTienDoCauNen, tachId, type Buoc } from './useTienDoCauNen';
import { PhienLuyen, type MucLuyen } from './PhienLuyen';
import { PhanKhung, PhanTuVung, PhanNghe, PhanHoiThoai, PhanVietTay, BanIn } from './PhanNgay';
import { Anh } from './Chu';
import { xao, hatTu, homNay, denHan } from './onLap';
import type { NgayCauNen, Cau } from './kieu';
import s from './caunen.module.css';

type View = { t: 'tong' } | { t: 'ngay'; n: number; buoc: BuocUi } | { t: 'in'; n: number } | { t: 'on' };
type BuocUi = 'khung' | 'tu' | 'nghe' | 'viet' | 'hieu' | 'hoi' | 'tay' | 'on' | 'kiem';
const BUOC: { k: BuocUi; ten: string; luu?: Buoc }[] = [
  { k: 'khung', ten: '📘 Khung câu', luu: 'khung' },
  { k: 'tu', ten: '🖼️ Từ vựng' },
  { k: 'nghe', ten: '🎧 Nghe & nhắc', luu: 'nghe' },
  { k: 'viet', ten: '✍️ Việt → Anh', luu: 'viet' },
  { k: 'hieu', ten: '👂 Anh → Việt', luu: 'hieu' },
  { k: 'hoi', ten: '💬 Hội thoại & chơi' },
  { k: 'tay', ten: '📝 Viết tay' },
  { k: 'on', ten: '🔁 Ôn lặp', luu: 'on' },
  { k: 'kiem', ten: '🏁 Kiểm tra', luu: 'kiem' },
];
const BUOC_LUU: Buoc[] = ['khung', 'nghe', 'viet', 'hieu', 'on', 'kiem'];

/** Màu theo chặng 5 ngày. */
const MAU: [string, string][] = [['#f97316', '#ec4899'], ['#14b8a6', '#2563eb'], ['#8b5cf6', '#ec4899'], ['#22c55e', '#0ea5e9'], ['#3b82f6', '#6366f1'], ['#ef4444', '#f59e0b']];
const TEN_CHANG = ['Chặng 1 · Câu đầu tiên', 'Chặng 2 · Hỏi & trả lời', 'Chặng 3 · Bây giờ & hôm qua', 'Chặng 4 · Kế hoạch & lựa chọn', 'Chặng 5 · Lịch sự & nối câu', 'Chặng 6 · Đi thực tập & về đích'];
const mauNgay = (n: number) => MAU[Math.min(5, Math.floor((n - 1) / 5))];
const styleMau = (n: number) => ({ ['--c1' as string]: mauNgay(n)[0], ['--c2' as string]: mauNgay(n)[1] });

function viewTuUrl(): View {
  const q = docTruyVan();
  const n = Number(q.get('ngay'));
  if (q.get('on') === '1') return { t: 'on' };
  if (n >= 1 && n <= MUC_LUC.length) {
    if (q.get('in') === '1') return { t: 'in', n };
    const b = q.get('buoc') as BuocUi | null;
    return { t: 'ngay', n, buoc: b && BUOC.some((x) => x.k === b) ? b : 'khung' };
  }
  return { t: 'tong' };
}

export default function CauNenApp() {
  const { isAuthenticated } = useLangUser();
  const td = useTienDoCauNen(isAuthenticated);
  const [view, setView] = useState<View>({ t: 'tong' });
  useEffect(() => { setDefaultVoice('us-nu'); setView(viewTuUrl()); }, []);
  const di = useCallback((v: View) => {
    stopAudio();
    setView(v);
    ghiTruyVan((q) => {
      ['ngay', 'buoc', 'in', 'on'].forEach((k) => q.delete(k));
      if (v.t === 'ngay') { q.set('ngay', String(v.n)); if (v.buoc !== 'khung') q.set('buoc', v.buoc); }
      if (v.t === 'in') { q.set('ngay', String(v.n)); q.set('in', '1'); }
      if (v.t === 'on') q.set('on', '1');
    });
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className={s.root}>
      {view.t === 'tong' && <TongQuan td={td} di={di} />}
      {view.t === 'ngay' && <ManNgay n={view.n} buoc={view.buoc} td={td} di={di} />}
      {view.t === 'in' && <ManIn n={view.n} di={di} />}
      {view.t === 'on' && <ManOnTong td={td} di={di} />}
    </div>
  );
}

type TD = ReturnType<typeof useTienDoCauNen>;

/* ── Tổng quan ── */
function TongQuan({ td, di }: { td: TD; di: (v: View) => void }) {
  const tk = td.thongKe;
  const tiep = MUC_LUC.find((m) => !td.ngay[m.n]?.xong)?.n ?? MUC_LUC.length;
  const pct = Math.round((tk.thuoc / TONG_CAU) * 100);
  return (
    <div className={s.wrap}>
      <Link href="/language/en" className={s.back}><ArrowLeft size={15} /> Tiếng Anh</Link>
      <div className={s.hero} style={styleMau(1)}>
        <div className={s.heroTop}>
          <Anh anh="speaking-head" alt="" className={s.heroImg} />
          <div>
            <div className={s.heroKicker}>30 ngày · {TONG_CAU} câu · dịch 2 chiều</div>
            <h1 className={s.heroTitle}>1000 câu nền tiếng Anh</h1>
            <div className={s.heroSub}>Từ con số 0: mỗi ngày một khung câu, nghe – nhắc – dịch Việt↔Anh – viết tay – ôn lặp. Hết thói quen dịch từng chữ, nói được câu Anh tự nhiên.</div>
          </div>
        </div>
        <div className={s.hud}>
          <span className={s.hudItem}><Flame size={17} /> {tk.chuoi} <small>ngày liền</small></span>
          <span className={s.hudItem}><Zap size={17} /> {tk.xp} <small>XP</small></span>
          <span className={s.hudItem}><CheckCircle2 size={17} /> {tk.xong}/30 <small>ngày qua</small></span>
          <span className={s.hudItem}>🗂️ {tk.gap} <small>câu đã gặp</small></span>
        </div>
        <div className={s.bigBar}><i style={{ width: `${Math.max(1, pct)}%` }} /></div>
        <div className={s.bigBarLabel}><span>Đã thuộc <b>{tk.thuoc}</b> / {TONG_CAU} câu</span><span>{pct}%</span></div>
      </div>
      <div className={s.ctaRow}>
        <button type="button" className={s.cta} onClick={() => di({ t: 'ngay', n: tiep, buoc: 'khung' })}><Play size={16} /> {tk.gap ? 'Học tiếp' : 'Bắt đầu'} · Ngày {tiep}</button>
        <button type="button" className={s.ctaGhost} disabled={!tk.canOn.length} onClick={() => di({ t: 'on' })}><RotateCcw size={16} /> Ôn hôm nay · {tk.canOn.length} câu</button>
      </div>
      <div className={s.muted}>
        {tk.hocHomNay ? '✅ Hôm nay bạn đã học — giữ lửa nhé!' : '🔥 Hôm nay chưa học — 15 phút là đủ giữ chuỗi.'}
        {' '}“Đã thuộc” = câu dịch đúng ở ít nhất 3 ngày cách nhau (1 → 3 → 7 ngày).
      </div>

      {TEN_CHANG.map((ten, c) => {
        const ds = MUC_LUC.slice(c * 5, c * 5 + 5);
        return (
          <div key={c} className={s.chang} style={styleMau(c * 5 + 1)}>
            <div className={s.changHead}><span className={s.changDot} /><span className={s.changTen}>{ten}</span><span className={s.changMo}>Ngày {c * 5 + 1}–{c * 5 + 5}</span></div>
            <div className={s.grid}>
              {ds.map((m) => {
                const x = td.ngay[m.n];
                const buoc = (x?.buoc ?? []).filter((b) => BUOC_LUU.includes(b)).length;
                return (
                  <button key={m.n} type="button" className={`${s.dayCard} ${m.n === tiep ? s.dayNow : ''}`} onClick={() => di({ t: 'ngay', n: m.n, buoc: 'khung' })}>
                    <span className={s.dayNum}>Ngày {m.n}</span>
                    <Anh anh={m.anh} alt="" className={s.dayImg} />
                    <span className={s.dayTen}>{m.ten}</span>
                    <span className={s.dayKhung}>{m.khung}</span>
                    <span className={s.dayFoot}>
                      {m.on && <span className={s.tagOn}>Ôn</span>}
                      {x?.xong ? <span className={s.tick}>✓ {x.kiem}%</span> : <><span className={s.miniBar}><i style={{ width: `${(buoc / BUOC_LUU.length) * 100}%` }} /></span><span>{buoc}/{BUOC_LUU.length}</span></>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className={s.secTitle}>Học thế nào cho hiệu quả</div>
      <ul className={s.list}>
        <li><b>Mỗi ngày 30–45 phút</b>, đi đủ 9 bước. Bước 🎧 phải <b>nói to</b> — câm miệng học thì không bao giờ nói được.</li>
        <li><b>Việt → Anh</b>: bắt đầu bằng 🧩 ghép mảnh để quen trật tự từ, rồi chuyển ⌨️ gõ, cuối cùng 🎙️ nói.</li>
        <li><b>Ôn hôm nay</b> trước khi học ngày mới: câu sai và câu của 1 – 3 – 7 ngày trước tự quay lại.</li>
        <li><b>Viết tay</b> 10 câu mỗi ngày vào vở / iPad (bản in có sẵn) — chính tả và dấu câu sẽ chắc.</li>
        <li>Kiểm tra cuối ngày ≥ 80% mới tính là <b>qua ngày</b>. Chưa qua? Làm lại — không vội.</li>
      </ul>
    </div>
  );
}

/* ── Một ngày ── */
function useNgay(n: number) {
  const [ngay, setNgay] = useState<NgayCauNen | null | undefined>(undefined);
  const [loi, setLoi] = useState(false);
  const [thu, setThu] = useState(0);
  useEffect(() => {
    let song = true;
    setNgay(undefined); setLoi(false);
    layNgay(n).then((d) => { if (song) setNgay(d); }, () => { if (song) setLoi(true); });
    return () => { song = false; };
  }, [n, thu]);
  return { ngay, loi, thuLai: () => setThu((x) => x + 1) };
}

function ManNgay({ n, buoc, td, di }: { n: number; buoc: BuocUi; td: TD; di: (v: View) => void }) {
  const { ngay, loi, thuLai } = useNgay(n);
  const m = MUC_LUC[n - 1];
  const daXong = new Set(td.ngay[n]?.buoc ?? []);
  const sang = (b: BuocUi) => di({ t: 'ngay', n, buoc: b });
  const xongRoi = (luu: Buoc | undefined, tiep: BuocUi) => { if (luu) td.xongBuoc(n, luu); sang(tiep); };
  const trongNgay = td.ngay[n];

  return (
    <div className={s.wrap} style={styleMau(n)}>
      <button type="button" className={s.back} onClick={() => di({ t: 'tong' })}><ArrowLeft size={15} /> Lộ trình 30 ngày</button>
      <div className={s.dayHero}>
        <div className={s.heroTop}>
          <Anh anh={m.anh} alt="" className={s.heroImg} />
          <div>
            <div className={s.heroKicker}>Ngày {n}/30{m.on ? ' · ngày ôn' : ''} · {m.soCau} câu</div>
            <h1 className={s.heroTitle}>{m.ten}</h1>
            <div className={s.heroSub}>{ngay?.mucTieu ?? m.khung}</div>
          </div>
        </div>
        <div className={s.hud}>
          <span className={s.hudItem}><Flame size={16} /> {td.thongKe.chuoi}</span>
          <span className={s.hudItem}><Zap size={16} /> {td.thongKe.xp} XP</span>
          {trongNgay?.kiem != null && <span className={s.hudItem}>🏁 {trongNgay.kiem}%{trongNgay.xong ? ' ✓' : ''}</span>}
        </div>
      </div>
      <nav className={s.steps} aria-label="Các bước của ngày">
        {BUOC.map((b) => (
          <button key={b.k} type="button" className={`${s.step} ${buoc === b.k ? s.stepOn : ''}`} onClick={() => sang(b.k)} aria-current={buoc === b.k}>
            {b.ten}{b.luu && daXong.has(b.luu) ? <span className={s.stepOk}>✓</span> : null}
          </button>
        ))}
      </nav>
      {ngay === undefined && !loi && <div className={s.card}><div className={s.muted}>Đang tải ngày {n}…</div></div>}
      {loi && <div className={s.card}>Không tải được ngày {n}. <button type="button" className={s.chipBtn} onClick={thuLai}>Thử lại</button></div>}
      {ngay === null && <div className={s.card}><div className={s.cardTitle}>🛠️ Ngày {n} đang được soạn</div><div className={s.muted}>Nội dung ngày này sắp có. Trong lúc chờ, ôn lại các ngày trước nhé.</div></div>}
      {ngay && (
        <>
          {buoc === 'khung' && <PhanKhung ngay={ngay} onTiep={() => xongRoi('khung', 'tu')} />}
          {buoc === 'tu' && <PhanTuVung ngay={ngay} onTiep={() => sang('nghe')} />}
          {buoc === 'nghe' && <PhanNghe ngay={ngay} onTiep={() => xongRoi('nghe', 'viet')} />}
          {buoc === 'viet' && (
            <>
              <div className={s.cardSub}>Dịch {ngay.cau.length} câu sang tiếng Anh. Chưa quen thì 🧩 ghép mảnh; quen rồi thì ⌨️ gõ hoặc 🎙️ nói.</div>
              <PhienLuyen ds={ngay.cau.map((cau) => ({ cau, kieu: 've' }))} kho={ngay.cau} tieuDe="Việt → Anh" onTraLoi={td.traLoi} onXong={() => xongRoi('viet', 'hieu')} nhan="Sang Anh → Việt" />
            </>
          )}
          {buoc === 'hieu' && (
            <>
              <div className={s.cardSub}>Nghe (hoặc đọc) câu tiếng Anh, chọn nghĩa đúng. Nghe nguyên câu, hiểu cả câu — đừng dịch từng chữ trong đầu.</div>
              <PhienLuyen ds={xao(ngay.cau, hatTu(`ev${n}`)).map((cau) => ({ cau, kieu: 'ev' }))} kho={ngay.cau} tieuDe="Anh → Việt" onTraLoi={td.traLoi} onXong={() => xongRoi('hieu', 'hoi')} nhan="Sang Hội thoại" />
            </>
          )}
          {buoc === 'hoi' && <PhanHoiThoai ngay={ngay} onTraLoi={td.traLoi} onTiep={() => sang('tay')} />}
          {buoc === 'tay' && <PhanVietTay ngay={ngay} onTraLoi={td.traLoi} onIn={() => di({ t: 'in', n })} onTiep={() => sang('on')} />}
          {buoc === 'on' && <PhanOn ngay={ngay} td={td} onXong={() => xongRoi('on', 'kiem')} />}
          {buoc === 'kiem' && <PhanKiem ngay={ngay} td={td} di={di} />}
        </>
      )}
    </div>
  );
}

/** Câu sai + câu của 1, 3, 7 ngày trước (đúng lịch hứa) + câu đến hạn — tối đa 16. */
function PhanOn({ ngay, td, onXong }: { ngay: NgayCauNen; td: TD; onXong: () => void }) {
  const [ds, setDs] = useState<MucLuyen[] | null>(null);
  const [kho, setKho] = useState<Cau[]>(ngay.cau);
  useEffect(() => {
    let song = true;
    const n = ngay.n;
    const truoc = [n - 1, n - 3, n - 7].filter((x) => x >= 1);
    Promise.all(truoc.map((x) => layNgay(x).catch(() => null))).then((cac) => {
      if (!song) return;
      const hom = homNay();
      const tatCa = [ngay, ...cac.filter((x): x is NgayCauNen => !!x)];
      const theoId = new Map(tatCa.flatMap((d) => d.cau.map((c) => [c.id, c] as const)));
      const chon = new Map<string, Cau>();
      // 1) Câu sai còn ở hộp 0 + câu đến hạn (trong các ngày đã nạp).
      for (const [id, t] of Object.entries(td.the)) {
        const c = theoId.get(id);
        if (c && ((t.h === 0 && t.s > 0) || denHan(t, hom))) chon.set(id, c);
      }
      // 2) 4 câu mỗi ngày N−1, N−3, N−7.
      for (const d of tatCa.slice(1)) for (const c of xao(d.cau, hatTu(`${hom}-${d.n}`)).slice(0, 4)) chon.set(c.id, c);
      let ra = [...chon.values()].slice(0, 16);
      if (!ra.length) ra = xao(ngay.cau, hatTu(`${hom}-tu-on`)).slice(0, 8);
      setKho(tatCa.flatMap((d) => d.cau));
      setDs(xao(ra, hatTu(hom)).map((cau, i) => ({ cau, kieu: i % 4 === 3 ? 'ev' : 've' })));
    });
    return () => { song = false; };
    // td.the chỉ cần lúc dựng danh sách — không dựng lại mỗi lần trả lời.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ngay]);
  if (!ds) return <div className={s.card}><div className={s.muted}>Đang gom câu cần ôn…</div></div>;
  return (
    <>
      <div className={s.cardSub}>{ngay.n === 1 ? 'Ngày đầu chưa có câu cũ — ôn nhanh 8 câu của chính hôm nay.' : 'Câu bạn từng sai + câu của 1, 3 và 7 ngày trước — não nhớ lâu nhất khi gặp lại đúng lúc sắp quên.'}</div>
      <PhienLuyen ds={ds} kho={kho} tieuDe="Ôn lặp" onTraLoi={td.traLoi} onXong={onXong} nhan="Sang Kiểm tra" />
    </>
  );
}

function PhanKiem({ ngay, td, di }: { ngay: NgayCauNen; td: TD; di: (v: View) => void }) {
  const [lan, setLan] = useState(0);
  const [kq, setKq] = useState<number | null>(null);
  const ds = useMemo<MucLuyen[]>(() => {
    const tron = xao(ngay.cau, hatTu(`kiem-${ngay.n}-${lan}-${homNay()}`)).slice(0, 10);
    return tron.map((cau, i) => ({ cau, kieu: i < 6 ? 've' : 'ev' }));
  }, [ngay, lan]);
  if (kq != null) {
    const qua = kq >= 80;
    return (
      <div className={`${s.qCard} ${s.done}`}>
        <Anh anh={qua ? 'party-popper' : 'flexed-biceps'} alt="" className={s.doneImg} />
        <div className={s.doneBig}>{kq}%</div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{qua ? `Qua Ngày ${ngay.n}! 🎉` : 'Chưa đủ 80% — làm lại nhé'}</div>
        <div className={s.muted}>{qua ? '+100 XP · câu sai đã vào hàng ôn.' : 'Ôn lại phần Việt → Anh rồi kiểm tra lần nữa.'}</div>
        <div className={s.qActions} style={{ justifyContent: 'center' }}>
          <button type="button" className={s.btnGhost} onClick={() => { setKq(null); setLan((x) => x + 1); }}><RotateCcw size={15} /> Kiểm tra lại</button>
          {qua && ngay.n < 30 && <button type="button" className={s.btn} onClick={() => di({ t: 'ngay', n: ngay.n + 1, buoc: 'khung' })}>Sang Ngày {ngay.n + 1}</button>}
          <button type="button" className={s.btnGhost} onClick={() => di({ t: 'tong' })}>Về lộ trình</button>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={s.cardSub}>10 câu trộn hai chiều (6 Việt → Anh gõ/nói, 4 Anh → Việt). Đạt ≥ 80% là qua ngày.</div>
      <PhienLuyen key={lan} ds={ds} kho={ngay.cau} tieuDe={`Kiểm tra Ngày ${ngay.n}`} choGhep={false} onTraLoi={td.traLoi}
        onXong={(d, t) => { const p = Math.round((d / t) * 100); td.ghiKiem(ngay.n, p); setKq(p); }} nhan="Xem kết quả" />
    </>
  );
}

function ManIn({ n, di }: { n: number; di: (v: View) => void }) {
  const { ngay } = useNgay(n);
  return (
    <div className={s.print}>
      {ngay ? <BanIn ngay={ngay} onVe={() => di({ t: 'ngay', n, buoc: 'tay' })} /> : <div className={s.printPage}>{ngay === null ? 'Ngày này chưa soạn.' : 'Đang tải…'}</div>}
    </div>
  );
}

/** Ôn mọi câu đến hạn của cả lộ trình (tối đa 20 / lượt). */
function ManOnTong({ td, di }: { td: TD; di: (v: View) => void }) {
  const [ds, setDs] = useState<MucLuyen[] | null>(null);
  const [kho, setKho] = useState<Cau[]>([]);
  useEffect(() => {
    let song = true;
    const ids = td.thongKe.canOn.slice(0, 20);
    const ngays = [...new Set(ids.map((id) => tachId(id)[0]).filter(Boolean))];
    Promise.all(ngays.map((x) => layNgay(x).catch(() => null))).then((cac) => {
      if (!song) return;
      const tat = cac.filter((x): x is NgayCauNen => !!x).flatMap((d) => d.cau);
      const theo = new Map(tat.map((c) => [c.id, c]));
      setKho(tat);
      setDs(xao(ids.map((id) => theo.get(id)).filter((c): c is Cau => !!c), hatTu(homNay())).map((cau, i) => ({ cau, kieu: i % 4 === 3 ? 'ev' : 've' })));
    });
    return () => { song = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={s.wrap} style={styleMau(1)}>
      <button type="button" className={s.back} onClick={() => di({ t: 'tong' })}><ArrowLeft size={15} /> Lộ trình 30 ngày</button>
      <div className={s.dayHero}>
        <div className={s.heroKicker}>Ôn lặp ngắt quãng</div>
        <h1 className={s.heroTitle}>Ôn hôm nay</h1>
        <div className={s.heroSub}>Câu đến hạn ôn và câu bạn từng sai, từ mọi ngày đã học.</div>
      </div>
      <div style={{ height: 16 }} />
      {!ds ? <div className={s.card}><div className={s.muted}>Đang gom câu…</div></div>
        : <PhienLuyen ds={ds} kho={kho} tieuDe="Ôn hôm nay" onTraLoi={td.traLoi} onXong={() => di({ t: 'tong' })} nhan="Về lộ trình" />}
    </div>
  );
}

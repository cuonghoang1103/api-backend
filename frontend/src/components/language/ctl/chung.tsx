'use client';

/**
 * Khung + mảnh dùng chung của các trang CT Language trên web (Podcast · Học từ vựng · Sổ chuyên ngành) — 24/11/2026.
 * Tiếng: `components/sach-hoc/audio.ts` qua `phat()` dưới đây — giọng máy chủ ở tuyến CÔNG KHAI `/ctlanguage/doc` (Azure
 * Neural, lưu R2; đúng tuyến app CT Language dùng ⇒ khách chưa đăng nhập cũng nghe giọng chuẩn); lỗi / hết trần ⇒ giọng trình duyệt.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookmarkPlus, Check, Cloud, CloudOff, Loader2, Snail, Volume2, X, Square } from 'lucide-react';
import { play, stopAudio, type Clip, type Voice } from '@/components/sach-hoc/audio';
import { apiTuDien, type MucGon } from '@/lib/ctlanguage/api';
import { luuTu, useSoTu } from '@/lib/ctlanguage/dongBo';
import type { MucTuCTL, NnCTL } from '@/lib/ctlanguage/soTu';
import { usePro } from '@/hooks/usePro';
import s from './ctl.module.css';

export { s as css };

export const GIONG_MAC_DINH: Record<NnCTL, Voice> = { en: 'us-nu', ja: 'ja-nu', zh: 'zh-nu' };
export const TEN_NN: Record<NnCTL, string> = { en: 'Tiếng Anh', ja: 'Tiếng Nhật', zh: 'Tiếng Trung' };

/** Màu theo cấp (app `MauCapPodcast`): dễ = xanh lá → khó = tím đậm, chung một thang cho ba ngôn ngữ. */
export function mauCap(cap: string): [string, string] {
  const bac = ['A1', 'N5', 'HSK1'].includes(cap) ? 0 : ['A2', 'N4', 'HSK2'].includes(cap) ? 1 : ['B1', 'N3', 'HSK3'].includes(cap) ? 2
    : ['B2', 'N2', 'HSK4'].includes(cap) ? 3 : 4;
  return [['#22c55e', '#15803d'], ['#14b8a6', '#0e7490'], ['#3b82f6', '#1d4ed8'], ['#8b5cf6', '#6d28d9'], ['#d946ef', '#7e22ce']][bac] as [string, string];
}
export function moTaCap(cap: string): string {
  const m: Record<string, string> = {
    A1: 'Mới bắt đầu', A2: 'Sơ cấp', B1: 'Trung cấp', B2: 'Trung cao cấp', C1: 'Nâng cao', C2: 'Thành thạo',
    N5: 'Nhập môn', N4: 'Sơ cấp', N3: 'Trung cấp', N2: 'Trung cao cấp', N1: 'Cao cấp',
    HSK1: 'Nhập môn', HSK2: 'Sơ cấp', HSK3: 'Trung cấp', HSK4: 'Trung cao cấp', HSK5: 'Cao cấp', HSK6: 'Thành thạo',
  };
  return m[cap] ?? '';
}
export const capCss = (cap: string) => { const [a, b] = mauCap(cap); return { '--c1': a, '--c2': b } as CSSProperties; };

// ─── Khung trang ──────────────────────────────────────────────────────────────────────────────────────────────────

const MUC = [
  { ma: 'hoc-tu-vung', ten: 'Học từ vựng' },
  { ma: 'podcast', ten: 'Podcast' },
  { ma: 'so-chuyen-nganh', ten: 'Sổ chuyên ngành' },
] as const;

export function KhungCTL({ code, dangO, quayVe, tieuDe, children, hep }: {
  code: string; dangO: (typeof MUC)[number]['ma']; quayVe?: string; tieuDe: string; children: ReactNode; hep?: boolean;
}) {
  return (
    <div className={s.root} data-ctl-root>
      <div className={s.bar}>
        <div className={s.barInner}>
          <Link href={quayVe ?? `/language/${code}?hub=1`} className={s.back} aria-label="Quay lại"><ArrowLeft size={18} /></Link>
          <span className={s.barTitle}>{tieuDe}</span>
          {MUC.map((m) => (
            <Link key={m.ma} href={`/language/${code}/${m.ma}`} className={`${s.barLink} ${m.ma !== dangO ? s.anHep : ''}`} data-on={m.ma === dangO || undefined}>
              {m.ten}
            </Link>
          ))}
          <TrangThaiDongBo />
        </div>
      </div>
      <div className={`${s.wrap} ${hep ? s.wrapHep : ''}`}>{children}</div>
    </div>
  );
}

/** Đèn đồng bộ với tài khoản (thẻ ôn lặp + sổ dùng chung với app điện thoại). */
export function TrangThaiDongBo() {
  const { trang, loi, cho, dangNhap } = useSoTu();
  if (!dangNhap) return <Link href="/login" className={s.dongBo} title="Đăng nhập để tiến độ đi theo tài khoản, học tiếp trên app điện thoại"><CloudOff size={15} /><span className={s.anHep}>Chưa đăng nhập</span></Link>;
  if (trang === 'dangTai') return <span className={s.dongBo}><Loader2 size={15} className={s.spin} /><span className={s.anHep}>Đang đồng bộ…</span></span>;
  if (loi || trang === 'loi') return <span className={s.dongBo} data-loi title={loi ?? ''}><CloudOff size={15} /><span className={s.anHep}>{cho ? `${cho} thay đổi chờ gửi` : 'Chưa đồng bộ'}</span></span>;
  return <span className={s.dongBo} title="Đã đồng bộ với tài khoản — mở app CT Language trên điện thoại là thấy"><Cloud size={15} /><span className={s.anHep}>Đã đồng bộ</span></span>;
}

// ─── Nghe ─────────────────────────────────────────────────────────────────────────────────────────────────────────

/** `play()` của sách học, nhưng hỏi giọng qua tuyến công khai `/ctlanguage/doc` (khách cũng có giọng máy chủ). */
export function phat(clips: Clip | Clip[], onEnd?: () => void, opt?: Parameters<typeof play>[2]) {
  const ds = (Array.isArray(clips) ? clips : [clips]).map((c) => ({ ...c, congKhai: true }));
  return play(ds, onEnd, opt);
}

let demNghe = 0;
/** Nút loa nhỏ: bấm lần nữa khi đang đọc ⇒ dừng. */
export function NutNghe({ chu, nn, giong, cham, mau, nhan }: { chu: string; nn: NnCTL; giong?: Voice; cham?: boolean; mau?: string; nhan?: string }) {
  const [dang, setDang] = useState(false);
  const toi = useRef(0);
  return (
    <button
      type="button"
      className={s.icoBtn}
      style={mau ? ({ '--c': mau } as CSSProperties) : undefined}
      data-on={dang || undefined}
      aria-label={nhan ?? `Nghe “${chu}”`}
      title={nhan ?? 'Nghe'}
      onClick={(e) => {
        e.stopPropagation();
        if (dang) { stopAudio(); return; }
        const my = ++demNghe;
        toi.current = my;
        void phat({ text: chu, voice: giong ?? GIONG_MAC_DINH[nn], toc: cham ? 0.7 : undefined }, () => { if (toi.current === my) setDang(false); });
        setDang(true);
      }}
    >
      {dang ? <Square size={12} fill="currentColor" /> : cham ? <Snail size={15} /> : <Volume2 size={15} />}
    </button>
  );
}

// ─── Chữ bấm được (chạm từ ⇒ tra) ─────────────────────────────────────────────────────────────────────────────────

type Manh = { chu: string; laTu: boolean };
function tach(chu: string, nn: NnCTL): Manh[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: 'word' }) => { segment: (s: string) => Iterable<{ segment: string; isWordLike?: boolean }> } }).Segmenter;
  if (Seg) {
    try {
      return [...new Seg(nn === 'en' ? 'en' : nn === 'ja' ? 'ja' : 'zh', { granularity: 'word' }).segment(chu)].map((x) => ({ chu: x.segment, laTu: !!x.isWordLike }));
    } catch { /* lùi xuống dưới */ }
  }
  return chu.split(/(\s+|[.,!?;:"“”()…—–]+)/).filter(Boolean).map((x) => ({ chu: x, laTu: /[\p{L}\p{N}]/u.test(x) }));
}

/** Câu tách thành từ bấm được (en theo dấu cách; ja/zh theo `Intl.Segmenter` của trình duyệt). */
export function CauBamDuoc({ chu, nn, onTu, className }: { chu: string; nn: NnCTL; onTu: (tu: string) => void; className?: string }) {
  const ds = useMemo(() => tach(chu, nn), [chu, nn]);
  return (
    <span className={className}>
      {ds.map((m, i) => (m.laTu ? (
        <span
          key={i}
          role="button"
          tabIndex={0}
          className={s.w}
          onClick={() => onTu(m.chu)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTu(m.chu); } }}
        >{m.chu}</span>
      ) : <span key={i}>{m.chu}</span>))}
    </span>
  );
}

// ─── Tra nhanh + lưu sổ ───────────────────────────────────────────────────────────────────────────────────────────

/** Mục có sẵn trong nội dung (từ vựng của tập / bài) — hiện trước kết quả từ điển. */
export interface MucSan { chu: string; doc?: string | null; nghia: string; vd?: string | null }

/** Dạng gốc thô cho tiếng Anh (went ⇒ thử thêm "go" không làm được; chỉ bỏ đuôi phổ biến để tra ra mục gần nhất). */
function ungVienEn(w: string): string[] {
  const x = w.toLowerCase().replace(/[’']s$/, '');
  const ds = [x];
  if (x.endsWith('ies')) ds.push(`${x.slice(0, -3)}y`);
  if (x.endsWith('es')) ds.push(x.slice(0, -2));
  if (x.endsWith('s')) ds.push(x.slice(0, -1));
  if (x.endsWith('ied')) ds.push(`${x.slice(0, -3)}y`);
  if (x.endsWith('ed')) ds.push(x.slice(0, -2), x.slice(0, -1));
  if (x.endsWith('ing')) ds.push(x.slice(0, -3), `${x.slice(0, -3)}e`);
  return [...new Set(ds)].filter((v) => v.length >= 2);
}

export function TraNhanh({ chu, nn, san, dong, ngoaiTru }: {
  chu: string; nn: NnCTL; san?: MucSan[]; dong: () => void;
  /** Tên nhân vật trong tập — chạm vào ⇒ thẻ "Tên người", không tra nhầm từ điển. */
  ngoaiTru?: Record<string, string>;
}) {
  const [kq, setKq] = useState<MucGon[] | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const tenNguoi = ngoaiTru?.[chu];
  const coSan = useMemo(() => (san ?? []).filter((m) => m.chu.toLowerCase() === chu.toLowerCase()
    || (nn === 'en' ? ungVienEn(chu).includes(m.chu.toLowerCase())
      // ja/zh: bộ tách từ của trình duyệt có thể cắt khác (お|弁当) ⇒ khớp cả khi từ của bài chứa chữ vừa chạm.
      : [...chu].length >= 2 && m.chu.includes(chu))), [san, chu, nn]);

  useEffect(() => {
    if (tenNguoi) return;
    let song = true;
    (async () => {
      try {
        const thu = nn === 'en' ? ungVienEn(chu) : [chu];
        let ra: MucGon[] = [];
        for (const q of thu) {
          const r = await apiTuDien.tra(nn, q, 5);
          const dung = r.filter((m) => m.chu.toLowerCase() === q.toLowerCase());
          if (dung.length) { ra = [...dung, ...r.filter((m) => !dung.includes(m))].slice(0, 4); break; }
          if (!ra.length) ra = r.slice(0, 3);
        }
        if (song) setKq(ra);
      } catch { if (song) setLoi('Chưa tra được (mạng?).'); }
    })();
    return () => { song = false; };
  }, [chu, nn, tenNguoi]);

  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') dong(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [dong]);

  return (
    <div className={s.mo} onClick={dong} role="dialog" aria-modal="true" aria-label={`Tra “${chu}”`}>
      <div className={s.moHop} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, fontWeight: 900, flex: 1, minWidth: 0 }}>{chu}</span>
          <NutNghe chu={chu} nn={nn} />
          <button type="button" className={s.icoBtn} style={{ '--c': 'var(--lh-ink-3)' } as CSSProperties} onClick={dong} aria-label="Đóng"><X size={16} /></button>
        </div>
        {tenNguoi ? (
          <p className={s.note} style={{ marginTop: 10 }}>Tên người · {tenNguoi} trong tập này.</p>
        ) : (
          <div style={{ marginTop: 12 }}>
            {coSan.map((m, i) => (
              <div key={`s${i}`} className={s.mucTra}>
                <div><b>{m.chu}</b>{m.doc ? <span className={s.vocabDoc}>{m.doc}</span> : null} <span className={s.chip + ' ' + s.chipNho} style={{ marginLeft: 6 }}>trong bài</span></div>
                <div className={s.vocabNghia}>{m.nghia}</div>
                {m.vd ? <div className={s.vocabVd}>{m.vd}</div> : null}
                <NutLuu nn={nn} muc={{ id: idMucSan(nn, m.chu), chu: m.chu, doc: m.doc ?? null, nghiaVi: m.nghia }} />
              </div>
            ))}
            {kq === null && !loi ? <p className={s.note}><Loader2 size={14} className={s.spin} style={{ display: 'inline' }} /> Đang tra…</p> : null}
            {loi ? <p className={s.note}>{loi}</p> : null}
            {kq?.map((m) => (
              <div key={m.id} className={s.mucTra}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                  <b style={{ fontSize: 17 }}>{m.chu}</b>
                  {m.doc ? <span className={s.vocabDoc}>{m.doc.replace(/[『』]/g, '')}</span> : null}
                  {m.hanViet ? <span className={s.vocabDoc}>· {m.hanViet}</span> : null}
                </div>
                <div className={s.vocabNghia}>{m.nghiaVi || m.nghiaEn || '—'}</div>
                <NutLuu nn={nn} muc={m} />
              </div>
            ))}
            {kq && !kq.length && !coSan.length ? <p className={s.note}>Từ điển chưa có mục này.</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}

/** id ÂM ổn định theo chữ cho từ của tập podcast (đúng công thức app `TapPodcastCTL.mucTu`). */
export function idMucSan(_nn: NnCTL, chu: string): number {
  let h = 5381;
  // Swift Int 64 bit: ((h << 5) &+ h &+ v) & 0x3fffffff — tính bằng số thực (không tràn 32 bit như toán tử << của JS).
  for (const c of chu) h = (h * 33 + c.codePointAt(0)!) % 0x40000000;
  return -(h + 1);
}

/** Lưu một từ vào sổ của tài khoản ("Tất cả từ đã lưu" — app tự hiện, ôn lặp được). */
export function NutLuu({ nn, muc, nho }: { nn: NnCTL; muc: MucTuCTL; nho?: boolean }) {
  const so = useSoTu();
  const { isPro } = usePro();
  const [bao, setBao] = useState<string | null>(null);
  const co = useMemo(() => [...so.guong.the.values()].some((t) => t.nn === nn && (t.muc.id === muc.id || t.muc.chu === muc.chu)), [so.guong, nn, muc.id, muc.chu]);
  const bam = useCallback(() => {
    if (!so.dangNhap) { setBao('Đăng nhập để lưu từ vào sổ (đồng bộ với app điện thoại).'); return; }
    if (so.trang !== 'san') { setBao('Sổ đang đồng bộ, thử lại sau giây lát.'); return; }
    const kq = luuTu(nn, [{ ...muc, thongDung: muc.thongDung ?? true }], { laPro: isPro, soId: null });
    setBao(kq.chan ? 'Sổ bản miễn phí tối đa 200 từ — nâng Pro để lưu thêm.' : 'Đã lưu vào sổ · ôn lặp trên web và app.');
  }, [so.dangNhap, so.trang, nn, muc, isPro]);
  return (
    <div style={{ marginTop: nho ? 0 : 8 }}>
      <button type="button" className={`${s.chip} ${s.chipNho}`} onClick={bam} disabled={co} data-on={co || undefined}>
        {co ? <><Check size={13} /> Đã có trong sổ</> : <><BookmarkPlus size={13} /> Lưu vào sổ</>}
      </button>
      {bao && !co ? <span className={s.note} style={{ marginLeft: 8 }}>{bao}</span> : null}
    </div>
  );
}

// ─── Báo nhanh ────────────────────────────────────────────────────────────────────────────────────────────────────

export function useBao() {
  const [bao, setBao] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hien = useCallback((x: string) => {
    setBao(x);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setBao(null), 3500);
  }, []);
  const nut = bao ? <div className={s.toast} role="status">{bao}</div> : null;
  return { hien, nut };
}

/** Vòng tiến độ SVG. */
export function Vong({ tien, co = 96, day = 9, mau = '#fff', nen = 'rgba(255,255,255,0.22)', children, className }: {
  tien: number; co?: number; day?: number; mau?: string; nen?: string; children?: ReactNode; className?: string;
}) {
  const r = (co - day) / 2, cv = 2 * Math.PI * r;
  return (
    <div className={className} style={{ position: 'relative', width: co, height: co }}>
      <svg width={co} height={co} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
        <circle cx={co / 2} cy={co / 2} r={r} fill="none" stroke={nen} strokeWidth={day} />
        <circle cx={co / 2} cy={co / 2} r={r} fill="none" stroke={mau} strokeWidth={day} strokeLinecap="round"
          strokeDasharray={cv} strokeDashoffset={cv * (1 - Math.max(0, Math.min(1, tien)))} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

'use client';

/**
 * 🎙 Nói theo + chấm phát âm — bản web của `LuyenPhatAmCTL` (app CT Language, `Modules/PhatAm/LuyenPhatAmCTL.swift`), 24/11/2026.
 * Nghe mẫu (giọng máy chủ) ⇒ bấm micro đọc to (nói xong im 1,2 s là tự dừng, tối đa 15 s) ⇒ máy chủ chấm bằng Azure
 * Pronunciation Assessment qua ĐÚNG tuyến app dùng: `POST /ctlanguage/phat-am/ai/cham` (WAV 16 kHz mono — `blobToWav16k`)
 * ⇒ điểm tổng + chính xác / trôi chảy / đầy đủ (+ ngữ điệu tiếng Anh giọng Mỹ), từng từ / âm (đỏ = cần sửa), tiếng Trung
 * từng chữ kèm thanh, gợi ý sửa tiếng Việt. Nghe lại bản mình + bản mẫu.
 * Khách: vẫn ghi âm + nghe lại để tự so, kèm lời mời đăng nhập (tuyến chấm bắt đăng nhập — tốn tiền Azure, không mở).
 * Máy chủ chưa có khoá (`batChua = false`) ⇒ như khách, báo rõ "chưa bật chấm". Hết lượt ⇒ mời Pro.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Lightbulb, Loader2, Mic, Square, UserRound, Volume2, X } from 'lucide-react';
import { useMicro } from '@/components/sach-hoc/useMicro';
import { blobToWav16k } from '@/components/sach-hoc/wav';
import { stopAudio } from '@/components/sach-hoc/audio';
import { useAuthStore } from '@/store/authStore';
import { apiPhatAm, type ChamPhatAm, type KetQuaPhatAm, type LuotPhatAm } from '@/lib/ctlanguage/api';
import type { NnCTL } from '@/lib/ctlanguage/soTu';
import { GIONG_MAC_DINH, css as s, phat } from './chung';

const KHOA_GIONG = 'ctl:phat-am:giong';
const TEN_THANH = ['Thanh nhẹ', 'Thanh 1 (ngang cao)', 'Thanh 2 (đi lên)', 'Thanh 3 (xuống rồi lên)', 'Thanh 4 (rơi mạnh)'];

/** Câu cho người học khi lượt chấm không ra điểm (app `PhatAmCTL.cauLyDo`). */
function cauLyDo(lyDo?: string, thongBao?: string): string {
  if (thongBao) return thongBao;
  switch (lyDo) {
    case 'chua_co_khoa': return 'Chấm phát âm đang tạm nghỉ. Bạn vẫn nghe mẫu và tự ghi âm để so được.';
    case 'het_luot_thang': return 'Máy chấm phát âm đã hết hạn mức tháng này — thử lại sau nhé.';
    case 'khong_nghe_thay': return 'Chưa nghe rõ — đọc to, gần micro hơn và đọc đúng câu mẫu.';
    default: return 'Máy chấm đang trục trặc, thử lại sau ít phút.';
  }
}
const mau = (d?: number) => ((d ?? 0) >= 80 ? 'var(--lh-ok)' : (d ?? 0) >= 60 ? 'var(--lh-warn)' : 'var(--lh-bad)');
/** Bỏ chú thích ruby `{chữ|đọc}` ⇒ chữ. */
const boRuby = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').trim();

/** Nút mở màn nói theo. `gon` = chỉ biểu tượng micro (cạnh nút nghe của một câu). */
export function NutPhatAm({ cau, doc, nghia, nn, gon, mauNut }: { cau: string; doc?: string | null; nghia?: string | null; nn: NnCTL; gon?: boolean; mauNut?: string }) {
  const [dich, setDich] = useState<Element | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  // Hộp mở qua portal vào khung CT Language gần nhất (`data-ctl-root` — giữ biến màu sáng/tối): dòng podcast đang đọc có
  // `transform` ⇒ `position: fixed` bên trong nó bị neo theo dòng, không phủ màn hình.
  const mo = (e: ReactMouseEvent) => { e.stopPropagation(); setDich(ref.current?.closest('[data-ctl-root]') ?? document.body); };
  return (
    <>
      {gon ? (
        <button ref={ref} type="button" className={s.icoBtn} style={mauNut ? ({ '--c': mauNut } as CSSProperties) : undefined}
          onClick={mo} aria-label="Nói theo · chấm phát âm" title="Nói theo · chấm phát âm">
          <Mic size={14} />
        </button>
      ) : (
        <button ref={ref} type="button" className={`${s.chip} ${s.chipNho}`} onClick={mo}>
          <Mic size={13} /> Nói theo · chấm phát âm
        </button>
      )}
      {dich ? createPortal(<LuyenPhatAm cau={cau} doc={doc} nghia={nghia} nn={nn} dong={() => setDich(null)} />, dich) : null}
    </>
  );
}

export function LuyenPhatAm({ cau, doc, nghia, nn, dong }: { cau: string; doc?: string | null; nghia?: string | null; nn: NnCTL; dong: () => void }) {
  const dangNhap = useAuthStore((x) => x.isAuthenticated);
  const cauMau = boRuby(cau);
  const docGui = doc?.trim() && doc.trim() !== cauMau ? doc.trim() : null;
  const [giongAnh, setGiongAnh] = useState<'us' | 'uk'>('us');
  const [luot, setLuot] = useState<LuotPhatAm | null>(null);
  const [ban, setBan] = useState<{ goc: Blob; url: string } | null>(null);
  const [dangCham, setDangCham] = useState(false);
  const [kq, setKq] = useState<KetQuaPhatAm | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [chamLai, setChamLai] = useState(false);
  const [canPro, setCanPro] = useState(false);
  const [ngheBan, setNgheBan] = useState(false);
  const amRef = useRef<HTMLAudioElement | null>(null);
  const chuaBat = luot?.batChua === false;
  const duocCham = dangNhap && !chuaBat;

  useEffect(() => {
    try { if (localStorage.getItem(KHOA_GIONG) === 'uk') setGiongAnh('uk'); } catch { /* bỏ qua */ }
  }, []);
  useEffect(() => {
    if (!dangNhap) return;
    let song = true;
    apiPhatAm.luot().then((l) => song && setLuot(l)).catch(() => {});
    return () => { song = false; };
  }, [dangNhap]);
  useEffect(() => () => { if (ban) URL.revokeObjectURL(ban.url); }, [ban]);
  useEffect(() => () => { amRef.current?.pause(); }, []);

  const cham = useCallback(async (goc: Blob) => {
    setDangCham(true); setLoi(null); setChamLai(false); setCanPro(false);
    try {
      const wav = await blobToWav16k(goc);
      const r = await apiPhatAm.cham(wav, { cau: cauMau, nn, giong: nn === 'en' ? giongAnh : nn, doc: docGui });
      if (r.luot) setLuot(r.luot);
      if (r.ketQua) setKq(r);
      else {
        setLoi(cauLyDo(r.lyDo, r.thongBao));
        if (r.lyDo === 'chua_co_khoa') setLuot((l) => ({ ...(l ?? {}), batChua: false }));
      }
    } catch (e) {
      const res = (e as { response?: { status?: number; data?: { message?: string; code?: string } } })?.response;
      if (!res) { setChamLai(true); setLoi('Không gửi được bản ghi (mạng?) — bản ghi vẫn giữ, bấm “Chấm lại”.'); }
      else if (res.status === 401) setLoi('Phiên đăng nhập đã hết — đăng nhập lại để chấm phát âm.');
      else {
        if (res.data?.code === 'CTL_PHAT_AM_HET_LUOT') { setCanPro(luot?.laPro !== true); setLuot((l) => ({ ...(l ?? {}), conLai: 0 })); }
        setLoi(res.data?.message ?? 'Chưa chấm được bản ghi lúc này — thử lại sau ít phút nhé.');
      }
    } finally { setDangCham(false); }
  }, [cauMau, nn, giongAnh, docGui, luot?.laPro]);

  const mic = useMicro({
    toiDaMs: 15_000,
    tuDung: { imMs: 1200 },
    onXong: (goc, { coTieng }) => {
      setBan({ goc, url: URL.createObjectURL(goc) });
      if (!coTieng) { setLoi('Mình chưa nghe thấy bạn nói gì — bấm micro rồi đọc to câu trên nhé.'); return; }
      if (duocCham) void cham(goc);
    },
  });

  // Esc đóng (trước cả phím tắt của phiên học — phiên bỏ qua phím khi có hộp này).
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); dong(); } };
    window.addEventListener('keydown', f, true);
    return () => window.removeEventListener('keydown', f, true);
  }, [dong]);

  const ngheMau = () => { amRef.current?.pause(); setNgheBan(false); void phat({ text: cauMau, voice: nn === 'en' ? (giongAnh === 'uk' ? 'uk-nu' : 'us-nu') : GIONG_MAC_DINH[nn] }); };
  const ngheBanMinh = () => {
    if (!ban) return;
    if (ngheBan) { amRef.current?.pause(); setNgheBan(false); return; }
    stopAudio();
    const a = amRef.current ?? new Audio();
    amRef.current = a;
    a.src = ban.url;
    a.onended = () => setNgheBan(false);
    a.play().then(() => setNgheBan(true)).catch(() => setNgheBan(false));
  };

  const dangGhi = mic.trangThai === 'ghi';
  const trangThai = mic.trangThai === 'mo' ? 'Đang mở micro…' : dangGhi ? 'Đang nghe — đọc to câu trên, nói xong máy tự dừng'
    : dangCham ? 'Đang chấm…' : kq?.ketQua ? 'Bấm để đọc lại' : duocCham ? 'Bấm micro rồi đọc to (tối đa 15 giây)' : 'Bấm micro để tự ghi âm';

  return (
    <div className={s.mo} onClick={dong} role="dialog" aria-modal="true" aria-label="Nói theo · chấm phát âm" data-ctl-phat-am>
      <div className={s.moHop} style={{ width: 'min(100%, 36rem)', maxHeight: 'min(90vh, 820px)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={s.dangLabel} style={{ flex: 1 }}>Nói theo · chấm phát âm</span>
          <button type="button" className={s.icoBtn} style={{ '--c': 'var(--lh-ink-3)' } as CSSProperties} onClick={dong} aria-label="Đóng"><X size={16} /></button>
        </div>

        {/* Câu mẫu */}
        <div style={{ marginTop: 10 }}>
          {docGui ? <div style={{ color: 'var(--lh-accent)', fontSize: 15, fontWeight: 600 }}>{nn === 'en' ? `/${docGui.replace(/^\/|\/$/g, '')}/` : docGui}</div> : null}
          <div style={{ fontSize: [...cauMau].length > 14 ? 22 : 34, fontWeight: 750, lineHeight: 1.3, marginTop: 2 }}>{cauMau}</div>
          {nghia ? <div className={s.vocabNghia} style={{ marginTop: 4 }}>{nghia}</div> : null}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button type="button" className={s.btn} onClick={ngheMau}><Volume2 size={16} /> Nghe mẫu</button>
            {ban && !dangGhi ? (
              <button type="button" className={`${s.btn} ${s.btnPhu}`} onClick={ngheBanMinh}>
                {ngheBan ? <Square size={14} fill="currentColor" /> : <UserRound size={16} />} {ngheBan ? 'Dừng' : 'Nghe bản của bạn'}
              </button>
            ) : null}
          </div>
          {nn === 'en' ? (
            <div className={s.seg} style={{ marginTop: 12 }} role="radiogroup" aria-label="Chấm theo giọng">
              {(['us', 'uk'] as const).map((g) => (
                <button key={g} type="button" role="radio" aria-checked={giongAnh === g} className={s.segBtn} data-on={giongAnh === g || undefined}
                  onClick={() => { setGiongAnh(g); try { localStorage.setItem(KHOA_GIONG, g); } catch { /* bỏ qua */ } }}>
                  {g === 'us' ? '🇺🇸 Giọng Mỹ' : '🇬🇧 Giọng Anh'}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Ghi âm */}
        <div style={{ display: 'grid', justifyItems: 'center', gap: 10, marginTop: 18, textAlign: 'center' }}>
          <button type="button" onClick={() => (dangGhi ? mic.dung() : void mic.batDau())} disabled={dangCham || mic.trangThai === 'mo'}
            aria-label={dangGhi ? 'Dừng ghi' : 'Ghi âm và chấm'}
            style={{
              width: 80, height: 80, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              background: dangGhi ? '#dc2626' : 'var(--lh-accent)', boxShadow: `0 0 0 ${dangGhi ? 4 + Math.round(mic.muc * 16) : 0}px color-mix(in srgb, ${dangGhi ? '#dc2626' : 'var(--lh-accent)'} 25%, transparent)`,
              transition: 'box-shadow 0.1s ease', opacity: dangCham ? 0.7 : 1,
            }}>
            {dangCham ? <Loader2 size={28} className={s.spin} /> : dangGhi ? <Square size={26} fill="currentColor" /> : <Mic size={30} />}
          </button>
          <div className={s.note} style={{ fontWeight: 600 }}>{trangThai}</div>
          {mic.loi || loi ? <div style={{ color: 'var(--lh-warn)', fontSize: 13.5 }}>{mic.loi || loi}</div> : null}
          {chamLai && ban ? <button type="button" className={s.btn} onClick={() => void cham(ban.goc)}>Chấm lại</button> : null}
          {canPro ? <Link href="/pro" className={s.btn}>Nâng cấp Pro</Link> : null}
          {!dangNhap ? (
            <Link href="/login" className={s.btn}>Đăng nhập để AI chấm phát âm</Link>
          ) : chuaBat ? (
            <div className={s.note}>Chấm phát âm đang tạm nghỉ — bạn vẫn ghi âm rồi nghe lại để tự so với mẫu.</div>
          ) : luot?.conLai != null && luot.tran != null ? (
            <div className={s.note}>Còn {luot.conLai}/{luot.tran} lượt chấm hôm nay{luot.laPro ? ' · Pro' : ''}</div>
          ) : null}
        </div>

        {kq?.ketQua ? <KetQua k={kq.ketQua} nn={nn} /> : null}
        {kq?.goiY?.length ? (
          <div className={s.box} style={{ marginTop: 14 }}>
            <div className={s.h3}>Gợi ý sửa</div>
            {kq.goiY.map((g, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 14.5, lineHeight: 1.5 }}>
                <Lightbulb size={15} style={{ flex: 'none', marginTop: 3, color: 'var(--lh-warn)' }} /> <span>{g}</span>
              </div>
            ))}
          </div>
        ) : null}
        <p className={s.note} style={{ marginTop: 14, fontSize: 12 }}>
          Bản ghi được gửi qua máy chủ CuongThai tới Microsoft Azure Speech để chấm, không được lưu lại. Điểm do máy chấm — dùng để tự luyện, không phải điểm thi.
        </p>
      </div>
    </div>
  );
}

function KetQua({ k, nn }: { k: ChamPhatAm; nn: NnCTL }) {
  const tong = k.diem?.tong ?? 0;
  const thanh = (ten: string, d?: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
      <span style={{ width: 70, color: 'var(--lh-ink-2)', fontWeight: 600 }}>{ten}</span>
      <span style={{ flex: 1, height: 7, borderRadius: 999, background: 'var(--lh-surface-2)', overflow: 'hidden' }}>
        <i style={{ display: 'block', height: '100%', width: `${Math.max(3, d ?? 0)}%`, background: mau(d), borderRadius: 999 }} />
      </span>
      <b style={{ width: 28, textAlign: 'right', color: mau(d), fontVariantNumeric: 'tabular-nums' }}>{Math.round(d ?? 0)}</b>
    </div>
  );
  const r = 38, cv = 2 * Math.PI * r;
  const thieu = (k.tu ?? []).filter((w) => w.loi === 'Omission');
  return (
    <div className={`${s.card} ${s.cardPad}`} style={{ marginTop: 16 }} aria-label="Kết quả chấm">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 92, height: 92, flex: 'none' }} aria-label={`Điểm phát âm ${Math.round(tong)} trên 100`}>
          <svg width={92} height={92} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
            <circle cx={46} cy={46} r={r} fill="none" stroke="var(--lh-surface-2)" strokeWidth={9} />
            <circle cx={46} cy={46} r={r} fill="none" stroke={mau(tong)} strokeWidth={9} strokeLinecap="round" strokeDasharray={cv} strokeDashoffset={cv * (1 - Math.max(0.02, tong / 100))} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <b style={{ fontSize: 28, color: mau(tong), lineHeight: 1 }}>{Math.round(tong)}</b>
            <span style={{ fontSize: 11, color: 'var(--lh-ink-3)' }}>/100</span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', gap: 7 }}>
          {thanh('Chính xác', k.diem?.chinhXac)}
          {thanh('Trôi chảy', k.diem?.troiChay)}
          {thanh('Đầy đủ', k.diem?.dayDu)}
          {k.diem?.ngonDieu != null ? thanh('Ngữ điệu', k.diem.ngonDieu) : null}
        </div>
      </div>
      <div className={s.dangLabel} style={{ marginTop: 14 }}>{nn === 'zh' ? 'Từng chữ' : nn === 'ja' ? 'Từng từ' : 'Từng từ · từng âm'}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {nn === 'zh' && k.chuThanh?.length ? k.chuThanh.map((c, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '6px 8px', borderRadius: 10, background: `color-mix(in srgb, ${mau(c.diem)} 12%, transparent)`, border: c.nghiNgoThanh ? '1.2px solid var(--lh-bad)' : '1.2px solid transparent' }}>
            <div style={{ fontSize: 11.5, color: 'var(--lh-ink-2)', fontWeight: 600 }}>{c.pinyin ?? ' '}</div>
            <div style={{ fontSize: 26, color: mau(c.diem) }}>{c.chu}</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: c.nghiNgoThanh ? 'var(--lh-bad)' : mau(c.diem) }}>
              {c.nghiNgoThanh && c.thanh != null ? TEN_THANH[c.thanh] ?? 'Thanh nhẹ' : Math.round(c.diem ?? 0)}
            </div>
          </div>
        )) : (k.tu ?? []).map((w, i) => {
          const th = w.loi === 'Omission', thua = w.loi === 'Insertion';
          const am = (w.am ?? []).filter((a) => a.am);
          const m = th ? 'var(--lh-ink-3)' : mau(w.diem);
          return (
            <div key={i} style={{ textAlign: 'center', padding: '6px 9px', borderRadius: 9, background: `color-mix(in srgb, ${m} 10%, transparent)`, border: (w.diem ?? 0) < 60 && !th && !thua ? '1.2px solid var(--lh-bad)' : '1.2px solid transparent' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: m, textDecoration: th ? 'line-through' : undefined }}>{w.tu}</div>
              {th ? <div style={{ fontSize: 10.5, color: 'var(--lh-ink-3)' }}>đọc thiếu</div>
                : thua ? <div style={{ fontSize: 10.5, color: 'var(--lh-ink-3)' }}>đọc thừa</div>
                  : am.length ? <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>{am.map((a, j) => <span key={j} style={{ fontSize: 12, fontWeight: 600, color: mau(a.diem) }}>{a.am}</span>)}</div>
                    : <div style={{ fontSize: 11, fontWeight: 600, color: m }}>{Math.round(w.diem ?? 0)}</div>}
            </div>
          );
        })}
      </div>
      {nn === 'zh' && thieu.length ? <div style={{ marginTop: 8, fontSize: 13, color: 'var(--lh-bad)' }}>Đọc thiếu: {thieu.map((w) => w.tu).join(', ')}</div> : null}
      {k.ngheRa ? <div className={s.note} style={{ marginTop: 10 }}>Máy nghe ra: “{k.ngheRa}”</div> : null}
      <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11.5, color: 'var(--lh-ink-3)', flexWrap: 'wrap' }}>
        <span><span style={{ color: 'var(--lh-ok)' }}>●</span> Tốt ≥ 80</span>
        <span><span style={{ color: 'var(--lh-warn)' }}>●</span> Gần đúng</span>
        <span><span style={{ color: 'var(--lh-bad)' }}>●</span> Cần sửa &lt; 60</span>
      </div>
    </div>
  );
}

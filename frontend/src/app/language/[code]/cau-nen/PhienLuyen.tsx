'use client';

/**
 * Phiên luyện từng câu kiểu Duolingo — dùng cho ✍️ Việt → Anh, 👂 Anh → Việt, 🔁 Ôn lặp và 🏁 Kiểm tra.
 *
 *  - Việt → Anh có 3 cách trả lời: 🧩 ghép mảnh (dễ, học trật tự từ) · ⌨️ gõ · 🎙️ nói (ghi âm ⇒ Whisper
 *    chép lời qua `/my-language/ai/stt` ⇒ chấm như gõ). Chấm bằng `chamCau.cham` (câu mẫu + alt, sau chuẩn hoá);
 *    không khớp ⇒ hiện chỗ khác từng từ + lỗi hay gặp, và nút "Nhờ CuongMini xem" (`POST /ielts/ai/cham-dich`)
 *    — CuongMini nói câu của bạn đúng thì tính là ĐÚNG.
 *  - Anh → Việt: nghe (che chữ) hoặc đọc, chọn nghĩa đúng trong 4; hoặc tự gõ nghĩa để CuongMini chấm.
 * Kết quả mỗi câu chỉ báo ra ngoài (`onTraLoi`) khi bấm "Tiếp" — để lời phán của CuongMini kịp đổi kết quả.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, X, Sparkles, Volume2, Snail, Mic, Square, ArrowRight, RotateCcw, Eye, Keyboard, Puzzle, Ear, BookOpen } from 'lucide-react';
import api from '@/lib/api';
import { languageApi } from '@/lib/language-api';
import { AI_TIMEOUT, stopAudio } from '@/components/sach-hoc/audio';
import { useMicro } from '@/components/sach-hoc/useMicro';
import { blobToWav16k } from '@/components/sach-hoc/wav';
import { useLangUser } from '@/components/language/primitives';
import { cham, manhGhep, type KetQuaCham } from './chamCau';
import { xao, hatTu } from './onLap';
import { doc, CauNghe } from './CauNghe';
import { Chu } from './Chu';
import type { Cau } from './kieu';
import s from './caunen.module.css';

export type MucLuyen = { cau: Cau; kieu: 've' | 'ev' };
export type CheDo = 'ghep' | 'go' | 'noi';
type CheDoEV = 'nghe' | 'doc';
type AiKq = { dung: boolean; nhanXet: string; cauSua?: string };

const KEY_CD = 'en-cau-nen:che-do';
const KEY_EV = 'en-cau-nen:che-do-ev';

function docCd<T extends string>(k: string, mac: T, hop: readonly T[]): T {
  try { const v = localStorage.getItem(k) as T | null; if (v && hop.includes(v)) return v; } catch { /* bỏ qua */ }
  return mac;
}

export function PhienLuyen({ ds, kho, tieuDe, choGhep = true, onTraLoi, onXong, nhan, epCheDo }: {
  /** Ép một cách trả lời (trò chơi ghép câu) — ẩn hàng chọn cách. */
  epCheDo?: CheDo;
  ds: MucLuyen[];
  /** Câu để lấy phương án nhiễu / mảnh nhiễu (thường là cả ngày). */
  kho: Cau[];
  tieuDe: string;
  /** Kiểm tra cuối ngày: tắt 🧩 ghép (quá dễ). */
  choGhep?: boolean;
  onTraLoi: (id: string, dung: boolean) => void;
  onXong?: (dung: number, tong: number, sai: string[]) => void;
  /** Nhãn nút cuối (mặc định "Xong"). */
  nhan?: string;
}) {
  const [i, setI] = useState(0);
  const [kq, setKq] = useState<boolean[]>([]);
  const [combo, setCombo] = useState(0);
  const [cd, setCd] = useState<CheDo>('ghep');
  const [cdEv, setCdEv] = useState<CheDoEV>('nghe');
  const [lan, setLan] = useState(0); // tăng khi làm lại để reset
  useEffect(() => {
    setCd(docCd<CheDo>(KEY_CD, 'ghep', ['ghep', 'go', 'noi']));
    setCdEv(docCd<CheDoEV>(KEY_EV, 'nghe', ['nghe', 'doc']));
  }, []);
  const cdThat: CheDo = epCheDo ?? (!choGhep && cd === 'ghep' ? 'go' : cd);
  const chonCd = (c: CheDo) => { setCd(c); try { localStorage.setItem(KEY_CD, c); } catch { /* bỏ qua */ } };
  const chonEv = (c: CheDoEV) => { setCdEv(c); try { localStorage.setItem(KEY_EV, c); } catch { /* bỏ qua */ } };

  const [danhSach, setDanhSach] = useState(ds);
  useEffect(() => { setDanhSach(ds); setI(0); setKq([]); setCombo(0); }, [ds]);

  if (!danhSach.length) return <div className={s.card}><div className={s.muted}>Không có câu nào ở đây.</div></div>;

  const xong = i >= danhSach.length;
  const dung = kq.filter(Boolean).length;
  if (xong) {
    const sai = danhSach.filter((_, k) => !kq[k]).map((m) => m.cau);
    const pct = Math.round((dung / danhSach.length) * 100);
    return (
      <div className={`${s.qCard} ${s.done}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.doneImg} src={`https://media.cuongthai.com/hoc/hinh/${pct >= 80 ? 'trophy' : pct >= 50 ? 'flexed-biceps' : 'seedling'}.webp`} alt="" />
        <div className={s.doneBig}>{dung}/{danhSach.length}</div>
        <div style={{ fontWeight: 700, fontSize: 18, margin: '4px 0 2px' }}>{pct >= 80 ? 'Tuyệt vời!' : pct >= 50 ? 'Khá lắm — ôn thêm chút nữa' : 'Bắt đầu là khó nhất — làm lại nhé'}</div>
        <div className={s.muted}>{tieuDe} · {pct}% · +{dung * 10} XP</div>
        {sai.length > 0 && (
          <div style={{ textAlign: 'left', marginTop: 16 }}>
            <div className={s.qLabel} style={{ marginBottom: 6 }}>Câu cần ôn lại ({sai.length})</div>
            {sai.map((c) => <CauNghe key={c.id} en={c.en} vi={c.vi} />)}
          </div>
        )}
        <div className={s.qActions} style={{ justifyContent: 'center' }}>
          {sai.length > 0 && (
            <button type="button" className={s.btnGhost} onClick={() => { setDanhSach(danhSach.filter((_, k) => !kq[k])); setI(0); setKq([]); setLan((x) => x + 1); }}>
              <RotateCcw size={15} /> Làm lại {sai.length} câu sai
            </button>
          )}
          <button type="button" className={s.btnGhost} onClick={() => { setI(0); setKq([]); setLan((x) => x + 1); }}><RotateCcw size={15} /> Làm lại cả lượt</button>
          {onXong && <button type="button" className={s.btn} onClick={() => onXong(dung, danhSach.length, sai.map((c) => c.id))}>{nhan ?? 'Xong'} <ArrowRight size={15} /></button>}
        </div>
      </div>
    );
  }

  const m = danhSach[i];
  return (
    <div className={s.sess}>
      <div className={s.sessTop}>
        <div className={s.sessBar}><i style={{ width: `${(i / danhSach.length) * 100}%` }} /></div>
        <span className={s.muted}>{i + 1}/{danhSach.length}</span>
        {combo >= 2 && <span className={s.combo}>🔥 x{combo}</span>}
      </div>
      {epCheDo ? null : m.kieu === 've' ? (
        <div className={s.modeRow}>
          {choGhep && <button type="button" className={`${s.modeBtn} ${cdThat === 'ghep' ? s.modeBtnOn : ''}`} onClick={() => chonCd('ghep')}><Puzzle size={14} /> Ghép mảnh</button>}
          <button type="button" className={`${s.modeBtn} ${cdThat === 'go' ? s.modeBtnOn : ''}`} onClick={() => chonCd('go')}><Keyboard size={14} /> Gõ</button>
          <button type="button" className={`${s.modeBtn} ${cdThat === 'noi' ? s.modeBtnOn : ''}`} onClick={() => chonCd('noi')}><Mic size={14} /> Nói</button>
        </div>
      ) : (
        <div className={s.modeRow}>
          <button type="button" className={`${s.modeBtn} ${cdEv === 'nghe' ? s.modeBtnOn : ''}`} onClick={() => chonEv('nghe')}><Ear size={14} /> Nghe (che chữ)</button>
          <button type="button" className={`${s.modeBtn} ${cdEv === 'doc' ? s.modeBtnOn : ''}`} onClick={() => chonEv('doc')}><BookOpen size={14} /> Đọc</button>
        </div>
      )}
      {m.kieu === 've'
        ? <CauVE key={`${m.cau.id}-${lan}-${cdThat}`} cau={m.cau} kho={kho} cd={cdThat} onTiep={(d) => { onTraLoi(m.cau.id, d); setKq((k) => [...k, d]); setCombo((c) => (d ? c + 1 : 0)); setI((x) => x + 1); }} />
        : <CauEV key={`${m.cau.id}-${lan}-${cdEv}`} cau={m.cau} kho={kho} cd={cdEv} onTiep={(d) => { onTraLoi(m.cau.id, d); setKq((k) => [...k, d]); setCombo((c) => (d ? c + 1 : 0)); setI((x) => x + 1); }} />}
    </div>
  );
}

/* ── Nhờ CuongMini xem ── */
function NutAi({ huong, cau, bai, onKq }: { huong: 'vi-en' | 'en-vi'; cau: Cau; bai: string; onKq: (k: AiKq) => void }) {
  const { isAuthenticated } = useLangUser();
  const [busy, setBusy] = useState(false);
  const [kq, setKq] = useState<AiKq | null>(null);
  const [err, setErr] = useState('');
  if (!isAuthenticated) return <div className={s.muted} style={{ marginTop: 8 }}>🔒 Đăng nhập để nhờ CuongMini xem câu của bạn.</div>;
  const hoi = async () => {
    setBusy(true); setErr('');
    try {
      const r = await api.post('/ielts/ai/cham-dich', { huong, vi: cau.vi, mau: [cau.en, ...(cau.alt ?? [])], bai, khung: cau.khung }, AI_TIMEOUT);
      const d = r.data?.data as { ketQua: AiKq | null; lyDo?: string };
      if (d?.ketQua) { setKq(d.ketQua); onKq(d.ketQua); } else setErr(d?.lyDo === 'ai_unavailable' ? 'CuongMini đang tạm nghỉ — thử lại sau.' : 'Chưa xem được, thử lại nhé.');
    } catch (e) {
      const m = (e as { response?: { data?: { message?: string } } })?.response;
      setErr(m?.data?.message || 'Không gửi được. Thử lại nhé.');
    } finally { setBusy(false); }
  };
  return (
    <>
      {!kq && <button type="button" className={s.chipBtn} disabled={busy} onClick={hoi} style={{ marginTop: 10 }}><Sparkles size={14} /> {busy ? 'CuongMini đang xem…' : 'Nhờ CuongMini xem câu của mình'}</button>}
      {err && <div className={s.loi} style={{ color: 'var(--lh-bad)' }}>{err}</div>}
      {kq && (
        <div className={s.ai}>
          <div style={{ fontWeight: 800, color: kq.dung ? 'var(--lh-good)' : 'var(--lh-bad)' }}>
            {kq.dung ? '✓ CuongMini: câu của bạn ĐÚNG — được tính điểm' : '✗ CuongMini: câu này chưa đúng'}
          </div>
          {kq.nhanXet.split('\n').filter(Boolean).map((p, k) => <p key={k}><Chu text={p} /></p>)}
          {kq.cauSua && <CauNghe en={kq.cauSua} vi="Câu CuongMini sửa cho bạn" />}
        </div>
      )}
    </>
  );
}

/* ── Việt → Anh ── */
function CauVE({ cau, kho, cd, onTiep }: { cau: Cau; kho: Cau[]; cd: CheDo; onTiep: (dung: boolean) => void }) {
  const [txt, setTxt] = useState('');
  const [chon, setChon] = useState<number[]>([]);
  const [kq, setKq] = useState<KetQuaCham | null>(null);
  const [aiDung, setAiDung] = useState(false);
  const [goi, setGoi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [diemPa, setDiemPa] = useState<number | null>(null);
  const { isAuthenticated } = useLangUser();
  const inp = useRef<HTMLInputElement>(null);
  useEffect(() => { if (cd === 'go') inp.current?.focus(); }, [cd]);

  const manh = useMemo(() => {
    const cua = manhGhep(cau.en);
    const co = new Set(cua.map((w) => w.toLowerCase()));
    const nhieu = xao(kho.filter((c) => c.id !== cau.id).flatMap((c) => manhGhep(c.en)).filter((w) => !co.has(w.toLowerCase())), hatTu(cau.id)).filter((w, k, a) => a.indexOf(w) === k).slice(0, Math.min(3, Math.max(1, Math.round(cua.length / 3))));
    return xao([...cua, ...nhieu], hatTu(`${cau.id}-m`));
  }, [cau, kho]);

  const baiLam = cd === 'ghep' ? chon.map((k) => manh[k]).join(' ') : txt;
  const kiem = (bai = baiLam) => {
    if (!bai.trim()) return;
    const r = cham(bai, cau);
    setKq(r);
    doc(cau.en);
  };

  const mic = useMicro({
    toiDaMs: 20_000,
    tuDung: { imMs: 1500 },
    onXong: async (blob, { coTieng }) => {
      if (!coTieng) { setErr('Chưa nghe thấy bạn nói — bấm micro rồi nói to câu tiếng Anh.'); return; }
      setBusy(true); setErr('');
      try {
        // Ưu tiên máy chấm phát âm (mọi tài khoản đã đăng nhập): vừa nghe ra chữ để chấm dịch, vừa có điểm phát âm.
        // Máy chấm tắt / hết lượt ⇒ lùi về chép lời Whisper (tài khoản Pro).
        let t = '';
        try {
          const wav = await blobToWav16k(blob);
          const fd = new FormData();
          fd.append('audio', wav, 'dich-noi.wav');
          fd.append('cau', cau.en);
          fd.append('giong', 'us');
          const r = await api.post('/ielts/ai/cham-phat-am', fd, { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
          const d = r.data?.data as { ketQua: { ngheRa: string; diem: { tong: number } } | null } | undefined;
          if (d?.ketQua) { t = d.ketQua.ngheRa || ''; setDiemPa(d.ketQua.diem.tong); }
        } catch { /* lùi xuống dưới */ }
        if (!t) {
          const r = await languageApi.transcribe({ audio: blob, languageCode: 'en' });
          t = r.data.data?.text ?? '';
        }
        setTxt(t.trim());
        if (t.trim()) kiem(t.trim()); else setErr('Máy chưa nghe ra chữ nào. Thử nói chậm và rõ hơn.');
      } catch (e) {
        const st = (e as { response?: { status?: number } })?.response?.status;
        setErr(st === 401 ? 'Đăng nhập để dùng chế độ Nói.' : 'Chưa nghe ra lời nói — thử lại hoặc chuyển sang Gõ.');
      } finally { setBusy(false); }
    },
  });

  const dung = !!kq && (kq.dung || aiDung);
  return (
    <div className={s.qCard}>
      <div className={s.qLabel}>Dịch sang tiếng Anh</div>
      <div className={s.qVi}>{cau.vi}</div>
      <span className={s.qKhung}>{cau.khung}</span>
      {cau.goi && !kq && (
        goi ? <div className={s.loi}>💡 <Chu text={cau.goi} /></div>
          : <button type="button" className={s.chipBtn} style={{ marginLeft: 8 }} onClick={() => setGoi(true)}>💡 Gợi ý từ</button>
      )}

      {cd === 'ghep' && (
        <>
          <div className={s.chipsDich}>
            {chon.length === 0 && <span className={s.muted} style={{ alignSelf: 'center' }}>Chạm các mảnh bên dưới theo đúng thứ tự tiếng Anh…</span>}
            {chon.map((k, j) => <button key={j} type="button" className={s.chip} disabled={!!kq} onClick={() => setChon(chon.filter((_, x) => x !== j))}>{manh[k]}</button>)}
          </div>
          <div className={s.chips}>
            {manh.map((w, k) => <button key={k} type="button" className={s.chip} disabled={chon.includes(k) || !!kq} onClick={() => setChon([...chon, k])}>{w}</button>)}
          </div>
        </>
      )}
      {cd === 'go' && (
        <input ref={inp} className={s.qInput} value={txt} disabled={!!kq} placeholder="Gõ câu tiếng Anh của bạn…" autoCapitalize="sentences" autoCorrect="off" spellCheck={false}
          onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { if (kq) onTiep(dung); else kiem(); } }} />
      )}
      {cd === 'noi' && (
        <div style={{ marginTop: 14 }}>
          {!isAuthenticated ? <div className={s.muted}>🔒 Đăng nhập để nói câu trả lời (máy chép lời rồi chấm). Hoặc chọn Gõ / Ghép mảnh.</div> : (
            <div className={s.qActions} style={{ marginTop: 0 }}>
              {mic.trangThai === 'ghi'
                ? <button type="button" className={`${s.btn}`} style={{ background: 'var(--lh-bad)' }} onClick={mic.dung}><Square size={15} /> Xong</button>
                : <button type="button" className={s.btn} disabled={busy || !!kq || mic.trangThai === 'mo'} onClick={() => { setErr(''); void mic.batDau(); }}><Mic size={16} /> {busy ? 'Đang nghe ra chữ…' : mic.trangThai === 'mo' ? 'Đang mở micro…' : 'Bấm rồi nói câu tiếng Anh'}</button>}
              {mic.trangThai === 'ghi' && <span className={s.meter}><i style={{ width: `${Math.round(mic.muc * 100)}%` }} /></span>}
            </div>
          )}
          {txt && <div className={s.loi}>Máy nghe ra: “<b>{txt}</b>”{diemPa != null && <> · phát âm <b>{diemPa}</b>/100</>}</div>}
          {(err || mic.loi) && <div className={s.loi} style={{ color: 'var(--lh-bad)' }}>{err || mic.loi}</div>}
        </div>
      )}

      {!kq ? (
        <div className={s.qActions}>
          {cd !== 'noi' && <button type="button" className={s.btn} disabled={!baiLam.trim()} onClick={() => kiem()}><Check size={16} /> Kiểm tra</button>}
          <button type="button" className={s.btnGhost} onClick={() => { setKq({ dung: false, gan: cau.en, manh: [], giong: 0, nhanXet: 'Bạn chọn xem đáp án — câu này sẽ quay lại trong phần ôn.' }); doc(cau.en); }}><Eye size={15} /> Không biết — xem đáp án</button>
        </div>
      ) : (
        <div className={`${s.fb} ${dung ? s.fbGood : s.fbBad}`}>
          <div className={s.fbHead}>{dung ? <><Check size={18} /> {kq.dung ? 'Chính xác!' : 'Đúng (CuongMini xác nhận)'}</> : <><X size={18} /> Chưa đúng</>}</div>
          {!kq.dung && kq.manh.length > 0 && (
            <div className={s.diff} aria-label="So với câu mẫu">
              {kq.manh.map((x, k) => <span key={k} className={x.loai === 'ok' ? s.dOk : x.loai === 'thieu' ? s.dThieu : s.dThua}>{x.tu}</span>)}
            </div>
          )}
          {!kq.dung && <div className={s.loi}><Chu text={kq.nhanXet} /></div>}
          <CauNghe en={kq.dung ? kq.gan : cau.en} vi={kq.dung ? undefined : 'Câu mẫu'} />
          {cau.alt?.length ? <div className={s.muted}>Cũng đúng: {cau.alt.join(' · ')}</div> : null}
          {cau.loi && !kq.dung && <div className={s.loi}>⚠️ Lỗi hay gặp: <Chu text={cau.loi} /></div>}
          {!kq.dung && baiLam.trim() && kq.nhanXet.indexOf('xem đáp án') < 0 && <NutAi huong="vi-en" cau={cau} bai={baiLam} onKq={(k) => setAiDung(k.dung)} />}
          <div className={s.qActions}><button type="button" className={s.btn} onClick={() => { stopAudio(); onTiep(dung); }}>Tiếp <ArrowRight size={16} /></button></div>
        </div>
      )}
    </div>
  );
}

/* ── Anh → Việt ── */
function CauEV({ cau, kho, cd, onTiep }: { cau: Cau; kho: Cau[]; cd: CheDoEV; onTiep: (dung: boolean) => void }) {
  const [chonK, setChonK] = useState<number | null>(null);
  const [tuGo, setTuGo] = useState(false);
  const [txt, setTxt] = useState('');
  const [aiKq, setAiKq] = useState<AiKq | null>(null);
  const [daHien, setDaHien] = useState(false);
  const opts = useMemo(() => {
    const khac = xao(kho.filter((c) => c.id !== cau.id && c.vi !== cau.vi), hatTu(`${cau.id}-ev`)).slice(0, 3).map((c) => c.vi);
    return xao([cau.vi, ...khac], hatTu(`${cau.id}-o`));
  }, [cau, kho]);
  useEffect(() => { doc(cau.en); }, [cau]);
  const daTra = chonK != null || !!aiKq;
  const dung = chonK != null ? opts[chonK] === cau.vi : !!aiKq?.dung;
  const anChu = cd === 'nghe' && !daTra && !daHien;
  return (
    <div className={s.qCard}>
      <div className={s.qLabel}>{cd === 'nghe' ? 'Nghe rồi chọn nghĩa' : 'Đọc rồi chọn nghĩa'}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '10px 0 4px', flexWrap: 'wrap' }}>
        <button type="button" className={s.btn} onClick={() => doc(cau.en)}><Volume2 size={17} /> Nghe</button>
        <button type="button" className={s.btnGhost} onClick={() => doc(cau.en, true)}><Snail size={16} /> Chậm</button>
        {anChu && <button type="button" className={s.chipBtn} onClick={() => setDaHien(true)}><Eye size={14} /> Hiện chữ</button>}
      </div>
      <div className={s.qVi} style={anChu ? { filter: 'blur(9px)', userSelect: 'none' } : undefined}>{cau.en}</div>
      {!tuGo ? (
        <div className={s.opts}>
          {opts.map((o, k) => {
            const cls = daTra && chonK != null ? (o === cau.vi ? s.optGood : k === chonK ? s.optBad : '') : '';
            return <button key={k} type="button" className={`${s.opt} ${cls}`} disabled={daTra} onClick={() => setChonK(k)}>{o}</button>;
          })}
        </div>
      ) : (
        <>
          <input className={s.qInput} value={txt} disabled={!!aiKq} onChange={(e) => setTxt(e.target.value)} placeholder="Gõ nghĩa tiếng Việt theo cách bạn hiểu…" />
          {!aiKq && txt.trim() && <NutAi huong="en-vi" cau={cau} bai={txt} onKq={setAiKq} />}
        </>
      )}
      {!daTra && (
        <div className={s.qActions}>
          <button type="button" className={s.chipBtn} onClick={() => setTuGo((x) => !x)}>{tuGo ? 'Quay lại chọn đáp án' : '✍️ Tự gõ nghĩa (CuongMini chấm)'}</button>
        </div>
      )}
      {daTra && (
        <div className={`${s.fb} ${dung ? s.fbGood : s.fbBad}`}>
          <div className={s.fbHead}>{dung ? <><Check size={18} /> Đúng!</> : <><X size={18} /> Chưa đúng</>}</div>
          <CauNghe en={cau.en} vi={cau.vi} phu={<span className={s.qKhung}>{cau.khung}</span>} />
          <div className={s.qActions}><button type="button" className={s.btn} onClick={() => { stopAudio(); onTiep(dung); }}>Tiếp <ArrowRight size={16} /></button></div>
        </div>
      )}
    </div>
  );
}

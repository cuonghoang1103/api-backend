'use client';

/**
 * 🗣️ Luyện phát âm — đọc một từ/câu cho sẵn, Azure chấm TỪNG TỪ và TỪNG ÂM
 * (`POST /ielts/ai/cham-phat-am`, phatAm.service.ts).
 *
 * Tên âm: chấm giọng Anh (en-GB) thì Azure trả điểm từng âm nhưng KHÔNG trả
 * tên âm (đo 03/10). Ta gắn tên từ phiên âm IPA của bài (`ipa`, mỗi từ một
 * cụm, cách nhau dấu cách) — CHỈ khi số âm tách được khớp số âm Azure trả;
 * lệch thì hiện chấm tròn không tên, không đoán. Giọng Mỹ thì Azure tự trả IPA.
 */
import { useEffect, useState } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import api from '@/lib/api';
import { play, AI_TIMEOUT } from './audio';
import { blobToWav16k } from './wav';
import { useMicro } from './useMicro';
import type { Block } from './types';
import s from './course.module.css';

type Am = { am: string; diem: number };
type Tu = { tu: string; diem: number; loi: string; am: Am[] };
type KetQua = { diem: { chinhXac: number; troiChay: number; dayDu: number; tong: number }; ngheRa: string; tu: Tu[] };

const ACCENT_KEY = 'sachhoc:phat-am-giong';
const GHI_TOI_DA_MS = 15_000;
const LOI: Record<string, string> = {
  chua_co_khoa: 'Máy chấm phát âm chưa được bật trên máy chủ.',
  het_luot_ngay: 'Hôm nay bạn đã chấm 150 lượt — mai luyện tiếp nhé.',
  het_luot_thang: 'Máy chấm phát âm đã hết lượt miễn phí của tháng này.',
  khong_nghe_thay: 'Chưa nghe rõ — đọc to, gần micro hơn và đọc đúng câu mẫu.',
  loi_may_cham: 'Máy chấm đang trục trặc, thử lại sau ít phút.',
};

/** Tách phiên âm thành âm: nhị trùng âm, tʃ/dʒ và nguyên âm dài (ː) là MỘT âm. */
const GHEP = ['eɪ', 'aɪ', 'ɔɪ', 'aʊ', 'əʊ', 'oʊ', 'ɪə', 'eə', 'ʊə', 'tʃ', 'dʒ'];
export function tachAm(ipa: string): string[] {
  const t = ipa.replace(/[ˈˌ./]/g, '');
  const out: string[] = [];
  for (let i = 0; i < t.length;) {
    const g = GHEP.find((x) => t.startsWith(x, i));
    let a = g ?? t[i];
    i += a.length;
    if (t[i] === 'ː') { a += 'ː'; i += 1; }
    out.push(a);
  }
  return out;
}

const mau = (d: number) => (d >= 80 ? s.paGood : d >= 60 ? s.paWarn : s.paBad);

function MotCau({ it, giong }: { it: { text: string; ipa: string; vi?: string }; giong: 'uk' | 'us' }) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [kq, setKq] = useState<KetQua | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const cham = async (blob: Blob) => {
    setBusy(true); setErr('');
    try {
      const wav = await blobToWav16k(blob);
      const fd = new FormData();
      fd.append('audio', wav, 'phat-am.wav');
      fd.append('cau', it.text);
      fd.append('giong', giong);
      const r = await api.post('/ielts/ai/cham-phat-am', fd, { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
      const d = r.data?.data as { ketQua: KetQua | null; lyDo?: string };
      if (d?.ketQua) setKq(d.ketQua); else setErr(LOI[d?.lyDo ?? ''] ?? 'Chưa chấm được, thử lại nhé.');
    } catch (e) {
      const m = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
      setErr(m?.status === 401 ? 'Đăng nhập để chấm phát âm.' : m?.data?.message || 'Không gửi được bản ghi. Thử lại nhé.');
    } finally { setBusy(false); }
  };

  // Nói xong (im 1,2 giây) là tự dừng và chấm luôn — không phải bấm Dừng.
  const mic = useMicro({
    toiDaMs: GHI_TOI_DA_MS,
    tuDung: { imMs: 1200 },
    onXong: (blob) => { setUrl(URL.createObjectURL(blob)); void cham(blob); },
  });
  const ghi = () => { setKq(null); setErr(''); setUrl(null); void mic.batDau(); };
  const err2 = err || mic.loi;

  // Gắn phiên âm của bài vào từ Azure trả về (bỏ qua từ "Insertion" — đọc thừa).
  const ipaTu = it.ipa.split(/\s+/).filter(Boolean);
  let vi = 0;
  const tu = (kq?.tu ?? []).map((w) => {
    const ipa = w.loi === 'Insertion' ? undefined : ipaTu[vi++];
    const ten = ipa ? tachAm(ipa) : [];
    const am = w.am.map((a, i) => ({ ...a, am: a.am || (ten.length === w.am.length ? ten[i] : '') }));
    return { ...w, am, ipa };
  });
  const yeu = tu.flatMap((w) => w.am.map((a) => ({ ...a, tu: w.tu }))).filter((a) => a.am && a.diem < 70).sort((a, b) => a.diem - b.diem)[0];

  return (
    <div className={s.paItem}>
      <div className={s.paHead}>
        <div className="min-w-0">
          <div className={s.paText}>{it.text}</div>
          <div className={s.quizSub}>/{it.ipa}/{it.vi ? ` · ${it.vi}` : ''}</div>
        </div>
        <div className={s.paBtns}>
          <button type="button" className={s.btnGhost} onClick={() => play({ text: it.text, voice: giong === 'us' ? 'us-nu' : 'uk-nu' })}>
            <Volume2 size={15} /> Nghe mẫu
          </button>
          {mic.trangThai === 'ghi' ? (
            <button type="button" className={s.recOn} onClick={mic.dung}><Square size={14} /> Xong</button>
          ) : (
            <button type="button" className={s.btn} onClick={ghi} disabled={busy || mic.trangThai === 'mo'}>
              <Mic size={15} /> {mic.trangThai === 'mo' ? 'Đang mở micro…' : busy ? 'Đang chấm…' : kq ? 'Đọc lại' : 'Đọc & chấm'}
            </button>
          )}
        </div>
      </div>
      {mic.trangThai === 'ghi' && (
        <div className={s.paLive}>
          <span className={s.paDot} /> Đang nghe — đọc to dòng trên, nói xong máy tự chấm
          <span className={s.paMeter}><i style={{ width: `${Math.round(mic.muc * 100)}%` }} /></span>
        </div>
      )}
      {err2 && <div className={`${s.feedback} ${s.bad}`}>{err2}</div>}
      {kq && (
        <div className={s.paResult}>
          <div className={s.paScores}>
            <span className={`${s.paTotal} ${mau(kq.diem.tong)}`}>{kq.diem.tong}</span>
            <span>Chính xác <b>{kq.diem.chinhXac}</b></span>
            <span>Trôi chảy <b>{kq.diem.troiChay}</b></span>
            <span>Đọc đủ <b>{kq.diem.dayDu}</b></span>
          </div>
          <div className={s.paWords}>
            {tu.map((w, i) => (
              <span key={i} className={`${s.paWord} ${w.loi === 'Omission' ? s.paOmit : mau(w.diem)}`} title={w.loi === 'Omission' ? 'Đọc thiếu từ này' : `${w.diem} điểm`}>
                <b>{w.tu}</b>
                {w.loi === 'Omission' ? <small>đọc thiếu</small> : w.loi === 'Insertion' ? <small>đọc thừa</small> : (
                  <span className={s.paPhones}>
                    {w.am.map((a, j) => <i key={j} className={mau(a.diem)} title={`${a.am ? `/${a.am}/ ` : ''}${a.diem} điểm`}>{a.am || '•'}</i>)}
                  </span>
                )}
              </span>
            ))}
          </div>
          {yeu && <div className={s.quizSub}>Âm cần sửa nhất: <b>/{yeu.am}/</b> trong “{yeu.tu}” ({yeu.diem} điểm). Bấm “Nghe mẫu”, để ý khẩu hình âm đó rồi đọc lại.</div>}
          {kq.ngheRa && <div className={s.quizSub}>Máy nghe ra: “{kq.ngheRa}”</div>}
          {url && <audio src={url} controls className={s.recAudio} />}
        </div>
      )}
    </div>
  );
}

export default function PhatAm({ b }: { b: Extract<Block, { t: 'phatam' }> }) {
  const [giong, setGiong] = useState<'uk' | 'us'>('uk');
  useEffect(() => { try { if (localStorage.getItem(ACCENT_KEY) === 'us') setGiong('us'); } catch { /* bỏ qua */ } }, []);
  const chon = (g: 'uk' | 'us') => { setGiong(g); try { localStorage.setItem(ACCENT_KEY, g); } catch { /* bỏ qua */ } };
  return (
    <div className={s.quiz}>
      <div className={s.quizTitle}>🗣️ {b.title ?? 'Luyện phát âm — máy chấm từng âm'}</div>
      <div className={s.quizSub}>
        {b.note ?? 'Bấm “Nghe mẫu”, rồi “Đọc & chấm” và đọc to đúng câu đó (tối đa 15 giây). Máy tô màu từng từ và từng âm: xanh là đúng, vàng là gần đúng, đỏ là cần sửa.'}
      </div>
      <div className={s.modeSwitch} role="tablist" aria-label="Chấm theo giọng">
        <button type="button" role="tab" aria-selected={giong === 'uk'} className={`${s.modeBtn} ${giong === 'uk' ? s.modeBtnOn : ''}`} onClick={() => chon('uk')}>🇬🇧 Giọng Anh (như bài học)</button>
        <button type="button" role="tab" aria-selected={giong === 'us'} className={`${s.modeBtn} ${giong === 'us' ? s.modeBtnOn : ''}`} onClick={() => chon('us')}>🇺🇸 Giọng Mỹ</button>
      </div>
      {b.items.map((it) => <MotCau key={`${giong}-${it.text}`} it={it} giong={giong} />)}
    </div>
  );
}

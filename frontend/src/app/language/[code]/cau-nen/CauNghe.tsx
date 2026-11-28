'use client';

/**
 * Một câu Anh BẤM LÀ NGHE (chạm chữ hoặc nút loa), nút 🐢 nghe chậm, và "🎙️ Nói theo" — ghi âm rồi chấm
 * phát âm từng từ bằng máy chấm sẵn có (`POST /ielts/ai/cham-phat-am`, Azure, giọng Mỹ). Dùng ở MỌI chỗ có
 * câu Anh của lộ trình (ví dụ, câu luyện, từ vựng, hội thoại, đoạn mẫu).
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Mic, Square, Volume2, Snail } from 'lucide-react';
import api from '@/lib/api';
import { play, AI_TIMEOUT, type Voice } from '@/components/sach-hoc/audio';
import { blobToWav16k } from '@/components/sach-hoc/wav';
import { useMicro } from '@/components/sach-hoc/useMicro';
import { useLangUser } from '@/components/language/primitives';
import { Chu } from './Chu';
import s from './caunen.module.css';

export const GIONG: Voice = 'us-nu';

type Tu = { tu: string; diem: number; loi: string };
type KetQua = { diem: { chinhXac: number; troiChay: number; dayDu: number; tong: number }; ngheRa: string; tu: Tu[] };
const LOI: Record<string, string> = {
  chua_co_khoa: 'Máy chấm phát âm chưa được bật trên máy chủ.',
  het_luot_ngay: 'Hôm nay bạn đã chấm hết lượt — mai luyện tiếp nhé.',
  het_luot_thang: 'Máy chấm phát âm đã hết lượt của tháng này.',
  khong_nghe_thay: 'Chưa nghe rõ — đọc to, gần micro hơn và đọc đúng câu mẫu.',
  loi_may_cham: 'Máy chấm đang trục trặc, thử lại sau ít phút.',
};
const mauDiem = (d: number) => (d >= 80 ? s.paG : d >= 60 ? s.paW : s.paB);
const mauTu = (d: number) => (d >= 80 ? s.paWordG : d >= 60 ? s.paWordW : s.paWordB);

/** Phát một câu tiếng Anh (khách chưa đăng nhập vẫn có giọng máy chủ qua tuyến công khai). */
export function doc(text: string, cham = false, onEnd?: () => void, voice: Voice = GIONG) {
  play({ text, voice, toc: cham ? 0.7 : 0.95, congKhai: true }, onEnd);
}

/** Bảng "Nói theo": ghi âm ⇒ chấm ⇒ tô màu từng từ. Gọi `onDiem` khi có điểm (để cộng XP / đánh dấu đã nhắc). */
export function NoiTheo({ text, onDiem }: { text: string; onDiem?: (d: number) => void }) {
  const { isAuthenticated } = useLangUser();
  const [busy, setBusy] = useState(false);
  const [kq, setKq] = useState<KetQua | null>(null);
  const [err, setErr] = useState('');
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const cham = async (blob: Blob) => {
    setBusy(true); setErr('');
    try {
      const wav = await blobToWav16k(blob);
      const fd = new FormData();
      fd.append('audio', wav, 'noi-theo.wav');
      fd.append('cau', text);
      fd.append('giong', 'us');
      const r = await api.post('/ielts/ai/cham-phat-am', fd, { headers: { 'Content-Type': 'multipart/form-data' }, ...AI_TIMEOUT });
      const d = r.data?.data as { ketQua: KetQua | null; lyDo?: string };
      if (d?.ketQua) { setKq(d.ketQua); onDiem?.(d.ketQua.diem.tong); } else setErr(LOI[d?.lyDo ?? ''] ?? 'Chưa chấm được, thử lại nhé.');
    } catch (e) {
      const m = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
      setErr(m?.status === 401 ? 'Đăng nhập để được chấm phát âm.' : m?.data?.message || 'Không gửi được bản ghi. Thử lại nhé.');
    } finally { setBusy(false); }
  };
  const mic = useMicro({
    toiDaMs: 15_000,
    tuDung: { imMs: 1200 },
    onXong: (blob, { coTieng }) => {
      if (!coTieng) { setErr('Mình chưa nghe thấy bạn nói. Bấm "Nói theo" rồi đọc to câu nhé.'); return; }
      setUrl(URL.createObjectURL(blob));
      void cham(blob);
    },
  });

  if (!isAuthenticated) return <div className={s.pa}>🔒 Đăng nhập để ghi âm và được chấm phát âm từng từ.</div>;
  const that = (kq?.tu ?? []).filter((w) => w.loi !== 'Insertion');
  const yeu = [...that].sort((a, b) => a.diem - b.diem)[0];
  return (
    <div className={s.pa}>
      <div className={s.paTop}>
        {mic.trangThai === 'ghi' ? (
          <button type="button" className={`${s.chipBtn} ${s.chipRec}`} onClick={mic.dung}><Square size={13} /> Xong</button>
        ) : (
          <button type="button" className={s.chipBtn} disabled={busy || mic.trangThai === 'mo'} onClick={() => { setKq(null); setErr(''); setUrl(null); void mic.batDau(); }}>
            <Mic size={14} /> {mic.trangThai === 'mo' ? 'Đang mở micro…' : busy ? 'Đang chấm…' : kq ? 'Nói lại' : 'Bắt đầu nói'}
          </button>
        )}
        {mic.trangThai === 'ghi' && <span className={s.muted}>Đang nghe… nói xong tự dừng <span className={s.meter}><i style={{ width: `${Math.round(mic.muc * 100)}%` }} /></span></span>}
        {kq && <span className={`${s.paScore} ${mauDiem(kq.diem.tong)}`}>{kq.diem.tong}</span>}
        {kq && <span className={s.muted}>Chính xác {kq.diem.chinhXac} · Trôi chảy {kq.diem.troiChay} · Đủ từ {kq.diem.dayDu}</span>}
      </div>
      {(err || mic.loi) && <div className={s.loi} style={{ color: 'var(--lh-bad)' }}>{err || mic.loi}</div>}
      {kq && (
        <>
          <div className={s.paWords}>
            {kq.tu.map((w, i) => (
              <span key={i} className={`${s.paWord} ${w.loi === 'Omission' ? s.paWordB : mauTu(w.diem)}`} title={w.loi === 'Omission' ? 'Đọc thiếu' : `${w.diem} điểm`}>
                {w.tu}{w.loi === 'Omission' ? ' (thiếu)' : ''}
              </span>
            ))}
          </div>
          {yeu && yeu.diem < 75 && <div className={s.loi}>Từ cần sửa nhất: <b>{yeu.tu}</b> ({yeu.diem} điểm) — bấm 🐢 nghe chậm, để ý âm cuối của từ (người Việt hay nuốt âm cuối), rồi nói lại.</div>}
          {kq.ngheRa && <div className={s.muted}>Máy nghe ra: “{kq.ngheRa}”</div>}
          {url && <audio src={url} controls style={{ marginTop: 8, width: '100%', maxWidth: 360 }} />}
        </>
      )}
    </div>
  );
}

/** Một dòng câu: chạm để nghe, 🐢 chậm, 🎙️ Nói theo. `vi` / `phu` hiện dưới. */
export function CauNghe({ en, vi, phu, voice, an, onNghe, onDiem, them }: {
  en: string; vi?: string; phu?: ReactNode; voice?: Voice;
  /** Che tiếng Anh (chế độ tự nhớ) — chạm vẫn nghe được. */
  an?: boolean;
  onNghe?: () => void; onDiem?: (d: number) => void; them?: ReactNode;
}) {
  const [on, setOn] = useState(false);
  const [noi, setNoi] = useState(false);
  const nghe = (cham = false) => { doc(en, cham, () => setOn(false), voice ?? GIONG); setOn(true); onNghe?.(); };
  return (
    <div className={`${s.cau} ${on ? s.cauOn : ''}`}>
      <button type="button" className={`${s.cauNut} ${on ? s.cauNutOn : ''}`} aria-label={`Nghe: ${en}`} onClick={() => nghe()}><Volume2 size={17} /></button>
      <div className={s.cauBody}>
        <button type="button" className={s.cauEn} onClick={() => nghe()} style={an ? { filter: 'blur(7px)' } : undefined}>{en}</button>
        {vi && <div className={s.cauVi}><Chu text={vi} /></div>}
        {phu && <div className={s.cauMeta}>{phu}</div>}
        <div className={s.cauTools}>
          <button type="button" className={s.chipBtn} onClick={() => nghe(true)}><Snail size={14} /> Chậm</button>
          <button type="button" className={s.chipBtn} onClick={() => setNoi((x) => !x)}><Mic size={14} /> Nói theo</button>
          {them}
        </div>
        {noi && <NoiTheo text={en} onDiem={onDiem} />}
      </div>
    </div>
  );
}

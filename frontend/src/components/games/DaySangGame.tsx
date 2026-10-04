'use client';

/**
 * Dãy sáng — luyện TRÍ NHỚ KHÔNG GIAN (kiểu bài Corsi block của tâm lý học nhận thức).
 *
 * Các ô lần lượt sáng kèm một nốt nhạc; người chơi bấm lại đúng thứ tự. Mỗi màn dãy
 * dài thêm một ô; lưới lớn dần 3×3 → 4×4 → 5×5 để không thể nhớ bằng "hình dạng"
 * quen thuộc. Cứ 4 màn có một màn ĐẢO NGƯỢC (bấm từ ô cuối về ô đầu) — bản đảo của
 * Corsi luyện trí nhớ LÀM VIỆC chứ không chỉ ghi nhớ thụ động.
 *
 * Điểm = tổng (độ dài dãy × 10, ×1,5 nếu đảo ngược) + thưởng nhanh. 3 mạng; sai thì
 * mất một mạng và chơi lại màn đó với dãy MỚI (dãy cũ người chơi đã thấy đáp án).
 * Cuối ván hiện "tầm nhớ" = dãy dài nhất đã làm đúng — con số người học theo dõi được.
 *
 * Hợp đồng GameProps: chỉ chơi, gọi onScore đúng một lần.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import type { GameProps } from './registry';
import s from './daySang.module.css';

type Pha = 'cho' | 'xem' | 'lam' | 'dung' | 'sai' | 'het';

const MANG = 3;
/** Ngũ cung C D E G A qua hai quãng tám — ô nào cũng có nốt riêng, nghe êm khi nối nhau. */
const NOT = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3, 784.0, 880.0, 1046.5, 1174.7, 1318.5];

const coLuoi = (man: number) => (man <= 5 ? 3 : man <= 11 ? 4 : 5);
const doDai = (man: number) => man + 2;
const daoNguoc = (man: number) => man % 4 === 0;

/** Dãy ngẫu nhiên, không lặp ô liền kề (sáng hai lần liền một ô thì mắt không phân biệt được). */
function taoDay(n: number, soO: number): number[] {
  const d: number[] = [];
  while (d.length < n) {
    const o = Math.floor(Math.random() * soO);
    if (o !== d[d.length - 1]) d.push(o);
  }
  return d;
}

export default function DaySangGame({ onScore, locale = 'vi' }: Partial<GameProps>) {
  const vi = locale === 'vi';
  const [man, setMan] = useState(1);
  const [mang, setMang] = useState(MANG);
  const [diem, setDiem] = useState(0);
  const [tamNho, setTamNho] = useState(0);
  const [pha, setPha] = useState<Pha>('cho');
  const [day, setDay] = useState<number[]>([]);
  const [sang, setSang] = useState<number | null>(null);
  const [daBam, setDaBam] = useState(0);
  const [loiO, setLoiO] = useState<number | null>(null);
  const [tat, setTat] = useState(() => { try { return localStorage.getItem('game:tieng') === '0'; } catch { return false; } });

  const ac = useRef<AudioContext | null>(null);
  const hen = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t0 = useRef(Date.now());
  const tBam = useRef(0);
  const daBao = useRef(false);

  const n = coLuoi(man);
  const soO = n * n;
  const nguoc = daoNguoc(man);

  const ngung = () => { for (const h of hen.current) clearTimeout(h); hen.current = []; };
  const sau = (ms: number, f: () => void) => { hen.current.push(setTimeout(f, ms)); };

  const keu = useCallback((tan: number, dai = 0.22, kieu: OscillatorType = 'sine', to = 0.16) => {
    if (tat) return;
    try {
      if (!ac.current) ac.current = new AudioContext();
      const c = ac.current;
      if (c.state === 'suspended') void c.resume();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = kieu;
      o.frequency.value = tan;
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(to, c.currentTime + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dai);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + dai + 0.02);
    } catch { /* không có âm thanh cũng chơi được */ }
  }, [tat]);

  /** Chiếu dãy của màn hiện tại. */
  const chieu = useCallback((m: number) => {
    ngung();
    const so = coLuoi(m) ** 2;
    const d = taoDay(doDai(m), so);
    setDay(d);
    setDaBam(0);
    setLoiO(null);
    setPha('xem');
    const bat = Math.max(300, 620 - m * 22);
    const nghi = 170;
    let t = 650;
    d.forEach((o) => {
      sau(t, () => { setSang(o); keu(NOT[o % NOT.length]!); });
      sau(t + bat, () => setSang(null));
      t += bat + nghi;
    });
    sau(t + 120, () => { setPha('lam'); tBam.current = Date.now(); });
  }, [keu]);

  // Vào game là chiếu màn 1; dọn mọi hẹn giờ + âm thanh khi rời.
  useEffect(() => {
    chieu(1);
    return () => { ngung(); void ac.current?.close().catch(() => {}); };
  }, [chieu]);

  const ketThuc = useCallback((d: number) => {
    setPha('het');
    if (daBao.current || !onScore) return;
    daBao.current = true;
    onScore(d, Math.round((Date.now() - t0.current) / 1000));
  }, [onScore]);

  const bam = (o: number) => {
    if (pha !== 'lam') return;
    const can = nguoc ? day[day.length - 1 - daBam] : day[daBam];
    keu(NOT[o % NOT.length]!, 0.18);
    setSang(o);
    sau(160, () => setSang((x) => (x === o ? null : x)));
    if (o !== can) {
      // Sai: rung ô sai, mất mạng, chơi lại màn với dãy mới.
      setLoiO(o);
      keu(130, 0.35, 'sawtooth', 0.12);
      const conLai = mang - 1;
      setMang(conLai);
      setPha('sai');
      if (conLai <= 0) sau(900, () => ketThuc(diem));
      else sau(1100, () => chieu(man));
      return;
    }
    const tiep = daBam + 1;
    setDaBam(tiep);
    if (tiep < day.length) return;
    // Xong dãy: cộng điểm, thưởng nhanh (dưới 0,6 giây mỗi ô là tối đa 50).
    const giayMoiO = (Date.now() - tBam.current) / 1000 / day.length;
    const thuong = Math.max(0, Math.round(50 - Math.max(0, giayMoiO - 0.6) * 40));
    const cong = Math.round(day.length * 10 * (nguoc ? 1.5 : 1)) + thuong;
    const moi = diem + cong;
    setDiem(moi);
    setTamNho((x) => Math.max(x, day.length));
    setPha('dung');
    [0, 1, 2].forEach((i) => sau(i * 90, () => keu(NOT[(i * 2 + 4) % NOT.length]!, 0.16, 'triangle', 0.12)));
    sau(900, () => { setMan(man + 1); chieu(man + 1); });
  };

  // Bàn phím: lưới 3×3 dùng 1-9 (bàn số); lưới lớn hơn bấm chuột/chạm.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (n !== 3) return;
      const k = Number(e.key);
      if (k >= 1 && k <= 9) bam(k - 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const doiTieng = () => { setTat((x) => { try { localStorage.setItem('game:tieng', x ? '1' : '0'); } catch { /* bỏ qua */ } return !x; }); };

  const nhan: Record<Pha, string> = vi
    ? { cho: '', xem: 'Ghi nhớ thứ tự…', lam: nguoc ? 'Bấm NGƯỢC lại — từ ô cuối về ô đầu' : 'Đến lượt bạn — bấm lại đúng thứ tự', dung: 'Chính xác!', sai: mang > 0 ? 'Sai rồi — xem lại dãy mới nhé' : 'Hết mạng', het: 'Hết ván' }
    : { cho: '', xem: 'Memorise the order…', lam: nguoc ? 'REVERSE — tap from last to first' : 'Your turn — repeat the order', dung: 'Correct!', sai: mang > 0 ? 'Wrong — watch a new sequence' : 'Out of lives', het: 'Game over' };

  return (
    <div className={s.goc} data-pha={pha}>
      <div className={s.hud}>
        <div className={s.o1}>
          <span className={s.nhanNho}>{vi ? 'Màn' : 'Level'}</span>
          <b>{man}</b>
        </div>
        <div className={s.o1}>
          <span className={s.nhanNho}>{vi ? 'Điểm' : 'Score'}</span>
          <b>{diem}</b>
        </div>
        <div className={s.o1}>
          <span className={s.nhanNho}>{vi ? 'Tầm nhớ' : 'Span'}</span>
          <b>{tamNho || '–'}</b>
        </div>
        <div className={s.tim} aria-label={`${mang} ${vi ? 'mạng' : 'lives'}`}>
          {Array.from({ length: MANG }, (_, i) => <Heart key={i} size={18} data-con={i < mang} />)}
        </div>
        <button type="button" className={s.nutTieng} onClick={doiTieng} aria-label={tat ? 'Bật tiếng' : 'Tắt tiếng'}>
          {tat ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div className={s.nhanPha} data-nguoc={nguoc && pha === 'lam'}>
        {nguoc && pha !== 'het' && <span className={s.huyHieu}><RotateCcw size={13} /> {vi ? 'Đảo ngược' : 'Reverse'}</span>}
        {nhan[pha]}
        {pha === 'lam' && <span className={s.tienDo}>{daBam}/{day.length}</span>}
      </div>

      <div className={s.ban} style={{ ['--n' as string]: n }}>
        {Array.from({ length: soO }, (_, o) => (
          <button
            key={`${n}-${o}`}
            type="button"
            className={s.o}
            style={{ ['--hue' as string]: (o * 360) / soO + 250 }}
            data-sang={sang === o}
            data-loi={loiO === o}
            disabled={pha !== 'lam'}
            onPointerDown={(e) => { e.preventDefault(); bam(o); }}
            aria-label={`${vi ? 'Ô' : 'Tile'} ${o + 1}`}
          />
        ))}
      </div>

      <p className={s.goiY}>
        {vi
          ? `Dãy ${doDai(man)} ô · lưới ${n}×${n}${n === 3 ? ' · bàn phím: phím số 1–9' : ''}`
          : `${doDai(man)}-tile sequence · ${n}×${n} grid${n === 3 ? ' · keys 1–9' : ''}`}
      </p>
    </div>
  );
}

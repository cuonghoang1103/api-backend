'use client';
/**
 * MÀN CHÀO MỖI NGÀY của CuongMini (05/10/2026).
 *
 * Người dùng: "lần đầu tiên trong ngày từ 5h sáng, khi ấn vào IELTS/JP/CH để học, robot hiện
 * to ra giữa màn hình, cute, chào mừng quay trở lại… cả chữ và giọng, QUAN TRỌNG là học
 * ngôn ngữ nào thì nói bằng ngôn ngữ ấy… thông báo chuỗi (pháo hoa, 3D)… báo cáo tiến độ
 * tóm gọn… rồi tự thu nhỏ về góc màn hình".
 *
 * - "Ngày" bắt đầu lúc 5:00 sáng giờ máy (học tới 1 giờ sáng vẫn tính hôm trước).
 * - Mỗi khoá chào riêng (IELTS, JP, CH mỗi khoá một lần/ngày) — nhớ ở localStorage.
 * - Lời chính bằng NGÔN NGỮ ĐANG HỌC (giọng của khoá), phụ đề tiếng Việt nhỏ bên dưới.
 * - Chuỗi ngày học lấy từ máy chủ (`GET /ielts/chuoi`), pháo hoa vẽ canvas 2D nhẹ.
 * - Kết thúc: cả khối thu nhỏ bay về góc dưới phải — chỗ robot nổi của app đứng.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Flame, Play, X, Trophy } from 'lucide-react';
import api from '@/lib/api';
import NhanVat3D, { type CamXuc } from './goi/NhanVat3D';
import { play, stopAudio, type Clip } from './audio';
import type { Voice } from './types';
import { ghiDaChao, tatChao } from './chaoNgay';
import s from './course.module.css';

type NgonNgu = 'en' | 'ja' | 'zh';
export type Chuoi = { chuoi: number; kyLuc: number; tongNgay: number; daHocHomNay: boolean; ngay: { day: string; viec: number }[] };

/* ── Lời chào theo ngôn ngữ đang học (+ phụ đề tiếng Việt) ── */
type Cau = { noi: string; vi: string };
function loiChao(nn: NgonNgu, gio: number): Cau {
  const buoi = gio < 11 ? 0 : gio < 18 ? 1 : 2;
  if (nn === 'ja') return [
    { noi: 'おはようございます！おかえりなさい。今日もいい一日を！', vi: 'Chào buổi sáng! Mừng bạn quay lại. Chúc bạn một ngày tốt lành!' },
    { noi: 'こんにちは！おかえりなさい。今日も一緒にがんばりましょう！', vi: 'Xin chào! Mừng bạn quay lại. Hôm nay mình cùng cố gắng nhé!' },
    { noi: 'こんばんは！おかえりなさい。今日もお疲れさまでした！', vi: 'Chào buổi tối! Mừng bạn quay lại. Hôm nay bạn vất vả rồi!' },
  ][buoi]!;
  if (nn === 'zh') return [
    { noi: '早上好！欢迎回来，祝你今天愉快！', vi: 'Chào buổi sáng! Mừng bạn quay lại, chúc bạn một ngày vui vẻ!' },
    { noi: '下午好！欢迎回来，今天我们一起加油吧！', vi: 'Chào buổi chiều! Mừng bạn quay lại, hôm nay mình cùng cố gắng nhé!' },
    { noi: '晚上好！欢迎回来，今天辛苦了！', vi: 'Chào buổi tối! Mừng bạn quay lại, hôm nay bạn vất vả rồi!' },
  ][buoi]!;
  return [
    { noi: 'Good morning! Welcome back. Have a wonderful day!', vi: 'Chào buổi sáng! Mừng bạn quay lại. Chúc bạn một ngày tuyệt vời!' },
    { noi: "Good afternoon! Welcome back. Let's learn something new today!", vi: 'Chào buổi chiều! Mừng bạn quay lại. Hôm nay học thêm điều mới nhé!' },
    { noi: 'Good evening! Welcome back. Great job showing up today!', vi: 'Chào buổi tối! Mừng bạn quay lại. Giỏi lắm vì vẫn đến học hôm nay!' },
  ][buoi]!;
}
function loiChuoi(nn: NgonNgu, c: Chuoi): Cau {
  // Hôm nay chưa học: chuỗi đang "treo" — học một bài là +1.
  const n = c.chuoi;
  const moi = c.daHocHomNay ? n : n + 1;
  if (n === 0) return nn === 'ja'
    ? { noi: '今日から新しい連続記録を始めましょう！', vi: 'Hôm nay mình bắt đầu một chuỗi mới nhé!' }
    : nn === 'zh' ? { noi: '今天开始新的连续记录吧！', vi: 'Hôm nay bắt đầu chuỗi ngày học mới nhé!' }
      : { noi: "Let's start a new streak today!", vi: 'Hôm nay mình bắt đầu một chuỗi mới nhé!' };
  const kyLuc = n > 1 && n >= c.kyLuc;
  if (nn === 'ja') return {
    noi: `${n}日連続で勉強しています！${c.daHocHomNay ? '' : `今日も一課やれば${moi}日になります。`}${kyLuc ? '新記録です！' : ''}`,
    vi: `Bạn đã học ${n} ngày liên tiếp!${c.daHocHomNay ? '' : ` Học thêm một bài hôm nay là thành ${moi} ngày.`}${kyLuc ? ' Kỷ lục mới!' : ''}`,
  };
  if (nn === 'zh') return {
    noi: `你已经连续学习${n}天了！${c.daHocHomNay ? '' : `今天再学一课就是${moi}天。`}${kyLuc ? '新纪录！' : ''}`,
    vi: `Bạn đã học ${n} ngày liên tiếp!${c.daHocHomNay ? '' : ` Học thêm một bài hôm nay là thành ${moi} ngày.`}${kyLuc ? ' Kỷ lục mới!' : ''}`,
  };
  return {
    noi: `You're on a ${n}-day streak!${c.daHocHomNay ? '' : ` One lesson today makes it ${moi}.`}${kyLuc ? ' A new record!' : ''}`,
    vi: `Bạn đã học ${n} ngày liên tiếp!${c.daHocHomNay ? '' : ` Học thêm một bài hôm nay là thành ${moi} ngày.`}${kyLuc ? ' Kỷ lục mới!' : ''}`,
  };
}
function loiTienDo(nn: NgonNgu, xong: number, tong: number): Cau {
  const pt = tong ? Math.round((xong / tong) * 100) : 0;
  if (nn === 'ja') return { noi: `全部で${tong}レッスンのうち、${xong}レッスンが終わりました。`, vi: `Bạn đã học xong ${xong}/${tong} bài (${pt}%).` };
  if (nn === 'zh') return { noi: `一共${tong}课，你已经学完了${xong}课。`, vi: `Bạn đã học xong ${xong}/${tong} bài (${pt}%).` };
  return { noi: `You've finished ${xong} of ${tong} lessons.`, vi: `Bạn đã học xong ${xong}/${tong} bài (${pt}%).` };
}
const TEN_NUT: Record<NgonNgu, string> = { en: "Let's go!", ja: 'はじめよう！', zh: '开始吧！' };

/* ── Pháo hoa canvas 2D ── */
function PhaoHoa({ ban }: { ban: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !ban || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (c.width = c.clientWidth * dpr), H = (c.height = c.clientHeight * dpr);
    type H2 = { x: number; y: number; vx: number; vy: number; song: number; mau: string; co: number };
    const hat: H2[] = [];
    const MAU = ['#f472b6', '#facc15', '#22d3ee', '#a78bfa', '#4ade80', '#fb923c', '#f87171'];
    const no = (x: number, y: number) => {
      const mau = MAU[Math.floor(Math.random() * MAU.length)]!;
      const n = 46 + Math.floor(Math.random() * 20);
      for (let i = 0; i < n; i++) {
        const g = (Math.PI * 2 * i) / n, v = (2.2 + Math.random() * 2.8) * dpr;
        hat.push({ x, y, vx: Math.cos(g) * v, vy: Math.sin(g) * v, song: 1, mau: Math.random() < 0.2 ? '#fff' : mau, co: (1.6 + Math.random() * 1.6) * dpr });
      }
    };
    let dem = 0, raf = 0;
    const ve = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      if (dem < 150 && dem % 22 === 0) no(W * (0.15 + Math.random() * 0.7), H * (0.12 + Math.random() * 0.35));
      for (const p of hat) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.045 * dpr; p.vx *= 0.985; p.vy *= 0.985; p.song -= 0.012;
        if (p.song <= 0) continue;
        ctx.globalAlpha = p.song;
        ctx.fillStyle = p.mau;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.co, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (let i = hat.length - 1; i >= 0; i--) if (hat[i]!.song <= 0) hat.splice(i, 1);
      dem++;
      if (dem < 320 || hat.length) raf = requestAnimationFrame(ve);
    };
    raf = requestAnimationFrame(ve);
    return () => cancelAnimationFrame(raf);
  }, [ban]);
  return <canvas ref={ref} className={s.chaoPhao} aria-hidden />;
}

export default function ChaoBuoiSang({ stage, nn, voice, tenKhoa, xong, tong, baiTiep, daHoc, onDong, onMoBai }: {
  stage: string; nn: NgonNgu; voice: Voice; tenKhoa: string;
  xong: number; tong: number;
  baiTiep: { id: string; title: string; ngay: string } | null;
  /** Vài bài học gần đây (tên) — tóm gọn "đã học". */
  daHoc: string[];
  onDong: () => void;
  onMoBai: (id: string) => void;
}) {
  const [chuoi, setChuoi] = useState<Chuoi | null>(null);
  const [camXuc, setCamXuc] = useState<CamXuc>('chao');
  const [buoc, setBuoc] = useState(0);
  const [thuNho, setThuNho] = useState(false);
  const [demSo, setDemSo] = useState(0);
  const mucRef = useRef(0);
  const xongRef = useRef(false);
  const gio = useMemo(() => new Date().getHours(), []);

  useEffect(() => { void api.get('/ielts/chuoi', { params: { stage } }).then((r) => setChuoi(r.data?.data ?? null)).catch(() => setChuoi({ chuoi: 0, kyLuc: 0, tongNgay: 0, daHocHomNay: false, ngay: [] })); }, [stage]);

  const cau = useMemo(() => (chuoi ? [loiChao(nn, gio), loiChuoi(nn, chuoi), loiTienDo(nn, xong, tong)] : []), [chuoi, nn, gio, xong, tong]);

  // Đếm số chuỗi chạy lên.
  useEffect(() => {
    if (!chuoi || buoc < 1) return;
    let n = 0;
    const t = setInterval(() => { n++; setDemSo(Math.min(n, chuoi.chuoi)); if (n >= chuoi.chuoi) clearInterval(t); }, Math.max(40, 600 / Math.max(1, chuoi.chuoi)));
    return () => clearInterval(t);
  }, [chuoi, buoc]);

  const dong = (moBai?: string) => {
    if (xongRef.current) return;
    xongRef.current = true;
    stopAudio();
    ghiDaChao(stage);
    setThuNho(true);
    window.setTimeout(() => { onDong(); if (moBai) onMoBai(moBai); }, 720);
  };

  // Đọc từng câu bằng giọng của khoá, chuyển bước theo câu; xong thì chờ 5 giây rồi tự thu nhỏ.
  useEffect(() => {
    if (!cau.length) return;
    const clips: Clip[] = cau.flatMap((c, i) => [...(i ? [{ text: '', pauseMs: 450 }] : []), { text: c.noi, voice, toc: 0.92 }]);
    let i = 0;
    play(clips, () => { if (!xongRef.current) window.setTimeout(() => dong(), 5000); }, {
      onClip: (k) => {
        const thu = clips.slice(0, k + 1).filter((c) => c.text).length - 1;
        if (thu !== i && thu >= 0) { i = thu; setBuoc(thu); setCamXuc(thu === 1 ? (chuoi && chuoi.chuoi > 0 ? 'tim' : 'vui') : thu === 2 ? 'noi' : 'chao'); }
      },
    });
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cau]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') dong(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tatHan = () => { tatChao(); dong(); };

  return (
    <div className={`${s.chao} ${thuNho ? s.chaoThuNho : ''}`} role="dialog" aria-modal="true" aria-label="Chào mừng quay lại">
      <PhaoHoa ban={chuoi && chuoi.chuoi > 0 && buoc >= 1 ? 1 : 0} />
      <div className={s.chaoKhoi}>
        <button type="button" className={s.chaoDong} onClick={() => dong()} aria-label="Đóng"><X size={18} /></button>
        <div className={s.chaoNhanVat}><NhanVat3D camXuc={camXuc} mucRef={mucRef} phaoSaoKey={buoc >= 1 && chuoi?.chuoi ? 1 : 0} /></div>
        <div className={s.chaoNoiDung}>
          <p className={s.chaoKhoa}>{tenKhoa}</p>
          {cau.length === 0 ? <p className={s.chaoCau}>…</p> : (
            <>
              <p className={s.chaoCau} lang={nn}>{cau[Math.min(buoc, cau.length - 1)]!.noi}</p>
              <p className={s.chaoVi}>{cau[Math.min(buoc, cau.length - 1)]!.vi}</p>
            </>
          )}
          {chuoi && (
            <div className={s.chaoHang}>
              <div className={s.chaoChuoi} data-chay={chuoi.chuoi > 0 || undefined}>
                <Flame size={30} />
                <b>{buoc >= 1 ? demSo : 0}</b>
                <span>{nn === 'ja' ? '日連続' : nn === 'zh' ? '天连续' : '-day streak'}<small>ngày liên tiếp{chuoi.kyLuc > 1 ? ` · kỷ lục ${chuoi.kyLuc}` : ''}</small></span>
                {chuoi.chuoi > 1 && chuoi.chuoi >= chuoi.kyLuc && <i className={s.chaoKyLuc}><Trophy size={12} /> Kỷ lục</i>}
              </div>
              <div className={s.chaoTuan} aria-label="14 ngày gần nhất">
                {chuoi.ngay.map((d, k) => <span key={d.day} data-co={d.viec > 0 || undefined} data-nay={k === chuoi.ngay.length - 1 || undefined} title={d.day} />)}
              </div>
            </div>
          )}
          <div className={s.chaoTom}>
            <div className={s.chaoVach}><i style={{ width: `${tong ? (xong / tong) * 100 : 0}%` }} /></div>
            <p>Đã học <b>{xong}/{tong}</b> bài{daHoc.length ? <> · gần đây: {daHoc.slice(0, 3).join(' · ')}</> : null}</p>
            {baiTiep && <p>Hôm nay: <b>{baiTiep.ngay}</b> — {baiTiep.title}</p>}
          </div>
          <div className={s.chaoNut}>
            {baiTiep && <button type="button" className={s.btn} onClick={() => dong(baiTiep.id)}><Play size={15} fill="currentColor" /> {TEN_NUT[nn]} <small>· học tiếp</small></button>}
            <button type="button" className={s.btnGhost} onClick={() => dong()}>Để sau</button>
            <button type="button" className={s.chaoTat} onClick={tatHan}>Tắt màn chào</button>
          </div>
        </div>
      </div>
    </div>
  );
}

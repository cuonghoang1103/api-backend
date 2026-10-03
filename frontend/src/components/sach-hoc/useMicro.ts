'use client';

/**
 * Ghi âm dùng chung cho Luyện nói (SpeakQ) và Luyện phát âm (PhatAm) — 03/10/2026.
 *
 * Gom các lỗi cũ về một chỗ:
 *  - Bấm "ghi" hai lần lúc micro đang mở ⇒ hai MediaRecorder, cái đầu không ai
 *    dừng ⇒ micro treo (chấm đỏ của trình duyệt không tắt). Nay có trạng thái
 *    'mo' (đang mở micro) và bấm thêm thì bỏ qua.
 *  - Rời bài lúc đang ghi ⇒ micro vẫn bật. Nay unmount là tắt micro, bỏ bản ghi.
 *  - Giọng mẫu còn đang đọc ⇒ bị thu vào bản ghi. Nay bắt đầu ghi là stopAudio().
 *  - Không biết micro đã bật chưa ⇒ nói sớm mất chữ đầu. Nay trạng thái 'ghi'
 *    chỉ bật khi MediaRecorder đã chạy, kèm mức âm lượng `muc` (0–1) để vẽ thanh.
 *  - `tuDung`: tự dừng khi đã nghe thấy giọng rồi im lặng `imMs` — phát âm câu
 *    ngắn không phải bấm Dừng, chấm ngay khi nói xong.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { stopAudio } from './audio';

export type TrangThaiMicro = 'nghi' | 'mo' | 'ghi';

export function useMicro(o: {
  onXong: (blob: Blob) => void;
  /** Tối đa bao lâu (ms) — hết thì tự dừng. */
  toiDaMs: number;
  /** Tự dừng sau khoảng im lặng này (ms) khi đã có tiếng nói; bỏ trống = chỉ dừng bằng tay. */
  tuDung?: { imMs: number };
}) {
  const [trangThai, setTrangThai] = useState<TrangThaiMicro>('nghi');
  const [muc, setMuc] = useState(0);
  const [loi, setLoi] = useState('');
  const r = useRef<{ mr?: MediaRecorder; stream?: MediaStream; ac?: AudioContext; raf?: number; hen?: ReturnType<typeof setTimeout>; huy?: boolean }>({});
  const opt = useRef(o);
  opt.current = o;
  const dangMo = useRef(false);

  const donDep = useCallback(() => {
    const x = r.current;
    if (x.raf) cancelAnimationFrame(x.raf);
    if (x.hen) clearTimeout(x.hen);
    x.stream?.getTracks().forEach((t) => t.stop());
    void x.ac?.close().catch(() => {});
    r.current = { mr: x.mr };
    setMuc(0);
  }, []);

  const dung = useCallback(() => {
    const mr = r.current.mr;
    if (mr && mr.state === 'recording') mr.stop();
  }, []);

  const batDau = useCallback(async () => {
    if (dangMo.current || r.current.mr?.state === 'recording') return;
    dangMo.current = true;
    stopAudio();
    setLoi('');
    setTrangThai('mo');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mr.onstop = () => {
        const huy = r.current.huy;
        donDep();
        setTrangThai('nghi');
        if (!huy && chunks.length) opt.current.onXong(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }));
      };
      // Đo âm lượng: vẽ thanh mức + phát hiện "đã nói xong".
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ac = new AC();
      const an = ac.createAnalyser();
      an.fftSize = 1024;
      ac.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      let daNoi = false;
      let mucCu = 0;
      let imTu = 0;
      const t0 = performance.now();
      const vong = () => {
        an.getFloatTimeDomainData(buf);
        let s = 0;
        for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
        const rms = Math.sqrt(s / buf.length);
        const m = Math.min(1, rms * 8);
        if (Math.abs(m - mucCu) > 0.05) { mucCu = m; setMuc(m); } // khỏi vẽ lại 60 lần/giây
        const td = opt.current.tuDung;
        if (td) {
          const now = performance.now();
          if (rms > 0.02) { daNoi = true; imTu = 0; }
          else if (daNoi && now - t0 > 600) {
            if (!imTu) imTu = now;
            if (now - imTu > td.imMs) { dung(); return; }
          }
        }
        r.current.raf = requestAnimationFrame(vong);
      };
      r.current = { mr, stream, ac, huy: false };
      mr.start();
      setTrangThai('ghi');
      r.current.raf = requestAnimationFrame(vong);
      r.current.hen = setTimeout(dung, opt.current.toiDaMs);
    } catch {
      donDep();
      setTrangThai('nghi');
      setLoi('Không mở được micro. Cho phép trình duyệt dùng micro rồi thử lại.');
    } finally {
      dangMo.current = false;
    }
  }, [donDep, dung]);

  // Rời bài / đổi câu khi đang ghi: tắt micro, bỏ bản ghi dở.
  useEffect(() => () => {
    r.current.huy = true;
    const mr = r.current.mr;
    if (mr && mr.state === 'recording') mr.stop();
    else donDep();
  }, [donDep]);

  return { trangThai, muc, loi, batDau, dung };
}

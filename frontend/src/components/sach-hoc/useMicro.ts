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
  /** `coTieng` = false khi suốt lượt ghi không có tiếng nói (bấm nhầm, im lặng) — bên gọi
   *  nên báo "chưa nghe thấy" thay vì gửi đi chấm: Azure chấm câu im lặng thành "đọc thiếu"
   *  từng từ, còn Whisper nghe im lặng hay bịa ra một câu (05/10/2026). */
  onXong: (blob: Blob, info: { coTieng: boolean }) => void;
  /** Tối đa bao lâu (ms) — hết thì tự dừng. */
  toiDaMs: number;
  /** Tự dừng sau khoảng im lặng này (ms) khi đã có tiếng nói; bỏ trống = chỉ dừng bằng tay. */
  tuDung?: { imMs: number };
  /** Nhận mức âm lượng (0–1) MỖI khung hình, không qua state — cho hình động (nhân vật, vòng sóng)
   *  khỏi vẽ lại cả cây React. Có cái này thì `muc` trả về luôn là 0. */
  onMuc?: (m: number) => void;
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
    opt.current.onMuc?.(0);
    setMuc(0);
  }, []);

  /** Dừng NGAY — dùng khi tự dừng (đã im 1,2 giây sau tiếng nói) hoặc hết giờ. */
  const dungNgay = useCallback(() => {
    const mr = r.current.mr;
    if (mr && mr.state === 'recording') mr.stop();
  }, []);
  /**
   * Người học bấm "Xong": ghi thêm ĐUÔI 0,4 giây rồi mới dừng (05/10/2026). Người dùng
   * thật đọc "plays, lives, reads" cả nghìn lần vẫn bị chấm "reads" sai, Đọc đủ 67 —
   * đo trên máy chấm prod: cắt mất đuôi chữ cuối cho ĐÚNG kết quả đó (giọng chuẩn bị cắt
   * đuôi: reads 0 điểm, Đọc đủ 67). Bấm Xong ngay lúc vừa nói xong là micro dừng giữa
   * âm cuối /dz/ đang phát — người Việt vốn đã hay nuốt âm cuối, app không được cắt thêm.
   */
  const keoDuoi = useRef(false);
  const dung = useCallback(() => {
    const mr = r.current.mr;
    if (!mr || mr.state !== 'recording' || keoDuoi.current) return;
    keoDuoi.current = true;
    setTimeout(() => { keoDuoi.current = false; dungNgay(); }, 400);
  }, [dungNgay]);

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
        if (!huy && chunks.length) opt.current.onXong(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }), { coTieng: khungTieng >= 6 });
      };
      // Đo âm lượng: vẽ thanh mức + phát hiện "đã nói xong".
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ac = new AC();
      const an = ac.createAnalyser();
      an.fftSize = 1024;
      ac.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      let daNoi = false;
      /** Số khung hình (~16ms) có tiếng — ≥ 6 (~0,1 giây) mới tính là đã nói, để tiếng gõ phím/click không lọt. */
      let khungTieng = 0;
      let mucCu = 0;
      let imTu = 0;
      const t0 = performance.now();
      const vong = () => {
        an.getFloatTimeDomainData(buf);
        let s = 0;
        for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
        const rms = Math.sqrt(s / buf.length);
        const m = Math.min(1, rms * 8);
        const cb = opt.current.onMuc;
        if (cb) cb(m);
        else if (Math.abs(m - mucCu) > 0.05) { mucCu = m; setMuc(m); } // khỏi vẽ lại 60 lần/giây
        if (rms > 0.02) khungTieng++;
        const td = opt.current.tuDung;
        if (td) {
          const now = performance.now();
          if (rms > 0.02) { daNoi = true; imTu = 0; }
          else if (daNoi && now - t0 > 600) {
            if (!imTu) imTu = now;
            if (now - imTu > td.imMs) { dungNgay(); return; }
          }
        }
        r.current.raf = requestAnimationFrame(vong);
      };
      r.current = { mr, stream, ac, huy: false };
      mr.start();
      setTrangThai('ghi');
      r.current.raf = requestAnimationFrame(vong);
      r.current.hen = setTimeout(dungNgay, opt.current.toiDaMs);
    } catch {
      donDep();
      setTrangThai('nghi');
      setLoi('Không mở được micro. Cho phép trình duyệt dùng micro rồi thử lại.');
    } finally {
      dangMo.current = false;
    }
  }, [donDep, dungNgay]);

  // Rời bài / đổi câu khi đang ghi: tắt micro, bỏ bản ghi dở.
  useEffect(() => () => {
    r.current.huy = true;
    const mr = r.current.mr;
    if (mr && mr.state === 'recording') mr.stop();
    else donDep();
  }, [donDep]);

  return { trangThai, muc, loi, batDau, dung };
}

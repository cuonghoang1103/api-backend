'use client';

/**
 * Khung React cho nhân vật 3D "CuongMini" (sanKhau3D.ts). three.js (~600 KB) chỉ được tải
 * khi cửa sổ Gọi gia sư mở — `import()` trong effect, không nằm trong gói của trang.
 * Máy không có WebGL (hoặc tải hỏng) ⇒ lùi về con robot SVG quen thuộc, cuộc gọi vẫn chạy.
 */
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import RobotAI from '@/components/academy/RobotAI';
import { dangPhatTieng } from '../audio';
import type { CamXuc, SanKhau } from './sanKhau3D';
import s from '../course.module.css';

export type { CamXuc };

export default function NhanVat3D({ camXuc, mucRef, phaoSaoKey }: {
  camXuc: CamXuc;
  /** Mức micro 0–1 — cập nhật mỗi khung hình từ useMicro({ onMuc }), không qua state. */
  mucRef: MutableRefObject<number>;
  /** Đổi giá trị ⇒ bung pháo sao một lần (điểm cao). */
  phaoSaoKey?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sk = useRef<SanKhau | null>(null);
  const camRef = useRef(camXuc);
  camRef.current = camXuc;
  const [hong, setHong] = useState(false);
  const [san, setSan] = useState(false);

  useEffect(() => {
    let huy = false;
    const giam = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    import('./sanKhau3D')
      .then((m) => {
        if (huy || !canvasRef.current) return;
        sk.current = m.taoSanKhau(canvasRef.current, {
          giamChuyenDong: giam,
          docMucMic: () => mucRef.current,
          docDangNoi: dangPhatTieng,
        });
        sk.current.datCamXuc(camRef.current);
        setSan(true);
      })
      .catch(() => { if (!huy) setHong(true); });
    return () => { huy = true; sk.current?.huy(); sk.current = null; };
  }, [mucRef]);

  useEffect(() => { sk.current?.datCamXuc(camXuc); }, [camXuc]);
  useEffect(() => { if (phaoSaoKey) sk.current?.phaoSao(); }, [phaoSaoKey]);

  if (hong) {
    return (
      <div className={s.goiNhanVatLui}>
        <RobotAI size={150} dangNghi={camXuc === 'nghi'} />
      </div>
    );
  }
  return <canvas ref={canvasRef} className={`${s.goiNhanVat} ${san ? s.goiNhanVatSan : ''}`} aria-hidden="true" />;
}

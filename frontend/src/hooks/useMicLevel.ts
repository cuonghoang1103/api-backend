'use client';

/**
 * Đo BIÊN ĐỘ GIỌNG THẬT của micro, để hoạt hình chạy theo tiếng nói.
 *
 * ⚠️ VÌ SAO ĐÁNG LÀM. Vòng sáng trong màn gọi trước đây đập theo ĐỒNG HỒ:
 * trông y hệt nhau dù người dùng đang nói hay đang im. Người ta nhận ra
 * điều đó gần như ngay lập tức, và lúc đó nó thành đồ trang trí chứ không
 * còn là phản hồi — tệ hơn không có gì, vì nó khiến người dùng không biết
 * micro có nghe thấy mình không.
 *
 * Đo NĂNG LƯỢNG (RMS), không đo đỉnh: đỉnh nhảy loạn theo từng phụ âm bật
 * hơi nên hình giật, còn RMS cho đường mượt mà vẫn bám sát giọng.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useMicLevel(): {
  level: number;
  batDau: (stream: MediaStream) => void;
  dungLai: () => void;
} {
  const [level, setLevel] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const khungRef = useRef(0);
  const muotRef = useRef(0);

  const dungLai = useCallback(() => {
    cancelAnimationFrame(khungRef.current);
    void ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    muotRef.current = 0;
    setLevel(0);
  }, []);

  const batDau = useCallback((stream: MediaStream) => {
    dungLai();
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const phanTich = ctx.createAnalyser();
    phanTich.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(phanTich);
    const dem = new Float32Array(phanTich.fftSize);

    const vong = (): void => {
      phanTich.getFloatTimeDomainData(dem);
      let tong = 0;
      for (let i = 0; i < dem.length; i += 1) tong += dem[i]! * dem[i]!;
      const rms = Math.sqrt(tong / dem.length);
      // Lên nhanh, xuống chậm: giọng bật lên phải thấy ngay, còn tắt dần thì
      // mắt chịu được. Ngược lại là hình nhấp nháy theo từng âm tiết.
      muotRef.current = rms > muotRef.current
        ? muotRef.current + (rms - muotRef.current) * 0.6
        : muotRef.current + (rms - muotRef.current) * 0.12;
      setLevel(muotRef.current);
      khungRef.current = requestAnimationFrame(vong);
    };
    khungRef.current = requestAnimationFrame(vong);
  }, [dungLai]);

  useEffect(() => dungLai, [dungLai]);
  return { level, batDau, dungLai };
}

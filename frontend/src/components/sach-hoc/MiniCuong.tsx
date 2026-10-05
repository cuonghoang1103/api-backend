/**
 * CuongMini THU NHỎ cho khung gia sư (05/10/2026) — người dùng: "giao diện khung AI
 * gia sư làm đẹp và cute hơn, 3D hay gì đó". Dựng bằng CSS thuần (khối đầu bóng có
 * chiều sâu, kính, mắt phát sáng biết chớp, ăng-ten, bồng bềnh) — KHÔNG dùng three.js:
 * khung gia sư luôn mở cạnh bài, phải nhẹ trên mọi máy. Sân khấu 3D thật chỉ ở cuộc gọi.
 *
 * `nghi`: đang soạn câu trả lời → mắt thành ba chấm chạy. Tôn trọng prefers-reduced-motion.
 */
import s from './course.module.css';

export function MiniCuong({ size = 44, nghi = false }: { size?: number; nghi?: boolean }) {
  return (
    <span className={s.mcBoc} style={{ ['--mc' as string]: `${size}px` }} data-nghi={nghi || undefined} aria-hidden="true">
      <span className={s.mcBay}>
        <span className={s.mcAngTen}><i /></span>
        <span className={s.mcDau}>
          <span className={s.mcKinh}>
            {nghi ? (
              <span className={s.mcNghi}><i /><i /><i /></span>
            ) : (
              <>
                <span className={s.mcMat} />
                <span className={s.mcMat} />
              </>
            )}
            <span className={s.mcMieng} />
          </span>
          <span className={s.mcMa} />
          <span className={s.mcMa} data-phai="" />
        </span>
      </span>
      <span className={s.mcBong} />
    </span>
  );
}

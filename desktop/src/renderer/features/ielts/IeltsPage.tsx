/**
 * IELTS — mục RIÊNG trên thanh bên (03/10/2026), không còn nằm trong Ngoại ngữ.
 *
 * Dùng lại nguyên các trang IELTS của web (frontend/src/app/language/[code]/ielts):
 *   /ielts            → khoá 15 ngày (video, phát âm, gia sư, bài kiểm tra)
 *   /ielts/phong-thi  → Phòng thi thử 3 phần
 *   /ielts/luyen-them → Kho luyện thêm 4 chặng
 * Mọi link `/language/en/ielts…` trong mã web được shim đổi sang `/ielts…`
 * (`doiDuongApp` trong shims/next-navigation.tsx) nên bấm đâu cũng ở lại mục này.
 *
 * Chủ đề: CSS IELTS đổi màu theo `html.theme-dark` của WEB — `VoWeb` (TrangWeb.tsx)
 * tự đặt lớp đó cho MỌI cây web khi app tối (`useLopToiWeb`).
 */
import { TrangWebTheoTuyen } from '../web/TrangWeb';

export function IeltsPage() {
  // Khung KHÔNG cuộn mang container `ctnoidung`: CSS khoá học đo bề rộng VÙNG NỘI
  // DUNG (thanh bên app ăn ~220px) thay vì cửa sổ. Không cuộn để lớp phủ fixed bên
  // trong (ngăn kéo gia sư, cửa sổ gọi gia sư) vẫn đứng yên khi trang cuộn.
  return (
    <div className="ct-ielts-khung">
      <TrangWebTheoTuyen ten="IELTS" />
    </div>
  );
}

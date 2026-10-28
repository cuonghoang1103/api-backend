'use client';
/** Trang /os-lab: mọi mô phỏng của khoá "Operating Systems for Developers" ở một chỗ, mở thẳng bằng ?sim=…&preset=…&lang=…
 *  Khung trang dùng chung với /cpu-lab — xem components/labs/LabGallery.tsx (28/10/2026). */
import LabGallery from '../labs/LabGallery';

export default function OsLabGallery() {
  return (
    <LabGallery ns="os-lab" copy={{
      eyebrowEn: 'Operating Systems for Developers · Visual lab', eyebrowVi: 'Operating Systems for Developers · Phòng lab trực quan',
      titleEn: 'See the operating system work', titleVi: 'Nhìn thấy hệ điều hành làm việc',
      leadEn: 'Every idea in the course you cannot see — scheduling, races, page faults, the stack — as a simulation you can play, pause, step and change. Then measure the same thing for real in the lab container.',
      leadVi: 'Mọi ý tưởng trong khoá mà mắt thường không thấy — lập lịch, race condition, lỗi trang, stack — thành mô phỏng bạn chạy, dừng, đi từng bước và thay đổi được. Rồi đo đúng thứ đó bằng thật trong container phòng lab.',
      links: [['← Course', '← Khoá học', '/courses/operating-systems-for-developers']],
      first: 'process',
    }} />
  );
}

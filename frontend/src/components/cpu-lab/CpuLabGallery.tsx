'use client';
/** Trang /cpu-lab — "Máy tính từ số 0": sáu mô phỏng theo đúng thứ tự học, dùng chung khung với /os-lab. */
import LabGallery from '../labs/LabGallery';

export default function CpuLabGallery() {
  return (
    <LabGallery ns="cpu-lab" copy={{
      eyebrowEn: 'CSI104 · CEA201 · Visual lab', eyebrowVi: 'CSI104 · CEA201 · Phòng lab trực quan',
      titleEn: 'A computer from zero', titleVi: 'Máy tính từ số 0',
      leadEn: 'Electricity → bit → number → text → instruction → CPU → program. Six simulations in learning order: flip the bits yourself, build an adder from gates, write a program for a real (tiny) von Neumann CPU and watch every fetch–decode–execute step, then follow real gcc output down to the bytes.',
      leadVi: 'Dòng điện → bit → số → chữ → lệnh → CPU → chương trình. Sáu mô phỏng theo đúng thứ tự học: tự bật tắt từng bit, dựng bộ cộng từ cổng logic, viết chương trình cho một CPU von Neumann thật (tí hon) và xem từng bước nạp–giải mã–thực thi, rồi lần theo output thật của gcc xuống tới từng byte.',
      links: [
        ['CSI104 · Start from zero', 'CSI104 · Bắt đầu từ số 0', '/courses/introduction-to-computer-science/learn?lessonSlug=csi104-0-5-bat-dau-tu-so-0'],
        ['CEA201', 'CEA201', '/courses/computer-organization-and-architecture'],
      ],
      first: 'bits',
      numbered: true,
    }} />
  );
}

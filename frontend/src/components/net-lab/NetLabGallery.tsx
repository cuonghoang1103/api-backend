'use client';
/** Trang /net-lab — phòng lab mạng của khoá Networking for Developers: bốn mô phỏng theo thứ tự học, chung khung với /cpu-lab. */
import LabGallery from '../labs/LabGallery';

export default function NetLabGallery() {
  return (
    <LabGallery ns="net-lab" copy={{
      eyebrowEn: 'Networking for Developers · Visual lab', eyebrowVi: 'Networking for Developers · Phòng lab trực quan',
      titleEn: 'See the network work', titleVi: 'Nhìn thấy mạng làm việc',
      leadEn: 'A packet is just bytes in envelopes. Follow one real request from curl to nginx byte by byte, watch a switch learn and ARP find a MAC, see the kernel pick the right socket out of many on port 80, and find out where the milliseconds go when you press Enter. Every number comes from the course’s Docker lab or a real curl run — anything computed is labelled.',
      leadVi: 'Một gói tin chỉ là byte nằm trong các lớp phong bì. Theo một request thật từ curl tới nginx từng byte, xem công tắc học cổng và ARP tìm ra MAC, thấy nhân chọn đúng socket giữa nhiều socket cùng cổng 80, và biết từng mili-giây đi đâu khi bạn bấm Enter. Mọi con số lấy từ lab Docker của khoá hoặc lần chạy curl thật — thứ gì tính ra đều có nhãn.',
      links: [
        ['Networking for Developers', 'Networking for Developers', '/courses/networking-for-developers'],
      ],
      first: 'encap',
      numbered: true,
    }} />
  );
}

/**
 * Networking for Developers — Chương 14 (MỚI 14/11/2026): Mạng thực chiến — Wi-Fi, mạng bị chặn, VPN & đường hầm.
 * Sinh ra từ câu hỏi thật của chủ kênh (Wi-Fi trường đăng ký theo MAC, mạng trường chặn web/hotspot/game). Lab: "Wi-Fi trường trong một
 * hộp" (lab/moi-truong/truong.yml, project nft) — bash lab/code/dung-output-ch14.sh. Đã soạn: 14.1, 14.2. Dàn ý 14.3–14.7 (SSH khi cổng 22
 * bị chặn, VPN, chia sẻ mạng & hotspot, LAN nhà/ký túc xá, lab + quiz chương) ở video-bai-giang/KE-HOACH-NETWORKING.md mục "Ch14".
 * Chương mới ⇒ title chương là neo của seeder từ nay: KHÔNG đổi title, KHÔNG đổi slug bài đầu (netdev-14-1-wifi-truong-mac).
 */
import b141 from './bai/140-wifi-truong.mjs';
import b142 from './bai/141-mang-truong-chan.mjs';

export default {
  title: 'Chapter 14 — Networking in real life: Wi-Fi, blocked networks, VPNs and tunnels|||Chương 14 — Mạng thực chiến: Wi-Fi, mạng bị chặn, VPN & đường hầm',
  description: 'Mạng bạn gặp hằng ngày: Wi-Fi trường bắt đăng nhập và đăng ký theo MAC ("địa chỉ Wi-Fi riêng" làm MAC đổi), mạng chặn trang web/game/SSH bằng DNS, SNI, cổng, UDP, phát hiện chia sẻ mạng bằng TTL — mỗi cơ chế đo trên lab "Wi-Fi trường trong một hộp", kèm góc kẻ xấu (chép MAC, Wi-Fi giả, ARP giả mạo) và cách vẫn làm việc được trong mạng bị chặn.',
  lessons: [b141, b142],
};

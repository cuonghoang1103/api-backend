/**
 * Chương 11 — Log mạng: router, DNS, tường lửa, gói tin, VPN (soạn chi tiết 24/11/2026, agent lgz). Bài tách ở ./s11/.
 * Lệnh + output thật: ./_ma.mjs — sinh từ ./_demo/s11/ (bash _demo/s11/chay-s11.bash, ~25 phút): một LAN "nhà" ảo bằng KVM trong container lgz-c11
 * (router OpenWrt 25.12.6 x86-64 thật — dnsmasq, hostapd + mac80211_hwsim, LuCI/dropbear, miniupnpd, fw4; lab7/keodo Ubuntu 24.04 đĩa Ch7–8; android-7f3a;
 * Windows Server 2025 bản đánh giá cài không người ngồi — cong-cu/win-cai.bash), AdGuard Home v1.0.0 trong Docker, tshark 4.2.2, WireGuard, OpenVPN 2.6.19.
 * Tệp lệnh đuôi .bash chạy bằng _demo/s11/cong-cu/chay-vm.py (tiền tố @wrt/@android/@keodo/@win/@host, dòng "!" chạy ẩn); chay-demo.py không chạy chúng.
 */
import L111 from './s11/log-11-1-router-wifi.mjs';
import L112 from './s11/log-11-2-dns.mjs';
import L113 from './s11/log-11-3-firewall-windows.mjs';
import L114 from './s11/log-11-4-ufw-iptables.mjs';
import L115 from './s11/log-11-5-goi-tin.mjs';
import L116 from './s11/log-11-6-vpn.mjs';
import L117 from './s11/log-11-7-lab.mjs';
import L118 from './s11/log-11-8-quiz.mjs';

export default { lessons: [L111, L112, L113, L114, L115, L116, L117, L118] };

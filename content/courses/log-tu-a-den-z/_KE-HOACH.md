# Kế hoạch soạn khoá `log-tu-a-den-z` — Đọc & làm chủ log từ A–Z

Khung dựng 20/11/2026: `content/courses/log-tu-a-den-z.mjs` (prefix bài `log-`, 19 phần = Mục 0 + 18 chương, 143 bài).
Ảnh bìa: `scripts/covers/log-tu-a-den-z.png` (logo tự vẽ `scripts/icons/log-lines.svg`, mục trong `scripts/course-cover-offline.mjs`) — **chưa đẩy R2**.
Category `devops` (DevOps & Vận hành), level `BEGINNER`.

**Yêu cầu của người dùng (SV SE năm 3, chưa đi làm):** "dạy về log server, check log… từ cơ bản đến nâng cao, toàn quyền kiểm
soát hệ thống; trên Windows (Event Viewer, cmd), web, mạng, và mọi thứ khác; giới thiệu rồi dạy thật kỹ, không thiếu gì, chuyên
sâu, thực hành, để học, biết hết và dùng được khi đi làm".

**Quy trình soạn:** theo `content/courses/docker/_HOP-DONG.md` (slide, đào sâu, 🧪/🗂/📌, `.pitfall`, quiz có giải thích, EN song
song) + chuẩn chung mọi khoá: liên tưởng đời thường, tình huống thật hằng ngày, góc hacker + cách phòng, lab chạy trên máy thật,
mỗi chương có lab + quiz. Khi soạn một chương: thay phần tử trong `sections` bằng tệp chương thật `log-tu-a-den-z/sNN-*.mjs`,
**GIỮ NGUYÊN slug bài và title chương** (seeder neo bằng chúng). Mục 0 hai bài "Bắt đầu tại đây" theo §4b hợp đồng Docker.

**Trục khoá:** ĐỌC và ĐIỀU TRA log trên mọi nguồn. Phần khoá khác đã dạy SÂU (VIẾT log trong app, cấu hình nginx, nftables, viết
quy tắc Sigma, vận hành SIEM, điều tra số…) thì bài ở đây chỉ ở mức "dùng cho log" + dòng `↪ Đã dạy sâu: /courses/<slug> › <bài>`.

---

## 1. Bảng phủ chủ đề → bài

| Chủ đề bắt buộc | Bài (slug) |
|---|---|
| Log là gì, vì sao, lịch sử, sự cố thật | `log-0-8-bat-dau-tai-day`, `log-0-9-bat-dau-hoc-xong`, `log-1-1-log-la-gi` |
| Mức log | `log-1-3-muc-log` |
| Định dạng (syslog 3164/5424, JSON, logfmt, CEF, EVTX, journal) | `log-1-4-dinh-dang`, `log-10-8-log-cau-truc` |
| Thời gian, múi giờ, NTP, lệch đồng hồ | `log-1-5-thoi-gian`, `log-1-7-lab` |
| Bản đồ nguồn log | `log-1-6-ban-do-nguon` |
| Đạo đức / pháp lý khi đọc log | `log-0-2-dao-duc-phap-ly` |
| Event Viewer từng nhánh | `log-3-1-tong-quan`, `log-3-2-doc-su-kien`, `log-3-3-nhanh-ung-dung`, `log-3-4-loc-luu`, `log-3-5-kich-thuoc-luu-tru` |
| 4624/4625/4634 (+4647, Logon Type) | `log-4-1-dang-nhap` |
| 4672/4720/4740 (+4722/4725/4726/4732/4738/4767) | `log-4-2-tai-khoan-dac-quyen` |
| 1102 (+104/4719/4616) | `log-4-3-xoa-log-chinh-sach`, `log-14-4-xoa-dau-vet` |
| 41/6008 (+6005/6006/1074/6013/BugCheck) | `log-4-4-tat-may` |
| 7034/7036/1000/1001 (+7040/7045/1026) | `log-4-5-dich-vu-ung-dung` |
| 4688, tác vụ hẹn giờ, PowerShell 4103/4104 | `log-4-6-tien-trinh-tac-vu` |
| RDP / truy cập từ xa | `log-4-7-rdp-tu-xa` |
| Defender, Windows Update | `log-4-8-defender-update`, `log-3-7-log-van-ban` |
| Reliability Monitor | `log-3-6-reliability-monitor` |
| PowerShell Get-WinEvent / FilterHashtable / XPath | `log-5-1-get-winevent`, `log-5-2-filterhashtable`, `log-5-3-xpath-xml` |
| wevtutil, cmd | `log-5-4-wevtutil-cmd` |
| Bật audit policy | `log-5-5-audit-policy` |
| Sysmon | `log-5-6-sysmon` |
| Đọc log máy khác / WEF | `log-5-7-tu-xa-wef` |
| macOS Console, `log show/stream`, predicate | `log-6-1` … `log-6-5` |
| journald / journalctl chuyên sâu | `log-7-1-journald-luu`, `log-7-2-journalctl-loc`, `log-7-3-journalctl-xuat`, `log-7-4-journald-cau-hinh` |
| dmesg / nhân / OOM | `log-7-5-kernel-dmesg`, `log-7-6-lab` |
| /var/log, wtmp/btmp | `log-8-1-var-log` |
| syslog / rsyslog | `log-8-2-rsyslog` |
| auth.log / secure | `log-8-3-auth-log` |
| auditd | `log-8-4-auditd` |
| logrotate | `log-8-5-logrotate` |
| DevTools Console / Network / HAR | `log-9-1-console`, `log-9-2-network`, `log-9-3-har`, `log-9-4-net-export`, `log-9-5-loi-nguoi-dung` |
| Mã trạng thái HTTP | `log-10-1-ma-trang-thai` |
| nginx / Apache access-error (+ IIS) | `log-10-2-nginx-access-error`, `log-10-3-apache-iis` |
| Log ứng dụng Node / Spring | `log-10-4-log-node`, `log-10-5-log-spring` |
| **Log Java/Spring đầy đủ** (SLF4J + Logback/Log4j2, cấu hình, mức, rolling file, MDC/correlation id, JSON, bẫy hiệu năng, Log4Shell) | `log-10-5-log-spring` (đọc), `log-10-6-java-slf4j-cau-hinh`, `log-10-7-java-mdc-json-hieu-nang` — xem §1b |
| Log JSON có cấu trúc | `log-10-8-log-cau-truc` |
| Tấn công web trong log, log injection | `log-10-9-tan-cong-web` |
| Router / Wi‑Fi gia đình | `log-11-1-router-wifi` |
| DNS | `log-11-2-dns` |
| Tường lửa Windows / ufw / iptables | `log-11-3-firewall-windows`, `log-11-4-ufw-iptables` |
| tcpdump / Wireshark mức đọc | `log-11-5-goi-tin` |
| VPN | `log-11-6-vpn` |
| PostgreSQL log, slow query | `log-12-1-postgres-log`, `log-12-2-slow-query`, `log-12-3-kiem-toan-db` |
| MySQL / SQL Server nhận biết | `log-12-4-mysql-sqlserver` |
| docker logs | `log-13-1-docker-logs` |
| Kubernetes cơ bản | `log-13-2-kubernetes` |
| CDN / IP thật sau proxy | `log-13-3-cdn-proxy` |
| CloudWatch nhận biết (+ CloudTrail, Azure, GCP) | `log-13-4-cloud` |
| Brute force | `log-14-1-brute-force` |
| Đăng nhập lạ | `log-14-2-dang-nhap-la` |
| Leo thang quyền / bám trụ | `log-14-3-leo-thang` |
| Kẻ xấu xoá log | `log-14-4-xoa-dau-vet` |
| Chuỗi thời gian sự cố | `log-14-5-dong-thoi-gian`, `log-18-4-dong-thoi-gian` |
| MITRE ATT&CK | `log-14-6-mitre-attack` |
| SIEM cơ bản, Sigma mức đọc | `log-14-7-siem-sigma` |
| Gom log tập trung, Loki+Grafana, ELK, Windows về trung tâm | `log-15-1` … `log-15-4` |
| Cảnh báo từ log | `log-15-5-canh-bao`, `log-15-6-lab` |
| Giữ log bao lâu, luật | `log-16-1-luu-bao-lau` |
| Dung lượng, chi phí | `log-16-2-dung-luong-chi-phi` |
| Không log bí mật / dữ liệu cá nhân | `log-16-3-khong-log-bi-mat` |
| Toàn vẹn, quyền đọc log | `log-16-4-toan-ven-quyen` |
| "Toàn quyền kiểm soát": nếp kiểm hằng ngày | `log-16-5-nep-hang-ngay`, `log-5-8-lab` (báo cáo buổi sáng) |
| Chính sách log | `log-16-6-chinh-sach-log` |
| grep / awk / jq / Select-String / regex | `log-2-1` … `log-2-6` (dùng xuyên suốt) |
| Phỏng vấn, nghề, chứng chỉ | `log-17-1-cau-hoi`, `log-17-2-tinh-huong`, `log-17-3-nghe-chung-chi` |
| Dự án cuối: điều tra đa nguồn + báo cáo | `log-18-1` … `log-18-7` |

Mỗi chương 1–17 kết thúc bằng `log-N-*-lab` + `log-N-*-quiz` (Chương 17: tình huống `17.2` thay lab). Mục 0 có lab dựng môi trường (`log-0-1-moi-truong-lab`) + quiz.

## 1b. Phần log ứng dụng Java/Spring (bổ sung theo điều phối, 20/11/2026)

Soát kho: cả kho chỉ có ~3 tệp nhắc tới logging của Java, và khoá `spring-boot` chỉ chạm ở `sb-15-3-logging-traceid` — nên khoá
này dạy phần Java ĐẦY ĐỦ (cả đọc lẫn cấu hình/viết), đặt ngay cạnh phần log Node trong Chương 10:

| Bài | Nội dung phải có |
|---|---|
| `log-10-5-log-spring` | ĐỌC log Spring Boot: mẫu mặc định Logback, chuỗi "Caused by", lỗi khởi động, Actuator `/loggers` (và khoá endpoint) |
| `log-10-6-java-slf4j-cau-hinh` | SLF4J là lớp vỏ; lịch sử JUL → Log4j 1 (EOL 2015) → Logback → Log4j2; Spring Boot mặc định Logback, đổi sang Log4j2 (starter + exclusion); `logback-spring.xml`/`log4j2-spring.xml`: logger, level theo package, additivity, appender Console/RollingFile; rolling theo thời gian + dung lượng, `maxHistory`, `totalSizeCap`; bẫy hai binding SLF4J, log trùng do additivity; lab nhỏ ghi tệp xoay vòng |
| `log-10-7-java-mdc-json-hieu-nang` | MDC (filter gắn requestId/userId, dọn sau request, truyền qua `@Async`/thread pool bằng `TaskDecorator`), traceId/spanId với Micrometer Tracing; JSON: logstash-logback-encoder, Log4j2 `JsonTemplateLayout`, structured logging có sẵn của Spring Boot 3.4+ (kiểm phiên bản); bẫy hiệu năng: nối chuỗi thay placeholder `{}`, log trong vòng lặp nóng, `isDebugEnabled`, `toString` nặng, ghi đồng bộ vs AsyncAppender/Async logger (mất log khi sập); **góc hacker Log4Shell CVE-2021-44228** (12/2021: chuỗi `${jndi:ldap://…}` được ghi log là đủ chạy mã; dò dấu vết trong access log; phòng: Log4j2 ≥ 2.17.1, SBOM/kiểm phụ thuộc, chặn kết nối ra ngoài); không log mật khẩu/token/PII |
| `log-10-9-tan-cong-web` | Chỉ nhắc dấu vết dò Log4Shell trong access log, trỏ về 10.7 cho cơ chế |
| `log-10-10-lab` | Biến thể Java: thay Node bằng app Spring Boot đã cấu hình MDC + JSON + rolling file |

Nguồn thêm: slf4j.org (manual, FAQ "multiple bindings"), logback.qos.ch (manual: appenders, RollingFileAppender, MDC), logging.apache.org/log4j/2.x
(manual, JsonTemplateLayout, async loggers, trang bảo mật Log4Shell), Spring Boot reference "Logging" + "Structured Logging",
github.com/logfellow/logstash-logback-encoder, NVD CVE-2021-44228/45046/45105/44832, CISA Log4j guidance.

Thứ tự soạn: 10.6–10.7 nằm trong **Đợt 2** (cùng Ch10); có thể kéo lên làm sớm nếu người dùng cần cho đồ án Spring (LabFlow AI).

## 2. Liên kết chéo (không dạy lại — chỉ "dùng cho log" + link)

| Bài khoá này | Khoá / bài đích đã dạy sâu | Ranh giới |
|---|---|---|
| `log-1-1-log-la-gi` | observability-monitoring › `obs-0-2-ba-tru-cot` | Ở đây chỉ phân loại để đọc |
| `log-1-3-muc-log` | observability-monitoring › `obs-1-3-muc-log` | Bên kia: chọn mức khi VIẾT |
| `log-1-5-thoi-gian` | web-foundations › `wf-15-5-dates-timezones`; postgresql › `postgresql-2-3-ngay-gio` | Bên kia: múi giờ trong code/DB |
| `log-2-2-grep-regex` | linux-bash › `lnx-3-3-grep-regex`; web-foundations › `wf-11-5-regex` | Ở đây chỉ mẫu regex cho log |
| `log-2-3-awk-sort-uniq` | linux-bash › `lnx-3-6-awk` | Ở đây chỉ công thức đếm-xếp-cắt |
| `log-2-5-powershell-text` | linux-bash › `lnx-15-4-powershell-cho-nguoi-biet-bash` | Nền PowerShell ở đó |
| `log-5-6-sysmon` | blue-team-siem › `siem-1-3-windows` | Bên kia: Sysmon trong SIEM |
| `log-7-1-journald-luu` | linux-bash › `lnx-10-3-log-journalctl`; operating-systems-for-developers › `os-2-6-nhat-ky` | Bên kia nhập môn; ở đây chuyên sâu |
| `log-8-3-auth-log` | network-security › `netsec-4-5-chong-do` | fail2ban/CrowdSec ở đó |
| `log-8-5-logrotate` | docker › `dk-11-3-log` | Xoay log container ở đó |
| `log-9-5-loi-nguoi-dung` | observability-monitoring › `obs-7-1-loi-khong-phai-log` | Theo dõi lỗi chuyên sâu ở đó |
| `log-10-1-ma-trang-thai` | web-foundations › `wf-6-3-status-codes`; nginx › `nginx-11-4-tu-ma-trang-thai-toi-nguyen-nhan` | |
| `log-10-2-nginx-access-error` | nginx › `nginx-10-1-log-mac-dinh-bo-sot`, `nginx-10-2-log-json-escape`, `nginx-10-4-error-log-va-cac-muc` | Bên kia: CẤU HÌNH log; ở đây: ĐỌC |
| `log-10-4-log-node` | nodejs › `nodejs-15-1-log-co-cau-truc`, `nodejs-15-2-request-id` | Bên kia: VIẾT log |
| `log-10-5-log-spring`, `log-10-6-java-slf4j-cau-hinh`, `log-10-7-java-mdc-json-hieu-nang` | spring-boot › `sb-15-3-logging-traceid` | spring-boot chỉ CHẠM (một bài); phần Java logging dạy ĐẦY ĐỦ ở khoá này — xem §1b |
| `log-10-8-log-cau-truc` | observability-monitoring › `obs-1-1-tu-console-toi-json` | |
| `log-10-9-tan-cong-web` | web-security › `sec-9-1-log`; blue-team-siem › `siem-6-3-web-shell` | Phát hiện bằng quy tắc ở SIEM |
| `log-11-1-router-wifi` | network-security › `netsec-11-2-router` | Gia cố router ở đó |
| `log-11-2-dns` | network-security › `netsec-7-5-loc-dns` | |
| `log-11-4-ufw-iptables` | network-security › `netsec-2-2-nftables`, `netsec-2-3-ufw` | Cấu hình tường lửa ở đó |
| `log-11-5-goi-tin` | networking-for-developers › `netdev-11-1-tcpdump`, `netdev-11-2-wireshark` | Bắt/phân tích gói chuyên sâu ở đó |
| `log-11-6-vpn` | network-security › `netsec-5-2-wireguard` | Dựng VPN ở đó |
| `log-12-1-postgres-log` | postgresql › `postgresql-14-4-giam-sat` | |
| `log-13-1-docker-logs` | docker › `dk-11-3-log`; observability-monitoring › `obs-2-1-docker-bat-log` | Driver/xoay log ở đó |
| `log-13-2-kubernetes` | kubernetes › `k8s-9-2-log-metrics` | |
| `log-13-4-cloud` | cloud-aws › `aws-10-1-logs`, `aws-10-4-tracing` | CloudWatch/CloudTrail sâu ở đó |
| `log-14-1-brute-force` | blue-team-siem › `siem-6-1-brute-force` | Ở đây: nhận ra bằng mắt + lệnh; bên kia: quy tắc |
| `log-14-2-dang-nhap-la` | blue-team-siem › `siem-6-2-dang-nhap-la` | |
| `log-14-3-leo-thang` | blue-team-siem › `siem-6-4-leo-thang` | |
| `log-14-5-dong-thoi-gian` | blue-team-siem › `siem-10-1-plaso`; incident-response › `ir-4-5-dong-thoi-gian` | Plaso/Timesketch và quy trình IR ở đó |
| `log-14-6-mitre-attack` | blue-team-siem › `siem-4-1-attack` | |
| `log-14-7-siem-sigma` | blue-team-siem › `siem-5-1-sigma`, `siem-3-1-chon` | Ở đây chỉ ĐỌC Sigma |
| `log-15-1-vi-sao-tap-trung` | observability-monitoring › `obs-2-3-trinh-thu-log` | |
| `log-15-2-loki-grafana` | observability-monitoring › `obs-2-4-logql` | LogQL sâu ở đó |
| `log-15-3-elk` | blue-team-siem › `siem-3-1-chon` | |
| `log-15-5-canh-bao` | observability-monitoring › `obs-9-1-loi-hua-danh-thuc` | Thiết kế cảnh báo/SLO ở đó |
| `log-16-2-dung-luong-chi-phi` | observability-monitoring › `obs-1-4-chi-phi-that`, `obs-2-5-luu-tru` | |
| `log-16-3-khong-log-bi-mat` | web-security › `sec-9-1-log`; privacy-data-law › `pdl-5-2-toi-thieu` | |
| `log-16-4-toan-ven-quyen` | incident-response › `ir-7-3-chuoi-luu-giu` | |
| `log-17-3-nghe-chung-chi` | blue-team-siem › `siem-13-1-chung-chi` | |
| `log-18-6-tu-dung-kich-ban` | blue-team-siem › `siem-4-4-mo-phong` | |

Tất cả slug đích đã kiểm tồn tại trong repo lúc dựng khung (20/11/2026). Khi soạn: viết link dạng `/courses/<slug>/learn?lesson=<bài>` theo
đúng mẫu link-card các khoá đã soạn đang dùng (kiểm lại mẫu trước khi viết).

Chiều ngược lại (gợi ý cho phiên sau, KHÔNG làm trong phiên khung): thêm một dòng "↪ Muốn đọc log mọi nguồn: /courses/log-tu-a-den-z"
vào `lnx-10-3-log-journalctl`, `os-2-6-nhat-ky`, `siem-1-3-windows`, `nginx-11-4-…` khi các khoá đó được sửa tiếp.

## 3. Môi trường lab

| Thành phần | Dùng cho | Ghi chú an toàn |
|---|---|---|
| **Windows thật của người học** (Windows 10/11, quyền quản trị) | Ch3, Ch4 (đọc), Ch5 (PowerShell, audit policy), Ch11 (tường lửa, DNS) | Tạo **điểm khôi phục** trước khi đổi audit policy/Sysmon. KHÔNG xoá log trên máy thật. |
| **Máy ảo Windows** (bản đánh giá Windows 11 Enterprise 90 ngày của Microsoft, hoặc Windows Sandbox / Hyper-V) | Ch4 Lab 4 (tạo user, khoá tài khoản, cài dịch vụ thử, xoá log), Sysmon thử nghiệm | Snapshot trước mỗi lab |
| **Máy ảo Linux** Ubuntu 24.04 LTS (VirtualBox/Hyper-V/UTM/Multipass) + máy ảo thứ hai làm "kẻ dò" | Ch7, Ch8 (OOM, auth.log, auditd, hydra trong mạng lab nội bộ), Ch11 (rsyslog nhận syslog router, ufw) | Mạng host-only/internal; không quét ra Internet |
| **WSL2** (thay thế nhẹ) | Ch2, Ch7 cơ bản | Bật systemd trong `/etc/wsl.conf`; không có auth.log/sshd thật như VM — ghi rõ giới hạn |
| **macOS** (nếu có) | Ch6 | Không có Mac ⇒ dùng `.logarchive` mẫu (cần soạn bộ mẫu từ máy Mac của tác giả, đã làm sạch) |
| **Docker + Docker Compose** | Ch10 (nginx + Node), Ch12 (PostgreSQL + pgBadger), Ch13 (container hỏng), Ch15 (Loki/Alloy/Grafana, Elasticsearch/Kibana/Filebeat) | ELK cần ≥ 4 GB RAM trống + `vm.max_map_count`; ghi phương án OpenSearch/Loki khi máy yếu |
| **kind / minikube** (tuỳ chọn) | Ch13 Kubernetes | |
| **Gói log mẫu của khoá** (cần dựng) | Mọi chương, Lab 1, Lab 9 (HAR), Lab 14, Ch18 | Kho `content/courses/log-tu-a-den-z/du-lieu/` (đề xuất): .evtx, journal xuất (`journalctl -o export`), /var/log, nginx, app JSON, PostgreSQL csvlog, pfirewall.log, DNS, docker logs, .pcap nhỏ, HAR, .logarchive. **Không chứa dữ liệu thật** của cuongthai.com/người dùng; quét gitleaks trước khi commit; bí mật "cài sẵn" cho Lab 16 phải là chuỗi giả rõ ràng (vd `sk_test_GIA_KHONG_THAT`) |

Script sinh dữ liệu cho Ch18 (đề xuất `scripts/log-khoa/sinh-su-co.mjs` hoặc Compose + Atomic Red Team trong VM) phải tái lập được và có đáp án tách riêng.

## 4. Nguồn chính thống (kiểm từng con số/mốc khi soạn — không trích từ trí nhớ)

- **Windows:** Microsoft Learn — "Advanced security audit policy settings", trang từng sự kiện (`4624(S): An account was successfully logged on`, 4625, 4634, 4647, 4672, 4688, 4698, 4719, 4720, 4732, 4740, 1102…), "Audit policy recommendations", `Get-WinEvent`, `wevtutil`, "Windows Event Forwarding"; Sysinternals Sysmon (trang tải + danh sách Event ID); Microsoft Defender Antivirus event IDs; JPCERT/CC "Detecting Lateral Movement through Tracking Event Logs" (bảng tra sự kiện theo công cụ).
- **macOS:** Apple Developer — Logging / OSLog, `man log`, Platform Security Guide (TCC, Gatekeeper, BTM).
- **Linux:** man7.org — `journalctl(1)`, `journald.conf(5)`, `systemd.journal-fields(7)`, `logrotate(8)`, `auditctl(8)`, `ausearch(8)`, `aureport(8)`, `rsyslog.conf(5)`, `dmesg(1)`, `last(1)`; rsyslog.com docs; Linux Audit (github.com/linux-audit).
- **Chuẩn:** RFC 3164, RFC 5424 (syslog), RFC 5425 (syslog over TLS), RFC 3339 (thời gian), ISO 8601; Elastic Common Schema; OpenTelemetry Logs data model & semantic conventions.
- **Web:** nginx.org `ngx_http_log_module`, `ngx_http_core_module` (error_log); Apache httpd "Log Files"; Microsoft Learn IIS W3C logging, HTTP.sys error log; MDN HTTP status codes; Chrome DevTools docs (Network, HAR, NetLog).
- **Ứng dụng:** pino, winston docs; Spring Boot reference "Logging", Actuator `loggers`.
- **Mạng:** Microsoft Learn Windows Firewall logging; ufw man; netfilter/nftables wiki (log statement); WireGuard docs; OpenVPN manual; Pi-hole/AdGuard Home docs; tcpdump/Wireshark docs.
- **CSDL:** PostgreSQL docs "Error Reporting and Logging", `auto_explain`, `pg_stat_statements`; pgAudit; pgBadger; MySQL Reference Manual (slow query log, general log); SQL Server docs (error log, error 18456).
- **Container/cloud:** docs.docker.com (logging drivers, `docker logs`, `docker events`); kubernetes.io "Logging Architecture", `kubectl logs`; AWS CloudWatch Logs / Logs Insights / CloudTrail / VPC Flow Logs; Azure Monitor Activity Log; Google Cloud Logging; Cloudflare docs (Security Events, Ray ID, `CF-Connecting-IP`).
- **Gom log:** Grafana Loki, Grafana Alloy (Promtail đã vào giai đoạn ngừng — kiểm trạng thái hiện hành), LogQL; Elastic (Elasticsearch, Kibana, Filebeat, Winlogbeat); OpenSearch; NXLog CE.
- **Bảo mật:** attack.mitre.org (T1110, T1078, T1136, T1098, T1543, T1053, T1059, T1070…); SigmaHQ (github.com/SigmaHQ/sigma); OWASP Logging Cheat Sheet, OWASP Top 10 A09 (Security Logging and Monitoring Failures); NIST SP 800-92 (+ bản sửa đổi SP 800-92r1 dự thảo); NIST SP 800-61; CIS Benchmarks (audit/logging).
- **Pháp lý:** Luật An ninh mạng (bản hiện hành) và văn bản hướng dẫn về lưu nhật ký; Luật Bảo vệ dữ liệu cá nhân 91/2025 + Nghị định 356/2025 (theo khoá privacy-data-law); BLHS 2015 điều 289; PCI DSS v4.0 Req. 10 (ví dụ quốc tế). **Mọi con số thời hạn lưu phải kiểm văn bản gốc.**
- **Sự cố kể trong bài (phải tìm nguồn gốc trước khi kể):** Target 2013 (báo cáo Thượng viện Mỹ), Equifax 2017 (báo cáo GAO/House Oversight), SolarWinds/FireEye 2020, Log4Shell CVE-2021-44228, Okta HAR 10/2023, Twitter 05/2018 & GitHub 05/2018 (mật khẩu trong log nội bộ), Facebook 03/2019 (mật khẩu dạng rõ). Sự cố của chính cuongthai.com chỉ kể ở mức nguyên tắc, đã vá, bỏ chi tiết khai thác được (xem `docs/so-loi.md`).

## 5. Thứ tự soạn đề xuất

Ưu tiên cái người học dùng NGAY trên máy mình và hay gặp khi đi làm; mỗi đợt xong là deploy được (bài còn lại vẫn "Đang soạn").

1. **Đợt 1 — nền + Windows (giá trị cao nhất cho người hỏi):** Mục 0 → Ch1 → Ch2 → Ch3 → Ch4 → Ch5. Cần dựng trước: gói log mẫu tối thiểu (Lab 1, 2) + VM Windows.
2. **Đợt 2 — Linux + web:** Ch7 → Ch8 → Ch10 → Ch9. Cần: VM Ubuntu ×2, Compose nginx+Node, HAR mẫu.
3. **Đợt 3 — mạng, CSDL, container:** Ch11 → Ch12 → Ch13.
4. **Đợt 4 — điều tra + gom tập trung:** Ch14 → Ch15. Cần: bộ log tấn công dàn dựng (Lab 14), Compose Loki/ELK.
5. **Đợt 5 — vận hành, macOS, nghề:** Ch16 → Ch6 → Ch17.
6. **Đợt 6 — dự án cuối:** Ch18 (bộ dữ liệu đa nguồn + đáp án + rubric) — soạn sau cùng vì dùng lại mọi chương; chạy thử trọn đề với một người chưa đọc đáp án.

Mỗi đợt: kiểm `node -e "import('./content/courses/log-tu-a-den-z.mjs').then(m=>console.log(m.default.sections.length))"`, slug bài không đổi,
gitleaks trên dữ liệu mẫu, rồi mới đề xuất deploy (theo luật deploy trong CLAUDE.md — người dùng duyệt). Ảnh bìa: đẩy
`scripts/covers/log-tu-a-den-z.png` lên R2 `images/course-covers/` khi seed khoá lần đầu (phiên khung không đẩy).

## 6. Tiến độ

- **22/11/2026 — Mục 0, Chương 1, Chương 2 soạn chi tiết** (21 bài, song ngữ, mỗi bài có 🧪 "Đạt khi", 🗂, 📌; 3 quiz × 10 câu có giải thích).
  Tệp: `s00-bat-dau.mjs` + `s00/`, `s01-nen-tang.mjs` + `s01/`, `s02-do-nghe.mjs` + `s02/`; tệp khoá thay bài khung theo slug (hàm `thay()`).
- **Gói log mẫu (đã dựng):** `_demo/tao-goi-log.py` — tất định (LCG tự viết), chỉ IP RFC 5737/10.x; người học chép script từ bài 0.1.
  Gồm `web/` (access log 20/11 + `.1.gz`), `app/` (JSON pino + bản hỏng), `linux/auth.log`, `incident/` (Lab 1: db-win01, api-01, proxy-01 —
  đồng hồ proxy-01 nhanh 180 s), `windows/` (IIS W3C, pfirewall.log), `formats/` (một sự kiện, sáu định dạng).
- **Output thật:** mọi lệnh trong bài nằm ở `_demo/sNN/*.sh|*.ps1`; `bash scripts/log-khoa/chay-demo.sh` chạy chúng trong container
  `log00-lab:1` (Ubuntu 24.04: GNU grep 3.11, mawk 1.3.4, jq 1.7, ripgrep 14.1) và `log00-pwsh:1` (PowerShell 7.7 arm64/x64 native) rồi sinh `_ma.mjs`.
  Sửa lệnh/dữ liệu ⇒ chạy lại script, KHÔNG sửa `_ma.mjs` tay.
- Chưa có: slide/deck, Code Lab, video. Tiếp theo theo §5: Chương 3 → 4 → 5 (cần VM Windows).

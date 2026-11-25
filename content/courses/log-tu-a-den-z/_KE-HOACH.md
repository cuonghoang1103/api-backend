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
| **Gói log mẫu của khoá** (cần dựng) | Mọi chương, Lab 1, Lab 9 (HAR), Lab 14, Ch18 | Kho `content/courses/log-tu-a-den-z/du-lieu/` (đề xuất): .evtx, journal xuất (`journalctl -o export`), /var/log, nginx, app JSON, PostgreSQL csvlog, pfirewall.log, DNS, docker logs, .pcap nhỏ, HAR, .logarchive. **Không chứa dữ liệu thật** của cuongthai.com/người dùng; quét gitleaks trước khi commit; bí mật "cài sẵn" cho Lab 16 phải là chuỗi giả rõ ràng (vd `sk_test_GIA_TOKEN·VIDU`) |

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
- **24/11/2026 — Chương 10 soạn chi tiết** (11 bài: 10.1–10.9, Lab 10, quiz 12 câu; song ngữ; agent `lgz` trên máy nhà). Tệp: `s10-web-ung-dung.mjs` + `s10/`.
  Output thật ở `_demo/s10/` — KHÁC cơ chế s00–s02: lệnh chạy trực tiếp với Docker (Lab 10 nginx 1.27 + Node 22/pino; Spring Boot 4.1.1/Logback;
  httpd 2.4; Log4j 2.14.1 vs 2.17.1 trong container `--network none`). Tệp lệnh đuôi **`.bash`** (không phải `.sh`) để `scripts/log-khoa/chay-demo.py`
  KHÔNG chạy nhầm chúng trong log00-lab (sẽ ghi đè output). Chạy lại: `bash _demo/s10/chay-s10.bash <thư mục làm việc>` (~8 phút) rồi `node scripts/log-khoa/sinh-ma.mjs`;
  chạy lại thì giờ/số đo (rt, ms của LogBench) đổi ⇒ soát số trong lời bài (10.1 "375/458", 10.2 "1.366 s", 10.4 "351/26/58", 10.7 "342 ms", 10.9, Lab 10).
- Thứ tự đợt đã đổi: Ch3–5 (Windows) cần VM Windows thật — máy soạn hiện tại (Linux) không sinh được .evtx thật ⇒ làm Đợt 2 trước (Ch10 xong; tiếp Ch7 → Ch8 → Ch9 → Ch13 → Ch15 → Ch16).
- **24/11/2026 (phiên 2, agent `lgz`) — Chương 7 soạn chi tiết** (7 bài: 7.1–7.5, Lab 7, quiz 10 câu; song ngữ). Tệp: `s07-journald.mjs` + `s07/`.
  Output thật từ một **máy ảo Ubuntu 24.04 thật** (`lab7`: ảnh cloud minimal noble, systemd 255, nhân 6.8, KVM qua qemu trong container `lgz-vm`) —
  journald chỉ cho đủ hiện tượng (nhiều lần khởi động, rút điện, `-k`, OOM cả máy) trên máy ảo, không trên container. App thử + unit: `_demo/s07/vm/`.
  Lịch sử máy ảo là MỘT PHẦN của bài (rút điện 04:10:21 → thử volatile → khởi động lại sạch → bài 7.1–7.5 → tua giờ 03:11:40 hôm sau cho Lab 7);
  trình tự ghi ở `_demo/s07/chay-s07.bash` (các bước đã chạy tay đúng thứ tự đó, chưa chạy lại một lèo). Chạy lại ⇒ PID/giờ/số dòng đổi: soát số trong lời
  (7.1 "20,9/48,4 MB, 40/70 dòng, PID 2203", 7.4 "10 000/20 000, 1000/29 000, offset", 7.5 "anon-rss", Lab 7 "03:12:03.274, PID 424→18996, 149,4 MiB").
  Máy ảo giữ đĩa ở `~/.rtq-lgz/vm/lab7.qcow2` (máy nhà) để Chương 8 dùng tiếp (auth.log/rsyslog/auditd/logrotate): `bash _demo/s07/cong-cu/may.bash bat`.
- **24/11/2026 (phiên 3, agent `lgz`) — Chương 8 soạn chi tiết** (7 bài: 8.1–8.5, Lab 8, quiz 10 câu; song ngữ). Tệp: `s08-linux-varlog.mjs` + `s08/`.
  Output thật: máy ảo lab7 (đĩa Chương 7) + máy ảo thứ hai `keodo` (kẻ dò, nhiều IP .20/.66/.77/.88 trên LAN qemu 192.168.56.0/24) + container
  `lgz-logsrv` (máy chủ log trung tâm, chung netns với lgz-vm, lab7 thấy ở 10.0.2.2; dựng bằng `_demo/s08/logsrv/dung.bash`). Bật/tắt: `_demo/s08/cong-cu/may.bash bat|xuong`.
  Tệp lệnh `.bash` chạy bằng `_demo/s08/cong-cu/chay-vm.py` (tiền tố `@keodo`/`@logsrv`/`@host`). Thứ tự đã chạy: chuan-bi → var-log → rsyslog → auth (2 lượt)
  → auditd → (khởi động lại gỡ -e 2) → auditd2/3 → logrotate → lab8-tan-cong (tua đồng hồ 22:41→07:58, NTP bật lại) → lab8 → lab8-ngan (CHỈ một lần) → auth2, auditd4.
  Chạy lại ⇒ soát số trong lời: 8.2 "217/200.000, 5.05 s/0.26 s, 22 gói", 8.3 "196/197/198, 12/7, 4 PID", 8.4 "lost 1349, 458/58, ~460 → 2 cat, 05:24:28→05:25:07",
  8.5 "15.660/15.680, mất 2.000 (438.001–440.000), 958→971→938 MB", Lab 8 "677 dòng, 172/47, 136/25/11, 03:42:17, SHA256:Thc+lqQJ…".
  Trạng thái máy ảo để lại: lab7 còn PasswordAuthentication yes, người dùng an/dev/backup2/test (test đã khoá), /etc/sudoers.d/dev NOPASSWD (cửa sau của Bài 8.4 — CỐ Ý giữ),
  rsyslog gửi TLS tới logsrv (logsrv đã xoá ⇒ rsyslog sẽ báo suspended tới khi dựng lại). Cả hai máy ảo đã tắt sạch; đĩa ở `~/.rtq-lgz/vm/`.
- **24/11/2026 (phiên 4, agent `lgz`) — Chương 9 soạn chi tiết** (7 bài: 9.1 Console, 9.2 Network, 9.3 HAR, 9.4 net-export/NetLog + Firefox MOZ_LOG, 9.5 thu lỗi người dùng, Lab 9, quiz 8 câu; song ngữ). Tệp: `s09-trinh-duyet.mjs` + `s09/`.
  Output thật: Lab 9 (`_demo/s09/lab/`: Node 22 `server.mjs` — shop 41901, api 41902, https tự ký 41903, report-svc chậm 41904; `src/app.js` + `src/bat-loi.js` nén bằng esbuild + source map)
  mở bằng Google Chrome 150 headless qua Playwright + CDP (`_demo/s09/cong-cu/`: console.mjs, net.mjs, har.mjs, netlog.mjs — in đúng sự kiện DevTools nhận), Firefox 152 MOZ_LOG, jq 1.7.
  Chạy lại: `bash _demo/s09/chay-s09.bash <thư mục làm việc>` (cần `npm i playwright-core esbuild` trong thư mục đó) → sinh lại `_ma.mjs`. Bước Firefox (`firefox.bash`) đôi khi treo khi hồ sơ mới ⇒ chạy lại riêng.
  Chạy lại ⇒ request id/giờ/exp đổi: soát số trong lời 9.1 ("b4f0f52c…"), 9.2 ("0efc4682…", "802 ms", "dns=… tls=3.2 ms"), 9.4 ("3 438 sự kiện, 0,8 MB, 18 ERR_ABORTED, URL_REQUEST#86, SOCKET#123"), 9.5 (6 dòng rum.log), Lab 9 (rid caa75cb6…/ac6daedc…/771cc35e…, exp 1795477713, 23:33:33).
  NetLog chứa dòng lệnh (đường nhà) + IP LAN ⇒ KHÔNG chép netlog.json vào kho; output đã che (sed) — chính là ví dụ trong bài.
  Liên kết chéo: debug-co-phuong-phap 5.1/5.2/5.4/2.3/6.2/6.5/11.1 (slug có trên prod), observability-monitoring 7.1. Tiếp theo theo §5: Ch13 → Ch15 → Ch16 → Ch11 → Ch12 → Ch14 → Ch6 → Ch17 → Ch18; Ch3–5 cần .evtx thật.
- **24/11/2026 (phiên 5, agent `lgz`) — Chương 13 soạn chi tiết** (6 bài: 13.1 docker logs/events/mã thoát, 13.2 Kubernetes, 13.3 CDN/proxy, 13.4 cloud, Lab 13, quiz 8 câu; song ngữ). Tệp: `s13-container-cloud.mjs` + `s13/`.
  Output thật ở `_demo/s13/` (tệp lệnh `.bash`, chạy lại một lèo: `bash _demo/s13/chay-s13.bash <thư mục làm việc>`, ~8 phút): Docker 29 + Compose v5 (ứng dụng thử `c13/`);
  **k3s v1.33.5 trong container đặc quyền** `lgz-k3s` (kubectl = hàm trong `cong-cu/k8s-env.bash`; người học dùng kind/minikube/k3d — lệnh y hệt); lab proxy `proxy/`
  (nginx 1.27 đóng vai CDN biên GIẢ LẬP Cloudflare: CF-Connecting-IP/CF-Ray; nginx gốc cổng 80 sai/8080 đúng; Express 5.3 + express-rate-limit 8.7; client = container curl mang IP nguồn cố định);
  cloud: AWS CLI 2.32.0 → **moto 5.1.18** (giả lập; bỏ qua filter pattern và Logs Insights — bài nói rõ) + bản ghi CloudTrail/VPC Flow Logs MẪU tất định `cloud/tao-mau.py`
  (tài khoản 111122223333, khoá AKIAIOSFODNN7EXAMPLE = giá trị ví dụ của AWS). Lab 13 `lab13/` (api exit 1, worker OOM 137, thumb 139 + log trống do đệm).
  Chạy lại ⇒ soát số trong lời: 13.1 "11/3 dòng, 4 FATAL, 10,2 s/0,1 s"; 13.2 "RESTARTS 3 sau 75 s, COUNT 6, 4.log"; 13.3 "8×401 vs 5×401+3×429, 15 dải IPv4 Cloudflare"; 13.4 "22880 byte"; Lab 13 "×4/×3/×1".
  Nguồn sự cố có thật: Codecov 2021, Tesla/RedLock 2018, CVE-2026-25552 (Ghost-CLI) + CVE-2025-59152 (Litestar), Capital One 2019 (FAQ của công ty).
  ⚠ MITRE ATT&CK đã ĐÁNH SỐ LẠI: T1562.008 → **T1685.002** (tactic "Defense Impairment"; trang cũ chuyển hướng). Ch14 (T1070, T1078, T1110…) phải kiểm số hiện hành trên attack.mitre.org trước khi viết.
  Tiếp theo theo §5: Ch15 → Ch16 → Ch11 → Ch12 → Ch14 → Ch6 → Ch17 → Ch18; Ch3–5 cần .evtx thật.
- **24/11/2026 (phiên 6, agent `lgz`) — Chương 15 soạn chi tiết** (7 bài: 15.1 vì sao tập trung, 15.2 Loki+Alloy+Grafana/LogQL, 15.3 ELK/KQL/ES|QL, 15.4 Windows về trung tâm, 15.5 cảnh báo, Lab 15, quiz 10 câu; song ngữ). Tệp: `s15-tap-trung-canh-bao.mjs` + `s15/`.
  Output thật ở `_demo/s15/` (tệp `.bash`; chạy lại một lèo: `bash _demo/s15/chay-s15.bash <thư mục làm việc>`, ~35 phút; `CHI=loki|elk|tls` để chạy riêng một phần; KHÔNG sửa tệp này lúc nó đang chạy — bash đọc dần):
  bộ lab 1 `loki/` (Loki 3.7.10, Alloy 1.22.0, Grafana 13.2.6, ntfy 2.38.1, API Node `app/app.js`, "máy Linux" `vm/` = Ubuntu 24.04 + systemd + sshd — ảnh `lgz-c15-vm:1` cần `docker build`);
  bộ lab 2 `elk/` (Elasticsearch/Kibana/Filebeat **9.5.7** — 9.6.0 chưa có ảnh; KQL gõ vào Discover thật bằng `cong-cu/kql.mjs` + Chrome headless qua cầu socket `cong-cu/cau-sock.mjs`); `windows/` (config.alloy chỉ qua `alloy fmt`/`alloy run` tới bước đọc chứng chỉ; winlogbeat.yml + nxlog.conf là MẪU chưa chạy — bài nói rõ) + `tls.bash` (mTLS thật).
  Mỗi bộ lab là MỘT netns `--network none` dùng chung (không tạo mạng docker ⇒ không làm hỏng lượt chụp Chromium của khoá khác). Bẫy thật đã ghi trong bài: Loki cần `instance_addr`/`memberlist.bind_addr` khi chỉ có lo; Loki hãm ghi khi đĩa > 90% (máy nhà 91%); discovery.docker bỏ qua container `network_mode: service:…`;
  Filebeat system/auth lấy múi giờ của máy chạy Filebeat (lệch 7 giờ) và `var.timezone` không tồn tại; user.name dính dấu cách đầu với "invalid user"; event.original không chỉ mục; Kibana Basic chỉ có connector .index/.server-log; noDataState mặc định bắn DatasourceNoData; cảnh báo im lặng cần nguồn luôn có log (healthcheck).
  Chạy lại ⇒ giờ/kích thước/số lần thử lại/RAM đổi; số trong lời là số tất định: 15.1 "4 → 0 trên máy, 4 ở Loki, 30/30, dropped 0"; 15.2 "72/5/1, 40 chuỗi, admin 4/root 3/an 2"; 15.3 "4268, 160, 137, 423, 422, 74/45/41, 137/332, 20 lần ' git', ~3 GB RAM"; 15.5 "12 SSH ⇒ giá trị 17, 8×502, for 1m"; 15.1 thực hành 3 "10/30" và 15.2 thực hành 4 "163 dòng" (đã thử tay, không nằm trong chay-s15.bash).
  MITRE đã đánh số lại: Clear Windows Event Logs T1070.001 → **T1685.005**; Disable/Modify Windows Event Log T1562.002 → **T1685.001** (Ch14/Ch4 dùng số mới). Promtail EOL 2/3/2026 (docs Loki).
  Tiếp theo theo §5: Ch16 → Ch11 → Ch12 → Ch14 → Ch6 → Ch17 → Ch18; Ch3–5 cần .evtx thật. Pha B (video) vẫn chưa bắt đầu.
- 24/11/2026 (agent lgz, phiên 7): **Chương 16 SOẠN CHI TIẾT** (8 bài: 16.1–16.6, Lab 16, quiz 16.8 — tệp `s16-van-hanh.mjs` + `s16/`). Output thật ở `_demo/s16/` (chạy lại: `bash _demo/s16/chay-s16.bash`, ~6 phút;
  "máy chủ" may16 = ảnh `lgz-c16-vm:1` dựng từ `_demo/s16/vm` — container privileged THẤY ring buffer nhân của máy thật ⇒ `may.bash` tắt imklog, ReadKMsg=no, xoá kern.log/dmesg).
  Nguồn pháp lý kiểm 24/11/2026: Luật An ninh mạng 116/2025/QH15 (hiệu lực 01/7/2026) + Nghị định 333/2026/NĐ-CP (thay NĐ 53/2022; nhật ký hệ thống ≥ 12 tháng, toàn vẹn);
  Luật BVDLCN 91/2025/QH15 + NĐ 356/2025; PCI DSS 10.5.1; NIST SP 800-92 Rev.1 vẫn là bản nháp (10/2023). Giá CloudWatch Logs ap-southeast-1 từ Price List API (19/11/2026): 0,70/0,35 USD/GB nạp, 0,03 USD/GB-tháng.
  MITRE: Clear Linux or Mac System Logs T1070.002 → **T1685.006**; vụ SolarWinds: APT29 dùng AUDITPOL (C0024, trang T1685.001).
  Số tất định trong lời: 16.2 "202/206 B, 2,64 GB/ngày, 158890 vs 962450 (×6), 1012 → 59, 47/400"; 16.3 "bảy bản sao, 5 → 7 phát hiện gitleaks, 702 dòng"; 16.4 "dòng 5, 9 dòng"; 16.5 "3 → 12, 2 → 8"; Lab 16 "2/10 → 10/10".
  Tiếp theo theo §5: Ch11 → Ch12 → Ch14 → Ch6 → Ch17 → Ch18; Ch3–5 cần .evtx thật. Pha B (video) vẫn chưa bắt đầu.
- **24/11/2026 (phiên 10, agent `lgz`) — Chương 11 SOẠN CHI TIẾT** (8 bài: 11.1 router/Wi‑Fi, 11.2 DNS, 11.3 tường lửa Windows, 11.4 ufw/iptables/nftables, 11.5 gói tin, 11.6 VPN, Lab 11, quiz 10 câu; song ngữ). Tệp: `s11-mang.mjs` + `s11/`.
  Output thật ở `_demo/s11/` (chạy lại: `bash _demo/s11/chay-s11.bash`, ~25 phút; tệp `.bash` chạy bằng `_demo/s11/cong-cu/chay-vm.py`, tiền tố `@wrt/@android/@keodo/@win/@host`, dòng `!` chạy ẩn):
  một LAN "nhà" ảo 192.168.56.0/24 bằng KVM trong container `lgz-c11` (ảnh `lgz-qemu:2` = `_demo/s11/cong-cu/Dockerfile`, cầu br0 + tap, KHÔNG tạo mạng docker): router **OpenWrt 25.12.6** thật
  (`cong-cu/wrt-dau.sh` lần đầu qua 192.168.1.1 từ container, `wrt-them.sh`: Wi‑Fi mac80211_hwsim — hostapd/wpa_supplicant thật, UPnP, luật chặn telnet có log, chỉ IPv4, DNS gốc 1.1.1.1),
  lab7/keodo (đĩa Ch7–8), android-7f3a (đĩa mới, chỉ có LAN), **Windows Server 2025 bản đánh giá** cài không người ngồi (`cong-cu/win-cai.bash` + `win/autounattend.xml`, ssh khoá qua lab7).
  Bẫy thật: OpenWrt 25.12 `network.lan.ipaddr` phải có `/24` (thiếu ⇒ /32, LAN mất đường); NIC WAN phải `addr=0x9` để LAN là eth0; miniupnpd từ chối WAN địa chỉ riêng ⇒ `ext_allow_private_ipv4=yes`
  (thông báo gợi ý `ignore_private_ip_check` là SAI tên); `/etc/init.d/log restart` xoá bộ đệm log ⇒ dùng `reload_config`; DNS của qemu (10.0.2.3) trả SERVFAIL thất thường với NXDOMAIN;
  firewall Windows không tự mở 22 dù bật sshd (đã thêm luật vào autounattend); Windows Update làm `win.qcow2` phình **26 GB** trong ~3 giờ ⇒ đĩa máy nhà còn 11 GB ⇒ đã xoá win.qcow2 (giữ ISO
  `~/.rtq-lgz/win/ws2025-eval.iso` 5,7 GB). Lần sau dựng lại Windows: thêm luật router chặn 192.168.56.177 ra WAN (trừ DNS) và tắt máy ảo ngay khi xong.
  Quan sát thật đáng dạy (đã vào bài): pfirewall.log chỉ ghi DROP cho cổng có tiến trình nghe (25 cổng bị quét ⇒ 6 dòng/3 cổng); ufw "limit 3/min burst 10" ⇒ quét 1000 cổng ghi 0 dòng;
  Windows Server 2025 ghi đổi luật tường lửa 2097/2099/2052/2082 (không phải 2004/2005); RasClient −2147014836 = 0x8007274C = WSAETIMEDOUT.
  Lab 11 tua đồng hồ router/lab7/android về tối 24/11 (lab11-dung.bash) rồi trả lại (lab11-tra-gio.bash); Windows không tua ⇒ lệch 9 giờ 29 phút — giữ làm bài căn giờ. Log mẫu: `_demo/s11/lab11/mau/`.
  Chạy lại ⇒ soát số trong lời: 11.1 "885/642 dòng, 23:54/11:54, 38 giây, 18 giây"; 11.2 "36 NXDOMAIN, nhãn 50/35, +15 s"; 11.3 "6 dòng/3 cổng, 445×8 135×4 139×2, 20 sự kiện"; 11.4 "10 dòng, 0 dòng, 5×200, 5 LIMIT, 5/12, 3/8";
  11.5 "2,2/1,1 ms, 55 gói"; 11.6 "10.8.0.6, 12:29:26, 3256 byte, 41 giây"; Lab 11 "257 dòng, 20:47:20, 6×20 s, 9 giờ 29 phút".
  Tiếp theo theo §5: Ch12 → Ch14 → Ch6 → Ch17 → Ch18; Ch3–5 (Windows) giờ LÀM ĐƯỢC bằng máy ảo Windows Server 2025 (dựng lại từ ISO đã có, ~30 phút) — .evtx thật.
- **24/11/2026 (phiên 11, agent `lgz`) — Chương 12 SOẠN CHI TIẾT** (6 bài: 12.1 log PostgreSQL, 12.2 truy vấn chậm, 12.3 kiểm toán + dò mật khẩu, 12.4 MySQL/SQL Server, Lab 12, quiz 8 câu; song ngữ). Tệp: `s12-csdl.mjs` + `s12/`.
  Output thật ở `_demo/s12/` (chạy lại một lèo: `bash _demo/s12/chay-s12.bash <thư mục làm việc>`, ~12 phút; tệp `.bash` chạy bằng `_demo/s12/cong-cu/chay-ct.py` — mặc định TRONG container CSDL, `@host`/`@<tên>`, dòng `!` chạy ẩn):
  ảnh `lgz-pg12:1` (`_demo/s12/anh/Dockerfile` = postgres:17 + postgresql-17-pgaudit + pgbadger 13.3 + iproute2), container `--network none --cap-add NET_ADMIN`, máy khách giả = IP gắn lên lo
  (10.20.0.15 laptop An, 10.20.0.23 máy dùng tài khoản app chung, 10.20.0.50 máy chủ ứng dụng, 203.0.113.66 kẻ dò) — `cong-cu/khoi-dong-lai.bash` gắn lại IP sau mỗi restart.
  MySQL 8.4.13 (mysql:8.4) và SQL Server 2022 CU28 (mssql 2022-latest, 2 GB) mỗi cái một container `--network none`; Lab 12 = compose (db `network_mode: none`, api `network_mode: service:db` — KHÔNG tạo mạng docker), npm `pg@8.16.3` cài vào thư mục làm việc.
  Bẫy thật đã vào bài: `ALTER SYSTEM SET shared_preload_libraries = 'a,b'` (một chuỗi) ⇒ PostgreSQL KHÔNG khởi động (`could not access file "a,b"`); collector bật ⇒ docker logs im lặng;
  log_statement=mod bỏ sót DELETE trong khối DO (pgAudit bắt được); mật khẩu lọt qua log_statement và qua STATEMENT của câu lỗi (pgAudit REDACTED); MySQL 8.4 không ghi "Access denied" khi verbosity 2, giờ log UTC;
  SQL Server trên Linux: errorlog UTF-8, tài khoản bị vô hiệu hoá là lỗi 18470 (không phải 18456); pgBadger đếm mục auto_explain như một câu riêng; CREATE INDEX CONCURRENTLY ghi chờ ShareUpdateExclusiveLock.
  Chạy lại ⇒ soát số trong lời (ghi ở đầu từng tệp bài): 12.1 "PID 92/100/108, 1000.068/2504.779 ms, tiến trình 155, 10|12|3"; 12.2 "72/77/88 ms, 666653, 9016 ms, 64960→40874 tps, 9+9 MiB, 239ms-3, 877K";
  12.3 "PID 77, 50 dòng, 35 lần 9/9/8/9, 15:58:55→57"; 12.4 "0.035382/144318, State 8/5/38, 18470"; Lab 12 "405/585 → 1,3/3,5 ms, rid 725b2f74 701 ms, 83 482 ms, 5855 ms PID 511/482".
  Nguồn sự cố kiểm 24/11/2026: Wiz 31/3/2025 (JINX-0126, >1.500 nạn nhân), Aqua PG_MEM 2024 (trang chặn curl — xác nhận qua Wiz + tìm kiếm), GitLab 31/1/2017 (postmortem), Replit/SaaStr 7/2025 (The Register). MITRE T1110.001 không đổi số.
  Tiếp theo (chỉ đạo 24/11 12:30): Ch14 → Ch6 → Ch17 → Ch18 → Ch3–5 (Windows: ưu tiên EVTX mẫu công khai + pwsh, không dựng VM). Pha B dừng ở lgz-10-4 tới khi xong pha A.
- **24/11/2026 (phiên 12, agent `lgz`) — Chương 14 ĐANG DỞ (chưa có bài).** Có sẵn: ảnh `lgz-evtx:1` (`_demo/s14/anh/`, gói PyPI `evtx` 0.15.0 — python-evtx vỡ ở vài tệp), 13 EVTX mẫu công khai
  (`~/.rtq-lgz/c14/evtx/`, nguồn sbousseaden/EVTX-ATTACK-SAMPLES + mdecrevoisier/EVTX-to-MITRE-Attack), 6 quy tắc SigmaHQ (`~/.rtq-lgz/c14/sigma/`), `_demo/s14/cong-cu/may.bash` + `chay.py`.
  Dựng tấn công giả lập trên lab7 bị bộ lọc an toàn dừng ⇒ ĐỪNG thử lại; chờ điều phối chọn: log mẫu công khai + log Ch8 có sẵn, hoặc người tự chạy.
  Phiên sau: làm Ch6 (macOS) / Ch17 (phỏng vấn) trước — không phụ thuộc chuyện này.
- **24/11/2026 (phiên 13, agent `lgz`) — Chương 17 SOẠN CHI TIẾT** (4 bài: 17.1 30 câu phỏng vấn + khung trả lời 4 bước, 17.2 tám vòng đọc log 5 phút, 17.3 nghề + chứng chỉ, 17.4 quiz 10 câu; song ngữ). Tệp: `s17-phong-van.mjs` + `s17/`.
  Output thật: `_demo/s17/tra-loi.sh` (đuôi `.sh` — CHẠY trên gói log mẫu như s00–s02, container lgz-lab:1 qua `scratchpad/lgz/cong-cu/chay-ct.sh`, nay có --memory 2g). Số trong lời 17.1: 137 (80×502 + 57×504, giờ 14), 65/41/31, 25 ECONNREFUSED 14:04:25→14:08:20, 1 Accepted deploy, 74/45/41.
  17.2 KHÔNG chạy lệnh mới: lấy đoạn output thật của Ch7/8/10/11/12/13/16 theo KHOẢNG DÒNG (`doan(key, a, b)`) — chạy lại các chương đó thì soát khoảng dòng + lời giải 17.2.
  Chứng chỉ kiểm trang chính thức 24/11/2026: Security+ SY0-701 (EN ngừng 11/6/2027) / SY0-801 (17/11/2026), CySA+ CS0-004 (23/6/2026), SC-200, Splunk Core Certified User, BTL1 (£399).
  Còn "Đang soạn": Ch3, 4, 5 (Windows), 6 (macOS), 14 (chờ điều phối — xem báo cáo 16:35), 18. Pha B dừng ở lgz-10-4.
- **24/11/2026 (phiên 14, agent `lgz`) — Chương 3 SOẠN CHI TIẾT** (9 bài: 3.1 tour, 3.2 đọc một sự kiện, 3.3 nhánh Operational, 3.4 lọc/Custom View/xuất/gắn tác vụ, 3.5 kích thước/ghi đè/bên trong .evtx, 3.6 Reliability/crash, 3.7 log văn bản, Lab 3, quiz 10 câu; song ngữ). Tệp: `s03-event-viewer.mjs` + `s03/`.
  KHÔNG có máy Windows (VM bị điều phối xoá 17:40, chỉ đạo dùng mẫu công khai) ⇒ output thật đọc từ **bộ EVTX mẫu công khai 17 tệp** (~78 MB; omerbenamram/evtx samples + hayabusa-sample-evtx: DeepBlueCLI many-events-*, Defender, Firewall 2004, PowerShell 4103/4104);
  người học tải + kiểm SHA256 bằng `_demo/s03/mau/tai-mau.ps1.txt` (chạy thật: 17 OK). Bộ đọc tự viết `_demo/s03/bin/evtx-rec` (JSON: t/kenh/nguon/id/muc/task/kw/rec/may/sid/pid/data; bỏ qua bản ghi hỏng, chuẩn hoá giờ 7 chữ số lẻ), `evtx-xml`, `evtx-dau` (tiêu đề tệp: chunk, cờ DIRTY/FULL).
  Ảnh `lgz-win-mau:1` (`_demo/s03/anh/`: PowerShell 7.4 + pyevtx-rs 0.15.0 + jq), container `lgz-c03` (`cong-cu/ct.bash`, --network none, 2 GB), runner `cong-cu/chay-mau.py` (mặc định bash "$", tiền tố "@ps " = pwsh "PS>").
  Lệnh chỉ chạy trên Windows (eventvwr, Get-WinEvent -ListLog/-FilterXml, wevtutil, schtasks /sc onevent, perfmon /rel, Get-WindowsUpdateLog, sfc/DISM, setupapi) là KHỐI MÃ cho máy người học — không kèm output giả.
  Phát hiện thật đáng dạy (đã vào bài): Event ID trùng giữa provider (ID 1 ×3 provider, ID 1000 ×4 — chỉ 1 là crash); Keywords 0x8020/0x8010; .evtx = 4096 + n×65536 byte; log RDP đã quay vòng (#308 335 vs 1 795 bản ghi); Security 20 MB ≈ 21,2 giờ trên máy chủ mẫu (78 % nhiễu WFP);
  Lab 3: IE10Win7 — msiexec khởi động lại để cài VMware Tools 9.6.2 (26/11/2014 15:25 giờ máy), lần khởi động 18/8/2016 18:46Z bản ghi 5004 đi lùi = khôi phục snapshot.
  Chạy lại thì số không đổi (dữ liệu tĩnh). Tệp lệnh VM Windows viết sẵn nhưng CHƯA chạy: `scratchpad/lgz/win-chua-chay/` (Ch3–5) — chỉ dùng nếu sau này được phép dựng VM.
  Tiếp theo: Ch4 (mã sự kiện — mẫu: security*.evtx, Archive-ForwardedEvents 4624/4625/4648/47xx, dbc-many-events-security 4688/4616, EVTX-ATTACK-SAMPLES ở ~/.rtq-lgz/c14/evtx) → Ch5 (Get-WinEvent/FilterHashtable/XPath: viết lệnh Windows làm mã, đối chiếu kết quả bằng evtx-rec; XPath có thể kiểm bằng lxml) → Ch6 → Ch14 → Ch18.
- **24/11/2026 (phiên 15, agent `lgz`) — Chương 4 SOẠN CHI TIẾT** (10 bài: 4.1 đăng nhập 4624/4625/4634/4647 + Logon Type + Sub Status, 4.2 tài khoản/đặc quyền + giải mã UAC %%2048+n/%%2080+n, 4.3 can thiệp 1102/104/7040/4719/4616, 4.4 tắt/sập máy + bảng quyết định 41, 4.5 dịch vụ 7045/7036/7040 + PsExec/Metasploit + svchost sai thư mục, 4.6 4688/4698/4702/4104 + giải mã Invoke-Obfuscation, 4.7 RDP 1149/21–25/40/4778/4779/4825 + tscon hijack, 4.8 Defender 1116/1117/5007 + WU 19/20, Lab 4 (A máy ảo người học / B bảng tra 40 mẫu / C 6 thẻ sự kiện, lời giải che), quiz 15 câu BCAD×3+BCA; song ngữ). Tệp: `s04-ma-su-kien.mjs` + `s04/`.
  Output thật: `_demo/s04/*.bash` (9 tệp, chạy bằng `_demo/s03/cong-cu/chay-mau.py`, container dựng bằng `_demo/s04/cong-cu/ct.bash` — gắn /lab/mau = 17 tệp Ch3, /lab/tc = 40 tệp Ch4 ở `~/.rtq-lgz/c04/evtx`, /lab/s04 = bảng GUID). Bộ 40 tệp từ Yamato-Security/hayabusa-sample-evtx (gồm 11 tệp Ch14 cũ, truy nguồn bằng git blob sha1); người học tải + kiểm SHA256 bằng `_demo/s04/mau/tai-mau-ch4.ps1.txt` (chạy thật trong container có mạng: 40 OK — `tai-mau.out.txt`).
  Không có trong bộ mẫu (đếm thật = 0, giảng theo Microsoft Learn, người học tự tạo ở Lab 4A): 4740/4767, Kernel-Power 41/6008/BugCheck 1001, 7034/7031, .NET 1026, Defender 5001. Lab 4A là khối lệnh cho máy ảo người học — không kèm output (không có VM).
  Số trong lời (chạy lại thì soát): 4.1 dirty LogonType 5×2342/2×219/3×22/0×14/10×11/7×7/11×6, phiên 0x7ac7caf 18:16:23→20:00:58, SMB 3561 lần 16:50:06→16:52:49 (1198/1299/1064 theo phút); 4.3 90×104 + 1102 rec 109054, 30×4719; 4.4 dbc 1 lần khởi động không 6006 (= Lab 3); 4.5 7040 377/376; 4.7 1149 11 máy 2,4 s; 4.8 253×19 / 7×20, KB4025342 0x80248007 ×4.
  ATT&CK đã đánh số lại (kiểm 24/11/2026, liên kết cũ tự chuyển): T1070.001→T1685.005, T1070.002→T1685.006, T1562.001/006→T1685, T1562.002→T1685.001, T1562.004→T1686, T1562.009→T1688. Ch4 đã dùng số mới (ghi kèm số cũ). CHƯA sửa ở chương cũ: s07 7.4, s08 8.1/8.2, s13 13.4/13.6 (T1562.008), s15 15.4, s16 16.4, s17 17.1 — việc nhỏ cho phiên sau (thêm "số mới …").
  Tiếp theo: Ch5 (Get-WinEvent/FilterHashtable/XPath/wevtutil/audit policy/Sysmon/WEF — viết lệnh Windows làm mã, đối chiếu bằng evtx-rec + lxml cho XPath; dùng lại bộ mẫu c03 + c04) → Ch6 (macOS) → Ch14 → Ch18. Pha B dừng ở lgz-10-4.
- **24/11/2026 (phiên 16, agent `lgz`) — Chương 5 SOẠN CHI TIẾT** (9 bài: 5.1 Get-WinEvent từ số 0, 5.2 FilterHashtable, 5.3 XPath/FilterXml + ConvertFrom-EventData, 5.4 wevtutil + công cụ cmd, 5.5 audit policy + log PowerShell, 5.6 Sysmon, 5.7 đọc từ xa + WEF, Lab 5 "báo cáo buổi sáng", quiz 12 câu BCADCADBADBC; song ngữ). Tệp: `s05-dong-lenh-sysmon.mjs` + `s05/`.
  Không có Windows ⇒ **Get-WinEventMau** (`_demo/s05/bin/WinEventMau/WinEventMau.psm1` + `bin/evtx-obj`): cùng tên thuộc tính EventLogRecord, mới nhất trước/-Oldest, FilterHashtable → XPath (thứ tự khoá cố định — bảng băm .NET xáo thứ tự!), -Verbose in QueryList, XPath chấm bằng .NET trên XML thật,
  từ chối contains()/starts-with(), timediff() (cần -Now đóng băng) và band(Keywords); lọc trước theo EventID trong evtx-obj (--id=) khi XPath bắt đầu bằng EventID. Bẫy đã gặp: splat mảng một phần tử thành chuỗi ([string[]] bắt buộc); ConvertFrom-Json của PS7 tự đổi ISO → DateTime;
  gom JSON 62 000 bản ghi một lần ⇒ OOM 2 GB ⇒ xử lý theo dòng; `switch` đổi `$_`. Container `lgz-c03` dựng bằng `_demo/s05/cong-cu/ct.bash` (thêm /lab/sm = 13 tệp Sysmon ở `~/.rtq-lgz/c05/evtx`, PSModulePath, NO_COLOR=1); tải mẫu: `_demo/s05/mau/tai-mau-ch5.ps1.txt` (13 OK).
  Phát hiện thật đã vào bài: Security Level 0 ⇒ Level=4 không ra (dùng Keywords); Event ID 4625 của EventSystem (Application, 38 sự kiện) và "1000/1002" của LoadPerf (45 sự kiện ngày 3/9/2016) ⇒ luôn lọc kèm LogName/ProviderName;
  security_big_sample: 149 wevtutil + 1102 cùng Logon ID 0x32cfb trong 10 s, 4688 v0 không CommandLine; dbc IE10Win7 4688 675 v0 / 7472 v1 có / 199 v1 rỗng (KB3004375, 10/2/2015); Sysmon ID 22 = 0 trong mẫu công khai (giảng theo docs);
  Lab 5 (Bao-CaoSang.ps1): 9 dịch vụ Metasploit tối 19/9/2016, 13 dịch vụ (3 hợp lệ + 10 tấn công từ 19:59:33) ngày 18/8/2016, 6005 lúc 18:46:20 = khôi phục snapshot.
  ATT&CK đánh số lại thêm: T1562.010 Downgrade Attack → **T1689**. Việc nhỏ còn treo: ghi số mới ở s07 7.4, s08 8.1/8.2, s13 13.4/13.6, s15 15.4, s16 16.4, s17 17.1.
  Tiếp theo: Ch6 (macOS) → Ch14 → Ch18 (chỉ đạo 12:30: xong pha A rồi mới video). ~/.rtq-lgz/c05 (2,9 MB mẫu Sysmon) giữ cho Ch14/18.
- **24/11/2026 (phiên 17, agent `lgz`) — Chương 14 SOẠN CHI TIẾT** (9 bài: 14.1 brute force/spraying/stuffing + ngưỡng, 14.2 đường nền + "lần đầu thấy" + impossible travel + RDP qua đường hầm, 14.3 leo thang/bám trụ (sudo, useradd, auditd auid, cron/systemd nguỵ trang; Windows 4720/4732/4698/7045/Sysmon 13), 14.4 xoá dấu vết (so bản logsrv, phiên mồ côi, khoảng lặng, birth time, 1102/104; Equifax 2017), 14.5 dòng thời gian UTC + công cụ dong-thoi-gian.py + bảng sự cố, 14.6 ATT&CK v19.2 (Detection Strategy/Analytic, kiểm độ phủ 17/19), 14.7 SIEM + đọc/chấm 6 quy tắc SigmaHQ bằng sigma-mini.py (Target 2013), Lab 14 (api02: ffuf → đoán mật khẩu admin → webshell → miner cron www-data; + jump01/fs01 EVTX), quiz 12 câu BCADCADBADBC; song ngữ). Tệp: `s14-dieu-tra.mjs` + `s14/`.
  Dữ liệu: KHÔNG dựng tấn công thật (bộ lọc an toàn đã chặn ở phiên 12) ⇒ `_demo/s14/tao-vu.py` SINH hai bộ log tất định (vu14 = web01, lab14 = api02; Ubuntu 24.04 rsyslog RFC 3339, sshd/sudo/useradd/auditd, nginx, pino) — bài nói rõ là log sinh. Windows = EVTX công khai Ch3 + Ch4. Container `lgz-c03` dựng bằng `_demo/s14/cong-cu/ct.bash` (gắn ~/.rtq-lgz/c14/sinh/{vu14,lab14}, c04, c03, sigma); chạy lại tất cả: `bash _demo/s14/chay-s14.bash` (sinh lại + dựng container + 8 tệp .bash) rồi sinh-ma. Đã xoá container.
  Bẫy đã gặp: bind mount mất khi xoá/sinh lại thư mục ⇒ luôn dựng lại container sau khi sinh; output có dòng bắt đầu "$ " bị lenh() tách thành lệnh riêng ⇒ dấu nhắc trong dữ liệu là "web01:~$ "; ảnh lgz-win-mau không có tzdata ⇒ dùng TZ='<+07>-7'; PS7 ConvertFrom-Json đổi .t thành DateTime (dùng .ToString).
  Số trong lời (tất định): 598×401/40 IP/598 tài khoản/242 no_such_user; spray 74 Failed 3 đợt 01:40/01:57/02:14, Accepted deploy 02:14:01; 216 dòng bị xoá; LẶNG 426/427 phút; dòng thời gian 46 hàng; Sigma 7/89/8/1/0/0; Lab 625 lần cron, 1240 ffuf, 37×401.
  ATT&CK kiểm 24/11/2026: v19.2; 15 chiến thuật (Stealth + Defense Impairment thay Defense Evasion); T1562.012 → T1685.004. Pháp lý VN: Luật BVDLCN 91/2025/QH15 (hiệu lực 1/1/2026), thông báo 72 giờ (nguồn báo chí — chưa đọc nguyên văn điều luật).
  Ch6 (macOS) BỊ CHẶN: bộ phân loại an toàn của Claude Code từ chối chạy bộ đọc unified log tải về (nhị phân Mandiant unifiedlog_iterator v0.7.0; ảnh docker cài UnifiedLogReader 0.3) — cần người cho phép hoặc cấp bản `log show --style ndjson` từ Mac thật. Mẫu: ~/.rtq-lgz/c06/tai/test_data.zip (667 MB, sha256 fdddef89…4a2a, 7 .logarchive) + bin/ (đã xoá bản giải nén).
  Còn "Đang soạn": Ch6 (chặn), Ch18 (7 bài — dự án cuối khoá; có thể dùng lại tao-vu.py/ chiến lược log sinh + EVTX công khai). Việc nhỏ còn treo: số ATT&CK mới ở s07 7.4, s08 8.1/8.2, s13 13.4/13.6, s15 15.4, s16 16.4, s17 17.1.
- **24/11/2026 (phiên 18, agent `lgz`) — Chương 18 SOẠN CHI TIẾT** (7 bài: 18.1 đề bài + 15 câu hỏi, 18.2 thu thập/băm/chuẩn hoá giờ/đo lệch router/nạp Loki, 18.3 điều tra 15 câu (lời giải che),
  18.4 dòng thời gian 21 hàng + 19 kỹ thuật ATT&CK có kiểm bằng chứng, 18.5 báo cáo mẫu + bài nói 5 phút + thang 100 điểm, 18.6 tự dựng đề (tất định, chèn sự kiện), 18.7 thi cuối 30 câu QUIZ).
  Dữ liệu: `_demo/s18/tao-su-co.py` SINH tất định bộ su-co18 (công ty giả định Hoa Sen Travel: vps01 Ubuntu 24.04 + rt01 OpenWrt + PC-DEV01 Windows 11; 24 tệp, 5 MB, 8 định dạng).
  Định dạng đối chiếu thật: csvlog PostgreSQL 16.16 (chạy postgres:16 thật 24/11 — nháy kép, "connection authenticated: identity=… method=scram-sha-256 (…pg_hba.conf:N)", "duration: N ms  statement:"),
  containerd "connecting to shim"/systemd "Started docker-<id>.scope" (journal máy Fedora). Chạy lại: `bash _demo/s18/chay-s18.bash` (sinh lại + lgz-c18-loki + lgz-c03 chung netns, --network none, rồi xoá) → sinh-ma.
  Bẫy đã gặp: Loki 3.7 KHÔNG trả dòng cũ hơn 3 giờ còn ở ingester (querier.query_ingesters_within 3h; đặt 0 không ăn) ⇒ nap-loki.py gọi POST /flush rồi chờ; `query_ingesters_within` không có trong limits_config;
  dòng "$ …" trong tệp thu-thap/ làm lenh() tách khối (18.3 dùng đủ chỉ số 0–40); __pycache__ của mau/ lọt vào _ma.mjs nếu chạy python trên máy ⇒ xoá trước sinh-ma.
  Số trong lời (tất định): 24 tệp; auth.log.1 e1349ff0…; router chậm 97 s (15 cặp −98,1…−97,2); Loki 19 364 dòng/7 luồng; sqlmap 46 (40×400) 14:48:10–14:55:01Z; rải SSH 35 lần 15:03:12–15:37:09Z;
  Accepted deploy .52 15:34:17Z / .77 15:41:07Z; NOT in sudoers 15:42:31Z; container b0a903430d8b 15:44:30–16:21:40Z; cron apt-compat 15:48:01Z, 206 lần; PTR 254 → 5 tên; 4625×16, 4740 15:57:53Z;
  cache.php Birth 16:05:44Z, 11 req; auth.log.1 Birth 16:19:55Z, 144 dòng chỉ còn trong journal, 130/109 mồ côi; COPY khach_hang 19:14:27Z 8412 ms; kh.csv.gz 19:19:12Z 3 486 215 B, 404 19:21:40Z; dòng thời gian 443 → 44 hàng.
  18.1 nặng 108 KB vì nhúng tao-su-co.py (≈ 44 KB) ở cả EN và VI trong <details> "⚠️ chứa đáp án". Video Ch18 sẽ làm: 18.1–18.6 (18.7 quiz ⇒ không video). Còn "Đang soạn": CHỈ Ch6 (bị chặn — xem phiên 17).

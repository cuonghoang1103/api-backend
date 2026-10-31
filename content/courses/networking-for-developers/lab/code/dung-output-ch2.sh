#!/bin/bash
# Chạy lại TOÀN BỘ output của Chương 2 theo đúng thứ tự (nhiều kịch bản cần 2–3 máy phối hợp). Từ thư mục lab/:
#   bash code/dung-output-ch2.sh
# Cần: ảnh net-lab và net-lab-inet (moi-truong/Dockerfile.inet). Lab Ch1 (nfd) cho bài 2.1, "Internet trong một hộp" (nfi) cho 2.2–2.5.
set -e
cd "$(dirname "$0")/.."
giu_do() { if [ "${DO_LAI:-0}" = 1 ] || [ ! -s "out/${3:-$(basename "$2" .sh)}.out.txt" ]; then ./chay.sh "$@"; else echo "· giữ out/${3:-$(basename "$2" .sh)}.out.txt (phép đo đã trích — DO_LAI=1 để đo lại)"; fi; }
C="docker compose -f moi-truong/compose.yml -p nfd"
I="docker compose -f moi-truong/internet.yml -p nfi"
# ── 2.1 trên lab Ch1 (dựng lại sạch: client2 bị đổi địa chỉ trong bài) ──
$C down >/dev/null 2>&1 || true; $C up -d >/dev/null 2>&1; sleep 3
./chay.sh client ch02/c21-dia-chi.sh
./chay.sh client2 ch02/c21-sai-mask.sh
./chay.sh client ch02/c21-chia.sh
python3 chay-host.py code/ch02/c21-docker.sh c21-docker
$C down >/dev/null 2>&1
# ── 2.2–2.5 trên "Internet trong một hộp" ──
$I down >/dev/null 2>&1 || true; $I up -d >/dev/null 2>&1; sleep 15
# 2.2 định tuyến
./chay.sh nfi-laptop ch02/c22-laptop.sh
./chay.sh nfi-homegw ch02/c22-routers.sh
./chay.sh nfi-isp ch02/c22-isp.sh
./chay.sh nfi-laptop ch02/c22-trace.sh
./chay.sh nfi-dc ch02/c22-dc-chan.sh; ./chay.sh nfi-laptop ch02/c22-sao.sh; ./chay.sh nfi-dc ch02/c22-dc-mo.sh
./chay.sh nfi-dc ch02/c22-dc-vong.sh; ./chay.sh nfi-laptop ch02/c22-vong.sh; ./chay.sh nfi-dc ch02/c22-dc-sua.sh
./chay.sh internet ch02/c22-docker-desktop.sh
# 2.3 NAT: bắt hai phía router nhà trong lúc laptop + phone gọi (cùng cổng nguồn 41000)
# Bài TRÍCH số cổng bị viết lại (41000 ⇒ 59074) và giây còn lại của conntrack ⇒ bộ ba laptop/phone/homegw là output GIỮ
# (chạy lại cho số ngẫu nhiên khác ⇒ phải sửa lời bài). DO_LAI=1 để bắt lại cả bộ ba cùng lúc.
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c23-homegw.out.txt ]; then
docker exec -d nfi-homegw sh -c "tcpdump -i lan0 -n -U -w /tmp/lan.pcap tcp port 80 >/dev/null 2>&1"
docker exec -d nfi-homegw sh -c "tcpdump -i wan0 -n -U -w /tmp/wan.pcap tcp port 80 >/dev/null 2>&1"; sleep 2
docker exec nfi-homegw conntrack -F >/dev/null 2>&1 || true
./chay.sh nfi-laptop ch02/c23-laptop.sh; ./chay.sh nfi-phone ch02/c23-phone.sh; sleep 1
docker exec nfi-homegw pkill -INT tcpdump; sleep 1
./chay.sh nfi-homegw ch02/c23-homegw.sh
else echo "· giữ out/c23-laptop, c23-phone, c23-homegw (số cổng đã trích — DO_LAI=1 để bắt lại)"; fi
./chay.sh nfi-homegw ch02/c23-timeout.sh
docker exec -d nfi-laptop sh -c 'cd /tmp && echo "hello from the laptop dev server (192.168.50.10:8080)" > index.html && exec python3 -m http.server 8080 >/dev/null 2>&1'; sleep 1
./chay.sh nfi-server ch02/c23-vao.sh; ./chay.sh nfi-homegw ch02/c23-dnat.sh; ./chay.sh nfi-server ch02/c23-vao2.sh
./chay.sh nfi-mobile ch02/c23-mobile.sh; ./chay.sh nfi-isp ch02/c23-isp.sh; ./chay.sh nfi-server ch02/c23-vao3.sh
docker exec nfi-homegw iptables -t nat -D PREROUTING -i wan0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.50.10:8080
docker exec nfi-laptop pkill -f http.server || true
# c23-docker: bài TRÍCH IP container (172.17.0.5) và IP người gọi (192.168.65.1) — tuỳ máy/thời điểm ⇒ GIỮ
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c23-docker.out.txt ]; then python3 chay-host.py code/ch02/c23-docker.sh c23-docker; else echo "· giữ out/c23-docker.out.txt"; fi
# 2.4 IPv6 (Happy Eyeballs là phép ĐO thời gian được trích trong bài ⇒ giu_do)
./chay.sh nfi-laptop ch02/c24-dia-chi.sh; ./chay.sh nfi-laptop ch02/c24-ndp.sh; ./chay.sh nfi-laptop ch02/c24-dual.sh
./chay.sh nfi-isp ch02/c24-isp-hong.sh; giu_do nfi-laptop ch02/c24-happy.sh; ./chay.sh nfi-isp ch02/c24-isp-sua.sh
./chay.sh nfi-laptop ch02/c24-localhost.sh; ./chay.sh nfi-laptop ch02/c24-mac-dinh.sh
./chay.sh nfi-server ch02/c24-nghe.sh; ./chay.sh nfi-laptop ch02/c24-goi-nghe.sh; docker exec nfi-server pkill -f createServer || true
# 2.5 BGP: bảng → cướp tuyến (cụ thể hơn) → lọc → rút tuyến kiểu Facebook → quảng bá lại; rồi Internet thật (RIPEstat)
./chay.sh nfi-isp ch02/c25-isp.sh; ./chay.sh nfi-dc ch02/c25-dc.sh
# rút tuyến TRƯỚC cướp tuyến: câu hỏi DNS treo lại từ lúc bị cướp (đi vào hố đen) làm dnsmasq trả lời lệch ID ở bước sau
./chay.sh nfi-dc ch02/c25-dc-rut.sh; ./chay.sh nfi-isp ch02/c25-isp-rut.sh; ./chay.sh nfi-laptop ch02/c25-laptop-rut.sh
./chay.sh nfi-dc ch02/c25-dc-lai.sh; ./chay.sh nfi-laptop ch02/c25-laptop-lai.sh
./chay.sh nfi-rogue ch02/c25-rogue-cuop.sh; sleep 3
./chay.sh nfi-isp ch02/c25-isp-cuop.sh; ./chay.sh nfi-laptop ch02/c25-laptop-cuop.sh; ./chay.sh nfi-dc ch02/c25-dc-thay.sh
./chay.sh nfi-isp ch02/c25-isp-loc.sh; ./chay.sh nfi-laptop ch02/c25-laptop-ok.sh
giu_do internet ch02/c25-that.sh
# Lab 2 (lời giải) — xem code/ch02/lab2/
[ -x code/ch02/lab2/chay-loi-giai.sh ] && bash code/ch02/lab2/chay-loi-giai.sh
$I down >/dev/null 2>&1
echo "✓ Chương 2: xong"

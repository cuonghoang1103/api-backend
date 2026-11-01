#!/bin/bash
# Chạy lại TOÀN BỘ output của Chương 3 (DNS) theo đúng thứ tự. Từ thư mục lab/:
#   bash code/dung-output-ch3.sh            (≈12 phút lần đầu; Lab 3 thêm ≈6 phút)     DO_LAI=1 ⇒ đo lại cả các output GIỮ (rồi SỬA lời bài theo số mới)
# Cần ảnh: net-lab ⇒ net-lab-inet ⇒ net-lab-dns (moi-truong/Dockerfile.dns) ⇒ net-lab-systemd (Dockerfile.systemd).
# Lab: "Internet trong một hộp" + phần DNS: docker compose -f moi-truong/internet.yml -f moi-truong/dns.yml -p nfi
# Khoá DNSSEC sinh mới mỗi lần dựng lại (down -v) ⇒ mã khoá (key tag) trong output đổi theo — bài KHÔNG trích key tag bằng chữ.
set -e
cd "$(dirname "$0")/.."
giu_do() { if [ "${DO_LAI:-0}" = 1 ] || [ ! -s "out/${3:-$(basename "$2" .sh)}.out.txt" ]; then ./chay.sh "$@"; else echo "· giữ out/${3:-$(basename "$2" .sh)}.out.txt (phép đo đã trích — DO_LAI=1 để đo lại)"; fi; }
I="docker compose -f moi-truong/internet.yml -f moi-truong/dns.yml -p nfi"
xoa_cache() { docker exec nfi-isp unbound-control reload >/dev/null; for p in pop1 pop2; do docker exec nfi-$p unbound-control reload >/dev/null; done; }
if [ "${GIU_LAB:-0}" != 1 ]; then
  $I down -v >/dev/null 2>&1 || true; docker rm -f nfi-ubuntu >/dev/null 2>&1 || true
  $I up -d >/dev/null 2>&1; sleep 25
fi
# ── 3.1 phân giải ──
# c31-dig + bộ bắt gói c31-isp-doc: bài TRÍCH thời gian (13 ms / 0 ms, 9 câu trong 9,7 ms, ns1/ns2 nào trả lời) ⇒ GIỮ
xoa_cache
giu_do nfi-laptop ch03/c31-dig.sh
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c31-isp-doc.out.txt ]; then
  xoa_cache
  docker exec -d nfi-isp sh -c "rm -f /tmp/r.pcap; tcpdump -i any -n -U -w /tmp/r.pcap udp port 53 >/dev/null 2>&1"; sleep 2
  ./chay.sh nfi-laptop ch03/c31-laptop-hoi.sh
  ./chay.sh nfi-isp ch03/c31-isp-doc.sh
else echo "· giữ out/c31-laptop-hoi, c31-isp-doc"; fi
./chay.sh nfi-laptop ch03/c31-tay.sh
./chay.sh nfi-laptop ch03/c31-trace.sh
./chay.sh nfi-laptop ch03/c31-stub.sh
./chay.sh nfi-laptop ch03/c31-ndots.sh
bash code/ch03/c31-ubuntu-dung.sh
./chay.sh nfi-ubuntu ch03/c31-ubuntu.sh
giu_do internet ch03/c31-goc.sh
vung_lai() { docker exec nfi-ns bash -c 'bash /lab/k/moi-truong/dns/ky.sh lai labflow.test && rndc reload labflow.test' >/dev/null; sleep 1
             docker exec nfi-ns2 rndc retransfer labflow.test >/dev/null; sleep 2; xoa_cache; }
# ── 3.2 bản ghi ──
# c32-hoi, c32-node (thứ tự SRV/TXT ngẫu nhiên), c32-ns2-log (74 bản ghi, 5,1 kB): mô phỏng zone + lời bài dùng ⇒ GIỮ
giu_do nfi-laptop ch03/c32-hoi.sh
giu_do nfi-laptop ch03/c32-node.sh
./chay.sh nfi-ns ch03/c32-kiem.sh
./chay.sh nfi-laptop ch03/c32-axfr.sh
./chay.sh nfi-ns2 ch03/c32-axfr-ns2.sh
./chay.sh nfi-ns ch03/c32-serial-quen.sh; sleep 2
./chay.sh nfi-laptop ch03/c32-serial-hoi.sh c32-serial-hoi
./chay.sh nfi-ns ch03/c32-serial-sua.sh; sleep 3
./chay.sh nfi-laptop ch03/c32-serial-hoi.sh c32-serial-hoi2
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c32-ns2-log.out.txt ]; then python3 chay-host.py code/ch03/c32-ns2-log.sh c32-ns2-log; else echo "· giữ out/c32-ns2-log.out.txt"; fi
giu_do internet ch03/c32-that.sh
# ── 3.3 TTL và cache ── (dòng thời gian ~3 phút là phép ĐO được trích ⇒ GIỮ)
vung_lai
giu_do nfi-laptop ch03/c33-dem.sh
./chay.sh nfi-isp ch03/c33-isp-cache.sh
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c33-theo-doc.out.txt ]; then
  vung_lai
  docker exec -d nfi-laptop bash /lab/k/code/ch03/c33-theo.sh; sleep 5
  ./chay.sh nfi-ns ch03/c33-ns-ha.sh; sleep 10
  ./chay.sh nfi-ns ch03/c33-ns-doi.sh; sleep 125
  ./chay.sh nfi-ns ch03/c33-ns-doi2.sh; sleep 45
  ./chay.sh nfi-laptop ch03/c33-theo-doc.sh
else echo "· giữ out/c33-ns-ha, c33-ns-doi, c33-ns-doi2, c33-theo-doc (dòng thời gian đã trích — DO_LAI=1 để đo lại)"; fi
# cache âm: bài + mô phỏng trích "298 s còn lại" ⇒ GIỮ cả chuỗi
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c33-am3.out.txt ]; then
  ./chay.sh nfi-laptop ch03/c33-am.sh
  ./chay.sh nfi-ns ch03/c33-am-ns.sh; sleep 2
  ./chay.sh nfi-laptop ch03/c33-am2.sh
  ./chay.sh nfi-isp ch03/c33-am-xoa1.sh; ./chay.sh nfi-laptop ch03/c33-am3.sh c33-am3a; ./chay.sh nfi-laptop ch03/c33-am.sh c33-am3b
  ./chay.sh nfi-isp ch03/c33-am-xoa2.sh; ./chay.sh nfi-laptop ch03/c33-am3.sh c33-am3
else echo "· giữ out/c33-am*, c33-am3*"; fi
vung_lai
giu_do nfi-laptop ch03/c33-app.sh
docker exec nfi-isp unbound-control flush_infra all >/dev/null   # resolver quên máy chủ chết (không thì nó trả SERVFAIL ngay, xem 3.5)
giu_do nfi-laptop ch03/c33-treo.sh
docker exec nfi-isp unbound-control flush_infra all >/dev/null
giu_do nfi-laptop ch03/c33-treo8.sh
docker exec nfi-isp unbound-control flush_infra all >/dev/null
giu_do internet ch03/c33-that.sh
# ── 3.4 anycast, GeoDNS, round robin ──
vung_lai
./chay.sh nfi-laptop ch03/c34-anycast.sh
./chay.sh nfi-server ch03/c34-anycast-dc.sh
./chay.sh nfi-isp ch03/c34-bgp.sh
./chay.sh nfi-laptop ch03/c34-geo.sh
./chay.sh nfi-ns2 ch03/c34-geo-dc.sh
# rút anycast: dòng thời gian từng giây (bài trích "đổi trong một giây") ⇒ GIỮ
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c34-theo-doc.out.txt ]; then
  docker exec -d nfi-laptop bash /lab/k/code/ch03/c34-theo.sh; sleep 3
  ./chay.sh nfi-pop1 ch03/c34-pop1-rut.sh; sleep 9
  ./chay.sh nfi-laptop ch03/c34-theo-doc.sh
else docker exec nfi-pop1 vtysh -c 'configure terminal' -c 'router bgp 64530' -c 'address-family ipv4 unicast' -c 'no network 198.19.1.0/24'; sleep 3
  echo "· giữ out/c34-pop1-rut, c34-theo-doc"; fi
docker exec nfi-pop1 unbound-control reload >/dev/null; docker exec nfi-pop2 unbound-control reload >/dev/null
./chay.sh nfi-laptop ch03/c34-geo-sai.sh
./chay.sh nfi-pop1 ch03/c34-pop1-lai.sh; sleep 3
./chay.sh nfi-ns ch03/c34-rr-ns.sh; sleep 2
giu_do nfi-laptop ch03/c34-rr.sh
giu_do nfi-laptop ch03/c34-rr-thu.sh
giu_do internet ch03/c34-that.sh
# ── 3.5 DNSSEC, DoT/DoH, các kiểu hỏng ──
vung_lai
giu_do nfi-laptop ch03/c35-chuoi.sh   # mô phỏng dnssec dùng mã khoá/DS của lần chạy này ⇒ GIỮ
# sự cố chữ ký hết hạn + bắt gói DoT/DoH: mô phỏng dnssec dùng nguyên văn (id, ngày, độ dài gói) ⇒ GIỮ cả hai khối
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c35-sua-hoi2.out.txt ]; then
  ./chay.sh nfi-ns ch03/c35-ky-hong.sh; sleep 3; docker exec nfi-isp unbound-control flush_zone labflow.test >/dev/null
  ./chay.sh nfi-laptop ch03/c35-hong.sh
  ./chay.sh nfi-ns ch03/c35-ky-sua.sh; sleep 3
  ./chay.sh nfi-laptop ch03/c35-sua-hoi.sh
  ./chay.sh nfi-isp ch03/c35-isp-bogus.sh
  ./chay.sh nfi-laptop ch03/c35-sua-hoi.sh c35-sua-hoi2
else echo "· giữ out/c35-ky-hong, c35-hong, c35-ky-sua, c35-sua-hoi, c35-isp-bogus, c35-sua-hoi2"; fi
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c35-rieng-doc.out.txt ]; then
  docker exec -d nfi-homegw sh -c "rm -f /tmp/w.pcap; tcpdump -i wan0 -n -U -w /tmp/w.pcap host 198.51.100.1 >/dev/null 2>&1"; sleep 2
  ./chay.sh nfi-laptop ch03/c35-rieng-laptop.sh
  ./chay.sh nfi-homegw ch03/c35-rieng-doc.sh
else echo "· giữ out/c35-rieng-laptop, c35-rieng-doc"; fi
# máy chủ tên chết: 3 câu hết giờ rồi SERVFAIL ngay (bài trích) ⇒ GIỮ
docker exec nfi-isp unbound-control flush_infra all >/dev/null
giu_do nfi-laptop ch03/c35-dead.sh
giu_do nfi-isp ch03/c35-isp-infra.sh
./chay.sh nfi-laptop ch03/c35-het-han.sh
docker stop nfi-ns2 >/dev/null
giu_do nfi-isp ch03/c35-mot-ns.sh
docker start nfi-ns2 >/dev/null; sleep 3
giu_do internet ch03/c35-that.sh
# Lab 3 (lời giải, dựng lại lab sạch): bash code/ch03/lab3/chay-loi-giai.sh

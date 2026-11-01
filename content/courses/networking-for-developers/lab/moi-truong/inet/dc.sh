#!/bin/bash
# dc — router của trung tâm dữ liệu AS64510 (nơi LabFlow đặt máy chủ): ix0 (192.0.2.3) ↔ dc0 (203.0.113.1).
ip -6 route add blackhole 2001:db8:d::/48
ip route del default 2>/dev/null; ip -6 route del default 2>/dev/null
bash /lab/k/moi-truong/inet/frr.sh "${FRR_VAI:-dc}"   # Chương 3: FRR_VAI=dc-dns (thêm phiên với pop2)
exec sleep infinity

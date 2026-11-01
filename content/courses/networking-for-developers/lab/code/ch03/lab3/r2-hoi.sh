# Lab 3 · R2 — từ laptop: cả hai máy chủ tên đều đã có bản ghi mới (hỏi thẳng, không qua cache)
for ns in 203.0.113.53 203.0.113.54; do echo "== $ns"; dig +short @$ns labflow.test SOA; dig +short @$ns status.labflow.test; dig +short @$ns labflow.test MX | sort; dig +short @$ns labflow.test CAA; done

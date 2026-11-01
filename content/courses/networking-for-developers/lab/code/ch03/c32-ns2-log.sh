# Ch3 · 3.2 — log của ns2 (named -g ⇒ docker logs): nhận NOTIFY từ ns1 và chép vùng có serial mới
docker logs nfi-ns2 2>&1 | grep -E 'notify from|Transfer completed' | tail -2 | sed -E 's/ 0x[0-9a-f]+:/:/'

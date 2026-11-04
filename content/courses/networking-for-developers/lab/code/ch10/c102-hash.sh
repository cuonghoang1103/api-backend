# Ch10 · 10.2 — consistent hash theo ?user=: cùng user luôn về cùng backend (sticky), user khác có thể khác.
for i in 1 2 3; do curl -s "http://10.10.2.10:8081/?user=alice" | grep -o '"backend":"[^"]*"'; done
for i in 1 2 3; do curl -s "http://10.10.2.10:8081/?user=bob"   | grep -o '"backend":"[^"]*"'; done

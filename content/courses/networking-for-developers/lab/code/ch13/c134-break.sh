# Ch13 · 13.4 — LÀM HỎNG CÓ CHỦ ĐÍCH rồi chẩn đoán theo tầng: 504 (upstream chậm), 502 (upstream chết), cổng đóng (refused).
echo "== break: slow upstream vs 1s timeout -> 504 ; dead upstream -> 502 =="
curl -s -o /dev/null -w "  /timeout -> %{http_code}\n" http://10.10.2.10:8080/timeout
curl -s -o /dev/null -w "  /dead    -> %{http_code}\n" http://10.10.2.10:8080/dead
echo "== diagnose the port layer: edge up (8080), a closed port refused (8099) =="
nc -zv 10.10.2.10 8080 2>&1; nc -zv -w1 10.10.2.10 8099 2>&1

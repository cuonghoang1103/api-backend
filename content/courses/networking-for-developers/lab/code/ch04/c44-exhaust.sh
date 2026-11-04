# Ch4 · 4.4 — cạn cổng tạm: ép dùng đúng 3 cổng nguồn, không keep-alive ⇒ TIME-WAIT khoá cổng
for i in 1 2 3 4; do
  curl -so /dev/null -w "lần $i: cổng-nguồn %{local_port}  exit=%{exitcode}\n" --local-port 50010-50012 http://10.10.2.10/ || echo "lần $i: KHÔNG bind được cổng nguồn (exit $?)"
done

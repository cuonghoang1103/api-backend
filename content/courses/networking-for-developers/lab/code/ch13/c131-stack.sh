# Ch13 · 13.1 — đường đi request của capstone chạy: client → nginx (edge :8080) → api (Node). stack.conf KHÔNG đặt X-Forwarded-For ⇒ forwardedFor null (biên production phải thêm proxy_set_header X-Forwarded-For).
curl -s http://10.10.2.10:8080/api/hello

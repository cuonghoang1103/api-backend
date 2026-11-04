# Ch7 · 7.5 — qua một proxy: máy chủ app thấy IP của PROXY (seenFrom), còn IP THẬT của client nằm ở X-Forwarded-For
curl -s http://10.10.2.10/api/who | python3 -m json.tool

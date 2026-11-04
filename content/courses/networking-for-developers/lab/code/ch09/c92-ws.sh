# Ch9 · 9.2 — WebSocket: curl làm được cú bắt tay nâng cấp (101 + Sec-WebSocket-Accept); client thô đọc khung text/ping/pong.
# Key mẫu dGhlIHNhbXBsZSBub25jZQ== của RFC 6455 ⇒ accept PHẢI là s3pPLMBiTxaQ9kYGzzhZRbK+xOo= (tính bằng SHA-1).
curl -s -i --http1.1 -N --max-time 2 -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" -H "Sec-WebSocket-Version: 13" http://10.10.2.20:5200/ 2>/dev/null | head -5
node /lab/k/code/ch09/ws-client.mjs 10.10.2.20:5200

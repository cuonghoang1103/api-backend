# Ch5 · 5.2 — khám phá HTTP/3: máy chủ quảng cáo QUIC bằng header Alt-Svc (đo trên Internet thật)
curl -sI --max-time 10 https://www.cloudflare.com/ | grep -i alt-svc
curl -sI --max-time 10 https://www.google.com/  | grep -i alt-svc

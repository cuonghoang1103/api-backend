# Ch7 · 7.3 — trình duyệt khám phá HTTP/3 qua Alt-Svc trên Internet thật (lần đầu đi h2, lần sau thử h3)
curl -sI --max-time 10 https://www.cloudflare.com/ | grep -i alt-svc
curl -sI --max-time 10 https://blog.cloudflare.com/ | grep -i alt-svc

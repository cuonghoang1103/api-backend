# Ch3 · 3.4 — Internet THẬT: cuongthai.com trỏ thẳng về VPS; media.cuongthai.com đi qua Cloudflare (proxy) — IP của ai? (tra AS qua Team Cymru)
dig +short cuongthai.com
dig +short TXT 208.1.187.160.origin.asn.cymru.com
dig +short media.cuongthai.com
dig +short TXT 19.161.67.172.origin.asn.cymru.com
curl -sI https://media.cuongthai.com/ | grep -i -E '^(server|cf-ray):'
curl -sI https://cuongthai.com/ | grep -i -E '^(server|cf-ray):'
dig @1.1.1.1 id.server CH TXT +short

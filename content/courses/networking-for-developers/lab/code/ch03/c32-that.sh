# Ch3 · 3.2 — Internet THẬT: bản ghi của cuongthai.com (Cloudflare giữ DNS). TXT chỉ in dòng SPF.
dig +noall +answer cuongthai.com A
dig +noall +answer www.cuongthai.com A
dig +noall +answer cuongthai.com MX
dig +short cuongthai.com TXT | grep -o '^"v=spf1[^"]*"'
dig +noall +answer _dmarc.cuongthai.com TXT
dig +noall +answer cuongthai.com SOA
dig +noall +answer cuongthai.com CAA
dig +noall +answer media.cuongthai.com HTTPS
dig +noall +answer cuongthai.com ANY @kyrie.ns.cloudflare.com
dig +short -x 1.1.1.1

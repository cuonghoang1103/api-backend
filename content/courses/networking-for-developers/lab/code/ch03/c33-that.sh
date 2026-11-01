# Ch3 · 3.3 — Internet THẬT: TTL mà máy chủ tên của cuongthai.com (Cloudflare) đặt, và TTL ÂM khi hỏi một tên chưa có
dig +noall +answer cuongthai.com @kyrie.ns.cloudflare.com
dig chua-co-ten-nay.cuongthai.com @kyrie.ns.cloudflare.com | grep -E 'status|SOA'

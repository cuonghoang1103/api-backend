# Ch3 · 3.1 — Internet THẬT: 13 tên máy chủ gốc, và mỗi tên là nhiều máy ở nhiều nơi (anycast) — hỏi từng máy "anh là bản nào?"
dig +short NS . | sort
for l in a b c d e f j k m; do printf '%s.root-servers.net  ' $l; dig @$l.root-servers.net id.server CH TXT +short +time=2 +tries=1; done
dig +trace +nodnssec cuongthai.com

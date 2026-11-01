# Ch3 · 3.4 — từ laptop ở nhà: DNS công cộng 198.19.1.1 — "anh là máy nào?" (id.server) và gói đi đường nào
dig @198.19.1.1 id.server CH TXT +short
traceroute -n -q 1 198.19.1.1

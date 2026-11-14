# 14.1 · máy chép MAC (nft-ke) tải tệp 50 MB, giới hạn 4 MB/s, CÙNG LÚC với laptop Windows
ip -br addr show sv
curl -sS -o /dev/null --limit-rate 4M -m 15 -w "ke: HTTP %{http_code}, %{size_download} byte, %{time_total} s\n" http://news.test/big.bin
ping -q -c 50 -i 0.1 198.18.0.10 | tail -2

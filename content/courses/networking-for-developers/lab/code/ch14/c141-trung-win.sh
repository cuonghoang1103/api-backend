# 14.1 · Windows (nft-win) tải tệp 50 MB, giới hạn 4 MB/s, CÙNG LÚC với máy chép MAC
ip -br addr show sv
curl -sS -o /dev/null --limit-rate 4M -m 15 -w "windows: HTTP %{http_code}, %{size_download} byte, %{time_total} s\n" http://news.test/big.bin
ping -q -c 50 -i 0.1 198.18.0.10 | tail -2

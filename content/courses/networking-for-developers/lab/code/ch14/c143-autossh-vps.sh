# 14.3 · nft-vps: trong lúc đó VPS thấy gì — phiên CŨ vẫn giữ cổng 2222 nên các lần nối lại bị từ chối, tới khi VPS biết phiên cũ đã chết
J() { journalctl -u ssh --no-pager -o short --since "-3min" | cut -c8-; }
J | grep -E "Address already" | head -1
J | grep -c "Address already in use"
J | grep -E "Read error|Timeout"
ss -4tlnp | grep 2222

# 14.3 · nft-win: lỡ tay mở SOCKS cho MỌI địa chỉ (0.0.0.0) thay vì 127.0.0.1
ssh -f -N -D 0.0.0.0:1081 vps
ss -4tlnp | grep -E ':(1080|1081) '

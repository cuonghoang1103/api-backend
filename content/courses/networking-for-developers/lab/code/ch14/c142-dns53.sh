# 14.2 · nft-win: đổi DNS giờ không qua được nữa
dig @198.18.0.53 +time=2 +tries=1 phim.test | grep -E "timed out|status"

# 14.3 · laptop (nft-win): tạo cặp khoá SSH — khoá RIÊNG ở lại máy, khoá CÔNG KHAI đem dán lên VPS (bảng điều khiển nhà cung cấp lúc tạo máy)
ssh-keygen -t ed25519 -N "" -C "sv@laptop" -f ~/.ssh/id_ed25519 | head -2
ls -l ~/.ssh/
cut -c1-60 ~/.ssh/id_ed25519.pub

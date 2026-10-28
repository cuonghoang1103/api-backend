# @ Chương 14 · bài 14.7 — gõ TỪ MÁY MAC (chỉ đọc), từ lab/code/ch14:
# @   bash phien-host.sh c147-mac.sh 2>&1 | bash an-danh.sh > ../../out/c147-mac.out.txt
echo $SHELL; zsh --version; /bin/bash --version | head -1
brew --version | head -1; brew --prefix
echo "formulae installed: $(brew list --formula | wc -l)"
brew info node | head -1
ls -l "$(brew --prefix)/bin/node" | awk '{print $9, $10, $11}'
/bin/bash -c 'mapfile -t lines < /etc/hosts; echo "read ${#lines[@]} lines"'

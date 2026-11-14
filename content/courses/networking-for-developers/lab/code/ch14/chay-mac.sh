#!/bin/bash
# chay-mac.sh <kich-ban.sh> <ten-output> — như chay-host.py nhưng bằng /bin/bash (3.2 của macOS): Python không được macOS
# cho đọc MAC (ifconfig trong tiến trình con của python3 trả 02:00:00:00:00:00 — quyền riêng tư của macOS), Terminal/bash thì được.
# In "$ lệnh" rồi output thật; dòng "# …" in nguyên; dòng trống bỏ qua. Xong thì che MAC (che-mac.py).
cd "$(dirname "$0")"; ra="$(cd ../.. && pwd)/out/$2.out.txt"; : > "$ra"
while IFS= read -r l || [ -n "$l" ]; do
  [ -z "$l" ] && continue
  case "$l" in '#'*) echo "$l" >> "$ra"; continue ;; esac
  echo "\$ $l" >> "$ra"; /bin/bash -c "$l" >> "$ra" 2>&1
done < "$1"
python3 che-mac.py "$ra"

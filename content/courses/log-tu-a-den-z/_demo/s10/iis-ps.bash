#!/usr/bin/env bash
# 10.3 — chạy THẬT đoạn PowerShell của bài (pwsh 7 trong container mcr.microsoft.com/powershell, --network none) trên mẫu IIS của gói log.
# Dùng: bash iis-ps.bash <thư mục gói log (có windows/)> ⇒ iis-ps.out.txt. Dòng "$ " ghi lệnh như gõ trong pwsh tại thư mục gói log.
set -euo pipefail
S=$(cd "$(dirname "$0")" && pwd); G=$(realpath "$1")
{ echo '$ cat iis.ps1'; grep -v OutputRendering "$S/iis-ps/iis.ps1"; echo '$ pwsh -NoProfile -File iis.ps1'
  docker run --rm --name lgz-pwsh --network none --user "$(id -u):$(id -g)" -e HOME=/tmp -v "$G":/lab:ro -v "$S/iis-ps":/s:ro -w /lab \
    mcr.microsoft.com/powershell:latest pwsh -NoProfile -File /s/iis.ps1 | sed '/^\s*$/d'
  echo '$ pwsh -NoProfile -c "$PSVersionTable.PSVersion.ToString()"'
  docker run --rm --network none --user "$(id -u):$(id -g)" -e HOME=/tmp mcr.microsoft.com/powershell:latest pwsh -NoProfile -c '$PSVersionTable.PSVersion.ToString()'
} > "$S/iis-ps.out.txt"

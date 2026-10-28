# @ Chương 14 · bài 14.7 — PowerShell 7 (pwsh) THẬT, chạy trên Linux trong container lab vứt đi. Tarball tải MỘT lần từ trang
# @ phát hành chính thức (github.com/PowerShell/PowerShell, v7.6.9) vào thư mục tạm của máy soạn bài, gắn chỉ-đọc vào /cache:
# @   docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch14":/lab/ch14 -v <cache>:/cache:ro -w /lab/ch14 os-lab bash -c "phien c147-pwsh.sh 2>&1" > ../out/c147-pwsh.out.txt
curl -sSL -o /tmp/hashes.sha256 https://github.com/PowerShell/PowerShell/releases/download/v7.6.9/hashes.sha256; file /tmp/hashes.sha256
grep -c linux-arm64 /tmp/hashes.sha256; iconv -f UTF-16 -t UTF-8 /tmp/hashes.sha256 | tr -d '\r' | grep 'linux-arm64.tar.gz'
sha256sum /cache/powershell-7.6.9-linux-arm64.tar.gz
mkdir -p /opt/pwsh && tar xzf /cache/powershell-7.6.9-linux-arm64.tar.gz -C /opt/pwsh && ln -s /opt/pwsh/pwsh /usr/local/bin/pwsh && echo installed
export DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1 NO_COLOR=1
pwsh -NoProfile -c '"PowerShell " + $PSVersionTable.PSVersion + " on " + $PSVersionTable.OS'
@ sleep 600 & SLEEPER=$!
@ node -e 'const t=Date.now(); while (Date.now()-t < 4000) {}' & HOG=$!
@ sleep 1
ps -eo pid,comm,time,rss --sort=-time | head -4
pwsh -NoProfile -c 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 3 Id, ProcessName, CPU, @{n="RSS_MiB"; e={[math]::Round($_.WorkingSet64 / 1MB, 1)}} | Format-Table -AutoSize'
pwsh -NoProfile -c '$p = Get-Process -Id $PID; $p.GetType().FullName; ($p | Get-Member -MemberType Property).Count'
pwsh -NoProfile -c 'Get-Process -Id $PID | Select-Object Id, ProcessName, StartTime, Threads | Format-List'
find /usr/bin -type f -size +2M -printf '%s %f\n' | sort -rn | head -3
pwsh -NoProfile -c 'Get-ChildItem /usr/bin -File | Where-Object Length -gt 2MB | Sort-Object Length -Descending | Select-Object -First 3 Name, Length'
pwsh -NoProfile -c 'Get-ChildItem /usr/bin -File | Measure-Object Length -Sum | Select-Object Count, Sum | ConvertTo-Json -Compress'
pwsh -NoProfile -c 'Get-Content /etc/os-release | Select-String "^VERSION="'
pwsh -NoProfile -c 'Get-Alias gci, gps, select, where | Format-Table Name, Definition -AutoSize'
pwsh -NoProfile -c '"aliases named ls/cat/ps/curl/sort on Linux: " + @(Get-Alias ls, cat, ps, curl, sort -ErrorAction SilentlyContinue).Count; "ls is: " + (Get-Command ls).CommandType + " " + (Get-Command ls).Source'
pwsh -NoProfile -c "Stop-Process -Id $SLEEPER"; wait $SLEEPER; echo "exit=$?"
@ wait $HOG
dpkg-query -W -f '${Package}\n' | wc -l
apt-cache policy curl | head -3

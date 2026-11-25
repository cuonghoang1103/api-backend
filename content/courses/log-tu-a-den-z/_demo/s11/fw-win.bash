# 11.3 — tường lửa Windows Defender: bật log từng profile, pfirewall.log, máy lạ quét cổng, đọc bằng PowerShell; sự kiện WFP 5156/5157 (auditpol).
# Chạy: python3 cong-cu/chay-vm.py fw-win.bash — Windows Server 2025 LAPTOP-AN (192.168.56.177), keodo (192.168.56.66) quét, lab7 (192.168.56.10) ssh hợp lệ.
@win Get-NetFirewallProfile | Select-Object Name,Enabled,LogFileName,LogMaxSizeKilobytes,LogAllowed,LogBlocked | Format-Table -AutoSize
! @win Set-NetFirewallProfile -All -LogBlocked False -LogAllowed False -LogMaxSizeKilobytes 4096; Start-Sleep 2; Remove-Item C:\Windows\System32\LogFiles\Firewall\pfirewall.log* -Force
@win Set-NetFirewallProfile -All -LogBlocked True -LogAllowed True -LogMaxSizeKilobytes 16384; netsh advfirewall show currentprofile logging
! @win Start-Sleep 3
@keodo sudo nmap -sS -Pn -n --top-ports 25 192.168.56.177 | grep -E "^[0-9]|scanned|filtered ports"
@android timeout 4 curl -s -o /dev/null -w "%{http_code}\n" http://192.168.56.177/; nc -vz -w2 192.168.56.177 445 2>&1
! @win Start-Sleep 5
@win $f = "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log"; Get-Item $f | Select-Object Length,LastWriteTime; Get-Content $f -TotalCount 6
@win Get-Content "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log" | Select-String ' DROP TCP 192.168.56.66 ' | Select-Object -First 4
@win Get-Content "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log" | Select-String ' ALLOW TCP 192.168.56.10 .* 22 ' | Select-Object -First 2
@win $h = 'date','time','action','protocol','srcip','dstip','srcport','dstport','size','tcpflags','tcpsyn','tcpack','tcpwin','icmptype','icmpcode','info','path','pid'; $d = Get-Content "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log" | Where-Object { $_ -and $_ -notmatch '^#' } | ConvertFrom-Csv -Delimiter ' ' -Header $h; $d | Group-Object action,srcip | Sort-Object Count -Descending | Select-Object Count,Name | Format-Table -AutoSize
@win $h = 'date','time','action','protocol','srcip','dstip','srcport','dstport','size','tcpflags','tcpsyn','tcpack','tcpwin','icmptype','icmpcode','info','path','pid'; $d = Get-Content "$env:SystemRoot\System32\LogFiles\Firewall\pfirewall.log" | Where-Object { $_ -and $_ -notmatch '^#' } | ConvertFrom-Csv -Delimiter ' ' -Header $h; $d | Where-Object { $_.action -eq 'DROP' -and $_.dstip -eq '192.168.56.177' } | Group-Object srcip | ForEach-Object { [pscustomobject]@{ Nguon = $_.Name; Goi = $_.Count; SoCong = ($_.Group.dstport | Sort-Object -Unique).Count; Dau = $_.Group[0].time; Cuoi = $_.Group[-1].time } } | Format-Table -AutoSize
@win auditpol /set /subcategory:"Filtering Platform Connection" /success:enable /failure:enable; auditpol /get /subcategory:"Filtering Platform Connection"
@keodo sudo nmap -sS -Pn -n -p 135,445,3389,5985 192.168.56.177 | grep -E "^[0-9]"
! @win Start-Sleep 3
@win $e = Get-WinEvent -FilterHashtable @{LogName='Security'; Id=5157} -MaxEvents 20 | Where-Object { $_.Message -match '192.168.56.66' } | Select-Object -First 1; $e.TimeCreated; $e.Message -split "`r?`n" | Where-Object { $_.Trim() } | Select-Object -First 16
@win $x = [xml](Get-WinEvent -FilterHashtable @{LogName='Security'; Id=5156} -MaxEvents 30 | Where-Object { $_.Message -match '192.168.56.10' } | Select-Object -First 1).ToXml(); $x.Event.EventData.Data | Where-Object { $_.Name -in 'Application','Direction','SourceAddress','SourcePort','DestAddress','DestPort','Protocol' } | Format-Table Name,'#text' -AutoSize
@win Get-WinEvent -FilterHashtable @{LogName='Security'; Id=5156,5157; StartTime=(Get-Date).AddMinutes(-3)} | Group-Object Id | Select-Object Count,Name
@win Get-WinEvent -ListLog Security | Select-Object LogName,RecordCount,FileSize,MaximumSizeInBytes,LogMode
@win auditpol /set /subcategory:"Filtering Platform Connection" /success:disable /failure:disable | Out-Null; auditpol /get /subcategory:"Filtering Platform Connection" | Select-String Filtering

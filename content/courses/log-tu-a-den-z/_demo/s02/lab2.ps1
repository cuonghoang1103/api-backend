$L = Get-Content web/access.log; $L.Count
$L = Get-Content web/access.log; $L | ForEach-Object { ($_ -split ' ')[0] } | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 10 Count, Name | Format-Table -AutoSize
$L = Get-Content web/access.log; $L | ForEach-Object { $p = $_ -split ' '; if ([int]$p[8] -ge 400) { "$($p[8]) $($p[6])" } } | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 5 Count, Name | Format-Table -AutoSize
$L = Get-Content web/access.log; $L | ForEach-Object { $_.Substring($_.IndexOf('[') + 1, 17) } | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 1 Count, Name
$L = Get-Content web/access.log; $e = ($L | Where-Object { [int]($_ -split ' ')[8] -ge 500 }).Count; '{0:N2}%' -f (100 * $e / $L.Count)
Get-Content web/access.log | ForEach-Object { ($_ -split '"')[5] } | Group-Object -NoElement | Sort-Object Count | Select-Object -First 3 Count, Name | Format-Table -AutoSize -Wrap
Get-Content web/access.log | Where-Object { ($_ -split ' ')[8] -eq '401' } | ForEach-Object { ($_ -split ' ')[0] } | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 1 Count, Name
Select-String -Path web/access.log -Pattern '^203\.0\.113\.66 .* 200 ' | ForEach-Object { $p = $_.Line -split ' '; "$($p[3]) $($p[5]) $($p[6]) $($p[8])" }
Get-Content web/access.log | ForEach-Object { $_.Substring($_.IndexOf('[') + 13, 2) } | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 1 Count, Name
'{0:N1} MB' -f ((Get-Content web/access.log | ForEach-Object { [long]($_ -split ' ')[9] } | Measure-Object -Sum).Sum / 1MB)

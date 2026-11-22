(Select-String -Path web/access.log -Pattern ' 502 ').Count
Select-String -Path linux/auth.log -Pattern 'Accepted' -Context 1,1 | ForEach-Object { $_.Context.PreContext; '> ' + $_.Line; $_.Context.PostContext } | ForEach-Object { $_.Substring(0, [Math]::Min(88, $_.Length)) }
Select-String -Path web/access.log -Pattern '^\S+' | ForEach-Object { $_.Matches[0].Value } | Group-Object -NoElement | Sort-Object Count -Descending | Select-Object -First 3
Get-Content web/access.log -Tail 1
Import-Csv incident/windows-system.csv | Format-Table Id, TimeCreated, ProviderName -AutoSize
Get-Content app/app.jsonl | ConvertFrom-Json | Where-Object level -ge 50 | Group-Object msg -NoElement
Get-Content app/app.jsonl | ConvertFrom-Json | Where-Object responseTime | Measure-Object responseTime -Average -Maximum | Select-Object Count, Average, Maximum
$f = (Get-Content windows/u_ex261120.log | Where-Object { $_ -like '#Fields:*' }) -replace '^#Fields: ' -split ' '; Get-Content windows/u_ex261120.log | Where-Object { $_ -notlike '#*' } | ConvertFrom-Csv -Delimiter ' ' -Header $f | Where-Object { [int]$_.'sc-status' -ge 500 } | Select-Object -First 3 time, 'cs-uri-stem', 'sc-status', 'time-taken' | Format-Table -AutoSize
$f = (Get-Content windows/pfirewall.log | Where-Object { $_ -like '#Fields:*' }) -replace '^#Fields: ' -split ' '; Get-Content windows/pfirewall.log | Where-Object { $_ -and $_ -notlike '#*' } | ConvertFrom-Csv -Delimiter ' ' -Header $f | Where-Object action -eq 'DROP' | Group-Object 'src-ip', 'dst-port' -NoElement

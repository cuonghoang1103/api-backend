# 5.2 — -FilterHashtable: mỗi khoá là một điều kiện (AND), mảng giá trị trong một khoá là OR. Get-WinEventMau dịch bảng băm sang XPath như Get-WinEvent rồi mới lọc.
# Mẫu: mau/Archive-ForwardedEvents-test.evtx (log Security chuyển tiếp từ 2 máy chủ slad1/slad3, 650 sự kiện), mau/dbc-many-events-system.evtx (System 3 máy Win7).
@ps Get-WinEventMau mau/Archive-ForwardedEvents-test.evtx | Group-Object Id | Sort-Object Count -Descending | Select-Object -First 6 Count, Name | Format-Table -AutoSize
@ps (Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Id = 4625 }).Count
@ps (Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Id = 4624, 4625 }).Count
@ps Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Id = 4625; TargetUserName = 'psadmin' } -MaxEvents 1 -Verbose 4>&1 | Select-Object -First 1
@ps Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Id = 4625 } | Group-Object { '{0} <- {1}' -f $_.Properties[5].Value, $_.Properties[19].Value } | Sort-Object Count -Descending | Select-Object -First 5 Count, Name | Format-Table -AutoSize
@ps Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Id = 4625 } | Measure-Object TimeCreated -Minimum -Maximum | Format-List Count, Minimum, Maximum
@ps (Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Id = 4625; StartTime = [datetime]'2019-11-08 23:21:00'; EndTime = [datetime]'2019-11-08 23:21:59' }).Count
@ps (Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Data = '10.115.247.238' }).Count
@ps Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Level = 4 }
@ps Get-WinEventMau mau/Archive-ForwardedEvents-test.evtx | Group-Object Level, LevelDisplayName | Format-Table Count, Name -AutoSize
@ps Get-WinEventMau -FilterHashtable @{ Path = 'mau/dbc-many-events-system.evtx'; Level = 1, 2 } | Group-Object ProviderName, Id | Sort-Object Count -Descending | Select-Object -First 6 Count, Name | Format-Table -AutoSize
@ps (Get-WinEventMau -FilterHashtable @{ Path = 'mau/dbc-many-events-system.evtx'; ProviderName = 'Microsoft-Windows-Kernel-General'; Id = 12, 13 } -Oldest | Select-Object -First 4 | Format-Table TimeCreated, Id, MachineName | Out-String).Trim()
@ps Get-WinEventMau -FilterHashtable @{ Path = 'mau/Archive-ForwardedEvents-test.evtx'; Keywords = 4503599627370496 } | Group-Object Id | Format-Table Count, Name -AutoSize
@ps Get-WinEventMau -FilterHashtable @{ Path = 'mau/dbc-many-events-security.evtx', 'mau/dbc-many-events-application.evtx'; Id = 4625 } | Group-Object LogName, ProviderName | Format-Table Count, Name -AutoSize
@ps ConvertTo-EvtXPath @{ LogName = 'Security'; Id = 4625, 4771; StartTime = [datetime]'2026-11-24 08:00'; IpAddress = '203.0.113.66' }

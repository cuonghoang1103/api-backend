# 5.1 — Get-WinEvent từ số 0, chạy trên máy KHÔNG phải Windows: Get-WinEventMau (bin/WinEventMau, ~120 dòng) đọc .evtx mẫu công khai và trả đối tượng
# CÙNG tên thuộc tính với EventLogRecord của Get-WinEvent. Trên Windows: thay Get-WinEventMau bằng Get-WinEvent -Path (hoặc -LogName với log trên máy).
@ps Get-WinEventMau tc/smb-doan-mk-4625.evtx -MaxEvents 3
@ps Get-WinEventMau tc/smb-doan-mk-4625.evtx -MaxEvents 3 -Oldest | Format-Table TimeCreated, Id, RecordId, MachineName
@ps $e = Get-WinEventMau tc/smb-doan-mk-4625.evtx -MaxEvents 1 -Oldest; $e.PSObject.Properties.Name -join ', '
@ps $e = Get-WinEventMau tc/smb-doan-mk-4625.evtx -MaxEvents 1 -Oldest; $i = 0; $e.Properties | ForEach-Object { '[{0,2}] {1}' -f $i++, $_.Value }
@ps $e = Get-WinEventMau tc/smb-doan-mk-4625.evtx -MaxEvents 1 -Oldest; ([xml]$e.ToXml()).Event.EventData.Data | Select-Object -First 7 Name, '#text' | Format-Table -AutoSize
@ps Get-WinEventMau tc/smb-doan-mk-4625.evtx | Group-Object { $_.Properties[5].Value } | Sort-Object Count -Descending | Select-Object -First 5 Count, Name | Format-Table -AutoSize
@ps Get-WinEventMau tc/smb-doan-mk-4625.evtx | Measure-Object -Property TimeCreated -Minimum -Maximum | Format-List Count, Minimum, Maximum
@ps Get-WinEventMau tc/smb-doan-mk-4625.evtx -MaxEvents 1 | Format-List Message
@ps Get-WinEventMau mau/Archive-ForwardedEvents-test.evtx -MaxEvents 1 | Format-List MachineName, Id, TaskDisplayName, @{n='Message (3 dòng đầu)'; e={ ($_.Message -split "`n")[0..2] -join "`n" }}
@ps Get-WinEventMau tc/smb-doan-mk-4625.evtx | Group-Object { '{0} | {1} | type {2}' -f $_.Properties[19].Value, $_.Properties[9].Value, $_.Properties[10].Value } | Format-Table Count, Name -AutoSize
@ps Get-WinEventMau tc/smb-doan-mk-4625.evtx | Select-Object TimeCreated, @{n='User'; e={ $_.Properties[5].Value }}, @{n='SubStatus'; e={ $_.Properties[9].Value }} | Export-Csv /lab/ra/spray.csv -NoTypeInformation; Get-Content /lab/ra/spray.csv -TotalCount 4

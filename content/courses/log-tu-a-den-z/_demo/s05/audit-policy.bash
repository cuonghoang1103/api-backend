# 5.5 — Bật cái đang tắt. Không có Windows để chạy auditpol; phần chạy thật: SUY RA audit policy của từng máy mẫu từ chính log của nó (Kiem-DoPhu.ps1),
# bảng Task → subcategory ở mau/task-subcategory.tsv (Microsoft Learn: Advanced security audit policy; 13824/13826/12544 khớp RenderingInfo trong ForwardedEvents).
!cp /lab/s05/Kiem-DoPhu.ps1.txt /lab/ra/Kiem-DoPhu.ps1; cp /lab/s05/task-subcategory.tsv /lab/ra/
@ps /lab/ra/Kiem-DoPhu.ps1 -Tep mau/dbc-many-events-security.evtx
@ps /lab/ra/Kiem-DoPhu.ps1 -Tep mau/security.evtx
@ps /lab/ra/Kiem-DoPhu.ps1 -Tep mau/2-system-Security-dirty.evtx 2>$null
@ps Get-WinEventMau tc/ps-tai-payload.evtx -Oldest | Format-Table TimeCreated, Id, LevelDisplayName, @{n='Đầu nội dung'; e={ ($_.Properties[2].Value -replace '\s+', ' ').Substring(0, [Math]::Min(70, ($_.Properties[2].Value -replace '\s+', ' ').Length)) }} -AutoSize

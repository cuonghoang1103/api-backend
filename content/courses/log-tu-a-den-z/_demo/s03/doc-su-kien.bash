# 3.2 — mổ xẻ MỘT sự kiện: phần System (cột của Event Viewer) + EventData; XML; vì sao .evtx không có câu "Message"; Event ID trùng số giữa provider; Keywords.
evtx-xml mau/dbc-many-events-system.evtx 258
@ps evtx-rec mau/dbc-many-events-system.evtx | ConvertFrom-Json | Where-Object rec -eq 258 | Format-List t,kenh,nguon,id,muc,task,kw,rec,may,sid
evtx-xml mau/security.evtx 1288
@ps evtx-rec mau/system.evtx | ConvertFrom-Json | Where-Object id -eq 1 | Group-Object nguon | Select-Object Count,Name | Format-Table -AutoSize
@ps evtx-rec mau/dbc-many-events-application.evtx | ConvertFrom-Json | Where-Object id -eq 1000 | Group-Object nguon | Select-Object Count,Name | Format-Table -AutoSize
@ps evtx-rec mau/security.evtx mau/Archive-ForwardedEvents-test.evtx | ConvertFrom-Json | Where-Object kenh -eq 'Security' | Group-Object kw | Sort-Object Count -Descending | Select-Object Count,Name | Format-Table -AutoSize
@ps evtx-rec mau/Archive-ForwardedEvents-test.evtx | ConvertFrom-Json | Where-Object id -in 4624,4625 | Group-Object id,kw | Select-Object Count,Name | Format-Table -AutoSize
evtx-xml mau/sysmon.evtx 1742 | sed -n 1,22p

# Lab 5 — "báo cáo buổi sáng" bằng PowerShell, chạy trên ba log mẫu (System/Security/Application) của máy IE10Win7 (DeepBlueCLI many-events-*), đóng băng "bây giờ".
!cp /lab/s05/Bao-CaoSang.ps1.txt /lab/ra/Bao-CaoSang.ps1
@ps /lab/ra/Bao-CaoSang.ps1 -Tep mau/dbc-many-events-system.evtx, mau/dbc-many-events-security.evtx, mau/dbc-many-events-application.evtx -May IE10Win7 -Now '2016-09-20 08:00'
@ps /lab/ra/Bao-CaoSang.ps1 -Tep mau/dbc-many-events-system.evtx, mau/dbc-many-events-security.evtx, mau/dbc-many-events-application.evtx -May IE10Win7 -Now '2016-08-19 08:00'

---
name: devops-windows
description: Deploy/vận hành trên máy Windows: PowerShell không tương tác, cài bằng winget, chạy app thành dịch vụ (NSSM/WinSW/Task Scheduler), IIS/Caddy, tường lửa, WSL2, Docker Desktop, SQL Server, cập nhật + lùi phiên bản.
---

# KỸ NĂNG: DEVOPS TRÊN WINDOWS — chạy thật, tự khởi động lại, lùi được

Mục tiêu: dịch vụ chạy nền trên Windows, **tự lên lại sau khi máy khởi động lại**, mở đúng cổng, có log để đọc,
cập nhật bằng một lệnh và **lùi về bản cũ được** khi bản mới hỏng. Đọc kèm kỹ năng `deploy` (Docker, HTTPS,
kiểm sức khoẻ) và `server-may-nha` (khi máy Windows này là máy nhà làm server).

## 0. Luật vàng (đọc trước mọi thứ)

1. **Biết mình đang ở shell nào.** Công cụ chạy lệnh của app dùng **cmd.exe**. Lệnh PowerShell phải gọi:
   `powershell -NoProfile -NonInteractive -Command "…"` (Windows PowerShell 5.1, có sẵn mọi máy) hoặc `pwsh`
   (PowerShell 7, phải cài). Terminal thật (`terminal_*`) là phiên PowerShell tương tác.
   Kiểm trước: `powershell -NoProfile -Command "$PSVersionTable.PSVersion; [Environment]::OSVersion.Version"`.
2. **Không bao giờ chạy lệnh chờ gõ tay.** Thêm `-Confirm:$false`, `-Force` (khi đã chắc), `--silent`,
   `--accept-package-agreements --accept-source-agreements` (winget), `-y` (choco). Lệnh cần UAC/đăng nhập ⇒ DỪNG,
   đưa lệnh cho người dùng tự chạy trong **PowerShell (Admin)**.
3. **Kiểm quyền Admin trước việc cần Admin** (cài dịch vụ, mở tường lửa, bật tính năng):
   `powershell -NoProfile -Command "([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"`
   ⇒ `False` thì nói rõ bước nào cần Admin và đưa lệnh cho người dùng.
4. **Không đổi thiết lập toàn máy khi chưa hỏi**: `Set-ExecutionPolicy`, tắt Defender/tường lửa, sửa registry HKLM,
   đổi biến môi trường cấp Machine. Cần chạy script `.ps1` thì dùng `-ExecutionPolicy Bypass` **cho riêng lần chạy đó**.
5. **Mọi thay đổi đều phải có đường lùi** (mục 7) và **kiểm sức khoẻ sau khi làm** (mục 8). Báo cáo bằng bằng chứng
   (trạng thái dịch vụ, mã HTTP), không bằng "chắc là chạy".

## 1. PowerShell 5.1 vs 7 — bẫy hay gặp

| Việc | PS 5.1 (mặc định) | PS 7 (`pwsh`) |
|---|---|---|
| Nối lệnh `a && b` | KHÔNG có — dùng `a; if ($?) { b }` | có |
| `curl`, `wget` | là **bí danh** của `Invoke-WebRequest` | vẫn là bí danh — gọi `curl.exe` để dùng curl thật |
| Ghi file `>` | **UTF-16 LE** ⇒ file .env/.json hỏng | UTF-8 |
| `Invoke-WebRequest` | cần `-UseBasicParsing` trên máy chưa mở IE | không cần |

- Ghi file luôn chỉ rõ mã hoá: `Set-Content -Path x -Value $v -Encoding utf8` (5.1 thêm BOM — với `.env`
  dùng `[IO.File]::WriteAllText($p, $v)` để có UTF-8 không BOM).
- Đường dẫn có dấu cách: bọc nháy kép; trong cmd.exe dùng `\`, trong PowerShell `\` hoặc `/` đều được.
- Biến môi trường: cmd `%NAME%`, PowerShell `$env:NAME`. Đặt cho **tiến trình này**: `$env:NODE_ENV='production'`.
- Script `.sh` đưa vào Docker/WSL phải là **LF**: thêm `.gitattributes` với `*.sh text eol=lf`
  (lỗi CRLF: `/bin/sh^M: bad interpreter`, `exec format error`).

## 2. Cài công cụ

Ưu tiên **winget** (có sẵn Win 10 1809+/Win 11), không có thì choco/scoop:
```
winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
winget install --id Git.Git -e --silent --accept-package-agreements --accept-source-agreements
winget install --id Python.Python.3.12 -e --silent --accept-package-agreements --accept-source-agreements
winget install --id Microsoft.DotNet.SDK.8 -e --silent --accept-package-agreements --accept-source-agreements
winget install --id CaddyServer.Caddy -e --silent --accept-package-agreements --accept-source-agreements
winget install --id NSSM.NSSM -e --silent --accept-package-agreements --accept-source-agreements
```
Cài xong, **PATH của phiên đang mở chưa đổi** — mở phiên mới hoặc gọi bằng đường dẫn đầy đủ
(`where.exe node` để tìm). Kiểm phiên bản sau khi cài (`node -v`, `dotnet --list-sdks`).

## 3. Chạy app thành DỊCH VỤ (tự lên sau khi khởi động lại)

`New-Service`/`sc.exe create` chỉ chạy được **exe biết nói chuyện với Service Control Manager**. App Node/Python/Java
thường KHÔNG ⇒ dịch vụ báo lỗi 1053. Dùng một lớp bọc:

**NSSM (đơn giản nhất):**
```
nssm install MyApi "C:\Program Files\nodejs\node.exe" "C:\apps\myapi\current\dist\server.js"
nssm set MyApi AppDirectory "C:\apps\myapi\current"
nssm set MyApi AppEnvironmentExtra "NODE_ENV=production" "PORT=3000"
nssm set MyApi AppStdout "C:\apps\myapi\logs\out.log"
nssm set MyApi AppStderr "C:\apps\myapi\logs\err.log"
nssm set MyApi AppRotateFiles 1
nssm set MyApi AppRotateBytes 10485760
nssm set MyApi Start SERVICE_AUTO_START
nssm start MyApi
```
- Bí mật: KHÔNG nhét vào lệnh nssm (lộ trong lịch sử). Để trong `C:\apps\myapi\.env` và cho app tự đọc; khoá quyền
  file: `icacls C:\apps\myapi\.env /inheritance:r /grant:r "SYSTEM:R" "Administrators:F"`.
- Dịch vụ chạy dưới `LocalSystem` là quá quyền. Tốt hơn: `nssm set MyApi ObjectName ".\svc-myapi" "<mật khẩu>"`
  với một tài khoản thường tạo riêng (người dùng tự nhập mật khẩu).
- **.NET**: thêm `builder.Host.UseWindowsService()` (gói `Microsoft.Extensions.Hosting.WindowsServices`) rồi
  `sc.exe create MyApi binPath= "C:\apps\myapi\current\MyApi.exe" start= auto` — không cần NSSM.
- **Cách khác**: WinSW (file XML cạnh exe), hoặc Task Scheduler "At startup" cho việc đơn giản:
  `Register-ScheduledTask -TaskName MyApi -Trigger (New-ScheduledTaskTrigger -AtStartup) -Action (New-ScheduledTaskAction -Execute node.exe -Argument 'dist\server.js' -WorkingDirectory C:\apps\myapi\current) -User SYSTEM -RunLevel Highest`
  (không tự khởi động lại khi app chết — dịch vụ thì có).
- PM2 trên Windows không có `pm2 startup` — nếu dùng PM2 thì bọc chính PM2 bằng NSSM.

Kiểm: `Get-Service MyApi` (Running), `nssm status MyApi`, đọc `logs\err.log`.

## 4. Cổng, reverse proxy, HTTPS

- Ai đang giữ cổng: `Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object OwningProcess` rồi
  `Get-Process -Id <pid>` (hoặc `netstat -ano | findstr :3000`).
- **Caddy** là lựa chọn gọn nhất (tự lấy HTTPS khi có domain trỏ về máy + mở 80/443):
  `C:\caddy\Caddyfile`:
  ```
  api.example.com {
      reverse_proxy 127.0.0.1:3000
  }
  ```
  Chạy dịch vụ bằng NSSM: `nssm install Caddy C:\caddy\caddy.exe run --config C:\caddy\Caddyfile`.
  Không có domain công khai ⇒ đừng mở 80/443 ra Internet, dùng Tailscale hoặc Cloudflare Tunnel (kỹ năng `server-may-nha`).
- **IIS** khi dự án đã quen IIS/.NET: bật tính năng (Admin) — Windows Server:
  `Install-WindowsFeature Web-Server -IncludeManagementTools`; Windows 10/11:
  `Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole,IIS-WebServer -All -NoRestart`.
  ASP.NET Core cần **Hosting Bundle** đúng phiên bản. Làm reverse proxy cho Node cần thêm **URL Rewrite + ARR**.
  App pool của ASP.NET Core đặt "No Managed Code".

## 5. Tường lửa

```
New-NetFirewallRule -DisplayName "MyApi 3000 (LAN)" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
Get-NetFirewallRule -DisplayName "MyApi*" | Format-Table DisplayName,Enabled,Profile,Action
Remove-NetFirewallRule -DisplayName "MyApi 3000 (LAN)"
```
- Mặc định mở cho **Private** (mạng nhà), KHÔNG mở **Public** khi chưa hỏi. Đặt tên luật có tiền tố dự án để gỡ sạch được.
- App chỉ nghe `127.0.0.1` thì mở tường lửa cũng vô ích — muốn máy khác trong LAN vào được thì app phải nghe `0.0.0.0`.
- Kiểm từ máy khác: `Test-NetConnection <ip> -Port 3000` (xem `TcpTestSucceeded`).

## 6. WSL2 và Docker Desktop

- Bật WSL2 cần Admin + **khởi động lại máy** ⇒ hỏi trước: `wsl --install -d Ubuntu`. Kiểm: `wsl -l -v` (VERSION 2).
- Để mã nguồn trong **hệ thống file của WSL** (`\\wsl$\Ubuntu\home\...`), không ở `/mnt/c/...` — chậm gấp nhiều lần
  với `node_modules`/build.
- Máy khác trong LAN truy cập dịch vụ chạy trong WSL: Windows 11 22H2+ đặt `networkingMode=mirrored` trong
  `%UserProfile%\.wslconfig` rồi `wsl --shutdown`; bản cũ dùng
  `netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=<ip-wsl>`
  (IP WSL đổi sau mỗi lần khởi động — cần làm lại).
- Giới hạn tài nguyên WSL để server không ăn hết máy: `.wslconfig` → `[wsl2]` `memory=6GB` `processors=4`.
- Docker Desktop dùng backend WSL2; container Linux chạy như trên VPS nên dùng lại được Dockerfile/compose của kỹ năng
  `deploy`. Docker Desktop **cần người dùng đăng nhập** mới chạy — server phải lên khi chưa ai đăng nhập thì cài
  Docker Engine trong WSL/Hyper-V VM thay vì Docker Desktop.
- Docker Desktop cho doanh nghiệp lớn cần giấy phép trả phí — nhắc người dùng nếu là máy công ty.

## 7. Cập nhật và LÙI phiên bản

Giữ mỗi bản trong thư mục riêng, trỏ `current` bằng junction:
```
C:\apps\myapi\releases\2026-09-27_1430\   ← bản mới giải nén/build vào đây
C:\apps\myapi\releases\2026-09-20_0900\   ← bản trước, GIỮ LẠI
C:\apps\myapi\current  →  junction tới bản đang chạy
```
Cập nhật: build/giải nén vào thư mục mới → `nssm stop MyApi` → đổi junction
(`cmd /c rmdir C:\apps\myapi\current` rồi `cmd /c mklink /J C:\apps\myapi\current C:\apps\myapi\releases\<mới>`)
→ `nssm start MyApi` → kiểm sức khoẻ. Hỏng ⇒ trỏ junction về bản cũ, start lại. Giữ 3 bản gần nhất.
Database có migration ⇒ **sao lưu DB trước** (migration không lùi cùng mã).

## 8. Kiểm sức khoẻ và đọc lỗi

- HTTP: `curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:3000/health` (cmd) — hoặc
  `(Invoke-WebRequest http://127.0.0.1:3000/health -UseBasicParsing -TimeoutSec 10).StatusCode`.
- Dịch vụ: `Get-Service MyApi | Format-List Name,Status,StartType`.
- Log hệ thống khi dịch vụ không lên: `Get-WinEvent -LogName System -MaxEvents 30 | Where-Object ProviderName -eq 'Service Control Manager' | Format-List TimeCreated,Message`.
- Sự kiện ứng dụng .NET: `Get-WinEvent -LogName Application -MaxEvents 30`.

## 9. SQL Server trên Windows

- Kiểm dịch vụ: `Get-Service MSSQL*`. Bản Express mặc định **tắt TCP/IP** và dùng cổng động ⇒ bật TCP + cổng 1433
  trong SQL Server Configuration Manager (việc người dùng bấm) rồi khởi động lại dịch vụ, mở tường lửa 1433 cho Private.
- Lệnh: `sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT @@VERSION"` (`-E` = đăng nhập Windows).
- Chuỗi kết nối từ app .NET: `Server=localhost\SQLEXPRESS;Database=App;Trusted_Connection=True;TrustServerCertificate=True`.
- Sao lưu trước mọi migration: `sqlcmd -S . -E -Q "BACKUP DATABASE [App] TO DISK='C:\backup\App_2026-09-27.bak'"`.

## 10. Bẫy đã gặp — kiểm trước khi kết luận

- Dịch vụ báo **1053** (không phản hồi kịp) ⇒ exe không phải service thật — dùng NSSM/WinSW.
- Dịch vụ chạy tay được mà chạy dịch vụ thì hỏng ⇒ khác **thư mục làm việc** (đặt `AppDirectory`), khác **tài khoản**
  (LocalSystem không thấy ổ mạng, không thấy PATH/biến của người dùng), thiếu biến môi trường.
- `node`/`npm` không tìm thấy trong dịch vụ ⇒ PATH của dịch vụ là PATH hệ thống — dùng đường dẫn đầy đủ.
- Antivirus khoá file trong `node_modules`/`dist` lúc build ⇒ lỗi EPERM/EBUSY ngẫu nhiên: thử lại, hoặc nhờ người dùng thêm
  thư mục dự án vào ngoại lệ Defender (việc của họ, không tự làm).
- Đường dẫn dài > 260 ký tự ⇒ lỗi khi xoá/giải nén `node_modules` (bật LongPathsEnabled là việc người dùng duyệt).
- Máy **ngủ/tắt màn hình** làm server "chết" ⇒ đặt power plan không ngủ khi cắm điện (`powercfg /change standby-timeout-ac 0`,
  cần hỏi trước).
- Windows Update tự khởi động lại máy ⇒ dịch vụ phải `AUTO_START` và có kiểm sức khoẻ sau khởi động.

## 11. Báo cáo cuối

Đã cài gì (phiên bản), dịch vụ tên gì, chạy dưới tài khoản nào, cổng nào, luật tường lửa nào (tên để gỡ), log ở đâu,
lệnh cập nhật và lệnh lùi, kết quả kiểm sức khoẻ (mã HTTP thật). Nói rõ bước nào người dùng phải tự làm (UAC, khởi
động lại, bấm trong Configuration Manager).

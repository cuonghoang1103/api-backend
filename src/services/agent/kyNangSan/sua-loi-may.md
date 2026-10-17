---
name: sua-loi-may
description: Sửa lỗi máy tính macOS/Windows/Linux bằng lệnh: mất âm thanh/micro, mạng/Wi-Fi/DNS, Bluetooth, máy in, đĩa đầy, máy chậm/treo — chẩn đoán trước, thử ≥2 cách bằng tool trước khi trả việc cho người dùng, dùng quyen_cao khi cần quyền quản trị.
---

# KỸ NĂNG: SỬA LỖI MÁY — chẩn đoán, sửa, kiểm lại

## 0. Luật vàng

1. **Chẩn đoán trước, sửa sau**: đọc trạng thái hiện tại (thiết bị nào, dịch vụ nào, log nào) rồi mới đổi.
2. **Tự làm bằng tool, không bảo người dùng tự gõ.** Lệnh cần quyền quản trị ⇒ `run_command` với `quyen_cao: true`
   (app hiện hộp nhập mật khẩu của HĐH). Một cách bị chặn (SIP, chính sách công ty…) ⇒ thử **ít nhất 2 đường khác**
   bằng tool trước khi trả việc cho người dùng — và khi trả, nói chính xác bấm vào đâu.
3. **Không làm thao tác phá dữ liệu khi chưa hỏi**: xoá file người dùng, reset mạng toàn bộ, gỡ driver, xoá hồ sơ Wi-Fi,
   `diskutil eraseDisk`, `chkdsk /f` (cần khởi động lại), sửa registry HKLM.
4. **Kiểm lại sau mỗi bước sửa** bằng chính phép chẩn đoán ban đầu — không đoán "chắc được rồi".
5. Ưu tiên sửa nhẹ → nặng: khởi động lại dịch vụ → đặt lại cấu hình một thành phần → khởi động lại máy (hỏi) → cài lại.

## 1. Âm thanh / micro

**macOS**
```bash
system_profiler SPAudioDataType | grep -E "^\s{8}[^ ].*:$|Default (Output|Input) Device: Yes"   # thiết bị + mặc định
osascript -e 'output volume of (get volume settings)' -e 'output muted of (get volume settings)'
osascript -e 'set volume output volume 60' -e 'set volume without output muted'
```
- Đổi thiết bị ra/vào: `brew install switchaudio-osx` ⇒ `SwitchAudioSource -a -t output` (liệt kê) ·
  `SwitchAudioSource -t output -s "MacBook Pro Speakers"` · `-t input` cho micro.
- Mất tiếng/rè/thiết bị không hiện ⇒ khởi động lại daemon âm thanh: `run_command` `killall coreaudiod` với
  `quyen_cao: true` (launchd tự chạy lại sau ~2 giây; app đang phát có thể phải mở lại). Không được ⇒
  `launchctl kickstart -k system/com.apple.audio.coreaudiod` (quyen_cao).
- Micro không thu ⇒ quyền: System Settings → Privacy & Security → Microphone (người dùng bật; mở thẳng:
  `open "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone"`). AirPods/Bluetooth ⇒ mục 3.

**Windows** (PowerShell)
```powershell
Get-CimInstance Win32_SoundDevice | Select Name,Status
Get-Service Audiosrv,AudioEndpointBuilder | Select Name,Status
Restart-Service AudioEndpointBuilder -Force ; Restart-Service Audiosrv -Force      # cần Admin ⇒ quyen_cao
```
Mở bộ sửa lỗi có sẵn: `msdt.exe` đã bị gỡ trên Win 11 mới ⇒ `start ms-settings:sound` (người dùng chọn thiết bị).
Đổi thiết bị mặc định bằng lệnh cần module `AudioDeviceCmdlets` (`Install-Module AudioDeviceCmdlets -Scope CurrentUser`).

**Linux** (PipeWire/PulseAudio)
```bash
pactl info | grep -E "Server Name|Default Sink|Default Source"
pactl list short sinks ; pactl set-default-sink <tên> ; pactl set-sink-mute @DEFAULT_SINK@ 0 ; pactl set-sink-volume @DEFAULT_SINK@ 60%
systemctl --user restart pipewire pipewire-pulse wireplumber      # PipeWire  (PulseAudio cũ: pulseaudio -k)
```

## 2. Mạng / Wi-Fi / DNS

Chẩn đoán theo tầng — dừng ở tầng đầu tiên hỏng:
```bash
# 1) có địa chỉ IP chưa      2) tới được router      3) ra được Internet bằng IP      4) phân giải tên
ifconfig | grep "inet " ; ipconfig getifaddr en0          # macOS   | Windows: ipconfig /all | Linux: ip -br a
ping -c 3 $(route -n get default | awk '/gateway/{print $2}')   # macOS  | Linux: ip route | Windows: ping <Default Gateway>
ping -c 3 1.1.1.1
nslookup example.com ; scutil --dns | grep nameserver | head     # Windows: nslookup / Resolve-DnsName example.com
curl -sS -o /dev/null -w "%{http_code} %{time_total}s\n" https://example.com
```
- Có IP 169.254.x.x ⇒ không nhận DHCP: macOS `sudo ipconfig set en0 DHCP` (quyen_cao) · Windows
  `ipconfig /release` + `ipconfig /renew` · Linux `sudo nmcli con up <tên>` / `sudo dhclient -r && sudo dhclient`.
- Ping IP được mà tên không phân giải ⇒ DNS. Xoá đệm: macOS `dscacheutil -flushcache; killall -HUP mDNSResponder`
  (quyen_cao) · Windows `ipconfig /flushdns` · Linux `resolvectl flush-caches`. Đổi DNS (hỏi): macOS
  `networksetup -setdnsservers Wi-Fi 1.1.1.1 8.8.8.8` · Windows `Set-DnsClientServerAddress -InterfaceAlias Wi-Fi -ServerAddresses 1.1.1.1,8.8.8.8`.
- Wi-Fi tắt/bật lại: macOS `networksetup -setairportpower en0 off; sleep 2; networksetup -setairportpower en0 on`
  (tên cổng: `networksetup -listallhardwareports`) · Windows `netsh interface set interface "Wi-Fi" disable` rồi `enable`
  (Admin) · Linux `nmcli radio wifi off; nmcli radio wifi on`.
- VPN/proxy hay là thủ phạm: `scutil --proxy` · Windows `netsh winhttp show proxy` · biến `HTTP(S)_PROXY`.
- Reset mạng toàn bộ (`netsh winsock reset`, `netsh int ip reset`, xoá `/Library/Preferences/SystemConfiguration/*.plist`)
  ⇒ cần khởi động lại, mất cấu hình — HỎI trước.

## 3. Bluetooth

- macOS: `system_profiler SPBluetoothDataType | grep -E "State|Connected|^\s{10}[^ ].*:$"`.
  `brew install blueutil` ⇒ `blueutil --power 0; sleep 2; blueutil --power 1` · `blueutil --paired` ·
  `blueutil --connect <mac>`. Kẹt ⇒ `sudo pkill bluetoothd` (quyen_cao; tự chạy lại).
- Windows: `Get-PnpDevice -Class Bluetooth | Select FriendlyName,Status` · `Restart-Service bthserv` (Admin);
  thiết bị lỗi ⇒ `Disable-PnpDevice`/`Enable-PnpDevice -InstanceId … -Confirm:$false` (Admin).
- Linux: `bluetoothctl show` · `bluetoothctl power off && bluetoothctl power on` · `sudo systemctl restart bluetooth` ·
  `rfkill list` (bị chặn mềm ⇒ `rfkill unblock bluetooth`).

## 4. Máy in

- macOS/Linux (CUPS): `lpstat -p -d` (máy in + mặc định) · `lpstat -o` (hàng đợi) · `cancel -a` (xoá hàng đợi — hỏi) ·
  `cupsenable <tên>` (máy in bị "paused") · in thử `lp -d <tên> /etc/hosts` · log `/var/log/cups/error_log`.
- Windows: `Get-Printer | Select Name,PrinterStatus` · `Get-PrintJob -PrinterName "<tên>"` ·
  kẹt hàng đợi ⇒ `Stop-Service Spooler -Force; Remove-Item C:\Windows\System32\spool\PRINTERS\* -Force; Start-Service Spooler`
  (Admin, xoá mọi lệnh in đang chờ — hỏi trước).

## 5. Đĩa đầy

```bash
df -h                       # macOS: dữ liệu thật ở /System/Volumes/Data — dòng "/" chỉ là ổ hệ thống chỉ-đọc
du -sh ~/* 2>/dev/null | sort -h | tail -15
du -sh ~/Library/Caches ~/Library/Developer/Xcode/DerivedData ~/.npm ~/.gradle ~/.cache 2>/dev/null
docker system df 2>/dev/null                 # xem kỹ năng docker (lệnh này có thể treo nếu Docker kẹt)
tmutil listlocalsnapshots /                  # macOS: snapshot Time Machine cục bộ chiếm chỗ
```
Windows: `Get-PSDrive C` · `Get-ChildItem $env:USERPROFILE -Directory | % { "{0:N1} GB  {1}" -f ((gci $_ -Recurse -File -EA 0 | measure Length -Sum).Sum/1GB), $_.Name }`
· dọn hệ thống `cleanmgr /sagerun:1` (người dùng chọn mục). Linux: `sudo journalctl --vacuum-size=200M`, `sudo apt-get clean`.
Đề xuất danh sách xoá KÈM dung lượng; xoá bộ đệm dựng lại được (DerivedData, `~/.npm/_cacache`, `node_modules` của dự án
cũ) khi người dùng đồng ý; KHÔNG đụng Documents/Desktop/Downloads của họ khi chưa được chỉ rõ.

## 6. Máy chậm / treo / quạt kêu

```bash
top -l 1 -o cpu -n 10 | tail -12          # macOS (Linux: top -b -n 1 | head -20 ; Windows: Get-Process | Sort CPU -Desc | Select -First 10)
vm_stat | head -8 ; memory_pressure | tail -1        # macOS RAM
pmset -g therm ; pmset -g batt                        # nhiệt/pin
log show --last 10m --predicate 'eventMessage contains "crash"' | tail -20   # macOS log gần đây
```
Tắt tiến trình người dùng: hỏi trước (`kill <pid>`; Windows `Stop-Process -Id`). Tiến trình hệ thống ⇒ không tự giết.

## 7. Báo cáo cuối

Triệu chứng ban đầu → chẩn đoán (lệnh + kết quả) → đã sửa gì → **kiểm lại cho kết quả gì** → còn lại gì cần người dùng
bấm/quyết (kèm đường dẫn mục Cài đặt chính xác).

---
name: may-ao
description: Máy ảo trên macOS/Windows/Linux: Multipass (Ubuntu nhanh nhất), UTM/QEMU (Apple Silicon), VirtualBox, WSL2, Hyper-V — tạo, chạy, SSH vào, chia sẻ thư mục, chụp/khôi phục, xoá an toàn.
---

# KỸ NĂNG: MÁY ẢO — tạo, chạy, SSH vào, không làm hỏng máy thật

## 0. Luật vàng

1. **Khảo sát trước**: HĐH, kiến trúc CPU, RAM/đĩa trống, công cụ đã có.
   `uname -m` (arm64 = Apple Silicon/ARM ⇒ chỉ chạy tốt máy ảo ARM; x86_64/amd64) · macOS `sysctl -n hw.memsize` ·
   Windows `systeminfo | findstr /C:"Hyper-V" /C:"Total Physical Memory"` · `df -h` / `Get-PSDrive C`.
2. Cấp cho VM **không quá một nửa RAM** và chừa ≥ 20 GB đĩa máy thật.
3. Bật/tắt tính năng HĐH (WSL, Hyper-V), sửa BIOS, khởi động lại máy ⇒ **hỏi người dùng**, đưa lệnh cho họ chạy với quyền Admin.
4. Xoá máy ảo là xoá dữ liệu trong nó ⇒ hỏi, và gợi ý chụp/sao lưu trước.

## 1. Chọn công cụ

| Nhu cầu | macOS Apple Silicon | macOS Intel | Windows | Linux |
|---|---|---|---|---|
| Ubuntu server nhanh, có SSH | **Multipass** | Multipass | Multipass / **WSL2** | Multipass / KVM |
| Máy có giao diện, HĐH khác | **UTM** (QEMU/Apple VZ) | UTM / VirtualBox | Hyper-V / VirtualBox | virt-manager (KVM) / VirtualBox |
| Chạy Linux tool ngay trong máy | (Docker/colima) | | **WSL2** | — |
| Windows trên Mac ARM | UTM với Windows 11 ARM | | — | — |

VirtualBox trên Apple Silicon chỉ chạy được khách ARM và còn hạn chế ⇒ ưu tiên UTM/Multipass.
Hyper-V và VirtualBox cùng bật được (VirtualBox ≥ 6.1 chạy trên nền Hyper-V nhưng chậm hơn).

## 2. Multipass (khuyên dùng cho "cho tôi một máy Ubuntu")

Cài: macOS `brew install --cask multipass` · Windows `winget install -e --id Canonical.Multipass` · Linux `sudo snap install multipass`.
```bash
multipass launch 24.04 --name dev --cpus 2 --memory 4G --disk 20G
multipass list                        # tên, trạng thái, IP
multipass exec dev -- uname -a        # chạy một lệnh (không cần SSH)
multipass shell dev                   # phiên tương tác — dùng terminal thật (terminal_mo), không dùng run_command
multipass mount ~/code dev:/home/ubuntu/code   # chia sẻ thư mục
multipass transfer file.txt dev:/home/ubuntu/
multipass stop dev · multipass start dev · multipass snapshot dev (khi đang dừng) · multipass restore dev.snapshot1
multipass delete dev && multipass purge   # XOÁ HẲN — hỏi trước
```
**SSH bằng khoá của bạn** (để VS Code Remote/ansible dùng được): tạo VM kèm cloud-init:
```yaml
# cloud-init.yaml
ssh_authorized_keys:
  - ssh-ed25519 AAAA... (nội dung ~/.ssh/id_ed25519.pub)
```
`multipass launch 24.04 --name dev --cloud-init cloud-init.yaml` rồi `ssh ubuntu@<IP từ multipass list>`.

## 3. UTM / QEMU (Apple Silicon, cần giao diện hoặc HĐH khác)

- Cài: `brew install --cask utm`. Tạo máy lần đầu bằng giao diện UTM (chọn **Virtualize** cho khách ARM64 — nhanh;
  **Emulate** cho x86 — rất chậm). Ubuntu Server ARM: tải ISO `ubuntu-24.04-live-server-arm64.iso`.
- Điều khiển bằng dòng lệnh: `/Applications/UTM.app/Contents/MacOS/utmctl list|status|start|stop|ip-address <tên>`
  (`ip-address`/`exec`/`file` cần cài guest agent `qemu-guest-agent` trong máy khách).
- Mạng "Shared Network" ⇒ máy khách có IP 192.168.64.x, SSH thẳng từ máy thật được.
- QEMU trần (Linux/CI): `qemu-system-x86_64 -enable-kvm -m 4G -smp 2 -drive file=disk.qcow2,if=virtio -nic user,hostfwd=tcp::2222-:22`
  rồi `ssh -p 2222 user@localhost`. Tạo đĩa: `qemu-img create -f qcow2 disk.qcow2 30G`.

## 4. WSL2 (Windows — Linux ngay trong máy)

```powershell
wsl --status                      # đã bật chưa, bản mặc định
wsl --list --online               # các distro cài được
wsl --install -d Ubuntu-24.04     # Admin; lần đầu bật tính năng có thể cần KHỞI ĐỘNG LẠI
wsl -l -v                         # distro + phiên bản (phải là 2)
wsl -d Ubuntu-24.04 -- uname -a   # chạy một lệnh
wsl --shutdown                    # dừng hẳn (sửa lỗi mạng/treo, áp .wslconfig mới)
wsl --export Ubuntu-24.04 D:\bk\ubuntu.tar   ·   wsl --import Ubu2 D:\wsl\ubu2 D:\bk\ubuntu.tar
```
- Giới hạn RAM/CPU: `%UserProfile%\.wslconfig` với `[wsl2]` `memory=6GB` `processors=4` rồi `wsl --shutdown`.
- File dự án để TRONG Linux (`~/code`, không phải `/mnt/c/...`) — chậm gấp nhiều lần và lỗi theo dõi file.
- Cổng trong WSL mở được từ Windows qua `localhost`; từ máy khác trong LAN cần `netsh interface portproxy` hoặc
  `networkingMode=mirrored` (Win 11 23H2+ trong `.wslconfig`).

## 5. Hyper-V (Windows Pro/Enterprise/Education)

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All     # Admin + khởi động lại — HỎI trước
New-VM -Name dev -MemoryStartupBytes 4GB -Generation 2 -NewVHDPath C:\VMs\dev.vhdx -NewVHDSizeBytes 40GB -SwitchName "Default Switch"
Set-VMFirmware dev -EnableSecureBoot On -SecureBootTemplate MicrosoftUEFICertificateAuthority   # Linux Gen2
Add-VMDvdDrive dev -Path C:\iso\ubuntu-24.04-live-server-amd64.iso
Start-VM dev ; Get-VM ; (Get-VMNetworkAdapter dev).IPAddresses
Checkpoint-VM dev -SnapshotName truoc-khi-sua   ;   Restore-VMSnapshot -VMName dev -Name truoc-khi-sua -Confirm:$false
```
Windows Home không có Hyper-V ⇒ dùng WSL2 hoặc VirtualBox.

## 6. VirtualBox (đa nền tảng, máy Intel/AMD)

```bash
VBoxManage list vms ; VBoxManage list runningvms
VBoxManage createvm --name dev --ostype Ubuntu_64 --register
VBoxManage modifyvm dev --memory 4096 --cpus 2 --nic1 nat --natpf1 "ssh,tcp,,2222,,22"
VBoxManage createmedium disk --filename ~/VMs/dev.vdi --size 30000
VBoxManage storagectl dev --name SATA --add sata ; VBoxManage storageattach dev --storagectl SATA --port 0 --device 0 --type hdd --medium ~/VMs/dev.vdi
VBoxManage storageattach dev --storagectl SATA --port 1 --device 0 --type dvddrive --medium ~/iso/ubuntu.iso
VBoxManage startvm dev --type headless ; ssh -p 2222 user@127.0.0.1
VBoxManage snapshot dev take truoc-khi-sua ; VBoxManage controlvm dev acpipowerbutton
```

## 7. Bẫy thường gặp

- Ảnh/ISO sai kiến trúc (amd64 trên Apple Silicon) ⇒ không khởi động hoặc chậm 10×. Kiểm `uname -m` cả hai phía.
- "VT-x/AMD-V is not available" ⇒ ảo hoá tắt trong BIOS, hoặc Hyper-V đang giữ (Windows) — nói người dùng.
- SSH "Connection refused" ⇒ máy khách chưa cài/chạy `openssh-server` (`sudo apt install -y openssh-server`), hoặc
  đang dùng NAT mà chưa chuyển cổng. "Host key changed" sau khi tạo lại VM cùng IP ⇒ `ssh-keygen -R <ip>`.
- Thư mục chia sẻ chậm/sai quyền ⇒ làm việc trong đĩa của máy khách, chỉ chép kết quả ra.

## 8. Kiểm sau khi làm & báo cáo

VM ở trạng thái Running, có IP, `ssh`/`exec` chạy được `uname -a`, tài nguyên đã cấp. Báo cáo tên VM, IP, cách vào,
cách dừng/xoá, và chỗ nào cần người dùng tự làm (bật tính năng, BIOS, khởi động lại).

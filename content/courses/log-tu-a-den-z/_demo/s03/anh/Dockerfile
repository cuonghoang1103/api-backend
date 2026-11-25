# lgz-win-mau:1 — đọc EVTX mẫu công khai trên Linux cho Chương 3–5: PowerShell 7 (ảnh chính chủ Microsoft) + evtx (pyevtx-rs 0.15.0, bộ đọc EVTX viết bằng Rust) + jq.
# Get-WinEvent CHỈ có trên Windows ⇒ ở đây đọc .evtx bằng evtx-json (mỗi sự kiện một dòng JSON) rồi xử lý bằng PowerShell (ConvertFrom-Json, Group-Object…) hoặc jq.
# Dựng: docker build -t lgz-win-mau:1 _demo/s03/anh   ·  chạy: docker run --rm --network none -v <thư mục evtx>:/lab:ro lgz-win-mau:1 pwsh -c '…'
FROM mcr.microsoft.com/powershell:lts-ubuntu-22.04
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends python3-pip jq && rm -rf /var/lib/apt/lists/* \
 && pip3 install --no-cache-dir evtx==0.15.0
COPY evtx-json.py /usr/local/bin/evtx-json
RUN chmod +x /usr/local/bin/evtx-json
WORKDIR /lab

# lgz-evtx:1 — đọc .evtx trên Linux: evtx (pyevtx-rs: bộ đọc EVTX viết bằng Rust của Omer BenAmram, gói PyPI 'evtx'; python-evtx thuần Python vỡ ở vài tệp mẫu) + jq.
# Dựng: docker build -t lgz-evtx:1 _demo/s14/anh  (cần mạng một lần để pip tải gói); chạy: docker run --rm --network none ...
FROM python:3.13-slim
RUN apt-get update && apt-get install -y --no-install-recommends jq && rm -rf /var/lib/apt/lists/* && pip install --no-cache-dir evtx==0.15.0
COPY evtx-json.py /usr/local/bin/evtx-json
RUN chmod +x /usr/local/bin/evtx-json
WORKDIR /lab

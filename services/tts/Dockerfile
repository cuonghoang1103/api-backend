# Voice CuongMini — dịch vụ tổng hợp giọng nói (VieNeu v3 Turbo, ONNX/CPU)
#
# Không có tầng GPU nào ở đây và đó là chủ ý: VPS không có GPU, mà bản
# ONNX/CPU int8 chính là bản đã đo (RTF 0,77–1,06 trên 4 nhân). Cài
# thêm PyTorch chỉ làm image phình thêm ~2 GB mà không nhanh hơn một
# mili giây nào.
FROM python:3.11-slim

# libsndfile cho soundfile; ffmpeg để librosa đọc được mp3/m4a người
# dùng tải lên làm giọng mẫu — thiếu nó thì chỉ nhận được wav.
RUN apt-get update \
 && apt-get install -y --no-install-recommends libsndfile1 ffmpeg curl \
 && rm -rf /var/lib/apt/lists/*

# ⚠️ GHIM ĐÚNG BẢN. app.py gọi `_load_voices_from_file` — hàm riêng tư,
# vì thư viện không có `load_voices()` công khai (xem ghi chú trong
# app.py). Thả lỏng bản là một ngày nào đó `pip install` mới sẽ làm mất
# sạch giọng nhân bản mà không có lỗi nào rõ ràng.
RUN pip install --no-cache-dir \
      "vieneu==3.2.4" \
      "fastapi==0.115.6" \
      "uvicorn[standard]==0.34.0" \
      "python-multipart==0.0.20"

WORKDIR /app
COPY app.py /app/app.py

# Model tải về /models — được gắn volume, nên tải đúng MỘT lần rồi
# sống qua mọi lần deploy. Nướng thẳng vào image thì mỗi lần đổi một
# dòng app.py là lại đẩy thêm 1,7 GB.
ENV HF_HOME=/models \
    VIENEU_VOICES_FILE=/models/voices.json \
    PYTHONUNBUFFERED=1

EXPOSE 8080

# MỘT worker, cố ý. Model chiếm ~1,5 GB RAM và không an toàn đa luồng;
# hai worker là gấp đôi bộ nhớ trên con VPS 8 GB đang gánh cả Postgres
# lẫn Next.js, để đổi lấy đúng con số không — vì CPU đã bão hoà từ một
# lượt sinh rồi.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]

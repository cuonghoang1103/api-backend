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

# ⚠️⚠️ BẮT BUỘC dùng chỉ mục CPU cho torch.
#
# `pip install torch` trần trên Linux kéo về bản CUDA — vài GB thư viện
# NVIDIA cho một con VPS không có card đồ hoạ nào. Image sẽ phình từ 2 GB
# lên 6-7 GB và đĩa VPS (49 GB, đã dùng 72%) không còn chỗ thở.
#
# Vì sao cần torch trong khi cả file này viết ra để KHỎI cần torch:
# đọc bằng giọng dựng sẵn thì torch-free thật, nhưng NHÂN BẢN thì
# không. Tài liệu trong chính gói nói rõ — bộ khử nhiễu torch-free,
# nhưng bộ mã hoá người nói dùng fbank của torchaudio. Đặt `denoise=False`
# cũng vô ích vì bộ mã hoá là bắt buộc. Đây là cái giá của việc có giọng
# riêng, và đã đo: image 2,0 GB → ~3,4 GB.
RUN pip install --no-cache-dir \
      --index-url https://download.pytorch.org/whl/cpu \
      "torch==2.6.0+cpu" \
      "torchaudio==2.6.0+cpu"

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
# ⚠️ COPY *.py, KHÔNG chỉ app.py. `app.py` import thẳng `f5_giong` (và
# `dieukhien` / `xuong` / `may` trong try/except), tất cả đều nằm cạnh nó
# trong services/tts/. Chép mỗi app.py thì file có mặt trên VPS nhưng
# KHÔNG có trong image — container không bind-mount /app, chỉ gắn volume
# /models — nên nó chết bằng `ModuleNotFoundError` ngay lúc uvicorn nạp
# app, trong khi deploy.sh vẫn thoát 0 và smoke-test vẫn xanh (smoke-test
# chỉ gọi route của backend Node, không đụng tới TTS). Đã cháy thật
# 15/08/2026: `import f5_giong` thêm vào lúc 02:34, image dựng lúc 03:17,
# TTS crashloop suốt ~24h mà không ai thấy.
# Thư mục f5/ cố ý KHÔNG chép: đó là script train cho máy nhà có GPU.
COPY *.py /app/

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

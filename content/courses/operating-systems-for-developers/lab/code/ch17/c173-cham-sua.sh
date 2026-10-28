# @ Chương 17 · bài 17.3 — chấm LỜI GIẢI MẪU (fixed/) từ máy chủ, rồi tắt và dọn sạch.
@ cd incident
./check.sh fixed
docker ps -a --filter label=com.docker.compose.project=os17 --format '{{.Names}}' | wc -l

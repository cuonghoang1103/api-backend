---
name: video
description: Làm video bằng dòng lệnh: ffmpeg (cắt, ghép, nén, phụ đề, GIF, khung hình, chuẩn âm lượng), Remotion dựng video bằng React, quy trình kịch bản → lồng tiếng TTS → dựng → KIỂM khung hình trước khi giao.
---

# KỸ NĂNG: VIDEO — ffmpeg + Remotion, có kiểm bằng mắt

## 0. Luật vàng

1. **Không ghi đè file gốc.** Mọi đầu ra sang tên mới (`out/…`). ffmpeg có `-y` ghi đè KHÔNG hỏi — chỉ dùng cho file ra.
2. **Đo trước khi làm**: `ffprobe` thời lượng, độ phân giải, fps, codec, có âm thanh không. Nhiều lỗi "ghép bị lệch/đen"
   là do hai nguồn khác fps/độ phân giải/âm thanh.
3. **Kiểm bằng mắt trước khi báo xong** (mục 6): trích khung hình/ảnh lưới và NHÌN (read_file ảnh). "ffmpeg thoát 0"
   không có nghĩa là video đúng.
4. Lệnh dài (encode phút trở lên) ⇒ `chay_lenh_nen` + `doc_dau_ra_nen`, không chặn lượt bằng `run_command`.

## 1. Cài & kiểm khả năng

- macOS `brew install ffmpeg` · Windows `winget install -e --id Gyan.FFmpeg` · Ubuntu `sudo apt-get install -y ffmpeg`.
- **Kiểm bộ lọc trước khi dùng** — bản ffmpeg khác nhau thiếu khác nhau:
  `ffmpeg -hide_banner -filters | grep -E " (subtitles|ass|drawtext) "` (Windows: `findstr`).
  ⚠️ Đã đo: ffmpeg 8 của Homebrew (core) **KHÔNG có `subtitles` lẫn `drawtext`** (thiếu libass/freetype) ⇒ đốt phụ đề
  báo `No option name near 'sub.srt…'`. Cách: phụ đề mềm (mục 3), hoặc bản ffmpeg đủ (tap `homebrew-ffmpeg/ffmpeg`,
  bản tĩnh của BtbN/gyan trên Windows/Linux có libass), hoặc dựng chữ bằng Remotion.
- Bộ mã có sẵn: `ffmpeg -hide_banner -encoders | grep -E "libx264|libx265|videotoolbox|nvenc|qsv|libsvtav1"`.

## 2. Công thức đã chạy thật

```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact in.mp4
# Cắt NHANH không mã hoá lại (cắt ở keyframe ⇒ lệch vài trăm ms ở đầu):
ffmpeg -ss 00:01:05 -i in.mp4 -t 30 -c copy out/cut.mp4
# Cắt CHÍNH XÁC tới khung (mã hoá lại):
ffmpeg -ss 00:01:05 -i in.mp4 -t 30 -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 160k out/cut.mp4
# Ghép (cùng codec/độ phân giải/fps) — danh sách file:
printf "file 'a.mp4'\nfile 'b.mp4'\n" > list.txt && ffmpeg -f concat -safe 0 -i list.txt -c copy out/joined.mp4
# Ghép nguồn KHÁC thông số ⇒ chuẩn hoá từng đoạn trước (cùng scale/fps/ar) rồi mới concat:
ffmpeg -i x.mov -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30" -c:v libx264 -crf 20 -c:a aac -ar 48000 -ac 2 out/x_norm.mp4
# Nén cho web (H.264, phát được mọi nơi, tải dần):
ffmpeg -i in.mp4 -vf "scale=-2:720" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart out/web.mp4
# Phụ đề MỀM (bật/tắt được, không cần libass):
ffmpeg -i in.mp4 -i sub.srt -c copy -c:s mov_text out/soft.mp4
# Phụ đề ĐỐT vào hình (cần bộ lọc subtitles):
ffmpeg -i in.mp4 -vf "subtitles=sub.srt:force_style='FontName=Arial,FontSize=22'" -c:a copy out/burned.mp4
# GIF đẹp (bảng màu riêng):
ffmpeg -i in.mp4 -vf "fps=12,scale=480:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" -loop 0 out/a.gif
# Ảnh tĩnh + âm thanh ⇒ video:
ffmpeg -loop 1 -i cover.png -i voice.wav -c:v libx264 -tune stillimage -pix_fmt yuv420p -c:a aac -shortest out/still.mp4
# Chuẩn âm lượng (YouTube ~ -14 LUFS, podcast/bài giảng -16):
ffmpeg -i in.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:v copy out/loud.mp4
# Tách / thay âm thanh:
ffmpeg -i in.mp4 -vn -c:a copy out/audio.m4a   ;   ffmpeg -i in.mp4 -i new.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest out/dub.mp4
# Dọc 9:16 từ ngang 16:9 (cắt giữa):
ffmpeg -i in.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy out/vertical.mp4
```
- `-pix_fmt yuv420p` khi nguồn là ảnh/PNG — thiếu thì QuickTime/điện thoại không phát được.
- Tăng tốc phần cứng: macOS `-c:v h264_videotoolbox -b:v 6M` (nhanh, file to hơn crf cùng chất lượng); NVIDIA `h264_nvenc`.
- Windows cmd: đường dẫn có dấu cách bọc `"..."`; trong bộ lọc `subtitles=` đường dẫn Windows phải thoát `C\:/path/sub.srt`.

## 3. Phụ đề SRT

```
1
00:00:00,500 --> 00:00:03,200
Dòng thứ nhất

2
00:00:03,400 --> 00:00:06,000
Dòng thứ hai
```
Dấu phẩy trước mili giây, có dòng trống giữa các khối, UTF-8. Mỗi dòng ≤ 42 ký tự, ≤ 2 dòng/khối, hiện ≥ 1 giây.

## 4. Remotion — dựng video bằng React

Hợp khi video có chữ/đồ hoạ/động theo dữ liệu (bài giảng, giới thiệu sản phẩm, chú thích từng chữ).
```bash
npx create-video@latest              # tạo dự án (hỏi mẫu — chạy trong terminal thật, hoặc nhờ người dùng chọn)
npx remotion studio                  # xem trước trong trình duyệt (chạy nền; mở bằng web_mo nếu có)
npx remotion render src/index.ts MyComp out/video.mp4 --props='{"title":"Xin chào"}'
npx remotion still src/index.ts MyComp out/frame.png --frame=90      # một khung để KIỂM
```
- Mọi chuyển động tính từ `useCurrentFrame()` + `interpolate()`/`spring()` — KHÔNG dùng `setTimeout`/CSS animation
  (render từng khung độc lập, thứ chạy theo thời gian thật sẽ nhảy lung tung).
- Âm thanh: `<Audio src={staticFile('voice.mp3')} />`; độ dài composition = thời lượng giọng (ffprobe) × fps.
- Phông chữ tiếng Việt: nạp phông có đủ dấu (`@remotion/google-fonts/BeVietnamPro`…), kiểm khung có chữ có dấu.
- Giấy phép: miễn phí cho cá nhân/công ty ≤ 3 người; lớn hơn cần giấy phép công ty — nhắc người dùng nếu là việc thương mại.

## 5. Quy trình trọn gói: kịch bản → lồng tiếng → dựng → kiểm

1. **Kịch bản**: chia cảnh, mỗi cảnh = lời thoại + hình. Lời nói ~ 2,5 từ/giây (tiếng Việt) ⇒ ước thời lượng.
2. **Lồng tiếng TTS** từng cảnh thành file riêng (sửa một câu không phải làm lại cả bài):
   - macOS có sẵn: `say -v Linh -o out/c01.aiff "Xin chào"` (giọng Việt `Linh`; liệt kê `say -v '?'`), rồi
     `ffmpeg -i out/c01.aiff -ar 48000 -ac 1 out/c01.wav`.
   - Đa nền tảng: `pip install edge-tts` ⇒ `edge-tts --voice vi-VN-HoaiMyNeural --text "…" --write-media out/c01.mp3`
     (cần mạng); ngoại tuyến: Piper.
   - Đo thời lượng từng file bằng ffprobe ⇒ đặt độ dài cảnh theo giọng, không đoán.
3. **Dựng**: Remotion (đồ hoạ) hoặc ffmpeg (ghép cảnh quay + giọng). Nhạc nền nhỏ hơn giọng ~ 15–20 dB
   (`[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2:duration=first`).
4. **Chuẩn âm lượng** cuối (loudnorm) và nén bản giao (mục 2).

## 6. KIỂM trước khi giao (bắt buộc)

```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of compact out/final.mp4
ffmpeg -i out/final.mp4 -vf "fps=1/5,scale=320:-1,tile=4x3" -frames:v 1 out/sheet.png    # lưới khung mỗi 5 giây
ffmpeg -ss 12 -i out/final.mp4 -frames:v 1 out/f12.png                                   # một khung cụ thể
ffmpeg -i out/final.mp4 -af silencedetect=noise=-40dB:d=2 -f null - 2>&1 | grep silence_ # đoạn câm bất thường
ffmpeg -v error -i out/final.mp4 -f null - && echo "giải mã trọn vẹn"
```
NHÌN `sheet.png`: khung đen, chữ tràn/cắt, phụ đề lệch, sai tỉ lệ. Thời lượng khớp kịch bản? Âm thanh có suốt bài?

## 7. Bẫy thường gặp

- `-ss` đặt SAU `-i` thì chính xác nhưng giải mã từ đầu (chậm); đặt TRƯỚC thì nhanh — với `-c copy` luôn lệch về keyframe.
- concat ra video đứng hình/âm lệch ⇒ các đoạn khác timebase/fps/tần số mẫu — chuẩn hoá trước.
- Video quay điện thoại xoay sai ⇒ metadata rotation; mã hoá lại (ffmpeg tự áp) hoặc `-display_rotation`.
- Màn hình quay HDR/HEVC 10-bit ⇒ trình duyệt cũ không phát; xuất H.264 8-bit `yuv420p`.

## 8. Báo cáo cuối

Đường dẫn file ra, thời lượng, độ phân giải, dung lượng, đã KIỂM những khung nào (kèm ảnh lưới), phần còn cần người
dùng duyệt (giọng, nhạc bản quyền, chữ trên hình).

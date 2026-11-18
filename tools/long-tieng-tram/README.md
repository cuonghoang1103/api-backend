# Trạm CT Lồng Tiếng (máy nhà `linux-nha`)

Nhận việc lồng tiếng từ `cuongthai.com` (hợp đồng: `docs/long-tieng-hop-dong.md` mục 2–3), chạy 5 bước của bản mẫu
`lt.mts` (tách giọng → nghe → dịch qua web → giọng cuong8 đọc + nghe lại chấm điểm → canh mốc/trộn), đẩy kết quả lên R2.

| Tệp | Việc |
|---|---|
| `tram.mts` | vòng nhận việc + 5 bước, nhịp tim 60 s, dừng khi web báo 410 |
| `thuatToan.ts` (+ `.test.ts`) | phần thuần: tách đoạn > 8 s, tách câu Việt > 130 ký tự, chấm điểm bản đọc, kế hoạch nhịp `cho-giong`/`tang-toc` |
| `lt-remote.py` | phần chạy bằng Python có GPU: `tach` (Demucs), `nghe` (Whisper large-v3 + mốc từ), `nghe-vi` (chấm bản đọc) |
| `vbg-long-tieng.service` | systemd --user |

## Cài lần đầu (trên `linux-nha`, user Cuong03dx)

```bash
# 1. mã (đồng bộ từ repo; chạy trên Mac)
rsync -a --delete --exclude node_modules --exclude lam --exclude .env --exclude .venv --exclude bin \
  ~/Downloads/api-backend/tools/long-tieng-tram/ linux-nha:long-tieng/

# 2. trên linux-nha
cd ~/long-tieng && npm install                    # chỉ tsx (Node ≥ 20.11)
mkdir -p bin && curl -fsSL -o bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux && chmod +x bin/yt-dlp

# 3. Python cho GPU NHÀ (chỉ khi dùng LT_GPU=local) — venv RIÊNG, không đụng venv sản xuất (f5-train, bot-tele…)
python3 -m venv ~/long-tieng/.venv
~/long-tieng/.venv/bin/pip install -U pip
~/long-tieng/.venv/bin/pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu124   # chọn bản CUDA hợp driver
~/long-tieng/.venv/bin/pip install demucs faster-whisper
# (Whisper large-v3 ~3 GB + medium ~1,5 GB tự tải ở lượt đầu vào ~/.cache/huggingface)

# 4. cấu hình — quyền 600, KHÔNG commit
cat > ~/long-tieng/.env <<'EOF'
LT_API=https://cuongthai.com/api/v1
LT_TOKEN=<INTERNAL_API_TOKEN của web — lấy trong /opt/cuonghoangdev/.env trên VPS>
LT_GPU=vast7            # hoặc local
EOF
chmod 600 ~/long-tieng/.env

# 5. thử một việc rồi thoát
set -a; . ~/long-tieng/.env; set +a; npx tsx tram.mts --mot

# 6. chạy nền
cp vbg-long-tieng.service ~/.config/systemd/user/
systemctl --user daemon-reload && systemctl --user enable --now vbg-long-tieng
loginctl enable-linger Cuong03dx        # chạy cả khi không đăng nhập (nếu chưa bật)
journalctl --user -u vbg-long-tieng -f
```

Cập nhật mã: lặp lại bước 1 rồi `systemctl --user restart vbg-long-tieng` (việc dở tự làm tiếp từ bước dở).

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `LT_TOKEN` | — (bắt buộc) | `INTERNAL_API_TOKEN` của web (header `x-internal-token`) |
| `LT_API` | `https://cuongthai.com/api/v1` | gốc API |
| `LT_GPU` | `local` | `vast7` ⇒ Demucs/Whisper/F5 chạy trên máy thuê qua `ssh vast7` (`/root/video-bai-giang/gpu.sh`, `/root/lt-venv`, `/root/f5-train/.venv`); `local` ⇒ GPU nhà dưới `flock ~/video-bai-giang/.khoa-gpu` (chung khoá với dây chuyền video bài giảng) |
| `LT_VAST_HOST` | `vast7` | tên host ssh của máy thuê |
| `LT_PY_DEMUCS` / `LT_PY_WHISPER` / `LT_PY_F5` | xem `tram.mts` | đổi Python từng việc |
| `LT_VBG` | `~/video-bai-giang` | thư mục có `doc.py` + `.khoa-gpu` (GPU nhà) |
| `LT_GIONG_DIR` | `~/vbg-dp/giong` | lấy `ref-el.json`, `MO_HINH` (checkpoint cuong8) và `phienAmBai.ts › chuDocGoc` — đúng đường sản xuất |
| `LT_LAM` | `~/long-tieng/lam` | thư mục việc (mỗi việc một thư mục, xoá khi xong; bỏ dở > 7 ngày tự dọn) |
| `LT_YTDLP` | `yt-dlp` | đường dẫn yt-dlp |
| `LT_WHISPER_VI_MODEL` | `medium` | model nghe lại bản đọc tiếng Việt |
| `LT_CHU_KY_GIAY` | `10` | chu kỳ hỏi việc |
| `LT_LO_DICH_KY_TU` | `2400` | trần ký tự gốc mỗi lô dịch (kèm trần 40 câu) |
| `LT_O_TRONG_TOI_THIEU_GB` | `8` | ổ trống tối thiểu trước khi tải video; sau khi có video thì đo đúng theo độ dài + cỡ tệp |
| `LT_DEMUCS_DOAN_GIAY` | `900` | (máy chạy `lt-remote.py`) video dài hơn 1,5× số này ⇒ Demucs tách từng đoạn rồi nối, khớp từng mẫu |

## Điều cần biết

- **Tiếp tục thay vì làm lại:** mỗi bước ghi tệp vào `lam/<jobId>/` (`vao.*`, `vocals.flac`/`nen.flac`, `loi-goc.json`, `dich.json`
  theo từng lô, `doc.json` + `am/` theo từng lượt seed). Bấm "Thử lại" trên web ⇒ trạm bỏ qua mọi bước đã có tệp.
- **Huỷ trên web** ⇒ nhịp tim kế tiếp nhận 410 ⇒ giết tiến trình con, xoá thư mục việc (và thư mục trên vast7).
- **Chống giọng vỡ:** đoạn Whisper > 8 s tách trước khi dịch; câu Việt > 130 ký tự tách trước khi đọc; mọi mẩu được nghe lại
  (`nghe-vi`), điểm < 0,85 hoặc độ dài vô lý ⇒ đọc lại seed 7 → 1234 → 99, giữ bản tốt nhất. Điểm từng câu nằm trong `thong-tin.json`,
  dòng tóm tắt hiện ở cột "bước" của việc trên web.
- **Nhịp `cho-giong`** (mặc định): đọc nhanh tối đa 1,08×, câu dài hơn khe thì đoạn hình đó chiếu chậm (≤ 2×) rồi giữ khung —
  video ra dài hơn bản gốc, phải mã hoá lại hình (libx264 veryfast, CPU). `tang-toc` = bản mẫu (nhanh tới 1,3×, giữ nguyên hình).
- **Link YouTube bị chặn ở máy nhà** ⇒ (nếu `LT_GPU=vast7`) thử một lần qua vast7, không vượt chặn gì thêm; hỏng ⇒ việc lỗi với lời
  nhắn "Hãy tải video trên máy bạn rồi kéo vào app".
- **Video dài (1–3 giờ, 18/11):** trước khi dịch soạn TỪ ĐIỂN riêng của việc một lần (`POST /tu-dien`, mẫu rải đều cả bản
  chép — `mauTuDien`), lưu `tu-dien.json`, gửi kèm mọi lô; lô chia theo câu + ký tự (`chiaLoDich`), mỗi lô mang ~6 câu Việt liền
  trước; thiếu câu thì chỉ gửi lại phần thiếu. Demucs tách theo đoạn 15 phút (đỡ RAM); WAV giọng Việt ghi thẳng không nối Buffer;
  ổ không đủ (`dungLuongCan`) ⇒ việc lỗi NGAY với câu "Ổ máy nhà còn X GB… dọn bớt ổ rồi bấm Thử lại". Ưu tiên GPU KHÔNG đổi
  (vẫn chung `flock .khoa-gpu`, video bài giảng giữ ưu tiên).
- Thử phần thuần: `npm test` (trong thư mục này) hoặc từ repo `npx tsx --test tools/long-tieng-tram/thuatToan.test.ts`.

# Danh sách cần tải cho Sân chơi 3D — âm thanh, model, texture

Viết 2/8/2026, sau khi user hỏi *"tải những gì, ở đâu, để đẹp và chuyên nghiệp"*.

**Cách dùng file này**: tải theo từng mục, để nguyên tên file gốc, bỏ vào thư
mục ghi ở đầu mỗi phần. Không cần đổi tên, không cần cắt gọt — Claude sẽ nghe /
xem từng tệp, chọn, nén và nối vào mã.

---

# 0. LUẬT CHUNG — đọc trước khi tải

| | Yêu cầu | Vì sao |
|---|---|---|
| **Âm thanh** | `.mp3`, **mono**, dưới 200 KB, dài đúng như ghi ở từng mục | Game phát theo toạ độ 3D nên stereo bị bỏ; tệp dài làm tăng thời gian tải |
| **Model 3D** | `.glb`, **dưới 15.000 đỉnh**, texture **≤ 1024px** | Chế độ Sinh tồn thả tới 30 con cùng lúc |
| **Model có hoạt ảnh** | **Ưu tiên Mixamo** (xem mục 3) | Đã trả giá: một model tải về có **tư thế bind vỡ** — cỡ phình lên 186 đơn vị và che kín màn hình. Mixamo không bao giờ bị lỗi này |
| **Giấy phép** | **CC0** hoặc **CC BY** | CC0 khỏi ghi công. CC BY thì BẮT BUỘC bấm "Copy credits" và gửi kèm |
| ⛔ **Không lấy** | Model rip từ game thương mại | `fatalis` (Monster Hunter/Capcom) và `battlefield_4_*` (EA/DICE) đã phải loại vì lý do này |

---

# 1. ÂM THANH — https://pixabay.com/sound-effects/

Không cần tài khoản, bấm tải là xong, dùng thương mại thoải mái, không bắt ghi công.

**Bỏ vào**: `~/Downloads/Play Ground/Âm thanh/`

## 1.1. Quái vật — ƯU TIÊN CAO NHẤT

Kho của bản mẫu không có một tiếng quái nào. Hiện đang mượn tạm tiếng sói tru và
tiếng chuông, nghe rất sai.

| Cần | Gõ tìm | Số tệp | Dài |
|---|---|---|---|
| Gầm gừ khi đuổi theo | `monster growl` · `creature growl` · `beast snarl` | 4 | ~1s |
| Rít / hét khi phát hiện người chơi | `monster screech` · `creature scream` · `alien screech` | 3 | ~1s |
| Trúng đạn | `flesh impact` · `meat hit` · `squish hit` | 3 | ~0,4s |
| Chết | `monster death` · `creature dying` · `death groan` | 3 | ~1,5s |
| Bước chân thường | `footstep dirt` · `creature footstep` | 4 | ~0,3s |
| Bước chân **quái trùm** | `heavy footstep` · `giant stomp` · `boss footstep` | 3 | ~0,6s |
| Cắn / cào vào xe | `metal scrape` · `claw scratch metal` | 3 | ~0,5s |
| Tiếng trùm gầm (dài, dữ) | `monster roar` · `boss roar` · `dragon roar` | 2 | 2–3s |

## 1.2. Vũ khí

| Cần | Gõ tìm | Số tệp | Dài |
|---|---|---|---|
| **Súng máy** (thứ user chê "tạch tạch") | `machine gun shot` · `rifle shot` · `gun single shot` | 4 | ~0,3s |
| Nòng quá nhiệt / kẹt | `gun jam` · `metal clank heavy` | 2 | ~0,5s |
| Nòng nguội xong, bắn lại được | `gun reload click` · `weapon ready` | 1 | ~0,4s |
| Tên lửa rời bệ | `rocket launch` · `missile launch` | 2 | ~1s |
| Tên lửa bay | `rocket flyby` · `missile whoosh` | 2 | ~1,5s |
| Nổ lớn | `explosion big` · `explosion distant` | 3 | 1–2s |
| Húc xe vào quái | `car impact` · `metal body hit` | 3 | ~0,5s |

## 1.3. Trực thăng

| Cần | Gõ tìm | Số tệp | Dài |
|---|---|---|---|
| Cánh quạt **lặp liền mạch** | `helicopter loop` · `helicopter rotor loop` | 2 | 3–5s, **phải loop được** |
| Bay tới từ xa | `helicopter approach` · `helicopter flyby` | 1 | 3–4s |
| Hạ cánh / tắt máy | `helicopter landing` · `engine shutdown` | 1 | ~3s |

## 1.4. Nhịp chơi — thứ làm chế độ "gay cấn"

Đây là nhóm user hỏi *"âm thanh hành động theo từng giai đoạn cho gay cấn"*.

| Giai đoạn | Gõ tìm | Số tệp | Dài |
|---|---|---|---|
| **Sắp vào sóng** (đếm ngược 3 giây cuối) | `tension riser` · `suspense buildup` | 2 | 2–3s |
| **Sóng bắt đầu** | `horn alarm` · `siren short` · `battle horn` | 2 | ~2s |
| **Quái trùm xuất hiện** | `boss appear` · `dramatic impact` · `orchestral hit` | 2 | 2–3s |
| **Hết sóng, sống sót** | `success fanfare` · `wave complete` · `level up` | 2 | ~2s |
| **Máu thấp** (nhịp tim, lặp) | `heartbeat loop` · `low health` | 1 | 2–3s, loop |
| **Thua** | `game over` · `defeat sound` | 2 | 2–3s |
| Nhặt tiền | `coin pickup` · `pickup item` | 2 | ~0,3s |
| Nhặt hộp máu | `health pickup` · `heal sound` | 1 | ~0,5s |
| Mua ở cửa hàng | `purchase sound` · `cash register short` | 1 | ~0,5s |
| Mua không đủ tiền | `error beep` · `denied sound` | 1 | ~0,3s |

## 1.5. Không khí ban đêm

| Cần | Gõ tìm | Số tệp | Dài |
|---|---|---|---|
| Gió đêm (lặp) | `wind night loop` · `eerie wind` | 1 | 5–10s, loop |
| Nền rùng rợn (lặp) | `horror ambience` · `dark drone` | 2 | 10–20s, loop |
| Tiếng kim loại kêu xa xa | `metal creak distant` · `eerie metal` | 2 | ~2s |

## 1.6. Nhạc nền cho chế độ Sinh tồn

**Bỏ vào**: `~/Downloads/Play Ground/Nhạc/`

Tìm ở **https://pixabay.com/music/** — gõ `dark electronic` · `action tension` ·
`horror synth` · `industrial battle`. Lấy **2–3 bài**, mỗi bài 2–4 phút.
Game đã có trình phát nhạc; sẽ cho chế độ Sinh tồn tự chuyển sang danh sách này.

---

# 2. MODEL QUÁI — nguồn TỐT NHẤT là Mixamo

## 2.1. Vì sao Mixamo, không phải Sketchfab

**https://www.mixamo.com** — của Adobe, miễn phí, chỉ cần tài khoản Adobe free.

Đây là câu trả lời cho đúng cái lỗi bạn vừa gặp. Model trên Sketchfab do hàng
nghìn người dựng theo hàng nghìn quy ước khác nhau — một trong số đó có **tư thế
bind vỡ** và phình lên 186 đơn vị che kín màn hình. Mixamo thì mọi nhân vật đều
rig theo **một chuẩn duy nhất**, và animation tải kèm luôn khớp.

**Cách tải:**
1. Vào Mixamo → tab **Characters** → chọn nhân vật (có sẵn zombie, quái, người)
2. Sang tab **Animations** → tìm `zombie walk`, `zombie attack`, `zombie death`,
   `monster walk`, `creature attack`
3. Bấm **Download** → chọn **FBX Binary** hoặc **glTF** nếu có
4. **Quan trọng**: tải nhân vật MỘT LẦN kèm nhiều animation — chọn
   "With Skin" cho lần đầu, "Without Skin" cho các animation sau

**Nhân vật nên lấy** (gõ vào ô tìm ở tab Characters):
`zombie` · `mutant` · `warrok` · `maw` · `monster`

**Animation cần cho mỗi con** — đây là bộ tối thiểu để con quái sống động:
| Animation | Gõ tìm | Dùng khi |
|---|---|---|
| Đi | `zombie walk` · `monster walk` | Lảng vảng, mất dấu |
| Chạy | `zombie run` · `creature run` | Đang đuổi người chơi |
| Tấn công | `zombie attack` · `swiping` | Cắn vào xe |
| Trúng đòn | `hit reaction` · `stagger` | Ăn đạn |
| Chết | `zombie death` · `falling back death` | Gục |
| Đứng chờ | `zombie idle` | Chưa phát hiện ai |

## 2.2. Nguồn dự phòng

| Nguồn | Giấy phép | Hợp với |
|---|---|---|
| **https://quaternius.com** | CC0 | Quái/nhân vật low-poly, hợp phong cách đồ chơi của sân chơi này nhất |
| **https://kenney.nl/assets** | CC0 | Vũ khí, vật phẩm, hiệu ứng — bộ "Blaster Kit", "Weapon Pack" |
| **https://poly.pizza** | CC0 / CC BY | Kho low-poly lớn, lọc được theo giấy phép |
| **https://sketchfab.com** | lọc **Downloadable + CC** | Có gì cũng có, nhưng chất lượng rất lệch — chỉ dùng khi ba nguồn trên không có |

---

# 3. NHỮNG THỨ KHÁC LÀM SÂN CHƠI ĐẸP VÀ CHUYÊN NGHIỆP HƠN

Xếp theo **giá trị trên công sức**, cao nhất trước.

## 3.1. Xe cộ — dễ thấy nhất, rẻ nhất

Sân chơi đang có 3 xe. Thêm xe là thêm lý do quay lại.

- **Quaternius** có bộ **"Ultimate Vehicles Pack"** (CC0) — hàng chục xe low-poly
  đúng phong cách, tải một lần được cả bộ
- **Kenney "Car Kit"** (CC0) — xe ghép mảnh, đổi màu được

**Bỏ vào**: `~/Downloads/Play Ground/Phương tiện/`

## 3.2. Vật phẩm cho chế độ Sinh tồn

- Thùng đạn, hòm tiếp tế, mìn, tháp súng tự động
- **Kenney "Blaster Kit"** + **"Tower Defense Kit"** (CC0)

## 3.3. Nhà cửa cho hai khu còn lại của đảo sân chơi

Còn **làng ngôn ngữ JA/EN/ZH** và **bến cảng + hải đăng** chưa dựng.

- **Quaternius "Ultimate Nature Pack"** + **"Modular Village"** (CC0)
- Cho làng Nhật: tìm `torii`, `japanese lantern`, `pagoda` trên Poly Pizza (CC0)
- Cho bến cảng: `lighthouse`, `dock`, `boat`, `shipping container`

## 3.4. Texture mặt đất / vật liệu

- **https://ambientcg.com** — CC0, texture PBR chất lượng cao
- Cần: `Ground`, `Asphalt`, `Metal`, `Concrete` — lấy bản **1K** là đủ

## 3.5. Ảnh nền bầu trời

- **https://polyhaven.com/hdris** — CC0
- Tìm `night sky`, `dramatic sky` — lấy bản **2K**

## 3.6. Phông chữ

- **https://fonts.google.com** — cho HUD và bảng điểm. Hiện đang dùng phông của
  bản mẫu; một phông riêng cho chế độ Sinh tồn (kiểu quân đội / khoa học viễn
  tưởng) sẽ tách hẳn nó khỏi phần còn lại

---

# 4. THỨ TỰ ƯU TIÊN — nếu chỉ tải được một ít

1. **Âm thanh mục 1.1 + 1.2** (quái + súng) — thứ user đã chê thẳng hai lần
2. **Âm thanh mục 1.4** (nhịp chơi) — thứ biến "bắn quái" thành "gay cấn"
3. **Model quái từ Mixamo** — thay hình khối, và không dính lỗi bind vỡ
4. **Nhạc nền mục 1.6**
5. Còn lại tuỳ hứng

---

# 5. GỬI KÈM GÌ KHI TẢI XONG

- Với model **CC BY**: mở trang model, bấm **"Copy credits"**, dán đoạn đó vào
  một file `credits.txt` trong cùng thư mục. Thiếu nó là **không deploy được** —
  ship model CC BY mà không ghi công là vi phạm giấy phép.
- Âm thanh Pixabay và model CC0 thì không cần gì cả.

**Đang còn nợ credit**: `alien_soldier_wip.glb` và `alien_creature_take_3.glb`
(hai model quái đang dùng trong game). Cần trước khi `bash deploy.sh`.

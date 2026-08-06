> Bài này bắt đầu từ một chuyện có thật: tôi thi xong môn tiếng Nhật, tải về file bài làm `.dat` do phần mềm thi sinh ra, và thử mở nó ra để tự chấm điểm. Không mở được. Từ chỗ "không mở được" đó, ta sẽ đi hết một vòng: mã hoá thực sự là gì, vì sao nó **không thể bị phá**, AES khác RSA ra sao, chữ ký số hoạt động thế nào, và vì sao 90% lỗi bảo mật không nằm ở thuật toán mà nằm ở người dùng nó.

## 1. Câu chuyện mở đầu: một file không ai mở được

Sau buổi thi, hệ thống trả về một file tên `cuonghnhe176322.dat` nặng 23.744 byte. Đuôi `.dat` không nói lên điều gì — nó chỉ là viết tắt của "data", ai cũng đặt được, bên trong muốn chứa gì thì chứa. Chính vì trung tính như vậy nên nó hay được dùng cho dữ liệu "không định cho bạn đọc".

Tôi thử 4 cách quen thuộc mà bất kỳ ai muốn xem trộm cũng sẽ thử đầu tiên:

| Phép thử | Kết quả | Ý nghĩa |
|---|---|---|
| Giải nén zlib/gzip | Thất bại | Không phải chỉ nén |
| XOR khoá 1 byte | Tốt nhất 783/2000 ký tự đọc được (cần ~1600 mới là văn bản) | Không phải "mã hoá cho vui" |
| Chi-square = **272,9** (ngẫu nhiên chuẩn ≈ 255) | Byte phân bố phẳng | Không còn quy luật thống kê nào để bám |
| Index of Coincidence = **0,00391** (ngẫu nhiên = 0,0039) | Không có khoá lặp | Loại nốt khả năng khoá ngắn lặp lại |

Và chỉ số quyết định: **entropy = 7,9918 / 8,0**.

Entropy đo mức "khó đoán" của từng byte. Văn bản tiếng Việt khoảng 4–5. File nén khoảng 7,5. **7,99 nghĩa là gần như ngẫu nhiên tuyệt đối** — dấu hiệu kinh điển của mã hoá thật.

Để kiểm chứng giả thuyết, tôi tự mã hoá một khối 23.744 byte bằng AES-256-GCM rồi đo lại:

```
Mã hoá 23744 byte → entropy = 7,9928 / 8,0
File thi thật     → entropy = 7,9918 / 8,0   ✓ trùng khớp
```

Kết luận: file bài thi được khoá bằng **AES**, khoá nằm trên máy chủ nhà trường. Không có khoá thì không mở được — và điều đó **đúng như thiết kế**: nó ngăn sinh viên đọc hoặc sửa bài của chính mình sau khi nộp.

## 2. Mã hoá là gì, và ba khái niệm hay bị lẫn

Trước khi đi sâu, cần tách bạch ba thứ mà người mới rất hay gọi chung là "mã hoá":

| Khái niệm | Mục đích | Mở ngược lại được không? | Dùng khi nào |
|---|---|---|---|
| **Encoding** (Base64, URL-encode) | Đổi định dạng cho dễ truyền | **Được**, ai cũng mở được, không cần khoá | Nhét dữ liệu nhị phân vào JSON/URL |
| **Hashing** (SHA-256, bcrypt, argon2) | Tạo "dấu vân tay" một chiều | **KHÔNG bao giờ** | Lưu mật khẩu, kiểm tra toàn vẹn file |
| **Encryption** (AES, RSA) | Giấu nội dung | **Được, nếu có khoá** | Giấu dữ liệu, truyền tin an toàn |

**Base64 KHÔNG phải mã hoá.** Đây là hiểu lầm phổ biến nhất. `SGVsbG8=` nhìn có vẻ "bí ẩn" nhưng ai cũng giải trong một giây, không cần khoá gì cả. Nếu bạn "bảo mật" dữ liệu bằng Base64, bạn không bảo mật gì hết.

**Mật khẩu người dùng phải HASH, không được ENCRYPT.** Điểm này cực kỳ quan trọng và sẽ quay lại ở phần cuối. Mã hoá có thể mở ngược — nghĩa là nếu server bạn bị chiếm, kẻ tấn công lấy được khoá là đọc được toàn bộ mật khẩu. Hash thì không có đường ngược, kể cả bạn cũng không đọc được mật khẩu của người dùng. **Đó là điều bắt buộc.**

## 3. AES — người vận chuyển

**AES** (Advanced Encryption Standard) là chuẩn mã hoá **đối xứng**: một khoá duy nhất dùng cho cả khoá lại lẫn mở ra. Ra đời năm 2001 sau một cuộc thi công khai toàn cầu, đến nay chưa ai phá được khi dùng đúng. Chính phủ Mỹ dùng nó cho tài liệu TỐI MẬT; HTTPS, WiFi, ổ cứng mã hoá, ngân hàng — tất cả đều dùng AES.

### Nó hoạt động thế nào

![Cấu trúc AES: khối 16 byte đi qua 14 vòng, mỗi vòng gồm SubBytes, ShiftRows, MixColumns và AddRoundKey](/deepdives/crypto/aes-rounds.svg)

AES chia dữ liệu thành các khối 16 byte, rồi với mỗi khối chạy **14 vòng** biến đổi (với khoá 256-bit). Mỗi vòng gồm bốn bước: thay thế từng byte theo bảng tra, dịch hàng, trộn cột, và trộn với khoá vòng. Sau 14 vòng, mối liên hệ thống kê giữa đầu vào và đầu ra biến mất hoàn toàn — chính là con số entropy 7,99 ta đo được ở phần 1.

### Hiệu ứng tuyết lở — vì sao không lần ngược được từng chút một

Tính chất then chốt gọi là **hiệu ứng tuyết lở**: đổi **1 bit** ở đầu vào thì khoảng **một nửa số bit** đầu ra đổi theo.

![Hiệu ứng tuyết lở đo thật: đổi đúng 1 bit đầu vào làm 67 trên 128 bit đầu ra thay đổi](/deepdives/crypto/avalanche.svg)

Tôi đo thật trên AES-256: hai đầu vào khác nhau **đúng 1 bit** cho ra hai bản mã không còn một điểm chung nào. Lấy trung bình 2000 phép thử: **50,04%** số bit đổi — đúng mức lý tưởng về mặt lý thuyết.

Điều này giết chết mọi ý tưởng "dò dần": bạn không thể thử một khoá gần đúng rồi lần ra khoá đúng, vì **không có khái niệm "gần đúng"**. Sai một bit khoá thì kết quả sai hoàn toàn, không có tín hiệu nào dẫn đường.

### Bốn mảnh ghép bắt buộc phải đúng

Đây là phần quan trọng nhất của cả bài. Thuật toán AES thì hoàn hảo, nhưng **cách ráp nó vào hệ thống** mới là nơi mọi sự cố xảy ra.

#### ① KHOÁ — không bao giờ dùng mật khẩu trực tiếp

Khoá AES-256 là **32 byte entropy thật**, không phải chuỗi `"matkhau123"`. Nếu xuất phát từ mật khẩu người dùng, bạn phải "kéo dãn" nó qua một hàm dẫn xuất khoá (KDF) như `scrypt`, `argon2` hoặc `PBKDF2`, kèm **salt** ngẫu nhiên.

Vì sao? Vì mật khẩu có entropy rất thấp — người ta có thể dò từ điển. KDF cố tình làm chậm và tốn RAM, biến việc dò từ 1 tỉ lần/giây xuống còn vài nghìn lần/giây.

```js
import { scryptSync, randomBytes } from 'node:crypto';
const salt = randomBytes(16);               // salt mới mỗi lần
const key  = scryptSync(matKhau, salt, 32); // 32 byte = AES-256
```

#### ② IV / NONCE — mới tinh mỗi lần, và tuyệt đối không tái dùng

IV (Initialization Vector, GCM gọi là nonce) là giá trị ngẫu nhiên khiến **cùng một nội dung mã hoá hai lần cho ra hai kết quả khác nhau**. Không có nó, kẻ tấn công nhìn thấy hai bản mã giống nhau là biết ngay hai nội dung giống nhau.

IV **không cần bí mật** — cứ ghép thẳng vào đầu file. Nhưng nó **phải khác nhau mỗi lần**. Với chế độ GCM, **tái dùng IV cùng một khoá là án tử**: kẻ tấn công có thể khôi phục khoá xác thực và giả mạo dữ liệu tuỳ ý.

#### ③ CHẾ ĐỘ — dùng loại có xác thực (GCM), đừng dùng ECB hay CBC trần

Đây là chỗ tinh tế mà nhiều người bỏ qua, nên tôi làm hẳn một thí nghiệm:

![Cùng một ảnh ổ khoá mã hoá bằng AES-ECB vẫn nhìn rõ hình, còn AES-GCM thì hoàn toàn nhiễu](/deepdives/crypto/ecb-vs-gcm.svg)

Ba bảng trên là **dữ liệu mã hoá thật**, cùng một khoá AES-256, chỉ khác **chế độ**:

- **Chế độ ECB** mã hoá từng khối 16 byte độc lập ⇒ khối giống nhau cho ra bản mã giống nhau ⇒ **hình ổ khoá vẫn hiện nguyên**. Đo được: bản gốc có 64 khối trùng lặp, bản mã ECB cũng đúng **64 khối trùng** — toàn bộ hình mẫu được giữ nguyên.
- **Chế độ GCM** có IV ngẫu nhiên ⇒ **0 khối trùng** ⇒ không rò rỉ gì.

Bài học: mã hoá mạnh nhất thế giới + chế độ sai = **vẫn lộ**.

Ngoài ra, mã hoá chỉ đảm bảo **bí mật**, không đảm bảo **toàn vẹn**. Với AES-CBC trần, kẻ tấn công không đọc được nội dung nhưng **vẫn có thể sửa** nó theo cách có chủ đích, và bạn giải mã ra dữ liệu rác mà không hề hay biết. **AES-GCM** giải quyết bằng "tem niêm phong" 16 byte (auth tag) — sửa dù chỉ 1 bit là giải mã báo lỗi ngay.

Nguyên tắc chung: **luôn dùng AEAD** (Authenticated Encryption with Associated Data) — tức AES-GCM hoặc ChaCha20-Poly1305.

#### ④ KHOÁ CẤT Ở ĐÂU — đây mới là toàn bộ vấn đề

Mã hoá mạnh cỡ nào cũng vô nghĩa nếu khoá bị lộ. Khoá phải nằm ở biến môi trường, secret manager, hoặc KMS — **không bao giờ hardcode trong code, không bao giờ commit lên Git**.

Lịch sử đã chứng minh: hàng chục nghìn khoá AWS, Stripe, Firebase bị quét thấy trên GitHub công khai mỗi năm. Bot quét repo mới trong vòng **vài giây** sau khi push.

## 4. Vì sao mã hoá này KHÔNG THỂ bị phá

Đây là phần nhiều người hoài nghi nhất: "chắc khó thôi chứ, siêu máy tính hay AI thì phá được." Không. Hãy nhìn con số.

![Quy mô dò khoá AES-256: cần thử 1,16 nhân 10 mũ 77 khả năng, vượt xa mọi giới hạn vật lý](/deepdives/crypto/bruteforce.svg)

Dò hết khoá AES-256 cần thử **2²⁵⁶ ≈ 1,16 × 10⁷⁷** khả năng. Để dễ hình dung, con số này lớn cỡ **1/1000 tổng số nguyên tử trong toàn vũ trụ quan sát được**.

Ba kịch bản, tính bằng số thật:

1. **Một siêu máy tính** thử 1 tỉ tỉ khoá mỗi giây → cần **2,7 × 10⁴¹ lần tuổi vũ trụ**.
2. **Toàn bộ nhân loại**: 8 tỉ người, mỗi người sở hữu 1 tỉ siêu máy tính, mỗi máy thử 1 nghìn tỉ khoá/giây → vẫn cần **3,3 × 10²⁸ lần tuổi vũ trụ**.
3. **Chặn trên của vật lý** — đây mới là lập luận không thể cãi. Theo **giới hạn Landauer**, mỗi thao tác tính toán tiêu tốn tối thiểu một lượng năng lượng nhất định. Chỉ riêng việc **ĐẾM** từ 1 đến 2²⁵⁶ (chưa cần mã hoá gì) đã cần **3,3 × 10⁵⁶ J**. Trong khi toàn bộ năng lượng Mặt Trời phát ra trong **cả đời 10 tỉ năm** chỉ là 1,2 × 10⁴⁴ J. Tức là cần **2,7 nghìn tỉ lần** toàn bộ năng lượng cả đời Mặt Trời.

Nói cách khác: đây **không phải "rất khó"**. Đây là **không thể** — vũ trụ hết năng lượng trước khi đếm xong.

> **Còn máy tính lượng tử thì sao?** Thuật toán Grover về lý thuyết rút căn bậc hai không gian tìm kiếm, biến AES-256 thành "tương đương AES-128" về độ khó. Nhưng 2¹²⁸ vẫn là 3,4 × 10³⁸ — vẫn ngoài tầm với của mọi thứ khả thi. **AES-256 vẫn an toàn trong kỷ nguyên lượng tử.** RSA thì khác: thuật toán Shor phá được RSA thật sự, nên thế giới đang chuyển dần sang mật mã hậu lượng tử cho phần trao khoá.

Vì thế, hãy nhớ kết luận này: **chưa từng có vụ sập bảo mật nào do dò ra khoá AES.** Tất cả đều do khoá bị lộ, hoặc do ráp sai bốn mảnh ghép ở trên.

## 5. Bắt tay làm: module mã hoá thật, chạy được

Dưới đây là bản rút gọn của module `src/utils/crypto.ts` đang dùng trong dự án này. Nó gói cả 4 mảnh ghép trên vào một API mà bạn khó dùng sai.

```ts
import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const ALGO = 'aes-256-gcm';
const IV_BYTES = 12;   // GCM chuẩn 12 byte
const TAG_BYTES = 16;  // tem niêm phong

/** Sinh khoá 32 byte — chạy MỘT lần, dán vào .env, KHÔNG commit */
export function generateKey(): string {
  return randomBytes(32).toString('base64');
}

export function encrypt(plaintext: string, aad?: string): string {
  const key = loadKey();                    // đọc từ APP_ENCRYPTION_KEY
  const iv = randomBytes(IV_BYTES);         // ② IV mới mỗi lần
  const cipher = createCipheriv(ALGO, key, iv);
  if (aad) cipher.setAAD(Buffer.from(aad, 'utf8'));  // ràng ngữ cảnh

  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();          // ③ tem niêm phong

  // Gói iv ‖ tag ‖ ciphertext thành MỘT chuỗi, lưu vừa cột TEXT
  return `v1.${Buffer.concat([iv, tag, ct]).toString('base64url')}`;
}

export function decrypt(token: string, aad?: string): string {
  const [version, payload] = token.split('.', 2);
  if (version !== 'v1') throw new CryptoError('Phiên bản token không hỗ trợ');

  const packed = Buffer.from(payload, 'base64url');
  const iv  = packed.subarray(0, IV_BYTES);
  const tag = packed.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const ct  = packed.subarray(IV_BYTES + TAG_BYTES);

  const decipher = createDecipheriv(ALGO, loadKey(), iv);
  if (aad) decipher.setAAD(Buffer.from(aad, 'utf8'));
  decipher.setAuthTag(tag);

  try {
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
  } catch {
    // Tag không khớp → sai khoá, sai aad, hoặc bị sửa trộm.
    // Thông báo cố tình chung chung: nói rõ lý do là tạo "oracle" cho kẻ tấn công dò.
    throw new CryptoError('Giải mã thất bại: sai khoá, sai ngữ cảnh, hoặc dữ liệu bị sửa');
  }
}
```

### Vài quyết định thiết kế đáng chú ý

**Gói thành một chuỗi `v1.<base64url>`.** IV và tag không bí mật, nên ghép chung với bản mã thành một token duy nhất — lưu vừa một cột `TEXT`, không cần thêm cột phụ. Tiền tố `v1.` cho phép sau này đổi thuật toán mà vẫn đọc được dữ liệu cũ.

**Tham số `aad` — ràng buộc ngữ cảnh.** Đây là tính năng ít người biết của GCM. Bạn có thể "buộc" bản mã vào một ngữ cảnh:

```ts
const token = encrypt('ghi chú riêng tư', `user:${userId}`);
```

Nếu kẻ tấn công copy blob này sang hàng của người dùng khác trong DB, giải mã sẽ **thất bại** thay vì lặng lẽ trả ra nội dung. Chống được cả một lớp tấn công "hoán vị bản ghi".

**Thông báo lỗi cố tình mơ hồ.** Nếu phân biệt rõ "sai khoá" với "bị sửa trộm", bạn vô tình tạo ra một **oracle** — kẻ tấn công gửi thử hàng nghìn biến thể và dựa vào thông báo lỗi để dò dần ra khoá. Đây chính là nguyên lý của tấn công padding oracle.

**Đọc khoá lười (lazy).** Khoá được đọc bên trong mỗi lời gọi, không phải lúc `import`. Nhờ vậy, chỉ nạp module thôi thì không có tác dụng phụ nào — thiếu biến môi trường cũng **không làm sập server lúc khởi động**, chỉ báo lỗi rõ ràng khi thực sự gọi hàm.

### Kiểm chứng bằng test, không tin lời hứa

Module đi kèm 13 test bảo vệ đúng những tính chất đã nêu:

```
✔ round-trip: decrypt(encrypt(x)) === x
✔ round-trip survives unicode (tiếng Việt + kana + emoji)
✔ ciphertext hides the plaintext
✔ same input encrypted twice yields different tokens (fresh IV)
✔ tampering with one byte is detected
✔ wrong key cannot decrypt
✔ aad binds ciphertext to its context
✔ malformed tokens throw CryptoError, never return garbage
...
# pass 13  # fail 0
```

Test "same input encrypted twice yields different tokens" chính là bộ gác cho mảnh ghép ②: nếu ai đó sửa code thành IV cố định, test này đỏ ngay lập tức.

## 6. RSA — người giữ cửa

AES có một vấn đề nan giải: **hai bên phải cùng biết khoá trước**. Nhưng nếu bạn chưa từng gặp máy chủ của Google, làm sao thống nhất được khoá bí mật khi mọi thứ gửi đi đều có thể bị nghe lén?

Đó là bài toán mà **mã hoá bất đối xứng** giải quyết. RSA (1977) dùng **một cặp khoá**:

- **Khoá công khai** — công bố cho cả thế giới. Dùng để **mã hoá** và **xác minh chữ ký**.
- **Khoá riêng tư** — giữ tuyệt mật. Dùng để **giải mã** và **ký**.

Điều kỳ diệu: cái gì khoá công khai khoá lại thì **chỉ** khoá riêng mở được, và ngược lại. Nền tảng toán học là bài toán phân tích thừa số nguyên tố — nhân hai số nguyên tố lớn thì dễ, tách ngược ra thì cực khó.

### Chữ ký số — demo chạy thật

![Chữ ký số: ký bằng khoá riêng, xác minh bằng khoá công khai, sửa một chữ số là lộ ngay](/deepdives/crypto/chu-ky-so.svg)

Đảo ngược vai trò cặp khoá, ta được **chữ ký số**: ký bằng khoá riêng, ai cũng xác minh được bằng khoá công khai.

```js
import { generateKeyPairSync, sign, verify } from 'node:crypto';

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

const hopDong = 'Chuyển 50.000.000 VND cho tài khoản 0912345678';
const chuKy = sign('sha256', Buffer.from(hopDong), privateKey);

verify('sha256', Buffer.from(hopDong), publicKey, chuKy);  // → true
```

Kết quả chạy thật:

```
Văn bản : Chuyen 50.000.000 VND cho tai khoan 0912345678
Chữ ký  : anPjezcnidDEkiiCipQL5R2EEthR6vDL0BS7qHKw... (256 byte)

Xác minh (bản gốc)   : ✅ HỢP LỆ
Xác minh (bị sửa số) : ❌ GIẢ MẠO — bị phát hiện
```

Chỉ đổi `50.000.000` thành `90.000.000` — một chữ số — chữ ký lập tức vô hiệu.

**Chữ ký số cho ba đảm bảo cùng lúc:**

1. **Xác thực** — đúng người giữ khoá riêng đã ký.
2. **Toàn vẹn** — nội dung không bị sửa dù một ký tự.
3. **Chống chối bỏ** — người ký không thể chối, vì chỉ họ có khoá riêng.

Đây chính là cơ chế đằng sau chữ ký số doanh nghiệp, hoá đơn điện tử, cập nhật phần mềm có ký, và chứng chỉ HTTPS.

> **Lưu ý kỹ thuật:** thực tế người ta không ký thẳng văn bản mà ký **hash** của nó (`sha256` trong lời gọi trên). Vì RSA chậm và giới hạn kích thước, còn hash thì luôn cố định 32 byte dù văn bản dài bao nhiêu.

## 7. AES vs RSA — so sánh sâu

### Đo tốc độ thật, không nói cảm tính

Tôi đo trên cùng 1 MB dữ liệu, cả hai chiều mã hoá + giải mã:

```
AES-256-GCM  mã hoá + giải mã 1 MB : 2,1 ms
RSA-2048     mã hoá 1 mảnh 190 B   : 0,022 ms   (khoá công khai — nhanh)
RSA-2048     giải mã 1 mảnh 190 B  : 0,559 ms   (khoá riêng — chậm hơn ~26 lần)
RSA-2048     cả 1 MB (ước tính)    : 3,2 giây   (phải chia 5.519 mảnh)

→ AES nhanh hơn khoảng 1.520 lần
```

Và giới hạn kích thước — điểm chí mạng của RSA:

```
Thử mã hoá 300 byte bằng RSA-2048 → ❌ data too large for key size
AES mã hoá 300 byte (và cả GB)    → ✅ không giới hạn
```

**RSA-2048 chỉ mã hoá được tối đa ~190 byte một lần.** Không phải "chậm nên tránh", mà là **về mặt cấu trúc không dùng được** cho dữ liệu lớn.

### Bảng đối chiếu đầy đủ

| Tiêu chí | AES (đối xứng) | RSA (bất đối xứng) |
|---|---|---|
| Số khoá | 1 khoá dùng chung | 2 khoá (công khai + riêng tư) |
| Tốc độ 1 MB | **2,1 ms** | ~3,2 giây |
| Kích thước xử lý | Không giới hạn | **Tối đa ~190 byte** (RSA-2048) |
| Độ dài khoá điển hình | 256 bit | 2048–4096 bit |
| Bài toán khó nền tảng | Không có đường tắt nào được biết | Phân tích thừa số nguyên tố |
| Trao khoá ban đầu | **Vấn đề nan giải** | Giải quyết trọn vẹn |
| Chữ ký số | Không làm được | **Làm được** |
| Chống máy tính lượng tử | Khá tốt (AES-256 vẫn an toàn) | **Bị phá** bởi thuật toán Shor |
| Dùng cho | Dữ liệu lớn, lưu trữ, streaming | Trao khoá, chữ ký, chứng chỉ |

### Vậy nên chọn cái nào? — Câu trả lời là "cả hai"

Đây là điểm mấu chốt mà nhiều người học xong vẫn nhầm. **HTTPS dùng cả hai cùng lúc**, gọi là mã hoá lai (hybrid):

![Bắt tay HTTPS: RSA hoặc ECDHE trao khoá phiên, sau đó AES chở toàn bộ dữ liệu](/deepdives/crypto/hybrid-tls.svg)

RSA giải bài toán *"làm sao thống nhất bí mật khi chưa từng gặp nhau"*. AES giải bài toán *"chở khối lượng lớn thật nhanh"*. Mỗi bên làm đúng việc mình giỏi.

> **Ghi chú thời sự:** ngày nay TLS hiện đại đã chuyển phần lớn sang **ECDHE** (đường cong elliptic) thay cho RSA ở bước trao khoá — nhanh hơn, khoá ngắn hơn với cùng mức an toàn (khoá ECC 256-bit ≈ RSA 3072-bit). Nhưng mô hình "bất đối xứng trao khoá + đối xứng chở dữ liệu" thì vẫn y nguyên.

## 8. Vì sao TUYỆT ĐỐI không tự viết thuật toán mã hoá

Đến đây nhiều người sẽ nghĩ: "Hiểu rồi, để tôi tự viết một thuật toán riêng, không ai biết cách hoạt động thì càng khó phá."

Đây là sai lầm nguy hiểm nhất trong toàn bộ lĩnh vực này. Có tên hẳn hoi: **"security through obscurity"** — bảo mật bằng cách giấu diếm.

### Nguyên lý Kerckhoffs (1883)

Hơn 140 năm trước, nhà mật mã học người Hà Lan Auguste Kerckhoffs đã phát biểu nguyên tắc nền tảng:

> Một hệ mật phải an toàn **ngay cả khi mọi thứ về nó đều công khai, trừ khoá.**

AES được thiết kế công khai, thi tuyển công khai, mã nguồn công khai, hàng chục nghìn nhà nghiên cứu tấn công suốt 25 năm — **và vẫn đứng vững**. Đó chính là lý do bạn tin được nó.

Thuật toán tự chế của bạn thì có bao nhiêu chuyên gia đã thử phá? Không ai. "Chưa ai phá" không có nghĩa là "không phá được" — nó chỉ có nghĩa là **chưa ai buồn thử**.

### Ba lý do cụ thể

**① Bạn không thể tự kiểm chứng.** Bạn viết xong, chạy thử, thấy "mã hoá rồi giải mã lại đúng" — nhưng đó chỉ chứng minh nó *hoạt động*, không chứng minh nó *an toàn*. Bruce Schneier có câu nổi tiếng: ai cũng viết được thuật toán mà chính họ không phá nổi.

**② Các lỗ hổng thực tế cực kỳ tinh vi.** Không phải kiểu "đoán ra khoá", mà là:

- **Tấn công kênh phụ**: đo *thời gian* thực thi để suy ra khoá. Một phép so sánh `if (a === b)` thoát sớm cũng đủ làm rò rỉ.
- **Padding oracle**: dựa vào việc server báo lỗi *khác nhau* giữa "sai padding" và "sai nội dung" để giải mã dần từng byte mà **không cần khoá**.
- **Phân tích năng lượng**: đo điện năng tiêu thụ của chip để đọc ra khoá.

**③ Ngay cả chuyên gia cũng sai.** Và đây là phần đáng học nhất.

### Các vụ sập kinh điển — mỗi vụ là một mảnh ghép làm sai

![Bốn mảnh ghép và các vụ sập bảo mật tương ứng: Debian, WEP, PlayStation 3, Adobe, Zoom](/deepdives/crypto/bon-manh-ghep.svg)

Điều đáng chú ý: **hầu như không vụ nào là do AES bị phá.** Tất cả đều do ráp sai.

| Vụ việc | Mảnh ghép sai | Chuyện gì đã xảy ra |
|---|---|---|
| **WEP (WiFi, 2001)** | ② IV | IV chỉ 24 bit và tái sử dụng. Mạng bận rộn lặp IV sau vài giờ → **phá được khoá WiFi trong vài phút** bằng laptop thường. Cả chuẩn bị khai tử. |
| **Sony PlayStation 3 (2010)** | ② Nonce | Sony dùng **cùng một số ngẫu nhiên** cho mọi chữ ký ECDSA thay vì đổi mỗi lần. Nhóm fail0verflow lấy được **khoá ký chủ** của Sony chỉ từ hai chữ ký — ký được firmware giả mạo vĩnh viễn. Không vá được vì khoá đã nằm cứng trong máy. |
| **Adobe (2013, 153 triệu tài khoản)** | Hash vs Encrypt | Adobe **mã hoá** mật khẩu bằng 3DES-ECB thay vì hash. Chế độ ECB khiến mật khẩu giống nhau ra bản mã giống nhau; cột "gợi ý mật khẩu" lưu dạng chữ thường. Cộng đồng giải ra mật khẩu phổ biến **mà không cần khoá**. |
| **Zoom (2020)** | ③ Chế độ | Quảng cáo "mã hoá đầu cuối" nhưng thực tế dùng AES-128-**ECB** — chế độ để lộ hình mẫu dữ liệu, đúng như thí nghiệm ổ khoá ở phần 3. Bị FTC xử lý vì quảng cáo sai. |
| **Heartbleed (OpenSSL, 2014)** | Lỗi lập trình | Không phải lỗi mật mã mà là **thiếu kiểm tra độ dài bộ đệm** — rò rỉ 64 KB RAM server mỗi lần hỏi, gồm cả khoá riêng. Nằm trong thư viện được **2/3 web toàn cầu** dùng suốt 2 năm. |
| **Debian OpenSSL (2006–2008)** | ① Entropy | Một lập trình viên xoá 2 dòng code để tắt cảnh báo của công cụ phân tích — vô tình làm bộ sinh số ngẫu nhiên chỉ còn **32.767 khả năng**. Mọi khoá SSH/SSL sinh ra trên Debian trong 2 năm đều dò được trong vài phút. |

Đọc lại bảng trên: **WEP và PS3 chết vì mảnh ghép ②. Adobe và Zoom chết vì mảnh ghép ③. Debian chết vì mảnh ghép ①.** Thuật toán AES/RSA/ECDSA không hề bị phá trong bất kỳ vụ nào.

Bài học: **thuật toán không phải điểm yếu — cách bạn dùng nó mới là.**

### Vậy phải làm gì?

**Dùng thư viện đã được kiểm chứng, và dùng ở mức trừu tượng cao nhất có thể.**

| Nhu cầu | Dùng cái này |
|---|---|
| Mã hoá dữ liệu | `node:crypto` với **AES-256-GCM** (như module ở phần 5) |
| Muốn khó dùng sai hơn nữa | **libsodium** (`sodium-native`, `tweetnacl`) — chọn sẵn thuật toán tốt, bịt sẵn bẫy IV/tag |
| Lưu mật khẩu | **bcrypt** hoặc **argon2** — KHÔNG phải AES, KHÔNG phải SHA-256 trần |
| Truyền dữ liệu qua mạng | **TLS/HTTPS** — đừng tự làm lớp mã hoá riêng bên trên |
| Token phiên đăng nhập | **JWT** với thư viện chuẩn, hoặc session ngẫu nhiên |
| Quản lý khoá | Biến môi trường / KMS / secret manager — không hardcode |

Nguyên tắc vàng: **bạn nên là người *dùng* mật mã, không phải người *phát minh* mật mã.**

## 9. Áp dụng vào dự án thật

### Nên mã hoá cái gì

- Token của bên thứ ba (OAuth, API key của người dùng)
- Dữ liệu cá nhân nhạy cảm (số điện thoại, địa chỉ, CCCD)
- Nội dung riêng tư (ghi chú cá nhân, tin nhắn lưu trữ)
- Dữ liệu tạm gửi qua client rồi nhận lại — đúng mô hình file bài thi ở đầu bài

### KHÔNG mã hoá cái gì

- **Mật khẩu** → phải hash bằng bcrypt/argon2
- Dữ liệu cần tìm kiếm/sắp xếp trong SQL (mã hoá xong thì `WHERE`, `ORDER BY` vô dụng)
- Dữ liệu công khai (mã hoá chỉ tốn CPU vô ích)

### Checklist trước khi lên production

- [ ] Khoá sinh bằng `randomBytes(32)`, **không** phải chuỗi tự nghĩ
- [ ] Khoá nằm trong biến môi trường / KMS, **không** trong code, **không** trong Git
- [ ] Dùng **AES-256-GCM** (AEAD), không dùng ECB, không dùng CBC trần
- [ ] IV ngẫu nhiên **mỗi lần**, không tái dùng
- [ ] Có kiểm tra auth tag khi giải mã (GCM tự làm — đừng bắt lỗi rồi bỏ qua)
- [ ] Thông báo lỗi giải mã **chung chung**, không tiết lộ nguyên nhân
- [ ] Có kế hoạch **xoay khoá** (versioned token `v1.` giúp việc này)
- [ ] Mật khẩu người dùng dùng **bcrypt/argon2**, tuyệt đối không AES
- [ ] Có **test** cho các tính chất: round-trip, IV khác nhau, phát hiện sửa trộm

## 10. Quay lại file bài thi

Giờ thì bạn đã hiểu vì sao file `.dat` đó không mở được — và vì sao **đó là chuyện tốt**.

Phần mềm thi làm đúng cả bốn mảnh ghép: khoá thật nằm trên máy chủ, IV ngẫu nhiên (nên không có khối 16 byte nào lặp lại — ta đã đo: 0 khối trùng, đúng như cột GCM trong thí nghiệm ổ khoá), chế độ có xác thực, và khoá không bao giờ rời khỏi phía nhà trường. Kết quả là bài làm **không thể bị sửa sau khi nộp** — kể cả bởi chính người thi, kể cả bởi một sinh viên khác lấy được file.

Đó chính xác là điều một hệ thống thi cử cần: không phải để giấu người học, mà để **bảo vệ tính công bằng của kỳ thi**.

Và nếu một ngày bạn xây hệ thống thi của riêng mình — giờ bạn đã biết đủ để làm đúng ngay từ đầu.

### Tài liệu nên đọc thêm

- **NIST SP 800-38D** — chuẩn chính thức về chế độ GCM
- **Cryptography Engineering** (Ferguson, Schneier, Kohno) — sách gối đầu giường về ráp mật mã đúng cách
- **Tài liệu libsodium** — mẫu mực về API mật mã khó dùng sai
- **Node.js `crypto` docs** — tra cứu khi làm thật

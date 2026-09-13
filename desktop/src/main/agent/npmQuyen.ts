/**
 * ============================================================
 * CHỮA GỐC: `npm i -g` KHÔNG CẦN QUYỀN QUẢN TRỊ NỮA
 * ============================================================
 *
 * Nâng quyền chạy được, nhưng với riêng `npm -g` thì nó là câu trả lời SAI:
 *
 *  • Mỗi lần cài một gói toàn cục là một hộp UAC/mật khẩu nữa.
 *  • Gói cài ra thuộc về root. Lần sau `npm update` ở quyền thường lại hỏng,
 *    và người dùng quay lại đúng chỗ cũ.
 *  • Chính npm cũng khuyên đừng chạy nó bằng sudo.
 *
 * Nguyên nhân thật: bộ cài Node chính thức đặt thư mục gói toàn cục vào chỗ
 * chỉ admin ghi được (`%ProgramFiles%\nodejs`, `/usr/lib/node_modules`). Trỏ
 * `prefix` sang một thư mục THUỘC VỀ NGƯỜI DÙNG là xong vĩnh viễn — đó cũng
 * đúng là cách `nvm`, `fnm`, `volta` làm sẵn.
 *
 * ⚠️ Vì sao macOS thường KHÔNG cần: Node cài qua Homebrew hay nvm vốn đã nằm
 * trong thư mục của người dùng. Chỉ bản tải từ nodejs.org mới ghi vào
 * `/usr/local/lib` và đòi quyền. Nên đừng chạy bước này theo nền tảng — chạy
 * theo TRIỆU CHỨNG (`nhanRaLoiQuyen`).
 */

export type Nen = 'win32' | 'darwin' | 'linux';

/** Thư mục gói toàn cục thuộc về người dùng. */
export function thuMucNpmRieng(nen: Nen, moiTruong: NodeJS.ProcessEnv = process.env): string {
  if (nen === 'win32') {
    const base = moiTruong.LOCALAPPDATA ?? `${moiTruong.USERPROFILE ?? '%USERPROFILE%'}\\AppData\\Local`;
    return `${base}\\npm-global`;
  }
  return `${moiTruong.HOME ?? '$HOME'}/.npm-global`;
}

/**
 * Lệnh trỏ `prefix` sang thư mục riêng.
 *
 * Trả về MỘT chuỗi để người dùng đọc trọn trong thẻ duyệt. Nó không cần quyền
 * gì cả — đó là cả điểm.
 */
export function lenhSuaPrefixNpm(nen: Nen, moiTruong: NodeJS.ProcessEnv = process.env): string {
  const d = thuMucNpmRieng(nen, moiTruong);
  return `npm config set prefix "${d}"`;
}

/**
 * Câu chỉ đường sau khi đổi prefix.
 *
 * ⚠️ Đổi prefix thôi thì CHƯA đủ: thư mục mới chưa nằm trong `PATH`, nên cài
 * xong gõ tên lệnh vẫn "command not found" — và người dùng kết luận là việc
 * đổi prefix không ăn thua. Phải nói luôn bước thêm vào PATH.
 */
export function themVaoPath(nen: Nen, moiTruong: NodeJS.ProcessEnv = process.env): string {
  const d = thuMucNpmRieng(nen, moiTruong);
  if (nen === 'win32') return `setx PATH "%PATH%;${d}"`;
  return `echo 'export PATH="${d}/bin:$PATH"' >> ~/.zshrc`;
}

/**
 * Đầu ra này có phải là "thiếu quyền" không.
 *
 * ⚠️ Nhận diện theo TRIỆU CHỨNG, không theo nền tảng. Cùng một máy Windows có
 * thể cài Node bằng nvm (không cần quyền) hay bằng bộ cài MSI (cần) — đoán
 * theo `process.platform` là đoán sai một nửa số máy.
 *
 * Mã thoát KHÔNG đủ để kết luận: `npm` trả 1 cho gần như mọi loại hỏng. Phải
 * đọc chữ.
 */
export function nhanRaLoiQuyen(ra: string): boolean {
  if (ra === '') return false;
  return /\b(EACCES|EPERM|ERR_ACCESS)\b/i.test(ra)
    || /permission denied/i.test(ra)
    || /access is denied/i.test(ra)
    || /operation not permitted/i.test(ra)
    || /need(s)? to be run as (root|administrator)/i.test(ra)
    || /requires? elevation/i.test(ra);
}

/** Lệnh này có phải là cài gói npm toàn cục không. */
export function laCaiNpmToanCuc(lenh: string): boolean {
  const s = lenh.trim().toLowerCase();
  if (!/^(npm|pnpm|yarn)\b/.test(s)) return false;
  // `-g`, `--global`, hoặc `--location=global`.
  return /(^|\s)(-g|--global|--location=global)(\s|$)/.test(s);
}

/**
 * Câu gợi ý nhét vào đầu ra tool khi lệnh hỏng vì thiếu quyền.
 *
 * Model đọc từ trên xuống và hay dừng ở dòng đầu, nên câu này phải NÓI ĐƯỢC
 * VIỆC CẦN LÀM chứ không chỉ mô tả vấn đề. Trả `''` khi không phải ca này —
 * thêm nhiễu vào mọi lệnh hỏng là cách nhanh nhất để model thôi đọc phần này.
 */
export function goiYKhiThieuQuyen(
  lenh: string,
  ra: string,
  nen: Nen = process.platform as Nen,
  moiTruong: NodeJS.ProcessEnv = process.env,
): string {
  if (!nhanRaLoiQuyen(ra)) return '';

  if (laCaiNpmToanCuc(lenh)) {
    return [
      '',
      'THIẾU QUYỀN — nhưng ĐỪNG bảo người dùng mở cửa sổ quyền quản trị.',
      'Gói toàn cục của npm đang nằm ở thư mục chỉ admin ghi được. Cách đúng là trỏ nó',
      'sang thư mục của chính người dùng, làm MỘT LẦN rồi thôi, và không cần quyền gì:',
      '',
      `    ${lenhSuaPrefixNpm(nen, moiTruong)}`,
      `    ${themVaoPath(nen, moiTruong)}`,
      '',
      'Chạy hai lệnh đó (qua run_command, người dùng vẫn duyệt), rồi chạy lại lệnh cài ban đầu.',
      'Nâng quyền cho npm là cách SAI: gói cài ra sẽ thuộc về root và lần cập nhật sau lại hỏng.',
    ].join('\n');
  }

  return [
    '',
    'THIẾU QUYỀN. Lệnh này cần quyền quản trị.',
    'ĐỪNG bảo người dùng tự mở cửa sổ quyền quản trị rồi gõ tay — gọi lại run_command',
    'với `quyen_cao: true`. Hệ điều hành sẽ tự hỏi họ (UAC / mật khẩu / polkit),',
    'và họ vẫn phải duyệt nguyên văn lệnh trong app trước đó.',
  ].join('\n');
}

# 16.6 — chính sách log thành phép thử chạy trong CI (node --test, Node 22; cwd = _demo/s16/chinh-sach; BASH_ENV=cong-cu/env.bash)
node --test chinh-sach.test.mjs 2>&1 | grep -E '^not ok|^ok|^# (pass|fail)|vi phạm|lọt'
sed -i '/console.log/d' src/dang-nhap.mjs; node --test chinh-sach.test.mjs 2>&1 | grep -E '^# (pass|fail)'
printf '  console.log("DEBUG body", req.body);   // ← ai đó thêm "tạm" lúc gỡ lỗi rồi quên xoá\n' > /tmp/lgz-dong; sed -i '3r /tmp/lgz-dong' src/dang-nhap.mjs; rm /tmp/lgz-dong

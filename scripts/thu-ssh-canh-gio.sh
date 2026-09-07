#!/usr/bin/env bash
# ============================================================
# KIỂM CHÓ GÁC SSH CỦA deploy-nha.sh — chạy: bash scripts/thu-ssh-canh-gio.sh
# ============================================================
#
# `chay_canh_gio` trong `deploy-nha.sh` chạy ssh dưới một chó gác để nó không
# treo vô hạn (07/09/2026: hai lượt deploy treo 2 GIỜ và giữ luôn khoá deploy
# của cả máy, phải giết tay 8 tiến trình).
#
# Bộ kiểm này KHÔNG cần mạng và KHÔNG đụng VPS — nó canh đúng phần dễ sai của
# một hàm bọc: có làm mất stdout, mã thoát, hay stdin không.
#
# Nó đã trả công ngay lần đầu: bản nháp làm **mất sạch stdin**, vì bash chuyển
# stdin của job nền sang /dev/null. Cắm bản đó vào thì bước tráo ảnh
# (`sshvps "bash -s" <<EOF`) sẽ gửi lên một script RỖNG, VPS chạy không, script
# báo THÀNH CÔNG, và không có gì đổi. Đúng loại hỏng im lặng tệ nhất.
#
# ⚠️ Giữ bản sao hàm dưới đây KHỚP với `deploy-nha.sh`. Lệch nhau thì bộ kiểm
# xanh trong khi thứ thật đã hỏng.
set -uo pipefail

SSH_TRAN=${SSH_TRAN:-3}

chay_canh_gio() {
    # `<&0` là BẮT BUỘC: bash chuyển stdin của job nền sang /dev/null, nên
    # `sshvps "bash -s" <<EOF` sẽ gửi lên một stdin RỖNG — bước tráo ảnh chạy
    # một script trống, báo thành công, và không có gì thay đổi trên VPS.
    "$@" <&0 &
    local pid=$!
    (
        local n=0
        while kill -0 "$pid" 2>/dev/null; do
            n=$((n + 1))
            if [ "$n" -ge "$SSH_TRAN" ]; then
                kill -9 "$pid" 2>/dev/null
                exit 0
            fi
            sleep 1
        done
    ) &
    local cho=$!
    wait "$pid"; local ma=$?
    kill "$cho" 2>/dev/null; wait "$cho" 2>/dev/null
    return $ma
}

hong=0; tong=0
canh() { tong=$((tong+1)); if [ "$2" = "$3" ]; then echo "✓ $1"; else echo "✗ $1 — mong '$3', nhận '$2'"; hong=$((hong+1)); fi; }

# 1. Lệnh nhanh: stdout phải NGUYÊN VẸN
ra=$(chay_canh_gio echo "xin chao")
canh "stdout đi qua nguyên vẹn" "$ra" "xin chao"

# 2. Mã thoát 0
chay_canh_gio true; canh "mã thoát 0 giữ nguyên" "$?" "0"

# 3. Mã thoát khác 0 phải GIỮ — deploy dựa vào nó để biết bước nào hỏng
chay_canh_gio bash -c 'exit 7'; canh "mã thoát 7 giữ nguyên" "$?" "7"

# 4. Lệnh TREO phải bị giết trong khoảng trần (đây là cả lý do có hàm này)
bd=$(date +%s)
chay_canh_gio sleep 60
ma=$?
het=$(( $(date +%s) - bd ))
canh "lệnh treo bị giết (mã khác 0)" "$([ $ma -ne 0 ] && echo co || echo khong)" "co"
canh "giết trong vòng ${SSH_TRAN}+3 giây (thực tế ${het}s)" "$([ $het -le $((SSH_TRAN+3)) ] && echo co || echo khong)" "co"

# 5. stdin qua heredoc vẫn tới nơi — deploy dùng `sshvps "bash -s" <<EOF`
ra=$(chay_canh_gio cat <<'EOF'
dong-mot
EOF
)
canh "stdin heredoc đi qua" "$ra" "dong-mot"

# 6b. Heredoc DÀI, nhiều dòng, có escape — đúng hình dạng bước build ở
#     `deploy-nha.sh` (~40 dòng, có `\$`, dấu nháy, và `&`/`wait` bên trong).
mong=$(printf 'a-1\nPID=$!\nwait $PID\nb "trong nhay"\nc-cuoi')
ra=$(chay_canh_gio cat <<EOF
a-1
PID=\$!
wait \$PID
b "trong nhay"
c-cuoi
EOF
)
canh "heredoc dài + escape qua nguyên vẹn" "$ra" "$mong"

# 6. Lệnh nhanh KHÔNG được đợi hết trần rồi mới trả (chó gác phải chết theo)
bd=$(date +%s); chay_canh_gio true; het=$(( $(date +%s) - bd ))
canh "lệnh nhanh trả về ngay (${het}s)" "$([ $het -le 1 ] && echo co || echo khong)" "co"

echo
[ $hong -eq 0 ] && echo "$tong/$tong đạt" || echo "$hong/$tong HỎNG"
exit $hong

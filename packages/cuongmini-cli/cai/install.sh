#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
#  Cài CuongMini CLI — trợ lý lập trình trong terminal của CuongThai.
#
#    curl -fsSL https://cuongthai.com/cli/install.sh | bash
#
#  Git Bash / MSYS2 trên Windows: lệnh trên tự chuyển sang trình cài Windows (install.ps1 qua powershell.exe).
#
#  Chạy lại = cập nhật lên bản mới nhất. Không cần sudo:
#    ~/.cuongmini/app     mã CLI          ~/.cuongmini/node   Node riêng (chỉ khi máy thiếu Node ≥ 20)
#    ~/.local/bin/cuongmini (+ bí danh `cm` nếu tên đó còn trống)
#
#  Biến tuỳ chỉnh (thường không cần):
#    CUONGMINI_BASE_URL       nguồn gói (mặc định https://cuongthai.com/cli)
#    CUONGMINI_HOME           thư mục dữ liệu (mặc định ~/.cuongmini)
#    CUONGMINI_BIN_DIR        nơi đặt lệnh (mặc định ~/.local/bin)
#    CUONGMINI_NODE_MIRROR    nguồn Node (mặc định https://nodejs.org/dist)
#    CUONGMINI_EP_TAI_NODE=1  luôn tải Node riêng, kể cả khi máy đã có
#    CUONGMINI_KHONG_SUA_PATH=1  không đụng ~/.zshrc / ~/.bashrc
# ─────────────────────────────────────────────────────────────────────
# Toàn bộ nằm trong hàm và chỉ gọi ở DÒNG CUỐI: `curl | bash` mà đứt mạng giữa
# chừng thì bash nhận nửa file — không có dòng gọi, không chạy nửa vời gì cả.
set -euo pipefail

cai_cuongmini() {
  local BASE="${CUONGMINI_BASE_URL:-https://cuongthai.com/cli}"
  BASE="${BASE%/}"
  local NHA="${CUONGMINI_HOME:-$HOME/.cuongmini}"
  local BIN="${CUONGMINI_BIN_DIR:-$HOME/.local/bin}"
  local NODE_MIRROR="${CUONGMINI_NODE_MIRROR:-https://nodejs.org/dist}"
  local NODE_DONG="${CUONGMINI_NODE_DONG:-22}"

  local tim='' xanh='' do_='' vang='' mo='' dam='' het=''
  if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
    tim=$'\033[38;5;135m'; xanh=$'\033[38;5;78m'; do_=$'\033[38;5;203m'; vang=$'\033[38;5;214m'
    mo=$'\033[2m'; dam=$'\033[1m'; het=$'\033[0m'
  fi
  buoc() { printf '%s▸%s %s\n' "$tim" "$het" "$*"; }
  ok() { printf '%s✓%s %s\n' "$xanh" "$het" "$*"; }
  canh() { printf '%s⚠%s %s\n' "$vang" "$het" "$*" >&2; }
  hong() { printf '%s✗ %s%s\n' "$do_" "$*" "$het" >&2; exit 1; }

  printf '\n%s%s✻ CuongMini CLI%s %s— trợ lý lập trình trong terminal%s\n\n' "$dam" "$tim" "$het" "$mo" "$het"

  # ── Công cụ cần có ───────────────────────────────────────────────
  local TAI
  if command -v curl >/dev/null 2>&1; then TAI='curl'
  elif command -v wget >/dev/null 2>&1; then TAI='wget'
  else hong 'Cần curl hoặc wget để tải.'; fi
  tai_ve() { # url đích
    if [ "$TAI" = curl ]; then curl -fsSL --retry 2 --connect-timeout 15 -o "$2" "$1"
    else wget -q -O "$2" "$1"; fi
  }
  tai_chu() { # url → stdout
    if [ "$TAI" = curl ]; then curl -fsSL --retry 2 --connect-timeout 15 "$1"
    else wget -q -O - "$1"; fi
  }
  sha256_cua() {
    if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | awk '{print $1}'
    elif command -v shasum >/dev/null 2>&1; then shasum -a 256 "$1" | awk '{print $1}'
    else hong 'Cần sha256sum hoặc shasum để kiểm gói tải về.'; fi
  }
  command -v tar >/dev/null 2>&1 || hong 'Cần tar để giải nén.'

  # ── Hệ điều hành + kiến trúc ─────────────────────────────────────
  local HDH KT
  case "$(uname -s)" in
    Darwin) HDH='darwin' ;;
    Linux) HDH='linux' ;;
    MINGW* | MSYS* | CYGWIN*)
      # Git Bash / MSYS2 / Cygwin trên Windows: cài bằng trình cài Windows (Node .exe, lệnh .cmd + lệnh không đuôi
      # cho bash, PATH người dùng) — cùng một bản cài cho PowerShell, cmd và Git Bash.
      command -v powershell.exe >/dev/null 2>&1 || hong 'Không thấy powershell.exe. Mở PowerShell rồi chạy: irm https://cuongthai.com/cli/install.ps1 | iex'
      buoc 'Git Bash trên Windows — chạy trình cài Windows (install.ps1) qua PowerShell…'
      local NGUON_PS1="${CUONGMINI_PS1_URL:-$BASE/install.ps1}"
      powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm '$NGUON_PS1' | iex" || hong 'Trình cài Windows báo lỗi (xem dòng ✗ ở trên).'
      return 0
      ;;
    *) hong "Chưa hỗ trợ $(uname -s). Trên Windows dùng PowerShell: irm https://cuongthai.com/cli/install.ps1 | iex" ;;
  esac
  case "$(uname -m)" in
    x86_64 | amd64) KT='x64' ;;
    arm64 | aarch64) KT='arm64' ;;
    armv7l) KT='armv7l' ;;
    *) hong "Chưa hỗ trợ kiến trúc $(uname -m)." ;;
  esac

  # TAM để toàn cục: `trap … EXIT` chạy SAU khi hàm đã trả về, lúc biến local không còn (set -u sẽ báo lỗi).
  TAM="$(mktemp -d "${TMPDIR:-/tmp}/cuongmini-cai.XXXXXX")"
  trap 'rm -rf "$TAM"' EXIT
  mkdir -p "$NHA" "$BIN"
  chmod 700 "$NHA" 2>/dev/null || true

  # ── Node ≥ 20 ────────────────────────────────────────────────────
  local NODE=''
  node_du_moi() { # đường-node → 0 nếu bản ≥ 20
    local v
    v="$("$1" -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
    [ "${v:-0}" -ge 20 ] 2>/dev/null
  }
  if [ -z "${CUONGMINI_EP_TAI_NODE:-}" ]; then
    if [ -x "$NHA/node/bin/node" ] && node_du_moi "$NHA/node/bin/node"; then NODE="$NHA/node/bin/node"
    elif command -v node >/dev/null 2>&1 && node_du_moi "$(command -v node)"; then NODE="$(command -v node)"; fi
  fi
  if [ -n "$NODE" ]; then
    ok "Dùng Node $("$NODE" -v) có sẵn ($NODE)"
  else
    if [ "$HDH" = linux ] && { ldd --version 2>&1 | grep -qi musl; }; then
      hong 'Máy dùng musl (Alpine…) — Node chính thức không chạy được. Cài Node ≥ 20 bằng trình quản lý gói (apk add nodejs) rồi chạy lại.'
    fi
    buoc "Máy chưa có Node ≥ 20 — tải Node ${NODE_DONG} LTS chính thức (${HDH}-${KT})…"
    tai_ve "$NODE_MIRROR/latest-v${NODE_DONG}.x/SHASUMS256.txt" "$TAM/SHASUMS256.txt" || hong "Không tải được danh sách Node từ $NODE_MIRROR."
    local DONG_SHA TEN_NODE SHA_NODE
    DONG_SHA="$(grep -E "  node-v${NODE_DONG}\.[0-9]+\.[0-9]+-${HDH}-${KT}\.tar\.gz$" "$TAM/SHASUMS256.txt" | head -n1 || true)"
    [ -n "$DONG_SHA" ] || hong "Không có bản Node ${NODE_DONG} cho ${HDH}-${KT}."
    SHA_NODE="${DONG_SHA%% *}"
    TEN_NODE="${DONG_SHA##* }"
    tai_ve "$NODE_MIRROR/latest-v${NODE_DONG}.x/$TEN_NODE" "$TAM/$TEN_NODE" || hong "Không tải được $TEN_NODE."
    [ "$(sha256_cua "$TAM/$TEN_NODE")" = "$SHA_NODE" ] || hong "SHA-256 của $TEN_NODE KHÔNG khớp — dừng (file tải về có thể bị hỏng hoặc bị tráo)."
    mkdir -p "$TAM/node"
    tar -xzf "$TAM/$TEN_NODE" -C "$TAM/node" --strip-components=1
    rm -rf "$NHA/node.cu" && { [ ! -d "$NHA/node" ] || mv "$NHA/node" "$NHA/node.cu"; }
    mv "$TAM/node" "$NHA/node" && rm -rf "$NHA/node.cu"
    NODE="$NHA/node/bin/node"
    ok "Đã cài Node $("$NODE" -v) vào $NHA/node (đã kiểm SHA-256)"
  fi

  # ── Gói CuongMini ────────────────────────────────────────────────
  buoc 'Đọc thông tin bản mới nhất…'
  tai_ve "$BASE/latest.json?t=$(date +%s)" "$TAM/latest.json" || hong "Không tải được $BASE/latest.json."
  local THONG_TIN PHIEN_BAN SHA_GOI TEN_GOI
  THONG_TIN="$("$NODE" -e '
    const j = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    if (!/^\d+\.\d+\.\d+/.test(j.version) || !/^[0-9a-f]{64}$/.test(j.sha256)) process.exit(3);
    console.log([j.version, j.sha256, j.file || ("cuongmini-" + j.version + ".tgz")].join(" "));
  ' "$TAM/latest.json")" || hong 'latest.json sai dạng.'
  read -r PHIEN_BAN SHA_GOI TEN_GOI <<<"$THONG_TIN"
  case "$TEN_GOI" in */* | *..*) hong 'Tên gói trong latest.json không hợp lệ.' ;; esac

  local BAN_CU=''
  [ -f "$NHA/app/package.json" ] && BAN_CU="$("$NODE" -p 'require(process.argv[1]).version' "$NHA/app/package.json" 2>/dev/null || true)"

  buoc "Tải CuongMini ${PHIEN_BAN}…"
  # `?v=` phá cache CDN/trình duyệt: tên `cuongmini-latest.tgz` giữ nguyên qua các bản, cache cũ ⇒ lệch SHA-256.
  tai_ve "$BASE/$TEN_GOI?v=$PHIEN_BAN" "$TAM/goi.tgz" || hong "Không tải được $BASE/$TEN_GOI."
  [ "$(sha256_cua "$TAM/goi.tgz")" = "$SHA_GOI" ] || hong 'SHA-256 của gói CuongMini KHÔNG khớp latest.json — dừng.'
  mkdir -p "$TAM/app"
  tar -xzf "$TAM/goi.tgz" -C "$TAM/app" --strip-components=1
  [ -f "$TAM/app/dist/cuongmini.mjs" ] || hong 'Gói thiếu dist/cuongmini.mjs.'
  # Tráo thư mục: bản cũ chỉ bị xoá SAU khi bản mới đã vào chỗ.
  rm -rf "$NHA/app.cu"
  [ ! -d "$NHA/app" ] || mv "$NHA/app" "$NHA/app.cu"
  mv "$TAM/app" "$NHA/app"
  rm -rf "$NHA/app.cu"
  ok "Đã đặt CuongMini ${PHIEN_BAN} vào $NHA/app"

  # ── Lệnh `cuongmini` ─────────────────────────────────────────────
  # Lệnh chọn Node lúc CHẠY: Node riêng nếu có, không thì Node của máy — gỡ nvm
  # một phiên bản sau này không làm hỏng lệnh.
  cat >"$BIN/cuongmini" <<LENH
#!/bin/sh
# CuongMini CLI — tạo bởi install.sh. Cập nhật: curl -fsSL https://cuongthai.com/cli/install.sh | bash
NHA="$NHA"
if [ -x "\$NHA/node/bin/node" ]; then NODE="\$NHA/node/bin/node"; else NODE="\$(command -v node)"; fi
[ -n "\$NODE" ] || { echo "CuongMini: không tìm thấy Node — chạy lại lệnh cài." >&2; exit 1; }
exec "\$NODE" "\$NHA/app/dist/cuongmini.mjs" "\$@"
LENH
  chmod 755 "$BIN/cuongmini"

  # Bí danh ngắn `cm` — CHỈ khi chưa có lệnh `cm` nào khác (không giẫm lên công cụ của người dùng).
  local CO_CM='khong'
  if [ -L "$BIN/cm" ] && [ "$(readlink "$BIN/cm")" = "$BIN/cuongmini" ]; then CO_CM='co'
  elif ! command -v cm >/dev/null 2>&1 && [ ! -e "$BIN/cm" ]; then ln -s "$BIN/cuongmini" "$BIN/cm" && CO_CM='co'; fi

  # ── PATH ─────────────────────────────────────────────────────────
  local CAN_MO_LAI='khong'
  case ":$PATH:" in
    *":$BIN:"*) ;;
    *)
      if [ -z "${CUONGMINI_KHONG_SUA_PATH:-}" ]; then
        local BIN_GHI="$BIN"
        [ "$BIN" = "$HOME/.local/bin" ] && BIN_GHI='$HOME/.local/bin'   # ghi dạng $HOME: đổi tên user/máy vẫn đúng
        local DONG_PATH="export PATH=\"$BIN_GHI:\$PATH\""
        local DAU='# CuongMini CLI'
        local tep
        local ds_tep=()
        case "${SHELL:-}" in
          */zsh) ds_tep=("$HOME/.zshrc") ;;
          */bash) if [ "$HDH" = darwin ]; then ds_tep=("$HOME/.bash_profile" "$HOME/.bashrc"); else ds_tep=("$HOME/.bashrc"); fi ;;
          */fish) ds_tep=() ;;
          *) ds_tep=("$HOME/.profile") ;;
        esac
        [ -f "$HOME/.zshrc" ] && case " ${ds_tep[*]-} " in *" $HOME/.zshrc "*) ;; *) ds_tep+=("$HOME/.zshrc") ;; esac
        [ -f "$HOME/.bashrc" ] && case " ${ds_tep[*]-} " in *" $HOME/.bashrc "*) ;; *) ds_tep+=("$HOME/.bashrc") ;; esac
        for tep in "${ds_tep[@]+"${ds_tep[@]}"}"; do
          if ! grep -qs "$DAU" "$tep"; then printf '\n%s\n%s\n' "$DAU" "$DONG_PATH" >>"$tep"; ok "Thêm $BIN vào PATH trong ${tep/#$HOME/~}"; fi
        done
        if [ "${SHELL:-}" != "${SHELL%fish}" ] || [ -d "$HOME/.config/fish" ]; then
          mkdir -p "$HOME/.config/fish/conf.d"
          printf '%s\nfish_add_path %s\n' "$DAU" "$BIN" >"$HOME/.config/fish/conf.d/cuongmini.fish"
        fi
      else
        canh "$BIN chưa có trong PATH — tự thêm: export PATH=\"$BIN:\$PATH\""
      fi
      CAN_MO_LAI='co'
      ;;
  esac

  # ── Xong ─────────────────────────────────────────────────────────
  printf '\n'
  if [ -n "$BAN_CU" ] && [ "$BAN_CU" != "$PHIEN_BAN" ]; then ok "Đã cập nhật CuongMini ${BAN_CU} → ${dam}${PHIEN_BAN}${het}"
  elif [ -n "$BAN_CU" ]; then ok "CuongMini ${dam}${PHIEN_BAN}${het} đã là bản mới nhất (cài lại xong)"
  else ok "Đã cài CuongMini ${dam}${PHIEN_BAN}${het}"; fi
  printf '\n  Bắt đầu:   %scd thư-mục-dự-án && cuongmini%s\n' "$tim" "$het"
  [ "$CO_CM" = co ] && printf '  Gõ tắt:    %scm%s\n' "$tim" "$het"
  printf '  Trợ giúp:  %scuongmini --help%s   ·   trong phiên gõ %s/help%s\n' "$tim" "$het" "$tim" "$het"
  if [ "$CAN_MO_LAI" = co ]; then
    printf '\n  %s⚠ Mở terminal MỚI (hoặc chạy: export PATH="%s:$PATH") để dùng lệnh cuongmini.%s\n' "$vang" "$BIN" "$het"
  fi
  printf '\n'
}

cai_cuongmini "$@"

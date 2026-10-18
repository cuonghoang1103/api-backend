# ─────────────────────────────────────────────────────────────────────
#  Cài CuongMini CLI trên Windows — trợ lý lập trình trong terminal của CuongThai.
#
#    PowerShell:  irm https://cuongthai.com/cli/install.ps1 | iex
#    cmd:         powershell -NoProfile -ExecutionPolicy Bypass -c "irm https://cuongthai.com/cli/install.ps1 | iex"
#
#  Chạy lại = cập nhật. Không cần quyền Admin:
#    %USERPROFILE%\.cuongmini\app      mã CLI
#    %USERPROFILE%\.cuongmini\node     Node riêng (chỉ khi máy thiếu Node >= 20)
#    %LOCALAPPDATA%\CuongMini\bin\cuongmini.cmd (+ cm.cmd nếu tên `cm` còn trống) — thêm vào PATH người dùng
#    %LOCALAPPDATA%\CuongMini\bin\cuongmini (không đuôi) — cho Git Bash / MSYS2, nơi `.cmd` không gọi được bằng tên trần
#
#  Biến tuỳ chỉnh: CUONGMINI_BASE_URL, CUONGMINI_HOME, CUONGMINI_BIN_DIR, CUONGMINI_NODE_MIRROR, CUONGMINI_EP_TAI_NODE=1
#
#  ⚠ File này có chữ tiếng Việt. Web phục vụ nó dạng `text/plain; charset=utf-8` nên `irm | iex` đọc đúng.
#    ĐỪNG chạy nó bằng `powershell -File` khi file KHÔNG có BOM: Windows PowerShell 5.1 đọc file không BOM theo
#    bảng mã ANSI ⇒ byte 0x93/0x94 của "—", "“" thành dấu nháy kép ⇒ vỡ cú pháp (đo thật trên runner 18/10/2026).
# ─────────────────────────────────────────────────────────────────────
# Toàn bộ trong một scriptblock gọi ở dòng cuối: `irm | iex` nhận thiếu file thì không chạy nửa vời.
& {
  $ErrorActionPreference = 'Stop'
  $ProgressPreference = 'SilentlyContinue'   # thanh tiến trình của Invoke-WebRequest làm tải chậm hàng chục lần
  # Đầu ra đi qua ống (app desktop, CI, `| Tee-Object`) ⇒ ghi UTF-8, không thì chữ Việt thành "?" ở bên đọc.
  try { if ([Console]::IsOutputRedirected) { [Console]::OutputEncoding = New-Object Text.UTF8Encoding $false } } catch { }

  function Buoc($t) { Write-Host '▸ ' -ForegroundColor Magenta -NoNewline; Write-Host $t }
  function Ok($t) { Write-Host '✓ ' -ForegroundColor Green -NoNewline; Write-Host $t }
  function Canh($t) { Write-Host "⚠ $t" -ForegroundColor Yellow }
  function Hong($t) { Write-Host "✗ $t" -ForegroundColor Red; throw $t }
  # SHA-256 bằng .NET, KHÔNG dùng Get-FileHash: Windows PowerShell 5.1 được mở từ PowerShell 7 (hoặc từ app có
  # PSModulePath của PS7) không nạp được module chứa nó ⇒ "Get-FileHash is not recognized" (đo thật trên runner).
  function Sha256($p) {
    $f = [IO.File]::OpenRead($p)
    try { $h = [Security.Cryptography.SHA256]::Create(); -join ($h.ComputeHash($f) | ForEach-Object { $_.ToString('x2') }) }
    finally { $f.Dispose() }
  }
  function NodeDuMoi($p) {
    try { $v = & $p -p "process.versions.node.split('.')[0]" 2>$null; return ([int]$v -ge 20) } catch { return $false }
  }

  # Máy bị khoá PowerShell (AppLocker/WDAC ⇒ ConstrainedLanguage): mọi lời gọi .NET bên dưới sẽ hỏng giữa chừng.
  if ($ExecutionContext.SessionState.LanguageMode -ne 'FullLanguage') {
    Hong "PowerShell trên máy này bị khoá ($($ExecutionContext.SessionState.LanguageMode)) nên không cài được. / PowerShell is locked down on this machine. Nhờ IT, hoặc cài trong WSL: curl -fsSL https://cuongthai.com/cli/install.sh | bash"
  }
  # TLS 1.2: Windows PowerShell 5.1 trên .NET cũ mặc định TLS 1.0 ⇒ "Could not create SSL/TLS secure channel".
  try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch { }

  $Base = if ($env:CUONGMINI_BASE_URL) { $env:CUONGMINI_BASE_URL.TrimEnd('/') } else { 'https://cuongthai.com/cli' }
  $Nha = if ($env:CUONGMINI_HOME) { $env:CUONGMINI_HOME } else { Join-Path $env:USERPROFILE '.cuongmini' }
  $Bin = if ($env:CUONGMINI_BIN_DIR) { $env:CUONGMINI_BIN_DIR } else { Join-Path $env:LOCALAPPDATA 'CuongMini\bin' }
  $NodeMirror = if ($env:CUONGMINI_NODE_MIRROR) { $env:CUONGMINI_NODE_MIRROR.TrimEnd('/') } else { 'https://nodejs.org/dist' }
  $NodeDong = 22

  Write-Host ''
  Write-Host '✻ CuongMini CLI' -ForegroundColor Magenta -NoNewline
  Write-Host ' — trợ lý lập trình trong terminal' -ForegroundColor DarkGray
  Write-Host ''

  # tar.exe CỦA WINDOWS (bsdtar, có từ Windows 10 1803) — không lấy GNU tar của Git for Windows nếu nó đứng trước
  # trong PATH: GNU tar hiểu `C:\…` là máy từ xa tên "C" và giải nén hỏng. Không có ⇒ giải nén bằng Node (bên dưới).
  $Tar = Join-Path $env:SystemRoot 'System32\tar.exe'
  if (-not (Test-Path -LiteralPath $Tar)) { $Tar = $null }

  $Tam = Join-Path ([IO.Path]::GetTempPath()) ("cuongmini-cai-" + [Guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Force -Path $Tam, $Nha, $Bin | Out-Null
  try {
    # ── Node >= 20 ─────────────────────────────────────────────────
    $NodeRieng = Join-Path $Nha 'node\node.exe'
    $Node = $null
    if (-not $env:CUONGMINI_EP_TAI_NODE) {
      if ((Test-Path -LiteralPath $NodeRieng) -and (NodeDuMoi $NodeRieng)) { $Node = $NodeRieng }
      else {
        $c = Get-Command node.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($c -and (NodeDuMoi $c.Source)) { $Node = $c.Source }
      }
    }
    if ($Node) {
      Ok "Dùng Node $(& $Node -v) có sẵn ($Node)"
    } else {
      $Kt = switch ($env:PROCESSOR_ARCHITECTURE) { 'AMD64' { 'x64' } 'ARM64' { 'arm64' } 'x86' { 'x86' } default { Hong "Chưa hỗ trợ kiến trúc $($env:PROCESSOR_ARCHITECTURE)." } }
      Buoc "Máy chưa có Node >= 20 — tải Node $NodeDong LTS chính thức (win-$Kt)…"
      $Sums = Join-Path $Tam 'SHASUMS256.txt'
      Invoke-WebRequest -UseBasicParsing -Uri "$NodeMirror/latest-v$NodeDong.x/SHASUMS256.txt" -OutFile $Sums
      $Dong = Get-Content -LiteralPath $Sums | Where-Object { $_ -match "^([0-9a-f]{64})\s+(node-v$NodeDong\.\d+\.\d+-win-$Kt\.zip)$" } | Select-Object -First 1
      if (-not $Dong) { Hong "Không có bản Node $NodeDong cho win-$Kt." }
      $null = $Dong -match "^([0-9a-f]{64})\s+(\S+)$"
      $ShaNode = $Matches[1]; $TenNode = $Matches[2]
      $Zip = Join-Path $Tam $TenNode
      Invoke-WebRequest -UseBasicParsing -Uri "$NodeMirror/latest-v$NodeDong.x/$TenNode" -OutFile $Zip
      if ((Sha256 $Zip) -ne $ShaNode) { Hong "SHA-256 của $TenNode KHÔNG khớp — dừng (file có thể hỏng hoặc bị tráo)." }
      # .NET thay cho Expand-Archive — cùng lý do như Get-FileHash ở trên (module Archive có thể không nạp được).
      Add-Type -AssemblyName System.IO.Compression.FileSystem
      [IO.Compression.ZipFile]::ExtractToDirectory($Zip, (Join-Path $Tam 'node-giai'))
      $Trong = Get-ChildItem -LiteralPath (Join-Path $Tam 'node-giai') -Directory | Select-Object -First 1
      $NodeDir = Join-Path $Nha 'node'
      if (Test-Path -LiteralPath $NodeDir) { Remove-Item -LiteralPath $NodeDir -Recurse -Force }
      Move-Item -LiteralPath $Trong.FullName -Destination $NodeDir
      $Node = $NodeRieng
      Ok "Đã cài Node $(& $Node -v) vào $NodeDir (đã kiểm SHA-256)"
    }

    # ── Gói CuongMini ──────────────────────────────────────────────
    Buoc 'Đọc thông tin bản mới nhất…'
    $Moi = Invoke-RestMethod -UseBasicParsing -Uri "$Base/latest.json?t=$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
    if ($Moi -is [string]) { $Moi = $Moi | ConvertFrom-Json }
    if ($Moi.version -notmatch '^\d+\.\d+\.\d+' -or $Moi.sha256 -notmatch '^[0-9a-f]{64}$') { Hong 'latest.json sai dạng.' }
    $TenGoi = if ($Moi.file) { $Moi.file } else { "cuongmini-$($Moi.version).tgz" }
    if ($TenGoi -match '[\\/]|\.\.') { Hong 'Tên gói trong latest.json không hợp lệ.' }

    $BanCu = $null
    $PkgCu = Join-Path $Nha 'app\package.json'
    if (Test-Path -LiteralPath $PkgCu) { try { $BanCu = (Get-Content -LiteralPath $PkgCu -Raw | ConvertFrom-Json).version } catch { } }

    Buoc "Tải CuongMini $($Moi.version)…"
    $Goi = Join-Path $Tam 'goi.tgz'
    Invoke-WebRequest -UseBasicParsing -Uri "$Base/$($TenGoi)?v=$($Moi.version)" -OutFile $Goi
    if ((Sha256 $Goi) -ne $Moi.sha256) { Hong 'SHA-256 của gói CuongMini KHÔNG khớp latest.json — dừng.' }
    $AppMoi = Join-Path $Tam 'app'
    New-Item -ItemType Directory -Force -Path $AppMoi | Out-Null
    if ($Tar) {
      & $Tar -xzf $Goi -C $AppMoi --strip-components=1
      if ($LASTEXITCODE -ne 0) { Hong 'Giải nén gói hỏng.' }
    } else {
      # Windows cũ không có tar.exe ⇒ giải nén bằng Node (zlib + đọc header ustar; gói chỉ có vài file thường).
      $Js = @'
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const [goi, dich] = process.argv.slice(1);
const b = zlib.gunzipSync(fs.readFileSync(goi));
let o = 0, dai = null;
while (o + 512 <= b.length) {
  const h = b.subarray(o, o + 512);
  if (h.every((x) => x === 0)) break;
  const chu = (a, n) => h.subarray(a, a + n).toString('utf8').replace(/\0.*$/s, '');
  const co = Number.parseInt(chu(124, 12).trim() || '0', 8), loai = chu(156, 1) || '0';
  const tien = chu(345, 155);
  let ten = dai ?? (tien ? `${tien}/${chu(0, 100)}` : chu(0, 100));
  const than = b.subarray(o + 512, o + 512 + co);
  o += 512 + Math.ceil(co / 512) * 512;
  if (loai === 'x') { const m = /\d+ path=([^\n]*)\n/.exec(than.toString('utf8')); dai = m ? m[1] : null; continue; }
  if (loai === 'L') { dai = than.toString('utf8').replace(/\0.*$/s, ''); continue; }
  dai = null;
  if (loai === 'g') continue;
  const phan = ten.split('/').slice(1).filter(Boolean);
  if (!phan.length || phan.includes('..')) continue;
  const dd = path.join(dich, ...phan);
  if (loai === '5') fs.mkdirSync(dd, { recursive: true });
  else if (loai === '0' || loai === '\0') { fs.mkdirSync(path.dirname(dd), { recursive: true }); fs.writeFileSync(dd, than); }
}
'@
      $JsFile = Join-Path $Tam 'giai.cjs'
      [IO.File]::WriteAllText($JsFile, $Js, (New-Object Text.UTF8Encoding $false))
      & $Node $JsFile $Goi $AppMoi
      if ($LASTEXITCODE -ne 0) { Hong 'Giải nén gói hỏng (không có tar.exe, giải bằng Node cũng hỏng).' }
    }
    if (-not (Test-Path -LiteralPath (Join-Path $AppMoi 'dist\cuongmini.mjs'))) { Hong 'Gói thiếu dist\cuongmini.mjs.' }
    # Tráo thư mục: bản cũ chỉ bị xoá SAU khi bản mới đã vào chỗ.
    $App = Join-Path $Nha 'app'
    $AppCu = Join-Path $Nha 'app.cu'
    if (Test-Path -LiteralPath $AppCu) { Remove-Item -LiteralPath $AppCu -Recurse -Force }
    if (Test-Path -LiteralPath $App) { Move-Item -LiteralPath $App -Destination $AppCu }
    Move-Item -LiteralPath $AppMoi -Destination $App
    Remove-Item -LiteralPath $AppCu -Recurse -Force -ErrorAction SilentlyContinue
    Ok "Đã đặt CuongMini $($Moi.version) vào $App"

    # ── Lệnh cuongmini.cmd (PowerShell, cmd, Windows Terminal) ─────
    # Đường mặc định ghi dạng %USERPROFILE% — cmd.exe đọc file .cmd theo bảng mã OEM, tên người dùng có dấu (Cường)
    # ghi thẳng vào file sẽ vỡ. Đường TUỲ CHỈNH có ký tự ngoài ASCII ⇒ đổi tạm bảng mã sang UTF-8 đúng một dòng.
    $NhaTrongCmd = if ($env:CUONGMINI_HOME) { $Nha } else { '%USERPROFILE%\.cuongmini' }
    $DatNha = if ($NhaTrongCmd -match '[^\x00-\x7F]') {
      "for /f `"tokens=2 delims=:.`" %%a in ('chcp') do set /a `"CM_CP=%%a`" >nul 2>&1`r`n" +
      ">nul chcp 65001`r`nset `"NHA=$NhaTrongCmd`"`r`nif defined CM_CP >nul chcp %CM_CP%"
    } else { "set `"NHA=$NhaTrongCmd`"" }
    $Cmd = @"
@echo off
rem CuongMini CLI - created by install.ps1. Update: irm https://cuongthai.com/cli/install.ps1 ^| iex
setlocal
$DatNha
if exist "%NHA%\node\node.exe" (
  "%NHA%\node\node.exe" "%NHA%\app\dist\cuongmini.mjs" %*
) else (
  node "%NHA%\app\dist\cuongmini.mjs" %*
)
exit /b %ERRORLEVEL%
"@
    # KHÔNG ghi UTF-8 có BOM: cmd.exe đọc BOM thành ký tự rác trước `@echo off` và báo lỗi mỗi lần chạy.
    [IO.File]::WriteAllText((Join-Path $Bin 'cuongmini.cmd'), ($Cmd -replace "`r?`n", "`r`n"), (New-Object Text.UTF8Encoding $false))

    # ── Lệnh `cuongmini` không đuôi cho Git Bash / MSYS2 / Cygwin ──
    # bash không gọi được `cuongmini.cmd` bằng tên trần ⇒ "command not found" dù PATH đúng (cách npm cũng làm vậy).
    # mintty (cửa sổ Git Bash mặc định) không phải console Windows ⇒ Node không thấy TTY ⇒ cần `winpty`.
    $NhaSh = ($Nha -replace '\\', '/') -replace "'", "'\''"
    $Sh = @"
#!/bin/sh
# CuongMini CLI cho Git Bash / MSYS2 - tạo bởi install.ps1. Cập nhật: powershell -NoProfile -ExecutionPolicy Bypass -c "irm https://cuongthai.com/cli/install.ps1 | iex"
NHA='$NhaSh'
if [ -x "`$NHA/node/node.exe" ]; then NODE="`$NHA/node/node.exe"; else NODE=node; fi
APP="`$NHA/app/dist/cuongmini.mjs"
TUONG_TAC=1
for a in "`$@"; do case "`$a" in -p|--print|--in|-h|--help|--tro-giup|-v|-V|--version|--phien-ban) TUONG_TAC=0 ;; esac; done
if [ `$# -eq 1 ]; then case "`$1" in logout|dang-xuat|update|cap-nhat|upgrade|doctor|chan-doan) TUONG_TAC=0 ;; esac; fi
if [ "`$TUONG_TAC" = 1 ] && [ -t 0 ] && [ -t 1 ] && ! "`$NODE" -e "process.exit(process.stdin.isTTY&&process.stdout.isTTY?0:1)" 2>/dev/null; then
  if command -v winpty >/dev/null 2>&1; then exec winpty "`$NODE" "`$APP" "`$@"; fi
  echo "CuongMini: cửa sổ Git Bash (mintty) không cho Node thấy terminal và máy không có winpty." >&2
  echo "  Mở Git Bash trong Windows Terminal, hoặc dùng PowerShell / cmd. / Run Git Bash inside Windows Terminal, or use PowerShell." >&2
  exit 2
fi
exec "`$NODE" "`$APP" "`$@"
"@
    [IO.File]::WriteAllText((Join-Path $Bin 'cuongmini'), ($Sh -replace "`r`n", "`n"), (New-Object Text.UTF8Encoding $false))

    $CoCm = $false
    $CmCu = Join-Path $Bin 'cm.cmd'
    if ((Test-Path -LiteralPath $CmCu) -and ((Get-Content -LiteralPath $CmCu -Raw) -match 'cuongmini')) { $CoCm = $true }
    elseif (-not (Get-Command cm -ErrorAction SilentlyContinue)) {
      [IO.File]::WriteAllText($CmCu, "@echo off`r`ncall `"%~dp0cuongmini.cmd`" %*`r`n", [Text.Encoding]::ASCII)
      $CoCm = $true
    }
    if ($CoCm) { [IO.File]::WriteAllText((Join-Path $Bin 'cm'), "#!/bin/sh`nexec `"`$(dirname `"`$0`")/cuongmini`" `"`$@`"`n", [Text.Encoding]::ASCII) }

    # ── PATH người dùng ────────────────────────────────────────────
    # Đọc/ghi THẲNG registry, giữ nguyên %BIẾN% chưa mở rộng và kiểu REG_EXPAND_SZ — `[Environment]::Set…('User')`
    # ghi lại PATH dạng đã mở rộng + REG_SZ, làm hỏng các mục như %USERPROFILE%\AppData\Local\Microsoft\WindowsApps.
    $KhoaEnv = [Microsoft.Win32.Registry]::CurrentUser.CreateSubKey('Environment')
    $PathGoc = [string]$KhoaEnv.GetValue('Path', '', [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
    $CacMuc = @($PathGoc -split ';' | Where-Object { $_ })
    $CoTrongReg = @($CacMuc | Where-Object { [Environment]::ExpandEnvironmentVariables($_).TrimEnd('\') -ieq $Bin.TrimEnd('\') }).Count -gt 0
    $VuaThemPath = $false
    if (-not $CoTrongReg) {
      $MoiPath = (@($CacMuc) + $Bin) -join ';'
      $KhoaEnv.SetValue('Path', $MoiPath, [Microsoft.Win32.RegistryValueKind]::ExpandString)
      # Báo Explorer (và terminal mở từ Explorer/Start sau này) PATH đã đổi: đặt rồi xoá một biến tạm qua .NET —
      # .NET tự phát WM_SETTINGCHANGE "Environment", không cần biên dịch C# (Add-Type) trên máy người dùng.
      try {
        [Environment]::SetEnvironmentVariable('CUONGMINI_PATH_DOI', '1', 'User')
        [Environment]::SetEnvironmentVariable('CUONGMINI_PATH_DOI', $null, 'User')
      } catch { }
      Ok "Thêm $Bin vào PATH người dùng"
      $VuaThemPath = $true
    }
    $KhoaEnv.Close()
    # Cửa sổ ĐANG chạy lệnh cài: thêm luôn để gõ `cuongmini` được ngay (khi lệnh cài chạy trong chính phiên này).
    $CoTrongPhien = @($env:Path -split ';' | Where-Object { $_.TrimEnd('\') -ieq $Bin.TrimEnd('\') }).Count -gt 0
    if (-not $CoTrongPhien) { $env:Path = "$env:Path;$Bin" }

    # Lệnh cài đang chạy ở đâu? `irm | iex` gõ trong PowerShell ⇒ chính phiên đó (PATH vừa thêm ở trên có hiệu lực).
    # `powershell -c "…"` từ cmd / Git Bash / app ⇒ tiến trình con: PATH của cửa sổ cha KHÔNG đổi được từ đây.
    $LaTienTrinhCon = @([Environment]::GetCommandLineArgs() | Select-Object -Skip 1 | Where-Object { $_ -match '^[-/](c|command|f|file|e|ec|encodedcommand)$' }).Count -gt 0
    $Cha = ''
    if ($LaTienTrinhCon) {
      try {
        $IdCha = (Get-CimInstance Win32_Process -Filter "ProcessId=$PID" -ErrorAction Stop).ParentProcessId
        $Cha = (Get-Process -Id $IdCha -ErrorAction Stop).ProcessName.ToLowerInvariant()
      } catch { }
    }

    Write-Host ''
    if ($BanCu -and $BanCu -ne $Moi.version) { Ok "Đã cập nhật CuongMini $BanCu → $($Moi.version)" }
    elseif ($BanCu) { Ok "CuongMini $($Moi.version) đã là bản mới nhất (cài lại xong)" }
    else { Ok "Đã cài CuongMini $($Moi.version)" }
    Write-Host ''
    Write-Host '  Bắt đầu / Start:  ' -NoNewline; Write-Host 'cd thu-muc-du-an; cuongmini' -ForegroundColor Magenta
    if ($CoCm) { Write-Host '  Gõ tắt / Short:   ' -NoNewline; Write-Host 'cm' -ForegroundColor Magenta }
    Write-Host '  Trợ giúp / Help:  ' -NoNewline; Write-Host 'cuongmini --help' -ForegroundColor Magenta
    Write-Host '  Kiểm máy / Check: ' -NoNewline; Write-Host 'cuongmini doctor' -ForegroundColor Magenta

    if (($VuaThemPath -or -not $CoTrongPhien) -and -not $env:CUONGMINI_TU_APP) {
      $LenhDay = Join-Path $Bin 'cuongmini.cmd'
      Write-Host ''
      Canh 'Lệnh cuongmini chỉ có ở cửa sổ terminal mở SAU khi cài. / Only terminals opened AFTER install know `cuongmini`.'
      Write-Host '  • Đóng HẲN Windows Terminal / PowerShell / cmd (mọi cửa sổ, không chỉ tab) rồi mở lại.'
      Write-Host '    Fully close Windows Terminal / PowerShell / cmd (every window, not just the tab), then reopen.'
      if (-not $LaTienTrinhCon) {
        Write-Host '  • Cửa sổ PowerShell NÀY dùng được ngay. / THIS PowerShell window can use it right away.'
      } else {
        Write-Host '  • Hoặc dùng ngay trong cửa sổ này / Or use it right now in this window:'
        if ($Cha -match '^(bash|sh|mintty|zsh)$') {
          $BinSh = '/' + ($Bin.Substring(0, 1).ToLowerInvariant()) + ($Bin.Substring(2) -replace '\\', '/')
          Write-Host "      export PATH=`"`$PATH:$BinSh`"" -ForegroundColor Magenta
        } elseif ($Cha -eq 'cmd') {
          Write-Host "      set `"PATH=%PATH%;$Bin`"" -ForegroundColor Magenta
        } else {
          Write-Host "      `$env:Path += ';$Bin'" -ForegroundColor Magenta
        }
      }
      Write-Host "  • Hoặc gọi bằng đường dẫn đầy đủ / Or call it by full path:  `"$LenhDay`""
    }
    Write-Host ''
  } finally {
    Remove-Item -LiteralPath $Tam -Recurse -Force -ErrorAction SilentlyContinue
  }
}

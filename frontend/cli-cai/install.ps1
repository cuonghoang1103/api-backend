# ─────────────────────────────────────────────────────────────────────
#  Cài CuongMini CLI trên Windows — trợ lý lập trình trong terminal của CuongThai.
#
#    irm https://cuongthai.com/cli/install.ps1 | iex
#
#  Chạy lại = cập nhật. Không cần quyền Admin:
#    %USERPROFILE%\.cuongmini\app      mã CLI
#    %USERPROFILE%\.cuongmini\node     Node riêng (chỉ khi máy thiếu Node >= 20)
#    %LOCALAPPDATA%\CuongMini\bin\cuongmini.cmd (+ cm.cmd nếu tên `cm` còn trống), thêm vào PATH người dùng
#
#  Biến tuỳ chỉnh: CUONGMINI_BASE_URL, CUONGMINI_HOME, CUONGMINI_BIN_DIR, CUONGMINI_NODE_MIRROR, CUONGMINI_EP_TAI_NODE=1
# ─────────────────────────────────────────────────────────────────────
# Toàn bộ trong một scriptblock gọi ở dòng cuối: `irm | iex` nhận thiếu file thì không chạy nửa vời.
& {
  $ErrorActionPreference = 'Stop'
  $ProgressPreference = 'SilentlyContinue'   # thanh tiến trình của Invoke-WebRequest làm tải chậm hàng chục lần
  [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

  $Base = if ($env:CUONGMINI_BASE_URL) { $env:CUONGMINI_BASE_URL.TrimEnd('/') } else { 'https://cuongthai.com/cli' }
  $Nha = if ($env:CUONGMINI_HOME) { $env:CUONGMINI_HOME } else { Join-Path $env:USERPROFILE '.cuongmini' }
  $Bin = if ($env:CUONGMINI_BIN_DIR) { $env:CUONGMINI_BIN_DIR } else { Join-Path $env:LOCALAPPDATA 'CuongMini\bin' }
  $NodeMirror = if ($env:CUONGMINI_NODE_MIRROR) { $env:CUONGMINI_NODE_MIRROR.TrimEnd('/') } else { 'https://nodejs.org/dist' }
  $NodeDong = 22

  function Buoc($t) { Write-Host '▸ ' -ForegroundColor Magenta -NoNewline; Write-Host $t }
  function Ok($t) { Write-Host '✓ ' -ForegroundColor Green -NoNewline; Write-Host $t }
  function Hong($t) { Write-Host "✗ $t" -ForegroundColor Red; throw $t }
  function Sha256($p) { (Get-FileHash -Algorithm SHA256 -LiteralPath $p).Hash.ToLowerInvariant() }
  function NodeDuMoi($p) {
    try { $v = & $p -p "process.versions.node.split('.')[0]" 2>$null; return ([int]$v -ge 20) } catch { return $false }
  }

  Write-Host ''
  Write-Host '✻ CuongMini CLI' -ForegroundColor Magenta -NoNewline
  Write-Host ' — trợ lý lập trình trong terminal' -ForegroundColor DarkGray
  Write-Host ''

  # tar.exe CỦA WINDOWS (bsdtar) — không lấy GNU tar của Git for Windows nếu nó đứng trước trong PATH:
  # GNU tar hiểu `C:\…` là máy từ xa tên "C" và giải nén hỏng.
  $Tar = Join-Path $env:SystemRoot 'System32\tar.exe'
  if (-not (Test-Path $Tar)) { $c = Get-Command tar.exe -ErrorAction SilentlyContinue; $Tar = if ($c) { $c.Source } else { $null } }
  if (-not $Tar) { Hong 'Cần tar.exe (có sẵn từ Windows 10 1803). Cập nhật Windows rồi chạy lại.' }

  $Tam = Join-Path ([IO.Path]::GetTempPath()) ("cuongmini-cai-" + [Guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Force -Path $Tam, $Nha, $Bin | Out-Null
  try {
    # ── Node >= 20 ─────────────────────────────────────────────────
    $NodeRieng = Join-Path $Nha 'node\node.exe'
    $Node = $null
    if (-not $env:CUONGMINI_EP_TAI_NODE) {
      if ((Test-Path $NodeRieng) -and (NodeDuMoi $NodeRieng)) { $Node = $NodeRieng }
      else {
        $c = Get-Command node.exe -ErrorAction SilentlyContinue
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
      $Dong = Get-Content $Sums | Where-Object { $_ -match "^([0-9a-f]{64})\s+(node-v$NodeDong\.\d+\.\d+-win-$Kt\.zip)$" } | Select-Object -First 1
      if (-not $Dong) { Hong "Không có bản Node $NodeDong cho win-$Kt." }
      $null = $Dong -match "^([0-9a-f]{64})\s+(\S+)$"
      $ShaNode = $Matches[1]; $TenNode = $Matches[2]
      $Zip = Join-Path $Tam $TenNode
      Invoke-WebRequest -UseBasicParsing -Uri "$NodeMirror/latest-v$NodeDong.x/$TenNode" -OutFile $Zip
      if ((Sha256 $Zip) -ne $ShaNode) { Hong "SHA-256 của $TenNode KHÔNG khớp — dừng (file có thể hỏng hoặc bị tráo)." }
      Expand-Archive -LiteralPath $Zip -DestinationPath (Join-Path $Tam 'node-giai') -Force
      $Trong = Get-ChildItem (Join-Path $Tam 'node-giai') -Directory | Select-Object -First 1
      $NodeDir = Join-Path $Nha 'node'
      if (Test-Path $NodeDir) { Remove-Item -Recurse -Force $NodeDir }
      Move-Item $Trong.FullName $NodeDir
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
    if (Test-Path $PkgCu) { try { $BanCu = (Get-Content $PkgCu -Raw | ConvertFrom-Json).version } catch { } }

    Buoc "Tải CuongMini $($Moi.version)…"
    $Goi = Join-Path $Tam 'goi.tgz'
    Invoke-WebRequest -UseBasicParsing -Uri "$Base/$($TenGoi)?v=$($Moi.version)" -OutFile $Goi
    if ((Sha256 $Goi) -ne $Moi.sha256) { Hong 'SHA-256 của gói CuongMini KHÔNG khớp latest.json — dừng.' }
    $AppMoi = Join-Path $Tam 'app'
    New-Item -ItemType Directory -Force -Path $AppMoi | Out-Null
    & $Tar -xzf $Goi -C $AppMoi --strip-components=1
    if ($LASTEXITCODE -ne 0) { Hong 'Giải nén gói hỏng.' }
    if (-not (Test-Path (Join-Path $AppMoi 'dist\cuongmini.mjs'))) { Hong 'Gói thiếu dist\cuongmini.mjs.' }
    $App = Join-Path $Nha 'app'
    if (Test-Path $App) { Remove-Item -Recurse -Force $App }
    Move-Item $AppMoi $App
    Ok "Đã đặt CuongMini $($Moi.version) vào $App"

    # ── Lệnh cuongmini.cmd ─────────────────────────────────────────
    # Đường mặc định ghi dạng %USERPROFILE% — tên người dùng có dấu (Cường) sẽ vỡ khi cmd.exe đọc bằng bảng mã OEM.
    $NhaTrongCmd = if ($env:CUONGMINI_HOME) { $Nha } else { '%USERPROFILE%\.cuongmini' }
    $Cmd = @"
@echo off
rem CuongMini CLI - created by install.ps1. Update: irm https://cuongthai.com/cli/install.ps1 ^| iex
setlocal
set "NHA=$NhaTrongCmd"
if exist "%NHA%\node\node.exe" (
  "%NHA%\node\node.exe" "%NHA%\app\dist\cuongmini.mjs" %*
) else (
  node "%NHA%\app\dist\cuongmini.mjs" %*
)
exit /b %ERRORLEVEL%
"@
    # KHÔNG ghi UTF-8 có BOM: cmd.exe đọc BOM thành ký tự rác trước `@echo off` và báo lỗi mỗi lần chạy.
    [IO.File]::WriteAllText((Join-Path $Bin 'cuongmini.cmd'), ($Cmd -replace "`r?`n", "`r`n"), (New-Object Text.UTF8Encoding $false))
    $CoCm = $false
    $CmCu = Join-Path $Bin 'cm.cmd'
    if ((Test-Path $CmCu) -and ((Get-Content $CmCu -Raw) -match 'cuongmini')) { $CoCm = $true }
    elseif (-not (Get-Command cm -ErrorAction SilentlyContinue)) {
      [IO.File]::WriteAllText($CmCu, "@echo off`r`ncall `"%~dp0cuongmini.cmd`" %*`r`n", [Text.Encoding]::ASCII)
      $CoCm = $true
    }

    # ── PATH người dùng ────────────────────────────────────────────
    $PathNguoiDung = [Environment]::GetEnvironmentVariable('Path', 'User')
    $CanMoLai = $false
    if (-not (($PathNguoiDung -split ';') -contains $Bin)) {
      $MoiPath = if ($PathNguoiDung) { "$PathNguoiDung;$Bin" } else { $Bin }
      [Environment]::SetEnvironmentVariable('Path', $MoiPath, 'User')
      $env:Path = "$env:Path;$Bin"
      Ok "Thêm $Bin vào PATH người dùng"
      $CanMoLai = $true
    }

    Write-Host ''
    if ($BanCu -and $BanCu -ne $Moi.version) { Ok "Đã cập nhật CuongMini $BanCu → $($Moi.version)" }
    elseif ($BanCu) { Ok "CuongMini $($Moi.version) đã là bản mới nhất (cài lại xong)" }
    else { Ok "Đã cài CuongMini $($Moi.version)" }
    Write-Host ''
    Write-Host '  Bắt đầu:   ' -NoNewline; Write-Host 'cd thu-muc-du-an; cuongmini' -ForegroundColor Magenta
    if ($CoCm) { Write-Host '  Gõ tắt:    ' -NoNewline; Write-Host 'cm' -ForegroundColor Magenta }
    Write-Host '  Trợ giúp:  ' -NoNewline; Write-Host 'cuongmini --help' -ForegroundColor Magenta
    if ($CanMoLai) { Write-Host ''; Write-Host '  ⚠ Mở cửa sổ terminal MỚI để dùng lệnh cuongmini.' -ForegroundColor Yellow }
    Write-Host ''
  } finally {
    Remove-Item -Recurse -Force $Tam -ErrorAction SilentlyContinue
  }
}

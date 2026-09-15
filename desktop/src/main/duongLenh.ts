/**
 * ============================================================
 * PATH THẬT CỦA NGƯỜI DÙNG — nếu không có, agent bị mù
 * ============================================================
 *
 * Người dùng 15/09/2026: *"Rõ ràng trên máy tôi đã cài rồi mà nhỉ sao con AI
 * code trên app của tôi lại báo … máy không có PostgreSQL và không có Docker.
 * Tôi đã cài để làm project và web của tôi rất nhiều rồi mà."*
 *
 * Họ nói đúng. Máy có đủ. Agent mới là bên không nhìn thấy.
 *
 * ─── Vì sao ───
 * App GUI trên macOS được `launchd` khởi động, KHÔNG phải shell đăng nhập —
 * nên nó không bao giờ đọc `.zshrc`/`.zprofile`. `launchctl getenv PATH` trên
 * máy người dùng trả về RỖNG, nghĩa là app nhận đúng PATH mặc định của hệ
 * điều hành. `run_command` lấy `...process.env`, nên agent thừa hưởng nguyên
 * cái PATH cụt đó.
 *
 * Đo thật trên máy người dùng 15/09/2026 với PATH `/usr/bin:/bin:/usr/sbin:/sbin`:
 *
 *     git      /usr/bin/git        ✔ (macOS có sẵn)
 *     java     /usr/bin/java       ✔
 *     python3  /usr/bin/python3    ✔
 *     node     ❌      npm  ❌      npx  ❌
 *     docker   ❌      psql ❌      brew ❌      pg_ctl ❌
 *
 * Nên agent chạy `which docker` rồi kết luận "máy không có Docker" — một lời
 * SAI mà nó không có cách nào tự biết là sai, và nó đẩy việc ngược về cho
 * người dùng ("bạn cài PostgreSQL rồi báo tôi") đúng lúc thứ đó đã cài sẵn.
 *
 * ⚠️ Chạy từ Terminal thì KHÔNG dính — lúc đó app thừa hưởng PATH của shell.
 * Đó là lý do lỗi này sống lâu: người viết mã luôn chạy `npm run dev` từ
 * terminal, còn người dùng luôn bấm vào biểu tượng trên Dock.
 *
 * ─── Cách sửa ───
 * Hỏi chính shell đăng nhập của người dùng xem PATH của nó là gì, rồi gộp vào
 * `process.env.PATH`. Gộp một lần lúc khởi động là mọi chỗ spawn về sau
 * (`lenh.ts`, `lenhNen.ts`, `terminal.ts`, MCP…) tự đúng theo — chúng đều
 * `...process.env`, nên không có chỗ nào phải nhớ sửa riêng.
 *
 * ⚠️ BA CHỐT để bước này không thành một cái bẫy mới:
 *  1. HẠN GIỜ. `.zshrc` của người dùng có thể gọi `nvm`, `conda`, `rbenv`…
 *     Một cấu hình hỏng là shell treo, và app sẽ không bao giờ mở được. Hết
 *     giờ thì bỏ qua, chạy tiếp bằng PATH cũ.
 *  2. CÓ DẤU MỐC. Shell đăng nhập in cả banner, lời chào, cảnh báo. Đọc bừa
 *     dòng cuối là có ngày nhét cả một câu tiếng Anh vào PATH.
 *  3. GỘP, KHÔNG THAY. Giữ nguyên thứ tự cũ trước rồi thêm phần mới vào sau,
 *     và bỏ trùng — thay hẳn là mất những đường mà chính Electron đã cắm vào.
 */
import { execFile } from 'node:child_process';
import os from 'node:os';

/** Dấu mốc để nhặt đúng dòng PATH giữa đống chữ shell in ra. */
const MOC = '__CT_PATH__';

/** Hết giờ thì bỏ qua. Mở app chậm 3 giây đã là quá nhiều. */
const HAN_MS = 3_000;

/**
 * Những chỗ cài phần mềm phổ biến nhất trên macOS/Linux.
 *
 * Đây là LƯỚI ĐỠ, dùng khi hỏi shell thất bại (shell lạ, cấu hình hỏng, hết
 * giờ). Nó không thay được PATH thật — `nvm` chẳng hạn cắm node vào một thư
 * mục theo phiên bản mà chỉ shell mới biết — nhưng nó vớt lại được Homebrew
 * và Docker, tức đúng hai thứ trong lời than của người dùng.
 */
function duongPhoBien(): string[] {
  const nha = os.homedir();
  return [
    '/opt/homebrew/bin', '/opt/homebrew/sbin',   // Homebrew trên máy Apple Silicon
    '/usr/local/bin', '/usr/local/sbin',         // Homebrew (Intel) + Docker Desktop
    `${nha}/.local/bin`,
    `${nha}/.cargo/bin`,
    '/opt/local/bin',                            // MacPorts
  ];
}

/** Hỏi shell đăng nhập PATH của nó. Trả về `null` nếu không hỏi được. */
function hoiShell(): Promise<string | null> {
  const shell = process.env.SHELL || '/bin/zsh';
  return new Promise((giai) => {
    /*
     * `-ilc`: interactive + login + chạy một lệnh. Phải có CẢ HAI cờ i và l —
     * zsh đọc `.zprofile` ở phiên login còn `.zshrc` ở phiên interactive, và
     * Homebrew/nvm có thể nằm ở bất kỳ file nào trong hai.
     *
     * `execFile` chứ không `exec`: không đi qua một shell trung gian nữa, nên
     * không có chỗ nào phải thoát dấu.
     */
    const con = execFile(
      shell, ['-ilc', `printf '%s%s' ${JSON.stringify(MOC)} "$PATH"`],
      { timeout: HAN_MS, maxBuffer: 1024 * 1024, windowsHide: true },
      (loi, ra) => {
        if (loi && !ra) { giai(null); return; }
        const i = String(ra ?? '').lastIndexOf(MOC);
        if (i < 0) { giai(null); return; }
        const p = String(ra).slice(i + MOC.length).split('\n')[0]?.trim();
        giai(p && p.includes('/') ? p : null);
      },
    );
    /* Đừng để tiến trình con giữ app sống. Một `.zshrc` gọi thứ gì đó chạy nền
       là app không thoát nổi lúc người dùng bấm Thoát. */
    con.unref?.();
  });
}

/** Gộp hai PATH, giữ thứ tự của cái trước, bỏ trùng và bỏ mục rỗng. */
export function gopPath(cu: string, moi: string[]): string {
  const ra: string[] = [];
  const da = new Set<string>();
  for (const d of [...cu.split(':'), ...moi]) {
    const s = d.trim();
    if (!s || da.has(s)) continue;
    da.add(s);
    ra.push(s);
  }
  return ra.join(':');
}

let daNap = false;

/**
 * Nạp PATH thật vào `process.env.PATH`. Gọi MỘT LẦN lúc khởi động, trước khi
 * có lệnh nào của agent chạy.
 *
 * Trả về danh sách đường vừa thêm, để ghi log — người đọc log cần thấy app đã
 * tự vá được gì, chứ không chỉ thấy "xong".
 */
export async function napPathThat(): Promise<string[]> {
  if (daNap) return [];
  daNap = true;
  // Windows: app GUI vẫn nhận PATH hệ thống đầy đủ, không có gì để vá.
  if (process.platform === 'win32') return [];

  const truoc = process.env.PATH ?? '';
  const tuShell = await hoiShell();
  const them = tuShell ? tuShell.split(':') : duongPhoBien();
  const sau = gopPath(truoc, them);
  process.env.PATH = sau;

  const cu = new Set(truoc.split(':'));
  return sau.split(':').filter((d) => !cu.has(d));
}

/**
 * Case-study 3.4 — Code Collaboration Platform (VS Code-like).
 *
 * The editor is easy and the CRDT work was already covered by the Figma
 * study. What makes this a distinct project is one sentence: you are running
 * strangers' code on your hardware. Layered sandboxing, the fork bomb, the
 * cloud metadata endpoint, and warm pools all follow from it.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./code-collaboration-platform.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./code-collaboration-platform.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'code-collaboration-platform',
  title: 'Code Collaboration Platform (VS Code-like)',
  titleEn: 'Code Collaboration Platform (VS Code-like)',
  description:
    'Môi trường lập trình chạy trên trình duyệt, mỗi người một không gian cách ly. Trình soạn thảo là phần dễ và CRDT thì đã học ở bài Figma; cái làm dự án này khác hẳn gói trong một câu: bạn đang chạy mã của người lạ trên phần cứng của mình.',
  descriptionEn:
    'A browser-based development environment with an isolated workspace per user. The editor is the easy part and the CRDT work came from the Figma study; what makes this project different fits in one sentence: you are running strangers\' code on your hardware.',
  techStack: [
    'TypeScript', 'Node.js', 'Docker', 'gVisor', 'Firecracker', 'seccomp',
    'cgroups', 'node-pty', 'xterm.js', 'Language Server Protocol', 'Yjs', 'Kubernetes',
  ],
  role: 'Full-stack / hạ tầng (một người)',
  roleEn: 'Full-stack / infrastructure (solo)',
  duration: '8–10 tuần',
  durationEn: '8–10 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'ADVANCED',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `# CONTAINER KHÔNG PHẢI RANH GIỚI AN NINH. Container chia sẻ nhân hệ điều
# hành với máy chủ, nên một lỗ hổng leo thang đặc quyền trong nhân là một
# lối thoát. Docker là công cụ ĐÓNG GÓI tốt và ranh giới an ninh YẾU —
# nó ngăn tai nạn, không ngăn tấn công có chủ đích.

# ── Lớp 3: tài nguyên ────────────────────────────────────────────────
# pids_limit là BẮT BUỘC, không phải tuỳ chọn. Bom fork chỉ cần 13 ký tự:
#     :(){ :|:& };:
# Nó tạo tiến trình gọi chính nó hai lần, mỗi con lại làm vậy. Vài giây sau
# bảng tiến trình của MÁY CHỦ đầy và mọi không gian của mọi người đóng băng.
# Giới hạn BỘ NHỚ không chặn được vì mỗi tiến trình rất nhỏ.
pids_limit: 256
mem_limit: 2g
cpu_quota: 100000          # 1 lõi
storage_quota: 10g         # không có hạn ngạch thì một người làm đầy đĩa cả cụm

# ── Lớp 4: mạng ──────────────────────────────────────────────────────
# 169.254.169.254 là điểm truy cập SIÊU DỮ LIỆU của hầu hết nhà cung cấp
# đám mây, và nó thường trả về THÔNG TIN XÁC THỰC TẠM THỜI của máy.
# MỘT lệnh curl tới đó từ container người dùng có thể lấy quyền truy cập
# vào toàn bộ hạ tầng của bạn. Chặn ở tầng MẠNG, không phải tầng ứng dụng.
network_deny:
  - 169.254.0.0/16         # siêu dữ liệu đám mây — chặn TUYỆT ĐỐI
  - 10.0.0.0/8             # mạng nội bộ
  - 172.16.0.0/12
  - 192.168.0.0/16
network_allow_via_proxy:   # danh sách trắng, đi qua proxy
  - registry.npmjs.org
  - pypi.org
  - github.com

# ── Lớp 1 + 2: cách ly tiến trình và nhân ────────────────────────────
security:
  user: nobody
  cap_drop: [ALL]
  read_only_root: true     # trừ /workspace
  seccomp: strict          # chặn lời gọi hệ thống không cần dùng
  runtime: runsc           # gVisor — nhân người dùng chắn giữa mã và nhân thật
                           # hoặc Firecracker: máy ảo siêu nhẹ, khởi động ~125ms

# KHÔNG lớp nào đủ MỘT MÌNH. Bỏ bất kỳ lớp nào cũng có đường đi vòng đã biết.

# ── Biến môi trường ──────────────────────────────────────────────────
# Container người dùng KHÔNG ĐƯỢC thấy khoá API, chuỗi kết nối database,
# hay bất kỳ thông tin xác thực nào của hạ tầng. Dựng env trắng, không lọc
# env sẵn có — lọc thì sẽ quên một biến.
env_allowlist: [HOME, PATH, TERM, LANG, USER]`,

  schemaCodeEn: `# A CONTAINER IS NOT A SECURITY BOUNDARY. Containers share the host kernel,
# so a privilege-escalation bug in the kernel is an escape. Docker is an
# excellent PACKAGING tool and a WEAK security boundary — it prevents
# accidents, not deliberate attacks.

# ── Layer 3: resources ───────────────────────────────────────────────
# pids_limit is MANDATORY, not optional. A fork bomb is 13 characters:
#     :(){ :|:& };:
# It creates a process that calls itself twice, each child doing the same.
# Seconds later the HOST process table is full and every user's workspace
# freezes. MEMORY limits do not stop it, because each process is tiny.
pids_limit: 256
mem_limit: 2g
cpu_quota: 100000          # one core
storage_quota: 10g         # without a quota one user fills the cluster disk

# ── Layer 4: network ─────────────────────────────────────────────────
# 169.254.169.254 is the INSTANCE METADATA endpoint on most cloud
# providers, and it commonly returns the machine's TEMPORARY CREDENTIALS.
# ONE curl to it from a user container can hand over access to your whole
# infrastructure. Block at the NETWORK layer, not in application code.
network_deny:
  - 169.254.0.0/16         # cloud metadata — block ABSOLUTELY
  - 10.0.0.0/8             # internal networks
  - 172.16.0.0/12
  - 192.168.0.0/16
network_allow_via_proxy:   # allowlist, routed through a proxy
  - registry.npmjs.org
  - pypi.org
  - github.com

# ── Layers 1 + 2: process and kernel isolation ───────────────────────
security:
  user: nobody
  cap_drop: [ALL]
  read_only_root: true     # except /workspace
  seccomp: strict          # block system calls that are not needed
  runtime: runsc           # gVisor — a userspace kernel between code and the
                           # real one; or Firecracker microVMs, ~125ms boot

# NO layer suffices ALONE. Remove any one and there is a known way around it.

# ── Environment variables ────────────────────────────────────────────
# The user container must NOT see API keys, database connection strings, or
# any infrastructure credentials. Build a clean env from an allowlist rather
# than filtering an existing one — filtering means eventually missing a var.
env_allowlist: [HOME, PATH, TERM, LANG, USER]`,
  schemaLang: 'yaml',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Chấp nhận rằng container không phải ranh giới an ninh',
      titleEn: 'Accept that a container is not a security boundary',
      description:
        'Container chia sẻ nhân với máy chủ nên lỗ hổng leo thang đặc quyền trong nhân là lối thoát. Cần bốn lớp: cách ly tiến trình (bỏ capability, seccomp), ranh giới nhân thật (gVisor hoặc máy ảo siêu nhẹ), giới hạn tài nguyên (cgroups, ulimit, hạn ngạch đĩa), và cách ly mạng. Không lớp nào đủ một mình — bỏ bất kỳ lớp nào cũng có đường đi vòng đã biết.',
      descriptionEn:
        'Containers share the kernel, so a privilege-escalation bug there is an escape. You need four layers: process isolation (dropped capabilities, seccomp), a real kernel boundary (gVisor or microVMs), resource limits (cgroups, ulimit, disk quotas), and network isolation. No layer suffices alone — remove any one and there is a known way around it.',
    },
    {
      phase: 'BACKEND',
      title: 'Chặn dải nội bộ ở tầng mạng, đặc biệt là siêu dữ liệu đám mây',
      titleEn: 'Block internal ranges at the network layer, especially cloud metadata',
      description:
        '169.254.169.254 là điểm truy cập siêu dữ liệu của hầu hết nhà cung cấp đám mây và thường trả về thông tin xác thực tạm thời của máy. MỘT lệnh curl từ container người dùng có thể lấy quyền truy cập vào hạ tầng của bạn. Nhiều sự cố thật đã xảy ra đúng như vậy và nó không đòi hỏi kỹ thuật gì cao siêu. Chặn ở tầng mạng, không phải bằng mã ứng dụng.',
      descriptionEn:
        '169.254.169.254 is the instance metadata endpoint on most cloud providers and commonly returns the machine\'s temporary credentials. ONE curl from a user container can hand over your infrastructure. Several real incidents happened exactly this way and none required sophistication. Block at the network layer, never in application code.',
    },
    {
      phase: 'BACKEND',
      title: 'Giới hạn số tiến trình — và tự chạy bom fork để kiểm',
      titleEn: 'Limit process count — and run a fork bomb yourself to check',
      description:
        'Bom fork chỉ cần 13 ký tự và giới hạn bộ nhớ KHÔNG chặn được vì mỗi tiến trình rất nhỏ. Cái chặn được là pids_limit. Hãy tự chạy đoạn đó trong hệ thống của mình TRƯỚC khi cho người dùng vào — nếu máy chủ chết thì bạn vừa học được điều cần học trong điều kiện an toàn.',
      descriptionEn:
        'A fork bomb is 13 characters and memory limits do NOT stop it, because each process is tiny. What stops it is pids_limit. Run it inside your own system BEFORE letting users in — if the host dies, you have learned the necessary lesson under safe conditions.',
      codeBlock:
        '# 13 ký tự. Tự chạy trước khi người dùng chạy hộ bạn.\n'
        + ':(){ :|:& };:\n'
        + '\n'
        + '# Chặn bằng giới hạn SỐ TIẾN TRÌNH, không phải giới hạn bộ nhớ:\n'
        + 'pids_limit: 256',
      codeLang: 'bash',
    },
    {
      phase: 'BACKEND',
      title: 'Tách tính toán khỏi lưu trữ để đóng băng được',
      titleEn: 'Separate compute from storage so hibernation is possible',
      description:
        'Mở không gian mất 45 giây thì người dùng không quay lại lần hai — cần hồ chứa container ấm dựng sẵn để xuống còn ~2 giây. Nhưng điều khiến việc thu hồi tài nguyên khả thi là dữ liệu người dùng phải SỐNG LÂU HƠN container: mã nguồn nằm trong lớp ghi của container thì "đóng băng" nghĩa là mất dữ liệu, và chi phí tăng theo số người ĐĂNG KÝ chứ không theo số người ĐANG DÙNG.',
      descriptionEn:
        'A 45-second workspace open means users do not return, so a warm container pool brings it to ~2 seconds. But what makes reclaiming resources possible is user data OUTLIVING the container: with code in the container write layer, "hibernate" means data loss, and cost scales with SIGNUPS rather than ACTIVE USERS.',
    },
    {
      phase: 'BACKEND',
      title: 'Giao thức máy chủ ngôn ngữ: N+M thay vì N×M',
      titleEn: 'Language Server Protocol: N+M instead of N×M',
      description:
        'Tự cài đặt gợi ý mã cho mỗi ngôn ngữ là chuyện của nhiều năm. Đặt một giao thức chuẩn ở giữa biến N trình soạn thảo × M ngôn ngữ thành N+M — một bài học thiết kế đáng nhớ hơn cả phần kỹ thuật. Hai chi tiết quyết định: máy chủ ngôn ngữ phải chạy TRONG container người dùng (nó cần đọc mã và phụ thuộc của dự án đó), và nó rất ngốn RAM nên phải tính vào hạn mức và khởi động theo yêu cầu.',
      descriptionEn:
        'Implementing completions per language is years of work. A standard protocol in the middle turns N editors × M languages into N+M — a design lesson more memorable than the engineering. Two decisive details: language servers must run INSIDE the user container (they need that project\'s source and dependencies), and they are memory-hungry, so count them against the limit and start them on demand.',
    },
    {
      phase: 'BACKEND',
      title: 'Thiết bị đầu cuối giả, không phải ô nhập lệnh',
      titleEn: 'A pseudo-terminal, not a command input box',
      description:
        'Gửi chuỗi lệnh rồi trả về chuỗi kết quả gãy ngay khi gặp vim, top, git rebase -i — những chương trình đó cần một PTY thật. Ba chi tiết dễ bỏ: đổi kích thước phải truyền xuống (không thì mọi giao diện dòng lệnh vẽ sai khung), giới hạn tốc độ đầu ra (cat file 1GB làm treo trình duyệt), và xoá sạch biến môi trường nhạy cảm.',
      descriptionEn:
        'Sending a command string and returning an output string breaks the moment someone runs vim, top or git rebase -i — those need a real PTY. Three easily missed details: forward resize events (or every terminal UI renders at the wrong size), rate-limit output (cat on a 1GB file freezes the browser), and strip sensitive environment variables entirely.',
      codeBlock:
        "const pty = spawn('/bin/bash', [], {\n"
        + "  name: 'xterm-256color', cols: 80, rows: 24,\n"
        + "  cwd: '/workspace',\n"
        + "  env: { ...safeEnv, TERM: 'xterm-256color' },   // env TRẮNG, không lọc\n"
        + '});\n'
        + 'pty.onData(data => ws.send(data));\n'
        + "ws.on('message', data => pty.write(data));\n"
        + "ws.on('resize', ({ cols, rows }) => pty.resize(cols, rows));",
      codeLang: 'javascript',
    },
    {
      phase: 'FRONTEND',
      title: 'Cộng tác: nguồn sự thật là FILE TRÊN ĐĨA, không phải tài liệu CRDT',
      titleEn: 'Collaboration: the source of truth is the FILE ON DISK, not the CRDT',
      description:
        'Khác biệt cốt lõi so với bài Figma: ở bảng vẽ, tài liệu CRDT chính là nguồn sự thật; ở đây trình biên dịch đọc FILE, nên có hai bên cùng quyền sửa — người gõ trong trình soạn thảo, và git checkout hay npm install trong cửa sổ dòng lệnh. File đang mở thì CRDT giữ trạng thái sống rồi ghi xuống đĩa; file bị sửa từ ngoài thì nạp lại; xung đột hai chiều thì HỎI người dùng chứ đừng tự chọn.',
      descriptionEn:
        'The core difference from the Figma study: on a canvas the CRDT document IS the truth; here compilers read FILES, so two parties have write access — the person typing, and git checkout or npm install in the terminal. Open files keep live CRDT state flushed to disk; externally changed files reload; and when the two directions conflict, ASK the user rather than choosing.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách tự tấn công hệ thống của mình',
      titleEn: 'Verify by attacking your own system',
      description:
        'Chạy bom fork trong một không gian — chỉ không gian đó chết. curl tới 169.254.169.254 — bị chặn. dd cho tới hết hạn ngạch — chỉ ổ đó đầy. env trong cửa sổ dòng lệnh — không thấy khoá nào của hạ tầng. Chạy máy chủ web — cổng không truy cập được từ ngoài cho tới khi chủ động mở. Mỗi phép kiểm này ứng với một sự cố thật đã xảy ra ở đâu đó.',
      descriptionEn:
        'Run a fork bomb in one workspace — only that workspace dies. curl 169.254.169.254 — blocked. dd until the quota fills — only that volume fills. env in the terminal — no infrastructure keys visible. Run a web server — the port is unreachable externally until deliberately opened. Each of these corresponds to a real incident somewhere.',
    },
  ],

  features: [
    { title: 'Không gian làm việc cách ly nhiều lớp', titleEn: 'Multi-layer isolated workspaces', description: 'seccomp, bỏ capability, gVisor hoặc máy ảo siêu nhẹ, cách ly mạng.', descriptionEn: 'seccomp, dropped capabilities, gVisor or microVMs, network isolation.', status: 'PLANNED' },
    { title: 'Hồ chứa container ấm', titleEn: 'A warm container pool', description: 'Mở không gian trong ~2 giây thay vì 45, tự bù thêm khi hồ vơi.', descriptionEn: 'Workspaces open in ~2 seconds instead of 45, topped up in the background.', status: 'PLANNED' },
    { title: 'Đóng băng và đánh thức', titleEn: 'Hibernate and wake', description: 'Thu hồi tài nguyên tính toán, ổ đĩa sống lâu hơn container.', descriptionEn: 'Compute reclaimed while the volume outlives the container.', status: 'PLANNED' },
    { title: 'Trí tuệ mã nguồn qua giao thức chuẩn', titleEn: 'Code intelligence over a standard protocol', description: 'Gợi ý, nhảy tới định nghĩa, đổi tên toàn dự án — máy chủ chạy trong container người dùng.', descriptionEn: 'Completions, go-to-definition, project rename — servers running inside the user container.', status: 'PLANNED' },
    { title: 'Cửa sổ dòng lệnh thật', titleEn: 'A real terminal', description: 'PTY đầy đủ nên vim và htop chạy đúng, có truyền sự kiện đổi kích thước.', descriptionEn: 'A full PTY so vim and htop behave, with resize events forwarded.', status: 'PLANNED' },
    { title: 'Cộng tác nhiều người trên file', titleEn: 'Multi-user file collaboration', description: 'CRDT cho file đang mở, đồng bộ hai chiều với đĩa, xung đột thì hỏi.', descriptionEn: 'CRDTs for open files, two-way disk sync, and a prompt on conflict.', status: 'PLANNED' },
    { title: 'Chuyển tiếp cổng, mặc định kín', titleEn: 'Port forwarding, closed by default', description: 'Công khai phải là hành động chủ ý, không phải mặc định.', descriptionEn: 'Making a port public must be a deliberate act, never the default.', status: 'PLANNED' },
    { title: 'Hạn ngạch tài nguyên cho mỗi không gian', titleEn: 'Per-workspace resource quotas', description: 'CPU, RAM, số tiến trình, dung lượng đĩa — tất cả đều có trần cứng.', descriptionEn: 'CPU, memory, process count and disk all carry hard ceilings.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'gVisor', titleEn: 'gVisor', url: 'https://gvisor.dev/docs/', type: 'LINK', description: 'Nhân người dùng chắn giữa mã không tin cậy và nhân thật — lớp mà container thường thiếu.', descriptionEn: 'A userspace kernel between untrusted code and the real one — the layer containers usually lack.' },
    { title: 'Firecracker', titleEn: 'Firecracker', url: 'https://firecracker-microvm.github.io/', type: 'LINK', description: 'Máy ảo siêu nhẹ khởi động ~125ms: cách ly mức máy ảo với tốc độ gần container.', descriptionEn: 'MicroVMs booting in ~125ms: VM-level isolation at close to container speed.' },
    { title: 'Language Server Protocol Specification', titleEn: 'Language Server Protocol Specification', url: 'https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/', type: 'LINK', description: 'Giao thức biến N×M bộ tích hợp thành N+M — bài học thiết kế đáng nhớ hơn cả phần kỹ thuật.', descriptionEn: 'The protocol turning N×M integrations into N+M — a design lesson beyond the engineering.' },
    { title: 'AWS — Instance metadata and IMDSv2', titleEn: 'AWS — Instance metadata and IMDSv2', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html', type: 'LINK', description: 'Vì sao 169.254.169.254 nguy hiểm và nhà cung cấp đã làm gì để giảm rủi ro.', descriptionEn: 'Why 169.254.169.254 is dangerous and what providers did to reduce the risk.' },
    { title: 'node-pty', titleEn: 'node-pty', url: 'https://github.com/microsoft/node-pty', type: 'REPO', description: 'Cấp thiết bị đầu cuối giả từ Node — nền của cửa sổ dòng lệnh chạy được vim.', descriptionEn: 'Allocating pseudo-terminals from Node — the basis of a terminal that can run vim.' },
  ],

  coreKnowledge: [
    { vi: 'Cách ly mã không tin cậy: các lớp phòng thủ và giới hạn của từng lớp', en: 'Sandboxing untrusted code: the defence layers and the limits of each' },
    { vi: 'Vì sao container là ranh giới an ninh yếu, và cái gì mạnh hơn', en: 'Why containers are a weak security boundary, and what is stronger' },
    { vi: 'Giới hạn tài nguyên ở mức nhân: cgroups, ulimit, hạn ngạch', en: 'Kernel-level resource limits: cgroups, ulimit and quotas' },
    { vi: 'Cách ly mạng và các điểm truy cập siêu dữ liệu của đám mây', en: 'Network isolation and cloud metadata endpoints' },
    { vi: 'Tách tính toán khỏi lưu trữ để thu hồi tài nguyên được', en: 'Separating compute from storage so resources can be reclaimed' },
    { vi: 'Thiết kế giao thức: biến bài toán N×M thành N+M', en: 'Protocol design: turning an N×M problem into N+M' },
    { vi: 'Thiết bị đầu cuối giả và luồng byte hai chiều', en: 'Pseudo-terminals and bidirectional byte streams' },
    { vi: 'Đồng bộ hai chiều giữa trạng thái trong bộ nhớ và hệ thống file', en: 'Two-way synchronisation between in-memory state and a filesystem' },
  ],

  portfolioBonus: [
    { vi: 'Video chạy bom fork và chứng minh chỉ một không gian bị ảnh hưởng', en: 'A video running a fork bomb showing only one workspace is affected' },
    { vi: 'Mục README về mô hình đe doạ: liệt kê từng cách tấn công và lớp nào chặn', en: 'A README threat model listing each attack and which layer stops it' },
    { vi: 'Số đo thời gian mở không gian trước và sau khi có hồ chứa ấm', en: 'Workspace open times before and after introducing the warm pool' },
    { vi: 'Biểu đồ chi phí theo số người đang dùng, không theo số người đăng ký', en: 'A cost chart tracking active users rather than signups' },
    { vi: 'Bản ghi thử thoát container: các cách đã thử và kết quả từng cách', en: 'A container-escape test log: each technique attempted and its outcome' },
  ],

  completionOutcomes: [
    { vi: 'Chạy được mã không tin cậy mà không đặt hạ tầng vào rủi ro', en: 'Run untrusted code without putting your infrastructure at risk' },
    { vi: 'Hiểu ranh giới an ninh thật sự nằm ở đâu trong ngăn xếp ảo hoá', en: 'Understand where real security boundaries sit in the virtualisation stack' },
    { vi: 'Thiết kế hệ thống mà chi phí bám theo mức sử dụng thật', en: 'Design systems whose cost tracks actual usage' },
    { vi: 'Nhận ra khi một giao thức chuẩn xoá bỏ cả một lớp công việc', en: 'Recognise when a standard protocol eliminates an entire class of work' },
    { vi: 'Tự tấn công hệ thống của mình như một phần của quy trình kiểm thử', en: 'Attack your own system as a routine part of testing' },
  ],

  bodyMdx,
  bodyMdxEn,
};

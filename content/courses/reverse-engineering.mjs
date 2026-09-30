/**
 * Reverse Engineering & phân tích mã độc nhập môn — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo kế hoạch
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm B). Soạn chi tiết SAU theo content/courses/docker/_HOP-DONG.md. Xem _chung/khung.mjs.
 * AN TOÀN & PHÁP LÝ: mọi bài thực hành chỉ trên crackme/CTF hợp pháp, phần mềm của chính mình, hoặc mẫu mã độc từ kho nghiên cứu
 * trong VM cô lập (không mạng, snapshot) — không bao giờ chạy mẫu trên máy thật; không dạy bẻ khoá phần mềm thương mại.
 * Pháp lý ghi trung tính (Luật An ninh mạng 2018, BLHS điều 285–289, Luật SHTT về phần mềm) — người soạn chi tiết kiểm văn bản.
 * Ảnh bìa: người điều phối dựng (logo simple-icons ghidra).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'security', name: 'Bảo mật', icon: 'Shield', sortOrder: 8 },
  course: {
    slug: 'reverse-engineering',
    title: 'Reverse Engineering & Malware Analysis',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/reverse-engineering.png?v=1',
    shortDescription: 'Reading programs without source: x86-64/ARM assembly, ELF and PE, Ghidra and gdb, crackmes, safe malware analysis in isolated VMs, YARA and Android — legal and safe.|||Đọc chương trình không có mã nguồn: assembly x86-64/ARM, ELF và PE, Ghidra và gdb, crackme, phân tích mã độc an toàn trong VM cô lập, YARA và Android — hợp pháp, an toàn.',
    description: 'Khoá nâng cao cho người đã viết được C/Java và dùng Linux thành thạo. Bắt đầu từ những lần đảo ngược đã thay đổi lịch sử (phân tích Stuxnet 2010, kill switch của WannaCry 2017, NSA công bố Ghidra 2019) và phần pháp lý: được làm gì, trên phần mềm nào, trong lab nào. Học: từ mã C tới mã máy (biên dịch, liên kết, calling convention), đủ assembly x86-64 và ARM64 để đọc, định dạng ELF và PE, công cụ phân tích tĩnh (Ghidra, IDA Free, radare2/Cutter, Binary Ninja nhắc tới), gỡ lỗi động (gdb + pwndbg/GEF, x64dbg), strace/ltrace, Frida; nhận diện cấu trúc điều khiển, struct, hàm thư viện; chống gỡ lỗi và làm rối mã; crackme và CTF hợp pháp; phân tích mã độc an toàn (dựng VM cô lập, INetSim/FakeNet, phân tích tĩnh-động, trích IOC, viết YARA); đảo ngược ứng dụng Android (APK, jadx, apktool, Frida) và bytecode Java/.NET — áp để hiểu cách bảo vệ chính ứng dụng LabFlow/app desktop Electron của mình. Dự án cuối khoá: phân tích trọn một mẫu từ kho nghiên cứu trong lab cô lập và viết báo cáo + quy tắc YARA.',
    whatYouLearn: 'Đọc được assembly x86-64/ARM64 do trình biên dịch sinh ra và dựng lại logic C; phân tích file ELF/PE bằng Ghidra và radare2; gỡ lỗi chương trình không có mã nguồn bằng gdb; dùng strace/ltrace/Frida để quan sát hành vi; giải crackme và bài RE trong CTF; dựng lab phân tích mã độc cô lập an toàn; phân tích tĩnh-động một mẫu, trích IOC và viết YARA; đảo ngược APK Android và file JAR để kiểm bảo mật app của chính mình; hiểu giới hạn pháp lý của đảo ngược mã.',
    requirements: 'Lập trình C cơ bản (con trỏ, struct, bộ nhớ), một ngôn ngữ bậc cao (Java/JS), Linux dòng lệnh thành thạo, máy tính đủ chạy 2 máy ảo (khuyến nghị 16GB RAM). Nên học trước: Linux & Bash, Hệ điều hành cho lập trình viên (nếu có), Bảo mật web.',
    documentsNote: 'Tài liệu chính: ghidra-sre.org • hex-rays.com/ida-free • book.rada.re • sourceware.org/gdb/documentation • Intel® 64 and IA-32 Architectures Software Developer’s Manuals • developer.arm.com (A64 ISA) • refspecs.linuxfoundation.org (ELF) • learn.microsoft.com (PE Format) • yara.readthedocs.io • frida.re/docs • github.com/skylot/jadx • OWASP MASTG (mas.owasp.org) • "Practical Malware Analysis" (Sikorski & Honig, No Starch) • "Practical Binary Analysis" (Andriesse, No Starch) • crackmes.one • picoCTF.',
  },
  sections: khung('rev', [
    ['Section 0 — Reading what the compiler left behind', 'Mục 0 — Đọc thứ trình biên dịch để lại', 'Đảo ngược là gì, ai cần, và luật chơi an toàn.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What reverse engineering is, its history, and the analyses that changed events', 'Bắt đầu tại đây (1/2) — Reverse engineering là gì, lịch sử, và những lần phân tích đã đổi chiều sự việc', 'Đọc chương trình như đọc một cỗ máy đã lắp sẵn · Mốc: IDA thập niên 1990, radare 2006, NSA công bố Ghidra 2019 · Stuxnet 2010: phân tích ra mục tiêu là máy ly tâm · WannaCry 05/2017: kill switch tìm thấy nhờ đọc mã · Mirai 2016 và mã nguồn bị công bố · Ai dùng RE: phòng thủ, tương thích, kiểm toán'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, careers, and the legal and safety rules', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, nghề nghiệp, và luật pháp lý & an toàn', 'Vị trí: Malware Analyst, Vulnerability Researcher, Threat Intel, bảo mật ứng dụng di động · Được phép: phần mềm của mình, crackme/CTF, mẫu nghiên cứu trong lab · Không: bẻ khoá bản quyền, phân tích phần mềm vi phạm điều khoản · Pháp lý ghi trung tính: Luật An ninh mạng 2018, BLHS điều 285–289, Luật SHTT — kiểm văn bản mới nhất'],
      ['lab', 'Building a safe lab: isolated VMs, snapshots, no shared folders, host-only network', 'Dựng lab an toàn: VM cô lập, snapshot, không thư mục chia sẻ, mạng host-only', 'REMnux và FLARE-VM · Tắt clipboard/thư mục chia sẻ · Snapshot sạch trước mỗi lần chạy · Không chạy mẫu trên máy thật hay máy có dữ liệu thật · Công cụ: Ghidra, radare2, gdb + pwndbg'],
    ]],
    ['Chapter 1 — From source code to machine code', 'Chương 1 — Từ mã nguồn tới mã máy', 'Hiểu trình biên dịch làm gì để đi ngược lại.', [
      ['bien-dich', 'Compile, assemble, link: what each stage produces', 'Biên dịch, hợp dịch, liên kết: mỗi bước tạo ra gì', 'gcc -S, -c, liên kết · File object và symbol · Liên kết tĩnh vs động · Xem bằng objdump'],
      ['bo-nho', 'Process memory layout: text, data, heap, stack', 'Bố cục bộ nhớ tiến trình: text, data, heap, stack', '/proc/<pid>/maps · Biến toàn cục nằm đâu · Stack frame · ASLR, NX, PIE nhìn thấy thế nào'],
      ['toi-uu', 'How optimisation levels change the binary', 'Mức tối ưu đổi file nhị phân thế nào', '-O0 vs -O2 · Inline, loop unrolling · Mất tên biến, mất symbol khi strip · Compiler Explorer (godbolt.org)'],
      ['ngon-ngu', 'Beyond C: C++, Go, Rust and managed languages in binaries', 'Ngoài C: C++, Go, Rust và ngôn ngữ có máy ảo trong file nhị phân', 'Name mangling và vtable · Go binary to và có runtime riêng · Rust khó đọc hơn · Java/.NET giữ nhiều thông tin hơn'],
    ]],
    ['Chapter 2 — Enough x86-64 assembly to read', 'Chương 2 — Đủ assembly x86-64 để đọc', 'Không cần viết, cần đọc nhanh và đúng.', [
      ['thanh-ghi', 'Registers, flags and the instructions you see most', 'Thanh ghi, cờ và những lệnh gặp nhiều nhất', 'rax..r15, rip, rsp, rbp · mov, lea, add, cmp, test, jmp/jcc · Cú pháp Intel vs AT&T'],
      ['calling', 'Calling conventions: System V AMD64 and Microsoft x64', 'Quy ước gọi hàm: System V AMD64 và Microsoft x64', 'Tham số qua rdi, rsi, rdx… vs rcx, rdx, r8… · Giá trị trả về · Prologue/epilogue · Stack alignment'],
      ['cau-truc', 'Recognising if, loops, switch and function calls', 'Nhận ra if, vòng lặp, switch và lời gọi hàm', 'Mẫu cmp + jcc · Vòng lặp trong đồ thị luồng · Jump table của switch · Gọi hàm qua PLT/GOT'],
      ['du-lieu', 'Recognising arrays, structs, strings and pointers', 'Nhận ra mảng, struct, chuỗi và con trỏ', 'Địa chỉ cơ sở + chỉ số × kích thước · Offset cố định là trường struct · Chuỗi trong .rodata · Con trỏ hàm'],
      ['arm', 'ARM64 at a glance: phones, Apple Silicon and IoT', 'Lướt qua ARM64: điện thoại, Apple Silicon và IoT', 'Thanh ghi x0–x30 · ldr/str · bl và link register · Liên hệ firmware ESP32/IoT của LabFlow (Xtensa/RISC-V khác nữa)'],
    ]],
    ['Chapter 3 — Executable formats: ELF and PE', 'Chương 3 — Định dạng file thực thi: ELF và PE', 'Đọc cấu trúc file trước khi đọc mã.', [
      ['elf', 'ELF: headers, sections, segments, symbols, dynamic linking', 'ELF: header, section, segment, symbol, liên kết động', 'readelf, file, nm · .text/.data/.bss/.plt/.got · Loader nạp file thế nào · Stripped binary'],
      ['pe', 'PE: headers, sections, imports and exports', 'PE: header, section, import và export', 'DOS stub, PE header · Import table nói lên hành vi · PE-bear, pefile (Python) · Resource và chữ ký số'],
      ['string-entropy', 'First look triage: strings, entropy, hashes and packers', 'Soi sơ bộ: chuỗi, entropy, mã băm và packer', 'strings/FLOSS · Entropy cao gợi ý nén/mã hoá · Detect It Easy · Tra mã băm trên VirusTotal (không tải mẫu nhạy cảm lên)'],
      ['lief', 'Parsing and patching binaries with LIEF and pyelftools', 'Phân tích và sửa file nhị phân với LIEF và pyelftools', 'Script đọc header · Đổi một lệnh nhảy trên crackme của chính mình · Vì sao chữ ký số hỏng khi sửa'],
    ]],
    ['Chapter 4 — Static analysis with Ghidra and radare2', 'Chương 4 — Phân tích tĩnh với Ghidra và radare2', 'Đọc chương trình mà không chạy nó.', [
      ['ghidra', 'Ghidra: project, auto-analysis, listing and decompiler', 'Ghidra: project, tự phân tích, listing và decompiler', 'Nhập file và chọn ngôn ngữ · Đọc song song listing và mã giả C · Cross-reference · Đồ thị hàm'],
      ['dat-ten', 'Making sense of the decompiler: renaming, retyping, structs', 'Làm mã giả dễ đọc: đổi tên, đổi kiểu, dựng struct', 'Đổi tên từ trong ra ngoài · Định nghĩa struct từ offset · Nhận diện hàm thư viện (FID, signatures) · Ghi chú để quay lại'],
      ['radare2', 'radare2 and Cutter for fast command-line analysis', 'radare2 và Cutter cho phân tích nhanh bằng dòng lệnh', 'aaa, afl, pdf, VV · Tìm chuỗi và xref · r2pipe để tự động hoá · So với Ghidra'],
      ['script', 'Scripting analysis: Ghidra scripts and headless mode', 'Tự động hoá phân tích: script Ghidra và chế độ headless', 'Script Python/Java trong Ghidra · Headless phân tích hàng loạt · Trích hàm gọi API nguy hiểm'],
      ['ida', 'IDA Free and Binary Ninja: what differs and when to choose them', 'IDA Free và Binary Ninja: khác gì và khi nào chọn', 'Giới hạn bản miễn phí · Hệ sinh thái plugin · Ngành dùng gì · Chọn một công cụ và đi sâu'],
    ]],
    ['Chapter 5 — Dynamic analysis and debugging', 'Chương 5 — Phân tích động và gỡ lỗi', 'Cho chương trình chạy — trong lab — và nhìn nó làm gì.', [
      ['gdb', 'gdb with pwndbg or GEF: breakpoints, stepping, memory', 'gdb với pwndbg hoặc GEF: breakpoint, chạy từng bước, xem bộ nhớ', 'break, run, ni/si, x/, info registers · Breakpoint có điều kiện · Đặt breakpoint theo địa chỉ khi không có symbol'],
      ['trace', 'Tracing system and library calls: strace, ltrace, ptrace', 'Theo dõi lời gọi hệ thống và thư viện: strace, ltrace, ptrace', 'File nào được mở, kết nối nào được tạo · Lọc theo syscall · ltrace thấy strcmp mật khẩu · Giới hạn với binary tĩnh'],
      ['x64dbg', 'Windows debugging with x64dbg', 'Gỡ lỗi trên Windows với x64dbg', 'Giao diện và phím tắt · Breakpoint trên API · Theo dõi trong VM FLARE-VM · Plugin ScyllaHide nói tới ở chương chống gỡ lỗi'],
      ['frida', 'Dynamic instrumentation with Frida', 'Can thiệp động với Frida', 'Hook hàm và in tham số · Đổi giá trị trả về · Script JavaScript · Dùng lại ở chương Android'],
      ['emulation', 'Emulation: QEMU user mode and Unicorn for foreign architectures', 'Giả lập: QEMU user mode và Unicorn cho kiến trúc khác', 'Chạy binary ARM trên máy x86 · Giả lập một hàm giải mã · Khi nào giả lập an toàn hơn chạy thật'],
    ]],
    ['Chapter 6 — Crackmes and CTF reversing, legally', 'Chương 6 — Crackme và bài reversing CTF, hợp pháp', 'Luyện kỹ năng trên bài tập sinh ra để bị giải.', [
      ['crackme', 'Solving your first crackmes: find the check, understand it, write a keygen', 'Giải crackme đầu tiên: tìm chỗ kiểm, hiểu nó, viết keygen', 'crackmes.one với bài được phép · Tìm chuỗi "wrong" rồi đi ngược · Dựng lại thuật toán · Viết lời giải thay vì vá'],
      ['symbolic', 'Symbolic execution with angr and constraint solving with Z3', 'Thực thi ký hiệu với angr và giải ràng buộc với Z3', 'Khi thuật toán quá rối để đọc tay · angr tìm đường tới "success" · Z3 giải hệ điều kiện'],
      ['ctf', 'CTF reversing categories and how to practise', 'Các dạng bài reversing trong CTF và cách luyện', 'picoCTF, Flare-On (của Mandiant/Google), CTFtime · Bài VM tự chế, bài WASM, bài .NET · Viết write-up'],
      ['ban-quyen', 'Where the line is: licensing, DRM and why this course does not crack software', 'Ranh giới ở đâu: bản quyền, DRM và vì sao khoá này không bẻ khoá phần mềm', 'Điều khoản sử dụng thường cấm đảo ngược · Ngoại lệ nghiên cứu/tương thích khác nhau theo nước · Công bố lỗ hổng có trách nhiệm · Kiểm văn bản pháp luật mới nhất'],
    ]],
    ['Chapter 7 — Obfuscation and anti-analysis', 'Chương 7 — Làm rối mã và chống phân tích', 'Mã cố tình khó đọc — cả mã độc lẫn phần mềm hợp pháp.', [
      ['packer', 'Packers and unpacking: UPX and manual unpacking at a glance', 'Packer và giải nén: UPX và giải nén thủ công ở mức nhập môn', 'upx -d · Tìm điểm nhảy về OEP · Dump bộ nhớ sau khi tự giải · Nhận diện packer'],
      ['chong-debug', 'Anti-debugging and anti-VM tricks, and how analysts get around them', 'Mẹo chống gỡ lỗi và chống máy ảo, và cách người phân tích vượt qua', 'ptrace(PTRACE_TRACEME), IsDebuggerPresent · Đo thời gian · Dò VirtualBox/VMware · Vá hoặc hook để vượt'],
      ['obfuscation', 'Code obfuscation: control-flow flattening, opaque predicates, string encryption', 'Làm rối mã: làm phẳng luồng điều khiển, điều kiện mờ, mã hoá chuỗi', 'Nhận diện trong Ghidra · Giải mã chuỗi bằng giả lập · Công cụ O-LLVM tạo ra gì'],
      ['bao-ve', 'Protecting your own apps: what obfuscation can and cannot do', 'Bảo vệ ứng dụng của chính mình: làm rối làm được gì và không làm được gì', 'Bí mật trong app client không bao giờ an toàn · ProGuard/R8 cho Android · Asar của Electron đọc được · Đặt logic nhạy cảm ở server'],
    ]],
    ['Chapter 8 — Safe malware analysis', 'Chương 8 — Phân tích mã độc an toàn', 'Quy trình của người phân tích: an toàn trước, kết luận sau.', [
      ['an-toan', 'Handling samples safely: sources, password-protected archives, lab discipline', 'Xử lý mẫu an toàn: nguồn, file nén có mật khẩu, kỷ luật lab', 'Kho nghiên cứu (MalwareBazaar, theZoo) và điều khoản của họ · Mật khẩu "infected" · Đổi đuôi file · Không bao giờ trên máy thật, không mạng thật'],
      ['tinh', 'Static triage of a sample: hashes, imports, strings, capa', 'Soi tĩnh một mẫu: mã băm, import, chuỗi, capa', 'capa gắn khả năng với ATT&CK · Import gợi ý mạng/mã hoá/bám trụ · Chuỗi URL/đường dẫn · Ghi tất cả vào sổ phân tích'],
      ['dong', 'Behavioural analysis in the sandbox: process, file, registry and network', 'Phân tích hành vi trong sandbox: tiến trình, file, registry và mạng', 'Procmon/Process Hacker trên Windows, strace/auditd trên Linux · INetSim/FakeNet-NG giả mạng · Wireshark · Sandbox tự động (CAPE) ở mức giới thiệu'],
      ['ho-mau', 'Common families by behaviour: ransomware, stealers, RATs, botnets, miners', 'Các họ phổ biến theo hành vi: mã độc tống tiền, đánh cắp thông tin, RAT, botnet, đào coin', 'WannaCry lan qua SMB (EternalBlue) · Mirai quét IoT mật khẩu mặc định · Miner nhắm server Linux và Docker API mở · Liên hệ phòng thủ cho VPS'],
      ['ioc', 'Extracting IOCs and writing a malware report', 'Trích IOC và viết báo cáo mã độc', 'Hash, domain, IP, mutex, đường dẫn · Mức tin cậy của từng IOC · Mẫu báo cáo ngắn · Chia sẻ qua MISP/cộng đồng đúng cách'],
    ]],
    ['Chapter 9 — YARA and detection from analysis', 'Chương 9 — YARA và biến phân tích thành phát hiện', 'Từ một mẫu đã hiểu tới quy tắc bắt cả họ.', [
      ['yara', 'YARA rule anatomy: strings, conditions, modules', 'Cấu trúc quy tắc YARA: strings, condition, module', 'Chuỗi text/hex/regex · Module pe/elf/math · Điều kiện theo kích thước và vị trí · Chạy yara trên thư mục'],
      ['tot', 'Writing rules that survive: avoiding brittle strings and false positives', 'Viết quy tắc bền: tránh chuỗi dễ đổi và dương tính giả', 'Bắt đặc trưng thuật toán thay vì chuỗi · Kiểm trên tập file sạch · yarGen gợi ý · Phiên bản hoá quy tắc'],
      ['trien-khai', 'Deploying YARA: scanning servers, uploads and memory', 'Đưa YARA vào dùng: quét server, file tải lên và bộ nhớ', 'Quét thư mục upload · YARA trong Wazuh/ClamAV · Volatility yarascan · Trỏ khoá Blue Team SIEM'],
    ]],
    ['Chapter 10 — Mobile and managed code: Android, Java, .NET', 'Chương 10 — Di động và mã có máy ảo: Android, Java, .NET', 'Đảo ngược nơi bytecode giữ lại nhiều thông tin.', [
      ['apk', 'Inside an APK: manifest, DEX, resources, native libraries', 'Bên trong một APK: manifest, DEX, tài nguyên, thư viện native', 'apktool giải nén · jadx dịch ngược DEX về Java · Quyền trong manifest · Thư viện .so đọc bằng Ghidra'],
      ['frida-android', 'Dynamic analysis on Android: emulator, Frida and traffic inspection', 'Phân tích động trên Android: máy ảo, Frida và soi lưu lượng', 'Máy ảo Android Studio có root · Frida hook hàm Java · SSL pinning là gì và vì sao app có nó · Chỉ trên app của mình hoặc app luyện tập (OWASP MASTG)'],
      ['jar', 'Java and Spring Boot JARs: decompiling with CFR and what leaks', 'JAR của Java và Spring Boot: dịch ngược với CFR và thứ gì bị lộ', 'Fat JAR của LabFlow mở ra thấy gì · application.yml có bí mật không · Tên lớp và logic · Vì sao không nhét khoá vào client'],
      ['dotnet', '.NET assemblies with dnSpyEx and ILSpy', 'Assembly .NET với dnSpyEx và ILSpy', 'IL gần như mã nguồn · Gỡ lỗi trên assembly · Obfuscator .NET · Ứng dụng Windows nội bộ'],
      ['electron', 'Electron and JavaScript apps: asar archives and source maps', 'Ứng dụng Electron và JavaScript: file asar và source map', 'npx asar extract · Source map bị đóng gói nhầm · Áp vào app desktop của chính web này · Code signing không che mã'],
    ]],
    ['Chapter 11 — Capstone: a full analysis report', 'Chương 11 — Dự án cuối khoá: một báo cáo phân tích trọn vẹn', 'Phân tích một mẫu từ kho nghiên cứu trong lab cô lập, từ đầu tới cuối.', [
      ['chon-mau', 'Choosing a sample and preparing the lab: snapshot, network simulation, notebook', 'Chọn mẫu và chuẩn bị lab: snapshot, giả lập mạng, sổ phân tích', 'Mẫu Linux nhắm server (miner/botnet) từ MalwareBazaar · Kiểm điều khoản nguồn · Snapshot sạch · Giả lập DNS/HTTP'],
      ['phan-tich', 'Analysis: triage, static deep dive, dynamic run, unpacking', 'Phân tích: soi sơ bộ, đọc tĩnh sâu, chạy động, giải nén', 'capa + Ghidra · Chạy có giám sát · Giải cấu hình C2 được nhúng · Khôi phục snapshot sau mỗi lần'],
      ['phat-hien', 'Detection: YARA rule, Sigma rule and hardening advice for a VPS like yours', 'Phát hiện: quy tắc YARA, quy tắc Sigma và lời khuyên siết cho một VPS giống của bạn', 'YARA cho file · Sigma cho hành vi trên log · Mẫu đó vào bằng đường nào và chặn thế nào trên Ubuntu + Docker'],
      ['bao-cao', 'The report: executive summary, technical details, IOCs, ATT&CK mapping', 'Báo cáo: tóm tắt điều hành, chi tiết kỹ thuật, IOC, ánh xạ ATT&CK', 'Viết cho hai loại người đọc · Phân biệt quan sát và suy luận · Đăng write-up công khai mà không phát tán mẫu'],
    ]],
    ['Chapter 12 — Careers, practice and certifications', 'Chương 12 — Nghề nghiệp, luyện tập và chứng chỉ', 'Đi tiếp sau khoá này.', [
      ['chung-chi', 'Certifications as references: GREM, eCRE-type practical exams, and vendor training', 'Chứng chỉ để tham khảo: GREM, các kỳ thi thực hành kiểu eCRE, và đào tạo của hãng', 'GREM (GIAC) là chuẩn ngành nhưng đắt · Thi thực hành vs trắc nghiệm · Hồ sơ write-up và Flare-On quan trọng · Kiểm thông tin mới nhất'],
      ['luyen', 'A practice roadmap: crackmes, Flare-On, malware traffic exercises, bug bounty on binaries', 'Lộ trình luyện: crackme, Flare-On, bài tập phân tích lưu lượng mã độc, bug bounty trên file nhị phân', 'Mỗi tuần một bài · malware-traffic-analysis.net · Đọc báo cáo của các đội threat intel · Đóng góp quy tắc YARA'],
      ['phong-van', 'Interview questions: walk through an unknown binary, calling conventions, packers', 'Câu hỏi phỏng vấn: xử lý một file lạ, quy ước gọi hàm, packer', 'Quy trình năm bước khi nhận một file lạ · Giải thích lab an toàn của bạn · Đọc một đoạn assembly tại chỗ'],
    ]],
  ]),
};

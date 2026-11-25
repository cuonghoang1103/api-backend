/**
 * IDE & đồ nghề dev — Chương 2: IntelliJ IDEA cho Java và Spring Boot (soạn 24/11/2026, agent ide trên máy nhà).
 * Slug + title chương GIỮ NGUYÊN theo khung trong ../ide-va-do-nghe-dev.mjs (ghép bằng ghep()).
 * Thêm 1 bài ngoài khung: ide-2-8-ai-tro-ly (đứng sau 2.5, trước lab) — ghep() ở tệp khoá đã cho phép bài thêm.
 * Dự án mẫu: gear-mini (Spring Boot 4.2.0, Maven, tạo ở bài 0.1) + script tao-gear-ch2.sh ở bài 2.1.
 * Mọi output trong bài chạy THẬT ngày 24/11/2026: Temurin 21.0.9 và 17 (container eclipse-temurin), Maven wrapper 3.9,
 * Gradle 9.9.2, IntelliJ HTTP Client CLI 2025.3 (ảnh jetbrains/intellij-http-client), PostgreSQL 17.12, JaCoCo 0.8.14,
 * gitleaks 8.30.1. Phím tắt theo keymap mặc định của IntelliJ IDEA (Reference Card + Help → Keyboard Shortcuts PDF).
 * Debugger sâu KHÔNG dạy ở đây — thuộc debug-co-phuong-phap ch4 (2.4 chỉ có phần "đủ dùng ngày đầu" + liên kết).
 * KHÔNG backtick trần trong content; mã mẫu đi qua các hàm của ./_chung.mjs, khai báo thành const.
 */
import { java, bash, xml, out, tl, giai, json, phim, bai, Q } from './_chung.mjs';

/* ═════════════ 2.1 — Mở dự án cho đúng ═════════════ */
const TAO_CH2 = `#!/usr/bin/env bash
# tao-gear-ch2.sh — thêm mã Chương 2 vào gear-mini (chạy trong thư mục gear-mini)
set -euo pipefail
B=src/main/java/com/labflow/gear
T=src/test/java/com/labflow/gear
mkdir -p $B/gear $T/gear

cat > $B/gear/Gear.java <<'J'
package com.labflow.gear.gear;

public record Gear(long id, String name, String type, String borrower) {
    public boolean available() {
        return borrower == null;
    }
}
J

cat > $B/gear/GearRepository.java <<'J'
package com.labflow.gear.gear;

import java.util.List;
import java.util.Optional;

public interface GearRepository {
    List<Gear> findAll();
    Optional<Gear> findById(long id);
    Gear save(Gear gear);
}
J

cat > $B/gear/InMemoryGearRepository.java <<'J'
package com.labflow.gear.gear;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryGearRepository implements GearRepository {
    private final Map<Long, Gear> data = new TreeMap<>();

    public InMemoryGearRepository() {
        save(new Gear(1, "Arduino Uno R3", "BOARD", null));
        save(new Gear(2, "Raspberry Pi 5", "BOARD", null));
        save(new Gear(3, "Logic Analyzer 8CH", "TOOL", "an.nv"));
        save(new Gear(4, "USB-UART CP2102", "CABLE", null));
    }

    @Override
    public List<Gear> findAll() {
        return new ArrayList<>(data.values());
    }

    @Override
    public Optional<Gear> findById(long id) {
        return Optional.ofNullable(data.get(id));
    }

    @Override
    public Gear save(Gear gear) {
        data.put(gear.id(), gear);
        return gear;
    }
}
J

cat > $B/gear/LoanPolicy.java <<'J'
package com.labflow.gear.gear;

public interface LoanPolicy {
    int maxDays();
}
J

cat > $B/gear/StudentPolicy.java <<'J'
package com.labflow.gear.gear;

public class StudentPolicy implements LoanPolicy {
    @Override
    public int maxDays() {
        return 7;
    }
}
J

cat > $B/gear/LecturerPolicy.java <<'J'
package com.labflow.gear.gear;

public class LecturerPolicy implements LoanPolicy {
    @Override
    public int maxDays() {
        return 30;
    }
}
J

cat > $B/gear/GearNotFoundException.java <<'J'
package com.labflow.gear.gear;

public class GearNotFoundException extends RuntimeException {
    public GearNotFoundException(long id) {
        super("Khong co thiet bi id=" + id);
    }
}
J

cat > $B/gear/GearService.java <<'J'
package com.labflow.gear.gear;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GearService {
    private final GearRepository repo;
    private final int maxLoans;

    public GearService(GearRepository repo, @Value("\${gear.max-loans:2}") int maxLoans) {
        this.repo = repo;
        this.maxLoans = maxLoans;
    }

    public List<Gear> available() {
        return repo.findAll().stream().filter(Gear::available).toList();
    }

    public Gear borrow(long id, String who) {
        Gear g = repo.findById(id).orElseThrow(() -> new GearNotFoundException(id));
        if (!g.available()) {
            throw new IllegalStateException(g.name() + " dang duoc " + g.borrower() + " muon");
        }
        long dangMuon = repo.findAll().stream().filter(x -> who.equals(x.borrower())).count();
        if (dangMuon >= maxLoans) {
            throw new IllegalStateException(who + " da muon " + dangMuon + "/" + maxLoans + " mon");
        }
        return repo.save(new Gear(g.id(), g.name(), g.type(), who));
    }

    public int maxLoans() {
        return maxLoans;
    }
}
J

cat > $B/gear/GearController.java <<'J'
package com.labflow.gear.gear;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gears")
public class GearController {
    private final GearService service;

    public GearController(GearService service) {
        this.service = service;
    }

    @GetMapping("/available")
    public List<Gear> available() {
        return service.available();
    }

    @PostMapping("/{id}/borrow")
    public Gear borrow(@PathVariable long id, @RequestParam String who) {
        return service.borrow(id, who);
    }

    @ExceptionHandler(GearNotFoundException.class)
    public ResponseEntity<Map<String, String>> notFound(GearNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> conflict(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
    }
}
J

cat > $B/gear/StartupLog.java <<'J'
package com.labflow.gear.gear;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class StartupLog implements CommandLineRunner {
    private final GearService service;
    private final Environment env;

    public StartupLog(GearService service, Environment env) {
        this.service = service;
        this.env = env;
    }

    @Override
    public void run(String... args) {
        System.out.println(">>> gear-mini: profiles=" + String.join(",", env.getActiveProfiles())
                + " max-loans=" + service.maxLoans());
    }
}
J

cat > $T/gear/GearServiceTest.java <<'J'
package com.labflow.gear.gear;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class GearServiceTest {
    private final GearService service = new GearService(new InMemoryGearRepository(), 2);

    @Test
    void availableBoQuaDoDangMuon() {
        assertEquals(3, service.available().size());
    }

    @Test
    void muonDoDangCoNguoiMuonBiTuChoi() {
        assertThrows(IllegalStateException.class, () -> service.borrow(3, "binh.tt"));
    }

    @Test
    void muonQuaHanMucBiTuChoi() {
        service.borrow(1, "binh.tt");
        service.borrow(2, "binh.tt");
        assertThrows(IllegalStateException.class, () -> service.borrow(4, "binh.tt"));
    }
}
J

cat > src/main/resources/application-dev.properties <<'P'
gear.max-loans=5
P
echo "gear.max-loans=2" >> src/main/resources/application.properties
echo "Da them $(find $B/gear $T/gear -name '*.java' | wc -l) file Java cho Chuong 2"
`;
const TAO_CH2_CHAY = bash(`
cd ~/do-nghe/gear-mini
# lưu script bên dưới thành ../tao-gear-ch2.sh rồi:
bash ../tao-gear-ch2.sh
./mvnw -q test          # Windows: .\\mvnw.cmd -q test
git init -q 2>/dev/null; git add . && git commit -qm "gear-mini: ma Chuong 2"
`);
const TAO_CH2_OUT = out(`
Da them 11 file Java cho Chuong 2
`);
const JDK17_LOI = out(`
$ ./mvnw -q compile            # chạy bằng JDK 17, pom.xml ghi java.version = 21
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.16.0:compile
(default-compile) on project gear-mini: Fatal error compiling: error: release version 21 not supported -> [Help 1]
`);
const JDK21_OK = out(`
$ ./mvnw test                  # chạy bằng JDK 21
[INFO] Running com.labflow.gear.GearMiniApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.455 s -- in com.labflow.gear.GearMiniApplicationTests
[INFO] Running com.labflow.gear.gear.GearServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.009 s -- in com.labflow.gear.gear.GearServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time:  3.312 s
`);
const GRADLE_TOOLCHAIN = out(`
$ ./gradlew test               # Gradle chạy trên JDK 17, build.gradle đòi toolchain 21
FAILURE: Build failed with an exception.
* What went wrong:
Could not determine the dependencies of task ':test'.
> Could not resolve all dependencies for configuration ':testRuntimeClasspath'.
   > Failed to calculate the value of task ':compileTestJava' property 'javaCompiler'.
      > Cannot find a Java installation on your machine (Linux 7.1.3-201.fc44.x86_64 amd64) matching:
        {languageVersion=21, vendor=any vendor, implementation=vendor-specific, nativeImageCapable=false}.
        Toolchain download repositories have not been configured.
BUILD FAILED in 3s
`);
const POM_JAVA = xml(`
<properties>
    <java.version>21</java.version>   <!-- Spring Boot biến số này thành maven.compiler.release = 21 -->
</properties>
`);
const BAY_GRADLE = bash(`
# build.gradle của một "bài test tuyển dụng" — chỉ in ra, nhưng y hệt chỗ kẻ xấu đặt mã độc
plugins { id 'java' }

// Đoạn này chạy NGAY KHI IDE import dự án (giai đoạn cấu hình), chưa cần bấm Run
def home = System.getProperty('user.home')
def thay = new File(home).list()?.findAll { it.startsWith('.') }?.sort()?.take(6)
println "[build.gradle] dang chay voi quyen cua \${System.getProperty('user.name')} — thay trong \${home}: \${thay}"
`);
const BAY_GRADLE_OUT = out(`
$ ./gradlew help -q            # việc IDE làm ngầm khi "Load Gradle project"
[build.gradle] dang chay voi quyen cua ubuntu — thay trong /home/ubuntu: [.bash_logout, .bashrc, .profile]
`);
const SETTINGS_MIRROR = xml(`
<!-- ~/.m2/settings.xml (Windows: %USERPROFILE%\\.m2\\settings.xml) — mẫu máy công ty có kho Nexus nội bộ -->
<settings>
  <mirrors>
    <mirror>
      <id>nexus-cong-ty</id>
      <mirrorOf>*</mirrorOf>
      <url>http://127.0.0.1:41999/repository/maven-public/</url>
    </mirror>
  </mirrors>
  <!-- nếu bắt buộc qua proxy HTTP: thêm <proxies><proxy>…host, port, nonProxyHosts…</proxy></proxies> -->
</settings>
`);
const MIRROR_LOI = out(`
$ ./mvnw -s settings.xml compile          # kho nội bộ không tới được (mô phỏng: cổng đóng)
[ERROR]     Non-resolvable parent POM for com.labflow:gear-mini:0.0.1-SNAPSHOT: The following artifacts could not be
resolved: org.springframework.boot:spring-boot-starter-parent:pom:4.2.0 (absent): Could not transfer artifact
org.springframework.boot:spring-boot-starter-parent:pom:4.2.0 from/to nexus-cong-ty
(http://127.0.0.1:41999/repository/maven-public/): Connect to 127.0.0.1:41999 [/127.0.0.1] failed: Connection refused
`);
const P_DU_AN = [
  ['Open Settings', 'Mở Settings', 'Ctrl+Alt+S', '⌘,'],
  ['Project Structure (SDK, language level, modules)', 'Project Structure (SDK, language level, module)', 'Ctrl+Alt+Shift+S', '⌘;'],
  ['Load Maven / Gradle changes (after editing pom.xml / build.gradle)', 'Nạp thay đổi Maven / Gradle (sau khi sửa pom.xml / build.gradle)', 'Ctrl+Shift+O', '⇧⌘I'],
  ['Find Action — run any command by name', 'Find Action — chạy mọi lệnh theo tên', 'Ctrl+Shift+A', '⇧⌘A'],
  ['Project tool window', 'Cửa sổ Project', 'Alt+1', '⌘1'],
  ['Terminal tool window', 'Cửa sổ Terminal', 'Alt+F12', '⌥F12'],
  ['Hide all tool windows (focus on code)', 'Ẩn mọi cửa sổ công cụ (chỉ còn mã)', 'Ctrl+Shift+F12', '⇧⌘F12'],
  ['Back to the editor from any tool window', 'Quay về trình soạn thảo từ cửa sổ công cụ', 'Esc', 'Esc'],
];

const L1 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · IntelliJ IDEA' : 'Chương 2 · IntelliJ IDEA'}</span>
<h2>${en ? '2.1 — Opening projects right: Maven/Gradle import, Project SDK, language level, indexing' : '2.1 — Mở dự án cho đúng: import Maven/Gradle, Project SDK, language level, lập chỉ mục'}</h2>
<p class="lead">${en
    ? 'The first morning of an internship on a Java project usually looks like this: you clone the repository, open it in IntelliJ, and every file is red. Nothing is wrong with the code — the IDE simply does not yet agree with the build tool about <em>which JDK</em>, <em>which Java version</em> and <em>which libraries</em>. This lesson gives you the mental model and a fixed order of checks, so “red everywhere” takes five minutes instead of a morning.'
    : 'Buổi sáng đầu tiên thực tập trên dự án Java thường thế này: bạn clone repo, mở bằng IntelliJ, và file nào cũng đỏ lòm. Mã không hề sai — chỉ là IDE chưa thống nhất với công cụ build về <em>dùng JDK nào</em>, <em>Java phiên bản mấy</em> và <em>thư viện nào</em>. Bài này cho bạn mô hình trong đầu và một thứ tự kiểm cố định, để “đỏ khắp nơi” chỉ tốn năm phút thay vì cả buổi sáng.'}</p>

<h3>${en ? 'First: who is the boss — the IDE or the build tool?' : 'Trước hết: ai là “sếp” — IDE hay công cụ build?'}</h3>
<p>${en
    ? 'In a Maven or Gradle project, the <strong>build file is the single source of truth</strong>: <code>pom.xml</code> (Maven) or <code>build.gradle</code>/<code>build.gradle.kts</code> (Gradle) lists the Java version, the dependencies and how to build. IntelliJ <em>reads</em> that file and builds its own model (modules, libraries, source folders) inside the hidden <code>.idea/</code> folder. CI servers and your teammates never look at <code>.idea/</code> — they run <code>mvn</code> or <code>gradle</code>. So the rule is simple: <strong>change the build file, then let the IDE re-import</strong>; never “fix” a dependency only in the IDE’s Project Structure dialog, because it will vanish at the next import and the build server will still fail.'
    : 'Trong dự án Maven hay Gradle, <strong>file build là nguồn sự thật duy nhất</strong>: <code>pom.xml</code> (Maven) hoặc <code>build.gradle</code>/<code>build.gradle.kts</code> (Gradle) ghi phiên bản Java, các thư viện phụ thuộc và cách build. IntelliJ <em>đọc</em> file đó rồi dựng mô hình riêng của nó (module, thư viện, thư mục nguồn) trong thư mục ẩn <code>.idea/</code>. Máy CI và đồng đội không bao giờ nhìn <code>.idea/</code> — họ chạy <code>mvn</code> hoặc <code>gradle</code>. Nên luật rất đơn giản: <strong>sửa file build, rồi để IDE import lại</strong>; đừng bao giờ “sửa” thư viện chỉ trong hộp thoại Project Structure của IDE, vì lần import sau nó biến mất và máy build vẫn lỗi.'}</p>
<div class="lz-stack">
  <div class="lz-layer"><strong>pom.xml / build.gradle</strong> — ${en ? 'the truth: Java version, dependencies, plugins (committed to Git)' : 'sự thật: phiên bản Java, thư viện, plugin (commit vào Git)'}</div>
  <div class="lz-layer"><strong>${en ? 'Import' : 'Import'}</strong> — ${en ? 'IntelliJ asks Maven/Gradle for the model and downloads jars into ~/.m2 or ~/.gradle' : 'IntelliJ hỏi Maven/Gradle lấy mô hình và tải jar vào ~/.m2 hoặc ~/.gradle'}</div>
  <div class="lz-layer"><strong>.idea/ + *.iml</strong> — ${en ? 'the IDE’s copy of that model (mostly not committed)' : 'bản sao mô hình của IDE (phần lớn không commit)'}</div>
  <div class="lz-layer"><strong>${en ? 'Index' : 'Chỉ mục (index)'}</strong> — ${en ? 'a searchable map of every class, method and usage — what makes Ctrl+B and Find Usages instant' : 'bản đồ tra cứu mọi class, method, chỗ dùng — thứ làm Ctrl+B và Find Usages chạy tức thì'}</div>
</div>
<p>${en
    ? 'Everyday comparison: the <code>pom.xml</code> is the recipe card pinned in the kitchen; <code>.idea/</code> is the note you copied into your own notebook. If the recipe changes and you keep cooking from your notebook, your dish differs from everyone else’s.'
    : 'Liên tưởng đời thường: <code>pom.xml</code> là tờ công thức dán trong bếp chung; <code>.idea/</code> là bản bạn chép vào sổ tay riêng. Công thức đổi mà bạn vẫn nấu theo sổ tay thì món của bạn khác của cả nhà.'}</p>

<h3>${en ? 'Opening the project: the folder that contains pom.xml' : 'Mở dự án: chọn thư mục chứa pom.xml'}</h3>
<ol>
<li>${en ? '<em>File → Open…</em> (or <em>Open</em> on the Welcome screen) and choose the folder that <strong>contains</strong> <code>pom.xml</code> or <code>build.gradle</code> — not <code>src</code>, not the parent folder with five projects in it. Opening <code>src</code> gives you a “project” with no build file: every import is red.' : '<em>File → Open…</em> (hoặc <em>Open</em> ở màn hình chào) rồi chọn thư mục <strong>chứa</strong> <code>pom.xml</code> hoặc <code>build.gradle</code> — không chọn <code>src</code>, không chọn thư mục cha chứa năm dự án. Mở <code>src</code> là bạn có một “dự án” không có file build: mọi import đều đỏ.'}</li>
<li>${en ? 'IntelliJ asks <em>Trust and Open Project?</em> Choose <strong>Trust Project</strong> only for code you or your team wrote. For anything else choose <strong>Preview in Safe Mode</strong> (see the hacker’s view below).' : 'IntelliJ hỏi <em>Trust and Open Project?</em> Chỉ chọn <strong>Trust Project</strong> với mã bạn hoặc nhóm bạn viết. Còn lại chọn <strong>Preview in Safe Mode</strong> (xem góc hacker bên dưới).'}</li>
<li>${en ? 'Watch the status bar at the bottom: “Resolving dependencies…”, then “Indexing…”. Until both finish, navigation and red underlines are unreliable — this is called <em>dumb mode</em>. First import of a Spring Boot project downloads a few hundred jars; later imports reuse <code>~/.m2/repository</code>.' : 'Nhìn thanh trạng thái dưới đáy: “Resolving dependencies…”, rồi “Indexing…”. Khi hai việc này chưa xong, điều hướng và gạch đỏ chưa đáng tin — trạng thái này gọi là <em>dumb mode</em>. Lần import đầu của dự án Spring Boot tải vài trăm file jar; các lần sau dùng lại <code>~/.m2/repository</code>.'}</li>
</ol>
${phim(P_DU_AN, !en)}

<h3>${en ? 'Three Java versions that must agree' : 'Ba “phiên bản Java” phải khớp nhau'}</h3>
<p>${en
    ? 'Most “red everywhere” and “works on my machine” problems are a disagreement between these settings:'
    : 'Phần lớn lỗi “đỏ khắp nơi” và “máy tôi chạy được mà” là do mấy chỗ cài đặt sau không khớp nhau:'}</p>
<table>
<thead><tr><th>${en ? 'Setting' : 'Cài đặt'}</th><th>${en ? 'Where' : 'Ở đâu'}</th><th>${en ? 'What it means' : 'Nghĩa là gì'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Java version of the build' : 'Phiên bản Java của build'}</td><td><code>pom.xml</code> → <code>java.version</code> / <code>maven.compiler.release</code>; Gradle → <code>toolchain.languageVersion</code></td><td>${en ? 'The bytecode level the project promises. The team’s decision — committed.' : 'Mức bytecode dự án cam kết. Quyết định của nhóm — được commit.'}</td></tr>
<tr><td>Project SDK</td><td><em>Project Structure → Project → SDK</em></td><td>${en ? 'Which installed JDK IntelliJ uses to compile and run. Must be <strong>at least</strong> the build’s version.' : 'JDK nào đã cài trên máy được IntelliJ dùng để biên dịch và chạy. Phải <strong>bằng hoặc mới hơn</strong> phiên bản của build.'}</td></tr>
<tr><td>Language level</td><td><em>Project Structure → Project / Modules</em></td><td>${en ? 'Which syntax the editor accepts (records, <code>switch</code> patterns…). After a Maven import it follows <code>pom.xml</code> automatically.' : 'Editor chấp nhận cú pháp tới bản nào (record, <code>switch</code> pattern…). Sau khi import Maven nó tự theo <code>pom.xml</code>.'}</td></tr>
<tr><td>${en ? 'Maven runner JRE / Gradle JVM' : 'JRE chạy Maven / Gradle JVM'}</td><td><em>Settings → Build Tools → Maven → Runner</em>; <em>… → Gradle → Gradle JVM</em></td><td>${en ? 'Which JDK runs the build tool itself inside the IDE. Default “Use Project JDK” — keep it.' : 'JDK nào chạy chính công cụ build bên trong IDE. Mặc định “Use Project JDK” — cứ giữ.'}</td></tr>
<tr><td>${en ? 'JAVA_HOME of your terminal' : 'JAVA_HOME của terminal'}</td><td>${en ? 'environment variable' : 'biến môi trường'}</td><td>${en ? 'What <code>./mvnw</code> uses when you type it in a terminal. Can differ from the IDE — a classic source of “it builds in IntelliJ but not in the terminal”.' : 'Thứ <code>./mvnw</code> dùng khi bạn gõ trong terminal. Có thể khác IDE — nguồn kinh điển của “IntelliJ build được mà terminal thì không”.'}</td></tr>
</tbody>
</table>
${POM_JAVA}
<p>${en ? 'Here is what a mismatch looks like for real. <code>gear-mini</code> asks for Java 21; the same command run with JDK 17 and then JDK 21:' : 'Đây là hình dạng thật của lệch phiên bản. <code>gear-mini</code> đòi Java 21; cùng một lệnh, chạy bằng JDK 17 rồi bằng JDK 21:'}</p>
${JDK17_LOI}
${JDK21_OK}
<p>${en ? 'Gradle says the same thing in its own words when the toolchain asks for 21 and only 17 is installed:' : 'Gradle nói cùng một điều theo cách của nó khi toolchain đòi 21 mà máy chỉ có 17:'}</p>
${GRADLE_TOOLCHAIN}
<div class="callout ok"><p>${en
    ? '<strong>Reading these messages:</strong> “release version 21 not supported” means <em>the compiler is older than what the project asks for</em> — install or select a newer JDK, do not lower <code>java.version</code> (that changes the project for everyone). In IntelliJ: <em>Project Structure → SDK → Download JDK…</em> picks a vendor and version and installs it in one click.'
    : '<strong>Đọc các thông báo này:</strong> “release version 21 not supported” nghĩa là <em>trình biên dịch cũ hơn mức dự án yêu cầu</em> — cài hoặc chọn JDK mới hơn, đừng hạ <code>java.version</code> (làm thế là đổi dự án của cả nhóm). Trong IntelliJ: <em>Project Structure → SDK → Download JDK…</em> chọn nhà cung cấp và phiên bản rồi cài trong một cú bấm.'}</p></div>

<h3>${en ? 'Indexing: why the IDE is slow for a minute, then fast all day' : 'Lập chỉ mục: vì sao IDE chậm một phút rồi nhanh cả ngày'}</h3>
<p>${en
    ? 'An index is what a book’s index is: instead of reading every page to find “Find Usages”, you look up the word and get page numbers. IntelliJ reads every source file and every jar once and stores a map “name → places”. That is why Search Everywhere answers in milliseconds on a 5,000-file project. The price: indexing on first open, after a big <code>git pull</code>, and after a JDK change. JetBrains also downloads <em>shared indexes</em> for the JDK and popular libraries so this part is faster.'
    : 'Chỉ mục giống mục lục cuối sách: thay vì đọc từng trang để tìm “Find Usages”, bạn tra từ khoá và có ngay số trang. IntelliJ đọc mọi file nguồn và mọi file jar một lần, lưu thành bản đồ “tên → các chỗ xuất hiện”. Nhờ vậy Search Everywhere trả lời trong vài mili giây trên dự án 5.000 file. Cái giá: phải lập chỉ mục khi mở lần đầu, sau khi <code>git pull</code> nhiều thay đổi, và sau khi đổi JDK. JetBrains còn tải sẵn <em>shared indexes</em> (chỉ mục dùng chung) cho JDK và thư viện phổ biến để phần này nhanh hơn.'}</p>
<ul>
<li>${en ? 'Folders you never search (build output, generated files, a huge <code>node_modules</code> of a frontend inside the repo): right-click → <em>Mark Directory as → Excluded</em>. Smaller index, faster search, fewer false results.' : 'Thư mục bạn không bao giờ tìm trong đó (kết quả build, file sinh tự động, một <code>node_modules</code> to đùng của frontend nằm chung repo): chuột phải → <em>Mark Directory as → Excluded</em>. Chỉ mục nhỏ hơn, tìm nhanh hơn, ít kết quả rác hơn.'}</li>
<li>${en ? 'Do not work during dumb mode and then conclude “IntelliJ cannot find this class” — wait for the progress bar.' : 'Đừng làm việc giữa lúc dumb mode rồi kết luận “IntelliJ không tìm thấy class này” — chờ thanh tiến trình chạy xong.'}</li>
</ul>

<h3>${en ? 'After editing pom.xml: reload, do not restart' : 'Sau khi sửa pom.xml: nạp lại, đừng khởi động lại'}</h3>
<p>${en
    ? 'When you add a dependency, a small Maven/Gradle icon appears in the top-right corner of the editor: <em>Load Maven Changes</em> (<code>Ctrl+Shift+O</code>/<code>⇧⌘I</code>). Click it or press the key. In the Maven tool window (right edge) the circular-arrows button is <em>Reload All Maven Projects</em>. You can enable auto-reload in <em>Settings → Build Tools → Reload project after changes in the build scripts</em>, but most teams keep it manual so a half-typed <code>pom.xml</code> does not trigger a download storm.'
    : 'Khi thêm một thư viện, góc trên bên phải editor hiện một biểu tượng Maven/Gradle nhỏ: <em>Load Maven Changes</em> (<code>Ctrl+Shift+O</code>/<code>⇧⌘I</code>). Bấm nó hoặc bấm phím. Trong cửa sổ Maven (mép phải), nút hai mũi tên xoay vòng là <em>Reload All Maven Projects</em>. Bạn có thể bật tự nạp ở <em>Settings → Build Tools → Reload project after changes in the build scripts</em>, nhưng nhiều nhóm để tay để một <code>pom.xml</code> đang gõ dở không kích hoạt cả trận tải thư viện.'}</p>

<h3>${en ? 'The order of fixes for “red everywhere”' : 'Thứ tự sửa khi “đỏ khắp nơi”'}</h3>
<div class="lz-flow">
  <div class="lz-step"><strong>1.</strong> ${en ? 'Is indexing finished? Is the opened folder the one with <code>pom.xml</code>?' : 'Đã lập chỉ mục xong chưa? Thư mục đang mở có phải thư mục chứa <code>pom.xml</code>?'}</div>
  <div class="lz-step"><strong>2.</strong> ${en ? '<em>Project Structure → SDK</em>: is there a JDK, and is it ≥ <code>java.version</code>?' : '<em>Project Structure → SDK</em>: đã có JDK chưa, và có ≥ <code>java.version</code>?'}</div>
  <div class="lz-step"><strong>3.</strong> ${en ? 'Reload Maven/Gradle. Read the <em>Build</em> / <em>Sync</em> tool window — the real error is there.' : 'Nạp lại Maven/Gradle. Đọc cửa sổ <em>Build</em> / <em>Sync</em> — lỗi thật nằm ở đó.'}</div>
  <div class="lz-step"><strong>4.</strong> ${en ? 'Run the build in the terminal: <code>./mvnw -U compile</code>. If it fails there too, it is not an IDE problem.' : 'Chạy build trong terminal: <code>./mvnw -U compile</code>. Terminal cũng lỗi thì không phải chuyện của IDE.'}</div>
  <div class="lz-step"><strong>5.</strong> ${en ? 'Only now: <em>File → Repair IDE</em> (guided steps), and last <em>File → Invalidate Caches… → Invalidate and Restart</em>.' : 'Tới đây mới: <em>File → Repair IDE</em> (các bước có hướng dẫn), và cuối cùng <em>File → Invalidate Caches… → Invalidate and Restart</em>.'}</div>
</div>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Invalidate Caches is not a magic button' : 'Invalidate Caches không phải nút thần'}</strong></p><p>${en
    ? 'It throws away the index and re-builds it — ten minutes on a big project — and fixes only a corrupted cache. It does nothing for a wrong JDK, a missing dependency or a blocked repository, which are 90% of cases. Seniors notice when a newcomer “fixes” everything by invalidating caches: the same problem comes back on the next pull.'
    : 'Nó xoá chỉ mục rồi dựng lại — mười phút với dự án lớn — và chỉ chữa được bộ nhớ đệm bị hỏng. Nó không làm gì được với JDK sai, thư viện thiếu hay kho thư viện bị chặn — tức 90% trường hợp. Senior để ý ngay khi người mới “sửa” mọi thứ bằng Invalidate Caches: lần pull sau lỗi lại quay về.'}</p></div>

<h3>${en ? '💼 At work: the company network blocks Maven Central' : '💼 Đi làm: mạng công ty chặn Maven Central'}</h3>
<p>${en
    ? 'Outsourcing companies often do not let laptops download from the Internet directly. Libraries come from an internal repository manager (Nexus or Artifactory) configured in <code>~/.m2/settings.xml</code>, sometimes behind an HTTP proxy. On day one, ask your mentor for the team’s <code>settings.xml</code> — do not try to “get around” the network. IntelliJ uses the same file (<em>Settings → Build Tools → Maven → User settings file</em>). If the internal repository is unreachable you get this (real output, with the repository simulated by a closed port):'
    : 'Công ty outsourcing thường không cho laptop tải thẳng từ Internet. Thư viện đi qua kho nội bộ (Nexus hoặc Artifactory) khai trong <code>~/.m2/settings.xml</code>, đôi khi thêm proxy HTTP. Ngày đầu, xin mentor file <code>settings.xml</code> của nhóm — đừng tìm cách “lách” mạng. IntelliJ dùng đúng file đó (<em>Settings → Build Tools → Maven → User settings file</em>). Nếu kho nội bộ không tới được, bạn sẽ thấy như sau (output thật, kho được mô phỏng bằng một cổng đóng):'}</p>
${SETTINGS_MIRROR}
${MIRROR_LOI}
<p>${en
    ? 'Two details worth knowing: <code>(absent)</code> means Maven has <em>remembered</em> the failure in <code>~/.m2</code> and will not retry until the update interval passes — add <code>-U</code> (or tick <em>Always update snapshots</em>) once the network is fixed. And <code>Connection refused</code> versus <code>Connect timed out</code> tells you whether the host answered “no” or did not answer at all (proxy/firewall) — useful when you write to IT.'
    : 'Hai chi tiết nên biết: <code>(absent)</code> nghĩa là Maven đã <em>ghi nhớ</em> lần thất bại trong <code>~/.m2</code> và sẽ không thử lại cho tới hết chu kỳ cập nhật — thêm <code>-U</code> (hoặc tích <em>Always update snapshots</em>) sau khi mạng đã ổn. Còn <code>Connection refused</code> khác <code>Connect timed out</code>: một bên là máy chủ trả lời “không”, một bên là không ai trả lời (proxy/tường lửa) — thông tin quý khi bạn viết cho bộ phận IT.'}</p>

<h3>${en ? 'The hacker’s view: importing a project runs its code' : 'Góc hacker: import dự án là chạy mã của nó'}</h3>
<p>${en
    ? 'A Gradle build script is a program. Maven plugins are programs. When IntelliJ imports a project it asks Gradle/Maven for the model — and that executes the build script with <strong>your</strong> permissions, before you press Run. Below is a harmless script from a fake “coding test”; the real attacks documented by GitLab and others in the <em>Contagious Interview</em> campaign (2023–2025, lesson 1.4) put a downloader exactly here.'
    : 'Script build của Gradle là một chương trình. Plugin của Maven là chương trình. Khi IntelliJ import dự án, nó hỏi Gradle/Maven lấy mô hình — tức là chạy script build với quyền <strong>của bạn</strong>, trước cả khi bạn bấm Run. Dưới đây là một script vô hại trong “bài test tuyển dụng” giả; các vụ tấn công thật được GitLab và nhiều hãng ghi nhận trong chiến dịch <em>Contagious Interview</em> (2023–2025, bài 1.4) đặt trình tải mã độc đúng chỗ này.'}</p>
${BAY_GRADLE}
${BAY_GRADLE_OUT}
<p>${en
    ? 'Run on your laptop, the same line would list <code>.ssh</code>, <code>.aws</code>, <code>.gitconfig</code>… and could just as easily upload them. That is why recent IntelliJ versions show <em>Trust Project</em> / <em>Preview in Safe Mode</em>: in Safe Mode it does not import the build or run anything, you can still read every file. Read <code>build.gradle</code>, <code>settings.gradle</code>, <code>gradle/wrapper/gradle-wrapper.properties</code> (where does the wrapper download Gradle from?) and the <code>&lt;plugins&gt;</code> of <code>pom.xml</code> first; trust only after that.'
    : 'Chạy trên laptop của bạn, đúng dòng đó sẽ liệt kê <code>.ssh</code>, <code>.aws</code>, <code>.gitconfig</code>… và gửi chúng đi cũng dễ như vậy. Vì thế các bản IntelliJ gần đây đều hỏi <em>Trust Project</em> / <em>Preview in Safe Mode</em>: ở Safe Mode nó không import build, không chạy gì, bạn vẫn đọc được mọi file. Đọc trước <code>build.gradle</code>, <code>settings.gradle</code>, <code>gradle/wrapper/gradle-wrapper.properties</code> (wrapper tải Gradle từ đâu?) và phần <code>&lt;plugins&gt;</code> của <code>pom.xml</code>; đọc xong mới tin.'}</p>

<h3>${en ? '🧪 Practice (25 minutes) — prepare gear-mini for this chapter' : '🧪 Thực hành (25 phút) — chuẩn bị gear-mini cho chương này'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Save the script below as <code>~/do-nghe/tao-gear-ch2.sh</code> and run it inside <code>gear-mini</code> (Windows: from Git Bash). It adds a small “lab equipment loan” feature: controller → service → repository, an interface with two implementations, a profile file and three tests.' : 'Lưu script dưới đây thành <code>~/do-nghe/tao-gear-ch2.sh</code> rồi chạy trong <code>gear-mini</code> (Windows: chạy trong Git Bash). Nó thêm tính năng nhỏ “mượn thiết bị phòng lab”: controller → service → repository, một interface có hai lớp cài đặt, một file profile và ba test.'}</li>
</ol>
${TAO_CH2_CHAY}
${TAO_CH2_OUT}
<details><summary>${en ? 'tao-gear-ch2.sh — click to open (≈200 lines, copy all of it)' : 'tao-gear-ch2.sh — bấm để mở (≈200 dòng, chép toàn bộ)'}</summary>
${bash(TAO_CH2)}
</details>
<ol start="2">
<li>${en ? 'Open <code>gear-mini</code> in IntelliJ, choose <em>Trust Project</em> (you created it). Wait for indexing to finish.' : 'Mở <code>gear-mini</code> bằng IntelliJ, chọn <em>Trust Project</em> (bạn tự tạo). Chờ lập chỉ mục xong.'}</li>
<li>${en ? 'Break it on purpose: <em>Project Structure → SDK</em>, pick a JDK 17 if you have one (or <em>Download JDK → 17</em>). Build (<code>Ctrl+F9</code>/<code>⌘F9</code>) and read the message. Switch back to 21 and build again.' : 'Cố tình làm hỏng: <em>Project Structure → SDK</em>, chọn JDK 17 nếu có (hoặc <em>Download JDK → 17</em>). Build (<code>Ctrl+F9</code>/<code>⌘F9</code>) và đọc thông báo. Chuyển lại 21 rồi build lần nữa.'}</li>
<li>${en ? 'Add a dependency to <code>pom.xml</code> (for example <code>spring-boot-starter-actuator</code> without a version), watch the reload icon appear, press <code>Ctrl+Shift+O</code>/<code>⇧⌘I</code>, then remove it and reload again.' : 'Thêm một dependency vào <code>pom.xml</code> (ví dụ <code>spring-boot-starter-actuator</code>, không ghi version), nhìn biểu tượng nạp lại hiện lên, bấm <code>Ctrl+Shift+O</code>/<code>⇧⌘I</code>, rồi xoá nó đi và nạp lại.'}</li>
<li>${en ? 'In the terminal, compare what the IDE and the terminal use: <code>java -version</code> and <code>./mvnw -v</code>. Write down if they differ.' : 'Trong terminal, so IDE và terminal đang dùng gì: <code>java -version</code> và <code>./mvnw -v</code>. Ghi lại nếu chúng khác nhau.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the script printed <code>Da them 11 file Java cho Chuong 2</code>; you saw and fixed the “release version 21 not supported” error yourself; the reload icon appeared and disappeared; and you can say which JDK your terminal uses.' : 'script in ra <code>Da them 11 file Java cho Chuong 2</code>; bạn tự gặp và tự sửa lỗi “release version 21 not supported”; biểu tượng nạp lại hiện rồi tắt; và bạn nói được terminal của mình đang dùng JDK nào.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Project SDK</span><span class="v">${en ? 'The JDK IntelliJ compiles and runs the project with.' : 'JDK mà IntelliJ dùng để biên dịch và chạy dự án.'}</span></div>
  <div class="kv"><span class="k">Language level</span><span class="v">${en ? 'Highest Java syntax the editor accepts.' : 'Mức cú pháp Java cao nhất editor chấp nhận.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Import / reload' : 'Import / nạp lại (reload)'}</span><span class="v">${en ? 'IDE reads pom.xml/build.gradle and rebuilds its model.' : 'IDE đọc pom.xml/build.gradle và dựng lại mô hình của nó.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Index / dumb mode' : 'Index (chỉ mục) / dumb mode'}</span><span class="v">${en ? 'Searchable map of the code; dumb mode = while it is being built.' : 'Bản đồ tra cứu mã; dumb mode = lúc đang dựng bản đồ đó.'}</span></div>
  <div class="kv"><span class="k">Toolchain (Gradle)</span><span class="v">${en ? 'The JDK version the build requires, independent of the JDK running Gradle.' : 'Phiên bản JDK build yêu cầu, tách khỏi JDK đang chạy Gradle.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Mirror / Nexus' : 'Mirror / Nexus (kho nội bộ)'}</span><span class="v">${en ? 'Company repository that replaces Maven Central, set in settings.xml.' : 'Kho thư viện của công ty thay cho Maven Central, khai trong settings.xml.'}</span></div>
  <div class="kv"><span class="k">Safe Mode</span><span class="v">${en ? 'Open a project without importing or running its build scripts.' : 'Mở dự án mà không import, không chạy script build.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'The build file is the truth; the IDE copies it. Fix dependencies in pom.xml/build.gradle, then reload.' : 'File build là sự thật; IDE chỉ chép lại. Sửa thư viện trong pom.xml/build.gradle rồi nạp lại.'}</li>
<li>${en ? 'Project SDK ≥ the build’s Java version; terminal JAVA_HOME may differ from the IDE.' : 'Project SDK ≥ phiên bản Java của build; JAVA_HOME của terminal có thể khác IDE.'}</li>
<li>${en ? '“release version N not supported” = compiler too old: change the JDK, not the project.' : '“release version N not supported” = trình biên dịch cũ quá: đổi JDK, không đổi dự án.'}</li>
<li>${en ? 'Fix order: indexing → SDK → reload → terminal build → Repair IDE → Invalidate Caches.' : 'Thứ tự sửa: chỉ mục → SDK → nạp lại → build trong terminal → Repair IDE → Invalidate Caches.'}</li>
<li>${en ? 'Importing runs build scripts: unknown projects open in Safe Mode first.' : 'Import là chạy script build: dự án lạ mở ở Safe Mode trước.'}</li>
</ul>
${tl('https://www.jetbrains.com/help/idea/maven-support.html', '📘', 'IntelliJ IDEA Docs — Maven', en ? 'Import, reload, Maven tool window, settings.xml' : 'Import, nạp lại, cửa sổ Maven, settings.xml')}
${tl('https://www.jetbrains.com/help/idea/sdk.html', '☕', 'IntelliJ IDEA Docs — SDKs', en ? 'Project SDK, Download JDK, language level' : 'Project SDK, Download JDK, language level')}
${tl('https://www.jetbrains.com/help/idea/project-security.html', '🔒', 'IntelliJ IDEA Docs — Project security', en ? 'Trust Project and Safe Mode' : 'Trust Project và Safe Mode')}
${tl('https://docs.gradle.org/current/userguide/toolchains.html', '🐘', 'Gradle — Toolchains for JVM projects', en ? 'Why the build JDK is separate from the Gradle JDK' : 'Vì sao JDK của build tách khỏi JDK chạy Gradle')}
</div>
`;

/* ═════════════ 2.2 — Điều hướng ═════════════ */
const P_TIM_IJ = [
  ['Search Everywhere (classes, files, symbols, actions, text)', 'Search Everywhere (class, file, symbol, lệnh, chữ)', 'Shift Shift', '⇧⇧'],
  ['Go to Class', 'Đi tới class', 'Ctrl+N', '⌘O'],
  ['Go to File', 'Đi tới file', 'Ctrl+Shift+N', '⇧⌘O'],
  ['Go to Symbol (method, field…)', 'Đi tới symbol (method, field…)', 'Ctrl+Alt+Shift+N', '⌥⌘O'],
  ['Find Action (any menu command)', 'Find Action (mọi lệnh trong menu)', 'Ctrl+Shift+A', '⇧⌘A'],
  ['Recent Files', 'File mở gần đây', 'Ctrl+E', '⌘E'],
  ['Recent Locations (code snippets you visited)', 'Vị trí gần đây (đoạn mã vừa ghé)', 'Ctrl+Shift+E', '⇧⌘E'],
  ['Find in Files (text, with scope and regex)', 'Tìm chữ trong mọi file (có phạm vi, regex)', 'Ctrl+Shift+F', '⇧⌘F'],
  ['Go to Line:Column', 'Đi tới dòng:cột', 'Ctrl+G', '⌘L'],
];
const P_NHAY = [
  ['Go to Declaration (or usages if already on it)', 'Đi tới khai báo (đang ở khai báo thì liệt kê nơi dùng)', 'Ctrl+B / Ctrl+Click', '⌘B / ⌘Click'],
  ['Go to Implementation(s)', 'Đi tới lớp/hàm cài đặt', 'Ctrl+Alt+B', '⌥⌘B'],
  ['Go to Super Method / Class', 'Đi tới hàm/lớp cha', 'Ctrl+U', '⌘U'],
  ['Find Usages (tool window, grouped)', 'Find Usages (cửa sổ, có nhóm)', 'Alt+F7', '⌥F7'],
  ['Show Usages (quick popup)', 'Show Usages (cửa sổ nổi nhanh)', 'Ctrl+Alt+F7', '⌥⌘F7'],
  ['Highlight usages in this file', 'Tô sáng nơi dùng trong file này', 'Ctrl+Shift+F7', '⇧⌘F7'],
  ['Call Hierarchy (who calls / what it calls)', 'Call Hierarchy (ai gọi / nó gọi ai)', 'Ctrl+Alt+H', '⌃⌥H'],
  ['Type Hierarchy (parents and children of a class)', 'Type Hierarchy (cha và con của một class)', 'Ctrl+H', '⌃H'],
  ['File Structure (methods of this file)', 'File Structure (các method của file này)', 'Ctrl+F12', '⌘F12'],
  ['Quick Definition (peek, no jump)', 'Xem nhanh định nghĩa (không nhảy)', 'Ctrl+Shift+I', '⌥Space'],
  ['Quick Documentation', 'Xem nhanh tài liệu', 'Ctrl+Q', 'F1'],
  ['Back / Forward', 'Quay lại / Đi tiếp', 'Ctrl+Alt+← / Ctrl+Alt+→', '⌘⌥← / ⌘⌥→'],
  ['Last Edit Location', 'Chỗ vừa sửa gần nhất', 'Ctrl+Shift+Backspace', '⇧⌘⌫'],
  ['Next / previous error', 'Lỗi kế / lỗi trước', 'F2 / Shift+F2', 'F2 / ⇧F2'],
  ['Select current file in Project view', 'Chọn file đang mở trong cây Project', 'Alt+F1, then 1', '⌥F1, rồi 1'],
];
const SE_GO = out(`
Gõ trong Search Everywhere (Shift Shift / ⇧⇧)     Kết quả
GSer                          GearService — CamelHumps: chữ hoa đầu mỗi từ
gear serv                     GearService — gõ cách vẫn khớp
GearService:30                mở GearService và nhảy tới dòng 30
*Policy                       LoanPolicy, StudentPolicy, LecturerPolicy
gear/Gear.java                đúng file Gear.java trong thư mục gear (lọc theo đường dẫn)
reformat                      tab Actions: lệnh "Reformat Code" — kèm phím tắt của nó
dang duoc                     tab Text: dòng GearService.java:24 có chuỗi thông báo lỗi
`);
const CALL_H = out(`
Call Hierarchy của GearService.borrow (Ctrl+Alt+H / ⌃⌥H) — chiều "Callers" (ai gọi nó):
borrow(long, String) — com.labflow.gear.gear.GearService
 ├─ borrow(long, String) — GearController          ← nút endpoint POST /api/gears/{id}/borrow
 ├─ muonQuaHanMucBiTuChoi() — GearServiceTest      ← 2 lời gọi thẳng + 1 trong lambda của assertThrows
 └─ muonDoDangCoNguoiMuonBiTuChoi() — GearServiceTest ← trong lambda của assertThrows
Đổi sang chiều "Callees" (nó gọi ai):
borrow(long, String)
 ├─ findById(long) — GearRepository
 ├─ available() — Gear
 ├─ findAll() — GearRepository
 └─ save(Gear) — GearRepository
`);
const TYPE_H = out(`
Type Hierarchy của LoanPolicy (Ctrl+H / ⌃H):
Object
 └─ LoanPolicy (interface)
     ├─ LecturerPolicy
     └─ StudentPolicy
`);
const RG_AVAIL = bash(`
# Tìm CHỮ "available()" trong gear-mini — ba method khác nhau trộn lẫn:
cd ~/do-nghe/gear-mini && rg -n "available\\(\\)" src
`);
const RG_AVAIL_OUT = out(`
src/test/java/com/labflow/gear/gear/GearServiceTest.java:13:        assertEquals(3, service.available().size());
src/main/java/com/labflow/gear/gear/GearService.java:17:    public List<Gear> available() {
src/main/java/com/labflow/gear/gear/GearService.java:23:        if (!g.available()) {
src/main/java/com/labflow/gear/gear/GearController.java:25:    public List<Gear> available() {
src/main/java/com/labflow/gear/gear/GearController.java:26:        return service.available();
src/main/java/com/labflow/gear/gear/Gear.java:4:    public boolean available() {
`);
const DAP_22 = (en) => `
<ol>
<li><code>GearController.borrow</code> → <code>GearService.borrow</code> → <code>GearRepository.findById</code> / <code>findAll</code> / <code>save</code> → <code>InMemoryGearRepository</code> — ${en ? 'Ctrl+B/⌘B on each call, then Ctrl+Alt+B/⌥⌘B on the interface method' : 'Ctrl+B/⌘B trên từng lời gọi, rồi Ctrl+Alt+B/⌥⌘B trên method của interface'}</li>
<li>${en ? 'One: <code>InMemoryGearRepository</code> — Ctrl+Alt+B/⌥⌘B on <code>GearRepository</code>' : 'Một: <code>InMemoryGearRepository</code> — Ctrl+Alt+B/⌥⌘B trên <code>GearRepository</code>'}</li>
<li>${en ? 'Two: <code>StudentPolicy</code> (7 days), <code>LecturerPolicy</code> (30 days) — Ctrl+H/⌃H' : 'Hai: <code>StudentPolicy</code> (7 ngày), <code>LecturerPolicy</code> (30 ngày) — Ctrl+H/⌃H'}</li>
<li><code>GearService.java</code> ${en ? 'line' : 'dòng'} 24 — ${en ? 'Search Everywhere, Text tab: <code>dang duoc</code>' : 'Search Everywhere, tab Text: <code>dang duoc</code>'}</li>
<li>${en ? 'Exactly one production caller, <code>GearController.available()</code>, plus the test — Alt+F7/⌥F7 on <code>GearService.available</code>; text search would also show <code>Gear.available()</code> and the controller’s own declaration' : 'Đúng một chỗ gọi trong mã chính là <code>GearController.available()</code>, cộng một chỗ trong test — Alt+F7/⌥F7 trên <code>GearService.available</code>; tìm chữ sẽ lẫn cả <code>Gear.available()</code> và chính khai báo của controller'}</li>
<li>${en ? '<code>application.properties</code> (2), <code>application-dev.properties</code> (5), default in <code>@Value</code> (2) — Find in Files <code>max-loans</code>' : '<code>application.properties</code> (2), <code>application-dev.properties</code> (5), mặc định trong <code>@Value</code> (2) — Find in Files <code>max-loans</code>'}</li>
<li>${en ? '<code>GearController</code> and <code>StartupLog</code> (and <code>GearServiceTest</code> builds one by hand) — Alt+F7/⌥F7 on the constructor of <code>GearService</code> shows only the test; Spring creates the bean by reflection, so ask “who injects it”: Find Usages on the <em>class</em> → <code>GearController</code>, <code>StartupLog</code>' : '<code>GearController</code> và <code>StartupLog</code> (và <code>GearServiceTest</code> tự <code>new</code> một cái) — Alt+F7/⌥F7 trên constructor của <code>GearService</code> chỉ thấy test; Spring tạo bean bằng reflection, nên hỏi “ai tiêm nó vào”: Find Usages trên <em>class</em> → <code>GearController</code>, <code>StartupLog</code>'}</li>
<li>${en ? 'Ctrl+Shift+Backspace/⇧⌘⌫ (last edit location), or Ctrl+Shift+E/⇧⌘E' : 'Ctrl+Shift+Backspace/⇧⌘⌫ (chỗ vừa sửa), hoặc Ctrl+Shift+E/⇧⌘E'}</li>
</ol>
`;
const L2 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · IntelliJ IDEA' : 'Chương 2 · IntelliJ IDEA'}</span>
<h2>${en ? '2.2 — Navigation: Search Everywhere, Find Usages, Call and Type Hierarchy' : '2.2 — Điều hướng: Search Everywhere, Find Usages, Call và Type Hierarchy'}</h2>
<p class="lead">${en
    ? 'A Spring Boot project at a real company has hundreds of classes in a dozen packages, and you did not write any of them. Your first tickets are mostly questions: “where is this error message thrown?”, “who calls this method?”, “which class actually implements this interface?”. IntelliJ answers each of them with one key, because it understands Java — not just text. This lesson is the Java counterpart of lesson 1.1.'
    : 'Dự án Spring Boot ở công ty thật có hàng trăm class trong cả chục package, và không class nào do bạn viết. Các ticket đầu tiên của bạn phần lớn là câu hỏi: “thông báo lỗi này ném ra ở đâu?”, “ai gọi method này?”, “class nào thực sự cài đặt interface này?”. IntelliJ trả lời mỗi câu bằng một phím, vì nó hiểu Java — không chỉ hiểu chữ. Bài này là bản Java của bài 1.1.'}</p>

<h3>${en ? 'One door for everything: Search Everywhere' : 'Một cửa cho mọi thứ: Search Everywhere'}</h3>
<p>${en
    ? 'Press <code>Shift</code> twice. The popup has tabs — <em>All, Classes, Files, Symbols, Actions, Text</em> — and <code>Tab</code> moves between them. Each tab also has its own direct shortcut (table below). You do not need exact names: IntelliJ matches <strong>CamelHumps</strong> (the capital letters of each word) and words in any order.'
    : 'Bấm <code>Shift</code> hai lần. Cửa sổ nổi có các tab — <em>All, Classes, Files, Symbols, Actions, Text</em> — và <code>Tab</code> để chuyển qua lại. Mỗi tab cũng có phím tắt riêng (bảng dưới). Không cần gõ đúng tên: IntelliJ khớp theo <strong>CamelHumps</strong> (chữ hoa đầu mỗi từ) và các từ theo thứ tự bất kỳ.'}</p>
${phim(P_TIM_IJ, !en)}
${SE_GO}
<div class="callout ok"><p>${en
    ? '<strong>Find Action is the shortcut for shortcuts.</strong> Forgot a key? <code>Ctrl+Shift+A</code>/<code>⇧⌘A</code>, type what you want (“optimize imports”, “split vertically”, “show bytecode”) and the result shows the key next to it. Pressing it a few times is how you memorise a shortcut without a cheat sheet.'
    : '<strong>Find Action là phím tắt của mọi phím tắt.</strong> Quên phím? <code>Ctrl+Shift+A</code>/<code>⇧⌘A</code>, gõ việc muốn làm (“optimize imports”, “split vertically”, “show bytecode”) và kết quả hiện kèm phím của nó. Dùng vài lần là thuộc phím mà không cần bảng tra.'}</p></div>

<h3>${en ? 'Jumping through code that IntelliJ understands' : 'Nhảy trong mã mà IntelliJ hiểu'}</h3>
${phim(P_NHAY, !en)}
<p>${en
    ? 'Three of these do work that text search cannot do reliably:'
    : 'Ba phím trong số đó làm được việc mà tìm chữ không làm đáng tin được:'}</p>
<ul>
<li><strong>${en ? 'Go to Implementation' : 'Go to Implementation'}</strong> — ${en ? 'Spring code is full of interfaces (<code>GearRepository</code>, <code>JpaRepository</code>, <code>UserDetailsService</code>). <code>Ctrl+B</code> on <code>repo.findById</code> takes you to the <em>interface</em>, which has no body. <code>Ctrl+Alt+B</code>/<code>⌥⌘B</code> takes you to the class that runs.' : 'mã Spring đầy interface (<code>GearRepository</code>, <code>JpaRepository</code>, <code>UserDetailsService</code>). <code>Ctrl+B</code> trên <code>repo.findById</code> đưa bạn tới <em>interface</em> — không có thân hàm. <code>Ctrl+Alt+B</code>/<code>⌥⌘B</code> đưa tới class thực sự chạy.'}</li>
<li><strong>Find Usages</strong> — ${en ? 'finds calls to <em>this</em> method, not to every method with the same name. The results are grouped (production vs test, read vs write for fields) and you can exclude what you have checked. Below, text search for <code>available()</code> mixes three unrelated methods:' : 'tìm lời gọi tới <em>đúng</em> method này, không phải mọi method trùng tên. Kết quả được nhóm (mã chính / test, đọc / ghi với field) và bạn loại được những dòng đã kiểm. Dưới đây, tìm chữ <code>available()</code> trộn lẫn ba method không liên quan:'}</li>
</ul>
${RG_AVAIL}
${RG_AVAIL_OUT}
<p>${en
    ? 'Six lines, three different methods: <code>Gear.available()</code> (is this item free?), <code>GearService.available()</code> (list free items) and <code>GearController.available()</code> (the HTTP endpoint). Find Usages on <code>GearService.available</code> returns exactly two: the controller and the test.'
    : 'Sáu dòng, ba method khác nhau: <code>Gear.available()</code> (món này còn trống không?), <code>GearService.available()</code> (liệt kê món trống) và <code>GearController.available()</code> (endpoint HTTP). Find Usages trên <code>GearService.available</code> trả về đúng hai: controller và test.'}</p>
<ul>
<li><strong>Call Hierarchy</strong> — ${en ? 'a tree of callers (who reaches this method, all the way up to the controller) or callees (what this method touches, down to the repository). This is how you read the path of one request without opening ten files:' : 'cây những nơi gọi (ai đi tới method này, ngược lên tận controller) hoặc những thứ nó gọi (method này chạm gì, xuống tận repository). Đây là cách đọc đường đi của một request mà không mở mười file:'}</li>
</ul>
${CALL_H}
${TYPE_H}
<p class="text-sm">${en ? 'The two trees above are what the panels show on <code>gear-mini</code>, written out as text (the panel draws the same tree with icons).' : 'Hai cây trên là nội dung các bảng hiện ra với <code>gear-mini</code>, chép lại dạng chữ (bảng thật vẽ đúng cây đó kèm biểu tượng).'}</p>

<h3>${en ? 'Where Java understanding stops' : 'Chỗ mà “hiểu Java” dừng lại'}</h3>
<p>${en
    ? 'IntelliJ’s Java model does not see everything a Spring application connects at runtime. Know the gaps and fill them with text search (Find in Files, <code>Ctrl+Shift+F</code>/<code>⇧⌘F</code>):'
    : 'Mô hình Java của IntelliJ không thấy hết những gì ứng dụng Spring nối với nhau lúc chạy. Biết các chỗ hổng đó và lấp bằng tìm chữ (Find in Files, <code>Ctrl+Shift+F</code>/<code>⇧⌘F</code>):'}</p>
<table>
<thead><tr><th>${en ? 'Question' : 'Câu hỏi'}</th><th>${en ? 'Why Find Usages is not enough' : 'Vì sao Find Usages chưa đủ'}</th><th>${en ? 'What to do' : 'Làm gì'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Who sends <code>POST /api/gears/1/borrow</code>?' : 'Ai gửi <code>POST /api/gears/1/borrow</code>?'}</td><td>${en ? 'The caller is a browser or another service — a URL string, not a Java call.' : 'Bên gọi là trình duyệt hay service khác — một chuỗi URL, không phải lời gọi Java.'}</td><td>${en ? 'Find in Files <code>/api/gears</code> in the frontend too; Ultimate has the <em>Endpoints</em> tool window.' : 'Find in Files <code>/api/gears</code> cả bên frontend; bản Ultimate có cửa sổ <em>Endpoints</em>.'}</td></tr>
<tr><td>${en ? 'Where is <code>gear.max-loans</code> set?' : '<code>gear.max-loans</code> được đặt ở đâu?'}</td><td>${en ? 'A string in <code>@Value</code> and in <code>.properties</code> files (plus environment variables at runtime).' : 'Là một chuỗi trong <code>@Value</code> và trong file <code>.properties</code> (cộng biến môi trường lúc chạy).'}</td><td>${en ? 'Find in Files <code>max-loans</code>; Ultimate links the key to its files with <code>Ctrl+B</code>. Lesson 2.4 shows the order Spring applies them.' : 'Find in Files <code>max-loans</code>; bản Ultimate nối khoá với file bằng <code>Ctrl+B</code>. Bài 2.4 cho thấy Spring áp chúng theo thứ tự nào.'}</td></tr>
<tr><td>${en ? 'Who creates <code>GearService</code>?' : 'Ai tạo <code>GearService</code>?'}</td><td>${en ? 'Spring, by reflection — Find Usages on the constructor shows only tests.' : 'Spring, bằng reflection — Find Usages trên constructor chỉ thấy test.'}</td><td>${en ? 'Find Usages on the <em>class</em> to see who injects it; Ultimate shows bean icons in the gutter.' : 'Find Usages trên <em>class</em> để xem ai tiêm nó; bản Ultimate hiện biểu tượng bean bên lề.'}</td></tr>
</tbody>
</table>

<h3>${en ? 'Keymaps: Windows/Linux, macOS — and the VS Code trap' : 'Keymap: Windows/Linux, macOS — và cái bẫy VS Code'}</h3>
<p>${en
    ? '<em>Settings → Keymap</em> shows which keymap is active. On a Mac it is “macOS”; on Windows and Linux it is “Windows” / “Linux” (Linux equals Windows except for a few keys the desktop steals). There is a <em>VS Code</em> keymap plugin, and it is tempting. Recommendation: <strong>learn the default keymap</strong>. JetBrains documentation, colleagues pairing at your desk, and every tutorial use it; and when you sit at a shared or new machine on the first day of work, it is what you get. If a desktop shortcut steals one (on Linux, <code>Ctrl+Alt+←</code> often switches workspace), remap only that one.'
    : '<em>Settings → Keymap</em> cho biết đang dùng keymap nào. Trên Mac là “macOS”; trên Windows và Linux là “Windows” / “Linux” (Linux giống Windows trừ vài phím bị môi trường desktop chiếm). Có plugin keymap <em>VS Code</em>, và rất dễ bị cám dỗ. Khuyên: <strong>học keymap mặc định</strong>. Tài liệu JetBrains, đồng nghiệp ngồi pair cạnh bạn, và mọi bài hướng dẫn đều dùng nó; ngày đầu đi làm ngồi vào máy chung hay máy mới, thứ bạn có cũng là nó. Nếu desktop chiếm mất một phím (trên Linux <code>Ctrl+Alt+←</code> hay bị dùng để đổi workspace), chỉ đổi đúng phím đó.'}</p>
<div class="callout ok"><p>${en
    ? '<strong>Learning trick:</strong> when you click a menu item that has a shortcut, IntelliJ can tell you so. Install the plugin <em>Key Promoter X</em> for two weeks: every mouse action shows a small note “you could have pressed …” and counts how often. Uninstall it when the notes stop appearing.'
    : '<strong>Mẹo học:</strong> khi bạn bấm chuột vào một mục có phím tắt, IntelliJ có thể nhắc bạn. Cài plugin <em>Key Promoter X</em> trong hai tuần: mỗi lần dùng chuột nó hiện ghi chú nhỏ “lẽ ra bấm …” và đếm số lần. Gỡ đi khi ghi chú không còn xuất hiện.'}</p></div>

<h3>${en ? '💼 At work: the ticket that only has an error message' : '💼 Đi làm: ticket chỉ có một câu báo lỗi'}</h3>
<p>${en
    ? 'Ticket: “User reports: <em>Arduino Uno R3 dang duoc an.nv muon</em> but the board is on the shelf.” Senior workflow, all on the keyboard: Search Everywhere → Text tab → <code>dang duoc</code> → <code>GearService.java:24</code>. <code>Ctrl+Alt+H</code>/<code>⌃⌥H</code> on <code>borrow</code> to see who calls it; <code>Ctrl+B</code> on <code>g.available()</code> to see the rule (<code>borrower == null</code>); <code>Ctrl+Alt+B</code> on <code>repo.save</code> to see where “borrower” is stored. You now know the bug is in data, not in the check — two minutes, ten files never opened. Search for the <em>stable</em> part of a message: the text around variables (<code>dang duoc</code>), not the variable part (<code>Arduino</code>).'
    : 'Ticket: “Người dùng báo: <em>Arduino Uno R3 dang duoc an.nv muon</em> nhưng bo mạch vẫn nằm trên kệ.” Cách senior làm, toàn bằng bàn phím: Search Everywhere → tab Text → <code>dang duoc</code> → <code>GearService.java:24</code>. <code>Ctrl+Alt+H</code>/<code>⌃⌥H</code> trên <code>borrow</code> để xem ai gọi; <code>Ctrl+B</code> trên <code>g.available()</code> để xem luật (<code>borrower == null</code>); <code>Ctrl+Alt+B</code> trên <code>repo.save</code> để xem “người mượn” được lưu ở đâu. Giờ bạn biết lỗi nằm ở dữ liệu, không nằm ở phép kiểm — hai phút, không mở mười file. Tìm phần <em>cố định</em> của câu báo lỗi: chữ quanh biến (<code>dang duoc</code>), không tìm phần thay đổi (<code>Arduino</code>).'}</p>

<h3>${en ? '🧪 Practice — trace a request with the keyboard only (15 minutes)' : '🧪 Thực hành — lần một request chỉ bằng bàn phím (15 phút)'}</h3>
<div class="callout ok"><p>${en ? 'Open <code>gear-mini</code>, close every tab (<em>Close All Tabs</em> via Find Action), hide tool windows with <code>Ctrl+Shift+F12</code>/<code>⇧⌘F12</code>. Start a timer. Answer with the key you used:' : 'Mở <code>gear-mini</code>, đóng mọi tab (<em>Close All Tabs</em> qua Find Action), ẩn cửa sổ công cụ bằng <code>Ctrl+Shift+F12</code>/<code>⇧⌘F12</code>. Bấm giờ. Trả lời kèm phím đã dùng:'}</p><ol>
<li>${en ? 'Trace <code>POST /api/gears/{id}/borrow</code> from the controller to the class that stores data. Name each method on the way.' : 'Lần <code>POST /api/gears/{id}/borrow</code> từ controller tới class lưu dữ liệu. Kể tên từng method trên đường đi.'}</li>
<li>${en ? 'How many classes implement <code>GearRepository</code>?' : 'Có bao nhiêu class cài đặt <code>GearRepository</code>?'}</li>
<li>${en ? 'Which classes implement <code>LoanPolicy</code>, and how many days does each allow?' : 'Class nào cài đặt <code>LoanPolicy</code>, mỗi class cho mượn bao nhiêu ngày?'}</li>
<li>${en ? 'In which file and line is the message “dang duoc … muon” built?' : 'Câu báo “dang duoc … muon” được ghép ở file nào, dòng nào?'}</li>
<li>${en ? 'Who calls <code>GearService.available()</code>? (Compare with text search for <code>available()</code>.)' : 'Ai gọi <code>GearService.available()</code>? (So với tìm chữ <code>available()</code>.)'}</li>
<li>${en ? 'Where can <code>gear.max-loans</code> get its value, and what are the values?' : '<code>gear.max-loans</code> có thể lấy giá trị từ đâu, giá trị là bao nhiêu?'}</li>
<li>${en ? 'Which classes receive a <code>GearService</code>?' : 'Những class nào nhận một <code>GearService</code>?'}</li>
<li>${en ? 'You jumped around for ten minutes. Return to the last place you <em>edited</em>.' : 'Bạn nhảy lung tung mười phút. Quay về chỗ cuối cùng bạn đã <em>sửa</em>.'}</li>
</ol>
${giai(en ? 'Answers (open after trying)' : 'Đáp án (mở sau khi đã làm)', DAP_22(en))}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? '8/8 correct in under 10 minutes, the mouse untouched, and for question 5 you can explain why text search gives six lines but Find Usages gives two.' : 'đúng 8/8 trong dưới 10 phút, không chạm chuột, và ở câu 5 bạn giải thích được vì sao tìm chữ ra sáu dòng còn Find Usages ra hai.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Search Everywhere</span><span class="v">${en ? 'One popup (Shift Shift) for classes, files, symbols, actions and text.' : 'Một cửa sổ (Shift Shift) cho class, file, symbol, lệnh và chữ.'}</span></div>
  <div class="kv"><span class="k">CamelHumps</span><span class="v">${en ? 'Matching by capital letters: GSer → GearService.' : 'Khớp theo chữ hoa đầu từ: GSer → GearService.'}</span></div>
  <div class="kv"><span class="k">Find Usages</span><span class="v">${en ? 'Every reference to this exact element, grouped, from the index.' : 'Mọi tham chiếu tới đúng phần tử này, có nhóm, lấy từ chỉ mục.'}</span></div>
  <div class="kv"><span class="k">Go to Implementation</span><span class="v">${en ? 'From an interface/abstract method to the classes that run.' : 'Từ interface/method trừu tượng tới class thực sự chạy.'}</span></div>
  <div class="kv"><span class="k">Call Hierarchy</span><span class="v">${en ? 'Tree of callers or callees of a method.' : 'Cây nơi gọi hoặc nơi bị gọi của một method.'}</span></div>
  <div class="kv"><span class="k">Type Hierarchy</span><span class="v">${en ? 'Tree of super- and sub-types of a class/interface.' : 'Cây kiểu cha và kiểu con của một class/interface.'}</span></div>
  <div class="kv"><span class="k">Keymap</span><span class="v">${en ? 'The set of shortcuts; learn the default one.' : 'Bộ phím tắt; học bộ mặc định.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Shift Shift for anything; Ctrl+N / Ctrl+Shift+N / Ctrl+Alt+Shift+N (⌘O / ⇧⌘O / ⌥⌘O) when you know the kind.' : 'Shift Shift cho mọi thứ; Ctrl+N / Ctrl+Shift+N / Ctrl+Alt+Shift+N (⌘O / ⇧⌘O / ⌥⌘O) khi đã biết loại.'}</li>
<li>${en ? 'Ctrl+B goes to the interface; Ctrl+Alt+B goes to the code that runs.' : 'Ctrl+B tới interface; Ctrl+Alt+B tới mã thực sự chạy.'}</li>
<li>${en ? 'Find Usages and Call Hierarchy understand Java; text search does not — but text search is needed for URLs, property keys and messages.' : 'Find Usages và Call Hierarchy hiểu Java; tìm chữ thì không — nhưng tìm chữ vẫn cần cho URL, khoá cấu hình và câu thông báo.'}</li>
<li>${en ? 'Back/Forward and Recent Locations stop you from getting lost.' : 'Back/Forward và Recent Locations giúp bạn không lạc đường.'}</li>
<li>${en ? 'Learn the default keymap; Find Action reminds you of any shortcut.' : 'Học keymap mặc định; Find Action nhắc mọi phím tắt.'}</li>
</ul>
${tl('https://resources.jetbrains.com/storage/products/intellij-idea/docs/IntelliJIDEA_ReferenceCard.pdf', '⌨️', 'IntelliJ IDEA Reference Card (PDF)', en ? 'Official default shortcuts, Windows/Linux and macOS' : 'Phím tắt mặc định chính thức, Windows/Linux và macOS')}
${tl('https://www.jetbrains.com/help/idea/searching-everywhere.html', '🔎', 'IntelliJ IDEA Docs — Search Everywhere', en ? 'Tabs, filters and CamelHumps' : 'Tab, bộ lọc và CamelHumps')}
${tl('https://www.jetbrains.com/help/idea/viewing-structure-and-hierarchy-of-the-source-code.html', '🌳', 'IntelliJ IDEA Docs — Structure and hierarchy', en ? 'File Structure, Call and Type Hierarchy' : 'File Structure, Call và Type Hierarchy')}
</div>
`;

/* ═════════════ 2.3 — Refactor tự động, sinh mã, live template ═════════════ */
const P_REF = [
  ['Rename (class, method, variable, file, package)', 'Rename — đổi tên (class, method, biến, file, package)', 'Shift+F6', '⇧F6'],
  ['Change Signature (parameters, order, return type)', 'Change Signature — đổi chữ ký (tham số, thứ tự, kiểu trả về)', 'Ctrl+F6', '⌘F6'],
  ['Extract Method', 'Tách method', 'Ctrl+Alt+M', '⌥⌘M'],
  ['Extract Variable', 'Tách biến', 'Ctrl+Alt+V', '⌥⌘V'],
  ['Extract Constant', 'Tách hằng', 'Ctrl+Alt+C', '⌥⌘C'],
  ['Extract Field', 'Tách field', 'Ctrl+Alt+F', '⌥⌘F'],
  ['Extract Parameter', 'Tách tham số', 'Ctrl+Alt+P', '⌥⌘P'],
  ['Inline (the reverse of extract)', 'Inline — gộp lại (ngược của tách)', 'Ctrl+Alt+N', '⌥⌘N'],
  ['Move (class to package, static member to class)', 'Move — chuyển (class sang package, thành viên static sang class)', 'F6', 'F6'],
  ['Safe Delete (checks usages first)', 'Safe Delete — xoá an toàn (kiểm nơi dùng trước)', 'Alt+Delete', '⌘⌦'],
  ['Refactor This (menu of all refactorings here)', 'Refactor This (menu mọi phép refactor tại chỗ)', 'Ctrl+Alt+Shift+T', '⌃T'],
];
const P_SINH = [
  ['Show Context Actions (intentions, quick fixes)', 'Gợi ý tại chỗ (intention, quick fix)', 'Alt+Enter', '⌥↩'],
  ['Generate (constructor, getter, equals, toString, test…)', 'Generate — sinh mã (constructor, getter, equals, toString, test…)', 'Alt+Insert', '⌘N'],
  ['Override / Implement methods', 'Override / Implement method', 'Ctrl+O / Ctrl+I', '⌃O / ⌃I'],
  ['Surround With (if, try/catch, for…)', 'Bọc bằng (if, try/catch, for…)', 'Ctrl+Alt+T', '⌥⌘T'],
  ['Insert Live Template', 'Chèn live template', 'Ctrl+J', '⌘J'],
  ['Complete Current Statement (adds ; ) { )', 'Hoàn tất câu lệnh (tự thêm ; ) { )', 'Ctrl+Shift+Enter', '⇧⌘↩'],
  ['Basic / type-matching completion', 'Gợi ý cơ bản / gợi ý theo kiểu', 'Ctrl+Space / Ctrl+Shift+Space', '⌃Space / ⌃⇧Space'],
  ['Extend / shrink selection (word → expression → statement → block)', 'Mở rộng / thu hẹp vùng chọn (từ → biểu thức → câu → khối)', 'Ctrl+W / Ctrl+Shift+W', '⌥↑ / ⌥↓'],
  ['Reformat Code / Optimize Imports', 'Định dạng mã / Dọn import', 'Ctrl+Alt+L / Ctrl+Alt+O', '⌥⌘L / ⌃⌥O'],
  ['Go to Test / Create Test', 'Đi tới test / tạo test', 'Ctrl+Shift+T', '⇧⌘T'],
  ['Duplicate line / delete line', 'Nhân đôi dòng / xoá dòng', 'Ctrl+D / Ctrl+Y', '⌘D / ⌘⌫'],
  ['Move statement up / down', 'Chuyển câu lệnh lên / xuống', 'Ctrl+Shift+↑ / ↓', '⇧⌘↑ / ↓'],
  ['Add caret at next occurrence / all occurrences', 'Thêm con trỏ ở chỗ khớp kế / mọi chỗ khớp', 'Alt+J / Ctrl+Alt+Shift+J', '⌃G / ⌃⌘G'],
];
const TRUOC_TACH = java(`
public Gear borrow(long id, String who) {
    Gear g = repo.findById(id).orElseThrow(() -> new GearNotFoundException(id));
    if (!g.available()) {
        throw new IllegalStateException(g.name() + " dang duoc " + g.borrower() + " muon");
    }
    long dangMuon = repo.findAll().stream().filter(x -> who.equals(x.borrower())).count();
    if (dangMuon >= maxLoans) {
        throw new IllegalStateException(who + " da muon " + dangMuon + "/" + maxLoans + " mon");
    }
    return repo.save(new Gear(g.id(), g.name(), g.type(), who));
}
`);
const SAU_TACH = java(`
public Gear borrow(long id, String who) {
    Gear g = repo.findById(id).orElseThrow(() -> new GearNotFoundException(id));
    requireAvailable(g);
    requireUnderLimit(who);
    return repo.save(new Gear(g.id(), g.name(), g.type(), who));
}

private static void requireAvailable(Gear g) {          // IntelliJ tự thấy không dùng field ⇒ đề xuất static
    if (!g.available()) {
        throw new IllegalStateException(g.name() + " dang duoc " + g.borrower() + " muon");
    }
}

private void requireUnderLimit(String who) {
    long dangMuon = countLoansOf(who);                   // tách tiếp biểu thức stream (Ctrl+Alt+M lần 3)
    if (dangMuon >= maxLoans) {
        throw new IllegalStateException(who + " da muon " + dangMuon + "/" + maxLoans + " mon");
    }
}

private long countLoansOf(String who) {
    return repo.findAll().stream().filter(x -> who.equals(x.borrower())).count();
}
`);
const SAU_TACH_TEST = out(`
$ ./mvnw test
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`);
const DOI_TAY = out(`
# đổi tên tay: sửa "maxLoans()" thành "loanLimit()" trong GearService.java, quên mất StartupLog
$ ./mvnw -q compile
[ERROR] /w/src/main/java/com/labflow/gear/gear/StartupLog.java:[20,42] cannot find symbol
  symbol:   method maxLoans()
  location: variable service of type com.labflow.gear.gear.GearService
`);
const POSTFIX = out(`
Gõ                                  Tab ⇒ thành
service.available().var             List<Gear> available = service.available();
g.available().if                    if (g.available()) { }
gears.for                           for (Gear gear : gears) { }
gears.fori                          for (int i = 0; i < gears.size(); i++) { }
who.nn                              if (who != null) { }
who.null                            if (who == null) { }
g.borrower().sout                   System.out.println(g.borrower());
repo.findById(id).opt               Optional.ofNullable(repo.findById(id))   (với giá trị có thể null)
new GearService(repo, 2).field      tạo field mới và gán giá trị
(x > 0).not                         !(x > 0)
gears.stream                        gears.stream()   (với mảng: Arrays.stream(gears))
List.of(1, 2).return                return List.of(1, 2);
`);
const LIVE = out(`
Gõ rồi Tab    Thành
psvm / main   public static void main(String[] args) { }
sout          System.out.println();
soutv         System.out.println("bien = " + bien);   (biến gần nhất)
soutm         System.out.println("GearService.borrow");
iter          for (Gear gear : danhSachGanNhat) { }
fori          for (int i = 0; i < ; i++) { }
ifn / inn     if (x == null) { }  /  if (x != null) { }
thr           throw new
prsf / psfs   private static final  /  public static final String
`);
const LT_TEST = java(`
// Live template tự viết: Settings → Editor → Live Templates → nhóm "gear" → + → Abbreviation: jt
// Applicable in: Java → Declaration. Template text:
@org.junit.jupiter.api.Test
void $TEN$() {
    // given
    $END$
    // when
    // then
}
// Tích "Shorten FQ names" ⇒ IntelliJ tự thêm import và chỉ giữ @Test.
`);
const L3 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · IntelliJ IDEA' : 'Chương 2 · IntelliJ IDEA'}</span>
<h2>${en ? '2.3 — Automatic refactoring, code generation and live templates' : '2.3 — Refactor tự động, sinh code và live template'}</h2>
<p class="lead">${en
    ? 'Refactoring means changing the shape of code without changing what it does. Done by hand — find, replace, fix what broke — it is slow and it breaks things you do not see. IntelliJ’s refactorings work on the Java model from lesson 2.2: they know every usage, update them all in one step, warn about conflicts, and can be undone as one action. This lesson covers the refactorings you will use daily, then the generators that write boilerplate for you.'
    : 'Refactor là đổi hình dạng mã mà không đổi việc nó làm. Làm tay — tìm, thay, sửa chỗ vỡ — vừa chậm vừa làm hỏng những chỗ bạn không thấy. Các phép refactor của IntelliJ làm việc trên mô hình Java ở bài 2.2: chúng biết mọi nơi dùng, cập nhật tất cả trong một bước, cảnh báo xung đột, và hoàn tác được như một thao tác. Bài này đi qua những phép refactor dùng hằng ngày, rồi tới các bộ sinh mã viết phần lặp lại thay bạn.'}</p>

<h3>${en ? 'Why not just find-and-replace?' : 'Sao không tìm-và-thay cho nhanh?'}</h3>
<p>${en
    ? 'Here is a hand rename on <code>gear-mini</code> — real output. The method was renamed in <code>GearService</code>, and one caller was forgotten:'
    : 'Đây là một lần đổi tên bằng tay trên <code>gear-mini</code> — output thật. Method đã được đổi tên trong <code>GearService</code>, và quên mất một chỗ gọi:'}</p>
${DOI_TAY}
<p>${en
    ? 'In Java the compiler catches this one. In the places the compiler does not check — a method name used in a Spring Expression, a JSP/Thymeleaf template, reflection, a property key, a SQL string — a hand rename compiles and fails <em>at runtime</em>, sometimes in production. <code>Shift+F6</code>/<code>⇧F6</code> renames the declaration and every usage, offers to rename in comments and strings (you review each), renames the matching test class and getters/setters if you ask, and shows a preview when the change is large.'
    : 'Với Java, trình biên dịch bắt được lỗi này. Ở những chỗ trình biên dịch không kiểm — tên method dùng trong biểu thức Spring, template JSP/Thymeleaf, reflection, khoá cấu hình, chuỗi SQL — đổi tên tay vẫn biên dịch được và hỏng <em>lúc chạy</em>, có khi là trên production. <code>Shift+F6</code>/<code>⇧F6</code> đổi tên khai báo và mọi nơi dùng, hỏi có đổi cả trong chú thích và chuỗi không (bạn duyệt từng chỗ), đổi luôn tên class test tương ứng và getter/setter nếu bạn muốn, và hiện bản xem trước khi thay đổi lớn.'}</p>

<h3>${en ? 'The refactorings you use every week' : 'Những phép refactor dùng mỗi tuần'}</h3>
${phim(P_REF, !en)}
<div class="lz-flow">
  <div class="lz-step"><strong>Rename</strong> — ${en ? 'press twice (<code>Shift+F6</code> ×2) to open the full dialog with “search in comments and strings”, “rename tests”.' : 'bấm hai lần (<code>Shift+F6</code> ×2) để mở hộp thoại đầy đủ có “tìm trong chú thích và chuỗi”, “đổi tên test”.'}</div>
  <div class="lz-step"><strong>Change Signature</strong> — ${en ? 'add a parameter with a <em>default value</em>: every caller gets that value, the build stays green, then you fix callers one by one.' : 'thêm tham số kèm <em>giá trị mặc định</em>: mọi chỗ gọi nhận giá trị đó, build vẫn xanh, rồi bạn sửa dần từng chỗ.'}</div>
  <div class="lz-step"><strong>Extract</strong> — ${en ? 'select an expression (grow the selection with <code>Ctrl+W</code>/<code>⌥↑</code>) and extract: IntelliJ also finds <em>duplicates</em> of that code and offers to replace them.' : 'chọn một biểu thức (mở rộng vùng chọn bằng <code>Ctrl+W</code>/<code>⌥↑</code>) rồi tách: IntelliJ còn tìm cả các <em>đoạn trùng</em> và đề nghị thay luôn.'}</div>
  <div class="lz-step"><strong>Safe Delete</strong> — ${en ? 'refuses (or shows a list) if the element is still used. Plain delete does not ask.' : 'từ chối (hoặc hiện danh sách) nếu phần tử còn được dùng. Xoá thường thì không hỏi.'}</div>
</div>

<h3>${en ? 'Worked example: make borrow() readable in three keystrokes' : 'Ví dụ làm thật: làm borrow() dễ đọc trong ba cú bấm'}</h3>
<p>${en ? 'Before — one method mixing lookup, two business rules and saving:' : 'Trước — một method trộn tra cứu, hai luật nghiệp vụ và lưu:'}</p>
${TRUOC_TACH}
<ol>
<li>${en ? 'Put the caret on the first <code>if</code>, <code>Ctrl+W</code>/<code>⌥↑</code> until the whole <code>if</code> block is selected, <code>Ctrl+Alt+M</code>/<code>⌥⌘M</code>, type <code>requireAvailable</code>, Enter.' : 'Đặt con trỏ ở <code>if</code> đầu, bấm <code>Ctrl+W</code>/<code>⌥↑</code> tới khi chọn trọn khối <code>if</code>, <code>Ctrl+Alt+M</code>/<code>⌥⌘M</code>, gõ <code>requireAvailable</code>, Enter.'}</li>
<li>${en ? 'Select the <code>long dangMuon…</code> line and the second <code>if</code>, extract as <code>requireUnderLimit</code>. IntelliJ sees the method needs <code>who</code> and makes it a parameter.' : 'Chọn dòng <code>long dangMuon…</code> và khối <code>if</code> thứ hai, tách thành <code>requireUnderLimit</code>. IntelliJ thấy method cần <code>who</code> nên tự đưa thành tham số.'}</li>
<li>${en ? 'Inside it, select the stream expression and extract once more as <code>countLoansOf</code>. Then run the tests (lesson 2.4: <code>Ctrl+Shift+F10</code>/<code>⌃⇧R</code> in the test class).' : 'Bên trong nó, chọn biểu thức stream và tách lần nữa thành <code>countLoansOf</code>. Rồi chạy test (bài 2.4: <code>Ctrl+Shift+F10</code>/<code>⌃⇧R</code> trong class test).'}</li>
</ol>
${SAU_TACH}
${SAU_TACH_TEST}
<p>${en
    ? 'The method now reads like the business rule: find, check available, check limit, save. Nothing was typed by hand except three names — and the same four tests that passed before still pass. That last sentence is the definition of a safe refactor: <strong>tests green before, tests green after, one small commit</strong>. The full method of reading and changing legacy code is the subject of the course'
    : 'Method giờ đọc như chính luật nghiệp vụ: tìm, kiểm còn trống, kiểm hạn mức, lưu. Không gõ tay gì ngoài ba cái tên — và đúng bốn test chạy qua trước đó vẫn qua. Câu cuối chính là định nghĩa refactor an toàn: <strong>test xanh trước, test xanh sau, một commit nhỏ</strong>. Phương pháp đầy đủ để đọc và sửa mã cũ là nội dung của khoá'} ${bai('doc-code-cu-va-refactor', 'lgc-0-8-bat-dau-tai-day', en ? 'Reading and maintaining legacy code' : 'Đọc hiểu và bảo trì code cũ')}.</p>

<h3>${en ? 'The hacker’s view (well, the loss view): dead code that came back to life' : 'Góc sự cố thật: đoạn mã chết sống lại'}</h3>
<p>${en
    ? 'On 1 August 2012, Knight Capital deployed new trading code to eight servers, but the deployment missed one. The new code <strong>re-used an old flag</strong> that, on the forgotten server, still switched on “Power Peg” — logic that had been unused since 2003 but never deleted. In 45 minutes that server sent millions of orders; Knight lost about <strong>460 million US dollars</strong> and was sold within months (SEC order, 16/10/2013). Two lessons for daily IDE work: delete dead code with <em>Safe Delete</em> instead of leaving it “just in case” (Git remembers it for you), and never repurpose an existing name or flag for a new meaning — create a new one with Rename/Extract so every usage is visible.'
    : 'Ngày 1/8/2012, Knight Capital triển khai mã giao dịch mới lên tám máy chủ, nhưng sót một máy. Mã mới <strong>dùng lại một cờ cũ</strong>, mà trên máy bị sót, cờ đó vẫn bật “Power Peg” — logic bỏ không dùng từ 2003 nhưng chưa bao giờ bị xoá. Trong 45 phút máy đó gửi đi hàng triệu lệnh; Knight lỗ khoảng <strong>460 triệu đô la Mỹ</strong> và bị bán lại sau vài tháng (quyết định của SEC, 16/10/2013). Hai bài học cho việc dùng IDE hằng ngày: xoá mã chết bằng <em>Safe Delete</em> thay vì để lại “phòng khi cần” (Git nhớ hộ bạn), và đừng bao giờ dùng lại một cái tên hay cờ đã có cho nghĩa mới — tạo cái mới bằng Rename/Extract để mọi nơi dùng đều hiện ra.'}</p>
<p>${en
    ? 'How to find dead code in IntelliJ: unused declarations are shown in grey; <em>Code → Inspect Code…</em> lists “Unused declaration” across the project; <code>Alt+F7</code>/<code>⌥F7</code> confirms. In <code>gear-mini</code>, <code>StudentPolicy</code> and <code>LecturerPolicy</code> are never used by the service yet — a real finding the practice below asks you to handle.'
    : 'Tìm mã chết trong IntelliJ: khai báo không dùng hiện màu xám; <em>Code → Inspect Code…</em> liệt kê “Unused declaration” trên cả dự án; <code>Alt+F7</code>/<code>⌥F7</code> để xác nhận. Trong <code>gear-mini</code>, <code>StudentPolicy</code> và <code>LecturerPolicy</code> chưa hề được service dùng — một phát hiện thật mà phần thực hành dưới đây bắt bạn xử lý.'}</p>

<h3>${en ? 'Let the IDE write the boring parts' : 'Để IDE viết phần nhàm chán'}</h3>
${phim(P_SINH, !en)}
<p>${en
    ? '<strong><code>Alt+Enter</code>/<code>⌥↩</code> is the most important key in IntelliJ.</strong> Wherever there is a red or yellow underline — or just wherever the caret is — it offers what can be done here: import the class, create the missing method in the right class with the right parameter types, add a cast, convert a <code>for</code> loop to a stream and back, introduce a local variable, add <code>@Override</code>, flip an <code>if</code>. Type code that does not exist yet (<code>service.returnGear(id)</code>), press <code>Alt+Enter</code> → <em>Create method</em>: this is how many seniors write code “top-down”.'
    : '<strong><code>Alt+Enter</code>/<code>⌥↩</code> là phím quan trọng nhất của IntelliJ.</strong> Ở đâu có gạch đỏ hay vàng — hoặc chỉ cần con trỏ đang đứng — nó đề xuất những việc làm được tại đó: import class, tạo method còn thiếu ở đúng class với đúng kiểu tham số, thêm ép kiểu, đổi vòng <code>for</code> thành stream và ngược lại, tạo biến cục bộ, thêm <code>@Override</code>, đảo <code>if</code>. Gõ mã chưa tồn tại (<code>service.returnGear(id)</code>), bấm <code>Alt+Enter</code> → <em>Create method</em>: nhiều senior viết mã “từ trên xuống” đúng kiểu này.'}</p>
<p>${en
    ? '<code>Alt+Insert</code>/<code>⌘N</code> generates constructors (pick fields), getters/setters, <code>equals()</code>/<code>hashCode()</code>, <code>toString()</code>, and — inside a test class — test methods and <code>@BeforeEach</code>. <code>Ctrl+Shift+T</code>/<code>⇧⌘T</code> on a class jumps to its test, or creates one with JUnit 5 and the methods you tick. With Java records and Lombok (lesson 2.5) you generate less, but in legacy projects at outsourcing companies you will meet many plain classes with getters/setters.'
    : '<code>Alt+Insert</code>/<code>⌘N</code> sinh constructor (chọn field), getter/setter, <code>equals()</code>/<code>hashCode()</code>, <code>toString()</code>, và — trong class test — method test và <code>@BeforeEach</code>. <code>Ctrl+Shift+T</code>/<code>⇧⌘T</code> trên một class nhảy tới test của nó, hoặc tạo mới bằng JUnit 5 với các method bạn tích chọn. Có record của Java và Lombok (bài 2.5) thì phải sinh ít hơn, nhưng dự án cũ ở công ty outsourcing còn rất nhiều class thường có getter/setter.'}</p>

<h3>${en ? 'Postfix completion: write the value first, the wrapper after' : 'Postfix completion: viết giá trị trước, vỏ bọc sau'}</h3>
<p>${en
    ? 'You usually think of the value before the statement around it. Postfix templates let you type the value, then a dot and a keyword, then <code>Tab</code>. Full list: <em>Settings → Editor → General → Postfix Completion</em>.'
    : 'Ta thường nghĩ ra giá trị trước câu lệnh bao quanh nó. Postfix template cho bạn gõ giá trị, rồi dấu chấm và một từ khoá, rồi <code>Tab</code>. Danh sách đầy đủ: <em>Settings → Editor → General → Postfix Completion</em>.'}</p>
${POSTFIX}

<h3>${en ? 'Live templates: built-in and your own' : 'Live template: có sẵn và tự viết'}</h3>
<p>${en
    ? 'A live template is an abbreviation that expands into code with jump points. Type the abbreviation and press <code>Tab</code>, or press <code>Ctrl+J</code>/<code>⌘J</code> to list the templates valid at the caret.'
    : 'Live template là một chữ viết tắt bung ra thành đoạn mã có các điểm nhảy. Gõ chữ viết tắt rồi bấm <code>Tab</code>, hoặc bấm <code>Ctrl+J</code>/<code>⌘J</code> để liệt kê template dùng được tại vị trí con trỏ.'}</p>
${LIVE}
<p>${en ? 'Write one for something you type every day — a JUnit test with given/when/then comments:' : 'Tự viết một cái cho thứ ngày nào cũng gõ — một test JUnit có chú thích given/when/then:'}</p>
${LT_TEST}
<p>${en
    ? '<code>$TEN$</code> is a variable (the caret stops there first), <code>$END$</code> is where the caret ends. Share templates with the team by exporting settings (<em>File → Manage IDE Settings → Export Settings</em>) or keep them in your dotfiles (Chapter 6). Do not overdo it: five templates you use daily beat fifty you forget.'
    : '<code>$TEN$</code> là một biến (con trỏ dừng ở đó trước), <code>$END$</code> là chỗ con trỏ dừng cuối. Chia sẻ template cho nhóm bằng cách xuất cài đặt (<em>File → Manage IDE Settings → Export Settings</em>) hoặc giữ trong dotfiles (Chương 6). Đừng quá tay: năm template ngày nào cũng dùng hơn năm mươi cái bạn quên.'}</p>

<h3>${en ? '💼 At work: refactor and feature in separate commits' : '💼 Đi làm: refactor và tính năng tách commit riêng'}</h3>
<p>${en
    ? 'Reviewers at outsourcing companies often reject a pull request where a rename of 40 files is mixed with 10 lines of new logic: the logic is invisible in the noise. The habit: commit 1 “refactor: extract requireAvailable/requireUnderLimit (no behaviour change)”, tests green; commit 2 “feat: …”. If your team has a code freeze or the customer reviews diffs, a pure-refactor commit is also easy to revert. And refactor <em>only what your ticket touches</em> — a junior who reformats the whole file creates merge conflicts for everyone (Chapter 5).'
    : 'Reviewer ở công ty outsourcing thường trả lại pull request trộn việc đổi tên 40 file với 10 dòng logic mới: logic bị chìm trong mớ thay đổi. Thói quen đúng: commit 1 “refactor: tách requireAvailable/requireUnderLimit (không đổi hành vi)”, test xanh; commit 2 “feat: …”. Nếu nhóm có giai đoạn đóng băng mã hoặc khách hàng duyệt diff, commit chỉ-refactor cũng dễ hoàn tác. Và chỉ refactor <em>phần ticket của bạn chạm tới</em> — người mới định dạng lại cả file là tạo xung đột merge cho cả nhóm (Chương 5).'}</p>

<h3>${en ? '🧪 Practice (25 minutes)' : '🧪 Thực hành (25 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Reproduce the worked example on <code>GearService.borrow</code> with the three extractions. Run <code>GearServiceTest</code>: 3 green.' : 'Làm lại ví dụ trên <code>GearService.borrow</code> với ba lần tách. Chạy <code>GearServiceTest</code>: 3 xanh.'}</li>
<li>${en ? 'Rename <code>maxLoans()</code> to <code>loanLimit()</code> with <code>Shift+F6</code>/<code>⇧F6</code>. Check <code>StartupLog</code> changed too; build succeeds.' : 'Đổi tên <code>maxLoans()</code> thành <code>loanLimit()</code> bằng <code>Shift+F6</code>/<code>⇧F6</code>. Kiểm <code>StartupLog</code> cũng đổi theo; build thành công.'}</li>
<li>${en ? '<code>Ctrl+F6</code>/<code>⌘F6</code> on <code>borrow</code>: add a parameter <code>LoanPolicy policy</code> with default value <code>new StudentPolicy()</code>. Look at what happened to <code>GearController</code> and the tests.' : '<code>Ctrl+F6</code>/<code>⌘F6</code> trên <code>borrow</code>: thêm tham số <code>LoanPolicy policy</code> với giá trị mặc định <code>new StudentPolicy()</code>. Xem <code>GearController</code> và test đã đổi thế nào.'}</li>
<li>${en ? 'In <code>GearNotFoundException</code>, select <code>"Khong co thiet bi id="</code> and extract a constant (<code>Ctrl+Alt+C</code>/<code>⌥⌘C</code>).' : 'Trong <code>GearNotFoundException</code>, chọn <code>"Khong co thiet bi id="</code> và tách hằng (<code>Ctrl+Alt+C</code>/<code>⌥⌘C</code>).'}</li>
<li>${en ? 'Type <code>service.returnGear(1L)</code> in a test, <code>Alt+Enter</code> → <em>Create method</em>, implement it (set borrower to <code>null</code>) using postfix <code>.var</code> and live template <code>jt</code> for a new test.' : 'Gõ <code>service.returnGear(1L)</code> trong một test, <code>Alt+Enter</code> → <em>Create method</em>, viết thân hàm (đặt người mượn về <code>null</code>) có dùng postfix <code>.var</code> và live template <code>jt</code> cho test mới.'}</li>
<li>${en ? 'Undo step 3 (<code>Ctrl+Z</code> once undoes the whole refactoring), then try <em>Safe Delete</em> on <code>LecturerPolicy</code>: what does IntelliJ say? Decide with a comment in your notes whether it should stay.' : 'Hoàn tác bước 3 (<code>Ctrl+Z</code> một lần là hoàn tác cả phép refactor), rồi thử <em>Safe Delete</em> trên <code>LecturerPolicy</code>: IntelliJ nói gì? Ghi vào sổ quyết định của bạn: nên giữ hay xoá.'}</li>
</ol>
${giai(en ? 'What you should see' : 'Bạn nên thấy gì', `<ul>
<li>${en ? 'Step 3: every call becomes <code>borrow(…, new StudentPolicy())</code>; build green with zero manual edits.' : 'Bước 3: mọi lời gọi thành <code>borrow(…, new StudentPolicy())</code>; build xanh mà không sửa tay chỗ nào.'}</li>
<li>${en ? 'Step 6: <code>LecturerPolicy</code> has no usages, so Safe Delete deletes it without a warning; <code>LoanPolicy</code> would show its two implementations. Reasonable decision: keep both policies only if the ticket that wires them is in the current sprint — otherwise delete, Git keeps the history.' : 'Bước 6: <code>LecturerPolicy</code> không có nơi dùng nên Safe Delete xoá luôn không cảnh báo; nếu thử trên <code>LoanPolicy</code> sẽ thấy hai lớp cài đặt. Quyết định hợp lý: chỉ giữ hai policy nếu ticket nối chúng vào nằm trong sprint hiện tại — không thì xoá, Git vẫn giữ lịch sử.'}</li>
</ul>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every change above was made by a refactoring or generator (no hand edits of usages), <code>./mvnw test</code> is green after each step, and your Git log shows refactor commits separate from the <code>returnGear</code> feature commit.' : 'mọi thay đổi ở trên đều làm bằng refactor hoặc bộ sinh mã (không sửa tay nơi dùng), <code>./mvnw test</code> xanh sau mỗi bước, và Git log có commit refactor tách khỏi commit tính năng <code>returnGear</code>.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Refactoring</span><span class="v">${en ? 'Changing structure without changing behaviour.' : 'Đổi cấu trúc mà không đổi hành vi.'}</span></div>
  <div class="kv"><span class="k">Change Signature</span><span class="v">${en ? 'Edit parameters/return type and update all callers.' : 'Sửa tham số/kiểu trả về và cập nhật mọi chỗ gọi.'}</span></div>
  <div class="kv"><span class="k">Extract / Inline</span><span class="v">${en ? 'Give a piece of code a name / remove the name and put the code back.' : 'Đặt tên cho một đoạn mã / bỏ tên và đặt mã trở lại.'}</span></div>
  <div class="kv"><span class="k">Safe Delete</span><span class="v">${en ? 'Delete only after checking nothing uses it.' : 'Chỉ xoá sau khi kiểm không còn ai dùng.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Intention action' : 'Intention action (gợi ý tại chỗ)'}</span><span class="v">${en ? 'Context fix or transformation offered by Alt+Enter.' : 'Sửa hoặc biến đổi tại chỗ mà Alt+Enter đề xuất.'}</span></div>
  <div class="kv"><span class="k">Postfix completion</span><span class="v">${en ? 'value.keyword + Tab ⇒ statement around the value.' : 'giátrị.từkhoá + Tab ⇒ câu lệnh bọc quanh giá trị.'}</span></div>
  <div class="kv"><span class="k">Live template</span><span class="v">${en ? 'Abbreviation that expands into code with jump points.' : 'Chữ viết tắt bung thành mã có điểm nhảy.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Rename, Change Signature, Extract, Inline, Move, Safe Delete: use the IDE, not find-and-replace.' : 'Rename, Change Signature, Extract, Inline, Move, Safe Delete: dùng IDE, đừng dùng tìm-và-thay.'}</li>
<li>${en ? 'A safe refactor = tests green before and after, small separate commit.' : 'Refactor an toàn = test xanh trước và sau, commit nhỏ tách riêng.'}</li>
<li>${en ? 'Alt+Enter everywhere; Alt+Insert / ⌘N for boilerplate; Ctrl+Shift+T for tests.' : 'Alt+Enter ở mọi chỗ; Alt+Insert / ⌘N cho mã lặp; Ctrl+Shift+T cho test.'}</li>
<li>${en ? 'Postfix and live templates turn ideas into code faster than typing.' : 'Postfix và live template biến ý tưởng thành mã nhanh hơn gõ tay.'}</li>
<li>${en ? 'Delete dead code and never repurpose old flags — Knight Capital lost 460 million dollars in 45 minutes (2012).' : 'Xoá mã chết và đừng dùng lại cờ cũ — Knight Capital mất 460 triệu đô trong 45 phút (2012).'}</li>
</ul>
${tl('https://www.jetbrains.com/help/idea/refactoring-source-code.html', '🛠', 'IntelliJ IDEA Docs — Refactor code', en ? 'All refactorings with examples' : 'Mọi phép refactor kèm ví dụ')}
${tl('https://www.jetbrains.com/help/idea/settings-postfix-completion.html', '⚡', 'IntelliJ IDEA Docs — Postfix completion', en ? 'Full template list' : 'Danh sách template đầy đủ')}
${tl('https://www.jetbrains.com/help/idea/using-live-templates.html', '🧩', 'IntelliJ IDEA Docs — Live templates', en ? 'Built-in templates, variables, sharing' : 'Template có sẵn, biến, chia sẻ')}
${tl('https://www.sec.gov/news/press-release/2013-222', '📉', 'SEC — Knight Capital charged (16/10/2013)', en ? 'Official account of the 2012 incident' : 'Tường thuật chính thức sự cố 2012')}
</div>
`;

/* ═════════════ 2.4 — Run configuration, test, độ phủ, debugger đủ dùng ═════════════ */
const P_CHAY = [
  ['Run context configuration (method, class, main under the caret)', 'Chạy cấu hình theo ngữ cảnh (method, class, main tại con trỏ)', 'Ctrl+Shift+F10', '⌃⇧R'],
  ['Debug context configuration', 'Debug cấu hình theo ngữ cảnh', '(right-click gutter ▶ → Debug)', '⌃⇧D'],
  ['Run / Debug the selected configuration', 'Chạy / Debug cấu hình đang chọn', 'Shift+F10 / Shift+F9', '⌃R / ⌃D'],
  ['Choose a configuration and run / debug', 'Chọn cấu hình rồi chạy / debug', 'Alt+Shift+F10 / Alt+Shift+F9', '⌃⌥R / ⌃⌥D'],
  ['Run Anything (mvn …, gradle …, any config)', 'Run Anything (mvn …, gradle …, mọi cấu hình)', 'Ctrl Ctrl', '⌃⌃'],
  ['Rerun / Stop', 'Chạy lại / Dừng', 'Ctrl+F5 / Ctrl+F2', '⌘R / ⌘F2'],
  ['Build project', 'Build dự án', 'Ctrl+F9', '⌘F9'],
  ['Run tool window', 'Cửa sổ Run', 'Alt+4', '⌘4'],
];
const P_DEBUG = [
  ['Toggle breakpoint', 'Bật/tắt breakpoint', 'Ctrl+F8', '⌘F8'],
  ['Step over / step into', 'Chạy qua dòng / đi vào hàm', 'F8 / F7', 'F8 / F7'],
  ['Step out', 'Ra khỏi hàm', 'Shift+F8', '⇧F8'],
  ['Run to cursor', 'Chạy tới con trỏ', 'Alt+F9', '⌥F9'],
  ['Evaluate expression', 'Tính một biểu thức', 'Alt+F8', '⌥F8'],
  ['Resume', 'Chạy tiếp', 'F9', '⌘⌥R'],
  ['View all breakpoints', 'Xem mọi breakpoint', 'Ctrl+Shift+F8', '⌘⇧F8'],
];
const THU_TU_OUT = out(`
# cùng một file jar, bốn cách chạy (output thật):
$ java -jar gear-mini.jar
>>> gear-mini: profiles= max-loans=2                    ← application.properties

$ SPRING_PROFILES_ACTIVE=dev java -jar gear-mini.jar
>>> gear-mini: profiles=dev max-loans=5                 ← application-dev.properties đè lên

$ GEAR_MAX_LOANS=9 java -jar gear-mini.jar --spring.profiles.active=dev
>>> gear-mini: profiles=dev max-loans=9                 ← biến môi trường đè file profile

$ GEAR_MAX_LOANS=9 java -Dspring.profiles.active=dev -jar gear-mini.jar --gear.max-loans=3
>>> gear-mini: profiles=dev max-loans=3                 ← tham số dòng lệnh đè tất cả
`);
const RUN_XML = xml(`
<!-- .run/GearMini dev.run.xml — sinh ra khi tích "Store as project file" (mẫu cấu hình kiểu Application) -->
<component name="ProjectRunConfigurationManager">
  <configuration default="false" name="GearMini dev" type="Application" factoryName="Application">
    <option name="MAIN_CLASS_NAME" value="com.labflow.gear.GearMiniApplication" />
    <module name="gear-mini" />
    <option name="VM_PARAMETERS" value="-Dspring.profiles.active=dev" />
    <option name="PROGRAM_PARAMETERS" value="--server.port=8081" />
    <envs>
      <env name="GEAR_MAX_LOANS" value="4" />
      <!-- KHÔNG BAO GIỜ: <env name="DB_PASSWORD" value="mật-khẩu-thật" /> -->
    </envs>
    <method v="2">
      <option name="Make" enabled="true" />
    </method>
  </configuration>
</component>
`);
const TEST_OUT = out(`
$ ./mvnw test -Dtest='GearServiceTest#muonQuaHanMucBiTuChoi'      # đúng việc IntelliJ làm khi bấm ▶ cạnh một method test
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.047 s -- in com.labflow.gear.gear.GearServiceTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`);
const COVER_OUT = out(`
$ ./mvnw jacoco:prepare-agent test jacoco:report      # cùng thư viện JaCoCo mà "Run with Coverage" có thể dùng
Lớp                      Dòng được chạy   Nhánh
GearService              13/13            4/4
InMemoryGearRepository   11/11            0/0
Gear                      2/2             2/2
StartupLog                7/7             0/0
GearController            3/7             0/0     ← hai @ExceptionHandler (404, 409) chưa test nào chạm tới
GearNotFoundException     0/2             0/0     ← chưa test "không có thiết bị"
StudentPolicy             0/2             0/0     ← mã chưa nối vào đâu (bài 2.3)
LecturerPolicy            0/2             0/0
GearMiniApplication       1/3             0/0     ← main() không chạy trong test
`);
const JDWP_OUT = out(`
$ java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar gear-mini.jar
Listening for transport dt_socket at address: 5005
>>> gear-mini: profiles= max-loans=2
# IntelliJ: Run → Edit Configurations → + → Remote JVM Debug → host, port 5005 → Debug
`);
const L4 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · IntelliJ IDEA' : 'Chương 2 · IntelliJ IDEA'}</span>
<h2>${en ? '2.4 — Run configurations for Spring Boot and Tomcat, environment variables, tests and coverage' : '2.4 — Run configuration cho Spring Boot và Tomcat, biến môi trường, test và độ phủ'}</h2>
<p class="lead">${en
    ? 'A run configuration is a saved answer to “how exactly do we start this?”: which main class, which JDK, which profile, which arguments, which environment variables. Get it right once, share it with the team, and nobody types a long command again. This lesson also shows the order in which Spring Boot reads its settings (measured, not guessed), how to run one test or all of them, how to read coverage honestly, and the five debugger keys you need on day one.'
    : 'Run configuration (cấu hình chạy) là câu trả lời được lưu lại cho câu hỏi “chạy cái này chính xác thế nào?”: main class nào, JDK nào, profile nào, tham số nào, biến môi trường nào. Làm đúng một lần, chia sẻ cho cả nhóm, và không ai phải gõ lại lệnh dài nữa. Bài này còn cho thấy thứ tự Spring Boot đọc cấu hình (đo thật, không đoán), cách chạy một test hay cả bộ, cách đọc độ phủ cho trung thực, và năm phím debugger cần ngay ngày đầu.'}</p>

<h3>${en ? 'Starting the application' : 'Khởi động ứng dụng'}</h3>
<p>${en
    ? 'Open <code>GearMiniApplication</code> and click the green ▶ in the gutter next to <code>main</code>, or press <code>Ctrl+Shift+F10</code>/<code>⌃⇧R</code>. IntelliJ creates a temporary configuration named after the class and starts it; the <em>Run</em> tool window shows the Spring banner and logs. The drop-down in the toolbar now lists it: <em>Edit Configurations…</em> to make it permanent and change its fields.'
    : 'Mở <code>GearMiniApplication</code> và bấm ▶ xanh bên lề cạnh <code>main</code>, hoặc bấm <code>Ctrl+Shift+F10</code>/<code>⌃⇧R</code>. IntelliJ tạo một cấu hình tạm mang tên class rồi chạy; cửa sổ <em>Run</em> hiện banner Spring và log. Ô thả xuống trên thanh công cụ giờ có cấu hình đó: <em>Edit Configurations…</em> để lưu hẳn và sửa các ô.'}</p>
${phim(P_CHAY, !en)}
<table>
<thead><tr><th>${en ? 'Field' : 'Ô'}</th><th>${en ? 'Example' : 'Ví dụ'}</th><th>${en ? 'Reaches the app as' : 'Tới ứng dụng dưới dạng'}</th></tr></thead>
<tbody>
<tr><td>Main class</td><td><code>com.labflow.gear.GearMiniApplication</code></td><td>${en ? 'entry point' : 'điểm vào'}</td></tr>
<tr><td>VM options</td><td><code>-Dspring.profiles.active=dev -Xmx512m</code></td><td>${en ? 'JVM system properties and memory flags (before <code>-jar</code>)' : 'system property của JVM và cờ bộ nhớ (đứng trước <code>-jar</code>)'}</td></tr>
<tr><td>Program arguments</td><td><code>--server.port=8081</code></td><td>${en ? '<code>String[] args</code>; Spring reads <code>--key=value</code>' : '<code>String[] args</code>; Spring đọc dạng <code>--khoa=giatri</code>'}</td></tr>
<tr><td>Environment variables</td><td><code>GEAR_MAX_LOANS=4</code></td><td>${en ? 'OS environment; Spring maps <code>GEAR_MAX_LOANS</code> → <code>gear.max-loans</code>' : 'biến môi trường hệ điều hành; Spring ánh xạ <code>GEAR_MAX_LOANS</code> → <code>gear.max-loans</code>'}</td></tr>
<tr><td>Active profiles (${en ? 'Spring Boot type, Ultimate' : 'kiểu Spring Boot, bản Ultimate'})</td><td><code>dev</code></td><td>${en ? 'same as <code>spring.profiles.active</code>' : 'tương đương <code>spring.profiles.active</code>'}</td></tr>
<tr><td>Before launch</td><td>Build</td><td>${en ? 'compile changed classes first' : 'biên dịch class đã đổi trước'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'Many fields are hidden behind <em>Modify options</em> (Alt+M in the dialog). In the free edition the configuration type is <em>Application</em>; Ultimate adds a <em>Spring Boot</em> type with an “Active profiles” box and live beans/endpoints — but everything it does can be expressed with VM options and environment variables, which is what servers use anyway.'
    : 'Nhiều ô bị giấu sau <em>Modify options</em> (Alt+M trong hộp thoại). Ở bản miễn phí kiểu cấu hình là <em>Application</em>; bản Ultimate có thêm kiểu <em>Spring Boot</em> với ô “Active profiles” và xem bean/endpoint lúc chạy — nhưng mọi thứ nó làm đều viết được bằng VM options và biến môi trường, đúng thứ máy chủ thật dùng.'}</p>

<h3>${en ? 'Who wins? Spring’s order, measured' : 'Ai thắng? Thứ tự của Spring, đo thật'}</h3>
<p>${en
    ? '<code>gear-mini</code> prints the value of <code>gear.max-loans</code> at startup. The same jar, started four ways:'
    : '<code>gear-mini</code> in giá trị <code>gear.max-loans</code> lúc khởi động. Cùng một file jar, chạy bốn kiểu:'}</p>
${THU_TU_OUT}
<div class="lz-stack">
  <div class="lz-layer"><strong>4.</strong> ${en ? 'Command-line arguments <code>--gear.max-loans=3</code> — strongest' : 'Tham số dòng lệnh <code>--gear.max-loans=3</code> — mạnh nhất'}</div>
  <div class="lz-layer"><strong>3.</strong> ${en ? 'Environment variables <code>GEAR_MAX_LOANS=9</code> (and <code>-D</code> system properties, which rank above them)' : 'Biến môi trường <code>GEAR_MAX_LOANS=9</code> (và system property <code>-D</code>, đứng trên biến môi trường)'}</div>
  <div class="lz-layer"><strong>2.</strong> ${en ? 'Profile file <code>application-dev.properties</code>' : 'File profile <code>application-dev.properties</code>'}</div>
  <div class="lz-layer"><strong>1.</strong> ${en ? '<code>application.properties</code> — weakest, the default' : '<code>application.properties</code> — yếu nhất, giá trị mặc định'}</div>
</div>
<p>${en
    ? 'This is why the same code behaves differently on your laptop, in IntelliJ and on the server: each one sets a different layer. When a value “does not change”, ask which higher layer is overriding it — Spring Boot’s full list has 15 levels (link below), the course'
    : 'Đây là lý do cùng một mã chạy khác nhau trên laptop, trong IntelliJ và trên máy chủ: mỗi nơi đặt một tầng khác nhau. Khi một giá trị “đổi mãi không ăn”, hãy hỏi tầng nào cao hơn đang đè lên nó — danh sách đầy đủ của Spring Boot có 15 mức (liên kết cuối bài), khoá'} ${bai('spring-boot', 'sb-3-7-profile-config', en ? 'Spring Boot 3.7' : 'Spring Boot 3.7')} ${en ? 'covers profiles in depth.' : 'dạy sâu về profile.'}</p>

<h3>${en ? 'Sharing configurations — without sharing secrets' : 'Chia sẻ cấu hình — mà không chia sẻ bí mật'}</h3>
<p>${en
    ? 'Tick <em>Store as project file</em> and IntelliJ writes the configuration to <code>.run/&lt;name&gt;.run.xml</code>. Commit that folder and every teammate gets the same “GearMini dev” entry after <code>git pull</code>:'
    : 'Tích <em>Store as project file</em> thì IntelliJ ghi cấu hình ra <code>.run/&lt;tên&gt;.run.xml</code>. Commit thư mục đó là mọi người trong nhóm có cùng mục “GearMini dev” sau khi <code>git pull</code>:'}</p>
${RUN_XML}
<p>${en
    ? 'Database passwords, API keys and tokens never go into that file — or into <code>application.properties</code> in Git. Put them in a <code>.env</code> file that is listed in <code>.gitignore</code>, and load it into the run configuration (recent IntelliJ versions have a “.env file” option under <em>Modify options</em>; older ones use the <em>EnvFile</em> plugin). Commit a <code>.env.example</code> with the variable names and fake values.'
    : 'Mật khẩu cơ sở dữ liệu, khoá API, token không bao giờ nằm trong file đó — hay trong <code>application.properties</code> trên Git. Để chúng trong file <code>.env</code> có tên trong <code>.gitignore</code>, rồi nạp vào run configuration (IntelliJ bản gần đây có tuỳ chọn “.env file” trong <em>Modify options</em>; bản cũ dùng plugin <em>EnvFile</em>). Commit một file <code>.env.example</code> chỉ có tên biến và giá trị giả.'}</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'The real incident: Toyota, 2022' : 'Sự cố thật: Toyota, 2022'}</strong></p><p>${en
    ? 'In October 2022 Toyota disclosed that a subcontractor had published part of the T-Connect app’s source code to a <strong>public</strong> GitHub repository in December 2017 — including an access key to a customer data server. It stayed public for almost five years; up to 296,019 customer email addresses and customer numbers were exposed. Nobody “hacked” anything: a key sat in a configuration that was committed. The habits above — secrets only in ignored <code>.env</code> files, shared run configurations reviewed like code — are how you never become that subcontractor. Lesson 6.1 adds automatic scanning with gitleaks.'
    : 'Tháng 10/2022, Toyota công bố một nhà thầu phụ đã đưa một phần mã nguồn ứng dụng T-Connect lên một repo GitHub <strong>công khai</strong> từ tháng 12/2017 — kèm khoá truy cập vào máy chủ dữ liệu khách hàng. Nó để công khai gần năm năm; tới 296.019 địa chỉ email và mã khách hàng bị lộ. Không ai “hack” gì cả: một chiếc khoá nằm trong file cấu hình được commit. Những thói quen ở trên — bí mật chỉ nằm trong file <code>.env</code> bị ignore, run configuration dùng chung được review như mã — là cách để bạn không bao giờ thành nhà thầu đó. Bài 6.1 thêm quét tự động bằng gitleaks.'}</p></div>

<h3>${en ? 'Tomcat and WAR projects (the legacy ones you will meet)' : 'Tomcat và dự án WAR (loại dự án cũ bạn sẽ gặp)'}</h3>
<p>${en
    ? 'Spring Boot embeds Tomcat, so you just run <code>main</code>. Older projects (Servlet/JSP like PRJ301, or Spring MVC before Boot) are packaged as a <code>.war</code> and deployed into a separately installed Tomcat. In IntelliJ Ultimate: <em>Run → Edit Configurations → + → Tomcat Server → Local</em>, point to the Tomcat folder, on the <em>Deployment</em> tab add the artifact <code>yourapp:war exploded</code> and set the <em>Application context</em> (e.g. <code>/shop</code>). Set <em>On frame deactivation → Update classes and resources</em> so JSP changes appear when you switch to the browser. In the free edition use the <em>Smart Tomcat</em> plugin, or run Tomcat in Docker and deploy the WAR with Maven. Two common surprises: the context path is part of the URL (<code>localhost:8080/shop/login</code>, not <code>/login</code>), and Tomcat’s real error is often in <code>logs/localhost.*.log</code>, not in the console.'
    : 'Spring Boot nhúng sẵn Tomcat, nên bạn chỉ chạy <code>main</code>. Dự án cũ hơn (Servlet/JSP như PRJ301, hay Spring MVC trước thời Boot) được đóng gói thành <code>.war</code> rồi triển khai vào một Tomcat cài riêng. Ở IntelliJ Ultimate: <em>Run → Edit Configurations → + → Tomcat Server → Local</em>, chỉ tới thư mục Tomcat, ở tab <em>Deployment</em> thêm artifact <code>tenapp:war exploded</code> và đặt <em>Application context</em> (ví dụ <code>/shop</code>). Đặt <em>On frame deactivation → Update classes and resources</em> để sửa JSP là thấy ngay khi chuyển sang trình duyệt. Bản miễn phí thì dùng plugin <em>Smart Tomcat</em>, hoặc chạy Tomcat trong Docker và triển khai WAR bằng Maven. Hai bất ngờ hay gặp: context path là một phần của URL (<code>localhost:8080/shop/login</code>, không phải <code>/login</code>), và lỗi thật của Tomcat thường nằm trong <code>logs/localhost.*.log</code>, không nằm trên console.'}</p>

<h3>${en ? 'Running tests: one, a class, everything, only the failed ones' : 'Chạy test: một cái, một class, tất cả, chỉ cái hỏng'}</h3>
<ul>
<li>${en ? 'Caret inside a test method → <code>Ctrl+Shift+F10</code>/<code>⌃⇧R</code> runs <strong>that method</strong>; caret on the class name runs the class. The gutter ▶ does the same.' : 'Con trỏ trong một method test → <code>Ctrl+Shift+F10</code>/<code>⌃⇧R</code> chạy <strong>đúng method đó</strong>; con trỏ ở tên class thì chạy cả class. ▶ bên lề làm việc tương tự.'}</li>
<li>${en ? 'Right-click <code>src/test/java</code> (or a package) → <em>Run ‘All Tests’</em>. For the exact same result as CI, run Maven’s <code>test</code> goal from the Maven tool window or <code>Ctrl Ctrl</code> → <code>mvn test</code>.' : 'Chuột phải <code>src/test/java</code> (hoặc một package) → <em>Run ‘All Tests’</em>. Muốn kết quả y hệt CI, chạy goal <code>test</code> của Maven trong cửa sổ Maven hoặc <code>Ctrl Ctrl</code> → <code>mvn test</code>.'}</li>
<li>${en ? 'In the test runner: <em>Rerun Failed Tests</em> button; filter to show only failures; double-click a failed test to jump to the assertion; <em>Click to see difference</em> opens a side-by-side diff of expected vs actual.' : 'Trong cửa sổ chạy test: nút <em>Rerun Failed Tests</em>; lọc chỉ hiện test hỏng; nhấp đúp test hỏng để nhảy tới dòng assert; <em>Click to see difference</em> mở bảng so sánh mong đợi/thực tế hai bên.'}</li>
</ul>
${TEST_OUT}

<h3>${en ? 'Coverage: a map of what tests never touched' : 'Độ phủ: bản đồ những gì test chưa từng chạm'}</h3>
<p>${en
    ? '<em>Run ‘…’ with Coverage</em> (from the ▶ menu or the run toolbar) runs the tests and paints the editor gutter: green = executed, red = never executed, yellow = only some branches. The <em>Coverage</em> tool window shows percentages per class. The same measurement from the command line with JaCoCo on <code>gear-mini</code>:'
    : '<em>Run ‘…’ with Coverage</em> (trong menu của ▶ hoặc thanh chạy) chạy test rồi tô lề editor: xanh = đã chạy, đỏ = chưa chạy lần nào, vàng = mới chạy một số nhánh. Cửa sổ <em>Coverage</em> hiện phần trăm theo class. Cùng phép đo đó bằng JaCoCo từ dòng lệnh trên <code>gear-mini</code>:'}</p>
${COVER_OUT}
<p>${en
    ? 'Read it like a reviewer: the service is fully covered — good. But the two error responses users will actually see (404 and 409) are red, because nothing tests the controller. Coverage tells you <em>where to look</em>, not that the tested code is correct: a test with no assertions still paints lines green. The'
    : 'Đọc như một reviewer: service được phủ trọn — tốt. Nhưng hai phản hồi lỗi mà người dùng thật sự nhìn thấy (404 và 409) lại đỏ, vì chưa có test nào cho controller. Độ phủ cho bạn biết <em>nên nhìn vào đâu</em>, không chứng minh mã đã test là đúng: một test không có assert vẫn tô xanh các dòng. Khoá'} ${bai('testing', 'tst-8-1-do-phu', en ? 'Testing course 8.1' : 'Testing 8.1')} ${en ? 'goes deeper (and mutation testing in 8.2).' : 'đi sâu hơn (và mutation testing ở 8.2).'}</p>

<h3>${en ? 'The debugger: enough for day one' : 'Debugger: đủ dùng cho ngày đầu'}</h3>
<p>${en
    ? 'Full debugging method lives in the course'
    : 'Phương pháp gỡ lỗi đầy đủ nằm ở khoá'} ${bai('debug-co-phuong-phap', 'dbg-4-1-co-ban', en ? 'Debugging, chapter 4 (IntelliJ)' : 'Debug có phương pháp, chương 4 (IntelliJ)')}. ${en
    ? 'What you need before that: click the gutter (or <code>Ctrl+F8</code>/<code>⌘F8</code>) to set a breakpoint on <code>requireUnderLimit</code>, start with <em>Debug</em> instead of Run, send a request, and the app stops there. The <em>Debug</em> window shows the call stack (frames) and variables; hover any variable to see its value.'
    : 'Những gì cần trước đó: bấm vào lề (hoặc <code>Ctrl+F8</code>/<code>⌘F8</code>) để đặt breakpoint ở <code>requireUnderLimit</code>, khởi động bằng <em>Debug</em> thay vì Run, gửi một request, và ứng dụng dừng tại đó. Cửa sổ <em>Debug</em> hiện ngăn xếp lời gọi (frame) và các biến; rê chuột lên biến nào cũng thấy giá trị.'}</p>
${phim(P_DEBUG, !en)}
<ul>
<li>${en ? '<strong>Conditional breakpoint:</strong> right-click the red dot, Condition <code>"binh.tt".equals(who)</code> — stops only for that user, not for every request.' : '<strong>Breakpoint có điều kiện:</strong> chuột phải chấm đỏ, Condition <code>"binh.tt".equals(who)</code> — chỉ dừng với đúng người đó, không dừng mọi request.'}</li>
<li>${en ? '<strong>Evaluate Expression</strong> (<code>Alt+F8</code>/<code>⌥F8</code>): run <code>repo.findAll()</code> while stopped to see the whole data, without adding a <code>println</code>.' : '<strong>Evaluate Expression</strong> (<code>Alt+F8</code>/<code>⌥F8</code>): chạy <code>repo.findAll()</code> lúc đang dừng để xem toàn bộ dữ liệu, không cần thêm <code>println</code>.'}</li>
<li>${en ? '<strong>Remote debug:</strong> an app running in Docker or on a test server can be debugged if it was started with the JDWP agent:' : '<strong>Debug từ xa:</strong> ứng dụng chạy trong Docker hay trên máy test vẫn debug được nếu khởi động kèm JDWP agent:'}</li>
</ul>
${JDWP_OUT}
<div class="callout warn"><p>${en
    ? '<code>address=*:5005</code> lets <em>anyone</em> who can reach port 5005 run code in that JVM — JDWP has no password. Use it only on your machine or a private test network, bind to <code>127.0.0.1:5005</code> plus an SSH tunnel otherwise, and never leave it on in production. Details: '
    : '<code>address=*:5005</code> cho <em>bất kỳ ai</em> tới được cổng 5005 chạy mã trong JVM đó — JDWP không có mật khẩu. Chỉ dùng trên máy mình hoặc mạng test riêng, còn lại thì bind <code>127.0.0.1:5005</code> và đi qua đường hầm SSH, và không bao giờ để bật trên production. Chi tiết: '}${bai('debug-co-phuong-phap', 'dbg-4-5-remote-jvm', en ? 'Debugging 4.5' : 'Debug 4.5')}.</p></div>

<h3>${en ? '💼 At work: “it works in IntelliJ but not on the test server”' : '💼 Đi làm: “trong IntelliJ chạy được mà lên máy test thì không”'}</h3>
<p>${en
    ? 'Nine times out of ten the IDE run configuration has something the server does not: a VM option you added months ago, an environment variable, a different profile, or the IDE’s JDK. Before saying “it works on my machine”, open <em>Edit Configurations</em> and read every field aloud; compare with the deployment’s environment (the team’s <code>docker-compose.yml</code>, Kubernetes manifest or start script). Then reproduce from the terminal with only what the server has: <code>java -jar target/*.jar --spring.profiles.active=…</code>. If it breaks there, you found the difference.'
    : 'Chín trên mười lần, run configuration của IDE có thứ mà máy chủ không có: một VM option bạn thêm từ mấy tháng trước, một biến môi trường, profile khác, hoặc JDK của IDE. Trước khi nói “máy em chạy được mà”, mở <em>Edit Configurations</em> và đọc to từng ô; so với môi trường triển khai (file <code>docker-compose.yml</code>, manifest Kubernetes hay script khởi động của nhóm). Rồi tái hiện từ terminal chỉ với những gì máy chủ có: <code>java -jar target/*.jar --spring.profiles.active=…</code>. Hỏng ở đó là bạn đã tìm ra chỗ khác nhau.'}</p>

<h3>${en ? '🧪 Practice (30 minutes)' : '🧪 Thực hành (30 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Create a configuration “GearMini dev”: VM options <code>-Dspring.profiles.active=dev</code>, program arguments <code>--server.port=8081</code>, environment <code>GEAR_MAX_LOANS=4</code>. Run it and read the <code>&gt;&gt;&gt;</code> line. Predict first: 4 or 5?' : 'Tạo cấu hình “GearMini dev”: VM options <code>-Dspring.profiles.active=dev</code>, program arguments <code>--server.port=8081</code>, biến môi trường <code>GEAR_MAX_LOANS=4</code>. Chạy và đọc dòng <code>&gt;&gt;&gt;</code>. Đoán trước: 4 hay 5?'}</li>
<li>${en ? 'Tick <em>Store as project file</em>, look at the generated <code>.run/*.run.xml</code>.' : 'Tích <em>Store as project file</em>, xem file <code>.run/*.run.xml</code> sinh ra.'}</li>
<li>${en ? 'Run only <code>muonQuaHanMucBiTuChoi</code>, then the whole class, then all tests with coverage. Which lines of <code>GearController</code> are red?' : 'Chạy riêng <code>muonQuaHanMucBiTuChoi</code>, rồi cả class, rồi toàn bộ test kèm độ phủ. Dòng nào của <code>GearController</code> màu đỏ?'}</li>
<li>${en ? 'Break a test on purpose (<code>assertEquals(4, …)</code>), run, use <em>Click to see difference</em>, fix it, <em>Rerun Failed Tests</em>.' : 'Cố tình làm hỏng một test (<code>assertEquals(4, …)</code>), chạy, dùng <em>Click to see difference</em>, sửa lại, <em>Rerun Failed Tests</em>.'}</li>
<li>${en ? 'Debug “GearMini dev”, put a conditional breakpoint in <code>borrow</code> for <code>"binh.tt".equals(who)</code>, call <code>POST localhost:8081/api/gears/1/borrow?who=binh.tt</code> (curl or lesson 2.5) and evaluate <code>repo.findAll()</code>.' : 'Debug “GearMini dev”, đặt breakpoint có điều kiện trong <code>borrow</code> với <code>"binh.tt".equals(who)</code>, gọi <code>POST localhost:8081/api/gears/1/borrow?who=binh.tt</code> (bằng curl hoặc bài 2.5) rồi evaluate <code>repo.findAll()</code>.'}</li>
</ol>
${giai(en ? 'Answer to step 1' : 'Đáp án bước 1', `<p>${en ? '<strong>4.</strong> The environment variable outranks the profile file (5). If you had also put <code>--gear.max-loans=3</code> in program arguments, it would print 3.' : '<strong>4.</strong> Biến môi trường đứng trên file profile (5). Nếu thêm <code>--gear.max-loans=3</code> vào program arguments thì in ra 3.'}</p>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the configuration is committed under <code>.run/</code> with no secret in it, you predicted the printed value before running, the coverage report shows the two red exception handlers, and you stopped at a conditional breakpoint only for <code>binh.tt</code>.' : 'cấu hình đã commit trong <code>.run/</code> và không chứa bí mật nào, bạn đoán đúng giá trị in ra trước khi chạy, báo cáo độ phủ có hai handler lỗi màu đỏ, và bạn dừng ở breakpoint có điều kiện chỉ với <code>binh.tt</code>.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Run configuration</span><span class="v">${en ? 'Saved recipe to start an app or tests.' : 'Công thức đã lưu để khởi động ứng dụng hoặc test.'}</span></div>
  <div class="kv"><span class="k">VM options / program arguments</span><span class="v">${en ? 'Flags for the JVM / arguments for main().' : 'Cờ cho JVM / tham số cho main().'}</span></div>
  <div class="kv"><span class="k">${en ? 'Profile' : 'Profile (hồ sơ cấu hình)'}</span><span class="v">${en ? 'Named set of settings, e.g. application-dev.properties.' : 'Bộ cấu hình có tên, ví dụ application-dev.properties.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Externalized configuration' : 'Cấu hình ngoài mã'}</span><span class="v">${en ? 'Spring’s layered sources; higher layer wins.' : 'Các nguồn cấu hình xếp tầng của Spring; tầng cao thắng.'}</span></div>
  <div class="kv"><span class="k">.run/*.run.xml</span><span class="v">${en ? 'Shared run configuration committed with the project.' : 'Cấu hình chạy dùng chung, commit cùng dự án.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Coverage' : 'Coverage (độ phủ)'}</span><span class="v">${en ? 'Which lines/branches the tests executed.' : 'Những dòng/nhánh mà test đã chạy qua.'}</span></div>
  <div class="kv"><span class="k">JDWP</span><span class="v">${en ? 'Java debug protocol; port open = code execution.' : 'Giao thức debug Java; mở cổng = cho chạy mã.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Ctrl+Shift+F10 / ⌃⇧R runs whatever is under the caret: main, test class, test method.' : 'Ctrl+Shift+F10 / ⌃⇧R chạy thứ dưới con trỏ: main, class test, method test.'}</li>
<li>${en ? 'Spring order (measured): properties &lt; profile file &lt; environment &lt; command line.' : 'Thứ tự Spring (đo thật): properties &lt; file profile &lt; biến môi trường &lt; dòng lệnh.'}</li>
<li>${en ? 'Share configurations in .run/, secrets only in an ignored .env (Toyota 2022: a committed key, five years public).' : 'Chia sẻ cấu hình trong .run/, bí mật chỉ ở .env bị ignore (Toyota 2022: một khoá bị commit, công khai năm năm).'}</li>
<li>${en ? 'Coverage shows where tests never went; it does not prove correctness.' : 'Độ phủ chỉ chỗ test chưa đi tới; không chứng minh mã đúng.'}</li>
<li>${en ? 'Five debugger keys: Ctrl+F8, F8, F7, Alt+F8, F9 (⌘F8, F8, F7, ⌥F8, ⌘⌥R).' : 'Năm phím debugger: Ctrl+F8, F8, F7, Alt+F8, F9 (⌘F8, F8, F7, ⌥F8, ⌘⌥R).'}</li>
</ul>
${tl('https://www.jetbrains.com/help/idea/run-debug-configuration.html', '▶️', 'IntelliJ IDEA Docs — Run/debug configurations', en ? 'Fields, templates, Store as project file' : 'Các ô, template, Store as project file')}
${tl('https://docs.spring.io/spring-boot/reference/features/external-config.html', '🌱', 'Spring Boot — Externalized Configuration', en ? 'The full ordered list of property sources' : 'Danh sách đầy đủ các nguồn cấu hình theo thứ tự')}
${tl('https://www.jetbrains.com/help/idea/code-coverage.html', '🟩', 'IntelliJ IDEA Docs — Code coverage', en ? 'Run with Coverage, gutter colours, reports' : 'Run with Coverage, màu lề, báo cáo')}
${tl('https://global.toyota/jp/newsroom/corporate/38095972.html', '🚗', 'Toyota — Thông báo rò rỉ email khách hàng T-Connect (07/10/2022, tiếng Nhật)', en ? 'Official notice of the access-key leak' : 'Thông báo chính thức về vụ lộ khoá truy cập')}
</div>
`;

/* ═════════════ 2.5 — Công cụ đi kèm: HTTP Client/Postman, Database/DBeaver/pgAdmin, Maven, plugin ═════════════ */
const HTTP_FILE = bash(`
### 1. Danh sách thiết bị còn trống
GET {{host}}/api/gears/available

> {%
  client.test("tra ve 200 va 3 mon", () => {
    client.assert(response.status === 200, "status " + response.status);
    client.assert(response.body.length === 3, "so mon " + response.body.length);
  });
%}

### 2. Mượn Arduino cho binh.tt
POST {{host}}/api/gears/1/borrow?who={{who}}

> {%
  client.global.set("tenMon", response.body.name);
  client.test("muon duoc", () => client.assert(response.status === 200));
%}

### 3. Mượn lại đúng món đó — phải bị từ chối 409
POST {{host}}/api/gears/1/borrow?who=chi.lm

> {%
  client.test("409 khi da co nguoi muon", () => client.assert(response.status === 409));
%}

### 4. Thiết bị không tồn tại
POST {{host}}/api/gears/99/borrow?who={{who}}
`);
const HTTP_ENV = json(`
{
  "local":   { "host": "http://localhost:8080",  "who": "binh.tt" },
  "may-ide": { "host": "http://localhost:41808", "who": "binh.tt" }
}
`);
const HTTP_PRIV = json(`
// http/http-client.private.env.json — TÊN NÀY phải có trong .gitignore
{
  "local": { "token": "eyJhbGciOi...token-that-cua-ban" }
}
// dùng trong request:  Authorization: Bearer {{token}}
`);
const HTTP_CLI = bash(`
# cùng file .http chạy ngoài IDE (CI, máy không có Ultimate) — IntelliJ HTTP Client CLI qua Docker
docker run --rm --network host -v "$PWD/http:/workdir" jetbrains/intellij-http-client \\
  -v http-client.env.json -e may-ide --no-progress -L VERBOSE gear.http
`);
const HTTP_CLI_OUT = out(`
Request '1. Danh sách thiết bị còn trống' GET http://localhost:41808/api/gears/available
<= response =
HTTP/1.1 200
Content-Type: application/json
[{"id":1,"name":"Arduino Uno R3","type":"BOARD","borrower":null},{"id":2,"name":"Raspberry Pi 5","type":"BOARD","borrower":null},{"id":4,"name":"USB-UART CP2102","type":"CABLE","borrower":null}]
Response code: 200; Time: 309ms (309 ms); Content length: 194 bytes (194 B)
Request '2. Mượn Arduino cho binh.tt' POST http://localhost:41808/api/gears/1/borrow?who=binh.tt
{"id":1,"name":"Arduino Uno R3","type":"BOARD","borrower":"binh.tt"}
Response code: 200; Time: 21ms (21 ms); Content length: 68 bytes (68 B)
Request '3. Mượn lại đúng món đó — phải bị từ chối 409' POST http://localhost:41808/api/gears/1/borrow?who=chi.lm
HTTP/1.1 409
{"error":"Arduino Uno R3 dang duoc binh.tt muon"}
Request '4. Thiết bị không tồn tại' POST http://localhost:41808/api/gears/99/borrow?who=binh.tt
HTTP/1.1 404
{"error":"Khong co thiet bi id=99"}
4 requests completed, 0 have failed tests
RUN SUCCESSFUL
`);
const HTTP_FAIL_OUT = out(`
# một kiểm tra cố tình sai (chờ 201) — lệnh trả mã thoát 1, CI sẽ đỏ:
Request 'Cố tình sai: chờ 201 nhưng API trả 200' GET http://localhost:41808/api/gears/available
Failed sai.http#0 phai la 201
AssertionError: nhan duoc 200
1 requests completed, 1 have failed tests
RUN FAILED
`);
const DB_CHAY = bash(`
# PostgreSQL thử trong Docker (cổng 41543 để không đụng Postgres có sẵn trên máy)
docker run -d --rm --name ide-pg -e POSTGRES_USER=gear -e POSTGRES_PASSWORD=gear-dev-only \\
  -e POSTGRES_DB=gear -p 127.0.0.1:41543:5432 postgres:17-alpine
psql -h 127.0.0.1 -p 41543 -U gear -d gear -f gear-seed.sql      # hoặc mở file .sql trong công cụ DB rồi chạy
`);
const DB_SEED = bash(`
-- gear-seed.sql
CREATE TABLE gear (
  id        bigint PRIMARY KEY,
  name      text   NOT NULL,
  type      text   NOT NULL,
  borrower  text
);
INSERT INTO gear VALUES
  (1, 'Arduino Uno R3',     'BOARD', NULL),
  (2, 'Raspberry Pi 5',     'BOARD', NULL),
  (3, 'Logic Analyzer 8CH', 'TOOL',  'an.nv'),
  (4, 'USB-UART CP2102',    'CABLE', NULL);
`);
const DB_QUERY_OUT = out(`
gear=> SELECT type, count(*) AS so_mon, count(borrower) AS dang_muon FROM gear GROUP BY type ORDER BY type;
 type  | so_mon | dang_muon
-------+--------+-----------
 BOARD |      2 |         0
 CABLE |      1 |         0
 TOOL  |      1 |         1
(3 rows)

gear=> EXPLAIN SELECT * FROM gear WHERE id = 3;
                               QUERY PLAN
------------------------------------------------------------------------
 Index Scan using gear_pkey on gear  (cost=0.15..8.17 rows=1 width=104)
   Index Cond: (id = 3)
`);
const DB_TX_OUT = out(`
gear=> BEGIN;                                   -- chế độ "Manual commit" của công cụ DB làm đúng việc này cho bạn
gear=*> UPDATE gear SET borrower = NULL;        -- quên WHERE
UPDATE 4
gear=*> SELECT count(*) FILTER (WHERE borrower IS NOT NULL) AS con_dang_muon FROM gear;
 con_dang_muon
---------------
             0
gear=*> ROLLBACK;
gear=> SELECT id, borrower FROM gear WHERE id = 3;
 id | borrower
----+----------
  3 | an.nv                                     -- dữ liệu còn nguyên
`);
const DEP_TREE = out(`
$ ./mvnw dependency:tree -Dincludes=ch.qos.logback,org.apache.logging.log4j
[INFO] com.labflow:gear-mini:jar:0.0.1-SNAPSHOT
[INFO] \\- org.springframework.boot:spring-boot-starter-webmvc:jar:4.2.0:compile
[INFO]    \\- org.springframework.boot:spring-boot-starter:jar:4.2.0:compile
[INFO]       \\- org.springframework.boot:spring-boot-starter-logging:jar:4.2.0:compile
[INFO]          +- ch.qos.logback:logback-classic:jar:1.6.6:compile
[INFO]          |  \\- ch.qos.logback:logback-core:jar:1.6.6:compile
[INFO]          \\- org.apache.logging.log4j:log4j-to-slf4j:jar:2.26.1:compile
[INFO]             \\- org.apache.logging.log4j:log4j-api:jar:2.26.1:compile
`);
const GRADLE_DEP = out(`
$ ./gradlew dependencies --configuration runtimeClasspath -q      # bản Gradle của cùng dự án
runtimeClasspath - Runtime classpath of source set 'main'.
\\--- org.springframework.boot:spring-boot-starter-webmvc -> 4.2.0
     +--- org.springframework.boot:spring-boot-starter:4.2.0
     |    +--- org.springframework.boot:spring-boot-starter-logging:4.2.0
     |    |    +--- ch.qos.logback:logback-classic:1.6.6
     |    |    |    +--- ch.qos.logback:logback-core:1.6.6
     |    |    |    \\--- org.slf4j:slf4j-api:2.0.19 -> 2.0.20
`);
const L5 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · IntelliJ IDEA' : 'Chương 2 · IntelliJ IDEA'}</span>
<h2>${en ? '2.5 — Built-in tools and plugins: HTTP Client, Database, Maven, SonarLint, Lombok' : '2.5 — Công cụ đi kèm và plugin: HTTP Client, Database, Maven, SonarLint, Lombok'}</h2>
<p class="lead">${en
    ? 'A backend developer’s day is a loop: change code → call the API → look at the database → check the dependencies. Each step can be a separate application (Postman, DBeaver or pgAdmin, a terminal) or a tool window inside IntelliJ. This lesson teaches both, so you can work in whatever your team uses: the IDE’s HTTP Client and its file-based requests, Postman and Bruno, the Database tool and its free alternatives, the Maven/Gradle windows for answering “do we use library X?”, and the few plugins worth installing.'
    : 'Một ngày của lập trình viên backend là một vòng lặp: sửa mã → gọi API → nhìn cơ sở dữ liệu → kiểm thư viện. Mỗi bước có thể là một ứng dụng riêng (Postman, DBeaver hay pgAdmin, terminal) hoặc một cửa sổ công cụ trong IntelliJ. Bài này dạy cả hai, để bạn làm được với bất cứ thứ gì nhóm đang dùng: HTTP Client của IDE với request lưu thành file, Postman và Bruno, công cụ Database và các lựa chọn miễn phí, cửa sổ Maven/Gradle để trả lời “dự án có dùng thư viện X không?”, và vài plugin đáng cài.'}</p>

<h3>${en ? '1. Calling the API: requests as files, in Git' : '1. Gọi API: request là file, nằm trong Git'}</h3>
<p>${en
    ? 'IntelliJ’s HTTP Client (Ultimate; the command-line version is free) reads <code>.http</code> files: plain text, one request per <code>###</code> block, variables in <code>{{double braces}}</code>, and an optional JavaScript block after <code>&gt; {% … %}</code> that checks the response. Create <code>http/gear.http</code> in <code>gear-mini</code>; a ▶ appears next to each request. The same syntax works in VS Code’s REST Client (lesson 1.4) for the basics.'
    : 'HTTP Client của IntelliJ (bản Ultimate; bản dòng lệnh thì miễn phí) đọc file <code>.http</code>: chữ thường, mỗi request một khối <code>###</code>, biến trong <code>{{hai ngoặc nhọn}}</code>, và tuỳ chọn một khối JavaScript sau <code>&gt; {% … %}</code> để kiểm phản hồi. Tạo <code>http/gear.http</code> trong <code>gear-mini</code>; cạnh mỗi request hiện một nút ▶. Phần cơ bản của cú pháp này dùng được cả trong REST Client của VS Code (bài 1.4).'}</p>
${HTTP_FILE}
<p>${en ? 'Variables come from an environment file next to it; you choose the environment in the editor toolbar (or <code>-e</code> on the command line):' : 'Biến lấy từ file môi trường đặt cạnh; bạn chọn môi trường trên thanh công cụ của editor (hoặc <code>-e</code> khi chạy dòng lệnh):'}</p>
${HTTP_ENV}
${HTTP_PRIV}
<p>${en ? 'Run on this course’s machine against a live <code>gear-mini</code> (real output, headers trimmed):' : 'Chạy trên máy của khoá với <code>gear-mini</code> đang chạy (output thật, đã lược header):'}</p>
${HTTP_CLI}
${HTTP_CLI_OUT}
${HTTP_FAIL_OUT}
<p>${en
    ? 'Why teams like this: the requests live <strong>next to the code</strong>, are reviewed in pull requests, change in the same commit as the endpoint, and run in CI with the CLI. In IntelliJ you can also paste a <code>curl</code> command into a <code>.http</code> file (it converts automatically) and right-click a request → <em>Convert to cURL and Copy</em> to send it to a colleague.'
    : 'Vì sao các nhóm thích cách này: request nằm <strong>cạnh mã</strong>, được review trong pull request, đổi cùng commit với endpoint, và chạy được trong CI bằng bản dòng lệnh. Trong IntelliJ bạn còn dán được một lệnh <code>curl</code> vào file <code>.http</code> (tự chuyển đổi) và chuột phải một request → <em>Convert to cURL and Copy</em> để gửi cho đồng nghiệp.'}</p>

<h3>${en ? 'Postman and Bruno: when the team uses a separate app' : 'Postman và Bruno: khi nhóm dùng ứng dụng riêng'}</h3>
<p>${en
    ? 'Many companies, testers and customers share API collections in <strong>Postman</strong>. The same ideas, different names: a <em>collection</em> is your <code>.http</code> file, an <em>environment</em> is your env file (with “initial” values that are shared and “current” values that stay on your machine), <code>pm.test(…)</code> scripts are your <code>client.test(…)</code>, and <em>Newman</em> / the Postman CLI runs a collection in CI. <strong>Bruno</strong> is an open-source alternative that stores collections as plain files in your repository and works offline — close to the <code>.http</code> philosophy.'
    : 'Nhiều công ty, tester và khách hàng chia sẻ bộ API bằng <strong>Postman</strong>. Cùng ý tưởng, khác tên gọi: <em>collection</em> là file <code>.http</code> của bạn, <em>environment</em> là file môi trường (có giá trị “initial” được chia sẻ và giá trị “current” chỉ ở máy bạn), script <code>pm.test(…)</code> là <code>client.test(…)</code>, và <em>Newman</em> / Postman CLI chạy collection trong CI. <strong>Bruno</strong> là lựa chọn mã nguồn mở lưu collection thành file thường ngay trong repo và chạy không cần mạng — gần với triết lý <code>.http</code>.'}</p>
<table>
<thead><tr><th></th><th>IntelliJ HTTP Client</th><th>Postman</th><th>Bruno</th><th>curl</th></tr></thead>
<tbody>
<tr><td>${en ? 'Where requests live' : 'Request nằm ở đâu'}</td><td>${en ? '<code>.http</code> in the repo' : '<code>.http</code> trong repo'}</td><td>${en ? 'Postman workspace (cloud sync), export JSON' : 'workspace Postman (đồng bộ đám mây), xuất JSON'}</td><td>${en ? 'files in the repo' : 'file trong repo'}</td><td>${en ? 'your shell history / scripts' : 'lịch sử shell / script'}</td></tr>
<tr><td>${en ? 'Tests' : 'Kiểm tra'}</td><td><code>client.test</code></td><td><code>pm.test</code></td><td>${en ? 'assertions + scripts' : 'assert + script'}</td><td>${en ? 'by hand (<code>jq</code>, exit codes)' : 'tự viết (<code>jq</code>, mã thoát)'}</td></tr>
<tr><td>CI</td><td>ijhttp CLI</td><td>Newman / Postman CLI</td><td>bru CLI</td><td>${en ? 'native' : 'sẵn có'}</td></tr>
<tr><td>${en ? 'Best for' : 'Hợp nhất khi'}</td><td>${en ? 'developers on a Java team' : 'lập trình viên trong nhóm Java'}</td><td>${en ? 'sharing with QA/customers' : 'chia sẻ với QA/khách hàng'}</td><td>${en ? 'Git-first teams without Postman' : 'nhóm ưu tiên Git, không dùng Postman'}</td><td>${en ? 'quick checks, servers, bug reports' : 'kiểm nhanh, trên máy chủ, gửi kèm báo lỗi'}</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Tokens in API tools' : 'Token trong công cụ gọi API'}</strong></p><p>${en
    ? 'A Postman workspace accidentally set to <em>Public</em>, or an environment exported with a real token, publishes that token to the Internet — security firms find such leaks regularly. Same rule as lesson 2.4: real tokens only in private/current values or <code>http-client.private.env.json</code> (ignored by Git); check the workspace visibility before inviting anyone; at a company, follow its policy on which tools may hold customer data. Reproducing a request for a bug report: the course'
    : 'Một workspace Postman lỡ đặt <em>Public</em>, hay một environment xuất ra kèm token thật, là đưa token đó lên Internet — các hãng bảo mật vẫn thường xuyên tìm thấy kiểu rò rỉ này. Luật giống bài 2.4: token thật chỉ nằm ở giá trị riêng/current hoặc <code>http-client.private.env.json</code> (Git bỏ qua); kiểm chế độ hiển thị của workspace trước khi mời ai vào; ở công ty, theo chính sách về công cụ nào được giữ dữ liệu khách hàng. Tái hiện request để gửi kèm báo lỗi: khoá'} ${bai('debug-co-phuong-phap', 'dbg-6-2-curl-postman', en ? 'Debugging 6.2' : 'Debug 6.2')}.</p></div>

<h3>${en ? '2. Looking at the database: IntelliJ Database, DBeaver, pgAdmin' : '2. Nhìn cơ sở dữ liệu: IntelliJ Database, DBeaver, pgAdmin'}</h3>
<p>${en
    ? 'Start a throw-away PostgreSQL for practice (Docker course; port 41543 avoids clashing with anything already on your machine):'
    : 'Bật một PostgreSQL dùng-xong-bỏ để luyện (khoá Docker; cổng 41543 để không đụng thứ đang có trên máy):'}</p>
${DB_CHAY}
${DB_SEED}
<p>${en ? 'Connect from any of the three tools with the same five values:' : 'Kết nối từ công cụ nào trong ba công cụ cũng dùng đúng năm giá trị:'}</p>
<table>
<thead><tr><th>${en ? 'Field' : 'Ô'}</th><th>${en ? 'Value' : 'Giá trị'}</th></tr></thead>
<tbody>
<tr><td>Host / Port</td><td><code>127.0.0.1</code> / <code>41543</code></td></tr>
<tr><td>Database</td><td><code>gear</code></td></tr>
<tr><td>User / Password</td><td><code>gear</code> / <code>gear-dev-only</code></td></tr>
<tr><td>JDBC URL</td><td><code>jdbc:postgresql://127.0.0.1:41543/gear</code></td></tr>
</tbody>
</table>
<ul>
<li><strong>IntelliJ Database</strong> (${en ? 'Ultimate; the same engine as DataGrip' : 'Ultimate; cùng lõi với DataGrip'}): ${en ? '<em>Database</em> tool window → <em>+ → Data Source → PostgreSQL</em>, fill the fields, <em>Download missing driver files</em>, <em>Test Connection</em>. Then a query console (<code>Ctrl+Enter</code>/<code>⌘↩</code> runs the statement under the caret), autocompletion of table and column names inside SQL strings in your Java code, and data editing in a grid.' : 'cửa sổ <em>Database</em> → <em>+ → Data Source → PostgreSQL</em>, điền các ô, <em>Download missing driver files</em>, <em>Test Connection</em>. Sau đó có console truy vấn (<code>Ctrl+Enter</code>/<code>⌘↩</code> chạy câu lệnh tại con trỏ), gợi ý tên bảng và cột ngay trong chuỗi SQL của mã Java, và sửa dữ liệu dạng lưới.'}</li>
<li><strong>DBeaver Community</strong> (${en ? 'free, every database' : 'miễn phí, mọi loại CSDL'}): ${en ? '<em>Database → New Database Connection → PostgreSQL</em>, same fields; <code>Ctrl+Enter</code> runs the current statement, <code>Alt+X</code> runs the script; ER diagram of a schema in one click. The usual choice at companies without Ultimate licences.' : '<em>Database → New Database Connection → PostgreSQL</em>, cùng các ô; <code>Ctrl+Enter</code> chạy câu hiện tại, <code>Alt+X</code> chạy cả script; sơ đồ ER của schema trong một cú bấm. Lựa chọn quen thuộc ở công ty không có giấy phép Ultimate.'}</li>
<li><strong>pgAdmin 4</strong> (${en ? 'free, PostgreSQL only, by the PostgreSQL community' : 'miễn phí, chỉ PostgreSQL, do cộng đồng PostgreSQL làm'}): ${en ? '<em>Register → Server</em>; strong on administration (roles, backups, server activity), the <em>Query Tool</em> has an auto-commit switch and a graphical EXPLAIN.' : '<em>Register → Server</em>; mạnh phần quản trị (role, sao lưu, hoạt động máy chủ), <em>Query Tool</em> có công tắc auto-commit và EXPLAIN dạng hình.'}</li>
</ul>
<p>${en ? 'What the console shows for two queries on the practice data (real output from <code>psql</code>, the same rows the grid displays):' : 'Console hiện gì với hai câu truy vấn trên dữ liệu luyện tập (output thật của <code>psql</code>, đúng các dòng lưới sẽ hiện):'}</p>
${DB_QUERY_OUT}

<h3>${en ? 'The incident: the wrong window, the wrong database' : 'Sự cố thật: nhầm cửa sổ, nhầm cơ sở dữ liệu'}</h3>
<p>${en
    ? 'On 31 January 2017 a tired GitLab.com engineer, fixing replication late at night, ran a delete command in the terminal connected to the <strong>primary</strong> database server instead of the secondary. About 300 GB of production data was gone in seconds; five backup methods turned out not to work, and GitLab lost roughly six hours of data — issues, merge requests, comments and users — for its whole platform. GitLab published a full post-mortem. The same mistake happens in a database tool every day: two tabs, “staging” and “prod”, look identical.'
    : 'Ngày 31/1/2017, một kỹ sư GitLab.com mệt mỏi, đang sửa nhân bản dữ liệu lúc nửa đêm, chạy lệnh xoá trong cửa sổ terminal đang nối vào máy chủ cơ sở dữ liệu <strong>chính</strong> thay vì máy phụ. Khoảng 300 GB dữ liệu production biến mất trong vài giây; năm cách sao lưu hoá ra đều không dùng được, và GitLab mất khoảng sáu giờ dữ liệu — issue, merge request, bình luận, người dùng — của toàn nền tảng. GitLab đã công bố postmortem đầy đủ. Cùng kiểu nhầm đó xảy ra hằng ngày trong công cụ CSDL: hai tab “staging” và “prod” trông y hệt nhau.'}</p>
<div class="callout warn"><p><strong>${en ? 'Five settings to make on every non-local connection:' : 'Năm cài đặt cho mọi kết nối không phải máy mình:'}</strong></p><ol>
<li>${en ? '<strong>Colour</strong> it: IntelliJ/DataGrip connection colour, DBeaver “Connection type: Production” (red). The console background changes.' : '<strong>Tô màu</strong>: màu kết nối của IntelliJ/DataGrip, DBeaver “Connection type: Production” (đỏ). Nền console đổi theo.'}</li>
<li>${en ? '<strong>Read-only</strong> unless your ticket requires writing.' : '<strong>Chỉ đọc (read-only)</strong> trừ khi ticket bắt buộc phải ghi.'}</li>
<li>${en ? '<strong>Manual commit</strong> (IntelliJ “Tx: Manual”, DBeaver “Manual commit”, pgAdmin auto-commit off): nothing is permanent until you commit.' : '<strong>Commit thủ công</strong> (IntelliJ “Tx: Manual”, DBeaver “Manual commit”, pgAdmin tắt auto-commit): chưa commit thì chưa có gì là vĩnh viễn.'}</li>
<li>${en ? '<strong>Confirm</strong> data-modifying statements (DBeaver asks for production connections; IntelliJ warns on <code>UPDATE</code>/<code>DELETE</code> without <code>WHERE</code>).' : '<strong>Hỏi lại</strong> trước câu lệnh sửa dữ liệu (DBeaver hỏi với kết nối production; IntelliJ cảnh báo <code>UPDATE</code>/<code>DELETE</code> thiếu <code>WHERE</code>).'}</li>
<li>${en ? '<strong>Your own account</strong> with the least rights — never the application’s account, never a shared admin.' : '<strong>Tài khoản riêng</strong> với ít quyền nhất — không dùng tài khoản của ứng dụng, không dùng admin chung.'}</li>
</ol></div>
<p>${en ? 'What “manual commit” saves you from (real session):' : 'Thứ mà “commit thủ công” cứu bạn (phiên làm việc thật):'}</p>
${DB_TX_OUT}
<p>${en ? 'Transactions and locks in depth:' : 'Giao dịch và khoá chuyên sâu:'} ${bai('postgresql', 'postgresql-11-1-giao-dich', en ? 'PostgreSQL chapter 11' : 'PostgreSQL chương 11')}.</p>

<h3>${en ? '3. Maven and Gradle windows: answering “do we use X?”' : '3. Cửa sổ Maven và Gradle: trả lời “dự án có dùng X không?”'}</h3>
<p>${en
    ? 'The Maven tool window (right edge, or Find Action “Maven”) lists <em>Lifecycle</em> goals (double-click <code>test</code>, <code>package</code>), <em>Plugins</em>, and <em>Dependencies</em> as a tree. The toolbar has <em>Toggle Offline Mode</em>, <em>Skip Tests</em>, and <em>Analyze Dependencies</em>, which shows conflicts (two versions of one library) and lets you exclude one. Gradle’s window is the same idea with tasks. Both trees answer the question that matters in an incident:'
    : 'Cửa sổ Maven (mép phải, hoặc Find Action “Maven”) liệt kê các goal của <em>Lifecycle</em> (nhấp đúp <code>test</code>, <code>package</code>), <em>Plugins</em>, và <em>Dependencies</em> dạng cây. Thanh công cụ có <em>Toggle Offline Mode</em>, <em>Skip Tests</em>, và <em>Analyze Dependencies</em> — hiện xung đột (hai phiên bản của một thư viện) và cho loại bỏ một bên. Cửa sổ Gradle cùng ý tưởng với task. Cả hai cây trả lời câu hỏi quan trọng khi có sự cố:'}</p>
<p>${en
    ? '<strong>December 2021, Log4Shell (CVE-2021-44228):</strong> a single log line containing <code>${jndi:ldap://…}</code> made <code>log4j-core</code> versions 2.0-beta9 to 2.14.1 download and run code from the attacker’s server. Within hours, every Java team in the world had to answer “are we affected?” — and the answer is in the dependency tree, because almost nobody adds <code>log4j-core</code> directly; it arrives <em>transitively</em>. For <code>gear-mini</code>:'
    : '<strong>Tháng 12/2021, Log4Shell (CVE-2021-44228):</strong> chỉ một dòng log chứa <code>${jndi:ldap://…}</code> là <code>log4j-core</code> bản 2.0-beta9 tới 2.14.1 tải và chạy mã từ máy chủ của kẻ tấn công. Trong vài giờ, mọi nhóm Java trên thế giới phải trả lời “mình có bị không?” — và câu trả lời nằm trong cây phụ thuộc, vì hầu như không ai thêm <code>log4j-core</code> trực tiếp; nó tới <em>gián tiếp</em> (transitive). Với <code>gear-mini</code>:'}</p>
${DEP_TREE}
${GRADLE_DEP}
<p>${en
    ? 'Reading it: Spring Boot logs through Logback; there is <code>log4j-api</code> and a bridge <code>log4j-to-slf4j</code>, but <strong>no <code>log4j-core</code></strong> — the vulnerable part. That is a two-minute, evidence-based answer instead of a guess. In IntelliJ: Maven window → <em>Dependencies</em>, or <em>Analyze Dependencies</em> and type <code>log4j</code> in the search box. <code>A -&gt; B</code> in Gradle means “version A was asked for, B was chosen”.'
    : 'Đọc cây: Spring Boot ghi log qua Logback; có <code>log4j-api</code> và cầu nối <code>log4j-to-slf4j</code>, nhưng <strong>không có <code>log4j-core</code></strong> — phần bị lỗ hổng. Đó là câu trả lời hai phút, có bằng chứng, thay vì phỏng đoán. Trong IntelliJ: cửa sổ Maven → <em>Dependencies</em>, hoặc <em>Analyze Dependencies</em> rồi gõ <code>log4j</code> vào ô tìm. <code>A -&gt; B</code> trong Gradle nghĩa là “yêu cầu bản A, được chọn bản B”.'}</p>

<h3>${en ? '4. Plugins: SonarQube for IDE (SonarLint), Lombok — and what not to install' : '4. Plugin: SonarQube for IDE (SonarLint), Lombok — và thứ không nên cài'}</h3>
<ul>
<li><strong>SonarQube for IDE</strong> (${en ? 'formerly SonarLint' : 'tên cũ SonarLint'}): ${en ? 'flags bugs and security smells as you type (unclosed resources, SQL built by string concatenation, hard-coded passwords). If the company runs a SonarQube server, connect the plugin to it (“connected mode”) so you see the same rules as the CI quality gate before you push.' : 'báo lỗi và dấu hiệu bảo mật ngay khi gõ (tài nguyên không đóng, SQL ghép chuỗi, mật khẩu viết cứng). Nếu công ty có máy chủ SonarQube, nối plugin vào đó (“connected mode”) để thấy đúng bộ luật của cổng chất lượng CI trước khi push.'}</li>
<li><strong>Lombok</strong>: ${en ? 'annotations (<code>@Getter</code>, <code>@RequiredArgsConstructor</code>, <code>@Builder</code>, <code>@Slf4j</code>) that generate code at compile time. IntelliJ bundles the Lombok plugin; when asked, allow <em>Enable annotation processing</em>, otherwise the editor shows red “cannot find getName()”. With Java records you need it less; on JPA entities avoid <code>@Data</code> (its <code>equals/hashCode/toString</code> touch lazy relations).' : 'annotation (<code>@Getter</code>, <code>@RequiredArgsConstructor</code>, <code>@Builder</code>, <code>@Slf4j</code>) sinh mã lúc biên dịch. IntelliJ có sẵn plugin Lombok; khi được hỏi, cho phép <em>Enable annotation processing</em>, nếu không editor báo đỏ “cannot find getName()”. Có record của Java thì ít cần nó hơn; trên entity JPA tránh <code>@Data</code> (vì <code>equals/hashCode/toString</code> của nó chạm vào quan hệ lazy).'}</li>
<li>${en ? '<strong>Worth it when the project uses them:</strong> Docker (bundled), Key Promoter X (two weeks), .env files support, the framework plugin of your stack.' : '<strong>Đáng cài khi dự án dùng:</strong> Docker (có sẵn), Key Promoter X (hai tuần), hỗ trợ file .env, plugin của framework dự án dùng.'}</li>
<li>${en ? '<strong>Do not install:</strong> “free Ultimate”/licence plugins, unknown-publisher “AI” plugins, themes that need network access. A plugin runs inside the IDE with your permissions — the same risk as VS Code extensions in lesson 1.4. Check the vendor, downloads and the source link on JetBrains Marketplace.' : '<strong>Không cài:</strong> plugin “mở khoá Ultimate miễn phí”/bẻ giấy phép, plugin “AI” của nhà phát hành lạ, theme đòi truy cập mạng. Plugin chạy trong IDE với quyền của bạn — cùng rủi ro như extension VS Code ở bài 1.4. Kiểm nhà phát hành, lượt tải và liên kết mã nguồn trên JetBrains Marketplace.'}</li>
</ul>

<h3>${en ? '💼 At work: what to ask for on day one' : '💼 Đi làm: ngày đầu xin những gì'}</h3>
<p>${en
    ? 'Ask your mentor: the Postman collection or <code>.http</code> files of the project and which environment you may call; read-only database credentials for the dev/test environment (never production on day one); the Maven <code>settings.xml</code> (lesson 2.1); and whether the company has a SonarQube server to connect to. Write the answers into your onboarding notes — Chapter 7 turns them into a checklist.'
    : 'Hỏi mentor: bộ Postman hoặc file <code>.http</code> của dự án và được phép gọi môi trường nào; tài khoản cơ sở dữ liệu chỉ-đọc cho môi trường dev/test (ngày đầu không bao giờ là production); file <code>settings.xml</code> của Maven (bài 2.1); và công ty có máy chủ SonarQube để nối không. Ghi câu trả lời vào sổ onboarding — Chương 7 biến chúng thành checklist.'}</p>

<h3>${en ? '🧪 Practice (30 minutes)' : '🧪 Thực hành (30 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Start <code>gear-mini</code>. Create <code>http/gear.http</code> and <code>http/http-client.env.json</code> as above; run all requests (IDE ▶ or the Docker CLI). Then add request 5: borrow item 2 and 4 for <code>binh.tt</code> — the second one must be rejected because the limit is 2. Write the check.' : 'Chạy <code>gear-mini</code>. Tạo <code>http/gear.http</code> và <code>http/http-client.env.json</code> như trên; chạy hết các request (▶ trong IDE hoặc CLI qua Docker). Rồi thêm request 5: mượn món 2 và 4 cho <code>binh.tt</code> — lần thứ hai phải bị từ chối vì hạn mức là 2. Viết phần kiểm tra.'}</li>
<li>${en ? 'Add <code>http-client.private.env.json</code> to <code>.gitignore</code>; prove with <code>git status</code> that it is not tracked.' : 'Thêm <code>http-client.private.env.json</code> vào <code>.gitignore</code>; chứng minh bằng <code>git status</code> rằng nó không bị theo dõi.'}</li>
<li>${en ? 'Import the same requests into Postman or Bruno (paste the cURL), create an environment with <code>host</code>, run them.' : 'Nhập cùng các request vào Postman hoặc Bruno (dán cURL), tạo environment có <code>host</code>, chạy thử.'}</li>
<li>${en ? 'Start the practice PostgreSQL, connect from DBeaver, pgAdmin or IntelliJ, set the connection to <em>Manual commit</em> and a colour, run the seed and the two queries. Then run the forgotten-<code>WHERE</code> update and roll it back.' : 'Bật PostgreSQL luyện tập, kết nối từ DBeaver, pgAdmin hoặc IntelliJ, đặt kết nối <em>Manual commit</em> và một màu, chạy seed và hai câu truy vấn. Rồi chạy câu update quên <code>WHERE</code> và rollback.'}</li>
<li>${en ? 'Find in the Maven window which version of <code>jackson-databind</code> your project uses and which starter brings it.' : 'Tìm trong cửa sổ Maven xem dự án dùng <code>jackson-databind</code> bản nào và starter nào kéo nó vào.'}</li>
<li>${en ? 'Clean up: <code>docker rm -f ide-pg</code>.' : 'Dọn dẹp: <code>docker rm -f ide-pg</code>.'}</li>
</ol>
${giai(en ? 'Hint for step 1' : 'Gợi ý bước 1', `${bash(`
### 5. Quá hạn mức (gear.max-loans = 2 ở profile mặc định; binh.tt đã mượn món 1 ở request 2)
POST {{host}}/api/gears/2/borrow?who={{who}}

###
POST {{host}}/api/gears/4/borrow?who={{who}}

> {%
  client.test("lan thu ba bi tu choi", () => client.assert(response.status === 409));
%}
`)}<p>${en ? 'If you started with the <code>dev</code> profile the limit is 5 and the check fails — which is the point of lesson 2.4.' : 'Nếu bạn chạy bằng profile <code>dev</code> thì hạn mức là 5 và phép kiểm sẽ hỏng — đúng bài học của bài 2.4.'}</p>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the <code>.http</code> run ends with <code>0 have failed tests</code> including your request 5; the private env file is ignored; the same requests work in a second tool; your DB connection is coloured and in manual commit, and the rollback left <code>an.nv</code> as borrower of item 3.' : 'lượt chạy <code>.http</code> kết thúc bằng <code>0 have failed tests</code> kể cả request 5 của bạn; file môi trường riêng bị ignore; cùng các request chạy được ở công cụ thứ hai; kết nối CSDL có màu và ở chế độ commit thủ công, và rollback để lại <code>an.nv</code> là người mượn món 3.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.http file</span><span class="v">${en ? 'Plain-text HTTP requests with variables and checks, kept in Git.' : 'Request HTTP dạng chữ có biến và phép kiểm, lưu trong Git.'}</span></div>
  <div class="kv"><span class="k">Environment (HTTP)</span><span class="v">${en ? 'Named set of variables (host, user); private file for secrets.' : 'Bộ biến có tên (host, user); file riêng cho bí mật.'}</span></div>
  <div class="kv"><span class="k">Collection (Postman)</span><span class="v">${en ? 'Postman’s group of saved requests.' : 'Nhóm request đã lưu của Postman.'}</span></div>
  <div class="kv"><span class="k">Data source</span><span class="v">${en ? 'A saved DB connection in IntelliJ/DataGrip.' : 'Một kết nối CSDL đã lưu trong IntelliJ/DataGrip.'}</span></div>
  <div class="kv"><span class="k">Manual commit</span><span class="v">${en ? 'Changes stay in a transaction until you commit.' : 'Thay đổi nằm trong giao dịch tới khi bạn commit.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Transitive dependency' : 'Phụ thuộc gián tiếp'}</span><span class="v">${en ? 'A library pulled in by another library.' : 'Thư viện được một thư viện khác kéo vào.'}</span></div>
  <div class="kv"><span class="k">Annotation processing</span><span class="v">${en ? 'Compile-time code generation (Lombok, MapStruct).' : 'Sinh mã lúc biên dịch (Lombok, MapStruct).'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? '.http files keep API calls next to the code and run in CI; Postman/Bruno are the same ideas in separate apps.' : 'File .http giữ lời gọi API cạnh mã và chạy được trong CI; Postman/Bruno là cùng ý tưởng ở ứng dụng riêng.'}</li>
<li>${en ? 'Secrets only in private env files or current values, never in shared collections.' : 'Bí mật chỉ ở file môi trường riêng hoặc giá trị current, không ở collection dùng chung.'}</li>
<li>${en ? 'Any DB tool: colour, read-only, manual commit, confirm, own account (GitLab 2017).' : 'Công cụ CSDL nào cũng vậy: tô màu, chỉ đọc, commit thủ công, hỏi lại, tài khoản riêng (GitLab 2017).'}</li>
<li>${en ? 'The dependency tree answers “are we affected?” in minutes (Log4Shell 2021).' : 'Cây phụ thuộc trả lời “mình có bị không?” trong vài phút (Log4Shell 2021).'}</li>
<li>${en ? 'Install few plugins from known vendors; enable annotation processing for Lombok.' : 'Cài ít plugin, của nhà phát hành tin cậy; bật annotation processing cho Lombok.'}</li>
</ul>
${tl('https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html', '🌐', 'IntelliJ IDEA Docs — HTTP Client', en ? 'Syntax, environments, response handlers' : 'Cú pháp, môi trường, xử lý phản hồi')}
${tl('https://www.jetbrains.com/help/idea/http-client-cli.html', '⌨️', 'IntelliJ IDEA Docs — HTTP Client CLI', en ? 'Run .http files in CI' : 'Chạy file .http trong CI')}
${tl('https://learning.postman.com/docs/sending-requests/variables/variables/', '📮', 'Postman — Variables', en ? 'Environments, initial vs current values' : 'Environment, giá trị initial và current')}
${tl('https://www.jetbrains.com/help/idea/relational-databases.html', '🗄️', 'IntelliJ IDEA Docs — Databases', en ? 'Data sources, console, transaction mode' : 'Data source, console, chế độ giao dịch')}
${tl('https://dbeaver.io/', '🦫', 'DBeaver Community', en ? 'Free universal database tool' : 'Công cụ CSDL miễn phí cho mọi loại')}
${tl('https://www.pgadmin.org/', '🐘', 'pgAdmin', en ? 'PostgreSQL administration and Query Tool' : 'Quản trị PostgreSQL và Query Tool')}
${tl('https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/', '🔥', 'GitLab — Postmortem of database outage of January 31 (2017)', en ? 'The wrong-server deletion, step by step' : 'Vụ xoá nhầm máy chủ, từng bước')}
${tl('https://nvd.nist.gov/vuln/detail/CVE-2021-44228', '🕵️', 'NVD — CVE-2021-44228 (Log4Shell)', en ? 'Affected log4j-core versions' : 'Các bản log4j-core bị ảnh hưởng')}
${tl('https://www.jetbrains.com/help/idea/work-with-maven-dependencies.html', '📦', 'IntelliJ IDEA Docs — Maven dependencies', en ? 'Dependency tree, Analyze Dependencies, exclusions' : 'Cây phụ thuộc, Analyze Dependencies, loại trừ')}
</div>
`;

/* ═════════════ 2.6 (slug ide-2-8-ai-tro-ly) — AI trợ lý trong IDE, dùng có trách nhiệm ═════════════ */
const DAN_AI = bash(`
# dan-ai/doan-dinh-dan.txt — đoạn định dán vào chat AI để hỏi "vì sao kết nối lỗi?" (giá trị đều là GIẢ)
spring.datasource.url=jdbc:postgresql://10.20.3.15:5432/khach_hang_prod
spring.datasource.username=app_prod
spring.datasource.password=Xk9#pQ2vLm7!wRt4
aws.access-key-id=AKIAIOSFODNN7EXAMPLE
aws.secret-access-key=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
github.token=ghp_GIAxxxxxxxxxxxxxxxxxxxxxxxxxxxVIDU
`);
const GITLEAKS = bash(`
docker run --rm -v "$PWD/dan-ai:/quet" zricethezav/gitleaks:latest dir /quet --no-banner --redact -v
`);
const GITLEAKS_OUT = out(`
Finding:     github.token=REDACTED
RuleID:      github-pat
Line:        7
Finding:     aws.access-key-id=REDACTED
RuleID:      aws-access-token
Line:        5
Finding:     aws.secret-access-key=REDACTED
RuleID:      generic-api-key
Line:        6
Finding:     github.token=REDACTED
RuleID:      generic-api-key
Line:        7
8:25PM INF scanned ~387 bytes (387 bytes) in 2.59ms
8:25PM WRN leaks found: 4
`);
const DA_CHE = bash(`
# Bản được phép dán: giữ CẤU TRÚC để AI hiểu, thay mọi giá trị thật bằng chỗ giữ chỗ
spring.datasource.url=jdbc:postgresql://<DB_HOST>:5432/<DB_NAME>
spring.datasource.username=<DB_USER>
spring.datasource.password=<DB_PASSWORD>
# Lỗi gặp: org.postgresql.util.PSQLException: Connection to <DB_HOST>:5432 refused.
`);
const AIIGNORE = bash(`
# .aiignore ở gốc dự án (JetBrains AI Assistant đọc file này; cú pháp giống .gitignore)
.env
.env.*
http/http-client.private.env.json
src/main/resources/application-prod.properties
**/secrets/**
*.pem
*.p12
`);
const L8 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · IntelliJ IDEA' : 'Chương 2 · IntelliJ IDEA'}</span>
<h2>${en ? '2.6 — AI assistants in the IDE, used responsibly' : '2.6 — AI trợ lý trong IDE, dùng có trách nhiệm'}</h2>
<p class="lead">${en
    ? 'AI assistants — JetBrains AI Assistant and Junie, GitHub Copilot, and others — now sit inside both IntelliJ and VS Code: they complete lines, answer questions about the open file, and as agents edit several files. Used well they save real time. Used carelessly they send your company’s code and secrets to a third party, and put code you do not understand into a customer’s product. This lesson is about the second part: what leaves your machine, the rules at an outsourcing company, and a five-step habit before every prompt.'
    : 'Trợ lý AI — JetBrains AI Assistant và Junie, GitHub Copilot, và nhiều công cụ khác — giờ nằm ngay trong IntelliJ lẫn VS Code: gợi ý cả dòng, trả lời câu hỏi về file đang mở, và ở dạng agent thì sửa nhiều file. Dùng đúng thì tiết kiệm thời gian thật. Dùng ẩu thì gửi mã và bí mật của công ty cho bên thứ ba, và đưa vào sản phẩm của khách hàng những dòng mã bạn không hiểu. Bài này nói về phần thứ hai: cái gì rời khỏi máy bạn, luật ở công ty outsourcing, và một thói quen năm bước trước mỗi câu prompt.'}</p>
<p>${en ? 'How to work productively with coding agents is a whole course:' : 'Cách làm việc hiệu quả với agent viết mã là cả một khoá:'} ${bai('ai-coding', 'ai-0-2-chon-cong-cu', en ? 'AI coding, 0.2 — tool map' : 'AI coding, 0.2 — bản đồ công cụ')}. ${en ? 'Here we cover only the IDE side and the safety rules.' : 'Ở đây chỉ nói phía IDE và luật an toàn.'}</p>

<h3>${en ? 'What actually leaves your machine' : 'Cái gì thực sự rời khỏi máy bạn'}</h3>
<div class="lz-flow">
  <div class="lz-step"><strong>1.</strong> ${en ? 'You type or pause — the plugin collects <em>context</em>: the current file, the selection, nearby or recently opened files, sometimes the project structure.' : 'Bạn gõ hoặc dừng tay — plugin gom <em>ngữ cảnh</em>: file đang mở, đoạn đang chọn, các file lân cận hoặc vừa mở, đôi khi cả cấu trúc dự án.'}</div>
  <div class="lz-step"><strong>2.</strong> ${en ? 'That context plus your prompt is sent over HTTPS to the vendor’s or a model provider’s servers (unless you run a local model).' : 'Ngữ cảnh đó cùng câu prompt được gửi qua HTTPS tới máy chủ của nhà cung cấp hoặc của bên cung cấp mô hình (trừ khi bạn chạy mô hình cục bộ).'}</div>
  <div class="lz-step"><strong>3.</strong> ${en ? 'The answer comes back. Whether the input is stored, logged or used for training depends on the <strong>plan and contract</strong> (personal free tier vs company/enterprise licence) — not on the plugin’s icon.' : 'Câu trả lời quay về. Dữ liệu đầu vào có bị lưu, ghi log hay dùng để huấn luyện hay không tuỳ vào <strong>gói và hợp đồng</strong> (bản cá nhân miễn phí hay giấy phép doanh nghiệp) — không tuỳ vào biểu tượng của plugin.'}</div>
</div>
<p>${en
    ? 'Everyday comparison: asking an AI about customer code is like photocopying a page of the customer’s contract and handing it to a stranger who promises to help. Maybe the stranger is trustworthy and bound by a contract with your company; maybe not. You do not get to decide that alone.'
    : 'Liên tưởng đời thường: hỏi AI về mã của khách hàng giống như photo một trang hợp đồng của khách rồi đưa cho một người lạ hứa sẽ giúp. Có thể người đó đáng tin và có hợp đồng ràng buộc với công ty bạn; cũng có thể không. Bạn không được tự mình quyết điều đó.'}</p>

<h3>${en ? 'The incident: Samsung, 2023' : 'Sự cố thật: Samsung, 2023'}</h3>
<p>${en
    ? 'In spring 2023, shortly after Samsung’s semiconductor division allowed engineers to use ChatGPT, staff pasted confidential material into it on at least three occasions — source code to check for errors, code for optimisation, and a recording of an internal meeting to turn into minutes. Samsung could not retrieve data already sent to an outside service, and in May 2023 banned generative AI tools on company devices and networks while it built internal ones (reported by Bloomberg and others). Nobody was malicious; each engineer was just trying to work faster.'
    : 'Mùa xuân 2023, không lâu sau khi bộ phận bán dẫn của Samsung cho kỹ sư dùng ChatGPT, nhân viên đã dán tài liệu mật vào đó ít nhất ba lần — mã nguồn để nhờ tìm lỗi, mã để nhờ tối ưu, và bản ghi một cuộc họp nội bộ để nhờ viết biên bản. Samsung không thể lấy lại dữ liệu đã gửi ra dịch vụ bên ngoài, và tháng 5/2023 cấm dùng công cụ AI tạo sinh trên thiết bị và mạng công ty trong lúc tự xây công cụ nội bộ (Bloomberg và nhiều báo đưa tin). Không ai có ý xấu; mỗi kỹ sư chỉ muốn làm nhanh hơn.'}</p>

<h3>${en ? 'Rules at an outsourcing company (FPT Software and the like)' : 'Luật ở công ty outsourcing (FPT Software và tương tự)'}</h3>
<ul>
<li>${en ? 'The code belongs to the <strong>customer</strong>, and your project is covered by an NDA and the company’s information-security rules (ISMS, often ISO/IEC 27001). Some customers forbid AI tools entirely, some allow only a company-approved tool with an enterprise account, some allow it with conditions. <strong>The project’s rule wins over your habit</strong> — ask your PM/mentor on day one which AI tools are allowed on this project.' : 'Mã thuộc về <strong>khách hàng</strong>, và dự án của bạn chịu NDA cùng quy định an ninh thông tin của công ty (ISMS, thường theo ISO/IEC 27001). Có khách cấm hẳn công cụ AI, có khách chỉ cho dùng công cụ được công ty duyệt với tài khoản doanh nghiệp, có khách cho dùng kèm điều kiện. <strong>Luật của dự án thắng thói quen của bạn</strong> — ngày đầu hỏi PM/mentor dự án này được dùng công cụ AI nào.'}</li>
<li>${en ? 'Never use a <strong>personal</strong> account or free tier on customer code, even if the company tool is slower.' : 'Không bao giờ dùng tài khoản <strong>cá nhân</strong> hay bản miễn phí với mã của khách hàng, kể cả khi công cụ của công ty chậm hơn.'}</li>
<li>${en ? 'Never paste: passwords, tokens, keys, connection strings, internal hostnames/IPs, customer or user data (names, emails, phone numbers — also in logs and SQL results), the customer’s name together with their code.' : 'Không bao giờ dán: mật khẩu, token, khoá, chuỗi kết nối, tên máy/IP nội bộ, dữ liệu khách hàng hay người dùng (tên, email, số điện thoại — kể cả trong log và kết quả SQL), tên khách hàng đi kèm mã của họ.'}</li>
<li>${en ? 'If a secret was sent by mistake: tell your lead immediately so it can be rotated. Hiding it is the only truly bad choice.' : 'Lỡ gửi một bí mật: báo trưởng nhóm ngay để đổi khoá. Giấu đi là lựa chọn tệ duy nhất.'}</li>
</ul>
<p>${en ? 'More on privacy, licences and company policy:' : 'Thêm về quyền riêng tư, giấy phép và chính sách công ty:'} ${bai('ai-coding', 'ai-8-4-rieng-tu', en ? 'AI coding 8.4' : 'AI coding 8.4')}.</p>

<h3>${en ? 'Try it: a scanner catches tokens — not your password' : 'Thử thật: máy quét bắt được token — không bắt được mật khẩu của bạn'}</h3>
<p>${en ? 'A config snippet a developer is about to paste into a chat (all values are fake):' : 'Một đoạn cấu hình lập trình viên sắp dán vào chat (mọi giá trị đều giả):'}</p>
${DAN_AI}
${GITLEAKS}
${GITLEAKS_OUT}
<p>${en
    ? 'gitleaks 8.30.1 found the GitHub token and the AWS keys, because they have recognisable formats (<code>ghp_…</code>, <code>AKIA…</code>). It did <strong>not</strong> flag the database password, the internal IP <code>10.20.3.15</code>, the production database name or the account name — and those are exactly what an attacker needs next. Lesson: scanners are a safety net, not the check. You redact by hand, keeping the structure so the AI can still help:'
    : 'gitleaks 8.30.1 tìm ra token GitHub và khoá AWS, vì chúng có định dạng nhận ra được (<code>ghp_…</code>, <code>AKIA…</code>). Nó <strong>không</strong> báo mật khẩu cơ sở dữ liệu, IP nội bộ <code>10.20.3.15</code>, tên cơ sở dữ liệu production hay tên tài khoản — mà đó chính là thứ kẻ tấn công cần tiếp theo. Bài học: máy quét là lưới an toàn, không phải phép kiểm chính. Bạn tự che bằng tay, giữ nguyên cấu trúc để AI vẫn giúp được:'}</p>
${DA_CHE}

<h3>${en ? 'Keeping files out of the AI’s context' : 'Giữ file ngoài ngữ cảnh của AI'}</h3>
<p>${en
    ? 'Most assistants let you exclude files. JetBrains AI Assistant reads a <code>.aiignore</code> file (gitignore syntax) in the project root; GitHub Copilot Business/Enterprise has <em>content exclusion</em> set by the organisation or repository admin; agents in the terminal usually honour their own ignore/permission settings. Exclude at least:'
    : 'Phần lớn trợ lý cho loại trừ file. JetBrains AI Assistant đọc file <code>.aiignore</code> (cú pháp như gitignore) ở gốc dự án; GitHub Copilot Business/Enterprise có <em>content exclusion</em> do quản trị tổ chức hoặc repo đặt; agent chạy trong terminal thường có cài đặt bỏ qua/quyền riêng. Ít nhất hãy loại:'}</p>
${AIIGNORE}
<p>${en ? 'Exclusion lowers the risk of <em>automatic</em> context; it does nothing if you copy-paste the content yourself.' : 'Loại trừ giảm rủi ro với ngữ cảnh <em>tự động</em>; nó vô dụng nếu chính bạn copy-paste nội dung vào.'}</p>

<h3>${en ? 'Five steps before accepting AI code' : 'Năm bước trước khi nhận mã AI viết'}</h3>
<ol>
<li>${en ? '<strong>Read every line</strong> and be able to explain it in a code review. If you cannot, do not commit it.' : '<strong>Đọc từng dòng</strong> và giải thích được nó khi review. Không giải thích được thì không commit.'}</li>
<li>${en ? '<strong>Run the tests</strong> (lesson 2.4) — and ask whether there is a test for what the AI changed.' : '<strong>Chạy test</strong> (bài 2.4) — và hỏi đã có test cho phần AI vừa sửa chưa.'}</li>
<li>${en ? '<strong>Check every new dependency and API</strong> exists: AI invents package names, and attackers register those names (“slopsquatting”, see ' : '<strong>Kiểm mọi thư viện và API mới</strong> có thật: AI bịa tên gói, và kẻ tấn công đăng ký đúng những tên đó (“slopsquatting”, xem '}${bai('ai-coding', 'ai-2-3-ao-giac', 'AI coding 2.3')}).</li>
<li>${en ? '<strong>Use the IDE for mechanical changes.</strong> Rename, move, change signature: <code>Shift+F6</code>, <code>F6</code>, <code>Ctrl+F6</code> are exact and complete; an AI doing the same edit by text can miss a usage (lesson 2.3).' : '<strong>Dùng IDE cho thay đổi cơ học.</strong> Đổi tên, chuyển, đổi chữ ký: <code>Shift+F6</code>, <code>F6</code>, <code>Ctrl+F6</code> chính xác và đầy đủ; AI làm cùng việc bằng cách sửa chữ có thể sót một chỗ dùng (bài 2.3).'}</li>
<li>${en ? '<strong>Look at the diff before committing</strong> (Chapter 5): agents sometimes touch files you did not ask about.' : '<strong>Xem diff trước khi commit</strong> (Chương 5): agent đôi khi sửa cả file bạn không nhờ.'}</li>
</ol>
<div class="callout ok"><p>${en
    ? '<strong>Where AI genuinely helps a newcomer:</strong> explaining an unfamiliar framework annotation, drafting a unit test you then fix, translating a long English stack trace, suggesting a regex you then test (Chapter 4), writing a commit message from a diff you have read. Note what each of these has in common: <em>you</em> remain the one who checks.'
    : '<strong>Chỗ AI giúp người mới thật sự:</strong> giải thích một annotation lạ của framework, soạn nháp unit test để bạn sửa, giải nghĩa stack trace tiếng Anh dài, đề xuất regex để bạn thử lại (Chương 4), viết commit message từ diff bạn đã đọc. Để ý điểm chung: <em>bạn</em> vẫn là người kiểm.'}</p></div>

<h3>${en ? '💼 Interview: “Do you use AI when you code?”' : '💼 Phỏng vấn: “Em có dùng AI khi code không?”'}</h3>
<p>${en
    ? 'A strong answer is neither “never” nor “for everything”: “Yes, for explanations, test drafts and boilerplate. I read and test everything it writes, I do renames and moves with the IDE’s refactorings, and on customer code I only use the tool the project allows, without pasting secrets or personal data.” Then give one concrete example where AI was wrong and how your test caught it.'
    : 'Câu trả lời tốt không phải “không bao giờ” cũng không phải “dùng cho mọi thứ”: “Có ạ, để giải thích, soạn nháp test và mã lặp. Em đọc và test mọi thứ nó viết, đổi tên hay chuyển file thì dùng refactor của IDE, và với mã của khách hàng em chỉ dùng công cụ dự án cho phép, không dán bí mật hay dữ liệu cá nhân.” Rồi kể một ví dụ cụ thể AI sai và test của bạn đã bắt được.'}</p>

<h3>${en ? '🧪 Practice (15 minutes)' : '🧪 Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Create <code>dan-ai/doan-dinh-dan.txt</code> above and run gitleaks. Which lines are <em>not</em> reported?' : 'Tạo <code>dan-ai/doan-dinh-dan.txt</code> như trên và chạy gitleaks. Những dòng nào <em>không</em> bị báo?'}</li>
<li>${en ? 'Write the redacted version yourself, then run gitleaks on it: 0 leaks — and check by eye that the IP, database name and password are gone too.' : 'Tự viết bản đã che, rồi chạy gitleaks trên nó: 0 rò rỉ — và kiểm bằng mắt rằng IP, tên cơ sở dữ liệu và mật khẩu cũng đã biến mất.'}</li>
<li>${en ? 'Add a <code>.aiignore</code> to <code>gear-mini</code> covering <code>.env</code> and the private HTTP environment file.' : 'Thêm <code>.aiignore</code> vào <code>gear-mini</code> loại <code>.env</code> và file môi trường HTTP riêng.'}</li>
<li>${en ? 'Write three questions to ask your mentor on day one about AI tools on the project (allowed tool? account type? data rules?).' : 'Viết ba câu hỏi để hỏi mentor ngày đầu về công cụ AI trong dự án (công cụ nào được phép? loại tài khoản? luật về dữ liệu?).'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you can name the three kinds of sensitive values a scanner missed, your redacted snippet still explains the error, and your three questions are in your onboarding notes.' : 'bạn kể được ba loại giá trị nhạy cảm mà máy quét bỏ sót, đoạn đã che vẫn đủ để mô tả lỗi, và ba câu hỏi đã nằm trong sổ onboarding.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Context (AI)' : 'Context (ngữ cảnh AI)'}</span><span class="v">${en ? 'Files and text the plugin sends with your prompt.' : 'File và chữ mà plugin gửi kèm câu prompt.'}</span></div>
  <div class="kv"><span class="k">NDA / ISMS</span><span class="v">${en ? 'Confidentiality agreement / information-security management rules.' : 'Thoả thuận bảo mật / hệ thống quy định quản lý an ninh thông tin.'}</span></div>
  <div class="kv"><span class="k">.aiignore / content exclusion</span><span class="v">${en ? 'Files the assistant must not read automatically.' : 'File mà trợ lý không được tự động đọc.'}</span></div>
  <div class="kv"><span class="k">Redaction</span><span class="v">${en ? 'Replacing real values with placeholders before sharing.' : 'Thay giá trị thật bằng chỗ giữ chỗ trước khi chia sẻ.'}</span></div>
  <div class="kv"><span class="k">Slopsquatting</span><span class="v">${en ? 'Registering package names that AI tends to invent.' : 'Đăng ký những tên gói mà AI hay bịa ra.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Context leaves your machine; the contract, not the plugin, decides what happens to it.' : 'Ngữ cảnh rời khỏi máy bạn; hợp đồng, không phải plugin, quyết định số phận của nó.'}</li>
<li>${en ? 'Customer code: only the project-approved tool and account; never secrets or personal data (Samsung 2023).' : 'Mã khách hàng: chỉ công cụ và tài khoản dự án cho phép; không bao giờ dán bí mật hay dữ liệu cá nhân (Samsung 2023).'}</li>
<li>${en ? 'Scanners miss plain passwords and internal names — redact by hand.' : 'Máy quét bỏ sót mật khẩu thường và tên nội bộ — tự che bằng tay.'}</li>
<li>${en ? 'Read, test, verify dependencies, use IDE refactorings, review the diff.' : 'Đọc, test, kiểm thư viện, dùng refactor của IDE, xem diff.'}</li>
</ul>
${tl('https://www.jetbrains.com/help/ai-assistant/disable-ai-assistant.html', '🤖', 'JetBrains AI Assistant Docs — restrict and exclude files (.aiignore)', en ? 'Turning AI off per project and excluding files' : 'Tắt AI theo dự án và loại trừ file')}
${tl('https://docs.github.com/en/copilot/managing-copilot/configuring-and-auditing-content-exclusion/excluding-content-from-github-copilot', '🐙', 'GitHub Docs — Excluding content from GitHub Copilot', en ? 'Content exclusion for organisations and repositories' : 'Loại trừ nội dung cho tổ chức và repo')}
${tl('https://github.com/gitleaks/gitleaks', '🔍', 'gitleaks', en ? 'Secret scanner used in this lesson and in 6.1' : 'Máy quét bí mật dùng ở bài này và bài 6.1')}
${tl('https://www.bloomberg.com/news/articles/2023-05-02/samsung-bans-chatgpt-and-other-generative-ai-use-by-staff-after-leak', '📰', 'Bloomberg — Samsung bans staff’s AI use after spotting ChatGPT data leak (02/05/2023)', en ? 'The incident and the ban' : 'Sự cố và lệnh cấm')}
</div>
`;

/* ═════════════ 2.7 (slug ide-2-6-lab) — Lab bấm giờ ═════════════ */
const LAB_BAT_DAU = bash(`
cd ~/do-nghe/gear-mini
git status --short                 # phải rỗng — làm sạch hoặc commit trước khi bấm giờ
git switch -c lab-2-tra-do
./mvnw -q test && echo "XANH TRUOC KHI BAT DAU"
`);
const LAB_KQ = out(`
$ ./mvnw test
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS

$ docker run --rm --network host -v "$PWD/http:/workdir" jetbrains/intellij-http-client -v http-client.env.json -e may-ide --no-progress gear.http
Request '1. Danh sách thiết bị còn trống' GET http://localhost:41808/api/gears/available
Request '2. Mượn Arduino cho binh.tt' POST http://localhost:41808/api/gears/1/borrow?who=binh.tt
Request '3. Mượn lại đúng món đó — phải bị từ chối 409' POST http://localhost:41808/api/gears/1/borrow?who=chi.lm
Request '4. Thiết bị không tồn tại' POST http://localhost:41808/api/gears/99/borrow?who=binh.tt
Request '5. Trả lại món 1' POST http://localhost:41808/api/gears/1/return
Request '6. Trả món chưa ai mượn — 409' POST http://localhost:41808/api/gears/2/return
6 requests completed, 0 have failed tests
RUN SUCCESSFUL
`);
const LAB_SERVICE = java(`
public Gear borrow(long id, String who) {
    Gear g = findOrThrow(id);                      // việc 3: Extract Method từ dòng repo.findById(...)
    requireAvailable(g);
    requireUnderLimit(who);
    return repo.save(new Gear(g.id(), g.name(), g.type(), who));
}

public Gear returnGear(long id) {                  // việc 5: Alt+Enter → Create method từ test
    Gear g = findOrThrow(id);                      // IntelliJ đề nghị thay đoạn trùng khi Extract ⇒ dùng lại
    if (g.available()) {
        throw new IllegalStateException(g.name() + " chua duoc ai muon");
    }
    return repo.save(new Gear(g.id(), g.name(), g.type(), null));
}

private Gear findOrThrow(long id) {
    return repo.findById(id).orElseThrow(() -> new GearNotFoundException(id));
}
`);
const LAB_CONTROLLER = java(`
@PostMapping("/{id}/return")
public Gear returnGear(@PathVariable long id) {
    return service.returnGear(id);
}
`);
const LAB_TEST = java(`
@Test
void traDoXongThiMonDoTrongLai() {                 // gõ "jt" + Tab (live template bài 2.3)
    // given
    service.borrow(1, "binh.tt");
    // when
    Gear g = service.returnGear(1);                 // gõ service.returnGear(1).var + Tab
    // then
    assertTrue(g.available());
    assertEquals(3, service.available().size());
}

@Test
void traDoChuaAiMuonBiTuChoi() {
    assertThrows(IllegalStateException.class, () -> service.returnGear(2));
}
`);
const LAB_HTTP = bash(`
### 5. Trả lại món 1
POST {{host}}/api/gears/1/return

> {%
  client.test("tra xong thi borrower = null", () => client.assert(response.body.borrower === null));
%}

### 6. Trả món chưa ai mượn — 409
POST {{host}}/api/gears/2/return

> {%
  client.test("409 khi tra do chua muon", () => client.assert(response.status === 409));
%}
`);
const DAP_PV = (en) => `<ol>
<li>${en ? 'Find Usages (Alt+F7/⌥F7) on the method, plus Call Hierarchy to walk up to the endpoints; then a whole-word text search for names that reach it by reflection, Spring expressions, templates or config. Mention that you wait for indexing and check test vs production usages separately.' : 'Find Usages (Alt+F7/⌥F7) trên method, kèm Call Hierarchy để đi ngược lên tới endpoint; rồi tìm chữ nguyên từ cho những chỗ gọi qua reflection, biểu thức Spring, template hay cấu hình. Nói thêm là chờ lập chỉ mục xong và xem riêng nơi dùng trong test với mã chính.'}</li>
<li>${en ? 'With the IDE’s Rename (Shift+F6), reviewing the preview for comments/strings, then build + tests; never find-and-replace. For a public API used by other services: add the new name, deprecate the old one, remove later.' : 'Bằng Rename của IDE (Shift+F6), duyệt bản xem trước với chú thích/chuỗi, rồi build + test; không tìm-và-thay. Với API công khai được service khác dùng: thêm tên mới, đánh dấu tên cũ deprecated, xoá sau.'}</li>
<li>${en ? 'Check in order: indexing finished, correct folder (with pom.xml), Project SDK ≥ java.version, reload Maven, read the Build window, run ./mvnw -U in the terminal; only then Repair IDE / Invalidate Caches. At a company also check settings.xml/proxy.' : 'Kiểm theo thứ tự: lập chỉ mục xong chưa, đúng thư mục (có pom.xml), Project SDK ≥ java.version, nạp lại Maven, đọc cửa sổ Build, chạy ./mvnw -U trong terminal; tới đây mới Repair IDE / Invalidate Caches. Ở công ty kiểm thêm settings.xml/proxy.'}</li>
<li>${en ? 'Spring’s layered configuration: command-line args &gt; system properties/environment variables &gt; profile files &gt; application.properties. Compare the run configuration with the server’s environment and reproduce with java -jar.' : 'Cấu hình xếp tầng của Spring: tham số dòng lệnh &gt; system property/biến môi trường &gt; file profile &gt; application.properties. So run configuration với môi trường máy chủ rồi tái hiện bằng java -jar.'}</li>
<li>${en ? 'Read the dependency tree (Maven/Gradle window or mvn dependency:tree) for log4j-core and its version; say how you would fix it (upgrade the starter/BOM, or pin/exclude) and verify with the tree again.' : 'Đọc cây phụ thuộc (cửa sổ Maven/Gradle hoặc mvn dependency:tree) tìm log4j-core và phiên bản; nói cách sửa (nâng starter/BOM, hoặc ghim/loại trừ) rồi kiểm lại bằng cây.'}</li>
</ol>`;
const L6 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · Lab' : 'Chương 2 · Lab'}</span>
<h2>${en ? '2.7 — Lab: A timed Spring Boot task list: navigate, refactor, run tests' : '2.7 — Lab: Danh sách việc Spring Boot có bấm giờ: điều hướng, refactor, chạy test'}</h2>
<p class="lead">${en
    ? 'A realistic ticket on <code>gear-mini</code>: “Users must be able to return equipment.” You will navigate, refactor, add a feature with tests and an HTTP check, and commit cleanly — all inside IntelliJ, with a timer. The point is not to type fast; it is to let the IDE do every mechanical change.'
    : 'Một ticket sát thực tế trên <code>gear-mini</code>: “Người dùng phải trả được thiết bị.” Bạn sẽ điều hướng, refactor, thêm tính năng kèm test và một phép kiểm HTTP, rồi commit gọn gàng — tất cả trong IntelliJ, có bấm giờ. Mục tiêu không phải gõ nhanh; mà là để IDE làm mọi thay đổi cơ học.'}</p>

<h3>${en ? 'Starting point' : 'Điểm xuất phát'}</h3>
<p>${en ? '<code>gear-mini</code> with the code from lesson 2.1 and the <code>http/</code> files from lesson 2.5; if you already refactored <code>borrow</code> in 2.3, reset with <code>git restore .</code> or keep it and skip task 2.' : '<code>gear-mini</code> có mã của bài 2.1 và các file <code>http/</code> của bài 2.5; nếu ở bài 2.3 bạn đã refactor <code>borrow</code> thì đưa về bằng <code>git restore .</code>, hoặc giữ nguyên và bỏ qua việc 2.'}</p>
${LAB_BAT_DAU}

<h3>${en ? 'Ticket GEAR-12 — twelve tasks (timer on)' : 'Ticket GEAR-12 — mười hai việc (bấm giờ)'}</h3>
<table>
<thead><tr><th>#</th><th>${en ? 'Task' : 'Việc'}</th><th>${en ? 'Expected tool' : 'Công cụ mong đợi'}</th></tr></thead>
<tbody>
<tr><td>1</td><td>${en ? 'From <code>GearController.borrow</code>, reach the class that stores data and come back.' : 'Từ <code>GearController.borrow</code>, tới class lưu dữ liệu rồi quay lại.'}</td><td>Ctrl+B, Ctrl+Alt+B, Ctrl+Alt+← (⌘B, ⌥⌘B, ⌘⌥←)</td></tr>
<tr><td>2</td><td>${en ? 'Extract <code>requireAvailable</code>, <code>requireUnderLimit</code> from <code>borrow</code>.' : 'Tách <code>requireAvailable</code>, <code>requireUnderLimit</code> khỏi <code>borrow</code>.'}</td><td>Ctrl+W, Ctrl+Alt+M (⌥↑, ⌥⌘M)</td></tr>
<tr><td>3</td><td>${en ? 'Extract the lookup line into <code>findOrThrow(long id)</code>.' : 'Tách dòng tra cứu thành <code>findOrThrow(long id)</code>.'}</td><td>Ctrl+Alt+M (⌥⌘M)</td></tr>
<tr><td>4</td><td>${en ? 'Rename <code>maxLoans()</code> → <code>loanLimit()</code>.' : 'Đổi tên <code>maxLoans()</code> → <code>loanLimit()</code>.'}</td><td>Shift+F6 (⇧F6)</td></tr>
<tr><td>5</td><td>${en ? 'Run tests. Commit 1: <code>refactor: ...</code>.' : 'Chạy test. Commit 1: <code>refactor: ...</code>.'}</td><td>Ctrl+Shift+F10, Ctrl+K (⌃⇧R, ⌘K)</td></tr>
<tr><td>6</td><td>${en ? 'In <code>GearServiceTest</code> write a test that returns item 1 after borrowing it — using <code>service.returnGear(1)</code>, which does not exist yet.' : 'Trong <code>GearServiceTest</code> viết test trả món 1 sau khi mượn — dùng <code>service.returnGear(1)</code>, thứ chưa tồn tại.'}</td><td>${en ? 'live template <code>jt</code>, postfix <code>.var</code>' : 'live template <code>jt</code>, postfix <code>.var</code>'}</td></tr>
<tr><td>7</td><td>${en ? 'Create <code>returnGear</code> from the red call and implement it (reject if not borrowed).' : 'Tạo <code>returnGear</code> từ lời gọi đỏ và viết thân (từ chối nếu chưa ai mượn).'}</td><td>Alt+Enter (⌥↩) → Create method</td></tr>
<tr><td>8</td><td>${en ? 'Add a second test: returning an item nobody borrowed throws.' : 'Thêm test thứ hai: trả món chưa ai mượn phải ném lỗi.'}</td><td>Alt+Insert → Test Method (⌘N)</td></tr>
<tr><td>9</td><td>${en ? 'Add <code>POST /api/gears/{id}/return</code> to the controller.' : 'Thêm <code>POST /api/gears/{id}/return</code> vào controller.'}</td><td>Ctrl+Shift+T / Ctrl+E (⇧⌘T / ⌘E)</td></tr>
<tr><td>10</td><td>${en ? 'Run all tests with coverage: <code>returnGear</code> fully green.' : 'Chạy toàn bộ test kèm độ phủ: <code>returnGear</code> xanh trọn.'}</td><td>Run with Coverage</td></tr>
<tr><td>11</td><td>${en ? 'Start the app, add requests 5–6 to <code>gear.http</code>, run the file: 0 failed.' : 'Chạy ứng dụng, thêm request 5–6 vào <code>gear.http</code>, chạy cả file: 0 hỏng.'}</td><td>${en ? 'HTTP Client / CLI' : 'HTTP Client / CLI'}</td></tr>
<tr><td>12</td><td>${en ? 'Reformat only changed lines, optimize imports, commit 2: <code>feat(gear): return equipment</code>.' : 'Định dạng riêng các dòng đã sửa, dọn import, commit 2: <code>feat(gear): tra thiet bi</code>.'}</td><td>Ctrl+Alt+L, Ctrl+Alt+O (⌥⌘L, ⌃⌥O)</td></tr>
</tbody>
</table>
<p>${en ? 'Real result of the reference solution on this course’s machine:' : 'Kết quả thật của lời giải mẫu trên máy của khoá:'}</p>
${LAB_KQ}

<h3>${en ? 'Hints (open one at a time)' : 'Gợi ý (mở từng cái một)'}</h3>
${giai(en ? 'Hint 1 — tasks 2–3' : 'Gợi ý 1 — việc 2–3', `<p>${en ? 'When you extract <code>findOrThrow</code>, IntelliJ asks whether to replace other occurrences of the same code. After task 7 there is a second occurrence in <code>returnGear</code> — run Extract again or use <em>Refactor → Find and Replace Code Duplicates</em>.' : 'Khi tách <code>findOrThrow</code>, IntelliJ hỏi có thay các chỗ trùng đoạn mã không. Sau việc 7 sẽ có chỗ trùng thứ hai trong <code>returnGear</code> — tách lại hoặc dùng <em>Refactor → Find and Replace Code Duplicates</em>.'}</p>`)}
${giai(en ? 'Hint 2 — task 12 “only changed lines”' : 'Gợi ý 2 — việc 12 “chỉ các dòng đã sửa”', `<p>${en ? 'In the commit window (Ctrl+K/⌘K), gear icon → tick <em>Reformat code</em> and <em>Optimize imports</em>; IntelliJ applies them to changed lines only (setting <em>VCS changed text</em>). Reformatting the whole file would add noise to the diff.' : 'Trong cửa sổ commit (Ctrl+K/⌘K), biểu tượng bánh răng → tích <em>Reformat code</em> và <em>Optimize imports</em>; IntelliJ chỉ áp lên dòng đã đổi (tuỳ chọn <em>VCS changed text</em>). Định dạng cả file sẽ làm diff đầy nhiễu.'}</p>`)}
${giai(en ? 'Reference solution (open after finishing)' : 'Lời giải mẫu (mở sau khi làm xong)', `${LAB_SERVICE}${LAB_CONTROLLER}${LAB_TEST}${LAB_HTTP}`)}

<h3>${en ? 'Rubric' : 'Tiêu chí chấm (rubric)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'All 12 tasks done, <code>./mvnw test</code> 6/6 green' : 'Đủ 12 việc, <code>./mvnw test</code> xanh 6/6'}</td><td>3</td></tr>
<tr><td>${en ? 'Every rename/extract done with a refactoring (check: no compile error ever appeared)' : 'Mọi đổi tên/tách hàm đều bằng refactor (dấu hiệu: không lần nào gặp lỗi biên dịch)'}</td><td>2</td></tr>
<tr><td>${en ? '<code>gear.http</code> 6 requests, 0 failed' : '<code>gear.http</code> 6 request, 0 hỏng'}</td><td>2</td></tr>
<tr><td>${en ? 'Two commits: refactor separate from feature; diff has no unrelated formatting' : 'Hai commit: refactor tách khỏi tính năng; diff không có định dạng thừa'}</td><td>2</td></tr>
<tr><td>${en ? 'Time under 20 minutes, mouse not used' : 'Dưới 20 phút, không dùng chuột'}</td><td>1</td></tr>
</tbody>
</table>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? '8/10 or more. Write your time next to your Section 0 starting time — Chapter 7 compares them.' : 'từ 8/10 trở lên. Ghi thời gian của bạn cạnh thời gian xuất phát ở Mục 0 — Chương 7 sẽ so hai con số.'}</p>
<div class="callout ok"><p><strong>${en ? 'Extra challenge' : 'Thử thách thêm'}</strong> — ${en ? 'wire <code>LoanPolicy</code> into the loan: add a <code>dueDays</code> field to the response using Change Signature (<code>borrow(id, who, policy)</code>, default <code>new StudentPolicy()</code>), with a test for a lecturer (30 days). Still under 25 minutes?' : 'nối <code>LoanPolicy</code> vào việc mượn: thêm trường <code>dueDays</code> vào phản hồi bằng Change Signature (<code>borrow(id, who, policy)</code>, mặc định <code>new StudentPolicy()</code>), kèm test cho giảng viên (30 ngày). Vẫn dưới 25 phút?'}</p></div>

<h3>${en ? '🎤 What an interviewer will ask about this chapter' : '🎤 Phỏng vấn viên sẽ hỏi gì về chương này'}</h3>
<ol>
<li>${en ? '“You need to change a method’s parameters. How do you find every place that calls it?”' : '“Em cần đổi tham số của một method. Em tìm mọi chỗ gọi nó thế nào?”'}</li>
<li>${en ? '“How do you rename a widely used method safely?”' : '“Em đổi tên an toàn một method được dùng ở nhiều nơi thế nào?”'}</li>
<li>${en ? '“You clone our project and everything is red in IntelliJ. What do you do?”' : '“Em clone dự án của bọn anh về và IntelliJ đỏ hết. Em làm gì?”'}</li>
<li>${en ? '“It works in your IDE but not on the test server. Where do you look?”' : '“Trong IDE của em chạy mà lên máy test thì không. Em tìm ở đâu?”'}</li>
<li>${en ? '“A critical vulnerability is announced in log4j-core. How do you check our service in five minutes?”' : '“Có lỗ hổng nghiêm trọng công bố trong log4j-core. Em kiểm service của bọn anh trong năm phút thế nào?”'}</li>
</ol>
${giai(en ? 'Model answers' : 'Gợi ý trả lời', DAP_PV(en))}

<h3>${en ? '🛠 Project milestone' : '🛠 Mốc dự án'}</h3>
<p>${en
    ? 'Apply this chapter to the project you registered at the start of the course (or to your SWP/capstone Spring project): commit a shared run configuration in <code>.run/</code> without secrets, an <code>http/</code> folder with at least five checked requests for your main endpoints, a <code>.aiignore</code>, and one refactor commit made only with IDE refactorings. Note in your README which JDK and IntelliJ settings a newcomer needs — Chapter 6 automates the rest.'
    : 'Áp chương này vào dự án bạn đã đăng ký đầu khoá (hoặc dự án Spring của SWP/đồ án): commit một run configuration dùng chung trong <code>.run/</code> không chứa bí mật, một thư mục <code>http/</code> có ít nhất năm request có phép kiểm cho các endpoint chính, một file <code>.aiignore</code>, và một commit refactor làm hoàn toàn bằng refactor của IDE. Ghi trong README người mới cần JDK nào và cài đặt IntelliJ gì — Chương 6 tự động hoá phần còn lại.'}</p>
</div>
`;

/* ═════════════ 2.8 (slug ide-2-7-quiz) — Kiểm tra ═════════════ */
const QUIZ2 = [
  Q('ide-2-1', 'A teammate’s project shows “release version 21 not supported” when building in IntelliJ. pom.xml says java.version 21. What is the right fix?|||Dự án của bạn cùng nhóm báo “release version 21 not supported” khi build trong IntelliJ. pom.xml ghi java.version 21. Cách sửa đúng là gì?', [
    'Change java.version to 17 in pom.xml|||Đổi java.version thành 17 trong pom.xml',
    'Set the Project SDK (or Maven runner JRE) to a JDK 21 or newer|||Đặt Project SDK (hoặc JRE chạy Maven) là JDK 21 trở lên',
    'Invalidate Caches and restart|||Invalidate Caches rồi khởi động lại',
    'Delete the .idea folder and reopen|||Xoá thư mục .idea rồi mở lại',
  ], 1, 'EN: The compiler is older than what the project requires. Change the JDK, not the project (that changes it for the whole team); caches are unrelated.|||VI: Trình biên dịch cũ hơn mức dự án yêu cầu. Đổi JDK, đừng đổi dự án (làm vậy là đổi cho cả nhóm); bộ nhớ đệm không liên quan.'),
  Q('ide-2-2', 'You get a “take-home test” repository from an unknown recruiter. What should IntelliJ do when you open it?|||Bạn nhận repo “bài test làm ở nhà” từ một nhà tuyển dụng lạ. Mở bằng IntelliJ thì nên chọn gì?', [
    'Trust Project, so Maven can download dependencies|||Trust Project để Maven tải thư viện',
    'Trust Project but do not press Run|||Trust Project nhưng không bấm Run',
    'Preview in Safe Mode, read the build scripts first|||Preview in Safe Mode, đọc script build trước',
    'Open only the src folder|||Chỉ mở thư mục src',
  ], 2, 'EN: Importing executes build.gradle and Maven plugins before you press Run (lesson 2.1 showed a script running at import). Safe Mode imports nothing.|||VI: Import là chạy build.gradle và plugin Maven trước cả khi bấm Run (bài 2.1 cho thấy script chạy lúc import). Safe Mode không import gì.'),
  Q('ide-2-3', 'Ctrl+B / ⌘B on repo.findById(id) opens GearRepository, an interface with no body. Which key takes you to the code that actually runs?|||Ctrl+B / ⌘B trên repo.findById(id) mở GearRepository — interface không có thân hàm. Phím nào đưa tới mã thực sự chạy?', [
    'Ctrl+Alt+B / ⌥⌘B (Go to Implementation)|||Ctrl+Alt+B / ⌥⌘B (Go to Implementation)',
    'Ctrl+U / ⌘U (Go to Super Method)|||Ctrl+U / ⌘U (Go to Super Method)',
    'Ctrl+H / ⌃H (Type Hierarchy)|||Ctrl+H / ⌃H (Type Hierarchy)',
    'Ctrl+Shift+I / ⌥Space (Quick Definition)|||Ctrl+Shift+I / ⌥Space (Quick Definition)',
  ], 0, 'EN: Go to Implementation lists implementing classes/methods; Type Hierarchy shows them too but does not jump to the method.|||VI: Go to Implementation liệt kê lớp/method cài đặt; Type Hierarchy cũng hiện chúng nhưng không nhảy tới method.'),
  Q('ide-2-4', 'Text search for "available()" in gear-mini gives 6 lines; Find Usages on GearService.available gives 2. Why?|||Tìm chữ "available()" trong gear-mini ra 6 dòng; Find Usages trên GearService.available ra 2. Vì sao?', [
    'Find Usages skips test files by default|||Find Usages mặc định bỏ qua file test',
    'Text search counts comments twice|||Tìm chữ đếm chú thích hai lần',
    'The index is not finished|||Chỉ mục chưa xong',
    'Three different methods share the name; Find Usages follows only this one|||Ba method khác nhau trùng tên; Find Usages chỉ theo đúng method này',
  ], 3, 'EN: Gear.available, GearService.available and GearController.available are different methods. Find Usages resolves the reference; text search cannot.|||VI: Gear.available, GearService.available và GearController.available là ba method khác nhau. Find Usages phân giải tham chiếu; tìm chữ thì không.'),
  Q('ide-2-5', 'You add a parameter to borrow() used in 14 places and want the build to stay green during the change. Which refactoring?|||Bạn thêm một tham số cho borrow() đang được gọi ở 14 chỗ và muốn build vẫn xanh trong lúc đổi. Dùng phép refactor nào?', [
    'Rename (Shift+F6 / ⇧F6)|||Rename (Shift+F6 / ⇧F6)',
    'Change Signature (Ctrl+F6 / ⌘F6) with a default value|||Change Signature (Ctrl+F6 / ⌘F6) kèm giá trị mặc định',
    'Extract Parameter on each call site|||Extract Parameter ở từng chỗ gọi',
    'Find in Files and Replace|||Find in Files rồi Replace',
  ], 1, 'EN: Change Signature updates every call with the default value in one step; then you adjust callers one by one.|||VI: Change Signature cập nhật mọi lời gọi với giá trị mặc định trong một bước; sau đó bạn sửa dần từng chỗ.'),
  Q('ide-2-6', 'What does typing g.available().if then Tab produce?|||Gõ g.available().if rồi Tab thì ra gì?', [
    'if (g.available()) { }|||if (g.available()) { }',
    'boolean available = g.available();|||boolean available = g.available();',
    'if (g == null) { }|||if (g == null) { }',
    'A live template list|||Danh sách live template',
  ], 0, 'EN: Postfix completion wraps the expression before the dot; .var would create the variable.|||VI: Postfix completion bọc biểu thức đứng trước dấu chấm; .var mới tạo biến.'),
  Q('ide-2-7', 'application-dev.properties sets gear.max-loans=5; the run configuration has -Dspring.profiles.active=dev and environment GEAR_MAX_LOANS=4. What does gear-mini print?|||application-dev.properties đặt gear.max-loans=5; run configuration có -Dspring.profiles.active=dev và biến môi trường GEAR_MAX_LOANS=4. gear-mini in ra gì?', [
    'max-loans=2|||max-loans=2',
    'max-loans=5|||max-loans=5',
    'max-loans=4|||max-loans=4',
    'Startup fails: two values for one key|||Khởi động lỗi vì một khoá có hai giá trị',
  ], 2, 'EN: Measured in lesson 2.4: environment variables outrank profile files; only command-line arguments would beat them.|||VI: Đo ở bài 2.4: biến môi trường đứng trên file profile; chỉ tham số dòng lệnh mới thắng nó.'),
  Q('ide-2-8', 'Coverage shows GearService 13/13 lines and GearController 3/7. What is the most useful conclusion?|||Độ phủ cho thấy GearService 13/13 dòng và GearController 3/7. Kết luận hữu ích nhất là gì?', [
    'GearService has no bugs|||GearService không còn lỗi',
    'Coverage is too low; the build should fail|||Độ phủ thấp quá; build phải hỏng',
    'Delete the untested exception handlers|||Xoá các handler lỗi chưa được test',
    'The 404/409 error responses are never exercised — write controller tests for them|||Các phản hồi lỗi 404/409 chưa được chạy lần nào — viết test controller cho chúng',
  ], 3, 'EN: Coverage tells you where tests never went, not that covered code is correct.|||VI: Độ phủ chỉ chỗ test chưa đi tới, không chứng minh mã đã phủ là đúng.'),
  Q('ide-2-9', 'You connect DBeaver/IntelliJ to the shared staging database to check one value. Which setting protects you most from a GitLab-2017-style mistake?|||Bạn nối DBeaver/IntelliJ vào cơ sở dữ liệu staging dùng chung để xem một giá trị. Cài đặt nào bảo vệ bạn nhất khỏi kiểu nhầm như GitLab 2017?', [
    'Read-only connection with a warning colour (and manual commit)|||Kết nối chỉ đọc có màu cảnh báo (và commit thủ công)',
    'Auto-commit on, so nothing is left half-done|||Bật auto-commit để không có gì làm dở',
    'Use the application’s own database account|||Dùng tài khoản cơ sở dữ liệu của ứng dụng',
    'Save the password in the shared project settings|||Lưu mật khẩu trong cài đặt dự án dùng chung',
  ], 0, 'EN: Read-only plus a visible colour stops the wrong-window mistake; manual commit gives a rollback chance. Auto-commit and shared app accounts make it worse.|||VI: Chỉ đọc cộng màu dễ thấy chặn được lỗi nhầm cửa sổ; commit thủ công cho cơ hội rollback. Auto-commit và tài khoản ứng dụng dùng chung làm mọi thứ tệ hơn.'),
  Q('ide-2-10', 'Your project allows only the company’s enterprise AI assistant. A connection error mentions the production DB host and password. What do you do?|||Dự án chỉ cho dùng trợ lý AI bản doanh nghiệp của công ty. Một lỗi kết nối có ghi host và mật khẩu cơ sở dữ liệu production. Bạn làm gì?', [
    'Paste it into your personal ChatGPT, which is faster|||Dán vào ChatGPT cá nhân cho nhanh',
    'Run gitleaks; if it reports 0 leaks, paste it as is|||Chạy gitleaks; báo 0 rò rỉ thì dán nguyên văn',
    'Replace host, database, user and password with placeholders, then ask the approved tool|||Thay host, tên CSDL, tài khoản và mật khẩu bằng chỗ giữ chỗ rồi hỏi công cụ được duyệt',
    'Add the file to .aiignore and paste it anyway|||Thêm file vào .aiignore rồi vẫn dán',
  ], 2, 'EN: Lesson 2.6 showed gitleaks missing the plain password and internal host. Redact by hand and use only the approved tool; .aiignore does not stop copy-paste.|||VI: Bài 2.6 cho thấy gitleaks bỏ sót mật khẩu thường và host nội bộ. Tự che bằng tay và chỉ dùng công cụ được duyệt; .aiignore không chặn được copy-paste.'),
];
const L7 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 2 · Quiz' : 'Chương 2 · Kiểm tra'}</span>
<h2>${en ? 'Check what stuck' : 'Xem thử đọng lại được gì'}</h2>
<p class="lead">${en ? 'Ten situations from a working day in IntelliJ on a Spring Boot project. Each explanation names the lesson to reread.' : 'Mười tình huống của một ngày làm việc trong IntelliJ trên dự án Spring Boot. Lời giải từng câu nhắc bài cần đọc lại.'}</p>
<h3>${en ? 'Self-check before you start' : 'Tự kiểm trước khi làm'}</h3>
<ul>
<li>${en ? 'I can fix “red everywhere” in a fixed order without Invalidate Caches.' : 'Tôi sửa được “đỏ khắp nơi” theo thứ tự cố định mà không cần Invalidate Caches.'}</li>
<li>${en ? 'I reach implementations, usages and callers with one key each.' : 'Tôi tới lớp cài đặt, nơi dùng và nơi gọi, mỗi việc một phím.'}</li>
<li>${en ? 'I rename, extract and change signatures only with refactorings.' : 'Tôi đổi tên, tách hàm và đổi chữ ký chỉ bằng refactor.'}</li>
<li>${en ? 'I know which configuration layer wins in Spring Boot.' : 'Tôi biết tầng cấu hình nào thắng trong Spring Boot.'}</li>
<li>${en ? 'My API requests live in .http files and my DB connections are colour-coded.' : 'Request API của tôi nằm trong file .http và kết nối CSDL của tôi có màu.'}</li>
<li>${en ? 'I never paste secrets or customer data into an AI tool.' : 'Tôi không bao giờ dán bí mật hay dữ liệu khách hàng vào công cụ AI.'}</li>
</ul>
</div>
`;

export default {
  title: 'Chapter 2 — IntelliJ IDEA for Java and Spring Boot|||Chương 2 — IntelliJ IDEA cho Java và Spring Boot',
  description: 'IDE bạn mở mỗi sáng khi OJT trên dự án Java: mở dự án đúng JDK, điều hướng bằng phím, refactor tự động, run configuration và test, HTTP Client/Postman, công cụ CSDL, AI dùng có trách nhiệm — làm trên gear-mini.',
  lessons: [
    { title: '2.1 — Opening projects right: Maven/Gradle import, Project SDK, language level, indexing|||2.1 — Mở dự án cho đúng: import Maven/Gradle, Project SDK, language level, lập chỉ mục', slug: 'ide-2-1-du-an', type: 'LESSON', isFreePreview: true, description: 'File build là nguồn sự thật, ba phiên bản Java phải khớp (lỗi thật JDK 17/21, Gradle toolchain), lập chỉ mục, thứ tự sửa “đỏ khắp nơi”, kho Nexus/proxy công ty, góc hacker: import là chạy script build.', content: L1(true) + L1(false) },
    { title: '2.2 — Navigation: Search Everywhere, Find Usages, Call and Type Hierarchy|||2.2 — Điều hướng: Search Everywhere, Find Usages, Call và Type Hierarchy', slug: 'ide-2-2-dieu-huong', type: 'LESSON', isFreePreview: true, description: 'Search Everywhere và CamelHumps, bảng phím điều hướng hai hệ, Go to Implementation, Find Usages so với tìm chữ (output thật), Call/Type Hierarchy, chỗ mô hình Java không thấy trong Spring, keymap.', content: L2(true) + L2(false) },
    { title: '2.3 — Automatic refactoring, code generation and live templates|||2.3 — Refactor tự động, sinh code và live template', slug: 'ide-2-3-refactor-sinh-code', type: 'LESSON', isFreePreview: true, description: 'Đổi tên tay gây lỗi biên dịch thật, bảng refactor hai hệ, tách borrow() ba bước có test xanh, Knight Capital 2012, Alt+Enter, Generate, postfix completion, live template tự viết.', content: L3(true) + L3(false) },
    { title: '2.4 — Run configurations for Spring Boot and Tomcat, env vars, tests and coverage|||2.4 — Run configuration cho Spring Boot và Tomcat, biến môi trường, test và độ phủ', slug: 'ide-2-4-chay-test', type: 'LESSON', isFreePreview: true, description: 'Các ô của run configuration, thứ tự cấu hình Spring đo thật, .run/ dùng chung và bí mật (Toyota 2022), Tomcat/WAR, chạy test, độ phủ JaCoCo thật, debugger đủ dùng và JDWP.', content: L4(true) + L4(false) },
    { title: '2.5 — Built-in tools and plugins: HTTP Client, Database, Maven, SonarLint, Lombok|||2.5 — Công cụ đi kèm và plugin: HTTP Client, Database, Maven, SonarLint, Lombok', slug: 'ide-2-5-cong-cu-kem', type: 'LESSON', isFreePreview: true, description: 'File .http chạy thật bằng HTTP Client CLI, Postman/Bruno, kết nối PostgreSQL từ IntelliJ/DBeaver/pgAdmin, commit thủ công (GitLab 2017), cây phụ thuộc trả lời Log4Shell, SonarQube for IDE, Lombok, plugin nên tránh.', content: L5(true) + L5(false) },
    { title: '2.6 — AI assistants in the IDE, used responsibly|||2.6 — AI trợ lý trong IDE, dùng có trách nhiệm', slug: 'ide-2-8-ai-tro-ly', type: 'LESSON', isFreePreview: true, description: 'Cái gì rời khỏi máy, luật NDA/ISMS ở công ty outsourcing, Samsung 2023, gitleaks bỏ sót mật khẩu thường (output thật), che dữ liệu, .aiignore, năm bước trước khi nhận mã AI, câu trả lời phỏng vấn.', content: L8(true) + L8(false) },
    { title: '2.7 — Lab: A timed Spring Boot task list: navigate, refactor, run tests|||2.7 — Lab: Danh sách việc Spring Boot có bấm giờ: điều hướng, refactor, chạy test', slug: 'ide-2-6-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket GEAR-12 “trả thiết bị” 12 việc trên gear-mini, lời giải mẫu chạy thật (6 test, 6 request), rubric 10 điểm, 5 câu phỏng vấn có gợi ý, mốc dự án.', content: L6(true) + L6(false) },
    { title: '2.8 — Chapter 2 quiz|||2.8 — Kiểm tra Chương 2', slug: 'ide-2-7-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười câu tình huống về JDK/import, Safe Mode, điều hướng, refactor, postfix, thứ tự cấu hình, độ phủ, công cụ CSDL và AI, có giải thích.', content: L7(true) + L7(false), quiz: { timeLimitSeconds: 900, questions: QUIZ2 } },
  ],
};

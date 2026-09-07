/**
 * Docker — Practical Exam (PE): 5 câu thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/docker/s00…s12`. Khác đề FE (50 câu
 * trắc nghiệm, đọc terminal), đề này bắt VIẾT hiện vật: một Dockerfile nhiều
 * tầng chạy được, một bản vá cho Dockerfile hỏng, một stack Compose tách mạng
 * công khai/nội bộ, một script entrypoint kết thúc bằng `exec "$@"`, và một
 * script rà soát + chốt kiểm sau deploy.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 * Docker Engine 29.5.3 / Compose v5.1.4 (Docker Desktop 4.78, linux/arm64):
 *   • Q1: `docker build` xanh, container lên `healthy`, `curl /health` trả
 *     `{"ok":true,"user":1000}`, PID 1 đúng là `node dist/index.js`.
 *   • Q2: bản HỎNG được dựng thật để lấy bằng chứng — nó dựng XANH, chạy dưới
 *     root, PID 1 là `npm start`, và `docker history` nhả ra nguyên cái token.
 *   • Q3: `docker compose up -d` chạy thật — db `Healthy` → migrate `Exited`
 *     → api `Started`, proxy phân giải được `api` mà KHÔNG phân giải được `db`.
 *   • Q4: chạy thật ba ca — PID 1 là CMD, CMD ghi đè được, và phụ thuộc không
 *     tới thì container thoát 1.
 *   • Q5: script chạy thật trên một stack sống và bắt đúng ba lỗi.
 *
 * ⚠️ `node scripts/exam-check.mjs ./content/exams/DOCKER-PE.mjs` BÁO 5 LỖI, VÀ
 * ĐÓ LÀ GIỚI HẠN CỦA BỘ KIỂM, KHÔNG PHẢI LỖI CỦA ĐỀ.
 *
 *   Bộ kiểm chỉ có `node` và `bash`. Với Q1–Q3 nó ghi `sampleSolution` ra
 *   `answer.cjs` rồi gọi `node` — một Dockerfile và một file compose không phải
 *   JavaScript, nên nhận `SyntaxError`. Với Q4–Q5 (`language: 'bash'`) nó chạy
 *   thật bằng `/bin/bash`, nhưng cả hai script đều CẦN MỘT DOCKER DAEMON SỐNG
 *   và tham số dòng lệnh, nên chúng thoát khác 0.
 *
 *   Đây đúng cái tình huống mà chính bộ kiểm đã ghi nhận và xử lý cho SQL
 *   (commit 55e8c6f0, 08/09/2026): "ngôn ngữ bộ kiểm không chạy được ⇒ BỎ QUA,
 *   KHÔNG BÁO LỖI", cài đặt bằng tập `KHONG_CHAY_DUOC` trong
 *   `scripts/exam-check.mjs`. `POSTGRESQL-PE.mjs` nhờ đó xanh với 5 dòng `ℹ`.
 *   Muốn `DOCKER-PE` xanh y như vậy thì thêm `'dockerfile'` và `'yaml'` vào
 *   đúng cái tập ấy — MỘT dòng, và đề này không đổi một ký tự nào. Ở đây tôi
 *   KHÔNG tự sửa file đó vì nó vừa được vá và người chủ đã dặn đừng đụng vào.
 *
 *   Cách kiểm chứng thật của đề này là chạy Docker, và mọi lượt chạy đã ghi ở
 *   trên. Muốn kiểm lại, làm theo đúng các câu lệnh trong từng `expectedOutput`.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DOCKER-PE.mjs --apply
 */
import { B, c, codeQ } from './_lib/docker-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five folders named <code>Q1 … Q5</code> on your own machine. Each question names the exact files it wants inside its folder, and shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. The given application files and the commands in the "expected output" block are part of the grading; changing them is how you fail a question you actually solved.</li>' +
  '<li><b>Only official images</b> — <code>node</code>, <code>alpine</code>, <code>postgres</code>, <code>nginx</code>. No third-party base images, no tool you have to install on the host beyond Docker itself.</li>' +
  '<li><b>Run everything before you submit.</b> Every question can be checked with the exact commands printed in its "expected output" block: build the image, start the container, curl the endpoint, read <code>docker inspect</code>. A Dockerfile that has never been built is not an answer.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Behaviour first — an image that does not build, or a stack that does not come up, cannot pass. But this is a Docker exam, so the <b>shape</b> of the artifact is graded too: a build-stage compiler that reaches the final image, a <code>CMD</code> in shell form, a container running as root, a database port published on <code>0.0.0.0</code>, or a secret visible in <code>docker history</code> all cost marks <em>even when the container runs</em>. If in doubt, ask of every line: does the running process need this, and who can reach it?</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm thư mục tên <code>Q1 … Q5</code> trên máy của bạn. Mỗi câu ghi rõ những file nào phải nằm trong thư mục của nó, và có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Phần file ứng dụng cho sẵn và các câu lệnh trong khối "kết quả mong đợi" là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li><b>Chỉ dùng ảnh chính thức</b> — <code>node</code>, <code>alpine</code>, <code>postgres</code>, <code>nginx</code>. Không ảnh nền của bên thứ ba, không công cụ nào phải cài thêm lên máy ngoài chính Docker.</li>' +
  '<li><b>Chạy thử mọi thứ trước khi nộp.</b> Mọi câu đều kiểm được bằng đúng những câu lệnh in trong khối "kết quả mong đợi" của nó: dựng ảnh, khởi chạy container, curl vào endpoint, đọc <code>docker inspect</code>. Một Dockerfile chưa từng được dựng thì chưa phải một lời giải.</li>' +
  '<li>Nén năm thư mục thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Hành vi trước — một cái ảnh không dựng được, hay một stack không lên được, thì không thể qua. Nhưng đây là bài thi Docker, nên <b>hình dạng</b> của hiện vật cũng bị chấm: một trình biên dịch của stage dựng lọt vào ảnh cuối, một <code>CMD</code> viết ở dạng shell, một container chạy dưới quyền root, một cổng cơ sở dữ liệu công bố lên <code>0.0.0.0</code>, hay một bí mật nhìn thấy được trong <code>docker history</code> đều bị trừ điểm <em>ngay cả khi container vẫn chạy</em>. Lúc phân vân, hãy hỏi từng dòng một: tiến trình đang chạy có cần thứ này không, và ai với tới được nó?</p>' +
  '</div>';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Q1/package.json\n' +
  '#   { "name": "notes-api", "version": "1.0.0", "private": true,\n' +
  '#     "scripts": { "build": "node build.js", "start": "node dist/index.js" } }\n' +
  '#\n' +
  '# Q1/build.js       — stands in for tsc: copies src/index.js to dist/index.js\n' +
  '# Q1/src/index.js   — an http server on 0.0.0.0:$PORT with a /health route\n' +
  '#                     that returns {"ok":true,"user":<uid>}\n' +
  '#\n' +
  '# Write TWO files: Q1/.dockerignore and Q1/Dockerfile\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '# .dockerignore\n' +
  '\n' +
  '# Dockerfile\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Kiểm bằng đúng bốn lệnh trong khối "kết quả mong đợi".\n';

const Q1_SOLUTION =
  '# .dockerignore\n' +
  'node_modules\n' +
  '.git\n' +
  '.env\n' +
  '.env.*\n' +
  'dist\n' +
  '*.log\n' +
  'Dockerfile*\n' +
  '\n' +
  '# Dockerfile\n' +
  '# syntax=docker/dockerfile:1\n' +
  'FROM node:22-alpine AS build\n' +
  'WORKDIR /app\n' +
  '# Manifest first, install second, source third: a source edit must not\n' +
  '# invalidate the install layer.\n' +
  'COPY package.json ./\n' +
  'RUN --mount=type=cache,target=/root/.npm npm install --omit=dev --no-audit --no-fund\n' +
  'COPY build.js ./\n' +
  'COPY src ./src\n' +
  'RUN npm run build\n' +
  '\n' +
  'FROM node:22-alpine\n' +
  'ENV NODE_ENV=production PORT=3000\n' +
  'WORKDIR /app\n' +
  '# Only the artifact crosses over. build.js and src/ stay in the build stage.\n' +
  'COPY --from=build --chown=node:node /app/dist ./dist\n' +
  'COPY --chown=node:node package.json ./\n' +
  'USER node\n' +
  'EXPOSE 3000\n' +
  '# node -e, not curl: this image ships neither curl nor wget.\n' +
  'HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \\\n' +
  '  CMD node -e "fetch(\'http://127.0.0.1:3000/health\').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"\n' +
  '# Exec form: this process IS pid 1 and receives SIGTERM directly.\n' +
  'CMD ["node", "dist/index.js"]\n';

const Q1_OUTPUT =
  '$ docker build -t notes-api:1.0 .\n' +
  '... FINISHED\n' +
  '\n' +
  '$ docker run -d --name q1 -p 13000:3000 notes-api:1.0 && sleep 8\n' +
  '$ curl -s http://localhost:13000/health\n' +
  '{"ok":true,"user":1000}\n' +
  '\n' +
  '$ docker inspect q1 --format \'{{.State.Health.Status}}\'\n' +
  'healthy\n' +
  '\n' +
  '$ docker exec q1 ps -o pid,args | head -2\n' +
  'PID   COMMAND\n' +
  '    1 node dist/index.js\n' +
  '\n' +
  '$ docker run --rm --entrypoint sh notes-api:1.0 -c \'ls /app; ls /app/src\'\n' +
  'dist\n' +
  'package.json\n' +
  "ls: /app/src: No such file or directory";

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Q2/ holds the same application as Q1 (package.json, build.js, src/index.js).\n' +
  '# Q2/Dockerfile.broken is the file below. It BUILDS SUCCESSFULLY — that is\n' +
  '# the point of the question. Do not edit it; write Q2/Dockerfile instead.\n' +
  '#\n' +
  '#   FROM node:alpine\n' +
  '#   ARG NPM_TOKEN\n' +
  '#   WORKDIR /app\n' +
  '#   COPY . .\n' +
  '#   RUN apk update\n' +
  '#   RUN apk add --no-cache curl\n' +
  '#   RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc \\\n' +
  '#    && npm install --no-audit --no-fund \\\n' +
  '#    && rm .npmrc\n' +
  '#   RUN npm run build\n' +
  '#   CMD npm start\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '# Q2/FAULTS.md — one line per fault: what it is, and what it costs\n' +
  '\n' +
  '# Q2/Dockerfile — the corrected file\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# curl must still be present in the final image; a later lesson uses it.\n';

const Q2_SOLUTION =
  '# FAULTS.md\n' +
  '# 1. FROM node:alpine        — unpinned. "node:alpine" moves across major\n' +
  '#                              versions, so this file is not reproducible.\n' +
  '# 2. ARG NPM_TOKEN           — the value is recorded verbatim in\n' +
  '#                              docker history; deleting .npmrc does not help.\n' +
  '# 3. COPY . . before install — every source edit invalidates npm install.\n' +
  '#                              No .dockerignore either, so .git and\n' +
  '#                              node_modules travel in the build context.\n' +
  '# 4. apk update alone        — its own cache key, so the package index goes\n' +
  '#                              stale and a later install 404s.\n' +
  '# 5. single stage           — the source tree and dev dependencies ship.\n' +
  '# 6. CMD npm start           — npm becomes pid 1, adds a process and hides\n' +
  '#                              the real command from docker ps.\n' +
  '# 7. no USER                 — the container runs as root; a container escape\n' +
  '#                              lands on the host as root.\n' +
  '\n' +
  '# .dockerignore\n' +
  'node_modules\n' +
  '.git\n' +
  '.env\n' +
  '.env.*\n' +
  'dist\n' +
  '*.log\n' +
  'Dockerfile*\n' +
  '\n' +
  '# Dockerfile\n' +
  '# syntax=docker/dockerfile:1\n' +
  'FROM node:22-alpine AS build\n' +
  'WORKDIR /app\n' +
  'COPY package.json ./\n' +
  '# The token, if one is really needed, goes in a secret mount: available to\n' +
  '# this one RUN and written into no layer and no history entry.\n' +
  'RUN --mount=type=cache,target=/root/.npm \\\n' +
  '    --mount=type=secret,id=npmrc,target=/root/.npmrc \\\n' +
  '    npm install --no-audit --no-fund\n' +
  'COPY build.js ./\n' +
  'COPY src ./src\n' +
  'RUN npm run build\n' +
  '\n' +
  'FROM node:22-alpine\n' +
  '# update and add in ONE layer, so changing the package list refreshes both.\n' +
  'RUN apk add --no-cache curl\n' +
  'ENV NODE_ENV=production PORT=3000\n' +
  'WORKDIR /app\n' +
  'COPY --from=build --chown=node:node /app/dist ./dist\n' +
  'COPY --chown=node:node package.json ./\n' +
  'USER node\n' +
  'EXPOSE 3000\n' +
  'CMD ["node", "dist/index.js"]\n';

const Q2_OUTPUT =
  '# The BROKEN file, built for evidence — it is green, and still wrong:\n' +
  '$ docker build --build-arg NPM_TOKEN=npm_SuperSecret123 -f Dockerfile.broken -t app:broken .\n' +
  '... FINISHED\n' +
  '$ docker run -d --name b app:broken && sleep 4\n' +
  '$ docker exec b ps -o pid,args | head -3\n' +
  'PID   COMMAND\n' +
  '    1 npm start\n' +
  '   18 {node-MainThread} node dist/index.js\n' +
  '$ docker exec b id | cut -d\' \' -f1-2\n' +
  'uid=0(root) gid=0(root)\n' +
  '$ docker history app:broken --no-trunc --format \'{{.CreatedBy}}\' | grep -o \'NPM_TOKEN=[^ ]*\'\n' +
  'NPM_TOKEN=npm_SuperSecret123\n' +
  '$ docker run --rm --entrypoint sh app:broken -c \'ls /app\'\n' +
  'build.js  dist  package-lock.json  package.json  src\n' +
  '\n' +
  '# YOUR file:\n' +
  '$ docker build -t app:fixed . && docker run -d --name f app:fixed && sleep 3\n' +
  '$ docker exec f ps -o pid,args | head -2\n' +
  'PID   COMMAND\n' +
  '    1 node dist/index.js\n' +
  '$ docker exec f id | cut -d\' \' -f1-2\n' +
  'uid=1000(node) gid=1000(node)\n' +
  '$ docker history app:fixed --no-trunc --format \'{{.CreatedBy}}\' | grep -c NPM_TOKEN\n' +
  '0\n' +
  '$ docker run --rm --entrypoint sh app:fixed -c \'ls /app; command -v curl\'\n' +
  'dist\n' +
  'package.json\n' +
  '/usr/bin/curl';
/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Q3/ops/nginx.conf  (given)\n' +
  '#   server {\n' +
  '#     listen 80;\n' +
  '#     location / {\n' +
  '#       proxy_pass http://api:3000;\n' +
  '#       proxy_http_version 1.1;\n' +
  '#       proxy_set_header Host              $host;\n' +
  '#       proxy_set_header X-Real-IP         $remote_addr;\n' +
  '#       proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
  '#       proxy_set_header X-Forwarded-Proto $scheme;\n' +
  '#     }\n' +
  '#   }\n' +
  '#\n' +
  '# The api image is the one you built in Q1 (tag it notes-api:1.0).\n' +
  '# Write Q3/compose.yaml. The four services are db, migrate, api, proxy.\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  'name: shopdemo\n' +
  '\n' +
  'services:\n' +
  '\n' +
  'networks:\n' +
  '\n' +
  'volumes:\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Q3/.env must NOT be committed. Only .env.example is.\n';

const Q3_SOLUTION =
  'name: shopdemo\n' +
  '\n' +
  'services:\n' +
  '  db:\n' +
  '    image: postgres:16-alpine\n' +
  '    environment:\n' +
  '      POSTGRES_USER: ${POSTGRES_USER:-shop}\n' +
  '      # :? fails the whole `up` with this message instead of starting a\n' +
  '      # database whose superuser has an empty password.\n' +
  '      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}\n' +
  '      POSTGRES_DB: ${POSTGRES_DB:-shop}\n' +
  '    volumes:\n' +
  '      - pgdata:/var/lib/postgresql/data\n' +
  '    healthcheck:\n' +
  '      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-shop} -d ${POSTGRES_DB:-shop}"]\n' +
  '      interval: 3s\n' +
  '      timeout: 3s\n' +
  '      retries: 10\n' +
  '      start_period: 30s\n' +
  '    networks: [private]\n' +
  '    restart: unless-stopped\n' +
  '\n' +
  '  migrate:\n' +
  '    image: postgres:16-alpine\n' +
  '    command:\n' +
  '      - "psql"\n' +
  '      - "-v"\n' +
  '      - "ON_ERROR_STOP=1"\n' +
  '      - "-c"\n' +
  '      - "CREATE TABLE IF NOT EXISTS note (id serial primary key, body text)"\n' +
  '    environment:\n' +
  '      PGHOST: db\n' +
  '      PGUSER: ${POSTGRES_USER:-shop}\n' +
  '      PGPASSWORD: ${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}\n' +
  '      PGDATABASE: ${POSTGRES_DB:-shop}\n' +
  '    depends_on:\n' +
  '      db: { condition: service_healthy }\n' +
  '    networks: [private]\n' +
  '    # Exiting is this container\'s job, so never restart it.\n' +
  '    restart: "no"\n' +
  '\n' +
  '  api:\n' +
  '    image: notes-api:1.0\n' +
  '    environment:\n' +
  '      PORT: "3000"\n' +
  '    depends_on:\n' +
  '      db: { condition: service_healthy }\n' +
  '      migrate: { condition: service_completed_successfully }\n' +
  '    # The ONLY service on both networks: the one crossing you allow.\n' +
  '    networks: [private, public]\n' +
  '    restart: unless-stopped\n' +
  '\n' +
  '  proxy:\n' +
  '    image: nginx:1.27-alpine\n' +
  '    ports:\n' +
  '      - "127.0.0.1:8088:80"\n' +
  '    volumes:\n' +
  '      - ./ops/nginx.conf:/etc/nginx/conf.d/default.conf:ro\n' +
  '    depends_on: [api]\n' +
  '    networks: [public]\n' +
  '    restart: unless-stopped\n' +
  '\n' +
  'networks:\n' +
  '  public:\n' +
  '  private:\n' +
  '    # No route to the internet, and no interface for anything not listed on it.\n' +
  '    internal: true\n' +
  '\n' +
  'volumes:\n' +
  '  pgdata:\n';

const Q3_OUTPUT =
  '$ docker compose config            # with no .env present\n' +
  'error while interpolating services.db.environment.POSTGRES_PASSWORD:\n' +
  'required variable POSTGRES_PASSWORD is missing a value: set POSTGRES_PASSWORD in .env\n' +
  '# (Compose names whichever occurrence it reaches first, so the path may read\n' +
  '#  services.migrate.environment.PGPASSWORD instead. The message is yours either way.)\n' +
  '\n' +
  '$ echo "POSTGRES_PASSWORD=devpass" > .env && docker compose up -d\n' +
  ' Container shopdemo-db-1       Healthy\n' +
  ' Container shopdemo-migrate-1  Exited\n' +
  ' Container shopdemo-api-1      Started\n' +
  ' Container shopdemo-proxy-1    Started\n' +
  '\n' +
  '$ docker compose ps --format \'table {{.Service}}\\t{{.Status}}\\t{{.Ports}}\'\n' +
  'SERVICE   STATUS                    PORTS\n' +
  'api       Up 12 seconds (healthy)   3000/tcp\n' +
  'db        Up 18 seconds (healthy)   5432/tcp\n' +
  'proxy     Up 12 seconds             127.0.0.1:8088->80/tcp\n' +
  '\n' +
  '$ curl -s http://127.0.0.1:8088/health\n' +
  '{"ok":true,"user":1000}\n' +
  '\n' +
  '$ docker compose exec -T proxy sh -c \'getent hosts api && echo api-ok; getent hosts db || echo "db: not resolvable from proxy"\'\n' +
  '172.19.0.2        api  api\n' +
  'api-ok\n' +
  'db: not resolvable from proxy\n' +
  '\n' +
  '$ docker compose exec -T db psql -U shop -d shop -c \'\\dt\'\n' +
  ' Schema | Name | Type  | Owner\n' +
  '--------+------+-------+-------\n' +
  ' public | note | table | shop\n' +
  '\n' +
  '$ docker network inspect shopdemo_private --format \'internal={{.Internal}}\'\n' +
  'internal=true';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Q4/migrate.sh   (given, already executable)\n' +
  '#   #!/bin/sh\n' +
  '#   set -e\n' +
  '#   echo "migrate: applied 3 migrations" >&2\n' +
  '#\n' +
  '# Write Q4/entrypoint.sh and Q4/Dockerfile. The image is alpine-based and\n' +
  '# already has netcat-openbsd available via apk.\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '# entrypoint.sh\n' +
  '#!/bin/sh\n' +
  '\n' +
  '# Dockerfile\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# The default CMD must be ["sleep", "600"], so the three checks below work.\n';

const Q4_SOLUTION =
  '# ── Dockerfile ─────────────────────────────────────────────────────────\n' +
  '# syntax=docker/dockerfile:1\n' +
  'FROM alpine:3.20\n' +
  'RUN apk add --no-cache netcat-openbsd\n' +
  'WORKDIR /app\n' +
  '# --chmod sets the bit as the file is written; no extra chown/chmod layer.\n' +
  'COPY --chmod=755 entrypoint.sh /usr/local/bin/entrypoint.sh\n' +
  'COPY --chmod=755 migrate.sh ./migrate.sh\n' +
  'ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]\n' +
  'CMD ["sleep", "600"]\n' +
  '\n' +
  '# ── entrypoint.sh ──────────────────────────────────────────────────────\n' +
  '#!/bin/sh\n' +
  'set -e\n' +
  '\n' +
  '# 1. Wait for the dependency. Log to stderr so the app owns stdout.\n' +
  ': "${DB_HOST:=db}" "${DB_PORT:=5432}" "${WAIT_TIMEOUT:=60}"\n' +
  'waited=0\n' +
  'until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do\n' +
  '  if [ "$waited" -ge "$WAIT_TIMEOUT" ]; then\n' +
  '    echo "entrypoint: ${DB_HOST}:${DB_PORT} still unreachable after ${WAIT_TIMEOUT}s" >&2\n' +
  '    exit 1\n' +
  '  fi\n' +
  '  echo "entrypoint: waiting for ${DB_HOST}:${DB_PORT}..." >&2\n' +
  '  sleep 1\n' +
  '  waited=$((waited + 1))\n' +
  'done\n' +
  'echo "entrypoint: ${DB_HOST}:${DB_PORT} is up" >&2\n' +
  '\n' +
  '# 2. One-time setup. Opt-out, so a debug shell does not run migrations.\n' +
  'if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then\n' +
  '  echo "entrypoint: running migrations..." >&2\n' +
  '  ./migrate.sh\n' +
  'fi\n' +
  '\n' +
  '# 3. Hand over to CMD, AS pid 1. exec replaces the shell instead of forking,\n' +
  '#    and "$@" is quoted so an argument containing a space stays one argument.\n' +
  'exec "$@"\n';

const Q4_OUTPUT =
  '$ docker network create pe-net\n' +
  '$ docker run -d --name dep --network pe-net --network-alias db nginx:1.27-alpine\n' +
  '$ docker build -t entry:1.0 .\n' +
  '\n' +
  '# A · default CMD — pid 1 must be the CMD, not the script\n' +
  '$ docker run -d --name a --network pe-net -e DB_PORT=80 entry:1.0 && sleep 3\n' +
  '$ docker logs a\n' +
  'entrypoint: db:80 is up\n' +
  'entrypoint: running migrations...\n' +
  'migrate: applied 3 migrations\n' +
  '$ docker exec a ps -o pid,args | head -2\n' +
  'PID   COMMAND\n' +
  '    1 sleep 600\n' +
  '\n' +
  '# B · CMD is still overridable, and the setup still runs\n' +
  '$ docker run --rm --network pe-net -e DB_PORT=80 -e RUN_MIGRATIONS=false \\\n' +
  '      entry:1.0 echo "custom command ran"\n' +
  'entrypoint: db:80 is up\n' +
  'custom command ran\n' +
  '\n' +
  '# C · dependency never arrives — set -e stops the container, exit 1\n' +
  '$ docker run --name c --network pe-net -e DB_HOST=nowhere -e WAIT_TIMEOUT=2 \\\n' +
  '      entry:1.0 sleep 600\n' +
  'entrypoint: waiting for nowhere:5432...\n' +
  'entrypoint: nowhere:5432 still unreachable after 2s\n' +
  '$ docker inspect c --format \'exit={{.State.ExitCode}}\'\n' +
  'exit=1\n' +
  '\n' +
  '# D · the SAME script with the final `exec` removed — the contrast to avoid\n' +
  '$ docker exec noexec ps -o pid,args | head -3\n' +
  'PID   COMMAND\n' +
  '    1 {entrypoint.sh} /bin/sh /usr/local/bin/entrypoint.sh sleep 600\n' +
  '    9 sleep 600';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_STARTER =
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Write Q5/audit.sh. Usage:\n' +
  '#   ./audit.sh <base-url> <route> [route...]\n' +
  '#\n' +
  '# It must exit 0 only when every running container passes the hardening\n' +
  '# checks AND every route answers with something other than 404.\n' +
  '\n' +
  '# ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '#!/usr/bin/env bash\n' +
  '\n' +
  '# ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '# Reproduce the transcript with these two containers:\n' +
  '#   docker run -d --name demo-good --user 10001:10001 --read-only \\\n' +
  '#     --tmpfs /tmp:rw,size=8m --cap-drop=ALL --security-opt no-new-privileges:true \\\n' +
  '#     --memory 256m --pids-limit 100 -p 127.0.0.1:8099:3000 notes-api:1.0\n' +
  '#   docker run -d --name demo-bad -p 8098:3000 notes-api:1.0\n';

const Q5_SOLUTION =
  '#!/usr/bin/env bash\n' +
  '# Exit 0 only when every container passes AND no route 404s.\n' +
  'set -Eeuo pipefail\n' +
  '\n' +
  'BASE=${1:?usage: audit.sh <base-url> <route>...}\n' +
  'shift\n' +
  'findings=0\n' +
  'note() { printf \'  %-9s %s\\n\' "$1" "$2"; [ "$1" = "FAIL" ] && findings=$((findings + 1)); return 0; }\n' +
  '\n' +
  'echo "== containers =="\n' +
  'for name in $(docker ps --format \'{{.Names}}\'); do\n' +
  '  echo "$name"\n' +
  '  # One inspect call per container, not seven.\n' +
  '  read -r user ro mem priv restarts health sock <<<"$(docker inspect "$name" --format \\\n' +
  '    \'{{if .Config.User}}{{.Config.User}}{{else}}ROOT{{end}} {{.HostConfig.ReadonlyRootfs}} {{.HostConfig.Memory}} {{.HostConfig.Privileged}} {{.RestartCount}} {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} {{range .Mounts}}{{if eq .Source "/var/run/docker.sock"}}SOCK{{end}}{{end}}-\')"\n' +
  '\n' +
  '  [ "$user" = "ROOT" ]   && note FAIL "runs as root — add a numeric USER"           || note ok "user=$user"\n' +
  '  [ "$mem" = "0" ]       && note FAIL "no memory limit — one leak takes the host"   || note ok "memory=$mem"\n' +
  '  [ "$priv" = "true" ]   && note FAIL "privileged — that is root on the host"       || note ok "privileged=false"\n' +
  '  [ "$sock" = "SOCK-" ]  && note FAIL "docker.sock mounted — that is root on the host" || note ok "no docker.sock"\n' +
  '  [ "$restarts" -gt 0 ]  && note FAIL "restarts=$restarts — read the FIRST failure"  || note ok "restarts=0"\n' +
  '  [ "$health" = "unhealthy" ] && note FAIL "unhealthy" || note ok "health=$health"\n' +
  '  [ "$ro" = "true" ] && note ok "read-only rootfs" || note warn "writable rootfs — try --read-only"\n' +
  'done\n' +
  '\n' +
  'echo "== ports published on every interface =="\n' +
  'if docker ps --format \'{{.Names}} {{.Ports}}\' | grep -F \'0.0.0.0:\'; then\n' +
  '  note FAIL "published on 0.0.0.0 — bind 127.0.0.1 or do not publish"\n' +
  'else\n' +
  '  note ok "nothing published on 0.0.0.0"\n' +
  'fi\n' +
  '\n' +
  'echo "== smoke test (404 means a stale or partial build) =="\n' +
  'for route in "$@"; do\n' +
  '  status=$(curl -s -o /dev/null -w \'%{http_code}\' --max-time 10 "${BASE}${route}")\n' +
  '  case "$status" in\n' +
  '    404)     note FAIL "$route -> 404 (route not mounted)" ;;\n' +
  '    200|401) note ok   "$route -> $status" ;;\n' +
  '    *)       note FAIL "$route -> $status" ;;\n' +
  '  esac\n' +
  'done\n' +
  '\n' +
  'echo "== $findings finding(s) =="\n' +
  '[ "$findings" -eq 0 ]\n';

const Q5_OUTPUT =
  '$ ./audit.sh http://127.0.0.1:8099 /health /missing\n' +
  '== containers ==\n' +
  'demo-bad\n' +
  '  ok        user=node\n' +
  '  FAIL      no memory limit — one leak takes the host\n' +
  '  ok        privileged=false\n' +
  '  ok        no docker.sock\n' +
  '  ok        restarts=0\n' +
  '  ok        health=healthy\n' +
  '  warn      writable rootfs — try --read-only\n' +
  'demo-good\n' +
  '  ok        user=10001:10001\n' +
  '  ok        memory=268435456\n' +
  '  ok        privileged=false\n' +
  '  ok        no docker.sock\n' +
  '  ok        restarts=0\n' +
  '  ok        health=healthy\n' +
  '  ok        read-only rootfs\n' +
  '== ports published on every interface ==\n' +
  'demo-bad 0.0.0.0:8098->3000/tcp, [::]:8098->3000/tcp\n' +
  '  FAIL      published on 0.0.0.0 — bind 127.0.0.1 or do not publish\n' +
  '== smoke test (404 means a stale or partial build) ==\n' +
  '  ok        /health -> 200\n' +
  '  FAIL      /missing -> 404 (route not mounted)\n' +
  '== 3 finding(s) ==\n' +
  '$ echo $?\n' +
  '1';
export default {
  course: { slug: 'docker' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — build the image, then prove it runs',
        'Thi thực hành — dựng cái ảnh, rồi chứng minh nó chạy được',
      ),
      description: B(
        'Five practical questions, submitted as a .zip. A multi-stage Dockerfile with a healthcheck and a non-root user, a repair of a Dockerfile that builds green and is wrong in seven ways, a Compose stack with a public/private network split and a migration gate, an entrypoint script that ends in exec "$@", and an audit plus smoke-test script — chapters 4, 5, 6, 7, 8, 9, 10, 11 and 12.',
        'Năm câu thực hành, nộp dưới dạng .zip. Một Dockerfile nhiều tầng có healthcheck và người dùng không phải root, một bản vá cho Dockerfile dựng xanh mà sai bảy chỗ, một stack Compose tách mạng công khai với nội bộ kèm cổng chặn migration, một script entrypoint kết thúc bằng exec "$@", và một script rà soát cộng chốt kiểm — các chương 4, 5, 6, 7, 8, 9, 10, 11 và 12.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 4, 5, 6 ─────────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'dockerfile',
          prompt: B(
            '<p><b>Q1 — A Dockerfile you would be happy to deploy (chapters 4, 5 and 6).</b> The <code>Q1/</code> folder holds a tiny Node service: a <code>package.json</code>, a <code>build.js</code> that stands in for <code>tsc</code> by copying <code>src/index.js</code> to <code>dist/index.js</code>, and the server itself, which listens on ' + c('0.0.0.0:$PORT') + ' and answers ' + c('/health') + ' with ' + c('{"ok":true,"user":<uid>}') + '. Write <code>Q1/.dockerignore</code> and <code>Q1/Dockerfile</code>.</p>' +
            '<p>Six things are being graded, and each is checkable with one command:</p>' +
            '<ul>' +
            '<li><b>Multi-stage.</b> The final image must contain <code>dist/</code> and <code>package.json</code> and nothing else from the project — no <code>src/</code>, no <code>build.js</code>.</li>' +
            '<li><b>Ordering.</b> Copy the manifest, install, then copy the source. Editing <code>src/index.js</code> must not re-run the install.</li>' +
            '<li><b>Non-root.</b> ' + c('curl /health') + ' must report a <code>user</code> that is not 0. The official Node image already ships a <code>node</code> user with UID 1000.</li>' +
            '<li><b>Exec-form CMD.</b> ' + c('docker exec q1 ps -o pid,args') + ' must show your process as PID 1, not a shell and not <code>npm</code>.</li>' +
            '<li><b>A healthcheck that can actually run.</b> This image ships neither <code>curl</code> nor <code>wget</code> — check it with ' + c('docker exec') + ' before you trust it. Give it a <code>--start-period</code>.</li>' +
            '<li><b>A <code>.dockerignore</code>.</b> At minimum <code>node_modules</code>, <code>.git</code>, <code>.env</code> and <code>dist</code>, so a stray file cannot travel in the build context or be baked into a published image.</li>' +
            '</ul>',

            '<p><b>Câu 1 — Một Dockerfile bạn sẵn lòng đem đi deploy (chương 4, 5 và 6).</b> Thư mục <code>Q1/</code> chứa một dịch vụ Node tí hon: một <code>package.json</code>, một <code>build.js</code> đóng vai <code>tsc</code> bằng cách chép <code>src/index.js</code> sang <code>dist/index.js</code>, và chính cái máy chủ, thứ nghe ở ' + c('0.0.0.0:$PORT') + ' và trả lời ' + c('/health') + ' bằng ' + c('{"ok":true,"user":<uid>}') + '. Hãy viết <code>Q1/.dockerignore</code> và <code>Q1/Dockerfile</code>.</p>' +
            '<p>Sáu thứ bị chấm, và mỗi thứ đều kiểm được bằng đúng một câu lệnh:</p>' +
            '<ul>' +
            '<li><b>Nhiều tầng.</b> Ảnh cuối phải chứa <code>dist/</code> và <code>package.json</code> và không gì khác từ dự án — không <code>src/</code>, không <code>build.js</code>.</li>' +
            '<li><b>Thứ tự.</b> Chép manifest, cài, rồi mới chép mã nguồn. Sửa <code>src/index.js</code> KHÔNG được làm bước cài chạy lại.</li>' +
            '<li><b>Không phải root.</b> ' + c('curl /health') + ' phải báo một <code>user</code> khác 0. Ảnh Node chính thức vốn đã có sẵn người dùng <code>node</code> với UID 1000.</li>' +
            '<li><b>CMD dạng exec.</b> ' + c('docker exec q1 ps -o pid,args') + ' phải cho thấy tiến trình của bạn là PID 1, không phải một shell và không phải <code>npm</code>.</li>' +
            '<li><b>Một healthcheck CHẠY ĐƯỢC THẬT.</b> Ảnh này không có <code>curl</code> lẫn <code>wget</code> — hãy kiểm nó bằng ' + c('docker exec') + ' trước khi tin nó. Nhớ cho nó một <code>--start-period</code>.</li>' +
            '<li><b>Một <code>.dockerignore</code>.</b> Tối thiểu <code>node_modules</code>, <code>.git</code>, <code>.env</code> và <code>dist</code>, để một file lạc chỗ không đi được vào ngữ cảnh dựng hay bị nướng vào một cái ảnh đã công bố.</li>' +
            '</ul>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['multistage',
              'Two stages, and the final image contains only <code>dist/</code> and <code>package.json</code> — <code>ls /app/src</code> inside it must fail.',
              'Hai stage, và ảnh cuối chỉ chứa <code>dist/</code> với <code>package.json</code> — lệnh <code>ls /app/src</code> bên trong nó phải hỏng.',
              0.4],
            ['ordering',
              'The manifest is copied and the install runs BEFORE the source is copied, so editing <code>src/index.js</code> leaves the install layer cached.',
              'Manifest được chép và bước cài chạy TRƯỚC khi chép mã nguồn, nên sửa <code>src/index.js</code> vẫn giữ được tầng cài trong cache.',
              0.3],
            ['nonroot',
              'A <code>USER</code> instruction placed after the <code>COPY</code>s that need root, with the copied files owned by that user (<code>COPY --chown</code>); <code>/health</code> reports a non-zero uid.',
              'Một chỉ thị <code>USER</code> đặt sau các lệnh <code>COPY</code> cần quyền root, và file đã chép thuộc sở hữu người dùng đó (<code>COPY --chown</code>); <code>/health</code> báo một uid khác 0.',
              0.3],
            ['runtime',
              'Exec-form <code>CMD</code> so the process is PID 1, plus a <code>HEALTHCHECK</code> that uses a binary this image actually ships and reaches <code>healthy</code>.',
              '<code>CMD</code> dạng exec để tiến trình là PID 1, cộng một <code>HEALTHCHECK</code> dùng chương trình mà ảnh này thật sự có và đạt được trạng thái <code>healthy</code>.',
              0.3],
            ['ignore',
              'A <code>.dockerignore</code> covering at least <code>node_modules</code>, <code>.git</code>, <code>.env</code> and <code>dist</code>.',
              'Một <code>.dockerignore</code> phủ ít nhất <code>node_modules</code>, <code>.git</code>, <code>.env</code> và <code>dist</code>.',
              0.2],
          ]),
        }),

        /* ── Q2 · chương 1, 4, 5, 6 ──────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'dockerfile',
          prompt: B(
            '<p><b>Q2 — Repair a Dockerfile that builds green (chapters 1, 4, 5 and 6).</b> <code>Q2/Dockerfile.broken</code> is in the starter block. It is not a trick file: it builds successfully, the container starts, and the application answers. It is also wrong in seven separate ways.</p>' +
            '<p>Deliver two files. <code>Q2/FAULTS.md</code>: one line per fault, saying what it is <em>and what it costs</em> — "unpinned base image" is half an answer, "unpinned base image, so the file is not reproducible and can cross a major version" is the whole one. Then <code>Q2/Dockerfile</code>: the corrected version.</p>' +
            '<p>Two constraints. <code>curl</code> must still be present in the final image, so removing the package is not a fix. And the token really is needed to install from a private registry — say how to pass it without it appearing in ' + c('docker history') + '.</p>' +
            '<p>The expected-output block shows the broken image being measured, so you can check your reading against the evidence: what PID 1 is, which user it runs as, what ' + c('docker history') + ' hands to anyone who pulls it, and what is still sitting in <code>/app</code>.</p>',

            '<p><b>Câu 2 — Vá một Dockerfile dựng xanh (chương 1, 4, 5 và 6).</b> File <code>Q2/Dockerfile.broken</code> nằm trong khối mã cho sẵn. Nó không phải một file gài bẫy cú pháp: nó dựng thành công, container khởi động, và ứng dụng trả lời được. Nó cũng sai ở bảy chỗ riêng biệt.</p>' +
            '<p>Nộp hai file. <code>Q2/FAULTS.md</code>: mỗi lỗi một dòng, nói rõ đó là lỗi gì <em>và nó tốn cái gì</em> — "ảnh nền chưa ghim" mới là nửa câu trả lời, "ảnh nền chưa ghim, nên file không tái lập được và có thể nhảy qua một phiên bản lớn" mới là trọn vẹn. Rồi <code>Q2/Dockerfile</code>: bản đã sửa.</p>' +
            '<p>Hai ràng buộc. <code>curl</code> vẫn phải có mặt trong ảnh cuối, nên gỡ cái gói đó đi không phải là cách chữa. Và cái token thật sự cần để cài từ một registry riêng — hãy nói cách truyền nó vào mà không để nó hiện ra trong ' + c('docker history') + '.</p>' +
            '<p>Khối kết quả mong đợi cho thấy cái ảnh hỏng được đo thật, để bạn đối chiếu cách đọc của mình với bằng chứng: PID 1 là gì, nó chạy dưới người dùng nào, ' + c('docker history') + ' trao gì cho bất cứ ai kéo nó về, và thứ gì vẫn còn nằm trong <code>/app</code>.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['faults',
              'At least six of the seven faults named in <code>FAULTS.md</code>, each with the consequence rather than only the label.',
              'Nêu được ít nhất sáu trong bảy lỗi trong <code>FAULTS.md</code>, mỗi lỗi kèm hệ quả chứ không chỉ cái nhãn.',
              0.5],
            ['secret',
              'The token no longer reaches <code>docker history</code>: a BuildKit secret mount, or the build stage of a multi-stage build whose layers are not exported — not a later <code>rm</code>.',
              'Cái token không còn tới được <code>docker history</code>: một secret mount của BuildKit, hoặc stage dựng của một bản dựng nhiều tầng vốn không xuất tầng ra — chứ không phải một lệnh <code>rm</code> ở sau.',
              0.4],
            ['runtime',
              'Exec-form <code>CMD</code> naming the real binary, a non-root <code>USER</code>, and a pinned base tag.',
              '<code>CMD</code> dạng exec gọi đúng chương trình thật, một <code>USER</code> không phải root, và một tag ảnh nền đã ghim.',
              0.3],
            ['build',
              'Manifest before source, <code>apk update</code> and <code>apk add</code> in one <code>RUN</code>, a <code>.dockerignore</code>, and <code>curl</code> still present in the final image.',
              'Manifest trước mã nguồn, <code>apk update</code> và <code>apk add</code> trong cùng một <code>RUN</code>, có <code>.dockerignore</code>, và <code>curl</code> vẫn còn trong ảnh cuối.',
              0.3],
          ]),
        }),

        /* ── Q3 · chương 7, 8, 9, 10 ─────────────────────────────── */
        codeQ({
          points: 2,
          language: 'yaml',
          prompt: B(
            '<p><b>Q3 — A stack whose network layout is an access-control policy (chapters 7, 8, 9 and 10).</b> Write <code>Q3/compose.yaml</code> with four services: <code>db</code> (PostgreSQL 16), <code>migrate</code>, <code>api</code> (the image from Q1) and <code>proxy</code> (nginx, with the given <code>ops/nginx.conf</code>).</p>' +
            '<ul>' +
            '<li><b>Two networks.</b> <code>public</code> and <code>private</code>, the latter declared ' + c('internal: true') + '. Put each service on the fewest networks that let it do its job. Exactly one service should end up on both, and the proxy must not be able to <em>resolve</em> the name <code>db</code> at all.</li>' +
            '<li><b>Exactly one published port.</b> The proxy, on ' + c('127.0.0.1:8088:80') + '. The database publishes nothing.</li>' +
            '<li><b>A healthcheck on <code>db</code></b> using <code>pg_isready</code>, with an <code>interval</code>, a <code>timeout</code>, <code>retries</code> and a <code>start_period</code>.</li>' +
            '<li><b>A migration gate.</b> <code>migrate</code> runs ' + c('CREATE TABLE IF NOT EXISTS note (id serial primary key, body text)') + ', exits, and never restarts. <code>api</code> must not start until <code>db</code> is healthy <em>and</em> <code>migrate</code> has exited 0.</li>' +
            '<li><b>A named volume</b> for the database, so a <code>compose down</code> does not lose it.</li>' +
            '<li><b>A required password.</b> A missing <code>POSTGRES_PASSWORD</code> must fail the whole <code>up</code> with your own message, not start a database with an empty superuser password.</li>' +
            '</ul>' +
            '<p>Write the <code>networks:</code> lines before you write the services; they are the part a reviewer should read first.</p>',

            '<p><b>Câu 3 — Một stack mà bố cục mạng chính là chính sách kiểm soát truy cập (chương 7, 8, 9 và 10).</b> Hãy viết <code>Q3/compose.yaml</code> với bốn dịch vụ: <code>db</code> (PostgreSQL 16), <code>migrate</code>, <code>api</code> (ảnh từ câu 1) và <code>proxy</code> (nginx, dùng file <code>ops/nginx.conf</code> cho sẵn).</p>' +
            '<ul>' +
            '<li><b>Hai mạng.</b> <code>public</code> và <code>private</code>, cái sau khai báo ' + c('internal: true') + '. Đặt mỗi dịch vụ lên số mạng ÍT NHẤT đủ để nó làm việc của mình. Đúng một dịch vụ được nằm trên cả hai, và proxy phải hoàn toàn KHÔNG PHÂN GIẢI được cái tên <code>db</code>.</li>' +
            '<li><b>Đúng một cổng được công bố.</b> Của proxy, ở ' + c('127.0.0.1:8088:80') + '. Cơ sở dữ liệu không công bố gì.</li>' +
            '<li><b>Một healthcheck cho <code>db</code></b> dùng <code>pg_isready</code>, có đủ <code>interval</code>, <code>timeout</code>, <code>retries</code> và <code>start_period</code>.</li>' +
            '<li><b>Một cổng chặn migration.</b> <code>migrate</code> chạy ' + c('CREATE TABLE IF NOT EXISTS note (id serial primary key, body text)') + ', thoát ra, và không bao giờ khởi động lại. <code>api</code> không được khởi chạy cho tới khi <code>db</code> khoẻ VÀ <code>migrate</code> đã thoát 0.</li>' +
            '<li><b>Một volume có tên</b> cho cơ sở dữ liệu, để một lệnh <code>compose down</code> không làm mất nó.</li>' +
            '<li><b>Một mật khẩu bắt buộc.</b> Thiếu <code>POSTGRES_PASSWORD</code> thì phải làm hỏng cả lệnh <code>up</code> kèm thông điệp của chính bạn, chứ không được khởi chạy một cơ sở dữ liệu có mật khẩu siêu người dùng rỗng.</li>' +
            '</ul>' +
            '<p>Hãy viết các dòng <code>networks:</code> TRƯỚC khi viết các dịch vụ; đó là phần một người rà soát nên đọc đầu tiên.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['networks',
              'Two networks with <code>private</code> marked <code>internal: true</code>; only <code>api</code> is on both, and <code>getent hosts db</code> from inside the proxy returns nothing.',
              'Hai mạng với <code>private</code> đánh dấu <code>internal: true</code>; chỉ <code>api</code> nằm trên cả hai, và <code>getent hosts db</code> từ bên trong proxy không trả về gì.',
              0.5],
            ['ports',
              'Exactly one <code>ports:</code> entry in the whole file, on the proxy, bound to <code>127.0.0.1</code>.',
              'Đúng một mục <code>ports:</code> trong cả file, ở proxy, gắn vào <code>127.0.0.1</code>.',
              0.4],
            ['ordering',
              'A working <code>pg_isready</code> healthcheck with <code>start_period</code>, and <code>api</code> gated on both <code>service_healthy</code> and <code>service_completed_successfully</code>.',
              'Một healthcheck <code>pg_isready</code> chạy được kèm <code>start_period</code>, và <code>api</code> bị chặn bởi cả <code>service_healthy</code> lẫn <code>service_completed_successfully</code>.',
              0.5],
            ['migrate',
              '<code>migrate</code> carries <code>restart: "no"</code> and really does exit 0 — the table exists afterwards, verified with <code>psql</code>.',
              '<code>migrate</code> có <code>restart: "no"</code> và thật sự thoát 0 — cái bảng tồn tại sau đó, kiểm bằng <code>psql</code>.',
              0.3],
            ['config',
              'A named volume for the data directory and <code>${POSTGRES_PASSWORD:?...}</code> so a missing value fails <code>up</code> with a readable message.',
              'Một volume có tên cho thư mục dữ liệu và <code>${POSTGRES_PASSWORD:?...}</code> để thiếu giá trị thì lệnh <code>up</code> hỏng kèm một thông điệp đọc được.',
              0.3],
          ]),
        }),

        /* ── Q4 · chương 1.3, 4.3, 9.3 ───────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'bash',
          khongChayDuoc: 'lời giải là GÓI NHIỀU FILE (Dockerfile + entrypoint.sh + migrate.sh) chứ không phải một chương trình chạy được; đã kiểm thật bằng docker build + run',
          prompt: B(
            '<p><b>Q4 — An entrypoint that disappears (chapters 1, 4 and 9).</b> Write <code>Q4/entrypoint.sh</code> and <code>Q4/Dockerfile</code> for an Alpine-based image whose default command is ' + c('["sleep", "600"]') + '. The script does three things and then gets out of the way:</p>' +
            '<ol>' +
            '<li><b>Wait for a dependency.</b> Poll ' + c('$DB_HOST:$DB_PORT') + ' (defaults <code>db</code> and <code>5432</code>) with <code>nc</code>, printing progress <b>to stderr</b> so the application still owns stdout. Give up after ' + c('$WAIT_TIMEOUT') + ' seconds (default 60) and exit non-zero.</li>' +
            '<li><b>Run one-time setup.</b> Call the given <code>./migrate.sh</code>, unless ' + c('RUN_MIGRATIONS=false') + ' — opt-out, so opening a debug shell does not migrate a database.</li>' +
            '<li><b>Hand over.</b> End with ' + c('exec "$@"') + '.</li>' +
            '</ol>' +
            '<p>Three properties are being measured, and the expected-output block shows all three plus the counter-example:</p>' +
            '<ul>' +
            '<li><b>A</b> — with the default command, ' + c('ps -o pid,args') + ' inside must show <code>sleep 600</code> as PID 1. If it shows the script or <code>/bin/sh</code>, the <code>exec</code> is missing and your application will not receive SIGTERM.</li>' +
            '<li><b>B</b> — ' + c('docker run img echo "custom command ran"') + ' must still run the setup and then the custom command. Hard-coding the app in the script instead of using ' + c('"$@"') + ' breaks every debugging use of the image.</li>' +
            '<li><b>C</b> — with an unreachable dependency the container must stop with exit 1, not start the application against nothing.</li>' +
            '</ul>' +
            '<p>Two details worth getting right: ' + c('set -e') + ' at the top, so a failed migration stops the container instead of starting an app against a half-migrated schema; and the quotes in ' + c('"$@"') + ', because unquoted, an argument containing a space is split into two.</p>',

            '<p><b>Câu 4 — Một entrypoint biết tự biến mất (chương 1, 4 và 9).</b> Hãy viết <code>Q4/entrypoint.sh</code> và <code>Q4/Dockerfile</code> cho một ảnh nền Alpine có câu lệnh mặc định là ' + c('["sleep", "600"]') + '. Script làm ba việc rồi tránh đường:</p>' +
            '<ol>' +
            '<li><b>Chờ một phụ thuộc.</b> Thăm dò ' + c('$DB_HOST:$DB_PORT') + ' (mặc định <code>db</code> và <code>5432</code>) bằng <code>nc</code>, in tiến trình <b>ra stderr</b> để ứng dụng vẫn sở hữu stdout. Bỏ cuộc sau ' + c('$WAIT_TIMEOUT') + ' giây (mặc định 60) và thoát với mã khác 0.</li>' +
            '<li><b>Chạy phần thiết lập một lần.</b> Gọi file <code>./migrate.sh</code> cho sẵn, trừ khi ' + c('RUN_MIGRATIONS=false') + ' — kiểu chọn-không, để việc mở một shell gỡ lỗi không làm chạy migration lên cơ sở dữ liệu.</li>' +
            '<li><b>Bàn giao.</b> Kết thúc bằng ' + c('exec "$@"') + '.</li>' +
            '</ol>' +
            '<p>Ba tính chất bị đo, và khối kết quả mong đợi cho thấy cả ba cộng một ví dụ phản chứng:</p>' +
            '<ul>' +
            '<li><b>A</b> — với câu lệnh mặc định, ' + c('ps -o pid,args') + ' bên trong phải hiện <code>sleep 600</code> ở PID 1. Nếu nó hiện cái script hay <code>/bin/sh</code> thì thiếu <code>exec</code>, và ứng dụng của bạn sẽ không nhận được SIGTERM.</li>' +
            '<li><b>B</b> — ' + c('docker run img echo "custom command ran"') + ' vẫn phải chạy phần thiết lập rồi tới câu lệnh tuỳ chỉnh. Viết cứng tên ứng dụng vào script thay vì dùng ' + c('"$@"') + ' là phá mọi cách dùng cái ảnh để gỡ lỗi.</li>' +
            '<li><b>C</b> — với một phụ thuộc không với tới được, container phải dừng lại với mã thoát 1, chứ không khởi chạy ứng dụng lên hư không.</li>' +
            '</ul>' +
            '<p>Hai chi tiết đáng làm cho đúng: ' + c('set -e') + ' ở đầu file, để một lượt migration hỏng thì dừng container chứ không khởi chạy ứng dụng lên một schema mới migrate được nửa chừng; và cặp nháy trong ' + c('"$@"') + ', vì nếu không bọc nháy thì một tham số có dấu cách sẽ bị tách làm hai.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['exec',
              'The script ends in <code>exec "$@"</code> — quoted — so <code>ps</code> shows the CMD as PID 1 and not the script or a shell.',
              'Script kết thúc bằng <code>exec "$@"</code> — có bọc nháy — nên <code>ps</code> hiện CMD ở PID 1 chứ không phải cái script hay một shell.',
              0.7],
            ['overridable',
              '<code>CMD</code> stays overridable: <code>docker run img echo hi</code> runs the setup and then the given command, because the script never hard-codes the application.',
              '<code>CMD</code> vẫn ghi đè được: <code>docker run img echo hi</code> chạy phần thiết lập rồi tới câu lệnh đã cho, vì script không viết cứng tên ứng dụng.',
              0.5],
            ['wait',
              'The dependency poll works, honours <code>DB_HOST</code>, <code>DB_PORT</code> and <code>WAIT_TIMEOUT</code>, and gives up with a non-zero exit rather than looping forever.',
              'Vòng thăm dò phụ thuộc chạy được, tôn trọng <code>DB_HOST</code>, <code>DB_PORT</code> và <code>WAIT_TIMEOUT</code>, và bỏ cuộc bằng một mã thoát khác 0 chứ không lặp mãi.',
              0.5],
            ['hygiene',
              '<code>set -e</code> at the top, progress on stderr, and migrations behind an opt-out (<code>RUN_MIGRATIONS</code>).',
              'Có <code>set -e</code> ở đầu, tiến trình in ra stderr, và migration nằm sau một công tắc chọn-không (<code>RUN_MIGRATIONS</code>).',
              0.4],
            ['dockerfile',
              'The Dockerfile sets an exec-form <code>ENTRYPOINT</code> and <code>CMD</code>, installs <code>netcat-openbsd</code>, and makes the script executable as it copies it (<code>COPY --chmod</code>).',
              'Dockerfile đặt <code>ENTRYPOINT</code> và <code>CMD</code> ở dạng exec, cài <code>netcat-openbsd</code>, và cấp quyền thực thi cho script ngay lúc chép (<code>COPY --chmod</code>).',
              0.4],
          ]),
        }),

        /* ── Q5 · chương 2.2, 6.4, 11, 12 ────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'bash',
          khongChayDuoc: 'script đòi tham số dòng lệnh (<base-url> <route>...) và một Docker daemon SỐNG có stack đang chạy; đã kiểm thật trên stack thật, bắt đúng 3 lỗi rồi exit 1',
          prompt: B(
            '<p><b>Q5 — The check you run after every deploy (chapters 2, 6, 11 and 12).</b> Write <code>Q5/audit.sh</code>, called as ' + c('./audit.sh <base-url> <route> [route...]') + '. It exits 0 only when every running container passes the hardening checks <em>and</em> every route answers with something other than 404.</p>' +
            '<p>For each container in ' + c('docker ps') + ', report and count as a failure:</p>' +
            '<ul>' +
            '<li>running as <b>root</b> — no <code>USER</code> in the image and none at run time;</li>' +
            '<li>no <b>memory limit</b> — one leak then takes the whole host, and the kernel picks the largest process, which is your database;</li>' +
            '<li><b>privileged</b>, or <code>/var/run/docker.sock</code> mounted — either one is root on the host;</li>' +
            '<li>a non-zero <b>RestartCount</b>, or health status <b>unhealthy</b>.</li>' +
            '</ul>' +
            '<p>Then two more checks. Any port published on <code>0.0.0.0</code> is a failure — that is the rule that puts databases on the public internet regardless of what the firewall says. And for each route, ' + c('curl') + ' it: <b>404 fails the audit</b>, because a route you know exists returning 404 means the running container is not the image you just built; 200 and 401 both mean the route is mounted and are fine.</p>' +
            '<p>Print a running <code>ok</code>/<code>warn</code>/<code>FAIL</code> line per check, a count at the end, and exit non-zero when the count is not zero — a check whose exit code nobody can act on is not a check. Reproduce the transcript with the two containers named in the starter block.</p>',

            '<p><b>Câu 5 — Phép kiểm bạn chạy sau mỗi lần deploy (chương 2, 6, 11 và 12).</b> Hãy viết <code>Q5/audit.sh</code>, gọi theo dạng ' + c('./audit.sh <base-url> <route> [route...]') + '. Nó chỉ thoát 0 khi mọi container đang chạy đều qua các phép kiểm gia cố VÀ mọi tuyến đều trả về thứ gì đó khác 404.</p>' +
            '<p>Với mỗi container trong ' + c('docker ps') + ', hãy báo cáo và tính là một lỗi nếu:</p>' +
            '<ul>' +
            '<li>đang chạy dưới quyền <b>root</b> — không có <code>USER</code> trong ảnh và cũng không có lúc chạy;</li>' +
            '<li>không có <b>trần bộ nhớ</b> — một chỗ rò khi đó kéo sập cả máy chủ, và nhân chọn tiến trình lớn nhất, tức là cơ sở dữ liệu của bạn;</li>' +
            '<li>đang <b>privileged</b>, hoặc có gắn <code>/var/run/docker.sock</code> — cái nào cũng là root trên máy chủ;</li>' +
            '<li><b>RestartCount</b> khác 0, hoặc trạng thái sức khoẻ là <b>unhealthy</b>.</li>' +
            '</ul>' +
            '<p>Rồi hai phép kiểm nữa. Bất kỳ cổng nào công bố lên <code>0.0.0.0</code> đều là một lỗi — đó chính là cái luật đưa các cơ sở dữ liệu lên Internet công cộng bất kể tường lửa nói gì. Và với mỗi tuyến, hãy ' + c('curl') + ' vào nó: <b>404 làm hỏng lượt rà soát</b>, vì một tuyến bạn biết chắc là có mà trả 404 nghĩa là container đang chạy KHÔNG phải cái ảnh bạn vừa dựng; 200 và 401 đều nghĩa là tuyến đã được gắn và đều ổn.</p>' +
            '<p>Hãy in mỗi phép kiểm một dòng <code>ok</code>/<code>warn</code>/<code>FAIL</code>, một con số tổng ở cuối, và thoát với mã khác 0 khi con số đó khác 0 — một phép kiểm mà không ai hành động được theo mã thoát của nó thì không phải một phép kiểm. Hãy tái hiện đoạn terminal bằng hai container ghi trong khối mã cho sẵn.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['inspect',
              'Reads user, read-only, memory, privileged, restart count, health and mounts out of <code>docker inspect --format</code> rather than parsing <code>docker ps</code> text, and handles a container with no healthcheck without crashing.',
              'Đọc người dùng, chỉ-đọc, bộ nhớ, privileged, số lần restart, sức khoẻ và các mount ra từ <code>docker inspect --format</code> chứ không phân tích văn bản của <code>docker ps</code>, và xử lý được container không có healthcheck mà không sập.',
              0.6],
            ['findings',
              'Root, missing memory limit, privileged, a mounted <code>docker.sock</code>, restarts and unhealthy are each detected and each counted as a failure.',
              'Chạy root, thiếu trần bộ nhớ, privileged, có gắn <code>docker.sock</code>, có restart và unhealthy — mỗi cái đều được phát hiện và đều tính là một lỗi.',
              0.6],
            ['ports',
              'A port published on <code>0.0.0.0</code> is reported as a failure and the container holding it is named.',
              'Một cổng công bố lên <code>0.0.0.0</code> được báo là lỗi và container giữ nó được gọi tên.',
              0.4],
            ['smoke',
              'Every route is curled; 404 fails, 200 and 401 pass, and any other status is reported rather than silently ignored.',
              'Mọi tuyến đều được curl; 404 thì hỏng, 200 và 401 thì qua, và mọi mã trạng thái khác được báo ra chứ không bị bỏ qua trong im lặng.',
              0.5],
            ['exit',
              'A findings count is printed and the script exits non-zero when it is not zero, so a deploy script can act on the result; <code>set -Eeuo pipefail</code> at the top.',
              'In ra số lỗi tìm được và script thoát với mã khác 0 khi con số đó khác 0, để một script deploy hành động được theo kết quả; có <code>set -Eeuo pipefail</code> ở đầu file.',
              0.4],
          ]),
        }),
      ],
    },
  ],
};

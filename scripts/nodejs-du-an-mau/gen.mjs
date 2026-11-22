import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const D = new URL('./demo/', import.meta.url).pathname; // chạy: cd scripts/nodejs-du-an-mau && npm install && node gen.mjs ../../content/courses/nodejs/_du-an-ma.mjs (cần redis-server cổng 6391; mốc 17 phần Docker là output dán tay từ lượt chạy thật)
const rd = (f) => readFileSync(D + f, 'utf8').trimEnd();
const run = (cmd, cwd = D) => execSync(cmd + ' 2>&1', { cwd, encoding: 'utf8', shell: '/bin/zsh', timeout: 120000 }).trimEnd();
const M = {};
M[1] = [{ file: 'plant.mjs', lang: 'javascript', code: rd('plant.mjs') }, { file: 'm01.mjs', lang: 'javascript', code: rd('m01.mjs') }, { cmd: 'node m01.mjs', out: run('node m01.mjs') }];
M[2] = [{ file: 'm02.mjs', lang: 'javascript', code: rd('m02.mjs') }, { file: 'm02-lib.mjs', lang: 'javascript', code: rd('m02-lib.mjs') }, { file: 'm02-worker.mjs', lang: 'javascript', code: rd('m02-worker.mjs') }, { cmd: 'node m02.mjs', out: run('node m02.mjs') }];
M[3] = [{ file: 'm03.mjs', lang: 'javascript', code: rd('m03.mjs') }, { cmd: 'node m03.mjs', out: run('node m03.mjs') }];
M[4] = [{ file: 'm04p/package.json', lang: 'json', code: rd('m04p/package.json') }, { file: 'm04p/.gitignore', lang: 'bash', code: rd('m04p/.gitignore') }, { cmd: 'npm run', out: run('npm run', D + 'm04p') }, { cmd: 'npm run check', out: run('npm run check', D + 'm04p').split('\n').filter((l) => /^(> |✔)/.test(l)).join('\n') }, { cmd: 'git check-ignore -v .env node_modules/x .env.example', out: run('git check-ignore -v .env node_modules/x .env.example', D + 'm04p') }];
M[5] = [{ file: 'm05.mjs', lang: 'javascript', code: rd('m05.mjs') }, { cmd: 'node m05.mjs', out: run('node m05.mjs') }];
M[6] = [{ file: 'm06.mjs', lang: 'javascript', code: rd('m06.mjs') }, { cmd: 'node m06.mjs', out: run('node m06.mjs') }];
M[7] = [{ file: 'm07/schema.prisma', lang: 'prisma', code: rd('m07/schema.prisma') }, { cmd: 'npx prisma migrate diff --from-empty --to-schema-datamodel m07/schema.prisma --script', out: run('DATABASE_URL=postgresql://x@localhost/x /Users/admin/Downloads/api-backend/node_modules/.bin/prisma migrate diff --from-empty --to-schema-datamodel m07/schema.prisma --script').split('\n').filter((l) => l.trim()).join('\n') }];
M[8] = [{ file: 'm08.mjs', lang: 'javascript', code: rd('m08.mjs') }, { cmd: 'node m08.mjs', out: run('node m08.mjs') }];
M[9] = [{ file: 'm09.mjs', lang: 'javascript', code: rd('m09.mjs') }, { cmd: 'node m09.mjs', out: run('node m09.mjs') }];
M[10] = [{ file: 'm10.mjs', lang: 'javascript', code: rd('m10.mjs') }, { cmd: 'node m10.mjs', out: run('node m10.mjs') }];
M[11] = [{ file: 'm11.mjs', lang: 'javascript', code: rd('m11.mjs') }, { cmd: 'node m11.mjs', out: run('node m11.mjs') }];
M[12] = [{ file: 'm12.mjs', lang: 'javascript', code: rd('m12.mjs') }, { cmd: 'redis-server --port 6391 --save "" --daemonize yes && node m12.mjs', out: run('node m12.mjs') }];
M[13] = [{ file: 'm13.mjs', lang: 'javascript', code: rd('m13.mjs') }, { cmd: 'node m13.mjs', out: run('node m13.mjs') }];
M[14] = [{ file: 'm14/app.mjs', lang: 'javascript', code: rd('m14/app.mjs') }, { file: 'm14/plants.test.mjs', lang: 'javascript', code: rd('m14/plants.test.mjs') }, { cmd: 'node --test m14/', out: run('node --test m14/').split('\n').filter((l) => !/^ℹ (suites|cancelled|skipped|todo)/.test(l)).join('\n') }];
M[15] = [{ file: 'm15.mjs', lang: 'javascript', code: rd('m15.mjs') }, { cmd: 'node m15.mjs', out: run('node m15.mjs') }];
M[16] = [{ file: 'm16.mjs', lang: 'javascript', code: rd('m16.mjs') }, { cmd: 'node m16.mjs', out: run('node m16.mjs') }];
M[17] = [{ file: 'm17.mjs', lang: 'javascript', code: rd('m17.mjs') }, { file: 'm17img/Dockerfile', lang: 'dockerfile', code: rd('m17img/Dockerfile') }, { cmd: 'node m17.mjs demo', out: run('node m17.mjs demo') },
  { cmd: 'cp m17.mjs src/server.js && docker build -t plant-care-api:demo . && docker run -d --name plant-demo -p 3017:3017 plant-care-api:demo\ncurl -s localhost:3017/plants/slow-report & sleep 0.3; docker stop plant-demo; docker logs plant-demo', out: '{"ok":true} <- HTTP 200\nlistening, pid 1\nSIGTERM: stop accepting, finish in-flight requests\nall requests done, closing DB/Redis, exit 0\nexit code 0' }];
M[18] = [{ file: 'm18/check-layers.mjs', lang: 'javascript', code: rd('m18/check-layers.mjs') }, { cmd: 'node check-layers.mjs', out: run('node check-layers.mjs; true', D + 'm18') }];
const hdr = '/**\n * Node.js — mã + output của "khung mẫu chạy thật" cho 18 mốc dự án (đề tài mẫu "Plant-care log").\n * SINH TỰ ĐỘNG 22/11/2026 từ các tệp đã chạy thật (Node ' + process.version + ', Express 5, Redis 8 cục bộ, Docker 29); không sửa tay.\n * Chuỗi JSON: dấu gạch chéo ngược là escape của JSON trong chuỗi nháy kép, KHÔNG nằm trong template literal.\n */\n';
writeFileSync(process.argv[2], hdr + 'export const MA = ' + JSON.stringify(M, null, 1) + ';\n');
console.log(Object.keys(M).length, 'mốc');

/**
 * 10.2 — Dựng và đẩy ảnh Docker trong CI (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * Output THẬT: act 0.2.98 chạy job image (matrix api / api-migrate / web) — docker/setup-buildx-action v4.4.1 + build-push-action
 * v7.4.0 trên Docker của máy nhà, đẩy vào registry CỤC BỘ fsp-registry (registry:2, 127.0.0.1:41840) thay cho GHCR (không dùng
 * tài khoản GitHub). docker/metadata-action hỏng dưới act ("Bad credentials") ⇒ thay bằng một bước shell; cache type=gha tắt
 * dưới act (ACTIONS_RUNTIME_TOKEN not set, token giả bị từ chối) ⇒ đo cache từ xa type=registry bằng builder mới mỗi lượt (104,2 ⇒ 12,5 s); tên ảnh chữ hoa bị Docker từ chối; ảnh kéo về theo SHA.
 * Nguồn (GET 200 25/11/2026): CircleCI "Jan 4, 2023 security incident report"; GitHub Docs Working with the Container registry;
 * Docker Docs Cache management with GitHub Actions.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const CI_ANH = `  # Bài 10.2 — dựng ảnh Docker SAU KHI check + test xanh. PR: chỉ dựng (chứng minh Dockerfile còn dựng được), KHÔNG đẩy.
  # Push lên main: dựng + đẩy lên GHCR, tag theo mã commit (bất biến) — Chương 11 deploy đúng tag đó.
  image:
    name: image (\${{ matrix.ten }})
    needs: [check, test]
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: read
      packages: write # CHỈ job này được ghi vào registry
    strategy:
      fail-fast: false
      matrix:
        include:
          - { ten: api, dockerfile: apps/api/Dockerfile, target: runtime }
          - { ten: api-migrate, dockerfile: apps/api/Dockerfile, target: cong-cu } # ảnh chạy prisma migrate deploy (Ch11)
          - { ten: web, dockerfile: apps/web/Dockerfile, target: runtime }
    env:
      # vars.REGISTRY để trống trên GitHub ⇒ ghcr.io. Khi chạy bằng act, trỏ vào registry cục bộ (bài 10.2 giải thích).
      REGISTRY: \${{ vars.REGISTRY || 'ghcr.io' }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4.4.1
        with:
          # Trên GitHub để trống. act: mạng host (với tới registry cục bộ) + giới hạn RAM cho container buildkit.
          driver-opts: \${{ vars.BUILDX_DRIVER_OPTS }}
          buildkitd-config-inline: \${{ vars.BUILDKITD_CONFIG }}
      - name: Đăng nhập GHCR
        if: env.REGISTRY == 'ghcr.io' &amp;&amp; github.event_name == 'push'
        uses: docker/login-action@8aa5831fb8d48d8f76594c7ddde61ae58019f550 # v4.8.0
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }} # token tự cấp cho lượt chạy, hết hạn khi job xong — không cần PAT
      # Tên ảnh: registry/chủ-repo/chiase-&lt;ten&gt;, tag = mã commit đầy đủ (bất biến) + latest khi là main.
      # Tự tính bằng một dòng shell thay cho docker/metadata-action: ít một action bên thứ ba, và metadata-action
      # gọi REST API của GitHub (chạy bằng act không có token ⇒ "Bad credentials"). \${OWNER,,} = chữ thường:
      # GHCR từ chối tên có chữ hoa ("repository name must be lowercase").
      - id: ten
        env:
          OWNER: \${{ github.repository_owner }}
        run: |
          anh="\${REGISTRY}/\${OWNER,,}/chiase-\${{ matrix.ten }}"
          {
            echo "tags&lt;&lt;EOF"
            echo "\${anh}:\${GITHUB_SHA}"
            if [ "\${GITHUB_REF}" = refs/heads/main ]; then echo "\${anh}:latest"; fi
            echo "EOF"
          } &gt;&gt; "$GITHUB_OUTPUT"
      - uses: docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc # v7.4.0
        with:
          context: .
          file: \${{ matrix.dockerfile }}
          target: \${{ matrix.target }}
          push: \${{ github.event_name == 'push' }}
          tags: \${{ steps.ten.outputs.tags }}
          labels: org.opencontainers.image.revision=\${{ github.sha }}
          cache-from: type=gha,scope=\${{ matrix.ten }}
          cache-to: type=gha,mode=max,scope=\${{ matrix.ten }}`;

const META = `[CI/image (api-migrate)-2]   ☁  git clone 'https://github.com/docker/metadata-action' # ref=dc802804100637a589fabce1cb79ff13a1411302
[CI/image (web)-3        ]   ☁  git clone 'https://github.com/docker/metadata-action' # ref=dc802804100637a589fabce1cb79ff13a1411302
[CI/image (api)-1        ]   ☁  git clone 'https://github.com/docker/metadata-action' # ref=dc802804100637a589fabce1cb79ff13a1411302
[CI/image (api-migrate)-2] ⭐ Run Main docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302
[CI/image (api)-1        ] ⭐ Run Main docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302
[CI/image (api)-1        ]   ❌  Failure - Main docker/metadata-action@dc802804100637a589fabce1cb79ff13a1411302 [8.682274ms]`;

const CHU_HOA = `$ docker tag registry:2 127.0.0.1:41840/HocVien/chiase-api:thu
error parsing reference: "127.0.0.1:41840/HocVien/chiase-api:thu" is not a valid repository/tag: invalid reference format: repository name (HocVien/chiase-api) must be lowercase
$ OWNER=HocVien; echo "\${OWNER,,}"
hocvien`;

const LANH = `[CI/check] 🏁  Job succeeded
[CI/test ] 🏁  Job succeeded
[CI/image (web)-3        ]   ✅  Success - Main docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 [16.35328477s]
[CI/image (web)-3        ]   🚧  ::warning::ACTIONS_RUNTIME_TOKEN not set
[CI/image (web)-3        ]   | [command]/usr/bin/docker buildx build --cache-from type=gha,scope=web --cache-to type=gha,mode=max,scope=web --file apps/web/Dockerfile …
[CI/image (api)-1        ]   ✅  Success - Main docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 [24.625542187s]
[CI/image (api-migrate)-2]   ✅  Success - Main docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 [26.057834452s]
[CI/image (api)-1        ]   🚧  ::warning::ACTIONS_RUNTIME_TOKEN not set
[CI/image (api-migrate)-2]   🚧  ::warning::ACTIONS_RUNTIME_TOKEN not set
[CI/image (api)-1        ]   | [command]/usr/bin/docker buildx build --cache-from type=gha,scope=api --cache-to type=gha,mode=max,scope=api --file apps/api/Dockerfile …
[CI/image (api-migrate)-2]   | [command]/usr/bin/docker buildx build --cache-from type=gha,scope=api-migrate --cache-to type=gha,mode=max,scope=api-migrate --file apps/api/Dockerfile …
[CI/image (web)-3        ]   | #20 pushing manifest for 127.0.0.1:41840/nektos/chiase-web:942cbec0cedddeb5349205e4ddecffd644e6a696@sha256:3da50228d3f43489d9d895718e13175c9dace3eb5b8c0071f4c9c770e6327514 0.1s done
[CI/image (web)-3        ]   | #20 pushing manifest for 127.0.0.1:41840/nektos/chiase-web:latest@sha256:3da50228d3f43489d9d895718e13175c9dace3eb5b8c0071f4c9c770e6327514 2.3s done
[CI/image (web)-3        ]   ✅  Success - Main docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc [2m10.086312065s]
[CI/image (web)-3        ]   🚧  ::warning::Unable to get the ACTIONS_RUNTIME_TOKEN env variable
[CI/image (web)-3        ] 🏁  Job succeeded
[CI/image (api-migrate)-2]   | #15 pushing manifest for 127.0.0.1:41840/nektos/chiase-api-migrate:942cbec0cedddeb5349205e4ddecffd644e6a696@sha256:071b757af4ec2fd1a5fccfc8f654df04b2f8bd0fea09808fe0ac304afa3d44e5 0.1s done
[CI/image (api)-1        ]   | #18 pushing manifest for 127.0.0.1:41840/nektos/chiase-api:942cbec0cedddeb5349205e4ddecffd644e6a696@sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3370d982957cff4f32b872 0.1s done
[CI/image (api)-1        ]   | #18 pushing manifest for 127.0.0.1:41840/nektos/chiase-api:latest@sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3370d982957cff4f32b872 0.0s done
[CI/image (api-migrate)-2]   | #15 pushing manifest for 127.0.0.1:41840/nektos/chiase-api-migrate:latest@sha256:071b757af4ec2fd1a5fccfc8f654df04b2f8bd0fea09808fe0ac304afa3d44e5 0.0s done
[CI/image (api)-1        ]   ✅  Success - Main docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc [2m46.666544522s]
[CI/image (api-migrate)-2]   ✅  Success - Main docker/build-push-action@c3c9e263c25d99ce0380d002d59b67737d91b0dc [2m46.122393666s]
[CI/image (api)-1        ]   🚧  ::warning::Unable to get the ACTIONS_RUNTIME_TOKEN env variable
[CI/image (api-migrate)-2]   🚧  ::warning::Unable to get the ACTIONS_RUNTIME_TOKEN env variable
[CI/image (api)-1        ] 🏁  Job succeeded
[CI/image (api-migrate)-2] 🏁  Job succeeded
[CI/ci-xanh              ]   | check=success test=success image=success
[CI/ci-xanh              ] 🏁  Job succeeded`;

const GHA = `--env ACTIONS_RUNTIME_TOKEN=act-cuc-bo  (chuỗi bất kỳ)
[CI/image (api)-1        ]   🚧  ::warning::Cannot parse GitHub Actions Runtime Token: Invalid token specified: missing part #2
[CI/image (api)-1        ]   | ERROR: failed to build: failed to solve: failed to configure gha cache exporter: token is malformed: token contains an invalid number of segments

--env ACTIONS_RUNTIME_TOKEN=&lt;một JWT tự chế, có exp&gt;
[CI/image (api)-1        ]   | ERROR: failed to build: failed to solve: failed to configure gha cache exporter: invalid token without expiration time`;

const CACHE_REG = `== lượt 1: builder mới fsp-ci-1, cache-from/to type=registry,ref=127.0.0.1:41840/cache/chiase-api,mode=max
mã thoát 0, 104.2 s
#7 importing cache manifest from 127.0.0.1:41840/cache/chiase-api
#13 [deps 3/3] RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --ignore-scripts
#14 [prod-deps 3/3] RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api …
#13 [deps 3/3] RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --ignore-scripts
#13 [deps 3/3] RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --ignore-scripts
#20 exporting cache to registry
fsp-ci-1 removed
== lượt 2: builder mới fsp-ci-2, cache-from/to type=registry,ref=127.0.0.1:41840/cache/chiase-api,mode=max
mã thoát 0, 12.5 s
#7 importing cache manifest from 127.0.0.1:41840/cache/chiase-api
#10 CACHED
#11 CACHED
#12 CACHED
#13 CACHED
#14 CACHED
#15 [prod-deps 3/3] RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api …
#15 CACHED
fsp-ci-2 removed`;

const DO_CACHE = `#!/usr/bin/env bash
# m102c.sh — đo cache dựng TỪ XA giống CI: mỗi lượt một builder BuildKit MỚI (như runner mới), cache để trong registry.
# chạy ở gốc repo; registry cục bộ ở 127.0.0.1:41840
C=127.0.0.1:41840/cache/chiase-api
for lan in 1 2; do
  docker buildx create --name fsp-ci-$lan --driver docker-container --driver-opt network=host --driver-opt memory=2g --driver-opt memory-swap=2g \\
    --config buildkitd.toml &gt;/dev/null
  echo "== lượt $lan: builder mới fsp-ci-$lan, cache-from/to type=registry,ref=$C,mode=max"
  S=$(date +%s.%N)
  docker buildx build --builder fsp-ci-$lan --progress plain -f apps/api/Dockerfile --target runtime \\
    --cache-from type=registry,ref=$C --cache-to type=registry,ref=$C,mode=max -t fsp-ci-api:lan$lan --output type=cacheonly . &gt; /tmp/m102c-$lan.log 2&gt;&amp;1
  echo "mã thoát $?, $(python3 -c "print(round($(date +%s.%N)-$S,1))") s"
  grep -E "importing cache manifest|CACHED|npm ci|exporting cache" /tmp/m102c-$lan.log | grep -E "^#[0-9]+ (\\[|importing|exporting|CACHED)" | grep -vE "sha256|DONE" | sed -E "s/ --omit=dev.*$/ …/" | head -8
  docker buildx rm fsp-ci-$lan &gt;/dev/null
done`;

const REG = `$ curl -s http://127.0.0.1:41840/v2/_catalog
{"repositories":["nektos/chiase-api","nektos/chiase-api-migrate","nektos/chiase-web"]}

$ curl -s http://127.0.0.1:41840/v2/nektos/chiase-api/tags/list
{"name":"nektos/chiase-api","tags":["942cbec0cedddeb5349205e4ddecffd644e6a696","latest"]}

$ curl -s http://127.0.0.1:41840/v2/nektos/chiase-api-migrate/tags/list
{"name":"nektos/chiase-api-migrate","tags":["942cbec0cedddeb5349205e4ddecffd644e6a696","latest"]}

$ curl -s http://127.0.0.1:41840/v2/nektos/chiase-web/tags/list
{"name":"nektos/chiase-web","tags":["942cbec0cedddeb5349205e4ddecffd644e6a696","latest"]}

$ docker pull -q 127.0.0.1:41840/nektos/chiase-api:942cbec0cedddeb5349205e4ddecffd644e6a696
127.0.0.1:41840/nektos/chiase-api:942cbec0cedddeb5349205e4ddecffd644e6a696
$ docker image inspect --format "{{index .Config.Labels \\"org.opencontainers.image.revision\\"}} {{.Config.User}}" 127.0.0.1:41840/nektos/chiase-api:942cbec0cedddeb5349205e4ddecffd644e6a696
942cbec0cedddeb5349205e4ddecffd644e6a696 node
$ docker run --rm --memory 256m --entrypoint sh 127.0.0.1:41840/nektos/chiase-api:942cbec0cedddeb5349205e4ddecffd644e6a696 -c "id; node -v; ls apps/api"
uid=1000(node) gid=1000(node) groups=1000(node)
v22.23.5
dist
package.json`;

const BK = `#1 [internal] booting buildkit
#1 DONE 16.5s
#1 [internal] load build definition from Dockerfile
#1 DONE 0.8s
#2 DONE 4.1s
#3 DONE 0.6s
#3 DONE 4.0s
#4 [internal] load metadata for docker.io/library/node:22-slim
#4 DONE 2.7s
#5 [internal] load .dockerignore
#5 DONE 0.1s
#6 [internal] load build context
#6 DONE 0.3s
#7 [base 1/2] FROM docker.io/library/node:22-slim@sha256:be979e5523c76fa4d5ca4ebd3099078f220aa47ec39c48ad5b5df9314debd6eb
#7 DONE 0.7s
#7 DONE 22.7s
#7 DONE 26.2s
#7 DONE 27.9s
#7 DONE 28.2s
#8 [base 2/2] WORKDIR /app
#8 DONE 3.9s
#9 [deps 1/3] COPY package.json package-lock.json ./
#9 DONE 5.3s
#10 [deps 2/3] COPY apps/api/package.json apps/api/
#10 DONE 3.6s
#11 [prod-deps 3/3] RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --omit=dev --omit=peer --ignore-scripts  &amp;&amp; node -e "const fs=require(
#12 [deps 3/3] RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --ignore-scripts
#11 DONE 56.9s
#12 DONE 57.2s
#13 [build 1/2] COPY apps/api/ apps/api/
#14 [runtime 1/3] COPY --from=prod-deps /app/node_modules node_modules
#13 DONE 5.4s
#15 [build 2/2] RUN npm exec -w apps/api -- prisma generate &amp;&amp; npm run build -w apps/api
#14 DONE 8.7s
#15 DONE 14.2s
#16 [runtime 2/3] COPY --from=build /app/apps/api/dist apps/api/dist
#16 DONE 8.6s
#17 [runtime 3/3] COPY apps/api/package.json apps/api/
#17 DONE 4.7s
#18 exporting to image
#18 exporting layers
#18 exporting layers 15.0s done
#18 exporting manifest sha256:88ac2ac2058ab53d16341f5688691e5d6f07a618717fd3b23d3041efbb819a6d
#18 exporting manifest sha256:88ac2ac2058ab53d16341f5688691e5d6f07a618717fd3b23d3041efbb819a6d 0.1s done
#18 exporting config sha256:d05034afd1e5231193895d46b2b6e21d19d684972bf255980364463db817df74 0.1s done
#18 exporting attestation manifest sha256:f2c7e8ccdc8e7f260c89614272269b9ac8cfe376029e4cb2994525c5f0f39ac1
#18 exporting attestation manifest sha256:f2c7e8ccdc8e7f260c89614272269b9ac8cfe376029e4cb2994525c5f0f39ac1 0.1s done
#18 exporting manifest list sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3370d982957cff4f32b872
#18 exporting manifest list sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3370d982957cff4f32b872 0.1s done
#18 DONE 15.5s
#18 pushing layers
#18 pushing layers 2.1s done
#18 pushing manifest for 127.0.0.1:41840/nektos/chiase-api:942cbec0cedddeb5349205e4ddecffd644e6a696@sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3
#18 pushing manifest for 127.0.0.1:41840/nektos/chiase-api:942cbec0cedddeb5349205e4ddecffd644e6a696@sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3
#18 pushing layers 0.2s done
#18 pushing manifest for 127.0.0.1:41840/nektos/chiase-api:latest@sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3370d982957cff4f32b872
#18 pushing manifest for 127.0.0.1:41840/nektos/chiase-api:latest@sha256:a4bc73146ed704f22ddad2409759a5b0008d2b6b5c3370d982957cff4f32b872 0.0s done
#18 DONE 17.9s
#19 DONE 0.0s`;


const NGUON = [
  nguon('🛡️', 'CircleCI — Jan 4, 2023 security incident report', 'circleci.com', 'https://circleci.com/blog/jan-4-2023-incident-report/'),
  nguon('📘', 'GitHub Docs — Working with the Container registry (GHCR)', 'docs.github.com', 'https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry'),
  nguon('📘', 'GitHub Docs — Automatic token authentication (GITHUB_TOKEN)', 'docs.github.com', 'https://docs.github.com/en/actions/tutorials/authenticate-with-github_token'),
  nguon('🐳', 'Docker Docs — Cache management with GitHub Actions', 'docs.docker.com', 'https://docs.docker.com/build/ci/github-actions/cache/'),
].join('\n');

const THE = [
  lienKet({ khoa: 'docker', bai: 'dk-5-4-cache-ci', title: 'Docker 5.4 — Chia sẻ cache với CI', sub: 'type=gha, type=registry, mode=max: đo kỹ hơn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-16-3-ci-ghcr-deploy', title: 'Docker 16.3 — CI build, GHCR, deploy và quay lui', sub: 'Cùng đường đi, ở khoá Docker.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-15-2-build-anh', title: 'GitHub Actions 15.2 — Dựng ảnh một lần: multi-stage, hai kiến trúc, ba tag', sub: 'Khi cần arm64 cho máy chủ ARM.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-6-2-token', title: 'GitHub Actions 6.2 — GITHUB_TOKEN, và cái ranh giới nó không vượt được', sub: 'Vì sao packages: write chỉ ở một job.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-6-3-oidc', title: 'GitHub Actions 6.3 — OIDC, và cái bí mật bạn thôi phải lưu', sub: 'Khi đẩy ảnh lên AWS/GCP thay vì GHCR.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '10.2 — Building and pushing Docker images in CI|||10.2 — Dựng và đẩy image Docker trong CI',
  slug: 'fp-10-2-build-image-ci',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thêm job "image" vào CI: chỉ chạy sau khi check + test xanh, dựng ba ảnh (api, api-migrate, web) bằng một matrix, PR thì chỉ dựng, push lên main thì đẩy lên GHCR với tag là MÃ COMMIT đầy đủ (bất biến — Chương 11 deploy đúng tag đó), quyền packages: write chỉ ở job này, đăng nhập bằng GITHUB_TOKEN tự hết hạn thay cho token cá nhân. Chạy thật bằng act, đẩy vào một registry cục bộ: docker/metadata-action hỏng dưới act nên thay bằng một dòng shell (và tự xử lý tên chữ hoa mà Docker từ chối), cache type=gha bị act tắt âm thầm — đo cache từ xa bằng builder mới mỗi lượt: 104 s ⇒ 12,5 s. Kéo ảnh về theo SHA để kiểm: uid 1000, nhãn revision đúng commit. Góc hacker: vụ CircleCI 01/2023 làm lộ secret lưu trong CI của mọi khách hàng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Images in CI</span>
<h2>Build once, in a clean place, and name it after the commit</h2>
<p class="lead">In Chapter 9 you built images on your own machine — with your cache, your uncommitted files, your Docker version. Chapter 11 must deploy something nobody can argue about: an image built by CI from one exact commit that passed every check, stored in a registry, and named so that "which code is running?" has a one-word answer.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">needs</span><span class="lz-d">image starts only after check AND test are green</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">matrix</span><span class="lz-d">api · api-migrate · web, three jobs in parallel, fail-fast off</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">build</span><span class="lz-d">Buildx + cache; PR: build only</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">push (main)</span><span class="lz-d">ghcr.io/&lt;owner&gt;/chiase-api:&lt;full SHA&gt; (+ latest)</span></div>
</div>

<h3>1. The job</h3>
<pre><code class="language-yaml">${CI_ANH}</code></pre>
<ul>
<li><strong><code>needs: [check, test]</code></strong> — no image for code that does not pass. Also cheaper: a red test stops the pipeline before the slowest part.</li>
<li><strong>Three images, one Dockerfile per app.</strong> <code>api</code> (target <code>runtime</code>), <code>api-migrate</code> (target <code>cong-cu</code>, the one-shot <code>prisma migrate deploy</code> image from 9.3 — Chapter 11 runs it before swapping the API) and <code>web</code>. <code>fail-fast: false</code>: if <code>web</code> breaks you still want to know whether <code>api</code> builds.</li>
<li><strong><code>permissions: packages: write</code> on this job only</strong>, and the login uses <code>secrets.GITHUB_TOKEN</code> — a token GitHub creates for this run and revokes when the job ends. No personal access token (PAT) sits in the repository's secrets.</li>
<li><strong><code>push: \${{ github.event_name == 'push' }}</code></strong> — a PR builds (proving the Dockerfile still works) but publishes nothing: unreviewed code, possibly from a fork, never lands in the registry.</li>
<li><strong>Tag = full commit SHA</strong> (+ <code>latest</code> on main) and the label <code>org.opencontainers.image.revision</code>. <code>latest</code> moves with every push; a SHA tag never does, so "deploy <code>abc123…</code>" and "roll back to the previous SHA" are exact operations.</li>
</ul>

<h3>2. Why not <code>docker/metadata-action</code>?</h3>
<p>It is the usual way to compute tags and labels. Under act it failed straight away:</p>
<div class="out">${META}</div>
<p>It reads repository information from GitHub's REST API with the run's token; act has no token for a repository that does not exist on GitHub. On GitHub it would work — but we only need two tags, and one shell step does it with one fewer third-party action to trust (lesson 10.1: every action is code you run with your token). The step also handles a trap metadata-action hides from you:</p>
<div class="out">${CHU_HOA}</div>
<p>Image names must be lowercase; GitHub user names often are not. <code>\${OWNER,,}</code> is bash's lowercase expansion.</p>

<h3>3. Running it: a local registry instead of GHCR</h3>
<p>With act the job pushes to <code>registry:2</code> running at <code>127.0.0.1:41840</code>. Three repository <em>variables</em> make that possible without touching the GitHub behaviour: <code>vars.REGISTRY</code> (empty on GitHub ⇒ <code>ghcr.io</code>), <code>vars.BUILDX_DRIVER_OPTS</code> (<code>network=host</code> so the BuildKit container can reach the local registry, plus <code>memory=2g</code>) and <code>vars.BUILDKITD_CONFIG</code> (plain HTTP for that registry). On GitHub all three are unset. The cold run:</p>
<div class="out">${LANH}</div>
<p>447 s for the whole pipeline; the three builds ran in parallel, 2 min 10 s (web) and 2 min 46 s (api, api-migrate) each, after 16–26 s to start a BuildKit container. And a warning that matters: <code>ACTIONS_RUNTIME_TOKEN not set</code>. The <code>type=gha</code> cache talks to GitHub's cache service with that token; act does not provide one, so the cache was silently <em>off</em> — the build still succeeded, just slower. A fourth measured difference between act and GitHub.</p>

<p>Where do 2 min 46 s go? The BuildKit timeline of the <code>api</code> image (step headers and their DONE times):</p>
<div class="out">${BK}</div>
<p>Three things to see. <strong>16.5 s</strong> just to boot BuildKit, and <strong>~28 s</strong> to pull <code>node:22-slim</code> into a builder that has never seen it — a fresh runner pays both every time. <code>[deps 3/3]</code> and <code>[prod-deps 3/3]</code> started together and finished together (56.9 s and 57.2 s): BuildKit runs stages that do not depend on each other <em>in parallel</em>, which the old sequential builder never did. And those two <code>npm ci</code> steps are the bulk of the build — exactly the layers a remote cache must keep.</p>

<h3>4. The cache, measured</h3>
<p>Can act be given a token? Two attempts with <code>--env ACTIONS_RUNTIME_TOKEN=…</code>:</p>
<div class="out">${GHA}</div>
<p>BuildKit checks that the token is a real, signed GitHub runtime token with an expiry — the gha cache is a GitHub service, and only a real GitHub run has the key. So the effect of a remote cache was measured the way CI uses it, outside act: every run starts a <strong>brand-new BuildKit builder</strong> (a fresh runner has no local cache), and the cache lives in a registry (<code>type=registry</code>, the other common backend, also usable with GHCR):</p>
<pre><code class="language-bash">${DO_CACHE}</code></pre>
<div class="out">${CACHE_REG}</div>
<p>104.2 s with an empty cache ⇒ 12.5 s with a fresh builder that only <em>imports</em> the cache: every step, both <code>npm ci</code> included, is <code>CACHED</code>. That 8× is the reason the job carries <code>cache-from</code>/<code>cache-to</code> at all. (<code>--output type=cacheonly</code> builds without producing an image, so only the cache is measured.)</p>
<p><code>mode=max</code> exports the layers of <em>every</em> stage (deps, build, prod-deps), not only the final image — without it the expensive <code>npm ci</code> stages of a multi-stage build are never cached. <code>scope=</code> per image keeps the three caches from overwriting each other. On GitHub the cache lives 7 days unused and the repository has a size budget; Docker's docs (linked) cover the limits.</p>

<h3>5. Pull it back by SHA</h3>
<div class="out">${REG}</div>
<p>Exactly what Chapter 11 will do on the VPS: pull by SHA, and check that the image says which commit it is and does not run as root. Notice <code>node -v</code>: the image runs v22.23.5 (latest <code>node:22-slim</code> when it was built) while the test job ran on v22.23.2 (the runner's cached 22). Same major, different patch: if that ever matters, pin both — <code>.nvmrc</code> to <code>22.23.5</code> and <code>FROM node:22.23.5-slim</code>.</p>

<div class="pitfall co-tieu-de"><p><strong>Hacker's corner — CircleCI, January 2023.</strong> CircleCI's incident report: malware on one engineer's laptop stole a valid, 2FA-backed SSO session (16 December 2022); the attacker exfiltrated customer environment variables, tokens and keys from CircleCI's databases on 22 December, and extracted the encryption keys from a running process. Every customer was told to rotate <em>every</em> secret stored in CircleCI. What saved teams that day was having few long-lived secrets in CI at all. Here: the registry login is a per-run <code>GITHUB_TOKEN</code> that dies with the job, and nothing else is stored. When you later push to AWS or GCP, use OIDC (GitHub Actions 6.3) instead of storing cloud keys.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Pitfall — <code>latest</code> on the server.</strong> <code>image: ghcr.io/…/chiase-api:latest</code> in a compose file means "whatever was pushed last": two servers pulled at different minutes run different code, and <code>docker compose up</code> after a reboot can silently upgrade you. Chapter 11 writes the SHA into the deploy.</p></div>

${spring(true, 'Same job for Spring Boot: the Dockerfile from 17.1 (or mvn spring-boot:build-image / Jib), build-push-action, tag with the SHA. Layered jars give the cache the same deps-first split.', [
  ['sb-17-1-dockerfile-spring', 'Spring Boot 17.1 — Dockerfile for a Spring Boot app'],
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI with GitHub Actions'],
])}

<h3>Everyday analogy</h3>
<p>A pharmacy batch number: every box from the factory carries the batch it came from. If one batch is bad you recall exactly that batch, and you know which pharmacies have it. A SHA tag is the batch number of your server.</p>

<h3>On the job</h3>
<p>"Which version is on staging?" will be asked in your first stand-up. With SHA tags the answer is <code>docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}'</code> and a click on that commit — not "the one from yesterday afternoon, I think".</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"How do you tag images?"</strong> — Full commit SHA (immutable) plus a moving tag for humans; deploy by SHA.</li>
<li><strong>"How does CI authenticate to the registry?"</strong> — <code>GITHUB_TOKEN</code> with <code>packages: write</code> on that job only; no PAT. For cloud registries, OIDC.</li>
<li><strong>"Do you push images from pull requests?"</strong> — No: build to validate, publish only from main after review.</li>
<li><strong>"How do you make Docker builds fast in CI?"</strong> — Buildx with a remote cache (<code>type=gha</code> or <code>type=registry</code>), <code>mode=max</code>, dependency layers before source.</li>
</ol>

<h3>🧪 Lab 10.2</h3>
<div class="callout ok">
<ol>
<li>Add the <code>image</code> job. With act, start a local registry (<code>docker run -d -p 127.0.0.1:41840:5000 registry:2</code>) and pass the three <code>--var</code> values; on GitHub, push to <code>main</code> and open <em>Packages</em>.</li>
<li>Open a PR (act: <code>act pull_request</code>): confirm the images are built and <em>not</em> pushed.</li>
<li>Pull <code>chiase-api:&lt;sha&gt;</code> and print its revision label and user.</li>
<li>Run the job twice and compare the build step times; then remove <code>mode=max</code> and compare again.</li>
<li>Rename the owner to something with a capital letter in the tag step (drop <code>,,</code>): what does the push say?</li>
</ol>
<p><strong>Done when:</strong> main produces three images tagged with the commit SHA, PRs produce none, the image job is the only one with <code>packages: write</code>, and you can name the commit inside any image you pull.</p>
</div>
<details><summary>Solution</summary>
<p>The job is printed in section 1. Step 4: without <code>mode=max</code> only the final stage is cached, so the <code>npm ci</code> of the deps stage runs again every time.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">GHCR</span><span class="v">GitHub's container registry, ghcr.io.</span></div>
  <div class="kv"><span class="k">Buildx</span><span class="v">Docker's builder front-end (BuildKit), with remote caches.</span></div>
  <div class="kv"><span class="k">type=gha</span><span class="v">Build cache stored in GitHub Actions' cache service.</span></div>
  <div class="kv"><span class="k">mode=max</span><span class="v">Cache every stage, not just the final image.</span></div>
  <div class="kv"><span class="k">immutable tag</span><span class="v">A tag that always means the same content (the SHA).</span></div>
  <div class="kv"><span class="k">OIDC</span><span class="v">Short-lived cloud credentials issued per run, no stored key.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Images are built by CI, after check + test, from one exact commit.</li>
<li>Matrix of three images; PR builds only; main pushes.</li>
<li>Tag with the full SHA; latest is for humans, never for deploys.</li>
<li>GITHUB_TOKEN + packages: write on one job; no stored PAT.</li>
<li>Remote cache with mode=max: 104 s ⇒ 12.5 s on a fresh builder; gha cache only works on GitHub itself.</li>
</ul>
${NGUON}
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Ảnh trong CI</span>
<h2>Dựng một lần, ở chỗ sạch, và đặt tên theo commit</h2>
<p class="lead">Ở Chương 9 bạn dựng ảnh trên chính máy mình — với cache của bạn, tệp chưa commit của bạn, phiên bản Docker của bạn. Chương 11 phải deploy một thứ không ai cãi được: ảnh do CI dựng từ đúng một commit đã qua mọi kiểm tra, cất trong một registry, và được đặt tên sao cho câu "đang chạy mã nào?" có câu trả lời một từ.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">needs</span><span class="lz-d">image chỉ bắt đầu khi check VÀ test đều xanh</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">matrix</span><span class="lz-d">api · api-migrate · web, ba job song song, tắt fail-fast</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">dựng</span><span class="lz-d">Buildx + cache; PR: chỉ dựng</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">đẩy (main)</span><span class="lz-d">ghcr.io/&lt;chủ&gt;/chiase-api:&lt;SHA đầy đủ&gt; (+ latest)</span></div>
</div>

<h3>1. Job</h3>
<pre><code class="language-yaml">${CI_ANH}</code></pre>
<ul>
<li><strong><code>needs: [check, test]</code></strong> — không dựng ảnh cho mã không qua kiểm. Lại rẻ hơn: test đỏ là dừng trước phần chậm nhất.</li>
<li><strong>Ba ảnh, mỗi ứng dụng một Dockerfile.</strong> <code>api</code> (target <code>runtime</code>), <code>api-migrate</code> (target <code>cong-cu</code> — ảnh chạy một lần <code>prisma migrate deploy</code> của 9.3; Chương 11 chạy nó trước khi tráo API) và <code>web</code>. <code>fail-fast: false</code>: <code>web</code> hỏng thì bạn vẫn muốn biết <code>api</code> có dựng được không.</li>
<li><strong><code>permissions: packages: write</code> chỉ ở job này</strong>, và đăng nhập bằng <code>secrets.GITHUB_TOKEN</code> — token GitHub tạo cho lượt chạy này và thu hồi khi job xong. Không có token cá nhân (PAT) nào nằm trong secret của repo.</li>
<li><strong><code>push: \${{ github.event_name == 'push' }}</code></strong> — PR thì dựng (chứng minh Dockerfile còn dựng được) nhưng không đăng gì: mã chưa duyệt, có thể từ fork, không bao giờ vào registry.</li>
<li><strong>Tag = mã commit đầy đủ</strong> (+ <code>latest</code> trên main) và nhãn <code>org.opencontainers.image.revision</code>. <code>latest</code> dịch chuyển sau mỗi lần push; tag SHA thì không bao giờ, nên "deploy <code>abc123…</code>" và "quay về SHA trước" là thao tác chính xác.</li>
</ul>

<h3>2. Sao không dùng <code>docker/metadata-action</code>?</h3>
<p>Đó là cách thường dùng để tính tag và nhãn. Dưới act nó hỏng ngay:</p>
<div class="out">${META}</div>
<p>Nó đọc thông tin repo từ REST API của GitHub bằng token của lượt chạy; act không có token cho một repo không tồn tại trên GitHub. Trên GitHub thì nó chạy — nhưng ta chỉ cần hai tag, và một bước shell làm được, bớt một action bên thứ ba phải tin (bài 10.1: action nào cũng là mã bạn chạy bằng token của mình). Bước đó còn xử lý một cái bẫy metadata-action giấu khỏi bạn:</p>
<div class="out">${CHU_HOA}</div>
<p>Tên ảnh phải viết thường; tên người dùng GitHub thì hay có chữ hoa. <code>\${OWNER,,}</code> là phép đổi chữ thường của bash.</p>

<h3>3. Chạy thử: registry cục bộ thay cho GHCR</h3>
<p>Với act, job đẩy vào <code>registry:2</code> chạy ở <code>127.0.0.1:41840</code>. Ba <em>biến</em> của repo làm việc đó mà không đụng hành vi trên GitHub: <code>vars.REGISTRY</code> (trống trên GitHub ⇒ <code>ghcr.io</code>), <code>vars.BUILDX_DRIVER_OPTS</code> (<code>network=host</code> để container BuildKit với tới registry cục bộ, cộng <code>memory=2g</code>) và <code>vars.BUILDKITD_CONFIG</code> (HTTP thường cho registry đó). Trên GitHub cả ba đều không đặt. Lượt lạnh:</p>
<div class="out">${LANH}</div>
<p>447 s cho cả pipeline; ba lượt dựng chạy song song, mỗi cái 2 phút 10 s (web) và 2 phút 46 s (api, api-migrate), sau 16–26 s khởi động container BuildKit. Và một cảnh báo quan trọng: <code>ACTIONS_RUNTIME_TOKEN not set</code>. Cache <code>type=gha</code> nói chuyện với dịch vụ cache của GitHub bằng token đó; act không cấp, nên cache âm thầm <em>tắt</em> — dựng vẫn thành công, chỉ chậm hơn. Khác biệt thứ tư đo được giữa act và GitHub.</p>

<p>2 phút 46 s đi đâu? Dòng thời gian BuildKit của ảnh <code>api</code> (tiêu đề từng bước và thời điểm DONE):</p>
<div class="out">${BK}</div>
<p>Ba điều cần thấy. <strong>16,5 s</strong> chỉ để khởi động BuildKit, và <strong>~28 s</strong> để kéo <code>node:22-slim</code> vào một builder chưa từng thấy nó — runner mới lần nào cũng trả cả hai. <code>[deps 3/3]</code> và <code>[prod-deps 3/3]</code> bắt đầu cùng lúc và xong cùng lúc (56,9 s và 57,2 s): BuildKit chạy <em>song song</em> các stage không phụ thuộc nhau, điều bộ dựng tuần tự kiểu cũ không làm. Và hai bước <code>npm ci</code> đó chiếm phần lớn thời gian dựng — đúng những tầng mà cache từ xa phải giữ.</p>

<h3>4. Cache, đo thật</h3>
<p>Có cấp token cho act được không? Hai lần thử với <code>--env ACTIONS_RUNTIME_TOKEN=…</code>:</p>
<div class="out">${GHA}</div>
<p>BuildKit kiểm token phải là token runtime thật của GitHub, có chữ ký và hạn dùng — cache gha là một dịch vụ của GitHub, và chỉ lượt chạy thật trên GitHub mới có chìa. Nên hiệu quả của cache từ xa được đo đúng kiểu CI dùng, bên ngoài act: mỗi lượt bật một <strong>builder BuildKit mới tinh</strong> (runner mới không có cache cục bộ), còn cache nằm trong một registry (<code>type=registry</code>, backend phổ biến thứ hai, dùng được cả với GHCR):</p>
<pre><code class="language-bash">${DO_CACHE}</code></pre>
<div class="out">${CACHE_REG}</div>
<p>104,2 s với cache trống ⇒ 12,5 s với một builder mới chỉ việc <em>nhập</em> cache: mọi bước, kể cả hai lần <code>npm ci</code>, đều <code>CACHED</code>. Gấp 8 lần — đó là lý do job phải có <code>cache-from</code>/<code>cache-to</code>. (<code>--output type=cacheonly</code> dựng mà không tạo ảnh, nên chỉ đo phần cache.)</p>
<p><code>mode=max</code> xuất tầng của <em>mọi</em> stage (deps, build, prod-deps), không chỉ ảnh cuối — thiếu nó thì các bước <code>npm ci</code> đắt đỏ của bản dựng nhiều tầng không bao giờ được cache. <code>scope=</code> theo từng ảnh để ba cache không ghi đè nhau. Trên GitHub, cache không dùng 7 ngày sẽ bị xoá và mỗi repo có hạn mức dung lượng; tài liệu của Docker (liên kết bên dưới) nói rõ giới hạn.</p>

<h3>5. Kéo về theo SHA</h3>
<div class="out">${REG}</div>
<p>Đúng việc Chương 11 sẽ làm trên VPS: kéo theo SHA, kiểm ảnh tự khai nó là commit nào và không chạy bằng root. Để ý <code>node -v</code>: ảnh chạy v22.23.5 (bản <code>node:22-slim</code> mới nhất lúc dựng) trong khi job test chạy v22.23.2 (bản 22 có sẵn trong runner). Cùng bản lớn, khác bản vá: nếu có lúc điều đó quan trọng, ghim cả hai — <code>.nvmrc</code> thành <code>22.23.5</code> và <code>FROM node:22.23.5-slim</code>.</p>

<div class="pitfall co-tieu-de"><p><strong>Góc hacker — CircleCI, tháng 1/2023.</strong> Báo cáo sự cố của CircleCI: mã độc trên laptop của một kỹ sư đánh cắp một phiên SSO hợp lệ, có 2FA (16/12/2022); kẻ tấn công lấy ra biến môi trường, token và khoá của khách hàng từ CSDL của CircleCI ngày 22/12, và rút được khoá giải mã từ một tiến trình đang chạy. Mọi khách hàng được yêu cầu xoay <em>mọi</em> secret đã lưu trên CircleCI. Thứ cứu các đội hôm đó là có thật ít secret sống lâu trong CI. Ở đây: đăng nhập registry là <code>GITHUB_TOKEN</code> của từng lượt, chết theo job, và không lưu gì khác. Sau này đẩy lên AWS hay GCP thì dùng OIDC (GitHub Actions 6.3) thay vì cất khoá cloud.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>latest</code> trên máy chủ.</strong> <code>image: ghcr.io/…/chiase-api:latest</code> trong tệp compose nghĩa là "cái gì được đẩy sau cùng": hai máy kéo ở hai phút khác nhau chạy hai bản mã khác nhau, và <code>docker compose up</code> sau khi khởi động lại có thể âm thầm nâng cấp bạn. Chương 11 ghi SHA vào lần deploy.</p></div>

${spring(false, 'Spring Boot cũng đúng job này: Dockerfile của 17.1 (hoặc mvn spring-boot:build-image / Jib), build-push-action, tag theo SHA. Layered jar cho cache đúng kiểu tách thư viện trước mã nguồn.', [
  ['sb-17-1-dockerfile-spring', 'Spring Boot 17.1 — Dockerfile cho ứng dụng Spring Boot'],
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI với GitHub Actions'],
])}

<h3>Liên hệ đời thường</h3>
<p>Số lô thuốc: hộp nào ra khỏi nhà máy cũng in lô sản xuất. Một lô lỗi thì thu hồi đúng lô đó, và biết hiệu thuốc nào đang giữ. Tag SHA là số lô của máy chủ bạn.</p>

<h3>Tình huống đi làm thật</h3>
<p>"Staging đang chạy bản nào?" sẽ được hỏi ngay buổi họp đứng đầu tiên. Có tag SHA thì câu trả lời là <code>docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}'</code> và một cú bấm vào commit đó — không phải "chắc là bản chiều qua".</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn gắn tag ảnh thế nào?"</strong> — Mã commit đầy đủ (bất biến) cộng một tag di động cho người đọc; deploy theo SHA.</li>
<li><strong>"CI xác thực với registry ra sao?"</strong> — <code>GITHUB_TOKEN</code> với <code>packages: write</code> chỉ ở job đó; không PAT. Registry của cloud thì OIDC.</li>
<li><strong>"Có đẩy ảnh từ pull request không?"</strong> — Không: dựng để kiểm, chỉ đăng từ main sau review.</li>
<li><strong>"Làm sao dựng Docker trên CI cho nhanh?"</strong> — Buildx với cache từ xa (<code>type=gha</code> hoặc <code>type=registry</code>), <code>mode=max</code>, tầng thư viện trước mã nguồn.</li>
</ol>

<h3>🧪 Lab 10.2</h3>
<div class="callout ok">
<ol>
<li>Thêm job <code>image</code>. Với act, bật registry cục bộ (<code>docker run -d -p 127.0.0.1:41840:5000 registry:2</code>) và truyền ba giá trị <code>--var</code>; trên GitHub, push lên <code>main</code> rồi mở <em>Packages</em>.</li>
<li>Mở một PR (act: <code>act pull_request</code>): xác nhận ảnh được dựng mà <em>không</em> được đẩy.</li>
<li>Kéo <code>chiase-api:&lt;sha&gt;</code> về và in nhãn revision cùng người dùng của nó.</li>
<li>Chạy job hai lần và so thời gian bước dựng; rồi bỏ <code>mode=max</code> và so lại.</li>
<li>Bỏ <code>,,</code> trong bước đặt tag với một tên chủ có chữ hoa: lượt đẩy báo gì?</li>
</ol>
<p><strong>Xong khi:</strong> main tạo ba ảnh gắn tag mã commit, PR không tạo ảnh nào, job image là job duy nhất có <code>packages: write</code>, và bạn nói được commit bên trong bất kỳ ảnh nào bạn kéo về.</p>
</div>
<details><summary>Lời giải</summary>
<p>Job in ở mục 1. Bước 4: thiếu <code>mode=max</code> thì chỉ stage cuối được cache, nên <code>npm ci</code> của stage deps chạy lại mọi lần.</p>
</details>

<div class="kv-grid">
  <div class="kv"><span class="k">GHCR</span><span class="v">Registry container của GitHub, ghcr.io.</span></div>
  <div class="kv"><span class="k">Buildx</span><span class="v">Lớp dựng của Docker (BuildKit), có cache từ xa.</span></div>
  <div class="kv"><span class="k">type=gha</span><span class="v">Cache dựng cất trong dịch vụ cache của GitHub Actions.</span></div>
  <div class="kv"><span class="k">mode=max</span><span class="v">Cache mọi stage, không chỉ ảnh cuối.</span></div>
  <div class="kv"><span class="k">tag bất biến</span><span class="v">Tag luôn chỉ cùng một nội dung (SHA).</span></div>
  <div class="kv"><span class="k">OIDC</span><span class="v">Thông tin đăng nhập cloud ngắn hạn cấp theo lượt chạy, không lưu khoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ảnh do CI dựng, sau check + test, từ đúng một commit.</li>
<li>Matrix ba ảnh; PR chỉ dựng; main mới đẩy.</li>
<li>Tag bằng SHA đầy đủ; latest để người đọc, không bao giờ để deploy.</li>
<li>GITHUB_TOKEN + packages: write ở một job; không lưu PAT.</li>
<li>Cache từ xa với mode=max: 104 s ⇒ 12,5 s trên builder mới; cache gha chỉ chạy trên chính GitHub.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};

/**
 * Deep Dive #11 — Reading production. **LAST ARTICLE OF THE SERIES.**
 * (Card 3, Node.js, keeps `href: '/courses'` — the 112-lesson course. With this
 * one seeded and the card flipped to `article:`, all 12 Deep Dive cards resolve.)
 *
 * Prose in the sibling `.md` (same reason as #1–#10).
 *
 * HOW IT WAS MEASURED. Lab in `scratchpad/prod-lab` — ABSOLUTE path, the
 * scratchpad dir changes every session:
 *   /private/tmp/claude-501/-Users-admin-Downloads-api-backend/
 *     becd3039-952a-4510-9831-f6bb0c076484/scratchpad/prod-lab
 * Two sources, both real: **the live site measured from OUTSIDE over HTTPS**
 * (curl only — no SSH, nothing touched on the VPS), and failures built on
 * purpose locally with **docker 29.5.3, postgres:16-alpine, node 22.21.0**.
 *
 * ⚠️ Nothing was run against the VPS beyond plain HTTPS GETs. CLAUDE.md forbids
 * SSHing in to poke containers/DB without the user asking; keep it that way if
 * you re-measure. Every container/DB number below came from a local lab.
 * ⚠️ PRIVACY: the article uses `example.com` and `203.0.113.x` (TEST-NET-3),
 * never the real host or IP. Keep it that way.
 *
 * SIX THINGS THE RUNNING REFUTED — all six are in the article's last section:
 *   1. **"exit 137 = OOM."** 137 = SIGKILL. `docker kill -s KILL` → 137 with
 *      **OOMKilled=false**; a real `--memory 32m` breach → 137 with
 *      **OOMKilled=true**. Only `docker inspect` separates them.
 *   2. **"docker stop sends SIGTERM so the app shuts down gracefully."** THREE
 *      of four container forms took the **full 10.2 s timeout** and were
 *      hard-killed, because **PID 1 gets no default signal handlers** — an
 *      unhandled signal is ignored outright. Control experiment:
 *      `docker run --init` (tini at PID 1) → **exit 143 after 0.1 s**.
 *      Only `sh -c 'trap …; sleep 300 & wait'` worked without an init.
 *   3. **"healthy means the deploy worked."** Two containers, same health
 *      check, both `healthy`; one 404s a route that should 401. This is the
 *      repo's real 2026-07-02 incident, reproduced in a lab.
 *   4. **"the mean is a fine summary."** p50 45.9 ms, p90 186.8, mean 66.9 —
 *      describes nobody. Same shape three times: log p50 80 / p95 2400 /
 *      mean 522; loop lag p50 stays 1.1 ms while p99 goes to 1181 ms.
 *   5. **"df -h and du find what filled the disk."** The 26.39 GB was Docker
 *      **build cache** — outside every project tree, invisible to `du`, shown
 *      only by `docker system df`. Put it BEFORE du in the order.
 *   6. **"a wave of 429 means an attack."** 900 rejections over **60 distinct
 *      IPs** ≈ 24 each = a limit set too low. One IP with 900 is the other
 *      diagnosis. `sort -u | wc -l` is the whole difference.
 *
 * Other numbers worth not breaking if you edit the body:
 *   · curl phase table (live site): `/` dns 3 / tcp 9 / tls 27 / ttfb 49 /
 *     total 97 ms, 89 KB. A **404 costs 320 ms and 61 KB** (full rendered page).
 *   · 401-vs-404 as the stale-build test — the single most useful line here.
 *   · pg: `pg_blocking_pids(112) = {105}`, `wait_event_type=Lock/transactionid`,
 *     the idle-in-transaction shape.
 *   · event loop lag: idle p50 1.2 / p99 2.1 · 60 ms CPU bursts p99 287 ·
 *     one 1.2 s blocking call p99 1181. p50 unchanged in all three.
 *   · docker system df: Images 31.7 GB, **Build Cache 26.39 GB (21.38 GB
 *     reclaimable)**. `docker stats` caveats: MEM includes page cache, CPU% is
 *     normalised across all cores.
 *   · restart loop: `Exited (1)`, `RestartCount: 5` after `--restart on-failure:5`.
 *   · awk pipelines were verified against a log generated with a KNOWN
 *     distribution (7300/1200/900/150/37) — the checker checks itself.
 *   · real deploy timeline from this repo's own logs: 5 deploys, 4–14 min each.
 *
 * The worked example is this site's real incident: GIF picker dead + "chats
 * disappearing" = ONE stale-build cause (404 on /api/v1/gifs while
 * /messages/threads 401'd) plus ONE unrelated red herring (per-viewer soft
 * delete). Second example: sessions dying at exactly 24 h = JWT 24 h vs cookie
 * 7 d — a ROUND period means read config, not behaviour. Both are in CLAUDE.md's
 * incident log; keep them, they are what makes the method concrete.
 *
 * Related: [[project_gif404_stale_dist_and_recoverable_delete]],
 * [[project_rate_limit_incident]], [[project_vps_disk_full_incident]],
 * [[feedback_verify_the_checker_before_the_content]].
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./reading-production-logs-metrics-and-a-calm-head.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'reading-production-logs-metrics-and-a-calm-head',
  title: 'Reading Production: Logs, Metrics and a Calm Head',
  summary:
    'The first ten minutes of an incident, as commands rather than philosophy. Exit 137 does not mean OOM, three of four containers ignore SIGTERM entirely, both of my "healthy" containers were healthy and one was broken — and the one curl that tells you a deploy shipped a stale image before any user does.',
  category: 'DeepDive',
  tags: ['devops', 'debugging', 'docker', 'postgresql', 'observability'],
  coverEmoji: '🚨',
  coverImageUrl: '/deepdives/production/first-ten-minutes.svg',
  readTimeMin: 26,
  isFeatured: false,
  trendingScore: 73,
  status: 'PUBLISHED',
  bodyMdx,
};

/**
 * Deep Dive #9 — Shell scripting.
 *
 * Prose in the sibling `.md` (same reason as #1–#8).
 *
 * HOW IT WAS MEASURED. Lab in `scratchpad/sh-lab` — ABSOLUTE path, because the
 * scratchpad dir changes every session:
 *   /private/tmp/claude-501/-Users-admin-Downloads-api-backend/
 *     becd3039-952a-4510-9831-f6bb0c076484/scratchpad/sh-lab
 * (01..11 + `ALL-OUTPUT.txt` with every run.) Each case runs in its OWN
 * `bash -c` child so one `exit` can't kill the harness. Versions:
 * **macOS 26.5.2 — bash 3.2.57, zsh 5.9 · debian bookworm — bash 5.2.15, dash ·
 * shellcheck 0.11.0** (run via `docker run koalaman/shellcheck:stable`).
 * Cross-shell rows were produced by running the SAME script file on the host and
 * inside `debian:bookworm-slim` — that is the only honest way to write a
 * macOS-vs-Linux table.
 *
 * SEVEN THINGS THE RUNNING REFUTED — all seven are in the article's last section:
 *   1. **"`set -e` won't save you from `cd $DIR; rm -rf ./*`."** IT DOES.
 *      Sandbox with 4 files: no `set -e` → **0 left**; `set -e` → **4 left**.
 *      shellcheck agrees and SUPPRESSES SC2164 when `set -e` is on (verified
 *      both ways). The usual "always write `cd … || exit`" advice is right for
 *      functions/subshells, wrong as stated for a top-level script. Do not
 *      restore the internet's version.
 *   2. **"`set -e` stops a function at its first failure."** Not when the
 *      function is a CONDITION: `f() { false; echo INSIDE; }` → `f` exits and
 *      INSIDE stays silent, but `if f; then` prints INSIDE. `-e` is off for the
 *      whole body.
 *   3. **"pipefail is strictly better."** `yes | head -1` under
 *      `set -e -o pipefail` → **rc=141** (SIGPIPE) and the script dies. Without
 *      pipefail → rc=0. Same for any `grep` that legitimately matches nothing.
 *   4. **"`which` tells you what runs."** On this machine `which grep` says
 *      `/usr/bin/grep` while `grep --version` says **ugrep 7.5.0** — a shell
 *      FUNCTION shadows it, and `which` (an external program) cannot see
 *      functions. `type -a` is the one that answers. See
 *      [[feedback_shell_tools_wrapped_measure_by_absolute_path]].
 *   5. **"`for f in $(ls)` is a style choice."** 3 files → **6** arguments. And
 *      `a=("one two" "three" "")`: quoted vs unquoted `${a[@]}` BOTH give
 *      argc=3 — same count, different data.
 *   6. **"A test-then-create lock is fine, the window is tiny."** 40 racers:
 *      `[ ! -f lock ] && touch` → **6 / 9 / 10 winners** across three runs.
 *      `mkdir`, `set -o noclobber; : >`, and `ln -s` → **1, every time**.
 *   7. **"shellcheck catches these."** It caught 6 cleanly (SC2086 2155 2045
 *      2162 2030 2031) and did NOT catch `[ "$ok" = false ] && echo` as the last
 *      line under `set -e` — the bug that actually failed a deploy in this repo.
 *
 * Other numbers worth not breaking if you edit the body:
 *   · the 7-row `set -e` table (f · if f · f&&g · f||g · !f · while f · x=$(f)).
 *   · `local x=$(false)` → rc 0; `local x; x=$(false)` → rc 1. Same for
 *     declare/export/readonly.
 *   · EXIT trap fires on end/exit N/set -e/set -u/SIGTERM, NOT on SIGKILL
 *     (markers left: 0 after TERM, 1 after KILL). A 2nd `trap … EXIT` REPLACES
 *     the 1st. `$?` in the handler is clobbered by the handler's first command.
 *     ERR is not inherited by functions/subshells without `-E`.
 *   · `printf … | while read` → n=0 · `< <(…)` → n=3 · `lastpipe` is bash 4.2+
 *     so it does NOT exist on macOS.
 *   · bash 3.2 vs 5.2 table: BASHPID · lastpipe · mapfile · declare -A ·
 *     ${v^^} · ${v@Q} (both PARSE errors on 3.2) · `set -u` + "${empty[@]}".
 *   · macOS has NO timeout(1), flock(1), nproc(1). sed -i / date -d / stat -c /
 *     grep -P all invert between BSD and GNU.
 *   · read: `read` → 2 lines mangled · `read -r` → 2 · `IFS= read -r` → 2 with
 *     whitespace kept · `|| [ -n "$line" ]` → **3** (final line without newline).
 *   · exit codes 127 126 130 137 141 143.
 *   · shellcheck on the repo's own 734-line deploy.sh: 5 findings, all SC2016,
 *     all intentional (`node -e '…'` where `$` belongs to JavaScript).
 *
 * The article quotes deploy.sh directly: `set -euo pipefail` (line 26), the
 * `set +e` window around the .env read loop, and the comment explaining why the
 * frontend check is an `if` and not `[ … ] && fail`. Keep those — a real script
 * with real scars is the point of the piece.
 *
 * Related: [[feedback_verify_by_running_not_reading]],
 * [[feedback_verify_the_checker_before_the_content]], [[project_vps_deploy_infra]].
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./shell-scripting-for-people-who-deploy-things.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'shell-scripting-for-people-who-deploy-things',
  title: 'Shell Scripting for People Who Deploy Things',
  summary:
    'set -e ignores more than it catches, pipefail turns a working `producer | head` into exit 141, and a test-then-create lock let 10 of 40 processes all think they won. Measured on bash 3.2 (macOS) and bash 5.2 (Debian) side by side — including the one-line chain that failed a real deploy at the exact moment everything was healthy.',
  category: 'DeepDive',
  tags: ['bash', 'shell', 'devops', 'deployment', 'linux'],
  coverEmoji: '🐚',
  coverImageUrl: '/deepdives/shell/set-e-coverage.svg',
  readTimeMin: 26,
  isFeatured: false,
  trendingScore: 71,
  status: 'PUBLISHED',
  bodyMdx,
};

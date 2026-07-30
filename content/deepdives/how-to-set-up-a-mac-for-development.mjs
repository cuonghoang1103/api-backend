/**
 * Deep Dive #10 — Setting up a Mac for development.
 *
 * Prose in the sibling `.md` (same reason as #1–#9).
 *
 * HOW IT WAS MEASURED. Lab in `scratchpad/mac-lab` — ABSOLUTE path, the
 * scratchpad dir changes every session:
 *   /private/tmp/claude-501/-Users-admin-Downloads-api-backend/
 *     becd3039-952a-4510-9831-f6bb0c076484/scratchpad/mac-lab
 * (01-path, 02-fs, 03-git-case, 04-ssh + `ALL-OUTPUT.txt`.) Everything was
 * measured on THIS machine: **macOS 26.5.2 build 25F84, Apple M1 Max, arm64,
 * zsh 5.9, bash 3.2.57, Homebrew 6.0.12 (109 formulae / 26 leaves), Xcode CLT
 * 26.6.0, OpenSSH 10.2p1, git 2.51.1 brew / 2.50.1 Apple.**
 *
 * ⚠️ READ-ONLY on the user's machine. Nothing was installed, no `defaults
 * write`, no edit to ~/.zshrc or ~/.ssh. The zsh profile was taken through a
 * COPY of the rc file under a temp `ZDOTDIR`; SSH keys were generated in a
 * `mktemp -d`. Keep it that way if you re-measure.
 * ⚠️ PRIVACY: no hostname, no key fingerprint, no VPS IP in the body. The
 * `ssh-add` output leaks `user@hostname` — do not paste it verbatim.
 *
 * SEVEN THINGS THE RUNNING REFUTED — all seven are in the article's last section:
 *   1. **"compinit is cheap."** Isolated: **0.02 s**. Inside the real config:
 *      **206 ms per call**, twice. The isolated run had a nearly-empty `fpath`.
 *      A component benchmark measured something else entirely — this is the
 *      headline lesson of the piece.
 *   2. **"Raise ulimit -n, macOS defaults to 256."** Obsolete: soft limit is
 *      **1048576** on macOS 26, hard unlimited, kern.maxfiles 245760. The
 *      plist ritual in every old setup guide fixes a problem that is gone.
 *   3. **"macOS rewrites filenames to NFD."** That was HFS+. On APFS, writing
 *      `Đề.txt` as NFC then NFD gives **ONE** file, stored NFC, samefile True.
 *   4. **"A case-only `git mv` needs a temp name."** Works directly on git
 *      2.51. What genuinely can't be fixed locally: a repo containing both
 *      `case.txt` and `CASE.txt` → 3 tracked, 2 on disk, `M CASE.txt` forever.
 *   5. **"ssh refuses a badly-permissioned key."** `ssh-add`/`ssh-keygen -y`
 *      do (WARNING: UNPROTECTED PRIVATE KEY FILE). `ssh -i` against a server
 *      that rejects the PUBLIC half never reads the private one, so no warning
 *      at 0644 or even 0666 — you get a bare "Permission denied".
 *   6. **"`which` tells you what runs."** `which grep` → /usr/bin/grep while
 *      `grep --version` → **ugrep 7.5.0** (a shell function shadows it).
 *      See [[feedback_shell_tools_wrapped_measure_by_absolute_path]].
 *   7. **My own mistake, kept in the article on purpose:** counting `.d.ts` I
 *      got "frontend node_modules: 0" — impossible for a Next.js app. The
 *      shell had kept a `cd frontend` from an earlier call, so the relative
 *      path resolved to `frontend/frontend/node_modules`. An implausible ZERO
 *      caught it; a plausible wrong number would have shipped. Print `pwd`.
 *
 * Other numbers worth not breaking if you edit the body:
 *   · shell startup 1.06 s → **0.12 s** with lazy nvm (~9×). zprof: nvm 697 ms,
 *     compinit ×2 413 ms, 1603 compdef calls. nvm.sh is **4,661 lines**.
 *   · Apple's userland: bash 3.2.57 (2007) · make 3.81 (2006) · python3 3.9.6 ·
 *     ruby 2.6.10 · /usr/bin/openssl is **LibreSSL 3.3.6** and rejects
 *     `--version`. GPLv2 is why bash/make stopped where they did.
 *   · PATH has 17 entries; brew at 3, /usr/bin at 7. `make` and `curl` fall
 *     through to Apple's because nothing shadows them (brew's make is `gmake`).
 *   · rg vs grep on this repo: **0.08 s over 4,024 files** vs **120 s over
 *     149,068**. That is .gitignore, not the matching engine.
 *   · disk: Docker VM 35 GB · brew 7.1 GB · Xcode 4.6 · DerivedData 2.0 ·
 *     Playwright 1.6 · nvm 1.1 ⇒ **≈51 GB** before project code.
 *     node_modules: 36,655 + 81,161 = 117,816 files / 2.1 GB.
 *   · ed25519 387 B / 0.03 s vs rsa4096 3,369 B / 1.49 s.
 *   · tsc --noEmit: backend 13.5 s (246 files) vs frontend 6.3 s (863 files) —
 *     backwards, because `.prisma/client/index.d.ts` is **22,073,496 bytes** →
 *     368k types, 1.5M instantiations, Check time 9.45 s of 11.84 s.
 *   · python: brew's python3 refuses pip with `externally-managed-environment`
 *     (PEP 668); system python's pip lives INSIDE Xcode.app. venv 1.69 s/12 MB.
 *   · brew: 109 formulae but only **26 leaves**; 48 outdated.
 *   · git `credential.helper=osxkeychain` comes from brew's SYSTEM gitconfig,
 *     so `--global` shows nothing — `git config --list --show-origin`.
 *
 * The "what this guide deliberately doesn't tell you" section refuses to
 * recommend a terminal/editor/prompt because there is nothing to measure there.
 * Keep it — it is the same honesty as the GraphQL and Vue "when not to use it".
 *
 * Related: [[feedback_verify_by_running_not_reading]],
 * [[feedback_verify_the_checker_before_the_content]].
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./how-to-set-up-a-mac-for-development.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'how-to-set-up-a-mac-for-development',
  title: 'How to Set up a Mac for Development',
  summary:
    'Measured on one machine instead of listed from memory: the terminal that took 1.06 s to open and why (and how it got to 0.12 s), the /usr/bin/openssl that is not OpenSSL, the repository that can never be clean, and the search that went from 120 seconds to 0.08. With four pieces of Mac folklore that expired and nobody stamped a date on.',
  category: 'DeepDive',
  tags: ['macos', 'setup', 'zsh', 'homebrew', 'developer-environment'],
  coverEmoji: '🖥️',
  coverImageUrl: '/deepdives/mac/shell-startup.svg',
  readTimeMin: 25,
  isFeatured: false,
  trendingScore: 72,
  status: 'PUBLISHED',
  bodyMdx,
};

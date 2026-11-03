#!/bin/bash
# chay: tay — Bài 10.3: quy trình Git hai người (An, Bình) với một "origin" trần trong thư mục tạm: nhánh tính năng,
# commit nhỏ, push, "pull request" (log/diff giữa nhánh), merge, push bị từ chối, xung đột và gỡ xung đột.
# Ngày cố định ⇒ SHA cố định. Ghi ../out/git-*.out.txt.
set -u
cd "$(dirname "$0")"
OUT="$(pwd)/../out"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
n=0
tick() { n=$((n+1)); local d; d=$(printf '2026-11-10T%02d:00:00+07:00' $((8+n))); export GIT_AUTHOR_DATE="$d" GIT_COMMITTER_DATE="$d"; }
as() { export GIT_AUTHOR_NAME="$1" GIT_AUTHOR_EMAIL="$2" GIT_COMMITTER_NAME="$1" GIT_COMMITTER_EMAIL="$2"; }
an() { as An an@example.com; cd "$T/an"; }
binh() { as Binh binh@example.com; cd "$T/binh"; }
say() { local o='$' a; for a in "$@"; do if [[ "$a" == *[\ \'\(\)#]* ]]; then o+=" \"$a\""; else o+=" $a"; fi; done; echo "$o"; }
x() { say "$@"; "$@" 2>&1 | sed "s#$T/##g"; }        # run + print, hide the temp path
cfg() { git config pull.rebase false; git config advice.detachedHead false; git config core.editor true; }

# ── setup: an origin with a small notes app, cloned by An and Binh ──
mkdir "$T/seed" && cd "$T/seed" && as An an@example.com && git init -qb main
cat > notes.js <<'JS'
const notes = ['Buy milk', 'Learn Git', 'Call Lan'];

function list() {
  return notes.join('\n');
}

console.log(list());
JS
echo '# Notes' > README.md
git add -A && tick && git commit -qm "Initial notes app"
git clone -q --bare "$T/seed" "$T/origin.git"
git clone -q "$T/origin.git" "$T/an" && (cd "$T/an" && cfg)
git clone -q "$T/origin.git" "$T/binh" && (cd "$T/binh" && cfg)

{
an
x git switch -c feature/search
cat >> notes.js <<'JS'

function search(term) {
  return notes.filter((n) => n.toLowerCase().includes(term.toLowerCase()));
}
JS
tick; git add notes.js; x git commit -m "Add search(term) to notes"
cat >> notes.js <<'JS'
console.log(search('git'));
JS
tick; git add notes.js; x git commit -m "Print search results for 'git'"
x git push -u origin feature/search
echo
echo "# the pull request: what would be merged, and how big it is"
x git log --oneline main..feature/search
x git diff --stat main...feature/search
} > "$OUT/git-branch.out.txt"

{
binh
x git switch -c feature/sort
sed -i '' 's/  return notes.join/  return [...notes].sort().join/' notes.js
tick; git add notes.js; x git commit -m "Sort notes alphabetically"
x git push -u origin feature/sort
an
echo "# the search PR is reviewed and merged into main (as the Merge button would do)"
x git switch main
tick; x git merge --no-ff feature/search -m "Merge pull request #1 from feature/search"
x git push origin main
binh
echo
echo "# Binh tries to push straight to main, which moved"
git switch -q main
sed -i '' "s/'Call Lan'/'Call Lan', 'Pay rent'/" notes.js
tick; git add notes.js; git commit -qm "Add a note"
x git push origin main
} > "$OUT/git-rejected.out.txt"

{
binh
git reset -q --hard origin/main~0 2>/dev/null; git fetch -q; git reset -q --hard origin/main   # undo the direct commit on main
git switch -q feature/sort
echo "# Binh's branch is behind main: bring main in before asking for review"
x git fetch origin
x git merge origin/main
x git status --short
say cat notes.js
cat notes.js
} > "$OUT/git-merge-main.out.txt"

{
binh
echo "# no conflict this time: the two changes touched different lines — Git combined them"
x git log --oneline --graph --all
} > "$OUT/git-graph-noconflict.out.txt"

# ── a real conflict: both change the SAME line ──
{
an
git switch -q main && git pull -q origin main
x git switch -c fix/notes-format
sed -i '' "s/  return notes.join('\\\\n');/  return notes.map((n, i) => (i + 1) + '. ' + n).join('\\\\n');/" notes.js
tick; git add notes.js; x git commit -m "Number the notes"
git switch -q main; tick; git merge -q --no-ff fix/notes-format -m "Merge pull request #2 from fix/notes-format"; git push -q origin main 2>/dev/null
binh
git push -q origin feature/sort 2>/dev/null
echo "# meanwhile main changed the same line Binh changed"
x git fetch origin
x git merge origin/main
x git status --short
say cat notes.js
cat notes.js
} > "$OUT/git-conflict-real.out.txt"

{
binh
echo "# resolve: keep BOTH ideas — sorted AND numbered — then remove the markers"
cat > notes.js <<'JS'
const notes = ['Buy milk', 'Learn Git', 'Call Lan'];

function list() {
  return [...notes].sort().map((n, i) => (i + 1) + '. ' + n).join('\n');
}

console.log(list());

function search(term) {
  return notes.filter((n) => n.toLowerCase().includes(term.toLowerCase()));
}
console.log(search('git'));
JS
x node notes.js
x git add notes.js
tick; x git commit --no-edit
x git push origin feature/sort
an
git fetch -q; git switch -q main; git pull -q origin main
tick; git merge -q --no-ff origin/feature/sort -m "Merge pull request #3 from feature/sort"; git push -q origin main 2>/dev/null
x git log --oneline --graph
} > "$OUT/git-resolved.out.txt"

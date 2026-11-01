#!/usr/bin/env bash
# Lesson 1.4 — GitHub without GitHub: a bare repository on disk plays the role of github.com,
# two clones play "you" (An) and a teammate (Binh). Every command and its real output is printed.
#   bash sim.sh <empty-work-dir>
set -u
W="$1"; mkdir -p "$W"; cd "$W"
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1      # ignore this machine's own git settings
export GIT_AUTHOR_DATE='2026-11-01T09:00:00+07:00' GIT_COMMITTER_DATE='2026-11-01T09:00:00+07:00'
as() { export GIT_AUTHOR_NAME="$1" GIT_AUTHOR_EMAIL="$2" GIT_COMMITTER_NAME="$1" GIT_COMMITTER_EMAIL="$2"; }
run() {                                                       # print the command (quoting args with spaces), run it
  local line='$'; for a in "$@"; do [[ "$a" == *" "* ]] && line+=" \"$a\"" || line+=" $a"; done
  echo "$line"; "$@" 2>&1; echo
}
step() { echo "### $*"; }
REMOTE="$W/github.com/an/ct-shop.git"
show() { tr '\r' '\n' | sed "s#$W/##g"; }                     # relative paths; progress lines on their own line

{
step "1. 'Create repository' on the host = an empty bare repository"
run git init --bare -q --initial-branch=main github.com/an/ct-shop.git
run ls github.com/an/ct-shop.git

step "2. An: a local project with one commit, then connect it to the remote"
as An an@example.com
mkdir an && cd an
git init -q --initial-branch=main
printf '# CT Shop\n\nA tiny shop page built during Web Foundations.\n' > README.md
printf 'node_modules/\ndist/\n.env\n' > .gitignore
git add . && git commit -q -m "Initial commit: README and .gitignore"
echo 'DATABASE_URL=postgres://an:demo-password@localhost/shop' > .env
run git status --short --ignored
run git check-ignore -v .env
run git remote add origin "$REMOTE"
run git remote -v
run git push -u origin main
run git status -sb

step "3. Committed is not pushed"
echo '<h1>CT Shop</h1>' > index.html
git add index.html && git commit -q -m "Add home page"
run git status -sb
run git push
run git status -sb
cd ..

step "4. Binh clones the project"
as Binh binh@example.com
run git clone "$REMOTE" binh
cd binh
run git log --oneline
echo '<p>Free shipping over 500k</p>' >> index.html
git commit -q -am "Add shipping note"
run git push
cd ..

step "5. An, meanwhile, commits without pulling first — push is rejected"
as An an@example.com
cd an
printf '\n## Run it\n\nOpen index.html in a browser.\n' >> README.md
git commit -q -am "Document how to run"
run git push
run git pull --rebase
run git log --oneline --graph
run git push

step "6. A pull request is a branch on the remote, waiting to be merged"
run git switch -c feature/cart
echo '<button>Add to cart</button>' >> index.html
git commit -q -am "Add cart button"
run git push -u origin feature/cart
run git branch -a
run git ls-remote --heads origin

step "7. Merging the pull request = a merge commit on main, pushed by the host"
run git switch main
run git merge --no-ff feature/cart -m "Merge pull request #1 from an/feature/cart"
run git push
run git log --oneline --graph
} 2>&1 | show

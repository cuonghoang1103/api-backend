#!/bin/bash
# demo1/git/make-leak.sh — lesson 1.5: commit a secret by mistake, then "remove" it the way most people do.
# Usage: bash demo1/git/make-leak.sh <dir> <fake-key> <fake-session>
set -e
mkdir -p "$1" && cd "$1"
git init -q
git config user.name An && git config user.email an@student.labflow.example
printf 'PORT=4800\nLFID_SIGNING_KEY=%s\n' "$2" > .env
mkdir -p test/fixtures && printf '{ "user": "usr_1", "sid": "%s" }\n' "$3" > test/fixtures/session.json
git add .env test && git commit -qm 'add config and a test fixture'
echo .env > .gitignore
git rm -q --cached .env            # "remove" it …
git add .gitignore && git commit -qm 'remove .env, add .gitignore'
echo '--- files git tracks now:'; git ls-files
echo '--- history:'; git log --oneline

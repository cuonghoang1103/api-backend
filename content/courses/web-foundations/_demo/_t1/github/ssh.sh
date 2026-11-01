#!/usr/bin/env bash
# Lesson 1.4 — what creating an SSH key looks like. The key is generated in a throw-away
# folder and deleted afterwards; never paste a PRIVATE key anywhere.
#   bash ssh.sh <empty-work-dir>
set -u
W="$1"; mkdir -p "$W"; cd "$W"
echo '$ ssh-keygen -t ed25519 -C "an@example.com" -f ./id_ed25519 -N ""'
ssh-keygen -t ed25519 -C "an@example.com" -f ./id_ed25519 -N "" 2>&1 | sed "s#$W/##g"
echo
echo '$ ls -l id_ed25519*'
ls -l id_ed25519* | awk '{sub(/@$/, "", $1); print $1, $5, $NF}'
echo
echo '$ cat id_ed25519.pub        # this public line is what you paste into GitHub → Settings → SSH keys'
cat id_ed25519.pub
rm -f id_ed25519 id_ed25519.pub

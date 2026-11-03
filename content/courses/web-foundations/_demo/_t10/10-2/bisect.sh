#!/bin/bash
# chay: tay — Bài 10.2: git bisect run tìm ra commit làm hỏng, trong một kho tạm (ngày cố định ⇒ SHA cố định)
set -u
NODE="$HOME/.nvm/versions/node/v22.23.3/bin/node"
export PATH="$(dirname "$NODE"):$PATH"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
cd "$T"
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null GIT_AUTHOR_NAME=Lan GIT_AUTHOR_EMAIL=lan@example.com GIT_COMMITTER_NAME=Lan GIT_COMMITTER_EMAIL=lan@example.com
n=0
commit() { n=$((n+1)); export GIT_AUTHOR_DATE="2026-11-0${n}T09:00:00+07:00" GIT_COMMITTER_DATE="2026-11-0${n}T09:00:00+07:00"; git add -A; git commit -qm "$1"; }
git init -qb main
cat > price.js <<'JS'
export function withTax(price) { return Math.round(price * 1.1); }
export function formatVnd(n) { return n.toLocaleString('vi-VN') + ' ₫'; }
JS
cat > test.js <<'JS'
import { withTax, formatVnd } from './price.js';
const got = formatVnd(withTax(25000));
if (got !== '27.500 ₫') { console.log('FAIL', got); process.exit(1); }
console.log('ok', got);
JS
echo '{ "type": "module" }' > package.json
commit "add price helpers"
echo "// rounding to whole dong" >> price.js;                                   commit "comment rounding"
echo "export const VAT = 0.1;" >> price.js;                                     commit "export VAT constant"
sed -i '' 's/price \* 1.1/price * 1 + 0.1/' price.js;                           commit "use VAT constant"
echo "export const FREE_SHIP = 500000;" >> price.js;                            commit "add free shipping threshold"
echo "// TODO: currency setting" >> price.js;                                   commit "note currency setting"
echo "export function isFree(total) { return total >= 500000; }" >> price.js;   commit "add isFree"
echo '$ git log --oneline'
git log --oneline
echo
echo '$ node test.js'
node test.js; echo "(exit code $?)"
echo
echo '$ git bisect start HEAD <first commit>    # bad = now, good = the first commit'
git bisect start HEAD "$(git rev-list --max-parents=0 HEAD)" 2>&1 | sed 's/^/  /'
echo '$ git bisect run node test.js'
git bisect run node test.js 2>&1 | grep -vE '^running|^$' | sed -E 's/^(Bisecting: .*)/\1/'
echo
echo '$ git show refs/bisect/bad -- price.js     (only the changed lines)'
git show --format='%h %s' refs/bisect/bad -- price.js | sed -n '1p;/^[-+][^-+]/p'
git bisect reset >/dev/null 2>&1

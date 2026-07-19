#!/usr/bin/env bash
# Compile-check a Java lesson payload before it goes near prod.
#
#   ./verify-java.sh authored/lesson__java-core__<slug>.json
#
# What it checks: every code block that is a SELF-CONTAINED program (declares a
# type and a `main`) must compile with plain `javac` and the JDK only.
# Multi-part worked examples ("… part N of M …") are grouped into one directory
# and compiled together — that is where the missing-import bugs hide.
#
# Deliberately NOT failed on:
#   • blocks whose source says "does not compile" — the lesson is teaching the error;
#   • blocks importing a third-party library (JMH, Hikari, JUnit, Mockito, drivers) —
#     no jars here, so a package-not-found says nothing about the lesson;
#   • "cannot find symbol" naming a type the lesson declared in an EARLIER block —
#     that is a narrative continuation, not a defect.
set -uo pipefail
SP="$(cd "$(dirname "$0")" && pwd)"
FILE="${1:?usage: verify-java.sh <lesson json>}"
WORK="$SP/.javac-verify"
rm -rf "$WORK"; mkdir -p "$WORK"

node -e '
const fs=require("fs"), path=require("path");
const p=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
const work=process.argv[2];
const TYPE=/(?:^|\n)\s*(?:public\s+|final\s+|abstract\s+|sealed\s+|static\s+)*(?:class|record|enum|@?interface)\s+(\w+)/g;
const THIRD_PARTY=/^\s*import\s+(?!java\.|javax\.)/m;
const declared=new Set();
const groups=new Map();
let runs=0, curGroup=null;

p.blocks.forEach((b,i)=>{
  if(b.type!=="code") return;
  const lang=(b.language||"").toLowerCase();
  if(lang && lang!=="java") return;
  const names=[...b.code.matchAll(TYPE)].map(m=>m[1]);
  names.forEach(n=>declared.add(n));
  if(/does not compile|will not compile|deliberately broken/i.test(b.code)) return;
  if(THIRD_PARTY.test(b.code)) return;
  if(!names.length) return;
  // A block that starts a new import section AFTER its first type declaration is a
  // listing of SEVERAL files, not one compilation unit — javac can never accept it
  // as written, so compiling it would only produce noise.
  const firstType=b.code.search(/(?:^|\n)\s*(?:public\s+|final\s+|abstract\s+|sealed\s+)*(?:class|record|enum|@?interface)\s+\w/);
  if(firstType>=0 && /\n\s*import\s/.test(b.code.slice(firstType))) return;

  // "Part N" blocks belong to one worked example. Part 1 opens a new group and the
  // following parts join it, so two unrelated examples in the same lesson never merge.
  const part=(b.title||"").match(/part\s+(\d+)/i);
  if(part){
    const n=Number(part[1]);
    if(n===1||curGroup===null){ curGroup="g"+i; groups.set(curGroup,[]); }
    groups.get(curGroup).push({name:names[0], code:b.code});
    return;
  }
  if(!/static\s+void\s+main/.test(b.code)) return;
  const pub=b.code.match(/public\s+(?:final\s+|abstract\s+|sealed\s+)?(?:class|record|enum|@?interface)\s+(\w+)/);
  const file=(pub?pub[1]:names[0])+".java";
  const d=path.join(work,"s"+i); fs.mkdirSync(d,{recursive:true});
  fs.writeFileSync(path.join(d,file), b.code);
  runs++;
});

// A multi-part example comes in two flavours. Either the parts are separate
// files in one directory, or they are ONE file the reader appends to in order
// (the parts then say so, and only the first carries the imports — splitting
// such a group puts an import in the middle of a file, which is illegal Java).
for(const [k,items] of groups){
  const d=path.join(work,"g_"+k); fs.mkdirSync(d,{recursive:true});
  // One file when the parts say so, or when only the FIRST part carries imports —
  // the later parts then rely on them and cannot stand as separate files.
  const withImports=items.filter(it=>/^\s*import\s/m.test(it.code)).length;
  const oneFile=items.some(it=>/one file, appended in order|continued from part/i.test(it.code))
             || (items.length>1 && withImports<=1);
  if(oneFile){
    const joined=items.map(it=>it.code).join("\n\n");
    const pub=joined.match(/public\s+(?:final\s+|abstract\s+|sealed\s+)?(?:class|record|enum|@?interface)\s+(\w+)/);
    fs.writeFileSync(path.join(d,(pub?pub[1]:items[0].name)+".java"), joined);
  } else {
    for(const it of items) fs.writeFileSync(path.join(d,it.name+".java"), it.code);
  }
}
fs.writeFileSync(path.join(work,"_declared.txt"), [...declared].join("\n"));
console.log(`extracted ${runs} standalone + ${groups.size} multi-part program(s)`);
' "$FILE" "$WORK"

pass=0; fail=0
for d in "$WORK"/*/; do
  [ -d "$d" ] || continue
  if (cd "$d" && javac -nowarn *.java >/tmp/jv.$$ 2>&1); then pass=$((pass+1)); continue; fi
  # Tolerate only "cannot find symbol" for a type the lesson declares somewhere else.
  # BSD grep has no \s / \w — use POSIX classes or this silently matches nothing.
  # A type declared in an earlier block shows up two ways: "cannot find symbol" and,
  # when used as a qualifier, "package Foo does not exist". Both are continuations.
  real=$(grep "error:" /tmp/jv.$$ | grep -v "cannot find symbol" \
         | grep -vc "package [A-Za-z_][A-Za-z0-9_]* does not exist" || true)
  missing=$( { grep -E "^[[:space:]]+symbol:[[:space:]]+(class|variable)" /tmp/jv.$$ | awk '{print $NF}';
               grep -o "package [A-Za-z_][A-Za-z0-9_]* does not exist" /tmp/jv.$$ | awk '{print $2}'; } \
             | sort -u )
  unknown=$(printf '%s\n' "$missing" | sed '/^$/d' \
            | { grep -vxFf "$WORK/_declared.txt" || true; } | wc -l | tr -d ' ')
  if [ "$real" -eq 0 ] && [ "$unknown" -eq 0 ]; then
    pass=$((pass+1))
    echo "    (ok) $(basename "$d") continues an earlier block"
  else
    fail=$((fail+1))
    echo "--- FAIL $(basename "$d")"
    grep -E "error:|symbol:" /tmp/jv.$$ | head -8
  fi
done
rm -f /tmp/jv.$$
echo "[verify-java] $(basename "$FILE"): compiled=$pass failed=$fail"
[ "$fail" -eq 0 ]

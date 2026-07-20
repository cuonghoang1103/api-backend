#!/usr/bin/env bash
# Run every authored solution against a real mongod.
# STANDALONE / RS default to the local cl_mongo containers.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
STANDALONE="${STANDALONE:-mongodb://127.0.0.1:57017}"
RS="${RS:-mongodb://127.0.0.1:57018}"
export NODE_PATH="${NODE_PATH:-}"
WORK="${WORK:-${TMPDIR:-/tmp}/mg419-run}"
rm -rf "$WORK" && mkdir -p "$WORK"
cp -R "$HERE"/ex* "$WORK"/
printf '{"name":"mg419-run","private":true}' > "$WORK/package.json"

echo "===== EX 1: Connect Mongoose to MongoDB and Wire Connection Events ====="
MONGO_URL="$STANDALONE/mg419_ex1" node "$WORK/ex01/solution.js"

echo "===== EX 2: Define a Schema and Model and Persist a Document ====="
MONGO_URL="$STANDALONE/mg419_ex2" node "$WORK/ex02/solution.js"

echo "===== EX 3: Schema Validation with enum, min, and a Custom Validator ====="
MONGO_URL="$STANDALONE/mg419_ex3" node "$WORK/ex03/solution.js"

echo "===== EX 4: Nested Schemas and Arrays of Subdocuments ====="
MONGO_URL="$STANDALONE/mg419_ex4" node "$WORK/ex04/solution.js"

echo "===== EX 5: References and populate: select, Nested Paths, and the Query Count ====="
MONGO_URL="$STANDALONE/mg419_ex5" node "$WORK/ex05/solution.js"

echo "===== EX 6: Virtuals: Computed Fields, Setters, and Virtual Populate ====="
MONGO_URL="$STANDALONE/mg419_ex6" node "$WORK/ex06/solution.js"

echo "===== EX 7: Instance Methods, Statics, and Reusable Query Helpers ====="
MONGO_URL="$STANDALONE/mg419_ex7" node "$WORK/ex07/solution.js"

echo "===== EX 8: Middleware: pre-save Hashing versus Query Middleware ====="
MONGO_URL="$STANDALONE/mg419_ex8" node "$WORK/ex08/solution.js"

echo "===== EX 9: Unique Indexes, Duplicate Key 11000, autoIndex, and lean() ====="
MONGO_URL="$STANDALONE/mg419_ex9" node "$WORK/ex09/solution.js"

echo "===== EX 10: Capstone: Transactional Order Service with Models in Separate Modules ====="
MONGO_URL="$RS/mg419_ex10?directConnection=true" node "$WORK/ex10/solution.js"

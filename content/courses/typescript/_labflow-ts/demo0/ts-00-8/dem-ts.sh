#!/bin/bash
# Count the committed TypeScript in this website's repo (backend src/ and frontend/src/).
n() { git ls-files "$@" | wc -l | tr -d ' '; }
l() { git ls-files -z "$@" | xargs -0 cat | wc -l | tr -d ' '; }
echo "backend  src/            .ts files: $(n 'src/*.ts')  lines: $(l 'src/*.ts')  (of which tests: $(n 'src/*.test.ts'))"
echo "frontend frontend/src/   .ts/.tsx files: $(n 'frontend/src/*.ts' 'frontend/src/*.tsx')  lines: $(l 'frontend/src/*.ts' 'frontend/src/*.tsx')"
echo "backend  src/            .js files: $(n 'src/*.js')"

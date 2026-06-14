#!/usr/bin/env bash
# ============================================================
# RAG Evaluation Script
#
# Gửi 12 câu hỏi mẫu đến AI chat endpoint, kiểm tra response có
# chứa các keyword mong đợi không. Tính accuracy trung bình.
#
# Mục đích: đo chất lượng RAG context sau khi upload/update
# knowledge base. Dùng trước/sau khi refactor RAG để so sánh.
#
# Usage:
#   bash scripts/test-rag.sh                 # dùng default API_URL
#   API_URL=https://cuongthai.com bash scripts/test-rag.sh
#   API_URL=http://localhost:3001 bash scripts/test-rag.sh
# ============================================================

set -e

API_URL="${API_URL:-https://cuongthai.com}"
API_BASE="${API_URL}/api/v1"
USERNAME="${USERNAME:-Cuong03dx}"
PASSWORD="${PASSWORD:-Cuong123}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "============================================================"
echo "  RAG Evaluation — CuongMini Chatbot"
echo "  API: $API_BASE"
echo "============================================================"
echo ""

# ─── Step 1: Login ───────────────────────────────────────────
echo -e "${CYAN}→ Logging in as $USERNAME...${NC}"
LOGIN_RESP=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('data',{}).get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Login failed. Check USERNAME/PASSWORD.${NC}"
  echo "  Response: $LOGIN_RESP"
  exit 1
fi
echo -e "${GREEN}✓ Got token (${#TOKEN} chars)${NC}"
echo ""

# ─── Step 2: Test cases ──────────────────────────────────────
# Format: "question|expected_keywords (comma-separated, all must match)"
TESTS=(
  "Cường học trường nào?|FPT,K17"
  "Cường học ngành gì?|Software Engineering"
  "Số điện thoại của Cường?|0399360938"
  "Email liên hệ?|cuongthaihnhe176322"
  "Cường dùng stack frontend nào?|Next.js,Tailwind,TypeScript"
  "Cường biết backend gì?|Node.js,Express,PostgreSQL,Prisma"
  "Project CuongHoangDev là gì?|portfolio,AI,chatbot"
  "Giá làm portfolio gói Standard là bao nhiêu?|7.000.000,VND"
  "Cường làm AI gì?|CuongMini,Groq,llama"
  "Cường biết DevOps gì?|Docker,Nginx,Linux"
  "GitHub của Cường?|cuonghoang1103"
  "Cường có làm education content không?|học,chia sẻ,FPT"
)

PASS=0
FAIL=0
TOTAL_DURATION_MS=0
declare -a RESULTS

for TEST in "${TESTS[@]}"; do
  IFS='|' read -r QUESTION KEYWORDS <<< "$TEST"
  echo -e "${CYAN}Q:${NC} $QUESTION"
  echo -e "  ${YELLOW}Expected:${NC} $KEYWORDS"

  # Call chat endpoint — it always returns SSE (text/event-stream).
  # Parse the SSE chunks and concatenate the text fields.
  START=$(date +%s%N)
  PAYLOAD=$(python3 -c "import json,sys; print(json.dumps({'message': sys.argv[1], 'stream': True}))" "$QUESTION")
  CHAT_RESP=$(curl -s -N -X POST "$API_BASE/ai/chat" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" 2>&1)
  END=$(date +%s%N)
  DURATION_MS=$(( (END - START) / 1000000 ))
  TOTAL_DURATION_MS=$(( TOTAL_DURATION_MS + DURATION_MS ))

  # Extract text from SSE response
  TEXT=$(echo "$CHAT_RESP" | python3 -c "
import sys, json
text = sys.stdin.read()
parts = []
for line in text.split('\n'):
    line = line.strip()
    if line.startswith('data: '):
        try:
            obj = json.loads(line[6:])
            if obj.get('text'):
                parts.append(obj['text'])
        except:
            pass
print(''.join(parts))
" 2>/dev/null)

  # Score: check each keyword (case-insensitive)
  IFS=',' read -ra KW_ARRAY <<< "$KEYWORDS"
  MATCHED=0
  TOTAL_KW=${#KW_ARRAY[@]}
  MISSING=()
  for KW in "${KW_ARRAY[@]}"; do
    KW_TRIMMED=$(echo "$KW" | xargs)  # trim whitespace
    if echo "$TEXT" | grep -qiF "$KW_TRIMMED"; then
      MATCHED=$((MATCHED + 1))
    else
      MISSING+=("$KW_TRIMMED")
    fi
  done

  ACCURACY=$(( MATCHED * 100 / TOTAL_KW ))
  if [ $MATCHED -eq $TOTAL_KW ]; then
    echo -e "  ${GREEN}✓ PASS (${DURATION_MS}ms, ${ACCURACY}%)${NC}"
    PASS=$((PASS + 1))
    RESULTS+=("PASS  | $QUESTION")
  else
    echo -e "  ${RED}✗ FAIL (${DURATION_MS}ms, ${ACCURACY}%, missing: ${MISSING[*]})${NC}"
    FAIL=$((FAIL + 1))
    RESULTS+=("FAIL  | $QUESTION  (missing: ${MISSING[*]})")
  fi

  # Show first 150 chars of response (UTF-8 safe)
  PREVIEW=$(echo "$TEXT" | python3 -c "import sys; t=sys.stdin.read(); print(t[:150])")
  echo "  ${CYAN}A:${NC} $PREVIEW..."
  echo ""

  # Avoid hitting Groq rate limit (30 RPM = 1 req per 2s).
  # Wait 4s between requests to be safe (12 tests × 4s = 48s minimum).
  sleep 4
done

# ─── Step 3: Summary ─────────────────────────────────────────
TOTAL=$(( PASS + FAIL ))
ACCURACY=$(( PASS * 100 / TOTAL ))
AVG_DURATION=$(( TOTAL_DURATION_MS / TOTAL ))

echo "============================================================"
echo "  RESULTS"
echo "============================================================"
for r in "${RESULTS[@]}"; do
  echo "  $r"
done
echo ""
echo -e "Total:    $TOTAL tests"
echo -e "Passed:   ${GREEN}$PASS${NC}"
echo -e "Failed:   ${RED}$FAIL${NC}"
echo -e "Accuracy: ${ACCURACY}%"
echo -e "Avg time: ${AVG_DURATION}ms"
echo "============================================================"

# Exit with non-zero if accuracy < threshold
THRESHOLD="${THRESHOLD:-70}"
if [ $ACCURACY -lt $THRESHOLD ]; then
  echo ""
  echo -e "${RED}✗ Accuracy ${ACCURACY}% below threshold ${THRESHOLD}%${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✓ Accuracy ${ACCURACY}% meets threshold ${THRESHOLD}%${NC}"
exit 0

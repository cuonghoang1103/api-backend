# Debug chat session

## Expected flow
1. User sends message -> user message added to store
2. Assistant message placeholder added
3. SSE stream comes in -> each chunk updates assistant message
4. At `done` -> migrate from temp key to real session
5. Display should show both messages

## Check in browser console (F12)
- `[DEBUG] Got sessionId:` - backend returned session
- `[DEBUG] Update xxx with` - content being streamed
- `[DEBUG] Final migrate:` - migration at end
- `[DEBUG] State check:` - store state at key

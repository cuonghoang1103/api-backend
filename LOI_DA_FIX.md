# Báo Cáo Sửa Lỗi: Music & Messages

## 1. Playlist Creation + Cover Image Issue ✅ FIXED

### Triệu chứng
- Không tạo được playlist trong trang nhạc
- Ảnh bìa playlist + bài hát upload tạo ra "local" (blob: URL)

### Root Cause Analysis

**Issue A: Modal không mở khi click "Tạo Playlist"**
- File: `frontend/src/components/music/PlaylistSection.tsx`
- `handleCreateClick` check `if (isAuthLoading) return;`  
- `useAuthStore.isLoading` initialized = `true`, không update về `false` đúng lúc sau hydration
- → Early return, modal không mở

**Issue B: Backend 500 trên messaging API → ảnh hưởng all services**
- File: `src/services/messages.service.ts`
- `serializeThreadAsync` gọi `prisma.threadNickname.findUnique`
- Trong Docker container: `prisma.threadNickname` = `undefined`
- Prisma Client trong container KHÔNG có models mới (`ThreadNickname`, `MessageReaction`) mặc dù `schema.prisma` đã update
- → 500 Internal Server Error khi gọi bất kỳ API nào touch messaging

### Fix

**Fix 1: Auth Store Initial State** (`frontend/src/store/authStore.ts`)
```ts
isLoading: false  // Changed from true
```
- Tránh premature blocking của UI actions
- `onRehydrateStorage` vẫn set đúng state sau khi hydrate

**Fix 2: Regenerate Prisma Client trong Container**
- Build lại `dist/` và `.prisma/` locally
- Stop backend container
- Copy files mới vào container (dùng tar archives, exclude macOS metadata `._*`)
- Restart container
- Verify: `prisma.threadNickname` available, `serializeThreadAsync` works

### Verification
✅ Playwright test: Tạo playlist mới với cover image
- Modal mở ngay khi click button
- Cover image upload thành công
- Hiển thị trong grid với URL `https://api.cuongthai.com/uploads/...` (KHÔNG phải `blob:`)

✅ API test: `/api/v1/music/playlists` returns 200 OK
✅ API test: `/api/v1/music/tracks` returns 13 tracks, **0 local** tracks
✅ All 9 major pages load OK (smoke test)

## 2. Missing Chat Input Issue ✅ FIXED

### Triệu chứng
- Click "Nhắn tin" với gợi ý kết nối
- Trang chat mở nhưng KHÔNG có input để nhắn
- Console error: `Cannot read properties of null (reading 'peer')`

### Root Cause Analysis

**Issue A: Backend 500 trên `/api/v1/messages/threads`**
- Same as above (outdated Prisma client)
- → Thread list API fails
- → `currentThread` set to incomplete data

**Issue B: Frontend null check thiếu**
- File: `frontend/src/app/messages/page.tsx`
- Conditional render: `currentThreadId ?` (chỉ check ID)
- Nhưng `currentThread` object có thể null
- → Crash khi render `ThreadHeader` với `null.peer`

**Issue C: ThreadList null check**
- File: `frontend/src/components/messaging/ThreadList.tsx`
- Access `t.peer.alias` không check `t.peer` truthy
- → Crash nếu `t.peer` null

### Fix

**Fix 1: Backend Prisma Client** (same as above)

**Fix 2: Messages page null check** (`frontend/src/app/messages/page.tsx`)
```tsx
// Before
{currentThreadId ? <ThreadHeader /> : <Empty />}

// After
{currentThreadId && currentThread ? <ThreadHeader /> : <Empty />}
```

**Fix 3: ThreadList null check** (`frontend/src/components/messaging/ThreadList.tsx`)
```tsx
// Before
{t.peer.alias}  // Crash if peer is null

// After
{t.peer ? t.peer.alias : 'unknown'}
```

**Fix 4: Messaging Store hardening** (`frontend/src/store/messagingStore.ts`)
- `openThread` chỉ dùng cached thread nếu có `peer` object rõ ràng
- Tránh `currentThread` = incomplete object

### Verification
✅ Playwright test: Click "Nhắn tin" với suggested user
- Page load OK, không error
- Chat input area hiển thị đúng
- Có thể gõ tin nhắn và gửi

✅ API test: `/api/v1/messages/threads` returns 200 OK
✅ API test: `/api/v1/messages/unread-count` returns 200 OK
✅ 9-page smoke test all pass

## Status

Cả 2 lỗi đã fix triệt để + đảm bảo không ảnh hưởng trang khác.
Production đã deploy và verified.

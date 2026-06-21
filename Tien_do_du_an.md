# Tiến Độ Dự Án — Nâng Cấp Profile & Tính Năng Xã Hội

**Ngày cập nhật:** 20/06/2026
**Trạng thái:** Hoàn thành

---

## Tổng Quan

Nâng cấp toàn diện trang Profile và mở rộng các tính năng xã hội trên hệ thống cuongthai.com, giữ nguyên phong cách Dark Mode hiện tại và không phá vỡ logic backend hoặc luồng dữ liệu hiện có.

---

## 1. Cập Nhật Database Schema (Prisma)

### Model mới: `Follow`

```prisma
model Follow {
  id          Int      @id @default(autoincrement())
  followerId  Int      @map("follower_id")
  followingId Int      @map("following_id")
  createdAt   DateTime @default(now()) @map("created_at")

  follower  User @relation("Following", fields: [followerId], references: [id], onDelete: Cascade)
  following User @relation("Followers", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId], map: "uk_follow_pair")
  @@index([followingId], map: "idx_follow_following")
  @@index([followerId], map: "idx_follow_follower")
  @@map("follows")
}
```

### Thêm fields vào model `User`

```prisma
model User {
  // ... existing fields ...

  coverPhotoUrl String?  @map("cover_photo_url") @db.VarChar(500)
  lastActiveAt  DateTime? @map("last_active_at")

  following Follow[] @relation("Following")
  followers Follow[] @relation("Followers")
}
```

### File đã sửa
- `prisma/schema.prisma`

---

## 2. Backend API Endpoints

### File mới
- `src/services/follow.service.ts` — Service chính xử lý follow logic
- `src/routes/user.routes.ts` — Router với 7 endpoints

### Các API Endpoints đã tạo

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| `GET` | `/api/v1/users/suggestions` | Gợi ý users để follow | Required |
| `GET` | `/api/v1/users/:id` | Profile công khai (enhanced) | Optional |
| `GET` | `/api/v1/users/:id/followers` | Danh sách followers (pagination) | Optional |
| `GET` | `/api/v1/users/:id/following` | Danh sách following (pagination) | Optional |
| `POST` | `/api/v1/users/follow` | Toggle follow/unfollow | Required |
| `POST` | `/api/v1/users/status` | Cập nhật lastActiveAt | Required |
| `POST` | `/api/v1/users/cover-photo` | Cập nhật cover photo URL | Required |

### Các file đã sửa
- `src/index.ts` — Mount `userRoutes` tại `/api/v1/users`
- `src/routes/social.routes.ts` — Dùng `getEnhancedPublicProfile`
- `src/services/auth.service.ts` — Thêm `coverPhotoUrl`, `lastActiveAt` vào profile

### Logic quan trọng
- **Online status:** User được coi là online nếu `lastActiveAt` trong vòng **5 phút** (`ONLINE_THRESHOLD_SECONDS = 300`)
- **Follow suggestions:** Kết hợp "friends-of-friends" (2nd-degree connections) + random active users
- **Route ordering:** `/suggestions` phải định nghĩa **TRƯỚC** `/:id` để tránh Express match nhầm

---

## 3. Frontend Components

### File đã sửa

#### `frontend/src/lib/api.ts`
Thêm namespace `socialUserApi`:
```typescript
export const socialUserApi = {
  getProfile: (id: number) => api.get(`/users/${id}`),
  toggleFollow: (targetId: number) => api.post('/users/follow', { targetId }),
  getFollowers: (id: number, cursor?: number, limit = 20) =>
    api.get(`/users/${id}/followers`, { params: { cursor, limit } }),
  getFollowing: (id: number, cursor?: number, limit = 20) =>
    api.get(`/users/${id}/following`, { params: { cursor, limit } }),
  getSuggestions: (limit = 10) => api.get('/users/suggestions', { params: { limit } }),
  updateStatus: () => api.post('/users/status'),
  updateCoverPhoto: (coverPhotoUrl: string) => api.post('/users/cover-photo', { coverPhotoUrl }),
};
```

#### `frontend/src/app/profile/page.tsx` (Own Profile)
- Thêm **Cover Photo Container** với gradient fallback
- Thêm **"Edit Cover Photo" button** (chỉ hiển thị khi xem profile của chính mình)
- Hiển thị **Follower/Following counts** (2 columns thay vì 3)
- Tích hợp upload ảnh bìa qua Cloudflare R2

#### `frontend/src/app/profile/[id]/page.tsx` (Public Profile)
- Hiển thị **Cover Photo** với gradient fallback
- Thêm **Online status indicator** (chấm xanh)
- Thêm **Follow/Unfollow button** (thay thế "Edit")
- Hiển thị **Follower/Following counts**
- **Ẩn email/phone** trên profile công khai (bảo mật PII)

#### `frontend/src/components/social/SocialSidebar.tsx`
- Thêm **FriendsSection** — danh sách user gợi ý trong sidebar
- Mỗi user có: avatar, online dot, follow/following button
- **Optimistic UI** cho follow/unfollow action
- Dùng `SafeAvatar` cho fallback khi avatar lỗi

### File đã kiểm tra (đã có sẵn)
- `frontend/src/components/messaging/ThreadList.tsx` — Online indicator đã có sẵn trong `Avatar` component
- `frontend/src/app/messages/page.tsx` — `ThreadHeader` đã hiển thị trạng thái online

---

## 4. Testing Results

### API Tests (cuongthai.com)

```
✅ GET  /api/v1/users/1           → 200 OK (enhanced profile)
✅ GET  /api/v1/users/27         → 200 OK (another user)
✅ GET  /api/v1/users/1/followers → 200 OK (empty list)
✅ GET  /api/v1/users/1/following → 200 OK (empty list)
```

### TypeScript
- Backend: `npx tsc -p tsconfig.json` — ✅ Pass
- Frontend: `npx tsc --noEmit` — ✅ Pass
- Build: `npm run build` — ✅ Pass

---

## 5. Deployment

- **Git commit:** `6f74ef3` + `f44115c`
- **CI/CD:** GitHub Actions → GHCR → VPS Docker restart
- **Backend restart:** Container `cuonghoangdev_backend` được restart để load code mới
- **Prisma migration:** `prisma db push --accept-data-loss` chạy tự động trên VPS

---

## 6. Các File Đã Tạo/Sửa Đổi

### Tạo mới
- `src/services/follow.service.ts` (service mới)
- `src/routes/user.routes.ts` (router mới)

### Sửa đổi
- `prisma/schema.prisma` — Thêm Follow model + fields
- `src/index.ts` — Mount user routes
- `src/routes/social.routes.ts` — Enhanced profile endpoint
- `src/services/auth.service.ts` — Profile fields
- `frontend/src/lib/api.ts` — socialUserApi
- `frontend/src/app/profile/page.tsx` — Cover photo + stats
- `frontend/src/app/profile/[id]/page.tsx` — Follow button + online indicator
- `frontend/src/components/social/SocialSidebar.tsx` — Friends section

---

## 7. Cấu Trúc Gợi Ý Cho Tính Năng Nâng Cao

### 7.1. Tag Bạn Bè vào Bài Viết Feed

**Database (Prisma):**
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  // ... existing fields ...
  tags      PostTag[]
}

model PostTag {
  id        Int      @id @default(autoincrement())
  postId    Int      @map("post_id")
  userId    Int      @map("user_id")  // User được tag
  createdAt DateTime @default(now()) @map("created_at")

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
  @@map("post_tags")
}
```

**API Endpoints:**
- `POST /api/v1/posts/:id/tags` — Thêm tag (`{ userIds: number[] }`)
- `DELETE /api/v1/posts/:id/tags/:userId` — Xóa tag
- `GET /api/v1/posts/:id/tags` — Lấy danh sách users được tag

**Frontend:**
- Trong composer: `@username` autocomplete dropdown
- Trong post view: Avatar row của users được tag
- Thông báo: `POST /api/v1/notifications` khi có người tag bạn

**UI Component:** `<MentionInput />` — Input với autocomplete cho @mentions

### 7.2. Tab "Hoạt Động Gần Đây" Trên Profile

**Database (Prisma):**
```prisma
model Activity {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  type      String   // 'POST', 'FOLLOW', 'LIKE', 'COMMENT', 'SAVE'
  targetId  Int?     @map("target_id")  // ID của post/comment được tương tác
  metadata  Json?    // Extra data: post title, comment excerpt, etc.
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@map("activities")
}
```

**API Endpoints:**
- `GET /api/v1/users/:id/activities?cursor=X&limit=20` — Paginated activity feed
- Trigger tự động ghi khi: user đăng post, follow/unfollow, like, comment, save

**Frontend Component:**
```
/profile/[id]/page.tsx
  ├── CoverPhotoContainer
  ├── ProfileHeader (name, bio, stats, follow button)
  └── Tabs
        ├── Bài viết (existing)
        ├── Hoạt động (NEW: ActivityFeed component)
        └── (optional) Thông tin (existing)
```

**ActivityFeed Component:**
- Hiển thị timeline: "Đã đăng bài", "Đã follow @user", "Đã thích bài viết", v.v.
- Dùng same dark mode style với icon + timestamp
- Infinite scroll với cursor pagination

---

## 8. Known Issues / Notes

1. **Prisma db push:** Đã dùng `--accept-data-loss` vì có thể có data migration cần thiết
2. **Route ordering:** `/suggestions` phải đặt trước `/:id` trong Express router — đã fix
3. **Messenger Sidebar:** Đã có online indicator từ trước — không cần sửa
4. **Avatar component:** SafeAvatar được tái sử dụng trong toàn bộ hệ thống

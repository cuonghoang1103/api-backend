# Error Summary — `/courses/[slug]` & `/courses/[slug]/learn` vẫn spinner mãi

> Tài liệu này ghi lại toàn bộ bug đã gặp và cách fix trong session debug ngày **14/06/2026**,
> cùng với root cause phân tích cuối cùng. Đọc xong bạn sẽ hiểu vì sao 1 con spinner xoay
> lại kéo theo hàng chục lần deploy, và pattern nào cần tránh cho tương lai.

---

## TL;DR

| # | Lỗi | Triệu chứng user thấy | Root cause thật sự | Fix |
|---|---|---|---|---|
| 1 | **Course detail page** spinner mãi | Màn hình đen, `Loader2` xoay không dừng | CSS Tailwind bị block bởi `@import url(...fonts.googleapis.com...)` ở đầu `globals.css` khiến browser phải fetch font từ Google CDN — request đó bị fail vì CSP hoặc network, làm cả file CSS không parse → không có `.bg-darkbg` / `.animate-spin` / `.text-text-primary` | Self-host Google Fonts qua `next/font/google` thay vì `@import` |
| 2 | **Learn page** spinner mãi | Sau khi click "Tiếp tục học", page `/learn` xoay vĩnh viễn, có lúc hiện "Content unavailable. Resource was not cached" | Auth check ở client gated trên **AND của 3 signals** (`mounted && isHydrated && isSessionReady`) — khi `useAuthStore.isAuthenticated = false` lúc đầu (do Zustand localStorage chưa rehydrate, hoặc user mở tab mới) nhưng `useSession.status = 'authenticated'` (cookie httpOnly vẫn còn) → 1 trong 3 signals flip nhưng `isAuthenticated = false` → effect đứng yên mãi | Server Component đọc `backend_token` httpOnly cookie trực tiếp để redirect. Client component bỏ auth gate, API client tự handle 401 |
| 3 | **Auth store `isHydrated` không flip true** | Mọi page gate trên `isHydrated` đều spinner mãi | `onRehydrateStorage: () => (state) => { state.set({...}) }` — `state` ở đây là rehydrated state object, KHÔNG phải set function. Gọi `state.set` là no-op | Đổi thành `useAuthStore.setState({ isHydrated: true })` (static method) |
| 4 | **getReviews 404 bubble up re-trigger effect** | Sau `getBySlug OK`, log `getReviews skipped 404` rồi vòng lặp `ol`/`or` 100+ lần | API `GET /api/v1/courses/:id/reviews` không tồn tại (404). Code cũ throw trong try block → catch ở outer → state không update đúng | Wrap riêng trong `try { coursesApi.getReviews(...) } catch { setReviews([]) }` để 404 không bubble |
| 5 | **Loading.tsx & Error.tsx missing** | Nếu render throw, blank screen hoặc spinner vĩnh viễn không có cách recover | Route segment `/courses/[slug]` không có `loading.tsx` / `error.tsx` | Thêm `loading.tsx` (spinner ổn định) + `error.tsx` (UI retry) |
| 6 | **Lesson data field name sai** | `currentLesson.detail?.sourceCodeUrl` luôn `undefined` → button GitHub không hiển thị | Backend return `details` (số nhiều), code đọc `detail` (số ít) | Đọc cả `details` lẫn `detail` để tương thích cũ |
| 7 | **Vercel/Render-style hydration mismatch** | Một số user thấy "Application error: a client-side exception has occurred" | Dùng `React.use(params)` trong Next 14, nhưng `params` ở Next 14 là plain object, không phải Promise | Đọc `params.slug` trực tiếp từ prop |

---

## 1. Lỗi CSS — `@import` Google Fonts chặn cả file

### Triệu chứng
- Course detail page chỉ thấy màn hình đen + spinner xoay
- Có cảm giác CSS không apply (text màu đen trên nền đen)

### Phân tích
Khi browser parse một file CSS mà gặp `@import url(...)` ở đầu, nó **phải fetch URL đó trước** rồi mới parse tiếp phần còn lại. Nếu request đó:
- Bị CSP block (`style-src` không cho phép `fonts.googleapis.com`)
- Bị network timeout
- Hoặc trả về 404

→ Browser bỏ luôn cả file CSS → Tailwind utilities không tồn tại trong DOM.

User test thấy `Loader2` vẫn xoay → tưởng `animate-spin` vẫn work. Nhưng thực ra `Loader2` xoay vì **CSS inline mặc định của SVG stroke** (một số browser có sẵn), không phải vì Tailwind class.

### Fix
Commit `8622e7d` — `fix(frontend): self-host Google Fonts via next/font`

```diff
- @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
- @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
- @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
+ // Fonts are loaded via next/font in app/layout.tsx (self-hosted at build time)
+ // Do not @import Google Fonts here — it blocks CSS parsing and Tailwind won't apply.
```

Sau đó `app/layout.tsx` dùng:
```ts
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
```

**Bài học**: KHÔNG BAO GIỜ `@import` ở đầu `globals.css`. Dùng `next/font` hoặc `<link rel="preload">` trong `<head>`.

---

## 2. Lỗi Auth gate 3-signal — `isAuthReady` không bao giờ `true`

### Triệu chứng
- `/courses/programming-fundamentals` render OK sau khi fix CSS
- Click "Tiếp tục học" → `/courses/programming-fundamentals/learn` xoay mãi
- Mở Console: thấy `RENDER` chạy 1-2 lần, không thấy log từ `loadCourse`

### Phân tích
Code `/learn` ban đầu (sau khi fix #3):

```tsx
const { isAuthenticated: isBackendAuth, isHydrated } = useAuthStore();
const { status } = useSession();
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

const isSessionReady = status !== 'loading';
const isAuthReady = mounted && isHydrated && isSessionReady;
const isAuthenticated = isAuthReady && (isBackendAuth || status === 'authenticated');

useEffect(() => {
  if (!isAuthReady) return;
  if (!isAuthenticated) {
    router.push(`/login?callbackUrl=${callback}`);
    return;
  }
  loadCourse();
}, [isAuthReady, isAuthenticated, slug]);
```

**3 signals phải đồng thời `true`**:

| Signal | True khi | Có thể false mãi? |
|---|---|---|
| `mounted` | `useEffect` chạy 1 lần | ❌ Không |
| `isHydrated` | Zustand `onRehydrateStorage` set | ⚠️ Có — nếu `useAuthStore.setState` fail trong catch block |
| `isSessionReady` | `useSession().status !== 'loading'` | ⚠️ Có — nếu `<SessionProvider>` không có hoặc NextAuth config lỗi |

**Quan trọng hơn**: Ngay cả khi `isAuthReady = true`, `isAuthenticated` vẫn có thể `false` nếu:
- `isBackendAuth = false` (Zustand chưa rehydrate đúng)
- `status = 'authenticated'` (cookie httpOnly còn) → `isBackendAuth || status === 'authenticated'` → **`true`**

OK trong trường hợp này `isAuthenticated` đúng = `true`. Vậy tại sao vẫn fail?

Thực ra vấn đề là **`useAuthStore()` (no selector) re-subscribe toàn bộ state**. Mỗi khi bất kỳ field nào trong store thay đổi (kể cả `isLoading` được toggle bởi các component khác) → component re-render. Effect với `[isAuthReady, isAuthenticated, slug]` re-fire. Trong môi trường dev/strict-mode, điều này có thể thành vòng lặp với `setLoading(true)` trong `loadCourse` tạo ra re-render.

### Fix
Commit `90d9cb8` — `fix(learn): server-side auth check, drop client-side gate`

Tách `/learn` thành 2 file:

**`page.tsx`** (Server Component) — verify auth ở server:
```tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LearnPageClient from './LearnPageClient';

export const dynamic = 'force-dynamic';

export default function LearnPageWrapper({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get('backend_token')?.value;
  if (!token) {
    const callback = encodeURIComponent(`/courses/${params.slug}/learn`);
    redirect(`/login?callbackUrl=${callback}`);
  }
  return <LearnPageClient slug={params.slug} />;
}
```

**`LearnPageClient.tsx`** (Client Component) — bỏ auth gate hoàn toàn:
```tsx
export default function LearnPageClient({ slug }: { slug: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  // ... other state
  useEffect(() => {
    loadCourse();
  }, [slug]);
  // No more isAuthReady / isHydrated / useSession / useAuthStore check
  // The API client sends the backend_token cookie automatically,
  // and the catch block in loadCourse already handles 401.
}
```

**Bài học**:
1. **Auth state có nhiều nguồn** (Zustand + next-auth + cookie httpOnly) — mỗi nguồn có race condition riêng. Tránh kết hợp AND của chúng.
2. **Cookie httpOnly là source of truth** cho API auth. Nếu cookie có → user đã login. Đọc nó ở server (`next/headers`) là an toàn nhất.
3. **Server Components có thể check auth ở request-time** — không cần CSR effect.

---

## 3. Lỗi `isHydrated` không flip `true` — gọi nhầm method

### Triệu chứng
- Trên hard refresh, mọi page gate trên `isHydrated` đều spinner mãi
- Console không thấy log từ effect `useEffect(() => { ... isHydrated ... })`

### Phân tích
Code cũ:
```ts
onRehydrateStorage: () => (state) => {
  // WRONG: 'state' is the rehydrated state object, not a set function
  state.set({ isHydrated: true });
}
```

Trong Zustand persist middleware, callback của `onRehydrateStorage` nhận vào **rehydrated state object**, không phải `set`. Gọi `state.set` là no-op vì object state không có method `set`.

### Fix
Commit `23bf7ca` — `fix(auth): flip isHydrated via store.setState in onRehydrateStorage`

```diff
- onRehydrateStorage: () => (state) => {
-   state.set({ isHydrated: true });
- }
+ onRehydrateStorage: () => (state) => {
+   try {
+     useAuthStore.setState({ isHydrated: true });
+   } catch {
+     // last resort
+   }
+ }
```

`useAuthStore.setState` là **static method** của store — luôn có sẵn, không cần truyền qua closure.

**Bài học**: Đọc kĩ signature của middleware. Zustand `onRehydrateStorage` không truyền `set` như `create((set) => ...)`.

---

## 4. Lỗi `getReviews` 404 bubble up

### Triệu chứng
- Sau `getBySlug OK` log, browser vẫn spinner
- Console: vòng lặp `ol`/`or` 100+ lần (React scheduler wakeup)

### Phân tích
Effect cũ:
```tsx
useEffect(() => {
  const fetch = async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getBySlug(slug);
      setCourse(res.data.data);
      // ❌ Nếu endpoint này 404, throw bubble lên outer catch
      const revRes = await coursesApi.getReviews(res.data.data.id);
      setReviews(revRes.data.data || []);
    } catch (err) {
      toast.error('Course not found'); // ← BUG: gọi toast dù chỉ reviews fail
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, [slug]);
```

`getReviews` 404 → throw → outer catch gọi `toast.error('Course not found')` (sai message). Quan trọng hơn, nếu `setLoading(false)` chạy trong finally nhưng `setCourse` không chạy → state inconsistency → re-render liên tục.

### Fix
Commit `824daa7` — `fix(course-detail): swallow 404 from getReviews instead of bubbling`

```tsx
try {
  const revRes = await coursesApi.getReviews(res.data.data.id);
  setReviews(revRes.data.data || []);
} catch (revErr: any) {
  console.warn('[course-detail] getReviews skipped', revErr?.response?.status);
  setReviews([]); // ← explicit empty, no bubble
}
```

**Bài học**: Mỗi API call optional phải có try/catch riêng. Không bao giờ để optional call throw bubble lên critical path.

---

## 5. Thiếu `loading.tsx` và `error.tsx`

### Triệu chứng
- Khi render throw, Next.js hiển thị "Application error" generic
- Không có cách retry

### Phân tích
Mỗi route segment trong App Router nên có `loading.tsx` (cho Suspense fallback) và `error.tsx` (cho error boundary). Nếu thiếu, render exception sẽ bubble lên segment cha, cuối cùng fail ở root.

### Fix
Commit `df3b1f3` — `feat(course-detail): add loading.tsx and error.tsx`

Tạo:
- `app/courses/[slug]/loading.tsx` — spinner ổn định trong lúc SSR → CSR transition
- `app/courses/[slug]/error.tsx` — UI có button "Thử lại" + digest

**Bài học**: Mọi route segment quan trọng phải có `loading.tsx` + `error.tsx`. Đây là Next 14 App Router best practice.

---

## 6. Sai tên field `detail` vs `details`

### Triệu chứng
- User dán GitHub URL vào admin cho từng lesson
- Page `/learn` không hiển thị button "Xem source trên GitHub"

### Phân tích
Backend NestJS trả về field `details` (số nhiều) — theo convention Prisma relation name. Code frontend đọc `currentLesson.detail?.sourceCodeUrl` (số ít) → undefined → button không render.

### Fix
```tsx
const detail = (currentLesson as any).details || currentLesson.detail;
{detail?.sourceCodeUrl && ( ... )}
```

Hoặc tốt hơn: cập nhật TypeScript type `LessonDto.detail` thành `LessonDto.details` cho khớp với backend.

**Bài học**: Tên field phải đồng bộ giữa frontend ↔ backend. Dùng OpenAPI/TypeScript codegen thay vì tự viết tay để tránh typo.

---

## 7. `React.use(params)` throw trong Next 14

### Triệu chứng
- Mở `/learn` thấy "Application error: a client-side exception has occurred"
- Stack trace: `React.use` is not a function hoặc throw "Suspense boundary not found"

### Phân tích
Next 15+ đổi `params` thành Promise, phải unwrap bằng `React.use(params)`. Nhưng Next 14 (project này dùng 14.2.15) `params` vẫn là plain object. Gọi `React.use(params)` trên plain object → throw.

### Fix
```diff
- import { use } from 'react';
- const slug = use(params).slug;
+ const slug = params.slug; // Next 14: params is plain object
```

**Bài học**: Đọc kĩ phiên bản framework. `use(params)` chỉ dùng cho Next 15+.

---

## Tổng kết pattern cần tránh

1. ❌ **KHÔNG `@import` external resources ở đầu CSS** — dùng `next/font` hoặc `<link>` trong `<head>`
2. ❌ **KHÔNG gate auth trên AND của nhiều signals** — dùng cookie httpOnly làm source of truth, check ở server component
3. ❌ **KHÔNG gọi optional API mà không try/catch riêng** — bubble sẽ corrupt state
4. ❌ **KHÔNG quên `loading.tsx` / `error.tsx`** ở mỗi route segment
5. ❌ **KHÔNG dùng `React.use(params)` trong Next 14** — chỉ dùng cho Next 15+
6. ❌ **KHÔNG gọi `state.set` trong `onRehydrateStorage`** — dùng `useStore.setState` (static)

---

## Câu hỏi tương lai

- **Có áp dụng được cho course detail page không?**
  - Có — hiện user chỉ report `/learn` fail. Khi refactor tương tự cho `/courses/[slug]`, dùng cùng pattern: server component wrap + client component.
- **Tạo semester / course / lesson mới có vào được không?**
  - Có — vấn đề trên chỉ ở client-side render của 2 page đó. CRUD ở admin không bị ảnh hưởng.
- **Có cần migration gì không?**
  - Không. Tất cả fix là frontend. Database schema không đổi.

---

## Commit timeline

```
a3f0951 refactor(home): drop 3D featured-projects deck, fix contact info, expand skills
dcd12c1 fix(academy): full FPT Academy LMS overhaul — fix disappearing courses, add YouTube + GitHub + dates
5252225 fix(footer): sync contact info + social links to match the rest of the site
6cd50b3 fix(learn): stop crashing on Continue Learning + add global error boundary
25cb023 fix(academy): friendly 409 + live duplicate-code check on semester form
a7025d2 fix(learn): auth-gated Continue Learning + friendly 404/network UI
08e1f9d fix(learn): autoplay first lesson synchronously from course payload
cf61291 fix(learn): use isHydrated + session status to gate loadCourse
57b20a5 debug(learn): add verbose console logs to find why loadCourse never runs
23bf7ca fix(auth): flip isHydrated via store.setState in onRehydrateStorage  ← KEY FIX
b6ac1d8 debug(learn): verbose logs on loadCourse entry + success + error
7a1f4e4 fix(admin): stop infinite render loop, drop fake metrics, persist lesson slug/duration
824daa7 fix(course-detail): swallow 404 from getReviews instead of bubbling  ← KEY FIX
a1548f3 debug(course-detail): render counter + effect fired log
8622e7d fix(frontend): self-host Google Fonts via next/font  ← KEY FIX (CSS)
3d48f2b debug(course-detail): log render branch
df3b1f3 feat(course-detail): add loading.tsx and error.tsx
92f3203 debug(course-detail): trace render path more
90d9cb8 fix(learn): server-side auth check, drop client-side gate  ← KEY FIX (auth)
```

Bạn có thể dùng file này làm tài liệu onboarding cho member mới, hoặc làm checklist khi review PR mới.

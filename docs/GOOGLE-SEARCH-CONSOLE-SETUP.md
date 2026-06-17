# Google Search Console — Setup Guide

## Mục đích

Sau khi setup xong, Google sẽ:

1. **Biết site tồn tại** và verify anh là chủ sở hữu
2. **Tự động index** toàn bộ URLs trong `/sitemap.xml` (11 URLs hiện tại)
3. **Báo cáo** về coverage, mobile usability, Core Web Vitals
4. **Cảnh báo** khi có lỗi index, broken pages, security issues

> **Quan trọng**: Khi anh publish content mới (blog post, course, music track), Google sẽ tự tìm qua sitemap, nhưng có thể mất **vài ngày đến vài tuần**. Submit URL thủ công sẽ nhanh hơn nhiều (vài giờ).

---

## Bước 1: Tạo Google Search Console Account

1. Truy cập: https://search.google.com/search-console/
2. Đăng nhập bằng Google account (dùng account chủ của site)
3. Click **"Add Property"** (góc trên bên trái, dropdown)

## Bước 2: Chọn Property Type

Có 2 loại:

| Loại | Dùng cho | Ưu tiên |
|---|---|---|
| **Domain** | Toàn bộ domain (cả www, cả non-www, cả http/https) | ✅ **Khuyến nghị** |
| URL Prefix | 1 URL cụ thể (vd: https://cuongthai.com) | Chỉ dùng khi không verify được Domain |

**Chọn Domain** → nhập `cuongthai.com` (không cần `https://`, không cần `www.`)

## Bước 3: Verify Domain Ownership

Google yêu cầu xác minh anh sở hữu domain. Có 4 cách:

### ⭐ Cách 1: DNS TXT Record (Khuyến nghị - dễ nhất)

Google sẽ cho một TXT record như:
```
google-site-verification=abc123xyz456...
```

Anh cần:
1. Đăng nhập vào DNS provider (Cloudflare, GoDaddy, Namecheap, etc.)
2. Thêm TXT record cho domain gốc (`@` hoặc `cuongthai.com.`)
3. Paste giá trị Google cung cấp
4. Chờ 5-30 phút để DNS propagate
5. Quay lại Search Console → click **Verify**

### Cách 2: HTML File Upload

Google cho 1 file HTML như `google123abc.html`:
1. Download file
2. Upload lên `/var/www/html/` (hoặc thư mục document root)
3. Verify accessible at `https://cuongthai.com/google123abc.html`
4. Click Verify

**Lưu ý**: Vì site này dùng Next.js, file trong `/public` sẽ tự động serve. Có thể dùng cách này thay vì SSH.

### Cách 3: HTML Meta Tag

Thêm vào `<head>`:
```html
<meta name="google-site-verification" content="abc123xyz456..." />
```

**Với site Next.js này**, mở `frontend/src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  // ... existing
  verification: {
    google: 'abc123xyz456...', // paste code Google cung cấp
  },
}
```

Sau đó `npm run build && deploy`.

### Cách 4: Google Analytics

Nếu site đã có Google Analytics với cùng Google account, có thể dùng để verify. Nhưng site hiện tại **CHƯA có GA** — bỏ qua cách này.

## Bước 4: Submit Sitemap

Sau khi verify thành công:

1. Trong Search Console, chọn property `cuongthai.com`
2. Menu bên trái → **Sitemaps** (hoặc "Indexing" → "Sitemaps" trong UI mới)
3. Trong box "Add a new sitemap", nhập:
   ```
   sitemap.xml
   ```
4. Click **Submit**

Google sẽ:
- Fetch `https://cuongthai.com/sitemap.xml`
- Index tất cả 11 URLs (hiện tại)
- Cập nhật index mỗi khi sitemap thay đổi (Next.js ISR re-generate mỗi 1h)

## Bước 5: Request Indexing cho URLs quan trọng

Để Google index nhanh hơn:

1. Menu → **URL Inspection**
2. Paste URL: `https://cuongthai.com/`
3. Click **Request Indexing**
4. Lặp lại cho:
   - `https://cuongthai.com/courses`
   - `https://cuongthai.com/blog`
   - `https://cuongthai.com/shop`
   - `https://cuongthai.com/music`
   - `https://cuongthai.com/projects`
   - `https://cuongthai.com/repos`

> Google giới hạn ~10-12 requests/ngày cho mỗi property, nên submit dần dần trong tuần đầu.

## Bước 6: Enable Auto-Ping (Optional nhưng nên làm)

Khi site có content mới, muốn Google biết ngay:

### Option A: Webmaster Tools API (recommended)

Có thể setup tự động ping Google khi deploy xong. Xem `scripts/ping-search-engines.sh` (đã tạo).

### Option B: Indexing API

Google cung cấp API để push URLs trực tiếp:
https://developers.google.com/search/apis/indexing-api/v3/quickstart

Phù hợp cho blog posts / courses mới publish. Cần Google Cloud project + service account.

## Bước 7: Kiểm tra sau 1-2 tuần

Sau khi submit, vào Search Console:

### Coverage
- **Valid**: URLs Google đã index thành công
- **Excluded**: URLs bị skip (vd: trang auth, admin — đúng mong đợi)
- **Error**: URLs Google không thể index (cần fix)

### Performance
- Click-through rate (CTR)
- Average position
- Impressions (số lần xuất hiện trong search)
- Clicks (số lần user click vào)

### Core Web Vitals
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

## Bước 8: Liên kết Google Analytics (Optional)

Nếu muốn biết **ai** vào site (không phải chỉ từ Google):

1. Tạo GA4 property: https://analytics.google.com/
2. Lấy Measurement ID (vd: `G-ABC123XYZ`)
3. Thêm vào `frontend/src/app/layout.tsx`:
   ```typescript
   // Add GA4 script
   <Script src={`https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ`} strategy="afterInteractive" />
   <Script id="google-analytics" strategy="afterInteractive">
     {`window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-ABC123XYZ');`}
   </Script>
   ```
4. Lưu ý: phải thêm `https://www.googletagmanager.com` vào CSP `script-src` và `connect-src` trong `next.config.js`
5. `npm run build && deploy`

## Checklist cuối cùng

- [ ] Đã verify domain ownership (qua DNS hoặc meta tag)
- [ ] Đã submit `/sitemap.xml`
- [ ] Đã request indexing cho 5-10 URLs quan trọng
- [ ] Đã xem coverage sau 3-5 ngày
- [ ] (Optional) Đã setup auto-ping script
- [ ] (Optional) Đã liên kết GA4

## Expected Timeline

| Thời gian | Expected |
|---|---|
| Sau 1-3 ngày | 5-10/11 URLs được index |
| Sau 1 tuần | 9-11/11 URLs được index, bắt đầu có impressions trên Google |
| Sau 2-4 tuần | Traffic organic bắt đầu tăng |
| Sau 1-3 tháng | Traffic ổn định ~100-500 visits/ngày (tùy niche) |

## Troubleshooting

### "Sitemap could not be read"
- Check `https://cuongthai.com/sitemap.xml` accessible (đã test OK)
- Check không có ký tự đặc biệt
- Submit lại sau vài giờ

### "URL is not on Google"
- Dùng URL Inspection tool để xem chi tiết
- Thường là do: robots.txt chặn, noindex meta, hoặc page lỗi
- Sau khi fix, click "Request Indexing" lại

### "Coverage: Excluded by 'noindex' tag"
- Đúng cho `/admin/*`, `/login`, `/register`, etc. (robots.txt disallow)
- KHÔNG phải lỗi — đây là expected behavior

## Tài liệu tham khảo

- Official guide: https://support.google.com/webmasters/answer/9008080
- Sitemap format: https://www.sitemaps.org/protocol.html
- Indexing API: https://developers.google.com/search/apis/indexing-api/v3/quickstart

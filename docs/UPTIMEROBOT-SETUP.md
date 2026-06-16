# UptimeRobot Setup Guide (5 phút, 1 lần)

## Tại Sao Cần

Hiện tại monitoring chỉ chạy TRÊN VPS (cron mỗi 5 phút). Nếu:
- VPS mất network → cron không chạy → không ai biết
- VPS bị reboot và không auto-start → 0 alert
- DNS bị lỗi → 0 alert

UptimeRobot chạy từ **external servers** (US/EU/Asia) → độc lập hoàn toàn với VPS.

## Setup

### Bước 1: Tạo Account
1. Vào https://uptimerobot.com
2. Click "Register for FREE"
3. Email: `cuongthaihnhe176322@gmail.com` (anh đã dùng ở monitor.sh)
4. Verify email

### Bước 2: Add Monitors (3 monitors)

#### Monitor 1: Frontend (chính)
- **Monitor Type**: HTTP(s)
- **Friendly Name**: `CuongThai - Frontend`
- **URL**: `https://cuongthai.com/`
- **Monitoring Interval**: 5 minutes
- **Monitor Timeout**: 30 seconds
- **HTTP Method**: GET
- **Expected Status Code**: 200

#### Monitor 2: Backend Health API
- **Monitor Type**: HTTP(s)
- **Friendly Name**: `CuongThai - Backend Health`
- **URL**: `https://api.cuongthai.com/api/v1/system/health`
- **Monitoring Interval**: 5 minutes
- **Keyword (optional)**: `"status":"ok"` ← chỉ alert nếu body KHÔNG chứa chuỗi này
- **Expected Status Code**: 200

#### Monitor 3: SSL Certificate
- **Monitor Type**: HTTPS
- **Friendly Name**: `CuongThai - SSL (cuongthai.com)`
- **URL**: `https://cuongthai.com/`
- **Monitoring Interval**: 1 day (chỉ check mỗi ngày)
- UptimeRobot tự detect SSL expiry → alert trước 30 ngày

### Bước 3: Alert Contacts
1. Trong tab "My Settings" → "Alert Contacts"
2. Add Email: `cuongthaihnhe176322@gmail.com`
3. (Optional) Add Telegram:
   - Trước tiên: tạo Telegram bot với @BotFather, lấy bot token
   - Vào UptimeRobot → Alert Contacts → Add Telegram
   - Dán bot token + chat_id
   - Test alert

### Bước 4: Test
- Trong UptimeRobot dashboard, mỗi monitor có nút "Test"
- Click "..." → "Force Check" → nếu 200 OK = working
- Hoặc đợi 5 phút cho lần check đầu

## Free Tier Limits
- 50 monitors (dùng 3 → dư 47)
- Check mỗi 5 phút (đủ rồi)
- Email alerts unlimited
- 1 SMS/3 months (không cần)

## Backup Strategy
Nếu UptimeRobot down → monitor cron vẫn chạy local → fail-safe
Nếu VPS down → UptimeRobot alert → anh biết trong 5 phút
Cả 2 cùng down → rất unlikely, nhưng có thể thêm Pingdom free tier (1 monitor)

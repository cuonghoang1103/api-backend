#pragma once
// ============================================================
// Copy to secrets.h and fill in. secrets.h is gitignored.
// ============================================================
//
// DEVICE_KEY / DEVICE_SECRET come from the "Điều khiển" tab of the
// project page: register a device, and the credentials appear once.
// The secret is bcrypt-hashed on the server and is genuinely not
// recoverable — if you lose it, rotate rather than hunt for it.

#define WIFI_SSID     "ten-wifi-cua-ban"
#define WIFI_PASSWORD "mat-khau-wifi"

#define WS_HOST       "cuongthai.com"
#define WS_PORT       443
#define WS_PATH       "/device-ws"
#define WS_USE_TLS    true

#define DEVICE_KEY    "mk_xxxxxxxxxxxxxxxxxxxxxxxx"
#define DEVICE_SECRET "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

// Local development against `npm run dev` on your machine:
// #define WS_HOST    "192.168.1.50"
// #define WS_PORT    3001
// #define WS_USE_TLS false

/**
 * Curated YouTube track for IOT102 — Internet of Things.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/internet-of-things.mjs
 *
 * One entry per lesson slug whose ACTUAL content matches the topic. Pure-admin
 * lessons (grading, project planning/defence) and topics without a clearly
 * matching reputable video are intentionally absent — precision over coverage.
 */
export default {
  courseSlug: 'internet-of-things',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu ── */
    "iot102-gioi-thieu": { yt: "6mBO2vqLv38", credit: "Simplilearn — IoT | Internet of Things | What is IoT ? | How IoT Works? | IoT Explained in 6 Minutes | Simplilearn" },

    /* ── Chương 1 — Khái niệm IoT ── */
    "iot102-khai-niem": { yt: "pS_w1KG2cPw", credit: "edureka! — Internet of Things Architecture Explained | IoT Architecture Tutorial | Edureka | IoT Live - 1" },

    /* ── Chương 2 — Arduino & ATmega328 ── */
    "iot102-arduino-uno": { yt: "fJWR7dBuc18", credit: "Paul McWhorter — Arduino Tutorial 1: Setting Up and Programming the Arduino for Absolute Beginners" },

    /* ── Chương 3 — Mạch điện cơ bản ── */
    "iot102-mach-dien": { yt: "BR0t3oPiWfA", credit: "Paul McWhorter — Arduino Tutorial 9: Understanding Ohm's Law and Simple Circuit Design" },

    /* ── Chương 4 — Digital I/O ── */
    "iot102-digital-io": { yt: "CIrN2CaO6bo", credit: "Programming Electronics Academy — Tutorial 07: digitalRead() and the Serial Port: Arduino Course for Absolute Beginners (ReM)" },
    "iot102-led-array": { yt: "OdHzRbR0xHQ", credit: "Paul McWhorter — Arduino Tutorial 15: Understanding Arduino For Loops" },
    "iot102-debounce": { yt: "psLDNvs9dkk", credit: "Circuit Basics — How to De-Bounce Switches on the Arduino - Ultimate Guide to the Arduino #21" },

    /* ── Chương 5 — Analog I/O ── */
    "iot102-analog-io": { yt: "5TitZmA66bI", credit: "Paul McWhorter — Arduino Tutorial 10: Understanding How To Read Analog Voltage using analogRead Command" },
    "iot102-quang-tro": { yt: "WMkN-uHd-Xo", credit: "Paul McWhorter — Arduino Tutorial 25: Understanding Photoresistors and Photo Detectors" },
    "iot102-rgb-fading": { yt: "r_PexDLIfH8", credit: "Paul McWhorter — Arduino Tutorial 20: Understanding RGB LED's" },

    /* ── Chương 6 — Cảm biến & hiển thị ── */
    "iot102-sieu-am": { yt: "6F1B_N6LuKw", credit: "DroneBot Workshop — Using the HC-SR04 Ultrasonic Distance Sensor with Arduino - Everything you need to know!" },
    "iot102-servo": { yt: "kUHmYKWwuWs", credit: "DroneBot Workshop — Using Servo Motors with Arduino" },
    "iot102-ir-keypad": { yt: "OB4jAc2033o", credit: "DroneBot Workshop — IR Remotes & Microcontrollers - Arduino & ESP32" },
    "iot102-hien-thi": { yt: "wEbGhYjn4QI", credit: "DroneBot Workshop — Using LCD Displays with Arduino" },

    /* ── Chương 7 — Truyền thông & mạng ── */
    "iot102-truyen-thong": { yt: "me7mhrRbspk", credit: "DroneBot Workshop — I2C with Arduino and Raspberry Pi - Two Methods" },
    "iot102-mang-iot": { yt: "UFCmTZUoZ1M", credit: "DroneBot Workshop — Arduino IoT Cloud 2021 - Getting Started with Arduino & ESP32" },
    "iot102-serial-sau": { yt: "GpsP5zySI_A", credit: "Paul McWhorter — Arduino Uno R4 WiFi LESSON 14: Read  User Input From the Serial Monitor" },

    /* ── Chương 8 — Định thời & ngắt ── */
    "iot102-millis": { yt: "hD3cR25MbW8", credit: "Programming Electronics Academy — Doing multiple timed things with Arduino: Unleash the millis()!" },
    "iot102-ngat-ngoai": { yt: "wIcC8-g9Lnw", credit: "DroneBot Workshop — Understanding Arduino Interrupts | Hardware, Pin Change & Timer Interrupts" },
    "iot102-timer-interrupt": { yt: "2kr5A350H7E", credit: "SparkFun Electronics — Level Up Your Arduino Code: Timer Interrupts" },

    /* ── Chương 9 — Bộ nhớ EEPROM ── */
    "iot102-eeprom": { yt: "ShqvATqXA7g", credit: "DroneBot Workshop — Using EEPROM with Arduino - Internal & External" },

    /* ── Chương 10 — Bảo mật IoT ── */
    "iot102-bao-mat-phong-ve": { yt: "7zWVxrjjIpE", credit: "IBM Technology — Securing Your IoT Devices" },

    /* ── Phụ lục — Nâng cao ── */
    "iot102-nang-cao": { yt: "xPlN_Tk3VLQ", credit: "DroneBot Workshop — Introduction to ESP32 - Getting Started" },
  },
};

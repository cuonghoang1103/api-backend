/**
 * YouTube track cho PEB301 — Practice of Embedded System. Mục tự động: scripts/yt-tu-dong.mjs (phát được khi nhúng, có phụ đề EN ⇒ tự dịch VI).
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/peb301-practice-of-embedded-system.mjs
 */
export default {
  courseSlug: "peb301-practice-of-embedded-system",
  defaultVideoTrack: "YT",
  lessons: {
    "peb301-2-1-button-interrupt": { yt: "oJc0seuBbzI", credit: "Hexnbit — Tutorial 11: LAB - External Interrupt ( EXTI ) Interfacing in STM32 using STM32CUBEMX" },
    "peb301-4-1-timer-pwm": { yt: "iXWyISYmeQ0", credit: "BINARYUPDATES — Generate PWM Signal in STM32 Microcontroller- Brightness Control of LED" },
    "peb301-6-1-i2c-spi": { yt: "IyGwvGzrqp8", credit: "Electronoobs — Serial Communications Explained: UART, I2C, and SPI" },
    "peb301-7-1-freertos": { yt: "siQTCJ2t5v4", credit: "ControllersTech — STM32 CMSIS-RTOS (Part 1): FreeRTOS Setup, Tasks & Scheduler Explained" },
  },
};

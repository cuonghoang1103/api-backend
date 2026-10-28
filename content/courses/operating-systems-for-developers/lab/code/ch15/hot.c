/* hot.c — một "máy chủ" giả xử lý N request, để đo bằng perf và vẽ flame graph (bài 15.2).
 * Mỗi request: parse_headers → checksum (CRC-32 từng bit, CỐ Ý chậm) → render_json → log_line.
 *   gcc -O2 -g -fno-omit-frame-pointer hot.c -o hot    ./hot 20000        (bản chậm)
 *   ./hot 20000 table                                                     (CRC tra bảng: bản đã sửa) */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <time.h>

#define NOINLINE __attribute__((noinline))
static char req[2048], out[4096];
static uint32_t T[256];

NOINLINE int parse_headers(const char *r) {          /* đếm header, tìm Content-Length */
  int n = 0;
  for (const char *p = r; *p; p++) if (*p == '\n') n++;
  return n + (strstr(r, "Content-Length") != NULL);
}
NOINLINE uint32_t crc_bitwise(const unsigned char *p, size_t n) {   /* 8 vòng cho MỖI byte */
  uint32_t c = 0xFFFFFFFFu;
  for (size_t i = 0; i < n; i++) {
    c ^= p[i];
    for (int k = 0; k < 8; k++) c = (c >> 1) ^ (0xEDB88320u & -(c & 1));
  }
  return ~c;
}
NOINLINE uint32_t crc_table(const unsigned char *p, size_t n) {     /* 1 lần tra bảng mỗi byte */
  uint32_t c = 0xFFFFFFFFu;
  for (size_t i = 0; i < n; i++) c = T[(c ^ p[i]) & 0xFF] ^ (c >> 8);
  return ~c;
}
static int use_table = 0;
NOINLINE uint32_t checksum(const char *r) {
  size_t n = strlen(r);
  return use_table ? crc_table((const unsigned char *)r, n) : crc_bitwise((const unsigned char *)r, n);
}
NOINLINE int fmt_number(char *dst, long v) { return sprintf(dst, "%ld", v); }
NOINLINE int render_json(char *dst, int hdrs, uint32_t crc) {
  int k = sprintf(dst, "{\"headers\":%d,\"crc\":\"%08x\",\"items\":[", hdrs, crc);
  for (int i = 0; i < 40; i++) { k += fmt_number(dst + k, (long)crc * i % 99991); dst[k++] = ','; }
  dst[k - 1] = ']'; dst[k++] = '}'; dst[k] = 0;
  return k;
}
static unsigned long logged;
NOINLINE void log_line(int len) { logged += (unsigned)len; }

NOINLINE void handle(void) {
  int h = parse_headers(req);
  uint32_t c = checksum(req);
  log_line(render_json(out, h, c));
}

int main(int argc, char **argv) {
  long n = argc > 1 ? atol(argv[1]) : 20000;
  use_table = argc > 2 && !strcmp(argv[2], "table");
  for (uint32_t i = 0; i < 256; i++) { uint32_t c = i; for (int k = 0; k < 8; k++) c = (c >> 1) ^ (0xEDB88320u & -(c & 1)); T[i] = c; }
  int k = sprintf(req, "POST /orders HTTP/1.1\nHost: api\nContent-Type: application/json\nContent-Length: 1400\n\n");
  while (k < 1500) req[k++] = 'a' + k % 26;
  req[k] = 0;
  struct timespec a, b; clock_gettime(CLOCK_MONOTONIC, &a);
  for (long i = 0; i < n; i++) handle();
  clock_gettime(CLOCK_MONOTONIC, &b);
  double ms = (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
  printf("%ld requests, crc=%s: %.0f ms (%.1f us/request), logged %lu bytes\n", n, use_table ? "table" : "bitwise", ms, ms * 1000 / n, logged);
  return 0;
}

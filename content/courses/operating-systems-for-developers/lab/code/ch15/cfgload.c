/* cfgload.c — "dịch vụ" tìm tệp cấu hình ở ba chỗ, không thấy thì LẶNG LẼ dùng mặc định (bài 15.5).
 * Triệu chứng: "tôi đã sửa config mà dịch vụ không đổi gì". opensnoop -x cho thấy nó đi tìm ở đâu.  gcc cfgload.c -o cfgload */
#include <stdio.h>
#include <unistd.h>
int main(void) {
  const char *paths[] = { "/etc/orders/config.yaml", "/root/.config/orders/config.yaml", "./config.yml" };
  for (int round = 0; round < 3; round++) {
    const char *used = NULL;
    for (int i = 0; i < 3; i++) { FILE *f = fopen(paths[i], "r"); if (f) { used = paths[i]; fclose(f); break; } }
    printf("config: %s\n", used ? used : "not found, using built-in defaults (port 8080, pool 4)");
    sleep(1);
  }
  return 0;
}

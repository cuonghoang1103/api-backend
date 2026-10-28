// bind80.c — binding a port below 1024 is a privileged action. Instead of running the whole
// program as root, give the binary ONE capability: CAP_NET_BIND_SERVICE.
#include <stdio.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <unistd.h>
int main(void) {
    int s = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in a; memset(&a, 0, sizeof a);
    a.sin_family = AF_INET; a.sin_port = htons(80); a.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    if (bind(s, (struct sockaddr *)&a, sizeof a) != 0) { perror("bind 127.0.0.1:80"); return 1; }
    printf("bound 127.0.0.1:80 as uid=%d euid=%d — no root needed\n", getuid(), geteuid());
    close(s);
    return 0;
}

# net-lab — phòng lab của khoá "Networking for Developers" (cuongthai.com/courses/networking-for-developers).
# Một máy Linux THẬT vứt đi được, đủ đồ nghề mạng của lập trình viên: dig, curl, tcpdump, tshark (Wireshark dòng lệnh),
# mtr, traceroute, arping, openssl, ss/ip, socat, ncat, nginx, iperf3, Node 22, Python 3. Mọi lệnh + output của khoá
# chạy trong ảnh này (hoặc trên chính máy học viên khi lệnh đó cần Internet thật: curl/dig tới cuongthai.com).
#
#   docker build -t net-lab .                                  # ~3–5 phút lần đầu
#   docker run -it --rm --name net-lab --hostname netlab --cap-add NET_ADMIN --cap-add NET_RAW net-lab
#   # bắt gói: NET_RAW (Docker cho sẵn) · sửa route / ethtool / đổi MAC: thêm NET_ADMIN — KHÔNG cần --privileged
#   docker compose -f lab/moi-truong/compose.yml up -d         # hai mạng ảo + router + nginx + API (bài 0.1, Chương 1)
#
# Luật: chỉ bắt gói/quét trên máy, container và mạng ảo CỦA CHÍNH BẠN (hoặc cuongthai.com). Không quét host người khác.
# Ảnh gốc ghim DIGEST (cùng ảnh nền với khoá OS — Ubuntu 26.04.1 LTS): máy soạn Apple Silicon ⇒ arm64.
FROM node:22-bookworm@sha256:63538dfe497cc29dfafdda25ada09b46db68a3f4cc205abf1f5d6bf0913f3384 AS node

FROM eclipse-temurin:21-jdk@sha256:23cc5734ff46e776f51ce66eb9ee08444fd47caabec0a95b7eb6e94be2d3696d
ENV DEBIAN_FRONTEND=noninteractive LANG=C.UTF-8 LC_ALL=C.UTF-8 TZ=Asia/Ho_Chi_Minh
RUN echo 'wireshark-common wireshark-common/install-setuid boolean false' | debconf-set-selections \
 && apt-get update && apt-get install -y --no-install-recommends \
      iproute2 iputils-ping iputils-arping iputils-tracepath traceroute mtr-tiny \
      bind9-dnsutils curl ca-certificates openssl tcpdump tshark \
      netcat-openbsd ncat socat iptables ethtool iperf3 conntrack \
      nginx-light python3 jq xxd bsdextrautils procps psmisc lsof bash coreutils less vim-tiny tzdata \
 && ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && echo Asia/Ho_Chi_Minh > /etc/timezone \
 && rm -rf /var/lib/apt/lists/*

# Node.js 22 + npm (máy chủ API tí hon của lab)
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
 && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# phien FILE.sh — chạy một kịch bản như người gõ từng lệnh (in "$ lệnh" rồi output thật) — cách khoá ghi output.
COPY phien.sh /usr/local/bin/phien
RUN chmod +x /usr/local/bin/phien && mkdir -p /lab && chmod 1777 /lab \
 && printf 'PS1="\\[\\e[32m\\]\\u@\\h\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\]\\$ "\n' >> /etc/bash.bashrc
WORKDIR /lab
CMD ["bash"]

# os-lab — phòng lab của khoá "Operating Systems for Developers" (cuongthai.com/courses/operating-systems-for-developers).
# Một máy Linux THẬT vứt đi được: gcc/gdb/strace/ltrace/valgrind/perf, procps/sysstat/htop/stress-ng, Java 21, Node 22,
# Python 3 — mọi lệnh và output trong khoá đều chạy trong ảnh này.
#
#   docker build -t os-lab .                                  # ~3–6 phút lần đầu, ~1,6 GB
#   docker run -it --rm --name os-lab --hostname oslab os-lab   # vào phòng lab (root, thư mục /lab)
#   docker run -it --rm --name os-lab --hostname oslab --cpus 2 --memory 1g os-lab  # giới hạn như một VPS nhỏ
#   # Chương namespaces/cgroups/bảo mật cần thêm quyền — CHỈ cho container vứt đi này, không bao giờ cho app thật:
#   docker run -it --rm --privileged --security-opt seccomp=unconfined --name os-lab-priv os-lab
#
# perf: từ Ubuntu 26.04 nằm trong gói linux-perf (không còn trong linux-tools-*). Trên Docker Desktop perf cần
#   --privileged (hoặc --cap-add PERFMON) và thường chỉ có sự kiện phần mềm (cpu-clock, task-clock) — máy Linux thật đủ hơn.
# Ảnh gốc ghim DIGEST: eclipse-temurin:21-jdk = Ubuntu 26.04.1 LTS + Temurin 21.0.12.1 (máy soạn bài Apple Silicon ⇒
# arm64; máy x86-64 tự lấy bản amd64 của cùng manifest list). Node 22 chép nguyên từ ảnh node:22-bookworm.
FROM node:22-bookworm@sha256:63538dfe497cc29dfafdda25ada09b46db68a3f4cc205abf1f5d6bf0913f3384 AS node

FROM eclipse-temurin:21-jdk@sha256:23cc5734ff46e776f51ce66eb9ee08444fd47caabec0a95b7eb6e94be2d3696d
ENV DEBIAN_FRONTEND=noninteractive LANG=C.UTF-8 LC_ALL=C.UTF-8 TZ=Asia/Ho_Chi_Minh
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential gcc g++ make gdb strace valgrind binutils elfutils file \
      procps psmisc util-linux iproute2 iputils-ping lsof sysstat htop stress-ng hyperfine \
      libcap2-bin acl attr kmod e2fsprogs busybox-static \
      python3 bash coreutils findutils tree bc time less nano vim-tiny \
      man-db manpages manpages-dev netcat-openbsd curl ca-certificates tzdata sudo \
 && (apt-get install -y --no-install-recommends ltrace || echo "ltrace: không có bản cho $(dpkg --print-architecture)") \
 && (apt-get install -y --no-install-recommends linux-perf || echo "perf: bỏ qua") \
 && ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && echo Asia/Ho_Chi_Minh > /etc/timezone \
 && rm -rf /var/lib/apt/lists/*

# Node.js 22 + npm
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
 && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# phien FILE.sh — chạy một kịch bản như người gõ từng lệnh (in "$ lệnh" rồi output thật) — cách khoá ghi output.
COPY phien.sh /usr/local/bin/phien
# Người dùng thường "dev" (uid 1001, không sudo) cho các bài về quyền; root vẫn là mặc định.
RUN chmod +x /usr/local/bin/phien \
 && useradd -m -u 1001 -s /bin/bash dev \
 && mkdir -p /lab && chmod 1777 /lab \
 && printf 'PS1="\\[\\e[32m\\]\\u@oslab\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\]\\$ "\n' >> /etc/bash.bashrc
WORKDIR /lab
CMD ["bash"]

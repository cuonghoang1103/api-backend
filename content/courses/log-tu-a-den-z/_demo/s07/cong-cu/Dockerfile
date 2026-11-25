# lgz-qemu: chạy MÁY ẢO Ubuntu 24.04 thật (KVM) cho Chương 7–8 khoá log (journald, nhân, OOM, nhiều lần khởi động)
FROM ubuntu:24.04
LABEL lgz=1
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends qemu-system-x86 qemu-utils cloud-image-utils openssh-client ca-certificates && rm -rf /var/lib/apt/lists/*

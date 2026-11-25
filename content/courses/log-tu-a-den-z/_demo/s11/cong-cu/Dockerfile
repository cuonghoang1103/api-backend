# lgz-qemu:2 — như lgz-qemu:1 (Ch7–8) + iproute2 để dựng cầu LAN ảo (tap) cho Chương 11: router OpenWrt thật + máy Ubuntu + máy Windows trên một LAN.
FROM ubuntu:24.04
LABEL lgz=1
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends qemu-system-x86 qemu-utils cloud-image-utils genisoimage openssh-client ca-certificates iproute2 tcpdump socat iputils-ping && rm -rf /var/lib/apt/lists/*

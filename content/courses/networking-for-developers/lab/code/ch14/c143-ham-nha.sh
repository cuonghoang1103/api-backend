# 14.3 · nft-nha: máy nhà TỰ đào đường hầm ra VPS (kết nối ĐI RA thì NAT nào cũng cho) và tự nối lại khi rớt
AUTOSSH_GATETIME=0 AUTOSSH_LOGFILE=/tmp/autossh.log autossh -M 0 -f -N -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=accept-new -R 2222:localhost:22 tunnel@vps.example
@ sleep 2
pgrep -a autossh; pgrep -a -x ssh

#!/bin/bash
# chuan-bi-vpn.sh — chạy TRÊN lab7 (sudo): khoá WireGuard cho lab7 + android + một khoá "lạ" cho keodo; PKI OpenVPN bằng easy-rsa
# (CA, máy chủ, chứng chỉ android, chứng chỉ keodo rồi THU HỒI keodo — như nhân viên đã nghỉ việc). Mọi thứ trong /root/vpn-lab.
set -e; umask 077; D=/root/vpn-lab; rm -rf $D; mkdir -p $D; cd $D
for m in lab7 android keodo; do wg genkey | tee $m.key | wg pubkey > $m.pub; done
cp -r /usr/share/easy-rsa pki-goc; cd pki-goc; export EASYRSA_BATCH=1
./easyrsa init-pki >/dev/null 2>&1; EASYRSA_REQ_CN=lab-ca ./easyrsa build-ca nopass >/dev/null 2>&1
./easyrsa build-server-full server nopass >/dev/null 2>&1
./easyrsa build-client-full android nopass >/dev/null 2>&1; ./easyrsa build-client-full keodo nopass >/dev/null 2>&1
P=$D/pki-goc/pki; cp $P/ca.crt $P/issued/server.crt $P/private/server.key /etc/openvpn/server/
for c in android keodo; do { echo "client"; echo "dev tun"; echo "proto udp"; echo "remote 192.168.56.10 1194"; echo "nobind"; echo "verb 3"; echo "<ca>"; cat $P/ca.crt; echo "</ca>"; echo "<cert>"; sed -n '/BEGIN/,/END/p' $P/issued/$c.crt; echo "</cert>"; echo "<key>"; cat $P/private/$c.key; echo "</key>"; } > $D/$c.ovpn; done
./easyrsa revoke keodo >/dev/null 2>&1; ./easyrsa gen-crl >/dev/null 2>&1; cp $P/crl.pem /etc/openvpn/server/; chmod 644 /etc/openvpn/server/crl.pem
echo "đã tạo khoá WireGuard + PKI OpenVPN"

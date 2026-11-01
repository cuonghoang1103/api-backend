#!/bin/bash
# ky.sh all | <vùng> — ký DNSSEC các vùng của lab Chương 3 vào volume chung /dnsz (máy nfi-dnsinit chạy "all" một lần lúc dựng).
#   all          : chép mẫu vùng (dns/vung/*.zone ⇒ /dnsz/src), sinh khoá ECDSA P-256 (KSK + ZSK) nếu chưa có, rồi ký theo thứ tự
#                  CON TRƯỚC CHA: labflow.test ⇒ DS vào vùng test ⇒ ký test ⇒ DS vào vùng gốc ⇒ ký "." ⇒ /dnsz/root.ds (mỏ neo tin cậy
#                  cho resolver). cdn.test KHÔNG ký (ủy quyền "insecure"). Kèm chứng chỉ tự ký cho DoT/DoH của resolver nhà mạng.
#   lai <vùng>   : trả /dnsz/src/<vùng>.zone về mẫu gốc rồi ký lại (chạy lại kịch bản từ đầu)
#   <vùng>       : ký lại MỘT vùng từ /dnsz/src/<vùng>.zone với khoá sẵn có (serial giữ nguyên như người sửa ghi — "-N keep").
#   Biến: KY_TU / KY_DEN = thời điểm bắt đầu/hết hạn chữ ký (mặc định now-1h / now+30d) — kịch bản sự cố "chữ ký hết hạn" đặt lùi về quá khứ.
set -e
Z=/dnsz; V=/lab/k/moi-truong/dns/vung
mkdir -p $Z/keys $Z/ds $Z/src $Z/tls
cd $Z   # dnssec-signzone ghi tệp tạm ở thư mục hiện hành
tep() { [ "$1" = . ] && echo root || echo "$1"; }
ky() {
  local z=$1 f; f=$(tep "$z")
  local kz=$z; [ "$z" = . ] || kz="$z."
  if ! ls $Z/keys/K"$kz"+013+*.key >/dev/null 2>&1; then
    dnssec-keygen -q -K $Z/keys -a ECDSAP256SHA256 -n ZONE "$z" >/dev/null
    dnssec-keygen -q -K $Z/keys -a ECDSAP256SHA256 -n ZONE -f KSK "$z" >/dev/null
  fi
  # KY_DEN đặt về quá khứ ⇒ -P (bỏ bước tự kiểm sau khi ký — bước đó từ chối chữ ký hết hạn, đúng việc một tác vụ ký hỏng sẽ "bỏ qua")
  dnssec-signzone -q -S ${KY_DEN:+-P} -K $Z/keys -N keep -s "${KY_TU:-now-3600}" -e "${KY_DEN:-now+2592000}" \
    -o "$z" -f $Z/$f.signed $Z/src/$f.zone >/dev/null
  local ksk; ksk=$(grep -l 'key-signing key' $Z/keys/K"$kz"+013+*.key | head -1)
  dnssec-dsfromkey -a SHA-256 "$ksk" > $Z/ds/$f.ds
  chmod 644 $Z/*.signed $Z/ds/*.ds
}
if [ "$1" = all ]; then
  for f in root test labflow.test; do [ -s $Z/src/$f.zone ] || cp $V/$f.zone $Z/src/$f.zone; done
  touch $Z/ds/test.ds $Z/ds/labflow.test.ds
  ky labflow.test; ky test; ky .
  cp $Z/ds/root.ds $Z/root.ds
  # cùng mỏ neo ở dạng của delv/named (trust-anchors { … }): delv -a /dnsz/anchor.conf
  awk '{ printf "trust-anchors { . static-ds %s %s %s \"%s\"; };\n", $4, $5, $6, $7 }' $Z/root.ds > $Z/anchor.conf
  if [ ! -s $Z/tls/isp.pem ]; then
    openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -days 30 -subj /CN=resolver.isp.test \
      -addext subjectAltName=DNS:resolver.isp.test,IP:198.51.100.1 -keyout $Z/tls/isp.key -out $Z/tls/isp.pem 2>/dev/null
    chmod 644 $Z/tls/isp.key $Z/tls/isp.pem
  fi
  echo "dnsinit: đã ký labflow.test, test, . — mỏ neo $(awk '{print $4}' $Z/root.ds | head -1)"
elif [ "$1" = lai ]; then
  cp $V/$(tep "$2").zone $Z/src/$(tep "$2").zone; ky "$2"
else
  ky "$1"
fi

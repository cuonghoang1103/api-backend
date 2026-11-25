# BASH_ENV cho proxy.bash: "khach IP curl-args…" = chạy curl 8.11.1 từ một container mang đúng IP nguồn đó trong mạng lab lgz-c13p
# (.101 = khách thật, .66 = kẻ tấn công). Ngoài lab, đây chỉ là "curl … từ máy có IP đó".
khach() { docker run --rm --network lgz-c13p --ip "$1" curlimages/curl:8.11.1 -s "${@:2}"; }

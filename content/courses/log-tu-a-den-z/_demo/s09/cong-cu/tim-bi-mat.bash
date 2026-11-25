# tim-bi-mat.bash <tệp.har> — đếm những thứ trông như bí mật trong một tệp HAR (bài 9.3, Lab 9). Không in gì = sạch theo các mẫu này.
jq -c . "$1" | grep -oiE 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*|\\"password\\":\\"[^\\[][^\\]*|token=[A-Za-z0-9_-]{6}|sid=[A-Za-z0-9_]+|"name":"(authorization|cookie|set-cookie)","value":"[^["]' \
  | cut -c1-40 | sort | uniq -c | sort -rn

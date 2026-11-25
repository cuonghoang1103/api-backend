# netlog-url.jq — mỗi URL_REQUEST một dòng: URL, kết quả cuối cùng (OK hay tên lỗi), thời gian sống của request
(.constants.logEventTypes | to_entries | map({key: (.value|tostring), value: .key}) | from_entries) as $loai
| (.constants.netError | to_entries | map({key: (.value|tostring), value: .key}) | from_entries) as $loi
| [.events[] | select(.source.type == $ARGS.named.u)] | group_by(.source.id)[]
| (map(select($loai[.type|tostring] == "URL_REQUEST_START_JOB" and .phase == 1)) | first | .params.url) as $url
| (map(select($loai[.type|tostring] == "REQUEST_ALIVE" and .phase == 2)) | first) as $het
| select($url != null and ($url|startswith("http")))
| [ $url, ($loi[($het.params.net_error // 0)|tostring] // "OK"), "\(($het.time|tonumber) - (.[0].time|tonumber)) ms" ] | @tsv

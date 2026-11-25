# netlog-loi.jq — in mọi sự kiện NetLog mang mã lỗi (net_error), kèm tên lỗi, loại sự kiện, nguồn và giờ tương đối
# dùng: jq -r -f netlog-loi.jq netlog.json
(.constants.logEventTypes | to_entries | map({key: (.value|tostring), value: .key}) | from_entries) as $loai
| (.constants.logSourceType | to_entries | map({key: (.value|tostring), value: .key}) | from_entries) as $nguon
| (.constants.netError | to_entries | map({key: (.value|tostring), value: .key}) | from_entries) as $loi
| (.events[0].time | tonumber) as $t0
| .events[]
| select(.params.net_error? != null)
| [ "+\((.time|tonumber) - $t0)ms", $nguon[.source.type|tostring] + "#\(.source.id)", $loai[.type|tostring],
    $loi[.params.net_error|tostring], (.params.host // .params.url // .params.address // "") ]
| @tsv

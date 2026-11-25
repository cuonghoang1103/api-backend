# 15.5 — Kibana 9.5.7 giấy phép Basic (miễn phí): loại luật cảnh báo và loại "connector" (kênh gửi) nào dùng được
curl -s -u elastic:$ELASTIC_PASSWORD localhost:45601/api/alerting/rule_types | jq -r '.[] | select(.id|test("es-query|logs.alert|index-threshold")) | "\(.id)\t\(.minimum_license_required)\t\(.name)"'
curl -s -u elastic:$ELASTIC_PASSWORD localhost:45601/api/actions/connector_types | jq -r '.[] | select(.id|test("^\\.(server-log|index|webhook|email|slack|teams|pagerduty)$")) | "\(.id)\t\(.minimum_license_required)\tdùng được=\(.enabled_in_license)"'

# Nạp qua BASH_ENV cho elk.bash. es = curl tới Elasticsearch (trong netns lab). kql = gõ KQL vào Kibana Discover thật.
es() { docker exec lgz-c15e-es curl -s -u elastic:$ELASTIC_PASSWORD -H 'content-type: application/json' "127.0.0.1:9200/$1" "${@:2}"; }
kql() { (cd ${LAB15_TMP:-$HOME/.lab15}/pw && node kql.mjs "$@"); }

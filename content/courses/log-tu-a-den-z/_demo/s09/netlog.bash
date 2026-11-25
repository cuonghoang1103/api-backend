node netlog.mjs netlog.json
ls -l netlog.json | awk '{print $5, "byte"}'; jq '.events | length' netlog.json
jq '.constants.clientInfo | {name, version, os_type}' netlog.json
jq -r --argjson u "$(jq .constants.logSourceType.URL_REQUEST netlog.json)" -f netlog-url.jq netlog.json | sed -E 's/\?[^\t]*/?…/'
jq -r -f netlog-loi.jq netlog.json | cut -f4 | sort | uniq -c | sort -rn
jq -r -f netlog-loi.jq netlog.json | grep -E 'CERT|URL_REQUEST.*NAME_NOT|TCP_CONNECT|URL_REQUEST.*REFUSED' | head -n 12
jq -r -f netlog-loi.jq netlog.json | grep UNREACHABLE | head -n 2
jq -r '.constants.clientInfo.command_line' netlog.json | grep -o -- '--log-net-log=[^ ]*' | sed -E 's#/home/[^/]+#/home/<ten-nguoi-dung>#'
grep -o '"self_address":"[0-9.]*' netlog.json | sort -u | sed -E 's/[0-9]+$/x/'
jq -c '.constants.netError | {ERR_FAILED, ERR_ABORTED, ERR_BLOCKED_BY_CLIENT, ERR_CONNECTION_RESET, ERR_CONNECTION_REFUSED, ERR_NAME_NOT_RESOLVED, ERR_INTERNET_DISCONNECTED, ERR_SSL_PROTOCOL_ERROR, ERR_ADDRESS_UNREACHABLE, ERR_TUNNEL_CONNECTION_FAILED, ERR_CONNECTION_TIMED_OUT, ERR_PROXY_CONNECTION_FAILED, ERR_CERT_COMMON_NAME_INVALID, ERR_CERT_DATE_INVALID, ERR_CERT_AUTHORITY_INVALID}' netlog.json
jq -r --argjson t "$(jq .constants.logEventTypes.SSL_CERTIFICATES_RECEIVED netlog.json)" '[.events[] | select(.type == $t)][0].params.certificates[0]' netlog.json | openssl x509 -noout -subject -issuer -dates

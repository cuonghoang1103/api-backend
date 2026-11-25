# che-har.jq — làm sạch tệp HAR trước khi gửi đi (bài 9.3). Dùng: jq -f che-har.jq vao.har > ra.har
# Che: header nhạy cảm, mảng cookies, tham số URL nhạy cảm, trường nhạy cảm trong body JSON/form, mọi chuỗi trông như JWT.
def nhay: test("^(authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|x-csrf-token)$"; "i");
def thamso: test("^(token|access_token|id_token|code|password|pass|key|api_key|secret|session|sid)$"; "i");
def jwt: gsub("eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]*"; "[JWT-DA-CHE]");
def chebody: jwt
  | gsub("\"(?<k>password|pass|token|access_token|refresh_token|secret|otp)\"\\s*:\\s*\"[^\"]*\""; "\"\(.k)\":\"[DA-CHE]\""; "i")
  | gsub("(?<k>(password|token|otp)=)[^&]*"; "\(.k)[DA-CHE]"; "i");
def cheurl: gsub("(?<k>[?&](token|access_token|id_token|code|password|key|api_key|secret|sid)=)[^&#]*"; "\(.k)[DA-CHE]"; "i");
.log.entries |= map(
    .request.headers |= map(if (.name|nhay) then .value = "[DA-CHE]" else . end)
  | .response.headers |= map(if (.name|nhay) then .value = "[DA-CHE]" else . end)
  | .request.cookies = [] | .response.cookies = []
  | .request.url |= cheurl
  | .request.queryString |= map(if (.name|thamso) then .value = "[DA-CHE]" else . end)
  | if .request.postData.text then .request.postData.text |= chebody else . end
  | if .response.content.text then .response.content.text |= chebody else . end
  | if .response.redirectURL then .response.redirectURL |= cheurl else . end
)
| .log.pages |= map(.title |= jwt)

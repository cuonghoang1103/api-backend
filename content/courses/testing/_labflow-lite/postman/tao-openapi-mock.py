# Thêm requestBody + ví dụ vào openapi.json ⇒ postman/openapi-mock.json (để mock có dữ liệu giống thật)
import json
o=json.load(open('openapi.json'))
ex_b={"id":1,"lab":"BE-201","date":"2026-12-01","start":"09:00","end":"11:00","seats":20,"status":"CONFIRMED","minutes":120}
o['paths']['/api/health']={"get":{"summary":"Is the API up?","responses":{"200":{"description":"OK","content":{"application/json":{"schema":{"type":"object","required":["status"],"properties":{"status":{"enum":["ok"]}}},"example":{"status":"ok"}}}}}}}
post=o['paths']['/api/bookings']['post']
t={"type":"string","pattern":"^([01][0-9]|2[0-3]):[0-5][0-9]$"}
post['requestBody']={"required":True,"content":{"application/json":{"schema":{"type":"object","additionalProperties":False,"required":["lab","date","start","end","seats"],"properties":{"lab":{"type":"string","pattern":"^[A-Z]{2}-[0-9]{3}$"},"date":{"type":"string","format":"date"},"start":t,"end":t,"seats":{"type":"integer","minimum":1,"maximum":200}}}}}}
r=post['responses']
r['201']['content']['application/json']['example']=ex_b
r['201']['headers']={"Location":{"schema":{"type":"string"},"example":"/api/bookings/1"}}
for code,ex in [('409',{"error":{"code":"OVERLAP"}}),('422',{"error":{"code":"OFF_GRID"}}),('400',{"error":{"code":"VALIDATION","details":[{"path":"seats","message":"Too big: expected number to be <=200"}]}}),('401',{"error":{"code":"UNAUTHENTICATED"}})]:
    r[code]['content']['application/json']['example']=ex
g=o['paths']['/api/bookings/{id}']['get']['responses']
g['200']['content']['application/json']['example']=ex_b
g['404']['content']['application/json']['example']={"error":{"code":"NOT_FOUND"}}
for p,m in o['paths'].items():
    for op in m.values(): op['security']=[] if p=='/api/health' else [{"bearer":[]}]
o['components']['securitySchemes']={"bearer":{"type":"http","scheme":"bearer","bearerFormat":"JWT"}}
json.dump(o,open('postman/openapi-mock.json','w'),indent=2)
print('wrote postman/openapi-mock.json')

// webhooks/reserialize.mjs — bài 10.6: vì sao phải kiểm chữ ký trên BODY THÔ. Một bên gửi viết bằng Python (json.dumps mặc định:
// thoát ký tự ngoài ASCII thành \uXXXX, có dấu cách sau ":" và ","). Bên nhận dùng express.json() rồi JSON.stringify lại để kiểm.
import { sign } from '../src/webhooks.js';
const secret = 'whsec_' + Buffer.from('khoa-hoc-tap-chi-de-minh-hoa!').toString('base64');
const raw = '{"type": "labflow.booking.created.v1", "data": {"labName": "Ph\\u00f2ng Lab M\\u1ea1ng"}}';   // đúng byte trên dây
const again = JSON.stringify(JSON.parse(raw));
console.log('body thô        :', raw);
console.log('parse + stringify:', again);
const s1 = sign(secret, 'msg_1', 1793500000, raw), s2 = sign(secret, 'msg_1', 1793500000, again);
console.log(`chữ ký trên body thô ${s1.slice(0, 14)}… · trên bản dựng lại ${s2.slice(0, 14)}… ⇒ ${s1 === s2 ? 'KHỚP' : 'LỆCH'}`);

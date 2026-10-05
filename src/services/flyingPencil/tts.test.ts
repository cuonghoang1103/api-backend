import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chuanHoa, taoSsml, choPhep } from './tts.service.js';

test('chuanHoa: chặn giọng/style lạ, kẹp tốc độ', () => {
  assert.throws(() => chuanHoa({ text: 'x', voice: 'en-US-Nope' }), /Giọng không hợp lệ/);
  assert.throws(() => chuanHoa({ text: 'x', voice: 'en-US-DavisNeural', style: 'dance' }), /Style không hợp lệ/);
  assert.throws(() => chuanHoa({ text: '', voice: 'en-US-DavisNeural' }), /Thiếu chữ/);
  const y = chuanHoa({ text: 'Fire in the hole!', voice: 'en-US-DavisNeural', style: 'shouting', rate: 9 });
  assert.equal(y.rate, 1.5);
});
test('taoSsml: escape XML + express-as khi có style', () => {
  const s = taoSsml(chuanHoa({ text: 'Tanks <left> & "right"', voice: 'en-US-DavisNeural', style: 'shouting', styledegree: 2 }));
  assert.match(s, /mstts:express-as style="shouting" styledegree="2"/);
  assert.match(s, /Tanks &lt;left&gt; &amp; &quot;right&quot;/);
  assert.match(s, /xml:lang="en-US"/);
  const v = taoSsml(chuanHoa({ text: 'Năm 1939.', voice: 'vi-VN-NamMinhNeural', rate: 0.92 }));
  assert.doesNotMatch(v, /express-as/);
  assert.match(v, /rate="-8%"/);
});
test('choPhep: bot studio + admin', () => {
  assert.equal(choPhep(151, false), true);
  assert.equal(choPhep(7, false), false);
  assert.equal(choPhep(7, true), true);
});

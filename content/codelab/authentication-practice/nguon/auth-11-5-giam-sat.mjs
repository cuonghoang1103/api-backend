/** Authentication · 11.5 — Six signals and the runbook; write triage(). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '11.5-1 — Signals and the runbook', kho: 'EASY', phut: 8,
  en: 'Watch six signals, each a number with a threshold; the runbook routes each to page, investigate, auto or ignore.',
  vi: 'Giám sát sáu tín hiệu, mỗi cái một con số với một ngưỡng; runbook định tuyến mỗi cái tới page, investigate, auto hay ignore.',
  cau: [
    q('c1', ['Monitoring fires a refresh-reuse spike. What should the runbook do?', 'Giám sát nổ một đợt tái-dùng-refresh. Runbook nên làm gì?'],
      ['Page the on-call now — replayed refresh tokens are an active session-theft campaign that needs a human this minute', 'Ignore it entirely, since a spike of refresh-token reuse is just normal, expected background noise', 'Auto-record it and move on, because the credential-stuffing defence has already handled the whole thing', 'Investigate it on the next business day, treating it as a routine low-priority housekeeping item'],
      ['Refresh-reuse is stolen tokens being replayed (Ch5); it is one of the two page-worthy signals (11.5).', 'Tái-dùng-refresh là token bị trộm đang phát lại (Ch5); nó là một trong hai tín hiệu đáng-page (11.5).']),
    q('c2', ['Your runbook pages the on-call on every signal, including routine admin actions. What is the risk?', 'Runbook của bạn page người trực mọi tín hiệu, gồm cả hành động admin thường lệ. Rủi ro là gì?'],
      ['Alert fatigue — the on-call tunes out the pager and misses the one real alert; it is the Ch10 fatigue attack on your team', 'The physical pager hardware will eventually wear out from receiving far too many notifications a day', 'The audit log fills up with page events until the log store runs out of disk space and stops writing', 'Nothing is wrong with this at all — more alerts always and everywhere mean more safety for the service'],
      ['Paging on everything trains the team to ignore the pager; page only for a human-now (11.5, 10.4).', 'Page mọi thứ huấn luyện đội lờ chuông; page chỉ cho việc-cần-người-ngay (11.5, 10.4).']),
    q('c3', ['A brand-new signal nobody has classified fires. What is the safe default?', 'Một tín hiệu hoàn toàn mới chưa ai phân loại nổ. Mặc định an toàn là gì?'],
      ['Investigate — give it a human look, never silently ignore; the unplanned signal is the one worth seeing', 'Ignore it, because it has no runbook entry yet', 'Page immediately, to be maximally cautious about everything', 'Auto-record it and move on without any human review'],
      ['triage() defaults the unknown to investigate; fail toward attention (11.5).', 'triage() mặc định cái lạ là investigate; hỏng về phía chú ý (11.5).']),
  ],
  goiY: [['Only two signals are worth waking someone for.', 'Chỉ hai tín hiệu đáng đánh thức ai đó.'], ['The unknown leans toward a human look.', 'Cái lạ nghiêng về một cái nhìn của con người.']],
  loi: [['Paging on routine signals.', 'Page các tín hiệu thường lệ.'], ['Ignoring an unknown signal.', 'Bỏ qua một tín hiệu lạ.']],
  tns: [tn('runbook', 'runbook'), tn('alert fatigue', 'mệt mỏi cảnh báo')],
  kn: ['authentication'],
});

const RUNBOOK = { refresh_reuse_spike: 'page', failed_login_burst: 'auto', new_country_logins: 'investigate', error_5xx_spike: 'page', breached_pw_rate: 'investigate', admin_action: 'auto' };
function triage(signal) {
  // Route a monitoring signal to a runbook action. A nameless signal is a pipeline bug ⇒ ignore; an unknown
  // NAME gets a human look ⇒ investigate (never silently ignore the signal you did not plan for).
  const name = signal && signal.name;
  if (!name) return 'ignore';
  return RUNBOOK[name] || 'investigate';
}
const S2 = jsBai({
  ten: '11.5-2 — Write triage(signal): the runbook as a function', kho: 'MEDIUM', phut: 10,
  en: `<p>Route a signal to <code>'page'</code>, <code>'investigate'</code>, <code>'auto'</code> or <code>'ignore'</code> from <code>signal.name</code>: <code>refresh_reuse_spike</code> / <code>error_5xx_spike</code> ⇒ <code>page</code>; <code>failed_login_burst</code> / <code>admin_action</code> ⇒ <code>auto</code>; <code>new_country_logins</code> / <code>breached_pw_rate</code> ⇒ <code>investigate</code>. A signal with no name ⇒ <code>ignore</code>. An UNKNOWN name ⇒ <code>investigate</code> (never silently ignore a signal nobody classified).</p>`,
  vi: `<p>Định tuyến một tín hiệu tới <code>'page'</code>, <code>'investigate'</code>, <code>'auto'</code> hay <code>'ignore'</code> từ <code>signal.name</code>: <code>refresh_reuse_spike</code> / <code>error_5xx_spike</code> ⇒ <code>page</code>; <code>failed_login_burst</code> / <code>admin_action</code> ⇒ <code>auto</code>; <code>new_country_logins</code> / <code>breached_pw_rate</code> ⇒ <code>investigate</code>. Một tín hiệu không tên ⇒ <code>ignore</code>. Một tên LẠ ⇒ <code>investigate</code> (không bao giờ im lặng bỏ qua một tín hiệu chưa ai phân loại).</p>`,
  goiY: [['A lookup table maps the known names; default the rest.', 'Một bảng tra ánh xạ các tên biết; mặc định phần còn lại.'], ['A nameless signal ⇒ ignore; an unknown name ⇒ investigate.', 'Một tín hiệu không tên ⇒ ignore; một tên lạ ⇒ investigate.']],
  loi: [['Returning ignore for an unknown name.', 'Trả ignore cho một tên lạ.'], ['Paging for a failed-login burst the stuffing defence handled.', 'Page cho một đợt đăng-nhập-sai mà phòng thủ nhồi đã xử lý.']],
  gt: ['The runbook is a function so the on-call policy is written down and testable; page rarely, never ignore the unknown (11.5).', 'Runbook là một hàm để chính sách trực được viết sẵn và test được; page hiếm, không bao giờ bỏ qua cái lạ (11.5).'],
  kn: ['authentication'], tns: [tn('page/investigate/auto/ignore', 'page/investigate/auto/ignore')],
  dau: `const RUNBOOK = { refresh_reuse_spike: 'page', failed_login_burst: 'auto', new_country_logins: 'investigate', error_5xx_spike: 'page', breached_pw_rate: 'investigate', admin_action: 'auto' };
/** ⇒ 'page' | 'investigate' | 'auto' | 'ignore' */
function triage(signal) {
  // Write your solution here
  return 'ignore';
}
`,
  giai: `const RUNBOOK = { refresh_reuse_spike: 'page', failed_login_burst: 'auto', new_country_logins: 'investigate', error_5xx_spike: 'page', breached_pw_rate: 'investigate', admin_action: 'auto' };
` + '// Reference solution\n' + nguon(triage),
  cases: [
    { goi: goi('triage', { name: 'refresh_reuse_spike' }), moTa: ['reuse spike ⇒ page', 'đợt tái-dùng ⇒ page'] },
    { goi: goi('triage', { name: 'failed_login_burst' }), an: true, moTa: ['already handled ⇒ auto', 'đã xử lý ⇒ auto'] },
    { goi: goi('triage', { name: 'new_country_logins' }), an: true, moTa: ['ambiguous ⇒ investigate', 'mơ hồ ⇒ investigate'] },
    { goi: goi('triage', { name: 'totally_new' }), an: true, moTa: ['unknown ⇒ investigate', 'lạ ⇒ investigate'] },
    { goi: goi('triage', {}), an: true, moTa: ['no name ⇒ ignore', 'không tên ⇒ ignore'] },
  ],
});

const S3 = cs({
  ten: '11.5-3 — Signal → action', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each signal to its runbook action.',
  vi: 'Ghép mỗi tín hiệu với hành động runbook của nó.',
  bang: [bang1('b1', ['Signal → action', 'Tín hiệu → hành động'], [{ ma: 'x', ten: 'Signal' }, { ma: 'q', ten: 'Action', luaChon: ['page', 'investigate', 'auto'] }], [
    { o: { x: 'refresh-reuse spike' }, a: { q: 'page' } },
    { o: { x: 'new-country logins' }, a: { q: 'investigate' } },
    { o: { x: 'failed-login burst' }, a: { q: 'auto' } },
  ], ['Reuse spike pages (active theft); new-country investigates; failed-login burst is auto (already throttled) (11.5).', 'Đợt tái-dùng page (trộm đang diễn ra); nước-mới investigate; đợt đăng-nhập-sai auto (đã kìm) (11.5).'])],
  goiY: [['Only the active-theft signal pages here.', 'Chỉ tín hiệu trộm-đang-diễn-ra page ở đây.'], ['The stuffing defence already handled the failed-login burst.', 'Phòng thủ nhồi đã xử lý đợt đăng-nhập-sai.']],
  loi: [['Paging on the failed-login burst.', 'Page đợt đăng-nhập-sai.'], ['Ignoring the refresh-reuse spike.', 'Bỏ qua đợt tái-dùng-refresh.']],
  tns: [tn('page', 'page')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-11-5-giam-sat', ten: '11.5 Signals & runbook', khoa: KHOA, baiHoc: 'auth-11-5-giam-sat', de: [S1, S2, S3] });

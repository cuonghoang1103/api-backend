/**
 * 6.6 — Lab: bộ giao tiếp của LabFlow (agl-6-6-lab, bài THÊM vào khung). Soạn 24/11/2026, agent agt. Mốc dự án 🛠 của Chương 6.
 * Lab chạy THẬT (scratchpad/agt/lab/ch6, chạy lại tất cả: chay-het.sh): tu-git.mjs (rút commit/merge từ git, khớp 29/29 dòng nhật ký),
 * chay-tuan.sh (gói tuần: daily + báo cáo + soát + cảnh báo; từ chối khi báo cáo trượt soát — đã thử bằng "lỗi nhỏ", mã thoát 1).
 */
import { bang, cl, note, giai, js, bash, out, ag, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L66 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lab', 'Chương 6 · Lab', `
<h2>${t('6.6 — Lab: LabFlow’s communication kit', '6.6 — Lab: bộ giao tiếp của LabFlow')}</h2>
<p class="lead">${t(
    'Put everything from this chapter into the team repo so the leader’s routine takes 20 minutes a week and does not depend on the leader’s memory or mood: a communication agreement, a planning check, a daily preparation, a Friday report that refuses to go out if it breaks the rules, and an early-warning replay.',
    'Đưa mọi thứ của chương vào repo nhóm để việc thường kỳ của trưởng nhóm mất 20 phút mỗi tuần và không phụ thuộc trí nhớ hay tâm trạng của trưởng nhóm: một thoả thuận giao tiếp, một bước soát planning, một bước chuẩn bị daily, một báo cáo thứ Sáu tự từ chối gửi đi nếu phạm luật, và một lần phát lại cảnh báo sớm.')}</p>
${note(t('You need the scripts of lessons 6.1–6.5 (all in <code>tools/nhom/</code> below), Node 22 and git. Board data comes from the CT Work CSV export of ', 'Cần các script của bài 6.1–6.5 (gom vào <code>tools/nhom/</code> dưới đây), Node 22 và git. Dữ liệu bảng lấy từ tệp CSV xuất ở CT Work, bài ') + ag('agl-2-4-ct-work', t('lesson 2.4', '2.4')) + '.')}

<h3>${t('Step 1 — The layout', 'Bước 1 — Bố cục')}</h3>
${out(`labflow/
├─ docs/giao-tiep.md              ${t('← communication agreement (lesson 6.4)', '← thoả thuận giao tiếp (bài 6.4)')}
├─ docs/hop/                      ${t('← planning, retro minutes; 1:1 notes are NOT here (private)', '← biên bản planning, retro; ghi chú 1:1 KHÔNG để ở đây (riêng tư)')}
└─ tools/nhom/
   ├─ lib.mjs  nang-luc.mjs  can-bang.mjs  standup.mjs  retro.mjs
   ├─ bao-cao-tuan.mjs  soat-bao-cao.mjs  soat-tin-nhan.mjs  canh-bao-som.mjs
   ├─ tu-git.mjs  chay-tuan.sh
   └─ du-lieu/  ticket.csv  su-kien.csv  rui-ro.csv  hanh-dong.csv  nang-luc.json  standup/`)}
${cl('warn', `<p>${t(
    '<strong>1:1 notes and anything personal stay out of the repo</strong> — every member and the supervisor can read it. Keep them in a private note shared only with the person concerned.',
    '<strong>Ghi chú 1:1 và mọi thứ riêng tư không vào repo</strong> — mọi thành viên và giảng viên đều đọc được repo. Để chúng trong ghi chú riêng, chỉ chia sẻ với đúng người liên quan.')}</p>`)}

<h3>${t('Step 2 — Where the event log comes from', 'Bước 2 — Nhật ký sự kiện lấy từ đâu')}</h3>
<p>${t(
    'In this chapter the event log was written for the simulation. In your team most of it already exists. Commits and merges come straight out of git if the team follows the commit convention of ', 'Trong chương này nhật ký sự kiện được viết cho mô phỏng. Ở nhóm bạn, phần lớn nó đã có sẵn. Commit và merge rút thẳng từ git nếu nhóm theo quy ước commit ở ') + ag('agl-3-1-quy-uoc', t('lesson 3.1', 'bài 3.1')) + t(
    ' (ticket key in every title). As a check, the extractor below was run on the repo built in lesson 6.3 and compared with the hand-written log:',
    ' (mã ticket trong mọi tiêu đề). Để kiểm, script rút dưới đây đã chạy trên repo dựng ở bài 6.3 và so với nhật ký viết tay:')}</p>
${js(MA.tuGit)}
${out('$ node tu-git.mjs /tmp/agt-lab6/labflow --so-voi du-lieu/su-kien.csv\n' + RA.tuGit)}
<p>${t(
    'The rest — started, PR opened, reviewed, blocked, absent — comes from the board’s history and the PR pages. Ten seconds per event when it happens is far cheaper than reconstructing a week from memory on Friday night. Absences are the one kind of event members must post themselves, because without them the scripts accuse people (lesson 6.1).',
    'Phần còn lại — bắt đầu, mở PR, review, bị chặn, vắng — lấy từ lịch sử bảng và trang PR. Mười giây cho mỗi sự kiện lúc nó xảy ra rẻ hơn nhiều so với dựng lại cả tuần từ trí nhớ vào tối thứ Sáu. Vắng là loại sự kiện duy nhất thành viên phải tự ghi, vì thiếu nó script sẽ buộc tội người vô can (bài 6.1).')}</p>

<h3>${t('Step 3 — The weekly routine', 'Bước 3 — Việc thường kỳ mỗi tuần')}</h3>
${bang([t('When', 'Khi nào'), t('Command', 'Lệnh'), t('Leader then…', 'Sau đó trưởng nhóm…')], [
    [t('Planning (Monday, sprint start)', 'Planning (thứ Hai đầu sprint)'), '<code>node nang-luc.mjs</code> · <code>node can-bang.mjs</code>', t('commits to capacity; sends scope risks to the supervisor that night', 'cam kết theo năng lực; gửi rủi ro phạm vi cho giảng viên ngay tối đó')],
    [t('Mon/Wed/Fri 21:45', 'T2/T4/T6 21:45'), '<code>node standup.mjs YYYY-MM-DD</code>', t('private messages for every ⚠, same evening', 'nhắn riêng cho mỗi ⚠, ngay tối đó')],
    [t('Friday evening', 'Tối thứ Sáu'), '<code>./chay-tuan.sh &lt;Monday&gt; &lt;repo&gt;</code>', t('reads the packet, sends the report', 'đọc gói tuần, gửi báo cáo')],
    [t('Retro', 'Retro'), '<code>node retro.mjs</code>', t('shows the data first; checks last retro’s actions', 'chiếu số liệu trước; soát hành động retro lần trước')],
  ])}
${bash(MA.chayTuan)}
${out('$ ./chay-tuan.sh 2027-02-22 /tmp/agt-lab6/labflow\n' + RA.chayTuan)}

<h3>${t('Step 4 — Make sure the guard actually guards', 'Bước 4 — Thử xem rào chắn có chắn thật không')}</h3>
<p>${t(
    'A check you have never seen fail is a check you do not know works (the CI lesson of ', 'Một bước kiểm chưa từng thấy nó đỏ là bước kiểm bạn không biết có chạy hay không (bài học CI ở ') + ag('agl-3-3-ci', t('lesson 3.3', 'bài 3.3')) + t(
    '). Edit the risk log the way a tired leader would — the staging incident becomes "a small bug on staging" — and run the routine again:',
    '). Sửa sổ rủi ro theo cách một trưởng nhóm mệt mỏi sẽ sửa — sự cố staging thành "một lỗi nhỏ trên staging" — và chạy lại:')}</p>
${out('$ ./chay-tuan.sh 2027-02-22 /tmp/agt-lab6/labflow   # ' + t('after editing rui-ro.csv', 'sau khi sửa rui-ro.csv') + '\n' + RA.chayTuanChan)}
<p>${t('Exit code 1, nothing to send until the incident is described honestly. Restore the file and the packet is green again.', 'Mã thoát 1, không có gì để gửi cho tới khi sự cố được tả trung thực. Trả lại tệp gốc thì gói tuần lại đạt.')}</p>

<h3>${t('Step 5 — The meeting set', 'Bước 5 — Bộ họp')}</h3>
${bang([t('Document', 'Tài liệu'), t('Filled example', 'Mẫu điền sẵn'), t('Where it lives', 'Để ở đâu')], [
    [t('Communication agreement', 'Thoả thuận giao tiếp'), ag('agl-6-4-tu-xa', '6.4'), '<code>docs/giao-tiep.md</code>'],
    [t('Planning minutes', 'Biên bản planning'), ag('agl-6-2-planning-retro', '6.2'), '<code>docs/hop/</code>'],
    [t('Review + retro minutes', 'Biên bản review + retro'), ag('agl-6-2-planning-retro', '6.2'), '<code>docs/hop/</code>'],
    [t('1:1 notes', 'Ghi chú 1:1'), ag('agl-6-5-thanh-vien', '6.5'), t('private, not in the repo', 'riêng tư, không vào repo')],
    [t('Weekly report', 'Báo cáo tuần'), ag('agl-6-3-bao-cao', '6.3'), t('generated; sent by email/LMS', 'sinh tự động; gửi qua email/LMS')],
  ])}

<h3>🛠 ${t('Project milestone 6 — your team’s communication kit', 'Mốc dự án 6 — bộ giao tiếp của nhóm bạn')}</h3>
<ol>
<li>${t('Write <code>docs/giao-tiep.md</code> with your team (30 minutes, everyone approves the PR).', 'Viết <code>docs/giao-tiep.md</code> cùng cả nhóm (30 phút, mọi người duyệt PR).')}</li>
<li>${t('Export your board from CT Work, build <code>su-kien.csv</code> for the current sprint (tu-git.mjs for commits and merges, the rest by hand).', 'Xuất bảng từ CT Work, dựng <code>su-kien.csv</code> cho sprint hiện tại (tu-git.mjs cho commit và merge, phần còn lại ghi tay).')}</li>
<li>${t('Run nang-luc.mjs and can-bang.mjs on your next planning; send any scope risk to your supervisor the same evening.', 'Chạy nang-luc.mjs và can-bang.mjs ở planning tới; gửi rủi ro phạm vi cho giảng viên ngay tối đó.')}</li>
<li>${t('Run chay-tuan.sh every Friday for two weeks and send the generated report.', 'Chạy chay-tuan.sh mỗi thứ Sáu trong hai tuần và gửi báo cáo sinh ra.')}</li>
<li>${t('Hold one retro with the scripts: data first, silent writing, ≤ 2 actions in hanh-dong.csv.', 'Tổ chức một buổi retro dùng script: số liệu trước, viết im lặng, ≤ 2 hành động trong hanh-dong.csv.')}</li>
</ol>
${cl('ok', `<p><strong>${t('Done when', 'Đạt khi')}</strong></p><ul>
<li>${t('docs/giao-tiep.md is merged with every member’s approval.', 'docs/giao-tiep.md đã merge với sự đồng ý của mọi thành viên.')}</li>
<li>${t('Two weekly reports were sent, both passing soat-bao-cao.mjs, each with a colour, a rule and at least one risk with an owner.', 'Đã gửi hai báo cáo tuần, cả hai qua soat-bao-cao.mjs, mỗi bản có màu, luật màu và ít nhất một rủi ro có chủ.')}</li>
<li>${t('Every ⚠ from standup.mjs got a private message the same evening (keep the list for yourself).', 'Mỗi ⚠ của standup.mjs đều được nhắn riêng ngay tối đó (tự giữ danh sách).')}</li>
<li>${t('retro.mjs shows all of the last retro’s actions with one owner, a date and a ticket.', 'retro.mjs cho thấy mọi hành động của retro gần nhất có một chủ, một hạn, một ticket.')}</li>
<li>${t('You can explain, with your own data, one decision these scripts changed.', 'Bạn giải thích được, bằng dữ liệu của chính nhóm, một quyết định mà các script này đã làm thay đổi.')}</li>
</ul>`)}
${giai(t('Common problems', 'Lỗi thường gặp'), `<ul>
<li>${t('<strong>Commits without ticket keys</strong> are invisible to tu-git.mjs. Fix the convention first (hook or CI, lesson 3.1), not the script.', '<strong>Commit không có mã ticket</strong> thì tu-git.mjs không thấy. Sửa quy ước trước (hook hoặc CI, bài 3.1), không sửa script.')}</li>
<li>${t('<strong>"Silent" alarms for design or test-data work</strong> that produces no commits: log a <code>cap-nhat</code> event on the card when you work on it.', '<strong>Báo "im lặng" cho việc thiết kế hay dữ liệu test</strong> không ra commit: ghi sự kiện <code>cap-nhat</code> lên thẻ mỗi khi làm.')}</li>
<li>${t('<strong>A report that is always yellow</strong> is usually right: an honest yellow in week 2 is normal. Green every week is the suspicious one.', '<strong>Báo cáo lúc nào cũng vàng</strong> thường là đúng: vàng trung thực ở tuần 2 là bình thường. Tuần nào cũng xanh mới đáng nghi.')}</li>
<li>${t('<strong>git log misses a morning merge</strong>: a bare date in --since; always pass a time and time zone.', '<strong>git log bỏ sót merge buổi sáng</strong>: --since với ngày trần; luôn đưa giờ và múi giờ.')}</li>
</ul>`)}
<p>${t('Then: ', 'Tiếp theo: ')}${ag('agl-6-7-quiz', t('6.7 — Chapter 6 quiz', '6.7 — Kiểm tra Chương 6'))}. ${t('In the capstone (', 'Ở dự án cuối khoá (')}${ag('agl-9-2-thuc-hien', t('lesson 12.2', 'bài 12.2'))}${t(') you run this kit for a whole sprint.', ') bạn chạy bộ này cho trọn một sprint.')}</p>
`);
};

export default {
  title: '6.6 — Lab: LabFlow’s communication kit|||6.6 — Lab: bộ giao tiếp của LabFlow',
  slug: 'agl-6-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc dự án 6: gom script của chương vào tools/nhom/ trong repo; tu-git.mjs rút commit/merge từ git (khớp 29/29 dòng nhật ký); việc thường kỳ mỗi tuần (planning, daily, thứ Sáu, retro); chay-tuan.sh sinh gói tuần và TỪ CHỐI gửi khi báo cáo phạm luật (thử bằng "lỗi nhỏ trên staging": mã thoát 1); bộ họp và nơi để; ghi chú 1:1 không vào repo; tiêu chí đạt.',
  content: L66(true) + L66(false),
};

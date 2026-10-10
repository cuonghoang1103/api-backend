/**
 * CT Work đợt 7b — TỆP MẪU tự dựng cho test (Trello JSON, Asana CSV/JSON, Jira CSV, CSV chung, Excel). Không gọi dịch vụ
 * thật nào; hình dạng theo tệp xuất thật của từng công cụ (rút gọn những trường bộ đọc dùng).
 */

import { xlsxTable } from './exchange.service.js';

/** Trello "Export as JSON": 3 cột, 4 thẻ (1 lưu trữ), nhãn, thành viên (không email), bình luận, checklist. */
export function trelloSample(memberName = 'Lan Pham') {
  return JSON.stringify({
    name: 'Sprint board',
    lists: [{ id: 'l1', name: 'To Do' }, { id: 'l2', name: 'Doing' }, { id: 'l3', name: 'Done' }],
    labels: [{ id: 'lb1', name: 'frontend', color: 'green' }, { id: 'lb2', name: '', color: 'red' }],
    members: [{ id: 'm1', fullName: memberName, username: 'lanpham' }, { id: 'm2', fullName: 'Ghost Writer', username: 'ghost' }],
    cards: [
      { id: '650a1b2c3d4e5f6a7b8c9d01', name: 'Login page', desc: 'Build the login form', idList: 'l2', idLabels: ['lb1', 'lb2'], idMembers: ['m1'], due: '2026-10-20T10:00:00.000Z', closed: false },
      { id: '650a1b2c3d4e5f6a7b8c9d02', name: 'Set up CI', desc: '', idList: 'l3', idLabels: [], idMembers: ['m2'], due: null, closed: false },
      { id: '650a1b2c3d4e5f6a7b8c9d03', name: 'Write README', desc: 'Docs', idList: 'l1', idLabels: [], idMembers: [], closed: false },
      { id: '650a1b2c3d4e5f6a7b8c9d04', name: 'Old idea', desc: '', idList: 'l1', closed: true },
    ],
    checklists: [{ id: 'c1', idCard: '650a1b2c3d4e5f6a7b8c9d01', name: 'Steps', checkItems: [{ name: 'Email field', state: 'complete', pos: 1 }, { name: 'Password field', state: 'incomplete', pos: 2 }] }],
    actions: [
      { id: 'a1', type: 'commentCard', date: '2026-10-01T09:00:00.000Z', data: { text: 'Use the design from Figma', card: { id: '650a1b2c3d4e5f6a7b8c9d01' } }, memberCreator: { id: 'm1', fullName: memberName, username: 'lanpham' } },
      { id: 'a2', type: 'commentCard', date: '2026-10-02T09:00:00.000Z', data: { text: 'Pipeline is green', card: { id: '650a1b2c3d4e5f6a7b8c9d02' } }, memberCreator: { id: 'm2', fullName: 'Ghost Writer', username: 'ghost' } },
      { id: 'a3', type: 'updateCard', data: { card: { id: '650a1b2c3d4e5f6a7b8c9d01' } } },
    ],
  });
}

/** Asana "Export → CSV": email người làm, section, tag, task con theo TÊN cha. */
export function asanaCsvSample(email = 'lan@example.com') {
  return [
    'Task ID,Created At,Completed At,Last Modified,Name,Section/Column,Assignee,Assignee Email,Start Date,Due Date,Tags,Notes,Projects,Parent task',
    `1201,2026-09-01,,2026-09-02,Checkout flow,In Progress,Lan Pham,${email},2026-09-05,2026-09-30,"payments,web",Card + wallet,Shop,`,
    '1202,2026-09-01,2026-09-10,2026-09-10,Pick payment provider,Done,Nobody Known,nobody@nowhere.test,,,payments,,Shop,',
    '1203,2026-09-02,,2026-09-02,Wallet button,In Progress,,,,,,"Apple Pay, Google Pay",Shop,Checkout flow',
  ].join('\n');
}

/** Asana API JSON: subtasks lồng + stories bình luận. */
export function asanaJsonSample(email = 'lan@example.com') {
  return JSON.stringify({
    data: [{
      gid: '9001', name: 'Onboarding email', notes: 'Welcome series', completed: false, created_at: '2026-09-03T00:00:00Z', due_on: '2026-10-15',
      assignee: { gid: 'u1', name: 'Lan Pham', email }, tags: [{ name: 'email' }], memberships: [{ section: { name: 'Doing' } }],
      custom_fields: [{ name: 'Priority', display_value: 'High' }],
      stories: [{ resource_subtype: 'comment_added', text: 'Draft is in Docs', created_by: { gid: 'u1', name: 'Lan Pham', email }, created_at: '2026-09-04T00:00:00Z' }, { resource_subtype: 'assigned', text: 'assigned' }],
      subtasks: [{ gid: '9002', name: 'Write copy', completed: true }],
    }],
  });
}

/** Jira "Export → CSV (all fields)": cột lặp Labels/Comment, Sub-task trỏ Parent id. */
export function jiraCsvSample(email = 'lan@example.com') {
  return [
    'Summary,Issue key,Issue id,Issue Type,Status,Priority,Assignee,Assignee Email,Reporter,Labels,Labels,Description,Comment,Comment,Parent id,Due Date,Created,Custom field (Story Points)',
    `Search bar,SHOP-1,10001,Story,In Progress,High,Lan Pham,${email},Lan Pham,web,ux,Instant search,23/Sep/26 10:00 AM;5b10ac8d;Start with titles only,24/Sep/26 9:00 AM;5b10ac8d;Add filters later,,30/Sep/26,20/Sep/26 9:00 AM,5`,
    'Debounce input,SHOP-2,10002,Sub-task,To Do,Low,,,,,,,,,10001,,21/Sep/26 9:00 AM,',
    ',SHOP-3,10003,Bug,To Do,Medium,,,,,,,,,,,,',
  ].join('\n');
}

/** CSV chung có tiêu đề TIẾNG VIỆT (gợi ý ghép cột tự nhận). */
export function genericCsvSample(email = 'lan@example.com') {
  return [
    'Tiêu đề,Mô tả,Người làm,Hạn,Nhãn,Trạng thái,Ưu tiên,Điểm',
    `Thiết kế ERD,Bảng user + order,${email},2026-10-25,db,Đang làm,Cao,3`,
    'Viết test,,someone@else.test,25/10/2026,"qa,test",Xong,low,x',
    ',,,,,,,',
    'Không có hạn,,,ngày mai,,,,',
  ].join('\n');
}

/** Excel .xlsx: một sheet "Tasks" có tiêu đề Anh. */
export function genericXlsxSample(): Buffer {
  return xlsxTable(['Title', 'Description', 'Assignee Email', 'Due date', 'Status'], [
    ['Prepare demo', 'Slides + video', 'lan@example.com', '2026-10-30', 'To Do'],
    ['Book room', '', '', '', 'Done'],
  ], 'Tasks');
}

/**
 * ============================================================
 * KỸ NĂNG CT WORK DỰNG SẴN CHO CUONGMINI (đợt 6, việc 8 — 18/10/2026)
 * ============================================================
 *
 * "Làm X trong CT Work thế nào?" ⇒ tool máy chủ `ctwork_huong_dan` trả đúng chủ đề + LINK ĐÚNG TRANG của dự án đang gắn.
 * NẠP THEO NHU CẦU: prompt chỉ có một câu nhắc tool này (luật CT Work), không nhét cả kho vào prompt — gọi không tham số
 * ⇒ mục lục (id + tên một dòng), gọi `hoi`/`chu_de` ⇒ 1–3 chủ đề đầy đủ.
 *
 * Nguồn tri thức: kho `HELP_TOPICS` của trợ lý hướng dẫn trên web (`work/helpGuide.ts` — mã SỞ HỮU link, model chỉ chọn
 * id) + các chủ đề riêng của CuongMini bên dưới (Resources, Change Request, Q&A, chat, SRS/SWR/RTM, Report 5.1/5.2,
 * phụ thuộc thẻ, workflow/Done rules, git ↔ CT Work, mẫu FPT theo giai đoạn, trưởng nhóm, giảng viên) — kèm TOOL MCP
 * tương ứng để agent làm thay được (ghi vẫn qua thẻ duyệt).
 */
import { prisma } from '../../config/database.js';
import { HELP_TOPICS, type HelpTopicLink, type LText } from '../work/helpGuide.js';
import { frontendUrl } from '../work/common.js';

interface ChuDe {
  id: string;
  ten: LText;
  tom: LText;
  /** Các bước làm (chỉ chủ đề riêng của CuongMini). */
  buoc?: LText[];
  /** Tool MCP CT Work làm được việc này. */
  tool?: string[];
  trang: HelpTopicLink[];
  tuKhoa: string[];
}

const l = (vi: string, en: string): LText => ({ vi, en });
const tr = (scope: HelpTopicLink['scope'], path: string, vi: string, en: string): HelpTopicLink => ({ scope, path, label: { vi, en } });

/** Chủ đề RIÊNG của CuongMini — những thứ trợ lý web chưa có hoặc cần thêm bước + tool. */
export const CHU_DE_CUONGMINI: ChuDe[] = [
  {
    id: 'resources', ten: l('Resources — thư viện link của nhóm', 'Resources — the team link library'),
    tom: l('Nơi nhóm ghim repo, Figma, slide, video, tài liệu đọc. Thẻ có thể gắn web link lấy từ Resources.', 'Where the team pins the repo, Figma, slides, videos and reading. Issues can attach web links from Resources.'),
    buoc: [l('Mở Resources, lọc theo nhóm/tag.', 'Open Resources, filter by group/tag.'), l('Thêm link: nút + (chọn nhóm, ghi mô tả).', 'Add a link with + (pick a group, add a description).')],
    tool: ['project_resources'], trang: [tr('project', 'resources', 'Resources', 'Resources')], tuKhoa: ['resource', 'tai nguyen', 'link', 'repo', 'figma', 'slide', 'tai lieu doc'],
  },
  {
    id: 'change-requests', ten: l('Change Request (yêu cầu thay đổi)', 'Change requests'),
    tom: l('Đề xuất đổi phạm vi/yêu cầu: mô tả tác động (giờ, chi phí, rủi ro), gửi duyệt, theo dõi trạng thái.', 'Propose a scope/requirement change: impact (time, cost, risk), send for approval, track the status.'),
    buoc: [l('Changes → Tạo CR, điền lý do + tác động.', 'Changes → New CR, fill the reason + impact.'), l('Gửi duyệt; người duyệt quyết định trong Approvals.', 'Submit; approvers decide in Approvals.')],
    tool: ['change_requests', 'change_request_manage'],
    trang: [tr('project', 'changes', 'Change Requests', 'Change Requests')], tuKhoa: ['change request', 'cr', 'thay doi pham vi', 'yeu cau thay doi', 'scope'],
  },
  {
    id: 'qna', ten: l('Q&A với giảng viên / trưởng nhóm', 'Q&A log with the lecturer / lead'),
    tom: l('Sổ hỏi đáp của dự án (Q&A log của môn FPT): hỏi một câu, người phụ trách trả lời, cả nhóm cùng thấy.', 'The project Q&A log (FPT course log): ask once, the owner answers, the whole team sees it.'),
    buoc: [l('School → tab Q&A → Hỏi.', 'School → Q&A tab → Ask.')],
    tool: ['qna_list', 'qna_ask', 'qna_answer'], trang: [tr('project', 'school?tab=qna', 'Q&A log', 'Q&A log')], tuKhoa: ['qna', 'hoi dap', 'hoi giang vien', 'cau hoi', 'question'],
  },
  {
    id: 'team-chat', ten: l('Chat nhóm của dự án', 'Project team chat'),
    tom: l('Kênh chat theo dự án; nhắc @người, gắn thẻ, gửi tệp. CuongMini soạn tin, bạn duyệt rồi mới gửi.', 'Per-project channels; @mention, link issues, share files. CuongMini drafts, you approve before sending.'),
    tool: ['chat_channels', 'chat_read', 'chat_post', 'chat_edit', 'chat_channel_manage', 'chat_message_act'], trang: [tr('project', 'chat', 'Chat', 'Chat')], tuKhoa: ['chat', 'nhan tin', 'kenh', 'channel', 'bao nhom'],
  },
  {
    id: 'srs-swr', ten: l('SRS / SWR302 — yêu cầu phần mềm', 'SRS / SWR302 — software requirements'),
    tom: l('Use case, actor, business rule, màn hình, phân quyền màn hình, chức năng không UI; SWR302: stakeholder, elicitation, khảo sát, glossary, NFR, ưu tiên.', 'Use cases, actors, business rules, screens, screen authorization, non-UI functions; SWR302: stakeholders, elicitation, surveys, glossary, NFRs, priorities.'),
    buoc: [l('Requirements → từng tab theo thứ tự: Actors → Use cases → Rules → Screens → Authorization → Non-UI.', 'Requirements → tabs in order: Actors → Use cases → Rules → Screens → Authorization → Non-UI.'), l('Xuất tài liệu SRS khi đủ: Docs/Export.', 'Export the SRS document when complete: Docs/Export.')],
    tool: ['srs_get', 'srs_suggest_use_cases', 'srs_add_actor', 'srs_propose_use_case', 'srs_add_screen', 'swr_overview', 'swr_requirements', 'swr_nfr'],
    trang: [tr('project', 'requirements', 'Requirements (SRS)', 'Requirements (SRS)'), tr('project', 'spec', 'Spec quality', 'Chất lượng spec')], tuKhoa: ['srs', 'swr', 'use case', 'actor', 'business rule', 'yeu cau', 'requirement', 'nfr', 'stakeholder', 'elicitation'],
  },
  {
    id: 'rtm', ten: l('RTM — ma trận truy vết yêu cầu', 'RTM — requirements traceability matrix'),
    tom: l('Nối yêu cầu ⇄ thẻ ⇄ test case để chứng minh mỗi yêu cầu đã làm + đã kiểm.', 'Links requirements ⇄ issues ⇄ test cases to prove every requirement is built and tested.'),
    tool: ['rtm_get', 'trace_link_add', 'trace_links', 'trace_link_remove'], trang: [tr('project', 'requirements?tab=traceability', 'Traceability (RTM)', 'Truy vết (RTM)')], tuKhoa: ['rtm', 'truy vet', 'traceability', 'ma tran'],
  },
  {
    id: 'fpt-test-reports', ten: l('Report 5.1 / 5.2 / 5.3 (FPT) — Unit, Integration, System test', 'FPT Report 5.1 / 5.2 / 5.3 — unit, integration, system test'),
    tom: l('5.1 Unit test theo hàm (case + kết quả), 5.2 Integration theo module/vòng, 5.3 System. CT Work tự dựng file Excel đúng mẫu trường.', '5.1 unit tests per function (cases + results), 5.2 integration per module/round, 5.3 system. CT Work builds the school-format Excel.'),
    buoc: [
      l('Tests → tab Unit: tạo hàm, thêm case (input/expected), đánh dấu Pass/Fail.', 'Tests → Unit tab: add the function, its cases (input/expected), mark Pass/Fail.'),
      l('Đầu sheet (Executed By, Created By, LOC, mô tả, pre-condition): fpt_unit_update_function. Dòng/UTCID nháp: fpt_unit_delete_rows (unused) / fpt_unit_delete_cases (notRun).', 'Sheet header (Executed By, Created By, LOC, description, pre-condition): fpt_unit_update_function. Draft rows/UTCIDs: fpt_unit_delete_rows (unused) / fpt_unit_delete_cases (notRun).'),
      l('Integration/System: tạo module, thêm case, ghi từng vòng; sửa/xoá case: fpt_it_update_cases / fpt_it_delete_cases.', 'Integration/System: create a module, add cases, record each round; edit/delete cases: fpt_it_update_cases / fpt_it_delete_cases.'),
      l('Bìa (creator, reviewer, version) + Record of change: fpt_doc_update / fpt_change_add. Xuất: export_file unit_test / system_test.', 'Cover (creator, reviewer, version) + Record of change: fpt_doc_update / fpt_change_add. Export: export_file unit_test / system_test.'),
    ],
    tool: ['fpt_unit_list', 'fpt_unit_create_function', 'fpt_unit_add_cases', 'fpt_unit_mark', 'fpt_unit_record_results', 'fpt_unit_update_function', 'fpt_unit_update_rows', 'fpt_unit_delete_rows', 'fpt_unit_delete_cases', 'fpt_unit_suggest', 'fpt_it_create_module', 'fpt_it_add_cases', 'fpt_it_record_round', 'fpt_it_update_cases', 'fpt_it_delete_cases', 'fpt_doc_update', 'export_file'],
    trang: [tr('project', 'tests?tab=unit', 'Unit test (5.1)', 'Unit test (5.1)'), tr('project', 'tests?tab=integration', 'Integration (5.2)', 'Integration (5.2)'), tr('project', 'tests?tab=system', 'System (5.3)', 'System (5.3)')],
    tuKhoa: ['5.1', '5.2', '5.3', 'unit test', 'integration', 'system test', 'report 5', 'bao cao kiem thu', 'test case', 'executed by', 'utcid', 'loc'],
  },
  {
    id: 'weekly-report', ten: l('Báo cáo tuần (weekly report)', 'Weekly report'),
    tom: l('CT Work tự tính việc xong / kế hoạch tuần sau / rủi ro / giờ từ thẻ + worklog; nhóm chỉnh chữ rồi nộp.', 'CT Work computes done / next week / risks / hours from issues + worklogs; the team edits the text and submits.'),
    tool: ['weekly_report_generate', 'export_file'], trang: [tr('project', 'school?tab=weekly', 'Weekly report', 'Báo cáo tuần'), tr('project', 'reports?tab=weekly', 'Reports', 'Báo cáo')], tuKhoa: ['bao cao tuan', 'weekly', 'report', 'tuan'],
  },
  {
    id: 'dependencies', ten: l('Phụ thuộc giữa thẻ (blocks / is blocked by, cha–con)', 'Issue dependencies (blocks / is blocked by, parent–child)'),
    tom: l('Liên kết "A blocks B": B chờ A xong. Board hiện "⏳ Chờ A". Thẻ cha chỉ xong khi các thẻ con xong.', '"A blocks B" means B waits for A. The board shows "⏳ Waiting on A". A parent is done only when its children are.'),
    buoc: [l('Mở thẻ → Links → thêm "blocks"/"is blocked by".', 'Open the issue → Links → add "blocks"/"is blocked by".'), l('Bị chặn: hỏi người làm thẻ chặn, chờ họ push, pull về rồi mới làm.', 'Blocked: ask the blocker\'s assignee, wait for their push, pull it, then start.')],
    tool: ['issue_guide', 'get_issue', 'update_issue'], trang: [tr('project', 'board', 'Board', 'Board')], tuKhoa: ['phu thuoc', 'blocked', 'blocks', 'cho', 'depend', 'the cha', 'the con', 'subtask'],
  },
  {
    id: 'workflow-done', ten: l('Workflow, chuyển trạng thái & Done rules', 'Workflow, transitions & Done rules'),
    tom: l('Mỗi thẻ chỉ chuyển sang các trạng thái workflow cho phép ("Allowed transitions"). Done rules / Definition of Done của dự án phải đạt trước khi Done; agent Done ⇒ vào Review.', 'An issue moves only along its workflow ("Allowed transitions"). The project Done rules / Definition of Done must hold before Done; an agent\'s Done lands in Review.'),
    tool: ['get_issue', 'transition', 'request_review'], trang: [tr('project', 'settings?tab=workflow', 'Workflow', 'Workflow'), tr('project', 'settings?tab=quality', 'Done rules', 'Done rules')], tuKhoa: ['workflow', 'chuyen trang thai', 'transition', 'done', 'review', 'dod', 'definition of done', 'done rule'],
  },
  {
    id: 'git-ctwork', ten: l('Git ↔ CT Work (nhánh, commit, PR)', 'Git ↔ CT Work (branches, commits, PRs)'),
    tom: l('Nhánh đặt theo thẻ (LF-18-ten-the), commit có key ("LF-18: …"); nối GitHub/GitLab thì commit/PR tự hiện trên thẻ. Sau push/PR: bình luận link vào thẻ làm bằng chứng.', 'Name branches after the issue (LF-18-title), put the key in commits ("LF-18: …"); with GitHub/GitLab connected commits/PRs show on the issue. After a push/PR, comment the link on the issue as evidence.'),
    buoc: [
      l('Chưa có code trên máy (thư mục đang mở không phải repo của dự án — xem `git remote -v`): project_repos ⇒ URL clone + nhánh mặc định ⇒ đề nghị `git clone`.', 'No code on this machine (the open folder is not the project repo — check `git remote -v`): project_repos ⇒ clone URL + default branch ⇒ offer `git clone`.'),
      l('/ctwork → Bắt đầu làm thẻ (tạo nhánh + In Progress).', '/ctwork → Start an issue (branch + In Progress).'), l('Commit "LF-18: …", push, mở PR.', 'Commit "LF-18: …", push, open a PR.'), l('/ctwork → Xong việc: bình luận bằng chứng + chuyển Review.', '/ctwork → Done: evidence comment + move to Review.'),
    ],
    tool: ['project_repos', 'dev_activity', 'comment', 'transition'], trang: [tr('project', 'settings?tab=github', 'GitHub / GitLab', 'GitHub / GitLab')], tuKhoa: ['git', 'branch', 'nhanh', 'commit', 'push', 'pull request', 'pr', 'github', 'gitlab', 'clone', 'repo', 'checkout', 'ma nguon', 'source code'],
  },
  {
    id: 'edit-delete', ten: l('Sửa / xoá / khôi phục (thẻ, bình luận, Docs, test, họp…)', 'Edit / delete / restore (issues, comments, Docs, tests, meetings…)'),
    tom: l('CuongMini sửa/xoá được như bạn trên web, theo đúng vai của bạn. Lệnh xoá luôn hỏi lại (thẻ duyệt ⚠ XOÁ); thẻ và trang Docs vào thùng rác, khôi phục được. Duyệt / APPROVED / tài chính / gửi khách: bạn tự bấm.', 'CuongMini edits/deletes what you can on the web, by your role. Deletes always ask again (⚠ DELETE card); issues and Docs pages go to the trash and can be restored. Approvals / APPROVED / finance / client sends: you click them yourself.'),
    tool: ['issue_delete', 'issue_restore', 'issue_clone', 'comment_edit', 'comment_delete', 'attachment_delete', 'worklog_delete', 'docs_page_update', 'docs_page_move', 'docs_page_delete', 'docs_page_restore', 'test_update', 'test_cycle_update', 'meeting_update', 'raid_delete', 'qna_update', 'resource_update'],
    trang: [tr('project', 'settings?tab=trash', 'Trash', 'Thùng rác')], tuKhoa: ['xoa', 'delete', 'sua', 'edit', 'khoi phuc', 'restore', 'thung rac', 'trash', 'nhan ban', 'clone'],
  },
  {
    id: 'fpt-phases', ten: l('Mẫu FPT theo giai đoạn đồ án', 'FPT templates by project phase'),
    tom: l('Đầu kỳ: Project Tracking + WBS, SRS/Report 2–3; giữa kỳ: thiết kế (diagram), Report 4; cuối kỳ: Report 5.1/5.2/5.3, báo cáo tổng (final report), biên bản họp mỗi tuần, báo cáo tuần.', 'Start: Project Tracking + WBS, SRS/Reports 2–3; middle: design diagrams, Report 4; end: Reports 5.1/5.2/5.3, the final report; meeting minutes and weekly reports throughout.'),
    tool: ['swr_doc_fill', 'report3_fill_page', 'diagram_generate', 'diagram_fill_report', 'fpt_unit_suggest', 'final_report_assemble', 'meeting_minutes_propose', 'weekly_report_generate'],
    trang: [tr('project', 'school', 'School (WBS · tracking · weekly)', 'School (WBS · tracking · báo cáo tuần)'), tr('project', 'diagrams', 'Diagrams', 'Sơ đồ'), tr('project', 'docs', 'Docs', 'Tài liệu')],
    tuKhoa: ['mau fpt', 'report 2', 'report 3', 'report 4', 'final report', 'bao cao', 'bien ban', 'wbs', 'project tracking', 'giai doan', 'swp391', 'swr302', 'swt301', 'sep490'],
  },
  {
    id: 'lead-guide', ten: l('Trưởng nhóm: lập sprint, cân tải, nhắc người trễ', 'Team lead: plan the sprint, balance load, nudge late work'),
    tom: l('Backlog → kéo thẻ vào sprint theo năng lực; Workload xem ai quá tải; thẻ quá hạn/bị chặn trên Board. CuongMini soạn tin nhắc, bạn duyệt mới gửi.', 'Backlog → pull issues into the sprint by capacity; Workload shows who is overloaded; overdue/blocked issues show on the Board. CuongMini drafts nudges, you approve before sending.'),
    tool: ['sprint_current', 'search_issues', 'contrib_summary', 'time_by_activity', 'chat_post'],
    trang: [tr('project', 'backlog', 'Backlog', 'Backlog'), tr('workspace', 'workload', 'Workload', 'Workload'), tr('project', 'reports', 'Reports', 'Báo cáo')], tuKhoa: ['truong nhom', 'lead', 'chia viec', 'can tai', 'workload', 'tre han', 'overdue', 'lap sprint', 'sprint planning'],
  },
  {
    id: 'teacher-guide', ten: l('Giảng viên: tổng quan lớp, nhóm, điểm nghẽn', 'Lecturer: class overview, groups, bottlenecks'),
    tom: l('Hub giảng viên tổng hợp tiến độ từng nhóm (thẻ xong, trễ, đóng góp, buổi họp); xem chi tiết một nhóm để thấy điểm nghẽn.', 'The lecturer hub summarises each group (done, late, contributions, meetings); open one group to see its bottlenecks.'),
    tool: ['teaching_overview', 'teaching_group', 'class_content', 'class_post', 'class_material', 'class_assignment'], trang: [tr('global', '/work/classes', 'Classes', 'Lớp học')], tuKhoa: ['giang vien', 'teacher', 'lop', 'class', 'nhom sinh vien', 'diem nghen'],
  },
];

const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

/** Toàn kho: chủ đề web (helpGuide) + chủ đề riêng CuongMini. */
export function khoChuDe(): ChuDe[] {
  const web: ChuDe[] = HELP_TOPICS.map((t) => ({ id: t.id, ten: { vi: t.title.vi, en: t.title.en }, tom: { vi: t.summary.vi, en: t.summary.en }, trang: t.pages, tuKhoa: t.keywords }));
  return [...CHU_DE_CUONGMINI, ...web.filter((w) => !CHU_DE_CUONGMINI.some((c) => c.id === w.id))];
}

/** Điểm khớp câu hỏi (không dấu, từ khoá + tên + tóm tắt). */
export function diemKhop(c: ChuDe, hoi: string): number {
  const q = boDau(hoi);
  const tu = q.split(/[^a-z0-9.]+/).filter((x) => x.length >= 2);
  let d = 0;
  for (const k of c.tuKhoa) if (q.includes(boDau(k))) d += k.includes(' ') ? 4 : 3;
  const chu = boDau(`${c.ten.vi} ${c.ten.en} ${c.tom.vi} ${c.tom.en}`);
  for (const t of tu) if (chu.includes(t)) d += 1;
  return d;
}

export interface NguCanhLink { slug: string | null; key: string | null }

/** Link tuyệt đối tới đúng trang của dự án đang gắn (thiếu slug/key ⇒ link chung). */
export function linkTrang(t: HelpTopicLink, n: NguCanhLink): string {
  if (t.scope === 'global') return frontendUrl(t.path);
  if (t.scope === 'workspace') return n.slug ? frontendUrl(`/work/${n.slug}/${t.path}`) : frontendUrl('/work');
  return n.slug && n.key ? frontendUrl(`/work/${n.slug}/${n.key}/${t.path}`) : frontendUrl('/work');
}

/** Chữ trả về của `ctwork_huong_dan` (thuần — test được). */
export function traLoiHuongDan(args: { hoi?: unknown; chu_de?: unknown }, n: NguCanhLink, en = false): { content: string; summary: string } {
  const kho = khoChuDe();
  const L = (t: LText) => (en ? t.en : t.vi);
  const ids = Array.isArray(args.chu_de) ? args.chu_de.filter((x): x is string => typeof x === 'string').slice(0, 3) : [];
  const hoi = typeof args.hoi === 'string' ? args.hoi.trim().slice(0, 300) : '';
  let chon = ids.map((id) => kho.find((c) => c.id === id)).filter((c): c is ChuDe => !!c);
  if (!chon.length && hoi) {
    chon = kho.map((c) => ({ c, d: diemKhop(c, hoi) })).filter((x) => x.d > 0).sort((a, b) => b.d - a.d).slice(0, 3).map((x) => x.c);
  }
  if (!chon.length) {
    const mucLuc = kho.map((c) => `- ${c.id}: ${L(c.ten)}`).join('\n');
    return {
      content: `${hoi ? (en ? `No topic matched "${hoi}". ` : `Không có chủ đề khớp "${hoi}". `) : ''}${en ? 'CT Work guide topics (call again with chu_de: [id]):' : 'Mục lục hướng dẫn CT Work (gọi lại với chu_de: [id]):'}\n${mucLuc}`,
      summary: `${kho.length} ${en ? 'topics' : 'chủ đề'}`,
    };
  }
  const khoi = chon.map((c) => {
    const dong = [`## ${L(c.ten)} (${c.id})`, L(c.tom)];
    if (c.buoc?.length) dong.push(...c.buoc.map((b, i) => `${i + 1}. ${L(b)}`));
    if (c.trang.length) dong.push(`${en ? 'Pages' : 'Trang'}: ${c.trang.map((t) => `[${L(t.label)}](${linkTrang(t, n)})`).join(' · ')}`);
    if (c.tool?.length) dong.push(`${en ? 'CT Work tools (mcp__ctwork__…)' : 'Tool CT Work (mcp__ctwork__…)'}: ${c.tool.join(', ')}`);
    return dong.join('\n');
  });
  const ghiChu = en
    ? 'Give the user these exact links (do not invent CT Work URLs). Writes still go through the approval card.'
    : 'Đưa cho người dùng ĐÚNG các link này (đừng tự chế URL CT Work). Ghi vẫn qua thẻ duyệt.';
  return { content: `${khoi.join('\n\n')}\n\n${ghiChu}`, summary: chon.map((c) => c.id).join(', ') };
}

/** `ctwork` app gửi ⇒ slug + key (slug tra từ không gian mà NGƯỜI GỌI là thành viên — không tin chữ của app). */
export async function nguCanhLink(userId: number, ctwork: unknown): Promise<NguCanhLink> {
  const g = (ctwork && typeof ctwork === 'object' ? ctwork : {}) as Record<string, unknown>;
  const key = typeof g.key === 'string' && /^[A-Z][A-Z0-9_]{0,9}$/.test(g.key) ? g.key : null;
  const wid = typeof g.workspaceId === 'number' && Number.isInteger(g.workspaceId) ? g.workspaceId : null;
  const ref = typeof g.ref === 'string' && /^[a-z0-9][a-z0-9-]{0,60}\/[A-Z][A-Z0-9_]{0,9}$/.test(g.ref) ? g.ref.split('/')[0]! : null;
  try {
    const ws = await prisma.workSpace.findFirst({
      where: { deletedAt: null, members: { some: { userId } }, ...(wid ? { id: wid } : ref ? { slug: ref } : key ? { projects: { some: { key, deletedAt: null } } } : { id: -1 }) },
      select: { slug: true },
    });
    return { slug: ws?.slug ?? null, key };
  } catch {
    return { slug: null, key };
  }
}

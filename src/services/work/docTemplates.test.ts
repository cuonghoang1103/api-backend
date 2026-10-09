/**
 * CTW đợt 3A — BỘ MẪU "FPT Capstone" (Report 1, 2, 3, 4, 5.0, 6, 7). THUẦN, chạy trong `npm test`.
 *
 * FPT_OUTLINE = đề mục (mức 1–4) đọc bằng python-docx từ bộ mẫu thật của trường (~/Documents/Report Đồ án/Report*.docx,
 * 09/10/2026), đã BỎ các đề mục riêng của nhóm làm mẫu (tên đối thủ, tên chức năng, tên lớp…). Mẫu của CT Work phải chứa
 * ĐỦ các đề mục này, ĐÚNG mức và ĐÚNG thứ tự (được phép có thêm đề mục giữ chỗ như "2.1 Actor 1 Features").
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { markdownToTiptap, type PmNode } from './docMarkdown.js';
import { getTemplate, listTemplates } from './docTemplates.js';
import { isGuideNote, plainText } from './docExport.js';

const FPT_OUTLINE: Record<string, string[]> = {
  'fpt-report1-project-introduction': [
    '1|I. Record of Changes', '1|II. Definition and Acronyms', '1|III. Project Introduction', '2|1. Overview', '3|1.1 Project Information',
    '3|1.2 Project Purpose', '3|1.3 Project Team', '2|2. Product Background', '2|3. Existing Solutions', '2|4. Solution & Opportunity',
    '3|4.1. Market Overview & Potential', '3|4.2. Why Our Solution is Optimal', '3|4.3. Competitive Advantages & Unique Value',
    '2|5. Project Scope & Limitations', '3|5.2 Limitations & Exclusions', '4|Limitations', '4|Exclusions',
  ],
  'fpt-report2-project-management-plan': [
    '1|I. Record of Changes', '1|II. Project Management Plan', '2|1. Overview', '3|1.1 Cost & Time Estimations', '3|1.2 Project Objectives',
    '3|1.3 Project Risks', '2|2. Management Approach', '3|2.1 Project Processes', '3|2.2 Quality Management', '3|2.3 Project Training Plan',
    '2|4. Project Communications', '2|5. Configuration Management', '3|5.1 Document Management', '3|5.2 Source Code Management',
    '3|5.3 Tools & Infrastructures',
  ],
  'fpt-report3-srs': [
    '1|I. Record of Changes', '1|II. Software Requirement Specification', '2|1. Overall Requirements', '3|1.1 Context Diagram',
    '3|1.3 User Requirements', '4|1.3.1 Actors', '4|1.3.2 Use Cases (UC)', '3|1.4 System Functionalities', '4|1.4.1 Screens Flow',
    '4|1.4.2 Screen Authorization', '4|1.4.3 Non-UI Functions', '3|1.5 Entity Relationship Diagram', '2|2. Use Case Specifications',
    '2|3. Functional Requirements', '2|4. Non-Functional Requirements', '3|4.1 External Interfaces', '3|4.2 Quality Attribute',
    '4|4.2.1 Performance Efficiency', '4|4.2.2 Security & Privacy', '4|4.2.3 Reliability & Availability', '4|4.2.4 Usability',
    '2|5. Requirement Appendix', '3|5.1 Business Rules', '3|5.2 System Messages',
  ],
  'fpt-report4-sds': [
    '1|I. Record of Changes', '1|II. Software Design Document', '2|1. High Level Design', '3|1.1 Software Architecture',
    '3|1.2 Package Diagram', '4|1.2.1 Back-end', '4|1.2.2 Front-end', '3|1.3 Database Design', '2|2. Detailed Design',
    '2|3. Class Specifications', '2|4. Other Design Specifications', '3|4.1. Authentication & Authorization Specification',
    '3|4.2. Background Job Processing', '3|4.4. Third-party Integrations',
  ],
  'fpt-report5-test-documentation': [
    '1|I. Record of Changes', '1|II. Testing Documentation', '2|1. Scope of Testing', '2|2. Test Strategy', '3|2.1 Testing Types',
    '3|2.2 Test Levels', '3|2.3 Supporting Tools', '2|3. Test Plan', '3|3.1 Test Environment', '3|3.2 Test Milestones', '2|4. Test Cases',
    '2|5. Test Reports',
  ],
  'fpt-report6-user-guides': [
    '1|I. Record of Changes', '1|II. Release Package & User Guides', '2|1. Deliverable Package', '2|2. Installation Guides',
    '3|A. Hardware Requirements', '4|1. Client Devices', '4|2. Server Hardware', '3|B. Software Requirements', '4|1. Network & Browser',
    '4|2. Server Software', '3|2.2 Installation Instruction', '2|3. User Manual', '3|3.1 Overview',
  ],
  'fpt-report7-final-report': [
    '1|Acknowledgement', '1|Definition and Acronyms', '1|I. Project Introduction', '2|1. Overview', '3|1.1 Project Information',
    '3|1.2 Project Team', '2|2. Product Background', '2|3. Existing Solutions', '2|4. Business Opportunity',
    '3|4.1. Market Overview & Potential', '3|4.2. Why Our Solution is Optimal', '3|4.3. Competitive Advantages & Unique Value',
    '2|5. Software Product Vision', '2|6. Project Scope & Limitations', '3|6.2 Limitations & Exclusions', '4|Limitations', '4|Exclusions',
    '1|II. Project Management Plan', '2|1. Overview', '3|1.1 Scope & Estimation', '3|1.2 Project Objectives', '3|1.3 Project Risks',
    '2|2. Management Approach', '3|2.1 Project Process', '3|2.2 Quality Management', '3|2.3 Training Plan', '2|3. Project Deliverables',
    '2|5. Project Communications', '2|6. Configuration Management', '3|6.1 Document Management', '3|6.2 Source Code Management',
    '3|6.3 Tools & Infrastructures', '1|III. Software Requirement Specification', '2|1. Requirement Overview', '3|1.1 Context Diagram',
    '3|1.2 User Requirements', '4|1.2.1 Actors', '4|1.2.2 Use Cases (UC)', '3|1.3 System Functionalities', '4|1.3.1 Screens Flow',
    '4|1.3.2 Screen Authorization', '4|1.3.3 Non-UI Functions', '4|1.3.4 Entity Relationship Diagram', '2|2. Functional Specifications',
    '2|4. Non-Functional Requirements', '3|4.1 External Interfaces', '3|4.2 Quality Attribute', '4|4.2.1 Performance Efficiency',
    '4|4.2.2 Security & Privacy', '4|4.2.3 Reliability & Availability', '4|4.2.4 Usability', '2|5. Requirement Appendix',
    '3|5.1 Business Rules', '3|5.2 Common Requirements', '3|5.3 Application Messages List', '1|IV. Software Design Description',
    '2|1. System Design', '3|1.1 System Architecture', '3|1.2 Package Diagram', '4|1.2.1 Back-end', '4|1.2.2 Front-end',
    '2|2. Database Design', '2|3. Detailed Design', '1|V. Software Testing Documentation', '2|1. Scope of Testing', '2|2. Test Strategy',
    '3|2.1 Testing Types', '3|2.2 Test Levels', '3|2.3 Supporting Tools', '2|3. Test Plan', '3|3.1 Human Resources',
    '3|3.2 Test Environment', '3|3.3 Test Milestones', '2|4. Test Cases', '3|4.1 Unit Test', '3|4.2 Integration Test', '3|4.3 System Test',
    '2|5. Test Reports', '3|5.1 Unit Test', '3|5.2 Integration test', '3|5.3 System Test', '1|VI. Release Package & User Guides',
    '2|1. Deliverable Package', '2|2. Installation Guides', '3|2.1 System Requirements', '3|A. Hardware Requirements', '4|1. Client Devices',
    '4|2. Server Hardware', '3|B. Software Requirements', '4|1. Network & Browser', '4|2. Server Software', '3|2.2 Installation Instruction',
    '2|3. User Manual', '3|3.1 Overview',
  ],
};

const KEYS = Object.keys(FPT_OUTLINE);
const outline = (doc: PmNode) => (doc.content ?? []).filter((b) => b.type === 'heading').map((b) => `${b.attrs?.level}|${plainText(b).replace(/\s+/g, ' ').trim()}`);

describe('bộ mẫu FPT Capstone — đề mục theo bản gốc', () => {
  for (const key of KEYS) {
    it(key, async () => {
      const t = await getTemplate(key);
      const hs = outline(t.doc);
      let at = 0;
      for (const h of FPT_OUTLINE[key]) {
        const i = hs.indexOf(h, at);
        assert.ok(i >= 0, `thiếu hoặc sai thứ tự: "${h}" (sau "${hs[at - 1] ?? '—'}")`);
        at = i + 1;
      }
      // Trang mẫu bỏ tiêu đề # (ô tiêu đề riêng); khối đầu là ghi chú Purpose/Guide (bị bỏ khi xuất).
      assert.equal(t.doc.content?.[0]?.type, 'blockquote');
      assert.ok(isGuideNote(t.doc.content![0]));
      assert.ok(t.summary.length > 20, 'có dòng Purpose cho thư viện mẫu');
      assert.match(t.title, /^FPT Capstone — Report \d: /);
    });
  }

  it('mọi Report (trừ Report 7) mở đầu bằng I. Record of Changes + bảng Date / A* M, D / In charge / Change Description', async () => {
    for (const key of KEYS.filter((k) => k !== 'fpt-report7-final-report')) {
      const blocks = (await getTemplate(key)).doc.content ?? [];
      const i = blocks.findIndex((b) => b.type === 'heading' && plainText(b) === 'I. Record of Changes');
      assert.ok(i >= 0, key);
      const table = blocks.slice(i + 1).find((b) => b.type === 'table')!;
      assert.deepEqual((table.content?.[0]?.content ?? []).map((c) => plainText(c)), ['Date', 'A* M, D', 'In charge', 'Change Description'], key);
    }
  });

  it('bảng đúng cột của bản gốc (Report 2: Cost & Time, Objectives, Risks, Communications; Report 3: UC spec; Report 4: bảng CSDL)', async () => {
    const head = async (key: string, after: string) => {
      const blocks = (await getTemplate(key)).doc.content ?? [];
      const i = blocks.findIndex((b) => b.type === 'heading' && plainText(b).endsWith(after));
      const tb = blocks.slice(i + 1).find((b) => b.type === 'table')!;
      return (tb.content?.[0]?.content ?? []).map((c) => plainText(c));
    };
    assert.deepEqual(await head('fpt-report2-project-management-plan', 'Cost & Time Estimations'), ['#', 'Work Package', 'Est. Effort (pds)', 'Deadline']);
    assert.deepEqual(await head('fpt-report2-project-management-plan', 'Project Objectives'), ['#', 'Metric', 'Unit', 'Planned', 'Actual', 'Notes / References']);
    assert.deepEqual(await head('fpt-report2-project-management-plan', 'Project Risks'), ['#', 'Risk Description', 'Impact', 'Possibility', 'Response Plans']);
    assert.deepEqual(await head('fpt-report2-project-management-plan', 'Project Communications'), ['Communication Item', 'Who/ Target', 'Purpose', 'When, Frequency', 'Type, Tool, Method(s)']);
    assert.deepEqual(await head('fpt-report1-project-introduction', 'Project Team'), ['Full Name', 'Role', 'Email', 'Mobile']);
    assert.deepEqual(await head('fpt-report3-srs', 'Actors'), ['#', 'Actor', 'Description']);
    assert.deepEqual(await head('fpt-report3-srs', 'Use Cases (UC)'), ['ID', 'Use Case', 'Feature', 'Use Case Description']);
    const uc = (await getTemplate('fpt-report3-srs')).doc.content!.find((b) => b.type === 'table' && plainText(b.content![0]).startsWith('Primary Actors'))!;
    assert.deepEqual(uc.content!.map((r) => plainText(r.content![0])), ['Primary Actors', 'Description', 'Preconditions', 'Postconditions', 'Normal Sequence/Flow', 'Alternative Sequences/Flows', 'Exception Flows']);
    assert.deepEqual(await head('fpt-report4-sds', 'TABLE_NAME'), ['No', 'Field', 'PK', 'FK', 'UN', 'NN', 'Description']);
    assert.deepEqual(await head('fpt-report5-test-documentation', 'Test Environment'), ['Purpose', 'Tool', 'Provider', 'Version']);
    assert.deepEqual(await head('fpt-report6-user-guides', 'Deliverable Package'), ['No.', 'Deliverable Item', 'Description']);
  });

  it('thư viện mẫu có nhóm "FPT Capstone" đủ 7 Report; bản sao frontend/public giống hệt', async () => {
    const list = await listTemplates();
    assert.deepEqual(list.filter((t) => t.group === 'FPT Capstone').map((t) => t.key).sort(), [...KEYS].sort());
    for (const k of KEYS) {
      assert.equal(fs.readFileSync(path.resolve(`frontend/public/quy-trinh/mau/${k}.md`), 'utf8'), fs.readFileSync(path.resolve(`content/quy-trinh/mau/${k}.md`), 'utf8'));
    }
  });

  it('dấu ~ trong "R~Responsible" không bị hiểu là gạch ngang (GFM)', async () => {
    const md = fs.readFileSync(path.resolve('content/quy-trinh/mau/fpt-report2-project-management-plan.md'), 'utf8');
    const { doc } = markdownToTiptap(md);
    const raci = (doc.content ?? []).find((b) => b.type === 'paragraph' && plainText(b).startsWith('RACI Chart'))!;
    assert.equal(plainText(raci), 'RACI Chart: R~Responsible, A~Accountable, C~Consulted, I~Informed');
  });
});

/**
 * CTW đợt 4b (R25) — BỘ MẪU "SWR302 (Wiegers)". WIEGERS_OUTLINE = đề mục đọc bằng python-docx từ bộ mẫu gốc của môn
 * (~/Documents/Slide-Document/SWR302/Document_GuideLines/: Chapter 5 Vision and Scope Template, Chapter 8 Use Case Template,
 * Chapter 10 Software Requirements Specification Template, Chapter 13 Guidance for Data Dictionaries, Appendix C COS Business
 * Rules — 10/10/2026), số thứ tự BỎ (bản gốc đánh số tự động). Mẫu của CT Work phải chứa ĐỦ, ĐÚNG MỨC, ĐÚNG THỨ TỰ.
 */
const WIEGERS_OUTLINE: Record<string, string[]> = {
  'swr-vision-scope': [
    '1|Revision History', '1|Business Requirements', '2|Background', '2|Business Opportunity', '2|Business Objectives', '2|Success Metrics',
    '2|Vision Statement', '2|Business Risks', '2|Business Assumptions and Dependencies', '1|Scope and Limitations', '2|Major Features',
    '2|Scope of Initial Release', '2|Scope of Subsequent Releases', '2|Limitations and Exclusions', '1|Business Context',
    '2|Stakeholder Profiles', '2|Project Priorities', '2|Deployment Considerations',
  ],
  'swr-use-cases': [
    '1|Revision History', '2|Use Case ID and Name', '2|Author and Date Created', '2|Primary and Secondary Actors', '2|Trigger', '2|Description',
    '2|Preconditions', '2|Postconditions', '2|Normal Flow', '2|Alternative Flows', '2|Exceptions', '2|Priority', '2|Frequency of Use',
    '2|Business Rules', '2|Other Information', '2|Assumptions', '1|Use Case List', '1|Use Case Template',
  ],
  'swr-srs': [
    '1|Revision History', '1|Introduction', '2|Purpose', '2|Document Conventions', '2|Project Scope', '2|References', '1|Overall Description',
    '2|Product Perspective', '2|User Classes and Characteristics', '2|Operating Environment', '2|Design and Implementation Constraints',
    '2|Assumptions and Dependencies', '1|System Features', '2|System Feature X', '3|Description', '3|Functional Requirements', '1|Data Requirements',
    '2|Logical Data Model', '2|Data Dictionary', '2|Reports', '2|Data Acquisition, Integrity, Retention, and Disposal', '1|External Interface Requirements',
    '2|User Interfaces', '2|Software Interfaces', '2|Hardware Interfaces', '2|Communications Interfaces', '1|Quality Attributes', '2|Usability',
    '2|Performance', '2|Security', '2|Safety', '2|[Others as relevant]', '1|Internationalization and Localization Requirements', '1|Other Requirements',
    '1|Appendix A: Glossary', '1|Appendix B: Analysis Models',
  ],
  'swr-business-rules': ['1|Revision History', '1|Business Rules for <Project>'],
  'swr-data-dictionary': ['1|Revision History', '1|Data Dictionary for <Project>'],
};
const WKEYS = Object.keys(WIEGERS_OUTLINE);
const unnum = (s: string) => s.replace(/^(?:\d+(?:\.\d+)*\.?)\s+/, '');

describe('bộ mẫu SWR302 (Wiegers) — đề mục theo bản gốc (R25)', () => {
  for (const key of WKEYS) {
    it(key, async () => {
      const t = await getTemplate(key);
      const hs = outline(t.doc).map((h) => { const [lv, ...rest] = h.split('|'); return `${lv}|${unnum(rest.join('|'))}`; });
      let at = 0;
      for (const h of WIEGERS_OUTLINE[key]) {
        const i = hs.indexOf(h, at);
        assert.ok(i >= 0, `thiếu hoặc sai thứ tự: "${h}" (sau "${hs[at - 1] ?? '—'}")`);
        at = i + 1;
      }
      assert.equal(t.doc.content?.[0]?.type, 'blockquote');
      assert.ok(isGuideNote(t.doc.content![0]));
      assert.ok(t.summary.startsWith('SWR302 Deliverable'), t.summary);
      assert.match(t.title, /^SWR302 \(Wiegers\) — /);
      assert.ok(t.sections > 0);
      assert.ok(!t.pageTitle.startsWith('SWR302'), t.pageTitle);
    });
  }

  it('bảng đúng cột của bản gốc: Revision History, V&S Stakeholder/Priorities, UC List + 15 hàng, BR, Data Dictionary', async () => {
    const head = async (key: string, after: RegExp) => {
      const blocks = (await getTemplate(key)).doc.content ?? [];
      const i = blocks.findIndex((b) => b.type === 'heading' && after.test(unnum(plainText(b))));
      assert.ok(i >= 0, `${key}: ${after}`);
      const tb = blocks.slice(i + 1).find((b) => b.type === 'table')!;
      return (tb.content?.[0]?.content ?? []).map((c) => plainText(c));
    };
    for (const k of WKEYS) assert.deepEqual(await head(k, /^Revision History$/), ['Name', 'Date', 'Reason For Changes', 'Version'], k);
    assert.deepEqual(await head('swr-vision-scope', /^Stakeholder Profiles$/), ['Stakeholder', 'Major Value', 'Attitudes', 'Major Interests', 'Constraints']);
    assert.deepEqual(await head('swr-vision-scope', /^Project Priorities$/), ['Dimension', 'Driver (state objective)', 'Constraint (state limits)', 'Degree of Freedom (state allowable range)']);
    assert.deepEqual(await head('swr-use-cases', /^Use Case List$/), ['Primary Actor', 'Secondary actor', 'Use Case name', 'Description']);
    assert.deepEqual(await head('swr-business-rules', /^Business Rules for /), ['ID', 'Rule Definition', 'Type of Rule', 'Static or Dynamic', 'Source']);
    assert.deepEqual(await head('swr-data-dictionary', /^Data Dictionary for /), ['Data Element', 'Description', 'Composition or Data Type', 'Length', 'Values']);
    assert.deepEqual(await head('swr-srs', /^Data Dictionary$/), ['Data Element', 'Description', 'Composition or Data Type', 'Length', 'Values']);
    const blocks = (await getTemplate('swr-use-cases')).doc.content ?? [];
    const i = blocks.findIndex((b) => b.type === 'heading' && plainText(b) === 'Use Case Template');
    const uc = blocks.slice(i + 1).find((b) => b.type === 'table')!;
    const { WIEGERS_UC_ROWS } = await import('./swr.js');
    assert.deepEqual(uc.content!.map((r) => plainText(r.content![0])), [...WIEGERS_UC_ROWS]);
    assert.deepEqual(uc.content!.slice(1, 3).map((r) => plainText(r.content![2])), ['Date Created:', 'Secondary Actors:']);
  });

  it('thư viện mẫu có nhóm "SWR302 (Wiegers)" đủ 5 mẫu; bản sao frontend/public giống hệt', async () => {
    const list = await listTemplates();
    assert.deepEqual(list.filter((t) => t.group === 'SWR302 (Wiegers)').map((t) => t.key).sort(), [...WKEYS].sort());
    for (const k of WKEYS) {
      assert.equal(fs.readFileSync(path.resolve(`frontend/public/quy-trinh/mau/${k}.md`), 'utf8'), fs.readFileSync(path.resolve(`content/quy-trinh/mau/${k}.md`), 'utf8'));
    }
  });
});

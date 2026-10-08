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

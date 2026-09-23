/**
 * CT Work — lần chạy đầu: dữ liệu mẫu theo mẫu dự án + danh sách "Getting started".
 *
 * Dữ liệu mẫu đi qua ĐÚNG các service người dùng vẫn gọi (createIssueAs,
 * createSprint, createTest…) để lịch sử, sự kiện, số thẻ đều như thật. Mọi
 * id tạo ra được ghi vào settings.sampleData ⇒ gỡ ra đúng những gì đã thêm,
 * không đụng thẻ người dùng tự tạo (kể cả khi họ viết thêm việc con dưới thẻ mẫu).
 * Chữ hiển thị bằng tiếng Anh.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { setCustomValues } from './customize.service.js';
import { emitWorkEvent } from './events.js';
import { createIssueAs, updateIssueAs } from './issues.service.js';
import { requireProject } from './permissions.js';
import { upsertLabel } from './projects.service.js';
import { createSprint, deleteSprint, updateSprint } from './sprints.service.js';
import { MOSCOW_FIELD } from './templates.js';
import { createPlan, createTest, deletePlan } from './tests.service.js';

/** Dự án đã có từ ngần này thẻ trở lên thì không rải mẫu (tránh trộn vào việc thật). */
export const SAMPLE_MAX_EXISTING = 3;

export interface SampleDataRecord {
  issueIds: number[];
  labelIds: number[];
  planIds: number[];
  /** Sprint mẫu dùng; `sprintCreated` = do dữ liệu mẫu tạo (gỡ thì xoá). */
  sprintId: number | null;
  sprintCreated: boolean;
  at: string;
  by: number;
}

// ─── Nội dung mẫu ────────────────────────────────────────────────

interface StorySeed {
  title: string;
  points?: number;
  hours?: number;
  priority?: number;
  epic?: string;
  labels?: string[];
  story?: string;
  criteria?: string[];
  sprint?: boolean;
  subtasks?: string[];
  moscow?: 'must' | 'should' | 'could' | 'wont';
  type?: 'STORY' | 'TASK' | 'BUG' | 'REQUIREMENT';
  inProgress?: boolean;
}

interface SampleSet {
  labels: Array<{ name: string; color: string }>;
  epics: Array<{ title: string; body: string }>;
  items: StorySeed[];
  sprintGoal?: string;
  tests?: Array<{ title: string; requirement: string; preconditions: string; steps: Array<{ action: string; expected: string }> }>;
  planName?: string;
}

const LABELS = [
  { name: 'frontend', color: '#2563eb' },
  { name: 'backend', color: '#7c3aed' },
  { name: 'ui', color: '#db2777' },
  { name: 'payment', color: '#ca8a04' },
];

/** Đồ án Scrum (SWP391 / nhóm công ty / trống): cửa hàng online. */
const SHOP: SampleSet = {
  labels: LABELS,
  sprintGoal: 'Customers can sign up, browse products and fill a cart',
  epics: [
    { title: 'Authentication', body: 'Everything a customer needs to create an account and sign in safely.' },
    { title: 'Product catalog', body: 'Customers find the product they want in as few clicks as possible.' },
    { title: 'Checkout', body: 'From cart to paid order, including discounts and order history.' },
  ],
  items: [
    { title: 'Sign up with email and password', points: 3, priority: 2, epic: 'Authentication', labels: ['frontend', 'backend'], sprint: true,
      story: 'As a new customer, I want to create an account so that I can save my cart and orders.',
      criteria: ['Email must be valid and not already registered', 'Password has at least 8 characters', 'A confirmation email is sent after sign-up'],
      subtasks: ['Design the sign-up form', 'Create the users table and API', 'Send the confirmation email'] },
    { title: 'Log in and stay signed in', points: 2, priority: 2, epic: 'Authentication', labels: ['frontend', 'backend'], sprint: true,
      story: 'As a customer, I want to log in once so that I do not have to type my password every visit.',
      criteria: ['Wrong password shows a clear error', '"Remember me" keeps the session for 7 days', 'Logout clears the session on this device'] },
    { title: 'Reset a forgotten password', points: 3, priority: 3, epic: 'Authentication', labels: ['backend'], sprint: true,
      story: 'As a customer who forgot my password, I want a reset link so that I can get back into my account.',
      criteria: ['Reset link expires after 30 minutes', 'The old password stops working after a reset', 'The link can be used only once'] },
    { title: 'Sign in with Google', points: 5, priority: 4, epic: 'Authentication', labels: ['backend'],
      story: 'As a customer, I want to sign in with Google so that I do not need another password.',
      criteria: ['First Google sign-in creates an account', 'An existing email is linked, not duplicated'] },
    { title: 'Browse products by category', points: 3, priority: 2, epic: 'Product catalog', labels: ['frontend'], sprint: true,
      story: 'As a shopper, I want to browse by category so that I can see related products together.',
      criteria: ['Categories are listed on the home page', 'Each category page shows 20 products per page', 'Empty categories show a friendly message'] },
    { title: 'Search products by name', points: 5, priority: 3, epic: 'Product catalog', labels: ['frontend', 'backend'],
      story: 'As a shopper, I want to search by name so that I can find a product quickly.',
      criteria: ['Search ignores upper/lower case and Vietnamese accents', 'Results appear in under 1 second for 10,000 products', 'No results shows suggestions'] },
    { title: 'View product details with photos', points: 2, priority: 3, epic: 'Product catalog', labels: ['frontend', 'ui'], sprint: true,
      story: 'As a shopper, I want to see photos, price and stock so that I can decide to buy.',
      criteria: ['Up to 6 photos with zoom', 'Out-of-stock products cannot be added to the cart'] },
    { title: 'Admin: add and edit products', points: 5, priority: 3, epic: 'Product catalog', labels: ['backend'],
      story: 'As a shop admin, I want to manage products so that the catalog stays up to date.',
      criteria: ['Name, price and category are required', 'Photos are uploaded and resized automatically', 'Changes appear on the site immediately'] },
    { title: 'Add items to the shopping cart', points: 3, priority: 2, epic: 'Checkout', labels: ['frontend'], sprint: true,
      story: 'As a shopper, I want a cart so that I can buy several products at once.',
      criteria: ['Quantity can be changed or removed', 'The cart survives a page reload', 'The total updates immediately'] },
    { title: 'Apply a discount code', points: 2, priority: 4, epic: 'Checkout', labels: ['backend', 'payment'],
      story: 'As a shopper, I want to enter a discount code so that I pay the promoted price.',
      criteria: ['Invalid or expired codes show a clear error', 'Only one code per order'] },
    { title: 'Pay with VNPay', points: 8, priority: 1, epic: 'Checkout', labels: ['backend', 'payment'],
      story: 'As a shopper, I want to pay online with VNPay so that my order is confirmed right away.',
      criteria: ['Successful payment marks the order as Paid', 'A failed payment keeps the cart', 'The payment callback is verified with the secret key'],
      subtasks: ['Register a VNPay sandbox account', 'Handle the payment callback'] },
    { title: 'See my order history', points: 3, priority: 4, epic: 'Checkout', labels: ['frontend'],
      story: 'As a customer, I want to see past orders so that I can track deliveries.',
      criteria: ['Orders are listed newest first', 'Each order shows its status and items'] },
    { type: 'BUG', title: 'Cart total ignores quantity changes', priority: 2, labels: ['frontend'],
      story: 'Steps: add a product, change the quantity to 3. Expected: total ×3. Actual: total stays the same until reload.' },
    { type: 'BUG', title: 'Login button does nothing on mobile Safari', priority: 2, labels: ['frontend'],
      story: 'Steps: open the site on iPhone Safari, tap Log in. Expected: the login form opens. Actual: nothing happens.' },
    { type: 'BUG', title: 'Product photos are stretched on small screens', priority: 4, labels: ['ui'],
      story: 'Photos lose their aspect ratio below 400px width.' },
  ],
};

/** SWR302: yêu cầu + story, ưu tiên MoSCoW. */
const REQUIREMENTS: SampleSet = {
  labels: [{ name: 'functional', color: '#2563eb' }, { name: 'non-functional', color: '#7c3aed' }, { name: 'needs-clarification', color: '#ea580c' }],
  sprintGoal: 'Agree on the must-have requirements with the client',
  epics: [
    { title: 'Authentication', body: 'Requirements for accounts, sign-in and security.' },
    { title: 'Product catalog', body: 'Requirements for finding and viewing products.' },
    { title: 'Checkout', body: 'Requirements for cart, payment and orders.' },
  ],
  items: [
    { type: 'REQUIREMENT', title: 'The system shall let customers register with email and password', epic: 'Authentication', moscow: 'must', labels: ['functional'], sprint: true,
      criteria: ['Email is unique', 'Password rules are shown before submitting'] },
    { type: 'REQUIREMENT', title: 'The system shall lock an account after 5 failed logins', epic: 'Authentication', moscow: 'should', labels: ['non-functional'], sprint: true },
    { type: 'REQUIREMENT', title: 'Search results shall load in under 1 second', epic: 'Product catalog', moscow: 'should', labels: ['non-functional'], sprint: true },
    { type: 'REQUIREMENT', title: 'The system shall accept VNPay payments', epic: 'Checkout', moscow: 'must', labels: ['functional'], sprint: true },
    { type: 'REQUIREMENT', title: 'The system may recommend similar products', epic: 'Product catalog', moscow: 'could', labels: ['functional', 'needs-clarification'] },
    { type: 'REQUIREMENT', title: 'Cash on delivery will not be supported in version 1', epic: 'Checkout', moscow: 'wont', labels: ['functional'] },
    { title: 'Sign up with email and password', points: 3, priority: 2, epic: 'Authentication', moscow: 'must', sprint: true,
      story: 'As a new customer, I want to create an account so that I can save my cart and orders.',
      criteria: ['Email must be valid and not already registered', 'A confirmation email is sent'] },
    { title: 'Browse products by category', points: 3, priority: 3, epic: 'Product catalog', moscow: 'must', sprint: true,
      story: 'As a shopper, I want to browse by category so that I can see related products together.',
      criteria: ['Categories are listed on the home page'] },
    { title: 'Pay with VNPay', points: 8, priority: 2, epic: 'Checkout', moscow: 'must',
      story: 'As a shopper, I want to pay online so that my order is confirmed right away.',
      criteria: ['Successful payment marks the order as Paid', 'A failed payment keeps the cart'] },
    { title: 'Interview the shop owner about delivery rules', type: 'TASK', priority: 2, labels: ['needs-clarification'],
      subtasks: ['Prepare interview questions', 'Write up the meeting notes'] },
  ],
};

/** SWT301: yêu cầu (story) + test case có bước + plan + bug. */
const TESTING: SampleSet = {
  labels: [{ name: 'regression', color: '#2563eb' }, { name: 'smoke', color: '#16a34a' }, { name: 'ui', color: '#db2777' }],
  planName: 'Release 1.0 regression',
  epics: [{ title: 'Checkout', body: 'Cart, discount codes and payment — the flows under test.' }],
  items: [
    { title: 'Customer can log in with email and password', hours: 4, priority: 2, epic: 'Checkout',
      criteria: ['Valid credentials open the home page', 'Wrong password shows an error', 'Account locks after 5 failures'] },
    { title: 'Customer can add products to the cart', hours: 6, priority: 2, epic: 'Checkout',
      criteria: ['Quantity can be changed', 'The total updates immediately'] },
    { title: 'Customer can apply a discount code', hours: 3, priority: 3, epic: 'Checkout',
      criteria: ['Expired codes are rejected', 'Only one code per order'] },
    { type: 'BUG', title: 'Discount is applied twice when the page is refreshed', priority: 2, labels: ['regression'],
      story: 'Steps: apply code SALE10, press F5. Expected: 10% off. Actual: 20% off.' },
    { type: 'BUG', title: 'Error message overlaps the password field', priority: 4, labels: ['ui'],
      story: 'On screens narrower than 360px the error text covers the input.' },
  ],
  tests: [
    { title: 'Login with valid credentials', requirement: 'Customer can log in with email and password', preconditions: 'A registered account test@shop.vn / Passw0rd!',
      steps: [{ action: 'Open the login page', expected: 'The login form is shown' }, { action: 'Enter test@shop.vn and Passw0rd!, press Log in', expected: 'The home page opens with the user name in the header' }] },
    { title: 'Login with a wrong password', requirement: 'Customer can log in with email and password', preconditions: 'A registered account test@shop.vn',
      steps: [{ action: 'Enter test@shop.vn and a wrong password', expected: '"Incorrect email or password" is shown' }, { action: 'Check the password field', expected: 'The field is cleared, the email is kept' }] },
    { title: 'Account locks after 5 failed logins', requirement: 'Customer can log in with email and password', preconditions: 'A registered account that is not locked',
      steps: [{ action: 'Enter a wrong password 5 times', expected: 'The 5th attempt shows "Account locked for 15 minutes"' }, { action: 'Enter the correct password', expected: 'Login is still refused while locked' }] },
    { title: 'Change quantity in the cart', requirement: 'Customer can add products to the cart', preconditions: 'One product priced 100,000 VND in the cart',
      steps: [{ action: 'Set the quantity to 3', expected: 'The line total is 300,000 VND' }, { action: 'Reload the page', expected: 'Quantity 3 is kept' }] },
    { title: 'Apply a valid discount code', requirement: 'Customer can apply a discount code', preconditions: 'Code SALE10 (10%) is active; cart total 200,000 VND',
      steps: [{ action: 'Enter SALE10 and press Apply', expected: 'Total becomes 180,000 VND' }, { action: 'Refresh the page', expected: 'The discount is still 10%, not applied twice' }] },
    { title: 'Reject an expired discount code', requirement: 'Customer can apply a discount code', preconditions: 'Code OLD5 expired yesterday',
      steps: [{ action: 'Enter OLD5 and press Apply', expected: '"This code has expired" is shown' }, { action: 'Check the total', expected: 'The total is unchanged' }] },
  ],
};

/** Khách hàng tự do: việc theo giờ, sprint 1 tuần. */
const FREELANCE: SampleSet = {
  labels: [{ name: 'design', color: '#db2777' }, { name: 'dev', color: '#2563eb' }, { name: 'client-feedback', color: '#ea580c' }],
  sprintGoal: 'Approved design and a working home page',
  epics: [
    { title: 'Discovery', body: 'Understand what the client needs before building.' },
    { title: 'Website build', body: 'Design and build the pages agreed in the proposal.' },
  ],
  items: [
    { type: 'TASK', title: 'Kick-off call with the client', hours: 1, priority: 2, epic: 'Discovery', sprint: true, criteria: ['Goals, budget and deadline written down', 'Contact person agreed'] },
    { type: 'TASK', title: 'Collect logo, photos and brand colors', hours: 1, priority: 3, epic: 'Discovery', labels: ['client-feedback'], sprint: true },
    { type: 'TASK', title: 'Wireframe the home page', hours: 4, priority: 2, epic: 'Website build', labels: ['design'], sprint: true },
    { type: 'TASK', title: 'Build the home page', hours: 8, priority: 2, epic: 'Website build', labels: ['dev'], sprint: true, subtasks: ['Header and navigation', 'Hero section', 'Footer with contact details'] },
    { type: 'TASK', title: 'Contact form with email notification', hours: 3, priority: 3, epic: 'Website build', labels: ['dev'] },
    { type: 'TASK', title: 'Set up hosting and domain', hours: 2, priority: 3, epic: 'Website build', labels: ['dev'] },
    { type: 'BUG', title: 'Menu overlaps the logo on tablets', priority: 3, labels: ['design'] },
  ],
};

/** Kanban: dòng việc liên tục, không sprint. */
const KANBAN: SampleSet = {
  labels: [{ name: 'content', color: '#16a34a' }, { name: 'website', color: '#2563eb' }, { name: 'urgent', color: '#dc2626' }],
  epics: [{ title: 'Website refresh', body: 'Small improvements shipped continuously.' }],
  items: [
    { type: 'TASK', title: 'Update the pricing page', priority: 2, epic: 'Website refresh', labels: ['website'], inProgress: true },
    { type: 'TASK', title: 'Write the September newsletter', priority: 3, labels: ['content'], inProgress: true },
    { type: 'TASK', title: 'Fix broken links in the footer', priority: 2, epic: 'Website refresh', labels: ['website', 'urgent'] },
    { type: 'TASK', title: 'Add customer testimonials section', priority: 3, epic: 'Website refresh', labels: ['website'], criteria: ['3 testimonials with photo and name', 'Works on mobile'] },
    { type: 'TASK', title: 'Prepare social posts for the launch', priority: 4, labels: ['content'], subtasks: ['Facebook post', 'LinkedIn post'] },
    { type: 'TASK', title: 'Compress large images', priority: 4, labels: ['website'] },
    { type: 'BUG', title: 'Contact form sends empty emails', priority: 1, labels: ['website', 'urgent'] },
  ],
};

function pickSet(template: string, type: string): SampleSet {
  if (template === 'SWT301') return TESTING;
  if (type === 'KANBAN') return KANBAN;
  if (template === 'SWR302') return REQUIREMENTS;
  if (template === 'FREELANCE') return FREELANCE;
  return SHOP;
}

function doc(story?: string, criteria?: string[]): Prisma.InputJsonValue | undefined {
  const content: unknown[] = [];
  if (story) content.push({ type: 'paragraph', content: [{ type: 'text', text: story }] });
  if (criteria?.length) {
    content.push({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Acceptance criteria' }] });
    content.push({
      type: 'taskList',
      content: criteria.map((c) => ({ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: c }] }] })),
    });
  }
  return content.length ? ({ type: 'doc', content } as Prisma.InputJsonValue) : undefined;
}

function readRecord(settings: unknown): SampleDataRecord | null {
  const r = (settings as { sampleData?: SampleDataRecord } | null)?.sampleData;
  return r && Array.isArray(r.issueIds) ? r : null;
}

async function saveRecord(projectId: number, record: SampleDataRecord | null) {
  // Đọc lại settings ngay trước khi ghi: tránh đè cài đặt người khác vừa lưu.
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const settings = { ...((cur.settings as Record<string, unknown>) ?? {}) };
  if (record) settings.sampleData = record;
  else delete settings.sampleData;
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: settings as Prisma.InputJsonValue } });
}

// ─── Rải dữ liệu mẫu ─────────────────────────────────────────────

export async function addSampleData(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.settings');
  const project = await prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: {
      template: true, type: true, settings: true,
      issueTypes: { where: { archived: false }, select: { id: true, key: true, level: true } },
      labels: { select: { id: true, name: true } },
      customFields: { select: { id: true, name: true, kind: true } },
      workflows: { where: { isDefault: true }, select: { statuses: { orderBy: { position: 'asc' }, select: { id: true, category: true } } } },
    },
  });
  if (readRecord(project.settings)) throw new ConflictError('Sample data is already in this project. Remove it first.');
  const existing = await prisma.workIssue.count({ where: { projectId, deletedAt: null } });
  if (existing >= SAMPLE_MAX_EXISTING) {
    throw new BadRequestError('Sample data can only be added to a new project (fewer than 3 issues)', 'WORK_SAMPLE_NOT_EMPTY');
  }

  const set = pickSet(project.template, project.type);
  const settings = (project.settings ?? {}) as Record<string, unknown>;
  const hours = settings.estimation === 'HOURS';
  const typeId = (key: string) => project.issueTypes.find((t) => t.key === key)?.id;
  const standardType = typeId('STORY') ?? typeId('TASK') ?? project.issueTypes.find((t) => t.level === 0)?.id;
  if (!standardType) throw new BadRequestError('This project has no standard issue type to create sample issues', 'WORK_BAD_TYPE');

  const record: SampleDataRecord = { issueIds: [], labelIds: [], planIds: [], sprintId: null, sprintCreated: false, at: new Date().toISOString(), by: userId };
  // Ghi dấu SỚM: lỗi giữa chừng vẫn gỡ được những gì đã tạo.
  const flush = () => saveRecord(projectId, record);

  try {
    // Nhãn: dùng lại nhãn trùng tên có sẵn (không ghi vào record ⇒ gỡ mẫu không xoá nhãn của người dùng).
    const labelId = new Map<string, number>();
    for (const l of set.labels) {
      const have = project.labels.find((x) => x.name.toLowerCase() === l.name.toLowerCase());
      if (have) { labelId.set(l.name, have.id); continue; }
      const created = await upsertLabel(userId, projectId, l);
      labelId.set(l.name, created.id);
      record.labelIds.push(created.id);
    }

    // Sprint: Scrum mới có. Dùng "Sprint 1" trống do mẫu tạo sẵn, không có thì tạo.
    let sprintId: number | null = null;
    const wantsSprint = project.type === 'SCRUM' && set.items.some((i) => i.sprint);
    if (wantsSprint) {
      const planned = await prisma.workSprint.findFirst({
        where: { projectId, state: 'PLANNED', issues: { none: { deletedAt: null } } },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: { id: true, startAt: true },
      });
      if (planned) sprintId = planned.id;
      else {
        sprintId = (await createSprint(userId, projectId, {})).id;
        record.sprintCreated = true;
      }
      record.sprintId = sprintId;
      const len = Number(settings.sprintLengthDays) || 14;
      const start = new Date();
      start.setHours(9, 0, 0, 0);
      start.setDate(start.getDate() + 1);
      await updateSprint(userId, projectId, sprintId, {
        goal: set.sprintGoal ?? null,
        ...(planned?.startAt ? {} : { startAt: start, endAt: new Date(start.getTime() + len * 86_400_000) }),
      });
    }

    const epicId = new Map<string, number>();
    const epicType = typeId('EPIC');
    if (epicType) {
      for (const e of set.epics) {
        const issue = await createIssueAs(userId, projectId, { typeId: epicType, title: e.title, descriptionJson: doc(e.body) });
        record.issueIds.push(issue.id);
        epicId.set(e.title, issue.id);
      }
      await flush();
    }

    const moscowField = project.customFields.find((f) => f.name === MOSCOW_FIELD.name && f.kind === 'SELECT');
    const subType = typeId('SUBTASK');
    const inProgress = project.workflows[0]?.statuses.find((s) => s.category === 'IN_PROGRESS')?.id;
    const created = new Map<string, { id: number; number: number }>();

    for (const it of set.items) {
      const t = (it.type && typeId(it.type)) ?? (it.type === 'BUG' || it.type === 'REQUIREMENT' ? undefined : standardType);
      if (!t) continue; // mẫu không có loại này (vd SWR302 không có Bug)
      const issue = await createIssueAs(userId, projectId, {
        typeId: t,
        title: it.title,
        descriptionJson: doc(it.story, it.criteria),
        priority: it.priority,
        ...(hours
          ? (it.hours ? { originalEstimateMin: it.hours * 60 } : {})
          : (it.points !== undefined ? { storyPoints: it.points } : {})),
        parentId: it.epic ? epicId.get(it.epic) : undefined,
        sprintId: it.sprint && sprintId ? sprintId : undefined,
        assigneeId: it.sprint ? userId : undefined,
        labelIds: (it.labels ?? []).map((n) => labelId.get(n)).filter((x): x is number => !!x),
      });
      record.issueIds.push(issue.id);
      created.set(it.title, { id: issue.id, number: issue.number });
      if (moscowField && it.moscow) {
        await setCustomValues(userId, projectId, issue.number, { [moscowField.id]: it.moscow }).catch(() => undefined);
      }
      if (inProgress && it.inProgress) await updateIssueAs(userId, projectId, issue.number, { statusId: inProgress });
      if (subType) {
        for (const st of it.subtasks ?? []) {
          const sub = await createIssueAs(userId, projectId, { typeId: subType, title: st, parentId: issue.id, assigneeId: it.sprint ? userId : undefined });
          record.issueIds.push(sub.id);
        }
      }
    }
    await flush();

    if (set.tests?.length && typeId('TEST')) {
      const numbers: number[] = [];
      for (const tc of set.tests) {
        const req = created.get(tc.requirement);
        const r = await createTest(userId, projectId, {
          title: tc.title, preconditions: tc.preconditions, steps: tc.steps,
          requirementKeys: req ? [`${access.key}-${req.number}`] : [],
          labelIds: [labelId.get('regression')].filter((x): x is number => !!x),
        });
        numbers.push(r.number);
        const row = await prisma.workIssue.findFirst({ where: { projectId, number: r.number }, select: { id: true } });
        if (row) record.issueIds.push(row.id);
      }
      await flush();
      if (set.planName) record.planIds.push((await createPlan(userId, projectId, { name: set.planName, numbers })).id);
    }
  } catch (err) {
    await flush().catch(() => undefined);
    throw err;
  }

  await flush();
  await auditProject(projectId, { actorId: userId, action: 'project.sample', targetType: 'project', targetId: projectId, summary: `Added sample data (${record.issueIds.length} issues)` });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return { issues: record.issueIds.length, labels: record.labelIds.length, sprintId: record.sprintId, plans: record.planIds.length };
}

// ─── Gỡ dữ liệu mẫu ──────────────────────────────────────────────

export async function removeSampleData(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const rec = readRecord(p.settings);
  if (!rec) throw new BadRequestError('This project has no sample data', 'WORK_NO_SAMPLE');

  for (const planId of rec.planIds) await deletePlan(userId, projectId, planId).catch(() => undefined);

  // Xoá HẲN (không vào thùng rác): thẻ mẫu không phải công việc thật.
  // Thẻ của người dùng treo dưới thẻ mẫu chỉ mất cha (onDelete SetNull).
  const ids = rec.issueIds.filter((n) => Number.isInteger(n));
  const removed = ids.length
    ? (await prisma.workIssue.deleteMany({ where: { projectId, id: { in: ids } } })).count
    : 0;

  let sprintRemoved = false;
  if (rec.sprintId && rec.sprintCreated) {
    const s = await prisma.workSprint.findFirst({ where: { id: rec.sprintId, projectId }, select: { state: true, _count: { select: { issues: true } } } });
    if (s?.state === 'PLANNED') {
      await deleteSprint(userId, projectId, rec.sprintId); // thẻ thật còn trong đó về backlog
      sprintRemoved = true;
    } else if (s && s._count.issues === 0) {
      await prisma.workSprint.delete({ where: { id: rec.sprintId } });
      sprintRemoved = true;
    }
  }
  if (rec.labelIds.length) await prisma.workLabel.deleteMany({ where: { projectId, id: { in: rec.labelIds } } });

  await saveRecord(projectId, null);
  await auditProject(projectId, { actorId: userId, action: 'project.sample', targetType: 'project', targetId: projectId, summary: `Removed sample data (${removed} issues)` });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return { issues: removed, labels: rec.labelIds.length, sprintRemoved };
}

// ─── Danh sách "Getting started" ─────────────────────────────────

/**
 * Mỗi bước đọc từ DỮ LIỆU THẬT của dự án (không từ cờ "đã bấm"), nên làm
 * bằng cách khác (kéo thẻ trên board, mời qua trang thành viên…) vẫn được tích.
 */
export async function onboardingStatus(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const [p, issues, members, invites, plannedSprint, startedSprint, done, links] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { type: true, settings: true, visibility: true } }),
    prisma.workIssue.count({ where: { projectId, deletedAt: null } }),
    prisma.workMember.count({ where: { workspaceId: access.workspaceId } }),
    prisma.workInvite.count({ where: { workspaceId: access.workspaceId, revokedAt: null, expiresAt: { gt: new Date() } } }),
    prisma.workSprint.count({ where: { projectId, issues: { some: { deletedAt: null } } } }),
    prisma.workSprint.count({ where: { projectId, state: { in: ['ACTIVE', 'CLOSED'] } } }),
    prisma.workIssue.count({ where: { projectId, deletedAt: null, resolvedAt: { not: null } } }),
    prisma.workPublicLink.count({ where: { projectId, revokedAt: null } }),
  ]);
  const sample = readRecord(p.settings);
  const scrum = p.type === 'SCRUM';
  const steps = {
    createIssues: issues > 0,
    inviteTeam: members > 1 || invites > 0,
    planSprint: scrum ? plannedSprint > 0 : true,
    startSprint: scrum ? startedSprint > 0 : true,
    moveToDone: done > 0,
    shareLink: links > 0,
  };
  return {
    scrum,
    steps,
    completed: Object.values(steps).every(Boolean),
    issueCount: issues,
    sampleData: sample ? { issues: sample.issueIds.length, at: sample.at } : null,
    canAddSample: !sample && issues < SAMPLE_MAX_EXISTING,
  };
}

/**
 * Phiếu yêu cầu dự án (trang /about/quy-trinh — "Nhận dự án") và nút
 * "Tạo dự án CT Work" của admin.
 * ─────────────────────────────────────────────────────────────────────────
 * Vòng đời phiếu: NEW → QUALIFYING → ACCEPTED | DECLINED → PROJECT_CREATED.
 *
 * Tạo dự án đi QUA CÁC SERVICE CT Work có sẵn (projects / issues / share),
 * không ghi thẳng bảng — giống `scripts/labflow-seed/seed.mjs` — nên quyền,
 * lịch sử thẻ, sự kiện, số thẻ… y như người thật bấm.
 *
 * Mẫu dự án đọc LÚC CHẠY từ `content/quy-trinh/client-project-template.json`
 * (gói nội dung soạn). Chưa có file ⇒ dùng bản tối thiểu 3 giai đoạn ở dưới,
 * để nút vẫn chạy được và kiểm được.
 *
 * Idempotent (bấm hai lần không ra hai dự án), ba lớp:
 *   1. phiếu đã có `workProjectId` trỏ tới dự án còn sống ⇒ trả lại dự án đó;
 *   2. khoá dự án SUY RA TỪ MÃ PHIẾU (YC-2026-0001 → YC260001) + UNIQUE
 *      (workspace, key) của CSDL ⇒ hai lượt chạy song song thì lượt sau dội
 *      P2002, không thể đẻ dự án thứ hai;
 *   3. `work_project_id` UNIQUE trên `project_requests`.
 * Lỗi giữa chừng ⇒ xoá CỨNG đúng dự án vừa tạo theo id (giải phóng khoá) để
 * bấm lại được, không để một dự án dở dang mang khoá của phiếu.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { BadRequestError, ConflictError, NotFoundError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { createWorkspace } from './work/workspaces.service.js';
import { createProject, getProjectConfig, upsertLabel } from './work/projects.service.js';
import { createIssueAs } from './work/issues.service.js';
import { createLink } from './work/share.service.js';
import { ensureTeams } from './work/teams.service.js';
import { frontendUrl } from './work/common.js';

// ─── Hằng ───────────────────────────────────────────────────────

export const PROJECT_REQUEST_STATUSES = ['NEW', 'QUALIFYING', 'ACCEPTED', 'DECLINED', 'PROJECT_CREATED'] as const;
export type ProjectRequestStatus = (typeof PROJECT_REQUEST_STATUSES)[number];

export const PRODUCT_TYPES = ['WEB', 'APP', 'TOOL', 'AI', 'OTHER'] as const;
export const SECURITY_LEVELS = ['NORMAL', 'PERSONAL_DATA', 'SENSITIVE'] as const;

/**
 * Phiên bản thông báo xử lý dữ liệu (Luật BVDLCN 91/2025/QH15 + NĐ 356/2025/NĐ-CP) hiện hành — form gửi kèm,
 * thiếu thì lấy số này. PHẢI khớp `CONSENT_VERSION` trong frontend/src/app/about/nhan-du-an/PrivacyNotice.tsx.
 * 2026-10-01 = bản trích NĐ 13/2023 (đã hết hiệu lực); 2026-10-01b = đổi sang căn cứ hiện hành.
 */
export const CONSENT_VERSION = '2026-10-01b';

/** Đổi tay được: admin không được nhảy thẳng sang PROJECT_CREATED (chỉ nút tạo dự án làm việc đó). */
export const MANUAL_STATUSES: ProjectRequestStatus[] = ['NEW', 'QUALIFYING', 'ACCEPTED', 'DECLINED'];

const WORKSPACE_NAME = 'Dự án khách hàng';
/** Ghi đè đường dẫn mẫu bằng env (chỉ để kiểm thử); mặc định là file của gói nội dung. */
const TEMPLATE_PATH = path.resolve(process.env.CLIENT_PROJECT_TEMPLATE_PATH || 'content/quy-trinh/client-project-template.json');

// ─── Mã phiếu ───────────────────────────────────────────────────

/** YC-2026-0001 — đánh số lại mỗi năm. Hai người gửi cùng lúc ⇒ UNIQUE dội, thử số kế. */
async function nextCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `YC-${year}-`;
  const last = await prisma.projectRequest.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true },
  });
  const n = last ? Number(last.code.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(n).padStart(4, '0')}`;
}

/** YC-2026-0001 → YC260001 (khoá dự án CT Work: 2–10 chữ/số, bắt đầu bằng chữ). */
export function projectKeyFromCode(code: string): string {
  const m = /^YC-(\d{4})-(\d+)$/.exec(code);
  if (!m) throw new BadRequestError(`Mã phiếu không hợp lệ: ${code}`);
  return `YC${m[1].slice(2)}${m[2].padStart(4, '0')}`.slice(0, 10);
}

// ─── Tạo phiếu ──────────────────────────────────────────────────

export interface ProjectRequestInput {
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  senderRole?: string | null;
  productTypes: string[];
  needs: string;
  businessGoals?: string | null;
  endUsers?: string | null;
  existingSystems?: string | null;
  budgetRange?: string | null;
  desiredDeadline?: string | null;
  securityLevel?: string;
  securityNote?: string | null;
  consentVersion?: string | null;
  source?: string | null;
}

export async function createProjectRequest(
  input: ProjectRequestInput,
  meta: { ip?: string | null; userAgent?: string | null; isRoleplay?: boolean },
) {
  const clean = (s?: string | null) => (s && s.trim() ? s.trim() : null);
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = await nextCode();
    try {
      return await prisma.projectRequest.create({
        data: {
          code,
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          phone: clean(input.phone),
          organization: clean(input.organization),
          senderRole: clean(input.senderRole),
          productTypes: [...new Set(input.productTypes)],
          needs: input.needs.trim(),
          businessGoals: clean(input.businessGoals),
          endUsers: clean(input.endUsers),
          existingSystems: clean(input.existingSystems),
          budgetRange: clean(input.budgetRange),
          desiredDeadline: clean(input.desiredDeadline),
          securityLevel: input.securityLevel ?? 'NORMAL',
          securityNote: clean(input.securityNote),
          consent: true,
          consentAt: new Date(),
          consentVersion: clean(input.consentVersion) ?? CONSENT_VERSION,
          source: clean(input.source),
          ip: meta.ip?.slice(0, 64) ?? null,
          userAgent: meta.userAgent?.slice(0, 500) ?? null,
          isRoleplay: !!meta.isRoleplay,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') continue;
      throw err;
    }
  }
  throw new ConflictError('Không cấp được mã phiếu, vui lòng thử lại');
}

/** Một khách hàng GIẢ LẬP rõ nhãn — để admin tự luyện các vai. Không phải dữ liệu thật. */
export function roleplaySample(): ProjectRequestInput {
  return {
    name: '[NHẬP VAI] Khách hàng giả lập',
    email: 'nhap-vai@example.com',
    phone: null,
    organization: '[NHẬP VAI] Công ty giả lập — phòng khám tư nhân',
    senderRole: 'Giám đốc vận hành (vai giả lập)',
    productTypes: ['WEB', 'APP'],
    needs:
      'Phiếu NHẬP VAI để luyện quy trình — không phải khách thật.\n'
      + 'Phòng khám muốn cho bệnh nhân đặt lịch khám trực tuyến (web + app), nhận nhắc lịch, '
      + 'và cho lễ tân xem/đổi lịch trong một trang quản trị. Hiện đang ghi sổ giấy và nhận đặt lịch qua điện thoại.',
    businessGoals: 'Giảm cuộc gọi đặt lịch cho lễ tân; giảm tỉ lệ bệnh nhân lỡ hẹn nhờ nhắc lịch.',
    endUsers: 'Bệnh nhân (web/app), lễ tân, bác sĩ, quản lý phòng khám.',
    existingSystems: 'Chưa có phần mềm; danh sách bệnh nhân trong Excel.',
    budgetRange: 'Chưa xác định (vai giả lập)',
    desiredDeadline: '3 tháng (vai giả lập)',
    securityLevel: 'SENSITIVE',
    securityNote: 'Có dữ liệu sức khoẻ — dữ liệu cá nhân nhạy cảm theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP.',
    source: 'roleplay',
  };
}

// ─── Mẫu dự án CT Work ──────────────────────────────────────────

export interface ClientTemplateTask { summary: string; role: string; checklist: string[]; gate?: boolean; description?: string }
export interface ClientTemplateStage {
  slug: string; n: number; title: string; titleEn?: string;
  epic: { summary: string; description?: string };
  tasks: ClientTemplateTask[];
}
export interface ClientProjectTemplate { version: string | number; roles: Array<{ key: string; name: string; nameEn?: string }>; stages: ClientTemplateStage[] }

/** Bản tối thiểu khi gói nội dung chưa giao file JSON — đủ để nút chạy và kiểm được. */
const MINIMAL_TEMPLATE: ClientProjectTemplate = {
  version: 'minimal-0',
  roles: [
    { key: 'presales', name: 'Presales' },
    { key: 'ba', name: 'Business Analyst' },
    { key: 'pm', name: 'Project Manager' },
    { key: 'dev', name: 'Developer' },
    { key: 'qa', name: 'QA/QC' },
  ],
  stages: [
    {
      slug: 'tiep-nhan', n: 1, title: 'Tiếp nhận yêu cầu',
      epic: { summary: 'Tiếp nhận yêu cầu', description: 'Hiểu nhu cầu khách, đánh giá phù hợp.' },
      tasks: [
        { summary: 'Gọi tìm hiểu nhu cầu', role: 'presales', checklist: ['Đặt lịch gọi', 'Ghi biên bản', 'Gửi tóm tắt cho khách'] },
        { summary: 'Cổng chất lượng: tiếp nhận', role: 'pm', gate: true, checklist: ['Đã hiểu mục tiêu kinh doanh', 'Đã xác định người quyết định', 'Go/no-go đã ghi lại'] },
      ],
    },
    {
      slug: 'phan-tich-yeu-cau', n: 2, title: 'Phân tích yêu cầu',
      epic: { summary: 'Phân tích yêu cầu', description: 'Viết SRS, khách duyệt.' },
      tasks: [
        { summary: 'Viết SRS', role: 'ba', checklist: ['Use case', 'Yêu cầu phi chức năng', 'Khách duyệt'] },
        { summary: 'Cổng chất lượng: phân tích', role: 'pm', gate: true, checklist: ['SRS đã duyệt', 'Phạm vi đã chốt', 'Rủi ro đã ghi'] },
      ],
    },
    {
      slug: 'kiem-thu', n: 3, title: 'Kiểm thử',
      epic: { summary: 'Kiểm thử', description: 'Kế hoạch kiểm thử, chạy test, báo cáo.' },
      tasks: [
        { summary: 'Viết test case', role: 'qa', checklist: ['Phủ yêu cầu', 'Có dữ liệu test', 'Đã review'] },
        { summary: 'Sửa lỗi blocker', role: 'dev', checklist: ['Tái hiện', 'Sửa + test', 'Đóng bug'] },
        { summary: 'Cổng chất lượng: kiểm thử', role: 'pm', gate: true, checklist: ['Không còn bug blocker', 'Báo cáo kiểm thử đã gửi', 'Khách đồng ý UAT'] },
      ],
    },
  ],
};

/** Đọc + kiểm mẫu. Lỗi định dạng thì DỪNG (không dựng nửa vời từ mẫu hỏng); không có file thì dùng bản tối thiểu. */
export async function loadClientTemplate(): Promise<{ template: ClientProjectTemplate; source: 'file' | 'minimal' }> {
  let raw: string;
  try {
    raw = await fs.readFile(TEMPLATE_PATH, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { template: MINIMAL_TEMPLATE, source: 'minimal' };
    throw err;
  }
  let t: ClientProjectTemplate;
  try {
    t = JSON.parse(raw) as ClientProjectTemplate;
  } catch {
    throw new BadRequestError('client-project-template.json không phải JSON hợp lệ', 'TEMPLATE_INVALID');
  }
  const errs: string[] = [];
  const roles = new Set((t.roles ?? []).map((r) => r.key));
  if (!Array.isArray(t.stages) || !t.stages.length) errs.push('stages rỗng');
  for (const s of t.stages ?? []) {
    if (!s.slug || !s.title || !s.epic?.summary) errs.push(`giai đoạn ${s.slug ?? '?'}: thiếu slug/title/epic.summary`);
    if (!Array.isArray(s.tasks) || !s.tasks.length) errs.push(`giai đoạn ${s.slug}: không có việc`);
    for (const k of s.tasks ?? []) {
      if (!k.summary) errs.push(`giai đoạn ${s.slug}: việc thiếu summary`);
      if (!roles.has(k.role)) errs.push(`giai đoạn ${s.slug}: vai "${k.role}" không có trong roles`);
    }
  }
  if (errs.length) throw new BadRequestError(`Mẫu dự án không hợp lệ: ${errs.slice(0, 5).join('; ')}`, 'TEMPLATE_INVALID');
  return { template: t, source: 'file' };
}

// ─── TipTap ─────────────────────────────────────────────────────

type TNode = Record<string, unknown>;
const txt = (text: string): TNode => ({ type: 'text', text });
const P = (text: string): TNode => (text ? { type: 'paragraph', content: [txt(text)] } : { type: 'paragraph' });
const PB = (label: string, value: string): TNode => ({
  type: 'paragraph', content: [{ type: 'text', text: label, marks: [{ type: 'bold' }] }, txt(value)],
});
const H = (text: string): TNode => ({ type: 'heading', attrs: { level: 3 }, content: [txt(text)] });
const TASKS = (items: string[]): TNode => ({
  type: 'taskList',
  content: items.map((t) => ({ type: 'taskItem', attrs: { checked: false }, content: [P(t)] })),
});
const DOC = (...content: Array<TNode | TNode[] | null | false>): Prisma.InputJsonValue =>
  ({ type: 'doc', content: content.flat().filter(Boolean) }) as unknown as Prisma.InputJsonValue;
/** Đoạn văn nhiều dòng → mỗi dòng một paragraph (TipTap không giữ \n trong text). */
const paras = (s: string | null | undefined): TNode[] => (s ? s.split(/\n+/).map((l) => P(l.trim())).filter((p) => p.content) : []);

const LABEL_SECURITY: Record<string, string> = {
  NORMAL: 'Thông thường',
  PERSONAL_DATA: 'Có dữ liệu cá nhân',
  SENSITIVE: 'Dữ liệu cá nhân nhạy cảm (Luật BVDLCN 91/2025/QH15)',
};

type RequestRow = NonNullable<Awaited<ReturnType<typeof prisma.projectRequest.findUnique>>>;

function requestDoc(r: RequestRow) {
  return DOC(
    r.isRoleplay ? P('⚠ PHIẾU NHẬP VAI — khách hàng giả lập để luyện quy trình, không phải khách thật.') : null,
    H('Người gửi'),
    PB('Mã phiếu: ', r.code),
    PB('Họ tên: ', r.name),
    PB('Email: ', r.email),
    r.phone ? PB('SĐT: ', r.phone) : null,
    r.organization ? PB('Tổ chức: ', r.organization) : null,
    r.senderRole ? PB('Vai trò: ', r.senderRole) : null,
    H('Nhu cầu'),
    PB('Loại sản phẩm: ', r.productTypes.join(', ') || '—'),
    paras(r.needs),
    r.businessGoals ? [H('Mục tiêu kinh doanh'), ...paras(r.businessGoals)] : null,
    r.endUsers ? [H('Người dùng cuối'), ...paras(r.endUsers)] : null,
    r.existingSystems ? [H('Hệ thống hiện có'), ...paras(r.existingSystems)] : null,
    H('Ràng buộc'),
    PB('Ngân sách dự kiến: ', r.budgetRange ?? '—'),
    PB('Thời hạn mong muốn: ', r.desiredDeadline ?? '—'),
    PB('Mức bảo mật dữ liệu: ', LABEL_SECURITY[r.securityLevel] ?? r.securityLevel),
    r.securityNote ? paras(r.securityNote) : null,
    H('Đồng ý xử lý dữ liệu'),
    P(`Đã đồng ý lúc ${r.consentAt?.toISOString() ?? '—'} · thông báo phiên bản ${r.consentVersion ?? '—'}`),
    H('Việc đầu tiên'),
    TASKS(['Đọc kỹ phiếu, ghi câu hỏi làm rõ', 'Liên hệ khách xác nhận đã nhận phiếu', 'Chuyển sang giai đoạn đánh giá phù hợp (go/no-go)']),
  );
}

// ─── Tạo dự án CT Work ──────────────────────────────────────────

const ROLE_COLORS = ['#7c3aed', '#2563eb', '#0891b2', '#16a34a', '#ca8a04', '#ea580c', '#dc2626', '#db2777', '#475569', '#0d9488', '#4f46e5', '#65a30d', '#9333ea', '#b45309'];

export interface CreatedWorkProject {
  alreadyExisted: boolean;
  projectId: number;
  key: string;
  url: string;
  shareUrl: string | null;
  /** null = dự án đã có từ trước, lượt này không dựng gì. */
  templateSource: 'file' | 'minimal' | null;
  counts: { epics: number; tasks: number; gates: number; labels: number; teams?: number; teamsCreated?: number; stages?: number };
}

/**
 * Bộ phận dựng từ `roles` của mẫu (CÙNG bộ khoá với `DEPT_KEYS` của trang
 * /about/quy-trinh — sales, ba, ux… — nhưng mẫu JSON đọc được lúc chạy và mỗi
 * việc đã ghi sẵn `role`, nên ánh xạ việc → bộ phận là 1:1, không cần bảng dịch).
 * Vai `client` KHÔNG thành bộ phận: khách là người ngoài (GUEST), không thể là
 * thành viên bộ phận — việc của khách giữ nhãn `vai:client`, để trống bộ phận.
 */
export const CLIENT_ROLE_KEY = 'client';
export function teamDefsFromTemplate(t: ClientProjectTemplate) {
  return t.roles
    .filter((r) => r.key !== CLIENT_ROLE_KEY)
    .map((r, i) => ({ key: r.key.toUpperCase(), name: r.nameEn || r.name, color: ROLE_COLORS[i % ROLE_COLORS.length], description: r.name }));
}

async function liveProjectUrl(projectId: number) {
  const p = await prisma.workProject.findFirst({
    where: { id: projectId, deletedAt: null },
    select: { id: true, key: true, workspace: { select: { slug: true } } },
  });
  return p ? { id: p.id, key: p.key, url: frontendUrl(`/work/${p.workspace.slug}/${p.key}`) } : null;
}

async function activeShareUrl(projectId: number): Promise<string | null> {
  const l = await prisma.workPublicLink.findFirst({
    where: { projectId, revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { id: 'asc' },
    select: { token: true },
  });
  return l ? frontendUrl(`/work/share/${l.token}`) : null;
}

/** Không gian "Dự án khách hàng" của admin — chưa có thì tạo. */
async function ensureWorkspace(userId: number) {
  const find = () => prisma.workSpace.findFirst({
    where: { name: WORKSPACE_NAME, deletedAt: null, members: { some: { userId, role: { in: ['OWNER', 'ADMIN'] } } } },
    select: { id: true, slug: true },
    orderBy: { id: 'asc' },
  });
  const ws = await find();
  if (ws) return ws;
  try {
    const created = await createWorkspace(userId, {
      name: WORKSPACE_NAME,
      description: 'Dự án dựng từ phiếu yêu cầu của khách (/admin/project-requests).',
    });
    return { id: created.id, slug: created.slug };
  } catch (err) {
    // Hai lượt bấm cùng tạo không gian lần đầu ⇒ slug trùng; lượt kia đã tạo xong thì dùng nó.
    if (err instanceof ConflictError) {
      const again = await find();
      if (again) return again;
    }
    throw err;
  }
}

export async function createWorkProjectFromRequest(adminId: number, requestId: number): Promise<CreatedWorkProject> {
  const r = await prisma.projectRequest.findUnique({ where: { id: requestId } });
  if (!r) throw new NotFoundError('Không tìm thấy phiếu yêu cầu');

  // Lớp 1: đã có dự án còn sống ⇒ trả lại, không tạo nữa.
  if (r.workProjectId) {
    const live = await liveProjectUrl(r.workProjectId);
    if (live) {
      return {
        alreadyExisted: true, projectId: live.id, key: live.key, url: live.url,
        shareUrl: await activeShareUrl(live.id), templateSource: null,
        counts: { epics: 0, tasks: 0, gates: 0, labels: 0 },
      };
    }
  }
  if (r.status !== 'ACCEPTED' && r.status !== 'PROJECT_CREATED') {
    throw new BadRequestError('Chỉ tạo dự án cho phiếu đã ACCEPTED — duyệt phiếu trước', 'REQUEST_NOT_ACCEPTED');
  }

  const { template, source } = await loadClientTemplate();
  const ws = await ensureWorkspace(adminId);
  const key = projectKeyFromCode(r.code);

  // Lớp 2: khoá suy ra từ mã phiếu. Đã có dự án mang khoá này (lượt khác đang
  // chạy, hoặc dự án cũ đã xoá mềm vẫn giữ khoá) ⇒ không tạo thêm.
  const sameKey = await prisma.workProject.findFirst({ where: { workspaceId: ws.id, key }, select: { id: true, deletedAt: true } });
  if (sameKey) {
    if (sameKey.deletedAt) {
      throw new ConflictError(`Dự án ${key} đã bị xoá mềm nhưng vẫn giữ khoá — khôi phục hoặc xoá hẳn trong CT Work rồi thử lại`);
    }
    throw new ConflictError(`Dự án ${key} đang được tạo (lượt bấm khác) — đợi vài giây rồi tải lại`);
  }

  const title = (r.organization || r.name).replace(/^\[NHẬP VAI\]\s*/, '');
  let project: { id: number; key: string };
  try {
    project = await createProject(adminId, ws.id, {
      key,
      name: `${r.isRoleplay ? '[Nhập vai] ' : ''}${title} — ${r.code}`.slice(0, 120),
      description: `Dự án dựng từ phiếu ${r.code} (${r.isRoleplay ? 'NHẬP VAI' : 'khách thật'}). Mẫu quy trình: ${source === 'file' ? `client-project-template v${template.version}` : 'bản tối thiểu (chưa có file mẫu)'}.`,
      type: 'SCRUM',
      template: 'COMPANY',
      visibility: 'PRIVATE',
      firstSprint: false,
      // Dự án khách của studio: bật bộ phận, giai đoạn + cổng, phê duyệt, bàn giao.
      kind: 'CLIENT',
    });
  } catch (err) {
    // Hai lượt cùng lọt qua bước kiểm ở trên ⇒ UNIQUE (workspace, key) chặn lượt sau.
    if (err instanceof ConflictError) throw new ConflictError(`Dự án ${key} đang được tạo (lượt bấm khác) — đợi vài giây rồi tải lại`);
    throw err;
  }

  const pid = project.id;
  const counts = { epics: 0, tasks: 0, gates: 0, labels: 0, teams: 0, teamsCreated: 0, stages: 0 };
  try {
    // Bộ phận cấp không gian theo vai của mẫu (đã có thì dùng lại). Bộ phận MỚI
    // nhận admin làm trưởng để luôn có người giao việc từ hàng đợi.
    const teamDefs = teamDefsFromTemplate(template);
    const { byKey: teamByKey, created: teamsCreated } = await ensureTeams(ws.id, teamDefs, adminId);
    counts.teams = teamDefs.length;
    counts.teamsCreated = teamsCreated;
    const teamOf = (role: string) => (role === CLIENT_ROLE_KEY ? null : teamByKey.get(role.toUpperCase()) ?? null);

    // Nhãn: một nhãn mỗi vai (lọc thẻ theo vai khi nhập vai) + nhãn cổng + nhãn phiếu.
    const labelId: Record<string, number> = {};
    const roleName = new Map(template.roles.map((x) => [x.key, x.name]));
    const labelNames = [
      ...template.roles.map((x, i) => ({ name: `vai:${x.key}`, color: ROLE_COLORS[i % ROLE_COLORS.length] })),
      { name: 'cong-chat-luong', color: '#dc2626' },
      { name: 'yeu-cau-khach', color: '#0891b2' },
      ...(r.isRoleplay ? [{ name: 'nhap-vai', color: '#ca8a04' }] : []),
    ];
    for (const l of labelNames) {
      labelId[l.name] = (await upsertLabel(adminId, pid, l)).id;
      counts.labels++;
    }

    const cfg = await getProjectConfig(adminId, pid);
    const typeId = Object.fromEntries(cfg.issueTypes.map((t: { key: string; id: number }) => [t.key, t.id]));
    for (const k of ['EPIC', 'STORY', 'TASK']) if (!typeId[k]) throw new Error(`Thiếu loại thẻ ${k}`);
    const extra = r.isRoleplay ? [labelId['nhap-vai']] : [];

    // Thẻ #1 = phiếu yêu cầu của khách, mô tả đầy đủ.
    await createIssueAs(adminId, pid, {
      typeId: typeId.STORY,
      title: `Phiếu yêu cầu ${r.code} — ${title}`.slice(0, 255),
      descriptionJson: requestDoc(r),
      priority: 2,
      assigneeId: adminId,
      labelIds: [labelId['yeu-cau-khach'], ...extra],
    });

    const stages = [...template.stages].sort((a, b) => a.n - b.n);
    for (const [idx, s] of stages.entries()) {
      // Giai đoạn có cấu trúc (slug khớp /about/quy-trinh/<slug>); giai đoạn đầu chạy ngay.
      const stage = await prisma.workStage.create({
        data: {
          projectId: pid, n: s.n, slug: s.slug, name: (s.titleEn || s.title).slice(0, 160),
          ...(idx === 0 ? { status: 'ACTIVE', startedAt: new Date() } : {}),
        },
        select: { id: true },
      });
      counts.stages++;
      const epic = await createIssueAs(adminId, pid, {
        typeId: typeId.EPIC,
        title: `${s.n}. ${s.epic.summary}`.slice(0, 255),
        descriptionJson: DOC(
          paras(s.epic.description),
          PB('Giai đoạn: ', `${s.title} (/about/quy-trinh/${s.slug})`),
        ),
        priority: 3,
        stageId: stage.id,
        labelIds: extra,
      });
      counts.epics++;
      for (const k of s.tasks) {
        const roleLabel = labelId[`vai:${k.role}`];
        // Không giao cho admin nữa: để trống người làm, gán BỘ PHẬN theo vai —
        // trưởng bộ phận nhận từ hàng đợi. Nhãn vai:* giữ lại cho tương thích.
        const task = await createIssueAs(adminId, pid, {
          typeId: typeId.TASK,
          title: k.summary.slice(0, 255),
          descriptionJson: DOC(
            PB('Vai phụ trách: ', `${roleName.get(k.role) ?? k.role} (nhãn vai:${k.role})`),
            paras(k.description),
            H(k.gate ? 'Tiêu chí ra (exit criteria) — đủ hết mới qua giai đoạn' : 'Checklist'),
            k.checklist?.length ? TASKS(k.checklist) : P('—'),
          ),
          priority: k.gate ? 2 : 3,
          parentId: epic.id,
          teamId: teamOf(k.role),
          stageId: stage.id,
          labelIds: [roleLabel, ...(k.gate ? [labelId['cong-chat-luong']] : []), ...extra],
        });
        counts.tasks++;
        if (k.gate) {
          counts.gates++;
          await prisma.workStage.update({ where: { id: stage.id }, data: { gateIssueId: task.id } });
        }
      }
    }

    // Link chia sẻ chỉ đọc cho khách (board/backlog/báo cáo; KHÔNG mô tả thẻ —
    // mô tả có ghi chú nội bộ và chính phiếu với email/SĐT của khách).
    const link = await createLink(adminId, pid, {
      label: `Khách — ${r.code}`,
      options: { board: true, backlog: true, reports: true, tests: false, descriptions: false },
    });

    // Lớp 3: ghi id dự án — UNIQUE nên không thể có phiếu thứ hai trỏ cùng dự án.
    await prisma.projectRequest.update({
      where: { id: r.id },
      data: { workProjectId: pid, status: 'PROJECT_CREATED', statusChangedAt: new Date() },
    });

    return {
      alreadyExisted: false, projectId: pid, key: project.key,
      url: frontendUrl(`/work/${ws.slug}/${project.key}`), shareUrl: link.url, templateSource: source, counts,
    };
  } catch (err) {
    // Dọn đúng dự án vừa tạo theo id (xoá cứng để khoá được giải phóng — bấm lại được).
    logger.error('[project-request] tạo dự án CT Work hỏng giữa chừng — xoá dự án dở', {
      requestId, projectId: pid, error: err instanceof Error ? err.message : String(err),
    });
    await prisma.workProject.delete({ where: { id: pid } }).catch((e: unknown) => {
      logger.error('[project-request] không xoá được dự án dở', { projectId: pid, error: (e as Error).message });
    });
    throw err;
  }
}

/** Link dự án + link chia sẻ cho trang chi tiết admin. */
export async function workProjectInfo(projectId: number | null) {
  if (!projectId) return null;
  const live = await liveProjectUrl(projectId);
  if (!live) return { projectId, deleted: true as const, url: null, key: null, shareUrl: null };
  return { projectId, deleted: false as const, url: live.url, key: live.key, shareUrl: await activeShareUrl(projectId) };
}

/**
 * Xoá phiếu yêu cầu quá hạn lưu — đúng câu "Thời gian lưu" trong thông báo xử lý dữ liệu
 * (`frontend/src/app/about/nhan-du-an/PrivacyNotice.tsx`, phiên bản 2026-10-01b (câu này không đổi từ 2026-10-01), user xác nhận 12 tháng 01/10/2026):
 * "Tối đa 12 tháng kể từ lần liên lạc cuối nếu không đi tới hợp đồng".
 *   · Lần liên lạc cuối ≈ `updatedAt` (mọi lần đổi trạng thái/ghi chú đều chạm vào nó).
 *   · Phiếu đã thành dự án (`workProjectId` có, hoặc PROJECT_CREATED) = đã đi tới hợp đồng ⇒ KHÔNG xoá ở đây;
 *     giữ theo thời hạn lưu hồ sơ của hợp đồng.
 * Xoá cứng (không soft-delete) — giữ lại bản sao là trái với chính lời hứa trong thông báo.
 */
export const PROJECT_REQUEST_RETENTION_MONTHS = 12;
export async function purgeExpiredProjectRequests(now = new Date()): Promise<number> {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - PROJECT_REQUEST_RETENTION_MONTHS);
  const r = await prisma.projectRequest.deleteMany({
    where: { updatedAt: { lt: cutoff }, workProjectId: null, status: { not: 'PROJECT_CREATED' } },
  });
  return r.count;
}

// ─── Khách tự tra cứu phiếu (/about/nhan-du-an/tra-cuu) ─────────

/**
 * Hình dạng CÔNG KHAI của một phiếu — danh sách TRẮNG. Thêm cột mới vào
 * `project_requests` sẽ KHÔNG tự lộ ra đây; muốn khách thấy thì phải thêm tay.
 * Tuyệt đối không có: internalNote, phone, ip, userAgent, securityNote, ngân sách…
 */
export interface ProjectRequestPublicView {
  code: string;
  status: ProjectRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  statusChangedAt: Date | null;
  productTypes: string[];
  /** Tên tổ chức khách đã ghi (nếu có) — để khách nhận ra phiếu của mình. */
  organization: string | null;
  /** 240 ký tự đầu của phần "nhu cầu". */
  summary: string;
  /** Lời nhắn admin viết riêng cho khách (`clientNote`). */
  clientNote: string | null;
  /** Link CT Work chỉ đọc — chỉ khi phiếu đã thành dự án và link khách còn hiệu lực. */
  progressUrl: string | null;
}

export const LOOKUP_CODE_RE = /^YC-\d{4}-\d{1,6}$/;
const SUMMARY_MAX = 240;

/** Chuẩn hoá đầu vào tra cứu; sai định dạng ⇒ null (route trả CÙNG 404 như "không khớp"). */
export function normalizeLookup(code: string, email: string): { code: string; email: string } | null {
  const c = code.trim().toUpperCase();
  const e = email.trim().toLowerCase();
  if (!LOOKUP_CODE_RE.test(c) || !e.includes('@')) return null;
  return { code: c, email: e };
}

type LookupRow = {
  code: string; email: string; status: string; createdAt: Date; updatedAt: Date; statusChangedAt: Date | null;
  productTypes: string[]; organization: string | null; needs: string; clientNote: string | null;
};

/** So email KHÔNG phân biệt hoa thường. Tách riêng để kiểm thử không cần CSDL. */
export function emailMatches(stored: string, given: string): boolean {
  return stored.trim().toLowerCase() === given.trim().toLowerCase();
}

/** Ánh xạ hàng CSDL → bản công khai (danh sách trắng). */
export function toPublicView(r: LookupRow, progressUrl: string | null): ProjectRequestPublicView {
  const needs = r.needs.replace(/\s+/g, ' ').trim();
  return {
    code: r.code,
    status: (PROJECT_REQUEST_STATUSES as readonly string[]).includes(r.status) ? (r.status as ProjectRequestStatus) : 'NEW',
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    statusChangedAt: r.statusChangedAt,
    productTypes: r.productTypes,
    organization: r.organization?.replace(/^\[NHẬP VAI\]\s*/, '') || null,
    summary: needs.length > SUMMARY_MAX ? `${needs.slice(0, SUMMARY_MAX - 1).trimEnd()}…` : needs,
    clientNote: r.clientNote?.trim() || null,
    progressUrl,
  };
}

/**
 * Link tiến độ cho KHÁCH: chỉ dùng link mà nút "Tạo dự án CT Work" sinh riêng
 * cho phiếu này (nhãn `Khách — <mã>`, không chia sẻ mô tả thẻ), còn hiệu lực.
 * KHÔNG lấy link bất kỳ của dự án (có thể là link cho giảng viên, bật mô tả),
 * và KHÔNG tự tạo lại khi admin đã thu hồi — thu hồi là quyết định có chủ ý.
 */
async function clientProgressUrl(projectId: number, code: string): Promise<string | null> {
  const live = await prisma.workProject.findFirst({ where: { id: projectId, deletedAt: null, workspace: { deletedAt: null } }, select: { id: true } });
  if (!live) return null;
  const links = await prisma.workPublicLink.findMany({
    where: { projectId, label: `Khách — ${code}`, revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { id: 'desc' },
    select: { token: true, options: true },
  });
  const ok = links.find((l) => (l.options as { descriptions?: boolean } | null)?.descriptions !== true);
  return ok ? frontendUrl(`/work/share/${ok.token}`) : null;
}

/**
 * Tra cứu công khai: CHỈ trả khi cả mã VÀ email khớp. Không khớp / sai định
 * dạng / không tồn tại ⇒ null — route biến mọi trường hợp đó thành CÙNG một 404.
 */
export async function lookupProjectRequest(code: string, email: string): Promise<ProjectRequestPublicView | null> {
  const n = normalizeLookup(code, email);
  if (!n) return null;
  const r = await prisma.projectRequest.findUnique({
    where: { code: n.code },
    select: {
      code: true, email: true, status: true, createdAt: true, updatedAt: true, statusChangedAt: true,
      productTypes: true, organization: true, needs: true, clientNote: true, workProjectId: true,
    },
  });
  if (!r || !emailMatches(r.email, n.email)) return null;
  const progressUrl = r.workProjectId && r.status === 'PROJECT_CREATED' ? await clientProgressUrl(r.workProjectId, r.code) : null;
  return toPublicView(r, progressUrl);
}

/**
 * Gom dữ liệu chuyên đề "Việc làm Claude Code" và tính sẵn mọi con số.
 *
 * QUY TẮC: giao diện KHÔNG được gõ cứng con số nào. Lấy hết từ `STATS` ở
 * đây. Lý do đã trả giá một lần rồi: có trang từng ghi cứng "6 bài" trong
 * khi dữ liệu chỉ có 4, và số từ khai 512 trong khi đếm thật là 354.
 */
import { JOBS } from './jobs';
import { SKILLS } from './skills';
import { PHASES, TOTAL_TASKS } from './roadmap';
import { PROJECTS, PROJECT_STATS } from './projects';
import { APPLY_ITEMS } from './apply';
import type { Tier } from './types';

export * from './types';
export { JOBS } from './jobs';
export { SKILLS, SKILL_BY_ID, GROUP_LABEL } from './skills';
export { PHASES, TOTAL_TASKS } from './roadmap';
export { PROJECTS, PROJECT_STATS } from './projects';
export { APPLY_ITEMS } from './apply';

/** Ngày tôi bấm lại từng link để kiểm chứng — mốc tính tuổi tin. */
export const VERIFIED_ON = '05/08/2026';

/** Ngày aitmpl cập nhật tệp dữ liệu gốc. */
export const SOURCE_UPDATED = '04/08/2026';

/** Nhãn và mô tả cho 4 nhóm khả năng nộp. */
export const TIERS: {
  id: Tier;
  label: string;
  short: string;
  desc: string;
  tone: 'ok' | 'warn' | 'bad' | 'far';
}[] = [
  {
    id: 'A',
    label: 'Nộp được ngay',
    short: 'Nhóm A',
    desc: 'Mở cho toàn cầu hoặc đích danh Việt Nam, và không đòi cấp senior. Đây là chỗ duy nhất đáng bỏ công ngay bây giờ. Phần lớn là hợp đồng bán thời gian.',
    tone: 'ok',
  },
  {
    id: 'B',
    label: 'Mở địa lý nhưng đòi senior',
    short: 'Nhóm B',
    desc: 'Nhận người ở bất cứ đâu nhưng tuyển principal/staff, 5–15 năm kinh nghiệm. Ghi lại để nhắm 3–5 năm nữa, đừng nộp bây giờ.',
    tone: 'warn',
  },
  {
    id: 'C',
    label: 'Chặn cứng vì địa lý',
    short: 'Nhóm C',
    desc: '"REMOTE (US)" nghĩa là phải có quyền lao động tại Mỹ, không phải làm từ xa toàn cầu. Có tin chỉ nhận người ở Brazil, chỉ châu Âu, chỉ Canada.',
    tone: 'bad',
  },
  {
    id: 'D',
    label: 'Anthropic — chưa tới lượt',
    short: 'Nhóm D',
    desc: 'Toàn bộ từ Staff/Senior/Manager/Head trở lên, ngồi tại San Francisco, New York, Seattle, London, Sydney hoặc Washington DC. Không có vị trí junior, không có remote toàn cầu.',
    tone: 'far',
  },
];

const uniqKey = (j: { company: string; position: string }) => `${j.company}|${j.position}`;

/** Mọi con số hiện trên giao diện. Tính từ dữ liệu nên không bao giờ lệch. */
export const STATS = {
  jobs: JOBS.length,
  companies: new Set(JOBS.map((j) => j.company)).size,
  /** Sau khi gộp tin trùng (cùng công ty + cùng vị trí đăng lại nhiều tháng). */
  unique: new Set(JOBS.map(uniqKey)).size,
  remote: JOBS.filter((j) => j.remote).length,
  withSalary: JOBS.filter((j) => j.salary).length,
  fresh45: JOBS.filter((j) => j.ageDays <= 45).length,
  fresh7: JOBS.filter((j) => j.ageDays <= 7).length,
  stale90: JOBS.filter((j) => j.ageDays > 90).length,

  byTier: {
    A: JOBS.filter((j) => j.tier === 'A').length,
    B: JOBS.filter((j) => j.tier === 'B').length,
    C: JOBS.filter((j) => j.tier === 'C').length,
    D: JOBS.filter((j) => j.tier === 'D').length,
  } as Record<Tier, number>,

  /**
   * Nhóm A sau khi gộp tin đăng lại — đếm theo CÔNG TY, không phải theo
   * cơ hội. Lưu ý khi diễn giải: khoá gộp là công ty + tên vị trí, mà định
   * dạng HackerNews đặt tên vị trí rất thô, nên hai vai trò thật sự khác
   * nhau của We The Flywheel (Sài Gòn hybrid và remote toàn cầu) cùng mang
   * tên "Software Engineer" và bị gộp làm một. Số cơ hội thật nhỉnh hơn số
   * này một chút — đừng viết "N cơ hội" lên giao diện, viết "N công ty".
   */
  tierAUnique: new Set(JOBS.filter((j) => j.tier === 'A').map(uniqKey)).size,
  /** Nhóm A còn tươi dưới 60 ngày. */
  tierAFresh: JOBS.filter((j) => j.tier === 'A' && j.ageDays < 60).length,

  skills: SKILLS.length,
  skillsHave: SKILLS.filter((s) => s.have).length,
  skillsGap: SKILLS.filter((s) => !s.have).length,

  phases: PHASES.length,
  tasks: TOTAL_TASKS,
  projects: PROJECT_STATS.count,
  projectSteps: PROJECT_STATS.steps,
  applyItems: APPLY_ITEMS.length,
};

/** Số tin theo từng nguồn — dùng ở phần "đã kiểm thế nào". */
export const BY_SOURCE = JOBS.reduce<Record<string, number>>((acc, j) => {
  acc[j.source] = (acc[j.source] || 0) + 1;
  return acc;
}, {});

/** Khoá localStorage cho tiến độ tick. Đổi hậu tố khi cấu trúc đổi. */
export const PROGRESS_KEY = 'claude-jobs:progress:v1';

/**
 * Bỏ dấu để tìm kiếm — địa điểm trong tin toàn tiếng Anh, nhưng người dùng
 * sẽ gõ "sài gòn" hoặc "sai gon". Mỗi tin đã có sẵn trường `kw` tiếng Việt.
 */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();

/**
 * CV Builder — market & level conventions (Phase 3).
 * ─────────────────────────────────────────────────────────────────────────
 * One config object per market and per experience level, so the rules engine
 * changes BEHAVIOUR (not just labels) by market/level — and adding a JP/SG
 * market or tweaking fresher rules later is a one-place edit, never scattered
 * `if (market === 'VN')` branches through the codebase.
 */
export type CvMarket = 'VN' | 'INTERNATIONAL';
export type CvLevel = 'STUDENT' | 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

export interface MarketConventions {
  photoExpected: boolean; // conventional to include a photo
  photoAllowed: boolean; // including it is acceptable at all
  dobExpected: boolean;
  dobDiscouraged: boolean; // actively harmful/illegal to request in this market
  maxPagesUnder10y: number;
  englishCertIsCredential: boolean; // IELTS/TOEIC belongs prominently
  objectiveSectionOk: boolean;
  note: string;
}

export const MARKET_CONVENTIONS: Record<CvMarket, MarketConventions> = {
  VN: {
    photoExpected: true,
    photoAllowed: true,
    dobExpected: true,
    dobDiscouraged: false,
    maxPagesUnder10y: 2,
    englishCertIsCredential: true,
    objectiveSectionOk: true,
    note: 'Thị trường VN (đặc biệt outsourcing): ảnh & ngày sinh phổ biến; điểm IELTS/TOEIC là lợi thế thật; nền tảng & chứng chỉ được coi trọng.',
  },
  INTERNATIONAL: {
    photoExpected: false,
    photoAllowed: false,
    dobExpected: false,
    dobDiscouraged: true,
    maxPagesUnder10y: 1,
    englishCertIsCredential: false,
    objectiveSectionOk: false,
    note: 'Thị trường US/EU/remote: KHÔNG ảnh/ngày sinh/giới tính (một số ATS loại thẳng vì lý do tuân thủ); 1 trang cho <10 năm KN; ưu tiên thành tích + số liệu.',
  },
};

export interface LevelConventions {
  educationFirst: boolean; // education above experience
  projectsArePrimaryEvidence: boolean;
  flagNoWorkExperience: boolean; // fresher: NO — it's expected
  expectProjectLinks: boolean; // fresher/junior: an unlinked project is unverifiable
  penalizeTaskBullets: boolean; // senior: task-level bullets read as not-grown
  note: string;
}

export const LEVEL_CONVENTIONS: Record<CvLevel, LevelConventions> = {
  STUDENT: {
    educationFirst: true, projectsArePrimaryEvidence: true, flagNoWorkExperience: false,
    expectProjectLinks: true, penalizeTaskBullets: false,
    note: 'Sinh viên: học vấn lên đầu; dự án/hackathon/CLB là bằng chứng chính; KHÔNG coi "thiếu kinh nghiệm" là lỗi.',
  },
  FRESHER: {
    educationFirst: true, projectsArePrimaryEvidence: true, flagNoWorkExperience: false,
    expectProjectLinks: true, penalizeTaskBullets: false,
    note: 'Fresher: dự án là mục quan trọng nhất; mỗi dự án nên có link/repo/demo; đừng liệt kê môn học như thành tích.',
  },
  JUNIOR: {
    educationFirst: false, projectsArePrimaryEvidence: true, flagNoWorkExperience: false,
    expectProjectLinks: true, penalizeTaskBullets: false,
    note: 'Junior: cân bằng kinh nghiệm & dự án; bắt đầu kỳ vọng có kết quả đo được.',
  },
  MID: {
    educationFirst: false, projectsArePrimaryEvidence: false, flagNoWorkExperience: true,
    expectProjectLinks: false, penalizeTaskBullets: false,
    note: 'Mid: kinh nghiệm dẫn dắt; mỗi vai trò cần thành tích có số liệu, không chỉ nhiệm vụ.',
  },
  SENIOR: {
    educationFirst: false, projectsArePrimaryEvidence: false, flagNoWorkExperience: true,
    expectProjectLinks: false, penalizeTaskBullets: true,
    note: 'Senior: phạm vi/quyền sở hữu/quyết định kỹ thuật/ảnh hưởng kinh doanh; học vấn co lại 1 dòng; bullet cấp nhiệm vụ là điểm trừ.',
  },
  LEAD: {
    educationFirst: false, projectsArePrimaryEvidence: false, flagNoWorkExperience: true,
    expectProjectLinks: false, penalizeTaskBullets: true,
    note: 'Lead: lãnh đạo, mentorship, kết quả tổ chức & kinh doanh; tránh liệt kê chi tiết cài đặt cấp thấp.',
  },
};

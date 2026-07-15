/**
 * CV Builder — export templates (Phase 11).
 * Four templates, all single-column and ATS-safe (no two-column, no sidebars,
 * no skill-rating bars, no icons-for-labels — those get a candidate silently
 * rejected). Differences are typographic: accent, header layout, section order,
 * and whether VN-market fields (DOB) appear. Defined in code (not the CvTemplate
 * table) so they always render; the admin table can override metadata later.
 */
export type CvTemplateId = 'ats' | 'technical' | 'vietnam' | 'senior';

export interface CvTemplateSpec {
  id: CvTemplateId;
  name: string;
  description: string;
  accent: string;        // section headers + rule colour
  nameSize: number;
  centerHeader: boolean;
  summaryFirst: boolean; // lead with the professional summary (senior)
  educationEarly: boolean; // education above experience (VN/fresher convention)
  showDob: boolean;      // VN market convention
  bestFor: string;
}

export const CV_TEMPLATES: Record<CvTemplateId, CvTemplateSpec> = {
  ats: {
    id: 'ats', name: 'ATS-Optimized', description: 'Đơn cột, không trang trí, ATS đọc tối đa. An toàn nhất — mặc định.',
    accent: '#1a1a1a', nameSize: 22, centerHeader: false, summaryFirst: false, educationEarly: false, showDob: false,
    bestFor: 'Mọi thị trường, khi không chắc — chọn cái này.',
  },
  technical: {
    id: 'technical', name: 'Technical (Modern)', description: 'Đơn cột, phân cấp chữ tinh tế, có màu nhấn cho tiêu đề mục. Vẫn ATS-safe.',
    accent: '#1f5fbf', nameSize: 24, centerHeader: false, summaryFirst: false, educationEarly: false, showDob: false,
    bestFor: 'Kỹ sư nộp công ty tech, muốn nhìn hiện đại một chút.',
  },
  vietnam: {
    id: 'vietnam', name: 'Vietnamese Standard', description: 'Có ngày sinh, thứ tự mục theo thói quen NTD Việt (học vấn sớm). Song ngữ được.',
    accent: '#0f7a3d', nameSize: 22, centerHeader: true, summaryFirst: false, educationEarly: true, showDob: true,
    bestFor: 'Thị trường VN / công ty outsourcing, fresher–junior.',
  },
  senior: {
    id: 'senior', name: 'Senior / Leadership', description: 'Tóm tắt lên đầu, nhấn phạm vi & tác động, học vấn co lại. Cho 5+ năm.',
    accent: '#7a3d0f', nameSize: 26, centerHeader: false, summaryFirst: true, educationEarly: false, showDob: false,
    bestFor: 'Senior / Lead, ưu tiên ảnh hưởng hơn danh sách nhiệm vụ.',
  },
};

export function resolveTemplate(id?: string): CvTemplateSpec {
  return CV_TEMPLATES[(id as CvTemplateId)] ?? CV_TEMPLATES.ats;
}

export function listTemplates() {
  return Object.values(CV_TEMPLATES).map((t) => ({ id: t.id, name: t.name, description: t.description, bestFor: t.bestFor }));
}

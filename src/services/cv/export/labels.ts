/**
 * CV Builder — export section labels per language (Phase 11).
 * Content is translated by the AI (translate.service); these are the fixed
 * section headers the renderers stamp, so an English export reads fully English.
 */
export type ExportLang = 'VI' | 'EN';

export const SECTION_LABELS: Record<ExportLang, Record<string, string>> = {
  VI: { summary: 'Tóm tắt', experience: 'Kinh nghiệm làm việc', projects: 'Dự án', education: 'Học vấn', skills: 'Kỹ năng', languages: 'Ngoại ngữ', certifications: 'Chứng chỉ', other: 'Khác', gpa: 'GPA', dob: 'NS', tech: 'Công nghệ' },
  EN: { summary: 'Summary', experience: 'Work Experience', projects: 'Projects', education: 'Education', skills: 'Skills', languages: 'Languages', certifications: 'Certifications', other: 'Other', gpa: 'GPA', dob: 'DOB', tech: 'Tech' },
};

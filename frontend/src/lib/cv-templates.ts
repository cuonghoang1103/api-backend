/**
 * CV Builder — client-side template specs (W1 live preview).
 * Mirror of src/services/cv/export/templates.ts on the backend so the live
 * preview matches the exported PDF (accent, header layout, section order, DOB).
 * Keep the two files in sync when templates change.
 */
export type CvTemplateId = 'ats' | 'technical' | 'vietnam' | 'senior';

export interface CvTemplateSpecFE {
  id: CvTemplateId;
  name: string;
  accent: string;
  nameSizePx: number;
  centerHeader: boolean;
  educationEarly: boolean;
  showDob: boolean;
}

export const CV_TEMPLATES_FE: Record<CvTemplateId, CvTemplateSpecFE> = {
  ats: { id: 'ats', name: 'ATS-Optimized', accent: '#1a1a1a', nameSizePx: 26, centerHeader: false, educationEarly: false, showDob: false },
  technical: { id: 'technical', name: 'Technical (Modern)', accent: '#1f5fbf', nameSizePx: 28, centerHeader: false, educationEarly: false, showDob: false },
  vietnam: { id: 'vietnam', name: 'Vietnamese Standard', accent: '#0f7a3d', nameSizePx: 26, centerHeader: true, educationEarly: true, showDob: true },
  senior: { id: 'senior', name: 'Senior / Leadership', accent: '#7a3d0f', nameSizePx: 30, centerHeader: false, educationEarly: false, showDob: false },
};

export function resolveTemplateFE(id?: string | null): CvTemplateSpecFE {
  return CV_TEMPLATES_FE[(id as CvTemplateId) ?? 'ats'] ?? CV_TEMPLATES_FE.ats;
}

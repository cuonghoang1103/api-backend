/**
 * CV Builder — API client.
 * Axios group over /api/v1/cv (user) and /api/v1/admin/cv (admin). Auth is the
 * shared cookie + 401-refresh interceptor in ./api. Callers unwrap res.data.data.
 */
import { api } from './api';
import type { ApiResponse } from '@/types';
import type {
  CvProfile, CvProfilePatch, CvCompleteness,
  CvItem, CvItemInput, CvBullet, CvBulletInput,
  CvSkill, CvSkillInput, CvCertification, CvCertInput,
  CvLanguageSkill, CvLangInput,
  CvImportJob, CvImportCommitBody,
} from '@/types/cv';

type Res<T> = Promise<{ data: ApiResponse<T> }>;

export const cvApi = {
  // ── Master profile ──────────────────────────────────────────
  getProfile: (): Res<CvProfile> => api.get('/cv/profile'),
  updateProfile: (body: CvProfilePatch): Res<CvProfile> => api.put('/cv/profile', body),
  completeness: (): Res<CvCompleteness> => api.get('/cv/profile/completeness'),

  // ── Items (experience / project / education / …) ────────────
  createItem: (body: CvItemInput): Res<CvItem> => api.post('/cv/items', body),
  updateItem: (id: number, body: CvItemInput): Res<CvItem> => api.put(`/cv/items/${id}`, body),
  deleteItem: (id: number): Res<{ id: number }> => api.delete(`/cv/items/${id}`),

  // ── Bullets ─────────────────────────────────────────────────
  createBullet: (itemId: number, body: CvBulletInput): Res<CvBullet> => api.post(`/cv/items/${itemId}/bullets`, body),
  updateBullet: (id: number, body: CvBulletInput): Res<CvBullet> => api.put(`/cv/bullets/${id}`, body),
  verifyBullet: (id: number, verified: boolean): Res<CvBullet> => api.post(`/cv/bullets/${id}/verify`, { verified }),
  deleteBullet: (id: number): Res<{ id: number }> => api.delete(`/cv/bullets/${id}`),

  // ── Skills ──────────────────────────────────────────────────
  createSkill: (body: CvSkillInput): Res<CvSkill> => api.post('/cv/skills', body),
  updateSkill: (id: number, body: CvSkillInput): Res<CvSkill> => api.put(`/cv/skills/${id}`, body),
  deleteSkill: (id: number): Res<{ id: number }> => api.delete(`/cv/skills/${id}`),

  // ── Certifications ──────────────────────────────────────────
  createCert: (body: CvCertInput): Res<CvCertification> => api.post('/cv/certifications', body),
  updateCert: (id: number, body: CvCertInput): Res<CvCertification> => api.put(`/cv/certifications/${id}`, body),
  deleteCert: (id: number): Res<{ id: number }> => api.delete(`/cv/certifications/${id}`),

  // ── Language skills ─────────────────────────────────────────
  createLang: (body: CvLangInput): Res<CvLanguageSkill> => api.post('/cv/languages', body),
  updateLang: (id: number, body: CvLangInput): Res<CvLanguageSkill> => api.put(`/cv/languages/${id}`, body),
  deleteLang: (id: number): Res<{ id: number }> => api.delete(`/cv/languages/${id}`),

  // ── Import (Phase 2a: paste + JSON Resume) ──────────────────
  listImports: (): Res<CvImportJob[]> => api.get('/cv/import'),
  importPaste: (text: string): Res<CvImportJob> => api.post('/cv/import/paste', { text }),
  importUpload: (file: File): Res<CvImportJob> => {
    const fd = new FormData();
    fd.append('file', file);
    // PDF text extraction can take a few seconds on big/complex files.
    return api.post('/cv/import/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60_000 });
  },
  importJsonResume: (resume: unknown): Res<CvImportJob> => api.post('/cv/import/json-resume', { resume }),
  getImport: (id: number): Res<CvImportJob> => api.get(`/cv/import/${id}`),
  commitImport: (id: number, body: CvImportCommitBody): Res<{ committed: boolean; counts: Record<string, number> }> =>
    api.post(`/cv/import/${id}/commit`, body),
};

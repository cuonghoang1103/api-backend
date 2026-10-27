/**
 * CT Work 27/10/2026 — GitHub App "CT Work by CuongThai" (backend: src/services/work/githubApp.service.ts,
 * tuyến src/routes/work.githubApp.routes.ts). Khoá của app KHÔNG BAO GIỜ tới trình duyệt.
 */
import { api } from '@/lib/api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export interface GithubAppStatus { configured: boolean; source: 'env' | 'db' | null; appId: string | null; slug: string | null; htmlUrl: string | null; owner: string | null; oauthOnInstall: boolean }
export interface ProjectGithubApp {
  appConfigured: boolean; appSlug: string | null; canManage: boolean; installUrl: string | null;
  linked: { installationId: number; repoId: number | null; repoFullName: string | null; suspended: boolean } | null;
  mode: 'app' | 'pat' | 'anonymous' | 'none';
}

export const githubAppApi = {
  status: () => d<GithubAppStatus>(api.get('/work/github-app/status')),
  manifest: (org: string | null) => d<{ action: string; manifest: string; state: string }>(api.post('/work/github-app/manifest', { org })),
  project: (pid: number) => d<ProjectGithubApp>(api.get(`/work/projects/${pid}/github-app`)),
  repos: (pid: number, ticket: string) => d<{ installationId: number; repos: Array<{ id: number; fullName: string; private: boolean; defaultBranch: string | null }> }>(api.get(`/work/projects/${pid}/github-app/repos?ticket=${encodeURIComponent(ticket)}`)),
  link: (pid: number, ticket: string, repoId: number) => d<{ linked: boolean; repoFullName: string }>(api.post(`/work/projects/${pid}/github-app/link`, { ticket, repoId })),
  unlink: (pid: number) => d<{ linked: boolean }>(api.delete(`/work/projects/${pid}/github-app`)),
};

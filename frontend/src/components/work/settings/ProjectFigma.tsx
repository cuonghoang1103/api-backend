'use client';

/**
 * Cài đặt dự án → Figma (19/10/2026). Trợ lý AI của CT Work đọc link ngoài trong thẻ:
 *   - Google Docs / Sheets / Slides / Drive công khai, GitHub ⇒ đọc thẳng, không cần cài gì;
 *   - Figma ⇒ không token chỉ có tiêu đề + ảnh xem trước; ADMIN dán personal access token CHỈ ĐỌC
 *     (scope file_content:read) ⇒ trợ lý đọc được cấu trúc màn hình, chữ trong layer, bình luận.
 * Token gửi MỘT CHIỀU (PUT /projects/:pid/figma/token) — máy chủ mã hoá, không bao giờ trả lại; ở đây chỉ hiện "đã lưu".
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ExternalLink, KeyRound, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { currentWorkLocale } from '@/components/work/i18n/store';
import { Spinner } from '../ui';
import { Section } from './shared';

type Env<T> = { success: boolean; data: T };
interface FigmaStatus { hasToken: boolean; handle: string | null; savedAt: string | null; canEdit: boolean }

const L = (vi: string, en: string) => (currentWorkLocale() === 'vi' ? vi : en);

export default function ProjectFigma({ config }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const key = ['work', 'figma', pid] as const;
  const [token, setToken] = useState('');
  const q = useQuery({
    queryKey: key,
    queryFn: () => api.get<Env<FigmaStatus>>(`/work/projects/${pid}/figma`).then((r) => r.data.data),
  });
  const save = useMutation({
    mutationFn: (t: string | null) => api.put<Env<{ hasToken: boolean; handle: string | null }>>(`/work/projects/${pid}/figma/token`, { token: t }).then((r) => r.data.data),
    onSuccess: (r) => {
      setToken('');
      void qc.invalidateQueries({ queryKey: key });
      toast.success(r.hasToken ? L(`Đã lưu token Figma${r.handle ? ` (${r.handle})` : ''}.`, `Figma token saved${r.handle ? ` (${r.handle})` : ''}.`) : L('Đã gỡ token Figma.', 'Figma token removed.'));
    },
    onError: (err) => toast.error(workError(err, L('Không lưu được token.', 'Could not save the token.'))),
  });

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  const st = q.data;
  const canEdit = !!st?.canEdit;

  return (
    <div className="space-y-6">
      <Section
        title={L('Link ngoài trong thẻ', 'External links on issues')}
        description={L(
          'Trợ lý AI tự đọc nội dung link gắn trong thẻ (mô tả, bình luận, web links): Google Docs/Sheets/Slides/Drive đã bật "Bất kỳ ai có đường liên kết", repo/issue/PR GitHub công khai. Link riêng tư ⇒ trợ lý báo cần chủ tài liệu mở chia sẻ.',
          'The AI assistant reads the content of links on an issue (description, comments, web links): Google Docs/Sheets/Slides/Drive shared as "Anyone with the link", public GitHub repos/issues/PRs. Private links ⇒ the assistant says the owner must share them.',
        )}
      />
      <Section
        title="Figma"
        description={L(
          'Không có token: trợ lý chỉ thấy tiêu đề + ảnh xem trước của file công khai. Có token CHỈ ĐỌC: thấy các màn hình (frame), chữ trong từng layer và bình luận.',
          'Without a token the assistant only sees the title + preview of public files. With a READ-ONLY token it sees screens (frames), the text in every layer and comments.',
        )}
      >
        <div className="rounded-[10px] border border-[var(--w-border)] p-4">
          <div className="flex flex-wrap items-center gap-2 text-[13.5px]">
            {st?.hasToken ? <ShieldCheck size={16} className="text-[var(--w-green)]" /> : <KeyRound size={16} className="text-[var(--w-text-3)]" />}
            <span className="font-medium">
              {st?.hasToken
                ? L(`Đã có token${st.handle ? ` của ${st.handle}` : ''}`, `Token saved${st.handle ? ` (${st.handle})` : ''}`)
                : L('Chưa có token', 'No token yet')}
            </span>
            {st?.savedAt && <span className="text-[12px] text-[var(--w-text-3)]">· {new Date(st.savedAt).toLocaleDateString()}</span>}
          </div>
          {canEdit ? (
            <form
              className="mt-3 flex flex-wrap gap-2"
              onSubmit={(e) => { e.preventDefault(); if (token.trim()) save.mutate(token.trim()); }}
            >
              <input
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={L('Dán personal access token (figd_…)', 'Paste a personal access token (figd_…)')}
                className="w-input min-w-[260px] flex-1 font-mono text-[13px]"
                aria-label={L('Token Figma', 'Figma token')}
              />
              <button type="submit" className="w-btn w-btn-primary" disabled={!token.trim() || save.isPending}>
                {save.isPending ? <Spinner size={12} /> : null}{L('Lưu', 'Save')}
              </button>
              {st?.hasToken && (
                <button type="button" className="w-btn" disabled={save.isPending} onClick={() => save.mutate(null)}>{L('Gỡ token', 'Remove')}</button>
              )}
            </form>
          ) : (
            <p className="mt-2 text-[12.5px] text-[var(--w-text-3)]">{L('Chỉ quản trị dự án đổi được token.', 'Only project admins can change the token.')}</p>
          )}
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[12.5px] text-[var(--w-text-2)]">
            <li>{L('Figma → Settings → Security → Personal access tokens → Generate new token.', 'Figma → Settings → Security → Personal access tokens → Generate new token.')}</li>
            <li>{L('Chỉ cấp quyền "File content: Read-only" (file_content:read) — không cấp quyền ghi.', 'Grant only "File content: Read-only" (file_content:read) — no write scopes.')}</li>
            <li>{L('Token được mã hoá trên máy chủ, không bao giờ hiện lại, không gửi cho trình duyệt hay AI agent.', 'The token is encrypted on the server, never shown again, never sent to browsers or AI agents.')}</li>
            {/* QA đợt 7: personal access token đọc được MỌI file tài khoản đó xem được — thành viên nào dán link Figma vào thẻ
                cũng nhờ trợ lý đọc được file ấy bằng token này. */}
            <li>{L('Token đọc được MỌI file mà tài khoản Figma đó xem được, và mọi thành viên dự án dán link Figma vào thẻ đều nhờ trợ lý đọc được bằng nó — nên dùng tài khoản Figma chỉ có file của dự án này.', 'The token can read EVERY file that Figma account can view, and any project member who pastes a Figma link into an issue can have the assistant read it — use a Figma account that only has this project\'s files.')}</li>
          </ul>
          <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-[var(--w-accent-text)] hover:underline">
            {L('Hướng dẫn của Figma', 'Figma docs')} <ExternalLink size={12} />
          </a>
        </div>
      </Section>
    </div>
  );
}

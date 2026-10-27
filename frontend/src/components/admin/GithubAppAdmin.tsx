'use client';

/**
 * CT Work 27/10/2026 — trang admin "GitHub App CT Work": tạo app MỘT LẦN bằng GitHub App Manifest flow (form POST tới GitHub;
 * GitHub chuyển về backend, backend đổi `code` lấy khoá và lưu MÃ HOÁ — khoá không bao giờ tới trình duyệt). Biến môi
 * trường GITHUB_APP_* (nếu đặt) thắng bản trong CSDL. Tài liệu: docs/ctw-github-app.md.
 */

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { githubAppApi, type GithubAppStatus } from '@/lib/work-github-app-api';

export default function GithubAppAdmin() {
  const search = useSearchParams();
  const [st, setSt] = useState<GithubAppStatus | null>(null);
  const [org, setOrg] = useState('');
  const [err, setErr] = useState<string | null>(search?.get('error') ?? null);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<{ action: string; manifest: string } | null>(null);

  useEffect(() => { githubAppApi.status().then(setSt).catch((e) => setErr(String(e?.message ?? e))); }, []);
  useEffect(() => { if (form) formRef.current?.submit(); }, [form]);

  const create = async () => {
    setBusy(true); setErr(null);
    try { setForm(await githubAppApi.manifest(org.trim() || null)); } catch (e) { setErr(String((e as Error)?.message ?? e)); setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">GitHub App CT Work</h1>
      <p className="text-sm opacity-80">
        Đường chính để nhóm nối GitHub với dự án CT Work: cài app lên repo thay vì chép token + dán webhook. App đọc code, nhận
        push / pull request / CI và cho CuongMini đăng review lên PR (dạng bình luận — không bao giờ duyệt hay merge).
      </p>
      {search?.get('created') && <p className="rounded border border-green-600 p-3 text-sm">Đã tạo app <b>{search.get('created')}</b>. Khoá đã lưu mã hoá trong CSDL.</p>}
      {err && <p className="rounded border border-red-600 p-3 text-sm" role="alert">{err}</p>}
      {st && (
        st.configured ? (
          <div className="space-y-1 rounded border p-4 text-sm">
            <div>Trạng thái: <b>đã có app</b> ({st.source === 'env' ? 'từ biến môi trường' : 'lưu mã hoá trong CSDL'})</div>
            <div>App ID: {st.appId} · slug: {st.slug}{st.owner ? ` · chủ: ${st.owner}` : ''}</div>
            <div>Xác minh người cài (OAuth khi cài): {st.oauthOnInstall ? 'có' : 'THIẾU client id/secret — người cài sẽ không qua bước xác minh'}</div>
            {st.htmlUrl && <a className="underline" href={st.htmlUrl} target="_blank" rel="noopener noreferrer">Mở trang app trên GitHub</a>}
          </div>
        ) : (
          <div className="space-y-3 rounded border p-4 text-sm">
            <div>Chưa có app. Bấm nút dưới — GitHub mở trang xác nhận, bạn bấm <i>Create GitHub App</i>, rồi được đưa về đây.</div>
            <label className="block">
              Tổ chức GitHub (để trống = tài khoản cá nhân của bạn)
              <input className="mt-1 block w-full rounded border bg-transparent px-2 py-1" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="vd. cuongthai" />
            </label>
            <button type="button" className="rounded bg-black px-3 py-1.5 text-white disabled:opacity-50 dark:bg-white dark:text-black" onClick={create} disabled={busy}>
              {busy ? 'Đang chuyển sang GitHub…' : 'Tạo GitHub App CT Work'}
            </button>
          </div>
        )
      )}
      {form && (
        <form ref={formRef} method="post" action={form.action} className="hidden">
          <input type="hidden" name="manifest" value={form.manifest} />
        </form>
      )}
    </div>
  );
}

'use client';

/**
 * Thẻ "Tên đăng nhập" của /settings/profile (04/10/2026) — dùng chung cho web và app
 * desktop (app nạp nguyên trang này qua dinhTuyenWeb).
 *
 * Người đăng nhập bằng Google/GitHub/Apple được máy chủ tự đặt tên kiểu
 * `ten.email_mf2k3x9` và chê xấu. Ở đây đổi được, kiểm trùng ngay khi ngừng gõ,
 * và (mặc định) dùng luôn tên mới làm tên hiển thị.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AtSign, Check, Loader2, X } from 'lucide-react';
import { authApi } from '@/lib/api';
import { SettingsCard, Field, TextInput, Button } from '@/components/settings/primitives';

type Kiem = { hopLe: boolean; conTrong: boolean; ten: string; lyDo?: string };

const TEN_NHA_CUNG_CAP: Record<string, string> = { google: 'Google', github: 'GitHub', apple: 'Apple', facebook: 'Facebook' };

export function TheTenDangNhap({ username, provider, onDoi }: {
  username: string;
  provider?: string | null;
  /** Hồ sơ mới sau khi đổi — trang cập nhật ô tên hiển thị + thanh trên cùng. */
  onDoi: (profile: Record<string, unknown>) => void;
}) {
  const [nhap, setNhap] = useState(username);
  const [kiem, setKiem] = useState<Kiem | null>(null);
  const [dangKiem, setDangKiem] = useState(false);
  const [lamTenHienThi, setLamTenHienThi] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  useEffect(() => { setNhap(username); }, [username]);

  const ten = nhap.trim().toLowerCase().replace(/^@/, '');
  const giongCu = ten === username.toLowerCase();

  // Kiểm trùng khi ngừng gõ 400 ms.
  useEffect(() => {
    if (!ten || giongCu) { setKiem(null); setDangKiem(false); return; }
    let con = true;
    setDangKiem(true);
    const hen = setTimeout(async () => {
      try {
        const r = await authApi.checkUsername(ten);
        if (con) setKiem(r.data.data);
      } catch {
        if (con) setKiem(null);
      } finally {
        if (con) setDangKiem(false);
      }
    }, 400);
    return () => { con = false; clearTimeout(hen); };
  }, [ten, giongCu]);

  const luu = async () => {
    setDangLuu(true);
    try {
      const r = await authApi.changeUsername(ten, lamTenHienThi);
      const p = ((r.data as { data?: Record<string, unknown> })?.data ?? {}) as Record<string, unknown>;
      onDoi(p);
      setKiem(null);
      toast.success(`Đã đổi tên đăng nhập thành @${String(p.username ?? ten)}`);
      if (p.dangNhapBangTenMoi) toast.info('Lần sau đăng nhập bằng mật khẩu, hãy dùng tên đăng nhập MỚI này.', { duration: 8000 });
    } catch (err) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(m || 'Chưa đổi được tên đăng nhập. Vui lòng thử lại.');
    } finally {
      setDangLuu(false);
    }
  };

  const nhaCungCap = provider && provider !== 'local' ? TEN_NHA_CUNG_CAP[provider.toLowerCase()] ?? provider : null;
  const choLuu = !giongCu && !!kiem?.hopLe && kiem.conTrong && !dangKiem;

  return (
    <SettingsCard
      title="Tên đăng nhập"
      description={nhaCungCap
        ? `Bạn đăng nhập bằng ${nhaCungCap}, nên tên này do hệ thống tự đặt. Đổi thành tên bạn thích — mọi người sẽ thấy và nhắc bạn bằng @tên này.`
        : 'Tên duy nhất của bạn trên CuongThai — dùng để đăng nhập và để người khác nhắc bạn bằng @tên.'}
      icon={<AtSign className="h-4 w-4" />}
    >
      <Field
        label="Tên đăng nhập mới"
        hint="3–30 ký tự: chữ thường không dấu, số, dấu chấm hoặc gạch dưới"
        error={!giongCu && kiem && !(kiem.hopLe && kiem.conTrong) ? kiem.lyDo : undefined}
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>@</span>
          <TextInput
            value={nhap}
            maxLength={31}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setNhap(e.target.value.replace(/\s/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter' && choLuu) void luu(); }}
            placeholder="ten_cua_ban"
            style={{ paddingLeft: '1.75rem', paddingRight: '2rem' }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {dangKiem ? <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--text-muted)' }} />
              : choLuu ? <Check className="h-4 w-4" style={{ color: '#10b981' }} />
              : !giongCu && kiem ? <X className="h-4 w-4" style={{ color: '#ef4444' }} /> : null}
          </span>
        </div>
      </Field>
      {choLuu && <p className="mt-1 text-xs" style={{ color: '#10b981' }}>@{ten} còn trống — dùng được.</p>}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <input type="checkbox" checked={lamTenHienThi} onChange={(e) => setLamTenHienThi(e.target.checked)} className="h-4 w-4 accent-violet-500" />
          Dùng luôn làm tên hiển thị
        </label>
        <Button onClick={() => void luu()} loading={dangLuu} disabled={!choLuu}>
          Đổi tên đăng nhập
        </Button>
      </div>
    </SettingsCard>
  );
}

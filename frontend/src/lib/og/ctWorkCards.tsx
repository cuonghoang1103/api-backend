/**
 * UX-D — các mẫu ảnh OG của CT Work (1200×630, Satori: mọi phần tử có `display`, chỉ flexbox, gradient theo %).
 *
 *   inviteImage     "{inviter} invited you to join {workspace} · {project}" + bìa, logo, ảnh người mời, số thành viên
 *   unavailableImage "Invitation expired or unavailable" — trung tính, không lộ gì
 *   shareImage      link công khai: dự án, bìa, % tiến độ, sprint hiện tại
 *   lockedImage     trang cần đăng nhập: CHỈ tên workspace + "Sign in to view" (cổng khách: thêm nhãn + màu dự án)
 *   genericImage    /work chung (không biết workspace)
 */
import { ImageResponse } from 'next/og';
import { coverImage, ctWorkLogo, initialsOf, OG_FONT, OG_SIZE, ogFonts, remoteImage, truncate } from './og';

type Node = React.ReactElement;
const ACCENT = '#4f5bd5';

// Cache-Control: Next tự gắn "immutable, max-age=1 năm" cho ảnh metadata — SAI với ảnh động (lời mời hết hạn vẫn
// hiện ảnh cũ). Production: nginx gỡ header đó và đặt 10 phút (location opengraph-image trong nginx.conf).
async function render(node: Node, _cacheSeconds: number) {
  return new ImageResponse(node, { ...OG_SIZE, fonts: await ogFonts() });
}

function Brand({ logo, light = true, label = 'CT Work' }: { logo: string | null; light?: boolean; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {logo ? <img src={logo} width={56} height={56} style={{ borderRadius: 14 }} /> : <div style={{ display: 'flex', width: 56, height: 56, borderRadius: 14, background: ACCENT }} />}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontSize: 34, fontWeight: 800, color: light ? '#ffffff' : '#1a1a17', letterSpacing: -0.5 }}>{label}</span>
        <span style={{ fontSize: 24, fontWeight: 400, color: light ? 'rgba(255,255,255,0.72)' : '#5f5e58' }}>by CuongThai</span>
      </div>
    </div>
  );
}

function Frame({ bg, children, overlay = true }: { bg: string | null; children: React.ReactNode; overlay?: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', fontFamily: OG_FONT, background: 'linear-gradient(135deg, #1e2366 0%, #3a45b5 55%, #4f5bd5 100%)' }}>
      {bg && <img src={bg} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }} />}
      {overlay && <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex', background: 'linear-gradient(90deg, rgba(10,10,20,0.88) 0%, rgba(10,10,20,0.72) 55%, rgba(10,10,20,0.35) 100%)' }} />}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '56px 72px' }}>{children}</div>
    </div>
  );
}

function Chip({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 999, fontSize: 26, fontWeight: 600,
      background: strong ? '#ffffff' : 'rgba(255,255,255,0.14)', color: strong ? '#2f3a9e' : '#ffffff', border: strong ? 'none' : '1px solid rgba(255,255,255,0.28)' }}>
      {children}
    </div>
  );
}

function Avatar({ src, name, size }: { src: string | null; name: string; size: number }) {
  return src
    ? <img src={src} width={size} height={size} style={{ borderRadius: size / 2, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.9)' }} />
    : <div style={{ display: 'flex', width: size, height: size, borderRadius: size / 2, background: ACCENT, color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 600, border: '3px solid rgba(255,255,255,0.9)' }}>{initialsOf(name)}</div>;
}

function Mark({ k, color, size = 88 }: { k: string; color: string | null; size?: number }) {
  return <div style={{ display: 'flex', width: size, height: size, borderRadius: 20, background: color || ACCENT, color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 800, border: '3px solid rgba(255,255,255,0.85)' }}>{k.slice(0, 2)}</div>;
}

export interface InviteCardData {
  status: 'VALID' | 'UNAVAILABLE';
  workspace?: { name: string; logoUrl: string | null };
  project?: { key: string; name: string; coverUrl: string | null; color: string | null } | null;
  inviter?: { name: string; avatarUrl: string | null } | null;
  memberCount?: number;
}

export async function inviteImage(card: InviteCardData | null) {
  if (!card || card.status !== 'VALID' || !card.workspace) return unavailableImage();
  const [logo, bg, avatar] = await Promise.all([ctWorkLogo(), coverImage(card.project?.coverUrl ?? 'preset:gradient-indigo'), remoteImage(card.inviter?.avatarUrl)]);
  const inviter = truncate(card.inviter?.name ?? 'Someone', 40);
  const where = card.project ? `${card.workspace.name} · ${card.project.name}` : card.workspace.name;
  const titleSize = where.length > 46 ? 54 : where.length > 30 ? 64 : 76;
  return render(
    <Frame bg={bg}>
      <Brand logo={logo} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Avatar src={avatar} name={inviter} size={76} />
          <div style={{ display: 'flex', fontSize: 34, color: 'rgba(255,255,255,0.92)' }}>
            <span style={{ fontWeight: 800, color: '#ffffff' }}>{inviter}</span>
            <span style={{ marginLeft: 12 }}>invited you to join</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 800, color: '#ffffff', lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }}>{truncate(where, 80)}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {card.project && <Mark k={card.project.key} color={card.project.color} size={60} />}
        {typeof card.memberCount === 'number' && <Chip>{card.memberCount} {card.memberCount === 1 ? 'member' : 'members'}</Chip>}
        <Chip strong>Sign in to accept</Chip>
        <span style={{ display: 'flex', marginLeft: 8, fontSize: 22, color: 'rgba(255,255,255,0.7)' }}>Lời mời tham gia nhóm trên CT Work</span>
      </div>
    </Frame>,
    600,
  );
}

export async function unavailableImage() {
  const logo = await ctWorkLogo();
  return render(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 72px', fontFamily: OG_FONT, background: 'linear-gradient(135deg, #f4f3f0 0%, #e7e5e0 100%)' }}>
      <Brand logo={logo} light={false} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, color: '#1a1a17', letterSpacing: -1.5 }}>Invitation expired</div>
        <div style={{ display: 'flex', fontSize: 34, color: '#5f5e58' }}>This invitation link is no longer available. Ask for a new one.</div>
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: '#8a8981' }}>Lời mời đã hết hạn hoặc không còn dùng được · cuongthai.com</div>
    </div>,
    600,
  );
}

export interface ShareCardData {
  status: 'VALID' | 'UNAVAILABLE';
  workspace?: { name: string };
  project?: { key: string; name: string; coverUrl: string | null; color: string | null };
  progress?: { percent: number; done: number; total: number } | null;
  sprint?: { name: string } | null;
}

export async function shareImage(card: ShareCardData | null) {
  const logo = await ctWorkLogo();
  if (!card || card.status !== 'VALID' || !card.project || !card.workspace) {
    return render(
      <Frame bg={null}>
        <Brand logo={logo} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, color: '#fff' }}>Link unavailable</div>
          <div style={{ display: 'flex', fontSize: 32, color: 'rgba(255,255,255,0.8)' }}>This shared project link has expired or was revoked.</div>
        </div>
        <div style={{ display: 'flex' }}><Chip>Read-only shared view</Chip></div>
      </Frame>, 600);
  }
  const bg = await coverImage(card.project.coverUrl ?? 'preset:gradient-indigo');
  const name = card.project.name;
  const pct = card.progress?.percent ?? null;
  return render(
    <Frame bg={bg}>
      <Brand logo={logo} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Mark k={card.project.key} color={card.project.color} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.75)' }}>{truncate(card.workspace.name, 50)}</span>
            <span style={{ fontSize: name.length > 30 ? 58 : 72, fontWeight: 800, color: '#fff', letterSpacing: -1.5, lineHeight: 1.08 }}>{truncate(name, 60)}</span>
          </div>
        </div>
        {pct !== null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 760 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: 'rgba(255,255,255,0.9)' }}>
              <span>{card.progress!.done} of {card.progress!.total} issues done</span><span style={{ fontWeight: 800 }}>{pct}%</span>
            </div>
            <div style={{ display: 'flex', width: 760, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.22)' }}>
              <div style={{ display: 'flex', width: Math.max(8, Math.round(7.6 * pct)), height: 16, borderRadius: 8, background: '#a5f3c4' }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {card.sprint && <Chip>Current: {truncate(card.sprint.name, 30)}</Chip>}
        <Chip strong>Read-only shared view</Chip>
      </div>
    </Frame>,
    1800,
  );
}

export async function lockedImage(opts: { workspace: string | null; workspaceLogoUrl?: string | null; label?: string; color?: string | null }) {
  const [logo, wsLogo] = await Promise.all([ctWorkLogo(), remoteImage(opts.workspaceLogoUrl)]);
  const ws = opts.workspace ? truncate(opts.workspace, 48) : null;
  return render(
    <Frame bg={null} overlay={false}>
      <Brand logo={logo} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {opts.label && <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 }}>{opts.label}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {wsLogo
            ? <img src={wsLogo} width={96} height={96} style={{ borderRadius: 20, background: '#fff', objectFit: 'contain' }} />
            : ws ? <div style={{ display: 'flex', width: 96, height: 96, borderRadius: 20, background: opts.color || 'rgba(255,255,255,0.18)', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, border: '2px solid rgba(255,255,255,0.4)' }}>{initialsOf(ws)}</div> : null}
          <div style={{ display: 'flex', fontSize: ws && ws.length > 28 ? 60 : 76, fontWeight: 800, color: '#fff', letterSpacing: -1.5, lineHeight: 1.08, maxWidth: 940 }}>{ws ?? 'Project workspace'}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: 'rgba(255,255,255,0.82)' }}>Boards, sprints, docs and reports for your team.</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Chip strong>Sign in to view</Chip>
        <span style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.72)' }}>Đăng nhập để xem nội dung · cuongthai.com/work</span>
      </div>
      {opts.color && <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 10, display: 'flex', background: opts.color }} />}
    </Frame>,
    3600,
  );
}

export const genericImage = () => lockedImage({ workspace: null });

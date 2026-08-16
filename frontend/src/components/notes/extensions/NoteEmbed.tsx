'use client';

/**
 * NoteEmbed — nhúng trang ngoài (YouTube, Vimeo, Figma, Google Docs/Maps,
 * CodeSandbox, CodePen, Loom, Spotify, Miro).
 *
 * ─── Vì sao là DANH SÁCH ĐÓNG chứ không nhúng gì cũng được ───
 * CSP của web này giới hạn `frame-src`. Một địa chỉ ngoài danh sách sẽ bị
 * trình duyệt chặn ÂM THẦM: iframe trắng trơn, không lỗi trên màn hình, không
 * lỗi trong console của người dùng thường. Tức là "nhúng gì cũng được" sẽ
 * hỏng đúng vào lúc người dùng thử thứ họ quan tâm nhất, mà chẳng ai biết vì
 * sao.
 *
 * Vì thế: nhận ra nhà cung cấp thì nhúng thật; không nhận ra thì `resolve()`
 * trả về null và người gọi chèn thẻ BOOKMARK thay thế. Người dùng luôn nhận
 * được một khối dùng được, không bao giờ nhận khung trắng.
 *
 * Mọi mục trong `PROVIDERS` phải CÓ MẶT trong `frame-src` ở
 * frontend/next.config.js. Thêm ở đây mà quên thêm ở đó là dựng lại đúng cái
 * lỗi câm nói trên.
 */
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Trash2 } from 'lucide-react';

interface Provider {
  name: string;
  /** Nhận ra và đổi sang địa chỉ nhúng; trả null nếu không phải của mình. */
  toEmbed: (url: URL) => string | null;
  /** Tỉ lệ khung mặc định. Video 16/9; công cụ thiết kế cần cao hơn. */
  ratio: string;
}

const PROVIDERS: Provider[] = [
  {
    name: 'YouTube',
    ratio: '16 / 9',
    toEmbed: (u) => {
      if (u.host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
      if (!/(^|\.)youtube\.com$/.test(u.host)) return null;
      if (u.pathname === '/watch') {
        const v = u.searchParams.get('v');
        return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
      }
      if (u.pathname.startsWith('/embed/') || u.pathname.startsWith('/shorts/')) {
        return `https://www.youtube-nocookie.com/embed/${u.pathname.split('/')[2] ?? ''}`;
      }
      return null;
    },
  },
  {
    name: 'Vimeo',
    ratio: '16 / 9',
    toEmbed: (u) => {
      if (!/(^|\.)vimeo\.com$/.test(u.host)) return null;
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    },
  },
  { name: 'Loom',     ratio: '16 / 9', toEmbed: (u) => (/(^|\.)loom\.com$/.test(u.host) && u.pathname.startsWith('/share/')) ? `https://www.loom.com/embed/${u.pathname.split('/')[2]}` : null },
  { name: 'Figma',    ratio: '4 / 3',  toEmbed: (u) => /(^|\.)figma\.com$/.test(u.host) ? `https://embed.figma.com/${u.pathname.replace(/^\//, '')}?embed-host=cuongthai` : null },
  { name: 'Spotify',  ratio: '4 / 1',  toEmbed: (u) => /(^|\.)spotify\.com$/.test(u.host) ? `https://open.spotify.com/embed${u.pathname}` : null },
  { name: 'CodeSandbox', ratio: '4 / 3', toEmbed: (u) => /(^|\.)codesandbox\.io$/.test(u.host) ? `https://codesandbox.io/embed${u.pathname.replace(/^\/(s|p\/sandbox)/, '')}` : null },
  { name: 'CodePen',  ratio: '4 / 3',  toEmbed: (u) => /(^|\.)codepen\.io$/.test(u.host) ? u.href.replace('/pen/', '/embed/') : null },
  { name: 'Miro',     ratio: '4 / 3',  toEmbed: (u) => /(^|\.)miro\.com$/.test(u.host) ? u.href.replace('/app/board/', '/app/live-embed/') : null },
  {
    name: 'Google',
    ratio: '4 / 3',
    // Docs/Sheets/Slides/Drive/Maps. `/preview` và `/embed` là đường Google
    // cho phép nhúng; đường xem thường (`/edit`) bị chính Google chặn khung.
    toEmbed: (u) => {
      if (u.host === 'docs.google.com') return u.href.replace(/\/(edit|view)(\?.*)?$/, '/preview');
      if (u.host === 'drive.google.com') return u.href.replace(/\/view(\?.*)?$/, '/preview');
      if (u.host === 'www.google.com' && u.pathname.startsWith('/maps/embed')) return u.href;
      return null;
    },
  },
];

/** Trả về địa chỉ nhúng + tỉ lệ, hoặc null nếu không nhà cung cấp nào nhận. */
export function resolveEmbed(raw: string): { src: string; ratio: string; provider: string } | null {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  if (u.protocol !== 'https:') return null;   // http: sẽ bị chặn vì nội dung hỗn hợp
  for (const p of PROVIDERS) {
    const src = p.toEmbed(u);
    if (src) return { src, ratio: p.ratio, provider: p.name };
  }
  return null;
}

export const NoteEmbed = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src:      { default: '',       parseHTML: (el: HTMLElement) => el.getAttribute('data-src') ?? '',   renderHTML: (a) => ({ 'data-src': a.src }) },
      ratio:    { default: '16 / 9', parseHTML: (el: HTMLElement) => el.getAttribute('data-ratio') ?? '16 / 9', renderHTML: (a) => ({ 'data-ratio': a.ratio }) },
      provider: { default: '',       parseHTML: (el: HTMLElement) => el.getAttribute('data-provider') ?? '', renderHTML: (a) => ({ 'data-provider': a.provider }) },
    };
  },

  parseHTML() { return [{ tag: 'div[data-type="embed"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'embed' })]; },
  addNodeView() { return ReactNodeViewRenderer(EmbedView); },

  addCommands() {
    return {
      /**
       * Chèn khối nhúng. Địa chỉ không thuộc nhà cung cấp nào thì chèn
       * BOOKMARK — người dùng vẫn có một khối dùng được thay vì khung trắng.
       */
      setEmbed:
        (url: string) =>
        ({ commands }: { commands: any }) => {
          const resolved = resolveEmbed(url);
          if (!resolved) return commands.insertContent({ type: 'bookmark', attrs: { url } });
          return commands.insertContent({ type: 'embed', attrs: resolved });
        },
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

function EmbedView({ node, deleteNode, editor }: NodeViewProps) {
  const { src, ratio, provider } = node.attrs as Record<string, string>;
  return (
    <NodeViewWrapper className="note-embed" data-type="embed">
      <div contentEditable={false} style={{ aspectRatio: ratio || '16 / 9' }}>
        {/* `sandbox` bỏ `allow-top-navigation`: một trang nhúng KHÔNG được
            phép tự điều hướng cả tab của người dùng đi nơi khác.
            `allow-same-origin` là cần thiết để đa số nhà cung cấp chạy được,
            và an toàn ở đây vì mọi nguồn đều nằm trong danh sách đóng. */}
        <iframe
          src={src}
          title={provider ? `Nhúng ${provider}` : 'Nội dung nhúng'}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {editor.isEditable && (
        <button type="button" className="note-embed__del" onClick={deleteNode} title="Xoá khối nhúng" aria-label="Xoá khối nhúng">
          <Trash2 size={14} />
        </button>
      )}
    </NodeViewWrapper>
  );
}

export default NoteEmbed;

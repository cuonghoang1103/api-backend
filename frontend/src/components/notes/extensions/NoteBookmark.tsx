'use client';

/**
 * NoteBookmark — thẻ xem trước một liên kết (tiêu đề, mô tả, ảnh, favicon).
 *
 * ─── Dùng lại `/hub/scrape`, KHÔNG tự gọi ra Internet ───
 * Cám dỗ là để trình duyệt tự `fetch()` trang kia rồi bóc thẻ meta. Không làm
 * được (CORS chặn) mà kể cả làm được cũng không nên. Backend đã có `scrapeUrl`
 * với đủ thứ mà một bộ lấy metadata cần phải có: chặn SSRF (giải DNS rồi loại
 * loopback/mạng nội bộ/địa chỉ metadata của máy ảo, kiểm lại ở TỪNG bước
 * chuyển hướng), giới hạn 5 lần chuyển hướng, trần 2MB thân phản hồi, timeout
 * 8 giây. Viết lại một bộ khác là viết lại từng ấy phòng thủ, và bỏ sót một
 * cái là mở đường cho người ngoài dò mạng nội bộ qua máy chủ của bạn.
 *
 * ─── Vì sao lưu lại kết quả vào thuộc tính ───
 * Ghi thẳng tiêu đề/mô tả/ảnh vào tài liệu, không gọi lại mỗi lần mở ghi chú.
 * Một trang có 20 bookmark mà gọi lại hết thì mở ghi chú là 20 lượt tải trang
 * ngoài, và khi trang gốc chết thì thẻ trắng trơn — trong khi thứ người dùng
 * cần nhớ đã được đọc từ lâu.
 *
 * Hình lưu: { type: "bookmark", attrs: { url, title, description, image, icon, site } }
 */
import { useEffect, useRef, useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Link2, Loader2, Trash2 } from 'lucide-react';
import { hubApi } from '@/lib/api';

export const NoteBookmark = Node.create({
  name: 'bookmark',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url:         { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-url') ?? '',   renderHTML: (a) => ({ 'data-url': a.url }) },
      title:       { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-title') ?? '', renderHTML: (a) => ({ 'data-title': a.title }) },
      description: { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-desc') ?? '',  renderHTML: (a) => ({ 'data-desc': a.description }) },
      image:       { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-image') ?? '', renderHTML: (a) => ({ 'data-image': a.image }) },
      icon:        { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-icon') ?? '',  renderHTML: (a) => ({ 'data-icon': a.icon }) },
      site:        { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-site') ?? '',  renderHTML: (a) => ({ 'data-site': a.site }) },
    };
  },

  parseHTML() { return [{ tag: 'div[data-type="bookmark"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'bookmark' })]; },
  addNodeView() { return ReactNodeViewRenderer(BookmarkView); },

  addCommands() {
    return {
      setBookmark:
        (attrs: { url: string }) =>
        ({ commands }: { commands: any }) =>
          commands.insertContent({ type: this.name, attrs }),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

function hostOf(url: string): string {
  try { return new URL(url).host; } catch { return url; }
}

function BookmarkView({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const { url, title, description, image, icon, site } = node.attrs as Record<string, string>;
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  /* Chỉ lấy metadata MỘT lần cho mỗi khối.
   *
   * `useRef` chứ không phải state trong điều kiện: node view có thể bị React
   * dựng lại nhiều lần (mỗi lần tài liệu đổi), và nếu điều kiện chỉ dựa vào
   * `title` rỗng thì một trang không có thẻ og:title sẽ bị gọi lại vô tận. */
  const asked = useRef(false);
  useEffect(() => {
    if (asked.current || !url || title) return;
    asked.current = true;
    setLoading(true);
    hubApi.scrape(url)
      .then((res) => {
        const d = res.data.data;
        updateAttributes({
          title: d.title ?? hostOf(url),
          description: d.description ?? '',
          image: d.thumbnailUrl ?? '',
          icon: d.faviconUrl ?? '',
          site: d.siteName ?? hostOf(url),
        });
      })
      .catch(() => {
        setFailed(true);
        // Vẫn ghi tiêu đề tối thiểu để lần mở sau không gọi lại — trang chặn
        // đọc metadata hôm nay thì mai cũng chặn.
        updateAttributes({ title: hostOf(url), site: hostOf(url) });
      })
      .finally(() => setLoading(false));
  }, [url, title, updateAttributes]);

  return (
    <NodeViewWrapper className="note-bookmark" data-type="bookmark">
      <a href={url} target="_blank" rel="noopener noreferrer" contentEditable={false}>
        <div className="note-bookmark__text">
          <div className="note-bookmark__title">
            {loading ? <Loader2 size={13} className="note-spin" aria-hidden /> : null}
            {title || url || 'Liên kết'}
          </div>
          {description && <div className="note-bookmark__desc">{description}</div>}
          <div className="note-bookmark__site">
            {icon
              ? <img src={icon} alt="" width={14} height={14} loading="lazy" />
              : <Link2 size={12} aria-hidden />}
            {site || hostOf(url)}
            {failed && <span className="note-bookmark__warn"> · không đọc được mô tả</span>}
          </div>
        </div>
        {image && <img className="note-bookmark__thumb" src={image} alt="" loading="lazy" />}
      </a>
      {editor.isEditable && (
        <button type="button" className="note-bookmark__del" onClick={deleteNode} title="Xoá thẻ" aria-label="Xoá thẻ">
          <Trash2 size={14} />
        </button>
      )}
    </NodeViewWrapper>
  );
}

export default NoteBookmark;

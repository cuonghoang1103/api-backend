/**
 * BlockHandle — tay cầm ⠿ và nút + hiện bên trái khối khi rê chuột.
 *
 * Đây là thứ khiến Notion "cảm giác như Notion": mọi dòng đều nắm được và
 * kéo đi chỗ khác, không cần bôi đen rồi cắt dán.
 *
 * ─── Vì sao viết tay chứ không cài gói ───
 * TipTap có `@tiptap/extension-drag-handle` nhưng nằm trong bản Pro trả phí.
 * Phần lõi thật ra ngắn: ProseMirror đã tự lo việc thả (drop) nếu ta đặt đúng
 * `view.dragging` lúc bắt đầu kéo. Chỗ dài là dò khối dưới con trỏ và đặt tay
 * cầm cho thẳng hàng — hai việc không phụ thuộc gói nào.
 *
 * ─── Vì sao DOM thuần chứ không React ───
 * Tay cầm phải bám theo `mousemove`, tức là hàng chục lần mỗi giây. Cho React
 * dựng lại từng ấy lần chỉ để dời một phần tử là trả giá vô ích, và mọi lần
 * dựng lại đều có nguy cơ cắt ngang thao tác kéo đang diễn ra.
 */
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export const blockHandleKey = new PluginKey('blockHandle');

/** Khoảng cách từ mép trái khối ra tới tay cầm, tính bằng px. */
const GUTTER = 8;

/**
 * Khối nào KHÔNG cho kéo.
 *
 * Ô trong bảng là khối lồng nhau — kéo một ô ra ngoài bảng làm hỏng cấu trúc
 * bảng, và ProseMirror sẽ dựng lại tài liệu theo cách người dùng không đoán
 * được. Bảng vẫn kéo được nguyên khối, chỉ ô bên trong thì không.
 */
const NOT_DRAGGABLE = new Set(['tableCell', 'tableHeader', 'tableRow']);

interface BlockTarget {
  /** Vị trí NGAY TRƯỚC khối — chỗ `NodeSelection.create` cần. */
  pos: number;
  /** Vị trí ngay sau khối, dùng để chèn khối mới xuống dưới. */
  end: number;
  dom: HTMLElement;
  typeName: string;
}

/**
 * Tìm khối CẤP CAO NHẤT nằm dưới toạ độ chuột.
 *
 * `posAtCoords` trả về vị trí sâu nhất (có thể nằm trong một mục danh sách lồng
 * ba tầng). Ta leo ngược lên độ sâu 1 vì đó mới là thứ người dùng nghĩ là "một
 * dòng" và là thứ kéo đi mà không làm vỡ cấu trúc cha.
 */
function blockAt(view: EditorView, clientX: number, clientY: number): BlockTarget | null {
  // Dò từ mép trái vùng soạn thảo thay vì từ vị trí chuột thật: khi chuột đang
  // ở LỀ (chỗ tay cầm sẽ hiện ra), toạ độ đó nằm ngoài mọi khối và
  // `posAtCoords` trả về null — tay cầm sẽ nhấp nháy ngay khi người dùng với
  // tay tới nó.
  const rect = view.dom.getBoundingClientRect();
  const probeX = rect.left + Math.min(rect.width / 2, 120);
  const found = view.posAtCoords({ left: probeX, top: clientY });
  if (!found) return null;

  /* Dùng `found.pos` (vị trí CHỮ), KHÔNG dùng `found.inside`.
   *
   * Bản đầu giải mã `found.inside` rồi loại các vị trí có `depth === 0`. Đo
   * thật thì đó chính là mọi đoạn văn cấp cao nhất: `inside` của một <p> con
   * trực tiếp của tài liệu là vị trí NGAY TRƯỚC nó, và vị trí đó nằm ở độ sâu
   * 0. Kết quả: tay cầm chỉ hiện trên danh sách và bảng (khối có lồng nhau),
   * còn đoạn văn thường — thứ chiếm hầu hết trang — thì không bao giờ hiện.
   *
   * `found.pos` luôn nằm TRONG một khối, nên `before(1)` leo thẳng lên tổ tiên
   * cấp cao nhất bất kể lồng sâu bao nhiêu tầng. */
  const $pos = view.state.doc.resolve(found.pos);
  const pos = $pos.depth === 0 ? found.pos : $pos.before(1);
  const node = view.state.doc.nodeAt(pos);
  if (!node) return null;

  const dom = view.nodeDOM(pos);
  if (!(dom instanceof HTMLElement)) return null;

  return { pos, end: pos + node.nodeSize, dom, typeName: node.type.name };
}

export const BlockHandle = Extension.create({
  name: 'blockHandle',

  addProseMirrorPlugins() {
    let target: BlockTarget | null = null;

    return [
      new Plugin({
        key: blockHandleKey,

        view(view) {
          const wrap = document.createElement('div');
          wrap.className = 'note-block-handle';
          wrap.setAttribute('aria-hidden', 'true');
          // Ẩn bằng `visibility` chứ KHÔNG phải `display: none`.
          //
          // Phần tử `display: none` có `offsetParent === null`, nên lần đặt
          // vị trí ĐẦU TIÊN không biết gốc toạ độ và rơi lệch (đo được: lệch
          // 40px, đè lên chữ 61px). Từ lần thứ hai trở đi mới đúng — tức là
          // người dùng thấy tay cầm nháy sai chỗ một cái rồi mới về đúng.
          // `visibility: hidden` vẫn chiếm chỗ trong layout nên gốc toạ độ
          // luôn có sẵn, và vì tay cầm nằm trong lề nên chỗ nó chiếm không
          // đẩy nội dung đi đâu cả.
          wrap.style.visibility = 'hidden';

          const add = document.createElement('button');
          add.type = 'button';
          add.className = 'note-block-handle__btn';
          add.title = 'Chèn khối bên dưới';
          add.setAttribute('aria-label', 'Chèn khối bên dưới');
          add.textContent = '+';

          const grip = document.createElement('button');
          grip.type = 'button';
          grip.className = 'note-block-handle__btn note-block-handle__grip';
          grip.title = 'Kéo để di chuyển';
          grip.setAttribute('aria-label', 'Kéo để di chuyển khối');
          grip.draggable = true;
          grip.textContent = '⠿';

          wrap.append(add, grip);

          const host = view.dom.parentElement ?? document.body;
          host.appendChild(wrap);

          /* Ẩn CÓ ĐỘ TRỄ, và huỷ được.
           *
           * Tay cầm nằm NGOÀI `view.dom` — nó ở lề trái, cách mép chữ GUTTER
           * pixel. Bản đầu gắn thẳng `hide` vào `mouseleave` của `view.dom`,
           * nên khoảnh khắc người dùng rê chuột ra khỏi vùng chữ để với tới
           * tay cầm thì `mouseleave` bắn và tay cầm biến mất — con trỏ KHÔNG
           * BAO GIỜ chạm tới được. Ở đúng đường biên thì mousemove và
           * mouseleave thay nhau bắn, nên nó nháy giựt liên tục.
           *
           * Khoảng lề giữa chữ và tay cầm không thuộc phần tử nào, nên chỉ
           * kiểm `relatedTarget` là chưa đủ: phải cho con trỏ một quãng thời
           * gian để băng qua khoảng trống đó. */
          const HIDE_DELAY_MS = 220;
          let hideTimer: ReturnType<typeof setTimeout> | null = null;

          const cancelHide = () => {
            if (hideTimer !== null) {
              clearTimeout(hideTimer);
              hideTimer = null;
            }
          };

          const hideNow = () => {
            cancelHide();
            wrap.style.visibility = 'hidden';
            target = null;
          };

          const hide = () => {
            cancelHide();
            hideTimer = setTimeout(hideNow, HIDE_DELAY_MS);
          };

          /* Con trỏ đã lên tới tay cầm thì giữ nguyên, bất kể nó vừa rời khỏi
           * vùng chữ. Rời hẳn tay cầm mới hẹn ẩn lại.
           *
           * `mouseover`/`mouseout` chứ KHÔNG phải `mouseenter`/`mouseleave`:
           * khung ngoài đặt `pointer-events: none` (cố ý — dải trong suốt giữa
           * hai nút mà nhận chuột thì che mất chữ, không bôi đen được từ đầu
           * dòng). Nó không bao giờ là đích của sự kiện, mà `mouseenter` lại
           * KHÔNG bubble — nên gắn kiểu đó thì không đời nào bắn. Hai sự kiện
           * này có bubble, nên chúng đi lên từ chính hai cái nút. */
          wrap.addEventListener('mouseover', cancelHide);
          wrap.addEventListener('mouseout', hide);

          const place = (event: MouseEvent) => {
            if (!view.editable) return;
            // Quay lại vùng chữ thì huỷ lệnh ẩn đang chờ.
            cancelHide();
            const next = blockAt(view, event.clientX, event.clientY);
            if (!next) return;      // giữ nguyên vị trí cũ, không giấu đi

            target = next;

            /* Neo theo `offsetParent` ĐỌC LẠI MỖI LẦN, không phải theo phần tử
             * chọn sẵn lúc khởi tạo.
             *
             * Bản đầu chọn `view.dom.parentElement` lúc plugin dựng lên và đặt
             * `position: relative` cho nó ngay tại đó. Đo thật thì lúc ấy React
             * chưa gắn xong cây DOM: `getComputedStyle` trả về chuỗi rỗng nên
             * nhánh đặt `relative` bị bỏ qua, và `getBoundingClientRect()` trả
             * về toàn số 0. Toạ độ vì thế tính theo gốc (0,0) trong khi trình
             * duyệt lại định vị theo một tổ tiên khác — tay cầm rơi lệch 40px
             * xuống dưới và đè lên chữ 61px.
             *
             * `offsetParent` là thứ trình duyệt THẬT SỰ dùng làm gốc toạ độ,
             * nên hỏi thẳng nó thì không còn khoảng cách giữa giả định và thực
             * tế. `?? host` lo trường hợp `offsetParent` là null (phần tử đang
             * ẩn) — khi đó chưa vẽ gì nên sai số cũng không ai thấy. */
            if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

            const blockRect = next.dom.getBoundingClientRect();
            const base = (wrap.offsetParent as HTMLElement | null) ?? host;
            const baseRect = base.getBoundingClientRect();

            wrap.style.visibility = 'visible';
            wrap.style.top = `${blockRect.top - baseRect.top}px`;
            wrap.style.left = `${blockRect.left - baseRect.left - GUTTER}px`;
            // Canh theo chiều cao DÒNG ĐẦU chứ không phải giữa khối: với một
            // đoạn văn dài mười dòng, canh giữa sẽ đẩy tay cầm xuống tận giữa
            // đoạn, xa chỗ con trỏ đang trỏ tới.
            wrap.style.height = `${Math.min(blockRect.height, 28)}px`;

            grip.draggable = !NOT_DRAGGABLE.has(next.typeName);
            grip.style.opacity = grip.draggable ? '' : '0.3';
          };

          view.dom.addEventListener('mousemove', place);
          view.dom.addEventListener('mouseleave', hide);

          // Kéo: chọn cả khối rồi giao lại cho ProseMirror. `move: true` để nó
          // XOÁ chỗ cũ sau khi thả — thiếu cờ này thì mỗi lần kéo là một lần
          // nhân đôi nội dung.
          grip.addEventListener('dragstart', (event) => {
            if (!target || !event.dataTransfer) return;
            const { pos } = target;

            view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos)));
            const slice = view.state.selection.content();
            view.dragging = { slice, move: true };

            event.dataTransfer.effectAllowed = 'move';
            // Firefox không bắt đầu kéo nếu dataTransfer rỗng.
            event.dataTransfer.setData('text/plain', '');
            event.dataTransfer.setDragImage(target.dom, 0, 0);
            wrap.style.visibility = 'hidden';
          });

          grip.addEventListener('dragend', () => {
            view.dragging = null;
          });

          // Bấm (không kéo) tay cầm: chọn cả khối, để người dùng xoá hoặc đổi
          // kiểu bằng thanh công cụ nổi.
          grip.addEventListener('click', () => {
            if (!target) return;
            view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, target.pos)));
            view.focus();
          });

          // Nút +: chèn đoạn rỗng ngay dưới rồi gõ "/" vào đó. SlashMenu đọc
          // chữ trước con trỏ nên nó tự bật — cùng một đường đi với lúc người
          // dùng tự gõ, không có nhánh riêng nào phải nuôi.
          add.addEventListener('click', () => {
            if (!target) return;
            const { end } = target;
            const tr = view.state.tr.insert(end, view.state.schema.nodes.paragraph!.create());
            const inside = end + 1;
            tr.setSelection(NodeSelection.near(tr.doc.resolve(inside)));
            view.dispatch(tr);
            view.focus();
            view.dispatch(view.state.tr.insertText('/'));
          });

          return {
            destroy() {
              view.dom.removeEventListener('mousemove', place);
              view.dom.removeEventListener('mouseleave', hide);
              // Dọn hẹn giờ: nó giữ tham chiếu tới `wrap` và `target`, nên bỏ
              // lại thì mỗi lần đổi ghi chú là một lượt hẹn còn sống chạy trên
              // cây DOM vừa bị gỡ.
              cancelHide();
              wrap.remove();
            },
          };
        },
      }),
    ];
  },
});

export default BlockHandle;

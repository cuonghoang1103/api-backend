/**
 * Bảng lệnh (Cmd/Ctrl+K).
 *
 * Tự viết thay vì dùng `cmdk`: nhu cầu ở đây là lọc một danh sách đã biết
 * trước và bắt vài phím — khoảng 100 dòng. Thêm một phụ thuộc cho chừng đó là
 * thêm một thứ phải theo dõi và vá.
 *
 * Bỏ dấu khi tìm kiếm: người Việt gõ nhanh thường không bỏ dấu ("tin nhan" phải
 * ra "Tin nhắn"). `normalize('NFD')` tách dấu thành ký tự tổ hợp rồi xoá —
 * cách này đúng với mọi nguyên âm tiếng Việt, kể cả "ươ" và "ăâ".
 * Riêng "đ/Đ" KHÔNG phải nguyên âm có dấu tổ hợp nên phải thay riêng.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Info, Settings as SettingsIcon } from 'lucide-react';
import { useAppState } from '../app-state';
import { INTERNAL_ROUTES, ROUTES } from '../routes';

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    // U+0300–U+036F là khối "combining diacritical marks" — chính là các dấu
    // mà NFD vừa tách ra. Viết bằng escape thay vì dán ký tự tổ hợp thô, vì ký
    // tự tổ hợp trong mã nguồn vô hình khi đọc và dễ hỏng khi file đổi mã hoá.
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

interface Command {
  id: string;
  label: string;
  hint?: string;
  keywords: string;
  run: () => void;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { navigate, route } = useAppState();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = ROUTES.map((item) => ({
      id: `nav:${item.path}`,
      label: item.label,
      hint: 'Mở',
      keywords: normalize([item.label, item.path, ...(item.keywords ?? [])].join(' ')),
      run: () => navigate(item.path),
    }));

    const actions: Command[] = [
      {
        id: 'app:settings',
        label: 'Cài đặt',
        hint: 'Ứng dụng',
        keywords: normalize('cài đặt settings tuỳ chọn'),
        run: () => navigate(INTERNAL_ROUTES.settings),
      },
      {
        id: 'app:about',
        label: 'Giới thiệu',
        hint: 'Ứng dụng',
        keywords: normalize('giới thiệu about phiên bản'),
        run: () => navigate(INTERNAL_ROUTES.about),
      },
      {
        id: 'app:openWeb',
        label: 'Mở trang hiện tại trên web',
        hint: 'Trình duyệt',
        keywords: normalize('mở web browser trình duyệt'),
        run: () => {
          void window.cuongthai?.app
            .getInfo()
            .then((info) => window.cuongthai?.app.openExternal(`${info.webOrigin}${route}`));
        },
      },
      {
        id: 'app:reload',
        label: 'Tải lại ứng dụng',
        hint: 'Ứng dụng',
        keywords: normalize('tải lại reload refresh'),
        run: () => void window.cuongthai?.app.reload(),
      },
    ];

    return [...navCommands, ...actions];
  }, [navigate, route]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return commands;
    return commands.filter((command) => command.keywords.includes(q));
  }, [commands, query]);

  // Đặt lại khi mở. Không đặt lại thì lần mở sau vẫn còn chữ tìm kiếm cũ và
  // con trỏ chọn trỏ vào một mục đã bị lọc mất.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setIndex(0);
    inputRef.current?.focus();
  }, [open]);

  // Giữ con trỏ chọn nằm trong danh sách sau mỗi lần lọc.
  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  if (!open) return null;

  const run = (command: Command | undefined) => {
    if (!command) return;
    command.run();
    onClose();
  };

  return (
    <div
      className="ct-palette-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="ct-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Bảng lệnh"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="ct-palette-input"
          value={query}
          placeholder="Tìm trang hoặc lệnh…"
          aria-label="Tìm trang hoặc lệnh"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              onClose();
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              setIndex((i) => (i + 1) % Math.max(1, filtered.length));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setIndex((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
            } else if (event.key === 'Enter') {
              event.preventDefault();
              run(filtered[index]);
            }
          }}
        />

        <div className="ct-palette-list" role="listbox" aria-label="Kết quả">
          {filtered.length === 0 && (
            <div className="ct-palette-empty">Không có kết quả nào.</div>
          )}
          {filtered.map((command, i) => (
            <button
              key={command.id}
              type="button"
              role="option"
              aria-selected={i === index}
              className="ct-palette-item"
              data-selected={i === index}
              onMouseEnter={() => setIndex(i)}
              onClick={() => run(command)}
            >
              {command.id === 'app:settings' && <SettingsIcon size={15} aria-hidden />}
              {command.id === 'app:about' && <Info size={15} aria-hidden />}
              {command.id === 'app:openWeb' && <ExternalLink size={15} aria-hidden />}
              <span>{command.label}</span>
              {command.hint && <span className="ct-palette-hint">{command.hint}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

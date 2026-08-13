'use client';

/**
 * Nút đổi giao diện của /chat — nằm ngay cạnh nút "về trang chủ" trên thanh
 * đầu trang, ở CẢ HAI giao diện, để đổi qua lại chỗ nào cũng thấy.
 *
 * Là một cặp nút phân đoạn (segmented) chứ không phải một nút bập bênh: người
 * dùng nhìn thấy ngay đang ở giao diện nào và có mấy lựa chọn, không phải bấm
 * thử. `tone` chỉ đổi màu của chính cái nút cho hợp nền đang đứng.
 */
import { motion } from 'framer-motion';
import { TerminalSquare, Sparkles } from 'lucide-react';
import { useChatSkinStore, type ChatSkin } from '@/store/chatSkinStore';
import { cn } from '@/lib/utils';

const OPTIONS: { id: ChatSkin; icon: typeof TerminalSquare; title: string }[] = [
  { id: 'terminal', icon: TerminalSquare, title: 'Giao diện Terminal (bản gốc)' },
  { id: 'studio', icon: Sparkles, title: 'Giao diện Studio — dễ nhìn' },
];

export default function ChatSkinToggle({
  tone = 'terminal',
  className,
}: {
  tone?: 'terminal' | 'studio';
  className?: string;
}) {
  const skin = useChatSkinStore((s) => s.skin);
  const setSkin = useChatSkinStore((s) => s.setSkin);
  const isStudioTone = tone === 'studio';

  return (
    <div
      role="group"
      aria-label="Đổi giao diện chat"
      title="Đổi giao diện chat"
      className={cn(
        'relative flex items-center gap-0.5 rounded-full p-0.5',
        isStudioTone
          ? 'border border-[color:var(--studio-border)] bg-[var(--studio-panel-soft)]'
          : 'border border-[#22d3ee]/20 bg-[#0d1117]/70',
        className,
      )}
    >
      {OPTIONS.map(({ id, icon: Icon, title }) => {
        const active = skin === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setSkin(id)}
            aria-pressed={active}
            aria-label={title}
            title={title}
            className={cn(
              'relative flex h-7 w-8 items-center justify-center rounded-full transition-colors',
              active
                ? isStudioTone
                  ? 'text-[color:var(--studio-text)]'
                  : 'text-[#22d3ee]'
                : isStudioTone
                  ? 'text-[color:var(--studio-text-faint)] hover:text-[color:var(--studio-text-soft)]'
                  : 'text-[#64748b] hover:text-[#94a3b8]',
            )}
          >
            {active && (
              <motion.span
                layoutId={`chat-skin-pill-${tone}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.6 }}
                className={cn(
                  'absolute inset-0 rounded-full',
                  isStudioTone
                    ? 'bg-[var(--studio-panel)] shadow-[0_1px_3px_rgba(0,0,0,0.14)]'
                    : 'bg-[#22d3ee]/15 shadow-[0_0_10px_rgba(34,211,238,0.18)]',
                )}
              />
            )}
            <Icon className="relative w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X, MessagesSquare } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslation } from '@/hooks/useTranslation';

const SIDEBAR_COLLAPSED_WIDTH = 40;
const SIDEBAR_EXPANDED_WIDTH = 288;
const APPLE_EASE: [number, number, number, number] = [0.32, 0.94, 0.6, 1];

interface ChatSidebarProps {
  onDeleteSession: (sessionId: string) => Promise<void>;
  onSelectSession: (sessionId: string) => Promise<void>;
}

// ── iOS-style cinematic easing: snappy yet organic ─────────────────────
const sessionItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: APPLE_EASE },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

export default function ChatSidebar({ onDeleteSession, onSelectSession }: ChatSidebarProps) {
  const { t } = useTranslation();
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    setSidebarOpen,
    setCurrentSessionId,
    clearMessages,
  } = useChatStore();

  // Default to collapsed on first mount. The store flag is left
  // alone so other consumers (e.g. external links that want to
  // open the panel) can still drive the expanded state, but the
  // sidebar on this page presents itself as a minimap-rail by
  // default — the user clicks the icon to expand. We track
  // `hasUserToggled` so the user's first click is honoured
  // immediately instead of being ignored.
  const [hasUserToggled, setHasUserToggled] = useState(false);
  const expanded = hasUserToggled ? isSidebarOpen : false;

  const toggle = useCallback(() => {
    setHasUserToggled(true);
    setSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen, setSidebarOpen]);

  const close = useCallback(() => {
    setHasUserToggled(true);
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  const handleNewSession = useCallback(() => {
    setCurrentSessionId(null);
    clearMessages('__new__');
    setCurrentSessionId(null);
  }, [setCurrentSessionId, clearMessages]);

  const handleSelectSession = useCallback(
    async (sessionId: string) => {
      setCurrentSessionId(sessionId);
      await onSelectSession(sessionId);
      // Auto-collapse after picking a session so the chat area
      // gets the full width — minimap behaviour.
      setHasUserToggled(true);
      setSidebarOpen(false);
    },
    [setCurrentSessionId, onSelectSession, setSidebarOpen],
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      await onDeleteSession(sessionId);
    },
    [onDeleteSession],
  );

  const hasActiveSession = !!currentSessionId &&
    sessions.some((s) => s.sessionId === currentSessionId);

  return (
    <>
      {/* ── Backdrop — only when expanded. Click anywhere outside
            the rail to close it (minimap dismiss-on-outside-click). */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="chat-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: APPLE_EASE }}
            onClick={close}
            className="fixed inset-0 z-[50] bg-black/30 backdrop-blur-[2px]"
            style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Chat sidebar — iOS dock style rail ──
            Collapsed: 40px vertical strip pinned to the left edge,
            hugging the dock at the far left. The dock (z-59) is
            still drawn on top so its icons remain reachable — the
            40px rail sits just *behind* the dock and is a sibling
            overlay, not a reflow of the page.

            Expanded: 288px drawer that pushes the backdrop with it.
            Auto-collapses after a session is selected. */}
      <motion.aside
        key="chat-sidebar-panel"
        initial={false}
        animate={{ width: expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
        transition={{ type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.9 }}
        className="fixed top-[var(--app-nav-h)] left-0 bottom-0 z-[51] flex flex-col
          bg-[#0d1117]/[0.97] backdrop-blur-xl
          border-r border-[#22d3ee]/10
          shadow-[4px_0_32px_rgba(0,0,0,0.4)] overflow-hidden"
        aria-label="Chat sessions"
      >
        {/* ── Collapsed (40px) rail body ── */}
        <div
          className="flex flex-col items-center pt-3 gap-2 shrink-0"
          style={{ display: expanded ? 'none' : 'flex' }}
        >
          {/* Toggle pill — MessageSquare icon, glows when expanded
              is wanted. The whole 40px rail is the click target. */}
          <motion.button
            onClick={toggle}
            className="group relative w-9 h-9 rounded-xl flex items-center justify-center
              bg-white/[0.04] hover:bg-[#22d3ee]/15
              border border-[#22d3ee]/10 hover:border-[#22d3ee]/35
              text-[#64748b] hover:text-[#22d3ee]
              transition-all duration-200"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={expanded ? 'Collapse sessions' : 'Open sessions'}
            title="Sessions"
          >
            <MessagesSquare className="w-4 h-4" />
            {sessions.length > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1
                  bg-[#ef4444] text-white text-[9px] font-bold rounded-full
                  flex items-center justify-center
                  shadow-[0_0_8px_rgba(239,68,68,0.6)]
                  ring-2 ring-[#0d1117]
                  font-variant-numeric:tabular-nums"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {sessions.length > 99 ? '99+' : sessions.length}
              </span>
            )}
            {hasActiveSession && (
              <motion.span
                layoutId="chat-rail-active"
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full
                  bg-[#22d3ee]"
                style={{ boxShadow: '0 0 8px rgba(34,211,238,0.8)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>

          {/* Tiny magnify hint on hover */}
          <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] font-mono uppercase tracking-widest text-[#64748b]/40 group-hover:text-[#64748b]/80 transition-colors">
            {sessions.length} session{sessions.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* ── Expanded body ── */}
        <div className="flex flex-col h-full" style={{ display: expanded ? 'flex' : 'none' }}>
          {/* Header */}
          <div className="p-4 border-b border-[#22d3ee]/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22d3ee] led-eye" />
              <span className="font-mono text-sm font-semibold text-[#f8fafc]">
                <span className="text-[#64748b]">~/</span>
                <span className="text-[#22d3ee]">sessions</span>
              </span>
            </div>
            <motion.button
              onClick={close}
              className="flex items-center justify-center w-7 h-7 rounded-xl
                bg-white/[0.05] hover:bg-white/[0.1]
                border border-[#22d3ee]/10 hover:border-[#22d3ee]/25
                text-[#64748b] hover:text-[#22d3ee]
                transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* New session button */}
          <div className="p-3 shrink-0">
            <button
              onClick={() => { setCurrentSessionId(null); }}
              className="w-full flex items-center gap-2 px-4 py-2.5
                bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]
                text-white text-sm font-mono font-semibold rounded-xl
                hover:opacity-90 transition-opacity
                shadow-[0_0_16px_rgba(34,211,238,0.2)]"
            >
              <Plus className="w-4 h-4" />
              <span>&gt; new_session()</span>
            </button>
          </div>

          {/* Session list */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
            {sessions.length === 0 && (
              <p className="text-[#64748b] text-xs text-center py-8 px-2 font-mono">
                <span className="text-[#22d3ee]">//</span> no sessions found
              </p>
            )}
            {sessions.map((session, i) => (
              <motion.button
                key={session.sessionId}
                custom={i}
                variants={sessionItemVariants}
                initial="hidden"
                animate="visible"
                onClick={() => handleSelectSession(session.sessionId)}
                className={`w-full text-left px-3 py-3 rounded-xl transition-all relative group
                  ${currentSessionId === session.sessionId
                    ? 'bg-[#22d3ee]/10 text-[#f8fafc] border border-[#22d3ee]/20'
                    : 'hover:bg-[#22d3ee]/5 text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
              >
                <div className="flex items-start gap-2 pr-8">
                  <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentSessionId === session.sessionId ? 'text-[#22d3ee]' : 'text-[#64748b]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono truncate">
                      <span className="text-[#64748b]">$ </span>
                      <span className={currentSessionId === session.sessionId ? 'text-[#22d3ee]' : 'text-[#94a3b8]'}>
                        {session.title || 'New chat'}
                      </span>
                    </p>
                    <p className="text-[10px] font-mono text-[#64748b] mt-0.5">
                      {format(new Date(session.createdAt), 'dd/MM/yy HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>
                {currentSessionId === session.sessionId && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] led-eye" />
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.sessionId, e); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                    text-[#64748b] hover:text-red-400 hover:bg-red-500/10
                    opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Delete session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[#22d3ee]/10 shrink-0">
            <p className="text-[10px] font-mono text-[#64748b]/50 text-center">
              <span className="text-[#22d3ee]/40">/* </span>CuongMini-OS v1.0<span className="text-[#22d3ee]/40"> */</span>
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslation } from '@/hooks/useTranslation';

const SIDEBAR_WIDTH = 288;
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

  const handleNewSession = useCallback(() => {
    setCurrentSessionId(null);
    clearMessages('__new__');
    setCurrentSessionId(null);
  }, [setCurrentSessionId, clearMessages]);

  const handleSelectSession = useCallback(
    async (sessionId: string) => {
      setCurrentSessionId(sessionId);
      await onSelectSession(sessionId);
    },
    [setCurrentSessionId, onSelectSession]
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      await onDeleteSession(sessionId);
    },
    [onDeleteSession]
  );

  return (
    <>
      {/* ── Full-screen backdrop: dims entire page, click to dismiss ─────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="chat-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: APPLE_EASE }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-md"
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Chat sidebar: fixed overlay drawer ── */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            key="chat-sidebar-panel"
            initial={{ x: -SIDEBAR_WIDTH - 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -SIDEBAR_WIDTH - 24, opacity: 0 }}
            transition={{ type: 'spring' as const, stiffness: 220, damping: 24, mass: 0.85 }}
            className="fixed top-0 left-0 h-full z-[51] flex flex-col"
            style={{ width: SIDEBAR_WIDTH }}
          >
            <div
              className="flex flex-col h-full overflow-y-auto
                bg-[#0d1117]/[0.97] backdrop-blur-xl
                border-r border-[#22d3ee]/10
                shadow-[8px_0_48px_rgba(0,0,0,0.5),inset_-1px_0_0_rgba(255,255,255,0.03)]"
            >
              {/* ── Header with explicit close button ─────────────── */}
              <div className="p-4 border-b border-[#22d3ee]/10 flex items-center justify-between shrink-0">
                {/* Terminal header */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22d3ee] led-eye" />
                  <span className="font-mono text-sm font-semibold text-[#f8fafc]">
                    <span className="text-[#64748b]">~/</span>
                    <span className="text-[#22d3ee]">sessions</span>
                  </span>
                </div>
                <motion.button
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-xl
                    bg-white/[0.05] hover:bg-white/[0.1]
                    border border-[#22d3ee]/10 hover:border-[#22d3ee]/25
                    text-[#64748b] hover:text-[#22d3ee]
                    transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* New conversation button */}
              <div className="p-4 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNewSession}
                  className="w-full flex items-center gap-2 px-4 py-2.5
                    bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]
                    text-white text-sm font-mono font-semibold rounded-xl
                    hover:opacity-90 transition-opacity
                    shadow-[0_0_16px_rgba(34,211,238,0.25)]"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[#f8fafc]">&gt; new_session()</span>
                </motion.button>
              </div>

              {/* Session list */}
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                {sessions.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#64748b] text-xs text-center py-8 px-2 font-mono"
                  >
                    <span className="text-[#22d3ee]">//</span> no sessions found
                  </motion.p>
                )}
                <AnimatePresence>
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session.sessionId}
                      custom={index}
                      variants={sessionItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={() => handleSelectSession(session.sessionId)}
                      className={`w-full text-left px-3 py-3 rounded-xl mb-1 group transition-all relative cursor-pointer
                        cyber-sidebar-item
                        ${currentSessionId === session.sessionId
                          ? 'active bg-[#22d3ee]/8 text-[#f8fafc] border border-[#22d3ee]/20'
                          : 'hover:bg-[#22d3ee]/5 text-[#94a3b8] hover:text-[#f8fafc]'
                        }`}
                    >
                      {/* Session icon */}
                      <div className="flex items-start gap-2 pr-6">
                        <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentSessionId === session.sessionId ? 'text-[#22d3ee]' : 'text-[#64748b]'}`} />
                        <div className="flex-1 min-w-0">
                          {/* Terminal-style session name */}
                          <p className="text-xs font-mono truncate">
                            <span className="text-[#64748b]">$ </span>
                            <span className={currentSessionId === session.sessionId ? 'text-[#22d3ee]' : 'text-[#94a3b8]'}>
                              {session.title || t('chat.newChat')}
                            </span>
                          </p>
                          <p className="text-[10px] font-mono text-[#64748b] mt-0.5">
                            {format(new Date(session.createdAt), 'dd/MM/yy HH:mm', { locale: vi })}
                          </p>
                        </div>
                      </div>

                      {/* Active indicator */}
                      {currentSessionId === session.sessionId && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] led-eye" />
                        </div>
                      )}

                      <button
                        onClick={(e) => handleDeleteSession(session.sessionId, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                          text-[#64748b] hover:text-red-400 hover:bg-red-500/10
                          opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Sidebar footer */}
              <div className="px-4 py-2 border-t border-[#22d3ee]/10 shrink-0">
                <p className="text-[10px] font-mono text-[#64748b]/50 text-center">
                  <span className="text-[#22d3ee]/40">/* </span>
                  CuongMini-OS v1.0
                  <span className="text-[#22d3ee]/40"> */</span>
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

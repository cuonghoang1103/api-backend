'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslation } from '@/hooks/useTranslation';

interface ChatSidebarProps {
  onDeleteSession: (sessionId: string) => Promise<void>;
  onSelectSession: (sessionId: string) => Promise<void>;
}

export default function ChatSidebar({ onDeleteSession, onSelectSession }: ChatSidebarProps) {
  const { t } = useTranslation();
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    setSidebarOpen,
    removeSession,
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
      removeSession(sessionId);
      await onDeleteSession(sessionId);
    },
    [removeSession, onDeleteSession]
  );

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 288 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-shrink-0 border-r border-[#22d3ee]/10 bg-[#0d1117]/80 backdrop-blur-xl overflow-hidden flex flex-col relative z-20"
      >
        <div className="p-4 border-b border-[#22d3ee]/10 flex items-center justify-between min-w-[288px]">
          {/* Terminal header */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22d3ee] led-eye" />
            <motion.h2
              initial={false}
              animate={{ opacity: isSidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-sm font-semibold text-[#f8fafc]"
            >
              <span className="text-[#64748b]">~/</span>
              <span className="text-[#22d3ee]">sessions</span>
            </motion.h2>
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-[#22d3ee]/10 text-[#64748b] hover:text-[#22d3ee] transition-colors border border-transparent hover:border-[#22d3ee]/20"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New conversation button */}
        <div className="p-4 min-w-[288px]">
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
        <div className="flex-1 overflow-y-auto px-2 pb-4 min-w-[288px]">
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
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
        <div className="px-4 py-2 border-t border-[#22d3ee]/10">
          <p className="text-[10px] font-mono text-[#64748b]/50 text-center">
            <span className="text-[#22d3ee]/40">/* </span>
            CuongMini-OS v1.0
            <span className="text-[#22d3ee]/40"> */</span>
          </p>
        </div>
      </motion.aside>

      {/* Toggle button when collapsed */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSidebarOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20
              p-2 bg-[#0d1117]/90 border border-[#22d3ee]/15 border-l-0
              rounded-r-xl text-[#64748b] hover:text-[#22d3ee]
              hover:bg-[#0d1117] transition-colors
              shadow-[0_0_12px_rgba(34,211,238,0.1)]"
            title="Show sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

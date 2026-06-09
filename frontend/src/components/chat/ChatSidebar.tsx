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
    addSession,
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
        className="flex-shrink-0 border-r border-darkborder bg-darkcard overflow-hidden flex flex-col relative"
      >
        <div className="p-4 border-b border-darkborder flex items-center justify-between min-w-[288px]">
          <motion.h2
            initial={false}
            animate={{ opacity: isSidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="font-heading font-bold text-text-primary"
          >
            {t('chat.conversations')}
          </motion.h2>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New conversation button */}
        <div className="p-4 min-w-[288px]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewSession}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-neon-violet/20"
          >
            <Plus className="w-4 h-4" />
            {t('chat.newConversation')}
          </motion.button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 min-w-[288px]">
          {sessions.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text-muted text-sm text-center py-8 px-2"
            >
              {t('chat.noConversations')}
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
                className={`w-full text-left px-3 py-3 rounded-xl mb-1 group transition-all relative cursor-pointer ${
                  currentSessionId === session.sessionId
                    ? 'bg-gradient-to-r from-neon-indigo/15 to-neon-violet/15 text-text-primary border border-neon-violet/20'
                    : 'hover:bg-white/5 text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-start gap-2 pr-6">
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-neon-violet" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.title || t('chat.newChat')}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {format(new Date(session.createdAt), 'dd/MM/yyyy, HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(session.sessionId, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-darkcard border border-darkborder border-l-0 rounded-r-xl text-text-muted hover:text-text-primary hover:bg-darkcard/90 transition-colors shadow-lg"
            title="Show sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

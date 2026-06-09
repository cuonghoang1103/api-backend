import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ssrSafeStorage } from './ssrSafeStorage';
import type { ChatMessage, ChatSession } from '@/types';

export type RobotEmotion = 'idle' | 'thinking' | 'happy' | 'typing' | 'sad' | 'excited';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: Record<string, ChatMessage[]>;
  isStreaming: boolean;
  robotEmotion: RobotEmotion;
  suggestedPrompts: SuggestedPrompt[];
  isSidebarOpen: boolean;
  isRobotOpen: boolean;
  limitedMode: boolean;
  limitedModeReason: string;

  // Actions
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
  removeSession: (sessionId: string) => void;
  setCurrentSessionId: (id: string | null) => void;

  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateLastAssistantMessage: (sessionId: string, content: string) => void;
  removePendingMessage: (sessionId: string, tempId: number) => void;
  setMessages: (sessionId: string, messages: ChatMessage[]) => void;
  clearMessages: (sessionId: string) => void;

  setStreaming: (v: boolean) => void;
  setRobotEmotion: (e: RobotEmotion) => void;
  setSuggestedPrompts: (prompts: SuggestedPrompt[]) => void;
  setSidebarOpen: (v: boolean) => void;
  setRobotOpen: (v: boolean) => void;
  setLimitedMode: (enabled: boolean, reason?: string) => void;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category: 'about' | 'skills' | 'projects' | 'blog' | 'general' | 'coding' | 'course';
}

const INITIAL_PROMPTS: SuggestedPrompt[] = [
  { id: '1', label: 'About CuongHoang', icon: '👤', prompt: 'Tell me about CuongHoang — a full-stack developer', category: 'about' },
  { id: '2', label: 'Skills & Tech', icon: '⚡', prompt: 'What skills and technologies does CuongHoang have?', category: 'skills' },
  { id: '3', label: 'Projects Done', icon: '🚀', prompt: 'What projects has CuongHoang worked on?', category: 'projects' },
  { id: '4', label: 'Recent Blogs', icon: '📝', prompt: 'What are the recent blog posts by CuongHoang about?', category: 'blog' },
  { id: '5', label: 'Start a Project', icon: '💻', prompt: 'Help me start a new coding project with Next.js', category: 'coding' },
  { id: '6', label: 'Explore Courses', icon: '🎓', prompt: 'What courses does the academy offer?', category: 'course' },
];

const CONTEXTUAL_PROMPTS: Record<string, SuggestedPrompt[]> = {
  skills: [
    { id: 'c1', label: 'Frontend Skills', icon: '🎨', prompt: 'What frontend technologies does CuongHoang specialize in?', category: 'skills' },
    { id: 'c2', label: 'Backend Skills', icon: '⚙️', prompt: 'What backend technologies does CuongHoang know?', category: 'skills' },
    { id: 'c3', label: 'DevOps & Tools', icon: '🛠️', prompt: 'What DevOps tools and CI/CD experience does CuongHoang have?', category: 'skills' },
    { id: 'c4', label: 'AI & Machine Learning', icon: '🤖', prompt: 'What AI/ML skills does CuongHoang have?', category: 'skills' },
  ],
  projects: [
    { id: 'c5', label: 'Portfolio Website', icon: '🌐', prompt: 'Tell me more about the portfolio website', category: 'projects' },
    { id: 'c6', label: 'E-commerce Project', icon: '🛒', prompt: 'What e-commerce features are built?', category: 'projects' },
    { id: 'c7', label: 'AI Chat System', icon: '💬', prompt: 'How does the AI chat RAG system work?', category: 'projects' },
    { id: 'c8', label: 'Online Academy', icon: '📚', prompt: 'Tell me about the online course platform', category: 'projects' },
  ],
  blog: [
    { id: 'c9', label: 'Latest Post', icon: '📰', prompt: 'What is the latest blog post about?', category: 'blog' },
    { id: 'c10', label: 'Programming Posts', icon: '💡', prompt: 'Show me programming tutorials or tips from the blog', category: 'blog' },
    { id: 'c11', label: 'Project Updates', icon: '🔄', prompt: 'Any recent project updates or changelogs?', category: 'blog' },
  ],
  about: [
    { id: 'c12', label: 'Work Experience', icon: '💼', prompt: 'What is CuongHoang\'s work experience?', category: 'about' },
    { id: 'c13', label: 'Education', icon: '🎓', prompt: 'What is CuongHoang\'s educational background?', category: 'about' },
    { id: 'c14', label: 'Contact Info', icon: '📧', prompt: 'How can I contact CuongHoang?', category: 'about' },
  ],
  coding: [
    { id: 'c15', label: 'React Best Practices', icon: '⚛️', prompt: 'Share React best practices and patterns', category: 'coding' },
    { id: 'c16', label: 'Next.js Tips', icon: '▲', prompt: 'Give me advanced Next.js tips and tricks', category: 'coding' },
    { id: 'c17', label: 'Spring Boot Guide', icon: '☕', prompt: 'How to structure a Spring Boot application?', category: 'coding' },
  ],
  course: [
    { id: 'c18', label: 'Course Catalog', icon: '📖', prompt: 'What courses are available in the academy?', category: 'course' },
    { id: 'c19', label: 'Free Courses', icon: '🆓', prompt: 'Show me free courses available', category: 'course' },
    { id: 'c20', label: 'Featured Course', icon: '⭐', prompt: 'What is the most popular course?', category: 'course' },
  ],
};

export function getContextualPrompts(lastContent: string): SuggestedPrompt[] {
  const lower = lastContent.toLowerCase();
  for (const [key, prompts] of Object.entries(CONTEXTUAL_PROMPTS)) {
    if (lower.includes(key) || lower.includes(prompts[0].category)) {
      return prompts;
    }
  }
  return INITIAL_PROMPTS;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      messages: {},
      isStreaming: false,
      robotEmotion: 'idle',
      suggestedPrompts: INITIAL_PROMPTS,
      isSidebarOpen: true,
      isRobotOpen: false,
      limitedMode: false,
      limitedModeReason: '',

      setSessions: (sessions) => set({ sessions }),

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions.filter((s) => s.sessionId !== session.sessionId)],
        })),

      removeSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: _, ...rest } = state.messages;
          return {
            sessions: state.sessions.filter((s) => s.sessionId !== sessionId),
            messages: rest,
            currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
          };
        }),

      setCurrentSessionId: (id) => set({ currentSessionId: id }),

      addMessage: (sessionId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: [...(state.messages[sessionId] || []), message],
          },
        })),

      updateLastAssistantMessage: (sessionId, content) =>
        set((state) => {
          const msgs = state.messages[sessionId];
          if (!msgs || msgs.length === 0) return state;
          const last = msgs[msgs.length - 1];
          if (last.role !== 'assistant') return state;
          return {
            messages: {
              ...state.messages,
              [sessionId]: [...msgs.slice(0, -1), { ...last, content }],
            },
          };
        }),

      removePendingMessage: (sessionId, tempId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: (state.messages[sessionId] || []).filter((m) => m.id !== tempId),
          },
        })),

      setMessages: (sessionId, messages) =>
        set((state) => ({
          messages: { ...state.messages, [sessionId]: messages },
        })),

      clearMessages: (sessionId) =>
        set((state) => ({
          messages: { ...state.messages, [sessionId]: [] },
        })),

      setStreaming: (v) => set({ isStreaming: v }),
      setRobotEmotion: (e) => set({ robotEmotion: e }),
      setSuggestedPrompts: (prompts) => set({ suggestedPrompts: prompts }),
      setSidebarOpen: (v) => set({ isSidebarOpen: v }),
      setRobotOpen: (v) => set({ isRobotOpen: v }),
      setLimitedMode: (enabled, reason) => set({ limitedMode: enabled, limitedModeReason: reason || '' }),
    }),
    {
      name: 'chat-storage-v1',
      storage: createJSONStorage(() => ssrSafeStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        messages: state.messages,
        currentSessionId: state.currentSessionId,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);

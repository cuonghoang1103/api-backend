'use client';

/**
 * Model switcher for the AI Chat Bot — a compact popover near the send bar
 * (like Claude/ChatGPT's model picker). Reads/writes the shared model store so
 * the /chat page and the floating ChatModal stay in sync.
 *
 * The menu opens UPWARD (the picker sits at the bottom of the chat, above the
 * input) and uses a high z-index so it isn't clipped by the input row.
 */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Sparkles, Zap, Gem, Crown, Lock } from 'lucide-react';
import { CHAT_MODELS, useChatModelStore, getChatModel, DEFAULT_CHAT_MODEL_ID } from '@/lib/aiChatModels';
import { usePro } from '@/hooks/usePro';

const TIER_ICON = { default: Zap, pro: Gem, max: Crown } as const;
const TIER_COLOR = {
  default: 'text-cyan-300',
  pro: 'text-violet-300',
  max: 'text-amber-300',
} as const;

export default function ModelPicker({ disabled = false }: { disabled?: boolean }) {
  const { modelId, setModelId } = useChatModelStore();
  const { isPro } = usePro();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // If a non-Pro user somehow has a Pro/Max model selected, reflect the default.
  const effectiveId = !isPro && getChatModel(modelId).tier !== 'default' ? DEFAULT_CHAT_MODEL_ID : modelId;
  const active = getChatModel(effectiveId);
  const ActiveIcon = TIER_ICON[active.tier];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((s) => !s)}
        disabled={disabled}
        title="Chọn model AI"
        className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10 disabled:opacity-50 ${TIER_COLOR[active.tier]}`}
      >
        <ActiveIcon className="h-3.5 w-3.5" />
        <span>{active.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-[120] mb-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#0d1424] shadow-2xl shadow-black/50">
          <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2 text-[11px] text-slate-500">
            <Sparkles className="h-3 w-3" /> Chọn model
          </div>
          {CHAT_MODELS.map((m) => {
            const Icon = TIER_ICON[m.tier];
            const isActive = m.id === active.id;
            const locked = m.tier !== 'default' && !isPro;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  if (locked) { setOpen(false); router.push('/pro'); return; }
                  setModelId(m.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/5 ${isActive ? 'bg-white/[0.04]' : ''}`}
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${TIER_COLOR[m.tier]}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm text-white">
                    {m.label}
                    {m.tier === 'default' && <span className="rounded bg-white/10 px-1 py-0.5 text-[9px] text-slate-400">MẶC ĐỊNH</span>}
                    {locked && <span className="inline-flex items-center gap-0.5 rounded bg-amber-400/15 px-1 py-0.5 text-[9px] font-semibold text-amber-300"><Crown className="h-2.5 w-2.5" /> PRO</span>}
                  </div>
                  <div className="text-[11px] text-slate-500">{locked ? 'Nâng cấp Pro để mở khoá' : m.desc}</div>
                </div>
                {locked ? <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" /> : isActive ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

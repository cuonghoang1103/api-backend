'use client';

/**
 * Emoji picker popover for the chat composer. Wraps @emoji-mart via
 * a dynamic (ssr:false) import — emoji-mart touches `document` at
 * load time so it must never run on the server. Renders nothing
 * until `open`.
 */

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import data from '@emoji-mart/data';

// emoji-mart's React wrapper. Loaded only on the client.
const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

export default function EmojiPickerPopover({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    // Defer so the click that opened the popover doesn't immediately close it.
    const t = setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="absolute bottom-full left-0 z-50 mb-2">
      <Picker
        data={data}
        onEmojiSelect={(e: { native?: string }) => {
          if (e.native) onPick(e.native);
        }}
        theme="dark"
        previewPosition="none"
        skinTonePosition="search"
        navPosition="top"
        perLine={8}
        emojiSize={20}
      />
    </div>
  );
}

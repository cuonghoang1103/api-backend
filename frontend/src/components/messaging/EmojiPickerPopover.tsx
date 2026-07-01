'use client';

/**
 * Emoji picker popover for the chat composer. Wraps @emoji-mart via
 * a dynamic (ssr:false) import — emoji-mart touches `document` at
 * load time so it must never run on the server. Renders nothing
 * until `open`.
 */

import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import data from '@emoji-mart/data';
import { useAnchoredFixedStyle } from './useAnchoredPopover';
import { useThemeClass } from '@/context/ThemeContext';

// emoji-mart's React wrapper. Loaded only on the client.
const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

export default function EmojiPickerPopover({
  open,
  onClose,
  onPick,
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
  anchorRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fixedStyle = useAnchoredFixedStyle(anchorRef, open, 352);
  // Follow the app theme instead of hardcoding dark — otherwise the
  // picker renders a dark panel with dark labels in light mode.
  const themeClass = useThemeClass();

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

  const body = (
    <div
      ref={ref}
      className={anchorRef ? 'z-[60]' : 'absolute bottom-full left-0 z-50 mb-2'}
      style={anchorRef ? fixedStyle : undefined}
    >
      <Picker
        data={data}
        onEmojiSelect={(e: { native?: string }) => {
          if (e.native) onPick(e.native);
        }}
        theme={themeClass}
        previewPosition="none"
        skinTonePosition="search"
        navPosition="top"
        perLine={8}
        emojiSize={20}
      />
    </div>
  );

  return anchorRef ? createPortal(body, document.body) : body;
}

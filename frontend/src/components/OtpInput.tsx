'use client';

import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: string;
}

/**
 * 6-digit OTP input — six individual cells, paste-aware, auto-advance.
 * Keyboard: ←/→ to navigate, Backspace to clear & move back, digits to fill.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  error,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = new Array(length).fill('');
    for (let i = 0; i < value.length && i < length; i++) {
      arr[i] = value[i] ?? '';
    }
    return arr;
  });

  useEffect(() => {
    const arr = new Array(length).fill('');
    for (let i = 0; i < value.length && i < length; i++) {
      arr[i] = value[i] ?? '';
    }
    setDigits(arr);
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const updateDigits = (next: string[]) => {
    setDigits(next);
    const newValue = next.join('');
    onChange(newValue);
    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const handleChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, ''); // digits only
    if (v.length === 0) {
      const next = [...digits];
      next[idx] = '';
      updateDigits(next);
      return;
    }
    // Take last char (in case user types fast)
    const char = v[v.length - 1] ?? '';
    const next = [...digits];
    next[idx] = char;
    updateDigits(next);
    // Auto-advance
    if (idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
      inputRefs.current[idx + 1]?.select();
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = '';
        updateDigits(next);
      } else if (idx > 0) {
        const next = [...digits];
        next[idx - 1] = '';
        updateDigits(next);
        inputRefs.current[idx - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i] ?? '';
    }
    updateDigits(next);
    // Focus the next empty cell or the last cell
    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${idx + 1} of ${length}`}
            className={`
              w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold
              rounded-xl border-2 transition-all
              bg-darkbg text-text-primary
              ${error
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-darkborder focus:border-neon-violet'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-neon-violet/50'}
              focus:outline-none focus:ring-2 focus:ring-neon-violet/30
              caret-neon-violet
            `}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
}

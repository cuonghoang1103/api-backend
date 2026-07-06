'use client';
/**
 * Stage registry: metadata (number, name, description, icon, accent) and the
 * component that renders each of the 9 kana stages.
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ListChecks,
  Shuffle,
  Grid2x2,
  Keyboard,
  Type,
  AlignLeft,
  Ear,
  PenLine,
  Brush,
} from 'lucide-react';
import type { StageProps, StageType } from '../types';
import { MultipleChoiceStage, ReversedChoiceStage, FindPairStage } from './ChoiceStages';
import { WriteAnswerStage, WriteWordStage, WriteTextStage, ListenStage } from './WriteStages';
import { StrokeOrderStage, DrawKanaStage } from './DrawStages';

export type Accent = 'violet' | 'cyan' | 'green' | 'orange' | 'red' | 'fuchsia';

export interface StageMeta {
  n: number;
  name: string;
  desc: string;
  icon: LucideIcon;
  accent: Accent;
  component: React.ComponentType<StageProps>;
}

export const STAGE_META: Record<StageType, StageMeta> = {
  choice: { n: 1, name: 'Trắc nghiệm', desc: 'Nhìn kana, chọn romaji', icon: ListChecks, accent: 'violet', component: MultipleChoiceStage },
  reverse: { n: 2, name: 'Trắc nghiệm đảo', desc: 'Nhìn romaji, chọn kana', icon: Shuffle, accent: 'cyan', component: ReversedChoiceStage },
  pair: { n: 3, name: 'Tìm cặp', desc: 'Ghép kana với romaji', icon: Grid2x2, accent: 'green', component: FindPairStage },
  write: { n: 4, name: 'Viết đáp án', desc: 'Gõ romaji của kana', icon: Keyboard, accent: 'orange', component: WriteAnswerStage },
  writeWord: { n: 5, name: 'Viết từ', desc: 'Gõ romaji chuỗi ngắn', icon: Type, accent: 'fuchsia', component: WriteWordStage },
  writeText: { n: 6, name: 'Viết đoạn', desc: 'Gõ romaji chuỗi dài', icon: AlignLeft, accent: 'violet', component: WriteTextStage },
  listen: { n: 7, name: 'Nghe', desc: 'Nghe rồi gõ romaji', icon: Ear, accent: 'cyan', component: ListenStage },
  stroke: { n: 8, name: 'Tập viết', desc: 'Tô theo nét mẫu', icon: PenLine, accent: 'green', component: StrokeOrderStage },
  draw: { n: 9, name: 'Vẽ kana', desc: 'Nhớ & vẽ lại kana', icon: Brush, accent: 'orange', component: DrawKanaStage },
};

/** Ordered list (stage 1 → 9). */
export const STAGE_ORDER: StageType[] = (Object.keys(STAGE_META) as StageType[]).sort(
  (a, b) => STAGE_META[a].n - STAGE_META[b].n,
);

export const ACCENT_TEXT: Record<Accent, string> = {
  violet: 'text-neon-violet',
  cyan: 'text-neon-cyan',
  green: 'text-neon-green',
  orange: 'text-neon-orange',
  red: 'text-neon-red',
  fuchsia: 'text-neon-fuchsia',
};

export function StageRenderer({ stage, ...props }: { stage: StageType } & StageProps) {
  const Comp = STAGE_META[stage].component;
  return <Comp {...props} />;
}

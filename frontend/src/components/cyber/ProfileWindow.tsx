'use client';

import { useEffect, useRef, useState } from 'react';
import { Cpu, Zap } from 'lucide-react';
import type { CyberProfile } from '@/lib/api';

interface ProfileWindowProps {
  profile: CyberProfile | null;
  loading: boolean;
}

export function ProfileWindow({ profile, loading }: ProfileWindowProps) {
  const [animating, setAnimating] = useState(false);
  const prevExp = useRef(profile?.currentExp ?? 0);
  const prevLevel = useRef(profile?.level ?? 0);

  useEffect(() => {
    if (!profile) return;
    if (profile.currentExp !== prevExp.current || profile.level !== prevLevel.current) {
      setAnimating(true);
      prevExp.current = profile.currentExp;
      prevLevel.current = profile.level;
      setTimeout(() => setAnimating(false), 1000);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-8 bg-white/5 rounded animate-pulse" />
        <div className="h-2 bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-white/30 font-mono text-xs">
        &gt; PROFILE_NOT_FOUND. INIT_REQUIRED.
      </div>
    );
  }

  const progress = Math.min((profile.currentExp / profile.requiredExp) * 100, 100);
  const progressStr = progress.toFixed(1);

  return (
    <div className="space-y-4">
      {/* Level Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-lg border-2 border-neon-green/40 bg-neon-green/10 flex items-center justify-center">
              <span className="font-mono text-2xl font-black text-neon-green">
                {profile.level}
              </span>
            </div>
            {animating && (
              <div className="absolute inset-0 rounded-lg border-2 border-neon-green animate-pulse" />
            )}
          </div>
          <div>
            <div className="text-xs text-white/40 font-mono">USER_LEVEL</div>
            <div className="font-mono text-neon-green text-lg font-bold tracking-wider">
              LVL_{String(profile.level).padStart(3, '0')}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-white/40 font-mono">NEXT_LEVEL</div>
          <div className="font-mono text-neon-amber text-sm">
            {profile.requiredExp} EXP
          </div>
        </div>
      </div>

      {/* EXP Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-white/40">
          <span>EXPERIENCE</span>
          <span className="text-neon-green">
            {profile.currentExp} / {profile.requiredExp}
          </span>
        </div>
        <div className="h-3 bg-white/5 rounded-sm overflow-hidden border border-white/10 relative">
          <div
            className={`h-full bg-gradient-to-r from-neon-green/80 to-neon-green transition-all duration-700 ease-out ${animating ? 'shadow-[0_0_10px_#00ff66]' : ''}`}
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-white/20 to-transparent transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[9px] text-white/50">
              {progressStr}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 rounded border border-white/10 p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-neon-cyan mb-1">
            <Cpu size={10} />
          </div>
          <div className="font-mono text-neon-cyan text-xs font-bold">{profile.level}</div>
          <div className="text-[9px] text-white/30 font-mono">LEVEL</div>
        </div>
        <div className="bg-white/5 rounded border border-white/10 p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-neon-amber mb-1">
            <Zap size={10} />
          </div>
          <div className="font-mono text-neon-amber text-xs font-bold">{profile.currentExp}</div>
          <div className="text-[9px] text-white/30 font-mono">CURR_EXP</div>
        </div>
        <div className="bg-white/5 rounded border border-white/10 p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-neon-green mb-1">
            <Zap size={10} />
          </div>
          <div className="font-mono text-neon-green text-xs font-bold">{profile.totalPoints}</div>
          <div className="text-[9px] text-white/30 font-mono">POINTS</div>
        </div>
      </div>

      {/* Level-up flash overlay */}
      {animating && profile.level !== prevLevel.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10 animate-levelup">
          <div className="text-center">
            <div className="font-mono text-4xl font-black text-neon-green animate-pulse">
              LEVEL UP!
            </div>
            <div className="font-mono text-neon-amber text-lg mt-1">LVL {profile.level}</div>
          </div>
        </div>
      )}
    </div>
  );
}

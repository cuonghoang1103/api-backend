'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ListMusic, Clock } from 'lucide-react';
import type { PlaylistSummary } from '@/types';
import { formatDuration } from '@/hooks/useMusicQueries';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80';

interface PlaylistCardProps {
  playlist: PlaylistSummary;
  onClick: (playlist: PlaylistSummary) => void;
}

function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  const [imgError, setImgError] = useState(false);

  const coverSrc = !imgError && playlist.coverUrl ? playlist.coverUrl : DEFAULT_COVER;
  const previewTracks = playlist.tracks?.slice(0, 4) ?? [];
  const totalSec = previewTracks.reduce(
    (acc, t) => acc + (t.track.durationSeconds ?? 0),
    0,
  );

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => onClick(playlist)}
    >
      {/* Cover grid */}
      <div className="relative aspect-square overflow-hidden">
        {playlist.coverUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : previewTracks.length >= 4 ? (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            {previewTracks.map((t) => (
              <div key={t.track.id} className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.track.coverImage || DEFAULT_COVER}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : previewTracks.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewTracks[0].track.coverImage || DEFAULT_COVER}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center">
            <ListMusic className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-neon-violet flex items-center justify-center shadow-lg shadow-neon-violet/40">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white truncate">{playlist.name}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400 truncate">
            {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
          </p>
          {totalSec > 0 && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(totalSec)}
            </p>
          )}
        </div>
        {/* Creator */}
        {playlist.user && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            by {playlist.user.username}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default PlaylistCard;

'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const sizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function StarRating({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <span key={star} className="relative">
              <Star
                className={`${sizes[size]} ${
                  filled
                    ? 'fill-yellow-400 text-yellow-400'
                    : half
                    ? 'fill-yellow-400/50 text-yellow-400'
                    : 'fill-darkborder text-darkborder'
                }`}
              />
            </span>
          );
        })}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className="text-text-muted text-xs ml-1">({reviewCount})</span>
      )}
    </div>
  );
}

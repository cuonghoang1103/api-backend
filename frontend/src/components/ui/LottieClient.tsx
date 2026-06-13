'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { LottieRefCurrentProps } from 'lottie-react';

const LottieDynamic = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieClientProps {
  lottieRef?: React.MutableRefObject<LottieRefCurrentProps | null>;
  animationData?: object;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function LottieClient({
  lottieRef,
  animationData,
  loop = false,
  autoplay = false,
  style,
  className,
}: LottieClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !animationData) {
    return (
      <div className={className} style={{ ...style, visibility: 'hidden' }} />
    );
  }

  return (
    <LottieDynamic
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={style}
      className={className}
    />
  );
}

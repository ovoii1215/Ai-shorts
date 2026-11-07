import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface TransitionProps {
  children: React.ReactNode;
  durationInFrames: number;
  type?: 'in' | 'out' | 'both';
}

export const FadeTransition: React.FC<TransitionProps> = ({
  children,
  durationInFrames,
  type = 'both',
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  let opacity = 1;
  if (type === 'in') opacity = fadeIn;
  if (type === 'out') opacity = fadeOut;
  if (type === 'both') opacity = Math.min(fadeIn, fadeOut);

  return <div style={{ width: '100%', height: '100%', opacity }}>{children}</div>;
};

import React from 'react';
import { Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface KenBurnsProps {
  src: string;
  type?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right';
}

export const KenBurnsImage: React.FC<KenBurnsProps> = ({ src, type = 'zoom-in' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const zoomIn = interpolate(frame, [0, durationInFrames], [1.0, 1.15], {
    extrapolateRight: 'clamp',
  });
  const zoomOut = interpolate(frame, [0, durationInFrames], [1.15, 1.0], {
    extrapolateRight: 'clamp',
  });
  const panX = interpolate(frame, [0, durationInFrames], [-20, 20], {
    extrapolateRight: 'clamp',
  });

  let transform = `scale(${zoomIn})`;
  if (type === 'zoom-out') transform = `scale(${zoomOut})`;
  if (type === 'pan-left') transform = `scale(1.1) translateX(${-panX}px)`;
  if (type === 'pan-right') transform = `scale(1.1) translateX(${panX}px)`;

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform,
        }}
      />
    </div>
  );
};

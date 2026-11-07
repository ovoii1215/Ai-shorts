import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface SubtitleProps {
  text: string;
  highlightWord?: string;
}

export const AnimatedSubtitle: React.FC<SubtitleProps> = ({ text, highlightWord }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  const words = text.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 240,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
        padding: '0 40px',
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
        transform: `scale(${scale})`,
      }}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWord && word.includes(highlightWord);
        return (
          <span
            key={i}
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: isHighlight ? '#FFD700' : '#FFFFFF',
              textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)',
              padding: '4px 12px',
              borderRadius: 8,
              backgroundColor: isHighlight ? 'rgba(0,0,0,0.5)' : 'transparent',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

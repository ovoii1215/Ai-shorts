import React from 'react';
import { Sequence, Audio, staticFile } from 'remotion';
import { AnimatedSubtitle } from '../components/AnimatedSubtitle';
import { KenBurnsImage } from '../components/KenBurnsImage';
import { FadeTransition } from '../components/FadeTransition';

export const SampleShorts: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#000000',
        fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      }}
    >
      {/* 폰트 로드 */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
      />

      {/* 배경 ASMR 오디오 */}
      <Audio src={staticFile('audio/bgm.wav')} />

      {/* 씬 1 (0~5초: 150프레임) */}
      <Sequence from={0} durationInFrames={150}>
        <FadeTransition durationInFrames={150} type="both">
          <KenBurnsImage src={staticFile('images/scene1.png')} type="zoom-in" />
          <AnimatedSubtitle text="바삭하게 깨지는 벌집 꿀 젤리" highlightWord="벌집" />
        </FadeTransition>
      </Sequence>

      {/* 씬 2 (5~10초: 150프레임) */}
      <Sequence from={150} durationInFrames={150}>
        <FadeTransition durationInFrames={150} type="both">
          <KenBurnsImage src={staticFile('images/scene2.png')} type="zoom-out" />
          <AnimatedSubtitle text="쫀득하게 차오르는 극상의 꿀 젤리" highlightWord="쫀득하게" />
        </FadeTransition>
      </Sequence>
    </div>
  );
};

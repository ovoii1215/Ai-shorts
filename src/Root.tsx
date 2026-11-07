import React from 'react';
import { Composition } from 'remotion';
import { PuppyMukbang } from './scenes/PuppyMukbang';
import { HoneycombMukbang } from './scenes/HoneycombMukbang';
import { SampleShorts } from './scenes/SampleShorts';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 🐶 비숑 강아지 벌집 꿀 먹방 30초 (연지 님 전용 오디오 & 이미지 탑재) */}
      <Composition
        id="PuppyMukbang"
        component={PuppyMukbang}
        durationInFrames={900} // 30초 (30fps * 30)
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🍯 실사 여성 벌집 먹방 ASMR 30초 */}
      <Composition
        id="HoneycombMukbang"
        component={HoneycombMukbang}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 🎬 10초 샘플 컴포지션 */}
      <Composition
        id="Shorts"
        component={SampleShorts}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

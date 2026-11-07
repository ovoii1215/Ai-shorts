import React from 'react';
import { Composition } from 'remotion';
import { HoneycombMukbang } from './scenes/HoneycombMukbang';
import { SampleShorts } from './scenes/SampleShorts';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 30초 벌집 먹방 ASMR 메인 컴포지션 */}
      <Composition
        id="HoneycombMukbang"
        component={HoneycombMukbang}
        durationInFrames={900} // 30초 (30fps * 30)
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 기존 10초 샘플 컴포지션 */}
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

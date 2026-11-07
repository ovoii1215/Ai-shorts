import React from 'react';
import { Composition } from 'remotion';
import { SampleShorts } from './scenes/SampleShorts';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Shorts"
      component={SampleShorts}
      durationInFrames={300} // 10초 (30fps * 10)
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

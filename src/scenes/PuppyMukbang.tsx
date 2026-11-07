import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Audio } from 'remotion';

export const PuppyMukbang: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 30초 전체 타임라인 (900프레임, 30fps)
  const globalZoom = interpolate(frame, [0, 900], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });

  // 5초(150프레임) 주기 먹방 사이클:
  // 0~45f (1.5s): 한 입 앙! 베어물기 (Bite)
  // 45~90f (1.5s): 핑크 혓바닥 쏙 내밀고 꿀 핥기 (Lick)
  // 90~150f (2.0s): 눈 감고 행복하게 오물오물 씹기 (Bliss Chew)
  const cycleFrame = frame % 150;

  let activeImg = 'images/puppy_mukbang_vertical.png';
  let chewWarp = 1.0;

  if (cycleFrame < 45) {
    activeImg = 'images/puppy_mukbang_vertical.png';
    chewWarp = 1.0 + 0.004 * Math.sin(cycleFrame * 0.4);
  } else if (cycleFrame < 90) {
    activeImg = 'images/puppy_frame_lick.png';
    chewWarp = 1.0 + 0.003 * Math.sin((cycleFrame - 45) * 0.5);
  } else {
    activeImg = 'images/puppy_frame_chew_bliss.png';
    chewWarp = 1.0 + 0.007 * Math.sin((cycleFrame - 90) * 0.45);
  }

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#F5EFEB',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 30초 전용 ASMR 사운드 */}
      <Audio src={staticFile('audio/puppy_asmr.wav')} />

      {/* 살아 숨 쉬는 강아지 애니메이션 레이어 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `scale(${globalZoom * chewWarp})`,
          transformOrigin: '50% 48%',
        }}
      >
        <Img
          src={staticFile(activeImg)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

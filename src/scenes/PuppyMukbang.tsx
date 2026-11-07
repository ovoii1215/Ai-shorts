import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Audio } from 'remotion';

export const PuppyMukbang: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 30초 전체 타임라인 (900프레임, 30fps)
  // 슬로우 시네마틱 매크로 줌인 (1.0 -> 1.08)
  const zoom = interpolate(frame, [0, 900], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });

  // 강아지가 오물오물 씹을 때 볼과 턱이 귀엽게 움직이는 미세 모션
  const chewCycle = Math.sin(frame * 0.4);
  const chewScaleY = 1.0 + 0.006 * chewCycle;
  const chewScaleX = 1.0 - 0.003 * chewCycle;

  // 베어물기(입 벌리고 앙!)와 오물오물 씹기 교차 연출
  // 6~9초, 18~21초에 크게 한 입 앙!
  let biteOpacity = 0;
  if (frame >= 160 && frame < 280) {
    if (frame < 180) biteOpacity = interpolate(frame, [160, 180], [0, 1]);
    else if (frame > 260) biteOpacity = interpolate(frame, [260, 280], [1, 0]);
    else biteOpacity = 1;
  } else if (frame >= 520 && frame < 640) {
    if (frame < 540) biteOpacity = interpolate(frame, [520, 540], [0, 1]);
    else if (frame > 620) biteOpacity = interpolate(frame, [620, 640], [1, 0]);
    else biteOpacity = 1;
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
      {/* 연지 님이 직접 생성해서 보낸 30초 고음질 ASMR 사운드 */}
      <Audio src={staticFile('audio/puppy_asmr.wav')} />

      {/* 1. 베이스 레이어: 꿀 젤리 오물오물 씹는 귀여운 비숑 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `scale(${zoom * chewScaleX}, ${zoom * chewScaleY})`,
          transformOrigin: '50% 48%',
        }}
      >
        <Img
          src={staticFile('images/puppy_mukbang_chewing.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* 2. 앙! 베어무는 순간 레이어 (페이드 전환) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: biteOpacity,
          transform: `scale(${zoom})`,
          transformOrigin: '50% 48%',
        }}
      >
        <Img
          src={staticFile('images/puppy_mukbang_vertical.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

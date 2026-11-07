import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Audio } from 'remotion';

export const HoneycombMukbang: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 30초 전체 타임라인 (900프레임):
  // 0~150f (0~5s): 벌집 들고 준비 (입 다문 채 꿀 윤기)
  // 150~300f (5~10s): 1차 바삭 베어물기! (frame 180 = 6초에 밀랍 바사삭 크런치!)
  // 300~510f (10~17s): 1차 씹기 (입 다물고 턱/입술 리드미컬하게 오물오물 저작 운동)
  // 510~690f (17~23s): 2차 깊게 베어물기! (frame 540 = 18초에 두 번째 크런치!)
  // 690~900f (23~30s): 2차 씹기 및 마무리 (자연스러운 루프 연결)

  // 부드러운 슬로우 매크로 카메라 줌인 (1.0 -> 1.07)
  const zoom = interpolate(frame, [0, 900], [1.0, 1.07], {
    extrapolateRight: 'clamp',
  });

  // 씹는 구간(10~17s, 23~30s)에서 하관/턱이 미세하게 오물거리는 실사 움직임
  let chewWarp = 1.0;
  if ((frame >= 300 && frame < 510) || (frame >= 690 && frame < 890)) {
    chewWarp = 1.0 + 0.007 * Math.sin(frame * 0.45);
  }

  // 베어무는 순간(입 열고 벌집 무는 장면) 크로스페이드 투명도
  let biteOpacity = 0;
  if (frame >= 145 && frame < 305) {
    if (frame < 160) biteOpacity = interpolate(frame, [145, 160], [0, 1]);
    else if (frame > 290) biteOpacity = interpolate(frame, [290, 305], [1, 0]);
    else biteOpacity = 1;
  } else if (frame >= 505 && frame < 695) {
    if (frame < 520) biteOpacity = interpolate(frame, [505, 520], [0, 1]);
    else if (frame > 680) biteOpacity = interpolate(frame, [680, 695], [1, 0]);
    else biteOpacity = 1;
  }

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#F7F3EE',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 30초 고음질 ASMR 사운드 (바람/입김 소리 100% 제거, 바삭한 밀랍 크런치 + 쫀득한 씹는 소리) */}
      <Audio src={staticFile('audio/mukbang_asmr.wav')} />

      {/* 1. 입 다물고 씹는 베이스 레이어 (자연스러운 턱 오물거림 모션) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `scale(${zoom * chewWarp})`,
          transformOrigin: '50% 25%',
        }}
      >
        <Img
          src={staticFile('images/mukbang_real_chewing.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* 2. 한 입 크게 베어무는 순간 레이어 (6초, 18초 사운드 싱크에 맞춰 페이드 전환) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: biteOpacity,
          transform: `scale(${zoom})`,
          transformOrigin: '50% 25%',
        }}
      >
        <Img
          src={staticFile('images/mukbang_real_hd.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

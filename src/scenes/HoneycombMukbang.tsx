import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from 'remotion';

export const HoneycombMukbang: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- 타임라인 구간 계산 (30fps 기준 900프레임 = 30초) ---
  // 0~150f (0~5s): 벌집 집어들기
  // 150~300f (5~10s): 1차 베어물기 (frame 180 = 6초에 앙!)
  // 300~510f (10~17s): 1차 씹기
  // 510~690f (17~23s): 2차 베어물기 (frame 540 = 18초에 앙!)
  // 690~900f (23~30s): 2차 씹기 및 마무리

  // 1. 손과 벌집의 위치 이동
  const handY = interpolate(
    frame,
    [0, 60, 150, 180, 240, 480, 510, 540, 600, 720, 850],
    [1300, 1250, 680, 620, 650, 680, 620, 600, 650, 850, 1200],
    { extrapolateRight: 'clamp' }
  );

  const handX = interpolate(
    frame,
    [0, 60, 150, 180, 240, 510, 540, 600, 720, 850],
    [540, 540, 540, 540, 540, 540, 540, 540, 540, 540],
    { extrapolateRight: 'clamp' }
  );

  // 2. 입의 개폐 및 턱 움직임 (씹는 모션)
  let mouthOpen = 0;
  let jawY = 0;

  if (frame >= 140 && frame < 185) {
    // 1차 베어물기 위해 입 벌리기
    mouthOpen = interpolate(frame, [140, 175, 185], [0, 45, 0], { extrapolateRight: 'clamp' });
    jawY = mouthOpen * 0.4;
  } else if (frame >= 185 && frame < 510) {
    // 1차 씹기 (리드미컬한 저작 운동)
    const chewCycle = Math.sin((frame - 185) * 0.35);
    jawY = Math.max(0, chewCycle * 8);
    mouthOpen = Math.max(0, chewCycle * 4);
  } else if (frame >= 510 && frame < 545) {
    // 2차 베어물기 입 벌리기
    mouthOpen = interpolate(frame, [510, 535, 545], [0, 55, 0], { extrapolateRight: 'clamp' });
    jawY = mouthOpen * 0.4;
  } else if (frame >= 545 && frame < 850) {
    // 2차 씹기
    const chewCycle = Math.sin((frame - 545) * 0.32);
    jawY = Math.max(0, chewCycle * 9);
    mouthOpen = Math.max(0, chewCycle * 4);
  }

  // 3. 베어문 횟수에 따른 벌집 크기/모양 변화
  const bite1 = frame >= 180;
  const bite2 = frame >= 540;

  // 4. 육각형 벌집 셀 생성 헬퍼
  const renderHexagon = (cx: number, cy: number, r: number, key: string, filled = true) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return (
      <polygon
        key={key}
        points={points.join(' ')}
        fill={filled ? 'url(#honeyGradient)' : '#E0A938'}
        stroke="#F5C451"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    );
  };

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#F7F3EE', // 따뜻하고 고급스러운 베이지 스튜디오 배경
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 30초 동기화된 ASMR 사운드 */}
      <Audio src={staticFile('audio/mukbang_asmr.wav')} />

      {/* SVG 필터 및 그라디언트 정의 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* 황금빛 꿀 그라디언트 */}
          <radialGradient id="honeyGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="60%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
          {/* 밀랍 텍스처 그라디언트 */}
          <linearGradient id="waxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#FFCA28" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>
          {/* 입술 그라디언트 */}
          <linearGradient id="lipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E57373" />
            <stop offset="50%" stopColor="#D32F2F" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>
          {/* 부드러운 그림자 */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#4A3B32" floodOpacity="0.22" />
          </filter>
        </defs>
      </svg>

      {/* --- 1. 배경 스튜디오 조명 (부드러운 비네팅) --- */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.85) 0%, rgba(240,230,220,0.4) 70%, rgba(210,195,180,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* --- 2. 인물 얼굴 (코 아래부터 입술, 턱, 목선) --- */}
      <div
        style={{
          position: 'absolute',
          top: 180 + jawY * 0.5,
          left: 0,
          width: '100%',
          height: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'top 0.05s ease-out',
        }}
      >
        <svg width="600" height="500" viewBox="0 0 600 500">
          {/* 목과 어깨 라인 */}
          <path d="M 220 380 L 220 500 L 380 500 L 380 380 Z" fill="#F5DAC1" opacity="0.9" />

          {/* 턱선 및 하관 */}
          <path
            d={`M 150 120 Q 300 ${360 + jawY} 450 120 Q 420 50 300 50 Q 180 50 150 120 Z`}
            fill="#FCEADE"
            filter="url(#softShadow)"
          />

          {/* 코끝 그림자 */}
          <path d="M 285 70 Q 300 85 315 70" stroke="#E0B69B" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* 입술 (윗입술 + 아랫입술 + 벌어지는 입안) */}
          <g transform={`translate(300, ${220 + jawY})`}>
            {/* 입 안 (벌어졌을 때) */}
            {mouthOpen > 5 && (
              <ellipse cx="0" cy="0" rx="42" ry={mouthOpen * 0.6} fill="#4A0E17" />
            )}

            {/* 치아 (살짝 보일 때) */}
            {mouthOpen > 15 && (
              <path
                d={`M -25 -5 Q 0 ${mouthOpen * 0.2} 25 -5 L 20 ${mouthOpen * 0.1} Q 0 ${mouthOpen * 0.3} -20 ${mouthOpen * 0.1} Z`}
                fill="#FFFFFF"
                opacity="0.95"
              />
            )}

            {/* 윗입술 */}
            <path
              d={`M -55 ${-mouthOpen * 0.2} Q -25 -22 0 -12 Q 25 -22 55 ${-mouthOpen * 0.2} Q 25 -2 0 4 Q -25 -2 -55 ${-mouthOpen * 0.2} Z`}
              fill="url(#lipGradient)"
              opacity="0.95"
            />

            {/* 아랫입술 */}
            <path
              d={`M -50 ${mouthOpen * 0.5} Q 0 ${mouthOpen * 0.5 - 2} 50 ${mouthOpen * 0.5} Q 35 ${28 + mouthOpen * 0.6} 0 ${32 + mouthOpen * 0.6} Q -35 ${28 + mouthOpen * 0.6} -50 ${mouthOpen * 0.5} Z`}
              fill="url(#lipGradient)"
              opacity="0.92"
            />

            {/* 입술 글로시 하이라이트 (촉촉한 윤기) */}
            <path
              d={`M -25 ${12 + mouthOpen * 0.5} Q 0 ${16 + mouthOpen * 0.5} 25 ${12 + mouthOpen * 0.5}`}
              stroke="rgba(255,255,255,0.65)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* --- 3. 하단 아이보리 세라믹 접시 및 쌓여 있는 벌집 5개 --- */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 900,
          height: 600,
        }}
      >
        <svg width="900" height="600" viewBox="0 0 900 600">
          {/* 접시 그림자 */}
          <ellipse cx="450" cy="460" rx="410" ry="110" fill="rgba(80,60,45,0.18)" filter="url(#softShadow)" />

          {/* 아이보리 세라믹 접시 */}
          <ellipse cx="450" cy="440" rx="390" ry="95" fill="#EFE8DE" stroke="#DDD2C1" strokeWidth="6" />
          <ellipse cx="450" cy="435" rx="340" ry="75" fill="#FAF6F0" />

          {/* 접시 위에 쌓여 있는 황금 벌집 5개 (배경 스택) */}
          {/* 1번 벌집 (좌하단) */}
          <g transform="translate(240, 360)">
            <rect x="0" y="0" width="180" height="90" rx="20" fill="url(#waxGradient)" filter="url(#softShadow)" />
            {renderHexagon(40, 45, 24, 'h1_1')}
            {renderHexagon(90, 45, 24, 'h1_2')}
            {renderHexagon(140, 45, 24, 'h1_3')}
          </g>

          {/* 2번 벌집 (우하단) */}
          <g transform="translate(480, 370)">
            <rect x="0" y="0" width="190" height="85" rx="20" fill="url(#waxGradient)" filter="url(#softShadow)" />
            {renderHexagon(45, 42, 24, 'h2_1')}
            {renderHexagon(95, 42, 24, 'h2_2')}
            {renderHexagon(145, 42, 24, 'h2_3')}
          </g>

          {/* 3번 벌집 (중앙 뒤) */}
          <g transform="translate(350, 320)">
            <rect x="0" y="0" width="200" height="95" rx="22" fill="url(#waxGradient)" filter="url(#softShadow)" />
            {renderHexagon(50, 48, 25, 'h3_1')}
            {renderHexagon(100, 48, 25, 'h3_2')}
            {renderHexagon(150, 48, 25, 'h3_3')}
          </g>

          {/* 4번 벌집 (좌측 위) */}
          <g transform="translate(290, 260)">
            <rect x="0" y="0" width="170" height="85" rx="18" fill="url(#waxGradient)" filter="url(#softShadow)" />
            {renderHexagon(45, 42, 23, 'h4_1')}
            {renderHexagon(90, 42, 23, 'h4_2')}
            {renderHexagon(135, 42, 23, 'h4_3')}
          </g>

          {/* 5번 벌집 (우측 위) */}
          <g transform="translate(450, 270)">
            <rect x="0" y="0" width="175" height="85" rx="18" fill="url(#waxGradient)" filter="url(#softShadow)" />
            {renderHexagon(45, 42, 23, 'h5_1')}
            {renderHexagon(90, 42, 23, 'h5_2')}
            {renderHexagon(135, 42, 23, 'h5_3')}
          </g>

          {/* 접시 위에 흐른 진득한 꿀 웅덩이 */}
          <path
            d="M 280 430 Q 380 455 520 440 Q 640 450 680 435 Q 580 420 440 425 Z"
            fill="url(#honeyGradient)"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* --- 4. 손에 들려 입으로 올라가는 6번째 핵심 벌집 --- */}
      <div
        style={{
          position: 'absolute',
          top: handY,
          left: handX,
          transform: 'translate(-50%, -50%)',
          width: 380,
          height: 380,
          pointerEvents: 'none',
        }}
      >
        <svg width="380" height="380" viewBox="0 0 380 380">
          <g filter="url(#softShadow)">
            {/* 벌집 본체 베이스 */}
            {!bite2 ? (
              <g>
                {/* 1차 베어물기 전 or 후의 본체 외곽 */}
                <path
                  d={
                    !bite1
                      ? 'M 50 120 C 50 70, 230 70, 230 120 L 230 220 C 230 260, 50 260, 50 220 Z'
                      : 'M 50 120 C 50 70, 140 70, 140 100 Q 180 140 140 180 C 140 210, 230 210, 230 220 C 230 260, 50 260, 50 220 Z' // 한 입 베어문 자국
                  }
                  fill="url(#waxGradient)"
                  stroke="#FFB300"
                  strokeWidth="4"
                />

                {/* 선명한 육각형 밀랍 셀들 */}
                {renderHexagon(90, 130, 24, 'held_1')}
                {renderHexagon(140, 130, 24, 'held_2')}
                {!bite1 && renderHexagon(190, 130, 24, 'held_3')}

                {renderHexagon(90, 180, 24, 'held_4')}
                {renderHexagon(140, 180, 24, 'held_5')}
                {!bite1 && renderHexagon(190, 180, 24, 'held_6')}

                {/* 꿀이 뚝뚝 떨어지는 점성 글레이즈 */}
                <path
                  d="M 110 210 Q 125 250 120 265 Q 115 250 130 210"
                  fill="url(#honeyGradient)"
                  opacity="0.9"
                />
              </g>
            ) : (
              // 2차 베어문 후 (작아진 마지막 조각)
              <g>
                <path
                  d="M 50 160 C 50 120, 140 120, 130 150 Q 160 180 120 210 L 50 210 Z"
                  fill="url(#waxGradient)"
                  stroke="#FFB300"
                  strokeWidth="4"
                />
                {renderHexagon(85, 175, 22, 'held_rem_1')}
              </g>
            )}

            {/* 베어물 때 늘어나는 황금 꿀 스트레칭 (17~21초 구간) */}
            {frame >= 540 && frame <= 630 && (
              <path
                d="M 120 160 Q 180 110 210 50 Q 190 115 115 170 Z"
                fill="url(#honeyGradient)"
                opacity="0.95"
              />
            )}

            {/* 꿀 표면의 눈부신 하이라이트 광택 */}
            <ellipse cx="95" cy="120" rx="25" ry="10" fill="rgba(255,255,255,0.55)" transform="rotate(-15, 95, 120)" />

            {/* 벌집을 잡고 있는 섬세한 엄지와 검지 손가락 */}
            <g transform="translate(180, 170)">
              {/* 엄지손가락 */}
              <path
                d="M 10 30 C 30 10, 70 30, 80 60 C 90 90, 50 120, 20 100 Z"
                fill="#FCEADE"
                stroke="#E5C0A5"
                strokeWidth="3"
              />
              {/* 손톱 (자연스러운 핑크 베이지) */}
              <ellipse cx="45" cy="45" rx="14" ry="10" fill="#F8BBD0" opacity="0.8" transform="rotate(25, 45, 45)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

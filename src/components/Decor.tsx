type DecorProps = {
  className?: string;
};

export function Decor({ className = '' }: DecorProps) {
  return (
    <div className={`decor ${className}`} aria-hidden>
      {/* 大型漸變色塊 - 視覺錨點 */}
      <div className="decorItem decorBlob1" />
      <div className="decorItem decorBlob2" />

      {/* 主視覺 - 大圓環 */}
      <svg className="decorItem decorMain" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(190, 255, 67, 0.7)" />
            <stop offset="50%" stopColor="rgba(190, 255, 67, 0.3)" />
            <stop offset="100%" stopColor="rgba(190, 255, 67, 0.6)" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="180" fill="none" stroke="url(#mainGrad)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(190, 255, 67, 0.35)" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(24, 24, 27, 0.2)" strokeWidth="1" />
      </svg>

      {/* 浮動點 - 大 */}
      <svg className="decorItem decorDot1" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="rgba(190, 255, 67, 0.95)" />
      </svg>
      <svg className="decorItem decorDot2" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" fill="rgba(190, 255, 67, 0.85)" />
      </svg>
      <svg className="decorItem decorDot3" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="6" fill="rgba(24, 24, 27, 0.45)" />
      </svg>
      
      {/* 浮動點 - 中 */}
      <svg className="decorItem decorDot4" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="5" fill="rgba(190, 255, 67, 0.9)" />
      </svg>
      <svg className="decorItem decorDot5" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="5" fill="rgba(190, 255, 67, 0.8)" />
      </svg>
      <svg className="decorItem decorDot6" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="4" fill="rgba(24, 24, 27, 0.4)" />
      </svg>

      {/* 浮動點 - 小 */}
      <svg className="decorItem decorDot7" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="4" fill="rgba(190, 255, 67, 0.85)" />
      </svg>
      <svg className="decorItem decorDot8" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="3.5" fill="rgba(190, 255, 67, 0.75)" />
      </svg>
      <svg className="decorItem decorDot9" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="3" fill="rgba(24, 24, 27, 0.35)" />
      </svg>

      {/* 更多浮動點 */}
      <svg className="decorItem decorDot10" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" fill="rgba(190, 255, 67, 0.9)" />
      </svg>
      <svg className="decorItem decorDot11" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="2.5" fill="rgba(190, 255, 67, 0.8)" />
      </svg>
      <svg className="decorItem decorDot12" viewBox="0 0 6 6">
        <circle cx="3" cy="3" r="2" fill="rgba(24, 24, 27, 0.3)" />
      </svg>
      <svg className="decorItem decorDot13" viewBox="0 0 6 6">
        <circle cx="3" cy="3" r="2" fill="rgba(190, 255, 67, 0.95)" />
      </svg>
      <svg className="decorItem decorDot14" viewBox="0 0 5 5">
        <circle cx="2.5" cy="2.5" r="1.5" fill="rgba(190, 255, 67, 0.85)" />
      </svg>

      {/* 額外浮動點 - 分佈於畫面各處 */}
      <svg className="decorItem decorDot15" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="4" fill="rgba(190, 255, 67, 0.9)" />
      </svg>
      <svg className="decorItem decorDot16" viewBox="0 0 7 7">
        <circle cx="3.5" cy="3.5" r="2.5" fill="rgba(190, 255, 67, 0.85)" />
      </svg>
      <svg className="decorItem decorDot17" viewBox="0 0 9 9">
        <circle cx="4.5" cy="4.5" r="3" fill="rgba(24, 24, 27, 0.35)" />
      </svg>
      <svg className="decorItem decorDot18" viewBox="0 0 6 6">
        <circle cx="3" cy="3" r="2" fill="rgba(190, 255, 67, 0.95)" />
      </svg>
      <svg className="decorItem decorDot19" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" fill="rgba(190, 255, 67, 0.8)" />
      </svg>
      <svg className="decorItem decorDot20" viewBox="0 0 5 5">
        <circle cx="2.5" cy="2.5" r="1.8" fill="rgba(190, 255, 67, 0.9)" />
      </svg>
      <svg className="decorItem decorDot21" viewBox="0 0 7 7">
        <circle cx="3.5" cy="3.5" r="2.5" fill="rgba(24, 24, 27, 0.4)" />
      </svg>
      <svg className="decorItem decorDot22" viewBox="0 0 6 6">
        <circle cx="3" cy="3" r="2" fill="rgba(190, 255, 67, 0.85)" />
      </svg>
      <svg className="decorItem decorDot23" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="2.5" fill="rgba(190, 255, 67, 0.75)" />
      </svg>
      <svg className="decorItem decorDot24" viewBox="0 0 5 5">
        <circle cx="2.5" cy="2.5" r="1.5" fill="rgba(190, 255, 67, 0.95)" />
      </svg>

      {/* 十字標記 */}
      <svg className="decorItem decorCross1" viewBox="0 0 40 40">
        <path d="M20 6 V34 M6 20 H34" stroke="rgba(190, 255, 67, 0.9)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <svg className="decorItem decorCross2" viewBox="0 0 30 30">
        <path d="M15 4 V26 M4 15 H26" stroke="rgba(24, 24, 27, 0.45)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="decorItem decorCross3" viewBox="0 0 25 25">
        <path d="M12.5 3 V22 M3 12.5 H22" stroke="rgba(190, 255, 67, 0.7)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* 圓環 */}
      <svg className="decorItem decorRing1" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(190, 255, 67, 0.7)" strokeWidth="2" />
        <circle cx="35" cy="35" r="18" fill="rgba(190, 255, 67, 0.15)" />
      </svg>
      <svg className="decorItem decorRing2" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(24, 24, 27, 0.4)" strokeWidth="1.5" />
      </svg>
      <svg className="decorItem decorRing3" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(190, 255, 67, 0.6)" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>

      {/* 菱形 */}
      <svg className="decorItem decorDiamond1" viewBox="0 0 50 50">
        <rect x="12.5" y="12.5" width="25" height="25" rx="3" fill="none" stroke="rgba(190, 255, 67, 0.8)" strokeWidth="2" transform="rotate(45 25 25)" />
      </svg>
      <svg className="decorItem decorDiamond2" viewBox="0 0 40 40">
        <rect x="10" y="10" width="20" height="20" rx="2" fill="none" stroke="rgba(24, 24, 27, 0.4)" strokeWidth="1.5" transform="rotate(45 20 20)" />
      </svg>

      {/* 三角形 */}
      <svg className="decorItem decorTriangle1" viewBox="0 0 50 50">
        <polygon points="25,5 45,40 5,40" fill="none" stroke="rgba(190, 255, 67, 0.7)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <svg className="decorItem decorTriangle2" viewBox="0 0 40 40">
        <polygon points="20,8 35,32 5,32" fill="none" stroke="rgba(24, 24, 27, 0.35)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>

      {/* 角落裝飾線 */}
      <svg className="decorItem decorCorner1" viewBox="0 0 60 60">
        <path d="M5 55 L5 5 L55 5" fill="none" stroke="rgba(190, 255, 67, 0.7)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="decorItem decorCorner2" viewBox="0 0 50 50">
        <path d="M45 5 L45 45 L5 45" fill="none" stroke="rgba(24, 24, 27, 0.35)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* 弧線 */}
      <svg className="decorItem decorArc1" viewBox="0 0 100 50">
        <path d="M5 45 Q50 -10 95 45" fill="none" stroke="rgba(190, 255, 67, 0.6)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="decorItem decorArc2" viewBox="0 0 80 40">
        <path d="M5 35 Q40 -5 75 35" fill="none" stroke="rgba(24, 24, 27, 0.3)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* 螺旋點群 */}
      <svg className="decorItem decorSpiral" viewBox="0 0 80 80">
        <circle cx="40" cy="20" r="3" fill="rgba(190, 255, 67, 0.9)" />
        <circle cx="55" cy="30" r="2.5" fill="rgba(190, 255, 67, 0.8)" />
        <circle cx="60" cy="45" r="2" fill="rgba(190, 255, 67, 0.7)" />
        <circle cx="50" cy="58" r="2.5" fill="rgba(190, 255, 67, 0.8)" />
        <circle cx="35" cy="62" r="3" fill="rgba(190, 255, 67, 0.9)" />
      </svg>
    </div>
  );
}

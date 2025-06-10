import React from 'react';

interface MoktakSVGProps {
  className?: string;
  isAnimating?: boolean;
}

const MoktakSVG: React.FC<MoktakSVGProps> = ({ className = "", isAnimating = false }) => {
  return (
    <svg 
      viewBox="0 0 300 300" 
      className={`moktak-svg-bg ${className} ${isAnimating ? 'animate-pulse' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient definitions */}
      <defs>
        <radialGradient id="woodGradient" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#D2691E" />
          <stop offset="30%" stopColor="#8B4513" />
          <stop offset="70%" stopColor="#654321" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
        
        <radialGradient id="innerGradient" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#F4A460" />
          <stop offset="50%" stopColor="#D2691E" />
          <stop offset="100%" stopColor="#8B4513" />
        </radialGradient>
        
        <linearGradient id="rimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="50%" stopColor="#654321" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
        
        <filter id="woodTexture">
          <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0.5 0.6 0.7 0.8"/>
          </feComponentTransfer>
          <feComposite operator="multiply" in2="SourceGraphic"/>
        </filter>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Main moktak body - outer rim */}
      <ellipse 
        cx="150" 
        cy="150" 
        rx="140" 
        ry="140" 
        fill="url(#woodGradient)"
        filter="url(#shadow)"
      />
      
      {/* Wood texture overlay */}
      <ellipse 
        cx="150" 
        cy="150" 
        rx="140" 
        ry="140" 
        fill="url(#woodGradient)"
        filter="url(#woodTexture)"
        opacity="0.6"
      />
      
      {/* Inner hollow part */}
      <ellipse 
        cx="150" 
        cy="150" 
        rx="110" 
        ry="110" 
        fill="url(#innerGradient)"
      />
      
      {/* Inner shadow for depth */}
      <ellipse 
        cx="150" 
        cy="150" 
        rx="110" 
        ry="110" 
        fill="none"
        stroke="url(#rimGradient)"
        strokeWidth="8"
        opacity="0.7"
      />
      
      {/* Wood grain lines */}
      <g opacity="0.4">
        <ellipse cx="150" cy="120" rx="80" ry="3" fill="#654321" transform="rotate(-15 150 120)" />
        <ellipse cx="150" cy="140" rx="90" ry="2" fill="#8B4513" transform="rotate(10 150 140)" />
        <ellipse cx="150" cy="160" rx="85" ry="2.5" fill="#654321" transform="rotate(-8 150 160)" />
        <ellipse cx="150" cy="180" rx="75" ry="2" fill="#8B4513" transform="rotate(12 150 180)" />
        <ellipse cx="150" cy="200" rx="70" ry="3" fill="#654321" transform="rotate(-20 150 200)" />
      </g>
      
      {/* Highlight on the rim */}
      <ellipse 
        cx="130" 
        cy="120" 
        rx="40" 
        ry="25" 
        fill="url(#innerGradient)"
        opacity="0.6"
        transform="rotate(-30 130 120)"
      />
      
      {/* Center striking area */}
      <circle 
        cx="150" 
        cy="150" 
        r="25" 
        fill="#D2691E"
        opacity="0.8"
      />
      
      {/* Center highlight */}
      <circle 
        cx="145" 
        cy="145" 
        r="8" 
        fill="#F4A460"
        opacity="0.9"
      />
      
      {/* Vietnamese characters */}
      <text 
        x="150" 
        y="155" 
        textAnchor="middle" 
        fontSize="24" 
        fontWeight="bold" 
        fill="#2D1810"
        fontFamily="serif"
      >
        PONG PONG
      </text>
      
      <text 
        x="150" 
        y="180" 
        textAnchor="middle" 
        fontSize="16" 
        fontWeight="600" 
        fill="#3E2723"
        fontFamily="serif"
      >
        MÕ
      </text>
    </svg>
  );
};

export default MoktakSVG;
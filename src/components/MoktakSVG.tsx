import React from 'react';

interface MoktakSVGProps {
  className?: string;
  isAnimating?: boolean;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
}

const MoktakSVG: React.FC<MoktakSVGProps> = ({ className = "", isAnimating = false, onClick }) => {
  return (
    <img
      src="/mo.png"
      alt="Moktak"
      className={`moktak-img ${className} ${isAnimating ? 'animate-pulse' : ''}`}
      onClick={onClick}
    />
  );
};

export default MoktakSVG;
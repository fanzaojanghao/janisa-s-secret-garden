import { useState } from 'react';
import bunnyWaving from '@/assets/bunny-waving.png';
import bunnyLove from '@/assets/bunny-love.png';

interface WavingBunnyProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-24 h-24',
  md: 'w-36 h-36',
  lg: 'w-48 h-48',
};

const WavingBunny = ({ size = 'md', className = '' }: WavingBunnyProps) => {
  const [showLove, setShowLove] = useState(false);

  const handleClick = () => {
    setShowLove(true);
    setTimeout(() => setShowLove(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative transition-transform duration-300 hover:scale-105 focus:outline-none ${sizeMap[size]} ${className}`}
      aria-label="Click the bunny"
    >
      <img
        src={showLove ? bunnyLove : bunnyWaving}
        alt="Cute bunny"
        className={`w-full h-full object-contain ${showLove ? 'animate-pulse-soft' : 'animate-float'}`}
      />
      {showLove && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl animate-bounce-gentle">
          💕
        </div>
      )}
    </button>
  );
};

export default WavingBunny;

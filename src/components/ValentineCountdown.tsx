import { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock } from 'lucide-react';

interface CountdownUnit {
  value: number;
  label: string;
}

const ValentineCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownUnit[]>([]);
  const [isValentinesDay, setIsValentinesDay] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let valentinesDay = new Date(currentYear, 1, 14); // February 14
      
      // If Valentine's Day has passed this year, use next year
      if (now > valentinesDay) {
        valentinesDay = new Date(currentYear + 1, 1, 14);
      }

      const difference = valentinesDay.getTime() - now.getTime();

      if (difference <= 0) {
        setIsValentinesDay(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        return [];
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return [
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Min' },
        { value: seconds, label: 'Sec' },
      ];
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isValentinesDay) {
    return (
      <div className="relative flex items-center justify-center gap-3 py-4 px-8 rounded-3xl bg-gradient-to-r from-pink-light/80 via-rose-100/60 to-pink-light/80 border-2 border-pink/40 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300 countdown-container">
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(25)].map((_, i) => (
              <Heart
                key={i}
                className="absolute text-heart animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
                size={Math.random() * 20 + 12}
              />
            ))}
          </div>
        )}
        <Heart className="w-6 h-6 text-heart animate-heart-beat fill-heart drop-shadow-sm" />
        <span className="text-base font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          Happy Valentine's Day! 💕
        </span>
        <Sparkles className="w-5 h-5 text-accent animate-sparkle drop-shadow-sm" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3 px-6 rounded-3xl bg-gradient-to-r from-lavender-light/70 via-purple-100/50 to-pink-light/60 border-2 border-lavender/30 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300 countdown-container">
      <Clock className="w-5 h-5 text-primary animate-pulse-soft" />
      <span className="text-sm font-semibold text-foreground hidden sm:block whitespace-nowrap">Valentine's in</span>
      <div className="flex items-center gap-2">
        {timeLeft.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center bg-white/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/50 hover:bg-white/60 transition-all duration-200 group">
              <span className="text-base font-bold text-foreground countdown-digit min-w-[36px] text-center group-hover:text-primary transition-colors">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[11px] text-muted-foreground/80 uppercase tracking-widest font-semibold">
                {unit.label}
              </span>
            </div>
            {index < timeLeft.length - 1 && (
              <span className="text-muted-foreground/60 text-sm font-bold px-0.5">•</span>
            )}
          </div>
        ))}
      </div>
      <Heart className="w-5 h-5 text-heart animate-pulse-soft fill-heart drop-shadow-sm" />
    </div>
  );
};

export default ValentineCountdown;

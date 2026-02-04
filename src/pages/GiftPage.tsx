import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Sparkles } from 'lucide-react';
import ValentineCountdown from '@/components/ValentineCountdown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const GiftPage = () => {
  const [giftState, setGiftState] = useState<'wrapped' | 'opening' | 'opened'>('wrapped');
  const [showMessage, setShowMessage] = useState(false);
  const { hasCompletedGame, hasReceivedGift, setHasReceivedGift } = useAuth();
  const navigate = useNavigate();

  if (!hasCompletedGame && !hasReceivedGift) {
    return (
      <div className="min-h-screen dreamy-bg flex items-center justify-center p-4">
        <div className="valentine-card p-8 max-w-md text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Not Yet, Silly!
          </h2>
          <p className="text-muted-foreground">
            You need to complete the games first to unlock your gift! 🎮
          </p>
          <Button onClick={() => navigate('/game')} className="valentine-button">
            Go Play Games
          </Button>
        </div>
      </div>
    );
  }

  const handleOpenGift = () => {
    setGiftState('opening');
    setTimeout(() => {
      setGiftState('opened');
      setHasReceivedGift(true);
      setTimeout(() => setShowMessage(true), 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen dreamy-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex justify-center">
          <ValentineCountdown />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        {/* Back Link */}
        <Link 
          to="/home" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Gift Content */}
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Your Special Gift 🎁
          </h1>

          {giftState === 'wrapped' && (
            <div className="space-y-6">
              <div className="relative inline-block">
                <div className="text-9xl animate-bounce-gentle">🎁</div>
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-sparkle" />
                <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-sparkle" style={{ animationDelay: '0.3s' }} />
              </div>
              <p className="text-muted-foreground">
                You've completed all the games... <br />
                Now, here's something special just for you 💕
              </p>
              <Button onClick={handleOpenGift} className="valentine-button text-lg px-8 py-4">
                <Gift className="w-5 h-5 mr-2" />
                Open Your Gift
              </Button>
            </div>
          )}

          {giftState === 'opening' && (
            <div className="space-y-6">
              <div className="text-9xl animate-pulse-soft">✨</div>
              <p className="text-lg text-muted-foreground animate-fade-in">
                Opening something special...
              </p>
            </div>
          )}

          {giftState === 'opened' && (
            <div className="space-y-8">
              {/* Confetti */}
              <div className="relative">
                <div className="absolute inset-0 flex justify-center">
                  {['💜', '💕', '✨', '🌸', '💗', '🎀'].map((emoji, i) => (
                    <span
                      key={i}
                      className="absolute text-2xl animate-confetti"
                      style={{
                        left: `${20 + i * 12}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>

              {/* The Message */}
              <div className={`valentine-card p-8 space-y-6 transition-all duration-700 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="text-6xl animate-heart-beat">💝</div>
                <h2 className="text-2xl font-display font-semibold text-foreground">
                  Ask Ojan for the Gift!
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    You made it through all the games... and that means a lot. 💕
                  </p>
                  <p>
                    The real gift isn't digital — it's something I want to give you in person.
                  </p>
                  <p className="font-medium text-foreground">
                    Come find me, and ask for your present. 🎁
                  </p>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground italic">
                    "Every moment with you is a gift." 💜
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col gap-3">
                <Link to="/book">
                  <Button className="valentine-button w-full">
                    Read the Poetry Book 📖
                  </Button>
                </Link>
                <Link to="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GiftPage;

import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Book, Gift, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ValentineCountdown from '@/components/ValentineCountdown';
import WavingBunny from '@/components/WavingBunny';

const HomePage = () => {
  const { userName, hasCompletedGame, hasReceivedGift, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      to: '/game',
      icon: Gamepad2,
      title: 'Game',
      description: 'Play some fun games!',
      emoji: '🎮',
      unlocked: true,
    },
    {
      to: '/book',
      icon: Book,
      title: 'Poetry Book',
      description: 'Read something sweet',
      emoji: '📖',
      unlocked: true,
    },
    {
      to: '/gift',
      icon: Gift,
      title: 'Special Gift',
      description: hasReceivedGift ? 'View your gift' : 'Complete games first!',
      emoji: '🎁',
      unlocked: hasCompletedGame,
    },
    {
      to: '/other',
      icon: Sparkles,
      title: 'Other',
      description: 'A little surprise...',
      emoji: '✨',
      unlocked: true,
    },
  ];

  return (
    <div className="min-h-screen dreamy-bg">
      {/* Header with Countdown */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <ValentineCountdown />
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="absolute right-4 hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Welcome Section */}
        <div className="text-center space-y-4 mb-10 animate-fade-in">
          <div className="flex justify-center">
            <WavingBunny size="md" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-semibold text-foreground">
              Welcome, {userName}! 💕
            </h1>
            <p className="text-muted-foreground">
              This is your special space. Take your time, explore... 🌸
            </p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Link
              key={item.to}
              to={item.unlocked ? item.to : '#'}
              className={`valentine-card p-6 transition-all duration-300 group
                ${item.unlocked 
                  ? 'hover:shadow-glow hover:-translate-y-1 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
                }
                animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={(e) => !item.unlocked && e.preventDefault()}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-lavender-light/50 text-primary
                  ${item.unlocked ? 'group-hover:bg-lavender-light group-hover:scale-110' : ''}
                  transition-all duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className="text-lg">{item.emoji}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              {!item.unlocked && (
                <div className="mt-3 text-xs text-accent flex items-center gap-1">
                  <span>🔒</span>
                  <span>Complete the games to unlock</span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Hint */}
        <div className="mt-8 text-center text-sm text-muted-foreground/60 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>No rush... enjoy each moment 🌷</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Rabbit, Trophy } from 'lucide-react';
import ValentineCountdown from '@/components/ValentineCountdown';
import { useAuth } from '@/contexts/AuthContext';

const GameHubPage = () => {
  const { hasCompletedGame } = useAuth();

  const games = [
    {
      id: 'quiz',
      to: '/game/quiz',
      icon: HelpCircle,
      title: 'Do You Know Me?',
      description: 'Answer questions about yourself... but it\'s not that easy! 😏',
      emoji: '🎯',
    },
    {
      id: 'runner',
      to: '/game/runner',
      icon: Rabbit,
      title: 'Bunny Runner',
      description: 'Help the bunny collect carrots and avoid trees! 🥕',
      emoji: '🐰',
    },
    {
      id: 'snake',
      to: '/game/snake',
      icon: HelpCircle,
      title: 'Love Snake',
      description: 'Collect hearts and grow longer! Classic but cute 💖',
      emoji: '🐍',
    },
    {
      id: 'flappy',
      to: '/game/flappy',
      icon: Rabbit,
      title: 'Flappy Bunny',
      description: 'Fly through the pipes! Don\'t hit anything~ 🌸',
      emoji: '🕊️',
    },
  ];

  return (
    <div className="min-h-screen dreamy-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex justify-center">
          <ValentineCountdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Link */}
        <Link 
          to="/home" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Title */}
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Game Hub 🎮
          </h1>
          <p className="text-muted-foreground">
            Pick a game and have fun! Each one is a little gift. 🎁
          </p>
        </div>

        {/* Games Grid */}
        <div className="space-y-4">
          {games.map((game, index) => (
            <Link
              key={game.id}
              to={game.to}
              className="valentine-card p-6 block transition-all duration-300 hover:shadow-glow hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-lavender-light/50 text-primary transition-all duration-300 group-hover:scale-110">
                  <game.icon className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-foreground">{game.title}</h3>
                    <span className="text-xl">{game.emoji}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {game.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Completion Status */}
        {hasCompletedGame && (
          <div className="mt-8 valentine-card p-4 flex items-center justify-center gap-3 animate-fade-in bg-pink-light/30">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Games completed! Your gift awaits... 🎁
            </span>
            <Link to="/gift" className="text-primary hover:underline text-sm font-medium">
              Claim it →
            </Link>
          </div>
        )}

        {/* Hint */}
        <div className="mt-8 text-center text-sm text-muted-foreground/60">
          <p>These games are made just for you 💜</p>
        </div>
      </main>
    </div>
  );
};

export default GameHubPage;

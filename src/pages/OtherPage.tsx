import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Star, Music } from 'lucide-react';
import ValentineCountdown from '@/components/ValentineCountdown';
import WavingBunny from '@/components/WavingBunny';

const OtherPage = () => {
  const [clickedItems, setClickedItems] = useState<number[]>([]);

  const surprises = [
    {
      id: 1,
      icon: Heart,
      emoji: "💜",
      title: "A Secret",
      message: "I smile every time I think of you... even now, writing this 🥰",
    },
    {
      id: 2,
      icon: Star,
      emoji: "⭐",
      title: "A Wish",
      message: "I hope this made you smile, even just a little bit 💫",
    },
    {
      id: 3,
      icon: MessageCircle,
      emoji: "💭",
      title: "A Thought",
      message: "No matter what happens, you'll always be my favorite person 💕",
    },
    {
      id: 4,
      icon: Music,
      emoji: "🎵",
      title: "A Memory",
      message: "Every song reminds me of you... especially the cheesy ones 😄",
    },
  ];

  const handleClick = (id: number) => {
    if (!clickedItems.includes(id)) {
      setClickedItems([...clickedItems, id]);
    }
  };

  const allRevealed = clickedItems.length === surprises.length;

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

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Little Surprises ✨
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Tap each one to reveal a message...
          </p>
        </div>

        {/* Surprise Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {surprises.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`valentine-card p-6 transition-all duration-500 text-center
                ${clickedItems.includes(item.id) 
                  ? 'bg-lavender-light/50' 
                  : 'hover:shadow-glow hover:-translate-y-1 cursor-pointer'
                }
                animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {clickedItems.includes(item.id) ? (
                <div className="space-y-2 animate-fade-in">
                  <div className="text-3xl">{item.emoji}</div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.message}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-lavender-light/50 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Tap me!</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* All Revealed Message */}
        {allRevealed && (
          <div className="valentine-card p-6 text-center space-y-4 animate-scale-in">
            <WavingBunny size="sm" />
            <h3 className="font-display font-semibold text-foreground">
              You found all the surprises! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">
              There's nothing more here... except my love for you 💜
            </p>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground italic">
                Thank you for being you.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground/60">
          <p>{clickedItems.length}/{surprises.length} revealed</p>
        </div>
      </main>
    </div>
  );
};

export default OtherPage;

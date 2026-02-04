import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import ValentineCountdown from '@/components/ValentineCountdown';
import { Button } from '@/components/ui/button';

interface Poem {
  title: string;
  content: string[];
  dedication?: string;
}

const poems: Poem[] = [
  {
    title: "For You",
    content: [
      "In the quiet of my heart,",
      "There's a space that's only yours,",
      "Where every beat whispers your name,",
      "And love forever pours.",
      "",
      "You came like morning light,",
      "Gentle, warm, and true,",
      "And in that simple moment,",
      "I knew... it was you.",
    ],
    dedication: "My first poem for you 💜",
  },
  {
    title: "Little Things",
    content: [
      "It's not the grand gestures,",
      "That make my heart feel whole,",
      "It's the way you say my name,",
      "That touches my very soul.",
      "",
      "The random texts at midnight,",
      "The laughter that we share,",
      "The silent understanding—",
      "That you're always there.",
    ],
  },
  {
    title: "Safe Place",
    content: [
      "With you, I don't pretend,",
      "I don't have to be strong,",
      "In your arms I find my peace,",
      "Where I've always belonged.",
      "",
      "You're my calm in every storm,",
      "My rest at end of day,",
      "No matter where life takes us,",
      "With you is where I'll stay.",
    ],
  },
  {
    title: "Promise",
    content: [
      "I promise to be patient,",
      "When the days are hard and long,",
      "I promise to be your strength,",
      "When you feel you can't be strong.",
      "",
      "I promise to choose you,",
      "Every morning, every night,",
      "I promise to love you softly,",
      "And hold you ever tight.",
    ],
  },
  {
    title: "Forever Yours",
    content: [
      "If I could write forever,",
      "These pages still would say,",
      "That you're the one I cherish,",
      "In every single way.",
      "",
      "So take these words I offer,",
      "Simple but sincere,",
      "Know that you are loved,",
      "Today, and every year.",
    ],
    dedication: "Happy Valentine's Day, my love 💕",
  },
];

const PoetryBook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const currentPoem = poems[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === poems.length - 1;

  const goToPage = (direction: 'prev' | 'next') => {
    if (isFlipping) return;
    if (direction === 'prev' && isFirstPage) return;
    if (direction === 'next' && isLastPage) return;

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(currentPage + (direction === 'next' ? 1 : -1));
      setIsFlipping(false);
    }, 300);
  };

  return (
    <div className="min-h-screen dreamy-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex justify-center">
          <ValentineCountdown />
        </div>
      </header>

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
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Poetry Book
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Words written from the heart, just for you 💕
          </p>
        </div>

        {/* Book */}
        <div className={`valentine-card p-8 md:p-12 min-h-[400px] flex flex-col transition-all duration-300 ${isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Poem Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              {currentPoem.title}
            </h2>

            {/* Dedication (if any) */}
            {currentPoem.dedication && (
              <p className="text-sm text-accent italic">
                {currentPoem.dedication}
              </p>
            )}

            {/* Poem Lines */}
            <div className="space-y-1 text-foreground/90 leading-relaxed">
              {currentPoem.content.map((line, index) => (
                <p key={index} className={line === "" ? "h-4" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Page Number */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {currentPage + 1} of {poems.length}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => goToPage('prev')}
            disabled={isFirstPage || isFlipping}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {/* Page Dots */}
          <div className="flex gap-2">
            {poems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isFlipping && index !== currentPage) {
                    setIsFlipping(true);
                    setTimeout(() => {
                      setCurrentPage(index);
                      setIsFlipping(false);
                    }, 300);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPage 
                    ? 'bg-primary w-4' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => goToPage('next')}
            disabled={isLastPage || isFlipping}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground/60">
          <p>Take your time... each word is meant for you 🌷</p>
        </div>
      </main>
    </div>
  );
};

export default PoetryBook;

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ValentineCountdown from '@/components/ValentineCountdown';
import { useAuth } from '@/contexts/AuthContext';
import bunnyLove from '@/assets/bunny-running.png';

const GAME_WIDTH = 320;
const GAME_HEIGHT = 480;
const BUNNY_SIZE = 40;
const PIPE_WIDTH = 50;
const PIPE_GAP = 180;
const GRAVITY = 0.25;
const MAX_FALL_SPEED = 6;
const JUMP_FORCE = -5;
const PIPE_SPEED = 3;

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

const FlappyBunny = () => {
  const { setHasCompletedGame } = useAuth();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [bunnyY, setBunnyY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('valentine-flappy-highscore');
    return saved ? parseInt(saved) : 0;
  });

  const gameLoopRef = useRef<number>();
  const lastPipeRef = useRef(0);

  const resetGame = useCallback(() => {
    setBunnyY(GAME_HEIGHT / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    lastPipeRef.current = 0;
  }, []);

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setVelocity(JUMP_FORCE);
    } else if (gameState === 'idle') {
      startGame();
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update bunny position
    setBunnyY(prev => {
      const newY = prev + velocity;
      
      // Check ceiling/floor collision
      if (newY < 0 || newY + BUNNY_SIZE > GAME_HEIGHT) {
        setGameState('gameover');
        return prev;
      }
      
      return newY;
    });

    // Update velocity (gravity) with a terminal fall speed cap
    setVelocity(prev => Math.min(prev + GRAVITY, MAX_FALL_SPEED));

    // Update pipes
    setPipes(prevPipes => {
      let newPipes = prevPipes
        .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        .filter(pipe => pipe.x + PIPE_WIDTH > 0);

      // Add new pipe
      const lastPipe = newPipes[newPipes.length - 1];
      if (!lastPipe || lastPipe.x < GAME_WIDTH - 200) {
        const gapY = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
        newPipes.push({ x: GAME_WIDTH, gapY, passed: false });
      }

      // Check collisions and scoring
      const bunnyX = 60;
      const bunnyRight = bunnyX + BUNNY_SIZE - 10;
      const bunnyLeft = bunnyX + 10;
      
      newPipes = newPipes.map(pipe => {
        // Check if passed
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bunnyLeft) {
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('valentine-flappy-highscore', String(newScore));
            }
            if (newScore >= 30) {
              setGameState('won');
              setHasCompletedGame(true);
            }
            return newScore;
          });
          return { ...pipe, passed: true };
        }

        // Check collision
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        
        if (bunnyRight > pipeLeft && bunnyLeft < pipeRight) {
          const bunnyTop = bunnyY + 10;
          const bunnyBottom = bunnyY + BUNNY_SIZE - 10;
          
          if (bunnyTop < pipe.gapY || bunnyBottom > pipe.gapY + PIPE_GAP) {
            setGameState('gameover');
          }
        }

        return pipe;
      });

      return newPipes;
    });
  }, [gameState, velocity, bunnyY, highScore, setHasCompletedGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      const loop = () => {
        gameLoop();
        gameLoopRef.current = requestAnimationFrame(loop);
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div className="min-h-screen dreamy-bg">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex justify-center">
          <ValentineCountdown />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        <Link 
          to="/game" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>

        <div className="text-center space-y-2 mb-6 animate-fade-in">
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Flappy Bunny 🐰✨
          </h1>
          <p className="text-sm text-muted-foreground">
            Tap to fly! Pass 30 pipes to win 💕
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-4 valentine-card p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌸</span>
            <span className="font-medium text-foreground">Score: {score}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Best: {highScore}
          </div>
        </div>

        {/* Game Board */}
        <div className="valentine-card p-4 flex justify-center">
          <div 
            className="relative overflow-hidden rounded-lg cursor-pointer"
            style={{ 
              width: GAME_WIDTH, 
              height: GAME_HEIGHT,
              background: 'linear-gradient(to bottom, hsl(var(--lavender-light)), hsl(var(--pink-light)))'
            }}
            onClick={jump}
            onTouchStart={(e) => { e.preventDefault(); jump(); }}
          >
            {/* Clouds decoration */}
            <div className="absolute top-10 left-10 text-4xl opacity-50">☁️</div>
            <div className="absolute top-20 right-20 text-3xl opacity-40">☁️</div>
            <div className="absolute top-40 left-1/2 text-2xl opacity-30">☁️</div>

            {/* Pipes */}
            {pipes.map((pipe, index) => (
              <div key={index}>
                {/* Top pipe */}
                <div
                  className="absolute bg-gradient-to-b from-primary to-lavender-dark rounded-b-lg border-2 border-primary/50"
                  style={{
                    left: pipe.x,
                    top: 0,
                    width: PIPE_WIDTH,
                    height: pipe.gapY,
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-primary rounded-b-lg" />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-lg">🌸</span>
                </div>
                {/* Bottom pipe */}
                <div
                  className="absolute bg-gradient-to-t from-primary to-lavender-dark rounded-t-lg border-2 border-primary/50"
                  style={{
                    left: pipe.x,
                    top: pipe.gapY + PIPE_GAP,
                    width: PIPE_WIDTH,
                    height: GAME_HEIGHT - pipe.gapY - PIPE_GAP,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-6 bg-primary rounded-t-lg" />
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 text-lg">🌸</span>
                </div>
              </div>
            ))}

            {/* Bunny */}
            <div
              className="absolute transition-transform"
              style={{
                left: 60,
                top: bunnyY,
                width: BUNNY_SIZE,
                height: BUNNY_SIZE,
                transform: `rotate(${Math.min(velocity * 3, 30)}deg)`,
              }}
            >
              <img 
                src={bunnyLove} 
                alt="Flappy Bunny" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Ground decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary/30" />

            {/* Overlays */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 gap-4">
                <p className="text-lg font-display text-foreground">Tap to fly! 🐰</p>
                <Button onClick={startGame} className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Game
                </Button>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 gap-3">
                <p className="text-lg font-medium text-foreground">Ehh! Tiati yak 💔</p>
                <p className="text-sm text-muted-foreground">Score: {score}</p>
                <Button onClick={startGame} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            )}

            {gameState === 'won' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 gap-3">
                <p className="text-xl font-display text-primary">Wah... Lumayan juga kamu ya 🎉</p>
                <p className="text-sm text-muted-foreground">YEYY NISA HEBAT! Score: {score}</p>
                <Link to="/game">
                  <Button className="gap-2">
                    Back to Games
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Tap or press Space to jump 🎮
        </p>
      </main>
    </div>
  );
};

export default FlappyBunny;

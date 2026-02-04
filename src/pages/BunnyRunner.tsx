import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import ValentineCountdown from '@/components/ValentineCountdown';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import bunnyRunning from '@/assets/bunny-running.png';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'tree' | 'carrot';
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 300;
const GROUND_Y = 220;
const BUNNY_SIZE = 50;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GAME_SPEED = 10;
const WIN_SCORE = 10;

const BunnyRunner = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'win'>('idle');
  const [bunnyY, setBunnyY] = useState(GROUND_Y);
  const [bunnyVelocity, setBunnyVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  const bunnyYRef = useRef(GROUND_Y);
  const bunnyVelocityRef = useRef(0);
  const navigate = useNavigate();
  const { setHasCompletedGame } = useAuth();

  const jump = useCallback(() => {
    if (!isJumping && gameState === 'playing') {
      bunnyVelocityRef.current = JUMP_FORCE;
      setBunnyVelocity(JUMP_FORCE);
      setIsJumping(true);
    }
  }, [isJumping, gameState]);

  const startGame = () => {
    setGameState('playing');
    setBunnyY(GROUND_Y);
    setBunnyVelocity(0);
    setIsJumping(false);
    setObjects([]);
    setScore(0);
    lastSpawnRef.current = 0;
    bunnyYRef.current = GROUND_Y;
    bunnyVelocityRef.current = 0;
  };

  const handleWin = useCallback(() => {
    setGameState('win');
    setHasCompletedGame(true);
    if (score > highScore) setHighScore(score);
  }, [score, highScore, setHasCompletedGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'idle' || gameState === 'gameover') {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      // Update bunny physics using refs for synchronous values
      bunnyVelocityRef.current += GRAVITY;
      bunnyYRef.current += bunnyVelocityRef.current;
      if (bunnyYRef.current >= GROUND_Y) {
        bunnyYRef.current = GROUND_Y;
        bunnyVelocityRef.current = 0;
        setIsJumping(false);
      }
      // push refs to state for rendering
      setBunnyVelocity(bunnyVelocityRef.current);
      setBunnyY(bunnyYRef.current);

      // Spawn objects
      lastSpawnRef.current++;
      if (lastSpawnRef.current > 60 + Math.random() * 40) {
        lastSpawnRef.current = 0;
        const isCarrot = Math.random() > 0.6;
        const newObject: GameObject = {
          x: GAME_WIDTH,
          y: isCarrot ? GROUND_Y - 20 - Math.random() * 60 : GROUND_Y,
          width: isCarrot ? 25 : 40,
          height: isCarrot ? 30 : 60,
          type: isCarrot ? 'carrot' : 'tree',
        };
        setObjects(prev => [...prev, newObject]);
      }

      // Update objects and collisions (use latest bunnyY from ref)
      setObjects(prev => {
        const updated = prev
          .map(obj => ({ ...obj, x: obj.x - GAME_SPEED }))
          .filter(obj => obj.x > -50);

        const bunnyBox = {
          x: 50,
          y: bunnyYRef.current,
          width: BUNNY_SIZE - 10,
          height: BUNNY_SIZE - 10,
        };

        for (const obj of updated) {
          const collision = 
            bunnyBox.x < obj.x + obj.width &&
            bunnyBox.x + bunnyBox.width > obj.x &&
            bunnyBox.y < obj.y + obj.height &&
            bunnyBox.y + bunnyBox.height > obj.y;

          if (collision) {
            if (obj.type === 'tree') {
              setGameState('gameover');
              setHighScore(h => Math.max(h, score));
              return prev;
            } else {
              // Collect carrot
              setScore(s => {
                const newScore = s + 1;
                if (newScore >= WIN_SCORE) {
                  handleWin();
                }
                return newScore;
              });
              return updated.filter(o => o !== obj);
            }
          }
        }

        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, score, highScore, handleWin]);

  return (
    <div className="min-h-screen dreamy-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex justify-center">
          <ValentineCountdown />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Link */}
        <Link 
          to="/game" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Game Hub
        </Link>

        {/* Title */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Bunny Runner 🐰
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Collect {WIN_SCORE} carrots to win! Avoid the trees!
          </p>
        </div>

        {/* Game Container */}
        <div 
          className="valentine-card overflow-hidden relative mx-auto cursor-pointer"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onClick={gameState === 'playing' ? jump : startGame}
          onTouchStart={gameState === 'playing' ? jump : startGame}
        >
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-lavender-light via-pink-light/30 to-cream" />
          
          {/* Clouds */}
          <div className="absolute top-8 left-20 text-4xl opacity-50">☁️</div>
          <div className="absolute top-16 left-1/2 text-3xl opacity-40">☁️</div>
          <div className="absolute top-6 right-20 text-3xl opacity-45">☁️</div>
          
          {/* Ground */}
          <div 
            className="absolute left-0 right-0 bg-gradient-to-t from-lavender/30 to-lavender-light/50"
            style={{ bottom: 0, height: GAME_HEIGHT - GROUND_Y - BUNNY_SIZE + 30 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-lavender/40" />
          </div>

          {/* Bunny */}
          <div
            className="absolute transition-transform"
            style={{
              left: 50,
              top: bunnyY,
              width: BUNNY_SIZE,
              height: BUNNY_SIZE,
              transform: isJumping ? 'rotate(-10deg)' : 'rotate(0deg)',
            }}
          >
            <img 
              src={bunnyRunning} 
              alt="Bunny" 
              className="w-full h-full object-contain"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>

          {/* Objects */}
          {objects.map((obj, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: obj.x,
                top: obj.y,
                width: obj.width,
                height: obj.height,
              }}
            >
              {obj.type === 'tree' ? (
                <span className="text-3xl">🌲</span>
              ) : (
                <span className="text-2xl">🥕</span>
              )}
            </div>
          ))}

          {/* Score */}
          <div className="absolute top-4 right-4 text-lg font-bold text-foreground">
            🥕 {score}/{WIN_SCORE}
          </div>

          {/* Overlays */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="text-6xl mb-4 animate-bounce-gentle">🐰</div>
              <Button onClick={startGame} className="valentine-button">
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Press Space, ↑, or tap to jump
              </p>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="text-5xl mb-4">😝</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Upss! Ciee nabrak 😏</h3>
              <p className="text-muted-foreground mb-4">Score: {score} | Best: {highScore}</p>
              <Button onClick={startGame} className="valentine-button">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {gameState === 'win' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="text-5xl mb-4 animate-bounce-gentle">🎉</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Tumben menang 😌</h3>
              <p className="text-muted-foreground mb-4">Iziiiiiiiiiin 🧏‍♂️</p>
              <Button onClick={() => navigate('/gift')} className="valentine-button">
                Claim Your Gift 🎁
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>🐰 Jump over trees and collect carrots! 🥕</p>
        </div>
      </main>
    </div>
  );
};

export default BunnyRunner;

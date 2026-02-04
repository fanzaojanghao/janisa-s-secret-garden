import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ValentineCountdown from '@/components/ValentineCountdown';
import { useAuth } from '@/contexts/AuthContext';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 200;

const SnakeGame = () => {
  const { setHasCompletedGame } = useAuth();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('valentine-snake-highscore');
    return saved ? parseInt(saved) : 0;
  });

  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number>();

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameState('idle');
  }, [generateFood]);

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState('gameover');
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameover');
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('valentine-snake-highscore', String(newScore));
          }
          if (newScore >= 100) {
            setGameState('won');
            setHasCompletedGame(true);
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [gameState, food, highScore, generateFood, setHasCompletedGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = window.setInterval(gameLoop, INITIAL_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') {
            setDirection('UP');
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') {
            setDirection('DOWN');
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') {
            setDirection('LEFT');
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') {
            setDirection('RIGHT');
            directionRef.current = 'RIGHT';
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const handleDirectionButton = (newDir: Direction) => {
    const currentDir = directionRef.current;
    if (
      (newDir === 'UP' && currentDir !== 'DOWN') ||
      (newDir === 'DOWN' && currentDir !== 'UP') ||
      (newDir === 'LEFT' && currentDir !== 'RIGHT') ||
      (newDir === 'RIGHT' && currentDir !== 'LEFT')
    ) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  };

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
            Love Snake 🐍
          </h1>
          <p className="text-sm text-muted-foreground">
            Collect hearts to grow! Reach 100 points to win 🍈
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-4 valentine-card p-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-heart fill-heart" />
            <span className="font-medium text-foreground">Score: {score}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Best: {highScore}
          </div>
        </div>

        {/* Game Board */}
        <div className="valentine-card p-4 flex flex-col items-center">
          <div 
            className="relative bg-lavender-light/30 rounded-lg border-2 border-primary/20"
            style={{ 
              width: GRID_SIZE * CELL_SIZE, 
              height: GRID_SIZE * CELL_SIZE 
            }}
          >
            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-full transition-all duration-75 ${
                  index === 0 
                    ? 'bg-primary z-10' 
                    : 'bg-lavender-dark'
                }`}
                style={{
                  left: segment.x * CELL_SIZE + 2,
                  top: segment.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                }}
              >
                {index === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs">
                    👽
                  </span>
                )}
              </div>
            ))}

            {/* Food */}
            <div
              className="absolute animate-pulse"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              <span className="text-lg">🍈</span>
            </div>

            {/* Overlays */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                <Button onClick={startGame} className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Game
                </Button>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg gap-3">
                <p className="text-lg font-medium text-foreground">Kaciaaan 'Game Over' 😜</p>
                <p className="text-sm text-muted-foreground">Score: {score}</p>
                <Button onClick={startGame} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            )}

            {gameState === 'won' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 rounded-lg gap-3">
                <p className="text-xl font-display text-primary">Yeey! 🎉</p>
                <p className="text-sm text-muted-foreground">Ciee menang lagi nih... Score: {score}</p>
                <Link to="/game">
                  <Button className="gap-2">
                    Back to Games
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="mt-6 grid grid-cols-3 gap-2 w-36">
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDirectionButton('UP')}
              disabled={gameState !== 'playing'}
              className="h-10 w-10"
            >
              ↑
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDirectionButton('LEFT')}
              disabled={gameState !== 'playing'}
              className="h-10 w-10"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDirectionButton('DOWN')}
              disabled={gameState !== 'playing'}
              className="h-10 w-10"
            >
              ↓
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDirectionButton('RIGHT')}
              disabled={gameState !== 'playing'}
              className="h-10 w-10"
            >
              →
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Use arrow keys or WASD to move 🎮
        </p>
      </main>
    </div>
  );
};

export default SnakeGame;

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import ValentineCountdown from '@/components/ValentineCountdown';
import { Button } from '@/components/ui/button';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Kalau Ojan bilang 'bebas', maksud aslinya:",
    options: [
      "Bebas tapi aku punya pendapat",
      "Bebas tapi nanti aku mikir",
      "Bebas tapi jangan jauh-jauh",
      "Sebenernya nggak bebas"
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    question: "Reaksi Ojan pas dikasih pilihan A atau B:",
    options: [
      "Langsung milih",
      "Balik nanya dulu",
      "Mikir lama padahal sepele",
      "Milih tapi ragu"
    ],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Kebiasaan Ojan yang sering kejadian tanpa sadar:",
    options: [
      "Bilang 'bentar' tapi lama",
      "Buka HP cuma mau cek jam",
      "Niat fokus tapi kepikiran hal lain",
      "Ketiganya kejadian"
    ],
    correctIndex: 3,
  },
  {
    id: 4,
    question: "Chat Ojan yang paling sering bikin salah paham:",
    options: [
      "'hehe'",
      "'oh gitu'",
      "'yaudah'",
      "'.'"
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    question: "Kalau Ojan nunggu orang:",
    options: [
      "Santai, nggak mikir",
      "Cek HP dikit-dikit",
      "Jalan mondar-mandir",
      "Kelihatan santai tapi sebenernya resah"
    ],
    correctIndex: 3,
  },
  {
    id: 6,
    question: "Hal yang paling sering bikin fokus Ojan buyar:",
    options: [
      "Notif HP",
      "Laper tiba-tiba",
      "Mikir hal random",
      "Semuanya nyerang barengan"
    ],
    correctIndex: 3,
  },
  {
    id: 7,
    question: "Kalau Ojan bilang 'ntar ya':",
    options: [
      "Bentar lagi",
      "Masih lama",
      "Tergantung situasi",
      "Ojan sendiri juga belum tau"
    ],
    correctIndex: 3,
  },
  {
    id: 8,
    question: "Kesimpulan paling adil tentang Ojan:",
    options: [
      "Orangnya santai",
      "Orangnya ribet",
      "Orangnya aneh dikit",
      "Campuran semuanya"
    ],
    correctIndex: 3,
  },
];

const QuizGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [clickedWrong, setClickedWrong] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [wrongPopupVisible, setWrongPopupVisible] = useState(false);
  const [wrongPopupMessage, setWrongPopupMessage] = useState('');
  const [offsets, setOffsets] = useState<{x:number,y:number}[]>(() => questions[currentQuestion].options.map(() => ({ x: 0, y: 0 })));
  const [escapeAngle, setEscapeAngle] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [fleeingUntil, setFleeingUntil] = useState<number>(0); // timestamp when fleeing stops
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const escapeTimeRef = useRef(0);
  const angleRef = useRef(0);
  const phasesRef = useRef<number[]>([]);
  const fleeingRef = useRef(false);
  const hasFledRef = useRef<boolean[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const navigate = useNavigate();

  const currentQ = questions[currentQuestion];

  

  useEffect(() => {
    // reset offsets when question changes
    setOffsets(currentQ.options.map(() => ({ x: 0, y: 0 })));
    setEscapeAngle(0);
    escapeTimeRef.current = 0;
    setFleeingUntil(0);
    // initialize orbital phases for options
    phasesRef.current = currentQ.options.map((_, i) => (i * (2 * Math.PI) / currentQ.options.length));
    // reset flee trackers
    hasFledRef.current = currentQ.options.map(() => false);
    targetsRef.current = currentQ.options.map(() => ({ x: 0, y: 0 }));
  }, [currentQuestion]);
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let animationId: number;
    const loop = () => {
      angleRef.current += 0.03;
      setEscapeAngle(angleRef.current);

      const idx = currentQ.correctIndex;
      const now = Date.now();
      const isStillFleeing = now < fleeingUntil;

      // If fleeing period is active and user has clicked it, move it away from cursor
      if (isStillFleeing && hasFledRef.current[idx]) {
        const el = optionRefs.current[idx];
        if (el) {
          const rect = el.getBoundingClientRect();
          const elemCx = rect.left + rect.width / 2;
          const elemCy = rect.top + rect.height / 2;
          
          // Calculate direction away from cursor
          const dx = elemCx - mousePos.x;
          const dy = elemCy - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const dirX = dx / dist;
          const dirY = dy / dist;
          
          // Move towards a point in the opposite direction from cursor
          const fleeDistance = 200;
          const targetX = elemCx + dirX * fleeDistance;
          const targetY = elemCy + dirY * fleeDistance;
          
          const targetOffsetX = targetX - elemCx;
          const targetOffsetY = targetY - elemCy;
          
          setOffsets(prev => {
            const copy = prev.slice();
            const prevX = copy[idx]?.x ?? 0;
            const prevY = copy[idx]?.y ?? 0;
            copy[idx] = { 
              x: lerp(prevX, targetOffsetX, 0.12), 
              y: lerp(prevY, targetOffsetY, 0.12) 
            };
            return copy;
          });
        }
      }

      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [currentQ, mousePos, fleeingUntil]);


  const handleOptionClick = (index: number, e: any) => {
    const idx = index;
    const now = Date.now();
    
    // If clicked the correct option
    if (idx === currentQ.correctIndex) {
      // If fleeing period is still active, don't allow click
      if (now < fleeingUntil) {
        return;
      }
      
      if (!hasFledRef.current[idx]) {
        // First click: trigger 10 second fleeing period
        hasFledRef.current[idx] = true;
        setFleeingUntil(Date.now() + 10000); // 10 seconds
        return;
      }

      // If fleeing has ended, count as correct
      setScore(prev => prev + 1);
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setHoveredOption(null);
          setClickedWrong(null);
          setWrongPopupVisible(false);
          hasFledRef.current = questions[currentQuestion + 1].options.map(() => false);
        }, 400);
      } else {
        setGameComplete(true);
      }
      return;
    }

    // Wrong answer behavior: show an annoying popup and play the shake
    setClickedWrong(index);
    setAttempts(prev => prev + 1);
    setTimeout(() => setClickedWrong(null), 1000);

    const taunts = [
      'Salah wleee... Masa ga tau si 😁',
      'Eh, masih salah tuh. Ini serius Nisa ga tau? 🤨',
      'Waduh, kebanyakan salahnya. Fokus dong! 🙄',
      'Nisa belum deket nih sama Ojan? 😏',
    ];
    const message = taunts[Math.min(attempts, taunts.length - 1)];
    setWrongPopupMessage(message);
    setWrongPopupVisible(true);
    // auto-hide popup after 2.2s
    setTimeout(() => setWrongPopupVisible(false), 2200);
  };

  const getBlurAmount = (index: number) => {
    return 0;
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen dreamy-bg flex items-center justify-center p-4">
        <div className="valentine-card p-8 max-w-md text-center space-y-6 animate-scale-in">
          <div className="text-6xl animate-bounce-gentle">🎉</div>
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Berhasil! 🎉
          </h2>
          <p className="text-muted-foreground">
            Skor: {score}/{questions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Wah, ternyata Nisa kenal Ojan 💕
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/game/runner')} className="valentine-button">
              Selanjutnya: Bunny Runner 🐰
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/game" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Kembali ke Game Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dreamy-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-3 flex justify-center">
          <ValentineCountdown />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl" onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
        {/* Back Link */}
        <Link 
          to="/game" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Game Hub
        </Link>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
            <span>Skor: {score}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="valentine-card p-6 space-y-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-foreground text-center">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                ref={(el) => (optionRefs.current[index] = el)}
                onMouseEnter={() => { setHoveredOption(index); }}
                onMouseLeave={() => { setHoveredOption(null); }}
                onClick={(e) => handleOptionClick(index, e)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2
                  ${clickedWrong === index 
                    ? 'border-destructive bg-destructive/10 animate-shake' 
                    : 'border-border hover:border-primary/50 bg-card hover:bg-lavender-light/30'
                  }
                `}
                style={{
                  transform: `translate(${offsets[index]?.x ?? 0}px, ${offsets[index]?.y ?? 0}px)`,
                  transition: 'transform 0.12s ease-out',
                }}
              >
                <span className="text-foreground">{option}</span>
              </button>
            ))}
          </div>

          {attempts > 0 && (
            <p className="text-xs text-center text-muted-foreground animate-fade-in">
              Hmm, bukan itu... coba lagi dong! 🤔
            </p>
          )}
        </div>

        {/* Wrong answer popup (ngeselin) */}
        {wrongPopupVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setWrongPopupVisible(false)} />
            <div className="bg-card p-6 rounded-xl shadow-lg z-10 w-full max-w-sm text-center animate-fade-in">
              <div className="text-2xl font-semibold mb-2">Ups!</div>
              <p className="mb-4 text-sm text-muted-foreground">{wrongPopupMessage}</p>
              <div className="flex justify-center">
                <Button onClick={() => setWrongPopupVisible(false)} className="valentine-button">
                  Yaudah deh, Ojan yang salah...
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default QuizGame;

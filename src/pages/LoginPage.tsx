import { useState, useEffect } from 'react';
import { Heart, Sparkles, Eye, EyeOff, Lock, User, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import WavingBunny from '@/components/WavingBunny';
import ValentineCountdown from '@/components/ValentineCountdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroBg from '@/assets/hero-bg.jpg';

const LoginPage = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [shakeInput, setShakeInput] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const correctNickname = 'Nisaa';
  const correctNicknameLower = correctNickname.toLowerCase();
  const correctPassword = 'ilovebunny123';

  // Simple CAPTCHA questions
  const captchaQuestions = [
    { question: 'What is 5 + 3?', answer: '8' },
    { question: 'What is 12 - 4?', answer: '8' },
    { question: 'What is 2 × 4?', answer: '8' },
    { question: 'What is 16 ÷ 2?', answer: '8' },
  ];

  useEffect(() => {
    // Generate random captcha on mount and reset
    setCaptchaQuestion(Math.floor(Math.random() * captchaQuestions.length));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nicknameValid = nickname.toLowerCase().trim() === correctNicknameLower || 
                          nickname.toLowerCase().trim() === 'nisa' ||
                          nickname.toLowerCase().trim() === 'nicya';
    
    const passwordValid = password === correctPassword;
    const captchaValid = captchaAnswer.trim() === captchaQuestions[captchaQuestion].answer;

    if (!nicknameValid) {
      setHintMessage('Hmm, nama itu salah nih... Coba lagi? 💭');
      setShowHint(true);
      setShakeInput('nickname');
      setTimeout(() => { setShowHint(false); setShakeInput(null); }, 3000);
      return;
    }

    if (!passwordValid) {
      setHintMessage('Password-nya salah... Yuk coba lagi! 🔐');
      setShowHint(true);
      setShakeInput('password');
      setTimeout(() => { setShowHint(false); setShakeInput(null); }, 3000);
      return;
    }

    if (!captchaValid) {
      setHintMessage('Jawabannya kurang tepat... Coba hitung lagi! 🤖');
      setShowHint(true);
      setShakeInput('captcha');
      // Generate new captcha
      setCaptchaQuestion(Math.floor(Math.random() * captchaQuestions.length));
      setCaptchaAnswer('');
      setTimeout(() => { setShowHint(false); setShakeInput(null); }, 3000);
      return;
    }

    // All validations passed
    setIsLoading(true);
    setTimeout(() => {
      login(correctNickname);
      navigate('/home');
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      {/* Sound Toggle */}
      <button
        onClick={() => setSoundOn(!soundOn)}
        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-background/80 hover:bg-background/95 transition-colors text-foreground"
        title="Toggle sound"
      >
        {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md space-y-6 animate-fade-in">
        {/* Countdown */}
        <div className="flex justify-center">
          <ValentineCountdown />
        </div>

        {/* Main Card */}
        <div className="valentine-card p-8 space-y-6 text-center shadow-2xl">
          {/* Bunny with Animation */}
          <div className="flex justify-center -mt-20 animate-bounce" style={{ animationDuration: '2s' }}>
            <WavingBunny size="lg" />
          </div>

          {/* Title with Sparkles */}
          <div className="space-y-3">
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🌹 A Special Place 🌹
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Selamat datang di taman rahasia Janisa! 🐰✨<br />
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nickname Field */}
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-semibold text-foreground/80 flex items-center gap-2 justify-start">
                <span className="text-lg">👤</span>
                Nickname
              </label>
              <div className={`transition-all duration-300 ${shakeInput === 'nickname' ? 'animate-shake' : ''}`}>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Siapa nama panggilan Anda?"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-background/60 border-2 border-lavender/30 hover:border-lavender/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all duration-200 placeholder:text-muted-foreground/50"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground/80 flex items-center gap-2 justify-start">
                <span className="text-lg">🔑</span>
                Password
              </label>
              <div className={`relative transition-all duration-300 ${shakeInput === 'password' ? 'animate-shake' : ''}`}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/60 border-2 border-lavender/30 hover:border-lavender/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl pr-10 transition-all duration-200 placeholder:text-muted-foreground/50"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* CAPTCHA Field */}
            <div className={`space-y-2 transition-all duration-300 ${shakeInput === 'captcha' ? 'animate-shake' : ''}`}>
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2 justify-start">
                <span className="text-lg">🤖</span>
                Verifikasi Captcha
              </label>
              <div className="bg-background/60 border-2 border-lavender/30 hover:border-lavender/50 rounded-2xl p-4 space-y-3 transition-all duration-200">
                <p className="text-center text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {captchaQuestions[captchaQuestion].question}
                </p>
                <Input
                  type="text"
                  placeholder="Jawaban..."
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="bg-background border-2 border-lavender/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-center font-semibold placeholder:text-muted-foreground/50"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Hint Message */}
            {showHint && (
              <p className="text-sm text-accent animate-fade-in text-center font-medium px-3 py-2 bg-accent/10 rounded-lg">
                {hintMessage}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!nickname.trim() || !password.trim() || !captchaAnswer.trim() || isLoading}
              className="w-full valentine-button disabled:opacity-50 text-base font-semibold py-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Membuka...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Masuk ke Taman
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-xs text-muted-foreground/60 pt-2">
            ✨ Dibuat dengan 💕 untuk Janisa ✨
          </p>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-20 left-10 text-5xl opacity-30 animate-float hover:scale-125 transition-transform">💜</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>💕</div>
      <div className="absolute top-1/3 right-20 text-3xl opacity-25 animate-float" style={{ animationDelay: '0.5s' }}>🌸</div>
      <div className="absolute bottom-1/3 left-20 text-4xl opacity-25 animate-float" style={{ animationDelay: '1.5s' }}>🐰</div>
      
      {/* Additional Decorative Sparkles */}
      <div className="absolute top-1/4 left-1/4 text-2xl opacity-20 animate-pulse">✨</div>
      <div className="absolute top-2/3 right-1/4 text-2xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
    </div>
  );
};

export default LoginPage;

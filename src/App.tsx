import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MusicProvider } from "./contexts/MusicContext";
import MusicPlayer from "./components/MusicPlayer";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import GameHubPage from "./pages/GameHubPage";
import QuizGame from "./pages/QuizGame";
import BunnyRunner from "./pages/BunnyRunner";
import SnakeGame from "./pages/SnakeGame";
import FlappyBunny from "./pages/FlappyBunny";
import GiftPage from "./pages/GiftPage";
import PoetryBook from "./pages/PoetryBook";
import OtherPage from "./pages/OtherPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Public Route - redirect to home if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/game" element={<ProtectedRoute><GameHubPage /></ProtectedRoute>} />
      <Route path="/game/quiz" element={<ProtectedRoute><QuizGame /></ProtectedRoute>} />
      <Route path="/game/runner" element={<ProtectedRoute><BunnyRunner /></ProtectedRoute>} />
      <Route path="/game/snake" element={<ProtectedRoute><SnakeGame /></ProtectedRoute>} />
      <Route path="/game/flappy" element={<ProtectedRoute><FlappyBunny /></ProtectedRoute>} />
      <Route path="/gift" element={<ProtectedRoute><GiftPage /></ProtectedRoute>} />
      <Route path="/book" element={<ProtectedRoute><PoetryBook /></ProtectedRoute>} />
      <Route path="/other" element={<ProtectedRoute><OtherPage /></ProtectedRoute>} />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MusicProvider>
            <MusicPlayer />
            <AppRoutes />
          </MusicProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

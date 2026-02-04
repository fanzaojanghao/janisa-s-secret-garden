import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  login: (name: string) => void;
  logout: () => void;
  hasCompletedGame: boolean;
  setHasCompletedGame: (value: boolean) => void;
  hasReceivedGift: boolean;
  setHasReceivedGift: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [hasCompletedGame, setHasCompletedGame] = useState(false);
  const [hasReceivedGift, setHasReceivedGift] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('valentine-auth');
    const savedGame = localStorage.getItem('valentine-game-completed');
    const savedGift = localStorage.getItem('valentine-gift-received');
    
    if (savedAuth) {
      const { authenticated, name } = JSON.parse(savedAuth);
      setIsAuthenticated(authenticated);
      setUserName(name);
    }
    if (savedGame === 'true') setHasCompletedGame(true);
    if (savedGift === 'true') setHasReceivedGift(true);
  }, []);

  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    localStorage.setItem('valentine-auth', JSON.stringify({ authenticated: true, name }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('');
    localStorage.removeItem('valentine-auth');
  };

  const updateHasCompletedGame = (value: boolean) => {
    setHasCompletedGame(value);
    localStorage.setItem('valentine-game-completed', String(value));
  };

  const updateHasReceivedGift = (value: boolean) => {
    setHasReceivedGift(value);
    localStorage.setItem('valentine-gift-received', String(value));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        login,
        logout,
        hasCompletedGame,
        setHasCompletedGame: updateHasCompletedGame,
        hasReceivedGift,
        setHasReceivedGift: updateHasReceivedGift,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

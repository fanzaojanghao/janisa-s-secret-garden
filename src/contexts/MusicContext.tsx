import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  emoji: string;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  songs: Song[];
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  nextSong: () => void;
  previousSong: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Default songs - using royalty-free URLs
const DEFAULT_SONGS: Song[] = [
  {
    id: '1',
    title: 'Romantic Piano',
    artist: 'Background Music',
    url: 'https://assets.mixkit.co/active_storage/musics/582-583-original.mp3',
    emoji: '🎹',
  },
  {
    id: '2',
    title: 'Soft Ambient',
    artist: 'Relaxing Sounds',
    url: 'https://assets.mixkit.co/active_storage/musics/532-533-original.mp3',
    emoji: '🌸',
  },
  {
    id: '3',
    title: 'Dreamy Vibes',
    artist: 'Chill Beats',
    url: 'https://assets.mixkit.co/active_storage/musics/541-542-original.mp3',
    emoji: '✨',
  },
  {
    id: '4',
    title: 'Sweet Melody',
    artist: 'Love Songs',
    url: 'https://assets.mixkit.co/active_storage/musics/545-546-original.mp3',
    emoji: '💕',
  },
  {
    id: '5',
    title: 'Gentle Guitar',
    artist: 'Acoustic',
    url: 'https://assets.mixkit.co/active_storage/musics/560-561-original.mp3',
    emoji: '🎸',
  },
];

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [songs] = useState<Song[]>(DEFAULT_SONGS);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Initialize audio element and load saved state
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    setAudioElement(audio);

    const savedSongId = localStorage.getItem('valentine-music-song');
    const savedVolume = localStorage.getItem('valentine-music-volume');
    const savedPlaying = localStorage.getItem('valentine-music-playing');

    if (savedVolume) setVolume(parseFloat(savedVolume));
    
    if (savedSongId) {
      const song = DEFAULT_SONGS.find(s => s.id === savedSongId);
      if (song) {
        setCurrentSong(song);
        if (savedPlaying === 'true') {
          setIsPlaying(true);
        }
      }
    } else {
      setCurrentSong(DEFAULT_SONGS[0]);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (!audioElement || !currentSong) return;

    audioElement.src = currentSong.url;
    audioElement.volume = volume;

    if (isPlaying) {
      audioElement.play().catch(err => {
        console.log('Auto-play prevented:', err);
        setIsPlaying(false);
      });
    } else {
      audioElement.pause();
    }

    localStorage.setItem('valentine-music-song', currentSong.id);
    localStorage.setItem('valentine-music-playing', String(isPlaying));
  }, [audioElement, currentSong, isPlaying, volume]);

  // Save volume preference
  useEffect(() => {
    localStorage.setItem('valentine-music-volume', String(volume));
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  const nextSong = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const previousSong = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    setCurrentSong(songs[prevIndex]);
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        songs,
        setCurrentSong,
        setIsPlaying,
        setVolume,
        nextSong,
        previousSong,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

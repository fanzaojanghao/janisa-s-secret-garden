import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const MusicPlayer = () => {
  const { currentSong, isPlaying, volume, songs, setIsPlaying, setVolume, setCurrentSong, nextSong, previousSong } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
      {/* Expanded Player */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 w-80 bg-gradient-to-br from-background/95 via-background/90 to-background/85 backdrop-blur-lg rounded-3xl p-6 border border-border/40 shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Now Playing</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Song Info */}
          <div className="space-y-3 mb-6 p-4 bg-white/10 rounded-2xl border border-white/20">
            <div className="text-2xl text-center">{currentSong.emoji}</div>
            <h2 className="text-lg font-bold text-foreground text-center">{currentSong.title}</h2>
            <p className="text-sm text-muted-foreground text-center">{currentSong.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousSong}
              className="h-10 w-10 p-0 hover:bg-primary/20"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-12 w-12 p-0 rounded-full bg-primary hover:bg-primary/90 text-white"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSong}
              className="h-10 w-10 p-0 hover:bg-primary/20"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2 mb-6 p-4 bg-white/10 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-primary" />
              )}
              <span className="text-xs font-medium text-muted-foreground">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Playlist Toggle */}
          <Button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-foreground transition-all duration-200"
          >
            <Music className="w-4 h-4 mr-2" />
            {showPlaylist ? 'Hide Playlist' : 'Show Playlist'}
          </Button>

          {/* Playlist */}
          {showPlaylist && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto rounded-2xl bg-white/5 p-3 border border-white/10">
              {songs.map((song) => (
                <div
                  key={song.id}
                  onMouseEnter={() => setHoveredSongId(song.id)}
                  onMouseLeave={() => setHoveredSongId(null)}
                  onClick={() => setCurrentSong(song)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentSong.id === song.id
                      ? 'bg-primary/20 border border-primary/40'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span className="text-xl">{song.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  {currentSong.id === song.id && hoveredSongId === song.id && (
                    <span className="text-xs font-bold text-primary">PLAYING</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsed Player Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`h-14 w-14 p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isExpanded ? 'bg-primary/90' : 'bg-gradient-to-r from-primary to-accent'
        }`}
        title={`${isPlaying ? 'Pause' : 'Play'} • ${currentSong.title}`}
      >
        <div className="flex items-center justify-center">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : isPlaying ? (
            <div className="flex items-center gap-1">
              <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            </div>
          ) : (
            <Music className="w-5 h-5" />
          )}
        </div>
      </Button>
    </div>
  );
};

export default MusicPlayer;

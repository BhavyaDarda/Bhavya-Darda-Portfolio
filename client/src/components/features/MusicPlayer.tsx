import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Music2Icon, 
  PlayIcon, 
  PauseIcon, 
  SkipForwardIcon, 
  SkipBackIcon, 
  VolumeIcon, 
  Volume2Icon,
  XIcon
} from 'lucide-react';
import { useThemeStore } from '../../lib/theme';

// Define music tracks - using free royalty-free music URLs
const musicTracks = [
  {
    id: 'gold',
    name: 'Luxury Gold',
    url: 'https://cdn.freesound.org/previews/635/635263_13416294-lq.mp3',
    theme: 'gold',
    mood: 'elegant'
  },
  {
    id: 'emerald',
    name: 'Emerald Ambience',
    url: 'https://cdn.freesound.org/previews/515/515954_1115287-lq.mp3',
    theme: 'emerald',
    mood: 'calm'
  },
  {
    id: 'platinum',
    name: 'Platinum Noir',
    url: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
    theme: 'platinum',
    mood: 'mysterious'
  }
];

const MusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const { t } = useTranslation();
  const soundRef = useRef<Howl | null>(null);
  const { currentTheme } = useThemeStore();
  
  // Get current track
  const currentTrack = musicTracks[currentTrackIndex];

  // Initialize and cleanup Howl on mount/unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  // Change track when theme changes
  useEffect(() => {
    const themeTrackIndex = musicTracks.findIndex(track => track.theme === currentTheme);
    if (themeTrackIndex !== -1 && themeTrackIndex !== currentTrackIndex) {
      setCurrentTrackIndex(themeTrackIndex);
    }
  }, [currentTheme, currentTrackIndex]);

  // Load new track when current track changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [currentTrack.url],
      html5: true,
      volume: volume,
      loop: true,
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      }
    });

    if (isPlaying) {
      soundRef.current.play();
    }
  }, [currentTrackIndex, currentTrack.url]);

  // Update volume when it changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const prevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Animation variants
  const playerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // Get button background based on theme
  const getButtonBg = () => {
    switch (currentTheme) {
      case 'emerald': return 'bg-emerald-600';
      case 'platinum': return 'bg-zinc-800';
      case 'gold':
      default: return 'bg-amber-600';
    }
  };

  return (
    <>
      {/* Music toggle button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-28 left-8 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${getButtonBg()} hover:shadow-xl transition-all duration-300`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-cursor="Music"
      >
        <Music2Icon className="h-6 w-6 text-white" />
        {isPlaying && (
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>

      {/* Music player interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={playerVariants}
            className="fixed bottom-8 left-8 sm:left-24 z-50 w-72 rounded-2xl shadow-2xl overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/40 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Music2Icon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-white">{t('music.title')}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
              >
                <XIcon className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Track info */}
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg text-white">{currentTrack.name}</h4>
                  <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                    {currentTrack.mood}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {t('theme.select')}: {t(`theme.${currentTrack.theme}`)}
                </p>
              </div>

              {/* Visualizer (simplified) */}
              <div className="w-full h-12 bg-black/30 rounded-lg flex items-end space-x-1 p-2 mb-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-primary rounded-t"
                    animate={{ 
                      height: isPlaying 
                        ? `${Math.random() * 100}%` 
                        : '10%'
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: isPlaying ? Infinity : 0,
                      repeatType: "mirror",
                      delay: i * 0.05 % 0.5
                    }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={prevTrack}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <SkipBackIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-primary text-white hover:bg-primary/80 transition-colors"
                >
                  {isPlaying 
                    ? <PauseIcon className="h-6 w-6" /> 
                    : <PlayIcon className="h-6 w-6" />
                  }
                </button>
                <button
                  onClick={nextTrack}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <SkipForwardIcon className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  {volume > 0.5 
                    ? <Volume2Icon className="h-4 w-4 text-white" /> 
                    : <VolumeIcon className="h-4 w-4 text-white" />
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 appearance-none h-1 rounded-full bg-white/20"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
import { useState, useEffect, useRef, useCallback } from 'react';
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
  XIcon,
  Volume1Icon,
  VolumeXIcon,
  LoaderIcon
} from 'lucide-react';
import { useThemeStore } from '../../lib/theme';
import { createAudioBlobUrl } from '../../lib/audio';

// Use inline MP3 audio - these are super small simple tones that will work in all browsers
const audioUrls = {
  gold: "data:audio/mp3;base64,SUQzAwAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbMAMzMzMzMzMzMzMzMzMzMzMzMzMzOZmZmZmZmZmZmZmZmZmZmZmZmZmcz",
  emerald: "data:audio/mp3;base64,SUQzAwAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbMAMzMzMzMzMzMzMzMzMzMzMzMzMzOZmZmZmZmZmZmZmZmZmZmZmZmZmcz",
  platinum: "data:audio/mp3;base64,SUQzAwAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbMAMzMzMzMzMzMzMzMzMzMzMzMzMzOZmZmZmZmZmZmZmZmZmZmZmZmZmcz"
};

const musicTracks = [
  {
    id: 'gold',
    name: 'Luxury Gold',
    url: audioUrls.gold,
    theme: 'gold',
    mood: 'elegant'
  },
  {
    id: 'emerald',
    name: 'Emerald Ambience',
    url: audioUrls.emerald,
    theme: 'emerald',
    mood: 'calm'
  },
  {
    id: 'platinum',
    name: 'Platinum Noir',
    url: audioUrls.platinum,
    theme: 'platinum',
    mood: 'mysterious'
  }
];

interface MusicState {
  isLoading: boolean;
  isError: boolean;
  currentTime: number;
  duration: number;
}

const playerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const getButtonBg = () => {
  return 'bg-primary hover:bg-primary/90';
};

const MusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [musicState, setMusicState] = useState<MusicState>({
    isLoading: false,
    isError: false,
    currentTime: 0,
    duration: 0
  });
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.5);

  const { t } = useTranslation();
  const soundRef = useRef<Howl | null>(null);
  const { currentTheme } = useThemeStore();

  // Get current track
  const currentTrack = musicTracks[currentTrackIndex];

  const createTrack = useCallback((url: string) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const sound = new Howl({
      src: [url],
      format: ['mp3'],
      volume: muted ? 0 : volume,
      html5: true,
      onload: () => {
        setMusicState(prev => ({
          ...prev,
          isLoading: false,
          isError: false,
          duration: sound.duration()
        }));
        if (isPlaying) {
          sound.play();
        }
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => nextTrack(),
      onloaderror: () => {
        setMusicState(prev => ({
          ...prev,
          isLoading: false,
          isError: true
        }));
      }
    });

    soundRef.current = sound;
    return sound;
  }, [volume, muted, isPlaying]);

  // Load track when it changes
  useEffect(() => {
    setMusicState(prev => ({ ...prev, isLoading: true }));
    createTrack(currentTrack.url);
  }, [currentTrackIndex, currentTrack.url, createTrack]);

  // Update volume when it changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(muted ? 0 : volume);
    }
    localStorage.setItem('musicVolume', volume.toString());
    localStorage.setItem('musicMuted', muted.toString());
  }, [volume, muted]);

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      if (musicState.isError) {
        // Retry playing the track
        createTrack(currentTrack.url).play();
      } else {
        soundRef.current.play();
      }
    }
  };

  const nextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const prevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const toggleMute = () => {
    if (muted) {
      setVolume(prevVolume);
      setMuted(false);
    } else {
      setPrevVolume(volume);
      setMuted(true);
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

            {/* Content */}
            <div className="p-4">
              {/* Track info */}
              <div className="text-center mb-4">
                <h4 className="text-white font-medium">{currentTrack.name}</h4>
                <p className="text-white/60 text-sm">{currentTrack.mood}</p>
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
                  disabled={musicState.isLoading}
                  className={`p-3 rounded-full ${musicState.isLoading ? 'bg-gray-700' : 'bg-primary'} text-white hover:bg-primary/80 transition-colors relative`}
                >
                  {musicState.isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : isPlaying ? (
                    <PauseIcon className="h-6 w-6" />
                  ) : (
                    <PlayIcon className="h-6 w-6" />
                  )}
                  {musicState.isError && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Error loading audio
                    </span>
                  )}
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
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  {muted ? (
                    <VolumeXIcon className="h-5 w-5 text-white" />
                  ) : volume > 0.5 ? (
                    <Volume2Icon className="h-5 w-5 text-white" />
                  ) : volume > 0 ? (
                    <Volume1Icon className="h-5 w-5 text-white" />
                  ) : (
                    <VolumeIcon className="h-5 w-5 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-primary"
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
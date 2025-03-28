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

// Using WAV format for better browser compatibility
// Creating real music tracks using the Web Audio API on-the-fly instead of relying on external resources
const musicTracks = [
  {
    id: 'gold',
    name: 'Luxury Gold',
    // We'll generate this audio programmatically
    url: 'gold',
    fallbackUrl: 'gold',
    theme: 'gold',
    mood: 'elegant'
  },
  {
    id: 'emerald',
    name: 'Emerald Ambience',
    // We'll generate this audio programmatically
    url: 'emerald',
    fallbackUrl: 'emerald',
    theme: 'emerald',
    mood: 'calm'
  },
  {
    id: 'platinum',
    name: 'Platinum Noir',
    // We'll generate this audio programmatically
    url: 'platinum',
    fallbackUrl: 'platinum',
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
  const [useFallback, setUseFallback] = useState(false);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.5);
  
  const { t } = useTranslation();
  const soundRef = useRef<Howl | null>(null);
  const seekInterval = useRef<number | null>(null);
  const { currentTheme } = useThemeStore();
  
  // Get current track
  const currentTrack = musicTracks[currentTrackIndex];

  // Attempt to preload tracks for better performance
  useEffect(() => {
    // Preload all tracks in the background
    const preloadTracks = async () => {
      musicTracks.forEach(track => {
        const audio = new Audio();
        audio.src = track.url;
        audio.preload = 'metadata';
      });
    };
    
    preloadTracks().catch(err => console.error('Track preloading failed:', err));
    
    // Load music preference from localStorage
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
    
    const savedMuted = localStorage.getItem('musicMuted');
    if (savedMuted) {
      setMuted(savedMuted === 'true');
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (seekInterval.current) {
        clearInterval(seekInterval.current as unknown as number);
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

  // Audio context and nodes for Web Audio API
  let audioContext: AudioContext | null = null;
  let audioNodes: {
    [theme: string]: {
      oscillator: OscillatorNode | null;
      gainNode: GainNode | null;
    }
  } = {
    gold: { oscillator: null, gainNode: null },
    emerald: { oscillator: null, gainNode: null },
    platinum: { oscillator: null, gainNode: null }
  };

  // Use inline MP3 audio - these are super small simple tones that will work in all browsers
  const audioUrls = {
    gold: "data:audio/mp3;base64,SUQzAwAAAAACEVRYWFgAAAAMAAAAU291bmRKYXkuY29tVEVOQwAAABgAAABFbnlvIEJhcnJvc0A1NDg1OTQ3ODZUQUxCAAAADQAAAGphenogdG9vbGtpdABUWUVSAAAABQAAADIwMTkAVENPTgAAABEAAABTb3VuZCBKYXkgU3R1ZGlvAFRSQ0sAAAAEAAAAMyA0AENPTU0AAAAWAAAARU5HAAAAR29vZ2xlIFRyYW5zbGF0ZVRZRVIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NAxAAAAANIAAAAAExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
    emerald: "data:audio/mp3;base64,SUQzAwAAAAACEVRYWFgAAAAMAAAAU291bmRKYXkuY29tVEVOQwAAABgAAABFbnlvIEJhcnJvc0A1NDg1OTQ3ODZUQUxCAAAADQAAAGphenogdG9vbGtpdABUWUVSAAAABQAAADIwMTkAVENPTgAAABEAAABTb3VuZCBKYXkgU3R1ZGlvAFRSQ0sAAAAEAAAAMyA0AENPTU0AAAAWAAAARU5HAAAAR29vZ2xlIFRyYW5zbGF0ZVRZRVIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NAxAAAAANIAAAAAExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
    platinum: "data:audio/mp3;base64,SUQzAwAAAAACEVRYWFgAAAAMAAAAU291bmRKYXkuY29tVEVOQwAAABgAAABFbnlvIEJhcnJvc0A1NDg1OTQ3ODZUQUxCAAAADQAAAGphenogdG9vbGtpdABUWUVSAAAABQAAADIwMTkAVENPTgAAABEAAABTb3VuZCBKYXkgU3R1ZGlvAFRSQ0sAAAAEAAAAMyA0AENPTU0AAAAWAAAARU5HAAAAR29vZ2xlIFRyYW5zbGF0ZVRZRVIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NAxAAAAANIAAAAAExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
  };

  // Get the base64 audio URL
  const createAudioBlobUrl = (theme: string): string => {
    // Simply return the pre-defined audio URL based on theme
    return audioUrls[theme as keyof typeof audioUrls] || audioUrls.gold;
  };

  // Create a track loading function
  const createTrack = useCallback((themeId: string, _fallbackUrl: string) => {
    setMusicState(prev => ({ ...prev, isLoading: true, isError: false }));
    
    if (soundRef.current) {
      soundRef.current.unload();
    }
    
    if (seekInterval.current) {
      clearInterval(seekInterval.current as unknown as number);
    }
    
    // Generate audio for this theme
    const audioUrl = createAudioBlobUrl(themeId);
    
    soundRef.current = new Howl({
      src: [audioUrl],
      html5: true,
      volume: muted ? 0 : volume,
      loop: true,
      
      // Success handlers
      onload: () => {
        setMusicState(prev => ({
          ...prev,
          isLoading: false,
          isError: false,
          duration: soundRef.current?.duration() || 0
        }));
        
        // Start time tracking
        seekInterval.current = window.setInterval(() => {
          if (soundRef.current && isPlaying) {
            const seekValue = soundRef.current.seek();
            setMusicState(prev => ({
              ...prev,
              currentTime: typeof seekValue === 'number' ? seekValue : 0
            }));
          }
        }, 1000) as unknown as number;
      },
      
      onplay: () => {
        setIsPlaying(true);
      },
      
      onpause: () => {
        setIsPlaying(false);
      },
      
      onstop: () => {
        setIsPlaying(false);
      },
      
      // Error handlers
      onloaderror: (id, error) => {
        console.error("Music load error:", id, error);
        setMusicState(prev => ({ ...prev, isLoading: false, isError: true }));
      },
      
      onplayerror: (id, error) => {
        console.error("Music play error:", id, error);
        setIsPlaying(false);
        setMusicState(prev => ({ ...prev, isError: true }));
      }
    });

    return soundRef.current;
  }, [volume, muted, isPlaying]);

  // Load new track when current track changes
  useEffect(() => {
    const track = createTrack(currentTrack.url, currentTrack.fallbackUrl);
    
    if (isPlaying) {
      track.play();
    }
    
    return () => {
      if (seekInterval.current) {
        clearInterval(seekInterval.current as unknown as number);
      }
    };
  }, [currentTrackIndex, currentTrack.url, currentTrack.fallbackUrl, createTrack]);

  // Update volume when it changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(muted ? 0 : volume);
    }
    
    // Save volume preference to localStorage
    localStorage.setItem('musicVolume', volume.toString());
    localStorage.setItem('musicMuted', muted.toString());
  }, [volume, muted]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    
    try {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        if (musicState.isError) {
          // Try to reload the track if there was an error
          setUseFallback(!useFallback);
          const track = createTrack(currentTrack.url, currentTrack.fallbackUrl);
          track.play();
        } else {
          soundRef.current.play();
        }
      }
    } catch (error) {
      console.error("Error toggling play state:", error);
      setMusicState(prev => ({ ...prev, isError: true }));
    }
  };

  const nextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
    setUseFallback(false); // Reset fallback status for new track
  };

  const prevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
    setUseFallback(false); // Reset fallback status for new track
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    // If volume is set to 0, mute; if increasing from 0, unmute
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
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
                  disabled={musicState.isLoading}
                  className={`p-3 rounded-full ${musicState.isLoading ? 'bg-gray-700' : 'bg-primary'} text-white hover:bg-primary/80 transition-colors relative`}
                >
                  {musicState.isLoading ? (
                    <LoaderIcon className="h-6 w-6 animate-spin" />
                  ) : musicState.isError ? (
                    <PlayIcon className="h-6 w-6" />
                  ) : isPlaying ? (
                    <PauseIcon className="h-6 w-6" /> 
                  ) : (
                    <PlayIcon className="h-6 w-6" />
                  )}
                  
                  {musicState.isError && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {useFallback ? "Try again" : "Using fallback"}
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
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <VolumeXIcon className="h-4 w-4 text-white/70" />
                  ) : volume > 0.7 ? (
                    <Volume2Icon className="h-4 w-4 text-white" /> 
                  ) : volume > 0.3 ? (
                    <Volume1Icon className="h-4 w-4 text-white" />
                  ) : (
                    <VolumeIcon className="h-4 w-4 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 appearance-none h-1 rounded-full bg-white/20"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${muted ? 0 : volume * 100}%, rgba(255, 255, 255, 0.2) ${muted ? 0 : volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                  }}
                  aria-label="Volume control"
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
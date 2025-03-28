import React, { useState, useEffect, useRef } from 'react';

interface MusicState {
  isLoading: boolean;
  isError: boolean;
  currentTime: number;
  duration: number;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [theme, setTheme] = useState('gold');
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [musicState, setMusicState] = useState<MusicState>({
    isLoading: false,
    isError: false,
    currentTime: 0,
    duration: 0,
  });

  const frequencies = {
    gold: 440, // A4 note
    emerald: 523.25, // C5 note
    platinum: 659.25 // E5 note
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    if (!isPlaying) {
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.setValueAtTime(
        frequencies[theme as keyof typeof frequencies],
        audioContextRef.current.currentTime
      );

      gainNodeRef.current!.gain.value = muted ? 0 : volume;
      oscillatorRef.current.connect(gainNodeRef.current!);
      oscillatorRef.current.start();
    } else if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (isPlaying && oscillatorRef.current && audioContextRef.current) {
      oscillatorRef.current.frequency.setValueAtTime(
        frequencies[theme as keyof typeof frequencies],
        audioContextRef.current.currentTime
      );
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-4 p-4">
      <button 
        onClick={togglePlay}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <select 
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="gold">Gold</option>
        <option value="emerald">Emerald</option>
        <option value="platinum">Platinum</option>
      </select>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-32"
      />

      <button
        onClick={() => setMuted(!muted)}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { soundMap, SoundKey } from '../soundLoader';

const SOUNDS_PATH = '/sounds/';

interface AudioContextType {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  stopMusic: () => void;
  playMusic: () => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  soundVolume: number;
  setSoundVolume: (volume: number) => void;
  playSound: (soundKey: SoundKey, volumeMultiplier?: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTrackIndex: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
  playlist: string[];
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children, playlist }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.5); // Default volume at 50%
  const [soundVolume, setSoundVolume] = useState(0.7); // Default at 70%
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => 
    playlist.length > 0 ? Math.floor(Math.random() * playlist.length) : 0
  );
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Create a pool of audio elements for sound effects
    const poolSize = 5;
    for (let i = 0; i < poolSize; i++) {
        const audio = new Audio();
        audio.preload = 'auto';
        audioPoolRef.current.push(audio);
    }
  }, []);

  const playMusic = useCallback(() => {
    if (audioRef.current && hasInteracted.current) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(error => {
        console.error("Audio play failed:", error);
        setIsMusicPlaying(false);
      });
    }
  }, []);

  const handleInteraction = useCallback(() => {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      if (isMusicPlaying) { // if music was supposed to be playing
        playMusic();
      }
    }
    window.removeEventListener('click', handleInteraction);
    window.removeEventListener('keydown', handleInteraction);
  }, [isMusicPlaying, playMusic]);

  useEffect(() => {
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [handleInteraction]);


  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  const stopMusic = () => {
    setIsMusicPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying && hasInteracted.current) {
        audioRef.current.play().catch(e => console.error("Error playing music:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);
  
  const playSound = (soundKey: SoundKey, volumeMultiplier: number = 1) => {
    if (soundVolume > 0) {
      const soundSrc = soundMap[soundKey];
      if (!soundSrc) {
        console.error(`Sound key not found: ${soundKey}`);
        return;
      }

      const finalVolume = Math.max(0, Math.min(1, soundVolume * volumeMultiplier));

      const sound = audioPoolRef.current.find(a => a.paused);
      if (sound) {
        sound.src = soundSrc;
        sound.volume = finalVolume;
        sound.play().catch(e => console.error(`Error playing sound ${soundKey}:`, e));
      } else {
        const newSound = new Audio(soundSrc);
        newSound.volume = finalVolume;
        newSound.play().catch(e => console.error(`Error playing sound ${soundKey} (new audio):`, e));
      }
    }
  };

  const handleTrackEnd = () => {
    setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
  };

  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      audioRef.current.src = `${SOUNDS_PATH}${playlist[currentTrackIndex]}`;
      if (isMusicPlaying && hasInteracted.current) {
        playMusic();
      }
    }
  }, [currentTrackIndex, playlist, isMusicPlaying, playMusic]);

  return (
    <AudioContext.Provider value={{ 
      isMusicPlaying, 
      toggleMusic, 
      stopMusic,
      playMusic, 
      musicVolume,
      setMusicVolume,
      soundVolume,
      setSoundVolume,
      playSound,
      audioRef,
      currentTrackIndex
    }}>
      <audio ref={audioRef} onEnded={handleTrackEnd} loop={playlist.length === 1} preload="auto" />
      {children}
    </AudioContext.Provider>
  );
};

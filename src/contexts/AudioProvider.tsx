import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const SOUNDS_PATH = '/sounds/';

interface AudioContextType {
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  playMusic: () => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundFile: string) => void;
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
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const soundRef = useRef<HTMLAudioElement>(null);
  const hasInteracted = useRef(false);

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

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };
  
  const playSound = (soundFile: string) => {
    if (isSoundEnabled && soundRef.current) {
      soundRef.current.src = `${SOUNDS_PATH}${soundFile}`;
      soundRef.current.play().catch(e => console.error("Error playing sound:", e));
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
      playMusic, 
      musicVolume,
      setMusicVolume,
      isSoundEnabled, 
      toggleSound, 
      playSound,
      audioRef,
      currentTrackIndex
    }}>
      <audio ref={audioRef} onEnded={handleTrackEnd} loop={playlist.length === 1} preload="auto" />
      <audio ref={soundRef} preload="auto" />
      {children}
    </AudioContext.Provider>
  );
};

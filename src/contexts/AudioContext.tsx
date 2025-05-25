import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { AUDIO_CONFIG, setupAudioLoop, loadAudioWithFallbacks } from "@/utils/audioUtils";

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  currentTrack: string | null;
  duration: number;
  currentTime: number;
  isLoading: boolean;
  error: string | null;
  audioData: Uint8Array | null;
  analyser: AnalyserNode | null;
  isLooping: boolean;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  loadTrack: (url?: string) => Promise<void>;
  seek: (time: number) => void;
  setIsLooping: (loop: boolean) => void;
  retryLoad: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({
  children,
}: AudioProviderProps): React.ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(AUDIO_CONFIG.DEFAULT_VOLUME);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isLooping, setIsLoopingState] = useState<boolean>(AUDIO_CONFIG.DEFAULT_LOOP);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const gainNodeRef = useRef<GainNode | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize audio context and analyser
  const initializeAudioContext = useCallback(async () => {
    try {
      if (!audioRef.current) {
        console.error("Audio element not available for context initialization");
        return;
      }

      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
          throw new Error("Web Audio API not supported");
        }

        audioContextRef.current = new AudioContextClass();
        console.log("Audio context created");
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
        console.log("Audio context resumed");
      }

      // Only create source if it doesn't exist and we have both audio element and context
      if (!sourceRef.current && audioRef.current && audioContextRef.current) {
        try {
          sourceRef.current = audioContextRef.current.createMediaElementSource(
            audioRef.current
          );

          gainNodeRef.current = audioContextRef.current.createGain();
          gainNodeRef.current.gain.value = volume;

          const analyserNode = audioContextRef.current.createAnalyser();
          analyserNode.fftSize = AUDIO_CONFIG.ANALYSER_CONFIG.fftSize;
          analyserNode.smoothingTimeConstant =
            AUDIO_CONFIG.ANALYSER_CONFIG.smoothingTimeConstant;

          // Connect the audio graph
          sourceRef.current.connect(gainNodeRef.current);
          gainNodeRef.current.connect(analyserNode);
          analyserNode.connect(audioContextRef.current.destination);

          setAnalyser(analyserNode);
          console.log("Audio graph connected successfully");
        } catch (sourceError) {
          console.error("Failed to create audio source:", sourceError);
          // Reset refs if source creation fails
          sourceRef.current = null;
          gainNodeRef.current = null;
          throw sourceError;
        }
      }
    } catch (err) {
      console.error("Failed to initialize audio context:", err);
      setError("Audio initialization failed. Please try again.");
    }
  }, [volume]);

  // Update audio data for visualization
  const updateAudioData = useCallback(() => {
    if (analyser && isPlaying) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      setAudioData(dataArray);
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    }
  }, [analyser, isPlaying]);

  // Set loop state
  const setIsLooping = useCallback((loop: boolean) => {
    setIsLoopingState(loop);
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, []);

  // Load track with improved error handling
  const loadTrack = useCallback(
    async (url?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!audioRef.current) {
          throw new Error("Audio element not initialized");
        }

        let audioUrl: string;

        if (url) {
          audioUrl = url.startsWith("/") ? url : `/${url}`;
        } else {
          console.log("Loading audio with fallbacks...");
          audioUrl = await loadAudioWithFallbacks();
        }

        console.log(`Attempting to load audio: ${audioUrl}`);

        const loadPromise = new Promise<void>((resolve, reject) => {
          const audio = audioRef.current!;
          let timeoutId: NodeJS.Timeout = setTimeout(() => {}, 0);

          const cleanup = () => {
            clearTimeout(timeoutId);
            audio.removeEventListener("canplaythrough", handleLoaded);
            audio.removeEventListener("error", handleError);
            audio.removeEventListener("loadeddata", handleLoaded);
          };

          const handleLoaded = () => {
            cleanup();
            setupAudioLoop(audio, isLooping);
            setCurrentTrack(audioUrl);
            console.log(`Audio loaded successfully: ${audioUrl}`);
            resolve();
          };

          const handleError = (e: Event) => {
            cleanup();
            const target = e.target as HTMLAudioElement;
            let errorMsg = `Failed to load audio: ${audioUrl}`;

            if (target.error) {
              switch (target.error.code) {
                case target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  errorMsg = `Audio format not supported: ${audioUrl}`;
                  break;
                case target.error.MEDIA_ERR_NETWORK:
                  errorMsg = `Network error loading: ${audioUrl}`;
                  break;
                case target.error.MEDIA_ERR_DECODE:
                  errorMsg = `Audio decoding error: ${audioUrl}`;
                  break;
                default:
                  errorMsg = `Error loading audio: ${audioUrl}`;
              }
            }

            console.error("Audio load error:", errorMsg);
            reject(new Error(errorMsg));
          };

          // Set timeout for loading
          timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error(`Audio loading timeout: ${audioUrl}`));
          }, AUDIO_CONFIG.LOADING_TIMEOUT);

          audio.addEventListener("canplaythrough", handleLoaded);
          audio.addEventListener("loadeddata", handleLoaded);
          audio.addEventListener("error", handleError);

          // Clear previous source and load new one
          audio.src = "";
          audio.src = audioUrl;
          audio.load();
        });

        await loadPromise;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load track";
        console.error("Error loading track:", err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLooping]
  );

  // Retry loading function
  const retryLoad = useCallback(async () => {
    console.log("Retrying audio load...");
    setError(null);
    await loadTrack();
  }, [loadTrack]);

  // Play audio with user interaction requirement
  const play = useCallback(async () => {
    try {
      if (!audioRef.current) {
        throw new Error("Audio not loaded");
      }

      if (
        !audioRef.current.src ||
        audioRef.current.src === window.location.href
      ) {
        console.log("No audio source, attempting to load...");
        await loadTrack();
      }

      setError(null);

      // Initialize audio context on first play (user interaction required)
      await initializeAudioContext();

      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume();
      }

      // Ensure looping is set before playing
      audioRef.current.loop = isLooping;

      await audioRef.current.play();
      setIsPlaying(true);
      updateAudioData();
      console.log("Audio playback started");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to play audio";
      setError(`Playback failed: ${errorMessage}`);
      console.error("Error playing audio:", err);
      setIsPlaying(false);
    }
  }, [initializeAudioContext, updateAudioData, isLooping, loadTrack]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      console.log("Audio paused");
    }
  }, []);

  // Stop audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      console.log("Audio stopped");
    }
  }, []);

  // Set volume with gain node
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);

    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = clampedVolume;
    }
  }, []);

  // Seek to time
  const seek = useCallback(
    (time: number) => {
      if (audioRef.current && duration > 0) {
        const clampedTime = Math.max(0, Math.min(duration, time));
        audioRef.current.currentTime = clampedTime;
        setCurrentTime(clampedTime);
      }
    },
    [duration]
  );

  // Initialize audio element
  useEffect(() => {
    if (isInitializedRef.current) return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume;
    audio.crossOrigin = "anonymous";
    audio.loop = isLooping;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setError(null);
      console.log("Audio metadata loaded, duration:", audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
        setCurrentTime(0);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        console.log("Audio ended");
      }
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const error = target.error;
      let errorMessage = "Audio playback error";

      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = "Audio loading was aborted";
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = "Network error while loading audio";
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = "Audio decoding error";
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio format not supported";
            break;
        }
      }

      console.error("Audio error:", errorMessage, error);
      setError(errorMessage);
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      console.log("Audio loading started");
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio can play");
    };

    const handlePlay = () => {
      setIsPlaying(true);
      updateAudioData();
      console.log("Audio play event fired");
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      console.log("Audio pause event fired");
    };

    // Add event listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    audioRef.current = audio;
    isInitializedRef.current = true;

    // Auto-load the default track
    loadTrack().catch((err) => {
      console.error("Failed to auto-load audio:", err);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audio.src = "";
    };
  }, [volume, loadTrack, isLooping, updateAudioData]);

  // Update loop when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (e) {
          console.warn("Error disconnecting audio source:", e);
        }
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current
          .close()
          .catch((e) => console.warn("Error closing audio context:", e));
      }
    };
  }, []);

  const value: AudioContextType = {
    isPlaying,
    volume,
    currentTrack,
    duration,
    currentTime,
    isLoading,
    error,
    audioData,
    analyser,
    isLooping,
    play,
    pause,
    stop,
    setVolume,
    loadTrack,
    seek,
    setIsLooping,
    retryLoad,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}


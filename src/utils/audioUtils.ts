export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 0.3,
  DEFAULT_TRACK: "/audio/background-music.mp3",
  FALLBACK_TRACKS: [
    "/audio/background-music.mp3",
    "/audio/background-music.wav",
    "/audio/background-music.ogg",
    // Remove external URLs that cause CORS issues
  ],
  SUPPORTED_FORMATS: ["mp3", "wav", "ogg", "m4a"],
  LOADING_TIMEOUT: 15000, // Increased timeout
  DEFAULT_LOOP: true,
  ANALYSER_CONFIG: {
    fftSize: 256,
    smoothingTimeConstant: 0.8,
  },
} as const;

export function validateAudioUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    const extension = urlObj.pathname.split(".").pop()?.toLowerCase();
    return extension
      ? AUDIO_CONFIG.SUPPORTED_FORMATS.includes(
          extension as (typeof AUDIO_CONFIG.SUPPORTED_FORMATS)[number]
        )
      : false;
  } catch {
    return false;
  }
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getAudioErrorMessage(error: MediaError | null): string {
  if (!error) return "Unknown audio error";

  switch (error.code) {
    case error.MEDIA_ERR_ABORTED:
      return "Audio loading was aborted";
    case error.MEDIA_ERR_NETWORK:
      return "Network error while loading audio";
    case error.MEDIA_ERR_DECODE:
      return "Audio decoding error";
    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return "Audio format not supported";
    default:
      return "Unknown audio error";
  }
}

export async function checkAudioSupport(): Promise<boolean> {
  try {
    const audio = new Audio();
    return !!(
      audio.canPlayType &&
      (audio.canPlayType("audio/mpeg") ||
        audio.canPlayType("audio/wav") ||
        audio.canPlayType("audio/ogg"))
    );
  } catch {
    return false;
  }
}

// Improved audio file checking
export async function checkAudioFileExists(url: string): Promise<boolean> {
  try {
    // For local files, try a simple fetch
    if (url.startsWith("/")) {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    }

    // For external URLs, use audio element test
    return new Promise((resolve) => {
      const audio = new Audio();
      const timeout = setTimeout(() => {
        audio.src = "";
        resolve(false);
      }, 5000);

      const cleanup = () => {
        clearTimeout(timeout);
        audio.removeEventListener("canplaythrough", onSuccess);
        audio.removeEventListener("error", onError);
        audio.removeEventListener("loadeddata", onSuccess);
      };

      const onSuccess = () => {
        cleanup();
        resolve(true);
      };

      const onError = () => {
        cleanup();
        resolve(false);
      };

      audio.addEventListener("canplaythrough", onSuccess);
      audio.addEventListener("loadeddata", onSuccess);
      audio.addEventListener("error", onError);
      audio.src = url;
    });
  } catch {
    return false;
  }
}

// Simplified fallback loading
export async function loadAudioWithFallbacks(
  sources: readonly string[] = AUDIO_CONFIG.FALLBACK_TRACKS
): Promise<string> {
  console.log("Starting audio fallback loading...");

  for (const source of sources) {
    try {
      console.log(`Checking audio source: ${source}`);

      const exists = await checkAudioFileExists(source);
      if (exists) {
        console.log(`Audio source verified: ${source}`);
        return source;
      } else {
        console.log(`Audio source not accessible: ${source}`);
      }
    } catch (err) {
      console.log(`Failed to check ${source}:`, err);
    }
  }

  // If no sources work, return the default and let the audio element handle the error
  console.warn("No audio sources verified, returning default");
  return AUDIO_CONFIG.DEFAULT_TRACK;
}

export function setupAudioLoop(
  audio: HTMLAudioElement,
  shouldLoop: boolean = true
): void {
  audio.loop = shouldLoop;
  console.log(`Audio loop ${shouldLoop ? "enabled" : "disabled"}`);
}

export function toggleAudioLoop(audio: HTMLAudioElement): boolean {
  audio.loop = !audio.loop;
  console.log(`Audio loop toggled to: ${audio.loop}`);
  return audio.loop;
}

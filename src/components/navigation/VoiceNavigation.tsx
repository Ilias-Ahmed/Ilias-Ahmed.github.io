import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { toast } from "sonner";

// Define proper types for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  grammars: SpeechGrammarList;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onnomatch:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
}
interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechGrammarList?: new () => SpeechGrammarList;
    webkitSpeechGrammarList?: new () => SpeechGrammarList;
  }
}

interface VoiceNavigationProps {
  className?: string;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  showTranscript?: boolean;
  autoStopTimeout?: number;
}

const VoiceNavigation: React.FC<VoiceNavigationProps> = ({
  className = "",
  position = "bottom-left",
  showTranscript = true,
  autoStopTimeout = 5000,
}) => {
  const { sections, navigateToSection, getSectionByKeyword } = useNavigation();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [lastCommand, setLastCommand] = useState<string>("");

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isProcessingRef = useRef<boolean>(false);

  // Process voice commands
  const processCommand = useCallback(
    (command: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      console.log("Processing voice command:", command);
      setLastCommand(command);

      try {
        // Enhanced command patterns
        const patterns = [
          // Navigation commands
          /(?:go to|navigate to|scroll to|show me|take me to)\s+(.+)/i,
          /(?:open|visit)\s+(.+)/i,
          // Direct section names
          /^(home|about|skills|projects|contact)$/i,
          // Alternative phrasings
          /(?:show|display)\s+(.+)(?:\s+section)?/i,
          // Numbered navigation
          /(?:go to\s+)?(?:section\s+)?(\d+)/i,
        ];

        let targetSection: string | null = null;

        // Try each pattern
        for (const pattern of patterns) {
          const match = command.match(pattern);
          if (match) {
            const input = match[1]?.toLowerCase().trim();

            if (input) {
              // Handle numbered navigation
              if (/^\d+$/.test(input)) {
                const num = parseInt(input);
                if (num >= 1 && num <= sections.length) {
                  targetSection = sections[num - 1].id;
                  break;
                }
              } else {
                // Find section by keyword or name
                const section = getSectionByKeyword(input);
                if (section) {
                  targetSection = section.id;
                  break;
                }

                // Direct section name matching
                const directMatch = sections.find(
                  (s) =>
                    s.name.toLowerCase() === input ||
                    s.id.toLowerCase() === input
                );
                if (directMatch) {
                  targetSection = directMatch.id;
                  break;
                }

                // Partial matching for flexibility
                const partialMatch = sections.find(
                  (s) =>
                    s.name.toLowerCase().includes(input) ||
                    s.id.toLowerCase().includes(input) ||
                    input.includes(s.name.toLowerCase()) ||
                    input.includes(s.id.toLowerCase())
                );
                if (partialMatch) {
                  targetSection = partialMatch.id;
                  break;
                }
              }
            }
          }
        }

        // Execute navigation
        if (targetSection) {
          navigateToSection(targetSection);
          const sectionName = sections.find(
            (s) => s.id === targetSection
          )?.name;
          toast.success(`Navigating to ${sectionName}`, {
            description: `Voice command: "${command}"`,
          });
        } else {
          // Provide helpful feedback
          const availableSections = sections.map((s) => s.name).join(", ");
          toast.error("Command not recognized", {
            description: `Try saying "go to" followed by: ${availableSections}`,
          });
        }
      } catch (error) {
        console.error("Error processing voice command:", error);
        toast.error("Failed to process voice command");
      } finally {
        isProcessingRef.current = false;
      }
    },
    [sections, navigateToSection, getSectionByKeyword]
  );

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      try {
        const recognitionInstance = new SpeechRecognitionAPI();

        // Configure recognition
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";
        recognitionInstance.maxAlternatives = 3;

        // Setup event handlers
        recognitionInstance.onstart = () => {
          console.log("Voice recognition started");
          setIsListening(true);
          setTranscript("");
          setInterimTranscript("");
          setConfidence(0);
        };

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interim = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcriptText = result[0].transcript;

            if (result.isFinal) {
              finalTranscript += transcriptText;
              setConfidence(result[0].confidence);
            } else {
              interim += transcriptText;
            }
          }

          if (finalTranscript) {
            setTranscript(finalTranscript);
            setInterimTranscript("");
            processCommand(finalTranscript.trim().toLowerCase());
          } else {
            setInterimTranscript(interim);
          }
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error(
            "Speech recognition error:",
            event.error,
            event.message
          );

          let errorMessage = "Voice recognition error";
          switch (event.error) {
            case "no-speech":
              errorMessage = "No speech detected. Please try again.";
              break;
            case "audio-capture":
              errorMessage = "Microphone not available";
              break;
            case "not-allowed":
              errorMessage = "Microphone permission denied";
              break;
            case "network":
              errorMessage = "Network error occurred";
              break;
            default:
              errorMessage = `Recognition error: ${event.error}`;
          }

          toast.error(errorMessage);
          setIsListening(false);
          setInterimTranscript("");
        };

        recognitionInstance.onend = () => {
          console.log("Voice recognition ended");
          setIsListening(false);
          setInterimTranscript("");

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };

        setRecognition(recognitionInstance);
        setIsSupported(true);
      } catch (error) {
        console.error("Failed to initialize speech recognition:", error);
        setIsSupported(false);
      }
    } else {
      console.log("Speech Recognition not supported in this browser");
      setIsSupported(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [processCommand]);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (!recognition) {
      toast.error("Voice recognition not available");
      return;
    }

    if (isListening) {
      recognition.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      try {
        recognition.start();

        // Auto-stop after timeout
        timeoutRef.current = setTimeout(() => {
          if (isListening) {
            recognition.stop();
            toast.info("Voice recognition timed out");
          }
        }, autoStopTimeout);
      } catch (error) {
        console.error("Failed to start voice recognition:", error);
        toast.error("Failed to start voice recognition");
      }
    }
  }, [recognition, isListening, autoStopTimeout]);

  // Position classes
  const positionClasses = {
    "bottom-left": "bottom-8 left-8",
    "bottom-right": "bottom-8 right-8",
    "top-left": "top-8 left-8",
    "top-right": "top-8 right-8",
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Control Button */}
      <motion.button
        className={`fixed ${positionClasses[position]} z-40 p-4 rounded-full
          bg-background/80 backdrop-blur-sm border border-border shadow-lg
          hover:shadow-xl transition-all duration-300 group ${className}`}
        onClick={toggleListening}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? "Stop voice command" : "Start voice command"}
        disabled={!recognition}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="relative"
            >
              <Mic className="w-6 h-6 text-red-500" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <MicOff className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Transcript Display */}
      <AnimatePresence>
        {(isListening || transcript || interimTranscript) && showTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed ${
              position.includes("bottom") ? "bottom-24" : "top-24"
            }
              ${position.includes("left") ? "left-8" : "right-8"}
              max-w-sm z-50 p-4 bg-background/95 backdrop-blur-md
              border border-border rounded-lg shadow-xl`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Voice Command</span>
              {confidence > 0 && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(confidence * 100)}%
                </span>
              )}
            </div>

            <div className="space-y-1">
              {isListening && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-muted-foreground"
                >
                  Listening...
                </motion.div>
              )}

              {interimTranscript && (
                <div className="text-sm text-muted-foreground italic">
                  {interimTranscript}
                </div>
              )}

              {transcript && (
                <div className="text-sm font-medium">"{transcript}"</div>
              )}

              {lastCommand && lastCommand !== transcript && (
                <div className="text-xs text-muted-foreground pt-1 border-t">
                  Last: "{lastCommand}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Commands Tooltip */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`fixed ${
            position.includes("bottom") ? "bottom-32" : "top-32"
          }
            left-1/2 transform -translate-x-1/2 z-40 p-3
            bg-popover/95 backdrop-blur-md border border-border rounded-lg shadow-lg`}
        >
          <div className="text-xs text-center">
            <div className="font-medium mb-1">Try saying:</div>
            <div className="text-muted-foreground">
              "Go to projects" • "Show skills" • "Contact"
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};export default VoiceNavigation;

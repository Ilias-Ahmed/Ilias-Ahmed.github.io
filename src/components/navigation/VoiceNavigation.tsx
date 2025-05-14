import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { triggerHapticFeedback } from "@/utils/haptics";

// Define proper types for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: Event) => void;
}

const VoiceNavigation = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [showTooltip, setShowTooltip] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create a type safe reference to the speech recognition API
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        try {
          const recognitionInstance =
            new SpeechRecognitionAPI() as SpeechRecognition;

          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = false;
          recognitionInstance.lang = "en-US";

          recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            // Safely handle the results - check if there are any results
            if (event.results && event.results.length > 0) {
              const lastResultIndex = event.results.length - 1;
              const resultTranscript = event.results[
                lastResultIndex
              ][0].transcript
                .toLowerCase()
                .trim();

              if (resultTranscript) {
                setTranscript(resultTranscript);
                processCommand(resultTranscript);
              }
            }
          };

          recognitionInstance.onend = () => {
            setIsListening(false);
          };

          recognitionInstance.onerror = (event) => {
            console.error("Speech recognition error", event);
            setIsListening(false);
            toast.error("Speech recognition error. Please try again.");
          };

          setRecognition(recognitionInstance);
        } catch (error) {
          console.error("Error initializing speech recognition", error);
        }
      } else {
        console.log("Speech Recognition not supported in this browser");
      }
    }
  }, []);

  const processCommand = (command: string) => {
    // Add debugging
    console.log("Processing command:", command);

    const sections = ["home", "projects", "skills", "about", "contact"];
    let targetSection = "";

    // Enhanced command matching
    if (
      command.includes("go to") ||
      command.includes("scroll to") ||
      command.includes("navigate to")
    ) {
      for (const section of sections) {
        if (command.includes(section)) {
          targetSection = section;
          break;
        }
      }
    } else {
      // Direct section name matching
      for (const section of sections) {
        if (command === section) {
          targetSection = section;
          break;
        }
      }
    }

    // Add more flexible matching - partial matches
    if (!targetSection) {
      for (const section of sections) {
        // Check if the command contains any part of the section name
        if (command.includes(section.substring(0, 3))) {
          targetSection = section;
          break;
        }
      }
    }

    console.log("Target section identified:", targetSection || "none");

    if (targetSection) {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);

        // Add successful navigation feedback
        toast.success(`Navigating to ${targetSection}`);
      } else {
        console.log(`Element with ID '${targetSection}' not found`);
        toast.error(`Section '${targetSection}' not found`);
      }
    } else {
      toast.error("Command not recognized. Try saying 'go to projects'");
    }
  };

  const toggleListening = () => {
    if (recognition) {
      if (!isListening) {
        try {
          recognition.start();
          setIsListening(true);
          toast.info("Listening... Say 'go to [section]'");
        } catch (error) {
          console.error("Error starting recognition", error);
          toast.error("Error starting voice recognition");
        }
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } else {
      toast.error("Speech recognition is not supported in this browser.");
    }
  };

  const isSpeechSupported =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition);

  if (!isSpeechSupported) {
    return null;
  }

  return (
    <>
      <motion.button
        className="fixed bottom-8 left-8 z-40 p-3 rounded-full bg-cyberpunk-dark/70 border border-cyberpunk-pink hover:bg-cyberpunk-dark interactive shadow-lg shadow-cyberpunk-pink/20 backdrop-blur-sm"
        onClick={() => {
          toggleListening();
          triggerHapticFeedback();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isListening ? "Stop listening" : "Start voice command"}
      >
        {isListening ? (
          <Mic className="w-5 h-5 text-cyberpunk-pink animate-pulse" />
        ) : (
          <MicOff className="w-5 h-5 text-cyberpunk-pink/70" />
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            className="fixed bottom-24 left-24 z-40 py-2 px-4 bg-cyberpunk-dark/90 border border-cyberpunk-pink rounded-md shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <p className="text-sm text-white">
              Listening... Say "go to [section]"
            </p>
            <p className="text-xs text-cyberpunk-pink">
              Available sections: home, projects, skills, about, contact
            </p>
          </motion.div>
        )}

        {showTooltip && transcript && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 py-2 px-4 bg-cyberpunk-dark/90 border border-cyberpunk-pink rounded-md shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-sm text-white">Command: "{transcript}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceNavigation;

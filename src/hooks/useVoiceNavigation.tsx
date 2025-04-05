import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "sonner";

interface VoiceNavigationOptions {
  enabled?: boolean;
  commandFeedback?: boolean;
  routes?: Record<string, string>;
}

export const useVoiceNavigation = ({
  enabled = true,
  commandFeedback = true,
  routes = {
    home: "/",
    about: "/about",
    skills: "/skills",
    projects: "/projects",
    contact: "/contact",
  },
}: VoiceNavigationOptions = {}) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  // Define commands for navigation
  const commands = Object.entries(routes).map(([name, path]) => ({
    command: [
      `go to ${name}`,
      `show ${name}`,
      `open ${name}`,
      `navigate to ${name}`,
    ],
    callback: () => {
      if (commandFeedback) {
        toast.success(`Navigating to ${name}`);
      }
      navigate(path);
    },
    matchInterim: false,
  }));

  // Add additional utility commands
  const utilityCommands = [
    {
      command: ["start listening", "enable voice", "listen to me"],
      callback: () => {
        setIsListening(true);
        if (commandFeedback) {
          toast.success("Voice navigation activated");
        }
      },
      matchInterim: false,
    },
    {
      command: ["stop listening", "disable voice", "stop voice"],
      callback: () => {
        setIsListening(false);
        if (commandFeedback) {
          toast.success("Voice navigation deactivated");
        }
      },
      matchInterim: false,
    },
    {
      command: ["what can I say", "help", "show commands", "voice commands"],
      callback: () => {
        if (commandFeedback) {
          toast.info(
            <div className="space-y-2">
              <p className="font-bold">Available voice commands:</p>
              <ul className="list-disc pl-4">
                <li>Go to [page name]</li>
                <li>Show [page name]</li>
                <li>Start/Stop listening</li>
              </ul>
            </div>,
            { duration: 5000 }
          );
        }
      },
      matchInterim: false,
    },
  ];

  // Combine all commands
  const allCommands = [...commands, ...utilityCommands];

  // Set up speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands: allCommands });

  // Check if browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setVoiceSupported(false);
      if (commandFeedback) {
        toast.error("Your browser does not support voice recognition");
      }
    }
  }, [browserSupportsSpeechRecognition, commandFeedback]);

  // Start/stop listening based on isListening state
  useEffect(() => {
    if (!voiceSupported || !enabled) return;

    if (isListening && !listening) {
      SpeechRecognition.startListening({ continuous: true });
    } else if (!isListening && listening) {
      SpeechRecognition.stopListening();
    }

    // Clean up on unmount
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [isListening, listening, voiceSupported, enabled]);

  // Toggle listening state
  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  return {
    isListening,
    toggleListening,
    transcript,
    resetTranscript,
    voiceSupported,
  };
};

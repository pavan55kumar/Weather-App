import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Loader2 } from "lucide-react";
import { searchCitiesByName } from "../services/api";
import { useWeather } from "../context/WeatherContext";
import { globeTargetRotation } from "../globe/GlobeControls";
import { latLonToQuaternion } from "../globe/utils";
import { cameraTarget, FOCUSED_DISTANCE } from "../globe/CameraController";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// Strips common trigger phrases so "Hey AeroSky, what's the weather in
// Tokyo" becomes just "Tokyo" before we geocode it.
function extractCityFromTranscript(rawText) {
  return rawText
    .toLowerCase()
    .replace(/^(hey|ok|okay)\s+aerosky[,.]?\s*/i, "")
    .replace(/^(what'?s|what is|show me|tell me|search for|find|go to|navigate to|get)\s*/i, "")
    .replace(/^the\s+weather\s*/i, "")
    .replace(/^(in|for|at)\s+/i, "")
    .replace(/[?.!]+$/, "")
    .trim();
}

export default function VoiceSearchButton() {
  const [isListening, setIsListening] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const recognitionRef = useRef(null);
  const buttonWrapperRef = useRef(null);
  const [bubbleRect, setBubbleRect] = useState(null);

  const { loadDashboardTelemetry, addGlobeMarker, setSelectedMarker } = useWeather();

  useEffect(() => {
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage("Listening...");
      setTranscript("");
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        handleVoiceQuery(text);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error("SpeechRecognition error:", event.error, event.message);

      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setStatusMessage("Microphone access denied.");
      } else if (event.error === "no-speech") {
        setStatusMessage("Didn't catch that — try again.");
      } else if (event.error === "audio-capture") {
        setStatusMessage("No microphone found.");
      } else if (event.error === "network") {
        setStatusMessage("Network error — check your connection.");
      } else if (event.error === "aborted") {
        setStatusMessage("Voice search cancelled.");
      } else {
        setStatusMessage(`Voice search error: ${event.error}`);
      }
      setTimeout(() => setStatusMessage(""), 3500);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVoiceQuery = async (rawText) => {
    const cityQuery = extractCityFromTranscript(rawText);

    if (!cityQuery) {
      setStatusMessage("Didn't catch a city name — try again.");
      setTimeout(() => setStatusMessage(""), 2500);
      return;
    }

    setIsResolving(true);
    setStatusMessage(`Searching for "${cityQuery}"...`);

    try {
      const data = await searchCitiesByName(cityQuery);
      const match = data.results?.[0];

      if (!match) {
        setStatusMessage(`Couldn't find "${cityQuery}".`);
        setTimeout(() => setStatusMessage(""), 2500);
        return;
      }

      const city = {
        name: match.name,
        state: match.admin1 || "",
        country: match.country || "",
        lat: match.latitude,
        lon: match.longitude,
      };

      // Same flow as SearchBar's handleSelectCity — quaternion-based globe
      // rotation + camera dolly-in, keeping voice search behaviorally
      // identical to typed search.
      const targetQuaternion = latLonToQuaternion(city.lat, city.lon);
      globeTargetRotation.copy(targetQuaternion);
      cameraTarget.z = FOCUSED_DISTANCE;
      addGlobeMarker(city);
      setSelectedMarker(city);
      loadDashboardTelemetry(city);

      setStatusMessage(`Showing ${city.name}`);
      setTimeout(() => setStatusMessage(""), 1800);
    } catch (err) {
      console.error("Voice search failed:", err);
      setStatusMessage("Something went wrong.");
      setTimeout(() => setStatusMessage(""), 2500);
    } finally {
      setIsResolving(false);
    }
  };

  const showBubble = isListening || !!statusMessage;

  useLayoutEffect(() => {
    if (!showBubble) return;

    const updateRect = () => {
      if (!buttonWrapperRef.current) return;
      const rect = buttonWrapperRef.current.getBoundingClientRect();
      setBubbleRect({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    };

    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [showBubble]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Browsers without Web Speech API support (notably Firefox) simply don't
  // get this feature — no broken button, no misleading UI.
  if (!SpeechRecognitionAPI) return null;

  return (
    <div className="relative" ref={buttonWrapperRef}>
      <button
        onClick={toggleListening}
        title="Voice search"
        className={`relative flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-200 cursor-pointer ${
          isListening
            ? "bg-rose-500/20 border-rose-400/40 text-rose-300"
            : "bg-slate-900/80 border-slate-800 hover:border-sky-500/30 text-sky-400 hover:text-sky-300"
        } backdrop-blur-md`}
      >
        {isResolving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Mic className="h-5 w-5" />
        )}

        {/* Pulsing ring while actively listening */}
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-xl border-2 border-rose-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </button>

      {/* Live transcript / status bubble — portaled to <body> so it can
          never get trapped behind a stacking context created by a
          Framer Motion transform on an ancestor (same issue we fixed for
          the search suggestions dropdown). */}
      {showBubble &&
        bubbleRect &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              style={{
                position: "fixed",
                top: bubbleRect.top,
                right: bubbleRect.right,
              }}
              className="min-w-[180px] max-w-[260px] bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg z-[9999]"
            >
              <p className="text-xs text-slate-300 font-medium">
                {statusMessage || transcript || "Listening..."}
              </p>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
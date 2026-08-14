"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAudioStore } from "./useAudioStore";
import { DEPLOYMENT_LOCALE } from "@/lib/i18n";

/**
 * Detects if a voice is likely female based on its name.
 * Female voices naturally speak faster, so we compensate the rate.
 */
export function isFemaleVoice(voice: SpeechSynthesisVoice | null): boolean {
  if (!voice) return false;
  const name = voice.name.toLowerCase();
  // Explicit female markers
  if (name.includes("female")) return true;
  // Google US English (no "Male" suffix) is typically female-sounding
  if (name === "google us english") return true;
  // Common system female voices
  if (/zira|hazel|linda|jenny|aria|sara|samantha|victoria|moira|tessa|elena|karen/i.test(voice.name)) return true;
  return false;
}

/**
 * Returns the language prefix for a given locale
 * e.g., "en" -> "en", "es" -> "es", "ar" -> "ar"
 */
function getVoiceLangPrefix(locale: string): string {
  switch (locale) {
    case "es":
      return "es";
    case "ar":
      return "ar";
    default:
      return "en";
  }
}

/**
 * Returns the effective utterance rate, compensating for female voices
 * which naturally speak faster than male voices.
 * 
 * User-selected:  0.5x  → Male: 0.5,  Female: 0.5
 * User-selected:  0.75x → Male: 0.75, Female: 0.75
 * User-selected:  1x    → Male: 1.0,  Female: 0.95
 * User-selected:  1.25x → Male: 1.25, Female: 1.1
 * User-selected:  1.5x  → Male: 1.5,  Female: 1.25
 * User-selected:  2x    → Male: 2.0,  Female: 1.65
 */
function getEffectiveRate(userRate: number, voice: SpeechSynthesisVoice | null): number {
  if (!isFemaleVoice(voice)) return userRate;
  if (userRate <= 0.75) return userRate;
  if (userRate <= 1) return 0.95;
  if (userRate <= 1.25) return 1.1;
  if (userRate <= 1.5) return 1.25;
  return 1.65;
}

export function useSpeechEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [hasSupport, setHasSupport] = useState(false);

  const voiceLangPrefix = getVoiceLangPrefix(DEPLOYMENT_LOCALE);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const rateRef = useRef<number>(1);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const voicePreference = useAudioStore((state) => state.voiceType);
  const selectedVoiceName = useAudioStore((state) => state.selectedVoiceName);
  const setSelectedVoiceName = useAudioStore((state) => state.setSelectedVoiceName);

  const voicePreferenceRef = useRef(voicePreference);
  useEffect(() => {
    voicePreferenceRef.current = voicePreference;
  }, [voicePreference]);

  const selectedVoiceNameRef = useRef(selectedVoiceName);
  useEffect(() => {
    selectedVoiceNameRef.current = selectedVoiceName;
  }, [selectedVoiceName]);

  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setHasSupport(true);

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0) return;

      setVoices(availableVoices);

      // If user explicitly selected a voice by name, use that
      if (selectedVoiceNameRef.current) {
        const found = availableVoices.find(v => v.name === selectedVoiceNameRef.current);
        if (found) {
          setSelectedVoice(found);
          return;
        }
      }

      setSelectedVoice((prev) =>
        prev ? prev : findBestVoice(availableVoices, voicePreferenceRef.current) || null
      );
    };

    // ① Try synchronously — Firefox / Safari already have voices available
    loadVoices();

    // ② Use addEventListener so multiple hook instances don't overwrite each other
    //    (onvoiceschanged = fn is a single-slot property — last writer wins)
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    // ③ Polling fallback: some browsers fire voiceschanged before we attach the listener
    //    (or don't fire it at all). Poll for up to ~1 s to catch those cases.
    let pollCount = 0;
    const pollId = setInterval(() => {
      if (window.speechSynthesis.getVoices().length > 0 || ++pollCount >= 20) {
        clearInterval(pollId);
        loadVoices(); // harmless no-op if already loaded
      }
    }, 50);

    return () => {
      clearInterval(pollId);
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []); // run once; refs keep voicePreference current inside the closure


  function findBestVoice(availableVoices: SpeechSynthesisVoice[], type: 'male' | 'female'): SpeechSynthesisVoice | null {
    // Filter voices by the current locale's language prefix
    const localeVoices = availableVoices.filter(v => v.lang.startsWith(voiceLangPrefix));
    
    // For English, we have specific female/male voice detection
    // For other languages, we'll use generic detection based on voice name
    const isEnglish = voiceLangPrefix === 'en';
    
    if (type === 'female') {
      if (isEnglish) {
        return (
          localeVoices.find(v => v.name.includes("Google US English") && !v.name.includes("Male")) ||
          localeVoices.find(v => v.name.toLowerCase().includes("female")) ||
          localeVoices.find(v => /zira|hazel|linda|jenny|aria|sara|samantha/i.test(v.name)) ||
          localeVoices.find(v => v.lang.startsWith("en-US")) ||
          availableVoices[0]
        );
      } else if (voiceLangPrefix === 'es') {
        // Spanish female voices
        return (
          localeVoices.find(v => v.name.toLowerCase().includes("female")) ||
          localeVoices.find(v => /monica|laura|penelope|isabel|maria|google espa|microsoft espa|es-mx|es-es/i.test(v.name)) ||
          localeVoices[0] ||
          availableVoices[0]
        );
      } else if (voiceLangPrefix === 'ar') {
        // Arabic female voices
        return (
          localeVoices.find(v => v.name.toLowerCase().includes("female")) ||
          localeVoices.find(v => /fatima|layla|maria|google ara|microsoft ara|ar-sa|ar-eg/i.test(v.name)) ||
          localeVoices[0] ||
          availableVoices[0]
        );
      }
      return localeVoices[0] || availableVoices[0];
    } else {
      // Male voice selection
      if (isEnglish) {
        return (
          localeVoices.find(v => v.name.toLowerCase().includes("male") && !v.name.toLowerCase().includes("female")) ||
          localeVoices.find(v => /david|daniel|guy|mark|andrew|james|richard/i.test(v.name)) ||
          localeVoices.find(v => !isFemaleVoice(v)) ||
          availableVoices.find(v => !isFemaleVoice(v)) ||
          availableVoices[0]
        );
      } else if (voiceLangPrefix === 'es') {
        // Spanish male voices
        return (
          localeVoices.find(v => v.name.toLowerCase().includes("male") && !v.name.toLowerCase().includes("female")) ||
          localeVoices.find(v => /jorge|pablo|diego|google espa|microsoft espa|es-mx|es-es/i.test(v.name)) ||
          localeVoices.find(v => !isFemaleVoice(v)) ||
          availableVoices.find(v => !isFemaleVoice(v)) ||
          availableVoices[0]
        );
      } else if (voiceLangPrefix === 'ar') {
        // Arabic male voices
        return (
          localeVoices.find(v => v.name.toLowerCase().includes("male") && !v.name.toLowerCase().includes("female")) ||
          localeVoices.find(v => /google ara|microsoft ara|ar-sa|ar-eg/i.test(v.name)) ||
          localeVoices.find(v => !isFemaleVoice(v)) ||
          availableVoices.find(v => !isFemaleVoice(v)) ||
          availableVoices[0]
        );
      }
      return localeVoices.find(v => !isFemaleVoice(v)) || availableVoices.find(v => !isFemaleVoice(v)) || availableVoices[0];
    }
  }

  const stop = useCallback(() => {
    if (!hasSupport) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    isPausedRef.current = false;
    currentChunkIndexRef.current = 0;
    chunksRef.current = [];
  }, [hasSupport]);

  // Speaks one sentence/phrase at a time; auto-advances to the next chunk on completion.
  // This chunk-by-chunk approach lets speed/voice changes take effect within ~1-2 seconds.
  const playNextChunk = useCallback(() => {
    if (currentChunkIndexRef.current >= chunksRef.current.length) {
        // All chunks finished — reset playback state
        setIsPlaying(false);
        setIsPaused(false);
        isPlayingRef.current = false;
        return;
    }

    if (!isPlayingRef.current || isPausedRef.current) return;

    const chunk = chunksRef.current[currentChunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);
    const voice = selectedVoiceRef.current;
    if (voice) utterance.voice = voice;

    utterance.rate = getEffectiveRate(rateRef.current, voice);

    // Adjust pitch per gender: male voices get a slightly deeper tone
    if (voice && !isFemaleVoice(voice)) {
      utterance.pitch = 0.85;
    } else {
      utterance.pitch = 1.0;
    }

    // Advance the index and queue the next chunk when this one ends
    utterance.onend = () => {
        if (!isPlayingRef.current || isPausedRef.current) return;
        currentChunkIndexRef.current += 1;
        playNextChunk();
    };

    // Ignore "canceled" errors — those are intentional (from stop/pause calls)
    utterance.onerror = (e) => {
        if (e.error !== "canceled") {
            console.error("Speech synthesis error", e);
            setIsPlaying(false);
            isPlayingRef.current = false;
        }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback((text: string) => {
    if (!hasSupport || !text) return;
    
    stop(); // cancel anything currently happening

    // Sanitize ellipses so they aren't spoken as "dot dot dot"
    const sanitized = text
        .replace(/\.{2,}/g, ".")
        .replace(/…/g, ".")
        .replace(/\s+/g, " ")
        .trim();

    // Split into SMALL chunks (by comma, period, exclamation, question mark — incl. Arabic punctuation)
    // so speed changes take effect almost immediately (within ~1-2 seconds)
    const chunks = sanitized
        .match(/[^.!?،؛؟,]+[.!?،؛؟,]*/g) || [sanitized]; 
    
    chunksRef.current = chunks
        .map(c => c.trim())
        .filter(c => c.length > 0 && c !== "." && c !== ",");
    currentChunkIndexRef.current = 0;

    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;
    isPausedRef.current = false;
    
    playNextChunk();
    
  }, [hasSupport, playNextChunk, stop]);

  const pause = useCallback(() => {
    if (!hasSupport) return;

    // Native speechSynthesis.pause() hangs permanently for cloud/network voices.
    // Canceling and tracking the chunk index lets us resume from the right position.
    window.speechSynthesis.cancel();

    setIsPaused(true);
    setIsPlaying(false);
    isPausedRef.current = true;
    isPlayingRef.current = false;
  }, [hasSupport]);

  const resume = useCallback(() => {
    if (!hasSupport || chunksRef.current.length === 0) return;
    
    setIsPaused(false);
    setIsPlaying(true);
    isPausedRef.current = false;
    isPlayingRef.current = true;

    // Resumes playing exactly at the chunk that was interrupted
    playNextChunk();
  }, [hasSupport, playNextChunk]);

  const togglePlayPause = useCallback((text?: string) => {
      if (isPlaying) {
          pause();
      } else if (isPaused) {
          resume();
      } else if (text) {
          speak(text);
      }
  }, [isPlaying, isPaused, pause, resume, speak]);

  // Clean up on unmount or route change
  useEffect(() => {
      return () => {
          stop();
      };
  }, [stop]);

  const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

  const cycleSpeed = useCallback(() => {
    setRate((prev) => {
      const currentIdx = SPEED_OPTIONS.indexOf(prev as typeof SPEED_OPTIONS[number]);
      const nextIdx = (currentIdx + 1) % SPEED_OPTIONS.length;
      const newRate = SPEED_OPTIONS[nextIdx];
      rateRef.current = newRate;
      return newRate;
    });
  }, []);

  // Voices native to the deployment locale (e.g. "ar-SA", "es-ES"), so the
  // dropdown can surface them first and the auto-selection stays on-locale.
  const localeVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(voiceLangPrefix)
  );

  return {
    speak,
    pause,
    resume,
    stop,
    togglePlayPause,
    isPlaying,
    isPaused,
    hasSupport,
    voices,
    localeVoices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate: (newRate: number) => {
      rateRef.current = newRate;
      setRate(newRate);
    },
    cycleSpeed
  };
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useSpeechEngine } from "@/hooks/useSpeechEngine";
import { useAudioStore } from "@/hooks/useAudioStore";
import { translate } from "@/lib/translate";

const T = {
  listen: translate("article.listen"),
  pause: translate("article.pause"),
  resume: translate("article.resume"),
  stop: translate("article.stop"),
  listening: translate("article.listening"),
  paused: translate("article.paused"),
  speed: translate("article.speed"),
  playbackSpeed: translate("article.playbackSpeed"),
  selectVoice: translate("article.selectVoice"),
  voice: translate("article.voice"),
  noVoices: translate("article.noVoices"),
  nativeVoices: translate("article.nativeVoices"),
};

interface ListenButtonProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export default function ListenButton({
  text,
  className = "",
  size = "md",
  showLabel = false,
}: ListenButtonProps) {
  const {
    togglePlayPause,
    stop,
    isPlaying,
    isPaused,
    rate,
    setRate,
    voices,
    localeVoices,
    selectedVoice,
    setSelectedVoice,
    hasSupport,
  } = useSpeechEngine();

  const audioContent = useAudioStore((s) => s.audioContent);
  const setAudioContent = useAudioStore((s) => s.setAudioContent);
  const clearAudioContent = useAudioStore((s) => s.clearAudioContent);
  const setSelectedVoiceName = useAudioStore((s) => s.setSelectedVoiceName);

  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const voiceDropdownRef = useRef<HTMLDivElement>(null);
  const speedDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(e.target as Node)) {
        setShowVoiceDropdown(false);
      }
      if (speedDropdownRef.current && !speedDropdownRef.current.contains(e.target as Node)) {
        setShowSpeedDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!hasSupport) return null;

  const effectiveContent = text || audioContent;
  const isActive = (isPlaying || isPaused) && audioContent === effectiveContent;

  const handlePlayPause = () => {
    if (isActive) {
      togglePlayPause(audioContent);
    } else if (effectiveContent) {
      if (text && text !== audioContent) {
        setAudioContent(text);
        setTimeout(() => togglePlayPause(text), 50);
      } else {
        togglePlayPause(audioContent);
      }
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleVoiceSelect = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    setSelectedVoiceName(voice.name);
    setShowVoiceDropdown(false);
  };

  const handleSpeedSelect = (speed: number) => {
    setRate(speed);
    setShowSpeedDropdown(false);
  };

  const sizeClasses = {
    sm: "w-[28px] h-[28px]",
    md: "w-[36px] h-[36px]",
    lg: "w-[44px] h-[44px]",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full border border-[var(--borderColor)] bg-[var(--shadeColor)] text-[var(--titleColor)] hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] hover:shadow-[0_0_12px_rgba(0,115,255,0.4)] transition-all cursor-pointer`}
        aria-label={isPlaying ? T.pause : isPaused ? T.resume : T.listen}
        title={isPlaying ? T.pause : isPaused ? T.resume : T.listen}
      >
        {isPlaying ? (
          <svg width={iconSizes[size]} height={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg width={iconSizes[size]} height={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        )}
      </button>

      {/* Stop Button — only when active */}
      {(isPlaying || isPaused) && (
        <button
          onClick={handleStop}
          className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full border border-[var(--borderColor)] bg-[var(--shadeColor)] text-[var(--titleColor)] hover:text-red-500 hover:border-red-500 transition-all cursor-pointer`}
          aria-label={T.stop}
          title={T.stop}
        >
          <svg width={iconSizes[size] - 2} height={iconSizes[size] - 2} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h12v12H6z" />
          </svg>
        </button>
      )}

      {/* Speed Dropdown — only when active */}
      {(isPlaying || isPaused) && (
        <div className="relative" ref={speedDropdownRef}>
          <button
            onClick={() => { setShowSpeedDropdown(!showSpeedDropdown); setShowVoiceDropdown(false); }}
            className="h-[28px] px-2 inline-flex items-center justify-center rounded-full border border-[var(--borderColor)] bg-[var(--shadeColor)] text-[var(--titleColor)] text-[11px] font-bold hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] transition-all cursor-pointer"
            aria-label={`${T.speed} ${rate}x`}
            title={T.playbackSpeed}
          >
            {rate}x
          </button>
          {showSpeedDropdown && (
            <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-[var(--whiteColor)] border border-[var(--borderColor)] rounded-lg shadow-lg z-[10000] overflow-hidden min-w-[80px] animate-in fade-in slide-in-from-bottom-1">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedSelect(speed)}
                  className={`w-full px-3 py-1.5 text-[12px] font-medium text-center border-none cursor-pointer transition-colors ${
                    rate === speed
                      ? "bg-[var(--primaryColor)] text-white"
                      : "bg-transparent text-[var(--titleColor)] hover:bg-[var(--shadeColor)]"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Voice Dropdown — only when active */}
      {(isPlaying || isPaused) && (
        <div className="relative" ref={voiceDropdownRef}>
          <button
            onClick={() => { setShowVoiceDropdown(!showVoiceDropdown); setShowSpeedDropdown(false); }}
className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full border border-[var(--borderColor)] bg-[var(--shadeColor)] text-[var(--titleColor)] hover:text-[var(--primaryColor)] hover:border-[var(--primaryColor)] transition-all cursor-pointer`}
            aria-label={T.selectVoice}
            title={T.voice}
          >
            <svg width={iconSizes[size]} height={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>
          {showVoiceDropdown && (
            <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-[var(--whiteColor)] border border-[var(--borderColor)] rounded-lg shadow-lg z-[10000] overflow-hidden min-w-[200px] max-h-[260px] overflow-y-auto animate-in fade-in slide-in-from-bottom-1">
              {voices.length === 0 && (
                <div className="px-3 py-2 text-[12px] text-[var(--bodyColor)] text-center">{T.noVoices}</div>
              )}
              {localeVoices.length > 0 && (
                <>
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--bodyColor)] bg-[var(--shadeColor)]">
                    {T.nativeVoices}
                  </div>
                  {localeVoices.map((voice) => (
                    <button
                      key={voice.name}
                      onClick={() => handleVoiceSelect(voice)}
                      className={`w-full px-3 py-1.5 text-start text-[12px] border-none cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                        selectedVoice?.name === voice.name
                          ? "bg-[var(--primaryColor)] text-white"
                          : "bg-transparent text-[var(--titleColor)] hover:bg-[var(--shadeColor)]"
                      }`}
                    >
                      <span className="truncate flex-1">{voice.name}</span>
                      <span className={`text-[10px] shrink-0 ${selectedVoice?.name === voice.name ? "text-white/60" : "text-[var(--bodyColor)]"}`}>
                        {voice.lang}
                      </span>
                    </button>
                  ))}
                </>
              )}
              {localeVoices.length === 0 && voices.map((voice) => (
                <button
                  key={voice.name}
                  onClick={() => handleVoiceSelect(voice)}
                  className={`w-full px-3 py-1.5 text-start text-[12px] border-none cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                    selectedVoice?.name === voice.name
                      ? "bg-[var(--primaryColor)] text-white"
                      : "bg-transparent text-[var(--titleColor)] hover:bg-[var(--shadeColor)]"
                  }`}
                >
                  <span className="truncate flex-1">{voice.name}</span>
                  <span className={`text-[10px] shrink-0 ${selectedVoice?.name === voice.name ? "text-white/60" : "text-[var(--bodyColor)]"}`}>
                    {voice.lang}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Optional label */}
      {showLabel && effectiveContent && (
        <span className="text-[12px] text-[var(--bodyColor)] ms-1">
          {isPlaying ? T.listening : isPaused ? T.paused : T.listen}
        </span>
      )}
    </div>
  );
}

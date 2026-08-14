"use client";

import { useState, useRef, useEffect } from "react";
import { useSpeechEngine } from "@/hooks/useSpeechEngine";
import { useAudioStore } from "@/hooks/useAudioStore";

export default function AudioPlayer() {
  const { togglePlayPause, stop, isPlaying, isPaused, rate, setRate, voices, localeVoices, selectedVoice, setSelectedVoice, hasSupport } = useSpeechEngine();
  const audioContent = useAudioStore((s) => s.audioContent);
  const clearAudioContent = useAudioStore((s) => s.clearAudioContent);
  const setSelectedVoiceName = useAudioStore((s) => s.setSelectedVoiceName);

  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const voiceDropdownRef = useRef<HTMLDivElement>(null);
  const speedDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
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

  if (!hasSupport || !audioContent) return null;

  const handleClose = () => {
    stop();
    clearAudioContent();
  };

  const handlePlayPause = () => {
    togglePlayPause(audioContent);
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

  const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const getButtonLabel = () => {
    if (isPlaying) return "Pause";
    if (isPaused) return "Resume";
    return "Listen";
  };

  return (
    <div className="audio-player-wrap">
      <div className="audio-player">
        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="audio-player-btn audio-player-play"
          aria-label={getButtonLabel()}
          title={getButtonLabel()}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>

        {/* Stop */}
        <button
          onClick={handleStop}
          className="audio-player-btn audio-player-stop"
          aria-label="Stop"
          title="Stop"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h12v12H6z" />
          </svg>
        </button>

        {/* Speed Dropdown */}
        <div className="audio-dropdown" ref={speedDropdownRef}>
          <button
            onClick={() => { setShowSpeedDropdown(!showSpeedDropdown); setShowVoiceDropdown(false); }}
            className="audio-player-btn audio-player-speed"
            aria-label={`Speed ${rate}x`}
            title="Speed"
          >
            {rate}x
          </button>
          {showSpeedDropdown && (
            <div className="audio-dropdown-menu">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedSelect(speed)}
                  className={`audio-dropdown-item ${rate === speed ? "active" : ""}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice Dropdown */}
        <div className="audio-dropdown" ref={voiceDropdownRef}>
          <button
            onClick={() => { setShowVoiceDropdown(!showVoiceDropdown); setShowSpeedDropdown(false); }}
            className="audio-player-btn audio-player-voice"
            aria-label="Select voice"
            title="Voice"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>
          {showVoiceDropdown && (
            <div className="audio-dropdown-menu audio-voice-list">
              {voices.length === 0 && (
                <div className="audio-dropdown-empty">No voices available</div>
              )}
              {localeVoices.length > 0 && (
                <>
                  <div className="audio-dropdown-group">Native voices</div>
                  {localeVoices.map((voice) => (
                    <button
                      key={voice.name}
                      onClick={() => handleVoiceSelect(voice)}
                      className={`audio-dropdown-item ${selectedVoice?.name === voice.name ? "active" : ""}`}
                    >
                      <span className="audio-voice-name">{voice.name}</span>
                      <span className="audio-voice-lang">{voice.lang}</span>
                    </button>
                  ))}
                  {voices.length > localeVoices.length && (
                    <>
                      <div className="audio-dropdown-group">All languages</div>
                      {voices.filter((v) => !localeVoices.includes(v)).map((voice) => (
                        <button
                          key={voice.name}
                          onClick={() => handleVoiceSelect(voice)}
                          className={`audio-dropdown-item ${selectedVoice?.name === voice.name ? "active" : ""}`}
                        >
                          <span className="audio-voice-name">{voice.name}</span>
                          <span className="audio-voice-lang">{voice.lang}</span>
                        </button>
                      ))}
                    </>
                  )}
                </>
              )}
              {localeVoices.length === 0 && voices.map((voice) => (
                <button
                  key={voice.name}
                  onClick={() => handleVoiceSelect(voice)}
                  className={`audio-dropdown-item ${selectedVoice?.name === voice.name ? "active" : ""}`}
                >
                  <span className="audio-voice-name">{voice.name}</span>
                  <span className="audio-voice-lang">{voice.lang}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="audio-player-btn audio-player-close"
          aria-label="Close player"
          title="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </button>
      </div>

      <div className="audio-player-label">
        {isPlaying ? "Reading article..." : isPaused ? "Paused" : "Listen to this article"}
      </div>
    </div>
  );
}

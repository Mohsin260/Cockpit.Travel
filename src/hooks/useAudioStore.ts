"use client";

import { create } from "zustand";

interface AudioStore {
  audioContent: string;
  sourceId: string | null;
  voiceType: 'male' | 'female';
  isPlaying: boolean;
  selectedVoiceName: string | null;
  setAudioContent: (content: string, sourceId?: string | null) => void;
  setVoiceType: (type: 'male' | 'female') => void;
  setIsPlaying: (playing: boolean) => void;
  setSelectedVoiceName: (name: string | null) => void;
  clearAudioContent: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  audioContent: "",
  sourceId: null,
  voiceType: "female",
  isPlaying: false,
  selectedVoiceName: null,
  setAudioContent: (content, sourceId = null) => set({ audioContent: content, sourceId }),
  setVoiceType: (type) => set({ voiceType: type }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSelectedVoiceName: (name) => set({ selectedVoiceName: name }),
  clearAudioContent: () => set({ audioContent: "", sourceId: null, isPlaying: false, selectedVoiceName: null }),
}));

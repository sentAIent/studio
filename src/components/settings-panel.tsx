
"use client";

import { useState, useEffect } from "react";
import type { AvatarSettings, PresetAvatar } from "@/lib/types";
import { cn } from "@/lib/utils";

type SettingsPanelProps = {
  settings: AvatarSettings;
  setSettings: (settings: AvatarSettings) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  closePanel: () => void;
};

const presetAvatars: PresetAvatar[] = [
    { name: 'Professional Male', id: '6549c5e1b68e59e8f3f5e4d1', description: 'Business professional' },
    { name: 'Casual Female', id: '654b9012b68e59e8f3f5e4d4', description: 'A friendly and casual look' },
    { name: 'Stylized Male', id: '6460d39327d6f560e28bc026', description: 'A stylized character' },
    { name: 'Cyberpunk Visionary', id: '66302498293c3fda152174f1', description: 'A futuristic look with a punk edge' }
];

const SettingsPanel = ({
  settings,
  setSettings,
  voices,
  selectedVoice,
  setSelectedVoice,
  closePanel,
}: SettingsPanelProps) => {
  const [tempSettings, setTempSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSave = () => {
    setSettings(tempSettings);
    if(tempSettings.voiceName) {
        const voice = voices.find(v => v.name === tempSettings.voiceName);
        setSelectedVoice(voice || null);
    }
    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsSaved(false);
      closePanel();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-400/40 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">Settings</h2>
          <button
            onClick={closePanel}
            className="text-cyan-300 hover:text-white transition-colors text-2xl"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <label className="text-cyan-300 text-sm font-medium mb-2 block">
            Voice Selection
          </label>
          <select
            value={tempSettings.voiceName || ''}
            onChange={(e) => {
                setTempSettings({...tempSettings, voiceName: e.target.value});
            }}
            className="w-full bg-slate-800 border border-cyan-400/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-cyan-300 text-sm font-medium mb-2 block">
            Speech Rate: {tempSettings.speechRate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={tempSettings.speechRate}
            onChange={(e) => setTempSettings({...tempSettings, speechRate: parseFloat(e.target.value)})}
          />
        </div>

        <div className="mb-6">
          <label className="text-cyan-300 text-sm font-medium mb-2 block">
            Volume: {Math.round(tempSettings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={tempSettings.volume}
            onChange={(e) => setTempSettings({...tempSettings, volume: parseFloat(e.target.value)})}
          />
        </div>

        <div className="mb-6">
          <label className="text-cyan-300 text-sm font-medium mb-2 block">
            Avatar Style
          </label>
          <div className="space-y-2">
            {presetAvatars.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setTempSettings({...tempSettings, avatarUrl: preset.id})}
                className={cn(`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium`,
                  tempSettings.avatarUrl === preset.id
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 hover:shadow-lg hover:shadow-cyan-500/10 border border-cyan-400/20'
                )}
              >
                <div className="font-semibold">{preset.name}</div>
                <div className="text-xs opacity-75 mt-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-cyan-300 text-sm font-medium mb-2 block">
            Custom Ready Player Me Avatar
          </label>
          <p className="text-cyan-300/70 text-xs mb-2">
            Enter the subdomain from your avatar's share URL.
          </p>
          <input
            type="text"
            value={tempSettings.avatarUrl}
            onChange={(e) => setTempSettings({...tempSettings, avatarUrl: e.target.value})}
            placeholder="Enter avatar subdomain..."
            className="w-full bg-slate-800 border border-cyan-400/30 rounded-xl px-4 py-2 text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300"
          />
          <p className="text-cyan-300/70 text-xs mt-2">
            Create your avatar at <a href="https://readyplayer.me" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-300">readyplayer.me</a>
          </p>
           <p className="text-emerald-400/90 text-xs mt-1 font-semibold">
                ✅ Settings are now saved to your account!
              </p>
        </div>

        <button
          onClick={handleSave}
          disabled={settingsSaved}
          className={cn(`w-full py-3 rounded-xl font-bold transition-all duration-300 mb-4`,
            settingsSaved
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white shadow-lg shadow-cyan-500/30'
          )}
        >
          {settingsSaved ? '✓ Settings Saved!' : 'Save & Close'}
        </button>
        
        <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-400/40 rounded-xl p-4 shadow-lg shadow-cyan-500/10">
            <p className="text-cyan-300 text-sm leading-relaxed mb-3">
                <strong className="text-white">Phase 2 Coming:</strong> Voice cloning with Dia TTS will be integrated when you set up the local server on your iMac. Custom voices, lip-sync, and advanced emotions!
            </p>
            <p className="text-cyan-300/70 text-xs">
                <strong>Voice Input Note:</strong> Safari on iPad has limited voice recognition support. For best results, use Chrome on desktop or we can add server-based voice recording in Phase 2.
            </p>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;

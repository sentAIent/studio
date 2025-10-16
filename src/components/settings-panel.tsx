
"use client";

import { useState, useEffect } from "react";
import type { AvatarSettings, PresetAvatar } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UploadCloud, Check } from "lucide-react";

type SettingsPanelProps = {
  settings: AvatarSettings;
  setSettings: (settings: AvatarSettings) => void;
  closePanel: () => void;
};

const presetAvatars: PresetAvatar[] = [
  { name: 'Professional Male', id: '6549c5e1b68e59e8f3f5e4d1', description: 'Business professional' },
  { name: 'Casual Female', id: '654b9012b68e59e8f3f5e4d4', description: 'A friendly and casual look' },
  { name: 'Stylized Male', id: '6460d39327d6f560e28bc026', description: 'A stylized character' },
  { name: 'Cyberpunk Visionary', id: '66302498293c3fda152174f1', description: 'A futuristic look with a punk edge' }
];

const availableVoices = [
    { name: 'Algenib', description: 'A clear, standard male voice.' },
    { name: 'Achernar', description: 'A slightly deeper male voice.' },
    { name: 'Adhil', description: 'A standard female voice.' },
    { name: 'Agena', description: 'A softer female voice.' },
];

const SettingsPanel = ({
  settings,
  setSettings,
  closePanel,
}: SettingsPanelProps) => {
  const [tempSettings, setTempSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSave = () => {
    setSettings(tempSettings);
    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsSaved(false);
      closePanel();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-400/40 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/20">
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

        <Tabs defaultValue="avatar" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/80">
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatar" className="flex-1 overflow-y-auto mt-4 pr-2">
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
            </div>
          </TabsContent>

          <TabsContent value="voice" className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="mb-6">
              <label className="text-cyan-300 text-sm font-medium mb-2 block">
                Pre-built Voices
              </label>
              <div className="space-y-2">
                {availableVoices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => setTempSettings({...tempSettings, voiceName: voice.name})}
                    className={cn(`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium`,
                      tempSettings.voiceName === voice.name
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 hover:shadow-lg hover:shadow-cyan-500/10 border border-cyan-400/20'
                    )}
                  >
                    <div className="font-semibold">{voice.name}</div>
                    <div className="text-xs opacity-75 mt-1">{voice.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-cyan-300 text-sm font-medium mb-2 block">
                Clone a New Voice (Coming Soon)
              </label>
              <div className="bg-slate-800/50 border-2 border-dashed border-cyan-400/30 rounded-xl p-6 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-cyan-300/50" />
                  <p className="mt-4 text-sm text-cyan-300/80">Upload a 10-30 second audio file of clear speech to create a custom voice clone.</p>
                  <Button disabled className="mt-6" variant="outline">Choose File</Button>
              </div>
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
          </TabsContent>
        </Tabs>

        <div className="mt-auto pt-4 border-t border-cyan-400/20">
          <button
            onClick={handleSave}
            disabled={settingsSaved}
            className={cn(`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2`,
              settingsSaved
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white shadow-lg shadow-cyan-500/30'
            )}
          >
            {settingsSaved ? <><Check className="w-5 h-5"/> Settings Saved!</> : 'Save & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;

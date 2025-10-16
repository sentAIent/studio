"use client";

import { Pause } from "lucide-react";
import type { AvatarMood } from "@/lib/types";
import { cn } from "@/lib/utils";

type AvatarDisplayProps = {
  avatarUrl: string;
  avatarMood: AvatarMood;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
};

const AvatarDisplay = ({
  avatarUrl,
  avatarMood,
  isSpeaking,
  onStopSpeaking,
}: AvatarDisplayProps) => {
  const moodClasses = {
    talking: "bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50",
    thinking: "bg-amber-400 animate-pulse shadow-lg shadow-amber-400/50",
    neutral: "bg-cyan-400 shadow-lg shadow-cyan-400/50",
  };

  return (
    <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-cyan-900/20 via-teal-900/10 to-transparent p-4 md:h-auto h-[40vh]">
      <div className="relative w-full h-full max-w-2xl">
        <iframe
          src={`https://models.readyplayer.me/${avatarUrl}?scene=fullbody-portrait-v1&quality=high`}
          className="w-full h-full border-0 rounded-2xl shadow-2xl"
          allow="camera; microphone"
          title="3D Avatar"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 shadow-xl shadow-cyan-500/20 border border-cyan-400/20">
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              moodClasses[avatarMood]
            )}
          />
          <span className="text-white text-sm font-medium capitalize">
            {avatarMood}
          </span>
        </div>
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl shadow-rose-500/50 transition-all duration-300 font-medium"
          >
            <Pause className="w-5 h-5" />
            Stop Speaking
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarDisplay;

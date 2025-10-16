"use client";

import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';

const AvatarCore = dynamic(() => import('./avatar-core'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-950">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
        </div>
        <span className="text-lg font-medium">Initializing Avatar...</span>
      </div>
    </div>
  ),
});

const ConversationalAvatar = () => {
  return <AvatarCore />;
};

export default ConversationalAvatar;
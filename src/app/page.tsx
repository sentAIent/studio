'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import ConversationalAvatar from '@/components/conversational-avatar';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-teal-950">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <span className="text-lg font-medium">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return <ConversationalAvatar />;
}

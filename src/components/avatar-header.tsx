
"use client";

import { Settings, Sparkles, LogOut, Plane, ChevronDown } from "lucide-react";
import { useAuth as useFirebaseAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AvatarHeaderProps = {
  isSpeaking: boolean;
  openSettings: () => void;
};

const AvatarHeader = ({ isSpeaking, openSettings }: AvatarHeaderProps) => {
  const auth = useFirebaseAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <header className="bg-black/40 backdrop-blur-md border-b border-cyan-400/30 p-4 flex items-center justify-between shadow-lg shadow-cyan-500/10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl md:text-2xl">
            AI Avatar Assistant
          </h1>
          <p className="text-cyan-300 text-xs md:text-sm">
            Your personal conversational AI
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isSpeaking && (
          <div className="hidden md:flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-400/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">
              Speaking
            </span>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-transparent text-cyan-300 border-cyan-400/30 hover:bg-cyan-500/20 hover:text-cyan-200">
              Pages
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-900 border-cyan-400/30 text-white">
            <DropdownMenuItem asChild>
              <Link href="/itinerary" className="flex items-center gap-2 cursor-pointer">
                <Plane className="w-4 h-4" />
                View Itinerary
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={openSettings}
          className="p-2 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 md:w-6 md:h-6 text-cyan-300" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 bg-rose-500/20 hover:bg-rose-500/40 rounded-lg transition-all duration-300 shadow-lg shadow-rose-500/20"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 md:w-6 md:h-6 text-rose-300" />
        </button>
      </div>
    </header>
  );
};

export default AvatarHeader;

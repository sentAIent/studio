export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type AvatarMood = "neutral" | "talking" | "thinking";

export type PresetAvatar = {
  name: string;
  id: string;
  description: string;
};

export type AvatarSettings = {
  avatarUrl: string;
  volume: number;
  speechRate: number; // This is now less relevant with server-side TTS
  voiceName: string | null;
};

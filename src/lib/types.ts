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
  speechRate: number;
  voiceName: string | null;
};

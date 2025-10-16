"use server";

import {
  generateAiResponse,
  type GenerateAiResponseInput,
} from "@/ai/flows/generate-ai-messages";
import { synthesizeSpeech, type SynthesizeSpeechInput } from "@/ai/flows/synthesize-speech-flow";
import type { Message } from "@/lib/types";

export async function getAiResponse(
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  const history = conversationHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }) as const);
  
  const input: GenerateAiResponseInput = {
    conversationHistory: history,
    userMessage: userMessage,
  };

  try {
    const result = await generateAiResponse(input);
    return result.aiResponse;
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

export async function getSynthesizedSpeech(text: string, voiceName: string | null) {
  const input: SynthesizeSpeechInput = {
    text,
    voiceName,
  };
  try {
    const result = await synthesizeSpeech(input);
    return result.audioDataUri;
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    return null;
  }
}

"use server";

import {
  generateAiResponse,
  type GenerateAiResponseInput,
} from "@/ai/flows/generate-ai-messages";
import type { Message } from "@/lib/types";

export async function getAiResponse(
  conversationHistory: Message[],
  userMessage: string
): Promise<string> {
  const input: GenerateAiResponseInput = {
    conversationHistory: conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
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

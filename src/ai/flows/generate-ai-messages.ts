'use server';

/**
 * @fileOverview A flow to generate AI responses to user messages using the Anthropic API.
 *
 * - generateAiResponse - A function that generates AI responses.
 * - GenerateAiResponseInput - The input type for the generateAiResponse function.
 * - GenerateAiResponseOutput - The return type for the generateAiResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiResponseInputSchema = z.object({
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      parts: z.array(z.object({ text: z.string() })),
    })
  ).describe('The conversation history between the user and the assistant.'),
  userMessage: z.string().describe('The latest message from the user.'),
});
export type GenerateAiResponseInput = z.infer<typeof GenerateAiResponseInputSchema>;

const GenerateAiResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI generated response to the user message.'),
});
export type GenerateAiResponseOutput = z.infer<typeof GenerateAiResponseOutputSchema>;

export async function generateAiResponse(input: GenerateAiResponseInput): Promise<GenerateAiResponseOutput> {
  return generateAiResponseFlow(input);
}

const generateAiResponseFlow = ai.defineFlow(
  {
    name: 'generateAiResponseFlow',
    inputSchema: GenerateAiResponseInputSchema,
    outputSchema: GenerateAiResponseOutputSchema,
  },
  async input => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      history: input.conversationHistory,
      prompt: input.userMessage,
    });
    return {
      aiResponse: output.text,
    };
  }
);

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
      role: z.enum(['user', 'assistant']),
      content: z.string(),
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

const generateAiPrompt = ai.definePrompt({
  name: 'generateAiPrompt',
  input: {schema: GenerateAiResponseInputSchema},
  output: {schema: GenerateAiResponseOutputSchema},
  prompt: `You are a helpful AI assistant having a conversation with a user.

  Here is the conversation history:
  {{#each conversationHistory}}
  {{#if (eq role \"user\")}}User: {{content}}{{/if}}
  {{#if (eq role \"assistant\")}}Assistant: {{content}}{{/if}}
  {{/each}}

  User: {{userMessage}}
  Assistant: `,
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1024,
});

const generateAiResponseFlow = ai.defineFlow(
  {
    name: 'generateAiResponseFlow',
    inputSchema: GenerateAiResponseInputSchema,
    outputSchema: GenerateAiResponseOutputSchema,
  },
  async input => {
    const {output} = await generateAiPrompt({
      conversationHistory: input.conversationHistory,
      userMessage: input.userMessage,
    });
    return {
      aiResponse: output!.aiResponse,
    };
  }
);

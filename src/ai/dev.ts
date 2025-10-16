import { config } from 'dotenv';
config();

import '@/ai/flows/generate-ai-messages.ts';
import '@/ai/flows/synthesize-speech-flow.ts';
import '@/ai/flows/transcribe-audio-flow.ts';

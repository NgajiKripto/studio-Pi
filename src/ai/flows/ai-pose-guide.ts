'use server';
/**
 * @fileOverview An AI agent that provides real-time pose and expression suggestions.
 *
 * - aiPoseGuide - A function that handles generating pose/expression suggestions.
 * - AiPoseGuideInput - The input type for the aiPoseGuide function.
 * - AiPoseGuideOutput - The return type for the aiPoseGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoseGuideInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This is used to understand the current pose and context."1
    ),
  currentContext: z
    .string()
    .optional()
    .describe(
      'Optional text providing context about the current photo session, e.g., "taking a selfie with friends" or "trying to look cool and casual".'
    ),
});
export type AiPoseGuideInput = z.infer<typeof AiPoseGuideInputSchema>;

const AiPoseGuideOutputSchema = z.object({
  suggestion: z
    .string()
    .describe('A creative and encouraging suggestion for a pose or expression.'),
});
export type AiPoseGuideOutput = z.infer<typeof AiPoseGuideOutputSchema>;

export async function aiPoseGuide(input: AiPoseGuideInput): Promise<AiPoseGuideOutput> {
  return aiPoseGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoseGuidePrompt',
  input: {schema: AiPoseGuideInputSchema},
  output: {schema: AiPoseGuideOutputSchema},
  prompt: `You are Zepret AI, a friendly and energetic assistant specializing in guiding Gen Z users to capture amazing photos with creative poses and expressions. Your goal is to inspire and provide easy-to-follow suggestions for dynamic and engaging photos.

Analyze the provided image and the current context (if available) to offer a fresh pose or expression suggestion. Focus on making the user feel confident and look their best, aligning with trendy, Neobrutalism aesthetics, and a fun, energetic vibe.

Avoid generic advice. Be specific, encouraging, and brief.

Image context: {{{currentContext}}}
Photo: {{media url=photoDataUri}}`,
});

const aiPoseGuideFlow = ai.defineFlow(
  {
    name: 'aiPoseGuideFlow',
    inputSchema: AiPoseGuideInputSchema,
    outputSchema: AiPoseGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

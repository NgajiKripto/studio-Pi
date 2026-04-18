'use server';
/**
 * @fileOverview A Genkit flow for generating social media captions and hashtags based on user photos.
 *
 * - generateSocialShareSuggestions - A function that generates social media suggestions.
 * - AiSocialShareSuggestionsInput - The input type for the generateSocialShareSuggestions function.
 * - AiSocialShareSuggestionsOutput - The return type for the generateSocialShareSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiSocialShareSuggestionsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user's Zepret creation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  contextDescription: z
    .string()
    .optional()
    .describe(
      'An optional description providing context about the photo or the photo session, to help the AI generate more relevant suggestions.'
    ),
});
export type AiSocialShareSuggestionsInput = z.infer<
  typeof AiSocialShareSuggestionsInputSchema
>;

const AiSocialShareSuggestionsOutputSchema = z.object({
  captions: z
    .array(z.string())
    .describe('A list of suggested social media captions.'),
  hashtags: z
    .array(z.string())
    .describe('A list of suggested relevant hashtags.'),
});
export type AiSocialShareSuggestionsOutput = z.infer<
  typeof AiSocialShareSuggestionsOutputSchema
>;

export async function generateSocialShareSuggestions(
  input: AiSocialShareSuggestionsInput
): Promise<AiSocialShareSuggestionsOutput> {
  return aiSocialShareSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialShareSuggestionsPrompt',
  input: { schema: AiSocialShareSuggestionsInputSchema },
  output: { schema: AiSocialShareSuggestionsOutputSchema },
  prompt: `You are a social media expert specializing in trending content for Gen Z.
Given the following photo and a brief description, generate 3-5 engaging and trending captions and 5-7 relevant hashtags suitable for platforms like TikTok and Instagram.
Focus on a Neobrutalism aesthetic, vibrant, and fun tone, appealing to Gen Z.

Photo context: {{{contextDescription}}}
Photo: {{media url=photoDataUri}}`,
});

const aiSocialShareSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSocialShareSuggestionsFlow',
    inputSchema: AiSocialShareSuggestionsInputSchema,
    outputSchema: AiSocialShareSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate social share suggestions.');
    }
    return output;
  }
);

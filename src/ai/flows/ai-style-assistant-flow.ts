'use server';
/**
 * @fileOverview An AI-powered style assistant that suggests trending or personalized frame designs and sticker arrangements
 * based on popular styles or photo context for the Zepret photobox app.
 *
 * - aiStyleAssistant - A function that handles the style suggestion process.
 * - AiStyleAssistantInput - The input type for the aiStyleAssistant function.
 * - AiStyleAssistantOutput - The return type for the aiStyleAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the AI style assistant flow.
 */
const AiStyleAssistantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  desiredStyle: z
    .string()
    .optional()
    .describe(
      'An optional string describing the user\'s desired style (e.g., "vintage", "futuristic", "minimalist", "bold", "playful"). If not provided, suggest trending Neobrutalist styles.'
    ),
});
export type AiStyleAssistantInput = z.infer<typeof AiStyleAssistantInputSchema>;

/**
 * Schema for a suggested frame design.
 */
const FrameSuggestionSchema = z.object({
  name: z.string().describe('The name or type of the suggested frame design.'),
  description: z
    .string()
    .describe(
      'A detailed description of the frame design, including its visual characteristics (e.g., color, border thickness, shadows, typography) adhering to Neobrutalism.'
    ),
  styleKeywords: z
    .array(z.string())
    .describe(
      'Keywords describing the style of the frame (e.g., "Neobrutalism", "Bold", "Geometric", "Pink", "Retro").'
    ),
});

/**
 * Schema for a suggested sticker arrangement.
 */
const StickerSuggestionSchema = z.object({
  name: z.string().describe('The name or type of the suggested sticker (e.g., "Star", "Arrow", "Speech Bubble").'),
  description: z
    .string()
    .describe(
      'A detailed description of the sticker, its appearance, and suggested placement/arrangement relative to the photo or other stickers.'
    ),
  styleKeywords: z
    .array(z.string())
    .describe(
      'Keywords describing the style of the sticker (e.g., "Neobrutalism", "Abstract", "Text", "Pink Accent").'
    ),
});

/**
 * Output schema for the AI style assistant flow.
 */
const AiStyleAssistantOutputSchema = z.object({
  frameSuggestion: FrameSuggestionSchema.describe(
    'A suggestion for a photo frame design.'
  ),
  stickerArrangements: z
    .array(StickerSuggestionSchema)
    .describe(
      'An array of suggestions for 3D sticker arrangements, including their type, appearance, and proposed placement on the photo.'
    ),
  overallStyleRecommendation: z
    .string()
    .describe(
      'A brief overall recommendation for the aesthetic based on the photo and desired style, emphasizing Neobrutalism elements.'
    ),
});
export type AiStyleAssistantOutput = z.infer<typeof AiStyleAssistantOutputSchema>;

/**
 * Calls the AI style assistant Genkit flow to suggest frame designs and sticker arrangements.
 * @param input The input containing the photo data and an optional desired style.
 * @returns A promise that resolves to the AI-generated style suggestions.
 */
export async function aiStyleAssistant(
  input: AiStyleAssistantInput
): Promise<AiStyleAssistantOutput> {
  return aiStyleAssistantFlow(input);
}

/**
 * Genkit prompt definition for the style assistant.
 */
const styleAssistantPrompt = ai.definePrompt({
  name: 'styleAssistantPrompt',
  input: { schema: AiStyleAssistantInputSchema },
  output: { schema: AiStyleAssistantOutputSchema },
  prompt: `You are an AI-powered style assistant for Zepret, a photobox app targeting Gen Z with a Neobrutalism aesthetic.
Your task is to suggest trending or personalized frame designs and sticker arrangements based on the user's photo and their desired style.

**App Aesthetic Guidelines (Neobrutalism):**
-   **Colors:** Dominant pink (#FF5A8F), strong contrast with black (#111), white (#FFF), and energetic yellow/purple accents.
-   **Visuals:** Thick borders (3-4px), harsh box shadows, bold typography (Space Grotesk, Inter), asymmetrical but clean layouts.
-   **Stickers:** 3D, geometric, bold, can be text-based or abstract.

**Instructions:**
1.  Analyze the provided photo.
2.  Consider the user's 'desiredStyle' if provided. If not, suggest a trending Neobrutalist style.
3.  Suggest ONE frame design that adheres strictly to the Neobrutalism aesthetic, using the specified color palette and visual elements.
4.  Suggest TWO to THREE distinct sticker arrangements (3D stickers) that complement the photo and the chosen Neobrutalism style. Describe each sticker's appearance and ideal placement.
5.  Provide an overall style recommendation.

**User Photo for Context:**
{{media url=photoDataUri}}

{{#if desiredStyle}}
**User's Desired Style:** {{{desiredStyle}}}
{{else}}
**User has no specific style preference. Suggest a popular Neobrutalist trend.**
{{/if}}

Provide your suggestions in JSON format as per the output schema.
`,
});

/**
 * Genkit flow definition for the AI style assistant.
 */
const aiStyleAssistantFlow = ai.defineFlow(
  {
    name: 'aiStyleAssistantFlow',
    inputSchema: AiStyleAssistantInputSchema,
    outputSchema: AiStyleAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await styleAssistantPrompt(input);
    if (!output) {
      throw new Error('Failed to get style suggestions from AI.');
    }
    return output;
  }
);

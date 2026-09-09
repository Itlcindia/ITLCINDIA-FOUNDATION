'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating narrative impact stories for the ITLC Foundation.
 * It takes impact metrics and target audience as input and generates a compelling story,
 * intelligently deciding which details to include or omit based on context.
 *
 * - generateImpactStory - A function that handles the story generation process.
 * - GenerateImpactStoryInput - The input type for the generateImpactStory function.
 * - GenerateImpactStoryOutput - The return type for the generateImpactStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImpactStoryInputSchema = z.object({
  mealsDistributed: z.number().describe('Number of meals distributed by the foundation.'),
  treesPlanted: z.number().describe('Number of trees planted by the foundation.'),
  animalsHelped: z.number().describe('Number of animals helped by the foundation.'),
  targetAudience: z
    .string()
    .describe(
      'The intended audience or platform for the story (e.g., "blog post", "donor report", "social media caption"). This influences the level of detail and tone.'
    ),
  additionalContext: z
    .string()
    .optional()
    .describe(
      'Any additional specific instructions or context for the story generation (e.g., "focus on a specific region", "mention the importance of monthly donors").'
    ),
});
export type GenerateImpactStoryInput = z.infer<typeof GenerateImpactStoryInputSchema>;

const GenerateImpactStoryOutputSchema = z.object({
  storyTitle: z.string().describe('A compelling title for the impact story.'),
  storyContent: z
    .string()
    .describe(
      'The narrative impact story, tailored to the target audience and context. The story should be inspiring, highlight the foundation\'s impact, and be tailored in tone and detail level for the specified audience. It should omit specific details like donation amounts or volunteer names unless specifically requested or appropriate for the target audience, as determined by the AI\'s reasoning.'
    ),
  detailsIncluded: z
    .array(z.string())
    .describe(
      'A list of specific types of details the AI decided to include in the story (e.g., "donation_amounts", "volunteer_stories", "geographical_information"). If no such specific types of details were included, list "none".'
    ),
  reasoningForInclusion: z
    .string()
    .describe(
      'A brief explanation of why certain types of details were included or omitted, considering the target audience and context.'
    ),
});
export type GenerateImpactStoryOutput = z.infer<typeof GenerateImpactStoryOutputSchema>;

export async function generateImpactStory(
  input: GenerateImpactStoryInput
): Promise<GenerateImpactStoryOutput> {
  return generateImpactStoryFlow(input);
}

const generateImpactStoryPrompt = ai.definePrompt({
  name: 'generateImpactStoryPrompt',
  input: {schema: GenerateImpactStoryInputSchema},
  output: {schema: GenerateImpactStoryOutputSchema},
  prompt: `You are an AI-powered content creation assistant for the ITLC Foundation, a non-profit organization dedicated to serving humanity, protecting nature, and saving lives. Your task is to generate a compelling narrative impact story based on the provided metrics. The story should be engaging and inspire action or appreciation from the reader.\n\nConsider the following recent impact metrics from the ITLC Foundation:\n- Over {{{mealsDistributed}}}+ Meals Distributed\n- Over {{{treesPlanted}}}+ Trees Planted\n- Over {{{animalsHelped}}}+ Animals Helped\n\nThe story you generate is intended for the following target audience/platform: "{{{targetAudience}}}."\n\nAdditional context or specific instructions for this story: {{#if additionalContext}}{{{additionalContext}}}{{else}}None provided.{{/if}}\n\nBased on the target audience and any additional context, intelligently decide which specific details to include or omit to create the most impactful and appropriate story. For instance:\n- For a "social media caption", keep it concise and focus on a single strong message.\n- For a "donor report", you might include more specific numbers, express deep gratitude to donors, and highlight the direct connection between donations and impact.\n- For a "blog post", you can tell a more detailed narrative, possibly hinting at challenges overcome or future plans.\n- For general public awareness, focus on the broad positive impact without getting too technical or specific.\n\nUnless explicitly requested in the 'additionalContext' or if the 'targetAudience' clearly implies the need, you should generally avoid including:\n- Specific monetary donation amounts from individuals or specific campaign targets.\n- Individual volunteer names or highly personalized stories that might require prior consent.\n- Highly precise geographical locations that could raise privacy concerns or be too niche for the target audience.\n\nYour goal is to craft a story that resonates with the intended audience while upholding the foundation's values of transparency and compassion.\n\nYour output must be a JSON object that strictly conforms to the provided schema. Ensure that the 'storyContent' is a well-written, coherent narrative.`,
});

const generateImpactStoryFlow = ai.defineFlow(
  {
    name: 'generateImpactStoryFlow',
    inputSchema: GenerateImpactStoryInputSchema,
    outputSchema: GenerateImpactStoryOutputSchema,
  },
  async input => {
    const {output} = await generateImpactStoryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate impact story.');
    }
    return output;
  }
);

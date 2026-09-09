'use server';

import { generateImpactStory, GenerateImpactStoryOutput } from '@/ai/flows/generate-impact-story-flow';
import { z } from 'zod';

const formSchema = z.object({
  mealsDistributed: z.coerce.number().min(0, 'Must be a positive number'),
  treesPlanted: z.coerce.number().min(0, 'Must be a positive number'),
  animalsHelped: z.coerce.number().min(0, 'Must be a positive number'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  additionalContext: z.string().optional(),
});

export type FormState = {
  message: string;
  data: GenerateImpactStoryOutput | null;
  issues?: Record<string, string[]>;
  isSuccess: boolean;
};

export async function generateStoryAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Error: Invalid form data.',
      data: null,
      issues: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }
  
  try {
    const result = await generateImpactStory(validatedFields.data);
    return {
      message: 'Story generated successfully!',
      data: result,
      isSuccess: true,
    };
  } catch (error) {
    return {
      message: 'An unexpected error occurred while generating the story. Please try again.',
      data: null,
      isSuccess: false,
    };
  }
}

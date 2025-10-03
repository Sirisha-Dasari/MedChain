'use server';

import { symptomChecker, SymptomCheckerInput } from '@/ai/flows/ai-symptom-checker';
import { z } from 'zod';

const SymptomFormSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please describe your symptoms in more detail.' }),
});

export async function handleSymptomCheck(prevState: any, formData: FormData) {
  const validatedFields = SymptomFormSchema.safeParse({
    symptoms: formData.get('symptoms'),
  });

  if (!validatedFields.success) {
    return {
      advice: 'Error: Please provide a more detailed description of your symptoms.',
    };
  }

  const input: SymptomCheckerInput = {
    symptoms: validatedFields.data.symptoms,
  };

  try {
    const result = await symptomChecker(input);
    return { advice: result.advice };
  } catch (error) {
    console.error('AI symptom checker failed:', error);
    return {
      advice: 'Sorry, I was unable to process your request at this time. Please try again later.',
    };
  }
}

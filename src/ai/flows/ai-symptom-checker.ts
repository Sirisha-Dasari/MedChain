// A symptom checker AI chatbot.
//
// - symptomChecker - A function that provides preliminary guidance based on user-reported symptoms.
// - SymptomCheckerInput - The input type for the symptomChecker function.
// - SymptomCheckerOutput - The return type for the symptomChecker function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the symptoms being experienced.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  advice: z
    .string()
    .describe(
      'Preliminary advice based on the symptoms, including potential health concerns and recommendations on whether to seek professional medical advice.'
    ),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI-powered symptom checker that provides preliminary guidance based on user-reported symptoms.

  Based on the description of symptoms provided, offer potential health concerns and recommendations on whether to seek professional medical advice.
  Symptoms: {{{symptoms}}}`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

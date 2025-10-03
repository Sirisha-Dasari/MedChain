'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleSymptomCheck } from './actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const initialState = {
  advice: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Check Symptoms'
      )}
    </Button>
  );
}

export default function SymptomCheckerClient() {
  const [state, formAction] = useFormState(handleSymptomCheck, initialState);
  
  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="flex items-start gap-4">
            <User className="h-8 w-8 text-primary mt-2" />
            <div className="flex-1 space-y-2">
                <Label htmlFor="symptoms" className="font-semibold">Your Symptoms</Label>
                <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="e.g., 'I have a sore throat, a mild fever, and a headache.'"
                rows={4}
                required
                className="bg-white"
                />
            </div>
        </div>
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>

      {state?.advice && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Bot className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold">Preliminary Advice</p>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{state.advice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

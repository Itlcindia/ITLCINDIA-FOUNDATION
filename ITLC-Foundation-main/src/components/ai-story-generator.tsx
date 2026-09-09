'use client';

import { useFormState } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateStoryAction, type FormState } from '@/app/tool/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Wand2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const initialState: FormState = {
  message: '',
  data: null,
  isSuccess: false,
};

function SubmitButton() {
  // `pending` is not available in useFormState in this React version,
  // so we'll just show a standard button.
  return (
    <Button type="submit" size="lg" className="w-full">
      <Wand2 className="mr-2 h-5 w-5" /> Generate Story
    </Button>
  );
}

export function AIStoryGenerator() {
  const [state, formAction] = useFormState(generateStoryAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if(state.isSuccess) {
        toast({
            title: "Success",
            description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            Create an Impact Story
          </CardTitle>
          <CardDescription>
            Enter your impact metrics, and our AI will craft a compelling
            narrative.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mealsDistributed">Meals Distributed</Label>
                  <Input name="mealsDistributed" id="mealsDistributed" type="number" defaultValue="10000" />
                  {state.issues?.mealsDistributed && <p className="text-sm text-destructive mt-1">{state.issues.mealsDistributed[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="treesPlanted">Trees Planted</Label>
                  <Input name="treesPlanted" id="treesPlanted" type="number" defaultValue="5000" />
                  {state.issues?.treesPlanted && <p className="text-sm text-destructive mt-1">{state.issues.treesPlanted[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="animalsHelped">Animals Helped</Label>
                  <Input name="animalsHelped" id="animalsHelped" type="number" defaultValue="800" />
                   {state.issues?.animalsHelped && <p className="text-sm text-destructive mt-1">{state.issues.animalsHelped[0]}</p>}
                </div>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select name="targetAudience" required defaultValue="blog post">
                <SelectTrigger id="targetAudience">
                  <SelectValue placeholder="Select an audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog post">Blog Post</SelectItem>
                  <SelectItem value="donor report">Donor Report</SelectItem>
                  <SelectItem value="social media caption">
                    Social Media Caption
                  </SelectItem>
                </SelectContent>
              </Select>
               {state.issues?.targetAudience && <p className="text-sm text-destructive mt-1">{state.issues.targetAudience[0]}</p>}
            </div>

            <div>
              <Label htmlFor="additionalContext">Additional Context (Optional)</Label>
              <Textarea
                name="additionalContext"
                id="additionalContext"
                placeholder="e.g., focus on our recent winter campaign, mention the role of volunteers..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-6">
        <h2 className="font-headline text-2xl font-extrabold text-primary">Generated Story</h2>
        {state.data ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-primary">{state.data.storyTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{state.data.storyContent}</p>
              </CardContent>
            </Card>
             <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle className="text-primary">AI Reasoning</AlertTitle>
                <AlertDescription>
                    <p className="font-semibold mt-2">Details Included: <span className="font-normal capitalize">{state.data.detailsIncluded.join(', ')}</span></p>
                    <p className="mt-2">{state.data.reasoningForInclusion}</p>
                </AlertDescription>
            </Alert>
          </>
        ) : (
          <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed h-full">
            <Wand2 className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              Your generated story will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

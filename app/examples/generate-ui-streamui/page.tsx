'use client';

import React, { useState, useCallback } from 'react';
import { Dialog } from '@/components/ui/dialog'; // Shadcn Dialog component
import { Button } from '@/components/ui/button'; // Shadcn Button component
import { generateResponse } from './action'; // Server-side action to generate responses

export default function Page() {
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState<{ question: string; answer: string }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contributions, setContributions] = useState<{ question: string; answer: string }[]>([]);

  const handleGenerateInitial = useCallback(async () => {
    setIsGenerating(true);
    const firstQuestion = 'What is your name?';
    const firstAnswer = await generateResponse(firstQuestion);

    setSteps([{ question: firstQuestion, answer: firstAnswer }]);
    setIsGenerating(false);

    const moreQuestions = ['What is your age?', 'Where do you live?'];
    const promises = moreQuestions.map(async (question) => {
      const answer = await generateResponse(question);
      return { question, answer };
    });

    const newSteps = await Promise.all(promises);
    setSteps((prev) => [...prev, ...newSteps]);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSave = useCallback(() => {
    setContributions((prev) => [...prev, ...steps]);
    setOpen(false);
  }, [steps]);

  const handleOpenDialog = useCallback(() => {
    setOpen(true);
    handleGenerateInitial();
  }, [handleGenerateInitial]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">Generated Questions and Answers</h1>
        
        <Button onClick={handleOpenDialog} variant="default">
          Open Dialog
        </Button>

        <Dialog isOpen={open} onClose={() => setOpen(false)}>
          <h2 className="text-lg font-semibold">Generated Questions and Answers</h2>
          {isGenerating ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div>
                <p className="font-bold">{steps[currentStep]?.question}</p>
                <div>{steps[currentStep]?.answer}</div>
              </div>
              <div className="mt-4 flex justify-between">
                {currentStep > 0 && (
                  <Button onClick={handlePrevious} variant="secondary">
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext} variant="default">
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSave} variant="default">
                    Save
                  </Button>
                )}
              </div>
            </div>
          )}
        </Dialog>

        <div className="mt-4">
          <h2>Generated Contributions</h2>
          <div className="space-y-4">
            {contributions.map((contribution, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-md">
                {contribution.answer}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@/components/ui/dialog'; // Shadcn Dialog component
import { generateResponse } from './action'; // Server-side action to generate responses

export default function Page() {
  const [open, setOpen] = useState(false); // Controls dialog visibility
  const [steps, setSteps] = useState<{ question: string, answer: React.ReactNode }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contributions, setContributions] = useState<React.ReactNode[]>([]);

  // Optimized function to start generating questions
  const handleGenerateInitial = useCallback(async () => {
    setIsGenerating(true);
    const firstQuestion = "What is your name?";
    const firstAnswer = <div>{await generateResponse(firstQuestion)}</div>;

    setSteps([{ question: firstQuestion, answer: firstAnswer }]);
    setIsGenerating(false);

    // Start generating the next steps in the background
    const moreQuestions = ["What is your age?", "Where do you live?"];
    const promises = moreQuestions.map(async (question) => {
      const answer = <div>{await generateResponse(question)}</div>;
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
    setContributions((prev) => [...prev, ...steps.map((step) => step.answer)]);
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
        
        <button
          onClick={handleOpenDialog}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Open Dialog
        </button>

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
                  <button
                    onClick={handlePrevious}
                    className="p-2 bg-gray-200 rounded-md"
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="p-2 bg-blue-500 text-white rounded-md"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="p-2 bg-green-500 text-white rounded-md"
                  >
                    Save
                  </button>
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
                {contribution}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

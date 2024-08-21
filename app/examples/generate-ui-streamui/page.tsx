'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@/components/ui/dialog'; // Shadcn Dialog component
import { Button } from '@/components/ui/button'; // Shadcn Button component
import { generateResponse } from './action'; // Server-side action to generate responses

export default function Page() {
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState<{ question: string; answer: string }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contributions, setContributions] = useState<{ question: string; answer: string }[]>([]);

  // Load questions when the component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      setIsGenerating(true);
      const firstQuestion = 'What is your name and what do you do? Please give a detailed response.';
      const firstAnswer = await generateResponse(firstQuestion);

      setSteps([{ question: firstQuestion, answer: firstAnswer }]);

      const moreQuestions = [
        'Can you describe a challenging project you have worked on recently and how you overcame it?',
        'What are your long-term goals and how do you plan to achieve them?',
      ];
      const promises = moreQuestions.map(async (question) => {
        const answer = await generateResponse(question);
        return { question, answer };
      });

      const newSteps = await Promise.all(promises);
      setSteps((prev) => [...prev, ...newSteps]);
      setIsGenerating(false);
    };

    loadQuestions();
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSave = useCallback(async () => {
    setIsGenerating(true);

    const context = steps.map(step => `${step.question} ${step.answer}`).join(' ');

    const finalQuestion = `Based on the information provided: ${context}, 
                           can you summarize this into a comprehensive profile that highlights strengths, 
                           challenges, and future plans?`;

    const finalAnswer = await generateResponse(finalQuestion);

    setContributions((prev) => [
      ...prev,
      ...steps,
      { question: finalQuestion, answer: finalAnswer }
    ]);

    setIsGenerating(false);
    setOpen(false);
  }, [steps]);

  const handleOpenDialog = useCallback(() => {
    setOpen(true);
  }, []);

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
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291l1.341-1.341C7.167 15.208 6 14.165 6 13v3.291z"
                ></path>
              </svg>
              <span>Loading...</span>
            </div>
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
                  <Button onClick={handleSave} variant="default" disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Save'}
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

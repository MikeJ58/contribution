'use client';

import { useState } from 'react';
import { generateResponse } from './action';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generations, setGenerations] = useState<React.ReactNode[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return; // Prevent empty submissions

    setIsGenerating(true); 

    // Display the user's input immediately
    const userInput = <div className="bg-blue-100 p-4 rounded-md shadow-sm">You: {input}</div>;
    setGenerations(prev => [...prev, userInput]);

    const result = await generateResponse(input);
    
    // Add the AI's response
    setGenerations(prev => [...prev, result]);

    setIsGenerating(false);
    setInput(''); // Clear the input
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">AI Chatbot</h1>
        <div className="space-y-4">
          {generations.map((generation, index) => (
            <div key={index}>
              {generation}
            </div>
          ))}
          {isGenerating && <div className="text-gray-500 italic">Loading...</div>}
        </div>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message here..."
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating} // Disable the button while loading
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use server';

import { openai } from '@ai-sdk/openai';
import { streamUI } from 'ai/rsc';
import React from 'react';

const promptCache: Record<string, string> = {}; // Simple in-memory cache

export async function generateResponse(prompt: string): Promise<string> {
  // Check if the prompt is already cached
  if (promptCache[prompt]) {
    console.log('Returning cached response for:', prompt);
    return promptCache[prompt];
  }

  const result = await streamUI({
    model: openai('gpt-4o'),
    messages: [
      { role: 'system', content: 'Please respond with JSON: {"question": "<question>", "answer": "<answer>"}' },
      { role: 'user', content: prompt },
    ],
    text: async function* ({ content, done }) {
      let jsonResult: { question: string; answer: string } = { question: '', answer: '' };

      try {
        jsonResult = JSON.parse(content);
      } catch (e) {
        jsonResult = { question: 'Error parsing response', answer: content };
      }

      if (done) {
        // Cache the response before returning it
        promptCache[prompt] = jsonResult.answer;
        return jsonResult.answer;
      }

      yield 'Loading...';
    },
  });

  return result.value as string;
}

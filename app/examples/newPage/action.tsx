'use server';

import { openai } from '@ai-sdk/openai';
import { streamUI } from 'ai/rsc';

export async function generateResponse(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt,
    text: async function* ({ content }) {
      yield <div>loading...</div>; // Show this immediately
      return <div>{content}</div>;
    },
  });

  return result.value;
}

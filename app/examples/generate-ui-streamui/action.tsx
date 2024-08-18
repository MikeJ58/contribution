'use server';

import { openai } from '@ai-sdk/openai';
import { streamUI } from 'ai/rsc';
import React from 'react';

export async function generateResponse(prompt: string): Promise<React.ReactNode> {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt,
    text: async function* ({ content }) {
      yield <div>Loading...</div>; // This is optional, depending on how your model streams data
      return <div>{content}</div>;
    },
  });

  return result.value as React.ReactNode;
}

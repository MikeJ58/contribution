"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";

export const streamTextAction = async (userMessage: string) => {
  const result = await streamText({
    model: openai("gpt-3.5-turbo"),  // or "gpt-4" if you want to use GPT-4
    messages: [{ role: "user", content: userMessage }],
    temperature: 0.5,
    maxTokens: 150,  // Adjust as needed for longer responses
  });
  return createStreamableValue(result.textStream).value;
};

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const stream = await streamText({
      model: openai("gpt-4"),
      system: "You are a helpful assistant.",
      messages,
    });
    return stream.toAIStreamResponse();
  } catch (error) {
    console.error("API call error:", error);
    return new Response("Something went wrong. Please try again later.", {
      status: 500,
    });
  }
}

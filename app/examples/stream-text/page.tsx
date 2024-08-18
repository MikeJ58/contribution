"use client";

import { Button } from "@/components/ui/button";
import { streamTextAction } from "./action";
import { useState } from "react";
import { readStreamableValue } from "ai/rsc";

export default function Page() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    setResponse("");  // Clear previous response
    const result = await streamTextAction(input);
    for await (const delta of readStreamableValue(result)) {
      setResponse((prev) => prev + (delta ?? ""));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Chat with AI</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={handleSubmit} className="mt-2">
          Send
        </Button>
      </div>
      <pre className="mt-4 p-4 bg-gray-100 rounded">{response}</pre>
    </div>
  );
}

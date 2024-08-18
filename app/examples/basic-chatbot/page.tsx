"use client";

import { useChat } from "ai/react";
import { useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/save-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (response.ok) {
        alert('Conversation saved successfully!');
      } else {
        alert('Failed to save conversation.');
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      alert('An error occurred while saving the conversation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded ${
              m.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            <span className="font-semibold">
              {m.role === "user" ? "User: " : "AI: "}
            </span>
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Conversation'}
      </button>
    </div>
  );
}

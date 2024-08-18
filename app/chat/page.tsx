"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            {m.role === "user" ? "You: " : "Bot: "}
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

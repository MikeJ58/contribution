'use client';

import { useState } from 'react';
import { generateResponse } from './action';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div>
      <div>
        {isLoading ? <div>Loading...</div> : generation}
      </div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setIsLoading(true); // Set loading state
          const result = await generateResponse(input);
          setGeneration(result);
          setIsLoading(false); // Unset loading state
          setInput('');
        }}
      >
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}

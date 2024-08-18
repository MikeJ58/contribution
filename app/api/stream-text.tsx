import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request received:', req.method);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { input } = req.body;
  console.log('Input received:', input);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4', // Adjust the model as needed
        messages: [{ role: 'user', content: input }],
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error('Error from OpenAI API:', response.statusText);
      return res.status(response.status).json({ error: 'Failed to fetch data from OpenAI' });
    }

    console.log('Streaming response...');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader?.read()!;
      done = readerDone;
      const chunk = decoder.decode(value);
      console.log('Received chunk:', chunk);
      res.write(chunk);
    }

    res.end();
    console.log('Response finished.');
  } catch (error) {
    console.error('Error during streaming:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

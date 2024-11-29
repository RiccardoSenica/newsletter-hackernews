import Anthropic from '@anthropic-ai/sdk';
import { BaseTool } from './tool';

export async function getMessage<T>(text: string, tool: BaseTool) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  console.info('Anthropic request with text: ', text);

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [{ role: 'user', content: text }],
    tools: [tool]
  });

  console.info('Anthropic response: ', response);

  try {
    const data = response.content as [
      { type: string; text: string },
      { type: string; input: object } // object of type V
    ];

    return data[1].input as T;
  } catch (error) {
    throw Error(JSON.stringify(error));
  }
}

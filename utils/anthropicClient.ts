import Anthropic from '@anthropic-ai/sdk';

export async function getMessage(text: string) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  console.log('Anthropic request with text: ', text);

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    messages: [{ role: 'user', content: text }]
  });

  console.log('Anthropic response: ', response);

  return response;
}

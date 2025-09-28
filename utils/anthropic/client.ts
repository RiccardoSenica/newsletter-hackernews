import Anthropic from '@anthropic-ai/sdk';
import { BaseTool, ToolUseBlock } from './tool';

export async function getMessage<T>(text: string, tool: BaseTool) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  console.info('Anthropic request with text: ', text);

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-0',
    max_tokens: 2048,
    messages: [{ role: 'user', content: text }],
    tools: [tool]
  });

  console.info('Anthropic response: ', response);

  try {
    const content = response.content;

    const toolUse = content.find((block): block is ToolUseBlock => block.type === 'tool_use');

    if (!toolUse) {
      throw new Error('No tool_use block found in response');
    }

    return toolUse.input as T;
  } catch (error) {
    throw Error(JSON.stringify(error));
  }
}

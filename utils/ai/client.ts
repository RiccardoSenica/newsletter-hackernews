import { generateText, tool, jsonSchema } from 'ai';
import { BaseTool } from './tool';
import type { JSONSchema7 } from 'json-schema';

export async function getMessage<T>(text: string, baseTool: BaseTool) {
  console.info('Vercel AI Gateway request with text: ', text);

  try {
    const { steps } = await generateText({
      model: 'anthropic/claude-sonnet-4.5',
      temperature: 1,
      tools: {
        [baseTool.name]: tool({
          description: baseTool.input_schema.description || '',
          inputSchema: jsonSchema(baseTool.input_schema as JSONSchema7),
          execute: async args => args
        })
      },
      toolChoice: {
        type: 'tool',
        toolName: baseTool.name
      },
      prompt: text
    });

    console.info('Vercel AI Gateway response steps: ', steps);

    const toolCalls = steps.flatMap(step => step.toolCalls);

    if (!toolCalls || toolCalls.length === 0) {
      throw new Error('No tool calls found in response');
    }

    const typedCall = toolCalls[0] as unknown as {
      toolName: string;
      input: Record<string, unknown>;
    };

    console.info('Tool call input: ', typedCall.input);

    if (typedCall.toolName !== baseTool.name) {
      throw new Error(
        `Expected tool ${baseTool.name} but got ${typedCall.toolName}`
      );
    }

    return typedCall.input as T;
  } catch (error) {
    console.error('Vercel AI Gateway error: ', error);
    throw new Error('Failed to get message from AI Gateway');
  }
}

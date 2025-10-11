export interface BaseTool {
  readonly name: string;
  readonly input_schema: {
    readonly type: 'object';
    readonly properties: Record<string, unknown>;
    readonly required?: readonly string[];
    readonly description?: string;
  };
}

export interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface NewsletterTool {
  title: string;
  content: string;
  focus: string;
}

export const newsletterTool: BaseTool = {
  name: 'NewsletterTool' as const,
  input_schema: {
    type: 'object' as const,
    description: 'Newsletter',
    properties: {
      title: {
        type: 'string' as const,
        description: 'The title of the newsletter'
      },
      content: {
        type: 'string' as const,
        description: 'The main content of the newsletter'
      },
      focus: {
        type: 'string' as const,
        description: 'The text of the focus segment'
      }
    }
  }
} as const;

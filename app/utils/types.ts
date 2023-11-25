import { z } from 'zod';

export const ResponseSchema = z.object({
  message: z.string(),
});

export const SubscribeFormSchema = z.object({
  email: z.string().email(),
  targetingAllowed: z.boolean(),
});

export const UnsubscribeFormSchema = z.object({
  email: z.string().email(),
});

export const NewsSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string().optional(),
  type: z.string(),
  by: z.string(),
  time: z.number(),
  url: z.string().optional(),
  score: z.number(),
});

import { z } from 'zod';

export const ResponseSchema = z.object({
  message: z.string(),
});

export const SubscribeFormSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const ConfirmationSchema = z.object({
  code: z.string(),
});

export const UnsubscribeFormSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const NewsDatabaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string().optional(),
  type: z.string(),
  by: z.string(),
  time: z.number(),
  url: z.string().optional(),
  score: z.number(),
});

export const NewsSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string().nullable(),
  type: z.string(),
  by: z.string(),
  time: z.number(),
  url: z.string().nullable(),
  score: z.number(),
  createdAt: z.date(),
});

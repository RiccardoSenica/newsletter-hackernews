import { z } from 'zod';

export interface ResponseType {
  success: boolean;
  message: string;
}

export const SubscribeFormSchema = z.object({
  email: z.string().email()
});

export type SubscribeFormType = z.infer<typeof SubscribeFormSchema>;

export const ConfirmationSchema = z.object({
  code: z.string()
});

export const UnsubscribeFormSchema = z.object({
  email: z.string().email()
});

export type UnsubscribeFormType = z.infer<typeof UnsubscribeFormSchema>;

export const NewsDatabaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string().optional(),
  type: z.string(),
  by: z.string(),
  time: z.number(),
  url: z.string().optional(),
  score: z.number()
});

export type NewsDatabaseType = z.infer<typeof NewsDatabaseSchema>;

export interface NewsTileType {
  id: number;
  title: string;
  by: string;
}

export interface NewsType extends NewsTileType {
  text: string | null;
  type: string;
  time: number;
  url: string | null;
  score: number;
  createdAt: Date;
}

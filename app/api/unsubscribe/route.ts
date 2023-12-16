import { z } from 'zod';
import UnsubscribeTemplate from '../../../components/emails/unsubscribe';
import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import { sender } from '../../../utils/sender';
import { ResponseSchema, UnsubscribeFormSchema } from '../../../utils/types';

export const dynamic = 'force-dynamic'; // defaults to force-static
export async function POST(request: Request) {
  const body = await request.json();
  const validation = UnsubscribeFormSchema.safeParse(body);
  if (!validation.success) {
    return ApiResponse(400, 'Bad request');
  }

  const { email } = validation.data;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (user && !user.deleted) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        deleted: true
      }
    });

    const sent = await sender([email], UnsubscribeTemplate());

    if (!sent) {
      return ApiResponse(500, 'Internal server error');
    }
  }

  const message: z.infer<typeof ResponseSchema> = {
    message: `${email} unsubscribed.`
  };

  return ApiResponse(200, JSON.stringify(message));
}

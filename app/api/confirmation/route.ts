import { z } from 'zod';
import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import { ConfirmationSchema, ResponseSchema } from '../../../utils/schemas';

export const dynamic = 'force-dynamic'; // defaults to force-static
export async function POST(request: Request) {
  const body = await request.json();
  const validation = ConfirmationSchema.safeParse(body);
  if (!validation.success || !validation.data.code) {
    return ApiResponse(400, 'Bad request');
  }

  const user = await prisma.user.findUnique({
    where: {
      code: validation.data.code
    }
  });

  if (user) {
    await prisma.user.update({
      where: {
        code: validation.data.code
      },
      data: {
        confirmed: true
      }
    });

    const message: z.infer<typeof ResponseSchema> = {
      success: true,
      message: `Thank you for confirming the subscription, ${user.email}!`
    };

    return ApiResponse(200, JSON.stringify(message));
  }

  const message: z.infer<typeof ResponseSchema> = {
    success: false,
    message: `It was not possible to confirm the subscription.`
  };

  return ApiResponse(200, JSON.stringify(message));
}

import { z } from 'zod';
import UnsubscribeTemplate from '../../../components/emails/unsubscribe';
import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import { ResponseSchema, UnsubscribeFormSchema } from '../../../utils/schemas';
import { sender } from '../../../utils/sender';
import {
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '../../../utils/statusCodes';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = UnsubscribeFormSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse(STATUS_BAD_REQUEST, 'Bad request');
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
        return ApiResponse(
          STATUS_INTERNAL_SERVER_ERROR,
          'Internal server error'
        );
      }
    }

    const message: z.infer<typeof ResponseSchema> = {
      success: true,
      message: `${email} unsubscribed.`
    };

    return ApiResponse(STATUS_OK, message);
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}

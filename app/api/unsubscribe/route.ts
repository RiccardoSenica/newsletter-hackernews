import UnsubscribeTemplate from '@components/email/Unsubscribe';
import prisma from '@prisma/prisma';
import { ApiResponse } from '@utils/apiResponse';
import { sender } from '@utils/sender';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '@utils/statusCodes';
import { ResponseType, UnsubscribeFormSchema } from '@utils/validationSchemas';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_KEY || !process.env.RESEND_AUDIENCE) {
      throw new Error('RESEND_AUDIENCE is not set');
    }
    const body = await request.json();
    const validation = UnsubscribeFormSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse(STATUS_BAD_REQUEST, BAD_REQUEST);
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

      const resend = new Resend(process.env.RESEND_KEY);

      await resend.contacts.update({
        id: user.resendId,
        audienceId: process.env.RESEND_AUDIENCE,
        unsubscribed: true
      });

      const sent = await sender([email], UnsubscribeTemplate());

      if (!sent) {
        return ApiResponse(
          STATUS_INTERNAL_SERVER_ERROR,
          'Internal server error'
        );
      }
    }

    const message: ResponseType = {
      success: true,
      message: `${email} unsubscribed.`
    };

    return ApiResponse(STATUS_OK, message);
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
  }
}

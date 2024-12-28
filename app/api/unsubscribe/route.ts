import { UnsubscribeTemplate } from '@components/email/Unsubscribe';
import prisma from '@prisma/prisma';
import { formatApiResponse } from '@utils/formatApiResponse';
import { sendEmailAndTrack } from '@utils/mailing/sendEmailAndTrack';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '@utils/statusCodes';
import { ResponseType, UnsubscribeFormSchema } from '@utils/types';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = UnsubscribeFormSchema.safeParse(body);
    if (!validation.success) {
      return formatApiResponse(STATUS_BAD_REQUEST, BAD_REQUEST);
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

      sendEmailAndTrack(user, UnsubscribeTemplate(), prisma).catch(error => {
        console.error('Failed to send unsubscribe confirmation email:', error);
      });
    }

    const message: ResponseType = {
      success: true,
      message: `${email} unsubscribed.`
    };

    return formatApiResponse(STATUS_OK, message);
  } catch (error) {
    console.error(error);
    return formatApiResponse(
      STATUS_INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  }
}

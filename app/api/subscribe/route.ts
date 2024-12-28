import { ConfirmationTemplate } from '@components/email/Confirmation';
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
import { ResponseType, SubscribeFormSchema } from '@utils/types';
import * as crypto from 'crypto';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = SubscribeFormSchema.safeParse(body);

    if (!validation.success) {
      return formatApiResponse(STATUS_BAD_REQUEST, BAD_REQUEST);
    }

    const { email } = validation.data;

    let user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (user && user.confirmed) {
      if (user.deleted) {
        await prisma.user.update({
          where: {
            email
          },
          data: {
            deleted: false
          }
        });
      }

      const message: ResponseType = {
        success: true,
        message: `Thank you for subscribing!`
      };

      return formatApiResponse(STATUS_OK, message);
    }

    const code = crypto
      .createHash('sha256')
      .update(`${process.env.SECRET_HASH}${email}}`)
      .digest('hex');

    if (user && !user.confirmed) {
      await prisma.user.update({
        where: {
          email
        },
        data: {
          code
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          code
        }
      });
    }

    sendEmailAndTrack(user, ConfirmationTemplate(code), prisma).catch(error => {
      console.error('Failed to send confirmation email:', error);
    });

    const message: ResponseType = {
      success: true,
      message: `Thank you! You will now receive an email to ${email} to confirm the subscription.`
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

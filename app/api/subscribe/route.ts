import ConfirmationTemplate from '@components/email/Confirmation';
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
import { ResponseType, SubscribeFormSchema } from '@utils/validationSchemas';
import * as crypto from 'crypto';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_KEY || !process.env.RESEND_AUDIENCE) {
      throw new Error('RESEND_KEY is not set');
    }

    const body = await request.json();

    const validation = SubscribeFormSchema.safeParse(body);

    if (!validation.success) {
      return ApiResponse(STATUS_BAD_REQUEST, BAD_REQUEST);
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    const resend = new Resend(process.env.RESEND_KEY);

    const code = crypto
      .createHash('sha256')
      .update(`${process.env.SECRET_HASH}${email}}`)
      .digest('hex');

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

        const contact = await resend.contacts.get({
          id: user.resendId,
          audienceId: process.env.RESEND_AUDIENCE
        });

        if (!contact) {
          await resend.contacts.update({
            id: user.resendId,
            audienceId: process.env.RESEND_AUDIENCE,
            unsubscribed: true
          });
        }
      }

      const message: ResponseType = {
        success: true,
        message: `Thank you for subscribing!`
      };

      return ApiResponse(STATUS_OK, message);
    } else if (user && !user.confirmed) {
      await prisma.user.update({
        where: {
          email
        },
        data: {
          code
        }
      });
    } else {
      const contact = await resend.contacts.create({
        email: email,
        audienceId: process.env.RESEND_AUDIENCE,
        unsubscribed: true
      });

      if (!contact.data?.id) {
        throw new Error('Failed to create Resend contact');
      }

      await prisma.user.create({
        data: {
          email,
          code,
          resendId: contact.data.id
        }
      });
    }

    const sent = await sender([email], ConfirmationTemplate(code));

    if (!sent) {
      return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
    }

    const message: ResponseType = {
      success: true,
      message: `Thank you! You will now receive an email to ${email} to confirm the subscription.`
    };

    return ApiResponse(STATUS_OK, message);
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
  }
}

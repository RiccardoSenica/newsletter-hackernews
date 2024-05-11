import * as crypto from 'crypto';
import ConfirmationTemplate from '../../../components/emails/Confirmation';
import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import { sender } from '../../../utils/sender';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '../../../utils/statusCodes';
import {
  ResponseType,
  SubscribeFormSchema
} from '../../../utils/validationSchemas';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = SubscribeFormSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse(STATUS_BAD_REQUEST, BAD_REQUEST);
    }

    const { email } = validation.data;

    const userAlreadyConfirmed = await prisma.user.findUnique({
      where: {
        email,
        confirmed: true
      }
    });

    if (userAlreadyConfirmed) {
      if (userAlreadyConfirmed.deleted) {
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

      return ApiResponse(STATUS_OK, message);
    }

    const code = crypto
      .createHash('sha256')
      .update(`${process.env.SECRET_HASH}${email}}`)
      .digest('hex');

    await prisma.user.upsert({
      create: {
        email,
        code
      },
      update: {
        code
      },
      where: {
        email
      }
    });

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

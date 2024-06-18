import prisma from '@prisma/prisma';
import { ApiResponse } from '@utils/apiResponse';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '@utils/statusCodes';
import { ConfirmationSchema, ResponseType } from '@utils/validationSchemas';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_KEY || !process.env.RESEND_AUDIENCE) {
      throw new Error('RESEND_AUDIENCE is not set');
    }
    const body = await request.json();
    const validation = ConfirmationSchema.safeParse(body);
    if (!validation.success || !validation.data.code) {
      return ApiResponse(STATUS_BAD_REQUEST, BAD_REQUEST);
    }

    const user = await prisma.user.findUnique({
      where: {
        code: validation.data.code
      }
    });

    if (user) {
      const resend = new Resend(process.env.RESEND_KEY);

      await resend.contacts.update({
        id: user.resendId,
        audienceId: process.env.RESEND_AUDIENCE,
        unsubscribed: false
      });

      await prisma.user.update({
        where: {
          code: validation.data.code
        },
        data: {
          confirmed: true
        }
      });

      const message: ResponseType = {
        success: true,
        message: `Thank you for confirming the subscription, ${user.email}!`
      };

      return ApiResponse(STATUS_OK, message);
    }
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
  }
}

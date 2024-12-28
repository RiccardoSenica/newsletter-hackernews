import { UnsubscribeTemplate } from '@components/email/Unsubscribe';
import prisma from '@prisma/prisma';
import { formatApiResponse } from '@utils/formatApiResponse';
import { sender } from '@utils/nodemailer';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '@utils/statusCodes';
import { ResponseType, UnsubscribeFormSchema } from '@utils/validationSchemas';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to force-static

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

      const template = UnsubscribeTemplate();

      const sent = await sender([email], template);

      await prisma.$transaction(async tx => {
        const email = await tx.email.create({
          data: {
            subject: template.subject,
            body: JSON.stringify(template.body)
          }
        });

        await tx.emailUser.create({
          data: {
            userId: user.id,
            emailId: email.id
          }
        });
      });

      if (!sent) {
        return formatApiResponse(
          STATUS_INTERNAL_SERVER_ERROR,
          'Internal server error'
        );
      }
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

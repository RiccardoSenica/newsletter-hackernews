import * as crypto from 'crypto';
import { z } from 'zod';
import SubscribeEmail from '../../../components/emails/subscribe';
import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import { sendEmail } from '../../../utils/sender';
import { ResponseSchema, SubscribeFormSchema } from '../../../utils/types';

export const dynamic = 'force-dynamic'; // defaults to force-static
export async function POST(request: Request) {
  const body = await request.json();
  const validation = SubscribeFormSchema.safeParse(body);
  if (!validation.success) {
    return ApiResponse(400, 'Bad request');
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

    const message: z.infer<typeof ResponseSchema> = {
      message: `Thank you for subscribing!`
    };

    return ApiResponse(200, JSON.stringify(message));
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

  await sendEmail([email], 'Welcome!', SubscribeEmail(code));

  const message: z.infer<typeof ResponseSchema> = {
    message: `Thank you! You will now receive an email to ${email} to confirm the subscription.`
  };

  return ApiResponse(200, JSON.stringify(message));
}

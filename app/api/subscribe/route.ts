import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import prisma from '../../../prisma/prisma';
import { ResponseSchema, SubscribeFormSchema } from '../../utils/types';

export const dynamic = 'force-dynamic'; // defaults to force-static
export async function POST(request: Request) {
  const body = await request.json();
  const validation = SubscribeFormSchema.safeParse(body);
  if (!validation.success) {
    const message = fromZodError(validation.error);
    return new Response(message.message, { status: 400 });
  }

  const { email, targetingAllowed } = validation.data;

  await prisma.user.upsert({
    create: {
      email,
      targetingAllowed
    },
    update: {
      targetingAllowed
    },
    where: {
      email
    }
  });

  const message: z.infer<typeof ResponseSchema> = {
    message: `${email} subscribed!`
  };
  return new Response(JSON.stringify(message), { status: 200 });
}

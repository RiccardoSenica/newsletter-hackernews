import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import prisma from '../../../prisma/prisma';
import { ResponseSchema, UnsubscribeFormSchema } from '../../utils/types';

export const dynamic = 'force-dynamic'; // defaults to force-static
export async function POST(request: Request) {
  const body = await request.json();
  const validation = UnsubscribeFormSchema.safeParse(body);
  if (!validation.success) {
    const message = fromZodError(validation.error);
    return new Response(message.message, { status: 400 });
  }

  const { email } = validation.data;

  try {
    await prisma.user.delete({
      where: {
        email
      }
    });
  } catch (err) {
    console.log(err);
  }

  const message: z.infer<typeof ResponseSchema> = {
    message: `${email} unsubscribe!`
  };
  return new Response(JSON.stringify(message), { status: 200 });
}

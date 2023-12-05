import { NextResponse } from 'next/server';
import { z } from 'zod';
import NewsletterTemplate from '../../../components/emails/newsletter';
import prisma from '../../../prisma/prisma';
import { sendEmail } from '../../../utils/sender';
import { NewsDatabaseSchema, NewsSchema } from '../../../utils/types';
import { singleNews, topNews } from '../../../utils/urls';

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const topstories: number[] = await fetch(topNews).then(res => res.json());

  const newsPromises = topstories
    .splice(0, Number(process.env.NEWS_LIMIT))
    .map(async id => {
      const sourceNews = await fetch(singleNews(id)).then(res => res.json());
      const validation = NewsDatabaseSchema.safeParse(sourceNews);

      if (validation.success) {
        const result = await prisma.news.upsert({
          create: {
            ...validation.data,
            id
          },
          update: {
            ...validation.data
          },
          where: {
            id
          }
        });

        return result;
      }
    });

  const news = await Promise.all(newsPromises);

  const users = await prisma.user.findMany({
    where: {
      email: 'riccardo.s@hey.com',
      confirmed: true,
      deleted: false
    },
    select: {
      email: true
    }
  });

  if (!users) {
    return new NextResponse('No users.', {
      status: 200
    });
  }

  const validRankedNews = news
    .filter((item): item is z.infer<typeof NewsSchema> => item !== undefined)
    .sort((a, b) => b.score - a.score);

  await sendEmail(
    users.map(user => user.email),
    NewsletterTemplate(validRankedNews)
  );

  return new NextResponse(`Newsletter sent to ${users.length} addresses.`, {
    status: 200
  });
}

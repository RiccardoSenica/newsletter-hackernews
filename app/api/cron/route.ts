import { NextResponse } from 'next/server';
import { z } from 'zod';
import NewsletterEmail from '../../../components/emails/newsletter';
import prisma from '../../../prisma/prisma';
import { sendEmail } from '../../../utils/sender';
import { NewsSchema } from '../../../utils/types';
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
      const sourceNews: z.infer<typeof NewsSchema> = await fetch(
        singleNews(id)
      ).then(res => res.json());

      return await prisma.news.upsert({
        create: {
          ...sourceNews,
          id
        },
        update: {
          ...sourceNews
        },
        where: {
          id
        },
        select: {
          id: true
        }
      });
    });

  const newsIds = await Promise.all(newsPromises);

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

  await sendEmail(
    users.map(user => user.email),
    `What's new from Hackernews?`,
    NewsletterEmail(newsIds.map(news => news.id))
  );

  return new NextResponse(`Newsletter sent to ${users.length} addresses.`, {
    status: 200
  });
}

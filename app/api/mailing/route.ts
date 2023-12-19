import { NextResponse } from 'next/server';
import { z } from 'zod';
import NewsletterTemplate from '../../../components/emails/newsletter';
import prisma from '../../../prisma/prisma';
import { NewsSchema } from '../../../utils/schemas';
import { sender } from '../../../utils/sender';

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  // send newsletter to users who didn't get it in the last 23h 50m, assuming a cron job every 10 minutes
  // this is to avoid sending the newsletter to the same users multiple times
  // this is not a perfect solution, but it's good enough for now
  const users = await prisma.user.findMany({
    where: {
      confirmed: true,
      deleted: false,
      OR: [
        {
          lastMail: {
            lt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 10 * 60) // 24h - 10m
          }
        },
        {
          lastMail: null
        }
      ]
    },
    select: {
      id: true,
      email: true
    }
  });

  if (users.length === 0) {
    return new NextResponse('No users.', {
      status: 200
    });
  }

  const news = await prisma.news.findMany({
    where: {
      createdAt: {
        gt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    },
    orderBy: {
      score: 'desc'
    },
    take: 25
  });

  const validRankedNews = news
    .filter((item): item is z.infer<typeof NewsSchema> => item !== undefined)
    .sort((a, b) => b.score - a.score);

  const sent = await sender(
    users.map(user => user.email),
    NewsletterTemplate(validRankedNews)
  );

  if (!sent) {
    return new NextResponse('Internal server error', {
      status: 500
    });
  }

  // update users so they don't get the newsletter again
  await prisma.user.updateMany({
    where: {
      id: {
        in: users.map(user => user.id)
      }
    },
    data: {
      lastMail: new Date()
    }
  });

  return new NextResponse(`Newsletter sent to ${users.length} addresses.`, {
    status: 200
  });
}

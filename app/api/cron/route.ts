import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../prisma/prisma';
import { NewsSchema } from '../../utils/types';
import { singleNews, topNews } from '../../utils/urls';

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const response = await hackernewsApi();

  return new NextResponse(JSON.stringify(response), {
    status: 200
  });
}

async function hackernewsApi() {
  const topstories: number[] = await fetch(topNews).then(res => res.json());

  console.log('topstories', topstories);

  const newsPromises = topstories
    .splice(0, Number(process.env.NEWS_LIMIT))
    .map(async id => {
      console.log('id', id);
      const sourceNews: z.infer<typeof NewsSchema> = await fetch(
        singleNews(id)
      ).then(res => res.json());

      console.log('sourceNews', sourceNews);

      return await prisma.news.upsert({
        create: {
          id,
          title: sourceNews.title,
          text: sourceNews.text,
          type: sourceNews.type,
          by: sourceNews.by,
          time: sourceNews.time,
          url: sourceNews.url,
          score: sourceNews.score
        },
        update: {
          title: sourceNews.title,
          text: sourceNews.text,
          type: sourceNews.type,
          by: sourceNews.by,
          time: sourceNews.time,
          url: sourceNews.url,
          score: sourceNews.score
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

  return newsIds.map(news => news.id);
}

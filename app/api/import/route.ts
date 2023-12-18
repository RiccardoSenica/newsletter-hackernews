import { NextResponse } from 'next/server';
import prisma from '../../../prisma/prisma';
import { NewsDatabaseSchema } from '../../../utils/schemas';
import { singleNews, topNews } from '../../../utils/urls';

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
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

    await Promise.all(newsPromises);

    return new NextResponse(`Imported ${newsPromises.length} news.`, {
      status: 200
    });
  } catch {
    return new NextResponse(`Import failed.`, {
      status: 500
    });
  }
}

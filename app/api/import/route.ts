import prisma from '@prisma/prisma';
import { formatApiResponse } from '@utils/formatApiResponse';
import {
  INTERNAL_SERVER_ERROR,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK,
  STATUS_UNAUTHORIZED
} from '@utils/statusCodes';
import { getSingleNews, getTopNews } from '@utils/urls';
import { NewsDatabaseSchema, NewsDatabaseType } from '@utils/validationSchemas';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return formatApiResponse(STATUS_UNAUTHORIZED, 'Unauthorized');
  }

  try {
    const topStories: number[] = await fetch(getTopNews, {
      cache: 'no-store'
    }).then(res => res.json());

    console.info(`Top stories ids: ${topStories}`);

    const newsPromises = topStories
      .slice(0, Number(process.env.NEWS_LIMIT))
      .map(id => fetch(getSingleNews(id)).then(res => res.json()));

    const news: NewsDatabaseType[] = await Promise.all(newsPromises);

    const upsertPromises = news.map(async getSingleNews => {
      const validation = NewsDatabaseSchema.safeParse(getSingleNews);

      if (validation.success) {
        console.info(
          `Validated news N° ${getSingleNews.id} - ${getSingleNews.title}`
        );
        const result = await prisma.news.upsert({
          create: {
            ...validation.data,
            id: getSingleNews.id
          },
          update: {
            ...validation.data
          },
          where: {
            id: getSingleNews.id
          }
        });

        console.info(
          `Imported N° ${getSingleNews.id} - ${getSingleNews.title}`
        );

        return result;
      } else {
        console.error(validation.error);
      }
    });

    const result = await Promise.all(upsertPromises);

    console.info(`Imported ${result.length} news.`);

    if (process.env.ADMIN_EMAIL && process.env.RESEND_FROM) {
      const resend = new Resend(process.env.RESEND_KEY);

      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: [process.env.ADMIN_EMAIL],
        subject: 'Newsletter: import cron job',
        text: `Imported ${result.length} news out of these ids: ${topStories.join(', ')}.`
      });
    }

    return formatApiResponse(
      STATUS_OK,
      `Imported ${newsPromises.length} news.`
    );
  } catch (error) {
    console.error(error);
    return formatApiResponse(
      STATUS_INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  }
}

import prisma from '@prisma/prisma';
import { ApiResponse } from '@utils/apiResponse';
import {
  INTERNAL_SERVER_ERROR,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK,
  STATUS_UNAUTHORIZED
} from '@utils/statusCodes';
import { singleNews, topNews } from '@utils/urls';
import { NewsDatabaseSchema, NewsDatabaseType } from '@utils/validationSchemas';
import { Resend } from 'resend';

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return ApiResponse(STATUS_UNAUTHORIZED, 'Unauthorized');
  }

  try {
    const topStories: number[] = await fetch(topNews, {
      cache: 'no-store'
    }).then(res => res.json());

    console.info(`Top stories ids: ${topStories}`);

    const newsPromises = topStories
      .slice(0, Number(process.env.NEWS_LIMIT))
      .map(id => fetch(singleNews(id)).then(res => res.json()));

    const news: NewsDatabaseType[] = await Promise.all(newsPromises);

    const upsertPromises = news.map(async singleNews => {
      const validation = NewsDatabaseSchema.safeParse(singleNews);

      if (validation.success) {
        console.info(
          `Validated news N° ${singleNews.id} - ${singleNews.title}`
        );
        const result = await prisma.news.upsert({
          create: {
            ...validation.data,
            id: singleNews.id
          },
          update: {
            ...validation.data
          },
          where: {
            id: singleNews.id
          }
        });

        console.info(`Imported N° ${singleNews.id} - ${singleNews.title}`);

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
        text: `Found these ids ${topStories.join(', ')} and imported ${result.length} of them.`
      });
    }

    return ApiResponse(STATUS_OK, `Imported ${newsPromises.length} news.`);
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
  }
}

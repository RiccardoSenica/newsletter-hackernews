import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import {
  INTERNAL_SERVER_ERROR,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK,
  STATUS_UNAUTHORIZED
} from '../../../utils/statusCodes';
import { singleNews, topNews } from '../../../utils/urls';
import {
  NewsDatabaseSchema,
  NewsDatabaseType
} from '../../../utils/validationSchemas';

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: STATUS_UNAUTHORIZED });
  }

  try {
    const topStories: number[] = await fetch(topNews).then(res => res.json());

    const newsPromises = topStories
      .slice(0, Number(process.env.NEWS_LIMIT))
      .map(id => fetch(singleNews(id)).then(res => res.json()));

    const news: NewsDatabaseType[] = await Promise.all(newsPromises);

    const upsertPromises = news.map(async singleNews => {
      const validation = NewsDatabaseSchema.safeParse(singleNews);

      if (validation.success) {
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

        return result;
      } else {
        console.error(validation.error);
      }
    });

    await Promise.all(upsertPromises);

    return ApiResponse(STATUS_OK, `Imported ${newsPromises.length} news.`);
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
  }
}

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

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return ApiResponse(STATUS_UNAUTHORIZED, 'Unauthorized');
  }

  try {
    const topStories: number[] = await fetch(topNews).then(res => res.json());

    const existingNews = await prisma.news.findMany({
      where: {
        id: {
          in: topStories
        }
      },
      select: {
        id: true
      }
    });

    console.info(
      `Found ${topStories.length} news, of which ${existingNews.length} are already in the database.`
    );

    if (topStories.length === existingNews.length) {
      return ApiResponse(STATUS_OK, `All new news existed already.`);
    }

    const existingNewsIds = existingNews.map(news => news.id);

    const newsToImport = topStories.filter(id => !existingNewsIds.includes(id));

    const newsPromises = newsToImport
      .slice(0, Number(process.env.NEWS_LIMIT))
      .map(id => fetch(singleNews(id)).then(res => res.json()));

    const news: NewsDatabaseType[] = await Promise.all(newsPromises);

    const upsertPromises = news.map(async singleNews => {
      const validation = NewsDatabaseSchema.safeParse(singleNews);

      if (validation.success) {
        console.info(`Importing N° ${singleNews.id} - ${singleNews.title}`);
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

    const result = await Promise.all(upsertPromises);

    console.info(`Imported ${result.length} news.`);

    return ApiResponse(STATUS_OK, `Imported ${newsPromises.length} news.`);
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
  }
}

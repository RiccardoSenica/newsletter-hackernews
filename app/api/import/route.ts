import prisma from '@prisma/prisma';
import axios from 'axios';
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

export async function GET(request: NextRequest) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return formatApiResponse(STATUS_UNAUTHORIZED, 'Unauthorized');
  }

  try {
    const { data: topStories } = await axios.get<number[]>(getTopNews, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });

    console.info(`Top stories ids: ${topStories}`);

    const newsPromises = topStories
      .slice(0, Number(process.env.NEWS_LIMIT))
      .map(id => axios.get<NewsDatabaseType>(getSingleNews(id)));

    const newsResponses = await Promise.all(newsPromises);
    const news: NewsDatabaseType[] = newsResponses.map(
      response => response.data
    );

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

    return formatApiResponse(
      STATUS_OK,
      `Imported ${newsPromises.length} news.`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    return formatApiResponse(
      STATUS_INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  }
}

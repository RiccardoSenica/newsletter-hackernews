import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '../../../utils/statusCodes';
import {
  ConfirmationSchema,
  ResponseType
} from '../../../utils/validationSchemas';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = ConfirmationSchema.safeParse(body);
    if (!validation.success || !validation.data.code) {
      return ApiResponse(STATUS_BAD_REQUEST, BAD_REQUEST);
    }

    const user = await prisma.user.findUnique({
      where: {
        code: validation.data.code
      }
    });

    if (user) {
      await prisma.user.update({
        where: {
          code: validation.data.code
        },
        data: {
          confirmed: true
        }
      });

      const message: ResponseType = {
        success: true,
        message: `Thank you for confirming the subscription, ${user.email}!`
      };

      return ApiResponse(STATUS_OK, message);
    }

    const message: ResponseType = {
      success: false,
      message: `It was not possible to confirm the subscription.`
    };

    return ApiResponse(STATUS_OK, message);
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR);
  }
}

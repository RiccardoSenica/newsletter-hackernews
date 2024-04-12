import { NextResponse } from 'next/server';

export function ApiResponse(status: number, message: unknown) {
  if (!process.env.HOME_URL) {
    throw new Error('HOME_URL is not defined');
  }

  const stringMessage = JSON.stringify(message);
  const response = new NextResponse(stringMessage, { status });
  response.headers.set('Access-Control-Allow-Origin', process.env.HOME_URL);

  return response;
}

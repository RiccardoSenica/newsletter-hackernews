import { NextResponse } from 'next/server';

export function ApiResponse(status: number, message: unknown) {
  const stringMessage = JSON.stringify(message);

  return new NextResponse(stringMessage, { status });
}

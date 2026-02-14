import { successResponse } from '@/lib/errors';

export async function GET() {
  return successResponse({ status: 'ok', timestamp: new Date().toISOString() });
}

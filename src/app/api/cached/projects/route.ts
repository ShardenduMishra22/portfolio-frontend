import { NextResponse } from 'next/server';
import { redis } from '@/util/redis';

export async function GET() {
  const cached = await redis.get('cache:projects');
  if (!cached) {
    return NextResponse.json({ error: 'No cached data' }, { status: 503 });
  }

  return NextResponse.json(JSON.parse(cached));
}

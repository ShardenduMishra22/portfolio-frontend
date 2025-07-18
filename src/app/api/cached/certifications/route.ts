import { redis } from '@/util/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  const cached = await redis.get('cache:certifications');
  if (!cached) {
    return NextResponse.json({ error: 'No cached data' }, { status: 503 });
  }

  return NextResponse.json(JSON.parse(cached));
}

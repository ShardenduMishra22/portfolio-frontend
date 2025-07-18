import { NextRequest } from 'next/server';
import axios from 'axios';

const targets = [
  process.env.BACKEND_1 as string,
  process.env.BACKEND_2 as string,
  process.env.BACKEND_3 as string,
];

let index = 0;

export async function GET(req: NextRequest) {
  return proxy(req);
}

export async function POST(req: NextRequest) {
  return proxy(req);
}

export async function PUT(req: NextRequest) {
  return proxy(req);
}

export async function DELETE(req: NextRequest) {
  return proxy(req);
}

async function proxy(req: NextRequest) {
  const target = targets[index];
  index = (index + 1) % targets.length;

  const url = new URL(req.url);
  const path = url.pathname.replace('/api/proxy', '');
  const fullUrl = `${target}${path}${url.search}`;

  const method = req.method || 'GET';
  const headers = Object.fromEntries(req.headers.entries());
  const body = method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined;

  try {
    const axiosRes = await axios.request({
      method,
      url: fullUrl,
      headers,
      data: body,
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });

    const responseHeaders = new Headers();
    Object.entries(axiosRes.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        responseHeaders.set(key, value);
      } else if (Array.isArray(value)) {
        responseHeaders.set(key, value.join(', '));
      }
    });

    return new Response(axiosRes.data, {
      status: axiosRes.status,
      headers: responseHeaders,
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Backend unreachable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

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

  const fullUrl = target + url.pathname.replace('/api/proxy/projects', '/api/projects') + url.search;

  const method = req.method || 'GET';
  const headers = Object.fromEntries(req.headers.entries());
  const body = method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined;
  const unsafeHeaders = [
    'host',
    'connection',
    'cookie',
    'pragma',
    'referer',
    'x-forwarded-for',
    'x-forwarded-host',
    'x-forwarded-port',
    'x-forwarded-proto',
    'sec-fetch-site',
    'sec-fetch-mode',
    'sec-fetch-dest',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'user-agent',
  ];

  unsafeHeaders.forEach(h => delete headers[h.toLowerCase()]);

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
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Backend unreachable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 
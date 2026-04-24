const CLIENT_INFO = 'https://api.monobank.ua/personal/client-info';
const STATEMENT   = 'https://api.monobank.ua/personal/statement';
const CACHE_TTL   = 60;

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    const corsOrigin = allowed.includes(origin) ? origin : allowed[0] || '*';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(corsOrigin) });
    }
    if (request.method !== 'GET') {
      return json({ error: 'method not allowed' }, 405, corsOrigin);
    }

    const cache = caches.default;
    const cacheKey = new Request(new URL('/balance', request.url).toString(), { method: 'GET' });
    const hit = await cache.match(cacheKey);
    if (hit) return withCors(hit, corsOrigin);

    if (!env.MONO_TOKEN) {
      return json({ error: 'MONO_TOKEN not configured' }, 500, corsOrigin);
    }
    if (!env.JAR_SEND_ID || env.JAR_SEND_ID === 'REPLACE_WITH_SENDID') {
      return json({ error: 'JAR_SEND_ID not configured' }, 500, corsOrigin);
    }

    let info;
    try {
      const r = await fetch(CLIENT_INFO, { headers: { 'X-Token': env.MONO_TOKEN } });
      if (!r.ok) return json({ error: 'client-info', status: r.status }, 502, corsOrigin);
      info = await r.json();
    } catch (e) {
      return json({ error: 'client-info fetch failed' }, 502, corsOrigin);
    }

    const jar = (info.jars || []).find(j => j.sendId === env.JAR_SEND_ID);
    if (!jar) return json({ error: 'jar not found' }, 404, corsOrigin);

    // Statement: count credits (amount > 0) since fundraiser start.
    const startUnix = parseInt(env.START_UNIX || '0', 10) || Math.floor((Date.now() - 90 * 86400 * 1000) / 1000);
    let donors = null;
    let truncated = false;
    try {
      const url = `${STATEMENT}/${jar.id}/${startUnix}`;
      const r = await fetch(url, { headers: { 'X-Token': env.MONO_TOKEN } });
      if (r.ok) {
        const txs = await r.json();
        if (Array.isArray(txs)) {
          donors = txs.filter(t => t.amount > 0).length;
          truncated = txs.length >= 500;
        }
      }
      // On non-ok (e.g. 429 rate limit), leave donors=null — client keeps stale count.
    } catch (e) {
      // swallow — donors stays null
    }

    const body = {
      balance_uah: jar.balance / 100,
      goal_uah: jar.goal / 100,
      title: jar.title,
      donors_count: donors,
      truncated,
      updated_at: Date.now()
    };

    const resp = json(body, 200, corsOrigin, {
      'Cache-Control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`
    });
    ctx.waitUntil(cache.put(cacheKey, resp.clone()));
    return resp;
  }
};

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}
function withCors(resp, origin) {
  const r = new Response(resp.body, resp);
  for (const [k, v] of Object.entries(corsHeaders(origin))) r.headers.set(k, v);
  return r;
}
function json(obj, status, origin, extra = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
      ...extra
    }
  });
}

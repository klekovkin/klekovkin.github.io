const CLIENT_INFO = 'https://api.monobank.ua/personal/client-info';
const STATEMENT   = 'https://api.monobank.ua/personal/statement';
const CACHE_TTL   = 60;
const SEALED_KEY  = 'mono:sealed';
// Monobank caps a single statement request at 31 days + 1 hour, and rate-limits
// the endpoint to 1 req/60s per token. We split donor stats by calendar month:
// past months are sealed once into KV (each range is <31d), and only the current
// month is fetched live on every request. The displayed totals are the sum of
// all sealed months plus the live current month.

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

    // Donor stats are aggregated per calendar month. Months that have fully ended
    // are sealed once into KV; the current month is fetched live each request.
    const startUnix = parseInt(env.START_UNIX || '0', 10) || Math.floor((Date.now() - 90 * 86400 * 1000) / 1000);
    const nowUnix = Math.floor(Date.now() / 1000);

    // 1. Load the sealed ledger ({ months: { "YYYY-MM": {donors,maxMinor,lastAt,truncated} } }).
    let ledger = { months: {} };
    if (env.MONO_KV) {
      try {
        const stored = await env.MONO_KV.get(SEALED_KEY, { type: 'json' });
        if (stored && stored.months) ledger = stored;
      } catch (e) { /* fall back to empty ledger */ }
    }

    // 2. Lazily seal at most one ended-but-unsealed month per request, so we stay
    //    within Monobank's 1 req/60s statement rate limit (current-month fetch is
    //    prioritised below). A pending month is retried on the next cache miss.
    const curKey = monthKey(nowUnix);
    if (env.MONO_KV) {
      const pending = pendingMonths(startUnix, nowUnix, ledger.months, curKey);
      if (pending.length) {
        const { key, from, to } = pending[0];
        const agg = await fetchMonth(jar.id, from, to, env.MONO_TOKEN);
        if (agg) {
          ledger.months[key] = agg;
          try { await env.MONO_KV.put(SEALED_KEY, JSON.stringify(ledger)); } catch (e) { /* retry next time */ }
        }
        // On 429/error agg is null — leave the month unsealed for a later request.
      }
    }

    // 3. Fetch the current month live.
    const curFrom = monthStartUnix(nowUnix);
    const live = await fetchMonth(jar.id, Math.max(startUnix, curFrom), nowUnix, env.MONO_TOKEN);

    // 4. Combine sealed months + live current month into the displayed totals.
    let donors = null, maxMinor = 0, lastTs = 0, truncated = false;
    const parts = Object.values(ledger.months);
    if (live) parts.push(live);
    if (parts.length) {
      donors = 0;
      for (const p of parts) {
        donors += p.donors || 0;
        if ((p.maxMinor || 0) > maxMinor) maxMinor = p.maxMinor;
        if ((p.lastAt || 0) > lastTs) lastTs = p.lastAt;
        if (p.truncated) truncated = true;
      }
    }
    // If the live fetch failed (429) and we have no sealed history, donors stays
    // null so the client keeps its previously displayed count.
    if (donors === 0 && !live && parts.length === 0) donors = null;

    const maxDonationUah = maxMinor ? maxMinor / 100 : null;
    const lastDonationAt = lastTs || null;

    const body = {
      balance_uah: jar.balance / 100,
      goal_uah: jar.goal / 100,
      title: jar.title,
      donors_count: donors,
      max_donation_uah: maxDonationUah,
      last_donation_at: lastDonationAt,
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

// ── Monthly aggregation helpers ───────────────────────────────────────────────

// "YYYY-MM" (UTC) for a Unix-seconds timestamp.
function monthKey(unix) {
  const d = new Date(unix * 1000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

// Unix seconds of the first instant of the UTC month containing `unix`.
function monthStartUnix(unix) {
  const d = new Date(unix * 1000);
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) / 1000);
}

// List of ended (non-current) calendar months between the fundraiser start and
// now that are not yet in the sealed ledger, oldest first. Each entry carries the
// statement range [from, to] for that month (clamped to the fundraiser start).
function pendingMonths(startUnix, nowUnix, sealed, curKey) {
  const out = [];
  let cursor = monthStartUnix(startUnix);
  while (true) {
    const key = monthKey(cursor);
    if (key === curKey) break; // reached the current (live) month
    const d = new Date(cursor * 1000);
    const next = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) / 1000);
    if (next > nowUnix) break; // safety: don't seal a month that hasn't ended
    if (!sealed[key]) {
      out.push({ key, from: Math.max(startUnix, cursor), to: next - 1 });
    }
    cursor = next;
  }
  return out;
}

// Fetch one statement range and aggregate credits (amount > 0). Returns
// { donors, maxMinor, lastAt, truncated } or null on a non-ok response / error.
async function fetchMonth(jarId, from, to, token) {
  try {
    const r = await fetch(`${STATEMENT}/${jarId}/${from}/${to}`, { headers: { 'X-Token': token } });
    if (!r.ok) return null; // 429 rate limit or other — caller leaves it pending
    const txs = await r.json();
    if (!Array.isArray(txs)) return null;
    const credits = txs.filter(t => t.amount > 0);
    let maxMinor = 0, lastAt = 0;
    for (const t of credits) {
      if (t.amount > maxMinor) maxMinor = t.amount;
      if (t.time > lastAt) lastAt = t.time;
    }
    return { donors: credits.length, maxMinor, lastAt, truncated: txs.length >= 500 };
  } catch (e) {
    return null;
  }
}

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

# jar-proxy

Cloudflare Worker that reads the Monobank jar balance with a secret token and exposes one public CORS endpoint for the donate page.

## Account & access

This worker is deployed under **Iurii Klekovkin's Cloudflare account auth by GitHub**. Deploying,
reading logs, rotating secrets, or managing the `MONO_KV` namespace all require
**explicit authorization from Klekovkin on Cloudflare account auth by GitHub** — `wrangler` must be
authenticated against his account (e.g. `wrangler login` with his credentials, or a
scoped API token he issues). No one else can deploy this worker.

The worker domain is fixed:

```
https://jar-proxy.klekovkin.workers.dev/
```

It lives on the **`klekovkin` workers.dev subdomain** (his Cloudflare account's reserved
subdomain). The donate page hard-codes this URL as `MONO_PROXY`, so the name must not
change without updating `donate.html` / `donate-v7.html`.

## Deploy

```bash
cd jar-proxy

# 1. Store the Monobank personal token as an encrypted secret (never committed)
wrangler secret put MONO_TOKEN
# → paste token when prompted, press Enter

# 2. Edit wrangler.toml → set JAR_SEND_ID to the jar's sendId
#    (the XXXXXX in https://send.monobank.ua/jar/XXXXXX)

# 3. Deploy (requires auth against Klekovkin's Cloudflare account — see Account & access)
wrangler deploy
# → prints https://jar-proxy.klekovkin.workers.dev
```

## Response shape

```
GET https://jar-proxy.klekovkin.workers.dev/

200 OK
{
  "balance_uah": 12345.67,
  "goal_uah": 400000,
  "title": "159 ОМБР pickup",
  "donors_count": 42,        // credits across all months since START_UNIX; null if no data yet
  "truncated": false,        // true when any month's statement hit the 500-entry max
  "updated_at": 1713530000000
}
```

Cached 60s at Cloudflare edge; on a cache miss `/personal/client-info` is hit once and
`/personal/statement/{account}/{from}/{to}` at most twice (Monobank's own rate limit is
one request / 60s per endpoint per token).

### Monthly aggregation

Monobank caps each statement request at 31 days + 1 hour and rate-limits the endpoint to
1 req/60s, so the full fundraiser lifetime can't be paged in one invocation. Instead donor
stats are split **per calendar month (UTC)**:

- **Sealed months** — every month that has fully ended is fetched once and its
  `{donors, maxMinor, lastAt, truncated}` aggregate is stored in the `MONO_KV` namespace
  under a single ledger key (`mono:sealed`). Sealing is lazy: a request that notices an
  ended-but-unsealed month seals **one** such month (oldest first), so the cold-start
  backfill spreads across a few cache cycles rather than blowing the rate limit.
- **Current month** — fetched live on every cache miss (range = month start → now).

The response totals are the **sum of all sealed months plus the live current month**:
`donors_count` adds up, `max_donation_uah` is the max, `last_donation_at` is the latest.
This makes the displayed totals correct for the whole fundraiser, not just a trailing
window. KV cost stays in the free tier: ~1 write/month (sealing) and ≤1 read per cache
miss.

Set `START_UNIX` in `wrangler.toml` (Unix seconds) to the fundraiser start — sealing and
the live fetch are both clamped to it, so transactions before it are never counted.

The `MONO_KV` namespace must exist and be bound in `wrangler.toml`:

```bash
wrangler kv namespace create MONO_KV   # prints the id to paste into wrangler.toml
```

## Local dev

```bash
wrangler dev          # runs on localhost:8787, uses local .dev.vars for secrets
```

Create `.dev.vars` (gitignored) with:
```
MONO_TOKEN=your-token-here
```

## Rotate token

```bash
wrangler secret put MONO_TOKEN     # overwrites the existing value
```

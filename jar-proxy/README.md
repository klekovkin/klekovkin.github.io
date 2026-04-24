# jar-proxy

Cloudflare Worker that reads the Monobank jar balance with a secret token and exposes one public CORS endpoint for the donate page.

## Deploy

```bash
cd jar-proxy

# 1. Store the Monobank personal token as an encrypted secret (never committed)
wrangler secret put MONO_TOKEN
# → paste token when prompted, press Enter

# 2. Edit wrangler.toml → set JAR_SEND_ID to the jar's sendId
#    (the XXXXXX in https://send.monobank.ua/jar/XXXXXX)

# 3. Deploy
wrangler deploy
# → prints https://jar-proxy.<your-subdomain>.workers.dev
```

## Response shape

```
GET https://jar-proxy.<you>.workers.dev/

200 OK
{
  "balance_uah": 12345.67,
  "goal_uah": 400000,
  "title": "159 ОМБР pickup",
  "donors_count": 42,        // credit transactions since START_UNIX; null if statement call failed
  "truncated": false,        // true when statement returned the 500-entry max (paging needed)
  "updated_at": 1713530000000
}
```

Cached 60s at Cloudflare edge; Monobank's `/personal/client-info` and
`/personal/statement/{account}/{from}` are each hit at most once per minute per PoP
(Monobank's own rate limit is one request / 60s per endpoint per token).

Configure `START_UNIX` in `wrangler.toml` (Unix seconds) to match the fundraiser start.
Transactions before that are ignored for `donors_count`.

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

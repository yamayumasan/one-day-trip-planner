import type { H3Event } from 'h3'

export function getDb(event: H3Event): D1Database {
  return (event.context.cloudflare as { env: { DB: D1Database } }).env.DB
}

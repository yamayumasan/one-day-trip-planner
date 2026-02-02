import type { H3Event } from 'h3'
import type { User } from '../database/schema'

const SESSION_DURATION_DAYS = 30

export async function createAuthSession(
  db: D1Database,
  userId: string,
): Promise<string> {
  const token = generateSessionToken()
  const tokenHash = await hashToken(token)
  const id = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  await db
    .prepare(
      'INSERT INTO auth_sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
    )
    .bind(id, userId, tokenHash, expiresAt)
    .run()

  return token
}

export async function deleteAuthSession(
  db: D1Database,
  token: string,
): Promise<void> {
  const tokenHash = await hashToken(token)
  await db
    .prepare('DELETE FROM auth_sessions WHERE token_hash = ?')
    .bind(tokenHash)
    .run()
}

export async function getUserFromToken(
  db: D1Database,
  token: string,
): Promise<User | null> {
  const tokenHash = await hashToken(token)
  const now = new Date().toISOString()

  const row = await db
    .prepare(
      `SELECT u.* FROM users u
       INNER JOIN auth_sessions s ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .bind(tokenHash, now)
    .first()

  if (!row) {
    return null
  }

  return mapRowToUser(row)
}

export function getTokenFromEvent(event: H3Event): string | null {
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return getCookie(event, 'auth_token') ?? null
}

export function setAuthCookie(event: H3Event, token: string): void {
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: '/',
  })
}

export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, 'auth_token', {
    path: '/',
  })
}

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function mapRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string | null,
    passwordHash: row.password_hash as string | null,
    displayName: row.display_name as string,
    avatarUrl: row.avatar_url as string | null,
    authProvider: row.auth_provider as User['authProvider'],
    googleId: row.google_id as string | null,
    lineId: row.line_id as string | null,
    freeSessionUsed: row.free_session_used as 0 | 1,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

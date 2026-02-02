import { createAuthSession, setAuthCookie } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { generateId } from '../../../utils/id'
import { AppError } from '../../../utils/errors'

interface LineTokenResponse {
  readonly access_token: string
  readonly id_token: string
  readonly token_type: string
}

interface LineProfile {
  readonly userId: string
  readonly displayName: string
  readonly pictureUrl?: string
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string | undefined
  const state = query.state as string | undefined
  const storedState = getCookie(event, 'oauth_state')

  deleteCookie(event, 'oauth_state', { path: '/' })

  if (!code || !state || state !== storedState) {
    throw new AppError('OAuth認証に失敗しました', 400, 'OAUTH_ERROR')
  }

  const config = useRuntimeConfig()
  const redirectUri = getRequestURL(event).origin + '/api/auth/line/callback'

  const tokenBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: config.lineOauthChannelId,
    client_secret: config.lineOauthChannelSecret,
  })

  const tokenResponse = await $fetch<LineTokenResponse>(
    'https://api.line.me/oauth2/v2.1/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody.toString(),
    },
  )

  const profile = await $fetch<LineProfile>(
    'https://api.line.me/v2/profile',
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    },
  )

  let email: string | null = null
  try {
    const idTokenParts = tokenResponse.id_token.split('.')
    if (idTokenParts[1]) {
      const payload = JSON.parse(atob(idTokenParts[1]))
      email = payload.email ?? null
    }
  } catch {
    // email not available from LINE
  }

  const db = getDb(event)

  const existingByLineId = await db
    .prepare('SELECT * FROM users WHERE line_id = ?')
    .bind(profile.userId)
    .first()

  let userId: string

  if (existingByLineId) {
    userId = existingByLineId.id as string
  } else {
    if (email) {
      const existingByEmail = await db
        .prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first()

      if (existingByEmail) {
        await db
          .prepare('UPDATE users SET line_id = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE id = ?')
          .bind(profile.userId, profile.pictureUrl ?? null, existingByEmail.id)
          .run()
        userId = existingByEmail.id as string
      } else {
        userId = generateId()
        await db
          .prepare(
            `INSERT INTO users (id, email, display_name, avatar_url, auth_provider, line_id)
             VALUES (?, ?, ?, ?, 'line', ?)`,
          )
          .bind(userId, email, profile.displayName, profile.pictureUrl ?? null, profile.userId)
          .run()
      }
    } else {
      userId = generateId()
      await db
        .prepare(
          `INSERT INTO users (id, display_name, avatar_url, auth_provider, line_id)
           VALUES (?, ?, ?, 'line', ?)`,
        )
        .bind(userId, profile.displayName, profile.pictureUrl ?? null, profile.userId)
        .run()
    }
  }

  const token = await createAuthSession(db, userId)
  setAuthCookie(event, token)

  return sendRedirect(event, '/conditions')
})

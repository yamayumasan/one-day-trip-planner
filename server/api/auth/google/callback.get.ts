import { createAuthSession, setAuthCookie } from '../../../utils/auth'
import { getDb } from '../../../utils/db'
import { generateId } from '../../../utils/id'
import { AppError } from '../../../utils/errors'

interface GoogleTokenResponse {
  readonly access_token: string
  readonly id_token: string
  readonly token_type: string
}

interface GoogleUserInfo {
  readonly sub: string
  readonly email: string
  readonly name: string
  readonly picture: string
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
  const redirectUri = getRequestURL(event).origin + '/api/auth/google/callback'

  const tokenResponse = await $fetch<GoogleTokenResponse>(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      body: {
        code,
        client_id: config.googleOauthClientId,
        client_secret: config.googleOauthClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    },
  )

  const userInfo = await $fetch<GoogleUserInfo>(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    },
  )

  const db = getDb(event)

  const existingByGoogleId = await db
    .prepare('SELECT * FROM users WHERE google_id = ?')
    .bind(userInfo.sub)
    .first()

  let userId: string

  if (existingByGoogleId) {
    userId = existingByGoogleId.id as string
  } else {
    const existingByEmail = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(userInfo.email)
      .first()

    if (existingByEmail) {
      await db
        .prepare('UPDATE users SET google_id = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE id = ?')
        .bind(userInfo.sub, userInfo.picture, existingByEmail.id)
        .run()
      userId = existingByEmail.id as string
    } else {
      userId = generateId()
      await db
        .prepare(
          `INSERT INTO users (id, email, display_name, avatar_url, auth_provider, google_id)
           VALUES (?, ?, ?, ?, 'google', ?)`,
        )
        .bind(userId, userInfo.email, userInfo.name, userInfo.picture, userInfo.sub)
        .run()
    }
  }

  const token = await createAuthSession(db, userId)
  setAuthCookie(event, token)

  return sendRedirect(event, '/conditions')
})

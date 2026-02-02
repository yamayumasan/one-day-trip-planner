export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const state = crypto.randomUUID()

  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  const redirectUri = getRequestURL(event).origin + '/api/auth/line/callback'

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.lineOauthChannelId,
    redirect_uri: redirectUri,
    state,
    scope: 'profile openid email',
  })

  return sendRedirect(event, `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`)
})

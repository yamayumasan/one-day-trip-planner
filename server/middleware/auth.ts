import { getTokenFromEvent, getUserFromToken } from '../utils/auth'
import { getDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/google/redirect',
    '/api/auth/google/callback',
    '/api/auth/line/redirect',
    '/api/auth/line/callback',
    '/api/payments/webhook',
  ]

  const isApiRoute = path.startsWith('/api/')
  const isPublicRoute = publicPaths.some(p => path.startsWith(p))

  if (!isApiRoute || isPublicRoute) {
    return
  }

  const token = getTokenFromEvent(event)
  if (!token) {
    return
  }

  const db = getDb(event)
  const user = await getUserFromToken(db, token)

  if (user) {
    event.context.user = user
  }
})

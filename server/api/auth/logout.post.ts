import { getTokenFromEvent, deleteAuthSession, clearAuthCookie } from '../../utils/auth'
import { getDb } from '../../utils/db'
import { requireAuth } from '../../utils/require-auth'
import { successResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const token = getTokenFromEvent(event)
  if (token) {
    const db = getDb(event)
    await deleteAuthSession(db, token)
  }

  clearAuthCookie(event)

  return successResponse({ message: 'ログアウトしました' })
})

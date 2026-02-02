import { requireAuth } from '../../utils/require-auth'
import { successResponse } from '../../utils/response'

export default defineEventHandler((event) => {
  const user = requireAuth(event)

  return successResponse({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      authProvider: user.authProvider,
      freeSessionUsed: user.freeSessionUsed,
    },
  })
})

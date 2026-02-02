import { emailLoginSchema } from '../../utils/validators'
import { verifyPassword } from '../../utils/password'
import { createAuthSession, setAuthCookie } from '../../utils/auth'
import { getDb } from '../../utils/db'
import { successResponse } from '../../utils/response'
import { ValidationError, UnauthorizedError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = emailLoginSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message)
  }

  const { email, password } = parsed.data
  const db = getDb(event)

  const row = await db
    .prepare('SELECT * FROM users WHERE email = ? AND auth_provider = ?')
    .bind(email, 'email')
    .first()

  if (!row) {
    throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
  }

  const passwordHash = row.password_hash as string
  const isValid = await verifyPassword(password, passwordHash)

  if (!isValid) {
    throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
  }

  const token = await createAuthSession(db, row.id as string)
  setAuthCookie(event, token)

  return successResponse({
    user: {
      id: row.id as string,
      email: row.email as string,
      displayName: row.display_name as string,
      authProvider: 'email' as const,
    },
  })
})

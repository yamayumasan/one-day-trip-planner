import { registerSchema } from '../../utils/validators'
import { hashPassword } from '../../utils/password'
import { createAuthSession, setAuthCookie } from '../../utils/auth'
import { getDb } from '../../utils/db'
import { generateId } from '../../utils/id'
import { successResponse, errorResponse } from '../../utils/response'
import { ValidationError, AppError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message)
  }

  const { email, password, displayName } = parsed.data
  const db = getDb(event)

  const existing = await db
    .prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first()

  if (existing) {
    throw new AppError('このメールアドレスは既に登録されています', 409, 'EMAIL_EXISTS')
  }

  const id = generateId()
  const passwordHash = await hashPassword(password)

  await db
    .prepare(
      `INSERT INTO users (id, email, password_hash, display_name, auth_provider)
       VALUES (?, ?, ?, ?, 'email')`,
    )
    .bind(id, email, passwordHash, displayName)
    .run()

  const token = await createAuthSession(db, id)
  setAuthCookie(event, token)

  return successResponse({
    user: {
      id,
      email,
      displayName,
      authProvider: 'email' as const,
    },
  })
})

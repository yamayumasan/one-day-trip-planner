import type { H3Event } from 'h3'
import type { User } from '../database/schema'
import { UnauthorizedError } from './errors'

export function requireAuth(event: H3Event): User {
  const user = event.context.user as User | undefined
  if (!user) {
    throw new UnauthorizedError()
  }
  return user
}

import { GuardError } from './GuardError'
import type { GuardErrorCode } from './GuardErrorCode'

export function createGuardError(
  message: string,
  options?: {
    code?: GuardErrorCode
    cause?: unknown
    meta?: Record<string, unknown>
  }
): GuardError {
  return new GuardError({
    message,
    code: options?.code,
    cause: options?.cause,
    meta: options?.meta,
  })
}
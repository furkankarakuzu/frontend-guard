import { describe, it, expect } from 'vitest'
import { createGuardError } from './createGuardError'
import { GuardError } from './GuardError'

describe('createGuardError', () => {
  describe('basic usage', () => {
    it('creates GuardError with message', () => {
      const error = createGuardError('Something failed')

      expect(error).toBeInstanceOf(GuardError)
      expect(error.message).toBe('Something failed')
    })

    it('defaults code to UNKNOWN', () => {
      const error = createGuardError('Test')

      expect(error.code).toBe('UNKNOWN')
    })
  })

  describe('with options', () => {
    it('passes through code', () => {
      const error = createGuardError('Network failed', { code: 'NETWORK' })

      expect(error.code).toBe('NETWORK')
    })

    it('passes through cause', () => {
      const cause = new Error('Original')
      const error = createGuardError('Wrapped', { cause })

      expect(error.cause).toBe(cause)
    })

    it('passes through meta', () => {
      const meta = { endpoint: '/api/users', method: 'POST' }
      const error = createGuardError('Request failed', { meta })

      expect(error.meta).toEqual(meta)
    })

    it('handles all options together', () => {
      const cause = new Error('Original')
      const meta = { attempt: 3 }

      const error = createGuardError('Retry failed', {
        code: 'TIMEOUT',
        cause,
        meta,
      })

      expect(error.message).toBe('Retry failed')
      expect(error.code).toBe('TIMEOUT')
      expect(error.cause).toBe(cause)
      expect(error.meta).toEqual(meta)
    })
  })

  describe('optional parameters', () => {
    it('accepts empty options object', () => {
      const error = createGuardError('Test', {})

      expect(error.message).toBe('Test')
      expect(error.code).toBe('UNKNOWN')
    })

    it('accepts undefined options', () => {
      const error = createGuardError('Test', undefined)

      expect(error.message).toBe('Test')
    })
  })
})

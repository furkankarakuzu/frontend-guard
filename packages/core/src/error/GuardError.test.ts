import { describe, it, expect } from 'vitest'
import { GuardError } from './GuardError'

describe('GuardError', () => {
  describe('constructor', () => {
    it('sets message correctly', () => {
      const error = new GuardError({ message: 'Test error' })

      expect(error.message).toBe('Test error')
    })

    it('sets name to "GuardError"', () => {
      const error = new GuardError({ message: 'Test' })

      expect(error.name).toBe('GuardError')
    })

    it('defaults code to "UNKNOWN"', () => {
      const error = new GuardError({ message: 'Test' })

      expect(error.code).toBe('UNKNOWN')
    })

    it('preserves provided code', () => {
      const error = new GuardError({ message: 'Test', code: 'NETWORK' })

      expect(error.code).toBe('NETWORK')
    })

    it('preserves cause', () => {
      const cause = new Error('Original')
      const error = new GuardError({ message: 'Wrapped', cause })

      expect(error.cause).toBe(cause)
    })

    it('preserves meta', () => {
      const meta = { userId: 123, action: 'fetch' }
      const error = new GuardError({ message: 'Test', meta })

      expect(error.meta).toEqual(meta)
    })

    it('allows undefined cause', () => {
      const error = new GuardError({ message: 'Test' })

      expect(error.cause).toBeUndefined()
    })

    it('allows undefined meta', () => {
      const error = new GuardError({ message: 'Test' })

      expect(error.meta).toBeUndefined()
    })
  })

  describe('prototype chain', () => {
    it('is instanceof Error', () => {
      const error = new GuardError({ message: 'Test' })

      expect(error).toBeInstanceOf(Error)
    })

    it('is instanceof GuardError', () => {
      const error = new GuardError({ message: 'Test' })

      expect(error).toBeInstanceOf(GuardError)
    })

    it('has correct constructor', () => {
      const error = new GuardError({ message: 'Test' })

      expect(error.constructor).toBe(GuardError)
    })
  })

  describe('toJSON', () => {
    it('returns correct shape', () => {
      const error = new GuardError({
        message: 'Test error',
        code: 'VALIDATION',
        meta: { field: 'email' },
      })

      const json = error.toJSON()

      expect(json).toEqual({
        name: 'GuardError',
        message: 'Test error',
        code: 'VALIDATION',
        meta: { field: 'email' },
      })
    })

    it('excludes cause from JSON', () => {
      const error = new GuardError({
        message: 'Test',
        cause: new Error('Original'),
      })

      const json = error.toJSON()

      expect(json).not.toHaveProperty('cause')
    })

    it('handles undefined meta', () => {
      const error = new GuardError({ message: 'Test' })

      const json = error.toJSON()

      expect(json.meta).toBeUndefined()
    })

    it('is JSON.stringify compatible', () => {
      const error = new GuardError({
        message: 'Test',
        code: 'NETWORK',
        meta: { url: '/api' },
      })

      const stringified = JSON.stringify(error)
      const parsed = JSON.parse(stringified)

      expect(parsed).toEqual({
        name: 'GuardError',
        message: 'Test',
        code: 'NETWORK',
        meta: { url: '/api' },
      })
    })
  })

  describe('all error codes', () => {
    const codes = [
      'UNKNOWN',
      'NETWORK',
      'TIMEOUT',
      'UNAUTHORIZED',
      'FORBIDDEN',
      'NOT_FOUND',
      'VALIDATION',
      'INTERNAL',
    ] as const

    codes.forEach((code) => {
      it(`accepts code "${code}"`, () => {
        const error = new GuardError({ message: 'Test', code })

        expect(error.code).toBe(code)
      })
    })
  })
})

import { describe, it, expect } from 'vitest'
import { normalizeError } from './normalizeError'
import { GuardError } from '../error/GuardError'

describe('normalizeError', () => {
  describe('GuardError passthrough', () => {
    it('returns GuardError unchanged', () => {
      const original = new GuardError({
        message: 'Test error',
        code: 'NETWORK',
        meta: { attempt: 1 },
      })

      const result = normalizeError(original)

      expect(result).toBe(original)
      expect(result.code).toBe('NETWORK')
      expect(result.meta).toEqual({ attempt: 1 })
    })
  })

  describe('Error wrapping', () => {
    it('wraps Error with message preserved', () => {
      const original = new Error('Original message')

      const result = normalizeError(original)

      expect(result).toBeInstanceOf(GuardError)
      expect(result.message).toBe('Original message')
    })

    it('sets cause to original Error', () => {
      const original = new Error('Original error')

      const result = normalizeError(original)

      expect(result.cause).toBe(original)
    })

    it('defaults code to UNKNOWN', () => {
      const result = normalizeError(new Error('test'))

      expect(result.code).toBe('UNKNOWN')
    })
  })

  describe('unknown value handling', () => {
    it('wraps string with "Unknown error" message', () => {
      const result = normalizeError('string error')

      expect(result).toBeInstanceOf(GuardError)
      expect(result.message).toBe('Unknown error')
      expect(result.cause).toBe('string error')
    })

    it('wraps null', () => {
      const result = normalizeError(null)

      expect(result.message).toBe('Unknown error')
      expect(result.cause).toBe(null)
    })

    it('wraps undefined', () => {
      const result = normalizeError(undefined)

      expect(result.message).toBe('Unknown error')
      expect(result.cause).toBe(undefined)
    })

    it('wraps plain object', () => {
      const obj = { error: true, status: 500 }

      const result = normalizeError(obj)

      expect(result.message).toBe('Unknown error')
      expect(result.cause).toEqual(obj)
    })

    it('wraps number', () => {
      const result = normalizeError(404)

      expect(result.message).toBe('Unknown error')
      expect(result.cause).toBe(404)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { guard } from './guard'
import { GuardError } from '../error/GuardError'

describe('guard', () => {
  describe('successful execution', () => {
    it('returns { ok: true, data } for sync function', async () => {
      const result = await guard(() => 42)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toBe(42)
      }
    })

    it('returns { ok: true, data } for async function', async () => {
      const result = await guard(async () => {
        return { id: 1, name: 'test' }
      })

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toEqual({ id: 1, name: 'test' })
      }
    })

    it('handles promise that resolves after delay', async () => {
      const result = await guard(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return 'delayed'
      })

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toBe('delayed')
      }
    })
  })

  describe('error handling', () => {
    it('returns { ok: false, error } when function throws Error', async () => {
      const result = await guard(() => {
        throw new Error('Something went wrong')
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(GuardError)
        expect(result.error.message).toBe('Something went wrong')
        expect(result.error.code).toBe('UNKNOWN')
      }
    })

    it('returns { ok: false, error } when async function rejects', async () => {
      const result = await guard(async () => {
        throw new Error('Async failure')
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('Async failure')
      }
    })

    it('preserves GuardError when thrown directly', async () => {
      const originalError = new GuardError({
        message: 'Custom error',
        code: 'NETWORK',
        meta: { url: '/api/test' },
      })

      const result = await guard(() => {
        throw originalError
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe(originalError)
        expect(result.error.code).toBe('NETWORK')
        expect(result.error.meta).toEqual({ url: '/api/test' })
      }
    })

    it('handles thrown string', async () => {
      const result = await guard(() => {
        throw 'string error'
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(GuardError)
        expect(result.error.message).toBe('Unknown error')
        expect(result.error.cause).toBe('string error')
      }
    })

    it('handles thrown null', async () => {
      const result = await guard(() => {
        throw null
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('Unknown error')
        expect(result.error.cause).toBe(null)
      }
    })

    it('handles thrown undefined', async () => {
      const result = await guard(() => {
        throw undefined
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('Unknown error')
        expect(result.error.cause).toBe(undefined)
      }
    })

    it('handles thrown object', async () => {
      const thrownObject = { code: 500, reason: 'Internal' }
      const result = await guard(() => {
        throw thrownObject
      })

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toBe('Unknown error')
        expect(result.error.cause).toEqual(thrownObject)
      }
    })
  })

  describe('type narrowing', () => {
    it('allows type-safe access after ok check', async () => {
      const result = await guard<{ name: string }>(() => ({ name: 'test' }))

      if (result.ok) {
        // TypeScript should allow this without cast
        const name: string = result.data.name
        expect(name).toBe('test')
      } else {
        // TypeScript should allow this without cast
        const code: string = result.error.code
        expect(code).toBeDefined()
      }
    })
  })
})
